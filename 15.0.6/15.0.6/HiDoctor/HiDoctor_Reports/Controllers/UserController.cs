using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using System.Text;
using System.Web.SessionState;
using System.Data;
using DataControl;

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class UserController : Controller
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return View();
        }


        public string GetBillingReport(string fromDate, string toDate, string mode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLUser _blUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.BillingReportModel> lstReport = new List<MVCModels.HiDoctor_Master.BillingReportModel>();
            lstReport = _blUser.GetBillingReport(_objCurrentInfo.GetCompanyCode(), fromDate, toDate, mode);
            StringBuilder strText = new StringBuilder();
            double userCouunt = 0;
            double dcrCount = 0;
            if (lstReport.Count > 0)
            {
                strText.Append("<table class='display data datatable' id='tblReport'><thead><tr>");
                strText.Append("<th>User Name</th>");
                strText.Append("<th>Designation</th>");
                strText.Append("<th>Region Name</th>");
                strText.Append("<th>Division</th>");
                strText.Append("<th>User Status</th>");
                if ("LOG" == mode.ToUpper())
                {
                    strText.Append("<th>User Log Count</th>");
                }
                strText.Append("<th>Reporting Manager</th>");
                strText.Append("<th>Reporting Designation</th>");
                strText.Append("<th>User Activation Date</th>");
                strText.Append("<th>Resignation Date </th>");
                strText.Append("<th>User Disable Date</th>");
                strText.Append("<th>User Work Category</th>");
                if ("DCR" == mode.ToUpper())
                {
                    strText.Append("<th>Entered DCR Count</th>");
                }
                strText.Append("</tr></thead><tbody>");
                for (int i = 0; i < lstReport.Count; i++)
                {
                    strText.Append("<tr>");
                    strText.Append("<td>" + lstReport[i].User_Name + "</td>");
                    strText.Append("<td>" + lstReport[i].User_Type_Name + "</td>");
                    strText.Append("<td>" + lstReport[i].Region_Name + "</td>");
                    strText.Append("<td>" + lstReport[i].Division_Name + "</td>");
                    strText.Append("<td>" + lstReport[i].User_Status + "</td>");
                    if ("LOG" == mode.ToUpper())
                    {
                        strText.Append("<td style='text-align:right;padding-right: 1%;'>" + lstReport[i].Count + "</th>");
                        userCouunt = userCouunt + Convert.ToDouble(lstReport[i].Count);
                    }
                    strText.Append("<td>" + lstReport[i].Reporting_Manager + "</td>");
                    strText.Append("<td>" + lstReport[i].Reporting_User_Type_Name + "</td>");
                    strText.Append("<td>" + lstReport[i].Created_Date + "</td>");
                    strText.Append("<td>" + lstReport[i].Resignation_Date + "</td>");
                    strText.Append("<td>" + lstReport[i].Effective_To + "</td>");
                    strText.Append("<td>" + lstReport[i].User_Type_Category + "</td>");
                    if ("DCR" == mode.ToUpper())
                    {
                        strText.Append("<td style='text-align:right;padding-right: 1%;'>" + lstReport[i].Count + "</td>");
                        dcrCount = dcrCount + Convert.ToDouble(lstReport[i].Count);
                    }
                    strText.Append("</tr>");

                }

                strText.Append("</tbody>");
                strText.Append("<tbody>");
                strText.Append("<tfoot>");
                strText.Append("<tr>");
                strText.Append("<th></th><th></th><th></th><th></th><th></th>");
                if ("LOG" == mode.ToUpper())
                {
                    strText.Append("<th style='text-align:right;'>" + userCouunt + "</th>");
                }
                strText.Append("<th></th><th></th><th></th><th></th><th></th><th></th>");
                if ("DCR" == mode.ToUpper())
                {
                    strText.Append("<th style='text-align:right;'>" + dcrCount + "</th>");
                }
                strText.Append("</tr>");
                strText.Append("</tfoot>");
                strText.Append("</tbody>");
                strText.Append("</table>");
            }
            return strText.ToString();
        }

        //public string GetDisabledUsers()
        //{
        //    StringBuilder strUsers = new StringBuilder();
        //    DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
        //    DataControl.BLUser objUser = new DataControl.BLUser();
        //    IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
        //    lstUser = objUser.GetDisabledUsers(objCurInfo.GetCompanyCode());
        //    strUsers.Append("<ul>");
        //    if (lstUser != null)
        //    {
        //        foreach (var user in lstUser)
        //        {
        //            strUsers.Append("<li onclick='fnGetUser(\"" + user.User_Code + "\")'>" + user.User_Name + "</li>");
        //        }
        //    }
        //    strUsers.Append("</ul>");
        //    return strUsers.ToString();
        //}

        //public string GetResignedUserLeaveTakenReport()
        //{
        //    StringBuilder strTblContent = new StringBuilder();
        //    DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
        //    DataControl.BLUser objUser = new DataControl.BLUser();
        //    DataControl.BLLeave objLeave = new DataControl.BLLeave();

        //    return strTblContent.ToString();
        //}

        #region get user menu access log report
        public string GetUserMenuAccessLogReport(string fromDate, string toDate, string userTypeCodes, string isExcel)
        {
            StringBuilder strContent = new StringBuilder();
            string blobUrl = string.Empty;
            strContent.Append("<table><tr><td colspan='7' class='tblhead'>Menu Access Log Report - Log Period  " + fromDate.Split('-')[2]
                  + "/" + fromDate.Split('-')[1] + "/" + fromDate.Split('-')[0] + " to " + toDate.Split('-')[2]
                + "/" + toDate.Split('-')[1] + "/" + toDate.Split('-')[0] + "</td></tr></table>");
            strContent.Append("<table class='table table-striped'><thead><tr><th>S.No</th><th>Date</th><th>User Type Name </th><th>Menu Name</th>");
            strContent.Append("<th>Menu URL</th><th>Access</th><th>Changed By</th></tr></thead><tbody>");
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLMaster objMaster = new DataControl.BLMaster();
                List<MVCModels.UserTypeMenuAccessModel> lstUserMenu =
                        new List<UserTypeMenuAccessModel>(objMaster.GetUserTypeMenuAccessLog(objCurInfo.GetCompanyCode(), fromDate, toDate, userTypeCodes));
                int i = 0;
                if (lstUserMenu.Count > 0)
                {
                    foreach (var dr in lstUserMenu)
                    {
                        i++;
                        strContent.Append("<tr><td>" + i + "</td>");
                        strContent.Append("<td>" + dr.Updated_Date + "</td>");
                        strContent.Append("<td>" + dr.User_Type_Name + "</td>");
                        strContent.Append("<td>" + dr.Menu_Text + "</td>");
                        strContent.Append("<td>" + dr.Menu_URL + "</td>");
                        strContent.Append("<td>" + dr.Access + "</td>");
                        strContent.Append("<td>" + dr.Updated_By + "</td></tr>");
                    }
                }
                strContent.Append("</tbody>");
                strContent.Append("</table>");
                if ("Y" == isExcel)
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = objCurInfo.GetUserName();
                    string compCode = objCurInfo.GetCompanyCode();
                    string fileName = "MENUACCESSLOG_" + "_" + compCode + "_" + userName + ".xls";
                    blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
                    strContent.Clear();
                    strContent.Append(blobUrl);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }

            return strContent.ToString();
        }
        #endregion user menu access log report

        #region privilege log report
        public string GetPrivilegeAccessLogReport(string fromDate, string toDate, string userTypeCodes, string isExcel)
        {
            StringBuilder strContent = new StringBuilder();
            string blobUrl = string.Empty;
            strContent.Append("<table><tr><td colspan='7'  class='tblhead'>Privilege Log Report - Log Period  " + fromDate.Split('-')[2]
                + "/" + fromDate.Split('-')[1] + "/" + fromDate.Split('-')[0] + " to " + toDate.Split('-')[2]
                + "/" + toDate.Split('-')[1] + "/" + toDate.Split('-')[0] + "</td></tr></table>");
            strContent.Append("<table class='table table-striped'><thead><tr><th>S.No</th><th>Date</th><th>Privilege Name </th><th>Privilege Value Name</th>");
            strContent.Append("<th>User Type Name</th><th>Record Status</th><th>Request from</th><th>Request Date</th><th>Request Reason</th>");
            strContent.Append("<th>Support User Name</th><th>Updated By</th></tr></thead><tbody>");
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLMaster objMaster = new DataControl.BLMaster();
                List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege =
                        new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(objMaster.GetPrivilegeLogReport(objCurInfo.GetCompanyCode(),
                            fromDate, toDate, userTypeCodes));
                int i = 0;
                if (lstPrivilege.Count > 0)
                {
                    foreach (var dr in lstPrivilege)
                    {
                        i++;
                        strContent.Append("<tr><td>" + i + "</td>");
                        strContent.Append("<td>" + dr.Mapping_Updated_Date + "</td>");
                        strContent.Append("<td>" + dr.Privilege_Name + "</td>");
                        strContent.Append("<td>" + dr.Privilege_Value_Name + "</td>");
                        strContent.Append("<td>" + dr.User_Type_Name + "</td>");
                        strContent.Append("<td>" + dr.Record_Status + "</td>");
                        strContent.Append("<td>" + dr.Request_From + "</td>");
                        strContent.Append("<td>" + dr.Request_Date + "</td>");
                        strContent.Append("<td>" + dr.Request_Reason + "</td>");
                        strContent.Append("<td>" + dr.Support_User_Name + "</td>");
                        strContent.Append("<td>" + dr.Mapping_Updated_By + "</td></tr>");
                    }
                }
                strContent.Append("</tbody>");
                strContent.Append("</table>");
                if ("Y" == isExcel)
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = objCurInfo.GetUserName();
                    string compCode = objCurInfo.GetCompanyCode();
                    string fileName = "PRIVILEGELOG_" + "_" + compCode + "_" + userName + ".xls";
                    blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
                    strContent.Clear();
                    strContent.Append(blobUrl);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }
        #endregion privilege log report

        #region tp report alumini users
        ///// <summary>
        ///// Get TP Master report for alumini users
        ///// </summary>
        ///// <param name="userCode"></param>
        ///// <param name="date"></param>
        ///// <returns>return the table content</returns>
        public string GetTPMasterReportForAluminiUsers(string userCode, string month, string year, string isExcel, string monthName)
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BL_Report objReport = new DataControl.BL_Report();
            DataControl.BLUser objUser = new DataControl.BLUser();
            #region tp header
            strContent.Append(objUser.GetReportHeaderTableString(objCurInfo.GetCompanyCode(), userCode, monthName + "-" + year, "", "", ""));
            strContent.Append("<table class='table table-striped' cellpadding=0 cellspacing=0  id ='tblTPReport'>");
            strContent.Append("<thead>");
            strContent.Append("<tr id='tblTr'>");
            strContent.Append("<th>User Name</th>");
            strContent.Append("<th>TP Date</th>");
            strContent.Append("<th>Call Objective</th>");
            strContent.Append("<th>Activity Name</th>");
            strContent.Append("<th>Category</th>");
            strContent.Append("<th>CP Name</th>");
            strContent.Append("<th>Meeting Point </th>");
            strContent.Append("<th>Meeting Time </th>");
            strContent.Append("<th>Work Place</th>");
            strContent.Append("<th>SFC</th>");
            strContent.Append("<th>Accomp Name</th>");
            strContent.Append("<th>No oF Planned Doctors</th>");
            strContent.Append("<th>Entered Date</th>");
            strContent.Append("<th>Entered By</th>");
            strContent.Append("<th>Remarks</th>");
            strContent.Append("<th>Status</th>");
            strContent.Append("<th>Approved/Unapproved Date</th>");
            strContent.Append("<th>Approve/Unapprove Reason</th>");
            strContent.Append("</tr>");
            strContent.Append("</thead>");
            strContent.Append("<tbody>");
            #endregion tp header
            try
            {
                DataSet ds = new DataSet();
                ds = objReport.GetTPMasterReportForAlumniUsers(objCurInfo.GetCompanyCode(), month, year, userCode);
                if (ds.Tables.Count > 0)
                {
                    int noOfDays = System.DateTime.DaysInMonth(Convert.ToInt32(year), Convert.ToInt32(month));
                    DateTime startDate = Convert.ToDateTime(year + "-" + month + "-01");
                    DateTime endDate = Convert.ToDateTime(year + "-" + month + "-" + noOfDays);
                    DateTime dtStartDate = new DateTime();
                    DateTime dtEndDate = new DateTime();
                    dtStartDate = Convert.ToDateTime(startDate);
                    dtEndDate = Convert.ToDateTime(endDate);
                    DateTime dtDate = dtStartDate;
                    TimeSpan ts;
                    ts = dtEndDate - dtStartDate;
                    for (var j = 0; j <= ts.Days; j++)
                    {
                        if (j != 0)
                        {
                            dtDate = dtDate.AddDays(Convert.ToDouble(1));
                        }

                        DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToInt32(a["Day"]) == dtDate.Day
                            && Convert.ToInt32(a["Month"]) == dtDate.Month && Convert.ToInt32(a["Year"]) == dtDate.Year).ToArray();

                        if (dr.Length > 0)
                        {
                            strContent.Append("<tr>");
                            strContent.Append("<td>" + Convert.ToString(dr[0]["User_Name"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(dr[0]["TP_Date"]) + "</td>");


                            strContent.Append("<td>" + Convert.ToString(dr[0]["Activity_Code"]) + "</td>");


                            strContent.Append("<td>" + Convert.ToString(dr[0]["Project_Code"]) + "</td>");


                            strContent.Append("<td>" + Convert.ToString(dr[0]["Category"]) + "</td>");


                            strContent.Append("<td>" + Convert.ToString(dr[0]["CP_name"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(dr[0]["Meeting_point"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(dr[0]["Meeting_Time"]) + "</td>");

                            strContent.Append("<td>" + Convert.ToString(dr[0]["Work_Area"]) + "</td>");

                            #region TP SFC details
                            //  var sfcDet = jsonPath(jsData, "$.Tables[4].Rows[?(@.TP_Id=='" + details[0].TP_Id + "')]");
                            DataRow[] drSFC = ds.Tables[2].AsEnumerable().Where(z => Convert.ToString(z["TP_Id"]) == Convert.ToString(dr[0]["TP_Id"])).ToArray();
                            StringBuilder strSFC = new StringBuilder();

                            if (drSFC.Length > 0)
                            {
                                for (int s = 0; s < drSFC.Length; s++)
                                {
                                    if (!string.IsNullOrEmpty(Convert.ToString(drSFC[s]["From_Place"])))
                                    {
                                        strSFC.Append("" + (s + 1) + "/ " + Convert.ToString(drSFC[s]["From_Place"]) + "  to  "
                                            + Convert.ToString(drSFC[s]["To_Place"]) + "<br />");
                                    }
                                }
                            }
                            strContent.Append("<td>" + strSFC.ToString() + "</td>");
                            #endregion TP SFC details
                            StringBuilder strAccName = new StringBuilder();
                            if (!string.IsNullOrEmpty(Convert.ToString(dr[0]["Accomp_Name"])))
                            {
                                strAccName.Append("" + Convert.ToString(dr[0]["Accomp_Name"]) + " <br />");
                            }
                            if (!string.IsNullOrEmpty(Convert.ToString(dr[0]["Accompanist2_Name"])))
                            {
                                strAccName.Append("" + Convert.ToString(dr[0]["Accompanist2_Name"]) + "<br />");
                            }
                            if (!string.IsNullOrEmpty(Convert.ToString(dr[0]["Accompanist3_Name"])))
                            {
                                strAccName.Append("" + Convert.ToString(dr[0]["Accompanist3_Name"]) + "<br />");
                            }
                            if (!string.IsNullOrEmpty(Convert.ToString(dr[0]["Accompanist4_Name"])))
                            {
                                strAccName.Append("" + Convert.ToString(dr[0]["Accompanist4_Name"]) + "<br /> ");
                            }

                            strContent.Append("<td>" + strAccName.ToString() + "</td>");
                            DataRow[] drDoctors = ds.Tables[1].AsEnumerable().Where(c => Convert.ToString(c["TP_Date"]) ==
                                Convert.ToString(dr[0]["TP_Date"])).ToArray();


                            if (drDoctors.Length > 0)
                            {
                                // content += "<td>" + dJsonData.length + "</td>";
                                strContent.Append("<td align='center' ><span onclick='fnTPDetails(\"" + userCode + "_"
                                    + dr[0]["TP_Date"] + "\")' style='text-decoration:underline;cursor:pointer'>" + drDoctors.Length + "</span></td>");
                            }
                            else
                            {
                                strContent.Append("<td></td>");
                            }


                            strContent.Append("<td>" + Convert.ToString(dr[0]["Entered_Date"]) + "</td>");

                            strContent.Append("<td>" + Convert.ToString(dr[0]["Entered_by"]) + "</td>");



                            strContent.Append("<td>" + Convert.ToString(dr[0]["Remarks"]) + "</td>");



                            strContent.Append("<td>" + Convert.ToString(dr[0]["Status"]) + "</td>");


                            strContent.Append("<td>" + Convert.ToString(dr[0]["Approved_Date"]) + "</td>");



                            strContent.Append("<td>" + Convert.ToString(dr[0]["Unapprove_Reason"]) + "</td>");


                            strContent.Append("</tr>");
                        }
                        else
                        {
                            #region holiday details
                            DataRow[] drHoliday = ds.Tables[3].AsEnumerable().Where(a => Convert.ToInt32(a["Day"]) == dtDate.Day
                             && Convert.ToInt32(a["Month"]) == dtDate.Month && Convert.ToInt32(a["Year"]) == dtDate.Year).ToArray();
                            // var details = jsonPath(jsData, "$.Tables[5].Rows[?(@.Day=='" + day + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");
                            if (drHoliday.Length > 0)
                            {
                                if (Convert.ToString(drHoliday[0]["Type"]) == "S")
                                {
                                    strContent.Append("<tr>");
                                    strContent.Append("<td style='background: #efefef;'></td>");


                                    strContent.Append("<td style='background: #efefef;'>" + Convert.ToString(drHoliday[0]["Date"]) + "</td>");

                                    strContent.Append("<td style='background: #efefef;'> - Sunday</td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("</tr>");
                                }
                                else
                                {
                                    strContent.Append("<tr>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'>" + Convert.ToString(drHoliday[0]["Date"]) + "</td>");
                                    strContent.Append("<td style='background: #efefef;'> - Holiday - </td>");

                                    strContent.Append("<td style='background: #efefef;'>" + Convert.ToString(drHoliday[0]["Holiday"]) + "</td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");

                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("<td style='background: #efefef;'></td>");
                                    strContent.Append("</tr>");
                                }
                            }
                            #endregion holiday details
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }

            strContent.Append("</tbody>");
            strContent.Append("</table>");
            string blobUrl = string.Empty;
            if ("Y" == isExcel)
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = objCurInfo.GetUserName();
                string compCode = objCurInfo.GetCompanyCode();
                string fileName = "TPMASTERALUMINI_" + "_" + compCode + "_" + userName + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
                strContent.Clear();
                strContent.Append(blobUrl);
            }
            return strContent.ToString();
        }

        public string GetTPDoctorDetailsForAluminiUsers(string tpDate, string userCode)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BL_Report objReport = new DataControl.BL_Report();
                List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor =
                    new List<MVCModels.HiDoctor_Master.DoctorModel>(objReport.GetTPDoctorDetailsForAlumniUsers(objCurInfo.GetCompanyCode(), tpDate, userCode));
                strContent.Append("<table class='table table-striped' id='tbl_Details'>");
                strContent.Append("<thead>");
                strContent.Append("<tr id='tblTrpopup'>");
                strContent.Append("<th>MDL NO</th>");
                strContent.Append("<th>Doctor Name</th>");
                strContent.Append("<th>Speciality</th>");
                strContent.Append("</tr>");
                strContent.Append("</thead>");
                strContent.Append("<tbody>");

                if (lstDoctor.Count > 0)
                {
                    for (var i = 0; i < lstDoctor.Count; i++)
                    {
                        strContent.Append("<tr>");
                        strContent.Append("<td>" + lstDoctor[i].MDL_Number + "</td>");
                        strContent.Append("<td>" + lstDoctor[i].Customer_Name + "</td>");
                        strContent.Append("<td>" + lstDoctor[i].Speciality_Name + "</td>");
                        strContent.Append("</tr>");
                    }
                }
                strContent.Append("</tbody>");
                strContent.Append("</table>");
            }
            catch (Exception ex)
            {
            }
            return strContent.ToString();
        }
        #endregion tp report alumini users
        #region employee audit report
        public string GetEmployeeAuditReport(string fromDate, string toDate, string isExcel)
        {
            StringBuilder strContent = new StringBuilder();
            string blobUrl = string.Empty;
            strContent.Append("<table><tr><td colspan='7'  class='tblhead'>Employee Audit Report - Period  " + fromDate.Split('-')[2]
                + "/" + fromDate.Split('-')[1] + "/" + fromDate.Split('-')[0] + " to " + toDate.Split('-')[2]
                + "/" + toDate.Split('-')[1] + "/" + toDate.Split('-')[0] + "</td></tr></table>");
            strContent.Append("<table class='table table-striped'  id='tblEmployee'><thead><tr><th>S.No</th><th>Date</th><th>Employee Name </th><th>Employee Number</th>");
            strContent.Append("<th>Gender</th><th>Date of birth</th><th>Address</th><th>Phone</th><th>Mobile</th>");
            strContent.Append("<th>Employee Status</th><th>Email Id</th><th>Date of Joining</th><th>EDN Proof</th><th>Salary Proof</th>");
            strContent.Append("<th>Resume Given</th><th>Resignation Submitted</th><th>Appointed</th><th>Bank Account Number1</th><th>Bank Account Number2</th>");
            strContent.Append("<th>PF Number</th><th>PAN Number</th><th>Effective From</th><th>Effective To</th><th>Confirmation Date</th>");
            strContent.Append("<th>Employee Entity Type</th><th>Created By</th><th>Created DateTime</th>");
            strContent.Append("<th>Updated By</th><th>Updated DateTime</th></tr></thead><tbody>");
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLUser objUser = new DataControl.BLUser();
                List<MVCModels.HiDoctor_Master.EmployeeModel> lstEmp =
                        new List<MVCModels.HiDoctor_Master.EmployeeModel>(objUser.GetEmployeeAuditReport(objCurInfo.GetCompanyCode(), fromDate, toDate));
                int i = 0;
                if (lstEmp.Count > 0)
                {
                    foreach (var dr in lstEmp)
                    {
                        i++;
                        strContent.Append("<tr><td>" + i + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr.Updated_DateTime).Substring(0, 10) + "</td>");
                        strContent.Append("<td>" + dr.Employee_Name + "</td>");
                        strContent.Append("<td>" + dr.Employee_Number + "</td>");
                        strContent.Append("<td>" + dr.Gender + "</td>");
                        if (dr.Date_Of_Birth == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Date_Of_Birth + "</td>");
                        }
                        //strContent.Append("<td>" + dr.Date_Of_Birth + "</td>");
                        strContent.Append("<td>" + dr.Address + "</td>");
                        strContent.Append("<td>" + dr.Phone + "</td>");
                        strContent.Append("<td>" + dr.Mobile + "</td>");
                        strContent.Append("<td>" + dr.Employee_Status + "</td>");
                        strContent.Append("<td>" + dr.Email_Id + "</td>");
                        if (dr.Date_of_Joining == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Date_of_Joining + "</td>");
                        }

                        strContent.Append("<td>" + ((dr.EDN_Proof == "0") ? "No" : "Yes") + "</td>");
                        strContent.Append("<td>" + ((dr.Salary_Proof == "0") ? "No" : "Yes") + "</td>");
                        strContent.Append("<td>" + ((dr.Resume_Given == "0") ? "No" : "Yes") + "</td>");
                        strContent.Append("<td>" + ((dr.Resignation_Submitted == "0") ? "No" : "Yes") + "</td>");
                        strContent.Append("<td>" + ((dr.Appointed == "0") ? "No" : "Yes") + "</td>");
                        strContent.Append("<td>" + dr.SCB_Account_Number + "</td>");
                        strContent.Append("<td>" + dr.ICICI_Account_Number + "</td>");
                        strContent.Append("<td>" + dr.PF_Number + "</td>");
                        strContent.Append("<td>" + dr.PAN_Number + "</td>");
                        if (dr.Effective_From == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Effective_From + "</td>");
                        }
                        if (dr.Effective_To == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Effective_To + "</td>");
                        }
                        if (dr.Confirmation_Date == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Confirmation_Date + "</td>");
                        }
                        strContent.Append("<td>" + dr.Employee_Entity_Type + "</td>");
                        strContent.Append("<td>" + dr.Created_By + "</td>");
                        if (dr.Created_DateTime == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Created_DateTime + "</td>");
                        }
                        strContent.Append("<td>" + dr.Updated_By + "</td>");
                        if (dr.Updated_DateTime == "01/01/1900")
                        {
                            strContent.Append("<td></td>");
                        }
                        else
                        {
                            strContent.Append("<td>" + dr.Updated_DateTime + "</td>");
                        }
                        strContent.Append("</tr>");
                    }
                }
                else
                {
                    strContent.Append("<tr><td colspan='29' style='text-align:center;'>No records found</td></tr>");
                }
                strContent.Append("</tbody>");
                strContent.Append("</table>");
                if ("Y" == isExcel)
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = objCurInfo.GetUserName();
                    string compCode = objCurInfo.GetCompanyCode();
                    string fileName = "EMPLOYEEAUDITREPORT_" + "_" + compCode + "_" + userName + ".xls";
                    blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
                    strContent.Clear();
                    strContent.Append(blobUrl);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }

            return strContent.ToString();
        }
        #endregion employee audit report
    }
}