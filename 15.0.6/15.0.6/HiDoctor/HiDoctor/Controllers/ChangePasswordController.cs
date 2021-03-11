using DataControl;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Configuration;

namespace HiDoctor.Controllers
{
    public class ChangePasswordController : Controller
    {
        //
        // GET: /ChangePassword/
        const string PASSWORDEXPIRED = "PASSWORDEXPIRED";
        const string KANGLEURL_KEY = "KangleUrlKey";
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ChangePassword(string id, string mode)
        {

            ViewBag.Loginid = id;
            string Loginmode = mode;
            if (Loginmode != "" && Loginmode != null)
            {
                ViewBag.Loginmode = Request.QueryString["mode"];
                //Response.Redirect("ActionResult?mode=" + mode);
                SetSeedValues();
                return View();
            }
            else
            {
                try
                {
                    if (id == PASSWORDEXPIRED)
                    {
                        ViewBag.ChangePassMessage = Resources.Password_Policy_Messages.ChangePasswordNofification.ToString();
                    }
                    else
                    {
                        ViewBag.ChangePassMessage = string.Empty;
                    }
                    Session["IsPasswordNotify"] = "NO";
                    SetSeedValues();
                    return View();
                }
                catch (Exception ex)
                {
                    DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                    return View();
                }
            }
        }


        public void SetSeedValues()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();

                string passPolicy = objCurInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");
                string passwordHisCount = objCurInfo.GetPrivilegeValue("PASSWORD_HISTORY_COUNT", "0");
                string passwordStrength = objCurInfo.GetPrivilegeValue("PASSWORD_STRENGTH", "");

                if (passPolicy.ToUpper() == "YES")
                {
                    if (passwordHisCount == "0" || passwordHisCount == "")
                    {
                        ViewBag.PasswordHistoryNeed = "NO";
                        ViewBag.PasswordHistoryCount = "0";
                    }
                    else
                    {
                        ViewBag.PasswordHistoryNeed = "YES";
                        ViewBag.PasswordHistoryCount = passwordHisCount;
                    }

                    AssignExisitingPassword();
                    ViewBag.PasswordStrength = passwordStrength;
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
            }
        }

        protected void AssignExisitingPassword()
        {
            try
            {
                DataControl.HiDoctorFactoryClasses.BL_ChangePassword _objBLChangePass = new DataControl.HiDoctorFactoryClasses.BL_ChangePassword();
                StringBuilder passBuilder = new StringBuilder();
                CurrentInfo objCurInfo = new CurrentInfo();

                string companyCode = objCurInfo.GetCompanyCode();
                string userCode = objCurInfo.GetUserCode();
                string passwordHistoryCount = objCurInfo.GetPrivilegeValue("PASSWORD_HISTORY_COUNT", "0");

                if (passwordHistoryCount != "0")
                {
                    IEnumerable<MVCModels.PasswordHistory> iePassHis = _objBLChangePass.GetPasswordHistory(companyCode, userCode, passwordHistoryCount);

                    foreach (MVCModels.PasswordHistory objPassHisModel in iePassHis)
                    {
                        passBuilder.Append(objPassHisModel.User_Pass + ",");
                    }

                    ViewBag.PassHistory = passBuilder.ToString().TrimEnd(',');
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
            }
        }

        public string UpdatePassword(string newPassword, string oldPassword, string confirmPassword)
        {
            try
            {
                string outPutMsg = string.Empty;

                DataControl.HiDoctorFactoryClasses.BL_ChangePassword objBLChangePass = new DataControl.HiDoctorFactoryClasses.BL_ChangePassword();
                CurrentInfo objCurInfo = new CurrentInfo();
                string message = string.Empty;

                string companyCode = objCurInfo.GetCompanyCode();
                string userCode = objCurInfo.GetUserCode();
                string userName = objCurInfo.GetUserName();

                bool result = objBLChangePass.UpdatePassword(companyCode: companyCode, userCode: userCode, userName: userName, oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword, outputMsg: out message);
                // TO DO: Check Kangle customer.

                if (result)
                {
                    // Creates instance config settings.
                    DataControl.Abstraction.IConfigSettings config_Settings = new DataControl.Impl.Config_Settings();

                    // Check company is Kangle Integrated.
                    string Is_Kangle_Integrated = config_Settings.GetConfigDefaultValue(companyCode, DataControl.EnumType.CONFIG_TYPE.USER, DataControl.EnumType.CONFIG_KEY.IS_KANGLE_INTEGRATED);

                    if (Is_Kangle_Integrated.ToUpper() == "YES")
                    {
                        // Retriev the Kangle URL from WebConfig 
                        string url = ConfigurationManager.AppSettings[KANGLEURL_KEY];
                        if (!string.IsNullOrEmpty(url))
                        {
                            using (WebClient client = new WebClient())
                            {
                                // Build the URL.
                                StringBuilder strUrl = new StringBuilder();
                                strUrl.Append(url);
                                strUrl.Append(companyCode);
                                strUrl.Append("/");
                                strUrl.Append(userCode);
                                strUrl.Append("/");
                                strUrl.Append(newPassword);
                                client.UploadString(strUrl.ToString(), "POST");
                                // Call the Kangle Update Password.
                                // client.DownloadString(strUrl.ToString());
                            }
                        }
                    }

                    AssignExisitingPassword();
                    Session["IsMenuShow"] = "YES";
                    Session["CurPage"] = "";

                    outPutMsg = "1:" + message;
                }
                else
                {
                    outPutMsg = "0:" + message;
                }

                return outPutMsg;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("NewPassword", newPassword);
                dicObj.Add("OldPassword", oldPassword);
                dicObj.Add("ConfirmPassword", confirmPassword);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                throw;
            }
        }

        public int InsertMenuVistDetails(string menuID)
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.HiDoctorFactoryClasses.BL_ChangePassword objBLChangePass = new DataControl.HiDoctorFactoryClasses.BL_ChangePassword();
            int count = objBLChangePass.InsertVisitedScreen(objCurInfo.GetCompanyCode(), menuID, objCurInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
            return count;

        }

        public string urlEncodeing()
        {
            MVCModels.UserInfoModel objuser = new MVCModels.UserInfoModel();
            CurrentInfo objCurInfo = new CurrentInfo();
            string userParam = string.Empty;
            objuser.Company_Code = objCurInfo.GetCompanyCode();
            objuser.User_Code = objCurInfo.GetUserCode();
            objuser.User_Type_Code = objCurInfo.GetUserTypeCode();
            objuser.Region_Code = objCurInfo.GetRegionCode();
            objuser.Company_Id = objCurInfo.GetCompanyId();
            objuser.User_Details = objCurInfo.GetUserName() + " (" + objCurInfo.GetUserTypeName() + ")";
            objuser.Is_Mobile = "NO";
            userParam = Newtonsoft.Json.JsonConvert.SerializeObject(objuser);
            byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(userParam);
            userParam = Convert.ToBase64String(LoginParamsEncode);
            return userParam;
        }

    }
}
