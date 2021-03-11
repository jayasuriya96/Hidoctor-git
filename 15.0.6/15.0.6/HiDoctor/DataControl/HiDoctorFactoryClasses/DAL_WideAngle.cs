using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class DAL_WideAngle
    {
        private Data _objData = new Data();
        SPData _objSPData = new SPData();

        const string SPEDCHECKEDACCESS = "sp_edCheckEDAccess";
        public bool IsEDAvailable(string companyCode, string userTypeCode)
        {
            try
            {
                int count = 0;
                SqlCommand command = new SqlCommand(SPEDCHECKEDACCESS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);

                _objData.OpenConnection();
                count = (int)_objData.ExecuteScalar(command);

                if (count > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}
