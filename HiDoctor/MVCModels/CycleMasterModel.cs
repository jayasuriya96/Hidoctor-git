using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
  public class CycleMasterModel
    {
      public string Company_Code { get; set; }
      public string Cycle_Code { get; set; }
      public string Cycle_Name { get; set; }
      public string Long_Description { get; set; }
      public string Record_Status { get; set; }
      public string Start_Date { get; set; }
      public string End_Date { get; set; }
      public string Region_Code { get; set; }
      public string Region_Name { get; set; }
      public string Created_By { get; set; }
      public string Created_Date { get; set; }
      public string Updated_By { get; set; }
      public string Updated_Date { get; set; }
    }
    public class MapConfigDetails
    {
        public string Map_Provider_Name { get; set; }
        public int Active_Status { get; set; }
    }
}
