using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Dapper;
using System.Data.SqlClient;

namespace DataControl
{
    public class DAL_STOS : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        public const string SP_HD_GETSTOSCONFIGVALUEFORSIZE = "SP_hd_GetSTOSConfigValueForSize";
        #endregion Private Variables
        #region Private Methods
        public void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.Size = size;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
        public string GetConfitValueForSize(string companyCode)
        {
            string fileDetails = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETSTOSCONFIGVALUEFORSIZE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            fileDetails = dataReader["Result"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return fileDetails;

        }
    }
}
