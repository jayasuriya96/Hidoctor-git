using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using ElmahWrapper;
using Dapper;

namespace DataControl
{
    public class DAL_SSCustomer : DapperRepository
    {
        const string SP_HD_GETAPPROVEDSS = "SP_Hd_GetApprovedSS";
        const string SP_HD_GETAPPROVEDCUSTOMERFORSSS = "SP_Hd_GetApprovedCustomerforSSS";
        const string SP_HD_GETSSPRODUCTDETAILS = "SP_Hd_GetSSProductdetails";
        const string SP_HD_GETAPPROVEDCUSTOMERFORSSSFOREDIT = "SP_Hd_GetApprovedCustomerforSSSForEdit";


        #region - SS for CustomerWise
        /// <summary>
        /// Get Approved ss based on region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<SecondarySalesforCustomerModel> GetApprovedSS(string companyCode, string regionCode, int month, int year)
        {
            List<SecondarySalesforCustomerModel> lstApprovedSS = new List<SecondarySalesforCustomerModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@Company_Code", companyCode);
                    param.Add("@Region_Code", regionCode);
                    param.Add("@Month", month);
                    param.Add("@Year", year);
                    lstApprovedSS = connection.Query<SecondarySalesforCustomerModel>(SP_HD_GETAPPROVEDSS, param, commandType: CommandType.StoredProcedure).ToList();
                    return lstApprovedSS;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get approved customers for selectd region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<SecondarySalesforCustomerModel> GetApprovedCustomer(string companyCode, string regionCode)
        {
            List<SecondarySalesforCustomerModel> lstCustomers = new List<SecondarySalesforCustomerModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Region_Code", regionCode);
                    lstCustomers = connection.Query<SecondarySalesforCustomerModel>(SP_HD_GETAPPROVEDCUSTOMERFORSSS, parameter, commandType: CommandType.StoredProcedure).ToList();
                    return lstCustomers;

                }
            }
            catch
            {
                throw;
            }
        }

        public List<SecondarySalesforCustomerModel> GetApprovedCustomerForEdit(string companyCode, string regionCode)
        {
            List<SecondarySalesforCustomerModel> lstCustomers = new List<SecondarySalesforCustomerModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Region_Code", regionCode);
                    lstCustomers = connection.Query<SecondarySalesforCustomerModel>(SP_HD_GETAPPROVEDCUSTOMERFORSSSFOREDIT, parameter, commandType: CommandType.StoredProcedure).ToList();
                    return lstCustomers;

                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get ss product details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="baseCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>

        public List<SecondarySalesDetailsforCustomerModel> GetSSProductDetails(string companyCode, string regionCode, string baseCode, int month, int year)
        {
            List<SecondarySalesDetailsforCustomerModel> lstSSSProductdetails = new List<SecondarySalesDetailsforCustomerModel>();
            SecondarySalesDetailsforCustomerModel _objSSCustomer = new SecondarySalesDetailsforCustomerModel();
            List<SecondarysalesProductdetailsModel> lstSecondarysalesProducts = null;
            List<SecondarySalesCustomerProductDeatilsModel> lstSecondarysalesforCustomer = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@Region_Code", regionCode);
                parameter.Add("@Base_Code", baseCode);
                parameter.Add("@Month", month);
                parameter.Add("@Year", year);
                using (var mutiple = connection.QueryMultiple(SP_HD_GETSSPRODUCTDETAILS, parameter, commandType: CommandType.StoredProcedure))
                {
                    lstSecondarysalesProducts = mutiple.Read<SecondarysalesProductdetailsModel>().ToList();
                    lstSecondarysalesforCustomer = mutiple.Read<SecondarySalesCustomerProductDeatilsModel>().ToList();
                }
                _objSSCustomer.lstSecondarysalesProducts = lstSecondarysalesProducts;
                _objSSCustomer.lstSecondarysalesforCustomer = lstSecondarysalesforCustomer;
                lstSSSProductdetails.Add(_objSSCustomer);
                return lstSSSProductdetails;
            }
        }
        /// <summary>
        /// Insert Customer product quantity
        /// </summary>
        /// <param name="lstSSCustomerProducts"></param>
        /// <returns></returns>
        public int InsertSSCusotmerProduct(List<SecondarySalesCustomerProductDeatilsModel> lstSSCustomerProducts, string formstatus)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if (formstatus.ToUpper() == "EDIT" || formstatus.ToUpper() == "")
                    {
                        string query = " DELETE FROM tbl_sfa_Secondary_Sales_Lines WHERE SS_Details_Code=@SS_Details_Code";
                        result = connection.Execute(query, lstSSCustomerProducts);

                        for (int i = 0; i < lstSSCustomerProducts.Count; i++)
                        {
                            if (lstSSCustomerProducts[i].Customer_Name != "")
                            {
                                string insertquery = "INSERT INTO tbl_sfa_Secondary_Sales_Lines(Company_Code,SS_Line_Id,SS_Details_Code,Customer_Code,Customer_Entity_Type,Quantity,Region_Code,Status,Entered_By,Entered_Date)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_sfa_Secondary_Sales_Lines,@SS_Details_Code,@Customer_Code,@Customer_Entity_Type,@Quantity,@Region_Code,@Status,@Entered_By,@Entered_Date)";
                                result = connection.Execute(insertquery, lstSSCustomerProducts[i]);
                            }
                        }
                        
                    }
                    else if (formstatus.ToUpper() == "FULLEDIT")
                    {
                        string query = " DELETE FROM tbl_sfa_Secondary_Sales_Lines WHERE SS_Details_Code=@SS_Details_Code";
                        result = connection.Execute(query, lstSSCustomerProducts);
                    }
                    
                    return result;
                }
            }
            catch
            {
                throw;
            }
        }

        public int DeleteUnapprovedCustomers(string ssDetailsCode, string formstatus)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if (formstatus.ToUpper() == "EDIT")
                    {
                        string query = " DELETE FROM tbl_sfa_Secondary_Sales_Lines WHERE SS_Details_Code="+ssDetailsCode+"";
                        result = connection.Execute(query);
                    }

                    return result;
                }
            }
            catch
            {
                throw;
            }
        }

        #endregion - SS for CustomerWise
    }
}
