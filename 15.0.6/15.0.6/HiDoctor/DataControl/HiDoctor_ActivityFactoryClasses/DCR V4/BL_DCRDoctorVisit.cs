#region Usings
using Microsoft.SqlServer.Server;
using MVCModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

#endregion Usings

namespace DataControl
{
    public class BL_DCRDoctorVisit
    {
        #region Private Variables
        enum DOCTOR_COMES_FROM { NA, Main, TP, CP, WA };
        private DAL_DoctorVisit _objdalDoctorVisit = null;

        private const string CHEMIST_ENTITY = "CHEMIST";
        private const string DOCTOR_ENTITY = "DOCTOR";
        private const string DCR_CODE_PREFIX = "DCR";
        private const string DCR_DOCTOR_VISIT_CODE_PREFIX = "DVC";
        private const string DCR_PRODUCT_CODE_PREFIX = "DPC";
        private const string DCR_CHEMIST_CODE_PREFIX = "CVC";
        private const string DCR_RCPA_CODE_PREFIX = "DRC";
        private const string DOCTOR_COMES_FROM_MAIN = "MAIN";
        #endregion Private Variables

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
            if (!showAccData.Trim().ToUpper().Contains(entityType))
            {
                regions = ownRegionCode + "^";
            }
            else
            {
                regions = regionCodes;
            }
            return regions;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDCRDetailedProductModel"></param>
        /// <param name="det_Prod_last_code"></param>
        private void CreateDetailedProductsCode(ref IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductModel, ref long det_Prod_last_code)
        {
            foreach (DCRDetailedProductsModel dcr in IDCRDetailedProductModel)
            {
                dcr.DCR_Product_Detail_Code = (++det_Prod_last_code);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDCRDoctorAccompanistModel"></param>
        /// <param name="lastCode"></param>
        private void CreateDoctorAccompanistCode(ref IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel, ref long lastCode)
        {
            foreach (DCRDoctorAccompanistModel dcr in IDCRDoctorAccompanistModel)
            {
                dcr.DCR_Doctor_Acc_Code = (++lastCode);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDCRRCPADetailsModel"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="IDCRChemistVisitModel"></param>
        /// <param name="RCPA_Max_Code"></param>
        private void CreateRCPADetailsCode(ref IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel, string DCR_Code, IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel, ref int RCPA_Max_Code)
        {
            string DCRRCPACodeString = DCR_Code.Replace(DCR_CODE_PREFIX, DCR_RCPA_CODE_PREFIX);
            StringBuilder stringBuidler = new StringBuilder();
            if (IDCRRCPADetailsModel != null)
            {
                foreach (DCRRCPADetailsModel dcr in IDCRRCPADetailsModel)
                {
                    stringBuidler.Clear();

                    dcr.DCR_RCPA_Code = (stringBuidler.Append(DCRRCPACodeString).Append((++RCPA_Max_Code).ToString())).ToString();
                    DCRChemistVisitModel dcrChemistVisit = IDCRChemistVisitModel.Where(chemistVist => chemistVist.Local_Ref_Code == dcr.Chemist_Visit_Code).FirstOrDefault();
                    dcr.Chemist_Visit_Code = dcrChemistVisit.DCR_Chemists_Code;
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDCRChemistVisitModel"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="Chemist_Max_Code"></param>
        private void CreateChemistDetailsCode(ref IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel, string DCR_Code, ref int Chemist_Max_Code)
        {
            string DCRChemistCodeString = DCR_Code.Replace(DCR_CODE_PREFIX, DCR_CHEMIST_CODE_PREFIX);
            StringBuilder stringBuidler = new StringBuilder();
            if (IDCRChemistVisitModel != null)
            {
                foreach (DCRChemistVisitModel dcr in IDCRChemistVisitModel)
                {
                    stringBuidler.Clear();

                    dcr.DCR_Chemists_Code = (stringBuidler.Append(DCRChemistCodeString).Append((++Chemist_Max_Code).ToString())).ToString();
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDCRProductDetailsModel"></param>
        /// <param name="DCRCode"></param>
        /// <param name="Inputs_Max_Code"></param>
        private void CreateProductDetailsCode(ref IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel, string DCRCode, ref int Inputs_Max_Code)
        {
            string DCRProductCodeString = DCRCode.Replace(DCR_CODE_PREFIX, DCR_PRODUCT_CODE_PREFIX);
            StringBuilder stringBuidler = new StringBuilder();

            if (IDCRProductDetailsModel != null)
            {
                foreach (DCRProductDetailsModel dcr in IDCRProductDetailsModel)
                {
                    stringBuidler.Clear();

                    dcr.DCR_Product_Code = (stringBuidler.Append(DCRProductCodeString).Append((++Inputs_Max_Code).ToString())).ToString();
                }
            }
        }

        #endregion Private Methods


        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="dcr_Code"></param>
        /// <returns></returns>
        public int CheckWADataExist(string company_Code, string DCR_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.CheckWADataExist(company_Code, DCR_Code);
        }

        /// <summary>
        /// Retrieves Doctor List for Autofill DCR V4.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="accRegions"></param>
        /// <param name="showAccData"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetDoctorsList(string company_Code, string region_Code, string acc_Regions,
            string showAccData, string DoctorNameSufPreConfigValue, string dcrActualDate)
        {
            List<DCRDoctorVisitModel> dcrDoctorVisitModel = new List<DCRDoctorVisitModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // Retrieve the Acc regions.
            string regions = GetAccRegions(acc_Regions, showAccData, DOCTOR_ENTITY, region_Code);

            // Call the DAL.
            dcrDoctorVisitModel = _objdalDoctorVisit.GetSelectedDoctors(company_Code, region_Code, regions, DoctorNameSufPreConfigValue, dcrActualDate);

            return dcrDoctorVisitModel;
        }

        /// <summary>
        /// Retrieves Chemist List for Autofill DCR V4.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="region_Code"></param>
        /// <param name="acc_Regions"></param>
        /// <param name="showAccData"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetChemistsList(string company_Code, string region_Code, string acc_Regions,
            string showAccData)
        {
            List<DCRChemistVisitModel> dcrChemistVisitModel = new List<DCRChemistVisitModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // Retrieve the Acc regions.
            string regions = GetAccRegions(acc_Regions, showAccData, CHEMIST_ENTITY, region_Code);

            // Call the dal.
            dcrChemistVisitModel = _objdalDoctorVisit.GetSelectedChemists(company_Code, region_Code, regions);

            return dcrChemistVisitModel;
        }

        /// <summary>
        /// Retrieve the Speciality Autofill for DCRV4.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetSpecialityList(string company_Code)
        {
            // Instance create.
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // call the dal.
            lstDCRDoctorVisitModel = _objdalDoctorVisit.GetSpeciality(company_Code);

            // returns the list.
            return lstDCRDoctorVisitModel;
        }

        /// <summary>
        /// Retrieves the Company Sale Products OR Division Products.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetSaleProductsList(string company_Code, string user_Code, string dcrActualDate)
        {
            // Instance create.
            List<DCRProductDetailsModel> lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // Call the dal.
            lstDCRProductsDetailsModel = _objdalDoctorVisit.GetSaleProducts(company_Code, user_Code, dcrActualDate);

            // returns list.
            return lstDCRProductsDetailsModel;
        }

        /// <summary>
        /// Retrieves the User Product Mapping.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <param name="prodBringType"></param>
        /// <param name="searchWord"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetUserProductsList(string company_Code, string user_Code, string prodBringType,
            string searchWord, string DCR_Date)
        {
            // Instance create.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            List<DCRProductDetailsModel> lstDCRProductsDetailModel = new List<DCRProductDetailsModel>();

            // Call Dal.
            lstDCRProductsDetailModel = _objdalDoctorVisit.GetUserProducts(company_Code, user_Code, prodBringType, searchWord, DCR_Date);

            // returns the list.
            return lstDCRProductsDetailModel;
        }

        /// <summary>
        /// Retrieves the Company All Sale Products for Detailed box autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="division_Codes"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetAllSaleProductsForDetailed(string company_Code, string region_Code, string Doc_Region_Code, string Doctor_code, DateTime dcrDate, int bring_Color_status)
        {
            // Instance create.
            List<DCRProductDetailsModel> lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // Call the dal.
            lstDCRProductsDetailsModel = _objdalDoctorVisit.GetAllSaleProductsForDetailed(company_Code, region_Code, Doc_Region_Code, Doctor_code, dcrDate, bring_Color_status);

            // returns the list
            return lstDCRProductsDetailsModel;

        }
        public List<DCRProductDetailsModel> GetAllNewSaleProductsForDetail(string company_Code, string region_Code, string Doc_Region_Code, string Doctor_code, DateTime dcrDate, int bring_Color_status)
        {
            // Instance create.
            List<DCRProductDetailsModel> lstDCRProductsDetailsModel = new List<DCRProductDetailsModel>();
            _objdalDoctorVisit = new DAL_DoctorVisit();

            // Call the dal.
            lstDCRProductsDetailsModel = _objdalDoctorVisit.GetAllNEWSaleProductsForDetailed(company_Code, region_Code, Doc_Region_Code, Doctor_code, dcrDate, bring_Color_status);

            // returns the list
            return lstDCRProductsDetailsModel;

        }

        public List<VisitTimePrivValues> checkColorPrivelegeForDetailedProdcutsPopup(string companyCode, string usertypecode)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.checkColorPrivelegeForDetailedProdcutsPopup(companyCode, usertypecode);
        }


        public IEnumerable<DCRDoctorVisitModel> GetDoctorVisitData(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date, long TP_Id, string CP_Code, string region_Code, int WADATAEXIST, string DoctorNameSufPreConfigValue, string flag)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRDoctorVisitModel> IlstDoctorVisit = null;

            // Retrieve the Doctor Visit Data from Main Table.
            List<DCRDoctorVisitModel> dcrDoctorVisitMain = _objdalDoctorVisit.GetDoctorVisitDataPerDay(company_Code, DCR_Code,
                DCR_Actual_Date, user_Code, DoctorNameSufPreConfigValue, flag);

            // Wide Angle Data is Exist for this DCR Code.
            // If not Wide Angle data exist Retrieve the TP Doctors.
            if (WADATAEXIST > 0)
            {
                // Retrieve the Doctor Visit Data WA OR ED Table.
                List<DCRDoctorVisitModel> dcrDoctorVisitED = _objdalDoctorVisit.GetEDDoctorVisitDataPerDay(company_Code, DCR_Code,
                    DCR_Actual_Date, user_Code, DoctorNameSufPreConfigValue);
                IlstDoctorVisit = dcrDoctorVisitMain.Union(dcrDoctorVisitED, new DoctorVisitDoctorCodeComparer());
            }
            else
            {
                // Retrieve the TP OR CP Doctor Data.
                List<DCRDoctorVisitModel> dcrDoctorVisitTPORCP = _objdalDoctorVisit.GetTPOrCPDoctors(company_Code, TP_Id,
                    CP_Code, region_Code, DoctorNameSufPreConfigValue, DCR_Actual_Date);
                IlstDoctorVisit = dcrDoctorVisitMain.Union(dcrDoctorVisitTPORCP, new DoctorVisitDoctorCodeComparer());
            }
            if(flag=="A")
            {
                // Retrieve the CME Planned Doctor Data.
                List<DCRDoctorVisitModel> dcrDoctorVisitCME = _objdalDoctorVisit.GetCMEDoctorVist(company_Code,
                 user_Code, DoctorNameSufPreConfigValue, DCR_Actual_Date);
                IlstDoctorVisit = dcrDoctorVisitMain.Union(dcrDoctorVisitCME, new DoctorVisitDoctorCodeComparer());

            }

            return IlstDoctorVisit;
        }

        public IEnumerable<DCRProductDetailsModel> GetDCRProductsDetails(string company_Code, string DCR_Code, string user_Code,
        string DCR_Actual_Date, long TP_Id, int WADATAEXIST, string flag)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRProductDetailsModel> IlstProductDetails = null;

            // Retrieve the Product Details Data from Main Table.
            List<DCRProductDetailsModel> dcrProductDetailstMain = _objdalDoctorVisit.GetDCRProductsDetailPerDay(company_Code, DCR_Code,
                DCR_Actual_Date, user_Code, flag);
            // Wide Angle Data is Exist for this DCR Code.
            // If not Wide Angle data exist Retrieve the TP Products.
            if (WADATAEXIST > 0)
            {
                // Retrieve the Doctor Visit Data WA OR ED Table.
                List<DCRProductDetailsModel> dcrProductDetailsED = _objdalDoctorVisit.GetEDDCRProductsDetailPerDay(company_Code, DCR_Code,
                    DCR_Actual_Date, user_Code);
                IlstProductDetails = dcrProductDetailstMain.Union(dcrProductDetailsED);
            }
            else
            {
                // Retrieve the TP Product Data.
                List<DCRProductDetailsModel> dcrDoctorVisitTPORCP = _objdalDoctorVisit.GetTPProductDetails(company_Code, TP_Id,
                    user_Code);
                IlstProductDetails = dcrProductDetailstMain.Union(dcrDoctorVisitTPORCP);
            }
            return IlstProductDetails;
        }

        public IEnumerable<DCRDetailedProductsModel> GetDCRDetailedProducts(string company_Code, string DCR_Code, int WADATAEXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRDetailedProductsModel> IlstDCRDetailedProducts = null;

            // Retrieve the Detailed Products from Main Table.
            List<DCRDetailedProductsModel> dcrDetailsProductMain = _objdalDoctorVisit.GetDCRDetailedProductsDetails(company_Code, DCR_Code);

            // Wide Angle Data is Exist for this DCR Code.
            if (WADATAEXIST > 0)
            {
                // Retrieve the Detailed Products Data WA OR ED Table.
                List<DCRDetailedProductsModel> dcrDetailProductsED = _objdalDoctorVisit.GetEDDCRDetailedProductsDetails(company_Code, DCR_Code);
                IlstDCRDetailedProducts = dcrDetailsProductMain.Union(dcrDetailProductsED);
            }
            else
            {
                IlstDCRDetailedProducts = dcrDetailsProductMain;
            }
            return IlstDCRDetailedProducts;
        }

        public string GetDrAccMandatory(string Company_Code, string User_Code, string DCR_Date)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();

            return _objdalDoctorVisit.GetDrAccMandatory(Company_Code, User_Code, DCR_Date);
        }
        public IEnumerable<DCRDoctorAccompanistModel> GetDCRDoctorAccompanist(string company_Code, string DCR_Code, int WADATAEXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRDoctorAccompanistModel> IlstDCRDoctorDetailAcc = null;

            // Retrieve the Doctor Accompanist Data from Main Table.
            List<DCRDoctorAccompanistModel> dcrDoctorDetailsAccompanist = _objdalDoctorVisit.GetDCRDoctorAccomapnistDetails(company_Code, DCR_Code);

            // Wide Angle Data is Exist for this DCR Code.
            if (WADATAEXIST > 0)
            {
                // Retrieve the Doctor Accompanist Data WA OR ED Table.
                List<DCRDoctorAccompanistModel> dcrDoctorAccompanist = _objdalDoctorVisit.GetEDDCRDoctorAccomapnistDetails(company_Code, DCR_Code);
                IlstDCRDoctorDetailAcc = dcrDoctorDetailsAccompanist.Union(dcrDoctorAccompanist);
            }
            else
            {
                IlstDCRDoctorDetailAcc = dcrDoctorDetailsAccompanist;
            }
            return IlstDCRDoctorDetailAcc;
        }

        public IEnumerable<DCRChemistVisitModel> GetDCRChemistVisit(string company_Code, string DCR_Code, string user_Code,
        string DCR_Actual_Date, int WADATAEXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRChemistVisitModel> IlstDCRChemistVisit = null;

            // Retrieve the Chemist Visit Data from Main Table.
            List<DCRChemistVisitModel> dcrChemistVisitMain = _objdalDoctorVisit.GetDCRChemistsVisitDetailsPerDay(company_Code, DCR_Code, user_Code, DCR_Actual_Date);

            // Wide Angle Data is Exist for this DCR Code.
            if (WADATAEXIST > 0)
            {
                // Retrieve the Chemist Visit Data WA OR ED Table.
                List<DCRChemistVisitModel> dcrChemistVisitED = _objdalDoctorVisit.GetEDDCRChemistsVisitDetailsPerDay(company_Code, DCR_Code, user_Code, DCR_Actual_Date);
                IlstDCRChemistVisit = dcrChemistVisitMain.Union(dcrChemistVisitED);
            }
            else
            {
                IlstDCRChemistVisit = dcrChemistVisitMain;
            }
            return IlstDCRChemistVisit;
        }
        public IEnumerable<DCRFollowUp> GetDCRFollowUp(string user_Code, string DCR_Actual_Date, string company_code)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDCRFollowUp(user_Code, DCR_Actual_Date, company_code);

        }
        public IEnumerable<DCRDoctorVisitAttachment> GetDCRDoctorVisitAttachment(string user_Code, string DCR_Actual_Date, string company_code)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDCRDoctorVisitAttachment(user_Code, DCR_Actual_Date, company_code);

        }

        public IEnumerable<DCRRCPADetailsModel> GetDCRRCPADetails(string company_Code, string DCR_Code, int WADATAEXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRRCPADetailsModel> IlstDCRRCPADetails = null;

            // Retrieve the RCPA Details Data Main Table.
            List<DCRRCPADetailsModel> dcrRCPADetailsMain = _objdalDoctorVisit.GetDCRRCPADetailsPerDay(company_Code, DCR_Code);

            // Wide Angle Data is Exist for this DCR Code.
            if (WADATAEXIST > 0)
            {
                // Retrieve the RCPA Details Data WA OR ED Table.
                List<DCRRCPADetailsModel> dcrRCPADetailsED = _objdalDoctorVisit.GetEDDCRRCPADetailsPerDay(company_Code, DCR_Code);
                IlstDCRRCPADetails = dcrRCPADetailsMain.Union(dcrRCPADetailsED);
            }
            else
            {
                IlstDCRRCPADetails = dcrRCPADetailsMain;
            }
            return IlstDCRRCPADetails;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="user_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <returns></returns>
        public DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodes(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            DCRDoctorVisitMaxCodes objMaxCodes = _objdalDoctorVisit.GetDCRDoctorVisitMaxCodes(company_Code, DCR_Code, user_Code,
                DCR_Actual_Date);
            return objMaxCodes;
        }

        public DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            DCRDoctorVisitMaxCodes objMaxCodes = _objdalDoctorVisit.GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile(company_Code, DCR_Code, user_Code,
                DCR_Actual_Date, DCR_Visit_Code);
            return objMaxCodes;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="DCRDoctorVisitInsertHelper"></param>
        /// <returns></returns>
        public DCRDoctorVisitInserHelperModel InsertDoctorVisitData(DCRDoctorVisitInserHelperModel DCRDoctorVisitInsertHelper)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();

            string company_Code = DCRDoctorVisitInsertHelper.Compnay_Code;
            string DCR_Code = DCRDoctorVisitInsertHelper.DCR_Code;
            string user_Code = DCRDoctorVisitInsertHelper.User_Code;
            string DCR_Actual_Date = DCRDoctorVisitInsertHelper.DCR_Actual_Date;
            string Doctor_Visit_Code = DCRDoctorVisitInsertHelper.Doctor_Visit_Code;

            int Doctor_Visit_Max_Code = DCRDoctorVisitInsertHelper.Doctor_Vist_Max_Code;
            long Doc_Acc_Max_Code = DCRDoctorVisitInsertHelper.Doc_Acc_Max_Code;
            int Inputs_Max_Code = DCRDoctorVisitInsertHelper.Inputs_Max_Code;
            long Detailed_Max_Code = DCRDoctorVisitInsertHelper.Detailed_Max_Code;
            int Chemist_Max_Code = DCRDoctorVisitInsertHelper.Chemist_Max_Code;
            int RCPA_Max_Code = DCRDoctorVisitInsertHelper.RCPA_Max_Code;
            string Record_Status = DCRDoctorVisitInsertHelper.Record_Status;
            string lattitude = DCRDoctorVisitInsertHelper.Lattitude;
            string longtitude = DCRDoctorVisitInsertHelper.Longtitude;
            string location = DCRDoctorVisitInsertHelper.Location;
            string region_Code = DCRDoctorVisitInsertHelper.Region_Code;
            string mode_Of_Form = DCRDoctorVisitInsertHelper.Mode_Of_Form;
            int? business_Status_ID = DCRDoctorVisitInsertHelper.Business_Status_ID;
            int company_Id = DCRDoctorVisitInsertHelper.company_Id;
            DateCapturingModel _ObjDateDetails = DCRDoctorVisitInsertHelper._ObjDateDetails;
            string CMETracking = DCRDoctorVisitInsertHelper.CMETracking;
            // converts json string to Model objects.
            IEnumerable<DCRDoctorVisitModel> IDCRDoctorVisitModel = (IEnumerable<DCRDoctorVisitModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Doctor_Json, typeof(List<DCRDoctorVisitModel>));

            IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel = (IEnumerable<DCRProductDetailsModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Inputs_Json, typeof(List<DCRProductDetailsModel>));
            IDCRProductDetailsModel = IDCRProductDetailsModel.ToList().GroupBy(x => x.Product_Code).Select(y => y.First()).ToList();
            List<DCRProductDetailsModel> IDCRProductDetailsModel_new = new List<DCRProductDetailsModel>();
            IEnumerable<DCRProductDetailsModel> IDCRProductBatchModel = (IEnumerable<DCRProductDetailsModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Inputs_Json, typeof(List<DCRProductDetailsModel>));
            IEnumerable<CMETracking> Tracking = (IEnumerable<CMETracking>)JsonConvert.DeserializeObject(CMETracking, typeof(List<CMETracking>));

            IDCRProductBatchModel = IDCRProductBatchModel.Where(x => x.Batch_Number != "").ToList();
            List<DCRProductDetailsModel> lsbatch = new List<DCRProductDetailsModel>();
            if (IDCRProductBatchModel.ToList().Count > 0)
            {
                foreach (var item in IDCRProductDetailsModel.ToList())
                {
                    DCRProductDetailsModel obj = new DCRProductDetailsModel();
                    var single_pro = IDCRProductBatchModel.Where(x => x.Product_Code == item.Product_Code);
                    if (single_pro.ToList().Count > 0)
                    {
                        obj.DCR_Product_Code = single_pro.ToList()[0].DCR_Product_Code;
                        obj.Batch_Number = single_pro.ToList()[0].Batch_Number;
                        obj.Product_Code = single_pro.ToList()[0].Product_Code;
                        obj.Doctor_Name = single_pro.ToList()[0].Doctor_Name;
                        var quentity = 0;

                        for (int i = 0; i < single_pro.ToList().Count; i++)
                        {
                            if (single_pro.ToList()[i].Quantity_Provided != "")
                                quentity += Convert.ToInt32(single_pro.ToList()[i].Quantity_Provided);
                        }
                        obj.Quantity_Provided = quentity.ToString();

                    }
                    else
                    {
                        obj.DCR_Product_Code = item.DCR_Product_Code;
                        obj.Batch_Number = item.Batch_Number;
                        obj.Product_Code = item.Product_Code;
                        obj.Quantity_Provided = item.Quantity_Provided;
                    }
                    lsbatch.Add(obj);
                }
                IDCRProductDetailsModel = null;
                IDCRProductDetailsModel = lsbatch;
            }
            IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel = (IEnumerable<DCRChemistVisitModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Chemist_Json, typeof(List<DCRChemistVisitModel>));
            IEnumerable<DCRFollowUp> IDDCRFollowUp = (IEnumerable<DCRFollowUp>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Fllow_Json, typeof(List<DCRFollowUp>));
            IEnumerable<DCRDoctorVisitAttachment> IDDCRDoctorVisitAttachment = (IEnumerable<DCRDoctorVisitAttachment>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Attachment_Json, typeof(List<DCRDoctorVisitAttachment>));
            IEnumerable<OrderHeader> IDDCROrderHeader = (IEnumerable<OrderHeader>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.StockistJSON, typeof(List<OrderHeader>));
            IEnumerable<OrderDetails> IDDCROrderDetails = (IEnumerable<OrderDetails>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.SalesProductsJSON, typeof(List<OrderDetails>));
            IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel = (IEnumerable<DCRRCPADetailsModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.RCPA_Json, typeof(List<DCRRCPADetailsModel>));
            IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel = (IEnumerable<DCRDoctorAccompanistModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Doc_Acc_Json, typeof(List<DCRDoctorAccompanistModel>));
            IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductModel = (IEnumerable<DCRDetailedProductsModel>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.Detailed_Json, typeof(List<DCRDetailedProductsModel>));
            DCRDoctorVisitModel dcrDoctorVisitModel = ((DCRDoctorVisitModel)IDCRDoctorVisitModel.FirstOrDefault());
            IEnumerable<DCRActivity> IDDCRActivity = (IEnumerable<DCRActivity>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.ActivityJSON, typeof(List<DCRActivity>));
            IEnumerable<DCRProductCompetitorAddition> IDCRCompetitor = (IEnumerable<DCRProductCompetitorAddition>)JsonConvert.DeserializeObject(DCRDoctorVisitInsertHelper.CompProductJSON, typeof(List<DCRProductCompetitorAddition>));
            //
            CurrentInfo _objCurrentInfo = new CurrentInfo();
            IDDCROrderHeader.ToList().ForEach(x => x.Created_By = _objCurrentInfo.GetUserCode());
            IDDCROrderHeader.ToList().ForEach(x => x.Favouring_Region_Code = _objCurrentInfo.GetRegionCode());
            IDDCROrderHeader.ToList().ForEach(x => x.Favouring_User_Code = _objCurrentInfo.GetUserCode());
            //IDDCROrderHeader.ToList().Where(x => x.Order_Due_Date == null).ToList().ForEach(w => w.Order_Due_Date = w.DCR_Actual_Date);
            //Fillter
            IDDCRDoctorVisitAttachment = IDDCRDoctorVisitAttachment.Where(x => x.Status == "1").ToList();
            // if record status is 1, we generate the doctor visit code.
            // if record status is 3, this doctor is drafted doctor.
            if (dcrDoctorVisitModel.Record_Status == "1")
            {
                Doctor_Visit_Code = DCR_Code.Replace(DCR_CODE_PREFIX, DCR_DOCTOR_VISIT_CODE_PREFIX) + (++Doctor_Visit_Max_Code).ToString();
                DCRDoctorVisitInsertHelper.Doctor_Visit_Code = Doctor_Visit_Code;
            }

            dcrDoctorVisitModel.Doctor_Region_Code = dcrDoctorVisitModel.Doctor_Region_Code == null ? region_Code : dcrDoctorVisitModel.Doctor_Region_Code;
            // if source of entry is web we retriev the lat, long and loc from session.
            // if source of entry is tablet, dont get the web lat, long and loc.
            if (dcrDoctorVisitModel.Source_of_Entry.ToUpper() == "WEB")
            {

                dcrDoctorVisitModel.Lattitude = dcrDoctorVisitModel.Lattitude == null ? lattitude : dcrDoctorVisitModel.Lattitude;
                dcrDoctorVisitModel.Longtitude = dcrDoctorVisitModel.Longtitude == null ? longtitude : dcrDoctorVisitModel.Longtitude;
                dcrDoctorVisitModel.Location = dcrDoctorVisitModel.Location == null ? location : dcrDoctorVisitModel.Location;
            }

            // generate the DCR Product Details code.(unique code)
            CreateProductDetailsCode(ref IDCRProductDetailsModel, DCR_Code, ref Inputs_Max_Code);

            List<DCRProductDetailsModel> lsbatchProduct = new List<DCRProductDetailsModel>();
            if (IDCRProductDetailsModel.ToList().Count > 0 && IDCRProductBatchModel.ToList().Count > 0)
            {
                foreach (var item in IDCRProductDetailsModel.ToList())
                {
                    var sigle_pro = IDCRProductBatchModel.ToList().Where(x => x.Product_Code == item.Product_Code);
                    for (int i = 0; i < sigle_pro.ToList().Count; i++)
                    {
                        DCRProductDetailsModel obj = new DCRProductDetailsModel();
                        obj.DCR_Product_Code = item.DCR_Product_Code;
                        obj.Product_Code = sigle_pro.ToList()[i].Product_Code;
                        obj.Quantity_Provided = sigle_pro.ToList()[i].Quantity_Provided;
                        obj.Batch_Number = sigle_pro.ToList()[i].Batch_Number;
                        lsbatchProduct.Add(obj);
                    }
                }
                IDCRProductBatchModel = null;
                IDCRProductBatchModel = lsbatchProduct;
            }
            // generate the DCR Product Details Competitor code.(unique code)
            //CreateProductDetailsCompetitorCode(ref IDCRCompetitor, DCR_Code, ref Inputs_Max_Code);
            // generate the DCR Chemist code.(unique code)
            CreateChemistDetailsCode(ref IDCRChemistVisitModel, DCR_Code, ref Chemist_Max_Code);

            // generate the DCR RCPA code.(unique code)
            CreateRCPADetailsCode(ref IDCRRCPADetailsModel, DCR_Code, IDCRChemistVisitModel, ref RCPA_Max_Code);

            // generate the DCR Acc Code code.(this id for using the while statement in stored procedure.)
            CreateDoctorAccompanistCode(ref IDCRDoctorAccompanistModel, ref Doc_Acc_Max_Code);

            // generate the DCR detailed code.(this id for using the while statement in stored procedure.)
            CreateDetailedProductsCode(ref IDCRDetailedProductModel, ref Detailed_Max_Code);

            // call dal.
            string Tempresult = "";
            if (DCRDoctorVisitInsertHelper.flag == "F")
            {
                Tempresult = _objdalDoctorVisit.InsertDoctorVisitData(company_Code, DCR_Code, user_Code, DCR_Actual_Date, Doctor_Visit_Code, IDCRDoctorVisitModel, IDCRProductDetailsModel,
                    IDCRDoctorAccompanistModel, IDCRDetailedProductModel, IDCRChemistVisitModel, IDCRRCPADetailsModel, IDDCRFollowUp, IDDCRDoctorVisitAttachment, IDDCROrderHeader, IDDCROrderDetails,
                   mode_Of_Form, business_Status_ID, IDDCRActivity, IDCRCompetitor, company_Id, IDCRProductBatchModel, _ObjDateDetails);
            }
            else
            {
                IDCRDoctorVisitModel.ToList().ForEach(x => x.Company_Code = _objCurrentInfo.GetCompanyCode());
                IDCRDoctorVisitModel.ToList().ForEach(x => x.Company_Id = Convert.ToInt32(_objCurrentInfo.GetCompanyId()));
                IDCRDoctorVisitModel.ToList().ForEach(x => x.DCR_Code = DCR_Code);
                IDCRDoctorVisitModel.ToList().ForEach(x => x.DCR_Actual_Date = DCR_Actual_Date);
                IDCRDoctorVisitModel.ToList().ForEach(x => x.User_code = _objCurrentInfo.GetUserCode());
                IDCRDoctorVisitModel.ToList().ForEach(x => x.Business_Status_ID = business_Status_ID);
                DAL_DCRStockiestExpense obj = new DAL_DCRStockiestExpense();
                Tempresult = obj.InsertAttendanceDoctor(IDCRDoctorVisitModel.ToList(), IDCRProductDetailsModel.ToList(), IDDCRActivity.ToList(), IDCRProductBatchModel.ToList(), company_Code, DCR_Code, Convert.ToDateTime(DCR_Actual_Date), user_Code,Tracking.ToList());
                string[] tempresult = new string[3];
                if (Tempresult.Contains('^'))
                    tempresult = Tempresult.Split('^');
                if (tempresult.Length >= 2)
                {
                    if (tempresult[2] == "")
                    {
                        Doctor_Visit_Code = tempresult[0];
                        Tempresult = tempresult[1] + "^";
                    }
                    else
                    {
                        Tempresult = tempresult[2] + "^";
                    }
                }
            }
            // if return result is same as doctor visit code, execution is successful.
            // so we returns the max code of each table (doctor, chemist, product and RCPA).
            // oterwise returns the errormessage.

            string[] result = new string[3];
            result[1] = "";
            if (Tempresult.Contains('^'))
                result = Tempresult.Split('^');
            else
                result[0] = Tempresult;

            //if (result.Length > 0)
            //{
            //    DCRDoctorVisitInsertHelper.Doctor_Visit_Code = Doctor_Visit_Code;
            //    DCRDoctorVisitInsertHelper.Doctor_Vist_Max_Code = Doctor_Visit_Max_Code;
            //    DCRDoctorVisitInsertHelper.Doc_Acc_Max_Code = 0;
            //    DCRDoctorVisitInsertHelper.Inputs_Max_Code = Inputs_Max_Code;
            //    DCRDoctorVisitInsertHelper.Detailed_Max_Code = 0;
            //    DCRDoctorVisitInsertHelper.Chemist_Max_Code = Chemist_Max_Code;
            //    DCRDoctorVisitInsertHelper.RCPA_Max_Code = RCPA_Max_Code;
            //    DCRDoctorVisitInsertHelper.Error_Message = "-1";
            //    if (result[1].Length > 0)
            //    {
            //        DCRDoctorVisitInsertHelper.IgnoredOrderList = "Ignored Order List ";
            //        DCRDoctorVisitInsertHelper.IgnoredOrderList += result[1].Replace('~', ',');
            //    }
            //}
            
            if (result[0] == "Successfully")
            {
                DCRDoctorVisitInsertHelper.Doctor_Visit_Code = Doctor_Visit_Code;
                DCRDoctorVisitInsertHelper.Doctor_Vist_Max_Code = Doctor_Visit_Max_Code;
                DCRDoctorVisitInsertHelper.Doc_Acc_Max_Code = 0;
                DCRDoctorVisitInsertHelper.Inputs_Max_Code = Inputs_Max_Code;
                DCRDoctorVisitInsertHelper.Detailed_Max_Code = 0;
                DCRDoctorVisitInsertHelper.Chemist_Max_Code = Chemist_Max_Code;
                DCRDoctorVisitInsertHelper.RCPA_Max_Code = RCPA_Max_Code;
                DCRDoctorVisitInsertHelper.Error_Message = "-1";
                if (result[1].Length > 0)
                {
                    DCRDoctorVisitInsertHelper.IgnoredOrderList = "Ignored Order List ";
                    DCRDoctorVisitInsertHelper.IgnoredOrderList += result[1].Replace('~', ',');
                }
            }
            else
            {
                DCRDoctorVisitInsertHelper.Error_Message = result[0];
                DCRDoctorVisitInsertHelper.Doctor_Visit_Code = Doctor_Visit_Code;
            }
            return DCRDoctorVisitInsertHelper;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="doctor_Visit_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public string DeleteDoctorVisitData(string company_Code, string DCR_Code, string doctor_Visit_Code, string user_Code, string flag)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.DeleteDoctorVisitData(company_Code, DCR_Code, doctor_Visit_Code, user_Code, flag);
        }

        public IEnumerable<DCRProductDetailsModel> GetDCRProductsDetailsForADoctor(string company_Code, string DCR_Code, string user_Code,
        string DCR_Actual_Date, long TP_Id, string DCR_Visit_Code)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRProductDetailsModel> IlstProductDetails = null;

            // Retrieve the Product Details Data from Main Table.
            List<DCRProductDetailsModel> dcrProductDetailstMain = _objdalDoctorVisit.GetDCRProductsDetailPerDayForaDoctor(company_Code, DCR_Code,
                DCR_Actual_Date, user_Code, DCR_Visit_Code);

            List<DCRProductDetailsModel> DCRTPProductDetails = _objdalDoctorVisit.GetTPProductDetails(company_Code, TP_Id,
                                    user_Code);
            IlstProductDetails = dcrProductDetailstMain.Union(DCRTPProductDetails);
            return IlstProductDetails;
        }


