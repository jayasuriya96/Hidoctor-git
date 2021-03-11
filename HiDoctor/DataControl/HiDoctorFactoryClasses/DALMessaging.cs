using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;

namespace DataControl
{
    public class DALMessaging : DapperRepository
    {
        SPData _objSPData;
        Data _objData;

        #region Constant Strings
        const string SP_HDGETMSGCOUNT = "SP_hdGetMsgCount";
        const string SP_HDGETINBOXMSGCONTENT = "SP_hdGetInboxMsgContent";
        const string SP_HDGETCHILDUSERDETAILS = "SP_hdGetChildUserDetails";
        const string SP_HDGETSENTMSGCONTENT = "SP_hdGetSentMsgContent";
        const string SP_hdGetUnreadMsgContent = "SP_hdGetUnreadMsgContent";
        const string SP_HDGETDELETEDMSGCONTENT = "SP_hdGetDeletedMsgContent";
        const string SP_HDGETDRAFTMSGCONTENT = "SP_hdGetDraftMsgContent";
        const string SP_HDGETSELECTEDMSGDETAILS = "SP_hdGetSelectedMsgDetails";
        const string SP_hdGetMessagesForUser = "SP_hdGetMessagesForUser";
        const string SP_hdGetPreviousAndNextMsgCode = "SP_hdGetPreviousAndNextMsgCode";
        const string SP_hdGetAnnouncementForUser = "SP_hdGetAnnouncementForUser";
        const string SP_hdGetPreviousAndNextAnnouncementCode = "SP_hdGetPreviousAndNextAnnouncementCode";
        const string SP_HDGETNEXTORPREVIOUSMSGDETAILS = "SP_hdGetNextOrPreviousMsgDetails";
        const string SP_HDGETUSERSFORMESSAGING = "SP_hdGetUsersForMessaging";
        const string SP_hdGetSelectedMessageDetails = "SP_hdGetSelectedMessageDetails";
        const string USP_OBO_GETACCESSUSERDETAILS = "USP_OBO_GETACCESSUSERDETAILS";

        //Division Based selection
        const string SP_HD_MSG_GETDIVISIONS = "SP_HD_MSG_GetDivisions";
        const string SP_HD_GETUSERBASEDONDIVISION = "SP_HD_GetUserbasedonDivision";
        const string SP_hdGetUsersForOBOMessaging = "SP_hdGetUsersForOBOMessaging";
        #endregion  Constant Strings
        /// <summary>
        /// get unread and drafted count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the unread and drafted count</returns>
        public DataSet GetMessageCount(string companyCode, string userCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETMSGCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }

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
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Word", searchWord);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETINBOXMSGCONTENT, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        /// <summary>
        /// get the child user details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of child user details</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetChildUsers(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUsers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUsers = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETCHILDUSERDETAILS,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstUsers;
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
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Word", searchWord);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETSENTMSGCONTENT, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    //lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETSENTMSGCONTENT,
                    //              new { Company_Code = companyCode, User_Code = userCode },
                    //              commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        /// <summary>
        /// get the message UnRead content
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of UnRead msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetMsgUnreadContent(string companyCode, string userCode, int pageNumber, int pageSize,
            string searchWord, ref int totalPageCount)
        {
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Word", searchWord);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_hdGetUnreadMsgContent, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
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
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Word", searchWord);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETDELETEDMSGCONTENT, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");

