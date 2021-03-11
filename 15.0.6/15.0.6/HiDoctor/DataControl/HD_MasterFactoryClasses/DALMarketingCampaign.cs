using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels.HiDoctor_Master;
using DocumentFormat.OpenXml.Spreadsheet;
using MVCModels;

namespace DataControl.HiDoctor_Master
{
    public class DALMarketingCampaign : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        #endregion Private Variables

        #region Constant Strings
        const string SP_HDGETMARKETINGCAMPAIGNBYREGION = "SP_hdGetMarketingCampaignByRegion";
        const string SP_HDGETMCDOCTORSBYREGIONANDSTATUS = "SP_hdGetMCDoctorsByRegionAndStatus";
        const string SP_HDGETDOCTORSBYREGIONANDSTATUS = "SP_hdGetDoctorsByRegionAndStatus";
        const string SP_hdGetAllSaleProductsForMC = "SP_hdGetAllSaleProductsForMCWithDivision";
        const string SP_HDGETMCPRODUCTSBYDOCTOR = "SP_hdGetMCProductsByDoctor";
        const string SP_HDGETMCPRODUCTS = "SP_hdGetMCProducts";
        const string SP_HDGETMAPPEDDOCTORPRODUCTCOUNT = "SP_hdGetMappedDoctorProductCount";
        const string SP_HDGETMCDOCTORSBYPRODUCT = "SP_hdGetMCDoctorsByProduct";
        const string SP_hdGetOtherThanSalesAndCompetitorProducts = "SP_hdGetOtherThanSalesAndCompetitorProducts";
        const string SP_hdGetMarketingCampaign = "SP_hdGetMarketingCampaign";
        //const string SP_HD_MC_MCList = "SP_HD_MC_MCList";
        const string SP_hdGetMCProductDetails = "SP_hdGetMCProductDetails";
        const string SP_HDGETSELECTEDMCHEADER = "SP_hdGetSelectedMCHeader";
        const string SP_HDCHECKCUSTOMERCOUNTINDOCPROMAPPING = "SP_hdCheckCustomerCountInDocProMapping";
        const string SP_HDINSERTCUSTOMERPRODUCT = "SP_hdInsertCustomerProduct";
        const string USP_HD_GetDoctorByRegion = "USP_HD_GetDoctorByRegion";
        const string USP_HD_GetDocProdLst = "USP_HD_GetDocProdLst";
        const string USP_HD_Insert_DocProd = "USP_HD_Insert_DocProd";
        const string USP_HD_CheckParentRegion = "USP_HD_CheckParentRegion";
        const string SP_HD_MC_GetSalesProductsBasedOnRegion = "SP_HD_MC_GetSalesProductsBasedOnRegion";
        const string SP_HD_MC_GetDesignationsBasedOnRegion = "SP_HD_MC_GetDesignationsBasedOnRegion";
        const string SP_HD_MC_GetActivities = "SP_HD_MC_GetActivities";
        const string SP_HD_MC_GetProductDetailsByCampaigncode = "SP_HD_MC_GetProductDetailsByCampaigncode";
        const string SP_HD_GetStatusHistoryForMarketingCampaign = "SP_HD_GetStatusHistoryForMarketingCampaign";
        const string SP_HD_MC_GetDoctorCategories = "SP_HD_MC_GetDoctorCategories";
        const string SP_HD_MC_GetSpecialities = "SP_HD_MC_GetSpecialities";
        const string SP_HD_DPM_GetAllSaleProductsBasedonRegion = "SP_HD_DPM_GetAllSaleProductsBasedonRegion";
        const string SP_HD_DPM_MC_GetAllSaleProductsBAsedonCampaignAndRegion = "SP_HD_DPM_MC_GetAllSaleProductsBAsedonCampaignAndRegion";
        const string SP_HD_DPM_MC_GetAllDoctorsBasedonRegionandCampaign = "SP_HD_DPM_MC_GetAllDoctorsBasedonRegionandCampaign";
        const string SP_HD_DPM_DeleteProdDoctorMapping = "SP_HD_DPM_DeleteProdDoctorMapping";
        const string SP_HD_DPM_DeleteDoctorProdMapping = "SP_HD_DPM_DeleteDoctorProdMapping";
        const string SP_HD_GetRegionHierarchytreeWithDoctorCount = "SP_HD_GetRegionHierarchytreeWithDoctorCount";
        const string SP_HD_MC_CamapignPauseorResume = "SP_HD_MC_CamapignPauseorResume";
        const string SP_HD_DPM_INSERTGENERALDPMORPDM = "SP_HD_DPM_InsertGeneralDPMorPDM";
        const string SP_HD_DPM_GetParentHierarchyFromSelectedRegionToLoggedinRegion = "SP_HD_DPM_GetParentHierarchyFromSelectedRegionToLoggedinRegion";
        const string SP_HD_DPM_GetParentHierarchyByCampaignCode = "SP_HD_DPM_GetParentHierarchyByCampaignCode";
        const string SP_HD_DPM_InsertMarketingCampaignDPMorPDM = "SP_HD_DPM_InsertMarketingCampaignDPMorPDM";
        const string SP_HD_MC_GetCampaignRelatedDetailsBasedOnCampaignCode = "SP_HD_MC_GetCampaignRelatedDetailsBasedOnCampaignCode";
        const string SP_HD_DPM_GetCMEParentHierarchyByCampaignCode = "SP_HD_DPM_GetCMEParentHierarchyByCampaignCode";
        const string SP_HDGETSELECTEDCMEHEADER = "SP_hdGetSelectedCMEHeader";
        const string SP_HD_DPM_CME_GETALLDOCTORSBASEDONREGIONANDCAMPAIGN = "SP_HD_DPM_CME_GetAllDoctorsBasedonRegionandCampaign";
        const string SP_HD_DPM_CME_GETALLSALEPRODUCTSBASEDONCAMPAIGNANDREGION = "SP_HD_DPM_CME_GetAllSaleProductsBAsedonCampaignAndRegion";
        const string SP_HDGETCMEMARKETINGCAMPAIGNBYREGION = "SP_hdGetCMEMarketingCampaignByRegion";
        //Restrict doctor count region wise
        const string SP_GETDOCTORCOUNTFORMC = "SP_GetDoctorcountforMC";
        const string SP_HD_BPP_GETPRIVILEGESBYUSERTYPECODE = "SP_HD_BPP_GETPRIVILEGESBYUSERTYPECODE";
        const string SP_HDGETMCMappedtoDoctor = "SP_HDGETMCMappedtoDoctor";
        #endregion Constant Strings

