using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using DataControl;
using MVCModels;
using MVCModels.HiDoctor_Master;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class HidoctorStartDateController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "Domain Master Public Methods"
        public ActionResult Create()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        /// <summary>
        /// Method is Used To get the User details for HidoctorStartDate
        /// </summary>
        /// <returns></returns>
        private IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetHidoctorStartDate()
        {
            try
            {
                MVCModels.HiDoctor_Master.UserModel objHidoctorstartdate = new MVCModels.HiDoctor_Master.UserModel();
                BLMaster objMaster = new BLMaster();
                objHidoctorstartdate.Company_Code = _objcurrentInfo.GetCompanyCode();
                return objMaster.GetHidoctorStartdateDetails(objHidoctorstartdate);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }

        }


        /// <summary>
        /// Method is Used to Bind the data with Hidoctorstartdate Html Table
        /// </summary>
        /// <returns></returns>
        public JsonResult HtmlforHidoctorStartDate()
        {

            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lsthidoctorUser = (List<MVCModels.HiDoctor_Master.UserModel>)GetHidoctorStartDate();
                StringBuilder sb = new StringBuilder();
                MVCModels.HiDoctor_Master.UserModel objHidoctorstartdate = new MVCModels.HiDoctor_Master.UserModel();
                BLMaster objMaster = new BLMaster();
                objHidoctorstartdate.Company_Code = _objcurrentInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserModel> lstUserName = objMaster.GetHidoctorStartdate(objHidoctorstartdate).ToList();

                DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
                return Json(lsthidoctorUser, JsonRequestBehavior.AllowGet);
                //return _objJson.Serialize(lstUserName);
            }
            catch (Exception ex)
            {
                //Dictionary<string, string> dicObj = new Dictionary<string, string>();
                //DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                //return ex.Message.ToString();
                throw (ex);
            }
        }

        /// <summary>
        /// Insert data
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>



        public string UpdateHidoctorStartDate(string startDate, string userCode)
            {
            try
            {
               
                
                //var companycode =   companycode;
                // var companycode = new Companycode();

                string[] userArr = userCode.Split('^');
                BLMaster Master = new BLMaster();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                foreach (string userCodesplit in userArr)
                {
                    if (!string.IsNullOrEmpty(userCodesplit))
                    {
                        MVCModels.HiDoctor_Master.UserModel objusermasterModer = new MVCModels.HiDoctor_Master.UserModel();
                        objusermasterModer.Company_Code = _objcurrentInfo.GetCompanyCode();
                        objusermasterModer.HiDOCTOR_Start_Date = startDate;
                        objusermasterModer.User_Code = userCodesplit;
                        objusermasterModer.Updated_By = _objcurrentInfo.GetUserCode();
                        objusermasterModer.Updated_Time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                        lstUser.Add(objusermasterModer);
                    }
                }

                string result = Master.UpdateforHidoctorStartDate(lstUser);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:startDate", startDate);
                dicContext.Add("Filter:userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "success";
            }
        }
        #endregion "Domain Master Public Methods"




        //public JsonResult GetDCRActualDate()

        //{
        //    DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
        //    DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        //    DataSet ds = new DataSet();
        //    ds = _objBlmaster.GetDcrActualDateAll(_objCurrentInfo.GetCompanyCode());
        //    DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);

        //}

       
        public JsonResult GetHiDoctorActualDate(List<Usercodelst> lstUsers)
        {
            string companyCode = null;
            try
            {
                BLMaster lstActDate = new BLMaster();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                return Json(lstActDate.GetHiDoctorActualDate(companyCode, lstUsers), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public string GetUsersByUserNameEmployeeNameMD(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserNameNew(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {

                        strContent.Append("<li><a href='#' class='list-group-item' onclick='fnBindTreeWithSelectedUserChecked(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.Employee_Name + "(" + user.User_Name + ")" + "," + user.User_Type_Name + "," + user.Region_Name + "</li>");
                    }
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }

    }
}