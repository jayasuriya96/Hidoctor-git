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
    public class ArchiveReportController : Controller
    {
        //
        // GET: /ArchiveReport/
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
        JSONConverter _objJson = new JSONConverter();
        #endregion Private Variables
        public ActionResult ArchCompAnalysisReport()
        {
            return View();
        }

        public ActionResult LastSubmittedCalciArchiveReport()
        {
            return View();
        }

        public ActionResult DoctorVisitsFACalciArchiveReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
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
        public string ProcessComprehensiveAnalysisReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string SubDomain = _objcurrentInfo.GetSubDomain();
            string ConnectionString = _objData.GetArchiveConnectionString_Client();
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
                sbTableContent.Append("<div class='CA_Div_Left'>Comprehensive Analysis-Archive Report for the period " + dtStartDate.ToString("dd/MM/yyyy") + " - " + dtEndDate.ToString("dd/MM/yyyy") + "(Considered Applied & Approved DCRs only)</div>");
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
                        double flexiChemExpsum = 0.00;


                        // Chemist Calls Made
                        int chem = 0;
                        int pob = 0;
                        sbTableContent.Append("<tr ><td align='left'>Chemist Calls Made</td>");
                        foreach (string monthName in monthlist)
                        {
                            drChemist = ds.Tables[6].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            drFlexicountforMet = ds.Tables[9].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            int flexichemistcountformet = 0;
                            int flexichemistcount = 0;
                            //Get unique chemist couunt for met
                            if (drChemist.Length > 0)
                            {
                                flexichemistcount += Convert.ToInt32(drChemist[0]["Count"]);
                                flexichemistcountformet += Convert.ToInt32(drChemist[0]["Count"]);
                                flexiChemExpsum += Convert.ToDouble(drChemist[0]["Sum"]);
                            }
                            else
                            {
                                flexichemistcount += 0;
                                flexichemistcountformet += 0;
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
                                flexichemistcountformet += 0;
                                flexiChemExpsum += 0.0;
                            }
                            if (drChemist.Length > 0 && drFlexicountforMet.Length > 0)
                            {
                                chemistCalls[chem++] = flexichemistcountformet;
                                chemistPOB[pob++] = flexiChemExpsum;
                                sbTableContent.Append("<td align='center'>" + flexichemistcount + "</td>");//Chemist Calls Made
                            }
                            else
                            {
                                chemistCalls[chem++] = 0;
                                chemistPOB[pob++] = 0.0;
                                sbTableContent.Append("<td align='center'>0</td>");//Chemist Calls Made
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


        public string ProcessLastSubmittedCalciReport(FormCollection collection)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetArchiveConnectionString_Client();
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
                   string MissedDoctor, string childUsercounts, string CompanyCode, string ArchiveReportConnectionString, string TransNumber, string CurrentUserCode)
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
                List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lstLastSubmitted = _objReport.GetAsynclastsubmittedCalciArch(CompanyCode, UserCode, Month, Year, UserSelection, selectedDate, ArchiveReportConnectionString);
                sbTableContent = GetLastSubmittedTable(lstLastSubmitted, lstChildusers, UnListedDoctor, Month, Year, MissedDoctor);

                //notify post async report generation
                objAsyncAPI.OnAsyncReportProcessCompletion(CompanyCode, CurrentUserCode, TransNumber, sbTableContent.ToString(), ArchiveReportConnectionString, "LastSubmittedCalciReport");
            }
            catch (Exception ex)
            {
                _objDALreportRegion.UpdateRptTransactionQueue(CompanyCode, TransNumber, "Error", ex.Message.ToString(), "Error, while processing the request...Try Again", "", ArchiveReportConnectionString, CurrentUserCode);
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
public string ProcessDoctorVisitsFACalciReport(string UserCode, string Month, string Year, string Mode, string UserTypeName)
        {
            string TransNumber = Guid.NewGuid().ToString();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string CurrUserCode = _objcurrentInfo.GetUserCode();
            string ConnectionString = _objData.GetArchiveConnectionString_Client();

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

      

     public JsonResult GetUnderUserType()
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();

                BLFieldWorkAnalysis objBLFWA = new BLFieldWorkAnalysis();
                DataSet dsUserType = objBLFWA.GetUnderUserType(companyCode, userCode);
                return Json(_objJson.Serialize(dsUserType), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public string GetUnderUserTypeCount(string userTypeCode)
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLFieldWorkAnalysis objBLFWA = new BLFieldWorkAnalysis();
                int underUserTypeCount = objBLFWA.GetUnderUserTypeCount(companyCode, userTypeCode);
                return underUserTypeCount.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public string GetFWAnanlysisDetails(string userTypeCode, string month, string year, string mode, string userTypeName)
        {
            try
            {
                DataControl.BLFieldWorkAnalysis _objBlFWA = new BLFieldWorkAnalysis();
                DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
                DataSet ds = new DataSet();
                ds = _objBlFWA.GetFWAnalysisDetails(_objCurInfo.GetCompanyCode(), _objCurInfo.GetUserCode(), userTypeCode + "^", month, year, mode, "MAIN");

                string tableContent = GenerateFWAnalysisTable(ds, userTypeName, month, year, mode);
                return tableContent;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        public string GenerateFWAnalysisTable(DataSet ds, string userTypeName, string month, string year, string mode)
        {
            StringBuilder tableContent = new StringBuilder();            
            
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {


                StringBuilder categoryVisitHeader = new StringBuilder();
                StringBuilder categoryVisitVal = new StringBuilder();

                string independentDoctor = "INDEPENDENTDOCTOR";
                string stockiest = "STOCKIEST";

                string monthName = GetMonthName(month);
                string modeName = GetModeName(mode);

                tableContent.Append("<div id='FWAMainreport'>");
                tableContent.Append("<div class='dvHeader'>");

                tableContent.Append("<div class='dvheader-inner'>Field Work analysis of  " + userTypeName + " for the month of " + monthName + " (showing" + modeName + "  Records)</div>");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','HEADER')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</div>");

                tableContent.Append("<table class='data display datatable' id='tblFWAReport'>");
                tableContent.Append("<thead style='font-weight: bold;'><tr>");
                //Binding Headers
                tableContent.Append("<th>User Name</th>");
                tableContent.Append("<th>User Type Name</th>");
                tableContent.Append("<th>Territory Name</th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");

                tableContent.Append("<th>% Days worked</th>");
                tableContent.Append("<th>Joint field work %</th>");
                tableContent.Append("<th>Call Average</th>");
                tableContent.Append("<th>Total Coverage %</th>");

                //Binding the Categroy name headers
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableContent.Append("<th>" + dr["Category_Name"].ToString() + " Coverage %</th>");
                    categoryVisitHeader.Append("<th>" + dr["Category_Name"].ToString() + " Visits %</th>");
                }

                //Total Visits
                tableContent.Append("<th>Total Visits %</th>");
                tableContent.Append(categoryVisitHeader);
                tableContent.Append("<th>Chemist Call Avg</th>");
                tableContent.Append("<th>Stockist Call Avg</th>");
                tableContent.Append("<th>RCPA Coverage %</th>");
                tableContent.Append("<th>Independent Doctor Call Coverage %</th>");
                tableContent.Append("</tr></thead>");

                tableContent.Append("<tbody>");

                //outer loop
                int loopCount = 0;

                foreach (DataRow drUser in ds.Tables[1].Rows)
                {
                    tableContent.Append("<tr>");
                    categoryVisitVal.Clear();
                    float expectedVisit = 0;
                    loopCount++;

                    float listedDoctorCallMade = 0;
                    float totalVisit = 0;
                    string userCode = drUser["User_Code"].ToString();
                    string chemistCallAverage = "0";
                    string stockiestCallAvearage = "0";
                    string rcpaCoverage = "0";
                    float independentDoctorCall = 0;

                    // to check to show the link
                    bool showLink = true;
                    DataRow[] drS = ds.Tables[6].AsEnumerable().Where(c => c["User_Type_Code"].ToString() == drUser["User_Type_Code"].ToString()).ToArray();
                    if (drS.Length > 0)
                    {
                        showLink = false;
                    }

                    if (showLink)
                    {
                        tableContent.Append("<td class='td-hyp' onclick='fnBindUserDetails(" + loopCount + ")'>" + drUser["User_Name"] + "<input type='hidden' id='hdnUserCode_" + loopCount.ToString() + "' value='" + drUser["User_Code"].ToString() + "' /></td>");
                    }
                    else
                    {
                        tableContent.Append("<td>" + drUser["User_Name"] + "<input type='hidden' id='hdnUserCode_" + loopCount.ToString() + "' value='" + drUser["User_Code"].ToString() + "' /></td>");
                    }
                    tableContent.Append("<td>" + drUser["User_Type_Name"] + "</td>");
                    tableContent.Append("<td>" + drUser["Region_Name"] + "</td>");
                    tableContent.Append("<td>" + drUser["Employee_Name"] + "</td>");
                    tableContent.Append("<td>" + drUser["Employee_Number"] + "</td>");
                    tableContent.Append("<td>" + drUser["Division_Name"] + "</td>");                                      
                    tableContent.Append("<td>" + drUser["Under_User_Name"] + "</td>");
                    tableContent.Append("<td>" + drUser["Under_Region_Name"] + "</td>");

                    // For exceptional values
                    DataRow[] drM = ds.Tables[4].AsEnumerable().Where(c => c["User_Code"].ToString() == userCode).ToArray();

                    if (drM.Length > 0)
                    {
                        independentDoctorCall = float.Parse(drM[0]["Independent_Doctor_Calls_Made"].ToString());
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWADayWorkedAnalysis(" + loopCount + ")'>" + double.Parse(drM[0]["Days_Worked"].ToString()).ToString("N2") + "</td>");
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWAJointFieldWorkAnalysisReport(" + loopCount + ")'>" + double.Parse(drM[0]["Join_Field_Work"].ToString()).ToString("N2") + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWADayWorkedAnalysis(" + loopCount + ")'>0</td>");
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWAJointFieldWorkAnalysisReport(" + loopCount + ")'>0</td>");
                    }

                    //Get the values
                    DataRow[] drRptVal = ds.Tables[2].AsEnumerable().Where(c => c["Parent_User"].ToString() == userCode).ToArray();
                    if (drRptVal.Length > 0)
                    {
                        listedDoctorCallMade = float.Parse(drRptVal[0]["Listed_Doctor_Calls_Made"].ToString());

                        chemistCallAverage = drRptVal[0]["Chemist_Call_Average"].ToString();
                        stockiestCallAvearage = drRptVal[0]["Stockist_Call_Average"].ToString();
                        rcpaCoverage = drRptVal[0]["RCPA_Coverage"].ToString(); ;


                        tableContent.Append("<td>" + double.Parse(drRptVal[0]["Call_Average"].ToString()).ToString("N2") + "</td>");
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWADoctorCallAnalysis(" + loopCount + ")'>" + double.Parse(drRptVal[0]["Total_Coverage"].ToString()).ToString("N2") + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td>0</td>");
                        tableContent.Append("<td class='td-hyp' onclick='fnGetFWADoctorCallAnalysis(" + loopCount + ")'>0</td>");
                    }

                    //Binding the Categroy name values
                    foreach (DataRow drCategory in ds.Tables[0].Rows)
                    {


                        DataRow[] drCateVal = ds.Tables[3].AsEnumerable().Where(c => c["Parent_User"].ToString() == userCode && c["Doctor_Category_Code"].ToString() == drCategory["Category_Code"].ToString()).ToArray();
                        if (drCateVal.Length > 0)
                        {
                            expectedVisit += float.Parse(drCateVal[0]["Expected_Visit"].ToString());

                            tableContent.Append("<td>" + double.Parse(drCateVal[0]["Category_Coverage"].ToString()).ToString("N2") + "</td>");
                            categoryVisitVal.Append("<td>" + double.Parse(drCateVal[0]["Visit_Category"].ToString()).ToString("N2") + "</td>");
                        }
                        else
                        {
                            tableContent.Append("<td>0</td>");

                            categoryVisitVal.Append("<td>0</td>");
                        }
                    }

                    if (expectedVisit > 0)
                    {
                        totalVisit = float.Parse(Math.Round((listedDoctorCallMade / expectedVisit) * 100, 2).ToString());
                    }


                    tableContent.Append("<td  class='td-hyp' onclick='fnGetFWADoctorVisitsFrequencyAnalysisReport(" + loopCount + ")'>" + totalVisit.ToString("N2") + "</td>");

                    tableContent.Append(categoryVisitVal);

                    tableContent.Append("<td class='td-hyp' onclick='fnGetChemistCallAnalysis(" + loopCount + ")'>" + double.Parse(chemistCallAverage).ToString("N2") + "</td>");
                    tableContent.Append("<td class='td-hyp' onclick='fnstockiestPopup(\"" + drUser["User_Code"].ToString() + "_" + month + "_" + year + "_" + stockiest + "_Stockiest Details_" + mode + "\")'>" + double.Parse(stockiestCallAvearage).ToString("N2") + "</td>");

                    //tableContent.Append("<td align='center' class='td-hyp' onclick='fnstockiestPopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + stockiest + "\")' >" + DaysWorkedDetail.Rows[0]["No_Reporting_Days"].ToString() + "</td>");

                    tableContent.Append("<td>" + double.Parse(rcpaCoverage).ToString("N2") + "</td>");

                    float indepCall = 0;
                    float indepCategSum = 0;

                    DataRow[] drIndependent = ds.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == userCode).ToArray();

                    foreach (DataRow independentdr in drIndependent)
                    {
                        indepCategSum += float.Parse(independentdr["Total_Approved_Doctors"].ToString()) * float.Parse(independentdr["Standard_Visits_Count"].ToString());
                    }

                    if (indepCategSum > 0)
                    {
                        indepCall = (independentDoctorCall / indepCategSum) * 100;
                    }

                    tableContent.Append("<td class='td-hyp' onclick='fnindependentPopup(\"" + drUser["User_Code"].ToString() + "_" + month + "_" + year + "_" + independentDoctor + "_Independent Doctor Details_" + mode + "\")' >" + double.Parse(indepCall.ToString()).ToString("N2") + "</td>");
                    //tableContent.Append("<td align='center' class='td-hyp' onclick='fnindependentPopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + independentDoctor + "\")' >" + DaysWorkedDetail.Rows[0]["No_Reporting_Days"].ToString() + "</td>");

                    tableContent.Append("</tr>");
                }

                tableContent.Append("</tbody>");

                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No records found -- </div>");
            }
            return tableContent.ToString();
        }
        public string GetChildUserDetails(string userCode, string month, string year, string mode)
        {
            try
            {

                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLFieldWorkAnalysis objBLFWA = new BLFieldWorkAnalysis();
                DataSet ds = objBLFWA.GetUnderUserType(companyCode, userCode);
                if (ds.Tables[0].Rows.Count >= 2)
                {
                    //string userTypeCode = ds.Tables[0].Rows[1]["User_Type_Code"].ToString();
                    //string userTypeName = ds.Tables[0].Rows[1]["User_Type_Name"].ToString();

                    StringBuilder userTypeCodeBuilder = new StringBuilder();
                    StringBuilder userTypeName = new StringBuilder();

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        if (i == 0)
                        {
                            continue;
                        }
                        userTypeCodeBuilder.Append(ds.Tables[0].Rows[i]["User_Type_Code"].ToString() + "^");
                        userTypeName.Append(ds.Tables[0].Rows[i]["User_Type_Name"].ToString() + " , ");
                    }

                    ds = objBLFWA.GetFWAnalysisDetails(_objcurrentInfo.GetCompanyCode(), userCode, userTypeCodeBuilder.ToString(), month, year, mode, "MAIN");

                    string tableContent = GenerateFWAnalysisTable(ds, userTypeName.ToString(), month, year, mode);
                    return tableContent;
                }
                else
                {
                    return "<div>No child record(s) found</div>";
                }
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }


        public string GetDaywiseAnalysis(string userCode, string month, string year, string reportType)
        {
            try
            {
                DataControl.BLFieldWorkAnalysis _objBlFWA = new BLFieldWorkAnalysis();
                DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
                DataSet ds = new DataSet();
                ds = _objBlFWA.GetDaywiseAnalysis(_objCurInfo.GetCompanyCode(), userCode, month, year, reportType);

                string tableContent = string.Empty;

                tableContent = GeneratePopTableForDaysWorked(ds, userCode, month, year, reportType);

                return tableContent;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        public string GeneratePopTableForDaysWorked(DataSet ds, string userCode, string month, string year, string reportType)
        {
            StringBuilder tableBuilder = new StringBuilder();

            if (reportType == "FIELD_DAYS")
            {
                tableBuilder.Append("<table class='data display dataTable' id='FIELD_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Activity Name</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["DCR_Actual_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>Field</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "NONFIELD_DAYS")
            {
                tableBuilder.Append("<table class='data display dataTable' id='NONFIELD_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Activity Name</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["DCR_Actual_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["Project_Name"].ToString() + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "LEAVE")
            {
                tableBuilder.Append("<table class='data display dataTable' id='LEAVE'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Leave Type</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    string leaveType = string.Empty;

                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["DCR_Actual_Date"].ToString() + "</td>");

                    if (dr["Leave_Type_Name"].ToString() == "1")
                    {
                        leaveType = "fullday";
                    }
                    else
                    {
                        leaveType = "Half Day";
                    }

                    tableBuilder.Append("<td>" + dr["Leave_Type_Name"].ToString() + " ( " + leaveType + " ) </td>");

                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "HOLIDAY")
            {
                tableBuilder.Append("<table class='data display dataTable' id='HOLIDAY'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Holiday Name</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["Holiday_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["Holiday_Name"].ToString() + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");

                tableBuilder.Append("<br />");
                tableBuilder.Append("<div style='clear:both'></div>");
                tableBuilder.Append("<div style='font-weight:bold;font-size:15px'>Worked on Holiday Details</div>");
                tableBuilder.Append("<div style='clear:both'></div>");
                tableBuilder.Append("<br />");

                tableBuilder.Append("<table class='data display dataTable' id='HOLIDAY_WORKED'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Day</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["Worked_Holiday_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["Holiday_Name"].ToString() + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");

            }
            else if (reportType == "WEEKEND")
            {
                tableBuilder.Append("<table class='data display dataTable' id='WEEKEND'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Day</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["Weekend_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["WEEKDAY_NAME_LONG"].ToString() + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");

                tableBuilder.Append("<div style='clear:both'></div>");
                tableBuilder.Append("<br />");
                tableBuilder.Append("<div style='font-weight:bold;font-size:15px'>Worked on Weekend Details</div>");
                tableBuilder.Append("<div style='clear:both'></div>");
                tableBuilder.Append("<br />");

                tableBuilder.Append("<table class='data display dataTable' id='WEEKEND_WORKED'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Day</th><th>Activity_Name</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dr["DCR_Actual_Date"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["Weekend_Name"].ToString() + "</td>");
                    tableBuilder.Append("<td>" + dr["Activity_Name"].ToString() + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "NO_REPORT_DAYS")
            {
                List<string> lstDate = new List<string>();

                //include field
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["DCR_Actual_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //include non filed work days i.e attendance
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["DCR_Actual_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //Includes Holiday except holiday worked
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Holiday_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //Includes weekend except weekend worked
                foreach (DataRow dr in ds.Tables[8].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Weekend_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //include leave
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["DCR_Actual_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                int daysInMonth = DateTime.DaysInMonth(int.Parse(year), int.Parse(month));

                DateTime dtstartDate = Convert.ToDateTime(year + "-" + month + "-" + "01");
                DateTime dtendDate = Convert.ToDateTime(year + "-" + month + "-" + daysInMonth);

                List<DateTime> lstFinal = new List<DateTime>();
                for (DateTime dt = dtstartDate; dt <= dtendDate; dt = dt.AddDays(1))
                {
                    if (!lstDate.Contains(dt.ToString("yyyy-MM-dd")))
                    {
                        lstFinal.Add(dt);
                    }
                }


                tableBuilder.Append("<table class='data display dataTable' id='NO_REPORT_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Activity Details</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DateTime dtF in lstFinal)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dtF.ToString("dd/MM/yyyy") + "</td>");
                    tableBuilder.Append("<td>Not Reported any activity</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");

            }
            else if (reportType == "NOT_AVAIL_DAYS")
            {
                tableBuilder.Append("<table class='data display dataTable' id='NOT_AVAIL_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th><th>Day</th><th>Type</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + Convert.ToDateTime(dr["Holiday_Date"].ToString()).ToString("dd/MM/yyyy") + "</td>");
                    tableBuilder.Append("<td>" + dr["Holiday_Name"].ToString() + "</td>");
                    tableBuilder.Append("<td>Holiday</td>");
                    tableBuilder.Append("</tr>");
                }
                foreach (DataRow dr in ds.Tables[8].Rows)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + Convert.ToDateTime(dr["Weekend_Date"].ToString()).ToString("dd/MM/yyyy") + "</td>");
                    tableBuilder.Append("<td>" + dr["WEEKDAY_NAME_LONG"].ToString() + "</td>");
                    tableBuilder.Append("<td>Weekend</td>");
                    tableBuilder.Append("</tr>");
                }
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    string leaveType = string.Empty;

                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + Convert.ToDateTime(dr["DCR_Actual_Date"].ToString()).ToString("dd/MM/yyyy") + "</td>");

                    if (dr["Leave_Type_Name"].ToString() == "1")
                    {
                        leaveType = "fullday";
                    }
                    else
                    {
                        leaveType = "Half Day";
                    }

                    tableBuilder.Append("<td>" + dr["Leave_Type_Name"].ToString() + " ( " + leaveType + " ) </td>");
                    tableBuilder.Append("<td>Leave</td>");
                    tableBuilder.Append("</tr>");
                }

                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "STANDARED_WORK_DAYS")
            {
                List<string> lstDate = new List<string>();

                //include field
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Holiday_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //include non filed work days i.e attendance
                foreach (DataRow dr in ds.Tables[8].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Weekend_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                int daysInMonth = DateTime.DaysInMonth(int.Parse(year), int.Parse(month));
                DateTime dtstartDate = Convert.ToDateTime(year + "-" + month + "-" + "01");
                DateTime dtendDate = Convert.ToDateTime(year + "-" + month + "-" + daysInMonth);

                List<DateTime> lstFinal = new List<DateTime>();
                for (DateTime dt = dtstartDate; dt <= dtendDate; dt = dt.AddDays(1))
                {
                    if (!lstDate.Contains(dt.ToString("yyyy-MM-dd")))
                    {
                        lstFinal.Add(dt);
                    }
                }

                tableBuilder.Append("<table class='data display dataTable' id='STANDARED_WORK_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DateTime dtF in lstFinal)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dtF.ToString("dd/MM/yyyy") + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");
            }
            else if (reportType == "AVAIL_FIELD_DAYS")
            {
                List<string> lstDate = new List<string>();

                //include field
                foreach (DataRow dr in ds.Tables[7].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Holiday_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //include non filed work days i.e attendance
                foreach (DataRow dr in ds.Tables[8].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["Weekend_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                //include non filed work days i.e attendance
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    lstDate.Add(Convert.ToDateTime(dr["DCR_Actual_Date"].ToString()).ToString("yyyy-MM-dd"));
                }

                int daysInMonth = DateTime.DaysInMonth(int.Parse(year), int.Parse(month));
                DateTime dtstartDate = Convert.ToDateTime(year + "-" + month + "-" + "01");
                DateTime dtendDate = Convert.ToDateTime(year + "-" + month + "-" + daysInMonth);

                List<DateTime> lstFinal = new List<DateTime>();
                for (DateTime dt = dtstartDate; dt <= dtendDate; dt = dt.AddDays(1))
                {
                    if (!lstDate.Contains(dt.ToString("yyyy-MM-dd")))
                    {
                        lstFinal.Add(dt);
                    }
                }

                tableBuilder.Append("<table class='data display dataTable' id='AVAIL_FIELD_DAYS'>");
                tableBuilder.Append("<thead><tr><th>Date</th></tr></thead>");
                tableBuilder.Append("<tbody>");
                foreach (DateTime dtF in lstFinal)
                {
                    tableBuilder.Append("<tr>");
                    tableBuilder.Append("<td>" + dtF.ToString("dd/MM/yyyy") + "</td>");
                    tableBuilder.Append("</tr>");
                }
                tableBuilder.Append("</tbody>");
                tableBuilder.Append("</table>");

            }

            return tableBuilder.ToString();
        }

        

        #region sub reports
        //day Analysis Report start//
        public string GetDaysWorkeddDtails(string userCode, string month, string year, string mode, string userTypeName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            string usertypeCode = ""; // ignored for syb reports
            string reportType = "SUB";

            DataSet ds = new DataSet();

            ds = _objBlFWA.GetFWAnalysisDetails(_objCurInfo.GetCompanyCode(), userCode, usertypeCode, month, year, mode, reportType);
            return GetdaysworkedTable(ds, month, year, mode, userTypeName, usertypeCode, userCode);
        }
        public string GetdaysworkedTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable userDetail = ds.Tables[1];
            DataTable DaysWorkedDetail = ds.Tables[2];
            DataTable lastSubmittedDate = ds.Tables[4];
            DataTable userDetails = ds.Tables[5];
            string userDet = string.Empty;

            if (userDetails.Rows.Count > 0)
            {
                userDet = userDetails.Rows[0]["User_Name"].ToString() + " (" + userDetails.Rows[0]["User_Type_Name"].ToString() + ") " + " | " + userDetails.Rows[0]["Region_Name"].ToString() + "(" + userDetails.Rows[0]["Region_Type_Name"].ToString() + ")";
            }
            //DataRow[] userFilter;
            DataRow[] daysWorkeddataFilter;
            DataRow[] dateFilter;
            string monthName = GetMonthName(month);
            if (ds.Tables[1].Rows.Count > 0)
            {
                tableContent.Append("<div id='daysWorked'>");
                tableheader.Append("<div id='dv_FieldWorkAnalysis_DayAnalysis'>");
                tableheader.Append("<div class='dvHeader'>");

                tableheader.Append("<div class='dvheader-inner'>% days worked details of  " + userDet + " for the Month of " + monthName + " and year of " + year + "</div>");

                tableheader.Append("<div class='helpIconRpt'>");
                tableheader.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_DAYS_WORKED','HEADER')\" />");
                tableheader.Append("</div>");

                tableheader.Append("</div>");

                tableContent.Append("<table class='data display dataTable' width='100%' id='tbl_FieldWorkAnalysis_DayAnalysis'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th>User Name </th>");
                tableContent.Append("<th>User Type Name</th>");
                tableContent.Append("<th>Territory Name</th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");
                tableContent.Append("<th>Total No of Days</th>");
                tableContent.Append("<th>No Reporting Days");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','NO_REPORT_DAYS')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Not Available Days");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','NOT_AVAIL_DAYS')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Weekend Days");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','WEEKEND')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Leave");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','LEAVE')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Holiday");


                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','HOLIDAY')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Non FW Days");


                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','NONFIELD_DAYS')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>No of Days in FW");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','FIELD_DAYS')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>% Days Worked Type 1");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','DAYS_WORKED')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Standard Working Days");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','STANDARD_WORKING_DAYS')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");

                tableContent.Append("<th>Available Field Days");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA','AVAILABLE_FIELD_DAYS')\" />");
                tableContent.Append("</div>");
                tableContent.Append("</th>");

                tableContent.Append("<th>% Days Worked Type 2</th>");

                tableContent.Append("<th>Last DCR Date</th>");
                tableContent.Append("</thead>");
                tableContent.Append("</tbody>");

                for (var i = 0; i < userDetail.Rows.Count; i++)
                {
                    tableContent.Append("</tr>");

                    tableContent.Append("<td align='center' id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center' id='tdUserTypeName_" + i + "'>" + userDetail.Rows[i]["User_Type_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center' id='tdRegionName_" + i + "'>" + userDetail.Rows[i]["Region_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center'>" + userDetail.Rows[i]["Employee_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center'>" + userDetail.Rows[i]["Employee_Number"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center'>" + userDetail.Rows[i]["Division_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center'>" + userDetail.Rows[i]["Under_User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td align='center'>" + userDetail.Rows[i]["Under_Region_Name"].ToString() + " </td>  ");

                    daysWorkeddataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (daysWorkeddataFilter.Length > 0)
                    {
                        foreach (DataRow dr in daysWorkeddataFilter)
                        {
                            tableContent.Append("<td align='center'>" + dr["Total_Number_Of_Days"].ToString() + " </td>  ");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~NO_REPORT_DAYS~" + i + "\")' >");
                            tableContent.Append("" + dr["No_Reporting_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~NOT_AVAIL_DAYS~" + i + "\")' >" + dr["Not_Available_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~WEEKEND~" + i + "\")' >" + dr["Weekend_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~LEAVE~" + i + "\")' >" + dr["Total_Leave_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~HOLIDAY~" + i + "\")' >" + dr["Holiday"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~NONFIELD_DAYS~" + i + "\")' >" + dr["Total_Attendance_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~FIELD_DAYS~" + i + "\")' >" + dr["Total_Field_Days"].ToString() + "</td>");
                            tableContent.Append("<td align='center'>" + double.Parse(dr["Days_Worked"].ToString()).ToString("N2") + "</td>");


                            int daysInMonth = DateTime.DaysInMonth(int.Parse(year), int.Parse(month));
                            double weekend = double.Parse(dr["Weekend_Days"].ToString());
                            double holiday = double.Parse(dr["Holiday"].ToString());
                            double NonFWDays = double.Parse(dr["Total_Attendance_Days"].ToString());
                            double fieldWorkDays = double.Parse(dr["Total_Field_Days"].ToString());

                            double standaredWorkingDays = daysInMonth - weekend - holiday;
                            double availableFieldDays = daysInMonth - weekend - holiday - NonFWDays;

                            double daysWorked2 = 0;
                            if (availableFieldDays > 0)
                            {
                                daysWorked2 = (fieldWorkDays / availableFieldDays) * 100;
                            }


                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~STANDARED_WORK_DAYS~" + i + "\")'>" + standaredWorkingDays.ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnDayanalysis(\"" + userDetail.Rows[i]["User_Code"].ToString() + "~" + month + "~" + year + "~AVAIL_FIELD_DAYS~" + i + "\")'>" + availableFieldDays.ToString() + "</td>");
                            tableContent.Append("<td align='center'>" + double.Parse(daysWorked2.ToString()).ToString("N2") + "</td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");

                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                        tableContent.Append("<td align='center'>0</td>  ");
                    }

                    dateFilter = lastSubmittedDate.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (dateFilter.Length > 0)
                    {
                        foreach (DataRow dr in dateFilter)
                        {
                            tableContent.Append("<td align='center'>" + dr["Last_Submitted_Date"].ToString() + " </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                }
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");
            tableheader.Append("</div>");
            tableheader.Append("</div>");

            return tableheader.ToString() + "*" + tableContent.ToString();
        }
        //day Analysis Report End//

        //Bind Doctor Call Analysis report start//
        public string FWGetDoctorCallAnalysisdetails(string userCode, string month, string year, string mode, string userTypeName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            string usertypeCode = "";
            string reportType = "SUB";

            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWAnalysisDetails(_objCurInfo.GetCompanyCode(), userCode, usertypeCode, month, year, mode, reportType);
            return FWGetDoctorCallAnalysisTable(ds, month, year, mode, userTypeName, usertypeCode, userCode);
        }
        public string FWGetDoctorCallAnalysisTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable userDetail = ds.Tables[1];
            DataTable DaysWorkedDetail = ds.Tables[2];
            DataTable CategoryWiseDetail = ds.Tables[3];
            DataTable lastSubmittedDate = ds.Tables[4];
            DataTable categoryTable = ds.Tables[0];
            DataRow[] daysWorkeddataFilter;
            DataRow[] categoryDoctorcountFilter;

            string monthName = GetMonthName(month);
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string category = "ALL";
            string unlistDoctors = "UNLISTED";

            DataTable userDetails = ds.Tables[5];
            string userDet = string.Empty;

            if (userDetails.Rows.Count > 0)
            {
                userDet = userDetails.Rows[0]["User_Name"].ToString() + " (" + userDetails.Rows[0]["User_Type_Name"].ToString() + ") " + " | " + userDetails.Rows[0]["Region_Name"].ToString() + "(" + userDetails.Rows[0]["Region_Type_Name"].ToString() + ")";
            }

            string startDate = "01/" + month + "/" + year;
            string endDate = DateTime.DaysInMonth(int.Parse(year), int.Parse(month)) + "/" + month + "/" + year;

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='DrCallanalysis'>");
                tableheader.Append("<div class='dvHeader' id='spnDocCallAnalyHeader'>");
                tableheader.Append("<div class='dvheader-inner'>DOCTOR CALL ANALYSIS of " + userDet + " for the period of " + startDate + " to " + endDate + "</div>");

                tableheader.Append("<div class='helpIconRpt'>");
                tableheader.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_DOCTOR_CALL_ANALYSIS','HEADER')\" />");
                tableheader.Append("</div>");

                tableheader.Append("</div>");

                tableContent.Append("<table class='data display dataTable' width='100%' id='tbl_FWADoctorCallAnanlysis'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th>User Name </th>");
                tableContent.Append("<th>User Type Name</th>");
                tableContent.Append("<th>Territory Name</th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");
                tableContent.Append("<th>Total Drs Count</th>");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Category ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Drs Count</th>");
                    }
                    tableContent.Append("<th>Listed Drs Count</th>");
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Category ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Drs Covered</th>");
                    }
                    tableContent.Append("<th>Total Non listed Drs</th>");
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Category ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Drs Coverage %</th>");
                    }
                }
                tableContent.Append("<th>Total Drs Coverage %");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_TOTAL_COVERAGE','TOTAL_DRS_COVERAGE')\" />");
                tableContent.Append("</div>");
                tableContent.Append("</th>");

                tableContent.Append("</thead>");
                tableContent.Append("</tbody>");
                tableContent.Append("</tr>");

                for (var i = 0; i < userDetail.Rows.Count; i++)
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td class='tdHyp' id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Type_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdRegionName_" + i + "'>" + userDetail.Rows[i]["Region_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpName_" + i + "'>" + userDetail.Rows[i]["Employee_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpNumber_" + i + "'>" + userDetail.Rows[i]["Employee_Number"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdDivisionName_" + i + "'>" + userDetail.Rows[i]["Division_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnserUserName_" + i + "'>" + userDetail.Rows[i]["Under_User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnderRegionName_" + i + "'>" + userDetail.Rows[i]["Under_Region_Name"].ToString() + " </td>  ");
                    //to bind total approved doctors count//
                    daysWorkeddataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (daysWorkeddataFilter.Length > 0)
                    {
                        foreach (DataRow dr in daysWorkeddataFilter)
                        {
                            //tableContent.Append("<td id='tdApprovedDoctors_" + i + "' class='tdHyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + category + "\",this)'>" + DaysWorkedDetail.Rows[0]["Approved_Doctors_Count"].ToString() + " </td>");
                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + category + "_" + month + "_" + year + "_Doctor details\",this)'>" + dr["Approved_Doctors_Count"].ToString() + " </td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }

                    //category wise approved doctors count//
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        //string callCoverage = string.Empty;

                        double doctorCategoryCount = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {

                                doctorCategoryCount += float.Parse(dr["Total_Approved_Doctors"].ToString());

                            }
                            //tableContent.Append("<td id='tdApprovedDoctors_" + i + "' class='tdHyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "\",this)'>" + Math.Round(doctorCategoryCount, 2) + " </td>");

                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotalApprovedDoctorspopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_Doctor details\",this)'>" + Math.Round(doctorCategoryCount, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }
                    //listed doctor covered//
                    daysWorkeddataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (daysWorkeddataFilter.Length > 0)
                    {
                        foreach (DataRow dr in daysWorkeddataFilter)
                        {
                            //tableContent.Append("<td align='center'>" + DaysWorkedDetail.Rows[0]["Listed_Doctors_Covered"].ToString() + " </td>  ");

                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotallistedDrs(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + category + "_" + month + "_" + year + "_Doctor Details\",this)'>" + dr["Listed_Doctors_Covered"].ToString() + " </td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                    //category wise total Total_Visited_Doctors covered
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double doctorDoctorsCovered = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                doctorDoctorsCovered += float.Parse(dr["Total_Visited_Doctors"].ToString());
                            }
                            //tableContent.Append("<td align='center' class='td-hyp' onclick='fntotalcoveredCategorypopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "\")' >" + Math.Round(doctorDoctorsCovered, 2) + "</td>");

                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotallistedDrs(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_Doctor Details\",this)'>" + Math.Round(doctorDoctorsCovered, 2) + " </td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }
                    //unlisted Doctors Covered made//
                    daysWorkeddataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (daysWorkeddataFilter.Length > 0)
                    {
                        foreach (DataRow dr in daysWorkeddataFilter)
                        {
                            //tableContent.Append("<td align='center'>" + DaysWorkedDetail.Rows[0]["Unlisted_Doctor_Calls_Made"].ToString() + " </td>  ");
                            tableContent.Append("<td align='center' id='tdApprovedDoctors_" + i + "' class='td-hyp' onclick='fntotallistedDrs(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + unlistDoctors + "_" + month + "_" + year + "_Doctor Details\",this)'>" + dr["Unlisted_Doctor_Calls_Made"].ToString() + " </td>");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                    //category wise doctor coverage % binding
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double categoryCoverage = 0;
                        categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorcountFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorcountFilter)
                            {
                                categoryCoverage += float.Parse(dr["Category_Coverage"].ToString());
                            }
                            //tableContent.Append("<td align='center' class='td-hyp' onclick='fntotalcoveredCategorypopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "\")' >" + Math.Round(categoryCoverage, 2) + "</td>");
                            tableContent.Append("<td align='center' >" + Math.Round(categoryCoverage, 2) + "</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }
                    //total doctor Coverage %
                    daysWorkeddataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (daysWorkeddataFilter.Length > 0)
                    {
                        foreach (DataRow dr in daysWorkeddataFilter)
                        {
                            tableContent.Append("<td align='center'>" + double.Parse(dr["Total_Coverage"].ToString()).ToString("N2") + " </td>  ");

                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                }
            }
            tableContent.Append("</tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");
            tableContent.Append("</div>");
            return tableheader.ToString() + "*" + tableContent.ToString();
        }
        //Bind Doctor Call Analysis report End//

        //Bind Doctor call ananlysis popup starts//

        public string GetDoctorDetailPopup(string userCode, string category, string month, string year)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWDoctorDetails(_objCurInfo.GetCompanyCode(), category, userCode, month, year);
            return FWGetGetDoctorDetailPopupTable(ds);
        }
        public string FWGetGetDoctorDetailPopupTable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[1];
            var no = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='DrdetailPopup'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
                tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
                tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Date Of Joining</b></td></tr>");
                tableContent.Append("<tr><td>" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Employee_Name"].ToString() + " </td>");
                tableContent.Append("<td>" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td><td >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td>");
                tableContent.Append("<td>" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td><td >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");

                tableContent.Append("<table class='data display datatable box' id='tbl_ApprovedDoctorDetails'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>Sl.No</th>");
                tableContent.Append("<th>Doctor Name</th>");
                tableContent.Append("<th>MDL No</th>");
                tableContent.Append("<th>Category</th>");
                tableContent.Append("<th>Speciality</th>");
                tableContent.Append("<th>Local Area</th>");
                tableContent.Append("<th>Hospital Name</th>");
                //tableContent.Append("<th>Hospital Classification</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    no++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>");
                    tableContent.Append(no);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Customer_Name"].ToString() + " " + customerDetail.Rows[i]["Sur_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Local_Area"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                    tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Hospital_Classification"].ToString());
                    //tableContent.Append("</td>");

                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }
            return tableContent.ToString();
        }

        public string GetlistedDoctorDetailPopup(string userCode, string category, string month, string year)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWListedDrsCoveredDetails(_objCurInfo.GetCompanyCode(), category, userCode, month, year);
            return FWGetGetlistedDoctorDetailPopupTable(ds);
        }
        public string FWGetGetlistedDoctorDetailPopupTable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[2];
            var no = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='dvlistedDrpopup'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Division</b></td><td align='left' >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Region Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Territory</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Date Of Joining</b></td><td align='left' >" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("<table class='data display datatable box' id='tbl_ApprovedDoctorDetails'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>sl.No</th>");
                tableContent.Append("<th>Doctor Name</th>");
                tableContent.Append("<th>MDL No</th>");
                tableContent.Append("<th>Category</th>");
                tableContent.Append("<th>Speciality</th>");
                tableContent.Append("<th>Hospital Name</th>");
                //tableContent.Append("<th>Hospital Classification</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    no++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>");
                    tableContent.Append(no);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                    tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Hospital_Classification"].ToString());
                    //tableContent.Append("</td>");

                }

                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }
            return tableContent.ToString();
        }

        public string GetlistedDrFreqAchievedPop(string userCode, string category, string month, string year, string CategoryName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWListedDrsCoveredDetails(_objCurInfo.GetCompanyCode(), category, userCode, month, year);
            return GetlistedDrFreqAchievedPopTable(ds,CategoryName);
        }
        public string GetlistedDrFreqAchievedPopTable(DataSet ds,string categoryName)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableContentRightfre = new StringBuilder();
            StringBuilder tableContentbelowFre = new StringBuilder();
            StringBuilder tableContentAboveFre = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[2];

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='dvDrFreqpopup'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");

                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
                tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
                tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Date Of Joining</b></td></tr>");
                tableContent.Append("<tr><td>" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Employee_Name"].ToString() + " </td>");
                tableContent.Append("<td>" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td><td >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td>");
                tableContent.Append("<td>" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td><td >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td><td>" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");

                tableContent.Append("<table class='data display datatable box' id='tbl_drFreqAchieved'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>sl.No</th>");
                tableContent.Append("<th>Doctor Name</th>");
                tableContent.Append("<th>MDL No</th>");
                tableContent.Append("<th>Category</th>");
                tableContent.Append("<th>Speciality</th>");
                tableContent.Append("<th>Hospital Name</th>");
                tableContent.Append("<th>Local Area</th>");
                tableContent.Append("<th>Visit Count</th>");
                //tableContent.Append("<th>Visit Type</th>");
                //tableContent.Append("<th>Hospital Classification</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead><tbody>");
                int siNo = 0;
                int siNoRF = 0;
                int siNoBF = 0;
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    string visitType = string.Empty;

                    if (int.Parse(customerDetail.Rows[i]["Standard_Visits_Count"].ToString()) < int.Parse(customerDetail.Rows[i]["Visit_Count"].ToString()))
                    {
                        var ABCount = siNo;
                        visitType = "Above Expected Visit Frequency";
                        siNo++;

                        tableContentAboveFre.Append("<tr>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(siNo.ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Local_Area"].ToString());
                        tableContentAboveFre.Append("</td>");
                        tableContentAboveFre.Append("<td>");
                        tableContentAboveFre.Append(customerDetail.Rows[i]["Visit_Count"].ToString());
                        tableContentAboveFre.Append("</td>");                        
                        tableContentAboveFre.Append("</tr>");

                    }
                    else if (int.Parse(customerDetail.Rows[i]["Standard_Visits_Count"].ToString()) == int.Parse(customerDetail.Rows[i]["Visit_Count"].ToString()))
                    {

                        visitType = "Exactly equal to Expected Visit Frequency";
                        siNoRF++;
                        tableContentRightfre.Append("<tr>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(siNoRF.ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Local_Area"].ToString());
                        tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("<td>");
                        tableContentRightfre.Append(customerDetail.Rows[i]["Visit_Count"].ToString());
                        tableContentRightfre.Append("</td>");
                        //tableContentRightfre.Append("<td>");
                        //tableContentRightfre.Append(visitType);
                        //tableContentRightfre.Append("</td>");
                        tableContentRightfre.Append("</tr>");

                    }
                    else
                    {
                        visitType = "Below Expected Visit Frequency";                       
                        siNoBF++;
                        
                        tableContentbelowFre.Append("<tr>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(siNoBF.ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Local_Area"].ToString());
                        tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("<td>");
                        tableContentbelowFre.Append(customerDetail.Rows[i]["Visit_Count"].ToString());
                        tableContentbelowFre.Append("</td>");
                        //tableContentbelowFre.Append("<td>");
                        //tableContentbelowFre.Append(visitType);
                        //tableContentbelowFre.Append("</td>");
                        tableContentbelowFre.Append("</tr>");

                    }


                }
                if (siNo > 0) //Above frequency
                {
                    tableContent.Append("<tr><td colspan='8' style='font-weight:bold;background-color:darkgrey' onclick='fnExpand();'>Above Expected Visit Frequency (" + siNo + ")</td></tr>");
                    tableContent.Append(tableContentAboveFre);                 
                }
                if (siNoRF > 0)//Equal Frequency
                {
                    tableContent.Append("<tr><td colspan='8' style='font-weight:bold;background-color:darkgrey'onclick='fnExpand();'>Exactly equal to Expected Visit Frequency (" + siNoRF + ")</td></tr>");
                    tableContent.Append(tableContentRightfre);                   
                }
                if (siNoBF > 0)//Below Frequency
                {                    
                    tableContent.Append("<tr><td colspan='8' style='font-weight:bold;background-color:darkgrey'onclick='fnExpand();'>Below Expected Visit Frequency (" + siNoBF + ")</td></tr>");
                    tableContent.Append("<tr><td colspan='8' style='font-weight:bold;background-color:darkgrey'>The number of doctors shown under this section is not considered in the Number of " + categoryName + " doctor for whom visit frequency is acheived value and is only displayed for information.</td></tr>");
                    tableContent.Append(tableContentbelowFre);                    
                }
                
                //tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }
            return tableContent.ToString();
        }

        //Bind Doctor call ananlysis popup End//

        //Bind chemist Met Analysis Report Start//
        public string FWGetChemistCallAnalysis(string userCode, string month, string year, string mode, string userTypeName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            string usertypeCode = "";
            string reportType = "SUB";

            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWAnalysisDetails(_objCurInfo.GetCompanyCode(), userCode, usertypeCode, month, year, mode, reportType);
            return FWGetChemistCallAnalysisTable(ds, month, year, mode, userTypeName, usertypeCode, userCode);
        }
        public string FWGetChemistCallAnalysisTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable userDetail = ds.Tables[1];
            DataTable DaysWorkedDetail = ds.Tables[2];
            string monthName = GetMonthName(month);
            string Entity = "CHEMIST";

            DataTable userDetails = ds.Tables[5];
            string userDet = string.Empty;

            if (userDetails.Rows.Count > 0)
            {
                userDet = userDetails.Rows[0]["User_Name"].ToString();
            }

            DataRow[] chemistFilter;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='ChemistMetAnalysis'>");
                tableheader.Append("<div class='dvHeader' id='spnChemistHeader'>");
                tableheader.Append("<div class='dvheader-inner'>Chemist met details of  " + userDet + " for the month of " + monthName + "</div>");

                tableheader.Append("<div class='helpIconRpt'>");
                tableheader.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_CHEMIST_MET','HEADER')\" />");
                tableheader.Append("</div>");

                tableheader.Append("</div>");

                tableContent.Append("<table class='data display dataTable' width='100%' id='tbl_ChemistMetAnalysis'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th>User Name </th>");
                tableContent.Append("<th>User Type Name</th>");
                tableContent.Append("<th>Territory Name</th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");
                tableContent.Append("<th>Total Chemist Call Made</th>");
                tableContent.Append("<th>Total Chemist Met</th>");
                tableContent.Append("<th>POB Value</th>");
                tableContent.Append("</thead>");
                tableContent.Append("</tbody>");
                tableContent.Append("</tr>");

                for (var i = 0; i < userDetail.Rows.Count; i++)
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td class='tdHyp' id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Type_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdRegionName_" + i + "'>" + userDetail.Rows[i]["Region_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpName_" + i + "'>" + userDetail.Rows[i]["Employee_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpNumber_" + i + "'>" + userDetail.Rows[i]["Employee_Number"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdDivisionName_" + i + "'>" + userDetail.Rows[i]["Division_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnserUserName_" + i + "'>" + userDetail.Rows[i]["Under_User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnderRegionName_" + i + "'>" + userDetail.Rows[i]["Under_Region_Name"].ToString() + " </td>  ");
                    chemistFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    if (chemistFilter.Length > 0)
                    {
                        foreach (DataRow dr in chemistFilter)
                        {
                            //tableContent.Append("<td align='center' class='td-hyp' onclick='fnChemistMetPopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "\")' >" + DaysWorkedDetail.Rows[0]["Total_Chemist_Calls_Made"].ToString() + "</td>");
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnChemistPopup(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + Entity + "_Chemist Details_" + mode + "\")' >" + dr["Total_Chemist_Calls_Made"].ToString() + "</td>");
                            tableContent.Append("<td align='center'>" + dr["Unique_Chemist_Visited_Count"].ToString() + " </td>  ");
                            tableContent.Append("<td align='center'>" + dr["Total_Chemist_POB"].ToString() + " </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                        tableContent.Append("<td align='center'>0</td>");
                        tableContent.Append("<td align='center'>0</td>");
                    }
                }
            }
            tableContent.Append("</tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");
            tableContent.Append("</div>");

            return tableheader.ToString() + "*" + tableContent.ToString();
        }
        //Bind chemist Met Analysis ends Start//

        public string FWGetVisitsFrequencyAnalysis(string userCode, string month, string year, string mode, string userTypeName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            string usertypeCode = "";
            string reportType = "SUB";

            DataSet ds = new DataSet();
            ds = _objBlFWA.GetDoctorVisifrequencyAnalysisCalsi(_objCurInfo.GetCompanyCode(), userCode, usertypeCode, month, year, mode, reportType);
            return FWGetVisitsFrequencyAnalysisTable(ds, month, year, mode, userTypeName, usertypeCode, userCode,reportType);
        }

        public string FWGetVisitsFrequencyAnalysisTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode, string reportType)
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
            string monthName = GetMonthName(month);
            string companyCode = _objcurrentInfo.GetCompanyCode();
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
                tableContent.Append("<table class='data display dataTable' width='100%' id='tbl_FWADoctorvisitAnanlysis'>");
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

                    

                    //category wise  Drs Met as per visit count
                    //for (var u = 0; u < categoryTable.Rows.Count; u++)
                    //{
                    //    double categoryVisitmet = 0;
                    //    categoryDoctorcountFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Doctor_Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                    //    if (categoryDoctorcountFilter.Length > 0)
                    //    {
                    //        foreach (DataRow dr in categoryDoctorcountFilter)
                    //        {
                    //            categoryVisitmet += float.Parse(dr["Category_Met"].ToString());
                    //        }
                    //        tableContent.Append("<td align='center'>" + Math.Round(categoryVisitmet, 2) + " </td>");
                    //    }
                    //    else
                    //    {
                    //        tableContent.Append("<td align='center'>0 </td>  ");
                    //    }
                    //}

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
                            tableContent.Append("<td align='center' class='td-hyp' onclick='fnFrequencyPopUp(\"" + userDetail.Rows[i]["User_Code"].ToString() + "_" + categoryTable.Rows[u]["Category_Code"].ToString() + "_" + month + "_" + year + "_"+ "_Doctor Details\",this)'>0 </td>  ");
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
            return tableheader.ToString() + "*" + tableContent.ToString();
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



        // FWGetJointWorkAnalysis//

        public string FWGetJointWorkAnalysis(string userCode, string month, string year, string mode, string userTypeName)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWJointWorkAnalysisDetails(_objCurInfo.GetCompanyCode(), userCode, month, year);
            return FWGetJointworkanalysisTable(ds, month, year, mode, userTypeName, "", userCode);
        }

        public string FWGetJointworkanalysisTable(DataSet ds, string month, string year, string mode, string userTypeName, string usertypeCode, string userCode)
        {

            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable userDetail = ds.Tables[0];
            DataTable DaysWorkedDetail = ds.Tables[1];
            DataTable CategoryWiseDetail = ds.Tables[2];
            DataTable nonlistedDoctor = ds.Tables[3];
            DataTable dcrDays = ds.Tables[4];
            DataTable approveddcrDays = ds.Tables[5];
            DataTable totalfieldDays = ds.Tables[6];
            DataTable categoryTable = ds.Tables[7];
            DataRow[] jointworkdataFilter;
            DataRow[] categoryDoctorFilter;
            DataRow[] nonlistedDoctorFilter;
            string monthName = GetMonthName(month);
            string modeName = GetModeName(mode);
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userDet = string.Empty;
            if (totalfieldDays.Rows.Count > 0)
            {
                userDet = totalfieldDays.Rows[0]["User_Name"].ToString();
            }

            string startDate = "01/" + month + "/" + year;
            string endDate = DateTime.DaysInMonth(int.Parse(year), int.Parse(month)) + "/" + month + "/" + year;


            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='JointFieldreport'>");
                tableheader.Append("<div class='dvHeader' id='dvJointWorkHeader'>");

                tableheader.Append("<div class='dvheader-inner'>JOINT WORK ANALYSIS ANALYSIS REPORT of " + userDet + "  for the period of " + startDate + " to " + endDate + "</div>");

                tableheader.Append("<div class='helpIconRpt'>");
                tableheader.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_JOINT_WORK','HEADER')\" />");
                tableheader.Append("</div>");

                tableheader.Append("</div>");

                tableContent.Append("<table class='data display dataTable' width='100%' id='tbl_FWAjointWorkAnanlysis'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th>User Name </th>");
                tableContent.Append("<th>User Type Name</th>");
                tableContent.Append("<th>Territory Name</th>");
                tableContent.Append("<th>Employee Name</th>");
                tableContent.Append("<th>Employee Number</th>");
                tableContent.Append("<th>Division</th>");
                tableContent.Append("<th>Reporting Manager</th>");
                tableContent.Append("<th>Reporting HQ</th>");
                tableContent.Append("<th>Total No of FW Days of (" + totalfieldDays.Rows[0]["User_Name"] + ")</th>");
                tableContent.Append("<th>No of Joined work days</th>");
                tableContent.Append("<th>% Days Joined");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_JOINT_WORK','DAYS_JOINED')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");
                tableContent.Append("<th>Total Drs Met</th>");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (var k = 0; k < categoryTable.Rows.Count; k++)
                    {

                        tableContent.Append("<th align='left' width='15%'>Category ");
                        tableContent.Append(categoryTable.Rows[k]["Category_Name"].ToString());
                        tableContent.Append(" Drs Count</th>");
                    }
                }
                tableContent.Append("<th>Total Non Listed Drs</th>");
                tableContent.Append("<th>Joint Call Average");

                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('FWA_JOINT_WORK','JOINT_CALL_AVERAGE')\" />");
                tableContent.Append("</div>");

                tableContent.Append("</th>");
                tableContent.Append("<th>No Of Days DCR Submitted</th>");
                tableContent.Append("<th>No Of DCR's Approved</th>");
                tableContent.Append("</thead>");
                tableContent.Append("</tbody>");
                tableContent.Append("</tr>");

                for (var i = 0; i < userDetail.Rows.Count; i++)
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUserName_" + i + "'>" + userDetail.Rows[i]["User_Type_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdRegionName_" + i + "'>" + userDetail.Rows[i]["Region_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpName_" + i + "'>" + userDetail.Rows[i]["Employee_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdEmpNumber_" + i + "'>" + userDetail.Rows[i]["Employee_Number"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdDivisionName_" + i + "'>" + userDetail.Rows[i]["Division_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnserUserName_" + i + "'>" + userDetail.Rows[i]["Under_User_Name"].ToString() + " </td>  ");
                    tableContent.Append("<td  id='tdUnderRegionName_" + i + "'>" + userDetail.Rows[i]["Under_Region_Name"].ToString() + " </td>  ");
                    //total field days//

                    double totalfieldday = float.Parse(totalfieldDays.Rows[0]["Total_Field_Days"].ToString());
                    tableContent.Append("<td align='center'>" + totalfieldday + " </td>  ");
                    //no of joined worked days//
                    jointworkdataFilter = DaysWorkedDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();
                    double jointwork = 0;
                    if (jointworkdataFilter.Length > 0)
                    {
                        foreach (DataRow dr in jointworkdataFilter)
                        {
                            jointwork = float.Parse(dr["Days"].ToString());
                            tableContent.Append("<td align='center'>" + jointwork + " </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                    //%jointworked
                    double daysjoined = 0;
                    if (totalfieldday > 0)
                    {
                        daysjoined = (jointwork / totalfieldday) * 100;
                        tableContent.Append("<td align='center'>" + Math.Round(daysjoined, 2) + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                    }
                    //total drs met//
                    double totaldrsmet = 0;
                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        categoryDoctorFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorFilter)
                            {
                                totaldrsmet += float.Parse(dr["Category_Met"].ToString());
                            }
                        }
                    }
                    tableContent.Append("<td align='center'>" + Math.Round(totaldrsmet, 2) + " </td>");
                    //drs met category met//

                    for (var u = 0; u < categoryTable.Rows.Count; u++)
                    {
                        double categorymet = 0;
                        categoryDoctorFilter = CategoryWiseDetail.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString() && c["Category_Code"].ToString() == categoryTable.Rows[u]["Category_Code"].ToString()).ToArray();
                        if (categoryDoctorFilter.Length > 0)
                        {
                            foreach (DataRow dr in categoryDoctorFilter)
                            {
                                categorymet += float.Parse(dr["Category_Met"].ToString());
                                tableContent.Append("<td align='center'>" + Math.Round(categorymet, 2) + " </td>");
                            }
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }
                    //non listed drs bind//
                    nonlistedDoctorFilter = nonlistedDoctor.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();

                    double nonlisteddrs = 0;
                    if (nonlistedDoctorFilter.Length > 0)
                    {
                        foreach (DataRow dr in nonlistedDoctorFilter)
                        {
                            nonlisteddrs = float.Parse(dr["Non_Listed_Doctors"].ToString());
                            tableContent.Append("<td align='center'>" + nonlisteddrs + " </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }
                    //joined call avg//

                    double callavg = 0;
                    if (jointwork > 0)
                    {
                        callavg = (totaldrsmet / jointwork);
                        tableContent.Append("<td align='center'>" + Math.Round(callavg, 2) + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                    }

                    //no of days drs sumitted//
                    DataRow[] Dcrsubmitted = dcrDays.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();

                    double dcrsubmitted = 0;
                    if (Dcrsubmitted.Length > 0)
                    {
                        foreach (DataRow dr in Dcrsubmitted)
                        {
                            dcrsubmitted = float.Parse(dr["DCR_Days"].ToString());
                            tableContent.Append("<td align='center'>" + dcrsubmitted + " </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }

                    //dcr approved//
                    DataRow[] approvedDcr = approveddcrDays.AsEnumerable().Where(c => c["User_Code"].ToString() == userDetail.Rows[i]["User_Code"].ToString()).ToArray();

                    double approvedDcrdate = 0;
                    if (approvedDcr.Length > 0)
                    {
                        foreach (DataRow dr in approvedDcr)
                        {
                            approvedDcrdate = float.Parse(dr["Approved_DCR_Days"].ToString());
                            tableContent.Append("<td align='center'>" + approvedDcrdate + " </td>  ");


                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>  ");
                    }

                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }

            return tableheader.ToString() + "*" + tableContent.ToString();
        }

        // FWGetJointWorkAnalysis end//
        public string GetModeName(string mode)
        {
            if (mode == "1")
            {
                return "Self";
            }
            else
            {
                return "Team";
            }
        }

        public string GetChemistDetailPopup(string userCode, string month, string year, string entity, string mode)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWEntityDetails(companyCode, userCode, month, year, entity, mode);
            return GetchemistDetailPopupTable(ds);

        }

        public string GetIndependentdrsDetailPopup(string userCode, string month, string year, string entity, string mode)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWEntityDetails(companyCode, userCode, month, year, entity, mode);
            return GetindependentDoctortable(ds);

        }

        public string GetStockiestDetailPopup(string userCode, string month, string year, string entity, string mode)
        {
            DataControl.BLFieldWorkAnalysis _objBlFWA = new DataControl.BLFieldWorkAnalysis();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            ds = _objBlFWA.GetFWEntityDetails(companyCode, userCode, month, year, entity, mode);
            return GetstockiestDetailtable(ds);
        }



        //indepent doctor popup//
        public string GetindependentDoctortable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[1];
            var no = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='independentDr'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Division</b></td><td align='left' >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Region Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Territory</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Date Of Joining</b></td><td align='left' >" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");

                tableContent.Append("<table class='data display datatable box' id='tbl_independentDr'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>sl.No</th>");
                tableContent.Append("<th>Doctor Name</th>");
                tableContent.Append("<th>MDL No</th>");
                tableContent.Append("<th>Category</th>");
                tableContent.Append("<th>Speciality</th>");
                tableContent.Append("<th>Hospital Name</th>");
                //tableContent.Append("<th>Hospital Classification</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    no++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>");
                    tableContent.Append(no);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                    tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Hospital_Classification"].ToString());
                    //tableContent.Append("</td>");
                    tableContent.Append("</tr>");
                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }

            return tableContent.ToString();
        }

        //chemist met popup//
        public string GetchemistDetailPopupTable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[1];
            var no = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='dvChemistpopup'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Division</b></td><td align='left' >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Region Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Territory</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Date Of Joining</b></td><td align='left' >" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("<table class='data display datatable box' id='tbl_ChemistDetails'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>Si.No</th>");
                tableContent.Append("<th>User Name</th>");
                tableContent.Append("<th>Chemist Name</th>");
                //tableContent.Append("<th>MDL No</th>");
                //tableContent.Append("<th>Category</th>");
                //tableContent.Append("<th>Speciality</th>");
                //tableContent.Append("<th>Hospital Name</th>");
                tableContent.Append("<th>POB Value</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    no++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>");
                    tableContent.Append(no);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td>");

                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                    tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["MDL_Number"].ToString());
                    //tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Speciality_Name"].ToString());
                    //tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Category_Name"].ToString());
                    //tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //tableContent.Append(customerDetail.Rows[i]["Hospital_Name"].ToString());
                    //tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["PO_Amount"].ToString());
                    tableContent.Append("</td>");

                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }
            return tableContent.ToString();
        }

        //stockiest detail popup//
        public string GetstockiestDetailtable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableheader = new StringBuilder();
            DataTable customerDetail = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[1];
            var no = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<div id='dvStockiestpopup'>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + userDetailTable.Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Division</b></td><td align='left' >" + userDetailTable.Rows[0]["Division_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_User_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Employee Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Region Name</b></td><td align='left' >" + userDetailTable.Rows[0]["Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' ><b>Manager Territory</b></td><td align='left' >" + userDetailTable.Rows[0]["Under_Region_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left' ><b>Date Of Joining</b></td><td align='left' >" + userDetailTable.Rows[0]["Date_of_joining"].ToString() + "</td></tr>");
                tableContent.Append("<table class='data display datatable box' id='tbl_stockDetails'>");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th>Si.No</th>");
                tableContent.Append("<th>User Name</th>");
                tableContent.Append("<th>DCR Date</th>");
                tableContent.Append("<th>Stockiest Name</th>");
                tableContent.Append("<th>POB Value</th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                for (var i = 0; i < customerDetail.Rows.Count; i++)
                {
                    no++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>");
                    tableContent.Append(no);
                    tableContent.Append("</td>");

                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td>");

                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["DCR_Actual_Date"].ToString());
                    tableContent.Append("</td>");

                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["Customer_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(customerDetail.Rows[i]["PO_Amount"].ToString());
                    tableContent.Append("</td>");

                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
                tableContent.Append("</div>");
            }
            else
            {
                tableContent.Append("<div> -- No data found -- </div>");
            }
            return tableContent.ToString();
        }
        //added method SRISUDHAN//
        //get child user count//
        public string GetUnderChildUserCount(string userCode)
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLFieldWorkAnalysis objBLFWA = new BLFieldWorkAnalysis();
                int underUserCount = objBLFWA.GetUnderChildUserCount(companyCode, userCode);
                return underUserCount.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        #endregion sub reports
    }
}
    
   
   
