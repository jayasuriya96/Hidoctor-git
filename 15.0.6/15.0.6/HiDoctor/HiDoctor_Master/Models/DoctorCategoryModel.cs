using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class DoctorCategoryModel
    {
        [Required(ErrorMessage = "*")]
        [Display(Name = "Doctor Category Name:")]
        public string Category_Name { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Visit Count")]
        [RegularExpression(@"^[1-9]\d*$", ErrorMessage = "Should Enter The Number Only")]
        public int Visit_Count { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Doctor Count")]
        [RegularExpression(@"^[1-9]\d*$", ErrorMessage = "Should Enter The Number Only")]
        public int Doctor_Count { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Division Name")]
        public string Division_Name { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Effective From")]
        [DataType(DataType.DateTime)]
        public DateTime Effective_From { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Effective To")]
        [DataType(DataType.DateTime)]
        public DateTime Effective_To { get; set; }
    }
}