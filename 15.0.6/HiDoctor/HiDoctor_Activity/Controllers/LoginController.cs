using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using HiDoctor_Activity;
using System.Management;
using System.Text;

namespace HiDoctor_Activity.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/
        DataControl.SPData _objData = new DataControl.SPData();
        DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
        DataControl.Data _data = new DataControl.Data();

        string _latitude = "";
        string _longitude = "";
        string _sourceOfEntry = "";
        const string USER_STATUS_VALID = "VALID";

        public ActionResult Index()
        {
            System.Web.HttpContext.Current.Session["Comp_Code"] = null;
            bool isTrue = _objCurInfo.SetCompanyCode();
            if (!isTrue)
            {
                Exception ex = new Exception("Set Company code failure.");
                HandleErrorInfo errorInfo = new HandleErrorInfo(ex, "Login", "Index");
                return View("Error", errorInfo);
            }
            else
            {
                ViewBag.IsGeoNeed = _objCurInfo.GetGeoUrl();
                return View();
            }

        }

        #region publicmethods
        private bool IsAccountLocked(DataSet dsUserInfo)
        {
            bool isTrue = false;
            string privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_ATTEMPTS_TO_LOCK", "0");

            if (Convert.ToUInt16(privValue) > 0)
            {
                if (dsUserInfo.Tables[0].Rows[0]["Is_Account_Locked"].ToString().Trim().ToUpper() == "Y")
                {
                    isTrue = true;
                }
            }

            return isTrue;
        }

        private string LockUserAccount(string companyCode, string userCode, DataSet dsUserInfo)
        {
            string privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_ATTEMPTS_TO_LOCK", "0");
            string returnValue = "Invalid User name or password";
            int privLockCount = Convert.ToUInt16(privValue);
            int pwdFailureCount = 0;

            if (privLockCount > 0)
            {
                if (dsUserInfo.Tables[0].Rows[0]["Is_Account_Locked"].ToString().Trim().ToUpper() == "Y")
                {
                    returnValue = Resources.Password_Policy_Messages.AccountLockNotification;
                }
                else if (dsUserInfo.Tables[0].Rows[0]["Is_Account_Locked"].ToString().Trim().ToUpper() != "Y")
                {
                    if (!string.IsNullOrEmpty(dsUserInfo.Tables[0].Rows[0]["Password_Failure_Count"].ToString().Trim()))
                    {
                        pwdFailureCount = Convert.ToInt16(dsUserInfo.Tables[0].Rows[0]["Password_Failure_Count"].ToString().Trim());
                    }

                    pwdFailureCount++;

                    if (pwdFailureCount >= privLockCount)
                    {
                        _objData.LockUserAccount(companyCode, userCode, pwdFailureCount);
                        //Send mail
                        returnValue = Resources.Password_Policy_Messages.AccountLockNotification;
                    }
                    else
                    {
                        _objData.UpdatePasswordFailureCount(companyCode, userCode, pwdFailureCount);
                    }
                }
            }

            return returnValue;
        }

        private string ReleaseUserAccount(string companyCode, string userCode, DataSet dsUserInfo)
        {
            string privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_LOCK_RELEASE_DURATION", "0");
            string returnValue = Resources.Password_Policy_Messages.LockNotificationwithCorrectCredentials;

            if (!string.IsNullOrEmpty(privValue))
            {
                if (!string.IsNullOrEmpty(dsUserInfo.Tables[0].Rows[0]["Account_Locked_DateTime"].ToString().Trim()))
                {
                    DateTime dtLockedTime = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Account_Locked_DateTime"].ToString().Trim());
                    TimeSpan tsDiff;

                    tsDiff = DateTime.Now - dtLockedTime;

                    if (Convert.ToDouble(tsDiff.TotalMinutes) > Convert.ToDouble(privValue))
                    {
                        _objData.ReleaseUserAccount(companyCode, userCode, "AUTOMATICALLY", userCode, DateTime.Now.ToString());
                        returnValue = string.Empty;
                    }
                }
            }

            return returnValue;
        }

        private void SetGeoLocationDetails()
        {
            string geoUrl = _objCurInfo.GetGeoUrl().Trim().ToUpper();
            string latitude = "NOT_FOUND";
            string longitude = "NOT_FOUND";
            string location = "NOT_FOUND";

            if (geoUrl == "YES")
            {
                latitude = _latitude;
                longitude = _longitude;
                location = GetLocation(latitude, longitude);
            }

            _objCurInfo.SetGeoLocationDetails(latitude, longitude, location);
        }

        private void InsertUserLog(string companyCode, string userCode)
        {
            string sourceOfEntry = _sourceOfEntry;
            string ipAddress = Request.ServerVariables["REMOTE_ADDR"].ToString();
            string loginTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
            string sesionId = _objCurInfo.GetSessionId();
            string latitude = _objCurInfo.GetLattitude();
            string longitude = _objCurInfo.GetLongitude();
            string location = _objCurInfo.GetLocation();
            string loginId = _objCurInfo.GetUserName();

            string userAgent = string.Empty;
            loginId += DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss:fff");
            loginId = loginId.Replace("-", "").Replace(" ", "").Replace(":", "");

            _objData.InsertUserLog(companyCode, userCode, loginId, ipAddress, loginTime, sesionId, sourceOfEntry, latitude, longitude, location, userAgent);
        }

        private bool DoesEmailIdRequired(string companyCode, string userCode, DataSet dsUserInfo)
        {
            bool isTrue = true;

            if (string.IsNullOrEmpty(dsUserInfo.Tables[0].Rows[0]["Email_Id"].ToString().Trim()))
            {
                isTrue = false;
            }

            return isTrue;
        }

        private bool DoesPasswordExpired(string companyCode, string userCode, DataSet dsUserInfo)
        {
            bool isTrue = false;

            string privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_EXPIRY_DAYS", "0");

            if (Convert.ToInt16(privValue) > 0)
            {
                DateTime lastPwdUpdatedDate = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString().Trim());
                TimeSpan tsDiff;

                tsDiff = DateTime.Now.Date - lastPwdUpdatedDate;

                if (tsDiff.Days > Convert.ToInt16(privValue))
                {
                    isTrue = true;
                }
            }

            return isTrue;
        }

        private int GetPwdNotificationDays(string companyCode, string userCode, DataSet dsUserInfo)
        {
            int notificationDays = 0;

            string privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_EXPIRY_NOTIFICATION_DAYS", "0");
            string expiryDays = _objCurInfo.GetPrivilegeValue("PASSWORD_EXPIRY_DAYS", "0");

            if (Convert.ToInt16(privValue) > 0)
            {
                DateTime lastPwdUpdatedDate = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString().Trim());
                TimeSpan tsDiff;

                tsDiff = DateTime.Now.Date - lastPwdUpdatedDate;

                if (tsDiff.Days >= Convert.ToInt16(privValue))
                {
                    if (Convert.ToInt16(expiryDays) > 0)
                    {
                        notificationDays = Convert.ToInt16(expiryDays) - tsDiff.Days + 1;
                    }
                }
            }

            return notificationDays;
        }

        private string RedirectToPage(string companyCode, string passwordPolicy, string userCode, DataSet dsUserInfo)
        {
            _objCurInfo.SetUserInfo(dsUserInfo);
            SetGeoLocationDetails();
            InsertUserLog(companyCode, userCode);
            InsertUserSession();

            string returnValue = "Login is success";
            bool isTrue = false;

            if (passwordPolicy == "YES")
            {
                isTrue = DoesEmailIdRequired(companyCode, userCode, dsUserInfo);
                if (!isTrue)
                {
                    returnValue = "E-mail id is required. Go to my profile screen in web";
                    return returnValue;
                }

                isTrue = DoesPasswordExpired(companyCode, userCode, dsUserInfo);
                if (isTrue)
                {
                    returnValue = "Your password is expired. Go to change password screen in web";
                    return returnValue;
                }

                int count = GetPwdNotificationDays(companyCode, userCode, dsUserInfo);
                if (count > 0)
                {
                    returnValue = Resources.Password_Policy_Messages.PasswordExpNotification;
                    returnValue = returnValue.Replace("@count", count.ToString());
                    returnValue = returnValue.Replace("Do you wish to change the password now?", "Please change the password in change password screen in web. ");
                    return returnValue + "<a href='#' onclick='fnOk()'>ok</a>";
                }
            }

            return returnValue;
        }

        public string GetLogin(FormCollection collection)
        {

            try
            {
                //System.Web.HttpContext.Current.Session["Comp_Code"] = null;
                bool isTrue; //= _objCurInfo.SetCompanyCode();

                //if (!isTrue)
                //{
                //    return "FAILURE:Unable to open database";
                //}

                string companyCode = _objCurInfo.GetCompanyCode();
                string userName = collection["userName"].ToString();
                string password = collection["password"].ToString();
                string userCode = string.Empty;
                string privValue = string.Empty;
                string commonPassword = _objCurInfo.GetCommonPassword();
                string errMsg = string.Empty;
                string isCaseSensitive = "0";
                isTrue = false;
                DataSet dsPrivilege = new DataSet();
                DataSet dsUserInfo = new DataSet();

                _latitude = collection["latitude"].ToString();
                _longitude = collection["longitude"].ToString();
                _sourceOfEntry = collection["sourceOfEntry"].ToString();

                if (_data.OpenConnection(companyCode))
                {
                    dsPrivilege = _objData.GetPrivilegeData(companyCode, userName);
                    _data.CloseConnection();
                }

                if (dsPrivilege != null && dsPrivilege.Tables.Count > 0)
                {
                    _objCurInfo.SetPrivilegeValues(dsPrivilege);

                    privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");

                    if (privValue == "YES") // Password policy privilege is enabled
                    {
                        privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_STRENGTH", "WEAK");
                        if (privValue == "GOOD" || privValue == "STRONG" || privValue == "VERY_STRONG")
                        {
                            isCaseSensitive = "1"; // Password should be case sensitive
                        }
                    }

                    dsUserInfo = _objData.CheckUserAuthentication(companyCode, userName, password, commonPassword, isCaseSensitive);
                    privValue = _objCurInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");

                    if (privValue == "YES") // Password policy privilege is enabled
                    {
                        if (dsUserInfo != null && dsUserInfo.Tables.Count > 0 && dsUserInfo.Tables[0].Rows.Count > 0) // Valid username password
                        {
                            userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString().Trim();

                            if (dsUserInfo.Tables[0].Rows[0]["Status"].ToString().Trim().ToUpper() == USER_STATUS_VALID)
                            {
                                isTrue = IsAccountLocked(dsUserInfo);
                                if (isTrue) // Account is locked
                                {
                                    errMsg = ReleaseUserAccount(companyCode, userCode, dsUserInfo); // Account is released after the grace period

                                    if (errMsg == string.Empty)
                                    {
                                        errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo);
                                    }
                                    else
                                    {
                                        return errMsg; // Still account is locked
                                    }
                                }
                                else
                                {
                                    errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo); // Account is not locked
                                }
                            }
                            else
                            {
                                errMsg = LockUserAccount(companyCode, userCode, dsUserInfo); // Lock user account
                                return errMsg;
                            }
                        }
                        else
                        {
                            errMsg = "Invalid username or password";
                            return errMsg;
                        }
                    }
                    else
                    {
                        if (dsUserInfo != null && dsUserInfo.Tables.Count > 0 && dsUserInfo.Tables[0].Rows.Count > 0) // Valid username password
                        {
                            if (dsUserInfo.Tables[0].Rows[0]["Status"].ToString().Trim().ToUpper() == "VALID")
                            {
                                userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString();
                                errMsg = RedirectToPage(companyCode, "NO", userCode, dsUserInfo);
                            }
                            else
                            {
                                errMsg = "Invalid username or password";
                                return errMsg;
                            }
                        }
                        else
                        {
                            errMsg = "Invalid username or password";
                        }
                    }
                }
                else
                {
                    errMsg = "Invalid username or password";
                }

                return errMsg;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private void SetFormAuthentication(string userCode)
        {
            FormsAuthentication.SetAuthCookie(userCode, true);
        }

        public class MyGeoCodeResponse
        {
            public string status { get; set; }
            public results[] results { get; set; }
        }

        public class results
        {
            public string formatted_address { get; set; }
            public _geometry geometry { get; set; }
            public string[] types { get; set; }
            public _address_component[] address_components { get; set; }
        }

        public class _geometry
        {
            public string location_type { get; set; }
            public _location location { get; set; }
            public _bounds bounds { get; set; }
        }

        public class _location
        {
            public string lat { get; set; }
            public string lng { get; set; }
        }

        public class _bounds
        {
            public _northeast northeast { get; set; }
            public _southwest southwest { get; set; }
        }

        public class _northeast
        {
            public string lat { get; set; }
            public string lng { get; set; }
        }

        public class _southwest
        {
            public string lat { get; set; }
            public string lng { get; set; }
        }

        public class _address_component
        {
            public string long_name { get; set; }
            public string short_name { get; set; }
            public string[] types { get; set; }
        }

        public static string ConnectAPI(string appURL, string strPostData)
        {
            System.Net.WebRequest req = WebRequest.Create(appURL);
            string postData = strPostData;

            byte[] send = System.Text.Encoding.Default.GetBytes(postData);
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded";
            req.ContentLength = send.Length;

            System.IO.Stream sout = req.GetRequestStream();
            sout.Write(send, 0, send.Length);
            sout.Flush();
            sout.Close();

            WebResponse res = req.GetResponse();
            System.IO.StreamReader sr = new System.IO.StreamReader(res.GetResponseStream());
            string returnvalue = sr.ReadToEnd();
            return returnvalue;
        }

        private string GetLocation(string latitude, string longitude)
        {
            try
            {
                Response.Clear();

                string strJSONLocation = ConnectAPI("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                latitude + "," + longitude + "&sensor=true", "");

                JavaScriptSerializer js = new JavaScriptSerializer();
                MyGeoCodeResponse GeoResponse = js.Deserialize<MyGeoCodeResponse>(strJSONLocation);

                return GeoResponse.results[0].formatted_address;
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public bool InsertUserSession()
        {
              DataControl.Data objData = new DataControl.Data();
            try
            {
                string macId = GetMACInformation();
                string ipAddress = Request.ServerVariables["REMOTE_ADDR"].ToString();
                string browserName = Request.Browser.Browser + " " + Request.Browser.MajorVersion.ToString() + "." + Request.Browser.MinorVersion.ToString();
                string companyCode = _objCurInfo.GetCompanyCode();
                string userCode = _objCurInfo.GetUserCode();
                string userName = _objCurInfo.GetUserName();
                string sessionId = _objCurInfo.GetSessionId();
                string latitude = _objCurInfo.GetLattitude();
                string longitude = _objCurInfo.GetLongitude();
                string location = _objCurInfo.GetLocation();
                string loginTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");

                bool isTrue = false;
              

                objData.OpenConnection(_objCurInfo.GetCompanyCode());
                {
                    objData.ExecuteNonQuery("exec sp_sdInsertUserSession '" + _objCurInfo.GetCompanyCode() + "','" + _objCurInfo.GetUserCode() + "','" + _objCurInfo.GetUserName() + "','" + _objCurInfo.GetSessionId() + "','" + loginTime + "','" + ipAddress + "','" + macId + "','" + browserName + "','" + latitude + "','" + longitude + "','" + location + "'");
                }

                return isTrue;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        private string GetMACInformation()
        {
            string strMACID = "";
            ManagementObjectCollection queryCollection = null;
            ManagementScope theScope = null;
            theScope = new ManagementScope("\\\\" + Environment.MachineName + "\\root\\cimv2");

            try
            {
                StringBuilder theQueryBuilder = new StringBuilder();

                theQueryBuilder.Append("SELECT * FROM Win32_NetworkAdapter");

                ObjectQuery theQuery = new ObjectQuery(theQueryBuilder.ToString());

                ManagementObjectSearcher searcher = new ManagementObjectSearcher(theScope, theQuery);

                queryCollection = searcher.Get();

                foreach (ManagementObject mo in queryCollection)
                {
                    if (mo["MacAddress"] != null)
                    {
                        strMACID = mo["MacAddress"].ToString();
                    }
                }
            }

            catch (Exception ex)
            {
                //lblMsg.Text = ex.Message;
            }

            return strMACID;
        }

        #endregion publicmethods

    }
}
