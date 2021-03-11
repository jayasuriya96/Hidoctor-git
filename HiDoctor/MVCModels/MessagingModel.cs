using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MessagingModel
    {
        public string Company_Code { get; set; }
        public string Msg_Code { get; set; }
        public string Subject { get; set; }
        public string Message_Content { get; set; }
        public string Is_Richtext { get; set; }
        public string Priority { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Sender { get; set; }
        public string Distribution_Type { get; set; }
        public string Ack_Reqd { get; set; }
        public string Approved { get; set; }
        public string Hyperlink { get; set; }
        public string Attachment_Path1 { get; set; }
        public string Attachment_Path2 { get; set; }
        public string Attachment_Path3 { get; set; }
        public string Attachment_Path4 { get; set; }
        public string Attachment_Path5 { get; set; }
        public string Row_Status { get; set; }
        public string Sent_Status { get; set; }
        public string Sent_Type { get; set; }
        public string User_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Target_Address { get; set; }
        public string Address_Type { get; set; }
        public string IsRead { get; set; }
        public string User_Name { get; set; }
        public string Email_id { get; set; }
        public string To_Employee_Name { get; set; }
        public string Project_Code { get; set; }
        public string Msg_Date { get; set; }
        public string Previous_Msg_Code { get; set; }
        public string Next_Msg_Code { get; set; }
        public string To_User_Name { get; set; }
    }

    //public class NoticeboardContentMSGModel
    //{
    //    public string Company_Code { get; set; }
    //    public string Msg_Code { get; set; }
    //    public string Subject { get; set; }
    //    public string Message_Content { get; set; }
    //    public string Is_Richtext { get; set; }
    //    public string Priority { get; set; }
    //    public string Date_From { get; set; }
    //    public string Date_To { get; set; }
    //    public string Sender { get; set; }
    //    public string Distribution_Type { get; set; }
    //    public string Ack_Reqd { get; set; }
    //    public string Approved { get; set; }
    //    public string Hyperlink { get; set; }
    //    public string Attachment_Path1 { get; set; }
    //    public string Attachment_Path2 { get; set; }
    //    public string Attachment_Path3 { get; set; }
    //    public string Attachment_Path4 { get; set; }
    //    public string Attachment_Path5 { get; set; }
    //    public string Row_Status { get; set; }
    //    public string Sent_Status { get; set; }
    //    public string Sent_Type { get; set; }
    //    public string User_Code { get; set; }
    //    public string Employee_Name { get; set; }
    //    public string Target_Address { get; set; }
    //    public string Address_Type { get; set; }
    //    public string IsRead { get; set; }
    //    public string User_Name { get; set; }
    //}

    public class NoticeboardAgentMSGModel
    {
        public string Company_Code { get; set; }
        public string Msg_Code { get; set; }
        public string Target_Address { get; set; }
        public string Address_Type { get; set; }
        public string Ack_Reqd { get; set; }
        public string IsRead { get; set; }
        public string Agent_Type { get; set; }
        public string Status_Code { get; set; }
        public string Reminder_Type { get; set; }
        public string Reminder_Name { get; set; }
        public string Description { get; set; }
        public string Reminder_For_Date { get; set; }
        public string Reminder_On_Date { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Row_Status { get; set; }
        public string Project_Code { get; set; }
        public string Sender { get; set; }
        public string Title { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Previous_Announcement_Code { get; set; }
        public string Next_Announcement_Code { get; set; }
        public string Employee_Name { get; set; }
    }

    public class MsdDivisionModel
    {
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
        public string Entity_Code { get; set; }
     }

    public class DivisionBasedModel
    {
        public string Division_Code { get; set; }
        public string Entity_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string Region_Type_Code { get; set; }
    }
}
