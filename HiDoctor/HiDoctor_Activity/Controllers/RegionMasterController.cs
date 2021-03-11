using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class RegionMasterController : Controller
    {
        //
        // GET: /RegionMaster/
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /RegionMaster/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /RegionMaster/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /RegionMaster/Create

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
        // GET: /RegionMaster/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /RegionMaster/Edit/5

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
        // GET: /RegionMaster/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /RegionMaster/Delete/5

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
        public JsonResult GetRegionMasterDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();
            ds = _objSPData.GetRegionMasterDetails();
             DataControl.JSONConverter json = new  DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
    }
}