                    //lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETDELETEDMSGCONTENT,
                    //              new { Company_Code = companyCode, User_Code = userCode },
                    //              commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
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
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Word", searchWord);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETDRAFTMSGCONTENT, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    //lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETDRAFTMSGCONTENT,
                    //              new { Company_Code = companyCode, User_Code = userCode },
                    //              commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        /// <summary>
        /// get the selected msg details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the selected msg content </returns>
        public IEnumerable<MVCModels.MessagingModel> GetSelectedMsgDetails(string companyCode, string msgCode, string targetAddress)
        {
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETSELECTEDMSGDETAILS,
                                  new { Company_Code = companyCode, Msg_Code = msgCode, Target_Address = targetAddress },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("msgCode", msgCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.MessagingModel> GetSelectedMessageDetails(string companyCode, string msgCode, string user_Code)
        {
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_hdGetSelectedMessageDetails,
                                  new { Company_Code = companyCode, Msg_Code = msgCode, User_Code = user_Code },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("msgCode", msgCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
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

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Noticeboard_Agent_MSG SET Row_Status='1',IsRead='" + isRead + "' " +
                                   "WHERE Company_Code=@Company_Code AND Msg_Code=@Msg_Code AND Target_Address=@Target_Address";
                    rowsAffected = connection.Execute(query, lstMsg, transaction: trans);

                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Noticeboard_Agent_MSG SET Row_Status='" + msgStatus + "' " +
                                   "WHERE Company_Code=@Company_Code AND Msg_Code=@Msg_Code AND Target_Address=@Target_Address";
                    rowsAffected = connection.Execute(query, lstMsg, transaction: trans);

                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }

        /// <summary>
        /// update the message status
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstMsg"></param>
        /// <param name="msgStatus"></param>
        /// <returns>returns the rows affected </returns>
        public int UpdateSentMsgStatus(string companyCode, List<MVCModels.MessagingModel> lstMsg, string msgStatus)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Noticeboard_Content_MSG SET Sent_Status='DELETED' " +
                                   "WHERE Company_Code=@Company_Code AND Msg_Code=@Msg_Code AND Sender=@Sender";
                    rowsAffected = connection.Execute(query, lstMsg, transaction: trans);

                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Noticeboard_Agent_MSG SET Row_Status='" + msgStatus + "' " +
                                   "WHERE Company_Code=@Company_Code AND Msg_Code=@Msg_Code";
                    rowsAffected = connection.Execute(query, lstMsg, transaction: trans);

                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("DRAFT" == mode.ToUpper())
                    {
                        const string agentQuery = "DELETE FROM tbl_SFA_Noticeboard_Agent_MSG WHERE Company_Code=@Company_Code " +
                                               "AND Msg_Code=@Msg_Code";
                        rowsAffected = connection.Execute(agentQuery, lstMsgContent, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            string contentQuery = "UPDATE tbl_SFA_Noticeboard_Content_MSG SET Subject=@Subject,Message_Content=@Message_Content " +
                                      " WHERE Company_Code=@Company_Code " +
                                      "AND Msg_Code=@Msg_Code";
                            rowsAffected = connection.Execute(contentQuery, lstMsgContent, transaction: trans);
                        }
                        else
                        {
                            const string query = "INSERT INTO tbl_SFA_Noticeboard_Content_MSG(Company_Code,Msg_Code,Subject,Message_Content, " +
                                      "Is_Richtext,Priority,Date_From,Sender,Attachment_Path1,Attachment_Path2,Attachment_Path3, " +
                                      "Attachment_Path4,Attachment_Path5,Sent_Status,Sent_Type,Row_Status)" +
                                      "VALUES (@Company_Code,@Msg_Code,@Subject,@Message_Content, " +
                                      "@Is_Richtext,@Priority,GETDATE(),@Sender,@Attachment_Path1,@Attachment_Path2,@Attachment_Path3, " +
                                      "@Attachment_Path4,@Attachment_Path5,@Sent_Status,@Sent_Type,@Row_Status)";
                            rowsAffected = connection.Execute(query, lstMsgContent, transaction: trans);
                        }
                    }
                    else
                    {
                        const string query = "INSERT INTO tbl_SFA_Noticeboard_Content_MSG(Company_Code,Msg_Code,Subject,Message_Content, " +
                                       "Is_Richtext,Priority,Date_From,Sender,Attachment_Path1,Attachment_Path2,Attachment_Path3, " +
                                       "Attachment_Path4,Attachment_Path5,Sent_Status,Sent_Type,Row_Status)" +
                                       "VALUES (@Company_Code,@Msg_Code,@Subject,@Message_Content, " +
                                       "@Is_Richtext,@Priority,GETDATE(),@Sender,@Attachment_Path1,@Attachment_Path2,@Attachment_Path3, " +
                                       "@Attachment_Path4,@Attachment_Path5,@Sent_Status,@Sent_Type,@Row_Status)";
                        rowsAffected = connection.Execute(query, lstMsgContent, transaction: trans);
                    }
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string agentQuery = "INSERT INTO tbl_SFA_Noticeboard_Agent_MSG(Company_Code,Msg_Code,Target_Address, " +
                                                  "Address_Type,Row_Status,Project_Code,Ack_Reqd,IsRead)" +
                                                  "values(@Company_Code,@Msg_Code,@Target_Address, " +
                                                  "@Address_Type,@Row_Status,@Project_Code,@Ack_Reqd,@IsRead)";
                        rowsAffected = connection.Execute(agentQuery, lstMsgUsers, transaction: trans);
                    }
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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
            int rowsAffected = 0;
            int noOfRows = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Noticeboard_Content_MSG SET Subject=@Subject,Message_Content=@Message_Content, " +
                                   "Sent_Type=@Sent_Type,Attachment_Path1=@Attachment_Path1 WHERE Company_Code=@Company_Code " +
                                   "AND Msg_Code=@Msg_Code";
                    rowsAffected = connection.Execute(query, lstMsgContent, transaction: trans);
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string agentQuery = "DELETE FROM tbl_SFA_Noticeboard_Agent_MSG WHERE Company_Code=@Company_Code " +
                                                  "AND Msg_Code=@Msg_Code AND Target_Address=@Target_Address";
                        rowsAffected = connection.Execute(agentQuery, lstMsgUsers, transaction: trans);

                        const string insertQuery = "INSERT INTO tbl_SFA_Noticeboard_Agent_MSG(Company_Code,Msg_Code,Target_Address, " +
                                                 "Address_Type,Row_Status,Project_Code,Ack_Reqd,IsRead) VALUES (@Company_Code,@Msg_Code,@Target_Address, " +
                                                 "@Address_Type,@Row_Status,@Project_Code,@Ack_Reqd,@IsRead)";
                        noOfRows = connection.Execute(insertQuery, lstMsgUsers, transaction: trans);
                    }
                    trans.Commit();
                    return noOfRows;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }

