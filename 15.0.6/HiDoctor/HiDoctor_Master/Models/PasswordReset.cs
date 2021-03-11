using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class PasswordReset
    {
        public string Email_Id { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string User_Pass { get; set; }
        public string User_Name { get; set; }
    }
    
}