using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;

namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class MenuController : Controller
    {
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewReportMenu()
        {
            return View();
        }

        public JsonResult GetReportsMenu(FormCollection collection)
        {
            DataSet dsReport = new DataSet();
            DataControl.JSONConverter json = new DataControl.JSONConverter();

            dsReport = _objSPData.GetSFAWAReportsMenu(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserTypeCode());

            return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetNewReportsMenu(FormCollection collection)
        {

            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetUserMenuScreen '" + _objcurrentInfo.GetCompanyCode() + "', '" + _objcurrentInfo.GetUserTypeCode() + "'");
          
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}
