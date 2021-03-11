using System.Web.Mvc;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.Collections.Generic;
using System.Text;
using MVCModels.HiDoctor_Master;
using HiDoctor_Activity.Models;
using MVCModels;
using System;
using System.Linq;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRLockController : Controller
    {
        #region Private Variables
        private IDCRLock _objdcrLock;
        private CurrentInfo _objCurrentInfo;
        #endregion Private Variables
        //
        // GET: /DCRLock/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult DCRActivityLockRelease()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult DCRManualLock()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }
        /// <summary>
        /// Retrieves the Activity locked user list.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetActivityLockedUsers()
        {
            // Creats instances.
            _objdcrLock = new BLDCRLock();
            _objCurrentInfo = new CurrentInfo();

            // Retrievs the user list...
            string company_Code = _objCurrentInfo.GetCompanyCode();
            List<UserModel> lstLockedUsers = _objdcrLock.GetAcivityLockedUsers(company_Code);

            // returns Json.
            return Json(lstLockedUsers);
        }

        /// <summary>
        /// Retrievs the Activity lock data and returns the HTML format.
        /// </summary>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public StringBuilder GetActivityLockDataPerUser(string user_Code)
        {
            _objdcrLock = new BLDCRLock();
            _objCurrentInfo = new CurrentInfo();

            string company_Code = _objCurrentInfo.GetCompanyCode();
            StringBuilder strActivityLockDataHTMLFormat = _objdcrLock.GetActivityLockHTMLFormat(company_Code, user_Code);

            return strActivityLockDataHTMLFormat;
        }
        public JsonResult GetlockReleaseDataforactivity(string user_Code, string showmore)
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                string company_Code = _objCurrentInfo.GetCompanyCode();

                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                List<DCRActivityLockModel> lstDCRActivityLock = objNot.GetDcrLockReleaseDatesforactivity(company_Code, user_Code, showmore);
                //JsonResult strLockTableBuilder = GetLockedReleasedINHTMLFormat(lstDCRActivityLock);
                return Json(lstDCRActivityLock, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Tree Selected user:", user_Code); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// Release the Activity lock.
        /// </summary>
        /// <param name="user_Code"></param>
        /// <param name="dcrActualDate"></param>
        /// <param name="flag"></param>
        /// <returns></returns>
        /// 
        public bool ReleasetheActivityLock(string user_Code, string dcrDetails)
        {
            bool result = false;
            // Creates Instance.
            _objCurrentInfo = new CurrentInfo();
            _objdcrLock = new BLDCRLock();

            // Assign to the Model property.
            DCRActivityLockModel dcrActivityLockModel = new DCRActivityLockModel();
            dcrActivityLockModel.User_Code = user_Code;
            // multiple dcr actual dates and flags with ^ symbol.
           // dcrActivityLockModel.DCR_Actual_Date = dcrActualDates;
          //  dcrActivityLockModel.Activity_Flag = flags;
            dcrActivityLockModel.Released_By = _objCurrentInfo.GetUserCode();
            dcrActivityLockModel.Released_Date = DateTime.Now.ToShortDateString();
            dcrActivityLockModel.Request_Released_By = dcrActivityLockModel.Request_Released_By;
            dcrActivityLockModel.Released_Reason = dcrActivityLockModel.Released_Reason;


            // Call the funtion.
            string activityResult =_objdcrLock.ReleaseActivityLock(_objCurrentInfo.GetCompanyCode(),user_Code,dcrDetails,_objCurrentInfo.GetUserCode());
            if (activityResult.ToUpper() == "SUCCESS")
            {
                result = true;
            }
            return result;
        }

        public bool InsertDCRManualLock(string lockUserCodes, string lockDateFrom, string lockDateTo, string lockReason)
        {
            try
            {
                // Creates Instance.
                _objCurrentInfo = new CurrentInfo();
                _objdcrLock = new BLDCRLock();

                // Retrieve the Sessions.
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string user_Code = _objCurrentInfo.GetUserCode();

                // Inserts the DCR Manual lock.
                return _objdcrLock.InsertDCRManualLock(company_Code, lockUserCodes, lockDateFrom, lockDateTo, user_Code, lockReason);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult EmployeeDetails(string user_Code)
        {


            List<UserModel> lstEmployee = new List<UserModel>();
            DataControl.BL_Customer _objCustomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            //   string company_code = objCurInfo.GetCompanyCode();
            lstEmployee = _objdcrLock.EmployeeDetails(objCurInfo.GetCompanyCode(), user_Code).ToList();
            return Json(lstEmployee, JsonRequestBehavior.AllowGet);

        }

    }
}
