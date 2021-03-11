using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using System.Text;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;
namespace HiDoctor_Master.Controllers
{
    public class SMS_UserIdCreationController : Controller
    {
        //
        // GET: /SMS_UserIdCreation/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /SMS_UserIdCreation/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /SMS_UserIdCreation/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /SMS_UserIdCreation/Create

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
        // GET: /SMS_UserIdCreation/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /SMS_UserIdCreation/Edit/5

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
        // GET: /SMS_UserIdCreation/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /SMS_UserIdCreation/Delete/5

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

        public ActionResult SMS_UserIdCreation()
        {

            ViewBag.date = DateTime.Now.ToString("dd/MM/yyyy");
            return View();
        }

        public string GetUserInfo(string fromDate, string toDate)
        {
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            List<SendSMS> lstUserInfo = new List<SendSMS>();
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();
            lstUserInfo = (List<SendSMS>)_objMapping.GetUserInfoDetails(companyCode, fromDate, toDate);
            try
            {
                if (lstUserInfo != null && lstUserInfo.Count > 0)
                {
                    sbTableContent.Append("<table id='tblUserInfo' class='table table-striped' style='text-align: center;'>");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca;text-align: center;'>");
                    sbTableContent.Append("<td><input type='checkbox' id='bulkcheck'name='bulkchk_User' onclick='fnselectall()'/></td>");
                    sbTableContent.Append("<td>Employee Name</td>");
                    sbTableContent.Append("<td>Employee Number</td>");
                    sbTableContent.Append("<td>User Name</td>");
                    sbTableContent.Append("<td>Designation</td>");
                    sbTableContent.Append("<td>Region Name</td>");
                    sbTableContent.Append("<td>Reporting To</td>");
                    sbTableContent.Append("<td>Created Date</td>");
                    sbTableContent.Append("<td>HiDocotor Start Date</td>");
                    sbTableContent.Append("<td>Division</td>");
                    sbTableContent.Append("<td>Sent SMS Count</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstUserInfo)
                    {
                        var userCode_ = item.User_Code.ToString();
                        sbTableContent.Append("<tr><td><input type='checkbox' id='Chk_UserInfo_' value=" + userCode_ + " name='chk_UserInfo' /></td>");
                        sbTableContent.Append("<td>" + item.Employee_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Employee_Number.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.User_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.User_Type_Name.ToString() + "</td>");//Designation
                        sbTableContent.Append("<td>" + item.Region_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Under_User_Name.ToString() + "</td>");//Reporting To
                        sbTableContent.Append("<td>" + item.Created_Date.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.HiDoctor_Start_Date.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Division_Name.ToString() + "</td>");
                        if (item.SMS_count.ToString() == "0")
                        {
                            sbTableContent.Append("<td>" + item.SMS_count.ToString() + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td><a title='View Details' onClick='fnGetSentSMSDetails(\"" + item.User_Code + "\");'href='#'>" + item.SMS_count.ToString() + "</a></td></tr>");
                        }
                    }
                    sbTableContent.Append("</tbody>");
                    sbTableContent.Append("</table>");
                }
                return sbTableContent.ToString();
            }




            // return Json(lstUserInfo, JsonRequestBehavior.AllowGet);
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public string SendPassword(string userCode, string createdDate, string hiDoctorStartDate)
        {
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                int successcount = 0;
                int failurecount = 0;
                string mesgalert = string.Empty;
                string failure = string.Empty;
                string url = string.Empty;
                string message = string.Empty;
                string userName = string.Empty;
                string password = string.Empty;
                string mobileno = string.Empty;
                Regex regExInt = new Regex("^([0-9]*)$");
                List<SendSMS> lstUser = new List<SendSMS>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objCurInfo.GetCompanyCode();
                string companyId = _objCurInfo.GetCompanyId();
                string senderCode = _objCurInfo.GetUserCode();
                string senderName = _objCurInfo.GetUserName();
                lstUser = (List<SendSMS>)_objMapping.GetUserDetails(companyCode, userCode);

                url = "https://" + Request.Url.DnsSafeHost;
                foreach (var user in lstUser)
                {
                    userCode = user.User_Code.ToString();
                    userName = user.User_Name.ToString();
                    password = user.User_Pass.ToString();
                    mobileno = user.Mobile.ToString();
                    message = "Welcome to HiDoctor. Website address for online reporting: [variable1] Your user name is [variable2] and password is [variable3].";
                    message = message.Replace("[variable1]", url).Replace("[variable2]", userName).Replace("[variable3]", password);

                    if (!string.IsNullOrEmpty(mobileno))
                    {
                        if (mobileno.Length == 10 && regExInt.IsMatch(mobileno))
                        {
                            HttpWebRequest request = (HttpWebRequest)
                            WebRequest.Create("http://www.smsintegra.co.in/smsweb/desktop_sms/desktopsms.asp?uid=swaassys&pwd=963900&mobile=" + mobileno + "&msg=" + message + "&sid=HIDOCT&dtNow=" + DateTime.Now.ToString("yyyy-MM-dd") + "");
                            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                            using (Stream responseStream = response.GetResponseStream())
                            {
                                using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                                {
                                    string strSMSResponseString = readStream.ReadToEnd();

                                    if (strSMSResponseString.StartsWith("100"))
                                    {
                                        successcount++;
                                        _objMapping.SMSSentLog(companyCode, companyId, userCode, userName, senderCode, senderName, mobileno, message);

                                    }
                                    else
                                    {
                                        failurecount++;
                                        failure += "<tr><td> " + userName + "</td><td>" + mobileno + "</td><td>Due to technical reasons unable to send SMS</td></tr>";
                                    }
                                }
                            }
                        }
                        else
                        {
                            failure += "<tr><td>" + userName + "</td><td>" + mobileno + "</td><td>Mobile No. is invalid. Please update the correct mobile no. in employee master</td></tr>";
                        }
                    }
                    else
                    {
                        failure += "<tr><td>" + userName + "</td><td>&nbsp</td><td>Mobile No. is empty. Please update the mobile no. in employee master</td></tr>";
                    }
                }
                if (failure != string.Empty)
                {
                    sbTableContent.Append("<table id='error' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td class='errortable'>User Name</td>");
                    sbTableContent.Append("<td class='errortable'>Mobile Number</td>");
                    sbTableContent.Append("<td class='errortable'>Error</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append(failure);
                    sbTableContent.Append("</table>");

                    mesgalert = "SMS sent for " + successcount + " user(s). Failed to send SMS for "+ failurecount + "user(s)";
                }
                else
                {
                    mesgalert = "SMS sent for " + successcount.ToString() + " user(s)";
                }
                return sbTableContent.ToString() + "*" + mesgalert;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:CreatedDate", createdDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public string GetSMSDetails(string userCode)
        {
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            List<SendSMS> lstSentSMSDetails = new List<SendSMS>();
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            StringBuilder sbTableContent = new StringBuilder();
            lstSentSMSDetails = (List<SendSMS>)_objMapping.GetSentSMSDetails(userCode);
            try
            {
                if (lstSentSMSDetails != null && lstSentSMSDetails.Count > 0)
                {
                    sbTableContent.Append("<h4>User Name : " + lstSentSMSDetails[0].User_Name.ToString() + "</h4>");
                    sbTableContent.Append("<table id='tblUserInfo' class='table table-striped'>");
                    sbTableContent.Append("<thead class='active' style='display:block;text-align: center;' >");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Sender Name</td>");
                    //sbTableContent.Append("<td>User Name</td>");
                    sbTableContent.Append("<td>Mobile Number</td>");
                    sbTableContent.Append("<td>Date & Time</td>");
                    sbTableContent.Append("<td style='min-width: 319px;'>SMS Details</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody style='overflow-y: scroll;display: block;height: 300px;'>");
                    foreach (var item in lstSentSMSDetails)
                    {
                        sbTableContent.Append("<td>" + item.Sender_User_Name.ToString() + "</td>");
                        //sbTableContent.Append("<td>" + item.User_Name.ToString() + "</td>");
                        sbTableContent.Append("<td style ='min-width: 101px;'>" + item.Mobile_Number.ToString() + "</td>");
                        sbTableContent.Append("<td style ='min-width: 84px;'>" + item.Date_Time.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.SMS_Details.ToString() + "</td></tr>");
                    }
                    sbTableContent.Append("</tbody>");
                    sbTableContent.Append("</table>");
                }
                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                return "Sorry an error occured. Please try again later.";
            }
        }
    }
}

