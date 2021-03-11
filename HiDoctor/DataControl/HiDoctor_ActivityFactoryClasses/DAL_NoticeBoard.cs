using System;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using MVCModels.HiDoctor_Master;
using Dapper;
using Newtonsoft.Json;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    class DAL_NoticeBoard : DapperRepository
    {
        DataControl.SPData _objSPData = new SPData();
        Data _objData = new Data();

        const string SP_HD_NB_GETALLUSERTREEDETAILS = "SP_HD_NB_GetAllUserTreeDetails";
        const string SP_HD_NB_INSERTNBCONTENT = "SP_HD_NB_InsertNBContent";
        const string SP_HD_NB_INSERTNBAGENT = "SP_HD_NB_InsertNBAgent";
        const string SP_HD_NB_GETUSERCODES = "SP_HD_NB_GetUserCodes";
        const string SP_HD_NB_DELETE_NOTICE = "SP_HD_NB_DeleteNotice";
        const string SUCCESS = "SUCCESS";
        const string SP_HD_NB_GET_NOTICEDETAILS = "SP_HD_NB_Get_NoticeDetails";
        const string SP_HD_NB_GET_ALLNOTICEDETAILS = "SP_HD_NB_Get_AllNoticeDetails";
        const string SP_HD_NB_GET_SINGLENOTICEDETAILS = "SP_HD_NB_Get_SingleNoticeDetails";
        const string SP_HD_GET_REGIONTYPES = "SP_hd_DrCatVisitAnalysis_GetRegionTypes";
        const string S_HD_GET_USERTYPELIST = "SP_HdGetUserTypeList";
        const string SP_HDGETALLDIVISIONS = "SP_hdGetAllDivisions";
        const string SP_HD_GET_NOTICEREADSTATUS = "SP_HD_NB_Get_NoticeReadStatus";
        const string SP_HD_GET_REGIONCODES = "SP_HD_NB_GetRegionCodes";
        const string SP_HD_GET_NOTICEATTACHMENT_SIZE = "SP_hd_GetNoticeBoardAttacmentSize";
        const string SP_HDGETNOTICE = "SP_HdGetNotice";
        const string SP_GETNOTICEBOARDREADPOPUP = "SP_GETNoticeBoardreadPopup";

        const string SP_HDGETUSERDIVISIONANDUSERTYPEWISE = "Sp_HdGetUserDivisionandUserTypewise";
        const string SP_HDGETREGIONDIVISIONANDUSERTYPEWISE = "SP_HDGETREGIONDIVISIONANDUSERTYPEWISE";
        const string SP_HDGETCHILDUSERSTYPES = "SP_hdGetChildUsersTypes";

        const string SP_HDGETCHILDLOCKUSERDETAIL = "SP_HDGETCHILDLOCKUSERDETAIL";
        const string SP_HDGETDCRLOCKDETAIL = "SP_HD_GetDCRLockedRowsPerUser";

        const string SP_HD_GETDCRLOCKRELEASEDATES = "SP_HD_GetDCRLockReleaseDates";
        //Active Notice
        const string SP_HD_GETACTIVENOTICEFORINACTIVEUSER = "Sp_Hd_GetActiveNoticeforInactiveUser";
        const string SP_HD_GETNOTICECONTENT = "Sp_Hd_GetNoticeContent";
        const string SP_HD_GETDCRLOCKRELEASEDETAILS = "SP_HD_GETDCRLOCKRELEASEDETAILS";
        const string SP_HD_INSERTNEWGROUP = "SP_HD_InsertNewGroup";
        const string SP_HD_INSERTNEWUSER = "SP_HD_InsertNewUser";
        const string SP_HD_GETGROUPNAMES = "SP_HD_GetGroupNames";
        const string SP_HD_GetGroupMembers = "SP_HD_GetGroupMembers";
        const string SP_HD_GetTreeMembers = "SP_HD_GetTreeMembers";
        const string SP_HD_GetMembsUpdDateWise = "SP_HD_GetMembsUpdDateWise";
        const string SP_HD_UpdateGroupStatus = "SP_HD_UpdateGroupStatus";
        const string SP_HD_UpdateGroupDetails = "SP_HD_UpdateGroupDetails";
        const string SP_HD_GetDCRLockReleaseDatesforActivity = "SP_HD_GetDCRLockReleaseDatesforActivity";

        public string GetUserCodes(string companyCode, string regionCodes)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_NB_GETUSERCODES);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Codes", ParameterDirection.Input, SqlDbType.NVarChar, regionCodes.Length, regionCodes);

                objSqlConnection = _objData.GetConnectionObject(companyCode);
                objSqlConnection.Open();

                command.Connection = objSqlConnection;
                string userCodes = string.Empty;
                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        userCodes += sqlReader["User_Code"].ToString() + ",";
                    }
                }
                return userCodes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode); ;
                dicContext.Add("InputParameter(s):regionCodes", regionCodes);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        private string GetRegionCodes(string companyCode, string userCodes)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_REGIONCODES);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Codes", ParameterDirection.Input, SqlDbType.NVarChar, userCodes.Length, userCodes);

                objSqlConnection = _objData.GetConnectionObject(companyCode);
                objSqlConnection.Open();

                command.Connection = objSqlConnection;
                string RegionCodes = string.Empty;
                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        RegionCodes += sqlReader["Region_Code"].ToString() + ",";
                    }
                }
                return RegionCodes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode); ;
                dicContext.Add("InputParameter(s):userCodes", userCodes);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public bool InsertNoticeBoard(string companyCode, NoticeBoardModel objNoticeBoard)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            objSqlConnection = _objData.GetConnectionObject(companyCode);
            objSqlConnection.Open();

            SqlTransaction objSqlTransaction = objSqlConnection.BeginTransaction();

            SqlCommand command = new SqlCommand(SP_HD_NB_INSERTNBCONTENT);
            command.CommandType = CommandType.StoredProcedure;

            command.Connection = objSqlConnection;
            command.Transaction = objSqlTransaction;

            try
            {
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, objNoticeBoard.MsgCode);
                _objSPData.AddParamToSqlCommand(command, "@Title", ParameterDirection.Input, SqlDbType.NVarChar, 100, objNoticeBoard.MsgTitle);
                _objSPData.AddParamToSqlCommand(command, "@Message", ParameterDirection.Input, SqlDbType.NVarChar, objNoticeBoard.MsgBody.Length, objNoticeBoard.MsgBody);
                _objSPData.AddParamToSqlCommand(command, "@Hyperlink", ParameterDirection.Input, SqlDbType.NVarChar, 250, objNoticeBoard.MsgHyperlink);
                _objSPData.AddParamToSqlCommand(command, "@Priority", ParameterDirection.Input, SqlDbType.SmallInt, 2, objNoticeBoard.MsgPriority);
                _objSPData.AddParamToSqlCommand(command, "@ValidFrom", ParameterDirection.Input, SqlDbType.Date, 20, objNoticeBoard.MsgValidFrom);
                _objSPData.AddParamToSqlCommand(command, "@ValidTo", ParameterDirection.Input, SqlDbType.Date, 20, objNoticeBoard.MsgValidTo);
                _objSPData.AddParamToSqlCommand(command, "@Sender_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, objNoticeBoard.MsgSenderUserCode);
                _objSPData.AddParamToSqlCommand(command, "@Distribution_Type", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgDistributionType);
                _objSPData.AddParamToSqlCommand(command, "@Approved", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgApprovalStatus);
                _objSPData.AddParamToSqlCommand(command, "@Acknowledgement_Reqd", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgAcknowlendgementReqd);
                _objSPData.AddParamToSqlCommand(command, "@AttachmentPath", ParameterDirection.Input, SqlDbType.NVarChar, 250, objNoticeBoard.MsgAttachmentPath);
                _objSPData.AddParamToSqlCommand(command, "@showTicker", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.SHOW_IN_TICKER_ONLY);
                _objSPData.AddParamToSqlCommand(command, "@highlight", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.HIGHLIGHT);
                command.ExecuteNonQuery();

                foreach (NoticeBoardAgent objNoticeBoardAgent in objNoticeBoard.lstNoticeBoardAgent)
                {
                    command.Parameters.Clear();
                    command.CommandText = SP_HD_NB_INSERTNBAGENT;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, objNoticeBoardAgent.MsgCode);
                    _objSPData.AddParamToSqlCommand(command, "@Target_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, objNoticeBoardAgent.MsgTargetUserCode);

                    command.ExecuteNonQuery();
                }

                objSqlTransaction.Commit();

                return true;
            }
            catch (Exception ex)
            {
                objSqlTransaction.Rollback();

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode); ;
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public bool UpdateNoticeBoard(string companyCode, NoticeBoardModel objNoticeBoard)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            objSqlConnection = _objData.GetConnectionObject(companyCode);
            objSqlConnection.Open();

            SqlTransaction objSqlTransaction = objSqlConnection.BeginTransaction();

            SqlCommand command = new SqlCommand(SP_HD_NB_DELETE_NOTICE);
            command.CommandType = CommandType.StoredProcedure;

            command.Connection = objSqlConnection;
            command.Transaction = objSqlTransaction;

            try
            {
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, objNoticeBoard.MsgCode);

                int count;

                count = command.ExecuteNonQuery();

                if (count > 0)
                {
                    command.Parameters.Clear();
                    command.CommandText = SP_HD_NB_INSERTNBCONTENT;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, objNoticeBoard.MsgCode);
                    _objSPData.AddParamToSqlCommand(command, "@Title", ParameterDirection.Input, SqlDbType.NVarChar, 100, objNoticeBoard.MsgTitle);
                    _objSPData.AddParamToSqlCommand(command, "@Message", ParameterDirection.Input, SqlDbType.NVarChar, objNoticeBoard.MsgBody.Length, objNoticeBoard.MsgBody);
                    _objSPData.AddParamToSqlCommand(command, "@Hyperlink", ParameterDirection.Input, SqlDbType.NVarChar, 250, objNoticeBoard.MsgHyperlink);
                    _objSPData.AddParamToSqlCommand(command, "@Priority", ParameterDirection.Input, SqlDbType.SmallInt, 2, objNoticeBoard.MsgPriority);
                    _objSPData.AddParamToSqlCommand(command, "@ValidFrom", ParameterDirection.Input, SqlDbType.Date, 20, objNoticeBoard.MsgValidFrom);
                    _objSPData.AddParamToSqlCommand(command, "@ValidTo", ParameterDirection.Input, SqlDbType.Date, 20, objNoticeBoard.MsgValidTo);
                    _objSPData.AddParamToSqlCommand(command, "@Sender_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, objNoticeBoard.MsgSenderUserCode);
                    _objSPData.AddParamToSqlCommand(command, "@Distribution_Type", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgDistributionType);
                    _objSPData.AddParamToSqlCommand(command, "@Approved", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgApprovalStatus);
                    _objSPData.AddParamToSqlCommand(command, "@Acknowledgement_Reqd", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.MsgAcknowlendgementReqd);
                    _objSPData.AddParamToSqlCommand(command, "@AttachmentPath", ParameterDirection.Input, SqlDbType.NVarChar, 250, objNoticeBoard.MsgAttachmentPath);
                    _objSPData.AddParamToSqlCommand(command, "@showTicker", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.SHOW_IN_TICKER_ONLY);
                    _objSPData.AddParamToSqlCommand(command, "@highlight", ParameterDirection.Input, SqlDbType.Char, 1, objNoticeBoard.HIGHLIGHT);
                    command.ExecuteNonQuery();

                    foreach (NoticeBoardAgent objNoticeBoardAgent in objNoticeBoard.lstNoticeBoardAgent)
                    {
                        command.Parameters.Clear();
                        command.CommandText = SP_HD_NB_INSERTNBAGENT;

                        _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                        _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, objNoticeBoardAgent.MsgCode);
                        _objSPData.AddParamToSqlCommand(command, "@Target_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, objNoticeBoardAgent.MsgTargetUserCode);

                        command.ExecuteNonQuery();
                    }

                    objSqlTransaction.Commit();

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                objSqlTransaction.Rollback();

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode); ;
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public List<NoticeBoardModel> GetSingleNoticeDetails(string companyCode, string senderUserCode, string msgCode)
        {
            try
            {
                List<NoticeBoardModel> lstNoticeBoardModel = new List<NoticeBoardModel>();
                List<NoticeBoardAgent> lstNoticeBoardAgent = new List<NoticeBoardAgent>();

                NoticeBoardModel objNoticeBoardModel;
                NoticeBoardAgent objNoticeBoardAgent;

                SqlCommand command = new SqlCommand(SP_HD_NB_GET_SINGLENOTICEDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Sender_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, senderUserCode);
                _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, msgCode);

                DataSet ds;

                _objData.OpenConnection();

                ds = _objData.ExecuteDataSet(command);

                _objData.CloseConnection();

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    objNoticeBoardModel = new NoticeBoardModel();

                    objNoticeBoardModel.MsgCode = ds.Tables[0].Rows[0]["Msg_Code"].ToString();
                    objNoticeBoardModel.MsgDistributionType = Convert.ToChar(ds.Tables[0].Rows[0]["Distribution_Type"].ToString());
                    objNoticeBoardModel.MsgBody = ds.Tables[0].Rows[0]["Message"].ToString();
                    objNoticeBoardModel.MsgTitle = ds.Tables[0].Rows[0]["Title"].ToString();
                    objNoticeBoardModel.MsgHyperlink = ds.Tables[0].Rows[0]["Hyperlink"].ToString();
                    objNoticeBoardModel.MsgPriority = Convert.ToInt16(ds.Tables[0].Rows[0]["Priority"].ToString());
                    objNoticeBoardModel.MsgAttachmentPath = ds.Tables[0].Rows[0]["FilePath"].ToString();
                    objNoticeBoardModel.MsgValidFrom = ds.Tables[0].Rows[0]["Date_From"].ToString();
                    objNoticeBoardModel.MsgValidTo = ds.Tables[0].Rows[0]["Date_To"].ToString();
                    objNoticeBoardModel.MsgAcknowlendgementReqd = Convert.ToChar(ds.Tables[0].Rows[0]["Ack_Reqd"].ToString());
                    objNoticeBoardModel.MsgSenderUserCode = senderUserCode;
                    objNoticeBoardModel.SHOW_IN_TICKER_ONLY = ds.Tables[0].Rows[0]["SHOW_IN_TICKER_ONLY"].ToString();
                    objNoticeBoardModel.HIGHLIGHT = ds.Tables[0].Rows[0]["HIGHLIGHT"].ToString();
                    objNoticeBoardModel.Company_Code = ds.Tables[0].Rows[0]["Company_Code"].ToString().ToLower();
                    lstNoticeBoardAgent = new List<NoticeBoardAgent>();

                    if (objNoticeBoardModel.MsgDistributionType != 'R')
                    {

                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            objNoticeBoardAgent = new NoticeBoardAgent();

                            objNoticeBoardAgent.MsgCode = row["Msg_Code"].ToString();
                            objNoticeBoardAgent.MsgTargetUserCode = row["Target_UserCode"].ToString().Trim();

                            lstNoticeBoardAgent.Add(objNoticeBoardAgent);
                        }
                    }
                    else
                    {
                        string userCodes = string.Empty;
                        string regionCodes = string.Empty;
                        string[] regionCodeArray;

                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            userCodes += row["Target_UserCode"].ToString().Trim() + "^";
                        }

                        regionCodes = GetRegionCodes(companyCode, userCodes);

                        regionCodeArray = regionCodes.Split(',');

                        foreach (string regionCode in regionCodeArray)
                        {
                            objNoticeBoardAgent = new NoticeBoardAgent();

                            objNoticeBoardAgent.MsgCode = ds.Tables[0].Rows[0]["Msg_Code"].ToString();
                            objNoticeBoardAgent.MsgTargetUserCode = regionCode;

                            lstNoticeBoardAgent.Add(objNoticeBoardAgent);
                        }
                    }

                    objNoticeBoardModel.lstNoticeBoardAgent = lstNoticeBoardAgent;

                    lstNoticeBoardModel.Add(objNoticeBoardModel);
                }

                return lstNoticeBoardModel;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("InputParameter(s):senderUserCode", senderUserCode);
                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public List<NoticeBoardModel> GetAllNoticeDetails(string companyCode, string senderUserCode)
        {
            SqlConnection objSqlConnection = new SqlConnection();


            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);

                SqlCommand command = new SqlCommand(SP_HD_NB_GET_ALLNOTICEDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Sender_User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, senderUserCode);

                objSqlConnection.Open();

                command.Connection = objSqlConnection;
                List<NoticeBoardModel> lstNoticeBoardModel = new List<NoticeBoardModel>();

                NoticeBoardModel objNoticeBoardModel;
                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    if (sqlReader.HasRows)
                    {
                        while (sqlReader.Read())
                        {
                            objNoticeBoardModel = new NoticeBoardModel();

                            objNoticeBoardModel.MsgCode = sqlReader["Msg_Code"].ToString();
                            objNoticeBoardModel.MsgDistributionType = Convert.ToChar(sqlReader["Distribution_Type"].ToString());
                            objNoticeBoardModel.MsgBody = sqlReader["Message"].ToString();
                            objNoticeBoardModel.MsgTitle = sqlReader["Title"].ToString();
                            objNoticeBoardModel.MsgHyperlink = sqlReader["Hyperlink"].ToString();
                            objNoticeBoardModel.MsgPriority = Convert.ToInt16(sqlReader["Priority"].ToString());
                            objNoticeBoardModel.MsgAttachmentPath = sqlReader["FilePath"].ToString();
                            objNoticeBoardModel.MsgValidFrom = sqlReader["Date_From"].ToString();
                            objNoticeBoardModel.MsgValidTo = sqlReader["Date_To"].ToString();
                            objNoticeBoardModel.MsgAcknowlendgementReqd = Convert.ToChar(sqlReader["Ack_Reqd"].ToString());
                            objNoticeBoardModel.HIGHLIGHT = sqlReader["HIGHLIGHT"].ToString();
                            objNoticeBoardModel.SHOW_IN_TICKER_ONLY = sqlReader["SHOW_IN_TICKER_ONLY"].ToString();
                            objNoticeBoardModel.MsgSenderUserCode = senderUserCode;

                            lstNoticeBoardModel.Add(objNoticeBoardModel);
                        }
                    }
                }
                return lstNoticeBoardModel;
            }
            catch (Exception ex)
            {
                objSqlConnection.Close();

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("InputParameter(s):senderUserCode", senderUserCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public bool DeleteNoticeBoard(string companyCode, string msgCode)
        {
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_NB_DELETE_NOTICE);
                command.CommandType = CommandType.StoredProcedure;

                objSqlConnection = _objData.GetConnectionObject(companyCode);

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, msgCode);

                objSqlConnection.Open();

                command.Connection = objSqlConnection;

                int count;

                count = command.ExecuteNonQuery();

                if (count > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                objSqlConnection.Close();

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public DataSet GetUserTypeList(string companyCode)
        {
            DataSet ds;

            try
            {
                SqlCommand command = new SqlCommand(S_HD_GET_USERTYPELIST);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetUnderUserTypeList(string companyCode, string userCode)
        {
            DataSet ds;

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCHILDUSERSTYPES);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetAllDivisionList(string companyCode)
        {
            DataSet ds;

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETALLDIVISIONS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public NoticeBoardModel GetNoticeReadStatus(string companyCode, string msgCode)
        {
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);

                SqlCommand command = new SqlCommand(SP_HD_GET_NOTICEREADSTATUS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, msgCode);

                objSqlConnection.Open();

                command.Connection = objSqlConnection;
                NoticeBoardModel objNoticeBoardModel = new NoticeBoardModel();
                List<NoticeBoardAgent> lstNoticeBoardAgent = new List<NoticeBoardAgent>();
                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    if (sqlReader.HasRows)
                    {
                        objNoticeBoardModel = new NoticeBoardModel();

                        NoticeBoardAgent objNoticeBoardAgent;

                        while (sqlReader.Read())
                        {
                            objNoticeBoardAgent = new NoticeBoardAgent();

                            objNoticeBoardAgent.MsgTargetUserCode = sqlReader["User_Name"].ToString();
                            objNoticeBoardAgent.Employee_Name = sqlReader["Employee_Name"].ToString();
                            objNoticeBoardAgent.MsgIsRead = Convert.ToChar(sqlReader["IsRead"].ToString());

                            lstNoticeBoardAgent.Add(objNoticeBoardAgent);
                        }

                        objNoticeBoardModel.lstNoticeBoardAgent = lstNoticeBoardAgent;
                    }
                }

                return objNoticeBoardModel;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("InputParameter(s):msgCode", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public int GetNoticeBoardAttachmentSize(string companyCode)
        {
            int returnValue;
            try
            {
                string cmdText = SP_HD_GET_NOTICEATTACHMENT_SIZE;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                returnValue = _objData.GetIntegerValue_Global(command);

                return returnValue;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("InputParameter(s):companyCode", companyCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public IEnumerable<NoticeBoardContentModel> GetNoticeBoarddetail(string companyCode, string userCode)
        {
            IEnumerable<NoticeBoardContentModel> lstDivuserPro;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);

                    lstDivuserPro = connection.Query<NoticeBoardContentModel>(SP_HDGETNOTICE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstDivuserPro;
        }

        public IEnumerable<NoticeBoardContentModel> GetNoticeBoardPopup(string companyCode, string mesgCode, string userCode)
        {
            IEnumerable<NoticeBoardContentModel> lstNotice;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Msg_Code", mesgCode);
                    p.Add("@UserCode", userCode);

                    lstNotice = connection.Query<NoticeBoardContentModel>(SP_GETNOTICEBOARDREADPOPUP, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstNotice;
        }


        public IEnumerable<UserDivisionWise> GetLockUsersDetails(string companyCode, string userCode, string match)
        {
            IEnumerable<UserDivisionWise> lstlockUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@UserName", match);

                    lstlockUser = connection.Query<UserDivisionWise>(SP_HDGETCHILDLOCKUSERDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstlockUser;
        }
        public IEnumerable<DcrLockDetail> GetDcrLockedetails(string companyCode, string userCode)
        {
            IEnumerable<DcrLockDetail> lstlockUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Compnay_Code", companyCode);
                    p.Add("@User_Code", userCode);


                    lstlockUser = connection.Query<DcrLockDetail>(SP_HDGETDCRLOCKDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstlockUser;
        }


        public List<userList> GetUserDivisionWise(string companyCode, string userTypeCodes, string divisionCodes)
        {
            List<userList> lst = new List<userList>();
            try
            {
                List<UserDivisionWise> lstuserList = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETUSERDIVISIONANDUSERTYPEWISE,
                                  new { CompanyCode = companyCode, DivisionCode = divisionCodes, UserTypeName = userTypeCodes },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstuserList = multi.Read<UserDivisionWise>().ToList();

                    }
                }
                userList objExp = new userList();
                objExp.lstUserDetail = lstuserList;


                lst.Add(objExp);

            }
            catch (Exception)
            {
                throw;
            }
            return lst;
        }


        public List<userList> GetRegionDivisionWise(string companyCode, string regionsCodes, string divisionCodes)
        {
            List<userList> lst = new List<userList>();
            try
            {
                List<UserDivisionWise> lstuserList = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETREGIONDIVISIONANDUSERTYPEWISE,
                                  new { CompanyCode = companyCode, DivisionCode = divisionCodes, RegionTypeName = regionsCodes },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstuserList = multi.Read<UserDivisionWise>().ToList();

                    }
                }
                userList objExp = new userList();
                objExp.lstUserDetail = lstuserList;


                lst.Add(objExp);

            }
            catch (Exception)
            {
                throw;
            }
            return lst;
        }

        public SqlDataReader sqldataReader { get; set; }
        /// <summary>
        /// Get DCR Lock Release Dates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<DCRActivityLockModel> GetDcrLockReleaseDates(string companyCode, string userCode, string showDetail, string FromDate,string ToDate)
        {
            List<DCRActivityLockModel> lstDcrlockrealeasedates = new List<DCRActivityLockModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@CompanyCode", companyCode);
                    parameters.Add("@UserCode", userCode);
                    parameters.Add("@ShowDetail", showDetail);
                    parameters.Add("@FromDate", FromDate);
                    parameters.Add("@ToDate", ToDate);

                    lstDcrlockrealeasedates = connection.Query<DCRActivityLockModel>(SP_HD_GETDCRLOCKRELEASEDATES, parameters, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDcrlockrealeasedates;
        }
        public List<DCRActivityLockModel> GetDcrLockReleaseDatesforactivity(string companyCode, string userCode, string showDetail)
        {
            List<DCRActivityLockModel> lstDcrlockrealeasedates = new List<DCRActivityLockModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@CompanyCode", companyCode);
                    parameters.Add("@UserCode", userCode);
                    parameters.Add("@ShowDetail", showDetail);
                    lstDcrlockrealeasedates = connection.Query<DCRActivityLockModel>(SP_HD_GetDCRLockReleaseDatesforActivity, parameters, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDcrlockrealeasedates;
        }
        public MVCModels.DCRLockReleaseDataForPagination GetAllDCRLockRelease(string Company_Code, string User_Code, string PageNumber, string PageSize)
        {
            List<DCRLockReleaseData> lstLock = new List<DCRLockReleaseData>();
            MVCModels.DCRLockReleaseDataForPagination pagnation = new MVCModels.DCRLockReleaseDataForPagination();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Page_Number", PageNumber);
                    p.Add("@Page_Size", PageSize);
                    p.Add("@Totalcount", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    lstLock = connection.Query<DCRLockReleaseData>(SP_HD_GETDCRLOCKRELEASEDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    pagnation.Totalcount = p.Get<int>("@Totalcount");
                    pagnation.lstDCRLock = lstLock;
                }
            }
            catch
            {
                throw;
            }
            return pagnation;
        }


        public List<DCRActivityLockModel> GetAlllockData(string companyCode, string userCode, string showDetail)
        {
            List<DCRActivityLockModel> lstDcrlock = new List<DCRActivityLockModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@CompanyCode", companyCode);
                    parameters.Add("@UserCode", userCode);
                    parameters.Add("@ShowDetail", showDetail);
                    lstDcrlock = connection.Query<DCRActivityLockModel>(SP_HD_GETDCRLOCKRELEASEDATES, parameters, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDcrlock;
        }
        #region - Active Notice for Inactive User
        /// <summary>
        /// Get Active Notice for Inactive Users
        /// </summary>
        /// <param name="company_code"></param>
        /// <returns></returns>
        public List<NoticeContentforUserModel> GetActiveNoticeforInactiveUser(string company_code)
        {
            List<NoticeContentforUserModel> lstInactiveUsers = new List<NoticeContentforUserModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                lstInactiveUsers = connection.Query<NoticeContentforUserModel>(SP_HD_GETACTIVENOTICEFORINACTIVEUSER, new { @Company_Code = company_code }, commandType: CommandType.StoredProcedure).ToList();

            }
            return lstInactiveUsers;
        }
        /// <summary>
        /// Get Notice content for selected User
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<NoticeContentforUserModel> GetNoticeContent(string companyCode, string userCode)
        {
            List<NoticeContentforUserModel> lstNoticeContent = new List<NoticeContentforUserModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                lstNoticeContent = connection.Query<NoticeContentforUserModel>(SP_HD_GETNOTICECONTENT, new
                {
                    @Company_Code = companyCode,
                    @Target_User_Code = @userCode
                }, commandType: CommandType.StoredProcedure).ToList();
                return lstNoticeContent;
            }
        }
        /// <summary>
        /// Update notice for active users
        /// </summary>
        /// <param name="lstNotices"></param>
        /// <returns></returns>
        public int UpdateActiveNoticeforInactiveuser(List<NoticeContentforUserModel> lstNotices)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "UPDATE tbl_SFA_Noticeboard_Content SET Sender=@Asigned_User_Code WHERE Sender=@User_Code AND Msg_Code IN  (@Msg_Code) AND Company_Code = @Company_Code";
                    //string query = "UPDATE tbl_SFA_Noticeboard_Agent SET Target_UserCode = @Asigned_User_Code WHERE Target_UserCode = @User_Code AND Msg_Code IN  (@Msg_Code) AND Company_Code = @Company_Code";
                    result = connection.Execute(query, lstNotices);
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        #endregion - Active Notice for Inactive User

        public int InsertNewGroup(string UserCodes, string GroupName, string UserName, string RegionCode)
        {
            int result = 0;
            List<GroupModel> lstGrpID = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Name", GroupName);
                    p.Add("@User_Name", UserName);
                    p.Add("@Region_Code", RegionCode);
                    lstGrpID = connection.Query<GroupModel>(SP_HD_INSERTNEWGROUP, p, commandType: CommandType.StoredProcedure).ToList();
                    if (UserCodes.Length>=8)
                    {
                        var GrpUserCodes = JsonConvert.DeserializeObject<List<string>>(UserCodes);
                        foreach (string usrcdes in GrpUserCodes)
                        {
                            var q = new DynamicParameters();
                            q.Add("@Group_User_Codes", usrcdes);
                            q.Add("@Group_Name", GroupName);
                            q.Add("@User_Name", UserName);
                            q.Add("@Group_Id", lstGrpID[0].Group_Id);
                            connection.Execute(SP_HD_INSERTNEWUSER, q, commandType: CommandType.StoredProcedure);
                        }
                        connection.Close();
                        result = 1;
                    }
                    else if(lstGrpID.Count == 1)
                    {
                        result = 1;
                       
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public List<MVCModels.UserGroup> GetGroupNames(string RegionCode)
        {
            List<MVCModels.UserGroup> lstGroup = new List<MVCModels.UserGroup>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", RegionCode);
                    lstGroup = connection.Query<MVCModels.UserGroup>(SP_HD_GETGROUPNAMES, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstGroup;
        }

        public UserGroupHistory GetGroupmembers(int Group_Id, string RegionCode)
        {
           // List<MVCModels.UserGroup> lstGroupMembs = new List<MVCModels.UserGroup>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Id", Group_Id);
                    p.Add("@Region_Code", RegionCode);
                    var multiselect = connection.QueryMultiple(SP_HD_GetGroupMembers, p, commandType: CommandType.StoredProcedure);
                    UserGroupHistory lstGroupMembs = new UserGroupHistory();
                    lstGroupMembs.User_Name = multiselect.Read<MVCModels.UserGroup>().ToList();
                    lstGroupMembs.GROUP_SEQ = multiselect.Read<MVCModels.GroupSeq>().ToList();
                    connection.Close();
                    //lstGroupMembs = connection.Query<MVCModels.UserGroup>(SP_HD_GetGroupMembers, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstGroupMembs;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
          

        }
        public List<MVCModels.UserCodeTree> GetUserCodesForTree(int Group_Id)
        {
            List<MVCModels.UserCodeTree> objGroupMembsLst = new List<MVCModels.UserCodeTree>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Id", Group_Id);
                    objGroupMembsLst = connection.Query<MVCModels.UserCodeTree>(SP_HD_GetTreeMembers, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return objGroupMembsLst;

        }
        public List<MVCModels.GroupUpdatedHistory> GetMembsUpdDateWise(int Group_Id, int GROUP_SEQ)
        {
            List<MVCModels.GroupUpdatedHistory> lstGroupHisMembs = new List<MVCModels.GroupUpdatedHistory>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Id", Group_Id);
                    p.Add("@GROUP_SEQ", GROUP_SEQ);
                    lstGroupHisMembs = connection.Query<MVCModels.GroupUpdatedHistory>(SP_HD_GetMembsUpdDateWise, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                   
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstGroupHisMembs;
        }
        
        public int UpdateGroupStatus(int Group_Id, int Status)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Id", Group_Id);
                    p.Add("@Status", Status);
                    connection.Execute(SP_HD_UpdateGroupStatus, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
                result = 1;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int UpdateGroupDetails(string UserCodes, string GroupName, int Group_Id, string UserName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                        var p = new DynamicParameters();
                        p.Add("@Group_Id", Group_Id);
                        p.Add("@User_Name", UserName);
                        connection.Execute(SP_HD_UpdateGroupDetails, p, commandType: CommandType.StoredProcedure);

                    if (!string.IsNullOrEmpty(UserCodes))
                    {
                        var GrpUserCodes = JsonConvert.DeserializeObject<List<string>>(UserCodes);

                        //string[] id = UserCodes.Split('^');
                        //for (int i = 0; i < id.Length; i++)
                        foreach (string usrcdes in GrpUserCodes)
                        {
                            var q = new DynamicParameters();
                            q.Add("@Group_User_Codes", usrcdes);
                            q.Add("@Group_Name", GroupName);
                            q.Add("@User_Name", UserName);
                            q.Add("@Group_Id", Group_Id);
                            connection.Execute(SP_HD_INSERTNEWUSER, q, commandType: CommandType.StoredProcedure);
                        }

                        connection.Close();
                        result = 1;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
    }
}
    