        /// <summary>
        /// Get Msg code
        /// </summary>
        /// <param name="objName"></param>
        /// <returns></returns>

        public long GetSeqNumber(string objName)
        {
            long value = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT NEXT VALUE FOR " + objName + "";
                    value = connection.Query<Int64>(query).Single();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return value;
        }

        // Messages
        public int GetUnreadMessageCount(string companyCode, string userCode)
        {
            int value = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT COUNT(1) AS Msg_Count "
                                    + " FROM tbl_SFA_Noticeboard_Content_MSG"
                                    + " INNER JOIN tbl_SFA_Noticeboard_Agent_MSG ON tbl_SFA_Noticeboard_Content_MSG.Msg_Code = tbl_SFA_Noticeboard_Agent_MSG.Msg_Code "
                                    + " WHERE "
                                    + " tbl_SFA_Noticeboard_Agent_MSG.Target_Address='" + userCode + "'"
                                    + " AND tbl_SFA_Noticeboard_Content_MSG.Sent_Status='SENT' "
                                    + " AND tbl_SFA_Noticeboard_Agent_MSG.Project_Code='MSGSYSTEM'"
                                    + " AND tbl_SFA_Noticeboard_Agent_MSG.IsRead=0"
                                    + " AND tbl_SFA_Noticeboard_Agent_MSG.Company_Code='" + companyCode + "' ";
                    value = connection.Query<Int32>(query).Single();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return value;
        }

        public IEnumerable<MVCModels.MessagingModel> GetMessagesForUser(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_hdGetMessagesForUser,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstContent;
        }

