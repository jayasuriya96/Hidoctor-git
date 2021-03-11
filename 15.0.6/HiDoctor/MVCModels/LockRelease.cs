using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    public class LockRelease
    {
        public class RegionName
        {
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public int Draft_Count { get; set; }
            public string subDomainName { get; set; }
        }
        public class LockedDetails  
        {
            public string Company_Code { get; set; }
            public string Region_Code { get; set; }
            public int Month { get; set; }
            public string MonthName { get; set; }
            public int Year { get; set; }
            public string Lock_Date { get; set; }
            public string subDomainName { get; set; }
            public string User_Code { get; set; }
            public string Stockist_Code { get; set; }

        }
        public class Updatelist
        {
            

            public string subDomainName { get; set; }
            public string Region_Code { get; set; }
            public string Company_Code { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string LockType { get; set; }
            public string User_Code { get; set; }
            public string LoginRegionCode { get; set; }
            public string LoginUserCode { get; set; }
            public string RegionName { get; set; }
            public List<detailsList> lstLockedDetails { get; set; }
        }
        public class detailsList
        {
            
            public string Region_Code { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string Remarks { get; set; }
            public string Actual_released_By { get; set; }
            //public string Stockist_Code { get; set; }

        }
        public class StockistDetails
        {
            public string Company_Code { get; set; }
            public string Region_Code { get; set; }
            public string subDomainName { get; set; }
            public string Stockist_Name { get; set; }
            public string Stockist_Code { get; set; }
            public string UpdatedDatetime { get; set; }
            public string Current_status { get; set; }
            public string Ref_Key1 { get; set; }

        }
        public class ReleasedDetails
        {
            public string Company_Code { get; set; }
            public string Region_Code { get; set; }
            public string subDomainName { get; set; }
            public string Stockist_Code { get; set; }
            public string Stockist_Name { get; set; }
            public string Actual_Released_By { get; set; }
            public int Month { get; set; }
            public string MonthName { get; set; }
            public int Year { get; set; }
            public string FromDate { get; set; }
            //public string ToDATE { get; set; }
           public string Remarks { get; set; }
            public string Released_By { get; set; }
            public string Released_Date { get; set; }
           

        }
        

    }
}
