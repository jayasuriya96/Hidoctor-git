using DataControl;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class NewDCRLeaveController : Controller
    {

        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private variables

        public ActionResult NewLeaveEntry(string SSID)
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
                ViewBag.latitude = obj.latitude;
                ViewBag.longitude = obj.longitude;
            }
            else
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                ViewBag.Companycode = objCurInfo.GetCompanyCode();
                ViewBag.Usercode = objCurInfo.GetUserCode();
                ViewBag.RegionCode = objCurInfo.GetRegionCode();
                ViewBag.UserTypecode = objCurInfo.GetUserTypeCode();
                ViewBag.UserName = objCurInfo.GetUserName();
            }
            return View();

        }
    }
}