using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    //Model for Patient Details
    public class PatientDetailsModel
    {
        public string Address { get; set; }
        public decimal Age { get; set; }
        public string Alternate_Mobile_Number { get; set; }
        public int City_Id { get; set; }
        public string City_Name { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Mobile_Number { get; set; }
        public string Patient_Name { get; set; }
        public int Pincode_Id { get; set; }
        public int Patient_Id { get; set; }
        public string Pincode { get; set; }
        public string Title { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public int Cirrhotic { get; set; }
        public int NON_Cirrhotic { get; set; }
        public int Decompensated_Cirrhotic { get; set; }
        
    }
    public class PatientDetails
    {
       public int TotalCount { get; set; }
       public List<PatientDetailsModel> lstPatientDetails { get; set; }
        public List<AutoCompleteModel> lstRegionNames { get; set; }
    }

    public class AutoCompleteModel
    {
        public string label { get; set; }     
        public string value { get; set; }
        public int Mapping_Id { get; set; }
        public int Prescription_Id { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public int Patient_Id { get; set; }
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
        public string Category_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Customer_Name { get; set; }
    }
    public class PrescriptionModel
    {

        public string Product_Code { get; set; }
        public decimal Units { get; set; }
        public string Date_Of_Consumption { get; set; }
        public string Follow_Up_Date { get; set; }
        public string Prescription_Date { get; set; }
        public List<InputParameters> lstInput { get; set; }

    }
    public class InputParameters
    {
        public int Input_Id { get; set; }
        public string Input_Value { get; set; }
    }
    public class ProductAndGroupsModel
    {
        public string Product_Name { get; set; }
        public string Product_Code { get; set; }

        public string Product_Group_Name { get; set; }

        public string Product_Group_Code { get; set; }
    }
    public class GroupandProducts
    {
        public List<ProductAndGroupsModel> lsproductDetails { get; set; }
        public List<ProductAndGroupsModel> lsGroupDetails { get; set; }
    }
    public class RegionDetailsModel
    {
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string User_Name { get; set; }
       
        public string Full_Index { get; set; }
        public string Under_Region_Code { get; set; }
        public int Child_Count { get; set; }
        public int Doc_Count { get; set; }
        public int Region_User_Status { get; set; }
    }
    public class InputParametersModel
    {
        public  string Group_Code { get; set; }
        public string Input_Name { get; set; }
        public string Input_DataType { get; set; } 
        public int Input_ID { get; set; }
        public string Product_Group_Name { get; set; }
    }
}
