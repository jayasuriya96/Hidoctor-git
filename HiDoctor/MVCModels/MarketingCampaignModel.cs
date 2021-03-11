using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{

    public class MCHeaderModel
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Campaign_Description { get; set; }
        public string Category_Code { get; set; }
        public string Transaction_Date { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Customer_Speciality_Code { get; set; }
        public int Customer_Count { get; set; }
        public string Record_Status { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Track_Till { get; set; }
        public string Track_From { get; set; }
        public string Doctor_Category_Code { get; set; }
        public string Doctor_Speciality_Code { get; set; }
        public string Doctor_Speciality_Name { get; set; }
        public string Doctor_Category_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Doctor_Product_Mapping_Validation { get; set; }
        public string Mapped_Doctor_Count { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Updated_By { get; set; }
        public string Updated_DateTime { get; set; }
        public string Remarks { get; set; }
        public string Campaign_Current_Status { get; set; }
        public string Campaign_Based_On { get; set; }
        public int Campaign_Budget { get; set; }
        public string Campaign_Frequency { get; set; }
        public int Sample_Count { get; set; }
        public int Customer_Code_Count { get; set; }
        public int Survey { get; set; }
        public string User_type_Code { get; set; }
        public string Survey_ValidTo { get; set; }
        public string Employee_Name{get;set;}

    }
    public class RegionDetailsModelMC
    {
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Full_Index { get; set; }
        public string Under_Region_Code { get; set; }
        public int Child_Count { get; set; }
        public int Doc_Count { get; set; }
        public int Region_User_Status { get; set; }
    }
    public class RegionHierarchyModelMC
    {

        public List<RegionDetailsModelMC> lstRegions { get; set; }
        public List<RegionDetailsModelMC> lstUsers { get; set; }
    }


    public class MCDetailsModel
    {
        public string Company_Code { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Detail_Code { get; set; }
        public string Product_Code { get; set; }
        public string Sample_Code { get; set; }
        public string Product_Name { get; set; }
        public string Sample_Name { get; set; }
        public int Visit_Order { get; set; }
        public int Quantity { get; set; }
        public string Record_Status { get; set; }
        public decimal ROI { get; set; }
        public string Due_Date { get; set; }
        public string Activity_Name { get; set; }
        public int Activity_Id { get; set; }
        public string Input_Type { get; set; }
        public string Start_Date { get; set; }
        public int Line_Item_Budget { get; set; }
    }

    public class MCProductCustomerModel
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Campaign_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Product_Code { get; set; }
        public string Support_Quantity { get; set; }
        public string Potential_Quantity { get; set; }
        public string Ref_Type { get; set; }
        public string Product_Priority_No { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Status { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Product_Name { get; set; }
        public string Brand_Name { get; set; }
        public string Record_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public int Mapped_Count { get; set; }

    }


    public class MCHeader
    {
        public string Status { get; set; }
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Campaign_Description { get; set; }
        public string Customer_Category_Code { get; set; }
        public string Customer_Speciality_Code { get; set; }
        public int Customer_Count { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set; }
        public string Track_Till { get; set; }
        public string Track_From { get; set; }
        public int Campaign_Based_On { get; set; }
        public int Budget_Of_Campaign { get; set; }
        public int Frequency_Of_Campaign { get; set; }
        public int Survey { get; set; }
        public string Doctor_Product_Mapping_Validation { get; set; }
        public string Designation { get; set; }
        public string UserType { get; set; }
        public string Surveydate { get; set; }
        public List<MCProductSampleModel> lstProdSamp { get; set; }
        public List<MCRegionModel> lstRegionCodes { get; set; }
    }
    public class MCRegionModel
    {
        public string Region_Code { get; set; }
    }
    public class MCProductSampleModel
    {
        public string Product_Code { get; set; }
        public string Sample_Code { get; set; }
        public decimal ROI { get; set; }
        public string Input_Type { get; set; }
        public int Quantity { get; set; }
        public int Visit_Order { get; set; }
        public string Start_Date { get; set; }
        public string Due_Date { get; set; }
        public string Activity_Name { get; set; }
        public int Activity_Id { get; set; }
        public int Line_Item_Budget { get; set; }
    }
    public class DesignationModel
    {
        public string Region_Type_Name { get; set; }
        public string Region_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Campaign_Code { get; set; }      
        public string User_type_Code { get; set; } 
    }

    public class MarketingCampaignModel
    {
        public List<MCHeaderModel> lstMCHeader { get; set; }
        public List<MCHeaderModel> lstDesig { get; set; }
        public List<MCHeaderModel> lstDocCateg { get; set; }
        public List<MCHeaderModel> lstSpecCateg { get; set;}
        public List<MCHeaderModel> lstMCParRegions { get; set; }
    }
    public class ActivityModel
    {
        public string Activity_Name { get; set; }
        public int Activity_Id { get; set; }
    }

    public class MCProductModel
    {
        public List<MCDetailsModel> lstProd { get; set; }
        public List<MCDetailsModel> lstSamp { get; set; }
    }
    public class MCCampaign
    {
        public string Campaign_Code { get; set; }
        public string Campaign_Name { get; set; }
        public string Customer_Name { get; set; }
        public string Potential_Quantity { get; set; }
        public string Support_Quantity { get; set; }
        public string Product_Priority_No { get; set; }
        public string Created_By { get; set; }
        public string Created_Region { get; set; }
        public string Product_Name { get; set; }
        public int Campaign_Count { get; set; }
        public string Customer_Code { get; set; }
    }
}
