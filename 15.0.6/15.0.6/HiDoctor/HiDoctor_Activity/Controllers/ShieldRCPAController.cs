using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class ShieldRCPAController : Controller
    {
        //
        // GET: /ShieldRCPA/
        BL_ShieldRCPA _objBLShieldRCPA = new BL_ShieldRCPA();
        public ActionResult Index()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            ViewBag.Companycode = objCurInfo.GetCompanyCode();
            ViewBag.ErrorCode = "";
            return View();
        }
        [HttpPost]
        public ActionResult RCPAExcelBulkAddResult(HttpPostedFileBase file, FormCollection form)
        {
            string result = "";
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            MVCModels.ShieldRCPA objrcpaHeader = new MVCModels.ShieldRCPA();
            objrcpaHeader.Company_Id = Convert.ToInt32(_objCurInfo.GetCompanyId());
            objrcpaHeader.Company_code = _objCurInfo.GetCompanyCode();
            objrcpaHeader.user_code = _objCurInfo.GetUserCode();
            DateTime dt = DateTime.ParseExact(Request.Form["FromDate"].ToString(), "dd-MM-yyyy", CultureInfo.InvariantCulture);
            objrcpaHeader.PeriodFrom = Convert.ToDateTime(dt.ToString("yyyy-MM-dd"));
            dt = DateTime.ParseExact(Request.Form["ToDate"].ToString(), "dd-MM-yyyy", CultureInfo.InvariantCulture);
            objrcpaHeader.PeriodTo = Convert.ToDateTime(dt);

            string subDomain = _objCurInfo.GetSubDomain();
            result = _objBLShieldRCPA.InsertRCPAExcelBulkUpload(subDomain, _objCurInfo.GetCompanyCode(), _objCurInfo.GetRegionCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(), objrcpaHeader);
            ViewBag.ErrorCode = result;
            return View("RCPAExcelBulkAddResult");
        }
        public ActionResult RCPABatchIndex()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            ViewBag.Companycode = objCurInfo.GetCompanyCode();
            ViewBag.ErrorCode = "";
            return View();
        }

    }
}
