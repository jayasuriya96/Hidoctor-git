using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MenuMasterModel
    {
        public string Company_Code { get; set; }
        public string Menu_ID { get; set; }
        public string Menu_ParentID { get; set; }
        public string Menu_Text { get; set; }
        public string Menu_URL { get; set; }
        public string MM_Order { get; set; }
        public string SM_Order { get; set; }
        public string Feature_Code { get; set; }
        public string Screen_Description { get; set; }
        public string Project_Name { get; set; }
        public string Is_Report { get; set; }
        public string Report_Category { get; set; }
        public string Description { get; set; }
        public string IsPrint { get; set; }
        public string IsExcelExport { get; set; }
        public string IsChart { get; set; }
        public string IsDrillDown { get; set; }
        public string IsMultiUser { get; set; }
        public string Menu_Full_Path { get; set; }
        public string Menu_Key_Words { get; set; }
        public string Parent_Id { get; set; }
        public string Parent_Menu_Text { get; set; }
        public string Feature_Name { get; set; }
        public string Menu_Created_By { get; set; }
        public string Menu_Created_DateTime { get; set; }
        public string Menu_Updated_By { get; set; }
        public string Menu_Updated_DateTime { get; set; }
        public string MenuLevel { get; set; }
        public string Type { get; set; }
        public string Category { get; set;}
        public string TypeOfModule { get; set; }
        public string Query_String_Parameters { get; set; }
        //public int Menulevel { get; set; }
        //public int menuType { get; set; }
    }
    public class UserTypeMenuAccessModel
    {
        public string Company_Code { get; set; }
        public string Userrights_id { get; set; }
        public string Menu_Id { get; set; }
        public string User_Type_Code { get; set; }
        public string Access { get; set; }
        public string Record_Status { get; set; }
        public string Depot_Code { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string User_Type_Name { get; set; }
        public string Menu_Text { get; set; }
        public string Menu_URL { get; set; }
        public string Menu_ParentID { get; set; }
    }

    public class UserTypeAppMenuAccessModel
    {
        public string Company_Code { get; set; }
        public string User_AccessId { get; set; }
        public string Menu_Id { get; set; }
        public string User_Type_Code { get; set; }
        public string Active_status { get; set; }
        public string Record_Status { get; set; }
        public string Updated_By { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string User_Type_Name { get; set; }
        public string Menu_Text { get; set; }
        public string Menu_URL { get; set; }
        public string Menu_ParentID { get; set; }
    }

    public class ConfigSettingsModel
    {
        public string Company_Code { get; set; }
        public string Config_Id { get; set; }
        public string Config_Key { get; set; }
        public string Config_Value { get; set; }
        public string Possible_Values { get; set; }
        public string Type { get; set; }

    }

    public class ConfigvaluesModel
    {
        public string Config_DuplicatecheckColumn { get; set; }
        public string Config_MandatoryColumns { get; set; }
    }

    public class Employeedetails
    {
        public string Employee_Name { get; set; }
        public string Email_Id { get; set; }
        public string Division_Name { get; set; }
        public string User_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public int HDUser_Id { get; set; }
    }
    public class AppMenuParams
    {
        public int ID { get; set; }
        public string Query_String_Params { get; set; }
    }
}
