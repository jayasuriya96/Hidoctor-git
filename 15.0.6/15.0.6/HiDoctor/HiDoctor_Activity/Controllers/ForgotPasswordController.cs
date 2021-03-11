using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Configuration;
namespace HiDoctor_Activity.Controllers
{
    public class ForgotPasswordController : Controller
    {
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        //
        // GET: /ForgotPassword/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Forgotpassword()
        {

            return View();
        }
        public string GetForgotpassword(FormCollection collection)
        {
            try
            {
                string userName = string.Empty;
                userName = collection["UserName"];
                string result = "";
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                try
                {
                    _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                    dsReport = _objData.ExecuteDataSet("EXEC SP_HdGetCheckUsername " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + userName + "'");
                }
                finally
                {
                    _objData.CloseConnection();
                }
              

                if (dsReport.Tables[0].Rows.Count != 0)
                {
                    string strEmailid = dsReport.Tables[0].Rows[0]["Email_Id"].ToString();
                    string UserName = dsReport.Tables[0].Rows[0]["User_Name"].ToString();
                    string strUserpass = dsReport.Tables[0].Rows[0]["User_Pass"].ToString();

                    if (!string.IsNullOrEmpty(strEmailid))
                    {
                        //string strSubject = "Dear Sir/Madam, \n\n Please keep a note of the following information which is critical for ensuring uninterrupted access to HiDOCTOR \n\n  Your User Id:  " + UserName + " \n  Your Password: " + strUserpass + " \n\n In case of any clarifications, please reach out to our support desk (support@swaas.net or 095600005628).\n\n Assuring you of our best services at all times.\n\n Warm Regards \n Customer Service ";
                        string companyName = "";
                        string employeeName = "";
                        string phoneNo = "Not yet registered in HiDOCTOR";
                        string mobileNo = "Not yet registered in HiDOCTOR";
                        DataSet dsEmpInfo = new DataSet();

                        try
                        {
                            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                            dsEmpInfo = _objData.ExecuteDataSet("EXEC SP_HdGetEmployeeDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + userName + "'");
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
                        string strSubjectNew = strSubject.Replace("@Name", UserName).Replace("@Pass", strUserpass);

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
                else
                {
                    return "FAILED";
                }
            }
            catch
            {
                return "FAILED";
            }

        }

    }
}
