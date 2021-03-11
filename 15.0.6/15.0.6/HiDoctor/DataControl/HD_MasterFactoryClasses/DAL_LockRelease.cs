using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_LockRelease : DapperRepository
    {
        SPData _objSPData = new SPData();
       
        private Data _objData = new Data();
        private SPData _ObjSPData = new SPData();

        public List<LockRelease.RegionName> GetAllRegionName(string subDomainName, string Company_Code, string Region_Code)
        {
            List<LockRelease.RegionName> lst = new List<LockRelease.RegionName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    lst = connection.Query<LockRelease.RegionName>("Sp_Hd_GetRegionNameforLockDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public List<LockRelease.LockedDetails> GetAllLockedDetails(string subDomainName, string Region_Code)
        {
            List<LockRelease.LockedDetails> lst = new List<LockRelease.LockedDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    //p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    lst = connection.Query<LockRelease.LockedDetails>("Sp_Hd_GetLockDetailsforRegion", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public int UpdateLockStatus(LockRelease.Updatelist _ObjData, DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            
            try
            {

                string cmdTxt = "SP_HD_SS_LockStatus_Update";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                
                //_objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Region_Code);

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@subDomainName", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.subDomainName);
                _objSPData.AddParamToSqlCommand(command, "@LockType", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.LockType);
                _objSPData.AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.RegionName);
                //_objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Year);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Update_Lock_Details", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_SS_Update_Lock_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Update_Lock_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Update_Lock_Details");
                }
                //_objData.OpenConnection();
                _objData.ExecuteNonQuery(command, _ObjData.subDomainName);
                result = Convert.ToInt32(command.Parameters["@Result"].Value);

            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<LockRelease.StockistDetails> GetStockistDetails(string subDomainName, string Region_Code, int Month, int Year)
        {
            List<LockRelease.StockistDetails> lst = new List<LockRelease.StockistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Region_Code", Region_Code);
                    
                    p.Add("@Year", Year);
                    p.Add("@Month", Month);
                    lst = connection.Query<LockRelease.StockistDetails>("Sp_Hd_GetAllStockistDtails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }

        public List<LockRelease.ReleasedDetails> GetAllReleasedDetails(string subDomainName, string Region_Code, string FromDate, string ToDate)
        {
            List<LockRelease.ReleasedDetails> lst = new List<LockRelease.ReleasedDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@FromDate", FromDate);
                    p.Add("@ToDate", ToDate);
                    lst = connection.Query<LockRelease.ReleasedDetails>("Sp_Hd_GetReleasedDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public List<LockRelease.RegionName> GetActualRegionName(string subDomainName, string Company_Code, string Region_Code, string login_Region)
        {
            List<LockRelease.RegionName> lst = new List<LockRelease.RegionName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@login_Region", login_Region);
                    lst = connection.Query<LockRelease.RegionName>("Sp_Hd_GetReportingRegionName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
       
    }
}
