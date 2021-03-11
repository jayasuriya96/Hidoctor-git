using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
     public class BL_PTS
    {
        #region Defaults
        DAL_PTS ObjPTS_DAL = new DAL_PTS();


        #endregion Defaults

        /// <summary>
        /// Method to get all cities on load
        /// </summary>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllCities()
        {
            List<AutoCompleteModel> lstCities = null;
            try
            {
                lstCities = ObjPTS_DAL.GetAllCities().ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstCities;
        }

        /// <summary>
        /// Method to get all pincodes based on city
        /// </summary>
        /// <param name="City_Id"></param>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllPincodes(int City_Id)
        {
            List<AutoCompleteModel> lstPincodes = null;
            try
            {
                lstPincodes = ObjPTS_DAL.GetAllPincodes(City_Id).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstPincodes;
        }
        /// <summary>
        /// Method to insert Patient Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="patientDetails"></param>
        /// <returns></returns>
        public bool InsertPatientDetails(string companyCode,string createdBy,string regionCode,string patientDetails)
        {
            bool result = false;
            try
            {
                result = ObjPTS_DAL.InsertPatientDetails(companyCode, createdBy,regionCode, patientDetails);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to Get all Mobile numbers
        /// </summary>
        /// <returns></returns>
        public List<PatientDetailsModel> GetAllMobileNumbers()
        {
            List<PatientDetailsModel> lstMobileNumbers = null;
            try
            {
                lstMobileNumbers = ObjPTS_DAL.GetAllMobileNumbers().ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstMobileNumbers;
        }
        /// <summary>
        /// Method to get all patients to edit
        /// </summary>
        /// <returns></returns>
        public PatientDetails GetAllPatientsToEdit(string companyCode,string regionCode, int pagenumber, int pageSize)
        {
            PatientDetails lstpatdet = null;
            try
            {
                lstpatdet = ObjPTS_DAL.GetAllPatientsToEdit(companyCode, regionCode,pagenumber,pageSize);
            }
            catch(Exception ex)
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
        public bool PatientStatusChange(int Patient_Id,string updatedBy)
        {
            bool result = false;
            try
            {
                result = ObjPTS_DAL.PatientStatusChange(Patient_Id, updatedBy);

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
        /// <returns></returns>
        public bool UpdatePatientDetails(int patientId,string PatientDetails,string updatedBy)
        {

            bool result = false;
            try
            {
                result = ObjPTS_DAL.UpdatePatientDetails(patientId,PatientDetails,updatedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// Method to get all patients list
        /// </summary>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllPatients(string companyCode,string regionCode)
        {
            List<AutoCompleteModel> lstPatientDet =null;
            try
            {
                lstPatientDet = ObjPTS_DAL.GetAllPatients(companyCode,regionCode).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstPatientDet;
        }
        /// <summary>
        /// Method to get Patient Details 
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        public PatientDetails GetPatientDetailsById(int Patient_Id)
        {
            PatientDetails objdetails = null;
            try
            {
                objdetails = ObjPTS_DAL.GetPatientDetailsById(Patient_Id);
            }
            catch(Exception ex)
            {
                throw;
            }
            return objdetails;
        }
        /// <summary>
        /// Method to get all doctors by region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<AutoCompleteModel> GetAllDoctorsByRegion(string regionCode)
        {
            List<AutoCompleteModel> lstDoctors = null;
            try
            {
                lstDoctors = ObjPTS_DAL.GetAllDoctorsByRegion(regionCode).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstDoctors;
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
                lstprods = ObjPTS_DAL.GetProductsandGroups(regionCode).ToList();
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
        /// <param name="Patient_Id"></param>
        /// <param name="Doctor_Code"></param>
        /// <param name="prescription"></param>
        /// <param name="regionCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>

        public bool InsertPrescriptionDetails( string companyCode,int Patient_Id, string Doctor_Code, string prescription,string regionCode,string frregionCode,string createdBy)
        {
            bool result = false;         
            try
            {
                result = ObjPTS_DAL.InsertPrescriptionDetails(companyCode,Patient_Id, Doctor_Code, prescription, regionCode, frregionCode, createdBy);

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
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="includeparent"></param>
        /// <returns></returns>


        public List<RegionDetailsModel> GetAllRegionUsers(string companyCode,string regionCode,string currentregionCode,string includeOneLevelParent, string excludeParentLevel)
        {
            List<RegionDetailsModel> lstregusers = null;
            try
            {
                lstregusers = ObjPTS_DAL.GetAllRegionUsers(companyCode, regionCode, currentregionCode, includeOneLevelParent, excludeParentLevel).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstregusers;
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
               lstInputs= ObjPTS_DAL.GetInputsBasedonGroup(groupCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstInputs;
        }
        /// <summary>
        /// Method to get regions for patient creation
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>

        public List<AutoCompleteModel> GetRegions(string companyCode,string regionCode)
        {
            List<AutoCompleteModel> lstregions = null;
            try
            {
                lstregions = ObjPTS_DAL.GetRegions(companyCode, regionCode).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstregions;
        }
    }
}
