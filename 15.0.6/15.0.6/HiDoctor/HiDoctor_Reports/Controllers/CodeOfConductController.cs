using DataControl;
using DataControl.HiDoctor_ReportsFactoryClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Reports.Controllers
{
    public class CodeOfConductController : Controller
    {
        //
        // GET: /CodeOfConduct/
        DataControl.CurrentInfo objCC = new DataControl.CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAckRecords()
        {
            CurrentInfo objCC = new CurrentInfo();
            string companyCode = objCC.GetCompanyCode();
            string usertypecode = objCC.GetUserTypeCode();
            string userCode = objCC.GetUserCode();
            BLCodeofConduct objDCC = new BLCodeofConduct();
            List<MVCModels.CCOverlayModel> lstCCForm = new List<MVCModels.CCOverlayModel>();
            lstCCForm = objDCC.GetAckRecords(companyCode, usertypecode, userCode).ToList();
            return Json(lstCCForm, JsonRequestBehavior.AllowGet);

        }
    }
}
