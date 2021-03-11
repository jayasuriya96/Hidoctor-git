using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class WorkCategroyRulesController : Controller
    {
        private CurrentInfo objCurrInfo = new CurrentInfo();
        //
        // GET: /WorkCategroyRules/

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetWorkCategory()
        {
            try
            {
                BL_WorkCategoryRule obj = new BL_WorkCategoryRule();
                return Json(obj.GetWorkCategory(objCurrInfo.GetCompanyCode()), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }           
        }
        public JsonResult InsertorUpdateRulesData(RulesDefinitionDataModel objdata)
        {
            try
            {
                BL_WorkCategoryRule obj = new BL_WorkCategoryRule();
                return Json(obj.InsertorUpdateRulesData(objCurrInfo.GetUserCode(), objdata), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
           
        }
        public JsonResult GetWorkCategoryRuleData()
        {
            try
            {
                BL_WorkCategoryRule obj = new BL_WorkCategoryRule();
                return Json(obj.GetWorkCategoryRuleData(objCurrInfo.GetCompanyCode()), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }            
        }    
    }
}
