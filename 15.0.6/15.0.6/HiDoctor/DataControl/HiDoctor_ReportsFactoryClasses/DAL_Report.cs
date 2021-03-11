using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using MVCModels;




namespace DataControl
{
    public class DAL_Report : DapperRepository
    {
        private SPData _objSPData = new SPData();
        private Data _objData = new Data();

        #region Constants
        const string SP_HD_GetAccDetail = "SP_HD_GetAccDetail";
        const string SPHDGETDOCTORCOVERAGECOUNT = "sp_hdGetDoctorCoverageCount";
        const string SPHDGETDOCTORCALLANALYSIS = "SP_hdGetDoctorCallAnalysis";
        const string SP_SALES_ACTIVITY_PERFORMANCE = "SP_hdGetSalesAndActivityPerformance";
        const string GETHOLIDAY = "GetHoliday";
        const string SP_HDGETDOCTORSTATISTICSREPORT = "SP_hdGetDoctorStatisticsReport";
        const string SP_HDGETDAYWISEFIELDREPORT = "SP_hdGetDayWiseFieldReport";
        const string SP_HDGETDOCTORVISITSFREQUENCYANALYSIS = "SP_hdGetDoctorVisitsFrequencyAnalysis";
        const string SP_GET_LAST_SUBMITTED_REPORT_SUB_CALCI = "SP_hdGetLastSubmittedSubCalci";
        const string SP_hdGetExpenseAnalysisGroupWiseReport = "SP_hdGetExpenseAnalysisGroupWiseReport";
        const string SP_hdGetExpenseAnalysisGroupWiseReport_CustCount = "SP_hdGetExpenseAnalysisGroupWiseReport_CustCount";
        const string SP_hdGetExpenseClaimAlumniReport = "SP_hdGetExpenseClaimAlumniReport";
        const string SP_HDGETTPMASTERREPORT = "SP_hdGetTPMasterReport";
        const string SP_HD_TPDOCTORDETAILS = "Sp_hd_TpDoctorDetails";


        //Doctor Staticstics Report 
        const string SP_HDGETDOCTORSTATISTICSREPORT_WITHCALC = "SP_hdGetDoctorStatisticsReport_WithCalc";

        const string HD_SP_BINDDOCTORVISITACCNAME = "HD_SP_BindDoctorVisitAccName";
        #endregion Constants

