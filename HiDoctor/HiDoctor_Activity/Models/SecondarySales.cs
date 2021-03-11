using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HiDoctor_Activity.Models
{
    public class SecondarySalesModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string product_Price { get; set; }
        public string productCode { get; set; }
        public string Ref_Key1 { get; set; }
        #endregion Properties
    }

    public class SecondarySalesDataModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string ss_Code { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string MonthName { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Stockiest_Name { get; set; }
        public string SS_Statement_Date { get; set; }
        public string SS_Status { get; set; }
        public string Region_Name { get; set; }
        #endregion Properties
    }

    public class StockiestModel
    {
        #region Properties
        public string StockiestCode { get; set; }
        public string StockiestName { get; set; }
        #endregion Properties
    }
    public class CustomerModel
    {
        #region Properties
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Entity { get; set; }
        #endregion Properties
    }
    public class OpeningBalanceModel
    {
        #region Properties
        public string Product_Code { get; set; }
        public string Opening_Balance { get; set; }
        public string Customer_Code { get; set; }
        public string Product_Name { get; set; }
        #endregion Properties
    }

    public class PriceRegion
    {
        #region Properties
        public string Product_Code { get; set; }
        public string RegionCode { get; set; }
        public string Price { get; set; }
        #endregion Properties
    }

    public class ParentRegion
    {
        #region Properties
        public string RegionCode { get; set; }
        #endregion Properties
    }
    public class SecondarySalesPrice
    {
        public string Price_Code { get; set; }
        public string PTS_Price { get; set; }
        public string PTS { get; set; }
        public string MRP { get; set; }
        public string MRP_WOTax { get; set; }
        public string PTR { get; set; }
        public string PTR_WOTax { get; set; }
        public string Invoice_Amount { get; set; }
        public string NRV { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }

    }
    public class SecondarySalesPriceType
    {
        public string Price_Type { get; set; }
    }
    public class SecondarySalesCheck
    {
        public string Is_Check { get; set; }
    }
    public class SecondarySalesNextMonth
    {
        public string Is_Available { get; set; }
    }
    public class SecondarySalesCurrentMonth
    {
        public string Is_CurrentMonth { get; set; }
        public string Is_Inherited { get; set; }
    }

    public class SecondarySalesUnapprovedCheck
    {
        public string Is_Unapproved { get; set; }
    }


    public class GetMonth
    {
        public string Month { get; set; }
        public string Year{get;set;}
    }
}