using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class RegionCreationModel
    {
        public string Region_Name { get; set; }
        public string Under_Region_Code { get; set; }
        public string Under_Region_Name { get; set; }
        public string Under_Region_Id { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Region_Classification_Name { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Expense_Group_Id { get; set; }
        public string Expense_Group_Name { get; set; }
        public string Region_Country { get; set; }
        public string State_Id { get; set; }
        public string Region_State { get; set; }
        public string Region_City { get; set; }
        public string City_Id { get; set; }
        public string Region_Local_Area { get; set; }
        public string Division_Code { get; set;}
        public string Division_Name { get; set; }
        public string holiday_Code { get; set; }
        public string holiday_name { get; set; }
        public string Price_Group_Name { get; set; }
        public string Price_Group_Code { get; set; }
        public string Active_Count { get; set; }
        public string Sync_Made { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
        public string Depot_Code { get; set; }
        public string Depot_Name { get; set; }
    }
    public class RegionCreationChanges
    {
      
        public string Region_Name { get; set; }
        public string Under_Region_Code { get; set; }
        public string Under_Region_Id { get; set; }
        public string Region_Type_Code { get; set; }
        public string region_Classification { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Expense_Group_Id { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Local_Area { get; set; }
        public string Weekend_Code { get; set; }
        public string Price_group_code { get; set; }
        public string Region_Lock { get; set; }
        public string Chemist_Lock { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To_Month { get; set; }
        public string Effective_To_Year { get; set; }
        public string Division_Code { get; set; }
        public string Holiday_Code { get; set; }
        public string Holiday_Name { get; set; }
        public string Primary_Division { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
        public string Depot_Code { get; set; }
        public string Depot_Name { get; set; }


    }
   
    public class RegionCreationModelRCW
    {
        public List<RegionCreationModel> lstregdetails { get; set; }
        public List<RegionCreationModel> lstregdivddetails { get; set; }
        public List<RegionCreationModel> lstDepoDetails { get; set; }
        public List<RegionCreationModel> lstActiveCount { get; set; }
     
    }
    public class RegionHierarchyChanges
    {
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Region_Name { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Local_Area { get; set; }
        public string Under_Region_Code { get; set; }
        public string Under_Region_Id { get; set; }
        public string Expense_Group_Id { get; set; }
        public string DivisionCode { get; set; }
        public string Notional_Territory { get; set; }
        public string Primary_Division { get; set; }
        public string Ref_Key1 { get;set; }
        public string Ref_key2 { get; set; }
        public string Depot_Code { get; set; }
        public string Depot_Name { get; set; }
    }
    public class UnderRegion
    {
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_id { get; set; }
        public string Region_Type_Code { get; set; }
        public string Full_index { get; set; }
        public string Region_Type_Name { get; set; }
        public string Child_Count { get; set; }
        public string divisionName { get; set; }
        public string divisionCode { get; set; }
        public string Under_Region_Code { get; set; }
    }
    public class RegionType
    {
        public string Region_Type_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string ActiveRegion_Type { get; set; }
    }
    public class RegionClassification
    {
        public string Region_Classification_Name { get; set; }
        public string Region_Classification_Code { get; set; }
    }
    public class ExpenseGroup
    {
        public string Expense_Group_Name { get; set; }
        public string Expense_Group_Id { get; set; }
    }
    public class Divisions
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
    }
    public class PriceGroup
    {
        public string Price_Group_Name { get; set; }
        public string Price_Group_Code { get; set; }
    }
    public class Weekend
    {
        public string Weekend_Off_Name { get; set; }
        public string Weekend_Off_Code { get; set; }
    }
    public class Holiday
    {
        public string Holiday_Name { get; set; }
        public string Holiday_Code { get; set; }
        public string Holiday_Date { get; set; }
        public string Holiday_Year { get; set; }
    }
    public class HolidayInfoModel
    {
        public List<Holiday> lstregionholiday { get; set; }
        public List<Holiday> lstholidayyear { get; set; }
    }
    public class RegionInfo
    {
        public string Curr_User_Code { get; set; }
        public string Curr_User_Name { get; set; }
        public string Child_Count { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Id { get; set; }
        public string Region_Type_Code { get; set; }
        public string Full_Index { get; set; }
    }
    public class RegInfoModel
    {
        public List<RegionInfo> lstcurrinfo { get; set; }
        public List<RegionInfo> lstreginfo { get; set; }
    }
    public class DisableModel
    {
        public string Effective_To { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
    }
    public class Reportingreg
    {
        public string Reporting_Region_Code { get; set; }
        public string Reporting_Region_Name { get; set; }
        public string Reporting_To_RegCode { get; set; }
        public string Reporting_ToRegName { get; set; }
    }
    public class DCRDatemodel
    {
        public string DCR_Actual_Date { get; set; }
      
    }

    public class RegionMigrationModel
    {
        public string CompanyCode { get; set; }
        public string regionCode { get; set; }
        public string RegionName { get; set; }
        public string RegionTypeCode { get; set; }
        public string UnderRegionCode { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string RegionStatus { get; set; }
        public string RegionClassification { get; set; }
        public string divisionCode { get; set; }
        public int Row_Version_No { get; set; }
        public string Region_Classification_Code { get; set; }
        public int Under_Region_Id { get; set; }
        public string Seq_index { get; set; }
        public string Full_index { get; set; }
        public int Region_Id { get; set; }
        public int Display_Order { get; set; }
        public string Region_Local_Area { get; set; }
        public string Region_City { get; set; }
        public string Region_State { get; set; }
        public string Region_Country { get; set; }
        public float Region_Latitude { get; set; }
        public float Region_Longitude { get; set; }
        public string Created_By { get; set; }
    }
    public class Deport
    {
        public string Depot_Name { get; set; }
        public string Depot_Code { get; set; }
    }
}
