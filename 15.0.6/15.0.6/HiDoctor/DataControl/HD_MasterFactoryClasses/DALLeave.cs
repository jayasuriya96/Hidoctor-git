using DataControl.EnumType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using Dapper;
using MVCModels;

namespace DataControl
{
    public class DALLeave : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;
        private CurrentInfo _objCurInfo = new CurrentInfo();

        #region Constant Strings

        const string SP_HD_GetLeaveDeatils = "SP_HD_GetLeaveDeatils";
        const string SP_HD_ChangeStatusforLeaveType = "SP_HD_ChangeStatusforLeaveType";
        const string SP_HD_InsertLeaveType = "SP_HD_InsertLeaveType";
        const string SP_HD_UpdateLeaveType = "SP_HD_UpdateLeaveType";
        const string SP_HDGETACTIVELEAVETYPES = "SP_hdGetActiveLeaveTypes";
        const string SP_HDGETUSERLEAVETYPE = "SP_hdGetUserLeaveType";
        const string SP_HDGETUSERLEAVETAKEN = "SP_hdGetUserLeaveTaken";
        const string SP_HDGETUSERLEAVECURBALANCE = "SP_hdGetUserLeaveCurBalance";
        const string SP_HDGETSELECTEDUSERLEAVETYPEDETAILS = "SP_hdGetSelectedUserLeaveTypeDetails";
        const string SP_HDCHECKUSERLEAVETYPEMAPPING = "SP_hdCheckUserLeaveTypeMapping";
        //Added for expense approval screen (LOP)
        const string SP_HD_GETLOPSTATUS = "Sp_Hd_GetLopStatus";
        const string Usp_hd_Getuserbyusertypes = "Usp_hd_Getuserbyusertypes";
        const string Usp_hd_GetUserLeaveTypes = "Usp_hd_GetUserLeaveTypes";
        const string Usp_hd_GetLeaveTypeDetails = "Usp_hd_GetLeaveTypeDetails";
        const string Usp_HD_UpdateUserLeaveDetails = "Usp_HD_UpdateUserLeaveDetails";
        const string Usp_HD_AddNewLeaveType = "Usp_HD_AddNewLeaveType";

        //Added for User Leave Type Master Screen
        const string SP_HD_InsertUserLeaveTypeMapping = "SP_HD_InsertUserLeaveTypeMapping";

        //Added for Leave Balance Extension Screen
        const string SP_HD_Leave_Update_Extension = "SP_HD_Leave_Update_Extension";
        const string SP_HD_GetSelected_Leave_Details = "SP_HD_GetSelected_Leave_Details";
        const string Usp_hd_GetLeaveTypeFilterDetails = "Usp_hd_GetLeaveTypeFilterDetails";
        #endregion Constant Strings

        #region Public Methods

