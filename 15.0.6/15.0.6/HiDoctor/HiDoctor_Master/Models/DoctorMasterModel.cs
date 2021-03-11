using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class DoctorMasterModel
    {
        public string Customer_Code { get; set; }
        [Required]
        [StringLength(300)]
        public string Customer_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Code { get; set; }
        public string SubRegion_Code { get; set; }
        public string Category { get; set; }
        public string Speciality_Code { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Local_Area { get; set; }
        public string City { get; set; }
        public string Pin_Code { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string DOB { get; set; }
        public string Customer_Status { get; set; }
        public string Anniversary_Date { get; set; }
        public string Primary_Contact { get; set; }
        public string Contact_Relation { get; set; }
        public string Primary_Email { get; set; }
        public string MDL_Number { get; set; }
        public string Qualification { get; set; }
        public string Is_Inherited { get; set; }
        public string Remarks { get; set; }
        public string Hospital_Name { get; set; }
        public string Hospital_Classification { get; set; }
        public string Registration_Number { get; set; }
        public string CategoryCode { get; set; }
        public string SpecialityCode { get; set; }
        public string Value { get; set; }
        public string Entity { get; set; }
        public string Table_Name { get; set; }
        public string ErrorValue { get; set; }
        public string Download { get; set; }
    }
}