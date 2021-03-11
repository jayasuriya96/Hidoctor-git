using DataControl.HiDoctor_ActivityFactoryClasses;
using System;
using System.Net;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    public class SMSController : Controller
    {
        BL_SMS _objSMS = new BL_SMS();
        SMSSender _objSMSSender = new SMSSender();
        DataControl.JSONConverter json = new DataControl.JSONConverter();
        DataControl.CurrentInfo _objCurrent = new DataControl.CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetScheduleDates(int month, int year)
        {
            List<SMSScheduleDates> lstSMSscheduleDates = new List<SMSScheduleDates>();
            lstSMSscheduleDates = _objSMS.GetScheduleDates(month, year);
            return Json(lstSMSscheduleDates, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult GetSMSComplianceReport(string selected_date, string userType)
        public JsonResult GetSMSComplianceReport(string selected_date)
        {
            List<SMSReportModel> lstSMSCompilanceReport = new List<SMSReportModel>();
            //lstSMSCompilanceReport = _objSMS.GetSMSComplianceReport(selected_date, userType);
            lstSMSCompilanceReport = _objSMS.GetSMSComplianceReport(selected_date);
            return Json(lstSMSCompilanceReport, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSentSMSDetails(string selected_date)
        {
            List<SMSReportModel> lstSentSMS = new List<SMSReportModel>();
            lstSentSMS = _objSMS.GetSentSMSDetails(selected_date);
            return Json(lstSentSMS, JsonRequestBehavior.AllowGet);
        }

        public JsonResult InsertSelectedRecords(SMSReport obj)
        {
            string result = string.Empty;
            string Mobile_Number = string.Empty;
            string MessageReceived = string.Empty;
            foreach (var item in obj.lstModel)
            {
                item.Message = item.Message.Replace("</br>", "\n");
            }

            result = SendSMSHelper(obj);
            return Json(result);
        }

        /// <summary>
        /// used to send SMS to selected users.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>number of success and failure</returns>
        public string SendSMSHelper(SMSReport obj)
        {
            string result = string.Empty;
            result = _objSMSSender.GetSMSSender(obj);
            return result;
        }
        /// <summary>
        /// used to get successfully sent logs
        /// for a praticular selected record
        /// </summary>
        /// <param name="Alert_Sent_Log_Id"></param>
        /// <returns>list of username,mobile number and sms sent datetime</returns>
        public JsonResult GetSentLogs(int Alert_Sent_Log_Id)
        {
            List<SMSSentLog> lstSMSsentLog = new List<SMSSentLog>();
            lstSMSsentLog = _objSMS.GetSentLogs(Alert_Sent_Log_Id);
            return Json(lstSMSsentLog, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserTypes()
        {
            List<SMSUserTypes> lstUserTypes = new List<SMSUserTypes>();
            lstUserTypes = _objSMS.GetUserTypes();
            return Json(lstUserTypes, JsonRequestBehavior.AllowGet);
        }
    }
}