        /// <summary>
        /// Retrieves the WA Products.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="user_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="TP_Id"></param>
        /// <param name="WA_DATA_EXIST"></param>
        /// <param name="DCR_Visit_Code"></param>
        /// <returns></returns>
        public IEnumerable<DCRProductDetailsModel> GetDCREDProductsDetailsForADoctor(string company_Code, string DCR_Code, string user_Code,
                    string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            DCR_Visit_Code = DCR_Visit_Code.Replace("ED", "");

            IEnumerable<DCRProductDetailsModel> IlstEDDCRProductDetailsModel = _objdalDoctorVisit.GetDCREDProductsDetailPerDayForaDoctor(company_Code, DCR_Code, DCR_Actual_Date, user_Code,
                DCR_Visit_Code).AsEnumerable();
            return IlstEDDCRProductDetailsModel;
        }

        public IEnumerable<DCRDoctorAccompanistModel> GetDCRDoctorAccompanistForADoctor(string company_Code, string DCR_Actual_Date,
            string DCR_Code, string DCR_Visit_Code, int WA_DATA_EXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRDoctorAccompanistModel> IlstDoctorAccompanist = null;


            // Retrieve the Product Details Data from Main Table.
            IlstDoctorAccompanist = _objdalDoctorVisit.GetDCRDoctorAccomapnistDetailsForADoctor(company_Code, DCR_Code,
                DCR_Visit_Code).AsEnumerable();

            return IlstDoctorAccompanist;
        }

