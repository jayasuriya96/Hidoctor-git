using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using HiDoctor_Activity.Models;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class ChooseDoctorsSelectionController : Controller
    {
        //
        // GET: /ChooseDoctorsSelection/

        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables

        public ActionResult Index(string codes, string dcrActualDate, string accUsers, string flagRCPA, string doctorName, string speciality, string travelKm)
        {
            ViewBag.mString = codes + "&" + dcrActualDate + "&" + accUsers + "&" + flagRCPA + "&" + doctorName + "&" + speciality + "&" + travelKm;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
            
        }

        public JsonResult GetDoctors(string accRegions, string accChemist)
        {
            List<JsonResult> lstJSON = new List<JsonResult>();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string regionCodes = accRegions.Trim().Length > 0 ? accRegions + regionCode + "^" : regionCode + "^";
            string regions = string.Empty;
            string userCode = _objcurrentInfo.GetUserCode();
            int regionLength = 31;
            if (!accChemist.Trim().ToUpper().Contains("DOCTOR"))
            {
                regions = regionCode + "^";
            }
            else
            {
                regions = regionCodes;
                regionLength = regionCodes.Length;
            }

            DataSet dsDoctors = new DataSet();

            // Execute the Query and returns the DataSet.
            dsDoctors = _objSPData.GetSelectedDoctors(companyCode, regions, regionCode,"","");
            DataTable dtDoctors = dsDoctors.Tables[0];

            // Convert the DataTable to list.
            List<DCRDoctorVisitModel> lstDoctor = (from Doctor in dtDoctors.AsEnumerable()
                                                   select new DCRDoctorVisitModel
                                                   {
                                                       label = Doctor["Customer_Name"].ToString() + "_" + Doctor["MDL"].ToString() + "_" + Doctor["Speciality_Name"].ToString() + "_" + Doctor["Region_Name"].ToString(),
                                                       value = Doctor["Customer_Code"].ToString(),
                                                       Category = Doctor["Category_Name"].ToString(),
                                                       Category_Code = Doctor["Category_Code"].ToString(),
                                                       Is_Acc_Doctor = Doctor["Is_Acc_Doctor"].ToString(),
                                                       Speciality_Code = Doctor["Speciality_Code"].ToString(),
                                                       Speciality_Name = Doctor["Speciality_Name"].ToString(),
                                                       Doctor_Region_Code = Doctor["Region_Code"].ToString()
                                                   }).ToList<DCRDoctorVisitModel>();
            // returns the list.
            lstJSON.Add(Json(lstDoctor, JsonRequestBehavior.AllowGet));

            DataSet dsSpeciality = new DataSet();

            // Execute the Query and returns the DataSet.
            dsSpeciality = _objSPData.GetSpeciality(companyCode, userCode);
            DataTable dtSpeciality = dsSpeciality.Tables[0];

            // Convert the DataTable to list.
            List<DCRDoctorVisitModel> lstSpeciality = (from Speciality in dtSpeciality.AsEnumerable()
                                                       select new DCRDoctorVisitModel
                                                       {
                                                           label = Speciality["Speciality_Name"].ToString(),
                                                           value = Speciality["Speciality_Code"].ToString()
                                                       }).ToList<DCRDoctorVisitModel>();
            // returns the list.
            lstJSON.Add(Json(lstSpeciality, JsonRequestBehavior.AllowGet));
            return Json(lstJSON);
        }
    }
}
