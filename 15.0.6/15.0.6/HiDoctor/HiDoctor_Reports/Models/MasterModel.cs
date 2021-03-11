#region Usings
using System;
#endregion Usings

namespace HiDoctor_Reports.Models
{
    public class MasterModel
    {
        #region Properties
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Code { get; set; }

        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }

        public string Manger_Id { get; set; }
        public string Manager_Name { get; set; }
        public string Reporting_Region { get; set; }
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }

        public string Privilege_Name { get; set; }
        public string Privilege_Value { get; set; }        
        #endregion Properties
    }

    public class TPReport
    {
        public int TP_Count { get; set; }
        public string User_Code { get; set; }        
        public string TP_Date { get; set; }
        public int DCR_Count { get; set; }
        public int As_Per_TP_Flag { get; set; }
        public int As_Per_TP_Work { get; set; }
        public int As_Per_TP_Category { get; set; }
        public int As_Per_TP_Accomp { get; set; }
    }

    public class TPDoctor
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
        public int TP_Count { get; set; }
        public int Visit_Count { get; set; }
    }
}