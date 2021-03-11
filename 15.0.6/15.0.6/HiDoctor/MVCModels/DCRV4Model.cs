#region Usings
using System;
using System.Collections.Generic;
//using System.Collections.Generic;
using System.Linq;
using System.Text;
#endregion Usings

namespace MVCModels
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
        #endregion Properties
    }


    public class DCRHeaderModel
    {
        #region Properties
        public string DCR_Date { get; set; }
        public string Category { get; set; }
        public string CP_No { get; set; }
        public string Work_Place { get; set; }
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
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string Is_Route_Complete { get; set; }
        public string Acc1_Name { get; set; }
        public string Acc1_Code { get; set; }
        public string Acc1_Start_Time { get; set; }
        public string Acc1_End_Time { get; set; }
        public string Acc1_Only_For_Doctor { get; set; }
        public string Acc1_Mode_Of_Entry { get; set; }

        public string Acc2_Name { get; set; }
        public string Acc2_Code { get; set; }
        public string Acc2_Start_Time { get; set; }
        public string Acc2_End_Time { get; set; }
        public string Acc2_Only_For_Doctor { get; set; }
        public string Acc2_Mode_Of_Entry { get; set; }

        public string Acc3_Name { get; set; }
        public string Acc3_Code { get; set; }
        public string Acc3_Start_Time { get; set; }
        public string Acc3_Only_For_Doctor { get; set; }
        public string Acc3_Mode_Of_Entry { get; set; }

        public string Acc4_Name { get; set; }
        public string Acc4_Code { get; set; }
        public string Acc4_Start_Time { get; set; }
        public string Acc4_Only_For_Doctor { get; set; }
        public string Acc4_Mode_Of_Entry { get; set; }

        public string SFC_Type { get; set; }
        public string Distance_Edit { get; set; }
        public string Is_Prefill { get; set; }
        public string UnApproveBy { get; set; }
        public string UnApprovalReason { get; set; }
        public string ProjectCode { get; set; }
        public string ActivityCode { get; set; }
        public string TPDeviation { get; set; }
        public string CPDeviation { get; set; }
        public string Data_From { get; set; }

        public string SFC_Version_No { get; set; }
        public string SFC_Category_Name { get; set; }
        public string SFC_Region_Code { get; set; }
        public string Fare_Amount { get; set; }
        public string SFC_Visit_Count { get; set; }
        public string Is_TP_SFC { get; set; }
        public string CP_name { get; set; }
        public string Minimum_Count { get; set; }

        public string Child_Count { get; set; }
        #endregion Properties
    }

    public class SFCStatus
    {
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string From_Region_Name { get; set; }
        public string To_Region_Name { get; set; }
        public string Distance_Fare_Code { get; set; }

    }

    public class DCRSFCModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Route_Way { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Is_Route_Complete { get; set; }
        public string SFC_Region_Code { get; set; }
        public string SFC_Version_No { get; set; }
        public string SFC_Category_Name { get; set; }
        public string Fare_Amount { get; set; }
        public string SFC_Visit_Count { get; set; }
    }

    public class DCRLeaveEntryModel
    {
        #region Properties
        public string From_Date { get; set; }
        public string To_Date { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Reason { get; set; }
        public double Balance_CF { get; set; }
        public double Leave_Eligible { get; set; }
        public double Leave_Balance { get; set; }
        public double Lapsed { get; set; }
        public double Opening_Balance { get; set; }
        public int Leave_Taken_Approved { get; set; }
        public int Leave_Taken_Applied { get; set; }
        public char Club_Other_Leavetype { get; set; }
        public char IS_Added_Weekend_Holiday { get; set; }
        public double Min_Leave { get; set; }
        public double Max_Leave { get; set; }

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
        public string Mode_Of_Entry { get; set; }
        public string Record_Status { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string User_Name { get; set; }
        public string Customer_Status { get; set; }
        public string Mode_Of_Form { get; set; }
        public int POB_Count { get; set; }
        public int? Business_Status_ID { get; set; }
        public int? Call_Objective_ID { get; set; }
        public string MDL_Number { get; set; }
        public int Company_Id { get; set; }
        public string Doctor_Region_Name { get; set; }
        public string Category_Name { get; set; }
        public string User_code { get; set; }
        public string Marketing_Campaign_ID { get; set; }
        public string CampaignType { get; set; }
        public string Campaign_Name { get; set; }
        public int Is_Sample_not_Mandatory { get; set; }
        public int Detail_NotGiven_Check { get; set; }
        public int No_ChemistVisit_Check { get; set; }
        public int Chemist_Visit_WithoutRCPA_Check { get; set; }
        public int Doctor_Visit_Without_POB { get; set; }
        #endregion Properties
    }

    public class DoctorVisitHourlyModel
    {
        public string CompanyCode { get; set; }
        public string User_Code { get; set; }
        public string DCR_From_Date { get; set; }
        public string DCR_To_Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Specilaity_Name { get; set; }
        public string Doctor_Visit_Date_Time { get; set; }
        public string Synced_DateTime { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Company_Code { get; set; }
        //public string User_Code { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string Mobile { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Manager_Name { get; set; }
        public string Reporting_Designation { get; set; }
        public string Doctor_Category { get; set; }
        public string Doctor_Address { get; set; }
        //public string Region_Name { get; set; }
    }

    public class DoctorVisitProfile
    {

        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string Mobile { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Manager_Name { get; set; }
        //public string Latitude { get; set; }
        //public string Longitude { get; set; }
    }

    public class DCRDoctorAccompanistModel
    {
        public long DCR_Doctor_Acc_Code { get; set; }
        public string Doctor_Visit_Code { get; set; }
        public string Acc_User_Name { get; set; }
        public string Acc_User_Code { get; set; }
        public string Acc_Region_Code { get; set; }
        public string Is_Only_For_Doctor { get; set; }
        public string Mode_Of_Entry { get; set; }
        public string Acc_User_Type_Name { get; set; }
        public string Is_Accompanied_call { get; set; }
    }

    public class DCRChemistVisitModel
    {
        #region Properties
        public string Company_Code { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string DCR_Chemists_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Local_Area { get; set; }
        public string Sur_Name { get; set; }
        public string Chemists_Region_Code { get; set; }
        public string Chemist_Name { get; set; }
        public string Chemist_Code { get; set; }
        public string POB_Amount { get; set; }
        public string Is_Acc_Chemist { get; set; }
        public string Local_Ref_Code { get; set; }
        public string Mode_Of_Entry { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        #endregion Properties
    }
    public class DCRFollowUp
    {
        public string Tasks { get; set; }
        public DateTime Due_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
    }
    public class Attendance_Doctor_Details
    {
        public int DCR_Attendance_Doctor_Id { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string DCR_Code { get; set; }
        public DateTime DCR_Actual_Date { get; set; }
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
        public int Company_Id { get; set; }
        public string Company_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string Doctor_Region_Name { get; set; }
        public int id { get; set; }
        public string User_code { get; set; }
        public string Product_Code { get; set; }
        public int Quantity_Provided { get; set; }
        public string Remark { get; set; }
        public string ProductName { get; set; }
        public int Status { get; set; }
    }
    public class Attendance_Samples_Details
    {
        public string DCR_Code { get; set; }
        public DateTime DCR_Actual_Date { get; set; }
        public int DCR_Attendance_Doctor_Id { get; set; }
        public string Product_Code { get; set; }
        public int Quantity_Provided { get; set; }
        public int Current_Stock { get; set; }
        public string Doctor_Name { get; set; }
        public int Company_Id { get; set; }
        public string Company_Code { get; set; }
        public string Remark { get; set; }
        public string User_code { get; set; }
        public string Speciality_Name { get; set; }
    }
    public class DCRAttendanceBatchdetails
    {
        public int Quantity_Provided { get; set; }
        public string Batch_Number { get; set; }
        public string Doctor_Name { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string Product_Code { get; set; }

    }
    public class DCRDoctorVisitAttachment
    {
        public string Blob_Url { get; set; }
        public string Filename { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string Status { get; set; }
    }
    public class BusinessStatus
    {
        public int Business_Status_ID { get; set; }
        public string Status_Name { get; set; }
        public int Entity_Type { get; set; }
        public int Status { get; set; }
    }
    public class DCRActivity
    {
        public int Customer_Activity_ID { get; set; }
        public string Activity_Name { get; set; }
        public string Activity_Type { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public int MC_Activity_Id { get; set; }
        public string Created_By { get; set; }
        public string Activity_Remarks { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public int Status { get; set; }
        public int Customer_Entity_Type { get; set; }
        public string Customer_Entity_Type_Desc { get; set; }
        public string MC_Remarks { get; set; }
        public string Campaign_Type { get; set; }
        public int Current_Sales { get; set; }
        public int Expected_Sales { get; set; }
        public int NoofMonths { get; set; }
        public string CampaignMonth { get; set; }
        public string TrackMonth { get; set; }

    }
    public class DCRCallObjective
    {
        public int Call_Objective_ID { get; set; }
        public string Call_Objective_Name { get; set; }
        public int Entity_Type { get; set; }
        public int Status { get; set; }
    }
    public class BusinessActivityMaster
    {
        public List<BusinessStatus> lsBusinessStatus { get; set; }
        public List<DCRActivity> lsDCRActivity { get; set; }
        public List<DCRActivity> lsMCDetails { get; set; }
        public List<DCRActivity> lsMCActivityDetails { get; set; }
        public List<DCRCallObjective> lsCallObjective { get; set; }
    }
    public class DCRActivityDetails
    {
        public List<DCRActivity> lsCallActivity { get; set; }
        public List<DCRActivity> lsMCActivityDetails { get; set; }
        public List<CMETrackingDetails> lsttracking { get; set; }
    }
    public class SalesCompetitor
    {
        public string value { get; set; }
        public string label { get; set; }
        public string Product_Code { get; set; }
        public int Record_Status { get; set; }
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
        public string Mode_Of_Entry { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public decimal Unit_Rate { get; set; }
        public string Price_group_Code { get; set; }
        public string ProductMappingType { get; set; }
        public string Batch_Number { get; set; }
        public int Min_Count { get; set; }
        public int Max_Count { get; set; }
        public string Doctor_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public int Company_Id { get; set; }
        public string Remark { get; set; }
        public string User_code { get; set; }
        public string Speciality_Name { get; set; }

        #endregion Properties
    }

    public class DCRProductBatch
    {
        public string Product_Code { get; set; }
        public string Batch_Number { get; set; }
        public int Current_Stock { get; set; }
        //public string Batch_Number { get; set; }
    }

    public class DCRDetailedProductsModel
    {
        public long DCR_Product_Detail_Code { get; set; }
        public string Doctor_Visit_Code { get; set; }
        public string Sale_Product_Code { get; set; }
        public string Sale_Product_Name { get; set; }
        public string Mode_Of_Entry { get; set; }
        public string DCR_Code { get; set; }
        public long? Business_Status_ID { get; set; }
        public string Business_Status_Remarks { get; set; }
        public float? BusinessPotential { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
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
        public string Mode_Of_Entry { get; set; }
        #endregion Properties
    }

    public class VisitTimePrivValues
    {
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Name { get; set; }
    }
    public class DCRStockiestModel
    {
        #region Properties
        public string StockiestCode { get; set; }
        public string StockiestName { get; set; }
        public string StockiestRegionCode { get; set; }

        public string VisitSession { get; set; }
        public string POB { get; set; }
        public string collectionAmnt { get; set; }
        public string StockiestRemark { get; set; }
        public string VisitTime { get; set; }
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
        public string Mandate_Remarks { get; set; }

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
    }

    public class DCRAttendance
    {
        private string _G = "";
        public string Activity_Name { get; set; }
        public string Activity_Code { get; set; }
        public string Project_Code { get; set; }
        public string Start_Time { get; set; }
        public string End_Time { get; set; }
        public string Remarks { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Data_From { get; set; }

        public string Work_Place { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }

        public string Start_Time_Main { get; set; }
        public string End_Time_Main { get; set; }
        public string UnApprovalReason { get { return _G; } set { _G = value; } }
        public string UnApproveBy { get; set; }
        public string SFC_Version_No { get; set; }
        public string SFC_Category_Name { get; set; }
        public string SFC_Region_Code { get; set; }

    }

    public class DCRDoctorVisitMaxCodes
    {
        public string Doctor_Visit_Code { get; set; }
        public int Doctor_Vist_Max_Code { get; set; }
        public long Doc_Acc_Max_Code { get; set; }
        public int Inputs_Max_Code { get; set; }
        public long Detailed_Max_Code { get; set; }
        public int Chemist_Max_Code { get; set; }
        public int RCPA_Max_Code { get; set; }
        public int InputsCount { get; set; }
        public int ChemistCount { get; set; }
        public int RCPACount { get; set; }
        public int DetailedMaxCount { get; set; }
    }


    public class DCRDoctorVisitInserHelperModel
    {
        public string Compnay_Code { get; set; }
        public string DCR_Code { get; set; }
        public string User_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Doctor_Visit_Code { get; set; }
        public string Doctor_Json { get; set; }
        public string Doc_Acc_Json { get; set; }
        public string Inputs_Json { get; set; }
        public string Detailed_Json { get; set; }
        public string Chemist_Json { get; set; }
        public string Fllow_Json { get; set; }
        public string Attachment_Json { get; set; }
        public string Mode_Of_Form { get; set; }
        public int? Business_Status_ID { get; set; }
        public int company_Id { get; set; }
        public string StockistJSON { get; set; }
        public string SalesProductsJSON { get; set; }
        public string ActivityJSON { get; set; }
        public string CompProductJSON { get; set; }
        public string IgnoredOrderList { get; set; }
        public string RCPA_Json { get; set; }
        public int Doctor_Vist_Max_Code { get; set; }
        public long Doc_Acc_Max_Code { get; set; }
        public int Inputs_Max_Code { get; set; }
        public long Detailed_Max_Code { get; set; }
        public int Chemist_Max_Code { get; set; }
        public int RCPA_Max_Code { get; set; }
        public string Record_Status { get; set; }
        public string Location { get; set; }
        public string Lattitude { get; set; }
        public string Longtitude { get; set; }
        public string Error_Message { get; set; }
        public string Region_Code { get; set; }
        public string flag { get; set; }
        public int Is_Sample_not_Mandatory { get; set; }
        public int Detail_NotGiven_Check { get; set; }
        public int No_ChemistVisit_Check { get; set; }
        public int Chemist_Visit_WithoutRCPA_Check { get; set; }
        public DateCapturingModel _ObjDateDetails { get; set; }
        public string CMETracking { get; set; }
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

    public class DCRHeaderHistoryModel
    {
        public string DCR_Actual_Date { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string Approved_Date { get; set; }
        public string DCR_Status { get; set; }
        public string Approved_By { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Unapproval_Reason { get; set; }
    }

    public class DoctorCaptionName
    {
        public string Privilege_Value_Name { get; set; }
        public string Privilege_Type { get; set; }
    }
    //Newly added the Accompanist CP Details
    public class AccompanistCpModel
    {
        public string CP_Code { get; set; }
        public string CP_Name { get; set; }
        public string CP_No { get; set; }
        public string Region_Code { get; set; }
        public string Valid_from { get; set; }
        public string Valid_to { get; set; }
        public string Category_Code { get; set; }
        public string SFC_Category_Name { get; set; }
        public string Expense_Entity_Name { get; set; }
        public string Work_Area { get; set; }
        public string Place_From { get; set; }
        public string Place_To { get; set; }
        public string Route_Way { get; set; }
        public string Distance { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Fare_Amount { get; set; }
        public string Travel_Mode { get; set; }
        public string SFC_Visit_Count { get; set; }
        public string SFC_Version_No { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Work_Place { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string SFC_Region_Code { get; set; }
        public string Region_Name { get; set; }
    }

    public class AccomanistCPHOPModel
    {
        public string CP_Code { get; set; }
        public string CP_Name { get; set; }
        public string CP_No { get; set; }
        public string Work_Place { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Fare_Amount { get; set; }
        public string Travel_Mode { get; set; }
        public string Valid_From { get; set; }
        public string Valid_to { get; set; }
        public string Category_Code { get; set; }
        public string Expense_Entity_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string SFC_Category_Name { get; set; }
        public string SFC_Version_No { get; set; }
        public string SFC_Visit_Count { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string SFC_Region_Code { get; set; }
    }

    public class AccomCPModel
    {
        public List<AccompanistCpModel> lstAccomCP { get; set; }
        public List<AccomanistCPHOPModel> lstAccomCPHOP { get; set; }
    }

    public class SqlResultModel
    {
        public int Result_Code { get; set; }
        public string Result_Text { get; set; }
        public string Result { get; set; }
    }
    public class DCRProductCompetitorAddition
    {
        public string Company_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string Sale_Product_code { get; set; }
        public int Company_Id { get; set; }
        public string DCR_Code { get; set; }
        public string Doctor_Code { get; set; }
        public int? Competitor_Code { get; set; }
        public string Competitor_Name { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public int? Value { get; set; }
        public decimal Probability { get; set; }
        public string Remarks { get; set; }
        public string Speciality_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Name { get; set; }
        public string Category_Code { get; set; }
        public string Brand_Name { get; set; }
        public string Brand_Code { get; set; }
        public string UOM_Name { get; set; }
        public string UOM_Code { get; set; }
        public string UOM_Type_Name { get; set; }
        public string UOM_Type_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string User_Code { get; set; }
        public int flag { get; set; }
    }

    #region KYD

    public class KYDModel
    {
        public string Company_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string Registration_No { get; set; }
        public string Pin_Code { get; set; }
        public string Local_Area { get; set; }
        public string Mobile { get; set; }
        public string Hospital_Name { get; set; }
        public string Medical_Council { get; set; }
        public string Email_Id { get; set; }
    }

    //Get Config Values
    public class KYD_Config_Enabled
    {
        public int Config_Value { get; set; }
    }
    public class KYD_Config_Values
    {
        public string Config_KYDvaluesforDesignation { get; set; }
        public string Config_DuplicatecheckColumn { get; set; }
        public string Config_MandatoryColumns { get; set; }
        public string Config_DisplayColumns { get; set; }
    }

    #endregion KYD

    #region Queue
    public class DCRQueue
    {
        public int Id { get; set; }
        public string CompanyCode { get; set; }
        public string DCRCode { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string DCRDate { get; set; }
        public string ActivityFlag { get; set; }
        public int DCRStatus { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime ApprovedDate { get; set; }
        public string Reason { get; set; }
        public string Event { get; set; }
    }

    public class DCRApprovedQueue
    {
        public string CompanyCode { get; set; }
        public string DCRCode { get; set; }
        public string UserCode { get; set; }
        public string DCRDate { get; set; }
        public string ActivityFlag { get; set; }
        public string DCRStatus { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedDate { get; set; }
        public string Reason { get; set; }
    }
    public class DCRQueueTracker
    {
        public string CompanyCode { get; set; }
        public int Id { get; set; }
        public string UserCode { get; set; }
        public string DCRCode { get; set; }
        public string Flag { get; set; }
        public string EventName { get; set; }
        public int ProcessStatus { get; set; }
        public string JSONObject { get; set; }
        public string TopicName { get; set; }
        public string SubscriptionName { get; set; }
        public string Mesg { get; set; }

        public string StackTrace { get; set; }
    }
    #endregion Queue

    #region  ChemistVisit
    public class DCRChemistVisit
    {
        public int CV_Visit_Id { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Chemists_Code { get; set; }
        public string Chemists_Name { get; set; }
        public string Chemist_Code { get; set; }
        public string Chemists_Region_Code { get; set; }
        public string Chemists_MDL_Number { get; set; }
        public string Visit_Time { get; set; }
        public string Visit_Mode { get; set; }
        public string Remarks_By_User { get; set; }
        public int Business_Category_Id { get; set; }
        public string Business_Category_Name { get; set; }
        public string POB_Amount { get; set; }
        public string Is_Acc_Chemist { get; set; }
        public string Local_Ref_Code { get; set; }
        public string Mode_Of_Entry { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string CV_Visit_latitude { get; set; }
        public string CV_Visit_Longitude { get; set; }
        public string User_code { get; set; }
        public string Region_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string Company_Code { get; set; }
        public int Company_Id { get; set; }
        public DateCapturingModel _objDateDetails { get; set; }
        public List<DCRContact> lstContact { get; set; }
        public List<DCR_CV_Accompanist> lsAccompanist { get; set; }
        public List<DCR_CV_RCPA_Own_Products> lsRCPA_Own_Products { get; set; }
        public List<DCR_CV_RCPA_Own_Products> lsRCPA_Doctor { get; set; }
        public List<DCR_CV_RCPA_Competitor_Products> lsRCPA_Competitor_Products { get; set; }
        public List<DCR_CV_Sample_Promotion> lsSample_Promotion { get; set; }
        public List<DCR_CV_Sample_Promotion> lsSample_Promotion_Batch { get; set; }
        public List<DCR_CV_Detailed_Product> lsDetailed_Product { get; set; }
        public List<OrderHeader> lsPOBOrderHeader { get; set; }
        public List<OrderDetails> lsPOBOrderDetails { get; set; }
        public List<DCR_CV_FollowUp> lsFollowUp { get; set; }
        public List<DCR_CV_Attachment> lsAttachment { get; set; }
        public int POBMandatory { get; set; }
    }
    public class DCRContact
    {
        public int CV_Visit_Id { get; set; }

        public int Contact_Id { get; set; }

        public string Contact_Name { get; set; }

        public string Mobile { get; set; }

        public string Email_Id { get; set; }

        public string Email { get; set; }

    }
    public class DCR_CV_Accompanist
    {
        public int CV_Accompanist_ID { get; set; }
        public string CV_Visit_Id { get; set; }
        public string Acc_User_Name { get; set; }
        public string Acc_User_Code { get; set; }
        public string Acc_Region_Code { get; set; }
        public string Is_Only_For_Chemisit { get; set; }
        public string Acc_User_Type_Name { get; set; }
        public string Is_Accompanied_call { get; set; }
    }
    public class DCR_CV_RCPA_Own_Products
    {
        public int RCPA_OWN_Product_Id { get; set; }
        public int CV_Visit_Id { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Speciality_Name { get; set; }
        public string Customer_Category_Name { get; set; }
        public string Region_Code { get; set; }
        public string Customer_MDLNumber { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public int Qty { get; set; }
        public int clientId { get; set; }
        public string Remarks { get; set; }
        public int Rxnumber { get; set; }
        public string POB { get; set; }
    }
    public class DCR_CV_RCPA_Competitor_Products
    {
        public int RCPA_Competitor_Product_Id { get; set; }
        public int RCPA_OWN_Product_Id { get; set; }
        public string Competitor_Product_Name { get; set; }
        public string Competitor_Product_Code { get; set; }
        public int Qty { get; set; }
        public int clientId { get; set; }
    }
    public class DCR_CV_Sample_Promotion
    {
        public int Sample_Promotion_ID { get; set; }
        public int CV_Visit_Id { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public int Quantity_Provided { get; set; }
        public string CV_Customer_Code { get; set; }
        public string CV_Customer_Name { get; set; }
        public string Remarks { get; set; }
        public string Ref_Key1 { get; set; }
        public string Batch_Number { get; set; }
    }
    public class DCR_CV_Detailed_Product
    {
        public int Product_Detail_Id { get; set; }
        public int CV_Visit_Id { get; set; }
        public string Sales_Product_Code { get; set; }
        public string Sales_Product_Name { get; set; }
    }
    public class DCR_CV_FollowUp
    {
        public int CV_Visit_Id { get; set; }
        public string Tasks { get; set; }
        public DateTime Due_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
    }
    public class DCR_CV_Attachment
    {
        public int CV_Visit_Id { get; set; }
        public string Blob_Url { get; set; }
        public string Uploaded_File_Name { get; set; }
        public string Status { get; set; }
    }
    public class DCRChemistVisitResut
    {
        public int CV_Visit_Id { get; set; }
        public string CusErrorMsg { get; set; }
        public string SysErrorMsg { get; set; }
    }
    public class ModuleAccess
    {
        public string Region_Code { get; set; }
        public string Module_Code { get; set; }
        public string Active_Status { get; set; }
    }
    public class ProductName
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
    }
    public class CompetitorProductaddition
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Competitor_Name { get; set; }
        public string Competitor_Code { get; set; }

    }
    #endregion
    public class Loggedinfullindex
    {
        public string Full_index { get; set; }
    }
    public class DcrMc
    {
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
    }


    public class DateCapturingModel
    {
        public string Date { get; set; }
        public string Date_Format { get; set; }
        public string Off_Set { get; set; }
        public string TimeZone { get; set; }
        public string UTC_Date { get; set; }
    }
    public class CMEDetails
    {
        public int CME_Id { get; set; }
        public int No_Of_Month { get; set; }
        public string Product_code { get; set; }
        public string Product_Name { get; set; }
    }
    public class CMETracking
    {
        public string Customer_Code { get; set; }
        public string Product_Code { get; set; }
        public string Campaign_Code { get; set; }
        public int Current_Sales { get; set; }
        public int Expected_Sales { get; set; }
        public int No_Of_Month { get; set; }
    }
    public class CMETrackingDetails
    {
        public string Customer_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public int Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public int No_Of_Months { get; set; }
        public int Current_Sales { get; set; }
        public int Expected_Sales { get; set; }
    }
    public class SurveyDetails
    {
        public int Survey { get; set; }
        public string Survey_ValidTo { get; set; }
    }
    public class SfcValidationModel
    {
        public string User_Code { get; set; }
        public string DCR_Date { get; set; }
        public string Work_Category { get; set; }
        public string Flag { get; set; }
        public List<SfcValidationDataModel> lstSfc_Data { get; set; }
    }
    public class SfcValidationDataModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
    }
    public class Categorysetting
    {
        public int Ischecked { get; set; }
    }
    public class StockiestName
    {
        public string Stockist_Name { get; set; }
    }
}