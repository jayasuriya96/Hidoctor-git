using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class PayrollModel
    {
        public string guid { get; set; }
        public string domainName { get; set; }
        public string API_Status { get; set; }
        public string is_exception { get; set; }
        public string Key { get; set; }
        public string message { get; set; }
    }

    public class PayrollSuccessModel
    {
        public string guid { get; set; }
        public string domainName { get; set; }
        public string API_Status { get; set; }
    }
    public class PayrollErrorModel
    {
        public string is_exception { get; set; }
        public string Key { get; set; }
        public string message { get; set; }
        public string API_Status { get; set; }
    }
}
