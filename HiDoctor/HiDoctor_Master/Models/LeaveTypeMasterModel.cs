using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class LeaveTypeMasterModel
    {
        [Display(Name="Leave Type Name:")]
        [Required(ErrorMessage = "*")]
        public string LeaveTypeName { get; set; }

        [Display(Name = "Is Comp Off?:")]
        [Required(ErrorMessage = "*")]
        public string IscompOff { get; set; }
    }
}