using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    public class SSLockReleaseController : Controller
    {
        BL_LockRelease _objBL_LockRelease = new BL_LockRelease();

        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public ActionResult LockReleaseDetails(string Lid)
        {
            
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "NO";
            }
            else
            {

                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                MVCModels.DoctorMissedReason.ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<MVCModels.DoctorMissedReason.ParameterMode>(parameters);


                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.Company_Code = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "NO";
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
        public JsonResult GetAllRegionName(string subDomainName, string Company_Code, string Region_Code)
        {

            return Json(_objBL_LockRelease.GetAllRegionName(subDomainName, Company_Code, Region_Code), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllLockedDetails(string subDomainName, string Region_Code)
        {

            return Json(_objBL_LockRelease.GetAllLockedDetails(subDomainName,  Region_Code), JsonRequestBehavior.AllowGet);
        }
        public int UpdateLockStatus(LockRelease.Updatelist _ObjData)
        {
          
            return _objBL_LockRelease.UpdateLockStatus(_ObjData);
        }
        public JsonResult GetStockistDetails(string subDomainName, string Region_Code, int Month, int Year)
        {

            return Json(_objBL_LockRelease.GetStockistDetails(subDomainName, Region_Code,Month,Year), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllReleasedDetails(string subDomainName, string Region_Code,string FromDate,string ToDate)
        {

            return Json(_objBL_LockRelease.GetAllReleasedDetails(subDomainName, Region_Code, FromDate, ToDate), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetActualRegionName(string subDomainName, string Company_Code, string Region_Code,string login_Region)
        {

            return Json(_objBL_LockRelease.GetActualRegionName(subDomainName, Company_Code,Region_Code, login_Region), JsonRequestBehavior.AllowGet);
        }
       
    }
}