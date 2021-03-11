#region Using
using System;
using System.ComponentModel.DataAnnotations;
#endregion Using

namespace HiDoctor_Master.Models
{
    public class ExpenseGroupModel
    {
        [Required]
        [Display(Name = "Expense Group")]
        public string Expense_Group_Name { get; set; }

        [Display(Name = "Copy From")]
        public string Copy_Expense_Group { get; set; }
    }
}