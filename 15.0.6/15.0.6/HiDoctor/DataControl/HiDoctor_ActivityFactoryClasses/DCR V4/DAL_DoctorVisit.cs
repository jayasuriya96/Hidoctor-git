using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
namespace DataControl
{
    public class DAL_DoctorVisit : DapperRepository
    {
        #region Private Variables
        private SPData _objSPData = null;
        private Data _objData = null;

        const string SP_HD_V4_GetDCRDoctorAccompanistMand = "SP_HD_V4_GetDCRDoctorAccompanistMand";
        const string SP_HDV4GETDCRDOCTORS = "SP_hdV4GetDCRDoctors";
        const string SP_HDGETSELECTEDCHEMISTS = "SP_hdGetSelectedChemists";
        const string SP_HDGETSPECIALITY = "SP_hdGetSpeciality";
        const string SP_HDGETSALEPRODUCTS = "SP_hdGetSaleProducts";
        const string SP_HD_V4_GETSELECTEDPRODUCTS = "SP_hd_V4_GetSelectedProducts";
        const string Sp_hd_ColorPrivValues = "Sp_hd_ColorPrivValues";
        const string SP_HD_V4_GETSALEPRODUCTS = "SP_HD_V4_GetSaleProducts";
        const string SP_HD_V4_GetDetailedSaleProducts = "SP_HD_V4_GetDetailedSaleProducts";
        const string SP_HD_V4_GETDOCTORVISITDATAPERDAY = "SP_HD_V4_GetDoctorVisitDataPerDay";
        const string SP_HD_V4_GETDCRPRODUCTSDETAILS = "SP_HD_V4_GetDCRProductsDetails";
        const string SP_HD_V4_GETDCRDOCTORACCOMPANISTDETAILS = "SP_HD_V4_GetDCRDoctorAccompanistDetails";
        const string SP_HD_V4_GETDCRDETAILEDPRODUCTSPERDAY = "SP_HD_V4_GetDCRDetailedProductsPerDay";
        const string SP_HD_V4_GETDCRCHEMISTVISITDATAPERDAY = "SP_HD_V4_GetDCRChemistVisitDataPerDay";
        const string SP_HD_V4_GETDCRRCPADETAILSPERDAY = "SP_HD_V4_GetDCRRCPADetailsPerDay";
        const string SP_HD_V4_GETTPDOCTORDETAILS = "SP_HD_V4_GetTPDoctorDetails";
        const string SP_HD_V4_GETTPPRODUCTDETAILS = "SP_HD_V4_GetTPProductDetails";
        const string SP_HD_V4_GETEDDOCTORVISITDATAPERDAY = "SP_HD_V4_GetEDDoctorVisitDataPerDay";
        const string SP_HD_V4_GETEDDCRPRODUCTSDETAILS = "SP_HD_V4_GetEDDCRProductsDetails";
        const string SP_HD_V4_GETEDDCRDOCTORACCOMPANISTDETAILS = "SP_HD_V4_GetEDDCRDoctorAccompanistDetails";
        const string SP_HD_V4_GETDCREDDETAILEDPRODUCTSPERDAY = "SP_HD_V4_GetDCREDDetailedProductsPerDay";
        const string SP_HD_V4_GETEDDCRCHEMISTVISITDATAPERDAY = "SP_HD_V4_GetEDDCRChemistVisitDataPerDay";
        const string SP_HD_V4_GETEDDCRRCPADETAILSPERDAY = "SP_HD_V4_GetEDDCRRCPADetailsPerDay";
        const string SP_HD_V4_CHECKWADATAEXIST = "SP_HD_V4_CheckWADataExist";
        const string SP_HD_V4_INSERTSDOCTORVISITDATA = "SP_HD_V4_InsertsDoctorVisitData";
        const string SP_HD_V4_GETDCRMAXCODE = "SP_HD_V4_GetDCRMaxCode";
        const string SP_HD_V4_DELETEDOCTORVISITDATA = "SP_HD_V4_DeleteDoctorVisitData";
        const string SP_HD_V4_GETEDDCRPRODUCTSDETAILSFORADOCTOR = "SP_HD_V4_GetEDDCRProductsDetailsForaDoctor";
        const string SP_HD_V4_GETDCRPRODUCTSDETAILSFORADOCTOR = "SP_HD_V4_GetDCRProductsDetailsForaDoctor";
        const string SP_HD_V4_GETDCRDOCTORACCOMPANISTDETAILSFORADOCTOR = "SP_HD_V4_GetDCRDoctorAccompanistDetailsForADoctor";
        const string SP_HD_V4_SAVEDOCTORACCOMAPANIST = "SP_HD_V4_SaveDoctorAccomapanist";
        const string SP_HD_V4_GETDCRDETAILEDPRODUCTSFORADOCTOR = "SP_HD_V4_GETDCRDETAILEDPRODUCTSFORADOCTOR";
        const string SP_HD_V4_SAVEDCRDETAILEDPRODUCTS = "SP_HD_V4_SaveDCRDetailedProducts";
        const string SP_HD_V4_GETDCRCHEMISTVISITFORADOCTOR = "SP_HD_V4_GetDCRChemistVisitForADoctor";
        const string SP_HD_V4_GETDCRRCPADETAILSFORADOCTOR = "SP_HD_V4_GetDCRRCPADetailsForADoctor";
        const string SP_HD_V4_GETDCREDRCPADETAILSFORADOCTOR = "SP_HD_V4_GetDCREDRCPADetailsForADoctor";
        const string SP_HD_V4_SAVEDCRCHEMISTANDRCAP = "SP_HD_V4_SAVEDCRCHEMISTANDRCAP";
        const string SP_HD_V4_INSERTSDOCTORVISITDATAFORMOBILE = "SP_HD_V4_InsertsDoctorVisitDataForMobile";
        const string SP_HD_V4_GETDCRMAXCODEANDDETAILSCOUNT = "SP_HD_V4_GetDCRMaxCodeAndDetailsCount";
        const string SP_HD_V4_GETEDDCRDOCTORACCOMPANISTDETAILSFORADOCTOR = "SP_HD_V4_GetEDDCRDoctorAccompanistDetailsForADoctor";
        const string SP_HD_V4_GETEDDCRDETAILEDPRODUCTSFORADOCTOR = "SP_HD_V4_GetEDDCRDetailedProductsForADoctor";
        const string SP_HD_V4_GETEDDCRCHEMISTVISITFORADOCTOR = "SP_HD_V4_GetEDDCRChemistVisitForADoctor";
        const string SP_HD_V4_GETDCREDPRODUCTSDETAILSFORADOCTOR = "SP_HD_V4_GetDCREDProductsDetailsForaDoctor";
        const string SP_HDV4DCRDOCTORCATEGORYVISITCOUNTCHECK = "SP_HDV4DCRDoctorCategoryVisitCountCheck";
        const string SP_HD_GETDCRFOLLOWUPS = "SP_HD_GetDCRFollowUps";
        const string SP_HD_V4_GETDCRDOCTORVISITATTACHMENT = "SP_HD_V4_GetDCRDoctorVisitAttachment";
        const string SP_HD_INSERDCRDOCTORVISITATTACHMENT = "SP_HD_InserDCRDoctorVisitAttachment";
        const string SP_HD_GETCUSTOMERDCRPOBDETAILS = "SP_HD_GetCustomerDCRPOBDetails";
        const string SP_HDGETLINEOFBUSINESS = "SP_HDGetLineOfBusiness";
        const string SP_HDGETDOCTORCAPTIONNAMEFORDCR = "SP_HDGetDoctorCaptionNameForDCR";
        const string SP_HD_V4_GETACCOMPANISTMANDATORYINDOCTORVISIT = "SP_HD_V4_GetAccompanistMandatoryInDoctorVisit";
        const string HD_HD_V4_GETDOCTORVISITPOBCOUNT = "HD_HD_V4_GetDoctorVisitPOBCount";
        const string DCR_DOCTOR_VISIT_TYPE_NAME = "TVP_DCR_DoctorVisit";
        const string DCR_DOCTOR_ACC_TYPE_NAME = "TVP_DCR_DoctorAccWithAccompaniedCall";
        //const string DCR_DOCTOR_ACC_TYPE_NAME = "TVP_DCR_DoctorAcc";
        const string DCR_INPUT_TYPE_NAME = "TVP_DCR_ProductDetails";
        const string DCR_CHEMIST_TYPE_NAME = "TVP_DCR_ChemistVisit";
        const string DCR_FOLLOWUP_TYPE_NAME = "TVP_DCR_FollowUp";
        const string TVP_DCR_DOCTORVISITATTACHMENT = "TVP_DoctorVisitAttachment";
        const string TVP_POB_Header = "TVP_POB_Header";
        const string TVP_POB_Details = "TVP_POB_Details";
        const string DCR_DETAILED_PRODUCT_TYPE_NAME = "TVP_DCR_DetailedProd";
        const string TVP_DCR_ACTIVITY = "TVP_DCR_Activity";
        const string DCR_RCPA_TYPE_NAME = "TVP_DCR_RCPADetails";
        const string SP_hdGetProducName = "SP_hdGetProducName";
        const string SP_HD_CheckProduct = "SP_HD_CheckProduct";
        const string SP_HD_CheckCompetitor = "SP_HD_CheckCompetitor";
        const string sp_sdGetAllSpeciality = "sp_sdGetAllSpeciality";
        const string DCR_Competitor_Addition = "TVP_DCR_PROD_COMP";
        const string TVP_DCR_Product_Batch_Details = "TVP_DCR_Product_Batch_Details";
        const string SP_HD_GET_DetailedCompDetails = "SP_HD_GET_DetailedCompDetails";
        const string SP_HD_GET_CustActiveMC = "SP_HD_GET_CustActiveMC";
        const string SP_HD_V4_GETCMEPlannedDOCTORDETAILS = "SP_HD_V4_GETCMEPlannedDOCTORDETAILS";
        #endregion Private Variables

        #region Private Methods
        /// <summary>
        /// Converts Doctor Data reader to Doctor List
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        private List<DCRDoctorVisitModel> GetDoctorsList(SqlDataReader dr)
        {
            // Creates List object.
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
            while (dr.Read())
            {
                // Creates the object.
                DCRDoctorVisitModel dcrdoctorvisit = new DCRDoctorVisitModel();

                // Set the properties values.
                dcrdoctorvisit.label = dr["Customer_Name"].ToString() + "_" + dr["MDL"].ToString() + "_" + dr["Speciality_Name"].ToString() + "_" + dr["Region_Name"].ToString();
                dcrdoctorvisit.label = dcrdoctorvisit.label.TrimStart().TrimEnd();
                dcrdoctorvisit.value = dr["Customer_Code"].ToString();
                dcrdoctorvisit.Category = dr["Category_Name"].ToString();
                dcrdoctorvisit.Category_Code = dr["Category_Code"].ToString();
                dcrdoctorvisit.Is_Acc_Doctor = dr["Is_Acc_Doctor"].ToString();
                dcrdoctorvisit.Speciality_Code = dr["Speciality_Code"].ToString();
                dcrdoctorvisit.Speciality_Name = dr["Speciality_Name"].ToString();
                dcrdoctorvisit.Doctor_Region_Code = dr["Region_Code"].ToString();
                dcrdoctorvisit.MDL_Number = dr["MDL_Number"].ToString();
                // Add to the list.
                lstDCRDoctorVisitModel.Add(dcrdoctorvisit);
            }
            return lstDCRDoctorVisitModel;
        }

        /// <summary>
        /// Converts to Data Reader to List.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRChemistVisitModel> GetChemistsList(SqlDataReader dataReader)
        {
            List<DCRChemistVisitModel> lstdcrChemistVisitModel = new List<DCRChemistVisitModel>();

            while (dataReader.Read())
            {
                DCRChemistVisitModel dcrChemistVisitModel = new DCRChemistVisitModel();

                dcrChemistVisitModel.label = dataReader["Customer_Name"].ToString();
                dcrChemistVisitModel.value = dataReader["Customer_Code"].ToString();
                dcrChemistVisitModel.Is_Acc_Chemist = dataReader["Is_Acc_Chemist"].ToString();
                dcrChemistVisitModel.Chemists_Region_Code = dataReader["Region_Code"].ToString();
                dcrChemistVisitModel.MDL_Number = dataReader["mdl_number"].ToString();
                dcrChemistVisitModel.Region_Name = dataReader["Region_name"].ToString();
                dcrChemistVisitModel.Local_Area = dataReader["Local_Area"].ToString();
                dcrChemistVisitModel.Sur_Name = dataReader["Sur_Name"].ToString();
                dcrChemistVisitModel.Chemist_Name = dataReader["Chemist_Name"].ToString();
                lstdcrChemistVisitModel.Add(dcrChemistVisitModel);
            }
            return lstdcrChemistVisitModel;

        }

        /// <summary>
        /// Converts Speciality Datareader to Speciality list.
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        private List<DCRDoctorVisitModel> GetSpecialityList(SqlDataReader dr)
        {
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
            while (dr.Read())
            {
                DCRDoctorVisitModel dcrDoctorVisitModel = new DCRDoctorVisitModel();
                dcrDoctorVisitModel.label = dr["Speciality_Name"].ToString();
                dcrDoctorVisitModel.value = dr["Speciality_Code"].ToString();

                lstDCRDoctorVisitModel.Add(dcrDoctorVisitModel);
            }
            return lstDCRDoctorVisitModel;
        }

        /// <summary>
        /// Converts Sale Products DataReader to Sale Products list.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRProductDetailsModel> GetSaleProductsList(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();

