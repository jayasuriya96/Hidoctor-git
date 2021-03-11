using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{

    [AjaxSessionActionFilter]
    public class PatientTrackingController : Controller
    {


        #region Defaults
        BL_PTS ObjPTS_BL = new BL_PTS();
        CurrentInfo _ObjCurrentInfo = new CurrentInfo();

        #endregion Defaults




        // Action Result or View to Patient Creation Master
        public ActionResult PatientCreationMaster()
        {

            ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
            ViewBag.Region_Name = _ObjCurrentInfo.GetRegionName();
            return View();
        }

        // Action Result or View to Prescription Tracking
        public ActionResult PrescriptionTracking()
        {
            return View();
        }

        /// <summary>
        /// Method to get all cities on load 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllCities")]
        public JsonResult GetAllCities()
        {
            try
            {
                return Json(ObjPTS_BL.GetAllCities(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to get all  pincodes based on city
        /// </summary>
        /// <param name="City_Id"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllPincodes")]
        public JsonResult GetAllPincodes(int City_Id)
        {
            try
            {
                return Json(ObjPTS_BL.GetAllPincodes(City_Id), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        /// <summary>
        /// Method to Insert Patient Details
        /// </summary>
        /// <param name="patientDetails"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InsertPatientDetails")]
        public bool InsertPatientDetails(string patientDetails)
        {
            bool result = false;
            string companyCode = null;
            string createdBy = null;
            string regionCode = null;
            try
            {
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                createdBy = ViewBag.Created_By = _ObjCurrentInfo.GetUserCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                result = ObjPTS_BL.InsertPatientDetails(companyCode, createdBy,regionCode, patientDetails);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all mobile numbers
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllMobileNumbers")]
        public JsonResult GetAllMobileNumbers()
        {
            try
            {
                return Json(ObjPTS_BL.GetAllMobileNumbers(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to get all patients to edit
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllPatientsToEdit")]
        public JsonResult GetAllPatientsToEdit(int pagenumber, int pageSize)
        {
            string companyCode = null;
            string regionCode = null;
            try
            {
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                return Json(ObjPTS_BL.GetAllPatientsToEdit(companyCode,regionCode,pagenumber,pageSize), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to change status of the patient to inactive
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        [HttpPut]
        [ActionName("PatientStatusChange")]
        public bool PatientStatusChange(int Patient_Id)
        {
            bool result = false;
            string updatedBy = null;
            try
            {
                updatedBy = ViewBag.User_Code = _ObjCurrentInfo.GetUserCode();
                result = ObjPTS_BL.PatientStatusChange(Patient_Id, updatedBy);

            }
            catch(Exception ex)
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
        [HttpPut]
        [ActionName("UpdatePatientDetails")]
        public bool UpdatePatientDetails(int patientId,string PatientDetails)
        {
            bool result = false;
            string updatedBy = null;
            try
            {
                updatedBy = ViewBag.User_Code = _ObjCurrentInfo.GetUserCode();
                result = ObjPTS_BL.UpdatePatientDetails(patientId,PatientDetails,updatedBy);
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

        [HttpGet]
        [ActionName("GetAllPatients")]
        public JsonResult GetAllPatients()
        {
            string companyCode = null;
            string regionCode = null;

            try
            {
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();

                return Json(ObjPTS_BL.GetAllPatients(companyCode,regionCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to get patient details based on id
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetPatientDetailsById")]
        public JsonResult GetPatientDetailsById(int Patient_Id)
        {
            try
            {
                return Json(ObjPTS_BL.GetPatientDetailsById(Patient_Id), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to get doctors by region
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllDoctorsByRegion")]
        public JsonResult GetAllDoctorsByRegion(string regionCode)
        {
            
            try
            {
                return Json(ObjPTS_BL.GetAllDoctorsByRegion(regionCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        /// <summary>
        /// Method to Get Groups and Products
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetProductsandGroups")]
        public JsonResult GetProductsandGroups()
        {
            string regionCode = null;
            try
            {
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();

                List<ProductAndGroupsModel> lstprods = new List<ProductAndGroupsModel>();
                lstprods = ObjPTS_BL.GetProductsandGroups(regionCode);

                List<ProductAndGroupsModel> groupName = lstprods.GroupBy(x => x.Product_Group_Code).Select(y => y.First()).ToList();


                List<GroupandProducts> g = new List<GroupandProducts>();
                GroupandProducts group = new GroupandProducts();
                group.lsproductDetails = lstprods;
                group.lsGroupDetails = groupName;

                return Json(group, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        }


        /// <summary>
        /// Method to insert prescription Details
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="Doctor_Code"></param>
        /// <param name="prescription"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InsertPrescriptionDetails")]
        public bool InsertPrescriptionDetails(int Patient_Id, string Doctor_Code, string prescription,string frregionCode)
        {
            bool result = false;
            string regionCode = null;
            string companyCode = null;
            string createdBy = null;
            try
            {
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                createdBy = ViewBag.Created_By = _ObjCurrentInfo.GetUserCode();
                result = ObjPTS_BL.InsertPrescriptionDetails(companyCode, Patient_Id, Doctor_Code, prescription, regionCode, frregionCode, createdBy);

            }
            catch (Exception ex)
            {

                throw;
            }
            return result;

        }
        /// <summary>
        /// Method  to get all region users
        /// </summary>
        /// <param name="includeOneLevelParent"></param>
        /// <returns></returns>

        [HttpGet]
        [ActionName("GetAllRegionUsers")]
        public JsonResult GetAllRegionUsers(string excludeParentLevel, string includeOneLevelParent)
        {
            string companyCode = null;
            string CurrentregionCode = null;
            string regionCode = null;
            try
            {
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                CurrentregionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                return Json(ObjPTS_BL.GetAllRegionUsers(companyCode,regionCode, CurrentregionCode, includeOneLevelParent,excludeParentLevel), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to get inputs based on group code
        /// </summary>
        /// <param name="groupCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetInputsBasedonGroup")]
        public JsonResult GetInputsBasedonGroup(string groupCode)
        {
            try
            {
                return Json(ObjPTS_BL.GetInputsBasedonGroup(groupCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to get regions for patient creation
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        [ActionName("GetRegions")]
        public JsonResult GetRegions()
        {
            List<AutoCompleteModel> lstregions = null;
            string companyCode = null;
            string regionCode = null;
            try
            {
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Regio_Code = _ObjCurrentInfo.GetRegionCode();
                lstregions = ObjPTS_BL.GetRegions(companyCode, regionCode).ToList();
                return Json(lstregions, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }

        }

    }
}
