using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Data;
using System.Collections;
using DataControl;
using System.Text;
using System.Web.SessionState;
using DataControl.HiDoctor_ReportsFactoryClasses;
using DataControl.Repository;
using System.Threading.Tasks;
using MVCModels.HiDoctor_Reports;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Net;
using Newtonsoft.Json;

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class AysncReportsController : Controller
    {
        //
        // GET: /AysncReports/

        #region Private Variables
        private SPData _objSPData = new SPData();
        private BLMaster _objBL = new BLMaster();
        private Data _objData = new Data();
        private CurrentInfo _objcurrentInfo = new CurrentInfo();
        private ReportRepository _objReport = new ReportRepository();
        //private ActivityCountController objActivity = new ActivityCountController();
        private BL_DoctorChemistMetTabular _objDocChemTabular = null;
        private BL_ReportRegion _objBL_ReportRegion = null;

        const string COLL_START_DATE = "sd";
        const string COLL_END_DATE = "ed";
        const string COLL_REGION_CODE = "regionCode";
        const string Coll_PRODUCT_CODE = "ProductCode";
        const int PAGESIZE = 10;
        private DAL_ReportRegion _objDALreportRegion;
        private AsyncReportRepository objAsyncAPI = new AsyncReportRepository();

        #endregion Private Variables

        #region Comprehensive Analysis Report

        public ActionResult AsyncComprehensiveAnalysisReport()
        {
            return View();
        }

        public string ProcessComprehensiveAnalysisReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetConnectionString_Client();
            string UserCode = collection["userCode"];
            string StartDate = collection[COLL_START_DATE].ToString();
            string EndDate = collection[COLL_END_DATE].ToString();
            string ReportType = collection["reportType"].ToString();
            string ReportParameters = "Start Date: " + StartDate + "<br/>End Date: " + EndDate + "<br/>Report Type: " + ReportType;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "ComprehensiveAnalysisReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);


            Task task = Task.Factory.StartNew(() =>
            {
                GetComprehensiveAnalysisReport(UserCode, StartDate, EndDate, ReportType, TransNumber, CompanyCode, CurrentUserCode, SubDomain, ConnectionString);
            });
            return TransNumber;
        }

        public void GetComprehensiveAnalysisReport(string UserCode, string StartDate, string EndDate, string ReportType, string TransactionNumber, string CompanyCode, string CurrentUserCode, string SubDomain, string ConnectionString)
        {
            string companyCode = CompanyCode; //_objcurrentInfo.GetCompanyCode();
            string userCode = UserCode; //collection["userCode"];
            string startDate = StartDate; //collection[COLL_START_DATE].ToString();
            string endDate = EndDate; //collection[COLL_END_DATE].ToString();
            string reportType = ReportType; //collection["reportType"].ToString();
            StringBuilder sbTableContent = new StringBuilder();
            StringBuilder sbMonthHeader = new StringBuilder();
            string currentUserCode = CurrentUserCode;
            DateTime dtTemp;
            DataSet ds = new DataSet();
            string month = endDate.Split('/')[1].ToString();
            string year = endDate.Split('/')[2].ToString();
            _objDALreportRegion = new DAL_ReportRegion();

            if (!string.IsNullOrEmpty(startDate))
            {
                startDate = startDate.Split('/')[2].ToString() + "-" + startDate.Split('/')[1].ToString() + "-" + startDate.Split('/')[0].ToString();
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                endDate = endDate.Split('/')[2].ToString() + "-" + endDate.Split('/')[1].ToString() + "-" + endDate.Split('/')[0].ToString();
            }

            try
            {

                ds = _objSPData.GetComprehensiveAnalysisReport(companyCode, userCode, startDate, endDate, reportType, month, year, ConnectionString);

                ArrayList monthlist = new ArrayList();

                DateTime dtEndDate = new DateTime();
                DateTime dtStartDate = new DateTime();
                dtEndDate = Convert.ToDateTime(endDate);
                dtStartDate = Convert.ToDateTime(startDate);

                for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
                {
                    if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                    {
                        monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());
                    }
                }

                DataTable dtUserDetails = ds.Tables[0];
                // DataTable dtDivisitionDetails = ds.Tables[1];

                sbMonthHeader.Append("<tr ><th>Parameters</th>");
                foreach (string monthName in monthlist)
                {
                    sbMonthHeader.Append("<th>" + monthName.Split('_')[0] + '_' + monthName.Split('_')[2] + "</th>");
                }
                sbMonthHeader.Append("</tr>");

                sbTableContent.Append("<div class='CA_Div_Company'>");
                sbTableContent.Append("<div class='CA_Div_Left'>Comprehensive Analysis Report for the period " + dtStartDate.ToString("dd/MM/yyyy") + " - " + dtEndDate.ToString("dd/MM/yyyy") + "(Considered Applied & Approved DCRs only)</div>");
                sbTableContent.Append("<div class='CA_Div_Right'><div style='float:left;width:100%'><div style='width: 30%;'><img style='display: inline;' src='Images/Company_Logo/" + SubDomain + ".jpg'></div></div></div>");
                sbTableContent.Append("</div>");


                foreach (DataRow dr in dtUserDetails.Rows)
                {
                    sbTableContent.Append("<div class='CA_Div'>");
                    sbTableContent.Append("<table width='100%' style='margin-top: 5px;'  cellspacing='0' cellpadding='0' border='0' id='tblComprehensiveReport' class='CA_Header_Tbl'>");
                    sbTableContent.Append("<tr >");
                    sbTableContent.Append("<th align='left'>Division Name:" + dr["Division_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("<th align='left'>Region Name   : " + dr["Region_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("<tr >");
                    sbTableContent.Append("<th align='left'>Employee Name : " + dr["Employee_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("<th align='left'>Designation   : " + dr["User_Type_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th align='left'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("<th align='left'>Period        : " + dtStartDate.ToString("dd/MM/yyyy") + " to " + dtEndDate.ToString("dd/MM/yyyy") + "</th>");
                    //if (!string.IsNullOrEmpty(startDate))
                    //{

                    //    sbTableContent.Append("<th align='left'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");
                    //}
                    //else
                    //{
                    //    sbTableContent.Append("<th align='left' colspan='2'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");

                    //}
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th align='left'>Date of Joining     : " + dr["DOJ"].ToString().Trim() + "</th>");
                    sbTableContent.Append("<th align='left'>Manager Name: " + dr["Reporting_Manager_Name"].ToString().Trim() + "</th>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("</table>");

                    // detail table
                    sbTableContent.Append("<table width='99%' style='margin-top: 5px;margin-bottom: 5px;' class='CA_Detail_Tbl' cellspacing='1' cellpadding='1' border='1'>");
                    // sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' style='text-align:center;'>" + dr["User_Name"].ToString().Trim() + "</th></tr>");
                    sbTableContent.Append(sbMonthHeader);

                    DataRow[] drDays;
                    int[] holidays = new int[monthlist.Count];
                    int[] sundays = new int[monthlist.Count];
                    double[] fieldDays = new double[monthlist.Count];
                    int holidayCount = 0;

                    // calculate Total Working Days
                    int sun = 0;
                    int hol = 0;
                    foreach (string monthName in monthlist)
                    {
                        // Sundays
                        drDays = ds.Tables[1].Select("User_Code='" + dr["User_Code"].ToString() + "' AND DCR_Month='" + monthName.Split('_')[1] + "' AND DCR_Year='" + monthName.Split('_')[2] + "' ");
                        if (drDays.Length > 0)
                        {
                            sundays[sun++] = Convert.ToInt32(drDays[0]["Sunday_Count"]);//Sundays                        
                        }
                        else
                        {
                            drDays = ds.Tables[1].Select("User_Code IS NULL AND DCR_Month='" + monthName.Split('_')[1] + "' AND DCR_Year='" + monthName.Split('_')[2] + "' ");
                            if (drDays != null && drDays.Length > 0)
                            {
                                sundays[sun++] = Convert.ToInt32(drDays[0]["Sunday_Count"]);//Sundays
                            }
                            else
                            {
                                sundays[sun++] = 0;
                            }
                        }


                        // Holiday Count

                        DateTime dt1 = new DateTime(Convert.ToInt32(monthName.Split('_')[2]), Convert.ToInt32(monthName.Split('_')[1]), 1);
                        DateTime dt2 = dt1.AddMonths(1);
                        DateTime dt3 = dt2.AddDays(-1);

                        if (dt1.Month == dtStartDate.Month && dt1.Year == dtStartDate.Year)
                        {
                            dt1 = dtStartDate;
                        }
                        if (dt3.Month == dtEndDate.Month && dt3.Year == dtEndDate.Year)
                        {
                            dt2 = dtEndDate;
                        }
                        else
                        {
                            dt2 = dt3;
                        }
                        holidayCount = Convert.ToInt16(GetHolidayCount(dr["User_Code"].ToString(), dr["Region_Code"].ToString(), dt1.ToString("yyyy-MM-dd"), dt2.ToString("yyyy-MM-dd"), "'1','2'", "COUNT", ConnectionString, companyCode));
                        holidays[hol++] = holidayCount;
                    }


                    // Total Working Days      
                    sbTableContent.Append("<tr ><td align='left'>Total Working Days</td>");
                    sun = 0;
                    hol = 0;
                    foreach (string monthName in monthlist)
                    {
                        DateTime dt1 = new DateTime(Convert.ToInt32(monthName.Split('_')[2]), Convert.ToInt32(monthName.Split('_')[1]), 1);
                        DateTime dt2 = dt1.AddMonths(1);
                        DateTime dt3 = dt2.AddDays(-1);

                        if (dt1.Month == dtStartDate.Month && dt1.Year == dtStartDate.Year)
                        {
                            dt1 = dtStartDate;
                        }
                        if (dt3.Month == dtEndDate.Month && dt3.Year == dtEndDate.Year)
                        {
                            dt2 = dtEndDate.AddDays(1);
                        }

                        TimeSpan timeDiff = dt2 - dt1;

                        sbTableContent.Append("<td align='center'>" + (timeDiff.Days - (sundays[sun++] + holidays[hol++])).ToString() + "</td>");//workingDays
                    }
                    sbTableContent.Append("</tr >");

                    // Sundays
                    sbTableContent.Append("<tr ><td align='left'>Sundays</td>");
                    for (int s = 0; s < monthlist.Count; s++)
                    {
                        sbTableContent.Append("<td align='center'>" + sundays[s].ToString() + "</td>");//Sundays                    
                    }
                    sbTableContent.Append("</tr>");

                    // Holidays
                    sbTableContent.Append("<tr ><td align='left'>Holidays</td>");
                    for (int h = 0; h < monthlist.Count; h++)
                    {
                        sbTableContent.Append("<td align='center'>" + holidays[h].ToString() + "</td>");//Holidays                    
                    }
                    sbTableContent.Append("</tr>");

                    // Leave Days
                    sbTableContent.Append("<tr ><td align='left'>Leave Days</td>");
                    foreach (string monthName in monthlist)
                    {
                        drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='L' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDays.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Leave Days
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Leave Days
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // Attendance Days
                    sbTableContent.Append("<tr ><td align='left'>Attendance Days</td>");
                    foreach (string monthName in monthlist)
                    {
                        drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='A' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDays.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Attendance Days
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Attendance Days
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // Field Days
                    sbTableContent.Append("<tr ><td align='left'>Field Days</td>");
                    int f = 0;
                    foreach (string monthName in monthlist)
                    {
                        drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='F' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDays.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Field Days
                            fieldDays[f++] = Convert.ToDouble(drDays[0]["Count"]);
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Field Days
                            fieldDays[f++] = 0;
                        }
                    }
                    sbTableContent.Append("</tr>");


                    //****************************  Doctor Details  ***********************************
                    sbTableContent.Append("<tr><th align='center'>Doctor Details</th>");
                    for (int i = 0; i < monthlist.Count; i++)
                    {
                        sbTableContent.Append("<th>Num</th>");
                    }
                    sbTableContent.Append("</tr>");
                    //sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "'>Doctor Details</th></tr>");
                    DataRow[] drDoctor;

                    int[] totalDrCalls = new int[monthlist.Count];

                    // Doctors VISITS

                    if (reportType != "MET")
                    {
                        int[] moringCount = new int[monthlist.Count];
                        int[] eveningCount = new int[monthlist.Count];
                        // Doctors Met in the Morning
                        int mrg = 0;
                        sbTableContent.Append("<tr ><td align='left'>Doctor Calls in the Morning</td>");
                        foreach (string monthName in monthlist)
                        {
                            drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Visit_Mode='AM' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drDoctor.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Met in the Morning
                                moringCount[mrg++] = Convert.ToInt32(drDoctor[0]["Count"]);
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Doctors Met in the Morning
                                moringCount[mrg++] = 0;
                            }
                        }
                        sbTableContent.Append("</tr>");

                        // Doctors Met in the Evening
                        int eve = 0;
                        sbTableContent.Append("<tr ><td align='left'>Doctor Calls in the Evening</td>");
                        foreach (string monthName in monthlist)
                        {
                            drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Visit_Mode='PM' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drDoctor.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Met in the Evening
                                eveningCount[eve++] = Convert.ToInt32(drDoctor[0]["Count"]);
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Doctors Met in the Evening
                                eveningCount[eve++] = 0;
                            }
                        }
                        sbTableContent.Append("</tr>");

                        // Doctors Calls Made
                        sbTableContent.Append("<tr ><td align='left'>Doctors Calls Made</td>");
                        for (int t = 0; t < monthlist.Count; t++)
                        {
                            totalDrCalls[t] = moringCount[t] + eveningCount[t];
                            sbTableContent.Append("<td align='center'>" + totalDrCalls[t] + "</td>");//Doctors Calls Made
                        }
                        sbTableContent.Append("</tr>");
                    }
                    // Doctors MET
                    else
                    {
                        int tot = 0;
                        sbTableContent.Append("<tr ><td align='left'>Doctors Met</td>");
                        foreach (string monthName in monthlist)
                        {
                            drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drDoctor.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Calls Made
                                totalDrCalls[tot++] = Convert.ToInt32(drDoctor[0]["Count"]);
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Doctors Calls Made
                                totalDrCalls[tot++] = 0;
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }

                    // Doctors Call Avg
                    if (reportType != "MET")
                    {
                        sbTableContent.Append("<tr ><td align='left'>Doctor Calls Avg</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<tr ><td align='left'>Doctors Met Avg</td>");
                    }
                    for (int avg = 0; avg < monthlist.Count; avg++)
                    {
                        if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                        {
                            sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(totalDrCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Doctors Call Avg
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0.0</td>");//Doctors Call Avg
                        }
                    }
                    sbTableContent.Append("</tr>");

                    //****************************  Doctor Details  ***********************************


                    //****************************  Specialty Details  *******************************               
                    DataRow[] drSpec;
                    drSpec = ds.Tables[4].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                    if (drSpec.Length > 0)
                    {
                        sbTableContent.Append("<tr><th align='center'>Specialty Details</th>");
                        if (reportType == "VISIT")
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctor Visits made</th></tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctors Met </th></tr>");
                        }

                        ArrayList alSpeciality = new ArrayList();
                        foreach (DataRow drSpecUniq in drSpec)
                        {
                            if (!alSpeciality.Contains(drSpecUniq["Speciality_Name"].ToString().ToUpper()))
                            {
                                alSpeciality.Add(drSpecUniq["Speciality_Name"].ToString().ToUpper());
                            }
                        }

                        for (int i = 0; i < alSpeciality.Count; i++)
                        {
                            // Speciality Details
                            sbTableContent.Append("<tr ><td align='left'>" + alSpeciality[i].ToString() + "</td>");
                            foreach (string monthName in monthlist)
                            {
                                drSpec = ds.Tables[4].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Speciality_Name='" + alSpeciality[i].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                                if (drSpec.Length > 0)
                                {
                                    sbTableContent.Append("<td align='center'>" + drSpec[0]["Count"].ToString() + "</td>");//Speciality Details
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center'>0</td>");//Speciality Details
                                }
                            }
                            sbTableContent.Append("</tr>");
                        }
                    }
                    else
                    {
                        sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Specialty Details Found</th></tr>");
                    }

                    //****************************  Speciality Details  *******************************

                    //****************************  Category Details  *********************************              
                    DataRow[] drCat;
                    drCat = ds.Tables[5].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                    if (drCat.Length > 0)
                    {
                        sbTableContent.Append("<tr><th align='center'>Category Details</th>");
                        if (reportType == "VISIT")
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctor Visits made</th></tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctors Met </th></tr>");
                        }
                        ArrayList alCategory = new ArrayList();
                        foreach (DataRow drCatUniq in drCat)
                        {
                            if (!alCategory.Contains(drCatUniq["Category_Name"].ToString()))
                            {
                                alCategory.Add(drCatUniq["Category_Name"].ToString());
                            }
                        }

                        for (int i = 0; i < alCategory.Count; i++)
                        {
                            // Category Details
                            sbTableContent.Append("<tr ><td align='left'>" + alCategory[i].ToString() + "</td>");
                            foreach (string monthName in monthlist)
                            {
                                drCat = ds.Tables[5].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Category_Name='" + alCategory[i].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                                if (drCat.Length > 0)
                                {
                                    sbTableContent.Append("<td align='center'>" + drCat[0]["Count"].ToString() + "</td>");//Category Details
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center'>0</td>");//Category Details
                                }
                            }
                            sbTableContent.Append("</tr>");
                        }
                    }
                    else
                    {
                        sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Category Details Found</th></tr>");
                    }

                    //****************************  Category Details  *********************************


                    //****************************  Chemist Details  **********************************

                    sbTableContent.Append("<tr><th align='center'>Chemist Details</th>");
                    if (reportType == "VISIT")
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Chemist Visits made</th></tr>");
                        DataRow[] drChemist;
                        int[] chemistCalls = new int[monthlist.Count];
                        double[] chemistPOB = new double[monthlist.Count];

                        // Chemist Calls Made
                        int chem = 0;
                        int pob = 0;
                        sbTableContent.Append("<tr ><td align='left'>Chemist Calls Made</td>");
                        foreach (string monthName in monthlist)
                        {
                            drChemist = ds.Tables[6].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drChemist.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drChemist[0]["Count"].ToString() + "</td>");//Chemist Calls Made
                                chemistCalls[chem++] = Convert.ToInt32(drChemist[0]["Count"]);
                                chemistPOB[pob++] = Convert.ToDouble(drChemist[0]["Sum"]);
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Chemist Calls Made
                                chemistCalls[chem++] = 0;
                                chemistPOB[pob++] = 0.0;
                            }
                        }
                        sbTableContent.Append("</tr>");

                        // Chemist Calls Avg
                        sbTableContent.Append("<tr ><td align='left'>Chemist Calls Avg</td>");
                        for (int avg = 0; avg < monthlist.Count; avg++)
                        {
                            if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                            {
                                sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(chemistCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Chemist Call Avg
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0.0</td>");//Chemist Call Avg
                            }
                        }
                        sbTableContent.Append("</tr>");

                        // POB Amount
                        sbTableContent.Append("<tr ><td align='left'>POB Amount</td>");
                        for (int p = 0; p < monthlist.Count; p++)
                        {
                            sbTableContent.Append("<td align='center'>" + chemistPOB[p].ToString("N2") + "</td>");//POB Amount
                        }
                        sbTableContent.Append("</tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Chemist Met </th></tr>");
                        DataRow[] drChemist;
                        DataRow[] drFlexicountforMet;
                        int[] chemistCalls = new int[monthlist.Count];
                        double[] chemistPOB = new double[monthlist.Count];
                       // double flexiChemExpsum = 0.00;


                        // Chemist Calls Made
                        int chem = 0;
                        int pob = 0;
                        sbTableContent.Append("<tr ><td align='left'>Chemist Calls Made</td>");
                        foreach (string monthName in monthlist)
                        {
                            drChemist = ds.Tables[6].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            drFlexicountforMet = ds.Tables[9].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                          // int flexichemistcountformet = 0;
                            double flexiChemExpsum = 0.00;
                            int flexichemistcount = 0;
                            //Get unique chemist couunt for met
                            if (drChemist.Length > 0)
                            {
                                flexichemistcount += Convert.ToInt32(drChemist[0]["Count"]);
                                //flexichemistcountformet += Convert.ToInt32(drChemist[0]["Count"]);
                                flexiChemExpsum += Convert.ToDouble(drChemist[0]["Sum"]);
                            }
                            else
                            {
                                flexichemistcount += 0;
                              // flexichemistcountformet += 0;
                                flexiChemExpsum += 0.0;
                            }
                            //Get unique flexi chemist couunt for met
                            if (drFlexicountforMet.Length > 0)
                            {
                                flexichemistcount += drFlexicountforMet.Length;
                                for (int s = 0; s < drFlexicountforMet.Length; s++)
                                {
                                    flexiChemExpsum += Convert.ToDouble(drFlexicountforMet[s]["Sum"]);
                                }

                            }
                            else
                            {
                               // flexichemistcountformet += 0;
                                flexichemistcount += 0;
                                flexiChemExpsum += 0.0;
                            }

                                chemistCalls[chem++] = flexichemistcount;
                                chemistPOB[pob++] = flexiChemExpsum;
                                sbTableContent.Append("<td align='center'>" + flexichemistcount + "</td>");//Chemist Calls Made


                        }
                        sbTableContent.Append("</tr>");

                        // Chemist Calls Avg
                        sbTableContent.Append("<tr ><td align='left'>Chemist Calls Avg</td>");
                        for (int avg = 0; avg < monthlist.Count; avg++)
                        {
                            if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                            {
                                sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(chemistCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Chemist Call Avg
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0.0</td>");//Chemist Call Avg
                            }
                        }
                        sbTableContent.Append("</tr>");

                        // POB Amount
                        sbTableContent.Append("<tr ><td align='left'>POB Amount</td>");
                        for (int p = 0; p < monthlist.Count; p++)
                        {
                            sbTableContent.Append("<td align='center'>" + chemistPOB[p].ToString("N2") + "</td>");//POB Amount
                        }
                        sbTableContent.Append("</tr>");
                    }


                    //****************************  Chemist Details  **********************************

                    //****************************  Accompanist Details  ******************************
                    DataRow[] drAccomp;
                    drAccomp = ds.Tables[7].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                    if (drAccomp.Length > 0)
                    {
                        sbTableContent.Append("<tr><th align='center'>Accompanist Details</th>");
                        if (reportType == "VISIT")
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Visit made</th></tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Doctors Met </th></tr>");
                        }
                        ArrayList alAccompanist = new ArrayList();
                        foreach (DataRow drAccompUniq in drAccomp)
                        {
                            if (!alAccompanist.Contains(drAccompUniq["Accompanist"].ToString() + "|" + drAccompUniq["User_Type_Name"].ToString() + "|" + drAccompUniq["Region_Name"].ToString() + "|" + drAccompUniq["Employee_Name"].ToString() + "|" + drAccompUniq["Date_of_Joining"].ToString()))
                            {
                                alAccompanist.Add(drAccompUniq["Accompanist"].ToString() + "|" + drAccompUniq["User_Type_Name"].ToString() + "|" + drAccompUniq["Region_Name"].ToString() + "|" + drAccompUniq["Employee_Name"].ToString() + "|" + drAccompUniq["Date_of_Joining"].ToString());
                            }
                        }

                        for (int i = 0; i < alAccompanist.Count; i++)
                        {
                            // Accompanist Details
                            sbTableContent.Append("<tr ><td align='left'>" + alAccompanist[i].ToString().Split('|')[0] + " ," + alAccompanist[i].ToString().Split('|')[1] + "(" + alAccompanist[i].ToString().Split('|')[2] + "), Employee Name :" + alAccompanist[i].ToString().Split('|')[3] + " ,  D.O.J :" + alAccompanist[i].ToString().Split('|')[4] + " </td>");
                            foreach (string monthName in monthlist)
                            {
                                drAccomp = ds.Tables[7].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Accompanist='" + alAccompanist[i].ToString().Split('|')[0] + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                                if (drAccomp.Length > 0)
                                {
                                    sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                                }
                            }
                            sbTableContent.Append("</tr>");
                        }

                        // INDEPENDENT ACCOMPANIST
                        sbTableContent.Append("<tr ><td align='left'>Independent Visits</td>");
                        foreach (string monthName in monthlist)
                        {
                            drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drAccomp.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                            }
                        }
                        sbTableContent.Append("</tr>");

                    }
                    else
                    {
                        drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                        if (drAccomp.Length > 0)
                        {
                            sbTableContent.Append("<tr><th align='center'>Accompanist Details</th></tr>");
                            if (reportType == "VISIT")
                            {
                                sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Visit made</th></tr>");
                            }
                            else
                            {
                                sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Doctors Met </th></tr>");
                            }
                            // INDEPENDENT ACCOMPANIST
                            sbTableContent.Append("<tr ><td align='left'>Independent Visits</td>");
                            foreach (string monthName in monthlist)
                            {
                                drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                                if (drAccomp.Length > 0)
                                {
                                    sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                                }
                            }
                            sbTableContent.Append("</tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Accompanist Details Found</th></tr>");
                        }
                    }
                    //****************************  Accompanist Details  ******************************
                    sbTableContent.Append("</table>");
                    sbTableContent.Append("</div>");
                }

                //return sbTableContent.ToString();

                //_objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransactionNumber, "Completed", "", "", sbTableContent.ToString(), ConnectionString, currentUserCode);
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransactionNumber, sbTableContent.ToString(), ConnectionString, "Comprehensive Analysis Report");


            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransactionNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, currentUserCode);
            }
            finally
            {
                ds.Dispose();
                _objDALreportRegion = null;
            }

        }

        #endregion Comprehensive Analysis Report

        #region -- Genric Methods

        public string GetReportProcessQueueStatus(string ReportName)
        {
            return objAsyncAPI.GetReportProcessQueueStatus(ReportName);
        }

        public string GetAsyncReportByID(string TransactionID)
        {
            return objAsyncAPI.GetAsyncReportByID(TransactionID);
        }

        public void DownloadAsyncReportExcel(FormCollection collection)
        {
            objAsyncAPI.DownloadAsyncReportExcel(collection);
        }

        private int GetHolidayCount(string userCode, string regionCode, string startDate, string endDate, string dcrStatus, string mode, string ConnectionString, string CompanyCode)
        {
            string companyCode = CompanyCode; //_objcurrentInfo.GetCompanyCode();
            DataSet dsHoliday = new DataSet();

            dsHoliday = _objSPData.GetHolidayCount(companyCode, userCode, regionCode, startDate, endDate, dcrStatus, ConnectionString);

            if (mode.Trim().ToUpper() == "COUNT")
            {
                return dsHoliday.Tables[0].Rows.Count;
            }
            else // DETAILS
            {
                return 0;
            }
        }

        #endregion -- Genric Methods

        #region -- Doctor chemist met tabular

        public ActionResult AsyncDoctorChemistMetTabularReport()
        {
            return View();
        }

        public string ProcessDoctorChemistMetTabularReport(string userCodes, string start_Date, string end_Date)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetConnectionString_Client();
            string ReportParameters = "Start Date: " + start_Date + "<br/>End Date: " + end_Date + "<br/>";

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "DoctorChemistMetTabularReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            Task task = Task.Factory.StartNew(() =>
            {
                GetDoctorChemistMetHTMLFormat(userCodes, start_Date, end_Date, TransNumber, CompanyCode, CurrentUserCode, SubDomain, ConnectionString);
            });

            return TransNumber;
        }

        public void GetDoctorChemistMetHTMLFormat(string userCodes, string start_Date, string end_Date, string TransNumber, string CompanyCode, string CurrentUserCode, string SubDomain, string ConnectionString)
        {
            try
            {
                // Creats Instance.
                _objcurrentInfo = new CurrentInfo();
                _objDocChemTabular = new BL_DoctorChemistMetTabular();
                StringBuilder strBuilder = new StringBuilder();


                // Retrieve the Doctor Chemist met list from BL and DAL.
                List<DoctorChemistMetReportModel> lstDoctorChemistTabular = _objDocChemTabular.GetDoctorChemistMetTabular(CompanyCode, userCodes, start_Date, end_Date, CurrentUserCode, ConnectionString, SubDomain);

                strBuilder = GetDoctorChemistHTMLTableFormat(lstDoctorChemistTabular, start_Date, end_Date);

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, strBuilder.ToString(), ConnectionString, "Doctor Chemist Met Tabular Report");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error while processing the request...Please try again later", "", ConnectionString, CurrentUserCode);
            }
        }

        private StringBuilder GetDoctorChemistHTMLTableFormat(List<DoctorChemistMetReportModel> lstDoctorChemistTabular, string start_date, string end_date)
        {
            StringBuilder strTableBuilder = new StringBuilder();
            foreach (DoctorChemistMetReportModel doctorChemistMet in lstDoctorChemistTabular)
            {
                if (doctorChemistMet.lstUserDetail.Count > 0)
                {
                    UserDetailModel userDetailModel = doctorChemistMet.lstUserDetail[0];
                    strTableBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                    strTableBuilder.Append("<thead>");
                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<th style='text-align:left' colspan='3'>");
                    strTableBuilder.Append("User Details");
                    strTableBuilder.Append("<th>");
                    strTableBuilder.Append("</tr>");
                    strTableBuilder.Append("</thead>");

                    strTableBuilder.Append("<tbody>");
                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td >User Name: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.User_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td >Designation: </td>");
                    strTableBuilder.Append("<td >");
                    strTableBuilder.Append(userDetailModel.User_Type_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");

                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td >Employee Name: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Employee_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td >Employee Number: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Employee_Number);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");

                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td>Reporting HQ: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Manager_Region_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td>Reporting Manager: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Manager_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");


                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td>Territory: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Region_Name);
                    strTableBuilder.Append("</td>");
                    List<DivisionReportModel> lstDivisionModel = doctorChemistMet.lstDivisionModel.Where(DIV => DIV.User_Code == userDetailModel.User_Code).ToList();

                    strTableBuilder.Append("<td>Division: </td>");
                    strTableBuilder.Append("<td>");
                    foreach (DivisionReportModel divisionModel in lstDivisionModel)
                    {
                        strTableBuilder.Append(divisionModel.Division_Name + ",");
                    }
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");

                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td>Phone number: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.Phone);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td>Date of joining: </td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append(userDetailModel.DOJ);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");

                    strTableBuilder.Append("<tr>");
                    strTableBuilder.Append("<td>Periods: </td>");
                    strTableBuilder.Append("<td>");
                    string sdate = start_date.Split('-')[2] + "/" + start_date.Split('-')[1] + "/" + start_date.Split('-')[0];
                    string edate = end_date.Split('-')[2] + "/" + end_date.Split('-')[1] + "/" + end_date.Split('-')[0];
                    strTableBuilder.Append(sdate + " - " + edate);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td>&nbsp;</td>");
                    strTableBuilder.Append("<td>");
                    strTableBuilder.Append("&nbsp;");
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("</tr>");
                    strTableBuilder.Append("</tbody></table>");


                    strTableBuilder.Append("<table class='table table-striped' cellspacing='0' style='border:1px solid #aaa;font-size:11px' cellpadding='0'><thead>");
                    strTableBuilder.Append("<tr><th style='text-align:left'>DCR Date</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Punched Date</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Place Worked</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Status</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Own MDL Visited</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Other MDL Visited</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Doctor Count</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Chemist Met</th>");
                    strTableBuilder.Append("<th style='text-align:left'>Chemist Count</th></tr>");
                    strTableBuilder.Append("</thead><tbody>");
                    List<DCRHeaderReportModel> lstdcrHeader = doctorChemistMet.lstDCRHeader.Where(DCR => DCR.User_Code == userDetailModel.User_Code).ToList();
                    if (lstdcrHeader.Count == 0)
                    {
                        strTableBuilder.Append("<tr><td colspan='8'> No DCRs Found.<td></tr>");
                    }
                    else
                    {
                        int totalDocCallsMade = 0;
                        int totalChemCallsMade = 0;
                        foreach (DCRHeaderReportModel dcrHeaderReprot in lstdcrHeader)
                        {
                            strTableBuilder.Append("<tr><td title='DCR Date'>");
                            strTableBuilder.Append(dcrHeaderReprot.DCR_Actual_Date);
                            strTableBuilder.Append("</td>");
                            strTableBuilder.Append("<td title='Punched Date'>");
                            strTableBuilder.Append(dcrHeaderReprot.DCR_Entered_Date);
                            strTableBuilder.Append("</td>");

                            strTableBuilder.Append("<td title='Place Worked'>");
                            strTableBuilder.Append(dcrHeaderReprot.Place_Worked);
                            strTableBuilder.Append("</td>");

                            string DCR_Status = dcrHeaderReprot.DCR_Status == "1" ? "Waiting for approval" : dcrHeaderReprot.DCR_Status == "2" ? "Approved" : "Unapproved";
                            strTableBuilder.Append("<td title='Status'>");
                            strTableBuilder.Append(DCR_Status);
                            strTableBuilder.Append("</td>");

                            List<DCRDoctorVisitReportModel> lstOwnDocVisit = doctorChemistMet.lstDCRDoctorVisit.Where(DOC => DOC.DCR_Code == dcrHeaderReprot.DCR_Code && DOC.Doctor_Region_Code == dcrHeaderReprot.Region_Code).ToList();
                            List<DCRDoctorVisitReportModel> lstOthersDocVisit = doctorChemistMet.lstDCRDoctorVisit.Where(DOC => DOC.DCR_Code == dcrHeaderReprot.DCR_Code && DOC.Doctor_Region_Code != dcrHeaderReprot.Region_Code).ToList();
                            List<DCRAccompanistDetail> lstacc = doctorChemistMet.lstAccompanist.ToList();
                            // Own MDL.
                            if (lstOwnDocVisit.Count != 0)
                            {
                                strTableBuilder.Append("<td style='vertical-align:top'>");
                                strTableBuilder.Append("<table class='table table-striped' title='OWN MDL Visited' style='font-size:11px;border:1px solid #aaa;' cellspacing='0' cellpadding='0'><thead><tr>");
                                strTableBuilder.Append("<th style='text-align:left;'>Doctor</th>");
                                strTableBuilder.Append("<th style='text-align:left;'>Category</th>");
                                strTableBuilder.Append("<th style='text-align:left;'>Speciality</th>");
                                strTableBuilder.Append("<th style='text-align:left;'>MDL Number</th>");
                                strTableBuilder.Append("<th style='text-align:left;'>Chosen accompanist for that doctor visit</th>");
                                strTableBuilder.Append("<th style='text-align:left;'>Remarks</th>");
                                strTableBuilder.Append("</tr></thead>");
                                strTableBuilder.Append("<tbody>");

                                foreach (DCRDoctorVisitReportModel dcrDoctorVisit in lstOwnDocVisit)
                                {
                                    strTableBuilder.Append("<tr><td title='OWN MDL Visited - Doctor Name'>");
                                    strTableBuilder.Append(dcrDoctorVisit.Doctor_Name);
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("<td title='OWN MDL Visited - Doctor Category'>");
                                    strTableBuilder.Append(dcrDoctorVisit.Doc_Category_Name);
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("<td title='OWN MDL Visited-Speciality'>");
                                    strTableBuilder.Append(dcrDoctorVisit.Speciality_Name);
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("<td title='OWN MDL Visited-MDL Number'>");
                                    strTableBuilder.Append(dcrDoctorVisit.MDL_Number);
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("<td title='OWN MDL Visited - Accompanist'>");
                                    int count = 0;
                                    foreach (DCRAccompanistDetail dcrAccompanist in lstacc)
                                    {
                                        if (dcrDoctorVisit.DCR_Visit_Code == dcrAccompanist.DCR_Visit_Code)
                                        {
                                            if (count == 0)
                                            {
                                                strTableBuilder.Append(dcrAccompanist.Acc_User_Name);
                                            }
                                            else
                                            {
                                                strTableBuilder.Append("," + dcrAccompanist.Acc_User_Name);
                                            }
                                            count++;
                                        }

                                    }
                                    
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("<td title='OWN MDL Visited - Remarks'>");
                                    strTableBuilder.Append(dcrDoctorVisit.Remarks_By_User);
                                    strTableBuilder.Append("</td>");
                                    strTableBuilder.Append("</tr>");
                                }
                                strTableBuilder.Append("</tbody></table>");
                                strTableBuilder.Append("</td>");
                            }
                            else
                            {
                                strTableBuilder.Append("<th>No Doctor Met</th>");

                            }

                            // Others MDL.
                            if (lstOthersDocVisit.Count != 0)
                            {
                            strTableBuilder.Append("<td style='vertical-align:top'>");
                            strTableBuilder.Append("<table class='table table-striped' title='Others MDL Visited' style='font-size:11px;border:1px solid #aaa;' cellspacing='0' cellpadding='0'><thead><tr>");
                            strTableBuilder.Append("<th style='text-align:left;'>Doctor</th>");
                            strTableBuilder.Append("<th style='text-align:left;'>Category</th>");
                            strTableBuilder.Append("<th style='text-align:left;'>MDL Number</th>");
                            strTableBuilder.Append("<th style='text-align:left;'>Speciality</th>");
                            strTableBuilder.Append("<th style='text-align:left;'>Chosen accompanist for that doctor visit</th>");
                            strTableBuilder.Append("<th style='text-align:left;'>Remarks</th>");
                            strTableBuilder.Append("</tr></thead>");
                            strTableBuilder.Append("<tbody>");

                            foreach (DCRDoctorVisitReportModel dcrDoctorVisit in lstOthersDocVisit)
                            {
                                strTableBuilder.Append("<tr><td title='Others MDL Visited - Doctor Name'>");
                                strTableBuilder.Append(dcrDoctorVisit.Doctor_Name);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("<td title='Others MDL Visited - Category Name'>");
                                strTableBuilder.Append(dcrDoctorVisit.Doc_Category_Name);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("<td title='Others MDL Visited - MDL Number'>");
                                strTableBuilder.Append(dcrDoctorVisit.MDL_Number);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("<td title='Others MDL Visited - Speciality'>");
                                strTableBuilder.Append(dcrDoctorVisit.Speciality_Name);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("<td title='Others MDL Visited - Chosen accompanist'>");
                                int count1 = 0;
                                foreach (DCRAccompanistDetail dcrAccompanist in lstacc)
                                {

                                    if (dcrDoctorVisit.DCR_Visit_Code == dcrAccompanist.DCR_Visit_Code)
                                    {
                                        if (count1 == 0)
                                        {
                                            strTableBuilder.Append(dcrAccompanist.Acc_User_Name);
                                        }
                                        else
                                        {
                                            strTableBuilder.Append("," + dcrAccompanist.Acc_User_Name);
                                        }
                                        count1++;
                                    }
                                }
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("<td title='Others MDL Visited - Remarks'>");
                                strTableBuilder.Append(dcrDoctorVisit.Remarks_By_User);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("</tr>");
                            }
                            strTableBuilder.Append("</tbody></table>");
                            strTableBuilder.Append("</td>");
                            }
                            else
                            {
                                strTableBuilder.Append("<th>No Doctor Met</th>");

                            }
                            // Doctor Count.
                            strTableBuilder.Append("<td title='Doctors Count' style='vertical-align:top'>");
                            totalDocCallsMade += lstOthersDocVisit.Count + lstOwnDocVisit.Count;
                            strTableBuilder.Append(lstOthersDocVisit.Count + lstOwnDocVisit.Count);
                            strTableBuilder.Append("</td>");

                            // Chemist Met.
                            List<DCRChemistVisitReportModel> lstChemVisit = doctorChemistMet.lstDCRChemistVisit.Where(CHM => CHM.DCR_Code == dcrHeaderReprot.DCR_Code).ToList();
                            strTableBuilder.Append("<td style='vertical-align:top'>");
                            strTableBuilder.Append("<table class='table table-striped' title='Chemist Met' style='font-size:11px;border:1px solid #aaa;' cellspacing='0' cellpadding='0'><thead><tr>");
                            strTableBuilder.Append("<th style='text-align:left;'>Chemist</th>");
                            strTableBuilder.Append("</tr></thead>");
                            strTableBuilder.Append("<tbody>");

                            // Retrieve the Unique Chemist.
                            IEnumerable<DCRChemistVisitReportModel> lstFlexiChemist = lstChemVisit.Where(che => che.Chemist_Code == null || che.Chemist_Code.Trim().Length == 0).ToList();
                            lstChemVisit = lstChemVisit.Where(che => che.Chemist_Code != null && che.Chemist_Code.Trim().Length != 0).Distinct(new ChemistVisitCodeComparer()).ToList();
                            lstChemVisit.AddRange(lstFlexiChemist);
                            foreach (DCRChemistVisitReportModel dcrChemistVisit in lstChemVisit)
                            {
                                strTableBuilder.Append("<tr><td title='Chemist Met - Chemist Name'>");
                                strTableBuilder.Append(dcrChemistVisit.Chemist_Name);
                                strTableBuilder.Append("</td>");
                                strTableBuilder.Append("</tr>");
                            }
                            strTableBuilder.Append("</tbody></table>");
                            strTableBuilder.Append("</td>");

                            // Chemist Count.
                            strTableBuilder.Append("<td style='vertical-align:top' title='Chemist Met Count'>");
                            totalChemCallsMade += lstChemVisit.Count;
                            strTableBuilder.Append(lstChemVisit.Count);
                            strTableBuilder.Append("</td>");
                            strTableBuilder.Append("</tr>");

                        }

                        // Total summary per user.
                        strTableBuilder.Append("<tr><td colspan='9'><table style='float:right'>");
                        strTableBuilder.Append("<tr>");
                        strTableBuilder.Append("<td > Total Number of Doctor Calls Made:&nbsp;" + totalDocCallsMade.ToString() + "</td>");
                        strTableBuilder.Append("</tr>");
                        strTableBuilder.Append("<tr>");
                        strTableBuilder.Append("<td > Total Number of Chemist Calls Made:&nbsp;" + totalChemCallsMade.ToString() + "</td>");
                        strTableBuilder.Append("</tr>");
                        strTableBuilder.Append("</table></td></tr>");
                        strTableBuilder.Append("</tbody></table>");
                    }
                }
            }

            return strTableBuilder;
        }

        //public void DownloadDoctorChemistMetReportExcel(FormCollection collection)
        //{
        //    string tableContent = GetAsyncReportByID(collection["ReportTransactionID"].ToString());
        //    string compnayLogo = "<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>";
        //    tableContent = tableContent.Replace(compnayLogo, " ");
        //    //<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>

        //    Response.ClearContent();
        //    Response.Buffer = true;
        //    Response.AddHeader("content-disposition", "attachment; filename=Comprehensive Analysis Report.xls");
        //    Response.ContentType = "application/ms-excel";
        //    Response.Output.Write("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
        //    Response.Output.Write("<head>");
        //    Response.Output.Write("<meta http-equiv=\"Content-Type\" content=\"text/html;charset=windows-1252\">");
        //    Response.Output.Write("<!--[if gte mso 9]>");
        //    Response.Output.Write("<xml>");
        //    Response.Output.Write("<x:ExcelWorkbook>");
        //    Response.Output.Write("<x:ExcelWorksheets>");
        //    Response.Output.Write("<x:ExcelWorksheet>");
        //    Response.Output.Write("<x:Name>Comprehensive Analysis Report</x:Name>");
        //    Response.Output.Write("<x:WorksheetOptions>");
        //    Response.Output.Write("<x:Panes>");
        //    Response.Output.Write("</x:Panes>");
        //    Response.Output.Write("</x:WorksheetOptions>");
        //    Response.Output.Write("</x:ExcelWorksheet>");
        //    Response.Output.Write("</x:ExcelWorksheets>");
        //    Response.Output.Write("</x:ExcelWorkbook>");
        //    Response.Output.Write("</xml>");
        //    Response.Output.Write("<![endif]-->");
        //    Response.Output.Write("</head>");
        //    Response.Output.Write("<body>");
        //    Response.Output.Write("<table>");
        //    Response.Output.Write(tableContent);
        //    Response.Output.Write("</table>");
        //    Response.Output.Write("</body>");
        //    Response.Output.Write("</html>");
        //    Response.Flush();
        //    Response.End();
        //}

        #endregion -- Doctor chemist met tabular

        #region CategoryWise Dr Visit Analysis

        public ActionResult AsyncCategoryWiseDoctorVisitAnalysis()
        {
            return View();
        }

        public string ProcessCategoryWiseDrVisitAnalysis(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string selectedRegionCode = _objcurrentInfo.GetRegionCode();
            string month = collection["Month"].ToString();
            string year = collection["Year"].ToString();
            string groupByRegionTypeCode = collection["GroupByRegionTypeCode"].ToString();
            string aggregateRegionTypeCode = collection["AggregateRegionTypeCode"].ToString();
            string[] dcrSelectedValues = collection["DCRStatus"].ToString().Split(new char[] { '^' }, 4);
            string DCRStatus = collection["DCRStatus"].ToString();
            string dcrStatus = "";
            string monthName = collection["MonthName"].ToString();
            string groupByRegionTypeName = collection["GroupByRegionTypeName"].ToString();
            string aggregateRegionTypeName = collection["AggregateRegionTypeName"].ToString();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetConnectionString_Client();
            string ReportParameters = "";

            foreach (string status in dcrSelectedValues)
            {
                if (status != "")
                {
                    if (status == "0")
                    {
                        dcrStatus += "Unapproved,";
                    }
                    else if (status == "1")
                    {
                        dcrStatus += "Applied,";
                    }
                    else if (status == "2")
                    {
                        dcrStatus += "Approved,";
                    }
                    else
                    {
                        dcrStatus += "All";
                    }
                }
            }

            string strMonthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt16(month));

            ReportParameters = "Report Month: " + strMonthName + "<br/>Group By: " + groupByRegionTypeName + "<br/>Aggregate Details Of: " + aggregateRegionTypeName + "<br/>DCR Status: " + dcrStatus;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(companyCode, TransNumber, "CategoryWiseDrVisitAnalysis", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            Task task = Task.Factory.StartNew(() =>
            {
                // var DCRStatus = dcrStatus;
                GetCategoryWiseDrVisitAnalysis(companyCode, selectedRegionCode, month, year, groupByRegionTypeCode, aggregateRegionTypeCode,
                    DCRStatus, monthName, groupByRegionTypeName, aggregateRegionTypeName, TransNumber, CurrentUserCode, SubDomain, ConnectionString);
            });
            return TransNumber;

        }

        public void GetCategoryWiseDrVisitAnalysis(string companyCode, string selectedRegionCode, string month, string year, string groupByRegionTypeCode, string aggregateRegionTypeCode,
            string DCRStatus, string monthName, string groupByRegionTypeName, string aggregateRegionTypeName, string TransNumber, string CurrentUserCode, string SubDomain, string ConnectionString)
        {

            string dcrStatus = DCRStatus;

            //switch (DCRStatus)
            //{
            //    case "Applied,":
            //        dcrStatus = "1^";
            //        break;
            //    case "Approved,":
            //        dcrStatus = "2^";
            //        break;
            //    case "Unapproved,":
            //        dcrStatus = "0^";
            //        break;
            //    case "All, ":
            //        dcrStatus = "0^1^2^";
            //        break;
            //    default:
            //        dcrStatus = "0^1^2^";
            //        break;
            //}


            DAL_Reports_CategoryWiseDrVisitAnalysis objDAL = new DAL_Reports_CategoryWiseDrVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string blobUrl = string.Empty;


            string dcrText = string.Empty;

            DataSet dsUserInfo = null;
            DataSet dsDoctorCategory = null;
            //DataSet dsDoctorMaster = null;
            //DataSet dsDoctorVisit = null;
            //DataSet dsFieldDays = null;
            DataSet dsLastDcrDate = null;
            DataSet dsRvSv = null;


            StringBuilder sbTableContent = new StringBuilder();

            string currentRegionCode = string.Empty;
            string regionUserCount = string.Empty;
            string categoryCode = string.Empty;
            string userCodes = string.Empty;

            int standardVisitCount = 0;

            double doctorMasterCount = 0;
            double doctorVisitCount = 0;
            double visitAvg = 0;
            int loopCount = 0;

            int totalRegionCnt = 0;
            int totalUserCnt = 0;
            int totalNoOfFieldDays = 0;
            DataRow[] rowFilter;
            DataRow filteredRow;

            if (string.IsNullOrEmpty(month)) { month = "0"; }
            if (string.IsNullOrEmpty(year)) { year = "0"; }

            dsUserInfo = objDAL.GetChildRegions(companyCode, selectedRegionCode, groupByRegionTypeCode, ConnectionString);
            dsDoctorCategory = objDAL.GetDoctorCategories(companyCode, ConnectionString);
            dsRvSv = objDAL.GetRVSVDetails(companyCode, aggregateRegionTypeCode, selectedRegionCode, groupByRegionTypeCode, int.Parse(month), int.Parse(year), dcrStatus, ConnectionString);


            if (dsUserInfo != null && dsUserInfo.Tables.Count > 0)
            {
                foreach (string status in dcrStatus.Split('^'))
                {
                    if (status == "0")
                    {
                        dcrText += "Unapproved,";
                    }
                    else if (status == "1")
                    {
                        dcrText += "Applied,";
                    }
                    else if (status == "2")
                    {
                        dcrText += "Approved,";
                    }
                }

                dcrText = dcrText.Substring(0, dcrText.Length - 1);

                sbTableContent.Append("<div>RVSV Analysis for the month of " + monthName + " grouped by " + groupByRegionTypeName + " aggregated by " + aggregateRegionTypeName + " (Considered " + dcrText + " DCRs only)</div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0' id='tblTpVsActualDocVisits' width='100%'>");

                // Binding header information - Start
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");

                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Region Name</th>");
                //  sbTableContent.Append("<th>Reporting Region Name</th>");
                sbTableContent.Append("<th>Line 1 Manager Name</th>");
                sbTableContent.Append("<th>Line 1 Manager User Type</th>");
                sbTableContent.Append("<th>Line 1 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 1 Manager Region type</th>");
                sbTableContent.Append("<th>Line 2 Manager Name</th>");
                sbTableContent.Append("<th>Line 2 Manager User Type</th>");
                sbTableContent.Append("<th>Line 2 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 2 Manager Region type</th>");
                sbTableContent.Append("<th>Line 3 Manager Name</th>");
                sbTableContent.Append("<th>Line 3 Manager User Type</th>");
                sbTableContent.Append("<th>Line 3 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 3 Manager Region type</th>");
                sbTableContent.Append("<th>Region Count</th>");
                sbTableContent.Append("<th>User Count</th>");
                sbTableContent.Append("<th>DCR Last Entered Date</th>");
                sbTableContent.Append("<th>No. of Field Work Days</th>");

                int categoryCount = 0;

                if (dsDoctorCategory != null && dsDoctorCategory.Tables.Count > 0)
                {
                    foreach (DataRow drDocCategory in dsDoctorCategory.Tables[0].Rows)
                    {
                        standardVisitCount = 0;

                        if (!string.IsNullOrEmpty(drDocCategory["Visit_Count"].ToString()))
                        {
                            standardVisitCount = Convert.ToInt16(drDocCategory["Visit_Count"].ToString());
                        }

                        categoryCount += 1 + standardVisitCount;

                        sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs in the list </th>");

                        for (int i = 1; i <= standardVisitCount; i++)
                        {
                            sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs met at least " + i.ToString() + " time(s) </th>");
                            sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs met at least " + i.ToString() + " time(s) % </th>");
                        }
                    }
                }

                int[] columnWiseTotal = new int[categoryCount];

                sbTableContent.Append("</tr>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");

                foreach (DataRow drGroupbyRegion in dsUserInfo.Tables[0].Rows)
                {
                    userCodes += drGroupbyRegion["User_Code"].ToString() + "^";
                }

                if (string.IsNullOrEmpty(userCodes))
                {
                    userCodes = "^";
                }

                dsLastDcrDate = objDAL.GetLastDcrDate(companyCode, userCodes, month, year, dcrStatus, ConnectionString);

                foreach (DataRow drGroupbyRegion in dsUserInfo.Tables[0].Rows)
                {
                    sbTableContent.Append("<tr>");

                    if (!string.IsNullOrEmpty(drGroupbyRegion["User_Name"].ToString()))
                    {
                        sbTableContent.Append("<td>" + drGroupbyRegion["User_Name"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>VACANT</td>");
                    }

                    if (!string.IsNullOrEmpty(drGroupbyRegion["Employee_Name"].ToString()))
                    {
                        sbTableContent.Append("<td>" + drGroupbyRegion["Employee_Name"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>VACANT</td>");
                    }

                    sbTableContent.Append("<td>" + drGroupbyRegion["Region_Name"].ToString() + "</td>");
                    //sbTableContent.Append("<td>" + drGroupbyRegion["Reporting_Region_Name"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line1_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line2_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line3_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");


                    currentRegionCode = drGroupbyRegion["Region_Code"].ToString();

                    // Region Count & User Count
                    //regionUserCount = objDAL.GetRegionUserCount(companyCode, currentRegionCode, aggregateRegionTypeCode);
                    filteredRow = dsRvSv.Tables[0].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(currentRegionCode)).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        if (filteredRow.ItemArray.Length > 0)
                        {
                            totalRegionCnt += int.Parse(filteredRow["RegionCount"].ToString());
                            totalUserCnt += int.Parse(filteredRow["UserCount"].ToString());

                            sbTableContent.Append("<td>" + filteredRow["RegionCount"] + "</td>");
                            sbTableContent.Append("<td>" + filteredRow["UserCount"] + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>0</td>");
                            sbTableContent.Append("<td>0</td>");
                        }

                    }

                    // Last DCR submitted date
                    filteredRow = dsLastDcrDate.Tables[0].AsEnumerable().Where(a => a["User_Code"].ToString().Equals(drGroupbyRegion["User_Code"].ToString())).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        sbTableContent.Append("<td>" + filteredRow["DCR_Actual_Date"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>N/A</td>");
                    }

                    // No. of field days
                    filteredRow = dsRvSv.Tables[1].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(currentRegionCode)).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        if (filteredRow.ItemArray.Length > 0)
                        {
                            sbTableContent.Append("<td>" + filteredRow["FieldCount"] + "</td>");
                            if (!string.IsNullOrEmpty(filteredRow["FieldCount"].ToString()))
                            {
                                totalNoOfFieldDays += int.Parse(filteredRow["FieldCount"].ToString());
                            }
                        }
                        else
                        {
                            sbTableContent.Append("<td>0</td>");
                        }
                    }

                    loopCount = 0;

                    foreach (DataRow drDoctorCategory in dsDoctorCategory.Tables[0].Rows)
                    {
                        standardVisitCount = 0;
                        if (!string.IsNullOrEmpty(drDoctorCategory["Visit_Count"].ToString()))
                        {
                            standardVisitCount = Convert.ToInt16(drDoctorCategory["Visit_Count"].ToString());
                        }
                        categoryCode = drDoctorCategory["Category_Code"].ToString();

                        // Category Drs in the list
                        doctorMasterCount = 0;
                        DataRow[] drfilteredRow;
                        drfilteredRow = dsRvSv.Tables[3].AsEnumerable().Where(c => c["Category_Code"].ToString() == categoryCode && c["Parent_Region"].ToString() == currentRegionCode).ToArray();

                        if (drfilteredRow.Length > 0)
                        {
                            doctorMasterCount = Convert.ToDouble(drfilteredRow[0]["Doctor_Count"].ToString());
                        }

                        sbTableContent.Append("<td>" + doctorMasterCount + "</td>");

                        columnWiseTotal[loopCount] += Convert.ToInt16(doctorMasterCount);

                        loopCount++;

                        for (int i = 1; i <= standardVisitCount; i++)
                        {
                            // Category Drs met at least [i] time(s)
                            doctorVisitCount = 0;
                            var query = from row in dsRvSv.Tables[2].AsEnumerable()
                                        where row.Field<string>("Category_Code") == categoryCode &&
                                              row.Field<string>("Parent_Region") == currentRegionCode &&
                                              row.Field<int>("Visit_Count") >= i
                                        select row;

                            if (query != null)
                            {
                                doctorVisitCount = query.AsDataView().Count;
                            }

                            columnWiseTotal[loopCount] += Convert.ToInt16(doctorVisitCount);

                            loopCount++;

                            sbTableContent.Append("<td>" + doctorVisitCount + "</td>");

                            // Category Drs met at least [i] time(s) %
                            if (doctorMasterCount > 0 && doctorVisitCount > 0)
                            {
                                visitAvg = (doctorVisitCount / doctorMasterCount) * 100;
                                sbTableContent.Append("<td>" + visitAvg.ToString("N2") + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td>0</td>");
                            }
                        }
                    }

                    sbTableContent.Append("</tr>");
                }

                sbTableContent.Append("<tr class='totaltr'>");
                sbTableContent.Append("<td colspan='4'>Total</td>");


                sbTableContent.Append("<td>" + totalRegionCnt.ToString() + "</td>");
                sbTableContent.Append("<td>" + totalUserCnt.ToString() + "</td>");
                sbTableContent.Append("<td></td>");
                sbTableContent.Append("<td>" + totalNoOfFieldDays.ToString() + "</td>");
                loopCount = 0;

                foreach (DataRow drDoctorCategory in dsDoctorCategory.Tables[0].Rows)
                {
                    standardVisitCount = 0;

                    if (!string.IsNullOrEmpty(drDoctorCategory["Visit_Count"].ToString()))
                    {
                        standardVisitCount = Convert.ToInt16(drDoctorCategory["Visit_Count"].ToString());
                    }

                    sbTableContent.Append("<td>" + columnWiseTotal[loopCount].ToString() + "</td>");

                    loopCount++;

                    for (int i = 1; i <= standardVisitCount; i++)
                    {
                        sbTableContent.Append("<td>" + columnWiseTotal[loopCount].ToString() + "</td>");
                        sbTableContent.Append("<td></td>");

                        loopCount++;
                    }
                }

                sbTableContent.Append("</tr>");
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(companyCode, CurrentUserCode, TransNumber, sbTableContent.ToString(), ConnectionString, "CategoryWiseDrVisitAnalysis");
            }

        }

        #endregion -- CategoryWise Dr Visit Analysis

        #region ProductWise Doctor Tabular

        public ActionResult AsyncProductWiseDoctorReport()
        {
            return View();
        }

        public string ProcessProductWiseDoctorTabularReport(string userCode, string startDate, string endDate, string productSelection, string dcrStatus, string quantity)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetConnectionString_Client();

            string ReportParameters = "Start Date: " + startDate + "<br/>End Date: " + endDate + "<br/>Group By: "
                + productSelection + "<br/>DCR Status: " + dcrStatus + "<br/>Quantity: " + quantity;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "ProductWiseDoctorTabularReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);


            Task task = Task.Factory.StartNew(() =>
            {
                GetProductWiseDoctor(userCode, startDate, endDate, productSelection, dcrStatus, quantity, TransNumber, CompanyCode, CurrentUserCode, SubDomain, ConnectionString);
            });
            return TransNumber;
        }

        public void GetProductWiseDoctor(string userCode, string startDate, string endDate, string productSelection, string dcrStatus,
            string quanity, string TransNumber, string CompanyCode, string CurrentUserCode, string SubDomain, string ConnectionString)
        {
            string companyCode = CompanyCode;

            try
            {
                List<MVCModels.HiDoctor_Reports.ProductWiseDoctor> lstReportDetail = new List<MVCModels.HiDoctor_Reports.ProductWiseDoctor>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                StringBuilder sbTableContent = new StringBuilder();
                lstReportDetail = (List<MVCModels.HiDoctor_Reports.ProductWiseDoctor>)_objReport.GetProductWiseDoctorDetails(companyCode, userCode, startDate, endDate, productSelection, dcrStatus, quanity, ConnectionString);
                if (lstReportDetail != null && lstReportDetail.Count > 0)
                {

                    string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                    string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];

                    if (productSelection == "1")
                    {
                        sbTableContent.Append("<div id='DroWisepro''>");
                        sbTableContent.Append("<div class='dvHeader' id='spnDroWisepro'>");
                        sbTableContent.Append("<div class='dvheader-inner'>Doctor Wise Product Report for the Period of " + st + " " + "to" + " " + ed + "</div>");
                        //if (viewFormat == "1")
                        // {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DOCTORWISEPRODUCT','HEADER')\" />");
                        sbTableContent.Append("</div>");
                        //}
                        sbTableContent.Append("</div>");

                        sbTableContent.Append("<table id='tblDocwisePro' class='table table-striped' >");
                        sbTableContent.Append("<thead class='active'>");
                        sbTableContent.Append("<tr style='background-color: #428bca'>");
                        sbTableContent.Append("<td>Region Name</td>");
                        sbTableContent.Append("<td>Doctor Name</td>");
                        sbTableContent.Append("<td>Doctor Category</td>");
                        sbTableContent.Append("<td>Doctor Speciality</td>");
                        sbTableContent.Append("<td>Product Name</td>");
                        sbTableContent.Append("<td>Product Category</td>");
                        sbTableContent.Append("<td>Qty Provided</td>");
                        sbTableContent.Append("<td>User Name</td>");
                        sbTableContent.Append("<td> DCR Actual Date</td>");
                        sbTableContent.Append("</tr>");
                        sbTableContent.Append("</thead>");
                        sbTableContent.Append("<tbody>");

                        foreach (var product in lstReportDetail)
                        {
                            sbTableContent.Append("<tr><td>" + product.Region_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Customer_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Category_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Speciality_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Product_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Product_Category + "</td>");
                            sbTableContent.Append("<td>" + product.Quantity_Provided + "</td>");
                            sbTableContent.Append("<td>" + product.User_Name + "</td>");
                            sbTableContent.Append("<td>" + product.DCR_Actual_Date + "</td></tr>");
                        }
                    }
                    else
                    {
                        sbTableContent.Append("<div id='ProWiseDoctor''>");
                        sbTableContent.Append("<div class='dvHeader' id='spnProWiseDoctor'>");
                        sbTableContent.Append("<div class='dvheader-inner'>Product Wise Doctor Report for the Period of " + st + " " + "to" + " " + ed + "</div>");
                        // if (viewFormat == "1")
                        //{
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('PRODUCTWISEDOCTOR','HEADER')\" />");
                        sbTableContent.Append("</div>");
                        //}
                        sbTableContent.Append("</div>");
                        sbTableContent.Append("<table id='tblProwiseDoc' class='table table-striped' >");
                        sbTableContent.Append("<thead class='active'>");
                        sbTableContent.Append("<tr style='background-color: #428bca'>");
                        sbTableContent.Append("<td>Product Name</td>");
                        sbTableContent.Append("<td>Product Category</td>");
                        sbTableContent.Append("<td>Region Name</td>");
                        sbTableContent.Append("<td>Doctor Name</td>");
                        sbTableContent.Append("<td>Doctor Category</td>");
                        sbTableContent.Append("<td>Doctor Speciality</td>");
                        sbTableContent.Append("<td>Qty Provided</td>");
                        sbTableContent.Append("<td>User Name</td>");
                        sbTableContent.Append("<td> DCR Actual Date</td>");
                        sbTableContent.Append("</tr>");
                        sbTableContent.Append("</thead>");
                        sbTableContent.Append("<tbody>");

                        foreach (var product in lstReportDetail)
                        {

                            sbTableContent.Append("<tr><td>" + product.Product_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Product_Category + "</td>");
                            sbTableContent.Append("<td>" + product.Region_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Customer_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Category_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Speciality_Name + "</td>");
                            sbTableContent.Append("<td>" + product.Quantity_Provided + "</td>");
                            sbTableContent.Append("<td>" + product.User_Name + "</td>");
                            sbTableContent.Append("<td>" + product.DCR_Actual_Date + "</td></tr>");
                        }

                    }
                    sbTableContent.Append("</tbody>");
                    sbTableContent.Append("</table>");
                }
                else
                {
                    sbTableContent.Append("No data found");
                }
                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, sbTableContent.ToString(), ConnectionString, "ProductWise Doctor Tabular");

            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrentUserCode);
            }
            finally
            {
                _objDALreportRegion = null;
            }
        }

        #endregion -- ProductWise Doctor Tabular

        #region Daily Call Status Report

        public ActionResult AsyncDailyCallStatusReport()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public string ProcessDailyCallStatusReport(string regionCode, string viewFormat, string dcrStatus, string Month, string Year, string Days, string title, string SelectedUser)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetConnectionString_Client();
            string DCRStatus = string.Empty;
            string[] UserDetails = SelectedUser.Split('-');

            switch (dcrStatus)
            {
                case "1":
                    DCRStatus = "Applied";
                    break;
                case "2":
                    DCRStatus = "Approved";
                    break;
                case "3":
                    DCRStatus = "Unapproved";
                    break;
                case "4 ":
                    DCRStatus = "All";
                    break;
                default:
                    DCRStatus = "All";
                    break;
            }
            string ReportParameters = "Region Code: " + UserDetails[0] + "<br/>DCR Status: " + DCRStatus + "<br/>Month: "
                + Month + "<br/>Year: " + Year + "<br/>Selected User: " + UserDetails[1];

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "DailyCallStatusReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            //GetDailyCallStatusDetails(regionCode, viewFormat, dcrStatus, Month, Year, Days, title, SelectedUser, CompanyCode, CurrentUserCode, SubDomain, ConnectionString);

            Task task = Task.Factory.StartNew(() =>
            {
                GetDailyCallStatusDetails(regionCode, viewFormat, dcrStatus, Month, Year, Days, title, SelectedUser, CompanyCode, CurrentUserCode, SubDomain, ConnectionString, TransNumber);
            });
            return TransNumber;
        }

        public void GetDailyCallStatusDetails(string regionCode, string viewFormat, string dcrStatus, string Month, string Year, string Days, string title, string SelectedUser, string CompanyCode, string CurrentUserCode, string SubDomain, string ConnectionString, string TransNumber)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                StringBuilder strTb = new StringBuilder();
                string startDate = Year + "-" + Month + "-" + "01";
                string endDate = Year + "-" + Month + "-" + Days.ToString();
                string alRegionCodes = string.Empty;
                string dcrcheckedStatus = "";
                dcrcheckedStatus = dcrStatus + ',';
                int monthName = Convert.ToInt32(Month);
                int YearName = Convert.ToInt32(Year);
                List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> lstdailyCallstatus = _objRR.GetDoctorCallCountDetails(CompanyCode, regionCode, monthName, YearName, dcrcheckedStatus, ConnectionString).ToList();


                strTb = GetDailyCallStatusReport(lstdailyCallstatus, regionCode, startDate, endDate, Month, Year, dcrcheckedStatus, viewFormat, title, SelectedUser, CompanyCode, ConnectionString);

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, strTb.ToString(), ConnectionString, "DailyCallStatusReport");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrentUserCode);

            }
        }

        public StringBuilder GetDailyCallStatusReport(List<DocotrCallCountModel> lstdailyCallstatus, string regionCode, string startDate, string endDate, string selectMonth, string selectYear, string dcrcheckedStatus, string viewFormat, string title, string SelectedUser, string CompanyCode, string ConnectionString)
        {
            StringBuilder strTableRept = new StringBuilder();
            //DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            BLUser _objUser = new BLUser();
            string monthName = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt32(selectMonth));
            List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(CompanyCode, "", regionCode, ConnectionString).ToList();
            string seleceddcrstatus = "";
            switch (dcrcheckedStatus)
            {
                case "1,2,0,":
                    seleceddcrstatus = "Applied,Approved,Unapproved";
                    break;
                case "1,":
                    seleceddcrstatus = "Applied";
                    break;
                case "0,":
                    seleceddcrstatus = "Unapproved";
                    break;
                case "2,":
                    seleceddcrstatus = "Approved";
                    break;
                case "1,2,":
                    seleceddcrstatus = "Applied,Approved";
                    break;
                case "1,0,":
                    seleceddcrstatus = "Applied,Unapproved";
                    break;
                case "2,0,":
                    seleceddcrstatus = "Approved,Unapproved";
                    break;
                default: break;
            }
            string generateHeaderTable = _objUser.GetReportHeaderTableString(CompanyCode, "", monthName, selectYear, seleceddcrstatus, regionCode, ConnectionString).ToString();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            //string companyCode = _objCurrentInfo.GetCompanyCode();
            string strDay = "";
            string userCode = "";
            string userName = "";
            string employeeName = "";
            string userTypeName = "";
            string divName = "";
            string reportingManagerName = "";
            string sunday = "";
            string status = "";
            string tooltiptestContent = "";
            try
            {
                DateTime dtStartDate = new DateTime();
                DateTime dtEndDate = new DateTime();
                dtStartDate = Convert.ToDateTime(startDate);
                dtEndDate = Convert.ToDateTime(endDate);
                DateTime dtDCRDate = dtStartDate;
                TimeSpan ts;
                ts = dtEndDate - dtStartDate;

                List<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstChildUser = _objRR.GetChildUser(CompanyCode, ConnectionString).ToList();
                List<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstregionCodes = _objRR.GetRegionCode(CompanyCode, regionCode, ConnectionString).ToList();

                if (lstdailyCallstatus != null && lstdailyCallstatus.Count() > 0)
                {
                    int rowCount = 0;
                    dtDCRDate = dtStartDate;
                    strTableRept.Append("<div id='DailycallstatusReportDetails'>");
                    strTableRept.Append("<div class='dvHeader' id='spnDailycallstatusReportDetails'>");
                    int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(selectYear), Convert.ToInt32(selectMonth));
                    if (lstUserInfo.Count() > 0 && lstUserInfo != null)
                    {
                        strTableRept.Append("<div class='dvheader-inner'><b>" + title + " for " + SelectedUser.Split('-')[0] + " for the month of " + monthName + " - " + selectYear + "</b></div>");
                    }
                    else
                    {
                        strTableRept.Append("<div class='dvheader-inner'><b> " + title + " for " + SelectedUser.Split('-')[0] + " for the month of " + monthName + " - " + selectYear + "</b></div>");
                    }
                    if (viewFormat == "S")
                    {
                        strTableRept.Append("<div class='helpIconRpt'>");
                        strTableRept.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DAILY_CALL_STATUS_REPORT','HEADER')\" />");
                        strTableRept.Append("</div>");
                    }
                    strTableRept.Append("</div>");
                    strTableRept.Append("<br/>");
                    strTableRept.Append("<table class='table table-striped' id='DailyCallStatusReport' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr><th align='left' valign='top'>S.No</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Sales Region Name</th><th align='left' valign='top'style='width:370px;'>User Name</th><th align='left' valign='top'style='width:370px;'>Employee Name</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Designation</th><th align='left' valign='top'style='width:370px;'>Territory Name</th><th align='left' valign='top'style='width:370px;'>Division</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Reporting Manager</th><th align='left' valign='top'style='width:370px;'>Reporting to Region</th>");
                    strTableRept.Append("<th align='left' valign='top' style='width:50px;'>Day</th>");

                    for (int i = 0; i <= ts.Days; i++)
                    {
                        if (i != 0)
                        {
                            dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                        }

                        strDay = dtDCRDate.Day.ToString();
                        strTableRept.Append("<th align='left' style='width:50px;'> " + strDay + " </th>");
                    }
                    strTableRept.Append("</tr></thead><tbody>");

                    // List<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> allRegionCodes = _objRR.GetRegionCode(companyCode, regionCode).ToList();
                    foreach (var regioncodes in lstregionCodes)
                    {
                        rowCount++;

                        foreach (var DailyCallstatus in lstdailyCallstatus)
                        {
                            var filterUsers = lstChildUser.Where(s => s.Region_Code == regioncodes.Region_Code).ToList();

                            if (filterUsers.Count() > 0 && filterUsers != null)
                            {
                                userCode = filterUsers[0].User_Code.ToString();
                                userName = filterUsers[0].User_Name.ToString();
                                employeeName = filterUsers[0].Employee_Name.ToString();
                                userTypeName = filterUsers[0].User_Type_Name.ToString();
                                divName = filterUsers[0].Division_Name.ToString();
                                reportingManagerName = filterUsers[0].Reporting_Manager_Name.ToString();
                            }
                            else
                            {
                                userCode = "";
                                userName = "Vacant";
                                employeeName = "";
                                userTypeName = "";
                                divName = "";
                                reportingManagerName = "";
                            }
                            List<MVCModels.HiDoctor_Reports.HolidayDetailsModel> lstHolidayDetails = _objRR.GetHolidayDetails(CompanyCode, regioncodes.Region_Code, startDate, endDate, ConnectionString).ToList();
                            strTableRept.Append("<tr>");
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(rowCount.ToString());
                            strTableRept.Append("</td>");
                            //Sales Region Name
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(regioncodes.Region_Name);
                            strTableRept.Append("</td>");
                            //User Name
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(userName);
                            strTableRept.Append("</td>");
                            //Employee Name
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(employeeName);
                            strTableRept.Append("</td>");
                            //Designtaions
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(userTypeName);
                            strTableRept.Append("</td>");
                            //Territory Name
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(regioncodes.Region_Type_Name);
                            strTableRept.Append("</td>");
                            //Division
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(divName);
                            strTableRept.Append("</td>");
                            //Reporting Manager
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(reportingManagerName);
                            strTableRept.Append("</td>");
                            //Reporting to Region
                            strTableRept.Append("<td align='left' rowspan='2'>");
                            strTableRept.Append(regioncodes.Reporting_Manager_Region_Name);
                            strTableRept.Append("</td>");
                            strTableRept.Append("<td align='left' valign='top'>Sub.On</td>");
                            dtDCRDate = dtStartDate;
                            for (int i = 0; i <= ts.Days; i++)
                            {
                                if (i != 0)
                                {
                                    dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                                }
                                strDay = dtDCRDate.Day.ToString();
                                var filtervalues = DailyCallstatus.lstDocotorcountheaderdetails.Where(s => s.Date == strDay && s.User_Code == userCode).ToList();
                                if (filtervalues.Count() > 0)
                                {
                                    strTableRept.Append("<td align='left' style='width:50px;'> ");
                                    strTableRept.Append(filtervalues[0].DCR_Entered_Date);
                                    strTableRept.Append("</td>");
                                }
                                else
                                {
                                    strTableRept.Append("<td align='left'  style='width:50px;'>-</td>");
                                }

                            }
                            strTableRept.Append("</tr>");
                            strTableRept.Append("<tr>");
                            strTableRept.Append("<td align='left' valign='top'  style='width:50px;'>No.of.Dr.</td>");
                            dtDCRDate = dtStartDate;
                            for (int i = 0; i <= ts.Days; i++)
                            {
                                if (i != 0)
                                {
                                    dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                                }
                                sunday = "";
                                if (dtDCRDate.DayOfWeek.ToString().ToUpper() == "SUNDAY")
                                {
                                    sunday = "/S";
                                }
                                strDay = dtDCRDate.Day.ToString();
                                List<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel> filterdoctorheaderdetails = DailyCallstatus.lstDocotorcountheaderdetails.Where(s => s.Date == strDay && s.User_Code == userCode).ToList();
                                List<MVCModels.HiDoctor_Reports.DCRActiivtyDetailsModel> filteractivitydetails = DailyCallstatus.lstDcractivityDetails.Where(p => p.Date == strDay && p.User_Code == userCode).ToList();

                                if (filterdoctorheaderdetails.Count() > 0)
                                {
                                    string toolTipContent = "";
                                    string tooltipActivity = "";
                                    status = "";
                                    foreach (var doctorDetails in filterdoctorheaderdetails)
                                    {
                                        if (doctorDetails.Flag.ToUpper() == "F")
                                        {
                                            List<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> drfilterDoctorvisitDetails = DailyCallstatus.lstDoctorvisitDetails.Where(s => s.Date == strDay && s.User_Code == userCode).ToList();
                                            if (drfilterDoctorvisitDetails.Count() > 0)
                                            {
                                                toolTipContent = "<div>";
                                                toolTipContent += GenerateToolTip(drfilterDoctorvisitDetails) + "</div>";
                                                if (((string.IsNullOrEmpty(doctorDetails.Person_Code) || doctorDetails.Person_Code == "n/a") && (doctorDetails.Flag.ToUpper() == "F")) && ((string.IsNullOrEmpty(doctorDetails.Acc2_User_Code) || doctorDetails.Acc2_User_Code.ToString().Trim() == "n/a") && (doctorDetails.Flag.ToUpper() == "F")) && ((string.IsNullOrEmpty(doctorDetails.Acc3_Person) || doctorDetails.Acc3_Person == "n/a") && (doctorDetails.Flag == "F")) && ((string.IsNullOrEmpty(doctorDetails.Acc4_Person) || doctorDetails.Acc4_Person == "n/a") && (doctorDetails.Flag.ToUpper() == "F")))
                                                {
                                                    status += drfilterDoctorvisitDetails.Count() + "/I/";
                                                }
                                                else
                                                {
                                                    status += drfilterDoctorvisitDetails.Count() + "/";
                                                }
                                            }
                                            else
                                            {
                                                status += "F/";
                                            }
                                        }
                                        else if (doctorDetails.Flag == "L")
                                        {
                                            status += "L/";
                                        }
                                        else if (doctorDetails.Flag == "A")
                                        {
                                            tooltipActivity = "<div>";
                                            tooltipActivity += GenerateActivityTooltip(filteractivitydetails) + "</div>";
                                            status += "A/";
                                        }
                                    }
                                    if (dtDCRDate.DayOfWeek.ToString().ToUpper() == "SUNDAY")
                                    {
                                        status += "S/";
                                    }
                                    if (!string.IsNullOrEmpty(status))
                                    {
                                        status = status.TrimEnd('/');
                                    }
                                    else
                                    {
                                        status = "-";
                                    }
                                    if (!string.IsNullOrEmpty(toolTipContent) || !string.IsNullOrEmpty(tooltipActivity))
                                    {
                                        toolTipContent = toolTipContent + tooltipActivity;
                                        tooltiptestContent = "<a style='text-decoration:underline;cursor:pointer' onmouseover=\"Tip('" + toolTipContent + "')\" onmouseout=\"UnTip()\"> " + status + " </a>";
                                        strTableRept.Append("<td class='td-a' align='left' style='width:50px;'> " + tooltiptestContent + " </td>");
                                    }
                                    else
                                    {
                                        strTableRept.Append("<td> " + status + " </td>");
                                    }
                                }
                                else
                                {
                                    if (string.IsNullOrEmpty(sunday))
                                    {
                                        List<MVCModels.HiDoctor_Reports.HolidayDetailsModel> filterHolidayDetails = lstHolidayDetails.Where(s => s.Date == strDay).ToList();
                                        if (filterHolidayDetails.Count() > 0)
                                        {
                                            strTableRept.Append("<td align='left' style='width:50px;'>H</td>");
                                        }
                                        else
                                        {
                                            strTableRept.Append("<td align='left' style='width:50px;'>-</td>");
                                        }
                                    }
                                    else
                                    {
                                        strTableRept.Append("<td align='left' style='width:50px;'>S</td>");
                                    }

                                }

                            }
                            strTableRept.Append("</tr>");
                        }
                    }
                }

                else
                {
                    strTableRept.Append("No Records To Display.");
                }
                strTableRept.Append("</tbody>");
                strTableRept.Append("</table>");

                return strTableRept;
            }
            catch (Exception ex)
            {
                //Dictionary<string, string> dicContext = new Dictionary<string, string>();
                //dicContext.Add("regionCode", regionCode);
                //dicContext.Add("startDate", startDate);
                //dicContext.Add("endDate", endDate);
                //dicContext.Add("dcrcheckedStatus", dcrcheckedStatus);
                //DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw ex;
            }
        }

        /// <summary>
        /// Generate Tooltip
        /// </summary>
        /// <param name="drfilterDoctorvisitDetails"></param>
        /// <returns></returns>
        public string GenerateToolTip(List<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> drfilterDoctorvisitDetails)
        {
            StringBuilder strTblTooltip = new StringBuilder();
            Regex regExInt = new Regex("^([0-9]*)$");
            try
            {
                strTblTooltip.Append("<table>");
                strTblTooltip.Append("<thead><tr>");
                strTblTooltip.Append("<th><p><b><u>Doctor Name</u></b></p></th><th><p><b><u>MDL Number</u></b></p></th><th><p><b><u>Speciality Name</u></b></p></th>");
                strTblTooltip.Append("</tr></thead>");
                strTblTooltip.Append("<tbody>");
                if (drfilterDoctorvisitDetails != null && drfilterDoctorvisitDetails.Count() > 0)
                {
                    foreach (var DocotorvisitDetails in drfilterDoctorvisitDetails)
                    {
                        strTblTooltip.Append("<tr>");
                        strTblTooltip.Append("<td> " + DocotorvisitDetails.Doctor_Name + " </td>");

                        if (!string.IsNullOrEmpty(DocotorvisitDetails.MDL_Number))
                        {
                            if (regExInt.IsMatch(DocotorvisitDetails.MDL_Number))
                            {
                                strTblTooltip.Append("<td> " + Convert.ToInt64(DocotorvisitDetails.MDL_Number) + " </td>");
                            }
                            else
                            {
                                strTblTooltip.Append("<td> " + DocotorvisitDetails.MDL_Number + " </td>");
                            }
                        }
                        else
                        {
                            strTblTooltip.Append("<td >-</td>");
                        }
                        strTblTooltip.Append("<td> " + DocotorvisitDetails.Speciality_Name + " </td>");

                        strTblTooltip.Append("</tr>");
                    }
                }
                strTblTooltip.Append("</tbody>");
                strTblTooltip.Append("</table>");

                return strTblTooltip.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        public string GenerateActivityTooltip(List<MVCModels.HiDoctor_Reports.DCRActiivtyDetailsModel> lstActivity)
        {
            StringBuilder strTbActive = new StringBuilder();
            try
            {
                strTbActive.Append("<table>");
                strTbActive.Append("<thead><tr>");
                strTbActive.Append("<th><p><b><u>Attendance Activity Name</u></b></p></th>");
                strTbActive.Append("</tr></thead>");
                strTbActive.Append("<tbody>");
                if (lstActivity != null && lstActivity.Count() > 0)
                {
                    foreach (var ActivityDetails in lstActivity)
                    {

                        strTbActive.Append("<tr>");
                        if (!string.IsNullOrEmpty(ActivityDetails.Activity_Name))
                        {
                            strTbActive.Append("<td> " + ActivityDetails.Activity_Name + " </td>");
                        }
                        else
                        {
                            strTbActive.Append("<td>No Activity</td>");
                        }
                        strTbActive.Append("</tr>");
                    }
                }
                strTbActive.Append("</tbody>");
                strTbActive.Append("</table>");

                return strTbActive.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        #endregion Daily Call Status Report

        #region Last Submitted Quick Ref

        public ActionResult AsyncLastSubmittedQuickRef()
        {
            return View();
        }

        public string ProcessAsyncLastSubmittedQuickRefReport(string userCodes, string startDate, string endDate, string viewFormat)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetConnectionString_Client();
            string ReportParameters = "Start Date: " + startDate + "<br/>End Date: " + endDate;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "LastSubmittedQuickRef", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            //AsyncGetLastSubmittedQuickReferenceDetails(userCodes, startDate, endDate, viewFormat, CompanyCode, CurrentUserCode, SubDomain, ConnectionString, TransNumber);

            Task task = Task.Factory.StartNew(() =>
            {
                AsyncGetLastSubmittedQuickReferenceDetails(userCodes, startDate, endDate, viewFormat, CompanyCode, CurrentUserCode, ConnectionString, TransNumber);
            });
            return TransNumber;
        }

        public void AsyncGetLastSubmittedQuickReferenceDetails(string userCodes, string startDate, string endDate, string viewFormat, string CompanyCode, string CurrentUserCode, string ConnectionString, string TransNumber)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                List<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> lstLastSubmitted = _objRR.GetLastSubmittedQuickrefDetails(CompanyCode, userCodes, startDate, endDate, ConnectionString).ToList();

                string lastSubmittedTable = GetLastSubmittedQuickReferenceReport(lstLastSubmitted, startDate, endDate, CompanyCode, ConnectionString).ToString();

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, lastSubmittedTable, ConnectionString, "LastSubmittedQuickRef");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrentUserCode);
                //return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetLastSubmittedQuickReferenceReport(List<DCRLastSubmittedQuickRefReportModel> lstLastSubmitted, string startDate, string endDate, string CompanyCode, string ConnectionString)
        {
            StringBuilder strTableRept = new StringBuilder();

            try
            {
                if (lstLastSubmitted != null && lstLastSubmitted.Count() > 0)
                {
                    int i = 0;
                    strTableRept.Append("<div id='LastSubmitted Quick Reference'>");
                    strTableRept.Append("<div class='dvHeader' id='spnLastsubmittedquickref'>");

                    strTableRept.Append("<div class='dvheader-inner'>Last Submitted Quick Reference of  For the Period of " + startDate + " " + "to" + " " + endDate + "</div>");
                    strTableRept.Append("<div class='helpIconRpt'>");
                    strTableRept.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('LAST_SUBMITTED_QUICK_REFERENCE_REPORT','HEADER')\" />");
                    strTableRept.Append("</div>");
                    strTableRept.Append("</div>");
                    strTableRept.Append("<br/>");
                    strTableRept.Append("<div style='font-weight: bold;font-style:italic'>Last DCR Entered On is applicable for all activities recorded (Field / Attendance as well as Leave)</div>");
                    strTableRept.Append("<table id='LastSubmittedQuickRef' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead class='active'><tr><th>User Name</th><th>Employee Name</th><th>Employee Number</th>");
                    strTableRept.Append("<th>Designation</th><th>Region Name</th><th>Division Name</th>");
                    strTableRept.Append("<th>Reporting Manager</th><th>Reporting Manager Territory Name</th><th>Last DCR Entered On</th><th>Last DCR Activity</th><th>Last DCR Status</th></tr></thead><tbody>");
                    foreach (var lastSubmitted in lstLastSubmitted)
                    {
                        i++;
                        //if (string.IsNullOrEmpty(lastSubmitted.User_Name))
                        //{
                        //    strTableRept.Append("<tr><td id='User_Name" + i + "'>" + "(Vacant Region)" + "</td>");
                        //}
                        //else
                        //{
                        strTableRept.Append("<tr><td id='User_Name" + i + "'>" + lastSubmitted.User_Name + "</td>");
                        //}
                        strTableRept.Append("<td id='Employee_Name" + i + "'>" + lastSubmitted.Employee_Name + "</td>");
                        strTableRept.Append("<td id='Employee_Number" + i + "'>" + lastSubmitted.Employee_Number + "</td>");
                        strTableRept.Append("<td id='UserType_Name" + i + "'>" + lastSubmitted.User_Type_Name + "</td>");
                        strTableRept.Append("<td id='User_Type_Name" + i + "'>" + lastSubmitted.Region_Name + "</td>");
                        strTableRept.Append("<td id='Reports_To" + i + "'>" + lastSubmitted.Division_Name + "</td>");
                        strTableRept.Append("<td id='Region_Name" + i + "'>" + lastSubmitted.Reports_To + "</td>");
                        strTableRept.Append("<td id='Reports_To" + i + "'>" + lastSubmitted.Reports_Manager_Region + "</td>");
                        strTableRept.Append("<td id='Region_Name" + i + "'>" + lastSubmitted.DCR_Actual_Date + "</td>");
                        strTableRept.Append("<td id='Reports_To" + i + "'>" + lastSubmitted.Flag + "</td>");
                        strTableRept.Append("<td id='DCR_Actual_Date" + i + "'>" + lastSubmitted.Status + "</td>");
                    }
                    strTableRept.Append("</tbody>");
                    strTableRept.Append("</table>");
                }
                else
                {
                    strTableRept.Append("<div class='col-lg-12 form-group'>No Records To Display.</div>");
                }
                return strTableRept;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        #endregion

        #region last submitted calci report

        public ActionResult AsyncLastSubmittedCalciReport()
        {
            return View();
        }

        public string ProcessLastSubmittedCalciReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetConnectionString_Client();
            string Month = collection["month"].ToString();
            string Year = collection["year"].ToString();
            string UserCode = collection["userCode"].ToString();
            string UnListedDoctor = collection["type"].ToString();
            string DateSelection = collection["selectionType"].ToString();
            string ReportName = collection["title"].ToString();
            string MissedDoctor = collection["missed"].ToString();
            string ReportViewType = collection["reportViewType"].ToString();
            string ChildUserCounts = collection["childUsersCount"].ToString();

            string ReportParameters = "Month: " + Month + "<br/>Year: " + Year + "<br/>Un Listed Doctor: " + UnListedDoctor + "<br/>Include Missed Doctors: " + MissedDoctor;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "LastSubmittedCalciReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            //GetLastSubmittedReportCalci(Month, Year, UserCode, UnListedDoctor, DateSelection, MissedDoctor, ChildUserCounts, CompanyCode, ConnectionString, TransNumber, CurrentUserCode);


            Task task = Task.Factory.StartNew(() =>
            {
                GetLastSubmittedReportCalci(Month, Year, UserCode, UnListedDoctor, DateSelection, MissedDoctor, ChildUserCounts, CompanyCode, ConnectionString, TransNumber, CurrentUserCode);
            });
            return TransNumber;
        }

        public void GetLastSubmittedReportCalci(string Month, string Year, string UserCode, string UnListedDoctor, string DateSelection,
            string MissedDoctor, string childUsercounts, string CompanyCode, string ConnectionString, string TransNumber, string CurrentUserCode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string UserSelection = string.Empty;
            int days = DateTime.DaysInMonth(Convert.ToInt32(Year), Convert.ToInt32(Month));
            string selectedDate = Year + "-" + Month + "-" + days;

            try
            {
                List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount> lstChildusers = (List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount>)JsonConvert.DeserializeObject(childUsercounts,
                      typeof(List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount>));
                if (UserCode.ToUpper() == "ALL")
                {
                    UserCode = CurrentUserCode;
                    UserSelection = "ALL";
                }
                else
                {
                    UserCode = UserCode.Replace(",,", ",");
                }
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lstLastSubmitted = _objReport.GetlastsubmittedDetail(CompanyCode, UserCode, Month, Year, UserSelection, selectedDate, ConnectionString);
                sbTableContent = GetLastSubmittedTable(lstLastSubmitted, lstChildusers, UnListedDoctor, Month, Year, MissedDoctor);

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, sbTableContent.ToString(), ConnectionString, "LastSubmittedCalciReport");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrentUserCode);
            }
            finally
            {
                _objDoctorVisit = null;
                _objDALreportRegion = null;
                objAsyncAPI = null;
            }

        }

        public StringBuilder GetLastSubmittedTable(List<LastSubmittedReportModel> lstLastSubmitted, List<LastSubmittedChildUserCount> lstChildUsers, string unlistedDoc, string month, string year, string missedDoctor)
        {
            int chemistCallCount = 0;
            int doctorCallCount = 0;
            int doctorMetCOunt = 0;
            double fieldDays = 0.0;
            double ChemistCallAvg = 0.0;
            double doctorCallAvg = 0.0;
            double doctorMetAvg = 0.0;
            string dcrActivity = string.Empty;
            string divisionName = string.Empty;
            string lastSubmittedDate = string.Empty;
            StringBuilder sbTableContent = new StringBuilder();
            List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount> lstChildUserscounts = new List<LastSubmittedChildUserCount>();

            string monthName = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt32(month));
            int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(year), Convert.ToInt32(month));
            DateTime dt = new DateTime(Convert.ToInt32(year), Convert.ToInt32(month), 1);
            int weekInMonth = (dt.Day + ((int)dt.DayOfWeek)) / 7 + 1;
            //string weekInMonth = string.Empty;
            for (int i = 0; i < daysInMonth; i++)
            {
                if (dt.AddDays(i).DayOfWeek == DayOfWeek.Monday)
                {
                    weekInMonth++;
                }
            }
            sbTableContent.Append("<div><b> Last Submitted Calci Report for month of " + monthName + " - " + year + "</b></div>");

            sbTableContent.Append("<div style='margin-left: 7px;'>");
            sbTableContent.Append("<lable>1. Only approved DCRs are considered in this report</lable></br>");
            sbTableContent.Append("<lable>2.<span style='font-weight:bold;'>Count of Missed Doctors</span> is the Number of Doctors never visited even once in the selected date period.</lable></br>");
            sbTableContent.Append("<lable>3.<span style='font-weight:bold;'>Listed Doctors Visited Once</span> is the Number of Doctors visited only once in the selected date period. REPEAT for twice and thrice and more than thrice.</lable></br>");
            sbTableContent.Append("<lable>4.<span style='font-weight:bold;'>Count of Listed Doctors Met</span> is the Number of Doctors Met in the selected date period.</lable></br>");
            sbTableContent.Append("<lable>5.<span style='font-weight:bold;'>Average Number of Listed Doctors</span> Met is Listed Doctors Met / Num. of Field Days.</lable></br>");
            sbTableContent.Append("</div>");
            sbTableContent.Append("</br>");

            sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='LastSubmittedCalciReport'>");
            sbTableContent.Append("<thead><tr>");
            sbTableContent.Append("<th align='left' width='15%'>User Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Employee Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Employee Number</th>");
            sbTableContent.Append("<th align='left' width='15%'>Designation</th>");
            sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Division Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
            sbTableContent.Append("<th align='left' width='15%'>Reporting Manager Region</th>");
            sbTableContent.Append("<th align='left' width='15%'>Date of Joining</th>");
            sbTableContent.Append("<th align='left' width='15%'>DCR Record Till</th>");
            sbTableContent.Append("<th align='left' width='15%'>Last DCR Activity</th>");
            sbTableContent.Append("<th align='left' width='15%'>Last DCR Status</th>");
            if (missedDoctor.ToUpper() == "MISSED")
            {
                sbTableContent.Append("<th align='left' width='15%'>Missed Doctors</th>");
            }

            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Once Visit</th>");
            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Twice Visit</th>");
            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Thrice Visit</th>");
            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Visited More Than Thrice Visit</th>");
            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Met</th>");
            sbTableContent.Append("<th align='left' width='15%'>Listed Doctors Calls Made</th>");
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

            if (lstLastSubmitted.Count > 0 && lstLastSubmitted[0].lstLastsubleave.ToList().Count > 0)
            {
                foreach (var levetypeName in lstLastSubmitted[0].lstLastsubleave)
                {
                    sbTableContent.Append("<th align='left' width='15%'>");
                    sbTableContent.Append(levetypeName.Leave_Type_Name);
                    sbTableContent.Append("</th>");
                }
            }
            sbTableContent.Append("<th align='left' width='15%'>Chemist Calls made</th>");
            sbTableContent.Append("<th align='left' width='15%'>Chemist Avg</th>");
            sbTableContent.Append("<th align='left' width='15%'>Chem. POB</th>");
            sbTableContent.Append("<th align='left' width='15%'>Stock. POB</th>");
            sbTableContent.Append("<th align='left' width='15%'>Stock. Collection</th>");
            sbTableContent.Append("<th align='left' width='15%'>Total Expenses</th>");
            sbTableContent.Append("</thead>");
            sbTableContent.Append("<tbody>");
            if (lstLastSubmitted.Count > 0 && lstLastSubmitted[0].lstLastSubUserDetail.ToList().Count > 0)
            {
                foreach (var userinfo in lstLastSubmitted[0].lstLastSubUserDetail)
                {
                    if (lstChildUsers != null && lstChildUsers.Count > 0)
                    {
                        lstChildUserscounts = lstChildUsers.Where(t => t.User_Code == userinfo.User_Code).ToList();
                    }
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    //sbTableContent.Append("<td align='left' width='15%'  style='text-decoration:underline;' class='td-a' onclick='fnComprehensiveAnalysisReportPop(\"" + userinfo.User_Code + "\")'>");
                    sbTableContent.Append(userinfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    //Employee Number
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Employee_Number);
                    sbTableContent.Append("</td>");
                    //Designtaion
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.User_Type_Name);
                    sbTableContent.Append("</td>");
                    //Region name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Region_Name);
                    sbTableContent.Append("</td>");
                    // Division Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    if (!string.IsNullOrEmpty(userinfo.Division_Name))
                    {
                        divisionName = userinfo.Division_Name.ToString();
                    }
                    sbTableContent.Append(divisionName);
                    sbTableContent.Append("</td>");
                    //Manager Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    //Manager Designation Name
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    //DOJ
                    sbTableContent.Append("<td align='left' width='15%'>");
                    if (!string.IsNullOrEmpty(userinfo.Date_of_joining))
                    {
                        sbTableContent.Append(userinfo.Date_of_joining);
                    }
                    sbTableContent.Append("</td>");

                    var filtered = lstLastSubmitted[0].lstLastSubheader.Where(p => p.User_Code == userinfo.User_Code.ToString()).ToList();

                    if (filtered.Count > 0)
                    {
                        lastSubmittedDate = "";
                        //Last submit dcr enter on
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Last_Submitted_Date);
                        sbTableContent.Append("</td>");
                        if (!string.IsNullOrEmpty(filtered[0].Last_Submitted_Date))
                        {
                            lastSubmittedDate = filtered[0].Last_Submitted_Date.ToString();
                        }
                        var fileredActivities = lstLastSubmitted[0].lstLastActivities.Where(p => p.User_Code == userinfo.User_Code.ToString() && p.Dcr_Actual_Date == lastSubmittedDate).ToList();
                        if (fileredActivities.Count > 0)
                        {
                            dcrActivity = "";

                            foreach (var activity in fileredActivities)
                            {
                                if (activity.flag.ToUpper() == "F")
                                {
                                    dcrActivity = "Field" + ',';
                                }
                                if (activity.flag.ToUpper() == "L")
                                {
                                    dcrActivity = "Leave" + ',';
                                }
                                if (activity.flag.ToUpper() == "A")
                                {
                                    dcrActivity = "Attendance" + ',';
                                }
                            }
                        }
                        //Last dcr activity
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(dcrActivity))
                        {
                            dcrActivity = dcrActivity.TrimEnd(',');
                        }
                        sbTableContent.Append(dcrActivity);
                        sbTableContent.Append("</td>");
                        //Last DCR Status
                        if (!string.IsNullOrEmpty(dcrActivity))
                        {
                            sbTableContent.Append("<td align='left' width='15%'>Approved</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td align='left' width='15%'></td>");
                        }
                        if (missedDoctor.ToUpper() == "MISSED")
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                            {
                                sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                                sbTableContent.Append(userinfo.Region_Code);
                                sbTableContent.Append("_");
                                sbTableContent.Append(userinfo.User_Code);
                                sbTableContent.Append("_");
                                sbTableContent.Append(month);
                                sbTableContent.Append("_");
                                sbTableContent.Append(year);
                                sbTableContent.Append("_MISSED_MISSED_0_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                                sbTableContent.Append(filtered[0].Missed_Doctors_Count);
                                sbTableContent.Append("</span>");
                            }
                            else
                            {
                                sbTableContent.Append(filtered[0].Missed_Doctors_Count);
                            }

                            // sbTableContent.Append(filtered[0].Missed_Doctors_Count);
                            sbTableContent.Append("</td>");
                        }
                    }
                    else
                    {
                        //Last dcr entered on
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Last dcr activity
                        sbTableContent.Append("<td align='left' width='15%'></td>");
                        //Last dcr status
                        sbTableContent.Append("<td align='left' width='15%'></td>");
                        if (missedDoctor.ToUpper() == "MISSED")
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            sbTableContent.Append("</td>");
                        }
                    }
                    // once visit

                    LastSubmittedDoctorModel DoctorVisits = lstLastSubmitted[0].lstLastSubdoctor.Where(p => p.Region_Code == userinfo.Region_Code.ToString()).FirstOrDefault();
                    if (DoctorVisits != null && DoctorVisits.OneVisit > 0)
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            sbTableContent.Append("_ONCE_VISIT_1_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorVisits.OneVisit);
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append(DoctorVisits.OneVisit);
                        }
                        //  sbTableContent.Append(filterDoctorVisitOnce.Count);
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                    }
                    // Twice visit
                    // var filterDoctorVisitTwice = lstLastSubmitted[0].lstLastSubdoctor.Where(p => p.Region_Code == userinfo.Region_Code.ToString() && p.Doctor_Visits == "2").ToList();
                    if (DoctorVisits != null && DoctorVisits.TwoVisit > 0)
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            sbTableContent.Append("_TWICE_VISIT_2_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorVisits.TwoVisit);
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append(DoctorVisits.TwoVisit);
                        }
                        //  sbTableContent.Append(filterDoctorVisitTwice.Count);
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                    }
                    // Thrice visit
                    // var filterDoctorVisitThrice = lstLastSubmitted[0].lstLastSubdoctor.Where(p => p.Region_Code == userinfo.Region_Code.ToString() && p.Doctor_Visits == "3").ToList();
                    if (DoctorVisits != null && DoctorVisits.ThreeVisit > 0)
                    {
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            sbTableContent.Append("_THRICE_VISIT_3_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(DoctorVisits.ThreeVisit);
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            sbTableContent.Append(DoctorVisits.ThreeVisit);
                        }
                        // sbTableContent.Append(filterDoctorVisitThrice.Count);
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                    }
                    // More than Thrice visit
                    // var filterDoctorVisitMoreThanThrice = lstLastSubmitted[0].lstLastSubdoctor.Where(p => p.Region_Code == userinfo.Region_Code.ToString() && Convert.ToInt32(p.Doctor_Visits) >= 4).ToList();
                    int MoreThanThriceVisit = 0;
                    if (DoctorVisits != null)
                    {
                        MoreThanThriceVisit = DoctorVisits.FourVisit + DoctorVisits.FiveVisit + DoctorVisits.SixVisit + DoctorVisits.SevenVisit + DoctorVisits.EightVisit;
                    }
                    if (MoreThanThriceVisit > 0)
                    {

                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            sbTableContent.Append("_MORETHRICE_MORE_0_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(MoreThanThriceVisit);
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append(MoreThanThriceVisit);
                        }
                        //  sbTableContent.Append(filterDoctorVisitThrice.Count);
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                    }

                    if (filtered.Count > 0)
                    {
                        doctorMetCOunt = 0;
                        int listedDoctorvisitcount = 0;
                        int unlistedDoctorvisitcount = 0;
                        int Doctorvisitcount = 0;
                        if (!string.IsNullOrEmpty(filtered[0].Unlisted_Doctor_Calls_Made))
                        {
                            unlistedDoctorvisitcount = Convert.ToInt32(filtered[0].Unlisted_Doctor_Calls_Made);
                        }
                        if (!string.IsNullOrEmpty(filtered[0].Unique_Doctor_Visited_Count))
                        {
                            listedDoctorvisitcount = Convert.ToInt32(filtered[0].Unique_Doctor_Visited_Count);
                            Doctorvisitcount = listedDoctorvisitcount - unlistedDoctorvisitcount;

                        }
                        // Unique_Doctor_Visited_Count
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            // sbTableContent.Append(filtered[0].Unique_Doctor_Visited_Count);
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            //Doctors Met
                            sbTableContent.Append("_DOCTORMET_MET_0_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            sbTableContent.Append(Doctorvisitcount);
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append(Doctorvisitcount);
                        }
                        sbTableContent.Append("</td>");

                        // Listed_Doctor_Calls_Made
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                        {
                            sbTableContent.Append("<span onclick='fnLastSubmittedPopupCalc(\"");
                            sbTableContent.Append(userinfo.Region_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(userinfo.User_Code);
                            sbTableContent.Append("_");
                            sbTableContent.Append(month);
                            sbTableContent.Append("_");
                            sbTableContent.Append(year);
                            sbTableContent.Append("_DOCTORMADE_MADE_0_" + divisionName + "\")' style='text-decoration:underline;cursor:pointer'>");
                            if (!string.IsNullOrEmpty(filtered[0].Listed_Doctor_Calls_Made))
                            {
                                sbTableContent.Append(filtered[0].Listed_Doctor_Calls_Made);
                            }
                            sbTableContent.Append("</span>");
                        }
                        else
                        {
                            sbTableContent.Append(filtered[0].Listed_Doctor_Calls_Made);
                        }
                        sbTableContent.Append("</td>");
                        doctorCallCount = 0;
                        chemistCallCount = 0;
                        fieldDays = 0.0;
                        ChemistCallAvg = 0.0;
                        doctorCallAvg = 0.0;

                        if (!string.IsNullOrEmpty(filtered[0].Listed_Doctor_Calls_Made))
                        {
                            doctorCallCount = Convert.ToInt32(filtered[0].Listed_Doctor_Calls_Made);
                        }

                        if (!string.IsNullOrEmpty(filtered[0].Total_Field_Days))
                        {
                            fieldDays = Convert.ToDouble(filtered[0].Total_Field_Days);
                        }

                        //Unlisted_Doctor_Calls_Made
                        if (unlistedDoc.ToUpper() == "INCLUDE")
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            sbTableContent.Append(filtered[0].Unlisted_Doctor_Calls_Made);
                            sbTableContent.Append("</td>");

                            if (!string.IsNullOrEmpty(filtered[0].Unlisted_Doctor_Calls_Made))
                            {
                                doctorCallCount += Convert.ToInt32(filtered[0].Unlisted_Doctor_Calls_Made);
                            }
                        }

                        // Doctor Call Avg
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (doctorCallCount > 0 && fieldDays > 0)
                        {
                            doctorCallAvg = (Convert.ToDouble(doctorCallCount) / fieldDays);
                            sbTableContent.Append(doctorCallAvg.ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                        //Average number of listed doctors met
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (Doctorvisitcount > 0 && fieldDays > 0)
                        {

                            doctorMetAvg = (Convert.ToDouble(Doctorvisitcount) / fieldDays);
                            sbTableContent.Append(doctorMetAvg.ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                        //Doctor POB Amount
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Total_Doctor_POB);
                        sbTableContent.Append("</td>");

                        //Total No of Days
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(daysInMonth);
                        sbTableContent.Append("</td>");

                        //Weekend off days
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(filtered[0].Weekend_Off_Days))
                        {
                            sbTableContent.Append(filtered[0].Weekend_Off_Days);
                        }
                        else
                        {
                            int weeks = weekInMonth - 1;
                            sbTableContent.Append(weeks);
                        }
                        sbTableContent.Append("</td>");

                        //Holiday
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Holiday);
                        sbTableContent.Append("</td>");

                        //Field
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Total_Field_Days);
                        sbTableContent.Append("</td>");

                        //Attendance
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Total_Attendance_Days);
                        sbTableContent.Append("</td>");

                        //Leave
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Total_Leave_Days);
                        sbTableContent.Append("</td>");


                        if (lstLastSubmitted.Count > 0 && lstLastSubmitted[0].lstLastsubleave.ToList().Count > 0)
                        {
                            foreach (var levetypeName in lstLastSubmitted[0].lstLastsubleave)
                            {
                                var filterLeave = lstLastSubmitted[0].lstLastsubleaveCount.Where(p => p.User_Code == userinfo.User_Code.ToString() && p.Leave_Type_Code == levetypeName.Leave_Type_Code.ToString()).ToList();
                                if (filterLeave.Count > 0)
                                {
                                    sbTableContent.Append("<td align='center' width='15%'>");
                                    if (lstChildUserscounts.Count > 0 && lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
                                    {

                                        sbTableContent.Append("<span onclick='fnLeaveDetailPopUp(\"");
                                        sbTableContent.Append(filterLeave[0].Leave_Type_Code);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(userinfo.User_Code);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(year + "-" + month + "-01");
                                        sbTableContent.Append("_");

                                        sbTableContent.Append(year + "-" + month + "-" + daysInMonth);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(userinfo.Region_Code);
                                        sbTableContent.Append("_");
                                        sbTableContent.Append(levetypeName.Leave_Type_Name + "\")' style='text-decoration:underline;cursor:pointer'>");
                                        sbTableContent.Append(filterLeave[0].Leave_Count);
                                        sbTableContent.Append("</span>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append(filterLeave[0].Leave_Count);
                                    }
                                    sbTableContent.Append("</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='left' width='15%'>0</td>");
                                }
                            }
                        }

                        //Chemist Calls made
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(filtered[0].Total_Chemist_Calls_Made);
                        sbTableContent.Append("</td>");

                        if (!string.IsNullOrEmpty(filtered[0].Total_Chemist_Calls_Made))
                        {
                            chemistCallCount = Convert.ToInt32(filtered[0].Total_Chemist_Calls_Made);
                        }

                        //Chemeist Avg
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (doctorCallCount > 0 && fieldDays > 0)
                        {
                            ChemistCallAvg = (Convert.ToDouble(chemistCallCount) / fieldDays);
                            sbTableContent.Append(ChemistCallAvg.ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        // Unique_Doctor_Visited_Count
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        // Listed_Doctor_Calls_Made
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Unlisted_Doctor_Calls_Made
                        if (unlistedDoc.ToUpper() == "INCLUDE")
                        {
                            sbTableContent.Append("<td align='left' width='15%'>");
                            sbTableContent.Append("</td>");
                        }
                        // Doctor Call Avg
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Average no of doctors met
                        sbTableContent.Append("<td align='left' width='15%'></td>");
                        //Doctor POB amount
                        sbTableContent.Append("<td align='left' width='15%'></td>");

                        //Total No of Days
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(daysInMonth);
                        sbTableContent.Append("</td>");

                        //Weekend off days
                        sbTableContent.Append("<td align='left' width='15%'>");
                        int weeks = weekInMonth - 1;
                        sbTableContent.Append(weeks);
                        sbTableContent.Append("</td>");

                        //Holiday
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");

                        //Field
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");

                        //Attendance
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Leave
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");

                        //casual leave or maternity leave or compensatory leave etc
                        if (lstLastSubmitted.Count > 0 && lstLastSubmitted[0].lstLastsubleave.ToList().Count > 0)
                        {
                            foreach (var levetypeName in lstLastSubmitted[0].lstLastsubleave)
                            {
                                var filterLeave = lstLastSubmitted[0].lstLastsubleaveCount.Where(p => p.User_Code == userinfo.User_Code.ToString() && p.Leave_Type_Code == levetypeName.Leave_Type_Code.ToString()).ToList();
                                if (filterLeave.Count == 0)
                                {
                                    sbTableContent.Append("<td align='left' width='15%'>");
                                    sbTableContent.Append("</td>");
                                }
                            }
                        }
                        //Chemist Calls made
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");

                        //Chemeist Avg
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                    }
                    if (filtered.Count > 0)
                    {
                        //Chem. POB
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(filtered[0].Total_Chemist_POB))
                        {
                            sbTableContent.Append(Convert.ToDouble(filtered[0].Total_Chemist_POB).ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                        //Stock. POB
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(filtered[0].Total_Stockist_POB))
                        {
                            sbTableContent.Append(Convert.ToDouble(filtered[0].Total_Stockist_POB).ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                        //Stock. Collection
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(filtered[0].Total_Stockist_Collection))
                        {
                            sbTableContent.Append(Convert.ToDouble(filtered[0].Total_Stockist_Collection).ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                        //Total Expenses
                        sbTableContent.Append("<td align='left' width='15%'>");
                        if (!string.IsNullOrEmpty(filtered[0].Total_Expense))
                        {
                            sbTableContent.Append(Convert.ToDouble(filtered[0].Total_Expense).ToString("N2"));
                        }
                        sbTableContent.Append("</td>");
                    }
                    else
                    {

                        //Chem. POB
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Stock. POB
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Stock. Collection
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("</td>");
                        //Total Expenses
                        sbTableContent.Append("<td align='left' width='15%'>");

                        sbTableContent.Append("</td>");
                    }

                    sbTableContent.Append("</tr>");
                }
            }
            else
            {
                sbTableContent.Append("No data found.");
            }

            return sbTableContent;


        }

        #endregion last submitted calci report

        #region TP Vs Actual Summary Report

        public ActionResult AsyncTPvsActualSummaryReport()
        {
            return View();
        }

        public string ProcessTPvsActualSummaryReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetConnectionString_Client();
            string UserCode = collection["userCode"];
            int SelectedMonth = Convert.ToInt32(collection["month"]);
            int SelectedYear = Convert.ToInt32(collection["year"]);
            string ReportParameters = "Selected Month: " + SelectedMonth + "<br/>Selected Year: " + SelectedYear + "<br/>User Code: " + UserCode;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "TPvsActualSummaryReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            //GetTpVsActualDeviationSummary(SelectedMonth, SelectedYear, UserCode, CompanyCode, ConnectionString, TransNumber, CurrentUserCode);

            Task task = Task.Factory.StartNew(() =>
            {
                GetTpVsActualDeviationSummary(SelectedMonth, SelectedYear, UserCode, CompanyCode, ConnectionString, TransNumber, CurrentUserCode);
            });
            return TransNumber;
        }

        public void GetTpVsActualDeviationSummary(int SelectedMonth, int SelectedYear, string UserCode, string CompanyCode, string ConnectionString, string TransNumber, string CurrentUserCode)
        {
            try
            {

                List<object> lst = new List<object>();
                lst = _objReport.GetTpVsActualDeviationSummary(UserCode, CompanyCode, SelectedMonth, SelectedYear, ConnectionString);
                string HTMLReportView = string.Empty;
                HTMLReportView = GenerateTpVsActualDeviationSummaryReport(lst);

                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, HTMLReportView, ConnectionString, "TPvsActualSummaryReport");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrentUserCode);

            }

        }

        private string GenerateTpVsActualDeviationSummaryReport(List<object> lst)
        {
            // Report
            List<HiDoctor_Reports.Models.MasterModel> lstMaster = new List<Models.MasterModel>();
            List<HiDoctor_Reports.Models.TPReport> lstTp1 = new List<Models.TPReport>();
            List<HiDoctor_Reports.Models.TPReport> lstTp2 = new List<Models.TPReport>();
            List<Models.TPDoctor> lstTpDoc1 = new List<Models.TPDoctor>();
            List<Models.TPDoctor> lstTPDoc2 = new List<Models.TPDoctor>();
            lstMaster = (List<Models.MasterModel>)lst[0];
            lstTp1 = (List<HiDoctor_Reports.Models.TPReport>)lst[1];
            lstTp2 = (List<HiDoctor_Reports.Models.TPReport>)lst[2];
            lstTpDoc1 = (List<HiDoctor_Reports.Models.TPDoctor>)lst[3];
            lstTPDoc2 = (List<HiDoctor_Reports.Models.TPDoctor>)lst[4];
            StringBuilder tblCont = new StringBuilder();

            tblCont.Append("<table cellspacing='0' cellpadding='0' id='TPvsActualSummaryReport' class='data display dataTable box' width='100%'>");
            tblCont.Append("<thead>");
            tblCont.Append("<tr>");
            tblCont.Append("<th rowspan='2'>User Name</th>");
            tblCont.Append("<th rowspan='2'>User Type</th>");
            tblCont.Append("<th rowspan='2'>Territory Name</th>");
            tblCont.Append("<th rowspan='2'>Division</th>");
            tblCont.Append("<th rowspan='2'>Reporting to</th>");
            tblCont.Append("<th rowspan='2'>Reporting HQ</th>");
            tblCont.Append("<th rowspan='2'>No of Days Planned</th>");
            tblCont.Append("<th rowspan='2'>No of Days Worked</th>");
            tblCont.Append("<th colspan='4'>No of Days Deviated as per Plan</th>");
            tblCont.Append("<th rowspan='2'>No of CP Drs not planned in TP</th>");
            tblCont.Append("<th rowspan='2'>No of Drs Not visited as per TP</th>");
            tblCont.Append("</tr>");
            tblCont.Append("<tr>");
            tblCont.Append("<th>Activity</th>");
            tblCont.Append("<th>Category</th>");
            tblCont.Append("<th style='white-space: nowrap;'>Place of Work</th>");
            tblCont.Append("<th>Accompanist(s)</th>");
            tblCont.Append("</tr>");
            //tblCont.Append("<th colspan= '14' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeasummary()'>Show Filter</span></th>");
            tblCont.Append("</thead><tbody>");
            if (lst.Count > 0)
            {
                for (var i = 0; i < lstMaster.Count; i++)
                {
                    tblCont.Append("<tr>");
                    tblCont.Append("<td>" + lstMaster[i].User_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].User_Type_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Region_Name + "</td>");
                    tblCont.Append("<td>" + ((lstMaster[i].Division_Name == null) ? "-" : lstMaster[i].Division_Name) + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Manager_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Reporting_Region + "</td>");

                    // planned tp and worked days
                    List<HiDoctor_Reports.Models.TPReport> lstTp1Filters = new List<Models.TPReport>();
                    lstTp1Filters = lstTp1.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTp1Filters.Count > 0)
                    {
                        tblCont.Append("<td>" + lstTp1Filters[0].TP_Count + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>" + lstTp1Filters[0].DCR_Count + "</td>");
                    }
                    else
                    {
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                    }

                    // deviation counts
                    List<HiDoctor_Reports.Models.TPReport> lstTp2Filters = new List<Models.TPReport>();
                    lstTp2Filters = lstTp2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTp2Filters.Count > 0)
                    {
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Flag + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Category + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Work + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Accomp + "</td>");
                    }
                    else
                    {
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                    }

                    var missedDoc = 0;
                    var missedCP = 0;

                    //   var docrs = jsonPath(jTp, "$[3].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<Models.TPDoctor> lstTpDoc1Filters = new List<Models.TPDoctor>();
                    lstTpDoc1Filters = lstTpDoc1.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    // var cp = jsonPath(jTp, "$[4].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<Models.TPDoctor> lstTpDoc2Filters = new List<Models.TPDoctor>();
                    lstTpDoc2Filters = lstTPDoc2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTpDoc2Filters.Count > 0)
                    {
                        missedCP = lstTpDoc2Filters.Count;
                    }
                    if (lstTpDoc1Filters.Count > 0)
                    {
                        for (var m = 0; m < lstTpDoc1Filters.Count; m++)
                        {
                            if (lstTpDoc1Filters[m].TP_Count > lstTpDoc1Filters[m].Visit_Count)
                            {
                                missedDoc = Convert.ToInt16(missedDoc) + 1;
                            }

                            if (lstTpDoc2Filters.Count > 0)
                            {
                                // var cpDoc = jsonPath(jTp, "$[4].[?(@.User_Code=='" + lstMaster[i].User_Code + "' && @.Doctor_Code=='" + lstTpDoc1Filters[m].Doctor_Code + "')]");
                                List<Models.TPDoctor> lstTpDocFilters = lstTPDoc2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) ==
                                    Convert.ToString(lstMaster[i].User_Code) &&
                                    Convert.ToString(x.Doctor_Code) == Convert.ToString(lstTpDoc1Filters[m].Doctor_Code)).ToList();
                                if (lstTpDocFilters.Count > 0)
                                {
                                    missedCP = Convert.ToInt16(missedCP) - 1;
                                }
                            }
                        }
                    }

                    tblCont.Append("<td>" + missedCP + "</td>");
                    tblCont.Append("<td class='td-a' onclick='fnRedirectToTpVsActualDoctorVisitsReport(\"" + lstMaster[i].User_Code + "\")'>" + missedDoc + "</td>");

                    tblCont.Append("</tr>");
                }
            }


            tblCont.Append("</tbody></table>");
            // return Json(lst, JsonRequestBehavior.AllowGet);
            return tblCont.ToString();

        }

        #endregion TP Vs Actual Summary Report

        #region Doctor Visits Frequency Analysis Calci report

        public ActionResult AsyncDoctorVisitsFACalciReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }

        public string ProcessDoctorVisitsFACalciReport(string UserCode, string Month, string Year, string Mode, string UserTypeName)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetConnectionString_Client();

            string ReportParameters = "Month: " + Month + "<br/>Year: " + Year + "<br/>User Type: " + UserTypeName;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, "DoctorVisitsFACalciReport", ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrUserCode);

            //FWGetVisitsFrequencyAnalysis(UserCode, Month, Year, Mode, UserTypeName, CompanyCode, ConnectionString, CurrUserCode, TransNumber);

            Task task = Task.Factory.StartNew(() =>
            {
                FWGetVisitsFrequencyAnalysis(UserCode, Month, Year, Mode, UserTypeName, CompanyCode, ConnectionString, CurrUserCode, TransNumber);
            });
            return TransNumber;
        }

        public void FWGetVisitsFrequencyAnalysis(string UserCode, string Month, string Year, string Mode, string UserTypeName, string CompanyCode, string ConnectionString, string CurrUserCode, string TransNumber)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            string UserTypeCode = "";
            string ReportType = "SUB";
            DataSet ds = new DataSet();
            try
            {
                ds = _objBlFWA.GetDoctorVisifrequencyAnalysisCalsi(CompanyCode, UserCode, UserTypeCode, Month, Year, Mode, ReportType, ConnectionString);
                string HTMLReportView = FWGetVisitsFrequencyAnalysisTable(ds, Month, Year, Mode, UserTypeName, UserTypeCode, UserCode, ReportType, CompanyCode);

                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrUserCode, TransNumber, HTMLReportView, ConnectionString, "DoctorVisitsFACalciReport");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrUserCode);
            }
            finally
            {
                ds.Dispose();
                _objBlFWA = null;
                objAsyncAPI = null;
                _objDALreportRegion = null;
            }

        }

        public string FWGetVisitsFrequencyAnalysisTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode, string reportType, string CompanyCode)
        {

            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            string divisionName = string.Empty;
            DataTable userDetail = ds.Tables[1];
            DataTable DaysWorkedDetail = ds.Tables[2];
            DataTable CategoryWiseDetail = ds.Tables[3];
            DataTable lastSubmittedDate = ds.Tables[4];
            DataTable categoryTable = ds.Tables[0];
            //DataRow[] userFilter;
            DataRow[] dataFilter;

            DataRow[] categoryDoctorcountFilter;
            string monthName = objAsyncAPI.GetMonthName(month);
            string companyCode = CompanyCode;
            string category = "ALL";

            double totalVisit = 0;
            double CategoryExpectedVisit = 0;
            double totalFrqAchieved = 0;
            double ApprovedDoctorinMaster = 0;
            double metdoctorsinEachcat = 0;
            double totalDoctorsMet = 0;
            double doctorCategoryCount = 0;
            double totApproveddoctors = 0;
            double totalActualcount = 0;

            DataTable userDetails = ds.Tables[5];
            string userDet = string.Empty;

            if (userDetails.Rows.Count > 0)
            {
                userDet = userDetails.Rows[0]["User_Name"].ToString();
            }

            string startDate = "01/" + month + "/" + year;
            string endDate = DateTime.DaysInMonth(int.Parse(year), int.Parse(month)) + "/" + month + "/" + year;

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='DoctorVisitsFrequncy'>");
                tableheader.Append("<div class='dvHeader' id='spndoctorVisitfreqHeader'>");
                tableheader.Append("<div class='dvheader-inner'>Doctor Visits Frequency Analysis Report of " + userDet + " for the period of " + startDate + " to " + endDate + "</div>");

                tableheader.Append("</div>");
                tableContent.Append("<div id='colonmDefini'>");
                tableContent.Append("<div><b>1.Num. of &laquo;Category Name&raquo; Doctors in Master</b>is the number of doctors in each of the categories in Doctor Master.</div>");
                tableContent.Append("<div><b>2.Total Listed Doctors in Doctor Master</b> is the total count of listed and approved doctors in Doctor Master.</div>");
                tableContent.Append("<div><b>3.Expected Visit Count for &laquo;Category Name&raquo; Doctors</b> is the product of Standard Visit Count Number for that doctor category &#42; Number of doctors in that category.</div>");
                tableContent.Append("<div><b>4.Total Expected Visit Count for Doctors in all Categories</b> is the sum of expected visit counts across all doctor categories.</div>");
                tableContent.Append("<div><b>5.Number of &laquo;Category Name&raquo; Doctors for whom visit frequency is achieved</b> is the total number of doctors in that category who have been visited exactly or above the standard visit count  number.</div>");
                tableContent.Append("<div><b>6.Actual Visit Count for &laquo;Category Name&raquo; Doctors</b> is the sum of visit counts for all doctors in that category, taken from DCR.</div>");
                tableContent.Append("<div><b>7.Total Actual Visit Count for Doctors in all Categories</b> is the sum of the actual number of visit counts across all doctor categories, taken from DCR.</div>");
                tableContent.Append("<div><b>8.% of Doctors met in &laquo;Category Name&raquo; Category</b> is the % of doctors met exactly and above the expected visit count number. Calculated as  % of Num. of docs. met  exactly and above the expected visit count / Num. of drs. in the category &#42; 100.</div>");
                tableContent.Append("<div><b>9.% of Total Doctors met</b> is the Sum of Actual Visits Exactly and Above the Expected Count across categories / Total Number of Approved Drs.In Master &#42; 100.");

                tableContent.Append("</div>");
                tableContent.Append("<table class='data display dataTable' width='100%' id='DoctorVisitsFACalciReport'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th>User Name </th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Designation</th>");
                tableContent.Append("<th>Territory</th>");


                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Num. of ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Doctors in Master</th>");
                    }
                    tableContent.Append("<th>Total Listed Doctors in Doctor Master</th>");

                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Num. of ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append("  Drs Expected Visits (Standard visit Count = (" + categoryTable.Rows[k]["Visit_Count"].ToString() + "))</th>");
                    }
                    tableContent.Append("<th>Total Expected Dr Visits Count</th>");

                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Number of  ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Doctors for whom visit frequency is achieved</th>");
                    }
                    tableContent.Append("<th>Total Doctors for whom visit frequency is achieved in all Categories</th>");
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'> Actual Visit Count for Doctors in  ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append("</th>");
                    }
                    tableContent.Append("<th>Total Actual Visit Count for Doctors in all Categories</th>");

                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>% of Doctors met in ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append("Category</th>");
                    }
                    tableContent.Append("<th>% of Total Doctors met");

                    tableContent.Append("<div class='helpIconRpt'>");
                    tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_TOTAL_VISIT','TOTAL_VISIT')\" />");
                    tableContent.Append("</div>");

                    tableContent.Append("</th>");
                }

                tableContent.Append("</thead>");
                tableContent.Append("</tbody>");
                tableContent.Append("</tr>");

                for (var i = 0; i < userDetail.Rows.Count; i++)
                {
                    totalFrqAchieved = 0;
                    totalVisit = 0;
                    CategoryExpectedVisit = 0;
                    ApprovedDoctorinMaster = 0;
                    metdoctorsinEachcat = 0;
                    totalDoctorsMet = 0;
                    totApproveddoctors = 0;
                    totalActualcount = 0;

                    tableContent.Append("<tr>");
                    //user detail bind//
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpName_" + i + "'>" + userDetail.Rows[i]["Employee_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpNumber_" + i + "'>" + userDetail.Rows[i]["Employee_Number"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Type_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdRegionName_" + i + "'>" + userDetail.Rows[i]["Region_Name"].ToString() + " </td>  ");
                    DataRow[] dvDivisionName;
                    if ("MAIN" == reportType)
                    {
                        dvDivisionName = ds.Tables[8].AsEnumerable().Where(s => s["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    }
                    else
                    {
                        dvDivisionName = ds.Tables[6].AsEnumerable().Where(s => s["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    }
                    divisionName = "";
                    if (dvDivisionName.Length > 0)
                    {
                        foreach (DataRow dr in dvDivisionName)
                        {
                            divisionName += dr["Division_Name"].ToString() + ',';
                        }
                    }

                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }


                    tableContent.Append("<td  id='tdDivisionName_" + i + "'>" + divisionName + " </td>  ");
                    tableContent.Append("<td  id='tdUnserUserName_" + i + "'>" + userDetail.Rows[i]["Under_User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnderRegionName_" + i + "'>" + userDetail.Rows[i]["Under_Region_Name"].ToString() + " </td>  ");

                    //Ctaegory wise listed drs count//

                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        //string callCoverage = string.Empty;

                        doctorCategoryCount = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                doctorCategoryCount += float.Parse(dr["Total_Approved_Doctors"].ToString());
                            }
                            // tableContent.Append("<td>" + Math.Round(doctorCategoryCount, 2) + " </td>");
                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_Doctor details\",this)'>" + Math.Round(doctorCategoryCount, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }

                    //total listed drs count bind//

                    dataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (dataFilter.Length > 0)
                    {
                        foreach (DataRow dr in dataFilter)
                        {
                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + category + "_" + month + "_" + year + "_Doctor details\",this)'>" + dr["Approved_Doctors_Count"].ToString() + " </td>");
                            totApproveddoctors += float.Parse(dr["Approved_Doctors_Count"].ToString());
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                    }

                    //category wiseExpected Dr Visits Count
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double CategoryExpectedVst = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            CategoryExpectedVst = float.Parse(categoryDoctorcountFilter[0]["Expected_Visit"].ToString());
                            tableContent.Append("<td align='center'>" + Math.Round(CategoryExpectedVst, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }

                    //Total Expected Dr Visits Count
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            CategoryExpectedVisit += float.Parse(categoryDoctorcountFilter[0]["Expected_Visit"].ToString());
                        }
                    }

                    tableContent.Append("<td align='center'>" + CategoryExpectedVisit.ToString() + "</td>  ");

                    //category wise  Freq. achieved  Drs Visit
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double doctorCallMade = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                totalFrqAchieved += float.Parse(dr["Category_Met"].ToString());
                                doctorCallMade += float.Parse(dr["Category_Met"].ToString());
                            }
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnFrequencyPopUp(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_" + categoryTable.Rows[u]["Category_Name"].ToString() + "_Doctor Details\",this)'>" + Math.Round(doctorCallMade, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnFrequencyPopUp(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_" + "_Doctor Details\",this)'>0 </td>  ");
                        }
                    }
                    // Total Freq. achieved Visits
                    tableContent.Append("<td align='center'>" + totalFrqAchieved.ToString() + "</td>  ");

                    //Actual Visit count for category wise
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double actualcount = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                totalActualcount += float.Parse(dr["Doctor_calls_made"].ToString());
                                actualcount += float.Parse(dr["Doctor_calls_made"].ToString());
                            }
                            tableContent.Append("<td align='center'>" + Math.Round(actualcount, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0</td>");
                        }
                    }
                    //Total Actual Count                      
                    tableContent.Append("<td align='center'>" + totalActualcount.ToString() + " </td>");

                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double visitCategory = 0;
                        double categorywisevisitcount = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                visitCategory += float.Parse(dr["Visit_Category"].ToString());
                                metdoctorsinEachcat = float.Parse(dr["Category_Met"].ToString());
                                ApprovedDoctorinMaster = float.Parse(dr["Total_Approved_Doctors"].ToString());
                            }
                            if (ApprovedDoctorinMaster != 0)
                            {
                                categorywisevisitcount = Math.Round(((metdoctorsinEachcat / ApprovedDoctorinMaster) * 100), 2);
                                totalDoctorsMet += categorywisevisitcount;
                            }
                            else
                            {
                                categorywisevisitcount = 0;
                                totalDoctorsMet += categorywisevisitcount;
                            }
                            tableContent.Append("<td align='center'>" + categorywisevisitcount + " </td>");

                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0</td>  ");
                        }
                    }

                    //Total visit %
                    if (totApproveddoctors != 0)
                    {
                        totalVisit = Math.Round(((totalFrqAchieved / totApproveddoctors) * 100), 2);
                    }
                    tableContent.Append("<td align='center'>" + totalVisit.ToString() + "</td>  ");
                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("<div>");
            }
            return tableheader.ToString() + "<br />" + tableContent.ToString();
        }

        #endregion Doctor Visits Frequency Analysis Calci report

        #region last submitted report

        public ActionResult AsyncLastSubmittedReport()
        {
            return View();
        }

        public string ProcessLastSubmittedReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string reportName = "LastSubmittedReport";
            string ConnectionString = _objData.GetConnectionString_Client();
            string Domain = _objcurrentInfo.GetSubDomain();
            string userName = _objcurrentInfo.GetUserName();

            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string unlistedDoctor = collection["type"].ToString();
            string dateSelection = collection["selectionType"].ToString();
            string UserSelection = string.Empty;
            //string reportName = collection["title"].ToString();
            string missedDoctor = collection["missed"].ToString();
            string reportViewType = collection["reportViewType"].ToString();
            if (userCode.ToUpper() == "ALL")
            {
                userCode = _objcurrentInfo.GetUserCode();
                UserSelection = "ALL";
            }
            else
            {
                userCode = userCode.Replace(",,", ",");
            }

            string userSelection = collection["type"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();



            string ReportParameters = "Start Date: " + startDate + "<br/>End Date: " + endDate + "<br/>Unlisted Doctors:" + unlistedDoctor;

            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.InsertRptTransactionQueue(CompanyCode, TransNumber, reportName, ReportParameters, "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);


            Task task = Task.Factory.StartNew(() =>
            {
                GetLastSubmittedReport(CompanyCode, userCode, startDate, endDate, UserSelection, dateSelection, unlistedDoctor, reportName, missedDoctor, reportViewType, TransNumber, CurrentUserCode, ConnectionString, Domain, userName);
            });
            return TransNumber;
        }

        public void GetLastSubmittedReport(string CompanyCode, string userCode, string startDate, string endDate, string UserSelection, string dateSelectionType, string unlistedDoc, string reportName, string missedDoctor, string reportViewType, string TransNumber, string CurrUserCode, string ConnectionString, string Domain, string userName)
        {
            var _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            try
            {
                string HTMLReportView = _objDoctorVisit.GetLastSubmittedReport(CompanyCode, userCode, startDate, endDate, UserSelection, dateSelectionType, unlistedDoc, reportName, missedDoctor, reportViewType, ConnectionString, Domain, userName);
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrUserCode, TransNumber, HTMLReportView, ConnectionString, reportName);
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ConnectionString, CurrUserCode);
            }
            finally
            {

                _objDoctorVisit = null;
                objAsyncAPI = null;
                _objDALreportRegion = null;
            }
        }



        #endregion last submitted report

    }
}