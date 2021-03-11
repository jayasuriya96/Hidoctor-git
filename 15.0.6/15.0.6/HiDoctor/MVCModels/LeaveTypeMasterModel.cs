using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
 public  class LeaveTypeMasterModel
    {
     public string Company_Code { get; set; }
     public string Leave_Type_Code { get; set; }
     public string Leave_Type_Name { get; set; }
     public string Leave_Type_Status { get; set; }
     public string Is_Comp_Off { get; set; }
    }
}
