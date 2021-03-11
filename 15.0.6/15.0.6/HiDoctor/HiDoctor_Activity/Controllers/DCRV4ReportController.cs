#region Using
using System;
using System.Web;
using System.Web.Mvc;
using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4ReportController : Controller
    {

        #region Private Variables
        BL_DCRReport _objBLDCR = new BL_DCRReport();
        CurrentInfo objCurr = new CurrentInfo();
        #endregion Private Variables

        #region Index        
        public ActionResult Index(string dcrActualDate, string flag, string Company_Code, string UserCode, string RegionCode, int CompanyId)
        {
            string today = DateTime.Now.ToShortDateString();
            ViewBag.possibleDays = _objBLDCR.GetNextTwoPossibleDays(objCurr.GetCompanyCode(), objCurr.GetUserCode(), objCurr.GetRegionCode(), today);
            ViewBag.flag = flag;
            ViewBag.dcrDate = dcrActualDate;
            ViewBag.Company_Code = objCurr.GetCompanyCode();
            ViewBag.UserCode = objCurr.GetUserCode();
            ViewBag.RegionCode = objCurr.GetRegionCode();
            ViewBag.CompanyId = objCurr.GetCompanyId();
            return View();
        }
        #endregion Index

       
    }
}
