#region Usings
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;
#endregion Usings
namespace DataControl
{
    public class DAL_TravelMode:DapperRepository
    {
        #region Private Variables
        Data _objData = new Data();

        const string SP_HDGETTRAVELMODES = "SP_HDGetTravelModes";
        #endregion Private Variables

        #region Public Methods
        public IEnumerable<TravelModeModel> GetTravelModes(string companyCode)
        {
            IEnumerable<TravelModeModel> lstTravelModeList=null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstTravelModeList = connection.Query<TravelModeModel>(SP_HDGETTRAVELMODES,
                                  new { Company_Code = companyCode },
                                  commandType: CommandType.StoredProcedure);
                    
                }
            }
            catch 
            {
                throw;
            }

            return lstTravelModeList;
        }
        #endregion Public Methods
    }
}
