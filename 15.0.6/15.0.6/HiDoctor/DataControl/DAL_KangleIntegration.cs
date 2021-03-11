using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace DataControl
{
    public class DAL_KangleIntegration
    {
        Data _ObjData = new Data();
        SPData _objSPData = new SPData();
        const string SP_HD_KANGLE_INSERTREQUEST = "SP_HD_Kangle_InsertRequest";
        const string SP_HD_KANGLE_CHECKACCESS = "SP_HD_Kangle_CheckAccess";

        public DAL_KangleIntegration()
        {

        }

        public void InsertRequest(string methodName, string data, string status, string message)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_KANGLE_INSERTREQUEST);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@MethodName", ParameterDirection.Input, SqlDbType.VarChar, 0, methodName);
                _objSPData.AddParamToSqlCommand(command, "@Data", ParameterDirection.Input, SqlDbType.VarChar, 0, data);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, 0, status);
                _objSPData.AddParamToSqlCommand(command, "@Message", ParameterDirection.Input, SqlDbType.VarChar, 0, message);
                _ObjData.OpenConnection();
                _ObjData.ExecuteNonQuery(command);
            }
            catch (Exception ex)
            {
                
            }
            finally
            {
                _ObjData.CloseConnection();
            }
        }

        public int CheckKangleAccess()
        {
            try
            {
                string str = "";
                SqlCommand command = new SqlCommand(SP_HD_KANGLE_CHECKACCESS);
                command.CommandType = CommandType.StoredProcedure;
                _ObjData.OpenConnection();
                str =  _ObjData.ExecuteScalar(command).ToString();
                if (str == "YES")
                    return 1;
                else
                    return 0;
            }
            catch(Exception ex)
            {
                return 0;
            }
        }
    }
}
