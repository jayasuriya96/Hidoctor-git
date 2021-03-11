using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Runtime.Caching;
using MVCModels.HiDoctor_Activity;

namespace DataControl
{
    public class DAL_OTC
    {

        #region Private Variables
        private Data _objData = new Data();
        private CurrentInfo _objcurrentInfo = new CurrentInfo();

        private const string SP_mhdSaleOrderLoadingDetails = "EXEC SP_mhdSaleOrderLoadingDetails ";
        private const string SP_mhdGetEntityWiseCustomerList = "EXEC SP_mhdGetEntityWiseCustomerList ";
        private const string SP_mhdGetCustomerOrderDetails = "EXEC SP_mhdGetCustomerOrderDetails ";
        private const string SP_mhdGetOrderDetails = "EXEC SP_mhdGetOrderDetails ";
        private const string SP_mhdGetProductFromPriceGroup = "EXEC SP_mhdGetProductFromPriceGroup";
        private const string SP_mhdGetCustomerlist = "EXEC SP_mhdGetcustomerlist";
        private const string SP_mhdGetSalesOrderStatus = "EXEC SP_mhdGetSalesOrderStatus";
        private const string SP_mhdGetOTCScheme = "EXEC SP_mhdGetOTCScheme";
        private const string SP_mhdGetProductPriceDetails = "EXEC SP_mhdGetProductPriceDetails";
        private const string SP_mhdGetApproveorder = "EXEC SP_mhdGetApproveOrder";

        // Insert Update SP's
        private const string SP_mhdInsertOTCHeader = "SP_mhdInsertOTCHeader";
        private const string SP_mhdUpdateOTCHeader = "SP_mhdUpdateOTCHeader";
        private const string SP_mhdInsertOTCDetails = "SP_mhdInsertOTCDetails";
        private const string SP_mhdInsertOTCOfferDetails = "SP_mhdInsertOTCOfferDetails";
        private const string SP_mhdOrderChangeStatus = "SP_mhdOrderChangeStatus";

        #endregion Private Variables

        #region Private Methods
        private List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);

