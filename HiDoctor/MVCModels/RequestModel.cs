using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class RequestModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Request_Code { get; set; }
        public string Request_Name { get; set; }
        public string Request_Mapping_Code { get; set; }
        public string Status { get; set; }
        public string Record_Status { get; set; }
    }
}
