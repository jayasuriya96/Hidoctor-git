using DataControl;
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl.Impl;
using Elmah;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4DoctorVisitController : Controller
    {
        //
        // GET: /DCRV4DoctorVisit/

        #region Private Variables
        private BL_DCRDoctorVisit _objBL_DCRDoctorVisit = null;
        private CurrentInfo _objCurrentInfo = null;
        private IConfigSettings IConfig_Settings = null;
        private int _WA_DATA_EXIST = 0;
        #endregion Private Variables

        public ActionResult Index(string Status, string flagRCPA, string accUsers, string cp, string tp, string dcrActualDate, string category, string travelledkms,
            string source, string flag, string codes, string doctorName, string tp_Code,string actvity)
        {
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("SurveyURL");
            ViewBag.Mode = "New";
            ViewBag.RCPA = flagRCPA;
            ViewBag.mQueryString = codes + "&" + dcrActualDate + "&" + accUsers + "&" + flagRCPA + "&" + doctorName + "&" + source + "&" + tp_Code;
            cp = cp.Replace('&', '~');
            ViewBag.QueryString = accUsers + "&" + cp + "&" + tp + "&" + dcrActualDate + "&" + Status + "&" + category + "&" + travelledkms + "&" + source + "&" + flag + "&" + codes;

            // Get Config Values.
            ViewBag.DCR_ENTRY_TIME_GAP_VALUE = GetDCREntryTimeGapValue();
            ViewBag.DCR_DOCTOR_VISIT_TIME_ENTRY_MODE = GetDCRDoctorVisitTimeEntryMode();
            ViewBag.DCR_CATEGORY_VISIT_COUNT_RESTRICTION = GetDCRCategoryVisitCountRestrictionConfigValue();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            ViewBag.RegionName = _objCurrentInfo.GetRegionName();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.accKey = accKey;
            ViewBag.activity = actvity;
            // Retrieve the Autofill Data.

            switch (Status)
            {
                case "1":
                    if (source.ToUpper() == "CALENDAR" || source.ToUpper() == "TAB_DOCTOR")
                    {
                        ViewBag.Mode = "New";
                    }
                    else if (source.ToUpper() == "TAB_STOCKIEST")
                    {
                        ViewBag.Mode = "Edit";
                    }
                    break;
                case "3":
                    if (source.ToUpper() == "CALENDAR" || source.ToUpper() == "TAB_DOCTOR")
                    {
                        ViewBag.Mode = "Edit";
                    }
                    break;
                case "0":
                    if (source.ToUpper() == "CALENDAR" || source.ToUpper() == "TAB_DOCTOR")
                    {
                        ViewBag.Mode = "Edit";
                    }
                    break;
                default:
                    break;
            }
            //Check Chemist Privilege
            DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit objBLDCRChemistVisit = new DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit();

            string userCode = "";
            ViewBag.ChemistsPrivilege = "";
            if (flag == "F")
                ViewBag.ChemistsPrivilege = objBLDCRChemistVisit.GetRegionModuleAccess(_objCurrentInfo.GetRegionCode(), userCode, flag);
            if (flag=="A")
            {
                ViewBag.ChemistsPrivilege = objBLDCRChemistVisit.GetRegionModuleAccess(_objCurrentInfo.GetRegionCode(), userCode, flag);
            }
            ViewBag.CONTACT = "";
            ViewBag.ACCOMPANIST = "";
            ViewBag.SAMPLES = "";
            ViewBag.DETAILING = "";
            ViewBag.RCPA_CV = "";
            ViewBag.ATTACHMENTS = "";
            ViewBag.FOLLOW = "";
            if (ViewBag.ChemistsPrivilege == "CHEMIST_DAY")
            {
                List<string> Chemist_Vist_Controls = new List<string>();
                Chemist_Vist_Controls = objBLDCRChemistVisit.GetChemistVistControls(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode());
                if (Chemist_Vist_Controls.Count() > 0)
                {
                    if (Chemist_Vist_Controls[0] == "YES")
                    {
                        ViewBag.CONTACT = "CONTACT";
                        ViewBag.ACCOMPANIST = "ACCOMPANIST";
                        ViewBag.SAMPLES = "SAMPLES";
                        ViewBag.DETAILING = "DETAILING";
                        ViewBag.RCPA_CV = "RCPA";
                        ViewBag.POB = "POB";
                        ViewBag.ATTACHMENTS = "ATTACHMENTS";
                        ViewBag.FOLLOW = "FOLLOW-UP";
                    }

                    else
                    {
                        foreach (string str in Chemist_Vist_Controls)
                        {
                            if (str == "CONTACT")
                            {
                                ViewBag.CONTACT = str;
                            }
                            else if (str == "ACCOMPANIST")
                            {
                                ViewBag.ACCOMPANIST = str;
                            }
                            else if (str == "SAMPLES")
                            {
                                ViewBag.SAMPLES = str;
                            }
                            else if (str == "DETAILING")
                            {
                                ViewBag.DETAILING = str;
                            }
                            else if (str == "RCPA")
                            {
                                ViewBag.RCPA_CV = str;
                            }
                            else if (str == "POB")
                            {
                                ViewBag.POB = str;
                            }
                            else if (str == "ATTACHMENTS")
                            {
                                ViewBag.ATTACHMENTS = str;
                            }
                            else if (str == "FOLLOW-UP")
                            {
                                ViewBag.FOLLOW = str;
                            }
                        }
                    }

                }
            }
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
        }

        public ActionResult DoctorAccompanistEntry(string DCR_Visit_Code, string docName)
        {
            ViewBag.DoctorName = docName;
            ViewBag.DCR_Visit_Code = DCR_Visit_Code;
            return View("DoctorAccompanistEntry.Mobile");


        }

        public ActionResult DetailedProductsEntry(string DCR_Visit_Code, string docName)
        {
            ViewBag.DoctorName = docName;
            return View("DetailedProductsEntry.Mobile");
            // return View();
        }

        public ActionResult ChemistVisitEntry(string DCR_Visit_Code, string docName)
        {
            ViewBag.DoctorName = docName;
            return View();
        }

        /// <summary>
        /// Called only from Mobile.
        /// </summary>
        /// <returns></returns>
        private string GetDCREntryTimeGapValue()
        {
            _objCurrentInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            string companyCode = _objCurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrTimeGapValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_ENTRY_TIME_GAP);

            // Returns the dcrTimeGapValue.
            return dcrTimeGapValue;
        }

        private string GetDCRDoctorVisitTimeEntryMode()
        {
            _objCurrentInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            string companyCode = _objCurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrDoctorVisitTimeEntryModeValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_DOCTOR_VISIT_TIME_ENTRY_MODE);

            // Returns the dcrTimeGapValue.
            return dcrDoctorVisitTimeEntryModeValue;
        }

        private string GetDCRCategoryVisitCountRestrictionConfigValue()
        {
            _objCurrentInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            string companyCode = _objCurrentInfo.GetCompanyCode();

            // Retrives the config value.
            string DCRCategoryVisitCountRestrictionValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_CATEGORY_VISIT_COUNT_RESTRICTION);

            // Returns config value.
            return DCRCategoryVisitCountRestrictionValue;
        }


        private int GetWADataExist(string company_Code, string DCR_Code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();

            return _objBL_DCRDoctorVisit.CheckWADataExist(company_Code, DCR_Code);
        }


        private string GetDoctorSufPreColumns(string company_Code)
        {
            IConfig_Settings = new Config_Settings();
            return IConfig_Settings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.DCR, CONFIG_KEY.DCR_DOCTOR_SUFIX_COLUMNS);

        }
        //[HttpGet]
        //[ActionName("GetProductName")]
        //public JsonResult GetProductName(string CompanyCode)
        //{
        //    try
        //    {

        //        return Json(_objBL_DCRDoctorVisit.GetProductName(CompanyCode), JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }


        //}

        /// <summary>
        /// Retrieves the Doctors list for autofill.
        /// </summary>
        /// <param name="acc_Regions"></param>
        /// <param name="showAccDataValue"></param>
        /// <returns></returns>
        public LargeJsonResult GetDoctorsList(string acc_Regions, string showAccDataValue, string dcrActualDate)
        {
            try
            {
                // Creates Instance.
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = null;
                LargeJsonResult doctorJson = null;

                // Retrieves the Session Values.
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string region_Code = _objCurrentInfo.GetRegionCode();

                string DoctorNameSufPreConfigValue = GetDoctorSufPreColumns(company_Code);

                // Call BL.
                lstDCRDoctorVisitModel = _objBL_DCRDoctorVisit.GetDoctorsList(company_Code, region_Code, acc_Regions, showAccDataValue, DoctorNameSufPreConfigValue, dcrActualDate);

                // returns the list.
                if (lstDCRDoctorVisitModel != null)
                {
                    doctorJson =
                            new LargeJsonResult
                            {
                                MaxJsonLength = Int32.MaxValue,
                                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                                Data = new
                                {
                                    total = lstDCRDoctorVisitModel.Count,
                                    Data = lstDCRDoctorVisitModel
                                }
                            };
                }
                return doctorJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Retrieves the Speciality list for autofill.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetSpecialityList()
        {
            try
            {
                // Creates Instance.
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = null;
                JsonResult specialityJson = null;

                // Retrieves the Session Values.
                string company_Code = _objCurrentInfo.GetCompanyCode();

                // Call BL.
                lstDCRDoctorVisitModel = _objBL_DCRDoctorVisit.GetSpecialityList(company_Code);

                // returns the list.
                if (lstDCRDoctorVisitModel != null)
                {
                    specialityJson = Json(lstDCRDoctorVisitModel);
                }
                return specialityJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Retrieves the Chemists list for autofill.
        /// </summary>
        /// <param name="acc_Regions"></param>
        /// <param name="showAccDataValue"></param>
        /// <returns></returns>
        public JsonResult GetChemistsList(string acc_Regions, string showAccDataValue)
        {
            try
            {
                List<DCRChemistVisitModel> lstDCRChemistsVisitModel;
                JsonResult chemistJson = null;
                GetChemists(acc_Regions, showAccDataValue, out lstDCRChemistsVisitModel);

                // returns the list.
                if (lstDCRChemistsVisitModel != null)
                {
                    chemistJson = Json(lstDCRChemistsVisitModel);
                }
                return chemistJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void GetChemists(string acc_Regions, string showAccDataValue, out List<DCRChemistVisitModel> lstDCRChemistsVisitModel)
        {
            // Creates Instance.
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            lstDCRChemistsVisitModel = null;

            // Retrieves the Session Values.
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string region_Code = _objCurrentInfo.GetRegionCode();

            // Call BL.
            lstDCRChemistsVisitModel = _objBL_DCRDoctorVisit.GetChemistsList(company_Code, region_Code, acc_Regions, showAccDataValue);
        }

        /// <summary>
        /// Retrieves the Sale Products list for autofill.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetSaleProductsList(string dcrActualDate)
        {
            try
            {
                // Creates Instance.
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
                JsonResult saleProductJson = new JsonResult();

                // Retrieves the Session Values.
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string user_Code = _objCurrentInfo.GetUserCode();

                // Call BL.
                lstDCRProductsDetailsModel = _objBL_DCRDoctorVisit.GetSaleProductsList(company_Code, user_Code, dcrActualDate);

                // returns the list.
                if (lstDCRProductsDetailsModel != null)
                {
                    saleProductJson = Json(lstDCRProductsDetailsModel);
                }
                return saleProductJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Retrieves the User Products list for autofill.
        /// </summary>
        /// <param name="prdBringType"></param>
        /// <param name="searchWord"></param>
        /// <returns></returns>
        public JsonResult GetUserProductsList(string prdBringType, string searchWord, string DCR_Date)
        {
            try
            {
                // Creates Instance.
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel;
                JsonResult userProductJson = null;
                GetUserProducts(prdBringType, searchWord, out lstDCRProductsDetailsModel, DCR_Date);

                // returns the list.
                if (lstDCRProductsDetailsModel != null)
                {
                    userProductJson = Json(lstDCRProductsDetailsModel);
                }
                return userProductJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void GetUserProducts(string prdBringType, string searchWord, out List<DCRProductDetailsModel> lstDCRProductsDetailsModel, string DCR_Date)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            lstDCRProductsDetailsModel = null;

            // Retrieves the Session Values.
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();

            // Call BL.
            lstDCRProductsDetailsModel = _objBL_DCRDoctorVisit.GetUserProductsList(company_Code, user_Code, prdBringType, searchWord, DCR_Date);
        }

        /// <summary>
        /// Retrieves the All Sale Products list for autofill.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetAllSaleProductsForDetails(DateTime dcrDate)
        {
            try
            {
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel;
                JsonResult saleProductsJson = null;
                GetDetailedProductsList(out lstDCRProductsDetailsModel, "", "", dcrDate, 0);

                // returns the list.
                if (lstDCRProductsDetailsModel != null)
                {
                    saleProductsJson = Json(lstDCRProductsDetailsModel);
                }
                return saleProductsJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetAllSaleProductsForDetailsWithColor(string Doc_Region_Code, string Doctor_code, DateTime dcrDate)
        {
            try
            {
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel;
                JsonResult saleProductsJson = null;
                GetDetailedProductsList(out lstDCRProductsDetailsModel, Doc_Region_Code, Doctor_code, dcrDate, 1);

                // returns the list.
                if (lstDCRProductsDetailsModel != null)
                {
                    lstDCRProductsDetailsModel = lstDCRProductsDetailsModel.OrderBy(x => x.ProductMappingType).ToList();
                    saleProductsJson = Json(lstDCRProductsDetailsModel);
                }
                return saleProductsJson;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private void GetDetailedProductsList(out List<DCRProductDetailsModel> lstDCRProductsDetailsModel, string Doc_Region_Code, string Doctor_code, DateTime dcrDate, int bring_Color_status)
        {
            // Creates Instance.
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            lstDCRProductsDetailsModel = null;


            // Retrieves the Session Values.
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string region_code = _objCurrentInfo.GetRegionCode();

            // Call BL.
            lstDCRProductsDetailsModel = _objBL_DCRDoctorVisit.GetAllNewSaleProductsForDetail(company_Code, region_code, Doc_Region_Code, Doctor_code, dcrDate, bring_Color_status);
        }

        public JsonResult checkColorPrivelegeForDetailedProdcutsPopup()
        {
            _objCurrentInfo = new CurrentInfo();
            BL_DCRDoctorVisit _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string usertypecode = _objCurrentInfo.GetUserTypeCode();
            List<VisitTimePrivValues> lstVisitTimePrivVal = new List<VisitTimePrivValues>();
            lstVisitTimePrivVal = _objBL_DCRDoctorVisit.checkColorPrivelegeForDetailedProdcutsPopup(companyCode, usertypecode).ToList();
            return Json(lstVisitTimePrivVal, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetDCRDoctorVisitMaxCodes(string DCR_Actual_Date)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = _objBL_DCRDoctorVisit.GetDCRDoctorVisitMaxCodes(company_Code, DCR_Code,
                user_Code, DCR_Actual_Date);
            return Json(objDCRDoctorVisitMaxCodes);
        }
        public DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodesList(string DCR_Actual_Date)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = _objBL_DCRDoctorVisit.GetDCRDoctorVisitMaxCodes(company_Code, DCR_Code,
                user_Code, DCR_Actual_Date);
            return objDCRDoctorVisitMaxCodes;
        }
        public JsonResult GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile(string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = _objBL_DCRDoctorVisit.GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile(company_Code, DCR_Code,
                user_Code, DCR_Actual_Date, DCR_Visit_Code);
            return Json(objDCRDoctorVisitMaxCodes);
        }

        /// <summary>
        /// Retrieve the Doctor Visit Data Per day.
        /// </summary>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="TP_Id"></param>
        /// <param name="CP_Code"></param>
        /// <returns></returns>
        public string GetDrAccMandatory(string DCR_Date)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            string Company_Code = _objCurrentInfo.GetCompanyCode();
            string User_Code = _objCurrentInfo.GetUserCode();

            return _objBL_DCRDoctorVisit.GetDrAccMandatory(Company_Code, User_Code, DCR_Date);
        }
        public JsonResult GetDoctorVisitDetailsPerDay(string DCR_Actual_Date, long TP_Id, string CP_Code, string request_From, string flag)
        {
            // Creates Instance
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            List<JsonResult> DCR_Doctor_Visit_Json = new List<JsonResult>();

            // Retrieve the Session Values.
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
            string region_Code = _objCurrentInfo.GetRegionCode();
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);

            CP_Code = CP_Code == "0" ? "" : CP_Code;

            // Retrieve the WA Data Exist.
            _WA_DATA_EXIST = GetWADataExist(company_Code, DCR_Code);

            string DoctorNameSufPreConfigValue = GetDoctorSufPreColumns(company_Code);
            // Doctor Visit.
            IEnumerable<DCRDoctorVisitModel> IDCRDoctorVisitList = _objBL_DCRDoctorVisit.GetDoctorVisitData(company_Code, DCR_Code,
               user_Code, DCR_Actual_Date, TP_Id, CP_Code, region_Code, _WA_DATA_EXIST, DoctorNameSufPreConfigValue, flag);
            DCR_Doctor_Visit_Json.Add(Json(IDCRDoctorVisitList));

            if (request_From != "MOBILE")
            {
                // Product Details.
                IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel = _objBL_DCRDoctorVisit.GetDCRProductsDetails(company_Code,
                    DCR_Code, user_Code, DCR_Actual_Date, TP_Id, _WA_DATA_EXIST, flag);
                DCR_Doctor_Visit_Json.Add(Json(IDCRProductDetailsModel));
            }

            if (request_From != "MOBILE")
            {
                // DCR Chemist visit.
                IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel = _objBL_DCRDoctorVisit.GetDCRChemistVisit(company_Code, DCR_Code, user_Code, DCR_Actual_Date, _WA_DATA_EXIST);
                DCR_Doctor_Visit_Json.Add(Json(IDCRChemistVisitModel));
            }



            if (request_From != "MOBILE")
            {
                // RCPA Detail.
                IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel = _objBL_DCRDoctorVisit.GetDCRRCPADetails(company_Code, DCR_Code, _WA_DATA_EXIST);
                DCR_Doctor_Visit_Json.Add(Json(IDCRRCPADetailsModel));
            }

            // Accompanist Detail.
            IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel = _objBL_DCRDoctorVisit.GetDCRDoctorAccompanist(company_Code, DCR_Code, _WA_DATA_EXIST);
            DCR_Doctor_Visit_Json.Add(Json(IDCRDoctorAccompanistModel));
            if (request_From != "MOBILE")
            {
                // Detailed Products.
                IEnumerable<DCRDetailedProductsModel> IDCRDetailProductsModel = _objBL_DCRDoctorVisit.GetDCRDetailedProducts(company_Code,
                    DCR_Code, _WA_DATA_EXIST);
                DCR_Doctor_Visit_Json.Add(Json(IDCRDetailProductsModel));
            }
            if (request_From != "MOBILE")
            {
                // Followup.
                IEnumerable<DCRFollowUp> IDDCRFollowUp = _objBL_DCRDoctorVisit.GetDCRFollowUp(user_Code, DCR_Actual_Date, company_Code);
                DCR_Doctor_Visit_Json.Add(Json(IDDCRFollowUp));
            }
            if (request_From != "MOBILE")
            {
                // Followup.
                IEnumerable<DCRDoctorVisitAttachment> IDDCRDoctorVisitAttachment = _objBL_DCRDoctorVisit.GetDCRDoctorVisitAttachment(user_Code, DCR_Actual_Date, company_Code);
                DCR_Doctor_Visit_Json.Add(Json(IDDCRDoctorVisitAttachment));
            }

            return Json(DCR_Doctor_Visit_Json);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DCRVisitCode"></param>
        /// <param name="DCRActualDate"></param>
        /// <param name="rcpaFlag"></param>
        /// <param name="doctorJson"></param>
        /// <param name="prodJson"></param>
        /// <param name="chemArrobj"></param>
        /// <param name="rcpaJson"></param>
        /// <param name="docAccJson"></param>
        /// <param name="detailprd"></param>
        /// <param name="doc_Max_Code"></param>
        /// <param name="doc_Acc_Max_Code"></param>
        /// <param name="inputs_Max_Code"></param>
        /// <param name="detailed_Max_Code"></param>
        /// <param name="chemist_Max_Code"></param>
        /// <param name="rcpa_Max_Code"></param>
        /// <returns></returns>
        public JsonResult InsertDCRDoctorVisitData(string DCRVisitCode, string DCRActualDate, string rcpaFlag, string doctorJson, string prodJson,
           string chemArrobj, string rcpaJson, string docAccJson, string detailprd, int doc_Max_Code, long doc_Acc_Max_Code, int inputs_Max_Code,
           long detailed_Max_Code, int chemist_Max_Code, int rcpa_Max_Code, string fllowJSON, string Attachment_Json, string InsertStockistJSON,
           string InsertSProductJSON, string Mode_Of_Form, int? business_Status_ID, string InsertActivityJSON, string CompProductJSONArray, string flag, string _objDateDetails,string CMETracking)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();

            DCRDoctorVisitInserHelperModel objDCRDoctorVisitInsertHelper = new DCRDoctorVisitInserHelperModel();
            DateCapturingModel _obDateDet = JsonConvert.DeserializeObject<DateCapturingModel>(_objDateDetails);
            if (!(_obDateDet.Off_Set.Contains('+') && !(_obDateDet.Off_Set.Contains('-'))))
            {
                _obDateDet.Off_Set = '+' + _obDateDet.Off_Set.Trim();
            }
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCRActualDate);
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
            string region_Code = _objCurrentInfo.GetRegionCode();
            string lattitude = _objCurrentInfo.GetLattitude();
            string location = _objCurrentInfo.GetLocation();
            string longitude = _objCurrentInfo.GetLongitude();

            objDCRDoctorVisitInsertHelper.Compnay_Code = company_Code;
            objDCRDoctorVisitInsertHelper.DCR_Code = DCR_Code;
            objDCRDoctorVisitInsertHelper.User_Code = user_Code;
            objDCRDoctorVisitInsertHelper.DCR_Actual_Date = DCRActualDate;
            objDCRDoctorVisitInsertHelper.Doctor_Visit_Code = DCRVisitCode;

            objDCRDoctorVisitInsertHelper.Doctor_Json = doctorJson;
            objDCRDoctorVisitInsertHelper.Doc_Acc_Json = docAccJson;
            objDCRDoctorVisitInsertHelper.Inputs_Json = prodJson;
            objDCRDoctorVisitInsertHelper.Detailed_Json = detailprd;
            objDCRDoctorVisitInsertHelper.Chemist_Json = chemArrobj;
            objDCRDoctorVisitInsertHelper.Fllow_Json = fllowJSON;
            objDCRDoctorVisitInsertHelper.Attachment_Json = Attachment_Json;
            objDCRDoctorVisitInsertHelper.StockistJSON = InsertStockistJSON;
            objDCRDoctorVisitInsertHelper.SalesProductsJSON = InsertSProductJSON;
            objDCRDoctorVisitInsertHelper.Mode_Of_Form = Mode_Of_Form;
            objDCRDoctorVisitInsertHelper.RCPA_Json = rcpaJson;
            objDCRDoctorVisitInsertHelper.CompProductJSON = CompProductJSONArray;
            objDCRDoctorVisitInsertHelper.Doctor_Vist_Max_Code = doc_Max_Code;
            objDCRDoctorVisitInsertHelper.Doc_Acc_Max_Code = 0;
            objDCRDoctorVisitInsertHelper.Inputs_Max_Code = inputs_Max_Code;
            objDCRDoctorVisitInsertHelper.Detailed_Max_Code = 0;
            objDCRDoctorVisitInsertHelper.Chemist_Max_Code = chemist_Max_Code;
            objDCRDoctorVisitInsertHelper.RCPA_Max_Code = rcpa_Max_Code;
            objDCRDoctorVisitInsertHelper.Lattitude = lattitude;
            objDCRDoctorVisitInsertHelper.Longtitude = longitude;
            objDCRDoctorVisitInsertHelper.Location = location;
            objDCRDoctorVisitInsertHelper.Region_Code = region_Code;
            objDCRDoctorVisitInsertHelper.Business_Status_ID = business_Status_ID;
            objDCRDoctorVisitInsertHelper.ActivityJSON = InsertActivityJSON;
            objDCRDoctorVisitInsertHelper.flag = flag;
            objDCRDoctorVisitInsertHelper.company_Id = Convert.ToInt32(_objCurrentInfo.GetCompanyId());
            objDCRDoctorVisitInsertHelper._ObjDateDetails = _obDateDet;
            objDCRDoctorVisitInsertHelper.CMETracking = CMETracking;
            objDCRDoctorVisitInsertHelper = _objBL_DCRDoctorVisit.InsertDoctorVisitData(objDCRDoctorVisitInsertHelper);
            return Json(objDCRDoctorVisitInsertHelper);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="doctor_Visit_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <returns></returns>
        public string DeleteDoctorVisitData(string doctor_Visit_Code, string DCR_Actual_Date, string flag)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string User_Code = _objCurrentInfo.GetUserCode();
            return _objBL_DCRDoctorVisit.DeleteDoctorVisitData(company_Code, DCR_Code, doctor_Visit_Code, User_Code, flag);
        }

        public StringBuilder GetHTMLFormattedProductslist(string prodBringType, string DCR_Date)
        {
            try
            {
                int prIndex = 0;
                StringBuilder htmlFormattedProductsList = new StringBuilder();
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
                GetUserProducts(prodBringType, string.Empty, out lstDCRProductsDetailsModel, DCR_Date);

                foreach (DCRProductDetailsModel products in lstDCRProductsDetailsModel)
                {
                    htmlFormattedProductsList.Append("<li data-theme='c'><a href='#'  style='font-weight:normal; font-size:12px;' onclick=\"fnGetProduct('" + products.value + "','" + products.label + "', '" + prIndex.ToString() + "')\" id='prdname_" + prIndex.ToString() + "' >" + products.label + "</a></li>");
                    prIndex++;
                }
                return htmlFormattedProductsList;
            }
            catch
            {
                throw;
            }
        }

        public StringBuilder GetChemistsHTMLFormatted(string searchWord, string showAccChemist, string accRegions)
        {
            try
            {
                int crIndex = 0;
                StringBuilder htmlFormattedChemistsList = new StringBuilder();
                List<DCRChemistVisitModel> lstDCRChemistsVisitModel = new List<DCRChemistVisitModel>();
                GetChemists(accRegions, showAccChemist, out lstDCRChemistsVisitModel);

                foreach (DCRChemistVisitModel chemists in lstDCRChemistsVisitModel)
                {
                    htmlFormattedChemistsList.Append("<li data-theme='c'><a href='#'  style='font-weight:normal; font-size:12px;' onclick=\"fnGetChemist('" + chemists.value + "','" + chemists.label + "', '" + crIndex.ToString() + "')\" id='chename_" + crIndex.ToString() + "' >" + chemists.label + "</a></li>");
                    crIndex++;
                }
                return htmlFormattedChemistsList;
            }
            catch
            {
                throw;
            }
        }

        public StringBuilder GetDetailedProductsHTMLFormatted()
        {
            try
            {
                int dprIndex = 0;
                StringBuilder htmlFormattedDetailedProductsList = new StringBuilder();
                List<DCRProductDetailsModel> lstDCRProductsDetailsModel;
                GetDetailedProductsList(out lstDCRProductsDetailsModel, "", "", DateTime.Now, 0);

                foreach (DCRProductDetailsModel detailedProducts in lstDCRProductsDetailsModel)
                {
                    htmlFormattedDetailedProductsList.Append("<li data-theme='c'><a href='#'  style='font-weight:normal; font-size:12px;' onclick=\"fnGetDetProd('" + detailedProducts.value + "','" + detailedProducts.label + "', '" + dprIndex.ToString() + "')\" id='detProdName_" + dprIndex.ToString() + "' >" + detailedProducts.label + "</a></li>");
                    dprIndex++;
                }
                return htmlFormattedDetailedProductsList;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public string GetServerTime()
        {
            string timeString = DateTime.Now.ToShortTimeString();
            timeString = timeString.Split(':')[0].Length == 1 ? "0" + timeString : timeString;
            return timeString;
        }

        public JsonResult GetDCRProductDetailsForADoctor(string DCR_Actual_Date, long TP_Id, string CP_Code, string DCR_Visit_Code, string Doctor_Comes_From)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel = null;

            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string user_Code = _objCurrentInfo.GetUserCode();
            string company_Code = _objCurrentInfo.GetCompanyCode();


            if (DCR_Visit_Code.Contains("ED"))
            {
                IDCRProductDetailsModel = _objBL_DCRDoctorVisit.GetDCREDProductsDetailsForADoctor(company_Code, DCR_Code, user_Code, DCR_Actual_Date, DCR_Visit_Code);
            }
            else
            {
                IDCRProductDetailsModel = _objBL_DCRDoctorVisit.GetDCRProductsDetailsForADoctor(company_Code, DCR_Code, user_Code, DCR_Actual_Date, TP_Id, DCR_Visit_Code);
            }


            return Json(IDCRProductDetailsModel);
        }

        public JsonResult GetDCRDoctorAccompanistForADoctor(string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();

            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string user_Code = _objCurrentInfo.
                GetUserCode();
            string company_Code = _objCurrentInfo.GetCompanyCode();


            IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanist = _objBL_DCRDoctorVisit.GetDCRDoctorAccompanistForADoctor(company_Code, DCR_Actual_Date, DCR_Code, DCR_Visit_Code, _WA_DATA_EXIST);

            return Json(IDCRDoctorAccompanist);
        }

        public string InsertDoctorAccompanist(string DCR_Actual_Date, string DCR_Visit_Code, string docAccJSON)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();

                string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
                //string user_Code = _objCurrentInfo.GetUserCode();
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string WA_Doctor_Visit_Code = "";
                return _objBL_DCRDoctorVisit.InsertDCRDoctorAccompanist(company_Code, DCR_Code, DCR_Visit_Code, docAccJSON, WA_Doctor_Visit_Code);
            }
            catch
            {
                throw;
            }
        }

        public string InsertDCRDetailedProducts(string DCR_Actual_Date, string DCR_Visit_Code, string detProdJSON)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();

                string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
                //string user_Code = _objCurrentInfo.GetUserCode();
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string WA_Doctor_Visit_Code = "";
                return _objBL_DCRDoctorVisit.InsertDCRDetailedProducts(company_Code, DCR_Code, DCR_Visit_Code, detProdJSON, WA_Doctor_Visit_Code);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetDCRDetailedProductsForADoctor(string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();

            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string user_Code = _objCurrentInfo.
                GetUserCode();
            string company_Code = _objCurrentInfo.GetCompanyCode();
            IEnumerable<DCRDetailedProductsModel> IDCRDetailedProducts = null;
            if (DCR_Visit_Code.Contains("ED"))
            {
                IDCRDetailedProducts = _objBL_DCRDoctorVisit.GetDCREDDetailedProductsForADoctor(company_Code, DCR_Code, DCR_Visit_Code);
            }
            else
            {
                IDCRDetailedProducts = _objBL_DCRDoctorVisit.GetDCRDetailedProductsForADoctor(company_Code, DCR_Code, DCR_Visit_Code);
            }

            return Json(IDCRDetailedProducts);
        }

        public JsonResult GetDCRChemistVisitForADoctor(string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            IEnumerable<DCRChemistVisitModel> IDCRChemistVisit = null;

            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string user_Code = _objCurrentInfo.GetUserCode();
            string company_Code = _objCurrentInfo.GetCompanyCode();

            if (DCR_Visit_Code.Contains("ED"))
            {
                IDCRChemistVisit = _objBL_DCRDoctorVisit.GetDCREDChemistVisitForADoctor(company_Code, DCR_Code, DCR_Visit_Code);
            }
            else
            {
                IDCRChemistVisit = _objBL_DCRDoctorVisit.GetDCRChemistVisitForADoctor(company_Code, DCR_Code, DCR_Visit_Code, _WA_DATA_EXIST);
            }

            return Json(IDCRChemistVisit);
        }


        public JsonResult GetDCRRCPADetailsForADoctor(string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            IEnumerable<DCRRCPADetailsModel> IDCRRCPADetails = null;
            string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
            string user_Code = _objCurrentInfo.GetUserCode();
            string company_Code = _objCurrentInfo.GetCompanyCode();

            if (DCR_Visit_Code.Contains("ED"))
            {
                IDCRRCPADetails = _objBL_DCRDoctorVisit.GetDCREDRCPADetailsForADoctor(company_Code,
                    DCR_Code, DCR_Visit_Code);
            }
            else
            {
                IDCRRCPADetails = _objBL_DCRDoctorVisit.GetDCRRCPADetailsForADoctor(company_Code,
                    DCR_Code, DCR_Visit_Code);
            }

            return Json(IDCRRCPADetails);
        }

        public string InsertDCRChemistsAndRCPA(string DCR_Actual_Date, string DCR_Visit_Code,
            string chemistJSON, string RCPAJSON, int chemitMaxCode, int RCPAMAxCode)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();

                string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
                string user_Code = _objCurrentInfo.GetUserCode();
                //string user_Code = _objCurrentInfo.GetUserCode();
                string company_Code = _objCurrentInfo.GetCompanyCode();
                return _objBL_DCRDoctorVisit.InsertDCRChemistAndRCPA(company_Code, DCR_Code, DCR_Visit_Code, chemistJSON, RCPAJSON,
                    chemitMaxCode, RCPAMAxCode, user_Code, DCR_Actual_Date);
            }
            catch
            {
                throw;
            }
        }

        public string InsetDoctorVisitDataForMobile(string Doctor_Visit_Code, string docJSON, string inputsJSON, string chemJSON, string RCPAJSON,
            string DCR_Actual_Date, int DoctorVisitMaxCode, int inputsMaxCode, int chemistMaxcode, int RCAPMaxCode, bool chemistModified, bool inputsModified
            , bool detailProductModified, string detProdJson)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();

                string DCR_Code = _objCurrentInfo.GetDCRCode(DCR_Actual_Date);
                string user_Code = _objCurrentInfo.GetUserCode();
                string region_Code = _objCurrentInfo.GetRegionCode();
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string lattitude = _objCurrentInfo.GetLattitude();
                string longtitude = _objCurrentInfo.GetLongitude();
                string location = _objCurrentInfo.GetLocation();
                bool isWADoctor = false;
                if (Doctor_Visit_Code != null)
                {
                    isWADoctor = Doctor_Visit_Code.Contains("ED");
                }
                return _objBL_DCRDoctorVisit.InsetDoctorVisitDataForMobile(company_Code, DCR_Code, Doctor_Visit_Code, user_Code, region_Code,
                    DCR_Actual_Date, docJSON, inputsJSON, chemJSON, RCPAJSON, DoctorVisitMaxCode, lattitude, longtitude, location, inputsMaxCode,
                    chemistMaxcode, RCAPMaxCode, chemistModified, inputsModified, isWADoctor, detailProductModified, detProdJson);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult ValidateCategoryVisitCountRestriction(string Doctor_Code, string Category_Code, string DCR_Actual_Date)
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();

                string user_Code = _objCurrentInfo.GetUserCode();
                string region_Code = _objCurrentInfo.GetRegionCode();
                string company_Code = _objCurrentInfo.GetCompanyCode();

                SqlResultModel resultModel = _objBL_DCRDoctorVisit.ValidateCategoryVisitCountRestriction(user_Code: user_Code, region_Code: region_Code, company_Code: company_Code,
                     doctor_Code: Doctor_Code, DCR_Actual_Date: DCR_Actual_Date, category_Code: Category_Code);
                return Json(resultModel);
            }
            catch
            {
                throw;
            }

        }

        #region DCR_Doctor_File_Upload

        public string InserDCRDoctorVisitAttachment(string dcr_Date)
        {
            string blobURL = "";
            string File_Name = "";
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                if (dcr_Date.ToString() != "")
                {
                    var objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                    var objPathProv = new DataControl.Impl.FileSystemProvider();
                    var DCRDoctorVisitModel = GetDCRDoctorVisitMaxCodesList(dcr_Date);
                    int Doctor_Visit_Max_Code = 0;
                    Doctor_Visit_Max_Code = Convert.ToInt32(DCRDoctorVisitModel.Doctor_Vist_Max_Code);
                    string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                    if (Request.Files.Count > 0)
                    {
                        File_Name = Request.Files[0].FileName;
                        //Upload the Excel to Azure
                        blobURL = objAzureUpload.PutAzureBlobStorage(Request.Files[0].InputStream, Guid.NewGuid().ToString() + System.IO.Path.GetExtension(File_Name).ToString(), accKey, _objCurrentInfo.GetCompanyCode());
                        //_objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                        //_objBL_DCRDoctorVisit.InserDCRDoctorVisitAttachment(_objCurrentInfo.GetDCRCode(dcr_Date), _objCurrentInfo.GetUserCode(), File_Name, Convert.ToDateTime(dcr_Date), blobURL, _objCurrentInfo.GetCompanyCode(), Convert.ToInt32(Doctor_Visit_Max_Code));
                    }
                }
            }
            catch (Exception)
            {
            }
            return blobURL + "^" + File_Name;
        }
        #endregion
        public JsonResult GetStockist(string accom_Regioncodes)
        {
            var lstStockiestAuto = new List<DCRStockiestModel>();
            try
            {
                var _objDCRStockiestExpense = new BL_DCRStockiestExpense();
                var _objDCRBL = new BL_DCRStockiestExpense();
                _objCurrentInfo = new CurrentInfo();
                lstStockiestAuto = _objDCRBL.GetAccompaistStockist(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode(), accom_Regioncodes, "STOCKIEST");

            }
            catch (Exception ex)
            {
            }
            return Json(lstStockiestAuto);
        }
        public JsonResult GetSalesProducts(string accom_Regioncodes, DateTime dcrDate)
        {
            var lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
            try
            {
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                lstDCRProductsDetailsModel = _objBL_DCRDoctorVisit.GetAllSaleProductsForDetailed(_objCurrentInfo.GetCompanyCode(), accom_Regioncodes, "", "", dcrDate, 0);
                lstDCRProductsDetailsModel = lstDCRProductsDetailsModel.Where(x => x.Price_group_Code != "" && x.Price_group_Code != null).ToList();
            }
            catch (Exception ex)
            {
            }
            return Json(lstDCRProductsDetailsModel);
        }
        public JsonResult GetDCRPOBDetailsByVisitCode(string Order_Date, string Customer_Code, string Customer_Region_Code, string Customer_Name, string Customer_Speciality)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            var jsConverter = new JSONConverter();
            return Json(jsConverter.Serialize(_objBL_DCRDoctorVisit.GetDCRPOBDetailsByVisitCode(Convert.ToDateTime(Order_Date), Customer_Code, Customer_Region_Code, Customer_Name, Customer_Speciality, _objCurrentInfo.GetUserCode(), _objCurrentInfo.GetCompanyCode())));
        }
        public JsonResult GetLineOfBusiness(string region_code)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            var jsConverter = new JSONConverter();
            region_code += _objCurrentInfo.GetRegionCode() + "^";
            return Json(jsConverter.Serialize(_objBL_DCRDoctorVisit.GetLineOfBusiness(region_code, _objCurrentInfo.GetCompanyCode())));
        }
        public string fnGetCurrentUserCode()
        {
            _objCurrentInfo = new CurrentInfo();
            return _objCurrentInfo.GetUserCode() + "^" + _objCurrentInfo.GetRegionCode();
        }
        public JsonResult GetDCRHeaderName(string RegionCodes)
        {

            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            return Json(_objBL_DCRDoctorVisit.GetDCRHeaderName(RegionCodes + "^" + _objCurrentInfo.GetRegionCode() + "^", _objCurrentInfo.GetCompanyCode()));
        }
        public string GetAccompanistMandatoryInDoctorVisit(string dcr_date)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            return _objBL_DCRDoctorVisit.GetAccompanistMandatoryInDoctorVisit(_objCurrentInfo.GetUserCode(), Convert.ToDateTime(dcr_date), _objCurrentInfo.GetCompanyCode());
        }
        public JsonResult GetDoctorVisitPOBCount(string dcr_date)
        {
            _objCurrentInfo = new CurrentInfo();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            return Json(_objBL_DCRDoctorVisit.GetDoctorVisitPOBCount(Convert.ToDateTime(dcr_date), _objCurrentInfo.GetUserCode(), _objCurrentInfo.GetCompanyCode()));
        }
        public JsonResult GetDoctorBusinessAndActivityMaster(string activity)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            return Json(_objBL_DCRDoctorVisit.GetDoctorBusinessAndActivityMaster(activity, _objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserTypeCode(), _objCurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDCRActivity(string Visit_code, string flag)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            return Json(_objBL_DCRDoctorVisit.GetDCRActivity(Visit_code, flag), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GeMCDetails(string customer_code, DateTime dcrDate)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            return Json(_objBL_DCRDoctorVisit.GeMCDetails(_objCurrentInfo.GetRegionCode(), _objCurrentInfo.GetCompanyCode(), customer_code, dcrDate), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDoctorBusinessStatus(string doctor_code, DateTime dcr_date, string doctor_region_code)
        {
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            return Json(_objBL_DCRDoctorVisit.GetDoctorBusinessStatus(doctor_code, dcr_date, doctor_region_code, _objCurrentInfo.GetUserTypeCode()), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [ActionName("Getproductnames")]
        public JsonResult Getproductnames()
        {
            try
            {
                string CompanyCode = string.Empty;
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();
                CompanyCode = _objCurrentInfo.GetCompanyCode();
                return Json(_objBL_DCRDoctorVisit.Getproductnames(CompanyCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        [ActionName("Getchkprod")]
        public int Getchkprod(string ProductName)
        {
            try
            {

                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                DCRProductCompetitorAddition objComp = new DCRProductCompetitorAddition();
                objComp.Product_Name = ProductName;
                return _objBL_DCRDoctorVisit.Getchkprod(objComp);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        [HttpGet]
        [ActionName("GetchkComp")]
        public int GetchkComp(string CompetitorName)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                return _objBL_DCRDoctorVisit.GetchkComp(CompetitorName, "");
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        [HttpGet]
        [ActionName("GetAllCompetitorDetails")]
        public JsonResult GetAllCompetitorDetails(string CompanyCode, string DCRVisitCode)
        {
            try
            {

                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();
                CompanyCode = _objCurrentInfo.GetCompanyCode();
                return Json(_objBL_DCRDoctorVisit.GetAllCompetitorDetails(CompanyCode, DCRVisitCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public string SaveProductAndCompetitorDetails(DCRProductCompetitorAddition objComp)
        {
            int productId = 0;
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            //var com_Id = 0;
            CurrentInfo _objCurrentInfo = new CurrentInfo();
            string Company_Code = _objCurrentInfo.GetCompanyCode();
            if (objComp.Competitor_Code == null)
                objComp.Competitor_Code = _objBL_DCRDoctorVisit.GetchkComp(objComp.Competitor_Name, Company_Code);
            if (objComp.Competitor_Code > 0)
            {
                _objCurrentInfo = new CurrentInfo();
                objComp.Company_Code = _objCurrentInfo.GetCompanyCode();
                productId = _objBL_DCRDoctorVisit.Getchkprod(objComp);
            }
            return objComp.Competitor_Code + "^" + productId;
        }

        public JsonResult GetDCRProductBatch(FormCollection collection)
        {
            try
            {
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                _objCurrentInfo = new CurrentInfo();
                string productCode = collection["product_Code"].ToString();
                string dcrDate = collection["dcr_date"].ToString();
                string entity = collection["entity"].ToString();
                string cv_visit_id = collection["cv_visit_id"].ToString();
                string Flag = collection["Flag"].ToString();
                string userCode = _objCurrentInfo.GetUserCode();
                return Json(_objBL_DCRDoctorVisit.GetDCRProductBatch(productCode, dcrDate, userCode, entity, cv_visit_id, Flag), JsonRequestBehavior.AllowGet);

                //DataControl.Data ds = new DataControl.Data();
                //DataSet dssub = new DataSet();
                //ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
                //{
                //    string StrSQL = "EXEC SP_HD_GET_DCRProductBatch " + "'" + userCode + "','" + productCode + "','" + dcrDate + "'";
                //    dssub = ds.ExecuteDataSet(StrSQL);
                //    ds.CloseConnection();
                //}
                //DataTable dt = new DataTable();
                //DataTable dtBatch = new DataTable();
                //dt = dssub.Tables[0];
                //dtBatch = dssub.Tables[1];

                ////List<DCRProductValidCount> lstProduct = (from c in dt.AsEnumerable()
                ////                                         select new DCRProductValidCount
                ////                                         {
                ////                                             Product_Code = c["Product_Code"].ToString(),
                ////                                             Min_Count = Convert.ToInt32(c["Min_Count"].ToString()),
                ////                                             Max_Count = Convert.ToInt32(c["Max_Count"].ToString())
                ////                                         }).ToList<DCRProductValidCount>();

                //List<DCRProductBatch> lstBatch = (from c in dtBatch.AsEnumerable()
                //                                     select new DCRProductBatch
                //                                     {
                //                                         Product_Code = c["Product_Code"].ToString(),
                //                                         Batch_Number = c["Batch_Number"].ToString(),
                //                                         Current_Stock = Convert.ToInt32(c["Current_Stock"].ToString()),
                //                                     }).ToList<DCRProductBatch>();

                //return Json(new { Product = lstProduct, Batch = lstBatch }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public JsonResult GetMCDetailsforDropdown(string customer_code, string regioncode, string dcrDate)
        {
            List<DcrMc> lstMC = new List<DcrMc>();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            _objCurrentInfo = new CurrentInfo();
            lstMC = _objBL_DCRDoctorVisit.GetMCDetailsforDropdown(regioncode, _objCurrentInfo.GetCompanyCode(), customer_code, dcrDate);
            return Json(lstMC, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetCMEProduct(int CME_ID, string Doctor_Code,int Activity_Id)
        {
            List<CMEDetails> lst = new List<CMEDetails>();
            _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            lst = _objBL_DCRDoctorVisit.GetCMEProduct(CME_ID, Doctor_Code, Activity_Id);
            return Json(lst, JsonRequestBehavior.AllowGet);

        }
        public int ValidateCME(int CME_ID, string Doctor_Code,int Activity_Id)
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                return _objBL_DCRDoctorVisit.ValidateCME(CME_ID, Doctor_Code, Activity_Id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpGet]
        [ActionName("Getsurvey")]
        public int Getsurvey(string UserCode,string CampaignCode)
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                return _objBL_DCRDoctorVisit.Getsurvey(_objCurrentInfo.GetUserCode(), CampaignCode);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        [HttpGet]
        [ActionName("GetsurveyDetails")]
        public JsonResult GetsurveyDetails(string CompanyCode, string CampaignCode)
        {
            try
            {
                List<SurveyDetails> lst = new List<SurveyDetails>();
                _objCurrentInfo = new CurrentInfo();
                _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
                lst = _objBL_DCRDoctorVisit.GetsurveyDetails(_objCurrentInfo.GetCompanyCode(), CampaignCode, _objCurrentInfo.GetRegionCode());
                return Json(lst, JsonRequestBehavior.AllowGet);
               // return _objBL_DCRDoctorVisit.GetsurveyDetails(_objCurrentInfo.GetCompanyCode(), CampaignCode);
            }
            catch (Exception ex)
            {
                throw;
            }

        }
    }

}