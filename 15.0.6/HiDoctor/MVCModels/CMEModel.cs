using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;

namespace MVCModels
{

    public class CMEUserDetailsModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }

}
