using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class UserTypeMasterModel
    {
        [Display(Name = "User Type Code")]
        public string User_Type_Code { get; set; }

        [Display(Name = "User Type Name")]
        [Required(ErrorMessage = "Enter the UserTypeName")]
        public string User_Type_Name { get; set; }

        [Display(Name = "Under User Type")]
        [Required(ErrorMessage = "Select The UnderUserType")]
        public string Under_User_Type { get; set; }

        [Display(Name = "Status")]
        public string User_Type_Status { get; set; }

        [Display(Name = "UserType Category")]
        public string User_Type_Category { get; set; }
    }
}