using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class StockiestHeaderDetails
    {
        public int ID { get; set; }
        public string Old_Customer_Code { get; set; }
        public string Company_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Customer_Status { get; set; }
        public string Contact_Relation { get; set; }
        public string Row_Status { get; set; }
        public int Row_Version_No { get; set; }
        public int CCM_Customer_ID { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Is_Inherited { get; set; }
        public string Source_Region_Code { get; set; }
        public string Customer_Name { get; set; }
        public string Depot_Code { get; set; }
        public string Category { get; set; }
        public string Speciality_Code { get; set; }
        public string Customer_Group { get; set; }
        public string Drug_License_Number1 { get; set; }
        public string Drug_License_Number2 { get; set; }
        public string Tin_Number { get; set; }
        public string CST_Number { get; set; }
        public string Registration_Number { get; set; }
        public string SubRegion_Code { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Local_Area { get; set; }
        public string City { get; set; }
        public string Pin_Code { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Destination_Place { get; set; }
        public string Product_Discount_Applicable_Status { get; set; }
        public decimal Special_Discount_Rate { get; set; }
        public string Place_Type { get; set; }
        public string Registered_Delear_Status { get; set; }
        public string Party_Location { get; set; }
        public string Locked { get; set; }
        public string DOB { get; set; }
        public string Remarks { get; set; }
        public string Primary_Contact { get; set; }
        public string Primary_Email { get; set; }
        public decimal Octroi_Rate { get; set; }
        public string Tax_Exempted_Status { get; set; }
        public string CForm_Availability { get; set; }
        public string Octroi_Reimbursment_Status { get; set; }
        public string Additional_Surcharge_Status { get; set; }
        public string CST_Applicable { get; set; }
        public string Is_Billable { get; set; }
        public string Created_By { get; set; }
        public string Effective_From { get; set; }
        public string Changed_Column_Name { get; set; }
        public string Old_Value { get; set; }
        public string New_Value { get; set; }
        public string Move_Type { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }


    }
    public class StockiestDetails
    {
        public string Customer_Code { get; set; }
        public string Region_Code { get; set; }
        public string Customer_Name { get; set; }

    }
}
