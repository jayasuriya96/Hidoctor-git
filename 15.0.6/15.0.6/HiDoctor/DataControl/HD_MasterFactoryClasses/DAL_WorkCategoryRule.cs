using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using System.Reflection;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_WorkCategoryRule : DapperRepository
    {
        const string SP_hdGetExpenseEntity = "SP_hdGetExpenseEntity";
        const string SP_hdInsertOrUpdateRuleData = "SP_hdInsertOrUpdateRuleData";
        const string SP_hdGetWorkCategoryRulesData = "SP_hdGetWorkCategoryRulesData";
        public List<WorkCategoryRuleModel> GetWorkCategory(string Company_Code)
        {
            List<WorkCategoryRuleModel> lst = new List<WorkCategoryRuleModel>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", Company_Code);
                    lst = conn.Query<WorkCategoryRuleModel>(SP_hdGetExpenseEntity, p, commandType: CommandType.StoredProcedure).ToList();

                   
                }
                return lst;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<WorkCategoryRulesData> GetWorkCategoryRuleData(string Company_Code)
        {
            List<WorkCategoryRulesData> lst = new List<WorkCategoryRulesData>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    lst = conn.Query<WorkCategoryRulesData>(SP_hdGetWorkCategoryRulesData, p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string InsertorUpdateRulesData(string User_Code,RulesDefinitionDataModel obj)
        {          
            try
            {
                string resut = "";
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", User_Code);
                    p.Add("@Mode", obj.Mode);
                    p.Add("@Tvp_Table", ToDataTable(obj.lst).AsTableValuedParameter());
                    p.Add("@Result", "",DbType.String, ParameterDirection.Output);
                    conn.Query<string>(SP_hdInsertOrUpdateRuleData, p, commandType: CommandType.StoredProcedure).ToList();

                    resut = p.Get<string>("@Result");
                }
                return resut;
            }
            catch (Exception ex)
            {
                throw ex;
            }
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
