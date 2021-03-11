using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class ExpenseEntityMasterModel
    {
        [Required(ErrorMessage= "*")]
        [Display(Name = "Entity Name")]
        public string Expense_Entity_Name { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Effective From")]
        [DataType(DataType.DateTime)]
        public DateTime Effective_From { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Effective To")]
        [DataType(DataType.DateTime)]
        public DateTime Effective_To { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "Status")]
        public string Row_Status { get; set; }
    }
}