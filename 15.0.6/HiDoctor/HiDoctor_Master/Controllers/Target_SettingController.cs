using DataControl;
using DataControl.HD_MasterFactoryClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    public class Target_SettingController : Controller
    {
        //
        // GET: /Target_Setting/
        CurrentInfo _objCurrentInfo;
        BL_Setting _objBLSetting = new BL_Setting();


        public ActionResult Index()
        {
           
            return View();
        }

        public ActionResult TargetSettings()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RequestRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.RequestUserCode = _objCurrentInfo.GetUserCode();
            return View();
        }
        public JsonResult productdetails(string Region_Code)
        {
            //_objBLSetting.Region_Code = Region_Code;
            //_objBLSetting.subDomainName = subDomainName;
            return Json(_objBLSetting.productdetails(Region_Code), JsonRequestBehavior.AllowGet);
            //return _objBLSetting.productdetails(Region_Code);

        }
        public JsonResult InsertProduts(SalesProductDetails objdetails)
        {
            //_objBLSetting.Region_Code = Region_Code;
            //_objBLSetting.subDomainName = subDomainName;
            return Json(_objBLSetting.InsertProduts(objdetails), JsonRequestBehavior.AllowGet);
            //return _objBLSetting.productdetails(Region_Code);

        }
        public JsonResult GetProduts(string Region_Code)
        {
            CurrentInfo _obj = new CurrentInfo();
            string companyCode = _obj.GetCompanyCode();
            return Json(_objBLSetting.GetProduts(Region_Code), JsonRequestBehavior.AllowGet);
         

        }
        #region DCRWorkCategorySetting
        public ActionResult DCRWorkCategorySetting()
        {
            return View();
        }
        public JsonResult GetWorkCategory()
        {
            CurrentInfo _obj = new CurrentInfo();
            string companyCode = _obj.GetCompanyCode();
            return Json(_objBLSetting.GetWorkCategory(companyCode), JsonRequestBehavior.AllowGet);
        }
        public int InsertCategorySetting(CategoryDetails obj)
        {
            CurrentInfo _obj = new CurrentInfo();
            int result = 0;
            string user_code = _obj.GetUserCode();
            return result = _objBLSetting.InsertCategorySetting(obj, user_code);
        }
        public JsonResult Getallcategorysetting()
        {
            CurrentInfo _obj = new CurrentInfo();
            string user_code = _obj.GetUserCode();
            return Json(_objBLSetting.Getallcategorysetting(user_code), JsonRequestBehavior.AllowGet);
        }
        public int ChangeStatus(int id)
        {
            int result = 0;
            CurrentInfo _obj = new CurrentInfo();
            result = _objBLSetting.ChangeStatus(id, _obj.GetUserCode());
            return result;
        }
        #endregion
    }
}
