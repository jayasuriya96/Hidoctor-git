using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HiDoctor.Models;
using Newtonsoft.Json;

namespace HiDoctor.Controllers
{
    public class OneLibController : Controller
    {
        //
        // GET: /OneLib/

        public ActionResult Index()
        {
            return View();
        }

        public int IsOneLibAvailable()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                string userTypeCode = objCurInfo.GetUserTypeCode();

                DataControl.HiDoctorFactoryClasses.BL_OneLib objBLOneLib = new DataControl.HiDoctorFactoryClasses.BL_OneLib();
                if (objBLOneLib.IsOneLibAvailable(companyCode, userTypeCode))
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return 0;
            }
        }

        public int IsKangleAvailable()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.HiDoctorFactoryClasses.BL_OneLib objBLOneLib = new DataControl.HiDoctorFactoryClasses.BL_OneLib();
                if (objCurInfo.GetIsKangleIntegrated())
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return 0;
            }
        }

        public string GetOneLibURL()
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            string oneLibUrl = string.Empty;
            try
            {
                string companyCode = objCurInfo.GetCompanyCode();
                string userTypeCode = objCurInfo.GetUserTypeCode();
                string userCode = objCurInfo.GetUserCode();
                string oneLibRedirectionUrl = objCurInfo.GetOneLibUrl();
                string sessionId = objCurInfo.GetSessionId();
                string regionCode = objCurInfo.GetRegionCode();
                string userName = objCurInfo.GetUserName();

                if (!string.IsNullOrEmpty(oneLibRedirectionUrl))
                {
                    oneLibUrl = "" + oneLibRedirectionUrl + "?User_Code=" + userCode + "&Comp_Code=" + companyCode + "&Session_Id=" + sessionId + "&Return_URL=" + Request.Url.Authority + "&User_Type_Code=" + userTypeCode + "&Region_Code=" + regionCode + "&User_Name=" + userName + "";
                }
                return oneLibUrl;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }

        public string GetKangleURL()
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            string kangleUrl = string.Empty;
            try
            {
                string kangleRedirectionUrl = objCurInfo.GetKangleUrl();
                string userName = objCurInfo.GetUserName();
                string subdomain = objCurInfo.GetSubDomain();

                if (!string.IsNullOrEmpty(kangleRedirectionUrl))
                {
                    kangleUrl = "" + kangleRedirectionUrl + "?cl=de&userName=" + userName + "&subdomainName=" + subdomain + "&lang=en-US";
                }
                return kangleUrl;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }

        public int IsFormManagementAvailable()
        {
            CurrentInfo _objcurrentinfo = new CurrentInfo();

            try
            {
                if (_objcurrentinfo.GetFormManagementIntegratedStatus())
                {
                    return 1;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return 0;
            }
        }

        public string GetFormManagementURL()
        {

            CurrentInfo _objcurrentinfo = new CurrentInfo();
            string formManagementURL = string.Empty;
            try
            {
                string formmanagementstring = _objcurrentinfo.GetFormManagementURL();
                string subDomainName = _objcurrentinfo.GetSubDomain();
                string userName = _objcurrentinfo.GetUserName();

                byte[] companyEncode = System.Text.Encoding.UTF8.GetBytes(_objcurrentinfo.GetCompanyCode());
                String EncodeCompanyCodeString = Convert.ToBase64String(companyEncode);

                byte[] Userencode = System.Text.Encoding.UTF8.GetBytes(_objcurrentinfo.GetUserCode());
                String EncodeUserCodeString = Convert.ToBase64String(Userencode);


                if (!string.IsNullOrEmpty(formmanagementstring))
                {
                    formManagementURL = "" + formmanagementstring + "?C=" + EncodeCompanyCodeString + "&U=" + EncodeUserCodeString + "";
                }
                return formManagementURL;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// HRMS_Url
        /// </summary>
        /// <returns></returns>
        /// 
        public int IsHRMSAvailable()
        {
            CurrentInfo _objcurrentinfo = new CurrentInfo();

            try
            {
                if (_objcurrentinfo.GetHRMSIntegratedStatus())
                {
                    return 1;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return 0;
            }
        }
        public string GetHrmsURL()
        {

            CurrentInfo _objCurrInfo = new CurrentInfo();
            string LoginParams = string.Empty;
            string HRMS_Url = string.Empty;
            string HRMS_RedirectingUrl = string.Empty;
            try
            {
                HRMS_RedirectingUrl = _objCurrInfo.GetHRMURL();
                CompanyDetails lstcompdetails = new CompanyDetails();
                lstcompdetails.Company_Code = _objCurrInfo.GetCompanyCode();
                lstcompdetails.Region_Code = _objCurrInfo.GetRegionCode();
                lstcompdetails.User_Code = _objCurrInfo.GetUserCode();
                lstcompdetails.Employee_Code = _objCurrInfo.GetEmployeeCode();
                lstcompdetails.Employee_Number = _objCurrInfo.GetEmployeeNumber();
                lstcompdetails.UserName = _objCurrInfo.GetUserName();
                lstcompdetails.User_Type_Code = _objCurrInfo.GetUserTypeCode();

                LoginParams = JsonConvert.SerializeObject(lstcompdetails);
                byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(LoginParams);
                LoginParams = Convert.ToBase64String(LoginParamsEncode);

                if (!string.IsNullOrEmpty(HRMS_RedirectingUrl))
                {
                    HRMS_Url = "" + HRMS_RedirectingUrl + "?SSID=" + LoginParams;
                }
                return HRMS_Url;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }
        /// <summary>
        /// get URL for E-Detailing
        /// </summary>
        /// <returns>E-Detailing URL with parameter encoded</returns>
        [AjaxSessionActionFilter]
        public string E_DetailingURL()
        {
            CurrentInfo _objCurrInfo = new CurrentInfo();
            string E_DetailingURL = string.Empty;
            string LoginParams = string.Empty;
            try
            {
                //byte[] UserEncode=System.Text.Encoding.UTF8.GetBytes(_objCurrInfo.GetUserName());
                //string UserName = Convert.ToBase64String(UserEncode);
                //byte[] SubDomainEncode = System.Text.Encoding.UTF8.GetBytes(_objCurrInfo.GetSubDomain());
                //String SubDomain = Convert.ToBase64String(SubDomainEncode);
                string EDetailingRedirectUrl = _objCurrInfo.GetEDetailing();

                CompanyDetails lstcompdetails = new CompanyDetails();
                lstcompdetails.SubDomainName = _objCurrInfo.GetSubDomain();
                lstcompdetails.UserName = _objCurrInfo.GetUserName();

                LoginParams = JsonConvert.SerializeObject(lstcompdetails);
                byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(LoginParams);
                LoginParams = Convert.ToBase64String(LoginParamsEncode);


                if (!string.IsNullOrEmpty(EDetailingRedirectUrl))
                {
                    E_DetailingURL = "" + EDetailingRedirectUrl + "?SSID=" + LoginParams;
                }

                //if (!string.IsNullOrEmpty(EDetailingRedirectUrl))
                //{
                //    E_DetailingURL = "" + EDetailingRedirectUrl + "?U=" + UserName + "&S=" + SubDomain;
                //}
                return E_DetailingURL;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }

        #region KRA KRA Integration
        public int IsKRAAvailable()
        {
            CurrentInfo _objcurrentinfo = new CurrentInfo();
            try
            {
                if (_objcurrentinfo.GetKRAIntegratedStatus())
                {
                    return 1;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return 0;
            }
        }
        public string GetKRAURL()
        {

            CurrentInfo _objCurrInfo = new CurrentInfo();
            string LoginParams = string.Empty;
            string kraUrl = string.Empty;
            string kraRedirectingUrl = string.Empty;
            try
            {

                CompanyDetails lstcompdetails = new CompanyDetails();
                lstcompdetails.Company_Code = _objCurrInfo.GetCompanyCode();
                lstcompdetails.Region_Code = _objCurrInfo.GetRegionCode();
                lstcompdetails.User_Code = _objCurrInfo.GetUserCode();
                lstcompdetails.Employee_Code = _objCurrInfo.GetEmployeeCode();
                lstcompdetails.Employee_Number = _objCurrInfo.GetEmployeeNumber();
                lstcompdetails.UserName = _objCurrInfo.GetUserName();
                lstcompdetails.User_Type_Code = _objCurrInfo.GetUserTypeCode();

                LoginParams = JsonConvert.SerializeObject(lstcompdetails);
                byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(LoginParams);
                LoginParams = Convert.ToBase64String(LoginParamsEncode);


                kraUrl = LoginParams;
                return kraUrl;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }
        #endregion KRA KRA Integration
        #region CRM Integration
        public string GetCRMURL()
        {

            CurrentInfo _objCurrInfo = new CurrentInfo();
            string LoginParams = string.Empty;
            string CRMURL = string.Empty;
            try
            {

                CompanyDetails lstcompdetails = new CompanyDetails();
                lstcompdetails.Company_Code = _objCurrInfo.GetCompanyCode();
                lstcompdetails.Region_Code = _objCurrInfo.GetRegionCode();
                lstcompdetails.User_Code = _objCurrInfo.GetUserCode();
                lstcompdetails.Employee_Code = _objCurrInfo.GetEmployeeCode();
                lstcompdetails.Employee_Number = _objCurrInfo.GetEmployeeNumber();
                lstcompdetails.UserName = _objCurrInfo.GetUserName();
                lstcompdetails.User_Type_Code = _objCurrInfo.GetUserTypeCode();

                LoginParams = JsonConvert.SerializeObject(lstcompdetails);
                byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(LoginParams);
                LoginParams = Convert.ToBase64String(LoginParamsEncode);


                CRMURL = LoginParams;
                return CRMURL;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }


        #endregion CRM


        public string GetGrievanceURL()
        {

            CurrentInfo _objCurrInfo = new CurrentInfo();
            string LoginParams = string.Empty;
            string GrievanceUrl = string.Empty;
            try
            {

                CompanyDetails lstcompdetails = new CompanyDetails();
                lstcompdetails.Company_Code = _objCurrInfo.GetCompanyCode();
                lstcompdetails.Region_Code = _objCurrInfo.GetRegionCode();
                lstcompdetails.Region_Name = _objCurrInfo.GetRegionName();
                lstcompdetails.User_Code = _objCurrInfo.GetUserCode();
                lstcompdetails.Employee_Code = _objCurrInfo.GetEmployeeCode();
                lstcompdetails.Employee_Number = _objCurrInfo.GetEmployeeNumber();
                lstcompdetails.Employee_Name = _objCurrInfo.GetEmployeeName();
                lstcompdetails.UserName = _objCurrInfo.GetUserName();
                lstcompdetails.User_Type_Code = _objCurrInfo.GetUserTypeCode();
                lstcompdetails.User_Type_Name = _objCurrInfo.GetUserTypeName();
                lstcompdetails.Role_Id = 0;


                LoginParams = JsonConvert.SerializeObject(lstcompdetails);
                byte[] LoginParamsEncode = System.Text.Encoding.UTF8.GetBytes(LoginParams);
                LoginParams = Convert.ToBase64String(LoginParamsEncode);


                GrievanceUrl = LoginParams;
                return GrievanceUrl;
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
                return string.Empty;
            }
        }

    }
}
