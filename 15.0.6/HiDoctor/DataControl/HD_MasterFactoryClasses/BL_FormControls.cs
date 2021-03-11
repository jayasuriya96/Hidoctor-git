using DataControl.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels.OutputJson;
using MVCModels;
namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_FormControls : OutputJsonRepositry
    {

        DAL_FormControls objFormControls;
        public OutPutJson GetFormMasterData(string companyCode)
        {
            objFormControls = new DAL_FormControls();
            try
            {
                FormMasterData objFormMasterData = new FormMasterData();
                objFormMasterData = objFormControls.GetFormMasterData(companyCode);
                return GenerateOutputJson(SUCCESS, objFormMasterData, 0, SUCCESS_STATUS);
            }
            catch (Exception ex)
            {
                return GenerateOutputJson(ex.Message, "", 0, ERROR_STATUS);
            }
        }
        public int SaveFormName(string formName, string company_code, string user_code, int company_id, string formCusName)
        {
            objFormControls = new DAL_FormControls();
            return objFormControls.SaveFormName(formName, company_code, user_code, company_id, formCusName);
        }
        public int SaveFormControl(MVCModels.FormControlDetails objFormControlDetails)
        {
            objFormControls = new DAL_FormControls();
            return objFormControls.SaveFormControl(objFormControlDetails);
        }
        public OutPutJson BindFormControls(int formId, string company_Code, int Form_Value_Id)
        {
            try
            {
                objFormControls = new DAL_FormControls();
                var controls = objFormControls.BindFormControls(formId, company_Code, Form_Value_Id);
                return GenerateOutputJson(SUCCESS, controls, 0, SUCCESS_STATUS);
            }
            catch (Exception ex)
            {
                return GenerateOutputJson(ERROR, ex.Message, 0, ERROR_STATUS);
            }
        }
        public int SaveFormValue(MVCModels.Form_Value objFormValue)
        {
            objFormControls = new DAL_FormControls();
            return objFormControls.SaveFormValue(objFormValue);
        }
    }
}
