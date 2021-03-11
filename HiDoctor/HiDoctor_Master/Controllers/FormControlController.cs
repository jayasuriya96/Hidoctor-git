using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels.OutputJson;
using DataControl.HD_MasterFactoryClasses;
namespace HiDoctor_Master.Controllers
{
    [DataControl.AjaxSessionActionFilter]
    public class FormControlController : Controller
    {
        //
        // GET: /FormControl/
        DataControl.CurrentInfo objCurInfo;
        BL_FormControls objFormControls;
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetFormMasterData()
        {
            objFormControls = new BL_FormControls();
            objCurInfo = new DataControl.CurrentInfo();
            return Json(objFormControls.GetFormMasterData(objCurInfo.GetCompanyCode()), JsonRequestBehavior.AllowGet);
        }
        public int SaveFormName(string formName, string formCusName)
        {
            objFormControls = new BL_FormControls();
            objCurInfo = new DataControl.CurrentInfo();
            return objFormControls.SaveFormName(formName, objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), Convert.ToInt32(objCurInfo.GetCompanyId()), formCusName);
        }
        public int SaveFormControl(MVCModels.FormControlDetails objFormControlDetails)
        {
            objFormControls = new BL_FormControls();
            objCurInfo = new DataControl.CurrentInfo();
            objFormControlDetails.Company_Code = objCurInfo.GetCompanyCode();
            objFormControlDetails.Company_Id = Convert.ToInt32(objCurInfo.GetCompanyId());
            objFormControlDetails.Created_By = objCurInfo.GetUserCode();
            return objFormControls.SaveFormControl(objFormControlDetails);
        }
        public ViewResult UserForm(int id)
        {
            ViewBag.PageType = id;
            return View();
        }
        public JsonResult BindFormControls(int formId, int Form_Value_Id)
        {
            objFormControls = new BL_FormControls();
            objCurInfo = new DataControl.CurrentInfo();
            return Json(objFormControls.BindFormControls(formId, objCurInfo.GetCompanyCode(), Form_Value_Id));
        }
        public int SaveFormValue(MVCModels.Form_Value objFormValue)
        {
            objFormControls = new BL_FormControls();
            objCurInfo = new DataControl.CurrentInfo();
            objFormValue.Company_Code = objCurInfo.GetCompanyCode();
            objFormValue.Company_Id = Convert.ToInt32(objCurInfo.GetCompanyId());
            objFormValue.Created_By = objCurInfo.GetUserCode();
            return objFormControls.SaveFormValue(objFormValue);
        }
    }
}
