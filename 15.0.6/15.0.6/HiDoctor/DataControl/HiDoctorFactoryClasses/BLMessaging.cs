using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLMessaging
    {
        DALMessaging objMsg;
        /// <summary>
        /// get unread and drafted count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the unread and drafted count</returns>
        public DataSet GetMessageCount(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMessageCount(companyCode, userCode);
        }

        /// <summary>
        /// get the message inbox content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetMsgInboxContent(string companyCode, string userCode, int pageNumber,
           int pageSize, string searchWord, ref int totalPageCount)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMsgInboxContent(companyCode, userCode, pageNumber, pageSize, searchWord, ref totalPageCount);
        }
        /// <summary>
        /// get the child user details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of child user details</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetChildUsers(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetChildUsers(companyCode, userCode);
        }
        /// <summary>
        /// get the message sent content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetMsgSentContent(string companyCode, string userCode, int pageNumber, int pageSize,
            string searchWord, ref int totalPageCount)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMsgSentContent(companyCode, userCode, pageNumber, pageSize, searchWord, ref totalPageCount);
        }

        /// <summary>
        /// Get the Message for Unread Content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param> 
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of unread msg content </returns> 
        public IEnumerable<MVCModels.MessagingModel> GetMsgUnreadContent(string companyCode, string userCode, int pageNumber, int pageSize,
           string searchWord, ref int totalPageCount)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMsgUnreadContent(companyCode, userCode, pageNumber, pageSize, searchWord, ref totalPageCount);
        }


        /// <summary>
        /// get the message deleted content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param> 
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetMsgDeletedContent(string companyCode, string userCode, int pageNumber, int pageSize,
            string searchWord, ref int totalPageCount)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMsgDeletedContent(companyCode, userCode, pageNumber, pageSize, searchWord, ref totalPageCount);
        }

        /// <summary>
        /// get the message drafted content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetMsgDraftedContent(string companyCode, string userCode, int pageNumber, int pageSize,
            string searchWord, ref int totalPageCount)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMsgDraftedContent(companyCode, userCode, pageNumber, pageSize, searchWord, ref totalPageCount);
        }

        /// <summary>
        /// get the selected msg details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the selected msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetSelectedMsgDetails(string companyCode, string msgCode, string targetAddress)
        {
            objMsg = new DALMessaging();
            return objMsg.GetSelectedMsgDetails(companyCode, msgCode, targetAddress);
        }

        /// <summary>
        /// get the selected msg details only header
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the selected msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetSelectedMessageDetails(string companyCode, string msgCode, string user_Code)
        {
            objMsg = new DALMessaging();
            return objMsg.GetSelectedMessageDetails(companyCode, msgCode, user_Code);
        }

        /// <summary>
        /// update the message status as read or unread
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsg"></param>
        /// <param name="isRead"></param>
        /// <returns>returns the no of rows affected </returns>
        public int UpdateMsgReadStatus(string companyCode, List<MVCModels.MessagingModel> lstMsg, string isRead)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateMsgReadStatus(companyCode, lstMsg, isRead);
        }

        /// <summary>
        /// update the message status
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsg"></param>
        /// <param name="msgStatus"></param>
        /// <returns>returns the rows affected </returns>
        public int UpdateMsgStatus(string companyCode, List<MVCModels.MessagingModel> lstMsg, string msgStatus)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateMsgStatus(companyCode, lstMsg, msgStatus);
        }
        /// <summary>
        /// insert the message
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsgContent"></param>
        /// <param name="lstMsgUsers"></param>
        /// <returns>returns the no of rows inserted</returns>
        public int InsertSendOrDraftMail(string companyCode, List<MVCModels.MessagingModel> lstMsgContent, List<MVCModels.MessagingModel> lstMsgUsers,
             string mode)
        {
            objMsg = new DALMessaging();
            return objMsg.InsertSendOrDraftMail(companyCode, lstMsgContent, lstMsgUsers, mode);
        }
        /// <summary>
        /// Insert reply and forward mail details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsgContent"></param>
        /// <param name="lstMsgUsers"></param>
        /// <returns>retuns the no of rows inserted </returns>
        public int InsertReplyOrForwardMail(string companyCode, List<MVCModels.MessagingModel> lstMsgContent, List<MVCModels.MessagingModel> lstMsgUsers)
        {
            objMsg = new DALMessaging();
            return objMsg.InsertReplyOrForwardMail(companyCode, lstMsgContent, lstMsgUsers);
        }
        /// <summary>
        /// Get Msg code
        /// </summary>
        /// <param name="objName"></param>
        /// <returns></returns>

        public long GetSeqNumber(string objName)
        {
            objMsg = new DALMessaging();
            return objMsg.GetSeqNumber(objName);
        }
        /// <summary>
        /// update attachemnt filepath
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="fileName"></param>
        /// <param name="columnName"></param>
        /// <param name="msgCode"></param>
        /// <returns></returns>
        public int UpdateAttachmentPath(string companyCode, string fileName, string columnName, string msgCode, string removedFile)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateAttachmentPath(companyCode, fileName, columnName, msgCode, removedFile);
        }

        /// <summary>
        /// update the message
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsgContent"></param>
        /// <param name="lstMsgUsers"></param>
        /// <param name="msgCode"></param>
        /// <returns>returns the no of rows inserted</returns>
        public int UpdateDraftedMail(string companyCode, List<MVCModels.MessagingModel> lstMsgContent, List<MVCModels.MessagingModel> lstMsgUsers, string msgCode)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateDraftedMail(companyCode, lstMsgContent, lstMsgUsers, msgCode);
        }
        /// <summary>
        /// get next or previous message details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="msgCode"></param>
        /// <param name="mode"></param>
        /// <param name="userCode"></param>
        /// <param name="mailMode"></param>
        /// <returns></returns>
        public string GetPreviousOrNextMail(string companyCode, string msgCode, string mode, string userCode, string mailMode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetPreviousOrNextMail(companyCode, msgCode, mode, userCode, mailMode);
        }

        // Messges
        public int GetUnreadMessageCount(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetUnreadMessageCount(companyCode, userCode);
        }

        public IEnumerable<MVCModels.MessagingModel> GetMessagesForUser(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetMessagesForUser(companyCode, userCode);
        }
        public IEnumerable<MVCModels.MessagingModel> GetPreviousAndNextMsgCode(string companyCode, string userCode, string msgCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetPreviousAndNextMsgCode(companyCode, userCode, msgCode);
        }
        //
        //Notification
        public int GetUnreadAnnouncementCount(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetUnreadAnnouncementCount(companyCode, userCode);
        }

        public IEnumerable<MVCModels.NoticeboardAgentMSGModel> GetAnnouncementForUser(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetAnnouncementForUser(companyCode, userCode);
        }
        public IEnumerable<MVCModels.NoticeboardAgentMSGModel> GetPreviousAndNextAnnouncementCode(string companyCode, string userCode, string msgCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetPreviousAndNextAnnouncementCode(companyCode, userCode, msgCode);
        }

        /// <summary>
        /// get the uses for messaging
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of child user details</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersForMessaging(string companyCode, string userCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetUsersForMessaging(companyCode, userCode);
        }

        /// <summary>
        /// update the message status
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsg"></param>
        /// <param name="msgStatus"></param>
        /// <returns>returns the rows affected </returns>
        public int UpdateMsgStatusOtherthanInbox(string companyCode, List<MVCModels.MessagingModel> lstMsg, string msgStatus)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateMsgStatusOtherthanInbox(companyCode, lstMsg, msgStatus);
        }

        public int UpdateSentMsgStatus(string companyCode, List<MVCModels.MessagingModel> lstMsg, string msgStatus)
        {
            objMsg = new DALMessaging();
            return objMsg.UpdateSentMsgStatus(companyCode, lstMsg, msgStatus);
        }

        /// <summary>
        /// Get Active Division Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.MsdDivisionModel> GetDivisions(string companyCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetDivisions(companyCode);
        }
        /// <summary>
        /// Get Entity code based on division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.DivisionBasedModel> GetEntityCodebyDivision(string companyCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetEntityCodebyDivision(companyCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetOBOUsers(string companyCode, string userCode, string TypeName)
        {
            objMsg = new DALMessaging();
            return objMsg.GetOBOUsers(companyCode, userCode, TypeName);
        }
        public string InsertOBOMapping(string companyCode, string userCode, string TypeName, List<MVCModels.HiDoctor_Master.UserModel> lstUserMappingDetails, string Created_By)
        {
            objMsg = new DALMessaging();
            return objMsg.InsertOBOMapping(companyCode, userCode, TypeName, lstUserMappingDetails, Created_By);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersForOBOMessaging(string companyCode, string userCode,string LoginUserCode)
        {
            objMsg = new DALMessaging();
            return objMsg.GetUsersForOBOMessaging(companyCode, userCode, LoginUserCode);
        }
    }
}
