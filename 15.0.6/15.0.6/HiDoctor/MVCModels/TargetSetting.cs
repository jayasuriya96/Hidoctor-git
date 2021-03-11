using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class TargetSetting
    {
        //public class SettingData
        //{
        //    public string Region_Code { get; set; }
        //    public string User_Code { get; set; }
        //    public int status { get; set; }
        //    public string CustomerName { get; set; }
        //    public string CustomerCode { get; set; }
        //    public string BatchName { get; set; }
        //    public int NoOfChicks { get; set; }
        //    public string StartDate { get; set; }
        //    public string EndDate { get; set; }
        //    public string Customer_RegionCode { get; set; }
        //    public int Batch_Id { get; set; }
        //    public string Product { get; set; }
        //    public string ScheduleName { get; set; }
        //    public string Notes { get; set; }
        //    public string Schedule_Id { get; set; }
        //    public string CompanyCode { get; set; }
        //    public string LoginRegionCode { get; set; }
        //    public string LoginUserCode { get; set; }
        //    public string subDomainName { get; set; }
        //    public int NumofWeeks { get; set; }
        //    public string EntityCode { get; set; }
        //    public string Entity { get; set; }
        //    public int Month { get; set; }
        //    public int Year { get; set; }
        //    public string Date { get; set; }
        //    public int CompanyId { get; set; }
        //    public string EntityName { get; set; }
        //    public int Sales_Id { get; set; }
        //    public string Remark { get; set; }
        //    public string Entity_Type { get; set; }
        //    public string privilege_Name { get; set; }
        //    public string default_value { get; set; }
        //    public string TypeOfMapping { get; set; }
        //    public int Company_Id { get; set; }
        //    }

        
    }
    public class SalesProductDetails
    {
        public List<HSProductDetailsList> lst { get; set; }
    }

    public class RegionSalesProductList
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public decimal YTD { get; set; }
        public string Ref_Key { get; set; }
        public decimal NexttwoMonth { get; set; }
        public decimal NextFinalcialYear { get; set; }    
        public int Status { get; set; }
        public decimal YTD_values { get; set; }
        public decimal Next_Month_Values { get; set; }
        public decimal Next_Year_Values { get; set; }
        public Decimal Price { get; set; }

    }
    public class HSProductDetailsList
    {
        public string Product_Code { get; set; }       
        public decimal YTD { get; set; }
        public decimal NexttwoMonth { get; set; }
        public decimal NextFinalcialYear { get; set; }
        public string Region_Code { get; set; }
        public string Created_By { get; set; }
        public int Status { get; set; }
        public decimal YTD_values { get; set; }
        public decimal Next_Month_Values { get; set; }
        public decimal Next_Year_Values { get; set; }
        public Decimal Price { get; set; }

    }
    public class WorkCategory
    {
        public string Expense_Entity_Code { get; set; }
        public string Expense_Entity_Name { get; set; }
        public string Expense_Entity_Classification { get; set; }
    }
    public class CategoryDetails
    {
        public string User_Type_Code { get; set; }
        public int Kilometer { get; set; }
        public string Category { get; set; }
        public string Less_than_Kilometer { get; set; }
        public string Greater_than_kilometer { get; set; }
        public string Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Created_date { get; set; }
        public string Created_by { get; set; }
    }
    public class WorkCategoryDetails
    {
        public int WC_id { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public int Kilometer { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Less_than_Kilometer_Category { get; set; }
        public string Less_than_Kilometer { get; set; }
        public string Greater_than_kilometer_Category { get; set; }
        public string Greater_than_Kilometer { get; set; }
        public string Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Created_date { get; set; }
        public string Created_by { get; set; }
        public string Startdate { get; set; }
        public string Enddate { get; set; }
    }

}

