using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using ElmahWrapper;
using Dapper;
using System.Reflection;

namespace DataControl
{
    public class DAL_DCRHeader : DapperRepository
    {
        private SqlDataReader sqldataReader;

        const string SP_hdGetExpenseEntity = "SP_hdGetExpenseEntity";
        const string SP_hdGetAccompanistDetails = "SP_hdGetAccompanistDetails";
        const string SP_hdGetFreezeAccompanistDetails = "SP_hdGetFreezeAccompanistDetails";
        const string SP_hdGetHeaderAutofillData = "SP_hdGetHeaderAutofillData";
        const string SP_hd_V4_GetHeaderPrefillData = "SP_hd_V4_GetHeaderPrefillData";
        const string SP_hd_V4_GetDistanceEditMappingNG = "SP_hd_V4_GetDistanceEditMappingNG";
        const string SP_hd_V4_GetAccompanistCodeAndSFCData = "SP_hd_V4_GetAccompanistCodeAndSFCData";
        const string SP_hdGetAllUserRegionData = "SP_hdGetAllUserRegionData";
        const string SP_hdGetSFCDataWithEffectiveDate = "SP_hdGetSFCDataWithEffectiveDate";
        const string SP_hdGetSelectedActivity = "SP_hdGetSelectedActivity";
        const string SP_hdGetDoctorAccompanistDetails = "SP_hdGetDoctorAccompanistDetails";
        const string SP_hd_V4_GetTPDetailsforDCRHeader = "SP_hd_V4_GetTPDetailsforDCRHeader";

        const string SP_HD_V4_InsertHeader = "SP_HD_V4_InsertHeader";
        const string SP_hd_V4_InsertTravelledPlaces = "SP_hd_V4_InsertTravelledPlaces";
        const string SP_HD_GETACCOMPANISTCPFORDCR = "SP_Hd_GetAccompanistCPforDCR";
        //Added Cp details for Accompanist
        const string SP_HDGETUSERINFOBYUSERNAME = "SP_HDGetUserInfoByUserName";
        const string SP_HD_V4_GETACCOMPANISTCPDETAILS = "SP_HD_V4_GetAccompanistCPDetails";
        //Added activity lock for the day
        const string SP_HD_GETACTIVITYLOCKTYPE = "SP_hd_GetActivityLocktype";

        const string SP_HDGETPENDINGTPFORAPPROVALUSERS = "SP_HDGetPendingTPForApprovalUsers";
        const string SP_HDGETPENDINGSSFORAPPROVALUSERS = "SP_HDGetPendingSSForApprovalUsers";
        const string SP_HD_REMOVEACCOMPANIST = "SP_HD_RemoveAccompanist";
        const string SP_HD_INSERT_SINGLE_DOCTORVISIT = "SP_HD_Insert_Single_DoctorVisit";
        const string SP_HD_GETDOCTORVISITCOUNT = "SP_HD_GetDoctorVisitCount";
        const string SP_HD_GETDCRFREEZESTATUS = "SP_HD_GetDCRFreezeStatus";
        const string SP_HDCHECKSFCSTATUS = "SP_HDCHECKSFCSTATUS";
        const string SP_HD_GETDCRLEAVEUNAPPROVALREASON = "SP_HD_GetDCRLeaveUnapprovalReason";

        const string SP_HD_V4_CHECK_DCR_SFC_VISIT_COUNT = "SP_HD_V4_Check_DCR_SFC_Visit_Count";
        const string SP_HdGetDoctorCountforchkindependent = "SP_HdGetDoctorCountforchkindependent";
        const string SP_HD_GetLoggedInUser_FullIndex = "SP_HD_GetLoggedInUser_FullIndex";
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
        #endregion
        public List<object> GetCategory(string companyCode)
        {
            List<object> ltCat = new List<object>();
            Data _objData = new Data();
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetExpenseEntity);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            ltCat.Add(new
                            {
                                value = sqldataReader["Expense_Entity_Code"].ToString(),
                                text = sqldataReader["Expense_Entity_Name"].ToString()
                            });
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
            return ltCat;
        }

