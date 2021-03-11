using DataControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    public class StosController : Controller
    {
        //
        // GET: /Stos/
        CurrentInfo _objCurrentInfo;

        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();



        public ActionResult Index()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RequestRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RequestRegionName = _objCurrentInfo.GetRegionName();
            ViewBag.RequestUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.RequestUserName = _objCurrentInfo.GetUserName();
            ViewBag.RequestUserTypeName = _objCurrentInfo.GetUserTypeName();
            ViewBag.RequestUserTypeCode = _objCurrentInfo.GetUserTypeCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetImmediateChildUserForTree(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();
            if (lstUser.Count > 0)
            {
                ViewBag.ShowTeam = "YES";
            }
            else
            {
                ViewBag.ShowTeam = "NO";
            }
            return View();
        }

        public ActionResult Request(string regionCode, int? stosId)
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RequestRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RequestRegionName = _objCurrentInfo.GetRegionName();
            ViewBag.RequestUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.RequestUserName = _objCurrentInfo.GetUserName();
            ViewBag.RequestUserTypeName = _objCurrentInfo.GetUserTypeName();
            ViewBag.RequestUserTypeCode = _objCurrentInfo.GetUserTypeCode();
            ViewBag.StosId = stosId;
            ViewBag.SelectedUser = regionCode;
            return View();
        }

        public ActionResult STOS_Approval()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            ViewBag.UserTypeName = _objCurrentInfo.GetUserTypeName();
            return View();
        }

        public ActionResult InwardAllocation()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            ViewBag.UserTypeName = _objCurrentInfo.GetUserTypeName();
            return View();
        }

        public ActionResult STOS_Reassign()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            ViewBag.UserTypeName = _objCurrentInfo.GetUserTypeName();

            return View();
        }
        public string GetSTOSConfitValueForSize()
        {
            CurrentInfo _objcur = new CurrentInfo();
            DataControl.BL_STOS _objSTOS = new DataControl.BL_STOS();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            string result = _objSTOS.GetConfitValueForSize(_objcur.GetCompanyCode());
            return result;
        }

        public ActionResult STOSEmailTrigger()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RequestRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RequestRegionName = _objCurrentInfo.GetRegionName();
            ViewBag.RequestUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.RequestUserName = _objCurrentInfo.GetUserName();
            ViewBag.RequestUserTypeName = _objCurrentInfo.GetUserTypeName();
            ViewBag.RequestUserTypeCode = _objCurrentInfo.GetUserTypeCode();
          
            
            return View();
        }




    }
}
