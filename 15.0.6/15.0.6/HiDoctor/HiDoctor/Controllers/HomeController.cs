using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Management;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using ElmahWrapper;
using DataControl;
using System.Configuration;
using System.Collections.Specialized;
using DataControl.Abstraction;
using System.Net.Http;
using System.Security.Cryptography;
using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Formatting;
using System.Xml;
using System.Xml.Serialization;
using System.IO;
using DataControl.Impl;

namespace HiDoctor.Controllers
{
    public class HomeController : Controller
    {
        DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();

        public ActionResult Menu()
        {
            return View();
        }
        public ActionResult Maintenance()
        {
            return View();
        }

        public ActionResult Instruction()
        {
            return View();
        }
        [AjaxSessionActionFilter]
        public ActionResult Help(string pageId, string controlId)
        {
            CurrentInfoController objCurInfo = new CurrentInfoController();
            ViewBag.TEPassword = System.Configuration.ConfigurationManager.AppSettings["TEPassword"].ToString();
            ViewBag.PageId = pageId;
            ViewBag.ControlId = controlId;
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            return View();
        }

        public ActionResult SessionExpiry()
        {
            Session.Abandon();
            Session.RemoveAll();
            return View();

        }
        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Create()
        {
            SessionClear();
            bool isTrue = false;

            try
            {
                if (Request.Cookies["AURA_USERNAME"] != null)
                {
                    ViewBag.USERNAME = Request.Cookies["AURA_USERNAME"].Value;
                }
                else { ViewBag.USERNAME = ""; }
                if (Request.Cookies["AURA_PASSWORD"] != null)
                {
                    ViewBag.PASSWORD = Request.Cookies["AURA_PASSWORD"].Value;
                }
                else { ViewBag.USERNAME = ""; }

                isTrue = _objCurrentInfo.SetCompanyCode();
                ViewBag.CurDate = DateTime.Now.ToString("dd.MM.yyyy");
                ViewBag.IsGeoNeed = _objCurrentInfo.GetGeoUrl();
                ViewBag.SubDomain = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                List<string> CompanMessages = new List<string>();
                DataControl.BLHome blhome = new BLHome();
                CompanMessages = blhome.GetCompanyMessages(ViewBag.SubDomain);
                StringBuilder str = new StringBuilder();
                int i = 0;
                if (CompanMessages.Count() > 0)
                {
                    if (CompanMessages.Count == 1)
                    {
                        str.Append(CompanMessages[0]);
                    }
                    else
                    {
                        foreach (string st in CompanMessages)
                        {
                            i = i + 1;
                            str.Append(st);
                            if (i < CompanMessages.Count)
                            {
                                str.Append(" | ");
                            }
                        }
                    }
                }
                ViewBag.CompanyMessage = str.ToString();

                if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
                {
                    return View("Create.Mobile");
                }
                return View();

            }
            catch (Exception ex)
            {
                HandleErrorInfo errorInfo = new HandleErrorInfo(ex, "Home", "Create" + Request.Url.DnsSafeHost + ";" + Convert.ToString(isTrue));
                ErrorLog.LogError(ex, "Create()");
                return View("Error", errorInfo);
            }
        }

        // GET: /Login/
        string _latitude = "";
        string _longitude = "";
        string _sourceOfEntry = "";
        const string USER_STATUS_VALID = "VALID";

        [HttpPost]
        [AjaxSessionActionFilter]
        public ActionResult Index(FormCollection collection)
        {
            ViewBag.CurDate = DateTime.Now.ToString("dd.MM.yyyy");
            if (collection["IsLogOut"].ToString() == "LOGOUT")
            {
                // update logout time - if the user manualy log out, session is available.
                if (System.Web.HttpContext.Current.Session["Comp_Code"] != null)
                {
                    _objSPData.UpdateLogOutTime(System.Web.HttpContext.Current.Session["Comp_Code"].ToString(), System.Web.HttpContext.Current.Session["User_Code"].ToString(), System.Web.HttpContext.Current.Session["S_Id"].ToString());
                }
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                Response.Cache.SetNoStore();
                SessionClear();

            }
            ViewBag.User_Name = "";
            ViewBag.SubDomain = "";
            ViewBag.UserCode = "";
            ViewBag.IsMenuShow = "";
            ViewBag.CurPage = "";
            ViewBag.Employee_Name = "";
            ViewBag.Cur_User_Email = "";
            return View();

        }



