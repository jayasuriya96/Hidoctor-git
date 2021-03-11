using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Reports
{
    public class Customer360Model
    {
        public string Customer_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string DOB { get; set; }
        public List<Customer360CampaignModel> lstCampaignModel { get; set; }
        public List<Customer360LastVisitsModel> lstLastVisit { get; set; }
        public List<Customer360SamplesAndDetailsModel> lstSamples { get; set; }
        public List<Customer360NonSamplesAndDetailsModel> lstNonSamples { get; set; }
        public List<Customer360ChemistVisitModel> lstChemist { get; set; }
        public List<Customer360ProductMappingModel> lstProductMapping { get; set; }
        public List<Customer360RCPADetailsModel> lstRCPA { get; set; }
        public List<Customer360RemarksModel> lstRemarks { get; set; }
        public List<HiDoctor_Master.UserModel> lstUsers { get; set; }

        //Adding Local area and Sur Name
        public string Local_Area { get; set; }
        public string Sur_Name { get; set; }

    }

    public class Customer360CampaignModel
    {
        public string Campaing_Name { get; set; }
    }
    public class Customer360LastVisitsModel
    {
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }

    }
    public class Customer360SamplesAndDetailsModel
    {
        public string Product_Name { get; set; }
        public string Quantity_Provided { get; set; }
        public string DCR_Date { get; set; }
        public string User_Code { get; set; }
    }

    public class Customer360NonSamplesAndDetailsModel
    {
        public string Product_Name { get; set; }
        public string Quantity_Provided { get; set; }
        public string DCR_Date { get; set; }
        public string User_Code { get; set; }
    }


    public class Customer360ChemistVisitModel
    {
        public string Customer_Name { get; set; }
        public string DCR_Date { get; set; }
        public string PO_Amount { get; set; }
        public string User_Code { get; set; }
    }

    public class Customer360ProductMappingModel
    {
        public string Product_Name { get; set; }
        public string Support_Quantity { get; set; }
        public string Potential_Quantity { get; set; }
        public string Date { get; set; }
    }
    public class Customer360RCPADetailsModel
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }
        public string Support_Qty { get; set; }
        public string Competitor_Product_Name { get; set; }
        public string Comp_Qty { get; set; }
        public string User_Code { get; set; }
    }
    public class Customer360RemarksModel
    {
        public string Remarks { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string User_Code { get; set; }
    }
}
