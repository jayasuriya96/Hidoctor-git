using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
  public class ProductPriceMasterModel
    {
        public string pm_Company_Code { get; set; }
        public string Rm_Company_Code { get; set; }
        public string Rtm_Company_Code { get; set; }
        public string Pp_Company_Code { get; set; }
        public string Price_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Price { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Price_Status { get; set; }
        public string Company_Code { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
    }

  public class DropRegionType
  {
      public string Company_Code { get; set; }
      public string Region_Type_Code { get; set; }
      public string Region_Type_Name { get; set; }
  }

  public class DropRegion
  {
      public string Company_Code { get; set; }
      public string Region_Code { get; set; }
      public string Region_Name { get; set; }
      public string Region_Type_Code { get; set; }
  }

  public class DropProduct
  {
      public string Company_Code { get; set; }
      public string Product_Code { get; set; }
      public string Product_Name { get; set; }

  }



}
