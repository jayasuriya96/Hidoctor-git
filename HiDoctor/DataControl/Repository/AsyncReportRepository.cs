using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace DataControl.Repository
{
    public class AsyncReportRepository
    {
        #region Asynchronous Reports Common Functions
        private HiDoctor_ReportsFactoryClasses.DAL_ReportRegion _objDALreportRegion = new HiDoctor_ReportsFactoryClasses.DAL_ReportRegion();
        private CurrentInfo _objcurrentInfo = new CurrentInfo();
        private BLMaster _objBL = new BLMaster();

        public string GetReportProcessQueueStatus(string ReportName)
        {
            DataControl.CurrentInfo _objCurrentInfo = new CurrentInfo();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string UserCode = _objCurrentInfo.GetUserCode();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion objBLReportRegion = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.UsersReportQueues> lstReportQueue = objBLReportRegion.GetUsersReportProcessQueue(CompanyCode, UserCode, ReportName).ToList();


            StringBuilder strTbl = new StringBuilder();

            // strTbl.Append("<div><input type='button' value='Refresh' onclick='fnRefresh();'></input></div>");

            strTbl.Append("<table WIDTH='90%' id='tblsummary' class='table table-striped'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr>");
            strTbl.Append("<td width='25%'>Transaction ID</td><td width='10%'>Report Request Date time</td><td width='28%'>Report Parameters</td><td width='10%'>Process State</td><td width='17%'>Action</td>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");
            if (lstReportQueue != null)
            {
                foreach (var item in lstReportQueue)
                {
                    if (ReportName == "ProductWiseDoctorTabularReport")
                    {
                        string[] seperators = { "<br/>" };
                        string value = item.Report_Parameters;
                        string[] result = value.Split(seperators, StringSplitOptions.RemoveEmptyEntries);
                        result[2] = result[2].Replace("1", "Doctor Wise Product").Replace("2", "Product Wise Doctor").Replace("^", ",");
                        result[3] = result[3].Replace("0", "UnApproved").Replace("1", "Applied").Replace("2", "Approved").Replace("^", ",");
                        result[4] = result[4].Replace("1", "Exclude Quantity Given 0").Replace("2", "Include Quantity given 0");
                        strTbl.Append("<tr>");
                        strTbl.Append("<td>" + item.Transaction_ID + "</td>");
                        strTbl.Append("<td>" + item.Rpt_Req_DateTime + "</td>");
                        strTbl.Append("<td>" + result[0] + "<br/>" + result[1] + "<br/>" + result[2] + "<br/>" + result[3] + "<br/>" + result[4] + "</td>");
                        // strTbl.Append("<td>" + item.Report_Parameters + "</td>");
                        strTbl.Append("<td>" + item.Process_State + "</td>");
                        if (item.Process_State.Trim() == "Completed")
                        {
                            //strTbl.Append("<td class='td-a'><a onclick='fnGetAsyncReportByID(\"" + item.Transaction_ID + "," + ReportName + "\");'>View</a></td>");
                            strTbl.Append("<td class='td-a'><a onclick='fnGetAsyncReportByID(\"" + item.Transaction_ID + "\",\"" + ReportName + "\");'>View</a></td>");
                        }
                        else if (item.Process_State.Trim() == "Error")
                        {
                            strTbl.Append("<td class='td'>" + item.User_Error_Desc + "</td>");
                        }
                        else
                        {
                            strTbl.Append("<td>" + item.Process_State + "</td>");
                        }
                        strTbl.Append("</tr>");
                    }
                    else
                    {
                        strTbl.Append("<tr>");
                        strTbl.Append("<td>" + item.Transaction_ID + "</td>");
                        strTbl.Append("<td>" + item.Rpt_Req_DateTime + "</td>");
                        strTbl.Append("<td>" + item.Report_Parameters + "</td>");
                        strTbl.Append("<td>" + item.Process_State + "</td>");
                        if (item.Process_State.Trim() == "Completed")
                        {
                            //strTbl.Append("<td class='td-a'><a onclick='fnGetAsyncReportByID(\"" + item.Transaction_ID + "," + ReportName + "\");'>View</a></td>");
                            strTbl.Append("<td class='td-a'><a onclick='fnGetAsyncReportByID(\"" + item.Transaction_ID + "\",\"" + ReportName + "\");'>View</a></td>");
                        }
                        else if (item.Process_State.Trim() == "Error")
                        {
                            strTbl.Append("<td class='td'>" + item.User_Error_Desc + "</td>");
                        }
                        else
                        {
                            strTbl.Append("<td>" + item.Process_State + "</td>");
                        }
                        strTbl.Append("</tr>");
                    }
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

        public string GetAsyncReportByID(string TransactionID)
        {
            DataControl.CurrentInfo _objCurrentInfo = new CurrentInfo();
            string CompanyCode = _objCurrentInfo.GetCompanyCode();
            string UserCode = _objCurrentInfo.GetUserCode();
            string HTMLFileContent = string.Empty;

            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion objBLReportRegion = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            try
            {
                List<MVCModels.HiDoctor_Reports.UsersReportQueues> ReportQueueByID = objBLReportRegion.GetReportQueueByID(CompanyCode, TransactionID).ToList();

                using (WebClient client = new WebClient())
                {
                    HTMLFileContent = client.DownloadString(ReportQueueByID.FirstOrDefault().HTML_File_Path.ToString());
                }

                return HTMLFileContent;
            }
            finally
            {
                _objCurrentInfo = null;
                objBLReportRegion = null;

            }

        }

        public void DownloadAsyncReportExcel(FormCollection collection)
        {
            string tableContent = GetAsyncReportByID(collection["ReportTransactionID"].ToString());
            //string compnayLogo = "<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>";
            //tableContent = tableContent.Replace(compnayLogo, " ");
            tableContent = Regex.Replace(tableContent, @"(<img\/?[^>]+>)", @"", RegexOptions.IgnoreCase);
            //<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>

            HttpContext.Current.Response.ClearContent();
            HttpContext.Current.Response.Buffer = true;
            HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=" + collection["ReportName"].ToString() + ".xls");
            HttpContext.Current.Response.ContentType = "application/ms-excel";
            HttpContext.Current.Response.Output.Write("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
            HttpContext.Current.Response.Output.Write("<head>");
            HttpContext.Current.Response.Output.Write("<meta http-equiv=\"Content-Type\" content=\"text/html;charset=windows-1252\">");
            HttpContext.Current.Response.Output.Write("<!--[if gte mso 9]>");
            HttpContext.Current.Response.Output.Write("<xml>");
            HttpContext.Current.Response.Output.Write("<x:ExcelWorkbook>");
            HttpContext.Current.Response.Output.Write("<x:ExcelWorksheets>");
            HttpContext.Current.Response.Output.Write("<x:ExcelWorksheet>");
            HttpContext.Current.Response.Output.Write("<x:Name>Comprehensive Analysis Report</x:Name>");
            HttpContext.Current.Response.Output.Write("<x:WorksheetOptions>");
            HttpContext.Current.Response.Output.Write("<x:Panes>");
            HttpContext.Current.Response.Output.Write("</x:Panes>");
            HttpContext.Current.Response.Output.Write("</x:WorksheetOptions>");
            HttpContext.Current.Response.Output.Write("</x:ExcelWorksheet>");
            HttpContext.Current.Response.Output.Write("</x:ExcelWorksheets>");
            HttpContext.Current.Response.Output.Write("</x:ExcelWorkbook>");
            HttpContext.Current.Response.Output.Write("</xml>");
            HttpContext.Current.Response.Output.Write("<![endif]-->");
            HttpContext.Current.Response.Output.Write("</head>");
            HttpContext.Current.Response.Output.Write("<body>");
            HttpContext.Current.Response.Output.Write("<table>");
            HttpContext.Current.Response.Output.Write(tableContent);
            HttpContext.Current.Response.Output.Write("</table>");
            HttpContext.Current.Response.Output.Write("</body>");
            HttpContext.Current.Response.Output.Write("</html>");
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.End();
        }

        public void OnAsyncReportProcessCompletion(string CompanyCode, string CurrentUserCode, string TransNumber, string strHTMLContent, string ConnectionString, string ReportName)
        {
            //DataSet dsEmail = new DataSet();
            //string strEmailContent = string.Empty;
            //string strEmailID = string.Empty;
            //string strUserName = string.Empty;

            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

            string fileName = TransNumber + "_" + DateTime.UtcNow.ToLongDateString() + ".report";
            string blobUrl = objAzureBlob.AzureBlobUploadText(strHTMLContent, accKey, fileName, "bulkdatasvc");

            //BLUser objBLuser = new BLUser();

            try
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Completed", "", "", blobUrl, ConnectionString, CurrentUserCode);

                //dsEmail = objBLuser.checkEmailid(CompanyCode, CurrentUserCode, ConnectionString);
                //if (dsEmail.Tables[0].Rows.Count > 0)
                //{

                //    strUserName = dsEmail.Tables[0].Rows[0]["User_Name"].ToString();
                //    strEmailID = dsEmail.Tables[0].Rows[0]["Email_Id"].ToString();
                //    strEmailContent = FrameEmailContent(strUserName, ReportName, TransNumber);

                //}
                //_objBL.SendMail(strEmailID, "HiDOCTOR Report - Generated Successfully", strEmailContent);
            }

            finally
            {
                //dsEmail.Dispose();
                //objBLuser = null;
                //_objBL = null;
                //objBLuser = null;

            }
        }

        public string FrameEmailContent(string UserName, string ReportName, string TransNumber)
        {
            StringBuilder EmailContent = new StringBuilder();
            EmailContent.Append("<div>");
            EmailContent.Append("Hello " + UserName);
            EmailContent.Append("<br /><br />");
            EmailContent.Append("Your request for report '<b>" + ReportName + "</b>' with transaction ref no: '<b>" + TransNumber + "</b>' was processed successfully. ");
            EmailContent.Append("Please login into portal and view them.");
            EmailContent.Append("<br /><br />");
            EmailContent.Append("Sincerely<br />");
            EmailContent.Append("From Swaas Systems");
            EmailContent.Append("<br /><br />");
            EmailContent.Append("<i>* This is system generated e-mail. Please do not reply back.</i>");
            EmailContent.Append("</div>");
            return EmailContent.ToString();
        }

        public string GetMonthName(string month)
        {
            string monthName = string.Empty;
            if (month == "01")
            {
                monthName = "JAN";
            }
            else if (month == "02")
            {
                monthName = "FEB";
            }
            else if (month == "03")
            {
                monthName = "MAR";
            }
            else if (month == "04")
            {
                monthName = "APR";
            }
            else if (month == "05")
            {
                monthName = "MAY";
            }
            else if (month == "06")
            {
                monthName = "JUN";
            }
            else if (month == "07")
            {
                monthName = "JUL";
            }
            else if (month == "08")
            {
                monthName = "AUG";
            }
            else if (month == "09")
            {
                monthName = "SEP";
            }
            else if (month == "10")
            {
                monthName = "OCT";
            }
            else if (month == "11")
            {
                monthName = "NOV";
            }
            else if (month == "12")
            {
                monthName = "DEC";
            }
            return monthName;
        }

        #endregion Asynchronous Reports Common Functions
    }
}