        public IEnumerable<DCRDoctorAccompanistModel> GetDCREDDoctorAccompanistForADoctor(string company_Code, string DCR_Actual_Date,
            string DCR_Code, string DCR_Visit_Code)
        {
            // Retrieve the Doctor Visit Data WA OR ED Table.
            DCR_Visit_Code = DCR_Visit_Code.Replace("ED", "");
            IEnumerable<DCRDoctorAccompanistModel> IlstDoctorAccompanist = _objdalDoctorVisit.GetEDDCRDoctorAccomapnistDetailsForADoctor(company_Code, DCR_Code,
                DCR_Visit_Code).AsEnumerable();
            return IlstDoctorAccompanist;
        }


        public string InsertDCRDoctorAccompanist(string company_Code, string DCR_Code, string DCR_Visit_Code, string docAccJSON, string WA_Doctor_Visit_Code)
        {
            IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel = (IEnumerable<DCRDoctorAccompanistModel>)JsonConvert.DeserializeObject(docAccJSON, typeof(List<DCRDoctorAccompanistModel>));
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.InsertDCRDoctorAccompanist(company_Code, DCR_Code, DCR_Visit_Code, IDCRDoctorAccompanistModel, WA_Doctor_Visit_Code);
        }

        public string InsertDCRDoctorAccompanist(string company_Code, string DCR_Code, string DCR_Visit_Code, IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel, string WA_Doctor_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.InsertDCRDoctorAccompanist(company_Code, DCR_Code, DCR_Visit_Code, IDCRDoctorAccompanistModel, WA_Doctor_Visit_Code);
        }

