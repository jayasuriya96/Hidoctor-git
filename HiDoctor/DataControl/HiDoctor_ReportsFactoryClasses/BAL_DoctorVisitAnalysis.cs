using DataControl.Abstraction;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using DataControl.Impl;

namespace DataControl
{
    public class BAL_DoctorVisitAnalysis
    {
        private IExcelFactory _objExcelConverter = null;
        DAL_DoctorVisitAnalysis _objDoctorVisit = new DAL_DoctorVisitAnalysis();
        const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        const string BRAND_ANALYSIS_SUMMARY = "BrandAnalysisSummary.xls";
        public string GetDoctorVisitAnalyisData(string comapnyCode, string regionCode, string startDate, string endDate, string selection)
        {

            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetDoctorVisitAnalysis(comapnyCode, regionCode, startDate, endDate, selection);
            return GetDoctorVisitFreAnalysisTable(ds, startDate, endDate, selection);
        }
        public string GetDoctorVisitFreAnalysisTable(DataSet ds, string startDate, string endDate, string selection)
        {

            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableContentSub = new StringBuilder();
            StringBuilder sbMissedDoctor = new StringBuilder();
            StringBuilder sbVisitedDoctor = new StringBuilder();
            StringBuilder sbDoctorMet = new StringBuilder();
            StringBuilder sbDoctorList = new StringBuilder();
            StringBuilder sbType = new StringBuilder();

            string divisionName = "";
            string catString = "";
            int doctorMet = 0;
            int totalDoctor = 0;
            int doctorMissed = 0;
            int categoryWiseVisit = 0;
            int doctorvisit = 0;
            int iRow = 0;
            double avg = 0.0;
            DataRow[] drFilter;

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorVisitsFrequency' >");
                tableContent.Append("<thead><tr style='display: none;' id='tblTr'>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Number</th>");
                tableContent.Append("<th align='left' width='15%'>Designation</th>");
                tableContent.Append("<th align='left' width='15%'>Teritory</th>");
                tableContent.Append("<th align='left' width='15%'>Division</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting HQ</th>");
                tableContent.Append("<th align='left' width='15%'>Total Listed Doctors</th>");
                sbType.Append("[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type:'text' },{ type: 'text' },{ type: 'text' },{ type: 'number-range' }");

                tableContentSub.Append("<tr>");
                tableContentSub.Append("<th align='left' width='15%'>User Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Employee Number</th>");
                tableContentSub.Append("<th align='left' width='15%'>Designation</th>");
                tableContentSub.Append("<th align='left' width='15%'>Teritory</th>");
                tableContentSub.Append("<th align='left' width='15%'>Division</th>");
                tableContentSub.Append("<th align='left' width='15%'>Reporting Manager</th>");
                tableContentSub.Append("<th align='left' width='15%'>Reporting HQ</th>");
                tableContentSub.Append("<th align='left' width='15%'>Total Listed Doctors</th>");
                iRow = 9;
                DataTable dtDoctorCategory = ds.Tables[2];
                foreach (DataRow drs in dtDoctorCategory.Rows)
                {
                    //Category wise doctor list
                    iRow++;
                    catString = string.Empty;
                    catString = drs["Category_Name"].ToString();
                    tableContent.Append("<th align='left' width='15%'>");
                    tableContent.Append(catString);
                    tableContent.Append("  Listed Doctor</th>");

                    tableContentSub.Append("<th align='left' width='15%'>");
                    tableContentSub.Append(catString);
                    tableContentSub.Append("  Listed Doctor</th>");
                    sbType.Append(", { type: 'number-range' }");
                }

                // Total Doctors met
                iRow++;
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append("Total Doctors Met</th>");

                tableContentSub.Append("<th align='left' width='15%'>");
                tableContentSub.Append("Total Doctors Met</th>");
                sbType.Append(", { type: 'number-range' }");

                //category wise Drs Met 
                foreach (DataRow drs in dtDoctorCategory.Rows)
                {
                    iRow++;
                    catString = string.Empty;
                    catString = drs["Category_Name"].ToString();
                    tableContent.Append("<th align='left' width='15%'>");
                    tableContent.Append(catString);
                    tableContent.Append(" Doctor Met</th>");

                    tableContentSub.Append("<th align='left' width='15%'>");
                    tableContentSub.Append(catString);
                    tableContentSub.Append(" Doctor Met</th>");
                    sbType.Append(", { type: 'number-range' }");
                }


                // Total missed doctor
                iRow++;
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append("Total Doctors Missed</th>");

                tableContentSub.Append("<th align='left' width='15%'>");
                tableContentSub.Append("Total Doctors Missed</th>");
                sbType.Append(", { type: 'number-range' }");

                //Category wise missed

                foreach (DataRow drs in dtDoctorCategory.Rows)
                {
                    iRow++;
                    catString = string.Empty;
                    catString = drs["Category_Name"].ToString();
                    tableContent.Append("<th align='left' width='15%'>");
                    tableContent.Append(catString);
                    tableContent.Append(" Doctor Missed</th> ");
                    tableContentSub.Append("<th align='left' width='15%'>");
                    tableContentSub.Append(catString);
                    tableContentSub.Append(" Doctor Missed</th>");
                    sbType.Append(", { type: 'number-range' }");
                }


                //Total Doctors Visited
                iRow++;
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append("Total Doctors Visited</th>");

                tableContentSub.Append("<th align='left' width='15%'>");
                tableContentSub.Append("Total Doctors Visited</th>");
                sbType.Append(", { type: 'number-range' }");

                foreach (DataRow drs in dtDoctorCategory.Rows)
                {
                    iRow++;
                    catString = string.Empty;
                    catString = drs["Category_Name"].ToString();
                    tableContent.Append("<th align='left' width='15%'>");
                    tableContent.Append(catString);
                    tableContent.Append(" Doctor Visited</th>");
                    tableContentSub.Append("<th align='left' width='15%'>");
                    tableContentSub.Append(catString);
                    tableContentSub.Append(" Doctor Visited</th>");
                    sbType.Append(", { type: 'number-range' }");
                }


                iRow++;
                //No of Days Worked
                tableContent.Append("<th align='left' width='15%'>No of Days Worked</th>");
                tableContentSub.Append("<th align='left' width='15%'>No of Days Worked</th>");
                sbType.Append(", { type: 'number-range' }");


                //Total Visits %
                iRow++;
                sbType.Append(", { type: 'number-range' }");
                tableContent.Append("<th align='left' width='15%'>Call Average</th>");
                tableContentSub.Append("<th align='left' width='15%'>Call Average</th>");
                for (int i = 0; i < ds.Tables[3].Rows.Count; i++)
                {
                    iRow++;
                    catString = string.Empty;
                    catString = ds.Tables[3].Rows[i]["Expense_Entity_Name"].ToString();

                    tableContent.Append("<th align='left' width='15%'>No. of days - ");
                    tableContent.Append(catString);
                    tableContent.Append("</th>");
                    tableContentSub.Append("<th align='left' width='15%'>No. of days - ");
                    tableContentSub.Append(catString);
                    tableContentSub.Append("</th>");
                    sbType.Append(", { type: 'number-range' }");
                }

                ///Total Expenses 
                iRow++;
                sbType.Append(", { type: 'number-range' }]");
                tableContent.Append("<th align='left' width='15%'>Total Expenses </th>");
                tableContentSub.Append("<th align='left' width='15%'>Total Expenses </th>");

                tableContent.Append("</tr>");
                tableContentSub.Append("</tr>");
                tableContent.Append(tableContentSub);

                tableContent.Append("<tr >");
                tableContent.Append("<th colspan= '" + iRow + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");
                DataTable dtuserDetails = ds.Tables[0];
                foreach (DataRow drs in dtuserDetails.Rows)
                {

                    totalDoctor = 0;
                    doctorMet = 0;
                    doctorvisit = 0;
                    doctorMissed = 0;
                    sbDoctorList = new StringBuilder();
                    sbDoctorMet = new StringBuilder();
                    sbMissedDoctor = new StringBuilder();
                    sbVisitedDoctor = new StringBuilder();
                    // user information
                    tableContent.Append("<tr><td align='left' width='15%'>");
                    tableContent.Append(drs["User_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Employee_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Employee_Number"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["User_Type_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Region_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    divisionName = "";
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        drFilter = ds.Tables[1].Select("Region_Code='" + drs["Region_Code"].ToString() + "'");

                        divisionName = "";
                        if (drFilter.Length > 0)
                        {
                            for (int j = 0; j < drFilter.Length; j++)
                            {
                                divisionName += drFilter[j]["Division_Name"].ToString() + ",";
                            }
                        }
                        if (divisionName != "")
                        {
                            divisionName = divisionName.TrimEnd(',');
                        }
                    }

                    tableContent.Append(divisionName);
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(drs["Manager_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(drs["Manager_Region_Name"].ToString());
                    tableContent.Append("</td>");

                    // Category wise doctor list
                    foreach (DataRow dr in dtDoctorCategory.Rows)
                    {
                        drFilter = ds.Tables[4].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString() && c["Category"].ToString() == dr["Category_Code"].ToString()).ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter[0]["Count"] != null)
                            {
                                totalDoctor = totalDoctor + (Convert.ToInt32(drFilter[0]["Count"].ToString()));

                                sbDoctorList.Append("<td align='center' width='15%'>");
                                sbDoctorList.Append(Convert.ToInt32(drFilter[0]["Count"].ToString()));
                                sbDoctorList.Append("</td>");
                            }
                            else
                            {
                                sbDoctorList.Append("<td align='center' width='15%'>0");
                                sbDoctorList.Append("</td>");
                            }
                        }
                        else
                        {

                            sbDoctorList.Append("<td align='center' width='15%'>0");
                            sbDoctorList.Append("</td>");
                        }

                        // DOCTOR MET

                        drFilter = ds.Tables[5].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString() && c["Category"].ToString() == dr["Category_Code"].ToString()).ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter.Length > 0)
                            {
                                doctorMet = doctorMet + drFilter.Length;
                                sbDoctorMet.Append("<td align='center' width='15%'>");
                                sbDoctorMet.Append(Convert.ToInt32(drFilter.Length));
                                sbDoctorMet.Append("</td>");
                            }
                            else
                            {
                                sbDoctorMet.Append("<td align='center' width='15%'>0");
                                sbDoctorMet.Append("</td>");
                            }
                        }
                        else
                        {
                            sbDoctorMet.Append("<td align='center' width='15%'>0");
                            sbDoctorMet.Append("</td>");
                        }


                        // DOCTOR Missed

                        drFilter = ds.Tables[8].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString() && c["Category"].ToString() == dr["Category_Code"].ToString()).ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter[0]["Count"] != null)
                            {
                                doctorMissed = doctorMissed + Convert.ToInt32(drFilter[0]["Count"].ToString());
                                sbMissedDoctor.Append("<td align='center' width='15%'>");
                                sbMissedDoctor.Append(Convert.ToInt32(drFilter[0]["Count"].ToString()));
                                sbMissedDoctor.Append("</td>");
                            }
                            else
                            {
                                sbMissedDoctor.Append("<td align='center' width='15%'>0");
                                sbMissedDoctor.Append("</td>");
                            }
                        }
                        else
                        {
                            sbMissedDoctor.Append("<td align='center' width='15%'>0");
                            sbMissedDoctor.Append("</td>");
                        }


