using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;



namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_Setting:DapperRepository
    {
        private SPData _objSPData = null;
        private Data _objData = null;

        //public List<TargetSetting.HSProductDetails> productdetails()
        //{
        //    List<TargetSetting.HSProductDetails> lst = new List<TargetSetting.HSProductDetails>();
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnectionCompanyWise()
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@Region_Code",Region_Code);
        //            lst = connection.Query<TargetSetting.HSProductDetails>("Sp_Hd_GetProductName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
        //            connection.Close();
        //        }

        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return lst;
        //}
        public List<RegionSalesProductList> productdetails(string Region_Code)
        {
            List<RegionSalesProductList> lstProduct = new List<RegionSalesProductList>() ;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                  
                    p.Add("@Region_Code", Region_Code);
                   
                    lstProduct = connection.Query<RegionSalesProductList>("Sp_Hd_GetSalesProductDetails", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstProduct;
        }

        public string  InsertProduts(SalesProductDetails obj)
        {
            string result = string.Empty;
            try
            {                
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Tvp_ProductList", ToDataTable(obj.lst).AsTableValuedParameter());
                    p.Add("@Result", "", dbType: DbType.String, direction: ParameterDirection.Output);
                    var res = connection.Query<string>("Sp_Hd_InsertProduct", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
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


        public List<RegionSalesProductList> GetProduts(string Region_Code)
        {
            List<RegionSalesProductList> productlist = new List<RegionSalesProductList>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();

                    p.Add("@Region_Code", Region_Code);

                    productlist = connection.Query<RegionSalesProductList>("Sp_Hd_GetProduct", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return productlist;
        }

        public IEnumerable<WorkCategory> GetWorkCategory(string CompanyCode)
        {
            List<WorkCategory> lst = new List<WorkCategory>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();

                    p.Add("@CompanyCode", CompanyCode);

                    lst = connection.Query<WorkCategory>("SP_hdGetExpenseEntity", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public int InsertCategorySetting(CategoryDetails obj, string user_code)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserTypeCode", obj.User_Type_Code);
                    p.Add("@category", obj.Category);
                    p.Add("@kilometer", obj.Kilometer);
                    p.Add("@lesscategory", obj.Less_than_Kilometer);
                    p.Add("@greatercatergory", obj.Greater_than_kilometer);
                    p.Add("@user_code", user_code);
                    p.Add("@From_date", obj.Effective_From);
                    p.Add("@To_date", obj.Effective_To);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_Hd_InsertCategorySetting", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public IEnumerable<WorkCategoryDetails> Getallcategorysetting(string user_code)
        {
            List<WorkCategoryDetails> lst = new List<WorkCategoryDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();

                    p.Add("@user_code", user_code);

                    lst = connection.Query<WorkCategoryDetails>("SP_hdGetallcategorysetting", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public int ChangeStatus(int id, string user_code)
        {
            int result = 0;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@id", id);
                    parameter.Add("@user_code", user_code);
                    conn.Query<int>("Sp_HD_DCRWorkCategoryChangesStatus", parameter, commandType: CommandType.StoredProcedure);
                    result = 1;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

    }
}
