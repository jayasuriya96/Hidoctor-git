#region Using
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
#endregion Using

namespace HiDoctor_Activity.Models
{
    public class DCRLockModel
    {
        #region Properties
        public string IsTPDefineNextMonth { get; set; }
        public string MissedDCRDate { get; set; }
        public string IsRegionLock { get; set; }
        public string ReleasedDate { get; set; }
        public string LockType { get; set; }
        public string LockStatus { get; set; }
        public string HidoctorStartDate { get; set; }
        public string NeedsToBeTPMonth { get; set; }
        public string Leave_Entry_Mode { get; set; }
        public int TP_Approval_Lock { get; set; }
        public string Is_WA_User { get; set; }
        public bool Is_WA_TABLET_USER { get; set; }
        public string WA_REGIS_DATE { get; set; }
        public string Locked_Date { get; set; }
        public string TP_Define_Month { get; set; }
        public string TP_Define_Year { get; set; }
        public string TP_Approval_Month { get; set; }
        public string TP_Approval_Year { get; set; }
        public string SS_Applied_Lock { get; set; }
        public string Previous_Month_Year { get; set; }
        public string Lock_Reason { get; set; }
        public string Reason { get; set; }
        public string DCR_Actual_Date { get; set; }
        public int SS_Id { get; set; }

        #endregion Properties
    }

    public class DCRActivityLock
    {
        #region Properties
        public string User_Code { get; set; }
        public string Lock_Status { get; set; }
        public string Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string UnapproveReason { get; set; }
        #endregion Properties
    }

    public class DCRCalendarModel
    {
        #region Properties
        public string title { get; set; }
        public string day { get; set; }
        public string month { get; set; }
        public string year { get; set; }
        public string start { get; set; }
        public string status { get; set; }
        public string isTP { get; set; }
        public string url { get; set; }
        public string className { get; set; }
        public string Record_Status { get; set; }
        public string Released_Date { get; set; }
        public string Activity_Count { get; set; }
        public string DCR_Lock_Status { get; set; }
        public string LeaveType { get; set; }
      
        #endregion Properties
    }

    public class DCRHeaderModel
    {
        #region Properties

        [Display(Name = "Date")]
        public string DCR_Date { get; set; }
        public string Category { get; set; }

        [Display(Name = "CP No")]
        public string CP_No { get; set; }

        [Display(Name = "Work Place")]
        public string Work_Place { get; set; }

        [Display(Name = "Start time & End time")]
        public string Start_Time { get; set; }
        public string End_Time { get; set; }

        public string Accompanist_Name { get; set; }
        public string Accompanist_Region_Code { get; set; }
        public string CP_Code { get; set; }
        public string Tp_Code { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Valid_From { get; set; }
        public string Valid_To { get; set; }
        public string Category_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string User_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string Is_Route_Complete { get; set; }
        public string Customer_Count_Per_Region { get; set; }

        public string Acc1_Name { get; set; }
        public string Acc1_Code { get; set; }
        public string Acc1_Start_Time { get; set; }
        public string Acc1_End_Time { get; set; }
        public string Acc1_Only_For_Doctor { get; set; }

        public string Acc2_Name { get; set; }
        public string Acc2_Code { get; set; }
        public string Acc2_Start_Time { get; set; }
        public string Acc2_End_Time { get; set; }
        public string Acc2_Only_For_Doctor { get; set; }

        public string Acc3_Name { get; set; }
        public string Acc3_Code { get; set; }
        public string Acc3_Start_Time { get; set; }
        public string Acc3_Only_For_Doctor { get; set; }

        public string Acc4_Name { get; set; }
        public string Acc4_Code { get; set; }
        public string Acc4_Start_Time { get; set; }
        public string Acc4_Only_For_Doctor { get; set; }

        public string SFC_Type { get; set; }
        public string Distance_Edit { get; set; }
        public string Is_Prefill { get; set; }
        public string UnApproveBy { get; set; }
        public string UnApprovalReason { get; set; }
        public string ProjectCode { get; set; }
        public string ActivityCode { get; set; }
        public string TPDeviation { get; set; }
        public string CPDeviation { get; set; }

        public string SFC_Version_No { get; set; }
        public string SFC_Category_Name { get; set; }
        public string SFC_Region_Code { get; set; }
        public string Fare_Amount { get; set; }
        public string SFC_Visit_Count { get; set; }
        public string Minimum_Count { get; set; }

        #endregion Properties
    }

    public class DCRLeaveEntryModel
    {
        #region Properties
        [Required]
        [Display(Name = "From Date")]
        public string From_Date { get; set; }

        [Required]
        [Display(Name = "To Date")]
        public string To_Date { get; set; }

        [Required]
        [Display(Name = "Leave Type")]
        public string Leave_Type_Name { get; set; }
        public string Leave_Type_Code { get; set; }

        [Required]
        [Display(Name = "Reason")]
        public string Reason { get; set; }

