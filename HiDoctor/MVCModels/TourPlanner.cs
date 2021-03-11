using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class TourPlannerModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string CP_Code { get; set; }
        public string CP_name { get; set; }
        public string TP_Code { get; set; }
        public string TP_Name { get; set; }
        public string TP_Date { get; set; }
        public string Accomp_Name { get; set; }
        public string Accompanist2_Name { get; set; }
        public string Accompanist3_Name { get; set; }
        public string Accompanist4_Name { get; set; }
        public string Meeting_Point { get; set; }
        public string Meeting_Time { get; set; }
        public string User_Name { get; set; }
        public string Work_Area { get; set; }
        public string Category { get; set; }
        public string Unapprove_Reason { get; set; }
        public string Approved_Date { get; set; }
        public string Entered_Date { get; set; }
        public string TP_Status { get; set; }
        public string Activity_Code { get; set; }
        public string Travelled_Place { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Activity_Name { get; set; }
        public string Project_Code { get; set; }
        public string Tp_Approved_By { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int TP_Id { get; set; }
        public string Project_Name { get; set; }
        public string Remarks { get; set; }
        public string Region_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Employee_Name { get; set; }

    }

    public class TPLockStatusModel
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string Status { get; set; }
        public int Days_Count { get; set; }
        public string User_Name { get; set; }
        public string Company_Code { get; set; }
        public string User_Code { get; set; }

    }

    public class TourPlannerWrapperModel
    {
        public List<TourPlannerHeaderModel> lstHeader { get; set; }
        public List<TourPlannerDoctorsModel> lstTPDoctors { get; set; }
        public List<TourPlannerSFCModel> lstTPSFC { get; set; }
    }

    public class TourPlannerHeaderModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string TP_Name { get; set; }
        public string TP_Date { get; set; }
        public string Work_Area { get; set; }
    }

    public class TourPlannerDoctorsModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Customer_Name { get; set; }
        public string MDL_Number { get; set; }
        public string TP_Date { get; set; }
        public string Region_Name { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
    }
    public class TourPlannerSFCModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string TP_Date { get; set; }
        public string CP_name { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Region_Name { get; set; }
        public string Travel_Mode { get; set; }
        public string Distance { get; set; }
    }

    public class TourPlannerAccompModel
    {
        public List<TPAccompanistDetails> lstAccompDetails { get; set; }
        public List<TPPrivilegeForAccompanistDetails> lstPrivilege { get; set; }
    }

    public class TPAccompanistDetails
    {
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Designation { get; set; }
        public string RegionName { get; set; }
        public string Category { get; set; }
        public string WorkPlace { get; set; }
        public string CPName { get; set; }
        public string TPPlannedDoctors { get; set; }
        public string Doctor_Name { get; set; }
        public string Category_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string CP_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Code { get; set; }
        public string TPAccompanistName { get; set; }
    }

    public class TPPrivilegeForAccompanistDetails
    {
        public string UserCode { get; set; }
        public string Privilege_Name { get; set; }
        public string Privilege_Value_Name { get; set; }
    }
    public class TourPlannerDoctorSample
    {
        public string DoctorRegionName { get; set; }
        public string DoctorName { get; set; }
        public string Product_Name { get; set; }
        public string Quantity { get; set; }
        public string Brand_Name { get; set; }
    }
    public class TPAccomp
    {
        public string AccUserCode { get; set; }
        public string AccRegionCode { get; set; }
    }
    public class TPReport
    {
        public List<TourPlannerModel> TpHeader { get; set; }
        public List<TourPlannerSFCModel> TpSfc { get; set; }
        public List<TourPlannerDoctorsModel> TpDoctor { get; set; }
        public List<TourPlannerDoctorSample> TpSampleProduct { get; set; }
        public List<TourPlannerModel> lsAccName { get; set; }
        public List<TourPlannerBatch> lstBatch { get; set; }

    }
    public class TpTotalDoctorDetails
    {
        public int TotalDoctor { get; set; }
        public int PlannedDoctor { get; set; }
    }
    public class TPTotalCount
    {
        public int TP_Total_Count { get; set; }
        public int TP_Applied_Count { get; set; }
        public int TP_Approved_Count { get; set; }
        public int TP_Unapproved_Count { get; set; }

    }
    public class TPBatch
    {
        public List<BatchInformation> current { get; set; }
        public List<BatchInformation> previous { get; set; }
        public List<BatchInformation> future { get; set; }
    }
    public class BatchInformation
    {
        public string Region_Name { get; set; }
        public string Hospital_Name { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Doctor_RegionName { get; set; }
        public string Customer_RegionCode { get; set; }
        public string Batch_Name { get; set; }
        public string Schedule_Name { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public int Schedule_Id { get; set; }
        public int Batch_Id { get; set; }
        public int Num_of_Weeks { get; set; }
    }
    public class BatchProduct
    {
        public string product_Code { get; set; }
        public string Product_Name { get; set; }
    }
    public class BatchProductDetails
    {
        public string product_Code { get; set; }
        public string Product_Name { get; set; }
    }

    public class CampaignDoctor
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Name { get; set; }
        public string MDL_Number { get; set; }

    }

    public class BatchDetails
    {
        public List<BatchInfo> current { get; set; }
        public List<BatchInfo> previous { get; set; }
        public List<BatchInfo> future { get; set; }
    }
    public class BatchInfo
    {
        public int Batch_ID { get; set; }
        public string Batch_Name { get; set; }
        public int Schedule_Id { get; set; }
        public string Schedule_Name { get; set; }
        public int Num_of_Weeks { get; set; }
    }
    public class TourPlannerBatch
    {
        public string Region_Name { get; set; }
        public string Customer_Name { get; set; }
        public string Batch_Name { get; set; }
        public string Schedule_Name { get; set; }
        public string Schedule_StartDate { get; set; }
        public string Schedule_EndDate { get; set; }
        public string Batch_FromDate { get; set; }
        public string Batch_ToDate { get; set; }
        public string No_Of_Chick { get; set; }
        public string MDL_Number { get; set; }
    }
}

