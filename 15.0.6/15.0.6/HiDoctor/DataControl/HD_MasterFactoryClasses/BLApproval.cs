using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using HDQueueService;
using Newtonsoft.Json;

namespace DataControl
{
    public class BLApproval
    {
        private DALApproval _objApproval = new DALApproval();
        private DALMaster _objMaster = new DALMaster();
        private DataControl.SPData _objSPData = new DataControl.SPData();
        //private string _queueAccountKey = System.Configuration.ConfigurationManager.AppSettings["ServiceBusConnection"].ToString();
        //private string _topicName = System.Configuration.ConfigurationManager.AppSettings["busDCRTopicName"].ToString();
        //private string _subscriptionName = System.Configuration.ConfigurationManager.AppSettings["busDCRSubscriptionName"].ToString();

        // DCR Approval Screen Start here
        /// <summary>
        /// Get Divisions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.DivisionModel> GetDivisions(string companyCode, string userCode)
        {
            return _objApproval.GetDivisions(companyCode, userCode);
        }

        public DataSet GetDCRAppliedUserCount(string companyCode, string userCode, string flag, string dcrStatus, string month, string year)
        {
            DataSet ds = new DataSet();
            return ds = _objApproval.GetDCRAppliedUserCount(companyCode, userCode, flag, dcrStatus, month, year);
        }

        //********************************** START- DELETE DCR ***************************************//
        public DataSet GetDCRDetailsForDelete(string companyCode, string userCode, int month, int year, string dcrFlag, int dcrStatus)
        {
            return _objApproval.GetDCRDetailsForDelete(companyCode, userCode, month, year, dcrFlag, dcrStatus);
        }

        public string DeleteDCR(string companyCode, string userCode, string selectedDCRs, int dcrStatus, string LoginuserCode)
        {
            string lockPrivilege = "";
            SPData objSP = new SPData();
            lockPrivilege = objSP.GetSinglePrivilegeNameForUser(companyCode, userCode, "DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK");
            lockPrivilege = ((lockPrivilege == "") ? "DISABLED" : lockPrivilege);
            return _objApproval.DeleteDCR(companyCode, userCode, selectedDCRs, lockPrivilege, dcrStatus, LoginuserCode);
        }
        //********************************** END - DELETE DCR ***************************************//

        /*********************************** START: DCR Lock Release **********************************/
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<DCRActivityLockModel> GetDCRLockedData(string company_Code, string user_Code, string FromDate, string ToDate,string Privilegevalue)
        {
            return _objApproval.GetDCRLockedRows(company_Code, user_Code, FromDate, ToDate, Privilegevalue);
        }

        public string UpdateDCRLockToRelease(string company_Code, DCRActivityLockModel DCRLock)
        {
            return _objApproval.UpdateDCRLockToRelease(company_Code, DCRLock);
        }
        /*********************************** END: DCR Lock Release **********************************/

        /*********************************** START: Notice Borad Approval **********************************/
        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="selected_User_Code"></param>
        /// <param name="loggedIn_User_Code"></param>
        /// <returns></returns>
        public List<NoticeBoardModel> GetNoticesForApprovalAndUnapproval(string company_Code, string selected_User_Code,
            string loggedIn_User_Code, string Self_Approval_Pri_Value)
        {
            return _objApproval.GetNoticesForApprovalAndUnapproval(company_Code, selected_User_Code, loggedIn_User_Code, Self_Approval_Pri_Value);
        }

        public string ChangeStatusForNotices(string company_Code, string msg_Codes, string status)
        {
            status = status.ToUpper().Trim() == "APPROVE" ? "Y" : "N";
            return _objApproval.ChangeStatusForNotices(company_Code, msg_Codes, status);
        }
        /*********************************** END: Notice Borad Approval **********************************/

        public DataSet GetSFCAppliedUsers(string companyCode, string regionCodes)
        {
            DataSet ds = new DataSet();
            return ds = _objApproval.GetSFCAppliedUsers(companyCode, regionCodes);
        }

        public DataSet GetRegionSFCRecord(string companyCode, string regionCode, string status)
        {
            DataSet ds = new DataSet();
            return ds = _objApproval.GetSFCrecord(companyCode, regionCode, status);
        }
        public string SFCBulkApproval(string companyCode, string regionCode, string fareCodes, string mode)
        {
            string result = string.Empty;
            return result = _objApproval.SFCBulkApproval(companyCode, regionCode, fareCodes, mode);
        }

        public string SFCBulkApprovals(string companyCode, string regionCode, string fareCodes, string mode)
        {
            string result = string.Empty;
            return result = _objApproval.SFCBulkApprovals(companyCode, regionCode, fareCodes, mode);
        }

        public bool CheckSFCInCPTPDCR(string companyCode, string regionCode, string fareCodes)
        {
            DataSet ds = new DataSet();
            bool checkSFC = false;
            ds = _objApproval.CheckSFCInCPTPDCR(companyCode, regionCode, fareCodes);
            if (ds != null && ds.Tables != null)
            {
                if (ds.Tables[0].Rows.Count > 0 || ds.Tables[1].Rows.Count > 0 || ds.Tables[2].Rows.Count > 0 || ds.Tables[3].Rows.Count > 0 || ds.Tables[4].Rows.Count > 0)
                {
                    checkSFC = true;
                }
                else
                {
                    checkSFC = false;
                }
            }
            else
            {
                checkSFC = false;
            }
            return checkSFC;
        }


        public DataSet GetSFCInCPTPDCRPopup(string companyCode, string regionCode, string fareCodes)
        {
            DataSet ds = new DataSet();
            return ds = _objApproval.CheckSFCInCPTPDCR(companyCode, regionCode, fareCodes);
        }

        //----------------------------------START- MARKETING CAMPAIGN APPROVAL----------------------------------------//
        /// <summary>
        /// Insert BulkApproval for MarketCampaignToApproval
        /// </summary>
        /// <param name="lstStatusMaster"></param>
        /// <returns></returns>


        public int InsertBulkApprovalforMarketCampaignToApproval(List<MCHeaderModel> lstMarketcampaign, string updatedBy)
        {
            DataTable UnApproval = null;
            try
            {
                _objApproval = new DALApproval();
                if (lstMarketcampaign.Count >= 1)
                {
                    UnApproval = new DataTable();

                    UnApproval.Columns.Add("Company_Code", typeof(string));
                    UnApproval.Columns.Add("Campaign_Code", typeof(string));
                    UnApproval.Columns.Add("Record_Status", typeof(int));
                    UnApproval.Columns.Add("Remarks", typeof(string));
                    UnApproval.Columns.Add("Updated_By", typeof(string));
                    for (int i = 0; i < lstMarketcampaign.Count; i++)
                    {
                        UnApproval.Rows.Add(lstMarketcampaign[i].Company_Code, lstMarketcampaign[i].Campaign_Code, lstMarketcampaign[i].Record_Status, lstMarketcampaign[i].Remarks, updatedBy);
                    }
                }
                return _objApproval.InsertBulkApprovalforMarketCampaignToApproval(lstMarketcampaign, UnApproval, updatedBy);
            }
            catch (Exception EX)
            {
                throw EX;
            }
        }



        /// <summary>
        /// Get AppliedChildUser
        /// </summary>
        /// <param name="mcHeaderModel"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.MCHeaderModel> GetAppliedChildUserForMarketingCampaign(string companyCode, string regionCode)
        {
            try
            {
                _objApproval = new DALApproval();
                return _objApproval.GetAppliedChildUserForMarketingCampaign(companyCode, regionCode);

            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        //----------------------------------END- MARKETING CAMPAIGN APPROVAL----------------------------------------//
        public StringBuilder GetDCRLeaveData(string companyCode, string userCode, string flag, string dcrStatus, string month, string year, string loginUserTypeCode)
        {
            List<DCRLeaveApprovalDataModel> lstDCRLeaveData = _objApproval.DCRLeaveApprovalData(companyCode, userCode, flag, dcrStatus, month, year);
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = _objMaster.GetPrivilegeLst(loginUserTypeCode);
            int Leave_Privilege = _objMaster.GetLeavePrivilegeForSelectedUser(userCode, companyCode);
            bool checkPrivilegeBulkDcrApproval = true;
            if (lstPrivilege.Where(x => x.Privilege_Name == "BULK_DCR_APPROVAL" && x.Privilege_Value_Name == "NO").Count() > 0 ? true : false)
            {
                checkPrivilegeBulkDcrApproval = false;
            }

            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstSelectedUserPrivileges = _objMaster.GetPrivilegeLstApproval(userCode);
            Boolean checkPrivilegeBulkDcrApprovalUser = lstSelectedUserPrivileges.Count() > 0 ? true : false;
            Boolean checkPrivilegeUnApprovalUser = true;
            if (dcrStatus == "2^")
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstCanUnapprovePrivileges = _objMaster.GetPrivilegeLstUnApproval(loginUserTypeCode);
                checkPrivilegeUnApprovalUser = lstCanUnapprovePrivileges.Count() > 0 ? true : false;

            }

            return GetDCRLeaveHTMLTable(lstDCRLeaveData, month, year, flag, dcrStatus, checkPrivilegeBulkDcrApproval, Leave_Privilege, checkPrivilegeBulkDcrApprovalUser, checkPrivilegeUnApprovalUser);
        }

        public StringBuilder GetDCRData(string companyCode, string userCode, string flag, string dcrStatus, string month, string year, string loginUserTypeCode)
        {
            List<DCRApprovalDataModel> lstDCRApproval = _objApproval.GetDCRApprovalData(companyCode, userCode, flag, dcrStatus, month, year);
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = _objMaster.GetPrivilegeLst(loginUserTypeCode);
            int Leave_Privilege = _objMaster.GetLeavePrivilegeForSelectedUser(userCode, companyCode);

            Boolean checkPrivilegeBulkDcrApproval = lstPrivilege.Where(x => x.Privilege_Name == "BULK_DCR_APPROVAL" && x.Privilege_Value_Name == "NO").Count() > 0 ? true : false;

            //  return GetDCRHTMLTable(lstDCRApproval, month, year, flag, dcrStatus, checkPrivilegeBulkDcrApproval);
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstSelectedUserPrivileges = _objMaster.GetPrivilegeLstApproval(userCode);
            Boolean checkPrivilegeBulkDcrApprovalUser = lstSelectedUserPrivileges.Count() > 0 ? true : false;
            Boolean checkPrivilegeUnApprovalUser = true;
            if (dcrStatus == "2^")
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstCanUnapprovePrivileges = _objMaster.GetPrivilegeLstUnApproval(loginUserTypeCode);
                checkPrivilegeUnApprovalUser = lstCanUnapprovePrivileges.Count() > 0 ? true : false;

            }
            return GetDCRHTMLTable(lstDCRApproval, month, year, flag, dcrStatus, checkPrivilegeBulkDcrApproval, Leave_Privilege, checkPrivilegeBulkDcrApprovalUser, checkPrivilegeUnApprovalUser);
        }
        public string GetMonthExpenseStatus(string userCode, DateTime dcr_Date, string companyCode)
        {
            return _objApproval.GetGetMonthExpenseStatus(userCode, dcr_Date, companyCode);
        }
        string DOCTOR_CAPTION;
        string CHEMIST_CAPTION;
        string STOCKIEST_CAPTION;
        public string GetPrivillegeValue()
        {
            CurrentInfo _objCur = new CurrentInfo();
            DOCTOR_CAPTION = _objCur.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");

            if (DOCTOR_CAPTION.Length >= 21)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(20) + "...";

            }
            DOCTOR_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(DOCTOR_CAPTION.ToLower());

