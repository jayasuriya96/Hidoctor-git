using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class PasswordPrivValues
    {
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Name { get; set; }

    }

    public class PasswordDetails
    {
        public string User_Pass { get; set; }
        public string last_password_updated_date { get; set; }
        public string Under_User_Code { get; set; }
    }

}
