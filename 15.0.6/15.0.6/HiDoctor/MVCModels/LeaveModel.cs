using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class LeaveModel
    {
        public string Company_Code { get; set; }
    }
    public class LeaveTypeModel
    {
        public string Company_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Leave_Type_Status { get; set; }
        public string Is_Comp_Off { get; set; }
        public string Is_LOP { get; set; }
    }

    public class UserLeaveTypeModel
    {
        public string Company_Code { get; set; }
        public string User_Leave_Type_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Leave_Status { get; set; }
        public double Min_Leave { get; set; }
        public double Max_Leave { get; set; }
        public string Club_Other_Leavetype { get; set; }
        public string IS_Added_Weekend_Holiday { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Leave_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string IS_Added_Holiday { get; set; }
        public string Validation_Mode { get; set; }
        public string Leave_Occurence_Count { get; set; }
        public string Leave_Max_Count { get; set; }
        public string Document_Upload_Days { get; set; }
        public string Consecutvie_Leave_Allowed { get; set; }
        public int leave_Eligibleforyear { get; set; }
        public string leave_confirmation_days { get; set; }
        public string leave_Oncompletion { get; set; }
        public int No_of_days { get; set; }
        public int leave_application_days { get; set; }
    }

    public class LeaveBalanceUploadFailure
    {
        public int Row_No;
        public string Failure_Reason;
    }

    public class LeaveCurBalance
    {
        public string Company_Code { get; set; }
        public string User_Leave_Code { get; set; }
        public string User_Type_Code { get; set; }
        public int Row_No { get; set; }
        public string User_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Balance_CF { get; set; }
        public string Leave_Eligible { get; set; }
        public string Leave_Taken { get; set; }
        public string Leave_Balance { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Leave_Status { get; set; }
        public string Is_Active { get; set; }
        public string Lapsed { get; set; }
        public string Opening_Balance { get; set; }
        public string Next_Credit_Date { get; set; }
        public string Request_From { get; set; }
        public string Request_Reason { get; set; }
        public string Total_Leave { get; set; }
        public string Entered_By { get; set; }
        public string Support_User_Name { get; set; }
        public string Requested_Date { get; set; }
        public string Entered_DateTime { get; set; }
    }

    public class LeaveTypeClubbing
    {
        public string Company_Code { get; set; }
        public string Clubbing_Code { get; set; }
        public string User_Leave_Type_Code { get; set; }
        public string Clubbing_Leave_Type { get; set; }
    }

    public class UsersForLeaveBalance
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public string user_name { get; set; }
    }

    public class UserTypeLeaveType
    {
        public string User_Type_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }

    }

    public class UpdateUserLeaveDetails
    {
        public List<UpdateLeavelist> lstUpdateDet { get; set; }
    }

    public class UpdateLeavelist
    {
        public string User_Leave_Code { get; set; }
        public decimal Balance_CF { get; set; }
        public decimal Leave_Eligible { get; set; }
        public decimal Lapsed { get; set; }
        public decimal Opening_Balance { get; set; }
        public decimal Leave_Balance { get; set; }
    }

    public class UserLeaveDetails
    {
        public string User_Type_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public decimal Balance_CF { get; set; }
        public decimal Leave_Eligible { get; set; }
        public decimal Opening_Balance { get; set; }
        public decimal Leave_Taken { get; set; }
        public decimal Leave_Balance { get; set; }
        public decimal Lapsed { get; set; }
        public int Newly_Added { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Leave_Code { get; set; }
    }

    public class AddUserLeave
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }
        public string HiDoctor_Start_Date { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Remarks { get; set; }
    }

}