        #region public methods
        public IEnumerable<MVCModels.MCProductCustomerModel> GetDoctorsByRegionAndStatus(string companyCode, string regionCode,

            string customerStatus, string doctorName)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    lstDoctors = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDGETDOCTORSBYREGIONANDSTATUS,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, CustomerStatus = customerStatus, DoctorName = doctorName },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstDoctors;
        }
        public IEnumerable<MVCModels.MCHeaderModel> GetMarketingCampaignNames(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCampaign = connection.Query<MVCModels.MCHeaderModel>(SP_HDGETMARKETINGCAMPAIGNBYREGION,
                                  new { CompanyCode = companyCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCampaign;
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetAllSalesProducts(string companyCode, string productName, string RegionCode)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProduct = connection.Query<MVCModels.MCProductCustomerModel>(SP_hdGetAllSaleProductsForMC,
                                  new { CompanyCode = companyCode, ProductName = productName, Region_code = RegionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProduct;
        }

        public List<MVCModels.MCProductCustomerModel> GetAllSalesProductsByRegion(string companyCode,string productName,string regionCode)
        {
            List<MVCModels.MCProductCustomerModel> lstProduct = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@ProductName", productName);
                    lstProduct = connection.Query<MVCModels.MCProductCustomerModel>(SP_HD_DPM_GetAllSaleProductsBasedonRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch(Exception ex)
            {
                throw;
            }
            return lstProduct;
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCDoctors(string companyCode, string regionCode,
                        string campaignCode, string customerStatus, string doctorName)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstDoctors = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctors = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDGETMCDOCTORSBYREGIONANDSTATUS,
                                  new
                                  {
                                      CompanyCode = companyCode,
                                      CampaignCode = campaignCode,
                                      RegionCode = regionCode,
                                      CustomerStatus = customerStatus,
                                      DoctorName = doctorName,
                                  },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDoctors;
        }
        public List<MVCModels.MCProductCustomerModel> GetMCDoctorsByCampaignandRegion(string companyCode,string regionCode,string campaignCode,string customerStatus,string doctorName)
        {
            List<MVCModels.MCProductCustomerModel> lstMCDoc = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@DoctorName", doctorName);
                    p.Add("@CustomerStatus", customerStatus);
                    lstMCDoc = connection.Query<MVCModels.MCProductCustomerModel>(SP_HD_DPM_MC_GetAllDoctorsBasedonRegionandCampaign, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstMCDoc;
        }
        public bool DoctorProdMappingDelete(string companyCode,string regionCode,string currentregionCode,string doctorCode,string campaignCode, string mappingTo, string typeofMapping)
        {
            bool result = false;
            try
            {
                using(IDbConnection connection= IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@CompanyCode", companyCode);
                    param.Add("@RegionCode", regionCode);
                    param.Add("@DoctorCode", doctorCode);
                    param.Add("@CampaignCode", campaignCode);
                    param.Add("@CurrentRegionCode", currentregionCode);
                    param.Add("@MappingTo", mappingTo);
                    param.Add("@TypeOfMapping", typeofMapping);
                    connection.Execute(SP_HD_DPM_DeleteDoctorProdMapping, param, commandType: CommandType.StoredProcedure);
                    result = true;
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public bool ProdDoctorMappingDelete(string companyCode, string regionCode,string currentregionCode, string productCode, string campaignCode,string mappingTo,string typeofMapping)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@CompanyCode", companyCode);
                    param.Add("@RegionCode", regionCode);
                    param.Add("@ProductCode", productCode);
                    param.Add("@CampaignCode", campaignCode);
                    param.Add("@CurrentRegionCode", currentregionCode);
                    param.Add("@MappingTo", mappingTo);
                    param.Add("@TypeOfMapping", typeofMapping);
                    connection.Execute(SP_HD_DPM_DeleteProdDoctorMapping, param, commandType: CommandType.StoredProcedure);
                    result = true;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }


        public string InsertCustomerProduct(string companyCode, string doctorCode, string productCode, string campaignCode, string regionCode,
                string refType, string createdBy,string currentregionCode,string mappingTo,string TypeOfMapping)
        {
            string result = string.Empty;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Doctor_Code", doctorCode);
                    p.Add("@Product_Code", productCode);
                    // p.Add("@Campaign_Code", campaignCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@RefType", refType);
                    p.Add("@Created_By", createdBy);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    p.Add("@MappingTo", mappingTo);
                    p.Add("@MappingType", TypeOfMapping);
                    p.Add("@Result", "", DbType.String, ParameterDirection.Output, 1000);
                    connection.Query<string>(SP_HD_DPM_INSERTGENERALDPMORPDM, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();

                }
            }
            catch
            {
                throw;
            }
            return result;
        }


        public string InsertCustomerProductMarketingMapping(string companyCode, string doctorCode, string productCode, string campaignCode, string regionCode,
        string refType, string createdBy, string currentregionCode, string mappingTo, string TypeOfMapping)
        {
            string result = string.Empty;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Doctor_Code", doctorCode);
                    p.Add("@Product_Code", productCode);
                    p.Add("@Campaign_Code", campaignCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@RefType", refType);
                    p.Add("@Created_By", createdBy);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    p.Add("@MappingTo", mappingTo);
                    p.Add("@MappingType", TypeOfMapping);
                    p.Add("@Result", "", DbType.String, ParameterDirection.Output, 1000);
                    connection.Query<string>(SP_HD_DPM_InsertMarketingCampaignDPMorPDM, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();

                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        //public int InsertMCDoctorProductMapping(List<MVCModels.MCProductCustomerModel> lstMCDocProduct, string customerCode, string campaignCode, string companyCode,
        //                                            string regionCode, string refType, string mappingType, string productCode)
        //{
        //    int rowsAffected = 0;
        //    int deletedRowCount = 0;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            IDbTransaction trans = connection.BeginTransaction();
        //            if (string.IsNullOrEmpty(campaignCode) || "0" == campaignCode)
        //            {
        //                if ("DOCTOR_PRODUCT" == mappingType)
        //                {
        //                    #region doctor product mapping without marketing campaign
        //                    const string query = "INSERT INTO tbl_SFA_MC_Product_Customer_Header_History SELECT  Company_Code,Region_Code,Campaign_Code, " +
        //                                        "Customer_Code,Customer_Category_Code,Product_Code,Support_Quantity,Potential_Quantity, " +
        //                                        "Ref_Type,Record_Status,Sync_Made,Sync_Up_Status,Sync_Down_Status,Sync_Date,Created_By,Created_Date,Updated_By,Updated_Date, " +
        //                                        "Row_version_no,Self_Mapping FROM tbl_SFA_MC_Product_Customer_Header WHERE " +
        //                                        "Customer_Code= @CustomerCode and Region_Code=@RegionCode and Ref_Type=@RefType and Company_Code=@CompanyCode";
        //                    connection.Execute(query, new { CustomerCode = customerCode, RegionCode = regionCode, RefType = refType, CompanyCode = companyCode },
        //                                            transaction: trans);
        //                    const string deleteQuery = "DELETE from tbl_SFA_MC_Product_Customer_Header WHERE Customer_Code = @CustomerCode and " +
        //                                                "Region_Code = @RegionCode and Ref_Type = @RefType and Company_Code = @CompanyCode";
        //                    connection.Execute(deleteQuery, new { CustomerCode = customerCode, RegionCode = regionCode, RefType = refType, CompanyCode = companyCode },
        //                                            transaction: trans);
        //                    #endregion doctor product mapping without marketing campaign
        //                }
        //                else
        //                {
        //                    #region product doctor mapping  without marketing campaign
        //                    const string query = "INSERT INTO tbl_SFA_MC_Product_Customer_Header_History SELECT Company_Code,Region_Code,Campaign_Code,Customer_Code, " +
        //                                            "Customer_Category_Code,Product_Code,Support_Quantity,Potential_Quantity,Ref_Type, " +
        //                                            "Record_Status,Sync_Made,Sync_Up_Status,Sync_Down_Status,Sync_Date,Created_By,Created_Date, " +
        //                                            "Updated_By,Updated_Date,Row_version_no,Self_Mapping FROM tbl_SFA_MC_Product_Customer_Header " +
        //                                            "WHERE Product_Code=@ProductCode and Region_Code=@RegionCode and  " +
        //                                            "Ref_Type=@RefType and Company_Code=@CompanyCode";
        //                    connection.Execute(query, new { ProductCode = productCode, RegionCode = regionCode, RefType = refType, CompanyCode = companyCode },
        //                                          transaction: trans);
        //                    const string deleteQuery = "delete from tbl_SFA_MC_Product_Customer_Header where Product_Code = @ProductCode and " +
        //                                               "Region_Code = @RegionCode and Ref_Type = @RefType and Company_Code =@CompanyCode";
        //                    connection.Execute(deleteQuery, new { ProductCode = productCode, RegionCode = regionCode, RefType = refType, CompanyCode = companyCode },
        //                                          transaction: trans);
        //                    #endregion product doctor mapping  without marketing campaign
        //                }
        //            }
        //            else
        //            {
        //                if ("DOCTOR_PRODUCT" == mappingType)
        //                {
        //                    #region doctor product mapping with marketing campaign
        //                    const string query = "INSERT INTO tbl_SFA_MC_Product_Customer_Header_History SELECT  Company_Code,Region_Code,Campaign_Code, " +
        //                                       "Customer_Code,Customer_Category_Code,Product_Code,Support_Quantity,Potential_Quantity, " +
        //                                       "Ref_Type,Record_Status,Sync_Made,Sync_Up_Status,Sync_Down_Status,Sync_Date,Created_By,Created_Date,Updated_By,Updated_Date, " +
        //                                       "Row_version_no,Self_Mapping FROM tbl_SFA_MC_Product_Customer_Header WHERE " +
        //                                       "Customer_Code= @CustomerCode and Region_Code=@RegionCode and Ref_Type=@RefType and Company_Code=@CompanyCode " +
        //                                       "and Campaign_Code=@CampaignCode";
        //                    connection.Execute(query, new
        //                    {
        //                        CustomerCode = customerCode,
        //                        RegionCode = regionCode,
        //                        RefType = refType,
        //                        CompanyCode = companyCode,
        //                        CampaignCode = campaignCode
        //                    }, transaction: trans);
        //                    const string deleteQuery = "DELETE from tbl_SFA_MC_Product_Customer_Header WHERE Customer_Code = @CustomerCode and " +
        //                                                "Region_Code = @RegionCode and Ref_Type = @RefType and Company_Code = @CompanyCode AND Campaign_Code=@CampaignCode";
        //                    connection.Execute(deleteQuery, new
        //                    {
        //                        CustomerCode = customerCode,
        //                        RegionCode = regionCode,
        //                        RefType = refType,
        //                        CompanyCode = companyCode,
        //                        CampaignCode = campaignCode
        //                    }, transaction: trans);
        //                    #endregion doctor product mapping with marketing campaign
        //                }
        //                else
        //                {
        //                    #region product doctor mapping with marketing campaign
        //                    const string query = "INSERT INTO tbl_SFA_MC_Product_Customer_Header_History SELECT Company_Code,Region_Code,Campaign_Code,Customer_Code, " +
        //                                          "Customer_Category_Code,Product_Code,Support_Quantity,Potential_Quantity,Ref_Type, " +
        //                                          "Record_Status,Sync_Made,Sync_Up_Status,Sync_Down_Status,Sync_Date,Created_By, " +
        //                                          "Created_Date,Updated_By,Updated_Date,Row_version_no,Self_Mapping FROM tbl_SFA_MC_Product_Customer_Header " +
        //                                          "WHERE Product_Code=@ProductCode and Region_Code=@RegionCode and Ref_Type=@RefType  " +
        //                                          "and Company_Code=@CompanyCode and Campaign_Code=@CampaignCode";
        //                    connection.Execute(query, new
        //                    {
        //                        ProductCode = productCode,
        //                        RegionCode = regionCode,
        //                        RefType = refType,
        //                        CompanyCode = companyCode,
        //                        CampaignCode = campaignCode
        //                    }, transaction: trans);

        //                    const string deleteQuery = "delete from tbl_SFA_MC_Product_Customer_Header where " +
        //                                               "Product_Code = @ProductCode and Region_Code = @RegionCode and Ref_Type = @RefType " +
        //                                               "and Company_Code = @CompanyCode and Campaign_Code =@CampaignCode ";
        //                    connection.Execute(deleteQuery, new
        //                    {
        //                        ProductCode = productCode,
        //                        RegionCode = regionCode,
        //                        RefType = refType,
        //                        CompanyCode = companyCode,
        //                        CampaignCode = campaignCode
        //                    }, transaction: trans);
        //                    #endregion product doctor mapping with marketing campaign
        //                }
        //            }
        //            if (lstMCDocProduct.Count > 0)
        //            {
        //                const string insertQuery = "INSERT INTO tbl_SFA_MC_Product_Customer_Header(Company_Code,Region_Code,Campaign_Code,Customer_Code, " +
        //                                          "Customer_Category_Code,Product_Code,Support_Quantity,Potential_Quantity,Ref_Type,Record_Status,Created_By, " +
        //                                          "Created_Date,product_Priority_No) VALUES(@Company_Code,@Region_Code,@Campaign_Code,@Customer_Code,@Customer_Category_Code, " +
        //                                          "@Product_Code,@Support_Quantity,@Potential_Quantity,@Ref_Type,@Record_Status,@Created_By,@Created_Date,@Product_Priority_No)";
        //                rowsAffected = connection.Execute(insertQuery, lstMCDocProduct, transaction: trans);
        //            }
        //            else
        //            {
        //                rowsAffected = 1;
        //            }
        //            trans.Commit();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return rowsAffected;
        //}
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCProductsByDoctor(string companyCode, string doctorCode,
            string regionCode, string campaignCode,string currentregionCode,string mappingTo, string typeOfMapping)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@DoctorCode", doctorCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@CampaignCode", campaignCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@RegionCode", regionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@CurrentRegionCode", currentregionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@MappingTo", mappingTo, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@TypeOfMapping", typeOfMapping, dbType: DbType.String, direction: ParameterDirection.Input);
                    lstProduct = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDGETMCPRODUCTSBYDOCTOR,
                                  parameter,
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProduct;
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCProducts(string companyCode, string campaignCode, string productName)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstProdcut;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProdcut = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDGETMCPRODUCTS,
                                  new { CompanyCode = companyCode, CampaignCode = campaignCode, ProductName = productName },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProdcut;
        }


        public List<MVCModels.MCProductCustomerModel> GetMCProductsByRegionandCampaign(string companyCode,string campaignCode,string productName,string regionCode,string typeOfMapping)
        {
            List<MVCModels.MCProductCustomerModel> lstMCProd = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@ProductName", productName);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@typeOfMapping", typeOfMapping);
                    lstMCProd = connection.Query<MVCModels.MCProductCustomerModel>(SP_HD_DPM_MC_GetAllSaleProductsBAsedonCampaignAndRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }catch(Exception ex)
            {
                throw;
            }
            return lstMCProd;
        }
        public IEnumerable<MVCModels.MCProductCustomerModel> GetMappedDoctorandProductCount(string companyCode,
                string campaignCode, string regionCode, string mappingType,string currentregionCode, string mappingTo, string typeOfMapping)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstProdcut;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProdcut = connection.Query < MVCModels.MCProductCustomerModel>(SP_HDGETMAPPEDDOCTORPRODUCTCOUNT,
                                  new
                                  {
                                      CompanyCode = companyCode,
                                      RegionCode = regionCode,
                                      MappingType = mappingType,
                                      CampaignCode = campaignCode,
                                      CurrentRegionCode = currentregionCode,
                                      MappingTo = mappingTo,
                                      TypeOfMapping = typeOfMapping

                                  },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProdcut;
        }

        public IEnumerable<MVCModels.MCProductCustomerModel> GetMCDoctorsByProduct(string companyCode, string productCode,
          string regionCode, string campaignCode, string currentregionCode, string mappingTo, string typeofMapping)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstDoctor;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@ProductCode", productCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@CampaignCode", campaignCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@RegionCode", regionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@CurrentRegionCode", currentregionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@MappingTo", mappingTo, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@TypeOfMapping", typeofMapping, dbType: DbType.String, direction: ParameterDirection.Input);
                    lstDoctor = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDGETMCDOCTORSBYPRODUCT,
                                  parameter,
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDoctor;
        }

        public IEnumerable<MVCModels.MCHeaderModel> GetSelectedMCHeader(string companyCode, string campaignCode, string regionCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCampaign = connection.Query<MVCModels.MCHeaderModel>(SP_HDGETSELECTEDMCHEADER,
                                  new { CompanyCode = companyCode, CampaignCode = campaignCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCampaign;
        }
        public RegionHierarchyModelMC GetParentHierarchyByRegion(string companyCode, string regionCode, string currentregionCode)
        {
            RegionHierarchyModelMC ObjRegions = null;
            try
            {
                List<RegionDetailsModelMC> lstregions = null;
                List<RegionDetailsModelMC> lstusers = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_DPM_GetParentHierarchyFromSelectedRegionToLoggedinRegion, p, commandType: CommandType.StoredProcedure))
                    {
                        lstregions = multiselect.Read<RegionDetailsModelMC>().ToList();
                        lstusers = multiselect.Read<RegionDetailsModelMC>().ToList();
                    }
                    connection.Close();
                    ObjRegions = new RegionHierarchyModelMC();
                    ObjRegions.lstRegions = lstregions;
                    ObjRegions.lstUsers = lstusers;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return ObjRegions;
        }
        public RegionHierarchyModelMC GetParentHierarchyByRegionandCampaign(string companyCode, string regionCode, string currentregionCode, string campaignCode)
        {
            RegionHierarchyModelMC ObjRegions = null;
            try
            {
                List<RegionDetailsModelMC> lstregions = null;
                List<RegionDetailsModelMC> lstusers = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    p.Add("@CampaignCode", campaignCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_DPM_GetParentHierarchyByCampaignCode, p, commandType: CommandType.StoredProcedure))
                    {
                        lstregions = multiselect.Read<RegionDetailsModelMC>().ToList();
                        lstusers = multiselect.Read<RegionDetailsModelMC>().ToList();
                    }
                    connection.Close();
                    ObjRegions = new RegionHierarchyModelMC();
                    ObjRegions.lstRegions = lstregions;
                    ObjRegions.lstUsers = lstusers;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return ObjRegions;

        }
        public RegionHierarchyModelMC GetCMEParentHierarchyByRegionandCampaign(string companyCode, string regionCode, string currentregionCode, string campaignCode)
        {
            RegionHierarchyModelMC ObjRegions = null;
            try
            {
                List<RegionDetailsModelMC> lstregions = null;
                List<RegionDetailsModelMC> lstusers = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CurrentRegionCode", currentregionCode);
                    p.Add("@CampaignCode", campaignCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_DPM_GetCMEParentHierarchyByCampaignCode, p, commandType: CommandType.StoredProcedure))
                    {
                        lstregions = multiselect.Read<RegionDetailsModelMC>().ToList();
                        lstusers = multiselect.Read<RegionDetailsModelMC>().ToList();
                    }
                    connection.Close();
                    ObjRegions = new RegionHierarchyModelMC();
                    ObjRegions.lstRegions = lstregions;
                    ObjRegions.lstUsers = lstusers;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return ObjRegions;

        }
        public IEnumerable<MVCModels.MCProductCustomerModel> CheckCustomerCountInDocProMapping(string companyCode, string campaignCode, string regionCode)
        {
            IEnumerable<MVCModels.MCProductCustomerModel> lstCampaign;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCampaign = connection.Query<MVCModels.MCProductCustomerModel>(SP_HDCHECKCUSTOMERCOUNTINDOCPROMAPPING,
                                  new { Company_Code = companyCode, Campaign_Code = campaignCode, Region_Code = regionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCampaign;
        }


        //********** START - MARKETING CAMPAIGN DEFINER ******************************************//
        public List<MVCModels.HiDoctor_Master.ProductModel> GetOtherThanSalesAndCompetitorProducts(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProd = new List<MVCModels.HiDoctor_Master.ProductModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetOtherThanSalesAndCompetitorProducts);
                SqlDataReader sqldataReader;
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.ProductModel _objProd = new MVCModels.HiDoctor_Master.ProductModel();
                        _objProd.Product_Code = sqldataReader["Product_Code"].ToString();
                        _objProd.Product_Name = sqldataReader["Product_Name"].ToString();
                        lstProd.Add(_objProd);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstProd;
        }

        public List<MCHeaderModel> GetMarketingCampaignsForARegion(string companyCode, string regionCode, string status, string startDate, string endDate, string mode)
        {
            List<MCHeaderModel> ObjMC = null;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Status", status);
                    p.Add("@StartDate", startDate);
                    p.Add("@EndDate", endDate);
                    p.Add("@mode", mode);
                    ObjMC = connection.Query<MCHeaderModel>(SP_hdGetMarketingCampaign, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return ObjMC;
        }

        public MarketingCampaignModel GetCampaignHeaderDetails(string companyCode, string campaignCode)
        {
            MarketingCampaignModel ObjMC = null;
            try
            {
                List<MCHeaderModel> lstdesg = null;
                List<MCHeaderModel> lstcat = null;
                List<MCHeaderModel> lstspec = null;
                List<MCHeaderModel> lstParReg = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_MC_GetCampaignRelatedDetailsBasedOnCampaignCode, p, commandType: CommandType.StoredProcedure))
                    {
                        lstcat = multiselect.Read<MCHeaderModel>().ToList();
                        lstspec = multiselect.Read<MCHeaderModel>().ToList();
                        lstdesg = multiselect.Read<MCHeaderModel>().ToList();
                        lstParReg = multiselect.Read<MCHeaderModel>().ToList();
                    }
                    connection.Close();
                    ObjMC = new MarketingCampaignModel();
                    ObjMC.lstDocCateg = lstcat;
                    ObjMC.lstSpecCateg = lstspec;
                    ObjMC.lstDesig = lstdesg;
                    ObjMC.lstMCParRegions = lstParReg;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return ObjMC;
        }

        public IEnumerable<MVCModels.MCDetailsModel> GetMCProductDetails(string companyCode, string campaignCode)
        {
            IEnumerable<MVCModels.MCDetailsModel> lstMC;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstMC = connection.Query<MVCModels.MCDetailsModel>(SP_hdGetMCProductDetails,
                                  new { CompanyCode = companyCode, CampaignCode = campaignCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstMC;
        }

        public int InsertMarketingCampaign(string companyCode, string regionCode, MCHeader ObjMCHeader, int companyId, string createdBy, string createdDate, DataTable dtCatCode, DataTable dtspecCode, DataTable dtdesgCode, DataTable dtdocDesig, DataTable ProdSamp, DataTable dtParRegions)
        {

            int rowsAffected = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string cmdTxt = "SP_HD_MC_InsertMarketingCampaign";
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Campaign_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Name", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjMCHeader.Campaign_Name);
                    if (ObjMCHeader.Campaign_Description != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, ObjMCHeader.Campaign_Description);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Start_Date", ParameterDirection.Input, SqlDbType.DateTime, 50, ObjMCHeader.Start_Date);
                    _objSPData.AddParamToSqlCommand(command, "@End_Date", ParameterDirection.Input, SqlDbType.DateTime, 50, ObjMCHeader.End_Date);
                    if (ObjMCHeader.Track_Till != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_Till);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    if (ObjMCHeader.Track_From != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_From);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Count", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Customer_Count);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Based_On", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Campaign_Based_On);
                    _objSPData.AddParamToSqlCommand(command, "@Frequency_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Frequency_Of_Campaign);
                    _objSPData.AddParamToSqlCommand(command, "@Survey", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Survey);
                    _objSPData.AddParamToSqlCommand(command, "@SurveyDate", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Surveydate);
                    if (ObjMCHeader.Budget_Of_Campaign == 0)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, 0);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Budget_Of_Campaign);
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Category", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Category_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Speciality", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Speciality_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Doctor_Product_Mapping_Validation", ParameterDirection.Input, SqlDbType.Char, 1, ObjMCHeader.Doctor_Product_Mapping_Validation);
                    if (dtCatCode.Rows.Count == 0 || dtCatCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Category");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, dtCatCode, "TVP_Customer_Category");
                    }
                    if (dtspecCode.Rows.Count == 0 || dtspecCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Speciality");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, dtspecCode, "TVP_Customer_Speciality");
                    }
                    if (dtdesgCode.Rows.Count == 0 || dtdesgCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_RegionType");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, dtdesgCode, "TVP_Mapping_RegionType");
                    }
                    if (dtdocDesig == null || dtdocDesig.Rows.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_User");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, dtdocDesig, "TVP_Mapping_User");
                    }
                    if (dtParRegions.Rows.Count == 0 || dtdesgCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Participating_Regions");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, dtParRegions, "TVP_Participating_Regions");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                    _objData.OpenConnection();
                    _objData.ExecuteNonQuery(command);


                    if (ProdSamp != null)
                    {
                        rowsAffected = 0;
                        string cmdtxt = "SP_HD_MC_InsertMarketingCampaignDetails";
                        SqlCommand commd = new SqlCommand(cmdtxt);
                        commd.CommandType = CommandType.StoredProcedure;
                        _objSPData.AddParamToSqlCommand(commd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                        _objSPData.AddParamToSqlCommand(commd, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 8, companyId);
                        if (ProdSamp.Rows.Count == 0)
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Product_Sample");
                        }
                        else
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, ProdSamp, "TVP_Product_Sample");
                        }
                        _objSPData.AddParamToSqlCommand(commd, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                        _objData.ExecuteNonQuery(commd);
                        rowsAffected = 1;
                    }
                    else
                    {
                        rowsAffected = 1;
                    }

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rowsAffected;
        }


        public int UpdateMarketingCampaign(string companyCode, string regionCode, MCHeader ObjMCHeader, int company_Id, string updatedBy, string updatedDate, DataTable dtCatCode, DataTable dtSpecCode, DataTable dtDesg, DataTable dtdocDesig, DataTable dtProdSamp, DataTable dtParRegions)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();


                    string cmdTxt = "SP_HD_MC_UpdateMarketingCampaign";
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;


                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Name", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjMCHeader.Campaign_Name);
                    if (ObjMCHeader.Campaign_Description != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, ObjMCHeader.Campaign_Description);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Start_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Start_Date);
                    _objSPData.AddParamToSqlCommand(command, "@End_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.End_Date);
                    if (ObjMCHeader.Track_Till != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_Till);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    if (ObjMCHeader.Track_From != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_From);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Based_On", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Campaign_Based_On);
                    _objSPData.AddParamToSqlCommand(command, "@Frequency_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Frequency_Of_Campaign);
                    _objSPData.AddParamToSqlCommand(command, "@Survey", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Survey);
                    _objSPData.AddParamToSqlCommand(command, "@SurveyDate", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Surveydate);
                    if (ObjMCHeader.Budget_Of_Campaign == 0)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, 0);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Budget_Of_Campaign);
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Count", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Customer_Count);
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Category_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Speciality_Code", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Speciality_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Record_Status", ParameterDirection.Input, SqlDbType.Int, 8, "2");
                    _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Campaign_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Doctor_Product_Mapping_Validation", ParameterDirection.Input, SqlDbType.Char, 1, ObjMCHeader.Doctor_Product_Mapping_Validation);
                    if (dtCatCode.Rows.Count == 0 || dtCatCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Category");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, dtCatCode, "TVP_Customer_Category");
                    }
                    if (dtSpecCode.Rows.Count == 0 || dtSpecCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Speciality");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, dtSpecCode, "TVP_Customer_Speciality");
                    }

                    if (dtDesg.Rows.Count == 0 || dtDesg == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_RegionType");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, dtDesg, "TVP_Mapping_RegionType");
                    }
                    if (dtdocDesig == null || dtdocDesig.Rows.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_User");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, dtdocDesig, "TVP_Mapping_User");
                    }
                    if (dtParRegions.Rows.Count == 0 || dtParRegions == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Participating_Regions");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, dtParRegions, "TVP_Participating_Regions");
                    }
                    _objData.OpenConnection();
                    _objData.ExecuteNonQuery(command);
                    rowsAffected = 1;

                    if (rowsAffected > 0 && dtProdSamp != null)
                    {
                        rowsAffected = 0;
                        string cmdtxt = "SP_HD_UpdateMarketingCampaignDetails";
                        SqlCommand commnd = new SqlCommand(cmdtxt);
                        commnd.CommandType = CommandType.StoredProcedure;
                        _objSPData.AddParamToSqlCommand(commnd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                        _objSPData.AddParamToSqlCommand(commnd, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Campaign_Code);
                        _objSPData.AddParamToSqlCommand(commnd, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 8, company_Id);
                        if (dtProdSamp.Rows.Count == 0)
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commnd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Product_Sample");
                        }
                        else
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commnd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, dtProdSamp, "TVP_Product_Sample");
                        }
                        _objSPData.AddParamToSqlCommand(commnd, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                        _objData.ExecuteNonQuery(commnd);
                        rowsAffected = 1;
                        trans.Commit();

                    }
                    else
                    {
                        rowsAffected = 1;
                    }

                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rowsAffected;
        }


        public int UpdateMarketingCampaignApproved(string companyCode, string regionCode, MCHeader ObjMCHeader, int company_Id, string updatedBy, string updatedDate, DataTable dtCatCode, DataTable dtSpecCode, DataTable dtDesg, DataTable dtdocDesig, DataTable dtProdSamp, DataTable dtParRegions)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();


                    string cmdTxt = "SP_HD_MC_UpdateMarketingCampaignApproved";
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;


                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                    _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Name", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjMCHeader.Campaign_Name);
                    if (ObjMCHeader.Campaign_Description != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, ObjMCHeader.Campaign_Description);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Campaign_Description", ParameterDirection.Input, SqlDbType.VarChar, 500, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Start_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Start_Date);
                    _objSPData.AddParamToSqlCommand(command, "@End_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.End_Date);
                    if (ObjMCHeader.Track_Till != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_Till);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_Till_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    if (ObjMCHeader.Track_From != null)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Track_From);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Track_From_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Count", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Customer_Count);
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Category_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Customer_Speciality_Code", ParameterDirection.Input, SqlDbType.VarChar, 5000, ObjMCHeader.Customer_Speciality_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Based_On", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Campaign_Based_On);
                    _objSPData.AddParamToSqlCommand(command, "@Frequency_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Frequency_Of_Campaign);
                    _objSPData.AddParamToSqlCommand(command, "@Survey", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Survey);
                    _objSPData.AddParamToSqlCommand(command, "@SurveyDate", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Surveydate);
                    if (ObjMCHeader.Budget_Of_Campaign == 0)
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, 0);
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommand(command, "@Budget_Of_Campaign", ParameterDirection.Input, SqlDbType.Int, 8, ObjMCHeader.Budget_Of_Campaign);
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Record_Status", ParameterDirection.Input, SqlDbType.Int, 8, "1");
                    _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                    _objSPData.AddParamToSqlCommand(command, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Campaign_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Doctor_Product_Mapping_Validation", ParameterDirection.Input, SqlDbType.Char, 1, ObjMCHeader.Doctor_Product_Mapping_Validation);
                    if (dtCatCode.Rows.Count == 0 || dtCatCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Category");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Category", ParameterDirection.Input, SqlDbType.Structured, dtCatCode, "TVP_Customer_Category");
                    }
                    if (dtSpecCode.Rows.Count == 0 || dtSpecCode == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Customer_Speciality");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Customer_Speciality", ParameterDirection.Input, SqlDbType.Structured, dtSpecCode, "TVP_Customer_Speciality");
                    }
                    if (dtDesg.Rows.Count == 0 || dtDesg == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_RegionType");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_RegionType", ParameterDirection.Input, SqlDbType.Structured, dtDesg, "TVP_Mapping_RegionType");
                    }
                    if (dtdocDesig == null || dtdocDesig.Rows.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Mapping_User");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Mapping_User", ParameterDirection.Input, SqlDbType.Structured, dtdocDesig, "TVP_Mapping_User");
                    }
                    if (dtParRegions.Rows.Count == 0 || dtParRegions == null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Participating_Regions");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Participating_Regions", ParameterDirection.Input, SqlDbType.Structured, dtParRegions, "TVP_Participating_Regions");
                    }
                    _objData.OpenConnection();
                    _objData.ExecuteNonQuery(command);
                    rowsAffected = 1;

                    if (rowsAffected > 0 && dtProdSamp != null)
                    {
                        rowsAffected = 0;
                        string cmdtxt = "SP_HD_UpdateMarketingCampaignDetails";
                        SqlCommand commnd = new SqlCommand(cmdtxt);
                        commnd.CommandType = CommandType.StoredProcedure;
                        _objSPData.AddParamToSqlCommand(commnd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                        _objSPData.AddParamToSqlCommand(commnd, "@Campaign_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjMCHeader.Campaign_Code);
                        _objSPData.AddParamToSqlCommand(commnd, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 8, company_Id);
                        if (dtProdSamp.Rows.Count == 0)
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commnd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Product_Sample");
                        }
                        else
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(commnd, "@TVP_Product_Sample", ParameterDirection.Input, SqlDbType.Structured, dtProdSamp, "TVP_Product_Sample");
                        }
                        _objSPData.AddParamToSqlCommand(commnd, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                        _objData.ExecuteNonQuery(commnd);
                        rowsAffected = 1;
                        trans.Commit();

                    }
                    else
                    {
                        rowsAffected = 1;
                    }

                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rowsAffected;
        }


        public List<MVCModels.HiDoctor_Master.ProductModel> GetSaleProductsBasedOnRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProd = new List<MVCModels.HiDoctor_Master.ProductModel>();
            string mode = "sales";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_MC_GetSalesProductsBasedOnRegion);
                SqlDataReader sqldataReader;
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 20, mode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.ProductModel _objProd = new MVCModels.HiDoctor_Master.ProductModel();
                        _objProd.Product_Code = sqldataReader["Product_Code"].ToString();
                        _objProd.Product_Name = sqldataReader["Product_Name"].ToString();
                        lstProd.Add(_objProd);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstProd;
        }

        public List<MVCModels.HiDoctor_Master.ProductModel> GetPromotionalProductsBasedOnRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProd = new List<MVCModels.HiDoctor_Master.ProductModel>();
            string mode = "sample";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_MC_GetSalesProductsBasedOnRegion);
                SqlDataReader sqldataReader;
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 20, mode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.ProductModel _objProd = new MVCModels.HiDoctor_Master.ProductModel();
                        _objProd.Product_Code = sqldataReader["Product_Code"].ToString();
                        _objProd.Product_Name = sqldataReader["Product_Name"].ToString();
                        _objProd.Product_Type_Name = sqldataReader["Product_Type_Name"].ToString();
                        _objProd.Product_Type_Code = sqldataReader["Product_Type_Code"].ToString();
                        lstProd.Add(_objProd);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstProd;
        }


        public List<DesignationModel> GetDesignations(string companyCode, string regionCode)
        {
            List<DesignationModel> lstDesig = new List<DesignationModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    lstDesig = connection.Query<DesignationModel>(SP_HD_MC_GetDesignationsBasedOnRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDesig;
        }
        public List<ActivityModel> GetActivities(string companyCode)
        {
            List<ActivityModel> lstAct = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstAct = connection.Query<ActivityModel>(SP_HD_MC_GetActivities, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstAct;
        }
        public MCProductModel GetProductsSamplebyCampaign(string companyCode, string campaignCode)
        {
            MCProductModel ObjMCProd = null;
            try
            {
                List<MCDetailsModel> lstprod = null;
                List<MCDetailsModel> lstsamp = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Campaign_Code", campaignCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_MC_GetProductDetailsByCampaigncode, p, commandType: CommandType.StoredProcedure))
                    {
                        lstprod = multiselect.Read<MCDetailsModel>().ToList();
                        lstsamp = multiselect.Read<MCDetailsModel>().ToList();
                    }
                    ObjMCProd = new MCProductModel();
                    ObjMCProd.lstProd = lstprod;
                    ObjMCProd.lstSamp = lstsamp;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return ObjMCProd;
        }
        public List<MCHeaderModel> GetRemarksByMarketingCampaign(string companyCode, string campaignCode)
        {
            List<MCHeaderModel> lstRemarks = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Campaign_Code", campaignCode);
                    lstRemarks = connection.Query<MCHeaderModel>(SP_HD_GetStatusHistoryForMarketingCampaign, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRemarks;
        }

        public List<RegionDetailsModel> GetDocForAllRegionsUndertheSelectedRegion(string companyCode, string regionCode, string excludeParentLevel, string includeOneLevelParent, string currentregionCode)
        {
            List<RegionDetailsModel> lstRegoins = null;
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
                    lstRegoins = connection.Query<RegionDetailsModel>(SP_HD_GetRegionHierarchytreeWithDoctorCount, p, commandTimeout: 180, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegoins;
        }

        public List<MVCModels.DoctorCategoryModel> GetDoctorCategory(string companyCode, string regionCode)
        {
            List<MVCModels.DoctorCategoryModel> lstDoctCat = new List<MVCModels.DoctorCategoryModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    lstDoctCat = connection.Query<MVCModels.DoctorCategoryModel>(SP_HD_MC_GetDoctorCategories, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDoctCat;
        }
        public List<MVCModels.SpecialityModel> GetSpeciality(string companyCode)
        {
            List<MVCModels.SpecialityModel> lstDoctCat = new List<MVCModels.SpecialityModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstDoctCat = connection.Query<MVCModels.SpecialityModel>(SP_HD_MC_GetSpecialities, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDoctCat;
        }
        public bool UpdateCampaignCurrentStatus(string companyCode, string campaignCode, int status, string reasontoPause, int companyId, string actionBy)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@Status", status);
                    p.Add("@ReasonToPause", reasontoPause);
                    p.Add("@CompanyId", companyId);
                    p.Add("@ActionBy", actionBy);
                    connection.Execute(SP_HD_MC_CamapignPauseorResume, p, commandType: CommandType.StoredProcedure);
                    result = true;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        public IEnumerable<MVCModels.MCHeaderModel> GetSelectedCMECHeader(string companyCode, string campaignCode, string regionCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCampaign = connection.Query<MVCModels.MCHeaderModel>(SP_HDGETSELECTEDCMEHEADER,
                                  new { CompanyCode = companyCode, CampaignCode = campaignCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCampaign;
        }
        public List<MVCModels.MCProductCustomerModel> GetCMEDoctorsByCampaignandRegion(string companyCode, string regionCode, string campaignCode, string customerStatus, string doctorName)
        {
            List<MVCModels.MCProductCustomerModel> lstMCDoc = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CampaignCode", campaignCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@DoctorName", doctorName);
                    p.Add("@CustomerStatus", customerStatus);
                    lstMCDoc = connection.Query<MVCModels.MCProductCustomerModel>(SP_HD_DPM_CME_GETALLDOCTORSBASEDONREGIONANDCAMPAIGN, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstMCDoc;
        }
        public List<MVCModels.MCProductCustomerModel> GetCMEProductsByRegionandCampaign(string companyCode, string campaignCode, string productName, string regionCode)
        {
            List<MVCModels.MCProductCustomerModel> lstMCProd = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@ProductName", productName);
                    p.Add("@CampaignCode", campaignCode);
                    lstMCProd = connection.Query<MVCModels.MCProductCustomerModel>(SP_HD_DPM_CME_GETALLSALEPRODUCTSBASEDONCAMPAIGNANDREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstMCProd;
        }
        public IEnumerable<MVCModels.MCHeaderModel> GetCMECampaigns(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCampaign = connection.Query<MVCModels.MCHeaderModel>(SP_HDGETCMEMARKETINGCAMPAIGNBYREGION,
                                  new { CompanyCode = companyCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCampaign;
        }
        public IEnumerable<MVCModels.MCCampaign> GetMCMappedtoDoctor(string companyCode, string doctorCode,
            string regionCode)
        {
            IEnumerable<MVCModels.MCCampaign> lstProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@DoctorCode", doctorCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    parameter.Add("@RegionCode", regionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    lstProduct = connection.Query<MVCModels.MCCampaign>(SP_HDGETMCMappedtoDoctor,
                                  parameter,
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProduct;
        }
        public IEnumerable<MVCModels.MCCampaign> GetMCMappedtoDoctorCount(string regionCode)
        {
            IEnumerable<MVCModels.MCCampaign> lstProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@RegionCode", regionCode, dbType: DbType.String, direction: ParameterDirection.Input);
                    lstProduct = connection.Query<MVCModels.MCCampaign>("SP_HDGETMCMappedtoDoctorCount",
                                  parameter,
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProduct;
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
            IEnumerable<MVCModels.MCHeaderModel> lstDoctorcount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@CampaignCode", campaignCode);
                    lstDoctorcount = connection.Query<MVCModels.MCHeaderModel>(SP_GETDOCTORCOUNTFORMC, parameter, commandType: CommandType.StoredProcedure).ToList();
                    return lstDoctorcount;
                }

            }
            catch
            {
                throw;
            }
        }
        #endregion MC - Restrict Doctor count per region wise

        //********** END - MARKETING CAMPAIGN DEFINER ******************************************//
        #region Doctor Product Mapping New
        public IEnumerable<MVCModels.DoctorDetails> GetDoctorDetailsByRegion(string regionCode)
        {
            IEnumerable<MVCModels.DoctorDetails> lstDoc;
            using (IDbConnection conn = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@RegionCode", regionCode);
                lstDoc = conn.Query<MVCModels.DoctorDetails>(USP_HD_GetDoctorByRegion, param, commandType: CommandType.StoredProcedure).ToList();
                conn.Close();
            }
            return lstDoc;
        }

        public IEnumerable<MVCModels.DocProdDetailsModel> GetDocProduct(string regionCode, string SelRegionCode)
        {
            List<MVCModels.DocProdDetailsModel> lstDocProdDetails = new List<MVCModels.DocProdDetailsModel>();
            IEnumerable<MVCModels.DocProductModel> lstDocProduct;
            IEnumerable<MVCModels.AC_ProductModel> lstAc_Product;
            string RegionChildCount = string.Empty;
            using (IDbConnection conn = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@RegionCode", regionCode);
                param.Add("@SelRegionCode", SelRegionCode);
                using (var multiSelect = conn.QueryMultiple(USP_HD_GetDocProdLst, param, commandType: CommandType.StoredProcedure))
                {
                    lstDocProduct = multiSelect.Read<MVCModels.DocProductModel>().ToList();
                    lstAc_Product = multiSelect.Read<MVCModels.AC_ProductModel>().ToList();
                }
                MVCModels.DocProdDetailsModel objDocProd = new MVCModels.DocProdDetailsModel();
                objDocProd.lstDocProd = lstDocProduct;
                objDocProd.lstAC_Product = lstAc_Product;
                lstDocProdDetails.Add(objDocProd);
                conn.Close();
            }
            return lstDocProdDetails.ToList();
        }
        public class MCDocProdEnumurator : IEnumerable<SqlDataRecord>
        {

            public MCDocProdEnumurator(IEnumerable<MVCModels.DocProdInsertModel> data)
            {
                _data = data;
            }
            private IEnumerable<MVCModels.DocProdInsertModel> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {
            new SqlMetaData("Customer_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Customer_Category_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Support_Quantity", SqlDbType.VarChar, 30),
            new SqlMetaData("Potential_Quantity", SqlDbType.VarChar, 30),
            new SqlMetaData("Product_Priority_No", SqlDbType.Int),
            new SqlMetaData("Region_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("User_Region_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Ref_Type", SqlDbType.VarChar, 30),
         };

                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    record.SetValue(0, item.Customer_Code);
                    record.SetValue(1, item.Customer_Category_Code);
                    record.SetValue(2, item.Product_Code);
                    record.SetValue(3, item.Support_Quantity);
                    record.SetValue(4, item.Potential_Quantity);
                    record.SetValue(5, item.Product_Priority_No);
                    record.SetValue(6, item.Region_Code);
                    record.SetValue(7, item.User_Region_Code);
                    record.SetValue(8, item.Ref_Type);
                    yield return record;
                }
            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }
        public string InsertDocProd(string companyCode, string userName, List<MVCModels.DocProdInsertModel> lstInsertDocProd, string selType)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                cmdText = USP_HD_Insert_DocProd;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objSPData.AddParamToSqlCommand(command, "@selType", ParameterDirection.Input, SqlDbType.VarChar, 10, selType);
                if (lstInsertDocProd.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@MC_TYPE", ParameterDirection.Input, SqlDbType.Structured, null, "MC_TVP");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@MC_TYPE", ParameterDirection.Input, SqlDbType.Structured, new MCDocProdEnumurator(lstInsertDocProd.AsEnumerable()), "MC_TVP");
                }


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int IsParentRegion(string userRegionCode)
        {
            int result = 0;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@userRegionCode", userRegionCode);
                    parameter.Add("@Result", result, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(USP_HD_CheckParentRegion, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<int>("@Result");
                    conn.Close();
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
        #region Survey
        public List<PrivilegeDetailsModel> GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstPrivileges = conn.Query<PrivilegeDetailsModel>(SP_HD_BPP_GETPRIVILEGESBYUSERTYPECODE, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstPrivileges;
        }
        #endregion
        #endregion public methods

    }
}
