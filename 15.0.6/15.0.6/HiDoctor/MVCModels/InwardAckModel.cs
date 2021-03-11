using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class InwardAckModel
    {
        public string Delivery_Challan_Number { get; set; }
        public DateTime Inward_Upload_Actual_Date { get; set; }
        public List<InwardAck> lstInwardAck { get; set; }
        public List<InwardAckBatch> lstInwardAckBatch { get; set; }
    }

    public class InwardAck
    {
        public string User_Code { get; set; }
        public string Delivery_Challan_Number { get; set; }
        public string Header_Id { get; set; }
        public string Details_Id { get; set; }
        public string Ledger_Id { get; set; }
        public string Product_Code { get; set; }
        public string Product_Type { get; set; }
        public string Product_Name { get; set; }
        public int Uploaded_Qty { get; set; } // Send Quantity
        public int Total_Acknowledged_Qty { get; set; } // Received quantity
        public int Quantity { get; set; } // Pending Quantity
        public string RecievedDate { get; set; }
        public string Inward_Actual_Date { get; set; }
        public DateTime Inward_Upload_Actual_Date { get; set; }
        public string Total_Adjusted_Qty { get; set; }
        public string Remarks { get; set; }
        public string Created_On_Date { get; set; }
        public string Created_For_Date { get; set; }
        public string Uploaded_UserCode { get; set; }
        public string Uploaded_UserName { get; set; }
        public string Employee_Name { get; set; }
        public string User_Name { get; set; }
        public string Batch_Number { get; set; }
    }

    public class InwardAckBatch
    {
        public string Delivery_Challan_Number { get; set; }
        public string Header_Id { get; set; }
        public string Details_Id { get; set; }
        public string Product_Type { get; set; }
        public string Product_Code { get; set; }
        public string Batch_Number { get; set; }
        public int Uploaded_Qty { get; set; } // Send Quantity
        public int Quantity { get; set; } // Pending Quantity
        public int Total_Acknowledged_Qty { get; set; } // Received quantity
        public string Total_Adjusted_Qty { get; set; }
    }

    public class InwardAckWrap
    {
        public List<InwardAck> ProductInfo { get; set; }
        public List<InwardAckBatch> BatchInfo { get; set; }
    }

    public class InwardRemarksModel
    {
        public List<InwardAck> lstHeader { get; set; }
        public List<InwardledgerModel> lstLedger { get; set; }
        public List<InwardBatchledgerModel> lstBatchLedger { get; set; }
    }

    public class InwardledgerModel
    {
        public int Ledger_Id { get; set; }
        public int Details_Id { get; set; }
        public string Quantity_Type { get; set; }
        public string Inward_Actual_Date { get; set; }
        public string Inward_Entered_Date { get; set; }
        public string Remarks { get; set; }
        public int Quantity { get; set; }
    }
    public class InwardBatchledgerModel
    {
        public string Batch_Number { get; set; }
        public int Ledger_Id { get; set; }
        public int Details_Id { get; set; }
        public string Quantity_Type { get; set; }
        public string Inward_Actual_Date { get; set; }
        public string Inward_Entered_Date { get; set; }
        public string Remarks { get; set; }
        public int Quantity { get; set; }
    }

    public class InwardDeliverychallan
    {
        public int Row_No { get; set; }
        public string Delivery_Challan_Number { get; set; }
        public string Uploaded_Date { get; set; }
        public string Uploaded_User { get; set; }
    }

    public class CombinedDeliveryChallanInfo
    {
        public int PageCount { get; set; }
        public List<InwardDeliverychallan> lstDC { get; set; }
    }

    public class DCInfoWrap
    {
        public List<DeliveryChallanInfo> ProductInfo { get; set; }
        public List<DeliveryChallanBatchInfo> BatchInfo { get; set; }
    }

    public class DeliveryChallanInfo
    {
        public int Details_id { get; set; }
        public string Product_Type { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public int Pending { get; set; }
    }

    public class DeliveryChallanBatchInfo
    {
        public int Details_id { get; set; }
        public string Product_Type { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Batch_Number { get; set; }
        public int Pending { get; set; }
    }

    public class InwardAdj
    {
        public int Details_Id { get; set; }
        public string Delivery_Challan { get; set; }
        public string Product_Code { get; set; }
        public string Batch_Number { get; set; }
        public int AdjustingQty { get; set; }
        public string Quantity_Type { get; set; }
        public string InwardActualDate { get; set; }
        public string Remarks { get; set; }

    }
}
