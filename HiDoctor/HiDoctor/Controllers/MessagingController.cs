using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using DataControl.Abstraction;
using DataControl.Impl;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Reflection;
using DataControl;
using MVCModels.HiDoctor_Master;
using System.Text.RegularExpressions;
namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class MessagingController : Controller
    {
        #region private variables
        #endregion private variables
        #region const strings
        const string BLOB_URL = "http://nbfiles.blob.core.windows.net/";
        #endregion const strings
        //
        // GET: /Messaging/

        public ActionResult Index()
        {
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            ViewBag.CurrentUserCode = objCurInfo.GetUserCode();
            ViewBag.CurrentRegionCode = objCurInfo.GetRegionCode();
            return View();
        }
        /// <summary>
        /// Get the all type message count
        /// </summary>
        /// <returns>retuns the unread, drafted and trash count</returns>
        public string GetMsgCount()
        {
            string unreadCount = string.Empty;
            string draftedCount = string.Empty;
            string trashCount = string.Empty;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            try
            {
                DataSet ds = new DataSet();
                ds = objMsg.GetMessageCount(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                if (ds.Tables.Count > 0)
                {
                    unreadCount = Convert.ToString(ds.Tables[0].Rows[0][0]);
                    if (ds.Tables.Count > 1)
                    {
                        draftedCount = Convert.ToString(ds.Tables[1].Rows[0][0]);
                        if (ds.Tables.Count > 2)
                        {
                            trashCount = Convert.ToString(ds.Tables[2].Rows[0][0]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
            }
            return unreadCount + "~" + draftedCount + "~" + trashCount;
        }

        /// <summary>
        ///  get the selected mail mode details(inbox,trash,sent)
        /// </summary>
        /// <param name="mailMode"></param>
        /// <returns>return the selected mai mode details in the form of table </returns>
        public string GetMessageContent(string mailMode, int pageNum, int pageSize, string searchKeyWord)
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            strContent.Append(" <table cellspacing=0 cellpadding=0 class='table table-email'> <tbody>");
            int totalPageCount = 0;
            try
            {
                List<MVCModels.MessagingModel> lstMsg = new List<MVCModels.MessagingModel>();
                if ("INBOX" == mailMode.ToUpper())
                {
                    lstMsg = new List<MVCModels.MessagingModel>(objMsg.GetMsgInboxContent(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(),
                        pageNum, pageSize, searchKeyWord, ref totalPageCount));
                }
                else if ("SENT" == mailMode.ToUpper())
                {
                    lstMsg = new List<MVCModels.MessagingModel>(objMsg.GetMsgSentContent(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(),
                        pageNum, pageSize, searchKeyWord, ref totalPageCount));
                }
                else if ("DRAFTED" == mailMode.ToUpper())
                {
                    lstMsg = new List<MVCModels.MessagingModel>(objMsg.GetMsgDraftedContent(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(),
                        pageNum, pageSize, searchKeyWord, ref totalPageCount));
                }
                else if ("UNREAD" == mailMode.ToUpper())
                {
                    lstMsg = new List<MVCModels.MessagingModel>(objMsg.GetMsgUnreadContent(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(),
                        pageNum, pageSize, searchKeyWord, ref totalPageCount));
                }
                else
                {
                    lstMsg = new List<MVCModels.MessagingModel>(objMsg.GetMsgDeletedContent(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(),
                        pageNum, pageSize, searchKeyWord, ref totalPageCount));
                }
                if (lstMsg.Count > 0)
                {
                    if ("DRAFTED" == mailMode.ToUpper())
                    {
                        var filterdList = lstMsg.AsEnumerable().Select(x => x.Msg_Code).Distinct().ToList();
                        // totalPageCount = filterdList.Count;
                        int i = 0;
                        foreach (var dr in filterdList)
                        {
                            var detailsList = lstMsg.AsEnumerable().Where(z => z.Msg_Code == dr.ToString()).ToList();
                            StringBuilder strTousers = new StringBuilder();
                            foreach (var li in detailsList)
                            {
                                strTousers.Append(li.Employee_Name + ",");
                            }
                            strTousers.ToString().TrimEnd(',');
                            i++;
                            strContent.Append("<tr>");
                            strContent.Append("<td>");
                            strContent.Append("<div>");
                            strContent.Append("<input type='checkbox' name='chkSelect' id='chkMsg_" + i + "' value='"
                                    + dr.ToString() + "~'>");
                            strContent.Append("<label for='chkMsg_" + i + "'></label>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            strContent.Append("<td>");
                            strContent.Append("<a href='#' class='star'><i class='glyphicon glyphicon-star'></i></a>");
                            strContent.Append("</td>");
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString() + "\",\"\");'>");
                            strContent.Append("<div class='media'>");
                            strContent.Append("<a href='#' class='pull-left'>");
                            strContent.Append("<img alt='' src='Images/default_user.jpg' class='media-object userImg'>");
                            strContent.Append("</a>");
                            strContent.Append("<div class='media-body'>");
                            if (strTousers.Length > 150)
                            {
                                strContent.Append("<h4 class='text-primary'>" + strTousers.ToString().TrimEnd(',').Substring(0, 150) + "..." + "</h4>");
                            }
                            else
                            {
                                strContent.Append("<h4 class='text-primary'>" + strTousers.ToString().TrimEnd(',') + "</h4>");
                            }

                            strContent.Append("<small class='text-muted'></small>");
                            strContent.Append("<p class='email-summary'>");
                            strContent.Append("" + detailsList[0].Subject + "</p>");
                            strContent.Append("</div>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            if (!string.IsNullOrEmpty(detailsList[0].Attachment_Path1))
                            {
                                strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString()
                                    + "\",\"\");'><i class='glyphicon glyphicon-paperclip'></i></td>");
                            }
                            else
                            {
                                strContent.Append("<td></td>");
                            }
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString() + "\",\"\");'><span class='media-meta pull-right'>"
                                + detailsList[0].Date_From + "</span></td>");
                            strContent.Append("</tr>");
                        }
                    }
                    else if ("SENT" == mailMode.ToUpper())
                    {
                        var filterdList = lstMsg.AsEnumerable().Select(x => x.Msg_Code).Distinct().ToList();
                        // totalPageCount = filterdList.Count;
                        int i = 0;
                        foreach (var dr in filterdList)
                        {
                            var detailsList = lstMsg.AsEnumerable().Where(z => z.Msg_Code == dr.ToString()).ToList();
                            StringBuilder strTousers = new StringBuilder();
                            foreach (var li in detailsList)
                            {
                                strTousers.Append(li.Employee_Name + ",");
                            }
                            strTousers.ToString().TrimEnd(',');
                            i++;
                            strContent.Append("<tr>");
                            strContent.Append("<td>");
                            strContent.Append("<div>");
                            strContent.Append("<input type='checkbox' name='chkSelect' id='chkMsg_" + i + "' value='"
                                    + dr.ToString() + "~" + objCurInfo.GetUserCode() + "'>");
                            strContent.Append("<label for='chkMsg_" + i + "'></label>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            strContent.Append("<td>");
                            strContent.Append("<a href='#' class='star'><i class='glyphicon glyphicon-star'></i></a>");
                            strContent.Append("</td>");
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString() + "\",\"" + objCurInfo.GetUserCode() + "\");'>");
                            strContent.Append("<div class='media'>");
                            strContent.Append("<a href='#' class='pull-left'>");
                            strContent.Append("<img alt='' src='Images/default_user.jpg' class='media-object userImg'>");
                            strContent.Append("</a>");
                            strContent.Append("<div class='media-body'>");
                            if (strTousers.Length > 150)
                            {
                                strContent.Append("<h4 class='text-primary'>" + strTousers.ToString().TrimEnd(',').Substring(0, 150) + "..." + "</h4>");
                            }
                            else
                            {
                                strContent.Append("<h4 class='text-primary'>" + strTousers.ToString().TrimEnd(',') + "</h4>");
                            }

                            strContent.Append("<small class='text-muted'></small>");
                            strContent.Append("<p class='email-summary'>");
                            strContent.Append("" + detailsList[0].Subject + "</p>");
                            strContent.Append("</div>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            if (!string.IsNullOrEmpty(detailsList[0].Attachment_Path1))
                            {
                                strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString()
                                    + "\",\"" + objCurInfo.GetUserCode() + "\");'><i class='glyphicon glyphicon-paperclip'></i></td>");
                            }
                            else
                            {
                                strContent.Append("<td></td>");
                            }
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.ToString() + "\",\"" + objCurInfo.GetUserCode() + "\");'><span class='media-meta pull-right'>"
                                + detailsList[0].Date_From + "</span></td>");
                            strContent.Append("</tr>");
                        }
                    }
                    else if ("UNREAD" == mailMode.ToUpper())
                    {
                        int i = 0;
                        foreach (var dr in lstMsg)
                        {
                            i++;

                            strContent.Append("<tr class='read'>");
                            strContent.Append("<td>");
                            strContent.Append("<div>");
                            strContent.Append("<input type='checkbox' name='chkSelect' id='chkMsg_" + i + "' value='" + dr.Msg_Code + "~" + dr.Target_Address + "'>");
                            strContent.Append("<label for='chkMsg_" + i + "'></label>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            strContent.Append("<td>");
                            strContent.Append("<a href='#' class='star'><i class='glyphicon glyphicon-star'></i></a>");
                            strContent.Append("</td>");
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\"" + dr.Target_Address + "\");'>");
                            strContent.Append("<div class='media'>");
                            strContent.Append("<a href='#' class='pull-left'>");
                            strContent.Append("<img alt='' src='Images/default_user.jpg' class='media-object userImg'>");
                            strContent.Append("</a>");
                            strContent.Append("<div class='media-body'>");
                            strContent.Append("<h4 class='text-primary'>" + dr.Employee_Name + "(" + dr.User_Name + ")</h4>");
                            strContent.Append("<small class='text-muted'></small>");
                            strContent.Append("<p class='email-summary'>");
                            strContent.Append("" + dr.Subject + "</p>");
                            strContent.Append("</div>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            if (!string.IsNullOrEmpty(dr.Attachment_Path1))
                            {
                                strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\""
                                    + dr.Target_Address + "\");'><i class='glyphicon glyphicon-paperclip'></i></td>");
                            }
                            else
                            {
                                strContent.Append("<td></td>");
                            }
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\""
                                + dr.Target_Address + "\");'><span class='media-meta pull-right'>"
                                + dr.Date_From + "</span></td>");
                            strContent.Append("</tr>");
                        }
                    }
                    else
                    {
                        int i = 0;
                        foreach (var dr in lstMsg)
                        {
                            i++;
                            string clsUnread = "";
                            // if (dr.IsRead == "0" && "INBOX" == mailMode.ToUpper())
                            if (dr.IsRead == "0")
                            {
                                clsUnread = "read";
                            }
                            else
                            {
                                clsUnread = "unread";
                            }
                            strContent.Append("<tr class='" + clsUnread + "'>");
                            strContent.Append("<td>");
                            strContent.Append("<div>");
                            strContent.Append("<input type='checkbox' name='chkSelect' id='chkMsg_" + i + "' value='" + dr.Msg_Code + "~" + dr.Target_Address + "'>");
                            strContent.Append("<label for='chkMsg_" + i + "'></label>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            strContent.Append("<td>");
                            strContent.Append("<a href='#' class='star'><i class='glyphicon glyphicon-star'></i></a>");
                            strContent.Append("</td>");
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\"" + dr.Target_Address + "\");'>");
                            strContent.Append("<div class='media'>");
                            strContent.Append("<a href='#' class='pull-left'>");
                            strContent.Append("<img alt='' src='Images/default_user.jpg' class='media-object userImg'>");
                            strContent.Append("</a>");
                            strContent.Append("<div class='media-body'>");
                            strContent.Append("<h4 class='text-primary'>" + dr.Employee_Name + "(" + dr.User_Name + ")</h4>");
                            strContent.Append("<small class='text-muted'></small>");
                            strContent.Append("<p class='email-summary'>");
                            strContent.Append("" + dr.Subject + "</p>");
                            strContent.Append("</div>");
                            strContent.Append("</div>");
                            strContent.Append("</td>");
                            if (!string.IsNullOrEmpty(dr.Attachment_Path1))
                            {
                                strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\""
                                    + dr.Target_Address + "\");'><i class='glyphicon glyphicon-paperclip'></i></td>");
                            }
                            else
                            {
                                strContent.Append("<td></td>");
                            }
                            strContent.Append("<td onclick='fnShowMailDetails(\"" + dr.Msg_Code + "\",\""
                                + dr.Target_Address + "\");'><span class='media-meta pull-right'>"
                                + dr.Date_From + "</span></td>");
                            strContent.Append("</tr>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex, null);
            }
            strContent.Append("</tbody></table>");
            return strContent.ToString() + "á" + totalPageCount; //ALT+160 = á
        }

        /// <summary>
        /// Get the child users
        /// </summary>
        /// <returns>returns the child users in th form of json </returns>
        public JsonResult GetChildUsers(string UserCode = "")
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();

            if (string.IsNullOrEmpty(UserCode))
                UserCode = objCurInfo.GetUserCode();

            lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objMsg.GetUsersForMessaging(objCurInfo.GetCompanyCode(), UserCode);
            string msgStartingUserType = string.Empty;
            return Json(objJson.Serialize(lstUser));
        }

        /// <summary>
        /// get the selected message details
        /// </summary>
        /// <param name="msgCode"></param>
        /// <returns>returns the selected message details in the form of json </returns>
        public string GetSelectedMsgDetails(string msgCode, string TargetAddress)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("NBFILES");
            string blobURL = accKey + objCurInfo.GetCompanyCode().ToLower();
            return objJson.Serialize(objMsg.GetSelectedMsgDetails(objCurInfo.GetCompanyCode(), msgCode, TargetAddress)) + "~" + blobURL;
        }

        public string UpdateMsgReadStatus(string isRead, string msgDetails)
        {
            string result = string.Empty;
            List<MVCModels.MessagingModel> lstMsg = new List<MVCModels.MessagingModel>();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            try
            {
                if (!string.IsNullOrEmpty(msgDetails))
                {
                    string[] ar = msgDetails.Split('^');
                    if (ar.Length > 0)
                    {
                        for (int i = 0; i < ar.Length; i++)
                        {
                            if (!string.IsNullOrEmpty(Convert.ToString(ar[i]).Split('~')[0]))
                            {
                                string targetAddress = Convert.ToString(ar[i]).Split('~')[1];
                                MVCModels.MessagingModel objMsgModel = new MVCModels.MessagingModel();
                                objMsgModel.Company_Code = objCurInfo.GetCompanyCode();
                                objMsgModel.Msg_Code = Convert.ToString(ar[i]).Split('~')[0];
                                objMsgModel.Target_Address = targetAddress;
                                lstMsg.Add(objMsgModel);
                            }
                        }
                        int rowsAffected = 0;
                        rowsAffected = objMsg.UpdateMsgReadStatus(objCurInfo.GetCompanyCode(), lstMsg, isRead);
                        if (rowsAffected > 0)
                        {
                            if (isRead == "1")
                            {
                                result = "The conversation has been marked as read.";
                            }
                            else
                            {
                                result = "The conversation has been marked as unread.";
                            }
                        }
                        else
                        {
                            if (isRead == "1")
                            {
                                result = "Error while change the conversation as read.";
                            }
                            else
                            {
                                result = "Error while change the conversation as unread.";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }//The conversation has been moved to the Trash.
        public string UpdateMsgStatus(string rowStatus, string msgCode, string mailMode)
        {
            string result = string.Empty;
            List<MVCModels.MessagingModel> lstMsg = new List<MVCModels.MessagingModel>();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            try
            {
                if (!string.IsNullOrEmpty(msgCode))
                {
                    string[] ar = msgCode.Split('^');
                    if (ar.Length > 0)
                    {
                        for (int i = 0; i < ar.Length; i++)
                        {
                            if (!string.IsNullOrEmpty(Convert.ToString(ar[i])))
                            {
                                MVCModels.MessagingModel objMsgModel = new MVCModels.MessagingModel();
                                objMsgModel.Company_Code = objCurInfo.GetCompanyCode();
                                objMsgModel.Msg_Code = Convert.ToString(ar[i]).Split('~')[0];
                                objMsgModel.Target_Address = Convert.ToString(ar[i]).Split('~')[1];
                                objMsgModel.Sender = Convert.ToString(ar[i]).Split('~')[1];
                                lstMsg.Add(objMsgModel);
                            }
                        }
                        int rowsAffected = 0;
                        if ("INBOX" == mailMode || "TRASH" == mailMode || "UNREAD" == mailMode)
                        {
                            rowsAffected = objMsg.UpdateMsgStatus(objCurInfo.GetCompanyCode(), lstMsg, rowStatus);
                        }
                        else if ("SENT" == mailMode)
                        {
                            rowsAffected = objMsg.UpdateSentMsgStatus(objCurInfo.GetCompanyCode(), lstMsg, rowStatus);
                        }
                        else
                        {
                            rowsAffected = objMsg.UpdateMsgStatusOtherthanInbox(objCurInfo.GetCompanyCode(), lstMsg, "3");
                        }
                        if (rowsAffected > 0)
                        {
                            if ("TRASH" == mailMode)
                            {
                                result = "The conversation has been deleted";
                            }
                            else if ("INBOX" == mailMode)
                            {
                                result = "The conversation has been moved to the Trash.";
                            }
                            else
                            {
                                result = "The conversation has been deleted";
                            }
                        }
                        else
                        {
                            if ("TRASH" == mailMode)
                            {
                                result = "Error while delete the conversation.";
                            }
                            else
                            {
                                result = "Error while move the conversation to trash";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }
        public string InsertMessage(string subject, string msgContent, string sentStatus, string sentType, string toUsers, string ccUsers, string msgCode)
        {
            string result = string.Empty;
            List<MVCModels.MessagingModel> lstMsgContent = new List<MVCModels.MessagingModel>();
            List<MVCModels.MessagingModel> lstMsgUsers = new List<MVCModels.MessagingModel>();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            MVCModels.MessagingModel objMsgContentModel = new MVCModels.MessagingModel();
            try
            {
                #region message content details
                if (sentStatus.ToUpper().Trim() == "SEND")
                {
                    if (!string.IsNullOrEmpty(msgCode))
                    {
                        objMsgContentModel.Msg_Code = msgCode;
                    }
                    else
                    {
                        sentType = "STRAIGHT";
                        msgCode = Convert.ToString(objMsg.GetSeqNumber("SEQ_tbl_SFA_Noticeboard_Content_MSG"));
                        objMsgContentModel.Msg_Code = msgCode;
                    }


                    objMsgContentModel.Sent_Status = "SENT";
                }
                else if (sentStatus.ToUpper().Trim() == "DRAFT")
                {
                    sentType = "STRAIGHT";
                    if (!string.IsNullOrEmpty(msgCode))
                    {
                        objMsgContentModel.Msg_Code = msgCode;
                    }
                    else
                    {
                        msgCode = Convert.ToString(objMsg.GetSeqNumber("SEQ_tbl_SFA_Noticeboard_Content_MSG"));
                        objMsgContentModel.Msg_Code = msgCode;
                    }

                    objMsgContentModel.Sent_Status = "DRAFTED";
                }
                objMsgContentModel.Company_Code = objCurInfo.GetCompanyCode();
                objMsgContentModel.Subject = subject.Replace("á", "<").Replace("í", ">");
                objMsgContentModel.Message_Content = msgContent.Replace("á", "<").Replace("í", ">"); //ALT+160 = á , ALT+161 = í
                objMsgContentModel.Is_Richtext = "1";
                objMsgContentModel.Priority = "1";
                // objMsgContentModel.Date_From = "GETDATE()";
                objMsgContentModel.Sender = objCurInfo.GetUserCode();
                objMsgContentModel.Sent_Type = sentType;
                objMsgContentModel.Row_Status = "1";
                lstMsgContent.Add(objMsgContentModel);
                #endregion message content details
                #region message user details
                //TO USERS
                string[] ar = toUsers.Split(',');
                for (int i = 0; i < ar.Length; i++)
                {
                    if (!string.IsNullOrEmpty(ar[i]))
                    {
                        MVCModels.MessagingModel objMsgUserModel = new MVCModels.MessagingModel();
                        objMsgUserModel.Company_Code = objCurInfo.GetCompanyCode();
                        objMsgUserModel.Msg_Code = msgCode;
                        objMsgUserModel.Target_Address = ar[i];
                        objMsgUserModel.Address_Type = "TO";
                        objMsgUserModel.Row_Status = "1";
                        objMsgUserModel.Project_Code = "MSGSYSTEM";
                        objMsgUserModel.Ack_Reqd = "N";
                        objMsgUserModel.IsRead = "0";
                        lstMsgUsers.Add(objMsgUserModel);
                    }
                }
                string[] arcc = ccUsers.Split(',');
                for (int i = 0; i < arcc.Length; i++)
                {
                    if (!string.IsNullOrEmpty(arcc[i]))
                    {
                        MVCModels.MessagingModel objMsgUserModel = new MVCModels.MessagingModel();
                        objMsgUserModel.Company_Code = objCurInfo.GetCompanyCode();
                        objMsgUserModel.Msg_Code = msgCode;
                        objMsgUserModel.Target_Address = arcc[i];
                        objMsgUserModel.Address_Type = "CC";
                        objMsgUserModel.Row_Status = "1";
                        objMsgUserModel.Project_Code = "MSGSYSTEM";
                        objMsgUserModel.Ack_Reqd = "N";
                        objMsgUserModel.IsRead = "0";
                        lstMsgUsers.Add(objMsgUserModel);
                    }
                }
                #endregion message user details

                int rowsAffected = 0;
                if ("DRAFTED" == sentType.ToUpper())
                {
                    //DRAFTED THEN SEND THE MSG
                    rowsAffected = objMsg.UpdateDraftedMail(objCurInfo.GetCompanyCode(), lstMsgContent, lstMsgUsers, msgCode);
                }
                else
                {
                    rowsAffected = objMsg.InsertSendOrDraftMail(objCurInfo.GetCompanyCode(), lstMsgContent, lstMsgUsers, sentStatus);
                    //REPLY, FORWARD, FORWARDALL MSG
                    //  rowsAffected = objMsg.InsertReplyOrForwardMail(objCurInfo.GetCompanyCode(), lstMsgContent, lstMsgUsers);
                }
                if (rowsAffected > 0)
                {
                    if (sentStatus.ToUpper().Trim() == "DRAFT")
                    {
                        result = "SUCCESS:" + msgCode + "~Your message has been drafted";
                    }
                    else
                    {
                        result = "SUCCESS:" + msgCode + "~Your message has been sent";
                    }
                }
                else
                {
                    result = "ERROR:" + msgCode + "~Sorry. Error while sennding the message ...";
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                result = "Sorry. Error while sennding the message ...";
            }
            return result;
        }

        public string UpdateAttachmentPath(string msgCode, string fileName, string columnName, string fileRemoved)
        {
            string result = string.Empty;
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                int rowsAffected = objMsg.UpdateAttachmentPath(objCurInfo.GetCompanyCode(), fileName, columnName, msgCode, fileRemoved);
                if (rowsAffected > 0)
                {
                    result = "SUCCESS:";
                }

                else
                {
                    result = "ERROR:";
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                result = "Sorry. Error while update the attachment file ...";
            }
            return result;
        }
        /// <summary>
        /// get next or previous message details
        /// </summary>
        /// <param name="msgCode"></param>
        /// <param name="mode"></param>
        /// <param name="mailMode"></param>
        /// <returns></returns>
        public string GetNextOrPreviousMsgCode(string msgCode, string mode, string mailMode)
        {
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string resultMsgCode = string.Empty;
            try
            {
                resultMsgCode = objMsg.GetPreviousOrNextMail(objCurInfo.GetCompanyCode(), msgCode, mode, objCurInfo.GetUserCode(), mailMode);
                if (string.IsNullOrEmpty(resultMsgCode))
                {
                    resultMsgCode = "NOMSG";
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return resultMsgCode;
        }
        #region attachment upload
        [HttpPost]
        public string UploadAttachment(FormCollection coll)
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                string companyCode = objCur.GetCompanyCode();
                string newFilename = string.Empty;
                var container = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(
                        ConfigurationManager.AppSettings["NBBLOBACCKEY"]).CreateCloudBlobClient()
                    .GetContainerReference(companyCode.ToLower());
                container.CreateIfNotExists();

                //int blocksCount = int.Parse(coll["blocksCount"].ToString());
                //string fileName = coll["fileName"].ToString();
                //long fileSize = long.Parse(coll["fileSize"].ToString());

                int blocksCount = int.Parse(coll["blocksCount"].ToString());
                string fileName = coll["fileName"].ToString();
                fileName = fileName.Substring(fileName.LastIndexOf("\\") + 1);
                newFilename = fileName;
                string fileExtenstion = fileName.Substring(fileName.LastIndexOf("."));
                long fileSize = long.Parse(coll["fileSize"].ToString());
                newFilename = newFilename.Substring(0, newFilename.LastIndexOf('.'));
                newFilename = newFilename.ToString().Trim().Replace(" ", "_");

                //Special Character are replaced.
                newFilename = Regex.Replace(newFilename, @"[^0-9a-zA-Z_]+", "_");

                fileName = newFilename + "_" + objCur.GetUserName() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + fileExtenstion;

                var fileToUpload = new MVCModels.CloudFile()
                {
                    BlockCount = blocksCount,
                    FileName = fileName,
                    Size = fileSize,
                    BlockBlob = container.GetBlockBlobReference(fileName),
                    StartTime = DateTime.Now,
                    IsUploadCompleted = false,
                    UploadStatusMessage = string.Empty
                };
                Session.Add("CurrentFile", fileToUpload);
                return fileName;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UploadChunk(int id)
        {
            try
            {
                HttpPostedFileBase request = Request.Files["Slice"];
                byte[] chunk = new byte[request.ContentLength];
                request.InputStream.Read(chunk, 0, Convert.ToInt32(request.ContentLength));
                JsonResult returnData = null;
                string fileSession = "CurrentFile";
                if (Session[fileSession] != null)
                {
                    MVCModels.CloudFile model = (MVCModels.CloudFile)Session[fileSession];
                    returnData = UploadCurrentChunk(model, chunk, id);
                    if (returnData != null)
                    {
                        return returnData;
                    }
                    if (id == model.BlockCount)
                    {
                        return CommitAllChunks(model);
                    }
                }
                else
                {
                    returnData = Json(new
                    {
                        error = true,
                        isLastBlock = false,
                        message = string.Format(CultureInfo.CurrentCulture,
                            "Failed to Upload file.", "Session Timed out")
                    });
                    return returnData;
                }

                return Json(new { error = false, isLastBlock = false, message = string.Empty });
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        private ActionResult CommitAllChunks(MVCModels.CloudFile model)
        {
            model.IsUploadCompleted = true;
            bool errorInOperation = false;
            try
            {
                var blockList = Enumerable.Range(1, (int)model.BlockCount).ToList<int>().ConvertAll(rangeElement =>
                            Convert.ToBase64String(Encoding.UTF8.GetBytes(
                                string.Format(CultureInfo.InvariantCulture, "{0:D4}", rangeElement))));
                model.BlockBlob.PutBlockList(blockList);
                var duration = DateTime.Now - model.StartTime;
                float fileSizeInKb = model.Size / 1024;
                string fileSizeMessage = fileSizeInKb > 1024 ?
                    string.Concat((fileSizeInKb / 1024).ToString(CultureInfo.CurrentCulture), " MB") :
                    string.Concat(fileSizeInKb.ToString(CultureInfo.CurrentCulture), " KB");
                model.UploadStatusMessage = string.Format(CultureInfo.CurrentCulture,
                    "File uploaded successfully. {0} took {1} seconds to upload",
                    fileSizeMessage, duration.TotalSeconds);
            }
            catch (Exception e)
            {
                model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                errorInOperation = true;

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(e, dicContext);
            }
            finally
            {

            }
            return Json(new
            {
                error = errorInOperation,
                isLastBlock = model.IsUploadCompleted,
                message = model.UploadStatusMessage
            });
        }
        private JsonResult UploadCurrentChunk(MVCModels.CloudFile model, byte[] chunk, int id)
        {
            try
            {
                using (var chunkStream = new MemoryStream(chunk))
                {
                    var blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(
                            string.Format(CultureInfo.InvariantCulture, "{0:D4}", id)));
                    try
                    {
                        model.BlockBlob.PutBlock(
                            blockId,
                            chunkStream, null, null,
                            new BlobRequestOptions()
                            {
                                RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(10), 3)
                            },
                            null);
                        return null;
                    }
                    catch (StorageException e)
                    {
                        Session.Remove("CurrentFile");
                        model.IsUploadCompleted = true;
                        model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                        return Json(new { error = true, isLastBlock = false, message = model.UploadStatusMessage });
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        #endregion attachment upload

        #region Messaging based on Division Selection
        public JsonResult GetDivisions()
        {
            DataControl.BLMessaging _objBlMsg = new DataControl.BLMessaging();
            DataControl.CurrentInfo _objcurInfo = new DataControl.CurrentInfo();
            DataControl.JSONConverter _objJsoncon = new DataControl.JSONConverter();
            List<MVCModels.MsdDivisionModel> lstDivisions = new List<MVCModels.MsdDivisionModel>();
            lstDivisions = (List<MVCModels.MsdDivisionModel>)_objBlMsg.GetDivisions(_objcurInfo.GetCompanyCode());
            return Json(_objJsoncon.Serialize(lstDivisions));
        }
        /// <summary>
        /// Get Entity code based on division
        /// </summary>
        /// <returns></returns>
        public JsonResult GetEntitycodebyDivision()
        {
            DataControl.BLMessaging _objBlMsg = new DataControl.BLMessaging();
            DataControl.CurrentInfo _objcurInfo = new DataControl.CurrentInfo();
            DataControl.JSONConverter _objJsoncon = new DataControl.JSONConverter();
            List<MVCModels.DivisionBasedModel> lstEntityDivisions = new List<MVCModels.DivisionBasedModel>();
            lstEntityDivisions = _objBlMsg.GetEntityCodebyDivision(_objcurInfo.GetCompanyCode()).ToList();
            return Json(_objJsoncon.Serialize(lstEntityDivisions));
        }
        #endregion Messaging based on Division Selection


        #region OBO Accessed

        public JsonResult GetOBOUsers(string TypeName, string UserCode = "")
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();

            if (string.IsNullOrEmpty(UserCode))
                UserCode = objCurInfo.GetUserCode();

            lstUser = objMsg.GetOBOUsers(objCurInfo.GetCompanyCode(), UserCode, TypeName).ToList();

            return Json(objJson.Serialize(lstUser));
        }

        #endregion

        #region OBO User Region Mapping
        public ActionResult OBOUserRegionMapping()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            ViewBag.Cur_Region_Code = _objcurrentInfo.GetRegionCode();
            ViewBag.Cur_User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        [HttpPost]
        public JsonResult OBOUserRegionInserMapping(string User_Code, string Type_Name, List<UserModel> lstUserMappingDetails)
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            string result = string.Empty;
            result = objMsg.InsertOBOMapping(_objcurrentInfo.GetCompanyCode(), User_Code, Type_Name, lstUserMappingDetails, _objcurrentInfo.GetUserCode());

            bool IsSuccess = false;
            string message = string.Empty;
            if (result.IndexOf(":") > 0)
            {
                if (result.Split(':')[0].ToLower() == "success")
                    IsSuccess = true;
                message = result.Split(':')[1];
            }
            return Json(new { Success = IsSuccess, message = message });

        }

        public JsonResult GetOBOChildUsersForMessaging(string UserCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();

            //if (string.IsNullOrEmpty(UserCode))
            string LoggingUserCode = objCurInfo.GetUserCode();

            lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objMsg.GetUsersForOBOMessaging(objCurInfo.GetCompanyCode(), UserCode, LoggingUserCode);
            string msgStartingUserType = string.Empty;
            return Json(objJson.Serialize(lstUser));
        }
        #endregion
    }
}
