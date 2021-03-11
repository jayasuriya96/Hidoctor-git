using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class BeatPlanController : Controller
    {
        CurrentInfo _objCurrentInfo = new CurrentInfo();
        BL_BeatPlan _ObjBeat = new BL_BeatPlan();


        //Beat Plan Creation Screen
        public ActionResult CreateBeatPlan()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }

        //Beat Plan Approval 
        public ActionResult BeatPlanApproval()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }

        public ActionResult BeatPlanQuickTagging()
        {
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.User_Type_Code = _objCurrentInfo.GetUserTypeCode();
            return View();
        }




        #region Create Beat/Patch Plan
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public JsonResult GetAllWorkCategories(string companyCode)
        {
            List<WorkCategoryModel> lstWorkCategories = new List<WorkCategoryModel>();
            lstWorkCategories = _ObjBeat.GetAllWorkCategories(companyCode);
            return Json(lstWorkCategories, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetAllWorAreas(string companyCode, string regionCode, string workCategoryCode,int sfcValidation)
        {
            companyCode = _objCurrentInfo.GetCompanyCode();
            List<WorkAreaModel> lstWorkAreas = null;
            lstWorkAreas = _ObjBeat.GetAllWorkAreas(companyCode, regionCode, workCategoryCode, sfcValidation);
            return Json(lstWorkAreas, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetUserDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstUserModel = null;
            lstUserModel = _ObjBeat.GetUserDetails(companyCode, regionCode);
            return Json(lstUserModel, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="userCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public JsonResult GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            lstPrivileges = _ObjBeat.GetUserTypePrivileges(companyCode, regionCode, userCode, userTypeCode);
            return Json(lstPrivileges, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetSFCDetails(string companyCode, string regionCode)
        {
            List<SFCDetailsModel> lstSFCs = null;
            lstSFCs = _ObjBeat.GetSFCDetails(companyCode, regionCode);
            return Json(lstSFCs, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="_ObjBeatData"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult InsertBeatPlanDetails(string companyCode, string regionCode, string _ObjBeatData,int Weeknumber,string Weekday)
        {
            OutPutJsonBeatModel result = new OutPutJsonBeatModel();
            BeatPlanModel _objDetailsBeat = new BeatPlanModel();
            string companyId = "";
            companyId = _objCurrentInfo.GetCompanyId();
            int CompanyId = Convert.ToInt32(companyId);
            _objDetailsBeat = (BeatPlanModel)JsonConvert.DeserializeObject(_ObjBeatData, typeof(BeatPlanModel));
            result = _ObjBeat.InsertBeatPlanDetails(companyCode, regionCode, CompanyId, _objDetailsBeat, Weeknumber, Weekday);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="beatStatus"></param>
        /// <returns></returns>
        public JsonResult GetBeatPlanDetails(string companyCode, string regionCode, string beatStatus)
        {
            List<BeatPlanModel> lstBeatHeaderDetails = null;
            lstBeatHeaderDetails = _ObjBeat.GetBeatPlanDetails(companyCode, regionCode, beatStatus);
            return Json(lstBeatHeaderDetails, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateApproveorUnApproveBeat(string companyCode, string regionCode, string objBeatData)
        {
            try
            {
                OutPutJsonBeatModel result = new OutPutJsonBeatModel();
                List<BeatPlanModel> _objDetailsBeat = new List<BeatPlanModel>();
                string companyId = "";
                companyId = _objCurrentInfo.GetCompanyId();
                int CompanyId = Convert.ToInt32(companyId);
                _objDetailsBeat = (List<BeatPlanModel>)JsonConvert.DeserializeObject(objBeatData, typeof(List<BeatPlanModel>));
                result = _ObjBeat.UpdateApproveorUnApproveBeat(companyCode, CompanyId, regionCode, _objDetailsBeat);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetRegionDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstRegionDetails = null;
            lstRegionDetails = _ObjBeat.GetRegionDetails(companyCode, regionCode);
            return Json(lstRegionDetails, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetApprovedBeatsByRegion(string companyCode, string regionCode)
        {
            List<BeatPlanModel> lstBeatDetails = null;
            lstBeatDetails = _ObjBeat.GetApprovedBeatsByRegion(companyCode, regionCode);
            return Json(lstBeatDetails, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="_ObjParamData"></param>
        /// <returns></returns>
        public JsonResult GetAllMasterandMappedDataByRegion(string companyCode, string _ObjParamData)
        {
            MasterDataParamModel _ObjMasterData = null;
            List<dynamic> lstMasterData = new List<dynamic>();
            _ObjMasterData = (MasterDataParamModel)JsonConvert.DeserializeObject(_ObjParamData, typeof(MasterDataParamModel));
            lstMasterData = _ObjBeat.GetAllMasterandMappedDataByRegion(companyCode, _ObjMasterData);
            //Newtonsoft.Json.JsonConvert.SerializeObject(lstMasterData);
            return Json(Newtonsoft.Json.JsonConvert.SerializeObject(lstMasterData), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="_lstTaggingDataDetails"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult InsertBeatToMasterDataTagging(string companyCode, string _lstTaggingDataDetails)
        {
            List<MasterDataTaggedModel> _lstTaggedData = new List<MasterDataTaggedModel>();
            OutPutJsonBeatModel result = new OutPutJsonBeatModel();
            _lstTaggedData = (List<MasterDataTaggedModel>)JsonConvert.DeserializeObject(_lstTaggingDataDetails, typeof(List<MasterDataTaggedModel>));
            result = _ObjBeat.InsertBeatToMasterDataTagging(companyCode, _lstTaggedData);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetAllPieChartDetails(string companyCode, string regionCode,string onceormultiplePriv)
        {
            PieChartWrapperModel _ObjPieDetails = new PieChartWrapperModel();
            _ObjPieDetails = _ObjBeat.GetAllPieChartDetails(companyCode, regionCode, onceormultiplePriv);
            return Json(_ObjPieDetails, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="beatCode"></param>
        /// <param name="beatType"></param>
        /// <returns></returns>
        public JsonResult GetBeatWiseDetails(string companyCode, string regionCode, string beatCode, string beatType)
        {
            BeatWrapperModel _ObjBeatDetails = new BeatWrapperModel();
            _ObjBeatDetails = _ObjBeat.GetBeatWiseDetails(companyCode, regionCode, beatCode, beatType);
            return Json(_ObjBeatDetails, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="customerCode"></param>
        /// <param name="customerEntityType"></param>
        /// <param name="gridId"></param>
        /// <returns></returns>
        public JsonResult GetEntityWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            CustomerEntityModel _ObjDoctor = new CustomerEntityModel();
            ChemistEntityModel _ObjChemist = new ChemistEntityModel();
            StockistEntityModel _ObjStockist = new StockistEntityModel();
            object _objreturn = new object();
            if (customerEntityType.ToUpper() == "DOCTOR")
            {
                _ObjDoctor = _ObjBeat.GetDoctorWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
                _objreturn = _ObjDoctor;

            }
            else if (customerEntityType.ToUpper() == "CHEMIST")
            {
                _ObjChemist = _ObjBeat.GetChemistWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
                _objreturn = _ObjChemist;
            }
            else if (customerEntityType.ToUpper() == "STOCKIEST")
            {
                _ObjStockist = _ObjBeat.GetStockistWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
                _objreturn = _ObjStockist;
            }
            return Json(_objreturn, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBeatHistoryDetails(string companyCode, string beatCode, string regionCode)
        {
            return Json(_ObjBeat.GetBeatHistoryDetails(companyCode, beatCode, regionCode), JsonRequestBehavior.AllowGet);
        }
        //public JsonResult GetDoctordetails(string companyCode, string regionCode, string type)
        //{
        //    DoctordetailModel _Objdetailmodel = new DoctordetailModel();
        //    _Objdetailmodel = _ObjBeat.GetDoctordetails(companyCode, regionCode, type);
        //    return Json(_Objdetailmodel, JsonRequestBehavior.AllowGet);
        //}
        public JsonResult GetDoctordetails(string companyCode, string regionCode, string type)
        {
            List<DoctordetailModel> _Objdetailmodel = null;
            _Objdetailmodel = _ObjBeat.GetDoctordetails(companyCode, regionCode,type);
            return Json(_Objdetailmodel, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}