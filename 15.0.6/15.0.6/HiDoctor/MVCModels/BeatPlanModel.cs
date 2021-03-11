using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class WorkCategoryModel
    {
        public string Work_Category_Name { get; set; }
        public string Work_Category_Code { get; set; }
    }
    public class WorkAreaModel
    {
        public string Region_Code { get; set; }
        public string Work_Area { get; set; }
    }
    public class UserDetailsModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }
    public class PrivilegeDetailsModel
    {
        public string Privilege_Code { get; set; }
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Code { get; set; }
        public string Privilege_Value_Name { get; set; }
    }
    public class SFCDetailsModel
    {
        public string Region_Code { get; set; }
        public string From_Region_Name { get; set; }
        public string To_Region_Name { get; set; }
        public string Travel_Mode { get; set; }
        public string Work_Category_Name { get; set; }
        public string Work_Category_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string Company_Code { get; set; }
        public int Company_Id { get; set; }
        public string Created_By { get; set; }
        public string Work_Area { get; set; }
    }

    public class BeatPlanModel
    {
        public string Beat_Name { get; set; }
        public string Beat_Code { get; set; }
        public string Work_Category_Name { get; set; }
        public string Work_Category_Code { get; set; }
        public string Work_Area { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Company_Code { get; set; }
        public int Company_Id { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Beat_Status { get; set; }
        public string Status { get; set; }
        public int SFC_Details_Count { get; set; }
        public int Doctor_Details_Count { get; set; }
        public int Chemist_Details_Count { get; set; }
        public int WorkArea_Details_Count { get; set; }
        public int Stockist_Details_Count { get; set; }
        public int Approved_Doctors_In_Tagged { get; set; }
        public int UnApproved_Doctors_In_Tagged { get; set; }
        public int Approved_Chemists_In_Tagged { get; set; }
        public int UnApproved_Chemists_In_Tagged { get; set; }
        public int Approved_Stockists_In_Tagged { get; set; }
        public int UnApproved_Stockists_In_Tagged { get; set; }
        public string Remarks { get; set; }
        public string Mode { get; set; }
        public int Weeknumber { get; set; }
        public string Weekday { get; set; }
        public List<SFCDetailsModel> lst_SFCDetails { get; set; }
        public List<SFCDetailsModel> lst_WorkArea { get; set; }
    }
    public class OutPutJsonBeatModel
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public object list { get; set; }
        public int Count { get; set; }
        public bool Status_Message { get; set; }
    }
    public class MasterDataParamModel
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Beat_Code { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Data_Load_Type { get; set; }
        public string Data_Mapped_Or_Not { get; set; }
        public string OnceOrMultiple { get; set; }
    }

    public class MasterDataTaggedModel
    {
        public string Customer_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Stockist_Name { get; set; }
        public string Chemist_Name { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Region_Code { get; set; }
        public string Mapping_Status { get; set; }
        public string MappedStatus { get; set; }
        public int Tagged_SFCs_Count { get; set; }
        public string Beat_Code { get; set; }
        public string Company_Code { get; set; }
        public int Company_Id { get; set; }
        public string Created_By { get; set; }
    }

    public class PieChartWrapperModel
    {
        public List<PieChartModel> lstBeats { get; set; }
        public List<PieChartModel> lstDoctorsTaggedOrNotTagged { get; set; }
        public List<PieChartModel> lstBeatsToDoctors { get; set; }
        public List<PieChartModel> lstBeatsToChemists { get; set; }
        public List<PieChartModel> lstBeatsToStockists { get; set; }
    }
    public class PieChartModel
    {
        public string Region_Code { get; set; }
        public string x { get; set; }
        public int y { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }
    public class BeatWrapperModel
    {
        public List<BeatDetailsModel> lstHeader { get; set; }
        public List<BeatDetailsModel> lstSFC { get; set; }
        public List<BeatDetailsModel> lstDoctors { get; set; }
        public List<BeatDetailsModel> lstChemists { get; set; }
        public List<BeatDetailsModel> lstStockists { get; set; }
    }

    public class BeatDetailsModel
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Beat_Status { get; set; }
        public string Total_Distance { get; set; }
        public string Region_Code { get; set; }
        public string Ref_Key1 { get; set; }
        public string Local_Area { get; set; }
        public string Drug_License_Number { get; set; }
        public string Customer_Status { get; set; }
        public string Customer_Status_Text { get; set; }
        public string Beat_Name { get; set; }
        public string Beat_Code { get; set; }
        public string Travel_Mode { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Work_Category_Name { get; set; }
        public string Work_Category_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Work_Area { get; set; }
        public string Fare_Amount { get; set; }
        public string Distance { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Customer_Entity_Type { get; set; }
        public int WeekNumber { get; set; }
        public string Weekday { get; set; }
    }

    public class CustomerEntityModel
    {
        public string Customer_Entity_Type { get; set; }
        public string GridId { get; set; }
        public List<CustomerHeaderModel> lstDoctor { get; set; }
        public List<EntityAddressModel> lstAddress { get; set; }
        public List<HospitalModel> lstHospital { get; set; }
    }

    public class ChemistEntityModel
    {
        public string Customer_Entity_Type { get; set; }
        public string GridId { get; set; }
        public List<ChemistStockistHeaderModel> lstChemist { get; set; }
        public List<EntityAddressModel> lstAddress { get; set; }

    }
    public class StockistEntityModel
    {
        public string Customer_Entity_Type { get; set; }
        public string GridId { get; set; }
        public List<ChemistStockistHeaderModel> lstStockist { get; set; }
        public List<EntityAddressModel> lstAddress { get; set; }

    }

    public class CustomerHeaderModel
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Qualification { get; set; }
        public string MDL_Number { get; set; }
        public string Registration_No { get; set; }
        public string Gender { get; set; }
        public string Anniversary_Date { get; set; }
        public string DOB { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
        public string Doctor_Photo { get; set; }
        public string Customer_Status_Text { get; set; }
        public string Customer_Status { get; set; }
    }

    public class EntityAddressModel
    {
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string State_Name { get; set; }
        public string City_Name { get; set; }
        public string Local_Area { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Phone { get; set; }
        public string Pincode { get; set; }
    }
    public class HospitalModel
    {
        public string Hospital_Name { get; set; }
        public string Hospital_Classification_Name { get; set; }
    }

    public class ChemistStockistHeaderModel
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Drug_License_Number1 { get; set; }
        public string Drug_License_Number2 { get; set; }
        public string GST_Number { get; set; }
        public string Customer_Status_Text { get; set; }
        public string Customer_Status { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
    }

    public class BeatHistoryModel
    {
        public string Beat_Name { get; set; }
        public string Beat_Code { get; set; }
        public string Work_Area { get; set; }
        public string Work_Category_Name { get; set; }
        public string Status { get; set; }
        public string Created_By { get; set; }
        public string Approved_By { get; set; }
        public string Created_Date { get; set; }
        public string Approved_Date { get; set; }
        public string UnApproved_By { get; set; }
        public string UnApproved_Date { get; set; }
        public string Remarks { get; set; }
        public string Record_Status { get; set; }
    }
    public class DoctordetailModel
    {
        public string Doctor_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Local_Area { get; set; }
        public string MDL_Number { get; set; }
        public string Speciality_Name { get; set; }
    }
}
