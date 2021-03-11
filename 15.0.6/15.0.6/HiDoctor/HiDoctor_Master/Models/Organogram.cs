using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class Organogram
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Under_Region_Code { get; set; }
        public string Expense_Entity_Classification { get; set; }
        public string Region_Classification { get; set; }
        public string Division_Code { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Region_Type_Id { get; set; }
        public string Expense_Group_Id { get; set; }
        public string Under_Region_Id { get; set; }
        public string Seq_index { get; set; }
        public string Full_index { get; set; }
        public string Region_Id { get; set; }
        public string User_Code { get; set; }
        public string Employee_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string Under_User_Code { get; set; }
        public string User_Name { get; set; }
        [DataType(DataType.Password)]
        public string User_Pass { get; set; }
        public string User_Status { get; set; }
        public string User_Division_Code { get; set; }
        public string User_Category_Code { get; set; }
        public string Expense_Eligibility_Region { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
    }
}