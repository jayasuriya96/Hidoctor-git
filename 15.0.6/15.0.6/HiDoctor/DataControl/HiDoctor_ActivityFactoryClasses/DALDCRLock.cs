#region Usings
using MVCModels;
using System.Collections.Generic;
using DataControl;
using System.Data.SqlClient;
using System.Data;
using System;
using System.Linq;
using MVCModels.HiDoctor_Master;
using Microsoft.SqlServer.Server;
using Dapper;
using ElmahWrapper;
#endregion Usings

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DALDCRLock : DapperRepository
    {
        #region Private  Variables
        private Data _objData = new Data();
        #endregion Private  Variables

        #region Constant Variables
        const string SP_HD_GETACTIVITYLOCKSFORRELEASE = "SP_hd_GetActivityLocksForRelease";
        const string SP_HD_GETACTIVITYLOCKUSERS = "SP_Hd_GetActivityLockUsers";
        const string SP_HD_RELEASEACTIVITYLOCK = "SP_Hd_ReleaseActivityLock";
        const string SP_HD_INSERT_DCR_UNAPPROVE_LOCK = "SP_HD_INSERT_DCR_UNAPPROVE_LOCK";
        //const string SP_HDINSERTDCRMANUALLOCK = "SP_HDInsertDCRManualLock";
        const string SP_HDINSERTDCRMANUALLOCKNEW = "SP_HDInsertDCRManualLock_New";
        const string DCR_ACTIVITY_TVP_NAME = "DCR_ACTIVITY_TVP";

        //DcR lock approval
        const string SP_HD_GETACTIVITYLOCKTYPEFORDCRAPPROVAL = "SP_hd_GetActivityLocktypeforDCRApproval";
        const string SP_Hd_Get_User_Header_Detail = "SP_Hd_Get_User_Header_Detail";
        #endregion Constant Variables

        /// <summary>
        /// Retrieves the Activity Lock For Per user.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public List<DCRActivityLockModel> GetActivityLocksForSingleUser(string company_Code, string user_Code)
        {
            try
            {
                SPData _objSPData = new SPData();
                
                // set command objects
                SqlCommand command = new SqlCommand(SP_HD_GETACTIVITYLOCKSFORRELEASE);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);

                // Opens the connection.
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the user model list.
                    return ActvityDataReader_MaptoList(reader);
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
        }

        /// <summary>
        /// Retrievs the Activity locked users list.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public List<UserModel> GetActivityLockUsers(string company_Code)
        {
            try
            {
                SPData _objSPData = new SPData();

                // set command objects
                SqlCommand command = new SqlCommand(SP_HD_GETACTIVITYLOCKUSERS);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);

                // Opens the connection.
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the list.
                    return ActvityLockUserDataReader_MaptoList(reader);
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
        }

        public class DCRActivityLockEnumerator : IEnumerable<SqlDataRecord>
        {

            public DCRActivityLockEnumerator(IEnumerable<DCRActivityLockModel> data)
            {
                _data = data;
            }
            private IEnumerable<DCRActivityLockModel> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("DCR_Actual_Date", SqlDbType.VarChar, 50),
         new SqlMetaData("Activity_Flag", SqlDbType.VarChar, 10),
         new SqlMetaData("Request_Released_By", SqlDbType.VarChar, 30),
         new SqlMetaData("Released_Reason", SqlDbType.VarChar, 250),

          };
                int i = 0;
                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    record.SetValue(0, ++i);
                    record.SetValue(1, item.DCR_Actual_Date);
                    record.SetValue(2, item.Activity_Flag);
                    record.SetValue(3, item.Request_Released_By);
                    record.SetValue(4, item.Released_Reason);
                    yield return record;
                }

            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }

        public string ReleaseActivityLock(string companyCode, string userCode, string releasedBy, IEnumerable<DCRActivityLockModel> IdcrDetailsModel)
        {
            try
            {
                SPData _objSPData = new SPData();

                // set command objects
                SqlCommand command = new SqlCommand(SP_HD_RELEASEACTIVITYLOCK);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Released_By", ParameterDirection.Input, SqlDbType.NVarChar, 30, releasedBy);
                //_objSPData.AddParamToSqlCommand(command, "@Request_Released_By", ParameterDirection.Input, SqlDbType.NVarChar, 30, requestreleasedby);
                //_objSPData.AddParamToSqlCommand(command, "@Released_Reason", ParameterDirection.Input, SqlDbType.NVarChar, 30, releasedreason);
                _objSPData.AddParamToSqlCommand(command, "@Released_Date", ParameterDirection.Input, SqlDbType.NVarChar, 12, DateTime.Now.ToShortDateString());
                if (((List<DCRActivityLockModel>)IdcrDetailsModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DCRACTIVITY_TEMP", ParameterDirection.Input, SqlDbType.Structured, null, DCR_ACTIVITY_TVP_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DCRACTIVITY_TEMP", ParameterDirection.Input, SqlDbType.Structured, new DCRActivityLockEnumerator(IdcrDetailsModel), DCR_ACTIVITY_TVP_NAME);
                }
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                // Opens the connection.
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                string result = command.Parameters["@Result"].Value.ToString();
                _objData.CloseConnection();
                return result;
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="activityLockModel"></param>
        /// <returns></returns>
        public int InsertDCRActivityLock(string company_Code, List<DCRActivityLockModel> lstDCRActivityLockModel)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    //   IDbTransaction trans = connection.BeginTransaction();

                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", company_Code);
                    parameter.Add("@UserCode", lstDCRActivityLockModel[0].User_Code);
                    parameter.Add("@DcrDate", lstDCRActivityLockModel[0].DCR_Actual_Date);
                    parameter.Add("@DcrFlag", lstDCRActivityLockModel[0].Activity_Flag);

                    rowsAffected = connection.Query<int>(SP_HD_GETACTIVITYLOCKTYPEFORDCRAPPROVAL, parameter, commandType: CommandType.StoredProcedure).Single();
                    if (rowsAffected > 0)
                    {
                        #region - DCR Lock and move to DCR Lock release history
                        //If any lock relese on that day have to move it to History table and delete it from original table

                        rowsAffected = 0;
                        string query = "INSERT INTO tbl_SFA_DCR_Lock_Release_Log_History" +
                                        "(Logged_Date,Company_Code,User_Code,Locked_Date,Released_Date,Lock_Status,Released_By,Record_Status,Ref_Key1,Ref_Key2" +
                                        ", Lock_Type,Lock_Reason,DCR_Actual_Date,Activiy_Flag,TP_Month,TP_Year)" +
                                        "SELECT GETDATE(),Company_Code,User_Code,Locked_Date,Released_Date,Lock_Status,Released_By,Record_Status,Ref_Key1,Ref_Key2" +
                                        ", Lock_Type,Lock_Reason,DCR_Actual_Date,Activiy_Flag,TP_Month,TP_Year FROM tbl_SFA_DCR_Lock WHERE User_Code = @UserCode AND DCR_Actual_Date=@DcrDate AND Activiy_Flag = @DcrFlag AND Company_Code = @CompanyCode";
                        rowsAffected = connection.Execute(query, new
                        {
                            CompanyCode = company_Code,
                            UserCode = lstDCRActivityLockModel[0].User_Code,
                            DcrDate = lstDCRActivityLockModel[0].DCR_Actual_Date,
                            DcrFlag = lstDCRActivityLockModel[0].Activity_Flag,
                        });
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            string deleteQuery = "DELETE FROM Tbl_sfa_DCR_Lock WHERE User_Code = @UserCode AND DCR_Actual_Date=@DcrDate AND Activiy_Flag = @DcrFlag AND Company_Code = @CompanyCode";
                            rowsAffected = connection.Execute(deleteQuery, new
                            {
                                CompanyCode = company_Code,
                                UserCode = lstDCRActivityLockModel[0].User_Code,
                                DcrDate = lstDCRActivityLockModel[0].DCR_Actual_Date,
                                DcrFlag = lstDCRActivityLockModel[0].Activity_Flag,
                            });
                        }
                        #endregion - DCR Lock and move to DCR Lock release history
                    }
                    //else
                    //{
                    #region InsertUnapproveLock

                    rowsAffected = 0;

                    string insertQuery = "INSERT INTO tbl_SFA_DCR_Lock" +
                                         "(Company_Code, User_Code, Locked_Date, Lock_Status, Lock_Type, Activiy_Flag" +
                                         ", DCR_Actual_Date, Record_Status)" +
                                         "VALUES(@Company_Code, @User_Code, @Locked_Date, @Lock_Status,@Lock_Type, @Flag" +
                                         ", @DCR_Actual_Date, @Record_Status)";

                    rowsAffected = connection.Execute(insertQuery, new
                    {
                        Company_Code = company_Code,
                        User_Code = lstDCRActivityLockModel[0].User_Code,
                        Locked_Date = lstDCRActivityLockModel[0].Locked_Date,
                        Lock_Status = "LOCKED",
                        Lock_Type = "ACTIVITY_LOCK",
                        Flag = lstDCRActivityLockModel[0].Activity_Flag,
                        DCR_Actual_Date = lstDCRActivityLockModel[0].DCR_Actual_Date,
                        Record_Status = "1",
                    });
                    // transaction: trans);
                    #endregion Update DCRInsertUnapproveLock
                    // }
                    //trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

            //try
            //{
            //    SPData _objSPData = new SPData();
            //    _objData.OpenConnection();
            //    foreach (DCRActivityLockModel dcrActivityLockModel in lstDCRActivityLockModel)
            //    {
            //        // set command objects
            //        SqlCommand command = new SqlCommand(SP_HD_INSERT_DCR_UNAPPROVE_LOCK);
            //        command.CommandType = CommandType.StoredProcedure;

            //        // assign to parameters to command object.
            //        _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
            //        _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, dcrActivityLockModel.User_Code);
            //        _objSPData.AddParamToSqlCommand(command, "@Locked_Date", ParameterDirection.Input, SqlDbType.NVarChar, 30, dcrActivityLockModel.Locked_Date);
            //        _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.NVarChar, dcrActivityLockModel.DCR_Actual_Date.Length, dcrActivityLockModel.DCR_Actual_Date);
            //        _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.NVarChar, dcrActivityLockModel.Activity_Flag.Length, dcrActivityLockModel.Activity_Flag);

            //        // Opens the connection.
            //        _objData.ExecuteNonQuery(command);
            //    }
            //    _objData.CloseConnection();
            //    return true;
            //}
            //catch
            //{
            //    return false;
            //}
            //finally
            //{
            //    _objData.CloseConnection();
            //}
        }

        /// <summary>
        /// Converts the activity lock users reader to list.
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private List<UserModel> ActvityLockUserDataReader_MaptoList(SqlDataReader reader)
        {
            List<UserModel> lstActivityLockUsers = new List<UserModel>();
            while (reader.Read())
            {
                UserModel userModel = new UserModel();
                userModel.User_Code = reader["User_Code"].ToString();
                lstActivityLockUsers.Add(userModel);
            }

            return lstActivityLockUsers;
        }

        /// <summary>
        /// Convertes the LockReader to Lock Model List.
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private List<DCRActivityLockModel> ActvityDataReader_MaptoList(SqlDataReader reader)
        {
            List<DCRActivityLockModel> lstdcrLockModel = new List<DCRActivityLockModel>();
            while (reader.Read())
            {
                DCRActivityLockModel dcrLockModel = new DCRActivityLockModel();

                dcrLockModel.DCR_Actual_Date = reader["DCR_Actual_Date"].ToString();
                dcrLockModel.User_Code = reader["User_Code"].ToString();
                dcrLockModel.User_Name = reader["User_Name"].ToString();
                dcrLockModel.Locked_Date = reader["Locked_Date"].ToString();
                dcrLockModel.Activity_Flag = reader["Activity_Flag"].ToString();
                dcrLockModel.Unapprove_Reason = reader["Unapproval_Reason"].ToString();
                dcrLockModel.Unapproved_by = reader["Unapproved_by"].ToString();
                
                lstdcrLockModel.Add(dcrLockModel);
            }
            return lstdcrLockModel;
        }

        public bool InsertDCRManualLock(string company_Code, string locked_user_Codes, string lockDateFrom, string lockDateTo, string user_Code, string lockReason)
        {
            SqlConnection objSqlConnection = new SqlConnection();
            string ErrorUsername = string.Empty;
            try
            {
                SPData _objSPData = new SPData();
                Data _objData = new Data();
                // set command objects
                //SqlCommand command = new SqlCommand(SP_HDINSERTDCRMANUALLOCK);
                SqlCommand command = new SqlCommand(SP_HDINSERTDCRMANUALLOCKNEW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 600;
                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@Lock_User_Codes", ParameterDirection.Input, SqlDbType.VarChar, locked_user_Codes.Length, locked_user_Codes);
                _objSPData.AddParamToSqlCommand(command, "@LockPeriodFrom", ParameterDirection.Input, SqlDbType.VarChar, 12, lockDateFrom);
                _objSPData.AddParamToSqlCommand(command, "@LockPeriodTo", ParameterDirection.Input, SqlDbType.VarChar, 12, lockDateTo);
                _objSPData.AddParamToSqlCommand(command, "@lock_Reason", ParameterDirection.Input, SqlDbType.VarChar, 255, lockReason);
                _objSPData.AddParamToSqlCommand(command, "@ErrorName", ParameterDirection.Output, SqlDbType.VarChar, 500, ErrorUsername);
                //SqlParameter returnValue = new SqlParameter("@ErrorName", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                // Opens the connection.
                //objSqlConnection = _objData.GetConnectionObject(company_Code);
                //objSqlConnection.Open();
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                //command.Connection = objSqlConnection;
                ErrorUsername = command.Parameters["@ErrorName"].Value.ToString();
                //using (SqlDataReader sqlReader = command.ExecuteReader())
                //{
                //    while (sqlReader.Read())
                //    {
                //        ErrorUsername = sqlReader["ErrorName"].ToString();
                //    }
                //}
                return true;
            }
            catch (Exception ex)
            {
                //ErrorLog.LogError(ex, "InsertDCRLock")
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public List<UserModel> EmployeeDetails(string companycode, string user_Code)
        {


            List<UserModel> lstemployee;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", user_Code);

                    lstemployee = connection.Query<UserModel>("SP_Hd_Get_User_Header_Detail", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstemployee;
        }
    }
}