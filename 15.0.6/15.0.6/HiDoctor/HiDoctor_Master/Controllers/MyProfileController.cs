using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Threading.Tasks;
using System.Collections;
using System.Text;
using DataControl;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MyProfileController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region Myprofile Pubilc Methods
        public ActionResult MyProfile()
        {
            return View();
        }
        /// <summary>
        /// Bind the Profile Master in Grid
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProfileDetails()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            try
            {
                BLMaster _objBlMaster = new BLMaster();
                List<MVCModels.HiDoctor_Master.EmployeeModel> lstProfileDetails = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
                lstProfileDetails = _objBlMaster.GetMyProfileDetails(companyCode, userCode).ToList();
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(lstProfileDetails));
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

        }

        public string SavePrivilege(string employeeCode, string mailId)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            int result = 0;
            StringBuilder str = new StringBuilder();
            try
            {
                BLMaster _objBlMaster = new BLMaster();
                result = _objBlMaster.UpdateEmployeeDetails(companyCode, employeeCode, mailId);
                if (result > 0)
                {
                    str.Append(mailId + " Updated Successfully.");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
            return str.ToString();
        }

        public string UpdateProfileDetails(MVCModels.HiDoctor_Master.popupEmployeeModel objEmpdata)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();

            BLMaster _objBlMaster = new BLMaster();
            return _objBlMaster.UpdateProfileDetails(companyCode, userCode, objEmpdata.Mail, objEmpdata.Mobile, objEmpdata.Phn, objEmpdata.Add1, objEmpdata.Add2, objEmpdata.Add3, objEmpdata.City, objEmpdata.State, objEmpdata.Pincode, objEmpdata.Bloodgroup, objEmpdata.Employeephoto);


        }
        #endregion Myprofile Pubilc Methods
    }
}