        public DataSet GetDoctorCoverageCount(string companyCode, string userCode, string startDate, string endDate, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SPHDGETDOCTORCOVERAGECOUNT);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objData.OpenConnection(companyCode);
                DataSet dsRpt = _objData.ExecuteDataSet(command);
                return dsRpt;
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
        public DataSet GetDoctorCallAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                SqlCommand command = new SqlCommand(SPHDGETDOCTORCALLANALYSIS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.Date, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.Date, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
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

        public DataSet GetSalesAndActivityPerformance(string companyCode, string regionCode, string startDate, string endDate)
        {
            SPData objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_SALES_ACTIVITY_PERFORMANCE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.DateTime, 30, startDate);
                objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.DateTime, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetHolidayDetails(string companyCode, string regionCode, string parentRegion, string startDate, string endDate, string dcrStatus)
        {
            SPData objSPData = new SPData();
            try
            {
                //string cmdText = "GetHoliday";
                SqlCommand command = new SqlCommand(GETHOLIDAY);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@regionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@startDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                objSPData.AddParamToSqlCommand(command, "@endDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                objSPData.AddParamToSqlCommand(command, "@ParentRegion", ParameterDirection.Input, SqlDbType.VarChar, parentRegion.Length, parentRegion);
                objSPData.AddParamToSqlCommand(command, "@dcrStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetDoctorStatisticsReport(string companyCode, string regionCode, string userCode, string Month, string Year, string dcrStatus)
        {
            SPData objSPData = new SPData();
            try
            {
                // string cmdText = "SP_hdGetDoctorStatisticsReport";
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORSTATISTICSREPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDayWiseFieldReport(string companyCode, string userCode, string regionCodes, string startDate, string endDate,
            string status)
        {
            SPData objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDAYWISEFIELDREPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                //objSPData.AddParamToSqlCommand(command, "@ParentRegion", ParameterDirection.Input, SqlDbType.VarChar, parentRegion.Length, parentRegion);
                //objSPData.AddParamToSqlCommand(command, "@DivisionCode", ParameterDirection.Input, SqlDbType.VarChar, divisionCode.Length, divisionCode);
                objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorVisitsFrequencyAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {

            SPData objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORVISITSFREQUENCYANALYSIS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.Date, 30, startDate);
                objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.Date, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetLastSubmittedReportSubCalci(string companyCode, string userCodes, string regionCode, string month, string year, string userSelection, string VCount)
        {
            SPData objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_LAST_SUBMITTED_REPORT_SUB_CALCI);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCodes);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                objSPData.AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 30, userSelection);
                objSPData.AddParamToSqlCommand(command, "@VCount", ParameterDirection.Input, SqlDbType.VarChar, 1, VCount);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //------------ START - EXPENSE ANALYSIS GROUP WISE REPORT------------------------
        public DataSet GetExpenseAnalysisGroupWiseReport(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string activityStatus)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetExpenseAnalysisGroupWiseReport);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 10, toDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@ActicityStatus", ParameterDirection.Input, SqlDbType.VarChar, 10, activityStatus);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetExpenseAnalysisGroupWiseReportCustomerCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetExpenseAnalysisGroupWiseReport_CustCount);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 10, toDate);
                _objSPData.AddParamToSqlCommand(command, "@DcrStatus", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@Option", ParameterDirection.Input, SqlDbType.Char, 5, option);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //------------ END - EXPENSE ANALYSIS GROUP WISE REPORT------------------------

        //------------ START- EXPENSE CLAIM ALUMNI REPORT -----------------------------
        public DataSet GetExpenseClaimAlumniReport(string companyCode, string userCodes, string fromDate, string toDate, string claimStatus)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetExpenseClaimAlumniReport);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 10, toDate);
                _objSPData.AddParamToSqlCommand(command, "@ClaimStatus", ParameterDirection.Input, SqlDbType.VarChar, claimStatus.Length, claimStatus);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------ END- EXPENSE CLAIM ALUMNI REPORT -----------------------------

        #region tp master report for alumini users
        public DataSet GetTPMasterReportForAlumniUsers(string companyCode, string month, string year, string userCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETTPMASTERREPORT);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 10, month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 10, year);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetTPDoctorDetailsForAlumniUsers(string companyCode, string tpDate, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctor = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HD_TPDOCTORDETAILS,
                                  new { Company_Code = companyCode, User_Code = userCode, Tp_Date = tpDate },
                                  commandType: CommandType.StoredProcedure);
                    return lstDoctor;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion tp master report for alumini users

        #region Doctor Statistics Report
        public DataSet GetDoctorStatisticsReport_WithCalc(string companyCode, string regionCode, string userCode, string Month, string Year, string dcrStatus)
        {
            SPData objSPData = new SPData();
            try
            {
                // string cmdText = "SP_hdGetDoctorStatisticsReport";
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORSTATISTICSREPORT_WITHCALC);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion Doctor Statistics Report
        public List<DCRApprovalAccModel> GetAccompanistVisitedDetails(string companyCode, string Accompanist, string DcrUserCode)
        {
            List<DCRApprovalAccModel> lstAcc = new List<DCRApprovalAccModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@Accompanist", Accompanist);
                    parameter.Add("@DcrUserCode", DcrUserCode);
                    lstAcc = connection.Query<DCRApprovalAccModel>(SP_HD_GetAccDetail, parameter, commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch
            {
            }
            return lstAcc;
        }
        public List<DoctorACCNameDetails> GetDoctorVisitAccName(string dcr_date, string user_code, string doctor_Visit_Code, string company_Code, string type)
        {
            List<DoctorACCNameDetails> lstAcc = new List<DoctorACCNameDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters parameter = new DynamicParameters();
                    parameter.Add("@dcr_date", dcr_date);
                    parameter.Add("@user_code", user_code);
                    parameter.Add("@doctor_Visit_Code", doctor_Visit_Code);
                    parameter.Add("@company_Code", company_Code);
                    parameter.Add("@type", type);
                    lstAcc = connection.Query<DoctorACCNameDetails>(HD_SP_BINDDOCTORVISITACCNAME, parameter, commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch
            {
            }
            return lstAcc;
        }
        public List<DCRCMEDetails> GetCMEProductDetails(string DCR_Code, int DCR_Attendance_Doctor_Id,int CME_Id)
        {
            List<DCRCMEDetails> lstAcc = new List<DCRCMEDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters parameter = new DynamicParameters();
                    parameter.Add("@DCR_Code", DCR_Code);
                    parameter.Add("@DCR_Attendance_Doctor_Id", DCR_Attendance_Doctor_Id);
                    parameter.Add("@CME_Id", CME_Id);
                    lstAcc = connection.Query<DCRCMEDetails>("Sp_hd_DCRV4_CMEProductDetails", parameter, commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstAcc;
        }

    }
}
