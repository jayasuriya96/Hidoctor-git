using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using System.Configuration;
using System.IO;
using System.Text;

namespace HiDoctor_Master.Controllers
{
    public class RegionWeekendMappingController : Controller
    {
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.BLWeekendGroup _objBLWeekendGroup = new DataControl.BLWeekendGroup();
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        // GET: /RegionWeekendMapping/

        public ActionResult Index()
        {
            ViewBag.thisMonth = DateTime.Now.ToString("MM");
            ViewBag.thisYear = DateTime.Now.ToString("yyyy");

            return View();
        }

        //
        // GET: /RegionWeekendMapping/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /RegionWeekendMapping/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /RegionWeekendMapping/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RegionWeekendMapping/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /RegionWeekendMapping/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RegionWeekendMapping/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /RegionWeekendMapping/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public JsonResult GetWeekendGroupHeader()
        {

            List<MVCModels.HiDoctor_Master.WeekendGroup> lstWeekendGroupModel = _objBLWeekendGroup.GetWeekendGroupHeader();
            return Json(_objJson.Serialize(lstWeekendGroupModel));
        }

        public string InsertWeekendGroup(string weekendOffGroup, string regionCodes, string effectiveFrom, string effectiveTo, string status)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();

            return _objBLWeekendGroup.RegionWeekendGroupMapping(weekendOffGroup, regionCodes, effectiveFrom, effectiveTo, status);
        }

        public JsonResult GetMappingGroupHeader(string RegionCodes)
        {
            List<MVCModels.HiDoctor_Master.WeekendGroup> lstWeekendGroupModel = _objBLWeekendGroup.GetMappingGroupHeader(RegionCodes);
            return Json(_objJson.Serialize(lstWeekendGroupModel));
        }
        public JsonResult GetWeekendGroup(FormCollection collection)
        {
            try
            {
                string RegionCode = string.Empty;
                RegionCode = collection["RegionCode"];
                string mode = string.Empty;
                mode = collection["Mode"];

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objSPData.GetWeekendgroupdetail(_objcurrentInfo.GetCompanyCode(), RegionCode, mode);
                //dsReport = _objData.ExecuteDataSet("EXEC SP_hdGETRegionWeekengGroupMapping " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + RegionCode + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //update the mapping

        public string UpdateWeekendGroup(string weekendOffCode, string regionCode, string effectiveFrom, string effectiveto, string status, string oldeffectiveFrom, string oldeffectiveto)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();

            return _objBLWeekendGroup.RegionWeekendGroupMappingUpdate(weekendOffCode, regionCode, effectiveFrom, effectiveto, status,oldeffectiveFrom,oldeffectiveto);
        }

    }
}
