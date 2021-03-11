using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using MVCModels;
using System.Net;
using System.IO;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class SMSSender
    {
        DAL_SMS _objDALSMS = new DAL_SMS();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        /// <summary>
        /// gets the url from GetProviderInfo
        /// sends the url and the list of users to SendSMS
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>sent sms success count and failure count</returns>
        public string GetSMSSender(SMSReport obj)
        {
            return SendSMS(obj.lstModel);
        }

        /// <summary>
        /// this function is used to send sms to the selected users
        /// </summary>
        /// <param name="url"></param>
        /// <param name="lst"></param>
        /// <returns>success count and failure count in the form of string</returns>

        public string SendSMS(List<SMSReportModel> lst)
        {
            string result = string.Empty;
            int successcount = 0;
            int failurecount = 0;
            try
            {
                Regex regExInt = new Regex("^([0-9]*)$");
                int intermediateResult = 0;

                foreach (var item in lst)
                {
                    if (item.Mobile_Number != null)
                    {
                        if (item.Mobile_Number.Length == 10 && regExInt.IsMatch(item.Mobile_Number))
                        {
                            HttpWebRequest request = (HttpWebRequest)
                                        WebRequest.Create(item.SMS_Url + item.Mobile_Number + "&msg=" + item.Message + "&sid=HIDOCT&dtNow=" + DateTime.Now.ToString("yyyy-MM-dd") + "");

                            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                            using (Stream responseStream = response.GetResponseStream())
                            {
                                using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                                {
                                    string strSMSResponseString = string.Empty;
                                    strSMSResponseString = readStream.ReadToEnd();
                                    var responseLength = strSMSResponseString.Length - 6;
                                    if (strSMSResponseString.StartsWith("100"))
                                    {
                                        successcount++;
                                        intermediateResult = UpdateMessage(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Message, item.Division_Code);
                                        if (intermediateResult == 1)
                                        {
                                            smsLogger(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Mobile_Number, strSMSResponseString.Substring(0, 3), "", 1, item.Division_Code);
                                        }
                                        else
                                        {
                                            failurecount++;
                                            smsLogger(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Mobile_Number, "-1",
                                                "Failed to insert SMS Log", 0, item.Division_Code);
                                        }
                                    }
                                    else
                                    {
                                        failurecount++;
                                        smsLogger(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Mobile_Number, strSMSResponseString.Substring(0, 3),
                                            strSMSResponseString.Substring(6, responseLength), 0, item.Division_Code);
                                    }
                                }
                            }
                        }
                        else
                        {
                            failurecount++;
                            smsLogger(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Mobile_Number, "-1",
                                            "Length of Mobile Number is not equal to 10", 0, item.Division_Code);
                        }
                    }
                    else
                    {
                        failurecount++;
                        smsLogger(item.Alert_Sent_Log_Id, item.ReportGenerateId, item.SMS_To_Be_Sent_User_Code, item.Mobile_Number, "-1",
                                            "Mobile Number does not exists for the user", 0, item.Division_Code);
                    }
                }
                result = "The SMS has been successfully sent to : " + successcount + " users. The sms failed to be delivered to : " + failurecount + " users.";
            }
            catch (Exception ex)
            {
                result = "There seems to be some technical issue with the SMS Service Provider. Please try again after some time.";
                result = result + "</br> Number of SMS tried to send till now :" + (successcount + failurecount) + ".";
                result = result + "</br> The SMS has been successfully sent to : " + successcount + " users. The sms failed to be delivered to : " + failurecount + " users.";
                result = result + "|" + ex;
                return result;
                throw ex;
            }
            return result;
        }

        /// <summary>
        /// this functions updates message sent column based
        /// on the below mentioned parameters
        /// </summary>
        /// <param name="ReportGenerateId"></param>
        /// <param name="User_Code"></param>
        /// <param name="Message"></param>
        /// <returns>0 or 1 (failure or success)</returns>
        public int UpdateMessage(int Alert_Sent_Log_Id, int ReportGenerateId, string User_Code, string Message, string Division_Code)
        {
            int result = 0;
            try
            {
                result = _objDALSMS.UpdateMessage(Alert_Sent_Log_Id, ReportGenerateId, User_Code, Message, Division_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        /// <summary>
        /// logs the sent sms
        /// </summary>
        /// <param name="ReportGenerateId"></param>
        /// <param name="User_Code"></param>
        /// <param name="Mobile_Number"></param>
        /// <param name="response_Code"></param>
        /// <param name="response_Message"></param>
        /// <param name="sent_Status"></param>
        /// <returns>0 or 1 (failure or success)</returns>
        public int smsLogger(int Alert_Sent_Log_Id, int ReportGenerateId, string User_Code, string Mobile_Number, string response_Code, string response_Message, int sent_Status, string Division_Code)
        {
            int result = 0;
            try
            {
                result = _objDALSMS.smsLogger(Alert_Sent_Log_Id, ReportGenerateId, User_Code, Mobile_Number, response_Code, response_Message, sent_Status, Division_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
    }
}
