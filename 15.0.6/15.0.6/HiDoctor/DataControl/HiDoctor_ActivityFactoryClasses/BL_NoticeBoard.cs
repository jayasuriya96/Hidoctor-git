using System;
using System.Data;
using MVCModels;
using System.Collections.Generic;
using System.Text;
using System.Reflection;
using System.Linq;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_NoticeBoard
    {
        DAL_NoticeBoard _objDALNoticeBoard = new DAL_NoticeBoard();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        const string NOTICE_BOARD_ACCESS = "NOTICE_BOARD_ACCESS";
        const string NEW = "NEW";
        const string SUCCESS = "SUCCESS";
        const string ERROR = "ERROR";
        const string BLOB_URL = "http://nbfiles.blob.core.windows.net/";

        DataSet dsRegionType = new DataSet();
        DataSet dsUserType = new DataSet();
        DataRow[] userTypeFilter;

        private int userTypeLevelNo = 0;

        public int GetNoticeBoardAttachmentMaxSize()
        {
            try
            {
                int attachmentMaxSize;
                string companyCode = string.Empty;

                companyCode = _objCurrentInfo.GetCompanyCode();

                attachmentMaxSize = _objDALNoticeBoard.GetNoticeBoardAttachmentSize(companyCode);

                if (attachmentMaxSize == 0)
                {
                    attachmentMaxSize = 1; // Default value is 1
                }

                return attachmentMaxSize;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetDistributionTypes()
        {
            try
            {
                string nbAccessPrivilegeValue = string.Empty;
                string nbAccessDefaultValue = string.Empty;

                nbAccessDefaultValue = "ALL,SHOW_USERS,SHOW_REGIONS,MY_TEAM,GROUP";

                nbAccessPrivilegeValue = _objCurrentInfo.GetPrivilegeValue(NOTICE_BOARD_ACCESS, nbAccessDefaultValue);

                return nbAccessPrivilegeValue;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        public string GetGroupDetails()
        {
            DataSet ds = new DataSet();
            StringBuilder sbHtmlContent = new StringBuilder();
            string Group_All = "ALL";
            //ds = _objDALNoticeBoard.GetGroupDetails();

            CurrentInfo objCurInfo = new CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            List<MVCModels.HiDoctor_Master.GroupDetails> lstGroup = new List<MVCModels.HiDoctor_Master.GroupDetails>();
            DataControl.HD_MasterFactoryClasses.BL_SplashScreen _objBLSplashScreen = new DataControl.HD_MasterFactoryClasses.BL_SplashScreen();
            lstGroup = _objBLSplashScreen.GetGroupDetails(UserName).ToList();

            //sbHtmlContent.Append("&nbsp;<input type=\"radio\" onclick=\"userGroupcheckAll();\" id=\"chk_UG_ALL" + Group_All + "\" name=\"chck_UGALL\" value=\"" + Group_All + "\">");
            // sbHtmlContent.Append("&nbsp;<label for=\"chk_UGALL_" + Group_All + "\">" + Group_All + "</label>");


            foreach (var item in lstGroup)
            {
                sbHtmlContent.Append("&nbsp;<input type=\"radio\"  onclick='fnUserGroupChk(\"" + item.Group_ID + "\")' Class=\"clsCheckUserGroup\" id=\"chk_UG_" + item.Group_Name + "\" name=\"chck_UG\" value=\"" + item.Group_Name + "\">");
                sbHtmlContent.Append("&nbsp;<label for=\"chk_UG_" + item.Group_Name + "\">" + item.Group_Name + "</label>");
            }
            // foreach (DataRow dr in ds.Tables[0].Rows)
            // {
            //     sbHtmlContent.Append("&nbsp;<input type=\"checkbox\"  onclick='fnUserGroupChk(\"" + ds.Tables[0].Rows.Count + "\")' Class=\"clsCheckUserGroup\" id=\"chk_UG_" + dr["Group_Name"].ToString() + "\" name=\"chck_UG\" value=\"" + dr["Group_Name"].ToString() + "\">");
            //      sbHtmlContent.Append("&nbsp;<label for=\"chk_UG_" + dr["Group_Name"].ToString() + "\">" + dr["Group_Name"].ToString() + "</label>");
            // }
            return sbHtmlContent.ToString();
        }

        public string GetAllRegionTypes()
        {
            try
            {
                DataControl.DAL_Reports_CategoryWiseDrVisitAnalysis objDAL = new DataControl.DAL_Reports_CategoryWiseDrVisitAnalysis();
                DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();

                DataSet ds = new DataSet();
                StringBuilder sbHtmlContent = new StringBuilder();

                string companyCode = _objcurrentInfo.GetCompanyCode();
                string regionALL = "ALL";
                ds = objDAL.GetRegionTypes(companyCode);

                sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick=\"RegioncheckAll();\" id=\"chk_RT_ALL\" name=\"chck_RT\" value=\"" + regionALL + "\">");
                sbHtmlContent.Append("&nbsp;<label for=\"chk_RT_" + regionALL + "\">" + regionALL + "</label>");

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick='fnUserRegionChk(\"" + ds.Tables[0].Rows.Count + "\")' Class=\"clsCheckRegion\" id=\"chk_RT_" + dr["Region_Type_Name"].ToString() + "\" name=\"chck_RT\" value=\"" + dr["Region_Type_Name"].ToString() + "\">");
                    sbHtmlContent.Append("&nbsp;<label for=\"chk_RT_" + dr["Region_Type_Name"].ToString() + "\">" + dr["Region_Type_Name"].ToString() + "</label>");
                }

                return sbHtmlContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetAllUserTypes()
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                DataSet ds = new DataSet();
                StringBuilder sbHtmlContent = new StringBuilder();
                string user_All = "ALL";

                ds = _objDALNoticeBoard.GetUserTypeList(companyCode);

                sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick=\"userTypecheckAll();\" id=\"chk_UT_" + user_All + "\" name=\"chck_UTALL\" value=\"" + user_All + "\">");
                sbHtmlContent.Append("&nbsp;<label for=\"chk_UTALL_" + user_All + "\">" + user_All + "</label>");

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sbHtmlContent.Append("&nbsp;<input type=\"checkbox\"  onclick='fnUserTypeChk(\"" + ds.Tables[0].Rows.Count + "\")' Class=\"clsCheckUserType\" id=\"chk_UT_" + dr["User_Type_Name"].ToString() + "\" name=\"chck_UT\" value=\"" + dr["User_Type_Name"].ToString() + "\">");
                    sbHtmlContent.Append("&nbsp;<label for=\"chk_UT_" + dr["User_Type_Name"].ToString() + "\">" + dr["User_Type_Name"].ToString() + "</label>");
                }

                return sbHtmlContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }


        public string GetAllDivision()
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                DataSet ds = new DataSet();
                StringBuilder sbHtmlContent = new StringBuilder();
                string division_All = "ALL";



                ds = _objDALNoticeBoard.GetAllDivisionList(companyCode);

                sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick=\"checkAll();\" id=\"chk_DV_" + division_All + "\" name=\"chck_UT\" value=\"" + division_All + "\">");
                sbHtmlContent.Append("&nbsp;<label for=\"chk_DV_" + division_All + "\">" + division_All + "</label>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                    sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick='fnDivsingleChk(\"" + ds.Tables[0].Rows.Count + "\")' Class=\"clsCheck\" id=\"chk_DV_" + dr["Division_Name"].ToString() + "\" name=\"chck_DV\" value=\"" + dr["Division_Code"].ToString() + "\">");
                    sbHtmlContent.Append("&nbsp;<label for=\"chk_DV_" + dr["Division_Name"].ToString() + "\">" + dr["Division_Name"].ToString() + "</label>");
                }

                return sbHtmlContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }



        public string GetUserTypesUnderMe()
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string userCode = _objCurrentInfo.GetUserCode();

                dsUserType = _objDALNoticeBoard.GetUnderUserTypeList(companyCode, userCode);

                //DataRow[] rowFilter;

                // rowFilter = dsUserType.Tables[0].Select("User_Type_Code = Under_User_Type");

                //if (rowFilter.Length > 0)
                //{
                //    foreach (DataRow dr in rowFilter)
                //    {
                //        userTypeLevelNo = 1;

                //        dr["Level_No"] = userTypeLevelNo.ToString();

                //        dsUserType.Tables[0].AcceptChanges();
                //    }

                //    foreach (DataRow dr in rowFilter)
                //    {
                //        GenerateUserTypeLevel(dr["User_Type_Code"].ToString());
                //    }
                //}

                //DataSet ds = new DataSet();
                //string userTypeCode = string.Empty;

                //userTypeCode = _objCurrentInfo.GetUserTypeCode();

                //ds = dsUserType.Clone();

                //rowFilter = dsUserType.Tables[0].Select("User_Type_Code = '" + userTypeCode + "'");

                //if (rowFilter.Length > 0)
                //{
                //    userTypeLevelNo = Convert.ToInt16(rowFilter[0]["Level_No"].ToString());

                //    rowFilter = dsUserType.Tables[0].Select("Level_No >= '" + userTypeLevelNo + "'");

                //    foreach (DataRow dr in rowFilter)
                //    {
                //        ds.Tables[0].ImportRow(dr);
                //        ds.Tables[0].AcceptChanges();
                //    }
                //}

                StringBuilder sbHtmlContent = new StringBuilder();
                sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick=\"UnderuserTypecheckAll();\" id=\"Uchk_UT_ALL\" name=\"chck_UTALL\" value=\"ALL\">");
                sbHtmlContent.Append("&nbsp;<label for=\"chk_UT_ALL\">ALL</label>");



                foreach (DataRow dr in dsUserType.Tables[0].Rows)
                {
                    sbHtmlContent.Append("&nbsp;<input type=\"checkbox\" onclick='fnUnderUsertypeleChk(\"" + dsUserType.Tables[0].Rows.Count + "\")' id=\"chk_UT_" + dr["User_Type_Name"].ToString() + "\"  Class=\"clsUnCheckUserType\" name=\"chck_UT\" value=\"" + dr["User_Type_Name"].ToString() + "\">");
                    sbHtmlContent.Append("&nbsp;<label for=\"chk_UT_" + dr["User_Type_Name"].ToString() + "\">" + dr["User_Type_Name"].ToString() + "</label>");
                }



                return sbHtmlContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        private void GenerateUserTypeLevel(string userTypeCode)
        {
            try
            {
                userTypeFilter = dsUserType.Tables[0].Select("Under_User_Type = '" + userTypeCode + "' AND User_Type_Code <> Under_User_Type");

                if (userTypeFilter.Length > 0)
                {
                    userTypeLevelNo++;

                    foreach (DataRow dr in userTypeFilter)
                    {
                        dr["Level_No"] = userTypeLevelNo.ToString();
                        dsUserType.Tables[0].AcceptChanges();
                    }

                    foreach (DataRow dr in userTypeFilter)
                    {
                        GenerateUserTypeLevel(dr["User_Type_Code"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):userTypeCode", userTypeCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string SaveNoticeBoard(string msgCode, string msgTitle, string msgBody, string hyperlink, string priority, string validFrom, string validTo,
                string distType, string ackReqd, string fileName, string selectedNodeValues, string saveMode, string showTicker, string highlight)
        {
            try
            {
                NoticeBoardModel objNoticeBoardModel;
                bool isDataSaved;
                string userName = string.Empty;

                string companyCode = _objCurrentInfo.GetCompanyCode();

                if (saveMode.Trim().ToUpper() == NEW)
                {
                    userName = _objCurrentInfo.GetUserName();
                    msgCode = userName + "_" + DateTime.Now.ToString("yyyyMMddHHmmssfff");
                }

                objNoticeBoardModel = GenerateNoticeBoardObject(companyCode, msgCode, msgTitle, msgBody, hyperlink, priority, validFrom, validTo, distType, ackReqd, fileName, selectedNodeValues, showTicker, highlight);

                if (saveMode.Trim().ToUpper() == NEW)
                {
                    isDataSaved = _objDALNoticeBoard.InsertNoticeBoard(companyCode, objNoticeBoardModel);
                }
                else
                {
                    isDataSaved = _objDALNoticeBoard.UpdateNoticeBoard(companyCode, objNoticeBoardModel);
                }

                if (isDataSaved)
                {
                    return SUCCESS + "~" + msgCode;
                }
                else
                {
                    return ERROR + "~" + msgCode;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("InputParameter(s):msgTitle", msgTitle);
                dicContext.Add("InputParameter(s):msgBody", msgBody);
                dicContext.Add("InputParameter(s):hyperlink", hyperlink);
                dicContext.Add("InputParameter(s):priority", priority);
                dicContext.Add("InputParameter(s):validFrom", validFrom);
                dicContext.Add("InputParameter(s):distType", distType);
                dicContext.Add("InputParameter(s):ackReqd", ackReqd);
                dicContext.Add("InputParameter(s):fileName", fileName);
                dicContext.Add("InputParameter(s):selectedNodeValues", selectedNodeValues);
                dicContext.Add("InputParameter(s):saveMode", saveMode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        private NoticeBoardModel GenerateNoticeBoardObject(string companyCode, string msgCode, string msgTitle, string msgBody, string hyperlink, string priority,
            string validFrom, string validTo, string distType, string ackReqd, string fileName, string selectedNodeValues, string showTicker, string highlight)
        {
            try
            {
                List<NoticeBoardAgent> lstNotoceBoardAgent = new List<NoticeBoardAgent>();

                NoticeBoardModel objNoticeBoardModel = new NoticeBoardModel();
                NoticeBoardAgent objNoticeBoardAgent = new NoticeBoardAgent();

                validFrom = validFrom.Split('/')[2] + "-" + validFrom.Split('/')[1] + "-" + validFrom.Split('/')[0];
                validTo = validTo.Split('/')[2] + "-" + validTo.Split('/')[1] + "-" + validTo.Split('/')[0];

                objNoticeBoardModel.MsgCode = msgCode;
                objNoticeBoardModel.MsgTitle = msgTitle;
                objNoticeBoardModel.MsgBody = msgBody;
                objNoticeBoardModel.MsgHyperlink = hyperlink;
                objNoticeBoardModel.MsgPriority = Convert.ToInt16(priority);
                objNoticeBoardModel.MsgValidFrom = validFrom;
                objNoticeBoardModel.MsgValidTo = validTo;
                objNoticeBoardModel.MsgSenderUserCode = _objCurrentInfo.GetUserCode();
                objNoticeBoardModel.MsgDistributionType = Convert.ToChar(distType);
                objNoticeBoardModel.MsgAcknowlendgementReqd = Convert.ToChar(ackReqd);
                objNoticeBoardModel.MsgAttachmentPath = fileName;
                objNoticeBoardModel.SHOW_IN_TICKER_ONLY = showTicker;
                objNoticeBoardModel.HIGHLIGHT = highlight;

                if (distType.Trim().ToUpper() == "M") // M means "My Team". Since I'm sending a notice to my team, approval is not required
                {
                    objNoticeBoardModel.MsgApprovalStatus = 'Y'; //  'Y' means Yes. (i.e.) Msg will be saved in approved status by default.
                }
                else
                {
                    objNoticeBoardModel.MsgApprovalStatus = 'N';
                }

                string[] targetUserCodes;

                if (distType.Trim().ToUpper() == "R")
                {
                    targetUserCodes = GetUserCodes(companyCode, selectedNodeValues);
                }
                else
                {
                    targetUserCodes = selectedNodeValues.Split(',');
                }

                foreach (string userCode in targetUserCodes)
                {
                    if (!string.IsNullOrEmpty(userCode))
                    {
                        objNoticeBoardAgent = new NoticeBoardAgent();

                        objNoticeBoardAgent.MsgCode = msgCode;
                        objNoticeBoardAgent.MsgTargetUserCode = userCode;

                        lstNotoceBoardAgent.Add(objNoticeBoardAgent);
                    }
                }

                objNoticeBoardModel.lstNoticeBoardAgent = lstNotoceBoardAgent;

                return objNoticeBoardModel;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("InputParameter(s):msgTitle", msgTitle);
                dicContext.Add("InputParameter(s):msgBody", msgBody);
                dicContext.Add("InputParameter(s):hyperlink", hyperlink);
                dicContext.Add("InputParameter(s):priority", priority);
                dicContext.Add("InputParameter(s):validFrom", validFrom);
                dicContext.Add("InputParameter(s):distType", distType);
                dicContext.Add("InputParameter(s):ackReqd", ackReqd);
                dicContext.Add("InputParameter(s):fileName", fileName);
                dicContext.Add("InputParameter(s):selectedNodeValues", selectedNodeValues);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        private string[] GetUserCodes(string companyCode, string selectedNodeValues)
        {
            try
            {
                string regionCodes = string.Empty;
                string[] array = selectedNodeValues.Split(',');

                foreach (string value in array)
                {
                    regionCodes += value + "^";
                }

                string userCodes = string.Empty;
                string[] userCodeArray;

                userCodes = _objDALNoticeBoard.GetUserCodes(companyCode, regionCodes);

                userCodeArray = userCodes.Split(',');

                return userCodeArray;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):selectedNodeValues", selectedNodeValues);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public NoticeBoardModel GetSingleNoticeDetails(string msgCode)
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string userCode = _objCurrentInfo.GetUserCode();

                List<NoticeBoardModel> lstNoticeBoardModel;
                NoticeBoardModel objNoticeBoardModel;

                lstNoticeBoardModel = _objDALNoticeBoard.GetSingleNoticeDetails(companyCode, userCode, msgCode);

                objNoticeBoardModel = lstNoticeBoardModel[0];

                return objNoticeBoardModel;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }



        public string GetAllNoticeDetails()
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string userCode = _objCurrentInfo.GetUserCode();

                List<NoticeBoardModel> lstNoticeBoardModel;
                StringBuilder sbTableContent;

                lstNoticeBoardModel = _objDALNoticeBoard.GetAllNoticeDetails(companyCode, userCode);

                if (lstNoticeBoardModel != null && lstNoticeBoardModel.Count > 0)
                {
                    sbTableContent = new StringBuilder();

                    sbTableContent.Append("<table cellpadding='0' cellsapcing='0' id='tblNoticeSummaryGrid' width='100%' class='table table-striped'>");
                    sbTableContent.Append("<thead>");
                    sbTableContent.Append("<tr>");

                    sbTableContent.Append("<th>Edit</th>");
                    sbTableContent.Append("<th>Delete</th>");
                    sbTableContent.Append("<th>Distribution Type</th>");
                    sbTableContent.Append("<th>View Read Status</th>");
                    sbTableContent.Append("<th>Title</th>");
                    sbTableContent.Append("<th>Message</th>");
                    sbTableContent.Append("<th>Hyperlink</th>");
                    sbTableContent.Append("<th>Priority</th>");
                    sbTableContent.Append("<th>Valid From </th>");
                    sbTableContent.Append("<th>Valid To</th>");
                    sbTableContent.Append("<th>Acknowledgement Reqd?</th>");
                    sbTableContent.Append("<th>Show as a Ticker</th>");
                    sbTableContent.Append("<th>Highlight</th>");

                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");

                    foreach (NoticeBoardModel objNoticeBoardModel in lstNoticeBoardModel)
                    {
                        sbTableContent.Append("<tr>");

                        sbTableContent.Append("<td><a href='#' onclick=\"fnEditNotice('" + objNoticeBoardModel.MsgCode + "')\">Edit</a></td>");
                        sbTableContent.Append("<td><a href='#' onclick=\"fnDeleteNotice('" + objNoticeBoardModel.MsgCode + "')\">Delete</a></td>");
                        sbTableContent.Append("<td>" + GetDistributionTypeFullText(objNoticeBoardModel.MsgDistributionType) + "</td>");

                        if (objNoticeBoardModel.MsgAcknowlendgementReqd == 'Y')
                        {
                            sbTableContent.Append("<td><a href= '#' onclick=\"fnShowReadUsers('" + objNoticeBoardModel.MsgCode + "')\">Click to view</a></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>N/A</td>");
                        }

                        if (!string.IsNullOrEmpty(objNoticeBoardModel.MsgAttachmentPath))
                        {
                            sbTableContent.Append("<td><a href='" + BLOB_URL + _objCurrentInfo.GetCompanyCode().ToLower() + "/" + System.Web.HttpUtility.UrlEncode(objNoticeBoardModel.MsgAttachmentPath) + "'>" + objNoticeBoardModel.MsgTitle + "</a></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>" + objNoticeBoardModel.MsgTitle + "</td>");
                        }

                        sbTableContent.Append("<td>" + objNoticeBoardModel.MsgBody + "</td>");

                        if (objNoticeBoardModel.MsgHyperlink != string.Empty)
                        {
                            sbTableContent.Append("<td> <a href='" + objNoticeBoardModel.MsgHyperlink + "' target='_blank'>" + objNoticeBoardModel.MsgHyperlink + "</a></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td></td>");
                        }

                        sbTableContent.Append("<td>" + GetPriorityFullText(objNoticeBoardModel.MsgPriority) + "</td>");
                        sbTableContent.Append("<td>" + objNoticeBoardModel.MsgValidFrom + "</td>");
                        sbTableContent.Append("<td>" + objNoticeBoardModel.MsgValidTo + "</td>");
                        sbTableContent.Append("<td>" + GetAcknowledgementReqdFullText(objNoticeBoardModel.MsgAcknowlendgementReqd) + "</td>");
                        sbTableContent.Append("<td>" + objNoticeBoardModel.SHOW_IN_TICKER_ONLY + "</td>");
                        sbTableContent.Append("<td>" + objNoticeBoardModel.HIGHLIGHT + "</td>");

                        sbTableContent.Append("</tr>");
                    }

                    sbTableContent.Append("</tbody>");

                    sbTableContent.Append("</table>");
                }
                else
                {
                    sbTableContent = new StringBuilder();

                    sbTableContent.Append("No records found");
                }

                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        private string GetDistributionTypeFullText(char distType)
        {
            switch (distType)
            {
                case 'A':
                    return "To All";
                case 'U':
                    return "Users";
                case 'R':
                    return "Regions";
                case 'M':
                    return "My Team";
                case 'G':
                    return "Group";
                default:
                    return "";
            }
        }

        private string GetPriorityFullText(int priority)
        {
            switch (priority)
            {
                case 0:
                    return "High";
                case 1:
                    return "Medium";
                case 2:
                    return "Low";
                default:
                    return "";
            }
        }

        private string GetAcknowledgementReqdFullText(char ackReqd)
        {
            switch (ackReqd)
            {
                case 'Y':
                    return "Yes";
                case 'N':
                    return "No";
                default:
                    return "";
            }
        }

        public string DeleteNoticeBoard(string msgCode)
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                bool isDeleted;

                isDeleted = _objDALNoticeBoard.DeleteNoticeBoard(companyCode, msgCode);

                if (isDeleted)
                {
                    return SUCCESS;
                }
                else
                {
                    return ERROR;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetNoticeReadStatus(string msgCode)
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();

                NoticeBoardModel objNoticeBoardModel;
                StringBuilder sbTableContent = new StringBuilder();
                List<NoticeBoardAgent> lstjNoticeBoardAgent;

                objNoticeBoardModel = _objDALNoticeBoard.GetNoticeReadStatus(companyCode, msgCode);

                if (objNoticeBoardModel != null)
                {
                    lstjNoticeBoardAgent = objNoticeBoardModel.lstNoticeBoardAgent;

                    sbTableContent.Append("<table cellpadding='0' cellsapcing='0' id='tblNoticeReadStatus' width='100%' class='table table-striped'>");

                    sbTableContent.Append("<thead>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>User Name </td>");
                    sbTableContent.Append("<td>Employee Name </td>");
                    sbTableContent.Append("<td>Has Read the Notice?</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");

                    sbTableContent.Append("<tbody>");

                    foreach (NoticeBoardAgent objNoticeBoardAgent in lstjNoticeBoardAgent)
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td>" + objNoticeBoardAgent.MsgTargetUserCode + "</td>");
                        sbTableContent.Append("<td>" + objNoticeBoardAgent.Employee_Name + "</td>");
                        if (objNoticeBoardAgent.MsgIsRead == 'Y')
                        {
                            sbTableContent.Append("<td>Yes</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>No</td>");
                        }

                        sbTableContent.Append("</tr>");
                    }

                    sbTableContent.Append("</tbody>");
                    sbTableContent.Append("</table>");
                }

                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public IEnumerable<NoticeBoardContentModel> GetNoticeBoarddetail(string companyCode, string userCode)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();

            return _objDALNoticeBoard.GetNoticeBoarddetail(companyCode, userCode);
        }

        public IEnumerable<NoticeBoardContentModel> GetNoticeBoardPopup(string companyCode, string mesgCode, string userCode)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetNoticeBoardPopup(companyCode, mesgCode, userCode);
        }



        public IEnumerable<UserDivisionWise> GetLockUsersDetails(string companyCode, string userCode, string match)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetLockUsersDetails(companyCode, userCode, match);
        }

        public IEnumerable<DcrLockDetail> GetDcrLockedetails(string companyCode, string userCode)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetDcrLockedetails(companyCode, userCode);
        }
        public List<userList> GetUserDivisionWise(string userTypeCodes, string divisionCodes)
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();

            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetUserDivisionWise(companyCode, userTypeCodes, divisionCodes);
        }


        public List<userList> GetRegionDivisionWise(string regionsCodes, string divisionCodes)
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();

            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetRegionDivisionWise(companyCode, regionsCodes, divisionCodes);
        }

        /// <summary>
        /// Get DCR Lock Release Dates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<DCRActivityLockModel> GetDcrLockReleaseDates(string companyCode, string userCode, string showDetail,string FromDate,string ToDate)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetDcrLockReleaseDates(companyCode, userCode, showDetail,FromDate,ToDate);
        }
        public List<DCRActivityLockModel> GetDcrLockReleaseDatesforactivity(string companyCode, string userCode, string showDetail)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetDcrLockReleaseDatesforactivity(companyCode, userCode, showDetail);
        }
        public MVCModels.DCRLockReleaseDataForPagination GetAllDCRLockRelease(string Company_Code, string User_Code, string PageNumber, string PageSize)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetAllDCRLockRelease(Company_Code, User_Code, PageNumber, PageSize);
        }

        public List<DCRActivityLockModel> GetAlllockData(string companyCode, string userCode, string showDetail)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetAlllockData(companyCode, userCode, showDetail);
        }

        #region - Active Notice for Inactive User
        /// <summary>
        /// Get Active Notice for Inactive Users
        /// </summary>
        /// <param name="company_code"></param>
        /// <returns></returns>
        public List<NoticeContentforUserModel> GetActiveNoticeforInactiveUser(string company_code)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetActiveNoticeforInactiveUser(company_code);
        }
        /// <summary>
        /// Get Notice content for selected User
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<NoticeContentforUserModel> GetNoticeContent(string companyCode, string userCode)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.GetNoticeContent(companyCode, userCode);

        }
        /// <summary>
        /// Update notice for active users
        /// </summary>
        /// <param name="lstNotices"></param>
        /// <returns></returns>
        public int UpdateActiveNoticeforInactiveuser(List<NoticeContentforUserModel> lstNotices)
        {
            _objDALNoticeBoard = new DAL_NoticeBoard();
            return _objDALNoticeBoard.UpdateActiveNoticeforInactiveuser(lstNotices);
        }
        #endregion - Active Notice for Inactive User

        public int InsertNewGroup(string UserCodes, string GroupName, string UserName, string RegionCode)
        {
            int result = 0;
            DAL_NoticeBoard ObjGroupName = new DAL_NoticeBoard();
            result = ObjGroupName.InsertNewGroup(UserCodes, GroupName, UserName, RegionCode);
            return result;
        }
        public List<MVCModels.UserGroup> GetGroupNames(string RegionCode)
        {
            DAL_NoticeBoard objGroupLst = new DAL_NoticeBoard();
            return objGroupLst.GetGroupNames(RegionCode);
        }
        public UserGroupHistory GetGroupmembers(int Group_Id, string RegionCode)
        {
            DAL_NoticeBoard objGroupMembsLst = new DAL_NoticeBoard();
            return objGroupMembsLst.GetGroupmembers(Group_Id, RegionCode);
        }
        public List<MVCModels.UserCodeTree> GetUserCodesForTree(int Group_Id)
        {
            DAL_NoticeBoard objTreeMembsLst = new DAL_NoticeBoard();
            return objTreeMembsLst.GetUserCodesForTree(Group_Id);
        }
        public List<MVCModels.GroupUpdatedHistory> GetMembsUpdDateWise(int Group_Id, int GROUP_SEQ)
        {
            DAL_NoticeBoard objGroupHisMembsLst = new DAL_NoticeBoard();
            return objGroupHisMembsLst.GetMembsUpdDateWise(Group_Id, GROUP_SEQ);
        }
        public int UpdateGroupStatus(int Group_Id, int Status)
        {
            int result = 0;
            DAL_NoticeBoard ObjGroupStatus = new DAL_NoticeBoard();
            result = ObjGroupStatus.UpdateGroupStatus(Group_Id, Status);
            return result;
        }
        public int UpdateGroupDetails(string UserCodes, string GroupName, int Group_Id, string UserName)
        {
            int result = 0;
            DAL_NoticeBoard ObjGroupDet = new DAL_NoticeBoard();
            result = ObjGroupDet.UpdateGroupDetails(UserCodes, GroupName, Group_Id, UserName);
            return result;
        }

    }
}