            while (dataReader.Read())
            {
                DCRProductDetailsModel dcrProductsDetailModel = new DCRProductDetailsModel();

                dcrProductsDetailModel.label = dataReader["Product_Name"].ToString();
                dcrProductsDetailModel.value = dataReader["Product_Code"].ToString();

                lstDCRProductDetailsModel.Add(dcrProductsDetailModel);
            }
            return lstDCRProductDetailsModel;
        }

        /// <summary>
        /// Converts Products Data Reader to Products list.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRProductDetailsModel> GetUserProductsList(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> lstDCRProductsDetailModel = new List<DCRProductDetailsModel>();
            while (dataReader.Read())
            {
                DCRProductDetailsModel dcrProductsDetailModel = new DCRProductDetailsModel();
                dcrProductsDetailModel.label = dataReader["Product_Name"].ToString() + "(" + dataReader["Stock"].ToString() + ")";
                dcrProductsDetailModel.value = dataReader["Product_Code"].ToString();
                dcrProductsDetailModel.Product_Code = dataReader["Product_Code"].ToString().Split('_')[0];
                dcrProductsDetailModel.Current_Stock = dataReader["Stock"].ToString();
                dcrProductsDetailModel.Min_Count = Convert.ToInt32(dataReader["Min_Count"].ToString());
                dcrProductsDetailModel.Max_Count = Convert.ToInt32(dataReader["Max_Count"].ToString());

                lstDCRProductsDetailModel.Add(dcrProductsDetailModel);
            }
            return lstDCRProductsDetailModel;
        }

        /// <summary>
        /// Converts the All Sale Products to list for AutoFill
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRProductDetailsModel> GetSaleProductsListForDetailed(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> lstDCRProductsDetails = new List<DCRProductDetailsModel>();
            while (dataReader.Read())
            {
                DCRProductDetailsModel dcrProductsDetailsModel = new DCRProductDetailsModel();
                if (dataReader["Product_Name"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.label = dataReader["Product_Name"].ToString();
                }
                if (dataReader["Product_Code"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.value = dataReader["Product_Code"].ToString();
                }
                if (dataReader["Unit_Rate"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.Unit_Rate = Convert.ToDecimal(dataReader["Unit_Rate"].ToString());
                }
                dcrProductsDetailsModel.Price_group_Code = dataReader["Price_group_Code"].ToString();

                try
                {
                    dcrProductsDetailsModel.ProductMappingType = dataReader["ProductMappingType"].ToString();
                }
                catch (Exception ex)
                {
                }
                lstDCRProductsDetails.Add(dcrProductsDetailsModel);
            }
            return lstDCRProductsDetails;
        }
        private List<DCRProductDetailsModel> GetNEWSaleProductsListForDetailed(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> lstDCRProductsDetails = new List<DCRProductDetailsModel>();
            while (dataReader.Read())
            {
                DCRProductDetailsModel dcrProductsDetailsModel = new DCRProductDetailsModel();
                if (dataReader["Product_Name"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.label = dataReader["Product_Name"].ToString();
                }
                if (dataReader["Product_Code"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.value = dataReader["Product_Code"].ToString();
                }

                try
                {
                    dcrProductsDetailsModel.ProductMappingType = dataReader["ProductMappingType"].ToString();
                }
                catch (Exception ex)
                {
                }
                lstDCRProductsDetails.Add(dcrProductsDetailsModel);
            }
            return lstDCRProductsDetails;
        }
        /// <summary>
        /// Converts Doctor Visit Data to List.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRDoctorVisitModel> GetDoctorVisitDataList(SqlDataReader dataReader)
        {
            List<DCRDoctorVisitModel> dcrDoctorVisitDataModelList = new List<DCRDoctorVisitModel>();
            StringBuilder stringBuilder = new StringBuilder();
            while (dataReader.Read())
            {
                DCRDoctorVisitModel dcrDoctorVisitModel = new DCRDoctorVisitModel();
                stringBuilder.Clear();
                dcrDoctorVisitModel.Doctor_Visit_Code = dataReader["DCR_Visit_Code"].ToString();

                // Doctor Name Builder.
                stringBuilder.Append(dataReader["Doctor_Name"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["MDL"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Speciality_Name"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Region_Name"].ToString());
                dcrDoctorVisitModel.Doctor_Name = stringBuilder.ToString();
                dcrDoctorVisitModel.label = stringBuilder.ToString();
                // After assign clear the string builder.
                stringBuilder.Clear();

                dcrDoctorVisitModel.Doctor_Code = dataReader["Doctor_Code"].ToString();
                dcrDoctorVisitModel.Speciality_Name = dataReader["Speciality_Name"].ToString();
                dcrDoctorVisitModel.POB_Amount = dataReader["PO_Amount"].ToString();
                dcrDoctorVisitModel.Doctor_Visit_Time = dataReader["Doctor_Visit_Time"].ToString();
                dcrDoctorVisitModel.Visit_Mode = dataReader["Visit_Mode"].ToString();
                dcrDoctorVisitModel.Is_CPDoc = dataReader["Is_CP_Doc"].ToString();
                dcrDoctorVisitModel.Remarks = dataReader["Remarks_By_User"].ToString();
                dcrDoctorVisitModel.Doctor_Region_Code = dataReader["Doctor_Region_Code"].ToString();

                // Unique Doctor Region Code Builder.
                stringBuilder.Append(dataReader["Doctor_Code"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Doctor_Region_Code"].ToString());
                dcrDoctorVisitModel.Unique_Doctor_Code = stringBuilder.ToString();

                // After assign clear the string builder.
                stringBuilder.Clear();
                dcrDoctorVisitModel.Record_Status = dataReader["Record_Status"].ToString();
                dcrDoctorVisitModel.Mode_Of_Entry = dataReader["Mode_Of_Entry"].ToString();
                dcrDoctorVisitModel.Source_of_Entry = dataReader["Source_Of_Entry"].ToString();
                dcrDoctorVisitModel.Location = dataReader["Location"].ToString();
                dcrDoctorVisitModel.Lattitude = dataReader["Lattitude"].ToString();
                dcrDoctorVisitModel.Longtitude = dataReader["Longitude"].ToString();
                dcrDoctorVisitModel.Entered_Date_Time = dataReader["Entered_DateTime"].ToString();
                dcrDoctorVisitModel.Customer_Status = dataReader["Customer_Status"].ToString();
                dcrDoctorVisitModel.Category = dataReader["Category_Name"].ToString();
                dcrDoctorVisitModel.Category_Code = dataReader["Category_Code"].ToString();
                dcrDoctorVisitModel.Mode_Of_Form = dataReader["Mode_Of_Form"].ToString();
                dcrDoctorVisitModel.Business_Status_ID = Convert.ToInt32(dataReader["Business_Status_ID"].ToString());
                dcrDoctorVisitModel.Call_Objective_ID = Convert.ToInt32(dataReader["Call_Objective_ID"].ToString());
                dcrDoctorVisitModel.Marketing_Campaign_ID = dataReader["Marketing_Campaign_ID"].ToString();
                dcrDoctorVisitModel.Campaign_Name = dataReader["Campaign_Name"].ToString();
                dcrDoctorVisitModel.Is_Sample_not_Mandatory = Convert.ToInt32(dataReader["Is_Sample_not_Mandatory"]);
                dcrDoctorVisitModel.Detail_NotGiven_Check = Convert.ToInt32(dataReader["Detail_NotGiven_Check"]);
                dcrDoctorVisitModel.No_ChemistVisit_Check = Convert.ToInt32(dataReader["No_ChemistVisit_Check"]);
                dcrDoctorVisitModel.Chemist_Visit_WithoutRCPA_Check = Convert.ToInt32(dataReader["Chemist_Visit_WithoutRCPA_Check"]);
                dcrDoctorVisitModel.Doctor_Visit_Without_POB = Convert.ToInt32(dataReader["Doctor_Visit_Without_POB"]);
                dcrDoctorVisitDataModelList.Add(dcrDoctorVisitModel);

            }
            return dcrDoctorVisitDataModelList;
        }

        /// <summary>
        /// Converts DCR Dotor Accompanist Details to list.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRDoctorAccompanistModel> GetDCRDoctorAccompanistList(SqlDataReader dataReader)
        {
            List<DCRDoctorAccompanistModel> dcrDoctorAccompanistList = new List<DCRDoctorAccompanistModel>();
            while (dataReader.Read())
            {
                DCRDoctorAccompanistModel dcrdoctorAccompanistModel = new DCRDoctorAccompanistModel();
                //dcrdoctorAccompanistModel.DCR_Doctor_Acc_Code = Convert.ToInt64(dataReader["DCR_Doctor_Acc_Code"]);
                dcrdoctorAccompanistModel.Doctor_Visit_Code = dataReader["Doctor_Visit_Code"].ToString();
                dcrdoctorAccompanistModel.Acc_User_Name = dataReader["Acc_User_Name"].ToString();
                dcrdoctorAccompanistModel.Acc_User_Code = dataReader["Acc_User_Code"].ToString();
                dcrdoctorAccompanistModel.Acc_Region_Code = dataReader["Acc_Region_Code"].ToString();
                dcrdoctorAccompanistModel.Is_Only_For_Doctor = dataReader["Is_Only_For_Doctor"].ToString();
                dcrdoctorAccompanistModel.Mode_Of_Entry = dataReader["Mode_Of_Entry"].ToString();
                dcrdoctorAccompanistModel.Is_Accompanied_call = dataReader["Is_Accompanied_call"].ToString();

                dcrDoctorAccompanistList.Add(dcrdoctorAccompanistModel);
            }
            return dcrDoctorAccompanistList;
        }

        private List<DCRProductDetailsModel> GetDCRProductDetailsList(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> dcrProductsDetailsModelList = new List<DCRProductDetailsModel>();

            while (dataReader.Read())
            {
                StringBuilder stringBuilder = new StringBuilder();

                DCRProductDetailsModel dcrProductsDetailsModel = new DCRProductDetailsModel();
                dcrProductsDetailsModel.DCR_Visit_Code = dataReader["DCR_Visit_Code"].ToString();
                dcrProductsDetailsModel.DCR_Product_Code = dataReader["DCR_Product_Code"].ToString();
                dcrProductsDetailsModel.Product_Name = dataReader["Product_Name"].ToString();
                dcrProductsDetailsModel.Product_Code = dataReader["Product_Code"].ToString();
                dcrProductsDetailsModel.Quantity_Provided = dataReader["Quantity_Provided"].ToString();
                dcrProductsDetailsModel.Is_Detailed = dataReader["Is_Detailed"].ToString();
                dcrProductsDetailsModel.Doctor_Code = dataReader["Doctor_Code"].ToString();
                dcrProductsDetailsModel.Doctor_Region_Code = dataReader["Doctor_Region_Code"].ToString();
                dcrProductsDetailsModel.Batch_Number = dataReader["Batch_Number"].ToString();
                stringBuilder.Append(dataReader["Doctor_Code"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Doctor_Region_Code"].ToString());
                dcrProductsDetailsModel.Unique_Doctor_Code = stringBuilder.ToString();
                stringBuilder.Clear();

                dcrProductsDetailsModel.Current_Stock = dataReader["Current_Stock"].ToString();

                dcrProductsDetailsModelList.Add(dcrProductsDetailsModel);
            }
            return dcrProductsDetailsModelList;

        }

        /// <summary>
        /// Retrieves the DCR Detailed Products list.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRDetailedProductsModel> GetDCRDetailedProductsList(SqlDataReader dataReader)
        {
            List<DCRDetailedProductsModel> DCRDetailedProductsModelList = new List<DCRDetailedProductsModel>();
            while (dataReader.Read())
            {
                DCRDetailedProductsModel dcrDetailedProductsModel = new DCRDetailedProductsModel();
                dcrDetailedProductsModel.Doctor_Visit_Code = dataReader["Doctor_Visit_Code"].ToString();
                dcrDetailedProductsModel.Sale_Product_Code = dataReader["Sales_Product_Code"].ToString();
                dcrDetailedProductsModel.Sale_Product_Name = dataReader["Product_Name"].ToString();
                dcrDetailedProductsModel.Mode_Of_Entry = dataReader["Mode_Of_Entry"].ToString();
                dcrDetailedProductsModel.Business_Status_ID = Convert.ToInt32(dataReader["Business_Status_ID"].ToString());
                dcrDetailedProductsModel.Business_Status_Remarks = dataReader["Business_Status_Remarks"].ToString();
                dcrDetailedProductsModel.BusinessPotential = float.Parse(dataReader["BusinessPotential"].ToString());
                DCRDetailedProductsModelList.Add(dcrDetailedProductsModel);
            }
            return DCRDetailedProductsModelList;
        }

        /// <summary>
        /// Converts RCPA Data to List
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRRCPADetailsModel> GetDCRRCPADetailsList(SqlDataReader dataReader)
        {
            List<DCRRCPADetailsModel> dcrRCPADetailsModelList = new List<DCRRCPADetailsModel>();
            while (dataReader.Read())
            {
                DCRRCPADetailsModel dcrRCPADetailsModel = new DCRRCPADetailsModel();

                dcrRCPADetailsModel.DCR_Visit_Code = dataReader["DCR_Visit_Code"].ToString();
                dcrRCPADetailsModel.DCR_Product_Code = dataReader["DCR_Product_Code"].ToString();
                dcrRCPADetailsModel.Product_Name = dataReader["Product_Name"].ToString();
                dcrRCPADetailsModel.Chemist_Visit_Code = dataReader["Chemist_Visit_Code"].ToString();
                dcrRCPADetailsModel.Product_Code = dataReader["Product_Code"].ToString();
                dcrRCPADetailsModel.Competitor_Product_Name = dataReader["Competitor_Product_Name"].ToString();
                dcrRCPADetailsModel.Suuport_Qty = dataReader["Support_Qty"].ToString();
                dcrRCPADetailsModel.DCR_RCPA_Code = dataReader["DCR_RCPA_Code"].ToString();
                dcrRCPADetailsModel.Competitor_Product_Code = dataReader["Competitor_Product_Code"].ToString();

                dcrRCPADetailsModelList.Add(dcrRCPADetailsModel);
            }
            return dcrRCPADetailsModelList;
        }

        /// <summary>
        /// Converts to Data Reader to Chemist Visit Data List
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRChemistVisitModel> GetDCRChemistVisitList(SqlDataReader dataReader)
        {
            List<DCRChemistVisitModel> dcrChemistVisitModelList = new List<DCRChemistVisitModel>();
            while (dataReader.Read())
            {
                DCRChemistVisitModel dcrChemistVisitModel = new DCRChemistVisitModel();
                dcrChemistVisitModel.DCR_Visit_Code = dataReader["DCR_Visit_Code"].ToString();
                dcrChemistVisitModel.DCR_Chemists_Code = dataReader["DCR_Chemists_Code"].ToString();
                dcrChemistVisitModel.Chemist_Name = dataReader["Chemists_Name"].ToString();
                dcrChemistVisitModel.Chemist_Code = dataReader["Chemist_Code"].ToString();
                dcrChemistVisitModel.POB_Amount = dataReader["PO_Amount"].ToString();

                dcrChemistVisitModelList.Add(dcrChemistVisitModel);
            }
            return dcrChemistVisitModelList;
        }

        private List<DCRFollowUp> GetDCRFollowUpList(SqlDataReader dataReader)
        {
            List<DCRFollowUp> lsdcrDCRFollowUp = new List<DCRFollowUp>();
            while (dataReader.Read())
            {
                DCRFollowUp dcrDCRFollowUp = new DCRFollowUp();
                dcrDCRFollowUp.Tasks = dataReader["Tasks"].ToString();
                dcrDCRFollowUp.Due_Date = Convert.ToDateTime(dataReader["Due_Date"]);
                dcrDCRFollowUp.DCR_Visit_Code = dataReader["DCR_Visit_Code"].ToString();

                lsdcrDCRFollowUp.Add(dcrDCRFollowUp);
            }
            return lsdcrDCRFollowUp;
        }

        private List<DCRDoctorVisitAttachment> GetDCRDoctorVisitAttachmentList(SqlDataReader dataReader)
        {
            var DCRDoctorVisitAttachment = new List<DCRDoctorVisitAttachment>();
            while (dataReader.Read())
            {
                var DoctorVisitAttachment = new DCRDoctorVisitAttachment();
                DoctorVisitAttachment.Blob_Url = dataReader["Blob_Url"].ToString();
                DoctorVisitAttachment.Filename = dataReader["Filename"].ToString();
                DoctorVisitAttachment.DCR_Visit_Code = dataReader["DCR_Visit_Code"].ToString();
                DoctorVisitAttachment.Status = "1";
                DCRDoctorVisitAttachment.Add(DoctorVisitAttachment);
            }
            return DCRDoctorVisitAttachment;
        }

        /// <summary>
        /// Converts to TP Or CP Doctors Data to List.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRDoctorVisitModel> GetTPOrCPDoctorsList(SqlDataReader dataReader)
        {
            List<DCRDoctorVisitModel> dcrDoctorVisitModelList = new List<DCRDoctorVisitModel>();
            while (dataReader.Read())
            {
                DCRDoctorVisitModel dcrDoctorVisitModel = new DCRDoctorVisitModel();
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.Clear();

                // Doctor Name builder.
                stringBuilder.Append(dataReader["Doctor_Name"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["MDL"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Speciality_Name"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Region_Name"].ToString());

                dcrDoctorVisitModel.Doctor_Name = stringBuilder.ToString();
                dcrDoctorVisitModel.label = stringBuilder.ToString();
                // Clear the Builder.
                stringBuilder.Clear();

                dcrDoctorVisitModel.Doctor_Code = dataReader["Doctor_Code"].ToString();
                dcrDoctorVisitModel.Is_CPDoc = "1";
                dcrDoctorVisitModel.Speciality_Name = dataReader["Speciality_Name"].ToString();
                dcrDoctorVisitModel.Doctor_Region_Code = dataReader["Doctor_Region_Code"].ToString();
                dcrDoctorVisitModel.Record_Status = dataReader["Record_Status"].ToString();
                dcrDoctorVisitModel.Mode_Of_Entry = dataReader["Mode_Of_Entry"].ToString();
                // Unique Region Code Builder.
                stringBuilder.Append(dataReader["Doctor_Code"].ToString());
                stringBuilder.Append("_");
                stringBuilder.Append(dataReader["Doctor_Region_Code"].ToString());

                dcrDoctorVisitModel.Unique_Doctor_Code = stringBuilder.ToString();

                dcrDoctorVisitModel.Source_of_Entry = dataReader["Source_Of_Entry"].ToString();
                dcrDoctorVisitModel.Location = dataReader["Location"].ToString();
                dcrDoctorVisitModel.Lattitude = dataReader["Lattitude"].ToString();
                dcrDoctorVisitModel.Longtitude = dataReader["Longitude"].ToString();
                dcrDoctorVisitModel.Entered_Date_Time = dataReader["Entered_Date_Time"].ToString();
                dcrDoctorVisitModel.Customer_Status = dataReader["Customer_Status"].ToString();
                dcrDoctorVisitModel.Category_Code = dataReader["Category_Code"].ToString();
                dcrDoctorVisitModel.Category = dataReader["Category_Name"].ToString();
                // Clear the Builder.
                stringBuilder.Clear();
                dcrDoctorVisitModelList.Add(dcrDoctorVisitModel);

            }
            return dcrDoctorVisitModelList;
        }

        /// <summary>
        /// Converts TP Product Details to List.
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        private List<DCRProductDetailsModel> GetTPProductsList(SqlDataReader dataReader)
        {
            List<DCRProductDetailsModel> dcrProductsDetailsList = new List<DCRProductDetailsModel>();
            while (dataReader.Read())
            {
                DCRProductDetailsModel dcrProductsDetails = new DCRProductDetailsModel();

                dcrProductsDetails.Doctor_Code = dataReader["Doctor_Code"].ToString();
                dcrProductsDetails.Product_Name = dataReader["Product_Name"].ToString();
                dcrProductsDetails.Product_Code = dataReader["Product_Code"].ToString();
                dcrProductsDetails.Quantity_Provided = dataReader["Quantity_Provided"].ToString();
                dcrProductsDetails.Doctor_Region_Code = dataReader["Doctor_Region_Code"].ToString();
                dcrProductsDetails.Unique_Doctor_Code = dataReader["Doctor_Code"].ToString() + "_" + dataReader["Doctor_Region_Code"].ToString();
                dcrProductsDetails.Current_Stock = dataReader["Current_Stock"].ToString();

                dcrProductsDetailsList.Add(dcrProductsDetails);
            }
            return dcrProductsDetailsList;
        }


        #endregion Private Methods

        #region Public Methods
        #region DCR Master Data
        /// <summary>
        /// Retrieves the Doctors list for DCR V4 Autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="region_Code"></param>
        /// <param name="acc_Regions"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetSelectedDoctors(string company_Code, string region_Code, string acc_Regions, string config_Value, string dcrActualDate)
        {
            try
            {
                // Creates instance.
                List<DCRDoctorVisitModel> lstDoctorVisitModel = new List<DCRDoctorVisitModel>();
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SP_HDV4GETDCRDOCTORS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add Parameters to Command Object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, acc_Regions.Length, acc_Regions);
                _objSPData.AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");
                _objSPData.AddParamToSqlCommand(command, "@Config_Value", ParameterDirection.Input, SqlDbType.VarChar, 50, config_Value);
                _objSPData.AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.Date, 50, dcrActualDate);
                // Set Output Parameter.
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Exceute the Reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts data reader to list.
                    lstDoctorVisitModel = GetDoctorsList(dataReader);
                }
                return lstDoctorVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Chemist list for DCR V4 Autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="region_Code"></param>
        /// <param name="acc_Regions"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetSelectedChemists(string company_Code, string region_Code, string acc_Regions)
        {
            try
            {
                // Creates instance.
                List<DCRChemistVisitModel> lstDCRChemistVisit = new List<DCRChemistVisitModel>();
                _objSPData = new SPData();
                _objData = new Data();
                string cmdText = SP_HDGETSELECTEDCHEMISTS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add Parameters to Command Object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, acc_Regions.Length, acc_Regions);
                _objSPData.AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");

                // Set Output Parameter.
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Exceute the Reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts data reader to list.
                    lstDCRChemistVisit = GetChemistsList(dataReader);
                }
                return lstDCRChemistVisit;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Speciality list to DCR V4 Autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetSpeciality(string company_Code)
        {
            try
            {
                // Creates Instance
                // We are using Doctor visit model for specilaity master.
                _objSPData = new SPData();
                _objData = new Data();
                List<DCRDoctorVisitModel> lstdcrDoctorVisitModel = new List<DCRDoctorVisitModel>();
                string cmdText = SP_HDGETSPECIALITY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to Speciality list.
                    lstdcrDoctorVisitModel = GetSpecialityList(dataReader);
                }

                // returns the list.
                return lstdcrDoctorVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Company Sale Products or Division Sale Products.
        /// if user mapping any division sp retruns only division sale products.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetSaleProducts(string company_Code, string user_Code, string dcrActualDate)
        {
            try
            {
                // Creates Instance
                // We are using Product Details  model for Sale Products.
                _objSPData = new SPData();
                _objData = new Data();
                List<DCRProductDetailsModel> lstdcrProductModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HDGETSALEPRODUCTS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrActualDate);
                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to Sale Products list.
                    lstdcrProductModel = GetSaleProductsList(dataReader);
                }

                // returns the list.
                return lstdcrProductModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the User Mapping Products for DCR V4 Autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <param name="prodBringType"></param>
        /// <param name="searchWord"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetUserProducts(string company_Code, string user_Code, string prodBringType,
            string searchWord, string DCR_Date)
        {
            try
            {
                // Creates Instance
                _objSPData = new SPData();
                _objData = new Data();
                List<DCRProductDetailsModel> lstdcrProductModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETSELECTEDPRODUCTS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@ProductTypes", ParameterDirection.Input, SqlDbType.VarChar, 100, prodBringType);
                _objSPData.AddParamToSqlCommand(command, "@SplitChar", ParameterDirection.Input, SqlDbType.VarChar, 1, "^");
                _objSPData.AddParamToSqlCommand(command, "@SearchWord", ParameterDirection.Input, SqlDbType.VarChar, 10, searchWord);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Date);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);


                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstdcrProductModel = GetUserProductsList(dataReader);
                }

                // returns the list.
                return lstdcrProductModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the All Sale Products list to DCR V4 Detailed box Autofill.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="division_Code"></param>
        /// <returns></returns>
        /// 
        public List<VisitTimePrivValues> checkColorPrivelegeForDetailedProdcutsPopup(string companyCode, string usertypecode)
        {
            List<VisitTimePrivValues> lstresult = new List<VisitTimePrivValues>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companycode", companyCode);
                    p.Add("@usertype", usertypecode);
                    lstresult = connection.Query<VisitTimePrivValues>(Sp_hd_ColorPrivValues, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstresult;
        }
        public List<DCRProductDetailsModel> GetAllNEWSaleProductsForDetailed(string company_Code, string region_Code, string Doc_Region_Code, string Doctor_code, DateTime dcrDate, int bring_Color_status)
        {
            try
            {
                // Creates Instance
                _objSPData = new SPData();
                _objData = new Data();
                List<DCRProductDetailsModel> lstdcrProductModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GetDetailedSaleProducts;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@Doc_Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Doc_Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@dcrDate", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@Doctor_code", ParameterDirection.Input, SqlDbType.VarChar, 30, Doctor_code);
                _objSPData.AddParamToSqlCommand(command, "@bring_Color_status", ParameterDirection.Input, SqlDbType.Int, 30, bring_Color_status);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstdcrProductModel = GetNEWSaleProductsListForDetailed(dataReader);
                }

                // returns the list.
                return lstdcrProductModel;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public List<DCRProductDetailsModel> GetAllSaleProductsForDetailed(string company_Code, string region_Code, string Doc_Region_Code, string Doctor_code, DateTime dcrDate, int bring_Color_status)
        {
            try
            {
                // Creates Instance
                _objSPData = new SPData();
                _objData = new Data();
                List<DCRProductDetailsModel> lstdcrProductModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETSALEPRODUCTS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@Doc_Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Doc_Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@dcrDate", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@Doctor_code", ParameterDirection.Input, SqlDbType.VarChar, 30, Doctor_code);
                _objSPData.AddParamToSqlCommand(command, "@bring_Color_status", ParameterDirection.Input, SqlDbType.Int, 30, bring_Color_status);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstdcrProductModel = GetSaleProductsListForDetailed(dataReader);
                }

                // returns the list.
                return lstdcrProductModel;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion DCR Master Data

        #region DCR Main Tables
        /// <summary>
        /// Retrieves the Doctor Visit Data from the Doctor Visit Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetDoctorVisitDataPerDay(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string DoctorNameSufPreConfigValue, string flag)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
                string cmdText = SP_HD_V4_GETDOCTORVISITDATAPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@Config_value", ParameterDirection.Input, SqlDbType.VarChar, 50, DoctorNameSufPreConfigValue);
                _objSPData.AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 2, flag);
                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRDoctorVisitModel = GetDoctorVisitDataList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Product Details Data from the DCR Product Details Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetDCRProductsDetailPerDay(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string flag)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETDCRPRODUCTSDETAILS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 2, flag);
                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRProductDetailsModel = GetDCRProductDetailsList(dataReader);
                }

                // returns the list.
                return lstDCRProductDetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Product Details Data from the DCR Product Details Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetDCRProductsDetailPerDayForaDoctor(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETDCRPRODUCTSDETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRProductDetailsModel = GetDCRProductDetailsList(dataReader);
                }

                // returns the list.
                return lstDCRProductDetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Product Details Data from the DCR Product Details Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetDCREDProductsDetailPerDayForaDoctor(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETDCREDPRODUCTSDETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRProductDetailsModel = GetDCRProductDetailsList(dataReader);
                }

                // returns the list.
                return lstDCRProductDetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Doctor Accompanist Data from the DCR Doctor Accompanist Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public string GetDrAccMandatory(string Company_Code, string User_Code, string DCR_Date)
        {
            string drAccMandatory = "No";
            _objSPData = new SPData();
            _objData = new Data();
            try
            {

                string cmdText = SP_HD_V4_GetDCRDoctorAccompanistMand;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Date", ParameterDirection.Input, SqlDbType.Date, 30, DCR_Date);
                _objData.OpenConnection(Company_Code);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            drAccMandatory = dataReader["result"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return drAccMandatory;
        }
        public List<DCRDoctorAccompanistModel> GetDCRDoctorAccomapnistDetails(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorAccompanistModel> lstDCRDoctorAccompanistModel = new List<DCRDoctorAccompanistModel>();
                string cmdText = SP_HD_V4_GETDCRDOCTORACCOMPANISTDETAILS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDoctorAccompanistModel = GetDCRDoctorAccompanistList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorAccompanistModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        /// <summary>
        /// Retrieves the DCR Doctor Accompanist Data from the DCR Doctor Accompanist Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorAccompanistModel> GetDCRDoctorAccomapnistDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorAccompanistModel> lstDCRDoctorAccompanistModel = new List<DCRDoctorAccompanistModel>();
                string cmdText = SP_HD_V4_GETDCRDOCTORACCOMPANISTDETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDoctorAccompanistModel = GetDCRDoctorAccompanistList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorAccompanistModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Doctor Accompanist Data from the DCR Doctor Accompanist Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorAccompanistModel> GetEDDCRDoctorAccomapnistDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorAccompanistModel> lstDCRDoctorAccompanistModel = new List<DCRDoctorAccompanistModel>();
                string cmdText = SP_HD_V4_GETEDDCRDOCTORACCOMPANISTDETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDoctorAccompanistModel = GetDCRDoctorAccompanistList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorAccompanistModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRDetailedProductsModel> GetDCRDetailedProductsDetails(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDetailedProductsModel> lstDCRDetailedProductsModel = new List<DCRDetailedProductsModel>();
                string cmdText = SP_HD_V4_GETDCRDETAILEDPRODUCTSPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDetailedProductsModel = GetDCRDetailedProductsList(dataReader);
                }

                // returns the list.
                return lstDCRDetailedProductsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRDetailedProductsModel> GetDCRDetailedProductsDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDetailedProductsModel> lstDCRDetailedProductsModel = new List<DCRDetailedProductsModel>();
                string cmdText = SP_HD_V4_GETDCRDETAILEDPRODUCTSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDetailedProductsModel = GetDCRDetailedProductsList(dataReader);
                }

                // returns the list.
                return lstDCRDetailedProductsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRDetailedProductsModel> GetDCREDDetailedProductsDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDetailedProductsModel> lstDCRDetailedProductsModel = new List<DCRDetailedProductsModel>();
                string cmdText = SP_HD_V4_GETEDDCRDETAILEDPRODUCTSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDetailedProductsModel = GetDCRDetailedProductsList(dataReader);
                }

                // returns the list.
                return lstDCRDetailedProductsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetDCRChemistsVisitDetailsPerDay(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRChemistVisitModel> lstDCRChemistVisitModel = new List<DCRChemistVisitModel>();
                string cmdText = SP_HD_V4_GETDCRCHEMISTVISITDATAPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.NVarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRChemistVisitModel = GetDCRChemistVisitList(dataReader);
                }

                // returns the list.
                return lstDCRChemistVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRRCPADetailsModel> GetDCRRCPADetailsPerDay(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRRCPADetailsModel> lstDCRRCPADetailsModel = new List<DCRRCPADetailsModel>();
                string cmdText = SP_HD_V4_GETDCRRCPADETAILSPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRRCPADetailsModel = GetDCRRCPADetailsList(dataReader);
                }

                // returns the list.
                return lstDCRRCPADetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRRCPADetailsModel> GetDCRRCPADetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRRCPADetailsModel> lstDCRRCPADetailsModel = new List<DCRRCPADetailsModel>();
                string cmdText = SP_HD_V4_GETDCRRCPADETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRRCPADetailsModel = GetDCRRCPADetailsList(dataReader);
                }

                // returns the list.
                return lstDCRRCPADetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRRCPADetailsModel> GetDCREDRCPADetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRRCPADetailsModel> lstDCRRCPADetailsModel = new List<DCRRCPADetailsModel>();
                string cmdText = SP_HD_V4_GETDCREDRCPADETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRRCPADetailsModel = GetDCRRCPADetailsList(dataReader);
                }

                // returns the list.
                return lstDCRRCPADetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodes(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = null;
                string cmdText = SP_HD_V4_GETDCRMAXCODE;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    objDCRDoctorVisitMaxCodes = GetDCRDoctorVisitMaxCode(dataReader);
                }
                // returns the list.
                return objDCRDoctorVisitMaxCodes;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodesAndDetailsCountForMobile(string company_Code, string DCR_Code, string user_Code,
         string DCR_Actual_Date, string DCR_Visit_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = null;
                string cmdText = SP_HD_V4_GETDCRMAXCODEANDDETAILSCOUNT;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    objDCRDoctorVisitMaxCodes = GetDCRDoctorVisitMaxCodeAndDetailsCount(dataReader);
                }
                // returns the list.
                return objDCRDoctorVisitMaxCodes;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string DeleteDoctorVisitData(string company_Code, string DCR_Code, string Doctor_Visit_Code, string user_Code, string flag)
        {
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SP_HD_V4_DELETEDOCTORVISITDATA;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, Doctor_Visit_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 5, flag);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        private DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCode(SqlDataReader dataReader)
        {
            DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = new DCRDoctorVisitMaxCodes();
            while (dataReader.Read())
            {
                objDCRDoctorVisitMaxCodes.Doctor_Vist_Max_Code = Convert.ToInt32(dataReader["DoctorVisitMaxCode"]);
                objDCRDoctorVisitMaxCodes.Doc_Acc_Max_Code = Convert.ToInt64(dataReader["DOC_ACC_Max_Code"]);
                objDCRDoctorVisitMaxCodes.Inputs_Max_Code = Convert.ToInt32(dataReader["InputsMaxCode"]);
                objDCRDoctorVisitMaxCodes.Detailed_Max_Code = Convert.ToInt64(dataReader["Det_Max_Code"]);
                objDCRDoctorVisitMaxCodes.Chemist_Max_Code = Convert.ToInt32(dataReader["ChemistVisitMaxCode"]);
                objDCRDoctorVisitMaxCodes.RCPA_Max_Code = Convert.ToInt32(dataReader["RCPAMAXCode"]);
            }
            return objDCRDoctorVisitMaxCodes;
        }

        private DCRDoctorVisitMaxCodes GetDCRDoctorVisitMaxCodeAndDetailsCount(SqlDataReader dataReader)
        {
            DCRDoctorVisitMaxCodes objDCRDoctorVisitMaxCodes = new DCRDoctorVisitMaxCodes();
            while (dataReader.Read())
            {
                objDCRDoctorVisitMaxCodes.Doctor_Vist_Max_Code = Convert.ToInt32(dataReader["DoctorVisitMaxCode"]);
                objDCRDoctorVisitMaxCodes.Doc_Acc_Max_Code = Convert.ToInt64(dataReader["DOC_ACC_Max_Code"]);
                objDCRDoctorVisitMaxCodes.Inputs_Max_Code = Convert.ToInt32(dataReader["InputsMaxCode"]);
                objDCRDoctorVisitMaxCodes.Detailed_Max_Code = Convert.ToInt64(dataReader["Det_Max_Code"]);
                objDCRDoctorVisitMaxCodes.Chemist_Max_Code = Convert.ToInt32(dataReader["ChemistVisitMaxCode"]);
                objDCRDoctorVisitMaxCodes.RCPA_Max_Code = Convert.ToInt32(dataReader["RCPAMAXCode"]);
                objDCRDoctorVisitMaxCodes.InputsCount = Convert.ToInt32(dataReader["InputsCount"]);
                objDCRDoctorVisitMaxCodes.ChemistCount = Convert.ToInt32(dataReader["ChemistCount"]);
                objDCRDoctorVisitMaxCodes.RCPACount = Convert.ToInt32(dataReader["RCPACount"]);
                objDCRDoctorVisitMaxCodes.DetailedMaxCount = Convert.ToInt32(dataReader["DetailedMaxCount"]);
            }
            return objDCRDoctorVisitMaxCodes;
        }
        #endregion DCR Main Tables

        #region TP OR CP
        /// <summary>
        /// Retrievs the TP Or CP Doctors.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="TP_ID"></param>
        /// <param name="CP_Code"></param>
        /// <param name="Region_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetTPOrCPDoctors(string company_Code, long TP_ID, string CP_Code, string Region_Code, string DoctorNameSufPreConfigValue, string DCR_Actual_Date)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
            string cmdText = SP_HD_V4_GETTPDOCTORDETAILS;
            // Set Command object.
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            // Add the parameters to command object.
            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@TP_ID", ParameterDirection.Input, SqlDbType.BigInt, 30, TP_ID);
            _objSPData.AddParamToSqlCommand(command, "@CP_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, CP_Code);
            _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Region_Code);
            _objSPData.AddParamToSqlCommand(command, "@Config_Value", ParameterDirection.Input, SqlDbType.VarChar, 50, DoctorNameSufPreConfigValue);
            _objSPData.AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.Date, 50, DCR_Actual_Date);

            // Opens the connection.
            _objData.OpenConnection(company_Code);

            // Execuete the data reader.
            using (SqlDataReader dataReader = _objData.ExecuteReader(command))
            {
                // Converts the DataReader to User Products list.
                lstDCRDoctorVisitModel = GetTPOrCPDoctorsList(dataReader);
            }
            // returns the list.
            return lstDCRDoctorVisitModel;
        }
        public List<DCRDoctorVisitModel> GetCMEDoctorVist(string company_Code, string user_Code, string DoctorNameSufPreConfigValue, string DCR_Actual_Date)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
            string cmdText = SP_HD_V4_GETCMEPlannedDOCTORDETAILS;
            // Set Command object.
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            // Add the parameters to command object.
            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
            _objSPData.AddParamToSqlCommand(command, "@Config_Value", ParameterDirection.Input, SqlDbType.VarChar, 50, DoctorNameSufPreConfigValue);
            _objSPData.AddParamToSqlCommand(command, "@DcrDate", ParameterDirection.Input, SqlDbType.Date, 50, DCR_Actual_Date);

            // Opens the connection.
            _objData.OpenConnection(company_Code);

            // Execuete the data reader.
            using (SqlDataReader dataReader = _objData.ExecuteReader(command))
            {
                // Converts the DataReader to User Products list.
                lstDCRDoctorVisitModel = GetTPOrCPDoctorsList(dataReader);
            }
            // returns the list.
            return lstDCRDoctorVisitModel;
        }
        /// <summary>
        /// Retrieve the TP Product Details.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="TP_ID"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetTPProductDetails(string company_Code, long TP_ID, string user_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<DCRProductDetailsModel> lstProductDetailsModel = new List<DCRProductDetailsModel>();
            string cmdText = SP_HD_V4_GETTPPRODUCTDETAILS;
            // Set Command object.
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            // Add the parameters to command object.
            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@TP_ID", ParameterDirection.Input, SqlDbType.BigInt, 30, TP_ID);
            _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);

            // Opens the connection.mlmo
            _objData.OpenConnection(company_Code);

            // Execuete the data reader.
            using (SqlDataReader dataReader = _objData.ExecuteReader(command))
            {
                // Converts the DataReader to User Products list.
                lstProductDetailsModel = GetTPProductsList(dataReader);
            }
            // returns the list.
            return lstProductDetailsModel;
        }

        public string InsertDoctorVisitData(string company_Code, string DCR_Code, string User_Code, string DCR_Actual_Date, string doctor_Visit_Code,
            IEnumerable<DCRDoctorVisitModel> dcrDoctorModel, IEnumerable<DCRProductDetailsModel> IDCRProductDetailsModel, IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel,
            IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel, IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel, IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel, IEnumerable<DCRFollowUp> IDDCRFollowUp, IEnumerable<DCRDoctorVisitAttachment> IDDCRDoctorVisitAttachment, IEnumerable<OrderHeader> IDDCROrderHeader, IEnumerable<OrderDetails> IDDCROrderDetails, string mode_Of_Form, int? business_Status_ID, IEnumerable<DCRActivity> IDDCRActivity,
            IEnumerable<DCRProductCompetitorAddition> IDCRCompetitor, int company_Id, IEnumerable<DCRProductDetailsModel> IDCRProductBatchModel, DateCapturingModel _objDateDetails)
        {
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SP_HD_V4_INSERTSDOCTORVISITDATA;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, doctor_Visit_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@Mode_Of_Form", ParameterDirection.Input, SqlDbType.TinyInt, 1, mode_Of_Form);
                _objSPData.AddParamToSqlCommand(command, "@Business_Status_ID", ParameterDirection.Input, SqlDbType.TinyInt, 1, business_Status_ID);
                _objSPData.AddParamToSqlCommand(command, "@company_id", ParameterDirection.Input, SqlDbType.Int, 30, company_Id);
                _objSPData.AddParamToSqlCommand(command, "@Created_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Date);
                _objSPData.AddParamToSqlCommand(command, "@Created_TimeZone", ParameterDirection.Input, SqlDbType.VarChar, 1000, _objDateDetails.TimeZone);
                _objSPData.AddParamToSqlCommand(command, "@Created_OffSet", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Off_Set);
                _objSPData.AddParamToSqlCommand(command, "@UTC_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.UTC_Date);
                if (((List<DCRDoctorVisitModel>)dcrDoctorModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisit", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DOCTOR_VISIT_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRDoctorVisitModelEnumurator(dcrDoctorModel), DCR_DOCTOR_VISIT_TYPE_NAME);
                }
                if (((List<DCRProductCompetitorAddition>)IDCRCompetitor).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_PROD_COMP", ParameterDirection.Input, SqlDbType.Structured, null, DCR_Competitor_Addition);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_PROD_COMP", ParameterDirection.Input, SqlDbType.Structured, new DCRProductCompetitor(IDCRCompetitor), DCR_Competitor_Addition);
                }

                if (((List<DCRProductDetailsModel>)IDCRProductDetailsModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InputsDetails", ParameterDirection.Input, SqlDbType.Structured, null, DCR_INPUT_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InputsDetails", ParameterDirection.Input, SqlDbType.Structured, new DCRProductDetailsModelEnumurator(IDCRProductDetailsModel), DCR_INPUT_TYPE_NAME);
                }

                if (((List<DCRProductDetailsModel>)IDCRProductBatchModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Product_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, null, TVP_DCR_Product_Batch_Details);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Product_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, new DCRProductDetailBatchsModelEnumurator(IDCRProductBatchModel), TVP_DCR_Product_Batch_Details);
                }
                if (((List<DCRChemistVisitModel>)IDCRChemistVisitModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, null, DCR_CHEMIST_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRChemistVisitEnumurator(IDCRChemistVisitModel), DCR_CHEMIST_TYPE_NAME);
                }

                if (((List<DCRFollowUp>)IDDCRFollowUp).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_FollowUp", ParameterDirection.Input, SqlDbType.Structured, null, DCR_FOLLOWUP_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_FollowUp", ParameterDirection.Input, SqlDbType.Structured, new DCRFollowUpEnumurator(IDDCRFollowUp), DCR_FOLLOWUP_TYPE_NAME);
                }
                if (((List<DCRDoctorVisitAttachment>)IDDCRDoctorVisitAttachment).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisitAttachment", ParameterDirection.Input, SqlDbType.Structured, null, TVP_DCR_DOCTORVISITATTACHMENT);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisitAttachment", ParameterDirection.Input, SqlDbType.Structured, new DoctorVisitAttachmentEnumurator(IDDCRDoctorVisitAttachment), TVP_DCR_DOCTORVISITATTACHMENT);
                }
                //---------
                if (((List<OrderHeader>)IDDCROrderHeader).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, null, TVP_POB_Header);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, new DCROrderHeaderEnumurator(IDDCROrderHeader), TVP_POB_Header);
                }
                //----
                //---------
                if (((List<OrderDetails>)IDDCROrderDetails).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, null, TVP_POB_Details);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, new DCROrderDetailsEnumurator(IDDCROrderDetails), TVP_POB_Details);
                }
                //----
                if (((List<DCRRCPADetailsModel>)IDCRRCPADetailsModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, null, DCR_RCPA_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, new DCRRCPADetailsEnumurator(IDCRRCPADetailsModel), DCR_RCPA_TYPE_NAME);
                }
                if (((List<DCRDoctorAccompanistModel>)IDCRDoctorAccompanistModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorAcc", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DOCTOR_ACC_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorAcc", ParameterDirection.Input, SqlDbType.Structured, new DCRDoctorAccompanistEnumurator(IDCRDoctorAccompanistModel), DCR_DOCTOR_ACC_TYPE_NAME);
                }
                if (((List<DCRDetailedProductsModel>)IDCRDetailedProductsModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DeatiledProd", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DETAILED_PRODUCT_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DeatiledProd", ParameterDirection.Input, SqlDbType.Structured, new DCRDetailedProductsEnumurator(IDCRDetailedProductsModel), DCR_DETAILED_PRODUCT_TYPE_NAME);
                }
                if (((List<DCRActivity>)IDDCRActivity).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Activity", ParameterDirection.Input, SqlDbType.Structured, null, TVP_DCR_ACTIVITY);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Activity", ParameterDirection.Input, SqlDbType.Structured, new DCRActivitysEnumurator(IDDCRActivity), TVP_DCR_ACTIVITY);
                }

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message + "^" + ex.StackTrace;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion TP OR CP

        #region ED DAL
        /// <summary>
        /// Retrieves the Doctor Visit Data from the Doctor Visit ED Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorVisitModel> GetEDDoctorVisitDataPerDay(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string DoctorNameSufPreConfigValue)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = new List<DCRDoctorVisitModel>();
                string cmdText = SP_HD_V4_GETEDDOCTORVISITDATAPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@Config_Value", ParameterDirection.Input, SqlDbType.VarChar, 50, DoctorNameSufPreConfigValue);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRDoctorVisitModel = GetDoctorVisitDataList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the Product Details Data from the DCR Product Details ED Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRProductDetailsModel> GetEDDCRProductsDetailPerDay(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETEDDCRPRODUCTSDETAILS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRProductDetailsModel = GetDCRProductDetailsList(dataReader);
                }

                // returns the list.
                return lstDCRProductDetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Doctor Accompanist Data from the DCR Doctor Accompanist ED Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <param name="DCR_Actual_Date"></param>
        /// <param name="User_Code"></param>
        /// <returns></returns>
        public List<DCRDoctorAccompanistModel> GetEDDCRDoctorAccomapnistDetails(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDoctorAccompanistModel> lstDCRDoctorAccompanistModel = new List<DCRDoctorAccompanistModel>();
                string cmdText = SP_HD_V4_GETEDDCRDOCTORACCOMPANISTDETAILS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDoctorAccompanistModel = GetDCRDoctorAccompanistList(dataReader);
                }

                // returns the list.
                return lstDCRDoctorAccompanistModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products ED Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRDetailedProductsModel> GetEDDCRDetailedProductsDetails(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRDetailedProductsModel> lstDCRDetailedProductsModel = new List<DCRDetailedProductsModel>();
                string cmdText = SP_HD_V4_GETDCREDDETAILEDPRODUCTSPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRDetailedProductsModel = GetDCRDetailedProductsList(dataReader);
                }

                // returns the list.
                return lstDCRDetailedProductsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetEDDCRChemistsVisitDetailsPerDay(string company_Code, string DCR_Code, string user_Code,
            string DCR_Actual_Date)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRChemistVisitModel> lstDCRChemistVisitModel = new List<DCRChemistVisitModel>();
                string cmdText = SP_HD_V4_GETEDDCRCHEMISTVISITDATAPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.NVarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRChemistVisitModel = GetDCRChemistVisitList(dataReader);
                }

                // returns the list.
                return lstDCRChemistVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetDCRChemistsVisitDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRChemistVisitModel> lstDCRChemistVisitModel = new List<DCRChemistVisitModel>();
                string cmdText = SP_HD_V4_GETDCRCHEMISTVISITFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRChemistVisitModel = GetDCRChemistVisitList(dataReader);
                }

                // returns the list.
                return lstDCRChemistVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRFollowUp> GetDCRFollowUp(string user_Code, string DCR_Actual_Date, string company_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRFollowUp = new List<DCRFollowUp>();
                string cmdText = SP_HD_GETDCRFOLLOWUPS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 30, DCR_Actual_Date);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    DCRFollowUp = GetDCRFollowUpList(dataReader);
                }

                // returns the list.
                return DCRFollowUp;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRDoctorVisitAttachment> GetDCRDoctorVisitAttachment(string user_Code, string DCR_Actual_Date, string company_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRDoctorVisitAttachment = new List<DCRDoctorVisitAttachment>();
                string cmdText = SP_HD_V4_GETDCRDOCTORVISITATTACHMENT;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 30, DCR_Actual_Date);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    DCRDoctorVisitAttachment = GetDCRDoctorVisitAttachmentList(dataReader);
                }

                // returns the list.
                return DCRDoctorVisitAttachment;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Retrieves the DCR Detailed Products from the DCR Detailed Products Table.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRChemistVisitModel> GetDCREDChemistsVisitDetailsForADoctor(string company_Code, string DCR_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRChemistVisitModel> lstDCRChemistVisitModel = new List<DCRChemistVisitModel>();
                string cmdText = SP_HD_V4_GETEDDCRCHEMISTVISITFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRChemistVisitModel = GetDCRChemistVisitList(dataReader);
                }

                // returns the list.
                return lstDCRChemistVisitModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public List<DCRRCPADetailsModel> GetEDDCRRCPADetailsPerDay(string company_Code, string DCR_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRRCPADetailsModel> lstDCRRCPADetailsModel = new List<DCRRCPADetailsModel>();
                string cmdText = SP_HD_V4_GETEDDCRRCPADETAILSPERDAY;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to DCR Doctor Accompanist list.
                    lstDCRRCPADetailsModel = GetDCRRCPADetailsList(dataReader);
                }

                // returns the list.
                return lstDCRRCPADetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="DCR_Code"></param>
        /// <returns></returns>
        public int CheckWADataExist(string company_Code, string DCR_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = SP_HD_V4_CHECKWADATAEXIST;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.NVarChar, 50, DCR_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                object rowCount = _objData.ExecuteScalar(command);
                return rowCount == null ? 0 : Convert.ToInt32(rowCount);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRProductDetailsModel> GetEDDCRProductsDetailPerDayForaDoctor(string company_Code, string DCR_Code, string DCR_Actual_Date,
            string User_Code, string DCR_Visit_Code)
        {
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                List<DCRProductDetailsModel> lstDCRProductDetailsModel = new List<DCRProductDetailsModel>();
                string cmdText = SP_HD_V4_GETEDDCRPRODUCTSDETAILSFORADOCTOR;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstDCRProductDetailsModel = GetDCRProductDetailsList(dataReader);
                }

                // returns the list.
                return lstDCRProductDetailsModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #endregion ED DAL

        public string InsertDCRDoctorAccompanist(string company_Code, string DCR_Code, string DCR_Visit_Code, IEnumerable<DCRDoctorAccompanistModel> IDCRDoctorAccompanistModel, string WA_Doctor_Visit_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();

            string cmdText = SP_HD_V4_SAVEDOCTORACCOMAPANIST;
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);
            _objSPData.AddParamToSqlCommand(command, "@WA_Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, WA_Doctor_Visit_Code);
            if (((List<DCRDoctorAccompanistModel>)IDCRDoctorAccompanistModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorAcc", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DOCTOR_ACC_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorAcc", ParameterDirection.Input, SqlDbType.Structured, new DCRDoctorAccompanistEnumurator(IDCRDoctorAccompanistModel), DCR_DOCTOR_ACC_TYPE_NAME);
            }

            SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
            returnValue.Direction = ParameterDirection.Output;
            returnValue.Size = 500;
            command.Parameters.Add(returnValue);

            _objData.OpenConnection(company_Code);
            _objData.ExecuteNonQuery(command);
            return command.Parameters["@Result"].Value.ToString();
        }

        public string InsertDCRDetailedProducts(string company_Code, string DCR_Code, string DCR_Visit_Code, IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel, string WA_Doctor_Visit_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();

            string cmdText = SP_HD_V4_SAVEDCRDETAILEDPRODUCTS;
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);
            _objSPData.AddParamToSqlCommand(command, "@WA_Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, @WA_Doctor_Visit_Code);
            if (((List<DCRDetailedProductsModel>)IDCRDetailedProductsModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRDetailedProd", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DETAILED_PRODUCT_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRDetailedProd", ParameterDirection.Input, SqlDbType.Structured, new DCRDetailedProductsEnumurator(IDCRDetailedProductsModel), DCR_DETAILED_PRODUCT_TYPE_NAME);
            }

            SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
            returnValue.Direction = ParameterDirection.Output;
            returnValue.Size = 500;
            command.Parameters.Add(returnValue);

            _objData.OpenConnection(company_Code);
            _objData.ExecuteNonQuery(command);
            return command.Parameters["@Result"].Value.ToString();
        }

        public string InsertDCRChemistAndRCPADetails(string company_Code, string DCR_Code, string DCR_Visit_Code, string user_Code, string DCR_Actual_Date,
            IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel, IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel)
        {
            _objSPData = new SPData();
            _objData = new Data();

            string cmdText = SP_HD_V4_SAVEDCRCHEMISTANDRCAP;
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
            _objSPData.AddParamToSqlCommand(command, "@Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);
            _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
            if (((List<DCRChemistVisitModel>)IDCRChemistVisitModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, null, DCR_CHEMIST_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRChemistVisitEnumurator(IDCRChemistVisitModel), DCR_CHEMIST_TYPE_NAME);
            }
            if (((List<DCRChemistVisitModel>)IDCRChemistVisitModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, null, DCR_RCPA_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, new DCRRCPADetailsEnumurator(IDCRRCPADetailsModel), DCR_RCPA_TYPE_NAME);
            }




            SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
            returnValue.Direction = ParameterDirection.Output;
            returnValue.Size = 500;
            command.Parameters.Add(returnValue);

            _objData.OpenConnection(company_Code);
            _objData.ExecuteNonQuery(command);
            return command.Parameters["@Result"].Value.ToString();
        }

        public string InsertDoctorVisitDataMobile(string company_Code, string @DCR_Code, string Doctor_Visit_Code, string user_Code,
            string Region_Code, string DCR_Actual_Date, IEnumerable<DCRDoctorVisitModel> IDCRDoctorVisitModel,
            IEnumerable<DCRProductDetailsModel> IDCRPrductDetailsModel, IEnumerable<DCRChemistVisitModel> IDCRChemistVisitModel,
            IEnumerable<DCRRCPADetailsModel> IDCRRCPADetailsModel, IEnumerable<DCRDetailedProductsModel> IDCRDetailedProductsModel, bool chemistModified, bool inputsModified, bool detailProductModified)
        {
            _objSPData = new SPData();
            _objData = new Data();

            string cmdText = SP_HD_V4_INSERTSDOCTORVISITDATAFORMOBILE;
            SqlCommand command = new SqlCommand(cmdText);
            command.CommandType = CommandType.StoredProcedure;

            _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
            _objSPData.AddParamToSqlCommand(command, "@Doctor_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, Doctor_Visit_Code);
            _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
            _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Region_Code);
            _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);
            _objSPData.AddParamToSqlCommand(command, "@DCRChemistModifed", ParameterDirection.Input, SqlDbType.Bit, 1, chemistModified);
            _objSPData.AddParamToSqlCommand(command, "@DCRInputsModified", ParameterDirection.Input, SqlDbType.Bit, 1, inputsModified);
            _objSPData.AddParamToSqlCommand(command, "@DCRdetProdModified", ParameterDirection.Input, SqlDbType.Bit, 1, detailProductModified);

            // Doctor Visit.
            if (((List<DCRDoctorVisitModel>)IDCRDoctorVisitModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisit", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DOCTOR_VISIT_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DoctorVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRDoctorVisitModelEnumurator(IDCRDoctorVisitModel), DCR_DOCTOR_VISIT_TYPE_NAME);
            }

            // Product Details
            if (((List<DCRProductDetailsModel>)IDCRPrductDetailsModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InputsDetails", ParameterDirection.Input, SqlDbType.Structured, null, DCR_INPUT_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InputsDetails", ParameterDirection.Input, SqlDbType.Structured, new DCRProductDetailsModelEnumurator(IDCRPrductDetailsModel), DCR_INPUT_TYPE_NAME);
            }

            // Detailed Products
            if (((List<DCRDetailedProductsModel>)IDCRDetailedProductsModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRDetailedProd", ParameterDirection.Input, SqlDbType.Structured, null, DCR_DETAILED_PRODUCT_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRDetailedProd", ParameterDirection.Input, SqlDbType.Structured, new DCRDetailedProductsEnumurator(IDCRDetailedProductsModel), DCR_DETAILED_PRODUCT_TYPE_NAME);
            }

            // chemist Visit
            if (((List<DCRChemistVisitModel>)IDCRChemistVisitModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, null, DCR_CHEMIST_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_ChemistsVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRChemistVisitEnumurator(IDCRChemistVisitModel), DCR_CHEMIST_TYPE_NAME);
            }

            // RCPA
            if (((List<DCRRCPADetailsModel>)IDCRRCPADetailsModel).Count == 0)
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, null, DCR_RCPA_TYPE_NAME);
            }
            else
            {
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, new DCRRCPADetailsEnumurator(IDCRRCPADetailsModel), DCR_RCPA_TYPE_NAME);
            }

            SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
            returnValue.Direction = ParameterDirection.Output;
            returnValue.Size = 500;
            command.Parameters.Add(returnValue);

            _objData.OpenConnection(company_Code);
            _objData.ExecuteNonQuery(command);
            return command.Parameters["@Result"].Value.ToString();
        }

        public SqlResultModel ValidateCategoryVisitCountRestriction(string company_Code, string user_Code, string region_Code,
        string doctor_Code, string category_Code, string DCR_Actual_Date)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlResultModel result = new SqlResultModel();
                string cmdText = SP_HDV4DCRDOCTORCATEGORYVISITCOUNTCHECK;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@Doctor_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, doctor_Code);
                _objSPData.AddParamToSqlCommand(command, "@Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, category_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 12, DCR_Actual_Date);

                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    while (dataReader.Read())
                    {
                        // Converts the DataReader to Sql Result Model.
                        result.Result_Code = Convert.ToInt32(dataReader["Result_Code"]);
                        result.Result_Text = dataReader["Result_Text"].ToString();
                        result.Result = dataReader["Result"].ToString();
                    }
                }
                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InserDCRDoctorVisitAttachment(string user_code, string DCR_Visit_Code, string File_Name, DateTime DCR_Actual_Date, string Blob_Url, string company_Code)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlResultModel result = new SqlResultModel();
                string cmdText = SP_HD_INSERDCRDOCTORVISITATTACHMENT;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Visit_Code);
                _objSPData.AddParamToSqlCommand(command, "@File_Name", ParameterDirection.Input, SqlDbType.VarChar, 200, File_Name);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 30, DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@Blob_Url", ParameterDirection.Input, SqlDbType.VarChar, 500, Blob_Url);
                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                return "";
            }
            finally
            {
                _objData.CloseConnection();
            }



        }
        #endregion Public Methods
        #region doctor
        public BusinessActivityMaster GetDoctorBusinessAndActivityMaster(string activity, string companyCode, string User_Type_Code, string user_code)
        {
            BusinessActivityMaster objBusinessActivityMaster = new BusinessActivityMaster();

            _objData = new Data();
            try
            {
                //_objSPData = new SPData();

                string cmdText = "HD_SP_BindDoctorBusiness";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData = new SPData();
                _objSPData.AddParamToSqlCommand(command, "@activity", ParameterDirection.Input, SqlDbType.VarChar, 5, activity);
                _objSPData.AddParamToSqlCommand(command, "@company_code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Type_Code);
                _objSPData.AddParamToSqlCommand(command, "@user_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                _objData.OpenConnection();
                SqlDataReader reader = _objData.ExecuteReader(command);
                if (reader.HasRows)
                {
                    List<BusinessStatus> lsBusinessStatus = new List<BusinessStatus>();
                    while (reader.Read())
                    {
                        lsBusinessStatus.Add(new BusinessStatus() { Business_Status_ID = Convert.ToInt32(reader["Business_Status_ID"].ToString()), Status_Name = reader["Status_Name"].ToString(), Entity_Type = Convert.ToInt32(reader["Entity_Type"].ToString()), Status = Convert.ToInt32(reader["status"].ToString()) });
                    }
                    objBusinessActivityMaster.lsBusinessStatus = lsBusinessStatus;
                }
                reader.NextResult();
                List<DCRActivity> lsDCRActivity = new List<DCRActivity>();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        lsDCRActivity.Add(new DCRActivity() { Customer_Activity_ID = Convert.ToInt32(reader["Customer_Activity_ID"].ToString()), Activity_Name = reader["Activity_Name"].ToString(), Status = Convert.ToInt32(reader["status"].ToString()) });
                    }
                }
                List<DCRCallObjective> lsCallObjective = new List<DCRCallObjective>();
                reader.NextResult();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        lsCallObjective.Add(new DCRCallObjective() { Call_Objective_ID = Convert.ToInt32(reader["Call_Objective_ID"].ToString()), Call_Objective_Name = reader["Call_Objective_Name"].ToString(), Status = Convert.ToInt32(reader["status"].ToString()) });
                    }
                }
                objBusinessActivityMaster.lsCallObjective = lsCallObjective;
                if (lsDCRActivity.Count > 0)
                {
                    lsDCRActivity.ForEach(
                    x => { x.label = x.Activity_Name; x.value = x.Customer_Activity_ID.ToString(); });
                    objBusinessActivityMaster.lsDCRActivity = lsDCRActivity;
                }

            }
            catch (Exception ex)
            {
                _objData.CloseConnection();
            }
            return objBusinessActivityMaster; ;
        }
        public BusinessActivityMaster GeMCDetails(string regionCode, string companyCode, string customer_code, DateTime dcrDate)
        {
            BusinessActivityMaster objBusinessActivityMaster = new BusinessActivityMaster();
            _objData = new Data();
            try
            {
                string cmdText = "HD_SP_GetDoctotMCDetails";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData = new SPData();
                _objSPData.AddParamToSqlCommand(command, "@region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@company_code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@customer_code", ParameterDirection.Input, SqlDbType.VarChar, 30, customer_code);
                _objSPData.AddParamToSqlCommand(command, "@created_region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@dcrDate", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                _objData.OpenConnection();
                SqlDataReader reader = _objData.ExecuteReader(command);
                if (reader.HasRows)
                {
                    List<DCRActivity> lsMCDetails = new List<DCRActivity>();
                    while (reader.Read())
                    {
                        lsMCDetails.Add(new DCRActivity() { Campaign_Code = reader["Campaign_Code"].ToString(), Campaign_Name = reader["Campaign_Name"].ToString(), CampaignMonth = reader["CampaignMonth"].ToString(), TrackMonth = reader["TrackMonth"].ToString() });
                    }
                    reader.NextResult();
                    List<DCRActivity> lsMCActivityDetails = new List<DCRActivity>();
                    while (reader.Read())
                    {
                        lsMCActivityDetails.Add(new DCRActivity() { Campaign_Code = reader["Campaign_Code"].ToString(), Activity_Name = reader["activity_name"].ToString(), MC_Activity_Id = Convert.ToInt32(reader["Activity_Id"].ToString()) });
                    }
                    if (lsMCDetails.Count > 0)
                    {
                        lsMCDetails.ForEach(y => { y.value = y.Campaign_Code.ToString(); y.label = y.Campaign_Name; });
                        objBusinessActivityMaster.lsMCDetails = lsMCDetails;
                    }
                    objBusinessActivityMaster.lsMCActivityDetails = lsMCActivityDetails;
                }
            }
            catch
            {
                throw;
            }
            return objBusinessActivityMaster;
        }
        public int Getsurvey(string UserCode,string CampaignCode)
        {
            int result = 0;
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", UserCode);
                    p.Add("@Campaign_Code", CampaignCode);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>("SP_HD_CheckSurvey", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("Result");
                    connection.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<SurveyDetails> GetsurveyDetails(string CompanyCode, string CampaignCode,string RegionCode)
        {
            List<SurveyDetails> lst = new List<SurveyDetails>();
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", CompanyCode);
                    p.Add("@Campaign_Code", CampaignCode);
                    p.Add("@RegionCode", RegionCode);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lst = connection.Query<SurveyDetails>("SP_HD_GetSurveydetails", p, commandType: CommandType.StoredProcedure).ToList();
                   // connection.Query<int>("SP_HD_GetSurveydetails", p, commandType: CommandType.StoredProcedure);
                    //result = p.Get<int>("Result");
                    connection.Close();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Visit_code"></param>
        /// <returns></returns>
        /// 
        public List<DcrMc> GetMCDetailsforDropdown(string regionCode, string companyCode, string customer_code, string dcrDate)
        {
            List<DcrMc> lst = new List<DcrMc>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@region_code", regionCode);
                    p.Add("@company_code", companyCode);
                    p.Add("@customer_code", customer_code);
                    p.Add("@dcrDate", dcrDate);
                    lst = connection.Query<DcrMc>("SP_HD_GET_CustActiveMC", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public List<CMEDetails> GetCMEProduct(int CME_ID, string Doctor_Code,int Activity_Id)
        {
            List<CMEDetails> lst = new List<CMEDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CME_ID", CME_ID);
                    p.Add("@Doctor_Code", Doctor_Code);
                    p.Add("@Activity_Id", Activity_Id);
                    lst = connection.Query<CMEDetails>("SP_HD_GET_CME_Product", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }

        public int ValidateCME(int CME_ID, string Doctor_Code, int Activity_Id)
        {
            int result = 0;
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CME_Id", CME_ID);
                    p.Add("@Doctor_Code", Doctor_Code);
                    p.Add("@Activity_Id", Activity_Id);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>("SP_HD_CheckCME", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("Result");
                    connection.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public DCRActivityDetails GetDCRActivity(string Visit_code, string flag)
        {
            DCRActivityDetails objDcrActivity = new DCRActivityDetails();
            _objData = new Data();
            try
            {
                string cmdText = "HD_SP_GetDCRActivity";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData = new SPData();
                _objSPData.AddParamToSqlCommand(command, "@Visit_code", ParameterDirection.Input, SqlDbType.VarChar, 30, Visit_code);
                _objSPData.AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 10, flag);
                _objData.OpenConnection();
                SqlDataReader reader = _objData.ExecuteReader(command);

                List<DCRActivity> lsCallActivity = new List<DCRActivity>();
                if (reader.HasRows)
                    while (reader.Read())
                    {
                        lsCallActivity.Add(new DCRActivity { Customer_Activity_ID = Convert.ToInt32(reader["Customer_Activity_ID"].ToString()), Activity_Remarks = reader["Activity_Remarks"].ToString(), Activity_Name = reader["Activity_Name"].ToString() });
                    }
                reader.NextResult();
                List<DCRActivity> lsMCActivityDetails = new List<DCRActivity>();
                if (reader.HasRows)
                    while (reader.Read())
                    {
                        lsMCActivityDetails.Add(new DCRActivity { Campaign_Code = reader["Campaign_Code"].ToString(), MC_Activity_Id = Convert.ToInt32(reader["MC_Activity_Id"].ToString()), Activity_Remarks = reader["MC_Remark"].ToString(), Campaign_Name = reader["Campaign_Name"].ToString(), Current_Sales = Convert.ToInt32(reader["Current_Sales"].ToString()), Expected_Sales = Convert.ToInt32(reader["Expected_Sales"].ToString()), NoofMonths = Convert.ToInt32(reader["NoofMonths"].ToString()), Campaign_Type = reader["Campaign_Type"].ToString()});
                    }
                reader.NextResult();
                List<CMETrackingDetails> lsttracking = new List<CMETrackingDetails>();
                if(reader.HasRows)
                    while (reader.Read())
                    {
                        lsttracking.Add(new CMETrackingDetails { Customer_Code = reader["Customer_Code"].ToString(), Campaign_Name = reader["Campaign_Name"].ToString(), Campaign_Code = Convert.ToInt32(reader["Campaign_Code"].ToString()), Product_Name = reader["Product_Name"].ToString(), Product_Code = reader["Product_Code"].ToString(), Current_Sales = Convert.ToInt32(reader["Current_Sales"].ToString()), Expected_Sales = Convert.ToInt32(reader["Expected_Sales"].ToString()), No_Of_Months = Convert.ToInt32(reader["No_Of_Months"].ToString())});
                    }
                objDcrActivity.lsCallActivity = lsCallActivity;
                objDcrActivity.lsMCActivityDetails = lsMCActivityDetails;
                objDcrActivity.lsttracking = lsttracking;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return objDcrActivity;
        }
        public Tuple<List<DCRDoctorVisitModel>, List<DCRDetailedProductsModel>> GetDoctorBusinessStatus(string doctor_code, DateTime dcr_date, string doctor_region_code, string user_type_code)
        {
            List<DCRDoctorVisitModel> lsDoctorVisit = new List<DCRDoctorVisitModel>();
            List<DCRDetailedProductsModel> lsDetailedProduct = new List<DCRDetailedProductsModel>();
            _objData = new Data();
            try
            {
                string cmdText = "HD_SP_BindDoctorBusinessStatus";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData = new SPData();
                _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.Date, 30, dcr_date);
                _objSPData.AddParamToSqlCommand(command, "@doctor_code", ParameterDirection.Input, SqlDbType.VarChar, 30, doctor_code);
                _objSPData.AddParamToSqlCommand(command, "@doctor_region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, doctor_region_code);
                _objSPData.AddParamToSqlCommand(command, "@user_type_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_type_code);
                _objData.OpenConnection();
                SqlDataReader reader = _objData.ExecuteReader(command);
                if (reader.HasRows)
                    while (reader.Read())
                    {
                        lsDoctorVisit.Add(new DCRDoctorVisitModel { Doctor_Code = reader["doctor_code"].ToString(), Doctor_Name = reader["Doctor_Name"].ToString(), Doctor_Region_Code = reader["Doctor_Region_Code"].ToString(), Business_Status_ID = Convert.ToInt32(reader["business_status_id"]), DCR_Actual_Date = reader["DCR_Date"].ToString() });
                    }
                reader.NextResult();
                if (reader.HasRows)
                    while (reader.Read())
                    {
                        lsDetailedProduct.Add(new DCRDetailedProductsModel { Doctor_Code = reader["doctor_code"].ToString(), Doctor_Name = reader["Doctor_Name"].ToString(), Doctor_Region_Code = reader["Doctor_Region_Code"].ToString(), Business_Status_ID = reader["business_status_id"].Equals(DBNull.Value) ? 0 : Convert.ToInt32(reader["business_status_id"]), DCR_Actual_Date = reader["DCR_Date"].ToString(), BusinessPotential = float.Parse(reader["BusinessPotential"].ToString()), Sale_Product_Code = reader["Sales_Product_Code"].ToString() });
                        //lsDetailedProduct.Add(new DCRDetailedProductsModel { Doctor_Code = reader["doctor_code"].ToString(), Doctor_Name = reader["Doctor_Name"].ToString(), Doctor_Region_Code = reader["Doctor_Region_Code"].ToString(), Business_Status_ID = Convert.ToInt32(reader["business_status_id"]), DCR_Actual_Date = reader["DCR_Date"].ToString(), BusinessPotential = float.Parse(reader["BusinessPotential"].ToString()), Sale_Product_Code = reader["Sales_Product_Code"].ToString() });
                    }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            Tuple<List<DCRDoctorVisitModel>, List<DCRDetailedProductsModel>> tubleDoctorDetail = new Tuple<List<DCRDoctorVisitModel>, List<DCRDetailedProductsModel>>(lsDoctorVisit, lsDetailedProduct);

            return tubleDoctorDetail;
        }
        #endregion
        #region POB
        public DataSet GetDCRPOBDetailsByVisitCode(DateTime Order_Date, string Customer_Code, string Customer_Region_Code, string Customer_Name, string Customer_Speciality, string User_Code, string Company_Code)
        {
            DataSet ds = new DataSet();
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRFollowUp = new List<DCRFollowUp>();
                string cmdText = SP_HD_GETCUSTOMERDCRPOBDETAILS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Order_Date", ParameterDirection.Input, SqlDbType.Date, 30, Order_Date);
                _objSPData.AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Customer_Code);
                _objSPData.AddParamToSqlCommand(command, "@Customer_Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Customer_Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@Customer_Name", ParameterDirection.Input, SqlDbType.VarChar, 50, Customer_Name);
                _objSPData.AddParamToSqlCommand(command, "@Customer_Speciality", ParameterDirection.Input, SqlDbType.VarChar, 50, Customer_Speciality);

                // Opens the connection.
                _objData.OpenConnection(Company_Code);

                ds = _objData.ExecuteDataSet(command);

            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        public DataSet GetLineOfBusiness(string region_codse, string company_Code)
        {
            DataSet ds = new DataSet();
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRFollowUp = new List<DCRFollowUp>();
                string cmdText = SP_HDGETLINEOFBUSINESS;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, -1, region_codse);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                ds = _objData.ExecuteDataSet(command);

            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        public List<DoctorCaptionName> GetDoctorCaptionName(string RegionCodes, string company_code)
        {
            Data objData = new Data();
            List<DoctorCaptionName> lsDoctorCaptionName = new List<DoctorCaptionName>();
            try
            {
                SqlDataReader sqldataReader;
                using (SqlCommand command = new SqlCommand(SP_HDGETDOCTORCAPTIONNAMEFORDCR))
                {
                    SPData _objSPData = new SPData();
                    command.CommandType = CommandType.StoredProcedure;
                    _objSPData.AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, -1, RegionCodes);
                    //_objSPData.AddParamToSqlCommand(command, "@user_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                    objData.OpenConnection(company_code);
                    using (sqldataReader = objData.ExecuteReader(command))
                    {
                        DoctorCaptionName CaptionName;
                        if (sqldataReader.HasRows)
                        {
                            while (sqldataReader.Read())
                            {
                                CaptionName = new DoctorCaptionName();
                                CaptionName.Privilege_Value_Name = sqldataReader["Privilege_Value_Name"].ToString();
                                lsDoctorCaptionName.Add(CaptionName);
                            }
                        }
                        else
                        {
                            CaptionName = new DoctorCaptionName();
                            CaptionName.Privilege_Value_Name = "Doctors/Customers";
                            lsDoctorCaptionName.Add(CaptionName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                objData.CloseConnection();
            }
            return lsDoctorCaptionName;
        }
        #endregion
        #region Val
        public string GetAccompanistMandatoryInDoctorVisit(string user_code, DateTime dcr_date, string company_Code)
        {
            string rValue = "NO";
            DataSet ds = new DataSet();
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRFollowUp = new List<DCRFollowUp>();
                string cmdText = SP_HD_V4_GETACCOMPANISTMANDATORYINDOCTORVISIT;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@user_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.Date, 30, dcr_date);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                SqlParameter returnValue = new SqlParameter("@acc_name", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 100;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                rValue = command.Parameters["@acc_name"].Value.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }

            return rValue;
        }
        public List<DCRDoctorVisitModel> GetDoctorVisitPOBCount(DateTime Dcr_Date, string User_Code, string company_Code)
        {
            List<DCRDoctorVisitModel> lsPobCount = new List<DCRDoctorVisitModel>();
            try
            {
                _objSPData = new SPData();
                _objData = new Data();
                string cmdText = HD_HD_V4_GETDOCTORVISITPOBCOUNT;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Dcr_Date", ParameterDirection.Input, SqlDbType.DateTime, 30, Dcr_Date);
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    while (dataReader.Read())
                    {
                        lsPobCount.Add(new DCRDoctorVisitModel() { Doctor_Visit_Code = dataReader["DCR_Visit_Code"].ToString(), POB_Count = Convert.ToInt32(dataReader["POBCount"]) });
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsPobCount;
        }

        public List<CompetitorProductaddition> Getproductnames(string CompanyCode)
        {
            List<CompetitorProductaddition> lstproduct = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);

                    lstproduct = connection.Query<CompetitorProductaddition>(SP_hdGetProducName, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
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
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);
                    p.Add("@Doctor_Code", Doctor_Code);
                    p.Add("@DCR_Code", DCR_Code);
                    p.Add("@DCR_Visit_Code", DCR_Visit_Code);
                    p.Add("@DCR_Detail_Product_Code", DCR_Detail_Product_Code);
                    p.Add("@Sale_Product_Code", Sale_Product_Code);
                    lstproduct = connection.Query<CompetitorProductaddition>(SP_HD_GET_DetailedCompDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
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
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);
                    p.Add("@DCR_Visit_Code", DCRVisitCode);

                    lstproduct = connection.Query<DCRProductCompetitorAddition>(SP_HD_GET_DetailedCompDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
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
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Product_Name", objProDetails.Product_Name);
                    p.Add("@Company_Code", objProDetails.Company_Code);
                    p.Add("@Speciality_Code", objProDetails.Speciality_Code);
                    p.Add("@Brand_Code", objProDetails.Brand_Code);
                    p.Add("@Category_Code", objProDetails.Category_Code);
                    p.Add("@UOM_Code", objProDetails.UOM_Code);
                    p.Add("@UOM_Type_Code", objProDetails.UOM_Type_Code);
                    p.Add("@Competitor_Code", objProDetails.Competitor_Code);
                    p.Add("@User_Code", _objCurrentInfo.GetUserCode());
                    p.Add("Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>("SP_HD_CheckProduct", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("Result");
                    connection.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public int GetchkComp(string CompetitorName, string Company_Code)
        {
            int result = 0;
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Competitor_Name", CompetitorName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_name", _objCurrentInfo.GetUserCode());

                    p.Add("Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>("SP_HD_CheckCompetitor", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("Result");
                    connection.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion

        public List<DCRProductBatch> GetDCRProductBatch(string productCode, string dcrDate, string userCode, string entity, string cv_visit_id, string Flag)
        {
            try
            {
                List<DCRProductBatch> lst = new List<DCRProductBatch>();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Product_Code", productCode);
                    p.Add("@DCR_Date", dcrDate);
                    p.Add("@User_Code", userCode);
                    p.Add("@entity", entity);
                    p.Add("@cv_visit_id", cv_visit_id);
                    p.Add("@Flag", Flag);
                    lst = connection.Query<DCRProductBatch>("SP_HD_GET_DCRProductBatch", p, commandType: CommandType.StoredProcedure).ToList<DCRProductBatch>();
                    connection.Close();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
    public class DCRDoctorVisitModelEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRDoctorVisitModelEnumurator(IEnumerable<DCRDoctorVisitModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRDoctorVisitModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 20),
         new SqlMetaData("Speciality_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Visit_Mode", SqlDbType.VarChar,5),
         new SqlMetaData("Doctor_Visit_Time", SqlDbType.VarChar, 10),
         new SqlMetaData("Is_CPDoc", SqlDbType.Char,1),
         new SqlMetaData("POB_Amount", SqlDbType.Decimal,13,2),
         new SqlMetaData("Is_Acc_Doctor", SqlDbType.Bit),
         new SqlMetaData("Category_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Remarks", SqlDbType.VarChar, 500),
         new SqlMetaData("Lattitude", SqlDbType.VarChar, 30),
         new SqlMetaData("Longtitude", SqlDbType.VarChar, 30),
         new SqlMetaData("Location", SqlDbType.VarChar, 500),
         new SqlMetaData("Source_of_Entry", SqlDbType.VarChar, 10),
         new SqlMetaData("Doctor_Region_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char, 1),
         new SqlMetaData("Entered_Date_Time", SqlDbType.VarChar, 30),
         new SqlMetaData("Call_Objective_ID", SqlDbType.Int),
         new SqlMetaData("Marketing_Campaign_ID", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Sample_not_Mandatory", SqlDbType.Int),
         new SqlMetaData("Detail_NotGiven_Check", SqlDbType.Int),
         new SqlMetaData("No_ChemistVisit_Check", SqlDbType.Int),
         new SqlMetaData("Chemist_Visit_WithoutRCPA_Check", SqlDbType.Int),
         new SqlMetaData("Doctor_Visit_Without_POB", SqlDbType.Int)

          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Doctor_Name);
                record.SetValue(1, item.Doctor_Code);
                record.SetValue(2, item.Speciality_Name);
                record.SetValue(3, item.Visit_Mode);
                record.SetValue(4, item.Doctor_Visit_Time);
                record.SetValue(5, item.Is_CPDoc);
                record.SetValue(6, Convert.ToDecimal(item.POB_Amount));
                record.SetValue(7, Convert.ToBoolean(item.Is_Acc_Doctor == null ? false : item.Is_Acc_Doctor == "0" ? false : true));
                record.SetValue(8, item.Category);
                record.SetValue(9, item.Remarks);
                record.SetValue(10, item.Lattitude);
                record.SetValue(11, item.Longtitude);
                record.SetValue(12, item.Location);
                record.SetValue(13, item.Source_of_Entry);
                record.SetValue(14, item.Doctor_Region_Code);
                record.SetValue(15, item.Mode_Of_Entry);
                record.SetValue(16, item.Entered_Date_Time == null ? null : Convert.ToDateTime(item.Entered_Date_Time).ToString());
                record.SetValue(17, item.Call_Objective_ID);
                record.SetValue(18, item.Marketing_Campaign_ID);
                record.SetValue(19, item.Is_Sample_not_Mandatory);
                record.SetValue(20, item.Detail_NotGiven_Check);
                record.SetValue(21, item.No_ChemistVisit_Check);
                record.SetValue(22, item.Chemist_Visit_WithoutRCPA_Check);
                record.SetValue(23, item.Doctor_Visit_Without_POB);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRProductDetailsModelEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRProductDetailsModelEnumurator(IEnumerable<DCRProductDetailsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRProductDetailsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Product_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Batch_Number", SqlDbType.VarChar, 30),
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
         new SqlMetaData("Speciality_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Detailed", SqlDbType.Char,1),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char,1),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Product_Code);
                record.SetValue(1, item.Product_Code);
                record.SetValue(2, "");
                record.SetValue(3, Convert.ToInt32(item.Quantity_Provided == null ? "0" : item.Quantity_Provided));
                record.SetValue(4, item.Speciality_Code);
                record.SetValue(5, item.Doctor_Code);
                record.SetValue(6, item.Is_Detailed);
                record.SetValue(7, item.Mode_Of_Entry);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRProductDetailBatchsModelEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRProductDetailBatchsModelEnumurator(IEnumerable<DCRProductDetailsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRProductDetailsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Product_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Batch_Number", SqlDbType.VarChar, 30),
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Product_Code);
                record.SetValue(1, item.Product_Code);
                record.SetValue(2, item.Batch_Number);
                record.SetValue(3, Convert.ToInt32(item.Quantity_Provided == null ? "0" : item.Quantity_Provided));

                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRDetailedProductsEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRDetailedProductsEnumurator(IEnumerable<DCRDetailedProductsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRDetailedProductsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Product_Detail_Code", SqlDbType.BigInt),
         new SqlMetaData("Sales_Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char, 1),
         new SqlMetaData("Business_Status_ID", SqlDbType.BigInt),
         new SqlMetaData("Business_Status_Remarks", SqlDbType.VarChar, 100),
         new SqlMetaData("BusinessPotential", SqlDbType.VarChar,10),
         new SqlMetaData("id", SqlDbType.Int),
          };
            int count = 1;
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Product_Detail_Code);
                record.SetValue(1, item.Sale_Product_Code);
                record.SetValue(2, item.Mode_Of_Entry);
                record.SetValue(3, item.Business_Status_ID);
                record.SetValue(4, item.Business_Status_Remarks);
                record.SetValue(5, item.BusinessPotential.ToString());
                record.SetValue(6, count);
                count++;
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRDoctorAccompanistEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRDoctorAccompanistEnumurator(IEnumerable<DCRDoctorAccompanistModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRDoctorAccompanistModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Doctor_Acc_Code", SqlDbType.BigInt),
         new SqlMetaData("Acc_User_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Acc_User_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Acc_Region_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Only_For_Doctor", SqlDbType.Char, 1),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char, 1),
         new SqlMetaData("Acc_User_Type_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Accompanied_call", SqlDbType.VarChar, 3),

          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Doctor_Acc_Code);
                record.SetValue(1, item.Acc_User_Name);
                record.SetValue(2, item.Acc_User_Code);
                record.SetValue(3, item.Acc_Region_Code);
                record.SetValue(4, item.Is_Only_For_Doctor);
                record.SetValue(5, item.Mode_Of_Entry);
                record.SetValue(6, item.Acc_User_Type_Name);
                record.SetValue(7, item.Is_Accompanied_call);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRProductCompetitor : IEnumerable<SqlDataRecord>
    {

        public DCRProductCompetitor(IEnumerable<DCRProductCompetitorAddition> data)
        {
            _data = data;
        }
        private IEnumerable<DCRProductCompetitorAddition> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Company_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("DCR_Visit_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Competitor_Code", SqlDbType.Int),
         new SqlMetaData("Competitor_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Product_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Value", SqlDbType.Int),
         new SqlMetaData("Probability", SqlDbType.Decimal,6,2),
         new SqlMetaData("Remarks", SqlDbType.VarChar, 500),
         new SqlMetaData("Speciality_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Speciality_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Category_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Category_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Brand_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Brand_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("UOM_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("UOM_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("UOM_Type_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("UOM_Type_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Product_Type_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("flag", SqlDbType.Int),
         new SqlMetaData("Company_Id",SqlDbType.Int),
         new SqlMetaData("Sale_Product_code", SqlDbType.VarChar, 30),

    };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Code);
                record.SetValue(1, item.Company_Code);
                record.SetValue(2, item.DCR_Visit_Code);
                record.SetValue(3, item.Doctor_Code);
                record.SetValue(4, item.Competitor_Code);
                record.SetValue(5, item.Competitor_Name);
                record.SetValue(6, item.Product_Name);
                record.SetValue(7, item.Product_Code);
                record.SetValue(8, item.Value);
                record.SetValue(9, item.Probability);
                record.SetValue(10, item.Remarks);
                record.SetValue(11, item.Speciality_Name);
                record.SetValue(12, item.Speciality_Code);
                record.SetValue(13, item.Category_Name);
                record.SetValue(14, item.Category_Code);
                record.SetValue(15, item.Brand_Name);
                record.SetValue(16, item.Brand_Code);
                record.SetValue(17, item.UOM_Name);
                record.SetValue(18, item.UOM_Code);
                record.SetValue(19, item.UOM_Type_Name);
                record.SetValue(20, item.UOM_Type_Code);
                record.SetValue(21, item.Product_Type_Name);
                record.SetValue(22, item.flag);
                record.SetValue(23, item.Company_Id);

                record.SetValue(24, item.Sale_Product_code);

                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRChemistVisitEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRChemistVisitEnumurator(IEnumerable<DCRChemistVisitModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRChemistVisitModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Chemists_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Chemists_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Chemist_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("PO_Amount", SqlDbType.Decimal,13,2),
         new SqlMetaData("Is_Acc_Chemist", SqlDbType.Char, 1),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char, 1),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Chemists_Code);
                record.SetValue(1, item.Chemist_Name);
                record.SetValue(2, item.Chemist_Code);
                record.SetValue(3, Convert.ToDecimal(item.POB_Amount));
                record.SetValue(4, item.Is_Acc_Chemist);
                record.SetValue(5, item.Mode_Of_Entry);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRFollowUpEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRFollowUpEnumurator(IEnumerable<DCRFollowUp> data)
        {
            _data = data;
        }
        private IEnumerable<DCRFollowUp> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Tasks", SqlDbType.VarChar, 250),
         new SqlMetaData("Due_Date", SqlDbType.Date),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Tasks);
                record.SetValue(1, item.Due_Date);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRActivitysEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRActivitysEnumurator(IEnumerable<DCRActivity> data)
        {
            _data = data;
        }
        private IEnumerable<DCRActivity> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Activity_Type", SqlDbType.VarChar, 10),
         new SqlMetaData("Customer_Activity_ID", SqlDbType.Int),
         new SqlMetaData("Activity_Remarks", SqlDbType.VarChar,250),
         new SqlMetaData("Created_By", SqlDbType.VarChar,30),
         new SqlMetaData("MC_Activity_Id", SqlDbType.Int),
         new SqlMetaData("Campaign_Code", SqlDbType.VarChar,30),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Activity_Type);
                record.SetValue(1, item.Customer_Activity_ID);
                record.SetValue(2, item.Activity_Remarks);
                record.SetValue(3, item.Created_By);
                record.SetValue(4, item.MC_Activity_Id);
                record.SetValue(5, item.Campaign_Code);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCROrderHeaderEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCROrderHeaderEnumurator(IEnumerable<OrderHeader> data)
        {
            _data = data;
        }
        private IEnumerable<OrderHeader> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("Client_Order_ID", SqlDbType.Int),
         new SqlMetaData("Order_Id", SqlDbType.Int),
         new SqlMetaData("Customer_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Stockist_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Stockist_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Order_Number", SqlDbType.Int),
         new SqlMetaData("Total_POB_Value", SqlDbType.Decimal,19,2),
         new SqlMetaData("Total_Qty", SqlDbType.Decimal,19,2),
         new SqlMetaData("No_Of_Products", SqlDbType.SmallInt),
         new SqlMetaData("Remarks", SqlDbType.VarChar,500),
         new SqlMetaData("Order_Status", SqlDbType.TinyInt),
         new SqlMetaData("Order_Mode", SqlDbType.TinyInt),
         new SqlMetaData("Source_Of_Entry", SqlDbType.TinyInt),
         new SqlMetaData("Due_Date", SqlDbType.Date),
         new SqlMetaData("Favouring_User_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Favouring_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Created_By", SqlDbType.VarChar,12),
         new SqlMetaData("Created_Date", SqlDbType.DateTime),
         new SqlMetaData("Action",SqlDbType.Int),
         new SqlMetaData("Customer_Name", SqlDbType.VarChar,50),
         new SqlMetaData("Customer_Speciality", SqlDbType.VarChar,50),
         new SqlMetaData("MDL_Number", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Category_Code", SqlDbType.VarChar,12),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Client_Order_Id);
                record.SetValue(1, item.Client_Order_Id);
                record.SetValue(2, item.Order_Id);
                record.SetValue(3, item.Customer_Code);
                record.SetValue(4, item.Customer_Region_Code);
                record.SetValue(5, item.Stockist_Code);
                record.SetValue(6, item.Stockist_Region_Code);
                record.SetValue(7, item.Order_Number);
                record.SetValue(8, item.Total_POB_Value);
                record.SetValue(9, item.Total_Qty);
                record.SetValue(10, item.No_Of_Products);
                record.SetValue(11, item.Remarks);
                record.SetValue(12, item.Order_Status);
                record.SetValue(13, item.Order_Mode);
                record.SetValue(14, item.Source_Of_Entry);
                record.SetValue(15, item.Order_Due_Date);
                record.SetValue(16, item.Favouring_User_Code);
                record.SetValue(17, item.Favouring_Region_Code);
                record.SetValue(18, item.Created_By);
                record.SetValue(19, DateTime.Now);
                record.SetValue(20, item.Action);
                record.SetValue(21, item.Customer_Name);
                record.SetValue(22, item.Customer_Speciality);
                record.SetValue(23, item.MDL_Number);
                record.SetValue(24, item.Customer_Category_Code);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCROrderDetailsEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCROrderDetailsEnumurator(IEnumerable<OrderDetails> data)
        {
            _data = data;
        }
        private IEnumerable<OrderDetails> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("Order_Id", SqlDbType.Int),
         new SqlMetaData("Client_Order_ID", SqlDbType.Int),
         new SqlMetaData("Product_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Product_Qty", SqlDbType.Decimal,19,2),
         new SqlMetaData("Unit_Rate", SqlDbType.Decimal,19,2),
         new SqlMetaData("Amount", SqlDbType.Decimal,19,2),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.ID);
                record.SetValue(1, item.Order_Id);
                record.SetValue(2, item.Client_Order_Id);
                record.SetValue(3, item.Product_Code);
                record.SetValue(4, item.Product_Qty);
                record.SetValue(5, item.Unit_Rate);
                record.SetValue(6, item.Amount);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DoctorVisitAttachmentEnumurator : IEnumerable<SqlDataRecord>
    {

        public DoctorVisitAttachmentEnumurator(IEnumerable<DCRDoctorVisitAttachment> data)
        {
            _data = data;
        }
        private IEnumerable<DCRDoctorVisitAttachment> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Blob_Url", SqlDbType.VarChar, 500),
         new SqlMetaData("Filename", SqlDbType.VarChar,200),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Blob_Url);
                record.SetValue(1, item.Filename);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCRRCPADetailsEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRRCPADetailsEnumurator(IEnumerable<DCRRCPADetailsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRRCPADetailsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_RCPA_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Chemist_Visit_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("DCR_Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Competitor_Product_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Support_Qty", SqlDbType.Int),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Competitor_Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Mode_Of_Entry", SqlDbType.Char, 1),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_RCPA_Code);
                record.SetValue(1, item.Chemist_Visit_Code);
                record.SetValue(2, item.DCR_Product_Code);
                record.SetValue(3, item.Competitor_Product_Name);
                record.SetValue(4, Convert.ToInt32(item.Suuport_Qty));
                record.SetValue(5, item.Product_Code);
                record.SetValue(6, item.Competitor_Product_Code);
                record.SetValue(7, item.Mode_Of_Entry);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
  
}