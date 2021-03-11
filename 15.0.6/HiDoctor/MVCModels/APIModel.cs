using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class APICategoryModel
    {
        public string API_Category_Code { get; set; }
        public string API_Category_Name { get; set; }
        public string API_Category_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string API_Category_Description { get; set; }
    }

    public class APIServiceModel
    {
        public string ServiceId { get; set; }
        public string ServiceDescrn { get; set; }
        public string ServiceType { get; set; }
        public string ServiceParamNos { get; set; }
        public string ServiceParams { get; set; }
        public string ServiceOutputHeaders { get; set; }
        public string ServiceInternalName { get; set; }
        public string ServiceTypeMappingClassName { get; set; }
        public string ServiceName { get; set; }
        public string Is_Visible { get; set; }
        public string API_Category_Code { get; set; }
        public string API_Category_Name { get; set; }
        public string API_ID { get; set; }
    }

    public class APIUIModel
    {

        public string ServiceId { get; set; }
        public string InputParam { get; set; }
        public string Type { get; set; }
        public string ParamOrder { get; set; }
        public string Show_In_UI { get; set; }
        public string Session_Key { get; set; }
        public string Help_Description { get; set; }
        public string API_ID { get; set; }
    }

    public class UserTypeModel
    {
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Type { get; set; }
        public string User_Type_Status { get; set; }
        public string Company_Code { get; set; }
    }

    public class CompanyAccessModel
    {
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string API_ID { get; set; }
        public string Company_Code { get; set; }
    }
    public class CompanyAppMappingModel
    {
        public string Company_App_Mapping_Id { get; set; }
        public string Company_Code { get; set; }
        public string Company_Code_Num { get; set; }
        public string App_Id { get; set; }
        public string App_Suite_Id { get; set; }
        public string App_Name { get; set; }
        public string Platform { get; set; }
        public string Last_Updated_User_Code { get; set; }
        public string Last_Updated_DateTime { get; set; }
        public string Company_App_Mapping_Status { get; set; }
    }

    public class UserAppMappingModel
    {
        public string Mapper_Id { get; set; }
        public string Company_Id { get; set; }
        public string User_Id { get; set; }
        public string App_Suite_Id { get; set; }
        public string App_Id { get; set; }
        public string App_Name { get; set; }
        public string Platform { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string App_User_Mapper_Status { get; set; }
        public string User_Code { get; set; }
        public string Company_Code { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string History_Reason { get; set; }
        public string Modified_DateTime { get; set; }
        public string Modified_By { get; set; }
    }
}
