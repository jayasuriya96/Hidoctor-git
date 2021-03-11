using System;
namespace MVCModels
{
    public class RegionLockMappingModel
    {
        public string Company_Code{get;set;}
        public string Lock_Code {get;set;}
        public string Region_Type_Code { get; set; }
        public string Region_Code { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Record_Status { get; set; }
        public string Region_Status { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Created_DateTime { get; set; }
        public string Created_By { get; set; }
    }
}
