using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class SalesOrderStatusModel
    {
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
        public string SaleOrder_Code { get; set; }
        public string Ref_Number { get; set; }
        public string SO_Approve_Status { get; set; }
    }
}
