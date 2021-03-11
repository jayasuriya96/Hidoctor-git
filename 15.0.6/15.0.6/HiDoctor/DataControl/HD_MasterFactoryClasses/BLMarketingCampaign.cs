using MVCModels;
using MVCModels.HiDoctor_Master;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_Master
{
    public class BLMarketingCampaign
    {
        DataControl.HiDoctor_Master.DALMarketingCampaign objMC = new DALMarketingCampaign();
        public IEnumerable<MVCModels.MCHeaderModel> GetMarketingCampaignNames(string companyCode, string regionCode)
        {
            return objMC.GetMarketingCampaignNames(companyCode, regionCode);
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCDoctors(string companyCode, string regionCode,
                      string campaignCode, string customerStatus, string doctorName)
        {
            return objMC.GetMCDoctors(companyCode, regionCode, campaignCode, customerStatus, doctorName);
        }
        /// <summary>
        /// Method to get all Doctors based on MArketing Campaign(Specaility and Category)for the selected region
        /// AJAY VAMSI DNV
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="campaignCode"></param>
        /// <param name="customerStatus"></param>
        /// <param name="doctorName"></param>
        /// <returns></returns>
        public List<MVCModels.MCProductCustomerModel> GetMCDoctorsByCampaignandRegion(string companyCode, string regionCode,
                      string campaignCode, string customerStatus, string doctorName)
        {
            return objMC.GetMCDoctorsByCampaignandRegion(companyCode, regionCode, campaignCode, customerStatus, doctorName);
        }

        public bool DoctorProdMappingDelete(string companyCode, string regionCode, string currentregionCode, string doctorCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            return objMC.DoctorProdMappingDelete(companyCode, regionCode, currentregionCode, doctorCode, campaignCode, mappingTo, typeofMapping);
        }
        public bool ProdDoctorMappingDelete(string companyCode, string regionCode, string currentregionCode, string productCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            return objMC.ProdDoctorMappingDelete(companyCode, regionCode, currentregionCode, productCode, campaignCode, mappingTo, typeofMapping);
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetDoctorsByRegionAndStatus(string companycode, string regioncode,
            string customerstatus, string doctorName)
        {
            return objMC.GetDoctorsByRegionAndStatus(companycode, regioncode, customerstatus, doctorName);
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetAllSalesProducts(string companyCode, string productName, string regionCode)
        {
            return objMC.GetAllSalesProducts(companyCode, productName, regionCode);
        }
        /// <summary>
        /// To Get All Sale Products By Region Selected 
        /// AJAY VAMSI 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="doctorCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="campaignCode"></param>
        /// <returns></returns>

        public List<MVCModels.MCProductCustomerModel> GetAllSalesProductsByRegion(string companyCode, string productName, string regionCode)
        {
            return objMC.GetAllSalesProductsByRegion(companyCode, productName, regionCode);
        }


        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCProductsByDoctor(string companyCode, string doctorCode, string regionCode,
            string campaignCode, string currentregionCode, string mappingTo, string typeOfMapping)
        {
            return objMC.GetMCProductsByDoctor(companyCode, doctorCode, regionCode, campaignCode, currentregionCode, mappingTo, typeOfMapping);
        }

        public string InsertCustomerProduct(string companyCode, string doctorCode, string productCode, string campaignCode, string regionCode,
              string refType, string createdBy, string currentregionCode, string mappingTo, string TypeOfMapping)
        {
            return objMC.InsertCustomerProduct(companyCode, doctorCode, productCode, campaignCode, regionCode, refType, createdBy, currentregionCode, mappingTo, TypeOfMapping);
        }

        public string InsertCustomerProductMarketingMapping(string companyCode, string doctorCode, string productCode, string campaignCode, string regionCode,
        string refType, string createdBy, string currentregionCode, string mappingTo, string TypeOfMapping)
        {
            return objMC.InsertCustomerProductMarketingMapping(companyCode, doctorCode, productCode, campaignCode, regionCode, refType, createdBy, currentregionCode, mappingTo, TypeOfMapping);
        }
        //public string InsertMCDoctorProductMapping(string companyCode, string customerCode, string campaignCode, string regionCode,
        //        string doctorDetails, string productDetails, string mappingType, string customerCategory, string createdBy,
        //    string selectedProductCode, string DOCTOR_PRODUCT_MAPPING_VALIDATION, string CustomerCount, string campaignName, string mode)
        //{
        //    string result = string.Empty;
        //    List<MVCModels.MCProductCustomerModel> lstMC = new List<MVCModels.MCProductCustomerModel>();
        //    int rowsAffected = 0;
        //    string refType = string.Empty;
        //    if ("0" == campaignCode)
        //    {
        //        refType = "MAPPING";
        //    }
        //    else
        //    {
        //        refType = "MARKETING_CAMPAIGN";
        //    }
        //    if ("DOCTOR_PRODUCT" == mappingType)
        //    {
        //        string[] arProducts = productDetails.Split('$');
        //        if (arProducts.Length > 1)
        //        {
        //            foreach (var product in arProducts)
        //            {
        //                if (product != "")
        //                {
        //                    MVCModels.MCProductCustomerModel objMCDocPro = new MVCModels.MCProductCustomerModel();
        //                    objMCDocPro.Product_Code = Convert.ToString(product.Split('^')[0]);
        //                    objMCDocPro.Support_Quantity = (product.Split('^')[1] == "") ? null : Convert.ToString(product.Split('^')[1]);
        //                    objMCDocPro.Potential_Quantity = (product.Split('^')[2] == "") ? null : Convert.ToString(product.Split('^')[2]);
        //                    objMCDocPro.Product_Priority_No = Convert.ToString(product.Split('^')[3]);
        //                    objMCDocPro.Company_Code = companyCode;
        //                    objMCDocPro.Campaign_Code = ((campaignCode == "" || campaignCode == "0") ? null : campaignCode);
        //                    objMCDocPro.Customer_Code = customerCode;
        //                    objMCDocPro.Customer_Category_Code = customerCategory;
        //                    objMCDocPro.Ref_Type = refType;
        //                    objMCDocPro.Region_Code = regionCode;
        //                    objMCDocPro.Created_By = createdBy;
        //                    objMCDocPro.Created_Date = System.DateTime.Now.ToString();
        //                    objMCDocPro.Record_Status = "1";
        //                    lstMC.Add(objMCDocPro);
        //                }
        //            }
        //        }
        //    }
        //    else
        //    {
        //        string[] arDoctors = doctorDetails.Split('$');
        //        if (arDoctors.Length > 1)
        //        {
        //            foreach (var doctor in arDoctors)
        //            {
        //                if (doctor != "")
        //                {
        //                    MVCModels.MCProductCustomerModel objMCDocPro = new MVCModels.MCProductCustomerModel();
        //                    objMCDocPro.Product_Code = Convert.ToString(selectedProductCode);
        //                    objMCDocPro.Customer_Code = doctor.Split('^')[0];
        //                    objMCDocPro.Support_Quantity = (doctor.Split('^')[1] == "") ? null : Convert.ToString(doctor.Split('^')[1]);
        //                    objMCDocPro.Potential_Quantity = (doctor.Split('^')[2] == "") ? null : Convert.ToString(doctor.Split('^')[2]);
        //                    objMCDocPro.Company_Code = companyCode;
        //                    objMCDocPro.Campaign_Code = ((campaignCode == "" || campaignCode == "0") ? null : campaignCode);
        //                    objMCDocPro.Customer_Category_Code = doctor.Split('^')[3];
        //                    objMCDocPro.Ref_Type = refType;
        //                    objMCDocPro.Region_Code = regionCode;
        //                    objMCDocPro.Created_By = createdBy;
        //                    objMCDocPro.Created_Date = System.DateTime.Now.ToString();
        //                    objMCDocPro.Record_Status = "1";
        //                    lstMC.Add(objMCDocPro);
        //                }
        //            }
        //        }
        //    }
        //    if ("0" == campaignCode)
        //    {
        //        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                mappingType, selectedProductCode);
        //        if (rowsAffected > 0)
        //        {
        //            result = "SUCCESS:The selected products are mapped to the doctor";
        //        }
        //        else
        //        {
        //            result = "ERROR:Error while mapping the doctor and product";
        //        }
        //    }
        //    else
        //    {
        //        if (DOCTOR_PRODUCT_MAPPING_VALIDATION == "R")
        //        {
        //            List<MVCModels.MCProductCustomerModel> lstCurrentMC = new List<MVCModels.MCProductCustomerModel>();
        //            lstCurrentMC = lstMC;
        //            int alreadyMappedCount = 0;
        //            List<MVCModels.MCProductCustomerModel> lstCheckCount = new List<MVCModels.MCProductCustomerModel>();
        //            lstCheckCount = new List<MVCModels.MCProductCustomerModel>(objMC.CheckCustomerCountInDocProMapping(companyCode, campaignCode, regionCode));
        //            alreadyMappedCount = lstCheckCount.Count;
        //            //if (lstCheckCount.Count > 0)
        //            //{
        //            if ("DOCTOR_PRODUCT" == mappingType)
        //            {
        //                #region doctor product mapping
        //                if ("EDIT" != mode.ToUpper())
        //                {
        //                    List<MVCModels.MCProductCustomerModel> lstNewDoctors =
        //                          lstCurrentMC.Where(s => !lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();

        //                    // lstCurrentMC.RemoveAll(s => lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any());
        //                    if ((Convert.ToInt32(lstNewDoctors.Count) + alreadyMappedCount) > Convert.ToInt32(CustomerCount))
        //                    {
        //                        result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //                    }
        //                    else
        //                    {
        //                        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                            mappingType, selectedProductCode);
        //                        if (rowsAffected > 0)
        //                        {
        //                            result = "SUCCESS:The selected products are mapped to the doctor";
        //                        }
        //                        else
        //                        {
        //                            result = "ERROR:Error while mapping the doctor and product";
        //                        }
        //                    }
        //                }
        //                else
        //                {
        //                    rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                            mappingType, selectedProductCode);
        //                    if (rowsAffected > 0)
        //                    {
        //                        result = "SUCCESS:The selected products are mapped to the doctor";
        //                    }
        //                    else
        //                    {
        //                        result = "ERROR:Error while mapping the doctor and product";
        //                    }
        //                }
        //                #endregion doctor product mapping
        //            }
        //            else
        //            {
        //                #region product doctor mapping
        //                if ("EDIT" == mode.ToUpper())
        //                {
        //                    List<MVCModels.MCProductCustomerModel> lstNewDoctors = new List<MVCModels.MCProductCustomerModel>();

        //                    lstNewDoctors = lstCurrentMC.Where(s => !lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();


        //                    List<MVCModels.MCProductCustomerModel> lstMappedDoctors = new List<MVCModels.MCProductCustomerModel>(
        //                                objMC.GetMCDoctorsByProduct(companyCode, selectedProductCode, regionCode, campaignCode));

        //                    List<MVCModels.MCProductCustomerModel> lstUnSelectedDocs = new List<MVCModels.MCProductCustomerModel>();
        //                    lstUnSelectedDocs = lstMappedDoctors.Where(s => !lstCurrentMC.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();
        //                    //List<MVCModels.MCProductCustomerModel> lstMappedDoctors =
        //                    //    lstCurrentMC.Where(s => lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();

        //                    if ((Convert.ToInt32(lstNewDoctors.Count) + alreadyMappedCount - Convert.ToInt32(lstUnSelectedDocs.Count)) >
        //                        Convert.ToInt32(CustomerCount))
        //                    {
        //                        result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //                    }
        //                    else
        //                    {
        //                        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                            mappingType, selectedProductCode);
        //                        if (rowsAffected > 0)
        //                        {
        //                            result = "SUCCESS:The selected products are mapped to the doctor";
        //                        }
        //                        else
        //                        {
        //                            result = "ERROR:Error while mapping the doctor and product";
        //                        }
        //                    }
        //                }
        //                else
        //                {
        //                    List<MVCModels.MCProductCustomerModel> lstNewDoctors = new List<MVCModels.MCProductCustomerModel>();

        //                    lstNewDoctors = lstCurrentMC.Where(s => !lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();
        //                    if ((Convert.ToInt32(lstNewDoctors.Count) + Convert.ToInt32(alreadyMappedCount)) > Convert.ToInt32(CustomerCount))
        //                    {
        //                        result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //                    }
        //                    else
        //                    {
        //                        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                            mappingType, selectedProductCode);
        //                        if (rowsAffected > 0)
        //                        {
        //                            result = "SUCCESS:The selected products are mapped to the doctor";
        //                        }
        //                        else
        //                        {
        //                            result = "ERROR:Error while mapping the doctor and product";
        //                        }
        //                    }
        //                }
        //                //if ("EDIT" != mode.ToUpper())
        //                //{

        //                //    lstNewDoctors =
        //                //           lstCurrentMC.Where(s => !lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any()).ToList();

        //                //    //lstCurrentMC.RemoveAll(s => lstCheckCount.Where(e => e.Customer_Code == s.Customer_Code).Any());
        //                //    if ((Convert.ToInt32(lstNewDoctors.Count) + alreadyMappedCount) > Convert.ToInt32(CustomerCount))
        //                //    {
        //                //        result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //                //    }
        //                //    else
        //                //    {
        //                //        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                //            mappingType, selectedProductCode);
        //                //        if (rowsAffected > 0)
        //                //        {
        //                //            result = "SUCCESS:The selected products are mapped to the doctor";
        //                //        }
        //                //        else
        //                //        {
        //                //            result = "ERROR:Error while mapping the doctor and product";
        //                //        }
        //                //    }
        //                //}
        //                //else
        //                //{
        //                //    if (Convert.ToInt32(lstMC.Count) > Convert.ToInt32(CustomerCount))
        //                //    {
        //                //        result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //                //    }
        //                //    else
        //                //    {
        //                //        rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                //            mappingType, selectedProductCode);
        //                //        if (rowsAffected > 0)
        //                //        {
        //                //            result = "SUCCESS:The selected products are mapped to the doctor";
        //                //        }
        //                //        else
        //                //        {
        //                //            result = "ERROR:Error while mapping the doctor and product";
        //                //        }
        //                //    }
        //                //}
        //                #endregion product doctor mapping
        //            }
        //            //}
        //            //else
        //            //{
        //            //    if ("EDIT" != mode.ToUpper())
        //            //    {
        //            //        if (Convert.ToInt32(lstMC.Count) > Convert.ToInt32(CustomerCount))
        //            //        {
        //            //            result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //            //        }
        //            //        else
        //            //        {
        //            //            rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //            //                        mappingType, selectedProductCode);
        //            //            if (rowsAffected > 0)
        //            //            {
        //            //                result = "SUCCESS:The selected products are mapped to the doctor";
        //            //            }
        //            //            else
        //            //            {
        //            //                result = "ERROR:Error while mapping the doctor and product";
        //            //            }
        //            //        }
        //            //    }
        //            //    else
        //            //    {
        //            //        if ("DOCTOR_PRODUCT" == mappingType)
        //            //        {
        //            //            rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //            //                        mappingType, selectedProductCode);
        //            //            if (rowsAffected > 0)
        //            //            {
        //            //                result = "SUCCESS:The selected products are mapped to the doctor";
        //            //            }
        //            //            else
        //            //            {
        //            //                result = "ERROR:Error while mapping the doctor and product";
        //            //            }
        //            //        }
        //            //        else
        //            //        {
        //            //            if (Convert.ToInt32(lstMC.Count) > Convert.ToInt32(CustomerCount))
        //            //            {
        //            //                result = "ERROR:You can select maximum of " + CustomerCount + " doctor(s) for " + campaignName + " campaign";
        //            //            }
        //            //            else
        //            //            {
        //            //                rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //            //                            mappingType, selectedProductCode);
        //            //                if (rowsAffected > 0)
        //            //                {
        //            //                    result = "SUCCESS:The selected products are mapped to the doctor";
        //            //                }
        //            //                else
        //            //                {
        //            //                    result = "ERROR:Error while mapping the doctor and product";
        //            //                }
        //            //            }
        //            //        }
        //            //    }
        //            //}
        //        }
        //        else
        //        {
        //            rowsAffected = objMC.InsertMCDoctorProductMapping(lstMC, customerCode, campaignCode, companyCode, regionCode, refType,
        //                mappingType, selectedProductCode);
        //            if (rowsAffected > 0)
        //            {
        //                result = "SUCCESS:The selected products are mapped to the doctor";
        //            }
        //            else
        //            {
        //                result = "ERROR:Error while mapping the doctor and product";
        //            }
        //        }
        //    }
        //    return result;
        //}

        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCProducts(string companyCode, string campaignCode, string productName)
        {
            return objMC.GetMCProducts(companyCode, campaignCode, productName);
        }

        /// <summary>
        /// To Get All Sale Products based on Divisions for the Selected Region & Campaign
        /// AJAY VAMSI DNV
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="campaignCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="mappingType"></param>
        /// <returns></returns>

        public List<MVCModels.MCProductCustomerModel> GetMCProductsByRegionandCampaign(string compayCode, string campaignCode, string productName, string regionCode, string typeOfMapping)
        {
            return objMC.GetMCProductsByRegionandCampaign(compayCode, campaignCode, productName, regionCode, typeOfMapping);
        }


        public IEnumerable<MVCModels.MCProductCustomerModel> GetMappedDoctorandProductCount(string companyCode,
              string campaignCode, string regionCode, string mappingType, string currentregionCode, string mappingTo, string typeofMapping)
        {
            return objMC.GetMappedDoctorandProductCount(companyCode, campaignCode, regionCode, mappingType, currentregionCode, mappingTo, typeofMapping);
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCDoctorsByProduct(string companyCode, string productCode,
                        string regionCode, string campaignCode, string currentregionCode, string mappingTo, string typeofMapping)
        {
            return objMC.GetMCDoctorsByProduct(companyCode, productCode, regionCode, campaignCode, currentregionCode, mappingTo, typeofMapping);
        }
        public IEnumerable<MVCModels.MCHeaderModel> GetSelectedMCHeader(string companyCode, string campaignCode, string regionCode)
        {
            return objMC.GetSelectedMCHeader(companyCode, campaignCode, regionCode);
        }
        public RegionHierarchyModelMC GetParentHierarchyByRegion(string companyCode, string regionCode, string mappingType, string typeofMapping, string currentregionCode, string campaignCode)
        {
            try
            {
                if (typeofMapping == "GEN_MAP" || typeofMapping == "TAR_MAP")
                {
                    return objMC.GetParentHierarchyByRegion(companyCode, regionCode, currentregionCode);
                }
                else if (typeofMapping == "CME_MAP")
                {
                    return objMC.GetCMEParentHierarchyByRegionandCampaign(companyCode, regionCode, currentregionCode, campaignCode);
                }
                else
                {
                    return objMC.GetParentHierarchyByRegionandCampaign(companyCode, regionCode, currentregionCode, campaignCode);
                }

            }
            catch (Exception ex)
            {

                throw;
            }
        }

        // ******************* START - MARKETING CAMPAGIN *************************//
        public List<MVCModels.HiDoctor_Master.ProductModel> GetOtherThanSalesAndCompetitorProducts(string companyCode)
        {
            return objMC.GetOtherThanSalesAndCompetitorProducts(companyCode);
        }

        public List<MCHeaderModel> GetMarketingCampaignsForARegion(string companyCode, string regionCode, string status, string startDate, string endDate, string mode)
        {
            return objMC.GetMarketingCampaignsForARegion(companyCode, regionCode, status, startDate, endDate, mode);
        }
        public MarketingCampaignModel GetCampaignHeaderDetails(string companyCode, string campaignCode)
        {
            return objMC.GetCampaignHeaderDetails(companyCode, campaignCode);
        }
        public IEnumerable<MVCModels.MCDetailsModel> GetMCProductDetails(string companyCode, string campaignCode)
        {
            return objMC.GetMCProductDetails(companyCode, campaignCode);
        }
        public int InsertMarketingCampaign(string companyCode, string regionCode, MCHeader ObjMCHeader, string companyId, string createdBy, string createdDateTime)
        {
            List<MVCModels.MCDetailsModel> lstMCDetail = new List<MVCModels.MCDetailsModel>();
            int rowsAffected = 0;

            string[] doctCatCode = null;
            string[] docspecCode = null;
            string[] desgCode = null;
            string[] docDesig = null;
            int CompanyId = 0;
            Int32.TryParse(companyId, out CompanyId);
            if (ObjMCHeader.Campaign_Code == null) // Insert
            {
                SPData objData = new SPData();
                ObjMCHeader.Campaign_Code = objData.GetSeqNumber("SEQ_tbl_SFA_MC_Header").ToString();

                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Category_Code))
                {
                    doctCatCode = ObjMCHeader.Customer_Category_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Speciality_Code))
                {
                    docspecCode = ObjMCHeader.Customer_Speciality_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Designation))
                {
                    desgCode = ObjMCHeader.Designation.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.UserType))
                {
                    docDesig = ObjMCHeader.UserType.Split(',');
                }

                DataTable dtCatCode = null;
                if (doctCatCode.Length >= 1)
                {
                    dtCatCode = new DataTable();
                    dtCatCode.Columns.Add("Company_Code", typeof(string));
                    dtCatCode.Columns.Add("Campaign_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Status", typeof(int));
                    dtCatCode.Columns.Add("Company_Id", typeof(int));
                    dtCatCode.Columns.Add("Created_By", typeof(string));
                    dtCatCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int i = 0; i < doctCatCode.Length; i++)
                    {
                        dtCatCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, doctCatCode[i], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtspecCode = null;
                if (docspecCode.Length >= 1)
                {
                    dtspecCode = new DataTable();
                    dtspecCode.Columns.Add("Company_Code", typeof(string));
                    dtspecCode.Columns.Add("Campaign_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Status", typeof(int));
                    dtspecCode.Columns.Add("Company_Id", typeof(int));
                    dtspecCode.Columns.Add("Created_By", typeof(string));
                    dtspecCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int j = 0; j < docspecCode.Length; j++)
                    {
                        dtspecCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, docspecCode[j], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdesgCode = null;
                if (desgCode.Length >= 1)
                {
                    dtdesgCode = new DataTable();
                    dtdesgCode.Columns.Add("Company_Code", typeof(string));
                    dtdesgCode.Columns.Add("Campaign_Code", typeof(string));
                    dtdesgCode.Columns.Add("Region_Type_Code", typeof(string));
                    dtdesgCode.Columns.Add("Mapping_Status", typeof(int));
                    dtdesgCode.Columns.Add("Company_Id", typeof(int));
                    dtdesgCode.Columns.Add("Created_By", typeof(string));
                    dtdesgCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < desgCode.Length; k++)
                    {
                        dtdesgCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, desgCode[k], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdocDesig = null;
                if (docDesig != null && docDesig.Length >= 1)
                {
                    dtdocDesig = new DataTable();
                    dtdocDesig.Columns.Add("Company_Code", typeof(string));
                    dtdocDesig.Columns.Add("Company_Id", typeof(int));
                    dtdocDesig.Columns.Add("Campaign_Code", typeof(string));
                    dtdocDesig.Columns.Add("Survey_Id", typeof(int));
                    dtdocDesig.Columns.Add("User_Type_Code", typeof(string));
                    dtdocDesig.Columns.Add("Created_By", typeof(string));
                    dtdocDesig.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < docDesig.Length; k++)
                    {
                        dtdocDesig.Rows.Add(companyCode, CompanyId, ObjMCHeader.Campaign_Code, ObjMCHeader.Survey, docDesig[k], createdBy, createdDateTime);
                    }
                }
                DataTable dtParRegions = null;
                if (ObjMCHeader.lstRegionCodes.Count >= 1)
                {
                    dtParRegions = new DataTable();
                    dtParRegions.Columns.Add("Company_Code", typeof(string));
                    dtParRegions.Columns.Add("Campaign_Code", typeof(string));
                    dtParRegions.Columns.Add("Participating_Region_Code", typeof(string));
                    dtParRegions.Columns.Add("Record_Status", typeof(int));
                    dtParRegions.Columns.Add("Company_Id", typeof(int));
                    dtParRegions.Columns.Add("Created_By", typeof(string));
                    dtParRegions.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int z = 0; z < ObjMCHeader.lstRegionCodes.Count; z++)
                    {
                        dtParRegions.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, ObjMCHeader.lstRegionCodes[z].Region_Code, 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable ProdSamp = null;
                List<MCProductSampleModel> SampProd = new List<MCProductSampleModel>();
                SampProd = ObjMCHeader.lstProdSamp;
                if (SampProd != null)
                {
                    ProdSamp = new DataTable();

                    ProdSamp.Columns.Add("Company_Code", typeof(string));
                    ProdSamp.Columns.Add("Campaign_Code", typeof(string));
                    ProdSamp.Columns.Add("Product_Code", typeof(string));
                    ProdSamp.Columns.Add("Sample_Code", typeof(string));
                    ProdSamp.Columns.Add("Visit_Order", typeof(int));
                    ProdSamp.Columns.Add("Quantity", typeof(string));
                    ProdSamp.Columns.Add("Record_Status", typeof(int));
                    ProdSamp.Columns.Add("Start_Date", typeof(string));
                    ProdSamp.Columns.Add("Due_Date", typeof(string));
                    ProdSamp.Columns.Add("Input_Type", typeof(string));
                    ProdSamp.Columns.Add("ROI", typeof(decimal));
                    ProdSamp.Columns.Add("Activity_Id", typeof(int));
                    ProdSamp.Columns.Add("Activity_Name", typeof(string));
                    ProdSamp.Columns.Add("Line_Item_Budget", typeof(int));

                    for (int i = 0; i < SampProd.Count; i++)
                    {
                        if (SampProd[i].Product_Code != "")
                        {

                            ProdSamp.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, SampProd[i].Product_Code, SampProd[i].Sample_Code, SampProd[i].Visit_Order,
                            SampProd[i].Quantity, 2, SampProd[i].Start_Date, SampProd[i].Due_Date, SampProd[i].Input_Type, SampProd[i].ROI, SampProd[i].Activity_Id, SampProd[i].Activity_Name, SampProd[i].Line_Item_Budget);

                        }
                    }
                }

                rowsAffected = objMC.InsertMarketingCampaign(companyCode, regionCode, ObjMCHeader, CompanyId, createdBy, createdDateTime, dtCatCode, dtspecCode, dtdesgCode, dtdocDesig, ProdSamp, dtParRegions);

            }
            else if (ObjMCHeader.Campaign_Code != "" && (ObjMCHeader.Status == "UnApproved" || ObjMCHeader.Status == "Applied"))//Update
            {
                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Category_Code))
                {
                    doctCatCode = ObjMCHeader.Customer_Category_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Speciality_Code))
                {
                    docspecCode = ObjMCHeader.Customer_Speciality_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Designation))
                {
                    desgCode = ObjMCHeader.Designation.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.UserType))
                {
                    docDesig = ObjMCHeader.UserType.Split(',');
                }
                DataTable dtCatCode = null;
                if (doctCatCode.Length >= 1)
                {
                    dtCatCode = new DataTable();
                    dtCatCode.Columns.Add("Company_Code", typeof(string));
                    dtCatCode.Columns.Add("Campaign_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Status", typeof(int));
                    dtCatCode.Columns.Add("Company_Id", typeof(int));
                    dtCatCode.Columns.Add("Created_By", typeof(string));
                    dtCatCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int i = 0; i < doctCatCode.Length; i++)
                    {
                        dtCatCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, doctCatCode[i], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtspecCode = null;
                if (docspecCode.Length >= 1)
                {
                    dtspecCode = new DataTable();
                    dtspecCode.Columns.Add("Company_Code", typeof(string));
                    dtspecCode.Columns.Add("Campaign_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Status", typeof(int));
                    dtspecCode.Columns.Add("Company_Id", typeof(int));
                    dtspecCode.Columns.Add("Created_By", typeof(string));
                    dtspecCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int j = 0; j < docspecCode.Length; j++)
                    {
                        dtspecCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, docspecCode[j], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdesgCode = null;
                if (desgCode.Length >= 1)
                {
                    dtdesgCode = new DataTable();
                    dtdesgCode.Columns.Add("Company_Code", typeof(string));
                    dtdesgCode.Columns.Add("Campaign_Code", typeof(string));
                    dtdesgCode.Columns.Add("Region_Type_Code", typeof(string));
                    dtdesgCode.Columns.Add("Mapping_Status", typeof(int));
                    dtdesgCode.Columns.Add("Company_Id", typeof(int));
                    dtdesgCode.Columns.Add("Created_By", typeof(string));
                    dtdesgCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < desgCode.Length; k++)
                    {
                        dtdesgCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, desgCode[k], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdocDesig = null;
                if (docDesig != null && docDesig.Length >= 1)
                {
                    dtdocDesig = new DataTable();
                    dtdocDesig.Columns.Add("Company_Code", typeof(string));
                    dtdocDesig.Columns.Add("Company_Id", typeof(int));
                    dtdocDesig.Columns.Add("Campaign_Code", typeof(string));
                    dtdocDesig.Columns.Add("Survey_Id", typeof(int));
                    dtdocDesig.Columns.Add("User_Type_Code", typeof(string));
                    dtdocDesig.Columns.Add("Created_By", typeof(string));
                    dtdocDesig.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < docDesig.Length; k++)
                    {
                        dtdocDesig.Rows.Add(companyCode, CompanyId, ObjMCHeader.Campaign_Code, ObjMCHeader.Survey, docDesig[k], createdBy, createdDateTime);
                    }
                }
                DataTable dtParRegions = null;
                if (ObjMCHeader.lstRegionCodes.Count >= 1)
                {
                    dtParRegions = new DataTable();
                    dtParRegions.Columns.Add("Company_Code", typeof(string));
                    dtParRegions.Columns.Add("Campaign_Code", typeof(string));
                    dtParRegions.Columns.Add("Participating_Region_Code", typeof(string));
                    dtParRegions.Columns.Add("Record_Status", typeof(int));
                    dtParRegions.Columns.Add("Company_Id", typeof(int));
                    dtParRegions.Columns.Add("Created_By", typeof(string));
                    dtParRegions.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int z = 0; z < ObjMCHeader.lstRegionCodes.Count; z++)
                    {
                        dtParRegions.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, ObjMCHeader.lstRegionCodes[z].Region_Code, 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                //update
                DataTable ProdSamp = null;
                List<MCProductSampleModel> SampProd = new List<MCProductSampleModel>();
                SampProd = ObjMCHeader.lstProdSamp;
                if (SampProd != null)
                {
                    ProdSamp = new DataTable();

                    ProdSamp.Columns.Add("Company_Code", typeof(string));
                    ProdSamp.Columns.Add("Campaign_Code", typeof(string));
                    ProdSamp.Columns.Add("Product_Code", typeof(string));
                    ProdSamp.Columns.Add("Sample_Code", typeof(string));
                    ProdSamp.Columns.Add("Visit_Order", typeof(int));
                    ProdSamp.Columns.Add("Quantity", typeof(string));
                    ProdSamp.Columns.Add("Record_Status", typeof(int));
                    ProdSamp.Columns.Add("Start_Date", typeof(string));
                    ProdSamp.Columns.Add("Due_Date", typeof(string));
                    ProdSamp.Columns.Add("Input_Type", typeof(string));
                    ProdSamp.Columns.Add("ROI", typeof(decimal));
                    ProdSamp.Columns.Add("Activity_Id", typeof(int));
                    ProdSamp.Columns.Add("Activity_Name", typeof(string));
                    ProdSamp.Columns.Add("Line_Item_Budget", typeof(int));

                    for (int i = 0; i < SampProd.Count; i++)
                    {
                        if (SampProd[i].Product_Code != "")
                        {

                            ProdSamp.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, SampProd[i].Product_Code, SampProd[i].Sample_Code, SampProd[i].Visit_Order,
                            SampProd[i].Quantity, 2, SampProd[i].Start_Date, SampProd[i].Due_Date, SampProd[i].Input_Type, SampProd[i].ROI, SampProd[i].Activity_Id, SampProd[i].Activity_Name, SampProd[i].Line_Item_Budget);

                        }
                    }
                }

                rowsAffected = objMC.UpdateMarketingCampaign(companyCode, regionCode, ObjMCHeader, CompanyId, createdBy, createdDateTime, dtCatCode, dtspecCode, dtdesgCode, dtdocDesig,ProdSamp, dtParRegions);
            }
            else
            {
                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Category_Code))
                {
                    doctCatCode = ObjMCHeader.Customer_Category_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Customer_Speciality_Code))
                {
                    docspecCode = ObjMCHeader.Customer_Speciality_Code.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.Designation))
                {
                    desgCode = ObjMCHeader.Designation.Split(',');
                }
                if (!string.IsNullOrEmpty(ObjMCHeader.UserType))
                {
                    desgCode = ObjMCHeader.Designation.Split(',');
                }
                DataTable dtCatCode = null;
                if (doctCatCode.Length >= 1)
                {
                    dtCatCode = new DataTable();
                    dtCatCode.Columns.Add("Company_Code", typeof(string));
                    dtCatCode.Columns.Add("Campaign_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Code", typeof(string));
                    dtCatCode.Columns.Add("Customer_Category_Status", typeof(int));
                    dtCatCode.Columns.Add("Company_Id", typeof(int));
                    dtCatCode.Columns.Add("Created_By", typeof(string));
                    dtCatCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int i = 0; i < doctCatCode.Length; i++)
                    {
                        dtCatCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, doctCatCode[i], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtspecCode = null;
                if (docspecCode.Length >= 1)
                {
                    dtspecCode = new DataTable();
                    dtspecCode.Columns.Add("Company_Code", typeof(string));
                    dtspecCode.Columns.Add("Campaign_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Code", typeof(string));
                    dtspecCode.Columns.Add("Customer_Speciality_Status", typeof(int));
                    dtspecCode.Columns.Add("Company_Id", typeof(int));
                    dtspecCode.Columns.Add("Created_By", typeof(string));
                    dtspecCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int j = 0; j < docspecCode.Length; j++)
                    {
                        dtspecCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, docspecCode[j], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdesgCode = null;
                if (desgCode.Length >= 1)
                {
                    dtdesgCode = new DataTable();
                    dtdesgCode.Columns.Add("Company_Code", typeof(string));
                    dtdesgCode.Columns.Add("Campaign_Code", typeof(string));
                    dtdesgCode.Columns.Add("Region_Type_Code", typeof(string));
                    dtdesgCode.Columns.Add("Mapping_Status", typeof(int));
                    dtdesgCode.Columns.Add("Company_Id", typeof(int));
                    dtdesgCode.Columns.Add("Created_By", typeof(string));
                    dtdesgCode.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < desgCode.Length; k++)
                    {
                        dtdesgCode.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, desgCode[k], 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                DataTable dtdocDesig = null;
                if (docDesig != null && docDesig.Length >= 1)
                {
                    dtdocDesig = new DataTable();
                    dtdocDesig.Columns.Add("Company_Code", typeof(string));
                    dtdocDesig.Columns.Add("Company_Id", typeof(int));
                    dtdocDesig.Columns.Add("Campaign_Code", typeof(string));
                    dtdocDesig.Columns.Add("Survey_Id", typeof(int));
                    dtdocDesig.Columns.Add("User_Type_Code", typeof(string));
                    dtdocDesig.Columns.Add("Created_By", typeof(string));
                    dtdocDesig.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int k = 0; k < docDesig.Length; k++)
                    {
                        dtdocDesig.Rows.Add(companyCode, CompanyId, ObjMCHeader.Campaign_Code, ObjMCHeader.Survey, docDesig[k], createdBy, createdDateTime);
                    }
                }
                //update
                DataTable dtParRegions = null;
                if (ObjMCHeader.lstRegionCodes.Count >= 1)
                {
                    dtParRegions = new DataTable();
                    dtParRegions.Columns.Add("Company_Code", typeof(string));
                    dtParRegions.Columns.Add("Campaign_Code", typeof(string));
                    dtParRegions.Columns.Add("Participating_Region_Code", typeof(string));
                    dtParRegions.Columns.Add("Record_Status", typeof(int));
                    dtParRegions.Columns.Add("Company_Id", typeof(int));
                    dtParRegions.Columns.Add("Created_By", typeof(string));
                    dtParRegions.Columns.Add("Created_DateTime", typeof(DateTime));

                    for (int z = 0; z < ObjMCHeader.lstRegionCodes.Count; z++)
                    {
                        dtParRegions.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, ObjMCHeader.lstRegionCodes[z].Region_Code, 1, CompanyId, createdBy, createdDateTime);
                    }
                }
                //update
                DataTable ProdSamp = null;
                List<MCProductSampleModel> SampProd = new List<MCProductSampleModel>();
                SampProd = ObjMCHeader.lstProdSamp;
                if (SampProd != null)
                {
                    ProdSamp = new DataTable();

                    ProdSamp.Columns.Add("Company_Code", typeof(string));
                    ProdSamp.Columns.Add("Campaign_Code", typeof(string));
                    ProdSamp.Columns.Add("Product_Code", typeof(string));
                    ProdSamp.Columns.Add("Sample_Code", typeof(string));
                    ProdSamp.Columns.Add("Visit_Order", typeof(int));
                    ProdSamp.Columns.Add("Quantity", typeof(string));
                    ProdSamp.Columns.Add("Record_Status", typeof(int));
                    ProdSamp.Columns.Add("Start_Date", typeof(string));
                    ProdSamp.Columns.Add("Due_Date", typeof(string));
                    ProdSamp.Columns.Add("Input_Type", typeof(string));
                    ProdSamp.Columns.Add("ROI", typeof(decimal));
                    ProdSamp.Columns.Add("Activity_Id", typeof(int));
                    ProdSamp.Columns.Add("Activity_Name", typeof(string));
                    ProdSamp.Columns.Add("Line_Item_Budget", typeof(int));

                    for (int i = 0; i < SampProd.Count; i++)
                    {
                        if (SampProd[i].Product_Code != "")
                        {

                            ProdSamp.Rows.Add(companyCode, ObjMCHeader.Campaign_Code, SampProd[i].Product_Code, SampProd[i].Sample_Code, SampProd[i].Visit_Order,
                            SampProd[i].Quantity, 2, SampProd[i].Start_Date, SampProd[i].Due_Date, SampProd[i].Input_Type, SampProd[i].ROI, SampProd[i].Activity_Id, SampProd[i].Activity_Name, SampProd[i].Line_Item_Budget);
                        }
                    }
                }
                rowsAffected = objMC.UpdateMarketingCampaignApproved(companyCode, regionCode, ObjMCHeader, CompanyId, createdBy, createdDateTime, dtCatCode, dtspecCode, dtdesgCode, dtdocDesig, ProdSamp, dtParRegions);
            }
            return rowsAffected;
        }

        public List<MVCModels.HiDoctor_Master.ProductModel> GetSaleProductsBasedOnRegion(string companyCode, string regionCode)
        {
            return objMC.GetSaleProductsBasedOnRegion(companyCode, regionCode);
        }
        public List<MVCModels.HiDoctor_Master.ProductModel> GetPromotionalProductsBasedOnRegion(string companyCode, string regionCode)
        {
            return objMC.GetPromotionalProductsBasedOnRegion(companyCode, regionCode);
        }
        public List<DesignationModel> GetDesignations(string companyCode, string regionCode)
        {
            return objMC.GetDesignations(companyCode, regionCode);
        }
        public List<ActivityModel> GetActivities(string companyCode)
        {
            return objMC.GetActivities(companyCode);
        }
        public MCProductModel GetProductsSamplebyCampaign(string companyCode, string campaignCode)
        {
            return objMC.GetProductsSamplebyCampaign(companyCode, campaignCode);
        }
        public List<MCHeaderModel> GetRemarksByMarketingCampaign(string companyCode, string campaignCode)
        {
            return objMC.GetRemarksByMarketingCampaign(companyCode, campaignCode);
        }
        public List<RegionDetailsModel> GetDocForAllRegionsUndertheSelectedRegion(string companyCode, string regionCode, string excludeParentLevel, string includeOneLevelParent, string currentregionCode)
        {
            return objMC.GetDocForAllRegionsUndertheSelectedRegion(companyCode, regionCode, excludeParentLevel, includeOneLevelParent, currentregionCode);
        }
        public List<MVCModels.DoctorCategoryModel> GetDoctorCategory(string companyCode, string regionCode)
        {
            return objMC.GetDoctorCategory(companyCode, regionCode);
        }
        public List<MVCModels.SpecialityModel> GetSpeciality(string companyCode)
        {
            return objMC.GetSpeciality(companyCode);
        }
        public bool UpdateCampaignCurrentStatus(string companyCode, string campaignCode, int status, string reasontoPause, int companyId, string actionBy)
        {
            return objMC.UpdateCampaignCurrentStatus(companyCode, campaignCode, status, reasontoPause, companyId, actionBy);
        }

        public IEnumerable<MVCModels.MCHeaderModel> GetSelectedCMECHeader(string companyCode, string campaignCode, string regionCode)
        {
            return objMC.GetSelectedCMECHeader(companyCode, campaignCode, regionCode);
        }
        public List<MVCModels.MCProductCustomerModel> GetCMEDoctorsByCampaignandRegion(string companyCode, string regionCode,
                     string campaignCode, string customerStatus, string doctorName)
        {
            return objMC.GetCMEDoctorsByCampaignandRegion(companyCode, regionCode, campaignCode, customerStatus, doctorName);
        }
        public List<MVCModels.MCProductCustomerModel> GetCMEProductsByRegionandCampaign(string compayCode, string campaignCode, string productName, string regionCode)
        {
            return objMC.GetCMEProductsByRegionandCampaign(compayCode, campaignCode, productName, regionCode);
        }
        public IEnumerable<MVCModels.MCHeaderModel> GetCMECampaigns(string companyCode, string regionCode)
        {
            return objMC.GetCMECampaigns(companyCode, regionCode);
        }
        public IEnumerable<MVCModels.MCCampaign> GetMCMappedtoDoctor(string companyCode, string doctorCode, string regionCode)
        {
            return objMC.GetMCMappedtoDoctor(companyCode, doctorCode, regionCode);
        }
        public IEnumerable<MVCModels.MCCampaign> GetMCMappedtoDoctorCount(string regionCode)
        {
            return objMC.GetMCMappedtoDoctorCount(regionCode);
        }
        #region MC - Restrict Doctor count per region wise
        /// <summary>
        /// Used to Restrict the Doctor Coutn Region Wise
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="campaignCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.MCHeaderModel> GetDoctorcountforMC(string companyCode, string campaignCode)
        {
            return objMC.GetDoctorcountforMC(companyCode, campaignCode);
        }
        #endregion MC - Restrict Doctor count per region wise
        // ******************* END - MARKETING CAMPAGIN *************************//

        #region Doctor Product Mapping New
        public IEnumerable<MVCModels.DoctorDetails> GetDoctorDetailsByRegion(string regionCode)
        {
            return objMC.GetDoctorDetailsByRegion(regionCode);
        }

        public IEnumerable<MVCModels.DocProdDetailsModel> GetDocProduct(string RegionCode, string SelRegionCode)
        {
            return objMC.GetDocProduct(RegionCode, SelRegionCode);
        }
        public string InsertDocProd(string companyCode, string userName, List<MVCModels.DocProdInsertModel> lstInsertDocProd, string selType)
        {
            return objMC.InsertDocProd(companyCode, userName, lstInsertDocProd, selType);
        }
        public int IsParentRegion(string userRegionCode)
        {
            return objMC.IsParentRegion(userRegionCode);
        }
        #endregion
        #region Survey
        public List<PrivilegeDetailsModel> GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            try
            {
                lstPrivileges = objMC.GetUserTypePrivileges(companyCode, regionCode, userCode, userTypeCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstPrivileges;
        }
        #endregion
    }
}
