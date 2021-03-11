using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class CampaignModel
    {
        public string Campaign_Name { get; set; }
        public string Campaign_Code { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
    }
    public class SampleProductModel
    {
        public string Sample_Code { get; set; }
        public string Sample_Name { get; set; }
    }
    public class PurchaseRequisitionModel
    {
        public string Requisition_Date { get; set; }
        public string Requisition_By { get; set; }
        public string Objective { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public int Requisition_Id { get; set; }
        public List<PurchaseProductModel> lstProd { get; set; }
    }
    public class PurchaseProductModel
    {
        public int RowId { get; set; }
        public string Sample_Product { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; }
        public string Purchase_Procurement_Date { get; set; }
        public int PPD_Notification_Days { get; set; }
        public string Dispatch_Date { get; set; }
        public int DD_Notification_Days { get; set; }
        public string Acknowledgement_Date { get; set; }
        public int AD_Notification_Days { get; set; }
        public int Acknowledge_Status { get; set; }
        public string Product_Name { get; set; }
        public int Requisition_Id { get; set; }
        public int Requisition_Details_Id { get; set; }
        public string Requested_Quantity { get; set; }
        public string Ordered_Quantity { get; set; }
        public string Received_Quantity { get; set; }
        public string Dispatched_Quantity { get; set; }
    }
    public class RequisitionModel
    {
        public List<PurchaseProductModel> lstProd { get; set; }
        public List<PurchaseRequisitionModel> lstHeader { get; set; }
    }
    public class PlaceOrderModel
    {
        public string Vendor_Name { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; }
        public int Requisition_Details_Id { get; set; }
        public string Ordered_On { get; set; }
        public string Ordered_By { get; set; }
        public int Order_Id { get; set; }
        public string User_Name { get; set; }
        public string Product_Name { get; set; }
        public int Received_Quantity { get; set; }
        public int Requisition_Id { get; set; }
        public string Campaign_Name { get; set; }
        public string Requisition_By { get; set; }

    }
    public class ReceiptModel
    {
        public string Invoice_Number { get; set; }
        public string Invoice_Date { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; }
        public int Order_Id { get; set; }
        public int Receipt_Id { get; set; }
        public string Product_Name { get; set; }
        public string Receipt_By { get; set; }
        public string Receipt_On { get; set; }
        public int Acknowledge_Status { get; set; }
        public int Dispatched_Quantity { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name{ get; set; }
        public string Requisition_By { get; set; }
    }
    public class DispatchModel
    {
        public int Receipt_Id { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; }
        public string Challan_Number { get; set; }
        public string Dispatch_Date { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public int Dispatch_Id { get; set; }
        public string Region_Name { get; set; }
        public string Employee_Name { get; set; }
    }
    public class RequisitionSummaryModel
    {
        public int Requisition_Id { get; set; }
        public int Requisition_Details_Id { get; set; }
        public string Requisition_By { get; set; }
        public string Requisition_Date { get; set; }
        public string Requested_Quantity { get; set; }
        public string Ordered_Quantity { get; set; }
        public string Received_Quantity { get; set; }
        public string Dispatched_Quantity { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }

    }
    public class PurchaseRequisitionSummary
    {
        public List<RequisitionSummaryModel> lstSummary { get; set; }
        public List<PurchaseProductModel> lstAlert { get; set; }
        public List<PurchaseProductModel> lstProducts { get; set; }
    }
}
