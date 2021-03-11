using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_RCPACompetator : DapperRepository
    {
        SPData _objSPData = new SPData();

        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        private SqlDataReader sqlDataReader;

        const string Sp_Hd_GetRCPAExcelList = "Sp_Hd_GetRCPAExcelList";

        public string RCPAExcelBulkInsert(string companyCode, DataTable dt)
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
                        copy.ColumnMappings.Add("Region_Name", "Region_Name");
                        copy.ColumnMappings.Add("", "");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = "";
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

        public string RCPAExcelBulkAddResult(string subDomain, string companyCode, string Regioncode, string guid, string fileName, string uploadedBy, string bpType)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Regioncode", ParameterDirection.Input, SqlDbType.VarChar, 30, Regioncode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                result = "SUCCESS:";
            }
            catch (Exception ex)
            {
                result = String.Concat("FAILURE: ", ex.StackTrace.Substring(0, 499));
            }

            return result;
        }

        public string RCPAInsert(List<RCPA_Doctor> lsRCPA_Doctor, List<RCPA_SalesProduct> lsRCPA_SalesProduct, List<RCPA_CompProduct> lsRCPA_CompProduct, RCPA_Header objRcpa)
        {
            string rValue = "";
            try
            {
                string cmdText = "SP_hd_InsertRCPACompProducts";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_code", ParameterDirection.Input, SqlDbType.VarChar, 30, objRcpa.Company_code);
                _objSPData.AddParamToSqlCommand(command, "@Company_Id", ParameterDirection.Input, SqlDbType.BigInt, 30, objRcpa.Company_Id);
                _objSPData.AddParamToSqlCommand(command, "@Regioncode", ParameterDirection.Input, SqlDbType.VarChar, 30, objRcpa.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, objRcpa.user_code);
                _objSPData.AddParamToSqlCommand(command, "@PeriodFrom", ParameterDirection.Input, SqlDbType.Date, 30, objRcpa.PeriodFrom);
                _objSPData.AddParamToSqlCommand(command, "@PeriodTo", ParameterDirection.Input, SqlDbType.Date, 30, objRcpa.PeriodTo);
                //  _objSPData.AddParamToSqlCommand(command, "@Period_From", ParameterDirection.Input, SqlDbType.BigInt, 30, objChemistVisit.CV_Visit_Id);
                if (lsRCPA_Doctor.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_doctors", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_rcpa_doctors");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_doctors", ParameterDirection.Input, SqlDbType.Structured, new RCPA_DoctorEnumurator(lsRCPA_Doctor), "TVP_rcpa_doctors");
                if (lsRCPA_SalesProduct.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_SalesProduct", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_rcpa_SalesProduct");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_SalesProduct", ParameterDirection.Input, SqlDbType.Structured, new RCPA_SalesProductEnumurator(lsRCPA_SalesProduct), "TVP_rcpa_SalesProduct");
                if (lsRCPA_CompProduct.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_CompProduct", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_rcpa_CompProduct");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_rcpa_CompProduct", ParameterDirection.Input, SqlDbType.Structured, new RCPA_CompProductEnumurator(lsRCPA_CompProduct), "TVP_rcpa_CompProduct");
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection();
                //    _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                // objSqlTransaction.Commit();
                rValue = command.Parameters["@Result"].Value.ToString();

            }
            catch (Exception ex)
            {
                rValue = ex.Message;
            }
            return rValue;
        }

        public List<RcpaExcelUpload> GetExcelList(string Companycode, string Regioncode)
        {
            List<RcpaExcelUpload> lstfiles = new List<RcpaExcelUpload>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_code", Companycode);
                    p.Add("@Regioncode", Regioncode);
                    lstfiles = connection.Query<RcpaExcelUpload>(Sp_Hd_GetRCPAExcelList, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstfiles;
        }
    }
    public class RCPA_DoctorEnumurator : IEnumerable<SqlDataRecord>
    {

        public RCPA_DoctorEnumurator(IEnumerable<RCPA_Doctor> data)
        {
            _data = data;
        }
        private IEnumerable<RCPA_Doctor> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Row_Number", SqlDbType.Int),
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 30),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Row_Number);
                record.SetValue(1, item.Doctor_Name);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class RCPA_SalesProductEnumurator : IEnumerable<SqlDataRecord>
    {

        public RCPA_SalesProductEnumurator(IEnumerable<RCPA_SalesProduct> data)
        {
            _data = data;
        }
        private IEnumerable<RCPA_SalesProduct> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Product_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Product_Quantity", SqlDbType.Decimal, 13,3),

         new SqlMetaData("Row_No", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Doctor_Name);
                record.SetValue(1, item.SalesProduct_Name);
                record.SetValue(2, Convert.ToDecimal(item.Product_Quantity));
                record.SetValue(3, item.Row_No);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class RCPA_CompProductEnumurator : IEnumerable<SqlDataRecord>
    {

        public RCPA_CompProductEnumurator(IEnumerable<RCPA_CompProduct> data)
        {
            _data = data;
        }
        private IEnumerable<RCPA_CompProduct> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Product_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("CProduct_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Product_Quantity", SqlDbType.Decimal, 13,3),
         new SqlMetaData("Row_No", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Doctor_Name);
                record.SetValue(1, item.SalesProduct_Name);
                record.SetValue(2, item.Comp_Product_Name);
                record.SetValue(3, Convert.ToDecimal(item.Product_Quantity));
                record.SetValue(4, item.Row_No);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}