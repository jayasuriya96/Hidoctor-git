using DataControl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
namespace HiDoctor_Master.Controllers
{
    public class PasswordLockReleaseController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        CurrentInfo _objCurInfo = new CurrentInfo();
        JSONConverter _objJson = new JSONConverter();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.SPData _objSPData = new DataControl.SPData();
        //
        // GET: /PasswordLockRelease/

        public ActionResult Index()
        {

            return View();

        }

        //
        // GET: /PasswordLockRelease/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /PasswordLockRelease/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /PasswordLockRelease/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /PasswordLockRelease/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /PasswordLockRelease/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /PasswordLockRelease/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /PasswordLockRelease/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult PasswordLockRelease()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public string fnGetAccountIsLock(string userCode)
        {
            try
            {
                string userLock = "";
                string companyCode = _objCurInfo.GetCompanyCode();
                BLUser objBLuser = new BLUser();
                userLock = objBLuser.GetAccountlock(userCode);
                return userLock;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }

        public string fnGetLockRelease(string userCode)
        {
            try
            {
                DataSet dsEmail = new DataSet();
                string strmail = "";
                string strEmailid = "";
                string companyCode = _objCurInfo.GetCompanyCode();
                string userName = _objCurInfo.GetUserName();
                BLUser objBLuser = new BLUser();
                bool lockrelease = objBLuser.GetLockRelease(companyCode, userCode, userName, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), "MANUAL");
                if (lockrelease)
                {
                    dsEmail = objBLuser.checkEmailid(Session["Comp_Code"].ToString(), userCode);
                }
                if (dsEmail.Tables[0].Rows.Count > 0)
                {

                    string strUserName = dsEmail.Tables[0].Rows[0]["User_Name"].ToString();
                    string strPassword = dsEmail.Tables[0].Rows[0]["User_Pass"].ToString();
                    strEmailid = dsEmail.Tables[0].Rows[0]["Email_Id"].ToString();
                    strmail = SendMail(strPassword, strUserName, strEmailid);

                }
                return strmail + "*" + strEmailid;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }

        public string fnGetsendpassword(string userCode)
        {
            try
            {
                DataSet dsEmail = new DataSet();
                string strmail = "";
                string strEmailid = "";
                string companyCode = _objCurInfo.GetCompanyCode();
                string userName = _objCurInfo.GetUserName();
                BLUser objBLuser = new BLUser();


                dsEmail = objBLuser.checkEmailid(Session["Comp_Code"].ToString(), userCode);

                if (dsEmail.Tables[0].Rows.Count > 0)
                {

                    string strUserName = dsEmail.Tables[0].Rows[0]["User_Name"].ToString();
                    string strPassword = dsEmail.Tables[0].Rows[0]["User_Pass"].ToString();
                    strEmailid = dsEmail.Tables[0].Rows[0]["Email_Id"].ToString();
                    strmail = SendMail(strPassword, strUserName, strEmailid);

                }
                return strmail + "*" + strEmailid;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
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
                        // dsEmpInfo = _objData.ExecuteDataSet("EXEC SP_HdGetEmployeeDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + userName + "'");
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
                    return "MAIL";
                }
            }
            catch (Exception ex)
            {

                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserName", userName);
                dicContext.Add("Filter:UserName", passWord);
                dicContext.Add("Filter:UserName", strEmailid);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");

            }
        }
    }
}
