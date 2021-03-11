using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
     public class DoctorMissedReason
    {
        public class RegionName
        {
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public int Draft_Count { get; set; }
            public string subDomainName { get; set; }
        }
        public class DoctorsList
        {
            public string subDomainName { get; set; }
            public string Company_Code { get; set; }
            public string Region_Code { get; set; }
            public string Customer_Name { get; set; }
            public string Customer_Code { get; set; }
            public string Category_Name { get; set; }
            public string Local_Area { get; set; }
            public string Speciality_Name { get; set; }
            public string Status { get; set; }
            public string Reason_Name { get; set; }
            public string Remarks { get; set; }
            public string MDL_Number { get; set; }
            public int Norms_Visit_Count { get; set; }
            public int Actual_Visit_Count { get; set; }
        }

        public class DoctorsDetailsList
        {

            public string subDomainName { get; set; }
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public string Company_Code { get; set; }
            public string Customer_Name { get; set; }
            public string Customer_Code { get; set; }
            public string Category_Name { get; set; }
            public string Local_Area { get; set; }
            public string Speciality_Name { get; set; }
            public string MDL_Number { get; set; }
            public int Norms_Visit_Count { get; set; }
            public int Actual_Visit_Count { get; set; }
            public string CompanyCode { get; set; }
            public string LoginRegionCode { get; set; }
            public string LoginUserCode { get; set; }
            public int Month { get; set; }
            public int Status { get; set; }
            public int Year { get; set; }
            public int Reason { get; set; }
            public string Remarks { get; set; }
            public int CompanyId { get; set; }
         
            public string Remark { get; set; }
         
            public int Company_Id { get; set; }
            public List<ProductDeatils>lstProductSales{ get; set; }

        }
        public class ProductDeatils
        {
            public string Region_Code { get; set; }
            public string subDomainName { get; set; }
            public string Customer_Name { get; set; }
           
            public string Customer_Code { get; set; }
            
            public string Reason { get; set; }
            public string Remarks { get; set; }
            
        }
        public class ReasonDetails
        {
            public string subDomainName { get; set; }
            public int Reason_Id { get; set; }
            public string Reason_Name { get; set; }
            public string Region_Code { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
        }


        public class SalesDetails
        {
            public string subDomainName { get; set; }
            public string Region_Name { get; set; }
            public string Region_Code { get; set; }
            public string Status { get; set; }
            public string status { get; set; }
            public int Header_Id { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Reason_Id { get; set; }
            public string Reason_Name { get; set; }
            public string Remarks { get; set; }
            public string MonthName { get; set; }
            public string Entered_By { get; set; }
            public string Entered_Date { get; set; }
            public string Customer_Code { get; set; }


        }
        public class DetailsGrid
        {
            public string subDomainName { get; set; }
            public string Region_Name { get; set; }
            public string status { get; set; }
            public int Month { get; set; }
            public string MonthName { get; set; }
            public int Year { get; set; }
            public string Reporting_Manager_Name { get; set; }
            public string Reporting_Manager_Region_Name { get; set; }
            public string Employee_Name { get; set; }
            public string Customer_Code { get; set; }
        }
        public class ParameterMode
        {
            public string subDomainName { get; set; }
            public string Company_Code { get; set; }
            public string SubDomain_Name { get; set; }
            public string Company_Id { get; set; }
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
        }

    }
}
