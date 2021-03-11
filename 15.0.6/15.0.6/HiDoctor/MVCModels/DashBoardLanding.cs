using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DashBoardLanding
    {

        public static class Entity
        {
            public static string DCR = "DCR";
            public static string TP = "TP";
            public static string EXPNESECLAIM = "EXPENSECLAIM";
            public static string MESSAGING = "MESSAGING";
            public static string NOTICEBOARD = "NOTICEBOARD";
            public static string TASK = "TASK";
            public static string SAMPLEACK = "SAMPLEACK";
        }

        public class DCRApprovalMenuAccess
        {
            public string Menu_URL { get; set; }
            public string Access { get; set; }
        }

        public class DCRPendingApprovalUsers
        {
            public string EmployeeName { get; set; }
            public string UserTypeName { get; set; }
            public string UserCode { get; set; }
            public int Count { get; set; }
            public int TPType { get; set; }
        }

        public class TPPendingApprovalPending
        {
            public string User_Code { get; set; }
            public string User_Name { get; set; }
            public string Activity_Name { get; set; }
            public string Work_Area { get; set; }
            public string TP_Date { get; set; }
            public string Leave_Type_Name { get; set; }
            public string Project_Code { get; set; }
        }

        public class DCRDetails
        {
            public string User_Code { get; set; }
            public DateTime DCRDate { get; set; }
            public string Region_Code { get; set; }
            public string Flag { get; set; }
            public string DCR_Status { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
            public string dcrStatus { get; set; }
            public string flag { get; set; }
            public string DCR_Code { get; set; }
            public string Unapproval_Reason { get; set; }
            public string Leave_Type_Name { get; set; }
            public string Source_Of_Entry { get; set; }
            public DateTime DCREnteredDate { get; set; }
            public string User_Name { get; set; }
            public string Region_Name { get; set; }
            public string User_Type_Name { get; set; }
            public string Place_Worked { get; set; }
            public string Employee_Number { get; set; }
            public string Employee_Name { get; set; }
            public string Division_Name { get; set; }
        }

        public class TPDetails
        {
            public DateTime TPDate { get; set; }
            public string Activity { get; set; }
            public DateTime TPEnteredDate { get; set; }
            public string TP_Id { get; set; }
        }

        public class ExpenseClaimDetails
        {
            public string ClaimCode { get; set; }
            public DateTime ClaimedDate { get; set; }
            public DateTime DateFrom { get; set; }
            public DateTime DateTo { get; set; }
        }

        public class HolidayHistory
        {
            public List<DashBoardLanding.Past_Holiday> Past_Holidaylst { get; set; }
            public List<DashBoardLanding.Present_Holiday> Present_Holiday { get; set; }
        }

        public class Past_Holiday
        {
            public string RegionCode { get; set; }
            public string Holiday_Name { get; set; }
            public string Holiday_Date { get; set; }
        }

        public class Present_Holiday
        {
            public string RegionCode { get; set; }
            public string Holiday_Name { get; set; }
            public string Holiday_Date { get; set; }
        }

        public class EmployeeBirthday
        {
            public string Employee_Name { get; set; }
            public string User_Name { get; set; }
            public string Region_Name { get; set; }
            public string User_Type_Name { get; set; }
            public string Date_Of_Birth { get; set; }
            public string Email { get; set; }
            public string Mobile { get; set; }

        }

        public class DoctorBirthdayAnniversary
        {
            public string Customer_Name { get; set; }
            public string Customer_Code { get; set; }
            public string DOB { get; set; }
            public string Region_Name { get; set; }
            public string Region_Code { get; set; }
            public string Anniversary_Date { get; set; }
            public string Email { get; set; }
            public string Mobile { get; set; }
            public string User_Name { get; set; }
        }

        public class BirthdayAnniversaryCount
        {
            public int Holiday { get; set; }
            public int EmpBirthday { get; set; }
            public int DocAnn { get; set; }
            public int DocBir { get; set; }
        }

        public class LockDetails
        {
            public int Total_Locks { get; set; }
            public int Active_Locks { get; set; }
            public int Released_Locks { get; set; }
        }
    }
}
