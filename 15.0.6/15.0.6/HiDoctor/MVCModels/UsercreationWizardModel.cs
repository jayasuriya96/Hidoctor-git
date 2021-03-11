using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class UsercreationWizardModel
    {

    }

    #region Employee details

    public class User_EmployeeModel
    {
        public string Employee_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
    }

    public class User_Employeedetails
    {
        public string Company_Code { get; set; }
        public string Employee_Code { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string Gender { get; set; }
        public string Date_of_birth { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Email_Id { get; set; }
        public string Date_of_Joining { get; set; }
        public string Date_of_Confirmation { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
        public string EDN_Proof { get; set; }
        public string Salary_Proof { get; set; }
        public string Resume_Given { get; set; }
        public string Resignation_Submitted { get; set; }
        public string Appointed { get; set; }
        public string SCB_Account_Number { get; set; }
        public string ICICI_Account_Number { get; set; }
        public string PF_Number { get; set; }
        public string PAN_Number { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Pass { get; set; }
        public string Reporting_Manager_User_Name { get; set; }
        public string Reporting_Manager_User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Reporting_Manager_Region_Code { get; set; }
        public string Reporting_Manager_Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Division_Code { get; set; }
        public string Entity_Code { get; set; }
        public string Division_Name { get; set; }
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
        public string Entry_Mode { get; set; }
        public string Created_By { get; set; }
        public string User_Status { get; set; }
        public string Under_User_Code { get; set; }
        public string Updated_By { get; set; }
        public string Disable_Date { get; set; }
        public string Edit_Employee_Name { get; set; }
        public string Effective_From { get; set; }
        public string Resignation_Date { get; set; }
        public string lstunderuser { get; set; }
        public string Prop_Date_of_Confirmation { get; set; }
        public string Remarks { get; set; }
        public string RefKey1 { get; set; }
        public string RefKey2 { get; set; }
        public string ActualReporting { get; set; }
    }
    public class UnderUserModel
    {
        public string User_Name { get; set; }
        public string User_Code { get; set; }

    }
    public class UserDivisions
    {
        public string User_Code { get; set; }
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
    }
    public class ReportedUser
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }
    public class Reportuserhierarchy
    {

        public string Reporting_UserCode { get; set; }
        public string Reporting_User_Name { get; set; }
        public string Reporting_To_UserCode { get; set; }
        public string Reporting_To_UserName { get; set; }

    }
    public class UserDetails
    {
        public string Employee_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Reporting_Region_Code { get; set; }
        public string Reporting_Region { get; set; }
        public string Under_User_Code { get; set; }
        public string Reporting_Manager { get; set; }
        public string User_Division_Code { get; set; }
        public string Division_Name { get; set; }
        public string HiDoctor_start_Date { get; set; }
        public string User_Pass { get; set; }
        public int Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
        public string Effectivefrom { get; set; }
        public int Effective { get; set; }
        public string RefKey1 { get; set; }
        public string RefKey2 { get; set; }
        public string ActualReporting { get; set; }
        public string ActualReporting_Code { get; set; }
        public string ActulReporting_Name { get; set; }
        public string user_name { get; set; }
        public string user_code { get; set; }
    }

    public class UpdateUser
    {
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string Region_Code { get; set; }
        public string Under_User_Code { get; set; }
        public string UserDivisionCode { get; set; }
        public int Expense_Group_Id { get; set; }


    }
    public class User_UserTypeMasterModel
    {
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class User_DivisionMasterModel
    {
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
    }

    public class User_RegionMasterModel
    {
        public string Region_Status { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
    }
    public class DCRDATE
    {
        public string DCR_Entered_Date { get; set; }
    }
    public class Employee
    {
        public string Employee_Name { get; set; }
        public string Employee_Code { get; set; }
    }
    public class User_UserMasterModel
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Id { get; set; }
        public string Employee_Code { get; set; }
        public string Region_Name { get; set; }
        public string Employee_Number { get; set; }
    }

    public class User_ProjectMaster
    {
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
    }

    public class User_ExpenseGroupHeaderModel
    {
        public string Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
    }
    public class User_ActivityMasterModel
    {
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string Activity_Code { get; set; }
        public string Activity_Name { get; set; }
    }

    public class RigionByDivisionModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Entity_Code { get; set; }
        public string Division_Code { get; set; }
    }

    public class KangleUserDetails
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string Employee_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Under_User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Pass { get; set; }
        public string User_Status { get; set; }
        public string Region_Code { get; set; }
        public string User_Category_Code { get; set; }
        public int Row_Version_No { get; set; }
        public string Updated_By { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
        public int Under_User_Id { get; set; }
        public string Seq_index { get; set; }
        public string Full_index { get; set; }
        public int User_Id { get; set; }
        public int Display_Order { get; set; }
        public string Division_Code { get; set; }
        public int IS_Kangle_Access { get; set; }
    }

    public class kangleEmployeeDetails
    {
        public string Employee_Name { get; set; }
        public string Employee_Code { get; set; }
        public string Gender { get; set; }
        public string Date_Of_Birth { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Employee_Status { get; set; }
        public string Email_Id { get; set; }
        public string Date_of_Joining { get; set; }
        public string Employee_Number { get; set; }
        public int Row_Version_No { get; set; }
        public string Employee_Entity_Type { get; set; }
        public string Created_By { get; set; }
        public string Updated_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Updated_DateTime { get; set; }
        public string Resignation_Date { get; set; }
        public int Employee_Id { get; set; }
    }

    public class KangleUserEmployeeDetails
    {
        public kangleEmployeeDetails Employee { get; set; }
        public KangleUserDetails User { get; set; }
    }

    #endregion Employee details

    #region Leave Details
    public class User_LeaveTypeModel
    {
        public string Company_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }
        public string User_Leave_Code { get; set; }
        public string User_Type_Code { get; set; }
        public float Balance_CF { get; set; }
        public float Leave_Eligible { get; set; }
        public float Leave_Taken { get; set; }
        public float Leave_Balance { get; set; }
        public float Lapsed { get; set; }
        public float Opening_Balance { get; set; }
        public string User_Leave_Status { get; set; }
        public string Effective_From { get; set; }
        public string User_Code { get; set; }
        public string Effective_To { get; set; }
        public string leave_Eligibleforyear { get; set; }
        // public int tblLeaveCount { get; set; }
    }
    #endregion Leave Details

    #region Product details
    public class User_ProductModel
    {
        public string Company_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Type { get; set; }
        public string Product_Type_Name { get; set; }
        public string Current_Stock { get; set; }
        public string Effective_From { get; set; }
        public string User_Code { get; set; }
        public string User_Product_Status { get; set; }
        public int Min_Count { get; set; }
        public int Max_Count { get; set; }
    }
    #endregion Product details

    #region NoticeBoard Details
    public class User_NoticeBoard
    {
        public string Company_Code { get; set; }
        public string Title { get; set; }
        public string Msg_Code { get; set; }
        public string Message { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string User_Code { get; set; }
    }
    #endregion NoticeBoard Details
    #region Splash Details
    public class Splash
    {
        public string Company_Code { get; set; }
        public string Title { get; set; }
        public int Splash_Screen_Id { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }

    }
    #endregion Splash Details
    #region Edetailing

    public class Edetailing
    {
        public string Company_Code { get; set; }
        public int DA_Code { get; set; }
        public string DA_Name { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }

    #endregion Edetailing
    #region Disable User
    public class Disable_Emloyeedetails
    {
        public string Company_Code { get; set; }
        public string Employee_Code { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string Gender { get; set; }
        public string Date_of_birth { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Email_Id { get; set; }
        public string Date_of_Joining { get; set; }
        public string HiDOCTOR_Start_Date { get; set; }
        public string EDN_Proof { get; set; }
        public string Salary_Proof { get; set; }
        public string Resume_Given { get; set; }
        public string Resignation_Submitted { get; set; }
        public string Appointed { get; set; }
        public string SCB_Account_Number { get; set; }
        public string ICICI_Account_Number { get; set; }
        public string PF_Number { get; set; }
        public string PAN_Number { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Pass { get; set; }
        public string Reporting_Manager_User_Name { get; set; }
        public string Reporting_Manager_User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Reporting_Manager_Region_Code { get; set; }
        public string Reporting_Manager_Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Division_Code { get; set; }
        public string Entity_Code { get; set; }
        public string Division_Name { get; set; }
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
        public string Entry_Mode { get; set; }
        public string Created_By { get; set; }
        public string User_Status { get; set; }
        public string Under_User_Code { get; set; }
        public string Updated_By { get; set; }
        public string Disable_Date { get; set; }
    }
    public class Product
    {
        public string Entity_Code { get; set; }
        public string User_Product_Status { get; set; }
    }
    public class Privilege
    {
        public string Privilege_Value_name { get; set; }
        public string Record_status { get; set; }
    }
    public class UserPrivilege
    {
        public string Privilege_Value_name { get; set; }
        public string Record_status { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
    }
    public class Email
    {
        public string Email_Purpose { get; set; }
        public string Email_Id { get; set; }
        public int Status { get; set; }
        public string Subject { get; set; }
        public string TemplateName { get; set; }
    }
    #endregion Disable User


    public class DesignationByDivisionModel
    {
        public string User_Type_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string Entity_Code { get; set; }
        public string Division_Code { get; set; }
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
    public class ActualUser
    {
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Name { get; set; }


    }
    public class Empdet
    {
        public string New_User_Code { get; set; }
        public string New_User_Name { get; set; }
        public string Manager_Code { get; set; }
        public string Manager_Name { get; set; }
        public string Manager_Employee_Number { get; set; }
        public string User_Employee_Number { get; set; }
        public string Date_of_Joining { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Subject { get; set; }
    }

    ////

}
