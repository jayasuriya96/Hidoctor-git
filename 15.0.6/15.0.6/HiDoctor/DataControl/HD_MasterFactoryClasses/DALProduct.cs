using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using MVCModels;
using Dapper;

namespace DataControl
{
    public class DALProduct : DapperRepository
    {
        DataControl.Data _objData = new DataControl.Data();
        DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
        const string SP_HDGETALLSALEPRODUCTS = "SP_hdGetAllSaleProducts";
        const string SP_HDINSERTPRICEGROUPHEADER = "SP_hdInsertPriceGroupHeader";
        const string SP_HDINSERTPRICEGROUPDETAILS = "SP_hdInsertPriceGroupDetails";
        const string SP_HDGETPRICEGROUPHEADER = "SP_hdGetPriceGroupHeader";
        const string SP_HDGETPRICEGROUPDETAILS = "SP_hdGetPriceGroupDetails";
        const string SP_HDDELETEPRICEGROUPDETAILS = "SP_hdDeletePriceGroupDetails";
        const string SP_HDGETALLPRODUCTS = "SP_hdGetAllProducts";
        const string SP_HDINSERTSCHEMEHEADER = "SP_hdInsertSchemeHeader";
        const string SP_HDGETSCHEMEHEADER = "SP_hdGetSchemeHeader";
        const string SP_HDINSERTSCHEMEDETAILS = "SP_hdInsertSchemeDetails";
        const string SP_HDINSERTSCHEMEOFFERDETAILS = "SP_hdInsertSchemeOfferDetails";
        const string SP_HDGETSCHEMEDETAILS = "SP_hdGetSchemeDetails";
        const string SP_HDDELETESCHEME = "SP_hdDeleteScheme";
        const string SP_HDDELETESCHEMEDETAILS = "SP_hdDeleteSchemeDetails";
        const string SP_HDCHECKSCHEMEPRODUCTREPETATION = "SP_HDCHECKSCHEMEPRODUCTREPETATION";
        const string SP_HDINSERTPRODUCTMASTERFROMSTAGING = "SP_hdInsertProductMasterFromStaging";
        const string SP_HDGETSPECIALITY = "SP_hdGetSpeciality"; //
        const string SP_HDGETALLACTIVEPRODUCTDETAILS = "SP_hdGetAllActiveProductDetails"; //
        const string TBL_DEP_ITRAN_STAGING = "tbl_Dep_ITran_Staging";
        const string SP_HDGETPRODUCTSFORPRIMARYSALES = "SP_hdGetProductsforPrimarySales";
        const string SP_HDINSERTPRIMARYSALES = "SP_hdInsertPrimarySales";
        #region primarysales parameters
        const string SP_HDGETPSPARAMETERS = "SP_hdGetPSParameters";
        const string SP_HDGETPSEMPLOYEEDETAILS = "SP_hdGetPSEmployeeDetails";
        const string SP_HDGETALLPSPARAMETERS = "SP_hdGetAllPSParameters";
        const string SP_HDCREATEPSPARAMETERSTAGING = "SP_hdCreatePSParameterStaging";
        const string SP_HDINSERTPSVALUES = "SP_hdInsertPSValues";
        #endregion primarysales parameters
        const string EXEC = "EXEC";
        SqlDataReader sqldataReader;

        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllSaleProducts(string companyCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.ProductModel> lstProduct = new List<MVCModels.HiDoctor_Master.ProductModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETALLSALEPRODUCTS + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.ProductModel objProduct = new MVCModels.HiDoctor_Master.ProductModel();
                            objProduct.Product_Code = sqldataReader["Product_Code"].ToString();
                            objProduct.Product_Name = sqldataReader["Product_Name"].ToString();
                            lstProduct.Add(objProduct);
                        }
                    }
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
            return lstProduct;
        }

        public List<MVCModels.HiDoctor_Master.ProductPriceModel> GetPriceGroupHeader(string companyCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProductPrice = new List<MVCModels.HiDoctor_Master.ProductPriceModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETPRICEGROUPHEADER + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.ProductPriceModel objProductPrice = new MVCModels.HiDoctor_Master.ProductPriceModel();
                            objProductPrice.Price_Group_Code = sqldataReader["Price_Group_Code"].ToString();
                            objProductPrice.Price_Group_Name = sqldataReader["Price_Group_Name"].ToString();
                            lstProductPrice.Add(objProductPrice);
                        }
                    }
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
            return lstProductPrice;
        }

        public List<MVCModels.HiDoctor_Master.ProductPriceModel> GetPriceGroupDetails(string companyCode, string priceGroupCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProductPrice = new List<MVCModels.HiDoctor_Master.ProductPriceModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETPRICEGROUPDETAILS + " '" + companyCode + "','" + priceGroupCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.ProductPriceModel objProductPrice = new MVCModels.HiDoctor_Master.ProductPriceModel();
                            objProductPrice.Price_Group_Detail_Code = sqldataReader["Price_Group_Detail_Code"].ToString();
                            objProductPrice.Price_Code = sqldataReader["Price_Code"].ToString();
                            objProductPrice.Product_Code = sqldataReader["Product_Code"].ToString();
                            objProductPrice.Product_Name = sqldataReader["Product_Name"].ToString();
                            objProductPrice.Invoice_Amount = sqldataReader["Invoice_Amount"].ToString();
                            objProductPrice.PTS = sqldataReader["PTS"].ToString();
                            objProductPrice.PTR_WOTax = sqldataReader["PTR_WOTax"].ToString();
                            objProductPrice.MRP = sqldataReader["MRP"].ToString();
                            objProductPrice.NRV = sqldataReader["NRV"].ToString();
                            lstProductPrice.Add(objProductPrice);
                        }
                    }
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
            return lstProductPrice;
        }

        public DataSet GetSaleProducts(string companyCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETALLSALEPRODUCTS + " '" + companyCode + "'");
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


        public string InsertPriceHeader(string companyCode, string priceGroupName)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTPRICEGROUPHEADER);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@PriceGroupName", ParameterDirection.Input, SqlDbType.VarChar, 30, priceGroupName);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertPriceDetails(string companyCode, string priceGroupCode, string priceGroupDetailCode, string productCode, decimal invoiceAmount, decimal PTS, decimal PTR,
                                                decimal MRP, decimal NRV)
        {
            SPData _objSPData = new SPData();
            // string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTPRICEGROUPDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@PriceGroupCode", ParameterDirection.Input, SqlDbType.VarChar, 30, priceGroupCode);
                _objSPData.AddParamToSqlCommand(command, "@PriceGroupDetailCode", ParameterDirection.Input, SqlDbType.VarChar, 30, priceGroupDetailCode);
                _objSPData.AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                _objSPData.AddParamToSqlCommand(command, "@InvoiceAmount", ParameterDirection.Input, SqlDbType.Decimal, 11, invoiceAmount);
                _objSPData.AddParamToSqlCommand(command, "@PTS", ParameterDirection.Input, SqlDbType.Decimal, 11, PTS);
                _objSPData.AddParamToSqlCommand(command, "@PTR", ParameterDirection.Input, SqlDbType.Decimal, 11, PTR);
                _objSPData.AddParamToSqlCommand(command, "@MRP", ParameterDirection.Input, SqlDbType.Decimal, 11, MRP);
                _objSPData.AddParamToSqlCommand(command, "@NRV", ParameterDirection.Input, SqlDbType.Decimal, 11, NRV);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.StackTrace;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string DeletePriceGroupDetails(string companyCode, string priceGroupCode)
        {
            SPData _objSPData = new SPData();
            // string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETEPRICEGROUPDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@PriceGroupCode", ParameterDirection.Input, SqlDbType.VarChar, 30, priceGroupCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllProducts(string companyCode)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.ProductModel> lstProduct = new List<MVCModels.HiDoctor_Master.ProductModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETALLPRODUCTS + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.ProductModel objProduct = new MVCModels.HiDoctor_Master.ProductModel();
                            objProduct.Product_Code = sqldataReader["Product_Code"].ToString();
                            objProduct.Product_Name = sqldataReader["Product_Name"].ToString();
                            lstProduct.Add(objProduct);
                        }
                    }
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
            return lstProduct;
        }

        public string InsertSchemeHeader(string companyCode, string schemeName, string schemeBase, DateTime effectiveFrom, DateTime effectiveTo)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTSCHEMEHEADER);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeName", ParameterDirection.Input, SqlDbType.VarChar, 255, @schemeName);
                _objSPData.AddParamToSqlCommand(command, "@SchemeBase", ParameterDirection.Input, SqlDbType.VarChar, 30, @schemeBase);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.DateTime, 30, @effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.DateTime, 30, @effectiveTo);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertSchemeDetails(string companyCode, string schemeCode, string schemeDetailCode, string productCode, string schemeMode, decimal schemeBaseValue, DateTime effectiveFrom,
                                              DateTime effectiveTo)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTSCHEMEDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);
                _objSPData.AddParamToSqlCommand(command, "@SchemeDetailCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeDetailCode);
                _objSPData.AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                _objSPData.AddParamToSqlCommand(command, "@SchemeMode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeMode);
                _objSPData.AddParamToSqlCommand(command, "@SchemeBaseValue", ParameterDirection.Input, SqlDbType.Decimal, 11, schemeBaseValue);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.DateTime, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.DateTime, 30, effectiveTo);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.StackTrace;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertSchemeOfferDetails(string companyCode, string schemeDetailCode, string offerProductCode, string schemeMode, decimal offerValue)
        {
            SPData _objSPData = new SPData();
            // string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTSCHEMEOFFERDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeDetailCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeDetailCode);
                _objSPData.AddParamToSqlCommand(command, "@OfferProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, offerProductCode);
                _objSPData.AddParamToSqlCommand(command, "@SchemeMode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeMode);
                _objSPData.AddParamToSqlCommand(command, "@OfferValue", ParameterDirection.Input, SqlDbType.Decimal, 11, offerValue);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.StackTrace;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<MVCModels.HiDoctor_Master.SchemeModel> GetSchemeHeader(string companyCode)
        {
            // string companyCode = _objCurInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.SchemeModel> lstScheme = new List<MVCModels.HiDoctor_Master.SchemeModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETSCHEMEHEADER + " '" + companyCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.SchemeModel objScheme = new MVCModels.HiDoctor_Master.SchemeModel();
                            objScheme.Scheme_Code = sqldataReader["Scheme_Code"].ToString();
                            objScheme.Scheme_Name = sqldataReader["Scheme_Name"].ToString();
                            objScheme.Scheme_Base = sqldataReader["Scheme_Base"].ToString();
                            objScheme.Effective_From = sqldataReader["Effective_From"].ToString();
                            objScheme.Effective_To = sqldataReader["Effective_To"].ToString();
                            lstScheme.Add(objScheme);
                        }
                    }
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
            return lstScheme;
        }

        public DataSet GetSchemeDetails(string companyCode, string schemeCode)
        {
            //string companyCode = _objCurInfo.GetCompanyCode();
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETSCHEMEDETAILS + " '" + companyCode + "','" + schemeCode + "'");
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

        public string DeleteScheme(string companyCode, string schemeCode)
        {
            SPData _objSPData = new SPData();
            // string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETESCHEME);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteScheme(string companyCode, string schemeCode, DateTime effectiveFrom, DateTime effectiveTo)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETESCHEMEDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 255, schemeCode);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.DateTime, 30, @effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.DateTime, 30, @effectiveTo);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CheckSchemeProductValidation(string companyCode, string productCode, DateTime effectiveFrom, DateTime effectiveTo, string schemeCode)
        {
            SPData _objSPData = new SPData();
            //string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDCHECKSCHEMEPRODUCTREPETATION);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.DateTime, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveTo", ParameterDirection.Input, SqlDbType.DateTime, 30, effectiveTo);
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.StackTrace;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #region Product Master Excel Upload
        public string ProductBulkInsert(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {

                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Product_Name", "Product_Name");
                        copy.ColumnMappings.Add("Product_Short_Name", "Product_Short_Name");
                        copy.ColumnMappings.Add("Product_Blanket_Name", "Product_Blanket_Name");
                        copy.ColumnMappings.Add("Product_Description", "Product_Description");
                        copy.ColumnMappings.Add("Speciality_Name", "Speciality_Name");
                        copy.ColumnMappings.Add("Brand_Name", "Brand_Name");
                        copy.ColumnMappings.Add("Category_Name", "Category_Name");
                        copy.ColumnMappings.Add("UOM_Name", "UOM_Name");
                        copy.ColumnMappings.Add("UOM_Type_Name", "UOM_Type_Name");
                        copy.ColumnMappings.Add("Product_Group_Name", "Product_Group_Name");
                        copy.ColumnMappings.Add("Product_Type_Name", "Product_Type_Name");
                        copy.ColumnMappings.Add("Competitor_Name", "Competitor_Name");
                        copy.ColumnMappings.Add("Ref_Key1", "Ref_Key1");
                        copy.ColumnMappings.Add("Ref_Key2", "Ref_Key2");
                        copy.ColumnMappings.Add("Effective_From", "Effective_From");
                        copy.ColumnMappings.Add("Effective_To", "Effective_To");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.DestinationTableName = "tbl_SFA_Product_Master_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("subDomain", subDomain);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string ProductBulkInsertFromStagingToMaster(string companyCode, string guid, string fileName,
            string uploadedBy, string bpType, string subDomain)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@GUID", guid);
                    p.Add("@FileName", fileName);
                    p.Add("@UploadedBy", uploadedBy);
                    p.Add("@BPType", bpType);
                    p.Add("@Result","",DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HDINSERTPRODUCTMASTERFROMSTAGING, p, commandTimeout: 600, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                }
                return result;
            }
            catch(Exception ex)
            {
                return ex.Message;
            }


            //SPData _objSPData = new SPData();
            //string result = "";
            //try
            //{
            //    SqlCommand command = new SqlCommand(SP_HDINSERTPRODUCTMASTERFROMSTAGING);
            //    command.CommandType = CommandType.StoredProcedure;
            //    command.CommandTimeout = 1000;
            //    _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
            //    _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.Int, 100, guid);
            //    _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
            //    _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
            //    _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

            //    SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
            //    returnValue.Direction = ParameterDirection.Output;
            //    returnValue.Size = 500;
            //    returnValue.Value = "";
            //    command.Parameters.Add(returnValue);
            //    _objData.OpenConnectionAsync(subDomain);
            //    _objData.ExecuteNonQueryAsync(command);
            //    return result;
            //}
            //catch (Exception ex)
            //{
            //    result = "FAILURE:";
            //    Dictionary<string, string> dicObj = new Dictionary<string, string>();
            //    dicObj.Add("guid", guid);
            //    dicObj.Add("fileName", fileName);
            //    dicObj.Add("uploadedBy", uploadedBy);
            //    Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            //}
            //finally
            //{
            //    //_objData.CloseConnection();
            //}
            //return result;
        }
        #endregion Product Master Excel Upload

        public List<MVCModels.HiDoctor_Master.SpecialityModel> GetSpeciality(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.SpecialityModel> lstSpeciality = new List<MVCModels.HiDoctor_Master.SpecialityModel>();
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETSPECIALITY);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, companyCode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.SpecialityModel _objSpeciality = new MVCModels.HiDoctor_Master.SpecialityModel();
                        _objSpeciality.Speciality_Code = sqldataReader["Speciality_Code"].ToString();
                        _objSpeciality.Speciality_Name = sqldataReader["Speciality_Name"].ToString();
                        lstSpeciality.Add(_objSpeciality);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstSpeciality;
        }
        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllActiveProducts(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProduct = new List<MVCModels.HiDoctor_Master.ProductModel>();
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETALLACTIVEPRODUCTDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.ProductModel objProduct = new MVCModels.HiDoctor_Master.ProductModel();
                        objProduct.Product_Code = sqldataReader["Product_Code"].ToString();
                        objProduct.Product_Name = sqldataReader["Product_Name"].ToString();
                        objProduct.Speciality_Name = sqldataReader["Speciality_Name"].ToString();
                        objProduct.Category_Name = sqldataReader["Category_Name"].ToString();
                        objProduct.Product_Type_Name = sqldataReader["Product_Type_Name"].ToString();
                        objProduct.Brand_Name = sqldataReader["Brand_Name"].ToString();
                        objProduct.UOM_Name = sqldataReader["UOM_Name"].ToString();
                        objProduct.UOM_Type_Name = sqldataReader["UOM_Type_Name"].ToString();
                        objProduct.Ref_Key1 = sqldataReader["Ref_Key1"].ToString();
                        objProduct.Effective_From = sqldataReader["Effective_From"].ToString();
                        objProduct.Effective_To = sqldataReader["Effective_To"].ToString();

                        lstProduct.Add(objProduct);
                    }
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
            return lstProduct;
        }


        #region  primary sales Excel Upload
        public string PrimarySalesBulkInsert(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {

                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("HQ", "IT_Region_Name");
                        copy.ColumnMappings.Add("HQID", "Region_Ref_Key");
                        copy.ColumnMappings.Add("DEPOTCD", "Depot_Ref_Key");
                        copy.ColumnMappings.Add("TYPE", "ITran_Status");
                        copy.ColumnMappings.Add("INVOICE_NO", "Document_Number");
                        copy.ColumnMappings.Add("CUSTCD", "Customer_Ref_Key");
                        copy.ColumnMappings.Add("CUSTOMER_NAME", "IT_Customer_Name");
                        copy.ColumnMappings.Add("INVDATE", "Document_Date");
                        copy.ColumnMappings.Add("PRODUCTCODE", "Product_Ref_Key");
                        copy.ColumnMappings.Add("PRODUCT_DESCRIPTION", "IT_Product_Name");
                        copy.ColumnMappings.Add("INVOICEQTY", "Sales_Quantity");
                        copy.ColumnMappings.Add("FREQTY", "Free_Quantity");
                        copy.ColumnMappings.Add("VALUE", "Sales_Net_Amount");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        // copy.ColumnMappings.Add("Trans_Type", "Trans_Type");
                        copy.DestinationTableName = TBL_DEP_ITRAN_STAGING;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("subDomain", subDomain);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string PrimarySalesBulkInsertFromStagingToMaster(string companyCode, string guid, string fileName,
            string uploadedBy, string bpType, string subDomain, string transType)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTPRIMARYSALES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);
                _objSPData.AddParamToSqlCommand(command, "@TransType", ParameterDirection.Input, SqlDbType.NVarChar, 30, transType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch (Exception ex)
            {
                result = "FAILURE:";
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("guid", guid);
                dicObj.Add("fileName", fileName);
                dicObj.Add("uploadedBy", uploadedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            finally
            {
                //_objData.CloseConnection();
            }
            return result;
        }

        public DataSet GetProductsforPrimarySales(string company_Code)
        {
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(company_Code);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETPRODUCTSFORPRIMARYSALES + " '" + company_Code + "'");
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


        #endregion  primary sales Excel Upload

        #region primary sales parameters excel upload
        public DataSet GetPrimarySalesParameters(string companyCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETPSPARAMETERS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetPSEmployeeDetails(string companyCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETPSEMPLOYEEDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        /// <summary>
        /// insert/Update/change the status of the primary sales parameter columns
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="lstParam"></param>
        /// <returns></returns>
        public int InsertPSParameters(string companyCode, string mode, List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstParam)
        {
            int rowsAffected = 0;
            SPData _objSPData = new SPData();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode.ToUpper())
                    {
                        const string query = "INSERT INTO tbl_SFA_Primary_Sales_Parameters(Company_Code,Parameter_Code,Parameter_Name,Record_Status,Flag,Param_Column_Name) " +
                                             "VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Primary_Sales_Parameters,@Parameter_Name,@Record_Status,@Flag,@Param_Column_Name)";
                        rowsAffected = connection.Execute(query, lstParam, transaction: trans);
                    }
                    else if ("EDIT" == mode.ToUpper())
                    {
                        const string updateQry = "UPDATE tbl_SFA_Primary_Sales_Parameters SET Parameter_Name=@Parameter_Name ,Flag=@Flag, " +
                                                 "Param_Column_Name=@Param_Column_Name where Parameter_Code=@Parameter_Code";
                        rowsAffected = connection.Execute(updateQry, lstParam, transaction: trans);
                    }
                    else
                    {
                        const string updateQry = "UPDATE tbl_SFA_Primary_Sales_Parameters SET Record_Status=@Record_Status  " +
                                                "where Parameter_Code=@Parameter_Code";
                        rowsAffected = connection.Execute(updateQry, lstParam, transaction: trans);
                    }
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        public int CreateStagingTable(string companyCode)
        {
            int rowsAffected = 0;
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDCREATEPSPARAMETERSTAGING);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                if (returnValue.Value.ToString() == "SUCCESS")
                {
                    rowsAffected = 1;
                }
                else
                {
                    rowsAffected = 0;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                rowsAffected = 0;
            }
            return rowsAffected;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> GetAllPSParameters(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstParam = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstParam = connection.Query<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>(SP_HDGETALLPSPARAMETERS, p,
                        commandType: CommandType.StoredProcedure);
                    return lstParam;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }

        /// <summary>
        /// Insert primary sales values into staging
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="dt"></param>
        /// <param name="subDomain"></param>
        /// <param name="dtParam"></param>
        /// <returns></returns>
        public string PrimarySalesValuesBulkInsert(string companyCode, DataTable dt, string subDomain, DataTable dtParam)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        for (int i = 0; i < dtParam.Rows.Count; i++)
                        {
                            copy.ColumnMappings.Add(Convert.ToString(dtParam.Rows[i]["Param_Column_Name"]), Convert.ToString(dtParam.Rows[i]["Param_Column_Name"]));
                        }
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Region_Name", "Region_Name");
                        copy.ColumnMappings.Add("User_Name", "User_Name");
                        copy.ColumnMappings.Add("Month", "Month");
                        copy.ColumnMappings.Add("Year", "Year");
                        copy.ColumnMappings.Add("Pool_Code", "Pool_Code");
                        copy.ColumnMappings.Add("Mis_Code", "Ref_Key2");
                        copy.DestinationTableName = "tbl_SFA_Primary_Sales_Values_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("subDomain", subDomain);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string PrimarySalesValuesInsertFromStagingToMaster(string companyCode, string guid, string fileName,
        string uploadedBy, string bpType, string subDomain)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTPSVALUES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch (Exception ex)
            {
                result = "FAILURE:";
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("guid", guid);
                dicObj.Add("fileName", fileName);
                dicObj.Add("uploadedBy", uploadedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            finally
            {
                //_objData.CloseConnection();
            }
            return result;
        }

        #endregion primary sales parameters excel upload

    }
}
