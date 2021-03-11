using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
     public class DCRStatusModel
    {
        public string User_Type_Name { get; set; }
        public string Status_Name { get; set; }
        public string Entity_Type_Description { get; set; }
        public string Division_Name { get; set; }
        public string Activity_Name { get; set; }
        public int Status { get; set; }
        public int Result { get; set; }
    }

    public class MappedRegionModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Status { get; set;}
        public string Created_Datetime { get; set; }
    }
    public class DCRRegionModel
    {
        public string Region_Code { get; set; }
    }
}
