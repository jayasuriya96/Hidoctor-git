using DataControl.HiDoctor_ReportsFactoryClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Reports.Controllers
{
    [DataControl.AjaxSessionActionFilter]
    public class EdReportsController : Controller
    {
        #region private variables
        DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion private variables

        #region Top 10 Asset-SpecialityWise
        public ActionResult SpecialityWiseTop10AssetReport()
        {
            return View();
        }

        public JsonResult GetSpeciality()
        {
            BL_EdReports _objRpt = new BL_EdReports();
            return Json(_objRpt.GetSpeciality(_objcurrentInfo.GetSubDomain()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSpecialityWiseAnalyticsReport(string RegionCode, string spl_Name, int Spl_Month, int Spl_Year, int IsTeam)
        {
            BL_EdReports _objRpt = new BL_EdReports();
            return Json(_objRpt.GetSpecialityWiseAnalyticsReport(RegionCode, spl_Name, Spl_Month, Spl_Year, IsTeam, _objcurrentInfo.GetSubDomain()));
        }
        #endregion Top 10 Asset-SpecialityWise
        #region Top 10 Asset-CategoryWise
        public ActionResult CategoryWiseTop10AssetReport()
        {
            return View();
        }
        public JsonResult GetCategory()
        {
            BL_EdReports _objRpt = new BL_EdReports();
            return Json(_objRpt.GetCategory(_objcurrentInfo.GetSubDomain()), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCategoryWiseAnalyticsReport(string RegionCode, string Category_Name, int Category_Month, int Category_Year, int IsTeam)
        {
            BL_EdReports _objRpt = new BL_EdReports();
            return Json(_objRpt.GetCategoryWiseAnalyticsReport(RegionCode, Category_Name, Category_Month, Category_Year, IsTeam, _objcurrentInfo.GetSubDomain()));
        }
        #endregion Top 10 Asset-SpecialityWise
        #region SpecialityWise-and Asset-eDetailing
        public ActionResult SpecialityWiseEDetailingReport()
        {
            return View();
        }
        public JsonResult GetSpecialityWiseEdetailing(string RegionCode, string Spl_Month, string Spl_Year, string IsTeam)
        {
            DataSet ds = new DataSet();
            BL_EdReports _objRpt = new BL_EdReports();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            string period = Spl_Year + "-" + Spl_Month + "-01";
            ds = _objRpt.GetSpecialityWiseEdetailing(RegionCode, _objcurrentInfo.GetSubDomain(), period, IsTeam);
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAssertDetails(string regionCode, string speciality_Code, string category_Code, string period)
        {
            BL_EdReports _objRpt = new BL_EdReports();
            DataSet ds = _objRpt.GetAssertDetails(regionCode, speciality_Code, category_Code, period, _objcurrentInfo.GetSubDomain());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public ActionResult AssetWiseEDetailingReport()
        {
            return View();
        }
        public JsonResult GetAssetWiseEdetailing(string RegionCode, string Spl_Month, string Spl_Year, string IsTeam)
        {
            DataSet ds = new DataSet();
            BL_EdReports _objRpt = new BL_EdReports();
            string period = Spl_Year + "-" + Spl_Month + "-01";
            ds = _objRpt.GetAssetWiseEdetailing(RegionCode, _objcurrentInfo.GetSubDomain(), period, IsTeam);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDoctorDetails(string regionCode, string speciality_Code, string category_Code, string period)
        {
            BL_EdReports _objRpt = new BL_EdReports();
            DataSet ds = _objRpt.GetDoctorDetails(regionCode, speciality_Code, category_Code, period, _objcurrentInfo.GetSubDomain());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        #endregion SpecialityWise-eDetailing

    }
}