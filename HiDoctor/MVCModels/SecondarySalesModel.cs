using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class SecondarySalesSelectedProductModel
    {
        public string Code { get; set; }
    }

    public class SecondarySalesClosingBalance
    {
        public string Product_Code { get; set; }
    }

    public class SecondarySalesProductDetail
    {
        public string Product_Code { get; set; }
        public string productCode { get; set; }
        public string Product_Name { get; set; }
        public string Ref_Key1 { get; set; }
    }
    public class SecondarySalesProductPriceModel
    {
        public string Product_Code { get; set; }
        public string Price_Type { get; set; }
        public string MRP { get; set; }
        public string MRP_WOTax { get; set; }
        public string NRV { get; set; }
        public string PTR { get; set; }

        public string PTR_WOTax { get; set; }
        public string PTS { get; set; }
        public string PTS_Price { get; set; }
        public string Price_Code { get; set; }
        public string INVOICE_AMOUNT { get; set; }

    }

    public class SecondarySalesOpeningbalanaceModel
    {
        public string Customer_Code { get; set; }
        public string Month { get; set; }
        public string Opening_Balance { get; set; }
        public string Product_Code { get; set; }
        public string Year { get; set; }
        public string Customer_Name { get; set; }
        public double Amount { get; set; }
        public double Quantity { get; set; }
        public string IS_Inherited { get; set; }
    }

    public class GetMonthYear
    {
        public string Month { get; set; }
        public string Year { get; set; }
    }

    public class SecondarySalesforCustomerModel
    {
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Region_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Base_Code { get; set; }
        public string SS_Statement_Date { get; set; }
    }

    public class SecondarysalesProductdetailsModel
    {
        public string Region_Code { get; set; }
        public string SS_Details_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Qty { get; set; }
    }

    public class SecondarySalesCustomerProductDeatilsModel
    {
        public string Company_Code { get; set; }
        public string SS_Line_Id { get; set; }
        public string SS_Details_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Entity_Type { get; set; }
        public int Quantity { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Status { get; set; }
        public string Entered_By { get; set; }
        public string Entered_Date { get; set; }
    }

    public class SecondarySalesDetailsforCustomerModel
    {
        public List<SecondarysalesProductdetailsModel> lstSecondarysalesProducts { get; set; }
        public List<SecondarySalesCustomerProductDeatilsModel> lstSecondarysalesforCustomer { get; set; }
    }

    public class PS_SecondarysalesDetails
    {
        public string Product_Code { get; set; }
        public decimal Qty { get; set; }
        public string Column_Name { get; set; }
        public string Document_Type { get; set; }
        public string Calc_Mode { get; set; }
        public string Division_Code { get; set; }
    }

    public class PS_EditableColumn
    {
        public string Column_Name { get; set; }
        public int Is_Editable { get; set; }
        public string Division_Code { get; set; }
    }

    public class PS_SS_Input
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string SelectionType { get; set; }
        public string Customer_Code { get; set; }
        public string Region_Code { get; set; }
    }
    public class StockiestData
    {
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Ref_Key1 { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
    }
    public class StockiestEntryDetailsDelete
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal SS_Amount { get; set; }
        public string Date { get; set; }
        public string SS_Statement_Date { get; set; }
        public string MonthName { get; set; }
        public string SS_Code { get; set; }
        public string Base_Code { get; set; }
        public string IS_Inherited { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string SS_Status_Val { get; set; }
        public string SS_Status { get; set; }
    }

    public class SS_ProductsDetailedView
    {

        public string Base_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string SS_Statement_Date { get; set; }
        public decimal Free_Goods { get; set; }
        public decimal Opening_Stock { get; set; }
        public decimal Purchase { get; set; }
        public decimal Purchase_Return { get; set; }
        public decimal Sales { get; set; }
        public decimal Sales_Return { get; set; }
        public decimal Closing_Stock { get; set; }
        public decimal Transit { get; set; }
        public decimal Damaged_Goods { get; set; }
        public decimal Expired_Goods { get; set; }
        public int Input_DynamicCount { get; set; }
        public string SS_Status { get; set; }
        public string SS_Flag { get; set; }
        public decimal Price_per_Unit { get; set; }
        public string Remarks { get; set; }
        public string SS_Details_Code { get; set; }
        public string Ref_Key1 { get; set; }


    }
    public class SSUserListModel
    {
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Type_Name { get; set; }

        public string Privilege_Name { get; set; }
        public string Privilege_Code { get; set; }
        public string Privilege_Value_Name { get; set; }


    }
    public class PriceGroupModelSS
    {
        public string Price_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }


        public string Price_Type { get; set; }
        public string MRP { get; set; }
        public string MRP_WOTax { get; set; }
        public string NRV { get; set; }
        public string PTR { get; set; }

        public string PTR_WOTax { get; set; }
        public string PTS { get; set; }
        public string PTS_Price { get; set; }

        public string INVOICE_AMOUNT { get; set; }
    }
    public class PriceTypeModel
    {

        public string Price_Type { get; set; }
        public string Is_Check { get; set; }
        public string Is_Available { get; set; }
        public string Is_CurrentMonth { get; set; }
        public string Is_Inherited { get; set; }
    }
    public class PriceGroupMain
    {
        public List<PriceGroupModelSS> lstPricegrpSS { get; set; }
        public List<PriceTypeModel> lstgrpType { get; set; }
        public List<PriceTypeModel> lstCheck { get; set; }
        public List<PriceTypeModel> lstisAvail { get; set; }
        public List<PriceTypeModel> lststckstinhertd { get; set; }
    }

    public class PreviousSSDetailsModel
    {
        public string User_Name { get; set; }
        public string SS_Code { get; set; }
        public string Region_Name { get; set; }
        public string MonthName { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string User_Code { get; set; }
        public string Base_Code { get; set; }
        public string Base_Type { get; set; }
        public string Customer_Name { get; set; }
        public string Region_Code { get; set; }
        public string SS_Statement_Date { get; set; }
        public string Stockiest_Name { get; set; }
        public string Ref_key1 { get; set; }
        public string SS_Status { get; set; }
    }

    public class SSProductModel
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Division_Code { get; set; }
        public string Price { get; set; }
    }

    public class SSOpeningBalModel
    {
        public string Product_Code { get; set; }
        public decimal Closing_Stock { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Customer_Code { get; set; }
        public string IS_Inherited { get; set; }
    }
    public class SSProductPriceModel
    {
        public string Product_Code { get; set; }
        public string Region_Code { get; set; }
        public decimal Price { get; set; }
    }
    public class SSProdPriceModelMain
    {
        public List<SSProductModel> lstProdDet { get; set; }
        public List<SSOpeningBalModel> lstOpnBal { get; set; }
        public List<SSProductPriceModel> lstProdPrice { get; set; }
    }

    public class SSProdPriceBindModel
    {
        public string Region_Code { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public string StockiestCode { get; set; }
        public List<SecondarySalesSelectedProductModel> lstSelc { get; set; }
        public List<SSProductModel> lstProd { get; set; }
        public List<SSOpeningBalModel> lstPric { get; set; }
        public List<PriceTypeModel> lstType { get; set; }
    }
    public class DynamicColumnsSS
    {
        public string Input_DataType { get; set; }
        public string Input_Label { get; set; }
        public int Input_DynamicId { get; set; }

    }
    public class DynamicColumnsInfo
    {
        public string Input_DataType { get; set; }
        public string Input_Label { get; set; }
        public int Input_DynamicId { get; set; }
        public string Input_Value { get; set; }
        public int Entries_Count { get; set; }
        public string Product_Code { get; set; }
        public int Row_Dynamic_Exists_Flag { get; set; }

    }
    public class SSMainModel
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string User_Code { get; set; }
        public string SS_Code { get; set; }
        public string Region_Code { get; set; }
        public string Base_Code { get; set; }
        public string Base_Type { get; set; }
        public string SS_Statement_Date { get; set; }
        public string SS_Status { get; set; }
        public string SS_Approval_Status { get; set; }
        public List<SSDetailsModel> LstProdDet { get; set; }
        public List<DynamicColumnsInfo> LstDynaDet { get; set; }
    }
    public class SSDetailsModel
    {
        public string Division_Code { get; set; }
        public decimal Free_Goods { get; set; }
        public decimal Opening_Balance { get; set; }
        public decimal Purchase { get; set; }
        public decimal Purchase_Return { get; set; }
        public decimal Sales { get; set; }
        public decimal Sales_Return { get; set; }
        public decimal Closing_Balance { get; set; }
        public decimal Transit { get; set; }
        public decimal Damaged_Goods { get; set; }
        public decimal Expired_Goods { get; set; }
        public string Product_Code { get; set; }
        public string Remarks { get; set; }
        public decimal Unit_Price_Rate { get; set; }
        public int Row_Exists_Flag { get; set; }
        public string Product_Name { get; set; }

    }
    public class SSMainModelforEdit
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string User_Code { get; set; }
        public string SS_Code { get; set; }
        public string Region_Code { get; set; }
        public string Base_Code { get; set; }
        public string Base_Name { get; set; }
        public string Base_Type { get; set; }
        public string SS_Statement_Date { get; set; }
        public string SS_Status { get; set; }
        public string SS_Approval_Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Ref_Key1 { get; set; }
        public string Remarks { get; set; }
    }
    public class SSDetailsMainEdit
    {
        public List<SSMainModelforEdit> lstHeader { get; set; }
        public List<SSDetailsModel> lstDetails { get; set; }
        public List<DynamicColumnsInfo> lstDynaDet { get; set; }
        public List<DynamicColumnsSS> lstDynaCol { get; set; }
    }


    public class SS_Entry_Detail
    {
        public List<SS_Detail_Entry_Model> lstSecondaryDetails { get; set; }
        public SS_Entry_Model objDet {get;set;}
    }
    public class SS_Entry_Model
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; } 
        public string Base_Code{ get; set; } 
        public string StatementDate{ get; set; }  
        public string BaseTypeCode{ get; set; }  
        public string SS_Status{ get; set; } 
        public string Customer_Code{ get; set; }  
        public string Customer_Type{ get; set; } 
        public string Entry_Mode{ get; set; }  
        public string Draft_Mode{ get; set; }           
    }   
    public class SS_Detail_Entry_Model
    {
            public string Division_Code { get; set; }
            public string Product_Code { get; set; }  
            public decimal Opening_Balance { get; set; }  
            public decimal Purchase { get; set; }  
            public decimal Purchase_Return { get; set; }  
            public decimal Sales { get; set; } 
            public decimal Sales_Return { get; set; }  
            public decimal Closing_Balance { get; set; }  
            public decimal Transit { get; set; } 
            public decimal Free_Goods { get; set; }  
            public decimal Unit_Rate { get; set; }  
            public string Product_Remarks { get; set; }  
            public decimal OldOpening_Balance { get; set; }  
            public int Is_Manually_Edited { get; set; }  
    }

          
}
