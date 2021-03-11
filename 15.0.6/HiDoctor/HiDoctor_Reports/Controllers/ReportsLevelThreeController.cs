#region Usings
using DataControl;
using DataControl.HiDoctor_ReportsFactoryClasses;
using MVCModels;
using MVCModels.HiDoctor_Reports;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Text.RegularExpressions;
using System.IO;
using System.Data;
using System.Web.SessionState;
using System.Globalization;
using System.Web.Configuration;
using Newtonsoft.Json;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
#endregion Usings

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class ReportsLevelThreeController : Controller
    {
        #region Private Variables
        private CurrentInfo _objCurrentInfo = null;
        private BL_DoctorChemistMetTabular _objDocChemTabular = null;
        private BL_ReportRegion _objBL_ReportRegion = null;
        private ActivityCountController objActivity = new ActivityCountController();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables
        //
        // GET: /ReportsLevelThree/

        #region Private Methods
        private StringBuilder GetCPStatusTableFormat(string selected_Region_Code, string level1_RegionType, string level2_RegionType, string status, string viewType, CPStatusReport objCPStatusEntity)
        {
            StringBuilder strTableBuilder = new StringBuilder();
            if (objCPStatusEntity != null && objCPStatusEntity.lstUserDetail != null && objCPStatusEntity.lstUserDetail.Count > 0)
            {
                string className = "";
                strTableBuilder.Append("<table  class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
                strTableBuilder.Append("<th style='text-align:left'> Employee Name </th>");
                strTableBuilder.Append("<th style='text-align:left'> Employee Number </th>");
                strTableBuilder.Append("<th style='text-align:left'> Region Name </th>");
                strTableBuilder.Append("<th style='text-align:left'> User Name </th>");
                strTableBuilder.Append("<th style='text-align:left'> Mobile </th>");
                strTableBuilder.Append("<th style='text-align:left'> Manager Employee Name </th>");
                strTableBuilder.Append("<th style='text-align:left'> Manager User Name </th>");
                if (status.Contains("2"))
                {
                    strTableBuilder.Append("<th> Applied </th>");
                }
                if (status.Contains("1"))
                {
                    strTableBuilder.Append("<th> Approved </th>");
                }
                if (status.Contains("0"))
                {
                    strTableBuilder.Append("<th> Unapproved </th>");
                }
                strTableBuilder.Append("</tr></thead><tbody>");
                foreach (UserDetailModel userEntity in objCPStatusEntity.lstUserDetail)
                {
                    className = userEntity.Region_Type_Code == level1_RegionType ? "highlight" : "";
                    strTableBuilder.Append("<tr class=" + className + "><td title='Employee Name' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Employee_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='Employee Number' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Employee_Number);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='Region Name' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Region_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='User Name' class=" + className + ">");
                    strTableBuilder.Append(userEntity.User_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='Mobile' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Mobile.Trim().Length == 0 ? "-" : userEntity.Mobile);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='Manager Name' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Manager_Name);
                    strTableBuilder.Append("</td>");
                    strTableBuilder.Append("<td title='Manager User Name' class=" + className + ">");
                    strTableBuilder.Append(userEntity.Manager_Name);
                    strTableBuilder.Append("</td>");
                    if (status.Contains("2"))
                    {
                        strTableBuilder.Append("<td title='Applied' class=" + className + ">");
                        strTableBuilder.Append(objCPStatusEntity.lstCPMasterDetail.Where(CP => CP.Region_Code == userEntity.Region_Code && CP.Status == "Applied").ToList().Count.ToString());
                        strTableBuilder.Append("</td>");
                    }
                    if (status.Contains("1"))
                    {
                        strTableBuilder.Append("<td title='Approved' class=" + className + ">");
                        strTableBuilder.Append(objCPStatusEntity.lstCPMasterDetail.Where(CP => CP.Region_Code == userEntity.Region_Code && CP.Status == "Approved").ToList().Count.ToString());
                        strTableBuilder.Append("</td>");
                    }
                    if (status.Contains("0"))
                    {
                        strTableBuilder.Append("<td title='Unapproved' class=" + className + ">");
                        strTableBuilder.Append(objCPStatusEntity.lstCPMasterDetail.Where(CP => CP.Region_Code == userEntity.Region_Code && CP.Status == "Unapproved").ToList().Count.ToString());
                        strTableBuilder.Append("</td>");
                    }
                }
                strTableBuilder.Append("</tbody>");
            }
            else
            {
                strTableBuilder.Append("No Records Found.");
            }
            return strTableBuilder;
        }

        private StringBuilder GetDoctorChemistHTMLTableFormat(List<DoctorChemistMetReportModel> lstDoctorChemistTabular, string start_date, string end_date)
        {
            StringBuilder strTableBuilder = new StringBuilder();
            foreach (DoctorChemistMetReportModel doctorChemistMet in lstDoctorChemistTabular)
            {
                if (doctorChemistMet.lstUserDetail.Count > 0)
                {
                    UserDetailModel userDetailModel = doctorChemistMet.lstUserDetail[0];
                    strTableBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px;width: 110%' cellpadding='0'>");
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


                    strTableBuilder.Append("<table class='table table-striped' cellspacing='0' style='border:1px solid #aaa;font-size:11px;width: 110%;' cellpadding='0'><thead>");
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
                                strTableBuilder.Append("<table class='table table-striped' title='OWN MDL Visited' style='font-size:11px;border:1px solid #aaa;overflow:scroll' cellspacing='0' cellpadding='0'><thead><tr>");
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


        private StringBuilder GetDeviationCPHTMLFormat(IEnumerable<DeviationCPReportModel> IDeviationCPReport)
        {
            StringBuilder strBuilder = new StringBuilder();
            if (IDeviationCPReport.ToList().Count > 0)
            {
                strBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
                strBuilder.Append("<th style='text-align:left'>Accompanist Name</th>");
                strBuilder.Append("<th style='text-align:left'>Doctor Name</th>");
                strBuilder.Append("<th style='text-align:left'>CP Name</th>");
                strBuilder.Append("<th style='text-align:left'>Is CP Doctor?</th>");
                strBuilder.Append("<th style='text-align:left'>DCR Date</th>");
                strBuilder.Append("<th style='text-align:left'>Visit Time(AM/PM does not signify Actual_Time in any way)</th>");
                strBuilder.Append("</tr></thead><tbody>");

                string is_CP_Doc_Class = string.Empty;
                foreach (DeviationCPReportModel deviationCP in IDeviationCPReport)
                {
                    if (deviationCP.Is_CP_Doc == "1")
                    {
                        strBuilder.Append("<tr style='font-weight:bold'>");
                    }
                    else
                    {
                        strBuilder.Append("<tr>");
                    }
                    //Accompanist Name
                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.Acc1_Name);
                    strBuilder.Append("</td>");
                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.Doctor_Name);
                    strBuilder.Append("</td>");
                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.CP_Name);
                    strBuilder.Append("</td>");

                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.Is_CP_Doc == "1" ? "Yes" : "No");
                    strBuilder.Append("</td>");

                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.DCR_Date);
                    strBuilder.Append("</td>");

                    strBuilder.Append("<td>");
                    strBuilder.Append(deviationCP.Visit_Mode);
                    strBuilder.Append("</td>");
                    strBuilder.Append("</tr>");
                }
                strBuilder.Append("</tbody></table>");
            }
            else
            {
                strBuilder.Append("<span>No Records Found.</span>");
            }
            return strBuilder;
        }
        #endregion Private Methods

        #region Public Methods
        public enum DaysInName { Sunday = 1, Monday = 2, Tuesday = 3, Wednesday = 4, Thursday = 5, Friday = 6, Saturday = 7 }
        public string GetProductWiseDoctorFormat(string userCode, string startDate, string endDate, string productSelection, string dcrStatus, string quanity, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetProductWiseDoctor(userCode, startDate, endDate, productSelection, dcrStatus, quanity, viewFormat);
                }
                else
                {
                    string DCREmpLeaveTable = GetProductWiseDoctor(userCode, startDate, endDate, productSelection, dcrStatus, quanity, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "Product wise Doctor report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCREmpLeaveTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:ProductSelection", productSelection);
                dicContext.Add("Filter:DcrStatus", dcrStatus);
                dicContext.Add("Filter:Quanity", quanity);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public StringBuilder GetProductWiseDoctor(string userCode, string startDate, string endDate, string productSelection, string dcrStatus, string quanity, string viewFormat)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            string blobUrl = string.Empty;
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<MVCModels.HiDoctor_Reports.ProductWiseDoctor> lstReportDetail = new List<MVCModels.HiDoctor_Reports.ProductWiseDoctor>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                StringBuilder sbTableContent = new StringBuilder();
               lstReportDetail = (List<MVCModels.HiDoctor_Reports.ProductWiseDoctor>)_objReport.GetProductWiseDoctorDetails(companyCode, userCode, startDate, endDate, productSelection, dcrStatus, quanity);
                if (lstReportDetail != null && lstReportDetail.Count > 0)
                {

                    string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                    string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];

                    if (productSelection == "1")
                    {
                        sbTableContent.Append("<div id='DroWisepro''>");
                        sbTableContent.Append("<div class='dvHeader' id='spnDroWisepro'>");
                        sbTableContent.Append("<div class='dvheader-inner'>Doctor Wise Product Report for the Period of " + st + " " + "to" + " " + ed + "</div>");
                        if (viewFormat == "1")
                        {
                            sbTableContent.Append("<div class='helpIconRpt'>");
                            sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DOCTORWISEPRODUCT','HEADER')\" />");
                            sbTableContent.Append("</div>");
                        }
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
                        if (viewFormat == "1")
                        {
                            sbTableContent.Append("<div class='helpIconRpt'>");
                            sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('PRODUCTWISEDOCTOR','HEADER')\" />");
                            sbTableContent.Append("</div>");
                        }
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

                return sbTableContent;

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        //TpStatusReport New///////////
        public JsonResult GetUserType()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            RequestModel objDroUserType = new RequestModel();
            objDroUserType.Company_Code = _objcurrentInfo.GetCompanyCode();
            objDroUserType.User_Code = _objcurrentInfo.GetUserCode();
            try
            {
                IEnumerable<RequestModel> lstUsertype = _objBlmaster.GetUnderUserType(objDroUserType);
                var userTypelist = (from userType in lstUsertype.AsEnumerable()
                                    select new RequestModel()
                                    {
                                        User_Type_Code = userType.User_Type_Code.ToString(),
                                        User_Type_Name = userType.User_Type_Name.ToString()
                                    }).ToList<RequestModel>();
                return Json(userTypelist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", objDroUserType.Company_Code);
                dicContext.Add("Filter:userCode", objDroUserType.User_Code);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }


        public string GetNewTpReportFormat(string userCode, string startDate, string endDate, string userTypeLevel1, string userTypeLevel2, string tpStatus, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetNewTpReport(userCode, startDate, endDate, userTypeLevel1, userTypeLevel2, tpStatus, viewFormat);
                }
                else
                {
                    string TpTable = GetNewTpReport(userCode, startDate, endDate, userTypeLevel1, userTypeLevel2, tpStatus, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "TpstatusReport" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(TpTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }



        public StringBuilder GetNewTpReport(string userCode, string startDate, string endDate, string userTypeLevel1, string userTypeLevel2, string tpStatus, string viewFormat)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {

                ArrayList leveloneUser = new ArrayList();

                StringBuilder sbTableContent = new StringBuilder();
                string userCodes = "";



                List<MVCModels.HiDoctor_Reports.TPStatusReport> lstchildusers = new List<MVCModels.HiDoctor_Reports.TPStatusReport>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                lstchildusers = (List<MVCModels.HiDoctor_Reports.TPStatusReport>)_objReport.GetchildUsers(companyCode, userCode);

                foreach (var item in lstchildusers)
                {
                    if (item.User_Type_Code == userTypeLevel1)
                    {
                        leveloneUser.Add(item);
                        userCodes += item.User_Code + ",";
                        List<MVCModels.HiDoctor_Reports.TPStatusReport> leveltwoUser = new List<MVCModels.HiDoctor_Reports.TPStatusReport>();
                        leveltwoUser = (List<MVCModels.HiDoctor_Reports.TPStatusReport>)_objReport.GetchildUsers(companyCode, item.User_Code);

                        foreach (var users in leveltwoUser)
                        {
                            if (users.User_Type_Code == userTypeLevel2)
                            {
                                userCodes += users.User_Code + ",";
                            }

                        }
                    }
                }
                List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel> lstTpDetail = new List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel>();
                lstTpDetail = (List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel>)_objReport.GetTpDetail(companyCode, userCodes, tpStatus, startDate, endDate);
                string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                List<EmployeeDetail> lstEmployeedetail = lstTpDetail[0].lstEmployeeDetail;
                List<TPStatusReport> lstTpstatusdetail = lstTpDetail[0].lstTpstatusDetail;
                string[] statusArr;
                statusArr = tpStatus.ToString().Trim().Split('^');
                if (lstTpDetail != null && lstTpDetail.Count > 0)
                {
                    sbTableContent.Append("<div id='TPstatusreport''>");
                    sbTableContent.Append("<div class='dvHeader' id='spnTPstatusreport'>");
                    sbTableContent.Append("<div class='dvheader-inner'>Tp Compliance and Status Report for the Period of " + st + " " + "to" + " " + ed + "</div>");
                    if (viewFormat == "1")
                    {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('TP_STATUSREPORT','HEADER')\" />");
                        sbTableContent.Append("</div>");
                    }
                    sbTableContent.Append("</div>");


                    sbTableContent.Append("<table id='tblstatusreport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Employee Name</td>");
                    sbTableContent.Append("<td>User Name</td>");
                    sbTableContent.Append("<td>Region Name</td>");
                    sbTableContent.Append("<td>Manager Employee Name</td>");
                    sbTableContent.Append("<td>Manager User Name</td>");

                    foreach (var tpStatusList in statusArr)
                    {
                        if (tpStatusList == "1")
                        {
                            sbTableContent.Append("<td>APPROVED</td>");
                        }
                        else if (tpStatusList == "2")
                        {
                            sbTableContent.Append("<td>APPLIED</td>");
                        }
                        else if (tpStatusList == "0")
                        {
                            sbTableContent.Append("<td>UNAPPROVED</td>");
                        }
                        else if (tpStatusList == "1^2^0^")
                        {
                            sbTableContent.Append("<td>APPROVED</td>");
                            sbTableContent.Append("<td>APPLIED</td>");
                            sbTableContent.Append("<td>UNAPPROVED</td>");
                        }
                    }
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    sbTableContent.Append("<tr>");
                    foreach (var User in lstchildusers)
                    {

                        List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstTpEmployeeDetail = lstEmployeedetail.Where(TP => TP.User_Code == User.User_Code).ToList();
                        if (lstTpEmployeeDetail.Count > 0)
                        {
                            // Employee name
                            sbTableContent.Append("<td valign='top'align='left'>" + lstTpEmployeeDetail[0].Employee_Name + "</td>");
                            // bind user name
                            sbTableContent.Append("<td valign='top'align='left'>" + lstTpEmployeeDetail[0].User_Name + "</td>");
                            // bind region name
                            sbTableContent.Append("<td valign='top'align='left'>" + lstTpEmployeeDetail[0].Region_Name + "</td>");
                            //Manager employee name
                            sbTableContent.Append("<td valign='top'align='left'>" + lstTpEmployeeDetail[0].Manager_Name + "</td>");
                            // bind reporting manager name
                            sbTableContent.Append("<td valign='top'align='left'>" + lstTpEmployeeDetail[0].Reports_User_Name + "</td>");
                            foreach (var tpStatusList in statusArr)
                            {

                                if (tpStatusList == "1")
                                {
                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTp = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "1").ToList();
                                    if (lstTp.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTp[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }
                                }
                                else if (tpStatusList == "2")
                                {
                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTpApproved = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "2").ToList();
                                    if (lstTpApproved.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTpApproved[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }
                                }
                                else if (tpStatusList == "0")
                                {
                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTpUnApp = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "0").ToList();
                                    if (lstTpUnApp.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTpUnApp[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }
                                }
                                else if (tpStatusList == "1^2^0^")
                                {
                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTp = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "1").ToList();
                                    if (lstTp.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTp[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }

                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTpApproved = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "2").ToList();
                                    if (lstTpApproved.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTpApproved[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }

                                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTpUnApp = lstTpstatusdetail.Where(TP => TP.User_Code == User.User_Code && TP.Status == "0").ToList();
                                    if (lstTpUnApp.Count > 0)
                                    {
                                        sbTableContent.Append("<td valign='top'>" + lstTpUnApp[0].Count + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td valign='top'>0</td>");
                                    }
                                }
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }

                    sbTableContent.Append("</tbody>");
                    sbTableContent.Append("</table>");


                }
                return sbTableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:userCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:TpStatus", tpStatus);
                dicContext.Add("Filter:UserTypeLevel1", userTypeLevel1);
                dicContext.Add("Filter:UserTypeLevel2", userTypeLevel2);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }


        //------------------------START-SFC REPORT------------------------------//

        /// <summary>
        /// This method is used to Get the SFCReport Details
        /// </summary>
        /// <returns></returns>
        public string GetSFCReportDetails(string regioncode, string viewFormat, string title, string Status, string TravelMode, string SFCValidity)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string sessionRegionCode = _objCurrentInfo.GetRegionCode();
                string selectionType = string.Empty;
                if (regioncode == "ALL")
                {
                    regioncode = _objCurrentInfo.GetRegionCode();
                    selectionType = "ALL";
                }
                List<MVCModels.HiDoctor_Reports.SFCReport> lstsfcReport = new List<MVCModels.HiDoctor_Reports.SFCReport>();
                lstsfcReport = _objRR.GetSFCReportDetails(companyCode, regioncode, selectionType, Status, TravelMode, SFCValidity).ToList();
                if (viewFormat.ToUpper() == "S")
                {
                    strTb = GetSFCReport(lstsfcReport, title);
                }
                else
                {
                    string lastSubmittedTable = GetSFCReport(lstsfcReport, title).ToString();
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost;
                    string fileName = "SFC_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");
                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regioncode", regioncode);
                dicContext.Add("viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        /// <summary>
        /// Method is used TO find the SFC Details with HTML Table
        /// </summary>
        /// <param name="lstSfcReport"></param>
        /// <returns></returns>
        public StringBuilder GetSFCReport(List<SFCReport> lstSfcReport, string title)
        {
            StringBuilder strTb = new StringBuilder();
            BLUser _objUser = new BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            var disnictRegionCodes = lstSfcReport.Select(x => x.Region_Code).Distinct().ToList();
            try
            {
                if (lstSfcReport != null && lstSfcReport.Count() > 0)
                {
                    strTb.Append("<div style='margin-left: 7px;background: #fafafa !important;'>");
                    strTb.Append("<div><lable><span style='font-weight:bold;'>Validity of SFC Route: </lable></div>");
                    strTb.Append("<div><lable>1.<span style='font-weight:bold;'>Current:</span> is active (Within Date Range) SFC route </lable></div>");
                    strTb.Append("<div><lable>2.<span style='font-weight:bold;'>Expired:</span> is the old (Expired Date Range) SFC route.</lable></div>");
                    strTb.Append("<div><lable>3.<span style='font-weight:bold;'>Future:</span> is the new SFC's which has been added into system in advance.</lable></div>");
                    strTb.Append("</div>");
                    strTb.Append("</br>");
                    foreach (var Sfcrpt in disnictRegionCodes)
                    {

                        strTb.Append("<table class='table table-striped'><thead class='active'><tr><th>Region Name</th>");
                        strTb.Append("<th>Employee Name</th><th>User Name</th><th>Category</th>");
                        strTb.Append("<th>From Place</th><th> To Place</th><th>Travel Mode </th><th>Distance</th><th>Fare</th>");
                        strTb.Append("<th>From Date</th><th>To Date</th>");
                        strTb.Append("<th>Status</th><th>SFC Validity</th><th>SFC Visit Count</th></tr></thead><tbody>");

                        var filtered = lstSfcReport.Where(p => p.Region_Code == Sfcrpt.ToString()).ToList();
                        int i = 0;
                        foreach (var filtervalues in filtered)
                        {
                            i++;
                            strTb.Append("<tr><td id='Region_Name" + i + "'>" + filtervalues.Region_Name + "</td>");
                            if (string.IsNullOrEmpty(filtervalues.Region_Code))
                            {
                                strTb.Append("<td id='Employee_Name" + i + "'>" + "(Vacant Region)" + "</td>");
                                strTb.Append("<td id='User_Name" + i + "'>" + "(Vacant Region)" + "</td>");
                            }
                            else
                            {
                                strTb.Append("<td id='Employee_Name" + i + "'>" + filtervalues.Employee_Name + "</td>");
                                strTb.Append("<td id='User_Name" + i + "'>" + filtervalues.User_Name + "</td>");
                            }
                            strTb.Append("<td id='Category_Name" + i + "'>" + filtervalues.Category_Name + "</td>");
                            strTb.Append("<td id='From_Region_Name" + i + "'>" + filtervalues.From_Region_Name + "</td>");
                            strTb.Append("<td id='To_Region_Name" + i + "'>" + filtervalues.To_Region_Name + "</td>");
                            strTb.Append("<td id='Travel_Mode" + i + "'>" + filtervalues.Travel_Mode + "</td>");
                            strTb.Append("<td id='Distance" + i + "'>" + filtervalues.Distance + "</td>");
                            strTb.Append("<td id='Fare_Amount" + i + "'>" + filtervalues.Fare_Amount + "</td>");
                            strTb.Append("<td id='Date_From" + i + "'>" + filtervalues.Date_From + "</td>");
                            strTb.Append("<td id='Date_To" + i + "'>" + filtervalues.Date_To + "</td>");
                            strTb.Append("<td id='Status" + i + "'>" + filtervalues.Status + "</td>");
                            strTb.Append("<td>" + filtervalues.SFC_Date_Validation + "</td>");
                            strTb.Append("<td>" + (filtervalues.SFC_Visit_Count == null ? "0" : filtervalues.SFC_Visit_Count) + "</td></tr>"); // Newly Added at 23/05/2017
                        }
                    }

                    strTb.Append("</tbody>");
                    strTb.Append("</table>");
                }

                else
                {
                    strTb.Append("No Records To Display");
                }

                return strTb;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        //------------------------END-SFC REPORT------------------------------//

        //------------------------START-ACTIVITYFREQUENCYSUMMARY REPORT------------------------------//
        /// <summary>
        /// This Method is Used To DownLoad the Excel Report
        /// </summary>
        /// <returns></returns>
        public string GetActivityFrequencySummaryDetails(string userCodes, string startDate, string endDate, string viewFormat, string title)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string[] userCodeArr = userCodes.Split('^');
                List<MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel> lstActivityfrequencySummary = _objRR.GetActivityFrequencySummary(companyCode, userCodes, startDate, endDate).ToList();
                if (viewFormat == "S")
                {
                    strTb = GetActivityFrequencySummary(lstActivityfrequencySummary, userCodes, startDate, endDate, viewFormat, title);
                }
                else
                {
                    string lastActivityFrequencyTable = GetActivityFrequencySummary(lstActivityfrequencySummary, userCodes, startDate, endDate, viewFormat, title).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Activity_Frequency_Summary_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastActivityFrequencyTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCodes", userCodes);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetActivityFrequencySummary(List<ActivityFrequenceSummaryModel> lstActivityfrequencySummary, string userCodes, string startDate, string endDate, string viewFormat, string title)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string status = string.Empty;
            StringBuilder strTableRept = new StringBuilder();
            DateTime dtTemp;
            ArrayList monthStartDate = new ArrayList();
            ArrayList monthList = new ArrayList();
            int intTotalDays = 0;
            double intAverageDays = 0;
            int intWorkingDays = 0;
            int appliedCount = 0;
            int approvedCount = 0;
            int unapprovedCount = 0;
            string[] userArr = userCodes.Split('^');

            try
            {
                DateTime dtStartDate = Convert.ToDateTime(startDate);
                DateTime dtEndDate = Convert.ToDateTime(endDate);
                TimeSpan tsDateDiff = dtEndDate - dtStartDate;
                DateTime dtDCRDate = dtStartDate;

                for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
                {
                    if (!monthList.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                    {
                        monthList.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());
                        monthStartDate.Add(dtTemp.ToString("yyyy-MM-dd"));
                    }
                }

                intTotalDays = tsDateDiff.Days;

                if (lstActivityfrequencySummary[0].lstEmployee != null && lstActivityfrequencySummary[0].lstEmployee.Count() > 0)
                {
                    string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                    string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                    strTableRept.Append("<div id='Activity Frequency Summary'>");
                    strTableRept.Append("<div class='dvHeader' id='spnactivitysummary'>");
                    strTableRept.Append("<div class='dvheader-inner'>" + title + " For the Period of " + st + " " + "to" + " " + ed + "</div>");
                    if (viewFormat == "S")
                    {
                        strTableRept.Append("<div class='helpIconRpt'>");
                        strTableRept.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('ACTIVITY_FREQUENCY_SUMMARY','HEADER')\" />");
                        strTableRept.Append("</div>");
                    }
                    strTableRept.Append("</div>");
                    strTableRept.Append("<br/>");
                    strTableRept.Append("<table id='tblActivityFrequencySummary' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead class='active'><tr><td align='center' valign='top' rowspan='2'>User Name</td>");
                    strTableRept.Append("<td align='center' valign='top' rowspan='2'>Employee Name</td><td align='center' valign='top' rowspan='2'>Territory</td><td align='center' valign='top' rowspan='2'>Last Activity Date</td>");
                    strTableRept.Append("<td align='center' valign='top' rowspan='2'>Last Entered Date</td><td align='center' valign='top' rowspan='2'>Mode of Last Entry</td>");
                    strTableRept.Append("<td align='center' valign='top' rowspan='2'>Status of Last Activity</td><td align='center' valign='top' rowspan='2'>Report Frequency</td>");
                    for (int j = 0; j < monthList.Count; j++)
                    {
                        strTableRept.Append("<td align='center' valign='top' colspan='2'>Tour Plan " + monthList[j].ToString().Split('_')[0] + '-' + monthList[j].ToString().Split('_')[2] + " </td>");
                    }
                    strTableRept.Append("<tr>");
                    for (int j = 0; j < monthList.Count; j++)
                    {
                        strTableRept.Append("<td align='center' valign='top'>Entered On</td><td align='center' valign='top'>Approved Status</td>");
                    }
                    strTableRept.Append("</tr>");
                    strTableRept.Append("</thead><tbody>");
                    foreach (var userCode in userArr)
                    {
                        if (!string.IsNullOrEmpty(userCode))
                        {
                            List<MVCModels.HiDoctor_Master.UserModel> filterEmployeedetails = lstActivityfrequencySummary[0].lstEmployee.Where(p => p.User_Code == userCode).ToList();

                            strTableRept.Append("<tr>");
                            strTableRept.Append("<td align='left' valign='top'> " + filterEmployeedetails[0].User_Name + " </td>"); //Bind UserName
                            strTableRept.Append("<td align='left' valign='top'> " + filterEmployeedetails[0].Employee_Name + " </td>");//Bind EmployeeName
                            strTableRept.Append("<td align='left' valign='top'> " + filterEmployeedetails[0].Region_Name + " </td>");//Bind Territory

                            var filteredUsercodeinDCRMaxActualdate = lstActivityfrequencySummary[0].lstDcrMaxActualdate.Where(s => s.User_Code == filterEmployeedetails[0].User_Code).ToList();

                            var filteredUsercodeinTpEntered = lstActivityfrequencySummary[0].lstTpEntereddetails.Where(p => p.User_Code == filterEmployeedetails[0].User_Code).ToList();


                            if (filteredUsercodeinDCRMaxActualdate.Count() > 0 && filteredUsercodeinTpEntered.Count() > 0)  //DCR & TP Both are Entered Btw these Dates.
                            {
                                var filterDcrMaxActualDateDetails = lstActivityfrequencySummary[0].lstDcrMaxActualdate.Where(p => p.User_Code == filterEmployeedetails[0].User_Code).ToList();

                                var filterDCRDetails = lstActivityfrequencySummary[0].lstDcrdetails.Where(p => p.DCR_Actual_Date == filterDcrMaxActualDateDetails[0].DCR_Actual_Date && p.User_Code == filterDcrMaxActualDateDetails[0].User_Code && p.Status != "TimeSheet").ToList();

                                if (filterDcrMaxActualDateDetails.Count > 0 && filterDcrMaxActualDateDetails != null)
                                {
                                    if (filterDCRDetails.Count() > 0 && filterDcrMaxActualDateDetails.Count() > 0)
                                    {
                                        var filtermaxDcrEnteredDate = filterDCRDetails.Where(x => x.Entered_Datetime == filterDCRDetails.Max(y => y.Entered_Datetime)).ToList();
                                        //Last Activity date
                                        strTableRept.Append("<td align='left' valign='top'> ");
                                        strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Actual_Date);
                                        strTableRept.Append("</td>");
                                        //Last Entered date
                                        strTableRept.Append("<td align='left' valign='top'> ");
                                        strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Entered_Date);
                                        strTableRept.Append("</td>");
                                        //MOde of last entry
                                        strTableRept.Append("<td align='left' valign='top'> ");
                                        strTableRept.Append(filtermaxDcrEnteredDate[0].Status);
                                        strTableRept.Append("</td>");
                                        //status of last activity
                                        strTableRept.Append("<td align='left' valign='top'>");
                                        strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Status);
                                        strTableRept.Append("</td>");

                                        intWorkingDays = _objRR.GetCountDCRActualDateDetails(companyCode, filterDCRDetails[0].User_Code, startDate, endDate);
                                        //Report frequency
                                        if (Convert.ToString(intWorkingDays) == "0")
                                        {
                                            strTableRept.Append("<td align='right' valign='top'>0</td>");
                                        }
                                        else
                                        {
                                            intAverageDays = Convert.ToDouble(intTotalDays) / Convert.ToDouble(intWorkingDays);
                                            strTableRept.Append("<td align='right' valign='top'> " + intAverageDays.ToString("0.00") + " </td>");
                                        }
                                    }
                                    else
                                    {
                                        strTableRept.Append("<td align='right' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='right' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='right' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='right' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='right' valign='top'>N/A</td>");
                                    }
                                    var filterEmployee = lstActivityfrequencySummary[0].lstEmployee.Where(s => s.User_Code == filterEmployeedetails[0].User_Code).ToList();
                                    for (int l = 0; l < monthList.Count; l++)
                                    {
                                        List<MVCModels.HiDoctor_Reports.AllTpEnteredDetails> filterAllTpdetails = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.Month == monthList[l].ToString().Split('_')[0] && p.Year == monthList[l].ToString().Split('_')[2] && p.User_Code == filterEmployee[0].User_Code).ToList();
                                        var filterMaxdcrdate = filterAllTpdetails.Max(x => x.Entered_Date);
                                        var filterTpEnter = lstActivityfrequencySummary[0].lstTpEntereddetails.Where(s => s.User_Code == filterEmployee[0].User_Code && s.MONTH == monthList[l].ToString().Split('_')[1] && s.YEAR == monthList[l].ToString().Split('_')[2]).ToList();
                                        var filterTpAllEnter = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "Applied").ToList();
                                        appliedCount = filterTpAllEnter.Count;
                                        var filterTpAllEnterforApproved = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "Approved").ToList();
                                        approvedCount = filterTpAllEnterforApproved.Count;
                                        var filterTpAllEnterforUnApproved = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "UnApproved").ToList();
                                        unapprovedCount = filterTpAllEnterforUnApproved.Count;

                                        DateTime fromDate = Convert.ToDateTime(monthList[l].ToString().Split('_')[2] + "-" + monthList[l].ToString().Split('_')[1] + "-01");

                                        int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(monthList[l].ToString().Split('_')[2]), Convert.ToInt32(monthList[l].ToString().Split('_')[1]));
                                        if (l == monthList.Count - 1)
                                        {
                                            daysInMonth = Convert.ToInt32(endDate.Split('-')[2]);
                                        }

                                        DateTime toDate = Convert.ToDateTime(monthList[l].ToString().Split('_')[2] + "-" + monthList[l].ToString().Split('_')[1] + "-" + daysInMonth.ToString());
                                        List<MVCModels.HiDoctor_Reports.ApprovedLeavesModel> lstApprovedleaves = _objRR.GetApprovedLeavsDetails(_objCurrentInfo.GetCompanyCode(), filterEmployee[0].User_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                        List<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary> lstHolidayDetails = _objRR.GetHolidaydetailsforActivitySummary(companyCode, filterEmployee[0].Region_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                        status = "";
                                        List<MVCModels.HiDoctor_Reports.TpDatesModel> lstTpDatesDetails = _objRR.GetTpDates(companyCode, filterEmployee[0].User_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                        for (DateTime dtTempDt = fromDate; dtTempDt <= toDate; dtTempDt = dtTempDt.AddDays(1))
                                        {
                                            var filterTpDates = lstTpDatesDetails.Where(p => p.TP_Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();
                                            if (filterTpDates.Count() == 0)
                                            {
                                                if (dtTempDt.DayOfWeek.ToString().ToUpper() != "SUNDAY") // NO SUNDAY
                                                {
                                                    var fitlerHoliday = lstHolidayDetails.Where(p => p.Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();

                                                    if (fitlerHoliday.Count() == 0)  //NO HOLIDAY
                                                    {
                                                        var filterleave = lstApprovedleaves.Where(v => v.DCR_Actual_Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();
                                                        if (filterleave.Count() == 0) // NO LEAVE
                                                        {
                                                            status = "MIXED";
                                                            break;
                                                        }
                                                    }

                                                }
                                            }
                                        }
                                        int totalcount1 = approvedCount + unapprovedCount + appliedCount;

                                        if (status != "MIXED")
                                        {
                                            if (appliedCount > 0 && approvedCount == 0 && unapprovedCount == 0)
                                            {
                                                status = "Applied";
                                            }
                                            else if (approvedCount > 0 && appliedCount == 0 && unapprovedCount == 0)
                                            {
                                                status = "Approved";
                                            }
                                            else if (unapprovedCount > 0 && appliedCount == 0 && approvedCount == 0)
                                            {
                                                status = "UnApproved";
                                            }
                                            else
                                            {
                                                status = "MIXED";
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(filterMaxdcrdate))
                                        {
                                            strTableRept.Append("<td  align='left' valign='top'> " + filterMaxdcrdate + " </td>");//Entered On
                                            //Approved on
                                            if (status == "MIXED")
                                            {
                                                strTableRept.Append("<td align='left' valign='top'><a style='text-decoration:underline;cursor:pointer' onclick='fnclick();'> " + status + " </a></td>");
                                            }
                                            else
                                            {
                                                strTableRept.Append("<td align='left' valign='top'> " + status + " </td>");
                                            }
                                        }
                                        else if (lstTpDatesDetails.Count() > 0)
                                        {
                                            strTableRept.Append("<td align= 'left' valign='top'>N/A</td>");//Entered on
                                            //Approved status
                                            if (status == "MIXED")
                                            {
                                                strTableRept.Append("<td align='left' valign='top'><a style='text-decoration:underline;cursor:pointer' onclick='fnclick();'> " + status + " </a></td>");
                                            }
                                            else
                                            {
                                                strTableRept.Append("<td align='left' valign='top'> " + status + " </td>");
                                            }
                                        }
                                        else
                                        {
                                            strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                            strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                        }
                                    }
                                }
                                else
                                {
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last activitydate
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//last Entered date
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Mode of Last Entry
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//status of last activity
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Report frequency                                    
                                    for (int p = 0; p < monthList.Count; p++)
                                    {
                                        strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                    }
                                }

                            }
                            else if (filteredUsercodeinTpEntered.Count() != 0) //TP Only Entered between these Date
                            {
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last activity date
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//last Entered date
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Mode of Last entry
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//status of last activity
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//report frequency

                                var filterEmployee = lstActivityfrequencySummary[0].lstEmployee.Where(s => s.User_Code == filterEmployeedetails[0].User_Code).ToList();
                                intWorkingDays = _objRR.GetCountDCRActualDateDetails(_objCurrentInfo.GetCompanyCode(), filterEmployee[0].User_Code, startDate, endDate);

                                for (int l = 0; l < monthList.Count; l++)
                                {
                                    List<MVCModels.HiDoctor_Reports.AllTpEnteredDetails> filterAllTpdetails = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.Month == monthList[l].ToString().Split('_')[0] && p.Year == monthList[l].ToString().Split('_')[2] && p.User_Code == filterEmployee[0].User_Code).ToList();
                                    var filterMaxdcrdate = filterAllTpdetails.Max(x => x.Entered_Date);
                                    var filterTpEnter = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(s => s.User_Code == filterEmployee[0].User_Code && s.Month == monthList[l].ToString().Split('_')[1] && s.Year == monthList[l].ToString().Split('_')[2]).ToList();
                                    var filterTpAllEnter = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "Applied").ToList();
                                    appliedCount = filterTpAllEnter.Count();
                                    var filterTpAllEnterforApproved = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "Approved").ToList();
                                    approvedCount = filterTpAllEnterforApproved.Count();
                                    var filterTpAllEnterforUnApproved = lstActivityfrequencySummary[0].lstTpAllEnteredDetails.Where(p => p.User_Code == filterEmployee[0].User_Code && p.MonthofTp_Date == monthList[l].ToString().Split('_')[1] && p.Year == monthList[l].ToString().Split('_')[2] && p.status == "UnApproved").ToList();
                                    unapprovedCount = filterTpAllEnterforUnApproved.Count();

                                    DateTime fromDate = Convert.ToDateTime(monthList[l].ToString().Split('_')[2] + "-" + monthList[l].ToString().Split('_')[1] + "-01");

                                    int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(monthList[l].ToString().Split('_')[2]), Convert.ToInt32(monthList[l].ToString().Split('_')[1]));
                                    if (l == monthList.Count - 1)
                                    {
                                        daysInMonth = Convert.ToInt32(endDate.Split('-')[2]);
                                    }

                                    DateTime toDate = Convert.ToDateTime(monthList[l].ToString().Split('_')[2] + "-" + monthList[l].ToString().Split('_')[1] + "-" + daysInMonth.ToString());
                                    List<MVCModels.HiDoctor_Reports.ApprovedLeavesModel> lstApprovedleaves = _objRR.GetApprovedLeavsDetails(_objCurrentInfo.GetCompanyCode(), filterEmployee[0].User_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                    List<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary> lstHolidayDetails = _objRR.GetHolidaydetailsforActivitySummary(companyCode, filterEmployee[0].Region_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                    status = "";
                                    List<MVCModels.HiDoctor_Reports.TpDatesModel> lstTpDatesDetails = _objRR.GetTpDates(companyCode, filterEmployee[0].User_Code, monthList[l].ToString().Split('_')[1], monthList[l].ToString().Split('_')[2]).ToList();
                                    for (DateTime dtTempDt = fromDate; dtTempDt <= toDate; dtTempDt = dtTempDt.AddDays(1))
                                    {
                                        var filterTpDates = lstTpDatesDetails.Where(p => p.TP_Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();
                                        if (filterTpDates.Count() == 0)
                                        {
                                            if (dtTempDt.DayOfWeek.ToString().ToUpper() != "SUNDAY") // NO SUNDAY
                                            {
                                                var fitlerHoliday = lstHolidayDetails.Where(v => v.Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();
                                                if (fitlerHoliday.Count() == 0)  //NO HOLIDAY
                                                {
                                                    var filterLeave = lstApprovedleaves.Where(v => v.DCR_Actual_Date == dtTempDt.ToString("dd/MM/yyyy")).ToList();
                                                    if (filterLeave.Count() == 0) // NO LEAVE
                                                    {
                                                        status = "MIXED";
                                                        break;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                    int totalcount1 = approvedCount + unapprovedCount + appliedCount;

                                    if (status.ToString().ToUpper() != "MIXED")
                                    {
                                        if (appliedCount > 0 && approvedCount == 0 && unapprovedCount == 0)
                                        {
                                            status = "Applied";
                                        }
                                        else if (approvedCount > 0 && appliedCount == 0 && unapprovedCount == 0)
                                        {
                                            status = "Approved";
                                        }
                                        else if (unapprovedCount > 0 && appliedCount == 0 && approvedCount == 0)
                                        {
                                            status = "UnApproved";
                                        }
                                        else
                                        {
                                            status = "MIXED";
                                        }
                                    }

                                    if (!string.IsNullOrEmpty(filterMaxdcrdate))
                                    {
                                        strTableRept.Append("<td  align='left' valign='top'> " + filterMaxdcrdate + " </td>");//Entered On
                                        //Approved Status
                                        if (status.ToString().ToUpper() == "MIXED")
                                        {
                                            strTableRept.Append("<td  align='left' valign='top'><a style='text-decoration:underline;cursor:pointer' onclick='fnclick();'> " + status + " </a></td>");
                                        }
                                        else
                                        {
                                            strTableRept.Append("<td align='left' valign='top'> " + status + " </td>");
                                        }
                                    }
                                    else if (lstTpDatesDetails.Count() > 0)
                                    {
                                        strTableRept.Append("<td align= 'left' valign='top'>N/A</td>");//Entered ON
                                        //Approved Status
                                        if (status.ToString().ToUpper() == "MIXED")
                                        {
                                            strTableRept.Append("<td align='left' valign='top'><a style='text-decoration:underline;cursor:pointer' onclick='fnclick();'> " + status + " </a></td>");
                                        }
                                        else
                                        {
                                            strTableRept.Append("<td align='left' valign='top'> " + status + " </td>");
                                        }
                                    }
                                    else
                                    {
                                        strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                    }
                                }
                            }
                            else if (filteredUsercodeinDCRMaxActualdate.Count() != 0) //DCR Entry Only Entered Btw these Date .
                            {
                                List<DCRHeaderReportModel> filterDcrMaxActualDateDetails = lstActivityfrequencySummary[0].lstDcrMaxActualdate.Where(p => p.User_Code == filterEmployeedetails[0].User_Code.ToString()).ToList();

                                var filterDCRDetails = lstActivityfrequencySummary[0].lstDcrdetails.Where(p => p.DCR_Actual_Date == filterDcrMaxActualDateDetails[0].DCR_Actual_Date.ToString() && p.User_Code == filterDcrMaxActualDateDetails[0].User_Code.ToString() && p.Status != "TimeSheet").ToList();

                                if (filterDcrMaxActualDateDetails.Count() > 0 && filterDCRDetails.Count() > 0)
                                {
                                    var filtermaxDcrEnteredDate = filterDCRDetails.Where(x => x.Entered_Datetime == filterDCRDetails.Max(y => y.Entered_Datetime)).ToList();
                                    //Last Activity date
                                    strTableRept.Append("<td align='left' valign='top'> ");
                                    strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Actual_Date);
                                    strTableRept.Append("</td>");
                                    //Last Entered date
                                    strTableRept.Append("<td align='left' valign='top'> ");
                                    strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Entered_Date);
                                    strTableRept.Append("</td>");
                                    //Mode of last entry
                                    strTableRept.Append("<td align='left' valign='top'> ");
                                    strTableRept.Append(filtermaxDcrEnteredDate[0].Status);
                                    strTableRept.Append("</td>");
                                    //status of last activity
                                    strTableRept.Append("<td align='left' valign='top'>");
                                    strTableRept.Append(filtermaxDcrEnteredDate[0].DCR_Status);
                                    strTableRept.Append("</td>");
                                    //Report frequency
                                    intWorkingDays = _objRR.GetCountDCRActualDateDetails(companyCode, filterDCRDetails[0].User_Code, startDate, endDate);

                                    if (Convert.ToString(intWorkingDays) == "0")
                                    {
                                        strTableRept.Append("<td>0</td>");
                                    }
                                    else
                                    {
                                        intAverageDays = Convert.ToDouble(intTotalDays) / Convert.ToDouble(intWorkingDays);
                                        strTableRept.Append("<td> " + intAverageDays.ToString("0.00") + " </td>");
                                    }
                                    //Tour Plan
                                    for (int l = 0; l < monthList.Count; l++)
                                    {
                                        strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                    }
                                }
                                else
                                {
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last Actiivyt date
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last Entered Date
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Mode of Last activity
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//status of last activity
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");//report frequency 
                                    //Tour Plan
                                    for (int p = 0; p < monthList.Count; p++)
                                    {
                                        strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                        strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                    }
                                }

                            }
                            else if (filteredUsercodeinDCRMaxActualdate.Count() == 0 && filteredUsercodeinTpEntered.Count() == 0)
                            {
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last Actiivyt date
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Last Entered Date
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//Mode of Last activity
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//status of last activity
                                strTableRept.Append("<td align='left' valign='top'>N/A</td>");//report frequency  
                                //Tour Plan
                                for (int p = 0; p < monthList.Count; p++)
                                {
                                    strTableRept.Append("<td align='left' valign='top'>N/A</td>");
                                    strTableRept.Append("<td align='left' valign='top'>Not Applied</td>");
                                }
                            }
                            strTableRept.Append("</tr>");
                        }
                    }
                    strTableRept.Append("</tbody>");
                    strTableRept.Append("</table>");
                }
                else
                {
                    strTableRept.Append("No Records To Display.");
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

        //------------------------END-ACTIVITYFREQUENCYSUMMARY REPORT------------------------------//

        /// <summary>
        /// Get BrandMaster Report Details
        /// </summary>
        /// <returns></returns>
        public string GetBrandMasterReportDetails()
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strTb = new StringBuilder();
            IEnumerable<MasterReportModel> lstBrandMasterReport = null;
            string companyCode = objCurrentInfo.GetCompanyCode();
            lstBrandMasterReport = objRR.GetBrandMasterDetails(objCurrentInfo.GetCompanyCode());
            try
            {
                strTb.Append("<table class='table table-striped'><thead class='active' style='text-align:center;'><tr><th>Brand Name</th>");
                strTb.Append("</tr></thead><tbody>");
                if (lstBrandMasterReport != null && lstBrandMasterReport.Count() > 0)
                {
                    int i = 0;
                    foreach (var lstbrand in lstBrandMasterReport)
                    {
                        i++;
                        strTb.Append("<tr><td style='text-align:left;' id='brand_name" + i + "'>" + lstbrand + "</td></tr>");
                    }
                    strTb.Append("</tbody>");
                    strTb.Append("</table>");
                }
                else
                {
                    strTb.Append("<div class='col-lg-12 form-group'>No Records To Display.</div>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        /// <summary>
        /// Get ProductMaster Report Details
        /// </summary>
        /// <returns></returns>
        public string GetProductMasterReportDetails()
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strTb = new StringBuilder();
            IEnumerable<MasterReportModel> lstProductMasterReport = null;
            string companyCode = objCurrentInfo.GetCompanyCode();
            lstProductMasterReport = objRR.GetProdcutMasterDetails(objCurrentInfo.GetCompanyCode());
            try
            {
                strTb.Append("<table class='table table-striped'><thead class='active'><tr><th>Product Name</th>");
                strTb.Append("<th>Speciality Name</th><th>Brand Name</th><th>Category Name</th>");
                strTb.Append("<th>UOM Type Name</th><th>UOM Name</th><th>Product Name1</th>");
                strTb.Append("</tr></thead><tbody>");
                if (lstProductMasterReport != null && lstProductMasterReport.Count() > 0)
                {
                    int i = 0;
                    foreach (var lstproductrpt in lstProductMasterReport)
                    {
                        i++;
                        strTb.Append("<tr><td id='product_name" + i + "'>");
                        strTb.Append(lstproductrpt.product_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='speciality_name" + i + "'>");
                        strTb.Append(lstproductrpt.speciality_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='brand_name" + i + "'>");
                        strTb.Append(lstproductrpt.brand_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='category_name" + i + "'>");
                        strTb.Append(lstproductrpt.category_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='uom_type_name" + i + "'>");
                        strTb.Append(lstproductrpt.uom_type_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='uom_name" + i + "'>");
                        strTb.Append(lstproductrpt.uom_name);
                        strTb.Append("</td>");

                        strTb.Append("<td id='Product_Type_Name" + i + "'>");
                        strTb.Append(lstproductrpt.Product_Type_Name);
                        strTb.Append("</td>");
                        strTb.Append("</tr>");
                    }
                    strTb.Append("</tbody>");
                    strTb.Append("</table>");
                }
                else
                {
                    strTb.Append("<div class='col-lg-12 form-group'>No Records To Display.</div>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        /// <summary>
        /// Retrieve the chemist met HTML format.
        /// </summary>
        /// <param name="userCodes"></param>
        /// <param name="start_Date"></param>
        /// <param name="end_Date"></param>
        /// <param name="viewFormat"></param>
        /// <returns></returns>
        public StringBuilder GetDoctorChemistMetHTMLFormat(string userCodes, string start_Date, string end_Date, string viewFormat)
        {
            try
            {
                // Creats Instance.
                _objCurrentInfo = new CurrentInfo();
                _objDocChemTabular = new BL_DoctorChemistMetTabular();
                StringBuilder strBuilder = new StringBuilder();

                // Get the company code from currentInfo.
                string company_Code = _objCurrentInfo.GetCompanyCode();

                // Retrieve the Doctor Chemist met list from BL and DAL.
                List<DoctorChemistMetReportModel> lstDoctorChemistTabular = _objDocChemTabular.GetDoctorChemistMetTabular(company_Code, userCodes, start_Date, end_Date);

                // View Type is 1 means ViewinScreen.
                // Otherwise data export the excel. Then returns the BLOBurl.
                if (viewFormat == "S")
                {
                    strBuilder = GetDoctorChemistHTMLTableFormat(lstDoctorChemistTabular, start_Date, end_Date);
                }
                else
                {
                    string docChemiMetTable = GetDoctorChemistHTMLTableFormat(lstDoctorChemistTabular, start_Date, end_Date).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();

                    string fileName = "Doctor_Chemist_Met_Tabular" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(docChemiMetTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download.</a>");
                }

                return strBuilder;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Codes JSON:", userCodes);
                dicContext.Add("Start Date:", start_Date);
                dicContext.Add("End Date:", end_Date);
                dicContext.Add("View Type:", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// Retrieve the CP Status Report.
        /// </summary>
        /// <param name="selected_Region_Code"></param>
        /// <param name="level1_RegionType"></param>
        /// <param name="level2_RegionType"></param>
        /// <param name="status"></param>
        /// <param name="viewType"></param>
        /// <returns></returns>
        public StringBuilder GetCPStatusReport(string selected_Region_Code, string level1_RegionType, string level2_RegionType, string status, string viewType)
        {
            try
            {
                // Creates instance.
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();

                // Get Company Code from currentInfo
                string company_Code = _objCurrentInfo.GetCompanyCode();

                // Retrieve the CPStatus list from the BL and DAL.
                CPStatusReport objCPStatusReport = _objBL_ReportRegion.GetCPStatusReport(company_Code, selected_Region_Code, level1_RegionType, level2_RegionType, status);

                // View Type is 1 means ViewinScreen.
                // Otherwise data export the excel. Then returns the BLOBurl.
                if (viewType == "1")
                {
                    return GetCPStatusTableFormat(selected_Region_Code, level1_RegionType, level2_RegionType, status, viewType, objCPStatusReport);
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    string CPStatusReportHTMLFormat = GetCPStatusTableFormat(selected_Region_Code, level1_RegionType, level2_RegionType, status, viewType, objCPStatusReport).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();

                    string fileName = "CPStatusReport" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(CPStatusReportHTMLFormat, accKey, fileName, "bulkdatasvc");

                    return strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download.</a>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected Region Code:", selected_Region_Code);
                dicContext.Add("Level 1 Region Type :", level1_RegionType);
                dicContext.Add("Level2 Region Type:", level2_RegionType);
                dicContext.Add("Status:", level2_RegionType);
                dicContext.Add("View Type:", viewType);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// Method is used to DownLoad Excel
        /// </summary>
        /// <param name="userCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="viewFormat"></param>
        /// <returns></returns>
        public string GetLastSubmittedQuickReferenceDetails(string userCodes, string startDate, string endDate, string viewFormat)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> lstLastSubmitted = _objRR.GetLastSubmittedQuickrefDetails(companyCode, userCodes, startDate, endDate).ToList();
                if (viewFormat == "S")
                {
                    strTb = GetLastSubmittedQuickReferenceReport(lstLastSubmitted, startDate, endDate);
                }
                else
                {
                    string lastSubmittedTable = GetLastSubmittedQuickReferenceReport(lstLastSubmitted, startDate, endDate).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();

                    string fileName = "Last_Submitted_Quick_ReferenceReport" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Last Submitted Quick Reference Report Excel Dowbload</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCodes", userCodes);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        /// <summary>
        /// Method is Used to bind the Data with Grid
        /// </summary>
        /// <param name="lstLastSubmitted"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public StringBuilder GetLastSubmittedQuickReferenceReport(List<DCRLastSubmittedQuickRefReportModel> lstLastSubmitted, string startDate, string endDate)
        {
            StringBuilder strTableRept = new StringBuilder();
            _objCurrentInfo = new CurrentInfo();
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
                    strTableRept.Append("<table id='tblLastsubmittedqukRefRept' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead class='active'><tr><th>User Name</th><th>Employee Name</th><th>Employee Number</th>");
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
        //-------------------------- START - TP WITH CP DOCTOR MISSED REPORT --------------------------//
        public string GetTpWithCpDoctorMissedReport(string regionCode, int month, int year, string tpStatus, string isExcel)
        {
            try
            {

                MVCModels.HiDoctor_Reports.TpWithCpDoctorMissed objTpCp = new MVCModels.HiDoctor_Reports.TpWithCpDoctorMissed();
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();
                StringBuilder sbTbl = new StringBuilder();
                JSONConverter objJson = new JSONConverter();

                objTpCp = _objBL_ReportRegion.GetTpWithCpDoctorMissedReport(_objCurrentInfo.GetCompanyCode(), regionCode, month, year, tpStatus);

                if (objTpCp != null && objTpCp.lstUser != null && objTpCp.lstTpCpCount != null && objTpCp.lstUser.Count > 0)
                {
                    string startDate = "01/" + ((month < 10) ? "0" + month.ToString() : month.ToString()) + "/" + year.ToString();
                    Int32 iDays = DateTime.DaysInMonth(year, month);
                    string endDate = iDays.ToString() + "/" + ((month < 10) ? "0" + month.ToString() : month.ToString()) + "/" + year.ToString();

                    sbTbl.Append("<div class='col-lg-12'><div class='table-responsive'><table class='table' id='tblUserDetails' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Company Name : " + objTpCp.lstUser[0].Company_Name + "</td>");
                    sbTbl.Append("<td>User Name : " + objTpCp.lstUser[0].User_Name + "</td>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Employee Name : " + objTpCp.lstUser[0].Employee_Name + "</td>");
                    sbTbl.Append("<td>Region Name : " + objTpCp.lstUser[0].Region_Name + "</td>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Designation : " + objTpCp.lstUser[0].User_Type_Name + "</td>");
                    sbTbl.Append("<td>Date of Joining : " + objTpCp.lstUser[0].DOJ + "</td>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Manager Name : " + objTpCp.lstUser[0].Manager_Name + "</td>");
                    sbTbl.Append("<td>Manager Region Name : " + objTpCp.lstUser[0].Manager_Region_Name + "</td>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Report Name : Tp with Cp Doctors Missed</td>");
                    sbTbl.Append("<td>Period : " + startDate + " - " + endDate + "</td>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</table></div></div>");

                    if (objTpCp.lstTpCpCount.Count > 0)
                    {
                        sbTbl.Append("<div class='col-lg-12'>");

                        int doctorCount = 0, cptpCount = 0, missed = 0;
                        double cptpAvg = 0.0, missedAvg = 0.0;

                        doctorCount = objTpCp.lstTpCpCount[0].DoctorCount;
                        cptpCount = objTpCp.lstTpCpCount[0].CpTpCount;

                        missed = doctorCount - cptpCount;
                        if (doctorCount != 0)
                        {
                            cptpAvg = (Convert.ToDouble(cptpCount) / Convert.ToDouble(doctorCount)) * 100;
                            missedAvg = (Convert.ToDouble(missed) / Convert.ToDouble(doctorCount)) * 100;
                        }

                        sbTbl.Append("<div class='col-lg-6 table-responsive'><table class='table' cellspacing='0' cellpadding='0'>");
                        sbTbl.Append("<thead>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Details</td>");
                        sbTbl.Append("<td>Count</td>");
                        sbTbl.Append("<td>%</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("</thead>");

                        sbTbl.Append("<tbody>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Total Approved Doctors</td>");
                        sbTbl.Append("<td>" + doctorCount.ToString() + "</td>");
                        sbTbl.Append("<td>100</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Doctors to be visited as CP in TP</td>");
                        sbTbl.Append("<td>" + cptpCount.ToString() + "</td>");
                        sbTbl.Append("<td>" + cptpAvg.ToString("N2") + "</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Doctors to be missed for the month</td>");
                        sbTbl.Append("<td>" + missed.ToString() + "</td>");
                        sbTbl.Append("<td>" + missedAvg.ToString("N2") + "</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("</tbody>");
                        sbTbl.Append("</table></div>");

                        int cpCount = 0, cptpDetailCount = 0, missedDetail = 0;

                        // Table bind here
                        cpCount = objTpCp.lstTpCpCount[0].CpCount;
                        cptpDetailCount = objTpCp.lstTpCpCount[0].CpTpDetailedCount;
                        missedDetail = cpCount - cptpDetailCount;

                        sbTbl.Append("<div class='col-lg-6 table-responsive'><table class='table' cellspacing='0' cellpadding='0'>");
                        sbTbl.Append("<thead>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Details</td>");
                        sbTbl.Append("<td>Count</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("</thead>");

                        sbTbl.Append("<tbody>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Total CP</td>");
                        sbTbl.Append("<td>" + cpCount + "</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Utilized CP for the month</td>");
                        sbTbl.Append("<td>" + cptpDetailCount + "</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>Unutilized CP</td>");
                        sbTbl.Append("<td>" + missedDetail + "</td>");
                        sbTbl.Append("</tr>");
                        sbTbl.Append("</tbody>");
                        sbTbl.Append("</table></div>");
                        sbTbl.Append("<div style='clear:both;'></div>");
                        sbTbl.Append("</div>");

                        sbTbl.Append("<div class='col-lg-12'>");
                        sbTbl.Append("<div class='col-lg-6' style='height:300px;' id='dvTpWithCp1'>");
                        sbTbl.Append("</div>");
                        sbTbl.Append("<div class='col-lg-6' style='height:300px;' id='dvTpWithCp2'>");
                        sbTbl.Append("</div>");
                        sbTbl.Append("<div style='clear:both;'></div>");
                        sbTbl.Append("</div>");
                    }
                    else
                    {
                        sbTbl.Append("<div class='col-lg-12'>No records found for this input details.</div>");
                    }
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No records found for this input details.</div>");
                }

                if (isExcel == "Y")
                {

                    string blobUrl = string.Empty;

                    //sbTableContentExcel.Append(sbTbl.ToString());

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string curuserName = _objCurrentInfo.GetUserName();
                    string subDomin = _objCurrentInfo.GetSubDomain();
                    string fileName = "TpWithCpDoctorMissedReport_" + "_" + subDomin + "_" + curuserName + ".xls";

                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTbl.ToString(), accKey, fileName, "bulkdatasvc");

                    return blobUrl;
                }
                else
                {
                    return sbTbl.ToString();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("month", month.ToString());
                dicContext.Add("year", year.ToString());
                dicContext.Add("tpStatus", tpStatus);
                dicContext.Add("isExcel", isExcel);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }


        // DONT DELETE

        //public void GetTpWithCpDoctorMissedReportExcel(FormCollection coll)
        //{
        //    try
        //    {
        //        DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
        //        _objCurrentInfo = new CurrentInfo();
        //        string userName = _objCurrentInfo.GetUserName();
        //        string compCode = _objCurrentInfo.GetCompanyCode();
        //        string fileName = "DistanceFareChart_" + "_" + compCode + "_" + userName + ".xls";
        //        string blobUrl = coll["hdnblobUrl"].ToString();
        //        string error = string.Empty;

        //        objFileDownload.DownloadFile(blobUrl, fileName, out error);
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicContext = new Dictionary<string, string>();
        //        dicContext.Add("blobUrl", coll["hdnblobUrl"].ToString());
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
        //        throw;
        //    }
        //}
        // DONT DELETE
        //-------------------------- END   - TP WITH CP DOCTOR MISSED REPORT --------------------------//

        /// <summary>
        /// Retrieves the Deviation CP Report.
        /// </summary>
        /// <param name="user_Code"></param>
        /// <param name="start_Date"></param>
        /// <param name="end_Date"></param>
        /// <param name="viewType"></param>
        /// <returns></returns>
        public StringBuilder GetDeviationCPReport(string user_Code, string start_Date, string end_Date, string viewType)
        {
            try
            {
                // Creates instance.
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();

                string company_Code = _objCurrentInfo.GetCompanyCode();
                IEnumerable<DeviationCPReportModel> IDeviationReport = _objBL_ReportRegion.GetDeviationCPReport(company_Code, user_Code, start_Date, end_Date);
                if (viewType == "1")
                {
                    return GetDeviationCPHTMLFormat(IDeviationReport);
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    string DeviationCPHtmlFormat = GetDeviationCPHTMLFormat(IDeviationReport).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    if (DeviationCPHtmlFormat.Contains("No Records Found"))
                    {
                        return strBuilder.Append("<span>No Records Found.</span> ");
                    }
                    else
                    {
                        string userName = _objCurrentInfo.GetUserName();
                        string compCode = _objCurrentInfo.GetCompanyCode();

                        string fileName = "DeviationCPReport" + "_" + compCode + "_" + userName + ".xls";
                        string blobUrl = objAzureBlob.AzureBlobUploadText(DeviationCPHtmlFormat, accKey, fileName, "bulkdatasvc");

                        return strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download.</a>");
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", user_Code);
                dicContext.Add("Start Date:", start_Date);
                dicContext.Add("End Date:", end_Date);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        //public string GetSelfActivity(string userCode, string startDate, string endDate, string DcrStatus)
        //{
        //    string userCodes = string.Empty;
        //    StringBuilder sbTableContent = new StringBuilder();
        //    ArrayList alExpenceMode = new ArrayList();
        //    DateTime dtFromDate = DateTime.Parse(startDate);
        //    DateTime dtToDate = DateTime.Parse(endDate);
        //    // DateTime dtTemp;
        //    TimeSpan tsDiff = dtToDate - dtFromDate;
        //    int intDateDiff = tsDiff.Days;
        //    intDateDiff = intDateDiff + 1;
        //    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();

        //    string companyCode = _objCurInfo.GetCompanyCode();
        //    List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstReportDetail = new List<MVCModels.HiDoctor_Reports.EmployeeDetail>();
        //    DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
        //    List<MVCModels.HiDoctor_Reports.TPStatusReport> childusers = new List<MVCModels.HiDoctor_Reports.TPStatusReport>();
        //    childusers = (List<MVCModels.HiDoctor_Reports.TPStatusReport>)_objReport.GetchildUsers(companyCode, userCode);
        //    foreach (var users in childusers)
        //    {
        //        userCodes += users.User_Code + ",";
        //    }
        //    List<MVCModels.HiDoctor_Reports.SelfActivityModel> lstSelfActivityDetail = new List<MVCModels.HiDoctor_Reports.SelfActivityModel>();
        //    lstSelfActivityDetail = (List<MVCModels.HiDoctor_Reports.SelfActivityModel>)_objReport.GetSelfActivitDetail(companyCode, userCodes, startDate, endDate, DcrStatus);


        //    alExpenceMode.Add("Daily");
        //    alExpenceMode.Add("Monthly");
        //    alExpenceMode.Add("Weekly");
        //    alExpenceMode.Add("Fortnightly");
        //    alExpenceMode.Add("Yearly");

        //    if (lstSelfActivityDetail != null && lstSelfActivityDetail.Count > 0)
        //    {
        //        sbTableContent.Append("<table id='tblSelfActivity' class='table table-striped' >");
        //        sbTableContent.Append("<thead class='active'>");
        //        sbTableContent.Append("<tr><td colspan='" + ((alExpenceMode.Count) + 25) + "' align='center'>Self Activity</td></tr>");
        //        sbTableContent.Append("<tr><td colspan='8'></td>");
        //        sbTableContent.Append("<td colspan='9' align='center'>Doctor Visited</td>");
        //        sbTableContent.Append("<td colspan='7' align='center'>Chemist Visited</td>");
        //        sbTableContent.Append("<td colspan='6' align='center'>Expense Details</td></tr>");
        //        sbTableContent.Append("<tr><td align='center'>User</td><td align='center'>Region</td><td align='center'>Total Days</td><td align='center'>Sunday</td>");
        //        sbTableContent.Append("<td align='center'>Holiday</td><td align='center'>Leave</td><td align='center'>Attendance</td><td>Field<td align='center'>Assigned Drs</td>");
        //        sbTableContent.Append("<td align='center'>Once</td><td align='center'>Twice</td><td align='center'>Thrice</td><td align='center'>More Than Thrice</td><td align='center'>Total</td><td align='center'>Calls Made</td><td align='center'>Missed</td><td align='center'>Avg</td>");
        //        sbTableContent.Append("<td align='center'>Once</td><td align='center'>Twice</td><td align='center'>Thrice</td> <td align='center'>More Than Thrice</td><td align='center'>Total</td><td align='center'>Calls Made</td><td align='center'>Avg</td>");
        //        foreach (string expenseMode in alExpenceMode)
        //        {
        //            sbTableContent.Append("<td align='center'>" + expenseMode + "</td>");
        //        }


        //        sbTableContent.Append("<td align='center'>Total</td></tr>");
        //        sbTableContent.Append("</thead>");
        //        sbTableContent.Append("<tbody>");
        //        foreach (var user in lstSelfActivityDetail)
        //        {
        //            foreach (var item in user.lstEmployeeDetail)
        //            {
        //                sbTableContent.Append("<tr><td>" + item.User_Name + "</td>");
        //                sbTableContent.Append("<td>" + item.Region_Name + "</td>");
        //                sbTableContent.Append("<td>" + intDateDiff + "</td>");
        //                string dcr = DcrStatus.Replace("^", ",");
        //                dcr = dcr.TrimEnd(',');
        //                objActivity.SetActivityCount("'''" + item.User_Code + "'''", "", startDate, endDate, dcr);
        //                int intSundaysCount = Convert.ToInt16(objActivity.GetSundayCount(item.User_Code.ToString()));
        //                int holiday = Convert.ToInt16(objActivity.GetHolidayCount(item.User_Code.ToString(), item.Region_Code, startDate, endDate, dcr, "COUNT"));
        //                double Leave = objActivity.GetFlagCount(item.User_Code.ToString(), 'L');
        //                double fieldCount = objActivity.GetFlagCount(item.User_Code.ToString(), 'F');
        //                double attendance = objActivity.GetFlagCount(item.User_Code.ToString(), 'A');
        //                sbTableContent.Append("<td>" + intSundaysCount + "</td>");
        //                sbTableContent.Append("<td>" + holiday + "</td>");
        //                sbTableContent.Append("<td>" + Leave + "</td>");
        //                sbTableContent.Append("<td>" + attendance + "</td>");
        //                sbTableContent.Append("<td>" + Leave + "</td>");
        //                //Assined Drs//
        //                List<MVCModels.HiDoctor_Reports.Doctordetails> lstDrs = user.lstDoctorDetail.Where(DR => DR.Region_Code == item.Region_Code).ToList();
        //                if (lstDrs != null && lstDrs.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lstDrs[0].Drs_Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //1Visit Drs
        //                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors1vist> lstOneVisit = user.lstoneVist.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lstOneVisit != null && lstOneVisit.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lstOneVisit.Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //2Visit Drs
        //                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors2vist> lsttwoVisit = user.lsttwoVist.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lsttwoVisit != null && lsttwoVisit.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lsttwoVisit.Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //3visit Drs
        //                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors3vist> lstthreeVisit = user.lstthreeVist.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lstthreeVisit != null && lstthreeVisit.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lstthreeVisit.Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //morethan Three Visits
        //                List<MVCModels.HiDoctor_Reports.SelfDoctorMorevist> lstmoreVisit = user.lstmoreVist.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lstmoreVisit != null && lstmoreVisit.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lstmoreVisit.Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //total visit//
        //                List<MVCModels.HiDoctor_Reports.SelfTotalVisitDrs> lsttotal = user.lstTotalVist.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lsttotal != null && lsttotal.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lsttotal.Count + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }
        //                //calls made
        //                List<MVCModels.HiDoctor_Reports.SelfCallMade> lstcallsMade = user.lstCallsMade.Where(DR => DR.User_Code == item.User_Code).ToList();
        //                if (lstcallsMade != null && lstcallsMade.Count > 0)
        //                {
        //                    sbTableContent.Append("<td>" + lstcallsMade[0].Total_Visit + "</td>");
        //                }
        //                else
        //                {
        //                    sbTableContent.Append("<td>0</td>");
        //                }

        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td>");
        //                sbTableContent.Append("<td>0</td></tr>");
        //            }
        //        }

        //    }
        //    return sbTableContent.ToString();
        //}

        //************************************************************Dcr Quvality Report start**********************************************//

        public string GetDCRQualityDetailFormat(string regionCode, string startDate, string endDate, string regionTypeLevelone
            , string regionTypeLeveltwo, string DcrStatus, string docFilter, string docCount, string docCondition
            , string chemistFilter, string chemistCount, string chemistCondition, string sampleFilter, string sampleCount, string sampleCondition, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetDCRQualityDetail(regionCode, startDate, endDate, regionTypeLevelone, regionTypeLeveltwo, DcrStatus
                        , docFilter, docCount, docCondition, chemistFilter, chemistCount, chemistCondition, sampleFilter, sampleCount,
                        sampleCondition, viewFormat);
                }
                else
                {
                    string DCRQualityTable = GetDCRQualityDetail(regionCode, startDate, endDate, regionTypeLevelone, regionTypeLeveltwo, DcrStatus
                        , docFilter, docCount, docCondition, chemistFilter, chemistCount, chemistCondition, sampleFilter, sampleCount,
                        sampleCondition, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "DCR Quality Report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCRQualityTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                if (!string.IsNullOrEmpty(strBuilder.ToString()))
                {
                    return strBuilder.ToString();
                }
                else
                {
                    return "-1";
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:RegionTypeLevelone", regionTypeLevelone);
                dicContext.Add("Filter:RegionTypeLeveltwo", regionTypeLeveltwo);
                dicContext.Add("Filter:DcrStatus", DcrStatus);
                dicContext.Add("Filter:DocFilter", docFilter);
                dicContext.Add("Filter:DocCount", docCount);
                dicContext.Add("Filter:DocCondition", docCondition);
                dicContext.Add("Filter:chemistFilter", chemistFilter);
                dicContext.Add("Filter:chemistCount", chemistCount);
                dicContext.Add("Filter:sampleFilter", sampleFilter);
                dicContext.Add("Filter:sampleCount", sampleCount);
                dicContext.Add("Filter:sampleCondition", sampleCondition);
                dicContext.Add("Filter:viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        private StringBuilder GetDCRQualityDetail(string regionCode, string startDate, string endDate, string regionTypeLevelone
            , string regionTypeLeveltwo, string DcrStatus, string docFilter, string docCount, string docCondition
            , string chemistFilter, string chemistCount, string chemistCondition, string sampleFilter, string sampleCount, string sampleCondition, string viewFormat)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();

            try
            {
                string regionCodes = "";

                List<MVCModels.HiDoctor_Reports.DCRQualityModel> levelOneRegion = new List<MVCModels.HiDoctor_Reports.DCRQualityModel>();

                List<MVCModels.HiDoctor_Reports.DCRQualityModel> lstchildregions = new List<MVCModels.HiDoctor_Reports.DCRQualityModel>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                lstchildregions = (List<MVCModels.HiDoctor_Reports.DCRQualityModel>)_objReport.GetchildRegions(companyCode, regionCode);

                foreach (MVCModels.HiDoctor_Reports.DCRQualityModel item in lstchildregions)
                {
                    if (item.Region_Type_Code == regionTypeLevelone)
                    {
                        levelOneRegion.Add(item);
                        regionCodes += item.Region_Code + ",";
                        List<MVCModels.HiDoctor_Reports.DCRQualityModel> leveltwoRegion = new List<MVCModels.HiDoctor_Reports.DCRQualityModel>();
                        leveltwoRegion = (List<MVCModels.HiDoctor_Reports.DCRQualityModel>)_objReport.GetchildRegions(companyCode, item.Region_Code);

                        foreach (var regions in leveltwoRegion)
                        {
                            if (regions.Region_Type_Code == regionTypeLeveltwo)
                            {
                                regionCodes += regions.Region_Code + ",";
                            }

                        }
                    }
                }

                List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> lstDCR = new List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail>();
                lstDCR = (List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail>)_objReport.GetDcrQualityDCR(companyCode, regionCodes, startDate, endDate, DcrStatus);

                List<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount> lstDoctors = new List<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount>();
                lstDoctors = (List<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount>)_objReport.GetDcrQualityDoctorCount(companyCode, regionCodes, startDate, endDate, DcrStatus);

                List<MVCModels.HiDoctor_Reports.DCRQualityProductDetail> lstProducts = new List<MVCModels.HiDoctor_Reports.DCRQualityProductDetail>();
                lstProducts = (List<MVCModels.HiDoctor_Reports.DCRQualityProductDetail>)_objReport.GetDcrQualityProduct(companyCode, regionCodes, startDate, endDate, DcrStatus);

                List<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail> lstChemist = new List<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail>();
                lstChemist = (List<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail>)_objReport.GetDcrChemist(companyCode, regionCodes, startDate, endDate, DcrStatus);

                int doctorCount = 0, chemistsCount = 0, samplesCount = 0, count = 0, iRow = 0;
                bool CheckCondition = false;

                string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];

                if (lstDCR != null && lstDCR.Count > 0)
                {

                    sbTableContent.Append("<div id='DCRquality'>");
                    sbTableContent.Append("<div class='dvHeader' id='spnDCRquality'>");
                    sbTableContent.Append("<div class='dvheader-inner'>DCR Quality Report for the Period of " + st + " " + "to" + " " + ed + "</div>");

                    if (viewFormat == "1")
                    {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DCRQUALITY','HEADER')\" />");
                        sbTableContent.Append("</div>");
                    }
                    sbTableContent.Append("</div>");

                    sbTableContent.Append("<table id='tblDcrQualityReport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Region Name</td>");
                    sbTableContent.Append("<td>Count</td></tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (MVCModels.HiDoctor_Reports.DCRQualityModel items in levelOneRegion)
                    {
                        count = 0;
                        List<MVCModels.HiDoctor_Reports.DCRQualityModel> leveltwoRegion = new List<MVCModels.HiDoctor_Reports.DCRQualityModel>();
                        leveltwoRegion = (List<MVCModels.HiDoctor_Reports.DCRQualityModel>)_objReport.GetchildRegions(companyCode, items.Region_Code);

                        List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> lstDCRCount = new List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail>();
                        foreach (MVCModels.HiDoctor_Reports.DCRQualityModel region in leveltwoRegion)
                        {
                            if (region.Region_Type_Code == regionTypeLeveltwo)
                            {
                                List<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> filteredValue = lstDCR.Where(c => c.Region_Code == region.Region_Code).ToList();
                                if (filteredValue.Count > 0)
                                {
                                    foreach (var item in filteredValue)
                                    {
                                        List<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount> filteredcount = lstDoctors.Where(c => c.Region_Code == region.Region_Code && c.DCR_Date == item.DCR_Date).ToList();
                                        if (filteredcount.Count > 0)
                                        {
                                            doctorCount = Convert.ToInt32(filteredcount.Count);
                                            if (docFilter == "GT")
                                            {
                                                if (doctorCount > Convert.ToInt32(docCount))
                                                {
                                                    CheckCondition = true;
                                                }
                                                else
                                                {
                                                    CheckCondition = false;
                                                }

                                            }
                                            else
                                            {
                                                if (doctorCount < Convert.ToInt32(docCount))
                                                {
                                                    CheckCondition = true;
                                                }
                                                else
                                                {
                                                    CheckCondition = false;
                                                }
                                            }

                                        }
                                        if (docCondition.ToUpper() == "AND")
                                        {
                                            if (CheckCondition)
                                            {
                                                if (filteredcount.Count > 0)
                                                {
                                                    foreach (var drs in filteredcount)
                                                    {
                                                        List<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail> filteredChemist = lstChemist.Where(c => c.Region_Code == region.Region_Code && c.DCR_Date == item.DCR_Date && c.DCR_Visit_Code == drs.DCR_Visit_Code).ToList();
                                                        if (filteredChemist.Count > 0)
                                                        {
                                                            if (!string.IsNullOrEmpty(filteredChemist[0].COUNT.ToString()))
                                                            {
                                                                chemistsCount = Convert.ToInt32(filteredChemist[0].COUNT);
                                                            }
                                                            else
                                                            {
                                                                chemistsCount = 0;
                                                            }
                                                        }
                                                        else
                                                        {
                                                            chemistsCount = 0;
                                                        }
                                                        if (chemistFilter == "GT")
                                                        {
                                                            if (chemistsCount > Convert.ToInt32(chemistCount))
                                                            {
                                                                CheckCondition = true;
                                                            }
                                                            else
                                                            {
                                                                CheckCondition = false;

                                                            }
                                                        }
                                                        else
                                                        {
                                                            if (doctorCount < Convert.ToInt32(chemistCount))
                                                            {
                                                                CheckCondition = true;
                                                            }
                                                            else
                                                            {

                                                                CheckCondition = false;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                        if (chemistFilter.ToUpper() == "AND")
                                        {
                                            if (CheckCondition)
                                            {
                                                if (filteredcount.Count > 0)
                                                {
                                                    foreach (var pro in filteredcount)
                                                    {
                                                        List<MVCModels.HiDoctor_Reports.DCRQualityProductDetail> filteredSamples = lstProducts.Where(c => c.Region_Code == region.Region_Code && c.DCR_Date == item.DCR_Date && c.DCR_Visit_Code == pro.DCR_Visit_Code).ToList();
                                                        if (filteredSamples.Count > 0)
                                                        {
                                                            if (!string.IsNullOrEmpty(filteredSamples[0].COUNT.ToString()))
                                                            {
                                                                samplesCount = Convert.ToInt32(filteredSamples[0].COUNT);
                                                            }
                                                            else
                                                            {
                                                                samplesCount = 0;

                                                            }
                                                        }
                                                        else
                                                        {
                                                            samplesCount = 0;
                                                        }

                                                        if (sampleFilter == "GT")
                                                        {
                                                            if (samplesCount > Convert.ToInt32(sampleCount))
                                                            {
                                                                CheckCondition = true;
                                                            }
                                                            else
                                                            {
                                                                CheckCondition = false;

                                                            }
                                                        }
                                                        else
                                                        {
                                                            if (samplesCount < Convert.ToInt32(sampleCount))
                                                            {
                                                                CheckCondition = true;
                                                            }
                                                            else
                                                            {

                                                                CheckCondition = false;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (CheckCondition)
                            {
                                count++;

                            }
                        }
                        sbTableContent.Append("<tr><td>" + items.Region_Name + "</td>");
                        sbTableContent.Append("<td>" + count.ToString() + "</td></tr>");

                    }
                }
                return sbTableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:RegionTypeLevelone", regionTypeLevelone);
                dicContext.Add("Filter:RegionTypeLeveltwo", regionTypeLeveltwo);
                dicContext.Add("Filter:DcrStatus", DcrStatus);
                dicContext.Add("Filter:DocFilter", docFilter);
                dicContext.Add("Filter:DocCount", docCount);
                dicContext.Add("Filter:DocCondition", docCondition);
                dicContext.Add("Filter:chemistFilter", chemistFilter);
                dicContext.Add("Filter:chemistCount", chemistCount);
                dicContext.Add("Filter:sampleFilter", sampleFilter);
                dicContext.Add("Filter:sampleCount", sampleCount);
                dicContext.Add("Filter:sampleCondition", sampleCondition);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;

            }
        }

        //************************************************************Dcr Quvality Report End**********************************************//

        //************************************************************Dcr weekly Report Start**********************************************//
        public string GetDCRWeeklyReportFormat(string userCode, string startDate, string endDate, string dcrstatus, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetDCRWeeklyReportDetail(userCode, startDate, endDate, dcrstatus, viewFormat);
                }
                else
                {
                    string DCRQualityTable = GetDCRWeeklyReportDetail(userCode, startDate, endDate, dcrstatus, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "DCR Weekly Report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCRQualityTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        private StringBuilder GetDCRWeeklyReportDetail(string userCode, string startDate, string endDate, string dcrStatus, string viewFormat)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                TimeSpan ts;
                int count = 0;
                int visitMode = 0;

                string ratingRemarks = string.Empty;
                string workedWith = string.Empty;
                DateTime dtStartDate = new DateTime();
                DateTime dtEndDate = new DateTime();

                dtStartDate = Convert.ToDateTime(startDate);
                dtEndDate = Convert.ToDateTime(endDate);
                ts = dtEndDate - dtStartDate;

                StringBuilder sbTableContent = new StringBuilder();

                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();

                List<MVCModels.HiDoctor_Reports.DoctorCategory> lstDoctorCategory = new List<MVCModels.HiDoctor_Reports.DoctorCategory>();
                lstDoctorCategory = (List<MVCModels.HiDoctor_Reports.DoctorCategory>)_objReport.GetDoctorCategory(companyCode);

                List<MVCModels.HiDoctor_Reports.DCRWeeklyModel> lstWeeklyDetail = new List<MVCModels.HiDoctor_Reports.DCRWeeklyModel>();
                lstWeeklyDetail = (List<MVCModels.HiDoctor_Reports.DCRWeeklyModel>)_objReport.GetDcrWeeklyDetail(companyCode, userCode, startDate, endDate, dcrStatus);

                List<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> lstDoctorDetail = new List<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel>();
                lstDoctorDetail = (List<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel>)_objReport.GetDcrWeeklyDoctorDetail(companyCode, userCode, startDate, endDate, dcrStatus);

                List<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel> lstChemistDetail = new List<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel>();
                lstChemistDetail = (List<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel>)_objReport.GetDcrWeeklyChemistDetail(companyCode, userCode, startDate, endDate, dcrStatus);

                string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                foreach (var item in lstWeeklyDetail)
                {
                    UserDetailModel userDetailModel = item.lstUser[0];
                    sbTableContent.Append("<div id='DcrWeeklyReport'>");
                    sbTableContent.Append("<div class='dvHeader' id='spnDcrWeeklyReport'>");
                    sbTableContent.Append("<div class='dvheader-inner'>DCR Weekly Report of " + userDetailModel.User_Name + " For the Period of " + st + " " + "to" + " " + ed + "</div>");

                    if (viewFormat == "1")
                    {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DCRWEEKLY_REPORT','HEADER')\" />");
                        sbTableContent.Append("</div>");
                    }
                    sbTableContent.Append("</div>");

                    sbTableContent.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                    sbTableContent.Append("<thead>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th colspan='3'>");
                    sbTableContent.Append("User Details");
                    sbTableContent.Append("<th>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");

                    sbTableContent.Append("<tbody>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>User Name: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>Designation: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.User_Type_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Employee Name: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>Employee Number: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Employee_Number);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Reporting HQ: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>Reporting Manager: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");


                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Territory: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Region_Name);
                    sbTableContent.Append("</td>");
                    List<DivisionReportModel> lstDivisionModel = item.lstuserdivsion.Where(DIV => DIV.User_Code == userDetailModel.User_Code).ToList();

                    sbTableContent.Append("<td>Division: </td>");
                    sbTableContent.Append("<td>");
                    foreach (DivisionReportModel divisionModel in lstDivisionModel)
                    {
                        sbTableContent.Append(divisionModel.Division_Name + ",");
                    }
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Phone number: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.Phone);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>Date of joining: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userDetailModel.DOJ);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>Periods: </td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(startDate + " - " + endDate);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>&nbsp;</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append("&nbsp;");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</tbody></table>");




                    sbTableContent.Append("<table id='tblDcrweeklyReport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr>");

                    sbTableContent.Append("<tr><td valign='top' style='text-align:center;border-bottom:1px solid #0;border-right:1px solid #000; ' rowspan='2'>DAY & DATE</td><td valign='top'  style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2'> WORKED WITH</td><td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2' > Work place</td><td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2'> Dist.from HQ</td><td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2'> CP Name</td>");
                    sbTableContent.Append("<td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' colspan='" + (lstDoctorCategory.Count + 2) + "' >CALLS MADE</td><td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' colspan='" + (item.lstratingParameter.Count) + "' >CALLS EVALUTION RATING</td><td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2'> TOTAL MARKS</td><td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='2'> SIGNATURE</td>");
                    sbTableContent.Append("<td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >EVE Working</td></tr>");
                    if (lstDoctorCategory != null && lstDoctorCategory.Count > 0)
                    {
                        sbTableContent.Append("<tr>");
                        foreach (var docCategory in lstDoctorCategory)
                        {
                            sbTableContent.Append("<td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + docCategory.Category_Name + "</td>");

                        }
                        sbTableContent.Append("<td valign='top'  style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' > Total</td><td valign='top' style='text-align:center;' > CHEMIST</td>");


                        foreach (var ratingParameter in item.lstratingParameter)
                        {
                            sbTableContent.Append("<td valign='top' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; '  >" + ratingParameter.Parameter_Name + "</td>");

                        }
                        sbTableContent.Append("<td valign='top'  style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' > No.of Dr.MET</td></tr>");
                    }
                    sbTableContent.Append("</thead>");
                    ArrayList remarksValue = new ArrayList();
                    remarksValue.Add(0);
                    remarksValue.Add(167);
                    remarksValue.Add(334);
                    remarksValue.Add(375);
                    remarksValue.Add(501);
                    for (int j = 0; j <= ts.Days; j++)
                    {
                        if (j != 0)
                        {
                            dtStartDate = dtStartDate.AddDays(Convert.ToDouble(1));
                        }
                        dtStartDate.ToString("yyyy-MM-dd");


                        count = 3;

                        ratingRemarks = "";
                        workedWith = "";

                        visitMode = 0;

                        sbTableContent.Append("<tr><td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' rowspan='4'>" + dtStartDate.DayOfWeek.ToString().ToUpper() + "</br> &</br>" + dtStartDate.ToString("dd/MM/yyyy") + " </td>");

                        List<MVCModels.HiDoctor_Reports.DCRDetail> filteredValue = item.lstDcrDetail.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy")).ToList();

                        if (filteredValue.Count > 0)
                        {
                            foreach (var dcr in filteredValue)
                            {
                                if (!string.IsNullOrEmpty(dcr.Remarks_Rating))
                                {
                                    ratingRemarks = dcr.Remarks_Rating;
                                }

                                if (!string.IsNullOrEmpty(dcr.Acc1))
                                {
                                    workedWith = dcr.Acc1 + ",";
                                }

                                if (!string.IsNullOrEmpty(dcr.Acc2))
                                {
                                    workedWith = dcr.Acc2 + ",";
                                }
                                if (!string.IsNullOrEmpty(dcr.Acc3))
                                {
                                    workedWith = dcr.Acc3 + ",";
                                }

                                if (!string.IsNullOrEmpty(dcr.Acc4))
                                {
                                    workedWith = dcr.Acc4 + ",";
                                }

                                if (!string.IsNullOrEmpty(workedWith))
                                {
                                    workedWith = workedWith.TrimEnd(',');
                                }

                                if (!string.IsNullOrEmpty(workedWith))
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + workedWith + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                                }
                                if ((!string.IsNullOrEmpty(dcr.Place_Worked.ToString())))
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + dcr.Place_Worked + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                                }
                                if (!string.IsNullOrEmpty(dcr.Travelled_Kms))
                                {
                                    sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + dcr.Travelled_Kms + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                                }
                                if (!string.IsNullOrEmpty(dcr.CP_Name))
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + dcr.CP_Name + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                                }
                            }
                        }
                        else
                        {

                            sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                            sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                            sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                            sbTableContent.Append("<td style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                        }
                        foreach (var docCategory in lstDoctorCategory)
                        {

                            List<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> filteredDocValue = lstDoctorDetail.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy") && c.Category_Code == docCategory.Category_Code).ToList();
                            if (filteredDocValue.Count > 0)
                            {
                                sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + filteredDocValue.Count + "</td>");

                                foreach (var dr in filteredDocValue)
                                {
                                    if (!string.IsNullOrEmpty(dr.Visit_Mode))
                                    {
                                        if (dr.Visit_Mode.ToUpper() == "PM")
                                        {
                                            visitMode++;
                                        }
                                    }
                                }


                            }
                            else
                            {
                                sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >0</td>");
                            }
                            count++;
                        }
                        count++;
                        List<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> filteredDrsValue = lstDoctorDetail.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy")).ToList();
                        filteredDrsValue = lstDoctorDetail.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy")).ToList();

                        if (filteredDrsValue.Count > 0)
                        {
                            sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + filteredDrsValue.Count + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >0</td>");
                        }

                        count++;
                        if (lstChemistDetail.Count > 0)
                        {
                            List<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel> filteredChemistValue = lstChemistDetail.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy")).ToList();

                            if (filteredChemistValue.Count > 0)
                            {
                                sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + filteredChemistValue.Count + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >0</td>");

                            }
                        }
                        else
                        {
                            sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >0</td>");
                        }
                        double ratingCount = 0;
                        foreach (var drRow in item.lstratingParameter)
                        {
                            count++;
                            List<MVCModels.HiDoctor_Reports.DCRRating> filteredRatingparameter = item.lstDCRating.Where(c => c.DCR_Actual_Date == dtStartDate.ToString("dd/MM/yyyy") && c.Parameter_Code == drRow.Parameter_Code).ToList();

                            if (filteredRatingparameter.Count > 0)
                            {
                                foreach (var Rt in filteredRatingparameter)
                                {

                                    sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >" + Rt.Rating_Value + "</td>");
                                    ratingCount += Convert.ToDouble(Rt.Rating_Value);
                                }
                            }
                            else
                            {
                                sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >-</td>");
                            }
                        }
                        count++;
                        sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; '   >" + ratingCount + "</td>");
                        count++;
                        sbTableContent.Append("<td align='left' style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; ' >&nbsp;&nbsp;</td>");
                        count++;
                        sbTableContent.Append("<td style='text-align:center;border-bottom:1px solid #000;border-right:1px solid #000; '  >" + visitMode + "</td></tr>");
                        count++;

                        string remarks = "";
                        int temp = 3;
                        if (ratingRemarks.Length > 167)
                        {
                            for (int index = 1; index < remarksValue.Count; index++)
                            {

                                if (ratingRemarks.Length > (Convert.ToInt32(remarksValue[index].ToString()) + 167))
                                {
                                    if (temp == 3)
                                    {
                                        remarks = "Value Addition : " + remarks;
                                    }

                                    temp--;
                                    remarks = ratingRemarks.Substring(Convert.ToInt32(remarksValue[index - 1].ToString()), 167);
                                    sbTableContent.Append("<tr ><td align='left'  colspan='" + count + "' style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; '>Value Addition :" + remarks + "</td></tr>");


                                }
                                else
                                {
                                    if (temp == 3)
                                    {
                                        remarks = "Value Addition : " + remarks;
                                    }

                                    temp--;
                                    remarks = ratingRemarks.Substring(Convert.ToInt32(remarksValue[index].ToString()));
                                    sbTableContent.Append("<tr ><td align='left'  colspan='" + count + "' style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; '>" + remarks + "</td></tr>");
                                    break;
                                }
                            }

                            for (int k = 0; k < temp; k++)
                            {
                                sbTableContent.Append("<tr><td align='left'  colspan='" + count + "' style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; '> &nbsp;&nbsp;</td></tr>");

                            }

                        }
                        else
                        {
                            sbTableContent.Append("<tr><td align='left'  colspan='" + count + "' style='text-align:left;border-bottom:1px solid #000;border-right:1px solid #000; '>Value Addition :</td></tr>");
                            sbTableContent.Append("<tr style='border-bottom:1px solid #000;border-right:1px solid #000;'><td align='left'  colspan='" + count + "' style='border-bottom:1px solid #000;border-right:1px solid #000; '>&nbsp;&nbsp;</td></tr>");
                            sbTableContent.Append("<tr style='border-bottom:1px solid #000;border-right:1px solid #000;'><td align='left'  colspan='" + count + "' style='border-bottom:1px solid #000;border-right:1px solid #000; '>&nbsp;&nbsp;</td></tr>");

                        }

                    }
                }
                return sbTableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:DCRstatus", dcrStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        //************************************************************Dcr weekly Report End**********************************************//

        //************************************************************Marketing Campaing Report start**********************************************//
        public JsonResult GetCampaignName(string userCode, string startDate, string endDate)
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.CampaignNameModel> lstDoctorCategory = new List<MVCModels.HiDoctor_Reports.CampaignNameModel>();
            string companyCode = _objcurrentInfo.GetCompanyCode();

            try
            {
                IEnumerable<CampaignNameModel> lstCampaignName = _objReport.GetCampaignName(companyCode, userCode, startDate, endDate);

                var camName = (from cam in lstCampaignName.AsEnumerable()
                               select new CampaignNameModel()
                               {
                                   Campaign_Code = cam.Campaign_Code.ToString(),
                                   Campaign_Name = cam.Campaign_Name.ToString()
                               }).ToList<CampaignNameModel>();
                return Json(camName);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }

        }

        public string GetMcdetailHtmlFormat(string userCode, string campaignCode, string viewFormat, string startDate, string endDate)
        {

            StringBuilder strBuilder = new StringBuilder();
            if (viewFormat == "1")
            {
                strBuilder = GetMCReportDetail(userCode, campaignCode, startDate, endDate, viewFormat);
            }
            else
            {
                string DCRQualityTable = GetMCReportDetail(userCode, campaignCode, startDate, endDate, viewFormat).ToString();

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                string userName = _objCurInfo.GetUserName();
                string compName = _objCurInfo.GetSubDomain();

                string fileName = "Marketing Campaing Report" + "_" + compName + "_" + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(DCRQualityTable, accKey, fileName, "bulkdatasvc");

                strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");

            }

            return strBuilder.ToString();
        }

        private StringBuilder GetMCReportDetail(string userCode, string campaignCode, string mCStartDate, string mCendDate, string viewFormat)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();

            List<MVCModels.HiDoctor_Reports.DoctorCategory> lstDoctorCategory = new List<MVCModels.HiDoctor_Reports.DoctorCategory>();
            lstDoctorCategory = (List<MVCModels.HiDoctor_Reports.DoctorCategory>)_objReport.GetDoctorCategory(companyCode);

            List<MVCModels.HiDoctor_Reports.DoctorSpeciality> lstSpeciality = new List<MVCModels.HiDoctor_Reports.DoctorSpeciality>();
            lstSpeciality = (List<MVCModels.HiDoctor_Reports.DoctorSpeciality>)_objReport.GetSpeciality(companyCode);

            List<MVCModels.HiDoctor_Reports.Campaignheader> lstMCheader = new List<MVCModels.HiDoctor_Reports.Campaignheader>();
            lstMCheader = (List<MVCModels.HiDoctor_Reports.Campaignheader>)_objReport.Getcampaignheader(companyCode, campaignCode);

            List<MVCModels.HiDoctor_Reports.DCRQualityModel> lstchildRegion = new List<MVCModels.HiDoctor_Reports.DCRQualityModel>();
            lstchildRegion = (List<MVCModels.HiDoctor_Reports.DCRQualityModel>)_objReport.GetchildUsersFromUserCode(companyCode, userCode);
            List<MVCModels.HiDoctor_Reports.CampaignProductModel> lstMCProductdetail = new List<MVCModels.HiDoctor_Reports.CampaignProductModel>();

            string st = mCStartDate.Split('-')[2] + "/" + mCStartDate.Split('-')[1] + "/" + mCStartDate.Split('-')[0];
            string ed = mCendDate.Split('-')[2] + "/" + mCendDate.Split('-')[1] + "/" + mCendDate.Split('-')[0];
            if (lstMCheader != null && lstMCheader.Count > 0)
            {
                sbTableContent.Append("<div id='MC'>");
                sbTableContent.Append("<div class='dvHeader' id='spnMcreport'>");
                sbTableContent.Append("<div class='dvheader-inner'>Marketing Campaign Report For the Period of " + st + " " + "to" + " " + ed + "</div>");

                if (viewFormat == "1")
                {
                    sbTableContent.Append("<div class='helpIconRpt'>");
                    sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('MC_Report','HEADER')\" />");
                    sbTableContent.Append("</div>");
                }
                sbTableContent.Append("</div>");


                sbTableContent.Append("<table id='tblMCReport' class='table table-striped' >");
                sbTableContent.Append("<thead class='active'>");
                sbTableContent.Append("<tr><td valign='top' align='center' colspan='2'>Campaign Header </td> </tr>");
                sbTableContent.Append("</thead>");

                sbTableContent.Append("<tr><td valign='top' align='left' >Campaign Name </td><td valign='top'  align='left'>" + lstMCheader[0].Campaign_Name + "</td></tr>");
                sbTableContent.Append("<tr><td valign='top'  align='left'>Transaction Date </td><td valign='top'  align='left'>" + lstMCheader[0].Transaction_Date + "</td></tr>");

                sbTableContent.Append("<tr><td valign='top' align='left'>Customer Count </td><td valign='top'  align='left'>" + lstMCheader[0].Customer_Count + "</td></tr>");
                int count = 0;
                count = Convert.ToInt32(lstchildRegion.Count) * Convert.ToInt32(lstMCheader[0].Customer_Count);
                sbTableContent.Append("<tr><td valign='top' align='left'>No. of Dr. Defined in camp. </td><td valign='top'  align='left'>" + count + "</td></tr>");
                string specialityName = "";
                string category = "";
                if (!string.IsNullOrEmpty(lstMCheader[0].Customer_Speciality))
                {
                    specialityName = lstMCheader[0].Customer_Speciality;
                    specialityName = specialityName.TrimEnd(' ');
                    specialityName = specialityName.TrimEnd(',');
                }
                if (!string.IsNullOrEmpty(lstMCheader[0].Customer_Category))
                {
                    category = lstMCheader[0].Customer_Category;
                    category = category.TrimEnd(' ');
                    category = category.TrimEnd(',');
                }
                sbTableContent.Append("<tr class='GridRowNew'><td valign='top' align='left' >Category Name</td><td valign='top'  align='left'>" + category + "</td></tr>");
                sbTableContent.Append("<tr class='GridAlternativeRowNew'><td valign='top' align='left'>Speciality Name </td><td valign='top' align='left' >" + specialityName + "</td></tr>");

                if (!string.IsNullOrEmpty(lstMCheader[0].Start_Date))
                {

                    sbTableContent.Append("<tr class='GridRowNew'><td valign='top' align='left'>Start Date</td><td valign='top' align='left'>" + lstMCheader[0].Start_Date + "</td></tr>");
                    sbTableContent.Append("<tr class='GridAlternativeRowNew'><td valign='top'  align='left'>End Date </td><td valign='top' align='left'>" + lstMCheader[0].End_Date + "</td></tr>");

                }
                else
                {

                    sbTableContent.Append("<tr class='GridRowNew'><td valign='top' align='left' >Planned Date</td><td valign='top'  align='left'>" + lstMCheader[0].End_Date + "</td></tr>");
                }
                sbTableContent.Append("</table></td></tr>");


                //Campaign Details

                lstMCProductdetail = (List<MVCModels.HiDoctor_Reports.CampaignProductModel>)_objReport.GetcampaignProductdetail(companyCode, campaignCode);

            }


            string subProduct = "";
            string subQty = "";
            string subVisitOrder = "";
            int rowNo = 0;

            if (lstMCProductdetail != null && lstMCProductdetail.Count > 0)
            {
                sbTableContent.Append("<tr><td style='width: 100%' align='left'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/gr.png' id='imggr' style='float: left; cursor: pointer; color: white' onclick='fnExpand(tbl_1);'>Product Details");
                sbTableContent.Append("</td></tr><tr><td style='width: 100%'> <table id='tbl_1'  style='display:none' class='table table-striped'>");
                sbTableContent.Append("<thead class='active'>");
                sbTableContent.Append("<tr ><td align='center' colspan='4'>Product Details</td> </tr>");
                sbTableContent.Append("<tr><td >Sales Product Name</td><td valign='top' align='left'>Sample Product Name</td> <td valign='top' align='left'> Quantity</td> <td valign='top' align='left'> Visit Order</td> </tr></thead>");
                var lstDistSaleproduct = lstMCProductdetail.Select(x => new { x.Sales_Product, x.Sales_Code }).Distinct().ToList();
                foreach (var product in lstDistSaleproduct)
                {

                    var lstsample = lstMCProductdetail.AsEnumerable().Where(x => x.Sales_Code == product.Sales_Code).ToList();
                    //  drFilter = dsCampaignDetail.Tables[0].Select("Sales_Code ='" + dr["Sales_Code"].ToString() + "'");
                    if (lstsample.Count > 0)
                    {
                        subProduct = "<table> ";
                        subQty = "<table> ";
                        subVisitOrder = "<table>";

                        foreach (var drSub in lstsample)
                        {
                            subProduct += "<tr ><td >" + drSub.Sample_product + "</td></tr>";
                            subQty += "<tr ><td >" + drSub.Quantity + "</td></tr>";
                            subVisitOrder += "<tr ><td >" + drSub.Visit_Order + "</td></tr>";
                        }
                        subProduct += "</table> ";
                        subQty += "</table> ";
                        subVisitOrder += "</table>";
                    }
                    else
                    {
                        subProduct = "";
                        subQty = "";
                        subVisitOrder = "";

                    }
                    rowNo++;


                    sbTableContent.Append("<tr><td valign='top' align='left'> " + product.Sales_Product + "</td><td valign='top' align='left'> " + subProduct + "</td><td valign='top' align='center'> " + subQty + "</td><td valign='top' align='center'> " + subVisitOrder + "</td></tr> ");
                }
                sbTableContent.Append("</table></td></tr>");
            }



            string startDate = string.Empty;
            string endDate = string.Empty;
            string regionCodes = string.Empty;
            string regioncode = string.Empty;
            int mappedDrCount = 0, missedDrCount = 0, visitedDrCount = 0, plannedDrCount = 0;

            if (!string.IsNullOrEmpty(lstMCheader[0].Start_Date) && !string.IsNullOrEmpty(lstMCheader[0].Start_Date))
            {
                startDate = lstMCheader[0].Start_Date.ToString().Split('/')[2] + "-" + lstMCheader[0].Start_Date.ToString().Split('/')[1] + "-" + lstMCheader[0].Start_Date.ToString().Split('/')[0];
                endDate = lstMCheader[0].End_Date.ToString().ToString().Split('/')[2] + "-" + lstMCheader[0].End_Date.ToString().ToString().Split('/')[1] + "-" + lstMCheader[0].End_Date.ToString().ToString().Split('/')[0];
            }
            else
            {
                startDate = "";
                endDate = "";
            }

            foreach (var region in lstchildRegion)
            {
                regioncode += region.Region_Code + ",";
            }

            if (!string.IsNullOrEmpty(regioncode))
            {
                regionCodes = regioncode;
            }
            else
            {
                regionCodes = "''";
            }

            List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> lstDoctorDetail = new List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>();
            lstDoctorDetail = (List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>)_objReport.GetDoctorDetail(companyCode, regionCodes, campaignCode, startDate, endDate, lstMCheader[0].Planned_Dates);
            foreach (var DoctorDetail in lstDoctorDetail)
            {


                if (lstchildRegion.Count > 0)
                {
                    sbTableContent.Append("<tr><td><table id='tblMCDoctorReport' class='table table-striped'>");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='width: 100%' ><td valign='top' align='center' colspan='6'> Campaign Details </td> </tr>");
                    sbTableContent.Append("<tr><td valign='top' align='left'>User Name</td><td valign='top' align='left'>Region Name</td> <td valign='top' align='left'>No. of Dr. Defined in camp.</td> ");
                    sbTableContent.Append("<td valign='top' align='left'>Dr.planned in Dr.prod  mapping</td><td valign='top' align='left'>Dr.visited</td> <td valign='top' align='left'>Dr.missed</td></tr> ");
                    sbTableContent.Append("</thead>");

                    foreach (var region in lstchildRegion)
                    {
                        sbTableContent.Append("<tr ><td ><span onclick='fnShowPopup(\"" + region.Region_Code + "_" + startDate + "_" + endDate + "_" + lstMCheader[0].Planned_Dates + "_" + campaignCode + "\")' style='text-decoration:underline;cursor:pointer'>" + region.User_Name + "</span></td>");
                        sbTableContent.Append("<td valign='top' align='left'>" + region.Region_Name + "</td>");
                        sbTableContent.Append("<td valign='top' align='center'>" + lstMCheader[0].Customer_Count + "</td>");
                        plannedDrCount += Convert.ToInt32(lstMCheader[0].Customer_Count);

                        List<MCPlannedDoctosModel> drMappedDrFilter = DoctorDetail.lstDrplannedDetail.Where(dr => dr.Region_Code == region.Region_Code).ToList();
                        if (drMappedDrFilter.Count > 0)
                        {
                            sbTableContent.Append("<td valign='top' align='center'>" + drMappedDrFilter.Count + "</td>");
                            mappedDrCount += Convert.ToInt32(drMappedDrFilter.Count);

                        }
                        else
                        {
                            sbTableContent.Append("<td valign='top' align='center'>0</td>");
                        }
                        List<MCdoctorVisitedModel> drVisitedDrFilter = DoctorDetail.lstDrVistedDetail.Where(dr => dr.Region_Code == region.Region_Code).ToList();
                        int temp = 0;
                        int missedDoctor = 0, visitedDoctor = 0;
                        foreach (var mapped in drMappedDrFilter)
                        {
                            temp = 0;

                            foreach (var visit in drVisitedDrFilter)
                            {

                                if (!string.IsNullOrEmpty(visit.Doctor_Code))
                                {
                                    if (visit.Doctor_Code.Equals(mapped.Customer_Code))
                                    {
                                        temp++;
                                    }
                                }

                            }
                            if (temp != 0)
                            {
                                visitedDoctor++;

                                visitedDrCount++;


                            }
                            else
                            {
                                missedDoctor++;
                                missedDrCount++;

                            }
                        }
                        sbTableContent.Append("<td valign='top' align='center'>" + visitedDoctor + "</td>");
                        sbTableContent.Append("<td valign='top' align='center'>" + missedDoctor + "</td></tr>");
                    }


                    sbTableContent.Append("<tr><td valign='top' colspan='2'>Total</td><td valign='top' align='center'>" + plannedDrCount + "</td> <td valign='top' align='center'>" + mappedDrCount + "</td> ");
                    sbTableContent.Append("<td valign='top' align='center'>" + visitedDrCount + "</td> <td valign='top' align='center'>" + missedDrCount + "</td> </tr></table></td></tr></table>");
                }
                else
                {
                    sbTableContent.Append("No data found");
                }
            }
            return sbTableContent;
        }
        //mc heder popup
        public string GetMcpopup(string regionCode, string startDate, string endDate, string campaignCode, string plannedDate)
        {

            StringBuilder sbTableContent = new StringBuilder();

            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> lstDoctorDetail = new List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>();
            lstDoctorDetail = (List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>)_objReport.GetDoctorDetailPopup(companyCode, regionCode, campaignCode, startDate, endDate, plannedDate);

            sbTableContent.Append("<tr><td><table id='tblMCDoctorReport' class='table table-striped'>");
            sbTableContent.Append("<thead class='active'>");
            sbTableContent.Append("<tr>");
            sbTableContent.Append("<td>Doctor</td>");
            sbTableContent.Append("<td>MDL No/SVL No</td>");
            sbTableContent.Append("<td>Category</td>");
            sbTableContent.Append("<td>Speciality</td>");
            sbTableContent.Append("<td>Dcr Date</td>");
            sbTableContent.Append("<td>Product Name</td>");
            sbTableContent.Append("<td>Quantity</td></tr>");
            sbTableContent.Append("</thead>");
            int temp = 0;
            ArrayList nonVisited = new ArrayList();
            if (lstDoctorDetail.Count > 0)
            {
                foreach (var item in lstDoctorDetail)
                {
                    foreach (var DrplannedDetail in item.lstDrplannedDetail)
                    {
                        temp = 0;
                        foreach (var DrVistedDetail in item.lstDrVistedDetail)
                        {

                            if (!string.IsNullOrEmpty(DrVistedDetail.Doctor_Code))
                            {
                                if (DrVistedDetail.Doctor_Code.Equals(DrplannedDetail.Customer_Code))
                                {
                                    sbTableContent.Append("<tr class='dv_" + DrVistedDetail.Doctor_Code + "'><td>" + DrVistedDetail.Doctor_Name + "</td>");
                                    temp++;
                                    sbTableContent.Append("<td>" + DrVistedDetail.MDL_Number + "</td>");
                                    sbTableContent.Append("<td>" + DrVistedDetail.Category_Name + "</td>");
                                    sbTableContent.Append("<td>" + DrVistedDetail.Speciality_Name + "</td>");
                                    sbTableContent.Append("<td>" + DrVistedDetail.DCR_Date + "</td>");
                                    sbTableContent.Append("<td>" + DrVistedDetail.Product_Name + "</td>");
                                    sbTableContent.Append("<td>" + DrVistedDetail.Quantity_Provided + "</td></tr>");
                                }
                            }
                        }
                        if (temp == 0)
                        {
                            nonVisited.Add(DrplannedDetail.Customer_Name + "_" + DrplannedDetail.Category_Name + "_" + DrplannedDetail.Speciality_Name + "_" + DrplannedDetail.MDL_Number);
                        }
                    }

                    if (nonVisited.Count > 0)
                    {
                        foreach (string nonvisitDoctor in nonVisited)
                        {
                            sbTableContent.Append("<tr><td style='color:red'>" + nonvisitDoctor.Split('_')[0] + "</td>");
                            sbTableContent.Append("<td  style='color:red'>" + nonvisitDoctor.Split('_')[3] + "</td>");
                            sbTableContent.Append("<td  style='color:red'>" + nonvisitDoctor.Split('_')[1] + "</td>");
                            sbTableContent.Append("<td  style='color:red'>" + nonvisitDoctor.Split('_')[2] + "</td>");
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td></tr>");
                        }

                    }

                }
            }
            else
            {
                sbTableContent.Append("No data found");
            }
            return sbTableContent.ToString();
        }

        //************************************************************Marketing Campaing Report End**********************************************//


        //************************************************************Employee Leave Taken Report start**********************************************//




        public string GetEmployeeLeaveDetailFormat(string userCode, string startDate, string endDate, string viewFormat, string Report)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetEmployeeLeaveReportDetail(userCode, startDate, endDate, Report, viewFormat);
                }
                else
                {
                    string DCREmpLeaveTable = GetEmployeeLeaveReportDetail(userCode, startDate, endDate, Report, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "Employee Leave Taken Report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCREmpLeaveTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:Report", Report);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }


        private StringBuilder GetEmployeeLeaveReportDetail(string userCode, string startDate, string endDate, string Report, string viewFormat)
        {

            StringBuilder sbTableContent = new StringBuilder();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();

            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                string userCodes = string.Empty;
                string userCodecount = string.Empty;
                if (Report.ToString() == "MAIN")
                {
                    List<MVCModels.HiDoctor_Reports.TPStatusReport> lstchildusers = new List<MVCModels.HiDoctor_Reports.TPStatusReport>();

                    lstchildusers = (List<MVCModels.HiDoctor_Reports.TPStatusReport>)_objReport.GetchildUsers(companyCode, userCode);

                    foreach (var user in lstchildusers)
                    {
                        userCodecount += user.User_Code + ",";
                    }

                    if (!string.IsNullOrEmpty(userCodecount))
                    {
                        userCodes = userCodecount;
                    }
                }
                else
                {
                    userCodes = userCode + ",";
                }
                List<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel> lstEmpleaveDetail = new List<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel>();
                lstEmpleaveDetail = (List<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel>)_objReport.GetEmployeeLeavedetail(companyCode, userCodes, startDate, endDate);

                string st = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string ed = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];

                if (lstEmpleaveDetail != null && lstEmpleaveDetail.Count > 0)
                {
                    sbTableContent.Append("<div id='EmployeeLeave'>");
                    sbTableContent.Append("<div class='dvHeader' id='spnEmployeeLeave'>");
                    sbTableContent.Append("<div class='dvheader-inner'>Employee Leave Taken For the Period of " + st + " " + "to" + " " + ed + "</div>");
                    sbTableContent.Append("<div style='float:left;width:100%'>");
                    sbTableContent.Append("<div style='width: 30%;margin-top:4%'>");
                    sbTableContent.Append("<img style='display: inline;margin-left=35px;' src='Images/Company_Logo/" + _objCurInfo.GetSubDomain() + ".jpg'>");
                    sbTableContent.Append("</div>");
                    sbTableContent.Append("</div>");
                    if (viewFormat == "1")
                    {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('EMPLOYEE_LEAVE','HEADER')\" />");
                        sbTableContent.Append("</div>");
                    }
                    sbTableContent.Append("</div>");

                    sbTableContent.Append("<table id='tblEmpleaveReport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    // sbTableContent.Append("<tr colspan='2'>Company Name</tr>");
                    sbTableContent.Append("<tr><td>Employee Name </td>");
                    sbTableContent.Append("<td>User Name</td>");
                    sbTableContent.Append("<td>User Type Name</td>");
                    sbTableContent.Append("<td>Region Name</td>");
                    sbTableContent.Append("<td>Employee No</td>");
                    sbTableContent.Append("<td>Date of application of leave</td>");
                    sbTableContent.Append("<td>DCR Date</td>");
                    sbTableContent.Append("<td>Leave Type Name</td>");
                    sbTableContent.Append("<td>Reason</td>");
                    sbTableContent.Append("<td>Manager User Name</td>");
                    sbTableContent.Append("<td>Manager Employee Name</td>");
                    sbTableContent.Append("<td>Reason for Approval/Unapproval</td>");
                    sbTableContent.Append("<td>Status</td></tr>");
                    sbTableContent.Append("</thead>");
                    foreach (var LeaveDetail in lstEmpleaveDetail)
                    {
                        //sbTableContent.Append("<tr><td>" + LeaveDetail.Company_Name + "</td></tr>");
                        sbTableContent.Append("<tr><td>" + LeaveDetail.Employee_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.User_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.User_Type_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Region_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Employee_Number + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Entered_Date + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.From_Date + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Leave_Type_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Reason + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Reports_User_Name + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Manager_Name + "</td>");

                        string unapprovereason = ((string.IsNullOrEmpty(LeaveDetail.Unapproval_Reason)) ? "" : LeaveDetail.Unapproval_Reason.ToString());
                        unapprovereason = unapprovereason.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                        unapprovereason = unapprovereason.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                        unapprovereason = unapprovereason.Replace("~", " - ");//.replace(/~/g, ' - ');

                        sbTableContent.Append("<td>" + unapprovereason + "</td>");
                        sbTableContent.Append("<td>" + LeaveDetail.Status + "</td></tr>");
                    }

                }
                else
                {
                    sbTableContent.Append("No Data Found");
                }
                return sbTableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartDate", startDate);
                dicContext.Add("Filter:EndDate", endDate);
                dicContext.Add("Filter:Report", Report);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;

            }
        }


        //************************************************************Employee Leave Taken Report End**********************************************//





        #region Daily call status Report
        //---------------------------START - DAILY CALL STATUS REPORT----------------------------------//
        /// <summary>
        /// Method is Used to Download the Excel
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="viewFormat"></param>
        /// <param name="status"></param>
        /// <returns></returns>

        public string GetDailyCallStatusDetails(string regionCode, string viewFormat, string dcrStatus, string Month, string Year, string Days, string title, string SelectedUser)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string startDate = Year + "-" + Month + "-" + "01";
                string endDate = Year + "-" + Month + "-" + Days.ToString();
                string alRegionCodes = string.Empty;
                string dcrcheckedStatus = "";
                dcrcheckedStatus = dcrStatus + ',';
                int monthName = Convert.ToInt32(Month);
                int YearName = Convert.ToInt32(Year);
                List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> lstdailyCallstatus = _objRR.GetDoctorCallCountDetails(companyCode, regionCode, monthName, YearName, dcrcheckedStatus).ToList();

                if (viewFormat == "S")
                {
                    strTb = GetDailyCallStatusReport(lstdailyCallstatus, regionCode, startDate, endDate, Month, Year, dcrcheckedStatus, viewFormat, title, SelectedUser);
                }
                else
                {
                    string lastSubmittedTable = GetDailyCallStatusReport(lstdailyCallstatus, regionCode, startDate, endDate, Month, Year, dcrcheckedStatus, viewFormat, title, SelectedUser).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Daily_Call_Status_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("Month", Month);
                dicContext.Add("Year", Year);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("status", dcrStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetDailyCallStatusReport(List<DocotrCallCountModel> lstdailyCallstatus, string regionCode, string startDate, string endDate, string selectMonth, string selectYear, string dcrcheckedStatus, string viewFormat, string title, string SelectedUser)
        {
            StringBuilder strTableRept = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            BLUser _objUser = new BLUser();
            string monthName = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt32(selectMonth));
            List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), "", regionCode).ToList();
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
            string generateHeaderTable = _objUser.GetReportHeaderTableString(_objCurrentInfo.GetCompanyCode(), "", monthName, selectYear, seleceddcrstatus, regionCode).ToString();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurrentInfo.GetCompanyCode();
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

                List<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstChildUser = _objRR.GetChildUser(companyCode).ToList();
                List<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstregionCodes = _objRR.GetRegionCode(companyCode, regionCode).ToList();

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
                    strTableRept.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr><th align='left' valign='top'>S.No</th>");
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
                            List<MVCModels.HiDoctor_Reports.HolidayDetailsModel> lstHolidayDetails = _objRR.GetHolidayDetails(companyCode, regioncodes.Region_Code, startDate, endDate).ToList();
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
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("dcrcheckedStatus", dcrcheckedStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
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

        //---------------------------END - DAILYCALL STATUS REPORT------------------------------------//
        #endregion Daily call status Report

        //---------------------------START - CPCOVERAGEANDDEVIATION REPORT------------------------------------//
        public string GetCpCoverageandDeviationDetails(string userCode, string order, string dcrStatus, string Month, string Year, string Days, string viewFormat, string title)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                BLUser _objUser = new BLUser();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string startDate = Year + "-" + Month + "-" + "01";
                string endDate = Year + "-" + Month + "-" + Days.ToString();
                DateTime privMonth = new DateTime();
                privMonth = Convert.ToDateTime(startDate);
                privMonth = privMonth.AddMonths(-1);
                string prevMonthstart = privMonth.Year.ToString() + "-" + privMonth.Month.ToString() + "-01";
                string dcrcheckedStatus = "";
                string regionCode = "";
                dcrcheckedStatus = dcrStatus + ',';


                List<MVCModels.HiDoctor_Master.UserModel> lstRegioncode = _objUser.GetSingleUserInfo(companyCode, userCode, regionCode).ToList();
                List<MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel> lstCpcoverageandDeviation = _objRR.GetCpCoverageandDeviation(companyCode, userCode, lstRegioncode[0].Region_Code, startDate, prevMonthstart, endDate, dcrcheckedStatus).ToList();

                if (viewFormat == "S")
                {
                    strTb = GetCPCoverageandDeviationReport(lstCpcoverageandDeviation, companyCode, userCode, order, Days, startDate, endDate, privMonth, prevMonthstart, dcrcheckedStatus, Month, Year, viewFormat, title);
                }
                else
                {
                    string lastSubmittedTable = GetCPCoverageandDeviationReport(lstCpcoverageandDeviation, companyCode, userCode, order, Days, startDate, endDate, privMonth, prevMonthstart, dcrcheckedStatus, Month, Year, viewFormat, title).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Cp_Coverage_and_deviation_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("order", order);
                dicContext.Add("Month", Month);
                dicContext.Add("Year", Year);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("status", dcrStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }


        public StringBuilder GetCPCoverageandDeviationReport(List<CPCoverageandDeviationModel> lstCpcoverageandDeviation, string companyCode, string userCode, string order, string Days, string startDate, string endDate, DateTime privMonth, string prevMonthstart, string dcrcheckedStatus, string selectMonth, string selectYear, string viewFormat, string title)
        {
            BLUser _objUser = new BLUser();
            string day = "";
            int lastMonthEnterdCp = 0;
            int cpCount = 0;
            string regionCode = "";
            try
            {
                StringBuilder strTable = new StringBuilder();
                DateTime dtStartDate = new DateTime();
                DateTime dtEndDate = new DateTime();
                TimeSpan ts;

                dtStartDate = Convert.ToDateTime(startDate);
                dtEndDate = Convert.ToDateTime(endDate);
                DateTime dtDCRDate = dtStartDate;
                ts = dtEndDate - dtStartDate;

                string[] dayNames = Enum.GetNames(typeof(DaysInName));
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(companyCode, userCode, regionCode).ToList();
                string monthName = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt32(selectMonth));
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
                string generateHeaderTable = _objUser.GetReportHeaderTableString(companyCode, userCode, monthName, selectYear, seleceddcrstatus, "").ToString();
                //Bind The Table
                if (lstCpcoverageandDeviation[0].lstApprovedCpCount != null && lstCpcoverageandDeviation[0].lstApprovedCpCount.Count() > 0)
                {
                    strTable.Append("<div id='CpCoverageandDeviationReport'>");
                    strTable.Append("<div class='dvHeader' id='spncpCoverageanddeviationReport'>");
                    int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(selectYear), Convert.ToInt32(selectMonth));
                    strTable.Append("<div class='dvheader-inner'><b>" + title + " Report of " + lstUserInfo[0].User_Name + " for the month of " + monthName + "- " + selectYear + "</b></div>");
                    if (viewFormat == "S")
                    {
                        strTable.Append("<div class='helpIconRpt'>");
                        strTable.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('Cp_Coverage_and_Deviation','HEADER')\" />");
                        strTable.Append("</div>");
                    }
                    strTable.Append("</div>");
                    if (lstUserInfo.Count() > 0)
                    {
                        strTable.Append("<div> " + generateHeaderTable + " </div>");
                    }
                    strTable.Append("<table id='tblCpcoverageandDeviation' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead class='active'><tr><th>Accompanist Name</th><th>CP Name</th>");
                    strTable.Append("<th> Num of times CP used in Last Month</th><th>Num of times CP Used</th>");
                    //Bind the Header By the Name Wise
                    if (order.ToUpper() == "DAY")
                    {
                        for (int j = 0; j < dayNames.Length; j++)
                        {
                            day = dayNames[j].Substring(0, 3);
                            strTable.Append("<th valign='top' align='left'>Num of doctors from this CP on  " + day + " </th>");
                        }
                    }
                    //Bind the Header by Day wise
                    else
                    {
                        dtDCRDate = dtStartDate;
                        for (int k = 0; k <= ts.Days; k++)
                        {
                            if (k != 0)
                            {
                                dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                            }
                            day = dtDCRDate.Day.ToString();

                            strTable.Append("<th valign='top' align='left'> " + day + " </th>");
                        }
                    }
                    strTable.Append("</tr></thead><tbody>");

                    int Rowcount = 0;

                    foreach (var lstcpName in lstCpcoverageandDeviation[0].lstApprovedCpCount)
                    {
                        Rowcount++;
                        strTable.Append("<tr id=" + Rowcount + ">");
                        //Accompanist Name
                        strTable.Append("<td valign='top' align='left'>");
                        strTable.Append(lstcpName.Acc1_Name);
                        strTable.Append("</td>");
                        //Cp Name
                        strTable.Append("<td valign='top' align='left'> " + lstcpName.CP_name + " </td>");
                        //Last Month Entered CP in DCR
                        var filterDCRmonth = lstCpcoverageandDeviation[0].lstDCREnteredCpDetails.Where(p => p.CP_code == lstcpName.CP_code && p.Month == privMonth.Month.ToString()).ToList();
                        if (filterDCRmonth.Count() > 0)
                        {
                            strTable.Append("<td valign='top' align='left'> " + filterDCRmonth.Count + " </td>");
                            lastMonthEnterdCp += Convert.ToInt32(filterDCRmonth.Count());
                        }
                        else
                        {
                            strTable.Append("<td valign='top' align='left'>0</td>");
                        }
                        //Current Monthe Entered CP in DCR
                        filterDCRmonth = lstCpcoverageandDeviation[0].lstDCREnteredCpDetails.Where(s => s.CP_code == lstcpName.CP_code && s.Month == selectMonth && s.Year == selectYear).ToList();
                        if (filterDCRmonth.Count() > 0)
                        {
                            strTable.Append("<td valign='top' align='left'> " + filterDCRmonth.Count() + " </td>");
                            cpCount += Convert.ToInt32(filterDCRmonth.Count());
                        }
                        else
                        {
                            strTable.Append("<td valign='top' align='left'>0</td>");
                        }
                        //Day Name wise Create the Table
                        string doctorCount = string.Empty;
                        if (order.ToUpper() == "DAY")
                        {
                            for (int i = 0; i < dayNames.Length; i++)
                            {
                                doctorCount = "";
                                if (filterDCRmonth.Count() > 0)
                                {
                                    foreach (var DCRMonth in filterDCRmonth)
                                    {
                                        if (DCRMonth.Day.ToUpper() == dayNames[i].ToString().ToUpper())
                                        {
                                            var filterCpDoctorVisit = lstCpcoverageandDeviation[0].lstDoctorvisitcount.Where(k => k.CP_code == lstcpName.CP_code && k.Days == DCRMonth.Days).ToList();
                                            doctorCount += DCRMonth.Days.ToString() + " ( " + filterCpDoctorVisit.Count() + " ),";
                                        }
                                    }
                                    if (doctorCount != "")
                                    {
                                        doctorCount = doctorCount.Trim(',');
                                    }
                                    strTable.Append("<td valign='top' align='left'> " + doctorCount + " </td>");
                                }
                                else
                                {
                                    strTable.Append("<td valign='top' align='left'> &nbsp; </td>");
                                }
                            }
                        }
                        //day wise create table
                        else
                        {
                            dtDCRDate = dtStartDate;
                            for (int i = 0; i <= ts.Days; i++)
                            {
                                if (i != 0)
                                {
                                    dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                                }
                                day = dtDCRDate.Day.ToString();
                                var filterDoctorCount = lstCpcoverageandDeviation[0].lstDoctorvisitcount.Where(p => p.CP_code == lstcpName.CP_code && p.Days == day).ToList();
                                if (filterDoctorCount.Count() > 0)
                                {
                                    strTable.Append("<td valign='top' align='left'> " + filterDoctorCount.Count() + " </td>");
                                }
                                else
                                {
                                    strTable.Append("<td valign='top' align='left'> &nbsp; </td>");
                                }
                            }
                        }
                        strTable.Append("</tr>");
                    }
                    //Day wise Create the Table
                    strTable.Append("<tr>");
                    strTable.Append("<td valign='top' align='right' style='nowrap;' colspan='2'>Total</td>");
                    strTable.Append("<td valign='top' align='centre' style='nowrap;'> " + lastMonthEnterdCp + " </td>");
                    strTable.Append("<td valign='top' align='centre' style='nowrap;'> " + cpCount + " </td>");
                    if (order.ToUpper() == "DAY")
                    {
                        strTable.Append("<td valign='top' align='centre' style='nowrap;' colspan ='" + Days.Length + "'> &nbsp; </td></tr>");
                    }
                    else
                    {
                        strTable.Append("<td valign='top' align='centre' style='nowrap;'  colspan ='" + (ts.Days + 1) + "'>&nbsp;</td></tr>");
                    }
                }

                else
                {
                    strTable.Append("No Records To Display");
                }
                strTable.Append("</tbody>");
                strTable.Append("</table>");

                return strTable;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("order", order);
                dicContext.Add("Days", Days);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("prevMonthstart", prevMonthstart);
                dicContext.Add("dcrStatus", dcrcheckedStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }

        }
        //---------------------------END - CPCOVERAGEANDDEVIATION REPORT------------------------------------//

        //----------------------------START - SPECIALITY COVERAGE ANALYSIS ----------------------------------------//
        public string GetSpecialityCoverageAnalysis(string userCode, string userName, string startDate, string endDate, string isExcel, string dcrStatus)
        {
            try
            {
                MVCModels.HiDoctor_Reports.SpecialityCoverageAnalysis objSC = new MVCModels.HiDoctor_Reports.SpecialityCoverageAnalysis();

                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();
                StringBuilder sbTbl = new StringBuilder();

                objSC = _objBL_ReportRegion.GetSpecialityCoverageAnalysis(_objCurrentInfo.GetCompanyCode(), userCode, startDate, endDate, dcrStatus);

                if (objSC != null && objSC.lstDocCount != null && objSC.lstDocCount.Count > 0)
                {
                    ArrayList monthlist = new ArrayList();
                    DateTime dtTemp;
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

                    string dcrStatusstring = dcrStatus.TrimEnd(',');
                    dcrStatusstring = dcrStatusstring.Replace("1", "Applied");
                    dcrStatusstring = dcrStatusstring.Replace("2", "Approved");
                    dcrStatusstring = dcrStatusstring.Replace("3", "Drafted");
                    dcrStatusstring = dcrStatusstring.Replace("0", "Unapproved");

                    sbTbl.Append("<div class='col-lg-12' style='font-size:14px;font-weight:bold;' align='left'>Speciality Coverage Analysis for " + userName + " in the period of " + dtStartDate.ToString("dd/MM/yyyy") + " - " + dtEndDate.ToString("dd/MM/yyyy") + " and for the DCR status " + dcrStatusstring + "</div>");
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblSpecialityCoverage' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left' colspan='2'></th>");
                    sbTbl.Append("<th align='left' colspan='" + monthlist.Count + "'>Visit No's</th>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th align='left'>Speciality</th>");
                    sbTbl.Append("<th align='left'>No.of Doctors in SVL</th>");
                    foreach (string monthName in monthlist)
                    {
                        sbTbl.Append("<th align='left'>" + monthName.Split('_')[0] + '_' + monthName.Split('_')[2] + "</th>");
                    }
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("</div>");

                    int[] totalCount = new int[monthlist.Count];
                    int totalDocCount = 0;
                    foreach (var spec in objSC.lstDocCount)
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + spec.Speciality_Name + "</td>");
                        sbTbl.Append("<td align='right'>" + spec.Doctor_Count.ToString() + "</td>");
                        totalDocCount += spec.Doctor_Count;

                        if (objSC.lstDocVisitCount != null)
                        {
                            int s = 0;
                            foreach (string monthName in monthlist)
                            {
                                var docVisit = objSC.lstDocVisitCount.AsEnumerable().Where(x => x.Speciality_Name == spec.Speciality_Name && x.Month == Convert.ToInt32(monthName.Split('_')[1]) && x.Year == Convert.ToInt32(monthName.Split('_')[2])).SingleOrDefault();
                                if (docVisit != null)
                                {
                                    sbTbl.Append("<td align='right'>" + docVisit.Doctor_Visit_Count + "</td>");
                                    totalCount[s++] += docVisit.Doctor_Visit_Count;
                                }
                                else
                                {
                                    sbTbl.Append("<td align='right'>0</td>");
                                    totalCount[s++] += 0;
                                }
                            }
                        }
                        else
                        {
                            foreach (string monthName in monthlist)
                            {
                                sbTbl.Append("<td align='right'>0</td>");
                            }
                        }
                        sbTbl.Append("</tr>");
                    }
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>Total</td><td align='right'>" + totalDocCount + "</td>");
                    int tot = 0;
                    foreach (string monthName in monthlist)
                    {
                        sbTbl.Append("<td align='right'>" + totalCount[tot++].ToString() + "</td>");
                    }
                    sbTbl.Append("</tr>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Speciality found for this input details.</div>");
                }

                if (isExcel == "Y")
                {
                    string blobUrl = string.Empty;

                    //sbTableContentExcel.Append(sbTbl.ToString());

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string curuserName = _objCurrentInfo.GetUserName();
                    string subDomin = _objCurrentInfo.GetSubDomain();
                    string fileName = "SpecialityCoverageAnalysis_" + "_" + subDomin + "_" + curuserName + ".xls";

                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTbl.ToString(), accKey, fileName, "bulkdatasvc");

                    return blobUrl;
                }
                else
                {
                    return sbTbl.ToString();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", userCode);
                dicContext.Add("stratDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("dcrStatus", dcrStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        //----------------------------END - SPECIALITY COVERAGE ANALYSIS   ----------------------------------------//

        //---------------------------START - SPECIALITY WISE DOCTOR CATEGORY COUNT ----------------------------------//
        public string GetSpecialitywiseDoctorcategoryCountdetails(string regionCode, string viewFormat, string title)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                BLUser _objUser = new BLUser();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();

                List<MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel> lstSpecialitywiseDoctorcategorycount = _objRR.GetSpecialitywiseDoctorCategoryCount(companyCode).ToList();

                if (viewFormat == "S")
                {
                    strTb = GetSpecialitywisedoctorcategorycountReport(lstSpecialitywiseDoctorcategorycount, regionCode, viewFormat, title);
                }
                else
                {
                    string lastSubmittedTable = GetSpecialitywisedoctorcategorycountReport(lstSpecialitywiseDoctorcategorycount, regionCode, viewFormat, title).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Specialitywise_Doctor_Category_Count_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetSpecialitywisedoctorcategorycountReport(List<SpecialityWiseDoctorCategoryCountModel> lstSpecialitywiseDoctorcategorycount, string regionCode, string viewFormat, string title)
        {
            int categoryCount;
            int colSpan = 0;
            ArrayList statesList = new ArrayList();
            StringBuilder strTable = new StringBuilder();
            string regionCodes = "";
            string currentRegionCode = "";
            string specialityCode = "";
            string categoryCode = "";
            string userName = "";
            string strEmpNm = "";
            int tempCount = 0;
            int spltyWiseTotal = 0;
            int grandTotal = 0;
            int regionTotal = 0;
            int rowCount = 0;
            bool isTrue = false;

            int[] categoryWiseTotal;
            int[] grandCategoryWiseTotal;
            int[] regionWiseCategory;


            BLUser _objUser = new BLUser();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string userCode = "";
            List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), userCode, regionCode).ToList();
            string generateHeaderTable = _objUser.GetReportHeaderTableString(_objCurrentInfo.GetCompanyCode(), userCode, "", "", "Enable", regionCode).ToString();
            List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel> lstRegionTypes = new List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel>();
            List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel> lstDistrictRegionType = new List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel>();
            List<MVCModels.HiDoctor_Reports.DoctorMasterModel> doctorMasterDetails = new List<MVCModels.HiDoctor_Reports.DoctorMasterModel>();
            categoryWiseTotal = new int[lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count()];
            grandCategoryWiseTotal = new int[lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count()];
            regionWiseCategory = new int[lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count()];

            //Used to calculate the total column
            int arrayLength = lstSpecialitywiseDoctorcategorycount[0].lstSpecialities.Count() * lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count();//Speciality count and CategoryCount
            arrayLength += lstSpecialitywiseDoctorcategorycount[0].lstSpecialities.Count(); // Total Category count
            arrayLength += lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count() + 1;//Total GrandTotal

            int[] regionTotalArr = new int[arrayLength];//Calculate the RegionalTotal
            int[] grandTotalArr = new int[arrayLength];//Calculate the GrandTotal

            try
            {
                lstRegionTypes = (List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel>)_objRR.GetRegionType(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                foreach (var regiontype in lstRegionTypes)
                {
                    if (regiontype.Region_Type_Name.ToString().ToUpper() == "STATE")
                    {
                        statesList.Add(regiontype.Region_Type_Name);
                    }
                }

                categoryCount = lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count();
                categoryCount++;
                strTable.Append("<div id='Specialitywise Doctor Category Count'>");
                strTable.Append("<div class='dvHeader' id='spnspecialitywiseDoctorcategorycountReport'>");
                if (lstUserInfo.Count() > 0)
                {
                    strTable.Append("<div class='dvheader-inner'><b>" + title + " of " + lstUserInfo[0].User_Name + "</b></div>");
                }
                else
                {
                    strTable.Append("<div class='dvheader-inner'><b>Vacant Region -" + title + " for this Region</b></div>");
                }
                if (viewFormat == "S")
                {
                    strTable.Append("<div class='helpIconRpt'>");
                    strTable.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('Speciality_Wise_Doctor_Category_Count_REPORT','HEADER')\" />");
                    strTable.Append("</div>");
                }

                strTable.Append("</div>");
                strTable.Append("<br/>");
                if (lstUserInfo.Count() > 0)
                {
                    strTable.Append("<div> " + generateHeaderTable + " </div>");
                }

                strTable.Append("<table id='tblspecialitywiseCount' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strTable.Append("<thead>");
                strTable.Append("<tr><th>Region</th><th>User Name</th><th>Employee Name</th>");

                foreach (var lstSpecialities in lstSpecialitywiseDoctorcategorycount[0].lstSpecialities)
                {
                    strTable.Append("<th align='center' colspan='" + categoryCount.ToString() + "'> " + lstSpecialities.Speciality_Name + " </th>");
                }

                for (int k = 0; k < lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count; k++)
                {
                    categoryWiseTotal[k] = 0;
                    grandCategoryWiseTotal[k] = 0;
                    regionWiseCategory[k] = 0;
                    strTable.Append("<th align='left' valign='top'>Total " + lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories[k].Category_Name + " </th>");
                }

                strTable.Append("<th>Grand Total</th></tr>");
                strTable.Append("<tr>");
                strTable.Append("<th colspan='3'></th>");
                foreach (var lstspeciality in lstSpecialitywiseDoctorcategorycount[0].lstSpecialities)
                {
                    foreach (var lstcategory in lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories)
                    {
                        strTable.Append("<th align='left' valign='top'> " + lstcategory.Category_Name + " </th>");
                        colSpan++;
                    }
                    strTable.Append("<th>Total</th>");
                    colSpan++;
                }

                foreach (var lstcatgories in lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories)
                {
                    strTable.Append("<th>&nbsp;</th>");
                    colSpan++;
                }
                strTable.Append("<th>&nbsp;</th></tr>");
                strTable.Append("</thead>");
                strTable.Append("<tbody>");
                colSpan = colSpan + 3;
                if (lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories != null && lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count() > 0)
                {
                    for (int i = 0; i < statesList.Count; i++)
                    {
                        isTrue = true;
                        strTable.Append("<tr>");
                        strTable.Append("<td align='left' valign='top'>Region</td>");
                        strTable.Append("<td align='left' valign='top' colspan='" + colSpan.ToString() + "'> " + statesList[i].ToString().Split('_')[0] + " </td>");
                        strTable.Append("</tr>");

                        foreach (var stateNode in lstRegionTypes)
                        {
                            if (stateNode.Region_Type_Name.ToUpper() == "AREA HQ")
                            {
                                regionCodes = "";
                                var subregioncode = stateNode.Region_Code;
                                lstDistrictRegionType = (List<MVCModels.HiDoctor_Reports.RegionTypeNamesModel>)_objRR.GetRegionType(_objCurrentInfo.GetCompanyCode(), subregioncode).ToList();
                                foreach (var lstregionCodes in lstDistrictRegionType)
                                {
                                    regionCodes += lstregionCodes.Region_Code + "^";
                                }
                                if (!string.IsNullOrEmpty(regionCodes))
                                {
                                    doctorMasterDetails = (List<MVCModels.HiDoctor_Reports.DoctorMasterModel>)_objRR.GetDoctormasterdetails(_objCurrentInfo.GetCompanyCode(), regionCodes).ToList();
                                }

                                strTable.Append("<tr>");
                                strTable.Append("<td  align='left' valign='top'>District</td>");
                                strTable.Append("<td align='left' valign='top' colspan='" + colSpan.ToString() + "'> " + stateNode.Region_Name + " </td>");
                                strTable.Append("</tr>");

                                foreach (var districtNode in lstDistrictRegionType)
                                {
                                    if (districtNode.Region_Type_Name.ToString().ToUpper() != "AREA HQ")
                                    {
                                        currentRegionCode = districtNode.Region_Code;
                                        rowCount++;
                                        spltyWiseTotal = 0;
                                        if (lstSpecialitywiseDoctorcategorycount[0].lstEmployess != null && lstSpecialitywiseDoctorcategorycount[0].lstEmployess.Count() > 0)
                                        {
                                            var rowFilter = lstSpecialitywiseDoctorcategorycount[0].lstEmployess.Where(p => p.Region_Code == currentRegionCode).ToList();
                                            if (rowFilter.Count > 0)
                                            {
                                                userName = rowFilter[0].User_Name.ToString();
                                                strEmpNm = rowFilter[0].Employee_Name.ToString();
                                            }
                                            else
                                            {
                                                userName = "VACANT_REGION";
                                                strEmpNm = "VACANT_REGION";
                                            }
                                        }
                                        else
                                        {
                                            userName = "VACANT_REGION";
                                            strEmpNm = "VACANT_REGION";
                                        }
                                        strTable.Append("<tr>");
                                        strTable.Append("<td align='left' valign='top'> " + districtNode.Region_Name + " </td>");//Region Name
                                        strTable.Append("<td align='left' valign='top'>" + userName + "</td>");//User Name
                                        strTable.Append("<td align='left' valign='top'>" + strEmpNm + "</td>");//Employee Name
                                        int grandTotal1 = 0;
                                        for (int j = 0; j < lstSpecialitywiseDoctorcategorycount[0].lstSpecialities.Count; j++)
                                        {
                                            specialityCode = lstSpecialitywiseDoctorcategorycount[0].lstSpecialities[j].Speciality_Code;

                                            spltyWiseTotal = 0;
                                            for (int k = 0; k < lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count(); k++)
                                            {
                                                categoryCode = lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories[k].Category_Code.ToString();
                                                var filter = doctorMasterDetails.Where(s => s.Region_Code == currentRegionCode && s.Category == categoryCode && s.Speciality_Code == specialityCode).ToList();
                                                spltyWiseTotal += filter.Count();
                                                tempCount = 0;
                                                categoryWiseTotal[k] += filter.Count();
                                                tempCount = grandCategoryWiseTotal[k] + filter.Count();
                                                grandCategoryWiseTotal[k] = tempCount;
                                                tempCount = Convert.ToInt16(regionWiseCategory[k].ToString().Trim()) + filter.Count();
                                                regionWiseCategory[k] = tempCount;
                                                grandTotal += filter.Count();
                                                regionTotal += filter.Count();

                                                strTable.Append("<td align='left' valign='top'> " + filter.Count().ToString() + " </td>"); //Individual Doctor category Visit Count
                                            }
                                            strTable.Append("<td  align='left' valign='top'> " + spltyWiseTotal.ToString() + " </td>"); // Total of Indeiviual Doctor category count
                                            grandTotal1 += spltyWiseTotal;
                                            spltyWiseTotal = 0;
                                        }
                                        //CategorywiseTotal and GrandTotal
                                        for (int j = 0; j < lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count(); j++)
                                        {
                                            strTable.Append("<td align='left' valign='top'> " + categoryWiseTotal[j].ToString().Trim() + " </td>"); //Total Doctor category count                          
                                            categoryWiseTotal[j] = 0;
                                        }
                                        strTable.Append("<td align='left' valign='top'> " + grandTotal1 + " </td>");//Grandtotal
                                        strTable.Append("</tr>");
                                    }
                                }
                                spltyWiseTotal = 0;
                                //District Total
                                strTable.Append("<td colspan='3' style='font:font-weight;' align='left' valign='top'>District Total</td>");

                                int arrayIndex = 0;

                                for (int j = 0; j < lstSpecialitywiseDoctorcategorycount[0].lstSpecialities.Count; j++)
                                {
                                    specialityCode = lstSpecialitywiseDoctorcategorycount[0].lstSpecialities[j].Speciality_Code;
                                    spltyWiseTotal = 0;
                                    foreach (var lstcategories in lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories)
                                    {
                                        categoryCode = lstcategories.Category_Code;
                                        var filter = doctorMasterDetails.Where(s => s.Category == categoryCode && s.Speciality_Code == specialityCode).ToList();

                                        spltyWiseTotal += filter.Count();

                                        strTable.Append("<td align='left' valign='top'> " + filter.Count() + " </td>");

                                        regionTotalArr[arrayIndex] += filter.Count();
                                        arrayIndex++;
                                    }

                                    regionTotalArr[arrayIndex] += spltyWiseTotal;
                                    arrayIndex++;

                                    strTable.Append("<td align='left' valign='top'> " + spltyWiseTotal + " </td>");
                                    spltyWiseTotal = 0;
                                }
                                //District total for Total dotor category
                                for (int k = 0; k < lstSpecialitywiseDoctorcategorycount[0].lstDoctorCateories.Count; k++)
                                {
                                    regionTotalArr[arrayIndex] += grandCategoryWiseTotal[k];
                                    arrayIndex++;

                                    strTable.Append("<td align='left' valign='top'> " + grandCategoryWiseTotal[k] + " </td>");
                                    grandCategoryWiseTotal[k] = 0;
                                }

                                regionTotalArr[arrayIndex] += grandTotal;
                                arrayIndex++;
                                //Grand District Total
                                strTable.Append("<td align='left' valign='top'> " + grandTotal.ToString() + " </td>");
                                grandTotal = 0;
                            }
                        }
                        regionCodes = "";
                        spltyWiseTotal = 0;
                        foreach (var stateNode in lstRegionTypes)
                        {
                            regionCodes += stateNode.Region_Code + "^";
                        }
                        if (!string.IsNullOrEmpty(regionCodes))
                        {
                            doctorMasterDetails = (List<MVCModels.HiDoctor_Reports.DoctorMasterModel>)_objRR.GetDoctormasterdetails(_objCurrentInfo.GetCompanyCode(), regionCodes).ToList();
                        }

                        strTable.Append("<tr>");
                        strTable.Append("<td colspan='3' align='left' valign='top'>Region Total</td>"); // Regional Total

                        int arrIndex = 0;
                        for (int index = 0; index < regionTotalArr.Length; index++)
                        {
                            strTable.Append("<td align='left' valign='top'> " + regionTotalArr[index] + " </td>");
                            grandTotalArr[arrIndex] += regionTotalArr[index];
                            arrIndex++;
                        }

                        regionTotal = 0;

                        strTable.Append("<tr>");
                        strTable.Append("<td align='left' valign='top' colspan='" + (colSpan + 1).ToString() + "'>&nbsp;</td>");
                        strTable.Append("</tr>");
                    }
                    regionCodes = "";
                    foreach (var lststatelist in statesList)
                    {
                        foreach (var node in lstRegionTypes)
                        {
                            regionCodes += node.Region_Code + "^";
                        }
                    }
                    if (!string.IsNullOrEmpty(regionCodes))
                    {
                        doctorMasterDetails = (List<MVCModels.HiDoctor_Reports.DoctorMasterModel>)_objRR.GetDoctormasterdetails(_objCurrentInfo.GetCompanyCode(), regionCodes).ToList();
                    }
                    if (isTrue)
                    {
                        //Find the Total Grand Total 
                        strTable.Append("<tr>");
                        strTable.Append("<td colspan='3' align='left' valign='top'>Grand Total</td>");
                        grandTotal = 0;

                        for (int index = 0; index < grandTotalArr.Length; index++)
                        {
                            strTable.Append("<td align='left' valign='top'> " + grandTotalArr[index] + " </td>");
                        }

                        strTable.Append("</tr>");
                    }
                    strTable.Append("</tbody>");
                    strTable.Append("</table>");
                }
                else
                {
                    strTable.Append("<td colspan='5'>No Records To Display.</td>");
                }


                return strTable;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        //---------------------------END - SPECIALITY WISE DOCTOR CATEGORY COUNT ------------------------------------//

        //---------------------------Start of DRBondDCReport Function-----------------------------------------------------------//


        public string GetDRBondDCReportDetails(string userCode, string Option)
        {
            StringBuilder strBuilder = new StringBuilder();
            BL_ReportRegion _objReportRegion = new BL_ReportRegion();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCodes = userCode + ',';//To get multiple users

            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.DRBondDCDetails> drBonDCReport = _objReportRegion.GetDCRDoctBondReport(companyCode, userCodes).ToList();
            strBuilder = GetDRBondTableDetails(drBonDCReport, Option);
            return strBuilder.ToString();

        }


        public StringBuilder GetDRBondTableDetails(List<DRBondDCDetails> drBondDCDetails, string ReportTypeView)
        {

            StringBuilder sbTableContent = new StringBuilder();

            if (drBondDCDetails != null && drBondDCDetails.Count > 0)
            {
                sbTableContent.Append("<table id='tblEmpleaveReport' class='table table-striped' >");
                sbTableContent.Append("<thead class='active'>");
                sbTableContent.Append("<tr><td>User Name </td>");
                sbTableContent.Append("<td>Updated Datetime</td>");
                sbTableContent.Append("<td>Doctor Id </td>");
                sbTableContent.Append("<td>First Name</td>");
                sbTableContent.Append("<td>Last Name</td>");
                sbTableContent.Append("<td>Speciality Name</td>");
                sbTableContent.Append("<td>Hospital Name</td>");
                sbTableContent.Append("<td>Latitude</td>");
                sbTableContent.Append("<td>Longitude</td>");
                sbTableContent.Append("<td>Location Full Address</td>");
                sbTableContent.Append("<td>Phone Number</td>");
                sbTableContent.Append("<td>Email Id</td>");
                sbTableContent.Append("<td>Landmark</td>");
                sbTableContent.Append("<td>Assistant Name</td>");
                sbTableContent.Append("<td>Assistant Phone Number</td>");
                sbTableContent.Append("<td>Remarks</td>");
                //sbTableContent.Append("<td>User Id</td>");
                sbTableContent.Append("<td>Employee Name</td>");
                sbTableContent.Append("<td>Region Name</td>");
                sbTableContent.Append("<td>Manager Name</td>");
                sbTableContent.Append("<td>Manager Region</td>");

                sbTableContent.Append("<td>Working Hours1");
                sbTableContent.Append("<td>Working Hours2</td>");
                sbTableContent.Append("<td>Working Hours3</td>");
                sbTableContent.Append("<td>Trainer Code</td>");
                sbTableContent.Append("</thead>");
                foreach (var userinfo in drBondDCDetails)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Updated_DateTime);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Doctor_Id);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.First_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Last_Name);
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Speciality_Name);
                    sbTableContent.Append("</td>");

                    if (!string.IsNullOrEmpty(userinfo.Hospital_Photo_Url))
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");

                        sbTableContent.Append("<a  href='" + userinfo.Hospital_Photo_Url + "' style='text-decoration:underline;cursor:pointer'>" + userinfo.Hospital_Name + "</a>");
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(userinfo.Hospital_Name);
                        sbTableContent.Append("</td>");

                    }

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Latitude);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Longitude);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Location_Full_Address);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Phone_Number);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Email_Id);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Landmark);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Assistant_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Assistant_Phone_Number);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Remarks);
                    sbTableContent.Append("</td>");

                    //sbTableContent.Append("<td align='left' width='15%'>");
                    //sbTableContent.Append(userinfo.User_Id);
                    //sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(userinfo.Manager_Region);
                    sbTableContent.Append("</td>");


                    if ((userinfo.Working_From_Time != null) || (userinfo.Working_To_Time != null))
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(userinfo.Working_From_Time + " -" + userinfo.Working_To_Time);
                        sbTableContent.Append("</td>");
                    }

                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("--");
                        sbTableContent.Append("</td>");
                    }


                    if ((userinfo.Working_From_Time_2 != null) || (userinfo.Working_To_Time_2 != null))
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(userinfo.Working_From_Time_2 + " - " + userinfo.Working_To_Time_2);
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("--");
                        sbTableContent.Append("</td>");
                    }

                    if ((userinfo.Working_From_Time_3 != null) || (userinfo.Working_To_Time_3 != null))
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(userinfo.Working_From_Time_3 + " - " + userinfo.Working_To_Time_3);
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("--");
                        sbTableContent.Append("</td>");
                    }
                    if (userinfo.Trainer_Code != null)
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(userinfo.Trainer_Code);
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append("--");
                        sbTableContent.Append("</td>");
                    }


                }
                sbTableContent.Append("</tr>");
                sbTableContent.Append("</table>");

            }
            else
            {
                sbTableContent.Append("No Data Found");
            }

            if (ReportTypeView.ToUpper() == "E")
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                CurrentInfo _objCurInfo = new CurrentInfo();
                string userName = _objCurInfo.GetUserName();
                string Domain = _objCurInfo.GetSubDomain();
                string fileName = ReportTypeView + "_" + Domain + "_" + userName + ".xls";
                string blobUrl = string.Empty;
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
                sbTableContent = new StringBuilder();
                sbTableContent.Append("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
            }

            return sbTableContent;
        }
        //------------------------------------End of DRBondDCReport Function-----------------------------------------------------------//
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
            List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lstLastSubmitted = _objReport.GetlastsubmittedDetail(companyCode, userCode, month, year, UserSelection, selectedDate);
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

        public StringBuilder GetDayOfWeekReport(string user_Code, string DCR_Status, int month, int year, string viewType)
        {
            try
            {
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();
                string Company_Code = _objCurrentInfo.GetCompanyCode();
                DayofWeekReport objDayofWeekReport = _objBL_ReportRegion.GetDayOfWeekReport(Company_Code, user_Code, DCR_Status, month, year);
                if (viewType == "1")
                {
                    return GetDayOfWeekReportHTMLFormat(objDayofWeekReport, month, year, DCR_Status);
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    string DayOfWeekReportHTMLFormat = GetDayOfWeekReportHTMLFormat(objDayofWeekReport, month, year, DCR_Status).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();

                    string fileName = "DayOfWeekReport" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DayOfWeekReportHTMLFormat, accKey, fileName, "bulkdatasvc");

                    return strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download.</a>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", user_Code);
                dicContext.Add("DCR Status:", DCR_Status);
                dicContext.Add("Month:", Convert.ToString(month));
                dicContext.Add("Year:", Convert.ToString(year));
                dicContext.Add("ViewType:", viewType);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        public JsonResult GetDayOfWeekReportCalendarData(string user_Code, string DCR_Status, int month, int year, string viewType)
        {
            try
            {
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();
                string Company_Code = _objCurrentInfo.GetCompanyCode();
                List<DayofWeekReportCalendarData> lstDayOfWeekReportCalendar = _objBL_ReportRegion.GetDayOfWeekReportCalendarData(
                    Company_Code, user_Code, DCR_Status, month, year);

                return Json(lstDayOfWeekReportCalendar);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", user_Code);
                dicContext.Add("DCR Status:", DCR_Status);
                dicContext.Add("Month:", Convert.ToString(month));
                dicContext.Add("Year:", Convert.ToString(year));
                dicContext.Add("ViewType:", viewType);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        private StringBuilder GetDayOfWeekReportHTMLFormat(DayofWeekReport dayofWeekReport, int month, int year, string DCR_Status)
        {
            StringBuilder strBuilder = new StringBuilder();
            List<WeeklyReport> lstweeklyReport = dayofWeekReport.WeeklyReport;

            if (dayofWeekReport.lstUserDetail.Count > 0)
            {
                UserDetailModel userDetailModel = dayofWeekReport.lstUserDetail[0];
                strBuilder.Append("<DIV style='font-weight:bold;font-size:large;border-bottom: 1px solid #01B7E9;background: #efefef; padding: 10px;'>");
                strBuilder.Append("Day of Week Report - " + userDetailModel.User_Name + ", " + userDetailModel.User_Type_Name + "(" + userDetailModel.Region_Name + ")&nbsp;");
                strBuilder.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DAY_OF_WEEK_REPORT','HEADER')\" /></DIV>");

                strBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strBuilder.Append("<thead>");
                strBuilder.Append("<tr>");
                strBuilder.Append("<th style='text-align:left' colspan='3'>");
                strBuilder.Append("User Details");
                strBuilder.Append("<th>");
                strBuilder.Append("</tr>");
                strBuilder.Append("</thead>");

                strBuilder.Append("<tbody>");
                strBuilder.Append("<tr>");
                strBuilder.Append("<td >User Name: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.User_Name);
                strBuilder.Append("</td>");
                strBuilder.Append("<td >Designation: </td>");
                strBuilder.Append("<td >");
                strBuilder.Append(userDetailModel.User_Type_Name);
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");

                strBuilder.Append("<tr>");
                strBuilder.Append("<td >Employee Name: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Employee_Name);
                strBuilder.Append("</td>");
                strBuilder.Append("<td >Employee Number: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Employee_Number);
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");

                strBuilder.Append("<tr>");
                strBuilder.Append("<td>Reporting HQ: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Manager_Region_Name);
                strBuilder.Append("</td>");
                strBuilder.Append("<td>Reporting Manager: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Manager_Name);
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");


                strBuilder.Append("<tr>");
                strBuilder.Append("<td>Territory: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Region_Name);
                strBuilder.Append("</td>");
                List<DivisionReportModel> lstDivisionModel = dayofWeekReport.lstDivisionModel.Where(DIV => DIV.User_Code == userDetailModel.User_Code).ToList();
                string divisionName = string.Empty;

                strBuilder.Append("<td>Division: </td>");
                strBuilder.Append("<td>");
                StringBuilder strDivisionName = new StringBuilder();
                foreach (DivisionReportModel divisionModel in lstDivisionModel)
                {
                    strDivisionName.Append(divisionModel.Division_Name).Append(",");
                }
                if (strDivisionName.Length > 0)
                {
                    strBuilder.Append(strDivisionName.ToString().Remove(strDivisionName.Length - 1, 1));
                }
                else
                {
                    strBuilder.Append("No Division");
                }
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");

                strBuilder.Append("<tr>");
                strBuilder.Append("<td>Phone number: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.Phone);
                strBuilder.Append("</td>");
                strBuilder.Append("<td>Date of joining: </td>");
                strBuilder.Append("<td>");
                strBuilder.Append(userDetailModel.DOJ);
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");

                strBuilder.Append("<tr>");
                strBuilder.Append("<td>Periods: </td>");
                strBuilder.Append("<td>");
                string monthString = month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString();
                string sdate = "01/" + monthString + "/" + year.ToString();
                string edate = DateTime.DaysInMonth(year, month).ToString() + "/" + monthString + "/" + year.ToString();
                strBuilder.Append(sdate + " - " + edate);
                strBuilder.Append("</td>");

                string status = "";
                string[] strStatus = DCR_Status.Split('^');
                for (int i = 0; i < DCR_Status.Split('^').Length; i++)
                {
                    if (strStatus[i] == "1")
                        status += "Applied,";
                    else if (strStatus[i] == "2")
                        status += "Approved,";
                    else if (strStatus[i] == "0")
                        status += "Unapproved,";
                }
                status = status.Remove(status.Length - 1);
                strBuilder.Append("<td>DCR Status:</td>");
                strBuilder.Append("<td>");
                strBuilder.Append(status);
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");
                strBuilder.Append("</tbody></table>");
            }

            strBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
            strBuilder.Append("<th style='text-align:left'>Weeks</th>");
            strBuilder.Append("<th style='text-align:left'>Field Working Days</th>");
            strBuilder.Append("<th style='text-align:left'>Doctor Met</th>");
            strBuilder.Append("<th style='text-align:left'>Average</th>");
            strBuilder.Append("</tr></thead><tbody>");
            WeeklyReport firstWeek = lstweeklyReport.Where(F => F.Week_Number == 1).FirstOrDefault();
            WeeklyReport secWeek = lstweeklyReport.Where(F => F.Week_Number == 2).FirstOrDefault();
            WeeklyReport thirdWeek = lstweeklyReport.Where(F => F.Week_Number == 3).FirstOrDefault();
            WeeklyReport fourthWeek = lstweeklyReport.Where(F => F.Week_Number == 4).FirstOrDefault();
            WeeklyReport fifthWeek = lstweeklyReport.Where(F => F.Week_Number == 5).FirstOrDefault();
            WeeklyReport sixthWeek = null;
            if (lstweeklyReport != null && lstweeklyReport.Count > 0)
            {
                if (lstweeklyReport[lstweeklyReport.Count - 1].Week_Number == 6)
                {
                    sixthWeek = lstweeklyReport.Where(F => F.Week_Number == 6).FirstOrDefault();
                }
            }

            double avg = 0;
            double totalFieldWorkingDays = 0;
            double totalDoctorMet = 0;
            double totweekAvg = 0;
            // first week.
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>");
            strBuilder.Append("Week1");
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int fweek = firstWeek != null ? firstWeek.Field_Working_Days : 0;
            totalFieldWorkingDays += fweek;
            strBuilder.Append(fweek.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int fDocMet = firstWeek != null ? firstWeek.Doctor_Met : 0;
            totalDoctorMet += fDocMet;
            strBuilder.Append(fDocMet);
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            if (firstWeek != null && firstWeek.Field_Working_Days > 0)
            {
                avg = Convert.ToDouble(firstWeek.Doctor_Met) / Convert.ToDouble(firstWeek.Field_Working_Days);
            }
            totweekAvg += avg;
            strBuilder.Append(avg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            // Second week
            avg = 0;
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>");
            strBuilder.Append("Week2");
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int sweek = secWeek != null ? secWeek.Field_Working_Days : 0;
            totalFieldWorkingDays += sweek;
            strBuilder.Append(sweek);
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int sDocMet = secWeek != null ? secWeek.Doctor_Met : 0;
            totalDoctorMet += sDocMet;
            strBuilder.Append(sDocMet.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            if (secWeek != null && secWeek.Field_Working_Days > 0)
            {
                avg = Convert.ToDouble(secWeek.Doctor_Met) / Convert.ToDouble(secWeek.Field_Working_Days);
            }
            totweekAvg += avg;
            strBuilder.Append(avg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            // Third week.
            avg = 0;
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>");
            strBuilder.Append("Week3");
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int tWeek = thirdWeek != null ? thirdWeek.Field_Working_Days : 0;
            totalFieldWorkingDays += tWeek;
            strBuilder.Append(tWeek);
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int tDocMet = thirdWeek != null ? thirdWeek.Doctor_Met : 0;
            totalDoctorMet += tDocMet;
            strBuilder.Append(tDocMet.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            if (thirdWeek != null && thirdWeek.Field_Working_Days > 0)
            {
                avg = Convert.ToDouble(thirdWeek.Doctor_Met) / Convert.ToDouble(thirdWeek.Field_Working_Days);
            }
            strBuilder.Append(avg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            // Fourth Week
            avg = 0;
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>");
            strBuilder.Append("Week4");
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int foWeek = fourthWeek != null ? fourthWeek.Field_Working_Days : 0;
            totalFieldWorkingDays += foWeek;
            strBuilder.Append(foWeek.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int foDoctMet = fourthWeek != null ? fourthWeek.Doctor_Met : 0;
            totalDoctorMet += foDoctMet;
            strBuilder.Append(foDoctMet.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            if (fourthWeek != null && fourthWeek.Field_Working_Days > 0)
            {
                avg = Convert.ToDouble(fourthWeek.Doctor_Met) / Convert.ToDouble(fourthWeek.Field_Working_Days);
            }
            totweekAvg += avg;
            strBuilder.Append(avg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            // Fifth Week
            avg = 0;
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>");
            strBuilder.Append("Week5");
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int fifweek = fifthWeek != null ? fifthWeek.Field_Working_Days : 0;
            totalFieldWorkingDays += fifweek;
            strBuilder.Append(fifweek.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            int fifDocMet = fifthWeek != null ? fifthWeek.Doctor_Met : 0;
            totalDoctorMet += fifDocMet;
            strBuilder.Append(fifDocMet.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            if (fifthWeek != null && fifthWeek.Field_Working_Days > 0)
            {
                avg = Convert.ToDouble(fifthWeek.Doctor_Met) / Convert.ToDouble(fifthWeek.Field_Working_Days);
            }
            strBuilder.Append(avg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            // sixth Week
            if (sixthWeek != null)
            {
                avg = 0;
                strBuilder.Append("<tr>");
                strBuilder.Append("<td>");
                strBuilder.Append("Week6");
                strBuilder.Append("</td>");

                strBuilder.Append("<td>");
                int sxweek = sixthWeek != null ? sixthWeek.Field_Working_Days : 0;
                totalFieldWorkingDays += sxweek;
                strBuilder.Append(sxweek.ToString());
                strBuilder.Append("</td>");

                strBuilder.Append("<td>");
                int sixDocMet = sixthWeek != null ? sixthWeek.Doctor_Met : 0;
                totalDoctorMet += sixDocMet;
                strBuilder.Append(sixDocMet.ToString());
                strBuilder.Append("</td>");

                strBuilder.Append("<td>");
                if (sixthWeek != null && sixthWeek.Field_Working_Days > 0)
                {
                    avg = Convert.ToDouble(sixthWeek.Doctor_Met) / Convert.ToDouble(sixthWeek.Field_Working_Days);
                }
                strBuilder.Append(avg.ToString("0.00"));
                strBuilder.Append("</td>");
                strBuilder.Append("</tr>");
            }
            // Total 
            strBuilder.Append("<tr>");
            strBuilder.Append("<td style='font-weight:bold'>");
            strBuilder.Append("Total");
            strBuilder.Append("</td>");
            strBuilder.Append("<td style='font-weight:bold'>");
            strBuilder.Append(totalFieldWorkingDays.ToString());
            strBuilder.Append("</td>");
            strBuilder.Append("<td style='font-weight:bold'>");
            strBuilder.Append(totalDoctorMet.ToString());
            strBuilder.Append("</td>");
            strBuilder.Append("<td style='font-weight:bold'>");
            if (totalFieldWorkingDays > 0)
            {
                totweekAvg = Convert.ToDouble(totalDoctorMet) / Convert.ToDouble(totalFieldWorkingDays);
            }
            strBuilder.Append(totweekAvg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            strBuilder.Append("</tbody>");
            strBuilder.Append("</table>");

            List<DaywiseReport> lstdayReport = dayofWeekReport.DaywiseReport;
            DaywiseReport sundayEntity = lstdayReport.Where(s => s.Day_Name == "Sunday").FirstOrDefault();
            DaywiseReport mondayEntity = lstdayReport.Where(m => m.Day_Name == "Monday").FirstOrDefault();
            DaywiseReport tuesdayEntity = lstdayReport.Where(tu => tu.Day_Name == "Tuesday").FirstOrDefault();
            DaywiseReport wednesdayEntity = lstdayReport.Where(wed => wed.Day_Name == "Wednesday").FirstOrDefault();
            DaywiseReport thursdayEntity = lstdayReport.Where(thu => thu.Day_Name == "Thursday").FirstOrDefault();
            DaywiseReport fridayEntity = lstdayReport.Where(fri => fri.Day_Name == "Friday").FirstOrDefault();
            DaywiseReport saturdayEntity = lstdayReport.Where(sat => sat.Day_Name == "Saturday").FirstOrDefault();

            strBuilder.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
            strBuilder.Append("<th style='text-align:left'>Details</th>");
            strBuilder.Append("<th style='text-align:left'>Sun</th>");
            strBuilder.Append("<th style='text-align:left'>Mon</th>");
            strBuilder.Append("<th style='text-align:left'>Tue</th>");
            strBuilder.Append("<th style='text-align:left'>Wed</th>");
            strBuilder.Append("<th style='text-align:left'>Thu</th>");
            strBuilder.Append("<th style='text-align:left'>Fri</th>");
            strBuilder.Append("<th style='text-align:left'>Sat</th>");
            strBuilder.Append("</tr></thead><tbody>");
            strBuilder.Append("<tr>");
            strBuilder.Append("<td>Total Calls</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(sundayEntity == null ? "0" : sundayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(mondayEntity == null ? "0" : mondayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(tuesdayEntity == null ? "0" : tuesdayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(wednesdayEntity == null ? "0" : wednesdayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(thursdayEntity == null ? "0" : thursdayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(fridayEntity == null ? "0" : fridayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("<td>");
            strBuilder.Append(saturdayEntity == null ? "0" : saturdayEntity.Total_Calls.ToString());
            strBuilder.Append("</td>");

            strBuilder.Append("</tr>");

            strBuilder.Append("<tr>");
            strBuilder.Append("<td>Average</td>");

            double sunAvg = 0;
            if (sundayEntity != null && sundayEntity.Days_Count_In_Month > 0)
            {
                sunAvg = Convert.ToDouble(sundayEntity.Total_Calls) / Convert.ToDouble(sundayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(sunAvg.ToString("0.00"));
            strBuilder.Append("</td>");

            double monAvg = 0;
            if (mondayEntity != null && mondayEntity.Days_Count_In_Month > 0)
            {
                monAvg = Convert.ToDouble(mondayEntity.Total_Calls) / Convert.ToDouble(mondayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(monAvg.ToString("0.00"));
            strBuilder.Append("</td>");


            double tueAvg = 0;
            if (tuesdayEntity != null && tuesdayEntity.Days_Count_In_Month > 0)
            {
                tueAvg = Convert.ToDouble(tuesdayEntity.Total_Calls) / Convert.ToDouble(tuesdayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(tueAvg.ToString("0.00"));
            strBuilder.Append("</td>");


            double wedAvg = 0;
            if (wednesdayEntity != null && wednesdayEntity.Days_Count_In_Month > 0)
            {
                wedAvg = Convert.ToDouble(wednesdayEntity.Total_Calls) / Convert.ToDouble(wednesdayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(wedAvg.ToString("0.00"));
            strBuilder.Append("</td>");


            double thuAvg = 0;
            if (thursdayEntity != null && thursdayEntity.Days_Count_In_Month > 0)
            {
                thuAvg = Convert.ToDouble(thursdayEntity.Total_Calls) / Convert.ToDouble(thursdayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(thuAvg.ToString("0.00"));
            strBuilder.Append("</td>");


            double friAvg = 0;
            if (fridayEntity != null && fridayEntity.Days_Count_In_Month > 0)
            {
                friAvg = Convert.ToDouble(fridayEntity.Total_Calls) / Convert.ToDouble(fridayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(friAvg.ToString("0.00"));
            strBuilder.Append("</td>");

            double satAvg = 0;
            if (saturdayEntity != null && saturdayEntity.Days_Count_In_Month > 0)
            {
                satAvg = Convert.ToDouble(saturdayEntity.Total_Calls) / Convert.ToDouble(saturdayEntity.Days_Count_In_Month);
            }
            strBuilder.Append("<td>");
            strBuilder.Append(satAvg.ToString("0.00"));
            strBuilder.Append("</td>");
            strBuilder.Append("</tr>");

            return strBuilder;

        }

        //---------------------------START - DOCTOR DEVIATION REPORT DETAILS ------------------------------------//
        public string GetDoctorDeviationReportDetails(string userCode, string startDate, string endDate, string dcrStatus, string viewFormat, string title)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string error = string.Empty;
                string dcrcheckedStatus = "";
                dcrcheckedStatus = dcrStatus + ',';

                List<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel> lstDoctordeviationdetails = _objRR.GetDoctorDeviationDetails(companyCode, userCode, startDate, endDate, dcrcheckedStatus).ToList();

                if (viewFormat == "S")
                {
                    strTb = GetDoctorDeviationReport(lstDoctordeviationdetails, companyCode, userCode, dcrcheckedStatus, startDate, endDate, title);
                }
                else
                {
                    string lastSubmittedTable = GetDoctorDeviationReport(lstDoctordeviationdetails, companyCode, userCode, dcrcheckedStatus, startDate, endDate, title).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();

                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Doctor_Deviation_DetailsReport" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("status", dcrStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetDoctorDeviationReport(List<DocotorCallcountHeaderModel> lstDoctorDeviationDetails, string companyCode, string userCode, string dcrCheckedstatus, string startDate, string endDate, string title)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            BLUser _objUser = new BLUser();
            StringBuilder strTbl = new StringBuilder();
            ArrayList AlluserName = new ArrayList();
            ArrayList alManager = new ArrayList();
            ArrayList allChild = new ArrayList();
            string subTbl = string.Empty;
            string subAccTable = string.Empty;
            string userNames = string.Empty;
            string seleceddcrstatus = string.Empty;
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(companyCode, userCode, "").ToList();
                switch (dcrCheckedstatus)
                {
                    case "1,2,0,3,":
                        seleceddcrstatus = "Applied,Approved,Unapproved,Drafted";
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
                    case "3,":
                        seleceddcrstatus = "Drafted";
                        break;
                    case "1,2,":
                        seleceddcrstatus = "Applied,Approved";
                        break;
                    case "1,3,":
                        seleceddcrstatus = "Applied,Drafted";
                        break;
                    case "2,3,":
                        seleceddcrstatus = "Approved,Drafted";
                        break;
                    case "1,0,":
                        seleceddcrstatus = "Applied,Unapproved";
                        break;
                    case "2,0,":
                        seleceddcrstatus = "Approved,Unapproved";
                        break;
                    case "1,2,0,":
                        seleceddcrstatus = "Applied,Approved,Unapproved";
                        break;
                    case "2,0,3,":
                        seleceddcrstatus = "Approved,Unapproved,Drafted";
                        break;
                    case "1,2,3,":
                        seleceddcrstatus = "Applied,Approved,Drafted";
                        break;
                    case "1,0,3,":
                        seleceddcrstatus = "Applied,Unapproved,Drafted";
                        break;
                    default: break;
                }
                string startdateforHeader = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string endDateforheader = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                string generateHeaderTable = _objUser.GetReportHeaderTableString(companyCode, userCode, startdateforHeader, endDateforheader, seleceddcrstatus, "").ToString();
                if (lstDoctorDeviationDetails != null && lstDoctorDeviationDetails.Count() > 0)
                {
                    foreach (var DoctorDeviationDetals in lstDoctorDeviationDetails)
                    {
                        //Get Unique Person code
                        if (!AlluserName.Contains(DoctorDeviationDetals.Person_Code))
                        {
                            if (!string.IsNullOrEmpty(DoctorDeviationDetals.Person_Code))
                            {
                                AlluserName.Add(DoctorDeviationDetals.Person_Code);
                                userNames += DoctorDeviationDetals.Person_Code + ",";
                            }
                        }
                        //Get Unique Acc2 Person List
                        if (!AlluserName.Contains(DoctorDeviationDetals.Acc2_User_Code))
                        {
                            if (!string.IsNullOrEmpty(DoctorDeviationDetals.Acc2_User_Code))
                            {
                                AlluserName.Add(DoctorDeviationDetals.Acc2_User_Code);
                                userNames += DoctorDeviationDetals.Acc2_User_Code + ",";
                            }
                        }
                        //Get Unique Acc3 Person List
                        if (!AlluserName.Contains(DoctorDeviationDetals.Acc3_Person))
                        {
                            if (!string.IsNullOrEmpty(DoctorDeviationDetals.Acc3_Person))
                            {
                                AlluserName.Add(DoctorDeviationDetals.Acc3_Person);
                                userNames += DoctorDeviationDetals.Acc3_Person + ",";
                            }
                        }
                        //Get Unique Acc4 Person List
                        if (!AlluserName.Contains(DoctorDeviationDetals.Acc4_Person))
                        {
                            if (!string.IsNullOrEmpty(DoctorDeviationDetals.Acc4_Person))
                            {
                                AlluserName.Add(DoctorDeviationDetals.Acc4_Person);
                                userNames += DoctorDeviationDetals.Acc4_Person + ",";
                            }
                        }

                    }
                    userNames += lstUserInfo[0].User_Name + ",";
                    List<MVCModels.HiDoctor_Reports.DCRDoctorVisitReportModel> lstDoctors = _objRR.GetDoctors(companyCode, userNames, startDate, endDate, dcrCheckedstatus).ToList();
                    strTbl.Append("<div id='DoctorDeviationreportDetails'>");
                    strTbl.Append("<div class='dvHeader' id='spnDoctorDeviationreportDetails'>");
                    strTbl.Append("<div class='dvheader-inner'><b>" + title + " of " + lstUserInfo[0].User_Name + " For the Period of " + startdateforHeader + " to " + endDateforheader + "</b></div>");
                    strTbl.Append("<div class='helpIconRpt'>");
                    strTbl.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('Doctor_Deviation_REPORT','HEADER')\" />");
                    strTbl.Append("</div>");
                    strTbl.Append("</div>");
                    strTbl.Append("<br/>");

                    if (lstDoctors != null && lstDoctors.Count() > 0)
                    {
                        strTbl.Append("<div> " + generateHeaderTable + " </div>");
                        strTbl.Append("<br/>");
                        strTbl.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'>");
                        strTbl.Append("<thead class='active'><tr>");
                        strTbl.Append("<th valign='top' align='left'>Date</th><th valign='top' align='left'> " + lstUserInfo[0].User_Name + " </th>");
                        //Create Acc List in Table Header
                        foreach (var lstUserNames in AlluserName)
                        {
                            strTbl.Append("<th valign='top' align='left'>Doctors met by " + lstUserNames + "</th>");
                        }
                        strTbl.Append("<th valign='top'  align='left'>Doctor Missed</th>");
                        strTbl.Append("<th valign='top' align='left'>Deviation doctors</th>");
                        strTbl.Append("</tr></thead><tbody>");

                        // date wise acc doctor bind
                        int rowCount = 0;
                        foreach (var lstdoctorDeviation in lstDoctorDeviationDetails)
                        {
                            var filterUserName = lstDoctors.Where(s => s.DCR_Actual_Date == lstdoctorDeviation.DCR_Actual_Date && s.User_Name == lstUserInfo[0].User_Name).ToList();
                            if (filterUserName.Count() > 0)
                            {
                                rowCount++;
                                strTbl.Append("<tr><td valign='top' style='align='left'> " + lstdoctorDeviation.DCR_Actual_Date + " </td>");
                                subTbl = "<table>";
                                alManager = new ArrayList();
                                allChild = new ArrayList();
                                //Manager Doctor List
                                foreach (var doctorName in filterUserName)
                                {
                                    subTbl += "<tr><td> " + doctorName.Doctor_Name + " </td></tr>";
                                    alManager.Add(doctorName.Doctor_Name).ToString();
                                }
                                subTbl += "</table>";

                                strTbl.Append("<td valign='top' style='align='left'> " + subTbl + " </td>");
                                //Acc Doctor List
                                foreach (string AccName in AlluserName)
                                {
                                    if (AccName == lstdoctorDeviation.Person_Code || AccName == lstdoctorDeviation.Acc2_User_Code || AccName == lstdoctorDeviation.Acc3_Person || AccName == lstdoctorDeviation.Acc4_Person)
                                    {
                                        var SubfilterUserName = lstDoctors.Where(p => p.DCR_Actual_Date == lstdoctorDeviation.DCR_Actual_Date && p.User_Name == AccName).ToList();
                                        if (SubfilterUserName.Count() > 0)
                                        {
                                            subAccTable = "<table>";
                                            foreach (var doctor in SubfilterUserName)
                                            {
                                                subAccTable += "<tr><td> " + doctor.Doctor_Name + " </td></tr>";
                                                allChild.Add(doctor.Doctor_Name);
                                            }
                                            subAccTable += "</table>";
                                        }
                                        else
                                        {
                                            subAccTable = "";
                                        }
                                    }
                                    else
                                    {
                                        subAccTable = "";
                                    }
                                    strTbl.Append("<td valign='top' style='align='left'> " + subAccTable + " </td>");
                                }
                                subTbl = "";
                                subAccTable = "";
                                //Doctor Missed Count
                                if (allChild.Count > 0)
                                {
                                    subTbl = "<table>";
                                    foreach (var childDoctor in allChild)
                                    {
                                        if (!alManager.Contains(childDoctor))
                                        {
                                            subTbl += "<tr><td> " + childDoctor + "</td></tr>";
                                        }
                                    }
                                    subTbl += "</table>";
                                }
                                else
                                {
                                    subTbl = "";
                                }
                                // doctor divistion list
                                strTbl.Append("<td valign='top' style='align:left;'> " + subTbl + " </td>");
                                int count = 0;
                                if (alManager.Count > 0)
                                {
                                    subAccTable = "<table>";
                                    foreach (var managerDoctor in alManager)
                                    {
                                        if (!allChild.Contains(managerDoctor))
                                        {
                                            count++;
                                            subAccTable += "<tr><td> " + managerDoctor + " </td></tr>";
                                        }
                                    }
                                    subAccTable += "</table>";
                                    if (count < 0)
                                    {
                                        subAccTable = "";
                                    }
                                }
                                else
                                {
                                    subAccTable = "";
                                }
                                strTbl.Append("<td valign='top' align='left'> " + subAccTable + "</td></tr>");
                            }
                        }
                    }
                    else
                    {
                        strTbl.Append("No Records to Display.");
                    }
                }
                else
                {
                    strTbl.Append("No Records to Display.");
                }
                return strTbl;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// Get DoctorMaster Report Details
        /// </summary>
        /// <returns></returns>
        public string GetDoctorMasterReportDetails(string regionCode, string viewFormat, string title, string selectedUser)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                if (viewFormat == "S")
                {
                    strTb = DoctorMasterReport(regionCode, viewFormat, title, selectedUser);
                }
                else
                {
                    string lastSubmittedTable = DoctorMasterReport(regionCode, viewFormat, title, selectedUser).ToString();
                    string DoctorMasterReportDetails = GetDoctorMasterDetails(regionCode).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "DOCTOR_MASTER" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    string filename1 = "DOCTOR_MASTER_DETAILS" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl1 = objAzureBlob.AzureBlobUploadText(DoctorMasterReportDetails, accKey, filename1, "bulkdatasvc");

                    strTb.Append("Doctor Master Summary: <a href='" + blobUrl + "'>Click here to Download</a><br/>");
                    strTb.Append("Doctor Master Details: <a href='" + blobUrl1 + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regioncode", regionCode);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("title", title);
                dicContext.Add("selectedUser", selectedUser);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder DoctorMasterReport(string regionCode, string viewFormat, string title, string selectedUser)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            BLUser _objUser = new BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strTb = new StringBuilder();
            string companyCode = "";
            string userCode = "";
            string strfullindexforCategory = "";
            string strfullindexforSpeciality = "";
            string division_name = string.Empty;
            companyCode = _objCurrentInfo.GetCompanyCode();
            userCode = _objCurrentInfo.GetUserCode();
            List<DoctorMasterReportModel> lstDoctorcategoriesandspecialityes = new List<DoctorMasterReportModel>();
            List<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails> lstFullTreeDetails = new List<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails>();
            List<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel> lstDoctorMasterDivision = new List<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel>();
            List<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel> lstDivisionDetails = new List<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel>();
            List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(companyCode, "", regionCode).ToList();
            //string generateHeaderTable = _objRR.GetReportHeaderTableforDoctorMaster(_objCurrentInfo.GetCompanyCode(), "", regionCode);
            string currentdate = DateTime.Now.ToString("dd/MM/yyyy");
            lstFullTreeDetails = (List<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails>)_objRR.GetDetailsofChildRegions(companyCode, regionCode).ToList();
            lstDivisionDetails = (List<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel>)_objRR.GetDoctorMasterDivision(companyCode, regionCode).ToList();

            lstDoctorcategoriesandspecialityes = (List<DoctorMasterReportModel>)_objRR.GetCategoryWiseDoctorMasterReport(companyCode, regionCode).ToList();
            try
            {
                strTb.Append("<div style='margin-left: 7px;'>");
                strTb.Append("<div><lable>1.<span style='font-weight:bold;'>Individual Count :</span> It is the total approved doctor count with respect to region.</lable></div>");
                strTb.Append("<div><lable>2.<span style='font-weight:bold;'>Group Count:</span> is the total approved doctor count with respect to the team.</lable></div>");
                strTb.Append("<div><lable>3.<span style='font-weight:bold;'>Category Count:</span> is the total approved doctor with respect to the category.</lable></div>");
                strTb.Append("<div><lable>4.<span style='font-weight:bold;'>Speciality Count:</span> is the total approved doctor with respect to speciality.</lable></div>");
                strTb.Append("</div>");
                strTb.Append("</br>");
                strTb.Append("<i> *Doctor Master Composition Report on '" + DateTime.Now.ToString() + "'</i></br>");


                strTb.Append("<table id='tblDoctoMasterMainReport' class='table table-striped' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr><th align='center' valign='top' colspan='4'>Tree view</th>");
                strTb.Append("<th align='center' valign='top' colspan ='2'>Total Count</th>");
                if (lstDoctorcategoriesandspecialityes[0].lstDoctorCategories.Count() > 0)
                {
                    strTb.Append("<th style='text-align:center' valign='top' colspan =' " + lstDoctorcategoriesandspecialityes[0].lstDoctorCategories.Count() + " '>Category Count</th>");
                    strTb.Append("<th style='text-align:center' valign='top' colspan =' " + lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities.Count() + " '>Speciality Count</th></tr><tr><th align='left' valign='top'>Region Name</th><th align='left' valign='top'>User Name</th><th align='left' valign='top'>Designation</th><th align='left' valign='top'>Division Name</th><th align='left' valign='top'>Individual Count</th>");
                    strTb.Append("<th align='left' valign='top'>Group Count</th>");
                }
                else
                {
                    strTb.Append("<th style='text-align:center' valign='top' colspan =' " + lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities.Count() + " '>Speciality Count</th></tr><tr><th align='left' valign='top'>Region Name</th><th align='left' valign='top'>User Name</th><th align='left' valign='top'>Designation</th><th align='left' valign='top'>Division Name</th><th align='left' valign='top'>Individual Count</th>");
                    strTb.Append("<th align='left' valign='top'>Group Count</th>");
                }

                //Bind Category Header
                foreach (var categoryName in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                {
                    strTb.Append("<th align='left' valign='top'> " + categoryName.Category_Name + " </th>");
                }
                //Bind Speciality Header
                foreach (var specialityName in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                {
                    strTb.Append("<th align='left' valign='top'> " + specialityName.Speciality_Name + " </th>");
                }
                strTb.Append("</tr></thead><tbody>");

                List<MVCModels.HiDoctor_Reports.DoctorCountModel> lstcategoriesandspecialitiescount = new List<MVCModels.HiDoctor_Reports.DoctorCountModel>();
                lstcategoriesandspecialitiescount = (List<MVCModels.HiDoctor_Reports.DoctorCountModel>)_objRR.GetcategoryandspecialityCount(companyCode, regionCode).ToList();

                if (lstDoctorcategoriesandspecialityes != null && lstDoctorcategoriesandspecialityes.Count() > 0)
                {
                    int rowCount = 0;

                    List<DoctorMasterFullTreeDetailsModel> RegionDetails = lstFullTreeDetails[0].lstFullTreeModel.GroupBy(region => region.Region_Code).
                    Select(group => group.First()).ToList();

                    for (int treedetails = 0; treedetails < RegionDetails.Count; treedetails++)
                    {
                        //foreach (var treedetails in RegionDetails)
                        //{
                        rowCount++;
                        strTb.Append("<tr><td align='left' valin='top' style='white-space:nowrap;'>" + RegionDetails[treedetails].Region_Name + "</td>");

                        //To add Bind User Name

                        strTb.Append("<td align='left' valign='top' style='white-space:nowrap;'>" + RegionDetails[treedetails].User_Name + "</td>");

                        //To Bind Designation
                        strTb.Append("<td align='left' valign='top' style='white-space:nowrap;'>" + RegionDetails[treedetails].User_Type_Name + "</td>");
                        //To Bind Division Name

                        if (lstDivisionDetails.Count > 0)
                        {
                            var lstDivisions = lstDivisionDetails.Where(s => s.Entity_Code == RegionDetails[treedetails].Region_Code).ToList();
                            if (lstDivisions != null && lstDivisions.Count > 0)
                            {
                                division_name = "";
                                for (int divisionName = 0; divisionName < lstDivisions.Count; divisionName++)
                                {
                                    division_name += lstDivisions[divisionName].Division_Name + ',';
                                }
                                if (!string.IsNullOrEmpty(division_name))
                                {
                                    division_name = division_name.TrimEnd(',');
                                }
                            }
                            else
                            {
                                division_name = "";
                            }
                            strTb.Append("<td align='left' valign='top' style='white-space:nowrap;'>" + division_name + "</td>");
                        }
                        else
                        {
                            strTb.Append("<td align='left' valign='top' style='white-space:nowrap;'></td>");
                        }

                        //Individual Count                       
                        strTb.Append("<td align='right' valin='top'>");
                        var filterindividualCount = lstcategoriesandspecialitiescount[0].lstIndividulaCount.Where(y => y.Region_Code == RegionDetails[treedetails].Region_Code).ToList();
                        strTb.Append(filterindividualCount[0].Doctorcount_Individual.ToString());
                        strTb.Append("</td>");
                        //Group Count  
                        strTb.Append("<td align='right' valin='top'>");
                        strTb.Append(filterindividualCount[0].Doctorcount_Group);
                        strTb.Append("</td>");

                        //Bind Category
                        strfullindexforCategory = RegionDetails[treedetails].Full_index;

                        for (int lstcategorycount = 0; lstcategorycount < lstDoctorcategoriesandspecialityes[0].lstDoctorCategories.Count; lstcategorycount++)
                        {
                            var filterIndex = lstcategoriesandspecialitiescount[0].lstDoctorCategorycount.Where(x => x.Full_index.StartsWith(strfullindexforCategory) && x.Category == lstDoctorcategoriesandspecialityes[0].lstDoctorCategories[lstcategorycount].Category_Code).ToList();
                            if (filterIndex.Count > 0)
                            {
                                var categorycount = filterIndex.Sum(x => x.CategoryCount);
                                strTb.Append("<td id='" + RegionDetails[treedetails].Region_Code + "' align='right' valin='top'>" + categorycount + "</a></td>");
                            }
                            else
                            {
                                strTb.Append("<td id='" + RegionDetails[treedetails].Region_Code + "'align='right' valin='top'>0</td>");
                            }
                        }
                        //Bind Speciality
                        strfullindexforSpeciality = RegionDetails[treedetails].Full_index;
                        for (int lstspecilaitycount = 0; lstspecilaitycount < lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities.Count; lstspecilaitycount++)
                        {
                            var filterIndex = lstcategoriesandspecialitiescount[0].lstDoctorspecialitiescount.Where(x => x.Full_index.StartsWith(strfullindexforSpeciality) && x.Speciality_Code == lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities[lstspecilaitycount].Speciality_Code).ToList();
                            if (filterIndex.Count > 0)
                            {
                                var specialityCount = filterIndex.Sum(x => x.SpecialityCount);
                                strTb.Append("<td>");
                                strTb.Append(specialityCount);
                                strTb.Append("</td>");
                            }
                            else
                            {
                                strTb.Append("<td id='" + RegionDetails[treedetails].Region_Code + "' align='left' valin='top'>0</td>");
                            }
                        }
                        strTb.Append("</tr>");
                    }
                }

                else
                {
                    strTb.Append("No Records To Display.");
                }
                strTb.Append("</tbody>");
                strTb.Append("</table>");
                return strTb;
            }
            catch
            {
                throw;
            }
        }
       
        public string GetWorkanalysisReportFormat(string userCode, string startMonth, string startYear, string endMonth, string endYear, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetWorkanalysisReportDetail(userCode, startMonth, startYear, endMonth, endYear, viewFormat);
                }
                else
                {
                    string DCREmpLeaveTable = GetWorkanalysisReportDetail(userCode, startMonth, startYear, endMonth, endYear, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compName = _objCurInfo.GetSubDomain();

                    string fileName = "WorkAnalysis Report" + "_" + compName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCREmpLeaveTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:StartMonth", startMonth);
                dicContext.Add("Filter:Endmonth", endMonth);
                dicContext.Add("Filter:Startyear", startYear);
                dicContext.Add("Filter:Endyear", endYear);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }



        public StringBuilder GetWorkanalysisReportDetail(string userCode, string startMonth, string startYear, string endMonth, string endYear, string viewFormat)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            string userCodes = string.Empty;
            string userCodecount = string.Empty;
            string parentRegions = string.Empty;
            int iRow = 0, nonFielddays = 0;
            int monthSunCount = 0, leaveCount = 0, holidayCount = 0;
            double monthNonFieldDays = 0.0;
            int daysInMonth = DateTime.DaysInMonth(Convert.ToInt32(endYear), Convert.ToInt32(endMonth));
            string startDate = startYear + "-" + startMonth + "-01";
            string endDate = endYear + "-" + endMonth + "-" + daysInMonth.ToString();

            DateTime dtEndDate = new DateTime();
            DateTime dtStartDate = new DateTime();
            TimeSpan ts;
            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);
            ts = dtEndDate - dtStartDate;
            string startmonthName = GetMonthName(startMonth);
            string endmonthName = GetMonthName(endMonth);
            DateTime dtTemp;
            ArrayList monthlist = new ArrayList();

            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());

                }
            }

            for (int j = 0; j <= ts.Days; j++)
            {
                if (j != 0)
                {
                    dtStartDate = dtStartDate.AddDays(Convert.ToDouble(1));
                }

                if (dtStartDate.DayOfWeek.ToString().ToUpper() == "SUNDAY")
                {
                    monthSunCount++;

                }
            }

            List<MVCModels.HiDoctor_Reports.TPStatusReport> lstchildusers = new List<MVCModels.HiDoctor_Reports.TPStatusReport>();
            lstchildusers = (List<MVCModels.HiDoctor_Reports.TPStatusReport>)_objReport.GetchildUsers(companyCode, userCode);
            StringBuilder sbTableContent = new StringBuilder();

            try
            {
                foreach (var user in lstchildusers)
                {
                    userCodecount += user.User_Code + ",";
                }

                if (!string.IsNullOrEmpty(userCodecount))
                {
                    userCodes = userCodecount;
                }

                List<MVCModels.HiDoctor_Reports.WorkAnalyisModel> lstWorkAnalysis = new List<MVCModels.HiDoctor_Reports.WorkAnalyisModel>();
                lstWorkAnalysis = (List<MVCModels.HiDoctor_Reports.WorkAnalyisModel>)_objReport.GetWorkAnalysisDetail(companyCode, userCodes, endMonth, endYear, startDate, endDate);


                if (lstchildusers.Count > 0 && lstchildusers != null)
                {
                    sbTableContent.Append("<div id='WorkAnalysis' style='margin-left:-1%'>");
                    sbTableContent.Append("<div class='dvHeader' id='spnWorkAnalysis'>");
                    sbTableContent.Append("<div class='dvheader-inner'>Work Analysis Report for the Period of " + startmonthName + "-" + startYear + " " + "to" + " " + endmonthName + "-" + endYear + "</div>");

                    if (viewFormat == "1")
                    {
                        sbTableContent.Append("<div class='helpIconRpt'>");
                        sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('WORKANALYSIS','HEADER')\" />");
                        sbTableContent.Append("</div>");
                    }
                    sbTableContent.Append("</div>");

                    sbTableContent.Append("<table   cellspacing='1' cellpadding='1' id='tblSummaryTable' class='table table-striped'> <thead>");
                    sbTableContent.Append("<tr><th valign='top' align='left'  style='text-align:left'>HQ Name</th><th valign='top' align='left'  style='text-align:left'>Employee Name</th>");
                    sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>Designation</td><th valign='top' align='left'  style='text-align:left'>Date Of Joining</th>");
                    sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>Manager Name</th><th valign='top' align='left'  style='text-align:left'>Last Report Date</th><th valign='top' align='left'  style='text-align:left'>No Field Work</th><th valign='top' align='left'  style='text-align:left'>Total days worked in field</th><th valign='top' align='left'  style='text-align:left'>% Field Working days </th><th valign='top' align='left'  style='text-align:left'>Compliance call Average (% to 12 calls)</th>");
                    List<WADoctorCategoryModel> lstCategory = lstWorkAnalysis[0].lstDrCategoryModel.ToList();
                    if (lstCategory.Count > 0)
                    {
                        foreach (var Category in lstCategory)
                        {
                            sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>" + Category.Category_Name + "  Calls Missed</th>");
                            sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>" + Category.Category_Name + " Calls Missed against Plan</th>");
                            sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>" + Category.Category_Name + "  Call Coverage %</th>");
                            sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>" + Category.Category_Name + "  Repeat Calls</th>");
                        }
                    }
                    sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>No. of TP deviations calls</th>");
                    sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>Number of CP deviations calls</td>");
                    List<RatingParameterModel> lstparameterName = lstWorkAnalysis[0].lstratingParameter;
                    if (lstparameterName.Count > 0)
                    {

                        foreach (var lstparameter in lstparameterName)
                        {
                            sbTableContent.Append("<th valign='top' align='left'  style='text-align:left'>" + lstparameter.Parameter_Name + "</th>");
                        }
                    }
                    sbTableContent.Append("</tr></thead><tbody>");

                    List<WAUserDetailModel> lstuserDetail = lstWorkAnalysis[0].lstWAUserDetail.ToList();
                    List<WALastEnteredDateModel> lstuserEnteredDate = lstWorkAnalysis[0].lstWALastEnteredDate;
                    List<WADcrCpModel> lstuserDcr = lstWorkAnalysis[0].lstWADcrCp;
                    List<WADcrLockModel> lstuserDcrActualdate = lstWorkAnalysis[0].lstWADcrLock;
                    List<WACustomerModel> lstuserDcrCustomer = lstWorkAnalysis[0].lstCustomer;
                    List<WADoctorCategoryModel> lstUserCategory = lstWorkAnalysis[0].lstDrCategoryModel;
                    List<WACategoryCountModel> lstCategoryCount = lstWorkAnalysis[0].lsCategoryCount;
                    List<WACustomerDetail> lstMonth = lstWorkAnalysis[0].lsCustomerdetail;
                    List<WADcrplannedDaysModel> lstPlannedDayCount = lstWorkAnalysis[0].lstPlannedDays;
                    List<WADcrVistedDaysModel> lstVisitedCount = lstWorkAnalysis[0].lstVisitedDays;
                    List<WAActivityModel> lstActivity = lstWorkAnalysis[0].lstActivityModel;
                    List<WATP> lstTpcount = lstWorkAnalysis[0].lstTp.Distinct(new WATPComparer()).ToList();
                    List<WAtable13> lstTpdata = lstWorkAnalysis[0].lstTpdata;
                    List<RatingParameterModel> lstparametermodel = lstWorkAnalysis[0].lstratingParameter;
                    List<WAParameterValue> lstparametervalue = lstWorkAnalysis[0].lsParameterValue;




                    foreach (var User in lstchildusers)
                    {
                        List<WAUserDetailModel> filteruser = lstuserDetail.Where(c => c.User_Code == User.User_Code).ToList();


                        if (filteruser.Count > 0)
                        {
                            sbTableContent.Append("<tr>");
                            if (!string.IsNullOrEmpty(filteruser[0].Region_Name))
                            {
                                sbTableContent.Append("<td>" + filteruser[0].Region_Name + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }


                            if (!string.IsNullOrEmpty(filteruser[0].Employee_Name))
                            {
                                sbTableContent.Append("<td>" + filteruser[0].Employee_Name + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }
                            if (!string.IsNullOrEmpty(filteruser[0].User_type_Name))
                            {
                                sbTableContent.Append("<td>" + filteruser[0].User_type_Name + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }

                            if (!string.IsNullOrEmpty(filteruser[0].Date_of_joining))
                            {
                                sbTableContent.Append("<td>" + filteruser[0].Date_of_joining + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }
                            if (!string.IsNullOrEmpty(filteruser[0].Manager_Name))
                            {
                                sbTableContent.Append("<td>" + filteruser[0].Manager_Name + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }
                        }
                        else
                        {
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td>");
                            sbTableContent.Append("<td></td>");
                        }

                        List<WALastEnteredDateModel> filterUserEnterDate = lstuserEnteredDate.Where(c => c.User_Code == User.User_Code).ToList();

                        if (filterUserEnterDate.Count > 0)
                        {
                            if (!string.IsNullOrEmpty(filterUserEnterDate[0].Last_Entered))
                            {
                                sbTableContent.Append("<td>" + filterUserEnterDate[0].Last_Entered.ToString().Split('.')[2] + "/" + filterUserEnterDate[0].Last_Entered.ToString().Split('.')[1] + "/" + filterUserEnterDate[0].Last_Entered.ToString().Split('.')[0] + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td></td>");
                            }
                        }
                        else
                        {
                            sbTableContent.Append("<td></td>");
                        }

                        // Get Parent RegionCode
                        //List<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> lstParentRegions = _objReport.GetParentRegionCode(companyCode, filteruser[0].Region_Code).ToList();
                        //foreach (var AllparentRegion in lstParentRegions)
                        //{
                        //    parentRegions += AllparentRegion.Region_Code + "^";
                        //}

                        List<MVCModels.HiDoctor_Reports.HolidayDetailsModel> lstHolidayDetails = _objReport.GetHolidayDetails(companyCode, filteruser[0].Region_Code, startDate, endDate).ToList();
                        //NO Field Days
                        nonFielddays = 0;
                        leaveCount = 0;
                        holidayCount = 0;
                        monthNonFieldDays = 0.0;

                        if (lstHolidayDetails.Count > 0)
                        {
                            holidayCount = lstHolidayDetails.Count;
                        }

                        List<string> lstflag = new List<string>() { "A", "L" };
                        List<WADcrCpModel> filterUserDcr = lstuserDcr.Where(c => c.User_Code == User.User_Code && lstflag.Contains(c.Flag)).ToList();

                        if (filterUserDcr.Count > 0)
                        {
                            nonFielddays += filterUserDcr.Count;
                        }

                        List<WADcrLockModel> filterDcrActualDate = lstuserDcrActualdate.Where(c => c.User_Code == User.User_Code).ToList();

                        if (filterDcrActualDate.Count > 0)
                        {
                            nonFielddays += filterDcrActualDate.Count;
                        }
                        sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetnonfieldWorkpopup('" + User.User_Code + "_" + startDate + "_" + endDate + "')\" style='text-decoration:underline;cursor:pointer'>" + nonFielddays + "</span></td>");


                        List<WADcrCpModel> filterUserDcrLeave = lstuserDcr.Where(c => c.User_Code == User.User_Code && c.Flag == "L").ToList();

                        if (filterUserDcrLeave.Count > 0)
                        {
                            leaveCount += filterUserDcrLeave.Count;
                        }

                        List<WADcrCpModel> filterUserDcrFlag = lstuserDcr.Where(c => c.User_Code == User.User_Code && c.Flag == "F").ToList();

                        if (filterUserDcrFlag.Count > 0)
                        {
                            monthNonFieldDays = Convert.ToDouble(filterUserDcrFlag.Count) / (Convert.ToDouble(filterUserDcrFlag.Count) + Convert.ToDouble(nonFielddays)) * 100;
                        }
                        else
                        {
                            monthNonFieldDays = 0.0;
                        }
                        if (filterUserDcrFlag.Count > 0)
                        {
                            sbTableContent.Append("<td>" + filterUserDcrFlag.Count + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>0</td>");
                        }

                        if (monthNonFieldDays != 0.0)
                        {
                            sbTableContent.Append("<td>" + monthNonFieldDays.ToString("N2") + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>0.0</td>");
                        }

                        double doctorAvg = 0.0, avg = 0.0;
                        int missedCallCount = 0, monthTodalDoc = 0;
                        int doctorCategoryCount = 0, doctorVisitCount = 0, repeatCalls = 0, callCoverageCount = 0;

                        List<WACustomerModel> filterUserCustomer = lstuserDcrCustomer.Where(c => c.User_Code == User.User_Code).ToList();

                        if (filterUserCustomer.Count > 0)
                        {
                            doctorAvg = ((Convert.ToDouble(filterUserCustomer.Count) / (Convert.ToDouble(filterUserDcrFlag.Count) * 12))) * 100;
                        }
                        sbTableContent.Append("<td >" + doctorAvg.ToString("N2") + " </td>");


                        if (lstUserCategory.Count > 0)
                        {
                            foreach (WADoctorCategoryModel category in lstUserCategory)
                            {
                                avg = 0.0;
                                callCoverageCount = 0;
                                //Calls Missed
                                List<MVCModels.HiDoctor_Reports.WACategoryCountModel> categoryFilter = new List<MVCModels.HiDoctor_Reports.WACategoryCountModel>();
                                if (filteruser.Count > 0)
                                {
                                    categoryFilter = lstCategoryCount.Where(c => c.Region_Code == filteruser[0].Region_Code && c.Category == category.Category_Code).ToList();
                                }
                                if (categoryFilter.Count > 0)
                                {
                                    doctorCategoryCount = Convert.ToInt32(categoryFilter[0].Count);
                                }
                                else
                                {
                                    doctorCategoryCount = 0;
                                }
                                if (!string.IsNullOrEmpty(category.Visit_Count))
                                {
                                    doctorVisitCount = Convert.ToInt32(category.Visit_Count);
                                }
                                else
                                {
                                    doctorVisitCount = 0;
                                }
                                repeatCalls = 0;
                                foreach (string month in monthlist)
                                {
                                    List<WACustomerDetail> filtermonth = lstMonth.Where(c => c.Region_Code == filteruser[0].Region_Code && c.Category == category.Category_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2] && Convert.ToInt32(c.Count) > doctorVisitCount).ToList();

                                    if (filtermonth.Count > 0)
                                    {
                                        foreach (WACustomerDetail item in filtermonth)
                                        {
                                            if (!string.IsNullOrEmpty(item.Count))
                                            {
                                                repeatCalls += Convert.ToInt32(item.Count) - doctorVisitCount;
                                                item.Count = doctorVisitCount.ToString();

                                            }
                                        }

                                    }

                                }
                                List<WACustomerDetail> filtermonths = lstMonth.Where(c => c.Region_Code == filteruser[0].Region_Code && c.Category == category.Category_Code).ToList();
                                foreach (WACustomerDetail filter in filtermonths)
                                {
                                    callCoverageCount += Convert.ToInt32(filter.Count);
                                }
                                missedCallCount = 0;
                                ArrayList alUniqueDoctorList = new ArrayList();
                                foreach (string month in monthlist)
                                {
                                    alUniqueDoctorList = new ArrayList();
                                    List<WACustomerDetail> filtermonth = lstMonth.Where(c => c.Region_Code == filteruser[0].Region_Code && c.Category == category.Category_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();

                                    foreach (WACustomerDetail drDoctor in filtermonth)
                                    {
                                        if (!alUniqueDoctorList.Contains(drDoctor.Doctor_Code))
                                        {
                                            alUniqueDoctorList.Add(drDoctor.Doctor_Code);
                                        }
                                    }

                                    List<WACustomerDetail> rowfilter = lstMonth.Where(c => c.Region_Code == filteruser[0].Region_Code && c.Category == category.Category_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2] && Convert.ToInt32((c.Count)) < doctorVisitCount).ToList();

                                    if (rowfilter.Count > 0)
                                    {
                                        foreach (WACustomerDetail drRow in rowfilter)
                                        {
                                            if (!string.IsNullOrEmpty(drRow.Count))
                                            {
                                                missedCallCount += (doctorVisitCount - Convert.ToInt32(drRow.Count));

                                            }
                                        }
                                    }

                                    missedCallCount += (doctorCategoryCount - alUniqueDoctorList.Count) * doctorVisitCount;
                                }


                                if (doctorCategoryCount > 0)
                                {
                                    //tableContent += "<td align='center' style='width:50px;' ><span onclick=\"GetDoctorDetails('" + userDetails.Split('_')[3] + "_" + userDetails.Split('_')[5] + "_" + startDate + "_" + endDate + "_" + drs["Category_Code"].ToString() + "_" + doctorVisitCount + "')\" style='text-decoration:underline;cursor:pointer'>" + missedCallCount + "</span></td>";
                                    sbTableContent.Append("<td align='center' style='width:50px;' ><span onclick=\"GetDoctorDetails('" + User.User_Code + "_" + startDate + "_" + endDate + "_" + category.Category_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + missedCallCount + "</span></td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center' >0</td>");
                                }

                                doctorCategoryCount = (doctorCategoryCount * doctorVisitCount);
                                monthTodalDoc = doctorCategoryCount * monthlist.Count;

                                missedCallCount = monthTodalDoc - missedCallCount;

                                missedCallCount = 0;
                                List<MVCModels.HiDoctor_Reports.WADcrplannedDaysModel> rowfiltercount = new List<MVCModels.HiDoctor_Reports.WADcrplannedDaysModel>();

                                if (monthlist.Count > 0)
                                {
                                    foreach (string month in monthlist)
                                    {
                                        rowfiltercount = lstPlannedDayCount.Where(c => c.User_Code == User.User_Code && c.Category == category.Category_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();
                                        if (rowfiltercount.Count > 0)
                                        {
                                            foreach (WADcrplannedDaysModel item in rowfiltercount)
                                            {
                                                List<WADcrVistedDaysModel> visitedDoctor = lstVisitedCount.Where(c => c.Doctor_Code == item.Doctor_Code && c.User_Code == item.User_Code && c.Category == category.Category_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();
                                                if (visitedDoctor.Count > 0)
                                                {
                                                    if (Convert.ToInt32(item.Planned_Days) > Convert.ToInt32(visitedDoctor[0].Visited_Days))
                                                    {
                                                        missedCallCount += Convert.ToInt32(item.Planned_Days) - Convert.ToInt32(visitedDoctor[0].Visited_Days);
                                                    }
                                                }
                                                else
                                                {
                                                    missedCallCount += Convert.ToInt32(item.Planned_Days);
                                                }
                                            }

                                        }
                                    }
                                }


                                if (missedCallCount > 0)
                                {
                                    // sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetWieldWorkDrillDown('" + userDetails.Split('_')[3] + "_" + userDetails.Split('_')[5] + "_" + startDate + "_" + endDate + "_" + drs["Category_Code"].ToString() + "_MISSEDAGAINSTPLAN')\" style='text-decoration:underline;cursor:pointer'>" + missedCallCount + "</span></td>");
                                    sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetCCallMissedPopup('" + User.User_Code + "_" + startDate + "_" + endDate + "_" + category.Category_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + missedCallCount + "</span></td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center' >0</td>");
                                }

                                if (rowfiltercount.Count > 0 && doctorCategoryCount > 0)
                                {
                                    avg = ((Convert.ToDouble(callCoverageCount) / Convert.ToDouble(monthTodalDoc)) * 100);
                                }
                                if (avg != 0.0)
                                {
                                    sbTableContent.Append("<td align='center'>" + avg.ToString("N2") + " </td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center' >0.0 </td>");
                                }
                                //Repeat Calls
                                if (repeatCalls > 0)
                                {
                                    // sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetWieldWorkDrillDown('" + userDetails.Split('_')[3] + "_" + userDetails.Split('_')[5] + "_" + startDate + "_" + endDate + "_" + drs["Category_Code"].ToString() + "_REPEATECALLS')\" style='text-decoration:underline;cursor:pointer'>" + repeatCalls + "</span></td>");
                                    // sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetWieldWorkDrillDown()\" style='text-decoration:underline;cursor:pointer'>" + repeatCalls + "</span></td>");
                                    sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetRepeatCallpopup('" + User.User_Code + "_" + startDate + "_" + endDate + "_" + category.Category_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + repeatCalls + "</span></td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center' >0</td>");
                                }
                            }
                            // Missed against Plan.
                            missedCallCount = 0;
                        }
                        int tpDeviation = 0;
                        string tpFlag = "";
                        bool isTrue = false;
                        string tempCpCode = string.Empty;
                        List<WAActivityModel> activity = lstActivity.Where(c => c.User_Code == User.User_Code).ToList();
                        if (activity.Count > 0)
                        {
                            foreach (WAActivityModel item in activity)
                            {

                                if (!string.IsNullOrEmpty(item.Activity_Code))
                                {
                                    if (item.Activity_Code.StartsWith("ATY"))
                                    {
                                        tpFlag = "A";
                                    }
                                    else
                                    {
                                        tpFlag = "F";
                                    }
                                }
                                List<WADcrCpModel> filterTp = lstuserDcr.Where(c => c.DCR_Actual_Date == item.TP_Date && c.User_Code == User.User_Code).ToList();
                                isTrue = false;
                                if (filterTp.Count > 0)
                                {
                                    foreach (WADcrCpModel drDCR in filterTp)
                                    {
                                        if (drDCR.Flag.Trim().ToUpper() == tpFlag)
                                        {
                                            isTrue = true;
                                            break;
                                        }
                                    }
                                    if (isTrue && tpFlag == "F")
                                    {

                                        if (!string.IsNullOrEmpty(item.CP_Code))
                                        {
                                            tempCpCode = item.CP_Code;
                                        }
                                        else
                                        {
                                            tempCpCode = "";
                                        }
                                        var filterTpcount = lstuserDcr.Where(c => c.DCR_Actual_Date == item.TP_Date && c.User_Code == User.User_Code && c.Flag == "F" && c.CPM_No == tempCpCode).ToList();
                                        if (filterTpcount.Count == 0)
                                        {
                                            isTrue = false;
                                        }
                                    }
                                }
                                else
                                {
                                    isTrue = true;
                                }
                                if (!isTrue)
                                {
                                    tpDeviation++;
                                }
                            }
                        }
                        if (tpDeviation > 0)
                        {
                            //sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetWieldWorkDrillDown('" + userDetails.Split('_')[3] + "_" + userDetails.Split('_')[5] + "_" + startDate + "_" + endDate + "__TPDEVIATION')\" style='text-decoration:underline;cursor:pointer'>" + tpDeviation + "</span></td>");
                            //sbTableContent.Append("<td align='center'>" + tpDeviation + "</span></td>");
                            sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetTpDeviation('" + User.User_Code + "_" + startDate + "_" + endDate + "')\" style='text-decoration:underline;cursor:pointer'>" + tpDeviation + "</span></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center' >0</td>");
                        }

                        missedCallCount = 0;
                        foreach (WATP item in lstTpcount)
                        {
                            List<WADcrCpModel> tpfilter = lstuserDcr.Where(c => c.DCR_Actual_Date == item.TP_Date && c.Flag == "F").ToList();
                            if (tpfilter.Count > 0)
                            {

                                List<WATP> tp = lstWorkAnalysis[0].lstTp.Where(c => c.TP_Date == item.TP_Date).ToList();
                                foreach (WATP drTPDoctor in tp)
                                {
                                    List<WAtable13> dcrfilter = lstTpdata.Where(c => c.DCR_Actual_Date == item.TP_Date && c.Doctor_Code == drTPDoctor.Doctor_Code).ToList();
                                    if (dcrfilter.Count == 0)
                                    {
                                        missedCallCount++;
                                        break;
                                    }
                                }
                            }
                        }
                        if (missedCallCount > 0)
                        {
                            sbTableContent.Append("<td align='center' style='width:50px;' ><span   onclick=\"GetCpDeviation('" + User.User_Code + "_" + startDate + "_" + endDate + "')\" style='text-decoration:underline;cursor:pointer'>" + missedCallCount + "</span></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");
                        }

                        if (lstparametermodel.Count > 0)
                        {
                            foreach (RatingParameterModel parameter in lstparametermodel)
                            {
                                List<WAParameterValue> Parameterfilter = lstparametervalue.Where(c => c.Parameter_Code == parameter.Parameter_Code && c.User_Code == User.User_Code).ToList();
                                if (Parameterfilter.Count > 0)
                                {

                                    if (!string.IsNullOrEmpty(Parameterfilter[0].Parameter_Value))
                                    {
                                        sbTableContent.Append("<td align='center' align='left' >" + Parameterfilter[0].Parameter_Value + "</td>");
                                    }
                                    else
                                    {
                                        sbTableContent.Append("<td align='center'  align='left' >&nbsp;</td>");
                                    }
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='center' align='left' >&nbsp;</td>");

                                }
                            }
                        }

                    }
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</tbody></table >");
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }

            return sbTableContent;

        }


        public string GetnonfieldWorkpopupdetail(string userCode, string startDate, string endDate)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();
            try
            {
                List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel> lstnonfieldDetail = new List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel>();
                lstnonfieldDetail = (List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel>)_objReport.GetnonfieldWorkpopup(companyCode, userCode, startDate, endDate);

                List<WAPopUpDcrModel> lsttable1 = lstnonfieldDetail[0].lstWApopupDcr.ToList();
                List<WAPopUpDcrLockModel> lsttable2 = lstnonfieldDetail[0].lstWApopupLock;

                if (lstnonfieldDetail.Count > 0)
                {
                    sbTableContent.Append("<table id='tblSummaryTable' class='table table-striped'> <thead>");
                    sbTableContent.Append("<tr><td valign='top' align='left'>Date</td><td valign='top' align='left'  style='white-space:nowrap;'>Type</td ></tr></thead><tbody>");
                    List<string> lstflag = new List<string>() { "A", "L" };
                    List<WAPopUpDcrModel> dr = lsttable1.Where(c => lstflag.Contains(c.Flag)).ToList();
                    if (dr.Count > 0)
                    {
                        foreach (WAPopUpDcrModel item in dr)
                        {
                            sbTableContent.Append("<tr>");
                            if (item.Flag.ToString().ToUpper() == "A")
                            {
                                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + item.DCR_Actual_Date + "</td>");
                                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>Attendance</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + item.DCR_Actual_Date + "</td>");
                                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>Leave</td>");
                            }
                            sbTableContent.Append("</tr>");
                        }

                    }
                    if (lsttable2.Count > 0)
                    {
                        foreach (WAPopUpDcrLockModel drs in lsttable2)
                        {
                            sbTableContent.Append("<tr>");
                            sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + drs.DCR_Actual_Date + "</td>");
                            sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>Lock Leave</td>");
                            sbTableContent.Append("</tr>");
                        }
                    }
                    sbTableContent.Append("</tbody></table>");
                }
                return sbTableContent.ToString();
            }
            catch (Exception ex) { }
            return sbTableContent.ToString();
        }




        public string GetCpDeviationpopupdetail(string userCode, string startDate, string endDate)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();
            try
            {
                List<MVCModels.HiDoctor_Reports.CPdeviationModel> lstCp = new List<MVCModels.HiDoctor_Reports.CPdeviationModel>();
                lstCp = (List<MVCModels.HiDoctor_Reports.CPdeviationModel>)_objReport.GetCpDeviationpopup(companyCode, userCode, startDate, endDate);

                List<cptable1> lsttable1 = lstCp[0].lstTable1;
                List<cptable2> lsttable2 = lstCp[0].lstTable2;
                List<cptable3> lsttable3 = lstCp[0].lstTable3;
                if (lsttable1.Count > 0)
                {
                    sbTableContent.Append("<table id='tblDoctorPOPUp' class='table table-striped'>");
                    sbTableContent.Append("<thead><tr><td valign='top' align='left'>Date</td>");
                    sbTableContent.Append("<td valign='top' align='left'>Doctors as per CP not visited</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead><tbody>");
                    foreach (cptable1 drTP in lsttable1)
                    {
                        List<cptable3> dr = lsttable3.Where(c => c.DCR_Actual_Date == drTP.TP_Date && c.Flag == "F").ToList();
                        if (dr.Count > 0)
                        {
                            List<cptable2> dcrfilter = lsttable2.Where(c => c.DCR_Actual_Date == drTP.TP_Date && c.Doctor_Code == drTP.Doctor_Code).ToList();
                            if (dcrfilter.Count == 0)
                            {
                                sbTableContent.Append("<tr>");
                                sbTableContent.Append("<td valign='top' align='left'>" + drTP.TP_Date + "</td>");
                                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + drTP.Doctor_Name + "</td>");
                                sbTableContent.Append("</tr>");
                            }
                        }
                    }
                    sbTableContent.Append("</tbody></table>");
                }

                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {



            }
            return sbTableContent.ToString();
        }


        public string GetCCallMissedPopupDetail(string userCode, string startDate, string endDate, string category)
        {

            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();

            DateTime dtEndDate = new DateTime();
            DateTime dtStartDate = new DateTime();
            ArrayList monthlist = new ArrayList();
            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);

            DateTime dtTemp;

            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());
                }
            }




            List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel> lst = new List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel>();
            lst = (List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel>)_objReport.GetCCallMissedPopup(companyCode, userCode, startDate, endDate, category);

            DataTable dtMissed = new DataTable();
            DataRow drNewRow;
            DataRow[] tpDayFilter;
            dtMissed.Columns.Add(new DataColumn("Doctor_Code"));
            dtMissed.Columns.Add(new DataColumn("Doctor_Name"));
            dtMissed.Columns.Add(new DataColumn("Month"));
            dtMissed.Columns.Add(new DataColumn("Year"));
            dtMissed.Columns.Add(new DataColumn("Missed_Count"));
            dtMissed.AcceptChanges();
            int count = 0;

            List<GetMissedAgainstPlanTable0> lsttable0 = lst[0].lsttable0;
            List<GetMissedAgainstPlanTable1> lsttable1 = lst[0].lsttable1;
            List<GetMissedAgainstPlanTable2> lsttable2 = lst[0].lsttable2;
            List<GetMissedAgainstPlanTable3> lsttable3 = lst[0].lsttable3;
            List<GetMissedAgainstPlanTable4> lsttable4 = lst[0].lsttable4;
            if (lsttable0.Count > 0)
            {
                sbTableContent.Append("<table id='tblDoctorPOPUp' class='table table-striped'>");
                sbTableContent.Append("<thead>");

                if (monthlist.Count > 0)
                {
                    foreach (string month in monthlist)
                    {
                        sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + month.Split('_')[0] + "</td>");
                    }
                }
                sbTableContent.Append("</tr>");
                sbTableContent.Append("</thead>");
                if (monthlist.Count > 0)
                {
                    foreach (GetMissedAgainstPlanTable0 drDoctor in lsttable0)
                    {
                        foreach (string month in monthlist)
                        {
                            List<GetMissedAgainstPlanTable0> dr = lsttable0.Where(c => c.Doctor_Code == drDoctor.Doctor_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();
                            if (dr.Count > 0)
                            {

                                List<GetMissedAgainstPlanTable1> tpfilter = lsttable1.Where(c => c.Doctor_Code == drDoctor.Doctor_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();

                                if (tpfilter.Count > 0)
                                {

                                    if (Convert.ToInt32(tpfilter[0].Visited_Days) < Convert.ToInt32(drDoctor.Planned_Days))
                                    {
                                        count = Convert.ToInt32(drDoctor.Planned_Days) - (Convert.ToInt32(tpfilter[0].Visited_Days));

                                        if (dtMissed.Select("Doctor_Code = '" + drDoctor.Doctor_Code + "' AND  Month='" + month.Split('_')[1] + "' AND Year='" + month.Split('_')[2] + "'").Length == 0)
                                        {

                                            drNewRow = dtMissed.NewRow();
                                            drNewRow["Doctor_Code"] = drDoctor.Doctor_Code;
                                            drNewRow["Doctor_Name"] = drDoctor.Doctor_Name;
                                            drNewRow["Month"] = month.Split('_')[1];
                                            drNewRow["Year"] = month.Split('_')[2];
                                            drNewRow["Missed_Count"] = count.ToString();

                                            dtMissed.Rows.Add(drNewRow);
                                            dtMissed.AcceptChanges();
                                        }

                                    }


                                }

                                else
                                {
                                    if (dtMissed.Select("Doctor_Code = '" + drDoctor.Doctor_Code + "' AND  Month='" + month.Split('_')[1] + "' AND Year='" + month.Split('_')[2] + "'").Length == 0)
                                    {
                                        count = Convert.ToInt32(drDoctor.Planned_Days);

                                        drNewRow = dtMissed.NewRow();
                                        drNewRow["Doctor_Code"] = drDoctor.Doctor_Code;
                                        drNewRow["Doctor_Name"] = drDoctor.Doctor_Name;
                                        drNewRow["Month"] = month.Split('_')[1];
                                        drNewRow["Year"] = month.Split('_')[2];
                                        drNewRow["Missed_Count"] = count.ToString();

                                        dtMissed.Rows.Add(drNewRow);
                                        dtMissed.AcceptChanges();
                                    }
                                }

                            }
                        }

                    }
                    if (dtMissed.Rows.Count > 0)
                    {
                        sbTableContent.Append("<tbody>");
                        sbTableContent.Append("<tr>");
                        string doctorNames = "";
                        foreach (string month in monthlist)
                        {
                            tpDayFilter = dtMissed.Select("Month = '" + month.Split('_')[1] + "' AND Year = '" + month.Split('_')[2] + "'");
                            doctorNames = "";
                            foreach (DataRow drMissed in tpDayFilter)
                            {
                                doctorNames += drMissed["Doctor_Name"].ToString().Trim() + " (" + drMissed["Missed_Count"].ToString().Trim() + ")" + "<br>";
                            }
                            if (!string.IsNullOrEmpty(doctorNames))
                            {
                                doctorNames = doctorNames.TrimEnd(',');
                            }
                            sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + doctorNames + "</td>");

                        }
                        sbTableContent.Append("</tr>");
                        sbTableContent.Append("</tbody>");
                    }

                }
                sbTableContent.Append("</table>");
            }
            return sbTableContent.ToString();

        }

        public string GetDoctorDetailsPopup(string userCode, string startDate, string endDate, string category)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();

            int categoryVisitCount = 0;
            int count = 0;
            string visitDate = string.Empty;
            DateTime dtEndDate = new DateTime();
            DateTime dtStartDate = new DateTime();
            ArrayList monthlist = new ArrayList();
            int numberMonthMissed = 0;
            int totalCallsMissed = 0;

            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);

            DateTime dtTemp;

            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());

                }
            }



            List<MVCModels.HiDoctor_Reports.GetDoctorCallModel> lstdata = new List<MVCModels.HiDoctor_Reports.GetDoctorCallModel>();
            lstdata = (List<MVCModels.HiDoctor_Reports.GetDoctorCallModel>)_objReport.GetDoctorCallDetail(companyCode, userCode, startDate, endDate, category);

            List<DoctorCallPopuptable0> lsttable0 = lstdata[0].lsttable0;
            List<DoctorCallPopuptable1> lsttable1 = lstdata[0].lsttable1;
            List<DoctorCallPopuptable2> lsttable2 = lstdata[0].lsttable2;

            if (lsttable0.Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'> <thead>");
                sbTableContent.Append("<tr class='GridHeader'><td valign='top' align='left'  style='white-space:nowrap;'>Doctor Name</td><td valign='top' align='left'  style='white-space:nowrap;'>Speciality Name</td >");
                foreach (string month in monthlist)
                {
                    sbTableContent.Append("<td valign='top' align='left'>" + month.Split('_')[0] + "</td>");
                }
            }
            sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>Total number months missed</td><td valign='top' align='left'  style='white-space:nowrap;'>Total Calls Missed</td></tr></thead><tbody>");
            if (lsttable2.Count > 0)
            {
                categoryVisitCount = Convert.ToInt32(lsttable2[0].Visit_Count);

            }
            else
            {
                categoryVisitCount = 0;
            }


            foreach (DoctorCallPopuptable0 dr in lsttable0)
            {
                numberMonthMissed = 0;
                totalCallsMissed = 0;
                sbTableContent.Append("<tr >");
                sbTableContent.Append("<td>" + dr.Customer_Name + "</td><td>" + dr.Speciality_Name + "</td>");
                count = 0;
                if (monthlist.Count > 0)
                {
                    foreach (string month in monthlist)
                    {

                        visitDate = "";
                        List<DoctorCallPopuptable1> drFilter = lsttable1.Where(c => c.Customer_Code == dr.Customer_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();
                        if (drFilter.Count > 0)
                        {

                            foreach (DoctorCallPopuptable1 day in drFilter)
                            {
                                visitDate += day.Day + ",";
                            }
                        }
                        if (drFilter.Count < categoryVisitCount)
                        {
                            numberMonthMissed++;
                            totalCallsMissed += categoryVisitCount - drFilter.Count;
                        }
                        if (!string.IsNullOrEmpty(visitDate))
                        {
                            visitDate = visitDate.TrimEnd(',');
                        }
                        sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + visitDate + "</td>");
                    }

                }
                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + numberMonthMissed + "</td>");
                sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + totalCallsMissed + "</td></tr>");


            }

            sbTableContent.Append("</tbody></table>");
            return sbTableContent.ToString();
        }


        public string GettpDeviationpopupdetail(string userCode, string startDate, string endDate)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();

            List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel> lstdata = new List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel>();
            lstdata = (List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel>)_objReport.GetTpdivationDetail(companyCode, userCode, startDate, endDate);

            List<TPdivCpmodel> lsttable0 = lstdata[0].lsttable0;
            List<TPdivActivityModel> lsttable1 = lstdata[0].lsttable1;


            if (lsttable0.Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'> <thead>");
                sbTableContent.Append("<thead><tr><td valign='top' align='left'>Deviation Date</td><td valign='top' align='left'>Reason for deviation</td>");
                sbTableContent.Append("</tr><thead>");
                sbTableContent.Append("<tbody>");

                string tpFlag = "";
                string deviationReason = "";
                bool isTrue = false;


                foreach (TPdivActivityModel drRow in lsttable1)
                {

                    if (!string.IsNullOrEmpty(drRow.Activity_Code))
                    {
                        if (drRow.Activity_Code.StartsWith("ATY"))
                        {
                            tpFlag = "A";
                        }
                        else
                        {
                            tpFlag = "F";
                        }

                    }
                    isTrue = false;
                    deviationReason = "";

                    List<TPdivCpmodel> drFilter = lsttable0.Where(c => c.DCR_Actual_Date == drRow.TP_Date).ToList();

                    if (drFilter.Count > 0)
                    {
                        foreach (TPdivCpmodel dcrRow in drFilter)
                        {
                            if (!string.IsNullOrEmpty(dcrRow.Flag))
                            {
                                if (dcrRow.Flag == tpFlag)
                                {
                                    isTrue = true;
                                    break;
                                }
                            }
                        }
                        if (!isTrue)
                        {
                            deviationReason = "Activity deviation";
                        }
                        else if (isTrue && tpFlag == "F")
                        {
                            List<TPdivCpmodel> dr = lsttable0.Where(c => c.DCR_Actual_Date == drRow.TP_Date && c.Flag == "F" && c.CPM_No == drRow.CP_Code).ToList();


                            if (dr.Count == 0)
                            {
                                deviationReason = "CP deviation";
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(deviationReason))
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + drRow.TP_Date + "</td>");
                        sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + deviationReason + "</td>");
                        sbTableContent.Append("</tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
            }


            return sbTableContent.ToString();
        }


        public string GetRepeatCallpopupDetail(string userCode, string startDate, string endDate, string category)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();

            List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel> lstdata = new List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel>();
            lstdata = (List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel>)_objReport.GetRepeatsCallPopup(companyCode, userCode, startDate, endDate, category);

            List<table1> lsttable0 = lstdata[0].lsttable0;
            List<table2> lsttable1 = lstdata[0].lsttable1;
            List<table3> lsttable2 = lstdata[0].lsttable2;

            int categoryVisitCount = 0;

            DateTime dtEndDate = new DateTime();
            DateTime dtStartDate = new DateTime();
            ArrayList monthlist = new ArrayList();

            DataRow[] subFilter;
            string dates = "";

            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);

            DateTime dtTemp;

            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());

                }
            }
            if (lsttable2.Count > 0)
            {
                categoryVisitCount = Convert.ToInt32(lsttable2[0].Visit_Count);

            }
            else
            {
                categoryVisitCount = 0;
            }
            sbTableContent.Append("<table class='table table-striped'> <thead>");
            sbTableContent.Append("<thead><tr><td>Doctor Name</td><td>Speciality Name</td >");
            if (monthlist.Count > 0)
            {
                foreach (string month in monthlist)
                {
                    sbTableContent.Append("<td>" + month.Split('_')[0] + "</td>");
                }
            }
            sbTableContent.Append("</tr></thead><tbody>");
            ArrayList alUniqueDoctorList = new ArrayList();

            List<table2> drFilter = lsttable1.Where(c => Convert.ToInt32((c.Count)) > categoryVisitCount).ToList();
            if (drFilter.Count > 0)
            {
                foreach (table2 item in drFilter)
                {
                    if (!alUniqueDoctorList.Contains(item.Doctor_Code))
                    {
                        alUniqueDoctorList.Add(item.Doctor_Code);

                        List<table1> subdrFilter = lsttable0.Where(c => c.Customer_Code == item.Doctor_Code).ToList();
                        sbTableContent.Append("<tr>");
                        if (subdrFilter.Count > 0)
                        {
                            sbTableContent.Append("<td >" + subdrFilter[0].Doctor_Name + "</td>");
                            sbTableContent.Append("<td >" + subdrFilter[0].Speciality_Name + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td >-</td>");
                            sbTableContent.Append("<td>-</td>");
                        }

                        int tempCount = 0;
                        foreach (string month in monthlist)
                        {
                            List<table1> subFiltermonth = lsttable0.Where(c => c.Customer_Code == item.Doctor_Code && c.Month == month.Split('_')[1] && c.Year == month.Split('_')[2]).ToList();

                            dates = "";
                            tempCount = 0;

                            foreach (table1 drDoctor in subFiltermonth)
                            {
                                tempCount++;

                                if (tempCount > categoryVisitCount)
                                {
                                    dates += drDoctor.Day + ",";
                                }
                            }

                            if (!string.IsNullOrEmpty(dates))
                            {
                                dates = dates.TrimEnd(',');
                            }

                            sbTableContent.Append("<td valign='top' align='left'  style='white-space:nowrap;'>" + dates + "</td>");
                        }
                        sbTableContent.Append("</tr>");
                    }
                }

            }
            return sbTableContent.ToString();
        }




        //--------------------------------END - WORK ANALYSIS ----------------------------------------------------------------//
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

        //  Payslip Report

        public string GetPayslipReport(FormCollection collection)
        {

            //   StringBuilder sbTableConetnt = new StringBuilder();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string reportView = collection["reportView"].ToString();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            string userCode = _objCurInfo.GetUserCode();
            string subDomain = _objCurInfo.GetSubDomain();
            string reportName = collection["title"].ToString();
            string userTypeCode = _objCurInfo.GetUserTypeCode();
            //   sbTableConetnt = GetPayslipReportHTML(companyCode, userCode, month, year, userTypeCode);
            return GetPayslipReportHTML(companyCode, userCode, month, year, userTypeCode, subDomain, reportView, reportName);
        }

        public string GetPayslipReportHTML(string companyCode, string userCode, string month, string year, string userTypeCode, string subDomain, string reportView, string reportName)
        {
            try
            {
                string tableContent = string.Empty;
                StringBuilder sbTableConetent = new StringBuilder();
                BL_ReportRegion objPayslip = new BL_ReportRegion();

                DataSet ds = new DataSet();
                ds = objPayslip.GetPayslipReport(companyCode, month, year, userCode, userTypeCode);
                DataTable dtMetaData = ds.Tables[0];
                DataTable dtPayslipDetails = ds.Tables[1];
                // StringBuilder sbTableContent = new StringBuilder();
                int totalZones = 0;
                int totalRows = 0;
                int totalCols = 0;
                int i = 0;
                int j = 0;
                int k = 0;
                int colIndex = 0;
                DataSet dsHeaders = new DataSet();
                DataRow[] rowFilter;
                DataRow[] rowFilter1;
                string labelText = string.Empty;
                string columnName = string.Empty;
                string columnNo = string.Empty;
                string valign = string.Empty;
                string halign = string.Empty;
                string valign1 = string.Empty;
                string halign1 = string.Empty;
                string value = string.Empty;
                string value1 = string.Empty;
                string columnType = string.Empty;
                double checkValue = 0.0;
                int rowCount = 0;
                bool isCheck = true;

                Regex regExInt = new Regex("^([0-9]*)$");
                Regex decimalRegex = new Regex(@"^[0-9]([\.\,][0-9]{1,3})?$");
                List<MVCModels.HiDoctor_Master.UserModel> response = null;
                if (dtPayslipDetails.Rows.Count > 0)
                {
                    DataControl.BLUser objUser = new DataControl.BLUser();
                    response = objUser.GetLogo(companyCode, userCode).ToList();

                    totalZones = objPayslip.GetMaxZoneIndex(companyCode, userTypeCode);
                    sbTableConetent.Append("<div id='divPayslip'>");
                    if (totalZones > 0)
                    {
                        sbTableConetent.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");

                        // string strPath = "Images/Company_Logo/" + subDomain + ".jpg";

                        sbTableConetent.Append("<table width='100%' cellspacing='0' cellpadding='1' border='0' >");
                        if(response.Count > 0 && response.Count < 2)
                        {
                         string   divisionCode = response[0].Division_Code;
                            var filename = "~/Images/Company_Logo/" + subDomain + "_" + divisionCode + ".jpg";
                          if (System.IO.File.Exists(Server.MapPath(filename)))
                            {
                                sbTableConetent.Append("<tr style='width:100%'><td align='left' valign='top'><img style='display: inline;' id='image' src='Images/Company_Logo/" + subDomain + "_" + divisionCode + ".jpg'></td></tr></table>");
                            }
                            else
                            {
                                sbTableConetent.Append("<tr style='width:100%'><td align='left' valign='top'><img style='display: inline;' id='image' src='Images/Company_Logo/" + subDomain + ".jpg'></td></tr></table>");
                            }
                                
                        }
                        else
                        {
                            sbTableConetent.Append("<tr style='width:100%'><td align='left' valign='top'><img style='display: inline;' id='image' src='Images/Company_Logo/" + subDomain + ".jpg'></td></tr></table>");
                        }

                        for (i = 1; i <= totalZones; i++)
                        {
                            dsHeaders = objPayslip.GetZoneHeaders(Session["Comp_Code"].ToString(), Session["User_Type_Code"].ToString(), i.ToString());
                            string colWidth;

                            if (dsHeaders.Tables[0].Rows.Count > 0)
                            {
                                totalCols = dsHeaders.Tables[0].Rows.Count;
                            }
                            else
                            {
                                totalCols = objPayslip.GetMaxColIndex(Session["Comp_Code"].ToString(), Session["User_Type_Code"].ToString(), i.ToString());
                                totalCols = totalCols * 2;
                            }

                            // Calcultes the <td. column width based on the total columns for the row
                            colWidth = (100 / totalCols).ToString() + "%";

                            if (i != totalZones)
                            {
                                sbTableConetent.Append("<table width='100%' cellspacing='0' cellpadding='1' border='0' style='border-top: 1px solid #000;border-left:1px solid #000;border-right:1px solid #000;font-family:Arial;font-size:9pt;'>");
                            }
                            else if (i != 1)
                            {
                                sbTableConetent.Append("<table width='100%' cellspacing='0' cellpadding='1' border='0' style='border-top: 1px solid #000;border-left:1px solid #000;border-right:1px solid #000;border-bottom:1px solid #000;font-family:Arial;font-size:9pt;'>");
                            }

                            if (dsHeaders.Tables[0].Rows.Count > 0)
                            {
                                sbTableConetent.Append("<tr width='100%'>");

                                for (j = 0; j < dsHeaders.Tables[0].Rows.Count; j++)
                                {
                                    sbTableConetent.Append("<td align='left' width='" + colWidth + "'>" + dsHeaders.Tables[0].Rows[j]["Label_Text"].ToString().Trim() + "</td>");
                                }

                                sbTableConetent.Append("</tr>");
                                sbTableConetent.Append("<tr style='width:100%'>");
                                sbTableConetent.Append("<td colspan='" + dsHeaders.Tables[0].Rows.Count + "' style='width:100%'>&nbsp;</td></tr>");

                                totalRows = objPayslip.GetMaxRowIndex(Session["Comp_Code"].ToString(), Session["User_Type_Code"].ToString(), i.ToString());

                                for (j = 1; j <= totalRows; j++)
                                {
                                    sbTableConetent.Append("<tr>");
                                    colIndex = 0;

                                    for (k = 1; k <= dsHeaders.Tables[0].Rows.Count; k++)
                                    {
                                        colIndex++;
                                        rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + j.ToString() + "' AND Column_Index = '" + k.ToString() + "'");

                                        if (rowFilter.Length > 0)
                                        {
                                            if (rowFilter[0]["Binding_Flag"].ToString().Trim() == "NB")
                                            {
                                                columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                            }
                                            else
                                            {
                                                continue;
                                            }

                                            if (value == "0")
                                            {
                                                int rowIndex = j;
                                                foreach (DataRow row in dtMetaData.Rows)
                                                {
                                                    rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + rowIndex.ToString() + "' AND Column_Index = '" + k.ToString() + "'");
                                                    columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                    columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                    labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                    halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                    valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                    columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                    value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                    if (value != "0")
                                                    {
                                                        row["Binding_Flag"] = "B";
                                                        dtMetaData.AcceptChanges();
                                                        break;
                                                    }
                                                }
                                            }

                                            if (columnType == "Key_Header_Value")
                                            {
                                                sbTableConetent.Append("<td align='left' valign='top'  width='" + colWidth + "'>" + labelText + "</td>");
                                                rowFilter1 = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + j.ToString() + "' AND Column_Index = '" + (k + 1).ToString() + "'");

                                                if (rowFilter1.Length > 0)
                                                {
                                                    columnNo = rowFilter1[0]["Column_No"].ToString().Trim();
                                                    halign1 = rowFilter1[0]["Horizontal_Align"].ToString().Trim();
                                                    valign1 = rowFilter1[0]["Vertical_Align"].ToString().Trim();

                                                    value1 = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                }
                                                else
                                                {
                                                    value1 = "";
                                                }

                                                if (!string.IsNullOrEmpty(value1.Trim()))
                                                {
                                                    sbTableConetent.Append("<td align='" + halign1 + "' valign='" + valign1 + "'  width='" + colWidth + "'> &nbsp: " + value1.ToString() + "</td>");
                                                }
                                                else
                                                {
                                                    sbTableConetent.Append("<td align='" + halign1 + "' valign='" + valign1 + "' width='" + colWidth + "'> &nbsp&nbsp" + value1.ToString() + "</td>");
                                                }

                                                if (!string.IsNullOrEmpty(value.Trim()))
                                                {
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' width='" + colWidth + "'> &nbsp " + value.ToString() + "</td>");
                                                }
                                                else
                                                {
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' width='" + colWidth + "'> &nbsp&nbsp" + value.ToString() + "</td>");
                                                }
                                                k = k + 2;
                                            }
                                            else if (columnType == "Header")
                                            {
                                                if (!string.IsNullOrEmpty(value.Trim()))
                                                {
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' style='font-size:12px;font-family:Arial;' width='" + colWidth + "'> &nbsp" + value.ToString() + "</td>");
                                                }
                                                else
                                                {
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' style='font-size:12px;font-family:Arial;' width='" + colWidth + "'> &nbsp&nbsp" + value.ToString() + "</td>");
                                                }
                                            }
                                        }
                                        else
                                        {
                                            sbTableConetent.Append("<td align='left' valign='top' style='font-size:12px;font-family:Arial;' width='" + colWidth + "'>&nbsp;</td>");
                                        }
                                    }

                                    sbTableConetent.Append("</tr>");
                                }
                            }
                            else
                            {
                                totalRows = objPayslip.GetMaxRowIndex(Session["Comp_Code"].ToString(), Session["User_Type_Code"].ToString(), i.ToString());

                                int tem = 0;
                                int tempRow = 0;
                                for (j = 1; j <= totalRows; j++)
                                {
                                    sbTableConetent.Append("<tr>");
                                    colIndex = 0;
                                    rowCount = 0;
                                    tem = 1;
                                    labelText = "";
                                    value = "";

                                    for (k = 1; k <= totalCols; k++)
                                    {
                                        colIndex++;
                                        labelText = "";
                                        value = "";
                                        columnType = "";
                                        rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + j.ToString() + "' AND Column_Index = '" + colIndex.ToString() + "'");

                                        if (rowFilter.Length > 0)
                                        {
                                            if (rowFilter[0]["Binding_Flag"].ToString().Trim() == "NB")
                                            {

                                                columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                if ((value != "") && (value != "0") && rowFilter[0]["Binding_Flag"].ToString() == "NB")
                                                {
                                                    rowFilter[0]["Binding_Flag"] = "B";
                                                    dtMetaData.AcceptChanges();

                                                }
                                            }
                                            else
                                            {
                                                tempRow = j;

                                                foreach (DataRow row in dtMetaData.Rows)
                                                {
                                                    rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + tempRow.ToString() + "' AND Column_Index = '" + colIndex.ToString() + "'");
                                                    if (rowFilter.Length > 0)
                                                    {
                                                        columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                        columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                        labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                        halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                        valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                        columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                        value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                        if ((value != "") && (value != "0") && rowFilter[0]["Binding_Flag"].ToString() == "NB")
                                                        {
                                                            rowFilter[0]["Binding_Flag"] = "B";
                                                            dtMetaData.AcceptChanges();
                                                            break;
                                                        }
                                                        else
                                                        {
                                                            labelText = "";
                                                            value = "";
                                                            tempRow++;
                                                        }
                                                    }
                                                    else
                                                    {
                                                        tempRow++;
                                                    }
                                                }


                                            }

                                            checkValue = 0.0;
                                            // Disiable the the empty colum and zero values
                                            if (!string.IsNullOrEmpty(value.Trim()))
                                            {

                                                if (regExInt.IsMatch(value) || decimalRegex.IsMatch(value))
                                                {
                                                    checkValue = Convert.ToDouble(value.ToString());
                                                    if (checkValue == 0.0)
                                                    {
                                                        if (j < totalRows)
                                                        {

                                                            int rowIndex = j;
                                                            foreach (DataRow row in dtMetaData.Rows)
                                                            {
                                                                rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + rowIndex.ToString() + "' AND Column_Index = '" + tem.ToString() + "'");
                                                                if (rowFilter.Length > 0)
                                                                {
                                                                    columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                                    columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                                    labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                                    halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                                    valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                                    columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                                    value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                                    if ((value != "") && (value != "0") && rowFilter[0]["Binding_Flag"].ToString() == "NB")
                                                                    {
                                                                        rowFilter[0]["Binding_Flag"] = "B";
                                                                        dtMetaData.AcceptChanges();
                                                                        break;
                                                                    }
                                                                    else
                                                                    {
                                                                        labelText = "";
                                                                        value = "";
                                                                        rowIndex++;
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    rowIndex++;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                // Check Colum type name here 
                                                if (columnType.ToUpper() == "KEY_VALUE")
                                                {

                                                    if (j < totalRows)
                                                    {

                                                        int rowIndex = j;
                                                        foreach (DataRow row in dtMetaData.Rows)
                                                        {
                                                            rowFilter = dtMetaData.Select("Zone_Index = '" + i.ToString() + "' AND Row_Index = '" + rowIndex.ToString() + "' AND Column_Index = '" + tem.ToString() + "'");
                                                            if (rowFilter.Length > 0)
                                                            {
                                                                columnNo = rowFilter[0]["Column_No"].ToString().Trim();
                                                                columnName = rowFilter[0]["Column_Name"].ToString().Trim();
                                                                labelText = rowFilter[0]["Label_Text"].ToString().Trim();
                                                                halign = rowFilter[0]["Horizontal_Align"].ToString().Trim();
                                                                valign = rowFilter[0]["Vertical_Align"].ToString().Trim();
                                                                columnType = rowFilter[0]["Column_Type"].ToString().Trim();
                                                                value = dtPayslipDetails.Rows[0]["Column" + columnNo].ToString().Trim();
                                                                if ((value != "") && (value != "0") && rowFilter[0]["Binding_Flag"].ToString() == "NB")
                                                                {
                                                                    rowFilter[0]["Binding_Flag"] = "B";
                                                                    dtMetaData.AcceptChanges();
                                                                    break;
                                                                }
                                                                else
                                                                {
                                                                    labelText = "";
                                                                    value = "";
                                                                    rowIndex++;
                                                                }

                                                            }
                                                            else
                                                            {
                                                                rowIndex++;
                                                            }
                                                        }
                                                    }

                                                }


                                            }
                                            // Disiable the the empty colum and zero values
                                            checkValue = 0.0;
                                            if (!string.IsNullOrEmpty(value.Trim()))
                                            {
                                                if (regExInt.IsMatch(value) || decimalRegex.IsMatch(value))
                                                {
                                                    checkValue = Convert.ToDouble(value.ToString());
                                                    if (checkValue != 0.0)
                                                    {
                                                        rowCount++;
                                                        sbTableConetent.Append("<td align='left' valign='top' width='" + colWidth + "'>" + labelText + "</td>");
                                                        sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' width='" + colWidth + "'> &nbsp: " + value.ToString() + "</td>");
                                                        tem++;
                                                    }
                                                    else
                                                    {
                                                        isCheck = false;


                                                    }
                                                }
                                                else
                                                {

                                                    rowCount++;
                                                    sbTableConetent.Append("<td align='left' valign='top' width='" + colWidth + "'>" + labelText + "</td>");
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' width='" + colWidth + "'> &nbsp: " + value.ToString() + "</td>");
                                                    tem++;
                                                }

                                            }
                                            else
                                            {
                                                // Check Colum type name here 
                                                if (columnType.ToUpper() == "KEY_VALUE")
                                                {
                                                    isCheck = false;

                                                }
                                                else
                                                {

                                                    rowCount++;

                                                    sbTableConetent.Append("<td align='left' valign='top' width='" + colWidth + "'>" + labelText + "</td>");
                                                    sbTableConetent.Append("<td align='" + halign + "' valign='" + valign + "' width='" + colWidth + "'> &nbsp&nbsp" + value.ToString() + "</td>");
                                                    tem++;
                                                }
                                            }
                                        }
                                    }

                                    if (!isCheck)
                                    {
                                        if (rowCount == 0)
                                        {
                                            tableContent = "";
                                            tableContent = sbTableConetent.ToString().Remove(sbTableConetent.ToString().Length - 4);
                                            sbTableConetent = new StringBuilder();
                                            sbTableConetent.Append(tableContent);
                                            // sbTableConetent.Append(sbTableConetent.ToString().Remove(sbTableConetent.ToString().Length - 4));
                                            // tableContent = tableContent.Remove(tableContent.Length - 4);
                                        }
                                        else
                                        {
                                            sbTableConetent.Append("</tr>");
                                            tem = 1;

                                        }
                                    }
                                    else
                                    {

                                        sbTableConetent.Append("</tr>");
                                        tem = 1;
                                    }
                                }
                            }
                            if (i == totalZones)
                            {
                                sbTableConetent.Append("<tr>");
                                sbTableConetent.Append("<td width='100%' colspan='" + totalCols.ToString() + "' ></td>");
                                sbTableConetent.Append("</tr>");
                                sbTableConetent.Append("</table>");
                            }
                            else
                            {
                                sbTableConetent.Append("<tr>");
                                sbTableConetent.Append("<td width='100%' colspan='" + totalCols.ToString() + "'></td>");
                                sbTableConetent.Append("</tr>");
                                sbTableConetent.Append("</table>");
                            }
                        }

                        sbTableConetent.Append("</table></div>");
                    }

                }
                else
                {
                    sbTableConetent.Append("No data found.");
                }

                if (reportView.Trim() == "2")
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    CurrentInfo _objCurInfo = new CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string Domain = _objCurInfo.GetSubDomain();
                    string fileName = reportName + "_" + Domain + "_" + userName + ".xls";
                    string blobUrl = string.Empty;
                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTableConetent.ToString(), accKey, fileName, "bulkdatasvc");
                    sbTableConetent.Append("<br /><div id='dvURL' class='div-alert'><a href=" + blobUrl + "> Click here to Download </a></div>");
                }
                return sbTableConetent.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public string GetUserLogReport(string userCode, string startDate, string endDate, string viewType)
        {

            try
            {
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();

                IEnumerable<UserLogReportModel> lstUserLogDetails = _objBL_ReportRegion.GetUserLogReport(_objCurrentInfo.GetCompanyCode(), userCode, startDate, endDate);
                if (viewType == "1")
                {
                    return GetUserLogHTMLFormat(lstUserLogDetails, viewType);
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    string userLogHtmlFormat = GetUserLogHTMLFormat(lstUserLogDetails, viewType).ToString();
                    if (!string.IsNullOrEmpty(userLogHtmlFormat))
                    {
                        DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                        DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                        string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                        string userName = _objCurrentInfo.GetUserName();
                        string domainName = _objCurrentInfo.GetSubDomain();

                        string fileName = "UserLogReport" + "_" + domainName + "_" + userName + ".xls";
                        string blobUrl = objAzureBlob.AzureBlobUploadText(userLogHtmlFormat, accKey, fileName, "bulkdatasvc");
                        return ("<br /><div id='dvURL' class='div-alert'><a href=" + blobUrl + "> Click here to Download </a></div>");
                        //  return ("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
                    }
                    else
                    {
                        return "<span>No data Found.</span>";
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", userCode);
                dicContext.Add("Start Date:", startDate);
                dicContext.Add("End Date:", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }

        }
        private string GetUserLogHTMLFormat(IEnumerable<UserLogReportModel> lstUserLog, string viewType)
        {
            StringBuilder sbTableContent = new StringBuilder();
            if (lstUserLog.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped' id='tbluserLogReport' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>IP Address</th>");
                sbTableContent.Append("<th>Login Time</th>");
                sbTableContent.Append("<th>Logout Time</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (UserLogReportModel userLog in lstUserLog)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userLog.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userLog.IP_Address);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userLog.Login_Time);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(userLog.Logout_Time);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                if (viewType == "1")
                {
                    sbTableContent.Append("<span>No data Found.</span>");
                }
                else
                {
                    sbTableContent.Append("");
                }
            }
            return sbTableContent.ToString();

        }
        #region  DoctorProductMapping
        public string GetDoctorProductMapping(string regionCode, string viewFormat, string title, string selectedUser)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();

                List<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> lstDoctorproductmappingdetails = _objRR.GetDoctorProductMappingreport(companyCode, regionCode).ToList();

                if (viewFormat == "S")
                {
                    strTb = DoctorProductMapping(lstDoctorproductmappingdetails, title, selectedUser, regionCode, viewFormat);
                }
                else
                {
                    string lastSubmittedTable = DoctorProductMapping(lstDoctorproductmappingdetails, title, selectedUser, regionCode, viewFormat).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Doctor_Product_Mapping_Report" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regioncode", regionCode);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("title", title);
                dicContext.Add("selectedUser", selectedUser);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder DoctorProductMapping(List<DoctorProductMappingModel> lstDoctorProductMapping, string title, string selectedUser, string regionCode, string viewFormat)
        {
            StringBuilder strTableRept = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            BLUser _objUser = new BLUser();
            string campaignNames = string.Empty;
            string productNames = string.Empty;
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.CampaignDetailsModel> lstCampaignDetails = new List<MVCModels.HiDoctor_Reports.CampaignDetailsModel>();
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(companyCode, "", regionCode).ToList();
                //string generateHeaderTable = _objRR.GetReportHeaderTableforDoctorMaster(companyCode, "", regionCode);
                string currentdate = DateTime.Now.ToString("dd/MM/yyyy");
                if (lstDoctorProductMapping != null && lstDoctorProductMapping.Count() > 0)
                {
                    strTableRept.Append("<div id='DoctorProductMappingReport'>");
                    strTableRept.Append("<div class='dvHeader' id='spnDoctorProductMappingReport'>");
                    //Table Header
                    if (lstUserInfo.Count() > 0)
                    {
                        strTableRept.Append("<div class='dvheader-inner'><b>" + title + " of " + selectedUser.Split('-')[0] + " for the " + selectedUser.Split('-')[1] + " as on  " + currentdate + "</b></div>");
                    }
                    else
                    {
                        strTableRept.Append("<div class='dvheader-inner'><b> " + title + " - " + selectedUser.Split('-')[1] + " as on " + currentdate + "</b></div>");
                    }
                    if (viewFormat == "S")
                    {
                        strTableRept.Append("<div class='helpIconRpt'>");
                        strTableRept.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DOCTOR_PRODUCT_MAPPING_REPORT','HEADER')\" />");
                        strTableRept.Append("</div>");
                    }
                    strTableRept.Append("</div>");

                    //if (lstUserInfo.Count() > 0)
                    //{
                    //    strTableRept.Append("<div>");
                    //    strTableRept.Append(generateHeaderTable);
                    //    strTableRept.Append("</div>");
                    //}
                    strTableRept.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr><th align='left' valign='top'>Doctor Name</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>MDL Number</th><th align='left' valign='top' style='width:50px;'>Category</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Speciality</th><th align='left' valign='top'style='width:370px;'>Campaign(s) in which this doctor is involved</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Product Name</th><th align='left' valign='top'style='width:370px;'>Campaign in which this product is involved</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Yield</th><th align='left' valign='top'style='width:370px;'>Potential</th>");
                    strTableRept.Append("<th align='left' valign='top'style='width:370px;'>Priority</th>");
                    strTableRept.Append("<tbody>");
                    foreach (var doctormapping in lstDoctorProductMapping)
                    {
                        campaignNames = "";
                        productNames = "";
                        var doctorcode = doctormapping.Doctor_Code;
                        lstCampaignDetails = (List<MVCModels.HiDoctor_Reports.CampaignDetailsModel>)_objRR.GetCampaignDetailsforDoctorandProduct(companyCode, regionCode, doctorcode).ToList();
                        //List campaign in which doctor is involved
                        //List of campaign in which Product involved
                        var lstcampaignproducts = lstCampaignDetails[0].lstCampaignProducts.Where(x => x.Product_Code == doctormapping.Product_Code && x.Customer_Code == doctormapping.Doctor_Code).ToList();
                        foreach (var campaignName in lstCampaignDetails[0].lstCampaignDoctors)
                        {
                            if (!string.IsNullOrEmpty(campaignName.Campaign_Name))
                            {
                                campaignNames += campaignName.Campaign_Name + ',';
                            }
                        }

                        foreach (var productName in lstcampaignproducts)
                        {
                            if (!string.IsNullOrEmpty(productName.Campaign_Name))
                            {
                                productNames += productName.Campaign_Name + ',';
                            }
                        }
                        //Doctor Name
                        strTableRept.Append("<tr>");
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Doctor_Name);
                        strTableRept.Append("</td>");
                        //MDL Number
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.MDL_Number);
                        strTableRept.Append("</td>");
                        //Category
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Category_Name);
                        strTableRept.Append("</td>");
                        //Speciality
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Speciality_Name);
                        strTableRept.Append("</td>");
                        //Campaign in which doctor Involved
                        strTableRept.Append("<td>");
                        strTableRept.Append(campaignNames.TrimEnd(','));
                        strTableRept.Append("</td>");
                        //Product Name
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Product_Name);
                        strTableRept.Append("</td>");
                        //Campaign in which the product is involved
                        strTableRept.Append("<td>");
                        strTableRept.Append(productNames.TrimEnd(','));
                        strTableRept.Append("</td>");
                        //Yield
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Yield);
                        strTableRept.Append("</td>");
                        //Potential
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Potential);
                        strTableRept.Append("</td>");
                        //Priority
                        strTableRept.Append("<td>");
                        strTableRept.Append(doctormapping.Priority);
                        strTableRept.Append("</td>");
                        strTableRept.Append("</tr>");
                    }
                    strTableRept.Append("</tbody>");
                    strTableRept.Append("</table>");
                }
                else
                {
                    strTableRept.Append("No Records To Display.");
                }
                return strTableRept;
            }
            catch
            {
                throw;
            }
        }
        #endregion  DoctorProductMapping

        #region DoctorMaster TerritoryWise  Report
        /// <summary>
        /// Get Doctor Details with Speciality and Category
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorMaster(string regionCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strRpt = new StringBuilder();
            string strStartDate = "";
            string strEndDate = "";
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            try
            {
                ArrayList monthList = new ArrayList();
                List<MVCModels.HiDoctor_Master.UserModel> lstUserDetails = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> lstCategoryandSpeciality = new List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel>();
                List<MVCModels.HiDoctor_Master.CustomerModel> lstDoctorMasterCount = new List<MVCModels.HiDoctor_Master.CustomerModel>();
                List<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> lstDoctorVisitCount = new List<MVCModels.HiDoctor_Reports.DoctorProductMappingModel>();
                lstUserDetails = _objRR.GetUserDetails(companyCode, regionCode).ToList();
                lstCategoryandSpeciality = _objRR.GetCategoryandSpecialityMaster(companyCode);

                monthList = GetMonthList(Convert.ToInt16(System.DateTime.Now.Month.ToString()), Convert.ToInt16(System.DateTime.Now.Year.ToString()));

                strRpt.Append("<table id='tblDoctorMaster' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strRpt.Append("<thead class='active'>");
                strRpt.Append("<tr>");
                //User Name
                strRpt.Append("<th>");
                strRpt.Append(lstUserDetails[0].User_Name);
                strRpt.Append("</th>");
                //Month Name

                for (int i = 0; i < monthList.Count; i++)
                {
                    strRpt.Append("<th>");
                    strRpt.Append(monthList[i].ToString().Split('_')[0] + "-" + monthList[i].ToString().Split('_')[2]);
                    strRpt.Append("</th>");
                }

                strRpt.Append("</tr>");
                strRpt.Append("</thead>");
                strRpt.Append("<tbody>");
                //Total Doctors
                strRpt.Append("<tr>");
                strRpt.Append("<td>Total Doctors</td>");
                for (int i = 0; i < monthList.Count; i++)
                {
                    int intDays = System.DateTime.DaysInMonth(Convert.ToInt32(monthList[i].ToString().Split('_')[2]), Convert.ToInt32(monthList[i].ToString().Split('_')[1]));
                    strStartDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-01";
                    strEndDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-" + intDays.ToString();
                    lstDoctorMasterCount = _objRR.GetDoctorMasterCount(companyCode, regionCode, strStartDate, strEndDate).ToList();
                    if (lstDoctorMasterCount.Count > 0 && lstDoctorMasterCount != null)
                    {
                        strRpt.Append("<td>");
                        strRpt.Append(lstDoctorMasterCount.Count);
                        strRpt.Append("</td>");
                    }
                    else
                    {
                        strRpt.Append("<td>0</td>");
                    }
                }
                strRpt.Append("</tr>");
                //Avg Visits
                strRpt.Append("<tr>");
                strRpt.Append("<td>No of Visits</td>");
                for (int i = 0; i < monthList.Count; i++)
                {
                    int intDays = System.DateTime.DaysInMonth(Convert.ToInt32(monthList[i].ToString().Split('_')[2]), Convert.ToInt32(monthList[i].ToString().Split('_')[1]));
                    strStartDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-01";
                    strEndDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-" + intDays.ToString();
                    lstDoctorVisitCount = _objRR.GetDoctorVisitCount(companyCode, lstUserDetails[0].User_Code, strStartDate, strEndDate).ToList();
                    if (lstDoctorVisitCount.Count > 0 && lstDoctorVisitCount != null)
                    {
                        strRpt.Append("<td>");
                        strRpt.Append(lstDoctorVisitCount.Count);
                        strRpt.Append("</td>");
                    }
                    else
                    {
                        strRpt.Append("<td>0</td>");
                    }
                }
                strRpt.Append("</tr>");
                //Category Name
                if (lstCategoryandSpeciality.Count > 0 && lstCategoryandSpeciality != null)
                {
                    foreach (var Category in lstCategoryandSpeciality[0].lstCatory)
                    {
                        strRpt.Append("<tr>");
                        strRpt.Append("<td>");
                        strRpt.Append(Category.Category_Name);
                        strRpt.Append("</td>");
                        for (int i = 0; i < monthList.Count; i++)
                        {
                            int intDays = System.DateTime.DaysInMonth(Convert.ToInt32(monthList[i].ToString().Split('_')[2]), Convert.ToInt32(monthList[i].ToString().Split('_')[1]));
                            strStartDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-01";
                            strEndDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-" + intDays.ToString();
                            lstDoctorMasterCount = _objRR.GetDoctorMasterCount(companyCode, regionCode, strStartDate, strEndDate).ToList();
                            // var filerCategory = lstDoctorMasterCount.Where(x => x.Category == Category.Category_Code && x.Region_Code == regionCode).ToList();
                            var filerCategory = lstDoctorMasterCount.Where(x => x.Category == Category.Category_Code).ToList();
                            if (filerCategory.Count > 0)
                            {
                                strRpt.Append("<td>");
                                strRpt.Append(filerCategory.Count);
                                strRpt.Append("</td>");
                            }
                            else
                            {
                                strRpt.Append("<td>0</td>");
                            }
                        }
                        strRpt.Append("</tr>");
                    }
                }
                //Speciality Count
                if (lstCategoryandSpeciality.Count > 0 && lstCategoryandSpeciality != null)
                {
                    foreach (var Speciality in lstCategoryandSpeciality[0].lstSpeciality)
                    {
                        strRpt.Append("<tr>");
                        strRpt.Append("<td>");
                        strRpt.Append(Speciality.Speciality_Name);
                        strRpt.Append("</td>");
                        for (int i = 0; i < monthList.Count; i++)
                        {
                            int intDays = System.DateTime.DaysInMonth(Convert.ToInt32(monthList[i].ToString().Split('_')[2]), Convert.ToInt32(monthList[i].ToString().Split('_')[1]));
                            strStartDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-01";
                            strEndDate = monthList[i].ToString().Split('_')[2] + "-" + monthList[i].ToString().Split('_')[1] + "-" + intDays.ToString();
                            lstDoctorMasterCount = _objRR.GetDoctorMasterCount(companyCode, regionCode, strStartDate, strEndDate).ToList();
                            //var filterSpeciality = lstDoctorMasterCount.Where(x => x.Speciality_Code == Speciality.Speciality_Code && x.Region_Code == regionCode).ToList();
                            var filterSpeciality = lstDoctorMasterCount.Where(x => x.Speciality_Code == Speciality.Speciality_Code).ToList();
                            if (filterSpeciality.Count > 0)
                            {
                                strRpt.Append("<td>");
                                strRpt.Append(filterSpeciality.Count);
                                strRpt.Append("</td>");
                            }
                            else
                            {
                                strRpt.Append("<td>0</td>");
                            }
                        }
                        strRpt.Append("</tr>");
                    }
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");
                return strRpt.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        /// <summary>
        /// Get Doctor Master Report
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorMasterDetails(string regionCode)
        {
            StringBuilder strRpt = new StringBuilder();
            try
            {
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                List<MVCModels.HiDoctor_Reports.CustomerDetailsModel> lstCustomerDetails = new List<MVCModels.HiDoctor_Reports.CustomerDetailsModel>();
                List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> lstCategoryandSpeciality = new List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel>();
                lstCustomerDetails = _objRR.GetCustomerDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                lstCategoryandSpeciality = _objRR.GetCategoryandSpecialityMaster(_objCurrentInfo.GetCompanyCode()).ToList();

                strRpt.Append("<table id='tblDoctorMasterDetails' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strRpt.Append("<thead class='active'>");
                strRpt.Append("<tr>");
                strRpt.Append("<th>Region Name<th>Doctor Name</th><th>MDL Number</th><th>Category Name</th><th>Speciality Name</th><th>Local Area</th><th>Hospital Name</th>");
                strRpt.Append("</tr>");
                strRpt.Append("</thead>");
                strRpt.Append("<tbody>");
                if (lstCustomerDetails.Count > 0 && lstCustomerDetails != null)
                {
                    foreach (var customerDetails in lstCustomerDetails)
                    {
                        strRpt.Append("<tr>");
                        //Region Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Region_Name);
                        strRpt.Append("</td>");

                        //Doctor Name   

                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Customer_Name.TrimEnd('.').ToString());
                        strRpt.Append("</td>");

                        //MDL Number
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.MDL_Number);
                        strRpt.Append("</td>");
                        //Category Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Category_Name);
                        strRpt.Append("</td>");
                        //Speciality Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Speciality_Name);
                        strRpt.Append("</td>");
                        //Local Area
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Local_Area);
                        strRpt.Append("</td>");
                        //Hospital Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Hospital_Name);
                        strRpt.Append("</td>");
                        strRpt.Append("</tr>");

                    }
                }
                else
                {
                    strRpt.Append("No Records To Display.");
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
            return strRpt.ToString();
        }

        public string GetCustomerMasterDetails(string regionCode)
        {
            StringBuilder strRpt = new StringBuilder();
            try
            {
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                List<MVCModels.HiDoctor_Reports.CustomerDetailsModel> lstCustomerDetails = new List<MVCModels.HiDoctor_Reports.CustomerDetailsModel>();
                List<MVCModels.HiDoctor_Master.UserModel> lstUserDetails = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> lstDoctorVisitDetails = new List<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel>();
                List<MVCModels.HiDoctor_Reports.ProductDetailModel> lstProductdetails = new List<MVCModels.HiDoctor_Reports.ProductDetailModel>();
                lstCustomerDetails = _objRR.GetCustomerDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                lstUserDetails = _objRR.GetUserDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                lstProductdetails = _objRR.GetProductDetails(_objCurrentInfo.GetCompanyCode(), lstUserDetails[0].User_Code).ToList();
                if (lstCustomerDetails.Count > 0 && lstCustomerDetails != null)
                {
                    strRpt.Append("<table id='tblMoreDoctorMasterDetails' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                    strRpt.Append("<thead class='active'>");
                    strRpt.Append("<th>Doctor Name</th><th>MDL Number</th><th>Category Name</th><th>Speciality Name</th>");
                    strRpt.Append("<th>SubRegion Name</th><th>Address 1</th><th>Address 2</th><th>DOB</th><th>Anniversary</th>");
                    strRpt.Append("<th>Avg Visits</th><th>Last Visited Date</th>");
                    strRpt.Append("</tr>");
                    strRpt.Append("</thead>");
                    strRpt.Append("<tbody>");
                    foreach (var customerDetails in lstCustomerDetails)
                    {
                        strRpt.Append("<tr>");
                        //Customer Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Customer_Name);
                        strRpt.Append("</td>");
                        //MDL Number
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.MDL_Number);
                        strRpt.Append("</td>");
                        //Category Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Category_Name);
                        strRpt.Append("</td>");
                        //Speciality Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Speciality_Name);
                        strRpt.Append("</td>");
                        //Sub Region Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.SubRegion_Code);
                        strRpt.Append("</td>");
                        //Address 1
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Address1);
                        strRpt.Append("</td>");
                        //Address 2
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Address2);
                        strRpt.Append("</td>");
                        //DOB
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.DOB);
                        strRpt.Append("</td>");
                        //Anniversary
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Anniversary_Date);
                        strRpt.Append("</td>");
                        //Avg Limits
                        lstDoctorVisitDetails = _objRR.GetDoctorVisitDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                        var filterDoctorVisit = lstDoctorVisitDetails.Where(x => x.Doctor_Code == customerDetails.Customer_Code).ToList();
                        if (filterDoctorVisit.Count > 0 && filterDoctorVisit != null)
                        {
                            if (!string.IsNullOrEmpty(filterDoctorVisit[0].Doctor_Count))
                            {
                                strRpt.Append("<td>");
                                strRpt.Append(filterDoctorVisit[0].Doctor_Count);
                                strRpt.Append("</td>");
                            }
                            else
                            {
                                strRpt.Append("<td>");
                                strRpt.Append(0);
                                strRpt.Append("</td>");
                            }
                            if (!string.IsNullOrEmpty(filterDoctorVisit[0].DCR_Actual_Date))
                            {
                                strRpt.Append("<td align='right' valin='top'><a onclick='fnclicktest(\"" + regionCode + "|" + customerDetails.Customer_Code
                                    + "|" + customerDetails.Customer_Name + "|" + customerDetails.MDL_Number + "|" + customerDetails.Category_Name
                                    + "|" + customerDetails.Speciality_Name + "|" + filterDoctorVisit[0].DCR_Actual_Date + "\");' style='text-decoration:underline;cursor:pointer' href='#'>" + filterDoctorVisit[0].DCR_Actual_Date + "</a></td>");
                            }
                            else
                            {
                                strRpt.Append("<td>-</td>");
                            }
                        }
                        strRpt.Append("</tr>");
                    }
                }
                else
                {
                    strRpt.Append("No Records To Display.");
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");
                return strRpt.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }
        public string GenerateToolTipforDoctorMasterDetails(string regionCode, string doctorCode, string customerName, string mdlNo, string category, string speciality, string lastVisitedDate)
        {
            StringBuilder strTblTooltip = new StringBuilder();
            BLUser _objUser = new BLUser();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = new List<MVCModels.HiDoctor_Master.UserModel>();
            List<MVCModels.HiDoctor_Reports.ProductDetailModel> lstProductdetails = new List<MVCModels.HiDoctor_Reports.ProductDetailModel>();
            lstUserInfo = _objRR.GetUserDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
            lstProductdetails = _objRR.GetProductDetails(_objCurrentInfo.GetCompanyCode(), lstUserInfo[0].User_Code).ToList();
            string subTable = "";
            Regex regExInt = new Regex("^([0-9]*)$");
            try
            {

                strTblTooltip.Append("<table id='tbldetails' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strTblTooltip.Append("<thead class='active'><tr>");
                strTblTooltip.Append("<th align='center' valign='top' colspan='2'>Doctor Details</th>");
                strTblTooltip.Append("</tr></thead>");
                strTblTooltip.Append("<tbody>");
                //Doctor Name
                strTblTooltip.Append("<tr>");
                strTblTooltip.Append("<td>Doctor Name</td>");
                strTblTooltip.Append("<td>");
                strTblTooltip.Append(customerName);
                strTblTooltip.Append("</td>");
                strTblTooltip.Append("</tr>");
                if (lstUserInfo.Count > 0 && lstUserInfo != null)
                {
                    //Doctor Name
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>User Name</td>");
                    strTblTooltip.Append("<td>");
                    strTblTooltip.Append(lstUserInfo[0].User_Name);
                    strTblTooltip.Append("</td>");
                    strTblTooltip.Append("</tr>");
                    //Region Name
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>Region Name</td>");
                    strTblTooltip.Append("<td>");
                    strTblTooltip.Append(lstUserInfo[0].Region_Name);
                    strTblTooltip.Append("</td>");
                    strTblTooltip.Append("</tr>");
                }
                else
                {
                    //Doctor Name
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>Doctor Name</td>");
                    strTblTooltip.Append("<td>***</td>");
                    strTblTooltip.Append("</tr>");
                    //Region Name
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>Region Name</td>");
                    strTblTooltip.Append("<td>***</td>");
                    strTblTooltip.Append("</tr>");
                }
                //MDL Number
                strTblTooltip.Append("<tr>");
                strTblTooltip.Append("<td>MDL Number</td>");
                strTblTooltip.Append("<td>");
                strTblTooltip.Append(mdlNo);
                strTblTooltip.Append("</td>");
                strTblTooltip.Append("</tr>");
                //Category
                strTblTooltip.Append("<tr>");
                strTblTooltip.Append("<td>Category Name</td>");
                strTblTooltip.Append("<td>");
                strTblTooltip.Append(category);
                strTblTooltip.Append("</td>");
                strTblTooltip.Append("</tr>");
                //Speciality
                strTblTooltip.Append("<tr>");
                strTblTooltip.Append("<td>Speciality Name</td>");
                strTblTooltip.Append("<td>");
                strTblTooltip.Append(speciality);
                strTblTooltip.Append("</td>");
                strTblTooltip.Append("</tr>");
                var filtersamplesgiven = lstProductdetails.Where(x => x.Doctor_Code == doctorCode && x.DCR_Actual_Date == lastVisitedDate && x.Product_Type_Name == "Sample").ToList();
                //Samples Given
                if (filtersamplesgiven.Count > 0)
                {
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>Samples Given</td>");
                    subTable = "<table>";
                    foreach (var samplesgiven in filtersamplesgiven)
                    {
                        subTable += "<tr><td>" + samplesgiven.Product_Name + "(" + samplesgiven.Quantity_Provided + ")" + "</td></tr>";
                    }
                    subTable += "</table>";
                    strTblTooltip.Append("<td>");
                    strTblTooltip.Append(subTable);
                    strTblTooltip.Append("<td>");
                    strTblTooltip.Append("</tr>");
                }
                //Samples Detailed
                var filtersample = lstProductdetails.Where(x => x.Doctor_Code == doctorCode && x.DCR_Actual_Date == lastVisitedDate && x.Quantity_Provided == "1").ToList();
                if (filtersample.Count > 0)
                {
                    strTblTooltip.Append("<tr>");
                    strTblTooltip.Append("<td>Samples Detailed</td>");
                    subTable = "<table>";
                    foreach (var samples in filtersample)
                    {
                        subTable += "<tr><td>" + samples.Product_Name + "(" + samples.Quantity_Provided + ")" + "</td></tr>";
                    }
                    subTable += "</table>";
                    strTblTooltip.Append("<td>");
                    strTblTooltip.Append(subTable);
                    strTblTooltip.Append("</td>");
                    strTblTooltip.Append("</tr>");
                }
                //Gifts Given
                var filterGifts = lstProductdetails.Where(x => x.Doctor_Code == doctorCode && x.DCR_Actual_Date == lastVisitedDate && x.Product_Type_Name == "Gift").ToList();
                if (filterGifts.Count > 0)
                {
                    subTable = "<table>";
                    foreach (var gift in filterGifts)
                    {
                        strTblTooltip.Append("<tr>");
                        strTblTooltip.Append("<td>Gifts Given</td>");
                        subTable = "<table>";
                        foreach (var Gifts in filterGifts)
                        {
                            subTable += "<tr><td>" + Gifts.Product_Name + "(" + Gifts.Quantity_Provided + ")" + "</td></tr>";
                        }
                        subTable += "</table>";
                        strTblTooltip.Append("<td>");
                        strTblTooltip.Append(subTable);
                        strTblTooltip.Append("</td>");
                        strTblTooltip.Append("</tr>");
                    }
                }
                //Last Visited Date
                strTblTooltip.Append("<tr>");
                strTblTooltip.Append("<td>Last Visited Date</td>");
                strTblTooltip.Append("<td>");
                strTblTooltip.Append(lastVisitedDate);
                strTblTooltip.Append("</td>");
                strTblTooltip.Append("</tr>");

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


        public ArrayList GetMonthList(int month, int year)
        {
            try
            {
                string strStartDate = year.ToString() + "-" + month.ToString() + "-01";
                int monthCount = 0;

                if (WebConfigurationManager.AppSettings["ReportMonthPeriod"] != null)
                {
                    if (!string.IsNullOrEmpty(WebConfigurationManager.AppSettings["ReportMonthPeriod"].ToString().Trim()))
                    {
                        monthCount = Convert.ToInt16(WebConfigurationManager.AppSettings["ReportMonthPeriod"].ToString().Trim());
                    }
                    else
                    {
                        monthCount = 3;
                    }
                }
                else
                {
                    monthCount = 3;
                }

                ArrayList monthList = new ArrayList();
                DateTime startDate = new DateTime();

                startDate = Convert.ToDateTime(strStartDate);
                startDate = startDate.AddMonths(-monthCount);

                for (int i = 1; i <= monthCount; i++)
                {
                    startDate = startDate.AddMonths(1);
                    monthList.Add(CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(startDate.Month).Substring(0, 3) + "_" + startDate.Month.ToString() + "_" + startDate.Year.ToString());
                }

                return monthList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion DoctorMaster TerritoryWise  Report

        #region DoctorMaster DateWise Report
        /// <summary>
        /// Get Full User Tree
        /// </summary>
        /// <returns></returns>
        //public string GetUserTree(string regionCode)
        //{
        //    DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
        //    BLUser _objUser = new BLUser();
        //    DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        //    StringBuilder strTb = new StringBuilder();
        //    string companyCode = "";   
        //    string strUserName = "";
        //    companyCode = _objCurrentInfo.GetCompanyCode();
        //    regionCode = _objCurrentInfo.GetRegionCode();
        //    List<MVCModels.HiDoctor_Reports.FullTreeDetailsModel> lstFullTreeDetails = new List<MVCModels.HiDoctor_Reports.FullTreeDetailsModel>();
        //    lstFullTreeDetails = _objRR.GetDetailsofChildRegions(companyCode,regionCode).ToList();
        //    try
        //    {
        //        strTb.Append("<table class='table table-striped' cellspacing='0' cellpadding='0'>");
        //        strTb.Append("<tbody>");
        //        int rowCount = 0;
        //        foreach (var lstDetails in lstFullTreeDetails)
        //        {
        //            rowCount++;
        //            strUserName = lstDetails.User_Name;
        //            //Bind the UserTree
        //            strTb.Append("<tr><td align='left' valin='top' style='white-space:nowrap;'><a onclick=\"fnclickDateWise('" + lstDetails.Region_Code + "')\" style='text-decoration:underline;cursor:pointer'> " + strUserName + "," + lstDetails.User_Type_Name + "(" + lstDetails.Region_Name + ") </a></td>");
        //            strTb.Append("</tr>");
        //        }
        //        strTb.Append("</tbody>");
        //        strTb.Append("</table>");
        //        return strTb.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicContext = new Dictionary<string, string>();
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
        //        return "FAIL^" + ex.Message;
        //    }
        //}
        /// <summary>
        /// Get Cound details for All Staus based on Category and Speciality
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorMasterDatewiseReport(string regionCode)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            BLUser _objUser = new BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strRpt = new StringBuilder();
            try
            {
                string companyCode = "";
                string strStatus = "";
                companyCode = _objCurrentInfo.GetCompanyCode();
                List<DoctorMasterReportModel> lstDoctorcategoriesandspecialityes = new List<DoctorMasterReportModel>();
                List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel> lstAllcount = new List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel>();
                List<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel> lstcategoryandSpecialitycountforallStatus = new List<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel>();
                lstDoctorcategoriesandspecialityes = (List<DoctorMasterReportModel>)_objRR.GetCategoryWiseDoctorMasterReport(companyCode, regionCode).ToList();
                lstAllcount = _objRR.GetAllStatusCount(companyCode, regionCode).ToList();
                lstcategoryandSpecialitycountforallStatus = _objRR.GetCategoryandSpecialitycountforAllstatus(companyCode, regionCode).ToList();
                if (lstAllcount.Count > 0 && lstAllcount != null)
                {


                    strRpt.Append("<table id='tblMoreDoctorMasterDetails' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                    strRpt.Append("<thead class='active'>");
                    strRpt.Append("<tr style='background-color: #428bca'>");
                    strRpt.Append("<th>Action</th><th>Date</th><th>Region Name</th><th>Individual Count</th><th>Group Count</th>");
                    //Bind Category Header
                    foreach (var categoryName in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                    {
                        strRpt.Append("<th align='left' valign='top'> " + categoryName.Category_Name + " </th>");
                    }
                    //Bind Speciality Header
                    foreach (var specialityName in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                    {
                        strRpt.Append("<th align='left' valign='top'> " + specialityName.Speciality_Name + " </th>");
                    }
                    strRpt.Append("</tr>");
                    strRpt.Append("</thead>");
                    strRpt.Append("<tbody>");
                    //Applied
                    if (lstAllcount[0].lstAppliedCount.Count > 0 && lstAllcount[0].lstAppliedCount.Count != null)
                    {
                        foreach (var AppliedCount in lstAllcount[0].lstAppliedCount)
                        {
                            double appliedGroupcount = 0;
                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Created_Date == AppliedCount.Created_Date && z.Customer_Status == "2").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    appliedGroupcount += Convert.ToDouble(filterSpecaility.Count);
                                }
                            }

                            strStatus = "Applied";
                            strRpt.Append("<tr>");
                            //Action
                            strRpt.Append("<td><a onclick='fnclickDateWiseforStatus(\"" + lstAllcount[0].lstAppliedCount[0].Region_Code + "|" + lstAllcount[0].lstAppliedCount[0].Created_Date + "|" + strStatus + "\");' style='text-decoration:underline;cursor:pointer'>Applied</a></td>");
                            var filterIndiviualcount = lstAllcount[0].lstAppliedCount.Where(x => x.Region_Code == regionCode && x.Created_Date == AppliedCount.Created_Date).ToList();
                            if (filterIndiviualcount.Count > 0)
                            {
                                //Created Date
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Created_Date);
                                strRpt.Append("</td>");
                                //RegionName
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Region_Name);
                                strRpt.Append("</td>");
                                //Individual count
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount.Count);
                                strRpt.Append("</td>");
                            }
                            //Groupcount
                            strRpt.Append("<td>");
                            strRpt.Append(appliedGroupcount);
                            strRpt.Append("</td>");
                            //Category
                            foreach (var Category in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                            {
                                var filtercategory = lstcategoryandSpecialitycountforallStatus.Where(y => y.Region_Code == regionCode && y.Category == Category.Category_Code && y.Created_Date == AppliedCount.Created_Date && y.Customer_Status == "2").ToList();
                                if (filtercategory.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filtercategory.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Created_Date == AppliedCount.Created_Date && z.Customer_Status == "2").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filterSpecaility.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            //Speciality
                            strRpt.Append("</tr>");
                        }
                    }
                    //Approved
                    if (lstAllcount[0].lstApprovedCount.Count > 0 && lstAllcount[0].lstApprovedCount.Count != null)
                    {
                        foreach (var ApprovedCount in lstAllcount[0].lstApprovedCount)
                        {
                            double approvedGroupCount = 0;
                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Approved_Date == ApprovedCount.Approved_Date && z.Customer_Status == "1").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    approvedGroupCount += Convert.ToDouble(filterSpecaility.Count);
                                }
                            }

                            strStatus = "Approved";
                            strRpt.Append("<tr>");
                            //Action
                            strRpt.Append("<td><a onclick='fnclickDateWiseforStatus(\"" + lstAllcount[0].lstApprovedCount[0].Region_Code + "|" + lstAllcount[0].lstApprovedCount[0].Approved_Date + "|" + strStatus + "\");' style='text-decoration:underline;cursor:pointer'>Approved</a></td>");

                            var filterIndiviualcount = lstAllcount[0].lstApprovedCount.Where(x => x.Region_Code == regionCode && x.Approved_Date == ApprovedCount.Approved_Date).ToList();
                            if (filterIndiviualcount.Count > 0)
                            {
                                //Created Date
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Approved_Date);
                                strRpt.Append("</td>");
                                //RegionName
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Region_Name);
                                strRpt.Append("</td>");
                                //Individual count
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount.Count);
                                strRpt.Append("</td>");
                            }
                            //Groupcount
                            strRpt.Append("<td>");
                            strRpt.Append(approvedGroupCount);
                            strRpt.Append("</td>");
                            //Category
                            foreach (var Category in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                            {
                                var filtercategory = lstcategoryandSpecialitycountforallStatus.Where(y => y.Region_Code == regionCode && y.Category == Category.Category_Code && y.Approved_Date == ApprovedCount.Approved_Date && y.Customer_Status == "1").ToList();
                                if (filtercategory.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filtercategory.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Approved_Date == ApprovedCount.Approved_Date && z.Customer_Status == "1").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filterSpecaility.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            strRpt.Append("</tr>");
                        }
                    }
                    //UnApprove
                    if (lstAllcount[0].lstUnApprovedCount.Count > 0 && lstAllcount[0].lstUnApprovedCount.Count != null)
                    {
                        foreach (var UnApproveCount in lstAllcount[0].lstUnApprovedCount)
                        {
                            double UnapprovedGroupcount = 0;

                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Approved_Date == UnApproveCount.Unapproved_Date && z.Customer_Status == "0").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    UnapprovedGroupcount += Convert.ToDouble(filterSpecaility.Count);
                                }
                            }

                            strStatus = "UnApproved";
                            strRpt.Append("<tr>");
                            //Action
                            strRpt.Append("<td><a onclick='fnclickDateWiseforStatus(\"" + lstAllcount[0].lstUnApprovedCount[0].Region_Code + "|" + lstAllcount[0].lstUnApprovedCount[0].Unapproved_Date + "|" + strStatus + "\");' style='text-decoration:underline;cursor:pointer'>UnApproved</a></td>");
                            var filterIndiviualcount = lstAllcount[0].lstUnApprovedCount.Where(x => x.Region_Code == regionCode && x.Unapproved_Date == UnApproveCount.Unapproved_Date).ToList();
                            if (filterIndiviualcount.Count > 0)
                            {
                                //Created Date
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Unapproved_Date);
                                strRpt.Append("</td>");
                                //RegionName
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount[0].Region_Name);
                                strRpt.Append("</td>");
                                //Individual count
                                strRpt.Append("<td>");
                                strRpt.Append(filterIndiviualcount.Count);
                                strRpt.Append("</td>");
                            }
                            //Groupcount
                            strRpt.Append("<td>");
                            strRpt.Append(UnapprovedGroupcount);
                            strRpt.Append("</td>");
                            //Category
                            foreach (var Category in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                            {
                                var filtercategory = lstcategoryandSpecialitycountforallStatus.Where(y => y.Region_Code == regionCode && y.Category == Category.Category_Code && y.Approved_Date == UnApproveCount.Unapproved_Date && y.Customer_Status == "0").ToList();
                                if (filtercategory.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filtercategory.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            //Speciality
                            foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                            {
                                var filterSpecaility = lstcategoryandSpecialitycountforallStatus.Where(z => z.Region_Code == regionCode && z.Speciality_Code == Speciality.Speciality_Code && z.Approved_Date == UnApproveCount.Unapproved_Date && z.Customer_Status == "0").ToList();
                                if (filterSpecaility.Count > 0)
                                {
                                    strRpt.Append("<td>");
                                    strRpt.Append(filterSpecaility.Count);
                                    strRpt.Append("</td>");
                                }
                                else
                                {
                                    strRpt.Append("<td>0</td>");
                                }
                            }
                            strRpt.Append("</tr>");
                        }
                    }
                }
                else
                {
                    strRpt.Append("No Records To Display.");
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");
                return strRpt.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }
        public string GetDoctorNamesBasedOnStatus(string regionCode, string date, string status)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            BLUser _objUser = new BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.CustomerModel> lstDoctors = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            List<DoctorMasterReportModel> lstDoctorcategoriesandspecialityes = new List<DoctorMasterReportModel>();
            lstDoctorcategoriesandspecialityes = (List<DoctorMasterReportModel>)_objRR.GetDoctorMasterReportDetails(_objCurrentInfo.GetCompanyCode()).ToList();
            StringBuilder strRpt = new StringBuilder();
            string subTable = "";
            try
            {
                string selectedstatus = "";
                switch (status)
                {
                    case "Applied":
                        selectedstatus = "2";
                        break;
                    case "Approved":
                        selectedstatus = "1";
                        break;
                    case "UnApproved":
                        selectedstatus = "2";
                        break;
                    default: break;
                }
                lstDoctors = _objRR.GetDoctorNameforDatewiseReport(_objCurrentInfo.GetCompanyCode(), regionCode, date, selectedstatus).ToList();
                if (lstDoctors.Count > 0 && lstDoctors != null)
                {
                    strRpt.Append("<table  class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                    strRpt.Append("<thead class='active'>");
                    strRpt.Append("<tr style='background-color: #428bca'>");
                    //Bind Category Header
                    foreach (var categoryName in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                    {
                        strRpt.Append("<th align='left' valign='top'> ");
                        strRpt.Append(categoryName.Category_Name);
                        strRpt.Append("</th>");
                    }
                    //Bind Speciality Header
                    foreach (var specialityName in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                    {
                        strRpt.Append("<th align='left' valign='top'>");
                        strRpt.Append(specialityName.Speciality_Name);
                        strRpt.Append("</th>");
                    }
                    strRpt.Append("</thead>");
                    strRpt.Append("<tbody>");
                    strRpt.Append("<tr>");
                    if (lstDoctorcategoriesandspecialityes[0].lstDoctorCategories.Count > 0 && lstDoctorcategoriesandspecialityes[0].lstDoctorCategories != null)
                    {
                        foreach (var Category in lstDoctorcategoriesandspecialityes[0].lstDoctorCategories)
                        {
                            var filterCategory = lstDoctors.Where(x => x.Category == Category.Category_Code).ToList();
                            if (filterCategory.Count > 0)
                            {
                                subTable = "<table>";
                                foreach (var cateGorynames in filterCategory)
                                {
                                    subTable += "<tr><td>" + cateGorynames.Customer_Name + "</tr></td>";
                                }
                                subTable += "</table>";
                            }
                            else
                            {
                                subTable = "";
                            }
                            strRpt.Append("<td align='left' valign='top' style='white-space:nowrap;'>");
                            strRpt.Append(subTable);
                            strRpt.Append("</td>");
                        }
                        subTable = "";
                    }

                    if (lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities.Count > 0 && lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities != null)
                    {
                        foreach (var Speciality in lstDoctorcategoriesandspecialityes[0].lstDoctorspecialities)
                        {
                            var filterSpeciality = lstDoctors.Where(x => x.Speciality_Code == Speciality.Speciality_Code).ToList();
                            if (filterSpeciality.Count > 0)
                            {
                                subTable = "<table>";
                                foreach (var SpecialityNames in filterSpeciality)
                                {
                                    subTable += "<tr><td>" + SpecialityNames.Customer_Name + "</tr></td>";
                                }
                                subTable += "</table>";
                            }
                            else
                            {
                                subTable = "";
                            }
                            strRpt.Append("<td align='left' valign='top' style='white-space:nowrap;'>");
                            strRpt.Append(subTable);
                            strRpt.Append("</td>");
                        }
                        subTable = "";
                    }
                    strRpt.Append("</tr>");
                }
                else
                {
                    strRpt.Append("No Details Found.");
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");

                return strRpt.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("date", date);
                dicContext.Add("status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }
        #endregion DoctorMaster DateWise Report
        public StringBuilder SamplestockforResignedEmployee(List<SamplestockForResignedEmployee> lstSampleStock, string userCode, string startDate, string endDate, string pageHeader, string option)
        {
            StringBuilder strTb = new StringBuilder();
            BLUser _objUser = new BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), userCode, "").ToList();
                string fromDate = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string toDate = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                string generateHeaderTable = _objUser.GetReportHeaderTableString(_objCurrentInfo.GetCompanyCode(), userCode, fromDate, toDate, "Disable", "").ToString();


                strTb.Append("<div id='SampleStackReportforResignedEmployee'>");
                strTb.Append("<div class='dvHeader' id='spnSampleStackReportforResignedEmployee'>");
                if (lstUserInfo.Count() > 0)
                {
                    strTb.Append("<div class='dvheader-inner'><b>" + pageHeader + " of " + lstUserInfo[0].User_Name + " for the period of " + fromDate + " - " + toDate + "</b></div>");
                }
                else
                {
                    strTb.Append("<div class='dvheader-inner'><b>" + pageHeader + " for the period of " + fromDate + " - " + toDate + "</b></div>");
                }
                if (option == "S")
                {
                    strTb.Append("<div class='helpIconRpt'>");
                    strTb.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('SAMPLESTOCKFORRESIGNEDEMPLOYEEREPORT')\" />");
                    strTb.Append("</div>");
                }
                strTb.Append("</div>");
                if (lstUserInfo.Count() > 0)
                {
                    strTb.Append("<div>");
                    strTb.Append(generateHeaderTable);
                    strTb.Append("</div>");
                }
                strTb.Append("<br/>");


                strTb.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'>");
                strTb.Append("<thead >");
                strTb.Append("<tr>");
                strTb.Append("<th>User Name</th><th>User Type</th><th>Territory Name</th><th>Division</th>");
                strTb.Append("<th>Reporting Manager</th><th>Reporting HQ</th><th>No of Product</th><th>LastReceipt Date</th>");
                strTb.Append("</tr>");
                strTb.Append("<tbody>");
                if (lstSampleStock[0].lstSampleReportDate.Count > 0)
                {
                    strTb.Append("<tr>");
                    if (lstUserInfo.Count > 0)
                    {
                        //User Name
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].User_Name);
                        strTb.Append("</td>");
                        //User Type Name
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].User_Type_Name);
                        strTb.Append("</td>");
                        //Territory Name 
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].Region_Name);
                        strTb.Append("</td>");
                        //Division                            
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].Region_Type_Name);
                        strTb.Append("</td>");
                        //Reporting Manager Name                           
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].Reporting_Manager_Name);
                        strTb.Append("</td>");
                        //Reporting HQ                            
                        strTb.Append("<td>");
                        strTb.Append(lstUserInfo[0].Reporting_Manager_Region_Name);
                        strTb.Append("</td>");
                    }
                    string receiptDate = "";
                    //No of Product
                    var filterProduct = lstSampleStock[0].lstSampleReportDate.Where(x => x.User_Code == userCode).ToList();
                    if (filterProduct.Count > 0)
                    {
                        strTb.Append("<td valin='top'><a onclick='fnClickProduct(\"" + userCode
   + "|" + startDate + "|" + endDate + "|" + "\");' style='text-decoration:underline;cursor:pointer' href='#'>" + filterProduct.Count + "</a></td>");
                    }
                    else
                    {
                        strTb.Append("<td>0</td>");
                    }
                    //Last Receipt
                    var filterreceipt = lstSampleStock[0].lstInward.Where(y => y.User_Code == userCode).ToList();
                    if (filterreceipt.Count > 0)
                    {
                        foreach (var fnReceipt in filterreceipt)
                        {
                            if (!string.IsNullOrEmpty(fnReceipt.Inward_Date))
                            {
                                receiptDate += fnReceipt.Inward_Date;
                            }
                        }
                    }
                    else
                    {
                        receiptDate = "-";
                    }
                    strTb.Append("<td>");
                    strTb.Append(receiptDate);
                    strTb.Append("</td>");
                }

                else
                {
                    strTb.Append("No Records to Display.");
                }
                strTb.Append("</tbody>");
                strTb.Append("</table>");
            }
            catch
            {
                throw;
            }
            return strTb;
        }

        public string GenerateInwardDetails(string userCode, string startDate, string endDate, string reportViewType)
        {
            try
            {
                List<SamplestockForResignedEmployee> lstSampleStock = new List<SamplestockForResignedEmployee>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                lstSampleStock = _objRR.GetSampleStockforResignedEmployee(companyCode, userCode, startDate, endDate).ToList();

                if (reportViewType.ToUpper() == "VIEW IN SCREEN")
                {
                    return GenerateInwardDetailsInHTML(lstSampleStock, userCode, startDate, endDate).ToString();
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    if (lstSampleStock[0].lstSampleReportDate.Count > 0 && lstSampleStock[0].lstSampleReportDate != null)
                    {
                        string userLogHtmlFormat = GenerateInwardDetailsInHTML(lstSampleStock, userCode, startDate, endDate).ToString();
                        if (!string.IsNullOrEmpty(userLogHtmlFormat))
                        {
                            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                            string userName = _objCurrentInfo.GetUserName();
                            string domainName = _objCurrentInfo.GetSubDomain();

                            string fileName = "StockSampleStatementAlumni" + "_" + domainName + "_" + userName + ".xls";
                            string blobUrl = objAzureBlob.AzureBlobUploadText(userLogHtmlFormat, accKey, fileName, "bulkdatasvc");
                            return ("<br /><div id='dvURL' class='div-alert'><a href=" + blobUrl + "> Click here to Download </a></div>");
                            //  return ("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
                        }
                        else
                        {
                            return "<span>No data Found.</span>";
                        }
                    }
                    else
                    {
                        return "<span>No data Found.</span>";
                    }
                }
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", userCode);
                dicContext.Add("Start Date:", startDate);
                dicContext.Add("End Date:", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }

        }

        public string GenerateInwardDetailsInHTML(List<SamplestockForResignedEmployee> lstSampleStock, string userCode, string startDate, string endDate)
        {
            StringBuilder strTb = new StringBuilder();
            try
            {
                //Division Name
                string divisionName = "";
                if (lstSampleStock[0].lsDivisionDetails != null)
                    foreach (var item in lstSampleStock[0].lsDivisionDetails)
                    {
                        if (divisionName != "")
                            divisionName = item.Division_Name;
                        else
                            divisionName = divisionName + "," + item.Division_Name;
                    }
                strTb.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
                strTb.Append("<thead><tr>");
                strTb.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                strTb.Append("<tbody>");
                foreach (var userDetails in lstSampleStock[0].lsUserDetail)
                {
                    strTb.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + userDetails.User_Name + "</td>");
                    strTb.Append("<td align='left' ><b>Region Name</b></td><td align='left' >" + userDetails.Region_Name + " </td>");
                    DateTime strDate = Convert.ToDateTime(startDate);
                    DateTime enddate = Convert.ToDateTime(endDate);
                    strTb.Append("<td align='left' ><b>Date Period</b></td><td align='left' >" + strDate.ToString("dd/MM/yyyy") + " to " + enddate.ToString("dd/MM/yyyy") + " </td></tr>");
                    strTb.Append("<tr><td align='left' ><b>Employee Name</b></td><td align='left' > " + userDetails.Employee_Name + " </td>");
                    strTb.Append("<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>  ");
                    strTb.Append("<td align='left' ><b>Reporting To</b></td><td align='left' >  " + userDetails.Manager_Name + " </td></tr>");
                    strTb.Append("<tr><td align='left' ><b>User type Name</b></td><td align='left' > " + userDetails.User_Type_Name + " </td><td ><b>No of Product(s)</b></td><td align='left' >" + lstSampleStock[0].lstSampleReportDate.Count + "</td><td><b>LastReceipt Date</b></td><td>" + userDetails.Inward_Date + "</td></tr>");

                }
                strTb.Append("</tbody>");
                strTb.Append("</table>");

                strTb.Append("<table id='tbldetails' class='data display datatable dataTable' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strTb.Append("<thead>");
                strTb.Append("<tr id='tblTrpop' style='display: none;'>");
                strTb.Append("<th>Product Name</th><th>Product TypeName</th><th>Brand Name</th><th>Product CategoryName</th><th>Opening</th><th>Inward Taken</th><th>Issue</th><th>Closing</th><th>Closing Amount</th>");
                strTb.Append("</tr>");
                strTb.Append("<tr>");
                strTb.Append("<th>Product Name</th><th>Product TypeName</th><th>Brand Name</th><th>Product CategoryName</th><th>Opening</th><th>Inward Taken</th><th>Issue</th><th>Closing</th><th>Closing Amount</th>");
                strTb.Append("</tr>");
                strTb.Append("<tr style='display:none;'><th colspan= '9' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapop()'>Show Filter</span></th></tr>");
                strTb.Append("<tbody>");
                strTb.Append("<tr>");
                if (lstSampleStock[0].lstSampleReportDate.Count > 0 && lstSampleStock[0].lstSampleReportDate != null)
                {
                    foreach (var stockdetails in lstSampleStock[0].lstSampleReportDate)
                    {
                        //Product Name
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Product_Name);
                        strTb.Append("</td>");
                        //Product Type Name
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Product_Type_Name);
                        strTb.Append("</td>");
                        //Brand Name
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Brand_Name);
                        strTb.Append("</td>");
                        //Category Name
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Category_Name);
                        strTb.Append("</td>");
                        //Opening
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Opening);
                        strTb.Append("</td>");
                        //Inward Taken
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Inward_Taken);
                        strTb.Append("</td>");
                        //Issue
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Issued);
                        strTb.Append("</td>");
                        //Closing
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.Closing);
                        strTb.Append("</td>");
                        //Closing Amount
                        strTb.Append("<td>");
                        strTb.Append(stockdetails.ClosingAmount);
                        strTb.Append("</td>");
                        strTb.Append("</tr>");
                    }
                }
                else
                {
                    strTb.Append("No Records To Display.");
                }

                strTb.Append("</tbody>");
                strTb.Append("</table>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
            return strTb.ToString();
        }

        #endregion sample stock for Resigned Employee
        #region ExpenseAnalysis for Alumni
        public string GetExpenseAnalysisForAlumni(string startDate, string endDate, string dcrStatus, string userCode, string docChemistMet, string activityStatus, string viewFormat, string title, string rowCount)
        {
            List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel> lstExpenseAnalysis = new List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel>();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string dcrStatusval = string.Empty, activestatus = string.Empty, docChemistManager = string.Empty;
            try
            {
                lstExpenseAnalysis = _objRR.GetExpenseAnalysisforAlumni(companyCode, userCode, startDate, endDate, dcrStatus, activityStatus).ToList();
                StringBuilder strTb = new StringBuilder();

                string strReport = "";

                dcrStatusval = dcrStatus.TrimEnd(',');
                activestatus = activityStatus.TrimEnd(',');
                docChemistManager = docChemistMet.TrimEnd(',');

                if (viewFormat == "S")
                {
                    strReport = ExpenseAnalysisforAlumniReport(lstExpenseAnalysis, title, dcrStatus, activestatus, startDate, endDate, docChemistMet, userCode, viewFormat, rowCount);
                }
                else
                {
                    string lastSubmittedTable = ExpenseAnalysisforAlumniReport(lstExpenseAnalysis, title, dcrStatus, activestatus, startDate, endDate, docChemistManager, userCode, viewFormat, rowCount).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "EXPENSE_ANALYSIS_REPORT_FOR_ALUMNI" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                    strReport = strTb.ToString();
                }
                return strReport.ToString();
            }
            catch (Exception ex)
            {
                //Dictionary<string, string> dicContext = new Dictionary<string, string>();
                //dicContext.Add("userCode", userCode);
                //dicContext.Add("startDate", startDate);
                //dicContext.Add("endDate", endDate);
                //dicContext.Add("dcrStatus", dcrStatusval);
                //dicContext.Add("docChemistMet", docChemistMet);
                //dicContext.Add("viewFormat", viewFormat);
                //dicContext.Add("title", title);
                //DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }


        /// <summary>
        /// Config for EXPENSE_GROUP_PRINT_FORMAT
        /// </summary>
        /// <param name="Company Code"></param>
        /// <param name="Config Type"></param>
        /// <param name="Config Key"></param>
        /// <returns>String Config Value</returns>
        public string GetReportExpenseGroupPrintFormatConfigValue()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string EXPENSE_GROUP_PRINT_FORMAT = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.REPORT, CONFIG_KEY.EXPENSE_GROUP_PRINT_FORMAT);
            return EXPENSE_GROUP_PRINT_FORMAT;
        }



        public string ExpenseAnalysisforAlumniReport(List<ExpenseAnalysisforAlumniModel> lstExpenseAnalysis, string title, string dcrStatus, string activityStatus, string startDate, string endDate, string docChemistMet, string userCode, string viewFormat, string rowCount)
        {
            BLUser _objUser = new BLUser();
            List<ExpenseAnalysisforAlumni_DoctCountModel> lstDoctorDetails = new List<ExpenseAnalysisforAlumni_DoctCountModel>();
            List<ExpenseAnalysisforAlumni_ChemCountModel> lstChemistDetails = new List<ExpenseAnalysisforAlumni_ChemCountModel>();
            List<ExpenseAnalysisforAlumni_ManagerCountModel> lstManagerDetails = new List<ExpenseAnalysisforAlumni_ManagerCountModel>();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            StringBuilder strTbl = new StringBuilder();
            StringBuilder sbPrintTbl = new StringBuilder();
            StringBuilder sbFooter = new StringBuilder();
            double totalExp = 0.00;
            int doctorCount = 4;
            double totaldistance = 0.00;
            int rowCounts;
            rowCounts = Convert.ToInt16(rowCount);
            try
            {
                string fromDate = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string toDate = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                if (lstExpenseAnalysis.Count > 0 && lstExpenseAnalysis != null)
                {
                    #region Getting Data
                    if (docChemistMet != "" && activityStatus.Contains('F'))
                    {
                        if (docChemistMet.Contains("D"))
                        {
                            lstDoctorDetails = _objRR.GetCustDocCount(companyCode, userCode, startDate, endDate, dcrStatus, "D").ToList();
                        }
                        if (docChemistMet.Contains("C"))
                        {
                            lstChemistDetails = _objRR.GetChemistCount(companyCode, userCode, startDate, endDate, dcrStatus, "C").ToList();
                        }
                        if (docChemistMet.Contains("M"))
                        {
                            lstManagerDetails = _objRR.GetManagerCount(companyCode, userCode, startDate, endDate, dcrStatus, "M").ToList();
                        }
                    }
                    #endregion Getting Data


                    if (docChemistMet.Contains("D"))
                    {
                        doctorCount = doctorCount - 1;
                    }
                    if (docChemistMet.Contains("C"))
                    {
                        doctorCount = doctorCount - 2;
                    }
                    if (docChemistMet.Contains("M"))
                    {
                        doctorCount = doctorCount - 1;
                    }

                    if (lstExpenseAnalysis[0].lstUserDetails.Count > 0 && lstExpenseAnalysis[0].lstUserDetails != null)
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

                        #region Report Header Details
                        List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), userCode, "").ToList();
                        string generateHeaderTable = _objRR.GetReportHeaderTableforDoctorMaster(_objCurrentInfo.GetCompanyCode(), userCode, "");
                        string generateHeaderTablePrint = _objRR.GetReportHeaderTableforExpenseAnalysisAlumini(_objCurrentInfo.GetCompanyCode(), userCode, "");
                        strTbl.Append("<div id='ExpenseAnalysisforAlumni'>");
                        // strTbl.Append("<div class='dvHeader' id='spnAuditTrailforCustomer'>");
                        if (lstUserInfo.Count() > 0)
                        {
                            strTbl.Append("<div class='dvHeader'>");
                            strTbl.Append("<table>");
                            strTbl.Append("<thead>");
                            strTbl.Append("<tr>");
                            strTbl.Append("<th>");
                            strTbl.Append(title + " for the period of " + fromDate + " - " + toDate + "(Considered " + dcrStatusForReport + " DCRs)");
                            strTbl.Append("</th>");
                            strTbl.Append("<th>");
                            strTbl.Append("<div style='float:left;width:100%'>");
                            strTbl.Append("<div style='width: 30%;'>");
                            strTbl.Append("<img style='display: inline;margin-left=35px;' src='Images/Company_Logo/" + _objCurrentInfo.GetSubDomain() + ".jpg'>");
                            strTbl.Append("</div>");
                            strTbl.Append("</div>");
                            strTbl.Append("</th>");
                            if (viewFormat == "S")
                            {
                                strTbl.Append("<th>");
                                strTbl.Append("<div class='helpIconRpt' style='margin-left:178px;'>");
                                strTbl.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('EXPENSE_ANALYSIS_REPORT_FOR_ALUMNI')\" />");
                                strTbl.Append("</div>");
                                strTbl.Append("</th>");
                            }
                            strTbl.Append("</tr>");
                            strTbl.Append("</thead>");
                            strTbl.Append("</table>");
                            strTbl.Append("</div>");


                            ////print

                            //sbPrintTbl.Append("<div class='dvHeader'>");
                            //sbPrintTbl.Append("<table>");
                            //sbPrintTbl.Append("<thead>");
                            //sbPrintTbl.Append("<tr>");
                            //sbPrintTbl.Append("<th>");
                            //sbPrintTbl.Append(title + "for the period of " + fromDate + " - " + toDate + "(Considered " + dcrStatusForReport + " DCRs)");
                            //sbPrintTbl.Append("</th>");
                            //sbPrintTbl.Append("<th>");
                            //sbPrintTbl.Append("<div style='float:left;width:100%'>");
                            //sbPrintTbl.Append("<div style='width: 30%;'>");
                            //sbPrintTbl.Append("<img style='display: inline;margin-left=35px;' src='Images/Company_Logo/" + _objCurrentInfo.GetSubDomain() + ".jpg'>");
                            //sbPrintTbl.Append("</div>");
                            //sbPrintTbl.Append("</div>");
                            //sbPrintTbl.Append("</th>");

                            //sbPrintTbl.Append("</tr>");
                            //sbPrintTbl.Append("</thead>");
                            //sbPrintTbl.Append("</table>");
                            //sbPrintTbl.Append("</div>");
                        }
                        else
                        {
                            strTbl.Append("<div class='dvHeader'>");
                            strTbl.Append("<table>");
                            strTbl.Append("<thead>");
                            strTbl.Append("<tr>");
                            strTbl.Append("<th  align='left' colspan='2'>");
                            strTbl.Append(title + "for the period of " + fromDate + " - " + toDate);
                            strTbl.Append("</th>");
                            strTbl.Append("<th>");
                            strTbl.Append("<div style='float:left;width:100%'>");
                            strTbl.Append("<div style='width: 30%;'>");
                            strTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objCurrentInfo.GetSubDomain() + ".jpg'>");
                            strTbl.Append("</div>");
                            strTbl.Append("</div>");
                            strTbl.Append("</th>");
                            if (viewFormat == "S")
                            {
                                strTbl.Append("<th>");
                                strTbl.Append("<div class='helpIconRpt' style='margin-left:178px;'>");
                                strTbl.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('AUDIT_TRAIL_FOR_NEW_CUSTOMER')\" />");
                                strTbl.Append("</div>");
                                strTbl.Append("</th>");
                            }
                            strTbl.Append("</tr>");
                            strTbl.Append("</thead>");
                            strTbl.Append("</table>");
                            strTbl.Append("</div>");


                            ////print
                            //sbPrintTbl.Append("<div class='dvHeader'>");
                            //sbPrintTbl.Append("<table>");
                            //sbPrintTbl.Append("<thead>");
                            //sbPrintTbl.Append("<tr>");
                            //sbPrintTbl.Append("<th  align='left' colspan='2'>");
                            //sbPrintTbl.Append(title + "for the period of " + fromDate + " - " + toDate);
                            //sbPrintTbl.Append("</th>");
                            //sbPrintTbl.Append("<th>");
                            //sbPrintTbl.Append("<div style='float:left;width:100%'>");
                            //sbPrintTbl.Append("<div style='width: 30%;'>");
                            //sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objCurrentInfo.GetSubDomain() + ".jpg'>");
                            //sbPrintTbl.Append("</div>");
                            //sbPrintTbl.Append("</div>");
                            //sbPrintTbl.Append("</th>");
                            //sbPrintTbl.Append("</tr>");
                            //sbPrintTbl.Append("</thead>");
                            //sbPrintTbl.Append("</table>");
                            //sbPrintTbl.Append("</div>");
                        }
                        strTbl.Append("<br/>");
                        //sbPrintTbl.Append("<br/>");
                        // strTbl.Append("</div>");
                        string strReportExpenseGroupPrintFormatConfig = GetReportExpenseGroupPrintFormatConfigValue().ToUpper();
                        if (lstUserInfo.Count() > 0)
                        {
                            strTbl.Append("<div>");
                            strTbl.Append(generateHeaderTable);
                            strTbl.Append("</div>");
                            //print
                            sbPrintTbl.Append("<div>");

                            switch (strReportExpenseGroupPrintFormatConfig)
                            {
                                case "NO":
                                    #region Print for Header
                                    sbPrintTbl.Append("<div>");
                                    sbPrintTbl.Append(generateHeaderTablePrint);
                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left'>Period: " + fromDate + " to " + toDate + "</th>");
                                    sbPrintTbl.Append("<th align='left'>DCR Status: " + dcrStatusForReport + "</th>");
                                    sbPrintTbl.Append("<th align='left'>Activity Status: " + activityForReport + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    if (docChemistForReport != "")
                                    {
                                        sbPrintTbl.Append("<tr>");
                                        sbPrintTbl.Append("<th colspan='3' align='left'>Includes " + docChemistForReport + " information</th>");
                                        sbPrintTbl.Append("</tr>");
                                    }

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th colspan='3' align='left'><span style='float:left;width:100%;font-size:25px;font-weight:bold;' id='dvPrintTotal'></span></th>");
                                    sbPrintTbl.Append("</tr>");
                                    sbPrintTbl.Append("</thead></table><br />");
                                    #endregion
                                    break;
                                case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                                case "WITH_2COLUMN_HEADER":
                                    #region Print User DEtails 2 Columns
                                    sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                                    sbPrintTbl.Append("<thead>");

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th style='font-size:22px;' align='left'><b>Expense Analysis Alumni–Group Wise Report </b></th>");
                                    sbPrintTbl.Append("<th align='right'>");
                                    sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                                    sbPrintTbl.Append("</th>");
                                    sbPrintTbl.Append("</tr>");

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'><b>" + lstUserInfo[0].Employee_Name + "-" + lstUserInfo[0].Employee_Number + "(" + lstUserInfo[0].User_Name + ")</b></th>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Designation/Division : " + lstUserInfo[0].User_Type_Name + "/" + lstUserInfo[0].Division_Name + "</th>");
                                    sbPrintTbl.Append("</tr>");


                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Territory Name : " + lstUserInfo[0].Region_Name + "</th>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Reporting Manager : " + lstUserInfo[0].Reporting_Manager_Emp_Name + "(" + lstUserInfo[0].Reporting_Manager_Name + ")</th>");
                                    sbPrintTbl.Append("</tr>");


                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Reporting HQ : " + lstUserInfo[0].Reporting_Manager_Region_Name + "</th>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Account Number : " + lstUserInfo[0].Acc_No + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Date of joining : " + ((lstUserInfo[0].User_Date_of_joining == null) ? "-" : lstUserInfo[0].User_Date_of_joining) + "</th>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Phone number : " + ((lstUserInfo[0].User_Mobile_Number == null) ? "NA" : lstUserInfo[0].User_Mobile_Number) + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    //sbPrintTbl.Append(generateHeaderTablePrint);

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Period: " + fromDate + " to " + toDate + "</th>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>DCR Status: " + dcrStatusForReport + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left' style='font-size:16px;'>Activity Status: " + activityForReport + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    if (docChemistForReport != "")
                                    {
                                        sbPrintTbl.Append("<tr>");
                                        sbPrintTbl.Append("<th colspan='2' align='left' style='font-size:16px;'>Includes " + docChemistForReport + " information</th>");
                                        sbPrintTbl.Append("</tr>");
                                    }

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th colspan='2' align='left' style='font-size:16px;'><span style='float:left;width:100%;font-size:25px;font-weight:bold;' id='dvPrintTotal'></span></th>");
                                    sbPrintTbl.Append("</tr>");
                                    sbPrintTbl.Append("</thead></table><br />");

                                    #endregion Print User DEtails
                                    break;
                                case "WITH_SUMMARY":
                                    #region Print for Header
                                    sbPrintTbl.Append("<div>");
                                    sbPrintTbl.Append(generateHeaderTablePrint);
                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th align='left'>Period: " + fromDate + " to " + toDate + "</th>");
                                    sbPrintTbl.Append("<th align='left'>DCR Status: " + dcrStatusForReport + "</th>");
                                    sbPrintTbl.Append("<th align='left'>Activity Status: " + activityForReport + "</th>");
                                    sbPrintTbl.Append("</tr>");

                                    if (docChemistForReport != "")
                                    {
                                        sbPrintTbl.Append("<tr>");
                                        sbPrintTbl.Append("<th colspan='3' align='left'>Includes " + docChemistForReport + " information</th>");
                                        sbPrintTbl.Append("</tr>");
                                    }

                                    sbPrintTbl.Append("<tr>");
                                    sbPrintTbl.Append("<th colspan='3' align='left'><span style='float:left;width:100%;font-size:25px;font-weight:bold;' id='dvPrintTotal'></span></th>");
                                    sbPrintTbl.Append("</tr>");
                                    sbPrintTbl.Append("</thead></table><br />");
                                    #endregion
                                    break;
                            }

                            sbPrintTbl.Append("<div style='float:left;width:100%;font-size:18px;font-weight:bold;' id='dvPrintTotal'></div><br />");

                            sbPrintTbl.Append("</div>");
                        }
                        strTbl.Append("<br/>");
                        //   sbPrintTbl.Append("<br/>");

                        //print



                        #endregion Report Header Details
                        // FOR EXPENSE DETAILS
                        DateTime from = Convert.ToDateTime(startDate);
                        DateTime to = Convert.ToDateTime(endDate);

                        DateTime tempDate = new DateTime();
                        strTbl.Append("<div style='float:left; width:100%;overflow:scroll;'>");
                        strTbl.Append("<table class='data display datatable' cellspacing='0' cellpadding='0' width='100%' id=tblExpenseAnalysisforAlumni border='1'>");

                        sbPrintTbl.Append("<div>");
                        sbPrintTbl.Append("<table cellspacing='0' cellpadding='1' width='100%'>");
                        string rwSpn = "";
                        if (lstExpenseAnalysis[0].lstExpenseType.Count > 0)
                        {
                            rwSpn = "rowspan='2'";
                        }
                        strTbl.Append("<thead style='display:table-header-group;'>");
                        strTbl.Append("<tr>");

                        sbPrintTbl.Append("<thead>");
                        sbPrintTbl.Append("<tr>");


                        if (viewFormat == "E")
                        {
                            strTbl.Append("<th>User Name</th>");
                            strTbl.Append("<th>Employee Name</th>");
                            strTbl.Append("<th>Division Name</th>");
                            strTbl.Append("<th>User DOJ</th>");
                            strTbl.Append("<th>Reporting Manager Name</th>");
                            strTbl.Append("<th>Reporting Manager Region Name</th>");
                            strTbl.Append("<th>Region Name</th>");
                        }

                        strTbl.Append("<th " + rwSpn + ">Date</th><th " + rwSpn + ">Activity Name</th><th " + rwSpn + ">Status</th><th " + rwSpn + ">Category</th><th " + rwSpn + ">Work Place</th><th " + rwSpn + ">From-To(Mode,Distance)</th><th " + rwSpn + ">Sum of Distance</th>");
                        sbPrintTbl.Append("<th>Date</th><th>Activity Name</th>");
                        if (rowCounts != 1)
                        {
                            sbPrintTbl.Append("<th>status</th>");
                        }
                        sbPrintTbl.Append("<th>Category</th><th>Work Place</th><th>From-To(Mode,Distance)</th><th>Sum of Distance</th>");

                        if (docChemistMet.Contains("D"))
                        {
                            strTbl.Append("<th " + rwSpn + ">Doctors Met</th>");
                            sbPrintTbl.Append("<th>Doctors Met</th>");
                        }
                        if (docChemistMet.Contains("C"))
                        {
                            strTbl.Append("<th " + rwSpn + ">Chemist Met</th>");
                            strTbl.Append("<th " + rwSpn + ">Chemist POB</th>");

                            sbPrintTbl.Append("<th>Chemist Met</th>");
                            sbPrintTbl.Append("<th>Chemist POB</th>");
                        }
                        if (docChemistMet.Contains("M"))
                        {
                            strTbl.Append("<th " + rwSpn + ">Accompanist Count</th>");
                            sbPrintTbl.Append("<th>Accompanist Count</th>");
                        }

                        double colsLength = lstExpenseAnalysis[0].lstExpenseType.Count + 1;
                        colsLength = colsLength / 60;
                        if (lstExpenseAnalysis[0].lstExpenseType.Count > 0 && lstExpenseAnalysis[0].lstExpenseType != null)
                        {
                            foreach (var ExpenseType in lstExpenseAnalysis[0].lstExpenseType)
                            {
                                strTbl.Append("<th colspan='3' style='text-align:center; height:50px'>");
                                strTbl.Append(ExpenseType.Expense_Type_Name);
                                strTbl.Append("</th>");

                                sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px' >" + ExpenseType.Expense_Type_Name + "</th>");
                                //sbPrintTbl.Append("<th style='text-align:center; height:50px'>");
                                //sbPrintTbl.Append(ExpenseType.Expense_Type_Name);
                                //sbPrintTbl.Append("</th>");
                            }
                        }
                        strTbl.Append("<th " + rwSpn + ">Total Expense</th>");
                        strTbl.Append("<th " + rwSpn + ">Remarks</th>");
                        strTbl.Append("</tr></thead>");


                        //sbPrintTbl.Append("<th>Total Expense</th>");
                        //sbPrintTbl.Append("<th>Remarks</th>");


                        sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Total Expense</th>");
                        sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Remarks</th>");
                        sbPrintTbl.Append("</tr></thead>");

                        // strTbl.Append("<thead class='active'>");
                        if (lstExpenseAnalysis[0].lstExpenseType.Count > 0 && lstExpenseAnalysis[0].lstExpenseType != null)
                        {

                            strTbl.Append("<thead><tr>");

                            if (docChemistMet.Contains("C"))
                            {
                                strTbl.Append("<th colspan='" + (docChemistMet.TrimEnd(',').Split(',').Length + 8) + "'></th>");
                            }
                            else
                            {
                                strTbl.Append("<th colspan='" + (docChemistMet.TrimEnd(',').Split(',').Length + 7) + "'></th>");
                            }

                            foreach (var Expense in lstExpenseAnalysis[0].lstExpenseType)
                            {
                                strTbl.Append("<th style='height:50px'>Expense Mode(" + Expense.Expense_Type_Name + ")</th>");
                                strTbl.Append("<th style='height:50px'>Eligibility Amount(" + Expense.Expense_Type_Name + ")</th>");
                                strTbl.Append("<th style='height:50px'>Expense Amount(" + Expense.Expense_Type_Name + ")</th>");
                            }

                            strTbl.Append("<th colspan='2'></th>");
                            strTbl.Append("</tr>");
                        }
                        strTbl.Append("</thead><tbody style='display:table-row-group;'>");
                        sbPrintTbl.Append("<tbody style='display:table-row-group;'>");
                        //strTbl.Append("<tbody>");
                        double[] subTotArray = new double[lstExpenseAnalysis[0].lstExpenseType.Count];
                        double[] subTotDocChemistArray = new double[4 - doctorCount];
                        for (int u = 0; u < lstExpenseAnalysis[0].lstExpenseType.Count; u++)
                        {
                            subTotArray[u] = 0.00;
                        }
                        for (int u = 0; u < (4 - doctorCount); u++)
                        {
                            subTotDocChemistArray[u] = 0.00;
                        }
                        #region Date Loop
                        for (tempDate = from; tempDate <= to; tempDate = tempDate.AddDays(1))
                        {

                            string tempDateString = tempDate.ToString("dd/MM/yyyy");
                            List<DCRHeaderforAlumniModel> dcrJson = new List<DCRHeaderforAlumniModel>();
                            List<HolidayModel> holidayJson = new List<HolidayModel>();

                            dcrJson = lstExpenseAnalysis[0].lstDCRHeader.Where(x => x.DCR_Actual_Date == tempDateString).ToList();
                            holidayJson = lstExpenseAnalysis[0].lstHolidays.Where(y => y.Holiday_Date == tempDateString).ToList();

                            // if dcr entered
                            if (dcrJson != null && dcrJson.Count > 0)
                            {
                                for (int k = 0; k < dcrJson.Count; k++)
                                {
                                    strTbl.Append("<tr>");
                                    sbPrintTbl.Append("<tr>");

                                    if (viewFormat == "E")
                                    {
                                        strTbl.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].Employee_Name + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].Division_Name + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                        strTbl.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                                    }

                                    string style = "";

                                    #region Holiday or sunday
                                    if ((holidayJson != null && holidayJson.Count > 0) || tempDate.DayOfWeek.ToString() == "Sunday")
                                    {
                                        style = "style='background-color: #d3d3d3;'";
                                        string holidayOrSunday = "";
                                        if (holidayJson != null && holidayJson.Count > 0)
                                        {
                                            holidayOrSunday = "Holiday";
                                        }
                                        else
                                        {
                                            holidayOrSunday = "Sunday";
                                        }

                                        strTbl.Append("<td " + style + ">" + tempDateString + "</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");

                                        // Holiday/Sunday with Leave
                                        if (dcrJson[k].DCR_Type.ToString() == "Leave")
                                        {
                                            List<MVCModels.HiDoctor_Reports.LeaveTypeModel> lstLeaveTypes = new List<MVCModels.HiDoctor_Reports.LeaveTypeModel>();
                                            lstLeaveTypes = lstExpenseAnalysis[0].lstLeaveTypeNams.Where(z => z.DCR_Code == dcrJson[k].DCR_Code).ToList();
                                            if (lstLeaveTypes != null && lstLeaveTypes.Count > 0)
                                            {
                                                strTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + "-" + lstLeaveTypes[0].Leave_Type_Name + ")</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + "-" + lstLeaveTypes[0].Leave_Type_Name + ")</td>");

                                            }
                                            else
                                            {
                                                strTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");

                                            }
                                        }

                                            // Holiday/Sunday with Attendance
                                        else if (dcrJson[k].DCR_Type.ToString() == "Attendance")
                                        {
                                            List<MVCModels.HiDoctor_Reports.ActivityModel> lstActivities = new List<MVCModels.HiDoctor_Reports.ActivityModel>();
                                            lstActivities = lstExpenseAnalysis[0].lstActivities.Where(l => l.DCR_Code == dcrJson[k].DCR_Code).ToList();
                                            if (lstActivities != null && lstActivities.Count > 0)
                                            {
                                                strTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + "-" + lstActivities[0].Activity_Name + ")</td>");

                                                sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + "-" + lstActivities[0].Activity_Name + ")</td>");

                                            }
                                            else
                                            {
                                                strTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");

                                                sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");

                                            }
                                        }
                                        // Holiday/Sunday with Field
                                        else
                                        {
                                            strTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k].DCR_Type + ")</td>");

                                        }
                                    }

                                    #endregion Holiday  or sunday

                                    #region DCR Activity
                                    else
                                    {
                                        style = "";
                                        strTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                        // Only Leave
                                        if (dcrJson[k].DCR_Type.ToString() == "Leave")
                                        {
                                            List<MVCModels.HiDoctor_Reports.LeaveTypeModel> lstOnlyLeave = new List<MVCModels.HiDoctor_Reports.LeaveTypeModel>();
                                            lstOnlyLeave = lstExpenseAnalysis[0].lstLeaveTypeNams.Where(a => a.DCR_Code == dcrJson[k].DCR_Code).ToList();

                                            if (lstOnlyLeave != null && lstOnlyLeave.Count > 0)
                                            {
                                                strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "(" + lstOnlyLeave[0].Leave_Type_Name + ")</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "(" + lstOnlyLeave[0].Leave_Type_Name + ")</td>");

                                            }
                                            else
                                            {
                                                strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                            }
                                        }


                                            // Only Attendance
                                        else if (dcrJson[k].DCR_Type.ToString() == "Attendance")
                                        {
                                            List<MVCModels.HiDoctor_Reports.ActivityModel> lstOnlyActivity = new List<MVCModels.HiDoctor_Reports.ActivityModel>();
                                            lstOnlyActivity = lstExpenseAnalysis[0].lstActivities.Where(b => b.DCR_Code == dcrJson[k].DCR_Code).ToList();
                                            if (lstOnlyActivity != null && lstOnlyActivity.Count > 0)
                                            {
                                                strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "(" + lstOnlyActivity[0].Activity_Name + ")</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "(" + lstOnlyActivity[0].Activity_Name + ")</td>");

                                            }
                                            else
                                            {
                                                strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                                sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                            }

                                        }
                                        // Only Field
                                        else
                                        {
                                            strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Type + "</td>");
                                        }
                                    }
                                    #endregion DCR Activity

                                    if (dcrJson[k].DCR_Type.ToString() == "Leave")
                                    {
                                        strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Status + "</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Status + "</td>");
                                    }
                                    else
                                    {
                                        if (activityStatus == "F,A" || (dcrJson[k].DCR_Type.ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k].DCR_Type.ToString() == "Attendance" && activityStatus.Contains("A")))
                                        {
                                            strTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Status + "</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].DCR_Status + "</td>");
                                        }
                                        else
                                        {
                                            strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        }
                                    }

                                    //for Leave
                                    if (dcrJson[k].DCR_Type.ToString() == "Leave")
                                    {
                                        int dynColumn = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                                        for (int u = 0; u < (10 + dynColumn - doctorCount); u++)
                                        {
                                            if (u == 0)
                                            {
                                                strTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                // sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                            }
                                            else
                                            {
                                                strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                // sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                            }
                                        }


                                        for (int u = 0; u < (10 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
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
                                        if (activityStatus == "F,A" || (dcrJson[k].DCR_Type.ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k].DCR_Type.ToString() == "Attendance" && activityStatus.Contains("A")))
                                        {

                                            strTbl.Append("<td " + style + ">" + dcrJson[k].Category + "</td>");
                                            strTbl.Append("<td " + style + ">" + dcrJson[k].Place_Worked + "</td>");

                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].Category + "</td>");
                                            sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].Place_Worked + "</td>");

                                            // for HQ
                                            if (dcrJson[k].Category.ToString() == "HQ")
                                            {
                                                if (dcrJson[k].From_Place != null && dcrJson[k].From_Place.ToString() != "")
                                                {
                                                    strTbl.Append("<td " + style + ">" + dcrJson[k].From_Place + "-" + dcrJson[k].To_Place + "(" + dcrJson[k].Travel_Mode + "," + dcrJson[k].Travelled_Kms + ")</td>");
                                                    strTbl.Append("<td " + style + ">" + dcrJson[k].Travelled_Kms + "</td>");

                                                    sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].From_Place + "-" + dcrJson[k].To_Place + "(" + dcrJson[k].Travel_Mode + "," + dcrJson[k].Travelled_Kms + ")</td>");
                                                    sbPrintTbl.Append("<td style='text-align:right'>" + dcrJson[k].Travelled_Kms + "</td>");
                                                    totaldistance += Convert.ToDouble(dcrJson[k].Travelled_Kms);
                                                }
                                                else
                                                {
                                                    strTbl.Append("<td " + style + "></td>");
                                                    sbPrintTbl.Append("<td " + style + "></td>");
                                                }
                                            }
                                            // for other than HQ
                                            else
                                            {
                                                if (dcrJson[k].From_Place != null && dcrJson[k].From_Place.ToString() != "")
                                                {
                                                    strTbl.Append("<td " + style + ">" + dcrJson[k].From_Place + "-" + dcrJson[k].To_Place + "(" + dcrJson[k].Travel_Mode + "," + dcrJson[k].Travelled_Kms + ")</td>");
                                                    strTbl.Append("<td " + style + ">" + dcrJson[k].Travelled_Kms + "</td>");

                                                    sbPrintTbl.Append("<td " + style + ">" + dcrJson[k].From_Place + "-" + dcrJson[k].To_Place + "(" + dcrJson[k].Travel_Mode + "," + dcrJson[k].Travelled_Kms + ")</td>");
                                                    sbPrintTbl.Append("<td style='text-align:right'>" + dcrJson[k].Travelled_Kms + "</td>");
                                                }
                                                else
                                                {
                                                    List<MVCModels.HiDoctor_Reports.InterMediatePlacesModel> lstrdPlaces = new List<MVCModels.HiDoctor_Reports.InterMediatePlacesModel>();
                                                    lstrdPlaces = lstExpenseAnalysis[0].lstPlaces.Where(c => c.DCR_Code == dcrJson[k].DCR_Code && c.DCR_HOP_Flag == dcrJson[k].Flag).ToList();

                                                    if (lstrdPlaces != null && lstrdPlaces.Count > 0)
                                                    {
                                                        strTbl.Append("<td " + style + ">");
                                                        sbPrintTbl.Append("<td " + style + ">");

                                                        // strTbl.Append("<td " + style + ">");
                                                        for (int g = 0; g < lstrdPlaces.Count; g++)
                                                        {
                                                            if (lstrdPlaces[g].Route_Way.ToString() != "R")
                                                            {
                                                                //strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Distance + "," + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + "," + lstrdPlaces[g].Distance + ")</br>");
                                                                sbPrintTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + "," + lstrdPlaces[g].Distance + ")</br>");
                                                                // strTbl.Append(lstrdPlaces[g].Distance);
                                                            }
                                                            else
                                                            {
                                                                // strTbl.Append(lstrdPlaces[g].To_Place + "-" + lstrdPlaces[g].From_Place + "(" + lstrdPlaces[g].Distance + "," + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + "," + lstrdPlaces[g].Distance + ")</br>");
                                                                sbPrintTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + "," + lstrdPlaces[g].Distance + ")</br>");
                                                                // strTbl.Append(lstrdPlaces[g].Distance);
                                                            }
                                                        }
                                                        strTbl.Append("</td>");
                                                        sbPrintTbl.Append("</td>");
                                                        // strTbl.Append("</td>");
                                                    }
                                                    else
                                                    {
                                                        strTbl.Append("<td " + style + "></td>");
                                                        sbPrintTbl.Append("<td " + style + "></td>");
                                                        //  strTbl.Append("<td " + style + "></td>");
                                                    }

                                                    if (lstrdPlaces != null && lstrdPlaces.Count > 0)
                                                    {
                                                        //strTbl.Append("<td " + style + ">");
                                                        strTbl.Append("<td " + style + ">");
                                                        sbPrintTbl.Append("<td " + style + ">");
                                                        double HopDistance = 0.0;
                                                        for (int g = 0; g < lstrdPlaces.Count; g++)
                                                        {
                                                            if (lstrdPlaces[g].Route_Way.ToString() != "R")
                                                            {
                                                                //strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Distance + "," + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                //strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                HopDistance += Convert.ToDouble(lstrdPlaces[g].Distance);
                                                                totaldistance += Convert.ToDouble(lstrdPlaces[g].Distance);

                                                                // strTbl.Append(lstrdPlaces[g].Distance + "</br>");
                                                            }
                                                            else
                                                            {
                                                                // strTbl.Append(lstrdPlaces[g].To_Place + "-" + lstrdPlaces[g].From_Place + "(" + lstrdPlaces[g].Distance + "," + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                //strTbl.Append(lstrdPlaces[g].From_Place + "-" + lstrdPlaces[g].To_Place + "(" + lstrdPlaces[g].Travel_Mode + ")</br>");
                                                                HopDistance += Convert.ToDouble(lstrdPlaces[g].Distance);
                                                                totaldistance += Convert.ToDouble(lstrdPlaces[g].Distance);
                                                                // strTbl.Append(lstrdPlaces[g].Distance + "</br>");
                                                            }
                                                        }
                                                        strTbl.Append(HopDistance);
                                                        strTbl.Append("</td>");

                                                        sbPrintTbl.Append(HopDistance);
                                                        sbPrintTbl.Append("</td>");

                                                        // strTbl.Append("</td>");
                                                    }
                                                    else
                                                    {
                                                        strTbl.Append("<td " + style + "></td>");
                                                        sbPrintTbl.Append("<td " + style + "></td>");
                                                        //  strTbl.Append("<td " + style + "></td>");
                                                    }
                                                }
                                            }

                                            // doctor, chemist, accompanist detail
                                            if (docChemistMet.Length > 0)
                                            {
                                                if (dcrJson[k].DCR_Type.ToString() == "Attendance")
                                                {
                                                    if (docChemistMet.Contains("D"))
                                                    {
                                                        strTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                    }
                                                    if (docChemistMet.Contains("C"))
                                                    {
                                                        strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                        strTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    }
                                                    if (docChemistMet.Contains("M"))
                                                    {
                                                        strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    }
                                                }
                                                else
                                                {
                                                    int docChemistArrCount = 0;

                                                    if (docChemistMet.Contains("D"))
                                                    {
                                                        List<ExpenseAnalysisforAlumni_DoctCountModel> lstDocCount = new List<ExpenseAnalysisforAlumni_DoctCountModel>();
                                                        lstDocCount = lstDoctorDetails.Where(a => a.DCR_Actual_Date == tempDateString).ToList();
                                                        if (lstDocCount != null && lstDocCount.Count > 0)
                                                        {
                                                            strTbl.Append("<td style='text-align:right'>" + lstDocCount[0].Doctor_Count + "</td>");
                                                            sbPrintTbl.Append("<td style='text-align:right'>" + lstDocCount[0].Doctor_Count + "</td>");
                                                            subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(lstDocCount[0].Doctor_Count);
                                                        }
                                                        else
                                                        {//srisudhan
                                                            if (tempDate.DayOfWeek.ToString() == "Sunday")
                                                            {
                                                                strTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                                            }
                                                            else
                                                            {
                                                                strTbl.Append("<td>-</td>");
                                                                sbPrintTbl.Append("<td>-</td>");
                                                            }
                                                        }
                                                        docChemistArrCount++;
                                                    }

                                                    if (docChemistMet.Contains("C"))
                                                    {
                                                        List<ChemistCountModel> lstChemistcount = new List<ChemistCountModel>();
                                                        lstChemistcount = lstChemistDetails[0].lstCust_ChemistCount.Where(b => b.DCR_Actual_Date == tempDateString).ToList();

                                                        if (lstChemistcount != null && lstChemistcount.Count > 0)
                                                        {
                                                            strTbl.Append("<td style='text-align:right'>" + lstChemistcount[0].Chemist_Count + "</td>");
                                                            sbPrintTbl.Append("<td style='text-align:right'>" + lstChemistcount[0].Chemist_Count + "</td>");
                                                            subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(lstChemistcount[0].Chemist_Count);
                                                        }
                                                        else
                                                        {
                                                            strTbl.Append("<td>-</td>");
                                                            sbPrintTbl.Append("<td>-</td>");
                                                        }
                                                        docChemistArrCount++;

                                                        List<POAmountModel> lstPoAmount = new List<POAmountModel>();
                                                        lstPoAmount = lstChemistDetails[0].lstPOAmount.Where(c => c.DCR_Actual_Date == tempDateString).ToList();
                                                        if (lstPoAmount != null && lstPoAmount.Count > 0)
                                                        {
                                                            strTbl.Append("<td style='text-align:right'>" + lstPoAmount[0].PO_Amount + "</td>");
                                                            sbPrintTbl.Append("<td style='text-align:right'>" + lstPoAmount[0].PO_Amount + "</td>");
                                                            subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(lstPoAmount[0].PO_Amount);
                                                        }
                                                        else
                                                        {
                                                            strTbl.Append("<td>-</td>");
                                                            sbPrintTbl.Append("<td>-</td>");
                                                        }
                                                        docChemistArrCount++;
                                                    }

                                                    if (docChemistMet.Contains("M"))
                                                    {
                                                        List<ExpenseAnalysisforAlumni_ManagerCountModel> lstManagerCount = new List<ExpenseAnalysisforAlumni_ManagerCountModel>();
                                                        lstManagerCount = lstManagerDetails.Where(vs => vs.DCR_Date == tempDateString).ToList();

                                                        if (lstManagerCount != null && lstManagerCount.Count > 0)
                                                        {
                                                            if (lstManagerCount[0].Acc_Count.ToString() == "0")
                                                            {
                                                                strTbl.Append("<td style='text-align:right'>" + lstManagerCount[0].Acc_Count + "</td>");
                                                                sbPrintTbl.Append("<td style='text-align:right'>" + lstManagerCount[0].Acc_Count + "</td>");
                                                            }
                                                            else
                                                            {
                                                                strTbl.Append("<td class='td-a' style='text-align:right' onclick=fnOpenAccompanistDetails(\"" + lstManagerCount[0].DCR_Date + "\")>" + lstManagerCount[0].Acc_Count + "</td>");
                                                                sbPrintTbl.Append("<td style='text-align:right' >" + lstManagerCount[0].Acc_Count + "</td>");
                                                            }
                                                            subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(lstManagerCount[0].Acc_Count);
                                                        }
                                                        else
                                                        {
                                                            if (tempDate.DayOfWeek.ToString() == "Sunday")
                                                            {
                                                                strTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                                                sbPrintTbl.Append("<td>-</td>");
                                                            }
                                                            else
                                                            {
                                                                strTbl.Append("<td>-</td>");
                                                                sbPrintTbl.Append("<td>-</td>");
                                                            }

                                                        }
                                                    }
                                                }
                                            }

                                            // Expense details
                                            for (int u = 0; u < lstExpenseAnalysis[0].lstExpenseType.Count; u++)
                                            {
                                                // sub total for print.                                            
                                                List<ExpenseandElgibilityAmountModel> lstexpMode = null;
                                                if (dcrJson[k].DCR_Type.ToString() == "Attendance")
                                                {
                                                    lstexpMode = lstExpenseAnalysis[0].lstExpenseandEligibilityAmount.Where(t => t.DCR_Code == dcrJson[k].DCR_Code && t.Expense_Type_Code == lstExpenseAnalysis[0].lstExpenseType[u].Expense_Type_Code && t.Flag == "A").ToList();
                                                }
                                                else if (dcrJson[k].DCR_Type.ToString() == "Field")
                                                {
                                                    lstexpMode = lstExpenseAnalysis[0].lstExpenseandEligibilityAmount.Where(q => q.DCR_Code == dcrJson[k].DCR_Code && q.Expense_Type_Code == lstExpenseAnalysis[0].lstExpenseType[u].Expense_Type_Code && q.Flag == "F").ToList();
                                                }

                                                if (lstexpMode != null && lstexpMode.Count > 0)
                                                {
                                                    strTbl.Append("<td " + style + ">" + ((lstexpMode[0].Expense_Mode == null) ? "-" : lstexpMode[0].Expense_Mode) + "</td>");
                                                    strTbl.Append("<td " + style + " align='right'>" + ((lstexpMode[0].Eligibility_Amount == null) ? "-" : Convert.ToDouble(lstexpMode[0].Eligibility_Amount).ToString("N2")) + "</td>");
                                                    strTbl.Append("<td " + style + " align='right'>" + ((lstexpMode[0].Expense_Amount == null) ? "0.00" : Convert.ToDouble(lstexpMode[0].Expense_Amount).ToString("N2")) + "</td>");

                                                    sbPrintTbl.Append("<td " + style + " align='right'>" + ((lstexpMode[0].Expense_Amount == null) ? "0.00" : Convert.ToDouble(lstexpMode[0].Expense_Amount).ToString("N2")) + "</td>");

                                                    if (lstexpMode[0].Expense_Amount != null && lstexpMode[0].Expense_Amount.ToString() != "")
                                                    {
                                                        subTotArray[u] += Convert.ToDouble(lstexpMode[0].Expense_Amount);
                                                    }
                                                }
                                                else
                                                {
                                                    strTbl.Append("<td " + style + ">-</td>");
                                                    strTbl.Append("<td " + style + " align='right'>-</td>");
                                                    strTbl.Append("<td " + style + " align='right'>-</td>");

                                                    sbPrintTbl.Append("<td " + style + " align='right'>-</td>");
                                                }
                                            }

                                            // total expense
                                            List<DaywiseExpenseAmountModel> expJson = null;
                                            if (dcrJson[k].DCR_Type.ToString() == "Attendance")
                                            {
                                                expJson = lstExpenseAnalysis[0].lstDaywiseExpenseAmount.Where(v => v.DCR_Code == dcrJson[k].DCR_Code && v.DCR_Flag == "A").ToList();
                                            }
                                            else if (dcrJson[k].DCR_Type.ToString() == "Field")
                                            {
                                                expJson = lstExpenseAnalysis[0].lstDaywiseExpenseAmount.Where(s => s.DCR_Code == dcrJson[k].DCR_Code && s.DCR_Flag == "F").ToList();
                                            }

                                            if (expJson != null && expJson.Count > 0)
                                            {
                                                strTbl.Append("<td align='right' class='td-a' onclick='fnShowExpenseAnalysisDetails(\"" + expJson[0].DCR_Code + "_" + expJson[0].DCR_Flag + "\")'>" + Convert.ToDouble(expJson[0].Total).ToString("N2") + "</td>");

                                                sbPrintTbl.Append("<td align='right' class='td-a' onclick='fnShowExpenseAnalysisDetails(\"" + expJson[0].DCR_Code + "_" + expJson[0].DCR_Flag + "\")'>" + Convert.ToDouble(expJson[0].Total).ToString("N2") + "</td>");
                                                totalExp = totalExp + Convert.ToDouble(expJson[0].Total);

                                                //Remarks
                                                strTbl.Append("<td >" + expJson[0].Remarks.ToString().TrimEnd(',') + "</td>");
                                                sbPrintTbl.Append("<td >" + expJson[0].Remarks.ToString().TrimEnd(',') + "</td>");
                                            }
                                            else
                                            {
                                                strTbl.Append("<td " + style + " align='right'>-</td>");
                                                // remarks
                                                strTbl.Append("<td " + style + ">-</td>");


                                                sbPrintTbl.Append("<td " + style + " align='right'>-</td>");
                                                // remarks
                                                sbPrintTbl.Append("<td " + style + ">-</td>");

                                            }
                                        }
                                        else
                                        {
                                            int dynColumn = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                                            for (int u = 0; u < (10 + dynColumn - doctorCount); u++)
                                            {
                                                if (u == 0)
                                                {
                                                    strTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                                                    //sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                }
                                                else
                                                {
                                                    strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                    // sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                }
                                            }

                                            for (int u = 0; u < (10 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
                                            {
                                                if (u == 0)
                                                {
                                                    sbPrintTbl.Append("<td></td>");
                                                }
                                                else
                                                {
                                                    sbPrintTbl.Append("<td></td>");
                                                }
                                            }
                                        }
                                    }
                                    strTbl.Append("</tr>");
                                    sbPrintTbl.Append("</tr>");
                                }

                            }

                                // holiday entered
                            #region Holiday
                            else if (holidayJson != null && holidayJson.Count > 0)
                            {
                                strTbl.Append("<tr>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                strTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");

                                sbPrintTbl.Append("<tr>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");

                                if (tempDate.DayOfWeek.ToString() == "Sunday")
                                { // holiday on sunday
                                    strTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0].Holiday + ")</td>");
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0].Holiday + ")</td>");
                                }
                                else
                                {
                                    strTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0].Holiday + ")</td>");
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0].Holiday + ")</td>");
                                }

                                int dynColumn = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                                for (int u = 0; u < (11 + dynColumn - doctorCount); u++)
                                {
                                    strTbl.Append("<td style='background-color: #d3d3d3;'></td>");


                                }

                                if (rowCounts == 1)
                                {
                                    for (int u = 0; u < (10 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
                                    {

                                        sbPrintTbl.Append("<td></td>");
                                    }
                                }
                                else
                                {
                                    for (int u = 0; u < (11 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
                                    {

                                        sbPrintTbl.Append("<td></td>");
                                    }
                                }

                                strTbl.Append("</tr>");
                                sbPrintTbl.Append("</tr>");
                            }
                            #endregion Holiday

                            #region Sunday
                            // Sunday
                            else if (tempDate.DayOfWeek.ToString() == "Sunday")
                            {
                                strTbl.Append("<tr>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                strTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");

                                sbPrintTbl.Append("<tr>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                                int dynColumn = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                                for (int u = 0; u < (12 + dynColumn - doctorCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        strTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                    }
                                }

                                if (rowCounts == 1)
                                {
                                    for (int u = 0; u < (11 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                        }
                                        else
                                        {
                                            sbPrintTbl.Append("<td></td>");
                                        }
                                    }
                                }
                                else
                                {
                                    for (int u = 0; u < (12 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                        }
                                        else
                                        {
                                            sbPrintTbl.Append("<td></td>");
                                        }
                                    }

                                }
                                strTbl.Append("</tr>");
                                sbPrintTbl.Append("</tr>");




                            }
                            #endregion Sunday

                            // No Report
                            #region No REport
                            else
                            {
                                strTbl.Append("<tr>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                strTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                strTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");

                                sbPrintTbl.Append("<tr>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Employee_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Division_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                                //sbPrintTbl.Append("<td style='display:none'>" + lstUserInfo[0].Region_Name + "</td>");

                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");


                                int dynColumn = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                                for (int u = 0; u < (12 + dynColumn - doctorCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        strTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                        // sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        // sbPrintTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                                    }
                                }
                                if (rowCounts == 1)
                                {
                                    for (int u = 0; u < (11 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
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

                                    for (int u = 0; u < (12 + lstExpenseAnalysis[0].lstExpenseType.Count - doctorCount); u++)
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
                                strTbl.Append("</tr>");
                                sbPrintTbl.Append("</tr>");



                            }
                            #endregion No REport
                        }
                        #endregion Date Loop
                        strTbl.Append("</tbody>");

                        //sbPrintTbl.Append("</tbody>");


                        //  sbTableContentExcel.Append(sbFooter.ToString());
                        //


                        strTbl.Append("<tfoot align='left'><tr>");
                        sbPrintTbl.Append("<tr>");
                        int dynColumnCount = lstExpenseAnalysis[0].lstExpenseType.Count * 3;
                        // strTbl.Append("<th colspan='" + dynColumnCount.ToString() + "'>Total Expense : " + totalExp.ToString("N2") + "</th>");
                        //int totInx = 13 + (4 - doctorCount) + (lstExpenseAnalysis[0].lstExpenseType.Count * 3);
                        //int startInx = 13 + (4 - doctorCount);
                        //int subCnt = 0;
                        //int skipFrst = 1;
                        //int docTotalStrt = startInx - (4 - doctorCount);
                        //int docChemArrCount = 0;

                        int totInx = 14 + (4 - doctorCount) + (lstExpenseAnalysis[0].lstExpenseType.Count * 3);
                        int startInx = 14 + (4 - doctorCount);
                        int subCnt = 0;
                        int skipFrst = 1;
                        int docTotalStrt = startInx - (4 - doctorCount);
                        int docChemArrCount = 0;

                        #region footer
                        for (int c = 0; c < totInx + 2; c++)
                        {
                            if (c < 7)
                            {
                                strTbl.Append("<th style='display:none;'></th>");
                                // sbPrintTbl.Append("<th style='display:none;'></th>");
                            }
                            else if (c >= startInx)
                            {
                                if (c == totInx)
                                {
                                    strTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                                    sbPrintTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                                }
                                else if (c > totInx) // for remarks
                                {
                                    strTbl.Append("<th align='right'></th>");
                                    sbPrintTbl.Append("<th align='right'></th>");
                                }
                                else
                                {
                                    if (skipFrst == 3)
                                    {
                                        strTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                        sbPrintTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                        subCnt++;
                                        skipFrst = 0;
                                    }
                                    else
                                    {
                                        strTbl.Append("<th align='right'></th>");

                                    }
                                    skipFrst++;
                                }
                            }
                            else
                            {
                                if (c >= docTotalStrt)
                                {
                                    strTbl.Append("<th style='text-align:right'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                                    sbPrintTbl.Append("<th style='text-align:right'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                                    docChemArrCount++;
                                }
                                else if (c == (docTotalStrt - 2))
                                {
                                    strTbl.Append("<th align='left'>Total</th>");
                                    sbPrintTbl.Append("<th align='left'><b>Grand Total</b></th>");
                                }
                                else if (c == (docTotalStrt - 1))
                                {
                                    strTbl.Append("<th style='text-align:right'>" + totaldistance.ToString("N2") + "</th>");
                                    sbPrintTbl.Append("<th style='text-align:right'>" + totaldistance.ToString("N2") + "</th>");
                                }
                                else
                                {
                                    strTbl.Append("<th align='right'></th>");
                                    sbPrintTbl.Append("<th align='right'></th>");
                                }
                            }

                        }
                        #endregion footer


                        switch (strReportExpenseGroupPrintFormatConfig)
                        {
                            case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                            case "WITH_SUMMARY":
                                #region Print Summary for 2 Columns
                                totInx = 14 + (4 - doctorCount) + (lstExpenseAnalysis[0].lstExpenseType.Count * 3);
                                startInx = 14 + (4 - doctorCount);
                                subCnt = 0;
                                skipFrst = 1;
                                docTotalStrt = startInx - (4 - doctorCount);
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
                                        //strTbl.Append("<th style='display:none;'></th>");
                                        // sbPrintTbl.Append("<th style='display:none;'></th>");
                                    }
                                    else if (c >= startInx)
                                    {
                                        if (c == totInx)
                                        {
                                            sbPrintTbl.Append("<tr>");
                                            sbPrintTbl.Append("<th   style='font-size:22px;' align='left'><b>Total Expense </b></th>");
                                            sbPrintTbl.Append("<th   style='font-size:22px;' align='right'><b>" + totalExp.ToString("N2") + "</b></th>");
                                            sbPrintTbl.Append("</tr>");
                                        }
                                        else if (c > totInx) // for remarks
                                        {
                                            //strTbl.Append("<th align='right'></th>");
                                            //sbPrintTbl.Append("<th align='right'></th>");
                                        }
                                        else
                                        {
                                            if (skipFrst == 3)
                                            {
                                                if (lstExpenseAnalysis[0].lstExpenseType.Count > 0 && lstExpenseAnalysis[0].lstExpenseType != null)
                                                {
                                                    sbPrintTbl.Append("<tr>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='left'><b> " + lstExpenseAnalysis[0].lstExpenseType[subCnt].Expense_Type_Name + " </b></th>");
                                                    sbPrintTbl.Append("<th   style='font-size:16px;' align='right'><b>" + subTotArray[subCnt].ToString("N2") + "</b></th>");
                                                    sbPrintTbl.Append("</tr>");
                                                }
                                                //strTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                                //sbPrintTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                                subCnt++;
                                                skipFrst = 0;
                                            }
                                            else
                                            {
                                                //strTbl.Append("<th align='right'></th>");

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


                        strTbl.Append("</tr></tfoot></table></div></br>");

                        switch (strReportExpenseGroupPrintFormatConfig)
                        {
                            case "NO":
                                #region Print Signature
                                sbPrintTbl.Append("</tr></tfoot></table></div></br>");
                                sbFooter.Append("<br />");
                                sbFooter.Append("<table border='1' cellspacing='0' cellpadding='0' style='float:right;'><thead>");
                                sbFooter.Append("<tr style='height:50px;'>");
                                sbFooter.Append("<td style='width:300px;'>Signature:</td><td style='width:300px;'>Signature:</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("<tr>");
                                sbFooter.Append("<td style='width:300px;'>Employee Name : " + lstUserInfo[0].Employee_Name + "</td><td style='width:300px;'>Reporting Manager Employee Name : " + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("<tr>");
                                sbFooter.Append("<td style='width:300px;'>Employee No : " + lstUserInfo[0].Employee_Number + "</td><td style='width:300px;'>Reporting Manager Employee No : " + lstUserInfo[0].Reporting_Manager_Emp_Number + "</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("</thead></table>");
                                sbPrintTbl.Append(sbFooter.ToString());
                                #endregion
                                break;
                            case "WITH_2COLUMN_HEADER,WITH_SUMMARY":
                            case "WITH_SUMMARY":
                            case "WITH_2COLUMN_HEADER":
                                #region Print Signature 2 columns
                                sbPrintTbl.Append("</tr></tfoot></table></div></br>");
                                sbFooter.Append("<br />");
                                sbFooter.Append("<table border='1' cellspacing='0' cellpadding='0' style='float:right;'><thead>");
                                sbFooter.Append("<tr style='height:50px;'>");
                                sbFooter.Append("<td style='width:300px;font-size:16px;'>Signature:</td><td style='width:300px;font-size:16px;'>Signature:</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("<tr>");
                                sbFooter.Append("<td style='width:300px;font-size:16px;'>Employee Name : " + lstUserInfo[0].Employee_Name + "</td><td style='width:300px;font-size:16px;'>Reporting Manager Employee Name : " + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("<tr>");
                                sbFooter.Append("<td style='width:300px;font-size:16px;'>Employee No : " + lstUserInfo[0].Employee_Number + "</td><td style='width:300px;font-size:16px;'>Reporting Manager Employee No : " + lstUserInfo[0].Reporting_Manager_Emp_Number + "</td>");
                                sbFooter.Append("</tr>");
                                sbFooter.Append("</thead></table>");
                                sbPrintTbl.Append(sbFooter.ToString());
                                #endregion
                                break;
                        }


                        ////  strTbl.Append("<div style='float: left;width: 100%;margin-top: 30px;font-size: 14px;margin-bottom: 20px;'><a class='td-a' onclick='fnComprehensiveAnalysisReportforAlumni();'>Show Comprehensive Analysis Report</a></div>");
                        #region MainReport

                        #endregion MainReport
                    }
                }

                //return strTbl + "$" + sbPrintTbl.ToString() + "$" + totalExp.ToString();
                if (viewFormat == "S")
                {
                    return strTbl + "$" + sbPrintTbl.ToString() + "$" + totalExp.ToString();
                }
                else
                {
                    return strTbl.ToString();
                }
            }
            catch
            {
                throw;
            }

        }
        #endregion ExpenseAnalysis for Alumni

        #region Audit Trail for Customer Report
        public string GetAuditTrailforCustomer(string regionCode, string title, string selectedUser, string customerEntityType, string startDate, string endDate, string viewFormat)
        {
            try
            {
                List<AuditTrailforCustomerModel> lstCustomerSummary = new List<AuditTrailforCustomerModel>();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                lstCustomerSummary = _objRR.GetAuditTrailforCustomer(companyCode, regionCode, customerEntityType, startDate, endDate).ToList();
                StringBuilder strTb = new StringBuilder();

                if (viewFormat == "S")
                {
                    strTb = AuditTrailforCustomer(lstCustomerSummary, regionCode, startDate, endDate, customerEntityType, title, viewFormat, selectedUser);
                }
                else
                {
                    string lastSubmittedTable = AuditTrailforCustomer(lstCustomerSummary, regionCode, startDate, endDate, customerEntityType, title, viewFormat, selectedUser).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "AUDIT_TRAIL_FOR_NEW_CUSTOMER" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", regionCode);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("customerEntityType", customerEntityType);
                dicContext.Add("title", title);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder AuditTrailforCustomer(List<AuditTrailforCustomerModel> lstCustomerSummary, string regionCode, string startDate, string endDate, string customerEntityType, string title, string viewFormat, string selecteduser)
        {
            BLUser _objUser = new BLUser();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            StringBuilder strTbl = new StringBuilder();
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(_objCurrentInfo.GetCompanyCode(), "", regionCode).ToList();
                string fromDate = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                string toDate = endDate.Split('-')[2] + "/" + endDate.Split('-')[1] + "/" + endDate.Split('-')[0];
                string generateHeaderTable = _objRR.GetReportHeaderForAlumni(_objCurrentInfo.GetCompanyCode(), "", regionCode, fromDate, toDate, "");
                //Header Table
                strTbl.Append("<div class='dvHeader' id='AuditTrailforCustomer'>");
                if (lstUserInfo.Count() > 0)
                {
                    strTbl.Append(title + " of " + selecteduser.Split('-')[1] + " - Log Information for the period of " + fromDate + " - " + toDate);
                }
                else
                {
                    strTbl.Append(selecteduser.Split('-')[1] + " - " + title + " - Log Information for the period of " + fromDate + " - " + toDate);
                }
                if (viewFormat == "S")
                {
                    strTbl.Append("<div class='helpIconRpt'>");
                    strTbl.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('AUDIT_TRAIL_FOR_NEW_CUSTOMER')\" />");
                    strTbl.Append("</div>");
                }
                strTbl.Append("</div>");

                strTbl.Append("<br/>");
                //Details of Selected User
                if (lstUserInfo.Count() > 0)
                {
                    strTbl.Append("<div>");
                    strTbl.Append(generateHeaderTable);
                    strTbl.Append("</div>");
                }
                strTbl.Append("<br/>");
                #region Doctor Details
                if (customerEntityType.ToString() == "DOCTOR")
                {
                    strTbl.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<th>Customer Name</th><th>Region Name</th><th>Category</th><th>Gender</th><th>Speciality Name</th>");
                    strTbl.Append("<th>MDL</th><th>Address1</th><th>Address2</th><th>Local Area</th><th>City</th><th>Pin Code</th>");
                    strTbl.Append("<th>Phone</th><th>Mobile</th><th>Fax</th><th>Email</th><th>Customer Status</th><th>DOB</th><th>Anniversary Date</th>");
                    strTbl.Append("<th>Qualification</th><th>Created By</th><th>Created Date</th><th>Effective From</th><th>Effective To</th>");
                    strTbl.Append("<th>Approved By</th><th>Approved Date</th><th>Is Inherited</th><th>Applied Date</th><th>Applied By</th><th>Unapproved Date</th>");
                    strTbl.Append("<th>Unapproved By</th><th>Edit Reason</th><th>Hospital Name</th><th>Hospital Classification</th><th>Source Region</th><th>Move Type</th>");
                    strTbl.Append("<th>Moved By</th><th>Moved On</th><th>Locked</th><th>Price Group Code</th><th>Updated By</th><th>Updated Datetime</th>");
                    strTbl.Append("</tr></thead>");
                    strTbl.Append("<tbody>");
                    if (lstCustomerSummary.Count > 0 && lstCustomerSummary != null)
                    {
                        int rowCount = 0;
                        foreach (var CustomerDetail in lstCustomerSummary)
                        {
                            rowCount++;
                            strTbl.Append("<tr id='" + rowCount + "'>");
                            //Customer Name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Customer_Name);
                            strTbl.Append("</td>");
                            //Region Name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Region_Name);
                            strTbl.Append("</td>");
                            //Category
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Category_Name);
                            strTbl.Append("</td>");
                            //Gender
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Gender);
                            strTbl.Append("</td>");
                            //Specaility Name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Speciality_Name);
                            strTbl.Append("</td>");
                            //MDL Number
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.MDL_Number);
                            strTbl.Append("</td>");
                            //Addrress1
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Address1);
                            strTbl.Append("</td>");
                            //Address2
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Address2);
                            strTbl.Append("</td>");
                            //Local Area
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Local_Area);
                            strTbl.Append("</td>");
                            //City
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.City);
                            strTbl.Append("</td>");
                            //Pin Code
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Pin_Code);
                            strTbl.Append("</td>");
                            //Phone
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Phone);
                            strTbl.Append("</td>");
                            //Mobile
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Mobile);
                            strTbl.Append("</td>");
                            //Fax
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Fax);
                            strTbl.Append("</td>");
                            //Email
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Email);
                            strTbl.Append("</td>");
                            //Customer Status
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Customer_Status);
                            strTbl.Append("</td>");
                            //DOB
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.DOB);
                            strTbl.Append("</td>");
                            //Anniversary Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Anniversary_Date);
                            strTbl.Append("</td>");
                            //Qualification
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Qualification);
                            strTbl.Append("</td>");
                            //Created  By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Created_By);
                            strTbl.Append("</td>");
                            //Created Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Created_Date);
                            strTbl.Append("</td>");
                            //Effective From
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Effective_From);
                            strTbl.Append("</td>");
                            //Effective To
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Effective_To);
                            strTbl.Append("</td>");
                            //Approved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Approved_By);
                            strTbl.Append("</td>");
                            //Approved Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Approved_Date);
                            strTbl.Append("</td>");
                            //Is inherited
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Is_Inherited);
                            strTbl.Append("</td>");
                            //Applied Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Applied_Date);
                            strTbl.Append("</td>");
                            //Applied By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Applied_By);
                            strTbl.Append("</td>");
                            //UnApproved Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Unapproved_Date);
                            strTbl.Append("</td>");
                            //Unapproved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Unapproved_By);
                            strTbl.Append("</td>");
                            //Edit Reason
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Edit_Reason);
                            strTbl.Append("</td>");
                            //Hospital name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Hospital_Name);
                            strTbl.Append("</td>");
                            //Hospital Classification
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Hospital_Classification);
                            strTbl.Append("</td>");
                            //Sorce Region
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Source_Region);
                            strTbl.Append("</td>");
                            //Move Type
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Move_Type);
                            strTbl.Append("</td>");
                            //Moved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Moved_By);
                            strTbl.Append("</td>");
                            //Moved On
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Moved_On);
                            strTbl.Append("</td>");
                            //Locked
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Locked);
                            strTbl.Append("</td>");
                            //Price Group Code
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.PRICE_GROUP_CODE);
                            strTbl.Append("</td>");
                            //Update By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.UpdatedBy);
                            strTbl.Append("</td>");
                            //Updated Datetime
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.UpdatedDatetime);
                            strTbl.Append("</td>");

                            strTbl.Append("</tr>");

                        }
                    }
                    else
                    {
                        strTbl.Append("No Records To Display.");
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
                #endregion Doctor Details
                #region Chemist or Stockiest details
                else
                {
                    strTbl.Append("<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<th>Customer Name</th><th>Region Name</th>");
                    strTbl.Append("<th>Address1</th><th>Address2</th><th>Local Area</th><th>City</th><th>Pin Code</th>");
                    strTbl.Append("<th>Phone</th><th>Mobile</th><th>Fax</th><th>Email</th><th>Customer Status</th><th>Primary Contact</th><th>Primary Email</th>");
                    strTbl.Append("<th>Created By</th><th>Created Date</th><th>Effective From</th><th>Effective To</th>");
                    strTbl.Append("<th>Approved By</th><th>Approved Date</th><th>Is Inherited</th><th>Applied Date</th><th>Applied By</th><th>Unapproved Date</th>");
                    strTbl.Append("<th>Unapproved By</th><th>Edit Reason</th><th>Source Region</th><th>Move Type</th>");
                    strTbl.Append("<th>Moved By</th><th>Moved On</th><th>Locked</th><th>Price Group Code</th><th>Updated By</th><th>Updated Datetime</th>");
                    strTbl.Append("</tr></thead>");
                    strTbl.Append("<tbody>");
                    if (lstCustomerSummary.Count > 0 && lstCustomerSummary != null)
                    {
                        int rowCount = 0;
                        foreach (var CustomerDetail in lstCustomerSummary)
                        {
                            rowCount++;
                            strTbl.Append("<tr id='" + rowCount + "'>");
                            //Customer Name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Customer_Name);
                            strTbl.Append("</td>");
                            //Region Name
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Region_Name);
                            strTbl.Append("</td>");
                            //Addrress1
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Address1);
                            strTbl.Append("</td>");
                            //Address2
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Address2);
                            strTbl.Append("</td>");
                            //Local Area
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Local_Area);
                            strTbl.Append("</td>");
                            //City
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.City);
                            strTbl.Append("</td>");
                            //Pin Code
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Pin_Code);
                            strTbl.Append("</td>");
                            //Phone
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Phone);
                            strTbl.Append("</td>");
                            //Mobile
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Mobile);
                            strTbl.Append("</td>");
                            //Fax
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Fax);
                            strTbl.Append("</td>");
                            //Email
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Email);
                            strTbl.Append("</td>");
                            //Customer Status
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Customer_Status);
                            strTbl.Append("</td>");
                            //Primary Contact
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Primary_Contact);
                            strTbl.Append("</td>");
                            //Primary Email
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Primary_Email);
                            strTbl.Append("</td>");
                            //Created  By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Created_By);
                            strTbl.Append("</td>");
                            //Created Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Created_Date);
                            strTbl.Append("</td>");
                            //Effective From
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Effective_From);
                            strTbl.Append("</td>");
                            //Effective To
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Effective_To);
                            strTbl.Append("</td>");
                            //Approved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Approved_By);
                            strTbl.Append("</td>");
                            //Approved Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Approved_Date);
                            strTbl.Append("</td>");
                            //Is inherited
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Is_Inherited);
                            strTbl.Append("</td>");
                            //Applied Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Applied_Date);
                            strTbl.Append("</td>");
                            //Applied By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Applied_By);
                            strTbl.Append("</td>");
                            //UnApproved Date
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Unapproved_Date);
                            strTbl.Append("</td>");
                            //Unapproved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Unapproved_By);
                            strTbl.Append("</td>");
                            //Edit Reason
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Edit_Reason);
                            strTbl.Append("</td>");
                            //Sorce Region
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Source_Region);
                            strTbl.Append("</td>");
                            //Move Type
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Move_Type);
                            strTbl.Append("</td>");
                            //Moved By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Moved_By);
                            strTbl.Append("</td>");
                            //Moved On
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Moved_On);
                            strTbl.Append("</td>");
                            //Locked
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.Locked);
                            strTbl.Append("</td>");
                            //Price Group Code
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.PRICE_GROUP_CODE);
                            strTbl.Append("</td>");
                            //Update By
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.UpdatedBy);
                            strTbl.Append("</td>");
                            //Updated Datetime
                            strTbl.Append("<td>");
                            strTbl.Append(CustomerDetail.UpdatedDatetime);
                            strTbl.Append("</td>");

                            strTbl.Append("</tr>");

                        }
                    }
                    else
                    {
                        strTbl.Append("No Records To Display.");
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
                #endregion Chemist or Stockiest details
            }
            catch
            {
                throw;
            }
            return strTbl;
        }
        #endregion Audit Trail for Customer Report

        #region SFCAudit Report
        public string GetSFCAuditReport(string regionCode, string startDate, string endDate, string viewType)
        {

            try
            {
                _objBL_ReportRegion = new BL_ReportRegion();
                _objCurrentInfo = new CurrentInfo();

                IEnumerable<MVCModels.HiDoctor_Reports.SFCAuditReportModel> lstAuditReportDetails = _objBL_ReportRegion.GetSFCAuditReport(_objCurrentInfo.GetCompanyCode(), regionCode, startDate, endDate);
                if (viewType == "1")
                {
                    return GetAuditReportHTMLFormat(lstAuditReportDetails, viewType);
                }
                else
                {
                    StringBuilder strBuilder = new StringBuilder();
                    string userLogHtmlFormat = GetAuditReportHTMLFormat(lstAuditReportDetails, viewType).ToString();
                    if (!string.IsNullOrEmpty(userLogHtmlFormat))
                    {
                        DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                        DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                        string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                        string userName = _objCurrentInfo.GetUserName();
                        string domainName = _objCurrentInfo.GetSubDomain();

                        string fileName = "SFCAuditReport" + "_" + domainName + "_" + userName + ".xls";
                        string blobUrl = objAzureBlob.AzureBlobUploadText(userLogHtmlFormat, accKey, fileName, "bulkdatasvc");
                        return ("<br /><div id='dvURL' class='div-alert'><a href=" + blobUrl + "> Click here to Download </a></div>");
                        //  return ("<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + fileName + "</a></div>");
                    }
                    else
                    {
                        return "<span>No data Found.</span>";
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Selected User Code:", regionCode);
                dicContext.Add("Start Date:", startDate);
                dicContext.Add("End Date:", endDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }

        }
        private string GetAuditReportHTMLFormat(IEnumerable<MVCModels.HiDoctor_Reports.SFCAuditReportModel> lstAuditReportDetails, string viewType)
        {
            StringBuilder sbTableContent = new StringBuilder();
            if (lstAuditReportDetails.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped' id='tblSFCAuditReport' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
                sbTableContent.Append("<th>Region Name</th>");
                sbTableContent.Append("<th>From Place</th>");
                sbTableContent.Append("<th>To Place</th>");
                sbTableContent.Append("<th>Travel Mode</th>");
                sbTableContent.Append("<th>Category Name</th>");
                sbTableContent.Append("<th>Distance</th>");
                sbTableContent.Append("<th>Fare Amount</th>");
                sbTableContent.Append("<th>SFC Visit Count</th>");
                sbTableContent.Append("<th>Date From</th>");
                sbTableContent.Append("<th>Date To</th>");
                sbTableContent.Append("<th>Action</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (MVCModels.HiDoctor_Reports.SFCAuditReportModel auditreport in lstAuditReportDetails)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.From_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.To_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Travel_Mode);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Category_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Distance);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Fare_Amount);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.SFC_Visit_Count);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Date_From);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Date_To);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(auditreport.Action);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                if (viewType == "1")
                {
                    sbTableContent.Append("<span>No data Found.</span>");
                }
                else
                {
                    sbTableContent.Append("");
                }
            }
            return sbTableContent.ToString();

        }

        #endregion   SFCAudit Report

        public string GetDoctorProfileReport(FormCollection collection)
        {
            //DataSet ds = new DataSet();
            DataControl.BAL_DoctorVisitAnalysis _objBLDoctor1 = new DataControl.BAL_DoctorVisitAnalysis();
            StringBuilder strTb = new StringBuilder();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = collection["userCode"].ToString();
            string DcrFromDate = collection["DcrFromDate"].ToString();
            string DcrEndDate = collection["DcrEndDate"].ToString();
            string viewoption = collection["options"].ToString();
            try
            {
                //string regionCode = collection["regionCode"].ToString();
                List<DoctorVisitHourlyModel> lstDocmod;
                lstDocmod = _objBLDoctor1.GetDoctorProfile(companyCode, userCode, DcrFromDate, DcrEndDate).ToList();
                List<DoctorVisitHourlyModel> lstdcrHeader;
                lstdcrHeader = _objBLDoctor1.GetDoctorVisitHourlyReport(companyCode, userCode, DcrFromDate, DcrEndDate).ToList();
                if (viewoption == "S")
                {
                    //strTb = GetDoctorVisitHourlyReportTable(_objBLDoctor);
                    strTb = GetDoctorProfileReportTable(lstDocmod, lstdcrHeader);
                    //List<DoctorVisitHourlyModel> lstRegion = _objBLDoctor.GetDoctorVisitHourlyReport(companyCode, userCode, DcrFromDate, DcrEndDate).ToList();
                }
                else
                {
                    string DoctorHourlyVisit = GetDoctorProfileReportTable(lstDocmod, lstdcrHeader).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objcurrentInfo.GetUserName();
                    string compCode = _objcurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Doctor_Profile" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DoctorHourlyVisit, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                //dicObj.Add("regionCode", collection["regionCode"].ToString());
                dicObj.Add("companyCode", collection["companyCode"].ToString());
                dicObj.Add("userCode", collection["userCode"].ToString());
                dicObj.Add("DcrFromDate", collection["DcrFromDate"].ToString());
                dicObj.Add("DcrEndDate", collection["DcrEndDate"].ToString());
                dicObj.Add("options", collection["options"].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }


        public StringBuilder GetDoctorProfileReportTable(List<DoctorVisitHourlyModel> lstdoc, List<DoctorVisitHourlyModel> lstdcrHeader)
        {
            CurrentInfo _currentInfo = new CurrentInfo();
            StringBuilder tableContent = new StringBuilder();

            if (lstdoc.Count > 0)
            {

                tableContent.Append("<table class='table table-striped' cellspacing='0' style='margin-bottom:0px;margin-border:1px solid #aaa;font-size:11px' cellpadding='0' >");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<th style='text-align:left' colspan='3'>");
                tableContent.Append("User Details");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");

                foreach (var _objBDoctor in lstdoc)
                {
                    tableContent.Append("<tr>");

                    tableContent.Append("<td >User Name: ");
                    tableContent.Append(_objBDoctor.User_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("<td >Designation: ");
                    tableContent.Append(_objBDoctor.User_Type_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append("</td>");
                    tableContent.Append("</tr>");

                    tableContent.Append("<tr>");
                    tableContent.Append("<td >Employee Name: ");
                    tableContent.Append(_objBDoctor.Employee_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>Reporting Manager Name: ");
                    tableContent.Append(_objBDoctor.Manager_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("</tr>");
                    tableContent.Append("<tr>");
                    tableContent.Append("<td>Reporting Manager Designation: ");
                    tableContent.Append(_objBDoctor.Reporting_Designation);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>Mobile No: ");
                    tableContent.Append(_objBDoctor.Mobile);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append("</td>");
                }
                tableContent.Append("</tr>");
                tableContent.Append("</tbody></table>");
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display dataTable box' width='100%' id='tblDoctorHour' >");
                tableContent.Append("<thead>");
                int sno = 0;
                tableContent.Append("<th align='left'>SNO</th>");
                tableContent.Append("<th align='left'>DCR Actual Date</th>");
                tableContent.Append("<th>Doctor  Name</th>");
                tableContent.Append("<th align='left'>MDL Number</th>");
                tableContent.Append("<th>Doctor Category</th>");
                tableContent.Append("<th>Specilaity Name</th>");
                tableContent.Append("<th align='left'>Entered Date time</th>");
                tableContent.Append("<th>Report Sync-up Time</th>");
                tableContent.Append("<th>Latitude</th>");
                tableContent.Append("<th>Longitude</th>");
                //tableContent.Append("<th>Address</th>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");

                foreach (var _objBLDoctor in lstdcrHeader)
                {
                    sno++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(sno);
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(_objBLDoctor.DCR_Actual_Date);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(_objBLDoctor.Doctor_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(_objBLDoctor.MDL_Number);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(_objBLDoctor.Doctor_Category);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(_objBLDoctor.Specilaity_Name);
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(_objBLDoctor.Doctor_Visit_Date_Time);
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    if (_objBLDoctor.Synced_DateTime == null)
                    {
                        tableContent.Append('-');
                    }
                    else
                        tableContent.Append(_objBLDoctor.Synced_DateTime);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(_objBLDoctor.Latitude);
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(_objBLDoctor.Longitude);
                    tableContent.Append("</td>");
                    //tableContent.Append("<td>");
                    //if (_objBLDoctor.Doctor_Address == null)
                    //{
                    //    tableContent.Append("Will be show later");
                    //}
                    //else
                    //    tableContent.Append(_objBLDoctor.Doctor_Address);
                    //tableContent.Append("</td>");
                    tableContent.Append("</tr>");
                }
            }
            else
            {
                tableContent.Append("<tr><td colspan='8'> No DCRs Found.<td></tr>");
            }
            return tableContent;
        }


    }
}

