using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class DomainMasterModel
    {
       public string Company_Code { get; set; }
       public string Domain_Code { get; set; }
       public string Domain_Name { get; set; }
       public string Start_Date { get; set; }
       public string End_Date { get; set; }
       public string Status { get; set; }
       public string Created_By { get; set; }
       public string Created_Date { get; set; }
       public string Updated_By { get; set; }
       public string Updated_Date { get; set; }
    }
}
