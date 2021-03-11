using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;


namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class DashBoardV2Controller : Controller
    {
        //
        // GET: /DashBoardV2/
        DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.BLDashBoardV2 _objDashboardV2 = new DataControl.BLDashBoardV2();

        public void GetPrivillegeValue()
        {
            string DOCTOR_CAPTION;
            string STOCKIEST_CAPTION;
            string CHEMIST_CAPTION;
            DOCTOR_CAPTION = _objCurrentInfo.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");

            if (DOCTOR_CAPTION.Length >= 10)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(9) + "...";

            }

            STOCKIEST_CAPTION = _objCurrentInfo.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 10)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(9) + "...";

            }
            CHEMIST_CAPTION = _objCurrentInfo.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            ViewBag.doctor_caption = DOCTOR_CAPTION;
            ViewBag.stockist_caption = STOCKIEST_CAPTION;
            ViewBag.chemist_caption = CHEMIST_CAPTION;

        }


        public ActionResult DashboardV2()
        {
            GetPrivillegeValue();
            return View();
        }



        public JsonResult GetPrimarySecondaryWithTarget(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            _objDashboardV2.Flag = _objData.Flag;
            return Json(_objDashboardV2.GetPrimarySecondarywithTarget().ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetProductWisePerformance(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            _objDashboardV2.ProductCode = _objData.ProductCode;
            return Json(_objDashboardV2.GetProductWisePerformance().ToList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetJoinerAttrition(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            return Json(_objDashboardV2.GetJoinerAttrition(), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetDrCoverage(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.RegionCode = _objCurrentInfo.GetRegionCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            _objDashboardV2.CoverageInput = _objData.CoverageInput;
            return Json(_objDashboardV2.GetDrCoverage().ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDivision()
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.RegionCode = _objCurrentInfo.GetRegionCode();
            return Json(_objDashboardV2.GetDivisions().ToList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProductName()
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();

            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            return Json(_objDashboardV2.GetProductName().ToList(), JsonRequestBehavior.AllowGet);
        }


        // DashboardV2-Version2


        public ActionResult Index()
        {
            GetPrivillegeValue();
            return View();
        }

        public JsonResult GetDivisionList()
        {
            _objDashboardV2.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            return Json(_objDashboardV2.GetDivisionList().ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPOBDetails(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            return Json(_objDashboardV2.GetPOBDetails(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTimeInvestment(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.Flag = _objData.Flag;
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            return Json(_objDashboardV2.GetTimeInvestment().ToList(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCallAVerage(string Division_Code, string flag)
        {
            DataSet ds = new DataSet();
            string User_Code = _objCurrentInfo.GetUserCode();
            ds = _objSPData.GetCallAVerage(User_Code, Division_Code, flag);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductiveCallAverage(string Division_Code, string flag)
        {
            DataSet ds = new DataSet();
            string User_Code = _objCurrentInfo.GetUserCode();
            ds = _objSPData.GetProductiveCallAverage(User_Code, Division_Code, flag);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTPTimeLag(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            _objDashboardV2.Flag = _objData.Flag;
            _objDashboardV2.Deviation = _objData.Deviation;
            return Json(_objDashboardV2.GetTPTimeLag().ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDCRTimeLag(MVCModels.DashboardV2Model _objData)
        {
            _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            _objDashboardV2.Flag = _objData.Flag;
            return Json(_objDashboardV2.GetDCRTimeLag().ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStates(string DivisionCode = "ALL")
        {
            string RegionCode = _objCurrentInfo.GetRegionCode();
            List<string> States = new List<string>();
            States = _objDashboardV2.GetStates(DivisionCode, RegionCode);

            return Json(new { states = States }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCRMData(string DivisionCode = "ALL", string state = "ALL")
        {
            MVCModels.DashboardV2Model _objData = new MVCModels.DashboardV2Model();
            _objData.UserCode = _objCurrentInfo.GetUserCode();
            _objData.RegionCode = _objCurrentInfo.GetRegionCode();
            _objData.DivisionCode = DivisionCode;
            _objData.State = state;
            IEnumerable<MVCModels.CRMModel> LstCRMData;
            List<MVCModels.CRMModel> LstCRMData_CHEMIST = new List<MVCModels.CRMModel>();
            List<MVCModels.CRMModel> LstCRMData_DOCTOR = new List<MVCModels.CRMModel>();
            LstCRMData = _objDashboardV2.GetCRMData(_objData);
            LstCRMData_CHEMIST = LstCRMData.Where(m => m.Entity == "CHEMIST").ToList();
            LstCRMData_DOCTOR = LstCRMData.Where(m => m.Entity == "DOCTOR").ToList();
            return Json(new { CRMData_CHEMIST = LstCRMData_CHEMIST, CRMData_DOCTOR = LstCRMData_DOCTOR }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSpecialitywiseDoctorCount(string Division_Code = "ALL")
        {
            DataSet ds = new DataSet();
            string UserCode = _objCurrentInfo.GetUserCode();
            string RegionCode = _objCurrentInfo.GetRegionCode();
            ds = _objSPData.GetSpecialitywiseDoctorCount(UserCode, RegionCode, Division_Code);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStockistSale(MVCModels.DashboardV2Model _objData)
        {
            //  _objDashboardV2.UserCode = _objCurrentInfo.GetUserCode();
            _objDashboardV2.RegionCode = _objCurrentInfo.GetRegionCode();
            _objDashboardV2.DivisionCode = _objData.DivisionCode;
            //   _objDashboardV2.Flag = _objData.Flag;
            return Json(_objDashboardV2.GetStockistSale(), JsonRequestBehavior.AllowGet);

        }
        public ActionResult MenuBar()
        {
            return View();
        }
        public ActionResult OzoneDashBoard()
        {
            GetPrivillegeValue();
            return View();
        }
        public ActionResult TargetDashboardV2()
        {
            return PartialView();
        }
        public ActionResult ProductDashBoardV2()
        {
            return PartialView();
        }

        public ActionResult JoinAttrionDashboardV2()
        {
            return PartialView();
        }

        public ActionResult CategoryCoverageDashBoard()
        {

            GetPrivillegeValue();
            return View();
        }

        public ActionResult CRMDashboard()
        {
            GetPrivillegeValue();
            return PartialView();
        }
        public ActionResult SpecialityDashBoard()
        {
            GetPrivillegeValue();
            return PartialView();
        }
        public ActionResult StockistsSale()
        {
            GetPrivillegeValue();
            return PartialView();
        }



        public string DashboardHome()
        {
            var strUrl = "";
            string userTypeCategory = _objCurrentInfo.GetUserTypeCategory();
            if (userTypeCategory == "FIELD_USER")
            {
                strUrl = "Dashboard/UserDashboard";
            }
            else
            {
                // strUrl = "DashboardV2/DashBoardV2";
                //strUrl = "Home/Home";
                strUrl = "DashBoard/AdminDashBoard";
            }
            return userTypeCategory;
        }
    }


}
