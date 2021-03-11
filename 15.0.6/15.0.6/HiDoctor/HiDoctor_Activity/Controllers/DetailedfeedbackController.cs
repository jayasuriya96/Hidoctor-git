using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;
namespace HiDoctor_Activity.Controllers
{
    public class DetailedfeedbackController : Controller
    {
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();

        public ActionResult DetailedfeedbackScreen(string SSID)
        {
            if (!string.IsNullOrEmpty(SSID))
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(SSID));
                DieticianModel obj = Newtonsoft.Json.JsonConvert.DeserializeObject<DieticianModel>(parameters);
                ViewBag.CompanyCode = obj.Company_Code;
                ViewBag.RegionCode = obj.Region_Code;
                ViewBag.UserCode = obj.User_Code;
                ViewBag.UserTypeCode = obj.User_Type_Code;
                ViewBag.UserName = obj.User_Name;
                ViewBag.RegionName = obj.Region_Name;
            }
            else
            {
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.UserTypeCode = _objCurrentInfo.GetUserTypeCode();
                ViewBag.UserName = _objCurrentInfo.GetUserName();
                ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            }
            return View();

        }
    }
}