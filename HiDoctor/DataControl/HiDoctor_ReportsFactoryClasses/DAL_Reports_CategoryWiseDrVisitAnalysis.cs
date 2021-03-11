using System;
using System.Data.SqlClient;
using System.Data;

namespace DataControl
{
    public class DAL_Reports_CategoryWiseDrVisitAnalysis
    {
        Data _objData = new Data();

        #region Private Methods
        public void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.Size = size;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion Private Methods

        #region Public Methods
        public DataSet GetChildRegions(string companyCode, string parentRegionCode, string regionTypeCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetChildRegions";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //overloaded method for asynchronous reports
        public DataSet GetChildRegions(string companyCode, string parentRegionCode, string regionTypeCode, string ConnectionString)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetChildRegions";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);

                _objData.OpenConnection(companyCode, ConnectionString);

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorCategories(string companyCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetDoctorCategory";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //overloaded method for asynchronous reports
        public DataSet GetDoctorCategories(string companyCode, string ConnectionString)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetDoctorCategory";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection(companyCode, ConnectionString);

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetRegionUserCount(string companyCode, string parentRegionCode, string regionTypeCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetRegionUserCount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);

                string count = string.Empty;

                count = _objData.GetStringValue(companyCode, command);

                return count;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorMasterCount(string companyCode, string parentRegionCode, string regionTypeCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetDoctorMasterCount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorVisitCount(string companyCode, string parentRegionCode, string regionTypeCode, string month, string year, string dcrStatus)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetDoctorVisitCount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, dcrStatus);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetFieldDaysCount(string companyCode, string parentRegionCode, string regionTypeCode, string month, string year, string dcrStatus)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetFieldDaysCount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Parent_Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionCode);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionTypeCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, dcrStatus);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetLastDcrDate(string companyCode, string userCodes, string month, string year, string dcrStatus)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetLastDcrDate";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.NVarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, dcrStatus);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //overloaded method for asynchronous reports
        public DataSet GetLastDcrDate(string companyCode, string userCodes, string month, string year, string dcrStatus, string ConnectionString)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetLastDcrDate";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.NVarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, dcrStatus);

               _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRegionTypes(string companyCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetRegionTypes";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetRegionTypeCode(string companyCode, string regionCode)
        {

            try
            {
                string cmdText = "SP_hd_DrCatVisitAnalysis_GetRegionTypeCode";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);

                string count = string.Empty;

                count = _objData.GetStringValue(companyCode, command);

                return count;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetRVSVDetails(string companyCode, string aggregatedRegionCode, string regionCode, string parentRegionTypeCode, int month, int year, string status)
        {

            try
            {
                string cmdText = "sp_hd_RVSV_Analysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@AggregateRegionTypeCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, aggregatedRegionCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@ParentRegionTypeCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionTypeCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, status);

                string count = string.Empty;

                DataSet dsRvSv = _objData.ExecuteDataSet(command);

                return dsRvSv;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //overloaded funtion for asynchronous reports
        public DataSet GetRVSVDetails(string companyCode, string aggregatedRegionCode, string regionCode, string parentRegionTypeCode, int month, int year, string status, string ConnectionString)
        {

            try
            {
                string cmdText = "sp_hd_RVSV_Analysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@AggregateRegionTypeCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, aggregatedRegionCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@ParentRegionTypeCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, parentRegionTypeCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                AddParamToSqlCommand(command, "@Dcr_Status", ParameterDirection.Input, SqlDbType.NVarChar, 20, status);

                string count = string.Empty;

                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet dsRvSv = _objData.ExecuteDataSet(command);

                return dsRvSv;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #endregion Public Methods
    }
}