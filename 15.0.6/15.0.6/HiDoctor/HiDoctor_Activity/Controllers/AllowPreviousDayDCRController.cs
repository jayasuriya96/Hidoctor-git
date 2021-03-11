using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels.HiDoctor_Master;
using MVCModels;


namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class AllowPreviousDayDCRController: Controller
    {
        #region Private Variables        
        private DataControl.CurrentInfo _objCurrentInfo;
        private string CompCode;
        #endregion Private Variables

        public ActionResult Index()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.User_Code = _objCurrentInfo.GetUserCode();
            return View();
        }

        public string GetUsersByUserNameEmployeeNameMD(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<UserModel> lstUser = new List<UserModel>();
                lstUser = (List<UserModel>)objUser.GetUsersByUserNameNew(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
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

        public ActionResult GetPreviousDayReleasedDCR(string Usr_Code)
        {
            //Declare variable to Business Layer
            BL_AllowPreviousDayDCR _objallowPrvDayDCR = new BL_AllowPreviousDayDCR();

            List<Allow_PreviousDayDCR> lstPrvDayDCR = new List<Allow_PreviousDayDCR>();
            _objCurrentInfo = new CurrentInfo();
            CompCode = _objCurrentInfo.GetCompanyCode();
            lstPrvDayDCR = _objallowPrvDayDCR.GetPreviousDayDCR(CompCode, Usr_Code, '1');
            return Json(lstPrvDayDCR, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetPreviousDayLockedDCR(string Usr_Code)
        {
            //Declare variable to Business Layer
            BL_AllowPreviousDayDCR _objallowPrvDayDCR = new BL_AllowPreviousDayDCR();
            List<Allow_PreviousDayDCR> lstPrvDayDCR = new List<Allow_PreviousDayDCR>();
            _objCurrentInfo = new CurrentInfo();
            CompCode = _objCurrentInfo.GetCompanyCode();
            lstPrvDayDCR = _objallowPrvDayDCR.GetPreviousDayDCR(CompCode, Usr_Code, '2');
            return Json(lstPrvDayDCR, JsonRequestBehavior.AllowGet);
        }

        public bool InsertPreviousDayDCR(string UCodes, string DCRDt, string Remarks)
        {
            try
            {
                // Creates Instance.
                _objCurrentInfo = new CurrentInfo();
                string LoggedUserCode = string.Empty;
                //Declare variable to Business Layer
                BL_AllowPreviousDayDCR _objallowPrvDayDCR = new BL_AllowPreviousDayDCR();

                // Retrieve the Sessions.
                CompCode = _objCurrentInfo.GetCompanyCode();
                LoggedUserCode = _objCurrentInfo.GetUserCode();

                // Inserts the DCR Manual lock.
                return _objallowPrvDayDCR.InsertPreDayDCR(CompCode, UCodes, LoggedUserCode, DCRDt, Remarks);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}