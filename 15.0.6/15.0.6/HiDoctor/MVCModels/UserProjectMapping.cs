using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class UserProjectMapping
    {
        public string Company_Code { get; set; }
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Mapping_Code { get; set; }
        public string Status { get; set; }
        public string OldProjectCode { get; set; }
    }
}