        public ActionResult Index()
        {
            try
            {
                //Check for site maintenance
                string subdomainName = Request.Url.DnsSafeHost.ToString();
                DataControl.BLInfrastructure objBLInfra = new BLInfrastructure();
                bool isSiteMaintained = objBLInfra.SiteMaintenance(subdomainName);


                int queryStringCount = Request.QueryString.Count;
                if (Session["IsPasswordNotify"] != null && Session["IsPasswordNotify"].ToString() == "YES")
                {
                    ViewBag.IsPasswordNotify = "YES";
                }
                else
                {
                    ViewBag.IsPasswordNotify = "NO";
                }
                if (Session["FAQ_Url"] != null && Session[""] != "FAQ_Url")
                {
                    ViewBag.FAQ_Url = Session["FAQ_Url"].ToString().Trim();
                }
                else
                {
                    ViewBag.FAQ_Url = "";
                }

                if (isSiteMaintained && queryStringCount == 0)
                {
                    return View("Maintenance");
                }
                else
                {
                    string queryValue = string.Empty;
                    bool isAutoLogin = false;
                    if (Request.QueryString["a"] != null)
                    {
                        queryValue = Request.QueryString["a"].ToString();
                    }
                    else if (Request.QueryString["ssid"] != null)
                    {
                        queryValue = Request.QueryString["ssid"].ToString();
                        string userNamepassword = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(queryValue));
                        FormCollection collection = new FormCollection();
                        collection.Add("userName", userNamepassword.Split('^')[0]);
                        collection.Add("password", userNamepassword.Split('^')[1]);
                        collection.Add("latitude", "NOT_FOUND");
                        collection.Add("longitude", "NOT_FOUND");
                        collection.Add("sourceOfEntry", "WEB");
                        string msg = GetLogin(collection);
                        if (msg.Contains("SUCCESS"))
                        {
                            isAutoLogin = true;
                        }
                    }
                    else if (queryStringCount > 0)
                    {
                        return View("Maintenance");
                    }


                    if (queryValue == "1" || queryValue == string.Empty || isAutoLogin)
                    {

                        ViewBag.CurDate = DateTime.Now.ToString("dd.MM.yyyy");

                        if (Session["User_Name"] != null)
                        {
                            //To Check URL
                            string subDomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost;
                            DataSet dsCredentials = new DataSet();
                            dsCredentials = _objSPData.GetConnectionString(subDomainName);

                            if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
                            {
                                if (!(System.Web.HttpContext.Current.Session["Comp_Code"].ToString().Trim() == dsCredentials.Tables[0].Rows[0]["CompanyCode"].ToString().Trim()))
                                {
                                    ViewBag.User_Name = "";
                                    System.Web.HttpContext.Current.Session["Comp_Code"] = null;
                                    return View();
                                }

                            }

                            ViewBag.User_Name = Session["Employee_Name"] + "(" + Session["User_Name"] + ")" + Session["User_Type_Name"];
                            ViewBag.SubDomain = _objCurrentInfo.GetSubDomain();
                            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                            ViewBag.UserCode = Session["User_Code"].ToString();
                            ViewBag.Employee_Name = Session["Employee_Name"].ToString();



                            List<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                            DataControl.BLUser objUser = new DataControl.BLUser();
                            lstUser = objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), "").ToList();
                            string emailId = string.Empty;
                            if (lstUser != null && lstUser.Count() > 0)
                            {
                                emailId = lstUser[0].Email_Id;
                            }

                            ViewBag.Cur_User_Email = emailId;
                            ViewBag.User_Type_Category = _objCurrentInfo.GetUserTypeCategory();

                        }
                        else
                        {
                            ViewBag.User_Name = "";
                            ViewBag.SubDomain = "";
                            ViewBag.UserCode = "";
                            ViewBag.CompanyCode = "";
                            ViewBag.Cur_User_Email = "";
                        }

                        if (Session["IsMenuShow"] != null)
                        {
                            ViewBag.IsMenuShow = Session["IsMenuShow"].ToString();
                        }
                        else
                        {
                            ViewBag.IsMenuShow = string.Empty;
                        }
                        if (Session["CurPage"] != null)
                        {
                            ViewBag.CurPage = Session["CurPage"].ToString();
                        }
                        else
                        {
                            ViewBag.CurPage = string.Empty;
                        }

                        if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
                        {
                            return View("Index.Mobile");
                        }

                        return View();
                    }
                    else
                    {
                        return View("Maintenance");
                    }
                }
            }
            catch (Exception ex)
            {
                HandleErrorInfo errorInfo = new HandleErrorInfo(ex, "Home", "Index");
                ErrorLog.LogError(ex, "Index()");
                return View("Error", errorInfo);
            }
        }


        private bool IsAccountLocked(DataSet dsUserInfo)
        {
            bool isTrue = false;
            string privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_ATTEMPTS_TO_LOCK", "0");

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
            int pwdFailureCount = 0;

            string privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_ATTEMPTS_TO_LOCK", "0");
            string privValue1 = _objCurrentInfo.GetPrivilegeValue("PASSWORD_LOCK_RELEASE_DURATION", "30");

            int privLockCount = Convert.ToUInt16(privValue);
            int failureCount = 0;
            if (dsUserInfo.Tables[0].Rows[0]["Password_Failure_Count"] == null)
            {
                failureCount
                      = Convert.ToInt32(pwdFailureCount = Convert.ToInt16(dsUserInfo.Tables[0].Rows[0]["Password_Failure_Count"].ToString().Trim()));
            }


            int cal = failureCount + 1;
            int pendingAttempts = privLockCount - cal;

            string returnValue = "Invalid  password you have" + " " + pendingAttempts + " " + "Attempts Pending ";
            string returnValue0 = "Invalid  password or user Name ";
            string returnValue1 = "Your account has been locked. It will get unlocked after" + " " + privValue1 + " " + "minutes. For immediate assistance, Contact you Head Office ";

            if (privLockCount > 0)
            {
                if (dsUserInfo.Tables[0].Rows[0]["Is_Account_Locked"].ToString().Trim().ToUpper() == "Y")
                {
                    returnValue1 = "Your account has been locked. It will get unlocked after" + " " + privValue1 + " " + "minutes. For immediate assistance, Contact you Head Office ";
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
                        _objSPData.LockUserAccount(companyCode, userCode, pwdFailureCount);
                        //Send mail
                        returnValue1 = "Your account has been locked. It will get unlocked after" + " " + privValue1 + " " + "minutes. For immediate assistance, Contact you Head Office ";
                    }
                    else
                    {
                        _objSPData.UpdatePasswordFailureCount(companyCode, userCode, pwdFailureCount);
                    }
                }
            }
            if (pwdFailureCount >= privLockCount && privLockCount != 0)
            {
                return returnValue1;
            }
            else
            {
                if (privLockCount > 0)
                {
                    return returnValue;
                }
                else
                    return returnValue0;
            }


        }

        private string ReleaseUserAccount(string companyCode, string userCode, DataSet dsUserInfo)
        {
            string privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_LOCK_RELEASE_DURATION", "0");
            string returnValue = "Your account has been locked. It will get unlocked after" + " " + privValue + " " + "minutes. For immediate assistance, Contact you Head Office ";

            if (!string.IsNullOrEmpty(privValue))
            {
                if (!string.IsNullOrEmpty(dsUserInfo.Tables[0].Rows[0]["Account_Locked_DateTime"].ToString().Trim()))
                {
                    DateTime dtLockedTime = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Account_Locked_DateTime"].ToString().Trim());
                    TimeSpan tsDiff;

                    tsDiff = DateTime.Now - dtLockedTime;

                    if (Convert.ToDouble(tsDiff.TotalMinutes) > Convert.ToDouble(privValue))
                    {
                        _objSPData.ReleaseUserAccount(companyCode, userCode, "AUTOMATICALLY", userCode, DateTime.Now.ToString());
                        returnValue = string.Empty;
                    }
                }
            }

            return returnValue;
        }

        private void SetGeoLocationDetails()
        {
            string geoUrl = _objCurrentInfo.GetGeoUrl().Trim().ToUpper();
            string latitude = "NOT_FOUND";
            string longitude = "NOT_FOUND";
            string location = "NOT_FOUND";

            if (geoUrl == "YES")
            {
                latitude = _latitude;
                longitude = _longitude;
                location = GetLocation(latitude, longitude);
            }

            _objCurrentInfo.SetGeoLocationDetails(latitude, longitude, location);
        }

        private void InsertUserLog(string companyCode, string userCode, string userAgent)
        {
            string sourceOfEntry = _sourceOfEntry;
            string ipAddress = Request.ServerVariables["REMOTE_ADDR"].ToString();

            string loginTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
            string sesionId = _objCurrentInfo.GetSessionId();
            string latitude = _objCurrentInfo.GetLattitude();
            string longitude = _objCurrentInfo.GetLongitude();
            string location = _objCurrentInfo.GetLocation();
            string loginId = _objCurrentInfo.GetUserName();

            loginId += DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss:fff");
            loginId = loginId.Replace("-", "").Replace(" ", "").Replace(":", "");

            _objSPData.InsertUserLog(companyCode, userCode, loginId, ipAddress, loginTime, sesionId, sourceOfEntry,
                latitude, longitude, location, userAgent);
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

            string privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_EXPIRY_DAYS", "0");

            if (Convert.ToInt16(privValue) > 0)
            {

                if (string.IsNullOrEmpty(dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString()))
                {
                    DateTime lastPwdUpdatedDate = Convert.ToDateTime("1900-01-01");
                    TimeSpan tsDiff;

                    tsDiff = DateTime.Now.Date - lastPwdUpdatedDate.Date;

                    if (tsDiff.Days - 1 >= Convert.ToInt16(privValue))
                    {
                        isTrue = true;
                    }
                }
                else
                {
                    DateTime lastPwdUpdatedDate = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString().Trim());
                    TimeSpan tsDiff;

                    tsDiff = DateTime.Now.Date - lastPwdUpdatedDate.Date;

                    if ((tsDiff.Days - 1) >= Convert.ToInt16(privValue))
                    {
                        isTrue = true;
                    }
                }

            }

            return isTrue;
        }

        private int GetPwdNotificationDays(string companyCode, string userCode, DataSet dsUserInfo)
        {
            int notificationDays = 0;
            TimeSpan notificationCount;

            string privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_EXPIRY_NOTIFICATION_DAYS", "0");
            string expiryDays = _objCurrentInfo.GetPrivilegeValue("PASSWORD_EXPIRY_DAYS", "0");

            if (Convert.ToInt16(privValue) > 0)
            {
                DateTime lastPwdUpdatedDate = Convert.ToDateTime(dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString().Trim());

                int exDay = 0;
                int PrivDay = 0;
                Int32.TryParse(expiryDays, out exDay);
                Int32.TryParse(privValue, out PrivDay);
                DateTime currentDate = DateTime.Now.Date;
                DateTime passExpDate = lastPwdUpdatedDate.Date.AddDays((exDay + 1));
                DateTime notificationStart = passExpDate.Date.AddDays(-PrivDay);
                //TimeSpan noticifactionCount;
                if (currentDate.Date >= notificationStart.Date && currentDate.Date < passExpDate.Date)
                {
                    notificationCount = passExpDate.Date - currentDate.Date;
                    notificationDays = notificationCount.Days;
                }
            }
            return notificationDays;
        }

        private string RedirectToPage(string companyCode, string passwordPolicy, string userCode,
            DataSet dsUserInfo, string password, string userAgent, string onBoard)
        {
            _objCurrentInfo.SetUserInfo(dsUserInfo);
            SetGeoLocationDetails();
            InsertUserLog(companyCode, userCode, userAgent);
            InsertUserSession();
            string commonPassword = _objCurrentInfo.GetCommonPassword();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();

            List<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
            DataControl.BLUser objUser = new DataControl.BLUser();
            lstUser = objUser.GetSingleUserInfo(companyCode, userCode, "").ToList();
            string emailId = string.Empty;
            string subdomainName = string.Empty;
            // string dcrapproval = string.Empty;
            subdomainName = _objCurrentInfo.GetSubDomain();
            if (lstUser != null && lstUser.Count() > 0)
            {
                emailId = lstUser[0].Email_Id;
            }
            ViewBag.SubDomain = subdomainName;
            ViewBag.Cur_User_Email = emailId;

            string Notification = string.Empty;
            string returnValue = "SUCCESS";
            string strUrl = string.Empty;
            bool isTrue = false;
            string managerApprovalPri = string.Empty;

            isTrue = DoesEmailIdRequired(companyCode, userCode, dsUserInfo);
            if (!isTrue)
            {
                if (_sourceOfEntry == "MOBILE")
                {
                    returnValue = "E-mail id is required. Go to my profile screen in web";
                    return returnValue;

                }
            }
            string lastUpdDate = string.Empty;
            lastUpdDate = dsUserInfo.Tables[0].Rows[0]["Last_Password_Updated_Date"].ToString().Trim();
            if (passwordPolicy == "YES")
            {
                if (lastUpdDate != "" && password != commonPassword)
                {
                    int count = GetPwdNotificationDays(companyCode, userCode, dsUserInfo);
                    if (count > 0)
                    {
                        if (_sourceOfEntry == "MOBILE")
                        {
                            returnValue = Resources.Password_Policy_Messages.PasswordExpNotification;
                            returnValue = returnValue.Replace("@count", count.ToString());
                            returnValue = returnValue.Replace("Do you wish to change the password now?", "Please change the password in change password screen in web. ");
                            return returnValue + "<a href='#' onclick='fnOk()'>ok</a>";
                        }
                        else
                        {
                            //Added for password expiry notification days

                            returnValue = Resources.Password_Policy_Messages.PasswordExpNotification;
                            returnValue = returnValue.Replace("@count", count.ToString()).Replace(".", ". <br />").ToString();
                            returnValue += "<a href='#' onclick='fnChangePassword()'> ok </a>";
                            Notification = "SUCCESS";
                            Session["IsPasswordNotify"] = "YES";
                        }
                    }
                    isTrue = DoesPasswordExpired(companyCode, userCode, dsUserInfo);
                    if (isTrue)
                    {
                        if (_sourceOfEntry == "MOBILE")
                        {
                            returnValue = "Your password is expired. Go to change password screen in web";
                            return returnValue;
                        }
                        else
                        {
                            Session["IsMenuShow"] = "NO";
                            Session["CurPage"] = "CHANGEPASSWORD/CHANGEPASSWORD/PASSWORDEXPIRED";

                            ViewBag.IsMenuShow = "NO";
                            ViewBag.CurPage = "CHANGEPASSWORD/CHANGEPASSWORD";

                            if (string.IsNullOrEmpty(strUrl)) { strUrl = "CHANGEPASSWORD/CHANGEPASSWORD/RO"; };
                        }
                    }
                }

            }

            if (_sourceOfEntry == "WEB")
            {
                if (passwordPolicy == "YES")
                {
                    string privValue = _objCurrentInfo.GetPrivilegeValue("CHANGE_FIRSTTIME_PASSWORD", "NO");
                    if (privValue == "YES" && lastUpdDate == "" && password != commonPassword)
                    //Last Updated pass = null it should redirect
                    {
                        Session["IsMenuShow"] = "NO";
                        Session["CurPage"] = "CHANGEPASSWORD/CHANGEPASSWORD/R";

                        ViewBag.IsMenuShow = "NO";
                        ViewBag.CurPage = "CHANGEPASSWORD/CHANGEPASSWORD/R";

                        strUrl = "CHANGEPASSWORD/CHANGEPASSWORD/R";
                    }
                }
                else
                {
                    if (lastUpdDate == "" && password != commonPassword)
                    //Last Updated pass = null it should redirect
                    {
                        Session["IsMenuShow"] = "NO";
                        Session["CurPage"] = "CHANGEPASSWORD/CHANGEPASSWORD/R";

                        ViewBag.IsMenuShow = "NO";
                        ViewBag.CurPage = "CHANGEPASSWORD/CHANGEPASSWORD/R";

                        strUrl = "CHANGEPASSWORD/CHANGEPASSWORD/R";
                    }
                }
                if (string.IsNullOrEmpty(strUrl))
                {
                    string accessUrl = _objCurrentInfo.GetPrivilegeValue("LANDING_PAGE_URL", "");
                    if (!string.IsNullOrEmpty(accessUrl))
                    {
                        DataControl.BLHome objHome = new BLHome();
                        int count = objHome.CheckMenuAccess(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserTypeCode(), accessUrl);
                        if (count > 0)
                        {
                            strUrl = accessUrl;
                        }
                    }
                }
                if (string.IsNullOrEmpty(strUrl))
                {
                    strUrl = "DashboardLandingPage/Index";
                }
            }
            string welNote = Session["Employee_Name"].ToString() + "(" + Session["User_Name"].ToString() + ")" + "," + Session["User_Type_Name"].ToString();
            return returnValue + ":" + welNote + "~" + strUrl + "^" + Session["User_Code"].ToString() + "*" + Notification;
        }

        public string GetLogin(FormCollection collection)
        {

            try

            {
                //System.Web.HttpContext.Current.Session["Comp_Code"] = null;
                bool isTrue; //= _objCurrentInfo.SetCompanyCode();

                bool isCompTrue = true;
                string errMsg = string.Empty;
                string HDNGGlobalVar = string.Empty;

                if (System.Web.HttpContext.Current.Session["Comp_Code"] == null)
                {
                    isCompTrue = _objCurrentInfo.SetCompanyCode();
                }

                if (isCompTrue)
                {
                    string companyCode = _objCurrentInfo.GetCompanyCode();
                    string userName = collection["userName"].ToString();
                    string password = collection["password"].ToString();
                    string userCode = string.Empty;
                    string privValue = string.Empty;
                    string commonPassword = _objCurrentInfo.GetCommonPassword();

                    string isCaseSensitive = "0";
                    string actualPwd = string.Empty;
                    isTrue = false;
                    DataSet dsPrivilege = new DataSet();
                    DataSet dsUserInfo = new DataSet();
                    DataSet dsHDUserAccess = new DataSet();

                    _latitude = collection["latitude"].ToString();
                    _longitude = collection["longitude"].ToString();
                    _sourceOfEntry = collection["sourceOfEntry"].ToString();

                    if (collection["RememberMe"] != null)
                    {
                        string rememberMe = collection["RememberMe"].ToString();

                        if (rememberMe == "1")
                        {
                            Response.Cookies["AURA_USERNAME"].Value = userName.Trim();
                            Response.Cookies["AURA_USERNAME"].Expires = DateTime.Now.AddMonths(1);
                            Response.Cookies["AURA_PASSWORD"].Value = password.Trim();
                            Response.Cookies["AURA_PASSWORD"].Expires = DateTime.Now.AddMonths(1);
                        }
                        else
                        {
                            Response.Cookies["AURA_USERNAME"].Expires = DateTime.Now.AddMonths(-1);
                            Response.Cookies["AURA_PASSWORD"].Expires = DateTime.Now.AddMonths(-1);
                        }
                    }

                    if (_objData.OpenConnection(companyCode))
                    {
                        dsHDUserAccess = _objSPData.GetHiDoctorUserAccess(companyCode, userName);
                    }

                    if (dsHDUserAccess != null && dsHDUserAccess.Tables.Count > 0)
                    {
                        if (dsHDUserAccess.Tables[0].Rows.Count > 0)
                        {
                            if (dsHDUserAccess.Tables[0].Rows[0]["Is_Web_Access"].ToString() == "1")
                            {
                                if (_objData.OpenConnection(companyCode))
                                {
                                    dsPrivilege = _objSPData.GetPrivilegeData(companyCode, userName);
                                    _objData.CloseConnection();
                                }

                                if (dsPrivilege != null && dsPrivilege.Tables.Count > 0)
                                {
                                    _objCurrentInfo.SetPrivilegeValues(dsPrivilege);

                                    privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");

                                    if (privValue == "YES") // Password policy privilege is enabled
                                    {
                                        privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_STRENGTH", "WEAK");
                                        if (privValue == "GOOD" || privValue == "STRONG" || privValue == "VERY_STRONG")
                                        {
                                            isCaseSensitive = "1"; // Password should be case sensitive
                                        }
                                    }

                                    dsUserInfo = _objSPData.CheckUserAuthentication(companyCode, userName, password, commonPassword, isCaseSensitive);

                                    bool isUrl = false;
                                    isUrl = true;
                                    privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");
                                    string userAgent = collection["UA"] != null ? collection["UA"].ToString() : "NA";
                                    string subDomainName = "";
                                    if (isUrl == true)
                                    {
                                        subDomainName = _objCurrentInfo.GetSubDomain();
                                    }
                                    if (privValue == "YES") // Password policy privilege is enabled
                                    {
                                        if (dsUserInfo != null && dsUserInfo.Tables.Count > 0 && dsUserInfo.Tables[0].Rows.Count > 0) // Valid username password
                                        {
                                            if (dsUserInfo.Tables[0].Rows[0]["Status"].ToString().Trim().ToUpper() == USER_STATUS_VALID)
                                            {
                                                userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString();
                                                actualPwd = dsUserInfo.Tables[0].Rows[0]["User_Pass"].ToString().Trim();
                                                isTrue = IsAccountLocked(dsUserInfo);
                                                if (isTrue) // Account is locked
                                                {
                                                    errMsg = ReleaseUserAccount(companyCode, userCode, dsUserInfo); // Account is released after the grace period

                                                    if (errMsg == string.Empty)
                                                    {
                                                        errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo, password, userAgent, subDomainName);
                                                    }
                                                    else
                                                    {
                                                        return errMsg; // Still account is locked
                                                    }
                                                }
                                                else
                                                {
                                                    //Every time we update the Password_Failure_Count for last failure count
                                                    int pwdFailureCount = 0;
                                                    pwdFailureCount = 0;
                                                    _objSPData.UpdatePasswordFailureCount(companyCode, userCode, pwdFailureCount);
                                                    errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo, password, userAgent, subDomainName); // Account is not locked
                                                }
                                            }
                                            else
                                            {
                                                userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString();
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
                                                actualPwd = dsUserInfo.Tables[0].Rows[0]["User_Pass"].ToString().Trim();
                                                errMsg = RedirectToPage(companyCode, "NO", userCode, dsUserInfo, password, userAgent, subDomainName);
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
                                    HDNGGlobalVar = "$$$$$" + _objCurrentInfo.GetUserTypeCategory();
                                }
                                else
                                {
                                    errMsg = "Invalid username or password";
                                }
                            }
                            else
                            {
                                //errMsg = "Make sure you have entered correct URL."
                                errMsg = "You don't have access to hidoctor WEB,Please contact our support team (support@swaas.net or +91-9025407475)" + "^" + "$";
                            }
                        }
                        else
                        {
                            if (_objData.OpenConnection(companyCode))
                            {
                                dsPrivilege = _objSPData.GetPrivilegeData(companyCode, userName);
                            }

                            if (dsPrivilege != null && dsPrivilege.Tables.Count > 0)
                            {
                                _objCurrentInfo.SetPrivilegeValues(dsPrivilege);

                                privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");

                                if (privValue == "YES") // Password policy privilege is enabled
                                {
                                    privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_STRENGTH", "WEAK");
                                    if (privValue == "GOOD" || privValue == "STRONG" || privValue == "VERY_STRONG")
                                    {
                                        isCaseSensitive = "1"; // Password should be case sensitive
                                    }
                                }

                                dsUserInfo = _objSPData.CheckUserAuthentication(companyCode, userName, password, commonPassword, isCaseSensitive);

                                bool isUrl = false;
                                isUrl = true;
                                privValue = _objCurrentInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");
                                string userAgent = collection["UA"] != null ? collection["UA"].ToString() : "NA";
                                string subDomainName = "";
                                if (isUrl == true)
                                {
                                    subDomainName = _objCurrentInfo.GetSubDomain();
                                }
                                if (privValue == "YES") // Password policy privilege is enabled
                                {
                                    if (dsUserInfo != null && dsUserInfo.Tables.Count > 0 && dsUserInfo.Tables[0].Rows.Count > 0) // Valid username password
                                    {
                                        if (dsUserInfo.Tables[0].Rows[0]["Status"].ToString().Trim().ToUpper() == USER_STATUS_VALID)
                                        {
                                            userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString();
                                            actualPwd = dsUserInfo.Tables[0].Rows[0]["User_Pass"].ToString().Trim();
                                            isTrue = IsAccountLocked(dsUserInfo);
                                            if (isTrue) // Account is locked
                                            {
                                                errMsg = ReleaseUserAccount(companyCode, userCode, dsUserInfo); // Account is released after the grace period

                                                if (errMsg == string.Empty)
                                                {
                                                    errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo, password, userAgent, subDomainName);
                                                }
                                                else
                                                {
                                                    return errMsg; // Still account is locked
                                                }
                                            }
                                            else
                                            {
                                                //Every time we update the Password_Failure_Count for last failure count
                                                int pwdFailureCount = 0;
                                                pwdFailureCount = 0;
                                                _objSPData.UpdatePasswordFailureCount(companyCode, userCode, pwdFailureCount);
                                                errMsg = RedirectToPage(companyCode, "YES", userCode, dsUserInfo, password, userAgent, subDomainName); // Account is not locked
                                            }
                                        }
                                        else
                                        {
                                            userCode = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString();
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
                                            actualPwd = dsUserInfo.Tables[0].Rows[0]["User_Pass"].ToString().Trim();
                                            errMsg = RedirectToPage(companyCode, "NO", userCode, dsUserInfo, password, userAgent, subDomainName);
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
                                HDNGGlobalVar = "$$$$$" + _objCurrentInfo.GetUserTypeCategory();
                            }  ///////////////////////////
                            else
                            {
                                errMsg = "Invalid username or password";
                            }
                        }
                    }
                    else
                    {
                        errMsg = "You don't have access to hidoctor WEB,Please contact our support team (support@swaas.net or +91-9025407475)" + "^" + "$";
                    }
                }
                return errMsg + "^" + HDNGGlobalVar;
            }
            catch (Exception ex)
            {
                throw ex;
                ErrorLog.LogError(ex, "GetLogin()");
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

            using (System.IO.Stream sout = req.GetRequestStream())
            {
                sout.Write(send, 0, send.Length);
                sout.Flush();
                //   sout.Close();
            }
            string returnvalue = string.Empty;
            WebResponse res = req.GetResponse();
            using (System.IO.StreamReader sr = new System.IO.StreamReader(res.GetResponseStream()))
            {
                returnvalue = sr.ReadToEnd();
            }
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
                ErrorLog.LogError(ex, "GetLocation()");
                return "";
            }
        }

        public bool InsertUserSession()
        {
            try
            {
                string macId = GetMACInformation();
                string ipAddress = Request.ServerVariables["REMOTE_ADDR"].ToString();
                string browserName = Request.Browser.Browser + " " + Request.Browser.MajorVersion.ToString() + "." + Request.Browser.MinorVersion.ToString();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string userCode = _objCurrentInfo.GetUserCode();
                string userName = _objCurrentInfo.GetUserName();
                string sessionId = _objCurrentInfo.GetSessionId();
                string latitude = _objCurrentInfo.GetLattitude();
                string longitude = _objCurrentInfo.GetLongitude();
                string location = _objCurrentInfo.GetLocation();
                string loginTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");

                bool isTrue = false;


                _objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    _objData.ExecuteNonQuery("exec sp_sdInsertUserSession '" + _objCurrentInfo.GetCompanyCode() + "','" + _objCurrentInfo.GetUserCode() + "','" + _objCurrentInfo.GetUserName() + "','" + _objCurrentInfo.GetSessionId() + "','" + loginTime + "','" + ipAddress + "','" + macId + "','" + browserName + "','" + latitude + "','" + longitude + "','" + location + "'");
                }

                return isTrue;
            }
            finally
            {
                _objData.CloseConnection();
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
                throw ex;
            }

            return strMACID;
        }

        public JsonResult GetMenuContent(FormCollection collection)
        {
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            DataControl.Data _objData = new DataControl.Data();
            DataSet ds = new DataSet();
            string LoggedInCompCode = _objCurrentInfo.GetCompanyCode();
            string LoggedInUserTypeCode = Session["User_Type_Code"].ToString();
            try
            {
                _objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetMenuByUserType '" + LoggedInCompCode + "','" + LoggedInUserTypeCode + "'");
                }
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        [AjaxSessionActionFilter]
        public ActionResult SFAWA(string id)
        {
            long elapsedTicks = (DateTime.Now).Ticks - (Convert.ToDateTime(_objCurrentInfo.GetSFAWA_ClickTime()).Ticks);
            TimeSpan elapsedTimeSpan = new TimeSpan(elapsedTicks);
            int sfawaSessionTimedOut = Convert.ToInt32(ConfigurationManager.AppSettings["SFAWASessionTimedout"].ToString());
            if (elapsedTimeSpan.Hours == 0 && elapsedTimeSpan.Minutes < sfawaSessionTimedOut)
            {
                ViewBag.UserCode = _objCurrentInfo.GetUserCode(); //Session["User_Code"].ToString();
                ViewBag.SessionId = _objCurrentInfo.GetSessionId(); //Session["S_Id"].ToString();
                ViewBag.CompCode = _objCurrentInfo.GetCompanyCode(); //Session["Comp_Code"].ToString();
                ViewBag.MenuId = id;
                ViewBag.SFAWAURL = _objCurrentInfo.GetSFAWAUrl(); //Session["SFAWA_URL"].ToString();
                return View();
            }
            else
            {
                Response.StatusCode = 590;
                return null;
            }
        }

        public string CheckSalesDrive()
        {
            string isSD = "NO";
            if (!string.IsNullOrEmpty(_objCurrentInfo.GetSalesDriveUrl()))
            {
                if (Session["User_Name"].ToString().Trim().ToUpper() == "ADMINISTRATOR" || Session["User_Name"].ToString().Trim().ToUpper() == "MASTER")
                {
                    isSD = "NO";
                }
                else
                {
                    MasterController objMaster = new MasterController();
                    DataSet dsDepot = objMaster.GetMappedDepots();
                    if (dsDepot.Tables.Count > 0 && dsDepot.Tables[0].Rows.Count > 0)
                    {
                        if (dsDepot.Tables[0].Rows.Count == 1)
                        {
                            isSD = GetSalesDriveUrl();
                        }
                        else if (dsDepot.Tables[0].Rows.Count > 1)
                        {
                            isSD = "YES";
                        }
                        else
                        {
                            isSD = "NO";
                        }
                    }
                }
            }
            return isSD;
        }
        public string GetSalesDriveUrl()
        {
            string salesDriveUrl = string.Empty;
            try
            {
                string SDUrl = _objCurrentInfo.GetSalesDriveUrl();
                if (!string.IsNullOrEmpty(SDUrl))
                {
                    salesDriveUrl = "" + SDUrl + "?User_Code=" + Session["User_Code"].ToString() + "&Comp_Code=" + Session["Comp_Code"].ToString() + "&Session_Id=" + Session["S_Id"].ToString() + "&Return_URL=" + Request.Url.Authority + "";
                }
                return salesDriveUrl;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetSalesDriveUrl()");
                return salesDriveUrl;
            }
        }

        public JsonResult GetSelectedDoctors(FormCollection collection)
        {
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            DataControl.SPData _objData = new DataControl.SPData();
            DataSet ds = new DataSet();
            try
            {
                ds = _objData.GetSelectedDoctors(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode() + "^", _objCurrentInfo.GetRegionCode(), "", "");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetRegionAndUserInfo()
        {
            return _objCurrentInfo.GetUserCode() + "_" + _objCurrentInfo.GetRegionCode();
        }

        public JsonResult GetChildRegions(FormCollection collection)
        {
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                DataControl.Data _objData = new DataControl.Data();
                DataSet ds = new DataSet();
                try
                {
                    _objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    {
                        ds = _objData.ExecuteDataSet("EXEC SP_hdGetChildRegions '" + _objCurrentInfo.GetCompanyCode() + "','" + _objCurrentInfo.GetRegionCode() + "'");
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetReportName(FormCollection collection)
        {
            try
            {
                string serachChar = collection["SearchText"].ToString();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                DataControl.Data _objData = new DataControl.Data();
                DataSet ds = new DataSet();
                try
                {
                    _objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    {
                        ds = _objData.ExecuteDataSet("EXEC sp_hdGetReportMenuName '" + _objCurrentInfo.GetCompanyCode() + "','" + _objCurrentInfo.GetUserTypeCode() + "','" + serachChar.Trim() + "'");
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #region help
        public string InsertHelpItems(FormCollection coll)
        {
            try
            {
                string result = "N";
                string error = string.Empty;
                BALHelp objBALHelp = new BALHelp();

                string pageId = coll["PageId"].ToString();
                string controlId = coll["ControlId"].ToString();
                string helpDescrption = coll["HelpDescrip"].ToString();
                helpDescrption = helpDescrption.Replace("grt", ">").Replace("lst", "<").Replace("~", "&");

                if (objBALHelp.InsertHelpDescription(pageId, controlId, controlId, helpDescrption, out error))
                {
                    result = "Y";
                }
                else
                {
                    result = error;
                }
                return result;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public JsonResult GetHelpItems(FormCollection coll)
        {
            try
            {
                JSONConverter json = new JSONConverter();
                BALHelp objBALHelp = new BALHelp();

                string error = string.Empty;

                string pageId = coll["PageId"].ToString();
                string controlId = coll["ControlId"].ToString();

                DataSet dsHelp = objBALHelp.GetHelpDescription(pageId, controlId, out error);
                if (dsHelp != null)
                {
                    return Json(json.Serialize(dsHelp), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(json.Serialize(error), JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        #endregion help

        #region Home Page
        public ActionResult Home()
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
            DataControl.BLUser objUser = new DataControl.BLUser();
            lstUser = objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), "").ToList();
            string emailId = string.Empty;
            if (lstUser != null && lstUser.Count() > 0)
            {
                emailId = lstUser[0].Email_Id;
            }

            ViewBag.Cur_User_Email = emailId;

            return View();
        }

        public JsonResult GetLogo(string UserCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstDivision = null;
            DataControl.BLUser objUser = new DataControl.BLUser();
            lstDivision = objUser.GetLogo(_objCurrentInfo.GetCompanyCode(), UserCode).ToList();
            return Json(lstDivision, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// get the home page announcements
        /// </summary>
        /// <returns>return the home page announcement content</returns>
        public string GetHomePageNotification()
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            int i = 0;
            try
            {
                IEnumerable<MVCModels.NoticeBoardContentModel> lstNotice = null;
                lstNotice = objHome.GetHomePageNotification(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                if (lstNotice != null)
                {
                    foreach (var dr in lstNotice)
                    {
                        i++;
                        strContent.Append("<div class='anounce' onclick='fnGoToNotificationScreen()'>");
                        strContent.Append("<div class='anounce_icon'></div>");
                        strContent.Append("<div class='sender_name'>" + dr.Employee_Name + "(" + dr.User_Name + ") </div>");
                        if (Convert.ToString(dr.Title).Length <= 25)
                        {
                            strContent.Append("<div class='subject'><span class='totalCol'>Sub:</span> " + dr.Title + "</div>");
                        }
                        else
                        {
                            strContent.Append("<div class='subject'><span class='totalCol'>Sub:</span> " + Convert.ToString(dr.Title).Substring(0, 24) + "..." + "</div>");
                        }
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.FilePath)))
                        {
                            strContent.Append("<div class='attachment'></div>");
                        }
                        strContent.Append("</div>");
                    }
                }
                else
                {
                    strContent.Clear();
                    strContent.Append("<div class='no_notice'>No Unread Notifications</div>");
                }
                if (i == 0)
                {
                    strContent.Clear();
                    strContent.Append("<div class='no_notice'>No Unread Notifications</div>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return strContent.ToString();
        }

        /// <summary>
        /// Get the home page messages
        /// </summary>
        /// <returns> returns the message content of the logged in user</returns>
        public string GetHomePageMessages()
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            int i = 0;
            try
            {
                IEnumerable<MVCModels.NoticeBoardContentMSGModel> lstNotice = null;
                lstNotice = objHome.GetHomePageMessages(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                if (lstNotice != null)
                {
                    foreach (var dr in lstNotice)
                    {
                        i++;
                        strContent.Append("<div class='messages' onclick='fnGoToMessageScreen()'><div class='unread_message'></div>");
                        strContent.Append("<div class='sender_name_msg'>" + dr.Employee_Name + "(" + dr.User_Name + ")" + "</div>");

                        if (Convert.ToString(dr.Attachment_Path1).Trim().Length > 0
                            || Convert.ToString(dr.Attachment_Path2).Trim().Length > 0
                            || Convert.ToString(dr.Attachment_Path3).Trim().Length > 0
                            || Convert.ToString(dr.Attachment_Path4).Trim().Length > 0
                            || Convert.ToString(dr.Attachment_Path5).Trim().Length > 0)
                        {
                            strContent.Append("<div class='attachment'></div>");
                        }
                        if (Convert.ToString(dr.Subject).Length <= 25)
                        {
                            strContent.Append("<div class='subject_message'><span class='totalCol'>Sub:</span> " + dr.Subject + "</div>");
                        }
                        else
                        {
                            strContent.Append("<div class='subject_message'><span class='totalCol'>Sub:</span> "
                               + Convert.ToString(dr.Subject).Substring(0, 24) + "..." + "</div>");
                        }
                        strContent.Append("<div class='date_message'>" + dr.Date_From + "</div></div>");
                    }
                }
                else
                {
                    strContent.Clear();
                    strContent.Append("<div class='no_notice'>No Unread Messages</div>");
                }
                if (i == 0)
                {
                    strContent.Clear();
                    strContent.Append("<div class='no_notice'>No Unread Messages</div>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return strContent.ToString();
        }

        /// <summary>
        /// Get the Home page meeting point of the logged in user
        /// </summary>
        /// <returns>returns the home page meeting point content</returns>
        public string GetHomePageMeetingPoint()
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            try
            {
                IEnumerable<MVCModels.TourPlannerModel> lstTP = null;
                lstTP = objHome.GetHomePageMeetingPoint(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                List<MVCModels.TourPlannerModel> lstTourPlan = new List<MVCModels.TourPlannerModel>(lstTP);
                if (lstTourPlan.Count > 0)
                {
                    strContent.Append("<table class='table table-striped'>");
                    strContent.Append("<tr>");
                    strContent.Append("<td style='font-weight:bold'>Meeting Point</td>");
                    strContent.Append("<td style='font-weight:bold'>Time</td>");
                    strContent.Append("<td style='font-weight:bold'>Whom I am going to meet?</td>");
                    strContent.Append("</tr>");

                    strContent.Append("<tr>");
                    strContent.Append("<td>" + lstTourPlan[0].Meeting_Point + "</td>");
                    strContent.Append("<td>" + lstTourPlan[0].Meeting_Time + "</td>");
                    strContent.Append("<td>");
                    if (!string.IsNullOrEmpty(Convert.ToString(lstTourPlan[0].Accomp_Name)))
                    {
                        strContent.Append(Convert.ToString(lstTourPlan[0].Accomp_Name));
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString(lstTourPlan[0].Accompanist2_Name)))
                    {
                        strContent.Append("," + Convert.ToString(lstTourPlan[0].Accompanist2_Name));
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString(lstTourPlan[0].Accompanist3_Name)))
                    {
                        strContent.Append(Convert.ToString(lstTourPlan[0].Accompanist3_Name));
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString(lstTourPlan[0].Accompanist4_Name)))
                    {
                        strContent.Append("," + Convert.ToString(lstTourPlan[0].Accompanist4_Name));
                    }
                    strContent.Append("</td></tr></table>");
                }
                else
                {
                    strContent.Clear();
                    strContent.Append("<span>Not yet planned</span>");
                }
                IEnumerable<MVCModels.TourPlannerModel> lstChildTP = null;
                lstChildTP = objHome.GetHomePageChildUserMeetingPoint(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                if (lstChildTP != null)
                {
                    strContent.Append("<table class='table table-striped'>");
                    strContent.Append("<tr>");
                    strContent.Append("<td style='font-weight:bold'>Accompanist Name</td>");
                    strContent.Append("<td style='font-weight:bold'>Meeting Point</td>");
                    strContent.Append("<td style='font-weight:bold'>Meeting time</td>");
                    strContent.Append("</tr>");
                    foreach (var child in lstChildTP)
                    {
                        strContent.Append("<tr>");
                        strContent.Append("<td>" + Convert.ToString(child.User_Name) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(child.Meeting_Point) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(child.Meeting_Time) + "</td>");
                        strContent.Append("</tr>");
                    }
                    strContent.Append("</table>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return strContent.ToString();
        }

        ///// <summary>
        ///// Get the home page birthday alert of the logged in user region
        ///// </summary>
        ///// <returns>returns the logged in user customers birthday</returns>
        //public string GetHomePageBirthdayAlert()
        //{
        //    StringBuilder strContent = new StringBuilder();
        //    CurrentInfo objCurInfo = new CurrentInfo();
        //    DataControl.BLHome objHome = new DataControl.BLHome();
        //    try
        //    {
        //        IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = null;
        //        List<MVCModels.User_UserMasterModel> lstchildUsers = new List<MVCModels.User_UserMasterModel>();
        //        lstchildUsers = objHome.GetChildUserCount(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();

        //        int count = objHome.GetDoctorCount(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
        //        if (count > 0)
        //        {
        //            lstDoctor = objHome.GetHomePageBirthdayAlert(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
        //            if (lstDoctor != null)
        //            {
        //                int i = 0;
        //                strContent.Append("<table class='table table-striped'>");
        //                strContent.Append("<tr>");
        //                strContent.Append("<td style='font-weight:bold'>Doctor Name</td>");
        //                strContent.Append("<td style='font-weight:bold'>Date</td>");
        //                strContent.Append("</tr>");

        //                foreach (var doctor in lstDoctor)
        //                {
        //                    i++;
        //                    strContent.Append("<tr>");
        //                    strContent.Append("<td>" + doctor.Customer_Name + "|");
        //                    strContent.Append(doctor.MDL_Number + "|");
        //                    strContent.Append(doctor.Category_Name + "|");
        //                    strContent.Append(doctor.Speciality_Name + "</td>");
        //                    strContent.Append("<td>" + doctor.DOB + "</td>");
        //                    strContent.Append("</tr>");
        //                }
        //                strContent.Append("</table>");
        //                if (i == 0)
        //                {
        //                    strContent.Clear();
        //                    strContent.Append("<span>No records found</span>");
        //                }
        //            }
        //            else
        //            {
        //                strContent.Clear();
        //                strContent.Append("<span>No records found</span>");
        //            }
        //            if (lstchildUsers != null && lstchildUsers.Count > 0)
        //            {
        //                strContent.Append("<br>");
        //                strContent.Append("<a style='text-decoration:underline;text-align:center;cursor:pointer;color:#79b7e7;font-style:italic;font-weight:bold;' onclick=\"fnGetChildUserDoctorsBdayAlert('" + _objCurrentInfo.GetRegionCode() + "');\">Show Team's Doctor-Birthdays</a>");
        //            }
        //        }
        //        else
        //        {
        //            strContent.Clear();
        //            strContent.Append("<span>No Upcoming Birthdays</span>");
        //            if (lstchildUsers != null && lstchildUsers.Count > 0)
        //            {
        //                strContent.Append("<br>");
        //                strContent.Append("<a style='text-decoration:underline;text-align:center;cursor:pointer;color:#79b7e7;font-style:italic;font-weight:bold;' onclick=\"fnGetChildUserDoctorsBdayAlert('" + _objCurrentInfo.GetRegionCode() + "');\">Show Team's Doctor-Birthdays</a>");
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicObj = new Dictionary<string, string>();
        //        dicObj.Add("strContent", strContent.ToString());
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
        //        return null;
        //    }
        //    return strContent.ToString();
        //}
        /// <summary>
        /// Get Birthday Alert for child users
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetBirthdayAlertforChildUsers(string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DateTime currentdate = DateTime.Now;
            DataControl.BLHome objHome = new DataControl.BLHome();
            // string currentdate = DateTime.Now.ToString("yyyy-MM-dd");
            List<MVCModels.HiDoctor_Master.DoctorModel> lstBirthdayalerts = new List<MVCModels.HiDoctor_Master.DoctorModel>();

            lstBirthdayalerts = objHome.GetBirthdayAlertforChildUser(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode()).ToList();
            var lstDoctorsCode = lstBirthdayalerts.Select(s => s.Customer_Code).Distinct().ToList();
            if (lstBirthdayalerts != null && lstBirthdayalerts.Count > 0)
            {
                if (lstDoctorsCode.Count > 0)
                {
                    strTbl.Append("<div style='width:100%;font-style:italic;font-weight:bold;'>If there are different birthday dates recorded in different regions for the same doctor, all the dates will be shown. Past dates will be shown in red color.</div>");
                    strTbl.Append("<br>");
                    strTbl.Append("<table style='width:100%;' class='table table-striped' cellpadding='0' cellspacing='0'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr style='background-color:#428bca;color:white;'>");
                    strTbl.Append("<th>Region Name</th>");
                    strTbl.Append("<th>Team Member Name</th>");
                    strTbl.Append("<th>DOB</th>");
                    strTbl.Append("<th>Email Id</th>");
                    strTbl.Append("<th>Mobile</th>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    foreach (var doctorCode in lstDoctorsCode)
                    {
                        var lstDoctorDetails = lstBirthdayalerts.Where(s => s.Customer_Code == doctorCode.ToString()).ToList();
                        if (lstDoctorDetails.Count > 0)
                        {
                            //Bind Doctor Name                            
                            strTbl.Append("<tr><td colspan='5' class='cls_doctor'>Doctor Name:&nbsp;&nbsp;" + lstDoctorDetails[0].Customer_Name + "</td></tr>");
                            foreach (var doctordetails in lstDoctorDetails)
                            {
                                strTbl.Append("<tr>");
                                //Region Name
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Region_Name);
                                strTbl.Append("</td>");
                                //Team Member name
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.User_Name);
                                strTbl.Append("</td>");
                                //DOB
                                if (!string.IsNullOrEmpty(doctordetails.DOB))
                                {
                                    if ((Convert.ToDateTime(doctordetails.DOB).Month < currentdate.Month) || ((Convert.ToDateTime(doctordetails.DOB).Month == currentdate.Month) && (Convert.ToDateTime(doctordetails.DOB).Day < currentdate.Day)))
                                    {
                                        strTbl.Append("<td style='color:red;font-weight:bold;'>");
                                        strTbl.Append(doctordetails.DOB);
                                        strTbl.Append("</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td>");
                                        strTbl.Append(doctordetails.DOB);
                                        strTbl.Append("</td>");
                                    }
                                }
                                else
                                {
                                    strTbl.Append("<td>");
                                    strTbl.Append(doctordetails.DOB);
                                    strTbl.Append("</td>");
                                }
                                //Email
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Email);
                                strTbl.Append("</td>");
                                //Mobile
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Mobile);
                                strTbl.Append("</td>");
                                strTbl.Append("</tr>");
                            }
                        }
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
            }
            else
            {
                strTbl.Append("<span>No Upcoming Birthdays</span>");
            }
            return strTbl.ToString();
        }
        ///// <summary>
        ///// Get the home page anniversary alert of the logged in user region
        ///// </summary>
        ///// <returns>returns the logged in user customers anniversary</returns>
        //public string GetHomePageAnniversaryAlert()
        //{
        //    StringBuilder strContent = new StringBuilder();
        //    CurrentInfo objCurInfo = new CurrentInfo();
        //    DataControl.BLHome objHome = new DataControl.BLHome();
        //    try
        //    {
        //        IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = null;
        //        int count = objHome.GetDoctorCount(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
        //        List<MVCModels.User_UserMasterModel> lstchildUsers = new List<MVCModels.User_UserMasterModel>();
        //        lstchildUsers = objHome.GetChildUserCount(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();

        //        if (count > 0)
        //        {
        //            lstDoctor = objHome.GetHomePageAnniversaryAlert(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
        //            if (lstDoctor != null)
        //            {
        //                int i = 0;
        //                strContent.Append("<table class='table table-striped'>");
        //                strContent.Append("<tr>");
        //                strContent.Append("<td style='font-weight:bold'>Doctor Name</td>");
        //                strContent.Append("<td style='font-weight:bold'>Date</td>");
        //                strContent.Append("</tr>");

        //                foreach (var doctor in lstDoctor)
        //                {
        //                    i++;
        //                    strContent.Append("<tr>");
        //                    strContent.Append("<td>" + doctor.Customer_Name + "|");
        //                    strContent.Append(doctor.MDL_Number + "|");
        //                    strContent.Append(doctor.Category_Name + "|");
        //                    strContent.Append(doctor.Speciality_Name + "</td>");
        //                    strContent.Append("<td>" + doctor.Anniversary_Date + "</td>");
        //                    strContent.Append("</tr>");
        //                }
        //                strContent.Append("</table>");
        //                if (i == 0)
        //                {
        //                    strContent.Clear();
        //                    strContent.Append("<span>No records found</span>");
        //                }
        //            }
        //            else
        //            {
        //                strContent.Clear();
        //                strContent.Append("<span>No records found</span>");
        //            }
        //            if (lstchildUsers != null && lstchildUsers.Count > 0)
        //            {
        //                strContent.Append("<br>");
        //                strContent.Append("<a style='text-decoration:underline;text-align:center;cursor:pointer;color:#79b7e7;font-style:italic;font-weight:bold;' onclick=\"fnGetChildUserDoctorsAnniversaryAlert('" + _objCurrentInfo.GetRegionCode() + "');\">Show Team's Doctor-Anniversary</a>");
        //            }
        //        }
        //        else
        //        {
        //            strContent.Clear();
        //            strContent.Append("<span>No Upcoming Anniversaries</span>");
        //            if (lstchildUsers != null && lstchildUsers.Count > 0)
        //            {
        //                strContent.Append("<br>");
        //                strContent.Append("<a style='text-decoration:underline;text-align:center;cursor:pointer;color:#79b7e7;font-style:italic;font-weight:bold;' onclick=\"fnGetChildUserDoctorsAnniversaryAlert('" + _objCurrentInfo.GetRegionCode() + "');\">Show Team's Doctor-Anniversary</a>");
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicObj = new Dictionary<string, string>();
        //        dicObj.Add("strContent", strContent.ToString());
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
        //        return null;
        //    }
        //    return strContent.ToString();
        //}
        /// <summary>
        /// Get Anniversary alert for child users
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetAnniversaryAlertforChildUsers(string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            DateTime currentdate = DateTime.Now;
            List<MVCModels.HiDoctor_Master.DoctorModel> lstAnniversarydayalerts = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            lstAnniversarydayalerts = objHome.GetAnnviersaryAlertforChildUsers(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode()).ToList();
            var lstDoctorsCode = lstAnniversarydayalerts.Select(s => s.Customer_Code).Distinct().ToList();
            if (lstAnniversarydayalerts != null && lstAnniversarydayalerts.Count > 0)
            {
                if (lstDoctorsCode.Count > 0)
                {
                    strTbl.Append("<div style='width:100%;font-style:italic;font-weight:bold;'>If there are different anniversary dates recorded in different regions for the same doctor, all the dates will be shown. Past dates will be shown in red color.</div>");
                    strTbl.Append("<br>");
                    strTbl.Append("<table style='width:100%;' class='table table-striped' cellpadding='0' cellspacing='0'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr style='background-color:#428bca;color:white;'>");
                    strTbl.Append("<th>Region Name</th>");
                    strTbl.Append("<th>Team Member Name</th>");
                    strTbl.Append("<th>Anniversary Date</th>");
                    strTbl.Append("<th>Email Id</th>");
                    strTbl.Append("<th>Mobile</th>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    foreach (var doctorCode in lstDoctorsCode)
                    {
                        var lstDoctorDetails = lstAnniversarydayalerts.Where(s => s.Customer_Code == doctorCode.ToString()).ToList();
                        if (lstDoctorDetails.Count > 0)
                        {
                            //Bind Doctor Name                            
                            strTbl.Append("<tr><td colspan='5' class='cls_doctor'>Doctor Name:&nbsp;&nbsp;" + lstDoctorDetails[0].Customer_Name + "</td></tr>");
                            foreach (var doctordetails in lstDoctorDetails)
                            {
                                strTbl.Append("<tr>");
                                //Region Name
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Region_Name);
                                strTbl.Append("</td>");
                                //Team member Name
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.User_Name);
                                strTbl.Append("</td>");
                                //DOB
                                if (!string.IsNullOrEmpty(doctordetails.Anniversary_Date))
                                {
                                    if ((Convert.ToDateTime(doctordetails.Anniversary_Date).Month < currentdate.Month) || ((Convert.ToDateTime(doctordetails.Anniversary_Date).Month == currentdate.Month) && (Convert.ToDateTime(doctordetails.Anniversary_Date).Day < currentdate.Day)))
                                    {
                                        strTbl.Append("<td style='color:red;font-weight:bold;'>");
                                        strTbl.Append(doctordetails.Anniversary_Date);
                                        strTbl.Append("</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td>");
                                        strTbl.Append(doctordetails.Anniversary_Date);
                                        strTbl.Append("</td>");
                                    }
                                }
                                else
                                {
                                    strTbl.Append("<td>");
                                    strTbl.Append(doctordetails.Anniversary_Date);
                                    strTbl.Append("</td>");
                                }
                                //Email
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Email);
                                strTbl.Append("</td>");
                                //Mobile
                                strTbl.Append("<td>");
                                strTbl.Append(doctordetails.Mobile);
                                strTbl.Append("</td>");
                                strTbl.Append("</tr>");
                            }
                        }
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
            }
            else
            {
                strTbl.Append("<span>No Upcoming Anniversary.</span>");
            }
            return strTbl.ToString();
        }

        /// <summary>  
        /// Get the User Dashboard Holiday Details 
        /// </summary>
        /// 

        public JsonResult GetHolidayInfo()
        {
            DataControl.BLHome objHome = new DataControl.BLHome();
            return Json(objHome.GetHolidayInfo(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode()).ToList(), JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// Get the home page holiday alert
        /// </summary>
        /// <returns>returns the logged in user holiday for the current month</returns>
        public string GetHomePageHolidayAlert()
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            int i = 0;
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = null;
                lstHoliday = objHome.GetHomePageHolidayAlert(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
                if (lstHoliday != null)
                {
                    strContent.Append("<table class='table table-striped'>");
                    strContent.Append("<tr>");
                    strContent.Append("<td class='header' style='font-weight:bold'>Holiday Name</td>");
                    strContent.Append("<td class='header' style='font-weight:bold'>Date</td>");
                    strContent.Append("</tr>");
                    foreach (var holiday in lstHoliday)
                    {
                        i++;
                        strContent.Append("</tr>");
                        strContent.Append("<td>" + holiday.Holiday_Name + "</td>");
                        strContent.Append("<td>" + holiday.Holiday_Date + "</td>");
                        strContent.Append("</tr>");
                    }
                    strContent.Append("</table>");
                }
                else
                {
                    strContent.Clear();
                    strContent.Append("No records found");
                }
                if (i == 0)
                {
                    strContent.Clear();
                    strContent.Append("No records found");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return strContent.ToString();
        }
        /// <summary>
        /// Get the home page related calc fields details
        /// </summary>
        /// <returns>returns the activity summary, data summary and expense summary details</returns>
        public string GetHomePageCALCFieldsData()
        {
            StringBuilder strContent = new StringBuilder();
            StringBuilder strActivityContent = new StringBuilder();
            StringBuilder strDataContent = new StringBuilder();
            StringBuilder strExpContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            string previousMonth = System.DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
            string CurrentMonth = System.DateTime.Now.ToString("yyyy-MM-dd");

            DataControl.BLHome objHome = new DataControl.BLHome();
            try
            {
                List<MVCModels.HiDoctor_Master.UserCALCFieldsModel> lstCALCFields = new List<MVCModels.HiDoctor_Master.UserCALCFieldsModel>();
                lstCALCFields = objHome.GetHomePageCALCFieldsDetails(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());

                strActivityContent.Append("<table id='tblVisits' class='table table-striped'>");
                strActivityContent.Append("<tr class='trColor'>");
                strActivityContent.Append("<td>Summary</td>");
                strActivityContent.Append("<td>Current Month</td>");
                strActivityContent.Append("<td>Previous Month</td>");
                strActivityContent.Append("</tr>");

                strExpContent.Append("<table id='tblExpense' class='table table-striped'>");
                strExpContent.Append("<tr class='trColor'>");
                strExpContent.Append("<td>Expense Type</td>");
                strExpContent.Append("<td>Current Month</td>");
                strExpContent.Append("<td>Previous Month</td>");
                strExpContent.Append("</tr>");

                StringBuilder strCategorywiseVisited = new StringBuilder();
                StringBuilder strCategorywiseMissed = new StringBuilder();
                StringBuilder strCategorywiseAvgVisits = new StringBuilder();
                StringBuilder strCategorywiseDocCount = new StringBuilder();

                string curMonthAvgVisit = "0";
                string preMonthAvgVisit = "0";
                string curMonthTotalFieldDays = "0";
                string preMonthTotalFieldDays = "0";
                string curMonthAvgChemistVisit = "0";
                string preMonthAvgChemistVisit = "0";
                string curMonthDailyExp = "0";
                string curMonthMonthlyExp = "0";
                string preMonthDailyExp = "0";
                string preMonthMonthlyExp = "0";
                string curMonthTotalExp = "0";
                string preMonthTotalExp = "0";
                string totalDoctors = "0";
                string noOfLeaveTaken = "0";
                string holidayCount = "0";
                if (lstCALCFields[0].lstCALCHeader.Count > 0)
                {

                    var lstPreHeader = lstCALCFields[0].lstCALCHeader.AsEnumerable().Where(a => Convert.ToInt32(a.Month) == Convert.ToInt32(previousMonth.Split('-')[1]) &&
                              Convert.ToInt32(a.Year) == Convert.ToInt32(previousMonth.Split('-')[0])).ToList();
                    var lstCurHeader = lstCALCFields[0].lstCALCHeader.AsEnumerable().Where(a => Convert.ToInt32(a.Month) == Convert.ToInt32(CurrentMonth.Split('-')[1]) &&
                              Convert.ToInt32(a.Year) == Convert.ToInt32(CurrentMonth.Split('-')[0])).ToList();
                    if (lstCurHeader.Count > 0)
                    {
                        curMonthTotalFieldDays = lstCurHeader[0].Total_Field_Days;
                        if (Convert.ToDouble(lstCurHeader[0].Total_Field_Days) > 0)
                        {
                            curMonthAvgVisit = Convert.ToString(Convert.ToDouble(lstCurHeader[0].Doctor_Calls_Made) / Convert.ToDouble(lstCurHeader[0].Total_Field_Days));
                            curMonthAvgChemistVisit = Convert.ToString(Convert.ToDouble(lstCurHeader[0].Total_Chemist_Calls_Made)
                                / Convert.ToDouble(lstCurHeader[0].Total_Field_Days));
                        }
                        curMonthDailyExp = lstCurHeader[0].Total_Daily_Expense;
                        curMonthMonthlyExp = lstCurHeader[0].Total_Non_Daily_Expense;
                        totalDoctors = Convert.ToString(Convert.ToDouble(totalDoctors) + Convert.ToDouble(lstCurHeader[0].Approved_Doctors_Count));
                        noOfLeaveTaken = Convert.ToString(Convert.ToDouble(noOfLeaveTaken) + Convert.ToDouble(lstCurHeader[0].Total_Leave_Days));
                        holidayCount = Convert.ToString(Convert.ToDouble(holidayCount) + (Convert.ToDouble(lstCurHeader[0].Total_Holidays)
                            - Convert.ToDouble(lstCurHeader[0].Total_Days_Worked_On_Holidays)));
                    }
                    if (lstPreHeader.Count > 0)
                    {
                        preMonthTotalFieldDays = lstPreHeader[0].Total_Field_Days;
                        if (Convert.ToDouble(lstPreHeader[0].Total_Field_Days) > 0)
                        {
                            preMonthAvgVisit = Convert.ToString(Convert.ToDouble(lstPreHeader[0].Doctor_Calls_Made) / Convert.ToDouble(lstPreHeader[0].Total_Field_Days));
                            preMonthAvgChemistVisit = Convert.ToString(Convert.ToDouble(lstPreHeader[0].Total_Chemist_Calls_Made)
                            / Convert.ToDouble(lstPreHeader[0].Total_Field_Days));
                        }
                        preMonthDailyExp = lstPreHeader[0].Total_Daily_Expense;
                        preMonthMonthlyExp = lstPreHeader[0].Total_Non_Daily_Expense;
                        // totalDoctors = Convert.ToString(Convert.ToDouble(totalDoctors) + Convert.ToDouble(lstPreHeader[0].Approved_Doctors_Count));
                        //  noOfLeaveTaken = Convert.ToString(Convert.ToDouble(noOfLeaveTaken) + Convert.ToDouble(lstPreHeader[0].Total_Leave_Days));
                        // holidayCount = Convert.ToString(Convert.ToDouble(holidayCount) + (Convert.ToDouble(lstPreHeader[0].Total_Holidays)
                        // - Convert.ToDouble(lstPreHeader[0].Total_Days_Worked_On_Holidays)));
                    }
                    curMonthTotalExp = Convert.ToString(Convert.ToDouble(curMonthDailyExp) + Convert.ToDouble(curMonthMonthlyExp));
                    preMonthTotalExp = Convert.ToString(Convert.ToDouble(preMonthDailyExp) + Convert.ToDouble(preMonthMonthlyExp));



                    foreach (var category in lstCALCFields[0].lstDoctorCategory)
                    {
                        string curMonthCategoryVisitedCount = "0";
                        string curMonthCategoryMissedCount = "0";
                        string curMonthAvgCategoryVisit = "0";
                        string preMonthCategoryVisitedCount = "0";
                        string preMonthCategoryMissedCount = "0";
                        string preMonthAvgCategoryVisit = "0";
                        string categorywiseDocCount = "0";

                        var lstPreCategory = lstCALCFields[0].lstCALCDetails.AsEnumerable().Where(a => a.Doctor_Category_Code == category.Category_Code
                                && Convert.ToInt32(a.Month) == Convert.ToInt32(previousMonth.Split('-')[1]) &&
                              Convert.ToInt32(a.Year) == Convert.ToInt32(previousMonth.Split('-')[0])).ToList();
                        var lstCurCategory = lstCALCFields[0].lstCALCDetails.AsEnumerable().Where(a => a.Doctor_Category_Code == category.Category_Code
                               && Convert.ToInt32(a.Month) == Convert.ToInt32(CurrentMonth.Split('-')[1]) &&
                             Convert.ToInt32(a.Year) == Convert.ToInt32(CurrentMonth.Split('-')[0])).ToList();

                        if (lstCurCategory.Count > 0)
                        {
                            curMonthCategoryVisitedCount = lstCurCategory[0].Total_Visited_Doctors;
                            curMonthCategoryMissedCount = lstCurCategory[0].Category_Missed_Doctors;
                            categorywiseDocCount = Convert.ToString(Convert.ToDouble(categorywiseDocCount) + Convert.ToDouble(lstCurCategory[0].Total_Approved_Doctors));
                            if (Convert.ToDouble(curMonthTotalFieldDays) > 0)
                            {
                                curMonthAvgCategoryVisit = Convert.ToString(Convert.ToDouble(lstCurCategory[0].Doctor_Calls_Made) / Convert.ToDouble(curMonthTotalFieldDays));
                            }
                        }

                        if (lstPreCategory.Count > 0)
                        {
                            preMonthCategoryVisitedCount = lstPreCategory[0].Total_Visited_Doctors;
                            preMonthCategoryMissedCount = lstPreCategory[0].Category_Missed_Doctors;
                            // categorywiseDocCount = Convert.ToString(Convert.ToDouble(categorywiseDocCount) + Convert.ToDouble(lstCurCategory[0].Total_Approved_Doctors));
                            if (Convert.ToDouble(preMonthTotalFieldDays) > 0)
                            {
                                preMonthAvgCategoryVisit = Convert.ToString(Convert.ToDouble(lstPreCategory[0].Doctor_Calls_Made) / Convert.ToDouble(preMonthTotalFieldDays));
                            }
                        }
                        strCategorywiseVisited.Append("<tr><td>" + category.Category_Name + "  visited</td>");
                        strCategorywiseVisited.Append("<td>" + curMonthCategoryVisitedCount + "</td>");
                        strCategorywiseVisited.Append("<td>" + preMonthCategoryVisitedCount + "</td></tr>");

                        strCategorywiseMissed.Append("<tr><td>" + category.Category_Name + "  missed</td>");
                        strCategorywiseMissed.Append("<td>" + curMonthCategoryMissedCount + "</td>");
                        strCategorywiseMissed.Append("<td>" + preMonthCategoryMissedCount + "</td></tr>");

                        strCategorywiseAvgVisits.Append("<tr><td>Avg " + category.Category_Name + "  visits</td>");
                        strCategorywiseAvgVisits.Append("<td>" + curMonthAvgCategoryVisit + "</td>");
                        strCategorywiseAvgVisits.Append("<td>" + preMonthAvgCategoryVisit + "</td></tr>");

                        strCategorywiseDocCount.Append("<tr><td>" + category.Category_Name + " </td>");
                        strCategorywiseDocCount.Append("<td>" + categorywiseDocCount + "</td></tr>");
                    }
                }
                #region actitvity summary
                strActivityContent.Append(strCategorywiseVisited.ToString());
                strActivityContent.Append(strCategorywiseMissed.ToString());
                strActivityContent.Append("<tr><td>Total Field days in the Month</td>");
                strActivityContent.Append("<td>" + curMonthTotalFieldDays + "</td><td>" + preMonthTotalFieldDays + "</td></tr>");
                strActivityContent.Append("<tr><td>Avg visits</td>");
                strActivityContent.Append("<td>" + curMonthAvgVisit + "</td><td>" + preMonthAvgVisit + "</td></tr>");
                strActivityContent.Append(strCategorywiseAvgVisits.ToString());
                strActivityContent.Append("<tr><td>Avg chemist visits</td>");
                strActivityContent.Append("<td>" + curMonthAvgChemistVisit + "</td><td>" + preMonthAvgChemistVisit + "</td></tr>");
                #endregion actitviry summary

                #region field exp
                strExpContent.Append("<tr><td>Daily</td><td>" + Math.Round(Convert.ToDouble(curMonthDailyExp), 2) + "</td><td>"
                    + Math.Round(Convert.ToDouble(preMonthDailyExp), 2) + "</td></tr>");
                strExpContent.Append("<tr><td>Non-Daily</td><td>" + Math.Round(Convert.ToDouble(curMonthMonthlyExp), 2) + "</td><td>"
                    + Math.Round(Convert.ToDouble(preMonthMonthlyExp), 2) + "</td></tr>");
                strExpContent.Append("<tr><td>Total</td><td>" + Math.Round(Convert.ToDouble(curMonthTotalExp), 2) + "</td><td>"
                    + Math.Round(Convert.ToDouble(preMonthTotalExp), 2) + "</td></tr>");
                #endregion field exp
                #region data summary
                strDataContent.Append("<table id='tblDataSummary' class='table table-striped'><tr><td>Total Doctors</td><td>" + totalDoctors + "</td></tr>");
                strDataContent.Append(strCategorywiseDocCount.ToString());
                strDataContent.Append("<tr><td>No of Leave Taken</td><td>" + noOfLeaveTaken + "</td></tr>");
                strDataContent.Append("<tr><td>Number of holidays for the month</td><td>" + holidayCount + "</td></tr></table>");
                #endregion data summary

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                //  dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            strContent.Append(strActivityContent.ToString() + "$" + strDataContent.ToString() + "$" + strExpContent.ToString());
            return strContent.ToString();
        }

        /// <summary>
        /// get the home page announcements
        /// </summary>
        /// <returns>return the home page announcement content</returns>
        public string GetUnreadNotification()
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLHome objHome = new DataControl.BLHome();
            string style = string.Empty;
            int i = 0;
            if (!string.IsNullOrEmpty(objCurInfo.GetCompanyCode()))
            {
                // strContent.Append("<ul id='ulTicker'>");
                try
                {
                    List<MVCModels.NoticeBoardContentModel> lstNotice = new List<MVCModels.NoticeBoardContentModel>(
                        objHome.GetHomePageUnreadNotification(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()));
                    if (lstNotice.Count > 0)
                    {
                        foreach (var dr in lstNotice)
                        {
                            style = "style='font-size: 120%;'";
                            if (dr.HIGHLIGHT == "1")
                            {
                                style = "style='color: red;font-size: 120%'";
                            }

                            i++;
                            if (i == lstNotice.Count)
                            {
                                // strContent.Append("<li onclick='fnGoToNotificationScreen();'><span>" + dr.Message + "   </span></li>");
                                strContent.Append("<span class='spnTick' " + style + "  onclick='fnGoToNotificationScreen();'>" + dr.Message + "   </span>");
                            }
                            else
                            {
                                //  strContent.Append("<li onclick='fnGoToNotificationScreen();'><span>" + dr.Message + "  |  </span></li>");
                                strContent.Append("<span class='spnTick' " + style + " onclick='fnGoToNotificationScreen();'>" + dr.Message + "  |  </span>");
                            }

                        }
                    }
                    else
                    {
                        strContent.Append("NO");
                    }
                    // strContent.Append("</ul>");
                }
                catch (Exception ex)
                {
                    Dictionary<string, string> dicObj = new Dictionary<string, string>();
                    dicObj.Add("strContent", strContent.ToString());
                    DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                    return null;
                }
            }
            else
            {
                strContent.Append("NO");
            }
            return strContent.ToString();
        }
        #endregion home page


        public ActionResult Tree()
        {
            ViewBag.Current_User_Code = _objCurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult TreeWithoutCheck()
        {
            ViewBag.Current_User_Code = _objCurrentInfo.GetUserCode();
            return View();
        }

        public JsonResult GetSplashScreen()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.HD_MasterFactoryClasses.BL_SplashScreen _objSplashScreen = new DataControl.HD_MasterFactoryClasses.BL_SplashScreen();
                List<MVCModels.SplashScreenModel> lstSplash = new List<MVCModels.SplashScreenModel>();
                lstSplash = _objSplashScreen.GetTodaysSplashScreen(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                IConfigProvider iconfig = new ConfigProvider();
                string url = iconfig.GetConfigValue("NBFILES");
                lstSplash.ForEach(x => x.File_Path = (x.File_Path == "undefined") ? "" : ((x.File_Path == "") ? "" : (url + objCurInfo.GetCompanyCode().ToLower() + "/" + x.File_Path)));
                lstSplash.ForEach(x => x.Mobile_Attachment_Url = (x.Mobile_Attachment_Url == "undefined") ? "" : ((x.Mobile_Attachment_Url == "") ? "" : (url + objCurInfo.GetCompanyCode().ToLower() + "/" + x.Mobile_Attachment_Url)));
                // https://nbfiles.blob.core.windows.net/com00000009/
                return Json(lstSplash, JsonRequestBehavior.AllowGet);
                // return tableContent;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetSplashScreenForMobile(int splashNo)
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.HD_MasterFactoryClasses.BL_SplashScreen _objSplashScreen = new DataControl.HD_MasterFactoryClasses.BL_SplashScreen();
                List<MVCModels.SplashScreenModel> lstSplash = new List<MVCModels.SplashScreenModel>();
                lstSplash = _objSplashScreen.GetTodaysSplashScreen(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                IConfigProvider iconfig = new ConfigProvider();
                string url = iconfig.GetConfigValue("NBFILES");
                lstSplash.ForEach(x =>
                {
                    x.File_Path = (x.File_Path == "undefined") ? "" : ((x.File_Path == "") ? "" : (url + objCurInfo.GetCompanyCode().ToLower() + "/" + x.File_Path));
                    x.Mobile_Attachment_Url = (x.Mobile_Attachment_Url == "undefined") ? "" : ((x.Mobile_Attachment_Url == "") ? "" : (url + objCurInfo.GetCompanyCode().ToLower() + "/" + x.Mobile_Attachment_Url));
                    x.Splash_Count = lstSplash.Count;
                });
                List<MVCModels.SplashScreenModel> lstModified = new List<MVCModels.SplashScreenModel>();
                lstModified = lstSplash.Skip(splashNo).Take(1).ToList();
                // https://nbfiles.blob.core.windows.net/com00000009/
                return Json(lstModified, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #region payroll

        public string IsPayrollEnabled()
        {
            string strContent = string.Empty;
            try
            {

                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                if (objCurInfo.GetPayRollIntegratedStatus())
                {
                    strContent = "S";
                }
                else
                {
                    strContent = "E";
                }
            }
            catch (Exception ex)
            {
                strContent = "E";
            }
            return strContent;
        }
        [AjaxSessionActionFilter]
        public JsonResult GetPayrollDetails()
        {
            string strContent = string.Empty;
            MVCModels.PayrollModel objResult = new MVCModels.PayrollModel();
            try
            {

                DataControl.CurrentInfo objCurInfo = new CurrentInfo();

                if (objCurInfo.GetPayRollIntegratedStatus())
                {
                    string payrolluserId = objCurInfo.GetPayrollUserId();
                    string payrollUrl = objCurInfo.GetPayrollIntegratedURL();
                    string payrollVendorSecurityToken = objCurInfo.GetPayrollVendorSecurityToken(); //objCurInfo.GetPayrollSecurityToken();

                    IConfigSettings IConfig_Settings = null;
                    IConfig_Settings = new Config_Settings();
                    string accessKey = IConfig_Settings.GetConfigDefaultValue(objCurInfo.GetCompanyCode(), DataControl.EnumType.CONFIG_TYPE.DCR,
                                DataControl.EnumType.CONFIG_KEY.PAYROLL_ACCESS_KEY);

                    // string SCHEME = "https";
                    string ISO_8601 = string.Empty;
                    // US culture
                    var usCulture = new CultureInfo("en-US");
                    // Get current UTC time.  
                    var utcDate = DateTime.UtcNow;
                    // Change time to match GMT + 1.
                    var gmt1Date = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(utcDate, "W. Europe Standard Time");
                    // Output the GMT+1 time in our specified format using the US-culture.
                    var strDate = gmt1Date.ToString("yyyy-MM-dd'T'HH:mm:ss z", usCulture);

                    DateTimeOffset dtOf = new DateTimeOffset(DateTime.UtcNow);

                    string str = dtOf.ToString("yyyy-MM-ddTHH:mm:ss.fffzz");
                    str = str + "00";

                    string signature = CreateToken(str, accessKey);
                    strContent = string.Concat(payrollUrl + "/api/admin/app-authenticate/employee/"
                        + payrolluserId + "?accessId=" + payrollVendorSecurityToken + "&user=Apiuser&timestamp="
                        + str + "&signature=" + signature + "");


                    //call the WebAPI
                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(payrollUrl); //5018
                    string url = payrollUrl + "/api/admin/app-authenticate/employee/" + HttpUtility.UrlEncode(payrolluserId)
                        + "?accessId=" + HttpUtility.UrlEncode(payrollVendorSecurityToken) + "&user=Apiuser&timestamp="
                        + HttpUtility.UrlEncode(str) + "&signature=" + HttpUtility.UrlEncode(signature);
                    // client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var result = client.PostAsync(url, null).Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var serializer = new XmlSerializer(typeof(MVCModels.PayrollModel));

                        string xmlStr = result.Content.ReadAsStringAsync().Result.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "")
                            .Replace("login-response", "PayrollModel");
                        using (TextReader reader = new StringReader(xmlStr))
                        {
                            objResult = (MVCModels.PayrollModel)serializer.Deserialize(reader);
                        }
                        objResult.API_Status = "S";//SUCCESS
                    }
                    else
                    {
                        var serializer = new XmlSerializer(typeof(MVCModels.PayrollModel));
                        string xmlStr = result.Content.ReadAsStringAsync().Result.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "")
                            .Replace("exception", "PayrollModel");
                        using (TextReader reader = new StringReader(xmlStr))
                        {
                            objResult = (MVCModels.PayrollModel)serializer.Deserialize(reader);
                        }
                        objResult.API_Status = "E";//ERROR
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                objResult.API_Status = "EX";
                objResult.message = "Exception occured.Please colse the window and try again."; //ex.Message.ToString();
            }
            List<MVCModels.PayrollModel> lstPayroll = new List<MVCModels.PayrollModel>();
            lstPayroll.Add(objResult);
            return Json(lstPayroll);
        }

        private string CreateToken(string message, string secret)
        {
            secret = secret ?? "";
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(secret);
            byte[] messageBytes = encoding.GetBytes(message);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return Convert.ToBase64String(hashmessage);
            }
        }

        private void SessionClear()
        {
            System.Web.HttpContext.Current.Session["Comp_Code"] = null;
            System.Web.HttpContext.Current.Session["User_Name"] = null;
            System.Web.HttpContext.Current.Session["SubDomain"] = null;
            System.Web.HttpContext.Current.Session["SFAWAUrl"] = null;
            System.Web.HttpContext.Current.Session["SalesDriveUrl"] = null;
            System.Web.HttpContext.Current.Session["SFAWA_ClickTime"] = null;
            System.Web.HttpContext.Current.Session["WideAngleUrl"] = null;
            System.Web.HttpContext.Current.Session["Employee_Name"] = null;
            System.Web.HttpContext.Current.Session["User_Code"] = null;
            System.Web.HttpContext.Current.Session["User_Type_Code"] = null;
            System.Web.HttpContext.Current.Session["User_Type_Name"] = null;
            System.Web.HttpContext.Current.Session["Region_Code"] = null;
            System.Web.HttpContext.Current.Session["Region_Name"] = null;
            System.Web.HttpContext.Current.Session["S_Id"] = null;
            System.Web.HttpContext.Current.Session["Latitude"] = null;
            System.Web.HttpContext.Current.Session["Longitude"] = null;
            System.Web.HttpContext.Current.Session["Location"] = null;
            System.Web.HttpContext.Current.Session["Privilege_Data"] = null;
            System.Web.HttpContext.Current.Session["IsMenuShow"] = null;
            System.Web.HttpContext.Current.Session["CurPage"] = null;
            System.Web.HttpContext.Current.Session["Is_Payroll_Integrated"] = null;
            System.Web.HttpContext.Current.Session["Payroll_Security_Token"] = null;
            System.Web.HttpContext.Current.Session["Payroll_Integrated_URL"] = null;
            System.Web.HttpContext.Current.Session["OneLibUrl"] = null;
            System.Web.HttpContext.Current.Session["IsPasswordNotify"] = null;
            // System.Web.HttpContext.Current.Session[" ViewBag.FAQ_Url"] = null;
        }

        #endregion payroll
        public string GetHomeSession()
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string GetsessionCompanyCode = string.Empty;
            GetsessionCompanyCode = _objCurrentInfo.GetCompanyCode();
            return GetsessionCompanyCode;
        }
        public ActionResult SplashScreen()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SplashScreen.Mobile");
            }
            else
            {
                return View();
            }
            //return View();
        }
        public ActionResult RestrictedBrowser()
        {
            return View();
        }
        public string GetBrowserType()
        {
            var browser = Request.Browser;
            string BrowserType = browser.Browser;
            return BrowserType;
        }

        public JsonResult GetprofilePopupAccess(int NumOfDays)
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string userCode = objCurInfo.GetUserCode();
            DataControl.BLHome objHome = new BLHome();
            List<MVCModels.MyProfilePopupModel> lstProfileDetails = new List<MVCModels.MyProfilePopupModel>();
            lstProfileDetails = objHome.GetprofilePopupAccess(companyCode, userCode, NumOfDays).ToList();
            return Json(lstProfileDetails, JsonRequestBehavior.AllowGet);
        }

        #region LANDING/ON BOARDING PAGE
        public ActionResult OnBoardingPage()
        {
            CurrentInfo objInfo = new CurrentInfo();
            ViewBag.CompanyCode = objInfo.GetCompanyCode();
            ViewBag.UserCode = objInfo.GetUserCode();
            ViewBag.Url = objInfo.GetSubDomain();
            ViewBag.UserName = objInfo.GetUserName();
            return View();
        }

        public string ConvertParamEncode(string parameters)
        {
            byte[] LoginParamsEncode = null;
            if (parameters == null || parameters == "")
            {

                CurrentInfo objInfo = new CurrentInfo();
                parameters = "CompanyCode = " + objInfo.GetCompanyCode() + " ^ UserCode = " + objInfo.GetUserCode() + " ^ UserName = "
                    + objInfo.GetUserName() + " ^ Url = " + objInfo.GetSubDomain();
            }

            LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(parameters);

            return Convert.ToBase64String(LoginParamsEncode);

        }
        #endregion LANDING/ON BOARDING PAGE

        public int GetCodeofConduct()
        {
            int result = 0;
            CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string usertypecode = objCurInfo.GetUserTypeCode();
            string userCode = objCurInfo.GetUserCode();
            DataControl.BLHome objHome = new BLHome();
            result = objHome.GetCodeofConduct(companyCode, usertypecode, userCode);

            return result;
        }

        public JsonResult GetCCForm()
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string usertypecode = objCurInfo.GetUserTypeCode();
            string userCode = objCurInfo.GetUserCode();
            DataControl.BLHome objHome = new BLHome();
            List<MVCModels.CCOverlayModel> lstCCForm = new List<MVCModels.CCOverlayModel>();
            lstCCForm = objHome.GetCCForm(companyCode, usertypecode, userCode).ToList();
            return Json(lstCCForm, JsonRequestBehavior.AllowGet);

        }

        public bool SaveAcknowledgement(int FileId)
        {
            bool result = false;
            CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string usertypeCode = objCurInfo.GetUserTypeCode();
            string userCode = objCurInfo.GetUserCode();
            DataControl.BLHome objHome = new BLHome();
            result = objHome.SaveAcknowledgement(companyCode, usertypeCode, userCode, FileId);
            return result;
        }

        public ActionResult RedirectTOMobile()
        {
            return View();
        }
    }
}
