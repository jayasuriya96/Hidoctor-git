using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;
using static MVCModels.PSAndSSSalesEntry;
using Dapper;
using System.Data.SqlClient;
using static MVCModels.PSAndSSSalesEntry.SalesDetails;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DL_PSAndSSSalesEntry : DapperRepository
    {

        SPData _objSPData = new SPData();
        public PSAndSSSalesEntry.PPAndSS PPAndSS;
        private Data _objData = new Data();
        private SPData _ObjSPData = new SPData();

        //SPData _objSPData = new SPData();

        //public PSAndSSSalesEntry.PPAndSS PPAndSS;
        //private Data _objData = new Data();
        //private SPData _ObjSPData = new SPData();

        public List<ProductDeatils> GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType, string subDomainName)
        {
            List<ProductDeatils> lstEnteredData = new List<ProductDeatils>();
            try
            {
                using (IDbConnection conn = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@EntityType", entityType);
                    p.Add("@SelectedMappingCode", selectedMappingCode);
                    p.Add("@MappingType", mappingType);
                    lstEnteredData = conn.Query<ProductDeatils>("SP_HD_EntitySalesEnteredDatePrefill", p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstEnteredData;
        }
        public List<PSAndSSSalesEntry.RegionName> GetAllRegionName(string Region_Code, string subDomainName)
        {
            List<PSAndSSSalesEntry.RegionName> lst = new List<PSAndSSSalesEntry.RegionName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    lst = connection.Query<PSAndSSSalesEntry.RegionName>("Sp_Hd_GetBatchRegionName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }


        public List<HSProductName> GetAllProductSales(string Region_Code, string subDomainName, string TypeOfMapping)
        {
            List<HSProductName> lst = new List<HSProductName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    //p.Add("@subDomainName", subDomainName);
                    //p.Add("@TypeOfMapping", TypeOfMapping);
                    lst = connection.Query<HSProductName>("Sp_Hd_PP_SSGetSalesProductName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }

            catch (Exception ex)
            {

                throw;
            }
            return lst;
        }
        public List<ConfigDetails> GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            List<ConfigDetails> lstconfig = new List<ConfigDetails>();
            try
            {
                using (IDbConnection conn = IDbOpenConnectionCompanyWise(subdomain))
                {
                    var p = new DynamicParameters();
                    p.Add("@Config_Key", Config_Key);
                    p.Add("@Possible_Values", Possible_Values);
                    p.Add("@Config_Value", Config_Value);
                    p.Add("@Type", Type);
                    p.Add("@companycode", companycode);
                    p.Add("@subdomain", subdomain);
                    lstconfig = conn.Query<ConfigDetails>("SP_HD_EntitySalesConfig", p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstconfig;
        }
        public List<PSAndSSSalesEntry.CustomerDetails> GetCustomerDetails(string RegionCode, string Value, string subDomainName, string SDate, int month, int year)
        {
            List<PSAndSSSalesEntry.CustomerDetails> lst = new List<PSAndSSSalesEntry.CustomerDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", RegionCode);
                    p.Add("@Value", Value);
                    p.Add("@Date", SDate);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lst = connection.Query<PSAndSSSalesEntry.CustomerDetails>("Sp_hd_SS_PS_GetCustomerDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }

        public int GetInsertProductSales(PSAndSSSalesEntry.PPAndSS _ObjData, DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            //List<Batch.ProductInsert> obj = JsonConvert.DeserializeObject<List<Batch.ProductInsert>>(_batch.Product).ToList();
            try
            {

                string cmdTxt = "SP_HD_PP_SSSalesInsert";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.EntityCode);
                //_objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Entity);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Year);
                _objSPData.AddParamToSqlCommand(command, "@week", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.week);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.DateTime, 30, _ObjData.Date);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityName", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.EntityName);
                _objSPData.AddParamToSqlCommand(command, "@TypeOfMapping", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.TypeOfMapping);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PP_SS_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_PP_SS_Insert_Products");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PP_SS_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PP_SS_Insert_Products");
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
        public List<PSAndSSSalesEntry.ProductDeatils> GetAllEntityProduct(string Region_Code, string subDomainName)
        {
            List<PSAndSSSalesEntry.ProductDeatils> lst = new List<PSAndSSSalesEntry.ProductDeatils>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);

                    lst = connection.Query<PSAndSSSalesEntry.ProductDeatils>("Sp_hd_SS_PPGetAllEntityProductDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public string GetEntitySalesMob(string User_Code, string subDomainName, string privilege_Name, string default_value)
        {
            string result = "";

            //List<PPAndSS> lst = new List<PPAndSS>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@User_Code", User_Code);
                    par.Add("@Default_Value", default_value);
                    par.Add("@Privilege_Name", privilege_Name);
                    result = connection.Query<string>("Sp_Hd_Get_ENTITY_Sales_Privilage", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public AllSalesDetails GetAllSalesDetails(string Region_Code, string subDomainName, string Entity_Type, int Month, int Year)
        {
            // List<PSAndSSSalesEntry.SalesDetails> lst = new List<PSAndSSSalesEntry.SalesDetails>();
            AllSalesDetails Sdetails = new AllSalesDetails();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@Entity_Type", Entity_Type);
                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    var lst = connection.QueryMultiple("Sp_hd_GetAll_PP_SS_SalesDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure);

                    Sdetails.lstsales = lst.Read<PSAndSSSalesEntry.SalesDetails>().ToList();
                    Sdetails.lstdetails = lst.Read<PSAndSSSalesEntry.Details>().ToList();
                    connection.Close();
                    return Sdetails;
                }

            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public int GetUpdateProductSales(PSAndSSSalesEntry.PPAndSS _ObjData, DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            //List<Batch.ProductInsert> obj = JsonConvert.DeserializeObject<List<Batch.ProductInsert>>(_batch.Product).ToList();
            try
            {





                string cmdTxt = "SP_HD_PP_SSSales_Update";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.EntityCode);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Entity);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Year);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.DateTime, 30, _ObjData.Date);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityName", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.EntityName);
                _objSPData.AddParamToSqlCommand(command, "@TypeOfMapping", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.TypeOfMapping);
                _objSPData.AddParamToSqlCommand(command, "@Sales_Id", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Sales_Id);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PP_SS_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_PP_SS_Insert_Products");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PP_SS_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PP_SS_Insert_Products");
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
        public PPAndSSDetails GetAllEntityDetails(string Region_Code, string EntityCode, string Entity, int Month, int Year, string TypeOfMapping, string subDomainName)
        {

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@EntityCode", EntityCode);
                    p.Add("@Entity", Entity);
                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    p.Add("@TypeOfMapping", TypeOfMapping);
                    var lst = connection.QueryMultiple("Sp_hd_GetPS_SSDetails", p, commandType: CommandType.StoredProcedure);
                    PPAndSSDetails Sdetails = new PPAndSSDetails();
                    Sdetails.Sales = lst.Read<PSAndSSSalesEntry.SalesDetails>().ToList();
                    Sdetails.Release = lst.Read<PSAndSSSalesEntry.ReleaseDetails>().ToList();
                    connection.Close();
                    return Sdetails;
                }

            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public int GetEntityStatusChange(PSAndSSSalesEntry.PPAndSS _ObjData)
        {
            int result = 1;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_ObjData.subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@User_Code", _ObjData.User_Code);
                    par.Add("@Sales_Id", _ObjData.Sales_Id);
                    par.Add("@Remark", _ObjData.Remark);
                    result = connection.Query<int>("Sp_hd_PP_SSStatusChange", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int GetMultipleEntityStatusChange(DataTable dtTable, PSAndSSSalesEntry.PPAndSS _ObjData)
        {
            int rowsAffected = 0;

            try
            {
                string cmdTxt = "Sp_hd_PS_SSEntityStatusMultipleChange";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //   _objSPData.AddParamToSqlCommand(command, "@value", ParameterDirection.Input, SqlDbType.VarChar, 10, value);
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PS_SS_Sales", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_PS_SS_Sales");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PS_SS_Sales", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PS_SS_Sales");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command, _ObjData.subDomainName);
                rowsAffected = 1;
                //connection.Close();

            }
            catch (Exception ex)
            {
                throw;
            }
            return rowsAffected;
        }
    }



}