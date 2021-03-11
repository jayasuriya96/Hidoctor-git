using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class StatusMasterModel
    {
       public string Company_Code { get; set; }
       public string Status_Code { get; set; }
       public string Status_Name { get; set; }
       public string Display_Name { get; set; }
       public string Record_Status { get; set; }
       public string Created_By { get; set; }
       public string Created_Date { get; set; }
       public string Updated_By { get; set; }
       public string Updated_Date { get; set; }
    }
    public class StatusCycleMapping
    {
        public string Company_Code { get; set; }
        public string Cycle_Code { get; set; }
        public string Cycle_Name { get; set; }
        public string Status_Code { get; set; }
        public string Status_Name { get; set; }
        public string Long_Description { get; set; }
        public int Order_No { get; set; }
        public string Status_Owner_Type { get; set; }
        public string Move_Order { get; set; }
        public string Status { get; set; }
        public string OCycle_Code { get; set; }
        public string OStatus_Code { get; set; }
        public int Record_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
    }

}
