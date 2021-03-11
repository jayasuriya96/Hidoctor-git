using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    class DAL_MasterDataDownload : DapperRepository
    {
        DataControl.Data _objData = new DataControl.Data();
        SPData _objSPData = new SPData();

        const string SP_HD_GetMasterData = "SP_HD_GetMasterData";

        public bool InsertMasterData(DataTable dtUserCodes)
        {
            bool result = false;
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_InsertMasterData");
                command.CommandType = CommandType.StoredProcedure;
                if (dtUserCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_MasterData_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_MasterData_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_MasterData_Details", ParameterDirection.Input, SqlDbType.Structured, dtUserCodes, "TVP_MasterData_Details");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public List<MasterDetails> GetMasterData(string FromDate, string ToDate)
        {
            List<MasterDetails> lstMasterData = new List<MasterDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Effective_from", FromDate);
                    p.Add("@Effective_to", ToDate);
                    lstMasterData = connection.Query<MasterDetails>(SP_HD_GetMasterData, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstMasterData;

        }

    }
}
