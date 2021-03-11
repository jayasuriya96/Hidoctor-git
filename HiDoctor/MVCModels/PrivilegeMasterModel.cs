using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class PrivilegeMasterModel
    {
      public string Company_Code { get; set; }
      public string Privilege_Code { get; set; }
      public string Privilege_Name { get; set; }
      public string Feature_Code { get; set; }
      public string Feature_Name { get; set; }
      public string Description { get; set; }
      public string Privilege_Value_Type { get; set; }
      public string Privilege_Value_Code { get; set; }
      public string Privilege_Value_Name { get; set; }
      public string Lookup_Table { get; set; }
      public string Lookup_Column { get; set; }
      public string Litrals { get; set; }
      public string Record_Status { get; set; }
      public string Base_Privilege_Name { get; set; }
      public string Base_privilege_code { get; set; }
      public string Row_Version_No { get; set; }
      public string Entered_by { get; set; }
      public string Entered_on { get; set; }
      public string Updated_By { get; set; }
      public string Updated_Date { get; set; }
      public string Status { get; set; }
      public string Value { get; set; }
      public string Text { get; set; }    
    }

    public class FeatureModel
    {
        public string Company_Code { get; set; }
        public string Feature_Code { get; set; }
        public string Feature_Name { get; set; }
    }

    public class PrivilegeandFeatureMasterModel
    {
        public List<PrivilegeMasterModel> lstPrivilegeMaster { get; set; }
        public List<FeatureModel> lstFeatureMaster { get; set; }
    }

    public class PrivilegeModel
    {
        public string Value { get; set; }
        public string Text { get; set; }
    }

    public class UserTypePrivilegeMappingModel
    {
        public string Company_Code { get; set; }
        public string Privilege_Code { get; set; }
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Code { get; set; }
        public string Privilege_Value_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Description { get; set; }
        public string Table_Name { get; set; }
        public string Column_Name { get; set; }
        public string Record_Status { get; set; }
        public string User_Code { get; set; }
        public string Request_From { get; set; }
        public string Request_Date { get; set; }
        public string Request_Reason { get; set; }
        public string Support_User_Name { get; set; }
        public string EnteredBy  { get; set; }
        public string EnteredDate { get; set; }
        public string Region_Code { get; set; }
        public string Mapping_Updated_By { get; set; }
        public string Mapping_Updated_Date { get; set; }
        public string Privilege_Value_Type { get; set; }
    }

    public class PrivilegeValueMappingModel
    {
        public string Company_Code { get; set; }
        public string Privilege_Code { get; set; }
        public string Privilege_Value_Code { get; set; }
        public string Status { get; set; }
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Name { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date{get;set;}
        public string Created_By{get;set;}
        public string Created_Date{get;set;}
    }
    public class SingleActivityPerDayValue
    {
        public string Value { get; set; }
    }
}
