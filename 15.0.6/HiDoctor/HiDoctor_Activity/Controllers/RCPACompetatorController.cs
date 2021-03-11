using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class RCPACompetatorController : Controller
    {
        //
        // GET: /RCPACompetator/
        BL_RCPACompetator _objBLRCPACompetator = new BL_RCPACompetator();
        public ActionResult Index()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            ViewBag.Companycode = objCurInfo.GetCompanyCode();
            ViewBag.RegionCode = objCurInfo.GetRegionCode();
            ViewBag.ErrorCode = "";
            return View();
        }
        [HttpPost]
        public string Index(FormCollection form)
        {
            string result = "";
            HttpPostedFileBase file = Request.Files[0];
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            MVCModels.RCPA_Header objrcpaHeader = new MVCModels.RCPA_Header();
            objrcpaHeader.Company_Id = Convert.ToInt32(_objCurInfo.GetCompanyId());
            objrcpaHeader.Company_code = _objCurInfo.GetCompanyCode();
            objrcpaHeader.user_code = _objCurInfo.GetUserCode();
            // objrcpaHeader.Region_Code = _objCurInfo.GetRegionCode();
            // objrcpaHeader.PeriodTo = DateTime.Now;
            //objrcpaHeader.PeriodFrom = DateTime.Now;
            try
            {
                DateTime dt = DateTime.ParseExact(Request.Form["txtPeriodFrom"].ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                objrcpaHeader.PeriodFrom = Convert.ToDateTime(dt.ToString("yyyy-MM-dd"));
                dt = DateTime.ParseExact(Request.Form["txtPeriodTo"].ToString(), "dd/MM/yyyy", CultureInfo.InvariantCulture);
                objrcpaHeader.PeriodTo = Convert.ToDateTime(dt);
                objrcpaHeader.Region_Code = Request.Form["hdnRegion_Code"].ToString();
                string subDomain = _objCurInfo.GetSubDomain();
                result = _objBLRCPACompetator.RCPAExcelBulkAddResult(subDomain, _objCurInfo.GetCompanyCode(), _objCurInfo.GetRegionCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(), objrcpaHeader);
                ViewBag.ErrorCode = result;
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                ViewBag.Companycode = objCurInfo.GetCompanyCode();
                ViewBag.RegionCode = objCurInfo.GetRegionCode();
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        public JsonResult GetExcelList(string Regioncode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string Companycode= objCurInfo.GetCompanyCode();
            List<RcpaExcelUpload> lstfiles = new List<RcpaExcelUpload>();
            lstfiles = _objBLRCPACompetator.GetExcelList(Companycode, Regioncode);
            return Json(lstfiles, JsonRequestBehavior.AllowGet);
        }

    }
}
