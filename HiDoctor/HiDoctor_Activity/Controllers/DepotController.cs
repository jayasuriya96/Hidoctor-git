using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels.HiDoctor_Master;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DepotController : Controller
    {
        #region Private Variables        
        private DataControl.CurrentInfo _objCurrentInfo;
        #endregion Private Variables

        public ActionResult Index()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult GetDepotMasterDetails()
        {
            BL_DepotMaster _objdepotMaster = new BL_DepotMaster();
            List<DepotModel> lstDepModel = new List<DepotModel>();
            lstDepModel = _objdepotMaster.GetDepotDetails();
            return Json(lstDepModel, JsonRequestBehavior.AllowGet);
        }
        public int InsertDepotMaster(string DepCode, string DepName, string DepShtName, string Add1, string Add2, string phne, string mob, string DLN1, string DLN2, string GST, string RKey1)
        {
            BL_DepotMaster _objdepotMaster = new BL_DepotMaster();
            return _objdepotMaster.InsertDepotDetails(DepCode, DepName, DepShtName, Add1, Add2, phne, mob, DLN1, DLN2, GST, RKey1);
        }

        public ActionResult SearchDepotMasterDetails(string Comp_Code, string Depot_Code, string Depot_Name)
        {
            BL_DepotMaster _objdepotMaster = new BL_DepotMaster();
            List<DepotModel> lstDepModel = new List<DepotModel>();
            lstDepModel = _objdepotMaster.FindDepotDetails(Comp_Code, Depot_Code, Depot_Name);
            return Json(lstDepModel, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateRecordStatus(string CompanyCode, string DepotCode, string DepotName)
        {
            BL_DepotMaster _objdepotMaster = new BL_DepotMaster();
            int lstResult = 0;
            lstResult = _objdepotMaster.ChangingRecordStatus(CompanyCode, DepotCode, DepotName);
            return Json(lstResult, JsonRequestBehavior.AllowGet);
        }
    }
}