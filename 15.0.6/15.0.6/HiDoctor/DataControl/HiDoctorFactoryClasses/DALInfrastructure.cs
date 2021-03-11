using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class DALInfrastructure
    {
        private Data _objData = new Data();
        SPData _objSPData = new SPData();
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        const string SPHDMAINTENANCESITE = "sp_hdMaintenanceSite";

        public bool SiteMaintenance(string subdomainName)
        {
            try
            {
                bool isTrue = true;

                if (System.Web.HttpContext.Current.Session["Comp_Code"] == null)
                {
                    isTrue = _objCurrentInfo.SetCompanyCode();
                }
                
                if (isTrue)
                {
                    SqlCommand command = new SqlCommand(SPHDMAINTENANCESITE);
                    command.CommandType = CommandType.StoredProcedure;
                    _objSPData.AddParamToSqlCommand(command, "@SubDomainName", ParameterDirection.Input, SqlDbType.VarChar, 30, subdomainName);
                    _objData.OpenConnection_Global();
                    DataSet ds = _objData.ExecuteDataSet(command);

                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
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
