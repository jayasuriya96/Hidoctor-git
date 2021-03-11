using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    public class ComplaintformController : Controller
    {

        #region const
       
        #endregion
        //
        // GET: /Complaintform/
        CurrentInfo _objCurrentInfo;
        public ActionResult ComplaintForm()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RequestRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();

            return View();
        }
        
    }
}
