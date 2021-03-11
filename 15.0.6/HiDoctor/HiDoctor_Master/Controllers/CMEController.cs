using DataControl;
using DataControl.HD_MasterFactoryClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HiDoctor_Master.Models;
namespace HiDoctor_Master.Controllers
{
    public class CMEController : Controller
    {
        CurrentInfo _objCurrentInfo = new CurrentInfo();
        //BL_CME _ObjCME = new BL_CME();

        public ActionResult CMEDefinition()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }

        public ActionResult RecordCME()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }

        //public JsonResult GetRegionDetails(string companyCode, string regionCode)
        //{
        //    List<CMEUserDetailsModel> lstRegionDetails = null;
        //    lstRegionDetails = _ObjCME.GetRegionDetails(companyCode, regionCode);
        //    return Json(lstRegionDetails, JsonRequestBehavior.AllowGet);
        //}
        public ActionResult CMEProductTracking(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
                ViewBag.User_Code = _objCurrentInfo.GetUserCode();
                ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
                ViewBag.Company_Code = dd.Company_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.Region_Code = dd.Region_Code;
                ViewBag.User_Code = dd.User_Code;
               // ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public ActionResult MarketingCampaignProductTracking(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
                ViewBag.User_Code = _objCurrentInfo.GetUserCode();
                ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
                ViewBag.Company_Code = dd.Company_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.Region_Code = dd.Region_Code;
                ViewBag.User_Code = dd.User_Code;
               // ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public ActionResult CMEPlanning()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }
        public ActionResult CMEApproval()
        {

            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }
        public ActionResult MCTrackerReleaseScreen(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
                ViewBag.User_Code = _objCurrentInfo.GetUserCode();
                ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
                ViewBag.Company_Code = dd.Company_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.Region_Code = dd.Region_Code;
                ViewBag.User_Code = dd.User_Code;
               // ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public ActionResult CMETrackerReleaseScreen(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
                ViewBag.User_Code = _objCurrentInfo.GetUserCode();
                ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
                ViewBag.Company_Code = dd.Company_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.Region_Code = dd.Region_Code;
                ViewBag.User_Code = dd.User_Code;
              //  ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public string GetPrivilegeValue(string userCode, string privilegeName)
        {
            string pri = "";
            BLMaster obj = new BLMaster();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            pri = obj.GetPrivilegeValue(companyCode, userCode, privilegeName);
            return pri;
        }
    }
}
