#region Using
using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using ElmahWrapper;
using System.Net.Mail;
using DataControl.EnumType;
using Dapper;
using MVCModels;
using System.Linq;
#endregion Using

namespace DataControl
{
    public class SPData : DapperRepository
    {
        #region Private Variables
        private Data _objData = new Data();
        private CurrentInfo _objcurrentInfo = new CurrentInfo();

        const string SP_DOCTORMISSEDFROMCATEGORY = "SP_hdGetDoctorMissedFromCategory";
        const string SP_DOCTORMISSEDFROMCATEGORYDETAILS = "SP_hdGetDoctorMissedFromCategoryDetails";
        const string SP_DAILY_STATUS_REPORT = "SP_hdGetDailyStatusReport";
        const string SP_DAILY_STATUS_EXPENSE_POP = "SP_hdGetDailyStatusExpense";
        const string SP_DAILY_STATUS_DOCTOR_POP = "SP_hdGetDailyStatusDoctor";
        const string SP_ACTIVITYCOUNT = "SP_hdGetActivityCount";
        const string SP_SUNDAYCOUNT = "SP_hdGetSundayCount";
        const string SP_HOLIDAYCOUNT = "SP_hdGetHolidayDetails";
        const string SP_SPECIALITYANANLYSISDETAILS = "SP_hdGetSpecialityWiseAnalysisDetails";
        const string SP_SPECIALITYANANLYSIS = "SP_hdGetSpecialityWiseAnalysis";
        const string SP_SEC_SALES_STOCKIEST_WISE_REPORT = "SP_hdGetSecSalesStockiestWiseReport";
        const string SP_STOCKIEST_WISE_UNDER_OVER_STOCK = "SP_hdGetStockistWiseUnderOverStockReport";
        const string SP_SEC_SALES_TREND_NEW = "SP_hdGetSecondarySalesTrendAnalysisNew";
        const string SP_VACANT_REPORT = "SP_hdGetVacancyReport";
        const string SP_CAMPAIGN_DETAILS = "SP_hdGetMarketingCampaignTracker";
        const string SP_HDGETSFAWAREPORTSMENU = "SP_hdGetSFAWAReportsMenu";
        const string SP_GEO_LOCATION = "SP_hdGetGeoLocationReport";
        const string SP_HD_DIVISION_SELECT = "SP_hd_Division_Select";
        const string SP_HDGET_PRODUCT_TYPE_MASTER = "sp_hdGet_Product_Type_Master";
        const string SP_HD_USER_TYPE_SELECT = "SP_hd_User_Type_Select";
        const string SP_HDGET_PRODUCTS_BY_DIVISION_AND_PRODUCTTYPE = "sp_hdGet_Products_By_Division_And_ProductType";
        const string SP_HD_GET_INWRAD_EXCEL_DATA = "SP_HD_GET_Inwrad_Excel_Data";
        const string SP_HD_MOBILE_GET_ACTIVITY_SUMMARY_REPORT = "SP_hdGetActivitySummaryHeader";
        const string SP_HD_MOBILE_GET_ACTIVITY_SUMMARY_DETAILS_REPORT = "SP_hdGetActivitySummaryDetails";
        const string SP_HD_OTC_ORDER_STATUS_REPORT = "SP_hdGetOrderReport";
        const string SP_HD_INSERT_INWARD_BULK_UPLOAD_STAGING = "SP_HD_INSERT_INWARD_BULK_UPLOAD_STAGING";
        const string SP_HD_GET_BATCHPROCESSING_HEADER = "SP_HD_GET_BATCHPROCESSING_HEADER";
        const string SP_HD_GET_BATCHPROCESSING_ERRORS = "SP_HD_GET_BATCHPROCESSING_ERRORS";
        const string SP_GET_WEEKENDGROUP = "SP_hdGETRegionWeekengGroupMapping";

        const string SP_HD_GET_SECONDARY_SALES_CUSTOMER = "SP_hdGetSecondarySalesCustomerReport";
        const string SP_HD_GET_DIVISIONWISE_CATEORY_SPECIALITY = "SP_hdGetDivWiseCategoryAndSpeci";
        const string SP_HD_GET_USER_PRIVILEGE = "SP_hdGetUserPrivilegeMapping";
        const string SP_hdGetConfigSettings = "SP_hdGetConfigSettings";
        const string SP_HD_GET_AUDIT_REPORT = "SP_hdGetAuditReport";

        const string SP_GET_USERPERDAY = "Sp_HdGetUserperDayNewRemoveFlag";
        const string Sp_HdGetUserperDayNewInsertFlag = "Sp_HdGetUserperDayNewInsertFlag";


        const string SP_hdGetSinglePrivilegeValueForUser = "SP_hdGetSinglePrivilegeValueForUser";
        const string SP_VACANT_REPORT_NEW = "SP_hdGetVacancyReportNew";
        const string SP_SALES_ACTIVITY_PERFORMANCE = "SP_hdGetSalesAndActivityPerformance";
        const string SP_HDGETINWARDUPLOADLOOKUPVALUES = "Sp_hdGetInwardUploadLookupValues";
        const string SP_HD_COMREHENSIVE_REPORT = "SP_hdGETComprehensiveAnalysisReport";
        const string SP_HD_DOCTOR_VISIT_REPORT = "SP_hdGetDoctorVisitsAnalysis";
        const string SP_HDINSERT_BATCH_PROCESSING_HEADER = "SP_HDINSERT_BATCH_PROCESSING_HEADER";
        const string SP_HD_GETACCOMPANISTVISITEDDOCTORS = "SP_HD_GetAccompanistVisitedDoctors";
        const string SP_HD_GETDETAILEDPRODUCTANDINPUTSPERDOCTOR = "SP_HD_GetDetailedProductAndInputsPerDoctor";
        const string SP_hdUpdateLogoutTime = "SP_hdUpdateLogoutTime";
        const string SP_HDISDCRRESTRICTEDDATE = "SP_HDIsDCRRestrictedDate";
        const string SP_HDVALIDATEREFKEY1FORPRODUCT = "SP_HDVALIDATEREFKEY1FORPRODUCT";
        const string SP_HDVALIDATEProductName = "SP_HDVALIDATEProductName";
        const string SP_hdChecktheDCRCanBeUnapprove = "SP_hdChecktheDCRCanBeUnapprove";
        const string SP_HDGETDCRCONSDOCTORMISSED = "SP_hdGetDCRConsDoctorMissed ";
        const string SP_HDGETSINGLEPRIVILEGEVALUEFORUSERTYPE = "SP_hdGetSinglePrivilegeValueForUserType1";
        const string SP_HDGETMONTH = "SP_hdSP_hdGetSecondarySalesMonth";
        const string SP_HdGetPsInSS = "SP_HdGetPsInSS";
        const string SP_HDISCHECKPSINSS = "SP_HdIsCheckPsInSS";

        //Comprehensive Analysis Report - SpChanges
        const string SP_HDGETCOMPREHENSIVEANALYSISREPT = "SP_hdGETComprehensiveAnalysisRept";
        const string SP_HDCHECKTPAVAILABLESELECTEDDCRDATE = "SP_HDCHECKTPAVAILABLESELECTEDDCRDATE";
        const string SP_HDGETPSPREFILLCOLUMNNAMES = "SP_HdGetPSPrefillColumnNames";
        const string SP_GETPSSSDOCUMENTTYPENAME = "SP_GetPSSSDocumentTypeName";
        const string SP_HD_StockiestSecondarySalesEntryCheck = "SP_HD_StockiestSecondarySalesEntryCheck";
        const string SP_HD_SS_Entry_Lock_Release = "SP_HD_SS_Entry_Lock_Release";

        //DCR Leave Insert & Update SP
        const string SP_HD_DCR_InsertUpdateLeave = "SP_HD_DCR_InsertUpdateLeave";
        const string SP_HD_DCR_Leave_Entry_Validation = "SP_HD_DCR_Leave_Entry_Validation";
        const string usp_hd_API_Leave_MinMax_Validation = "usp_hd_API_Leave_MinMax_Validation";
        const string usp_hd_API_Monthly_Yearly_Validation = "usp_hd_API_Monthly_Yearly_Validation";
        const string usp_hd_API_Leave_Attachment_Validation = "usp_hd_API_Leave_Attachment_Validation";
        const string usp_hd_API_Sandwich_Policy_Validation = "usp_hd_API_Sandwich_Policy_Validation";
        const string usp_hd_API_hdClubLeave = "usp_hd_API_hdClubLeave";
        const string usp_hd_API_Leave_Balance_Validation = "usp_hd_API_Leave_Balance_Validation";
        const string SP_HD_DCR_Leave_Validation_Privilege = "SP_HD_DCR_Leave_Validation_Privilege";
        const string SP_HD_DCR_Leave_Attachments = "SP_HD_DCR_Leave_Attachments";
        const string SP_HD_Allow_Across_Month_Leave_Validation = "SP_HD_Allow_Across_Month_Leave_Validation";
        const string SP_HD_Check_For_Consecutive_Leave = "SP_HD_Check_For_Consecutive_Leave";

        //DCR Entry Based on Privilege (DCR Calendar Screen)
        const string SP_HD_Allow_DCR_Entry_Based_On_Leave_Policy = "SP_HD_Allow_DCR_Entry_Based_On_Leave_Policy";

        //HiDoctor User Access
        const string SPHDGETWEBACCESS = "SP_HD_Get_Web_Access";

        const string EXEC = "EXEC";
        #endregion Private Variables

        #region Reports Consistency
        //Specialty Report
        const string SP_HDGETSPECIALITYWISEANALYSIS_WITHCALC = "SP_hdGetSpecialityWiseAnalysis_WithCalc";
        const string SP_HDGETSPECIALITYWISEANALYSISDETAILS_WITHCALC = "SP_hdGetSpecialityWiseAnalysisDetails_WithCalc";
        //Doctor Category Count Report
        const string SP_HDGETDOCTORMISSEDFROMCATEGORY_WITHCALC = "SP_hdGetDoctorMissedFromCategory_WithCalc";
        const string SP_HDGETDOCTORMISSEDFROMCATEGORYDETAILS_WITHCALC = "SP_hdGetDoctorMissedFromCategoryDetails_WithCalc";
        const string SP_HD_GETNOOFDOCSNEVERVISITED_WITHCALC = "SP_HD_GetNoofDocsNeverVisited_WithCalc";
        const string SP_HD_GETNOOFDOCSVISITCOUNTMISSED_WITHCALC = "SP_HD_GetNoofDocsVisitCountMissed_WithCalc";
        const string SP_HD_GETNOOFDOCSNEVERVISITEDANDMISSEDCOUNT_WITHCALC = "SP_HD_GetNoofDocsNeverVisitedandMissedCount_WithCalc";

