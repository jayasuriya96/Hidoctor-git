using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using DataControl.HD_MasterFactoryClasses;
using Newtonsoft.Json;
using System.Data.Metadata.Edm;
namespace HiDoctor_Master.Controllers
{
    public class MissedDoctorController : Controller
    {
        BL_MissedDoctorsEntry _objBL_MissedDoctorsEntry = new BL_MissedDoctorsEntry();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        public ActionResult DoctorsReason(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                //ViewBag.SelectedRegionCode = _objCurrentInfo.GetSRegionCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "NO";
            }
            else
            {

                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                MVCModels.DoctorMissedReason.ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<MVCModels.DoctorMissedReason.ParameterMode>(parameters);


                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                //ViewBag.SelectedRegionCode = _objCurrentInfo.GetSRegionCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "YES";

            }
            return View();
        }
        public Dictionary<string, string> ConvertParameter(string Lid)
        {
            try
            {
                Dictionary<string, string> dicparams = new Dictionary<string, string>();
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                string[] param = parameters.Split('~');
                string[] key = { "subDomainName", "CompanyCode", "RegionCode", "UserCode" };
                if (param.Length > 1)
                {
                    for (int index = 0; index < param.Length; index++)
                    {
                        dicparams.Add(key[index], param[index]);
                    }
                }

                return dicparams;
            }
            catch
            {
                throw;
            }

        }


        public JsonResult GetAllRegionName(string subDomainName,string Company_Code, string Region_Code)
        {

            return Json(_objBL_MissedDoctorsEntry.GetAllRegionName(subDomainName, Company_Code, Region_Code), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllDoctorslist( string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {


            return Json(_objBL_MissedDoctorsEntry.GetAllDoctorslist(subDomainName,Company_Code, Region_Code,  Month, Year), JsonRequestBehavior.AllowGet);
        }
        public int GetInsertDoctorsList(DoctorMissedReason.DoctorsDetailsList _ObjData)
        {
            

            return _objBL_MissedDoctorsEntry.GetInsertDoctorsList(_ObjData);
        }
        public JsonResult GetAllDoctorDetails( string subDomainName,string Company_Code,string Region_Code,int Month, int Year)
        {

            return Json(_objBL_MissedDoctorsEntry.GetAllDoctorDetails(subDomainName,Company_Code, Region_Code,  Month, Year), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGridDetails(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            return Json(_objBL_MissedDoctorsEntry.GetGridDetails(subDomainName,Company_Code, Region_Code, Month, Year), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetprefilDoctorslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {


            return Json(_objBL_MissedDoctorsEntry.GetprefilDoctorslist(subDomainName,Company_Code, Region_Code, Month, Year), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGridDetailslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            return Json(_objBL_MissedDoctorsEntry.GetGridDetailslist(subDomainName,Company_Code, Region_Code, Month, Year), JsonRequestBehavior.AllowGet);
        }
        public JsonResult prefileditDetails(string subDomainName, string Company_Code, string Region_Code, int Month, int Year)
        {

            return Json(_objBL_MissedDoctorsEntry.prefileditDetails(subDomainName, Company_Code, Region_Code, Month, Year), JsonRequestBehavior.AllowGet);
        }


        public JsonResult ReasonDetails(string subDomainName,  string Region_Code)
        {

            return Json(_objBL_MissedDoctorsEntry.ReasonDetails(subDomainName, Region_Code), JsonRequestBehavior.AllowGet);
        }
    }  
}