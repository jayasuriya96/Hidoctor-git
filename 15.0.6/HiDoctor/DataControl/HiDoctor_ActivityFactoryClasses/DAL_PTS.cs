using Dapper;
using MVCModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_PTS : DapperRepository
    {
        #region  Stored Procedure's
        public const string SP_HD_PTS_INSERTPATIENTDETAILS = "SP_HD_PTS_InsertPatientDetails";
        public const string SP_HD_PTS_GETALLCITIES = "SP_HD_PTS_GetAllCities";
        public const string SP_HD_PTS_GETALLPINCODES = "SP_HD_PTS_GetAllPincodes";
        public const string SP_HD_PTS_GETALLMOBILENUMBERS = "SP_HD_PTS_GetAllMobileNumbers";
        public const string SP_HD_PTS_GETALLPATIENTS = "SP_HD_PTS_GetAllPatients";
        public const string SP_HD_PTS_GETPATIENTDETAILSBYID = "SP_HD_PTS_GetPatientDetailsById";
        public const string SP_HD_PTS_GETALLDOCTORSBYREGION = "SP_HD_PTS_GetAllDoctorsByRegion";
        public const string SP_HD_PTS_INSERTDOCTORPRODUCTMAPPINGDETAILS = "SP_HD_PTS_InsertDoctorProductMappingDetails";
        public const string SP_HD_PTS_INSERTPRESCRIPTIONDETAILS = "SP_HD_PTS_InsertPrescriptionDetails";
        public const string SP_HD_PTS_GETALLPRODUCTSANDGROUPS = "SP_HD_PTS_GetAllProductsandGroups";
        public const string SP_HD_PTS_GETREGIONWISETREEDETAILS = "SP_HD_PTS_GetRegionwiseTreeDetails";
        public const string SP_HD_PTS_GETALLPATIENTDETAILSTOEDIT = "SP_HD_PTS_GetAllPatientDetailsToEdit";
        public const string SP_HD_PTS_CHANGEPATIENTSTATUS = "SP_HD_PTS_ChangePatientStatus";
        public const string SP_HD_PTS_UPDATEPATIENTDETAILS = "SP_HD_PTS_UpdatePatientDetails";
        public const string SP_HD_PTS_GETINPUTSBASEDONGROUP = "SP_HD_PTS_GetInputsBasedonGroup";
        public const string SP_HD_PTS_INSERTINPUTGROUPVALUES = "SP_HD_PTS_InsertInputGroupValues";
        public const string SP_HD_PTS_GETREGIONSFORPATIENTCREATION = "SP_HD_PTS_GetRegionsforPatientCreation";
        #endregion Stored Procedure's



        /// <summary>
        /// Method to get all cities on load
        /// </summary>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllCities()
        {
            List<AutoCompleteModel> lstCities = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCities = connection.Query<AutoCompleteModel>(SP_HD_PTS_GETALLCITIES, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCities;
        }

        /// <summary>
        /// Method to get all pincodes based on city
        /// </summary>
        /// <param name="city_Id"></param>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllPincodes(int city_Id)
        {
            List<AutoCompleteModel> lstpincodes = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@City_Id", city_Id);
                    lstpincodes = connection.Query<AutoCompleteModel>(SP_HD_PTS_GETALLPINCODES, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstpincodes;
        }

        /// <summary>
        /// Method to insert patient details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="patientDetails"></param>
        /// <returns></returns>
        public bool InsertPatientDetails(string companyCode, string createdBy,string regionCode, string patientDetails)
        {
            bool result = false;
            try
            {
                if (!string.IsNullOrEmpty(patientDetails))
                {
                    var patientdetails = JsonConvert.DeserializeObject<PatientDetailsModel>(patientDetails);

                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@Company_Code", companyCode);
                        p.Add("@Title", patientdetails.Title);
                        p.Add("@Patient_Name", patientdetails.Patient_Name);
                        p.Add("@Gender", patientdetails.Gender);
                        p.Add("@Age", patientdetails.Age);
                        p.Add("@Mobile_Number", patientdetails.Mobile_Number);
                        p.Add("@Address", patientdetails.Address);
                        p.Add("@City_Id", patientdetails.City_Id);
                        p.Add("@Pincode_Id", patientdetails.Pincode_Id);
                        p.Add("@Email", patientdetails.Email);
                        p.Add("@Alternate_Mobile_Number", patientdetails.Alternate_Mobile_Number);
                        p.Add("@Created_By", createdBy);                     
                        p.Add("@Created_By_RegionCode", regionCode);
                        p.Add("@Cirrhotic",patientdetails.Cirrhotic);
                        p.Add("@NON_Cirrhotic", patientdetails.NON_Cirrhotic);
                        p.Add("@Decompensated_Cirrhotic", patientdetails.Decompensated_Cirrhotic);
                        p.Add("@Region_Code", patientdetails.Region_Code);
                        connection.Execute(SP_HD_PTS_INSERTPATIENTDETAILS, p, commandType: CommandType.StoredProcedure);
                        result = true;
                        connection.Close();                 
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all Mobile Numbers
        /// </summary>
        /// <returns></returns>
        public List<PatientDetailsModel> GetAllMobileNumbers()
        {
            List<PatientDetailsModel> lstMobileNumbers = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    lstMobileNumbers = connection.Query<PatientDetailsModel>(SP_HD_PTS_GETALLMOBILENUMBERS, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstMobileNumbers;
        }
        /// <summary>
        /// Method to get all patients to edit
        /// </summary>
        /// <returns></returns>
        public PatientDetails GetAllPatientsToEdit(string companyCode,string regionCode,int pagenumber, int pageSize)
        {
            PatientDetails lstpatdet = new PatientDetails();
            try
            {
                List<PatientDetailsModel> lstpatient = null;
                List<AutoCompleteModel> lstregions = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code",companyCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Page_Number", pagenumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Totalcount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    using (var multiselect = connection.QueryMultiple(SP_HD_PTS_GETALLPATIENTDETAILSTOEDIT, p, commandType: CommandType.StoredProcedure))
                    {
                        lstpatient = multiselect.Read<PatientDetailsModel>().ToList();
                        lstregions = multiselect.Read<AutoCompleteModel>().ToList();
                    }
                    lstpatdet.TotalCount = p.Get<int>("@Totalcount");
                    lstpatdet.lstPatientDetails = lstpatient;
                    lstpatdet.lstRegionNames = lstregions;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstpatdet;
        }
        /// <summary>
        /// Method to change status of patient to inactive
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        public bool PatientStatusChange(int Patient_Id, string updatedBy)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Patient_Id", Patient_Id);
                    p.Add("@Updated_By", updatedBy);
                    connection.Execute(SP_HD_PTS_CHANGEPATIENTSTATUS, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to update patient details
        /// </summary>
        /// <param name="PatientDetails"></param>
        /// <param name="updatedBy"></param>
        /// <returns></returns>

        public bool UpdatePatientDetails(int patientId, string PatientDetails, string updatedBy)
        {
            bool result = false;
            try
            {
                if (!string.IsNullOrEmpty(PatientDetails))
                {
                    var patientdetails = JsonConvert.DeserializeObject<PatientDetailsModel>(PatientDetails);

                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@Patient_Id", patientId);                    
                        p.Add("@Address", patientdetails.Address);
                        p.Add("@City_Id", patientdetails.City_Id);
                        p.Add("@Pincode_Id", patientdetails.Pincode_Id);
                        p.Add("@Email", patientdetails.Email);
                        p.Add("@Alternate_Mobile_Number", patientdetails.Alternate_Mobile_Number);
                        p.Add("@Updated_By", updatedBy);
                        connection.Execute(SP_HD_PTS_UPDATEPATIENTDETAILS, p, commandType: CommandType.StoredProcedure);
                        result = true;
                        connection.Close();

                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all patients in list
        /// </summary>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllPatients(string companyCode, string regionCode)
        {
            List<AutoCompleteModel> lstPatientDet = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode",regionCode);
                    lstPatientDet = connection.Query<AutoCompleteModel>(SP_HD_PTS_GETALLPATIENTS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstPatientDet;
        }
        /// <summary>
        /// Method to Get Patient Details by Id
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        public PatientDetails GetPatientDetailsById(int Patient_Id)
        {
            PatientDetails Objdetails = new PatientDetails();
            try
            {
                List<PatientDetailsModel> objpatient = null;
                List<AutoCompleteModel> lstregions = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Patient_Id", Patient_Id);
                    using (var multiselect = connection.QueryMultiple(SP_HD_PTS_GETPATIENTDETAILSBYID, p, commandType: CommandType.StoredProcedure))
                    {
                        objpatient = multiselect.Read<PatientDetailsModel>().ToList();
                        lstregions = multiselect.Read<AutoCompleteModel>().ToList();

                    }
                    Objdetails.lstPatientDetails = objpatient;
                    Objdetails.lstRegionNames = lstregions;
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return Objdetails;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>

        public List<AutoCompleteModel> GetAllDoctorsByRegion(string regionCode)
        {
            List<AutoCompleteModel> lstDoctors = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", regionCode);
                    lstDoctors = connection.Query<AutoCompleteModel>(SP_HD_PTS_GETALLDOCTORSBYREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDoctors;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="Patient_Id"></param>
        /// <param name="Doctor_Code"></param>
        /// <param name="prescription"></param>
        /// <param name="regionCode"></param>
        /// <param name="frregionCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>

        public bool InsertPrescriptionDetails(string companyCode, int Patient_Id, string Doctor_Code, string prescription, string regionCode, string frregionCode, string createdBy)
        {
            int Input_Id = 0;
            var Input_Value = 0;
            bool result = false;
            List<AutoCompleteModel> lstMapId = null;
            List<AutoCompleteModel> lstPresId = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Patient_Id", Patient_Id);
                    p.Add("@Doctor_Code", Doctor_Code);
                    p.Add("@Doctor_Region_Code", frregionCode);
                    p.Add("@Created_By", createdBy);
                    lstMapId = connection.Query<AutoCompleteModel>(SP_HD_PTS_INSERTDOCTORPRODUCTMAPPINGDETAILS, p, commandType: CommandType.StoredProcedure).ToList();


                    if (!string.IsNullOrEmpty(prescription))
                    {
                        var Prescription = JsonConvert.DeserializeObject<List<PrescriptionModel>>(prescription);

                        foreach (PrescriptionModel Obj in Prescription)
                        {
                            var q = new DynamicParameters();
                            q.Add("@Company_Code", companyCode);
                            q.Add("@Mapping_Id", lstMapId[0].Mapping_Id);
                            q.Add("@Product_Code", Obj.Product_Code);
                            q.Add("@Product_Quantity", Obj.Units);
                            q.Add("@DateOfConsumption", Obj.Date_Of_Consumption);
                            q.Add("@PrescriptionDate", Obj.Prescription_Date);
                            q.Add("@FollowupDate", Obj.Follow_Up_Date);
                            q.Add("@Created_By", createdBy);
                            q.Add("@Created_By_Region_Code", regionCode);
                            q.Add("@Created_For_Region_Code", frregionCode);
                            lstPresId = connection.Query<AutoCompleteModel>(SP_HD_PTS_INSERTPRESCRIPTIONDETAILS, q, commandType: CommandType.StoredProcedure).ToList();


                            var InputDetails = Obj.lstInput;
                            if (InputDetails.Count != 0 && InputDetails != null)
                            {
                                for (int i = 0; i < InputDetails.Count; i++)
                                {
                                    var m = new DynamicParameters();
                                    m.Add("@Company_Code", companyCode);
                                    m.Add("@Prescription_Id", lstPresId[0].Prescription_Id);
                                    if (InputDetails[i].Input_Id == 0)
                                    {
                                        m.Add("@Input_Id", Input_Id);
                                    }
                                    else
                                    {
                                        m.Add("@Input_Id", InputDetails[i].Input_Id);
                                    }
                                    if (InputDetails[i].Input_Value == null || InputDetails[i].Input_Value == "undefined" || InputDetails[i].Input_Value == "")
                                    {
                                        m.Add("@Input_Value", Input_Value);
                                    }
                                    else
                                    {
                                        m.Add("@Input_Value", InputDetails[i].Input_Value);

                                    }
                                    m.Add("@Created_By", createdBy);
                                    connection.Execute(SP_HD_PTS_INSERTINPUTGROUPVALUES, m, commandType: CommandType.StoredProcedure);

                                }
                            }                    
                        }
                        result = true;
                        connection.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<ProductAndGroupsModel> GetProductsandGroups(string regionCode)
        {
            List<ProductAndGroupsModel> lstprods = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("Region_Code", regionCode);
                    lstprods = connection.Query<ProductAndGroupsModel>(SP_HD_PTS_GETALLPRODUCTSANDGROUPS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstprods;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="currentregionCode"></param>
        /// <param name="includeOneLevelParent"></param>
        /// <param name="excludeParentLevel"></param>
        /// <returns></returns>

        public List<RegionDetailsModel> GetAllRegionUsers(string companyCode, string regionCode, string currentregionCode, string includeOneLevelParent, string excludeParentLevel)
        {
            List<RegionDetailsModel> lstRegionUsers = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Include_Parent", includeOneLevelParent);
                    p.Add("@Exclude_First_Level", excludeParentLevel);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    lstRegionUsers = connection.Query<RegionDetailsModel>(SP_HD_PTS_GETREGIONWISETREEDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegionUsers;
        }
        /// <summary>
        /// Method to get inputs based on groupcode
        /// </summary>
        /// <param name="groupCode"></param>
        /// <returns></returns>
        public List<InputParametersModel> GetInputsBasedonGroup(string groupCode)
        {
            List<InputParametersModel> lstInputs = null;
            try
            {
                using (IDbConnection connection=IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Group_Code",groupCode);
                    lstInputs = connection.Query<InputParametersModel>(SP_HD_PTS_GETINPUTSBASEDONGROUP, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstInputs;
        }
        /// <summary>
        /// Mehtod to get regions patient creation 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>

        public List<AutoCompleteModel> GetRegions(string companyCode,string regionCode)
        {
            List<AutoCompleteModel> lstregions = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode",companyCode);
                    p.Add("@RegionCode",regionCode);
                    lstregions = connection.Query<AutoCompleteModel>(SP_HD_PTS_GETREGIONSFORPATIENTCREATION, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstregions;
        }
    }
}
