using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class PromotionalInputUserModel
    {
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Status { get; set; }
    }
    public class Productmodel
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string User_Code { get; set; }
        public string Product_Type { get; set; }
        public string Batch_Number { get; set; }
        public string Product_Type_Name { get; set; }
        public int Current_Stock { get; set; }
        public int Physical_Quantity { get; set; }
        public int Variance_Count { get; set; }
        public int Logical_Quantity { get; set; }
        public string Remarks { get; set; }
        public string Rejected_Remarks { get; set; }
        public int Trans_Id { get; set; }
        public int User_Product_status { get; set; }
    }
    public class UserProductModel
    {
        public string Company_Code { get; set; }
        public string SourceUserCode { get; set; }
        public string SourceUserName { get; set; }
        public string DestinationUserCode { get; set; }
        public string DestinationUserName { get; set; }
        public string RequestedBy { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
        public int CompanyId { get; set; }
        public string UserCode { get; set; }
        public int Logical_Quantity { get; set; }
        public int VarianceCount { get; set; }
        public int Variance_Count { get; set; }
        public int Physical_Quantity { get; set; }
        public string Product_Code { get; set; }
        public string ProductCode { get; set; }
        public string Batch_Number { get; set; }
        public string Approved_By { get; set; }
        public string Approved_Date { get; set; }
        public string Product_Name { get; set; }
        public string Product_Type_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string Delivery_Challan_Number { get; set; }
        public int Trans_Id { get; set; }
    }
    public class promotionalApprovalModel
    {
        public string Source_User_Name { get; set; }
        public string Destination_User_Name { get; set; }
        public string Requested_By { get; set; }
        public string status { get; set; }
        public string Remarks { get; set; }
        public string Source_User_Code { get; set; }
        public string Destination_User_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string Transfer_Id { get; set; }
        public string Requested_Date { get; set; }
        public string User_Product_Status { get; set; }

    }

    public class ViewTransferModel
    {
        public string Product_Name { get; set; }
        public string Product_Type { get; set; }
        public string Product_Type_Name { get; set;}
        public string Batch_Number { get; set; }
        public int Logical_Quantity { get; set; }
        public int Variance_Count { get; set; }
        public int Physical_Quantity { get; set; }
        public string Remarks { get; set; }
        public string Source_User_Code { get; set; }
        public string Destination_User_Code { get; set; }
        public int Transfer_Id { get; set; }
        public int Trans_Id { get; set; }
        public string Product_Code { get; set; }
        public int User_Product_Id { get; set; }

    }
    public class RejectedRequestModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public int Trans_Id { get; set; }
        public string Rejected_Remarks { get; set; }
        public string Product_Code { get; set; }
        public int Status { get; set; }
    }

    //public class promotionalApprovalModel
    //{
    //    public string Source_User_Name { get; set; }
    //    public string Destination_User_Name { get; set; }
    //    public string Requested_By { get; set; }
    //    public int status { get; set; }
    //    public string Remarks { get; set; }
    //    public string Source_User_Code { get; set; }
    //    public string Destination_User_Code { get; set; }
    //    public string Product_Type_Name { get; set; }
    //    public string Transfer_Id { get; set; }

    //}

    //public class ViewTransferModel
    //{
    //    public string Product_Name { get; set; }
    //    public string Product_Type { get; set; }
    //    public string Product_Type_Name { get; set;}
    //    public string Batch_Number { get; set; }
    //    public int Logical_Quantity { get; set; }
    //    public int Physical_Quantity { get; set; }
    //    public string Remarks { get; set; }
    //    public string Source_User_Code { get; set; }
    //    public string Destination_User_Code { get; set; }
    //    public int Trans_Id { get; set; } 
    //    public string Product_Code { get; set; }
       


  //  }

    //public class RejectedRequestModel
    //{
    //    public string Company_Code { get; set; }
    //    public string User_Code { get; set; }
    //    public int Trans_Id { get; set; }
    //    public string Rejected_Remarks { get; set; }
    //    public string Product_Code { get; set; }
    //    public int Status { get; set; }
    //}
}
