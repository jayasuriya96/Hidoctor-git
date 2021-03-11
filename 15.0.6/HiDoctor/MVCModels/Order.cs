using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class Order
    {
        public OrderInputs orderInputs = new OrderInputs();
        public OrderList tblOrder = new OrderList();
        public OrderAdd orderAdd = new OrderAdd();
    }

    public class OrderInputs
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }

        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }

        // Orders Status 
        public int Order_Id { get; set; }
        public int Order_Status { get; set; }
        public int Order_Mode { get; set; }
        public string Created_By { get; set; }
        public DateTime Order_Date { get; set; }
    }

    public class OrderList
    {
        public int Order_Id { get; set; }
        public string Favouring_Region_Code { get; set; }
        public string Customer_Region_Code { get; set; }
        public string Customer_Visit_Code { get; set; }
        public int Order_Number { get; set; }
        public DateTime Order_Date { get; set; }
        public string Customer_Code { get; set; }
        public string Local_Area { get; set; }
        public string Customer_Name { get; set; }
        public string Stockiest_Code { get; set; }
        public string Stockiest_Name { get; set; }
        public int No_Of_Products { get; set; }
        public decimal Total_Value { get; set; }
        public DateTime Order_Due_Date { get; set; }
        public string Order_Status { get; set; }
        public string Order_Mode { get; set; }
        public string Created_By { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
    }

    public class OrderAdd
    {
        public DateTime Order_Date { get; set; }
        public List<OrderHeader> lstHeader { get; set; }
        public List<OrderDetails> lstDetails { get; set; }
    }

    public class FavouringUser
    {
        public string Favouring_User_Code { get; set; }
        public string Favouring_User_Name { get; set; }
    }

    public class LineOfBusiness
    {
        public string Division_Code { get; set; }
        public int Line_Of_Business { get; set; }
        public string Entity_Code { get; set; }
    }


    public class OrderHeader
    {

        public string Stockist_Name { get; set; }

        public int ID { get; set; }
        public int Client_Order_Id { get; set; }
        public int Order_Id { get; set; }
        public int Order_Number { get; set; }
        public byte Order_Status { get; set; }
        public byte Order_Mode { get; set; }
        public byte Source_Of_Entry { get; set; }
        public string Favouring_User_Code { get; set; }
        public string Favouring_User_Name { get; set; }
        public string Favouring_Region_Code { get; set; }
        public string Created_By { get; set; }
        public DateTime Created_Date { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Region_Code { get; set; }
        public string Stockist_Code { get; set; }
        public string Stockist_Region_Code { get; set; }
        public DateTime? Order_Due_Date { get; set; }
        public decimal Total_Qty { get; set; }
        public decimal Total_POB_Value { get; set; }
        public System.Int16 No_Of_Products { get; set; }
        public string Remarks { get; set; }

        public DateTime Order_Date { get; set; }
        public DateTime DCR_Actual_Date { get; set; }
        // public string Customer_Visit_Code { get; set; }
        public DateTime Updated_Date { get; set; }
        public int Action { get; set; }

        public string Customer_Name { get; set; }
        public string Customer_Speciality { get; set; }
        public string MDL_Number { get; set; }
        public string Customer_Category_Code { get; set; }
        public int CV_Visit_Id { get; set; }
        public List<OrderDetails> Orderdetails { get; set; }
    }

    public class OrderDetails
    {
        public int ID { get; set; }
        public int Client_Order_Id { get; set; }
        public int Order_Id { get; set; }
        public int Order_Detail_ID { get; set; }
        public string Product_Code { get; set; }
        public decimal Product_Qty { get; set; }
        public decimal Unit_Rate { get; set; }
        public decimal Amount { get; set; }
        public string Product_Name { get; set; }
    }

    public class OrderProductDetails
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string Brand_Code { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Name { get; set; }
        public string Category_Code { get; set; }
        public decimal Unit_Rate { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string Price_group_Code { get; set; }
    }

    public class POBReportCount
    {
        public string Total_Amount { get; set; }
        public string POB_Count { get; set; }
        public string Entity_Count { get; set; }
        public string Entity_Type { get; set; }
        public string Record_Count_Type { get; set; }
    }
    public class DigitalSignatureModel
    {
        public string Doctor_Name { get; set; }
        public string Region_Name { get; set; }
        public string Entity_Name { get; set; }
        public string Entity_Type { get; set; }
        public string Entity_Region_Name { get; set; }
        public string Uploaded_File_Name { get; set; }
        public string Blob_Url { get; set; }
        public Int64 Row_No { get; set; }
        public Int64 Display_Order { get; set; }
    }
}
