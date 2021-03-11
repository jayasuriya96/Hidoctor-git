using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    public class UsersDivisionMappingController : Controller
    {
        //
        // GET: /UsersDivisionMapping/
        DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
        DataControl.BLDivision _objBlDivision = new DataControl.BLDivision();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DivisonMappingNew()
        {

            return View();
        }
        public JsonResult GetDivisionsBasedonLoggedUserdivision()
        {
            List<MVCModels.DivisionModel> lstDivision = null;
            string companyCode = null;
            string regionCode = null;
            string UserCode = null;
            try
            {
                BLDivision _ObjDivisns = new BLDivision();
                CurrentInfo _ObjCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                UserCode = ViewBag.Region_Code = _ObjCurrentInfo.GetUserCode();
                lstDivision = _ObjDivisns.GetDivisionsBasedonLoggedUserdivision(companyCode, regionCode, UserCode);
                return Json(lstDivision, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
