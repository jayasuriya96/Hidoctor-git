using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MVCModels.HiDoctor_Reports;
using Dapper;

namespace DataControl.Repository
{
    public class DALAPI: DapperRepository
    {
        const string SPHDGETAPISERVICES = "sp_hdGetAPIServices";
        const string SPHDGETAPIUIBYSERVICEID = "sp_hdGetAPIUIByServiceId";
        const string SPHDBULKAPISVCLOG = "sp_hdBulkAPISvcLog";
        const string SP_HD_GETEXCELAPIPROCESSQUEUES = "USP_HD_GetExcelAPIProcessQueue";
        const string USPHDINSERTEXCELAPIPROCESSQUEUES = "USP_HD_InsertExcelAPIQueues";
        const string USPHDUPDATEEXCELAPIPROCESSQUEUES = "USP_HD_UpdateExcelAPIQueues";
        const string SP_HDGETEXCELAPIINPUTDATA = "SP_HdGetExcelApiInputData";
        

        public DataSet GetAPIServices(string companyCode,string userTypeCode)
        {
            try
            {
                Data objData = new Data();
                SqlCommand command = new SqlCommand(SPHDGETAPISERVICES);
                SPData objSPData = new SPData();
                command.CommandType = CommandType.StoredProcedure;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                DataSet dsRpt = objData.ExecuteGlobalDataSet(command);
                return dsRpt;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                DataSet ds = new DataSet();
                return ds;
            }
        }
        public DataSet GetAPIUIElements(int apiId)
        {
            try
            {
                Data objData = new Data();
                SPData objSPData = new SPData();
                SqlCommand command = new SqlCommand(SPHDGETAPIUIBYSERVICEID);
                command.CommandType = CommandType.StoredProcedure;
                objSPData.AddParamToSqlCommand(command, "@APIID", ParameterDirection.Input, SqlDbType.Int, 100, apiId);
                DataSet dsRpt = objData.ExecuteGlobalDataSet(command);
                return dsRpt;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("apiId", apiId.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                DataSet ds = new DataSet();
                return ds;
            }
        }
        public DataSet BulkAPISvcLog(string companyCode, string userName, string serviceId, string hdLogID, int apiID)
        {
            try
            {
                Data objData = new Data();
                SPData objSPData = new SPData();
                SqlCommand command = new SqlCommand(SPHDBULKAPISVCLOG);
                command.CommandType = CommandType.StoredProcedure;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 100, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 100, userName);
                objSPData.AddParamToSqlCommand(command, "@ServiceID", ParameterDirection.Input, SqlDbType.VarChar, 100, serviceId);
                objSPData.AddParamToSqlCommand(command, "@HDLogID", ParameterDirection.Input, SqlDbType.VarChar, 100, hdLogID);
                objSPData.AddParamToSqlCommand(command, "@APIID", ParameterDirection.Input, SqlDbType.Int, 100, apiID);

                DataSet dsRpt = objData.ExecuteGlobalDataSet(command);
                return dsRpt;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("apiId", apiID.ToString());
                dicObj.Add("hdLogID", hdLogID);
                dicObj.Add("serviceId", serviceId);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                DataSet ds = new DataSet();
                return ds;
            }
        }

        #region asynchronous process
        public IList<UsersExcelAPIQueues> GetUsersExcelAPIProcessQueue(string UserCode, int API_ID)
        {
            IList<UsersExcelAPIQueues> lstUsersExcelAPIProcessQueues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@UserCode", UserCode);
                    parameter.Add("@APIID", API_ID);

                    lstUsersExcelAPIProcessQueues = connection.Query<UsersExcelAPIQueues>(SP_HD_GETEXCELAPIPROCESSQUEUES, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstUsersExcelAPIProcessQueues;
        }

        public int InsertExcelAPITransactionQueue(string CompanyCode, string TransactionID, int API_ID, string Rpt_Parameters, string ProcessState, bool IsRptViewed, string TechError, string UserError, string Excel_File_Path, string Connection, string CurrUserCode)
        {

            int result = 0;
            try
            {
                IDbConnection connection = new SqlConnection(Connection);
                connection.Open();
                using (connection)
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);
                    p.Add("@Transaction_ID", TransactionID);
                    p.Add("@User_Code", CurrUserCode);
                    p.Add("@API_ID", API_ID);
                    p.Add("@Rpt_Parameters", Rpt_Parameters);
                    p.Add("@Rpt_Req_DateTime", DateTime.Now);
                    p.Add("@Process_State", ProcessState);
                    p.Add("@Excel_File_Path", Excel_File_Path);
                    p.Add("@Is_Report_Viewed", IsRptViewed);
                    p.Add("@Rpt_Viewed_DateTime", DateTime.Now);
                    p.Add("@Technical_Error_Desc", TechError);
                    p.Add("@User_Error_Desc", UserError);

                    result = connection.Execute(USPHDINSERTEXCELAPIPROCESSQUEUES, p, commandType: CommandType.StoredProcedure);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateExcelAPITransactionQueue(string TransactionID, string ProcessState, string TechError, string UserError, string Excel_File_Path, string Connection, string CurrUserCode)
        {

            int result = 0;
            try
            {
                IDbConnection connection = new SqlConnection(Connection);
                connection.Open();
                using (connection)
                {
                    var p = new DynamicParameters();
                    p.Add("@Transaction_ID", TransactionID);
                    p.Add("@Process_State", ProcessState);
                    p.Add("@Technical_Error_Desc", TechError);
                    p.Add("@User_Error_Desc", UserError);
                    p.Add("@Excel_File_Path", Excel_File_Path);

                    result = connection.Execute(USPHDUPDATEEXCELAPIPROCESSQUEUES, p, commandType: CommandType.StoredProcedure);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }
        #endregion asynchronous process


        public IEnumerable<ExcelApiInput> GetExcelApiInputData(string companyCode, string userCode,string regionCode,string sessionKey,string searchKey)
        {
            IEnumerable<ExcelApiInput> iEnuUsersExcelAPIProcessQueues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@SessionKey", sessionKey);
                    parameter.Add("@SearchKey", searchKey);
                    iEnuUsersExcelAPIProcessQueues = connection.Query<ExcelApiInput>(SP_HDGETEXCELAPIINPUTDATA, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return iEnuUsersExcelAPIProcessQueues;
        }
    }
}
