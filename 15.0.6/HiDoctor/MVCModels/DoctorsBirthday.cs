using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    public class DoctorsBirthday
    {
        public class DoctorsDetails
        {
            public string Doctor_Name { get; set; }
            public string Region_Name { get; set; }
            public string Region_Code { get; set; }
            public string User_Name { get; set; }
            public string DoB { get; set; }
            public string Customer_Code { get; set; }
            public string Speciality_Name { get; set; }
            public string User_Code { get; set; }
            public string Email_Id { get; set; }
            public string EmailId { get; set; }
            public string Manager_Name { get; set; }
            public string Category_Name { get; set; }
        }
        public class CCUsers
        {
            public int Company_Id { get; set; }
            public string Company_Code { get; set; }
            public string Region_Code { get; set; }
            public string Region_Name { get; set; }
            public string Region_Type_Name { get; set; }
            public string Under_Region_Code { get; set; }
            public string User_Code { get; set; }
            public string User_Name { get; set; }
            public string Region_Id { get; set; }
            public string Under_Region_Id { get; set; }
            public string Full_Index { get; set; }
            public string Email_Id { get; set; }
            public string Employee_Name { get; set; }
            public string RegionCode { get; set; }
        }
        public class MailTemplates
        {
            public string CompanyCode { get; set; }
            public string Division_Code { get; set; }
            public string HostName { get; set; }
            public string Company_Logo_Path { get; set; }
            public string Master_Api_Key { get; set; }
            public string TemplateName { get; set; }
            public string Subject { get; set; }
            public string Description { get; set; }

        }
        public class Division
        {
            public string CompanyCode { get; set; }
            public string Division_Code { get; set; }
            public string Division_Name { get; set; }
           

        }
    }
}
