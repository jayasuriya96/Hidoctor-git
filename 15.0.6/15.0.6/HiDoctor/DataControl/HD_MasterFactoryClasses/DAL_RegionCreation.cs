using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_RegionCreation : DapperRepository
    {
        private Data _objData = new Data();

        const string SP_HDGetUnderRegion = "SP_HDGetUnderRegion";
        const string SP_HD_GetAllRegions = "SP_HD_GetAllRegions";
        const string SP_HD_GetRegiontype = "SP_HD_GetRegiontype";
        const string SP_HD_GetRegionClassification = "SP_HD_GetRegionClassification";
        const string SP_HD_GetExpenseGroup = "SP_HD_GetExpenseGroup";
        const string SP_hd_GetActiveDivisions = "SP_hd_GetActiveDivisions";
        const string SP_hd_GetPrice_Grouping = "SP_hd_GetPrice_Grouping";
        const string SP_HD_GetWeekends = "SP_HD_GetWeekends";
        const string SP_hdGetRegionsforholiday = "SP_hdGetRegionsforholiday";
        const string SP_HD_GetHolidaysforRegion = "SP_HD_GetHolidaysforRegion";
        const string SP_HD_GetHolidaybasedonselyear = "SP_HD_GetHolidaybasedonselyear";
        const string SP_HD_SaveRegion = "SP_HD_SaveRegion";
        const string SP_HD_SaveRegionMappings = "SP_HD_SaveRegionMappings";

        const string sp_hd_GetUnderRegionsOnly = "sp_hd_GetUnderRegionsOnly";
        const string SP_hdGetRegion = "SP_hdGetRegionforrcw";
        const string SP_hdGetRegionDetails = "SP_hdGetRegionDetails";
        const string SP_hdGetChildRegions = "SP_hdGetChildRegions";
        const string SP_hdGetParentRegions = "SP_hdGetParentRegions";
        const string SP_HD_DisableRegion = "SP_HD_DisableRegion";
        const string TVP_HD_ReportingRegionInfo = "TVP_HD_ReportingRegionInfo";
        const string SP_HD_Changeleafregions = "SP_HD_Changeleafregions";
        const string usp_hd_API_GetDCRLastEnteredDateByRegion = "usp_hd_API_GetDCRLastEnteredDateByRegion";

        const string sp_GetRegionMaster = "sp_GetRegionMaster";
        const string sp_GetRegionDetails = "sp_GetRegionDetails";
        const string SP_HD_EditRegion = "SP_HD_EditRegion";
        const string SP_HD_GetAllUnderRegions = "SP_HD_GetAllUnderRegions";
        const string SP_HD_GetAllRegionTypes = "SP_HD_GetAllRegionTypes";
        const string SP_HD_GETREGIONDETAILS = "SP_HD_GetRegionDetails";
        const string SP_HD_CheckDuplicateRegion = "SP_HD_CheckDuplicateRegion";

        private SPData _objSPData;

        public List<UnderRegion> GetUnderRegions(string companyCode, string regioncode, string divisionName, string divisionCode)
        {
            List<UnderRegion> lstunderreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@region_Code", regioncode);
                    p.Add("@divisionName", divisionName);
                    p.Add("@divisionCode", divisionCode);
                    lstunderreg = connection.Query<UnderRegion>(SP_HDGetUnderRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstunderreg;
        }
        public List<UnderRegion> GetRegions(string companyCode)
        {
            List<UnderRegion> lstreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstreg = connection.Query<UnderRegion>(SP_HD_GetAllRegions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstreg;
        }
        public List<RegionType> GetRegionType(string companyCode)
        {
            List<RegionType> lstregtype = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstregtype = connection.Query<RegionType>(SP_HD_GetRegiontype, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstregtype;
        }
        public List<RegionClassification> GetRegionClass(string companyCode)
        {
            List<RegionClassification> lstregtype = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstregtype = connection.Query<RegionClassification>(SP_HD_GetRegionClassification, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public List<ExpenseGroup> GetExpenseGroup(string companyCode)
        {
            List<ExpenseGroup> lstregtype = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstregtype = connection.Query<ExpenseGroup>(SP_HD_GetExpenseGroup, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public List<Divisions> GetDivisions(string companyCode, string UserCode)
        {
            List<Divisions> lstdiv = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@UserCode", UserCode);
                    lstdiv = connection.Query<Divisions>(SP_hd_GetActiveDivisions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdiv;
        }

        public List<Deport> GetDepo(string companyCode)
        {
            List<Deport> lstdeport = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    //p.Add("@UserCode", UserCode);
                    lstdeport = connection.Query<Deport>("SP_hd_GetDepoDetails", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdeport;
        }
        internal bool SaveMapping(string companycode, string userCode, string regionCode, string companyid, string weekend_Code, string price_group_code, string region_Lock, string chemist_Lock, string region_Type_Code, string effective_From, string effective_To_Month, string effective_To_Year, object division_Codes, string holiday_Code, string holiday_name)
        {
            throw new NotImplementedException();
        }

        public bool InsertRegions(string companyCode, string userCode, string regionCode, string Companyid, string Region_Name, string Under_Region_Code, string Under_Region_Id, string Region_Type_Code, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area,string Primary_Division,string Ref_Key1,string Ref_Key2,string Depot_Code)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@regionCode", regionCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@Region_Name", Region_Name);
                    p.Add("@Under_Region_Code", Under_Region_Code);
                    p.Add("@Under_Region_Id", Under_Region_Id);
                    p.Add("@Region_Type_Code", Region_Type_Code);
                    p.Add("@region_Classification", null);
                    p.Add("@Region_Classification_Code", Region_Classification_Code);
                    p.Add("@Expense_Group_Id", Expense_Group_Id);
                    p.Add("@Country", Country);
                    p.Add("@State", State);
                    p.Add("@City", City);
                    p.Add("@Local_Area", Local_Area);
                    p.Add("@Primary_Division", Primary_Division);
                    p.Add("@Ref_Key1", Ref_Key1); 
                    p.Add("@Ref_Key2", Ref_Key2);
                    p.Add("@Depot_Code", Depot_Code);
                    connection.Execute(SP_HD_SaveRegion, p, commandType: CommandType.StoredProcedure, commandTimeout:0);
                    connection.Close();
                    result = true;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<PriceGroup> GetPriceGroup(string companyCode)
        {
            List<PriceGroup> lstpricegrp = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);

                    lstpricegrp = connection.Query<PriceGroup>(SP_hd_GetPrice_Grouping, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstpricegrp;
        }
        public List<Weekend> GetWeekends(string companyCode)
        {
            List<Weekend> lstWeekend = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstWeekend = connection.Query<Weekend>(SP_HD_GetWeekends, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstWeekend;
        }
        public List<UnderRegion> Getregionsforholiday(string companyCode, string Under_Region_Code)
        {
            List<UnderRegion> lstregionholiday = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Under_Region_Code", Under_Region_Code);
                    lstregionholiday = connection.Query<UnderRegion>(SP_hdGetRegionsforholiday, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregionholiday;
        }
        public HolidayInfoModel GetHolidays(string companyCode, string Region_Code)
        {
            HolidayInfoModel objholiday = null;
            List<Holiday> lstregionholiday = null;
            List<Holiday> lstholidayyear = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", Region_Code);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GetHolidaysforRegion, p, commandType: CommandType.StoredProcedure))
                    {
                        lstregionholiday = multiselect.Read<Holiday>().ToList();
                        lstholidayyear = multiselect.Read<Holiday>().ToList();

                    }
                    objholiday = new HolidayInfoModel();
                    objholiday.lstregionholiday = lstregionholiday;
                    objholiday.lstholidayyear = lstholidayyear;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return objholiday;
        }
        public List<Holiday> GetHolidayDateOnYear(string SelectedYear,string RegionCode)
        {
            List<Holiday> lstregionholiday = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@regioncode", RegionCode);
                    p.Add("@SelectedYear", SelectedYear);
                    lstregionholiday = connection.Query<Holiday>(SP_HD_GetHolidaybasedonselyear, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregionholiday;
        }
        public bool SaveMapping(string companycode, string UserCode, string regionCode, string Companyid, string Weekend_Code, string Price_group_code, string Region_Lock, string Chemist_Lock, string Region_Type_Code, string Effective_From, string Effective_To_Month ,string Effective_To_Year, string Division_Code, string holiday_Code, string holiday_name)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", UserCode);
                    p.Add("@regionCode", regionCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@Weekend_Code", Weekend_Code);
                    p.Add("@Price_group_code", Price_group_code);
                    p.Add("@Region_Lock", Region_Lock);
                    p.Add("@Chemist_Lock", Chemist_Lock);
                    p.Add("@Region_Type_Code", Region_Type_Code);
                    p.Add("@Effective_From", Effective_From);
                    p.Add("@Effective_To_Month", Effective_To_Month);
                    p.Add("@Effective_To_Year", Effective_To_Year);
                    p.Add("@DivisionCode", Division_Code);
                    p.Add("@holiday_Code", holiday_Code);
                    p.Add("@holiday_name", holiday_name);

                    connection.Execute(SP_HD_SaveRegionMappings, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    result = true;

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //Disable - region Creation

        public List<UnderRegion> GetActiveRegions(string companyCode, string region_Code)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", region_Code);
                    lstactreg = connection.Query<UnderRegion>(SP_hdGetRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }

        public RegInfoModel GetRegionInfo(string companyCode, string Region_Code)
        {
            RegInfoModel ObjRegInfo = null;
            List<RegionInfo> lstreginfo = null;
            List<RegionInfo> lstcurrinfo = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@region_Code", Region_Code);
                    using (var multiselect = connection.QueryMultiple(SP_hdGetRegionDetails, p, commandType: CommandType.StoredProcedure))
                    {
                        lstcurrinfo = multiselect.Read<RegionInfo>().ToList();
                        lstreginfo = multiselect.Read<RegionInfo>().ToList();

                    }
                    ObjRegInfo = new RegInfoModel();
                    ObjRegInfo.lstcurrinfo = lstcurrinfo;
                    ObjRegInfo.lstreginfo = lstreginfo;
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return ObjRegInfo;
        }

        public List<RegionInfo> GetLeafRegions(string companyCode, string Region_Code)
        {

            List<RegionInfo> lstleafreg = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", Region_Code);
                    lstleafreg = connection.Query<RegionInfo>(SP_hdGetChildRegions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstleafreg;
        }
        public List<UnderRegion> GetReportingRegions(string companyCode, string Region_Code)
        {

            List<UnderRegion> lstreportingregion = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", Region_Code);
                    lstreportingregion = connection.Query<UnderRegion>(SP_hdGetParentRegions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstreportingregion;
        }
        public List<UnderRegion> GetSelUnderRegions(string companyCode, string Region_Code)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@region_Code", Region_Code);
                    lstactreg = connection.Query<UnderRegion>(sp_hd_GetUnderRegionsOnly, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }

        public List<DCRDatemodel> GetDCRLastEnteredDate(string companyCode, string Region_Code)
        {
            List<DCRDatemodel> lstdcrdate = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@region_Code", Region_Code);
                    lstdcrdate = connection.Query<DCRDatemodel>(usp_hd_API_GetDCRLastEnteredDateByRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdcrdate;
        }

        public bool SaveReportingreg(string companyCode, List<Reportingreg> lstregdisable, DataTable dtdisable)
        {
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                cmdText = SP_HD_Changeleafregions;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                if (lstregdisable.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_HD_ReportingRegionInfo", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_HD_ReportingRegionInfo");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_HD_ReportingRegionInfo", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_HD_ReportingRegionInfo");
                }

                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
            }


            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }


        public bool SaveDisableRegion(string companycode, string UserCode, string Companyid, string Disable_Date, string Region_Name, string Region_Code)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", UserCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@Disable_Date", Disable_Date);
                    p.Add("@Region_Name", Region_Name);
                    p.Add("@Region_Code", Region_Code);

                    connection.Execute(SP_HD_DisableRegion, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    result = true;

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //hierarchy
        public List<UnderRegion> GetAllRegions(string companyCode)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstactreg = connection.Query<UnderRegion>(sp_GetRegionMaster, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }
        public List<UnderRegion> GetAllUnderRegions(string companyCode)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstactreg = connection.Query<UnderRegion>(SP_HD_GetAllUnderRegions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }
        public List<RegionType> GetAllRegionType(string companyCode)
        {
            List<RegionType> lstregtype = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstregtype = connection.Query<RegionType>(SP_HD_GetAllRegionTypes, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public RegionCreationModelRCW GetRegionDetails(string companyCode, string regioncode)
        {
            RegionCreationModelRCW ObjRegInfo = null;
            List<RegionCreationModel> lstregdetails = null;
            List<RegionCreationModel> lstregdivddetails = null;
            List<RegionCreationModel> lstActiveCount = null;
            List<RegionCreationModel> lstDepoDetails = null;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@regioncode", regioncode);
                    using (var multiselect = connection.QueryMultiple(sp_GetRegionDetails, p, commandType: CommandType.StoredProcedure))
                    {
                        lstregdetails = multiselect.Read<RegionCreationModel>().ToList();
                        lstregdivddetails = multiselect.Read<RegionCreationModel>().ToList();
                        lstDepoDetails = multiselect.Read<RegionCreationModel>().ToList();
                        lstActiveCount = multiselect.Read<RegionCreationModel>().ToList();
                  
                    }
                    ObjRegInfo = new RegionCreationModelRCW();
                    ObjRegInfo.lstregdetails = lstregdetails;
                    ObjRegInfo.lstregdivddetails = lstregdivddetails;
                    ObjRegInfo.lstDepoDetails = lstDepoDetails;
                    ObjRegInfo.lstActiveCount = lstActiveCount;
                    
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ObjRegInfo;
        }
        public bool EditRegions(string companyCode, string userCode, string Companyid, string regionCode, string Under_Region_Code, string Region_Type_Code, string Under_Region_Id, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area, string Division_Code, string Region_Name, string Notional_Territory,string Primary_Division,string Ref_Key1,string Ref_Key2,string Depot_Name, string Depot_Code)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@regionCode", regionCode);
                    p.Add("@Under_Region_Code", Under_Region_Code);
                    p.Add("@Regiontypecode", Region_Type_Code);
                    p.Add("@Under_Region_Id", Under_Region_Id);
                    p.Add("@Region_Classification_Code", Region_Classification_Code);
                    p.Add("@Expense_Group_Id", Expense_Group_Id);
                    p.Add("@Country", Country);
                    p.Add("@State", State);
                    p.Add("@City", City);
                    p.Add("@Local_Area", Local_Area);
                    p.Add("@divisioncode", Division_Code);
                    p.Add("@Region_Name", Region_Name);
                    p.Add("@Notional_Territory", Notional_Territory);
                    p.Add("@Primary_Division", Primary_Division);
                    p.Add("@Ref_Key1", Ref_Key1); 
                    p.Add("@Ref_Key2", Ref_Key2);
                    p.Add("@Depot_Name", Depot_Name);
                    p.Add("@Depot_Code", Depot_Code);
                    connection.Execute(SP_HD_EditRegion, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    result = true;

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
            return result;
        }

        public bool CheckDuplicateRegion(string companyCode,string Region_Name, string Region_Code)
        {
            bool result = false;
            int exists = 0;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_CheckDuplicateRegion);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, Region_Name);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Region_Code);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                if (exists == 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
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
            return result;
        }

        public RegionMigrationModel GetRegionMigrationDetails(string Region_Name)
        {
            List<RegionMigrationModel> lstRegion = null;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Name", Region_Name);
                    lstRegion = connection.Query<RegionMigrationModel>(SP_HD_GETREGIONDETAILS, p, commandType: CommandType.StoredProcedure).ToList<RegionMigrationModel>();
                    connection.Close();
                    if (lstRegion != null && lstRegion.Count > 0)
                    {
                        return lstRegion[0];
                    }
                    else
                        return new RegionMigrationModel();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
