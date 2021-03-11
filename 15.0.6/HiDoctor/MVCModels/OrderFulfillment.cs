using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    public class OrderFulfillment
    {
        public class Order
        {
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public string subDomainName { get; set; }
            public DateTime Order_Date { get; set; }
            public int Company_Id { get; set; }
            public int Order_Id { get; set; }
            public string OrderRegion { get; set; }
            public string Stockiest_Code { get; set; }
            public string Stockiest_Name { get; set; }
            public string Remarks { get; set; }
            public string Status { get; set; }
            public string Product { get; set; }
            public string CompanyCode { get; set; }
            public string Entity { get; set; }
            public string Customer_Code { get; set; }
            public string Start_Date { get; set; }
            public string End_Date { get; set; }
        }
        public class OrderCancelData
        {
            public string Product { get; set; }
            public string subDomainName { get; set; }
        }
        public class RegionWiseStockiest
        {
            public string Stockiest_Code { get; set; }
            public string Stockiest_Name { get; set; }
            public string Customer_Code { get; set; }
            public string Customer_Name { get; set; }
            public string Category { get; set; }
            public string Speciality_Name { get; set; }
            public string MDL_Number { get; set; }
            public string Customer_Entity_Type { get; set; }
        }
        public class RegionWiseProduct
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Unit_Rate { get; set; }
        }
        public class RegionModel
        {
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public string Region_Type_Name { get; set; }
        }
        public class POBOrder
        {
            public List<OrderMaintenance> lstOrder { get; set; }
            public List<OrderPOBDetails> lstDetails { get; set; }
        }

        public class OrderMaintenance
        {
            public int Order_Number { get; set; }
            public string Customer_Name { get; set; }
            public string Customer_Entity_Type { get; set; }
            public string Order_Date { get; set; }
            public string Order_Due_Date { get; set; }
            public string Stokiest_Name { get; set; }
            public string Remarks { get; set; }
            public int Order_Id { get; set; }
            public string Region_Code { get; set; }
            public string Stockiest_Code { get; set; }
        }
        public class OrderPOBDetails
        {
            public int Order_Id { get; set; }
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Product_Qty { get; set; }
            public decimal Product_Unit_Rate { get; set; }
            public decimal Product_Amount { get; set; }
            public decimal Dispatch_Qty { get; set; }
            public decimal Cancelled_Qty { get; set; }
            public decimal Balance_Qty { get; set; }
            public int Status { get; set; }
            public string id { get; set; }
            public string label { get; set; }
        }
        public class OrderProduct
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Product_Qty { get; set; }
            public decimal Product_Unit_Rate { get; set; }
            public decimal Product_Amount { get; set; }
        }
        public class OrderCancelProduct
        {
            public int Company_Id { get; set; }
            public int Order_Id { get; set; }
            public string Product_Code { get; set; }
            public decimal Cancel_Qty { get; set; }
            public string Remarks { get; set; }
            public string UserCode { get; set; }

        }
        public class OrderShipment
        {
            public int Order_Id { get; set; }
            public string Order_Date { get; set; }
            public int Order_Number { get; set; }
            public string Customer_Name { get; set; }
            public string Stockiest_Name { get; set; }
            public string User_Name { get; set; }
            public string Created_date { get; set; }
        }
        public class OrderShipmentDetails
        {
            public int Company_Id { get; set; }
            public string UserCode { get; set; }
            public int Order_Id { get; set; }
            public string InvoiceNo { get; set; }
            public DateTime InvoiceDate { get; set; }
            public DateTime DispatchDate { get; set; }
            public DateTime AckDate { get; set; }
            public string UploadImg { get; set; }
            public string Attachment { get; set; }
            public string lstProduct { get; set; }
            public string subDomainName { get; set; }
            //public List<OrderShipmentProductDetails> lstProduct { get; set; }

        }
        public class OrderShipmentProductDetails
        {
            public string Product_Name { get; set; }
            public string Product_Code { get; set; }
            public decimal Dispatch_Qty { get; set; }
            public decimal Rate { get; set; }
            public string Product_Type { get; set; }
        }
        public class SummaryDetails
        {
            public List<OrderMaintenance> lstOrder { get; set; }
            public List<OrderPOBDetails> lstDetails { get; set; }
            public List<Cancel> lstCancel { get; set; }
        }
        public class Cancel
        {
            public int Order_Id { get; set; }
        }
        public class DispatchDetails
        {
            public List<DispatchProduct> lstProduct { get; set; }
            public List<DispatchHeaderDetails> lstHeader { get; set; }
            public List<DispatchProductDetails> lstDetails { get; set; }
            public List<PartialCancelation> lstCancel { get; set; }
        }
        public class DispatchProduct
        {
            public string Product_Code { get; set; }
            public string Product_Qty { get; set; }
            public string Product_Name { get; set; }
            public decimal Dispatch_Qty { get; set; }
            public decimal Cancelled_Qty { get; set; }
            public decimal Balance_Qty { get; set; }
        }
        public class DispatchHeaderDetails
        {
            public string Invoice_No { get; set; }
            public string Invoice_Date { get; set; }
            public string Dispatch_Date { get; set; }
            public string Acknowledge_Date { get; set; }
            public string Attachement { get; set; }
            public int Dispatch_Id { get; set; }

        }
        public class DispatchProductDetails
        {
            public string Product_Code { get; set; }
            public string Dispatch_Quantity { get; set; }
            public string Rate { get; set; }
            public string Product_Name { get; set; }
            public int Dispatch_Id { get; set; }

        }
        public class PartialCancelation
        {
            public string Cancel_Qty { get; set; }
            public string Product_Name { get; set; }
            public string Remarks { get; set; }
            public string Created_by { get; set; }
            public string Created_date { get; set; }
        }
        public class PobOrder
        {
            public int Order_Id { get; set; }
            public int Order_Number { get; set; }
        }
        public class OrderList
        {
            public string Product { get; set; }
            public string date { get; set; }
            public string subDomainName { get; set; }
            public int Company_Id { get; set; }
            public string UserCode { get; set; }
            public string Region_Code { get; set; }
            public string Customer_Code { get; set; }
            public string Stockiest_Code { get; set; }
            public string DueDate { get; set; }
            public string Customer_Name { get; set; }
            public string Category { get; set; }
            public string Speciality_Name { get; set; }
            public string MDL_Number { get; set; }
            public string Customer_Entity_Type { get; set; }
            public string remark { get; set; }
            public int Order_Id { get; set; }
        }
        public class DateCapturingModel
        {
            public string Date { get; set; }
            public string Date_Format { get; set; }
            public string Off_Set { get; set; }
            public string TimeZone { get; set; }
            public string UTC_Date { get; set; }
        }
        public class Oredertvp
        {

            public string Product_Code { get; set; }
            public decimal Dispatch_Quantity { get; set; }
            public decimal Rate { get; set; }
            public decimal Amount { get; set; }
        }


        public class HDAccessInfo
        {
            public int Is_Web_Access { get; set; }
            public int Is_App_Access { get; set; }
        }

        public class HDAccessForUser
        {
            public string CompanyCode { get; set; }
            public string UserCode { get; set; }
            public string LoginUserCode { get; set; }
            public int Is_Web_Access { get; set; }
            public int Is_App_Access { get; set; }
            public string Created_by { get; set; }
            public string Updated_By { get; set; }
            public string subDomainName { get; set; }
        }

        public class SingleDeviceLockEntries
        {
            public int Id { get; set; }
            public string UserName { get; set; }
            public string User_Code { get; set; }
            public string Region_Code { get; set; }
            public string Device_Platform { get; set; }
            public string Device_Os_Version { get; set; }
            public string App_Version_Name { get; set; }
            public string App_Version_Code { get; set; }
            public string Device_Model { get; set; }
            public string Device_Name { get; set; }
            public string Device_Release_Version { get; set; }
            public string Device_GUID { get; set; }
            public string GUID_GeneratedDateTime { get; set; }
            public string Company_Code { get; set; }
            public string GUID_DeactivatedDateTime { get; set; }
            public string GUID_DeactivatedBy { get; set; }
        }

        public class ReleaseSingleDeviceLock
        {
            public int Id { get; set; }
            public string CompanyCode { get; set; }
            public string UserCode { get; set; }
            public string LoginUserCode { get; set; }
            public string Reason { get; set; }
            public string Device_GUID { get; set; }
            public string subDomainName { get; set; }
        }

        public class SingleDeviceRelease
        {

            public int Id { get; set; }
            public string UserName { get; set; }
            public string User_Code { get; set; }
            public string Region_Code { get; set; }
            public string Device_Platform { get; set; }
            public string Device_Os_Version { get; set; }
            public string App_Version_Name { get; set; }
            public string App_Version_Code { get; set; }
            public string Device_Model { get; set; }
            public string Device_Name { get; set; }
            public string Device_Release_Version { get; set; }
            public string Device_GUID { get; set; }
            public string GUID_GeneratedDateTime { get; set; }
            public string Company_Code { get; set; }
            public string Remarks { get; set; }
            public string GUID_DeactivatedDateTime { get; set; }
            public string GUID_DeactivatedBy { get; set; }
        }

        public class HDAccessDetails
        {
            public string User_Name { get; set; }
            public string Is_Web_Access { get; set; }
            public string Is_App_Access { get; set; }
            public string Created_On { get; set; }
            public string Created_By { get; set; }
            public string Updated_On { get; set; }
            public string Updated_By { get; set; }
        }
    }
}
