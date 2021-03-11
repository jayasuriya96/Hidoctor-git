using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace DataControl
{
    public class DALDashboard : DapperRepository
    {

        DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();

        const string SP_HDGETCATEGORYWISEVISITANANLYSIS = "sp_hdGetCategoryWiseVisitAnanlysis";
        const string SP_HDWORKCALCULATION = "sp_hdWorkCalculation";
        const string SP_HDDOCTORCALLAVERAGE = "sp_hdDoctorCallAverage";
        const string SP_HDGETDIVISIONSBYREGION = "SP_hdGetDivisionsByRegion";
        const string SP_HDGETREGIONTYPESBYDIVISION = "sp_hdGetRegionTypesByDivision";
        const string SP_HDGETREGIONBYDIVISIONANDREGIONTYPE = "sp_hdGetRegionByDivisionAndRegionType";
        const string SP_HDGETREGIONSBYDIVISION = "sp_hdGetRegionsByDivision";
        const string SP_HDGETDOCTORCATEGORY = "sp_hdGetCategoryByDivision";
        const string SP_HDCHEMISTCALLAVERAGE = "sp_hdChemistCallAverage";
        const string SP_HDCATEGORYWISECOVERAGE = "sp_hdCategoryWiseCoverage";
        const string SP_HDINSERTCONFIGSETTINGS = "SP_hdInsertConfigSettings";
        const string SP_HDGETSSACTIVITY = "sp_hdGetSSActivity";
        const string SP_HDGETPRODUCTSBYDIVISION = "sp_hdGetProductsByDivision";
        const string SP_HDGETDIVISIONCOUNT = "sp_hdGetDivisionCount";
        const string EXEC = "EXEC";
        #region user dashboard
        const string USP_HD_GETUSERDASHBOARDINFO = "usp_hd_GetUserDashboardInfo";
        const string USP_HD_GET_CATEGORYWISE_USER_INFO = "usp_hd_Get_Categorywise_User_Info";
        const string USP_HD_GETUSERDASHBOARD_BIRTHDAY = "usp_hd_GetUserDashboard_Birthday";
        const string USP_HD_GETUSERDASHBOARD_DCR_INFO = "usp_hd_GetUserDashboard_Dcr_Info";
        const string USP_HD_GETUSERDASHBOARD_TP = "usp_hd_GetUserDashboard_TP";
        const string USP_HD_GETUSERDASHBOARD_SS = "usp_hd_GetUserDashboard_SS";
        const string USP_HD_GETUSERDASHBOARD_TPMEETING = "usp_hd_GetUserDashboard_TPMeeting";
        const string USP_HD_GETUSERWITHTEAMDASHBOARDINFO = "usp_hd_GetUserWithTeamDashboardInfo";
        const string USP_HD_DASHBOARD_TPLOCK = "usp_hd_Dashboard_TPLock";
        const string USP_HD_DASHBOARD_DCRLOCKCOUNT = "usp_hd_Dashboard_DCRLockCount";
        const string USP_HD_USER_DASHBOARD_TPDOCTORINFO = "usp_hd_User_Dashboard_TPDoctorInfo";
        const string USP_HD_USERDASHBOARD_DCRLOCK = "usp_hd_UserDashboard_DCRLock";
        const string USP_HD_USERDASHBOARD_EXPENSE = "usp_hd_UserDashBoard_Expense";
        const string USP_HD_GETDASHBOARDLIVECOUNTS = "usp_hd_GetDashboardLiveCounts";
        const string USP_HD_USER_DASHBOARD_PENDINGDCR = "usp_hd_User_Dashboard_PendingDCR";
        const string USP_HD_USER_DASHBOARD_PENDINGTP = "usp_hd_User_Dashboard_PendingTP";
        const string USP_HD_USER_DASHBOARD_PENDINGCLAIM = "usp_hd_User_Dashboard_PendingClaim";
        const string USP_HD_USERDASHBOARD_SECONDARYSALESINFO = "usp_hd_UserDashboard_SecondarySalesInfo";
        const string USP_HD_GET_USERCATEGORYINFO = "usp_hd_Get_UserCategoryInfo";
        const string USP_HD_GET_NEXTTWODAYSTOURPLAN = "usp_hd_Get_NextTwoDaysTourPlan";
        const string USP_HD_GETDASHBOARDPENDINGDETAILS = "usp_hd_GetDashboardPendingDetails";
        const string USP_HD_USER_DASHBOARD_APPLIEDDCR = "usp_hd_User_Dashboard_AppliedDCR";
        const string USP_HD_USER_DASHBOARD_APPLIEDTP = "usp_hd_User_Dashboard_AppliedTP";
        const string USP_HD_USER_DASHBOARD_APPLIEDCLAIM = "usp_hd_User_Dashboard_AppliedClaim";
        const string USP_HD_GETMANAGERCATEGORYWISEVISIT = "usp_hd_GetManagerCategorywiseVisit";
        const string USP_HD_GETCATEGORYWISEDOCTORVISITFORREGION = "usp_hd_GetCategoryWiseDoctorVisitForRegion";
        const string USP_HD_GETDASHBOARDDOCTORVISITSUMMARY = "usp_hd_GetDashboardDoctorVisitSummary";
        const string USP_HD_GETTOTALAPPROVEDDOCTORS = "usp_hd_GetTotalApprovedDoctors";
        const string USP_HD_GETTOTALAPPROVEDDOCTORSWITHTEAM = "usp_hd_GetTotalApprovedDoctorsWithTeam";

        #endregion user dashboard


        public DataSet GetDivision(string companyCode, string regionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDIVISIONSBYREGION + " '" + companyCode + "','" + regionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetRegionTypesByDivision(string companyCode, string regionCode, string divisionCode, string allDivision)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONTYPESBYDIVISION + " '" + companyCode + "','" + regionCode + "','" +
                      divisionCode + "','" + allDivision + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetRegionByDivisionAndRegionType(string companyCode, string regionCode, string divisionCode, string regionTypeCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONBYDIVISIONANDREGIONTYPE + " '" + companyCode + "','" +
                            regionCode + "','" + divisionCode + "','" + regionTypeCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetRegionByDivision(string companyCode, string regionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONSBYDIVISION + " '" + companyCode + "','" + regionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetCategory(string companyCode, string divisionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDOCTORCATEGORY + " '" + divisionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetCategoryWiseVisitAnanlysis(string companyCode, string regionCode, string months, string years,
                    string regionCodes, string divisionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETCATEGORYWISEVISITANANLYSIS + " '" + companyCode + "','" + regionCodes + "','" +
                                            months + "','" + years + "','" + divisionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetWorkedCalculation(string companyCode, string regionCodes, string months, string years)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDWORKCALCULATION + " '" + companyCode + "','" + regionCodes + "','" +
                        months + "','" + years + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDoctorCallAverage(string companyCode, string regionCodes, string months, string years, string divisionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDDOCTORCALLAVERAGE + " '" + companyCode + "','" + regionCodes + "','" +
                          months + "','" + years + "','" + divisionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetChemistCallAverage(string companyCode, string regionCodes, string months, string years)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCHEMISTCALLAVERAGE + " '" + companyCode + "','" + regionCodes + "','" +
                        months + "','" + years + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetCategoryCoverage(string companyCode, string regionCodes, string months, string years, string divisionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCATEGORYWISECOVERAGE + " '" + companyCode + "','" + regionCodes + "','" +
                        months + "','" + years + "','" + divisionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertConfigSettings(string companyCode, string type, string configKey, string configValue, string possibleValues)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTCONFIGSETTINGS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, type);
                _objSPData.AddParamToSqlCommand(command, "@ConfigKey", ParameterDirection.Input, SqlDbType.NVarChar, 200, configKey);
                _objSPData.AddParamToSqlCommand(command, "@ConfigValue", ParameterDirection.Input, SqlDbType.NVarChar, 200, configValue);
                _objSPData.AddParamToSqlCommand(command, "@PossibleValues", ParameterDirection.Input, SqlDbType.NVarChar, 200, possibleValues);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public DataSet GetDivisionCount(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDIVISIONCOUNT + " '" + companyCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetDivisonMappedProducts(string companyCode, string divisionCode, string regionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETPRODUCTSBYDIVISION + " '" + divisionCode + "','" + regionCode + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet SSActivityVsSales(string companyCode, string regionCode, string regionCodes, string productCode, string months, string years)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETSSACTIVITY + " '" + companyCode + "','" + regionCode + "','" +
                                regionCodes + "','" + productCode + "','" + months + "','" + years + "'");
                    return ds;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        #region user dashboard
        public IEnumerable<MVCModels.UserDashboardModel> GetUserDashboardInfo(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.UserDashboardModel>(USP_HD_GETUSERDASHBOARDINFO, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.UserDashboardModel> GetManagerDashboardInfo(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.UserDashboardModel>(USP_HD_GETUSERWITHTEAMDASHBOARDINFO, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public MVCModels.DashboardExpense GetDashboardExpenseDataCount(string companyCode, string userCode)
        {
            MVCModels.DashboardExpense lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.DashboardExpense>("usp_hd_Get_TotalExpenseAmount", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.DashboardExpense> GetExpensePopUp(string companyCode, string userCode, string mode)
        {
            IEnumerable<MVCModels.DashboardExpense> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode",mode);
                    lstContent = connection.Query<MVCModels.DashboardExpense>("usp_hd_Get_LstExpenseAmount", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        public MVCModels.DashboardSSTotalAmount GetDashboardSSDataCount(string companyCode, string regionCode)
        {
            MVCModels.DashboardSSTotalAmount lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    lstContent = connection.Query<MVCModels.DashboardSSTotalAmount>("usp_hd_Get_TotalSSAmount", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }




        public MVCModels.DasboardSSLst GetSSPopUp(string companyCode, string regionCode, string mode)
        {
            MVCModels.DasboardSSLst ssLst = new MVCModels.DasboardSSLst();
            try
            {
                List<MVCModels.SSPreviousAmount> lstPrivious = null;
                List<MVCModels.SSPrePreviousAmount> lstPrePrivious = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Mode", mode);
                    using (var mulitSelect = connection.QueryMultiple("usp_hd_Get_LstSSAmount", p, commandType: CommandType.StoredProcedure))
                    {

                        lstPrivious = mulitSelect.Read<MVCModels.SSPreviousAmount>().ToList();
                        lstPrePrivious = mulitSelect.Read<MVCModels.SSPrePreviousAmount>().ToList();
                    }
                    ssLst.lstSSPrevious = lstPrivious;
                    ssLst.lstSSPrePrevious = lstPrePrivious;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return ssLst;
        }


        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetUserDashboardCategoryInfo(string companyCode, string userCode, string DivisionCode)
        {
            IEnumerable<MVCModels.UserCategoryDashboardModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Division_Code", DivisionCode);
                    lstContent = connection.Query<MVCModels.UserCategoryDashboardModel>(USP_HD_GET_CATEGORYWISE_USER_INFO, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetUserDashboardCategoryInfoSingle(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserCategoryDashboardModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.UserCategoryDashboardModel>(USP_HD_GET_USERCATEGORYINFO, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.TourPlannerModel> GetUserDashboardTPMeetingPoint(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.TourPlannerModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.TourPlannerModel>(USP_HD_GETUSERDASHBOARD_TPMEETING, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.DCRApprovalModel> GetUserDashboardUnapprovedDCR(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.DCRApprovalModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.DCRApprovalModel>(USP_HD_GETUSERDASHBOARD_DCR_INFO, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.TourPlannerModel> GetUserDashboardUnapprovedTP(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.TourPlannerModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.TourPlannerModel>(USP_HD_GETUSERDASHBOARD_TP, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.TPLockStatusModel> GetUserDashboardTPLock(string companyCode, string userCode, string userTypeCode)
        {
            IEnumerable<MVCModels.TPLockStatusModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstContent = connection.Query<MVCModels.TPLockStatusModel>(USP_HD_DASHBOARD_TPLOCK, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.DcrLockDetail> GetUserDashboardCDRLock(string companyCode, string userCode, string userTypeCode)
        {
            IEnumerable<MVCModels.DcrLockDetail> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstContent = connection.Query<MVCModels.DcrLockDetail>(USP_HD_DASHBOARD_DCRLOCKCOUNT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstContent;
        }

        public IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> GetUserDashboardSSDetails(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.SecondarySalesOpeningbalanaceModel>(USP_HD_GETUSERDASHBOARD_SS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetUserDashboardDoctorBirthday(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(USP_HD_GETUSERDASHBOARD_BIRTHDAY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public List<MVCModels.TourPlannerWrapperModel> GetUserDashboardTPLockDetails(string companyCode, string userCode)
        {
            List<MVCModels.TourPlannerWrapperModel> lstContent = new List<MVCModels.TourPlannerWrapperModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    List<MVCModels.TourPlannerHeaderModel> lstHeader = null;
                    List<MVCModels.TourPlannerDoctorsModel> lstDoctors = null;
                    List<MVCModels.TourPlannerSFCModel> lstSFC = null;
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    using (var multi = connection.QueryMultiple(USP_HD_USER_DASHBOARD_TPDOCTORINFO, p, commandType: CommandType.StoredProcedure))
                    {
                        lstHeader = multi.Read<MVCModels.TourPlannerHeaderModel>().ToList();
                        lstSFC = multi.Read<MVCModels.TourPlannerSFCModel>().ToList();
                        lstDoctors = multi.Read<MVCModels.TourPlannerDoctorsModel>().ToList();
                    }
                    MVCModels.TourPlannerWrapperModel objHeader = new MVCModels.TourPlannerWrapperModel();
                    objHeader.lstHeader = lstHeader;
                    objHeader.lstTPDoctors = lstDoctors;
                    objHeader.lstTPSFC = lstSFC;
                    lstContent.Add(objHeader);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.DcrLockDetail> GetUserDashboardCDRLockMoreInfo(string companyCode, string userCode, string lockType)
        {
            IEnumerable<MVCModels.DcrLockDetail> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Lock_Type", lockType);
                    lstContent = connection.Query<MVCModels.DcrLockDetail>(USP_HD_USERDASHBOARD_DCRLOCK, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstContent;
        }
        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetUserDashboardExpClaimMoreInfo(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.ExpenseClaimHeaderModel>(USP_HD_USERDASHBOARD_EXPENSE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstContent;
        }
        public IEnumerable<MVCModels.UserDashboardCountModel> GetUserDashboardLiveCounts(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardCountModel> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstUser = connection.Query<MVCModels.UserDashboardCountModel>(USP_HD_GETDASHBOARDLIVECOUNTS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.UserDashboardPendingDCR> GetUserDashboardPendingDCR(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardPendingDCR> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingDCR>(USP_HD_USER_DASHBOARD_PENDINGDCR, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.UserDashboardPendingTP> GetUserDashboardPendingTP(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardPendingTP> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingTP>(USP_HD_USER_DASHBOARD_PENDINGTP, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.UserDashboardPendingClaim> GetUserDashboardPendingClaim(string companyCode, string userCode, int month, int year)
        {
            IEnumerable<MVCModels.UserDashboardPendingClaim> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingClaim>(USP_HD_USER_DASHBOARD_PENDINGCLAIM, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> GetUserDashboardSS(string companyCode, string userCode, string mode)
        {
            IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> lstDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode", mode);
                    lstDetails = connection.Query<MVCModels.SecondarySalesOpeningbalanaceModel>(USP_HD_USERDASHBOARD_SECONDARYSALESINFO, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDetails;
        }

        public IEnumerable<MVCModels.UserDashboardTourPlan> GetNextTwoDaysTourPlan(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardTourPlan> lstDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstDetails = connection.Query<MVCModels.UserDashboardTourPlan>(USP_HD_GET_NEXTTWODAYSTOURPLAN, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDetails;
        }
        public IEnumerable<MVCModels.UserDashboardModel> GetUserDashboardPendingInfo(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstContent = connection.Query<MVCModels.UserDashboardModel>(USP_HD_GETDASHBOARDPENDINGDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.UserDashboardPendingDCR> GetUserDashboardAppliedDCR(string companyCode, string userCode,string mode)
        {
            IEnumerable<MVCModels.UserDashboardPendingDCR> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode", mode);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingDCR>(USP_HD_USER_DASHBOARD_APPLIEDDCR, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.UserDashboardPendingTP> GetUserDashboardAppliedTP(string companyCode, string userCode,string mode)
        {
            IEnumerable<MVCModels.UserDashboardPendingTP> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode", mode);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingTP>(USP_HD_USER_DASHBOARD_APPLIEDTP, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.UserDashboardPendingClaim> GetUserDashboardAppliedClaim(string companyCode, string userCode,string mode)
        {
            IEnumerable<MVCModels.UserDashboardPendingClaim> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode", mode);
                    lstUser = connection.Query<MVCModels.UserDashboardPendingClaim>(USP_HD_USER_DASHBOARD_APPLIEDCLAIM, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }
        public IEnumerable<MVCModels.UserDashboardCategoryWiseDoctors> GetUserDashboardManagerVisits(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.UserDashboardCategoryWiseDoctors> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstVisits = connection.Query<MVCModels.UserDashboardCategoryWiseDoctors>(USP_HD_GETMANAGERCATEGORYWISEVISIT, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }
        public IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> GetUserDashboardCategoryWiseVisits(string companyCode, string userCode, string regionCode, string category, string speciality, string isCurrent, int CategoryMode)
        {
            IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Category_Code", category);
                    p.Add("@Speciality_Code", speciality);
                    p.Add("@IsCurrent", isCurrent);
                    p.Add("@Option_Type", CategoryMode);
                    lstVisits = connection.Query<MVCModels.DashboardCategoryWiseDoctorVisit>(USP_HD_GETCATEGORYWISEDOCTORVISITFORREGION, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }
        public MVCModels.DashBoardDoctorVisitSummaryandTotalCount GetUserDashboardDoctorVisitSummary(string companyCode, string userCode, string regionCode, string isCurrent, string IsSummaryMode, string Mode, int PageNo, int Pagesize)
        {
            MVCModels.DashBoardDoctorVisitSummaryandTotalCount Visits = new MVCModels.DashBoardDoctorVisitSummaryandTotalCount();
            List<MVCModels.DashboardDoctorVisitSummary> lstDocVisitSummary = new List<MVCModels.DashboardDoctorVisitSummary>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@IsCurrent", isCurrent);
                    p.Add("@IsSummaryMode", IsSummaryMode);
                    p.Add("@Option_Type", Mode);
                    p.Add("@PageNo", PageNo);
                    p.Add("@Pagesize", Pagesize);
                    p.Add("@Totalcount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lstDocVisitSummary = connection.Query<MVCModels.DashboardDoctorVisitSummary>(USP_HD_GETDASHBOARDDOCTORVISITSUMMARY, p, commandType: CommandType.StoredProcedure).ToList();
                    Visits.Totalcount = p.Get<int>("@Totalcount");
                    Visits.lstDashboardDoctorVisitSummary = lstDocVisitSummary;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return Visits;
        }

        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetTotalApprovedDoctors(string companyCode, string userCode, string regionCode)  
        {
            IEnumerable<MVCModels.UserCategoryDashboardModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Region_Code", regionCode);
                    lstDoctors = connection.Query<MVCModels.UserCategoryDashboardModel>(USP_HD_GETTOTALAPPROVEDDOCTORS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDoctors;
        }

        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetTotalApprovedDoctorsWithTeam(string companyCode, string userCode, string regionCode, string DivisionCode)
        {
            IEnumerable<MVCModels.UserCategoryDashboardModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("DivisionCode", DivisionCode);
                    lstDoctors = connection.Query<MVCModels.UserCategoryDashboardModel>(USP_HD_GETTOTALAPPROVEDDOCTORSWITHTEAM, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDoctors;
        }

        #endregion user dashboard




    }
}
