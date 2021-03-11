using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class ExpenseClaimModel
    {
        public List<HiDoctor_Master.UserModel> lstUser { get; set; }
        public List<ExpenseClaimHeaderModel> lstClaimHeader { get; set; }
        public List<ExpenseClaimRemarks> lstClaimRemarks { get; set; }
        public List<ExpenseClaimHeaderModel> lstClaimHeaderHistory { get; set; }
        public List<ClaimExpenseTypeDetail> lstExpenseTypewiseDetail { get; set; }
    }

    public class ExpenseClaimRemarks
    {
        public string Updated_Date { get; set; }
        public string Remarks_By_User { get; set; }
        public string User_Name { get; set; }
    }

    public class ExpenseClaimHeaderModel
    {
        public string Company_Code { get; set; }
        public string Claim_Code { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Cylce_Code { get; set; }
        public string Cycle_Name { get; set; }
        public string Request_Entity { get; set; }
        public string Request_Code { get; set; }
        public string Request_Name { get; set; }
        public string Status_Code { get; set; }
        public string Status_Name { get; set; }
        public double Actual_Amount { get; set; }
        public double Approved_Amount { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Entered_DateTime { get; set; }
        public string Favouring_User_Code { get; set; }
        public string Remarks_By_User { get; set; }
        public string Remarks_By_Admin { get; set; }
        public char Record_Status { get; set; }
        public int Order_No { get; set; }
        public double Other_Deduction { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Move_Order { get; set; }
        public string Status_Owner_Type { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public double Total_Deduction { get; set; }
        public double Item_Wise_Deduction { get; set; }
        public double Remarks_Count { get; set; }
        public int Version_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string Request_Type { get; set; }

        public int Detail_Claim_Code { get; set; }
        public string Claim_Entered_Datetime { get; set; }
        public string Expense_Claim_Screen_Mode { get; set; }
        public string ImgPath { get; set; }
        public string Division_Values { get; set; }
    }
    public class ExpenseClaimDetailNewModel
    {
        public string Company_Code { get; set; }
        public string Claim_Code { get; set; }
        public string Expense_Type_Code { get; set; }
        public double Expense_Amount { get; set; }
        public double Approved_Amount { get; set; }
        public string DCR_Actual_Date { get; set; }
        public char DCR_Activity_Flag { get; set; }
        public string DCR_Expense_Code { get; set; }
        public string Record_Status { get; set; }
        public string Bill_Number { get; set; }
        public string Remarks_By_User { get; set; }
        public int Version_Number { get; set; }
        public string Expense_Mode { get; set; }
        public string Customer_Code { get; set; }
        public string Doctor_Region_Code { get; set; }
        public double Present_Contribution { get; set; }
        public double Potential_Contribution { get; set; }
    }
    public class ExpenseClaimAddlDetailsModel
    {
        public string DCR_Date { get; set; }
        public string DCR_Flag { get; set; }
        public string Dcr_Category { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Mode { get; set; }
        public float Expense_Amount { get; set; }
        public string Addl_Reference_Details { get; set; }
        public string Addl_Expense_Remarks { get; set; }
    }

    public class ExpenseClaimDetailsModel
    {
        public string Company_Code { get; set; }
        public string Claim_Code { get; set; }
        public string Claim_Detail_Code { get; set; }
        public string Expense_Type_Code { get; set; }
        public double Expense_Amount { get; set; }
        public string Customer_Code { get; set; }
        public double Present_Contribution { get; set; }
        public double Potential_Contribution { get; set; }
        public string Bill_Number { get; set; }
        public string Remarks_By_User { get; set; }
        public string Record_Status { get; set; }
        public string DCR_Actual_Date { get; set; }
        public double Approved_Amount { get; set; }
        public string Managers_Approval_Remark { get; set; }
        public char DCR_Activity_Flag { get; set; }
        public string DCRExpense_Activity_Flag { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public string DCR_Status { get; set; }
        public double Deduction_Amount { get; set; }
        public int Doctor_Visit_Count { get; set; }
        public int ADoctor_Visit_Count { get; set; }
        public string Customer_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Speciality_Name { get; set; }
        public string Category { get; set; }
        public string DCR_Expense_Code { get; set; }
        public string Region_Name { get; set; }
        public string DCR_Date { get; set; }
        public int Version_Number { get; set; }
        public string Expense_Remarks { get; set; }
        public string TPStatus { get; set; }
        public string Expense_Mode { get; set; }
        public int S_No { get; set; }
        public string Activity_Name { get; set; }
        public string DCR_Code { get; set; }
    }

    public class CRMStockiest
    {
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Region_Name { get; set; }
    }

    public class CRMProduct
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
    }

    public class CRMCustomerDetails
    {
        public string Company_Code { get; set; }
        public string Base_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Percentage { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Claim_Code { get; set; }

    }
    public class AddlExpenseDetails
    {
        public List<DCRUserExpenseDetails> lstDcrExp { get; set; }
        public List<UserExpenseTypeDetails> lstUserExpDet { get; set; }
        public List<AddlDcrUniqueDate> lstDcrDateUq { get; set; }
        public List<MonthlyExpense> lstDcrExpense { get; set; }
    }
    public class AddlDcrUniqueDate
    {
        public string DCR_Date { get; set; }
    }
    public class UserExpenseTypeDetails
    {
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Mode { get; set; }
        public string Expense_Entity { get; set; }
        public float Eligibility_Amount { get; set; }
        public string Can_Split_Amount { get; set; }
        public string Is_Validation_On_Eligibility { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Mandate_Remarks { get; set; }
    }
    public class DCRUserExpenseDetails
    {
        public double Expense_Amount { get; set; }
        public string DCR_Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Flag { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Claim_Code { get; set; }
        public string DCR_Expense_Code { get; set; }
        public string User_Code { get; set; }
        public string DCR_Status { get; set; }
        public string Category { get; set; }
        public string Reason { get; set; }
        public string DCR_Expense_Remarks { get; set; }

    }
    public class AddlUnapproveExpModel
    {
        public string Expense_Type_Name { get; set; }
        public string Expense_Type_Code { get; set; }
        public string DCR_Activity_Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
        public float Expense_Amount { get; set; }
        public string Category { get; set; }
        public string Remarks_By_User { get; set; }
        public string Favouring_User_Code { get; set; }
        public float Approved_Amount { get; set; }
        public float Deduction_Amount { get; set; }
        public string Claim_Detail_Code { get; set; }
        public string Bill_Number { get; set; }
        public string Managers_Approval_Remark { get; set; }
    }
    public class ClaimExpenseTypeDetail
    {
        public string Expense_Type_Name { get; set; }
        public string Expense_Amount { get; set; }
        public string Approved_Amount { get; set; }
        public string Total_Deduction { get; set; }
        public string Claim_Code { get; set; }
        public string Status_Code { get; set; }


    }

    public class ClaimExpenseTypeWiseHistory
    {
        public string History_Count { get; set; }
        public string Expense_Type_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
    }

    public class ExpenseClaimApprovalModel
    {
        public List<ExpenseTypeclaimModel> lstExpenseTypes { get; set; }
        public List<ExpenseSFCModel> lstExpenseSFC { get; set; }
        public List<ExpenseActivityModel> lstExpenseActivity { get; set; }
        public List<DCRUserExpenseDetails> lsFieldDates { get; set; }
        public List<DCRUserExpenseDetails> lsAttendanceDates { get; set; }
        public List<DCRUserExpenseDetails> lsLeavDaysExceptLOP { get; set; }
    }

    public class ExpenseTypeclaimModel
    {
        public string Expense_Type_Name { get; set; }
        public string Expense_Mode { get; set; }
        public double Approved_Amount { get; set; }
        public double Eligibility_Amount { get; set; }
    }

    public class ExpenseSFCModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Category { get; set; }
        public string Distance { get; set; }
        public int SFC_Visit_Count { get; set; }
        public int SFC_Version_No { get; set; }
        public int Actual_Visit_Count { get; set; }
        public string Region_Name { get; set; }
    }

    public class ExpenseActivityModel
    {
        public float Totaldays { get; set; }
        public double Field_Count { get; set; }
        public double Attendance_Count { get; set; }
        public double Leave_CountWithLOP { get; set; }
        public double Leave_CountWithOutLOP { get; set; }
        public int Holiday_Count { get; set; }
        public int WeekEnd_Count { get; set; }
        public int LockLeave_Count { get; set; }

    }
    public class CRMExpenseApproavedProducts
    {
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Month { get; set; }
        public string Sales { get; set; }
    }
    public class CRMYeildPotential
    {
        public string Product_Code { get; set; }
        public string Potential_Quantity { get; set; }
        public string Support_Quantity { get; set; }
    }
    public class CRMCycleMapping
    {
        public string User_Code { get; set; }
        public string Cycle_Code { get; set; }
        public string Cycle_Name { get; set; }
        public string Status_Code { get; set; }
    }

    public class CRMPaymentDetails
    {
        public string Payment_Mode { get; set; }
        public string Payment_Remarks { get; set; }
    }
    public class ExpenseCalimHolidayList
    {
        public string Holiday_Name { get; set; }
        public string Holiday_Date { get; set; }
        public string Holiday_Date_Display { get; set; } // Display format

    }

    public class ExpenseWeekendList
    {
        public string Date { get; set; }
        public string DisplayDate { get; set; } // Display purpose only.
    }

    public class ExpenseClaimLockLeaveDetails
    {
        public string DCR_Actual_Date { get; set; }
        public string DCR_Actual_Date_Display { get; set; }
        public string Reason_Name { get; set; }
    }

    public class ExpenseClaimImageUpload
    {
        public int EI_ID { get; set; }
        public string Claim_Code { get; set; }
        public string Image_File_Path { get; set; }
        public string File_Name { get; set; }
        public string Company_Code { get; set; }
        public int Img_ID { get; set; }
    }
    public class ExpenseClaimConfit
    {
        public string Config_Value { get; set; }
    }
    public class AddlExpModel
    {
        public int S_No { get; set; }
        public float Expense_Amount { get; set; }
        public float Approved_Amount { get; set; }
        public string DCR_Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Flag { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Mode { get; set; }
        public string Expense_Claim_Code { get; set; }
        public string DCR_Expense_Code { get; set; }
        public string User_Code { get; set; }
        public string DCR_Status { get; set; }
        public string Dcr_Category { get; set; }
        public string Addl_Reference_Details { get; set; }
        public string Addl_Expense_Remarks { get; set; }
        public String Addl_User_Remarks { get; set; }

    }
    public class ExpenseClaimApprvalData
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string claimCode { get; set; }
        public string claimDetails { get; set; }
        public string statusCode { get; set; }
        public double approvedAmount { get; set; }
        public string adminRemarks { get; set; }
        public string orderNo { get; set; }
        public string OtherDeduction { get; set; }
        public double actualAmount { get; set; }
        public string ExpType { get; set; }
        public string expensePrivilegevalue { get; set; }
        public string claimUserTypeName { get; set; }
        public string favoringUserCode { get; set; }
        public string payment_Mode { get; set; }
        public string payment_Remarks { get; set; }
        public string moveOrder { get; set; }
        public string updatedTime { get; set; }
    }
    public class ExpenseActivity
    {
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
    }
    public class ExpenseActivityType
    {
        public string Activity_Code { get; set; }
        public string Activity_Name { get; set; }
    }
    public class objExpense
    {
        public string activity { get; set; }
        public string activitytype { get; set; }
        public string Expense { get; set; }
        public string startdate { get; set; }
        public string enddate { get; set; }
        public string UserTypeCode { get; set; }
    }
    public class expensecode
    {
        public string code { get; set; }
    }
    public class Details
    {

        public string ExpenseMapping_id { get; set; }
        public string Activity { get; set; }
        public string Status { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Activity_Name { get; set; }
        public string Created_Date { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Expense_Code { get; set; }
        public string Activity_N { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string Activity_Type { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }

    }
    public class MonthlyExpense
    {
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Expense_Entity { get; set; }
        public string Expense_Mode { get; set; }
        public decimal Eligibility_Amount { get; set; }
        public string DCR_Date { get; set; }
        public string Flag { get; set; }
        public string Category { get; set; }
        public string Result { get; set; }
        public string Is_Validation_On_Eligibility { get; set; }
    }
    public class ExpenseUrl
    {
        public string DCR_Code { get; set; }
        public string Uploaded_File_Name { get; set; }
        public string Blob_Url { get; set; }
        public string DCR_Date { get; set; }
        public int ID { get; set; }
    }
    public class ExpenseTable
    {
        public string DCR_Expense_Code { get; set; }
    }
}