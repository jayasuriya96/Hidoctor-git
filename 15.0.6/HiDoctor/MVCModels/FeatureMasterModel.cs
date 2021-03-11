using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class FeatureMasterModel
    {
       public string Company_Code { get; set; }
       public string Feature_Code { get; set; }
       public string Feature_Name { get; set; }
       public string Effective_From { get; set; }
       public string Effective_To { get; set; }
       public string Record_Status { get; set; }
       public string Description { get; set; }
       public string Is_Active { get; set; }
       public string Created_By { get; set; }
       public string Created_Date { get; set; }
       public string Updated_By { get; set; }
       public string Updated_Date { get; set; }
    }
}
