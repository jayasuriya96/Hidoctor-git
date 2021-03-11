using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using System.Collections;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    public class ExpenseController : Controller
    {
        //
        // GET: /Expense/

        public ActionResult Index()
        {
            return View();
        }

        public string GetExpenseAnalysisReportNG(string userCode, string startDate, string endDate)
        {
            StringBuilder strTblContent = new StringBuilder();
            StringBuilder strMainTblContent = new StringBuilder();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLExpense _objBLExpense = new DataControl.BLExpense();
            DataSet ds = new DataSet();
            int intTblCount = 0;
            string strTableId = string.Empty;
            string strImgId = string.Empty;
            double dblEligAmount = 0.0;
            double dblEnteredAmt = 0.0;
            double dblTotalExpense = 0.0;
            string eligAmount = "";
            StringBuilder strUserInfo = new StringBuilder();
            ds = _objBLExpense.GetExpenseAnalysisReportNG(_objCurInfo.GetCompanyCode(), userCode, startDate, endDate);
            if (ds.Tables.Count > 0)
            {
                //User Info
                if (ds.Tables[3].Rows.Count > 0)
                {
                    strUserInfo.Append("<table id='tblUserInfo' cellspacing=0 cellpadding=0 width='100%'>");
                    strUserInfo.Append("<tr><td colspan=4><div id='dvReportPeriod'>Expense Analysis Report of " +
                        ds.Tables[3].Rows[0]["User_Name"].ToString() + " for the period ");
                    strUserInfo.Append("" + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " to ");
                    strUserInfo.Append("" + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + " </div></td></tr>");
                    strUserInfo.Append("<tr><td colspan=4 align='right'><div style='width:100%;float:left;'><img style='display: inline;' id='imgClient' ></div></td></tr>");
                    strUserInfo.Append("<tr><td>Company Name </td><td> : " + ds.Tables[3].Rows[0]["Company_Name"].ToString() + "</td>");
                    strUserInfo.Append("<td>Region Name </td><td> : " + ds.Tables[3].Rows[0]["Region_Name"].ToString() + "</td></tr>");
                    strUserInfo.Append("<tr><td>Employee Name </td><td > : " + ds.Tables[3].Rows[0]["Employee_Name"].ToString() + "(" +
                        ds.Tables[3].Rows[0]["Employee_Number"].ToString() + ")</td>");
                    if (string.IsNullOrEmpty(ds.Tables[3].Rows[0]["Date_of_Joining"].ToString()))
                    {
                        strUserInfo.Append("<td> Date of Joining </td><td > : Not Available</td></tr>");
                    }
                    else
                    {
                        strUserInfo.Append("<td> Date of Joining </td><td > : " + ds.Tables[3].Rows[0]["Date_of_Joining"].ToString() + "</td></tr>");
                    }
                    strUserInfo.Append("<tr><td>User Name </td><td> : " + ds.Tables[3].Rows[0]["User_Name"].ToString() + "</td>");
                    strUserInfo.Append("<td>Designation </td><td > : " + ds.Tables[3].Rows[0]["User_Type_Name"].ToString() + "</td></tr>");
                    StringBuilder strDivision = new StringBuilder();
                    if (ds.Tables.Count > 4)
                    {
                        for (var j = 0; j < ds.Tables[5].Rows.Count; j++)
                        {
                            strDivision.Append(ds.Tables[5].Rows[j]["Division_Name"].ToString() + ",");
                        }
                    }
                    if (string.IsNullOrEmpty(strDivision.ToString()))
                    {
                        strUserInfo.Append("<tr><td>Division Name </td><td > : Not Available</td>");
                    }
                    else
                    {
                        strUserInfo.Append("<tr><td>Division Name </td><td > : " + strDivision.ToString().TrimEnd(',') + "</td>");
                    }
                    if (string.IsNullOrEmpty(ds.Tables[3].Rows[0]["ICICI_Account_Number"].ToString()))
                    {
                        strUserInfo.Append("<td>Bank Account No </td><td> : Not Available</td></tr>");
                    }
                    else
                    {
                        strUserInfo.Append("<td>Bank Account No </td><td> : " + ds.Tables[3].Rows[0]["ICICI_Account_Number"].ToString() + "</td></tr>");
                    }
                    if (string.IsNullOrEmpty(ds.Tables[3].Rows[0]["Under_User_Name"].ToString()))
                    {
                        strUserInfo.Append("<tr><td>Reporting Manager Name </td><td> : Not Available (");
                    }
                    else
                    {
                        strUserInfo.Append("<tr><td>Reporting Manager Name </td><td> : " + ds.Tables[3].Rows[0]["Under_User_Name"].ToString() + "(");
                    }
                    if (string.IsNullOrEmpty(ds.Tables[3].Rows[0]["Reporting_Employee_Number"].ToString()))
                    {
                        strUserInfo.Append("Not Available</td>");
                    }
                    else
                    {
                        strUserInfo.Append(ds.Tables[3].Rows[0]["Reporting_Employee_Number"].ToString() + ")</td>");
                    }
                    if (string.IsNullOrEmpty(ds.Tables[3].Rows[0]["Mobile"].ToString()))
                    {
                        strUserInfo.Append("<td>Emp Mobile No</td><td > :Not Available</td></tr></table></br>");
                    }
                    else
                    {
                        strUserInfo.Append("<td>Emp Mobile No</td><td > : " + ds.Tables[3].Rows[0]["Mobile"].ToString() + "</td></tr></table></br>");
                    }
                }
                int includeExpenseChart = 0;
                if (ds.Tables[0].Rows.Count > 0)
                {
                    includeExpenseChart = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
                    if (includeExpenseChart == 0)
                    {
                        DataTable dtExpenseMode = new DataTable();
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            dtExpenseMode = ds.Tables[1].DefaultView.ToTable(true, "Expense_Mode");
                            if (dtExpenseMode.Rows.Count > 0)
                            {
                                foreach (DataRow dr in ds.Tables[1].Rows)
                                {
                                    if (!string.IsNullOrEmpty(dr["Expense_Amount"].ToString().Trim()))
                                    {
                                        dblTotalExpense += Convert.ToDouble(dr["Expense_Amount"].ToString().Trim());
                                    }
                                }
                                strMainTblContent.Append("<table border='0' cellspacing='0' cellpadding='0' style='width:100%;'>");
                                strMainTblContent.Append("<tr><td><div id='dvNetTotal'>");
                                strMainTblContent.Append("TOTAL EXPENSE AMOUNT IS " + dblTotalExpense.ToString("N2") + "</div></br></td></tr>");
                                strMainTblContent.Append("<tr><td align='right' valign='top' width='100%'><table id='tbl_" +
                                    intTblCount.ToString() + "' border='0' cellspacing='0' cellpadding='0'   width='100%'>");
                                foreach (DataRow dr in dtExpenseMode.Rows)
                                {
                                    DataRow[] rowFilter;
                                    double dblExpence = 0.0;
                                    strTblContent.Clear();
                                    strTblContent.Append("<table id='" + strTableId + "' cellspacing='0' cellpadding='0' class='data display datatable clsExpense'>");
                                    // strTblContent.Append("<tr><td>" + dr["Expense_Mode"].ToString().Trim().ToUpper() + " Expense Details : </td></tr>");
                                    strTblContent.Append("<tr><td class='tdHeader'>DCR Date</td><td class='tdHeader'>DCR Type</td><td class='tdHeader'>DCR Status</td>");
                                    strTblContent.Append("<td class='tdHeader'>Category</td><td class='tdHeader'>Place Worked</td><td class='tdHeader'>Place From</td>");
                                    strTblContent.Append("<td class='tdHeader'>Place To</td><td class='tdHeader'  style='width:4% !important;'>Travel Mode</td>");
                                    strTblContent.Append("<td class='tdHeader' style='width:4% !important;'>Distance</td>");
                                    strTblContent.Append("<td class='tdHeader'>Expense Type</td><td class='tdHeader'  style='width:4% !important;'>Expense Amount</td>");
                                    strTblContent.Append("<td class='tdHeader'>Remarks</td></tr>");
                                    rowFilter = ds.Tables[1].AsEnumerable().Where(d => d["Expense_Mode"].ToString().Trim().ToUpper() ==
                                                                                           dr["Expense_Mode"].ToString().Trim().ToUpper()).ToArray();
                                    for (int k = 0; k < rowFilter.Length; k++)
                                    {

                                        DataRow[] rowfilterHop;
                                        eligAmount = rowFilter[k]["Expense_Amount"].ToString().Trim();
                                        dblEligAmount = 0.0;
                                        dblEnteredAmt = 0.0;
                                        rowfilterHop = ds.Tables[2].AsEnumerable().Where(z => z["DCR_Actual_Date"].ToString() == rowFilter[k]["DCR_Date"].ToString() && z["DCR_HOP_Flag"].ToString() == rowFilter[k]["Flag"].ToString()).ToArray();
                                        if (rowfilterHop.Length > 0 && rowFilter[k]["Category"].ToString().Trim().ToUpper() != "HQ")
                                        {
                                            strTblContent.Append("<tr>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["DCR_Date"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["DCR_Flag"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Status"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Category"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Place_Worked"].ToString() + "</td>");
                                            for (int index = 0; index < rowfilterHop.Length; index++)
                                            {
                                                string fromPlace = string.Empty;
                                                string toPlace = string.Empty;

                                                if (rowfilterHop[index]["Route_Way"].ToString().Trim().ToUpper() == "R")
                                                {
                                                    fromPlace = rowfilterHop[index]["Place_To"].ToString().Trim();
                                                    toPlace = rowfilterHop[index]["From_Place"].ToString().Trim();

                                                }
                                                else
                                                {
                                                    fromPlace = rowfilterHop[index]["From_Place"].ToString().Trim();
                                                    toPlace = rowfilterHop[index]["Place_To"].ToString().Trim();
                                                }
                                                // END: SFC Changes, Added by Michael.
                                                strTblContent.Append("<td>" + fromPlace + "</td>");
                                                strTblContent.Append("<td>" + toPlace + "</td>");
                                                strTblContent.Append("<td>" + rowfilterHop[index].ItemArray[4] + "</td>");
                                                if (index == 0)
                                                {
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" + rowFilter[k]["Distance"].ToString() + "</td>");
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" +
                                                                        rowFilter[k]["Expense_Type_Name"].ToString() + "</td>");
                                                    if (!string.IsNullOrEmpty(rowFilter[k]["Eligibility_Amount"].ToString()))
                                                    {
                                                        if (rowFilter[k]["Eligibility_Amount"].ToString() != "0.00")
                                                        {
                                                            double eliAmt = double.Parse(rowFilter[k]["Eligibility_Amount"].ToString());
                                                            if (eliAmt < double.Parse(eligAmount))
                                                            {
                                                                strTblContent.Append("<td style='color:red;text-align:right;' rowspan='" +
                                                                                rowfilterHop.Length.ToString() + "'>" + eligAmount + "(" + eliAmt + ")</td>");
                                                            }
                                                            else
                                                            {
                                                                strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" +
                                                                                       eligAmount + "</td>");
                                                            }
                                                        }
                                                        else
                                                        {
                                                            strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" + eligAmount + "</td>");
                                                        }
                                                    }
                                                    else
                                                    {
                                                        strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" + eligAmount + "</td>");
                                                    }
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" +
                                                                               rowFilter[k]["Expense_Remarks"].ToString() + "</td>");
                                                    strTblContent.Append("</tr >");
                                                }
                                                else
                                                {
                                                    strTblContent.Append("</tr>");
                                                }
                                            }
                                            dblExpence += Convert.ToDouble(rowFilter[k]["Expense_Amount"].ToString());
                                        }
                                        else
                                        {
                                            strTblContent.Append("<tr>");
                                            strTblContent.Append("<td>" + rowFilter[k]["DCR_Date"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["DCR_Flag"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Status"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Category"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Place_Worked"].ToString() + "</td>");
                                            string fromPlace = string.Empty;
                                            string toPlace = string.Empty;
                                            if (rowFilter[k]["Route_Way"].ToString().Trim().ToUpper() == "R")
                                            {
                                                fromPlace = rowFilter[k]["Place_To"].ToString().Trim();
                                                toPlace = rowFilter[k]["From_Place"].ToString().Trim();
                                            }
                                            else
                                            {
                                                fromPlace = rowFilter[k]["From_Place"].ToString().Trim();
                                                toPlace = rowFilter[k]["Place_To"].ToString().Trim();
                                            }
                                            strTblContent.Append("<td>" + fromPlace + "</td>");
                                            strTblContent.Append("<td>" + toPlace + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Travel_Mode"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Distance"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Expense_Type_Name"].ToString() + "</td>");
                                            if (!string.IsNullOrEmpty(rowFilter[k]["Eligibility_Amount"].ToString()))
                                            {
                                                if (rowFilter[k]["Eligibility_Amount"].ToString() != "0.00")
                                                {
                                                    double eliAmt = double.Parse(rowFilter[k]["Eligibility_Amount"].ToString());
                                                    if (eliAmt < double.Parse(eligAmount))
                                                    {
                                                        strTblContent.Append("<td style='color:red;text-align:right;'>" + eligAmount + "(" + eliAmt + ")</td>");
                                                    }
                                                    else
                                                    {
                                                        strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                                    }
                                                }
                                                else
                                                {
                                                    strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                                }
                                            }
                                            else
                                            {
                                                strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                            }
                                            strTblContent.Append("<td>" + rowFilter[k]["Expense_Remarks"].ToString() + "</td>");
                                            strTblContent.Append("</tr>");
                                            dblExpence += Convert.ToDouble(rowFilter[k]["Expense_Amount"].ToString());
                                        }
                                    }
                                    strTblContent.Append("<tr class='Font'><td colspan=11 style='text-align:right;font-weight:bold'>Grand Total of " + dr["Expense_Mode"].ToString() + " expense:</td>");
                                    strTblContent.Append("<td style='text-align:left;font-weight:bold'>Rs." + dblExpence.ToString("N2") + "/-</td></tr>");
                                    strTblContent.Append("</table></br>");

                                    strMainTblContent.Append("<tr><td style='font-weight:bold;text-align:left;'>");
                                    strMainTblContent.Append("TOTAL " + dr["Expense_Mode"].ToString().ToUpper() + " EXPENSE : Rs." + dblExpence.ToString("N2"));
                                    strMainTblContent.Append("</td></tr>");
                                    strMainTblContent.Append("<tr><td style='font-weight:bold;text-align:left;'>");
                                    strMainTblContent.Append(dr["Expense_Mode"].ToString().ToUpper() + " EXPENSE DETAILS : </td></tr>");
                                    strMainTblContent.Append("<tr><td align='left' valign='top'>");

                                    strMainTblContent.Append(strTblContent.ToString() + "</td></tr>");

                                }
                                strMainTblContent.Append("</table></br>");
                            }

                        }
                        else
                        {
                            strMainTblContent.Append("<div style='width:100%'>No expense details found</div>");
                        }
                    }
                    else
                    {
                        DataTable dtExpenseMode = new DataTable();
                        DataTable dtDisExpense = new DataTable();
                        DataSet dsFinalExpense = new DataSet();
                        DataTable dt = new DataTable();
                        dt.Columns.Add("DCR_Date", typeof(String));
                        dt.Columns.Add("Expense_Mode", typeof(String));
                        dt.Columns.Add("Place_Worked", typeof(String));
                        dt.Columns.Add("Category", typeof(String));
                        dt.Columns.Add("From_Place", typeof(String));
                        dt.Columns.Add("Place_To", typeof(String));
                        dt.Columns.Add("Travel_Mode", typeof(String));
                        dt.Columns.Add("Distance", typeof(String));
                        dt.Columns.Add("Expense_Type_Code", typeof(String));
                        dt.Columns.Add("Expense_Type_Name", typeof(String));
                        dt.Columns.Add("Expense_Amount", typeof(String));
                        dt.Columns.Add("DCR_Flag", typeof(String));
                        dt.Columns.Add("Flag", typeof(String));
                        dt.Columns.Add("Region_Code", typeof(String));
                        dt.Columns.Add("Region_Classification_Code", typeof(String));
                        dt.Columns.Add("Expense_Entity_Code", typeof(String));
                        dt.Columns.Add("Eligibility_Amount", typeof(String));
                        dt.Columns.Add("Status", typeof(String));
                        dt.Columns.Add("Expense_Remarks", typeof(String));
                        dt.Columns.Add("Route_Way", typeof(String));
                        dt.Columns.Add("DCR_Actual_Date", typeof(String));
                        dt.Columns.Add("DCR_Code", typeof(String));

                        dsFinalExpense.Tables.Add(dt);
                        dsFinalExpense.AcceptChanges();

                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            ArrayList alExpenceMode = new ArrayList();
                            alExpenceMode.Add("Daily");
                            alExpenceMode.Add("Monthly");
                            alExpenceMode.Add("Weekly");
                            alExpenceMode.Add("Fortnightly");
                            alExpenceMode.Add("Yearly");
                            //Get the distinct expense records
                            dtDisExpense = ds.Tables[1].DefaultView.ToTable(true, "DCR_Date", "Expense_Entity_Code", "DCR_Flag", "Expense_Type_Code");
                            if (dtDisExpense.Rows.Count > 0)
                            {
                                foreach (DataRow dr in dtDisExpense.Rows)
                                {
                                    DataRow[] drDisExp;
                                    drDisExp = ds.Tables[1].AsEnumerable().Where(a => a["DCR_Date"].ToString() == dr["DCR_Date"].ToString() &&
                                        a["Expense_Entity_Code"].ToString() == dr["Expense_Entity_Code"].ToString() &&
                                        a["DCR_Flag"].ToString() == dr["DCR_Flag"].ToString() &&
                                        a["Expense_Type_Code"].ToString() == dr["Expense_Type_Code"].ToString()).ToArray();
                                    bool blFlag = false;
                                    foreach (DataRow drPar in drDisExp)
                                    {
                                        int count = ds.Tables[4].Rows.Count;
                                        int loopCount = 0;
                                        while (count > loopCount)
                                        {
                                            string parentRegionCode = ds.Tables[4].Rows[Convert.ToInt32(count - loopCount) - 1]["Region_Code"].ToString();
                                            if (parentRegionCode == drPar["Region_Code"].ToString())
                                            {
                                                dsFinalExpense.Tables[0].ImportRow(drPar);
                                                blFlag = true;
                                                break;
                                            }
                                            loopCount = loopCount + 1;
                                        }
                                        if (blFlag)
                                        {
                                            break;
                                        }
                                    }
                                }
                            }
                            //  double dblTotalExpense=0.00;
                            foreach (DataRow dr in dsFinalExpense.Tables[0].Rows)
                            {
                                if (!string.IsNullOrEmpty(dr["Expense_Amount"].ToString().Trim()))
                                {
                                    dblTotalExpense += Convert.ToDouble(dr["Expense_Amount"].ToString().Trim());
                                }
                            }
                            strMainTblContent.Append("<table border='0' cellspacing='1' cellpadding='1' width='100%'>");
                            strMainTblContent.Append("<tr><td><div id='dvNetTotal'>");
                            strMainTblContent.Append("TOTAL EXPENSE AMOUNT IS " + dblTotalExpense.ToString("N2") + "</div></td></tr>");
                            strMainTblContent.Append("<tr><td align='right' valign='top' width='100%'><table  id='tbl_" + intTblCount.ToString() + "' border='0' cellspacing='0' cellpadding='0'                                                           width='100%'>");
                            DataRow[] rowFilter;
                            DataRow[] rowfilterHop;
                            for (int j = 0; j < alExpenceMode.Count; j++)
                            {
                                strTblContent.Clear();
                                intTblCount++;
                                strTableId = "tbl_" + intTblCount.ToString();
                                strImgId = "img" + intTblCount.ToString();

                                rowFilter = dsFinalExpense.Tables[0].AsEnumerable().Where(d => d["Expense_Mode"].ToString().Trim().ToUpper() ==
                                                                                                alExpenceMode[j].ToString().Trim().ToUpper()).ToArray();

                                double dblExpence = 0.0;

                                if (rowFilter.Length > 0)
                                {
                                    strTblContent.Append("<table width='100%' id='" + strTableId + "' cellspacing='0' cellpadding='0' class='data display datatable clsExpense'>");
                                    // strTblContent.Append("<tr><td>" + alExpenceMode[j].ToString().ToUpper() + " EXPENSE DETAILS : </td></tr>");
                                    strTblContent.Append("<tr><td class='tdHeader'>DCR Date</td><td class='tdHeader'>DCR Type</td><td class='tdHeader'>DCR Status</td>");
                                    strTblContent.Append("<td class='tdHeader'>Category</td><td class='tdHeader'>Place Worked</td><td class='tdHeader'>Place From</td>");
                                    strTblContent.Append("<td class='tdHeader'>Place To</td><td class='tdHeader'  style='width:4% !important;'>Travel Mode</td>");
                                    strTblContent.Append("<td class='tdHeader' style='width:4% !important;'>Distance</td>");
                                    strTblContent.Append("<td class='tdHeader'>Expense Type</td><td class='tdHeader'  style='width:4% !important;'>Expense Amount</td>");
                                    strTblContent.Append("<td class='tdHeader'>Remarks</td></tr>");
                                    for (int k = 0; k < rowFilter.Length; k++)
                                    {
                                        eligAmount = rowFilter[k]["Expense_Amount"].ToString().Trim();
                                        dblEligAmount = 0.0;
                                        dblEnteredAmt = 0.0;
                                        rowfilterHop = ds.Tables[2].AsEnumerable().Where(z => z["DCR_Actual_Date"].ToString() == rowFilter[k]["DCR_Date"].ToString()).ToArray();
                                        if (rowfilterHop.Length > 0 && rowFilter[k]["Category"].ToString().Trim().ToUpper() != "HQ")
                                        {
                                            strTblContent.Append("<tr>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["DCR_Date"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["DCR_Flag"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Status"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Category"].ToString() + "</td>");
                                            strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>");
                                            strTblContent.Append(rowFilter[k]["Place_Worked"].ToString() + "</td>");
                                            for (int index = 0; index < rowfilterHop.Length; index++)
                                            {
                                                string fromPlace = string.Empty;
                                                string toPlace = string.Empty;

                                                if (rowfilterHop[index]["Route_Way"].ToString().Trim().ToUpper() == "R")
                                                {
                                                    fromPlace = rowfilterHop[index]["Place_To"].ToString().Trim();
                                                    toPlace = rowfilterHop[index]["From_Place"].ToString().Trim();

                                                }
                                                else
                                                {
                                                    fromPlace = rowfilterHop[index]["From_Place"].ToString().Trim();
                                                    toPlace = rowfilterHop[index]["Place_To"].ToString().Trim();
                                                }
                                                // END: SFC Changes, Added by Michael.
                                                strTblContent.Append("<td>" + fromPlace + "</td>");
                                                strTblContent.Append("<td>" + toPlace + "</td>");
                                                strTblContent.Append("<td>" + rowfilterHop[index].ItemArray[4] + "</td>");
                                                if (index == 0)
                                                {
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" + rowFilter[k]["Distance"].ToString() + "</td>");
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" + rowFilter[k]["Expense_Type_Name"].ToString() + "</td>");
                                                    if (!string.IsNullOrEmpty(rowFilter[k]["Eligibility_Amount"].ToString()))
                                                    {
                                                        if (rowFilter[k]["Eligibility_Amount"].ToString() != "0.00")
                                                        {
                                                            double eliAmt = double.Parse(rowFilter[k]["Eligibility_Amount"].ToString());
                                                            if (eliAmt < double.Parse(eligAmount))
                                                            {
                                                                strTblContent.Append("<td style='color:red;text-align:right;' rowspan='" +
                                                                                rowfilterHop.Length.ToString() + "'>" + eligAmount + "(" + eliAmt + ")</td>");
                                                            }
                                                            else
                                                            {
                                                                strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" +
                                                                                       eligAmount + "</td>");
                                                            }
                                                        }
                                                        else
                                                        {
                                                            strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" + eligAmount + "</td>");
                                                        }
                                                    }
                                                    else
                                                    {
                                                        strTblContent.Append("<td style='text-align:right;' rowspan='" + rowfilterHop.Length.ToString() + "'>" + eligAmount + "</td>");
                                                    }
                                                    strTblContent.Append("<td rowspan='" + rowfilterHop.Length.ToString() + "'>" +
                                                                                rowFilter[k]["Expense_Remarks"].ToString() + "</td>");
                                                    strTblContent.Append("</tr >");
                                                }
                                                else
                                                {
                                                    strTblContent.Append("</tr>");
                                                }
                                            }
                                            dblExpence += Convert.ToDouble(rowFilter[k]["Expense_Amount"].ToString());
                                        }
                                        else
                                        {
                                            strTblContent.Append("<tr>");
                                            strTblContent.Append("<td>" + rowFilter[k]["DCR_Date"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["DCR_Flag"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Status"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Category"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Place_Worked"].ToString() + "</td>");
                                            string fromPlace = string.Empty;
                                            string toPlace = string.Empty;
                                            if (rowFilter[k]["Route_Way"].ToString().Trim().ToUpper() == "R")
                                            {
                                                fromPlace = rowFilter[k]["Place_To"].ToString().Trim();
                                                toPlace = rowFilter[k]["From_Place"].ToString().Trim();
                                            }
                                            else
                                            {
                                                fromPlace = rowFilter[k]["From_Place"].ToString().Trim();
                                                toPlace = rowFilter[k]["Place_To"].ToString().Trim();
                                            }
                                            strTblContent.Append("<td>" + fromPlace + "</td>");
                                            strTblContent.Append("<td>" + toPlace + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Travel_Mode"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Distance"].ToString() + "</td>");
                                            strTblContent.Append("<td>" + rowFilter[k]["Expense_Type_Name"].ToString() + "</td>");
                                            if (!string.IsNullOrEmpty(rowFilter[k]["Eligibility_Amount"].ToString()))
                                            {
                                                if (rowFilter[k]["Eligibility_Amount"].ToString() != "0.00")
                                                {
                                                    double eliAmt = double.Parse(rowFilter[k]["Eligibility_Amount"].ToString());
                                                    if (eliAmt < double.Parse(eligAmount))
                                                    {
                                                        strTblContent.Append("<td style='color:red;text-align:right;'>" + eligAmount + "(" + eliAmt + ")</td>");
                                                    }
                                                    else
                                                    {
                                                        strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                                    }
                                                }
                                                else
                                                {
                                                    strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                                }
                                            }
                                            else
                                            {
                                                strTblContent.Append("<td style='text-align:right;'>" + eligAmount + "</td>");
                                            }
                                            strTblContent.Append("<td>" + rowFilter[k]["Expense_Remarks"].ToString() + "</td>");
                                            strTblContent.Append("</tr >");
                                            dblExpence += Convert.ToDouble(rowFilter[k]["Expense_Amount"].ToString());
                                        }
                                    }
                                    strTblContent.Append("<tr class='Font'><td colspan=11 style='text-align:right !important;font-weight:bold;'>Grand Total of " +
                                        alExpenceMode[j].ToString() + " expense:</td><td style='text-align:left;font-weight:bold'>Rs." + dblExpence.ToString("N2") + "/-</td></tr>");
                                    strTblContent.Append("</table><br>");

                                    strMainTblContent.Append("<tr><td style='font-weight:bold;'>");
                                    strMainTblContent.Append("Total " + alExpenceMode[j].ToString().ToUpper() + " EXPENSE : Rs." + dblExpence.ToString("N2"));
                                    strMainTblContent.Append("</td></tr>");

                                    strMainTblContent.Append("<tr><td style='font-weight:bold;'>");
                                    strMainTblContent.Append(alExpenceMode[j].ToString().ToUpper() + " EXPENSE DETAILS : </td></tr>");

                                    strMainTblContent.Append("<tr><td align='left'>");

                                    strMainTblContent.Append(strTblContent.ToString() + "</td></tr>");
                                }

                            }
                            strMainTblContent.Append("</td></tr></table>");
                        }
                        else
                        {
                            strMainTblContent.Append("<div style='width:100%'>No expense details found</div>");
                        }
                    }
                }
            }
            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
            string userName = _objCurInfo.GetUserName();
            string compCode = _objCurInfo.GetCompanyCode();
            string fileName = "EXPENSEANALYSIS_" + "_" + compCode + "_" + userName + ".xls";

            string blobUrl = string.Empty;
            blobUrl = objAzureBlob.AzureBlobUploadText(strUserInfo.ToString() + strMainTblContent.ToString(), accKey, fileName, "bulkdatasvc");
            return strUserInfo.ToString() + strMainTblContent.ToString() + "$" + blobUrl;
        }

    }
}
