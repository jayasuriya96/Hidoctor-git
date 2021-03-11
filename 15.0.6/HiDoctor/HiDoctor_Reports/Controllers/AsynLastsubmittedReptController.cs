using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.HiDoctor_ReportsFactoryClasses;
using MVCModels;
using System.Text;



namespace HiDoctor_Reports.Controllers
{
    public class AsynLastsubmittedReptController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        //
        // GET: /AsynLastsubmittedRept/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AsynLastsubmittedRept()
        {
            return View();
        }


        public void ExcuteAsynReport(FormCollection collection)
        {
            BL_ReportRegion _objBLReport = new BL_ReportRegion();           
            string userCode = collection["hdnDownload"].ToString();

            string startDate = collection["txtFromDate"].ToString();
           
            //string startDate = DateTime.Parse(sd).ToString("yyyy-MM-dd");   
            //01/04/2016
            string endDate = collection["txtToDate"].ToString();
           // string endDate = DateTime.Parse(ed).ToString("yyyy-MM-dd");
          
           // string unlistedDoctor = collection["type"].ToString();
            string dateSelection = collection["reportType"].ToString();
            string MissedDoc = "";
            if (collection["missed"] == "MISSED")
            {
                MissedDoc = "1";
            }
            else
            {
                MissedDoc = "0";
            }           
            string UnlistedDoc = "";
            if (collection["Unlisted"] == "INCLUDE")
            {
                UnlistedDoc = "1";
            }
            else {
                UnlistedDoc = "0";
            }
            string UserSelection = string.Empty;
           // string reportName = collection["title"].ToString();
            //string missedDoctor = collection["missed"].ToString();
            //string reportViewType = collection["reportViewType"].ToString();
            if (userCode.ToUpper() == "ALL")
            {
                userCode = _objcurrentInfo.GetUserCode();
                UserSelection = "ALL";
            }
            else
            {
                userCode = userCode.Replace(",,", ",");
            }

            //string userSelection = collection["type"].ToString();
            string userSelection = string.Empty;
            string[] stDate = startDate.Split('/');
            string[] enDate = endDate.Split('/');
            startDate = stDate[2] + "-" + stDate[1] + "-" + stDate[0];
            endDate = enDate[2] + "-" + enDate[1] + "-" + enDate[0];

             _objBLReport.ExcuteAsynLastSubmitted(_objcurrentInfo.GetCompanyCode(),_objcurrentInfo.GetUserCode(), userCode, startDate, endDate, userSelection,_objcurrentInfo.GetSubDomain(),MissedDoc,UnlistedDoc);
                    
        }

        public string GetAsynReportstatus()
        {
            List<AsynReportModel> lstReportsURL = new List<AsynReportModel>();
            BL_ReportRegion _objReport = new BL_ReportRegion();
            string userCode = _objcurrentInfo.GetUserCode();
            StringBuilder strTbl = new StringBuilder();
            lstReportsURL = _objReport.GetReportsURL(userCode).ToList();
           // strTbl.Append("<div><input type='button' value='Refresh' onclick='fnRefresh();'></input></div>");

            strTbl.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr>");
            strTbl.Append("<td>Report Request Date time</td><td>Param</td><td>Status</td>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");
            if (lstReportsURL != null && lstReportsURL.Count > 0)
            {
                foreach (var report in lstReportsURL)
                {
                    strTbl.Append("<tr>");                   
                    strTbl.Append("<td>" + report.Report_Completion_datetime + "</td>");
                    strTbl.Append("<td>" + report.Parameter + "</td>");
                    if (report.Request_Status == 1)
                    {
                        strTbl.Append("<td class='td-a'><a onclick='fnGetAsyncLastsubmitReport(\"" + report.Request_ID + "\");'>View</a></td>");
                    }
                    else
                    {
                        strTbl.Append("<td>In Progress</td>");
                    }
                    strTbl.Append("</tr>");
                }
            }
            else
            {
                strTbl.Append("<tr><td colspan='4' style='text-align:center;'>No Details Found.</td></tr>");
            }
            strTbl.Append("</tbody>");
            strTbl.Append("</table>");
            return strTbl.ToString();
        }

        public string GetAsyncReport(int requestId, string MissedDoc, string UnlistedDoc, string startDate, string endDate)
        {
            string strTbl = string.Empty;
            BL_ReportRegion _objReport = new BL_ReportRegion();
            strTbl = _objReport.GetAsynLastSubURL(requestId, _objcurrentInfo.GetCompanyCode(),MissedDoc,UnlistedDoc,startDate,endDate);
            return strTbl;
        }
    }
}
