using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    [Serializable]
    public class CustomerModel
    {
        //public string Customer_Name { get; set; }
        //public string Customer_Code { get; set; }
        //public string Address { get; set; }
        //public string Tin_Number { get; set; }
        //public string CST_Number { get; set; }
        static int nextID = 1;
        public CustomerModel()
        {
            ID = nextID++;
        }
        public int ID { get; set; }
        public string Company_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
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
        public string MDL_Number { get; set; }
        public string Qualification { get; set; }
        public string Remarks { get; set; }
        public string Address { get; set; }
        public string Tin_Number { get; set; }
        public string CST_Number { get; set; }
    }

    public class CustomerEntityModel
    {
        public string Entity_Type { get; set; }
        public string Table_Name { get; set; }
        public string Field_Name { get; set; }
        public string Field_Alias_Name { get; set; }
        public string Display_Option { get; set; }
        public string Group_Name { get; set; }
        public string DATA_TYPE { get; set; }
        public string COLUMN_DEFAULT { get; set; }
        public string CHARACTER_MAXIMUM_LENGTH { get; set; }
        public string IS_NULLABLE { get; set; }
    }

    public class DoctorModel
    {
        public string Company_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string SubRegion_Code { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Local_Area { get; set; }
        public string City { get; set; }
        public string Pin_Code { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string MDL_Number { get; set; }
        public string Qualification { get; set; }
        public string Remarks { get; set; }
        public string Address { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Customer_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Visit_Count { get; set; }
        public string Doctor_Count { get; set; }
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Category_Code { get; set; }
        public string Status { get; set; }
        public string DOB { get; set; }
        public string Anniversary_Date { get; set; }
        public string Price_Group_Code { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Changed_Column_Name { get; set; }
        public string Old_Value { get; set; }
        public string New_Value { get; set; }

        public string User_Name { get; set; }
        public string Reporting_Manager_Name { get; set; }
        public string Date { get; set; }
        public string Workcategory { get; set; }
        public int Mapping_ID { get; set; }
    }

    public class DoctorAutoFillModel
    {
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }
    public class DoctorProductMapping
    {
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Category_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Speciality_Name { get; set; }
        public string Campaign_Name { get; set; }
        public List<DoctorProduct> lstDoctorProduct { get; set; }
        public int Mapped_Product_Count { get; set; }
        public double Support_Quantity { get; set; }
        public double Potential_Quantity { get; set; }
        public string Customer_Status { get; set; }
    }
    public class DoctorProduct
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public double Support_Quantity { get; set; }
        public double Potential_Quantity { get; set; }
        public int product_Priority_No { get; set; }
        public int Mapped_Doctor_Count { get; set; }
    }

    public class DoctorCategoryModel
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }

    public class DoctorQuickViewModel
    {
        public string Company_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Sur_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Local_Area { get; set; }
        public string Hospital_Name { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string DOB { get; set; }
        public string Anniversary_Date { get; set; }
        public string Qualification { get; set; }
        public string Registration_No { get; set; }
    }

    public class DoctorQuickViewProductModel
    {
        public string Product_Name { get; set; }
        public string Campaign_Name { get; set; }
        public string Yield { get; set; }
        public string Potential { get; set; }
        public string Priority { get; set; }
    }

    public class DoctorQuickViewUserTypeModel
    {
        public string User_Type_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Status { get; set; }
    }

    public class DoctorQuickViewDoctorVisitModel
    {
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public int Visit_month { get; set; }
        public string Visit_Year { get; set; }
        public int Visit_Day { get; set; }
        public int Doctor_Code_Count { get; set; }

    }
    public class DoctorVisitRegionTypeModel
    {
        public string Region_Type_code { get; set; }
        public string Region_type_Name { get; set; }
        public int Visited_Month { get; set; }
        public int Visited_Year { get; set; }
        public string Region_Code { get; set; }
        public string Day { get; set; }
    }

    public class DoctorQucikViewSpecialityModel
    {
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
    }

    public class CustomerApprovalQueueTracker
    {
        public string CompanyCode { get; set; }
        public int Id { get; set; }
        public string UserCode { get; set; }
        public string DoctorCode { get; set; }
        public string RegionCode { get; set; }
        public string EventName { get; set; }
        public int ProcessStatus { get; set; }
        public string JSONObject { get; set; }
        public string TopicName { get; set; }
        public string SubscriptionName { get; set; }
        public string Mesg { get; set; }
        public string StackTrace { get; set; }
    }
    public class DoctorWorkArea
    {
        public string Doctor_Place { get; set; }
        public string Workcategory { get; set; }
        public string label { get; set; }
        public string value { get; set; }
    }
    public class DoctorWorkAreaDetails
    {
        public List<DoctorModel> lsDoctorDetails { get; set; }
        public List<DoctorWorkArea> lsDoctorWorkArea { get; set; }
        public List<DoctorWorkArea> lsDoctorPlace { get; set; }
        public List<DoctorWorkArea> lsWorkcategory { get; set; }
    }
}
