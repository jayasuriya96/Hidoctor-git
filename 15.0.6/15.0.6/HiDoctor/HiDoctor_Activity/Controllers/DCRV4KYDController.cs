#region Usings
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DataControl;
using DataControl.EnumType;
using DataControl.Impl;
using DataControl.Abstraction;
using System.Data;
using System.Text;
using MVCModels;
using Newtonsoft.Json;
using System;
#endregion Usings

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4KYDController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objCurr = null;
        private BL_KYD _blKYD = null;
        #endregion Private Variables

        #region Public Methods

        #region Configuration Setting Values
        /// <summary>
        /// Used to Get KYD is enable or not for Desigantion
        /// </summary>
        /// <returns></returns>
        public JsonResult GetConfigurationValues()
        {
            try
            {
                List<KYD_Config_Values> lstconfigvalues = new List<KYD_Config_Values>();
                _blKYD = new BL_KYD();
                _objCurr = new DataControl.CurrentInfo();

                lstconfigvalues = _blKYD.GetConfigValues(_objCurr.GetCompanyCode(), _objCurr.GetUserTypeName()).ToList();
                return Json(lstconfigvalues, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }

        }
        #endregion Configuration Setting Values

        #region KYD - Web
        public ActionResult KYD(string dcrActualDate,string flag)
        {
            ViewBag.DCR_Date = dcrActualDate;
            ViewBag.Flag = flag;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("KYD.Mobile");
            }
            return View();
        }
        /// <summary>
        /// Used to Get All doctorList
        /// </summary>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public string GetKYDDoctorListHTMLFormat(string dcrDate, string Key_Column)
        {
            try
            {
                StringBuilder strTbl = new StringBuilder();
                int rowCount = 1;
                // Call the KYDCustomer List function.
                List<KYDModel> lstKYDCustomers = GetKYDCustomerList(dcrDate, Key_Column);

                if (lstKYDCustomers != null && lstKYDCustomers.Count > 0)
                {
                    strTbl.Append("<div>");
                    strTbl.Append("<table WIDTH='75%' id='tblDisplayKYD' class='table'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr style='background-color:#428bca;'>");
                    strTbl.Append("<th>Doctor Name</th>");                    
                    strTbl.Append("<th>Region Name</th>");
                    strTbl.Append("<th>Specialty</th>");
                    strTbl.Append("<th id='thEmail' class='cls_DisplayColumn'>Email Id<span class='mandatory' id='spnmanmail'></span></th>");
                    strTbl.Append("<th id='thRegNo' class='cls_DisplayColumn'>Reg No<span class='mandatory' id='spnmanreg'></span></th>");
                    strTbl.Append("<th id='thMobileNo' class='cls_DisplayColumn'>Mobile No<span class='mandatory' id='spnmanmobile'></span></th>");
                    strTbl.Append("<th id='thLocalarea' class='cls_DisplayColumn'>Local Area<span class='mandatory' id='spnmanlocalarea'></span></th>");
                    strTbl.Append("<th id='thPin' class='cls_DisplayColumn'>PIN Code<span class='mandatory' id='spnmanpin'></span></th>");
                    strTbl.Append("<th id='thplaceType' class='cls_DisplayColumn'>Med.Council<span class='mandatory' id='spnmanplaceType'></span></th>");
                    strTbl.Append("<th id='thhospitalName' class='cls_DisplayColumn'>Hospital Name<span class='mandatory' id='spnmanhospital'></span></th>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</thead>");

                    strTbl.Append("<tbody>");
                    foreach (var doctorList in lstKYDCustomers)
                    {
                        strTbl.Append("<tr id='trRow_"+rowCount+"'>");
                        strTbl.Append("<input type='hidden' id='hdndoctordetails_" + rowCount + "' value='" + doctorList.Doctor_Code + "-" + doctorList.Doctor_Region_Code +"'/>");
                        //Doctor Name
                        strTbl.Append("<td>");
                        strTbl.Append(doctorList.Doctor_Name+'('+doctorList.MDL_Number+')');                       
                        strTbl.Append("</td>");                       
                        //Region Name
                        strTbl.Append("<td>");
                        strTbl.Append(doctorList.Region_Name);
                        strTbl.Append("</td>");
                        //Specialty
                        strTbl.Append("<td>");
                        strTbl.Append(doctorList.Speciality_Name);
                        strTbl.Append("</td>");
                        //Email Id
                        strTbl.Append("<td id='tdEmailid' class='cls_DisplayColumn clsEmailId'>");
                        strTbl.Append("<input type='text' id='txtEmailid_" + rowCount + "' data='chkempty_" + rowCount + "' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Email_Id + "'/>");
                        strTbl.Append("</td>");
                        //Registration No
                        strTbl.Append("<td id='tdRegistration' class='cls_DisplayColumn clsRegistration'>");
                        strTbl.Append("<input type='text' id='txtRegistration_" + rowCount + "' data='chkempty_"+rowCount+"' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Registration_No + "'/>");
                        strTbl.Append("</td>");
                        //Mobile No
                        strTbl.Append("<td id='tdMobileNo' class='cls_DisplayColumn clsMobileno'>");
                        strTbl.Append("<input type='text' id='txtMobile_" + rowCount + "' data='chkempty_" + rowCount + "' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Mobile + "'/>");
                        strTbl.Append("</td>");
                        //Local Area
                        strTbl.Append("<td id='tdLocalarea' class='cls_DisplayColumn clsLocalArea'>");
                        strTbl.Append("<input type='text' id='txtLocalArea_" + rowCount + "' data='chkempty_" + rowCount + "'  class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Local_Area + "'/>");
                        strTbl.Append("</td>");    
                        //PIN Code
                        strTbl.Append("<td id='tdPincode' class='cls_DisplayColumn clsPincode'>");
                        strTbl.Append("<input type='text' id='txtPincode_" + rowCount + "' data='chkempty_" + rowCount + "' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Pin_Code + "'/>");
                        strTbl.Append("</td>");
                        //Place Type
                        strTbl.Append("<td id='tdPlacetype' class='cls_DisplayColumn clsPlaceType'>");
                        strTbl.Append("<input type='text' id='txtPlaceType_" + rowCount + "' data='chkempty_" + rowCount + "' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Medical_Council + "'/>");
                        strTbl.Append("</td>");                
                        //Hospital Name
                        strTbl.Append("<td id='tdHospitalName' class='cls_DisplayColumn clsHospitalName'>");
                        strTbl.Append("<input type='text' id='txtHospitalName_" + rowCount + "' data='chkempty_" + rowCount + "' class='form-control' onblur='fnRemoveIndication(this)' value='" + doctorList.Hospital_Name + "'/>");
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                        rowCount++;
                    }                   
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");

                    return strTbl.ToString();
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Retrieve the KYD List.
        /// </summary>
        /// <param name="dcrDate"></param>
        /// <param name="Key_Column"></param>
        /// <returns></returns>
        public List<KYDModel> GetKYDCustomerList(string dcrDate, string Key_Column)
        {
            try
            {
                // Creates instance.
                _blKYD = new BL_KYD();
                _objCurr = new CurrentInfo();

                string company_Code = _objCurr.GetCompanyCode();
                string user_Code = _objCurr.GetUserCode();

                // Reterievs the KYD Customer list.
                IEnumerable<KYDModel> IlstKYDCustomers = _blKYD.GetKYDCustomerList(company_Code, user_Code, dcrDate, Key_Column);
                if (IlstKYDCustomers != null)
                {
                    List<KYDModel> lstKYDCustomers = IlstKYDCustomers.ToList();

                    return lstKYDCustomers;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Doctor Json List
        /// </summary>
        /// <param name="dcrDate"></param>
        /// <param name="Key_Column"></param>
        /// <returns></returns>
        public JsonResult GetKYDDoctorJsonList(string dcrDate, string Key_Column)
        {
            List<KYDModel> lstKYDCustomers = GetKYDCustomerList(dcrDate, Key_Column);
            if (lstKYDCustomers != null)
            {
                return Json(lstKYDCustomers);
            }
            return null;
        }
        /// <summary>
        /// Used to check if there is any duplicate value entered or not
        /// </summary>
        /// <param name="KYDDoctordetails_arr"></param>
        /// <param name="duplicateKeycolumn"></param>
        /// <returns></returns>
        public JsonResult DuplicateValidationOnKYD(string KYDDoctordetails_arr,string duplicateKeycolumn)
        {
            List<KYDModel> lstCheckDuplicationonKYD = new List<KYDModel>();
            _blKYD = new BL_KYD();
            _objCurr = new DataControl.CurrentInfo();
            try
            {
                lstCheckDuplicationonKYD = _blKYD.DuplicateValidationOnKYD(_objCurr.GetCompanyCode(), duplicateKeycolumn, KYDDoctordetails_arr, _objCurr.GetRegionCode()).ToList();

                return Json(lstCheckDuplicationonKYD);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Save Doctor List
        /// </summary>
        /// <param name="KYDDoctordetails_arr"></param>
        /// <param name="duplicateKeycolumn"></param>
        /// <returns></returns>
        public string SaveKYDInfo(string KYDDoctordetails_arr, string duplicateKeycolumn)
        {
            _blKYD = new BL_KYD();
            _objCurr = new DataControl.CurrentInfo();
            string result = string.Empty;
            try
            {
                result = _blKYD.SaveKYDInfo(_objCurr.GetCompanyCode(), duplicateKeycolumn, KYDDoctordetails_arr, _objCurr.GetRegionCode());
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("duplicateKeycolumn", duplicateKeycolumn);
                dicContext.Add("KYDDoctordetails_arr", KYDDoctordetails_arr);
                return ex.Message.ToString();
            }
        }

        #endregion KYD - Web

        #endregion Public Methods
    }
}