        public DataTable GetAccompanistDetails(string companyCode, string regionCode, string DCR_Code, string user_Code, string TP_Date)
        {
            DataTable dt = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                DateTime DCR_Date = DateTime.Parse(TP_Date);
                string Freezestatus = BindDCRFreezeStatus(DCR_Date, user_Code, companyCode);
                if (Freezestatus == "YES")
                {
                    SqlCommand command = new SqlCommand(SP_hdGetFreezeAccompanistDetails);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                    _objSPData.AddParamToSqlCommand(command, "@TP_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, TP_Date);

                    _objData.OpenConnection(companyCode);
                    dt = _objData.ExecuteDataTable(command);
                    return dt;
                }
                else
                {
                    SqlCommand command = new SqlCommand(SP_hdGetAccompanistDetails);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                    _objSPData.AddParamToSqlCommand(command, "@TP_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, TP_Date);

                    _objData.OpenConnection(companyCode);
                    dt = _objData.ExecuteDataTable(command);
                    return dt;
                }

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

        public DataSet GetHeaderAutofillData(string companyCode, string userCode, string regionCode)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetHeaderAutofillData);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

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

        public DataSet GetHeaderPrefillData(string companyCode, string userCode, string dcrStatus, string dcrDate, string dcrCode, string source, string flag)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetHeaderPrefillData);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@Source", ParameterDirection.Input, SqlDbType.VarChar, 30, source);
                _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);

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

        public DataTable GetDistanceEditMappingNG(string companyCode, string dcrDate, string userCode, string regionCode)
        {
            DataTable ds = new DataTable();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetDistanceEditMappingNG);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataTable(command);
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

