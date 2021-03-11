using DataControl;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    //[AjaxSessionActionFilter]
    public class AutomationMasterDataController : Controller
    {
        public ActionResult MasterDataHandler(string SSID)
        {
            UserInfoModel _objcomp = new UserInfoModel();
            if (!string.IsNullOrEmpty(SSID))
            {
                byte[] EncodedParams = Convert.FromBase64String(SSID);
                string Params = System.Text.Encoding.UTF8.GetString(EncodedParams);
                _objcomp = Newtonsoft.Json.JsonConvert.DeserializeObject<UserInfoModel>(Params);

                ViewBag.CompanyCode = _objcomp.Company_Code;
                ViewBag.UserCode = _objcomp.User_Code;
                ViewBag.UTypeCode = _objcomp.User_Type_Code;
                ViewBag.RegionCode = _objcomp.Region_Code;
                ViewBag.UserDetails = _objcomp.User_Details;
                ViewBag.Company_Id = _objcomp.Company_Id;
                ViewBag.BatchProcessingId = _objcomp.BatchProcessingId;
                ViewBag.BP_Guid = _objcomp.BP_Guid;
                ViewBag.LoadType = "Mail";
                ViewBag.FileProcessId = _objcomp.FileProcessId;
                ViewBag.ViewType = _objcomp.ViewType;
            }
            else
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.UTypeCode = _objCurrentInfo.GetUserTypeCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserDetails = _objCurrentInfo.GetCompanyCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.LoadType = "Screen";
                ViewBag.BatchProcessingId = 155;
                ViewBag.BP_Guid = "32EAA70B-89C3-42CC-9F19-F8BA55224531";
                ViewBag.FileProcessId = 66;
                ViewBag.ViewType = "MasterData";
            }
            return View();
        }
        public ActionResult EmptyPage()
        {
            return View();
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}