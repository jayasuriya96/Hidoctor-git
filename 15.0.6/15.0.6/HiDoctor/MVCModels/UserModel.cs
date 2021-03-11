using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class UserModel
    {
        public string Company_Code { get; set; }
        public string Company_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Status { get; set; }
        public string User_Date_of_Birth { get; set; }
        public string User_Date_of_joining { get; set; }
        public string User_Mobile_Number { get; set; }
        public string User_Phone_Number { get; set; }
        public string User_Id { get; set; }
        public string Under_User_Id { get; set; }
        public string Full_Index { get; set; }
        public string Employee_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Pass { get; set; }
        public string Expense_Group_Id { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
        public string User_Division_Code { get; set; }
        public string Child_User_Count { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Time { get; set; }
        public string UnderUserName { get; set; }
        public string Acc_No { get; set; }
        public string Under_User_Code { get; set; }
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Email_Id { get; set; }
        public string PF_Number { get; set; }
        public string PAN_Number { get; set; }
        // manager 
        public string Reporting_Manager_Name { get; set; }
        public string NextLevel_Reporting_Manager_Name { get; set; }
        public string Reporting_Manager_Emp_Name { get; set; }
        public string NextLevel_Reporting_Manager_Emp_Name { get; set; }
        public string Reporting_Manager_Region_Name { get; set; }
        public string NextLevel_Reporting_Manager_Region_Name { get; set; }
        public string Reporting_Manager_Type_Name { get; set; }
        public string Reproting_Managet_Mobile_Number { get; set; }
        public string Reporting_Manager_Code { get; set; }
        public string Reporting_Manager_Full_Index { get; set; }
        public string Reporting_Manager_User_Type_Name { get; set; }
        public string NextLevel_Reporting_Manager_User_Type_Name { get; set; }
        public string Reporting_Manager_Emp_Number { get; set; }
        public string Payroll_User_Id { get; set; }
        public string NextLevel_Reporting_Manager_Emp_Number { get; set; }
        public DateTime DCR_Actual_Date { get; set; }
        public string Region_Type_Code { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string Manager_Name { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Manager_Type_Name { get; set; }
        public DateTime Date_of_Joining { get; set; }
        public string DOJ { get; set; }
        public string Manager_Date_Of_Joining { get; set; }
        public string HSD { get; set; }
    }

    public class BillingReportModel
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string User_Status { get; set; }
        public string Count { get; set; }
        public string Reporting_Manager { get; set; }
        public string Reporting_User_Type_Name { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Type_Category { get; set; }
        public string Division_Name { get; set; }
        public string Created_Date { get; set; }
        public string Resignation_Date { get; set; }
    }

    public class EmployeeModel
    {
        public string Employee_Code { get; set; }
        public string Company_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Gender { get; set; }
        public string Date_Of_Birth { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Employee_Status { get; set; }
        public string Email_Id { get; set; }
        public string Date_of_Joining { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
        public string Resignation_Date { get; set; }
        public string Employee_Number { get; set; }
        public string EDN_Proof { get; set; }
        public string Salary_Proof { get; set; }
        public string Resume_Given { get; set; }
        public string Resignation_Submitted { get; set; }
        public string Appointed { get; set; }
        public string SCB_Account_Number { get; set; }
        public string ICICI_Account_Number { get; set; }
        public string PF_Number { get; set; }
        public string PAN_Number { get; set; }
        public string Aadhar_Number { get; set; }
        public string Confirmation_Date { get; set; }
        public string Employee_Entity_Type { get; set; }
        public string User_Code { get; set; }
        public string User_Status { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Updated_By { get; set; }
        public string Updated_DateTime { get; set; }

        public string Department_Name { get; set; }
        public string State_Name { get; set; }
        public string City_Name { get; set; }
        public int Pincode { get; set; }
        public int Department_Id { get; set; }
        public int State_ID { get; set; }
        public int City_ID { get; set; }
        public int Pincode_Id { get; set; }

        //MyProfile
        public string Region_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
        public string Prop_Date_of_Confirmation { get; set; }
        public string Blood_Group_Id { get; set; }
        public string Blood_Group_Name { get; set; }
        public string Employee_Photo { get; set; }

    }

    public class UserTypeModel
    {
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Type { get; set; }
        public string User_Type_Status { get; set; }
        public string Under_User_Type_Name { get; set; }
        public string Company_Code { get; set; }
    }
    public class DivisionModel
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
    }

    public class ExpenseModel
    {
        public string Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
    }

    public class UserCALCFieldsHeaderModel
    {
        public string Company_Code { get; set; }
        public string Header_ID { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string Total_Field_Days { get; set; }
        public string Total_Leave_Days { get; set; }
        public string Total_Attendance_Days { get; set; }
        public string Total_Holidays { get; set; }
        public string Total_WeekendOff_Count { get; set; }
        public string Total_WeekendOff_Worked_Days_Count { get; set; }
        public string Approved_Doctors_Count { get; set; }
        public string Doctor_Calls_Made { get; set; }
        public string Last_Submitted_Date { get; set; }
        public string Listed_Doctor_Calls_Made { get; set; }
        public string Unlisted_Doctor_Calls_Made { get; set; }
        public string Listed_Own_Doctor_Calls_Made { get; set; }
        public string Independent_Doctor_Calls_Made { get; set; }
        public string Missed_Doctors_Count { get; set; }
        public string Unique_Doctor_Visited_Count { get; set; }
        public string Unique_Chemist_Visited_Count { get; set; }
        public string Total_Chemist_Calls_Made { get; set; }
        public string CP_Deviation_Count { get; set; }
        public string TP_Deviation_Count { get; set; }
        public string Unique_Stockiest_Visit_Count { get; set; }
        public string Stockiest_Calls_Made { get; set; }
        public string Total_Doctor_POB { get; set; }
        public string Total_Chemist_POB { get; set; }
        public string Total_Stockist_POB { get; set; }
        public string Total_Stockist_Collection { get; set; }
        public string Total_Non_Daily_Expense { get; set; }
        public string Total_Daily_Expense { get; set; }
        public string Non_Accompanist_Days_Count { get; set; }
        public string Total_Days_RCPA_Entered { get; set; }
        public string Total_Input_given_count { get; set; }
        public string Total_Drs_Met_Morning { get; set; }
        public string Total_Drs_Met_Evening { get; set; }
        public string Total_SecondarySales_Value { get; set; }
        public string Total_PrimarySales_Value { get; set; }
        public string Total_JW_Days_Count { get; set; }
        public string As_Of_Date_Approved_Doctors_Count { get; set; }
        public string Total_RCPA_Entered_Doctors { get; set; }
        public string Total_RCPA_Entered_Doctors_Listed { get; set; }
        public string Total_RCPA_Entered_Doctors_Unlisted { get; set; }
        public string Total_Hosptitals_Visited { get; set; }
        public string Total_Days_Worked_On_Holidays { get; set; }
    }

    public class UserCALCFieldsDetailsModel
    {
        public string Company_Code { get; set; }
        public string Header_Id { get; set; }
        public string Detail_Id { get; set; }
        public string Doctor_Category_Code { get; set; }
        public string Standard_Visits_Count { get; set; }
        public string Total_Approved_Doctors { get; set; }
        public string Total_Visited_Doctors { get; set; }
        public string Category_VC_Followed { get; set; }
        public string Category_VC_Missed { get; set; }
        public string Category_VC_Exceeded { get; set; }
        public string Category_Missed_Doctors { get; set; }
        public string Total_Detailing_Doctors { get; set; }
        public string Total_Sampling_Doctors { get; set; }
        public string Total_Non_Sample_Given_Doctors { get; set; }
        public string Total_RCPA_Made_Doctors { get; set; }
        public string Doctor_Calls_Made { get; set; }
        public string Planned_Count_In_TP { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }

    public class UserCALCFieldsModel
    {
        public List<UserCALCFieldsHeaderModel> lstCALCHeader { get; set; }
        public List<UserCALCFieldsDetailsModel> lstCALCDetails { get; set; }
        public List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstDoctorCategory { get; set; }
    }


    public class PayslipDataModel
    {
        public List<PayslipEmployeeDetail> lstEmpDetail { get; set; }
        public List<PayslipColunmDetail> lstpayslipColunm { get; set; }
        public List<PayslipDetails> lstPayslipDetail { get; set; }
    }

    public class PayslipEmployeeDetail
    {
        public string Employee_Number { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
    }
    public class PayslipColunmDetail
    {
        public string Column_No { get; set; }
        public string Column_Name { get; set; }
        public string User_Type_Code { get; set; }
    }
    public class PayslipDetails
    {
        public string Count { get; set; }
        public string Emp_No { get; set; }
    }

    public class PaySlipMetaDataModel
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public string Column_No { get; set; }
        public string Column_Name { get; set; }
        public string Label_Text { get; set; }
        public string Column_Type { get; set; }
        public string Horizontal_Align { get; set; }
        public string Vertical_Align { get; set; }
        public string Zone_Index { get; set; }
        public string Row_Index { get; set; }
        public string Column_Index { get; set; }
        public string Record_Status { get; set; }
        public string Column_Data_Type { get; set; }
        public string User_Type_Name { get; set; }
        public string DataTypeAliasName { get; set; }
    }

    public class PaySlipDefinerModel
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public string Column_No { get; set; }
        public string Column_Name { get; set; }
        public string Label_Text { get; set; }
        public string Column_Type { get; set; }
        public string Horizontal_Align { get; set; }
        public string Vertical_Align { get; set; }
        public string Zone_Index { get; set; }
        public string Row_Index { get; set; }
        public string Column_Index { get; set; }
        public string Record_Status { get; set; }
    }

    public class PaySlipColDataTypeModel
    {
        public string Company_Code { get; set; }
        public string Id { get; set; }
        public string DBDataTypeName { get; set; }
        public string DataTypeAliasName { get; set; }


    }

    public class RegionTreesModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Under_Region_Code { get; set; }
        public string User_Name { get; set; }
        public string vaccant_region { get; set; }

    }

    public class RegionTreeVacant
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Under_Region_Code { get; set; }
        public string User_Name { get; set; }
    }

    public class RegionTreeModel
    {

        public List<RegionTreesModel> lstRegion { get; set; }
        public List<RegionTreeVacant> lstVacantReg { get; set; }
    }

    public class UserrTreeModel
    {

        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Code { get; set; }
        public string Region_Name { get; set; }
    }

    public class UserTreeModelNew
    {
        public string Employee_Code { get; set; }
        public string Employee_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Code { get; set; }
        public string Region_Name { get; set; }
    }

    public class StateModel
    {
        public int State_ID { get; set; }
        public string State_Name { get; set; }
        public int Status { get; set; }
    }

    public class CityModel
    {
        public int City_ID { get; set; }
        public string City_Name { get; set; }
    }
    public class PincodeModel
    {
        public int Pincode { get; set; }
        public int Pincode_Id { get; set; }
    }
    public class DepartmentModel
    {
        public string Department_Name { get; set; }
        public int Department_Id { get; set; }
    }
    public class GroupDetails
    {
        public string Group_Name { get; set; }
        public int Group_ID { get; set; }
        public string User_Code { get; set; }
    }

    public class UserTypeSplashModel
    {
        public string User_Type_Code { get; set; }
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string Division_Code { get; set; }
    }

    public class Usercodelst
    {
        public string User_Code { get; set; }
    }

    public class KI_UserTypeModel
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Type { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Type_Status { get; set; }
        public string User_Type_Category { get; set; }
        public int Row_Version_No { get; set; }
        public string Updated_By { get; set; }
        public string Created_By { get; set; }
        public int User_Type_ID { get; set; }
        public int Under_User_Type_ID { get; set; }
    }

    public class ActivityDataModel
    {
        public List<ActivityDataListModel> lst { get; set; }
    }
    public class ActivityDataListModel
    {
        public string UserTypeCode { get; set; }
        public string ActivityCode { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Sfc_Mandatory { get; set; }
        public string Mapped_code { get; set; }
    }
    public class ValidationActivityDataListModel
    {
        public string UserTypeCode { get; set; }
        public string ActivityCode { get; set; }
    }
    public class ActivityMappedDataModel
    {
        public string UserType_Activity_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_type_Name { get; set; }
        public string Activity_Code { get; set; }
        public string Activity_Name { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Sfc_Mandatory { get; set; }
        public string Sfc_Not_Mandatory { get; set; }
    }

    public class UserInfo
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
    }

    public class SingleDeviceGUID
    {
        public string User_Code { get; set; }
        public string Device_GUID { get; set; }
        public string UserName { get; set; }
    }

    public class HDAccessDetails
    {
        public string User_Name { get; set; }
        public string Is_Web_Access { get; set; }
        public string Is_App_Access { get; set; }
        public string Created_On { get; set; }
        public string Created_By { get; set; }
        public string Updated_On { get; set; }
        public string Updated_By { get; set; }
    }
    public class BloodGroup
    {
        public string Blood_Group_Id { get; set; }
        public string Blood_Group_Name { get; set; }
        public int Status { get; set; }
        public string Company_code { get; set; }
    }


    public class Employeemasterpopup
    {
        public string EmployeeName { get; set; }
        public string employeeNumber { get; set; }
        public string gender { get; set; }
        public string dateOfBirth { get; set; }
        public int Department_Id { get; set; }
        public string EDNProof { get; set; }
        public string salaryProof { get; set; }
        public string resumeGiven { get; set; }
        public string resignationSubmitted { get; set; }
        public string appointed { get; set; }
        public string dateofJoining { get; set; }
        public string ProDateofConfirm { get; set; }
        public string confirmationDate { get; set; }
        public string PFNumber { get; set; }
        public string PANNumber { get; set; }
        public string SCBAccountNumber { get; set; }
        public string ICICIAccountNumber { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string address3 { get; set; }
        public int State_ID { get; set; }
        public int City_ID { get; set; }
        public int Pincode_Id { get; set; }
        public string mobile { get; set; }
        public string phone { get; set; }
        public string emailId { get; set; }
        public string employeeEntityType { get; set; }
        public string employeeCode { get; set; }
        public string mode { get; set; }
        public string aadhaar_No { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
        public string Blood_Group { get; set; }
        public string Employee_Photo { get; set; }
    }
    public class popupEmployeeModel
    {
        public string Mail { get; set; }
        public string Mobile { get; set; }
        public string Phn { get; set; }
        public string Add1 { get; set; }
        public string Add2 { get; set; }
        public string Add3 { get; set; }
        public int State { get; set; }
        public int City { get; set; }
        public int Pincode { get; set; }
        public string Bloodgroup { get; set; }
        public string Employeephoto { get; set; }

    }


}