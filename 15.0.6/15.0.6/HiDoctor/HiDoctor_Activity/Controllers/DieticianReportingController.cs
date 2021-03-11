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
   // [AjaxSessionActionFilter]
    public class DieticianReportingController : Controller
    {
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();

        public ActionResult DieticianReporting(string dcrActualDate)
        {
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserTypeCode = _objCurrentInfo.GetUserTypeCode();
            ViewBag.dcrdate = dcrActualDate;
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            return View();
        }
        public ActionResult DieticianAPPLanding(string SSID)
        {
            if (!string.IsNullOrEmpty(SSID))
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(SSID));
                DieticianModel obj = Newtonsoft.Json.JsonConvert.DeserializeObject<DieticianModel>(parameters);
                ViewBag.SubDomainName = obj.SubDomain_Name;
                ViewBag.CompanyCode = obj.Company_Code;
                ViewBag.RegionCode = obj.Region_Code;
                ViewBag.UserCode = obj.User_Code;
                ViewBag.UserTypeCode = obj.User_Type_Code;
                ViewBag.UserName = obj.User_Name;
                ViewBag.RegionName = obj.Region_Name;
                ViewBag.latitude = obj.latitude;
                ViewBag.longitude = obj.longitude;
            }
            else
            {
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.UserTypeCode = _objCurrentInfo.GetUserTypeCode();
                ViewBag.UserName = _objCurrentInfo.GetUserName();
                ViewBag.RegionName = _objCurrentInfo.GetRegionName();
                ViewBag.latitude = null;
                ViewBag.longitude = null;
            }
            return View();

        }
        public ActionResult DieticianAPPReporting(string dcrdate,string activitycode,string subactivitycode,string loc,string selectedregionname,string headerid,string CompanyCode,string RegionCode,string UserCode,string UserName,string RegionName,string latitude,string longitude,string SubDomainName)
        {
            ViewBag.SubDomainName = SubDomainName;
            ViewBag.CompanyCode = CompanyCode;
            ViewBag.RegionCode = RegionCode;
            ViewBag.UserCode = UserCode;
            ViewBag.UserName = UserName;
            ViewBag.RegionName = RegionName;
            ViewBag.dcrdate = dcrdate;
            ViewBag.activitycode = activitycode;
            ViewBag.subactivitycode = subactivitycode;
            ViewBag.loc = loc;
            ViewBag.selectedregionname = selectedregionname;
            ViewBag.headerid = headerid;
            ViewBag.latitude = latitude;
            ViewBag.longitude = longitude;
            return View();
        }
        public ActionResult DieticianAPPReportingView(string SSID)
        {
            string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(SSID));
            DieticianAPPView obj = Newtonsoft.Json.JsonConvert.DeserializeObject<DieticianAPPView>(parameters);
            ViewBag.CompanyCode = obj.Company_Code;
            ViewBag.RegionCode = obj.Region_Code;
            ViewBag.UserCode = obj.User_Code;
            ViewBag.UserName = obj.User_Name;
            ViewBag.RegionName = obj.Region_Name;
            ViewBag.dcrdate = obj.Dcr_Date;
            ViewBag.activitycode = obj.Activity_Code;
            ViewBag.subactivitycode = obj.Sub_Activity_Code;
            ViewBag.loc = 0;
            ViewBag.selectedregionname = obj.Selected_Region_Code;
            ViewBag.headerid = obj.Header_Id;
            ViewBag.latitude = obj.Latitude;
            ViewBag.longitude = obj.Longitude;
            return View();
        }
    }
}