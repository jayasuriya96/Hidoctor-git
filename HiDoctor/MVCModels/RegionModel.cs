using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class RegionModel
    {
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Region_Classification_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
        public string Ref_Key1 { get; set; }
        public string Reporting_Region_Name { get; set; }
        public string Reporting_Region_Type_Name { get; set; }

        public string User_Name { get; set; }
        public string label { get; set; }
        public string value { get; set; }
    }

    public class WeekendGroupModel
    {
        public string Holiday_Method_Name { get; set; }
        public int Holiday_Method_Code { get; set; }
        public string Holiday_Method_Class_Name { get; set; }

        public string Weekend_Off_Name { get; set; }
        public int Weekend_Off_Code { get; set; }
        public int Year { get; set; }
        public string Date { get; set; }
        public string Day { get; set; }
    }

    public class HolidayModel
    {
        public string Company_Code { get; set; }
        public string Holiday_Date { get; set; }
        public string Holiday_Name { get; set; }
        public string Holiday_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Code { get; set; }
        public string Holiday_Status { get; set; }
        public string Holiday_Region_Flag { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Updated_By { get; set; }
        public string Updated_DateTime { get; set; }
        public string Region_Name { get; set; }
        public string Reporting_Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Reporting_Region_Type_Name { get; set; }
        public string Lock_Month_Name { get; set; }
        public string Lock_Year { get; set; }
    }

    public class StockistShare
    {
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Region_Name { get; set; }
        public string SS_Value { get; set; }
        public string PS_Value { get; set; }
        public string Target_Value { get; set; }
        public string Region_Code { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string User_Code { get; set; }
        public string Reporting_Region_Name { get; set; }
    }
    public class ExcelRegionMaster
    {
        public string User_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Full_Index { get; set; }
        public string Reporting_Region_Name { get; set; }
        public string Reporting_Region_Type { get; set; }
    }

    public class KI_RegionTypeModel
    {
        public string Company_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Under_Region_Type { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Region_Type_Status { get; set; }
        public int Row_Version_No { get; set; }
        public string Updated_By { get; set; }
        public string Created_By { get; set; }
        public int Under_Region_Id { get; set; }
        public int Region_Type_ID { get; set; }
    }

}
