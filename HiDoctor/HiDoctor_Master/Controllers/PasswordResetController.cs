using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HiDoctor_Master.Models;
using DataControl;
using System.Data;
using System.Configuration;
using System.Text;
using System.Web.Http;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    public class PasswordResetController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        JSONConverter _objJson = new JSONConverter();

        public ActionResult Create()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public JsonResult checkPasswordPrivilge(string usertypename)
        {
            BLUser _objUser = new BLUser();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<PasswordPrivValues> lstPasswordPrivVal = new List<PasswordPrivValues>();
            try
            {
                lstPasswordPrivVal = _objUser.checkPasswordPrivilge(companyCode, usertypename).ToList();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("userTypeName", usertypename);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return Json("FAILURE", JsonRequestBehavior.AllowGet);
            }
            return Json(lstPasswordPrivVal, JsonRequestBehavior.AllowGet);
        }

        public JsonResult checkCurrentPassword(string usercode)
        {
            BLUser _objUser = new BLUser();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<PasswordDetails> Current_Password = new List<MVCModels.PasswordDetails>();
            try
            {
                Current_Password = _objUser.checkCurrentPassword(companyCode, usercode).ToList();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("userCode", usercode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return Json("FAILURE", JsonRequestBehavior.AllowGet);
            }
            return Json(Current_Password, JsonRequestBehavior.AllowGet);
        }

        public JsonResult checkPasswordHistory(string usercode, string historyCount)
        {
            BLUser _objUser = new BLUser();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<PasswordDetails> Passwordlst = new List<MVCModels.PasswordDetails>();
            try
            {
                Passwordlst = _objUser.checkPasswordHistory(companyCode, usercode, historyCount).ToList();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("userCode", usercode);
                dicObj.Add("historyCount", historyCount);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return Json("FAILURE", JsonRequestBehavior.AllowGet);
            }
            return Json(Passwordlst, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUnderusercode(string userCode)
        {
            BLUser _objUser = new BLUser();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<PasswordDetails> underUserlst = new List<MVCModels.PasswordDetails>();
            try
            {
                underUserlst = _objUser.GetUnderusercode(companyCode, userCode).ToList();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return Json("FAILURE", JsonRequestBehavior.AllowGet);
            }
            return Json(underUserlst, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserEmailID(string userCode)
        {
            BLUser _objUser = new BLUser();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<string> UsersEmailID = new List<string>();
            try
            {
                UsersEmailID = _objUser.GetUsersEmailID(companyCode, userCode).ToList();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return Json("FAILURE", JsonRequestBehavior.AllowGet);
            }
            return Json(UsersEmailID, JsonRequestBehavior.AllowGet);
        }

        //Send Password
        public string GetandSendPassWord(string newPassWord, string usercode, int mailvalue)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userName = _objcurrentInfo.GetUserName();
            string strmail = "";
            string strMailid = "";
            string strUserName = "";
            string result = "";
            try
            {
                DataSet dsEmail = new DataSet();
                DataSet dspassword = new DataSet();
                BLUser _objUser = new BLUser();

                if (mailvalue == 0)
                {
                    dspassword = _objUser.GetPassword(companyCode, usercode);
                    strUserName = dspassword.Tables[0].Rows[0]["User_Name"].ToString();
                    string pwdflag = _objUser.UpdatePasswordReset(companyCode, usercode, newPassWord);
                    result = "SAVED";
                }
                else
                {
                    dsEmail = _objUser.checkEmailid(companyCode, usercode);
                    if (dsEmail.Tables[0].Rows.Count > 0)
                    {
                        strMailid = dsEmail.Tables[0].Rows[0]["Email_Id"].ToString();
                        dspassword = _objUser.GetPassword(companyCode, usercode);
                        strUserName = dspassword.Tables[0].Rows[0]["User_Name"].ToString();
                        string pwdflag = _objUser.UpdatePasswordReset(companyCode, usercode, newPassWord);

                        if (!string.IsNullOrEmpty(strMailid))
                        {
                            strmail = SendMail(newPassWord, strUserName, strMailid);
                            result = strmail + "*" + strMailid;
                        }
                    }
                    else
                    {
                        result = "ERROR";
                    }
                }
                return result;
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", usercode);
                dicContext.Add("Filter:newPassWord", newPassWord);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        protected string SendMail(string passWord, string userName, string strEmailid)
        {
            try
            {
                if (!string.IsNullOrEmpty(strEmailid))
                {
                    //string strSubject = "Dear Sir/Madam, \n\n Please keep a note of the following information which is critical for ensuring uninterrupted access to HiDOCTOR \n\n  Your User Id:  " + UserName + " \n  Your Password: " + strUserpass + " \n\n In case of any clarifications, please reach out to our support desk (support@swaas.net or 095600005628).\n\n Assuring you of our best services at all times.\n\n Warm Regards \n Customer Service ";
                    string companyName = "";
                    string employeeName = "";
                    string phoneNo = "Not yet registered in HiDOCTOR";
                    string mobileNo = "Not yet registered in HiDOCTOR";
                    DataSet dsEmpInfo = new DataSet();
                    BLUser objBLuser = new BLUser();
                    try
                    {
                        _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                        dsEmpInfo = objBLuser.Getempinfo(Session["Comp_Code"].ToString(), userName);
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }

                    if (dsEmpInfo.Tables[0].Rows.Count > 0)
                    {
                        companyName = dsEmpInfo.Tables[0].Rows[0]["Company_Name"].ToString().Trim();
                        employeeName = dsEmpInfo.Tables[0].Rows[0]["Employee_Name"].ToString().Trim();

                        if (dsEmpInfo.Tables[0].Rows[0]["Phone"].ToString().Trim().Length > 0)
                        {
                            phoneNo = dsEmpInfo.Tables[0].Rows[0]["Phone"].ToString().Trim();
                        }

                        if (dsEmpInfo.Tables[0].Rows[0]["Mobile"].ToString().Trim().Length > 0)
                        {
                            mobileNo = dsEmpInfo.Tables[0].Rows[0]["Mobile"].ToString().Trim();
                        }
                    }

                    string server = ConfigurationManager.AppSettings["SMTPSERVER"];
                    string frommail = ConfigurationManager.AppSettings["FROMMAIL"];

                    string strSubject = Resources.Password_Policy_Messages.PasswordLockReleaseMail.ToString();
                    string strSubjectNew = strSubject.Replace("@Name", userName).Replace("@Pass", passWord);

                    strSubjectNew = strSubjectNew.Replace("@CompanyName", companyName);
                    strSubjectNew = strSubjectNew.Replace("@EmployeeName", employeeName);
                    strSubjectNew = strSubjectNew.Replace("@PhoneNo", phoneNo);
                    strSubjectNew = strSubjectNew.Replace("@MobileNo", mobileNo);

                    bool Issmtpmail = false;
                    Issmtpmail = _objSPData.SendMail(strEmailid, "Check your HiDOCTOR Password", strSubjectNew);
                    return "SUCCESS";
                }
                else
                {
                    return "FAIL";
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", userName);
                dicContext.Add("Filter:passWord", passWord);
                dicContext.Add("Filter:strEmailid", strEmailid);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
    }
}


