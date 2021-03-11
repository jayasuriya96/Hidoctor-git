using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using MVCModels;

namespace DataControl
{
    public class BAL_OTC : IOTC
    {
        #region PrivateVariables
        private DAL_OTC objDALOTC = new DAL_OTC();
        private const string Success = "SUCCESS";
        #endregion PrivateVariables

        #region Interface Methods
        public List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string matchingString, string regionCode, string customerEntity)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCust = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            lstCust = objDALOTC.GetCustomerDetails(companyCode, matchingString, regionCode, customerEntity);

            return lstCust;
        }

        public List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string regionCode, string mode)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCust = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            lstCust = objDALOTC.GetCustomerDetails(companyCode, regionCode, mode);
            return lstCust;
        }


        public List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> GetSalesOrderStatus(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> lstCust = new List<MVCModels.HiDoctor_Master.SalesOrderStatusModel>();
            lstCust = objDALOTC.GetSalesOrderStatus(companyCode, regionCode);
            return lstCust;
        }

        public List<MVCModels.HiDoctor_Activity.OTCModel> GetProductDetails(string companyCode, string matchingString, string regionCode, string columnName)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstProduct = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            lstProduct = objDALOTC.GetProductDetails(companyCode, matchingString, regionCode, columnName);
            return lstProduct;
        }

        public List<MVCModels.HiDoctor_Activity.OTCModel> GetCustomerOrders(string companyCode, string regionCode, string customerCode, int month, int Year)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstCustOrder = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            lstCustOrder = objDALOTC.GetCustomerOrders(companyCode, regionCode, customerCode, month, Year);
            return lstCustOrder;
        }

        public DataSet GetOrderDetails(string companyCode, string orderId, string mode)
        {
            DataSet ds = new DataSet();
            ds = objDALOTC.GetOrderDetails(companyCode, orderId, mode);
            return ds;
        }
        public DataSet GetApproveOrder(string companyCode, string userCode,string mode)
        {
            DataSet ds = new DataSet();
            ds = objDALOTC.GetApproveOrder(companyCode, userCode,mode);
            return ds;
        }

        public List<MVCModels.HiDoctor_Activity.OTCModel> GetSchemeDetails(string companyCode, string regionCode, string productCodes, string orderDate)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstScheme = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            lstScheme = objDALOTC.GetSchemeDetails(companyCode, regionCode, productCodes, orderDate);
            return lstScheme;
        }

        #endregion Interface Methods

        public DataSet GetSalesOrderLoadDetails(string companyCode, string regionCode)
        {
            DataSet ds = new DataSet();
            ds = objDALOTC.GetSalesOrderLoadDetails(companyCode, regionCode);

            if (ds != null && ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 1)
            {

                ds.Tables[1].Columns.Remove("Region_Type_Code");
                ds.Tables[1].Columns.Remove("Region_Type_Name");
                ds.Tables[1].Columns.Remove("Full_index");
                ds.Tables[1].Columns.Remove("Region_Name");

                for (int i = 0; i < ds.Tables[1].Rows.Count; i++)
                {
                    if (ds.Tables[1].Rows[i]["User_Name"] == System.DBNull.Value)
                    {
                        DataRow[] dr;
                        dr = ds.Tables[2].Select("Region_Code='" + ds.Tables[1].Rows[i]["Region_Code"].ToString() + "'");
                        if (dr.Length > 0)
                        {
                            ds.Tables[1].Rows[i]["User_Name"] = "VACANT";
                        }
                        else
                        {
                            ds.Tables[1].Rows[i]["User_Name"] = "NOTASSIGNED";
                        }
                    }
                }

                DataRow[] drr;
                drr = ds.Tables[1].Select("Region_Code='" + regionCode + "'");
                if (drr.Length > 0)
                {
                    drr[0]["User_Name"] = "My Customer List";
                }
                ds.Tables.RemoveAt(2);
                ds.AcceptChanges();
            }
            return ds;
        }

        public string InsertOTC(string companyCode, string orderId, string orderDate, string isSubmit, string productString
                                , string custCode, string salesPersonCode, string salesPersonName, string enterBy, string enterByRegion, string orderValue
                                , string remarks, string refNumber, string productCodes, string offerCodes, string dueDate)
        {
            string result = string.Empty;
            if (orderId == null || orderId == "null" ) // new entry
            {
                orderId = orderDate.Split('-')[0] + orderDate.Split('-')[1] + orderDate.Split('-')[2];
                result = objDALOTC.InsertOTC(companyCode, orderId, orderDate, isSubmit, custCode, salesPersonCode, salesPersonName, enterBy, enterByRegion, orderValue, remarks, refNumber, dueDate);
            }
            else // old entry
            {
                result = objDALOTC.UpdateOTC(companyCode, orderId, isSubmit, orderValue, remarks, refNumber, dueDate);
            }

            if (result.Split('^')[0] == Success)
            {
                orderId = result.Split('^')[1];
                result = InsertOTCDetail(companyCode, orderId, productString, salesPersonCode, productCodes, offerCodes);
            }

            if (result.Split('^')[0] == Success)
            {
                result = Success + '^' + orderId;
            }
            return result;
        }

        public string InsertOTCDetail(string companyCode, string orderId, string productString, string salesPersonCode, string productCodes, string offerCodes)
        {
            string result = string.Empty;
            DataSet dsProd = new DataSet();
            DataRow[] dr, drr;
            string[] productArr;
            // SPCode^Qty^UnitPrice^UOM^UOMType^SchemeCode| OFFCode^OfQty~OFFCode^OfQty~ $ SPCode^Qty^UnitPrice^UOM^UOMType^null| $

            dsProd = objDALOTC.GetProductPriceDetails(companyCode, salesPersonCode, productCodes.TrimEnd('^'), offerCodes.TrimEnd('^'));

            productArr = productString.Split('$');
            if (productArr.Length > 0)
            {
                for (int i = 0; i < productArr.Length - 1; i++)
                {
                    string[] salesProArr;
                    string[] offerProArr;
                    salesProArr = productArr[i].Split('|')[0].Split('^');
                    offerProArr = productArr[i].Split('|')[1].Split('~');
                    if (salesProArr.Length > 0)
                    {
                        string orderDetailCode = orderId + '-' + (i + 1);
                        string productCode = salesProArr[0];
                        decimal orderQty = Convert.ToDecimal(salesProArr[1]);
                        decimal price = Convert.ToDecimal(salesProArr[2]);
                        string uomCode = salesProArr[3];
                        string uomTypeCode = salesProArr[4];
                        string schemeCode = salesProArr[5];

                        decimal subtotal = orderQty * price;

                        //select master price from dsProd
                        dr = dsProd.Tables[0].Select("Product_Code='" + productCode + "'");
                        decimal masterPrice = Convert.ToDecimal(dr[0]["Master_Price"]);
                        decimal priceDiff = price - masterPrice;

                        result = objDALOTC.InsertOTCDetail(companyCode, orderId, orderDetailCode, productCode, orderQty, price, uomCode, uomTypeCode, subtotal, masterPrice, priceDiff, schemeCode);

                        if (Success == result.Split('^')[0].ToUpper() && schemeCode != "NULL")
                        {
                            if (offerProArr.Length > 0)
                            {
                                for (int j = 0; j < offerProArr.Length - 1; j++)
                                {
                                    string orderOfferCode = orderDetailCode + '-' + (j + 1);
                                    string offerProduct = offerProArr[j].Split('^')[0];
                                    decimal offerValue = Convert.ToDecimal(offerProArr[j].Split('^')[1]);
                                    drr = dsProd.Tables[1].Select("Product_Code='" + offerProduct + "'");
                                    decimal offPrice = (drr[0]["Offer_Product_Price"]==System.DBNull.Value)? 0 : Convert.ToDecimal(drr[0]["Offer_Product_Price"]);
                                    string offUomCode = drr[0]["Offer_UOM_Code"].ToString();
                                    string offUomType = drr[0]["Offer_UOM_Type_Code"].ToString();
                                    decimal offSubTotal = offPrice * orderQty;


                                    result = objDALOTC.InsertOTCOfferDetail(companyCode, orderDetailCode, orderOfferCode, offerProduct, offerValue, offPrice, offUomCode, offUomType, offSubTotal, schemeCode);
                                    //result = _dalProduct.InsertSchemeOfferDetails(schemeCode + "-" + (i + 1), offerProduct, "Quantity", offerValue);
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }

        public string ChangeOrderStatus(string companyCode, char status, string orderIds, string changeBy, string approvalRemarks)
        {
            string result = string.Empty;
            result = objDALOTC.ChangeOrderStatus(companyCode, status, orderIds, changeBy, approvalRemarks);
            return result;
        }
    }
}
