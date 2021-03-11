using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class SMSReport
    {
        public List<SMSReportModel> lstModel { get; set; }
    }
    public class SMSReportModel
    {
        public int Row_No { get; set; }
        public int ReportGenerateId { get; set; }
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string SMS_To_Be_Sent_User_Code { get; set; }
        public string SMS_To_Be_Sent_User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Employee_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Mobile_Number { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string Sup_Manager_Emp_Name { get; set; }
        public int TotalDoctor { get; set; }
        public int TotalV3Doctor { get; set; }
        public int TotalV2Doctor { get; set; }
        public int TotalV1Doctor { get; set; }
        public int V3GT { get; set; }
        public int V3EQ { get; set; }
        public int V3_2 { get; set; }
        public int V3_1 { get; set; }
        public int V2GT { get; set; }
        public int V2EQ { get; set; }
        public int V2_1 { get; set; }
        public int V1Gt { get; set; }
        public int V1EQ { get; set; }
        public string Message { get; set; }
        public string SMS_Url { get; set; }
        public int Alert_Sent_Log_Id { get; set; }
        public int SMS_Sent_Count { get; set; }
        public string SMS_Failure_Reason { get; set; }
    }

    public class SMSScheduleDates
    {
        public string Company_Code { get; set; }
        public int schedule_day { get; set; }
    }

    public class SMSProviderModel
    {
        public string Company_Code { get; set; }
        public string Division_Code { get; set; }
        public string SMS_Api_Key { get; set; }
        public string SMS_Api_Name { get; set; }
        public string SMS_Api_Provider { get; set; }
        public string SMS_Api_Type { get; set; }
        public string User_Name { get; set; }
        public string SMS_Api_Url { get; set; }
    }

    public class SMSSentLog
    {
        public string User_Name { get; set; }
        public string Sent_Date { get; set; }
        public string Mobile { get; set; }
        public string Sent_Status { get; set; }
    }

    public class SMSUserTypes
    {
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }
}
