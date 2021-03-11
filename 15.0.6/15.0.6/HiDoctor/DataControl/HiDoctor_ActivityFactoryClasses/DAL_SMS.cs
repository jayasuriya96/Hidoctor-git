using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_SMS : DapperRepository
    {
        Data _objData = new Data();

        const string SP_HD_GetScheduleDates = "SP_HD_GetScheduleDates";
        const string SP_HD_SMS_GetComplianceDetails = "SP_HD_SMS_GetComplianceDetails";
        const string SP_HD_SMS_GetSentSMSDetails = "SP_HD_SMS_GetSentSMSDetails";
        const string SP_HD_SMS_Provider = "SP_HD_SMS_Provider";
        const string SP_HD_Update_Compliance_Alerts_Log = "SP_HD_Update_Compliance_Alerts_Log";
        const string SP_HD_Insert_Compliance_Sent_Alerts_Logs = "SP_HD_Insert_Compliance_Sent_Alerts_Logs";
        const string SP_HD_SMS_GetSentSMSLogs = "SP_HD_SMS_GetSentSMSLogs";
        const string SP_hd_User_Type_Select = "SP_hd_User_Type_Select";
        const string SP_hd_User_Type_Select_sms_compliance_alerts_log = "SP_hd_User_Type_Select_sms_compliance_alerts_log";


        public List<SMSScheduleDates> GetScheduleDates(string Company_Code, string User_Code, int month, int year)
        {
            List<SMSScheduleDates> lstSchedule_Dates = new List<SMSScheduleDates>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstSchedule_Dates = connection.Query<SMSScheduleDates>(SP_HD_GetScheduleDates, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstSchedule_Dates;
        }

        //public List<SMSReportModel> GetSMSComplianceReport(string Company_Code, string Region_Code, string selected_date, string user_Type_Name)
        public List<SMSReportModel> GetSMSComplianceReport(string Company_Code, string Region_Code, string selected_date)
        {
            List<SMSReportModel> lstSMSComplianceDetails = new List<SMSReportModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@selected_date", selected_date);
                    //p.Add("@User_Type_Name", user_Type_Name);
                    lstSMSComplianceDetails = connection.Query<SMSReportModel>(SP_HD_SMS_GetComplianceDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstSMSComplianceDetails;
        }

        public List<SMSReportModel> GetSentSMSDetails(string Company_Code, string Region_Code, string selected_date)
        {
            List<SMSReportModel> lstSentSMS = new List<SMSReportModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@selected_date", selected_date);
                    lstSentSMS = connection.Query<SMSReportModel>(SP_HD_SMS_GetSentSMSDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstSentSMS;
        }

        public int UpdateMessage(int Alert_Sent_Log_Id, int ReportGenerateId, string User_Code, string Message, string Division_Code)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@ReportGenerateId", ReportGenerateId);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Message", Message);
                    p.Add("@Division_Code", Division_Code);
                    p.Add("@Alert_Sent_Log_Id", Alert_Sent_Log_Id);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_Update_Compliance_Alerts_Log, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public int smsLogger(int Alert_Sent_Log_Id, int ReportGenerateId, string User_Code, string Mobile_Number, string response_Code, string response_Message, int sent_Status, string Division_Code)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@ReportGenerateId", ReportGenerateId);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Mobile_Number", Mobile_Number);
                    p.Add("@response_Code", response_Code);
                    p.Add("@response_Message", response_Message);
                    p.Add("@sent_Status", sent_Status);
                    p.Add("@Division_Code", Division_Code);
                    p.Add("@Alert_Sent_Log_Id", Alert_Sent_Log_Id);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_Insert_Compliance_Sent_Alerts_Logs, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<SMSSentLog> GetSentLogs(int Alert_Sent_Log_Id)
        {
            List<SMSSentLog> lstSentLogs = new List<SMSSentLog>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Alert_Sent_Log_Id", Alert_Sent_Log_Id);
                    lstSentLogs = connection.Query<SMSSentLog>(SP_HD_SMS_GetSentSMSLogs, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstSentLogs;
        }

        public List<SMSUserTypes> GetUserTypes(string Company_Code)
        {
            List<SMSUserTypes> lstUserTypes = new List<SMSUserTypes>();
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    lstUserTypes = connection.Query<SMSUserTypes>(SP_hd_User_Type_Select_sms_compliance_alerts_log, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return lstUserTypes;
        }
    }
}
