using System.Collections.Generic;
using System;

namespace MVCModels.HiDoctor_Reports
{
    public class ReportsModel
    {

    }

    public class UserDetailModel
    {
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Name { get; set; }
        public string DOJ { get; set; }
        public string DOB { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Manager_Name { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public string Company_Name { get; set; }
        public string Manager_Emp_Name { get; set; }
        public string Acc_No { get; set; }
        public string Inward_Date { get; set; }
    }
    #region SFC Report Model
    public class DivisionReportModel
    {
        public string Division_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
    }

    public class SFCReport
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Employee_Name { get; set; }
        public string User_Name { get; set; }
        public string From_Region_Name { get; set; }
        public string To_Region_Name { get; set; }
        public string Fare_Amount { get; set; }
        public string Status { get; set; }
        public string Travel_Mode { get; set; }
        public string Category_Name { get; set; }
        public string Distance { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string SFC_Date_Validation { get; set; }
        public string SFC_Visit_Count { get; set; }  // Newly Added at 23/05/2017
    }
    #endregion SFC Report Model

    public class DoctorChemistMetReportModel
    {
        public List<UserDetailModel> lstUserDetail { get; set; }
        public List<DivisionReportModel> lstDivisionModel { get; set; }
        public List<DCRHeaderReportModel> lstDCRHeader { get; set; }
        public List<DCRDoctorVisitReportModel> lstDCRDoctorVisit { get; set; }
        public List<DCRAccompanistDetail> lstAccompanist { get; set; }
        public List<DCRChemistVisitReportModel> lstDCRChemistVisit { get; set; }
        public List<DoctorVisitProfile> lstdocprof { get; set; }
    }

    #region DCR Reports Model
    public class DCRHeaderReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Flag { get; set; }
        public string Place_Worked { get; set; }
        public string DCR_Catgeory { get; set; }
        public string DCR_Status { get; set; }
        public string Status { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string Entered_Datetime { get; set; }
    }

    public class DCRDoctorVisitReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_MDL { get; set; }
        public string Doc_Speciality_Name { get; set; }
        public string Doc_Category_Name { get; set; }
        public string Doc_Region_Name { get; set; }
        public string Doctor_Region_Code { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string Remarks_By_User { get; set; }
        public string Speciality_Name { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string MDL_Number { get; set; }
    }

    public class DCRAccompanistDetail
    {
        public string DCR_Code { get; set; }
        public string Acc_User_Name { get; set; }
        public string DCR_Visit_Code { get; set; }
    }

    public class DCRProductDetailsReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Qty_Given { get; set; }
        public char Is_Detailed { get; set; }
        public string Product_Type_Name { get; set; }
        public string Product_Specilaity_Name { get; set; }
        public string DCR_Entered_Date { get; set; }
    }

    public class DCRDetailedProductsReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string Product_Specilaity_Name { get; set; }
        public string DCR_Entered_Date { get; set; }
    }

    public class DCRChemistVisitReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Chemist_Name { get; set; }
        public string Chemist_Code { get; set; }
        public string Chemist_POB { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string Remarks_By_User { get; set; }
    }
    public class DCRRCPADetailsReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Code { get; set; }
        public string Own_Product_Name { get; set; }
        public string Own_Product_Code { get; set; }
        public string Competitor_Product_Name { get; set; }
        public string Competitor_Product_Code { get; set; }
        public string Support_Qty { get; set; }
        public string DCR_Entered_Date { get; set; }
    }

    public class DCRLastSubmittedQuickRefReportModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string Reports_To { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Employee_Entity_Type { get; set; }
        public string Reports_Manager_Region { get; set; }
        public string Status { get; set; }
        public string Flag { get; set; }
        public string Division_Name { get; set; }
    }
    #endregion DCR Reports Model
    #region Activity Frequency Summary Model
    public class ActivityFrequenceSummaryModel
    {
        public List<MVCModels.HiDoctor_Master.UserModel> lstEmployee { get; set; }
        public List<DCRHeaderReportModel> lstDcrMaxActualdate { get; set; }
        public List<DCRHeaderReportModel> lstDcrdetails { get; set; }
        public List<TpEnteredDetails> lstTpEntereddetails { get; set; }
        public List<AllTpEnteredDetails> lstTpAllEnteredDetails { get; set; }
    }

    public class TpEnteredDetails
    {
        public string TP_Entered_Date { get; set; }
        public string MONTH { get; set; }
        public string YEAR { get; set; }
        public string Status { get; set; }
        public string Entered_Date { get; set; }
        public string User_Code { get; set; }
    }

