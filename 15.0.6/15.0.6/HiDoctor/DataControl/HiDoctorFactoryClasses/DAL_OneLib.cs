using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using System.Data.SqlClient;
using System.Data;

namespace DataControl.HiDoctorFactoryClasses
{
    public class DAL_OneLib : DapperRepository
    {
        private Data _objData = new Data();
        SPData _objSPData = new SPData();

        const string SP_ELCHECKACCESS = "sp_elCheckAccess";

        public bool IsOneLibAvailable(string companyCode, string userTypeCode)
        {
            try
            {
                int count = 0;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@UserTypeCode", userTypeCode, dbType: DbType.String, direction: ParameterDirection.Input);

                    count = connection.Query<int>(SP_ELCHECKACCESS, parameter, commandType: CommandType.StoredProcedure).Single();
                    connection.Close();
                }

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