        public DataSet GetAccompanistCodeAndSFCData(string companyCode, string accName, string accRegion, string regionCode, string userTypeCode, string dcrDate)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetAccompanistCodeAndSFCData);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@accName", ParameterDirection.Input, SqlDbType.VarChar, 200, accName);
                _objSPData.AddParamToSqlCommand(command, "@accRegion", ParameterDirection.Input, SqlDbType.VarChar, 200, accRegion);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrDate);

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

        public List<DCRHeaderModel> GetAllUserRegionData(string companyCode, string regionCode, string matchingString)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRHeaderModel> lstAccomp = new List<DCRHeaderModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetAllUserRegionData);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@MatchingString", ParameterDirection.Input, SqlDbType.VarChar, 30, matchingString);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            DCRHeaderModel objAccom = new DCRHeaderModel();
                            objAccom.Accompanist_Name = sqldataReader["Region_Name"].ToString() + "," + sqldataReader["User_Name"].ToString() + "(" + sqldataReader["Employee_Name"].ToString() + "," + sqldataReader["User_Type_Name"].ToString() + ")";
                            objAccom.Accompanist_Region_Code = sqldataReader["Region_Code"].ToString();
                            lstAccomp.Add(objAccom);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstAccomp;
        }

        public List<DCRHeaderModel> GetSFCData(string companyCode, string regionCode, string dcrDate)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRHeaderModel> lstSfc = new List<DCRHeaderModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetSFCDataWithEffectiveDate);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            DCRHeaderModel objSFC = new DCRHeaderModel();
                            objSFC.Distance_Fare_Code = sqldataReader["Distance_Fare_Code"].ToString();
                            objSFC.From_Place = sqldataReader["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.To_Place = sqldataReader["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.Distance = (sqldataReader["Distance"] != System.DBNull.Value) ? Convert.ToDouble(sqldataReader["Distance"]).ToString("0.00") : "0.00";
                            objSFC.Travel_Mode = sqldataReader["Travel_Mode"].ToString();
                            objSFC.Category_Name = sqldataReader["Category_Name"].ToString();
                            objSFC.Region_Code = sqldataReader["Region_Code"].ToString();
                            objSFC.SFC_Version_No = sqldataReader["SFC_Version_No"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.SFC_Category_Name = sqldataReader["SFC_Category_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.SFC_Region_Code = sqldataReader["SFC_Region_Code"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.Fare_Amount = sqldataReader["Fare_Amount"].ToString();
                            objSFC.SFC_Visit_Count = sqldataReader["SFC_Visit_Count"].ToString();
                            objSFC.Minimum_Count = sqldataReader["Minimum_Count"].ToString();
                            objSFC.Region_Name = sqldataReader["Region_Name"].ToString();
                            lstSfc.Add(objSFC);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstSfc;
        }

        public DataTable GetActivityMaster(string companyCode, string userCode)
        {
            Data _objData = new Data();
            try
            {
                SPData _objSPData = new SPData();


                SqlCommand command = new SqlCommand(SP_hdGetSelectedActivity);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";

                DataTable dt = new DataTable();
                _objData.OpenConnection(companyCode);
                dt = _objData.ExecuteDataTable(command);

                return dt;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string InsertHeaderDetails(string companyCode, string userCode, string regionCode, string dcrCode,
            string dcrDate, string dcrStatus, string distanceFareCode, string category, string categoryCode, string cpCode, string cpName,
            string workPlace, string fromPlace, string toPlace, string travelMode, string distance, string startTime, string endTime, string acc1Name, string acc1Type,
            string acc1StartTime, string acc1EndTime, string acc1OnlyDoctor, string acc1Mode, string acc2Name, string acc2Type, string acc2StartTime, string acc2EndTime,
            string acc2OnlyDoctor, string acc2Mode, string acc3Name, string acc3Time, string acc3OnlyDoctor, string acc3Mode, string acc4Name, string acc4Time, string acc4OnlyDoctor, string acc4Mode,
            string isrcpa, string routeWay, string sourceOfEntry, string activistyString, string dcrFlag, string tpDeviation, string cpDeviation,
            string sfcRegionCode, string sfcVersionNo, string sfcCategoryName,
            string lattitude, string longitude, string location, int originOfDCR, Boolean dcr_Freeze, DateCapturingModel _objDateDetails,int ISchecked)
        {
            Data _objData = new Data();
            try
            {
                string cmdText = SP_HD_V4_InsertHeader;
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DistanceFareCode", ParameterDirection.Input, SqlDbType.VarChar, 30, distanceFareCode);
                _objSPData.AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 50, category);
                _objSPData.AddParamToSqlCommand(command, "@CategoryCode", ParameterDirection.Input, SqlDbType.VarChar, 30, categoryCode);
                _objSPData.AddParamToSqlCommand(command, "@CPCode", ParameterDirection.Input, SqlDbType.VarChar, 50, cpCode);
                _objSPData.AddParamToSqlCommand(command, "@CPName", ParameterDirection.Input, SqlDbType.VarChar, 50, cpName);
                _objSPData.AddParamToSqlCommand(command, "@WorkPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, workPlace);
                _objSPData.AddParamToSqlCommand(command, "@FromPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, fromPlace);
                _objSPData.AddParamToSqlCommand(command, "@ToPlace", ParameterDirection.Input, SqlDbType.VarChar, 100, toPlace);
                _objSPData.AddParamToSqlCommand(command, "@TravelMode", ParameterDirection.Input, SqlDbType.VarChar, 50, travelMode);
                _objSPData.AddParamToSqlCommand(command, "@Distance", ParameterDirection.Input, SqlDbType.VarChar, 50, distance);
                _objSPData.AddParamToSqlCommand(command, "@StartTime", ParameterDirection.Input, SqlDbType.VarChar, 10, startTime);
                _objSPData.AddParamToSqlCommand(command, "@EndTime", ParameterDirection.Input, SqlDbType.VarChar, 10, endTime);
                _objSPData.AddParamToSqlCommand(command, "@Acc1Name", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1Name);
                _objSPData.AddParamToSqlCommand(command, "@Acc1Type", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1Type);
                _objSPData.AddParamToSqlCommand(command, "@Acc1StartTime", ParameterDirection.Input, SqlDbType.VarChar, 10, acc1StartTime);
                _objSPData.AddParamToSqlCommand(command, "@Acc1EndTime", ParameterDirection.Input, SqlDbType.VarChar, 10, acc1EndTime);
                _objSPData.AddParamToSqlCommand(command, "@Acc1OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc1OnlyDoctor);
                _objSPData.AddParamToSqlCommand(command, "@Acc1Mode", ParameterDirection.Input, SqlDbType.VarChar, 5, acc1Mode);

                _objSPData.AddParamToSqlCommand(command, "@Acc2Name", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2Name);
                _objSPData.AddParamToSqlCommand(command, "@Acc2Type", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2Type);
                _objSPData.AddParamToSqlCommand(command, "@Acc2StartTime", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2StartTime);
                _objSPData.AddParamToSqlCommand(command, "@Acc2EndTime", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2EndTime);
                _objSPData.AddParamToSqlCommand(command, "@Acc2OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc2OnlyDoctor);
                _objSPData.AddParamToSqlCommand(command, "@Acc2Mode", ParameterDirection.Input, SqlDbType.VarChar, 5, acc2Mode);

                _objSPData.AddParamToSqlCommand(command, "@Acc3Name", ParameterDirection.Input, SqlDbType.VarChar, 50, acc3Name);
                _objSPData.AddParamToSqlCommand(command, "@Acc3Time", ParameterDirection.Input, SqlDbType.VarChar, 30, acc3Time);
                _objSPData.AddParamToSqlCommand(command, "@Acc3OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc3OnlyDoctor);
                _objSPData.AddParamToSqlCommand(command, "@Acc3Mode", ParameterDirection.Input, SqlDbType.VarChar, 5, acc3Mode);

                _objSPData.AddParamToSqlCommand(command, "@Acc4Name", ParameterDirection.Input, SqlDbType.VarChar, 50, acc4Name);
                _objSPData.AddParamToSqlCommand(command, "@Acc4Time", ParameterDirection.Input, SqlDbType.VarChar, 30, acc4Time);
                _objSPData.AddParamToSqlCommand(command, "@Acc4OnlyDoctor", ParameterDirection.Input, SqlDbType.VarChar, 30, acc4OnlyDoctor);
                _objSPData.AddParamToSqlCommand(command, "@Acc4Mode", ParameterDirection.Input, SqlDbType.VarChar, 5, acc4Mode);

                _objSPData.AddParamToSqlCommand(command, "@IsRCPA", ParameterDirection.Input, SqlDbType.Char, 1, isrcpa);
                _objSPData.AddParamToSqlCommand(command, "@RouteWay", ParameterDirection.Input, SqlDbType.VarChar, 10, routeWay);
                _objSPData.AddParamToSqlCommand(command, "@Lattitude", ParameterDirection.Input, SqlDbType.VarChar, 30, lattitude);
                _objSPData.AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, longitude);
                _objSPData.AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, location);
                _objSPData.AddParamToSqlCommand(command, "@SourceOfEntry", ParameterDirection.Input, SqlDbType.VarChar, 10, sourceOfEntry);
                _objSPData.AddParamToSqlCommand(command, "@ActivityString", ParameterDirection.Input, SqlDbType.VarChar, activistyString.Length, activistyString);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);
                _objSPData.AddParamToSqlCommand(command, "@TPDeviation", ParameterDirection.Input, SqlDbType.VarChar, 1, tpDeviation);
                _objSPData.AddParamToSqlCommand(command, "@CPDeviation", ParameterDirection.Input, SqlDbType.VarChar, 1, cpDeviation);
                _objSPData.AddParamToSqlCommand(command, "@OriginOfDCR", ParameterDirection.Input, SqlDbType.TinyInt, 1, originOfDCR);
                _objSPData.AddParamToSqlCommand(command, "@SFCRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, sfcRegionCode);
                _objSPData.AddParamToSqlCommand(command, "@SFCVersionNo", ParameterDirection.Input, SqlDbType.VarChar, 30, sfcVersionNo);
                _objSPData.AddParamToSqlCommand(command, "@SFCCategoryName", ParameterDirection.Input, SqlDbType.VarChar, 50, sfcCategoryName);
                _objSPData.AddParamToSqlCommand(command, "@dcr_Freeze", ParameterDirection.Input, SqlDbType.Bit, 1, dcr_Freeze);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Entered_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Entered_TimeZone", ParameterDirection.Input, SqlDbType.VarChar, 1000, _objDateDetails.TimeZone);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Entered_OffSet", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Off_Set);
                _objSPData.AddParamToSqlCommand(command, "@UTC_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.UTC_Date);
                _objSPData.AddParamToSqlCommand(command, "@ISchecked", ParameterDirection.Input, SqlDbType.Int, 1, ISchecked);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
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

        public string InsertTravelledPlaces(string companyCode, string userCode, string dcrCode, string dcrDate, string intermediateData, string flag, string category)
        {
            Data _objData = new Data();
            try
            {
                string cmdText = SP_hd_V4_InsertTravelledPlaces;
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@IntermediateData", ParameterDirection.Input, SqlDbType.VarChar, intermediateData.Length, intermediateData);
                _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 5, flag);
                _objSPData.AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 50, category);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
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

        public List<DCRDoctorAccompanistModel> GetDoctorAccompanistDetails(string companyCode, string userCode, string dcrDate, string dcrCode, string dataFrom)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRDoctorAccompanistModel> lstAccomp = new List<DCRDoctorAccompanistModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDoctorAccompanistDetails);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.Date, 15, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DataFrom", ParameterDirection.Input, SqlDbType.VarChar, 10, dataFrom);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            DCRDoctorAccompanistModel objAccom = new DCRDoctorAccompanistModel();
                            objAccom.Acc_Region_Code = sqldataReader["Acc_Region_Code"].ToString();
                            lstAccomp.Add(objAccom);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstAccomp;
        }

        public DataSet GetTPDetailsWhenWAExists(string companyCode, string userCode, string dcrDate, string activityFlag)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetTPDetailsforDCRHeader);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, activityFlag);

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

        public IEnumerable<MVCModels.DCRSFCModel> CheckSFCForUniqueCombination(string companyCode, string fromPlace, string toPlace, string categoryName, string regionCode, string travelMode, string distance, string dcrDate)
        {
            IEnumerable<MVCModels.DCRSFCModel> lst = new List<DCRSFCModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT From_Region_Name AS From_Place,To_Region_Name AS To_Place"
                                    + ",Distance,Distance_Fare_Code,Travel_Mode,Category_Name AS SFC_Category_Name"
                                    + ",Region_Code AS SFC_Region_Code,SFC_Version_No,Fare_Amount,ISNULL(SFC_Visit_Count,'') AS 'SFC_Visit_Count'  FROM tbl_SFA_Region_Distance "
                                    + " WHERE"
                                    + "     Region_Code= @Region_Code AND (From_Region_Name= @From_Region_Name"
                                    + "     AND To_Region_Name= @To_Region_Name) OR(From_Region_Name= @To_Region_Name"
                                    + "     AND To_Region_Name= @From_Region_Name) AND Travel_Mode= @Travel_Mode"
                                    + "     AND Category_Name= @Category_Name AND Status= @Status"
                                    + "     AND Distance=@Distance "
                                    + "     AND Date_From<= @DCRDate AND Date_To>= @DCRDate AND Company_Code= @Company_Code";
                    lst = connection.Query<MVCModels.DCRSFCModel>(query
                        , new
                        {
                            Company_Code = companyCode,
                            Region_Code = regionCode,
                            From_Region_Name = fromPlace,
                            To_Region_Name = toPlace,
                            Travel_Mode = travelMode,
                            Category_Name = categoryName,
                            Distance = distance,
                            Status = "1",
                            DCRDate = dcrDate
                        });
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }

        public IEnumerable<MVCModels.DCRSFCModel> CheckSFCForNextVersionNumber(string companyCode, string distanceFareCode, string sfcVersionNo, string dcrDate)
        {
            IEnumerable<MVCModels.DCRSFCModel> lst = new List<DCRSFCModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT UPPER(From_Region_Name) AS From_Place,UPPER(To_Region_Name) AS To_Place"
                                    + ",Distance,Distance_Fare_Code,UPPER(Travel_Mode) AS Travel_Mode,Category_Name AS SFC_Category_Name"
                                    + ",Region_Code AS SFC_Region_Code,SFC_Version_No,Fare_Amount,ISNULL(SFC_Visit_Count,'') AS 'SFC_Visit_Count' FROM tbl_SFA_Region_Distance "
                                    + " WHERE"
                                    + "     Distance_Fare_Code= @Distance_Fare_Code AND SFC_Version_No > @SFC_Version_No AND Status= @Status"
                                    + "     AND Date_From<= @DCRDate AND Date_To>= @DCRDate AND Company_Code= @Company_Code";
                    lst = connection.Query<MVCModels.DCRSFCModel>(query
                        , new
                        {
                            Company_Code = companyCode,
                            Distance_Fare_Code = distanceFareCode,
                            SFC_Version_No = sfcVersionNo,
                            Status = "1",
                            DCRDate = dcrDate
                        });
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }

        public IEnumerable<MVCModels.DCRSFCModel> CheckSFCForSameSFCCode(string companyCode, string distanceFareCode, string sfcVersionNo, string dcrDate)
        {
            IEnumerable<MVCModels.DCRSFCModel> lst = new List<DCRSFCModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT UPPER(From_Region_Name) AS From_Place,UPPER(To_Region_Name) AS To_Place"
                                    + ",Distance,Distance_Fare_Code,UPPER(Travel_Mode) AS Travel_Mode,Category_Name AS SFC_Category_Name"
                                    + ",Region_Code AS SFC_Region_Code,SFC_Version_No,Fare_Amount,ISNULL(SFC_Visit_Count,'') AS 'SFC_Visit_Count' FROM tbl_SFA_Region_Distance "
                                    + " WHERE"
                                    + "     Distance_Fare_Code= @Distance_Fare_Code AND SFC_Version_No = @SFC_Version_No AND Status= @Status"
                                    + "     AND Date_From<= @DCRDate AND Date_To>= @DCRDate AND Company_Code= @Company_Code";
                    lst = connection.Query<MVCModels.DCRSFCModel>(query
                        , new
                        {
                            Company_Code = companyCode,
                            Distance_Fare_Code = distanceFareCode,
                            SFC_Version_No = sfcVersionNo,
                            Status = "1",
                            DCRDate = dcrDate
                        });
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }

        #region Added Cp details for Accompanist in DCR and TP
        /// <summary>
        /// Used to Get the Cp for selected accomapnist
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.AccomCPModel> GetCpforAccompanist(string companyCode, string regionCode)
        {
            List<MVCModels.AccomCPModel> lstCpAccompanistdetails = new List<AccomCPModel>();
            List<AccompanistCpModel> lstAccomCP = null;
            List<AccomanistCPHOPModel> lstAccomCPHOP = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    using (var multiple = connection.QueryMultiple(SP_HD_GETACCOMPANISTCPFORDCR, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstAccomCP = multiple.Read<AccompanistCpModel>().ToList();
                        lstAccomCPHOP = multiple.Read<AccomanistCPHOPModel>().ToList();
                    }

                }

                MVCModels.AccomCPModel _objAccomCpdetails = new MVCModels.AccomCPModel();
                _objAccomCpdetails.lstAccomCP = lstAccomCP;
                _objAccomCpdetails.lstAccomCPHOP = lstAccomCPHOP;
                lstCpAccompanistdetails.Add(_objAccomCpdetails);
            }
            catch
            {
                throw;
            }
            return lstCpAccompanistdetails;
        }
        /// <summary>
        /// Get Drafted Accompanist CP Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="accName"></param>
        /// <param name="accRegion"></param>
        /// <param name="regionCode"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public DataSet GetAccompanistCodeAndCPData(string companyCode, string accName, string accRegion, string regionCode, string userTypeCode, string dcrDate)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GETACCOMPANISTCPDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 200, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@AccName", ParameterDirection.Input, SqlDbType.VarChar, 200, accName);
                _objSPData.AddParamToSqlCommand(command, "@AccRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, accRegion);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrDate);

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

        public DataSet GetUserInforByUserName(string CompanyCode, string userName)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETUSERINFOBYUSERNAME);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@User_Name", ParameterDirection.Input, SqlDbType.VarChar, 50, userName);

                _objData.OpenConnection(CompanyCode);
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
        #endregion Added Cp details for Accompanist in DCR and TP
        /// <summary>
        /// Get activity lock type for the day in mobile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public int GetActivityLockType(string companyCode, string userCode, string dcrDate, string flag)
        {
            int activityType = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@User_Code", userCode);
                    parameter.Add("@Dcr_date", dcrDate);
                    parameter.Add("@Dcr_Flag", flag);
                    activityType = connection.Query<int>(SP_HD_GETACTIVITYLOCKTYPE, parameter, commandType: CommandType.StoredProcedure).Single();
                }
            }
            catch
            {
                throw;
            }
            return activityType;
        }


        public int GetAppliedTPUsersCount(string companyCode, string userCode)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);

                    p.Add("@Result", -1, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETPENDINGTPFORAPPROVALUSERS, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return rowcount;
        }

        public int GetAppliedSSUsersCount(string companyCode, string userCode)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);

                    p.Add("@Result", -1, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETPENDINGSSFORAPPROVALUSERS, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return rowcount;
        }

        public List<SFCStatus> CheckSFCStatus(string companyCode, string IntermediateData, string dcrDate)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<SFCStatus> lstSfc = new List<SFCStatus>();

            try
            {
                SqlCommand command = new SqlCommand(SP_HDCHECKSFCSTATUS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@IntermediateData", ParameterDirection.Input, SqlDbType.VarChar, IntermediateData.Length, IntermediateData);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            SFCStatus objSFC = new SFCStatus();
                            objSFC.From_Region_Name = sqldataReader["From_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.To_Region_Name = sqldataReader["To_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.Date_From = sqldataReader["Date_From"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.Date_To = sqldataReader["Date_To"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");
                            objSFC.Distance_Fare_Code = sqldataReader["Distance_Fare_Code"].ToString().ToUpper().Replace("\n", "").Replace("\r", "");

                            lstSfc.Add(objSFC);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstSfc;
        }
        public string GetLeaveUnapprovalReason(DateTime dcrDate, string usercode, string companyCode)
        {
            string unapprovalReason = "";
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETDCRLEAVEUNAPPROVALREASON);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@usercode", ParameterDirection.Input, SqlDbType.VarChar, 30, usercode);
                AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                _objData.OpenConnection(companyCode);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            unapprovalReason = dataReader["Unapproval_Reason"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return unapprovalReason;
        }
        public string RemoveAccompanist(string acc_id, DateTime dcrDate, string userCode, string companyCode, string acc_UserName, string acc_Region_Code)
        {
            Data objData = new Data();
            string rValue = "";
            try
            {
                using (SqlCommand command = new SqlCommand(SP_HD_REMOVEACCOMPANIST))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SPData _objSPData = new SPData();
                    _objSPData.AddParamToSqlCommand(command, "@acc_id", ParameterDirection.Input, SqlDbType.VarChar, 30, acc_id);
                    _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                    _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@acc_UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, acc_UserName);
                    _objSPData.AddParamToSqlCommand(command, "@acc_Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, acc_Region_Code);
                    objData.OpenConnection(companyCode);
                    SqlParameter parameter = new SqlParameter("@result", SqlDbType.VarChar);
                    parameter.Direction = ParameterDirection.Output;
                    parameter.Size = 500;
                    command.Parameters.Add(parameter);
                    objData.ExecuteNonQuery(command);
                    rValue = parameter.Value.ToString();

                }
            }
            catch (Exception ex)
            {
                rValue = "Error";
            }
            finally
            {
                objData.CloseConnection();
            }

            return rValue;
        }
        public string InsertDoctorVisit(string companyCode, string DCRCode, DCRDoctorAccompanistModel DCRDoctorAccompanistModel, string acc_index)
        {
            Data objData = new Data();
            string rValue = "";
            try
            {
                using (SqlCommand command = new SqlCommand(SP_HD_INSERT_SINGLE_DOCTORVISIT))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SPData _objSPData = new SPData();
                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCRCode);
                    _objSPData.AddParamToSqlCommand(command, "@Acc_User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, DCRDoctorAccompanistModel.Acc_User_Name);
                    _objSPData.AddParamToSqlCommand(command, "@Is_Only_For_Doctor", ParameterDirection.Input, SqlDbType.Char, 1, DCRDoctorAccompanistModel.Is_Only_For_Doctor);
                    _objSPData.AddParamToSqlCommand(command, "@Mode_Of_Entry", ParameterDirection.Input, SqlDbType.Char, 1, "");
                    _objSPData.AddParamToSqlCommand(command, "@Acc_User_Type_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, DCRDoctorAccompanistModel.Acc_User_Type_Name);
                    _objSPData.AddParamToSqlCommand(command, "@Is_Accompanied_call", ParameterDirection.Input, SqlDbType.VarChar, 3, DCRDoctorAccompanistModel.Is_Accompanied_call);
                    _objSPData.AddParamToSqlCommand(command, "@acc_index", ParameterDirection.Input, SqlDbType.VarChar, 3, acc_index);

                    objData.OpenConnection(companyCode);
                    SqlParameter parameter = new SqlParameter("@result", SqlDbType.VarChar);
                    parameter.Direction = ParameterDirection.Output;
                    parameter.Size = 500;
                    command.Parameters.Add(parameter);
                    objData.ExecuteNonQuery(command);
                    rValue = parameter.Value.ToString();

                }
            }
            catch (Exception ex)
            {
                rValue = "Error";
            }
            finally
            {
                objData.CloseConnection();
            }

            return rValue;
        }
        public int GetDoctorVisitCount(string dcr_code, string companyCode)
        {
            Data objData = new Data();
            int rValue = 0;
            try
            {
                using (SqlCommand command = new SqlCommand(SP_HD_GETDOCTORVISITCOUNT))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SPData _objSPData = new SPData();
                    _objSPData.AddParamToSqlCommand(command, "@dcr_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dcr_code);
                    objData.OpenConnection(companyCode);
                    SqlParameter parameter = new SqlParameter("@Doctor_count", SqlDbType.VarChar);
                    parameter.Direction = ParameterDirection.Output;
                    parameter.Size = 500;
                    command.Parameters.Add(parameter);
                    objData.ExecuteNonQuery(command);
                    rValue = Convert.ToInt32(parameter.Value);
                }
            }
            catch (Exception ex)
            {
                rValue = 0;
            }
            finally
            {
                objData.CloseConnection();
            }
            return rValue;
        }
        public string BindDCRFreezeStatus(DateTime dcr_date, string user_code, string company_code)
        {
            Data objData = new Data();
            string dcrFreezeStatus = "NO";
            try
            {
                using (SqlCommand command = new SqlCommand(SP_HD_GETDCRFREEZESTATUS))
                {
                    SPData _objSPData = new SPData();
                    command.CommandType = CommandType.StoredProcedure;
                    _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.DateTime, 50, dcr_date);
                    _objSPData.AddParamToSqlCommand(command, "@user_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                    _objSPData.AddParamToSqlCommand(command, "@company_code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_code);
                    objData.OpenConnection(company_code);
                    SqlParameter parameter = new SqlParameter("@freeze_Status", SqlDbType.VarChar);
                    parameter.Direction = ParameterDirection.Output;
                    parameter.Size = 500;
                    command.Parameters.Add(parameter);
                    objData.ExecuteNonQuery(command);
                    dcrFreezeStatus = parameter.Value.ToString();
                }
            }
            catch (Exception ex)
            {
                dcrFreezeStatus = "NO";
            }
            finally
            {
                objData.CloseConnection();
            }
            return dcrFreezeStatus;
        }
        public DataSet CheckSFCCount(int distanceFareCode, DateTime dcr_Date, string user_code, string company_code)
        {
            DataSet ds = new DataSet();
            try
            {
                Data objData = new Data();
                using (SqlCommand command = new SqlCommand(SP_HD_V4_CHECK_DCR_SFC_VISIT_COUNT))
                {
                    SPData _objSPData = new SPData();
                    command.CommandType = CommandType.StoredProcedure;
                    _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.DateTime, 50, dcr_Date);
                    _objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                    _objSPData.AddParamToSqlCommand(command, "@distance_fare_code", ParameterDirection.Input, SqlDbType.VarChar, 30, distanceFareCode);
                    objData.OpenConnection(company_code);
                    ds = objData.ExecuteDataSet(command);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds;
        }
        public int InsertDCRQueueExceptionLog(string companyCode, string dcrCode, string flag, string userCode, string dcrDate, string exceptionMsg, string stackTrace, string eventName)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    string query = "INSERT INTO tbl_SFA_DCR_Queue_Exception_Logs "
                                        + "(CompanyCode,DCRCode,Flag,UserCode,DCRDate,ExceptionMsg,StackTrace,EventName) "
                                        + " VALUES (@CompanyCode,@DCRCode,@Flag,@UserCode,@DCRDate,@ExceptionMsg "
                                        + ",@StackTrace,@EventName)";
                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        DCRCode = dcrCode,
                        Flag = userCode,
                        UserCode = userCode,
                        DCRDate = dcrDate,
                        ExceptionMsg = exceptionMsg,
                        StackTrace = stackTrace,
                        EventName = eventName

                    });
                }
            }
            catch
            {

            }
            return rowsAffected;
        }

        public System.Int32 InsertDCRQueueTracker(string companyCode, DCRQueueTracker dcrQueueTracker)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", dcrQueueTracker.UserCode);
                    parameter.Add("@DCRCode", dcrQueueTracker.DCRCode);
                    parameter.Add("@Flag", dcrQueueTracker.Flag);
                    parameter.Add("@EventName", dcrQueueTracker.EventName);
                    parameter.Add("@ProcessStatus", dcrQueueTracker.ProcessStatus);
                    parameter.Add("@JSONObject", dcrQueueTracker.JSONObject);
                    parameter.Add("@TopicName", dcrQueueTracker.TopicName);
                    parameter.Add("@SubscriptionName", dcrQueueTracker.SubscriptionName);
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);

                    connection.Query<string>("USP_HD_INSERTDCRQUEUETRACKER", parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    int Id = -1;
                    if (!Int32.TryParse(result, out Id))
                    {
                        return -1;
                    }
                    connection.Close();
                }
            }
            catch
            {
                return -1;
            }
            return Convert.ToInt32(result);
        }

        public System.Int32 UpdateDCRQueueTracker(string companyCode, DCRQueueTracker dcrQueueTracker)
        {
            int result = -1;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@Id", dcrQueueTracker.Id);
                    parameter.Add("@ProcessStatus", dcrQueueTracker.ProcessStatus);
                    parameter.Add("@ExceMsg", value: dcrQueueTracker.Mesg, size: 500);
                    parameter.Add("@StackTrace", value: dcrQueueTracker.StackTrace, size: 2000);

                    result = connection.Execute("usp_hd_UpdateDCRQueueTracker", parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                return -1;
            }
            return Convert.ToInt32(result);
        }

        public int GetErrorDetails(string Message, string StackTrace, string usercode, string dcrDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "INSERT INTO tbl_SFA_DCR_ErrorMessage "
                                     + "(User_Code,DCR_Actual_Date,DCR_Entered_Date,Message,StackTrace) "
                                     + " VALUES (@usercode,@dcrDate,GETDATE(),@Message,@StackTrace)";
                    rowsAffected = connection.Execute(query, new
                    {
                        usercode = usercode,
                        dcrDate = dcrDate,
                        Message = Message,
                        StackTrace = StackTrace
                    });
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        public int GetDoctorCount(string Companycode, string region_Code)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", Companycode);
                    parameter.Add("@RegionCodes", region_Code);
                    parameter.Add("@Result", -1, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HdGetDoctorCountforchkindependent, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public List<Loggedinfullindex> GetFullIndex(string Companycode, string region_Code)
        {
            List<Loggedinfullindex> lstfullindx = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", Companycode);
                    parameter.Add("@Region_Code", region_Code);
                    lstfullindx = connection.Query<Loggedinfullindex>(SP_HD_GetLoggedInUser_FullIndex, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstfullindx;
        }
        public string  SingleDaySfcValidation(SfcValidationModel obj)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@User_Code", obj.User_Code);
                    parameter.Add("@DCR_Date", obj.DCR_Date);
                    parameter.Add("@Work_Category", obj.Work_Category);
                    parameter.Add("@Flag", obj.Flag);
                    parameter.Add("@Tvp_Table", ToDataTable(obj.lstSfc_Data).AsTableValuedParameter());
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);
                    connection.Query<string>("Usp_Hd_Single_Day_Sfc_Validation", parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        // Converting List to Datatable.
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
        public int GetCategorySetting(string Category_Code, string User_Type_Code,string dcrDate)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Category_Code", Category_Code);
                    p.Add("@User_Type_Code", User_Type_Code);
                    p.Add("@dcrDate", dcrDate);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_Hd_GetCategorySetting", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
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
        public List<StockiestName> Getlockedstockiestname(string RegionCode, int SS_Id)
        {
            List<StockiestName> lst = new List<StockiestName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", RegionCode);
                    p.Add("@SS_Id", SS_Id);
                    lst = connection.Query<StockiestName>("SP_HD_Getlockedstockiestname", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
    }
}
