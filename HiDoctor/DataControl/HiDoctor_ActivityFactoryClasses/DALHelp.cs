using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class DALHelp
    {
        private Data _objData = new Data();

        const string SPHDINSERTHELPDESCRP = "sp_hdInsertHelpDescrp";
        const string SPHDGETHELPITEM = "sp_hdGetHelpItem";

        public bool InsertHelpDescription(string pageId, string controlId, string helpItemId, string helpDescrip,out string errorMsg)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SPHDINSERTHELPDESCRP);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@PageId", ParameterDirection.Input, SqlDbType.VarChar, 100, pageId);
                _objSPData.AddParamToSqlCommand(command, "@ControlId", ParameterDirection.Input, SqlDbType.VarChar, 100, controlId);
                _objSPData.AddParamToSqlCommand(command, "@HelpItemId", ParameterDirection.Input, SqlDbType.VarChar, 100, helpItemId);
                _objSPData.AddParamToSqlCommand(command, "@HelpDescrp", ParameterDirection.Input, SqlDbType.VarChar, helpDescrip.Length, helpDescrip);

                _objData.OpenConnection_Global();
                DataSet dsConnectionString = _objData.ExecuteDataSet(command);
                errorMsg = string.Empty;

                return true;
            }
            catch (Exception ex)
            {
                errorMsg = ex.Message;
                return false;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetHelpDescription(string pageId, string controlId,out string errorMsg)
        {
            try
            {
                SPData objSPData = new SPData();
                SqlCommand command = new SqlCommand(SPHDGETHELPITEM);
                command.CommandType = CommandType.StoredProcedure;
                objSPData.AddParamToSqlCommand(command, "@PageId", ParameterDirection.Input, SqlDbType.VarChar, 100, pageId);
                objSPData.AddParamToSqlCommand(command, "@ControlId", ParameterDirection.Input, SqlDbType.VarChar, 100, controlId);

                _objData.OpenConnection_Global();
                DataSet ds = _objData.ExecuteDataSet(command);
                errorMsg = string.Empty;
                return ds;
            }
            catch (Exception ex)
            {
                errorMsg = ex.Message;
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}
