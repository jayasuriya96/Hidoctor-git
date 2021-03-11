using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class Batch
    {
        public class BatchData
        {
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public int status { get; set; }
            public string CustomerName { get; set; }
            public string CustomerCode { get; set; }
            public string BatchName { get; set; }
            public int NoOfChicks { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
            public string Customer_RegionCode { get; set; }
            public int Batch_Id { get; set; }
            public string Product { get; set; }
            public string ScheduleName { get; set; }
            public string Notes { get; set; }
            public string Schedule_Id { get; set; }
            public string CompanyCode { get; set; }
            public string LoginRegionCode { get; set; }
            public string LoginUserCode { get; set; }
            public string subDomainName { get; set; }
            public int NumofWeeks { get; set; }
            public string EntityCode { get; set; }
            public string Entity { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Date { get; set; }
            public int CompanyId { get; set; }
            public string EntityName { get; set; }
            public int Sales_Id { get; set; }
            public string Remark { get; set; }
            public string Entity_Type { get; set; }
            public string privilege_Name { get; set; }
            public string default_value { get; set; }
            public string TypeOfMapping { get; set; }
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
        public class Product
        {
            public string ProductCode { get; set; }
            public string ProductName { get; set; }
            public string dose { get; set; }

        }
        public class ProductQuantity
        {
            public int Batch_Id { get; set; }
            public int Schedule_Id { get; set; }
            public int ProductID { get; set; }
            public int Quantity { get; set; }
            public string Date { get; set; }
            public string Remark { get; set; }
        }
        public class BatchDetails
        {
            public int Batch_Id { get; set; }
            public string Batch_Name { get; set; }
            public int status { get; set; }
            public string Customer_Code { get; set; }
            public string Customer_Name { get; set; }
            public string From_Date { get; set; }
            public string To_Date { get; set; }
            public string No_Of_Chick { get; set; }
            public string Customer_RegionCode { get; set; }
            public string Region_Name { get; set; }
            public string Region_Code { get; set; }
          public string Hospital_Name { get; set; }
        }
        public class CustomerName
        {
            public string Customer_Code { get; set; }
            public string Customer_Name { get; set; }
            public string Customer_RegionCode { get; set; }
            public string Hospital_Name { get; set; }
        }
        public class ProductName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
        }
        public class RegionName
        {
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public int Draft_Count { get; set; }
        }
        public class Schedule
        {
            public int Schedule_Id { get; set; }
        }
        public class ScheduleDetails
        {
            public List<BatchSchedule> Schedule { get; set; }
            public List<ProductSchedule> Product { get; set; }
        }
        public class BatchSchedule
        {
            public int Schedule_Id { get; set; }
            public string Schedule_Name { get; set; }
            public string Start_Date { get; set; }
            public string End_Date { get; set; }
            public string Notes { get; set; }
            public string Num_of_Weeks { get; set; }
            public int Status { get; set; }
            public int Batch_Id { get; set; }
        }
        public class ProductSchedule
        {
            public int Schedule_Id { get; set; }
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public int Product_Id { get; set; }
            public int Product_Quantity { get; set; }
            public string Dose { get; set; }
        }
        public class Information
        {
            public int Product_Quantity { get; set; }
            public string Date { get; set; }
            public string Remarks { get; set; }
        }
        public class CustomerDetails
        {
            public string CustomerCode { get; set; }
            public string CustomerName { get; set; }
            public string Ref_Key1 { get; set; }
        }
        public class State
        {
            public int State_ID { get; set; }
            public string State_Name { get; set; }
        }
        public class City
        {
            public int City_ID { get; set; }
            public string City_Name { get; set; }
        }
        public class HospitalDetails
        {
            public int Hospital_Id { get; set; }
            public string Hospital_Name{get;set;}
            public string Local_Area { get; set; }
            public string Pin_Code { get; set; }
        }
        public class HSProductName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public string Ref_Key1 { get; set; }
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
            public string TypeOfMapping { get; set; }
        }
        public class ProductDeatils
        {
            public int Product_Id { get; set; }
            public int Sales_Id { get; set; }
            public string Product_Name { get; set; }
            public decimal Units { get; set; }
            public decimal Closing { get; set; }
            public decimal Transit { get; set; }
            public string Product_Code { get; set; }
            public string Entity_Code { get; set; }
            public string subDomainName { get; set; }
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
        public class ProductInsert
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Units { get; set; }
            public int Sales_Id { get; set; }
            public decimal Closing { get; set; }
            public decimal Transit { get; set; }
        }
        public class EntityDetails
        {
            public List<SalesDetails> Sales { get; set; }
            public List<ReleaseDetails> Release { get; set; }
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
        }
        public class SAPUserCredentials
        {
            public string UserName { get; set; }
            public string UserPassword { get; set; }
        }

    }
}
