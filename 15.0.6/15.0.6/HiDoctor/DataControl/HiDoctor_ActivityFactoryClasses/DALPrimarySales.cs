using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;
using System.Data.SqlClient;
using Dapper;

using Microsoft.SqlServer.Server;
using System.Reflection;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DALPrimarysales : DapperRepository
    {

        #region Variables

        const string SP_GetPrimarySalesMasterData = "SP_Hd_GetPrimarySalesMasterData";
        const string SP_HD_GETPRIMARYSALES_UPLOAD_DETAILS = "sp_Hd_GetPrimarysales_Upload_details";
        const string SP_PSTemptbl_Upload = "SP_Hd_insertpstemptbl";
        const string SP_PSValidation = "SP_HD_PrimarySalesValidation";
        CurrentInfo _objCurrentinfo = new CurrentInfo();
        List<PrimarySalesModel> Errorlist = new List<PrimarySalesModel>();
        Data _objData = new Data();
        SPData _ObjSpData = new SPData();
        SqlDataReader sqldataReader;
        DataSet ds;
        DataTable dt;
        private Data objData = null;
        private SPData ObjSPData = null;

        #endregion

        public DataSet GetPrimarySalesMasterData(string Mode,int Month,int Year)
        {
            ds = new DataSet();
            SPData _objSPData = new SPData();
            _objData.OpenConnection();
            {
                string strSQL = "" + "EXEC" + "  " + SP_GetPrimarySalesMasterData + " '" + _objCurrentinfo.GetCompanyCode() + "','" + _objCurrentinfo.GetRegionCode() + "','"  + Mode + "','" + Month + "','" + Year + "'";
                ds = _objData.ExecuteDataSet(strSQL);
                _objData.CloseConnection();
            }
            return ds;
        }
        public bool PrimarySalesTempUpload(string companyCode, DataTable dt, string UserCode, string ConnectionString, string strGuid)
        {
            //try
            //{
            //    bool result = false;
            //    int rowCount = 0;
            //    using (IDbConnection conn = IDbOpenConnection(ConnectionString))
            //    {
            //        var p = new DynamicParameters();
            //        p.Add("@UserCode", UserCode);
            //        p.Add("@Details",dt.AsTableValuedParameter());
            //        p.Add("@strGuid", strGuid);
            //        rowCount = conn.Query<int>(SP_PSTemptbl_Upload, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
            //        conn.Close();
            //        result = true;

            //    }
            //    return result;
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
            //finally
            //{
            //}
            objData = new Data();
            ObjSPData = new SPData();
            bool result = false;
            try
            {
                SqlCommand cmdProc = new SqlCommand(SP_PSTemptbl_Upload);
                cmdProc.CommandType = CommandType.StoredProcedure;
                ObjSPData.AddParamToSqlCommand(cmdProc, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                ObjSPData.AddParamToSqlCommandWithTypeName(cmdProc, "@Details", ParameterDirection.Input, SqlDbType.Structured, new PrimarySalesEnumurator(dt), "TVP_PSTemptbl_Upload");
                ObjSPData.AddParamToSqlCommand(cmdProc, "@strGuid", ParameterDirection.Input, SqlDbType.VarChar, 50, strGuid);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                objData.OpenConnection(companyCode, ConnectionString);
                {
                    objData.ExecuteNonQuery(cmdProc);
                }
                result = true;
            }
            catch (Exception ex)
            {

                throw;
            }

            return result;
        }

        public void PrimarySalesValidation(string companyCode, string UserCode, string BP_Id, string fileName, string ConnectionString,int Month,int Year,int UploadType)
        {
            try
            {
                objData = new Data();
                ObjSPData = new SPData();
                SqlCommand cmdProc = new SqlCommand(SP_PSValidation);
                cmdProc.CommandType = CommandType.StoredProcedure;
                cmdProc.CommandTimeout = 7000;
                ObjSPData.AddParamToSqlCommand(cmdProc, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@BP_Id", ParameterDirection.Input, SqlDbType.VarChar, 50, BP_Id);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@File_Name", ParameterDirection.Input, SqlDbType.VarChar, 70, fileName);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@Month", ParameterDirection.Input, SqlDbType.Int, 12, Month);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@Year", ParameterDirection.Input, SqlDbType.Int, 12, Year);
                ObjSPData.AddParamToSqlCommand(cmdProc, "@UploadType", ParameterDirection.Input, SqlDbType.Int, 12, UploadType);
                objData.OpenConnection(companyCode, ConnectionString);
                {
                    objData.ExecuteNonQuery(cmdProc);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public DataSet GetValidationDetails(string Mode,int Month,int Year)
        {
            try
            {
                _objData.OpenConnection();
                string strSQL = "" + "EXEC" + "  " + SP_GetPrimarySalesMasterData + " '" + _objCurrentinfo.GetCompanyCode() + "','" + _objCurrentinfo.GetRegionCode() + "','" + Mode + "','" + Month + "','" + Year + "'";
                ds = _objData.ExecuteDataSet(strSQL);

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
        public DataTable GetUploadSummary(string region, string depot, string customer, string document_no, string from, string to,string ProductCode, string Mode)
        {
            _objData.OpenConnection();

            string strSQL = "" + "EXEC" + "  " + SP_HD_GETPRIMARYSALES_UPLOAD_DETAILS + " '" + region + "','" + depot + "','" + customer + "','" + document_no;
            strSQL = strSQL + "','" + from + "','" + to + "','" + ProductCode + "','" + Mode + "'";

            ds = _objData.ExecuteDataSet(strSQL);
            return ds.Tables[0];
        }

        public DataTable GetDepots()
        {
            _objData.OpenConnection();
            string strSQL = "EXEC sp_sdGetDepots '" + _objCurrentinfo.GetCompanyCode() + "','" + _objCurrentinfo.GetRegionCode() + "'";
            ds = _objData.ExecuteDataSet(strSQL);
            return ds.Tables[0];
        }
        public DataSet GetPrimarySalesStockiestData(string region)
        {
            try
            {
                _objData.OpenConnection();
                string strSQL = "EXEC SP_hdGetPrimarySalesStockiestList '" + _objCurrentinfo.GetCompanyCode() + "','" + region + "'";


                ds = _objData.ExecuteDataSet(strSQL);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataTable GetRegion(string Mode,int Month,int Year)
        {
            try
            {
                _objData.OpenConnection();
                string strSQL = "" + "EXEC" + "  " + SP_GetPrimarySalesMasterData + " '" + _objCurrentinfo.GetCompanyCode() + "','" + _objCurrentinfo.GetRegionCode() + "','" + Mode + "','" + Month + "','" + Year + "'";
                ds = _objData.ExecuteDataSet(strSQL);

            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }

            return ds.Tables[0];
        }

        //public string PrimarySaleBulkInsert(string subDomain, string company_Code, string usercode, string filename, DataSet ds, string stagingTableName1, string stagingTableName2)
        //{
        //    try
        //    {
        //        _objData = new Data();
        //        using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
        //        {
        //            cn.Open();

        //            using (SqlTransaction sqlTransaction = cn.BeginTransaction())
        //            {

        //                DataTable Dt_head, Dt_details;
        //                Dt_head = ds.Tables[0];
        //                Dt_details = ds.Tables[1];
        //                try
        //                {
        //                    using (SqlBulkCopy copy = new SqlBulkCopy(cn, SqlBulkCopyOptions.KeepIdentity, sqlTransaction))
        //                    {


        //                        copy.DestinationTableName = stagingTableName1;
        //                        foreach (DataColumn col in Dt_head.Columns)
        //                        {
        //                            copy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
        //                        }
        //                        copy.WriteToServer(Dt_head);
        //                    }
        //                    using (SqlBulkCopy copydetails = new SqlBulkCopy(cn, SqlBulkCopyOptions.KeepIdentity, sqlTransaction))
        //                    {
        //                        copydetails.DestinationTableName = stagingTableName2;
        //                        foreach (DataColumn col in Dt_details.Columns)
        //                        {
        //                            copydetails.ColumnMappings.Add(col.ColumnName, col.ColumnName);
        //                        }


        //                        //copydetails.ColumnMappings.Add("Region_Ref_Key1", "Region_Ref_Key1");
        //                        //copydetails.ColumnMappings.Add("Depot_Ref_Key1", "Depot_Ref_Key1");                                
        //                        //copydetails.ColumnMappings.Add("Stockiest_Ref_Key1", "Stockiest_Ref_Key1");
        //                        //copydetails.ColumnMappings.Add("Document_Ref_key1", "Document_Ref_key1");
        //                        //copydetails.ColumnMappings.Add("Document_Number", "Document_Number");
        //                        //copydetails.ColumnMappings.Add("Document_Date", "Document_Date");
        //                        //copydetails.ColumnMappings.Add("Document_Name", "Document_Name");
        //                        //copydetails.ColumnMappings.Add("Transaction_Mode", "Transaction_Mode");
        //                        //copydetails.ColumnMappings.Add("Product_Name", "Product_Name");
        //                        //copydetails.ColumnMappings.Add("Product_Ref_Key1", "Product_Ref_Key1");
        //                        //copydetails.ColumnMappings.Add("Batch_Number", "Batch_Number");
        //                        //copydetails.ColumnMappings.Add("Sales_Quantity", "Sales_Quantity");
        //                        //copydetails.ColumnMappings.Add("Free_Quantity", "Free_Quantity");
        //                        //copydetails.ColumnMappings.Add("Sales_Rate", "Sales_Rate");

        //                        copydetails.WriteToServer(Dt_details);
        //                    }
        //                    sqlTransaction.Commit();
        //                    return "Success";
        //                }
        //                catch (Exception ex)
        //                {
        //                    sqlTransaction.Rollback();
        //                    //Errorlist.Add(new PrimarySalesModel("", "", "", "HD_ERR_0401"));
        //                    //InsertPrimarySalesBatchProcessingHeader(_objCurrentinfo.GetCompanyCode().ToString(), Guid.NewGuid().ToString(), "PSU_UPLOAD", filename.ToString(), DateTime.Now.ToString(), "ERROR", _objCurrentinfo.GetUserCode().ToString());
        //                    return ex.Message.ToString();
        //                    //InsertPrimarySalesBatchProcessing(Errorlist, Guid.NewGuid().ToString());
        //                }
        //            }
        //            cn.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return ex.Message.ToString();
        //    }
        //    return string.Empty;
        //}


        //public void InsertPrimarySalesBatchProcessing(List<PrimarySalesModel> Error, string Guid, string ConnectionString)
        //{
        //    int rowsAffected = 0;
        //    int rowNo = 0;
        //    using (IDbConnection connection = IDbOpenConnection(ConnectionString))
        //    {
        //        IDbTransaction trans = connection.BeginTransaction();
        //        try
        //        {
        //            foreach (var data in Error)
        //            {
        //                if (data != null)
        //                {
        //                    data.BP_ID = Guid;
        //                    rowNo = rowNo + 1;
        //                    const string queryERRLOG = "INSERT INTO TBL_SFA_BATCHPROCESSING_ERRLOG(BP_ID,ROW_NO,ERR_CODE,Dynamic_Column_Name) VALUES (@BP_ID,@ROW_NO,@ERR_CODE,@Dynamic_Column_Name)";
        //                    rowsAffected = connection.Execute(queryERRLOG, new
        //                    {
        //                        BP_ID = data.BP_ID,
        //                        ROW_NO = data.RowNo,
        //                        ERR_CODE = data.ERR_CODE,
        //                        Dynamic_Column_Name = " "
        //                    }, transaction: trans);
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            trans.Rollback();
        //            throw;
        //        }
        //        trans.Commit();
        //    }
        //    //return rowsAffected.ToString();
        //}
        public void InsertPrimarySalesBatchProcessingHeader(string companyCode, string BPid, string type, string filename, string Upload_date, string status, string userCode, string ConnectionString)
        {
            int rowsAffected = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    try
                    {
                        const string insertquery = "INSERT INTO TBL_SFA_BATCHPROCESSING_HEADER(Company_code,BP_ID,BP_Type,Upload_file_name,User_code,Upload_Date,Status) " +
                                                    "VALUES (@Companycode,@BPid,@BPType,@filename,@usercode,@upload_date,@status)";
                        rowsAffected = connection.Execute(insertquery, new
                        {
                            Companycode = companyCode,
                            BPid = BPid,
                            BPType = type,
                            filename = filename,
                            usercode = userCode,
                            upload_date = Convert.ToDateTime(Upload_date),
                            status = status
                        }, transaction: trans);

                        trans.Commit();
                    }
                    catch (Exception ex)
                    {
                        trans.Rollback();
                        throw;
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //return rowsAffected.ToString();
        }
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

        public DataTable GetProducts(string Region_Code)
        {
            try
            {
                _objData.OpenConnection();
                string strSQL = "EXEC SP_hdGetSecondarySalesProductList '" + _objCurrentinfo.GetCompanyCode() + "','" + _objCurrentinfo.GetRegionCode() + "'";
                ds = _objData.ExecuteDataSet(strSQL);

            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }

            return ds.Tables[0];
        }
    }
    public class PrimarySalesEnumurator : IEnumerable<SqlDataRecord>
    {

        public PrimarySalesEnumurator(DataTable data)
        {
            _data = data;
        }
        private DataTable _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Depot_Name", SqlDbType.VarChar, 250),
         new SqlMetaData("Region_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("Region_Ref_Key", SqlDbType.VarChar, 100),
         new SqlMetaData("Stockist_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("Stockist_Ref_Key", SqlDbType.VarChar, 100),
         new SqlMetaData("Document_Type_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("Document_Number", SqlDbType.VarChar, 100),
         new SqlMetaData("Document_Date", SqlDbType.VarChar, 100),
         new SqlMetaData("Product_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("Product_Ref_Key", SqlDbType.VarChar, 100),
         new SqlMetaData("Batch_Number", SqlDbType.VarChar, 100),
          new SqlMetaData("Net_Quantity", SqlDbType.VarChar, 100),
          new SqlMetaData("Free_Quantity", SqlDbType.VarChar, 100),
           new SqlMetaData("Net_Value", SqlDbType.VarChar, 100),
           new SqlMetaData("Excel_Row_No", SqlDbType.Int),
          };

            for (int i = 0; i < _data.Rows.Count; i++)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, _data.Rows[i]["Depot_Name"].ToString());
                record.SetValue(1, _data.Rows[i]["Region_Name"].ToString());
                record.SetValue(2, _data.Rows[i]["Region_Ref_Key"].ToString());
                record.SetValue(3, _data.Rows[i]["Stockiest_Name"].ToString());
                record.SetValue(4, _data.Rows[i]["Stockiest_Ref_Key"].ToString());
                record.SetValue(5, _data.Rows[i]["Document_Type_Name"].ToString());
                record.SetValue(6, _data.Rows[i]["Document_Number"].ToString());
                record.SetValue(7, _data.Rows[i]["Document_Date"].ToString());
                record.SetValue(8, _data.Rows[i]["Product_Name"].ToString());
                record.SetValue(9, _data.Rows[i]["Product_Ref_Key"].ToString());
                record.SetValue(10, _data.Rows[i]["Batch_Number"].ToString());
                record.SetValue(11, _data.Rows[i]["Net_Quantity"].ToString());
                record.SetValue(12, _data.Rows[i]["Free_Quantity"].ToString());
                record.SetValue(13, _data.Rows[i]["Net_Value"].ToString());
                record.SetValue(14, Convert.ToInt32(_data.Rows[i]["Excel_Row_No"].ToString()));
                yield return record;
            }



        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        
    }
}

