using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Globalization;
using System.Collections;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class DoctorVisitController : Controller
    {
        //
        // GET: /DoctorVisit/

        public ActionResult Index()
        {
            return View();
        }

        public string GetBrandAnalysisReport(string userCode, string month, string year, string dcrStatus)
        {
            StringBuilder strTblContent = new StringBuilder();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.BAL_DoctorVisitAnalysis _objBLDoctor = new DataControl.BAL_DoctorVisitAnalysis();
            DataSet ds = new DataSet();
            StringBuilder strUserInfo = new StringBuilder();
            ds = _objBLDoctor.GetBrandAnalysisReport(_objCurInfo.GetCompanyCode(), userCode, month, year, dcrStatus);
            if (ds.Tables.Count > 0)
            {

                //User Info
                if (ds.Tables[6].Rows.Count > 0)
                {
                    strUserInfo.Append("<table id='tblUserInfo' cellspacing=0 cellpadding=0 width='100%'>");
                    strUserInfo.Append("<tr><td colspan=4><div id='dvReportPeriod'>Brand Analysis Report * of " +
                        ds.Tables[6].Rows[0]["User_Name"].ToString() + " for the month of ");
                    strUserInfo.Append("" + CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(Convert.ToInt32(month)).ToString() + "-" + year + " </div></td></tr>");
                    strUserInfo.Append("<tr><td colspan=4> * This report contains ");
                    string status = string.Empty;
                    string[] arStatus;
                    arStatus = dcrStatus.Split('^');
                    string[] strArray = new string[4];
                    strArray[0] = "Unapproved";
                    strArray[1] = "Applied";
                    strArray[2] = "Approved";
                    strArray[3] = "Drafted";
                    StringBuilder strStatus = new StringBuilder();
                    for (int z = 0; z < arStatus.Length - 1; z++)
                    {
                        strStatus.Append(strArray[Convert.ToInt32(arStatus[z])].ToString() + ",");
                    }
                    strUserInfo.Append(strStatus.ToString().TrimEnd(',') + " records </td></tr>");

                    strUserInfo.Append("<tr><td>User Name </td><td> : " + ds.Tables[6].Rows[0]["User_Name"].ToString() + " | " + ds.Tables[6].Rows[0]["Region_Name"].ToString() + "</td>");
                    if (string.IsNullOrEmpty(ds.Tables[6].Rows[0]["Reporting_Manager_Name"].ToString().Trim()))
                    {
                        strUserInfo.Append("<td>Reporting Manager Name </td><td> : Not Available</td></tr>");
                    }
                    else
                    {
                        strUserInfo.Append("<td>Reporting Manager Name </td><td> : " + ds.Tables[6].Rows[0]["Reporting_Manager_Name"].ToString() + "</td></tr>");
                    }
                    strUserInfo.Append("<tr><td>Employee Name </td><td > : " + ds.Tables[6].Rows[0]["Employee_Name"].ToString() + "</td>");
                    if (string.IsNullOrEmpty(ds.Tables[6].Rows[0]["Reporting_Employee_Name"].ToString().Trim()))
                    {
                        strUserInfo.Append("<td>Reporting manager Employee Name </td><td > : Not Available</td></tr>");
                    }
                    else
                    {
                        strUserInfo.Append("<td>Reporting manager Employee Name </td><td > : " + ds.Tables[6].Rows[0]["Reporting_Employee_Name"].ToString() + "</td></tr>");
                    }
                    strUserInfo.Append("<tr><td>Employee Number </td><td > : " + ds.Tables[6].Rows[0]["Employee_Number"].ToString() + "</td>");
                    if (string.IsNullOrEmpty(ds.Tables[6].Rows[0]["Reporting_Employee_Number"].ToString().Trim()))
                    {
                        strUserInfo.Append("<td>Reporting manager Employee Number </td><td > : Not Available</td></tr>");
                    }
                    else
                    {
                        strUserInfo.Append("<td>Reporting manager Employee Number </td><td > : " + ds.Tables[6].Rows[0]["Reporting_Employee_Number"].ToString() + "</td></tr>");
                    }
                    strUserInfo.Append("<tr><td>Designation </td><td > : " + ds.Tables[6].Rows[0]["User_Type_Name"].ToString() + "</td>");
                    strUserInfo.Append("<td>Reporting Manager Designation </td><td > : " + ds.Tables[6].Rows[0]["Reporting_User_Type_Name"].ToString() + "</td></tr>");
                    strUserInfo.Append("<tr><td>Region Name </td><td> : " + ds.Tables[6].Rows[0]["Region_Name"].ToString() + "</td></tr>");
                    strUserInfo.Append("<td>Reporting Region Name </td><td> : " + ds.Tables[6].Rows[0]["Reporting_Region_Name"].ToString() + "</td>");
                    strUserInfo.Append("</tr>");
                    strUserInfo.Append("</table></br>");
                }

                strTblContent.Append("<table id='tblBrand' class='data display datatable'><thead><tr><th rowspan='2' style='width:3%;'>S.No</th>");
                strTblContent.Append("<th rowspan='2' style='width:5%;'>Doctor Name</th>");
                strTblContent.Append("<th rowspan='2' style='width:2%;'>MDL No</th><th rowspan='2' style='width:5%;'>Category</th>");
                strTblContent.Append("<th rowspan='2' style='width:5%;'>Speciality</th><th rowspan='2' style='width:5%;'>Doctor status</th>");
                strTblContent.Append("<th rowspan='2' style='width:5%;'>Market Place</th>");
                StringBuilder strTemp = new StringBuilder();
                StringBuilder strCP = new StringBuilder();
                StringBuilder strWP = new StringBuilder();
                foreach (DataRow dr in ds.Tables[5].Rows)
                {
                    strTblContent.Append("<th colspan='3' align='center' style='width:10%;'>" + dr["Brand_Name"].ToString() + "</th>");
                    strTemp.Append("<th>Detailed Unit Count</th><th>Samples Unit Count</th><th>Input Unit Count</th>");
                }
                strTblContent.Append("</tr><tr>" + strTemp.ToString() + "</tr></thead>");
                strTblContent.Append("<tbody>");
                int i = 0;
                foreach (DataRow drDoc in ds.Tables[0].Rows)
                {
                    i++;
                    strTblContent.Append("<tr><td>" + i.ToString() + "</td>");
                    strTblContent.Append("<td>" + drDoc["Doctor_Name"].ToString() + "</td>");
                    strTblContent.Append("<td>" + drDoc["MDL_Number"].ToString() + "</td>");
                    strTblContent.Append("<td>" + drDoc["Category_Name"].ToString() + "</td>");
                    strTblContent.Append("<td>" + drDoc["Speciality_Name"].ToString() + "</td>");
                    strTblContent.Append("<td>" + drDoc["Customer_Status"].ToString() + "</td>");
                    // Local AreadrDoc["Local_Area"].ToString()
                    if (!string.IsNullOrEmpty(drDoc["Local_Area"].ToString()))
                    {
                        strTblContent.Append("<td>" + drDoc["Local_Area"].ToString() + "</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td align='center'>-</td>");
                    }
                    // Brand Details
                    foreach (DataRow drBrand in ds.Tables[5].Rows)
                    {
                        double isdetailedCount = 0;
                        double samplesCount = 0;
                        double inputCount = 0;
                        DataRow[] drIs = ds.Tables[2].AsEnumerable().Where(b => b["Brand_Code"].ToString().ToUpper() == drBrand["Brand_Code"].ToString().ToUpper()
                                                    && b["Doctor_Code"].ToString().ToUpper() == drDoc["Doctor_Code"].ToString().ToUpper()).ToArray();

                        isdetailedCount = Convert.ToDouble(drIs.Sum(a => a.Field<Int32>("Is_Detailed")));

                        DataRow[] drSamples = ds.Tables[3].AsEnumerable().Where(b => b["Brand_Code"].ToString().ToUpper() == drBrand["Brand_Code"].ToString().ToUpper()
                                                     && b["Doctor_Code"].ToString().ToUpper() == drDoc["Doctor_Code"].ToString().ToUpper()).ToArray();
                        samplesCount = Convert.ToDouble(drSamples.Sum(a => a.Field<Int32>("Quantity_Provided")));

                        DataRow[] drInput = ds.Tables[4].AsEnumerable().Where(b => b["Brand_Code"].ToString().ToUpper() == drBrand["Brand_Code"].ToString().ToUpper()
                                                   && b["Doctor_Code"].ToString().ToUpper() == drDoc["Doctor_Code"].ToString().ToUpper()).ToArray();
                        inputCount = Convert.ToDouble(drInput.Sum(a => a.Field<Int32>("Quantity_Provided")));

                        strTblContent.Append("<td>" + isdetailedCount + "</td>");
                        strTblContent.Append("<td>" + samplesCount + "</td>");
                        strTblContent.Append("<td>" + inputCount + "</td>");
                    }
                    strTblContent.Append("</tr>");
                }
                strTblContent.Append("</tbody></table>");
            }

            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
            string userName = _objCurInfo.GetUserName();
            string compCode = _objCurInfo.GetCompanyCode();
            string fileName = "BRANDANALYSIS_" + "_" + compCode + "_" + userName + ".xls";

            string blobUrl = string.Empty;
            blobUrl = objAzureBlob.AzureBlobUploadText(strUserInfo.ToString() + strTblContent.ToString(), accKey, fileName, "bulkdatasvc");
            return strUserInfo.ToString() + strTblContent.ToString() + "$" + blobUrl;
        }

        public JsonResult GetRegionTypes()
        {
            DAL_DoctorVisitAnalysis objDAL = new DAL_DoctorVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            ds = objDAL.GetRegionTypes(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRegionTypeAndChildUserType(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis objBAL = new BAL_DoctorVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            string regionTypeCode = collection["regionType"].ToString();
            ds = objBAL.GetChildRegionNameAndChildUserType(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode(), regionTypeCode, _objcurrentInfo.GetUserCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetBrandMasterReport(FormCollection collection)
        {
            string content = "";
            BAL_DoctorVisitAnalysis objBAL = new BAL_DoctorVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string regionCodes = collection["regionCodes"].ToString();
            string userTypeCode = collection["userType"].ToString();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string dcrStatus = collection["dcrStatus"].ToString();
            string userTypeName = collection["userTypeName"].ToString();
            string reportName = collection["title"].ToString();
            string reportMonth = collection["monthName"].ToString();
            content = objBAL.GetBrandSummaryReport(_objcurrentInfo.GetCompanyCode(), regionCodes, userTypeCode, dcrStatus, month, year, userTypeName, reportMonth, reportName);
            return content;

        }

        public string GetDoctorDeviationReportDetails(string startDate, string endDate, string statusName, string userCode, string userName,
            string dcrStatus, string reportFormat)
        {
            StringBuilder strTblContent = new StringBuilder();
            string blobUrl = string.Empty;
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLUser objUser = new BLUser();
                DataControl.BAL_DoctorVisitAnalysis objDoctorVisit = new BAL_DoctorVisitAnalysis();
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                IEnumerable<MVCModels.DCRHeaderModel> lstHeader = null;
                IEnumerable<MVCModels.DCRDoctorVisitModel> lstDoctors = null;
                strTblContent.Append(objUser.GetReportHeaderTableString(objCurInfo.GetCompanyCode(), userCode, startDate, endDate, statusName,""));
                lstHeader = objDoctorVisit.GetDCRHeaderByStatusAndDate(objCurInfo.GetCompanyCode(), dcrStatus, userCode, startDate, endDate);
                StringBuilder strAcc = new StringBuilder();
                ArrayList al = new ArrayList();
                if (lstHeader != null)
                {
                    #region get dcr header info
                    foreach (var dr in lstHeader)
                    {

                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Acc1_Name)))
                        {
                            if (!al.Contains(Convert.ToString(dr.Acc1_Name)))
                            {
                                strAcc.Append(Convert.ToString(dr.Acc1_Name).Trim() + "^");
                                al.Add(Convert.ToString(dr.Acc1_Name).Trim());
                            }
                        }
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Acc2_Name)))
                        {
                            if (!al.Contains(Convert.ToString(dr.Acc2_Name)))
                            {
                                strAcc.Append(Convert.ToString(dr.Acc2_Name) + "^");
                                al.Add(Convert.ToString(dr.Acc2_Name).Trim());
                            }
                        }
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Acc3_Name)))
                        {
                            if (!al.Contains(Convert.ToString(dr.Acc3_Name)))
                            {
                                strAcc.Append(Convert.ToString(dr.Acc3_Name) + "^");
                                al.Add(Convert.ToString(dr.Acc3_Name).Trim());
                            }
                        }
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Acc4_Name)))
                        {
                            if (!al.Contains(Convert.ToString(dr.Acc4_Name)))
                            {
                                strAcc.Append(Convert.ToString(dr.Acc4_Name) + "^");
                                al.Add(Convert.ToString(dr.Acc4_Name).Trim());
                            }
                        }
                    }
                    strAcc.Append(userName.Split(',')[0] + "^");
                    #endregion dcr header info
                    lstDoctors = objDoctorVisit.GetDCRDoctorsByUserName(objCurInfo.GetCompanyCode(), dcrStatus, strAcc.ToString(), startDate, endDate);
                    strTblContent.Append("<table class='table table-striped'>");
                    strTblContent.Append("<thead><tr><th>Date</th><th>" + userName + "</th>");
                    foreach (string accName in al)
                    {
                        strTblContent.Append("<th>Doctors met by " + accName + "</th>");
                    }
                    strTblContent.Append("<th>Doctor Missed</th>");
                    strTblContent.Append("<th>Doctor Deviation</th></thead><tbody>");

                    if (lstDoctors != null)
                    {
                        foreach (var dr in lstHeader)
                        {
                            StringBuilder strDoctorContent = new StringBuilder();
                            strTblContent.Append("<tr><td>" + dr.DCR_Date + "</td>");
                            var disDcr = lstDoctors.AsEnumerable().Where(a => a.DCR_Actual_Date == dr.DCR_Date &&
                                                a.User_Name.ToUpper() == userName.Split(',')[0].ToString().ToUpper()).ToList();
                            ArrayList alManagerDocs = new ArrayList();
                            ArrayList alChildDocs = new ArrayList();
                            if (disDcr.Count > 0)
                            {
                                strDoctorContent.Append("<table>");
                                foreach (var doc in disDcr)
                                {
                                    strDoctorContent.Append("<tr><td>" + doc.Doctor_Name + "</td></tr>");
                                    alManagerDocs.Add(doc.Doctor_Name);
                                }
                                strDoctorContent.Append("</table>");
                                strTblContent.Append("<td>" + strDoctorContent.ToString() + "</td>");
                                foreach (string accName in al)
                                {
                                    StringBuilder strAccDocs = new StringBuilder();
                                    if (accName == Convert.ToString(dr.Acc1_Name).Trim() || accName == Convert.ToString(dr.Acc2_Name).Trim()
                                                || accName == Convert.ToString(dr.Acc3_Name).Trim() || accName == Convert.ToString(dr.Acc4_Name).Trim())
                                    {
                                        var lstAcc = lstDoctors.AsEnumerable().Where(b => b.DCR_Actual_Date == dr.DCR_Date && b.User_Name == accName).ToList();
                                        if (lstAcc.Count > 0)
                                        {
                                            strAccDocs.Append("<table>");
                                            foreach (var accDoc in lstAcc)
                                            {
                                                strAccDocs.Append("<tr><td>" + accDoc.Doctor_Name + "</td></tr>");
                                                alChildDocs.Add(accDoc.Doctor_Name);
                                            }
                                            strAccDocs.Append("</table>");
                                        }
                                    }
                                    strTblContent.Append("<td>" + strAccDocs.ToString() + "</td>");
                                }
                                strDoctorContent.Clear();
                                #region doctor missed count
                                if (alChildDocs.Count > 0)
                                {
                                    strDoctorContent.Append("<table>");
                                    foreach (string childDoctor in alChildDocs)
                                    {
                                        if (!alManagerDocs.Contains(childDoctor))
                                        {
                                            strDoctorContent.Append("<tr><td>" + childDoctor.Trim() + "</td></tr>");
                                        }
                                    }
                                    strDoctorContent.Append("</table>");
                                }
                                strTblContent.Append("<td>" + strDoctorContent.ToString() + "</td>");
                                #endregion doctor missed count
                                #region doctor deviation
                                strDoctorContent.Clear();
                                int count = 0;
                                if (alManagerDocs.Count > 0)
                                {
                                    strDoctorContent.Append("<table>");
                                    foreach (string managerDoctor in alManagerDocs)
                                    {
                                        if (!alChildDocs.Contains(managerDoctor))
                                        {
                                            count++;
                                            strDoctorContent.Append("<tr><td>" + managerDoctor.Trim() + "</td></tr>");
                                        }
                                    }
                                    strDoctorContent.Append("</table>");
                                    if (count < 0)
                                    {
                                        strDoctorContent.Clear();
                                    }
                                }
                                strTblContent.Append("<td>" + strDoctorContent + "</td>");
                                #endregion doctor deviation
                            }
                            strTblContent.Append("</tr>");
                        }
                    }
                }
                if (reportFormat == "2")
                {
                    DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                    DataControl.CurrentInfo _objCurr = new CurrentInfo();
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string compCode = _objCurr.GetCompanyCode();
                    string fileName = "DoctorDeviationReport_" + "_" + compCode + "_" + _objCurr.GetUserName() + ".xls";

                    string error = string.Empty;
                    //string strExcelContent = GetDoctorDeviationReportDetails(startDate,endDate,statusName,userCode,userName,dcrStatus);
                    blobUrl = objAzureBlob.AzureBlobUploadText(strTblContent.ToString(), accKey, fileName, "bulkdatasvc");
                }
            }
            catch (Exception ex)
            {
            }
            if (reportFormat == "1")
            {
                return strTblContent.ToString();
            }
            else
            {
                return blobUrl;
            }
        }
    }
}
