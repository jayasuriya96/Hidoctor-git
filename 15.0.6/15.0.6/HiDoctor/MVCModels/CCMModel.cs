using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class CCMModel
    {
        public string Company_Code { get; set; }
        public string Customer_ID { get; set; }
        public string Customer_Name { get; set; }
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Code { get; set; }
        public string Qualification { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Local_Area { get; set; }
        public string Pin_Code { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Hospital_Name { get; set; }
        public string Hospital_Classification { get; set; }
        public string DOB { get; set; }
        public string Anniversary_Date { get; set; }
        public string Registration_No { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string SRID { get; set; }
        public string Active_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
        public string Remarks { get; set; }
        public string Is_Similar_Doctor { get; set; }
        public string Is_Soundex_Processed { get; set; }
        public string Soundex_Processed_Date { get; set; }
        public string Similar_Doctor_ID { get; set; }
        public string CCM_Customer_ID { get; set; }
        public string Speciality_Color { get; set; }
        public string Speciality_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Customer_Status { get; set; }
        public string Customer_Code { get; set; }
        public string Gender { get; set; }
        public string Sur_Name { get; set; }
    }

    public class DoctorCategoryModel
    {
        public string Category_Code { get; set; }
        public string Category_Name { get; set; }
    }

    public class SpecialityModel
    {
        public string Speciality_Code { get; set; }
        public string Speciality_Name { get; set; }
        public string Speciality_Color { get; set; }
    }

    public class RegionModel
    {
        public string Region_Type_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string Region_Classification_Code { get; set; }
        public string Region_Classification_Name { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
        public string Ref_Key1 { get; set; }
        public string Reporting_Region_Name { get; set; }
        public string Reporting_Region_Type_Name { get; set; }
    }

    public class CCMSoundexProcessHistory
    {
        public Guid SOUNDEX_PROCESS_ID { get; set; }
        public string START_TIME { get; set; }
        public string END_TIME { get; set; }
        public string CURRENT_STATUS { get; set; }
        public string User_Name { get; set; }
    }
}
