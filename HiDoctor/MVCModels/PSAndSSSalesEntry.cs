using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    public class PSAndSSSalesEntry
    {
        public class ProductDeatils
        {
            public int Product_Id { get; set; }
            public int Sales_Id { get; set; }
            public string Product_Name { get; set; }
            public string Units { get; set; }
            public string Closing { get; set; }
            public string Transit { get; set; }
            public string Product_Code { get; set; }
            public string Entity_Code { get; set; }
            public string subDomainName { get; set; }
            public string Price_Per_Unit { get; set; }
        }
        public class HSProductName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public string Ref_Key1 { get; set; }
            public decimal PTS { get; set; }
        }
        public class SalesDetails
        {
            public int Sales_Id { get; set; }
            public string Entity_Name { get; set; }
            public string Entity_Type { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Statement_Date { get; set; }
            public int Status { get; set; }
            public string Entity_Code { get; set; }
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public string week { get; set; }
            public string TypeOfMapping { get; set; }
            public string CustomerCode { get; set; }
            public string CustomerName { get; set; }
            public string Ref_Key1 { get; set; }
        }



        public class AllSalesDetails
        {
            public List<SalesDetails> lstsales { get; set; }
            public List<Details> lstdetails { get; set; }
        }
        
    public class Details
    {
        public int Sales_Id { get; set; }
        public string Entity_Name { get; set; }
        public string Entity_Type { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Statement_Date { get; set; }
        public int Status { get; set; }
        public string Entity_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string week { get; set; }
        public string TypeOfMapping { get; set; }
            public string CustomerCode { get; set; }
            public string CustomerName { get; set; }
            public string Ref_Key1 { get; set; }
        }
        public class PPAndSS
        {
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public int status { get; set; }
            public string CustomerName { get; set; }
            public string CustomerCode { get; set; }
            public string EntityCode { get; set; }
            public string Entity { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
            public string Customer_RegionCode { get; set; }
            public decimal Units { get; set; }
            public string Type_of_mapping { get; set; }
            public decimal Closing { get; set; }
            public decimal Transit { get; set; }
            public string Product { get; set; }
            public string ScheduleName { get; set; }
            public string Notes { get; set; }
          
            public decimal Price_Per_Unit { get; set; }          
            public string CompanyCode { get; set; }
            public string LoginRegionCode { get; set; }
            public string LoginUserCode { get; set; }
            public string subDomainName { get; set; }
            public int NumofWeeks { get; set; }
            public string TypeOfMapping { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Date { get; set; }
            public int CompanyId { get; set; }
            public string EntityName { get; set; }
            public int Sales_Id { get; set; }
            public string week { get; set; }
            public string Remark { get; set; }
            public string Entity_Type { get; set; }
            public string privilege_Name { get; set; }
            public string default_value { get; set; }
           
            public int Company_Id { get; set; }
         public List<EntitySales> lstSaleEntity { get; set; }
            public List<ProductDeatils> lstProductSales { get; set; }
        }

        public class EntitySales
        {
            public int Sales_Id { get; set; }
            public string Remark { get; set; }
            public string SubDomainName { get; set; }
        }
        public class ReleaseDetails
        {
            public string Entity_Name { get; set; }
            public string Entity_Type { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Statement_Date { get; set; }
            public string Remark { get; set; }
            public string Released_By { get; set; }
            public string Released_Date { get; set; }
            public string week { get; set; }
            public string TypeOfMapping { get; set; }
        }
        public class PPAndSSDetails
        {
            public List<SalesDetails> Sales { get; set; }
            public List<ReleaseDetails> Release { get; set; }
        }
        public class prodDetails
        {
            public List<SalesDetails> lstsales { get; set;}
            public List<Details> lstdetails { get; set; }
        }
        public class RegionName
        {
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public int Draft_Count { get; set; }
        }
        public class ConfigDetails
        {
            public string Config_Key { get; set; }
            public string Possible_Values { get; set; }
            public string Config_Value { get; set; }
            public string Type { get; set; }
            public string company_code { get; set; }
            public string subdomain { get; set; }

        }
        public class CustomerDetails
        {
            public string CustomerCode { get; set; }
            public string CustomerName { get; set; }
            public string Ref_Key1 { get; set; }
        }
        public class ParameterMode
        {
            public string Company_Code { get; set; }
            public string SubDomain_Name { get; set; }
            public string Company_Id { get; set; }
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
        }

    }
    
}



