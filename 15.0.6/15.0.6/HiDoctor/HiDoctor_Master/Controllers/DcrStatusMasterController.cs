using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using System.Text;
using DataControl.HD_MasterFactoryClasses;
using MVCModels.HiDoctor_Master;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class DcrStatusMasterController : Controller
    {
        BL_DcrStatusMaster _objBLDcrStatusMaster = new BL_DcrStatusMaster();
        public ActionResult DcrStatusMaster()
        {
            return View();
        }

        public string GetAllDivisions()
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = string.Empty;
            companyCode = objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.DivisionModel> lstDivision = new List<MVCModels.HiDoctor_Master.DivisionModel>();
            lstDivision = _objBLDcrStatusMaster.GetAllDivisions(companyCode).ToList();
            strContent.Append("<option value=''>-Select Division-</option>");
            if (lstDivision.Count > 0)
            {
                foreach (var dr in lstDivision)
                {
                        strContent.Append("<option value='" + dr.Division_Code + "'>" + dr.Division_Name + "</option>");
                }
            }
            return strContent.ToString();
        }

        public JsonResult GetDcrStatusDetails(string DivisionCode, string Usertypecode, string Status, string Catagory)
        {
           
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DCRStatusModel> lstUsrLvDet = new List<MVCModels.HiDoctor_Master.DCRStatusModel>();
            lstUsrLvDet = _objBLDcrStatusMaster.GetDcrStatusDetails(DivisionCode, Usertypecode, Status, Catagory);
            return Json(lstUsrLvDet, JsonRequestBehavior.AllowGet);
        }

        public int UpdateRecordStatus(string DivisionCode, string Usertypecode, string Status, string Catagory, string Statusname, int Recstatus)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            result = _objBLDcrStatusMaster.UpdateRecordStatus(DivisionCode, Usertypecode, Status, Catagory, Statusname, Recstatus);
            return result;
        }

        public int AddNewStatus(string Division, string Usertype, string Status, string Catagory, string NewStatus)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string username = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.AddNewStatus(companyCode, username, Usertype, Division, Status, Catagory, NewStatus);
            return result;
        }

        public string GetUnderUserTypes()
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string userCode = objCurInfo.GetUserCode();
                string companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                lstUserType = _objBLDcrStatusMaster.GetUnderUserTypes(companyCode, userCode).ToList();
                strContent.Append("<option value=''>-Select User Type-</option>");
                if (lstUserType.Count > 0)
                {
                    foreach (var dr in lstUserType)
                    {
                            strContent.Append("<option value='" + dr.User_Type_Code + "'>" + dr.User_Type_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
        }

        public JsonResult GetMappedRegion()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            lstRegDet = _objBLDcrStatusMaster.GetMappedRegion();
            return Json(lstRegDet, JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetMappedHospRegion()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            lstRegDet = _objBLDcrStatusMaster.GetMappedHospRegion();
            return Json(lstRegDet, JsonRequestBehavior.AllowGet);

        }
       


        public bool InsertMappedRegions(List<DCRRegionModel> lstRegions)
        {
            bool result = false;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.InsertMappedRegions(lstRegions, UserName);
            return result;
        }
        public bool InsertMappedHospitalRegions(List<DCRRegionModel> lstRegions)
        {
            bool result = false;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.InsertMappedHospitalRegions(lstRegions, UserName);
            return result;
        }
        



        public int UnmapRegions(string Regioncode)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.UnmapRegions(Regioncode, UserName);
            return result;
        }
        public int UnMapHospitalRegions(string Regioncode)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.UnMapHospitalRegions(Regioncode, UserName);
            return result;
        }

        ///DcrStatusMaster for HospitalField/////
        public bool InsertMappedHospitalRegionsField(List<DCRRegionModel> lstRegions)
        {
            bool result = false;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.InsertMappedHospitalRegionsField(lstRegions, UserName);
            return result;
        }
        public JsonResult GetMappedHospRegionField()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            lstRegDet = _objBLDcrStatusMaster.GetMappedHospRegionField();
            return Json(lstRegDet, JsonRequestBehavior.AllowGet);

        }


        public int UnMapHospitalRegionsField(string Regioncode)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = _objBLDcrStatusMaster.UnMapHospitalRegionsField(Regioncode, UserName);
            return result;
        }
                     ///End///
    }
}