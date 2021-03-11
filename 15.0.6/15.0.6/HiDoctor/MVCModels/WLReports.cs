using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class WLReports
    {
    }
    public class Speciality
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }
    public class Category
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }
    public class CustomerWiseReport
    {
        public string Asset_Name { get; set; }
        public int Total_Visits { get; set; }
        public int Total_Durations { get; set; }
    }
    public class ConnectionModel
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string SqlIPAddress { get; set; }
        public string SqlLoginId { get; set; }
        public string SqlPassword { get; set; }
        public string DatabaseName { get; set; }
        public string GeoLocationSupport { get; set; }
        public string SFAWAUrl { get; set; }
        public string SalesDriveUrl { get; set; }
        public string CompanyCode { get; set; }
        public string CommonPassword { get; set; }
    }
}

