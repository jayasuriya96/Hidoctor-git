using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class ActivityMasterModel
    {
        [Required(ErrorMessage = "*")]
        [Display(Name = "ActivityName")]
        public string Activity_Name { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Start Date")]
        [DataType(DataType.DateTime)]
        public DateTime Start_Date { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "End Date")]
        [DataType(DataType.DateTime)]
        public DateTime End_Date { get; set; }
    }
}