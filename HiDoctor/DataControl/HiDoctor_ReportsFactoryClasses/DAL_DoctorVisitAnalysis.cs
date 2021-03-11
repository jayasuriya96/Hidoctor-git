using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using MVCModels;
using MVCModels.HiDoctor_Master;
using DataControl;


namespace DataControl
{
    public class DAL_DoctorVisitAnalysis : DapperRepository
    {
        Data _objData = new Data();
        const string HD_GET_DOCTOR_VISIT_ANALYSIS = "SP_hdGetDoctorVisitAnalysis";
        const string HD_GET_INWARD_AUDIT_REPORT = "SP_hdGetInwardAuditReport";
        const string SPEDGETDOCTORCOVERAGECOUNT = "sp_edGetDoctorCoverageCount";
        const string SP_GET_LAST_SUBMITTED_REPORT = "SP_hdGetLastSubmittedReport";
        const string SP_GET_LAST_SUBMITTED_ENTERED_REPORT = "SP_hdGetLastSubmittedEnteredReport";
        const string SP_GET_LAST_SUBMITTED_REPORT_SUB = "SP_hdGetLastSubmittedSub";
        const string SP_GET_LAST_SUBMITTED_LEAVE_REPORT_SUB = "SP_hdGetLastSubmittedLeaveSub";
        const string SP_HDGETBRANDANALYSISREPORT = "SP_hdGetBrandAnalysisReport";
        const string SP_hdGetDoctorVisitFreqAnalysisSpecialityWiseReport = "SP_hdGetDoctorVisitFreqAnalysisSpecialityWiseReport";
        const string SP_hdGetDrVisitFreqAnalysisSpecialityWiseDrCountPopUp = "SP_hdGetDrVisitFreqAnalysisSpecialityWiseDrCountPopUp";
        const string SP_GET_CHILD_REGION_TYPE = "SP_hdGetChildRegionsType";
        const string SP_GET_REGION_TYPE__WISE_CHILD_REGION = "SP_hdGetRegionTypeWiseChildRegion";
        const string SP_GET_BRAND_SUMMARY_REPORT = "SP_hdGetBrandSummaryReport";
        const string SP_GET_LAST_SUBMITTED_MISSED = "SP_hdGetLastSubmittedMissedCall";
        const string SP_HDGETDCRHEADERBYSTATUSANDDATE = "SP_hdGetDCRHeaderByStatusAndDate";
        const string SP_HDGETDCRDOCTORSBYUSERNAME = "SP_hdGetDCRDoctorsByUserName";
        const string SP_HDGETLASTSUBMITTEDREPORTRPT = "SP_hdGetLastSubmittedReportRPT";
        const string SP_HDGETLASTSUBMITTED_REPORT_SUB_RPT = "SP_hdGetLastSubmittedSubRPT";
        const string SP_HDGETLASTSUBMITTEDLEAVESUBRPT = "SP_hdGetLastSubmittedLeaveSubRPT";
        const string SP_HDGetDoctorVisitTracking = "SP_HDGetDoctorVisitTracking";
        const string SP_HDGetDoctorVisitProfile = "SP_HDGetDoctorVisitProfile";
        const string SP_hdGetRegionTreeDetails = "SP_hdGetRegionTreeDetails";
        const string SP_hdGetUserTreeDetails = "SP_hdGetUserTreeDetails";
        const string SP_hdGetUserTreeDetails_Test = "SP_hdGetUserTreeDetails_Test";
        const string SP_hdGetRegionTreeDetails_WithVaccant = "SP_hdGetRegionTreeDetails_WithVaccant";
        const string SP_hdGetUserTreeDetails_New = "SP_hdGetUserTreeDetails_New";
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
        public DataSet GetDoctorVisitAnalysis(string companyCode, string regionCode, string startDate, string endDate, string selection)
        {

            try
            {
                SqlCommand command = new SqlCommand(HD_GET_DOCTOR_VISIT_ANALYSIS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Selection", ParameterDirection.Input, SqlDbType.NVarChar, 30, selection);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // Inward Audit report
        public DataSet GetInwardAuditReport(string companyCode, string userCode, string startDate, string endDate)
        {

            try
            {
                SqlCommand command = new SqlCommand(HD_GET_INWARD_AUDIT_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, endDate);

                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDoctorCoverageCount(string companyCode, string userCodes, int startMonth, int endMonth, int startYear, int endYear)
        {
            try
            {
                Data objData = new Data();
                SqlCommand command = new SqlCommand(SPEDGETDOCTORCOVERAGECOUNT);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartMonth", ParameterDirection.Input, SqlDbType.VarChar, 30, startMonth);
                AddParamToSqlCommand(command, "@EndMonth", ParameterDirection.Input, SqlDbType.VarChar, 30, endMonth);
                AddParamToSqlCommand(command, "@StartYear", ParameterDirection.Input, SqlDbType.VarChar, 30, startYear);
                AddParamToSqlCommand(command, "@EndYear", ParameterDirection.Input, SqlDbType.VarChar, 30, endYear);
                DataSet dsRpt = objData.ExecuteDataSet(command);
                return dsRpt;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetLastSubmittedEnteredReport(string companyCode, string userCodes, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_ENTERED_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetLastSubmittedReport(string companyCode, string userCodes, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //Asyn last submitted report
        public DataSet GetLastSubmittedReport(string companyCode, string userCodes, string startDate, string endDate, string userSelection, string ConnectionString)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 600;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastSubmittedReportRPT(string companyCode, string userCodes, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLASTSUBMITTEDREPORTRPT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastSubmittedReportSub(string companyCode, string userCodes, string regionCode, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_REPORT_SUB);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCodes);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastSubmittedReportSubRPT(string companyCode, string userCodes, string regionCode, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLASTSUBMITTED_REPORT_SUB_RPT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCodes);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastsubmittedLeaveSub(string companyCode, string userCodes, string leaveTypeCode, string startDate, string endDate, string regionCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_LEAVE_REPORT_SUB);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCodes);
                AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastsubmittedLeaveSubRPT(string companyCode, string userCodes, string leaveTypeCode, string startDate, string endDate, string regionCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLASTSUBMITTEDLEAVESUBRPT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCodes);
                AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetBrandAnalysisReport(string companyCode, string userCode, string month, string year, string dcrStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETBRANDANALYSISREPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.NVarChar, 10, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.NVarChar, 10, year);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.NVarChar, 30, dcrStatus);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorVisitAnalysisSpecialityWiseReport(string companyCode, string userCode, int month, int year, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDoctorVisitFreqAnalysisSpecialityWiseReport);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 1, mode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorVisitAnalysisSpecialityWiseReportPopUp(string companyCode, string userCode, string regionCode, int month, int year, string specialityCode, string categoryCode, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDrVisitFreqAnalysisSpecialityWiseDrCountPopUp);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@SpecialityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, specialityCode);
                AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 1, mode);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRegionTypes(string companyCode, string regionCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_CHILD_REGION_TYPE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetChildRegionNameAndChildUserType(string companyCode, string regionCode, string regionTypeCode, string userCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_REGION_TYPE__WISE_CHILD_REGION);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetBrandSummaryReport(string companyCode, string regionCodes, string userTypeCode, string dcrStatus, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_BRAND_SUMMARY_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetLastSubmittedMissedCall(string companyCode, string userCodes, string startDate, string endDate, string userSelection)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_MISSED);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //Asyn last submitted report
        public DataSet GetLastSubmittedMissedCall(string companyCode, string userCodes, string startDate, string endDate, string userSelection, string ConnectionString)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_MISSED);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        /// <summary>
        /// Get the doctors visited by the users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="dcrStatus"></param>
        /// <param name="userNames"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.DCRDoctorVisitModel> GetDCRDoctorsByUserName(string companyCode, string dcrStatus,
                        string userNames, string startDate, string endDate)
        {
            IEnumerable<MVCModels.DCRDoctorVisitModel> lstDoctor = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctor = connection.Query<MVCModels.DCRDoctorVisitModel>(SP_HDGETDCRDOCTORSBYUSERNAME,
                                  new { CompanyCode = companyCode, DCRStatus = dcrStatus, UserName = userNames, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure);
                    return lstDoctor;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.DCRHeaderModel> GetDCRHeaderByStatusAndDate(string companyCode, string dcrStatus,
                      string userCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.DCRHeaderModel> lstHeader = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstHeader = connection.Query<MVCModels.DCRHeaderModel>(SP_HDGETDCRHEADERBYSTATUSANDDATE,
                                  new { CompanyCode = companyCode, DCRStatus = dcrStatus, UserCode = userCode, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure);
                    return lstHeader;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public DataSet GetDoctorVisitHourlyReport(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        //{
        //    try
        //    {
        //        SqlCommand command = new SqlCommand(SP_HDGetDoctorVisitTracking);
        //        command.CommandType = CommandType.StoredProcedure;
        //        command.CommandTimeout = 400;
        //        AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
        //        AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
        //        AddParamToSqlCommand(command, "@DCR_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, DcrFromDate);
        //        AddParamToSqlCommand(command, "@DCR_To_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, DcrEndDate);

        //        _objData.OpenConnection();
        //        DataSet ds = _objData.ExecuteDataSet(command);

        //        return ds;
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //}
        //var p = new DynamicParameters();
        //              p.Add("@PageNumber", pageNumber);
        //              p.Add("@PageSize", pageSize);
        //              p.Add("@SearchKey", searchText);
        //              p.Add("@Company_Id", companyId);
        //              p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
        //              lstAudience = connection.Query<KAModels.CampaignModel>(USP_CKGETAUDIENCElIST,
        //                  p, commandType: CommandType.StoredProcedure);

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorVisitHourlyReport(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            IEnumerable<MVCModels.DoctorVisitHourlyModel> lstDoctor = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctor = connection.Query<MVCModels.DoctorVisitHourlyModel>(SP_HDGetDoctorVisitTracking,
                                  new { CompanyCode = companyCode, User_Code = userCode, DCR_From_Date = DcrFromDate, DCR_To_Date = DcrEndDate },
                                  commandType: CommandType.StoredProcedure);
                    return lstDoctor;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorProfile(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            IEnumerable<MVCModels.DoctorVisitHourlyModel> lstDoctor = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctor = connection.Query<MVCModels.DoctorVisitHourlyModel>(SP_HDGetDoctorVisitProfile,
                                   new { CompanyCode = companyCode, User_Code = userCode, DCR_From_Date = DcrFromDate, DCR_To_Date = DcrEndDate },
                                   commandType: CommandType.StoredProcedure);
                    return lstDoctor;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.DoctorVisitHourlyModel> GetDoctorAddress(string companyCode, string userCode, string DcrFromDate, string DcrEndDate)
        {
            IEnumerable<MVCModels.DoctorVisitHourlyModel> lstDoctor = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctor = connection.Query<MVCModels.DoctorVisitHourlyModel>(SP_HDGetDoctorVisitProfile,
                                   new { CompanyCode = companyCode, User_Code = userCode, DCR_From_Date = DcrFromDate, DCR_To_Date = DcrEndDate },
                                   commandType: CommandType.StoredProcedure);
                    return lstDoctor;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public List<RegionTreeModel> GetRegionByTree(string LoggedInCompCode, string LoggedInRegionCode)
        //{
        //    List<RegionTreeModel> lsReg = new List<RegionTreeModel>();

        //    try
        //    {
        //        List<RegionTreesModel> lstRegion = null;
        //        List<RegionTreeVacant> lstVacantReg = null;


        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            using (var mulitSelect = connection.QueryMultiple(SP_hdGetRegionTreeDetails,
        //                                                               new
        //                                                               {
        //                                                                   @CompanyCode = LoggedInCompCode,
        //                                                                   @RegionCode = LoggedInRegionCode,

        //                                                               },
        //                                                               commandType: CommandType.StoredProcedure))
        //            {
        //                lstRegion = mulitSelect.Read<RegionTreesModel>().ToList();
        //                lstVacantReg = mulitSelect.Read<RegionTreeVacant>().ToList();

        //            }
        //        }

        //        RegionTreeModel _objregn = new RegionTreeModel();
        //        _objregn.lstRegion = lstRegion;
        //        _objregn.lstVacantReg = lstVacantReg;

        //        lsReg.Add(_objregn);
        //    }

        //    catch
        //    {
        //        throw;
        //    }
        //    return lsReg;
        //}


        public IEnumerable<UserrTreeModel> GetUserrTree(string LoggedInCompCode, string LoggedInUserCode)
        {
            //IEnumerable<UserrTreeModel> lstUserr = null;
            IEnumerable<UserrTreeModel> lsReg1 = null;
            using (IDbConnection connection = IDbOpenConnection())
                try
            {
              
                {
                    lsReg1 = connection.Query<UserrTreeModel>(SP_hdGetUserTreeDetails,
                                   new { CompanyCode = LoggedInCompCode, UserCode = LoggedInUserCode},
                                   commandType: CommandType.StoredProcedure);
                    
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
            return lsReg1;
        }

        public IEnumerable<UserTreeModelNew> GetUserTreeNew(string LoggedInCompCode, string LoggedInUserCode)
        {
            //IEnumerable<UserrTreeModel> lstUserr = null;
            IEnumerable<UserTreeModelNew> lsReg1 = null;
            IDbConnection connection = IDbOpenConnection();

            try
            {
                lsReg1 = connection.Query<UserTreeModelNew>(SP_hdGetUserTreeDetails_New,
                               new { CompanyCode = LoggedInCompCode, UserCode = LoggedInUserCode },
                               commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
            return lsReg1;
        }


        public List<UserTreeModelNew> GetFullUserTreeNew(string LoggedInCompCode, string LoggedInUserCode)
        {
            //IEnumerable<UserrTreeModel> lstUserr = null;
            List<UserTreeModelNew> lsReg2 = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lsReg2 = connection.Query<UserTreeModelNew>(SP_hdGetUserTreeDetails_New,
                                   new { CompanyCode = LoggedInCompCode, UserCode = LoggedInUserCode },
                                   commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsReg2;
        }

        public List<UserrTreeModel> GetFullUserrTree(string LoggedInCompCode, string LoggedInUserCode)
        {
            //IEnumerable<UserrTreeModel> lstUserr = null;
            List<UserrTreeModel> lsReg2 = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lsReg2 = connection.Query<UserrTreeModel>(SP_hdGetUserTreeDetails,
                                   new { CompanyCode = LoggedInCompCode, UserCode = LoggedInUserCode },
                                   commandType: CommandType.StoredProcedure).ToList(); 

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsReg2;
        }


        public IEnumerable<RegionTreesModel> GetRegionnTree(string LoggedInCompCode, string LoggedInRegionCode)
        {
            //IEnumerable<UserrTreeModel> lstUserr = null;
            IEnumerable<RegionTreesModel> lsReg1 = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lsReg1 = connection.Query<RegionTreesModel>(SP_hdGetRegionTreeDetails,
                                   new { CompanyCode = LoggedInCompCode, RegionCode = LoggedInRegionCode },
                                   commandType: CommandType.StoredProcedure);

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsReg1;
        }

        #endregion Public Methods

    }
}
