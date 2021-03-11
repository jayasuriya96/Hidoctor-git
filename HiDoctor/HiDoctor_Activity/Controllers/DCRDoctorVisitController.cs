#region Usings
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
using HiDoctor_Activity.Models;
using System.Text;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
#endregion Usings

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRDoctorVisitController : Controller
    {
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private IConfigSettings IConfig_Settings = null;
        private int _totalListCount = 0;

        private const string CHEMIST_ENTITY = "CHEMIST";
        private const string DOCTOR_ENTITY = "DOCTOR";

        #endregion Private Variables

        #region Create
        public ActionResult Create(string Status, string flagRCPA, string accUsers, string cp, string tp, string dcrActualDate, string category, string travelledkms,
            string source, string flag, string codes, string doctorName)
        {
            ViewBag.Mode = "New";
            ViewBag.RCPA = flagRCPA;
            ViewBag.mQueryString = codes + "&" + dcrActualDate + "&" + accUsers + "&" + flagRCPA + "&" + doctorName + "&" + travelledkms;
            cp = cp.Replace('&', '~');
            ViewBag.QueryString = accUsers + "&" + cp + "&" + tp + "&" + dcrActualDate + "&" + Status + "&" + category + "&" + travelledkms + "&" + source + "&" + flag;

            // Get Config Values.
            ViewBag.DCR_ENTRY_TIME_GAP_VALUE = GetDCREntryTimeGapValue();
            ViewBag.DCR_DOCTOR_VISIT_TIME_ENTRY_MODE = GetDCRDoctorVisitTimeEntryMode();
            // Retrieve the Autofill Data.

            if (Status.ToUpper() == "1" && source.ToUpper() == "CALENDAR")
            {
                ViewBag.Mode = "New";
            }
            if (Status.ToUpper() == "1" && source.ToUpper() != "TAB_DOCTOR")
            {
                ViewBag.Mode = "New";
            }
            if (Status.ToUpper() == "1" && source.ToUpper() == "TAB_STOCKIEST")
            {
                ViewBag.Mode = "Edit";
            }
            if (Status.ToUpper() == "3" || Status == "0" || source.ToUpper() == "TAB_DOCTOR")
            {
                ViewBag.Mode = "Edit";
            }
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Create.Mobile");
            }
            else
            {
                return View();
            }
        }
        #endregion Create

        #region Private Methods
        
        /// <summary>
        /// Get Accompanist Regions. The privilege "SHOW_ACCOMPANIT_DATA" is mapped to relevant enttity type.
        /// This functions retrurns to the accompanist regions with ^ symbol. 
        /// </summary>
        /// <param name="accRegions"></param>
        /// <param name="showAccData"></param>
        /// <param name="entityType"></param>
        /// <param name="ownRegionCode"></param>
        /// <returns></returns>
        private string GetAccRegions(string accRegions, string showAccData, string entityType, string ownRegionCode)
        {
            string regionCodes = accRegions.Trim().Length > 0 ? accRegions + ownRegionCode + "^" : ownRegionCode + "^";
            string regions = string.Empty;
            int regionLength = 31;
            if (!showAccData.Trim().ToUpper().Contains(entityType))
            {
                regions = ownRegionCode + "^";
            }
            else
            {
                regions = regionCodes;
                regionLength = regionCodes.Length;
            }
            return regions;
        }


        private List<DCRProductDetailsModel> GetUserProducts(string searchWord, string prodBringType)
        {
            // Execute the Query and returns the DataSet.
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            DataSet dsProducts = _objSPData.GetSelectedProducts(companyCode, userCode, prodBringType, searchWord);
            List<DCRProductDetailsModel> lstProducts = new List<DCRProductDetailsModel>();
            if (dsProducts != null && dsProducts.Tables != null && dsProducts.Tables.Count > 0)
            {
                DataTable dtProducts = dsProducts.Tables[0];
                // Convert the DataTable to list.
                lstProducts = (from Products in dtProducts.AsEnumerable()
                               select new DCRProductDetailsModel
                               {
                                   label = Products["Product_Name"].ToString() + "(" + Products["Stock"].ToString() + ")",
                                   value = Products["Product_Code"].ToString(),
                                   Product_Code = Products["Product_Code"].ToString().Split('_')[0]
                               }).ToList<DCRProductDetailsModel>();
            }

            return lstProducts;
        }
        /// <summary>
        ///  Retruns doctor vist details as json.
        /// </summary>
        /// <param name="dsDoctorVisitData"></param>
        /// <param name="dsCPDoctors"></param>
        /// <returns></returns>
        private LargeJsonResult GetDoctorVisitJSON(DataSet dsDoctorVisitData, DataSet dsCPDoctors, string dcrActualDate)
        {
            DataTable dtDoctorVisitData = null;
            DataTable dtProductDetails = null;
            DataTable dtChemistDetails = null;
            DataTable dtRCPADetails = null;
            DataTable dtProductAutoFill = null;
            string saleProductCodes = "";
            if (dsDoctorVisitData != null && dsDoctorVisitData.Tables.Count > 0 && dsDoctorVisitData.Tables[0] != null)
            {
                dtDoctorVisitData = dsDoctorVisitData.Tables[0];
            }
            if (dsDoctorVisitData != null && dsDoctorVisitData.Tables.Count > 0 && dsDoctorVisitData.Tables[1] != null)
            {
                dtProductDetails = dsDoctorVisitData.Tables[1];
            }
            if (dsDoctorVisitData != null && dsDoctorVisitData.Tables.Count > 0 && dsDoctorVisitData.Tables[2] != null)
            {
                dtChemistDetails = dsDoctorVisitData.Tables[2];
            }

            if (dsDoctorVisitData != null && dsDoctorVisitData.Tables.Count > 0 && dsDoctorVisitData.Tables[3] != null)
            {
                dtRCPADetails = dsDoctorVisitData.Tables[3];
            }
            if (dsDoctorVisitData != null && dsDoctorVisitData.Tables.Count > 0 && dsDoctorVisitData.Tables.Count == 5 && dsDoctorVisitData.Tables[4] != null)
            {
                dtProductAutoFill = dsDoctorVisitData.Tables[4];
            }

            int totalCount = 0;

            List<JsonResult> lstDoctorVisitData = new List<JsonResult>();

            // Convert the DataTable to list.
            List<DCRDoctorVisitModel> lstDoctorVisit = (from Doctor_Visit_Data in dtDoctorVisitData.AsEnumerable()
                                                        select new DCRDoctorVisitModel
                                                        {
                                                            Doctor_Visit_Code = Doctor_Visit_Data["DCR_Visit_Code"].ToString(),
                                                            Doctor_Name = Doctor_Visit_Data["Doctor_Name"].ToString() + "_" + Doctor_Visit_Data["MDL"].ToString() + "_" + Doctor_Visit_Data["Speciality_Name"].ToString() + "_" + Doctor_Visit_Data["Region_Name"].ToString(),
                                                            Doctor_Code = Doctor_Visit_Data["Doctor_Code"].ToString(),
                                                            //Speciality_Code = Doctor_Visit_Data["Speciality_Code"].ToString(),
                                                            Speciality_Name = Doctor_Visit_Data["Speciality_Name"].ToString(),
                                                            POB_Amount = Doctor_Visit_Data["PO_Amount"].ToString(),
                                                            Doctor_Visit_Time = Doctor_Visit_Data["Doctor_Visit_Time"].ToString(),
                                                            Visit_Mode = Doctor_Visit_Data["Visit_Mode"].ToString(),
                                                            Is_CPDoc = Doctor_Visit_Data["Is_CP_Doc"].ToString(),
                                                            Remarks = Doctor_Visit_Data["Remarks_By_User"].ToString(),
                                                            Doctor_Region_Code = Doctor_Visit_Data["Doctor_Region_Code"].ToString(),
                                                            Unique_Doctor_Code = Doctor_Visit_Data["Doctor_Code"].ToString() + "_" + Doctor_Visit_Data["Doctor_Region_Code"].ToString()
                                                        }).ToList<DCRDoctorVisitModel>();

            List<DCRDoctorVisitModel> lstCPDoctors = new List<DCRDoctorVisitModel>();
            if (dsCPDoctors.Tables != null && dsCPDoctors.Tables.Count > 0 && dsCPDoctors.Tables[0].Rows != null && dsCPDoctors.Tables[0].Rows.Count > 0)
            {
                DataTable dtCPDoctors = dsCPDoctors.Tables[0];

                // Convert the DataTable to list.
                lstCPDoctors = (from cp_doctors in dtCPDoctors.AsEnumerable()
                                select new DCRDoctorVisitModel
                                {
                                    Doctor_Name = cp_doctors["Doctor_Name"].ToString() + "_" + cp_doctors["MDL"].ToString() + "_" + cp_doctors["Speciality_Name"].ToString() + "_" + cp_doctors["Region_Name"].ToString(),
                                    Doctor_Code = cp_doctors["Doctor_Code"].ToString(),
                                    //Speciality_Code = Doctor_Visit_Data["Speciality_Code"].ToString(),
                                    Is_CPDoc = "1",
                                    Speciality_Name = cp_doctors["Speciality_Name"].ToString(),
                                    Doctor_Region_Code = cp_doctors["Doctor_Region_Code"].ToString(),
                                    Unique_Doctor_Code = cp_doctors["Doctor_Code"].ToString() + "_" + cp_doctors["Doctor_Region_Code"].ToString()
                                }).ToList<DCRDoctorVisitModel>();
            }

            IEnumerable<DCRDoctorVisitModel> IlstDoctorVisit = lstDoctorVisit.Union(lstCPDoctors, new DoctorVisitDoctorCodeComparer());
            lstDoctorVisitData.Add(Json(IlstDoctorVisit));

            // Convert the DataTable to list.
            List<DCRProductDetailsModel> lstProductDetails = (from Product_Details in dtProductDetails.AsEnumerable()
                                                              select new DCRProductDetailsModel
                                                              {
                                                                  DCR_Visit_Code = Product_Details["DCR_Visit_Code"].ToString(),
                                                                  DCR_Product_Code = Product_Details["DCR_Product_Code"].ToString(),
                                                                  Product_Name = Product_Details["Product_Name"].ToString(),
                                                                  Product_Code = Product_Details["Product_Code"].ToString(),
                                                                  //Speciality_Code = Product_Details["Speciality_Code"].ToString(),
                                                                  Quantity_Provided = Product_Details["Quantity_Provided"].ToString(),
                                                                  Is_Detailed = Product_Details["Is_Detailed"].ToString(),
                                                                  Doctor_Code = Product_Details["Doctor_Code"].ToString(),
                                                                  Doctor_Region_Code = Product_Details["Doctor_Region_Code"].ToString(),
                                                                  Unique_Doctor_Code = Product_Details["Doctor_Code"].ToString() + "_" + Product_Details["Doctor_Region_Code"].ToString(),
                                                                  Current_Stock = Product_Details["Current_Stock"].ToString()
                                                              }).ToList<DCRProductDetailsModel>();
            List<DCRProductDetailsModel> lstTPProductDetails = new List<DCRProductDetailsModel>();
            if (dsCPDoctors.Tables.Count == 2)
            {
                DataTable dtTPProducts = dsCPDoctors.Tables[1];
                // Convert the DataTable to list.

                lstTPProductDetails = (from Product_Details in dtTPProducts.AsEnumerable()
                                       select new DCRProductDetailsModel
                                       {
                                           Doctor_Code = Product_Details["Doctor_Code"].ToString(),
                                           Product_Name = Product_Details["Product_Name"].ToString(),
                                           Product_Code = Product_Details["Product_Code"].ToString(),
                                           //Speciality_Code = Product_Details["Speciality_Code"].ToString(),
                                           Quantity_Provided = Product_Details["Quantity_Provided"].ToString(),
                                           Doctor_Region_Code = Product_Details["Doctor_Region_Code"].ToString(),
                                           Unique_Doctor_Code = Product_Details["Doctor_Code"].ToString() + "_" + Product_Details["Doctor_Region_Code"].ToString(),
                                           Current_Stock = Product_Details["Current_Stock"].ToString()
                                       }).ToList<DCRProductDetailsModel>();
            }

            IEnumerable<DCRProductDetailsModel> IlstDoctorProductDetails = lstProductDetails.Union(lstTPProductDetails);
            lstDoctorVisitData.Add(Json(IlstDoctorProductDetails));

            // Convert the DataTable to list.
            List<DCRChemistVisitModel> lstChemistVisit = (from Chemist_Visit_Data in dtChemistDetails.AsEnumerable()
                                                          select new DCRChemistVisitModel
                                                          {
                                                              DCR_Visit_Code = Chemist_Visit_Data["DCR_Visit_Code"].ToString(),
                                                              DCR_Chemists_Code = Chemist_Visit_Data["DCR_Chemists_Code"].ToString(),
                                                              Chemist_Name = Chemist_Visit_Data["Chemists_Name"].ToString(),
                                                              Chemist_Code = Chemist_Visit_Data["Chemist_Code"].ToString(),
                                                              POB_Amount = Chemist_Visit_Data["PO_Amount"].ToString()
                                                          }).ToList<DCRChemistVisitModel>();
            // returns the list.
            lstDoctorVisitData.Add(Json(lstChemistVisit));
            totalCount += lstChemistVisit.Count;

            if (dtRCPADetails != null)
            {
                // Convert the DataTable to list.
                List<DCRRCPADetailsModel> lstRCPADetails = (from RCPA_Data in dtRCPADetails.AsEnumerable()
                                                            select new DCRRCPADetailsModel
                                                            {
                                                                DCR_Visit_Code = RCPA_Data["DCR_Visit_Code"].ToString(),
                                                                DCR_Product_Code = RCPA_Data["DCR_Product_Code"].ToString(),
                                                                Product_Name = RCPA_Data["Product_Name"].ToString(),
                                                                Chemist_Visit_Code = RCPA_Data["Chemist_Visit_Code"].ToString(),
                                                                Product_Code = RCPA_Data["Product_Code"].ToString(),
                                                                Competitor_Product_Name = RCPA_Data["Competitor_Product_Name"].ToString(),
                                                                Suuport_Qty = RCPA_Data["Support_Qty"].ToString(),
                                                                DCR_RCPA_Code = RCPA_Data["DCR_RCPA_Code"].ToString(),
                                                                Competitor_Product_Code = RCPA_Data["Competitor_Product_Code"].ToString(),
                                                            }).ToList<DCRRCPADetailsModel>();

                lstDoctorVisitData.Add(Json(lstRCPADetails));
                foreach (DCRRCPADetailsModel rcpa in lstRCPADetails)
                {
                    saleProductCodes += rcpa.Product_Code + "^";
                }

                totalCount += lstRCPADetails.Count;
            }

            //returns the list.
            //return Json(lstDoctorVisitData, JsonRequestBehavior.AllowGet);
            if (saleProductCodes.Length > 0)
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string Region_Code = _objcurrentInfo.GetRegionCode();
                DataSet ds = _objSPData.GetCompetitors(companyCode, Region_Code, dcrActualDate, saleProductCodes);
                List<DCRProductDetailsModel> lstProducts = (from Products in dtProductAutoFill.AsEnumerable()
                                                            select new DCRProductDetailsModel
                                                            {
                                                                label = Products["Product_Name"].ToString(),
                                                                value = Products["Product_Code"].ToString(),
                                                                Product_Code = Products["Sales_Product_Code"].ToString()
                                                            }).ToList<DCRProductDetailsModel>();
                //JsonResult Comp = GetCompetitorsName(companyCode, Region_Code, dcrActualDate, saleProductCodes);
                lstDoctorVisitData.Add(Json(lstProducts));
            }
            else
            {
                JsonResult Comp = new JsonResult();
                lstDoctorVisitData.Add(Comp);
            }
            //returns the list.
            //return Json(lstDoctorVisitData, JsonRequestBehavior.AllowGet);

            // Convert the DataTable to list.
            if (dtProductAutoFill != null)
            {
                List<DCRProductDetailsModel> lstProducts = (from Products in dtProductAutoFill.AsEnumerable()
                                                            select new DCRProductDetailsModel
                                                            {
                                                                label = Products["Product_Name"].ToString() + "(" + Products["Stock"].ToString() + ")",
                                                                value = Products["Product_Code"].ToString(),
                                                                Product_Code = Products["Product_Code"].ToString().Split('_')[0]
                                                            }).ToList<DCRProductDetailsModel>();
                // returns the list.
                lstDoctorVisitData.Add(Json(lstProducts, JsonRequestBehavior.AllowGet));
                totalCount += lstProducts.Count;
            }

            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = totalCount,
                    Data = lstDoctorVisitData
                }
            };
        }

        private string GetDCREntryTimeGapValue()
        {
            IConfig_Settings = new Config_Settings();
            string companyCode = _objcurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrTimeGapValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_ENTRY_TIME_GAP);

            // Returns the dcrTimeGapValue.
            return dcrTimeGapValue; 
        }

        private string GetDCRDoctorVisitTimeEntryMode()
        {
            IConfig_Settings = new Config_Settings();
            string companyCode = _objcurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrDoctorVisitTimeEntryModeValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_DOCTOR_VISIT_TIME_ENTRY_MODE);

            // Returns the dcrTimeGapValue.
            return dcrDoctorVisitTimeEntryModeValue; 
        }
        #endregion Private Methods

        #region Public Methods
        /// <summary>
        /// Insert a doctor visit data. Doctor details, Products details, chemists details and RCPA details.
        /// if source of entry is WEB we do retruns the doctor visit JSON(Doctor details, product details, chemist details, RCPA Details).
        /// if source of entry is MOBILE we do returns the empty JSON result.
        /// </summary>
        /// <param name="dcrVisitCode"></param>
        /// <param name="dcrActualDate"></param>
        /// <param name="doctor"></param>
        /// <param name="products"></param>
        /// <param name="chemists"></param>
        /// <param name="rcpa"></param>
        /// <param name="rcpaFlag"></param>
        /// <param name="prodBringType"></param>
        /// <param name="sourceOfEntry"></param>
        /// <returns></returns>
        public JsonResult InsertDCRDoctorVisitData(string dcrVisitCode, string dcrActualDate, string doctor, string products, string chemists, string rcpa, string rcpaFlag, string prodBringType, string sourceOfEntry)
        {
            string regionCode = _objcurrentInfo.GetRegionCode();
            object result = _objSPData.InsertDCRDoctorVisitData(dcrVisitCode, dcrActualDate, doctor, products, chemists, rcpa, rcpaFlag, regionCode, prodBringType);

            if (result.GetType() == typeof(string))
            {
                return Json("Error:" + result);
            }
            else
            {
                if (sourceOfEntry == "WEB")
                {
                    DataSet dsCPDoctors = new DataSet();
                    return GetDoctorVisitJSON((DataSet)result, dsCPDoctors, dcrActualDate);
                }
                else
                {
                    JsonResult json = new JsonResult();
                    return json;
                }
            }
        }

        /// <summary>
        /// we retrieves the master details relevant region or user like Doctors, Products and chemists.
        /// </summary>
        /// <param name="accRegions"></param>
        /// <param name="accChemist"></param>
        /// <param name="ProdBringType"></param>
        /// <returns></returns>
        public LargeJsonResult SetAutofillViewBag(string accRegions, string accChemist, string ProdBringType)
        {
            List<JsonResult> lstJSON = new List<JsonResult>();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();

            JsonResult doctorJSON = GetDoctors(accRegions, accChemist);
            JsonResult chemistJSON = GetChemists(string.Empty, accChemist, accRegions);
            JsonResult productJSON = GetProducts(string.Empty, ProdBringType);
            JsonResult specialityJSON = GetSpeciality();
            JsonResult saleProductJSON = GetSaleProducts(string.Empty);
            lstJSON.Add(doctorJSON);
            lstJSON.Add(chemistJSON);
            lstJSON.Add(productJSON);
            lstJSON.Add(saleProductJSON);
            lstJSON.Add(specialityJSON);

            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = _totalListCount,
                    Data = lstJSON
                }
            };
        }

        /// <summary>
        /// Retrives the TP or CP Doctors.
        /// </summary>
        /// <param name="tpname"></param>
        /// <param name="cpname"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public JsonResult GetCPDoctors(string tpname, string cpname, string month, string year)
        {
            cpname = cpname.Replace('~', '&');
            List<JsonResult> lstJsonResult = new List<JsonResult>();
            string userCode = _objcurrentInfo.GetUserCode();

            DataSet dsCPDoctors = _objSPData.GetCPDoctors(tpname, cpname, userCode, month, year);

            List<DCRDoctorVisitModel> lstDoctorVisit = new List<DCRDoctorVisitModel>();
            List<DCRProductDetailsModel> lstProductDetails = new List<DCRProductDetailsModel>();
            List<DCRChemistVisitModel> lstChemistDetails = new List<DCRChemistVisitModel>();
            List<DCRRCPADetailsModel> lstRCPADetails = new List<DCRRCPADetailsModel>();
            if (dsCPDoctors.Tables != null && dsCPDoctors.Tables.Count > 0 && dsCPDoctors.Tables[0].Rows != null && dsCPDoctors.Tables[0].Rows.Count > 0)
            {
                DataTable dtCPDoctors = dsCPDoctors.Tables[0];

                // Convert the DataTable to list.
                lstDoctorVisit = (from cp_doctors in dtCPDoctors.AsEnumerable()
                                  select new DCRDoctorVisitModel
                                  {
                                      Doctor_Name = cp_doctors["Doctor_Name"].ToString() + "_" + cp_doctors["MDL"].ToString() + "_" + cp_doctors["Speciality_Name"].ToString() + "_" + cp_doctors["Region_Name"].ToString(),
                                      Doctor_Code = cp_doctors["Doctor_Code"].ToString(),
                                      //Speciality_Code = Doctor_Visit_Data["Speciality_Code"].ToString(),
                                      Is_CPDoc = "1",
                                      Speciality_Name = cp_doctors["Speciality_Name"].ToString(),
                                      Doctor_Region_Code = cp_doctors["Doctor_Region_Code"].ToString(),
                                      Unique_Doctor_Code = cp_doctors["Doctor_Code"].ToString() + "_" + cp_doctors["Doctor_Region_Code"].ToString()
                                  }).ToList<DCRDoctorVisitModel>();
                if (dsCPDoctors.Tables.Count == 2)
                {
                    DataTable dtTPProducts = dsCPDoctors.Tables[1];
                    // Convert the DataTable to list.
                    lstProductDetails = (from Product_Details in dtTPProducts.AsEnumerable()
                                         select new DCRProductDetailsModel
                                         {
                                             Doctor_Code = Product_Details["Doctor_Code"].ToString(),
                                             Product_Name = Product_Details["Product_Name"].ToString(),
                                             Product_Code = Product_Details["Product_Code"].ToString(),
                                             //Speciality_Code = Product_Details["Speciality_Code"].ToString(),
                                             Quantity_Provided = Product_Details["Quantity_Provided"].ToString(),
                                             Doctor_Region_Code = Product_Details["Doctor_Region_Code"].ToString(),
                                             Unique_Doctor_Code = Product_Details["Doctor_Code"].ToString() + "_" + Product_Details["Doctor_Region_Code"].ToString()
                                         }).ToList<DCRProductDetailsModel>();
                }

                lstJsonResult.Add(Json(lstDoctorVisit));
                lstJsonResult.Add(Json(lstProductDetails));
                lstJsonResult.Add(Json(lstChemistDetails));
                lstJsonResult.Add(Json(lstRCPADetails));
            }
            return Json(lstJsonResult);
        }

        /// <summary>
        /// Retrives the Doctor visit Details. Doctor, Product, Chemist and RCPA details for a date and user.
        /// </summary>
        /// <param name="dcrActualDate"></param>
        /// <param name="tpname"></param>
        /// <param name="cpname"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public JsonResult GetDoctorVisitData(string dcrActualDate, string tpname, string cpname, string month, string year)
        {
            DataSet dsDoctorVisitData = _objSPData.GetDoctorVisitData(dcrActualDate);
            string userCode = _objcurrentInfo.GetUserCode();
            cpname = cpname == "0" ? "" : cpname;
            DataSet dsCPDoctors = _objSPData.GetCPDoctors(tpname, cpname, userCode, month, year);
            List<DCRDoctorVisitModel> lstDoctorVisit = new List<DCRDoctorVisitModel>();
            List<DCRProductDetailsModel> lstProductDetails = new List<DCRProductDetailsModel>();
            return GetDoctorVisitJSON(dsDoctorVisitData, dsCPDoctors, dcrActualDate);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dvcode"></param>
        /// <param name="dcrActualDate"></param>
        /// <param name="prodBringType"></param>
        /// <returns></returns>
        public JsonResult DeleteDoctorVisitData(string dvcode, string dcrActualDate, string prodBringType)
        {
            string userCode = _objcurrentInfo.GetUserCode();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet dsProducts = new DataSet();
            string result = _objSPData.DeleteDoctorVisitData(dvcode, dcrActualDate);
            List<DCRProductDetailsModel> lstProducts = new List<DCRProductDetailsModel>();

            if (result.ToUpper() == "SUCCESS")
            {
                // Execute the Query and returns the DataSet.
                dsProducts = _objSPData.GetSelectedProducts(companyCode, userCode, prodBringType, "");
                DataTable dtProducts = dsProducts.Tables[0];

                // Convert the DataTable to list.
                lstProducts = (from Products in dtProducts.AsEnumerable()
                               select new DCRProductDetailsModel
                               {
                                   label = Products["Product_Name"].ToString() + "(" + Products["Stock"].ToString() + ")",
                                   value = Products["Product_Code"].ToString(),
                                   Product_Code = Products["Product_Code"].ToString().Split('_')[0]
                               }).ToList<DCRProductDetailsModel>();
                // returns the list.
            }
            //return Json(lstProducts, JsonRequestBehavior.AllowGet);

            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstProducts.Count,
                    Data = lstProducts
                }
            };
        }

        /// <summary>
        /// Delete Doctor Visit Data All to a date. including doctor, product, chemist and RCPA.
        /// </summary>
        /// <param name="dcractualDate"></param>
        /// <returns></returns>
        public string DeleteDoctorVisitDataAll(string dcractualDate)
        {
            string dcrCode = _objcurrentInfo.GetDCRCode(dcractualDate);
            string result = _objSPData.DeleteDoctorVisitDataAll(dcrCode);
            return result;
        }

        public string CheckQuantity(string dcrActualDate)
        {
            string dcrCode = _objcurrentInfo.GetDCRCode(dcrActualDate);
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string result = _objSPData.CheckQuantity(companyCode, dcrCode, userCode, dcrActualDate, regionCode);
            return result;
        }

        /// <summary>
        /// Retrives the selected doctor visit data using primary keys.
        /// </summary>
        /// <param name="dvCode"></param>
        /// <param name="pdCodes"></param>
        /// <param name="cvCodes"></param>
        /// <param name="rdCodes"></param>
        /// <param name="dcrActualDate"></param>
        /// <returns></returns>
        public JsonResult GetSelectedDoctorVisitDetails(string dvCode, string pdCodes, string cvCodes, string rdCodes,
            string dcrActualDate)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string dcrCode = _objcurrentInfo.GetDCRCode(dcrActualDate);
            DataSet ds = _objSPData.GetSelectedDoctorVisitData(companyCode, userCode, dcrCode, dvCode, dcrActualDate,
                pdCodes, cvCodes, rdCodes);
            return GetDoctorVisitJSON(ds, new DataSet(), dcrActualDate);
        }
        public JsonResult GetSalesCompetitors(string DcrActualDate)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string Region_Code = _objcurrentInfo.GetRegionCode();           

            return Json(_objSPData.GetSalesCompetitors(companyCode, Region_Code, DcrActualDate));
        }

        /// <summary>
        /// Retrievs the competitor names for a sale products.
        /// </summary>
        /// <param name="saleproductcode"></param>
        /// <returns></returns>
        public JsonResult GetCompetitorsName(string saleproductcode, string dcrActualDate)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string Region_Code = _objcurrentInfo.GetRegionCode();
            DataSet ds = _objSPData.GetCompetitors(companyCode, Region_Code, dcrActualDate, saleproductcode);
            DataTable dtProductAutoFill = ds.Tables[0];
            List<DCRProductDetailsModel> lstProducts = (from Products in dtProductAutoFill.AsEnumerable()
                                                        select new DCRProductDetailsModel
                                                        {
                                                            label = Products["Product_Name"].ToString(),
                                                            value = Products["Product_Code"].ToString(),
                                                            Product_Code = Products["Sales_Product_Code"].ToString()
                                                        }).ToList<DCRProductDetailsModel>();
            return Json(lstProducts);
        }

        /// <summary>
        /// Retrieves the products for a user based on PRODUCT_BRING_TYPE privilege.
        /// searchWord is empty, retruns all products for a given user.
        /// searchWord parameter length is > 0, retruns relevent products.
        /// </summary>
        /// <param name="searchWord"></param>
        /// <param name="prodBringType"></param>
        /// <returns></returns>
        public JsonResult GetProducts(string searchWord, string prodBringType)
        {
            List<DCRProductDetailsModel> lstProducts = new List<DCRProductDetailsModel>();
            lstProducts = GetUserProducts(searchWord, prodBringType);
            _totalListCount += lstProducts.Count;
            return Json(lstProducts, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrieves the Doctors for given regions.
        /// </summary>
        /// <param name="accRegions"></param>
        /// <param name="showAccData"></param>
        /// <returns></returns>
        public JsonResult GetDoctors(string accRegions, string showAccData)
        {
            List<DCRDoctorVisitModel> lstDoctor = new List<DCRDoctorVisitModel>();
            DataSet dsDoctors = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string regions = GetAccRegions(accRegions, showAccData, DOCTOR_ENTITY, regionCode);

            // Execute the Query and returns the DataSet.
            dsDoctors = _objSPData.GetSelectedDoctors(companyCode, regions, regionCode,"","");

            if (dsDoctors != null && dsDoctors.Tables != null && dsDoctors.Tables.Count > 0)
            {
                DataTable dtDoctors = dsDoctors.Tables[0];

                // Convert the DataTable to list.
                lstDoctor = (from Doctor in dtDoctors.AsEnumerable()
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

            }
            _totalListCount += lstDoctor.Count;
            return Json(lstDoctor, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Reterives the all specialties.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetSpeciality()
        {
            List<DCRDoctorVisitModel> lstSpeciality = new List<DCRDoctorVisitModel>();
            DataSet dsSpeciality = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();

            // Execute the Query and returns the DataSet.
            dsSpeciality = _objSPData.GetSpeciality(companyCode, userCode);
            if (dsSpeciality != null && dsSpeciality.Tables != null && dsSpeciality.Tables.Count > 0)
            {
                DataTable dtSpeciality = dsSpeciality.Tables[0];
                // Convert the DataTable to list.
                lstSpeciality = (from Speciality in dtSpeciality.AsEnumerable()
                                 select new DCRDoctorVisitModel
                                 {
                                     label = Speciality["Speciality_Name"].ToString(),
                                     value = Speciality["Speciality_Code"].ToString()
                                 }).ToList<DCRDoctorVisitModel>();
            }
            _totalListCount += lstSpeciality.Count;
            return Json(lstSpeciality, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrives the chemists for given regions.
        /// searchWord parameter is empty, returns all chemist.
        /// searchWord parameter length > 0, returns relevant chemists.
        /// </summary>
        /// <param name="searchWord"></param>
        /// <param name="showAccChemist"></param>
        /// <param name="accRegions"></param>
        /// <returns></returns>
        public JsonResult GetChemists(string searchWord, string showAccChemist, string accRegions)
        {
            // Execute the Query and returns the DataSet.
            DataSet dsChemist = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string regions = GetAccRegions(accRegions, showAccChemist, CHEMIST_ENTITY, regionCode);
            List<DCRChemistVisitModel> lstChemist = new List<DCRChemistVisitModel>();

            // Call the DAL and Retrieves the DataSet.
            dsChemist = _objSPData.GetSelectedChemists(companyCode, regions, regionCode);

            // Convert the DataTable to list.
            if (dsChemist != null && dsChemist.Tables != null && dsChemist.Tables.Count > 0)
            {
                DataTable dtChemist = dsChemist.Tables[0];
                lstChemist = (from Chemists in dtChemist.AsEnumerable()
                                                         select new DCRChemistVisitModel
                                                         {
                                                             label = Chemists["Customer_Name"].ToString(),
                                                             value = Chemists["Customer_Code"].ToString(),
                                                             Is_Acc_Chemist = Chemists["Is_Acc_Chemist"].ToString()
                                                         }).ToList<DCRChemistVisitModel>();
            }
            // returns the list.
            _totalListCount += lstChemist.Count;
            return Json(lstChemist, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrives the company or division Sale Products.
        /// searchword parameter is empty, returns all sale products.
        /// searchword parameter length is >0, retruns the relevant products.
        /// </summary>
        /// <param name="searchword"></param>
        /// <returns></returns>
        public JsonResult GetSaleProducts(string searchword)
        {
            DataSet dsSaleProducts = new DataSet();

            // Execute the Query and returns the DataSet.
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetCompanyCode();
            dsSaleProducts = _objSPData.GetSaleProducts(companyCode, userCode);
            List<DCRProductDetailsModel> lstSaleProducts = new List<DCRProductDetailsModel>();
            if (dsSaleProducts != null && dsSaleProducts.Tables.Count > 0)
            {
                DataTable dtSaleProducts = dsSaleProducts.Tables[0];
                // Convert the DataTable to list.
                lstSaleProducts = (from Products in dtSaleProducts.AsEnumerable()
                                                                select new DCRProductDetailsModel
                                                                {
                                                                    label = Products["Product_Name"].ToString(),
                                                                    value = Products["Product_Code"].ToString()
                                                                }).ToList<DCRProductDetailsModel>();
            }
            // returns the list.
            _totalListCount = lstSaleProducts.Count;
            return Json(lstSaleProducts, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrieves the Doctors and Speciality given region.
        /// </summary>
        /// <param name="accRegions"></param>
        /// <param name="showAccData"></param>
        /// <returns></returns>
        public JsonResult GetDoctorsAndSpecialityM(string accRegions, string showAccData)
        {
            List<JsonResult> lstJSON = new List<JsonResult>();
            JsonResult doctorJSON = GetDoctors(accRegions, showAccData);
            JsonResult specialityJSON = GetSpeciality();
            JsonResult saleProductJSON = GetSaleProducts(string.Empty);
            lstJSON.Add(doctorJSON);
            lstJSON.Add(specialityJSON);
            lstJSON.Add(saleProductJSON);
            return Json(lstJSON);
        }

        public StringBuilder GetHTMLFormattedProductslist(string searchWord, string prodBringType)
        {
            int prIndex = 0;
            StringBuilder htmlFormattedProductsList = new StringBuilder();
            List<DCRProductDetailsModel> lstProducts = new List<DCRProductDetailsModel>();
            lstProducts = GetUserProducts(searchWord, prodBringType);
            
            foreach (DCRProductDetailsModel products in lstProducts)
            {
                htmlFormattedProductsList.Append("<li data-theme='c'><a href='#'  style='font-weight:normal; font-size:12px;' onclick=\"fnGetProduct('" + products.value + "','" + products.label + "', '" + prIndex.ToString() + "')\" id='prdname_" + prIndex.ToString() + "' data-transition='slide'>" + products.label + "</a></li>");
                prIndex++;
            }
            return htmlFormattedProductsList;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public string GetServerTime()
        {
            string timeString = DateTime.Now.ToShortTimeString();
            timeString = timeString.Split(':')[0].Length ==1 ? "0"+timeString:timeString;
            return timeString;
        }
        
        #endregion Public Methods
    }
}