    public class AllTpEnteredDetails
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string MonthofTp_Date { get; set; }
        public string Entered_Date { get; set; }
        public string status { get; set; }
        public string User_Code { get; set; }
    }

    public class HolidayDetailsforActivitysummary
    {
        public string Date { get; set; }
        public string Holiday_Code { get; set; }
        public string Holiday_Name { get; set; }
    }

    public class ApprovedLeavesModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Reason { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Type_Name { get; set; }
    }

    public class TpDatesModel
    {
        public string TP_Date { get; set; }
        public string Count { get; set; }
    }

    #endregion Activity Frequency Summary Model
    #region MasterReports
    public class MasterReportModel
    {
        public string Company_Code { get; set; }
        public string brand_name { get; set; }
        public string product_name { get; set; }
        public string speciality_name { get; set; }
        public string category_name { get; set; }
        public string uom_type_name { get; set; }
        public string uom_name { get; set; }
        public string Product_Type_Name { get; set; }
    }

    #endregion MasterReports

    #region Comparer Classes
    public class ChemistVisitCodeComparer : IEqualityComparer<DCRChemistVisitReportModel>
    {
        public bool Equals(DCRChemistVisitReportModel x, DCRChemistVisitReportModel y)
        {
            if (x.Chemist_Code != null && x.Chemist_Code.Length > 0)
            {
                return x.Chemist_Code == y.Chemist_Code;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DCRChemistVisitReportModel chemistModel)
        {
            if (chemistModel.Chemist_Code != null)
            {
                return chemistModel.Chemist_Code.GetHashCode();
            }
            else
            {
                return 0;
            }
        }
    }


    public class WATPComparer : IEqualityComparer<WATP>
    {
        public bool Equals(WATP x, WATP y)
        {
            if (x.TP_Date != null && x.TP_Date.Length > 0)
            {
                return x.TP_Date == y.TP_Date;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(WATP waTPModel)
        {
            if (waTPModel.TP_Date != null)
            {
                return waTPModel.TP_Date.GetHashCode();
            }
            else
            {
                return 0;
            }
        }
    }


    #endregion Comparer Classes

    public class ProductWiseDoctor
    {
        public string CompanyCode { get; set; }
        public string UserCode { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Customer_Name { get; set; }
        public string Category_Name { get; set; }
        public string Product_Name { get; set; }
        public string Product_Category { get; set; }
        public string Speciality_Name { get; set; }
        public string Quantity_Provided { get; set; }

    }

    public class Tpstatusreportmodel
    {
        public List<EmployeeDetail> lstEmployeeDetail { get; set; }
        public List<TPStatusReport> lstTpstatusDetail { get; set; }
    }



    public class TPStatusReport
    {
        public string CompanyCode { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Count { get; set; }
        public string Status { get; set; }
    }

    public class CPStatusReport
    {
        public List<UserDetailModel> lstUserDetail { get; set; }
        public List<CPMasterReport> lstCPMasterDetail { get; set; }
    }
    public class CPMasterReport
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string CP_Name { get; set; }
        public string CP_Code { get; set; }
        public string WorkArea { get; set; }
        public string Place_From { get; set; }
        public string Place_To { get; set; }
        public string Status { get; set; }
        public string Region_Type_Code { get; set; }
    }

    public class EmployeeDetail
    {
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Reports_User_Name { get; set; }
        public string Mobile { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Phone { get; set; }
        public string Date_Of_Birth { get; set; }
        public string Manager_Name { get; set; }
        public string User_Code { get; set; }
        public string Division_Name { get; set; }
        public string Date_of_joining { get; set; }


    }

    public class CpComplianceReportModel
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Status { get; set; }

    }

    public class DeviationCPReportModel
    {
        public string Doctor_Name { get; set; }
        public string CPM_No { get; set; }
        public string CP_Name { get; set; }
        public string DCR_Date { get; set; }
        public string Estimated_Time { get; set; }
        public string Visit_Mode { get; set; }
        public string Is_CP_Doc { get; set; }

        //Added Accompanist Name 
        public string Acc1_Name { get; set; }
    }

    public class TpWithCpDoctorMissed
    {
        public List<UserDetailModel> lstUser { get; set; }
        public List<TpWithCpDoctorMissedCount> lstTpCpCount { get; set; }
    }
    public class TpWithCpDoctorMissedCount
    {
        public int DoctorCount { get; set; }
        public int CpTpCount { get; set; }
        public int CpCount { get; set; }
        public int CpTpDetailedCount { get; set; }
    }


    public class SelfActivityModel
    {

        public List<EmployeeDetail> lstEmployeeDetail { get; set; }
        public List<Doctordetails> lstDoctorDetail { get; set; }
        public List<SelfActivityDoctors1vist> lstoneVist { get; set; }
        public List<SelfActivityDoctors2vist> lsttwoVist { get; set; }
        public List<SelfActivityDoctors3vist> lstthreeVist { get; set; }
        public List<SelfDoctorMorevist> lstmoreVist { get; set; }
        public List<SelfTotalVisitDrs> lstTotalVist { get; set; }
        public List<SelfCallMade> lstCallsMade { get; set; }
    }

    public class Doctordetails
    {
        public string Region_Code { get; set; }
        public string Drs_Count { get; set; }
    }
    public class SelfActivityDoctors1vist
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
    }
    public class SelfActivityDoctors2vist
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
    }
    public class SelfActivityDoctors3vist
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
    }
    public class SelfDoctorMorevist
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
    }
    public class SelfTotalVisitDrs
    {
        public string User_Code { get; set; }
        public string Doctor_Code { get; set; }
    }
    public class SelfCallMade
    {
        public string User_Code { get; set; }
        public string Total_Visit { get; set; }
    }



    //DCR QUALITY REPORT//
    public class DCRQualityModel
    {
        public string CompanyCode { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class DCRQualityChemistDetail
    {
        public string Region_Code { get; set; }
        public string DCR_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string COUNT { get; set; }
    }

    public class DCRQualityDCRDetail
    {
        public string Region_Code { get; set; }
        public string DCR_Date { get; set; }
    }

    public class DCRQualityDoctorCount
    {
        public string Region_Code { get; set; }
        public string DCR_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
    }

    public class DCRQualityProductDetail
    {
        public string Region_Code { get; set; }
        public string DCR_Date { get; set; }
        public string DCR_Visit_Code { get; set; }
        public string COUNT { get; set; }
    }



    //DCR WEEKLY REPORT//

    public class DoctorCategory
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }

    public class DCRWeeeklyChemistModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Chemist_Code { get; set; }
        public string Chemists_Name { get; set; }
    }

    public class DCRWeeklyDoctorModel
    {
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Category_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Visit_Mode { get; set; }
    }


    public class DCRWeeklyModel
    {

        public List<DCRDetail> lstDcrDetail { get; set; }
        public List<RatingParameterModel> lstratingParameter { get; set; }
        public List<DCRRating> lstDCRating { get; set; }
        public List<UserDetailModel> lstUser { get; set; }
        public List<DivisionReportModel> lstuserdivsion { get; set; }

    }

    public class DCRDetail
    {
        public string DCR_Actual_Date { get; set; }
        public string Travelled_Kms { get; set; }
        public string CP_Name { get; set; }
        public string Place_Worked { get; set; }
        public string Acc1 { get; set; }
        public string Acc2 { get; set; }
        public string Acc3 { get; set; }
        public string Acc4 { get; set; }
        public string Remarks_Rating { get; set; }
    }

    public class RatingParameterModel
    {
        public string Parameter_Code { get; set; }
        public string Parameter_Name { get; set; }
    }

    public class DCRRating
    {
        public string DCR_Actual_Date { get; set; }
        public string Parameter_Code { get; set; }
        public string Rating_Value { get; set; }
    }
    //DCR WEEKLY REPORT END//

    //MC REPORT//
    public class CampaignNameModel
    {
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
    }

    public class DoctorSpeciality
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }

    #region DailyCallstatus Report
    /// <summary>
    /// Daily callstatus Report
    /// </summary>
    public class DocotrCallCountModel
    {
        public List<DocotorCallcountHeaderModel> lstDocotorcountheaderdetails { get; set; }
        public List<DoctorVisitDetailsModel> lstDoctorvisitDetails { get; set; }
        public List<DCRActiivtyDetailsModel> lstDcractivityDetails { get; set; }
        public List<HolidayDetailsModel> lstHoliday { get; set; }
    }

    public class DocotorCallcountHeaderModel
    {
        public string Company_Code { get; set; }
        public string Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string Flag { get; set; }
        public string Person_Code { get; set; }
        public string Acc2_User_Code { get; set; }
        public string Acc3_Person { get; set; }
        public string Acc4_Person { get; set; }
        public string User_Code { get; set; }
    }

    public class DoctorVisitDetailsModel
    {
        public string Company_Code { get; set; }
        public string Date { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Region_Code { get; set; }
        public string Category { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string PO_Amount { get; set; }
        public string User_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Doctor_Count { get; set; }
    }

    public class DoctorCallstatusChildRegionModel
    {
        public string User_Code { get; set; }
        public string Division_Name { get; set; }
        public string Employee_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Reporting_Manager_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Reporting_Manager_Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Region_Type_Code { get; set; }

    }

    public class SpecialityWiseDoctorCount
    {
        public string Speciality_Name { get; set; }
        public int Doctor_Count { get; set; }
    }
    public class SpecialityWiseDoctorVisitCount
    {
        public string Speciality_Name { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Doctor_Visit_Count { get; set; }
    }

    public class SpecialityCoverageAnalysis
    {
        public List<SpecialityWiseDoctorCount> lstDocCount { get; set; }
        public List<SpecialityWiseDoctorVisitCount> lstDocVisitCount { get; set; }
    }


    public class DCRActiivtyDetailsModel
    {
        public string Company_Code { get; set; }
        public string Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Activity_Name { get; set; }
        public string Flag { get; set; }
        public string DCR_Entered_Date { get; set; }
        public string User_Code { get; set; }
        public string Person_Code { get; set; }
        public string Acc2_User_Code { get; set; }
        public string Acc3_Person { get; set; }
        public string Acc4_Person { get; set; }
    }

    public class HolidayDetailsModel
    {
        public string Date { get; set; }
        public string Holiday_Date { get; set; }
        public string Holiday { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }

    #endregion DailyCallstatus Report







    #region CpCoverageandDeviation Report

    public class CPCoverageandDeviationModel
    {
        public List<ApprovedCPCountModel> lstApprovedCpCount { get; set; }
        public List<DoctorVisitCountModel> lstDoctorvisitcount { get; set; }
        public List<DCREnteredCPDetailsModel> lstDCREnteredCpDetails { get; set; }
    }

    public class ApprovedCPCountModel
    {
        public string CP_code { get; set; }
        public string CP_name { get; set; }

        //Adding accompanist Name
        public string Acc1_Name { get; set; }
    }

    public class DoctorVisitCountModel
    {
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string CP_Name { get; set; }
        public string CP_code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Day { get; set; }
        public string Days { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }

    public class DCREnteredCPDetailsModel
    {
        public string CP_code { get; set; }
        public string CP_Name { get; set; }
        public string DCR_Date { get; set; }
        public string Day { get; set; }
        public string Days { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }

    #endregion CpCoverageandDeviation Report

    public class Campaignheader
    {
        public string Campaign_Name { get; set; }
        public string Campaign_Code { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Customer_Speciality_Code { get; set; }
        public string Customer_Count { get; set; }
        public string Transaction_Date { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Customer_Category { get; set; }
        public string Customer_Speciality { get; set; }
        public string Planned_Dates { get; set; }

    }

    public class CampaignProductModel
    {
        public string Sales_Code { get; set; }
        public string Sales_Product { get; set; }
        public string Sample_product { get; set; }
        public string Quantity { get; set; }
        public string Visit_Order { get; set; }

    }

    public class MCDoctorDetailModel
    {
        public List<MCdoctorVisitedModel> lstDrVistedDetail { get; set; }
        public List<MCPlannedDoctosModel> lstDrplannedDetail { get; set; }
    }

    public class MCdoctorVisitedModel
    {
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Category_Name { get; set; }
        public string Region_Code { get; set; }
        public string Category { get; set; }

        public string Speciality_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Quantity_Provided { get; set; }
        public string DCR_Date { get; set; }
    }

    public class MCPlannedDoctosModel
    {
        public string Customer_Code { get; set; }
        public string Campaign_Code { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string MDL_Number { get; set; }
    }

    public class EmployeeLeaveTakenModel
    {
        public string Employee_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Employee_Number { get; set; }
        public string From_Date { get; set; }
        public string Reason { get; set; }
        public string User_Code { get; set; }
        public string Type { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Status { get; set; }
        public string Approved_By { get; set; }
        public string Entered_Date { get; set; }
        public string DOJ { get; set; }
        public string Confirmation_Date { get; set; }
        public string Manager_Name { get; set; }
        public string User_Name { get; set; }
        public string Unapproval_Reason { get; set; }
        public string Reports_User_Name { get; set; }
        //Company Name added
        public string Company_Name { get; set; }
        public string Region_Name { get; set; }
    }

    public class UserLogReportModel
    {
        public string User_Name { get; set; }
        public string IP_Address { get; set; }
        public string Login_Time { get; set; }
        public string Logout_Time { get; set; }
    }

    #region Specialitywise DoctorcategoryCount Report
    public class SpecialityWiseDoctorCategoryCountModel
    {
        public List<DoctorcategoryModel> lstDoctorCateories { get; set; }
        public List<SpecialityModel> lstSpecialities { get; set; }
        public List<MVCModels.HiDoctor_Master.UserModel> lstEmployess { get; set; }
    }

    public class DoctorcategoryModel
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }

    public class SpecialityModel
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }

    public class DoctorMasterModel
    {
        public string Speciality_Code { get; set; }
        public string Category { get; set; }
        public string Region_Code { get; set; }
    }

    public class RegionTypeNamesModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Name { get; set; }
    }
    #endregion Specialitywise DoctorcategoryCount Report

    #region DoctorMaster
    public class DoctorIndiviualCount
    {
        public string Doctorcount_Individual { get; set; }
        public string Doctorcount_Group { get; set; }
        public string Region_Code { get; set; }
    }

    public class DoctorGroupCount
    {
        public string Doctorcount_Group { get; set; }
    }

    public class DoctorMasterReportModel
    {
        public List<DoctorCategory> lstDoctorCategories { get; set; }
        public List<DoctorSpeciality> lstDoctorspecialities { get; set; }
        public List<DoctorMasterDivisionModel> lstDivision { get; set; }
    }

    //public class DoctorCountModel
    //{  
    //    public List<MCPlannedDoctosModel> lstDoctorcountforSingleregion { get; set; }
    //    public List<MCPlannedDoctosModel> lstDoctorcountforMultiRegion { get; set; }
    //    public List<DoctorCategoryCountModel> lstDoctorCategorycount { get; set; }
    //    public List<DoctorSpecialityCountModel> lstDoctorspecialitiescount { get; set; }
    //}

    public class DoctorCategoryCountModel
    {
        public string Region_Code { get; set; }
        public int CategoryCount { get; set; }
        public string Category { get; set; }
        public string Full_index { get; set; }
    }

    public class DoctorSpecialityCountModel
    {
        public string Region_Code { get; set; }
        public int SpecialityCount { get; set; }
        public string Speciality_Code { get; set; }
        public string Full_index { get; set; }
    }

    public class DoctorCountModel
    {
        public List<DoctorIndiviualCount> lstIndividulaCount { get; set; }
        public List<DoctorCategoryCountModel> lstDoctorCategorycount { get; set; }
        public List<DoctorSpecialityCountModel> lstDoctorspecialitiescount { get; set; }
    }

    public class DoctorMasterTreeDetails
    {
        public List<DoctorMasterFullTreeDetailsModel> lstFullTreeModel { get; set; }
    }


    public class TreeDetails
    {
        public List<FullTreeDetailsModel> lstFullTreeModel { get; set; }
    }


    public class DoctorMasterFullTreeDetailsModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Full_index { get; set; }
        public string User_Status { get; set; }
    }

    public class FullTreeDetailsModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Full_index { get; set; }
    }
    public class DoctorMasterDivisionModel
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Entity_Code { get; set; }
    }

    #endregion DoctorMaster

    public class LastSubmittedReportModel
    {
        public List<EmployeeDetail> lstLastSubUserDetail { get; set; }
        public List<LastSubmitedheaderModel> lstLastSubheader { get; set; }
        public List<LastSubmittedDoctorModel> lstLastSubdoctor { get; set; }
        public List<LastsubmittedLeaveModel> lstLastsubleave { get; set; }
        public List<LastsubmittedLeaveCountModel> lstLastsubleaveCount { get; set; }
        public List<LastsubmittedStatus> lstLastActivities { get; set; }
    }

    public class LastSubmitedheaderModel
    {
        public string User_Code { get; set; }
        public string Last_Submitted_Date { get; set; }
        public string Missed_Doctors_Count { get; set; }
        public string Unique_Doctor_Visited_Count { get; set; }
        public string Listed_Doctor_Calls_Made { get; set; }
        public string Unlisted_Doctor_Calls_Made { get; set; }
        public string Total_Chemist_Calls_Made { get; set; }
        public string Weekend_Off_Days { get; set; }
        public string Total_Field_Days { get; set; }
        public string Total_Attendance_Days { get; set; }
        public string Total_Leave_Days { get; set; }
        public string Holiday { get; set; }
        public string Total_Chemist_POB { get; set; }
        public string Total_Stockist_POB { get; set; }
        public string Total_Stockist_Collection { get; set; }
        public string Total_Expense { get; set; }
        public string Total_Doctor_POB { get; set; }

    }

    public class LastSubmittedDoctorModel
    {
        public string Region_Code { get; set; }
        //public string Doctor_Code { get; set; }
        public string Doctor_Visits { get; set; }
        public int OneVisit { get; set; }
        public int TwoVisit { get; set; }
        public int ThreeVisit { get; set; }
        public int FourVisit { get; set; }
        public int FiveVisit { get; set; }
        public int SixVisit { get; set; }
        public int SevenVisit { get; set; }
        public int EightVisit { get; set; }
    }

    public class LastsubmittedLeaveModel
    {
        public string Leave_Type_Name { get; set; }
        public string Leave_Type_Code { get; set; }
    }

    public class LastsubmittedLeaveCountModel
    {
        public string User_Code { get; set; }
        public string Leave_Type_Code { get; set; }
        public string Leave_Count { get; set; }
    }

    public class LastsubmittedStatus
    {
        public string User_Code { get; set; }
        public string flag { get; set; }
        public string Dcr_Actual_Date { get; set; }
    }

    public class LastSubmittedChildUserCount
    {
        public string User_Code { get; set; }
        public string Child_Count { get; set; }
    }

    public class DayofWeekReport
    {
        public List<UserDetailModel> lstUserDetail { get; set; }
        public List<DivisionReportModel> lstDivisionModel { get; set; }
        public List<WeeklyReport> WeeklyReport { get; set; }
        public List<DaywiseReport> DaywiseReport { get; set; }
    }

    public class DayofWeekReportCalendarData
    {
        public string title { get; set; }
        public string day { get; set; }
        public string month { get; set; }
        public string year { get; set; }
        public string start { get; set; }
        public string status { get; set; }
        public string isTP { get; set; }
        public string url { get; set; }
        public string className { get; set; }
    }

    public class WeeklyReport
    {
        public int Week_Number { get; set; }
        public int Doctor_Met { get; set; }
        public int Field_Working_Days { get; set; }
    }
    public class DaywiseReport
    {
        public string Day_Name { get; set; }
        public int Total_Calls { get; set; }
        public int Days_Count_In_Month { get; set; }
    }

    //WORK ANALYSIS REPORT//

    public class WorkAnalyisModel
    {
        public List<WAUserDetailModel> lstWAUserDetail { get; set; }
        public List<WALastEnteredDateModel> lstWALastEnteredDate { get; set; }
        public List<WADcrCpModel> lstWADcrCp { get; set; }
        public List<WADcrLockModel> lstWADcrLock { get; set; }
        public List<WACustomerModel> lstCustomer { get; set; }
        public List<WADoctorCategoryModel> lstDrCategoryModel { get; set; }
        public List<WAActivityModel> lstActivityModel { get; set; }
        public List<WATpModel> lsttp { get; set; }

        public List<RatingParameterModel> lstratingParameter { get; set; }
        public List<WAParameterValue> lsParameterValue { get; set; }
        public List<WACustomerDetail> lsCustomerdetail { get; set; }
        public List<WACategoryCountModel> lsCategoryCount { get; set; }
        public List<WATP> lstTp { get; set; }
        public List<WAtable13> lstTpdata { get; set; }
        public List<WADcrplannedDaysModel> lstPlannedDays { get; set; }
        public List<WADcrVistedDaysModel> lstVisitedDays { get; set; }
    }

    public class WAUserDetailModel
    {
        public string User_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string User_Name { get; set; }
        public string Manager_Name { get; set; }
        public string User_type_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Date_of_joining { get; set; }

    }

    public class WALastEnteredDateModel
    {
        public string User_Code { get; set; }
        public string Last_Entered { get; set; }
    }

    public class WADcrCpModel
    {
        public string User_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Flag { get; set; }
        public string CP_Name { get; set; }
        public string CPM_No { get; set; }

    }
    //table 3
    public class WADcrLockModel
    {
        public string User_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
    }
    //table 4

    public class WACustomerModel
    {
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string CP_Name { get; set; }
        public string CPM_No { get; set; }
        public string User_Code { get; set; }
    }
    //table 5
    public class WADoctorCategoryModel
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
        public string Visit_Count { get; set; }
    }
    //table 6
    public class WAActivityModel
    {
        public string Activity_Code { get; set; }
        public string Project_Code { get; set; }
        public string CP_Code { get; set; }
        public string TP_Date { get; set; }
        public string User_Code { get; set; }
    }
    //table 7
    public class WATpModel
    {
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string TP_Date { get; set; }
        public string User_Code { get; set; }
    }
    //table9
    public class WAParameterValue
    {
        public string Parameter_Code { get; set; }
        public string Parameter_Value { get; set; }
        public string User_Code { get; set; }
    }
    //table 10
    public class WACustomerDetail
    {
        public string Count { get; set; }
        public string Doctor_Code { get; set; }
        public string Region_Code { get; set; }
        public string Category { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }
    //table ll
    public class WACategoryCountModel
    {
        public string Count { get; set; }
        public string Region_Code { get; set; }
        public string Category { get; set; }
    }
    //table l2
    public class WATP
    {
        public string Doctor_Code { get; set; }
        public string TP_Date { get; set; }
        public string Doctor_Name { get; set; }
        public string User_Code { get; set; }
    }
    //table 13
    public class WAtable13
    {
        public string Doctor_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }
    }
    //table 14
    public class WADcrplannedDaysModel
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string Planned_Days { get; set; }
        public string User_Code { get; set; }
    }

    //table 15
    public class WADcrVistedDaysModel
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string Visited_Days { get; set; }
        public string User_Code { get; set; }
    }

    //workanalysis opup

    public class WorkanalysispopupModel
    {
        public List<WAPopUpDcrModel> lstWApopupDcr { get; set; }
        public List<WAPopUpDcrLockModel> lstWApopupLock { get; set; }
    }

    public class WAPopUpDcrModel
    {
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }
        public string Flag { get; set; }
        public string CP_Name { get; set; }
        public string CPM_No { get; set; }
    }
    public class WAPopUpDcrLockModel
    {
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }

    }

    public class CPdeviationModel
    {
        public List<cptable1> lstTable1 { get; set; }
        public List<cptable2> lstTable2 { get; set; }
        public List<cptable3> lstTable3 { get; set; }
    }

    public class cptable1
    {
        public string Doctor_Code { get; set; }
        public string TP_Date { get; set; }
        public string Doctor_Name { get; set; }
    }
    public class cptable2
    {
        public string Doctor_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
    }
    public class cptable3
    {
        public string Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
    }


    public class GetMissedAgainstPlanModel
    {
        public List<GetMissedAgainstPlanTable0> lsttable0 { get; set; }
        public List<GetMissedAgainstPlanTable1> lsttable1 { get; set; }
        public List<GetMissedAgainstPlanTable2> lsttable2 { get; set; }
        public List<GetMissedAgainstPlanTable3> lsttable3 { get; set; }
        public List<GetMissedAgainstPlanTable4> lsttable4 { get; set; }
    }


    public class GetMissedAgainstPlanTable0
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string Planned_Days { get; set; }
        public string Doctor_Name { get; set; }
    }

    public class GetMissedAgainstPlanTable1
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string Visited_Days { get; set; }
        public string User_Code { get; set; }
    }

    public class GetMissedAgainstPlanTable2
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string TP_Date { get; set; }
        public string Doctor_Name { get; set; }
    }


    public class GetMissedAgainstPlanTable3
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public string Doctor_Code { get; set; }
        public string Category { get; set; }
        public string DCR_Actual_Date { get; set; }
    }

    public class GetMissedAgainstPlanTable4
    {
        public string Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
    }


    public class GetDoctorCallModel
    {
        public List<DoctorCallPopuptable0> lsttable0 { get; set; }
        public List<DoctorCallPopuptable1> lsttable1 { get; set; }
        public List<DoctorCallPopuptable2> lsttable2 { get; set; }

    }
    public class DoctorCallPopuptable0
    {
        public string Customer_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Customer_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
    }

    public class DoctorCallPopuptable1
    {
        public string Doctor_Name { get; set; }
        public string Customer_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string Day { get; set; }
    }


    public class DoctorCallPopuptable2
    {
        public string Category_Code { get; set; }
        public string Visit_Count { get; set; }
    }


    public class TPDeviationNewPopUpModel
    {
        public List<TPdivCpmodel> lsttable0 { get; set; }
        public List<TPdivActivityModel> lsttable1 { get; set; }
    }


    public class TPdivCpmodel
    {
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }
        public string Flag { get; set; }
        public string CP_Name { get; set; }
        public string CPM_No { get; set; }
    }


    public class TPdivActivityModel
    {
        public string Activity_Code { get; set; }
        public string Project_Code { get; set; }
        public string CP_Code { get; set; }
        public string TP_Date { get; set; }
        public string User_Code { get; set; }
    }


    public class RepeatsCallModelPopupModel
    {
        public List<table1> lsttable0 { get; set; }
        public List<table2> lsttable1 { get; set; }
        public List<table3> lsttable2 { get; set; }
    }

    public class table1
    {
        public string Doctor_Name { get; set; }
        public string Customer_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string Day { get; set; }
    }

    public class table2
    {
        public string Count { get; set; }
        public string Doctor_Code { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }

    }

    public class table3
    {
        public string Category_Code { get; set; }
        public string Visit_Count { get; set; }


    }

    public class DoctorProductMappingModel
    {
        public string Category_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Campaign_Name { get; set; }
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Region_Code { get; set; }
        public string Yield { get; set; }
        public string Potential { get; set; }
        public string Priority { get; set; }
    }
    public class CampaignDetailsModel
    {
        public List<CampaignDetailsforDoctorModel> lstCampaignDoctors { get; set; }
        public List<CampaignDetailsforProductModel> lstCampaignProducts { get; set; }
    }
    public class CampaignDetailsforDoctorModel
    {
        public string Campaign_Name { get; set; }
    }
    public class CampaignDetailsforProductModel
    {
        public string Campaign_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Product_Code { get; set; }
    }
    #region DoctorMasterTerritoryWise Report
    public class CategoryandSpecialityModel
    {
        public List<DoctorcategoryModel> lstCatory { get; set; }
        public List<SpecialityModel> lstSpeciality { get; set; }
    }

    public class CustomerDetailsModel
    {
        public string Region_Name { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Sur_Name { get; set; }
        public string Customer_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Hospital_Name { get; set; }
        public string Local_Area { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string SubRegion_Code { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string DOB { get; set; }
        public string Anniversary_Date { get; set; }
    }

    public class ProductDetailModel
    {
        public string Product_Name { get; set; }
        public string Product_Type_Name { get; set; }
        public string Quantity_Provided { get; set; }
        public string Remarks_By_User { get; set; }
        public string Doctor_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
    }
    #endregion DoctorMasterTerritoryWise Report
    #region DoctorMaster Datewise Report
    public class AppliedCountModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string AppliedDoctorCount { get; set; }
        public string Created_Date { get; set; }
    }
    public class ApprovedCountModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string ApproveDoctorCount { get; set; }
        public string Approved_Date { get; set; }
    }
    public class UnApproveCountModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string UnApprovedDoctorCount { get; set; }
        public string Unapproved_Date { get; set; }
    }
    public class DoctorMasterDateWiseReportModel
    {
        public List<AppliedCountModel> lstAppliedCount { get; set; }
        public List<ApprovedCountModel> lstApprovedCount { get; set; }
        public List<UnApproveCountModel> lstUnApprovedCount { get; set; }
    }

    public class CategoryandSpecialitycountforAllstatusModel
    {
        public string Speciality_Code { get; set; }
        public string Category { get; set; }
        public string Created_Date { get; set; }
        public string Approved_Date { get; set; }
        public string Unapproved_Date { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Status { get; set; }
    }

    #endregion DoctorMaster DateWise Report

    #region Sample stock report for Resigned Employee
    public class SamplestockForResignedEmployee
    {
        public List<SamplestockReportDateModel> lstSampleReportDate { get; set; }
        public List<InwardStockModel> lstInward { get; set; }
        public List<UserDetailModel> lsUserDetail { get; set; }
        public List<DivisionReportModel> lsDivisionDetails { get; set; }
    }

    public class SamplestockReportDateModel
    {
        public string User_Code { get; set; }
        public string Product_Name { get; set; }
        public string Category_Name { get; set; }
        public string Brand_Name { get; set; }
        public string Product_Code { get; set; }
        public string Product_Type_Name { get; set; }
        public string Opening { get; set; }
        public string Inward_Taken { get; set; }
        public string Issued { get; set; }
        public string Closing { get; set; }
        public string ClosingAmount { get; set; }
    }
    public class InwardStockModel
    {
        public string User_Code { get; set; }
        public string Inward_Date { get; set; }
    }


    #endregion Sample stock report for Resigned Employee

    #region Expense Analysis for Alumni
    public class ExpenseAnalysisforAlumniModel
    {
        public List<MVCModels.HiDoctor_Master.UserModel> lstUserDetails { get; set; }
        public List<DivisionModel> lstDivisions { get; set; }
        public List<ExpenseTypeModel> lstExpenseType { get; set; }
        public List<DCRHeaderforAlumniModel> lstDCRHeader { get; set; }
        public List<InterMediatePlacesModel> lstPlaces { get; set; }
        public List<ActivityModel> lstActivities { get; set; }
        public List<LeaveTypeModel> lstLeaveTypeNams { get; set; }
        public List<DaywiseExpenseAmountModel> lstDaywiseExpenseAmount { get; set; }
        public List<ExpenseandElgibilityAmountModel> lstExpenseandEligibilityAmount { get; set; }
        public List<HolidayModel> lstHolidays { get; set; }
    }
    public class DivisionModel
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
    }

    public class ExpenseTypeModel
    {
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public string Display_Order { get; set; }
    }

    public class DCRHeaderforAlumniModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Entered_Date { get; set; }
        public string DCR_Type { get; set; }
        public string DCR_Status { get; set; }
        public string CP_Name { get; set; }
        public string Approved_By { get; set; }
        public string Approved_Date { get; set; }
        public string Place_Worked { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Travel_Mode { get; set; }
        public string Travelled_Kms { get; set; }
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
        public string Unapproval_Reason { get; set; }
        public string DCR_Code { get; set; }
        public string User_Start_Time { get; set; }
        public string User_End_Time { get; set; }
        public string sql_dcr_date { get; set; }
        public string Ref_Key1 { get; set; }
        public string Flag { get; set; }
    }
    public class InterMediatePlacesModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Distance_Fare_Code { get; set; }
        public string Route_Way { get; set; }
        public string DCR_Code { get; set; }
        public string DCR_HOP_Flag { get; set; }
    }
    public class ActivityModel
    {
        public string DCR_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Activity_Name { get; set; }
    }
    public class LeaveTypeModel
    {
        public string DCR_Code { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Leave_Reason { get; set; }
    }

    public class DaywiseExpenseAmountModel
    {
        public string DCR_Code { get; set; }
        public string DCR_Flag { get; set; }
        public string Days { get; set; }
        public string Total { get; set; }
        public string Remarks { get; set; }
    }
    public class ExpenseandElgibilityAmountModel
    {
        public string DCR_Code { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Mode { get; set; }
        public string Eligibility_Amount { get; set; }
        public string Expense_Amount { get; set; }
        public string Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Approved_Amount { get; set; }
        public string Deducted_Amount { get; set; }
    }

    public class HolidayModel
    {
        public string Year { get; set; }
        public string Month { get; set; }
        public string Date { get; set; }
        public string Holiday { get; set; }
        public string Holiday_Date_Sql { get; set; }
        public string Holiday_Date { get; set; }
    }
    //Doctor Count
    public class ExpenseAnalysisforAlumni_DoctCountModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Doctor_Count { get; set; }
    }
    //Chemist Count
    public class ExpenseAnalysisforAlumni_ChemCountModel
    {
        public List<ChemistCountModel> lstCust_ChemistCount { get; set; }
        public List<POAmountModel> lstPOAmount { get; set; }
    }
    public class ChemistCountModel
    {
        public string DCR_Actual_Date { get; set; }
        public string Chemist_Count { get; set; }
    }
    public class POAmountModel
    {
        public string DCR_Actual_Date { get; set; }
        public string PO_Amount { get; set; }
    }
    //ManagerCount
    public class ExpenseAnalysisforAlumni_ManagerCountModel
    {
        public string Row_Id { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Date { get; set; }
        public string Acc_Count { get; set; }
    }
    #endregion Expense Analysis for Alumni

    #region AuditTrailforCustomer
    public class AuditTrailforCustomerModel
    {
        public string Customer_Name { get; set; }
        public string Region_Name { get; set; }
        public string Category_Name { get; set; }
        public string Gender { get; set; }
        public string Speciality_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Local_Area { get; set; }
        public string City { get; set; }
        public string Pin_Code { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Customer_Status { get; set; }
        public string DOB { get; set; }
        public string Anniversary_Date { get; set; }
        public string Qualification { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Applied_By { get; set; }
        public string Applied_Date { get; set; }
        public string Is_Inherited { get; set; }
        public string Approved_By { get; set; }
        public string Approved_Date { get; set; }
        public string Unapproved_By { get; set; }
        public string Unapproved_Date { get; set; }
        public string Edit_Reason { get; set; }
        public string Hospital_Name { get; set; }
        public string Hospital_Classification { get; set; }
        public string Source_Region { get; set; }
        public string Move_Type { get; set; }
        public string Moved_By { get; set; }
        public string Moved_On { get; set; }
        public string Locked { get; set; }
        public string PRICE_GROUP_CODE { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedDatetime { get; set; }
        public string Primary_Contact { get; set; }
        public string Primary_Email { get; set; }
        public string Changed_Column_Name { get; set; }

    }

    #endregion AuditTrailforCustomer

    #region Expense Claim Deduction
    public class ExpenseClaimDeductionReportModel
    {
        public List<ExpenseClaimDeductionDetails> lstClaimDetails { get; set; }
        public List<DCRHOPPlace> lstDCRHOP { get; set; }
    }


    public class ExpenseClaimDeductionReportModelPopup
    {
        public List<ExpenseClaimDeductionDetails> lstClaimDetails { get; set; }
        public List<ExpenseClaimDeductionDetailsTravellplaces> lstDCRHOP { get; set; }
    }


    public class ExpenseClaimDeductionDetails
    {
        public string Claim_Code { get; set; }
        public string Entered_DateTime { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public double Expense_Amount { get; set; }
        public string Remarks_By_User { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Date { get; set; }
        public double Approved_Amount { get; set; }
        public string Managers_Approval_Remark { get; set; }
        public char DCR_Activity_Flag { get; set; }
        public double Deduction_Amount { get; set; }
        public string Status_Name { get; set; }
        public string Applied_By { get; set; }
        public string Category { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Work_Place { get; set; }
        public int Version_Number { get; set; }
        public int Order_No { get; set; }
        public string Updated_By { get; set; }
        public string DCR_Status { get; set; }
        public string Doctor_Visit_Count { get; set; }
        public string Submitted_BY { get; set; }
        public string Favouring_User_Code { get; set; }
        public string Expense_Mode { get; set; }
    }

    public class ExpenseClaimDeductionDetailsTravellplaces
    {
        public string Claim_Code { get; set; }
        public string Entered_DateTime { get; set; }
        public string Expense_Type_Code { get; set; }
        public string Expense_Type_Name { get; set; }
        public double Expense_Amount { get; set; }
        public string Remarks_By_User { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string DCR_Date { get; set; }
        public double Approved_Amount { get; set; }
        public string Managers_Approval_Remark { get; set; }
        public char DCR_Activity_Flag { get; set; }
        public double Deduction_Amount { get; set; }
        public string Status_Name { get; set; }
        public string Applied_By { get; set; }
        public string Category { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Work_Place { get; set; }
        public int Version_Number { get; set; }
        public int Order_No { get; set; }
        public string Updated_By { get; set; }
        public string DCR_Status { get; set; }
        public string Doctor_Visit_Count { get; set; }
        public string Submitted_BY { get; set; }
    }

    public class DCRHOPPlace
    {
        public string Category { get; set; }
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Distance { get; set; }
        public string Travel_Mode { get; set; }
        public string Work_Place { get; set; }
        public char DCR_Activity_Flag { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string tp_id { get; set; }
    }

    public class ExpenseClaimDCRDetails
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

    #endregion Expense Claim Deduction

    #region SFC Audit  report

    public class SFCAuditReportModel
    {
        public string Region_Name { get; set; }
        public string From_Region_Name { get; set; }
        public string To_Region_Name { get; set; }
        public string Travel_Mode { get; set; }
        public string Category_Name { get; set; }
        public string Distance { get; set; }
        public string Fare_Amount { get; set; }
        public string SFC_Visit_Count { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public string Action { get; set; }
    }

    public class ExpenseClaimHeaderModel
    {
        public string Other_Deduction { get; set; }
        public string Claim_Code { get; set; }
    }



    #endregion SFC Audit report



    public class KYDCustomerMasterDetails
    {
        public string Doctor_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Registration_No { get; set; }
        public string Local_Area { get; set; }
        public string Mobile { get; set; }
        public string Hospital_Name { get; set; }
        public string Medical_Council { get; set; }
        public string Pin_Code { get; set; }
        public string Sur_Name { get; set; }

    }

    public class KYDCustomertotalCount
    {

        public double customerCount { get; set; }
    }
    public class KYDRegionName
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
    }

    public class RegionKYDDetails
    {
        public List<UserDetailModel> lstUserDetail { get; set; }
        public List<DivisionModel> lstDivisions { get; set; }
        public List<KYDCustomerMasterDetails> lstKYDCustomerDetail { get; set; }
        public List<KYDCustomertotalCount> lstCustomertotalCount { get; set; }
        public List<KYDRegionName> lstregionName { get; set; }
    }

    public class CustomerMasterModel
    {
        public int Count { get; set; }
        public string Category_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Doctor_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Hospital_Name { get; set; }
        public string Visit_Count { get; set; }
        public string Sur_Name { get; set; }
        public string Local_Area { get; set; }
    }

    public class TpModel
    {
        public string TP_Date { get; set; }
        public string Category_Code { get; set; }
        public string Doctor_Code { get; set; }
    }

    public class ActualDoctorModel
    {
        public string Doctor_Code { get; set; }

    }

    public class CategoryNeverVisitedModel
    {
        public List<CustomerMasterModel> lstCustomers { get; set; }
        public List<ActualDoctorModel> lstActualDoctors { get; set; }
        public List<TpModel> lstTpDates { get; set; }
    }

    #region - RCPA Report
    public class RCPADetailsReportModel
    {
        public List<RCPADoctorProductModel> lstDoctorproducts { get; set; }
        public List<RCPAProductModel> lstRCPAProducts { get; set; }
        public List<RCPAProductPriceModel> lstProductPrices { get; set; }
    }

    public class RCPAUserdetailsModel
    {
        public List<RCPAUserModel> lstRcpaUser { get; set; }
        public List<RCPADivisionModel> lstUserDivisions { get; set; }
    }

    public class RCPAUserModel
    {
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Manager_Name { get; set; }
        public string Manager_Region_Name { get; set; }

    }

    public class RCPADivisionModel
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
    }

    public class RCPADoctorProductModel
    {
        public string Customer_Name { get; set; }
        public string Sur_Name { get; set; }
        public string Local_Area { get; set; }
        public string Customer_Code { get; set; }
        public string Date { get; set; }
        public string Region_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Doctor_Visit_Time { get; set; }
        public string Visit_Mode { get; set; }
        public string Speciality_Name { get; set; }
        public string Chemists_Name { get; set; }
        public string Own_Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Support_Qty { get; set; }
        public string Competitor_Product_Name { get; set; }
        public string Com_Qty { get; set; }
        public string Hospital_Name { get; set; }
        public string DCR_Product_Code { get; set; }
    }

    public class RCPAProductModel
    {
        public string Customer_Code { get; set; }
        public string Product_Code { get; set; }
        public string Region_Code { get; set; }
    }

    public class RCPAProductPriceModel
    {
        public string Product_Code { get; set; }
        public string Region_Code { get; set; }
        public string Price { get; set; }
    }

    #endregion - RCPA Report

    public class DaywisefieldwrkRcpaDetail
    {
        public List<rcpa> lstRcpa { get; set; }
        public List<DaywiseExpenseDetail> lstExpdetail { get; set; }
        public List<DcrMasterDetails> lstmasterDetails { get; set; }
        public List<ProductValue> lstRcpaProduct { get; set; }

    }


    public class rcpa
    {
        public string RcpaCount { get; set; }

    }
    public class DaywiseExpenseDetail
    {
        public string Flag { get; set; }
        public string Expense_Detail_Amount { get; set; }
    }

    public class DcrMasterDetails
    {

        public string DCR_Entered_Date { get; set; }
        public string DCR_Status { get; set; }
        public string Approved_Date { get; set; }
        public string Flag { get; set; }
    }


    public class DcrStatus
    {

        public string DCR_Status { get; set; }
        public string flag { get; set; }
    }


    public class ProductValue
    {

        public string Own_Product { get; set; }
        public string Com_Product { get; set; }
        public string Product { get; set; }
    }



    //************************************************DRBondDc Report****************************************************************//

    public class DRBondDCDetails
    {
        public string Doctor_Id { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Hospital_Name { get; set; }
        public string Hospital_Photo_Url { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Location_Full_Address { get; set; }
        public string Phone_Number { get; set; }
        public string Email_Id { get; set; }
        public string Landmark { get; set; }
        public string Assistant_Name { get; set; }
        public string Assistant_Phone_Number { get; set; }
        public string Remarks { get; set; }
        public string Working_From_Time { get; set; }
        public string Working_To_Time { get; set; }
        public string User_Code { get; set; }
        public string User_Id { get; set; }
        public string Employee_Name { get; set; }
        public string Region_Name { get; set; }
        public string Manager_Name { get; set; }
        public string Manager_Region { get; set; }
        public string Speciality_Name { get; set; }
        public string Trainer_Code { get; set; }
        public string Working_From_Time_2 { get; set; }
        public string Working_To_Time_2 { get; set; }
        public string Working_From_Time_3 { get; set; }
        public string Working_To_Time_3 { get; set; }
        public string Created_DateTime { get; set; }
        public string Updated_DateTime { get; set; }
        public string Trainer_Name { get; set; }

    }



    //*********************************************************************************************************************************//
    #region - Stockiest wise SS Report
    public class SSReportModel
    {
        public List<SSUserModel> lstSSUsers { get; set; }
        public List<SSDivisionModel> lstSSDivisions { get; set; }
        public List<SSDetailsModel> lstSSDetails { get; set; }
        public List<SSPricePercentageModel> lstPricepercentage { get; set; }
        public List<SSUserTypePrivilegeModel> lstUserTypes { get; set; }
        public List<SSInheritedStockiestModel> lstSSSInherits { get; set; }
        public List<SSStockiestModel> lstStockiest { get; set; }
        public List<SSCustomerModel> lstCustomermodel { get; set; }
    }


    public class SSUserModel
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string ReportingManager_Region_Name { get; set; }
        public string User_Name { get; set; }
        public string Reporting_Manager_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string DOJ { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class SSDivisionModel
    {
        public string Entity_Code { get; set; }
        public string Division_Name { get; set; }
    }

    public class SSDetailsModel
    {
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public double Opening_Stock { get; set; }
        public double Purchase { get; set; }
        public double Purchase_Return { get; set; }
        public double Sales { get; set; }
        public double Sales_Return { get; set; }
        public double Closing_Stock { get; set; }
        public double Transit { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public double Price_Per_Unit { get; set; }
    }

    public class SSPricePercentageModel
    {
        public string Region_Code { get; set; }
        public string Product_Code { get; set; }
        public string Stockist_Code { get; set; }
        public double Share_Percentage { get; set; }
        public DateTime Effective_From { get; set; }
        public DateTime Effective_To { get; set; }
    }

    public class SSUserTypePrivilegeModel
    {
        public string Privilege_Value_Name { get; set; }
    }

    public class SSInheritedStockiestModel
    {
        public string Is_Inherited { get; set; }
        public string Source_Region { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
    }

    public class SSStockiestModel
    {
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
    }

    public class SSCustomerModel
    {
        public string Customer_Name { get; set; }
        public string Stockiest_Code { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Code { get; set; }
    }
    #endregion - Stockiest wise SS Report


    public class StockiestSSOLdReport
    {
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Reporting_Region { get; set; }
        public string User_Name { get; set; }
        public string Reporting_Manager_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string Stockiest_Ref_Key { get; set; }
        public string Ref_Key1 { get; set; }
        public string DOJ { get; set; }
        public string User_Type_Name { get; set; }
        public string Entity_Code { get; set; }
        public string Division_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public double Opening_Stock { get; set; }
        public double Opening_Stock_Value { get; set; }
        public double Purchase { get; set; }
        public double Purchase_Value { get; set; }
        public double Purchase_Return { get; set; }
        public double Purchase_Return_Value { get; set; }
        public double Sales { get; set; }
        public double Sales_Value { get; set; }
        public double Sales_Return { get; set; }
        public double Sales_Return_Value { get; set; }
        public double Closing_Stock { get; set; }
        public double Closing_Stock_Value { get; set; }
        public double Transit { get; set; }
        public double Transit_Value { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public double Price_Per_Unit { get; set; }
        public string Stockist_Code { get; set; }
        public double Share_Percentage { get; set; }
        public DateTime Effective_From { get; set; }
        public DateTime Effective_To { get; set; }
        public string Privilege_Value_Name { get; set; }
        public string Source_Region { get; set; }
        public string Customer_Name { get; set; }
        public string Stockiest_Code { get; set; }
    }

    #region - Async Report Process Queues
    public class UsersReportQueues
    {
        public string Transaction_ID { get; set; }
        public string Report_Name { get; set; }
        public string Report_Parameters { get; set; }
        public DateTime Rpt_Req_DateTime { get; set; }
        public string Process_State { get; set; }
        public string User_Error_Desc { get; set; }
        public string HTML_File_Content { get; set; }
        public string HTML_File_Path { get; set; }
    }
    public class UsersExcelAPIQueues
    {
        public string Transaction_ID { get; set; }
        public string API_ID { get; set; }
        public string Rpt_Parameters { get; set; }
        public DateTime Rpt_Req_DateTime { get; set; }
        public string Process_State { get; set; }
        public string User_Error_Desc { get; set; }
        public string Excel_File_Path { get; set; }
    }
    public class ExcelApiInput
    {
        public string label { get; set; }
        public string value { get; set; }       
    }

    #endregion


}