        public IEnumerable<MVCModels.MessagingModel> GetPreviousAndNextMsgCode(string companyCode, string userCode, string msgCode)
        {
            IEnumerable<MVCModels.MessagingModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.MessagingModel>(SP_hdGetPreviousAndNextMsgCode,
                                  new { CompanyCode = companyCode, Msg_Code = msgCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstContent;
        }
        //

        // Notifications
        public int GetUnreadAnnouncementCount(string companyCode, string userCode)
        {
            int value = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "  SELECT COUNT(1) AS Msg_Count "
                                   + " FROM tbl_SFA_Noticeboard_Content "
                                   + " INNER JOIN tbl_SFA_Noticeboard_Agent ON tbl_SFA_Noticeboard_Content.Msg_Code = tbl_SFA_Noticeboard_Agent.Msg_Code  "
                                   + " WHERE  "
                                   + " tbl_SFA_Noticeboard_Agent.Target_UserCode='" + userCode + "'"
                                   + " AND tbl_SFA_Noticeboard_Content.Approved='Y' "
                                   + " AND tbl_SFA_Noticeboard_Agent.IsRead='N' "
                                   + " AND CONVERT(DATE,GETDATE()) BETWEEN CONVERT(DATE,tbl_SFA_Noticeboard_Content.Date_From) AND CONVERT(DATE,tbl_SFA_Noticeboard_Content.Date_To) "
                                   + " AND tbl_SFA_Noticeboard_Agent.Company_Code='" + companyCode + "'";
                    value = connection.Query<Int32>(query).Single();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return value;
        }

        public IEnumerable<MVCModels.NoticeboardAgentMSGModel> GetAnnouncementForUser(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.NoticeboardAgentMSGModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.NoticeboardAgentMSGModel>(SP_hdGetAnnouncementForUser,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstContent;
        }

        public IEnumerable<MVCModels.NoticeboardAgentMSGModel> GetPreviousAndNextAnnouncementCode(string companyCode, string userCode, string msgCode)
        {
            IEnumerable<MVCModels.NoticeboardAgentMSGModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.NoticeboardAgentMSGModel>(SP_hdGetPreviousAndNextAnnouncementCode,
                                  new { CompanyCode = companyCode, Announcement_Code = msgCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstContent;
        }
        //
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
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    if (removedFile == "YES")
                    {
                        string query = "UPDATE tbl_SFA_Noticeboard_Content_MSG SET " + columnName + "=NULL" +
                                   " WHERE Company_Code='" + companyCode + "'" +
                                   " AND Msg_Code='" + msgCode + "'";
                        rowsAffected = connection.Execute(query);
                    }
                    else
                    {
                        string query = "UPDATE tbl_SFA_Noticeboard_Content_MSG SET " + columnName + "= '" + fileName + "' " +
                                       " WHERE Company_Code='" + companyCode + "'" +
                                       " AND Msg_Code='" + msgCode + "'";
                        rowsAffected = connection.Execute(query);
                    }
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string query = "UPDATE tbl_SFA_Noticeboard_Content_MSG  SET Subject=@Subject, Message_Content=@Message_Content " +
                                         " ,Sent_Status=@Sent_Status, Sent_Type=@Sent_Type, Row_Status=@Row_Status, " +
                                         " Date_From=GETDATE() where Msg_Code=@Msg_Code and Company_Code=@Company_Code ";
                    rowsAffected = connection.Execute(query, lstMsgContent, transaction: trans);
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        string deleteQuery = "DELETE FROM tbl_SFA_Noticeboard_Agent_MSG WHERE Msg_Code='" + msgCode + "' and Company_Code='" + companyCode + "'";
                        rowsAffected = connection.Execute(deleteQuery, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string agentQuery = "INSERT INTO tbl_SFA_Noticeboard_Agent_MSG(Company_Code,Msg_Code,Target_Address, " +
                                                      "Address_Type,Row_Status,Project_Code,Ack_Reqd,IsRead)" +
                                                      "values(@Company_Code,@Msg_Code,@Target_Address, " +
                                                      "@Address_Type,@Row_Status,@Project_Code,@Ack_Reqd,@IsRead)";
                            rowsAffected = connection.Execute(agentQuery, lstMsgUsers, transaction: trans);
                        }
                    }
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
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
            string resultMsgCode = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Msg_Code", msgCode);
                    p.Add("@Mode", mode);
                    p.Add("@MailMode", mailMode);
                    p.Add("@User_Code", userCode);
                    //p.Add("@Result", resultMsgCode, DbType.Int32, ParameterDirection.Output);
                    resultMsgCode = connection.Query<string>(SP_HDGETNEXTORPREVIOUSMSGDETAILS, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    //lstContent = connection.Query<MVCModels.MessagingModel>(SP_HDGETNEXTORPREVIOUSMSGDETAILS,
                    //              new { Company_Code = companyCode, Msg_Code = msgCode,@@Mode= mode,@@MailMode= mailMode, },
                    //              commandType: CommandType.StoredProcedure);
                    //rowsAffected = connection.Execute(query, lstMsg, transaction: trans);

                    return resultMsgCode;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        /// <summary>
        /// get the uses for messaging
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of child user details</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersForMessaging(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUsers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUsers = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETUSERSFORMESSAGING,
                                  new { Company_Code = companyCode, User_Code = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstUsers;
        }
        /// <summary>
        /// Get Active Division Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.MsdDivisionModel> GetDivisions(string companyCode)
        {
            IEnumerable<MVCModels.MsdDivisionModel> lstDivisions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDivisions = connection.Query<MVCModels.MsdDivisionModel>(SP_HD_MSG_GETDIVISIONS, new { CompanyCode = companyCode }, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDivisions;
        }
        /// <summary>
        /// Get Entity code based on division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.DivisionBasedModel> GetEntityCodebyDivision(string companyCode)
        {
            List<MVCModels.DivisionBasedModel> lstDivisionBased = new List<MVCModels.DivisionBasedModel>();

            try
            {
                var paraemeter = new DynamicParameters();
                paraemeter.Add("@CompanyCode", companyCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDivisionBased = connection.Query<MVCModels.DivisionBasedModel>(SP_HD_GETUSERBASEDONDIVISION, paraemeter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDivisionBased;
        }
        #region OBO Mappinng

        public string InsertOBOMapping(string CompanyId, string userCode, string TypeName, List<MVCModels.HiDoctor_Master.UserModel> lstUserMappingDetails, string Created_By)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = new DataTable();
                if (lstUserMappingDetails != null)
                {
                    if (lstUserMappingDetails.Count > 0)
                    {

                        dt.Columns.AddRange(new DataColumn[2] {
                    new DataColumn("User_Code", typeof(string)),
                    new DataColumn("User_Name",typeof(string)) });

                        if (lstUserMappingDetails.Count > 0)
                        {
                            for (int itr = 0; itr <= lstUserMappingDetails.Count() - 1; itr++)
                            {
                                dt.Rows.Add(lstUserMappingDetails[itr].User_Code, lstUserMappingDetails[itr].User_Name);
                            }
                        }
                    }
                }

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (SqlCommand cmd = new SqlCommand("USP_INSERT_OBO_USERREGIONMAPPING", (SqlConnection)connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Company_Code", CompanyId);
                        cmd.Parameters.AddWithValue("@User_Code", userCode);
                        cmd.Parameters.AddWithValue("@Type_Name", TypeName);
                        cmd.Parameters.AddWithValue("@Created_By", Created_By);
                        if (lstUserMappingDetails == null)
                        {
                            cmd.Parameters.AddWithValue("@tbl_Users_Table", null);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@tbl_Users_Table", dt);
                        }
                        cmd.Parameters.Add("@Result", SqlDbType.VarChar, 100);
                        cmd.Parameters["@Result"].Direction = ParameterDirection.Output;
                        if (Convert.ToString(connection.State) == "Open") connection.Close();
                        connection.Open();
                        cmd.ExecuteNonQuery();
                        result = (string)cmd.Parameters["@Result"].Value;
                        connection.Close();
                    }


                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                result = "Failure:" + ex.Message;
                return result;
            }
            return result;

        }


        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetOBOUsers(string companyCode, string userCode, string TypeName)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUsers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var Param = new DynamicParameters();
                    Param.Add("@Company_Code", companyCode);
                    Param.Add("@User_code", userCode);
                    Param.Add("@Type_Name", TypeName);
                    lstUsers = connection.Query<MVCModels.HiDoctor_Master.UserModel>(USP_OBO_GETACCESSUSERDETAILS, Param,
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstUsers;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersForOBOMessaging(string companyCode, string userCode,string LoginUserCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUsers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUsers = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_hdGetUsersForOBOMessaging,
                                  new { Company_Code = companyCode, User_Code = userCode,LoginUserCode= LoginUserCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstUsers;
        }
        #endregion
    }
}
