using MVCModels;
using System;
using DataControl;

using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl.Impl;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4;
namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4ChemistVisitController : Controller
    {
        //
        // GET: /DCRV4ChemistVisit/
        BL_DCRChemistVisit objBLDCRChemistVisit;
        private DataControl.CurrentInfo _objCurrentInfo = null;

        public ActionResult Index()
        {
            return View();
        }
        public PartialViewResult ChemistDetails()
        {
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            return PartialView();
        }
        public JsonResult InsertDCRChemistVisitData(DCRChemistVisit objChemistVisit)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();

            return Json(objBLDCRChemistVisit.InsertDCRChemistVisitData(objChemistVisit));
        }
        public JsonResult GetChemistVisitDatils(string type, string DCR_Date, int CV_Visit_Id)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            return Json(objBLDCRChemistVisit.GetChemistVisitDatils(type, DCR_Date, CV_Visit_Id));
        }
        public string DeleteChemistVisitData(int CV_Visit_Id)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            return objBLDCRChemistVisit.DeleteChemistVisitData(CV_Visit_Id);
        }
        public PartialViewResult DCRV4ChemistContactDetails()
        {
            return PartialView();
        }
        public PartialViewResult DCRV4ChemistDetailProduct()
        {
            return PartialView();
        }
        public PartialViewResult FollowUps()
        {
            return PartialView();
        }
        public PartialViewResult DCRV4ChemistPOB()
        {
            return PartialView();
        }
        public PartialViewResult DCRV4ChemistRCPA()
        {
            return PartialView();
        }
        public string GetRCPA_ChemistPrevilageCheck(string dcr_date)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            return objBLDCRChemistVisit.GetRCPA_ChemistPrevilageCheck(_objCurrentInfo.GetUserCode(), Convert.ToDateTime(dcr_date), _objCurrentInfo.GetCompanyCode());
        }
        public string GetAccompanistMandatoryInChemistVisit(string dcr_date)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            return objBLDCRChemistVisit.GetAccompanistMandatoryInChemistVisit(_objCurrentInfo.GetUserCode(), Convert.ToDateTime(dcr_date), _objCurrentInfo.GetCompanyCode());
        }
        public string GetChemistAccMandatory(string DCR_Date)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            string Company_Code = _objCurrentInfo.GetCompanyCode();
            string User_Code = _objCurrentInfo.GetUserCode();

            return objBLDCRChemistVisit.GetChemistAccMandatory(Company_Code, User_Code, DCR_Date);
        }

        public string GetChemistVisitPrivilegeforReport(string region_Code, string userCode,string flag)
        {
            objBLDCRChemistVisit = new BL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            return objBLDCRChemistVisit.GetRegionModuleAccess(_objCurrentInfo.GetRegionCode(), userCode, flag);
        }
        public string GetDoctorSufPreColumns()
        {
            IConfigSettings IConfig_Settings = new Config_Settings();
            _objCurrentInfo = new CurrentInfo();
            return IConfig_Settings.GetConfigDefaultValue(_objCurrentInfo.GetCompanyCode(), CONFIG_TYPE.DCR, CONFIG_KEY.DCR_DOCTOR_SUFIX_COLUMNS);

        }
    }
}
