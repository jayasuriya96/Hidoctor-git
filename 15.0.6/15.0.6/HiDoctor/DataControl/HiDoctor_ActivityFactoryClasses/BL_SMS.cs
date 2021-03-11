using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_SMS
    {
        DAL_SMS _objDALSMS = new DAL_SMS();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        /// <summary>
        /// this functions returns the list of scheduled dates for which
        /// the sms can be sent
        /// </summary>
        /// <param name="year"></param>
        /// <returns>List of Scheduled Dates</returns>
        public List<SMSScheduleDates> GetScheduleDates(int month, int year)
        {
            string Company_Code = string.Empty;
            string User_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            User_Code = _objCurrentInfo.GetUserCode();
            try
            {
                return _objDALSMS.GetScheduleDates(Company_Code, User_Code, month, year);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// this function gets the list of users and their related data 
        /// for whom the compliance report
        /// was generated for the selected date
        /// </summary>
        /// <param name="selected_date"></param>
        /// <returns>Compliance List for the selected date</returns>
        //public List<SMSReportModel> GetSMSComplianceReport(string selected_date, string user_Type_Name)
        public List<SMSReportModel> GetSMSComplianceReport(string selected_date)
        {
            string Company_Code = string.Empty;
            string Region_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            Region_Code = _objCurrentInfo.GetRegionCode();
            try
            {
                //return _objDALSMS.GetSMSComplianceReport(Company_Code, Region_Code, selected_date, user_Type_Name);
                return _objDALSMS.GetSMSComplianceReport(Company_Code, Region_Code, selected_date);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// gets list of sms users to whom sms has been sent for
        /// the selected date
        /// </summary>
        /// <param name="selected_date"></param>
        /// <returns>list of users</returns>

        public List<SMSReportModel> GetSentSMSDetails(string selected_date)
        {
            string Company_Code = string.Empty;
            string Region_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            Region_Code = _objCurrentInfo.GetRegionCode();
            try
            {
                return _objDALSMS.GetSentSMSDetails(Company_Code, Region_Code, selected_date);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<SMSSentLog> GetSentLogs(int Alert_Sent_Log_Id)
        {
            try
            {
                return _objDALSMS.GetSentLogs(Alert_Sent_Log_Id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<SMSUserTypes> GetUserTypes()
        {
            string Company_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            try
            {
                return _objDALSMS.GetUserTypes(Company_Code);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
