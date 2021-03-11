using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Activity
{
    public class OTCModel
    {
        public string SaleOrder_Code { get; set; }
        public string SaleOrder_Date { get; set; }
        public string Ref_Number { get; set; }
        public decimal SaleOrder_Amt { get; set; }
        public string SO_Approve_Status { get; set; }
        public int Ordered_Products { get; set; }
        public decimal Toatal_Ordered_Qty { get; set; }

        public string Customer_Code { get; set; }
        public string Sales_Person_Code { get; set; }

        public string SaleOrder_Detail_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public decimal Unit_Price { get; set; }
        public decimal Ordered_Qty { get; set; }
        public string UOM_Code { get; set; }
        public string UOM_Type_Code { get; set; }
        public string UOM_Name { get; set; }
        public string UOM_Type_Name { get; set; }

        public string Scheme_Code { get; set; }
        public string Offer_Product_Code { get; set; }
        public string Offer_Product_Name { get; set; }
        public string Offer_UOM_Code { get; set; }
        public string Offer_UOM_Type_Code { get; set; }
        public decimal Offer_Product_Qty { get; set; }

        //Order_Date
        //Order_Amount
    }
}