        public IEnumerable<DCRDetailedProductsModel> GetDCRDetailedProductsForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRDetailedProductsModel> IlstDCRDetailedProducts = null;
            List<DCRDetailedProductsModel> lstMainDCRDetailedProducts = null;

            // Retrieve the Product Details Data from Main Table.
            lstMainDCRDetailedProducts = _objdalDoctorVisit.GetDCRDetailedProductsDetailsForADoctor(company_Code, DCR_Code,
                DCR_Visit_Code);
            IlstDCRDetailedProducts = lstMainDCRDetailedProducts.AsEnumerable();

            return IlstDCRDetailedProducts;
        }


        public IEnumerable<DCRDetailedProductsModel> GetDCREDDetailedProductsForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code)
        {
            IEnumerable<DCRDetailedProductsModel> IlstDCRDetailedProducts = null;
            _objdalDoctorVisit = new DAL_DoctorVisit();

            DCR_Visit_Code = DCR_Visit_Code.Replace("ED", "");
            IlstDCRDetailedProducts = _objdalDoctorVisit.GetDCREDDetailedProductsDetailsForADoctor(
                company_Code, DCR_Code, DCR_Visit_Code).AsEnumerable();

            return IlstDCRDetailedProducts;
        }


        // Methods Overloading
        public string InsertDCRDetailedProducts(string company_Code, string DCR_Code, string DCR_Visit_Code, string detProdJSON, string WA_Doctor_Visit_Code)
        {
            IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel = (IEnumerable<DCRDetailedProductsModel>)JsonConvert.DeserializeObject(detProdJSON, typeof(List<DCRDetailedProductsModel>));
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.InsertDCRDetailedProducts(company_Code, DCR_Code, DCR_Visit_Code, IDCRDetailedProductsModel, WA_Doctor_Visit_Code);
        }

        // Overloading
        public string InsertDCRDetailedProducts(string company_Code, string DCR_Code, string DCR_Visit_Code, IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel, string WA_Doctor_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.InsertDCRDetailedProducts(company_Code, DCR_Code, DCR_Visit_Code, IDCRDetailedProductsModel, WA_Doctor_Visit_Code);
        }

        public IEnumerable<DCRChemistVisitModel> GetDCRChemistVisitForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code, int WA_DATA_EXIST)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRChemistVisitModel> IlstDCRChemistVisit = null;
            List<DCRChemistVisitModel> lstMainDCRChemistVisit = null;

            // Retrieve the Product Details Data from Main Table.
            lstMainDCRChemistVisit = _objdalDoctorVisit.GetDCRChemistsVisitDetailsForADoctor(company_Code, DCR_Code,
                DCR_Visit_Code);
            IlstDCRChemistVisit = lstMainDCRChemistVisit.AsEnumerable();
            return IlstDCRChemistVisit;
        }


        public IEnumerable<DCRChemistVisitModel> GetDCREDChemistVisitForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRChemistVisitModel> IlstDCRChemistVisit = null;

            DCR_Visit_Code = DCR_Visit_Code.Replace("ED", "");
            IlstDCRChemistVisit = _objdalDoctorVisit.GetDCREDChemistsVisitDetailsForADoctor(
                    company_Code, DCR_Code, DCR_Visit_Code).AsEnumerable();

            return IlstDCRChemistVisit;
        }

        public IEnumerable<DCRRCPADetailsModel> GetDCRRCPADetailsForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code)
        {
            // Create Instances.
            _objdalDoctorVisit = new DAL_DoctorVisit();
            IEnumerable<DCRRCPADetailsModel> IlstDCRRCPADetailsModel = null;
            List<DCRRCPADetailsModel> lstMainDCRRCPADetailsModel = null;

            // Retrieve the Product Details Data from Main Table.
            lstMainDCRRCPADetailsModel = _objdalDoctorVisit.GetDCRRCPADetailsForADoctor(company_Code, DCR_Code,
                DCR_Visit_Code);

            IlstDCRRCPADetailsModel = lstMainDCRRCPADetailsModel.AsEnumerable();
            return IlstDCRRCPADetailsModel;
        }

        public IEnumerable<DCRRCPADetailsModel> GetDCREDRCPADetailsForADoctor(string company_Code, string DCR_Code,
            string DCR_Visit_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            DCR_Visit_Code = DCR_Visit_Code.Replace("ED", "");
            IEnumerable<DCRRCPADetailsModel> IlstDCRRCPADetailsModel = null;

            IlstDCRRCPADetailsModel = _objdalDoctorVisit.GetDCREDRCPADetailsForADoctor
                (company_Code, DCR_Code, DCR_Visit_Code).AsEnumerable();
            return IlstDCRRCPADetailsModel;
        }

        public string InsertDCRChemistAndRCPA(string company_Code, string DCR_Code, string DCR_Visit_Code,
            string chemistJSON, string RCPAJson, int chemistMaxCode, int rcpaMaxCode, string user_Code, string DCR_Actual_Date)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();

            // converts json string to Model objects.
            IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel = (IEnumerable<DCRChemistVisitModel>)JsonConvert.DeserializeObject(chemistJSON, typeof(List<DCRChemistVisitModel>));
            IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel = (IEnumerable<DCRRCPADetailsModel>)JsonConvert.DeserializeObject(RCPAJson, typeof(List<DCRRCPADetailsModel>));

            // generate the DCR Chemist code.(unique code)
            CreateChemistDetailsCode(ref IDCRChemistVisitModel, DCR_Code, ref chemistMaxCode);

            // generate the DCR RCPA code.(unique code)
            CreateRCPADetailsCode(ref IDCRRCPADetailsModel, DCR_Code, IDCRChemistVisitModel, ref rcpaMaxCode);

            // call dal.
            string result = _objdalDoctorVisit.InsertDCRChemistAndRCPADetails(company_Code, DCR_Code, DCR_Visit_Code, user_Code, DCR_Actual_Date,
                IDCRChemistVisitModel, IDCRRCPADetailsModel);
            return result;

        }

        public string InsetDoctorVisitDataForMobile(string company_Code, string DCR_Code, string Doctor_Visit_Code, string user_Code, string region_Code,
            string DCR_Actual_Date, string docJSON, string inputsJSON, string chemistJSON, string RCPAJSON, int Doctor_Visit_Max_Code,
            string lattitude, string longtitude, string location, int Inputs_Max_Code, int chemistMaxCode, int RCPAMaxCode,
            bool chemistModified, bool inputsModified, bool is_WA_Doctor, bool detailProductModified, string detProdJson)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();

            IEnumerable<DCRDoctorVisitModel> IDCRDoctorVisitModel = null;
            IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel = null;
            IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel = null;
            IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel = null;
            IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel = null;
            string WA_Doctor_Visit_Code = Doctor_Visit_Code;

            // converts json string to Model objects.
            IDCRDoctorVisitModel = (IEnumerable<DCRDoctorVisitModel>)JsonConvert.DeserializeObject(docJSON, typeof(List<DCRDoctorVisitModel>));

            // Inputs..
            if (!inputsModified && is_WA_Doctor)
            {
                IDCRProductDetailsModel = GetDCREDProductsDetailsForADoctor(company_Code, DCR_Code, user_Code, DCR_Actual_Date, Doctor_Visit_Code);
                inputsModified = true;
            }
            else
            {
                IDCRProductDetailsModel = (IEnumerable<DCRProductDetailsModel>)JsonConvert.DeserializeObject(inputsJSON, typeof(List<DCRProductDetailsModel>));
            }

            // Detailed Products
            if (!detailProductModified && is_WA_Doctor)
            {
                IDCRDetailedProductsModel = GetDCREDDetailedProductsForADoctor(company_Code, DCR_Code, WA_Doctor_Visit_Code);
                detailProductModified = true;
            }
            else
            {
                IDCRDetailedProductsModel = (IEnumerable<DCRDetailedProductsModel>)JsonConvert.DeserializeObject(detProdJson, typeof(List<DCRDetailedProductsModel>));
            }

            // Chemist and RCPA.
            if (!chemistModified && is_WA_Doctor)
            {
                IDCRChemistVisitModel = GetDCREDChemistVisitForADoctor(company_Code, DCR_Code, Doctor_Visit_Code);
                if (IDCRChemistVisitModel != null && IDCRChemistVisitModel.ToList().Count > 0)
                {
                    IDCRChemistVisitModel.ToList().ForEach(che => che.Local_Ref_Code = che.DCR_Chemists_Code);
                }
                IDCRRCPADetailsModel = GetDCREDRCPADetailsForADoctor(company_Code, DCR_Code, Doctor_Visit_Code);
                chemistModified = true;
            }
            else
            {
                IDCRChemistVisitModel = (IEnumerable<DCRChemistVisitModel>)JsonConvert.DeserializeObject(chemistJSON, typeof(List<DCRChemistVisitModel>));
                IDCRRCPADetailsModel = (IEnumerable<DCRRCPADetailsModel>)JsonConvert.DeserializeObject(RCPAJSON, typeof(List<DCRRCPADetailsModel>));
            }

            DCRDoctorVisitModel dcrDoctorVisitModel = ((DCRDoctorVisitModel)IDCRDoctorVisitModel.FirstOrDefault());
            // if record status is 1, we generate the doctor visit code.
            // if record status is 3, this doctor is drafted doctor.
            if (dcrDoctorVisitModel.Record_Status == "1")
            {
                Doctor_Visit_Code = DCR_Code.Replace(DCR_CODE_PREFIX, DCR_DOCTOR_VISIT_CODE_PREFIX) + (++Doctor_Visit_Max_Code).ToString();
            }

            // if source of entry is web we retriev the lat, long and loc from session.
            // if source of entry is tablet, dont get the web lat, long and loc.
            if (dcrDoctorVisitModel.Source_of_Entry.ToUpper() == "WEB")
            {

                dcrDoctorVisitModel.Lattitude = dcrDoctorVisitModel.Lattitude == null ? lattitude : dcrDoctorVisitModel.Lattitude;
                dcrDoctorVisitModel.Longtitude = dcrDoctorVisitModel.Longtitude == null ? longtitude : dcrDoctorVisitModel.Longtitude;
                dcrDoctorVisitModel.Location = dcrDoctorVisitModel.Location == null ? location : dcrDoctorVisitModel.Location;
            }
            else
            {
                dcrDoctorVisitModel.Lattitude = dcrDoctorVisitModel.Lattitude == null ? lattitude : dcrDoctorVisitModel.Lattitude;
                dcrDoctorVisitModel.Longtitude = dcrDoctorVisitModel.Longtitude == null ? longtitude : dcrDoctorVisitModel.Longtitude;
                dcrDoctorVisitModel.Location = dcrDoctorVisitModel.Location == null ? location : dcrDoctorVisitModel.Location;

            }

            // generate the DCR Product Details code.(unique code)
            CreateProductDetailsCode(ref IDCRProductDetailsModel, DCR_Code, ref Inputs_Max_Code);
            CreateChemistDetailsCode(ref IDCRChemistVisitModel, DCR_Code, ref chemistMaxCode);
            CreateRCPADetailsCode(ref IDCRRCPADetailsModel, DCR_Code, IDCRChemistVisitModel, ref RCPAMaxCode);

            List<DCRProductDetailsModel> DCRProductDetailemodel = IDCRProductDetailsModel.ToList().Where(Pr => Pr.Quantity_Provided == "0").ToList();
            //if (DCRProductDetailemodel.Count > 0)
            //{
            //    return "For Sample/Promotional items (" + DCRProductDetailemodel[0].Product_Name + ") must be greater than 0.";
            //}


            Doctor_Visit_Code = _objdalDoctorVisit.InsertDoctorVisitDataMobile(company_Code, DCR_Code, Doctor_Visit_Code, user_Code, region_Code, DCR_Actual_Date,
                IDCRDoctorVisitModel, IDCRProductDetailsModel, IDCRChemistVisitModel, IDCRRCPADetailsModel, IDCRDetailedProductsModel, chemistModified, inputsModified, detailProductModified);

            if (is_WA_Doctor)
            {
                //IEnumerable<DCRDetailedProductsModel> IlstDCRDetailedProducts = GetDCREDDetailedProductsForADoctor(company_Code, DCR_Code, WA_Doctor_Visit_Code);
                IEnumerable<DCRDoctorAccompanistModel> IlstDCRDoctorAccompanistModel = GetDCREDDoctorAccompanistForADoctor(company_Code, DCR_Actual_Date, DCR_Code, WA_Doctor_Visit_Code);
                //InsertDCRDetailedProducts(company_Code, DCR_Code, Doctor_Visit_Code, IlstDCRDetailedProducts, WA_Doctor_Visit_Code);
                InsertDCRDoctorAccompanist(company_Code, DCR_Code, Doctor_Visit_Code, IlstDCRDoctorAccompanistModel, WA_Doctor_Visit_Code);
            }
            return Doctor_Visit_Code;

        }

        public SqlResultModel ValidateCategoryVisitCountRestriction(string company_Code, string user_Code, string region_Code,
        string doctor_Code, string category_Code, string DCR_Actual_Date)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.ValidateCategoryVisitCountRestriction(company_Code, user_Code, region_Code, doctor_Code, category_Code, DCR_Actual_Date);
        }
        public string InserDCRDoctorVisitAttachment(string DCR_Code, string user_code, string File_Name, DateTime DCR_Actual_Date, string Blob_Url, string company_Code, int Doctor_Visit_Max_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            string DCR_Visit_Code = DCR_Code.Replace(DCR_CODE_PREFIX, DCR_DOCTOR_VISIT_CODE_PREFIX) + (++Doctor_Visit_Max_Code).ToString();
            return _objdalDoctorVisit.InserDCRDoctorVisitAttachment(user_code, DCR_Visit_Code, File_Name, DCR_Actual_Date, Blob_Url, company_Code);
        }
        public DataSet GetDCRPOBDetailsByVisitCode(DateTime Order_Date, string Customer_Code, string Customer_Region_Code, string Customer_Name, string Customer_Speciality, string User_Code, string Company_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDCRPOBDetailsByVisitCode(Order_Date, Customer_Code, Customer_Region_Code, Customer_Name, Customer_Speciality, User_Code, Company_Code);
        }
        public DataSet GetLineOfBusiness(string region_code, string company_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetLineOfBusiness(region_code, company_Code);
        }
        public List<DoctorCaptionName> GetDCRHeaderName(string RegionCodes, string company_code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDoctorCaptionName(RegionCodes, company_code);
        }
        public string GetAccompanistMandatoryInDoctorVisit(string user_code, DateTime dcr_date, string company_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetAccompanistMandatoryInDoctorVisit(user_code, dcr_date, company_Code);
        }
        public List<DCRDoctorVisitModel> GetDoctorVisitPOBCount(DateTime Dcr_Date, string User_Code, string company_Code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDoctorVisitPOBCount(Dcr_Date, User_Code, company_Code);
        }
        public BusinessActivityMaster GetDoctorBusinessAndActivityMaster(string activity, string company_Code, string User_Type_Code, string user_code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDoctorBusinessAndActivityMaster(activity, company_Code, User_Type_Code, user_code);
        }
        public DCRActivityDetails GetDCRActivity(string Visit_code, string flag)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDCRActivity(Visit_code, flag);
        }
        public BusinessActivityMaster GeMCDetails(string regionCode, string companyCode, string customer_code, DateTime dcrDate)
        {

            _objdalDoctorVisit = new DAL_DoctorVisit();
            //return GenerateOutputJson("", _objdalDoctorVisit.GeMCDetails(regionCode, companyCode, category_Code, speciality_Code, dcrDate), 0, SUCCESS);
            return _objdalDoctorVisit.GeMCDetails(regionCode, companyCode, customer_code, dcrDate);

        }
        public Tuple<List<DCRDoctorVisitModel>, List<DCRDetailedProductsModel>> GetDoctorBusinessStatus(string doctor_code, DateTime dcr_date, string doctor_region_code, string user_type_code)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDoctorBusinessStatus(doctor_code, dcr_date, doctor_region_code, user_type_code);
        }

        public List<CompetitorProductaddition> Getproductnames(string CompanyCode)
        {
            List<CompetitorProductaddition> lstproduct = null;
            try
            {
                _objdalDoctorVisit = new DAL_DoctorVisit();
                lstproduct = _objdalDoctorVisit.Getproductnames(CompanyCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstproduct;
        }

        public List<CompetitorProductaddition> GetCompetitorproductnames(string CompanyCode, string Doctor_Code, string DCR_Code, string DCR_Visit_Code, string DCR_Detail_Product_Code, string Sale_Product_Code)
        {
            List<CompetitorProductaddition> lstproduct = null;
            try
            {
                _objdalDoctorVisit = new DAL_DoctorVisit();
                lstproduct = _objdalDoctorVisit.GetCompetitorproductnames(CompanyCode, Doctor_Code, DCR_Code, DCR_Visit_Code, DCR_Detail_Product_Code, Sale_Product_Code).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstproduct;
        }
        public List<DCRProductCompetitorAddition> GetAllCompetitorDetails(string CompanyCode, string DCRVisitCode)
        {
            List<DCRProductCompetitorAddition> lstproduct = null;
            try
            {
                _objdalDoctorVisit = new DAL_DoctorVisit();
                lstproduct = _objdalDoctorVisit.GetAllCompetitorDetails(CompanyCode, DCRVisitCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstproduct;
        }
        public int Getchkprod(DCRProductCompetitorAddition objProDetails)
        {

            int result = 0;
            _objdalDoctorVisit = new DAL_DoctorVisit();
            result = _objdalDoctorVisit.Getchkprod(objProDetails);
            return result;
        }
        public int GetchkComp(string CompetitorName, string Company_Code)
        {

            int result = 0;
            _objdalDoctorVisit = new DAL_DoctorVisit();
            result = _objdalDoctorVisit.GetchkComp(CompetitorName, Company_Code);
            return result;
        }

        public List<DCRProductBatch> GetDCRProductBatch(string productCode, string dcrDate, string userCode, string entity, string cv_visit_id,string Flag)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetDCRProductBatch(productCode, dcrDate, userCode, entity, cv_visit_id, Flag);
        }

        public List<DcrMc> GetMCDetailsforDropdown(string regionCode, string companyCode, string customer_code, string dcrDate)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetMCDetailsforDropdown(regionCode, companyCode, customer_code, dcrDate);

        }
        public List<CMEDetails> GetCMEProduct(int CME_ID, string Doctor_Code,int Activity_Id)
        {
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetCMEProduct(CME_ID, Doctor_Code, Activity_Id);
        }
        public int ValidateCME(int CME_ID, string Doctor_Code, int Activity_Id)
        {

            int result = 0;
            _objdalDoctorVisit = new DAL_DoctorVisit();
            result = _objdalDoctorVisit.ValidateCME(CME_ID, Doctor_Code, Activity_Id);
            return result;
        }
        public int Getsurvey(string UserCode,string CampaignCode)
        {

            int result = 0;
            _objdalDoctorVisit = new DAL_DoctorVisit();
            result = _objdalDoctorVisit.Getsurvey(UserCode, CampaignCode);
            return result;
        }
        public List<SurveyDetails> GetsurveyDetails(string CompanyCode, string CampaignCode,string RegionCode)
        {

          //  int result = 0;
            _objdalDoctorVisit = new DAL_DoctorVisit();
            return _objdalDoctorVisit.GetsurveyDetails(CompanyCode, CampaignCode,RegionCode);
           // return result;
        }

    }
}