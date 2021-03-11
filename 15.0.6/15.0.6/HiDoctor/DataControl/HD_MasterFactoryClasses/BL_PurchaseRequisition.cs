using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_PurchaseRequisition
    {
        #region DAL_Object
        DAL_PurchaseRequisiton ObjPR = new DAL_PurchaseRequisiton();
        #endregion


        /// <summary>
        /// Method to get All Marketing Campaigns for DropDown
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="currentregionCode"></param>
        /// <returns></returns>
        public List<CampaignModel> GetAllCampaignsBasedonRegion(string companyCode, string currentregionCode)
        {
            List<CampaignModel> lstCamp = null;
            try
            {
                lstCamp = ObjPR.GetAllCampaignsBasedonRegion(companyCode, currentregionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCamp;
        }
        /// <summary>
        /// Method to get all Sample Products Based on Divisions Mapped to Current Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="campaignCode"></param>
        /// <param name="currentregionCode"></param>
        /// <returns></returns>

        public List<SampleProductModel> GetSampleProducts(string companyCode, string campaignCode, string currentregionCode)
        {
            List<SampleProductModel> lstSamp = null;
            try
            {
                lstSamp = ObjPR.GetSampleProducts(companyCode, campaignCode, currentregionCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstSamp;
        }
        /// <summary>
        /// Method to Insert Purchase Requisition Form
        /// </summary>
        /// <param name="ObjPurchaseRequisitionModel"></param>
        /// <returns></returns>
        public bool InsertPurchaseRequisition(string companyCode, int companyId, string createdBy, PurchaseRequisitionModel ObjPurchaseRequisitionModel,string regionCode)
        {
            bool result = false;
            try
            {
                DataTable ProductTable = null;
                if (ObjPurchaseRequisitionModel.lstProd.Count > 0)
                {
                    ProductTable = new DataTable();
                    ProductTable.Columns.Add("CompanyCode", typeof(string));
                    ProductTable.Columns.Add("Requisition_Details_Id", typeof(int));
                    ProductTable.Columns.Add("Product_Code", typeof(string));
                    ProductTable.Columns.Add("Quantity", typeof(int));
                    ProductTable.Columns.Add("Remarks", typeof(string));
                    ProductTable.Columns.Add("Record_Status", typeof(int));
                    ProductTable.Columns.Add("Acknowledge_Status", typeof(int));
                    ProductTable.Columns.Add("Company_Id", typeof(int));
                    ProductTable.Columns.Add("Created_By", typeof(string));
                    for (int i = 0; i < ObjPurchaseRequisitionModel.lstProd.Count; i++)
                    {

                        ProductTable.Rows.Add(companyCode, ObjPurchaseRequisitionModel.lstProd[i].RowId, ObjPurchaseRequisitionModel.lstProd[i].Sample_Product, ObjPurchaseRequisitionModel.lstProd[i].Quantity,
                            ObjPurchaseRequisitionModel.lstProd[i].Remarks, 2, 0, companyId, createdBy);
                    }

                }
                DataTable AlertTable = null;
                if (ObjPurchaseRequisitionModel.lstProd.Count > 0)
                {
                    AlertTable = new DataTable();
                    AlertTable.Columns.Add("CompanyCode", typeof(string));
                    AlertTable.Columns.Add("Requisition_Details_Id", typeof(int));
                    AlertTable.Columns.Add("Purchase_Procurement_Date", typeof(string));
                    AlertTable.Columns.Add("PPD_Notification_Days", typeof(int));
                    AlertTable.Columns.Add("Dispatch_Date", typeof(string));
                    AlertTable.Columns.Add("DD_Notification_Days", typeof(int));
                    AlertTable.Columns.Add("Acknowledgement_Date", typeof(string));
                    AlertTable.Columns.Add("AD_Notification_Days", typeof(int));
                    AlertTable.Columns.Add("Record_Status", typeof(int));
                    AlertTable.Columns.Add("Company_Id", typeof(int));
                    AlertTable.Columns.Add("Created_By", typeof(string));
                    for (int j = 0; j < ObjPurchaseRequisitionModel.lstProd.Count; j++)
                    {
                        AlertTable.Rows.Add(companyCode, ObjPurchaseRequisitionModel.lstProd[j].RowId, ObjPurchaseRequisitionModel.lstProd[j].Purchase_Procurement_Date,
                            ObjPurchaseRequisitionModel.lstProd[j].PPD_Notification_Days, ObjPurchaseRequisitionModel.lstProd[j].Dispatch_Date,
                            ObjPurchaseRequisitionModel.lstProd[j].DD_Notification_Days, ObjPurchaseRequisitionModel.lstProd[j].Acknowledgement_Date,
                            ObjPurchaseRequisitionModel.lstProd[j].AD_Notification_Days, 2, companyId, createdBy);
                    }

                }
                result = ObjPR.InsertPurchaseRequisition(companyCode, companyId, ObjPurchaseRequisitionModel, ProductTable, AlertTable, createdBy,regionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public long GetNextRowId()
        {
            long value = 0;
            try
            {
                SPData ObjData = new SPData();
                value = ObjData.GetSeqNumber("SEQ_tbl_SFA_PR_Requisition_Details");
            }
            catch (Exception ex)
            {
                throw;
            }
            return value;
        }
        /// <summary>
        /// Method to get all purchase requisitions to place order
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public RequisitionModel GetAllPurchaseRequisitions(string companyCode)
        {
            RequisitionModel lstReq = null;
            try
            {
                lstReq= ObjPR.GetAllPurchaseRequisitions(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstReq;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="mode"></param>
        /// <param name="updateId"></param>
        /// <param name="updatedBy"></param>
        /// <returns></returns>
        public bool UpdateAcknowledgement(string companyCode,string mode,int updateId,string updatedBy)
        {
            bool result = false;
            try
            {
                result= ObjPR.UpdateAcknowledgement(companyCode, mode, updateId, updatedBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// Method to save place order form
        /// </summary>
        /// <param name="requisition_Det_Id"></param>
        /// <returns></returns>
        public bool InsertPlaceOrderDetails(string companyCode,int companyId,PlaceOrderModel Objplaceorder, string createdBy)
        {
            bool result = false;
            try
            {
                result=ObjPR.InsertPlaceOrderDetails(companyCode, companyId, Objplaceorder, createdBy);
            }    
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all Place Ordered for Receipts
        /// </summary>
        /// <returns></returns>
        public List<PlaceOrderModel> GetAllPlaceOrders()
        {
            List<PlaceOrderModel> lstPlaceORders = null;
            try
            {
                lstPlaceORders = ObjPR.GetAllPlaceOrders();

            }
            catch(Exception ex)
            {
                throw;
            }
            return lstPlaceORders;
        }
        /// <summary>
        /// Method to Save Receipt
        /// </summary>
        /// <param name="comapanyCode"></param>
        /// <param name="companyId"></param>
        /// <param name="ObjReceipt"></param>
        /// <param name="createdby"></param>
        /// <returns></returns>
        public bool InsertReceiptDetails(string companyCode,int companyId,ReceiptModel ObjReceipt,string createdby)
        {
            bool result = false;
            try
            {
                result = ObjPR.InsertReceiptDetails(companyCode, companyId, ObjReceipt, createdby);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get All Receipts to Dispatch
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<ReceiptModel> GetAllReceiptstoDispatch(string companyCode)
        {
            List<ReceiptModel> lstRec = null;
            try
            {
                lstRec = ObjPR.GetAllReceiptstoDispatch(companyCode);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstRec;
        }
        public  List<ICEUserTreeModel> GetActiveUsers(string companyCode,string userCode,string includeOneLevelParent,string excludeFirstLevel,string currentUserCode)
        {
            List<ICEUserTreeModel> lstUser = null;
            try
            {
                lstUser = ObjPR.GetActiveUsers(companyCode, userCode, includeOneLevelParent, excludeFirstLevel, currentUserCode);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstUser;
             
        }
        public bool InsertDispatchDetails(string companyCode,int companyId,List<DispatchModel> lstdisptach,string createdBy)
        {
            bool result = false;
            try
            {
                DataTable dtDipstach = null;
                if (lstdisptach.Count!=0)
                {
                    dtDipstach = new DataTable();
                    dtDipstach.Columns.Add("CompanyCode", typeof(string));
                    dtDipstach.Columns.Add("User_Code", typeof(string));
                    dtDipstach.Columns.Add("Challan_Number", typeof(string));
                    dtDipstach.Columns.Add("Quantity", typeof(int));
                    dtDipstach.Columns.Add("Remarks", typeof(string));
                    dtDipstach.Columns.Add("Dispatch_Date", typeof(string));
                    dtDipstach.Columns.Add("Company_Id", typeof(int));
                    dtDipstach.Columns.Add("Receipt_Id", typeof(int));
                    dtDipstach.Columns.Add("Created_By", typeof(string));
                    for (int i = 0; i < lstdisptach.Count; i++)
                    {
                        dtDipstach.Rows.Add(companyCode, lstdisptach[i].User_Code, lstdisptach[i].Challan_Number, lstdisptach[i].Quantity,lstdisptach[i].Remarks,
                            lstdisptach[i].Dispatch_Date, companyId, lstdisptach[i].Receipt_Id, createdBy);
                    }

                }


                result = ObjPR.InsertDispatchDetails(companyCode, companyId, lstdisptach,dtDipstach, createdBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<RegionDetailsModel> GetRegionHierarchy(string companyCode,string campaignCode,string regionCode)
        {
            List<RegionDetailsModel> lstReg = null;
            try
            {
                lstReg = ObjPR.GetRegionHierarchy(companyCode, campaignCode, regionCode);
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
                lstchall = ObjPR.GetAllChallans();
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
                lstInv = ObjPR.GetAllInvoices();
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstInv;
        }

        public PurchaseRequisitionSummary GetAllRequisitionstoSummary(string companyCode,string currentregionCode,string mode,string code,string startDate,string endDate)
        {
            PurchaseRequisitionSummary ObjSumm = null;
            try
            {
                ObjSumm = ObjPR.GetAllRequisitionstoSummary(companyCode, currentregionCode, code, mode, startDate, endDate);
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
                lstMC = ObjPR.GetAllMarketingCampaignsFromRequisitions(companyCode, currentregionCode, Code, mode, startDate, endDate);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstMC;
        }

        public List<PlaceOrderModel> GetAllOrdersProductWise(int requisition_details_Id)
        {
            List<PlaceOrderModel> lstOrd = null;
            try
            {
                lstOrd = ObjPR.GetAllOrdersProductWise(requisition_details_Id);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstOrd;
        }
        public List<ReceiptModel> GetAllReceiptsOrderWise(int Order_Id)
        {
            List<ReceiptModel> lstRecep = null;
            try
            {
                lstRecep = ObjPR.GetAllReceiptsOrderWise(Order_Id);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstRecep;
        }
        public List<DispatchModel> GetAllDispatchDetailsProductWise(int Requisition_Details_Id)
        {
            List<DispatchModel> lstDis = null;
            try
            {
                lstDis = ObjPR.GetAllDispatchDetailsProductWise(Requisition_Details_Id);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstDis;
        }
    }
}
