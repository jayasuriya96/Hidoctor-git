using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class DCRConsolidatedReportController : Controller
    {

        #region Private Variables
        DataControl.HiDoctor_ReportsFactoryClasses.BL_DCRConsolidated _objBL = new DataControl.HiDoctor_ReportsFactoryClasses.BL_DCRConsolidated();
        #endregion Private Variables
        //
        // GET: /DCRConsolidatedReport/

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]

        public ActionResult DCRConsolidateNG(string companyCode, string userCode, string date1, string date2, string status)
        {
            return View();
        }

        //-------------------- START - DCR CONSOLIDATED TABULAR ----------------------------------
        public string GetDCRConsolidatedTabular(FormCollection collection)
        {
            try
            {
                StringBuilder sbDCR = new StringBuilder();
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();

                #region assigning parameters
                string from = collection["startDate"].ToString();
                string to = collection["endDate"].ToString();
                string dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');
                string otn = collection["option"].ToString();
                string[] option = otn.Split('^');
                string showWAData = collection["showWAData"].ToString();
                string userCode = collection["userCode"].ToString();
                string companyCode = objCur.GetCompanyCode();
                string isExcel = collection["isExcel"].ToString();
                string pageHeader = collection["pageHeader"].ToString();
                #endregion assigning parameters


                // get user info

                #region User Details
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser;
                DataControl.BLUser objUser = new DataControl.BLUser();
                lstUser = objUser.GetSingleUserInfo(companyCode, userCode, "");

                if (lstUser != null && lstUser.Count() > 0)
                {
                    foreach (var user in lstUser)
                    {
                        string dcrStatusToPrint = dcrStatus;
                        dcrStatusToPrint = dcrStatusToPrint.Replace("0", "Unapproved");
                        dcrStatusToPrint = dcrStatusToPrint.Replace("1", "Applied");
                        dcrStatusToPrint = dcrStatusToPrint.Replace("2", "Approved");
                        dcrStatusToPrint = dcrStatusToPrint.Replace("3", "Drafted");


                        string fromDate = from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0];
                        string toDate = to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0];

                        #region Header Details
                        sbDCR.Append("<div class='dvHeader'>");
                        sbDCR.Append("<table style='margin-left:3%'>");
                        sbDCR.Append("<thead>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<th>");
                        sbDCR.Append("DCR Consolidated Report" + " " + "for the period of " + fromDate + " - " + toDate + "");
                        sbDCR.Append("</th>");
                        sbDCR.Append("<th>");
                        sbDCR.Append("<div style='float:left;width:100%'>");
                        sbDCR.Append("<div style='width: 30%;'>");
                        sbDCR.Append("<img style='display: inline;margin-left=35px;' src='Images/Company_Logo/" + objCur.GetSubDomain() + ".jpg'>");
                        sbDCR.Append("</div>");
                        sbDCR.Append("</div>");
                        sbDCR.Append("</th>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("</thead>");
                        sbDCR.Append("</table>");
                        sbDCR.Append("</div>");
                        #endregion Header Details
                        sbDCR.Append("<div class='col-lg-12'><div class='table-responsive col-lg-12'><table class='table' border='1' id='tblUserDetails' cellspacing='0' cellpadding='0'>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td><b>Company Name : </b>" + user.Company_Name + "</td>");
                        sbDCR.Append("<td><b>User Name : </b>" + user.User_Name + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td><b>Employee Name : </b>" + user.Employee_Name + "</td>");
                        sbDCR.Append("<td><b>Region Name : </b>" + user.Region_Name + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td><b>Designation : </b>" + user.User_Type_Name + "</td>");
                        sbDCR.Append("<td ><b>Employee No : </b>" + user.Employee_Number + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td ><b>Division Name : </b>" + ((user.Division_Name == "") ? "N/A" : user.Division_Name) + "</td>");
                        sbDCR.Append("<td ><b>Date of Joining : </b>" + ((user.User_Date_of_joining == "") ? "N/A" : user.User_Date_of_joining) + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td ><b>Reporting Manager Name : </b>" + user.Reporting_Manager_Name + "</td>");
                        sbDCR.Append("<td ><b>Reporting Manager Region : </b>" + user.Reporting_Manager_Region_Name + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td ><b>Mobile No : </b>" + user.User_Mobile_Number + "</td>");
                        sbDCR.Append("<td ><b>Report Name : </b>" + pageHeader + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("<tr>");
                        sbDCR.Append("<td ><b>Period : </b>" + from.Split('-')[2] + '/' + from.Split('-')[1] + '/' + from.Split('-')[0] + " - " + to.Split('-')[2] + '/' + to.Split('-')[1] + '/' + to.Split('-')[0] + "</td>");
                        sbDCR.Append("<td ><b>DCR Status : </b>" + dcrStatusToPrint + "</td>");
                        sbDCR.Append("</tr>");
                        sbDCR.Append("</table></div></div>");
                    }
                }
                #endregion User Details

                #region Bind Tables
                foreach (string a in option)
                {
                    switch (a)
                    {
                        case "D":
                            sbDCR.Append(GetDCRConsTabHeaderDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        case "DR":
                            sbDCR.Append(GetDCRConsTabDoctorDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        case "C":
                            sbDCR.Append(GetDCRConsTabChemistDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        case "S":
                            sbDCR.Append(GetDCRConsTabStockistDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        case "P":
                            sbDCR.Append(GetDCRConsTabProductDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        case "E":
                            sbDCR.Append(GetDCRConsTabExpenseDetails(companyCode, userCode, from, to, dcrStatus));
                            break;
                        default:
                            break;
                    }
                }

                if (showWAData == "Y")
                {
                    sbDCR.Append(GetDCRConsTabWideAngleDetails(companyCode, userCode, from, to));
                }

                #endregion Bind Tables

                sbDCR.Append("<div style='clear:both;'></div>");

                if (isExcel == "Y")
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    CurrentInfo _objCurInfo = new CurrentInfo();
                    string curuserName = _objCurInfo.GetUserName();
                    string subDomin = _objCurInfo.GetSubDomain();
                    string fileName = pageHeader + "_" + subDomin + "_" + curuserName + ".xls";
                    string blobUrl = string.Empty;
                    blobUrl = objAzureBlob.AzureBlobUploadText(sbDCR.ToString(), accKey, fileName, "bulkdatasvc");
                    sbDCR = new StringBuilder();
                    sbDCR.Append("<br /><a href=" + blobUrl + ">Click here to Download</a>");
                }
                return sbDCR.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", collection["userCode"].ToString());
                dicObj.Add("startDate", collection["startDate"].ToString());
                dicObj.Add("endDate", collection["endDate"].ToString());
                dicObj.Add("dcrStatus", collection["dcrStatus"].ToString());
                dicObj.Add("option", collection["option"].ToString());
                dicObj.Add("showWAData", collection["showWAData"].ToString());
                dicObj.Add("pageHeader", collection["pageHeader"].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }

        }

        #region Private Methods
        private string GetDCRConsTabHeaderDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();
            List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel> lstDCRHeader = new List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel>();
            lstDCRHeader = _objBL.GetDCRConsTabHeaderDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> DCR Header</div>");
            if (lstDCRHeader != null && lstDCRHeader.Count > 0 && lstDCRHeader[0].lstHeader != null && lstDCRHeader[0].lstHeader.Count > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped col-lg-12'  border='1' id='tblDCRHeaderDetails' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th rowspan='2'>DCR Date</th>");
                sbTbl.Append("<th rowspan='2'>Entered Date</th>");
                sbTbl.Append("<th rowspan='2'>DCR Type</th>");
                sbTbl.Append("<th rowspan='2'>Status</th>");
                sbTbl.Append("<th rowspan='2'>CP</th>");
                sbTbl.Append("<th rowspan='2'>Category</th>");
                sbTbl.Append("<th rowspan='2'>Work Place</th>");
                sbTbl.Append("<th rowspan='2'>From-To(Distance,Mode)</th>");
                sbTbl.Append("<th rowspan='2'>Start-End time</th>");
                sbTbl.Append("<th colspan='2'>Accompanist 1</th>");
                sbTbl.Append("<th colspan='2'>Accompanist 2</th>");
                sbTbl.Append("<th colspan='2'>Accompanist 3</th>");
                sbTbl.Append("<th colspan='2'>Accompanist 4</th>");
                sbTbl.Append("<th rowspan='2'>DCR Common Remarks</th>");
                sbTbl.Append("<th rowspan='2'>Approve/Unapprove Remarks</th>");
                sbTbl.Append("<th rowspan='2'>Approved By</th>");
                sbTbl.Append("<th rowspan='2'>Approved Date</th>");
                sbTbl.Append("<th rowspan='2'>Reason for Leave</th>");
                sbTbl.Append("</tr>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Name</th>");
                sbTbl.Append("<th>Time</th>");
                sbTbl.Append("<th>Name</th>");
                sbTbl.Append("<th>Time</th>");
                sbTbl.Append("<th>Name</th>");
                sbTbl.Append("<th>Time</th>");
                sbTbl.Append("<th>Name</th>");
                sbTbl.Append("<th>Time</th>");
                sbTbl.Append("</tr></thead>");

                sbTbl.Append("<tbody>");
                foreach (var dcr in lstDCRHeader[0].lstHeader)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + dcr.DCR_Actual_Date + "</td>");
                    sbTbl.Append("<td>" + dcr.Entered_Date + "</td>");

                    // dcr type
                    if (dcr.DCR_Type.ToString() == "Leave" && lstDCRHeader[0].lstLeave != null && lstDCRHeader[0].lstLeave.Count > 0)
                    {
                        var leaveLst = (lstDCRHeader[0].lstLeave == null) ? null : lstDCRHeader[0].lstLeave.Where(x => x.DCR_Code == dcr.DCR_Code).SingleOrDefault();
                        if (leaveLst != null)
                        {
                            sbTbl.Append("<td>" + dcr.DCR_Type + "(" + leaveLst.Leave_Type_Name + ")</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td>" + dcr.DCR_Type + "</td>");
                        }
                    }
                    else if (dcr.DCR_Type.ToString() == "Attendance")
                    {
                        var attenLst = (lstDCRHeader[0].lstAttendance == null) ? null : lstDCRHeader[0].lstAttendance.AsEnumerable().Where(x => x.DCR_Code == dcr.DCR_Code);
                        if (attenLst != null)
                        {
                            string attendanceActivity = string.Empty;
                            foreach (var act in attenLst)
                            {
                                attendanceActivity += act.Activity_Name + ",";
                            }
                            attendanceActivity = attendanceActivity.TrimEnd(',');
                            sbTbl.Append("<td>" + dcr.DCR_Type + "(" + attendanceActivity + ")</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td>" + dcr.DCR_Type + "</td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + dcr.DCR_Type + "</td>");
                    }
                    //

                    sbTbl.Append("<td>" + dcr.DCR_Status + "</td>");

                    if (dcr.DCR_Type.ToString() == "Leave")
                    {
                        for (int u = 0; u < 13; u++)
                        {
                            if (u == 0) { sbTbl.Append("<td class='naColumn'>N/A</td>"); }
                            else { sbTbl.Append("<td class='naColumn'></td>"); }
                        }
                    }
                    else
                    {
                        if (dcr.DCR_Type.ToString() == "Attendance")
                        {
                            sbTbl.Append("<td class='naColumn'>N/A</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td>" + ((string.IsNullOrEmpty(dcr.CP_Name)) ? "" : dcr.CP_Name) + "</td>");
                        }
                        sbTbl.Append("<td>" + dcr.Category + "</td>");
                        sbTbl.Append("<td>" + dcr.Place_Worked + "</td>");


                        // for sfc
                        bool isHQ = false;
                        if (lstDCRHeader[0].lstSFC != null && lstDCRHeader[0].lstSFC.Count > 0)
                        {
                            var sfcLst = lstDCRHeader[0].lstSFC.AsEnumerable().Where(x => x.DCR_Code == dcr.DCR_Code && x.DCR_HOP_Flag == dcr.Flag);
                            if (sfcLst != null && sfcLst.Count() > 0)
                            {
                                sbTbl.Append("<td>");
                                foreach (var sfc in sfcLst)
                                {
                                    if (sfc.Route_Way != "R")
                                    {
                                        sbTbl.Append("" + sfc.From_Place + "-" + sfc.To_Place + "(" + sfc.Distance + "," + sfc.Travel_Mode + ")</br>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("" + sfc.To_Place + "-" + sfc.From_Place + "(" + sfc.Distance + "," + sfc.Travel_Mode + ")</br>");
                                    }
                                }
                                sbTbl.Append("</td>");
                            }
                            else
                            {
                                isHQ = true;
                            }
                        }
                        else
                        {
                            isHQ = true;
                        }
                        if (isHQ)
                        {
                            sbTbl.Append("<td>" + dcr.From_Place + "-" + dcr.To_Place + "(" + dcr.Travelled_Kms + "," + dcr.Travel_Mode + ")</td>");
                        }
                        // end sfc

                        sbTbl.Append("<td>" + ((string.IsNullOrEmpty(dcr.User_Start_Time)) ? "" : dcr.User_Start_Time) + "-" + ((string.IsNullOrEmpty(dcr.User_End_Time)) ? "" : dcr.User_End_Time) + "</td>");

                        //for Attendance
                        if (dcr.DCR_Type.ToString() == "Attendance")
                        {
                            for (int u = 0; u < 8; u++)
                            {
                                if (u == 0) { sbTbl.Append("<td class='naColumn'>N/A</td>"); }
                                else { sbTbl.Append("<td class='naColumn'></td>"); }
                            }
                        }
                        else
                        {
                            string acc1Time = ((string.IsNullOrEmpty(dcr.Accomp_Start_Time)) ? "" : dcr.Accomp_Start_Time.ToString()) + "-" + ((string.IsNullOrEmpty(dcr.Accomp_End_Time)) ? "" : dcr.Accomp_End_Time.ToString());
                            string acc2Time = ((string.IsNullOrEmpty(dcr.Acc2_Start_Time)) ? "" : dcr.Acc2_Start_Time.ToString()) + "-" + ((string.IsNullOrEmpty(dcr.Acc2_End_Time)) ? "" : dcr.Acc2_End_Time.ToString());
                            string acc3Time = ((string.IsNullOrEmpty(dcr.Acc3_Time)) ? "" : dcr.Acc3_Time.ToString());
                            string acc4Time = ((string.IsNullOrEmpty(dcr.Acc4_Time)) ? "" : dcr.Acc4_Time.ToString());
                            sbTbl.Append("<td>" + dcr.Acc1_Name + "</td>");
                            sbTbl.Append("<td>" + acc1Time + "</td>");
                            sbTbl.Append("<td>" + dcr.Acc2_Name + "</td>");
                            sbTbl.Append("<td>" + acc2Time + "</td>");
                            sbTbl.Append("<td>" + dcr.Acc3_Person + "</td>");
                            sbTbl.Append("<td>" + acc3Time + "</td>");
                            sbTbl.Append("<td>" + dcr.Acc4_Person + "</td>");
                            sbTbl.Append("<td>" + acc4Time + "</td>");
                        }
                    }
                    string DcrcommonRemarks = ((string.IsNullOrEmpty(dcr.DCR_General_Remarks)) ? "" : dcr.DCR_General_Remarks.ToString());
                    DcrcommonRemarks = DcrcommonRemarks.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("~", " - ");//.replace(/~/g, ' - ');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("/^/g", "<br />");
                    string unapprovereason = ((string.IsNullOrEmpty(dcr.Unapproval_Reason)) ? "" : dcr.Unapproval_Reason.ToString());
                    unapprovereason = unapprovereason.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                    unapprovereason = unapprovereason.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                    unapprovereason = unapprovereason.Replace("~", " - ");//.replace(/~/g, ' - ');
                    sbTbl.Append("<td>" + DcrcommonRemarks + "</td>");
                    sbTbl.Append("<td>" + unapprovereason + "</td>");
                    sbTbl.Append("<td>" + ((string.IsNullOrEmpty(dcr.Approved_By)) ? "" : dcr.Approved_By) + "</td>");
                    sbTbl.Append("<td>" + ((string.IsNullOrEmpty(dcr.Approved_Date)) ? "" : dcr.Approved_Date) + "</td>");

                    if (dcr.DCR_Type.ToString() == "Leave")
                    {
                        var leaveLst = lstDCRHeader[0].lstLeave.Where(x => x.DCR_Code == dcr.DCR_Code).SingleOrDefault();
                        if (leaveLst != null)
                        {
                            sbTbl.Append("<td>" + ((string.IsNullOrEmpty(leaveLst.Leave_Reason)) ? "" : leaveLst.Leave_Reason) + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td>" + dcr.DCR_Type + "</td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td class='naColumn'>N/A</td>");
                    }
                    sbTbl.Append("</tr>");
                }

                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No DCR details found for this input selection.</div></div>");
            }
            return sbTbl.ToString();
        }

        private string GetDCRConsTabDoctorDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();
            List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel> lstDCRDoctorVisit = new List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel>();
            lstDCRDoctorVisit = _objBL.GetDCRConsTabDoctorVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);

            int missedCount = 0;
            int visitedDotorsCount = 0;
            int totalDoctorVisit = 0;

            if (lstDCRDoctorVisit != null && lstDCRDoctorVisit.Count > 0)
            {
                if (lstDCRDoctorVisit[0].lstMissedDoctors != null)
                {
                    missedCount = lstDCRDoctorVisit[0].lstMissedDoctors.Count;
                }

                if (lstDCRDoctorVisit[0].lstDistinctDoctors != null)
                {
                    visitedDotorsCount = lstDCRDoctorVisit[0].lstDistinctDoctors.Count;
                }

                if (lstDCRDoctorVisit[0].lstDoctorVisitDetails != null)
                {
                    totalDoctorVisit = lstDCRDoctorVisit[0].lstDoctorVisitDetails.Count;
                }

                //Doctor Visit Details
                sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Doctors Visited is " + visitedDotorsCount.ToString() + " and Missed is " + missedCount.ToString() + "</div>");
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'>");
                sbTbl.Append(SpecialityWiseDoctorVisitTableString(lstDCRDoctorVisit[0].lstDoctorVisitDetails, lstDCRDoctorVisit[0].lstDistinctDoctors));
                sbTbl.Append(CategoryWiseDoctorVisitTableString(lstDCRDoctorVisit[0].lstDoctorVisitDetails));
                sbTbl.Append(DoctorSummaryTableString(lstDCRDoctorVisit[0].lstDistinctDoctors, totalDoctorVisit, missedCount));
                sbTbl.Append("</div>");

                // Missed doctor
                sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Non Visited Doctors is " + missedCount.ToString() + "</div>");
                sbTbl.Append(MissedDoctorTableString(lstDCRDoctorVisit[0].lstMissedDoctors));

            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No DCR Doctor Visit details found for this input selection.</div></div>");
            }
            return sbTbl.ToString();
        }

        private string GetDCRConsTabChemistDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();
            List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel> lstChemistVisit = new List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel>();
            lstChemistVisit = _objBL.GetDCRConsTabChemistVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);

            int chemistVisited = 0;
            if (lstChemistVisit != null && lstChemistVisit.Count > 0 && lstChemistVisit[0].lstDistinctChemist != null && lstChemistVisit[0].lstDistinctChemist.Count > 0)
            {
                chemistVisited = lstChemistVisit[0].lstDistinctChemist.Count;
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Chemist Visited is " + chemistVisited.ToString() + "</div>");
            sbTbl.Append("<div class='table-responsive col-lg-12'  style='display:none;'>");
            #region visit detail
            List<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel> lstVisitDate = null;
            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Chemist Visited is " + chemistVisited.ToString() + "</div>");
            if (chemistVisited > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12'  style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRChemistVisit' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Chemist Name</th>");
                sbTbl.Append("<th>POB</th>");
                sbTbl.Append("<th>Count</th>");
                sbTbl.Append("<th>Dates</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");
                foreach (var chem in lstChemistVisit[0].lstDistinctChemist)
                {
                    if (chem.Chemist_Code != "")//rigid
                    {
                        lstVisitDate = lstChemistVisit[0].lstChemistVisitDetails.Where(c => c.Chemist_Code == chem.Chemist_Code).ToList();
                        string visitedDate = "";

                        foreach (var dcrDate in lstVisitDate)
                        {
                            visitedDate += dcrDate.DCR_Actual_Date + ",";
                        }
                        if (visitedDate != "")
                        {
                            visitedDate = visitedDate.TrimEnd(',');
                        }

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + chem.Chemists_Name + "</td>");
                        sbTbl.Append("<td>" + chem.POB_Amount + "</td>");
                        sbTbl.Append("<td>" + chem.Visit_Count + "</td>");
                        sbTbl.Append("<td>" + visitedDate + "</td>");
                        sbTbl.Append("</tr>");
                    }
                    else// flexi
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + chem.Chemists_Name + "</td>");
                        sbTbl.Append("<td>" + chem.POB_Amount + "</td>");
                        sbTbl.Append("<td>" + chem.Visit_Count + "</td>");
                        sbTbl.Append("<td>" + chem.DCR_Actual_Date + "</td>");
                        sbTbl.Append("</tr>");
                    }

                }
                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No Chemist Visit details found for this input selection.</div></div>");
            }
            #endregion visit detail

            #region summary
            int onceVisited = 0, twiceVisited = 0, thriceVisited = 0, moreVisited = 0, totalChenistCall = 0;
            if (chemistVisited != 0)
            {
                onceVisited = lstChemistVisit[0].lstDistinctChemist.Where(x => x.Visit_Count == 1).Count();
                twiceVisited = lstChemistVisit[0].lstDistinctChemist.Where(x => x.Visit_Count == 2).Count();
                thriceVisited = lstChemistVisit[0].lstDistinctChemist.Where(x => x.Visit_Count == 3).Count();
                moreVisited = lstChemistVisit[0].lstDistinctChemist.Where(x => x.Visit_Count > 3).Count();
                totalChenistCall = lstChemistVisit[0].lstChemistVisitDetails.Count;
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> Chemist Visit Summary</div>");
            sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRChemVisitSummary' cellspacing='0' cellpadding='0'>");
            sbTbl.Append("<thead>");
            sbTbl.Append("<tr><th colspan='2'>Chemist Visit Summary</th></tr></thead>");
            sbTbl.Append("<tbody>");
            sbTbl.Append("<tr><td>Once Visited</td><td>" + onceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Twice Visited</td><td>" + twiceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Thrice Visited</td><td>" + thriceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>More Than Thrice Visited</td><td>" + moreVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Total Visited Chemists</td><td>" + chemistVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Total Chemists Calls Made</td><td>" + totalChenistCall.ToString() + "</td></tr>");
            sbTbl.Append("</tbody></table></div>");
            #endregion summary
            sbTbl.Append("</div>");
            return sbTbl.ToString();
        }

        private string GetDCRConsTabStockistDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();
            IEnumerable<MVCModels.HiDoctor_Reports.DCRConsStokistVisitModel> lstStockistVisit;
            lstStockistVisit = _objBL.GetDCRConsTabStockistVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);

            int stockistVisited = 0;
            if (lstStockistVisit != null && lstStockistVisit.Count() > 0)
            {
                stockistVisited = lstStockistVisit.Count();
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Stockist Visited is " + stockistVisited.ToString() + "</div>");
            sbTbl.Append("<div class='table-responsive col-lg-12'  style='display:none;'>");
            #region visit detail
            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> No of Stockist Visited is " + stockistVisited.ToString() + "</div>");
            if (stockistVisited > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRStockistVisit' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Stockist Name</th>");
                sbTbl.Append("<th>POB</th>");
                sbTbl.Append("<th>Collection</th>");
                sbTbl.Append("<th>Remarks</th>");
                sbTbl.Append("<th>Count</th>");
                sbTbl.Append("<th>Dates</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");
                foreach (var stock in lstStockistVisit)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + stock.Stockiest_Name + "</td>");
                    sbTbl.Append("<td>" + stock.POB_Amount + "</td>");
                    sbTbl.Append("<td>" + stock.Collection_Amount + "</td>");
                    sbTbl.Append("<td>" + stock.Remarks_By_User + "</td>");
                    sbTbl.Append("<td>" + stock.Visit_Count + "</td>");
                    sbTbl.Append("<td>" + stock.DCR_Actual_Date + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No Stockist Visit details found for this input selection.</div></div>");
            }
            #endregion visit detail

            #region summary
            int onceVisited = 0, twiceVisited = 0, thriceVisited = 0, moreVisited = 0;
            if (stockistVisited != 0)
            {
                onceVisited = lstStockistVisit.Where(x => x.Visit_Count == 1).Count();
                twiceVisited = lstStockistVisit.Where(x => x.Visit_Count == 2).Count();
                thriceVisited = lstStockistVisit.Where(x => x.Visit_Count == 3).Count();
                moreVisited = lstStockistVisit.Where(x => x.Visit_Count > 3).Count();
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> Stockist Visit Summary</div>");
            sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRStockistVisitSummary' cellspacing='0' cellpadding='0'>");
            sbTbl.Append("<thead>");
            sbTbl.Append("<tr><th colspan='2'>Stockist Visit Summary</th></tr></thead>");
            sbTbl.Append("<tbody>");
            sbTbl.Append("<tr><td>Once Visited</td><td>" + onceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Twice Visited</td><td>" + twiceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Thrice Visited</td><td>" + thriceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>More Than Thrice Visited</td><td>" + moreVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Total Visited Stockists</td><td>" + stockistVisited.ToString() + "</td></tr>");
            sbTbl.Append("</tbody></table></div>");
            #endregion summary
            sbTbl.Append("</div>");
            return sbTbl.ToString();
        }

        private string GetDCRConsTabProductDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();

            List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel> lstProductDetails = new List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel>();
            lstProductDetails = _objBL.GetDCRConsTabProductDetails(companyCode, userCode, fromDate, toDate, dcrStatus);


            #region visit detail
            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> Inputs Given For Rigid Doctors</div>");
            if (lstProductDetails != null && lstProductDetails.Count > 0 &&
                lstProductDetails[0].lstDistinctDoctor != null && lstProductDetails[0].lstDistinctDoctor.Count > 0 &&
                lstProductDetails[0].lstProduct != null && lstProductDetails[0].lstProduct.Count > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Input</th>");
                sbTbl.Append("<th>Quantity</th>");
                sbTbl.Append("<th>Date</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");

                foreach (var doc in lstProductDetails[0].lstDistinctDoctor)
                {
                    var lstProdGiven = lstProductDetails[0].lstProduct.Where(c => c.Doctor_Code == doc.Doctor_Code && c.Doctor_Region_Code == doc.Doctor_Region_Code).ToList();

                    if (lstProdGiven != null && lstProdGiven.Count > 0)
                    {
                        sbTbl.Append("<tr ><th colspan='3' style='background:#5E87B0 !important;color:#fff;text-align:left;'>Doctor Name : " + doc.Doctor_Name + "</th></tr>");
                        foreach (var prod in lstProdGiven)
                        {
                            sbTbl.Append("<tr>");
                            sbTbl.Append("<td>" + prod.Product_Name + "</td>");
                            sbTbl.Append("<td>" + prod.Quantity_Provided + "</td>");
                            sbTbl.Append("<td>" + prod.DCR_Actual_Date + "</td>");
                            sbTbl.Append("</tr>");
                        }
                        sbTbl.Append("<tr><th colspan='3' style='background:#fff !important;'></th></tr>");
                    }
                }
                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No Product details found for this input selection.</div></div>");
            }
            #endregion visit detail
            return sbTbl.ToString();
        }

        private string GetDCRConsTabExpenseDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            StringBuilder sbTbl = new StringBuilder();
            List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel> lstExpense = new List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel>();
            lstExpense = _objBL.GetDCRConsTabExpenseDetails(companyCode, userCode, fromDate, toDate, dcrStatus);

            double totalExpense = 0.0;
            if (lstExpense != null && lstExpense.Count > 0 && lstExpense[0].lstExpenseDetails != null && lstExpense[0].lstExpenseDetails.Count > 0)
            {
                totalExpense = lstExpense[0].lstExpenseDetails.Sum(exp => exp.Expense_Amount);
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> Total expense amount is " + totalExpense.ToString("N2") + " </div>");
            sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'>");
            if (lstExpense != null && lstExpense.Count > 0 && lstExpense[0].lstExpenseDetails != null && lstExpense[0].lstExpenseDetails.Count > 0)
            {
                var lstExpMode = lstExpense[0].lstExpenseDetails.Select(exp => exp.Expense_Mode).Distinct().ToList();
                foreach (var expMode in lstExpMode)
                {
                    var lstModeWiseExpense = lstExpense[0].lstExpenseDetails.Where(e => e.Expense_Mode == expMode);
                    double modeWiseTotalExp = lstModeWiseExpense.Sum(a => a.Expense_Amount);

                    sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse'  style='font-size: 14px;font-weight: bold;'> Total " + expMode + " expense : " + modeWiseTotalExp.ToString("N2") + "</div>");
                    sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRExp" + expMode + "' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th colspan='8'>" + expMode + " Expense</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>DCR Date</th>");
                    sbTbl.Append("<th>DCR Type</th>");
                    sbTbl.Append("<th>DCR Status</th>");
                    sbTbl.Append("<th>Category</th>");
                    sbTbl.Append("<th>Work Place</th>");
                    sbTbl.Append("<th>From-To(Distance,Mode)</th>");
                    sbTbl.Append("<th>Expense Type</th>");
                    sbTbl.Append("<th>Expense Amount</th>");
                    sbTbl.Append("</tr></thead>");
                    sbTbl.Append("<tbody>");

                    foreach (var exp in lstModeWiseExpense)
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + exp.DCR_Actual_Date + "</td>");
                        sbTbl.Append("<td>" + exp.DCR_Type + "</td>");
                        sbTbl.Append("<td>" + exp.DCR_Status + "</td>");
                        sbTbl.Append("<td>" + exp.Category + "</td>");
                        sbTbl.Append("<td>" + exp.Place_Worked + "</td>");
                        // for sfc
                        bool isHQ = false;
                        if (lstExpense[0].lstSFC != null && lstExpense[0].lstSFC.Count > 0)
                        {
                            var sfcLst = lstExpense[0].lstSFC.AsEnumerable().Where(x => x.DCR_Code == exp.DCR_Code && x.DCR_HOP_Flag == exp.DCR_Type);
                            if (sfcLst != null && sfcLst.Count() > 0)
                            {
                                sbTbl.Append("<td>");
                                foreach (var sfc in sfcLst)
                                {
                                    if (sfc.Route_Way != "R")
                                    {
                                        sbTbl.Append("" + sfc.From_Place + "-" + sfc.To_Place + "(" + sfc.Distance + "," + sfc.Travel_Mode + ")</br>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("" + sfc.To_Place + "-" + sfc.From_Place + "(" + sfc.Distance + "," + sfc.Travel_Mode + ")</br>");
                                    }
                                }
                                sbTbl.Append("</td>");
                            }
                            else
                            {
                                isHQ = true;
                            }
                        }
                        else
                        {
                            isHQ = true;
                        }
                        if (isHQ)
                        {
                            sbTbl.Append("<td>" + exp.From_Place + "-" + exp.To_Place + "(" + exp.Travelled_Kms + "," + exp.Travel_Mode + ")</td>");
                        }
                        // end sfc
                        sbTbl.Append("<td>" + exp.Expense_Type_Name + "</td>");
                        sbTbl.Append("<td>" + exp.Expense_Amount + "</td>");
                        sbTbl.Append("</tr>");
                    }

                    sbTbl.Append("</tbody></table></div>");
                }
            }
            else
            {
                sbTbl.Append("<div class='col-lg-12'>No Expense details found for this input selection.</div>");
            }
            sbTbl.Append("</div>");
            return sbTbl.ToString();
        }

        private string GetDCRConsTabWideAngleDetails(string companyCode, string userCode, string fromDate, string toDate)
        {
            StringBuilder sbTbl = new StringBuilder();
            IEnumerable<MVCModels.HiDoctor_Reports.DCRWADetailsModel> lstWA;
            lstWA = _objBL.GetDCRConsTabWADetails(companyCode, userCode, fromDate, toDate);
            int waCount = 0;
            if (lstWA != null && lstWA.Count() > 0)
            {
                waCount = lstWA.Count();
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse'  style='font-size: 14px;font-weight: bold;'> No of Wide Angle DCR's entered is " + waCount.ToString() + "</div>");
            if (waCount > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCRWA' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>DCR Date</th>");
                sbTbl.Append("<th>Activity Name</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");

                foreach (var dcr in lstWA)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + dcr.DCR_Actual_Date + "</td>");
                    sbTbl.Append("<td>" + dcr.Activity_Name + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No Wide Angle DCRs found for this input selection.</div></div>");
            }

            //dcr date activity name
            return sbTbl.ToString();
        }


        private string SpecialityWiseDoctorVisitTableString(List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstVisit, List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistDoc)
        {
            StringBuilder sbTbl = new StringBuilder();
            var id = 0;
            if (lstVisit != null && lstVisit.Count > 0)
            {
                var specialityLst = lstVisit.Select(a => a.Speciality_Name).Distinct().ToList();

                foreach (var speciality in specialityLst)
                {
                    var specialityWiseDocList = lstDistDoc.Where(b => b.Speciality_Name == speciality);

                    sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse'  style='font-size: 14px;font-weight: bold;'> No. of Doctors visited in " + speciality + " is " + specialityWiseDocList.Count().ToString() + "</div>");
                    sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped  col-lg-12'  border='1' id='tblDCR" + speciality + "' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>Doctor Name</th>");
                    sbTbl.Append("<th>MDL/SVL No.</th>");
                    sbTbl.Append("<th>Doctor Category</th>");
                    sbTbl.Append("<th>Speciality</th>");
                    sbTbl.Append("<th>Qualification</th>");
                    //sbTbl.Append("<th>View</th>");
                    sbTbl.Append("<th>Visited Dates</th>");
                    sbTbl.Append("<th>Count</th>");
                    sbTbl.Append("</tr></thead>");
                    sbTbl.Append("<tbody>");

                    foreach (var doc in specialityWiseDocList)
                    {
                        List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDocDetails = null;
                        if (doc.Doctor_Code != "")// for rigid doctor
                        {
                            lstDocDetails = lstVisit.Where(c => c.Doctor_Code == doc.Doctor_Code && c.Doctor_Region_Code == doc.Doctor_Region_Code && c.Speciality_Name == speciality).ToList();
                            string visitedDate = "";
                            foreach (var dcrDate in lstDocDetails)
                            {
                                //if (dcrDate.Acc_Visit_Count > 0)
                                //    visitedDate += "<div style='display:none;' id='divDocAccDetails_" + id + "'>" + dcrDate.DCR_Actual_Date + "$" + dcrDate.DCR_Visit_Code + "$" + dcrDate.MDL + "$" + dcrDate.Doctor_Name + "$" + dcrDate.Category_Name + "</div><a href='#' onclick='fnGetDoctorAccompanist(\"" + id + "\");'>" + dcrDate.DCR_Actual_Date + "</a> ,";

                                //else
                                visitedDate += dcrDate.DCR_Actual_Date + ",";
                                //id++;
                            }
                            if (visitedDate != "")
                            {
                                visitedDate = visitedDate.TrimEnd(',');
                            }

                            sbTbl.Append("<tr>");
                            sbTbl.Append("<td>" + doc.Doctor_Name + "</td>");
                            sbTbl.Append("<td>" + lstDocDetails[0].MDL + "</td>");
                            sbTbl.Append("<td>" + lstDocDetails[0].Category_Name + "</td>");
                            sbTbl.Append("<td>" + speciality + "</td>");
                            sbTbl.Append("<td>" + lstDocDetails[0].Qualification + "</td>");
                            sbTbl.Append("<td>" + visitedDate + "</td>");
                            sbTbl.Append("<td>" + doc.Visit_Count + "</td>");
                            sbTbl.Append("</tr>");
                        }
                        else // for flexi dotor
                        {
                            sbTbl.Append("<tr>");
                            sbTbl.Append("<td>" + doc.Doctor_Name + "</td>");
                            sbTbl.Append("<td>N/A</td>");
                            sbTbl.Append("<td>N/A</td>");
                            sbTbl.Append("<td>" + speciality + "</td>");
                            sbTbl.Append("<td>N/A</td>");
                            sbTbl.Append("<td>" + doc.DCR_Actual_Date + "</td>");
                            sbTbl.Append("<td>" + doc.Visit_Count + "</td>");
                            sbTbl.Append("</tr>");
                        }
                    }
                    sbTbl.Append("</tbody></table></div>");
                }
            }
            else
            {
                sbTbl.Append("<div class='col-lg-12'>No DCR Doctor Visit details found for this input selection.</div>");
            }

            return sbTbl.ToString();
        }

        private string CategoryWiseDoctorVisitTableString(List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstVisit)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (lstVisit != null && lstVisit.Count > 0)
            {
                var categoryLst = lstVisit.Select(a => a.Category_Name).Distinct().ToList();

                sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse'  style='font-size: 14px;font-weight: bold;'> Category Wise Doctor Visit</div>");
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped col-lg-12'  border='1' id='tblDCRCategoryWiseVisit' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Doctor Category</th>");
                sbTbl.Append("<th>Count</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");
                foreach (var category in categoryLst)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + ((category == "") ? "No Category" : category) + "</td>");
                    sbTbl.Append("<td>" + lstVisit.Where(a => a.Category_Name == category).Count().ToString() + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table></div>");

            }
            return sbTbl.ToString();
        }

        private string DoctorSummaryTableString(List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistDoc, int totalDoctorVisit, int missedDoctors)
        {
            StringBuilder sbTbl = new StringBuilder();
            int onceVisited = 0, twiceVisited = 0, thriceVisited = 0, moreVisited = 0, visitedDoctorsCount = 0;
            if (lstDistDoc != null)
            {
                visitedDoctorsCount = lstDistDoc.Count;
                onceVisited = lstDistDoc.Where(x => x.Visit_Count == 1).Count();
                twiceVisited = lstDistDoc.Where(x => x.Visit_Count == 2).Count();
                thriceVisited = lstDistDoc.Where(x => x.Visit_Count == 3).Count();
                moreVisited = lstDistDoc.Where(x => x.Visit_Count > 3).Count();
            }

            sbTbl.Append("<div class='col-lg-12 dcrConsTabHeader dcrconscollapse' style='font-size: 14px;font-weight: bold;'> Doctor Visit Summary</div>");
            sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped col-lg-12'  border='1' id='tblDCRDocVisitSummary' cellspacing='0' cellpadding='0'>");
            sbTbl.Append("<thead>");
            sbTbl.Append("<tr><th colspan='2'>Doctor Visit Summary</th></tr></thead>");
            sbTbl.Append("<tbody>");
            sbTbl.Append("<tr><td>Total Visited Doctors</td><td>" + visitedDoctorsCount.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Total Non Visited Doctors</td><td>" + missedDoctors.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Once Visited</td><td>" + onceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Twice Visited</td><td>" + twiceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Thrice Visited</td><td>" + thriceVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>More Than Thrice Visited</td><td>" + moreVisited.ToString() + "</td></tr>");
            sbTbl.Append("<tr><td>Doctor Calls Made</td><td>" + totalDoctorVisit.ToString() + "</td></tr>");
            sbTbl.Append("</tbody></table></div>");

            return sbTbl.ToString();
        }

        private string MissedDoctorTableString(List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstMissed)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (lstMissed != null && lstMissed.Count > 0)
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><table class='table table-striped col-lg-12'  border='1' id='tblDCRDocMissed' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Doctor Name</th>");
                sbTbl.Append("<th>MDL/SVL No.</th>");
                sbTbl.Append("<th>Doctor Category</th>");
                sbTbl.Append("<th>Speciality</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");
                foreach (var doc in lstMissed)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + doc.Doctor_Name + "</td>");
                    sbTbl.Append("<td>" + doc.MDL + "</td>");
                    sbTbl.Append("<td>" + doc.Category_Name + "</td>");
                    sbTbl.Append("<td>" + doc.Speciality_Name + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table></div>");
            }
            else
            {
                sbTbl.Append("<div class='table-responsive col-lg-12' style='display:none;'><div class='col-lg-12'>No Missed Doctor details found for this input selection.</div></div>");
            }
            return sbTbl.ToString();
        }
        #endregion Private Methods
        //-------------------- END - DCR CONSOLIDATED TABULAR ----------------------------------
    }
}
