using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class AsynReportModel
    {
        public int Request_ID { get; set; }
        public string Request_User_Code { get; set; }
        public string Request_Datetime { get; set; }
        public string Report_Completion_datetime { get; set; }
        public string Parameter { get; set; }
        public int Request_Status { get; set; }
        public string Report_Name { get; set; }
        public string Report_URL { get; set; }
    }
}