        #endregion Reports Consistency

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
                ErrorLog.LogError(ex, "AddParamToSqlCommand()");
                // bool blError = insertLogTable(HttpContext.Current.Session["Comp_Code"].ToString(), HttpContext.Current.Session["Depot_Code"].ToString(), "QueryBuilder", "AddParamToSqlCommand()", "", ex, "Application");
            }
        }

        public void AddParamToSqlCommandWithTypeName(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, object paramValue, string typeName)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.TypeName = typeName;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "AddParamToSqlCommand()");
                // bool blError = insertLogTable(HttpContext.Current.Session["Comp_Code"].ToString(), HttpContext.Current.Session["Depot_Code"].ToString(), "QueryBuilder", "AddParamToSqlCommand()", "", ex, "Application");
            }
        }
        #endregion Private Methods

        #region Public Methods

        public DataSet GetConnectionString(string subDomainName)
        {
            try
            {
                //subDomainName = "test-ccm3.hidoctor.me";
                //subDomainName = "icpa.hidoctor.me";
                //subDomainName = "hdtestqa1.hidoctor.me";

                //Comment the below while checking in into TFS
                //subDomainName = "dev1.hidoctor.me";

                string cmdText = "SP_hdGetConnectionString";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@SubDomainName", ParameterDirection.Input, SqlDbType.VarChar, 100, subDomainName);

                _objData.OpenConnection_Global();
                DataSet dsConnectionString = _objData.ExecuteDataSet(command);
                return dsConnectionString;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetArchiveConnectionString(string subDomainName)
        {

            try
            {
                string cmdText = "SP_hdGetArchiveConnectionString";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@SubDomainName", ParameterDirection.Input, SqlDbType.VarChar, 30, subDomainName);

                _objData.OpenConnection_Global();
                DataSet dsConnectionString = _objData.ExecuteDataSet(command);
                return dsConnectionString;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetUserCurrentInfo(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdGetCurrentUserInfo";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                _objData.OpenConnection(companyCode);
                DataSet dsCurrentInfo = _objData.ExecuteDataSet(command);
                return dsCurrentInfo;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int ExecuteStoredProcedure(string storedProcedureName, string query, string companyCode)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());

                // Command - specify as StoredProcedure
                SqlCommand command = new SqlCommand(storedProcedureName);
                command.CommandType = CommandType.StoredProcedure;

                SqlParameter inparm = command.Parameters.Add("@query", SqlDbType.VarChar);
                inparm.Direction = ParameterDirection.Input;
                inparm.Value = query;

                // Return value as parameter
                SqlParameter returnValue = new SqlParameter("returnVal", SqlDbType.Int);
                returnValue.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                return Convert.ToInt32(returnValue.Value);

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ExecuteStoredProcedure()");
                return 2;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public void UpdateLogOutTime(string companyCode, string userCode, string sessionID)
        {
            try
            {
                string cmdText = SP_hdUpdateLogoutTime;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@SessionId", ParameterDirection.Input, SqlDbType.VarChar, 200, sessionID);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionMaster()");
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #region Activity

        public object InsertDCRDoctorVisitData(string dcrVisitCode, string dcrActualDate, string doctor, string products, string chemists, string rcpa, string rcpaFlag, string regionCode, string prodBringType)
        {
            try
            {
                string cmdText = "SP_hdInsertDoctorVisitData";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();
                string dcrCode = _objcurrentInfo.GetDCRCode(dcrActualDate);
                string userName = _objcurrentInfo.GetUserName();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrActualDate);
                AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrVisitCode);
                AddParamToSqlCommand(command, "@DoctorString", ParameterDirection.Input, SqlDbType.VarChar, doctor.Length, doctor);
                AddParamToSqlCommand(command, "@ProductString", ParameterDirection.Input, SqlDbType.VarChar, products.Length, products);
                AddParamToSqlCommand(command, "@ChemistString", ParameterDirection.Input, SqlDbType.VarChar, chemists.Length, chemists);
                AddParamToSqlCommand(command, "@RCPAstring", ParameterDirection.Input, SqlDbType.VarChar, rcpa.Length, rcpa);
                AddParamToSqlCommand(command, "@RCPAFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, rcpaFlag);
                AddParamToSqlCommand(command, "@Lattitude", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLattitude());
                AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLongitude());
                AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, _objcurrentInfo.GetLocation());
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 500, regionCode);
                AddParamToSqlCommand(command, "@ProdBringType", ParameterDirection.Input, SqlDbType.VarChar, prodBringType.Length, prodBringType);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                _objData.OpenConnection(companyCode);
                DataSet dsDoctorVisitData = _objData.ExecuteDataSet(command);

                if (command.Parameters["@Result"].Value.ToString().Length > 0)
                {
                    return "Error:" + command.Parameters["@Result"].Value.ToString();
                }
                return dsDoctorVisitData;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetCPDoctors(string tpname, string cpname, string userCode, string month, string year)
        {
            try
            {
                string cmdText = "SP_hdGetCPDoctors";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string regionCode = _objcurrentInfo.GetRegionCode();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@CPName", ParameterDirection.Input, SqlDbType.VarChar, 50, cpname);
                AddParamToSqlCommand(command, "@TPName", ParameterDirection.Input, SqlDbType.VarChar, 50, tpname);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, year);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorVisitData(string dcrActualDate)
        {
            try
            {
                string dcrCode = _objcurrentInfo.GetDCRCode(dcrActualDate).ToString();
                string cmdText = "SP_hdGetDoctorVisitData";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();


                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteDoctorVisitData(string dvcode, string dcrActualDate)
        {
            try
            {
                string dcrCode = _objcurrentInfo.GetDCRCode(dcrActualDate).ToString();
                string cmdText = "SP_hdDeleteDoctorVisitData";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();


                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrCode);
                AddParamToSqlCommand(command, "@DoctorVisitCode", ParameterDirection.Input, SqlDbType.VarChar, 30, dvcode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                if (command.Parameters["@Result"].Value.ToString().Length > 0)
                {
                    return command.Parameters["@Result"].Value.ToString();
                }
                return "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "DeleteDoctorVisitData()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        // Leave
        public string UpdateLeave(string fromDate, string reason, string leaveTypeCode, string sourceOfEntry)
        {
            try
            {
                string cmdText = "SP_hdUpdateLeave";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(fromDate));
                AddParamToSqlCommand(command, "@Reason", ParameterDirection.Input, SqlDbType.VarChar, 500, reason);
                AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(command, "@SourceOfEntry", ParameterDirection.Input, SqlDbType.VarChar, 10, sourceOfEntry);
                //AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateLeave()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string LeavebalanceValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_Leave_Balance_Validation, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string ClubbingValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@UserCode", user_Code);
                    p.Add("@FromDate", fromDate);
                    p.Add("@ToDate", toDate);
                    p.Add("@LeaveTypeCode", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_hdClubLeave, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string SandwichPolicyValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_Sandwich_Policy_Validation, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string AttachmentValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode, string uploaded_files)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Uploaded_File_Name", uploaded_files);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_Leave_Attachment_Validation, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string MonthlyYearlyValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_Monthly_Yearly_Validation, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string MinMaxValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(usp_hd_API_Leave_MinMax_Validation, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;

        }

        public int GetLeaveValidationPrivilege(string company_Code, string user_Code, string leaveTypeCode)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@company_Code", company_Code);
                    p.Add("@user_Code", user_Code);
                    p.Add("@leaveTypeCode", leaveTypeCode);
                    //p.Add("@Result", result, DbType.Int16, ParameterDirection.Output);
                    result = connection.Query<int>(SP_HD_DCR_Leave_Validation_Privilege, p, commandType: CommandType.StoredProcedure).FirstOrDefault();
                    //result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string LeaveValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_DCR_Leave_Entry_Validation, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string AllowAcrossMonthLeaveValidation(string company_Code, string user_Code, string fromDate, string toDate, string leaveTypeCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@Leave_Type_Code", leaveTypeCode);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_Allow_Across_Month_Leave_Validation, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string InsertUpdateLeave(string company_Code, string user_Code, string user_Name, string region_Code, string fromDate, string toDate, string reason, string leaveTypeCode, string entry_mode, int leave_Status, string doc_Url, int originOfDCR, string uploaded_files, DateCapturingModel _obDateDet)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", company_Code);
                    p.Add("@user_Code", user_Code);
                    p.Add("@user_Name", user_Name);
                    p.Add("@region_Code", region_Code);
                    p.Add("@fromDate", fromDate);
                    p.Add("@toDate", toDate);
                    p.Add("@reason", reason);
                    p.Add("@leaveTypeCode", leaveTypeCode);
                    p.Add("@entry_mode", entry_mode);
                    p.Add("@leave_Status", leave_Status);
                    p.Add("@doc_Url", doc_Url);
                    p.Add("@originOfDCR", originOfDCR);
                    p.Add("@uploaded_files", uploaded_files);
                    p.Add("@UTC_Date", _obDateDet.UTC_Date);
                    p.Add("@Created_TimeZone", _obDateDet.TimeZone);
                    p.Add("@Created_OffSet", _obDateDet.Off_Set);
                    p.Add("@Created_Date", _obDateDet.Date);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_DCR_InsertUpdateLeave, p, commandType: CommandType.StoredProcedure, commandTimeout: 180);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string InsertLeave(string fromDate, string toDate, string reason, string leaveTypeCode, string sundayValidation, string isAddedWeekendHoliday, string sourceOfEntry, int originOfDCR, string isAddHoliday, string leaveweekendHoliday)
        {
            try
            {
                string cmdText = "SP_hdInsertLeave";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserName());
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                //AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetRegionName());
                AddParamToSqlCommand(command, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 15, toDate);
                AddParamToSqlCommand(command, "@Reason", ParameterDirection.Input, SqlDbType.VarChar, 500, reason);
                AddParamToSqlCommand(command, "@SundayValidation", ParameterDirection.Input, SqlDbType.VarChar, 500, sundayValidation);
                AddParamToSqlCommand(command, "@IsAddedWeekendHoliday", ParameterDirection.Input, SqlDbType.VarChar, 5, isAddedWeekendHoliday);
                AddParamToSqlCommand(command, "@SourceOfEntry", ParameterDirection.Input, SqlDbType.VarChar, 10, sourceOfEntry);
                AddParamToSqlCommand(command, "@OriginOfDCR", ParameterDirection.Input, SqlDbType.TinyInt, 1, originOfDCR);
                AddParamToSqlCommand(command, "@IsAddedHoliday", ParameterDirection.Input, SqlDbType.VarChar, 5, isAddHoliday);
                AddParamToSqlCommand(command, "@leaveweekendHoliday", ParameterDirection.Input, SqlDbType.VarChar, leaveweekendHoliday.Length, leaveweekendHoliday);
                //AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertLeave()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CheckClubLeave(string fromDate, string toDate, string leaveTypeCode, string userLeaveTypeCode)
        {
            try
            {
                string result = "";

                string cmdText = "SP_hdClubLeave";
                SqlCommand cmdCLub = new SqlCommand(cmdText);
                cmdCLub.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmdCLub, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(cmdCLub, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(cmdCLub, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserTypeCode());
                AddParamToSqlCommand(cmdCLub, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);
                AddParamToSqlCommand(cmdCLub, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 15, toDate);
                AddParamToSqlCommand(cmdCLub, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(cmdCLub, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(cmdCLub, "@UserLeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userLeaveTypeCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                cmdCLub.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(cmdCLub);

                result = returnValue.Value.ToString();
                return result.ToString().Length == 0 ? "0" : result.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CheckLeaveValidation(string fromDate, string toDate, string leaveTypeCode, string userLeaveTypeCode, string leavetypeName, string isWeekend, string isHoliday, double noOfDays)
        {
            try
            {
                string result = "";

                string cmdText = "SP_hdCHECKLEAVEVALIDATION";
                SqlCommand cmdCLub = new SqlCommand(cmdText);
                cmdCLub.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmdCLub, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(cmdCLub, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(cmdCLub, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserTypeCode());
                AddParamToSqlCommand(cmdCLub, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(cmdCLub, "@LeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, leaveTypeCode);
                AddParamToSqlCommand(cmdCLub, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, fromDate);
                AddParamToSqlCommand(cmdCLub, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 15, toDate);
                AddParamToSqlCommand(cmdCLub, "@IsAddedWeekendHoliday", ParameterDirection.Input, SqlDbType.VarChar, 5, isWeekend);
                AddParamToSqlCommand(cmdCLub, "@IsAddedHoliday", ParameterDirection.Input, SqlDbType.VarChar, 5, isHoliday);
                AddParamToSqlCommand(cmdCLub, "@LeaveTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, leavetypeName);
                AddParamToSqlCommand(cmdCLub, "@NoOffDaysLeaveApply", ParameterDirection.Input, SqlDbType.Float, 30, noOfDays);
                AddParamToSqlCommand(cmdCLub, "@UserLeaveTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userLeaveTypeCode);


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 1000;
                cmdCLub.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(cmdCLub);

                result = returnValue.Value.ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //

        // Stockiest Expense
        public string InsertStockiest(string dcrDate, string dcrStatus, string stockiestData)
        {
            try
            {
                string cmdText = "SP_hdInsertStockiest";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrStatus);
                AddParamToSqlCommand(command, "@StockiestDetails", ParameterDirection.Input, SqlDbType.VarChar, stockiestData.Length, stockiestData);
                //  AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertStockiest()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertExpense(string dcrDate, string dcrStatus, string expenseContent, string dailyAllowance, string flag)
        {
            try
            {
                string cmdText = "SP_hdInsertExpense";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrStatus);
                AddParamToSqlCommand(command, "@PrivilegeValue", ParameterDirection.Input, SqlDbType.VarChar, 30, dailyAllowance);
                AddParamToSqlCommand(command, "@ExpenseDetails", ParameterDirection.Input, SqlDbType.VarChar, expenseContent.Length, expenseContent);
                AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);
                //AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertExpense()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string UpdateProductAndStatus(string dcrDate, string autoApproval, string flag)
        {
            try
            {
                string cmdText = "SP_hdUpdateProductAndChangeStatus";
                string todayDate = DateTime.Now.ToShortDateString();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@AutoApproval", ParameterDirection.Input, SqlDbType.VarChar, 5, autoApproval);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserName());
                AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrDate);
                AddParamToSqlCommand(command, "@Lattitue", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLattitude());
                AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLongitude());
                AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, _objcurrentInfo.GetLocation());
                AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 500, _objcurrentInfo.GetRegionName());
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 500, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateProductAndStatus()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //

        // Header
        public string InsertHeaderDetails(string dcrDate, string dcrStatus, string distanceFareCode, string category, string categoryCode, string cpCode, string cpName,
            string workPlace, string fromPlace, string toPlace, string travelMode, string distance, string startTime, string endTime, string acc1Name, string acc1Type,
            string acc1StartTime, string acc1EndTime, string acc1OnlyDoctor, string acc2Name, string acc2Type, string acc2StartTime, string acc2EndTime,
            string acc2OnlyDoctor, string acc3Name, string acc3Time, string acc3OnlyDoctor, string acc4Name, string acc4Time, string acc4OnlyDoctor,
            string isrcpa, string routeWay, string sourceOfEntry, string activistyString, string dcrFlag, string tpDeviation, string cpDeviation, int originOfDCR)
        {
            try
            {
                string cmdText = "SP_hdInsertHeader";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrStatus);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@DistanceFareCode", ParameterDirection.Input, SqlDbType.VarChar, 30, distanceFareCode);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 50, category);
                AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                AddParamToSqlCommand(command, "@CPCode", ParameterDirection.Input, SqlDbType.VarChar, 50, cpCode);
                AddParamToSqlCommand(command, "@CPName", ParameterDirection.Input, SqlDbType.VarChar, 50, cpName);
                AddParamToSqlCommand(command, "@WorkPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, workPlace);
                AddParamToSqlCommand(command, "@FromPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, fromPlace);
                AddParamToSqlCommand(command, "@ToPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, toPlace);
                AddParamToSqlCommand(command, "@TravelMode", ParameterDirection.Input, SqlDbType.VarChar, 50, travelMode);
                AddParamToSqlCommand(command, "@Distance", ParameterDirection.Input, SqlDbType.VarChar, 50, distance);
                AddParamToSqlCommand(command, "@StartTime", ParameterDirection.Input, SqlDbType.VarChar, 10, startTime);
                AddParamToSqlCommand(command, "@EndTime", ParameterDirection.Input, SqlDbType.VarChar, 10, endTime);
                AddParamToSqlCommand(command, "@Acc1Name", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1Name);
                AddParamToSqlCommand(command, "@Acc1Type", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1Type);
                AddParamToSqlCommand(command, "@Acc1StartTime", ParameterDirection.Input, SqlDbType.VarChar, 10, acc1StartTime);
                AddParamToSqlCommand(command, "@Acc1EndTime", ParameterDirection.Input, SqlDbType.VarChar, 10, acc1EndTime);
                AddParamToSqlCommand(command, "@Acc1OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1OnlyDoctor);
                AddParamToSqlCommand(command, "@Acc2Name", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2Name);
                AddParamToSqlCommand(command, "@Acc2Type", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2Type);
                AddParamToSqlCommand(command, "@Acc2StartTime", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2StartTime);
                AddParamToSqlCommand(command, "@Acc2EndTime", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2EndTime);
                AddParamToSqlCommand(command, "@Acc2OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2OnlyDoctor);
                AddParamToSqlCommand(command, "@Acc3Name", ParameterDirection.Input, SqlDbType.VarChar, 50, acc3Name);
                AddParamToSqlCommand(command, "@Acc3Time", ParameterDirection.Input, SqlDbType.VarChar, 30, acc3Time);
                AddParamToSqlCommand(command, "@Acc3OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc3OnlyDoctor);
                AddParamToSqlCommand(command, "@Acc4Name", ParameterDirection.Input, SqlDbType.VarChar, 50, acc4Name);
                AddParamToSqlCommand(command, "@Acc4Time", ParameterDirection.Input, SqlDbType.VarChar, 30, acc4Time);
                AddParamToSqlCommand(command, "@Acc4OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc4OnlyDoctor);
                AddParamToSqlCommand(command, "@IsRCPA", ParameterDirection.Input, SqlDbType.Char, 1, isrcpa);
                AddParamToSqlCommand(command, "@RouteWay", ParameterDirection.Input, SqlDbType.VarChar, 10, routeWay);
                AddParamToSqlCommand(command, "@Lattitude", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLattitude());
                AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetLongitude());
                AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, _objcurrentInfo.GetLocation());
                AddParamToSqlCommand(command, "@SourceOfEntry", ParameterDirection.Input, SqlDbType.VarChar, 10, sourceOfEntry);
                AddParamToSqlCommand(command, "@ActivityString", ParameterDirection.Input, SqlDbType.VarChar, activistyString.Length, activistyString);
                AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);
                AddParamToSqlCommand(command, "@TPDeviation", ParameterDirection.Input, SqlDbType.VarChar, 1, tpDeviation);
                AddParamToSqlCommand(command, "@CPDeviation", ParameterDirection.Input, SqlDbType.VarChar, 1, cpDeviation);
                AddParamToSqlCommand(command, "@OriginOfDCR", ParameterDirection.Input, SqlDbType.TinyInt, 1, originOfDCR);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertHeaderDetails()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertTravelledPlaces(string dcrDate, string intermediateData, string flag, string category)
        {
            try
            {
                string cmdText = "SP_hdInsertTravelledPlaces";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                AddParamToSqlCommand(command, "@IntermediateData", ParameterDirection.Input, SqlDbType.VarChar, intermediateData.Length, intermediateData);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 5, flag);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 50, category);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertTravelledPlaces()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //

        // Calendar
        public DataSet GetCalendarDetails(string startDate, string endDate, string userCode, string regionCode, string parentRegions)
        {
            try
            {
                string cmdText = "SP_hdGetSelectedDCRMaster";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@ParentRegions", ParameterDirection.Input, SqlDbType.VarChar, parentRegions.Length, parentRegions);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                //AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetLockLeaveDetails(string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetSelctedDCRLockLeave";
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                // AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDCRInstantReportDetails(string dcrDate, string productType)
        {
            try
            {
                string cmdText = "SP_hdInstantReportData";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, _objcurrentInfo.GetDCRCode(dcrDate));
                AddParamToSqlCommand(command, "@ProductType", ParameterDirection.Input, SqlDbType.VarChar, 30, productType);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserTypeCode());
                AddParamToSqlCommand(command, "@EligibleRegion", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetRegionCode());
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrDate);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertDCRLock(string mode, string lockType, string releasedDate)
        {
            try
            {
                string cmdText = "SP_hdInsertDCRLockIdle";


                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@LockedType", ParameterDirection.Input, SqlDbType.VarChar, 30, lockType);
                AddParamToSqlCommand(command, "@ReleasedDate", ParameterDirection.Input, SqlDbType.VarChar, 12, releasedDate);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 2, mode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result.Trim().Length > 0 ? result : "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertDCRLock()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertDCRLockLeave(string lockDates)
        {
            try
            {
                string cmdText = "InsertDCRLockLeave";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@LockedDates", ParameterDirection.Input, SqlDbType.VarChar, lockDates.Length, lockDates);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertDCRLockLeave()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSelectedDoctors(string companyCode, string regions, string regionCode,
            string DoctorNamePreSufConfigValue, string dcrActualDate)
        {
            try
            {
                string cmdText = "SP_hdV4GetDCRDoctors";


                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regions.Length, regions);
                AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");
                AddParamToSqlCommand(command, "@Config_Value", ParameterDirection.Input, SqlDbType.VarChar, 50, DoctorNamePreSufConfigValue);
                AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.Date, 50, dcrActualDate);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSelectedChemists(string companyCode, string regions, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetSelectedChemists";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regions.Length, regions);
                AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSelectedProducts(string companyCode, string userCode, string prodBringType, string searchWord)
        {
            try
            {
                string cmdText = "SP_hdGetSelectedProducts";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@ProductTypes", ParameterDirection.Input, SqlDbType.VarChar, 1000, prodBringType);
                AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");
                AddParamToSqlCommand(command, "@SearchWord", ParameterDirection.Input, SqlDbType.VarChar, 10, searchWord);


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);


                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSaleProducts(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdGetSaleProducts";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSpeciality(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdGetSpeciality";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);


                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteDoctorVisitDataAll(string dcrCode)
        {
            try
            {
                string cmdText = "SP_hdDeleteDoctorVisitDataAll";


                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);

                string result = returnValue.Value.ToString();
                return result.Length > 0 ? result : "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "DeleteDoctorVisitDataAll()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CheckQuantity(string companyCode, string dcrCode, string userCode, string dcrActualDate, string regionCode)
        {
            try
            {
                string cmdText = "[sp_hdCheckProductsQuantity]";
                string result = "";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;


                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrActualDate);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                result = (_objData.ExecuteScalar(command)).ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetInstantReportDetails(string companyCode, string userCode, string regionCode, string dcrActualDate, string dcrCode, string flag)
        {
            try
            {
                string cmdText = "SP_hdGetUserPerDayReport";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrActualDate);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);

                DataSet ds = new DataSet();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDCRDetails(string companyCode, string userCode, string DCRActualMonth, string DCRActualYear, string dcrStatus)
        {
            try
            {
                string cmdText = "SP_mHDGetDCRDetails";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRActualMonth", ParameterDirection.Input, SqlDbType.VarChar, 2, DCRActualMonth);
                AddParamToSqlCommand(command, "@DCRActualYear", ParameterDirection.Input, SqlDbType.VarChar, 4, DCRActualYear);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 2, dcrStatus);


                DataSet ds = new DataSet();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string SetDCRUnapprove(string companyCode, string userCode, string userName, string dcrActualDate, string dcrCode, string flag, string unapprovalReason, string calcFieldStatus)
        {
            try
            {
                string cmdText = "SP_hdDCRStatusChange";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrActualDate);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@UnapproveReason", ParameterDirection.Input, SqlDbType.VarChar, 500, unapprovalReason);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);
                AddParamToSqlCommand(command, "@CalcFieldStatus", ParameterDirection.Input, SqlDbType.VarChar, 1, calcFieldStatus);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = command.Parameters["@Result"].ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CheckTheDCRCanbeUnapprove(string comapnyCode, string userCode, string dcrCode, string flag)
        {
            Data dataObj = new Data();
            try
            {

                SqlCommand command = new SqlCommand(SP_hdChecktheDCRCanBeUnapprove);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);

                dataObj.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dataObj.ExecuteNonQuery(command);

                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("dcrCode", dcrCode);
                dicObj.Add("flag", flag);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return ex.Message;
            }
            finally
            {
                dataObj.CloseConnection();
            }
        }


        public DataSet GetActivityMaster(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "[SP_hdGetSelectedActivity]";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";

                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertTargetHeader(string spName, string targetName, string regionCode, string fromDate, string toDate, string mode, string targetCode)
        {
            try
            {
                string cmdText = spName;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@TargetName", ParameterDirection.Input, SqlDbType.VarChar, 30, targetName);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 30, fromDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 30, toDate);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 5, mode);
                AddParamToSqlCommand(command, "@TargetCode", ParameterDirection.Input, SqlDbType.VarChar, 30, targetCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertTargetHeader()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRegionMasterDetails()
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionMasterDetails_NG '" + _objcurrentInfo.GetRegionCode() + "'");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetUserDetails(string companyCode)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_GetUserDetails");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string GetSSInheritedStatus(string regionCode, string stockiestCode)
        {
            try
            {


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //returnValue.Value = "";
                //command.Parameters.Add(returnValue);
                //_objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                //_objData.ExecuteNonQuery(command);
                //string result = returnValue.Value.ToString();
                //return result;
                string cmdText = "SP_HDSSGetInheritedStatus";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, stockiestCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSecondarySalesProducts(string companyCode, string prodBringType, string entryMode, string regionCode, string stockiestCode)
        {
            try
            {
                string cmdText = "SP_hdGetSecondarySalesProducts";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@ProductTypes", ParameterDirection.Input, SqlDbType.VarChar, 30, prodBringType);
                AddParamToSqlCommand(command, "@EntryMode", ParameterDirection.Input, SqlDbType.VarChar, 30, entryMode);
                AddParamToSqlCommand(command, "@StockCode", ParameterDirection.Input, SqlDbType.VarChar, 30, stockiestCode);
                AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetDoubleCheckSSEntry(string companyCode, string regionCode, string month, string year, string stockiest_Code)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@regionCode", regionCode);
                    p.Add("@month", month);
                    p.Add("@year", year);
                    p.Add("@stockiest_Code", stockiest_Code);
                    p.Add("@Result", result, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_StockiestSecondarySalesEntryCheck, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;

        }

        public DataSet GetLatestMonth(string company_code, string region_code, string stockiest_Code)
        {
            string result = string.Empty;
            try
            {
                string cmdText = "SP_hdGetSecondarySalesMonth";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_code);
                AddParamToSqlCommand(command, "@Region_code ", ParameterDirection.Input, SqlDbType.VarChar, 30, region_code);
                AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, stockiest_Code);

                _objData.OpenConnection(company_code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }



        public DataSet GetMonthDiff(string companyCode, string startDate, string endDate)
        {
            string result = string.Empty;
            try
            {
                string cmdText = "SP_hdGetMonthDiff";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@startDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate ", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetSecondarySalesDetails(string companyCode, string regionCode, string entryMode)
        {
            try
            {
                string cmdText = "sp_hdGetSecondarySale";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@EntryMode", ParameterDirection.Input, SqlDbType.VarChar, 30, entryMode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public int CheckPreMonthSSData(string companyCode, string SS_Code, string startDate)
        {
            try
            {
                string cmdText = "SP_HDCheckPreMonthSSData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@SS_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, SS_Code);

                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);

                _objData.OpenConnection(companyCode);
                int count = (int)_objData.ExecuteScalar(command);
                return count;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetSecSelectedDetails(string companyCode, string RegionCode, string month, string year, string statementDate, string ssCode)
        {
            try
            {
                string cmdText = "sp_hdGetSelectedSS";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 30, year);
                AddParamToSqlCommand(command, "@StatementDate", ParameterDirection.Input, SqlDbType.VarChar, 30, statementDate);
                AddParamToSqlCommand(command, "@SSCode", ParameterDirection.Input, SqlDbType.VarChar, 30, ssCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecondarySalesForDelete(string companyCode, string regionCode, string stockiestCode, string mode)
        {
            try
            {
                string cmdText = "Sp_HdGetDeleteSecondarySalesDetail";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Stockiest_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, stockiestCode);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }


        }
        public DataSet GetSecEditDetails(string companyCode, string RegionCode, string month, string year, string statementDate, string ssCode, string baseCode, string entryMode)
        {
            try
            {
                string cmdText = "sp_hdGetEditSS";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 30, year);
                AddParamToSqlCommand(command, "@StatementDate", ParameterDirection.Input, SqlDbType.VarChar, 30, statementDate);
                AddParamToSqlCommand(command, "@SSCode", ParameterDirection.Input, SqlDbType.VarChar, 30, ssCode);
                AddParamToSqlCommand(command, "@BaseCode", ParameterDirection.Input, SqlDbType.VarChar, 30, baseCode);
                AddParamToSqlCommand(command, "@EntryMode", ParameterDirection.Input, SqlDbType.VarChar, 30, entryMode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecEnteredProduct(string companyCode, string regionCode, string month, string year, string entryMode, string StockiestCode)
        {
            try
            {
                string cmdText = "sp_hdGetEnteredProductsSS";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 10, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 10, year);
                AddParamToSqlCommand(command, "@EntryMode", ParameterDirection.Input, SqlDbType.VarChar, 30, entryMode);
                AddParamToSqlCommand(command, "@StockiestCode", ParameterDirection.Input, SqlDbType.VarChar, 30, StockiestCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public List<MVCModels.PS_EditableColumn> GetEditableColumns(string companyCode, int month, int year, string region_Code)
        {
            List<MVCModels.PS_EditableColumn> lstPs = new List<MVCModels.PS_EditableColumn>();
            SqlDataReader sqldataReader;
            _objData = new Data();
            try
            {
                _objData = new Data();

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETPSPREFILLCOLUMNNAMES
                                                                                     + " '" + month + "','" + year + "','" + region_Code + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.PS_EditableColumn objPs = new MVCModels.PS_EditableColumn();
                            objPs.Column_Name = sqldataReader["SS_Column_Name"].ToString();
                            objPs.Is_Editable = Convert.ToInt32(sqldataReader["Is_Editable"].ToString());
                            objPs.Division_Code = sqldataReader["Division_Code"].ToString();
                            lstPs.Add(objPs);
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstPs;
        }

        public List<MVCModels.PS_SecondarysalesDetails> GetPSDocumentTypeName(string companyCode, int month, int year, string region_Code)
        {
            List<MVCModels.PS_SecondarysalesDetails> lstPs = new List<MVCModels.PS_SecondarysalesDetails>();
            SqlDataReader sqldataReader;
            _objData = new Data();
            try
            {
                _objData = new Data();

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_GETPSSSDOCUMENTTYPENAME
                                                                                     + " '" + month + "','" + year + "','" + region_Code + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.PS_SecondarysalesDetails objPs = new MVCModels.PS_SecondarysalesDetails();
                            objPs.Column_Name = sqldataReader["SS_Column_Name"].ToString();
                            objPs.Document_Type = sqldataReader["Document_Type_name"].ToString();
                            objPs.Calc_Mode = sqldataReader["Calc_Mode"].ToString();
                            objPs.Division_Code = sqldataReader["Division_Code"].ToString();
                            lstPs.Add(objPs);
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstPs;
        }


        public int CheckPSIsPrefill(string companyCode, int month, int year, string region_Code)
        {
            int result = 0;

            //try
            //{
            //    using (IDbConnection connection = IDbOpenConnection())
            //    {
            //        var p = new DynamicParameters();
            //        p.Add("@Month", month);
            //        p.Add("@Year", year);
            //        result = connection.Query<int>(SP_HDISCHECKPSINSS, p, commandType: CommandType.StoredProcedure);
            //        connection.Close();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    return 0;
            //}
            try
            {
                string cmdText = "SP_HdIsCheckPsInSS";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 12, year);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);


                _objData.OpenConnection(companyCode);
                result = (int)_objData.ExecuteScalar(command);
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public DataSet GetSecondartSalesPrice(string companyCode, string customerCode, string type, string regionCode, string month, string year, string currentDate, string currentMonth, string currentYear)
        {
            try
            {
                string cmdText = "SP_hdGetPriceGroup";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@SelectionType", ParameterDirection.Input, SqlDbType.VarChar, 30, type);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, currentDate);
                AddParamToSqlCommand(command, "@CurrentMonth", ParameterDirection.Input, SqlDbType.VarChar, 5, currentMonth);
                AddParamToSqlCommand(command, "@CurrentYear", ParameterDirection.Input, SqlDbType.VarChar, 5, currentYear);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecondartSalesPriceForEdit(string companyCode, string customerCode, string type, string regionCode, string month, string year, string currentDate, string currentMonth, string currentYear)
        {
            try
            {
                string cmdText = "SP_hdEditSSGetPriceGroup";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@SelectionType", ParameterDirection.Input, SqlDbType.VarChar, 30, type);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, currentDate);
                AddParamToSqlCommand(command, "@CurrentMonth", ParameterDirection.Input, SqlDbType.VarChar, 5, currentMonth);
                AddParamToSqlCommand(command, "@CurrentYear", ParameterDirection.Input, SqlDbType.VarChar, 5, currentYear);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetStockiestWiseCustomerValidation(string companyCode, string customerCode, string stockiest, string regionCode, string month, string year, string currentDate, string currentMonth, string currentYear)
        {
            try
            {
                string cmdText = "SP_hdSS_StockiestWiseCustomerValidation";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, customerCode.Length, customerCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Stockiest_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, stockiest);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 5, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 5, year);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, currentDate);
                AddParamToSqlCommand(command, "@CurrentMonth", ParameterDirection.Input, SqlDbType.VarChar, 5, currentMonth);
                AddParamToSqlCommand(command, "@CurrentYear", ParameterDirection.Input, SqlDbType.VarChar, 5, currentYear);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetStockiestData(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdGetStockiest";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //To get the Stockiest Names for Secondary Sales
        public DataSet GetSecondarySalesStockiestData(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetSecondarySalesStockiest";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        
        public DataSet GetHiDoctorUserAccess(string CompCode, string userName)
        {
            try
            {
                string cmdText = SPHDGETWEBACCESS;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objData.OpenConnection(CompCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetPrivilegeData(string companyCode, string userName)
        {
            try
            {
                string cmdText = "SP_hdGetPrivilegeMappingDetails";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet CheckUserAuthentication(string companyCode, string userName, string password, string commonPassword, string isCaseSensitive)
        {
            try
            {
                string cmdText = "SP_hdCheckUserAuthentication";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                AddParamToSqlCommand(command, "@Password", ParameterDirection.Input, SqlDbType.VarChar, 30, password);
                AddParamToSqlCommand(command, "@CommonPassword", ParameterDirection.Input, SqlDbType.VarChar, 30, commonPassword);
                AddParamToSqlCommand(command, "@CaseSensitive", ParameterDirection.Input, SqlDbType.Char, 1, isCaseSensitive);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public void UpdatePasswordFailureCount(string companyCode, string userCode, int pwdFailureCount)
        {
            try
            {
                string cmdText = "SP_hdUpdatePwdFailureCount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@PwdFailureCount", ParameterDirection.Input, SqlDbType.Int, 3, pwdFailureCount);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public void LockUserAccount(string companyCode, string userCode, int pwdFailureCount)
        {
            try
            {
                string cmdText = "SP_hdLockUserAccount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@PwdFailureCount", ParameterDirection.Input, SqlDbType.Int, 3, pwdFailureCount);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public void ReleaseUserAccount(string companyCode, string userCode, string lockReleaseMode, string lockReleasedBy, string lockReleaseDate)
        {
            try
            {
                string cmdText = "SP_hdReleaseUserAccount";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@LockReleaseMode", ParameterDirection.Input, SqlDbType.VarChar, 30, lockReleaseMode);
                AddParamToSqlCommand(command, "@LockReleasedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, lockReleasedBy);
                AddParamToSqlCommand(command, "@LockReleaseTime", ParameterDirection.Input, SqlDbType.DateTime, 30, lockReleaseDate);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public bool InsertUserLog(string companyCode, string userCode, string loginId, string ipAddress, string loginTime, string sessionId, string sourceOfEntry,
                                    string lattitude, string longitude, string location, string userAgent)
        {
            try
            {
                string cmdText = "SP_hdInsertUserLog";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Logid", ParameterDirection.Input, SqlDbType.VarChar, 50, loginId);
                AddParamToSqlCommand(command, "@IpAddress", ParameterDirection.Input, SqlDbType.VarChar, 15, ipAddress);
                AddParamToSqlCommand(command, "@LoginTime", ParameterDirection.Input, SqlDbType.VarChar, 30, loginTime);
                AddParamToSqlCommand(command, "@SessionId", ParameterDirection.Input, SqlDbType.VarChar, 50, sessionId);
                AddParamToSqlCommand(command, "@SourceOfEntry", ParameterDirection.Input, SqlDbType.VarChar, 10, sourceOfEntry);
                AddParamToSqlCommand(command, "@Lattitude", ParameterDirection.Input, SqlDbType.VarChar, 30, lattitude);
                AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, longitude);
                AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, location);
                AddParamToSqlCommand(command, "@userAgent", ParameterDirection.Input, SqlDbType.VarChar, 1000, userAgent);
                _objData.OpenConnection(companyCode);
                object count = _objData.ExecuteScalar(command);
                return true;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetSelectedDoctorVisitData(string companyCode, string userCode, string dcrCode, string dvCode, string dcrActualDate,
            string pdCodes, string cvCodes, string rdCodes)
        {
            try
            {
                string cmdText = "sp_hdGetSelecetdDoctorVisitData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrActualDate);
                AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dvCode.Replace("^", ""));
                AddParamToSqlCommand(command, "@DoctorVisitCodes", ParameterDirection.Input, SqlDbType.VarChar, 50, dvCode.Replace("^", ","));
                AddParamToSqlCommand(command, "@ProductDetailsCodes", ParameterDirection.Input, SqlDbType.VarChar, pdCodes.Length, pdCodes.Replace("^", ","));
                AddParamToSqlCommand(command, "@ChemistVisitCodes", ParameterDirection.Input, SqlDbType.VarChar, cvCodes.Length, cvCodes.Replace("^", ","));
                AddParamToSqlCommand(command, "@RCPADetailsCodes", ParameterDirection.Input, SqlDbType.VarChar, rdCodes.Length, rdCodes.Replace("^", ","));
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public List<SalesCompetitor> GetSalesCompetitors(string companyCode, string Region_Code, string Dcr_Date)
        {
            List<SalesCompetitor> lst = new List<SalesCompetitor>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@DcrDate", Dcr_Date);
                    lst = conn.Query<SalesCompetitor>("sp_hdGetSalesCompetitor", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return lst;
        }

        public DataSet GetCompetitors(string companyCode, string Region_Code, string dcr_Date, string saleProductCode)
        {
            try
            {
                string cmdText = "sp_hdGetSelectedCompetitor";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Region_Code);
                AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.VarChar, 10, dcr_Date);
                AddParamToSqlCommand(command, "@SaleProductCode", ParameterDirection.Input, SqlDbType.VarChar, saleProductCode.Length, saleProductCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion Activity



        #region Reports

        public DataSet GetWorkAnalysisReport(string companyCode, string userCode, string regionCode, string month, string year)
        {
            try
            {
                string cmdText = "SP_hdGetWorkAnalysisReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, regionCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 10, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 10, year);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetretgionTypeDetails()
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTypeDetails_NG");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        // Region Type Migration
        public DataSet GetRegionTypeMaster(string companyCode)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTypeMaster_NG");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        // Region Master Migration
        public DataSet GetRegionMaster(string companyCode)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionMaster_NG");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetParentRegionDataSet(string companyCode, string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetParentRegionData";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 150;
                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(cmd);

                return ds;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetParentRegionDataSet()");
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorMasterReport(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_HD_GetDoctorMasterDetailsforRept";
                // string cmdText = "SP_hdGetDoctorMasterReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
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

        public DataSet GetDoctorMasterDetails(string companyCode, string userCode, string regionCode, string categoryCode)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorMasterDoctorDetails";
                // string cmdText = "SP_hdGetDoctorMasterDetails";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@CaregoryCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, categoryCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsChildRegion(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetChildRegions";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                // AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsParentRegion(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetParentRegions";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetManPowerStatusReport(string companyCode, string regionCodes)
        {
            try
            {
                string cmdText = "SP_hdGetManPowerStatusReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetManpowerSummary(string companyCode, string regionCodes, string month, string year, string status)
        {
            try
            {
                string cmdText = "SP_hdGetManpowerSummary";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetSecondarySalesCompliance(string companyCode, string userCode, string regionCodes, string year)
        {
            try
            {
                string cmdText = "SP_hdGetSecondarySalesComplianceReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetLockReport(string companyCode, string regionCode, string year, string lockType)
        {
            try
            {
                string cmdText = "SP_hdGetLockReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@LockType", ParameterDirection.Input, SqlDbType.VarChar, lockType.Length, lockType);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetDayWiseAttendanceReport(string companyCode, string regionCode, string startDate, string endDate, string status)
        {
            try
            {
                string cmdText = "SP_hdGetDayWiseAttendanceReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }



        public DataSet GetSecondarySalesReport(string companyCode, string userCode, string regionCodes, string year, string month, string productCode)
        {
            try
            {
                string cmdText = "SP_hdGetSecondarySalesReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, productCode.Length, productCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetFieldWorkPlanner(string companyCode, string userCode, string regionCodes, string regionCode, string month, string year)
        {

            try
            {
                string cmdText = "SP_hdGetFieldWorkPlanner";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 4, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetFieldWorkPlannerPopup(string companyCode, string regionCode, string month, string year)
        {

            try
            {
                string cmdText = "SP_hdGetFieldWorkPlannerPopup";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 4, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetRCBADetails(string companyCode, string regionCodes, string startDate, string endDate)
        {

            try
            {
                string cmdText = "SP_hdGetRCPADetailedReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRCBASummaryDetails(string companyCode, string regionCode, string startDate, string endDate, string status, string productCode, string regionCodes)
        {

            try
            {
                string cmdText = "SP_hdGetRCPADetailed";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, productCode.Length, productCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRCBADetailsData(string companyCode, string regionCodes, string startDate, string endDate, string status)
        {

            try
            {
                string cmdText = "SP_hdGetRCPADetailedData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctor360(string companyCode, string doctorCode, string userCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetDoctor360Details";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DoctorCode", ParameterDirection.Input, SqlDbType.VarChar, 30, doctorCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetDoctorProductMapping(string companyCode, string userCode, string regionCodes)
        {

            try
            {
                string cmdText = "SP_hdGetDoctorProductMapping";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorProductMappingPopup(string companyCode, string regionCode, string categoryCode)
        {

            try
            {
                string cmdText = "SP_hdGetDoctorProductMappingPopup";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@categoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetExpenseMasterReport(string companyCode, string regionCode, string userTypeCode, string regionClassi)
        {

            try
            {
                string cmdText = "SP_hdGetExpenseReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, userTypeCode.Length, userTypeCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@RegionClass", ParameterDirection.Input, SqlDbType.VarChar, regionClassi.Length, regionClassi);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet dsChildUserSearch(string companyCode, string userCode, string userName)
        {
            try
            {
                string cmdText = "SP_hdGetChildUsersSearch";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //@ Leave Report Get Child Users
        public DataSet dsChildUsers(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdGetChildUsers";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsChildUserLeave(string companyCode, string userCode)
        {
            try
            {
                string cmdText = "SP_hdChildUserCodes";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //@ Leave Report 
        public DataSet GetLeaveReport(string companyCode, string userCodes, string startDate, string endDate, string yearStartDate, string previousDate)
        {
            try
            {
                string cmdText = "SP_hdGetLeaveReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@YearStartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, yearStartDate);
                AddParamToSqlCommand(command, "@PreviousDate", ParameterDirection.Input, SqlDbType.VarChar, 30, previousDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
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
            try
            {
                string cmdText = "GetHoliday";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@regionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@startDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@endDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@ParentRegion", ParameterDirection.Input, SqlDbType.VarChar, parentRegion.Length, parentRegion);
                AddParamToSqlCommand(command, "@dcrStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetDoctorPOBDetails(string companyCode, string regionCodes, string startDate)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorPOBReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetChemistPOBDetails(string companyCode, string regionCodes, string startDate)
        {
            try
            {
                string cmdText = "SP_hdGetChemistPOBReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetStockiestPOBDetails(string companyCode, string regionCodes, string startDate)
        {
            try
            {
                string cmdText = "SP_hdGetStockiestPOBReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }




        public DataSet GetLastSubmittedData(string companyCode, string startMonth, string endMonth, string startYear, string endYear, string regionCode, string category, string regionTypeCode)
        {
            try
            {
                string cmdText = "sp_hdGetLastSubmittedData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartMonth", ParameterDirection.Input, SqlDbType.VarChar, 2, startMonth);
                AddParamToSqlCommand(command, "@EndMonth", ParameterDirection.Input, SqlDbType.VarChar, 2, endMonth);
                AddParamToSqlCommand(command, "@StartYear", ParameterDirection.Input, SqlDbType.VarChar, 4, startYear);
                AddParamToSqlCommand(command, "@EndYear", ParameterDirection.Input, SqlDbType.VarChar, 4, endYear);
                AddParamToSqlCommand(command, "@Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@Region_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, regionTypeCode.Length, regionTypeCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetMissedCallRecovery(string companyCode, string regionCode, string startDate, string endDate, string status, string category)
        {
            try
            {
                string cmdText = "sp_hdGetLastSubmittedData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsRegionCodeWiseUser(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetRegionCodeWiseUserCode";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDayAnalysisReport(string companyCode, string regionCode, string userCode, string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetDayWorkAnalysisReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDayAnalysisPopupReport(string companyCode, string regionCode, string userCode, string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetDayWorkAnalysisPopReport";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }



        public DataSet GetDoctorVisitsFrequencyPopup(string companyCode, string regionCode, string userCode, string startDate, string endDate, string category)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorVisitsAnalysisPop";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //  TP vs Actual Deviation Details
        public DataSet GetTPvsActualDeviationDetails(string companyCode, string regionCode, string month, string year, string userCode)
        {
            try
            {
                string cmdText = "SP_HD_GETTPvsActualDeviationDetailsRept";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
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

        public DataSet GetDoctorCallAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorCallAnalysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.Date, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.Date, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorCallAnalysisPopup(string companyCode, string regionCode, string userCode, string startDate, string endDate, string category, string mode)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorCallsAnalysisPop";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetCompetitorBrandAnalysis(string companyCode, string regionCode, string startDate, string endDate, string dcrStatus, string productCode, string categoryCode, string specialityCode)
        {
            try
            {
                string cmdText = "SP_hdGetCompetitorBrandAnalysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                AddParamToSqlCommand(command, "@Cateory", ParameterDirection.Input, SqlDbType.VarChar, categoryCode.Length, categoryCode);
                AddParamToSqlCommand(command, "@Speciality", ParameterDirection.Input, SqlDbType.VarChar, specialityCode.Length, specialityCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetJoinedWorkAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetJoinedWorkAnalysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetJoinedWorkFieldDetails(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                string cmdText = "SP_hdGetJoinedWorkFieldDetails";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorYearlyVisitAnalysisReport(string companyCode, string regionCode, string startDate, string endDate, string dcrStatus, string selectionType)
        {
            try
            {
                string cmdText = "SP_hdGetDoctorYearlyVisitAnalysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                AddParamToSqlCommand(command, "@SelectionType", ParameterDirection.Input, SqlDbType.VarChar, 10, selectionType);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecondarySalesTrendAnalysis(string companyCode, string userCode, string regionCode, string startMonth, string endMonth, string ProductCode)
        {
            try
            {
                string cmdText = "SP_hdGetSecondarySalesTrendAnalysis";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartMonth", ParameterDirection.Input, SqlDbType.VarChar, startMonth.Length, startMonth);
                AddParamToSqlCommand(command, "@EndMonth", ParameterDirection.Input, SqlDbType.VarChar, endMonth.Length, endMonth);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, ProductCode.Length, ProductCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecSalesStockiestWiseReport(string companyCode, string regionCodes, string startDate, string endDate, string productCode)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_SEC_SALES_STOCKIEST_WISE_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCodes);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, productCode.Length, productCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {

                _objData.CloseConnection();
            }
        }

        public DataSet GetStockistWiseUnderOverStock(string companyCode, string userCode, string regionCode, string startDate, string endDate, string ProductCode)
        {
            try
            {
                string cmdText = "SP_hdGetStockistWiseUnderOverStock";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, ProductCode.Length, ProductCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetRCPACompliance(string companyCode, string userCode, string regionCode, string startDate, string endDate, string status)
        {
            try
            {
                string cmdText = "SP_hdGetRCPACompliance";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDoctorMissedFromCategory(string companyCode, string userCode, string regionCode, string Month, string Year, string status)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_DOCTORMISSEDFROMCATEGORY);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDoctorMissedFromCategory()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDoctorMissedFromCategoryDetails(string companyCode, string userCode, string regionCode, string Month, string year, string status, string category)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_DOCTORMISSEDFROMCATEGORYDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDoctorMissedFromCategoryDetails()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }



        public DataSet GetDailyStatusReport(string companyCode, string userCode, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_DAILY_STATUS_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDailyStatusReport()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDailyStatusExpensePopup(string companyCode, string userCode, string dcrCode, string flag)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_DAILY_STATUS_EXPENSE_POP);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, dcrCode.Length, dcrCode);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, flag.Length, flag);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, ex.Message + "in GetDailyStatusExpensePopup().");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDailyStatusDoctorPopup(string companyCode, string userCode, string dcrCode, string flag)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_DAILY_STATUS_DOCTOR_POP);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, dcrCode.Length, dcrCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, ex.Message + "in GetDailyStatusDoctorPopup().");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetActivityCount(string companyCode, string userCodes, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_ACTIVITYCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrStatus);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 15, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 15, endDate);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetActivityCount()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSundayCount(string companyCode, string userCodes, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SUNDAYCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.VarChar, userCodes.Length, userCodes);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrStatus);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 15, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 15, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetSundayCount()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetHolidayCount(string companyCode, string userCode, string regionCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HOLIDAYCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrStatus);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 15, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 15, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetHolidayCount()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetHolidayCount(string companyCode, string userCode, string regionCode, string startDate, string endDate, string dcrStatus, string ConnectionString)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HOLIDAYCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrStatus);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 15, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 15, endDate);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetHolidayCount()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetStockistWiseUnderOverStockReport(string companyCode, string userCode, string regionCode, string startDate, string endDate, string ProductCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_STOCKIEST_WISE_UNDER_OVER_STOCK);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, ProductCode.Length, ProductCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetSecondarySalesTrendAnalysisNew(string companyCode, string userCode, string regionCode, string startDate, string endDate, string ProductCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SEC_SALES_TREND_NEW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, ProductCode.Length, ProductCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDivisionDetails(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetRegionWiseDivision";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetUserDivisionDetails(string companyCode, string regionCode)
        {
            try
            {
                string cmdText = "SP_hdGetUserWiseDivision";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetRCPADetailPopup(string companyCode, string regionCode, string userCode, string doctorCode)
        {

            try
            {
                string cmdText = "SP_hdGetDoctor360Details";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@DoctorCode", ParameterDirection.Input, SqlDbType.VarChar, 30, doctorCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetSpecialityWiseAnalysisReport(string companyCode, string regionCode, string Month, string Year, string status)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_SPECIALITYANANLYSIS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSpecialityWiseAnalysisDetails(string companyCode, string regionCode, string month, string Year, string status, string specialityCode)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_SPECIALITYANANLYSISDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Speciality_Code", ParameterDirection.Input, SqlDbType.VarChar, specialityCode.Length, specialityCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetVacancyReport(string companyCode, string regionCode, string startDate, string endDate)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_VACANT_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetMarketingCampaignTraker(string companyCode, string compaignCode, string userCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_CAMPAIGN_DETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@CampaignCode", ParameterDirection.Input, SqlDbType.VarChar, compaignCode.Length, compaignCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, endDate.Length, endDate);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetGeoLocationReport(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GEO_LOCATION);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, dcrStatus.Length, dcrStatus);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSecondarySalesCustomer(string companyCode, string regionCode, string startDate, string endDate, string productCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_SECONDARY_SALES_CUSTOMER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, productCode.Length, productCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetAuditReport(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_AUDIT_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetVacancyReportNew(string companyCode, string regionCode, string startDate, string endDate, string regionStatus)
        {

            try
            {
                endDate = string.Concat(endDate, " 23:59:59");
                DateTime dtStartDate = Convert.ToDateTime(startDate);
                DateTime dtEndDate = Convert.ToDateTime(endDate);
                SqlCommand command = new SqlCommand(SP_VACANT_REPORT_NEW);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.DateTime, 30, dtStartDate.ToString());
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.DateTime, 30, dtEndDate.ToString());
                AddParamToSqlCommand(command, "@RegionStatus", ParameterDirection.Input, SqlDbType.VarChar, 10, regionStatus);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //public DataSet GetSalesAndActivityPerformance(string companyCode, string regionCode, string startDate, string endDate)
        //{

        //    try
        //    {

        //        SqlCommand command = new SqlCommand(SP_SALES_ACTIVITY_PERFORMANCE);
        //        command.CommandType = CommandType.StoredProcedure;
        //        command.CommandTimeout = 300;
        //        AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
        //        AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
        //        AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.DateTime, 30, startDate);
        //        AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.DateTime, 30, endDate);
        //        _objData.OpenConnection(companyCode);
        //        DataSet ds = _objData.ExecuteDataSet(command);
        //        return ds;
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //}

        public DataSet GetComprehensiveAnalysisReport(string companyCode, string userCode, string startDate, string endDate, string reportType, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCOMPREHENSIVEANALYSISREPT);
                // SqlCommand command = new SqlCommand(SP_HD_COMREHENSIVE_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@ReportType", ParameterDirection.Input, SqlDbType.VarChar, 10, reportType);
                AddParamToSqlCommand(command, "@MONTH", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
                AddParamToSqlCommand(command, "@YEAR", ParameterDirection.Input, SqlDbType.VarChar, 30, year);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
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

        public DataSet GetComprehensiveAnalysisReport(string companyCode, string userCode, string startDate, string endDate, string reportType, string month, string year, string ConnectionString)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCOMPREHENSIVEANALYSISREPT);
                // SqlCommand command = new SqlCommand(SP_HD_COMREHENSIVE_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@ReportType", ParameterDirection.Input, SqlDbType.VarChar, 10, reportType);
                AddParamToSqlCommand(command, "@MONTH", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
                AddParamToSqlCommand(command, "@YEAR", ParameterDirection.Input, SqlDbType.VarChar, 30, year);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
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

        public DataSet GetDoctorVisitsAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_DOCTOR_VISIT_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.Date, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.Date, 30, endDate);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        #endregion Reports


        // Organogram-Start
        public string RegionMigration(string companyCode)
        {
            try
            {
                string cmdText = "SP_hdRegionMigration";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertRegionMaster(string companyCode, string regionCode, string regionName, string regionTypeCode, string underRegionCode,
           string regionStatus, string regionClassification, string regionClassificationCode, string regionTypeId, string expenseGroupId,
            string underRegionId, string country, string state, string city, string localarea, string lat, string lng)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdInsertRegionMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionName);
                AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                AddParamToSqlCommand(command, "@UnderRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionCode);
                AddParamToSqlCommand(command, "@RegionStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, regionStatus);
                AddParamToSqlCommand(command, "@RegionClassification", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassification);
                AddParamToSqlCommand(command, "@RegionClassificationCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassificationCode);
                AddParamToSqlCommand(command, "@RegionTypeId", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeId);
                AddParamToSqlCommand(command, "@ExpenseGroupId", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseGroupId);
                AddParamToSqlCommand(command, "@UnderRegionId", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionId);
                AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@Country", ParameterDirection.Input, SqlDbType.VarChar, 50, country);
                AddParamToSqlCommand(command, "@State", ParameterDirection.Input, SqlDbType.VarChar, 50, state);
                AddParamToSqlCommand(command, "@City", ParameterDirection.Input, SqlDbType.VarChar, 50, city);
                AddParamToSqlCommand(command, "@LocalArea", ParameterDirection.Input, SqlDbType.VarChar, 500, localarea);
                AddParamToSqlCommand(command, "@lat", ParameterDirection.Input, SqlDbType.VarChar, 50, lat);
                AddParamToSqlCommand(command, "@long", ParameterDirection.Input, SqlDbType.VarChar, 50, lng);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertRegionMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        public string UpdateRegionMaster(string companyCode, string regionCode, string regionName, string regionTypeCode, string underRegionCode,
         string regionStatus, string regionClassification, string regionClassificationCode, string regionTypeId, string expenseGroupId,
            string underRegionId, string country, string state, string city, string localarea, string lat, string lng)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateRegionMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionName);
                AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                AddParamToSqlCommand(command, "@UnderRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionCode);
                AddParamToSqlCommand(command, "@RegionStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, regionStatus);
                AddParamToSqlCommand(command, "@RegionClassification", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassification);
                AddParamToSqlCommand(command, "@RegionClassificationCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassificationCode);
                AddParamToSqlCommand(command, "@RegionTypeId", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeId);
                AddParamToSqlCommand(command, "@ExpenseGroupId", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseGroupId);
                AddParamToSqlCommand(command, "@UnderRegionId", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionId);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                AddParamToSqlCommand(command, "@Country", ParameterDirection.Input, SqlDbType.VarChar, 50, country);
                AddParamToSqlCommand(command, "@State", ParameterDirection.Input, SqlDbType.VarChar, 50, state);
                AddParamToSqlCommand(command, "@City", ParameterDirection.Input, SqlDbType.VarChar, 50, city);
                AddParamToSqlCommand(command, "@LocalArea", ParameterDirection.Input, SqlDbType.VarChar, 500, localarea);
                AddParamToSqlCommand(command, "@lat", ParameterDirection.Input, SqlDbType.VarChar, 50, lat);
                AddParamToSqlCommand(command, "@long", ParameterDirection.Input, SqlDbType.VarChar, 50, lng);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        //public int UpdateSSEntryDCRLock(string companyCode, string regionCode, int month, int year, string customerCode, string userCode)
        //{
        //    int result = 0;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@companyCode", companyCode);
        //            p.Add("@regionCode", regionCode);
        //            p.Add("@month", month);
        //            p.Add("@year", year);
        //            p.Add("@Customer_Code", customerCode);
        //            p.Add("@User_Code", userCode);
        //            p.Add("@Result", result, DbType.Int32, ParameterDirection.Output);
        //            connection.Query<int>(SP_HD_SS_Entry_Lock_Release, p, commandType: CommandType.StoredProcedure);
        //            result = p.Get<int>("@Result");
        //            connection.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //    return result;

        //}

        public string UpdateSSDCRLock(string companyCode, string regionCode, string month, string year, string customerCode, string userCode, string mode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_HDUpdateSS_DCR_Lock";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 30, year);
                AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        //public string UpdateSSDCRUnapproval_Lock(string companyCode, string regionCode, string month, string year)
        //{
        //    string result = "";
        //    try
        //    {
        //        string cmdText = "SP_HDUpdateSS_DCR_Lock";
        //        SqlCommand command = new SqlCommand(cmdText);
        //        command.CommandType = CommandType.StoredProcedure;

        //        AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
        //        AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
        //        AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 30, month);
        //        AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 30, year);

        //        SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
        //        returnValue.Direction = ParameterDirection.Output;
        //        returnValue.Size = 500;
        //        returnValue.Value = "";
        //        command.Parameters.Add(returnValue);
        //        _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
        //        _objData.ExecuteNonQuery(command);
        //        result = returnValue.Value.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorLog.LogError(ex, "UpdateRegionMaster()");
        //        result = "";
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //    return result;
        //}


        public string UserMigration(string companyCode)
        {
            try
            {
                string cmdText = "SP_hdUserMigration";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
        string UserName, string UserPass, string UserStatus, string RegionCode,
           string ExpenseGroupId, string HiDOCTORStartDate, string createdBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdInsertUserMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                AddParamToSqlCommand(command, "@EmployeeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, EmployeeCode);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserTypeCode);
                AddParamToSqlCommand(command, "@UnderUserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UnderUserCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, UserName);
                AddParamToSqlCommand(command, "@UserPass", ParameterDirection.Input, SqlDbType.VarChar, 30, UserPass);
                AddParamToSqlCommand(command, "@UserStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, UserStatus);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                // AddParamToSqlCommand(command, "@UserDivisionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserDivisionCode);
                // AddParamToSqlCommand(command, "@UserCategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCategoryCode);
                //  AddParamToSqlCommand(command, "@ExpenseEligibilityRegion", ParameterDirection.Input, SqlDbType.VarChar, 30, ExpenseEligibilityRegion);
                AddParamToSqlCommand(command, "@ExpenseGroupId", ParameterDirection.Input, SqlDbType.VarChar, 30, ExpenseGroupId);
                AddParamToSqlCommand(command, "@HiDOCTORStartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, HiDOCTORStartDate);
                AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                // AddParamToSqlCommand(command, "@parent_ID", ParameterDirection.Input, SqlDbType.VarChar, 30, parent_ID);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertUserMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
         string UserName, string UserPass, string UserStatus, string RegionCode,
          string ExpenseGroupId, string HiDOCTORStartDate, string updatedBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                AddParamToSqlCommand(command, "@EmployeeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, EmployeeCode);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserTypeCode);
                AddParamToSqlCommand(command, "@UnderUserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UnderUserCode);
                AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, UserName);
                AddParamToSqlCommand(command, "@UserPass", ParameterDirection.Input, SqlDbType.VarChar, 30, UserPass);
                AddParamToSqlCommand(command, "@UserStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, UserStatus);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                // AddParamToSqlCommand(command, "@UserDivisionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserDivisionCode);
                // AddParamToSqlCommand(command, "@UserCategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCategoryCode);
                //AddParamToSqlCommand(command, "@ExpenseEligibilityRegion", ParameterDirection.Input, SqlDbType.VarChar, 30, ExpenseEligibilityRegion);
                AddParamToSqlCommand(command, "@ExpenseGroupId", ParameterDirection.Input, SqlDbType.VarChar, 30, ExpenseGroupId);
                AddParamToSqlCommand(command, "@HiDOCTORStartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, HiDOCTORStartDate);
                // AddParamToSqlCommand(command, "@parent_ID", ParameterDirection.Input, SqlDbType.VarChar, 30, parent_ID);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateRegionSeqIndex(string companyCode, string node, string sourceNode, string hitMode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateRegionSeqIndex";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Node", ParameterDirection.Input, SqlDbType.VarChar, 30, node);
                AddParamToSqlCommand(command, "@SourceNode", ParameterDirection.Input, SqlDbType.VarChar, 30, sourceNode);
                AddParamToSqlCommand(command, "@HitMode", ParameterDirection.Input, SqlDbType.VarChar, 30, hitMode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionSeqIndex()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserSeqIndex(string companyCode, string node, string sourceNode, string hitMode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserSeqIndex";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Node", ParameterDirection.Input, SqlDbType.VarChar, 30, node);
                AddParamToSqlCommand(command, "@SourceNode", ParameterDirection.Input, SqlDbType.VarChar, 30, sourceNode);
                AddParamToSqlCommand(command, "@HitMode", ParameterDirection.Input, SqlDbType.VarChar, 30, hitMode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserSeqIndex()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateRegionFullIndex(string companyCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateRegionFullIndex";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionFullIndex()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserFullIndex(string companyCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserFullIndex";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserFullIndex()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserFullIndexNew(string companyCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserFullIndex";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserFullIndex()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        public string UpdateRegionStatus(string companyCode, string regionCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateRegionStatus";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionStatus()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserStatus(string companyCode, string userCode, string updatedBy, string resignationDate)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserStatus";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                AddParamToSqlCommand(command, "@ResignationDate", ParameterDirection.Input, SqlDbType.VarChar, 30, resignationDate);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserStatus()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        public string RegionNodeUp(string companyCode, string regionCode, string updatedBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdMoveRegionNodeUp";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "RegionNodeUp()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UserNodeUp(string companyCode, string userCode, string updatedBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdMoveUserNodeUp";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@updatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UserNodeUp()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string RegionNodeDown(string companyCode, string regionCode, string updatedBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdMoveRegionNodeDown";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "RegionNodeDown()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UserNodeDown(string companyCode, string userCode, string updatedBy)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdMoveUserNodeDown";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UserNodeDown()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateRegionHierarchy(string companyCode, string regionCodes, string underRegionCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateRegionHierarchy";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                AddParamToSqlCommand(command, "@UnderRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionHierarchy()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserHierarchy(string companyCode, string UserCodes, string underUserCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdUpdateUserHierarchy";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCodes", ParameterDirection.Input, SqlDbType.VarChar, UserCodes.Length, UserCodes);
                AddParamToSqlCommand(command, "@UnderUserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, underUserCode);
                AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserHierarchy()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertEmployee(string companyCode, string employeeCode, string employeeName, string gender, string dateOfBirth,
        string address, string phone, string mobile, string employeeStatus, string emailId, string dateofJoining, string employeeNumber, string eDNProof,
           string salaryProof, string resumeGiven, string resignationSubmitted, string appointed, string SCBAccountNumber, string ICICIAccountNumber, string PFNumber,
           string PANNumber, string confirmationDate, string employeeEntityType)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdInsertEmployee";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@EmployeeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeCode);
                AddParamToSqlCommand(command, "@EmployeeName", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeName);
                AddParamToSqlCommand(command, "@Gender", ParameterDirection.Input, SqlDbType.VarChar, 30, gender);
                AddParamToSqlCommand(command, "@DateOfBirth", ParameterDirection.Input, SqlDbType.VarChar, 30, dateOfBirth);
                AddParamToSqlCommand(command, "@Address", ParameterDirection.Input, SqlDbType.VarChar, 30, address);
                AddParamToSqlCommand(command, "@Phone", ParameterDirection.Input, SqlDbType.VarChar, 30, phone);
                AddParamToSqlCommand(command, "@Mobile", ParameterDirection.Input, SqlDbType.VarChar, 30, mobile);
                AddParamToSqlCommand(command, "@EmployeeStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeStatus);
                AddParamToSqlCommand(command, "@EmailId", ParameterDirection.Input, SqlDbType.VarChar, 30, emailId);
                AddParamToSqlCommand(command, "@DateofJoining", ParameterDirection.Input, SqlDbType.VarChar, 30, dateofJoining);
                AddParamToSqlCommand(command, "@EmployeeNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeNumber);
                AddParamToSqlCommand(command, "@EDNProof", ParameterDirection.Input, SqlDbType.VarChar, 30, eDNProof);
                AddParamToSqlCommand(command, "@SalaryProof", ParameterDirection.Input, SqlDbType.VarChar, 30, salaryProof);
                AddParamToSqlCommand(command, "@ResumeGiven", ParameterDirection.Input, SqlDbType.VarChar, 30, resumeGiven);
                AddParamToSqlCommand(command, "@ResignationSubmitted", ParameterDirection.Input, SqlDbType.VarChar, 30, resignationSubmitted);
                AddParamToSqlCommand(command, "@Appointed", ParameterDirection.Input, SqlDbType.VarChar, 30, appointed);
                AddParamToSqlCommand(command, "@SCBAccountNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, SCBAccountNumber);
                AddParamToSqlCommand(command, "@ICICIAccountNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, ICICIAccountNumber);
                AddParamToSqlCommand(command, "@PFNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, PFNumber);
                AddParamToSqlCommand(command, "@PANNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, PANNumber);
                AddParamToSqlCommand(command, "@ConfirmationDate", ParameterDirection.Input, SqlDbType.VarChar, 30, confirmationDate);
                AddParamToSqlCommand(command, "@EmployeeEntityType", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeEntityType);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertEmployee()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        // organogram- end

        //Expense Group- start
        public string UpdateExpenseGroup(string insertData, string groupID)
        {
            try
            {
                string cmdText = "SP_hdUpdateExpenseGroup";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@Expense_Group_ID", ParameterDirection.Input, SqlDbType.VarChar, 50, groupID);
                AddParamToSqlCommand(command, "@ExpenseDetails", ParameterDirection.Input, SqlDbType.VarChar, insertData.Length, insertData);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateExpenseGroup()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertExpenseGroup(string insertData, string groupName)
        {
            try
            {
                string cmdText = "SP_hdInsertExpenseGroup";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@Expense_Group_Name", ParameterDirection.Input, SqlDbType.VarChar, 100, groupName);
                AddParamToSqlCommand(command, "@ExpenseDetails", ParameterDirection.Input, SqlDbType.VarChar, insertData.Length, insertData);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserCode());

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertExpenseGroup()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //Expense Group- end

        //Holiday Group -start
        public string DeleteHolidayGroupDetail(string groupDetailId)
        {
            try
            {
                string cmdText = "SP_hdDeleteHolidayGroupDetails";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@HolidayGroupDetailId", ParameterDirection.Input, SqlDbType.VarChar, 30, groupDetailId);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                if (result.Length == 0)
                {
                    result = "SUCCESS";
                }
                else
                {
                    result = "FAIL" + result;
                }
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "DeleteHolidayGroupDetail()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string UpdateHolidayGroup(string insertData, string groupID)
        {
            try
            {
                string cmdText = "SP_hdUpdateHolidayGroup";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@Holiday_Group_ID", ParameterDirection.Input, SqlDbType.VarChar, 50, groupID);
                AddParamToSqlCommand(command, "@HolidayDetails", ParameterDirection.Input, SqlDbType.VarChar, insertData.Length, insertData);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateHolidayGroup()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertHolidayGroup(string insertData, string groupName)
        {
            try
            {
                string cmdText = "SP_hdInsertHolidayGroup";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@Holiday_Group_Name", ParameterDirection.Input, SqlDbType.VarChar, 100, groupName);
                AddParamToSqlCommand(command, "@HolidayDetails", ParameterDirection.Input, SqlDbType.VarChar, insertData.Length, insertData);
                AddParamToSqlCommand(command, "@User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserName());

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertHolidayGroup()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // Holiday Group- End


        //Product Master
        public string InsertProduct(string storedProcedureName, string companyCode, string productName, string specialityCode,
         string brandCode, string categoryCode, string UOMTypeCode, string UOMCode, string productTypeCode, string productGroupCode,
            string productDesc, string productTypeName, string productShortName, string productCost, string effectiveFrom,
            string effectiveTo, string eproductCode, string competitorName, string RefKey1, string RefKey2, string User_Code)
        {
            try
            {

                // Command - specify as StoredProcedure
                SqlCommand command = new SqlCommand(storedProcedureName);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@ProductName", ParameterDirection.Input, SqlDbType.VarChar, 300, productName);
                AddParamToSqlCommand(command, "@SpecialityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, specialityCode);
                AddParamToSqlCommand(command, "@BrandCode", ParameterDirection.Input, SqlDbType.VarChar, 30, brandCode);
                AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                AddParamToSqlCommand(command, "@UOMTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UOMTypeCode);
                AddParamToSqlCommand(command, "@UOMCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UOMCode);
                AddParamToSqlCommand(command, "@ProductTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productTypeCode);
                AddParamToSqlCommand(command, "@ProductGroupCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productGroupCode);
                AddParamToSqlCommand(command, "@ProductDesc", ParameterDirection.Input, SqlDbType.VarChar, 255, productDesc);
                AddParamToSqlCommand(command, "@ProductTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, productTypeName);
                AddParamToSqlCommand(command, "@ProductShortName", ParameterDirection.Input, SqlDbType.VarChar, 30, productShortName);
                AddParamToSqlCommand(command, "@ProductCost", ParameterDirection.Input, SqlDbType.VarChar, 30, productCost);
                AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveTo);
                AddParamToSqlCommand(command, "@EProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, eproductCode);
                AddParamToSqlCommand(command, "@CompetitorName", ParameterDirection.Input, SqlDbType.VarChar, 100, competitorName);
                AddParamToSqlCommand(command, "@RefKey1", ParameterDirection.Input, SqlDbType.VarChar, 50, RefKey1);
                AddParamToSqlCommand(command, "@RefKey2", ParameterDirection.Input, SqlDbType.VarChar, 50, RefKey2);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, User_Code);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                // Execute the stored procedure
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                return returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertProduct()");
                return "ERROR";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertProductGroup(string storedProcedureName, string companyCode, string productGroupName, string effectiveFrom, string effectiveTo, string status,
            string mode, string ProductGroupCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(storedProcedureName);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@ProductGroupName", ParameterDirection.Input, SqlDbType.VarChar, 30, productGroupName);
                AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveTo);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.Char, 30, mode);
                AddParamToSqlCommand(command, "@ProdGroupCode", ParameterDirection.Input, SqlDbType.Char, 30, ProductGroupCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);

                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                // Execute the stored procedure
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);

                return returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertProductGroup()");
                return "ERROR";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteProductGroup(string storedProcedureName, string companyCode, string ProductGroupCode, string status)
        {
            try
            {
                SqlCommand command = new SqlCommand(storedProcedureName);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@ProdGroupCode", ParameterDirection.Input, SqlDbType.VarChar, 30, ProductGroupCode);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);

                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                // Execute the stored procedure
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);

                return returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertProductGroup()");
                return "ERROR";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //Product Master- end

        public int InsertSalesProductMapping(string query)
        {
            try
            {
                SqlCommand command = new SqlCommand("ExecQuery");
                command.CommandType = CommandType.StoredProcedure;

                SqlParameter inparm = command.Parameters.Add("@query", SqlDbType.VarChar);
                inparm.Direction = ParameterDirection.Input;
                inparm.Value = query;

                // Return value as parameter
                SqlParameter returnValue = new SqlParameter("returnVal", SqlDbType.Int);
                returnValue.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(returnValue);

                // Execute the stored procedure
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                return Convert.ToInt32(returnValue.Value);

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertSalesProductMapping()");
                return 0;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertDoctor(string companyCode, string customerCode, string customerName, string regionCode, string subRegionCode,
        string category, string specialityCode, string address1, string address2, string localArea, string phone, string mobile,
        string fax, string email, string DOB, string anniversaryDate, string MDLNumber, string qualification, string registrationNumber,
        string hospitalName, string hospitalClassification, string userCode, string mode, string Remarks)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdInsertDoctorMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                AddParamToSqlCommand(command, "@CustomerName", ParameterDirection.Input, SqlDbType.VarChar, 300, customerName);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@SubRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, subRegionCode);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                AddParamToSqlCommand(command, "@SpecialityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, specialityCode);
                AddParamToSqlCommand(command, "@Address1", ParameterDirection.Input, SqlDbType.VarChar, 255, address1);
                AddParamToSqlCommand(command, "@Address2", ParameterDirection.Input, SqlDbType.VarChar, 255, address2);
                AddParamToSqlCommand(command, "@LocalArea", ParameterDirection.Input, SqlDbType.VarChar, 50, localArea);
                AddParamToSqlCommand(command, "@Phone", ParameterDirection.Input, SqlDbType.VarChar, 20, phone);
                AddParamToSqlCommand(command, "@Mobile", ParameterDirection.Input, SqlDbType.VarChar, 20, mobile);
                AddParamToSqlCommand(command, "@Fax", ParameterDirection.Input, SqlDbType.VarChar, 20, fax);
                AddParamToSqlCommand(command, "@Email", ParameterDirection.Input, SqlDbType.VarChar, 100, email);
                AddParamToSqlCommand(command, "@DOB", ParameterDirection.Input, SqlDbType.VarChar, 30, DOB);
                AddParamToSqlCommand(command, "@AnniversaryDate", ParameterDirection.Input, SqlDbType.VarChar, 30, anniversaryDate);
                AddParamToSqlCommand(command, "@MDLNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, MDLNumber);
                AddParamToSqlCommand(command, "@Qualification", ParameterDirection.Input, SqlDbType.VarChar, 30, qualification);
                AddParamToSqlCommand(command, "@RegistrationNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, registrationNumber);
                AddParamToSqlCommand(command, "@HospitalName", ParameterDirection.Input, SqlDbType.VarChar, 100, hospitalName);
                AddParamToSqlCommand(command, "@HospitalClassification", ParameterDirection.Input, SqlDbType.VarChar, 50, hospitalClassification);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, 500, Remarks);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertDoctor()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string GetLeafRegions(string regionCodes)
        {
            string result = "";
            try
            {
                string cmdText = "sp_hdGetLeafLevelRegions";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = -1;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetLeafRegions()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string InsertCustomerMaster(string entity, string tableName, string regionCode, string columnNames, string columnValues, string customerCode, string mode,
            string lat, string lon, string historyNeeded, string effectiveFrom, string appliedDate, string isFlexi, string dcrVisitCode)
        {
            string result = "";
            try
            {
                string cmdText = "SP_hdInsertCustomerMaster";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetCompanyCode());
                AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, entity);
                AddParamToSqlCommand(command, "@TableName", ParameterDirection.Input, SqlDbType.VarChar, 300, tableName);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@ColumnNames", ParameterDirection.Input, SqlDbType.VarChar, columnNames.Length, columnNames);
                AddParamToSqlCommand(command, "@ColumnValues", ParameterDirection.Input, SqlDbType.VarChar, columnValues.Length, columnValues);
                AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, columnValues.Length, customerCode);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, columnValues.Length, mode);
                AddParamToSqlCommand(command, "@Lat", ParameterDirection.Input, SqlDbType.VarChar, columnValues.Length, lat);
                AddParamToSqlCommand(command, "@Log", ParameterDirection.Input, SqlDbType.VarChar, columnValues.Length, lon);
                AddParamToSqlCommand(command, "@HistoryNeeded", ParameterDirection.Input, SqlDbType.VarChar, 10, historyNeeded);
                AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, _objcurrentInfo.GetUserName());
                AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                AddParamToSqlCommand(command, "@AppliedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, appliedDate);
                AddParamToSqlCommand(command, "@CustomerStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, isFlexi);
                AddParamToSqlCommand(command, "@DCRVisitCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrVisitCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertCustomerMaster()");
                result = "";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string GetCustomerMasterMaxCode(string companyCode, string regionCode, string customerType)
        {
            Data _objData = new Data();
            string query = "SELECT MAX(CAST(SUBSTRING(Customer_Code,13,LEN(Customer_Code)) AS INT)) FROM tbl_SFA_Customer_Master WHERE Company_Code = '" + companyCode + "' AND Region_Code = '" + regionCode + "' AND Customer_Entity_Type = '" + customerType + "'";
            int count = _objData.GetIntegerValue(companyCode, query);
            string maxCode = "";

            count++;

            if (customerType.ToUpper() == "DOCTOR")
            {
                maxCode = regionCode.Replace("REC", "DOC") + "D" + count.ToString();
            }
            else if (customerType.ToUpper() == "CHEMIST")
            {
                maxCode = regionCode.Replace("REC", "CMC") + "C" + count.ToString();
            }
            else if (customerType.ToUpper() == "STOCKIEST")
            {
                maxCode = regionCode.Replace("REC", "STC") + "S" + count.ToString();
            }
            else if (customerType.ToUpper() == "CUSTOMER")
            {
                maxCode = regionCode.Replace("REC", "CHC") + "C" + count.ToString();
            }

            return maxCode;
        }


        public DataSet GetSFAWAReportsMenu(string companyCode, string userTypeCode)
        {
            try
            {
                string cmdText = SP_HDGETSFAWAREPORTSMENU;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsGetDoctorCategories(string companyCode)
        {
            try
            {
                string cmdText = "SP_HdGetDoctorCategories";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet dsGetSpecialities(string companyCode)
        {

            try
            {
                string cmdText = "Sp_hdGetSpecialities";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public bool SendMail(string toMailId, string subject, string mailBody)
        {
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();

                MailAddress fromAddress = new MailAddress("No_Reply@swaas.net");

                message.From = fromAddress;
                message.To.Add(toMailId);
                message.Subject = subject;
                message.IsBodyHtml = false;
                message.Body = mailBody;

                smtpClient.Host = "smtp.gmail.com";   // We use gmail as our smtp client
                smtpClient.Port = 587;
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = true;
                smtpClient.Credentials = new System.Net.NetworkCredential("No_Reply@swaas.net", "swaas123");
                smtpClient.EnableSsl = true;

                smtpClient.Send(message);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        // Inward Bul upload
        public DataSet GetDivisions(string companyCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_DIVISION_SELECT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetProductTypeMaster(string companyCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGET_PRODUCT_TYPE_MASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetProductTypePrivilageValue(string companyCode, string userTypeCode, string privilegeName, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETSINGLEPRIVILEGEVALUEFORUSERTYPE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, userTypeCode.Length, userTypeCode);
                AddParamToSqlCommand(command, "@PrivilegeName", ParameterDirection.Input, SqlDbType.VarChar, 30, privilegeName);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetUserTypeMaster(string companyCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_USER_TYPE_SELECT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetProductsByDivisionAndProductTypes(string company_Code, string division_Code, string product_type_code, string userTypeCode, string privilegeName, string screenMode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGET_PRODUCTS_BY_DIVISION_AND_PRODUCTTYPE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Divison_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, division_Code);
                AddParamToSqlCommand(command, "@Product_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, product_type_code);
                AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, userTypeCode.Length, userTypeCode);
                AddParamToSqlCommand(command, "@PrivilegeName", ParameterDirection.Input, SqlDbType.VarChar, 30, privilegeName);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, screenMode);

                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetInwardExcelData(string company_Code, string division_Code, string product_type_code, string user_type_code, string product_codes)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_INWRAD_EXCEL_DATA);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Division_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, division_Code);
                AddParamToSqlCommand(command, "@Product_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, product_type_code);
                AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_type_code);
                AddParamToSqlCommand(command, "@Product_Codes", ParameterDirection.Input, SqlDbType.VarChar, product_codes.Length, product_codes);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public void InsertInwardBulkUploadAsync(string subDomain, DataTable dt, string company_code, Guid bpid, string user_code, string uploadFileName, string bp_Type,
            string user_type_code, string product_type_code, string inward_Date)
        {

            string result = BatchProcessingBulkInsert(subDomain, company_code, dt, bpid, "TBL_SFA_INWARD_BATCHPROCESSING_STAGING");
            if (result.Length == 0)
            {
                try
                {
                    SqlCommand command = new SqlCommand(SP_HD_INSERT_INWARD_BULK_UPLOAD_STAGING);
                    command.CommandType = CommandType.StoredProcedure;
                    AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_code);
                    AddParamToSqlCommand(command, "@BP_ID", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, bpid);
                    AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_code);
                    AddParamToSqlCommand(command, "@BP_TYPE", ParameterDirection.Input, SqlDbType.NVarChar, 25, bp_Type);
                    AddParamToSqlCommand(command, "@Upload_File_Name", ParameterDirection.Input, SqlDbType.NVarChar, 500, uploadFileName);
                    AddParamToSqlCommand(command, "@Inward_Date", ParameterDirection.Input, SqlDbType.NVarChar, 12, inward_Date);

                    _objData.OpenConnectionAsync(subDomain);
                    _objData.ExecuteNonQueryAsync(command);
                }
                catch
                {
                    throw;
                }
            }
            else
            {
                InsertBatchProcessingHeader(subDomain, company_code, bpid, uploadFileName, bp_Type, user_code, "FAILED", result);
            }
        }

        public DataSet GetBatchProcessingHeader(string company_Code, string bpType, string user_code, string Effective_from, string Effective_to, int Value)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_BATCHPROCESSING_HEADER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@BP_TYPE", ParameterDirection.Input, SqlDbType.NVarChar, 50, bpType);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_code);
                AddParamToSqlCommand(command, "@Effective_from", ParameterDirection.Input, SqlDbType.NVarChar, 30, Effective_from);
                AddParamToSqlCommand(command, "@Effective_to", ParameterDirection.Input, SqlDbType.NVarChar, 30, Effective_to);
                AddParamToSqlCommand(command, "@Value", ParameterDirection.Input, SqlDbType.Int, 8, Value);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetBatchProcessingHeaderForPSAutomation(string company_Code, string bpType, string user_code, string Effective_from, string Effective_to, int Value)
        {
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_GET_BATCHPROCESSING_HEADER_FOR_PSAutomation");
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@BP_TYPE", ParameterDirection.Input, SqlDbType.NVarChar, 50, bpType);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_code);
                AddParamToSqlCommand(command, "@Effective_from", ParameterDirection.Input, SqlDbType.NVarChar, 30, Effective_from);
                AddParamToSqlCommand(command, "@Effective_to", ParameterDirection.Input, SqlDbType.NVarChar, 30, Effective_to);
                AddParamToSqlCommand(command, "@Value", ParameterDirection.Input, SqlDbType.Int, 8, Value);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetBatchProcessingErrorLog(string company_Code, Guid bpid)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_BATCHPROCESSING_ERRORS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@BP_ID", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, bpid);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetPSAutomationJsonData(string company_Code, Guid bpid)
        {
            try
            {
                SqlCommand command = new SqlCommand("SP_Hd_GetPSAutomationJsonData");
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@strGuid", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, bpid);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetBatchProcessingErrorLogForPSAutomation(string company_Code, Guid bpid)
        {
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_GET_BATCHPROCESSING_ERRORS_FOR_PSAutomation");
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@BP_ID", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, bpid);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetActivitySummarReport(string companyCode, string userCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_MOBILE_GET_ACTIVITY_SUMMARY_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetActivitySummarDetailsReport(string companyCode, string userCode, string categoryCode, string ReportCategory, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_MOBILE_GET_ACTIVITY_SUMMARY_DETAILS_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                AddParamToSqlCommand(command, "@ReportCategory", ParameterDirection.Input, SqlDbType.VarChar, 30, ReportCategory);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetOrderStatusReport(string companyCode, string userCode, string startDate, string endDate, string orderStatus)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_OTC_ORDER_STATUS_REPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@OrderStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, orderStatus);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetWeekendgroupdetail(string companyCode, string regionCode, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_WEEKENDGROUP);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@MODE", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, mode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDivisionWiseCateoryAndSpeciality(string companyCode, string regionCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_DIVISIONWISE_CATEORY_SPECIALITY);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetUserPrivileges(string companyCode, string userCode, string userTypeCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_USER_PRIVILEGE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRegionWiseUser(string companyCode, string regionCode)
        {
            try
            {
                string query = "SP_hdGetRegionWiseUser";
                SqlCommand command = new SqlCommand(query);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public string GetConfigDefaultValue(string companyCode, CONFIG_TYPE configType, CONFIG_KEY configKey)
        {
            try
            {
                string configValue = string.Empty;

                SqlCommand command = new SqlCommand(SP_hdGetConfigSettings);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Type", ParameterDirection.Input, SqlDbType.VarChar, 100, configType);
                AddParamToSqlCommand(command, "@ConfigKey", ParameterDirection.Input, SqlDbType.VarChar, 200, configKey);
                _objData.OpenConnection(companyCode);
                configValue = _objData.ExecuteScalar(command) == null ? string.Empty : _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();

                return configValue;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetUserperdayNew(string companyCode, string userCode, string startDate)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_USERPERDAY);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                //AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, flag.Length, flag);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetUserperdayNewFlag(string companyCode, string userCode, string startDate, string flag) //dcr approval
        {
            try
            {
                SqlCommand command = new SqlCommand(Sp_HdGetUserperDayNewInsertFlag);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, startDate.Length, startDate);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 12, flag);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }




        public string GetSinglePrivilegeNameForUser(string companyCode, string userCode, string privilegeName)
        {
            string result = string.Empty;
            try
            {

                SqlCommand command = new SqlCommand(SP_hdGetSinglePrivilegeValueForUser);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                AddParamToSqlCommand(command, "@PrivilegeName", ParameterDirection.Input, SqlDbType.NVarChar, 100, privilegeName);
                _objData.OpenConnection(companyCode);
                if (_objData.ExecuteScalar(command) != null)
                {
                    result = _objData.ExecuteScalar(command).ToString();
                }
                _objData.CloseConnection();

                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetInwardBulkUploadLookupValues(string company_Code)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETINWARDUPLOADLOOKUPVALUES);
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);

                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public string BatchProcessingBulkInsert(string subDomain, string company_Code, DataTable dt, Guid batchProcessingID, string stagingTableName)
        {
            try
            {
                _objData = new Data();
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        foreach (DataColumn col in dt.Columns)
                        {
                            copy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
                        }
                        copy.DestinationTableName = stagingTableName;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public void InsertBatchProcessingHeader(string subdomain, string company_Code, Guid BP_Id, string uploaded_File_Name, string BP_Type,
            string user_Code, string status, string errMessage)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERT_BATCH_PROCESSING_HEADER);
                command.CommandType = CommandType.StoredProcedure;

                // Add the Stored procedure Parameter here.
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@BP_ID", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, BP_Id);
                AddParamToSqlCommand(command, "@Upload_File_Name", ParameterDirection.Input, SqlDbType.NVarChar, 500, uploaded_File_Name);
                AddParamToSqlCommand(command, "@BP_Type", ParameterDirection.Input, SqlDbType.NVarChar, 50, BP_Type);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.NVarChar, 50, status);
                AddParamToSqlCommand(command, "@DB_Error", ParameterDirection.Input, SqlDbType.NVarChar, 500, errMessage);

                // Open Connection
                _objData.OpenConnectionObjectUsingSubDomain(subdomain);

                // Execute Query
                _objData.ExecuteNonQuery(command);

                // Close the connection
                _objData.CloseConnection();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetAccompanistVisitDoctors(string company_Code, string DCR_User_Name, string Acc_User_Name, string DCR_Actual_Date, string DCR_User_Code)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETACCOMPANISTVISITEDDOCTORS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@DCR_User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, DCR_User_Name);
                AddParamToSqlCommand(command, "@Acc_User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, Acc_User_Name);
                AddParamToSqlCommand(command, "@Acc_Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, null);
                AddParamToSqlCommand(command, "@DCR_User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, DCR_User_Code);
                AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDoctorCoverageCount(string companyCode, string userCode, string startDate, string endDate, string mode)
        {
            try
            {
                SqlCommand command = new SqlCommand("sp_hdGetDoctorCoverageCount");
                command.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objData.OpenConnection(companyCode);
                DataSet dsRpt = _objData.ExecuteDataSet(command);
                return dsRpt;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDetailedProductsAndInputsPerDoctor(string company_Code, string user_Code, string doctor_Code, string doctor_Name,
            string speciality_Name, string DCR_Actual_Dates)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETDETAILEDPRODUCTANDINPUTSPERDOCTOR);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                AddParamToSqlCommand(command, "@Doctor_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, doctor_Code);
                AddParamToSqlCommand(command, "@Doctor_Name", ParameterDirection.Input, SqlDbType.VarChar, 50, doctor_Name);
                AddParamToSqlCommand(command, "@Speciality_Name", ParameterDirection.Input, SqlDbType.VarChar, 50, speciality_Name);
                AddParamToSqlCommand(command, "@DCR_Actual_Dates", ParameterDirection.Input, SqlDbType.VarChar, DCR_Actual_Dates.Length, DCR_Actual_Dates);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

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

        public int GetCountforDCRRestrictDate(string company_Code, string user_Code, string DCR_Date)
        {
            try
            {
                string cmdText = SP_HDISDCRRESTRICTEDDATE;
                object result = "";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                AddParamToSqlCommand(command, "@DCR_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Date);

                _objData.OpenConnection(company_Code);
                result = _objData.ExecuteScalar(command);
                return result == null ? 0 : Convert.ToInt32(result);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int ValidateRefkey1inProduct(string company_Code, string RefKey1, string product_Type, string mode, string prodcode)
        {
            try
            {
                string cmdText = SP_HDVALIDATEREFKEY1FORPRODUCT;
                object result = "";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Ref_Key1", ParameterDirection.Input, SqlDbType.VarChar, 50, RefKey1);
                AddParamToSqlCommand(command, "@Product_Type", ParameterDirection.Input, SqlDbType.VarChar, 50, product_Type);
                AddParamToSqlCommand(command, "@prodcode", ParameterDirection.Input, SqlDbType.VarChar, 30, prodcode);
                AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);

                _objData.OpenConnection(company_Code);
                result = _objData.ExecuteScalar(command);
                return result == null ? 0 : Convert.ToInt32(result);
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public int Validprodname(string company_Code, string product_name, string product_type, string prod_code, string mode)
        {
            try
            {
                string cmdText = SP_HDVALIDATEProductName;
                object result = "";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Product_Name", ParameterDirection.Input, SqlDbType.VarChar, 300, product_name);
                AddParamToSqlCommand(command, "@product_type", ParameterDirection.Input, SqlDbType.VarChar, 50, product_type);
                AddParamToSqlCommand(command, "@product_code", ParameterDirection.Input, SqlDbType.VarChar, 30, prod_code);
                AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);
                _objData.OpenConnection(company_Code);
                result = _objData.ExecuteScalar(command);
                return result == null ? 0 : Convert.ToInt32(result);
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetDoctorMissedDetailsForConsolidatedReport(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                string cmdText = SP_HDGETDCRCONSDOCTORMISSED;
                DataSet ds;

                SqlCommand command = new SqlCommand();

                command.CommandText = cmdText;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 15, startDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 15, endDate);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrStatus);

                _objData.OpenConnection(companyCode);

                ds = _objData.ExecuteDataSet(command);

                return ds;
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

        #region Specialitywise Report
        public DataSet GetSpecialityWiseAnalysisReport_WithCalc(string companyCode, string regionCode, string Month, string Year, string status)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETSPECIALITYWISEANALYSIS_WITHCALC);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSpecialityWiseAnalysisDetails_WithCalc(string companyCode, string regionCode, string month, string Year, string status, string specialityCode)
        {

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETSPECIALITYWISEANALYSISDETAILS_WITHCALC);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 300;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, month.Length, month);
                AddParamToSqlCommand(command, "@year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Speciality_Code", ParameterDirection.Input, SqlDbType.VarChar, specialityCode.Length, specialityCode);

                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion Specialitywise Report

        #region Doctor Statistics Report
        #endregion Doctor Statistics Report
        #region Doctor Category Missed category Report
        public DataSet GetDoctorMissedFromCategory_WithCalc(string companyCode, string userCode, string regionCode, string Month, string Year, string status)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORMISSEDFROMCATEGORY_WITHCALC);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, Year.Length, Year);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDoctorMissedFromCategory()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDoctorMissedFromCategoryDetails_WithCalc(string companyCode, string userCode, string regionCode, string Month, string year, string status, string category)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORMISSEDFROMCATEGORYDETAILS_WITHCALC);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, Month.Length, Month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, year.Length, year);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, status.Length, status);
                AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDoctorMissedFromCategoryDetails()");
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        /// <summary>
        /// Get Category never visited doctors list
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="cateGory"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> GetCategoryNevervisitedDoctors_WithCalc(string companyCode, string userCode, string regionCode, string month, string year, string cateGory, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstCategoryNeverVisitedDoctors = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            List<MVCModels.HiDoctor_Reports.CustomerMasterModel> lstMasterDoctors = null;
            List<MVCModels.HiDoctor_Reports.ActualDoctorModel> lstActualDotors = null;
            List<MVCModels.HiDoctor_Reports.TpModel> lstTpDates = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters paramerter = new DynamicParameters();
                    paramerter.Add("@CompanyCode", companyCode);
                    paramerter.Add("@RegionCode", regionCode);
                    paramerter.Add("@UserCode", userCode);
                    paramerter.Add("@Month", month);
                    paramerter.Add("@Year", year);
                    paramerter.Add("@DCRStatus", dcrStatus);
                    paramerter.Add("@Category", cateGory);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GETNOOFDOCSNEVERVISITED_WITHCALC, paramerter, commandType: CommandType.StoredProcedure))
                    {
                        lstMasterDoctors = multiselect.Read<MVCModels.HiDoctor_Reports.CustomerMasterModel>().ToList();
                        lstActualDotors = multiselect.Read<MVCModels.HiDoctor_Reports.ActualDoctorModel>().ToList();
                        lstTpDates = multiselect.Read<MVCModels.HiDoctor_Reports.TpModel>().ToList();
                    }

                }
                MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel _objDoctorlist = new MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel();
                _objDoctorlist.lstCustomers = lstMasterDoctors;
                _objDoctorlist.lstActualDoctors = lstActualDotors;
                _objDoctorlist.lstTpDates = lstTpDates;
                lstCategoryNeverVisitedDoctors.Add(_objDoctorlist);

            }
            catch
            {
                throw;
            }
            return lstCategoryNeverVisitedDoctors;
        }
        /// <summary>
        /// No of Doctors category wise visit count missed
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="cateGory"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> GetNoofDocsVisitCountMissed_WithCalc(string companyCode, string userCode, string regionCode, string month, string year, string cateGory, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstCategoryNeverVisitedDoctors = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            List<MVCModels.HiDoctor_Reports.CustomerMasterModel> lstMasterDoctors = null;
            List<MVCModels.HiDoctor_Reports.ActualDoctorModel> lstActualDotors = null;
            List<MVCModels.HiDoctor_Reports.TpModel> lstTpDates = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters paramerter = new DynamicParameters();
                    paramerter.Add("@CompanyCode", companyCode);
                    paramerter.Add("@RegionCode", regionCode);
                    paramerter.Add("@UserCode", userCode);
                    paramerter.Add("@Month", month);
                    paramerter.Add("@Year", year);
                    paramerter.Add("@DCRStatus", dcrStatus);
                    paramerter.Add("@Category", cateGory);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GETNOOFDOCSVISITCOUNTMISSED_WITHCALC, paramerter, commandType: CommandType.StoredProcedure))
                    {
                        lstMasterDoctors = multiselect.Read<MVCModels.HiDoctor_Reports.CustomerMasterModel>().ToList();
                        lstActualDotors = multiselect.Read<MVCModels.HiDoctor_Reports.ActualDoctorModel>().ToList();
                        lstTpDates = multiselect.Read<MVCModels.HiDoctor_Reports.TpModel>().ToList();
                    }

                }
                MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel _objDoctorlist = new MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel();
                _objDoctorlist.lstCustomers = lstMasterDoctors;
                _objDoctorlist.lstActualDoctors = lstActualDotors;
                _objDoctorlist.lstTpDates = lstTpDates;
                lstCategoryNeverVisitedDoctors.Add(_objDoctorlist);

            }
            catch
            {
                throw;
            }
            return lstCategoryNeverVisitedDoctors;
        }
        /// <summary>
        /// Never visited and Doctor category missed count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="cateGory"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> GetNoofDocsNeverVisitedandMissedCount_WithCalc(string companyCode, string userCode, string regionCode, string month, string year, string cateGory, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstCategoryNeverVisitedDoctors = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            List<MVCModels.HiDoctor_Reports.CustomerMasterModel> lstMasterDoctors = null;
            List<MVCModels.HiDoctor_Reports.ActualDoctorModel> lstActualDotors = null;
            List<MVCModels.HiDoctor_Reports.TpModel> lstTpDates = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters paramerter = new DynamicParameters();
                    paramerter.Add("@CompanyCode", companyCode);
                    paramerter.Add("@RegionCode", regionCode);
                    paramerter.Add("@UserCode", userCode);
                    paramerter.Add("@Month", month);
                    paramerter.Add("@Year", year);
                    paramerter.Add("@DCRStatus", dcrStatus);
                    paramerter.Add("@Category", cateGory);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GETNOOFDOCSNEVERVISITEDANDMISSEDCOUNT_WITHCALC, paramerter, commandType: CommandType.StoredProcedure))
                    {
                        lstMasterDoctors = multiselect.Read<MVCModels.HiDoctor_Reports.CustomerMasterModel>().ToList();
                        lstActualDotors = multiselect.Read<MVCModels.HiDoctor_Reports.ActualDoctorModel>().ToList();
                        lstTpDates = multiselect.Read<MVCModels.HiDoctor_Reports.TpModel>().ToList();
                    }

                }
                MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel _objDoctorlist = new MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel();
                _objDoctorlist.lstCustomers = lstMasterDoctors;
                _objDoctorlist.lstActualDoctors = lstActualDotors;
                _objDoctorlist.lstTpDates = lstTpDates;
                lstCategoryNeverVisitedDoctors.Add(_objDoctorlist);

            }
            catch
            {
                throw;
            }
            return lstCategoryNeverVisitedDoctors;
        }
        #endregion Doctor Category Missed category Report

        public List<string> CheckTPAvailableForSelectedDCRDates(string company_Code, string user_Code, string region_Code, string DCR_Dates)
        {
            try
            {
                List<string> lstDates = new List<string>();
                string cmdText = SP_HDCHECKTPAVAILABLESELECTEDDCRDATE;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add Parameters to Command Object.
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                AddParamToSqlCommand(command, "@DCRDates", ParameterDirection.Input, SqlDbType.VarChar, 2000, DCR_Dates);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Exceute the Reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts data reader to list.
                    while (dataReader.Read())
                    {
                        string DCR_date = dataReader["DCR_Date"].ToString();
                        lstDates.Add(DCR_date);
                    }
                }
                return lstDates;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        #endregion Public Methods





        public IEnumerable<PS_SecondarysalesDetails> GetPsInSS(PS_SS_Input ps_ssInputs)
        {
            IEnumerable<PS_SecondarysalesDetails> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@SelectionType", ps_ssInputs.SelectionType);
                    p.Add("@Customer_Code", ps_ssInputs.Customer_Code);
                    p.Add("@Region_Code", ps_ssInputs.Region_Code);
                    p.Add("@Month", ps_ssInputs.Month);
                    p.Add("@Year", ps_ssInputs.Year);
                    lstContent = connection.Query<MVCModels.PS_SecondarysalesDetails>(SP_HdGetPsInSS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("customerCode", ps_ssInputs.Customer_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public DataSet GetCallAVerage(string User_Code, string Division_Code, string flag)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec Usp_hd_GetCall_Average_Value '" + User_Code + "' ,'" + Division_Code + "','" + flag + "'");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSpecialitywiseDoctorCount(string UserCode, string RegionCode, string Division_Code)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec Usp_hd_Speciality_Wise_Dr_Value '" + UserCode + "', '" + RegionCode + "' ,'" + Division_Code + "'");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetProductiveCallAverage(string User_Code, string Division_Code, string flag)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec Usp_hd_GetCall_Productive_Value '" + User_Code + "' ,'" + Division_Code + "','" + flag + "'");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSummaryCount(string User_Code, string Actual_Date, int Month, int Year)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_HD_GetReportSummaryCount '" + User_Code + "','" + Actual_Date + "','" + Month + "','" + Year + "'");
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<MVCModels.DCRLeaveAttachmentModel> GetAttachments(string company_Code, int attachment_Id)
        {
            List<MVCModels.DCRLeaveAttachmentModel> lstAttachments;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@attachment_Id", attachment_Id);
                    lstAttachments = connection.Query<DCRLeaveAttachmentModel>(SP_HD_DCR_Leave_Attachments, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstAttachments;
        }

        public int GetDCREntryBasedOnPrivilege(string company_Code, string user_Code, string dcrDate, string flag)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@dcrDate", dcrDate);
                    p.Add("@flag", flag);
                    p.Add("@Result", result, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_Allow_DCR_Entry_Based_On_Leave_Policy, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public int ErrorInsert(string companyCode,string userCode,string Message)
        {
            int result = 0;
            string Module = "Delete DCR";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Message", Message);
                    p.Add("@Module", Module);
                    connection.Query<int>("Sp_HD_InsertErrorlog", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public DataSet GetSAPUserCredentials(string company_Code)
        {
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_GET_SAP_User_Credentials");
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}