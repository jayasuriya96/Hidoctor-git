using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Reports
{
    public class DCRConsolidatedReportModel
    {

    }

    // header
    public class DCRConsHeaderModel
    {
        public List<MVCModels.HiDoctor_Reports.DCRHeaderModel> lstHeader { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRSFCModel> lstSFC { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRAttendanceModel> lstAttendance { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRLeaveModel> lstLeave { get; set; }
    }

    public class DCRHeaderModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Entered_Date { get; set; }
        public string DCR_Type { get; set; }
        public string DCR_Status { get; set; }
        public string CP_Name { get; set; }
        public string Approved_By { get; set; }
        public string Approved_Date { get; set; }
        public string Unapproval_Reason { get; set; }
        public string DCR_Code { get; set; }
        public string User_Start_Time { get; set; }
        public string User_End_Time { get; set; }

        public string Place_Worked { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Travel_Mode { get; set; }
        public int Travelled_Kms { get; set; }
        public string Category { get; set; }

        public string Acc1_Name { get; set; }
        public string Accomp_Start_Time { get; set; }
        public string Accomp_End_Time { get; set; }
        public string Acc2_Name { get; set; }
        public string Acc2_Start_Time { get; set; }
        public string Acc2_End_Time { get; set; }
        public string Acc3_Person { get; set; }
        public string Acc3_Time { get; set; }
        public string Acc4_Person { get; set; }
        public string Acc4_Time { get; set; }

        public string sql_dcr_date { get; set; }
        public string Ref_Key1 { get; set; }
        public string Flag { get; set; }
        public string DCR_General_Remarks { get; set; }
    }

    public class DCRSFCModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public int Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_HOP_Flag { get; set; }
    }

    public class DCRAttendanceModel
    {
        public string DCR_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Activity_Name { get; set; }
    }

    public class DCRLeaveModel
    {
        public string DCR_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Leave_Reason { get; set; }

    }

    // doctors
    public class DCRConsDoctorVisitModel
    {
        public List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDoctorVisitDetails { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistinctDoctors { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstMissedDoctors { get; set; }
    }

    public class DCRDoctorVisitDetailsModel
    {
        public string Doctor_Name { get; set; }
        public string MDL { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Qualification { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_Visit_Code { get; set; }
        public int Visit_Count { get; set; }
        public int Acc_Visit_Count { get; set; }
    }

    //CHEMIST
    public class DCRConsChemistVisitModel
    {
        public List<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel> lstChemistVisitDetails { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel> lstDistinctChemist { get; set; }
    }

    public class DCRChemistVisitDetailsModel
    {
        public string Chemist_Code { get; set; }
        public string Chemists_Name { get; set; }
        public double POB_Amount { get; set; }
        public int Visit_Count { get; set; }
        public string DCR_Chemists_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
    }

    //STOCKIST
    public class DCRConsStokistVisitModel
    {
        public string Stockiest_Code { get; set; }
        public string Stockiest_Name { get; set; }
        public double POB_Amount { get; set; }
        public int Visit_Count { get; set; }
        public double Collection_Amount { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Remarks_By_User { get; set; }
    }

    // PRODUCT DETAILS
    public class DCRConsProductDetailsModel
    {
        public List<MVCModels.HiDoctor_Reports.DCRProductDetailsModel> lstProduct { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistinctDoctor { get; set; }
    }

    public class DCRProductDetailsModel
    {
        public string Doctor_Code { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string Product_Name { get; set; }
        public int Quantity_Provided { get; set; }
        public string DCR_Actual_Date { get; set; }
    }

    //EXPENSE DETAILS
    public class DCRConsExpenseDetailsModel
    {
        public List<MVCModels.HiDoctor_Reports.DCRExpenseDetailsModel> lstExpenseDetails { get; set; }
        public List<MVCModels.HiDoctor_Reports.DCRSFCModel> lstSFC { get; set; }
    }

    public class DCRExpenseDetailsModel
    {
        public string DCR_Actual_Date { get; set; }
        public string DCR_Type { get; set; }
        public string DCR_Status { get; set; }
        public string DCR_Code { get; set; }
        public string Place_Worked { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Travel_Mode { get; set; }
        public int Travelled_Kms { get; set; }
        public string Category { get; set; }
        public string sql_dcr_date { get; set; }
        public double Expense_Amount { get; set; }
        public string Expense_Mode { get; set; }
        public string Expense_Type_Name { get; set; }
    }

    //WA
    public class DCRWADetailsModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Activity_Name { get; set; }
    }
    
}