            var cols = dr.GetSchemaTable().Rows.Cast<DataRow>().Select(row => row["ColumnName"] as string).ToList();
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (cols.Contains(prop.Name))
                    {
                        if (!object.Equals(dr[prop.Name], DBNull.Value))
                        {
                            prop.SetValue(obj, dr[prop.Name], null);
                        }
                    }
                }
                list.Add(obj);
            }
            return list;
        }
        #endregion Private Methods

        public List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string matchingString, string regionCode, string customerEntity)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCust = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetEntityWiseCustomerList + " '" + companyCode + "','" + matchingString + "','" + regionCode + "','" + customerEntity + "'"))
                {
                    lstCust = DataReaderMapToList<MVCModels.HiDoctor_Master.CustomerModel>(reader);
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

            return lstCust;
        }

        public List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string regionCode, string mode)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCust = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetCustomerlist + " '" + companyCode + "','" + regionCode + "','" + mode + "'"))
                {
                    lstCust = DataReaderMapToList<MVCModels.HiDoctor_Master.CustomerModel>(reader);
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
            return lstCust;
        }

        public List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> GetSalesOrderStatus(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> lstCust = new List<MVCModels.HiDoctor_Master.SalesOrderStatusModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetSalesOrderStatus + " '" + companyCode + "','" + regionCode + "'"))
                {
                    lstCust = DataReaderMapToList<MVCModels.HiDoctor_Master.SalesOrderStatusModel>(reader);
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
            return lstCust;
        }

        /// <summary>
        /// Function that gets product pricig group details for a given company + region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="matchingString"></param>
        /// <param name="regionCode"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Activity.OTCModel> GetProductDetailsForRegion(string companyCode, string matchingString, string regionCode, string columnName)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstProduct = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            string cacheKey = "otcpp_" + companyCode + regionCode;
            try
            {
                List<OTCModel> outFromCache = null;
                if (!ASPNETCacheProvider.Get<List<OTCModel>>(cacheKey, out outFromCache))
                {
                    _objData.OpenConnection(companyCode);
                    using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetProductFromPriceGroup + " '" + companyCode + "','let^let','" + regionCode + "','BOTH'"))
                    {
                        lstProduct = DataReaderMapToList<MVCModels.HiDoctor_Activity.OTCModel>(reader);
                    }
                    //not in cache- add it
                    ASPNETCacheProvider.Add<List<OTCModel>>(lstProduct, cacheKey);
                }
                else
                    lstProduct = outFromCache;
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



        public List<MVCModels.HiDoctor_Activity.OTCModel> GetProductDetails(string companyCode, string matchingString, string regionCode, string columnName)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstProduct = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetProductFromPriceGroup + " '" + companyCode + "','" + matchingString + "','" + regionCode + "','" + columnName + "'"))
                {
                    lstProduct = DataReaderMapToList<MVCModels.HiDoctor_Activity.OTCModel>(reader);
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

        public List<MVCModels.HiDoctor_Activity.OTCModel> GetCustomerOrders(string companyCode, string regionCode, string customerCode, int month, int Year)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstCustOrder = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetCustomerOrderDetails + " '" + companyCode + "','" + regionCode + "','" + customerCode + "','" + month + "','" + Year + "'"))
                {
                    lstCustOrder = DataReaderMapToList<MVCModels.HiDoctor_Activity.OTCModel>(reader);
                    //ds = _objData.ExecuteDataSet(SP_mhdGetCustomerOrderDetails + " '" + companyCode + "','" + userCode + "','" + customerCode + "','" + month + "','" + Year + "'");
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

            return lstCustOrder;
        }

        public DataSet GetOrderDetails(string companyCode, string orderId, string mode)
        {
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet(SP_mhdGetOrderDetails + " '" + companyCode + "','" + orderId + "','" + mode + "'");
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
        public DataSet GetApproveOrder(string companyCode, string userCode, string mode)
        {
            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet(SP_mhdGetApproveorder + " '" + companyCode + "','" + userCode + "','" + mode + "'");
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

        public DataSet GetSalesOrderLoadDetails(string companyCode, string regionCode)
        {

            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet(SP_mhdSaleOrderLoadingDetails + " '" + companyCode + "','" + regionCode + "'");
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

        public List<MVCModels.HiDoctor_Activity.OTCModel> GetSchemeDetails(string companyCode, string regionCode, string productCodes, string orderDate)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstScheme = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader(SP_mhdGetOTCScheme + " '" + companyCode + "','" + regionCode + "','" + productCodes + "','" + orderDate + "'"))
                {
                    lstScheme = DataReaderMapToList<MVCModels.HiDoctor_Activity.OTCModel>(reader);
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

        public DataSet GetProductPriceDetails(string companyCode, string regionCode, string productCodes, string offerCodes)
        {

            DataSet ds = null;
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    ds = _objData.ExecuteDataSet(SP_mhdGetProductPriceDetails + " '" + companyCode + "','" + regionCode + "','" + productCodes + "','" + offerCodes + "'");
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


        // Insert order Header record.
        public string InsertOTC(string companyCode, string orderId, string orderDate, string isSubmit, string custCode, string salesPersonCode
                                , string salesPersonName, string enterBy, string enterByRegion, string orderValue, string remarks, string refNumber, string dueDate)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_mhdInsertOTCHeader);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, custCode);
                _objSPData.AddParamToSqlCommand(command, "@CustomerRegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, salesPersonCode);
                _objSPData.AddParamToSqlCommand(command, "@SalesPersonName", ParameterDirection.Input, SqlDbType.VarChar, 30, salesPersonName);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderDate", ParameterDirection.Input, SqlDbType.Date, 30, orderDate);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderId);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderAmt", ParameterDirection.Input, SqlDbType.Decimal, 30, orderValue);
                _objSPData.AddParamToSqlCommand(command, "@EnteredBy", ParameterDirection.Input, SqlDbType.VarChar, 30, enterBy);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, enterByRegion);
                _objSPData.AddParamToSqlCommand(command, "@DeliveryDate", ParameterDirection.Input, SqlDbType.Date, 30, dueDate);
                _objSPData.AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, remarks.Length, remarks);
                _objSPData.AddParamToSqlCommand(command, "@IsSubmit", ParameterDirection.Input, SqlDbType.Int, 3, isSubmit);
                _objSPData.AddParamToSqlCommand(command, "@RefNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, refNumber);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }

        // Update order header record. this will also delete the corresponding order detail and offer detail record.
        public string UpdateOTC(string companyCode, string orderId, string isSubmit, string orderValue, string remarks, string refNumber, string dueDate)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_mhdUpdateOTCHeader);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderId);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderAmt", ParameterDirection.Input, SqlDbType.Decimal, 30, orderValue);
                _objSPData.AddParamToSqlCommand(command, "@DeliveryDate", ParameterDirection.Input, SqlDbType.Date, 30, dueDate);
                _objSPData.AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, remarks.Length, remarks);
                _objSPData.AddParamToSqlCommand(command, "@IsSubmit", ParameterDirection.Input, SqlDbType.Int, 3, isSubmit);
                _objSPData.AddParamToSqlCommand(command, "@RefNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, refNumber);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }

        // Insert OTC Detail
        public string InsertOTCDetail(string companyCode, string orderId, string orderDetailCode, string productCode, decimal orderQty, decimal price
                                      , string uomCode, string uomTypeCode, decimal subtotal, decimal masterPrice, decimal priceDiff, string schemeCode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_mhdInsertOTCDetails);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderId);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderDetailCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderDetailCode);
                _objSPData.AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                _objSPData.AddParamToSqlCommand(command, "@OrderedQty", ParameterDirection.Input, SqlDbType.Decimal, 30, orderQty);
                _objSPData.AddParamToSqlCommand(command, "@UnitPrice", ParameterDirection.Input, SqlDbType.Decimal, 30, price);
                _objSPData.AddParamToSqlCommand(command, "@UOMCode", ParameterDirection.Input, SqlDbType.VarChar, 30, uomCode);
                _objSPData.AddParamToSqlCommand(command, "@UOMTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, uomTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@SubTotal", ParameterDirection.Input, SqlDbType.Decimal, 30, subtotal);
                _objSPData.AddParamToSqlCommand(command, "@MasterPrice", ParameterDirection.Input, SqlDbType.Decimal, 30, masterPrice);
                _objSPData.AddParamToSqlCommand(command, "@PriceDifference", ParameterDirection.Input, SqlDbType.VarChar, 30, priceDiff);
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);




                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }


        // Insert OTC OFFER DETAIL
        public string InsertOTCOfferDetail(string companyCode, string orderDetailCode, string orderOfferId, string productCode, decimal orderQty, decimal price
                                      , string uomCode, string uomTypeCode, decimal subtotal, string schemeCode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_mhdInsertOTCOfferDetails);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderDetailCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderDetailCode);
                _objSPData.AddParamToSqlCommand(command, "@SaleOrderOfferCode", ParameterDirection.Input, SqlDbType.VarChar, 30, orderOfferId);
                _objSPData.AddParamToSqlCommand(command, "@ProductCode", ParameterDirection.Input, SqlDbType.VarChar, 30, productCode);
                _objSPData.AddParamToSqlCommand(command, "@Quantity", ParameterDirection.Input, SqlDbType.Decimal, 30, orderQty);
                _objSPData.AddParamToSqlCommand(command, "@UnitPrice", ParameterDirection.Input, SqlDbType.Decimal, 30, price);
                _objSPData.AddParamToSqlCommand(command, "@UOMCode", ParameterDirection.Input, SqlDbType.VarChar, 30, uomCode);
                _objSPData.AddParamToSqlCommand(command, "@UOMTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, uomTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@SubTotal", ParameterDirection.Input, SqlDbType.Decimal, 30, subtotal);
                _objSPData.AddParamToSqlCommand(command, "@SchemeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, schemeCode);


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }


        // Approve or Unapprove status
        public string ChangeOrderStatus(string companyCode, char status, string orderIds, string changeBy, string approvalRemarks)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_mhdOrderChangeStatus);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);
                _objSPData.AddParamToSqlCommand(command, "@OrderIds", ParameterDirection.Input, SqlDbType.VarChar, orderIds.Length, orderIds);
                _objSPData.AddParamToSqlCommand(command, "@ChangeBy", ParameterDirection.Input, SqlDbType.VarChar, 30, changeBy);
                _objSPData.AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, approvalRemarks.Length, approvalRemarks);
                
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
        }

    }
}
