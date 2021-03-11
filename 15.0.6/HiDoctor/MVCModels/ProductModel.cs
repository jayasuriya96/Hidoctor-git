using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class ProductModel
    {
        #region Properties
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Product_Type_Name { get; set; }
        public string Product_Type_Code { get; set; }
        public string Brand_Name { get; set; }
        public string UOM_Name { get; set; }
        public string UOM_Type_Name { get; set; }
        public string Ref_Key1 { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        #endregion Properties
    }

    public class ProductPriceModel
    {
        #region Properties
        static int nextID = 3;
        public ProductPriceModel()
        {
            ID = nextID++;
        }
        public int ID { get; set; }
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Price_Code { get; set; }
        public string Invoice_Amount { get; set; }
        public string PTS { get; set; }
        public string PTR_WOTax { get; set; }
        public string MRP { get; set; }
        public string NRV { get; set; }
        public string Price_Group_Detail_Code { get; set; }
        public string Price_Group_Code { get; set; }
        public string Price_Group_Name { get; set; }
        public string Source { get; set; }
        public string IsError { get; set; }
        #endregion Properties
    }

    public class SchemeModel
    {
        #region Properties
        public string Scheme_Code { get; set; }
        public string Scheme_Name { get; set; }
        public string Scheme_Base { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Scheme_Detail_Code { get; set; }
        public string Product_Code { get; set; }
        public string Scheme_Mode { get; set; }
        public string Base_Value { get; set; }
        public string Offer_Product_Code { get; set; }
        public string Offer_Value { get; set; }
        public string Product_Name { get; set; }
        public string Offer_Product_Name { get; set; }
        #endregion Properties
    }

    public class SpecialityModel
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
    }

    #region UserProduct Mapping
    public class SampleModel
    {
        public string Privilege_Value_Name { get; set; }
    }

    public class NonsampleModel
    {
        public string Privilege_Value_Name { get; set; }
    }

    public class ProductandSampleModel
    {
        public List<SampleModel> lstsamples { get; set; }
        public List<NonsampleModel> lstNonsample { get; set; }
    }
    public class UserProductaMappingModel
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Brand_Name { get; set; }
    }

    public class UserProductModel
    {
        public string Company_Code { get; set; }
        public string User_Product_Code { get; set; }
        public string User_Code { get; set; }
        public string Product_Code { get; set; }
        public string Current_Stock { get; set; }
        public string User_Product_Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Region_Code { get; set; }
    }
    #endregion UserProduct Mapping

    #region primarysales parameters
    public class PrimarySalesParametersModel
    {
        public string Company_Code { get; set; }
        public string Parameter_Name { get; set; }
        public string Parameter_Code { get; set; }
        public string Record_Status { get; set; }
        public string Param_Column_Name { get; set; }
        public string Flag { get; set; }
    }
    #endregion primarysales parameters

    public class ProductReconProductListModel 
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
        public string Batch_Number { get; set; }
        public int Current_Stock { get; set; }
    }

    public class ProductReconSummaryModel
    {
        public int Product_Recon_Id { get; set; }
        public int Product_Recon_Month { get; set; }
        public int Product_Recon_Year { get; set; }
        public int Product_Recon_Status { get; set; }
        public string Created_Date { get; set; }
        public string Product_Recon_Status_Display_Name { get; set; }
        public bool Is_Variation_Found { get; set; }
        public string Employee_Name { get; set; }
        public string Last_Approval_By { get; set; }
        public string Last_Approval_Remarks { get; set; }
        public string For_The_Month { get; set; }
    }
}