        public DataSet GetLeaveTypeDetails(string companycode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GetLeaveDeatils);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companycode", ParameterDirection.Input, SqlDbType.VarChar, 30, companycode);
                _objData.OpenConnection(companycode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<MVCModels.LeaveModel> GetLopStatus(string companycode)
        {
            List<MVCModels.LeaveModel> lstLops = new List<MVCModels.LeaveModel>();

            using (IDbConnection connection = IDbOpenConnection())
            {
                lstLops = connection.Query<MVCModels.LeaveModel>(SP_HD_GETLOPSTATUS, new { Company_Code = companycode }, commandType: CommandType.StoredProcedure).ToList();
            }
            return lstLops;
        }

        public string ChangeStatus(string CompanyCode, string LeaveTypeCode, string status)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_ChangeStatusforLeaveType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objData.OpenConnection(CompanyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertLeaveType(string companyCode, string LeaveTypeCode, string LeaveTypeName, string LeaveTypeStatus, string createdBy, string createdDate, string payrollleavetypeCode, string IsLop)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_InsertLeaveType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeName);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeStatus);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 10, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@CreatedDate", ParameterDirection.Input, SqlDbType.VarChar, 10, createdDate);
                _objSPData.AddParamToSqlCommand(command, "@PayrollleavetypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, payrollleavetypeCode);
                _objSPData.AddParamToSqlCommand(command, "@IsLOP", ParameterDirection.Input, SqlDbType.VarChar, 10, IsLop);

                _objData.OpenConnection(companyCode);
                string returnValue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnValue);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateLeaveType(string CompanyCode, string LeaveTypeCode, string LeaveTypeName, string updatedBy, string updatedDate, string payrollleavetypeCode, string IsLop)
        {
            try
            {
                _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(SP_HD_UpdateLeaveType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@LeaveTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, LeaveTypeName);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 10, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 10, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@PayrollleavetypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, payrollleavetypeCode);
                _objSPData.AddParamToSqlCommand(command, "@IsLOP", ParameterDirection.Input, SqlDbType.VarChar, 10, IsLop);
                _objData.OpenConnection(CompanyCode);
                string returnvale = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvale);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public IEnumerable<MVCModels.LeaveTypeModel> GetActiveLeaveType(string companyCode)
        {
            IEnumerable<MVCModels.LeaveTypeModel> lstleaveType = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstleaveType = connection.Query<MVCModels.LeaveTypeModel>(SP_HDGETACTIVELEAVETYPES,
                                  new { CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstleaveType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstleaveType;
            }
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> GetUserLeaveType(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleaveType = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserleaveType = connection.Query<MVCModels.UserLeaveTypeModel>(SP_HDGETUSERLEAVETYPE,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUserleaveType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstUserleaveType;
            }
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> GetSelectedUserLeaveType(string companyCode, string userLeaveTypeCode)
        {
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleaveType = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserleaveType = connection.Query<MVCModels.UserLeaveTypeModel>(SP_HDGETSELECTEDUSERLEAVETYPEDETAILS,
                                  new { Company_Code = companyCode, User_Leave_Type_Code = userLeaveTypeCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUserleaveType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstUserleaveType;
            }
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> CheckUserLeaveTypeMapping(string companyCode, string userCode, string userTypeCode, string leaveTypeCode, string effectiveFrom, string effectiveTo)
        {
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleaveType = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserleaveType = connection.Query<MVCModels.UserLeaveTypeModel>(SP_HDCHECKUSERLEAVETYPEMAPPING,
                                  new { Company_Code = companyCode, Leave_Type_Code = leaveTypeCode, User_Type_Code = userTypeCode, User_Code = userCode, Effective_From = effectiveFrom, Effective_To = effectiveTo },
                                  commandType: CommandType.StoredProcedure);
                    return lstUserleaveType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstUserleaveType;
            }
        }
        public int InsertUserLeaveTypeMaster(string Company_Code, string Effective_From, string Effective_To, string IS_Added_Weekend_Holiday,
                    string IS_Added_Holiday, string Leave_Type_Code, string Min_Leave, string Max_Leave, string User_Code, string User_Type_Code,
                    string Created_By, string Created_Date, string User_Leave_Status, string Updated_By, string Updated_Date,
                    string User_Leave_Type_Code, string clubbing, int leaveeligible, string leaveconfirmation, string leaveoncompletion, int noofdays,int applicdays, string validation_Mode, string leave_Occurrence_Count, string leave_Max_Count, string Document_Upload, string consecutvie_Leave_Allowed, string mode)
        {
            //int rowsAffected = 0;
            try
            {
                _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(SP_HD_InsertUserLeaveTypeMapping);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Effective_From", ParameterDirection.Input, SqlDbType.VarChar, 30, Effective_From);
                _objSPData.AddParamToSqlCommand(command, "@Effective_To", ParameterDirection.Input, SqlDbType.VarChar, 30, Effective_To);
                _objSPData.AddParamToSqlCommand(command, "@IS_Added_Weekend_Holiday", ParameterDirection.Input, SqlDbType.VarChar, 1, IS_Added_Weekend_Holiday);
                _objSPData.AddParamToSqlCommand(command, "@IS_Added_Holiday", ParameterDirection.Input, SqlDbType.VarChar, 1, IS_Added_Holiday);
                _objSPData.AddParamToSqlCommand(command, "@Leave_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Leave_Type_Code);
                _objSPData.AddParamToSqlCommand(command, "@Min_Leave", ParameterDirection.Input, SqlDbType.VarChar, 8, Min_Leave);
                _objSPData.AddParamToSqlCommand(command, "@Max_Leave", ParameterDirection.Input, SqlDbType.VarChar, 8, Max_Leave);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Type_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Leave_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Leave_Type_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Leave_Status", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Leave_Status);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, Created_By);
                _objSPData.AddParamToSqlCommand(command, "@Created_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, Created_Date);
                _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 30, Updated_By);
                _objSPData.AddParamToSqlCommand(command, "@Updated_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, Updated_Date);
                _objSPData.AddParamToSqlCommand(command, "@clubbing", ParameterDirection.Input, SqlDbType.VarChar, 200, clubbing);
                _objSPData.AddParamToSqlCommand(command, "@leaveeligible", ParameterDirection.Input, SqlDbType.Int, 32, leaveeligible);
                _objSPData.AddParamToSqlCommand(command, "@leaveconfirmation", ParameterDirection.Input, SqlDbType.VarChar, 10, leaveconfirmation);
                _objSPData.AddParamToSqlCommand(command, "@leaveoncompletion", ParameterDirection.Input, SqlDbType.VarChar, 10, leaveoncompletion);
                _objSPData.AddParamToSqlCommand(command, "@noofdays", ParameterDirection.Input, SqlDbType.Int, 32, noofdays);
                _objSPData.AddParamToSqlCommand(command, "@applicdays", ParameterDirection.Input, SqlDbType.Int, 32, applicdays);
                _objSPData.AddParamToSqlCommand(command, "@Validation_Mode", ParameterDirection.Input, SqlDbType.VarChar, 1, validation_Mode);
                _objSPData.AddParamToSqlCommand(command, "@Leave_Occurrence_Count", ParameterDirection.Input, SqlDbType.VarChar, 10, leave_Occurrence_Count);
                _objSPData.AddParamToSqlCommand(command, "@Leave_Max_Count", ParameterDirection.Input, SqlDbType.VarChar, 10, leave_Max_Count);
                _objSPData.AddParamToSqlCommand(command, "@Document_Upload", ParameterDirection.Input, SqlDbType.VarChar, 10, Document_Upload);
                _objSPData.AddParamToSqlCommand(command, "@Consecutvie_Leave_Allowed", ParameterDirection.Input, SqlDbType.VarChar, 10, consecutvie_Leave_Allowed);
                _objSPData.AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objData.OpenConnection(Company_Code);
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeleteUserLeaveTypeMaster(string companyCode, string userLeaveTypeCode, string status, string updatedBy, string updatedDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string updateQry = "UPDATE tbl_SFA_User_Leave_Type_Master SET User_Leave_Status = @User_Leave_Status, " +
                                             "Updated_By= @Updated_By , Updated_Date = @Updated_Date " +
                                             "WHERE Company_Code = @Company_Code AND User_Leave_Type_Code =@User_Leave_Type_Code";

                    rowsAffected = connection.Execute(updateQry, new
                    {
                        User_Leave_Status = status,
                        Company_Code = companyCode,
                        User_Leave_Type_Code = userLeaveTypeCode,
                        Updated_By = updatedBy,
                        Updated_Date = updatedDate
                    }, transaction: trans);

                    trans.Commit();
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userLeaveTypeCode", userLeaveTypeCode);
                dicObj.Add("status", status);
                dicObj.Add("updatedBy", updatedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }
        #region Employee Leave Taken
        /// <summary>
        /// Get user leave taken
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns>returns the leave details of the selected user</returns>
        public IEnumerable<MVCModels.DCRLeaveEntryModel> GetUserLeaveTaken(string companyCode, string userCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.DCRLeaveEntryModel> lstUserleave = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserleave = connection.Query<MVCModels.DCRLeaveEntryModel>(SP_HDGETUSERLEAVETAKEN,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = startDate, ToDate = endDate },
                                  commandType: CommandType.StoredProcedure);
                    return lstUserleave;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstUserleave;
            }
        }
        /// <summary>
        /// Get User leave cur balance
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>return the list of cur balance leave for the selected user</returns>
        public IEnumerable<MVCModels.LeaveCurBalance> GetUserLeaveCurBalance(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.LeaveCurBalance> lstUserleave = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserleave = connection.Query<MVCModels.LeaveCurBalance>(SP_HDGETUSERLEAVECURBALANCE,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUserleave;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return lstUserleave;
            }
        }
        #endregion Employee Leave Taken
        #endregion Public Methods

        public List<MVCModels.UsersForLeaveBalance> GetUsersForTree(string companyCode, string userTypeCode)
        {
            List<MVCModels.UsersForLeaveBalance> objusercodes = new List<MVCModels.UsersForLeaveBalance>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@userTypeCode", userTypeCode);
                    objusercodes = connection.Query<MVCModels.UsersForLeaveBalance>(Usp_hd_Getuserbyusertypes, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return objusercodes;

        }

        public List<MVCModels.UserTypeLeaveType> GetUserTypeLeave(string companyCode, string UserTypeCode, string cal_Year)
        {
            List<MVCModels.UserTypeLeaveType> objusercodes = new List<MVCModels.UserTypeLeaveType>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserTypeCode", UserTypeCode);
                    p.Add("@cal_Year", cal_Year);
                    objusercodes = connection.Query<MVCModels.UserTypeLeaveType>(Usp_hd_GetUserLeaveTypes, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return objusercodes;
        }

        //public List<MVCModels.UserLeaveDetails> GetUserLeaveDetails(string companyCode, string LeaveTypeCode, string userTypeCode, string Usercodes)
        //{
        //    List<MVCModels.UserLeaveDetails> obLeaveTypeDet = new List<MVCModels.UserLeaveDetails>();
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@CompanyCode", companyCode);
        //            p.Add("@LeaveTypeCode", LeaveTypeCode);
        //            p.Add("@UserTypeCode", userTypeCode);
        //            p.Add("@Usercodes", Usercodes);
        //            obLeaveTypeDet = connection.Query<MVCModels.UserLeaveDetails>(Usp_hd_GetLeaveTypeDetails, p, commandType: CommandType.StoredProcedure).ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return obLeaveTypeDet;
        //}

        public IEnumerable<MVCModels.UserLeaveDetails> GetUserLeaveDetails(string companyCode, DataTable dtLeaveTypeCodes, string userTypeCode, DataTable dtUserCodes)
        {
            List<MVCModels.UserLeaveDetails> obLeaveTypeDet = new List<MVCModels.UserLeaveDetails>();
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(Usp_hd_GetLeaveTypeDetails);
                command.CommandType = CommandType.StoredProcedure;

                SqlDataReader sqlReader;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                if (dtUserCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_LeaveUserCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, dtUserCodes, "TVP_LeaveUserCodes");
                }

                if (dtLeaveTypeCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveTypeCode", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_LeaveTypeCode");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveTypeCode", ParameterDirection.Input, SqlDbType.Structured, dtLeaveTypeCodes, "TVP_LeaveTypeCode");
                }
                _objData.OpenConnection(companyCode);
                command.Connection = objSqlConnection;
                using (sqlReader = _objData.ExecuteReader(command))
                {
                    while (sqlReader.Read())
                    {
                        MVCModels.UserLeaveDetails lstUserLeave = new MVCModels.UserLeaveDetails();
                        lstUserLeave.User_Name = sqlReader["User_Name"].ToString();
                        lstUserLeave.User_Code = sqlReader["User_Code"].ToString();
                        lstUserLeave.Leave_Type_Name = sqlReader["Leave_Type_Name"].ToString();
                        lstUserLeave.Leave_Type_Code = sqlReader["Leave_Type_Code"].ToString();
                        lstUserLeave.Balance_CF = Convert.ToDecimal(sqlReader["Balance_CF"]);
                        lstUserLeave.Leave_Eligible = Convert.ToDecimal(sqlReader["Leave_Eligible"]);
                        lstUserLeave.Opening_Balance = Convert.ToDecimal(sqlReader["Opening_Balance"]);
                        lstUserLeave.Leave_Taken = Convert.ToDecimal(sqlReader["Leave_Taken"]);
                        lstUserLeave.Leave_Balance = Convert.ToDecimal(sqlReader["Leave_Balance"]);
                        lstUserLeave.Lapsed = Convert.ToDecimal(sqlReader["Lapsed"]);
                        lstUserLeave.Effective_From = sqlReader["Effective_From"].ToString();
                        lstUserLeave.Effective_To = sqlReader["Effective_To"].ToString();
                        lstUserLeave.User_Leave_Code = sqlReader["User_Leave_Code"].ToString();
                        obLeaveTypeDet.Add(lstUserLeave);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return obLeaveTypeDet;
        }

        public IEnumerable<MVCModels.UserLeaveDetails> GetUserLeaveFilterDetails(string companyCode, DataTable dtLeaveTypeCodes, DataTable dtUserCodes, string Year)
        {
            List<MVCModels.UserLeaveDetails> obLeaveTypeDet = new List<MVCModels.UserLeaveDetails>();
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(Usp_hd_GetLeaveTypeFilterDetails);
                command.CommandType = CommandType.StoredProcedure;

                SqlDataReader sqlReader;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, Year);
                if (dtUserCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_LeaveUserCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, dtUserCodes, "TVP_LeaveUserCodes");
                }

                if (dtLeaveTypeCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveTypeCode", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_LeaveTypeCode");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveTypeCode", ParameterDirection.Input, SqlDbType.Structured, dtLeaveTypeCodes, "TVP_LeaveTypeCode");
                }
                _objData.OpenConnection(companyCode);
                command.Connection = objSqlConnection;
                using (sqlReader = _objData.ExecuteReader(command))
                {
                    while (sqlReader.Read())
                    {
                        MVCModels.UserLeaveDetails lstUserLeave = new MVCModels.UserLeaveDetails();
                        lstUserLeave.User_Name = sqlReader["User_Name"].ToString();
                        lstUserLeave.User_Code = sqlReader["User_Code"].ToString();
                        lstUserLeave.Leave_Type_Name = sqlReader["Leave_Type_Name"].ToString();
                        lstUserLeave.Leave_Type_Code = sqlReader["Leave_Type_Code"].ToString();
                        lstUserLeave.Balance_CF = Convert.ToDecimal(sqlReader["Balance_CF"]);
                        lstUserLeave.Leave_Eligible = Convert.ToDecimal(sqlReader["Leave_Eligible"]);
                        lstUserLeave.Opening_Balance = Convert.ToDecimal(sqlReader["Opening_Balance"]);
                        lstUserLeave.Leave_Taken = Convert.ToDecimal(sqlReader["Leave_Taken"]);
                        lstUserLeave.Leave_Balance = Convert.ToDecimal(sqlReader["Leave_Balance"]);
                        lstUserLeave.Lapsed = Convert.ToDecimal(sqlReader["Lapsed"]);
                        lstUserLeave.Effective_From = sqlReader["Effective_From"].ToString();
                        lstUserLeave.Effective_To = sqlReader["Effective_To"].ToString();
                        lstUserLeave.User_Leave_Code = sqlReader["User_Leave_Code"].ToString();
                        obLeaveTypeDet.Add(lstUserLeave);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return obLeaveTypeDet;
        }

        public IEnumerable<MVCModels.AddUserLeave> AddNewLeaveType(string companyCode, string UserName, string NewLeaveType, string userTypeCode, DataTable dtUserCodes, string Effective_From, string Effective_To)
        {
            List<MVCModels.AddUserLeave> objAddLeave = new List<MVCModels.AddUserLeave>();
            SqlConnection objSqlConnection = new SqlConnection();
            Effective_From = Effective_From.Split('/')[2] + '-' + Effective_From.Split('/')[1] + '-' + Effective_From.Split('/')[0];
            Effective_To = Effective_To.Split('/')[2] + '-' + Effective_To.Split('/')[1] + '-' + Effective_To.Split('/')[0];
            _objSPData = new SPData();
            _objData = new Data();
            //int rowsAffected = 0;
            try
            {

                SqlCommand command = new SqlCommand(Usp_HD_AddNewLeaveType);
                command.CommandType = CommandType.StoredProcedure;

                SqlDataReader sqlReader;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, UserName);
                _objSPData.AddParamToSqlCommand(command, "@NewLeaveType", ParameterDirection.Input, SqlDbType.VarChar, 30, NewLeaveType);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@Effective_From", ParameterDirection.Input, SqlDbType.VarChar, 10, Effective_From);
                _objSPData.AddParamToSqlCommand(command, "@Effective_To", ParameterDirection.Input, SqlDbType.VarChar, 10, Effective_To);
                if (dtUserCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_LeaveUserCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_LeaveUserCodes", ParameterDirection.Input, SqlDbType.Structured, dtUserCodes, "TVP_LeaveUserCodes");
                }
                //SqlParameter returnvalue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnvalue.Direction = ParameterDirection.Output;
                //returnvalue.Size = 500;
                //command.Parameters.Add(returnvalue);
                _objData.OpenConnection(companyCode);
                command.Connection = objSqlConnection;
                using (sqlReader = _objData.ExecuteReader(command))
                {
                    while (sqlReader.Read())
                    {
                        MVCModels.AddUserLeave lstAddLeave = new MVCModels.AddUserLeave();
                        lstAddLeave.User_Code = sqlReader["User_Code"].ToString();
                        lstAddLeave.User_Name = sqlReader["User_Name"].ToString();
                        lstAddLeave.Leave_Type_Code = sqlReader["Leave_Type_Code"].ToString();
                        lstAddLeave.Leave_Type_Name = sqlReader["Leave_Type_Name"].ToString();
                        lstAddLeave.HiDoctor_Start_Date = sqlReader["HiDoctor_Start_Date"].ToString();
                        lstAddLeave.Effective_From = sqlReader["Effective_From"].ToString();
                        lstAddLeave.Effective_To = sqlReader["Effective_To"].ToString();
                        lstAddLeave.Remarks = sqlReader["Remarks"].ToString();
                        objAddLeave.Add(lstAddLeave);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return objAddLeave;
        }

        public bool UpdateUserLeaveDetails(string companyCode, string Usercode, string LeaveTypeCode, string userTypeCode, string UserCode, float BalCF, float LeaveElg, float OpenBal, float LvTkn, float Lapsed, float LeaveBal)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@LoggedUsercode", Usercode);
                    p.Add("@LeaveTypeCode", LeaveTypeCode);
                    p.Add("@userTypeCode", userTypeCode);
                    p.Add("@UserCode", UserCode);
                    p.Add("@BalanceCF", BalCF);
                    p.Add("@LeaveElg", LeaveElg);
                    p.Add("@OpeningBal", OpenBal);
                    p.Add("@LeaveTkn", LvTkn);
                    p.Add("@LeaveBal", LeaveBal);
                    p.Add("@Lapsed", Lapsed);
                    connection.Execute(Usp_HD_UpdateUserLeaveDetails, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public string BulkUpdateUserLeaveDetails(string Company_Code, List<UpdateLeavelist> obj)
        {
            string result = "";
            int success = 0;
            for(int i = 0; i < obj.Count(); i++)
            {
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@Company_Code", Company_Code);
                        p.Add("@User_Leave_Code", obj[i].User_Leave_Code);
                        p.Add("@Balance_CF", obj[i].Balance_CF);
                        p.Add("@Leave_Eligible", obj[i].Leave_Eligible);
                        p.Add("@Lapsed", obj[i].Lapsed);
                        p.Add("@Opening_Balance", obj[i].Opening_Balance);
                        p.Add("@Leave_Balance", obj[i].Leave_Balance);
                        connection.Execute(SP_HD_Leave_Update_Extension, p, commandType: CommandType.StoredProcedure);
                        success++;
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                result = success + " out of " + obj.Count() + " records have been successfully updated.";
            }
            return result;
        }

        public List<UserLeaveDetails> GetSelectedLeaveDetails(string Company_Code, string User_Leave_Code)
        {
            List<UserLeaveDetails> lstLeaveDetails = new List<UserLeaveDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Leave_Code", User_Leave_Code);
                    lstLeaveDetails = connection.Query<UserLeaveDetails>(SP_HD_GetSelected_Leave_Details, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstLeaveDetails;
        }
    }

}
