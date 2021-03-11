using DataControl.EnumType;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using MVCModels;
using Dapper;
using Microsoft.SqlServer.Server;

namespace DataControl
{
    public class DALDivision : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        private SqlDataReader sqlDataReader;
        #endregion Private Variables
        #region Constant Strings
        const string SP_HDGETALLDIVISIONS = "SP_hdGetAllDivisions";
        const string SP_HDGETDIVISIONENTITYDETAILS = "SP_hdGetDivisionEntityDetails ";
        const string SP_HDGETCHILDENTITYCODEINCLUESSELF = "SP_hdGetChildEntityCodeIncluesSelf";
        const string SP_HDGETDIVISIONSBYREGION = "SP_hdGetDivisionsByRegion";
        const string SP_HDGETDIVISIONSBYLOGGEDINUSER = "SP_hdGetDivisionsByloggedinUser";
        #endregion Private Variables
        #region Public Menthods
        public List<MVCModels.DivisionModel> GetDivisions(string companyCode)
        {
            List<MVCModels.DivisionModel> lstDivisions = new List<MVCModels.DivisionModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETALLDIVISIONS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader(command))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.DivisionModel _objDivision = new MVCModels.DivisionModel();
                        _objDivision.Division_Code = sqlDataReader["Division_Code"].ToString();
                        _objDivision.Division_Name = sqlDataReader["Division_Name"].ToString();
                        _objDivision.Lineofbussiness = sqlDataReader["Lineofbussiness"].ToString();
                        _objDivision.Record_Status = sqlDataReader["Record_Status"].ToString();
                        _objDivision.divisionline = sqlDataReader["Line_Of_Business"].ToString();
                        lstDivisions.Add(_objDivision);
                    }
                }
            }
            catch (Exception ex)
            {
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: null);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstDivisions;
        }
        public int InsertDivision(List<MVCModels.DivisionModel> lstDivision, string mode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("INSERT" == mode)
                    {
                        string query = "INSERT INTO tbl_SFA_Division_Master (Company_Code,Division_Code,Division_Name,Record_status,Created_Date,Created_By,Updated_By,Updated_Date,Line_Of_Business) " +
                                             "VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Division_Master,@Division_Name,@Record_Status,@Created_Date,@Created_By,@Updated_By,@Updated_Date,@divisionline)";
                        rowsAffected = connection.Execute(query, lstDivision);
                    }
                    else if ("EDIT" == mode.ToUpper())
                    {
                        string query = "UPDATE tbl_SFA_Division_Master SET Division_Name=@Division_Name,Updated_By=@Updated_By,Updated_Date=@Updated_Date,Line_Of_Business=@divisionline " +
                                             "WHERE Company_Code=@Company_Code AND Division_Code=@Division_Code";
                        rowsAffected = connection.Execute(query, lstDivision);
                    }
                    else
                    {
                        string query = "UPDATE tbl_SFA_Division_Master SET Record_status=@Record_Status,Updated_By=@Updated_By,Updated_Date=@Updated_Date " +
                                             "WHERE Company_Code=@Company_Code AND Division_Code=@Division_Code";
                        rowsAffected = connection.Execute(query, lstDivision);
                    }
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
        public int InsertDivisionEntityMapping(List<MVCModels.DivisionModel> lstDivision, string entityCode, string entityName, string companyCode, string userCode, string regionCode, string divisionCode)
        {
            int rowsAffected = 0;
            if (entityName == "PRODUCT")
            {
                IDbConnection connection = connection = IDbOpenConnection();
                IDbTransaction trans = connection.BeginTransaction();
                try
                {           
                    // HAVE TO CHECK THIS
                    int count = 0;
                    string selectQry = "SELECT COUNT(1) FROM tbl_SFA_Division_Entity_Mapping WHERE Company_Code=@Company_Code AND Division_Code=@Division_Code " +
                                           "AND Entity_Type=@Entity_Type";
                    count = connection.Query<int>(selectQry, new { Company_Code = companyCode, Division_Code = divisionCode, Entity_Type = entityName },
                                                    transaction: trans).Single();
                    if (count > 0)
                    {
                        string deleteQry = "DELETE FROM tbl_SFA_Division_Entity_Mapping WHERE Company_Code=@Company_Code AND Division_Code=@Division_Code " +
                                               "AND Entity_Type=@Entity_Type";
                        rowsAffected = connection.Execute(deleteQry, new { Company_Code = companyCode, Division_Code = divisionCode, Entity_Type = entityName },
                                                        transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            string insertQry = "insert into tbl_SFA_Division_Entity_Mapping(Company_Code,Division_Code, Entity_Code,Entity_Type,Record_Status, " +
                                                    "Created_By,Created_Date,Updated_By,Updated_Date) " +
                                                   "values(@Company_Code, @Division_Code,@Entity_Code,@Entity_Type,@Record_Status,@Created_By,@Created_Date,@Updated_By,@Updated_Date)";
                            rowsAffected = connection.Execute(insertQry, lstDivision, transaction: trans);
                        }
                    }
                    else
                    {
                        string insertQry = "insert into tbl_SFA_Division_Entity_Mapping(Company_Code,Division_Code, Entity_Code,Entity_Type,Record_Status, " +
                                                    "Created_By,Created_Date,Updated_By,Updated_Date) " +
                                                   "values(@Company_Code, @Division_Code,@Entity_Code,@Entity_Type,@Record_Status,@Created_By,@Created_Date,@Updated_By,@Updated_Date)";
                        rowsAffected = connection.Execute(insertQry, lstDivision, transaction: trans);
                    }
                    trans.Commit();

                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    Dictionary<string, string> dicObj = new Dictionary<string, string>();
                    dicObj.Add("divisionCode", divisionCode);
                    dicObj.Add("entity", entityName);
                    Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                    return 0;
                }
                finally
                {
                    connection.Close();

                }

            }
            else {
            
                _objSPData = new SPData();
                _objData = new Data();
                try
                {
                    string cmdText = "SP_hdGetChildEntityCodeIncluesSelf";

                    SqlCommand command = new SqlCommand(cmdText);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    if (entityName == "REGION")
                    {
                        _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                    }
                    _objSPData.AddParamToSqlCommand(command, "@EntityType", ParameterDirection.Input, SqlDbType.VarChar, 30, entityName);
                    _objSPData.AddParamToSqlCommand(command, "@DivisionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, divisionCode);
                    if (lstDivision.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@Division_Entity_Mapping_TVP", ParameterDirection.Input, SqlDbType.Structured, null, "Division_Entity_Mapping_TVP");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@Division_Entity_Mapping_TVP", ParameterDirection.Input, SqlDbType.Structured, new DivisionMappingEnumurator(lstDivision.AsEnumerable()), "Division_Entity_Mapping_TVP");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar,30,"");
                    _objData.OpenConnection(companyCode);
                    _objData.ExecuteNonQuery(command);                
                    rowsAffected = Convert.ToInt32(command.Parameters["@Result"].Value);

                }
                catch
                {
                    throw;
                }
            }
            return rowsAffected;
        }

        public class DivisionMappingEnumurator : IEnumerable<SqlDataRecord>
        {

            public DivisionMappingEnumurator(IEnumerable<DivisionModel> data)
            {
                _data = data;
            }
            private IEnumerable<DivisionModel> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {
            new SqlMetaData("Division_Name", SqlDbType.VarChar, 30),
            new SqlMetaData("Division_Code", SqlDbType.VarChar, 30),          
            new SqlMetaData("Record_Status", SqlDbType.Char, 1),
            new SqlMetaData("Entity_Code", SqlDbType.VarChar,30),
            new SqlMetaData("Entity_Type", SqlDbType.VarChar, 30),
             new SqlMetaData("Company_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Created_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Updated_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Created_Date", SqlDbType.DateTime),           
            new SqlMetaData("Updated_Date", SqlDbType.DateTime),

         };

                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    
                    record.SetValue(0, item.Division_Name);
                    record.SetValue(1, item.Division_Code);
                    record.SetValue(2, item.Record_Status == null ? "1" : item.Record_Status.ToString());
                    record.SetValue(3, item.Entity_Code);
                    record.SetValue(4, item.Entity_Type);
                    record.SetValue(5, item.Company_Code);
                    record.SetValue(6, item.Created_By);
                    record.SetValue(7, item.Updated_By);
                    record.SetValue(8, item.Created_Date = Convert.ToDateTime(item.Created_Date));
                    record.SetValue(9, item.Updated_Date = Convert.ToDateTime(item.Updated_Date));
          
                    yield return record;
                }
            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }
        public IEnumerable<MVCModels.DivisionEntityMapping> GetDivisionEntityDetails(string companyCode, string divisionCode, string entityType)
        {
            IEnumerable<MVCModels.DivisionEntityMapping> lstMapping = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstMapping = connection.Query<MVCModels.DivisionEntityMapping>(SP_HDGETDIVISIONENTITYDETAILS,
                                  new { CompanyCode = companyCode, DivisionCode = divisionCode, EntityType = entityType },
                                  commandType: CommandType.StoredProcedure);
                    return lstMapping;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<MVCModels.DivisionModel> GetDivisionsBasedonLoggedUser(string companyCode,string regionCode)
        {
            List<MVCModels.DivisionModel> lstDivision = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstDivision = connection.Query<MVCModels.DivisionModel>(SP_HDGETDIVISIONSBYREGION, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDivision;
        }
        public List<MVCModels.DivisionModel> GetDivisionsBasedonLoggedUserdivision(string companyCode, string regionCode, string UserCode)
        {
            List<MVCModels.DivisionModel> lstDivision = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@UserCode", UserCode);
                    lstDivision = connection.Query<MVCModels.DivisionModel>(SP_HDGETDIVISIONSBYLOGGEDINUSER, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDivision;
        }
        #endregion Public Methods
    }
}
