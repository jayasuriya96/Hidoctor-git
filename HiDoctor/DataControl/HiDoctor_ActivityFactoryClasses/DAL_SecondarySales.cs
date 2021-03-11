using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;
using System.Data.SqlClient;
using System.Reflection;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_SecondarySales : DapperRepository
    {
        Data _objData = new Data();
        SPData _ObjSPData = new SPData();

        const string SP_HD_UpdateSecondarySales_Header = "SP_HD_UpdateSecondarySales_Header";
        const string SP_HD_InsertSecondarySales_Header = "SP_HD_InsertSecondarySales_Header";

        public string UpdateSecondarySalesHeader(string Company_Code, string month, string year, string statementDate, string ss_status, string enterdUser, string baseCode, string customerCode, string baseTypeCode, string CustomerEntityType, string ssCode)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@month", month);
                    p.Add("@year", year);
                    p.Add("@statementDate", statementDate);
                    p.Add("@ss_status", ss_status);
                    p.Add("@enterdUser", enterdUser);
                    p.Add("@basecode", baseCode);
                    p.Add("@customerCode", customerCode);
                    p.Add("@baseTypeCode", baseTypeCode);
                    p.Add("@CustomerEntityType", CustomerEntityType);
                    p.Add("@ssCode", ssCode);
                    p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_UpdateSecondarySales_Header, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string InsertSecondarySalesHeader(string Company_Code, string month, string year, string baseCode, string baseTypeCode, string userCode, string customerCode, string CustomerEntityType, string regionCode, string statementDate, string ss_status, string enterdUser)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@month", month);
                    p.Add("@year", year);
                    p.Add("@baseCode", baseCode);
                    p.Add("@baseTypeCode", baseTypeCode);
                    p.Add("@userCode", userCode);
                    p.Add("@customerCode", customerCode);
                    p.Add("@CustomerEntityType", CustomerEntityType);
                    p.Add("@regionCode", regionCode);
                    p.Add("@statementDate", statementDate);
                    p.Add("@ss_status", ss_status);
                    p.Add("@enterdUser", enterdUser);
                    p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_InsertSecondarySales_Header, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public int InsertSecondarySalesDetails(string Company_Code, string User_Code, string ssCode, string ss_Code, List<SS_Detail_Entry_Model> lst)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string cmdtxt = "SP_HD_Insert_Secondary_Sales_Details";
                    SqlCommand command = new SqlCommand(cmdtxt);
                    command.CommandType = CommandType.StoredProcedure;
                    _ObjSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Company_Code);
                    _ObjSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                    _ObjSPData.AddParamToSqlCommand(command, "@SS_Code", ParameterDirection.Input, SqlDbType.VarChar, 10, ss_Code);
                    _ObjSPData.AddParamToSqlCommand(command, "@ssCode", ParameterDirection.Input, SqlDbType.VarChar, 10, ssCode);
                    _ObjSPData.AddParamToSqlCommandWithTypeName(command, "@SSDetailsMap", ParameterDirection.Input, SqlDbType.Structured, ToDataTable(lst), "SSDetailsTVP");
                    //_ObjSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Structured, 0, "INT");
                    _objData.OpenConnection();
                    result = Convert.ToInt32(_objData.ExecuteScalar(command));
                    //result = (command.Parameters["@Result"].Value).ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }


        // Converting List to Datatable.
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
    }
}
