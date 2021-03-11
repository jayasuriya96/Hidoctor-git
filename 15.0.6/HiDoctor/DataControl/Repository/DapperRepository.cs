using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public abstract class DapperRepository
    {
        private Data _objData = new Data();
        protected IDbConnection IDbOpenConnection()
        {
            string connStr = _objData.GetConnectionString_Client();
            IDbConnection connection = new SqlConnection(connStr);
            connection.Open();
            return connection;
        }
        protected IDbConnection IDbOpenConnection(string ConnectionString)
        {
            IDbConnection connection = new SqlConnection(ConnectionString);
            connection.Open();
            return connection;
        }
        protected IDbConnection IDbOpenGlobalConnection()
        {
            string connStr = _objData.GetGlobalConnectionString();
            IDbConnection connection = new SqlConnection(connStr);
            connection.Open();
            return connection;
        }

        protected IDbConnection IDbOpenArchiveConnection(string ArchiveReportConnectionString)
        {
            string connStr = _objData.GetArchiveConnectionString_Client();
            IDbConnection connection = new SqlConnection(connStr);
            connection.Open();
            return connection;
        }
        protected IDbConnection IDbOpenConnectionCompanyWise(string subDomainName)
        {
            Data obj = new Data();

            string connStr = obj.GetCompanyConnectionString(subDomainName).ToString();
            //string connStr = GetCompanyConnectionString(companyCode);
            IDbConnection connection = new SqlConnection(connStr);
            connection.Open();
            return connection;
        }
    }
}
