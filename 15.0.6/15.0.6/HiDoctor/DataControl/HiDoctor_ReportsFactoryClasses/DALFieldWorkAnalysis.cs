using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using DataControl;

namespace DataControl
{
    public class DALFieldWorkAnalysis
    {
        Data _objData = new Data();
        CurrentInfo _objcurrentInfo = new CurrentInfo();
        SPData objSPData = new SPData();

        const string SP_HDGETCHILDUSERTYPES = "SP_hdGetChildUserTypes";
        const string SP_HDCHILDUSERTYPE = "sp_hdChildUserType";
        const string SP_HDGETFIELDWORKANALYSIS_CALCFW = "SP_hdGetFieldWorkAnalysis_CALCFW";
        const string SP_HDGETDOCTORVISITFREQUENCYANALYSIS_CALCFW = "SP_hdGetDoctorVisitFrequencyanalysis_CALCFW";
        const string SP_HDGETDAYWISEANALYSISCALCFW = "SP_HDGetDaywiseAnalysis_CALCFW";
        const string SP_HDGETJOINTWORKANALYSIS = "SP_hdGetJointFieldWorkAnalysis_CALCFW";
        const string SP_HDGETLISTEDDOCTORSCOVERED_CALCFW = "SP_hdGetListedDoctorsCovered_CALCFW";
        const string SP_HDGETCATEGORYWISEDOCTOR_CALCFW = "SP_hdGetCategorywiseDoctor_CALCFW";
        const string SP_HDGETENTITYDETAILS_CALCFW = "SP_hdGetEntityDetails_CALCFW";
        const string SP_HDGETCHILDUSERDETAILS = "SP_hdGetChildUserDetails";
        public DataSet GetUnderUserType(string companyCode, string userCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCHILDUSERTYPES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public int GetUnderUserTypeCount(string companyCode, string userTypeCode)
        {
            try
            {
                int count = 0;
                SqlCommand command = new SqlCommand(SP_HDCHILDUSERTYPE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userTypeCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    count = ds.Tables[0].Rows.Count;
                }
                return count;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetFWAnalysisDetails(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETFIELDWORKANALYSIS_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, userTypeCode.Length, userTypeCode);
                objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.NVarChar, 30, mode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 10, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 10, year);
                objSPData.AddParamToSqlCommand(command, "@ReportType", ParameterDirection.Input, SqlDbType.NVarChar, 30, reportType);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetDoctorVisifrequencyAnalysisCalsi(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORVISITFREQUENCYANALYSIS_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, userTypeCode.Length, userTypeCode);
                objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.NVarChar, 30, mode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 10, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 10, year);
                objSPData.AddParamToSqlCommand(command, "@ReportType", ParameterDirection.Input, SqlDbType.NVarChar, 30, reportType);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        //async doctor visit frequency analysis report calci
        public DataSet GetDoctorVisifrequencyAnalysisCalsi(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType, string ConnectionString)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORVISITFREQUENCYANALYSIS_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.NVarChar, userTypeCode.Length, userTypeCode);
                objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.NVarChar, 30, mode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 10, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 10, year);
                objSPData.AddParamToSqlCommand(command, "@ReportType", ParameterDirection.Input, SqlDbType.NVarChar, 30, reportType);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetFWDoctorDetails(string companyCode, string category, string userCode, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCATEGORYWISEDOCTOR_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.NVarChar, 30, category);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetDaywiseAnalysis(string companyCode, string userCode, string month, string year, string type)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDAYWISEANALYSISCALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                objSPData.AddParamToSqlCommand(command, "@Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, type);

                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetFWJointWorkAnalysisDetails(string companyCode, string userCode, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETJOINTWORKANALYSIS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);

                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        //listed Drs Covered Detail
        public DataSet GetFWListedDrsCoveredDetails(string companyCode, string category, string userCode, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLISTEDDOCTORSCOVERED_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                objSPData.AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, category);


                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetFWEntityDetails(string companyCode, string userCode, string month, string year, string entity,string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETENTITYDETAILS_CALCFW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 30, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 30, year);
                objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.NVarChar, 30, entity);
                objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.NVarChar, 30, mode);


                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int GetUnderChildUserCount(string companyCode, string userCode)
        {
            try
            {
                int count = 0;
                SqlCommand command = new SqlCommand(SP_HDGETCHILDUSERDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    count = ds.Tables[0].Rows.Count;
                }
                return count;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }



    }
}