                        categoryWiseVisit = 0;
                        drFilter = ds.Tables[5].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString() && c["Category"].ToString() == dr["Category_Code"].ToString()).ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter.Length > 0)
                            {
                                foreach (DataRow drSub in drFilter)
                                {
                                    if (drSub["Count"] != null)
                                    {
                                        categoryWiseVisit += Convert.ToInt32(drSub["Count"].ToString());
                                        doctorvisit += Convert.ToInt32(drSub["Count"].ToString());

                                    }
                                }

                            }
                        }

                        sbVisitedDoctor.Append("<td align='center' width='15%'>");
                        sbVisitedDoctor.Append(categoryWiseVisit);
                        sbVisitedDoctor.Append("</td>");
                    }

                    // listed doctor
                    tableContent.Append("<td align='center' width='15%'>");
                    tableContent.Append(totalDoctor);
                    tableContent.Append("</td>");

                    tableContent.Append(sbDoctorList);

                    // doctor Met
                    tableContent.Append("<td align='center' width='15%'>");
                    tableContent.Append(doctorMet);
                    tableContent.Append("</td>");
                    tableContent.Append(sbDoctorMet);

                    // Doctor Missed
                    tableContent.Append("<td align='center' width='15%'>");
                    tableContent.Append(doctorMissed);
                    tableContent.Append("</td>");
                    tableContent.Append(sbMissedDoctor);


                    // Doctor Missed
                    tableContent.Append("<td align='center' width='15%'>");
                    tableContent.Append(doctorvisit);
                    tableContent.Append("</td>");
                    tableContent.Append(sbVisitedDoctor);

                    drFilter = ds.Tables[6].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        tableContent.Append("<td align='center' width='15%'>");
                        tableContent.Append(drFilter.Length);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' width='15%'>0");
                        tableContent.Append("</td>");
                    }
                    if (doctorvisit > 0 && drFilter.Length > 0)
                    {
                        avg = Convert.ToDouble(doctorvisit) / Convert.ToDouble(drFilter.Length);
                        tableContent.Append("<td align='center' width='15%'>");
                        tableContent.Append(avg.ToString("N2"));
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' width='15%'>0");
                        tableContent.Append("</td>");
                    }

                    // Category wise count
                    foreach (DataRow drsub in ds.Tables[3].Rows)
                    {
                        drFilter = ds.Tables[6].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString() && c["Category"].ToString() == drsub["Expense_Entity_Name"].ToString()).ToArray();
                        if (drFilter.Length > 0)
                        {
                            tableContent.Append("<td align='center' width='15%'>");
                            tableContent.Append(drFilter.Length.ToString());
                            tableContent.Append("</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' width='15%'>0");
                            tableContent.Append("</td>");
                        }
                    }

                    // Expense details

                    drFilter = ds.Tables[7].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Amount"].ToString() != null)
                        {
                            tableContent.Append("<td align='center' width='15%'>");
                            tableContent.Append(drFilter[0]["Amount"].ToString());
                            tableContent.Append("</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' width='15%'>0");
                            tableContent.Append("</td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center' width='15%'>0");
                        tableContent.Append("</td>");
                    }

                    tableContent.Append("</tr>");

                }

                tableContent.Append("</tbody>");
                tableContent.Append("</table>^" + sbType.ToString() + "");
            }
            else
            {
                tableContent.Append("No data found ");
            }
            return tableContent.ToString();
        }

        public string GetInwardAuditReport(string comapnyCode, string userCode, string startDate, string endDate)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetInwardAuditReport(comapnyCode, userCode, startDate, endDate);
            return GetInwardAuditTable(ds);
        }
        public string GetInwardAuditTable(DataSet ds)
        {

            StringBuilder tableContent = new StringBuilder();
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblInwardAuditReport' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th align='left' width='15%'>Product Name</th>");
                tableContent.Append("<th align='left' width='15%'>Qty</th>");
                tableContent.Append("<th align='left' width='15%'>Actual Date</th>");
                tableContent.Append("<th align='left' width='15%'>Entered Date</th>");
                tableContent.Append("<th align='left' width='15%'>Entered By</th></tr>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");
                DataTable dtuserDetails = ds.Tables[0];
                foreach (DataRow drs in dtuserDetails.Rows)
                {
                    tableContent.Append("<tr><td align='left' width='15%'>");
                    tableContent.Append(drs["User_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Product_Name"].ToString());
                    tableContent.Append("</td><td align='center' width='15%'>");

                    tableContent.Append(drs["QTY"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Actual_Imward_Date"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["Entered_Date"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");

                    tableContent.Append(drs["EnteredBY"].ToString());
                    tableContent.Append("</td></tr>");


                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
            }
            else
            {
                tableContent.Append("No data found ");
            }
            return tableContent.ToString();
        }
        public DataSet GetDoctorCoverageCount(string companyCode, string userCodes, int startMonth, int endMonth, int startYear, int endYear)
        {
            return _objDoctorVisit.GetDoctorCoverageCount(companyCode, userCodes, startMonth, endMonth, startYear, endYear);
        }
        public string GetLastSubmittedReport(string comapnyCode, string userCode, string startDate, string endDate, string userSelection, string dateSelectionType, string unlistedDoc, string reportName, string missedDoctor, string reportViewType)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            DataSet dsMissed = new DataSet();
            //if (dateSelectionType.ToUpper() == "ACTUAL")
            //{
            ds = _objDoctorVisit.GetLastSubmittedReport(comapnyCode, userCode, startDate, endDate, userSelection);
            if (missedDoctor.ToUpper() == "MISSED")
            {
                dsMissed = _objDoctorVisit.GetLastSubmittedMissedCall(comapnyCode, userCode, startDate, endDate, userSelection);
            }
            //}
            //else
            //{
            //    ds = _objDoctorVisit.GetLastSubmittedEnteredReport(comapnyCode, userCode, startDate, endDate, userSelection);
            //}
            return GetLastSubmittedTable(ds, unlistedDoc, startDate, endDate, reportName, missedDoctor, dsMissed, reportViewType);
        }
        //Asyn last submitted report
        public string GetLastSubmittedReport(string comapnyCode, string userCode, string startDate, string endDate, string userSelection, string dateSelectionType, string unlistedDoc, string reportName, string missedDoctor, string reportViewType, string ConnectionString, string Domain, string userName)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            DataSet dsMissed = new DataSet();
            //if (dateSelectionType.ToUpper() == "ACTUAL")
            //{
            ds = _objDoctorVisit.GetLastSubmittedReport(comapnyCode, userCode, startDate, endDate, userSelection, ConnectionString);
            if (missedDoctor.ToUpper() == "MISSED")
            {
                dsMissed = _objDoctorVisit.GetLastSubmittedMissedCall(comapnyCode, userCode, startDate, endDate, userSelection, ConnectionString);
            }
            //}
            //else
            //{
            //    ds = _objDoctorVisit.GetLastSubmittedEnteredReport(comapnyCode, userCode, startDate, endDate, userSelection);
            //}
            return GetLastSubmittedTable(ds, unlistedDoc, startDate, endDate, reportName, missedDoctor, dsMissed, reportViewType, comapnyCode, ConnectionString, Domain, userName);
        }
        public string GetLastSubmittedReportRPT(string comapnyCode, string userCode, string startDate, string endDate, string userSelection, string dateSelectionType, string unlistedDoc, string reportName, string missedDoctor, string reportViewType)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            DataSet dsMissed = new DataSet();
            //if (dateSelectionType.ToUpper() == "ACTUAL")
            //{
            ds = _objDoctorVisit.GetLastSubmittedReportRPT(comapnyCode, userCode, startDate, endDate, userSelection);
            if (missedDoctor.ToUpper() == "MISSED")
            {
                dsMissed = _objDoctorVisit.GetLastSubmittedMissedCall(comapnyCode, userCode, startDate, endDate, userSelection);
            }
            //}
            //else
            //{
            //    ds = _objDoctorVisit.GetLastSubmittedEnteredReport(comapnyCode, userCode, startDate, endDate, userSelection);
            //}
            return GetLastSubmittedTableRPT(ds, unlistedDoc, startDate, endDate, reportName, missedDoctor, dsMissed, reportViewType);
        }
        public string GetLastSubmittedTable(DataSet ds, string unlistedDoc, string startDate, string endDate, string reportName, string missedDoctor, DataSet dsMissed, string reportViewType)
        {

            StringBuilder sbTableContent = new StringBuilder();
            int totalworkingDays = 0;
            DataRow[] drFilter;
            DataRow[] SubdrFilter;
            int sum = 0;
            int doctorMetCount = 0;
            int DoctorMadeCount = 0;
            int missedCallCount = 0;
            double fieldWorkingDays = 0.0;
            double avg = 0.0;
            double stockiestPobAmt = 0.0;
            double stockiestCollAmt = 0.0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtLeaveType = ds.Tables[9];
                DataTable dtDivistion = ds.Tables[1];

                if (ds.Tables[7].Rows.Count > 0)
                {
                    totalworkingDays = Convert.ToInt32(ds.Tables[6].Rows[0]["Count"].ToString()) + 1;
                }
                else
                {
                    totalworkingDays = 1;
                }
                sbTableContent.Append("<div><b> " + reportName + " for the period of " + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " to " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</b></div>");
                sbTableContent.Append("<div>* 1. Drafted & Unapproved DCRs are not considered in this report </div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>2.Only approved DCRs are considered for POB amount computation. </div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>3.<b>Count of Missed Doctors</b> is the Number of Doctors never visited even once in the selected date period.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>4.<b>Listed Doctors Visited Once</b> is the Number of Doctors visited only once in the selected date period. REPEAT for twice and thrice and more than thrice.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>5.<b>Count of Listed Doctors Met</b> is the Number of Doctors Met in the selected date period.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>6.<b>Average Number of Listed Doctors</b> Met is Listed Doctors Met / Num. of Field Days.</div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedReport'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th align='left' width='15%'>User Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Designation</th>");
                sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Division Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Number</th>");
                sbTableContent.Append("<th align='left' width='15%'>Date of Joining</th>");
                sbTableContent.Append("<th align='left' width='15%'>DCR Record till</th>");
                sbTableContent.Append("<th align='left' width='15%'> Last DCR Activity</th>");
                sbTableContent.Append("<th align='left' width='15%'> Last DCR Status</th>");
                if (missedDoctor.ToUpper() == "MISSED")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Missed Doctors</th>");
                }

                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Once</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Twice</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Thrice</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited More Than Thrice Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Met</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Calls Made</th>");
                if (unlistedDoc.ToUpper() == "INCLUDE")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Unlisted Doctors Met / Calls</th>");
                }
                sbTableContent.Append("<th align='left' width='15%'>Doctor Call Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Average Number of Listed Doctors Met</th>");
                sbTableContent.Append("<th align='left' width='15%'>Doctor POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Num. of Days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Weekend off.</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num of Holidays</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Field Days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Attendance</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Leave Count</th>");
                foreach (DataRow dr in dtLeaveType.Rows)
                {
                    sbTableContent.Append("<th align='left' width='15%'>");
                    sbTableContent.Append(dr["Leave_Type_Name"].ToString());
                    sbTableContent.Append("</th>");

                }
                sbTableContent.Append("<th align='left' width='15%'>Chemist Calls made</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chemist Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chem. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. Collection</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Expenses</th>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");
                DataTable dtuserDetails = ds.Tables[0];
                string divisionName = string.Empty;

                foreach (DataRow drs in dtuserDetails.Rows)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Employee_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    // Division Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    divisionName = "";
                    drFilter = dtDivistion.AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    foreach (DataRow drDivision in drFilter)
                    {
                        divisionName += drDivision["Division_Name"].ToString() + ",";
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }
                    sbTableContent.Append(divisionName);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Employee_Number"].ToString());
                    sbTableContent.Append("</td>");
                    // DOJ
                    sbTableContent.Append("<td align='left' width='15%'>");
                    if (!string.IsNullOrEmpty(drs["DOJ"].ToString()))
                    {
                        sbTableContent.Append(drs["DOJ"].ToString());
                    }
                    sbTableContent.Append("</td>");
                    CurrentInfo _objCurInfo = new CurrentInfo();
                    string comCode = _objCurInfo.GetCompanyCode();
                    string userCode = drs["User_code"].ToString();
                    string lastDate = "";
                    string Dstatus = "";
                    string flag = "";

                    DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                    List<MVCModels.HiDoctor_Reports.DivisionModel> lstdivision = new List<MVCModels.HiDoctor_Reports.DivisionModel>();

                    List<MVCModels.HiDoctor_Reports.DcrStatus> lstDcrStatus = new List<MVCModels.HiDoctor_Reports.DcrStatus>();


                    //DCR Record Till
                    sbTableContent.Append("<td align='left' width='15%'>");
                    drFilter = ds.Tables[2].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Last_Entered_Date"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Last_Entered_Date"].ToString());
                            lastDate = drFilter[0]["Last_Entered_Date"].ToString();
                        }
                    }



                    if (lastDate != "Nil" && lastDate != "")
                    {
                        lastDate = lastDate.Split('/')[2] + "-" + lastDate.Split('/')[1] + "-" + lastDate.Split('/')[0];
                    }
                    lstDcrStatus = _objRR.GetlastSubmittedDcrStatus(comCode, userCode, lastDate).ToList();

                    if (lstDcrStatus.Count > 0)
                    {
                        foreach (var DCR in lstDcrStatus)
                        {
                            Dstatus += DCR.DCR_Status + ",";
                            flag += DCR.flag + ",";
                        }
                    }
                    Dstatus = Dstatus.TrimEnd(',');
                    flag = flag.TrimEnd(',');
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");

                    sbTableContent.Append(flag);

                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");

                    sbTableContent.Append(Dstatus);

                    sbTableContent.Append("</td>");

                    //Missed Doctors
                    //missedCallCount = 0;
                    if (missedDoctor.ToUpper() == "MISSED")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        if (dsMissed.Tables.Count > 0 && dsMissed.Tables[0].Rows.Count > 0)
                        {
                            drFilter = dsMissed.Tables[0].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();

                            //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();
                            if (drFilter.Length > 0)
                            {
                                if (drFilter[0]["[Missed Doctor Count]"].ToString() != null)
                                {

                                    missedCallCount = Convert.ToInt32(drFilter[0]["[Missed Doctor Count]"].ToString());
                                    if (missedCallCount > 0)
                                    {
                                        sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                                        sbTableContent.Append(drs["Region_Code"].ToString());
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(drs["User_Code"].ToString());
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(startDate);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(endDate);
                                        sbTableContent.Append("_MISSED\")' style='text-decoration:underline;cursor:pointer'>");
                                        sbTableContent.Append(missedCallCount);
                                        sbTableContent.Append("</span>");
                                    }
                                }
                            }
                        }
                        sbTableContent.Append("</td>");
                    }

                    //Listed Doctor Once Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    doctorMetCount = 0;
                    DoctorMadeCount = 0;
                    fieldWorkingDays = 0.0;

                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("1"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_ONCE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Listed Doctor Twice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("2"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;

                            sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_TWICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    // Listed Doctor Thrice Visit
                    sum = 0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("3"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;

                            sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_THRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    sum = 0;
                    // Listed Doctor More Than Thrice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("4"));
                        sum += drFilter.Sum(row => row.Field<int>("5"));
                        sum += drFilter.Sum(row => row.Field<int>("6"));
                        sum += drFilter.Sum(row => row.Field<int>("7"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_MORETHRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");

                    // Listed Doctors Met
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (doctorMetCount > 0)
                    {

                        sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                        sbTableContent.Append(drs["Region_Code"].ToString());
                        sbTableContent.Append("_");
                        sbTableContent.Append(drs["User_Code"].ToString());
                        sbTableContent.Append("_");
                        sbTableContent.Append(startDate);
                        sbTableContent.Append("_");
                        sbTableContent.Append(endDate);
                        sbTableContent.Append("_DOCTORMET\")' style='text-decoration:underline;cursor:pointer'>");
                        sbTableContent.Append(doctorMetCount);
                        sbTableContent.Append("</span>");
                    }
                    //  sbTableContent.Append(doctorMetCount);
                    sbTableContent.Append("</td>");
                    //Listed Doctor Calls Made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    DoctorMadeCount = 0;
                    drFilter = ds.Tables[15].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Listed doctor Visit]"].ToString()))
                        {
                            DoctorMadeCount += Convert.ToInt32(drFilter[0]["[Listed doctor Visit]"].ToString());
                        }
                        if (DoctorMadeCount > 0)
                        {
                            sbTableContent.Append("<span>");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                            //sbTableContent.Append("_DOCTORMADE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorMadeCount);
                            sbTableContent.Append("</span>");
                        }
                    }
                    // sbTableContent.Append(DoctorMadeCount);
                    sbTableContent.Append("</td>");
                    //Unlisted Doctors Met / Calls
                    if (unlistedDoc.ToUpper() == "INCLUDE")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[4].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["[Flexi doctor Count]"].ToString()))
                            {
                                DoctorMadeCount += Convert.ToInt32(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                                sbTableContent.Append(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                            }
                        }
                        sbTableContent.Append("</td>");
                    }
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "F").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            fieldWorkingDays = Convert.ToDouble(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    // Doctor Call Avg
                    avg = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(DoctorMadeCount) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");



                    var averageNumberofListedDoctorsMet = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    averageNumberofListedDoctorsMet = (Convert.ToDouble(doctorMetCount) / fieldWorkingDays);
                    if (averageNumberofListedDoctorsMet.ToString() == "NaN")
                    {
                        sbTableContent.Append("0");
                    }
                    else
                    {
                        sbTableContent.Append(averageNumberofListedDoctorsMet.ToString("N2"));
                    }

                    sbTableContent.Append("</td>");
                    double docpob = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[16].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Doctor_Pob"].ToString()))
                        {
                            docpob = Convert.ToDouble(drFilter[0]["Doctor_Pob"].ToString());
                            if (docpob > 0)
                            {
                                sbTableContent.Append(docpob.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");

                    //Working Days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sbTableContent.Append(totalworkingDays);
                    sbTableContent.Append("</td>");
                    //Weekend days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Sundays_Count"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                        }
                    }
                    else
                    {
                        drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == "").ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter[0]["Sundays_Count"].ToString() != null)
                            {
                                sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                            }
                        }
                    }
                    sbTableContent.Append("</td>");

                    // Holiday Count 
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[11].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Holiday_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Holiday_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");

                    // Fileld
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        sbTableContent.Append(fieldWorkingDays);
                    }
                    sbTableContent.Append("</td>");
                    //Attendance
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "A").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    // Total Leave Count
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "L").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    foreach (DataRow dr in dtLeaveType.Rows)
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[10].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Type"].ToString() == dr["Leave_Type_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["LeaveTypeCount"].ToString()))
                            {

                                sbTableContent.Append("<span onclick='fnLeaveDetailPopUp(\"");
                                sbTableContent.Append(dr["Leave_Type_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(drs["User_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(startDate);
                                sbTableContent.Append("_");
                                sbTableContent.Append(endDate);
                                sbTableContent.Append("_");
                                sbTableContent.Append(drs["Region_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(dr["Leave_Type_Name"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>");
                                sbTableContent.Append(SubdrFilter[0]["LeaveTypeCount"].ToString());
                                sbTableContent.Append("</span>");
                            }
                        }
                        sbTableContent.Append("</td>");

                    }
                    //Chemist Calls made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[14].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    sum = 0;
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("[Chemist Count]"));
                        sbTableContent.Append(sum);
                    }

                    sbTableContent.Append("</td>");


                    // Chemeist Avg
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (sum > 0 && fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(sum) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");

                    //Chem. POB
                    double chemistpob = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[5].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["PO_Amount"].ToString()))
                        {
                            chemistpob = Convert.ToDouble(drFilter[0]["PO_Amount"].ToString());
                            if (chemistpob > 0)
                            {
                                sbTableContent.Append(chemistpob.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    //Stock. POB
                    stockiestCollAmt = 0.0;
                    stockiestPobAmt = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[13].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_PO"].ToString()))
                        {
                            stockiestPobAmt = Convert.ToDouble(drFilter[0]["Stok_PO"].ToString());
                            if (stockiestPobAmt > 0)
                            {
                                sbTableContent.Append(stockiestPobAmt.ToString("N2"));
                            }
                        }

                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_Coll"].ToString()))
                        {
                            stockiestCollAmt = Convert.ToDouble(drFilter[0]["Stok_Coll"].ToString());
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Stock. Collection
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (stockiestCollAmt > 0)
                    {
                        sbTableContent.Append(stockiestCollAmt.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");
                    //Total Expenses
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    drFilter = ds.Tables[12].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    double expenseAmount = 0.0;
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Expense Detail Amount]"].ToString()))
                        {
                            expenseAmount = Convert.ToDouble(drFilter[0]["[Expense Detail Amount]"].ToString());
                            if (expenseAmount > 0)
                            {
                                sbTableContent.Append(expenseAmount.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
            }
            else
            {
                sbTableContent.Append("No data found ");
            }

            if (reportViewType.ToUpper() == "EXCEL")
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                CurrentInfo _objCurInfo = new CurrentInfo();
                string userName = _objCurInfo.GetUserName();
                string Domain = _objCurInfo.GetSubDomain();
                string fileName = reportName + "_" + Domain + "_" + userName + ".xls";
                string blobUrl = string.Empty;
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
                sbTableContent = new StringBuilder();
                sbTableContent.Append("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
            }
            return sbTableContent.ToString();
        }
        //Asyn last submitted report
        public string GetLastSubmittedTable(DataSet ds, string unlistedDoc, string startDate, string endDate, string reportName, string missedDoctor, DataSet dsMissed, string reportViewType, string comapnyCode, string ConnectionString, string Domain, string userName)
        {

            StringBuilder sbTableContent = new StringBuilder();
            int totalworkingDays = 0;
            DataRow[] drFilter;
            DataRow[] SubdrFilter;
            int sum = 0;
            int doctorMetCount = 0;
            int DoctorMadeCount = 0;
            int missedCallCount = 0;
            double fieldWorkingDays = 0.0;
            double avg = 0.0;
            double stockiestPobAmt = 0.0;
            double stockiestCollAmt = 0.0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtLeaveType = ds.Tables[9];
                DataTable dtDivistion = ds.Tables[1];

                if (ds.Tables[7].Rows.Count > 0)
                {
                    totalworkingDays = Convert.ToInt32(ds.Tables[6].Rows[0]["Count"].ToString()) + 1;
                }
                else
                {
                    totalworkingDays = 1;
                }
                sbTableContent.Append("<div class='dvHeader'>");
                sbTableContent.Append("<div class='dvheader-inner'><b> " + reportName + " for the period of " + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " to " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</b></div>");
                sbTableContent.Append("</div>");
                sbTableContent.Append("<div>* 1. Drafted & Unapproved DCRs are not considered in this report </div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>2.Only approved DCRs are considered for POB amount computation. </div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>3.<b>Count of Missed Doctors</b> is the Number of Doctors never visited even once in the selected date period.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>4.<b>Listed Doctors Visited Once</b> is the Number of Doctors visited only once in the selected date period. REPEAT for twice and thrice and more than thrice.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>5.<b>Count of Listed Doctors Met</b> is the Number of Doctors Met in the selected date period.</div>");
                sbTableContent.Append("<div style='margin-left: 7px;'>6.<b>Average Number of Listed Doctors</b> Met is Listed Doctors Met / Num. of Field Days.</div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedReport'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th align='left' width='15%'>User Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Designation</th>");
                sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Division Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Number</th>");
                sbTableContent.Append("<th align='left' width='15%'>Date of Joining</th>");
                sbTableContent.Append("<th align='left' width='15%'>DCR Record till</th>");
                sbTableContent.Append("<th align='left' width='15%'> Last DCR Activity</th>");
                sbTableContent.Append("<th align='left' width='15%'> Last DCR Status</th>");
                if (missedDoctor.ToUpper() == "MISSED")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Missed Doctors</th>");
                }

                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Once</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Twice</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited Thrice</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited More Than Thrice Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Met</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Calls Made</th>");
                if (unlistedDoc.ToUpper() == "INCLUDE")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Unlisted Doctors Met / Calls</th>");
                }
                sbTableContent.Append("<th align='left' width='15%'>Doctor Call Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Average Number of Listed Doctors Met</th>");
                sbTableContent.Append("<th align='left' width='15%'>Doctor POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Num. of Days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Weekend off.</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num of Holidays</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Field Days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Num. of Attendance</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Leave Count</th>");
                foreach (DataRow dr in dtLeaveType.Rows)
                {
                    sbTableContent.Append("<th align='left' width='15%'>");
                    sbTableContent.Append(dr["Leave_Type_Name"].ToString());
                    sbTableContent.Append("</th>");

                }
                sbTableContent.Append("<th align='left' width='15%'>Chemist Calls made</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chemist Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chem. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. Collection</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Expenses</th>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");
                DataTable dtuserDetails = ds.Tables[0];
                string divisionName = string.Empty;

                foreach (DataRow drs in dtuserDetails.Rows)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Employee_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    // Division Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    divisionName = "";
                    drFilter = dtDivistion.AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    foreach (DataRow drDivision in drFilter)
                    {
                        divisionName += drDivision["Division_Name"].ToString() + ",";
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }
                    sbTableContent.Append(divisionName);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Employee_Number"].ToString());
                    sbTableContent.Append("</td>");
                    // DOJ
                    sbTableContent.Append("<td align='left' width='15%'>");
                    if (!string.IsNullOrEmpty(drs["DOJ"].ToString()))
                    {
                        sbTableContent.Append(drs["DOJ"].ToString());
                    }
                    sbTableContent.Append("</td>");
                    //CurrentInfo _objCurInfo = new CurrentInfo();
                    //string comCode = _objCurInfo.GetCompanyCode();
                    string comCode = comapnyCode;
                    string userCode = drs["User_code"].ToString();
                    string lastDate = "";
                    string Dstatus = "";
                    string flag = "";

                    DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                    List<MVCModels.HiDoctor_Reports.DivisionModel> lstdivision = new List<MVCModels.HiDoctor_Reports.DivisionModel>();

                    List<MVCModels.HiDoctor_Reports.DcrStatus> lstDcrStatus = new List<MVCModels.HiDoctor_Reports.DcrStatus>();


                    //DCR Record Till
                    sbTableContent.Append("<td align='left' width='15%'>");
                    drFilter = ds.Tables[2].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Last_Entered_Date"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Last_Entered_Date"].ToString());
                            lastDate = drFilter[0]["Last_Entered_Date"].ToString();
                        }
                    }



                    if (lastDate != "Nil" && lastDate != "")
                    {
                        lastDate = lastDate.Split('/')[2] + "-" + lastDate.Split('/')[1] + "-" + lastDate.Split('/')[0];
                    }
                    lstDcrStatus = _objRR.GetlastSubmittedDcrStatus(comCode, userCode, lastDate, ConnectionString).ToList();

                    if (lstDcrStatus.Count > 0)
                    {
                        foreach (var DCR in lstDcrStatus)
                        {
                            Dstatus += DCR.DCR_Status + ",";
                            flag += DCR.flag + ",";
                        }
                    }
                    Dstatus = Dstatus.TrimEnd(',');
                    flag = flag.TrimEnd(',');
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");

                    sbTableContent.Append(flag);

                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");

                    sbTableContent.Append(Dstatus);

                    sbTableContent.Append("</td>");

                    //Missed Doctors
                    //missedCallCount = 0;
                    if (missedDoctor.ToUpper() == "MISSED")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        if (dsMissed.Tables.Count > 0 && dsMissed.Tables[0].Rows.Count > 0)
                        {
                            drFilter = dsMissed.Tables[0].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();

                            //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();
                            if (drFilter.Length > 0)
                            {
                                if (drFilter[0]["[Missed Doctor Count]"].ToString() != null)
                                {

                                    missedCallCount = Convert.ToInt32(drFilter[0]["[Missed Doctor Count]"].ToString());
                                    if (missedCallCount > 0)
                                    {
                                        sbTableContent.Append("<span>");
                                       // sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                                        //sbTableContent.Append(drs["Region_Code"].ToString());
                                        //sbTableContent.Append("_");
                                        //sbTableContent.Append(drs["User_Code"].ToString());
                                        //sbTableContent.Append("_");
                                        //sbTableContent.Append(startDate);
                                        //sbTableContent.Append("_");
                                        //sbTableContent.Append(endDate);
                                       // sbTableContent.Append("_MISSED\")' style='text-decoration:underline;cursor:pointer'>");
                                        sbTableContent.Append(missedCallCount);
                                        sbTableContent.Append("</span>");
                                    }
                                }
                            }
                        }
                        sbTableContent.Append("</td>");
                    }

                    //Listed Doctor Once Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    doctorMetCount = 0;
                    DoctorMadeCount = 0;
                    fieldWorkingDays = 0.0;

                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("1"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span>");
                            //sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                          //  sbTableContent.Append("_ONCE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Listed Doctor Twice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("2"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span>");
                           // sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                           // sbTableContent.Append("_TWICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    // Listed Doctor Thrice Visit
                    sum = 0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("3"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span>");
                          //  sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                          //  sbTableContent.Append("_THRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    sum = 0;
                    // Listed Doctor More Than Thrice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("4"));
                        sum += drFilter.Sum(row => row.Field<int>("5"));
                        sum += drFilter.Sum(row => row.Field<int>("6"));
                        sum += drFilter.Sum(row => row.Field<int>("7"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span>");
                        //    sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                           // sbTableContent.Append("_MORETHRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");

                    // Listed Doctors Met
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (doctorMetCount > 0)
                    {
                        sbTableContent.Append("<span>");
                      //  sbTableContent.Append("<span onclick='fnLastSubmittedPopup(\"");
                        //sbTableContent.Append(drs["Region_Code"].ToString());
                        //sbTableContent.Append("_");
                        //sbTableContent.Append(drs["User_Code"].ToString());
                        //sbTableContent.Append("_");
                        //sbTableContent.Append(startDate);
                        //sbTableContent.Append("_");
                        //sbTableContent.Append(endDate);
                       // sbTableContent.Append("_DOCTORMET\")' style='text-decoration:underline;cursor:pointer'>");
                        sbTableContent.Append(doctorMetCount);
                        sbTableContent.Append("</span>");
                    }
                    //  sbTableContent.Append(doctorMetCount);
                    sbTableContent.Append("</td>");
                    //Listed Doctor Calls Made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    DoctorMadeCount = 0;
                    drFilter = ds.Tables[15].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Listed doctor Visit]"].ToString()))
                        {
                            DoctorMadeCount += Convert.ToInt32(drFilter[0]["[Listed doctor Visit]"].ToString());
                        }
                        if (DoctorMadeCount > 0)
                        {
                            sbTableContent.Append("<span>");
                            //sbTableContent.Append(drs["Region_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(drs["User_Code"].ToString());
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(startDate);
                            //sbTableContent.Append("_");
                            //sbTableContent.Append(endDate);
                            //sbTableContent.Append("_DOCTORMADE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorMadeCount);
                            sbTableContent.Append("</span>");
                        }
                    }
                    // sbTableContent.Append(DoctorMadeCount);
                    sbTableContent.Append("</td>");
                    //Unlisted Doctors Met / Calls
                    if (unlistedDoc.ToUpper() == "INCLUDE")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[4].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["[Flexi doctor Count]"].ToString()))
                            {
                                DoctorMadeCount += Convert.ToInt32(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                                sbTableContent.Append(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                            }
                        }
                        sbTableContent.Append("</td>");
                    }
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "F").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            fieldWorkingDays = Convert.ToDouble(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    // Doctor Call Avg
                    avg = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(DoctorMadeCount) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");



                    var averageNumberofListedDoctorsMet = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    averageNumberofListedDoctorsMet = (Convert.ToDouble(doctorMetCount) / fieldWorkingDays);
                    if (averageNumberofListedDoctorsMet.ToString() == "NaN")
                    {
                        sbTableContent.Append("0");
                    }
                    else
                    {
                        sbTableContent.Append(averageNumberofListedDoctorsMet.ToString("N2"));
                    }

                    sbTableContent.Append("</td>");
                    double docpob = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[16].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Doctor_Pob"].ToString()))
                        {
                            docpob = Convert.ToDouble(drFilter[0]["Doctor_Pob"].ToString());
                            if (docpob > 0)
                            {
                                sbTableContent.Append(docpob.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");

                    //Working Days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sbTableContent.Append(totalworkingDays);
                    sbTableContent.Append("</td>");
                    //Weekend days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Sundays_Count"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                        }
                    }
                    else
                    {
                        drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == "").ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter[0]["Sundays_Count"].ToString() != null)
                            {
                                sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                            }
                        }
                    }
                    sbTableContent.Append("</td>");

                    // Holiday Count 
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[11].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Holiday_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Holiday_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");

                    // Fileld
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        sbTableContent.Append(fieldWorkingDays);
                    }
                    sbTableContent.Append("</td>");
                    //Attendance
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "A").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    // Total Leave Count
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "L").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    foreach (DataRow dr in dtLeaveType.Rows)
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[10].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Type"].ToString() == dr["Leave_Type_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["LeaveTypeCount"].ToString()))
                            {
                                sbTableContent.Append("<span>");
                               // sbTableContent.Append("<span onclick='fnLeaveDetailPopUp(\"");
                                //sbTableContent.Append(dr["Leave_Type_Code"].ToString());
                                //sbTableContent.Append("_");
                                //sbTableContent.Append(drs["User_Code"].ToString());
                                //sbTableContent.Append("_");
                                //sbTableContent.Append(startDate);
                                //sbTableContent.Append("_");
                                //sbTableContent.Append(endDate);
                                //sbTableContent.Append("_");
                                //sbTableContent.Append(drs["Region_Code"].ToString());
                                //sbTableContent.Append("_");
                             //   sbTableContent.Append(dr["Leave_Type_Name"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>");
                                sbTableContent.Append(SubdrFilter[0]["LeaveTypeCount"].ToString());
                                sbTableContent.Append("</span>");
                            }
                        }
                        sbTableContent.Append("</td>");

                    }
                    //Chemist Calls made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[14].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    sum = 0;
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("[Chemist Count]"));
                        sbTableContent.Append(sum);
                    }

                    sbTableContent.Append("</td>");


                    // Chemeist Avg
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (sum > 0 && fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(sum) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");

                    //Chem. POB
                    double chemistpob = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[5].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["PO_Amount"].ToString()))
                        {
                            chemistpob = Convert.ToDouble(drFilter[0]["PO_Amount"].ToString());
                            if (chemistpob > 0)
                            {
                                sbTableContent.Append(chemistpob.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    //Stock. POB
                    stockiestCollAmt = 0.0;
                    stockiestPobAmt = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[13].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_PO"].ToString()))
                        {
                            stockiestPobAmt = Convert.ToDouble(drFilter[0]["Stok_PO"].ToString());
                            if (stockiestPobAmt > 0)
                            {
                                sbTableContent.Append(stockiestPobAmt.ToString("N2"));
                            }
                        }

                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_Coll"].ToString()))
                        {
                            stockiestCollAmt = Convert.ToDouble(drFilter[0]["Stok_Coll"].ToString());
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Stock. Collection
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (stockiestCollAmt > 0)
                    {
                        sbTableContent.Append(stockiestCollAmt.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");
                    //Total Expenses
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    drFilter = ds.Tables[12].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    double expenseAmount = 0.0;
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Expense Detail Amount]"].ToString()))
                        {
                            expenseAmount = Convert.ToDouble(drFilter[0]["[Expense Detail Amount]"].ToString());
                            if (expenseAmount > 0)
                            {
                                sbTableContent.Append(expenseAmount.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
            }
            else
            {
                sbTableContent.Append("No data found ");
            }

            if (reportViewType.ToUpper() == "EXCEL")
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                //CurrentInfo _objCurInfo = new CurrentInfo();
                string fileName = reportName + "_" + Domain + "_" + userName + ".xls";
                string blobUrl = string.Empty;
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
                sbTableContent = new StringBuilder();
                sbTableContent.Append("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
            }
            return sbTableContent.ToString();
        }
        public string GetLastSubmittedTableRPT(DataSet ds, string unlistedDoc, string startDate, string endDate, string reportName, string missedDoctor, DataSet dsMissed, string reportViewType)
        {

            StringBuilder sbTableContent = new StringBuilder();
            int totalworkingDays = 0;
            DataRow[] drFilter;
            DataRow[] SubdrFilter;
            int sum = 0;
            int doctorMetCount = 0;
            int DoctorMadeCount = 0;
            int missedCallCount = 0;
            double fieldWorkingDays = 0.0;
            double avg = 0.0;
            double stockiestPobAmt = 0.0;
            double stockiestCollAmt = 0.0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtLeaveType = ds.Tables[9];
                DataTable dtDivistion = ds.Tables[1];

                if (ds.Tables[7].Rows.Count > 0)
                {
                    totalworkingDays = Convert.ToInt32(ds.Tables[6].Rows[0]["Count"].ToString()) + 1;
                }
                else
                {
                    totalworkingDays = 1;
                }
                sbTableContent.Append("<div><b> " + reportName + " for the period of " + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " to " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</b></div>");
                sbTableContent.Append("<div><b>*</b> 1. Data updated as on " + System.DateTime.Now.AddDays(-1).ToString("dd-MMM-yyyy") + "  -  11:59:59 pm </div>");
                sbTableContent.Append("<div>&nbsp;&nbsp;2. Drafted & Unapproved DCRs are not considered in this report </div>");
                sbTableContent.Append("<div>&nbsp;&nbsp3. Only approved DCRs are considered for POB amount computation. </div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedReport'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th align='left' width='15%'>User Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Designation</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Number</th>");
                sbTableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Division Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Date of Joining</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
                sbTableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
                sbTableContent.Append("<th align='left' width='15%'>DCR Record till</th>");
                if (missedDoctor.ToUpper() == "MISSED")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Missed Doctors</th>");
                }

                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Once Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Twice Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Thrice Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor More Than Thrice Visit</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Met</th>");
                sbTableContent.Append("<th align='left' width='15%'>Listed Doctor Calls Made</th>");
                if (unlistedDoc.ToUpper() == "INCLUDE")
                {
                    sbTableContent.Append("<th align='left' width='15%'>Unlisted Doctors Met / Calls</th>");
                }
                sbTableContent.Append("<th align='left' width='15%'>Doctor Call Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chemist Calls made</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chemist Avg</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total no. of Days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Weekend days</th>");
                sbTableContent.Append("<th align='left' width='15%'>Field</th>");
                sbTableContent.Append("<th align='left' width='15%'>Attendance</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Leave Count</th>");
                foreach (DataRow dr in dtLeaveType.Rows)
                {
                    sbTableContent.Append("<th align='left' width='15%'>");
                    sbTableContent.Append(dr["Leave_Type_Name"].ToString());
                    sbTableContent.Append("</th>");

                }
                sbTableContent.Append("<th align='left' width='15%'>Holiday</th>");
                sbTableContent.Append("<th align='left' width='15%'>Chem. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. POB</th>");
                sbTableContent.Append("<th align='left' width='15%'>Stock. Collection</th>");
                sbTableContent.Append("<th align='left' width='15%'>Total Expenses</th>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");
                DataTable dtuserDetails = ds.Tables[0];
                string divisionName = string.Empty;

                foreach (DataRow drs in dtuserDetails.Rows)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Employee_Number"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'  style='text-decoration:underline;' class='td-a' onclick='fnOpenComprehensiveAnalysisReport(\"" + drs["User_Code"].ToString() + "\")'>");
                    sbTableContent.Append(drs["Employee_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    // Division Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    divisionName = "";
                    drFilter = dtDivistion.AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    foreach (DataRow drDivision in drFilter)
                    {
                        divisionName += drDivision["Division_Name"].ToString() + ",";
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }
                    sbTableContent.Append(divisionName);
                    sbTableContent.Append("</td>");

                    // DOJ
                    sbTableContent.Append("<td align='left' width='15%'>");
                    if (!string.IsNullOrEmpty(drs["DOJ"].ToString()))
                    {
                        sbTableContent.Append(drs["DOJ"].ToString());
                    }
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");

                    //DCR Record Till
                    sbTableContent.Append("<td align='left' width='15%'>");
                    drFilter = ds.Tables[2].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Last_Entered_Date"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Last_Entered_Date"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    //Missed Doctors
                    missedCallCount = 0;
                    if (missedDoctor.ToUpper() == "MISSED")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        if (dsMissed.Tables.Count > 0 && dsMissed.Tables[0].Rows.Count > 0)
                        {
                            drFilter = dsMissed.Tables[0].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();

                            //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["Region_Code"].ToString() == drs["Region_Code"].ToString()).ToArray();
                            if (drFilter.Length > 0)
                            {
                                if (drFilter[0]["[Missed Doctor Count]"].ToString() != null)
                                {

                                    missedCallCount = Convert.ToInt32(drFilter[0]["[Missed Doctor Count]"].ToString());
                                    if (missedCallCount > 0)
                                    {
                                        sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                                        sbTableContent.Append(drs["Region_Code"].ToString());
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(drs["User_Code"].ToString());
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(startDate);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(endDate);
                                        sbTableContent.Append("_MISSED\")' style='text-decoration:underline;cursor:pointer'>");
                                        sbTableContent.Append(missedCallCount);
                                        sbTableContent.Append("</span>");
                                    }
                                }
                            }
                        }
                        sbTableContent.Append("</td>");
                    }

                    //Listed Doctor Once Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    doctorMetCount = 0;
                    DoctorMadeCount = 0;
                    fieldWorkingDays = 0.0;

                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("1"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_ONCE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Listed Doctor Twice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("2"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;

                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_TWICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    // Listed Doctor Thrice Visit
                    sum = 0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    //  drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("3"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;

                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_THRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");
                    sum = 0;
                    // Listed Doctor More Than Thrice Visit
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("4"));
                        sum += drFilter.Sum(row => row.Field<int>("5"));
                        sum += drFilter.Sum(row => row.Field<int>("6"));
                        sum += drFilter.Sum(row => row.Field<int>("7"));
                        if (sum > 0)
                        {
                            doctorMetCount += sum;
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_MORETHRICE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(sum);
                            sbTableContent.Append("</span>");
                        }

                    }
                    sbTableContent.Append("</td>");

                    // Listed Doctors Met
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (doctorMetCount > 0)
                    {

                        sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                        sbTableContent.Append(drs["Region_Code"].ToString());
                        sbTableContent.Append("_");
                        sbTableContent.Append(drs["User_Code"].ToString());
                        sbTableContent.Append("_");
                        sbTableContent.Append(startDate);
                        sbTableContent.Append("_");
                        sbTableContent.Append(endDate);
                        sbTableContent.Append("_DOCTORMET\")' style='text-decoration:underline;cursor:pointer'>");
                        sbTableContent.Append(doctorMetCount);
                        sbTableContent.Append("</span>");
                    }
                    //  sbTableContent.Append(doctorMetCount);
                    sbTableContent.Append("</td>");
                    //Listed Doctor Calls Made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    DoctorMadeCount = 0;
                    drFilter = ds.Tables[15].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Listed doctor Visit]"].ToString()))
                        {
                            DoctorMadeCount += Convert.ToInt32(drFilter[0]["[Listed doctor Visit]"].ToString());
                        }
                        if (DoctorMadeCount > 0)
                        {
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupRPT(\"");
                            sbTableContent.Append(drs["Region_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(drs["User_Code"].ToString());
                            sbTableContent.Append("_");
                            sbTableContent.Append(startDate);
                            sbTableContent.Append("_");
                            sbTableContent.Append(endDate);
                            sbTableContent.Append("_DOCTORMADE\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorMadeCount);
                            sbTableContent.Append("</span>");
                        }
                    }
                    // sbTableContent.Append(DoctorMadeCount);
                    sbTableContent.Append("</td>");
                    //Unlisted Doctors Met / Calls
                    if (unlistedDoc.ToUpper() == "INCLUDE")
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[4].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["[Flexi doctor Count]"].ToString()))
                            {
                                DoctorMadeCount += Convert.ToInt32(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                                sbTableContent.Append(SubdrFilter[0]["[Flexi doctor Count]"].ToString());
                            }
                        }
                        sbTableContent.Append("</td>");
                    }
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "F").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            fieldWorkingDays = Convert.ToDouble(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    // Doctor Call Avg
                    avg = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(DoctorMadeCount) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");

                    //Chemist Calls made
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[14].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    sum = 0;
                    if (drFilter.Length > 0)
                    {
                        sum = drFilter.Sum(row => row.Field<int>("[Chemist Count]"));
                        sbTableContent.Append(sum);
                    }

                    sbTableContent.Append("</td>");
                    // Chemeist Avg
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (sum > 0 && fieldWorkingDays > 0)
                    {
                        avg = (Convert.ToDouble(sum) / fieldWorkingDays);
                        sbTableContent.Append(avg.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");
                    //Working Days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sbTableContent.Append(totalworkingDays);
                    sbTableContent.Append("</td>");
                    //Weekend days
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (drFilter[0]["Sundays_Count"].ToString() != null)
                        {
                            sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                        }
                    }
                    else
                    {
                        drFilter = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == "").ToArray();
                        if (drFilter.Length > 0)
                        {
                            if (drFilter[0]["Sundays_Count"].ToString() != null)
                            {
                                sbTableContent.Append(drFilter[0]["Sundays_Count"].ToString());
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    // Fileld
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (fieldWorkingDays > 0)
                    {
                        sbTableContent.Append(fieldWorkingDays);
                    }
                    sbTableContent.Append("</td>");
                    //Attendance
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "A").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    // Total Leave Count
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Flag"].ToString() == "L").ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Activity_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Activity_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    foreach (DataRow dr in dtLeaveType.Rows)
                    {
                        sbTableContent.Append("<td align='center' width='15%'>");
                        SubdrFilter = ds.Tables[10].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString() && c["Type"].ToString() == dr["Leave_Type_Code"].ToString()).ToArray();
                        if (SubdrFilter.Length > 0)
                        {
                            if (!string.IsNullOrEmpty(SubdrFilter[0]["LeaveTypeCount"].ToString()))
                            {

                                sbTableContent.Append("<span onclick='fnLeaveDetailPopUpRPT(\"");
                                sbTableContent.Append(dr["Leave_Type_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(drs["User_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(startDate);
                                sbTableContent.Append("_");
                                sbTableContent.Append(endDate);
                                sbTableContent.Append("_");
                                sbTableContent.Append(drs["Region_Code"].ToString());
                                sbTableContent.Append("_");
                                sbTableContent.Append(dr["Leave_Type_Name"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>");
                                sbTableContent.Append(SubdrFilter[0]["LeaveTypeCount"].ToString());
                                sbTableContent.Append("</span>");
                            }
                        }
                        sbTableContent.Append("</td>");

                    }
                    // Holiday Count 
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[11].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Holiday_Count"].ToString()))
                        {
                            sbTableContent.Append(drFilter[0]["Holiday_Count"].ToString());
                        }
                    }
                    sbTableContent.Append("</td>");
                    //Chem. POB
                    double chemistpob = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[5].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["PO_Amount"].ToString()))
                        {
                            chemistpob = Convert.ToDouble(drFilter[0]["PO_Amount"].ToString());
                            if (chemistpob > 0)
                            {
                                sbTableContent.Append(chemistpob.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    //Stock. POB
                    stockiestCollAmt = 0.0;
                    stockiestPobAmt = 0.0;
                    sbTableContent.Append("<td align='center' width='15%'>");
                    drFilter = ds.Tables[13].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_PO"].ToString()))
                        {
                            stockiestPobAmt = Convert.ToDouble(drFilter[0]["Stok_PO"].ToString());
                            if (stockiestPobAmt > 0)
                            {
                                sbTableContent.Append(stockiestPobAmt.ToString("N2"));
                            }
                        }

                        if (!string.IsNullOrEmpty(drFilter[0]["Stok_Coll"].ToString()))
                        {
                            stockiestCollAmt = Convert.ToDouble(drFilter[0]["Stok_Coll"].ToString());
                        }

                    }
                    sbTableContent.Append("</td>");
                    //Stock. Collection
                    sbTableContent.Append("<td align='center' width='15%'>");
                    if (stockiestCollAmt > 0)
                    {
                        sbTableContent.Append(stockiestCollAmt.ToString("N2"));
                    }
                    sbTableContent.Append("</td>");
                    //Total Expenses
                    sbTableContent.Append("<td align='center' width='15%'>");
                    sum = 0;
                    drFilter = ds.Tables[12].AsEnumerable().Where(c => c["User_Code"].ToString() == drs["User_Code"].ToString()).ToArray();
                    double expenseAmount = 0.0;
                    if (drFilter.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(drFilter[0]["[Expense Detail Amount]"].ToString()))
                        {
                            expenseAmount = Convert.ToDouble(drFilter[0]["[Expense Detail Amount]"].ToString());
                            if (expenseAmount > 0)
                            {
                                sbTableContent.Append(expenseAmount.ToString("N2"));
                            }
                        }
                    }
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
            }
            else
            {
                sbTableContent.Append("No data found ");
            }

            if (reportViewType.ToUpper() == "EXCEL")
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                CurrentInfo _objCurInfo = new CurrentInfo();
                string userName = _objCurInfo.GetUserName();
                string Domain = _objCurInfo.GetSubDomain();
                string fileName = reportName + "_" + Domain + "_" + userName + ".xls";
                string blobUrl = string.Empty;
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
                sbTableContent = new StringBuilder();
                sbTableContent.Append("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
            }
            return sbTableContent.ToString();
        }
        public string GetLastSubmittedReportSub(string comapnyCode, string userCode, string startDate, string endDate, string userSelection, string regionCode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetLastSubmittedReportSub(comapnyCode, userCode, regionCode, startDate, endDate, userSelection);
            return GetLastSubmittedTableSub(ds, userSelection);
        }
        public string GetLastSubmittedReportSubRPT(string comapnyCode, string userCode, string startDate, string endDate, string userSelection, string regionCode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetLastSubmittedReportSubRPT(comapnyCode, userCode, regionCode, startDate, endDate, userSelection);
            return GetLastSubmittedTableSub(ds, userSelection);
        }
        public string GetLastSubmittedTableSub(DataSet ds, string userSelection)
        {

            DataRow[] drFilter;
            StringBuilder tableContent = new StringBuilder();
            string divisionName = string.Empty;
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtUserInfo = ds.Tables[0];
                tableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedSub' class='data display datatable' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee No.</th>");
                tableContent.Append("<th align='left' width='15%'>Region Name</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
                tableContent.Append("<th align='left' width='15%'>Division Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Mobile No.</th></tr>");


                tableContent.Append("<tr><td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["User_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Employee_Number"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Manager_Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td align='left' width='15%'>");

                divisionName = "";
                if (ds.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        divisionName += dr["Division_Name"].ToString() + ",";
                    }
                }

                if (!string.IsNullOrEmpty(divisionName))
                {
                    divisionName = divisionName.TrimEnd(',');
                }
                tableContent.Append(divisionName);
                tableContent.Append("</td>");

                tableContent.Append("<td align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Mobile"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("</tr></thead></table>");


                //int sNo = 0;
                int doctorMade = 0;
                string[] TobeDistinct = { "Category", "Category_Name" };
                string[] tobeCustome = { "Customer_Name" };
                DataTable dtDistinct = GetDistinctRecords(ds.Tables[2], TobeDistinct);

                DataTable dtDistinctCustome = GetDistinctRecords(ds.Tables[2], tobeCustome);

                string title = GetSelectionType(userSelection);
                string visitCount = GetSelectionType(userSelection);
                int totalCount = 0;

                tableContent.Append("<div>" + title.Split('_')[0] + "</div>");
                tableContent.Append("<table class='data display datatable'><thead><tr>");
                // tableContent.Append("<th align='left' width='15%'>S.No</th>");
                tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
                tableContent.Append("<th align='left' width='15%'>MDL No</th>");
                //  tableContent.Append("<th align='left' width='15%'>Category</th>");
                tableContent.Append("<th align='left' width='15%'>Specialtity</th>");
                tableContent.Append("<th align='left' width='15%'>Local Area</th>");
                tableContent.Append("<th align='left' width='15%'>Hospital Name</th>");
                if (userSelection.ToUpper() != "MISSED")
                {

                    foreach (DataRow drt in dtDistinct.Rows)
                    {
                        tableContent.Append("<th align='center' width='15%'>" + drt["Category_Name"].ToString() + " Visit Count</th>");
                    }
                }
                //for (var i = 0; i < ds.Tables[2].Rows.Count; i++)
                //            {
                //                tableContent.Append("<th align='center' width='15%'>" + ds.Tables[2].Rows[i]["Category_Name"].ToString() + "</th>");
                //            }
                //tableContent.Append("<th align='left' width='15%'>Count</th></tr></thead><tbody>");
                tableContent.Append("</tr></thead><tbody>");
                if (userSelection.ToUpper() == "MISSED")
                {
                    foreach (DataRow dr in dtDistinct.Rows)
                    {

                        //sNo++;
                        //tableContent.Append("<tr>");
                        //tableContent.Append("<td align='left' width='15%'>");
                        //tableContent.Append(sNo);
                        //tableContent.Append("</td>");
                        // tableContent.Append("<td align='left' width='15%'>");
                        // tableContent.Append(dr["Category_Name"].ToString());
                        drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Category"].ToString() == dr["Category"].ToString()).ToArray();
                        //   tableContent.Append("</td>");
                        //  tableContent.Append("<td align='left' width='15%'>");

                        tableContent.Append("<tr>");
                        tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                        tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                        tableContent.Append("</td>");
                        tableContent.Append("</tr>");
                        if (drFilter.Length > 0)
                        {
                            foreach (var item in drFilter)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
                                //tableContent.Append("<td align='left' width='15%'>");
                                //tableContent.Append(item["Category_Name"].ToString());
                                //tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Speciality_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Local_Area"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Hospital_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("</tr>");
                                totalCount += Convert.ToInt32(drFilter[0]["Count"].ToString());
                            }

                            //if (drFilter[0]["Count"].ToString() != null)
                            //{
                            //    tableContent.Append(drFilter[0]["Count"].ToString());
                            //    totalCount += Convert.ToInt32(drFilter[0]["Count"].ToString());
                            //}
                        }
                        // tableContent.Append("</td></tr>");
                    }
                    tableContent.Append("<tr>");
                    tableContent.Append("<td colspan='2' align='right'>Total</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(totalCount);
                    tableContent.Append("</td></tr>");
                    //tableContent.Append("<tr>");
                    //tableContent.Append("<td colspan='2' align='right'>Total</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(totalCount);
                    //tableContent.Append("</td></tr>");

                    //foreach (DataRow dr in dtDistinct.Rows)
                    //{

                    //    //sNo++;
                    //    //tableContent.Append("<tr>");
                    //    //tableContent.Append("<td align='left' width='15%'>");
                    //    //tableContent.Append(sNo);
                    //    //tableContent.Append("</td>");
                    //    // tableContent.Append("<td align='left' width='15%'>");
                    //    // tableContent.Append(dr["Category_Name"].ToString());
                    //    drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Category"].ToString() == dr["Category"].ToString()).ToArray();
                    //    //   tableContent.Append("</td>");
                    //    //  tableContent.Append("<td align='left' width='15%'>");

                    //    //tableContent.Append("<tr>");
                    //    //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                    //    //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                    //    //tableContent.Append("</td>");
                    //    //tableContent.Append("</tr>");
                    //    if (drFilter.Length > 0)
                    //    {
                    //        foreach (var item in drFilter)
                    //        {
                    //            tableContent.Append("<tr>");
                    //            tableContent.Append("<td align='left' width='15%'>");
                    //            tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                    //            tableContent.Append("</td>");
                    //            tableContent.Append("<td align='left' width='15%'>");
                    //            tableContent.Append(item["MDL_Number"].ToString());
                    //            tableContent.Append("</td>");
                    //            //tableContent.Append("<td align='left' width='15%'>");
                    //            //tableContent.Append(item["Category_Name"].ToString());
                    //            //tableContent.Append("</td>");
                    //            tableContent.Append("<td align='left' width='15%'>");
                    //            tableContent.Append(item["Speciality_Name"].ToString());
                    //            tableContent.Append("</td>");
                    //            tableContent.Append("<td align='left' width='15%'>");
                    //            tableContent.Append(item["Local_Area"].ToString());
                    //            tableContent.Append("</td>");
                    //            tableContent.Append("<td align='left' width='15%'>");
                    //            tableContent.Append(item["Hospital_Name"].ToString());
                    //            tableContent.Append("</td>");

                    //            foreach (DataRow drt in dtDistinct.Rows)
                    //            {
                    //                var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToArray();
                    //                if (categoryList.Length > 0 && categoryList != null)
                    //                {
                    //                    tableContent.Append("<td align='left' width='15%'>");
                    //                    tableContent.Append(categoryList[0]["Listed_doctor_Count"].ToString());
                    //                    tableContent.Append("</td>");

                    //                }
                    //                else
                    //                {
                    //                    tableContent.Append("<td align='left' width='15%'>");
                    //                    tableContent.Append("");
                    //                    tableContent.Append("</td>");
                    //                }
                    //            }

                    //            tableContent.Append("</tr>");
                    //            totalCount += Convert.ToInt32(drFilter[0]["Count"].ToString());
                    //        }

                    //        //if (drFilter[0]["Count"].ToString() != null)
                    //        //{
                    //        //    tableContent.Append(drFilter[0]["Count"].ToString());
                    //        //    totalCount += Convert.ToInt32(drFilter[0]["Count"].ToString());
                    //        //}
                    //    }
                    //    // tableContent.Append("</td></tr>");
                    //}
                    //tableContent.Append("<tr>");
                    //tableContent.Append("<td colspan='2' align='right'>Total</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(totalCount);
                    //tableContent.Append("</td></tr>");
                }
                else
                {

                    totalCount = 0;
                    int sum = 0;
                    //foreach (DataRow dr in dtDistinct.Rows)
                    //{
                    //sNo++;
                    doctorMade = 0;
                    tableContent.Append("<tr>");
                    //tableContent.Append("<td align='left' width='15%'>");
                    //tableContent.Append(sNo);
                    //tableContent.Append("</td>");
                    //tableContent.Append("<td align='left' width='15%'>");
                    //tableContent.Append(dr["Category_Name"].ToString());
                    //tableContent.Append("</td>");

                    if (userSelection.ToUpper() == "ONCE")
                    {
                        drFilter = ds.Tables[3].AsEnumerable().Where(c => c["doctor_Count"].ToString() == "1").ToArray();
                        // tableContent.Append("<td align='left' width='15%'>");

                        //tableContent.Append("<tr>");
                        //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                        //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                        //tableContent.Append("</td>");
                        //tableContent.Append("</tr>");
                        if (drFilter.Length > 0)
                        {
                            foreach (var item in drFilter)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
                                //tableContent.Append("<td align='left' width='15%'>");
                                //tableContent.Append(item["Category_Name"].ToString());
                                //tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Speciality_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Local_Area"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Hospital_Name"].ToString());
                                tableContent.Append("</td>");
                                var categoryList = ds.Tables[2].AsEnumerable().Where(s => s["Customer_Name"].ToString() == item["Customer_Name"].ToString()).ToList();
                                foreach (DataRow drt in dtDistinct.Rows)
                                {

                                    var categoryUnicList = categoryList.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryList != null)
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append(categoryUnicList[0]["Listed_doctor_Count"].ToString());
                                        tableContent.Append("</td>");

                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }

                                tableContent.Append("</tr>");
                            }
                            //tableContent.Append(drFilter.Length);
                            //totalCount += Convert.ToInt32(drFilter.Length);
                        }
                        tableContent.Append("</td>");
                    }
                    else if (userSelection.ToUpper() == "TWICE")
                    {
                        // drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Listed_doctor_Count"].ToString() == "2").ToArray();
                        drFilter = ds.Tables[3].AsEnumerable().Where(c => c["doctor_Count"].ToString() == "2").ToArray();
                        //tableContent.Append("<td align='left' width='15%'>");

                        //tableContent.Append("<tr>");
                        //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                        //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                        //tableContent.Append("</td>");
                        //tableContent.Append("</tr>");
                        if (drFilter.Length > 0)
                        {
                            foreach (var item in drFilter)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
                                //tableContent.Append("<td align='left' width='15%'>");
                                //tableContent.Append(item["Category_Name"].ToString());
                                //tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Speciality_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Local_Area"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Hospital_Name"].ToString());
                                tableContent.Append("</td>");
                                var categoryList = ds.Tables[2].AsEnumerable().Where(s => s["Customer_Name"].ToString() == item["Customer_Name"].ToString()).ToList();
                                foreach (DataRow drt in dtDistinct.Rows)
                                {
                                    // var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString() && s["Customer_Name"] == item["Customer_Name"].ToString()).ToArray();
                                    var categoryUnicList = categoryList.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append(categoryUnicList[0]["Listed_doctor_Count"].ToString());
                                        tableContent.Append("</td>");

                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }

                                tableContent.Append("</tr>");
                            }
                            // tableContent.Append(drFilter.Length);
                            //totalCount += Convert.ToInt32(drFilter.Length);
                        }
                        tableContent.Append("</td>");
                    }

                    else if (userSelection.ToUpper() == "THRICE")
                    {
                        //  drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Listed_doctor_Count"].ToString() == "3").ToArray();
                        drFilter = ds.Tables[3].AsEnumerable().Where(c => c["doctor_Count"].ToString() == "3").ToArray();
                        //tableContent.Append("<tr>");
                        //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                        //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                        //tableContent.Append("</td>");
                        //tableContent.Append("</tr>");

                        if (drFilter.Length > 0)
                        {
                            foreach (var item in drFilter)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
                                //tableContent.Append("<td align='left' width='15%'>");
                                //tableContent.Append(item["Category_Name"].ToString());
                                //tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Speciality_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Local_Area"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Hospital_Name"].ToString());
                                tableContent.Append("</td>");
                                var categoryList = ds.Tables[2].AsEnumerable().Where(s => s["Customer_Name"].ToString() == item["Customer_Name"].ToString()).ToList();
                                foreach (DataRow drt in dtDistinct.Rows)
                                {
                                    // var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString() && s["Customer_Name"] == item["Customer_Name"].ToString()).ToArray();
                                    var categoryUnicList = categoryList.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append(categoryUnicList[0]["Listed_doctor_Count"].ToString());
                                        tableContent.Append("</td>");

                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }

                                tableContent.Append("</tr>");
                                // tableContent.Append(drFilter.Length);

                            }
                            totalCount += Convert.ToInt32(drFilter.Length);

                        }

                    }
                    else if (userSelection.ToUpper() == "MORETHRICE")
                    {
                        // drFilter = ds.Tables[2].AsEnumerable().Where(c => Convert.ToInt32(c["Listed_doctor_Count"]) > 3).ToArray();
                        drFilter = ds.Tables[3].AsEnumerable().Where(c => Convert.ToInt32(c["doctor_Count"]) > 3).ToArray();

                        //tableContent.Append("<tr>");
                        //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                        //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                        //tableContent.Append("</td>");
                        //tableContent.Append("</tr>");

                        if (drFilter.Length > 0)
                        {
                            foreach (var item in drFilter)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
                                //tableContent.Append("<td align='left' width='15%'>");
                                //tableContent.Append(item["Category_Name"].ToString());
                                //tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Speciality_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Local_Area"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Hospital_Name"].ToString());
                                tableContent.Append("</td>");
                                var categoryList = ds.Tables[2].AsEnumerable().Where(s => s["Customer_Name"].ToString() == item["Customer_Name"].ToString()).ToList();
                                foreach (DataRow drt in dtDistinct.Rows)
                                {
                                    // var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString() && s["Customer_Name"] == item["Customer_Name"].ToString()).ToArray();
                                    var categoryUnicList = categoryList.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append(categoryUnicList[0]["Listed_doctor_Count"].ToString());
                                        tableContent.Append("</td>");

                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }

                                tableContent.Append("</tr>");
                                // tableContent.Append(drFilter.Length);

                            }
                            // tableContent.Append(drFilter.Length);
                            // totalCount += Convert.ToInt32(drFilter.Length);
                        }

                    }

                    else if (userSelection.ToUpper() == "DOCTORMET")
                    {
                        foreach (DataRow dr in dtDistinctCustome.Rows)
                        {
                            // drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Customer_Name"].ToString() == dr["Customer_Name"].ToString()).ToArray();
                            //  tableContent.Append("<td align='left' width='15%'>");
                            //tableContent.Append("<tr>");
                            //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                            //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                            //tableContent.Append("</td>");
                            //tableContent.Append("</tr>");
                            // if (drFilter.Length > 0)
                            //  {
                            // foreach (var item in drFilter)
                            //  {
                            var categoryList = ds.Tables[2].AsEnumerable().Where(s => s["Customer_Name"].ToString() == dr["Customer_Name"].ToString()).ToArray();

                            //foreach (var item in categoryList)
                            //{


                            tableContent.Append("<tr>");
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(categoryList[0]["Customer_Name"].ToString() + "" + categoryList[0]["Sur_Name"].ToString());
                            tableContent.Append("</td>");
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(categoryList[0]["MDL_Number"].ToString());
                            tableContent.Append("</td>");
                            //tableContent.Append("<td align='left' width='15%'>");
                            //tableContent.Append(item["Category_Name"].ToString());
                            //tableContent.Append("</td>");
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(categoryList[0]["Speciality_Name"].ToString());
                            tableContent.Append("</td>");
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(categoryList[0]["Local_Area"].ToString());
                            tableContent.Append("</td>");
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(categoryList[0]["Hospital_Name"].ToString());
                            tableContent.Append("</td>");

                            foreach (DataRow drt in dtDistinct.Rows)
                            {

                                var List = categoryList.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToArray();

                                if (List.Length > 0 && List != null)
                                {
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(List[0]["Listed_doctor_Count"].ToString());
                                    tableContent.Append("</td>");

                                }
                                else
                                {
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append("");
                                    tableContent.Append("</td>");
                                }

                            }
                            tableContent.Append("</tr>");
                            // tableContent.Append(drFilter.Length);
                            //  }
                            // }
                            // tableContent.Append(drFilter.Length);
                            // totalCount += Convert.ToInt32(drFilter.Length);
                            // }
                        }
                        // tableContent.Append("</td>");
                    }
                    else if (userSelection.ToUpper() == "DOCTORMADE")
                    {
                        tableContent.Append("<td align='left' width='15%'>");
                        foreach (DataRow dr in dtDistinct.Rows)
                        {
                            drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Category"].ToString() == dr["Category"].ToString()).ToArray();

                            //tableContent.Append("<tr>");
                            //tableContent.Append("<td colspan='6' style='font-weight:bold;background-color:darkgrey'  align='left' width='15%'>");
                            //tableContent.Append(dr["Category_Name"].ToString() + "(" + drFilter.Length + ")");
                            //tableContent.Append("</td>");
                            //tableContent.Append("</tr>");
                            if (drFilter.Length > 0)
                            {
                                foreach (var item in drFilter)
                                {

                                    tableContent.Append("<tr>");
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
                                    tableContent.Append("</td>");
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(item["MDL_Number"].ToString());
                                    tableContent.Append("</td>");
                                    //tableContent.Append("<td align='left' width='15%'>");
                                    //tableContent.Append(item["Category_Name"].ToString());
                                    //tableContent.Append("</td>");
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(item["Speciality_Name"].ToString());
                                    tableContent.Append("</td>");
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(item["Local_Area"].ToString());
                                    tableContent.Append("</td>");
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append(item["Hospital_Name"].ToString());
                                    tableContent.Append("</td>");
                                    foreach (DataRow drt in dtDistinct.Rows)
                                    {
                                        var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == drt["Category"].ToString()).ToArray();
                                        if (categoryList.Length > 0 && categoryList != null)
                                        {
                                            tableContent.Append("<td align='left' width='15%'>");
                                            tableContent.Append(categoryList[0]["Listed_doctor_Count"].ToString());
                                            tableContent.Append("</td>");

                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='left' width='15%'>");
                                            tableContent.Append("");
                                            tableContent.Append("</td>");
                                        }
                                    }

                                    tableContent.Append("</tr>");
                                    // tableContent.Append(drFilter.Length);

                                }
                                sum = drFilter.Sum(row => row.Field<int>("Listed_doctor_Count"));
                                // tableContent.Append(sum);
                                totalCount += sum;


                            }
                            tableContent.Append("</td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='left' width='15%'>");
                        tableContent.Append("</td>");
                    }
                    tableContent.Append("</tr>");

                    //   }
                    //tableContent.Append("<tr>");
                    //tableContent.Append("<td colspan='2' align='right'>Total</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(totalCount);
                    //tableContent.Append("</td></tr>");

                }
                tableContent.Append("</tbody></table>");
            }
            else
            {
                tableContent.Append("No data found ");
            }
            return tableContent.ToString();
        }


        //public string GetLastSubmittedTableSub(DataSet ds, string userSelection)
        //{

        //    DataRow[] drFilter;
        //    StringBuilder tableContent = new StringBuilder();
        //    string divisionName = string.Empty;
        //    if (ds.Tables[0].Rows.Count > 0)
        //    {
        //        DataTable dtUserInfo = ds.Tables[0];
        //        tableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedSub' class='data display datatable' >");
        //        tableContent.Append("<thead><tr>");
        //        tableContent.Append("<th align='left' width='15%'>User Name</th>");
        //        tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
        //        tableContent.Append("<th align='left' width='15%'>Employee No.</th>");
        //        tableContent.Append("<th align='left' width='15%'>Region Name</th>");
        //        tableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
        //        tableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
        //        tableContent.Append("<th align='left' width='15%'>Division Name</th>");
        //        tableContent.Append("<th align='left' width='15%'>Employee Mobile No.</th></tr>");


        //        tableContent.Append("<tr><td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["User_Name"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Employee_Name"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Employee_Number"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Region_Name"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Manager_Name"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Manager_Region_Name"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("<td align='left' width='15%'>");

        //        divisionName = "";
        //        if (ds.Tables[1].Rows.Count > 0)
        //        {
        //            foreach (DataRow dr in ds.Tables[1].Rows)
        //            {
        //                divisionName += dr["Division_Name"].ToString() + ",";
        //            }
        //        }

        //        if (!string.IsNullOrEmpty(divisionName))
        //        {
        //            divisionName = divisionName.TrimEnd(',');
        //        }
        //        tableContent.Append(divisionName);
        //        tableContent.Append("</td>");

        //        tableContent.Append("<td align='left' width='15%'>");
        //        tableContent.Append(dtUserInfo.Rows[0]["Mobile"].ToString());
        //        tableContent.Append("</td>");
        //        tableContent.Append("</tr></thead></table>");


        //        //int sNo = 0;
        //        int doctorMade = 0;
        //        string[] TobeDistinct = { "Category", "Category_Name" };
        //        DataTable dtDistinct = GetDistinctRecords(ds.Tables[2], TobeDistinct);
        //        string title = GetSelectionType(userSelection);
        //        string visitCount = GetSelectionType(userSelection);
        //        int totalCount = 0;

        //        tableContent.Append("<div>" + title.Split('_')[0] + "</div>");
        //        tableContent.Append("<table class='data display datatable'><thead><tr>");
        //        // tableContent.Append("<th align='left' width='15%'>S.No</th>");
        //        tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
        //        tableContent.Append("<th align='left' width='15%'>MDL No</th>");
        //        tableContent.Append("<th align='left' width='15%'>Category</th>");
        //        tableContent.Append("<th align='left' width='15%'>Specialtity</th>");
        //        tableContent.Append("<th align='left' width='15%'>Local Area</th>");
        //        tableContent.Append("<th align='left' width='15%'>Hospital Name</th>");
        //        for (var i = 0; i < ds.Tables[2].Rows.Count; i++)
        //        {
        //            tableContent.Append("<th align='center' width='15%'>" + ds.Tables[2].Rows[i]["Category_Name"].ToString() + "</th>");
        //        }

        //        tableContent.Append("</tr></thead><tbody>");

        //        drFilter = ds.Tables[2].AsEnumerable().Where(c => c["Listed_doctor_Count"].ToString() == "2").ToArray();
        //        tableContent.Append("</tr>");
        //        if (drFilter.Length > 0)
        //        {
        //            foreach (var item in drFilter)
        //            {
        //                tableContent.Append("<tr>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["Customer_Name"].ToString() + "" + item["Sur_Name"].ToString());
        //                tableContent.Append("</td>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["MDL_Number"].ToString());
        //                tableContent.Append("</td>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["Category_Name"].ToString());
        //                tableContent.Append("</td>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["Speciality_Name"].ToString());
        //                tableContent.Append("</td>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["Local_Area"].ToString());
        //                tableContent.Append("</td>");
        //                tableContent.Append("<td align='left' width='15%'>");
        //                tableContent.Append(item["Hospital_Name"].ToString());
        //                tableContent.Append("</td>");
        //                //bind category
        //                for (var i = 0; i < ds.Tables[2].Rows.Count; i++)
        //                {
        //                    var categoryList = drFilter.AsEnumerable().Where(s => s["Category"].ToString() == ds.Tables[2].Rows[i]["Category"].ToString() && s["Customer_Name"] == item["Customer_Name"].ToString()).ToArray();
        //                    if (categoryList.Length > 0 && categoryList != null)
        //                    {
        //                        tableContent.Append("<td align='left' width='15%'>");
        //                        tableContent.Append(categoryList[0]["Listed_doctor_Count"].ToString());
        //                        tableContent.Append("</td>");

        //                    }
        //                    else
        //                    {
        //                        tableContent.Append("<td align='left' width='15%'>");
        //                        tableContent.Append("");
        //                        tableContent.Append("</td>");
        //                    }
        //                }


        //                tableContent.Append("</tr>");
        //            }

        //        }
        //        tableContent.Append("</td>");


        //        tableContent.Append("</tbody></table>");
        //    }
        //    else
        //    {
        //        tableContent.Append("No data found ");
        //    }
        //    return tableContent.ToString();
        //}




        public static DataTable GetDistinctRecords(DataTable dt, string[] Columns)
        {
            DataTable dtUniqRecords = new DataTable();
            dtUniqRecords = dt.DefaultView.ToTable(true, Columns);
            return dtUniqRecords;
        }

        public string GetSelectionType(string Type)
        {
            string titleName = "";
            switch (Type)
            {
                case "MISSED":
                    titleName = "Missed Doctor Count";
                    break;
                case "ONCE":
                    titleName = "Doctor Count Visted Once.";
                    break;
                case "TWICE":
                    titleName = "Doctor Count Visted twice";
                    break;
                case "THRICE":
                    titleName = "Doctor Count Visted thrice";
                    break;
                case "MORETHAN":
                    titleName = " More than thrice Doctor Count";
                    break;
                case "DOCTORMET":
                    titleName = "Doctor Met Count";
                    break;
                case "DOCTORMADE":
                    titleName = "Doctor Made Count";
                    break;
            }
            return titleName;
        }

        public string GetLastsubmittedLeaveSub(string comapnyCode, string userCode, string startDate, string endDate, string leaveTypeCode, string leaveTypeName, string regionCode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetLastsubmittedLeaveSub(comapnyCode, userCode, leaveTypeCode, startDate, endDate, regionCode);
            return GetLastSubmittedLeaveTableSub(ds, leaveTypeName);
        }
        public string GetLastsubmittedLeaveSubRPT(string comapnyCode, string userCode, string startDate, string endDate, string leaveTypeCode, string leaveTypeName, string regionCode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetLastsubmittedLeaveSubRPT(comapnyCode, userCode, leaveTypeCode, startDate, endDate, regionCode);
            return GetLastSubmittedLeaveTableSub(ds, leaveTypeName);
        }
        public string GetLastSubmittedLeaveTableSub(DataSet ds, string leaveTypeName)
        {
            DataRow[] drFilter;
            StringBuilder tableContent = new StringBuilder();
            string divisionName = string.Empty;
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtUserInfo = ds.Tables[0];
                tableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedSub' class='data display datatable' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["User_Name"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Employee No.</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Employee_Number"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Region Name</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Region_Name"].ToString());
                tableContent.Append("</th></tr>");


                tableContent.Append("<tr><th align='left' width='15%'>Reporting Manager</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Manager_Region_Name"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Mobile No.</th>");
                tableContent.Append("<th align='left' width='15%'>");
                tableContent.Append(dtUserInfo.Rows[0]["Mobile"].ToString());
                tableContent.Append("</th>");
                tableContent.Append("<th align='left' width='15%'>Division Name</th>");
                tableContent.Append("<th align='left' width='15%'>");

                divisionName = "";
                string style = "";
                if (ds.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        divisionName += dr["Division_Name"].ToString() + ",";
                    }
                }

                if (!string.IsNullOrEmpty(divisionName))
                {
                    divisionName = divisionName.TrimEnd(',');
                }
                tableContent.Append(divisionName);
                tableContent.Append("</th></tr></thead></table></br>");
                tableContent.Append("<div><b> Leave Type Name - " + leaveTypeName + "</b></div>");
                if (ds.Tables[2].Rows.Count > 0)
                {
                    tableContent.Append("<table class='data display datatable'><thead><tr>");
                    tableContent.Append("<th align='left' width='15%'>Leave Date</th>");
                    tableContent.Append("<th align='left' width='15%'>Reason</th></tr></thead><tbody>");

                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        tableContent.Append("<tr><td  align='left' width='15%' >" + ds.Tables[2].Rows[i]["DCR_Actual_Date"].ToString() + "</td>");
                        tableContent.Append("<td  align='left' width='15%'>" + ds.Tables[2].Rows[i]["Reason"].ToString() + "</td>");
                        tableContent.Append("</tr>");
                    }
                    tableContent.Append("</tbody></table>");
                }
                else
                {
                    tableContent.Append("<span>No Leave Details found</span>");
                }
            }
            else
            {
                tableContent.Append("<span>No data found</span>");
            }
            return tableContent.ToString();
        }
        public DataSet GetBrandAnalysisReport(string companyCode, string userCode, string month, string year, string dcrStatus)
        {
            return _objDoctorVisit.GetBrandAnalysisReport(companyCode, userCode, month, year, dcrStatus);
        }

        public DataSet GetDoctorVisitAnalysisSpecialityWiseReport(string companyCode, string userCode, int month, int year, string mode)
        {
            return _objDoctorVisit.GetDoctorVisitAnalysisSpecialityWiseReport(companyCode, userCode, month, year, mode);
        }
        public DataSet GetDoctorVisitAnalysisSpecialityWiseReportPopUp(string companyCode, string userCode, string regionCode, int month, int year, string specialityCode, string categoryCode, string mode)
        {
            return _objDoctorVisit.GetDoctorVisitAnalysisSpecialityWiseReportPopUp(companyCode, userCode, regionCode, month, year, specialityCode, categoryCode, mode);
        }
        public DataSet GetRegionTypes(string companyCode, string regionCode)
        {
            return _objDoctorVisit.GetRegionTypes(companyCode, regionCode);
        }
        public DataSet GetChildRegionNameAndChildUserType(string companyCode, string regionCode, string regionTypeCode, string userCode)
        {
            return _objDoctorVisit.GetChildRegionNameAndChildUserType(companyCode, regionCode, regionTypeCode, userCode);
        }
        public string GetBrandSummaryReport(string companyCode, string regionCodes, string userTypeCode, string dcrStatus, string month, string year, string userTypeName, string reportMonth, string reportName)
        {
            DataSet ds = new DataSet();
            ds = _objDoctorVisit.GetBrandSummaryReport(companyCode, regionCodes, userTypeCode, dcrStatus, month, year);
            return BindBrandAnalysisSummaryReport(ds, userTypeName, reportMonth, reportName, year);
        }
        public string BindBrandAnalysisSummaryReport(DataSet ds, string userTypeName, string reportMonth, string reportName, string year)
        {
            StringBuilder sbTableContent = new StringBuilder();
            string blobUrl = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && ds.Tables[0] != null)
            {

                sbTableContent.Append("<div><b> " + reportName + " for the month of " + reportMonth + "</b></div>");
                sbTableContent.Append("<div>* System is showing historical hierarchy position as of " + reportMonth + " and not the current hierarchy position </div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblBrandSummary Report'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th align='left' width='15%'>User Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>User Type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Region type</th>");
                sbTableContent.Append("<th align='left' width='15%'>User Status</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 1 Manager Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 1 Manager User Type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 1 Manager Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 1 Manager Region type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 2 Manager Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 2 Manager User Type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 2 Manager Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 2 Manager Region type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 3 Manager Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 3 Manager User Type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 3 Manager Region Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Line 3 Manager Region type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Work Category</th>");
                sbTableContent.Append("<th align='left' width='15%'>Product Name</th>");
                sbTableContent.Append("<th align='left' width='15%'>Product type</th>");
                sbTableContent.Append("<th align='left' width='15%'>Brand</th>");
                sbTableContent.Append("<th align='left' width='15%'>Qty</th>");
                sbTableContent.Append("</tr></thead>");
                sbTableContent.Append("<tbody>");

                DataTable dt = ds.Tables[0];
                foreach (DataRow drs in dt.Rows)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["User_Status"].ToString());
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line1_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line1_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["line1_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line1_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line2_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line2_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["line2_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line2_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line3_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line3_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["line3_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Line3_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Category"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Product_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Product_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Brand_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drs["Qty"].ToString());
                    sbTableContent.Append("</td></tr>");
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                CurrentInfo _objCurInfo = new CurrentInfo();
                string userName = _objCurInfo.GetUserName();
                string Domain = _objCurInfo.GetSubDomain();
                string fileName = reportName + "_" + Domain + "_" + reportMonth + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
            }
            else
            {
                blobUrl = "";
            }
            return blobUrl;
        }


        public IEnumerable<MVCModels.DCRDoctorVisitModel> GetDCRDoctorsByUserName(string companyCode, string dcrStatus,
                    string userNames, string startDate, string endDate)
        {
            return _objDoctorVisit.GetDCRDoctorsByUserName(companyCode, dcrStatus, userNames, startDate, endDate);
        }
        public IEnumerable<MVCModels.DCRHeaderModel> GetDCRHeaderByStatusAndDate(string companyCode, string dcrStatus,
                    string userCode, string startDate, string endDate)
        {
            return _objDoctorVisit.GetDCRHeaderByStatusAndDate(companyCode, dcrStatus,
                     userCode, startDate, endDate);
        }

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorVisitHourlyReport(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            return _objDoctorVisit.GetDoctorVisitHourlyReport(companyCode, userCode, DcrFromDate, DcrEndDate);
        }

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorProfile(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            return _objDoctorVisit.GetDoctorProfile(companyCode, userCode, DcrFromDate, DcrEndDate);
        }

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorAddress(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            return _objDoctorVisit.GetDoctorAddress(companyCode, userCode, DcrFromDate, DcrEndDate);
        }

    }
}
