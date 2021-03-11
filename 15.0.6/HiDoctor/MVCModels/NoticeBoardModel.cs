using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class NoticeBoardModel
    {
        public string MsgCode { get; set; }
        public char MsgDistributionType { get; set; }
        public string MsgTitle { get; set; }
        public string MsgBody { get; set; }
        public string MsgHyperlink { get; set; }
        public int MsgPriority { get; set; }
        public string MsgValidFrom { get; set; }
        public string MsgValidTo { get; set; }
        public string MsgSenderUserCode { get; set; }
        public char MsgAcknowlendgementReqd { get; set; }
        public char MsgApprovalStatus { get; set; }
        public string MsgAttachmentPath { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string SHOW_IN_TICKER_ONLY { get; set; }
        public string HIGHLIGHT { get; set; }
        public string Company_Code { get; set; }

        public List<NoticeBoardAgent> lstNoticeBoardAgent = new List<NoticeBoardAgent>();
    }

    public class NoticeBoardAgent
    {
        public string MsgCode { get; set; }
        public string MsgTargetUserCode { get; set; }
        public char MsgIsRead { get; set; }
        public string Employee_Name { get; set; }
    }

    public class NoticeBoardContentModel
    {
        public string Company_Code { get; set; }
        public string Msg_Code { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string User_Name { get; set; }
        public string FilePath { get; set; }
        public string Sender { get; set; }
        public string Author { get; set; }
        public string Active_From { get; set; }
        public string Active_To { get; set; }
        public string Is_Read { get; set; }
        public string Hyperlink { get; set; }
        public string HIGHLIGHT { get; set; }
        public string Employee_Name { get; set; }
    }
    public class NoticeBoardContentMSGModel
    {
        public string Company_Code { get; set; }
        public string Msg_Code { get; set; }
        public string Subject { get; set; }
        public string Message_Content { get; set; }
        public string Attachment_Path1 { get; set; }
        public string Attachment_Path2 { get; set; }
        public string Attachment_Path3 { get; set; }
        public string Attachment_Path4 { get; set; }
        public string Attachment_Path5 { get; set; }
        public string Sender { get; set; }
        public string Date_From { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
    }

    public class UserDivisionWise
    {
        public string Company_Code { get; set; }
        public string User_code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string Divison_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }


    }

    public class userList
    {
        public List<UserDivisionWise> lstUserDetail { get; set; }
    }


    public class DcrLockDetail
    {
        public string User_Code { get; set; }
        public string LockedDate { get; set; }
        public string Released_Date { get; set; }
        public string Lock_Status { get; set; }
        public string Released_By { get; set; }
        public string Record_Status { get; set; }
        public string Lock_Type { get; set; }
        public string Lock_Reason { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Activity_Flag { get; set; }
        public string Unapprove_Reason { get; set; }
        public string User_Name { get; set; }
        public int No_Of_DCR_Locked { get; set; }
        public string TP_Month { get; set; }
        public string TP_Year { get; set; }   
    }

    public class NoticeContentforUserModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Msg_Code { get; set; }
        public string Title { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Asigned_User_Code { get; set; }     
    }
    public class UserGroupHistory
    {
        public List<MVCModels.GroupSeq> GROUP_SEQ { get; set; }
        public List<MVCModels.UserGroup> User_Name { get; set; }
    }

    public class UserGroup
    {
        public int Group_ID { get; set; }
        public string Group_Name { get; set; }
        public string Created_Date { get; set; }
        public string Created_By { get; set; }
        public string Status { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string HistoryUser_Name { get; set; }
        public string Edit { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Status { get; set; }
    }
    public class GroupSeq
    {
        public string GROUP_SEQ { get; set; }
        public string Updated_Date { get; set; }
        public string Edit { get; set; }
    }
    public class GroupUpdatedHistory
    {
        public int Group_ID { get; set; }
        public string Group_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Updated_Date { get; set; }
        public string Created_Date { get; set; }
        public int GROUP_SEQ { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Status { get; set; }
    }
    public class UserCodeTree
    {
        public string Entity_Code { get; set; }
    }
}
