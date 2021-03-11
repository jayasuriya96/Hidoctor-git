using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using ElmahWrapper;

namespace HiDoctor.Controllers
{
    public class WideAngleController : Controller
    {
        //
        // GET: /WideAngle/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /WideAngle/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /WideAngle/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /WideAngle/Create

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
        // GET: /WideAngle/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /WideAngle/Edit/5

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
        // GET: /WideAngle/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /WideAngle/Delete/5

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

        public string IsEDMenuAvaailable()
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            BL_WideAngle objWA = new BL_WideAngle();
            
            string companyCode = objCurInfo.GetCompanyCode();
            string userTypeCode = objCurInfo.GetUserTypeCode();
            if (objWA.IsEDAvailable(companyCode, userTypeCode))
            {
                return "Y";
            }
            else
            {
                return "N";
            }
            
        }

        public string GetWideAngleURL()
        {
            CurrentInfo objCurInfo = new CurrentInfo();
            string wideAngleUrl = string.Empty;
            try
            {
                string companyCode = objCurInfo.GetCompanyCode();
                string userTypeCode = objCurInfo.GetUserTypeCode();
                string userCode = objCurInfo.GetUserCode();
                string waUrl =objCurInfo.GetWideAngleUrl();
                string sessionId = objCurInfo.GetSessionId();
                string regionCode = objCurInfo.GetRegionCode();
                string userName = objCurInfo.GetUserName();

                if (!string.IsNullOrEmpty(waUrl))
                {
                    wideAngleUrl = "" + waUrl + "?User_Code=" + userCode + "&Comp_Code=" + companyCode + "&Session_Id=" + sessionId + "&Return_URL=" + Request.Url.Authority + "&User_Type_Code=" + userTypeCode + "&Region_Code=" + regionCode + "&User_Name=" + userName + "";
                }
                return wideAngleUrl;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetWideAngleURL()");
                return ex.Message.ToString();
            }
        }
    }
}
