using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using System.Data;

namespace DataControl
{
    public class DALDepot : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;
        private CurrentInfo _objCurInfo = new CurrentInfo();
        const string SP_HDGETDEPOTSFORPRIMARYSALES = "SP_hdGetDepotsforPrimarySales";
        const string EXEC = "EXEC";

        public DataSet GetDepotsforPrimarySales(string company_Code)
        {
            DataSet ds = null;
            _objData = new Data();
            try
            {
                _objData.OpenConnection(company_Code);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDEPOTSFORPRIMARYSALES + " '" + company_Code + "'");
                }
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
    }
}
