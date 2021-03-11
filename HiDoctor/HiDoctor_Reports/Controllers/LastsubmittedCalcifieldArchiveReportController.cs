using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Collections;
using System.Text.RegularExpressions;
using ElmahWrapper;
using DataControl;
using System.Text;
using MVCModels;
using System.Web.SessionState;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using DataControl.HiDoctor_ReportsFactoryClasses;
using DataControl.HiDoctor_ReportsFactoryClasses;
using MVCModels;
using MVCModels.HiDoctor_Reports;
using Newtonsoft.Json;

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class LastsubmittedCalcifieldArchiveReportController : Controller
    {
        //
        // GET: /LastsubmittedCalci fieldArchiveReport/
        #region Private Variables
        private CurrentInfo _objCurrentInfo = null;
        private BL_DoctorChemistMetTabular _objDocChemTabular = null;
        private BL_ReportRegion _objBL_ReportRegion = null;
        private ActivityCountController objActivity = new ActivityCountController();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LastSubmittedArchiveReportCalci()
        {
            return View();
        }

        public string GetLastSubmittedReportCalci(FormCollection collection)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string userCode = collection["userCode"].ToString();
            string unlistedDoctor = collection["type"].ToString();
            string dateSelection = collection["selectionType"].ToString();
            string UserSelection = string.Empty;
            string reportName = collection["title"].ToString();
            string missedDoctor = collection["missed"].ToString();
            string reportViewType = collection["reportViewType"].ToString();
            string childUsercounts = collection["childUsersCount"].ToString();
            string ArchiveReportConnectionString = _objData.GetArchiveConnectionString_Client();
            //if (month.Length <= 1)
            //{
            //    month = "0" + month;
            //}


            int days = DateTime.DaysInMonth(Convert.ToInt32(year), Convert.ToInt32(month));
            string selectedDate = year + "-" + month + "-" + days;

            JSONConverter objJson = new JSONConverter();
            List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount> lstChildusers = (List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount>)JsonConvert.DeserializeObject(childUsercounts,
                      typeof(List<MVCModels.HiDoctor_Reports.LastSubmittedChildUserCount>));
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
            



            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lstLastSubmitted = _objReport.GetlastsubmittedDetailArchiveReport(companyCode, userCode, month, year, UserSelection, selectedDate, ArchiveReportConnectionString);
            sbTableContent = GetLastSubmittedTable(lstLastSubmitted, lstChildusers, unlistedDoctor, month, year, reportName, missedDoctor, reportViewType);
            return sbTableContent.ToString();
        }

        public StringBuilder GetLastSubmittedTable(List<LastSubmittedReportModel> lstLastSubmitted, List<LastSubmittedChildUserCount> lstChildUsers, string unlistedDoc, string month, string year, string reportName, string missedDoctor, string reportViewType)
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
            sbTableContent.Append("<div><b> " + reportName + " for month of " + monthName + " - " + year + "</b></div>");

            sbTableContent.Append("<div style='margin-left: 7px;'>");
            sbTableContent.Append("<lable>1. Only approved DCRs are considered in this report</lable></br>");
            sbTableContent.Append("<lable>2.<span style='font-weight:bold;'>Count of Missed Doctors</span> is the Number of Doctors never visited even once in the selected date period.</lable></br>");
            sbTableContent.Append("<lable>3.<span style='font-weight:bold;'>Listed Doctors Visited Once</span> is the Number of Doctors visited only once in the selected date period. REPEAT for twice and thrice and more than thrice.</lable></br>");
            sbTableContent.Append("<lable>4.<span style='font-weight:bold;'>Count of Listed Doctors Met</span> is the Number of Doctors Met in the selected date period.</lable></br>");
            sbTableContent.Append("<lable>5.<span style='font-weight:bold;'>Average Number of Listed Doctors</span> Met is Listed Doctors Met / Num. of Field Days.</lable></br>");
            sbTableContent.Append("</div>");
            sbTableContent.Append("</br>");

            sbTableContent.Append("<table cellspacing='0' cellpadding='0'  width='100%' id='tblLastSubmittedReport'>");
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
                            if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                            //if (!string.IsNullOrEmpty(filtered[0].Unlisted_Doctor_Calls_Made))
                            //{
                            //    unlistedDoctorvisitcount = Convert.ToInt32(filtered[0].Unlisted_Doctor_Calls_Made);
                            //}
                            //if (!string.IsNullOrEmpty(filtered[0].Unique_Doctor_Visited_Count))
                            //{
                            //    listedDoctorvisitcount = Convert.ToInt32(filtered[0].Unique_Doctor_Visited_Count);
                            //    Doctorvisitcount = listedDoctorvisitcount - unlistedDoctorvisitcount;
                            //    doctorMetCOunt = Doctorvisitcount;
                            //    //sbTableContent.Append(filtered[0].Unique_Doctor_Visited_Count);
                            //    //doctorMetCOunt = Convert.ToInt32(filtered[0].Unique_Doctor_Visited_Count);
                            //}
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
                        if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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
                                    if (lstChildUserscounts[0].Child_Count.ToUpper() == "NO")
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


                    ////Chemist Calls made
                    //sbTableContent.Append("<td align='left' width='15%'>");
                    //sbTableContent.Append(filtered[0].Total_Chemist_Calls_Made);
                    ////sbTableContent.Append("</td>");
                    //if (!string.IsNullOrEmpty(filtered[0].Total_Chemist_Calls_Made))
                    //{
                    //    chemistCallCount = Convert.ToInt32(filtered[0].Total_Chemist_Calls_Made);
                    //}
                    ////Chemeist Avg
                    //sbTableContent.Append("<td align='left' width='15%'>");
                    //if (doctorCallCount > 0 && fieldDays > 0)
                    //{
                    //    ChemistCallAvg = (Convert.ToDouble(chemistCallCount) / fieldDays);
                    //    sbTableContent.Append(ChemistCallAvg.ToString("N2"));
                    //}
                    //sbTableContent.Append("</td>");


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
            return sbTableContent;
        }
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
                    titleName = "once Doctor Count";
                    break;
                case "TWICE":
                    titleName = "twice Doctor Count";
                    break;
                case "THRICE":
                    titleName = "thrice Doctor Count";
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

        public string GetLastsubmittedReportSub(FormCollection collection)
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string divisionName = string.Empty;
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string userCode = collection["userCode"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string userSelection = collection["type"].ToString();
            string vCount = collection["vCount"].ToString();
            string reportType = collection["reportType"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            if (!string.IsNullOrEmpty(collection["divisionName"].ToString()))
            {
                divisionName = collection["divisionName"].ToString();
            }

            return GetLastsubmittedSubReportCalci(companyCode, userCode, regionCode, month, year, userSelection, vCount, reportType, divisionName);
        }
        public string GetLastsubmittedSubReportCalci(string companyCode, string userCode, string regionCode, string month, string year, string userSelection, string visitCounts, string reportType, string divisionName)
        {
            BL_Report _report = new BL_Report();
            DataSet ds = new DataSet();
            ds = _report.GetLastSubmittedReportSubCalci(companyCode, userCode, regionCode, month, year, reportType, visitCounts);
            DataRow[] drFilter;
            StringBuilder tableContent = new StringBuilder();
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
                tableContent.Append(divisionName);
                tableContent.Append("</th></tr></thead></table>");


                int sNo = 0;
                int doctorMade = 0;
                string[] TobeDistinct = { "Category_Code", "Category_Name" };
                DataTable dtDistinct = GetDistinctRecords(ds.Tables[1], TobeDistinct);
                string title = GetSelectionType(userSelection);
                string visitCount = GetSelectionType(userSelection);
                int totalCount = 0;

                //  tableContent.Append("<div>" + title.Split('_')[0] + "</div>");
                tableContent.Append("<table class='data display datatable'><thead><tr>");
                tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
                tableContent.Append("<th align='left' width='15%'>MDL No</th>");
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
                tableContent.Append("</tr></thead><tbody>");



                totalCount = 0;
                int sum = 0;
                if (userSelection.ToUpper() == "MISSED")
                {
                    foreach (DataRow dr in dtDistinct.Rows)
                    {

                        drFilter = ds.Tables[1].AsEnumerable().Where(c => c["Category_Code"].ToString() == dr["Category_Code"].ToString()).ToArray();

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
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                totalCount += Convert.ToInt32(drFilter[0]["Missed_Doctors"].ToString());
                            }
                        }
                    }
                    tableContent.Append("<tr>");
                    tableContent.Append("<td colspan='2' align='right'>Total</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(totalCount);
                    tableContent.Append("</td></tr>");
                }
                else
                {
                    if (userSelection.ToUpper() == "ONCE")
                    {
                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                        && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append(categoryUnicList.Count);
                                        tableContent.Append("</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }
                    }
                    else if (userSelection.ToUpper() == "TWICE")
                    {
                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                           && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append(categoryUnicList.Count);
                                        tableContent.Append("</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }
                    }
                    else if (userSelection.ToUpper() == "THRICE")
                    {
                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                        && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append(categoryUnicList.Count);
                                        tableContent.Append("</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }
                    }
                    else if (userSelection.ToUpper() == "MORETHRICE")
                    {

                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                        && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append(categoryUnicList[0]["Visit_Count"]);
                                        tableContent.Append("</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }
                    }

                    else if (userSelection.ToUpper() == "DOCTORMET")
                    {

                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                        && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();
                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append(categoryUnicList.Count);
                                        tableContent.Append("</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }

                        //drFilter = ds.Tables[1].AsEnumerable().Where(c => c["Category_Name"].ToString() == dr["Category_Name"].ToString()).ToArray();
                        //tableContent.Append("<td align='left' width='15%'>");
                        //if (drFilter.Length > 0)
                        //{
                        //    //tableContent.Append(drFilter.Length);
                        //    //totalCount += Convert.ToInt32(drFilter.Length);

                        //    sum = drFilter.Sum(row => row.Field<int>("Missed_Doctors"));
                        //    tableContent.Append(sum);
                        //    totalCount += sum;
                        //}
                        //tableContent.Append("</td>");
                    }
                    else if (userSelection.ToUpper() == "DOCTORMADE")
                    {
                        if (ds.Tables[1].Rows.Count > 0 && ds.Tables.Count > 0)
                        {
                            foreach (DataRow item in ds.Tables[1].Rows)
                            {
                                tableContent.Append("<tr>");
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(item["Doctor_Name"].ToString());
                                tableContent.Append("</td>");
                                tableContent.Append("<td align='center' width='15%'>");
                                tableContent.Append(item["MDL_Number"].ToString());
                                tableContent.Append("</td>");
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
                                    var categoryUnicList = ds.Tables[1].AsEnumerable().Where(s => s["Category_Code"].ToString() == drt["Category_Code"].ToString()
                                        && s["Doctor_Code"].ToString() == item["Doctor_Code"].ToString()).ToList();


                                    if (categoryUnicList.Count > 0 && categoryUnicList != null)
                                    {
                                        if (item["Missed_Doctors"].ToString() != "0")
                                        {
                                            tableContent.Append("<td align='center' width='15%'>");
                                            tableContent.Append(categoryUnicList.Count);
                                            tableContent.Append("</td>");
                                        }
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' width='15%'>");
                                        tableContent.Append("");
                                        tableContent.Append("</td>");
                                    }
                                }
                                tableContent.Append("</tr>");
                            }
                        }
                        //tableContent.Append("<td align='left' width='15%'>");

                        //drFilter = ds.Tables[1].AsEnumerable().Where(c => c["Category_Name"].ToString() == dr["Category_Name"].ToString()).ToArray();
                        //if (drFilter.Length > 0)
                        //{
                        //    sum = drFilter.Sum(row => row.Field<int>("Missed_Doctors"));
                        //    tableContent.Append(sum);
                        //    totalCount += sum;

                        //}
                        //tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left' width='15%'>");
                        tableContent.Append("</td>");
                    }
                    tableContent.Append("</tr>");


                }
                tableContent.Append("</tbody></table>");
            }
            else
            {
                tableContent.Append("No data found ");
            }
            return tableContent.ToString();
        }
        public string GetLastsubmittedLeaveReportSub(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string leaveTypeName = collection["ltn"].ToString();
            string LeaveTypeCode = collection["ltc"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastsubmittedLeaveSub(companyCode, userCode, startDate, endDate, LeaveTypeCode, leaveTypeName, regionCode);
        }

    }
}
