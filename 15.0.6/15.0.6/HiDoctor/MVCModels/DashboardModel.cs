using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DashboardModel
    {

    }

    public class UserDashboardModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public int User_Id { get; set; }
        public string Region_Code { get; set; }
        public int Cur_Month_Unread_NB_Count { get; set; }
        public int Cur_Month_Unread_Msg_Count { get; set; }
        public int Cur_Month_Drs_Birthday_Count { get; set; }
        public int Cur_Month_Drs_Anniversary_Count { get; set; }
        public int Cur_Month_UnApproved_DCR_Count { get; set; }
        public int Pre_Month_UnApproved_DCR_Count { get; set; }
        public int Cur_Month_UnApproved_TP_Count { get; set; }
        public int Next_Month_UnApproved_TP_Count { get; set; }
        public double Till_Date_UnApproved_ExpClaim_Count { get; set; }
        public float Cur_Month_Doctor_Calls_Made { get; set; }
        public int Pre_Month_Doctor_Calls_Made { get; set; }
        public int Cur_Month_Approved_Drs_Count { get; set; }
        public int Pre_Month_Approved_Drs_Count { get; set; }
        public float Cur_Month_Total_Field_Days { get; set; }
        public float Pre_Month_Total_Field_Days { get; set; }
        public int Cur_Month_Unique_Doctor_Visited_Count { get; set; }
        public int Pre_Month_Unique_Doctor_Visited_Count { get; set; }
        public int Cur_Month_Unique_Chemist_Visited_Count { get; set; }
        public int Pre_Month_Unique_Chemist_Visited_Count { get; set; }
        public int TP_lock_Days_Count { get; set; }
        public double Cur_Month_SS_Amount { get; set; }
        public double Pre_Month_SS_Amount { get; set; }
        public double Cur_Month_SS_Qty { get; set; }
        public double Pre_Month_SS_Qty { get; set; }
        public double Cur_Month_Doctor_Call_Avg { get; set; }
        public double Pre_Month_Doctor_Call_Avg { get; set; }
        public double Cur_Month_Chemist_Call_Avg { get; set; }
        public double Pre_Month_Chemist_Call_Avg { get; set; }
        public double Cur_Month_Applied_DCR_Count { get; set; }
        public double Pre_Month_Applied_DCR_Count { get; set; }
        public double Cur_Month_Applied_TP_Count { get; set; }
        public double Next_Month_Applied_TP_Count { get; set; }
        public double Cur_Month_Claim_For_Approval { get; set; }
        public double Pre_Month_Claim_For_Approval { get; set; }
        public double Till_Date_Applied_ExpClaim_Count { get; set; }
        public double Cur_Month_SS_Value { get; set; }  
        public double Pre_Month_SS_Value { get; set; }  
    }
    public class UserCategoryDashboardModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public int User_Id { get; set; }
        public string Region_Code { get; set; }
        public string Doctor_Category_Code { get; set; }
        public string Category_Name { get; set; }
        public string DivisionCode { get; set; }
        public int Pre_Month_Total_Approved_Doctors { get; set; }
        public int Cur_Month_Total_Approved_Doctors { get; set; }
        public double Pre_Month_Doctor_Calls_Made { get; set; }
        public double Cur_Month_Doctor_Calls_Made { get; set; }
        public double Pre_Month_Category_Coverage { get; set; }
        public double Cur_Month_Category_Coverage { get; set; }
        public double Pre_Month_Standard_Visits_Count { get; set; }
        public double Pre_Month_Total_Visited_Doctors { get; set; }
        public double Pre_Month_Category_VC_Followed { get; set; }
        public double Pre_Month_Category_VC_Missed { get; set; }
        public double Pre_Month_Category_VC_Exceeded { get; set; }
        public double Pre_Month_Category_Missed_Doctors { get; set; }
        public double Cur_Month_Standard_Visits_Count { get; set; }
        public double Cur_Month_Total_Visited_Doctors { get; set; }
        public double Cur_Month_Category_VC_Followed { get; set; }
        public double Cur_Month_Category_VC_Missed { get; set; }
        public double Cur_Month_Category_VC_Exceeded { get; set; }
        public double Cur_Month_Category_Missed_Doctors { get; set; }
        public double Cur_Month_Category_VC_Followed_Percentage { get; set; }
        public double Cur_Month_Category_VC_Missed_Percentage { get; set; }
        public double Cur_Month_Category_VC_Exceeded_Percentage { get; set; }
        public double Cur_Month_Category_Missed_Doctors_Percentage { get; set; }
        public double Pre_Month_Category_VC_Followed_Percentage { get; set; }
        public double Pre_Month_Category_VC_Missed_Percentage { get; set; }
        public double Pre_Month_Category_VC_Exceeded_Percentage { get; set; }
        public double Pre_Month_Category_Missed_Doctors_Percentage { get; set; }
    }

    public class UserDashboardCountModel
    {
        public int Count { get; set; }
        public string Mode { get; set; }
    }

    public class UserDashboardPendingDCR
    {
        public string User_Name { get; set; }
        public string Activity_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Formatted_DCR_Actual_Date { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }

    public class UserDashboardPendingTP
    {
        public string User_Name { get; set; }
        public string Activity_Name { get; set; }
        public string Tp_Date { get; set; }
        public string Formatted_Tp_Date { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
    public class UserDashboardPendingClaim
    {
        public string Request_Type { get; set; }
        public string Request_Code { get; set; }
        public string Claim_Code { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Entered_DateTime { get; set; }
        public string Favouring_User_Code { get; set; }
        public string User_Name { get; set; }
        public string Remarks_By_User { get; set; }
    }
    public class UserDashboardTourPlan
    {
        public int TP_Day { get; set; }
        public string TP_Day_Name { get; set; }
        public string TP_Date { get; set; }
    }

    public class UserDashboardCategoryWiseDoctors
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
        public string Standard_Visits_Count { get; set; }
        public string Doctor_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Speciality_Name { get; set; }
        public string Cur_Month_Visit_Count { get; set; }
        public string Pre_Month_Visit_Count { get; set; }
        public string Missed_Count { get; set; }
        public string Met_As_Per_Standard_Count { get; set; }
        public string More_Than_Met_Count { get; set; }
        public string Less_Than_Met_Count { get; set; }
        public string Region_Code { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class DashboardCategoryWiseDoctorVisit
    {
        public string Doctor_Name { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Code { get; set; }
        public string MDL_Number { get; set; }
        public int Standard_Visits_Count { get; set; }
        public int Cur_Month_Count { get; set; }
        public int Pre_Month_Count { get; set; }
        public int Cur_Month_Category_VC_Followed { get; set; }
        public int Cur_Month_Category_VC_Missed { get; set; }
        public int Cur_Month_Category_VC_Exceeded { get; set; }
        public int Cur_Month_Category_Missed_Doctors { get; set; }
        public int Cur_Month_Total_Approved_Doctors { get; set; }
        public string IsCurrent { get; set; }

        public int Pre_Month_Category_VC_Followed { get; set; }
        public int Pre_Month_Category_VC_Missed { get; set; }
        public int Pre_Month_Category_VC_Exceeded { get; set; }
        public int Pre_Month_Category_Missed_Doctors { get; set; }
        public int Pre_Month_Total_Approved_Doctors { get; set; }
    }

    public class DashboardDoctorVisitSummary
    {
        public string RowNumber { get; set; }
        public string Doctor_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string IsCurrent { get; set; }
        public string Mode { get; set; }
        public int Category_VC_Followed { get; set; }
        public int Category_VC_Missed { get; set; }
        public int Category_VC_Exceeded { get; set; }
        public int Category_Missed_Doctors { get; set; }
        public int Total_Approved_Doctors { get; set; }
        public int Total_Visited_Doctors { get; set; }
    }

    public class DashBoardDoctorVisitSummaryandTotalCount
    {
        public int Totalcount { get; set; }
        public List<DashboardDoctorVisitSummary> lstDashboardDoctorVisitSummary { get; set; }
    }

    public class DashboardExpense
    {
        public double S_Cur_Month_TotalAmount { get; set; }
        public double S_Pre_Month_TotalAmount { get; set; }
        public double T_Cur_Month_TotalAmount { get; set; }
        public double T_Pre_Month_TotalAmount { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Type_Code { get; set; }
        public double Cur_Month_TotalAmount { get; set; }
        public double Pre_Month_TotalAmount { get; set; }
    }


    public class DashboardSSTotalAmount
    {
        public double S_Cur_Month_SS_Value { get; set; }     
        public double S_Pre_Month_SS_Value { get; set; }     
        public double T_Cur_Month_SS_Value { get; set; }      
        public double T_Pre_Month_SS_Value { get; set; }
    }

    public class DasboardSSLst
    {
        public List<SSPreviousAmount> lstSSPrevious { get; set; }
        public List<SSPrePreviousAmount> lstSSPrePrevious { get; set; }
    }

    public class SSPreviousAmount
    {
        public string Stockist_Code { get; set; }
        public string Stockist_Name { get; set; }
        public string Previous_Region_Code { get; set; }
        public double SS_Previous_Count { get; set; }
        public double SS_Previous_Quantity { get; set; }
    }

    public class SSPrePreviousAmount
    {
        public string Stockist_Code { get; set; }
        public string Stockist_Name { get; set; }
        public string PrePrevious_Region_Code { get; set; }   
        public double SS_PrePrevious_Count { get; set; }     
        public double SS_PrePrevious_Quantity { get; set; }
    }
    

    public class DashboardStockiestSS
    {
        public string Stockiest_Name { get; set; }
        public double Quantity { get; set; }
        public double Sales { get; set; }
    }

}
