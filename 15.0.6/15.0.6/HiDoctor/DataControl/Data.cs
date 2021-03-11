using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Specialized;
using System.IO;
using ElmahWrapper;
using System.Text;
using System.Collections.Generic;
using Dapper;

/// <summary>
/// Summary description for Data
/// </summary>
/// 
namespace DataControl
{
    public class Data
    {
        // Declaration
        const string GLOBALCONFIG = "GlobalConfig";
        SqlConnection _conn;
        SqlConnection _connGlob;
        string _strError;
        SPData _objSPData;

        //Sql Server Open Connection
        public bool OpenGlobalConnection()
        {
            string strConnString;
            try
            {
                strConnString = this.GetGlobalConnectionString();
                _connGlob = new SqlConnection();
                _connGlob.ConnectionString = strConnString;
                _connGlob.Open();
                return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = ex.Message;
                return false;
            }
        }

        public string GetGlobalConnectionString()
        {
            return ConfigurationManager.AppSettings[GLOBALCONFIG];
        }

        //Returns Dataset for the resultant SQL Command
        public DataSet ExecuteGlobalDataSet(SqlCommand sqlCmd)
        {
            SqlDataAdapter sqlDAP;
            DataSet ds;
            if (OpenGlobalConnection())
            {
                sqlCmd.Connection = _connGlob;
            }
            ds = new DataSet();
            sqlDAP = new SqlDataAdapter(sqlCmd);
            sqlDAP.Fill(ds);
            CloseConnection(_connGlob);
            return ds;
        }

