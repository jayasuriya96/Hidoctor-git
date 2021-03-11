using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using ElmahWrapper;

namespace DataControl
{
    public class DAL_DCRReport
    {
        const string SP_HD_V4_GetNextTwoPossibleDays = "SP_HD_V4_GetNextTwoPossibleDays";
        const string SP_HD_V4_GetDailyPlanHeader = "SP_HD_V4_GetDailyPlanHeader";
        const string SP_HD_V4_GetDailyPlanDoctorYTD = "SP_HD_V4_GetDailyPlanDoctorYTD";
        const string SP_hdGetDoctorProductMappimgDetail = "SP_hdGetDoctorProductMappimgDetail";
        const string SP_hdGetProductGivenInLastMonth = "SP_hdGetProductGivenInLastMonth";
        const string SP_hdGetGiftsGivenYTD = "SP_hdGetGiftsGivenYTD";
        const string SP_hdGetOurBrandProducts = "SP_hdGetOurBrandProducts";
        const string SP_hdGetCompetitorBrandProducts = "SP_hdGetCompetitorBrandProducts";
        const string SP_HD_V4_GetTPAttendanceDetails = "SP_HD_V4_GetTPAttendanceDetails";
        const string SP_HD_V4_GetUserPerDayReport = "SP_HD_V4_GetUserPerDayReport";

        public string GetNextTwoPossibleDays(string companyCode, string userCode, string regionCode, string dcrDate)
        {
            string result = string.Empty;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetNextTwoPossibleDays);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);

                _objData.OpenConnection(companyCode);
                result = Convert.ToString(_objData.ExecuteScalar(command));
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

        public DataTable GetDailyCallPlanner(string companyCode, string userCode, string dcrDate)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetDailyPlanHeader);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public DataSet GetDailyCallPlannerDoctorDetails(string companyCode, string userCode, string regionCode,string month,string year,string fromDate,string dcrDate)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetDailyPlanDoctorYTD);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                _objSPData.AddParamToSqlCommand(command, "@YEAR", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);
              
                _objData.OpenConnection(companyCode);
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

        public DataTable GetDoctorProductMappingDetail(string companyCode, string customerCode, string regionCode)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDoctorProductMappimgDetail);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public DataTable GetProductGivenInLastMonth(string companyCode, string userCode, string year,string month,string productType,string customerCode)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetProductGivenInLastMonth);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                _objSPData.AddParamToSqlCommand(command, "@ProductType", ParameterDirection.Input, SqlDbType.VarChar, 30, productType);
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public DataTable GetNonSampleGivenYTD(string companyCode, string userCode, string fromDate, string customerCode)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetGiftsGivenYTD);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);                
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public DataTable GetOurBrandProducts(string companyCode, string userCode, string year, string month,string customerCode)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetOurBrandProducts);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                 _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public DataTable GetCompetitorBrandProducts(string companyCode, string userCode, string year, string month, string customerCode)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetCompetitorBrandProducts);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);

                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);
                return dt;
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

        public string GetAttendanceDetail(string companyCode, string userCode, string dcrDate)
        {
            string result = string.Empty;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetTPAttendanceDetails);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);                
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);

                _objData.OpenConnection(companyCode);
                result = Convert.ToString(_objData.ExecuteScalar(command));
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


        public DataSet GetInstantReportDetails(string companyCode, string userCode, string regionCode, string dcrActualDate, string dcrCode, string flag)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                string cmdText = SP_HD_V4_GetUserPerDayReport;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrActualDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);

                DataSet ds = new DataSet();

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}
