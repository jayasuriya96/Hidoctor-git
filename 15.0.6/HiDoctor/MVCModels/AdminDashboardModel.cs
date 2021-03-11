using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{

    public class AdminDashboardModel
    {
        public string CompanyCode { get; set; }
        public string UserCode { get; set; }
        public string DivisionCode { get; set; }
        public string RegionCode { get; set; }
        public Boolean IsPS { get; set; }
        public string IsCurrent { get; set; }
        public string Region_Status { get; set; }
        public string Campaign_Code { get; set; }

        public string Month { get; set; }
        public string Year { get; set; }
        public int JA_Wise { get; set; }
        public string Lock_Type { get; set; }

        public string MonthType { get; set; }

        public string Division_Name { get; set; }

        // Page No and Total Count of Table
        public int PageNo { get; set; }
        public int Pagesize { get; set; }

        // DCR TP Lock Status
        public string DcrTpLockStatus { get; set; }
        public string Mode { get; set; }
        public int Period { get; set; }
        public int Option_Type { get; set; }
        public string Region_Name { get; set; }
        public int User_Type { get; set; }
        public string Created_By { get; set; }
    }

    public class AdminDashboardCountModel
    {
        public string MSG { get; set; }
        public string NOTICE { get; set; }
        public string D_DOB { get; set; }
        public string DOA { get; set; }
        public string E_DOB { get; set; }
    }


    public class DDL_Division
    {
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
    }

    public class TopTenSalesProduct
    {
        public List<tbl_TenSalesProductColumns> lstTenSalesProductColumns { get; set; }
        public List<tbl_TenSalesProduct> lstTenSalesProduct { get; set; }
    }

    public class tbl_TenSalesProductColumns
    {
        public string columns { get; set; }
    }

    public class tbl_TenSalesProduct
    {
        public string productName { get; set; }
        public string month1 { get; set; }
        public string month2 { get; set; }
        public string month3 { get; set; }
    }

    public class tbl_PrimarySecondaryTarget
    {
        public string Month { get; set; }
        public decimal Primary_Value { get; set; }
        public decimal Secondary_Value { get; set; }
        public decimal Target_Value { get; set; }
    }


    public class tbl_OpenPosition
    {
        public string Division_Name { get; set; }
        public int Vacancy_Count { get; set; }
        public string Division_Code { get; set; }
    }

    public class tbl_VacantPopUP
    {
        public string Region_Name { get; set; }
        public string Region_Type_Name { get; set; }
        public string Division_Name { get; set; }
        public string Vacant_From_Date { get; set; }
        public string Vacancy_Type { get; set; }
    }

    public class tbl_JoinerVsAttrition
    {
        public string Month_Name { get; set; }
        public int Attrition { get; set; }
        public int Joiners { get; set; }
    }

    public class tbl_JoinerAttrition
    {
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string User_ID { get; set; }
        public string Designation { get; set; }
        public string Division_Values { get; set; }
        public string Date_Of_Joining { get; set; }
        public string Region_Name { get; set; }
        public string Mobile { get; set; }
        public string User_Code { get; set; }
        public int Days_Worked { get; set; }
        public string Resigned_ID { get; set; }
        public string Resignation_Date { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
    }


    public class tbl_DCR_TP_LockDetails
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Locked_Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Lock_Status { get; set; }
        public string Lock_Type { get; set; }
        public string Division_Name { get; set; }
        public string Month { get; set; }
        public string MonthVal { get; set; }

    }

    public class tbl_GetCounts
    {
        public string LockedUserCount { get; set; }
        public string LockedCount { get; set; }
    }

    public class tbl_EntityMapping
    {
        public string Entity_Code { get; set; }
        public string Division_Code { get; set; }
    }


    public class EmployeeBirthdayPopUp
    {
        public string Employee_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Date_Of_Birth { get; set; }

    }

    public class tbl_CampaignCounts
    {
        public decimal ActiveRuningMcCount { get; set; }
    }

    public class tbl_MarketingCampaign
    {
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Created_Date { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Customer_Speciality_Code { get; set; }
        public string Product_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string Designation { get; set; }
        public string Region_Name { get; set; }
        public string Created_By { get; set; }

        public string Dr_Category { get; set; }
        public string Speciality { get; set; }

        public int No_Of_Product { get; set; }
        public int No_of_Participants { get; set; }
        public int No_of_Dr_Mapped { get; set; }
        public string Division_Name { get; set; }
    }
    public class MC_Details
    {
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string MC_Start_Date { get; set; }
        public string MC_End_Date { get; set; }
        public int Customer_Count { get; set; }
        public int Region_Count { get; set; }
        public int Proposed_Count { get; set; }
        public int Actual_Met_Count { get; set; }
        public decimal Coverage_percentage { get; set; }

    }
    public class MC_Doctor_Details
    {
        public string Customer_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Visit_Mode { get; set; }
        public int Actual_Met_Count { get; set; }
    }
    public class MC_RegionWise
    {
        public string Campaign_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public int Doctor_Count { get; set; }
        public string Created_by { get; set; }
        public string Visit_Count { get; set; }
        public int Actual_Met_Count { get; set; }
        public decimal Coverage_percentage { get; set; }
        public string Employee_Name { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class DCRCompliance
    {
        public decimal count { get; set; }
    }

    public class tbl_DcrCompliance
    {
        public string ddcrcid { get; set; }
        public string user_name { get; set; }
        public string User_Code { get; set; }
        public string user_type_name { get; set; }
        public string region_name { get; set; }
        public string division_values { get; set; }
        public string hidoctor_startdate { get; set; }
        public string start_date { get; set; }
        public string End_date { get; set; }
        public string resignation_date { get; set; }
        public string user_status { get; set; }
        public string total_count { get; set; }
        public string weekends { get; set; }
        public string holiday { get; set; }
        public string applicable_count { get; set; }
        public string working_count { get; set; }
        public decimal dcr_compliance { get; set; }
    }



    public class tbl_lstCategory
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }

    public class tbl_lstSpeciality
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }

    public class CategoryNew
    {
        public int Total { get; set; }
        public int Missed { get; set; }
        public int Exact_Norms { get; set; }
        public int Less_Norms { get; set; }
        public int More_Norms { get; set; }
    }
    public class CategoryNewSummary
    {
        public string Region_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Employee_Number { get; set; }
        public string Designation { get; set; }
        public string Total { get; set; }
        public string Missed { get; set; }
        public string Exact_Norms { get; set; }
        public string Less_Norms { get; set; }
        public string More_Norms { get; set; }
        public string Region_Code { get; set; }
    }
    public class CategoryNewSummary_Drill
    {

        public string Doctor_Name { get; set; }
        public string Doctor_MDL { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Norms_Visit_Count { get; set; }
        public string Actual_Visit_Count { get; set; }
        public string Last_Actual_Visit_Count { get; set; }
    }
    public class CategoryRegion
    {
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public int Missed { get; set; }
        public int Less_Norms { get; set; }
        public int More_Norms { get; set; }
        public int Exact_Norms { get; set; }
        public int Total { get; set; }
    }
    public class DcrComplianceNew
    {
        public string DcrCount { get; set; }
    }

    public class DoctorDetails
    {
        public string Doctor_Name { get; set; }
        public string Doctor_Category { get; set; }
        public string Doctor_Speciality { get; set; }
        public string Doctor_MDL { get; set; }

    }
    public class DocProductModel
    {
        public string customer_name { get; set; }
        public string customer_Code { get; set; }
        public string MDL_Number { get; set; }

        public string Category_Name { get; set; }
        public string Category_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string product_name { get; set; }
        public string Product_Code { get; set; }
        public string Support_Quantity { get; set; }
        public string Potential_Quantity { get; set; }
        public int Product_Priority_No { get; set; }
        public string Ref_Type { get; set; }

    }
    public class AC_ProductModel
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
    }
    public class DocProdDetailsModel
    {
        public IEnumerable<DocProductModel> lstDocProd { get; set; }
        public IEnumerable<AC_ProductModel> lstAC_Product { get; set; }
    }
    public class DocProdInsertModel
    {
        public string Customer_Code { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Product_Code { get; set; }
        public string Support_Quantity { get; set; }
        public string Potential_Quantity { get; set; }
        public int Product_Priority_No { get; set; }
        public string Region_Code { get; set; }
        public string User_Region_Code { get; set; }
        public string Ref_Type { get; set; }

    }
}