        public double Balance_CF { get; set; }
        public double Leave_Eligible { get; set; }
        public double Leave_Balance { get; set; }
        public double Lapsed { get; set; }
        public double Opening_Balance { get; set; }
        public double Leave_Taken { get; set; }
        public char Club_Other_Leavetype { get; set; }
        public char IS_Added_Weekend_Holiday { get; set; }
        public double Min_Leave { get; set; }
        public double Max_Leave { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string User_Leave_Type_Code { get; set; }
        public char IS_Added_Holiday { get; set; }
        public int leave_Eligibleforyear { get; set; }
        public string leave_confirmation_days { get; set; }
        public string leave_Oncompletion { get; set; }
        public int No_of_days { get; set; }
        public int leave_application_days { get; set; }
        public string Confirmation_date { get; set; }


        #endregion Properties
    }

    public class DCRDoctorVisitModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string DCR_Code { get; set; }
        public string Doctor_Visit_Code { get; set; }
        public string User_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string Category_Code { get; set; }
        public string Is_Acc_Doctor { get; set; }
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Visit_Mode { get; set; }
        public string Doctor_Visit_Time { get; set; }
        public string Is_CPDoc { get; set; }
        public string POB_Amount { get; set; }
        public string Remarks { get; set; }
        public string Entered_Date_Time { get; set; }
        public string Lattitude { get; set; }
        public string Longtitude { get; set; }
        public string Location { get; set; }
        public string Source_of_Entry { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string Unique_Doctor_Code { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        #endregion Properties
    }

    public class DCRChemistVisitModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string DCR_Chemists_Code { get; set; }
        public string Chemist_Name { get; set; }
        public string Chemist_Code { get; set; }
        public string POB_Amount { get; set; }
        public string Is_Acc_Chemist { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        #endregion Properties
    }

    public class DCRProductDetailsModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Product_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Quantity_Provided { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Short_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Is_Detailed { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string Unique_Doctor_Code { get; set; }
        public string Current_Stock { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        #endregion Properties
    }

    public class DCRRCPADetailsModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string DCR_RCPA_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Chemist_Visit_Code { get; set; }
        public string Product_Code { get; set; }
        public string Competitor_Product_Name { get; set; }
        public string Suuport_Qty { get; set; }
        public string Competitor_Product_Code { get; set; }
        #endregion Properties
    }

    public class DCRStockiestModel
    {
        #region Properties
        public string StockiestCode { get; set; }
        public string StockiestName { get; set; }

        public string VisitSession { get; set; }
        public string POB { get; set; }
        public string collectionAmnt { get; set; }
        public string StockiestRemark { get; set; }
        #endregion Properties
    }

    public class DCRExpenseModel
    {
        #region Properties
        public string ExpenseCode { get; set; }
        public string ExpenseName { get; set; }

        public string ExpenseTypeCode { get; set; }
        public string ExpenseTypeName { get; set; }
        public string RegionCode { get; set; }
        public string ExpenseMode { get; set; }
        public string ExpenseEntity { get; set; }
        public string ExpenseEntityCode { get; set; }
        public string EligibilityAmount { get; set; }
        public string CanSplitAmount { get; set; }
        public string IsValidationOnEligibility { get; set; }
        public string SFC_Type { get; set; }
        public string IsPrefill { get; set; }
        public double TotalFare { get; set; }
        public string ExpenseRemark { get; set; }
        public string ExpenseAmount { get; set; }
        public string Period { get; set; }
        public string ExpenseGroupId { get; set; }
        public string Sum_Distance_Needed { get; set; }
        #endregion Properties
    }

    public class FareCalculationDTO
    {
        public string DcrCode { get; set; }
        public string DcrDate { get; set; }
        public string DcrFalg { get; set; }
        public string Entity { get; set; }
        public double TravelKm { get; set; }
        public string IntermediatePlace { get; set; }
        public double EligibilityAmount { get; set; }
        public string Sum_Distance_Needed { get; set; }
        public string DCR_Version { get; set; }
    }

    public class DCRAttendance
    {
        public string Activity_Name { get; set; }
        public string Activity_Code { get; set; }
        public string Project_Code { get; set; }
        public string Start_Time { get; set; }
        public string End_Time { get; set; }
        public string Remarks { get; set; }
        public string Category { get; set; }
    }

    public class DoctorVisitDoctorCodeComparer : IEqualityComparer<DCRDoctorVisitModel>
    {
        public bool Equals(DCRDoctorVisitModel x, DCRDoctorVisitModel y)
        {
            if (x.Doctor_Code.Length > 0)
            {
                return x.Unique_Doctor_Code == y.Unique_Doctor_Code;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DCRDoctorVisitModel doctorModel)
        {
            return doctorModel.Doctor_Code.GetHashCode();
        }
    }

    public class DoctorVisitProductComparer : IEqualityComparer<DCRProductDetailsModel>
    {
        public bool Equals(DCRProductDetailsModel x, DCRProductDetailsModel y)
        {
            return x.Unique_Doctor_Code == y.Unique_Doctor_Code;
        }

        public int GetHashCode(DCRProductDetailsModel doctorProductModel)
        {
            return doctorProductModel.Doctor_Code.GetHashCode();
        }
    }
   

}