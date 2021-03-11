using DataControl.HD_MasterFactoryClasses;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Web;
using MVCModels;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    public class DoctorsBirthdayController : Controller
    {
        BL_DoctorsBirthday _objBL_DoctorBithdayMail = new BL_DoctorsBirthday();

        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public ActionResult BirthdayMail()
        {

            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
            return View();
        }
      
        public JsonResult GetDoctorDetails(string Region_Code, string Company_Code, string Dob, string Division_code)
        {

            return Json(_objBL_DoctorBithdayMail.GetDoctorDetails(Region_Code, Company_Code, Dob, Division_code), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetdoctorsHierarchyByRegion(string Region_Code,string login_Region)
        {

            return Json(_objBL_DoctorBithdayMail.GetdoctorsHierarchyByRegion(Region_Code, login_Region), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMailTemplates()
        {

            return Json(_objBL_DoctorBithdayMail.GetMailTemplates(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllDivisions(string Company_Code)
        {

            return Json(_objBL_DoctorBithdayMail.GetAllDivisions(Company_Code), JsonRequestBehavior.AllowGet);
        }
    }
}

