            CHEMIST_CAPTION = _objCur.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            if (CHEMIST_CAPTION.Length >= 21)
            {
                CHEMIST_CAPTION = CHEMIST_CAPTION.Remove(20) + "...";

            }
            CHEMIST_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(CHEMIST_CAPTION.ToLower());
            STOCKIEST_CAPTION = _objCur.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 21)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(20) + "...";

            }
            STOCKIEST_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(STOCKIEST_CAPTION.ToLower());
            var ChemistVisitPrvilg = _objCur.GetPrivilegeValue("DCR_Chemist_Visit_Mode", "No");
            return DOCTOR_CAPTION;
        }

        public StringBuilder GetDCRLeaveHTMLTable(List<DCRLeaveApprovalDataModel> lstDCRLeaveApproval, string month, string year, string flag, string dcrStatus, Boolean checkPrivilegeBulkDcrApproval, int Leave_Privilege, Boolean checkPrivilegeBulkDcrApprovalUser, Boolean checkPrivilegeUnApprovalUser)
        {
            GetPrivillegeValue();
            StringBuilder sbTblContent = new StringBuilder();
            int rowNo = 0;
            if (lstDCRLeaveApproval != null && lstDCRLeaveApproval.Count > 0)
            {
                sbTblContent.Append("<table class='table table-bordered' style='border-collapse:collapse;' id='tbldcrbulkapproval'>");
                sbTblContent.Append("<thead>");
                sbTblContent.Append("<tr>");

                if (Leave_Privilege == 1)
                {
                    if (checkPrivilegeBulkDcrApproval)
                    {
                        sbTblContent.Append("<th style='text-align:center'><input id='chkSelect_All' name='chkSelectAll' type='checkbox' /></br>Select</th>");
                    }
                    else
                    {
                        sbTblContent.Append("<th>Select</th>");
                    }
                }
                else
                {
                    sbTblContent.Append("<th>Select</th>");
                }

                if (checkPrivilegeBulkDcrApprovalUser && (dcrStatus != "0^" && dcrStatus != "0^1^2^"))
                {
                    if (checkPrivilegeUnApprovalUser)
                    {
                        sbTblContent.Append("<th style='text-align:center'>DCR </br> Enable lock</th>");
                    }
                }
                sbTblContent.Append("<th style='min-width:80px;'>From Date</th>");
                sbTblContent.Append("<th  style='min-width:80px;'>To Date</th>");
                sbTblContent.Append("<th style='min-width:80px;'>Leave</br>Type Name</th>");
                //sbTblContent.Append("<th style='min-width:80px;'>Entered By</th>");
                sbTblContent.Append("<th style='min-width:80px;'>Entered Date</th>");
                sbTblContent.Append("<th style='min-width:90px;'>Leave Reason</th>");
                if (dcrStatus != "1^")
                {
                    sbTblContent.Append("<th style='min-width:100px;'>Leave </br>Approval/Unapproval</br> Reason</th>");
                }
                sbTblContent.Append("<th>Remarks</th>");
                //sbTblContent.Append("<th style='max-width:75px;'>Attachment</br>Count</th>");
                sbTblContent.Append("<th>Attachment</br>Name</th>");
                if (dcrStatus != "1^")
                {
                    sbTblContent.Append("<th style='min-width:80px;'>Updated By</th>");
                    sbTblContent.Append("<th style='min-width:80px;'>Updated Date</th>");
                }
                //sbTblContent.Append("<th>Attachment</br>URL</th>");
                sbTblContent.Append("</tr></thead>");
                foreach (DCRLeaveApprovalModel dcrLeaveApproval in lstDCRLeaveApproval[0].lstDCRLeaveApprovalData)
                {
                    rowNo++;
                    sbTblContent.Append("<tr style='text-align:center'>");
                    sbTblContent.Append("<td style='text-align:center'>");
                    if (Leave_Privilege == 1)
                    {
                        sbTblContent.Append("<input type='checkbox' class='chkShow' id='chkSelect_" + rowNo + "' name='chkSelect' />");
                    }
                    sbTblContent.Append("<input type='hidden' id='hdnDCR_" + rowNo + "'");
                    sbTblContent.Append("value='" + dcrLeaveApproval.From_Date + "|" + dcrLeaveApproval.To_Date + "|" + dcrLeaveApproval.Flag + "|" + dcrLeaveApproval.DCR_Status + "|" + dcrLeaveApproval.Leave_Type_Name + "|" + "'/></br>");
                    if (checkPrivilegeBulkDcrApprovalUser && (dcrStatus != "0^" && dcrStatus != "0^1^2^"))
                    {
                        if (checkPrivilegeUnApprovalUser)
                        {
                            sbTblContent.Append("<td style='text-align:center'>");
                            sbTblContent.Append("<input type='checkbox' class='chkShowUser'  id='chkSelectUser_" + rowNo + "' name='chkSelectUser' checked='checked' />");
                            sbTblContent.Append("<input type='hidden' id='hdnDCRUnapprove_" + rowNo + "'");

                            sbTblContent.Append("value='" + dcrLeaveApproval.From_Date + "|" + dcrLeaveApproval.To_Date + "|" + dcrLeaveApproval.Flag + "|" + dcrLeaveApproval.DCR_Status + "|" + dcrLeaveApproval.Leave_Type_Name + "|" + "'/></br>");
                            sbTblContent.Append("</td>");
                        }
                    }
                    sbTblContent.Append("<td>" + dcrLeaveApproval.From_Date + "</td>");
                    sbTblContent.Append("<td>" + dcrLeaveApproval.To_Date + "</td>");
                    sbTblContent.Append("<td>" + dcrLeaveApproval.Leave_Type_Name + "</td>");
                    //sbTblContent.Append("<td>" + dcrLeaveApproval.Created_By + "</td>");
                    sbTblContent.Append("<td>" + dcrLeaveApproval.Entered_Date + "</td>");
                    sbTblContent.Append("<td>" + dcrLeaveApproval.Leave_Reason + "</td>");
                    if (dcrStatus != "1^")
                    {
                        sbTblContent.Append("<td>" + dcrLeaveApproval.Approval_Unapproval_Reason + "</td>");
                    }
                    sbTblContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "' onblur='fnCheckRemarksSpecialCharforDCRinBlurfun(this)'>NIL</textarea></td>");
                    if (dcrLeaveApproval.Attachment_Count > 0)
                    {
                        int document_Id = dcrLeaveApproval.Attachment_Id;
                        List<DCRLeaveAttachmentModel> lstAttachments = lstDCRLeaveApproval[0].lstLeaveAttachmentData.Where(a => a.Attachment_Id == document_Id).ToList();
                        sbTblContent.Append("<td>");
                        foreach (DCRLeaveAttachmentModel dcrLeaveAttachment in lstAttachments)
                        {
                            sbTblContent.Append("<span><a href='" + dcrLeaveAttachment.Attachment_Url + "'>" + dcrLeaveAttachment.Attachment_Name + " </span>");
                            sbTblContent.Append("</br>");
                        }
                        sbTblContent.Append("</td>");
                    }
                    else
                    {
                        sbTblContent.Append("<td>No Attachments Found</td>");
                    }
                    if (dcrStatus != "1^")
                    {
                        sbTblContent.Append("<td>" + dcrLeaveApproval.Updated_By + "</td>");
                        sbTblContent.Append("<td>" + dcrLeaveApproval.Updated_Date + "</td>");
                    }
                    sbTblContent.Append("</tr>");
                }
                sbTblContent.Append("</tbody></table>");
            }
            else
            {
                sbTblContent.Append("NO");
            }
            return sbTblContent;
        }

        public StringBuilder GetDCRHTMLTable(List<DCRApprovalDataModel> lstDCRApproval, string month, string year, string flag, string dcrStatus, Boolean checkPrivilegeBulkDcrApproval, int Leave_Privilege, Boolean checkPrivilegeBulkDcrApprovalUser, Boolean checkPrivilegeUnApprovalUser)

        {
            GetPrivillegeValue();
            StringBuilder sbTableContent = new StringBuilder();
            int rowNo = 0;
            if (lstDCRApproval != null && lstDCRApproval.Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped' id='tbldcrbulkapproval'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");

                if (checkPrivilegeBulkDcrApproval)
                    sbTableContent.Append("<th>Select Report</th>");
                else
                    sbTableContent.Append("<th style='text-align:center'><input id='chkSelect_All' name='chkSelectAll' type='checkbox' /></br>Select Report</th>");

                if (checkPrivilegeBulkDcrApprovalUser && !checkPrivilegeBulkDcrApproval && (dcrStatus != "0^" && dcrStatus != "0^1^2^"))
                    if (checkPrivilegeUnApprovalUser)
                        sbTableContent.Append("<th style='text-align:center'>DCR </br> Enable lock</th>");


                if (!checkPrivilegeBulkDcrApproval)
                    sbTableContent.Append("<th>Remarks</th>");
                sbTableContent.Append("<th>TP Detail</th>");
                sbTableContent.Append("<th>Approval History</th>");
                sbTableContent.Append("<th>DCR Date</th>");
                sbTableContent.Append("<th>Entered Date</th>");
                sbTableContent.Append("<th>Flag</th>");
                sbTableContent.Append("<th>Work Category</th>");
                sbTableContent.Append("<th>Place Worked</th>");
                sbTableContent.Append("<th>DCR Common Remarks / Leave Reason</th>");
                sbTableContent.Append("<th>" + DOCTOR_CAPTION + " Count</th>");
                sbTableContent.Append("<th>" + CHEMIST_CAPTION + " Count</th>");
                sbTableContent.Append("<th>" + STOCKIEST_CAPTION + " Count</th>");
                sbTableContent.Append("<th>Status</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (DCRApprovalModel dcrApproval in lstDCRApproval[0].lstDCRApprovalData)
                {
                    rowNo++;
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='text-align:center'>");
                    if ((dcrApproval.Flag == "ALL") && Leave_Privilege == 0)
                    {
                        // || dcrApproval.Flag == "Leave"
                        sbTableContent.Append("<input type='checkbox' class='chkShow' id='chkSelect_" + rowNo + "' name='chkSelect' />");
                    }
                    else if (!checkPrivilegeBulkDcrApproval)
                    {
                        if (dcrApproval.Flag == "Leave" && Leave_Privilege == 1)
                        {

                        }
                        else
                        {
                            sbTableContent.Append("<input type='checkbox' class='chkShow'  id='chkSelect_" + rowNo + "' name='chkSelect'  />");
                        }
                    }

                    var screenName = "DCRApproval";
                    sbTableContent.Append("<input type='hidden' id='hdnDCR_" + rowNo + "'");
                    sbTableContent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/></br>");
                    sbTableContent.Append("<span onclick='fnReportTwo(\"" + dcrApproval.User_Code + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Region_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + month + "|" + year + "|" + dcrStatus + "|" + flag + "|" + dcrApproval.DCR_Code + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.Source_Of_Entry + "|" + screenName + "\")' style='text-decoration:underline;cursor:pointer'>Report</span></td>");

                    if (checkPrivilegeBulkDcrApprovalUser && !checkPrivilegeBulkDcrApproval && (dcrStatus != "0^" && dcrStatus != "0^1^2^"))
                        if (checkPrivilegeUnApprovalUser)
                        {
                            sbTableContent.Append("<td style='text-align:center'>");
                            sbTableContent.Append("<input type='checkbox' class='chkShowUser'  id='chkSelectUser_" + rowNo + "' name='chkSelectUser' checked='checked' />");
                            sbTableContent.Append("<input type='hidden' id='hdnDCRUnapprove_" + rowNo + "'");

                            sbTableContent.Append("value='" + dcrApproval.DCR_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Source_Of_Entry + "'/>");
                            sbTableContent.Append("</td>");
                        }

                    if (!checkPrivilegeBulkDcrApproval)
                    {
                        sbTableContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "' onblur='fnCheckRemarksSpecialCharforDCRinBlurfun(this)'/></br>");
                        //sbTableContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "' onblur='fnCheckRemarksSpecialCharforDCR(this);' /></br>");
                        sbTableContent.Append("<span onclick='fnShowPreviousRemarks(\"" + dcrApproval.Unapproval_Reason + "\")' style='text-decoration:underline;cursor:pointer;display:none'>Previous Remarks</span></td>");
                    }
                    //TP Details
                    var listTp = lstDCRApproval[0].lstTPApprovaldata.Where(s => s.TP_DATE == dcrApproval.DCR_Date).ToList();
                    sbTableContent.Append("<td>");
                    if (listTp.Count > 0)
                    {
                        sbTableContent.Append("<span onclick='fnSeeTpDetails(\"" + listTp[0].TP_ID + "\")' style='text-decoration:underline;cursor:pointer;color:#06C;'>TP Details</span>");
                    }
                    else
                    {
                        sbTableContent.Append("No TP Details.");
                    }
                    sbTableContent.Append("</td>");
                    //View History Details
                    sbTableContent.Append("<td class='td-a'>");
                    sbTableContent.Append("<span onclick='fnViewApprovalHistory(\"" + dcrApproval.DCR_Code + "|" + dcrApproval.User_Code + "\")' style='text-decoration:underline;cursor:pointer'>View</span>");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.DCR_Date);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Entered_Date);
                    sbTableContent.Append("</td>");
                    if (dcrApproval.Flag == "Leave")
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(dcrApproval.Flag + "(" + dcrApproval.Leave_Type_Name + ")");
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(dcrApproval.Flag);
                        sbTableContent.Append("</td>");
                    }
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Category);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Place_Worked);
                    sbTableContent.Append("</td>");
                    string DcrcommonRemarks = ((string.IsNullOrEmpty(dcrApproval.DCR_General_Remarks)) ? "" : dcrApproval.DCR_General_Remarks.ToString());
                    DcrcommonRemarks = DcrcommonRemarks.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("~", " - ");//.replace(/~/g, ' - ');
                    DcrcommonRemarks = DcrcommonRemarks.Replace("/^/g", "<br />");//.replace(/~/g, ' - ');
                    if (dcrApproval.Flag == "Leave")
                    {
                        sbTableContent.Append("<td>");
                        if (!string.IsNullOrEmpty(dcrApproval.Leave_Reason))
                        {
                            sbTableContent.Append(dcrApproval.Leave_Reason);
                        }
                        sbTableContent.Append("</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(DcrcommonRemarks);
                        sbTableContent.Append("</td>");
                    }
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Doctor_Count);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Chemist_Count);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(dcrApproval.Stockist_Count);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td " + GetDCRApprovalColorCode(dcrApproval.DCR_Status) + ">");
                    sbTableContent.Append(dcrApproval.DCR_Status);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("NO");
            }
            return sbTableContent;
        }

        public string GetDCRApprovalColorCode(string status)
        {
            string style = string.Empty;
            switch (status.ToUpper())
            {
                case "APPROVED":
                    style = "style=color:white;background-color:darkgreen";
                    break;
                case "APPLIED":
                    style = "style=color:white;background-color:DodgerBlue";
                    break;
                case "UNAPPROVED":
                    style = "style=color:white;background-color:crimson";
                    break;
                default:
                    style = "";
                    break;
            }
            return style;
        }

        public List<DoctorApprovalCountsModel> GetDoctorApproverMaxCounts(List<DoctorApprovalCountsModel> lstDoctorApprovalCounts, string regionCode)
        {
            List<DoctorApprovalCountsModel> _lstdoctorMaxAvalibleCounts = new List<DoctorApprovalCountsModel>();

            _lstdoctorMaxAvalibleCounts = (from ma in _objApproval.GetDoctorApproverMaxCounts(regionCode)
                                           join da in lstDoctorApprovalCounts
                                           on ma.CategoryCode equals da.CategoryCode
                                           where ma.MaximumDoctorAllowed != 0
                                           select new DoctorApprovalCountsModel
                                           {
                                               CategoryName = ma.CategoryName,
                                               CategoryCode = da.CategoryCode,
                                               MaximumDoctorAllowed = ma.MaximumDoctorAllowed,
                                               AvaliableApprovedDoctors = ma.AvaliableApprovedDoctors,
                                               SelectedForApproval = da.SelectedForApproval,
                                               ExcessDoctor = (ma.MaximumDoctorAllowed - (ma.AvaliableApprovedDoctors + da.SelectedForApproval)) < 0 ? (ma.MaximumDoctorAllowed - (ma.AvaliableApprovedDoctors + da.SelectedForApproval)) : 0
                                           }).ToList();

            return _lstdoctorMaxAvalibleCounts;
        }
        public List<SpecialityDoctorApprovalCountsModel> GetDocSpecialityCounts(List<SpecialityDoctorApprovalCountsModel> lstDocSpecialityCount, string regionCode, string CompanyCode)
        {
            List<SpecialityDoctorApprovalCountsModel> _lstDocSpecialityMaxCount = new List<SpecialityDoctorApprovalCountsModel>();

            List<SpecialityDoctorApprovalCountsModel> _lstSpecialityCheck = new List<SpecialityDoctorApprovalCountsModel>();

            List<SpecialityDoctorApprovalCountsModel> _LstValidation = new List<SpecialityDoctorApprovalCountsModel>();

            _lstSpecialityCheck = (from ma in _objApproval.GetDocSpecialityCounts(regionCode, CompanyCode)
                                   join da in lstDocSpecialityCount
                                   on ma.SpecialityCode equals da.SpecialityCode
                                   where ma.Status == "0"
                                   select new SpecialityDoctorApprovalCountsModel
                                   {
                                       Speciality = da.Speciality,
                                       SpecialityCode = da.SpecialityCode,
                                       Status = da.Status
                                   }).ToList();

            if (_lstSpecialityCheck.Count == lstDocSpecialityCount.Count)
            {
                _lstDocSpecialityMaxCount = (from ma in _objApproval.GetDocSpecialityCounts(regionCode, CompanyCode)
                                             join da in lstDocSpecialityCount
                                             on ma.SpecialityCode equals da.SpecialityCode
                                             where ma.Status == "0"
                                             select new SpecialityDoctorApprovalCountsModel
                                             {
                                                 Speciality = ma.Speciality,
                                                 SpecialityCode = da.SpecialityCode,
                                                 Limit = ma.Limit,
                                                 Current = ma.Current,
                                                 SelectedForApproval = da.SelectedForApproval,
                                                 MaxCanApprove = (ma.Limit - ma.Current),
                                                 Status = "Enabled"
                                             }).ToList();
                return _lstDocSpecialityMaxCount;
            }
            else
            {
                _LstValidation = (from ma in _objApproval.GetDocSpecialityCounts(regionCode, CompanyCode)
                                  join da in lstDocSpecialityCount
                                  on ma.SpecialityCode equals da.SpecialityCode
                                  where ma.Status == "1"
                                  select new SpecialityDoctorApprovalCountsModel
                                  {
                                      Speciality = ma.Speciality,
                                      SpecialityCode = da.SpecialityCode,
                                      Status = "Disabled"
                                  }).ToList();
                return _LstValidation;
            }
        }

        public int GetLeavePolicy(string userCode, string companyCode)
        {
            int result = 0;
            result = _objMaster.GetLeavePrivilegeForSelectedUser(userCode, companyCode);
            return result;
        }

        public StringBuilder GetDCRApprovalAll(string companyCode, string userCode, string flag, string dcrStatus, string month, string year)
        {
            List<DCRApprovalDataModel> lstDCRApproval = _objApproval.GetDCRApprovalData(companyCode, userCode, flag, dcrStatus, month, year);
            return GetDCRApprovalAllHTMLTable(lstDCRApproval, month, year, flag, dcrStatus);
        }

        public StringBuilder GetDCRApprovalAllHTMLTable(List<DCRApprovalDataModel> lstDCRApproval, string month, string year, string flag, string dcrStatus)
        {

            StringBuilder sbContent = new StringBuilder();
            if (lstDCRApproval[0].lstDCRApprovalData != null && lstDCRApproval[0].lstDCRApprovalData.Count > 0)
            {
                foreach (DCRApprovalModel dcrApproval in lstDCRApproval[0].lstDCRApprovalData)
                {
                    sbContent.Append("<span onclick='fnUserperDayReport(\"" + dcrApproval.User_Code + "|" + dcrApproval.DCR_Date + "|" + dcrApproval.Region_Code + "|" + dcrApproval.Flag + "|" + dcrApproval.DCR_Status + "|" + month + "|" + year + "|" + dcrStatus + "|" + flag + "|" + dcrApproval.DCR_Code + "|" + dcrApproval.Unapproval_Reason + "|" + dcrApproval.Leave_Type_Name + "|" + dcrApproval.Source_Of_Entry + "\")' style='text-decoration:underline;cursor:pointer'>" + dcrApproval.DCR_Date + "</span> \n");
                }
            }
            return sbContent;
        }
        public StringBuilder GetDCRRatingparameter(string companyCode, string userCode, string dcrCode, string flag, string loginUserTypeCode, string dcrStatus)
        {
            DALApproval _objApproval = new DALApproval();
            DataSet ds = new DataSet();

            int IsMandatoryRating = 0;

            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = _objMaster.GetPrivilegeLst(loginUserTypeCode);
            Boolean checkPrivilegeBulkDcrApproval = lstPrivilege.Where(x => x.Privilege_Name == "BULK_DCR_APPROVAL" && x.Privilege_Value_Name == "YES").Count() > 0 ? true : false;

            if (checkPrivilegeBulkDcrApproval == false)
            {
                var _userModel = _objMaster.GetUserMaster(userCode);

                IEnumerable<MVCModels.DCRRatingConfig> lstDcrRatingConfig = _objMaster.GetDCRRatingConfigLst(_userModel.User_Type_Code);
                IsMandatoryRating = lstDcrRatingConfig.Where(x => x.Is_Mandatory == true).Count() > 0 ? 1 : 0;
            }
            else
            {
                IsMandatoryRating = 0;
            }

            ds = _objApproval.GetDCRRatingparameter(companyCode, userCode, dcrCode, flag);
            return BindDCRParameter(ds, IsMandatoryRating, dcrStatus);

        }
        public StringBuilder BindDCRParameter(DataSet dsRating, int IsMandatoryRating, string dcrStatus)
        {
            StringBuilder sbContent = new StringBuilder();
            DataRow[] rowFilter;
            string ratingValue = "";
            string ratingRemarks = "";
            string ratingRemark = "";
            bool editableStatus = false;
            if (dsRating.Tables[0].Rows.Count > 0)
            {

                sbContent.Append("<div class='gridHeader'><h3 style='width: 85%;margin:0px auto'>Rating Details</h3></div>");
                sbContent.Append("<table id='tblRating' class='table table-striped' style='width: 85%;margin-bottom: 20px;margin-left: 8%;'>");
                //sbContent.Append("<tr ><td align='left' valign='top'>Rating Parameters</td><td align='left' valign='top'>Rating Value</td></tr>");

                sbContent.Append("<tr ><td align='left' valign='top'>Rating Parameters</td><td align='left' valign='top'>Rating</td><td align='left' valign='top'>Remarks</td></tr>");

                if (dsRating.Tables[1].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsRating.Tables[1].Rows[0]["Remarks_Rating"].ToString()))
                    {
                        ratingRemarks = dsRating.Tables[1].Rows[0]["Remarks_Rating"].ToString();
                    }
                }

                if (dsRating.Tables[1].Rows.Count > 0)
                {
                    editableStatus = true;
                }

                for (int i = 0; i < dsRating.Tables[0].Rows.Count; i++)
                {
                    ratingValue = "0";
                    ratingRemark = "";
                    rowFilter = dsRating.Tables[1].Select("Parameter_Code = '" + dsRating.Tables[0].Rows[i]["Parameter_Code"].ToString().Trim() + "'");

                    if (rowFilter.Length > 0)
                    {
                        ratingValue = rowFilter[0]["Rating_Value"].ToString().Trim();
                        ratingRemark = rowFilter[0]["Remarks"].ToString();
                    }
                    sbContent.Append("<tr>");
                    sbContent.Append("<td align='left' valign='top'><input type='text' id='txtParameterCode_" + (i + 1).ToString() + "' style='display:none' value='" + dsRating.Tables[0].Rows[i]["Parameter_Code"].ToString() + "' />" + dsRating.Tables[0].Rows[i]["Parameter_Name"].ToString() + "</td>");

                    //sbContent.Append("<td align='left' valign='top'><input type='text' id='txtParameterValue_" + (i + 1).ToString() + "' value='" + ratingValue + "'  onblur='validateDecimal(this.value," + (i + 1).ToString() + ")' MaxLength='5'></td></tr>");

                    if (editableStatus)
                    {
                        sbContent.Append("<td align='left' valign='top'><select disabled id='ddlRating_" + (i + 1).ToString() + "'>");
                    }
                    else
                    {
                        sbContent.Append("<td align='left' valign='top'><select id='ddlRating_" + (i + 1).ToString() + "'>");
                    }

                    //sbContent.Append("<td align='left' valign='top'><select id='ddlRating_" + (i + 1).ToString() + "'>");
                    for (int j = 0; j < 11; j++)
                    {
                        if (j == 0)
                        {
                            if (Convert.ToInt32(ratingValue) == j)
                            {
                                sbContent.Append("<option value='0' selected>-- Select Rating --</option>");
                            }
                            else
                            {
                                sbContent.Append("<option value='0'>-- Select Rating --</option>");
                            }
                        }
                        else if (Convert.ToInt32(ratingValue) == j)
                        {
                            sbContent.Append("<option value='" + j + "' selected>" + j + "</option>");
                        }
                        else
                        {
                            sbContent.Append("<option value='" + j + "'>" + j + "</option>");
                        }
                    }
                    sbContent.Append("</select></td>");

                    if (editableStatus)
                    {
                        sbContent.Append("<td><input type='text' id='txtRatingRemark_" + (i + 1).ToString() + "' disabled  value='" + ratingRemark + "' placeholder='Remarks' onkeyup='javascript:fnRemoveSpecialCharactor(this)'    MaxLength='100'></td>");
                    }
                    else
                    {
                        sbContent.Append("<td><input type='text' id='txtRatingRemark_" + (i + 1).ToString() + "'  value='" + ratingRemark + "' placeholder='Remarks' onkeyup='javascript:fnRemoveSpecialCharactor(this)'    MaxLength='100'></td>");
                    }

                    //sbContent.Append("<td><input type='text' id='txtRatingRemark_" + (i + 1).ToString() + "'  value='"+ratingRemark+"' placeholder='Remarks' onkeyup='javascript:fnRemoveSpecialCharactor(this)'    MaxLength='100'></td>");

                    sbContent.Append("</tr>");

                }
                sbContent.Append("<input type='hidden' id='hdnIsMandatoryRating' value='" + IsMandatoryRating + "'></input></table>~");
                sbContent.Append(ratingRemarks);

            }
            else
            {
                sbContent.Append("");

            }

            return sbContent;
        }
        public List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> fnGetDCRPrivilegeReport(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstdcrReport;
            DALMaster _objApproval = new DALMaster();
            return lstdcrReport = _objApproval.fnGetDCRPrivilegeReport(companyCode, userCode);

        }

        public string UpdateLeaveDCRStatus(string companyCode, string usercode, string dcrDetails, string status, string Login_userName, string Login_userCode)
        {
            string result = string.Empty;
            dcrDetails = dcrDetails.TrimEnd('$');
            result = UpdateDCRLeaveStatus(companyCode, usercode, dcrDetails, status, Login_userCode, Login_userName);
            return result;

        }

        private string UpdateDCRLeaveStatus(string companyCode, string usercode, string dcrDetails, string status, string Login_userCode, string Login_userName)
        {
            string result = string.Empty;
            int rowsAffectedForEntity = 0;
            string from_date = "";
            string to_date = "";
            string remarks = "";
            string Activity_Lock = "";
            dcrDetails = dcrDetails.TrimEnd('$');
            string[] dcrData = dcrDetails.Split('$');

            foreach (string dcrValues in dcrData)
            {
                from_date = dcrValues.Split('|')[0];
                to_date = dcrValues.Split('|')[1];
                Activity_Lock = dcrValues.Split('|')[6];
                remarks = dcrValues.Split('|')[7];
                from_date = from_date.Split('-')[2] + "-" + from_date.Split('-')[1] + "-" + from_date.Split('-')[0];
                to_date = to_date.Split('-')[2] + "-" + to_date.Split('-')[1] + "-" + to_date.Split('-')[0];
                rowsAffectedForEntity = _objApproval.UpdateDCREntityCount(companyCode, usercode, status);
                result = _objApproval.UpdateDCRLeaveStatus(companyCode, usercode, from_date, to_date, Activity_Lock, remarks, status, Login_userName);
                if (result != "SUCCESS")
                {
                    break;
                }
            }
            return result;
        }

        public string UpdateDCRStatus(string companyCode, string userCode, string dcrDetails, string dcrStatus, string callBackCode, string curUserName, string approvedBy, string approvedDate, string remarksRating, string parameterDetails)
        {
            //dcr code|flag|dcrStatus|oldreason|leavetypename|dcrDate|newreason$
            string result = "";
            dcrDetails = dcrDetails.TrimEnd('$');
            string[] dcrData = dcrDetails.Split('$');
            string dcrCode = string.Empty;
            string flag = string.Empty;
            string dcrStatusOld = string.Empty;
            string oldReason = string.Empty;
            string leaveTypeName = string.Empty;
            string newReason = string.Empty;
            string dcrDate = string.Empty;
            string leaveValidation = string.Empty;
            string twoActivityExpenseValidation = string.Empty;
            string fareDailyAllowance = string.Empty;
            string dcrlockDate = string.Empty;
            string lockcheck = string.Empty;

            BLMaster objMast = new BLMaster();
            SPData objSP = new SPData();
            leaveValidation = objMast.GetPrivilegeValue(companyCode, userCode, "LEAVE_ENTRY_VALIDATION_REQUIRED_LEAVES");
            twoActivityExpenseValidation = objMast.GetPrivilegeValue(companyCode, userCode, "VALIDATE_TWO_ACTIVITY_EXPENSES");
            fareDailyAllowance = objMast.GetPrivilegeValue(companyCode, userCode, "FARE_DAILY_ALLOWANCE");

            string[] privValues = leaveValidation.Split(',');
            parameterDetails = parameterDetails.TrimEnd('$');
            string[] ratingParametetable = parameterDetails.Split('$');
            List<MVCModels.DCRRatingParameter> lstRatingDetail = new List<MVCModels.DCRRatingParameter>();

            bool isTrue = false;
            bool isCurBalanceNeed = false;


            //Two DCR Activity Validation
            if (twoActivityExpenseValidation.ToUpper() != "NO" && fareDailyAllowance != "" && dcrStatus == "0")
            {
                foreach (string TwoActivityDCRValidation in dcrData)
                {
                    string ExpenseDcrCode = TwoActivityDCRValidation.Split('|')[0];
                    string ExpenseDcrFlag = TwoActivityDCRValidation.Split('|')[1];
                    ExpenseDcrFlag = ((ExpenseDcrFlag == "Field") ? "F" : ((ExpenseDcrFlag == "Leave") ? "L" : "A"));
                    if (TwoActivityDCRValidation.Split('|')[2].ToUpper() == "APPROVED" && ExpenseDcrFlag != "L")
                    {
                        string DCRExpenseClaim = _objApproval.CheckDayExpenseClaim(ExpenseDcrCode, ExpenseDcrFlag);
                        if (DCRExpenseClaim != "")
                        {
                            result = "FAIL:You Cannot Unapprove the other DCR-" + DCRExpenseClaim.Split('|')[0] + "  " + ((DCRExpenseClaim.Split('|')[1] == "F") ? "Field" : ((DCRExpenseClaim.Split('|')[1] == "A") ? "Attendace" : "Leave")) + " as the expenses are claimed in expenses claim";
                            return result;
                        }
                    }
                    if (TwoActivityDCRValidation.Split('|')[2].ToUpper() == "APPLIED" || TwoActivityDCRValidation.Split('|')[2].ToUpper() == "APPROVED" && ExpenseDcrFlag != "L")
                    {
                        string DCRTwoActivity = _objApproval.GetTwoActivityDCRApproval(ExpenseDcrCode, ExpenseDcrFlag, fareDailyAllowance);
                        if (DCRTwoActivity != "")
                        {
                            dcrCode = DCRTwoActivity.Split('|')[0];
                            flag = DCRTwoActivity.Split('|')[1];
                            dcrStatusOld = DCRTwoActivity.Split('|')[2];
                            oldReason = DCRTwoActivity.Split('|')[3];
                            leaveTypeName = DCRTwoActivity.Split('|')[4];
                            dcrDate = DCRTwoActivity.Split('|')[5];
                            newReason = DCRTwoActivity.Split(new char[] { '|' }).Last();


                            string action = ((dcrStatus == "2") ? "Approved" : "Unapproved");
                            newReason = DateTime.Now.ToString("dd/MM/yyyy") + "- " + action + " By " + curUserName + "~" + newReason.Trim() + "^";
                            if (oldReason != "")
                            {
                                newReason = oldReason + newReason.Trim();
                            }
                            _objApproval.InsertDCRApprovalDate(companyCode, dcrDate.Split('/')[2] + "-" + dcrDate.Split('/')[1] + "-" + dcrDate.Split('/')[0]);

                            if (flag != "L")
                            {
                                string rollbackMsg = "SUCCESS";

                                string checkDCRCanBeUnapprove = string.Empty;
                                if (dcrStatus == "0")
                                {
                                    checkDCRCanBeUnapprove = objSP.CheckTheDCRCanbeUnapprove(companyCode, userCode, dcrCode, flag);
                                    if (checkDCRCanBeUnapprove != "SUCCESS")
                                    {
                                        result = "You Cannot unapprove the " + DCRTwoActivity.Split('|')[1] + "  DCR on " + dcrDate + ", since the Date have Leave  as other activity, and no enough Leave balance to reduce.";
                                        break;
                                    }
                                }

                                if (flag.ToUpper() == "F" && dcrStatusOld == "2" && dcrStatus == "0")
                                {
                                    rollbackMsg = _objApproval.RollbackUnapprovedDoctorCount(companyCode, dcrCode, userCode, "0");

                                    if (rollbackMsg == "ERROR")
                                    {
                                        isTrue = false;
                                    }
                                }

                                //if (rollbackMsg == "SUCCESS")
                                //{
                                //    isTrue = UpdateDCRStatus(companyCode, userCode, flag, dcrCode, dcrDate, dcrStatus, dcrStatusOld, approvedBy, approvedDate
                                //                    , newReason, callBackCode, remarksRating, curUserName, fareDailyAllowance);
                                //}

                                if (isTrue && parameterDetails != "")
                                {
                                    MVCModels.DCRRatingParameter lstDetails;
                                    foreach (var rating in ratingParametetable)
                                    {
                                        lstDetails = new MVCModels.DCRRatingParameter();
                                        lstDetails.Company_Code = companyCode;
                                        lstDetails.DCR_Code = dcrCode;
                                        lstDetails.Parameter_Code = rating.Split('|')[0];
                                        lstDetails.Rating_Value = rating.Split('|')[1];
                                        lstDetails.Remarks = rating.Split('|')[2];
                                        lstDetails.DCR_Flag = flag;
                                        lstRatingDetail.Add(lstDetails);
                                    }
                                    isTrue = _objApproval.InsertRatingParameret(companyCode, dcrCode, flag, lstRatingDetail);
                                }
                            }
                            int result_History = _objApproval.InsertDcrHistory(companyCode, dcrCode, flag);
                        }
                    }
                }
            }

            foreach (string dcrValues in dcrData)
            {
                dcrCode = dcrValues.Split('|')[0];
                flag = dcrValues.Split('|')[1];
                flag = ((flag == "Field") ? "F" : ((flag == "Leave") ? "L" : "A"));
                dcrStatusOld = dcrValues.Split('|')[2];
                dcrStatusOld = ((dcrStatusOld == "Applied") ? "1" : ((dcrStatusOld == "Approved") ? "2" : "0"));
                // dcrStatusOld = ((dcrStatusOld == "Applied") ? "1" : "0");
                oldReason = dcrValues.Split('|')[3];
                leaveTypeName = dcrValues.Split('|')[4];
                dcrDate = dcrValues.Split('|')[5];
                // newReason = dcrValues.Split(new char[] { '|' })[6];
                lockcheck = dcrValues.Split('|')[7];
                newReason = dcrValues.Split(new char[] { '|' }).Last();
                //      lockcheck = dcrValues.Split('|')[6];
                //newReason = dcrValues.Split('|')[6];
                //Array.Reverse(dcrData);
                //foreach (var data in dcrData)
                //{
                //    newReason = data.Split('|')[0];
                //}

                string action = ((dcrStatus == "2") ? "Approved" : "Unapproved");
                newReason = DateTime.Now.ToString("dd/MM/yyyy") + "- " + action + " By " + curUserName + "~" + newReason + "^";
                if (oldReason != "")
                {
                    newReason = oldReason + newReason;
                }
                _objApproval.InsertDCRApprovalDate(companyCode, dcrDate.Split('/')[2] + "-" + dcrDate.Split('/')[1] + "-" + dcrDate.Split('/')[0]);

                if (flag == "L")
                {
                    //isCurBalanceNeed = false;

                    //for (int j = 0; j < privValues.Length; j++)
                    //{
                    //    if (privValues[j].ToString().Trim().ToUpper() == leaveTypeName.ToUpper())
                    //    {
                    //        isCurBalanceNeed = true;
                    //        break;
                    //    }
                    //}
                    //if (isCurBalanceNeed)
                    //{
                    //    // get leave balance
                    //    double leaveBalance = _objApproval.GetLeaveBalance(companyCode, userCode, leaveTypeName);
                    //    if (leaveBalance > 0 || dcrStatus == "0")
                    //    {
                    //        isTrue = UpdateDCRStatus(companyCode, userCode, flag, dcrCode, dcrDate, dcrStatus, dcrStatusOld, approvedBy, approvedDate
                    //                , newReason, callBackCode, remarksRating, curUserName);
                    //    }
                    //    else
                    //    {
                    //        //lblMsg.Text = "Due to insufficient leave balance, unable to approve leave for " + leaveTypeName + "";
                    //        result = "Due to insufficient leave balance, unable to approve leave for " + leaveTypeName + "";
                    //        break;
                    //    }
                    //}
                    //else
                    //{
                    isTrue = UpdateDCRStatus(companyCode, userCode, flag, dcrCode, dcrDate, dcrStatus, dcrStatusOld, approvedBy, approvedDate
                                , newReason, callBackCode, remarksRating, curUserName, fareDailyAllowance, lockcheck);
                    //}
                }
                else
                {
                    string rollbackMsg = "SUCCESS";

                    string checkDCRCanBeUnapprove = string.Empty;
                    if (dcrStatus == "0")
                    {
                        checkDCRCanBeUnapprove = objSP.CheckTheDCRCanbeUnapprove(companyCode, userCode, dcrCode, flag);
                        if (checkDCRCanBeUnapprove != "SUCCESS")
                        {
                            result = "You Cannot unapprove the " + dcrValues.Split('|')[1] + "  DCR on " + dcrDate + ", since the Date have Leave  as other activity, and no enough Leave balance to reduce.";
                            break;
                        }
                    }

                    if (flag.ToUpper() == "F" && dcrStatusOld == "2" && dcrStatus == "0")
                    {
                        rollbackMsg = _objApproval.RollbackUnapprovedDoctorCount(companyCode, dcrCode, userCode, "0");

                        if (rollbackMsg == "ERROR")
                        {
                            isTrue = false;
                        }
                    }

                    if (rollbackMsg == "SUCCESS")
                    {
                        isTrue = UpdateDCRStatus(companyCode, userCode, flag, dcrCode, dcrDate, dcrStatus, dcrStatusOld, approvedBy, approvedDate
                                        , newReason, callBackCode, remarksRating, curUserName, fareDailyAllowance, lockcheck);
                    }

                    if (isTrue && parameterDetails != "")
                    {
                        MVCModels.DCRRatingParameter lstDetails;
                        foreach (var rating in ratingParametetable)
                        {
                            lstDetails = new MVCModels.DCRRatingParameter();
                            lstDetails.Company_Code = companyCode;
                            lstDetails.DCR_Code = dcrCode;
                            lstDetails.Parameter_Code = rating.Split('|')[0];
                            lstDetails.Rating_Value = rating.Split('|')[1];
                            lstDetails.Remarks = rating.Split('|')[2];
                            lstDetails.DCR_Flag = flag;
                            lstRatingDetail.Add(lstDetails);
                        }
                        isTrue = _objApproval.InsertRatingParameret(companyCode, dcrCode, flag, lstRatingDetail);
                    }
                }
                int result_History = _objApproval.InsertDcrHistory(companyCode, dcrCode, flag);
            }

            if (isTrue && dcrStatus == "2")
            {
                result = "Approve Successful";
            }
            else if (isTrue && dcrStatus == "0")
            {
                result = "Unapprove Successful";
            }
            else
            {
                result = "Insertion Failed ;" + result;
            }

            return result;
        }


        public string CheckExpenseClaim(string companyCode, string userCode, string dcrDetails, string dcrStatus)
        {
            dcrDetails = dcrDetails.TrimEnd('$');
            string[] dcrData = dcrDetails.Split('$');
            string dcrCode = string.Empty;
            string flag = string.Empty;
            string dcrDate = string.Empty;
            int expenseCount = 0;
            int finalcount = 0;
            string claimDates = string.Empty;
            foreach (string dcrValues in dcrData)
            {
                dcrCode = dcrValues.Split('|')[0];
                flag = dcrValues.Split('|')[1];
                flag = ((flag == "Field") ? "F" : ((flag == "Leave") ? "L" : "A"));
                dcrDate = dcrValues.Split('|')[5];
                string validdcrDate = dcrDate.Split('/')[2] + "-" + dcrDate.Split('/')[1] + "-" + dcrDate.Split('/')[0];
                expenseCount = _objApproval.CheckExpenseClaim(companyCode, userCode, dcrCode, flag, validdcrDate);
                if (expenseCount > 0)
                {
                    claimDates += dcrDate + ",";
                }
                // finalcount = finalcount + expenseCount;
            }

            return claimDates;
        }

        private bool UpdateDCRStatus(string companyCode, string userCode, string flag, string dcrCode, string dcrDate, string dcrStatus, string dcrStatusOld, string approvedBy, string approvedDate
                                    , string newReason, string callBackCode, string remarksRating, string curUserName, string fareDailyAllowance, string lockdetails)
        {
            bool isTrue = false;
            int rowsAffedted = 0;
            int rowsAffectedForEntity = 0;
            int expenseRowCount = 0;

            rowsAffectedForEntity = _objApproval.UpdateDCREntityCount(companyCode, userCode, dcrStatus);

            // This method redirect to DAL cs
            rowsAffedted = _objApproval.UpdateDCRStatus(companyCode, flag, dcrCode, dcrStatus, curUserName, approvedDate
                                    , newReason, callBackCode, remarksRating);


            if (flag.ToUpper() != "L" && dcrStatus == "0")
            {
                expenseRowCount = _objApproval.DeleteDCRExpense(flag, dcrCode, fareDailyAllowance);
            }
            if (rowsAffedted > 0)
            {
                if (dcrStatus == "0")
                {
                    //update activity Count               
                    rowsAffedted = _objApproval.UpdateActivityCountAndUserLeaveBalance(companyCode, userCode, dcrDate, dcrCode, flag, dcrStatus);

                    // Activity Lock
                    if (rowsAffedted > 0)
                    {
                        isTrue = true;
                        BLMaster objMast = new BLMaster();
                        string activityLock = objMast.GetPrivilegeValue(companyCode, userCode, "DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK");
                        activityLock = ((activityLock == "") ? "DISABLED" : activityLock);
                        if (activityLock == "ENABLED")
                        {
                            if (lockdetails == "0")
                            {
                                dcrDate = dcrDate.Split('/')[2] + "-" + dcrDate.Split('/')[1] + "-" + dcrDate.Split('/')[0];


                                // Lock screen
                                rowsAffedted = _objApproval.InsertUnapproveLock(companyCode, userCode, dcrDate, DateTime.Now.ToShortDateString(), flag);

                            }
                        }
                        else
                        {
                            isTrue = true;
                        }
                    }
                    else
                    {
                        isTrue = true;
                    }
                }
                else
                {
                    isTrue = true;
                }
            }

            return isTrue;
        }
        // CP Approval


        public DataSet GetAppliedCPRegions(string companyCode, string regionCode)
        {

            DataSet ds = new DataSet();
            ds = _objApproval.GetAppliedCPRegions(companyCode, regionCode);
            return ds;
        }

        public IEnumerable<MVCModels.CampaignPlannerHeader> GetCPHeader(string companycode, string regioncode, string status)
        {
            return _objApproval.GetCPHeader(companycode, regioncode, status);
        }

        public string UpdateCPStatus(string companyCode, string regionCode, string cpDetails, string status, string selection, string approvedBy, string approvedDate)
        {
            //dcr code|flag|dcrStatus|oldreason|leavetypename|dcrDate|newreason$
            string sucessMsg = string.Empty;
            cpDetails = cpDetails.TrimEnd('$');
            string[] CPData = cpDetails.Split('$');
            string cpCode = string.Empty;
            string cpStatus = string.Empty;
            string categoryName = string.Empty;
            string remarks = string.Empty;
            int intSuccessCount = 0;
            int intFailureCount = 0;
            bool blStatus;
            foreach (string cpValues in CPData)
            {
                cpCode = cpValues.Split('|')[0];
                categoryName = cpValues.Split('|')[1];
                remarks = cpValues.Split('|')[4];

                if (status == "1")
                {
                    blStatus = _objApproval.UpdateCPStatus(companyCode, regionCode, cpCode, status, "", approvedBy, approvedDate);
                    if (blStatus)
                    {
                        intSuccessCount++;
                    }
                    else
                    {
                        intFailureCount++;
                    }

                }
                else
                {
                    blStatus = _objApproval.UpdateCPStatus(companyCode, regionCode, cpCode, status, remarks, approvedBy, approvedDate);
                    if (blStatus)
                    {
                        intSuccessCount++;
                    }
                    else
                    {
                        intFailureCount++;
                    }

                }

                ////Insert Cp History           

                var cpHistoryCode = cpValues.Split('|')[0];
                var HistorycategoryName = cpValues.Split('|')[1];
                var Historyremarks = cpValues.Split('|')[4];
                int cpHistoryresult = _objApproval.InsertCpHistory(companyCode, regionCode, cpHistoryCode, HistorycategoryName);

            }

            if (status == "1" && selection.ToUpper() == "MULTI")
            {
                sucessMsg = "Approved CP : " + intSuccessCount + " ;\n Unable to Approve : " + intFailureCount;
            }
            else if (status == "0" && selection.ToUpper() == "MULTI")
            {
                sucessMsg = "Unapproved CP : " + intSuccessCount;
            }
            else if (status == "1" && selection.ToUpper() == "SINGLE")
            {
                sucessMsg = "Approval Success";
            }
            else
            {
                sucessMsg = "Unapproval Success";
            }

            return sucessMsg;
        }
        public IEnumerable<MVCModels.CampaignPlannerDetails> GetCPDoctors(string companycode, string cpCode, string regionCode)
        {
            return _objApproval.GetCPDoctors(companycode, cpCode, regionCode);
        }
        public IEnumerable<MVCModels.CampaignPlannerSFC> GetCPSFCDetails(string companycode, string cpCode, string regionCode)
        {
            return _objApproval.GetCPSFCDetails(companycode, cpCode, regionCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetDCRUserCount(string companyCode, string userCode, string flag, string dcrStatus, string month, string year, string selection, string divisionCodes)
        {
            return _objApproval.GetDCRUserCount(companyCode, userCode, flag, dcrStatus, month, year, selection, divisionCodes);
        }

        public IEnumerable<MVCModels.EmployeeDetailModel> GetSecondarySalesHeader(string companycode, string regionCode, string status, string month, string year)
        {
            return _objApproval.GetSecondarySalesHeader(companycode, regionCode, status, month, year);
        }
        public IEnumerable<MVCModels.EmployeeDetailModel> GetSecondarySalesDetails(string companycode, string regionCode, string status, string month, string year)
        {
            return _objApproval.GetSecondarySalesDetails(companycode, regionCode, status, month, year);
        }
        public List<MVCModels.SecondarySalesApprovalModel> GetSecondarySalesApprovalTwo(string companycode, string regionCode, string status, string month, string year, string ss_Code)
        {
            return _objApproval.GetSecondarySalesApprovalTwo(companycode, regionCode, status, month, year, ss_Code);
        }
        public IEnumerable<MVCModels.EmployeeDetailModel> GetWideAngleHeader(string companycode, string userCode, string status, string month, string year)
        {
            return _objApproval.GetWideAngleHeader(companycode, userCode, status, month, year);
        }

        // Wide  Angle Approval


        public string UpdateWideAngleStatus(string companyCode, string details, string status, string releasedBy, string releasedDate)
        {

            string result = "";
            details = details.TrimEnd('$');
            string[] ssData = details.Split('$');
            string userCode = string.Empty;
            string requestId = string.Empty;
            string approvedDateFrom = string.Empty;
            string approvedDateTo = string.Empty;
            string remarks = string.Empty;
            BLMaster objMast = new BLMaster();

            //   List<MVCModels.EmployeeDetailModel> lstRatingDetail = new List<MVCModels.EmployeeDetailModel>();
            bool isTrue = false;
            DateTime previousMonth = DateTime.Now.AddMonths(-1);
            foreach (string ssValues in ssData)
            {
                //empInfo.User_Code + "|" + empInfo.Request_Id + "|" + status + "|" + empInfo.Region_Code + "|" + empInfo.Date_From + "|" + empInfo.Date_To

                userCode = ssValues.Split('|')[0];
                requestId = ssValues.Split('|')[1];
                approvedDateFrom = ssValues.Split('|')[4];
                approvedDateTo = ssValues.Split('|')[5];
                remarks = ssValues.Split('|')[6];
                approvedDateFrom = approvedDateFrom.Split('/')[2] + "-" + approvedDateFrom.Split('/')[1] + "-" + approvedDateFrom.Split('/')[0];
                approvedDateTo = approvedDateTo.Split('/')[2] + "-" + approvedDateTo.Split('/')[1] + "-" + approvedDateTo.Split('/')[0];
                isTrue = _objApproval.UpdateWideAngleStatus(companyCode, status, userCode, requestId, releasedBy, releasedDate, approvedDateFrom, approvedDateTo, remarks);

            }

            if (isTrue && status == "2")
            {
                result = "Approve Successful";
            }
            else if (isTrue && status == "3")
            {
                result = "Unapprove Successful";
            }
            else
            {
                result = "Insertion Failed ;" + result;
            }

            return result;
        }

        public IEnumerable<MVCModels.EmployeeDetailModel> GetWideAngleApprovalTwo(string companycode, string userCode, string requestid)
        {
            return _objApproval.GetWideAngleDetails(companycode, userCode, requestid);
        }

        #region CpHistory
        /// <summary>
        /// Get Cp History Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="cpCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.CampaignPlannerHistoryModel> GetCpHistoryDetails(string companyCode, string cpCode, string regionCode)
        {
            try
            {
                return _objApproval.GetCpHistoryDetails(companyCode, cpCode, regionCode);
            }
            catch
            {
                throw;
            }
        }
        #endregion CpHistory

        public int InsertTPHistory(string companyCode, int tpId)
        {
            return _objApproval.InsertTPHistory(companyCode, tpId);
        }

        public DataSet GetTPStatusChange(string companyCode, int tpId, string Status, string remarks, string userCode, string userName)
        {
            return _objApproval.GetTPStatusChange(companyCode, tpId, Status, remarks, userCode, userName);
        }

        public int GetTPStatusApprovalLockRelease(string companyCode, int tpId, string releaseedBy)
        {
            return _objApproval.GetTPStatusApprovalLockRelease(companyCode, tpId, releaseedBy);
        }

        public DataSet GetTPHistory(string companyCode, string UserCode, string TP_Date)
        {
            return _objApproval.GetTPHistory(companyCode, UserCode, TP_Date);
        }

        #region DCRHistory
        /// <summary>
        /// Insert DCR History
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="DCRCode"></param>
        /// <returns></returns>
        public int InsertDcrHistory(string companyCode, string DCRCode, string flag)
        {
            return _objApproval.InsertDcrHistory(companyCode, DCRCode, flag);
        }
        /// <summary>
        /// Get DCR History Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="dcrCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<MVCModels.DCRHeaderHistoryModel> GetDCRHistoryDetails(string companyCode, string dcrCode, string userCode)
        {
            return _objApproval.GetDCRHistoryDetails(companyCode, dcrCode, userCode);
        }
        #endregion DCRHistory


        #region - TP Approval
        /// <summary>
        /// Get TP users count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="flag"></param>
        /// <param name="tpStatus"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="selection"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetTPUsersCount(string companyCode, string userCode, string tpStatus, string month, string year, string selection, string divisionCodes)
        {
            return _objApproval.GetTPUsersCount(companyCode, userCode, tpStatus, month, year, selection, divisionCodes);
        }

        #endregion - TP Approval

        #region - TP in DCR
        /// <summary>
        /// Get Tp details in DCR Approval
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="tpID"></param>
        /// <returns></returns>
        public List<DCRTPDetailsModel> GetDCRTpdeails(string companyCode, int tpID)
        {
            _objApproval = new DALApproval();
            return _objApproval.GetDCRTpdeails(companyCode, tpID);
        }
        #endregion - TP in DCR

        #region DCR Freeze Screen

        public IEnumerable<MVCModels.DCRFreezeUsersModel> GetDcrFreezeReleaseUsers(DCRFreezeInputs objInputs)
        {
            return _objApproval.GetDcrFreezeReleaseUsers(objInputs);
        }

        public IEnumerable<MVCModels.DCRUNFreezeModel> GetDcrFreezeReleaseApproval(DCRFreezeInputs objInputs)
        {
            return _objApproval.GetDcrFreezeReleaseApproval(objInputs);
        }
        public IEnumerable<MVCModels.DCRUNFreezeModel> GetDcrFreezeReleasedApprovalData(DCRFreezeInputs objInputs)
        {
            return _objApproval.GetDcrFreezeReleasedApprovalData(objInputs);
        }
        public string SetDCRFreezeReleaseApproval(List<DCRUNFreezeModel> lstDCRFreezeModel)
        {
            CurrentInfo _objCur = new CurrentInfo();
            string companyCode = _objCur.GetCompanyCode();
            string companyid = _objCur.GetCompanyId();
            int Company_id = Int32.Parse(companyid);
            string usercode = _objCur.GetUserCode();
            lstDCRFreezeModel.ForEach(x => { x.Company_Code = companyCode; x.created_by = usercode; x.Company_Id = Company_id; });
            return _objApproval.SetDCRFreezeReleaseApproval(lstDCRFreezeModel);
        }
        #endregion


        #region SS_Approval



        #endregion SS_Approval


        /************************************************* Secondary Sales Entry Screen Methods**************************************/
        #region SS_Entry_Screen_Main

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.SSUserListModel> GetUsersByRegion(string companyCode, string regionCode)
        {
            return _objApproval.GetUsersByRegion(companyCode, regionCode);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<MVCModels.StockiestData> GetSSStockistBasedOnInput(string companyCode, string regionCode, int month, int year)
        {
            return _objApproval.GetSSStockistBasedOnInput(companyCode, regionCode, month, year);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<PreviousSSDetailsModel> GetSSDetailsForSelectedRegion(string companyCode, string regionCode, int month, int year)
        {
            return _objApproval.GetSSDetailsForSelectedRegion(companyCode, regionCode, month, year);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="RegionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="statementDate"></param>
        /// <param name="ssCode"></param>
        /// <returns></returns>
        public List<MVCModels.SS_ProductsDetailedView> GetSSDetailsForSelectedRecord(string companyCode, string RegionCode, string month, string year, string statementDate, string ssCode)
        {
            return _objApproval.GetSSDetailsForSelectedRecord(companyCode, RegionCode, month, year, statementDate, ssCode);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="prevmonth"></param>
        /// <param name="prevyear"></param>
        /// <param name="datebymonth"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public PriceGroupMain GetPriceforSecondarySales(string companyCode, string customerCode, string regionCode, string prevmonth, string prevyear, string datebymonth, string month, string year)
        {
            return _objApproval.GetPriceforSecondarySales(companyCode, customerCode, regionCode, prevmonth, prevyear, datebymonth, month, year);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="customerCode"></param>
        /// <returns></returns>
        public SSProdPriceModelMain GetProductsBasedonStockist(string companyCode, string regionCode, string customerCode)//,int month,int year)
        {
            return _objApproval.GetProductsBasedonStockist(companyCode, regionCode, customerCode);//,month,year);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="customerCode"></param>
        /// <returns></returns>
        public List<DynamicColumnsInfo> GetCountofSSFortheSelectedStockiest(string companyCode, string customerCode)
        {
            return _objApproval.GetCountofSSFortheSelectedStockiest(companyCode, customerCode);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<DynamicColumnsSS> GetDynamicColumnsForSS(string companyCode, int month, int year)
        {
            return _objApproval.GetDynamicColumnsForSS(companyCode, month, year);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="ssdetailCode"></param>
        /// <returns></returns>
        public List<DynamicColumnsInfo> GetDynamicColumnsInfo(string companyCode, int ssdetailCode)
        {
            return _objApproval.GetDynamicColumnsInfo(companyCode, ssdetailCode);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <returns></returns>
        public string InsertSecondarySalesDraft(string companyCode, string createdBy, SSMainModel ObjSSDetails)
        {
            string result = null;
            DataTable dsProd = null;
            try
            {
                if (ObjSSDetails.LstProdDet.Count > 0)
                {
                    dsProd = new DataTable();
                    dsProd.Columns.Add("Id", typeof(int));
                    dsProd.Columns.Add("Company_Code", typeof(string));
                    dsProd.Columns.Add("Region_Code", typeof(string));
                    dsProd.Columns.Add("User_Code", typeof(string));
                    dsProd.Columns.Add("Division_Code", typeof(string));
                    dsProd.Columns.Add("Product_Code", typeof(string));
                    dsProd.Columns.Add("Unit_Price", typeof(float));
                    dsProd.Columns.Add("Opening_Balance", typeof(float));
                    dsProd.Columns.Add("Purchase", typeof(float));
                    dsProd.Columns.Add("Purchase_Return", typeof(float));
                    dsProd.Columns.Add("Sales", typeof(float));
                    dsProd.Columns.Add("Sales_Return", typeof(float));
                    dsProd.Columns.Add("Free_Goods", typeof(float));
                    dsProd.Columns.Add("Transit", typeof(float));
                    dsProd.Columns.Add("Expired_Goods", typeof(float));
                    dsProd.Columns.Add("Damaged_Goods", typeof(float));
                    dsProd.Columns.Add("Closing_Balance", typeof(float));
                    dsProd.Columns.Add("Remarks", typeof(string));
                    dsProd.Columns.Add("Created_By", typeof(string));
                    dsProd.Columns.Add("Row_Exists_Flag", typeof(int));
                    int idno = 0;
                    for (int i = 0; i < ObjSSDetails.LstProdDet.Count; i++)
                    {
                        idno++;
                        dsProd.Rows.Add(idno, companyCode, ObjSSDetails.Region_Code, ObjSSDetails.User_Code, ObjSSDetails.LstProdDet[i].Division_Code, ObjSSDetails.LstProdDet[i].Product_Code,
                            ObjSSDetails.LstProdDet[i].Unit_Price_Rate, ObjSSDetails.LstProdDet[i].Opening_Balance, ObjSSDetails.LstProdDet[i].Purchase, ObjSSDetails.LstProdDet[i].Purchase_Return,
                            ObjSSDetails.LstProdDet[i].Sales, ObjSSDetails.LstProdDet[i].Sales_Return, ObjSSDetails.LstProdDet[i].Free_Goods, ObjSSDetails.LstProdDet[i].Transit,
                            ObjSSDetails.LstProdDet[i].Expired_Goods, ObjSSDetails.LstProdDet[i].Damaged_Goods, ObjSSDetails.LstProdDet[i].Closing_Balance, ObjSSDetails.LstProdDet[i].Remarks,
                            createdBy, ObjSSDetails.LstProdDet[i].Row_Exists_Flag);
                    }
                }
                DataTable dsDynaDet = new DataTable();
                if (ObjSSDetails.LstDynaDet != null)
                {
                    dsDynaDet.Columns.Add("Id", typeof(int));
                    dsDynaDet.Columns.Add("Company_Code", typeof(string));
                    dsDynaDet.Columns.Add("Product_Code", typeof(string));
                    dsDynaDet.Columns.Add("Input_Id", typeof(int));
                    dsDynaDet.Columns.Add("Input_Value", typeof(string));
                    dsDynaDet.Columns.Add("Created_By", typeof(string));
                    dsDynaDet.Columns.Add("Row_Dynamic_Exists_Flag", typeof(int));
                    int idno = 0;
                    for (int i = 0; i < ObjSSDetails.LstDynaDet.Count; i++)
                    {
                        idno++;
                        dsDynaDet.Rows.Add(idno, companyCode, ObjSSDetails.LstDynaDet[i].Product_Code, ObjSSDetails.LstDynaDet[i].Input_DynamicId, ObjSSDetails.LstDynaDet[i].Input_Value, createdBy, ObjSSDetails.LstDynaDet[i].Row_Dynamic_Exists_Flag);
                    }
                }
                if (ObjSSDetails.SS_Status == null)
                {
                    result = _objApproval.InsertSecondarySalesDraft(companyCode, createdBy, ObjSSDetails, dsProd, dsDynaDet);
                }
                else
                {
                    result = _objApproval.UpdateSecondarySalesDraft(companyCode, createdBy, ObjSSDetails, dsProd, dsDynaDet);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <returns></returns>
        public string InsertSecondarySalesSubmit(string companyCode, string createdBy, SSMainModel ObjSSDetails)
        {
            string result = null;
            DataTable dsProd = null;
            try
            {
                if (ObjSSDetails.LstProdDet.Count > 0)
                {
                    dsProd = new DataTable();
                    dsProd.Columns.Add("Id", typeof(int));
                    dsProd.Columns.Add("Company_Code", typeof(string));
                    dsProd.Columns.Add("Region_Code", typeof(string));
                    dsProd.Columns.Add("User_Code", typeof(string));
                    dsProd.Columns.Add("Division_Code", typeof(string));
                    dsProd.Columns.Add("Product_Code", typeof(string));
                    dsProd.Columns.Add("Unit_Price", typeof(float));
                    dsProd.Columns.Add("Opening_Balance", typeof(float));
                    dsProd.Columns.Add("Purchase", typeof(float));
                    dsProd.Columns.Add("Purchase_Return", typeof(float));
                    dsProd.Columns.Add("Sales", typeof(float));
                    dsProd.Columns.Add("Sales_Return", typeof(float));
                    dsProd.Columns.Add("Free_Goods", typeof(float));
                    dsProd.Columns.Add("Transit", typeof(float));
                    dsProd.Columns.Add("Expired_Goods", typeof(float));
                    dsProd.Columns.Add("Damaged_Goods", typeof(float));
                    dsProd.Columns.Add("Closing_Balance", typeof(float));
                    dsProd.Columns.Add("Remarks", typeof(string));
                    dsProd.Columns.Add("Created_By", typeof(string));
                    dsProd.Columns.Add("Row_Exists_Flag", typeof(int));
                    int idno = 0;
                    for (int i = 0; i < ObjSSDetails.LstProdDet.Count; i++)
                    {
                        idno++;
                        dsProd.Rows.Add(idno, companyCode, ObjSSDetails.Region_Code, ObjSSDetails.User_Code, ObjSSDetails.LstProdDet[i].Division_Code, ObjSSDetails.LstProdDet[i].Product_Code,
                            ObjSSDetails.LstProdDet[i].Unit_Price_Rate, ObjSSDetails.LstProdDet[i].Opening_Balance, ObjSSDetails.LstProdDet[i].Purchase, ObjSSDetails.LstProdDet[i].Purchase_Return,
                            ObjSSDetails.LstProdDet[i].Sales, ObjSSDetails.LstProdDet[i].Sales_Return, ObjSSDetails.LstProdDet[i].Free_Goods, ObjSSDetails.LstProdDet[i].Transit,
                            ObjSSDetails.LstProdDet[i].Expired_Goods, ObjSSDetails.LstProdDet[i].Damaged_Goods, ObjSSDetails.LstProdDet[i].Closing_Balance, ObjSSDetails.LstProdDet[i].Remarks,
                            createdBy, ObjSSDetails.LstProdDet[i].Row_Exists_Flag);
                    }
                }
                DataTable dsDynaDet = new DataTable();
                if (ObjSSDetails.LstDynaDet != null)
                {

                    dsDynaDet.Columns.Add("Id", typeof(int));
                    dsDynaDet.Columns.Add("Company_Code", typeof(string));
                    dsDynaDet.Columns.Add("Product_Code", typeof(string));
                    dsDynaDet.Columns.Add("Input_Id", typeof(int));
                    dsDynaDet.Columns.Add("Input_Value", typeof(string));
                    dsDynaDet.Columns.Add("Created_By", typeof(string));
                    dsDynaDet.Columns.Add("Row_Dynamic_Exists_Flag", typeof(int));
                    int idno = 0;
                    for (int i = 0; i < ObjSSDetails.LstDynaDet.Count; i++)
                    {
                        idno++;
                        dsDynaDet.Rows.Add(idno, companyCode, ObjSSDetails.LstDynaDet[i].Product_Code, ObjSSDetails.LstDynaDet[i].Input_DynamicId, ObjSSDetails.LstDynaDet[i].Input_Value, createdBy, ObjSSDetails.LstDynaDet[i].Row_Dynamic_Exists_Flag);
                    }
                }
                if (ObjSSDetails.SS_Status == null)
                {
                    result = _objApproval.InsertSecondarySalesSubmit(companyCode, createdBy, ObjSSDetails, dsProd, dsDynaDet);
                }
                else
                {
                    result = _objApproval.UpdateSecondarySalesSubmit(companyCode, createdBy, ObjSSDetails, dsProd, dsDynaDet);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="ssCode"></param>
        /// <param name="ssStatementDate"></param>
        /// <returns></returns>
        public SSDetailsMainEdit GetSecondarySalesEditDetails(string companyCode, string createdBy, string regionCode, int month, int year, string ssCode, string ssStatementDate)
        {
            SSDetailsMainEdit ObjSSEdit = null;
            try
            {
                ObjSSEdit = _objApproval.GetSecondarySalesEditDetails(companyCode, regionCode, month, year, ssCode, ssStatementDate, createdBy);
            }
            catch (Exception ex)
            {

                throw;
            }
            return ObjSSEdit;
        }


        //Method Not Used
        public List<SSUserListModel> GetPrivilegesBasedOnSelection(string companyCode, string regionCode, string userCode, string usertypeCode)
        {
            return _objApproval.GetPrivilegesBasedOnSelection(companyCode, regionCode, userCode, usertypeCode);
        }
        #endregion
        /****************************************************************************************************************************/

        /************************************************* Secondary Sales Delete Screen Methods*************************************/

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="IncludeClosedStockiest"></param>
        /// <returns></returns>
        public List<MVCModels.StockiestData> GetSSStockiestDetails(string companyCode, string regionCode, int IncludeClosedStockiest, int month, int year)
        {
            return _objApproval.GetSSStockiestDetails(companyCode, regionCode, IncludeClosedStockiest, month, year);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="stockiestCode"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public List<MVCModels.StockiestEntryDetailsDelete> GetListSecondarySalesForDelete(string companyCode, string regionCode, string stockiestCode, string mode)
        {
            return _objApproval.GetListSecondarySalesForDelete(companyCode, regionCode, stockiestCode, mode);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="companycode"></param>
        /// <param name="userCode"></param>
        /// <param name="status"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>

        public bool DeleteSecondarysales(string companyCode, List<SSMainModelforEdit> lstDelete, int status, string updatedBy)
        {
            bool result = false;
            BLMaster objMast = new BLMaster();
            DataTable dtDele = null;
            if (lstDelete.Count > 0)
            {

                dtDele = new DataTable();
                dtDele.Columns.Add("Company_Code", typeof(string));
                dtDele.Columns.Add("Region_Code", typeof(string));
                dtDele.Columns.Add("SS_Code", typeof(string));
                dtDele.Columns.Add("Base_Code", typeof(string));
                dtDele.Columns.Add("Month", typeof(int));
                dtDele.Columns.Add("Year", typeof(int));
                dtDele.Columns.Add("SS_Status", typeof(int));
                dtDele.Columns.Add("Remarks", typeof(string));
                dtDele.Columns.Add("Updated_By", typeof(string));
                for (int i = 0; i < lstDelete.Count; i++)
                {
                    dtDele.Rows.Add(companyCode, lstDelete[i].Region_Code, lstDelete[i].SS_Code, lstDelete[i].Base_Code, lstDelete[i].Month, lstDelete[i].Year, status, lstDelete[i].Remarks, updatedBy);
                }

            }
            if (status == 0)
            {
                result = _objApproval.UnapprovedSecondarySale(companyCode, lstDelete, dtDele, updatedBy, status);
                for (int i = 0; i < lstDelete.Count; i++)
                {
                    string mode = "UNAPPROVED";
                    string resultstring = _objSPData.UpdateSSDCRLock(companyCode, lstDelete[i].Region_Code, lstDelete[i].Month.ToString(), lstDelete[i].Year.ToString(), lstDelete[i].Base_Code, "", mode);
                    int updateLockStatusForManager = _objApproval.UpdateSSPendingApprovalLock(companyCode, lstDelete[i].Region_Code, lstDelete[i].Month.ToString(), lstDelete[i].Year.ToString());
                }
            }
            else
            {
                result = _objApproval.DeletedsecondarySale(companyCode, lstDelete, dtDele, updatedBy, status);
                for (int i = 0; i < lstDelete.Count; i++)
                {
                    string mode = "UNAPPROVED";
                    string resultstring = _objSPData.UpdateSSDCRLock(companyCode, lstDelete[i].Region_Code, lstDelete[i].Month.ToString(), lstDelete[i].Year.ToString(), lstDelete[i].Base_Code, "", mode);
                    int updateLockStatusForManager = _objApproval.UpdateSSPendingApprovalLock(companyCode, lstDelete[i].Region_Code, lstDelete[i].Month.ToString(), lstDelete[i].Year.ToString());
                }

            }

            return result;
        }

        /****************************************************************************************************************************/

        /************************************************* Secondary Sales Approval Screen Methods************************************/
        /// <summary>
        /// to get the regions with user details.
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="status"></param>
        /// <param name="regionSelection"></param>
        /// <param name="customerType"></param>
        /// <returns></returns>
        public List<GetSSRegion> GetRegionsWithUserDetails(string companyCode, string regionCode, int month, int year, int status, string regionSelection, string customerType)
        {
            return _objApproval.GetRegionsWithUserDetails(companyCode, regionCode, month, year, status, regionSelection, customerType);
        }

        //public List<GetSSRegion> GetUserinaRegion(string companyCode,string regionCode)
        //{
        //    return _objApproval.GetUserinaRegion(companyCode, regionCode);
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        /// 
        public List<TotalSSDetails> GetTotalSSDetailsForMonth(string companyCode, string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            return _objApproval.GetTotalSSDetailsForMonth(companyCode, regionCode, month, year, status, Mode, selectionOrLoad);
        }

        public List<SecondarySalesApprovalHeaderModel> GetSSDetailsForAMonth(string companyCode, string regionCode, int month, int year, int status, string Currentregcode)
        {
            return _objApproval.GetSSDetailsForAMonth(companyCode, regionCode, month, year, status, Currentregcode);
        }

        public List<SecondarySalesDetailsView> GetSSDetailsView(string companyCode, string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            return _objApproval.GetSSDetailsView(companyCode, regionCode, month, year, status, Mode, selectionOrLoad);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="details"></param>
        /// <param name="status"></param>
        /// <param name="approvedBy"></param>
        /// <param name="approvedDate"></param>
        /// <param name="currentStatus"></param>
        /// <param name="currentUserName"></param>
        /// <returns></returns>
        public bool UpdateSecondarySalesStatus(string companyCode, List<SSMainModelforEdit> lstApprvDet, int status, string updatedBy)
        {
            bool isTrue = false;
            bool result = false;
            //string result = "";
            //details = details.TrimEnd('$');
            //string[] ssData = details.Split('$');
            //string ssCode = string.Empty;
            //string regionCode = string.Empty;
            //string remarks = string.Empty;
            //string newReason = string.Empty;
            //string oldReason = string.Empty;
            //string customerCode = string.Empty;
            //string month = string.Empty;
            //string year = string.Empty;
            //string userCode = string.Empty;
            BLMaster objMast = new BLMaster();

            DataTable dtDele = null;
            if (lstApprvDet.Count > 0)
            {

                dtDele = new DataTable();
                dtDele.Columns.Add("Company_Code", typeof(string));
                dtDele.Columns.Add("Region_Code", typeof(string));
                dtDele.Columns.Add("SS_Code", typeof(string));
                dtDele.Columns.Add("Base_Code", typeof(string));
                dtDele.Columns.Add("Month", typeof(int));
                dtDele.Columns.Add("Year", typeof(int));
                dtDele.Columns.Add("SS_Status", typeof(int));
                dtDele.Columns.Add("Remarks", typeof(string));
                dtDele.Columns.Add("Updated_By", typeof(string));
                for (int i = 0; i < lstApprvDet.Count; i++)
                {
                    dtDele.Rows.Add(companyCode, lstApprvDet[i].Region_Code, lstApprvDet[i].SS_Code, lstApprvDet[i].Base_Code, lstApprvDet[i].Month, lstApprvDet[i].Year, status, lstApprvDet[i].Remarks, updatedBy);
                }

            }
            if (status == 0)
            {
                result = _objApproval.UpdateSecondarySalesStatus(companyCode, lstApprvDet, dtDele, updatedBy, status);
                for (int i = 0; i < lstApprvDet.Count; i++)
                {
                    string mode = "UNAPPROVED";
                    string resultstring = _objSPData.UpdateSSDCRLock(companyCode, lstApprvDet[i].Region_Code, lstApprvDet[i].Month.ToString(), lstApprvDet[i].Year.ToString(), lstApprvDet[i].Base_Code, "", mode);
                    int updateLockStatusForManager = _objApproval.UpdateSSPendingApprovalLock(companyCode, lstApprvDet[i].Region_Code, lstApprvDet[i].Month.ToString(), lstApprvDet[i].Year.ToString());
                }
            }

            else
            {
                result = _objApproval.UpdateUnapprovedStatusSecondarySales(companyCode, lstApprvDet, dtDele, updatedBy, status);
                if (result)
                {
                    int SS_Code = 0;
                    for (int i = 0; i < lstApprvDet.Count; i++)
                    {
                        Int32.TryParse(lstApprvDet[i].SS_Code, out SS_Code);
                        result = _objApproval.CascadeSecondarySalesDetails(companyCode, SS_Code, lstApprvDet[i].Base_Code);
                    }
                }
                for (int i = 0; i < lstApprvDet.Count; i++)
                {
                    //string resultstring = _objSPData.UpdateSSDCRLock(companyCode, lstApprvDet[i].Region_Code, lstApprvDet[i].Month.ToString(), lstApprvDet[i].Year.ToString(), lstApprvDet[i].Base_Code, "");
                    int updateLockStatusForManager = _objApproval.UpdateSSPendingApprovalLock(companyCode, lstApprvDet[i].Region_Code, lstApprvDet[i].Month.ToString(), lstApprvDet[i].Year.ToString());
                }

            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="ssCode"></param>
        /// <returns></returns>
        public List<SSRemarksModel> GetSSRemarksHistory(string companyCode, string regionCode, string ssCode)
        {
            return _objApproval.GetSSRemarksHistory(companyCode, regionCode, ssCode);
        }
        public bool SingleApproveorUnapprove(string companyCode, string regionCode, string status, string ssCode, string baseCode, string updatedBy, string remarks)
        {
            return _objApproval.SingleApproveorUnapprove(companyCode, regionCode, status, ssCode, baseCode, updatedBy, remarks);
        }
        public bool UpdateSSStatusFromUnApproval(string regionCode, string ssCode)
        {
            return _objApproval.UpdateSSStatusFromUnApproval(regionCode, ssCode);
        }
        /****************************************************************************************************************************/

        /// <summary>
        /// gets whether leave policy privilege is mapped for the selected user or not
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>YES or NO</returns>
        public string GetLeavePrivilege(string companyCode, string userCode)
        {
            return _objApproval.GetLeavePrivilege(companyCode, userCode);
        }

        public List<DashBoardLanding.LockDetails> GetLockDetails(string companyCode, string userCode)
        {
            return _objApproval.GetLockDetails(companyCode, userCode);
        }
    }
}
