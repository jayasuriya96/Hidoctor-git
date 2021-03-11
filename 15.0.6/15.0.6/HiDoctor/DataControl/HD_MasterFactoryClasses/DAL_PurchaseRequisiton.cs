using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_PurchaseRequisiton:DapperRepository
    {

        #region ConstStrings
        public const string SP_HD_PRM_GETALLMARKETINGCAMPAIGNS = "SP_HD_PRM_GetAllMarketingCampaigns";
        public const string SP_HD_PRM_GETALLSAMPLEPRODUCTSBYREGION = "SP_HD_PRM_GetAllSampleProductsByRegion";
        public const string SP_HD_PRM_GETALLPURCHASEREQUISITIONSTOPLACEORDER = "SP_HD_PRM_GetAllPurchaseRequisitionsToPlaceOrder";
        public const string SP_HD_PRM_UPDATEACKNOWLEDGEMENT = "SP_HD_PRM_UpdateAcknowledgement";
        public const string SP_HD_PRM_INSERTPLACEORDERDETAILS = "SP_HD_PRM_InsertPlaceOrderDetails";
        public const string SP_HD_PRM_GETALLPLACEORDEREDFORMS = "SP_HD_PRM_GetAllPlaceOrderedForms";
        public const string SP_HD_PRM_INSERTRECIEPTDETAILS = "SP_HD_PRM_InsertRecieptDetails";
        public const string SP_HD_PRM_GETALLRECEIPTSTODISPATCH = "SP_HD_PRM_GetAllReceiptstoDispatch";
        public const string SP_HD_PRM_GETALLACTIVEUSERTREEDETAILS = "SP_HD_PRM_GetAllActiveUSerTreeDetails";
        public const string SP_HD_PRM_GETALLREGIONHIERARCHY = "SP_HD_PRM_GetAllRegionHierarchy";
        public const string SP_HD_PRM_GETALLCHALLANS = "SP_HD_PRM_GetAllChallans";
        public const string SP_HD_PRM_GETALLINVOICES = "SP_HD_PRM_GetAllInvoices";
        public const string SP_HD_PRM_GETALLPURCHASEREQUISITIONSFORSUMMARY = "SP_HD_PRM_GetAllPurchaseRequisitionsForSummary";
        public const string SP_HD_PRM_GETALLMARKETINGCAMPAIGNSFROMREQUISITIONS = "SP_HD_PRM_GetAllMarketingCampaignsfromRequisitions";
        public const string SP_HD_PRM_GETALLORDERDETAILSBYID = "SP_HD_PRM_GetAllOrderDetailsById";
        public const string SP_HD_PRM_GETALLRECEIPTSBYORDERID = "SP_HD_PRM_GetAllReceiptsByOrderId";
        public const string SP_HD_PRM_GETALLDISPTACHPRODUCTWISE = "SP_HD_PRM_GetAllDisptachProductWise";
        #endregion

        #region privatestrings
        private SPData _objSPData = null;
        private Data _objData = null;
        #endregion


        /// <summary>
        /// Method to get All Marketing Campaigns for DropDown
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="currentregionCode"></param>
        /// <returns></returns>
        public List<CampaignModel> GetAllCampaignsBasedonRegion(string companyCode,string currentregionCode)
        {
            List<CampaignModel> lstCamp = null;
            try
            {
                using (IDbConnection conneciton = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    lstCamp = conneciton.Query<CampaignModel>(SP_HD_PRM_GETALLMARKETINGCAMPAIGNS, p, commandType: CommandType.StoredProcedure).ToList();
                    conneciton.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCamp;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="campaignCode"></param>
        /// <param name="currentregionCode"></param>
        /// <returns></returns>

        public List<SampleProductModel> GetSampleProducts(string companyCode,string campaignCode,string currentregionCode)
        {
            List<SampleProductModel> lstSamp = null;
            try
            {
                using(IDbConnection connection=IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    lstSamp = connection.Query<SampleProductModel>(SP_HD_PRM_GETALLSAMPLEPRODUCTSBYREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstSamp;
        }
        /// <summary>
        /// Method to Insert Purchase Requisition Form
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="companyId"></param>
        /// <param name="ObjPurchaseRequisitionModel"></param>
        /// <param name="ProductTable"></param>
        /// <param name="AlertTable"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>

        public bool InsertPurchaseRequisition(string companyCode,int companyId, PurchaseRequisitionModel ObjPurchaseRequisitionModel,DataTable ProductTable,DataTable AlertTable,string createdBy,string regionCode)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_HD_PRM_InserPurchaseRequisitionForm";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjPurchaseRequisitionModel.Campaign_Code);
                _objSPData.AddParamToSqlCommand(command, "@Requisition_By", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjPurchaseRequisitionModel.Requisition_By);
                _objSPData.AddParamToSqlCommand(command, "@Requisition_Date", ParameterDirection.Input, SqlDbType.DateTime, 30, ObjPurchaseRequisitionModel.Requisition_Date);
                if (ObjPurchaseRequisitionModel.Objective == null)
                {
                    _objSPData.AddParamToSqlCommand(command, "@Objective", ParameterDirection.Input, SqlDbType.VarChar, 500, "");
                }
                else
                {
                    _objSPData.AddParamToSqlCommand(command, "@Objective", ParameterDirection.Input, SqlDbType.VarChar, 500, ObjPurchaseRequisitionModel.Objective);
                }
                
                _objSPData.AddParamToSqlCommand(command, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 8, companyId);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                if (ProductTable.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Product", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PR_Product");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Product", ParameterDirection.Input, SqlDbType.Structured, ProductTable, "TVP_PR_Product");
                }
                if (AlertTable.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Alert", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PR_Alert");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Alert", ParameterDirection.Input, SqlDbType.Structured, AlertTable, "TVP_PR_Alert");
                }
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        /// <summary>
        /// Method to get all Purchase Requisitions to Place Order
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>

        public RequisitionModel GetAllPurchaseRequisitions(string companyCode)
        {
            RequisitionModel lstReq = new RequisitionModel();
            try
            {
                List<PurchaseProductModel> lstprod = null;
                List<PurchaseRequisitionModel> lsthdr = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    using(var multiselect= connection.QueryMultiple(SP_HD_PRM_GETALLPURCHASEREQUISITIONSTOPLACEORDER, p, commandType: CommandType.StoredProcedure))
                    {
                        lsthdr = multiselect.Read<PurchaseRequisitionModel>().ToList();
                        lstprod = multiselect.Read<PurchaseProductModel>().ToList();
                    }
                    lstReq.lstHeader = lsthdr;
                    lstReq.lstProd = lstprod;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstReq;
        }

        public bool UpdateAcknowledgement(string companyCode,string mode,int updateId,string updatedBy)
        {
            bool result = false;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Mode", mode);
                    p.Add("@UpdateId", updateId);
                    p.Add("@UpdatedBy", updatedBy);
                    connection.Execute(SP_HD_PRM_UPDATEACKNOWLEDGEMENT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    result = true;
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public bool InsertPlaceOrderDetails(string companyCode, int companyId, PlaceOrderModel Objplaceorder, string createdBy)
        {
            bool result = false;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CompanyId", companyId);
                    p.Add("@Requisition_Details_Id", Objplaceorder.Requisition_Details_Id);
                    p.Add("@CreatedBy", createdBy);
                    p.Add("@Ordered_On", Objplaceorder.Ordered_On);
                    p.Add("@Ordered_By", createdBy);
                    p.Add("@Vendor_Name", Objplaceorder.Vendor_Name);
                    p.Add("@Quantity", Objplaceorder.Quantity);
                    p.Add("@Remarks", Objplaceorder.Remarks);
                    connection.Execute(SP_HD_PRM_INSERTPLACEORDERDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    result = true;
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all place orders for Receipts
        /// </summary>
        /// <returns></returns>
        public List<PlaceOrderModel> GetAllPlaceOrders()
        {
            List<PlaceOrderModel> lstPlaceOrders = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    lstPlaceOrders = connection.Query<PlaceOrderModel>(SP_HD_PRM_GETALLPLACEORDEREDFORMS, null, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstPlaceOrders;
        }


        public bool InsertReceiptDetails(string companyCode,int companyId,ReceiptModel ObjReceipt,string created_by)
        {
            bool result = false;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CompanyId", companyId);
                    p.Add("@OrderId", ObjReceipt.Order_Id);
                    p.Add("@Invoice_Number", ObjReceipt.Invoice_Number);
                    p.Add("@Invoice_Date", ObjReceipt.Invoice_Date);
                    p.Add("@Quantity", ObjReceipt.Quantity);
                    p.Add("@Remarks", ObjReceipt.Remarks);
                    p.Add("@CreatedBy", created_by);
                    connection.Execute(SP_HD_PRM_INSERTRECIEPTDETAILS, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<ReceiptModel> GetAllReceiptstoDispatch(string companyCode)
        {
            List<ReceiptModel> lstRec = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstRec = connection.Query<ReceiptModel>(SP_HD_PRM_GETALLRECEIPTSTODISPATCH, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch( Exception ex)
            {
                throw;
            }
            return lstRec;
        }

        public List<ICEUserTreeModel> GetActiveUsers(string companyCode, string userCode, string includeOneLevelParent, string excludeFirstLevel, string currentUserCode)
        {
            List<ICEUserTreeModel> lstUser = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Include_Parent", includeOneLevelParent);
                    p.Add("@Exclude_First_Level", excludeFirstLevel);
                    p.Add("@CurrentUserCode", currentUserCode);
                    lstUser = connection.Query<ICEUserTreeModel>(SP_HD_PRM_GETALLACTIVEUSERTREEDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstUser;
        }

        public bool InsertDispatchDetails(string companyCode,int companyId,List<DispatchModel> lstDispatch,DataTable dtDispatch,string createdBy)
        {
            bool result = false;
            try
            {
                string comtxt = "SP_HD_PRM_InsertDispatchDetails";
                SqlCommand command = new SqlCommand(comtxt);
                command.CommandType = CommandType.StoredProcedure;


                _objData = new Data();
                _objSPData = new SPData();

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, companyId);
                if (dtDispatch.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Dispatch", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_PR_Dispatch");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_PR_Dispatch", ParameterDirection.Input, SqlDbType.Structured, dtDispatch, "TVP_PR_Dispatch");
                }
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public List<RegionDetailsModel> GetRegionHierarchy(string companyCode,string campaignCode,string regionCode)
        {
            List<RegionDetailsModel> lstReg = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@RegionCode", regionCode);
                    lstReg = connection.Query<RegionDetailsModel>(SP_HD_PRM_GETALLREGIONHIERARCHY, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
               
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstReg;
        }
        public List<DispatchModel> GetAllChallans()
        {
            List<DispatchModel> lstchall = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstchall = connection.Query<DispatchModel>(SP_HD_PRM_GETALLCHALLANS, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }                    
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstchall;
        }
        public List<ReceiptModel> GetAllInvoices()
        {
            List<ReceiptModel> lstInv = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    lstInv = connection.Query<ReceiptModel>(SP_HD_PRM_GETALLINVOICES, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstInv;
        }
        public PurchaseRequisitionSummary GetAllRequisitionstoSummary(string companyCode, string currentregionCode, string mode, string code, string startDate, string endDate)
        { 
            PurchaseRequisitionSummary ObjSumm = null;
            try
            {
                List<RequisitionSummaryModel> lstsumm = null;
                List<PurchaseProductModel> lstalerts = null;
                List<PurchaseProductModel> lstprod = null;
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Code", code);
                    p.Add("@RegionCode", currentregionCode);
                    p.Add("@Start_Date", startDate);
                    p.Add("@End_Date", endDate);
                    p.Add("@Mode", mode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_PRM_GETALLPURCHASEREQUISITIONSFORSUMMARY, p, commandType: CommandType.StoredProcedure))
                    {
                        lstsumm = multiselect.Read<RequisitionSummaryModel>().ToList();
                        lstalerts = multiselect.Read<PurchaseProductModel>().ToList();
                        lstprod = multiselect.Read<PurchaseProductModel>().ToList();
                    }
                    connection.Close();
                }
                ObjSumm = new PurchaseRequisitionSummary();
                ObjSumm.lstSummary = lstsumm;
                ObjSumm.lstAlert = lstalerts;
                ObjSumm.lstProducts = lstprod;
            }
            catch (Exception ex)
            {
                throw;
            }
            return ObjSumm;
        }
        public List<CampaignModel> GetAllMarketingCampaignsFromRequisitions(string companyCode, string currentregionCode, string Code, string mode, string startDate, string endDate)
        {
            List<CampaignModel> lstMC = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Code", Code);
                    p.Add("@RegionCode", currentregionCode);
                    p.Add("@Start_Date", startDate);
                    p.Add("@End_Date", endDate);
                    p.Add("@Mode", mode);
                    lstMC = connection.Query<CampaignModel>(SP_HD_PRM_GETALLMARKETINGCAMPAIGNSFROMREQUISITIONS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstMC;
        }
        public List<PlaceOrderModel> GetAllOrdersProductWise(int requisition_Details_Id)
        {
            List<PlaceOrderModel> lstOrd = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Requisition_Details_Id", requisition_Details_Id);
                    lstOrd = connection.Query<PlaceOrderModel>(SP_HD_PRM_GETALLORDERDETAILSBYID, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstOrd;
        }
        public List<ReceiptModel> GetAllReceiptsOrderWise(int Order_Id)
        {
            List<ReceiptModel> lstRece = null;
            try
            {
               using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", Order_Id);
                    lstRece = connection.Query<ReceiptModel>(SP_HD_PRM_GETALLRECEIPTSBYORDERID, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstRece;
        }
        public List<DispatchModel> GetAllDispatchDetailsProductWise(int Requisition_Details_Id)
        {
            List<DispatchModel> lstDis = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Requisition_Details_Id", Requisition_Details_Id);
                    lstDis = connection.Query<DispatchModel>(SP_HD_PRM_GETALLDISPTACHPRODUCTWISE, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return lstDis;
        }
    }
}
