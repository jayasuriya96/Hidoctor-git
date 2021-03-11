using MVCModels;
using System;
using DataControl;

using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl.Impl;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4HospitalVisitController : Controller
    {
        //
        // GET: /DCRV4HospitalVist/
        private CurrentInfo _objCurrentInfo = null;
        public ActionResult Index()
        {
            return View();
        }
        public PartialViewResult HospitalDetails()
        {
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            return PartialView();
        }
    }
}