        //Sql Server Open Connection
        public bool OpenConnection(string companyCode)
        {
            string strConnString;
            try
            {
                strConnString = GetConnectionString_Client();

                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                _conn.Open();
                return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:OpenConnection " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }
        public SqlConnection OpenSqlConnection(string companyCode)
        {
            string strConnString;
            try
            {
                strConnString = GetConnectionString_Client();

                return new SqlConnection(strConnString);
                // _conn.ConnectionString = strConnString;
                //_conn.Open();
                //return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:OpenConnection " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }
        public bool OpenConnection(string companyCode, string ConnectionString)
        {
            string strConnString;
            try
            {
                strConnString = ConnectionString;

                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                _conn.Open();
                return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:OpenConnection " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        //Sql Server Open Connection
        public SqlConnection GetConnectionObject(string companyCode)
        {
            string strConnString;
            try
            {
                strConnString = GetConnectionString_Client();

                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                return _conn;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:GetConnectionObject " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        //Sql Server Open Connection
        public bool OpenConnectionObjectUsingSubDomain(string subDomain)
        {
            string strConnString;
            try
            {
                strConnString = GetConnectionStringAsync(subDomain).ToString();

                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                _conn.Open();
                return true;

            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:GetConnectionObject " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        public SqlConnection GetConnectionObjectForSqlBulCopy(string subdomain)
        {
            string strConnString;
            try
            {
                strConnString = GetConnectionStringAsync(subdomain).ToString();

                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                return _conn;

            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:GetConnectionObject " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }

        }

        public bool OpenConnectionAsync(string subDomainName)
        {
            try
            {
                _objSPData = new SPData();
                DataSet dsCredentials = _objSPData.GetConnectionString(subDomainName);
                if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
                {
                    SqlConnectionStringBuilder sqlConnStringBuilder = new SqlConnectionStringBuilder(GetConnectionStringAsync(subDomainName).ToString());
                    sqlConnStringBuilder.AsynchronousProcessing = true;
                    _conn = new SqlConnection();
                    _conn.ConnectionString = sqlConnStringBuilder.ConnectionString;
                    _conn.Open();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:OpenConnection " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                return false;
            }
        }

        private StringBuilder GetConnectionStringAsync(string subDomainName)
        {
            StringBuilder connectionString = new StringBuilder();
            _objSPData = new SPData();
            DataSet dsCredentials = _objSPData.GetConnectionString(subDomainName);
            if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
            {
                connectionString.Append("data source=" + dsCredentials.Tables[0].Rows[0]["SqlIPAddress"].ToString().Trim());
                connectionString.Append(";Initial Catalog=" + dsCredentials.Tables[0].Rows[0]["DatabaseName"].ToString().Trim());
                connectionString.Append(";User Id=" + dsCredentials.Tables[0].Rows[0]["SqlLoginId"].ToString().Trim());
                connectionString.Append(";Password=" + dsCredentials.Tables[0].Rows[0]["SqlPassword"].ToString().Trim());
            }
            return connectionString;
        }
        public StringBuilder GetCompanyConnectionString(string subDomainName)
        {
            StringBuilder connectionString = new StringBuilder();
            _objSPData = new SPData();
            DataSet dsCredentials = _objSPData.GetConnectionString(subDomainName);
            if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
            {
                connectionString.Append("data source=" + dsCredentials.Tables[0].Rows[0]["SqlIPAddress"].ToString().Trim());
                connectionString.Append(";Initial Catalog=" + dsCredentials.Tables[0].Rows[0]["DatabaseName"].ToString().Trim());
                connectionString.Append(";User Id=" + dsCredentials.Tables[0].Rows[0]["SqlLoginId"].ToString().Trim());
                connectionString.Append(";Password=" + dsCredentials.Tables[0].Rows[0]["SqlPassword"].ToString().Trim());
            }
            return connectionString;
        }

        public bool OpenConnection_Global()
        {
            string strConnString;
            try
            {
                strConnString = this.GetConnectionString("GlobalConfig");
                _conn = new SqlConnection();
                _conn.ConnectionString = strConnString;
                _conn.Open();
                return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:OpenConnection_Global " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        // This method used in Report class.
        public bool OpenConnection()
        {
            try
            {
                CurrentInfo objCur = new CurrentInfo();
                string companyCode = string.Empty;

                companyCode = objCur.GetCompanyCode();
                this.OpenConnection(companyCode);

                return true;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = ex.Message;
                ErrorLog.LogError(ex, "OpenConnection()");
                return false;
            }
        }

        //Returns Dataset
        public DataSet getDataSet(string strSQL)
        {
            DataSet tmpDS = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter(strSQL, _conn);
            da.Fill(tmpDS);

            return tmpDS;
        }
        //Returns Data Reader output for the resultant SQL String
        public SqlDataReader ExecuteReader(string strSQL)
        {
            SqlCommand sqlCmd;
            sqlCmd = new SqlCommand();
            sqlCmd.CommandText = strSQL;
            sqlCmd.Connection = _conn;
            sqlCmd.CommandTimeout = 500;
            // sqlCmd.CommandType = CommandType.StoredProcedure;
            return this.ExecuteReader(sqlCmd);
        }
        //Returns Data Reader output for the resultant SQL Command
        public SqlDataReader ExecuteReader(SqlCommand sqlCmd)
        {
            sqlCmd.Connection = _conn;
            return sqlCmd.ExecuteReader(CommandBehavior.CloseConnection);
        }
        //Returns Data object for the resultant SQL string
        public Object executeStringQuery(string query)
        {
            SqlCommand sqlCmd;
            sqlCmd = new SqlCommand();
            sqlCmd.CommandText = query;
            return ExecuteScalar(sqlCmd);
        }
        //Returns Data object for the resultant SQL Command
        public Object ExecuteScalar(SqlCommand sqlcmd)
        {
            sqlcmd.Connection = _conn;
            return sqlcmd.ExecuteScalar();
        }
        //Returns Data object for the resultant SQL string
        public Object ExecuteScalar(string strSQL)
        {
            SqlCommand sqlCmd;
            sqlCmd = new SqlCommand();
            sqlCmd.CommandText = strSQL;
            return this.ExecuteScalar(sqlCmd);
        }
        public void ExecuteNonQuery(string strSQL)
        {
            SqlCommand sqlCmd;
            sqlCmd = new SqlCommand();
            sqlCmd.CommandText = strSQL;
            this.ExecuteNonQuery(sqlCmd);
        }
        public void ExecuteNonQuery(SqlCommand sqlCmd)
        {
            sqlCmd.Connection = _conn;
            sqlCmd.ExecuteNonQuery();
        }
        public void ExecuteNonQuery(SqlCommand sqlCmd, string subdomainName)
        {
            try
            {
                _conn = new SqlConnection();
                _conn.ConnectionString = GetCompanyConnectionString(subdomainName).ToString();
                _conn.Open();
                sqlCmd.Connection = _conn;
                sqlCmd.ExecuteNonQuery();

            }
            finally
            {
                _conn.Close();
            }
        }
      

        //private string SetConnectionString(IEnumerable<ConnectionString> iConnectionModel)
        //{
        //    StringBuilder connectionBuilder = new StringBuilder();
        //    foreach (ConnectionString objConnectionModel in iConnectionModel)
        //    {
        //        connectionBuilder.Append("data source=" + objConnectionModel.SqlIPAddress.ToString().Trim());
        //        connectionBuilder.Append(";Initial Catalog=" + objConnectionModel.DatabaseName.ToString().Trim());
        //        connectionBuilder.Append(";User Id=" + objConnectionModel.SqlLoginId.ToString().Trim());
        //        connectionBuilder.Append(";Password=" + objConnectionModel.SqlPassword.ToString().Trim());
        //    }

        //    return connectionBuilder.ToString();
        //}
        public void ExecuteNonQueryAsync(SqlCommand sqlCmd)
        {
            try
            {
                sqlCmd.Connection = _conn;
                sqlCmd.CommandTimeout = 1000;
                sqlCmd.BeginExecuteNonQuery(new AsyncCallback(AsyncCommandCompletionCallback), sqlCmd);
            }
            catch
            {
                if (sqlCmd.Connection.State == ConnectionState.Open)
                    sqlCmd.Connection.Close();
            }
        }

        private void AsyncCommandCompletionCallback(IAsyncResult result)
        {
            SqlCommand cmd = null;
            try
            {
                // Get our command object from AsyncState, then call EndExecuteNonQuery.
                cmd = (SqlCommand)result.AsyncState;
                cmd.EndExecuteNonQuery(result);
            }
            catch
            {

                throw;
            }
            finally
            {
                if (cmd.Connection.State == ConnectionState.Open)
                    cmd.Connection.Close();
            }
        }

        //Returns Dataset for the resultant SQL string

        public DataSet ExecuteDataSet(String strSQL)
        {
            SqlCommand sqlCmd = null;
            try
            {
                //  SqlCommand sqlCmd;
                SqlDataAdapter sqlDAP;
                DataSet ds;

                sqlCmd = new SqlCommand();
                sqlCmd.Connection = _conn;
                sqlCmd.CommandTimeout = 400;
                sqlCmd.CommandText = strSQL;

                ds = new DataSet();
                sqlDAP = new SqlDataAdapter(sqlCmd);

                sqlDAP.Fill(ds);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sqlCmd.Connection.State == ConnectionState.Open)
                    sqlCmd.Connection.Close();
            }
        }

        //Returns Dataset for the resultant SQL Command
        public DataSet ExecuteDataSet(SqlCommand sqlCmd)
        {
            SqlDataAdapter sqlDAP;
            DataSet ds;

            sqlCmd.Connection = _conn;

            ds = new DataSet();
            sqlDAP = new SqlDataAdapter(sqlCmd);
            sqlDAP.Fill(ds);
            return ds;
        }

        //Returns DataTable for the resultant SQL Command
        public DataTable ExecuteDataTable(SqlCommand sqlCmd)
        {
            SqlDataAdapter sqlDAP;
            DataSet dt;

            sqlCmd.Connection = _conn;

            dt = new DataSet();
            sqlDAP = new SqlDataAdapter(sqlCmd);
            sqlDAP.Fill(dt);
            return dt.Tables[0];
        }

        public string GetConnectionString(string keyName)
        {
            return ConfigurationManager.AppSettings[keyName];
        }

        //Error string..
        public string GetErrorString()
        {
            return _strError;
        }

        //Returns Sql Server Close connection
        public void CloseConnection()
        {
            try
            {
                _conn.Close();
                if (_conn != null)
                    _conn.Dispose();
            }
            catch (Exception ex) { ErrorLog.LogError(ex, "CloseConnection()"); }
        }
        //Returns Sql Server Close connection with connection parameters
        public void CloseConnection(SqlConnection Connection)
        {
            try
            {
                Connection.Close();
            }
            catch (Exception ex) { ErrorLog.LogError(ex, "CloseConnection()"); }
        }
        public void CloseConnectionAsync()
        {
            try
            {
                _conn.Close();
            }
            catch (Exception ex) { ErrorLog.LogError(ex, "CloseConnection()"); }
        }
        public string getSingleValue(string strCompanyCode, string strQuery)
        {
            string strValue = "";
            try
            {
                OpenConnection(strCompanyCode);
                SqlCommand sqlcmd = new SqlCommand(strQuery, _conn);

                if (sqlcmd.ExecuteScalar().GetType().ToString() == "System.DBNull")
                {
                    strValue = "0";
                }
                else
                {
                    strValue = (string)sqlcmd.ExecuteScalar();
                }

                return (strValue);
            }
            catch (System.InvalidCastException ex)
            {
                ErrorLog.LogError(ex, "getSingleValue()");
                return "null error";
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                // Close the connection
                _conn.Close();

            }
        }

        public int getIntegerValue(string strCompanyCode, string strQuery)
        {
            int intValue = 0;

            try
            {
                OpenConnection(strCompanyCode);
                //string conn = GetConnectionString(strCompanyCode);
                //con = new SqlConnection();
                //con.ConnectionString = conn;
                //con.Open();
                SqlCommand sqlcmd = new SqlCommand(strQuery, _conn);
                intValue = Convert.ToInt32(sqlcmd.ExecuteScalar().ToString());
                //intValue = sqlcmd.
            }
            catch (System.FormatException)
            {
                intValue = 0;
            }
            catch (Exception ex)
            {
                throw (ex);

            }
            finally
            {
                // Close the connection
                _conn.Close();
            }
            return (intValue);
        }

        public string GetMaxCode(string strCompanyCode, string strTable, string strColumn, string strPrefix)
        {
            string strMaxCode = "";

            int intStart = 4, intEnd = 8;
            if (strPrefix.Length == 6)
            {
                intStart = 7;
                intEnd = 12;
            }

            // intMaxCode = objQry.getIntegerValue("SELECT MAX(CAST(SUBSTRING(" + strColumn + ",4,LEN(" + strColumn + ")) AS INT)) FROM " + strTable + " WHERE Company_Code = '" + strCompanyCode + "'");

            strMaxCode = getSingleValue(strCompanyCode, "select max(substring(" + strColumn + "," + intStart + "," + intEnd + ")) from " + strTable);


            if (strMaxCode == "null error")
            {
                strMaxCode = "0";
            }

            long intMaxCode = Convert.ToInt64(strMaxCode);
            intMaxCode++;
            if (intMaxCode < 10)
            {
                strMaxCode = strPrefix + "0000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10 && intMaxCode <= 99)
            {
                strMaxCode = strPrefix + "000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100 && intMaxCode <= 999)
            {
                strMaxCode = strPrefix + "00000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000 && intMaxCode <= 9999)
            {
                strMaxCode = strPrefix + "0000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000 && intMaxCode <= 99999)
            {
                strMaxCode = strPrefix + "000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100000 && intMaxCode <= 999999)
            {
                strMaxCode = strPrefix + "00" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "0" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "" + intMaxCode.ToString();
            }
            return strMaxCode;
        }



        public string GetMaxShortCode(string strCompanyCode, string strTable, string strColumn, string strPrefix)
        {
            string strMaxCode = "";
            long intMaxCode;
            int intStart = 4, intEnd = 8;
            if (strPrefix.Length == 1)
            {
                intStart = 2;
                intEnd = 4;
            }
            strMaxCode = getSingleValue(strCompanyCode, "select substring(max(" + strColumn + ")," + intStart + "," + intEnd + ") from " + strTable + "");

            if (strMaxCode == "null error")
            {
                strMaxCode = "0";
            }
            intMaxCode = Convert.ToInt64(strMaxCode);

            intMaxCode++;
            if (intMaxCode < 10)
            {
                strMaxCode = strPrefix + "00" + intMaxCode.ToString();
            }

            else if (intMaxCode >= 10 && intMaxCode <= 99)
            {
                strMaxCode = strPrefix + "0" + intMaxCode.ToString();
            }

            else if (intMaxCode >= 100 && intMaxCode <= 999)
            {
                strMaxCode = strPrefix + "" + intMaxCode.ToString();
            }
            return strMaxCode;
        }
        public string getMaxValues(string strMaxCode, string strPrefix)
        {
            if (strMaxCode == "null error")
            {
                strMaxCode = "0";
            }
            long intMaxCode = Convert.ToInt64(strMaxCode);

            if (intMaxCode < 10)
            {
                strMaxCode = strPrefix + "0000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10 && intMaxCode <= 99)
            {
                strMaxCode = strPrefix + "000000" + intMaxCode.ToString();
            }

            else if (intMaxCode >= 100 && intMaxCode <= 999)
            {
                strMaxCode = strPrefix + "00000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000 && intMaxCode <= 9999)
            {
                strMaxCode = strPrefix + "0000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000 && intMaxCode <= 99999)
            {
                strMaxCode = strPrefix + "000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100000 && intMaxCode <= 999999)
            {
                strMaxCode = strPrefix + "00" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "0" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "" + intMaxCode.ToString();
            }
            return strMaxCode;
        }

        public int GetIntegerValue(string strCompanyCode, string strQuery)
        {
            int intValue = 0;
            SqlConnection con = null;
            try
            {
                // Open the Connection
                OpenConnection(strCompanyCode);

                SqlCommand sqlcmd = new SqlCommand(strQuery, _conn);

                //con = objCon.getSqlDbConnection(strCompanyCode);
                //con.Open();
                //sqlcmd = new SqlCommand(strQuery, con);
                intValue = Convert.ToInt32(sqlcmd.ExecuteScalar().ToString());
                //intValue = sqlcmd.
            }
            catch (System.FormatException fe)
            {
                intValue = 0;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                // Close the connection
                con.Close();
            }
            return (intValue);
        }

        public string GetConnectionString_Client()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                string connectionString = string.Empty;

                connectionString = objCurInfo.GetConnectionString();
                return connectionString;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:GetConnectionString_Client " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        public string GetArchiveConnectionString_Client()
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                string connectionString = string.Empty;

                connectionString = objCurInfo.GetArchiveConnectionString();
                return connectionString;
            }
            catch (Exception ex)
            {
                //System.Web.HttpContext.Current.Response.Write("Exception: " + ex.Message);
                _strError = "DCRMobile " + " Public_fn:GetConnectionString_Client " + " Stack Trace : " + ex.StackTrace + " Error msg " + ex.Message;
                throw ex;
            }
        }

        public string GetStringValue(string companyCode, SqlCommand command)
        {
            try
            {
                string value = string.Empty;

                this.OpenConnection(companyCode);

                command.Connection = this._conn;

                if (command.ExecuteScalar().GetType().ToString() != "System.DBNull")
                {
                    value = (string)command.ExecuteScalar();
                }

                return value;
            }
            finally
            {
                this.CloseConnection();
            }
        }

        public int GetIntegerValue(string companyCode, SqlCommand command)
        {
            try
            {
                int value = 0;

                this.OpenConnection(companyCode);

                command.Connection = this._conn;

                if (command.ExecuteScalar().GetType().ToString() != "System.DBNull")
                {
                    value = (int)command.ExecuteScalar();
                }

                return value;
            }
            finally
            {
                this.CloseConnection();
            }
        }

        public int GetIntegerValue_Global(SqlCommand sqlCmd)
        {
            int intValue = 0;

            try
            {
                OpenConnection_Global();

                sqlCmd.Connection = _conn;

                if (sqlCmd.ExecuteScalar() != null)
                {
                    intValue = Convert.ToInt32(sqlCmd.ExecuteScalar().ToString());
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                _conn.Close();
            }
            return (intValue);
        }
    }
    //Returns Name value collection array list for the resultant datatable
    public class DataUtils
    {

        public static NameValueCollection[] GetNvcArray(DataTable dtDataTable)
        {
            NameValueCollection[] nvcArray = new NameValueCollection[dtDataTable.Rows.Count];

            for (int i = 0; i < dtDataTable.Rows.Count; i++)
            {
                nvcArray[i] = new NameValueCollection();
                for (int j = 0; j < dtDataTable.Columns.Count; j++)
                {
                    nvcArray[i].Add(dtDataTable.Columns[j].ColumnName, dtDataTable.Rows[j].ToString());
                }
            }
            return nvcArray;
        }
        //Returns Name value collection array list for the resultant datareader
        public static NameValueCollection[] GetNvcArray(SqlDataReader drDataReader)
        {

            ArrayList nvcArray = new ArrayList();
            NameValueCollection nvcData;

            int i = 0;
            while (drDataReader.Read())
            {
                nvcData = new NameValueCollection();
                for (int j = 0; j < drDataReader.FieldCount; j++)
                {
                    nvcData.Add(drDataReader.GetName(j), drDataReader[j].ToString());
                }
                nvcArray.Add(nvcData);
                i++;
            }

            return (NameValueCollection[])nvcArray.ToArray(typeof(NameValueCollection));
        }

        public static string NvcDataItem(IDataItemContainer Container, string strItem)
        {
            return ((NameValueCollection)Container.DataItem)[strItem];
        }

        public static SqlCommand GetSQLCommand(string strStoredProcName, params string[] strParameterPairs)
        {
            //
            SqlCommand cmdStoredProc = new SqlCommand();

            cmdStoredProc.CommandText = strStoredProcName;
            cmdStoredProc.CommandType = CommandType.StoredProcedure;

            for (int i = 0; i < (int)(strParameterPairs.Length / 2); i++)
            {
                cmdStoredProc.Parameters.AddWithValue(strParameterPairs[i], strParameterPairs[i + 1]);
            }

            return cmdStoredProc;
        }



        public string getMaxValues(string strMaxCode, string strPrefix)
        {
            if (strMaxCode == "null error")
            {
                strMaxCode = "0";
            }
            long intMaxCode = Convert.ToInt64(strMaxCode);

            if (intMaxCode < 10)
            {
                strMaxCode = strPrefix + "0000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10 && intMaxCode <= 99)
            {
                strMaxCode = strPrefix + "000000" + intMaxCode.ToString();
            }

            else if (intMaxCode >= 100 && intMaxCode <= 999)
            {
                strMaxCode = strPrefix + "00000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000 && intMaxCode <= 9999)
            {
                strMaxCode = strPrefix + "0000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000 && intMaxCode <= 99999)
            {
                strMaxCode = strPrefix + "000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100000 && intMaxCode <= 999999)
            {
                strMaxCode = strPrefix + "00" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "0" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "" + intMaxCode.ToString();
            }
            return strMaxCode;
        }
       

    }
    public class ConnectionString
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string SubDomain { get; set; }
        public string SqlIPAddress { get; set; }
        public string SqlLoginId { get; set; }
        public string SqlPassword { get; set; }
        public string DatabaseName { get; set; }
        public string GeoLocationSupport { get; set; }
        public string CompanyCode { get; set; }
        public string CommonPassword { get; set; }
    }
}
