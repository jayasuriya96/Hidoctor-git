using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
using System.Text;
namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class MobileMenuController : Controller
    {
        //
        // GET: /MobileMenu/
        #region Private variales

        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.SPData objSP = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        private IConfigSettings IConfig_Settings = null;
        #endregion

        public ActionResult Index()
        {

            //ViewBag.User_Name = Session["User_Name"].ToString();
            //if (DataControl.CurrentInfo.IsMobile(Request.UserAgent.ToString()))
            //{
            //return View("Index.Mobile");
            //}
            //else
            //{
            //return View();
            //}
            return RedirectToAction("Index", "Home");
        }
        public JsonResult GetNotification(FormCollection collection)
        {
            try
            {
                DataSet dsCategory = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_mhdGetNotification '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "'");
                }
                return Json(_objJson.Serialize(dsCategory), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetChildUsers()
        {
            MasterController mc = new MasterController();
            JsonResult childUsersJson = mc.GetChildUsersJSON(objCurr.GetCompanyCode(), objCurr.GetUserCode());
            return childUsersJson;
        }

        public string GetDCRVersion()
        {
            IConfig_Settings = new Config_Settings();
            string companyCode = objCurr.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrTimeGapValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_VERSION);

            // Returns the dcrTimeGapValue.
            return dcrTimeGapValue;
        }



    }
}

