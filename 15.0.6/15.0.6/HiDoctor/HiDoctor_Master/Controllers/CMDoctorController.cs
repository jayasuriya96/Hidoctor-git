using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using System.Text;
using DataControl.HD_MasterFactoryClasses;
using Newtonsoft.Json;
namespace HiDoctor_Master.Controllers
{
    //[AjaxSessionActionFilter]
    public class CMDoctorController : Controller
    {
        BLDoctor _objBLDoctorspcl = new BLDoctor();


        //
        // GET: /CMDoctor/

        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Doctormaster(string CC)
        {

          
        string LoginParams = string.Empty;
            logindetails lstcompdetails = new logindetails();
            
            if (!string.IsNullOrEmpty(CC))
            {               
                lstcompdetails = null;
                byte[] EncodedLoginParams = Convert.FromBase64String(CC);
                string DecodedLoginParams = Encoding.UTF8.GetString(EncodedLoginParams);              
                string[] lstQueryString = DecodedLoginParams.Split('&');

                ViewBag.Company_Code = lstQueryString[0].Split('=')[1];
                ViewBag.User_Code = lstQueryString[1].Split('=')[1];
                ViewBag.Region_Code = lstQueryString[2].Split('=')[1];

                if (!string.IsNullOrEmpty(lstQueryString[3]))
                {
                    ViewBag.Source = lstQueryString[3].Split('=')[1];
                }
                else
                {
                    ViewBag.Source = "";
                }

                if (!string.IsNullOrEmpty(lstQueryString[4]))
                {
                    ViewBag.DoctorName = lstQueryString[4].Split('=')[1];
                }
                else
                {
                    ViewBag.DoctorName = "";
                }

                if (!string.IsNullOrEmpty(lstQueryString[5]))
                {
                    ViewBag.SpecialityCode = lstQueryString[5].Split('=')[1];
                }
                else
                {
                    ViewBag.SpecialityCode = "";
                }
            }

            return View();
        }
  
        [HttpGet]
        [ActionName("GetDoctorspcl")]
        public JsonResult GetDoctorspcl(string CompanyCode)
        {
            try
            {

                return Json(_objBLDoctorspcl.GetDoctorspcl(CompanyCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }


        }
        [HttpGet]
        [ActionName("GetAllCities")]
        public JsonResult GetAllCities()
        {
            try
            {
                return Json(_objBLDoctorspcl.GetAllCities(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpGet]
        [ActionName("GetDoctorcat")]
        public JsonResult GetDoctorcat(string CompanyCode,string RegionCode)
        {
            try
            {

                return Json(_objBLDoctorspcl.GetDoctorcat(CompanyCode,RegionCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }


        }
        public string InsertNewCityDetails(string UserCode,string cityname)
        {
            string result = string.Empty;
            BLDoctor _objBLDoctorspcl = new BLDoctor();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            result = _objBLDoctorspcl.InsertNewCityDetails(UserCode, cityname);
            return result;

        }
    }
}
