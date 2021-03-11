using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    public class DoctorVisitAnalysisSpecialityWiseController : Controller
    {
        //
        // GET: /DoctorVisitAnalysisSpecialityWise/

        #region Private Variables
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private DataControl.BAL_DoctorVisitAnalysis _objBL = new DataControl.BAL_DoctorVisitAnalysis();

        const string COLL_MONTH = "month";
        const string COLL_YEAR = "year";
        const string COLL_USER_CODE = "userCode";
        const string Coll_REPORT_NAME = "reportName";
        const string Coll_MODE = "mode";
        const string COLL_REGION_CODE = "regionCode";
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }


        public string GetDoctorVisitAnalysisSpecialityWiseReport(FormCollection coll)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = coll[COLL_USER_CODE];
            int month = Convert.ToInt32(coll[COLL_MONTH]);
            int year = Convert.ToInt32(coll[COLL_YEAR]);
            string mode = coll[Coll_MODE].ToString();
            string reportName = coll[Coll_REPORT_NAME].ToString();
            string blobUrl = "";
            reportName = ((reportName == "") ? "Doctor Visit Analysis Speciality Wise Report" : reportName);

            StringBuilder sbTblContent = new StringBuilder();
            StringBuilder sbCatExpected = new StringBuilder();
            StringBuilder sbCatMetAsperVisit = new StringBuilder();
            StringBuilder sbCatFreq = new StringBuilder();
            StringBuilder sbCatVisitPer = new StringBuilder();
            DataSet ds = new DataSet();
            ds = _objBL.GetDoctorVisitAnalysisSpecialityWiseReport(companyCode, userCode, month, year, mode);

            sbTblContent.Append("<div style='width:100%;float:left;text-align:left;font-size:18px;margin-bottom:10px;font-weight:bold;'>" + reportName + " for the month of " + coll["monthName"].ToString() + " " + year.ToString() + "</div>");
            sbTblContent.Append("<div style='width:100%;float:left;text-align:left;'>* System shows the current user hierarchy and NOT the historical user hierarchy</div>");

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
            {
                sbTblContent.Append("<div style='width:100%;float:left;'>");
                sbTblContent.Append("<table width='100%' id='tblDrVisitAnalysisSpecialityWise' class='data display dataTable box' cellspacing='0' cellpadding='0'>");
                sbTblContent.Append("<thead><tr>");
                sbTblContent.Append("<th>User Name</th>");
                sbTblContent.Append("<th>User Type</th>");
                sbTblContent.Append("<th>Territory Name</th>");
                sbTblContent.Append("<th>Employee Name</th>");
                sbTblContent.Append("<th>Employee No</th>");
                sbTblContent.Append("<th>Division Name</th>");
                sbTblContent.Append("<th>Line 1 Reporting manager</th>");
                sbTblContent.Append("<th>Line 1 Reporting HQ</th>");
                sbTblContent.Append("<th>Line 2 Reporting manager</th>");
                sbTblContent.Append("<th>Line 2 Reporting HQ</th>");
                sbTblContent.Append("<th>Line 3 Reporting manager</th>");
                sbTblContent.Append("<th>Line 3 Reporting HQ</th>");
                sbTblContent.Append("<th>Speciality Name</th>");
                sbTblContent.Append("<th>Total Listed drs count</th>");
                if (ds.Tables.Count > 2 && ds.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[2].Rows)
                    {
                        sbTblContent.Append("<th>" + dr["Category_Name"] + " drs count</th>");

                        sbCatExpected.Append("<th>" + dr["Category_Name"] + " Drs Expected Visits </th>");
                        sbCatMetAsperVisit.Append("<th>" + dr["Category_Name"] + " Drs Met as per visit count</th>");
                        sbCatFreq.Append("<th>Freq. achieved " + dr["Category_Name"] + " Drs Visits</th>");
                        sbCatVisitPer.Append("<th>" + dr["Category_Name"] + "  Visits %</th>");
                    }
                }
                sbTblContent.Append("<th>Total Expected Dr Visits count</th>");
                sbTblContent.Append(sbCatExpected.ToString());
                sbTblContent.Append(sbCatMetAsperVisit.ToString());
                sbTblContent.Append(sbCatFreq.ToString());
                sbTblContent.Append("<th>Total Freq. achieved Visits</th>");
                sbTblContent.Append(sbCatVisitPer.ToString());
                sbTblContent.Append("<th>Total Visits %</th>");
                sbTblContent.Append("</tr></thead>");

                sbTblContent.Append("<tbody>");
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    DataRow[] drUserDetails, dsCatDetails, dsCatMetPerVisit;
                    int totExpected = 0, totFreq = 0;
                    double totVisit = 0.0;
                    drUserDetails = ds.Tables[0].AsEnumerable().Where(a => a["Region_Code"].ToString() == dr["Region_Code"].ToString()).ToArray();

                    sbTblContent.Append("<tr>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["User_Name"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["User_Type_Name"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Region_Name"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Employee_Name"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Employee_Number"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Division_Name"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager1"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager1_Region"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager2"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager2_Region"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager3"] + "</td>");
                    sbTblContent.Append("<td>" + drUserDetails[0]["Manager3_Region"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    if (Convert.ToInt32(dr["Total_Doctors_Count"]) > 0)
                    {
                        sbTblContent.Append("<td style='text-align:right;' class='td-a' onclick='fnOpenDoctorVisitAnalysisSpecialityWiseDrCountPopUp(\"" + drUserDetails[0]["User_Code"] + "_" + dr["Region_Code"] + "_" + dr["Speciality_Code"] + "_ _T" + "\")'>" + dr["Total_Doctors_Count"] + "</td>");
                    }
                    else
                    {
                        sbTblContent.Append("<td style='text-align:right;'>0</td>");
                    }

                    sbCatExpected.Clear();
                    sbCatMetAsperVisit.Clear();
                    sbCatFreq.Clear();
                    sbCatVisitPer.Clear();

                    foreach (DataRow drCat in ds.Tables[2].Rows)
                    {
                        dsCatDetails = ds.Tables[3].Select("Region_Code='" + dr["Region_Code"] + "' AND Speciality_Code='" + dr["Speciality_Code"] + "' AND Category_Code='" + drCat["Category_Code"] + "'");
                        dsCatMetPerVisit = ds.Tables[4].Select("Region_Code='" + dr["Region_Code"] + "' AND Speciality_Code='" + dr["Speciality_Code"] + "' AND Category_Code='" + drCat["Category_Code"] + "'");

                        if (dsCatDetails.Length > 0)
                        {
                            // dr count
                            if (Convert.ToInt32(dsCatDetails[0]["Doctors_Count"]) > 0)
                            {
                                sbTblContent.Append("<td style='text-align:right;' class='td-a' onclick='fnOpenDoctorVisitAnalysisSpecialityWiseDrCountPopUp(\"" + drUserDetails[0]["User_Code"] + "_" + dr["Region_Code"] + "_" + dr["Speciality_Code"] + "_" + drCat["Category_Code"] + "_N" + "\")'>" + dsCatDetails[0]["Doctors_Count"] + "</td>");
                            }
                            else
                            {
                                sbTblContent.Append("<td style='text-align:right;' >0</td>");
                            }

                            // Expected Visits Count = speciality wise category 1 doctor count of that region (User region. I.e. Point No 3) x Standard visit count of that category
                            sbCatExpected.Append("<td style='text-align:right;'>" + dsCatDetails[0]["Expected_Visits_Count"] + "</td>");
                            totExpected = totExpected + Convert.ToInt32(dsCatDetails[0]["Expected_Visits_Count"]);


                            //Freq Acheived
                            if (Convert.ToInt32(dsCatDetails[0]["Freq_Achieved"]) > 0)
                            {
                                sbCatFreq.Append("<td style='text-align:right;' class='td-a' onclick='fnOpenDoctorVisitAnalysisSpecialityWiseFreqPopUp(\"" + drUserDetails[0]["User_Code"] + "_" + dr["Region_Code"] + "_" + dr["Speciality_Code"] + "_" + drCat["Category_Code"] + "_N" + "\")'>" + dsCatDetails[0]["Freq_Achieved"] + "</td>");
                                totFreq = totFreq + Convert.ToInt32(dsCatDetails[0]["Freq_Achieved"]);
                            }
                            else
                            {
                                sbCatFreq.Append("<td style='text-align:right;' >0</td>");
                            }

                            // Visits % = (Freq Achieved / DoctorCount) x 100
                            double percent = 0.0;
                            if (Convert.ToInt32(dsCatDetails[0]["Expected_Visits_Count"]) != 0)
                            {
                                percent = (Convert.ToDouble(dsCatDetails[0]["Freq_Achieved"]) / Convert.ToDouble(dsCatDetails[0]["Expected_Visits_Count"])) * 100;
                            }
                            sbCatVisitPer.Append("<td style='text-align:right;'>" + percent.ToString("N2") + "</td>");
                            //totVisit += Convert.ToDouble(percent.ToString("N2"));
                        }
                        else
                        {
                            sbTblContent.Append("<td style='text-align:right;'>0</td>");

                            // Expected Visits Count = speciality wise category 1 doctor count of that region (User region. I.e. Point No 3) x Standard visit count of that category
                            sbCatExpected.Append("<td style='text-align:right;'>0</td>");

                            sbCatFreq.Append("<td style='text-align:right;'>0</td>");

                            sbCatVisitPer.Append("<td style='text-align:right;'>0</td>");
                        }

                        // Met As per Visit Count =Count of speciality wise category 1 doctors who are met by the user equal to or greater than the standard visit count of that category
                        if (dsCatMetPerVisit.Length > 0)
                        {
                            sbCatMetAsperVisit.Append("<td style='text-align:right;'>" + dsCatMetPerVisit[0]["Doctors_Met_As_Per_Visit_Count"] + "</td>");
                        }
                        else
                        {
                            sbCatMetAsperVisit.Append("<td style='text-align:right;'>0</td>");
                        }
                    }
                    sbTblContent.Append("<td style='text-align:right;'>" + totExpected.ToString() + "</td>");
                    sbTblContent.Append(sbCatExpected.ToString());

                    sbTblContent.Append(sbCatMetAsperVisit.ToString());

                    sbTblContent.Append(sbCatFreq.ToString());
                    sbTblContent.Append("<td style='text-align:right;'>" + totFreq.ToString() + "</td>");

                    sbTblContent.Append(sbCatVisitPer.ToString());
                    if (totExpected != 0)
                    {
                        totVisit = (Convert.ToDouble(totFreq) / Convert.ToDouble(totExpected)) * 100;
                        sbTblContent.Append("<td style='text-align:right;'>" + totVisit.ToString("N2") + "</td>");
                    }
                    else
                    {
                        sbTblContent.Append("<td style='text-align:right;'>0.0</td>");
                    }
                    sbTblContent.Append("</tr>");
                }
                sbTblContent.Append("</tbody></table>");
                sbTblContent.Append("</div>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "DrVisitSpecialityWiseReport_" + "_" + compCode + "_" + userName + ".xls";


                blobUrl = objAzureBlob.AzureBlobUploadText(sbTblContent.ToString(), accKey, fileName, "bulkdatasvc");
            }
            else
            {
                sbTblContent.Append("<div style='width:100%;float:left;'>“No information available for this user");
                sbTblContent.Append("</div>");
            }
            return sbTblContent.ToString() + "$" + blobUrl;
        }

        public string GetDoctorVisitAnalysisSpecialityWiseReportDrsCountPopUp(FormCollection coll)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = coll[COLL_USER_CODE];
            int month = Convert.ToInt32(coll[COLL_MONTH]);
            int year = Convert.ToInt32(coll[COLL_YEAR]);
            string mode = coll[Coll_MODE].ToString();
            string regionCode = coll[COLL_REGION_CODE].ToString();
            string specialityCode = coll["specialityCode"].ToString();
            string categoryCode = coll["categoryCode"].ToString();
            string blobUrl = "";

            StringBuilder sbTblContent = new StringBuilder();
            StringBuilder sbHeader = new StringBuilder();

            DataSet ds = new DataSet();
            ds = _objBL.GetDoctorVisitAnalysisSpecialityWiseReportPopUp(companyCode, userCode, regionCode, month, year, specialityCode, categoryCode, mode);

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                //user details
                sbTblContent.Append("<table class='headerTableUser'  cellspacing='0' cellpadding='0'>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>User Name</td><td>" + ds.Tables[0].Rows[0]["User_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Division Name</td><td>" + ds.Tables[0].Rows[0]["Division_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Manager Name</td><td>" + ds.Tables[0].Rows[0]["Manager1"] + "</td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>Employee Name</td><td>" + ds.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Region Name</td><td>" + ds.Tables[0].Rows[0]["Region_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Reporting HQ</td><td>" + ds.Tables[0].Rows[0]["Manager1_Region"] + "</td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>Employee No</td><td>" + ds.Tables[0].Rows[0]["Employee_Number"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Date Of Joining</td><td>" + ds.Tables[0].Rows[0]["Date_of_Joining"] + "</td>");
                sbTblContent.Append("<td ></td><td></td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("</table><br />");

                // Detail Table
                sbTblContent.Append("<table id='tblDrCount' class='data display dataTable box' cellspacing='0' cellpadding='0' width='100%'>");
                sbTblContent.Append("<thead><tr>");
                sbTblContent.Append("<th>S.No</th>");
                sbTblContent.Append("<th>Doctor Name</th>");
                sbTblContent.Append("<th>MDL No</th>");
                sbTblContent.Append("<th>Category</th>");
                sbTblContent.Append("<th>Speciality</th>");
                sbTblContent.Append("<th>Hospital Name</th>");
                sbTblContent.Append("<th>No of Visits</th>");
                sbTblContent.Append("</tr></thead>");

                sbTblContent.Append("<tbody>");
                int cnt = 1;
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    sbTblContent.Append("<tr>");
                    sbTblContent.Append("<td>" + cnt.ToString() + "</td>");
                    sbTblContent.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["MDL_Number"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Category_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTblContent.Append("<td style='text-align:right;'>" + dr["Total_Visits"] + "</td>");
                    sbTblContent.Append("</tr>");
                    cnt++;
                }
                sbTblContent.Append("</tbody></table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "DrVisitSpecialityWiseDrsCountPopUp_" + "_" + compCode + "_" + userName + ".xls";

                // header for print and excel
                sbHeader.Append("<div style='width:100%;float:left;font-weight:bold;font-size:15px;'>Doctors Count</div>");

                blobUrl = objAzureBlob.AzureBlobUploadText(sbHeader.ToString() + sbTblContent.ToString(), accKey, fileName, "bulkdatasvc");
            }
            else
            {
                sbTblContent.Append("<div style='width:100%;float:left;'>“No information available for this Category");
                sbTblContent.Append("</div>");
            }
            return sbTblContent.ToString() + "$" + blobUrl + "$" + sbHeader.ToString();
        }


        public string GetDoctorVisitAnalysisSpecialityWiseReportFreqPopUp(FormCollection coll)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = coll[COLL_USER_CODE];
            int month = Convert.ToInt32(coll[COLL_MONTH]);
            int year = Convert.ToInt32(coll[COLL_YEAR]);
            string mode = coll[Coll_MODE].ToString();
            string regionCode = coll[COLL_REGION_CODE].ToString();
            string specialityCode = coll["specialityCode"].ToString();
            string categoryCode = coll["categoryCode"].ToString();
            string blobUrl = "";


            StringBuilder sbTblContent = new StringBuilder();
            StringBuilder sbHeader = new StringBuilder();

            DataSet ds = new DataSet();
            ds = _objBL.GetDoctorVisitAnalysisSpecialityWiseReportPopUp(companyCode, userCode, regionCode, month, year, specialityCode, categoryCode, mode);

            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                //user details
                sbTblContent.Append("<table class='headerTableUser'  cellspacing='0' cellpadding='0'>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>User Name</td><td>" + ds.Tables[0].Rows[0]["User_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Division Name</td><td>" + ds.Tables[0].Rows[0]["Division_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Manager Name</td><td>" + ds.Tables[0].Rows[0]["Manager1"] + "</td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>Employee Name</td><td>" + ds.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Region Name</td><td>" + ds.Tables[0].Rows[0]["Region_Name"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Reporting HQ</td><td>" + ds.Tables[0].Rows[0]["Manager1_Region"] + "</td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("<tr>");
                sbTblContent.Append("<td style='font-weight:bold;'>Employee No</td><td>" + ds.Tables[0].Rows[0]["Employee_Number"] + "</td>");
                sbTblContent.Append("<td style='font-weight:bold;'>Date Of Joining</td><td>" + ds.Tables[0].Rows[0]["Date_of_Joining"] + "</td>");
                sbTblContent.Append("<td ></td><td></td>");
                sbTblContent.Append("</tr>");
                sbTblContent.Append("</table><br />");

                // Detail Table
                sbTblContent.Append("<table id='tblFreqCount' class='data display dataTable box' cellspacing='0' cellpadding='0' width='100%'>");
                sbTblContent.Append("<thead><tr>");
                sbTblContent.Append("<th>S.No</th>");
                sbTblContent.Append("<th>Doctor Name</th>");
                sbTblContent.Append("<th>MDL No</th>");
                sbTblContent.Append("<th>Category</th>");
                sbTblContent.Append("<th>Speciality</th>");
                sbTblContent.Append("<th>Hospital Name</th>");
                sbTblContent.Append("<th>No of Visits</th>");
                sbTblContent.Append("<th>Doctor covered frequency</th>");
                sbTblContent.Append("</tr></thead>");

                sbTblContent.Append("<tbody>");
                int cnt = 1;
                int standaredVisitCont = Convert.ToInt32(ds.Tables[1].Rows[0]["Standard_Visits_Count"]);
                DataRow[] drAbv, drRight, drBelow;
                drAbv = ds.Tables[1].AsEnumerable().Where(a => Convert.ToInt32(a["Total_Visits"]) > standaredVisitCont).ToArray();
                drRight = ds.Tables[1].AsEnumerable().Where(a => Convert.ToInt32(a["Total_Visits"]) == standaredVisitCont).ToArray();
                drBelow = ds.Tables[1].AsEnumerable().Where(a => Convert.ToInt32(a["Total_Visits"]) < standaredVisitCont).ToArray();


                foreach (DataRow dr in drAbv)
                {
                    sbTblContent.Append("<tr>");
                    sbTblContent.Append("<td>" + cnt.ToString() + "</td>");
                    sbTblContent.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["MDL_Number"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Category_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTblContent.Append("<td style='text-align:right;'>" + dr["Total_Visits"] + "</td>");
                    sbTblContent.Append("<td>Doctor covered above Frequency</td>");
                    sbTblContent.Append("</tr>");
                    cnt++;
                }

                foreach (DataRow dr in drRight)
                {
                    sbTblContent.Append("<tr>");
                    sbTblContent.Append("<td>" + cnt.ToString() + "</td>");
                    sbTblContent.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["MDL_Number"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Category_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTblContent.Append("<td style='text-align:right;'>" + dr["Total_Visits"] + "</td>");
                    sbTblContent.Append("<td>Doctor covered right Frequency</td>");
                    sbTblContent.Append("</tr>");
                    cnt++;
                }
                foreach (DataRow dr in drBelow)
                {
                    sbTblContent.Append("<tr>");
                    sbTblContent.Append("<td>" + cnt.ToString() + "</td>");
                    sbTblContent.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["MDL_Number"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Category_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    sbTblContent.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTblContent.Append("<td style='text-align:right;'>" + dr["Total_Visits"] + "</td>");
                    sbTblContent.Append("<td>Doctor covered below Frequency</td>");
                    sbTblContent.Append("</tr>");
                    cnt++;
                }
                sbTblContent.Append("</tbody></table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "DrVisitSpecialityWiseFreqAnalysisPopUp_" + "_" + compCode + "_" + userName + ".xls";


                // header for print and excel
                sbHeader.Append("<div style='width:100%;float:left;font-weight:bold;font-size:15px;'>Frequency Achieved Doctors Visit</div>");
                blobUrl = objAzureBlob.AzureBlobUploadText(sbHeader.ToString() + sbTblContent.ToString(), accKey, fileName, "bulkdatasvc");
            }
            else
            {
                sbTblContent.Append("<div style='width:100%;float:left;'>“No information available for this Category");
                sbTblContent.Append("</div>");
            }
            return sbTblContent.ToString() + "$" + blobUrl + "$" + sbHeader.ToString();
        }

    }
}
