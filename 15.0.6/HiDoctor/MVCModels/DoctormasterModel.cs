using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class DoctormasterModel
    {
        public string Field_Name { get; set; }
        public string Field_Alias_Name { get; set; }
        public int Is_Mandatory { get; set; }
        public int Max_Length { get; set; }
        public int Min_Length { get; set; }
    }
    public class speciality
    {
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
    }
    
    public class city
    {
        public int City_ID { get;set;}
        public string City_Name { get; set; }

    }
    public class category
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }
    public class logindetails
    {
        public string CompanyCode { get; set; }
        public string UserCode { get; set; }
        public string RegionCode { get; set; }
        public string Source { get; set; }
        public string DoctorName { get; set; }
        public string SpecialityCode { get; set; }
    }
}
