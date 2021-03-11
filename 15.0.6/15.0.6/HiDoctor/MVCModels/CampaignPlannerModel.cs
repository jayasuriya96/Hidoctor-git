using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class CampaignPlannerModel
    {
        public List<CampaignPlannerHeader> lstCPHeader { get; set; }
        public List<CampaignPlannerDetails> lstCPDetails { get; set; }
        public List<CampaignPlannerSFC> lstCPSFC { get; set; }
    }

    public class CampaignPlannerHeader
    {
        public string Company_Code { get; set; }
        public string CP_Name { get; set; }
        public string CP_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Work_Area { get; set; }
        public string Place_From { get; set; }
        public string Place_To { get; set; }
        public double Distance { get; set; }
        public double Fare_Amount { get; set; }
        public string Category_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Travel_Mode { get; set; }
        public string Route_Way { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Status { get; set; }
        public string Category_Name { get; set; }
        public string User_Name { get; set; }
        public string Unapprove_Reason { get; set; }
        public string SFC_Version_No { get; set; }  
        public string SFC_Visit_Count { get; set; }
    }
    public class CampaignPlannerDetails
    {
        public string Company_Code { get; set; }
        public string CP_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Estimated_Time { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Code { get; set; }
        public string Qualification { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
    }

    public class CampaignPlannerSFC
    {
        public string Company_Code { get; set; }
        public string CP_HOP_Code { get; set; }
        public string CP_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Work_Place { get; set; }
        public string From_Place { get; set; }  
        public string To_Place { get; set; }
        public double Distance { get; set; }
        public double Amount { get; set; }
        public string Travel_Mode { get; set; }
        public string Route_Way { get; set; }
        public string SFC_Category_Name { get; set; }
        public string SFC_Version_No { get; set; }
        public string SFC_Visit_Count { get; set; }
    }

    public class SFC
    {
        public string Distance_Fare_Code { get; set; }
        public string Region_Code { get; set; }
        public string From_Region_Name { get; set; }
        public string To_Region_Name { get; set; }
        public double Distance { get; set; }
        public double Fare_Amount { get; set; }
        public string Travel_Mode { get; set; }
        public string Category_Name { get; set; }
        public string SFC_Version_No { get; set; }
        public string SFC_Visit_Count { get; set; }
    }

    public class ExpenseEntity
    {
        public string Expense_Entity_Code { get; set; }
        public string Expense_Entity_Name { get; set; }
        public string Expense_Entity_Classification { get; set; }
    }

    #region CpHistory
    public class CampaignPlannerHistoryModel
    {
        public List<CampaignPlannerHeader_History> lstCpHeaderHistory { get; set; }
        public List<CampaignPlannerSFC_History> lstCpSFCHistory { get; set; }
        public List<CampaignPlannerDetails_History> lstCpDetailsHistory { get; set; }
    }

    public class CampaignPlannerHeader_History
    {
        public string Company_Code { get; set; }
        public string CP_Name { get; set; }
        public string CP_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Work_Area { get; set; }
        public string Place_From { get; set; }
        public string Place_To { get; set; }
        public double Distance { get; set; }
        public double Fare_Amount { get; set; }
        public string Category_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Travel_Mode { get; set; }
        public string Route_Way { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Status { get; set; }
        public string Category_Name { get; set; }
        public string User_Name { get; set; }
        public string Unapprove_Reason { get; set; }
        public string Cp_Approved_Date { get; set; }
        public string Cp_Approved_By { get; set; }
        public string Header_Tran_Code { get; set; }
    }

    public class CampaignPlannerDetails_History
    {
        public string Company_Code { get; set; }
        public string CP_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Estimated_Time { get; set; }
        public string Speciality_Code { get; set; }
        public string Category_Code { get; set; }
        public string Qualification { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Header_Tran_Code { get; set; }
    }
    public class CampaignPlannerSFC_History
    {
        public string Company_Code { get; set; }
        public string CP_HOP_Code { get; set; }
        public string CP_Code { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Work_Place { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public double Distance { get; set; }
        public double Amount { get; set; }
        public string Travel_Mode { get; set; }
        public string Route_Way { get; set; }
        public string Header_Tran_Code { get; set; }
    }
    #endregion CpHistory
}
