using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using System.Web.SessionState;
using System.Data;
using System.Text;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;

namespace HiDoctor_Reports.Controllers
{
    //[SessionState(SessionStateBehavior.ReadOnly)]
    //[AjaxSessionActionFilter]
    public class ExpenseGroupReportController : Controller
    {
        #region Private Variables
        private DataControl.BL_Report _objBL = new DataControl.BL_Report();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables
        //
        // GET: /ExpenseGroupReport/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Config for EXPENSE_GROUP_PRINT_FORMAT
        /// </summary>
        /// <param name="Company Code">Company Code</param>
        /// <param name="Config Type">Config Type</param>
        /// <param name="Config Key">Config Key</param>
        /// <returns>String Config Value</returns>
        public string GetReportExpenseGroupPrintFormatConfigValue()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string EXPENSE_GROUP_PRINT_FORMAT = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.REPORT, CONFIG_KEY.EXPENSE_GROUP_PRINT_FORMAT);
            return EXPENSE_GROUP_PRINT_FORMAT;
        }

        // Expense group wise report
        public string GetExpenseAnalysisGroupWiseReport(FormCollection collection)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                StringBuilder sbPrintTbl = new StringBuilder();
                DataSet dsReport = new DataSet();
                DataSet dsDocDetails = new DataSet();
                DataSet dsChemDetails = new DataSet();
                DataSet dsManagerDetails = new DataSet();

                StringBuilder sbTableContentExcel = new StringBuilder();
                StringBuilder sbFooter = new StringBuilder();
                string blobUrl = string.Empty, error = string.Empty;
                string userCodecom = string.Empty;
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty, activityStatus = string.Empty, docChemistMet = string.Empty, reportName = string.Empty;
                int rowCount;
                double totalExp = 0.00;
                double totaldistance = 0.00;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');
                activityStatus = collection["activityStatus"].ToString();
                activityStatus = activityStatus.TrimEnd(',');
                docChemistMet = collection["docChemistMet"].ToString();
                docChemistMet = docChemistMet.TrimEnd(',');
                rowCount = Convert.ToInt16(collection["rowCount"]);
                reportName = collection["reportName"].ToString();

                #region getting  data
                dsReport = _objBL.GetExpenseAnalysisGroupWiseReport(_objcurrentInfo.GetCompanyCode(), collection["userCode"].ToString(), from, to, dcrStatus, activityStatus);

                if (docChemistMet != "" && activityStatus.Contains('F'))
                {
                    if (docChemistMet.Contains("D"))
                    {
                        dsDocDetails = _objBL.GetExpenseAnalysisGroupWiseReportCustomerCount(_objcurrentInfo.GetCompanyCode(), collection["userCode"].ToString(), from, to, dcrStatus, "D");
                    }
                    if (docChemistMet.Contains("C"))
                    {
                        dsChemDetails = _objBL.GetExpenseAnalysisGroupWiseReportCustomerCount(_objcurrentInfo.GetCompanyCode(), collection["userCode"].ToString(), from, to, dcrStatus, "C");
                    }
                    if (docChemistMet.Contains("M"))
                    {
                        dsManagerDetails = _objBL.GetExpenseAnalysisGroupWiseReportCustomerCount(_objcurrentInfo.GetCompanyCode(), collection["userCode"].ToString(), from, to, dcrStatus, "M");
                    }
                }
                #endregion getting data

                int docCount = 4;
                if (docChemistMet.Contains("D"))
                {
                    docCount = docCount - 1;
                }
                if (docChemistMet.Contains("C"))
                {
                    docCount = docCount - 2;
                }
                if (docChemistMet.Contains("M"))
                {
                    docCount = docCount - 1;
                }

                if (dsReport != null && dsReport.Tables.Count > 0 && dsReport.Tables[0].Rows.Count > 0)
                {
                    string dcrStatusForReport = dcrStatus.Replace("1", "Applied");
                    dcrStatusForReport = dcrStatusForReport.Replace("2", "Approved");
                    dcrStatusForReport = dcrStatusForReport.Replace("3", "Drafted");
                    dcrStatusForReport = dcrStatusForReport.Replace("0", "Unapproved");

                    string docChemistForReport = docChemistMet.Replace("D", "Doctor");
                    docChemistForReport = docChemistForReport.Replace("C", "Chemist");
                    docChemistForReport = docChemistForReport.Replace("M", "Manager");

                    string activityForReport = activityStatus.Replace("F", "Field");
                    activityForReport = activityForReport.Replace("A", "Attendance");

                    #region Report User DEtails
                    // User details                    
                    sbTbl.Append("<div id='dvUserDetails'><table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                    sbTbl.Append("<thead>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left' colspan='2'>");
                    sbTbl.Append("Expense Analysis Group Wise Report for the period " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " - " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "(Considered " + dcrStatusForReport + " DCRs)");
                    if (docChemistForReport != "")
                    {
                        sbTbl.Append(" - " + docChemistForReport);
                    }
                    if (activityForReport != "")
                    {
                        sbTbl.Append(" - " + activityForReport);
                    }
                    sbTbl.Append("</th>");
                    sbTbl.Append("<th>");
                    sbTbl.Append("<div style='float:left;width:100%'>");
                    sbTbl.Append("<div style='width: 30%;'>");
                    sbTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                    sbTbl.Append("</div>");
                    sbTbl.Append("</div>");
                    sbTbl.Append("</th>");
                    sbTbl.Append("</tr>");

                    userCodecom = dsReport.Tables[0].Rows[0]["User_Code"].ToString();
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left'>Company Name : " + dsReport.Tables[0].Rows[0]["Company_Name"] + "</th>");
                    sbTbl.Append("<th align='left'>User Name : " + dsReport.Tables[0].Rows[0]["User_Name"] + "</th>");
                    sbTbl.Append("<th align='left'>Designation : " + dsReport.Tables[0].Rows[0]["User_Type_Name"] + "</th>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left'>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</th>");
                    sbTbl.Append("<th align='left'>Employee Number : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</th>");
                    sbTbl.Append("<th align='left'>Division : " + dsReport.Tables[0].Rows[0]["Division_Name"] + "</th>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left'>Territory Name : " + dsReport.Tables[0].Rows[0]["Region_Name"] + "</th>");
                    sbTbl.Append("<th align='left'>Reporting Manager : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + dsReport.Tables[0].Rows[0]["Manager_Name"] + ")</th>");
                    sbTbl.Append("<th align='left'>Reporting HQ : " + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left'>Account Number : " + dsReport.Tables[0].Rows[0]["Acc_No"] + "</th>");
                    sbTbl.Append("<th align='left'>Date of joining : " + ((dsReport.Tables[0].Rows[0]["DOJ"] == null) ? "-" : dsReport.Tables[0].Rows[0]["DOJ"]) + "</th>");
                    sbTbl.Append("<th align='left'>Phone number : " + ((dsReport.Tables[0].Rows[0]["Mobile"] == null) ? "NA" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</th>");
                    sbTbl.Append("</tr></thead></table></div></br>");

                    #endregion Report User DEtails

                    string strReportExpenseGroupPrintFormatConfig = GetReportExpenseGroupPrintFormatConfigValue().ToUpper();
                    switch (strReportExpenseGroupPrintFormatConfig)
                    {
                        case "NO":
                            // print
                            #region Print User DEtails
                            sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                            sbPrintTbl.Append("<thead>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='2'  style='font-size:18px;' align='left'><b>Expense Analysis Group Wise Report </b></th>");
                            sbPrintTbl.Append("<th align='right'>");
                            sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                            sbPrintTbl.Append("</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'><b>Company Name : " + dsReport.Tables[0].Rows[0]["Company_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'><b>User Name : " + dsReport.Tables[0].Rows[0]["User_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Designation : " + dsReport.Tables[0].Rows[0]["User_Type_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");


                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px'><b>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px'><b>Employee Number : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Division : " + dsReport.Tables[0].Rows[0]["Division_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Territory Name : " + dsReport.Tables[0].Rows[0]["Region_Name"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Reporting Manager : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + dsReport.Tables[0].Rows[0]["Manager_Name"] + ")</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Reporting HQ : " + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");


                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Account Number : " + dsReport.Tables[0].Rows[0]["Acc_No"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Date of joining : " + ((dsReport.Tables[0].Rows[0]["DOJ"] == null) ? "-" : dsReport.Tables[0].Rows[0]["DOJ"]) + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Phone number : " + ((dsReport.Tables[0].Rows[0]["Mobile"] == null) ? "NA" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</th>");
                            sbPrintTbl.Append("</tr>");



                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Period: " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " to " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>DCR Status: " + dcrStatusForReport + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Activity Status: " + activityForReport + "</th>");
                            sbPrintTbl.Append("</tr>");

                            if (docChemistForReport != "")
                            {
                                sbPrintTbl.Append("<tr>");
                                sbPrintTbl.Append("<th colspan='3' align='left' style='font-size:12px;'>Includes " + docChemistForReport + " information</th>");
                                sbPrintTbl.Append("</tr>");
                            }

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='3' align='left'><span style='font-size:25px' id='dvPrintTotal'></span></th>");
                            sbPrintTbl.Append("</tr>");
                            sbPrintTbl.Append("</thead></table><br />");

                            sbPrintTbl.Append("<div style='float:left;width:100%;font-size:18px;font-weight:bold;' id='dvPrintTotal'></div><br />");
                            #endregion Print User DEtails
                            break;
                        case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                        case "WITH_2COLUMN_HEADER":
                            // print for a 2 Column
                            #region Print User Details for a 2 Column
                            sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                            sbPrintTbl.Append("<thead>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th  style='font-size:22px;' align='left'><b>Expense Analysis Group Wise Report </b></th>");
                            sbPrintTbl.Append("<th align='right'>");
                            sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                            sbPrintTbl.Append("</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'><b>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "-" + dsReport.Tables[0].Rows[0]["Employee_Number"] + "(" + dsReport.Tables[0].Rows[0]["User_Name"] + ")</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Designation/Division : " + dsReport.Tables[0].Rows[0]["User_Type_Name"] + " / " + dsReport.Tables[0].Rows[0]["Division_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Territory : " + dsReport.Tables[0].Rows[0]["Region_Name"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Manager : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + dsReport.Tables[0].Rows[0]["Manager_Name"] + ")</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>HQ : " + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Account Number : " + dsReport.Tables[0].Rows[0]["Acc_No"] + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Date of joining : " + ((dsReport.Tables[0].Rows[0]["DOJ"] == null) ? "-" : dsReport.Tables[0].Rows[0]["DOJ"]) + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Phone number : " + ((dsReport.Tables[0].Rows[0]["Mobile"] == null) ? "NA" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Period: " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " to " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:16px;'>DCR Status: " + dcrStatusForReport + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='2' align='left' style='font-size:16px;'>Activity Status: " + activityForReport + "</th>");
                            sbPrintTbl.Append("</tr>");

                            if (docChemistForReport != "")
                            {
                                sbPrintTbl.Append("<tr>");
                                sbPrintTbl.Append("<th colspan='2' align='left' style='font-size:16px;'>Includes " + docChemistForReport + " information</th>");
                                sbPrintTbl.Append("</tr>");
                            }

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='2' align='left'><span style='font-size:25px' id='dvPrintTotal'></span></th>");
                            sbPrintTbl.Append("</tr>");
                            sbPrintTbl.Append("</thead></table><br />");

                            sbPrintTbl.Append("<div style='float:left;width:100%;font-size:18px;font-weight:bold;' id='dvPrintTotal'></div><br />");
                            #endregion Print User DEtails
                            break;
                        case "WITH_SUMMARY":
                            // print
                            #region Print User DEtails
                            sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                            sbPrintTbl.Append("<thead>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='2'  style='font-size:18px;' align='left'><b>Expense Analysis Group Wise Report </b></th>");
                            sbPrintTbl.Append("<th align='right'>");
                            sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                            sbPrintTbl.Append("</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'><b>Company Name : " + dsReport.Tables[0].Rows[0]["Company_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'><b>User Name : " + dsReport.Tables[0].Rows[0]["User_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Designation : " + dsReport.Tables[0].Rows[0]["User_Type_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");


                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px'><b>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px'><b>Employee Number : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</b></th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Division : " + dsReport.Tables[0].Rows[0]["Division_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Territory Name : " + dsReport.Tables[0].Rows[0]["Region_Name"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Reporting Manager : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + dsReport.Tables[0].Rows[0]["Manager_Name"] + ")</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Reporting HQ : " + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>");
                            sbPrintTbl.Append("</tr>");


                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Account Number : " + dsReport.Tables[0].Rows[0]["Acc_No"] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Date of joining : " + ((dsReport.Tables[0].Rows[0]["DOJ"] == null) ? "-" : dsReport.Tables[0].Rows[0]["DOJ"]) + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Phone number : " + ((dsReport.Tables[0].Rows[0]["Mobile"] == null) ? "NA" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</th>");
                            sbPrintTbl.Append("</tr>");



                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Period: " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " to " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>DCR Status: " + dcrStatusForReport + "</th>");
                            sbPrintTbl.Append("<th align='left' style='font-size:10px;'>Activity Status: " + activityForReport + "</th>");
                            sbPrintTbl.Append("</tr>");

                            if (docChemistForReport != "")
                            {
                                sbPrintTbl.Append("<tr>");
                                sbPrintTbl.Append("<th colspan='3' align='left' style='font-size:12px;'>Includes " + docChemistForReport + " information</th>");
                                sbPrintTbl.Append("</tr>");
                            }

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='3' align='left'><span style='font-size:25px' id='dvPrintTotal'></span></th>");
                            sbPrintTbl.Append("</tr>");
                            sbPrintTbl.Append("</thead></table><br />");

                            sbPrintTbl.Append("<div style='float:left;width:100%;font-size:18px;font-weight:bold;' id='dvPrintTotal'></div><br />");
                            #endregion Print User DEtails
                            break;
                    }



                    //$("#divReport").append(tblCont);

                    // FOR EXPENSE DETAILS
                    DateTime fromDate = Convert.ToDateTime(from);
                    DateTime toDate = Convert.ToDateTime(to);

                    DateTime tempDate = new DateTime();

                    ///  Print Content
                    #region print table header
                    sbPrintTbl.Append("<table cellspacing='0' cellpadding='1' width='100%'>");
                    sbPrintTbl.Append("<thead>");

                    sbPrintTbl.Append("<th style='text-align:left;width: 6%;col'>Date</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Activity name</th>");
                    if (rowCount != 1)
                    {
                        sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Status</th>");
                    }
                    sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Category</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Work Place</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: 10%'>From-To,Mode</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Distance</th>");
                    if (docChemistMet.Contains("D"))
                    {
                        sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Doctors Met</th>");
                    }
                    if (docChemistMet.Contains("C"))
                    {
                        sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Chemist Met</th>");
                        sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Chemist POB</th>");
                    }
                    if (docChemistMet.Contains("M"))
                    {
                        sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Accompanist Count</th>");
                    }
                    #endregion print table header


                    // Main Report
                    #region Report Header
                    sbTbl.Append("<div style='float:left; width:100%;overflow:scroll;'><table cellspacing='0' cellpadding='0' id='tblExpenseAnalysis' class='data display dataTable box' width='100%' border='1'>");
                    sbTbl.Append("<thead style='display:table-header-group;'>");

                    sbTbl.Append("<tr>");
                    string rwSpn = "";
                    if (dsReport.Tables[2].Rows.Count > 0)
                    {
                        rwSpn = "rowspan='2'";
                    }

                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">User Name</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Employee Name</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Division Name</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Date of Joining</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Manager Name</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Manager Territory name</th>");
                    sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Territory Name</th>");

                    sbTbl.Append("<th " + rwSpn + ">Date</th>");
                    sbTbl.Append("<th " + rwSpn + ">Activity name</th>");
                    sbTbl.Append("<th " + rwSpn + ">Status</th>");
                    sbTbl.Append("<th " + rwSpn + ">Category</th>");
                    sbTbl.Append("<th " + rwSpn + ">Work Place</th>");
                    sbTbl.Append("<th " + rwSpn + ">From-To,Mode(Distance)</th>");
                    sbTbl.Append("<th " + rwSpn + ">Sum of Distance</th>");
                    if (docChemistMet.Contains("D"))
                    {
                        sbTbl.Append("<th " + rwSpn + ">Doctors Met</th>");
                    }
                    if (docChemistMet.Contains("C"))
                    {
                        sbTbl.Append("<th " + rwSpn + ">Chemist Met</th>");
                        sbTbl.Append("<th " + rwSpn + ">Chemist POB</th>");
                    }
                    if (docChemistMet.Contains("M"))
                    {
                        sbTbl.Append("<th " + rwSpn + ">Accompanist Count</th>");
                    }

                    double colsLength = dsReport.Tables[2].Rows.Count + 1;
                    colsLength = colsLength / 60;
                    if (dsReport.Tables[2].Rows.Count > 0)
                    {
                        for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                        {
                            sbTbl.Append("<th colspan='3' style='text-align:center; height:50px'>" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + "</th>");
                            sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px' >" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + "</th>");
                        }
                    }
                    sbTbl.Append("<th " + rwSpn + ">Total Expense</th>");
                    sbTbl.Append("<th " + rwSpn + ">Remarks</th>");
                    sbTbl.Append("</tr>");

                    sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Total Expense</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Remarks</th>");
                    sbPrintTbl.Append("</tr>");

                    sbPrintTbl.Append("</thead><tbody style='display:table-row-group;'>");

                    if (dsReport.Tables[2].Rows.Count > 0)
                    {
                        sbTbl.Append("<tr>");
                        for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                        {
                            sbTbl.Append("<th style='height:50px'>Expense Mode(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                            sbTbl.Append("<th style='height:50px' >Eligibility Amount(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                            sbTbl.Append("<th style='height:50px' >Expense Amount(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                        }
                        sbTbl.Append("</tr>");
                    }

                    sbTbl.Append("</thead><tbody>");
                    #endregion Report Header

                    double[] subTotArray = new double[dsReport.Tables[2].Rows.Count];
                    double[] subTotDocChemistArray = new double[4 - docCount];
                    for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                    {
                        subTotArray[u] = 0.00;
                    }
                    for (int u = 0; u < (4 - docCount); u++)
                    {
                        subTotDocChemistArray[u] = 0.00;
                    }

                    #region Date Loop
                    for (tempDate = fromDate; tempDate <= toDate; tempDate = tempDate.AddDays(1))
                    {

                        string tempDateString = tempDate.ToString("dd/MM/yyyy");

                        DataRow[] dcrJson, holidayJson;
                        dcrJson = dsReport.Tables[3].Select("DCR_Actual_Date='" + tempDateString + "'");
                        holidayJson = dsReport.Tables[9].Select("Holiday_Date='" + tempDateString + "'");

                        // if dcr entered
                        if (dcrJson != null && dcrJson.Length > 0)
                        {
                            for (int k = 0; k < dcrJson.Length; k++)
                            {
                                sbTbl.Append("<tr>");
                                sbPrintTbl.Append("<tr>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                                sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                                string style = "";

                                #region Holiday or sunday
                                if ((holidayJson != null && holidayJson.Length > 0) || tempDate.DayOfWeek.ToString() == "Sunday")
                                {
                                    style = "style='background-color: #d3d3d3;'";
                                    string holidayOrSunday = "";
                                    if (holidayJson != null && holidayJson.Length > 0)
                                    {
                                        holidayOrSunday = "Holiday";
                                    }
                                    else
                                    {
                                        holidayOrSunday = "Sunday";
                                    }

                                    sbTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                    sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                    // Holiday/Sunday with Leave
                                    if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                    {
                                        DataRow[] ljson = dsReport.Tables[6].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                        if (ljson != null && ljson.Length > 0)
                                        {
                                            sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0]["Leave_Type_Name"] + ")</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0]["Leave_Type_Name"] + ")</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                        }
                                    }

                                        // Holiday/Sunday with Attendance
                                    else if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                    {
                                        DataRow[] lAttjson = dsReport.Tables[5].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                        if (lAttjson != null && lAttjson.Length > 0)
                                        {
                                            sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + lAttjson[0]["Activity_Name"] + ")</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + lAttjson[0]["Activity_Name"] + ")</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                        }
                                    }

                                        // Holiday/Sunday with Field
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                    }
                                }

                                #endregion Holiday  or sunday

                                #region DCR Activity
                                else
                                {
                                    style = "";
                                    sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                    sbTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                    // Only Leave
                                    if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                    {

                                        DataRow[] lOnlyjson = dsReport.Tables[6].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                        if (lOnlyjson != null && lOnlyjson.Length > 0)
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyjson[0]["Leave_Type_Name"] + ")</td>");

                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyjson[0]["Leave_Type_Name"] + ")</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                        }
                                    }


                                        // Only Attendance
                                    else if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                    {
                                        DataRow[] lOnlyAttjson = dsReport.Tables[5].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                        if (lOnlyAttjson != null && lOnlyAttjson.Length > 0)
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyAttjson[0]["Activity_Name"] + ")</td>");

                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyAttjson[0]["Activity_Name"] + ")</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                        }

                                    }

                                        // Only Field
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                    }
                                }
                                #endregion DCR Activity

                                if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                {
                                    sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                    if (rowCount != 1)
                                    {
                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                    }
                                }
                                else
                                {
                                    if (activityStatus == "F,A" || (dcrJson[k]["DCR_Type"].ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k]["DCR_Type"].ToString() == "Attendance" && activityStatus.Contains("A")))
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                        if (rowCount != 1)
                                        {
                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                        }
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        if (rowCount != 1)
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                        }
                                    }
                                }
                                //sri//
                                //for Leave
                                if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                {
                                    int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                                    for (int u = 0; u < (10 + dynColumn - docCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        }
                                    }

                                    for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                        }
                                        else
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                        }
                                    }
                                }

                                    //for Attendance and field
                                else
                                {
                                    if (activityStatus == "F,A" || (dcrJson[k]["DCR_Type"].ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k]["DCR_Type"].ToString() == "Attendance" && activityStatus.Contains("A")))
                                    {

                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["Category"] + "</td>");
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["Place_Worked"] + "</td>");

                                        sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Category"] + "</td>");
                                        sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Place_Worked"] + "</td>");

                                        // for HQ
                                        if (dcrJson[k]["Category"].ToString() == "HQ")
                                        {
                                            if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"].ToString() != "")
                                            {
                                                sbTbl.Append("<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                                sbTbl.Append("<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");

                                                sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                                sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                                totaldistance += Convert.ToInt32(dcrJson[k]["Travelled_Kms"]);
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td " + style + "></td>");
                                                sbTbl.Append("<td " + style + "></td>");
                                                sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                            }
                                        }

                                            // for other than HQ
                                        else
                                        {
                                            if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"].ToString() != "")
                                            {
                                                sbTbl.Append("<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                                sbTbl.Append("<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                                sbPrintTbl.Append("<td>" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                                sbPrintTbl.Append("<td>" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                            }
                                            else
                                            {
                                                DataRow[] rdJson = dsReport.Tables[4].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_HOP_Flag='" + dcrJson[k]["Flag"] + "'");
                                                if (rdJson != null && rdJson.Length > 0)
                                                {
                                                    // sbTbl.Append("<td " + style + ">");
                                                    sbTbl.Append("<td " + style + ">");
                                                    // sbPrintTbl.Append("<td " + style + ">");
                                                    sbPrintTbl.Append("<td " + style + ">");
                                                    for (int g = 0; g < rdJson.Length; g++)
                                                    {
                                                        if (rdJson[g]["Route_Way"].ToString() != "R")
                                                        {
                                                            sbPrintTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                            // sbPrintTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                            sbTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                            //sbTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                        }
                                                        else
                                                        {
                                                            sbPrintTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                            // sbPrintTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                            sbTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ") </br>");
                                                            //  sbTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                        }
                                                    }
                                                    // sbTbl.Append("</td>");
                                                    sbTbl.Append("</td>");
                                                    // sbPrintTbl.Append("</td>");
                                                    sbPrintTbl.Append("</td>");
                                                }
                                                else
                                                {
                                                    // sbTbl.Append("<td " + style + "></td>");
                                                    sbTbl.Append("<td " + style + "></td>");
                                                    // sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                    sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                }

                                                if (rdJson != null && rdJson.Length > 0)
                                                {
                                                    // sbTbl.Append("<td " + style + ">");
                                                    sbTbl.Append("<td " + style + ">");
                                                    // sbPrintTbl.Append("<td " + style + ">");
                                                    sbPrintTbl.Append("<td " + style + ">");
                                                    double HopDistance = 0.0;
                                                    for (int g = 0; g < rdJson.Length; g++)
                                                    {
                                                        if (rdJson[g]["Route_Way"].ToString() != "R")
                                                        {
                                                            //sbPrintTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "</br>");
                                                            //sbPrintTbl.Append(rdJson[g]["Distance"] + "," + "</br>");
                                                            //sbTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "</br>");
                                                            //added sri
                                                            //sbTbl.Append(rdJson[g]["Distance"] + "," + "</br>");
                                                            HopDistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                            totaldistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                        }
                                                        else
                                                        {
                                                            // sbPrintTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "</br>");
                                                            //sbPrintTbl.Append(rdJson[g]["Distance"] + "</br>");
                                                            // sbTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "</br>");
                                                            // sbTbl.Append(rdJson[g]["Distance"] + "</br>");
                                                            HopDistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                            totaldistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                        }
                                                    }
                                                    sbTbl.Append(HopDistance);
                                                    sbPrintTbl.Append(HopDistance);
                                                    // sbTbl.Append("</td>");
                                                    sbTbl.Append("</td>");
                                                    // sbPrintTbl.Append("</td>");
                                                    sbPrintTbl.Append("</td>");
                                                }
                                                else
                                                {
                                                    // sbTbl.Append("<td " + style + "></td>");
                                                    sbTbl.Append("<td " + style + "></td>");
                                                    // sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                    sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                }
                                            }
                                        }

                                        // doctor, chemist, accompanist detail
                                        if (docChemistMet.Length > 0)
                                        {
                                            if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                            {
                                                if (docChemistMet.Contains("D"))
                                                {
                                                    sbTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                }
                                                if (docChemistMet.Contains("C"))
                                                {
                                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                                }
                                                if (docChemistMet.Contains("M"))
                                                {
                                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                                }
                                            }
                                            else
                                            {
                                                int docChemistArrCount = 0;

                                                if (docChemistMet.Contains("D"))
                                                {
                                                    DataRow[] drCountJson = dsDocDetails.Tables[0].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                    if (drCountJson != null && drCountJson.Length > 0)
                                                    {
                                                        sbTbl.Append("<td>" + drCountJson[0]["Doctor_Count"] + "</td>");
                                                        sbPrintTbl.Append("<td>" + drCountJson[0]["Doctor_Count"] + "</td>");
                                                        subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(drCountJson[0]["Doctor_Count"]);
                                                    }
                                                    else
                                                    {
                                                        sbTbl.Append("<td>-</td>");
                                                        sbPrintTbl.Append("<td>-</td>");
                                                    }
                                                    docChemistArrCount++;
                                                }

                                                if (docChemistMet.Contains("C"))
                                                {
                                                    DataRow[] chemCountJson = dsChemDetails.Tables[0].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                    if (chemCountJson != null && chemCountJson.Length > 0)
                                                    {
                                                        sbTbl.Append("<td>" + chemCountJson[0]["Chemist_Count"] + "</td>");
                                                        sbPrintTbl.Append("<td>" + chemCountJson[0]["Chemist_Count"] + "</td>");
                                                        subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(chemCountJson[0]["Chemist_Count"]);
                                                    }
                                                    else
                                                    {
                                                        sbTbl.Append("<td>-</td>");
                                                        sbPrintTbl.Append("<td>-</td>");
                                                    }
                                                    docChemistArrCount++;

                                                    DataRow[] chemPOBJson = dsChemDetails.Tables[1].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                    if (chemPOBJson != null && chemPOBJson.Length > 0)
                                                    {
                                                        sbTbl.Append("<td>" + chemPOBJson[0]["PO_Amount"] + "</td>");
                                                        sbPrintTbl.Append("<td>" + chemPOBJson[0]["PO_Amount"] + "</td>");
                                                        subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(chemPOBJson[0]["PO_Amount"]);
                                                    }
                                                    else
                                                    {
                                                        sbTbl.Append("<td>-</td>");
                                                        sbPrintTbl.Append("<td>-</td>");
                                                    }
                                                    docChemistArrCount++;
                                                }

                                                if (docChemistMet.Contains("M"))
                                                {
                                                    DataRow[] mangrJson = dsManagerDetails.Tables[0].Select("DCR_Date='" + tempDateString + "'");

                                                    if (mangrJson != null && mangrJson.Length > 0)
                                                    {
                                                        if (mangrJson[0]["Acc_Count"].ToString() == "0")
                                                        {
                                                            sbTbl.Append("<td>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                        }
                                                        else
                                                        {
                                                            sbTbl.Append("<td class='td-a' onclick=fnOpenAccompanistDetails(\"" + mangrJson[0]["DCR_Date"] + "\")>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                        }
                                                        sbPrintTbl.Append("<td>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                        subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(mangrJson[0]["Acc_Count"]);
                                                    }
                                                    else
                                                    {
                                                        sbTbl.Append("<td>-</td>");
                                                        sbPrintTbl.Append("<td>-</td>");
                                                    }
                                                }
                                            }
                                        }

                                        // Expense details
                                        for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                                        {
                                            // sub total for print.                                            
                                            DataRow[] expMode = null;
                                            if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                            {
                                                expMode = dsReport.Tables[8].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND Flag='A' AND Expense_Type_Code='" + dsReport.Tables[2].Rows[u]["Expense_Type_Code"] + "'");
                                            }
                                            else if (dcrJson[k]["DCR_Type"].ToString() == "Field")
                                            {
                                                expMode = dsReport.Tables[8].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND Flag='F' AND Expense_Type_Code='" + dsReport.Tables[2].Rows[u]["Expense_Type_Code"] + "'");
                                            }

                                            if (expMode != null && expMode.Length > 0)
                                            {
                                                sbTbl.Append("<td " + style + ">" + ((expMode[0]["Expense_Mode"] == null) ? "-" : expMode[0]["Expense_Mode"]) + "</td>");
                                                sbTbl.Append("<td style='text-align:center'>" + ((expMode[0]["Eligibility_Amount"] == null) ? "-" : Convert.ToDouble(expMode[0]["Eligibility_Amount"]).ToString("N2")) + "</td>");
                                                sbTbl.Append("<td style='text-align:center'>" + ((expMode[0]["Expense_Amount"] == null) ? "0.00" : Convert.ToDouble(expMode[0]["Expense_Amount"]).ToString("N2")) + "</td>");

                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>" + ((expMode[0]["Expense_Amount"] == null) ? "0.00" : Convert.ToDouble(expMode[0]["Expense_Amount"]).ToString("N2")) + "</td>");

                                                if (expMode[0]["Expense_Amount"].GetType() == typeof(decimal) && expMode[0]["Expense_Amount"] != null && expMode[0]["Expense_Amount"].ToString() != "")
                                                {
                                                    subTotArray[u] += Convert.ToDouble(expMode[0]["Expense_Amount"]);
                                                }
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td " + style + ">-</td>");
                                                sbTbl.Append("<td " + style + " align='right'>-</td>");
                                                sbTbl.Append("<td " + style + " align='right'>-</td>");
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>-</td>");
                                            }
                                        }

                                        // total expense
                                        DataRow[] expJson = null;
                                        if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                        {
                                            expJson = dsReport.Tables[7].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_Flag='A'");
                                        }
                                        else if (dcrJson[k]["DCR_Type"].ToString() == "Field")
                                        {
                                            expJson = dsReport.Tables[7].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_Flag='F'");
                                        }

                                        if (expJson != null && expJson.Length > 0)
                                        {
                                            sbTbl.Append("<td style='text-align:center' class='td-a' onclick='fnShowExpenseAnalysisDetails(\"" + expJson[0]["DCR_Code"] + "_" + expJson[0]["DCR_Flag"] + "\")'>" + Convert.ToDouble(expJson[0]["Total"]).ToString("N2") + "</td>");
                                            totalExp = totalExp + Convert.ToDouble(expJson[0]["Total"]);

                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>" + Convert.ToDouble(expJson[0]["Total"]).ToString("N2") + "</td>");

                                            //Remarks
                                            sbTbl.Append("<td >" + expJson[0]["Remarks"].ToString().TrimEnd(',') + "</td>");
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;text-align:center;'>" + expJson[0]["Remarks"].ToString().TrimEnd(',') + "</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + " align='right'>-</td>");
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>-</td>");

                                            // remarks
                                            sbTbl.Append("<td " + style + ">-</td>");
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;text-align:center;'>-</td>");
                                        }
                                    }
                                    else
                                    {
                                        int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                                        for (int u = 0; u < (10 + dynColumn - docCount); u++)
                                        {
                                            if (u == 0)
                                            {
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                            }
                                        }

                                        for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                        {
                                            if (u == 0)
                                            {
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                            }
                                            else
                                            {
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                            }
                                        }
                                    }
                                }
                                sbTbl.Append("</tr>");
                                sbPrintTbl.Append("</tr>");
                            }

                        }

                            // holiday entered
                        #region Holiday
                        else if (holidayJson != null && holidayJson.Length > 0)
                        {
                            sbTbl.Append("<tr>");
                            sbPrintTbl.Append("<tr>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            if (tempDate.DayOfWeek.ToString() == "Sunday")
                            { // holiday on sunday
                                sbTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0]["Holiday"] + ")</td>");
                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0]["Holiday"] + ")</td>");
                            }
                            else
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0]["Holiday"] + ")</td>");
                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0]["Holiday"] + ")</td>");
                            }

                            int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                            for (int u = 0; u < (11 + dynColumn - docCount); u++)
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                            }
                            if (rowCount == 1)
                            {
                                for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {

                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }
                            else
                            {
                                for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {

                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }
                            sbTbl.Append("</tr>");
                            sbPrintTbl.Append("</tr>");
                        }
                        #endregion Holiday

                        #region Sunday
                        // Sunday
                        else if (tempDate.DayOfWeek.ToString() == "Sunday")
                        {
                            sbTbl.Append("<tr>");
                            sbPrintTbl.Append("<tr>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                            sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                            for (int u = 0; u < (12 + dynColumn - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                }
                                else
                                {
                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                }
                            }

                            if (rowCount == 1)
                            {
                                for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                    }
                                    else
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }
                            }
                            else
                            {
                                for (int u = 0; u < (12 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                    }
                                    else
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }

                            }

                            sbTbl.Append("</tr>");
                            sbPrintTbl.Append("</tr>");
                        }
                        #endregion Sunday

                        // No Report
                        #region No REport
                        else
                        {
                            sbTbl.Append("<tr>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                            sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                            int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                            for (int u = 0; u < (12 + dynColumn - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                }
                                else
                                {
                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                                }
                            }

                            if (rowCount == 1)
                            {
                                for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                    }
                                    else
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }
                            }
                            else
                            {

                                for (int u = 0; u < (12 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                    }
                                    else
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }
                            }
                            sbTbl.Append("</tr>");
                            sbPrintTbl.Append("</tr>");

                        }
                        #endregion No REport
                    }
                    #endregion Date Loop
                    sbTbl.Append("</tbody><tfoot align='left'><tr>");
                    sbPrintTbl.Append("<tr>");
                    //sbTbl.Append("<th colspan='" + dynColumn + "'>Total Expense : " + totalExp.toFixed(2) + "</th>");
                    int totInx = 14 + (4 - docCount) + (dsReport.Tables[2].Rows.Count * 3);
                    int startInx = 14 + (4 - docCount);
                    int subCnt = 0;
                    int skipFrst = 1;
                    int docTotalStrt = startInx - (4 - docCount);
                    int docChemArrCount = 0;

                    #region footer
                    for (int c = 0; c < totInx + 2; c++)
                    {
                        if (c < 7)
                        {
                            sbTbl.Append("<th style='display:none;'></th>");
                            //sbPrintTbl.Append("<th style='display:none;'></th>");
                        }
                        else if (c >= startInx)
                        {



                            if (c == totInx)
                            {
                                sbTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                                sbPrintTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                            }
                            else if (c > totInx) // for remarks
                            {
                                sbTbl.Append("<th align='right'></th>");
                                sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                            }
                            else
                            {
                                if (skipFrst == 3)
                                {
                                    sbTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                    sbPrintTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                    subCnt++;
                                    skipFrst = 0;
                                }
                                else
                                {
                                    sbTbl.Append("<th align='right'></th>");
                                }
                                skipFrst++;
                            }
                        }
                        else
                        {
                            if (c >= docTotalStrt)
                            {
                                sbTbl.Append("<th align='left'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                                sbPrintTbl.Append("<th align='left'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                                docChemArrCount++;
                            }
                            else if (c == (docTotalStrt - 1))
                            {
                                sbTbl.Append("<th align='right'>" + totaldistance.ToString("N2") + "</th>");
                                sbPrintTbl.Append("<th align='right'>" + totaldistance.ToString("N2") + "</th>");
                            }
                            else if (c == (docTotalStrt - 2))
                            {
                                sbTbl.Append("<th align='left'>Total</th>");
                                sbPrintTbl.Append("<th align='left'style='font-size:11px;'><b>Grand Total</b></th>");
                            }
                            else
                            {
                                sbTbl.Append("<th align='right'></th>");
                                sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                            }

                        }

                    }
                    #endregion footer
                    sbTbl.Append("</tr></tfoot></table></div></br>");
                    sbPrintTbl.Append("</tr></tbody></table></div></br>");


                    switch (strReportExpenseGroupPrintFormatConfig)
                    {
                        case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                        case "WITH_SUMMARY":
                            // print for a 2 Column
                            #region Summary Footer for Print for a 2 Column

                            totInx = 14 + (4 - docCount) + (dsReport.Tables[2].Rows.Count * 3);
                            startInx = 14 + (4 - docCount);
                            subCnt = 0;
                            skipFrst = 1;
                            docTotalStrt = startInx - (4 - docCount);
                            docChemArrCount = 0;

                            sbPrintTbl.Append("</br><table cellspacing='0' cellpadding='0' id='tblUserDetailSummary' class='data display dataTable box' width='100%' border='1'>");
                            sbPrintTbl.Append("<thead>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th colspan='2'  style='font-size:22px;' align='center'><b>Summary </b></th>");
                            sbPrintTbl.Append("</tr>");

                            sbPrintTbl.Append("<tr>");
                            sbPrintTbl.Append("<th   style='font-size:20px;' align='left'><b></b></th>");
                            sbPrintTbl.Append("<th   style='font-size:20px;' align='center'><b>Grand Total </b></th>");
                            sbPrintTbl.Append("</tr>");

                            for (int c = 0; c < totInx + 2; c++)
                            {
                                if (c < 7)
                                {
                                    //sbTbl.Append("<th style='display:none;'></th>");
                                    //sbPrintTbl.Append("<th style='display:none;'></th>");
                                }
                                else if (c >= startInx)
                                {
                                    if (c == totInx) // for Total Expense
                                    {
                                        sbPrintTbl.Append("<tr>");
                                        sbPrintTbl.Append("<th   style='font-size:22px;' align='left'><b>Total Expense </b></th>");
                                        sbPrintTbl.Append("<th   style='font-size:22px;' align='right'><b>" + totalExp.ToString("N2") + "</b></th>");
                                        sbPrintTbl.Append("</tr>");
                                    }
                                    else if (c > totInx) // for remarks
                                    {
                                        //sbTbl.Append("<th align='right'></th>");
                                        //sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                                    }
                                    else
                                    {
                                        if (skipFrst == 3)
                                        {
                                            if (dsReport.Tables[2].Rows.Count > 0)
                                            {
                                                sbPrintTbl.Append("<tr>");
                                                sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b> " + dsReport.Tables[2].Rows[subCnt]["Expense_Type_Name"] + " </b></th>");
                                                sbPrintTbl.Append("<th   style='font-size:16px;' align='right'><b>" + subTotArray[subCnt].ToString("N2") + "</b></th>");
                                                sbPrintTbl.Append("</tr>");
                                            }
                                            subCnt++;
                                            skipFrst = 0;
                                        }
                                        else
                                        {
                                            //sbTbl.Append("<th align='right'></th>");
                                        }
                                        skipFrst++;
                                    }
                                }
                                else
                                {
                                    if (c >= docTotalStrt)
                                    {
                                        if (subTotDocChemistArray.Length == 1 && docChemistMet.Contains("D"))
                                        {
                                            sbPrintTbl.Append("<tr>");
                                            sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>Doctor Met </b></th>");
                                            sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>" + subTotDocChemistArray[docChemArrCount].ToString() + " </b></th>");
                                            sbPrintTbl.Append("</tr>");

                                            sbPrintTbl.Append("<tr>");
                                            sbPrintTbl.Append("<th colspan='2'  style='font-size:22px;' align='left;'> </th>");
                                            sbPrintTbl.Append("</tr>");
                                        }
                                        else if (subTotDocChemistArray.Length == 2 && docChemistMet.Contains("C"))
                                        {
                                            switch (docChemArrCount)
                                            {
                                                case 0:
                                                    sbPrintTbl.Append("<tr>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>Chemist Met </b></th>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>" + subTotDocChemistArray[docChemArrCount].ToString() + " </b></th>");
                                                    sbPrintTbl.Append("</tr>");
                                                    break;
                                                case 1:
                                                    sbPrintTbl.Append("<tr>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>Chemist POB </b></th>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>" + subTotDocChemistArray[docChemArrCount].ToString() + " </b></th>");
                                                    sbPrintTbl.Append("</tr>");
                                                    break;
                                            }

                                        }
                                        else if (docChemistMet.Contains("M"))
                                        {
                                            sbPrintTbl.Append("<tr>");
                                            sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>Accompanist Count </b></th>");
                                            sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>" + subTotDocChemistArray[docChemArrCount].ToString() + " </b></th>");
                                            sbPrintTbl.Append("</tr>");
                                        }

                                        docChemArrCount++;
                                    }
                                    else if (c == (docTotalStrt - 1))
                                    {
                                        sbPrintTbl.Append("<tr>");
                                        sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>Distance </b></th>");
                                        sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b>" + totaldistance.ToString("N2") + "</b></th>");
                                        sbPrintTbl.Append("</tr>");
                                    }
                                    else if (c == (docTotalStrt - 2))
                                    {
                                        //sbPrintTbl.Append("<th align='left'style='font-size:11px;'><b>Grand Total</b></th>");
                                    }
                                    else
                                    {
                                        //sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                                    }

                                }

                            }


                            sbPrintTbl.Append("</thead>");
                            sbPrintTbl.Append("</table></br>");
                            #endregion
                            break;
                    }





                    sbTableContentExcel.Append(sbTbl.ToString());
                    if (reportName == "CURRENTUSER")
                    {
                        sbTbl.Append("<div style='float: left;width: 100%;margin-top: 30px;font-size: 14px;margin-bottom: 20px;'><a class='td-a' onclick='fnComprehensiveAnalysisReportopen(\"" + userCodecom + "\");'>Show Comprehensive Analysis Report</a></div>");
                    }

                    switch (strReportExpenseGroupPrintFormatConfig)
                    {
                        case "NO":
                            // for Excel and print 
                            #region Excel and print
                            sbFooter.Append("<br />");
                            sbFooter.Append("<table border='1' cellspacing='0' cellpadding='0' style='float:right;'>");
                            sbFooter.Append("<tr style='height:50px;'>");
                            sbFooter.Append("<td style='width:300px;'>Signature:</td><td style='width:300px;'>Signature:</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("<tr>");
                            sbFooter.Append("<td style='width:300px;'>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</b></td><td style='width:300px;'>Reporting Manager Employee Name : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("<tr>");
                            sbFooter.Append("<td style='width:300px;'>Employee No : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</td><td style='width:300px;'>Reporting Manager Employee No : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Number"] + "</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("</table>");
                            #endregion
                            break;
                        case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                        case "WITH_SUMMARY":
                        case "WITH_2COLUMN_HEADER":
                            // for Excel and print for a 2 Columns
                            #region Excel and print for a 2 Columns
                            sbFooter.Append("<br />");
                            sbFooter.Append("<table border='1' cellspacing='0' cellpadding='0' style='float:right;'>");
                            sbFooter.Append("<tr style='height:50px;'>");
                            sbFooter.Append("<td style='width:300px;font-size:16px;'>Signature:</td><td style='width:300px;font-size:16px;'>Signature:</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("<tr>");
                            sbFooter.Append("<td style='width:300px;font-size:16px;'>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</b></td><td style='width:300px;font-size:16px;'>Reporting Manager Employee Name : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("<tr>");
                            sbFooter.Append("<td style='width:300px;font-size:16px;'>Employee No : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</td><td style='width:300px;font-size:16px;'>Reporting Manager Employee No : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Number"] + "</td>");
                            sbFooter.Append("</tr>");
                            sbFooter.Append("</table>");
                            #endregion
                            break;
                    }




                    sbTableContentExcel.Append(sbFooter.ToString());
                    sbPrintTbl.Append(sbFooter.ToString());


                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = _objcurrentInfo.GetUserName();
                    string subDomin = _objcurrentInfo.GetSubDomain();
                    string fileName = "ExpenseAnalysisGroupWiseReport_" + "_" + subDomin + "_" + userName + ".xls";

                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");

                    //sbPrintTbl.Append("</tbody></table> <div style='font-weight:bold;text-align:right'>Total Expense : " + totalExp.toFixed(2) + "</div> ");

                }

                return sbTbl.ToString() + "$" + sbPrintTbl.ToString() + "$" + totalExp.ToString() + "$" + Convert.ToString(dsReport.Tables[2].Rows.Count) + "$" + docCount + "$" + blobUrl + "$" + totaldistance.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("startDate", collection["startDate"].ToString());
                dicObj.Add("endDate", collection["endDate"].ToString());
                dicObj.Add("dcrStatus", collection["dcrStatus"].ToString());
                dicObj.Add("activityStatus", collection["activityStatus"].ToString());
                dicObj.Add("docChemistMet", collection["docChemistMet"].ToString());
                dicObj.Add("rowCount", collection["rowCount"].ToString());

                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }

        //

        // Expense claim Alumni Report-Start --------------------------------------------------
        public string GetExpenseClaimAlumniReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, claimStatus = string.Empty, userCodes = string.Empty, claimStatusName = string.Empty;

                StringBuilder sbTableContent = new StringBuilder();
                string blobUrl = string.Empty;
                int expTypeCount = 0;
                string reportGenaratedtime = string.Empty;
                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                claimStatus = collection["claimStatus"].ToString();
                claimStatus = claimStatus.TrimEnd(',');
                userCodes = collection["userCodes"].ToString();
                reportGenaratedtime = DateTime.Now.ToString();
                claimStatusName = collection["claimStatusName"].ToString();
                claimStatusName = claimStatusName.TrimEnd(',');

                dsReport = _objBL.GetExpenseClaimAlumniReport(_objcurrentInfo.GetCompanyCode(), userCodes, from, to, claimStatus);

                #region Report
                if (dsReport.Tables.Count > 0 && dsReport.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<div style='font-weight: bold;'><span>Selected Claim Status are  " + claimStatusName + "</span></div>");
                    sbTableContent.Append("<div style='font-weight: bold;'><span>Expense Claim Alumni  Genarated on " + reportGenaratedtime + "</span></div>");
                    sbTableContent.Append("<div ><span style='font-weight: bold;font-size: initial;'>" + dsReport.Tables[0].Rows[0]["User_Name"] + " Date of Joining is " + dsReport.Tables[0].Rows[0]["Date_of_Joining"] + " Resignation Date is " + dsReport.Tables[0].Rows[0]["Resignation_Date"] + "</span></div>");
                    sbTableContent.Append("<div ><table cellspacing='0' cellpadding='0' id='tblExpenseClaim' class='data display dataTable box' width='100%'>");
                    sbTableContent.Append("<thead>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th>Print</th>");
                    sbTableContent.Append("<th>User Id</th>");
                    sbTableContent.Append("<th>Employee Name</th>");
                    sbTableContent.Append("<th>Employee No</th>");
                    sbTableContent.Append("<th>Region Name</th>");
                    sbTableContent.Append("<th>Designation</th>");
                    sbTableContent.Append("<th>Division</th>");
                    //  sbTableContent.Append("<th >Resignation Date</th>");
                    sbTableContent.Append("<th >PF No</th>");
                    sbTableContent.Append("<th >Bank Account No</th>");
                    sbTableContent.Append("<th >PAN</th>");
                    sbTableContent.Append("<th >Employee Mobile Number</th>");
                    //sbTableContent.Append("<th >Level 1 Manager</th>");
                    //sbTableContent.Append("<th >Level 1 Manager Designation</th>");
                    //sbTableContent.Append("<th >Level 2 Manager</th>");
                    //sbTableContent.Append("<th >Level 2 Manager Designation</th>");
                    //sbTableContent.Append("<th>Division</th>");
                    sbTableContent.Append("<th>Claim Request No</th>");
                    sbTableContent.Append("<th>Claim Submitted By</th>");
                    sbTableContent.Append("<th>DCR Submitted Period From</th>");
                    sbTableContent.Append("<th>DCR Submitted Period To</th>");
                    sbTableContent.Append("<th>Claim Request Submitted Date</th>");
                    sbTableContent.Append("<th>Status</th>");
                    sbTableContent.Append("<th>Modified Date</th>");
                    sbTableContent.Append("<th>Modified By</th>");
                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Actual</th>");
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Approved</th>");
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Deduction</th>");
                        }
                    }
                    sbTableContent.Append("<th>Total Claim Amount</th>");
                    sbTableContent.Append("<th>Total Approved Amount</th>");
                    sbTableContent.Append("<th>Total Deduction Amount</th>");
                    sbTableContent.Append("<th class='expRem'>User Remarks</th>");
                    sbTableContent.Append("<th class='expRem'>Approver Remarks</th>");
                    sbTableContent.Append("<th>Download</th>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead><tbody>");

                    for (var x = 0; x < dsReport.Tables[0].Rows.Count; x++)
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpensePrint(\"" + dsReport.Tables[0].Rows[x]["User_Code"].ToString() + "\",\"" + dsReport.Tables[0].Rows[x]["Claim_Code"].ToString() + "\",\"" + dsReport.Tables[0].Rows[x]["Date_From"].ToString() + "\",\"" + dsReport.Tables[0].Rows[x]["Date_To"].ToString() + "\",\"" + dsReport.Tables[0].Rows[x]["Status_Name"].ToString() + "\");'>Print</a></div></td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["User_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Employee_Name"] + "</td>");
                        sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Employee_Number"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Region_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Designation"] + "</td>");
                        // Division
                        DataRow[] expDiv = dsReport.Tables[1].Select("User_Code='" + dsReport.Tables[0].Rows[x]["User_Code"].ToString() + "'");
                        if (expDiv.Length > 0)
                        {
                            sbTableContent.Append("<td>" + expDiv[0]["Division_Name"].ToString() + "</td>");
                        }
                        else { sbTableContent.Append("<td></td>"); }
                        // sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Resignation_Date"] + "</td>");
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["PF_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["PF_Number"].ToString()) + "</td>");
                        sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Acc_No"] + "</td>");
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["PAN_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["PAN_Number"].ToString()) + "</td>");
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["Mobile"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["Mobile"].ToString()) + "</td>");
                        //sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Manager1_Name"] + "</td>");
                        //sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Manager1_Designation"] + "</td>");
                        //sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Manager2_Name"] + "</td>");
                        //sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Manager2_Designation"] + "</td>");





                        sbTableContent.Append("<td class='td-a' onclick='fnShowClaimDetails(\"" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "_" + dsReport.Tables[0].Rows[x]["User_Code"] + "\")'>" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Created_BY"] + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Date_From"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Date_From"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Date_To"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Date_To"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Entered_DateTime"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Entered_DateTime"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Status_Name"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Status_Name"]) + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Updated_Date"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Updated_By"] + "</td>");
                        //// Modifed date modified by
                        //DataRow[] modifiedJson = dsReport.Tables[4].Select("Claim_Code='" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "'");
                        //if (modifiedJson.Length > 0)
                        //{
                        //    sbTableContent.Append("<td>" + ((modifiedJson[0]["Updated_DateTime"] == System.DBNull.Value) ? "" : modifiedJson[0]["Updated_DateTime"]) + "</td>");
                        //    sbTableContent.Append("<td>" + ((modifiedJson[0]["Updated_By"] == System.DBNull.Value) ? "" : modifiedJson[0]["Updated_By"]) + "</td>");
                        //}
                        //else
                        //{
                        //    sbTableContent.Append("<td>N/A</td>");
                        //    sbTableContent.Append("<td>N/A</td>");
                        //}

                        if (dsReport.Tables[3].Rows.Count > 0)
                        {
                            for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                            {
                                DataRow[] expClaim = dsReport.Tables[2].Select("Claim_Code='" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "' AND Expense_Type_Code ='" + dsReport.Tables[3].Rows[u]["Expense_Type_Code"] + "'");
                                if (expClaim.Length > 0)
                                {
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Claim_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Claim_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Approved_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Approved_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Deduction_Amount"]).ToString("N2")) + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                }
                            }
                        }
                        if (dsReport.Tables[3].Rows.Count>0)
                        {
                                DataRow[] expClaimTotal = dsReport.Tables[4].Select("Claim_Code='" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "'");
                                if (expClaimTotal.Length > 0)
                                {
                                    sbTableContent.Append("<td align='right'>" + ((expClaimTotal[0]["Total_Claim_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaimTotal[0]["Total_Claim_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaimTotal[0]["Total_Approved_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaimTotal[0]["Total_Approved_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaimTotal[0]["Total_Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaimTotal[0]["Total_Deduction_Amount"]).ToString("N2")) + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                }
                        }
                        sbTableContent.Append("<td class='expRem'  title='" + ((dsReport.Tables[0].Rows[x]["Remarks_By_User"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_User"]) + "'>" + ((dsReport.Tables[0].Rows[x]["Remarks_By_User"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_User"]) + "</td>");

                        sbTableContent.Append("<td class='expRem'  title='" + ((dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_Admin"]) + "'>" + ((dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_Admin"]) + "</td>");

                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["ImgPath"] == System.DBNull.Value) ? "" : "<div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpenseDownloadImage(\"" + dsReport.Tables[0].Rows[x]["ImgPath"] + "\");'>Download</div>") + "</td>");

                        sbTableContent.Append("</tr>");
                    }

                    sbTableContent.Append("</tbody><tfoot>");
                    for (var h = 0; h <= 18; h++)
                    {
                        if (h == 18)
                        {
                            sbTableContent.Append("<th style='text-align:right;'>Total</th>");
                        }
                        else
                        {
                            sbTableContent.Append("<th ></th>");
                        }
                    }

                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Claim_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Claim_Amount"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Approved_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Approved_Amount"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Deduction_Amount"]).ToString("N2")) + "</th>");
                        }
                    }
                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[5].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[5].Rows[u]["Claim_Amount_Summary"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[5].Rows[u]["Claim_Amount_Summary"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[5].Rows[u]["Approved_Amount_Summary"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[5].Rows[u]["Approved_Amount_Summary"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[5].Rows[u]["Deduction_Amount_Summary"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[5].Rows[u]["Deduction_Amount_Summary"]).ToString("N2")) + "</th>");
                        }
                    }
                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("</tfoot></table>");

                    StringBuilder sbTableContentExcel = new StringBuilder();

                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Expense Claim Request for the period " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " to " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "</div>");
                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Selected Claim Status are  " + claimStatusName + "</div>");

                    sbTableContentExcel.Append(sbTableContent.Replace("Show Filter", ""));

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = _objcurrentInfo.GetUserName();
                    string subDomine = _objcurrentInfo.GetSubDomain();
                    string fileName = "EXPENSECLAIMALUMNI_" + "_" + subDomine + "_" + userName + ".xls";


                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");
                    expTypeCount = dsReport.Tables[3].Rows.Count;
                }
                else
                {
                    sbTableContent.Append("<div style='width:100%;font-weight:bold;float:left' align='left'>No Records Found.</div>");
                }
                #endregion Report

                return sbTableContent.ToString() + "$" + blobUrl + "$" + expTypeCount;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("startDate", collection["startDate"].ToString());
                dicObj.Add("endDate", collection["endDate"].ToString());
                dicObj.Add("claimStatus", collection["claimStatus"].ToString());
                dicObj.Add("userCodes", collection["userCodes"].ToString());

                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }
        // Expense claim Alumni Report-End --------------------------------------------------

        // Expense Claim Deduction Report -Strat ------------------------------------------------       
        public string GetExpenseClaimDeductionReport(FormCollection collection)
        {
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel> lstExpDecudtionRep = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel>();

                BLUser _objUser = new BLUser();
                BLExpense _objExp = new BLExpense();
                string from = string.Empty, to = string.Empty, claimStatus = string.Empty, userCode = string.Empty, claimStatusName = string.Empty;

                StringBuilder sbTbl = new StringBuilder();
                string blobUrl = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                claimStatus = collection["claimStatus"].ToString();
                claimStatus = claimStatus.TrimEnd(',');
                userCode = collection["userCodes"].ToString();
                claimStatusName = collection["claimStatusName"].ToString();
                string reportGenaratedtime = string.Empty;
                reportGenaratedtime = DateTime.Now.ToString();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)(_objUser.GetSingleUserInfo(_objcurrentInfo.GetCompanyCode(), userCode, "")).ToList();
                lstExpDecudtionRep = _objExp.GetExpenseClaimDeductionReport(_objcurrentInfo.GetCompanyCode(), userCode, from, to, claimStatus);

                #region Report
                if (lstUser != null && lstUser.Count > 0)
                {
                    if (lstExpDecudtionRep != null && lstExpDecudtionRep.Count > 0 && lstExpDecudtionRep[0].lstClaimDetails != null && lstExpDecudtionRep[0].lstClaimDetails.Count > 0)
                    {
                        //report header
                        sbTbl.Append("<div style='font-weight:bold;margin-left:2%'><span>Expense Claim Request Genarated on " + reportGenaratedtime + "</span></div>");
                        sbTbl.Append("<div class='col-lg-12' style='font-size:14px;font-weight:bold;' align='left'>Expense Claim Deducion for the period of " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " - " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + " (Considered " + claimStatusName + " Claim)</div>");
                        sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeductionUser' cellspacing='0' cellpadding='0'>");
                        sbTbl.Append("<tbody>");

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td><b>Company Name : </b>" + lstUser[0].Company_Name + "</td>");
                        sbTbl.Append("<td><b>User Name : </b>" + lstUser[0].User_Name + "</td>");
                        sbTbl.Append("<td><b>Designation : </b>" + lstUser[0].User_Type_Name + "</td>");
                        sbTbl.Append("<td rowspan='4'><div style='float:left;width:100%'><div style='width: 30%;'><img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'></div></div></td>");
                        sbTbl.Append("</tr>");

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td><b>Employee Name : </b>" + lstUser[0].Employee_Name + "</td>");
                        sbTbl.Append("<td><b>Employee Number : </b>" + lstUser[0].Employee_Number + "</td>");
                        sbTbl.Append("<td><b>Division : </b>" + lstUser[0].Division_Name + "</td>");
                        sbTbl.Append("</tr>");

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td><b>Territory Name : </b>" + lstUser[0].Region_Name + "</td>");
                        sbTbl.Append("<td><b>Reporting Manager : </b>" + lstUser[0].Reporting_Manager_Name + "</td>");
                        sbTbl.Append("<td><b>Reporting HQ : </b>" + lstUser[0].Reporting_Manager_Region_Name + "</td>");
                        sbTbl.Append("</tr>");

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td><b>Account Number : </b>" + lstUser[0].Acc_No + "</td>");
                        sbTbl.Append("<td><b>Date Of Joining : </b>" + lstUser[0].User_Date_of_joining + "</td>");
                        sbTbl.Append("<td><b>Phone Number : </b>" + lstUser[0].User_Mobile_Number + "</td>");
                        sbTbl.Append("</tr>");

                        sbTbl.Append("</tbody></table></div>");

                        //report
                        // get distinct expense type name
                        var lstDistExpenseType = lstExpDecudtionRep[0].lstClaimDetails.Select(x => new { x.Expense_Type_Code, x.Expense_Type_Name }).Distinct().ToList();
                        string rowSpn = string.Empty;
                        if (lstDistExpenseType != null && lstDistExpenseType.Count > 0)
                        {
                            rowSpn = "rowspan='2'";
                        }
                        sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeduction' cellspacing='0' cellpadding='0'>");
                        sbTbl.Append("<thead><tr>");
                        sbTbl.Append("<th " + rowSpn + ">Claim Request No</th>");
                        sbTbl.Append("<th " + rowSpn + ">Claim Submitted By</th>");
                        sbTbl.Append("<th " + rowSpn + ">Request Submitted Date</th>");
                        sbTbl.Append("<th " + rowSpn + ">Claim Status</th>");
                        sbTbl.Append("<th " + rowSpn + ">DCR Date</th>");
                        sbTbl.Append("<th " + rowSpn + ">Activity Name</th>");
                        sbTbl.Append("<th " + rowSpn + ">Category</th>");
                        sbTbl.Append("<th " + rowSpn + ">Work Place</th>");
                        sbTbl.Append("<th " + rowSpn + ">From-To(Distance,Mode)</th>");
                        if (lstDistExpenseType != null && lstDistExpenseType.Count > 0)
                        {
                            foreach (var expType in lstDistExpenseType)
                            {
                                sbTbl.Append("<th colspan='3'>" + expType.Expense_Type_Name + "</th>");
                            }
                        }
                        sbTbl.Append("<th " + rowSpn + ">Total Approved Expense</th>");
                        // sbTbl.Append("<th " + rowSpn + ">User Remarks</th>");
                        sbTbl.Append("</tr>");

                        if (lstDistExpenseType != null && lstDistExpenseType.Count > 0)
                        {
                            sbTbl.Append("<tr>");
                            foreach (var expType in lstDistExpenseType)
                            {
                                sbTbl.Append("<th>" + expType.Expense_Type_Name + " Actual</th>");
                                sbTbl.Append("<th>" + expType.Expense_Type_Name + " Deduction</th>");
                                sbTbl.Append("<th>" + expType.Expense_Type_Name + " Approved</th>");
                            }
                            sbTbl.Append("</tr>");
                        }

                        sbTbl.Append("</thead>");

                        sbTbl.Append("<tbody>");

                        // get distinct dcr date and flag
                        var lstDistDate = lstExpDecudtionRep[0].lstClaimDetails.Select(x => new { x.Claim_Code, x.DCR_Actual_Date, x.DCR_Activity_Flag }).Distinct().ToList();
                        foreach (var exp in lstDistDate)
                        {
                            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstDetails = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>();
                            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstAmount = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>();

                            lstDetails = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtionRep[0].lstClaimDetails.Where(a => a.Claim_Code == exp.Claim_Code && a.DCR_Actual_Date == exp.DCR_Actual_Date && a.DCR_Activity_Flag == exp.DCR_Activity_Flag)).ToList();

                            sbTbl.Append("<tr>");
                            sbTbl.Append("<td class='td-a' onclick='fnOpenDeductionDetailPopUp(\"" + exp.Claim_Code + "\",\"" + userCode + "\");'>" + exp.Claim_Code + "</td>");
                            sbTbl.Append("<td>" + lstDetails[0].Submitted_BY + "</td>");
                            sbTbl.Append("<td>" + lstDetails[0].Entered_DateTime + "</td>");
                            sbTbl.Append("<td>" + lstDetails[0].Status_Name + "</td>");
                            sbTbl.Append("<td>" + exp.DCR_Actual_Date + "</td>");
                            sbTbl.Append("<td>" + ((exp.DCR_Activity_Flag == 'A') ? "Attendance" : "Field") + "</td>");
                            sbTbl.Append("<td>" + lstDetails[0].Category + "</td>");
                            sbTbl.Append("<td>" + lstDetails[0].Work_Place + "</td>");

                            var sfc = lstExpDecudtionRep[0].lstDCRHOP.Where(d => d.DCR_Actual_Date == exp.DCR_Actual_Date && d.DCR_Activity_Flag == exp.DCR_Activity_Flag);
                            if (sfc != null && sfc.Count() > 0)
                            {
                                sbTbl.Append("<td>");
                                foreach (var s in sfc)
                                {
                                    sbTbl.Append(s.From_Place + "-" + s.To_Place + "(" + s.Distance + "," + s.Travel_Mode + ")</br>");
                                }
                                sbTbl.Append("</td>");
                            }
                            else
                            {
                                sbTbl.Append("<td>" + lstDetails[0].From_Place + "-" + lstDetails[0].To_Place + "(" + lstDetails[0].Distance + "," + lstDetails[0].Travel_Mode + ")</td>");
                            }

                            double totExp = 0.0;
                            if (lstDistExpenseType != null && lstDistExpenseType.Count > 0)
                            {
                                foreach (var expType in lstDistExpenseType)
                                {
                                    lstAmount = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstDetails.Where(e => e.Expense_Type_Code == expType.Expense_Type_Code)).ToList();
                                    if (lstAmount != null && lstAmount.Count > 0)
                                    {
                                        sbTbl.Append("<td>" + lstAmount[0].Expense_Amount + "</td>");
                                        sbTbl.Append("<td>" + lstAmount[0].Deduction_Amount + "</td>");
                                        sbTbl.Append("<td>" + lstAmount[0].Approved_Amount + "</td>");
                                        totExp += lstAmount[0].Approved_Amount;
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                    }
                                }
                            }
                            sbTbl.Append("<td>" + totExp.ToString("N2") + "</td>");
                            //   sbTbl.Append("<td>" + lstDetails[0].Remarks_By_User + "</td>");
                            sbTbl.Append("</tr>");
                        }
                        sbTbl.Append("</tbody>");
                        sbTbl.Append("</table></div>");
                    }
                    else
                    {
                        sbTbl.Append("<div class='col-lg-12'>No Expense Claim Details Found for this input selection.</div>");
                    }
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No User details found.</div>");
                }
                #endregion Report

                return sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("startDate", collection["startDate"].ToString());
                dicObj.Add("endDate", collection["endDate"].ToString());
                dicObj.Add("claimStatus", collection["claimStatus"].ToString());
                dicObj.Add("userCodes", collection["userCodes"].ToString());
                dicObj.Add("claimStatusName", collection["claimStatusName"].ToString());

                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }

        //public string GetExpenseClaimDeductionDetailPopUp(string claimCode, string userCode)
        //{
        //    try
        //    {
        //        List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
        //        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup> lstExpDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup>();
        //        BLUser _objUser = new BLUser();
        //        BLExpense _objExp = new BLExpense();
        //        StringBuilder sbTbl = new StringBuilder();

        //        lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)(_objUser.GetSingleUserInfo(_objcurrentInfo.GetCompanyCode(), userCode, "")).ToList();
        //        lstExpDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup>)(_objExp.GetExpenseClaimDeductionDetailPopUp(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();

        //        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstEmpDecud = lstExpDecudtion[0].lstClaimDetails;
        //        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetailsTravellplaces> lstExpTravell = lstExpDecudtion[0].lstDCRHOP;


        //        #region User Details
        //        if (lstUser != null && lstUser.Count > 0)
        //        {
        //            sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeductionUser' cellspacing='0' cellpadding='0'>");
        //            sbTbl.Append("<tbody>");

        //            sbTbl.Append("<tr>");
        //            sbTbl.Append("<td><b>User Name : </b>" + lstUser[0].User_Name + "</td>");
        //            sbTbl.Append("<td><b>Employee Name : </b>" + lstUser[0].Employee_Name + "</td>");
        //            sbTbl.Append("<td><b>Territory Name : </b>" + lstUser[0].Region_Name + "</td>");
        //            sbTbl.Append("</tr>");

        //            sbTbl.Append("<tr>");
        //            sbTbl.Append("<td><b>Division : </b>" + lstUser[0].Division_Name + "</td>");
        //            sbTbl.Append("<td><b>Employee Number : </b>" + lstUser[0].Employee_Number + "</td>");
        //            sbTbl.Append("<td><b>Reporting Manager : </b>" + lstUser[0].Reporting_Manager_Name + "</td>");
        //            sbTbl.Append("</tr>");

        //            sbTbl.Append("<tr>");
        //            sbTbl.Append("<td><b>PAN : </b>" + lstUser[0].PAN_Number + "</td>");
        //            sbTbl.Append("<td><b>PF No : </b>" + lstUser[0].PF_Number + "</td>");
        //            sbTbl.Append("<td><b>Account Number : </b>" + lstUser[0].Acc_No + "</td>");
        //            sbTbl.Append("</tr>");

        //            sbTbl.Append("<tr>");
        //            sbTbl.Append("<td><b>Phone Number : </b>" + lstUser[0].User_Mobile_Number + "</td>");
        //            sbTbl.Append("<td><b>Claim Code : </b>" + claimCode + "</td>");
        //            sbTbl.Append("<td></td>");
        //            sbTbl.Append("</tr>");

        //            sbTbl.Append("</tbody></table></div>");
        //        }
        //        else
        //        {
        //            sbTbl.Append("<div class='col-lg-12'>No User Details found</div>");
        //        }
        //        #endregion User Details

        //        #region Report
        //        if (lstExpDecudtion != null && lstExpDecudtion.Count > 0)
        //        {
        //            int maxVersionNumber = lstEmpDecud.Select(x => x.Version_Number).Max();

        //            string rowSpn = string.Empty;
        //            sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeduction' cellspacing='0' cellpadding='0'>");
        //            sbTbl.Append("<thead><tr>");
        //            sbTbl.Append("<th>DCR Date</th>");
        //            sbTbl.Append("<th>Work Category</th>");
        //            sbTbl.Append("<th>Activity</th>");
        //            sbTbl.Append("<th>Num. of Doctors Visited</th>");
        //            sbTbl.Append("<th style='width: 20%;text-align: center;'>SFC Detail</th>");
        //            sbTbl.Append("<th>Status</th>");
        //            sbTbl.Append("<th>Expense Type</th>");
        //            sbTbl.Append("<th>Claim Amount(Rs.)</th>");
        //            sbTbl.Append("<th>Previous Deduction (Rs.)</th>");
        //            sbTbl.Append("<th>Current Deduction(Rs.)</th>");
        //            sbTbl.Append("<th>Approved Amount (Rs.)</th>");
        //            sbTbl.Append("<th>Remarks</th>");
        //            sbTbl.Append("</tr>");
        //            sbTbl.Append("</thead>");
        //            sbTbl.Append("<tbody>");
        //            // get distinct expense type name WITH DATE
        //            var lstDistExpenseType = lstEmpDecud.Select(x => new { x.Expense_Type_Code, x.DCR_Actual_Date, x.DCR_Activity_Flag }).Distinct().ToList();

        //            var lstDCRdate = lstEmpDecud.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();


        //            if (lstEmpDecud[0].From_Place != "" && lstEmpDecud[0].To_Place != "" && lstEmpDecud[0].From_Place != null && lstEmpDecud[0].To_Place != null)
        //            {
        //                foreach (var item in lstDCRdate)
        //                {
        //                    sbTbl.Append("<tr>");

        //                    var DCRlst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstEmpDecud.Where(e => e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
        //                    // var lst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstEmpDecud.Where(e => e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
        //                    sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>" + item.DCR_Actual_Date + "</td>");
        //                    sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>" + DCRlst[0].Category + "</td>");
        //                    sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>" + ((DCRlst[0].DCR_Activity_Flag.ToString() == "A") ? "Attendance" : "Field") + "</td>");
        //                    sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>" + DCRlst[0].Doctor_Visit_Count + "</td>");
        //                    sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>" + DCRlst[0].From_Place + "-" + DCRlst[0].To_Place + "</td>");
        //                    if (DCRlst[0].DCR_Status.ToString() == "2")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>Approved</td>");
        //                    }
        //                    else if (DCRlst[0].DCR_Status.ToString() == "0")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>UnApproved</td>");
        //                    }
        //                    else if (DCRlst[0].DCR_Status.ToString() == "3")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>Drafted</td>");
        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td rowspan=" + DCRlst.Count + " style='vertical-align:middle'>Applied</td>");
        //                    }

        //                    foreach (var dcrlst in DCRlst)
        //                    {
        //                        sbTbl.Append("<td>" + dcrlst.Expense_Type_Name + "</td>");
        //                        sbTbl.Append("<td>" + dcrlst.Expense_Amount + "</td>");
        //                        sbTbl.Append("<td>" + dcrlst.Deduction_Amount + "</td>");
        //                        sbTbl.Append("<td>" + dcrlst.Deduction_Amount + "</td>");
        //                        sbTbl.Append("<td>" + dcrlst.Approved_Amount + "</td>");

        //                        sbTbl.Append("<td>" + dcrlst.Remarks_By_User + "</td>");

        //                        sbTbl.Append("</tr>");
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                StringBuilder sbTblSFC = new StringBuilder();
        //                var lstDCRdateWithHop = lstExpTravell.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();


        //                foreach (var itemWithHop in lstDCRdateWithHop)
        //                {
        //                    sbTbl.Append("<tr>");
        //                    sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>" + itemWithHop.DCR_Actual_Date + "</td>");
        //                    var DCRlst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetailsTravellplaces>)(lstExpTravell.Where(e => e.DCR_Actual_Date == itemWithHop.DCR_Actual_Date)).ToList();

        //                    sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>" + DCRlst[0].Category + "</td>");
        //                    sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>" + ((DCRlst[0].DCR_Activity_Flag.ToString() == "A") ? "Attendance" : "Field") + "</td>");
        //                    sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>" + DCRlst[0].Doctor_Visit_Count + "</td>");
        //                    var hopSfc = lstExpTravell.Select(x => new { x.DCR_Actual_Date, x.From_Place, x.To_Place }).Distinct().ToList();

        //                    foreach (var SFC in hopSfc)
        //                    {
        //                        sbTblSFC.Append("<table>");
        //                        sbTblSFC.Append("<tr>");
        //                        sbTblSFC.Append("<td  rowspan=" + hopSfc.Count + "  style='vertical-align:middle'>" + SFC.From_Place + "-" + SFC.To_Place + "</td>");
        //                        sbTblSFC.Append("</tr>");
        //                        sbTblSFC.Append("</table>");

        //                    }
        //                    sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>");

        //                    sbTbl.Append(sbTblSFC.ToString());

        //                    sbTbl.Append("</td>");

        //                    if (DCRlst[0].DCR_Status.ToString() == "2")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>Approved</td>");
        //                    }
        //                    else if (DCRlst[0].DCR_Status.ToString() == "0")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>UnApproved</td>");
        //                    }
        //                    else if (DCRlst[0].DCR_Status.ToString() == "3")
        //                    {
        //                        sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>Drafted</td>");
        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td rowspan=" + lstDistExpenseType.Count + " style='vertical-align:middle'>Applied</td>");
        //                    }

        //                    foreach (var dcrlst in lstDistExpenseType)
        //                    {
        //                        var lst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetailsTravellplaces>)(lstExpTravell.Where(e => e.Expense_Type_Code == dcrlst.Expense_Type_Code && e.DCR_Actual_Date == dcrlst.DCR_Actual_Date && e.DCR_Activity_Flag == dcrlst.DCR_Activity_Flag)).ToList();

        //                        sbTbl.Append("<td>" + lst[0].Expense_Type_Name + "</td>");
        //                        sbTbl.Append("<td>" + lst[0].Expense_Amount + "</td>");
        //                        sbTbl.Append("<td>" + lst[0].Deduction_Amount + "</td>");
        //                        sbTbl.Append("<td>" + lst[0].Deduction_Amount + "</td>");
        //                        sbTbl.Append("<td>" + lst[0].Approved_Amount + "</td>");

        //                        sbTbl.Append("<td>" + lst[0].Remarks_By_User + "</td>");

        //                        sbTbl.Append("</tr>");
        //                    }
        //                }
        //            }
        //            sbTbl.Append("</tbody>");
        //            sbTbl.Append("</table></div>");
        //        }
        //        else
        //        {
        //            sbTbl.Append("<div class='col-lg-12'>No Expense Claim Deduction Details found</div>");
        //        }
        //        #endregion Report

        //        return sbTbl.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicObj = new Dictionary<string, string>();
        //        dicObj.Add("claimCode", claimCode);
        //        dicObj.Add("userCode", userCode);
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
        //        return "FAIL^" + ex.Message.ToString();
        //    }
        //}
        // Expense Claim Deduction Report -End ------------------------------------------------
        string popupuserCode = string.Empty;
        public string GetExpenseClaimDeductionDetailPopUp(string claimCode, string userCode,string Company_Code)
        {
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExpDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel> lstExpOtherDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>();

                BLUser _objUser = new BLUser();
                BLExpense _objExp = new BLExpense();
                StringBuilder sbTbl = new StringBuilder();

                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)(_objUser.GetSingleUserInfo(Company_Code, userCode, "")).ToList();
                lstExpDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(_objExp.GetExpenseClaimDeductionDetailPopUpOld(Company_Code, claimCode)).ToList();
                lstExpOtherDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>)(_objExp.GetOtherDecductionAmount(Company_Code, claimCode)).ToList();
                #region User Details
                if (lstUser != null && lstUser.Count > 0)
                {
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeductionUser' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<tbody>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>User Name : </b>" + lstUser[0].User_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Name : </b>" + lstUser[0].Employee_Name + "</td>");
                    sbTbl.Append("<td><b>Territory Name : </b>" + lstUser[0].Region_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Division : </b>" + lstUser[0].Division_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Number : </b>" + lstUser[0].Employee_Number + "</td>");
                    sbTbl.Append("<td><b>Reporting Manager : </b>" + lstUser[0].Reporting_Manager_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>PAN : </b>" + lstUser[0].PAN_Number + "</td>");
                    sbTbl.Append("<td><b>PF No : </b>" + lstUser[0].PF_Number + "</td>");
                    sbTbl.Append("<td><b>Account Number : </b>" + lstUser[0].Acc_No + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Phone Number : </b>" + lstUser[0].User_Mobile_Number + "</td>");
                    sbTbl.Append("<td><b>Claim Code : </b>" + claimCode + "</td>");
                    sbTbl.Append("<td><b>OtherDeduction : </b>" + lstExpOtherDecudtion[0].Other_Deduction + "</td>");
                    sbTbl.Append("<td></td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("</tbody></table></div>");
                    popupuserCode = lstExpDecudtion[0].Favouring_User_Code;
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No User Details found</div>");
                }
                #endregion User Details

                #region Report
                if (lstExpDecudtion != null && lstExpDecudtion.Count > 0)
                {
                    int maxVersionNumber = lstExpDecudtion.Select(x => x.Version_Number).Max();

                    string rowSpn = string.Empty;
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeduction' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead><tr>");
                    sbTbl.Append("<th rowspan='2'>DCR Date</th>");
                    sbTbl.Append("<th rowspan='2'>Work Category</th>");
                    sbTbl.Append("<th rowspan='2'>Activity</th>");
                    //sbTbl.Append("<th rowspan='2'>Num. of Doctors Visited</th>");
                    sbTbl.Append("<th rowspan='2'>SFC Details</th>");
                    sbTbl.Append("<th rowspan='2'>Expense Type</th>");
                    sbTbl.Append("<th rowspan='2' style='border-right: 1px solid #fff;'>Claim Amount(Rs.)</th>");
                    sbTbl.Append("<th rowspan='2' style='border-right: 1px solid #fff;'>Expense Mode</th>");
                    int level = 1;
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th colspan='6' style='border-right: 1px solid #fff;'>Action Level" + level + "</th>");
                        level++;
                    }

                    sbTbl.Append("</tr>");


                    sbTbl.Append("<tr>");
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th>Status</th>");
                        sbTbl.Append("<th>Previous Deduction(Rs.)</th>");
                        sbTbl.Append("<th>Current Deduction(Rs.)</th>");
                        sbTbl.Append("<th>Approved Amount (Rs.)</th>");
                        sbTbl.Append("<th>Remarks</th>");
                        sbTbl.Append("<th style='border-right: 1px solid #fff;'>Modified By</th>");
                    }
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody style='background: #BDBDBD'>");
                    // get distinct expense type name WITH DATE
                    var lstDistExpenseType = lstExpDecudtion.Select(x => new { x.Expense_Type_Code, x.DCR_Actual_Date }).Distinct().ToList();
                    var flags = lstExpDecudtion.Select(x => new { x.DCR_Activity_Flag, x.DCR_Actual_Date }).Distinct().ToList();
                    var lstDistDate = lstExpDecudtion.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();
                    int IRow = 0;
                    var lstDistExpeseTypeDate = lstExpDecudtion.Select(x => new { x.DCR_Actual_Date, x.Expense_Type_Code }).Distinct().ToList();
                    BL_ExpenseClaim objClaim = new BL_ExpenseClaim();
                    DataSet ds = new DataSet();
                    foreach (var item in lstDistDate)
                    {
                        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstD = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(e => e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
                        var lstExpeseTypeDate = lstD.Select(x => new { x.Expense_Type_Code }).Distinct().ToList();
                        IRow = lstExpeseTypeDate.Count;
                        foreach (var date in lstDistExpenseType)
                        {
                            if (date.DCR_Actual_Date == item.DCR_Actual_Date)
                            {
                                StringBuilder strContentSFCS = new StringBuilder();
                                StringBuilder SFCCat = new StringBuilder();
                                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(e => e.Expense_Type_Code == date.Expense_Type_Code && e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
                                string dcrDateSFC = item.DCR_Actual_Date.Split('-')[2] + "-" + item.DCR_Actual_Date.Split('-')[1] + "-" + item.DCR_Actual_Date.Split('-')[0];
                                ds = objClaim.GetDCRSFCDetails(Company_Code, popupuserCode, dcrDateSFC, lst[0].DCR_Activity_Flag.ToString());

                                if (ds.Tables.Count > 1)
                                {
                                    //SFC Details
                                    string cate = string.Empty;
                                    if (ds.Tables[1].Rows.Count > 0)
                                    {
                                        string catSet = "";
                                        foreach (DataRow dr in ds.Tables[1].Rows)
                                        {

                                            strContentSFCS.Append("<table>");
                                            strContentSFCS.Append("<tr>");
                                            strContentSFCS.Append("<td>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "</td>");
                                            strContentSFCS.Append("</tr>");
                                            strContentSFCS.Append("</table>");

                                            if (catSet != dr["Flag"].ToString())
                                            {
                                                catSet = dr["Flag"].ToString();
                                                cate += dr["Category"].ToString();
                                            }

                                        }

                                        SFCCat.Append("<table>");
                                        SFCCat.Append("<tr>");
                                        SFCCat.Append("<td>" + cate + "</td>");
                                        SFCCat.Append("</tr>");
                                        SFCCat.Append("</table>");

                                    }
                                    else
                                    {
                                        foreach (DataRow dr in ds.Tables[0].Rows)
                                        {
                                            strContentSFCS.Append("<table>");
                                            strContentSFCS.Append("<tr>");
                                            strContentSFCS.Append("<td>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "</td>");
                                            strContentSFCS.Append("</tr>");
                                            strContentSFCS.Append("</table>");
                                            cate += dr["Category"].ToString();
                                        }
                                        SFCCat.Append("<table>");
                                        SFCCat.Append("<tr>");
                                        SFCCat.Append("<td>" + cate + "</td>");
                                        SFCCat.Append("</tr>");
                                        SFCCat.Append("</table>");
                                    }

                                }


                                //SFC Details
                                sbTbl.Append("<tr>");
                                if (IRow > 0)
                                {
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].DCR_Date + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + SFCCat.ToString() + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>");
                                    string activity = "";
                                    var dayFlags = flags.Where(f => f.DCR_Actual_Date == item.DCR_Actual_Date).ToList();
                                    foreach (var flag in dayFlags)
                                    {
                                        activity += flag.DCR_Activity_Flag.ToString() == "A" ? "Attendance," : "Field,";
                                    }
                                    activity = activity.TrimEnd(',');
                                    sbTbl.Append(activity + "</td>");
                                    // sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].Doctor_Visit_Count + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + strContentSFCS.ToString() + "</td>");
                                    // sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].Status_Name + "</td>");
                                }

                                IRow = 0;
                                sbTbl.Append("<td>" + lst[0].Expense_Type_Name + "</td>");
                              
                                var s1 = lst.GroupBy(g => new { g.Expense_Amount, g.Expense_Type_Name,g.Expense_Mode }).
                                    Select(group => new { group.Key.Expense_Amount,group.Key.Expense_Type_Name,group.Key.Expense_Mode, TotalAmount= group.Sum(a=>a.Expense_Amount)}).ToList();
                                double totalAmount =0;
                                string ExpenseMode = string.Empty;
                                foreach (var s in s1)
                                {
                                    totalAmount += s.Expense_Amount;
                                    ExpenseMode = s.Expense_Mode;
                                }

                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + totalAmount + "</td>");
                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + ExpenseMode + "</td>");
                                int levl = 1;
                                for (int e = maxVersionNumber; e > 0; e--)
                                {
                                    List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstCurVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == levl)).ToList();
                                    List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstPrevVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == (levl - 1))).ToList();
                                    if (lstCurVersion != null && lstCurVersion.Count > 0)
                                    {
                                        double previousDeduction = 0.0;
                                        if (levl > 2 && lstPrevVersion != null && lstPrevVersion.Count > 0)
                                        {
                                            // replace the below code to get the previous ded
                                            //previousDeduction = (lstPrevVersion[0].Expense_Amount - lstPrevVersion[0].Approved_Amount);
                                            if (lstPrevVersion[0].Approved_Amount != 0)
                                            {
                                                previousDeduction = (lstPrevVersion[0].Expense_Amount - lstPrevVersion[0].Approved_Amount);
                                            }
                                            else
                                            {
                                                previousDeduction = 0;
                                            }
                                        }

                                        if (lstPrevVersion != null && lstPrevVersion.Count > 0)
                                        {

                                            sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                            if (lstCurVersion[0].Order_No != 1)
                                            {
                                                sbTbl.Append("<td>" + previousDeduction + "</td>");
                                                sbTbl.Append("<td>" + ((lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount) - previousDeduction).ToString() + "</td>");
                                                sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                            }

                                            if (lstCurVersion[0].Order_No == 1)
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                            }
                                            sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                        }
                                        else
                                        {

                                            if (levl == 1)
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                if (lstCurVersion[0].Order_No == 1)
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                                }
                                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                                sbTbl.Append("<td>" + previousDeduction + "</td>");
                                                sbTbl.Append("<td>" + (lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount).ToString() + "</td>");
                                                sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");

                                                if (lstCurVersion[0].Order_No == 1)
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                                }
                                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                            }
                                        }
                                    }
                                    else
                                    {

                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td style='border-right: 1px solid #fff;'>-</td>");
                                    }
                                    levl++;
                                }
                                sbTbl.Append("</tr>");
                            }

                        }
                    }
                  //  lstExpOtherDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>)(_objExp.GetOtherDecductionAmount(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();
                   // sbTbl.Append("<tr><td style='font-weight:bold;'>OtherDeduction</td><td>" + lstExpOtherDecudtion[0].Other_Deduction + "</td></tr>");
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Expense Claim Deduction Details found</div>");
                }
                #endregion Report

                return sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }

        public string GetExpenseClaimDeductionDetailPopUpNew(string claimCode, string userCode)
        {
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExpDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>();
                BLUser _objUser = new BLUser();
                BLExpense _objExp = new BLExpense();
                StringBuilder sbTbl = new StringBuilder();

                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)(_objUser.GetSingleUserInfo(_objcurrentInfo.GetCompanyCode(), userCode, "")).ToList();
                lstExpDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(_objExp.GetExpenseClaimDeductionDetailPopUpOld(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();

                #region User Details
                if (lstUser != null && lstUser.Count > 0)
                {
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeductionUser' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<tbody>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>User Name : </b>" + lstUser[0].User_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Name : </b>" + lstUser[0].Employee_Name + "</td>");
                    sbTbl.Append("<td><b>Territory Name : </b>" + lstUser[0].Region_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Division : </b>" + lstUser[0].Division_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Number : </b>" + lstUser[0].Employee_Number + "</td>");
                    sbTbl.Append("<td><b>Reporting Manager : </b>" + lstUser[0].Reporting_Manager_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>PAN : </b>" + lstUser[0].PAN_Number + "</td>");
                    sbTbl.Append("<td><b>PF No : </b>" + lstUser[0].PF_Number + "</td>");
                    sbTbl.Append("<td><b>Account Number : </b>" + lstUser[0].Acc_No + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Phone Number : </b>" + lstUser[0].User_Mobile_Number + "</td>");
                    sbTbl.Append("<td><b>Claim Code : </b>" + claimCode + "</td>");
                    sbTbl.Append("<td></td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("</tbody></table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No User Details found</div>");
                }
                #endregion User Details

                #region Report
                if (lstExpDecudtion != null && lstExpDecudtion.Count > 0)
                {
                    int maxVersionNumber = lstExpDecudtion.Select(x => x.Version_Number).Max();

                    string rowSpn = string.Empty;
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeduction' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead><tr>");
                    sbTbl.Append("<th rowspan='2'>DCR Date</th>");
                    sbTbl.Append("<th rowspan='2'>Expense Type</th>");
                    sbTbl.Append("<th rowspan='2'>Activity</th>");
                    sbTbl.Append("<th rowspan='2'>Claimed</th>");
                    sbTbl.Append("<th rowspan='2'>Category</th>");
                    int level = 1;
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th colspan='5'>Action Level" + level + "</th>");
                        level++;
                    }

                    sbTbl.Append("</tr>");


                    sbTbl.Append("<tr>");
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th>Deduction</th>");
                        sbTbl.Append("<th>Approved</th>");
                        sbTbl.Append("<th>Status</th>");
                        sbTbl.Append("<th>Remarks</th>");
                        sbTbl.Append("<th>Modified By</th>");
                    }
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");
                    // get distinct expense type name WITH DATE
                    var lstDistExpenseType = lstExpDecudtion.Select(x => new { x.Expense_Type_Code, x.DCR_Actual_Date, x.DCR_Activity_Flag }).Distinct().ToList();

                    foreach (var date in lstDistExpenseType)
                    {
                        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(e => e.Expense_Type_Code == date.Expense_Type_Code && e.DCR_Actual_Date == date.DCR_Actual_Date && e.DCR_Activity_Flag == date.DCR_Activity_Flag)).ToList();

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + lst[0].DCR_Date + "</td>");
                        sbTbl.Append("<td>" + lst[0].Expense_Type_Name + "</td>");
                        sbTbl.Append("<td>" + ((lst[0].DCR_Activity_Flag.ToString() == "A") ? "Attendance" : "Field") + "</td>");
                        sbTbl.Append("<td>" + lst[0].Expense_Amount + "</td>");
                        sbTbl.Append("<td>" + lst[0].Category + "</td>");
                        int levl = 1;
                        for (int e = maxVersionNumber; e > 0; e--)
                        {
                            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstCurVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == levl)).ToList();
                            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstPrevVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == (levl - 1))).ToList();
                            if (lstCurVersion != null && lstCurVersion.Count > 0)
                            {
                                double previousDeduction = 0.0;
                                if (levl > 2 && lstPrevVersion != null && lstPrevVersion.Count > 0)
                                {
                                    previousDeduction = (lstPrevVersion[0].Expense_Amount - lstPrevVersion[0].Approved_Amount);
                                }

                                if (lstPrevVersion != null && lstPrevVersion.Count > 0)
                                {
                                    sbTbl.Append("<td>" + ((lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount) - previousDeduction).ToString() + "</td>");
                                    sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");
                                    sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                    if (lstCurVersion[0].Order_No == 1)
                                    {
                                        sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                    }
                                    sbTbl.Append("<td>" + lstCurVersion[0].Updated_By + "</td>");
                                }
                                else
                                {
                                    if (levl == 1)
                                    {
                                        sbTbl.Append("<td>0</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                        if (lstCurVersion[0].Order_No == 1)
                                        {
                                            sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                        }
                                        sbTbl.Append("<td>" + lstCurVersion[0].Updated_By + "</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td>" + (lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount).ToString() + "</td>");
                                        sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");
                                        sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                        if (lstCurVersion[0].Order_No == 1)
                                        {
                                            sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                        }
                                        sbTbl.Append("<td>" + lstCurVersion[0].Updated_By + "</td>");
                                    }
                                }
                            }
                            else
                            {
                                sbTbl.Append("<td>-</td>");
                                sbTbl.Append("<td>-</td>");
                                sbTbl.Append("<td>-</td>");
                                sbTbl.Append("<td>-</td>");
                                sbTbl.Append("<td>-</td>");
                            }
                            levl++;
                        }
                        sbTbl.Append("</tr>");
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Expense Claim Deduction Details found</div>");
                }
                #endregion Report

                return sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }
    }
}
