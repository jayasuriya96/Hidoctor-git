using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
  public  class SubRegionMasterModel
    {
      public string Company_Code { get; set; }
      public string SubRegion_Code { get; set; }
      public string SubRegion_Name{get;set;}
      public string UnderRegion_Code { get; set; }
      public string UnderRegion { get; set; }
      public string SubRegion_Status { get; set; }
      public string Created_By{get;set;}
      public string Created_Date { get; set; }
      public string Updated_By { get; set; }
      public string Updated_Date { get; set; }
    }
}
