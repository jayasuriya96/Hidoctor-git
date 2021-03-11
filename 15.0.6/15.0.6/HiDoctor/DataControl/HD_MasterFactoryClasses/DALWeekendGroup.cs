using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class DALWeekendGroup
    {
        DataControl.Data _objData = new DataControl.Data();
        DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
        const string SP_HDGETWEEKENDGROUPNAME = "SPhd_GetWeekEndOffHeader";
        const string SP_HDWEEKENDGROUPREGIONMAPPING = "SP_hdRegionWeekengGroupMapping";
        const string SP_HDGETMAPPINGREGION = "SP_hdGETWeekengMappingRegionscode";
        const string SP_HDWEEKENDGROUPREGIONUPDATE = "SP_hdGETRegionWeeKendUpdate";
        const string EXEC = "EXEC";
        SqlDataReader sqldataReader;




        public List<MVCModels.HiDoctor_Master.WeekendGroup> GetWeekendGroupHeader()
        {
            string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.WeekendGroup> lstWeekendGroup = new List<MVCModels.HiDoctor_Master.WeekendGroup>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETWEEKENDGROUPNAME + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.WeekendGroup objWeekendGroup = new MVCModels.HiDoctor_Master.WeekendGroup();
                            objWeekendGroup.Weekend_Off_Code = sqldataReader["Weekend_Off_Code"].ToString();
                            objWeekendGroup.Weekend_Off_Name = sqldataReader["Weekend_Off_Name"].ToString();
                            lstWeekendGroup.Add(objWeekendGroup);
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
            return lstWeekendGroup;
        }

        //RegionWeekendGroupMapping

        public string RegionWeekendGroupMapping(string weekendoffCode, string regionCodes, string effectiveFrom, string effectiveTo, string status)
        {
            SPData _objSPData = new SPData();
            string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDWEEKENDGROUPREGIONMAPPING);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@WeekendOffCode", ParameterDirection.Input, SqlDbType.VarChar, 30, weekendoffCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveTo);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);

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

        public List<MVCModels.HiDoctor_Master.WeekendGroup> GetMappingGroupHeader(string RegionCodes)
        {
            string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.WeekendGroup> lstWeekendGroup = new List<MVCModels.HiDoctor_Master.WeekendGroup>();
            if (RegionCodes != "")
            {
                try
                {
                    _objData.OpenConnection(companyCode);
                    {
                        using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETMAPPINGREGION + " '" + companyCode + "'" + "," + "'" + RegionCodes + "'"))
                        {
                            while (sqldataReader.Read())
                            {
                                MVCModels.HiDoctor_Master.WeekendGroup objWeekendGroup = new MVCModels.HiDoctor_Master.WeekendGroup();
                                objWeekendGroup.Region_Code = sqldataReader["Region_Code"].ToString();
                                lstWeekendGroup.Add(objWeekendGroup);
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
            }
            return lstWeekendGroup;
        }
        //Update the region mapping//
        public string RegionWeekendGroupMappingUpdate(string weekendOffCode, string regionCode, string effectiveFrom, string effectiveto, string status, string oldeffectiveFrom, string oldeffectiveto)
        {
            SPData _objSPData = new SPData();
            string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDWEEKENDGROUPREGIONUPDATE);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@WeekendOffCode", ParameterDirection.Input, SqlDbType.VarChar, 30, weekendOffCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveto);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);
                _objSPData.AddParamToSqlCommand(command, "@OldEffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, oldeffectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@OldEffectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, oldeffectiveto);
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


    }
}
