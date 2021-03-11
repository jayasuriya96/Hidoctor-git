using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;

namespace HiDoctor_Activity.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Home";
            if (Request.Browser.IsMobileDevice)
            {
                HttpContext.ClearOverriddenBrowser();
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
