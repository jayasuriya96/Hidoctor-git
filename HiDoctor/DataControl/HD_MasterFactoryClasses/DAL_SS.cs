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
    public class DAL_SS: DapperRepository
    {
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        //Secondary sales Delete
        const string SP_HD_SSN_GetStockiest = "SP_HD_SSN_GetStockiest";
        public List<StockiestData> GetSSStockiestDetails(string companyCode, string regionCode)
        {
            List<StockiestData> lstStockiest = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    //p.Add("@IncludeClosedStockiest", IncludeClosedStockiest);
                    //p.Add("@Month", month);
                    //p.Add("@Year", year);
                    lstStockiest = conn.Query<StockiestData>(SP_HD_SSN_GetStockiest, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstStockiest;
          
        }

        private IDbConnection IDbOpenConnection()
        {
            throw new NotImplementedException();
        }
    }
}
