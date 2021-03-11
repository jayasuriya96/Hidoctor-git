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
    public class DALRegion : DapperRepository
    {
        DataControl.Data _objData = new DataControl.Data();
        SPData _objSPData = null;
        DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();

        #region const variables
        const string SP_HD_GetActiveProduct = "SP_HD_GetActiveProduct";
        const string sp_hd_insertInwardBulkfromstagingtomaster = "sp_hd_insertInwardBulkfromstagingtomaster";
        const string tbl_Inward_Bulk_Upload_Staging = "tbl_Inward_Bulk_Upload_Staging";
        const string SP_HDGETREGIONCLASSIFICATIONMASTERDATA = "SP_hdGetRegionClassificationMasterData";
        const string SP_HDGETREGIONTYPEMASTER_NG = "SP_hdGetRegionTypeMaster_NG";
        const string SP_HDGETREGIONSBYTYPEANDCLASSIFICATION = "SP_hdGetRegionsByTypeandClassification";
        const string SP_HDPRICEGROUPREGIONMAPPING = "SP_hdPriceGroupRegionMapping";
        const string SP_HDGETMAPPEDREGIONBYPRICEGROUP = "SP_hdGetMappedRegionByPriceGroup";
        const string SP_HDSCHEMEREGIONMAPPING = "SP_hdSchemeRegionMapping";
        const string SP_HDGETMAPPEDREGIONBYSCHEME = "SP_hdGetMappedRegionByScheme";
        const string EXEC = "EXEC";
        const string SP_HDGETREGION = "SP_hdGetRegion";
        const string SP_HDGETCHILDREGIONS = "SP_hdGetChildRegions";
        const string SP_hdGetChildRegionWithDivisionName = "SP_hdGetChildRegionWithDivisionName";
        const string SP_HDINSERTREGIONMASTERSTAGING = "SP_HdInsertRegionMasterStaging";
        //weekend Group
        const string SP_hdGetWeekendOffHolidayMethod = "SP_hdGetWeekendOffHolidayMethod";
        const string SP_hdInsertWeekendHeader = "SP_hdInsertWeekendHeader";
        const string SP_hdGetWeekendGroups = "SP_hdGetWeekendGroups";
        const string SP_hdGetWeekendGroupDefiner = "SP_hdGetWeekendGroupDefiner";

        const string Tbl_SFA_Weekend_Off_Details = "Tbl_SFA_Weekend_Off_Details";
        const string Tbl_SFA_Weekend_Off_Definer = "Tbl_SFA_Weekend_Off_Definer";

        const string Company_Code = "Company_Code";
        const string Weekend_Off_Code = "Weekend_Off_Code";
        const string Weekend_off_Detail_code = "Weekend_off_Detail_code";
        const string Weekend_off_Definer_Code = "Weekend_off_Definer_Code";
        const string Month = "Month";
        const string Year = "Year";
        const string Date = "Date";
        const string Weekday = "Weekday";
        const string WKO_Holiday_Method_Code = "WKO_Holiday_Method_Code";
        const string TBL_SFA_REGION_DISTANCE_STAGING = "tbl_SFA_Region_Distance_Staging";
        const string SP_HDGETACTIVEREGIONLOCKMAPPING = "SP_HDGetActiveRegionLockMapping";
        const string SP_HDINSERTSFCFROMSTAGINGTOMASTER = "SP_hdInsertSFCFromStagingToMaster";
        const string SP_HDGETREGIONTREEDETAILS = "SP_hdGetRegionTreeDetails";
        const string SP_HDGETREGIONSFORPRIMARYSALES = "SP_hdGetRegionsforPrimarySales";
        const string SP_HDGETHOLIDAYDETAILSBYREGIONS = "SP_hdGetHolidayDetailsByRegions";
        const string SP_HDGETHOLIDAYDETAILSBYDATE = "SP_hdGetHolidayDetailsByDate";
        const string SP_HDGETHOLIDAYMAPPEDREGIONS = "SP_hdGetHolidayMappedRegions";
        const string SP_HDGETHOLIDAYUNMAPPEDREGIONS = "SP_hdGetHolidayUnMappedRegions";

        const string SP_HDGETALLREGIONSFORMIGRATION = "SP_hdGetAllRegionsForMigration";
        const string SP_HDUPDATEREGIONINDEXFROMTEMPTOREGIONMASTER = "SP_hdUpdateRegionIndexFromTemptoRegionMaster";
        const string SP_hdGetHolidaysEnteredInLast15Days = "SP_hdGetHolidaysEnteredInLast15Days";
        const string SP_hdUpdateTPLockManuelRelease = "SP_hdUpdateTPLockManuelRelease";
        const string SP_HD_UnMapRegionlock = "SP_HD_UnMapRegionlock";
        const string SP_HDGetActiveRegionLockMapping = "SP_HDGetActiveRegionLockMapping";

        DataSet dsRegion, dsAllRegions;
        string tCode, sCode;
        const string SP_hdGetWeekendDatesMappedForRegion = "SP_hdGetWeekendDatesMappedForRegion";

        //Region Tree New Generation
        const string SP_HD_RM_GETREGIONSBYREGIONNAME = "SP_hd_RM_GetRegionsbyRegionName";
        const string SP_HD_UM_GETIMMEDIATECHILDREGIONS = "SP_hd_UM_GetImmediateChildRegions";
        #endregion const variables

        //Weekenddaysfor mapped region(TP vs actual details report)
        const string SP_GETWEEKENDDAYSFORMAPPEDREGON = "SP_GetWeekenddaysformappedregon";

        //Week end Manual Insert & Delete
        const string Sp_HD_WeekendGroup_Delete = "Sp_HD_WeekendGroup_Delete";
        const string Sp_HD_Manual_WeekendInsert = "Sp_HD_Manual_WeekendInsert";

        //Holiday BULK Upload
        const string TBL_SFA_HOLIDAY_STAGING = "tbl_SFA_Holiday_Staging";
        const string SP_HD_INSERTHOLIDAYFROMSTAGINGTOMASTER = "SP_hd_InsertHolidayFromStagingToMaster";
        const string SP_HDGETREGIONFULLTREEDETAILS = "SP_hdGetRegionFullTreeDetails"; 
         SqlDataReader sqldataReader;

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionClassification(string companyCode)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETREGIONCLASSIFICATIONMASTERDATA + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegClassi = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegClassi.Region_Classification_Code = sqldataReader["Region_Classification_Code"].ToString();
                            objRegClassi.Region_Classification_Name = sqldataReader["Region_Classification_Name"].ToString();
                            lstRegion.Add(objRegClassi);
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
            return lstRegion;
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionType(string companyCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegionType = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETREGIONTYPEMASTER_NG + ""))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegionType = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegionType.Region_Type_Code = sqldataReader["Region_Type_Code"].ToString();
                            objRegionType.Region_Type_Name = sqldataReader["Region_Type_Name"].ToString();
                            lstRegionType.Add(objRegionType);
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
            return lstRegionType;
        }



        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionsByRegTypeAndRegClassification(string companyCode, string regionTypes, string regionClassifications)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETREGIONSBYTYPEANDCLASSIFICATION + " '"
                                                 + companyCode + "','" + regionTypes + "','" + regionClassifications + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public string PriceGroupRegionMapping(string companyCode, string priceGroupCode, string regionCodes)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDPRICEGROUPREGIONMAPPING);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@PriceGroupCode", ParameterDirection.Input, SqlDbType.VarChar, 30, priceGroupCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
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
            catch (Exception ex)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetMappedRegionsByPriceGroup(string companyCode, string priceGroupCode)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETMAPPEDREGIONBYPRICEGROUP + " '" + companyCode + "','" + priceGroupCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public string SchemeRegionMapping(string companyCode, string schemeCode, string regionCodes)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDSCHEMEREGIONMAPPING);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
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
            catch (Exception ex)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        #region WeekEnd Group
        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> WeekendOffHolidayMethods(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstHolidayMethod = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_hdGetWeekendOffHolidayMethod + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendGroupModel objweek = new MVCModels.HiDoctor_Master.WeekendGroupModel();
                            objweek.Holiday_Method_Code = Convert.ToInt16(sqldataReader["WKO_Holiday_Method_Code"]);
                            objweek.Holiday_Method_Name = sqldataReader["WKO_Holiday_Method_Name"].ToString();
                            objweek.Holiday_Method_Class_Name = sqldataReader["Class_Name"].ToString();
                            lstHolidayMethod.Add(objweek);
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
            return lstHolidayMethod;
        }

        // INSERT WEEKEND GROUP HEADER
        public string InsertWeekendGroupHeader(string companyCode, string weekendGroupName)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_hdInsertWeekendHeader);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@WeekendOffName", ParameterDirection.Input, SqlDbType.VarChar, 200, weekendGroupName);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }

        // INSERT WEEKEND GROUP DEATIL
        public string InsertWeekendGroupDetail(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add(Company_Code, Company_Code);
                        copy.ColumnMappings.Add(Weekend_Off_Code, Weekend_Off_Code);
                        copy.ColumnMappings.Add(Weekend_off_Detail_code, Weekend_off_Detail_code);
                        copy.ColumnMappings.Add(Month, Month);
                        copy.ColumnMappings.Add(Year, Year);
                        copy.ColumnMappings.Add(Date, Date);
                        copy.DestinationTableName = Tbl_SFA_Weekend_Off_Details;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        // INSERT WEEKEND GROUP Off Definer
        public string InsertWeekendOffDefiner(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add(Company_Code, Company_Code);
                        copy.ColumnMappings.Add(Weekend_Off_Code, Weekend_Off_Code);
                        copy.ColumnMappings.Add(Weekend_off_Definer_Code, Weekend_off_Definer_Code);
                        copy.ColumnMappings.Add(Year, Year);
                        copy.ColumnMappings.Add(Weekday, Weekday);
                        copy.ColumnMappings.Add(WKO_Holiday_Method_Code, WKO_Holiday_Method_Code);
                        copy.DestinationTableName = Tbl_SFA_Weekend_Off_Definer;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> GetAllWeekendGroups(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstWeekendGroups = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_hdGetWeekendGroups + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendGroupModel objweek = new MVCModels.HiDoctor_Master.WeekendGroupModel();
                            objweek.Weekend_Off_Code = Convert.ToInt32(sqldataReader["Weekend_Off_Code"]);
                            objweek.Weekend_Off_Name = sqldataReader["Weekend_Off_Name"].ToString();
                            lstWeekendGroups.Add(objweek);
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
            return lstWeekendGroups;
        }


        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> GetWeekendGroupDefinerReport(string companyCode, int weekEndGroupCode)
        {
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstWeekendGroups = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_hdGetWeekendGroupDefiner + " '" + companyCode + "','" + weekEndGroupCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendGroupModel objweek = new MVCModels.HiDoctor_Master.WeekendGroupModel();
                            objweek.Year = Convert.ToInt32(sqldataReader["Year"]);
                            objweek.Date = sqldataReader["Date"].ToString();
                            objweek.Day = sqldataReader["Date_Name"].ToString();
                            lstWeekendGroups.Add(objweek);
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
            return lstWeekendGroups;
        }
        public List<MVCModels.HiDoctor_Master.RegionModel> GetMappedRegionsByScheme(string companyCode, string schemeCode)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETMAPPEDREGIONBYSCHEME + " '" + companyCode + "','" + schemeCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegions(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETREGION + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            objRegion.Region_Type_Code = sqldataReader["Region_Type_Code"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetChildRegions(string companyCode)
        {
            string regionCode = string.Empty;
            regionCode = _objCurInfo.GetRegionCode();

            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETCHILDREGIONS + " '" + companyCode + "'," + "'" + regionCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            objRegion.Region_Type_Code = sqldataReader["Region_Type_Code"].ToString();
                            objRegion.label = sqldataReader["Region_Name"].ToString();
                            objRegion.value = sqldataReader["Region_Code"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetChildRegionsWithDivision(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_hdGetChildRegionWithDivisionName + " '" + companyCode + "','" + regionCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            objRegion.Division_Code = sqldataReader["Division_Code"].ToString();
                            objRegion.Division_Name = sqldataReader["Division_Name"].ToString();
                            lstRegion.Add(objRegion);
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
            return lstRegion;
        }

        public List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> GetWeekendDaysForARegion(string companyCode, string regionCode, string fromDate, string toDate)
        {
            List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> ltweekends = new List<MVCModels.HiDoctor_Master.WeekendDaysForARegion>();
            _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetWeekendDatesMappedForRegion);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.Date, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.Date, 10, toDate);


                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendDaysForARegion objWeekends = new MVCModels.HiDoctor_Master.WeekendDaysForARegion();
                            objWeekends.Weekend_Date = sqldataReader["Weekend_Day"].ToString();

                            ltweekends.Add(objWeekends);
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
            return ltweekends;
        }

        public List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> GetWeekendDaysFormappedRegion(string companyCode, string regionCode, string fromDate, string toDate)
        {
            List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> ltweekends = new List<MVCModels.HiDoctor_Master.WeekendDaysForARegion>();
            _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_GETWEEKENDDAYSFORMAPPEDREGON);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.Date, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.Date, 10, toDate);


                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendDaysForARegion objWeekends = new MVCModels.HiDoctor_Master.WeekendDaysForARegion();
                            objWeekends.Weekend_Date = sqldataReader["Weekend_Day"].ToString();

                            ltweekends.Add(objWeekends);
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
            return ltweekends;
        }

        public int  DeleteWeekend(string companyCode,int Year,string Date,string User_Code)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@Year", Year);
                    p.Add("@Date", Date);
                    p.Add("@User_Code", User_Code);
                    
                    result = connection.Execute(Sp_HD_WeekendGroup_Delete, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int ManualInsertWeekEnd(string companyCode, string weekEndGroupCode, string Date)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@weekEndGroupCode", weekEndGroupCode);
                    p.Add("@Date", Date);

                    result = connection.Execute(Sp_HD_Manual_WeekendInsert, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        #endregion WeekEnd Group

        #region Region Bulk Insert using Batch Processing
        public void RegionMasterBulkInsert(string subdomain, string company_Code, Guid BP_Id, string BP_Type, string uploadedFileName,
            string userCode, DataTable dt, string stagingTableName, string updatedBy)
        {
            try
            {
                _objSPData = new SPData();
                string result = _objSPData.BatchProcessingBulkInsert(subdomain, company_Code, dt, BP_Id, stagingTableName);
                if (result.Length == 0)
                {
                    SqlCommand command = new SqlCommand(SP_HDINSERTREGIONMASTERSTAGING);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                    _objSPData.AddParamToSqlCommand(command, "@BP_Id", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, BP_Id);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                    _objSPData.AddParamToSqlCommand(command, "@Uploaded_File_Name", ParameterDirection.Input, SqlDbType.NVarChar, 500, uploadedFileName);
                    _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.NVarChar, 500, updatedBy);
                    _objSPData.AddParamToSqlCommand(command, "@BP_Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, BP_Type);
                    _objData.OpenConnectionAsync(subdomain);
                    _objData.ExecuteNonQueryAsync(command);
                }
                else
                {
                    _objSPData.InsertBatchProcessingHeader(subdomain, company_Code, BP_Id, uploadedFileName, BP_Type, userCode, "FAILED", result);
                }
            }
            catch
            {
                throw;
            }
        }
        #endregion Region Bulk Insert using Batch Processing

        #region SFC Region Excel Upload
        public string SFCBulkCopy(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Region_Name", "Region_Name");
                        copy.ColumnMappings.Add("From_Place", "From_Region_Name");
                        copy.ColumnMappings.Add("To_Place", "To_Region_Name");
                        copy.ColumnMappings.Add("Distance", "Distance");
                        copy.ColumnMappings.Add("Amount", "Fare_Amount");
                        copy.ColumnMappings.Add("Travel_Mode", "Travel_Mode");
                        copy.ColumnMappings.Add("Category", "Category_Name");
                        copy.ColumnMappings.Add("SFC_MIN_Count", "Minimum_Count");
                        copy.ColumnMappings.Add("SFC_MAX_Count", "SFC_Visit_Count");
                        copy.ColumnMappings.Add("Date_From", "Date_From");
                        copy.ColumnMappings.Add("Date_To", "Date_To");
                        copy.DestinationTableName = TBL_SFA_REGION_DISTANCE_STAGING;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public DataSet GetActiveProducts(string companyCode)
        {
            DataSet Ds = new DataSet();
            SPData _objSPData = new SPData();
            try
            {
                _objData.OpenConnection();
                {
                    Ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HD_GetActiveProduct + "'" + companyCode + "'");
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
            return Ds;
        }

        public string InwardBulkCopy(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Employee_Number", "Employee_Number");
                        //copy.ColumnMappings.Add("Product_Type", "Product_Type");
                        //copy.ColumnMappings.Add("Product_Name", "Product_Name");
                        copy.ColumnMappings.Add("Product_Ref_Key", "Product_Ref_Key");
                        copy.ColumnMappings.Add("Batch_Number", "Batch_Number");
                        copy.ColumnMappings.Add("Upload_Quantity", "Upload_Qty");
                        copy.ColumnMappings.Add("Delivery_Challan", "Delivery_Challan");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("Created_Date", "Created_Date");
                        copy.ColumnMappings.Add("BP_Status", "BP_Status");
                        copy.DestinationTableName = tbl_Inward_Bulk_Upload_Staging;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertSFCBulkUpload(string companyCode, string guid, string fileName, string uploadedBy, string bpType, string subDomain,
            string ipAddress, string hostName)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTSFCFROMSTAGINGTOMASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);
                _objSPData.AddParamToSqlCommand(command, "@IPAddress", ParameterDirection.Input, SqlDbType.NVarChar, 50, ipAddress);
                _objSPData.AddParamToSqlCommand(command, "@HostName", ParameterDirection.Input, SqlDbType.NVarChar, 200, hostName);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            //string result = string.Empty;
            //try
            //{
            //    using (IDbConnection connection = IDbOpenConnection())
            //    {
            //        var parameter = new DynamicParameters();
            //        parameter.Add("@CompanyCode", companyCode, dbType: DbType.String, direction: ParameterDirection.Input);
            //        parameter.Add("@Guid", guid, dbType: DbType.String, direction: ParameterDirection.Input);
            //        parameter.Add("@FileName", fileName, dbType: DbType.String, direction: ParameterDirection.Input);
            //        parameter.Add("@UploadedBy", uploadedBy, dbType: DbType.String, direction: ParameterDirection.Input);
            //        parameter.Add("@BPType", bpType, dbType: DbType.String, direction: ParameterDirection.Input);
            //        parameter.Add("@Result", dbType: DbType.String, size: 500, direction: ParameterDirection.Output);
            //        connection.Execute(SP_HDINSERTSFCFROMSTAGINGTOMASTER, parameter, commandType: CommandType.StoredProcedure);
            //        result = parameter.Get<string>("@Result");
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}

            return result;
        }
        #endregion SFC Region Excel Upload

        public string InsertInwardBulkUpload(string CompanyCode, string guid, string fileName, string uploadedBy, string bpType, string SubDomain)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(sp_hd_insertInwardBulkfromstagingtomaster);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                // _objData.OpenConnectionAsync(SubDomain);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
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

        public IEnumerable<RegionLockMappingModel> GetRegionLockMappingList(string company_Code)
        {
            IEnumerable<RegionLockMappingModel> lstRegionLockMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);

                    lstRegionLockMapping = connection.Query<RegionLockMappingModel>(SP_HDGETACTIVEREGIONLOCKMAPPING, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstRegionLockMapping;
        }
        public int UnmapRegionslock(string Regioncode, string UserName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Regioncode", Regioncode);
                    p.Add("@UserName", UserName);
                    result = connection.Execute(SP_HD_UnMapRegionlock, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
  public List<RegionLockMappingModel> GetMappedRegion(string CompanyCode)
        {
            List<RegionLockMappingModel> lstRegDet = new List<RegionLockMappingModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", CompanyCode);

                    lstRegDet = connection.Query<RegionLockMappingModel>(SP_HDGetActiveRegionLockMapping, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegDet;

        }
        SPData _ObjSPData = new SPData();
        private Data _OjData = new Data();
        public bool InsertRegionLockMapping(DataTable dtRegCodes)
        {

            bool result = false;
            try
            {
                string cmdTxt = "SP_HD_InsertMappedRegionlock";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //using (IDbConnection connection = IDbOpenConnection())
                //{
                //    var p = new DynamicParameters();
                //    p.Add("@UserName", UserName);
                //    result=connection.Execute(SP_HD_InsertMappedRegion, p, commandType: CommandType.StoredProcedure);
                //    connection.Close();
                //}

                if (dtRegCodes.Rows.Count == 0)
                {
                    _ObjSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RegionLockMapping", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_RegionLockMapping");
                }
                else
                {
                    _ObjSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RegionLockMapping", ParameterDirection.Input, SqlDbType.Structured, dtRegCodes, "TVP_RegionLockMapping");
                }
                _OjData.OpenConnection();
                _OjData.ExecuteNonQuery(command);
                result = true;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //public int InsertRegionLockMapping(List<RegionLockMappingModel> lstRegionLockMapping)
        //{
        //    int rowsAffected = 0;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            StringBuilder QueryBuilder = new StringBuilder();
        //            IDbTransaction trans = connection.BeginTransaction();
        //            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
        //            string UserName = string.Empty;
        //            UserName = objCurInfo.GetUserName();
        //            string CurDate = System.DateTime.Now.ToString("MM/dd/yyyy");
        //            // Insert.
        //            QueryBuilder.Append("SELECT COUNT(1) FROM tbl_SFA_Region_Lock_Mapping");
        //            int count = connection.Query<int>(QueryBuilder.ToString(), transaction: trans).Single();
        //            if (count > 0)
        //            {
        //                QueryBuilder.Clear();
        //                QueryBuilder.Append("DELETE FROM tbl_SFA_Region_Lock_Mapping ");
        //                rowsAffected = connection.Execute(QueryBuilder.ToString(), transaction: trans);
        //                QueryBuilder.Clear();
        //                if (rowsAffected > 0)
        //                {
        //                    QueryBuilder.Append("INSERT INTO tbl_SFA_Region_Lock_Mapping ");
        //                    QueryBuilder.Append("(Company_Code, Lock_Code, Region_Type_Code, Region_Code, Effective_From,Created_DateTime,Created_By, Effective_To, Record_Status) ");
        //                    QueryBuilder.Append("VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Region_Lock_Mapping,@Region_Type_Code,@Region_Code,");
        //                    QueryBuilder.Append("@Effective_From,'" + CurDate + "','" + UserName + "' ,@Effective_To,1)");
        //                    rowsAffected = connection.Execute(QueryBuilder.ToString(), lstRegionLockMapping, transaction: trans);
        //                }
        //            }
        //            else
        //            {
        //                QueryBuilder.Clear();
        //                QueryBuilder.Append("INSERT INTO tbl_SFA_Region_Lock_Mapping ");
        //                QueryBuilder.Append("(Company_Code, Lock_Code, Region_Type_Code, Region_Code, Effective_From,Created_DateTime,Created_By, Effective_To, Record_Status) ");
        //                QueryBuilder.Append("VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Region_Lock_Mapping,@Region_Type_Code,@Region_Code,");
        //                QueryBuilder.Append("@Effective_From,'" + CurDate + "','" + UserName + "',@Effective_To,1)");
        //                rowsAffected = connection.Execute(QueryBuilder.ToString(), lstRegionLockMapping, transaction: trans);
        //            }
        //            trans.Commit();
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return rowsAffected;
        //}
        public DataSet GetRegionsforPrimarySales(string company_Code)
        {
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(company_Code);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONSFORPRIMARYSALES + " '" + company_Code + "'");
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
            return ds;
        }

        #region holiday master
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetMappedHolidayDetails(string company_Code, string regionCodes,
            string year, string SearchKey, int pageNumber, bool excelDownload, int PAGESIZE, ref int totalPageCount)
        {
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@Region_Codes", regionCodes);
                    p.Add("@Year", year);
                    p.Add("@PageNumber", pageNumber);
                    p.Add("@PageSize", PAGESIZE);
                    p.Add("@IsAllRecordsRequired", excelDownload);
                    p.Add("@HolidayName", SearchKey);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstHoliday = connection.Query<MVCModels.HiDoctor_Master.HolidayModel>(SP_HDGETHOLIDAYDETAILSBYREGIONS, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstHoliday;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidayDetailsByDate(string company_Code, string Holiday_Date)
        {
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@Holiday_Date", Holiday_Date);
                    lstHoliday = connection.Query<MVCModels.HiDoctor_Master.HolidayModel>(SP_HDGETHOLIDAYDETAILSBYDATE, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstHoliday;
        }

        public int InsertHolidayMaster(List<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday, string mode, string companyCode, string Old_HolidayDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode)
                    {
                        const string query = "INSERT INTO tbl_SFA_Holiday_Master(Company_Code,Holiday_Code,Holiday_Name,Holiday_Date,Region_Type_Code, " +
                                             "Region_Code,Holiday_Status,Created_By,Created_DateTime,Holiday_Code_Num) " +
                                             "VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Holiday_Master,@Holiday_Name,@Holiday_Date,@Region_Type_Code, " +
                                             "@Region_Code,@Holiday_Status,@Created_By,@Created_DateTime,NEXT VALUE FOR SEQ_tbl_SFA_Holiday_Master)";
                        rowsAffected = connection.Execute(query, lstHoliday, transaction: trans);
                    }
                    else if ("EDIT" == mode.ToUpper())
                    {
                        string query = "UPDATE tbl_SFA_Holiday_Master SET Holiday_Date = @Holiday_Date,Holiday_Name = @Holiday_Name, " +
                                             "Updated_By = @Updated_By,Updated_DateTime =@Updated_DateTime WHERE Region_Code = @Region_Code " +
                                             "AND Holiday_Date='" + Old_HolidayDate + "' AND  Company_Code = @Company_Code ";
                        rowsAffected = connection.Execute(query, lstHoliday, transaction: trans);
                    }
                    else if ("SINGLE_EDIT" == mode.ToUpper())
                    {
                        const string query = "UPDATE tbl_SFA_Holiday_Master SET Holiday_Status = '1',Updated_By = @Updated_By, " +
                                            "Updated_DateTime = @Updated_DateTime WHERE Region_Code = @Region_Code AND Holiday_Code = @Holiday_Code " +
                                            "AND  Company_Code = @Company_Code";
                        rowsAffected = connection.Execute(query, lstHoliday, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string updateQry = "UPDATE tbl_SFA_Holiday_Master SET Holiday_Name = @Holiday_Name, " +
                                                "Updated_By = @Updated_By,Updated_DateTime =@Updated_DateTime WHERE  Region_Code = @Region_Code " +
                                                "AND CONVERT(DATE,Holiday_Date) = @Holiday_Date AND  Company_Code = @Company_Code ";
                            rowsAffected = connection.Execute(updateQry, lstHoliday, transaction: trans);
                        }
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Holiday_Master SET Holiday_Status = @Holiday_Status,Updated_By = @Updated_By, " +
                                             "Updated_DateTime = @Updated_DateTime WHERE  Region_Code = @Region_Code AND Holiday_Code = @Holiday_Code " +
                                             "AND Company_Code = @Company_Code ";
                        rowsAffected = connection.Execute(query, lstHoliday, transaction: trans);
                    }
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("mode", mode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetHolidayMappedRegions(string company_Code)
        {
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    lstRegions = connection.Query<MVCModels.HiDoctor_Master.RegionModel>(SP_HDGETHOLIDAYMAPPEDREGIONS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstRegions;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetHolidayUnMappedRegions(string company_Code)
        {
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    lstRegions = connection.Query<MVCModels.HiDoctor_Master.RegionModel>(SP_HDGETHOLIDAYUNMAPPEDREGIONS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstRegions;
        }

        public int HolidayInheritance(string companyCode, string sourceRegion, List<MVCModels.HiDoctor_Master.RegionModel> lstRegion, string userCode, string createdDate)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    string query = "INSERT INTO tbl_SFA_Holiday_Master(Company_Code,Holiday_Code,Holiday_Name,Holiday_Date,Region_Type_Code, " +
                                         "Region_Code,Holiday_Status,Holiday_Region_Flag,Ref_Key1,Ref_Key2,Created_By,Created_DateTime,Holiday_Code_Num) " +
                                         "SELECT Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Holiday_Master,Holiday_Name,Holiday_Date,Region_Type_Code, " +
                                         "@Region_Code,Holiday_Status,Holiday_Region_Flag,Ref_Key1,Ref_Key2,'" + userCode + "','" + createdDate + "',NEXT VALUE FOR SEQ_tbl_SFA_Holiday_Master " +
                                         "FROM tbl_SFA_Holiday_Master WHERE Company_Code= '" + companyCode + "' AND Region_Code='"
                                         + sourceRegion + "' AND Holiday_Status='0' AND  " +
                                         "CONVERT(DATE,Holiday_Date) >=CONVERT(DATE, GETDATE()) ";
                    rowsAffected = connection.Execute(query, lstRegion, transaction: trans);
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sourceRegion", sourceRegion);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }


        #endregion holiday master

        #region fullindex migration
        public DataSet GetAllRegionsForMigration(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    dsRegion = _objData.getDataSet("" + EXEC + "  " + SP_HDGETALLREGIONSFORMIGRATION + "  '" + companyCode + "'");
                    dsAllRegions = dsRegion.Clone();
                    dsAllRegions.Tables[0].Columns.Add("Created_By", typeof(String));
                    dsAllRegions.Tables[0].Columns.Add("GUID", typeof(String));
                    dsAllRegions.Tables[0].Columns.Add("Display_Order", typeof(Int32));
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return dsRegion;
        }

        public DataSet GetRegionHierarchyDataset(string companyCode, string regionCode, string enteredBy, string Guid)
        {
            DataRow[] dr;
            dr = dsRegion.Tables[0].AsEnumerable().Where(c => c["Under_Region_Code"].ToString() == regionCode).ToArray();
            DataRow[] temp;
            if (dr.Length > 0)
            {
                foreach (DataRow drr in dr)
                {

                    tCode = drr["Under_Region_Code"].ToString();
                    sCode = drr["Region_Code"].ToString();
                    DataRow drTemp = dsAllRegions.Tables[0].NewRow();
                    drTemp["Under_Region_Code"] = drr["Under_Region_Code"].ToString();
                    drTemp["Region_Code"] = drr["Region_Code"].ToString();
                    drTemp["Region_Id"] = drr["Region_Id"].ToString();
                    drTemp["Under_Region_Id"] = drr["Under_Region_Id"].ToString();
                    drTemp["Created_By"] = enteredBy;
                    drTemp["GUID"] = Guid;
                    dsAllRegions.Tables[0].Rows.Add(drTemp);
                    dsAllRegions.AcceptChanges();
                    if (tCode != sCode)
                    {
                        GetRegionHierarchyDataset(companyCode, sCode, enteredBy, Guid);
                    }
                }
            }
            return dsAllRegions;
        }
        public string BulkRegionTempInsert(string companyCode, DataTable dt, string mode)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Under_Region_Code", "Under_Region_Code");
                        copy.ColumnMappings.Add("Region_Code", "Region_Code");
                        copy.ColumnMappings.Add("Region_Id", "Region_Id");
                        copy.ColumnMappings.Add("Under_Region_Id", "Under_Region_Id");
                        if (mode.ToUpper() == "MIGRATION")
                        {
                            copy.ColumnMappings.Add("Seq_index", "Seq_index");
                        }
                        copy.ColumnMappings.Add("Full_index", "Full_index");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Display_Order", "Display_Order");
                        copy.DestinationTableName = "tbl_SFA_Region_Master_Temp";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateRegionIndexFromTemptoRegionMaster(string companyCode, string mode, string guid)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDUPDATEREGIONINDEXFROMTEMPTOREGIONMASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.VarChar, 200, guid);
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

        public int DeleteRegionsFromTemp(string companyCode, string guid, string userCode)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "DELETE FROM tbl_SFA_Region_Master_Temp WHERE Company_Code='" + companyCode + "' and GUID='"
                                    + guid + "' and Created_By='" + userCode + "'";
                    rowsAffected = connection.Execute(query);
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        #endregion full index migration
        public int UpdateCustomerPriceGroup(string companyCode, List<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer, string regionCode, string entity)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "UPDATE tbl_SFA_Customer_Master SET Price_Group_Code=NULL " +
                                   "WHERE Customer_Entity_Type='" + entity + "' AND Region_Code='" + regionCode + "'";
                    rowsAffected = connection.Execute(query, transaction: trans);
                    rowsAffected = 0;
                    query = "UPDATE tbl_SFA_Customer_Master SET Price_Group_Code=@Price_Group_Code " +
                                  "WHERE Customer_Code=@Customer_Code AND Region_Code=@Region_Code";
                    rowsAffected = connection.Execute(query, lstCustomer, transaction: trans);
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }

        #region TPLockManualRelease
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidaysEnteredInLast15Days(string company_Code)
        {
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    lstHoliday = connection.Query<MVCModels.HiDoctor_Master.HolidayModel>(SP_hdGetHolidaysEnteredInLast15Days, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstHoliday;
        }
        public string UpdateTPLockManuelRelease(string companyCode, string holidayDates, string region_Code, string updatedBy)
        {
            try
            {
                string result = "";
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@HolidayDates", holidayDates);
                    p.Add("@Region_Code", region_Code);
                    p.Add("@UpdatedBy", updatedBy);
                    p.Add("@Result", dbType: DbType.String, size: 200, direction: ParameterDirection.Output);

                    connection.Execute(SP_hdUpdateTPLockManuelRelease, p, commandType: CommandType.StoredProcedure);

                    result = p.Get<string>("@Result");

                    if (result == "1")
                    {
                        result = "SUCCESS";
                    }
                    else if (result == "2")
                    {
                        result = "LOCKED";
                    }
                }

                return result;
            }
            catch
            {
                throw;
            }
        }
        #endregion TPLockManualRelease

        #region Region Tree -New Generation
        /// <summary>
        /// Get Users by User Name
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionName"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetRegionsbyRegionName(string companyCode, string regionName, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstRegion = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionName", regionName);
                    p.Add("@RegionCode", regionCode);
                    lstRegion = connection.Query<MVCModels.HiDoctor_Master.RegionModel>(SP_HD_RM_GETREGIONSBYREGIONNAME, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstRegion;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return lstRegion;
        }

        /// <summary>
        /// Get immediate child Regions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetImmediateChildRegionForTree(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.RegionModel>(SP_HD_UM_GETIMMEDIATECHILDREGIONS, p, commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return lstUser;
        }
        #endregion Region Tree -New Generation


        #region Holiday BULK Uploda
        public string HolidayBulkCopy(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Region_Name", "Region_Name");
                        copy.ColumnMappings.Add("Holiday_Date", "Holiday_Date");
                        copy.ColumnMappings.Add("Holiday_Name", "Holiday_Name");
                        copy.DestinationTableName = TBL_SFA_HOLIDAY_STAGING;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertHolidayBulkUpload(string companyCode, string guid, string fileName, string uploadedBy, string bpType)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_INSERTHOLIDAYFROMSTAGINGTOMASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);
                // _objSPData.AddParamToSqlCommand(command, "@IPAddress", ParameterDirection.Input, SqlDbType.NVarChar, 50, ipAddress);
                //_objSPData.AddParamToSqlCommand(command, "@HostName", ParameterDirection.Input, SqlDbType.NVarChar, 200, hostName);
                //command.Parameters["@Result"].Direction = ParameterDirection.Output;
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                //returnValue.Value = "";
                command.Parameters.Add(returnValue);
                //_objData.OpenConnectionAsync(subDomain);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
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

        public List<MVCModels.HiDoctor_Master.ExcelRegionMaster> GetRegionFullTreeDetails(string companycode)
        {
            var lsRegionDetails = new List<MVCModels.HiDoctor_Master.ExcelRegionMaster>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@CompanyCode", companycode);
                    lsRegionDetails = connection.Query<MVCModels.HiDoctor_Master.ExcelRegionMaster>(SP_HDGETREGIONFULLTREEDETAILS, param, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lsRegionDetails;
        }
        #endregion
        public List<MapConfigDetails> GetCurrentMapDetails(string CompanyCode)
        {
            List<MapConfigDetails> lstMap = new List<MapConfigDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", CompanyCode);
                    lstMap = connection.Query<MapConfigDetails>("USP_HD_GetMapConfigDetails", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstMap;
        }
    }
}
