using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;

namespace HiDoctor_Reports.Controllers
{
    public class AlertReportsController : Controller
    {
        //
        // GET: /AlertReports/
        CurrentInfo _objCurrInfo;
        public ActionResult Index()
        {
            _objCurrInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrInfo.GetCompanyCode();
            ViewBag.UserCode = _objCurrInfo.GetUserCode();
            return View();
        }

    }
}
