using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ReconController : Controller
    {
        //
        // GET: /Recon/
        DataControl.CurrentInfo _objcurr = new DataControl.CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }
        public ViewResult ReconSummary(bool IsEdit = false, int HeaderId = 0)
        {
            DataControl.CurrentInfo _objcurr = new DataControl.CurrentInfo();
            ViewBag.Compnay_Code = _objcurr.GetCompanyCode();
            ViewBag.loginUserCode = _objcurr.GetUserCode();
            ViewBag.LoginRegionCode = _objcurr.GetRegionCode();

            //purpose of recon approve functions used
            ViewBag.Compnay_Id = _objcurr.GetCompanyId();
            ViewBag.IsEdit = IsEdit;
            ViewBag.HeaderId = HeaderId;

            return View();
        }

        public ViewResult ReconApprovalList()
        {
            ViewBag.Compnay_Code = _objcurr.GetCompanyCode();
            ViewBag.UserCode = _objcurr.GetUserCode();
            ViewBag.Compnay_Id = _objcurr.GetCompanyId();

            return View();
        }

    }
}
