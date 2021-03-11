using DataControl.EnumType;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Reflection;
using Dapper;
using MVCModels;
using MVCModels.HiDoctor_Master;
using Microsoft.SqlServer.Server;

namespace DataControl
{
    public class DAL_Customer : DapperRepository
    {

        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;
        private CurrentInfo _objCurInfo = new CurrentInfo();
        #region Constant Strings
        const string SP_HD_GETCUSTOMERENTITYFIELDS_PIVOT = "SP_hd_GetCustomerEntityFields_PIVOT";
        const string SP_HDINSERTCUSTOMERMASTERSTAGING = "SP_HdInsertCustomerMasterStaging";
        const string SP_HD_GETCUSTOMERMASTERCOLUMNS = "SP_hd_GetCustomerMasterColumns";
        const string SP_HDGETCUSTOMERMASTERLOOKUPVALUES = "Sp_hdGetCustomerMasterLookupValues";
        const string EXEC = "EXEC";
        const string SP_HDGETDOCTORCATEGORY = "SP_hdGetDoctorCategory";
        const string SP_hdGetStockiestWithRegion = "SP_hdGetStockiestWithRegion";
        const string tbl_SFA_Stockist_User_Share_Header = "tbl_SFA_Stockist_User_Share_Header";
        const string tbl_SFA_Stockist_User_Share_Details = "tbl_SFA_Stockist_User_Share_Details";
        const string SP_hdGetMaxIdOfStockistPoolAllocation = "SP_hdGetMaxIdOfStockistPoolAllocation";
        const string SP_hdGetStockistPoolAllocationDetails = "SP_hdGetStockistPoolAllocationDetails";
        const string SP_hdUpdateStockistPoolAllocation = "SP_hdUpdateStockistPoolAllocation";
        const string SP_HDGETDOCTORMASTER = "SP_hdGetDoctorMaster";
        const string SP_HDBULKUPDATECUSTOMERSTATUS = "SP_hdBulkUpdateCustomerStatus";
        const string USP_HD_INSERTDOCTORMASTERQUEUETRACKER = "usp_hd_InsertDoctorMasterQueueTracker";
        const string USP_HD_UPDATEDOCTORQUEUETRACKER = "usp_hd_UpdateDoctorQueueTracker";
        const string SP_HDMDLUNIQUECHECK = "SP_hdMDLUniqueCheck";
        const string SP_HDDELETECUSTOMERSFROMSTAGING = "SP_hdDeleteCustomersFromStaging";
        const string SP_HDGETCUSTOMERREGIONSBYSTATUS = "SP_hdGetCustomerRegionsByStatus";
        const string SP_HDGETCUSTOMER360DETAILS = "SP_hdGetCustomer360Details";
        const string SP_HDGETCUSTOMERREGIONS = "SP_hdGetCustomerRegions";
        const string SP_HDGETCHILDUSERBYDOCTOR = "SP_hdGetChildUserByDoctor";
        const string SP_hdGetDoctorsByUser = "SP_hdGetDoctorsByUser";

        const string SP_HDGETAPPROVEDDOCTORSBYREGION = "SP_hdGetApprovedDoctorsByRegion";
        const string SP_HDGETCUSTOMERSFORPRIMARYSALES = "SP_hdGetCustomersforPrimarySales";
        const string SP_HDGETCUSTOMERHISTORY = "SP_hdGetCustomerHistory";
        const string SP_HDGETAPPROVEDCUSTOMERSBYREGION = "SP_hdGetApprovedCustomersByRegion";
        const string SP_HDGETPRICEGROUPMAPPEDCUSTOMERS = "SP_hdGetPriceGroupMappedCustomers";

        const string SP_HD_GETDOCTORCATGORYBYSELECTEDREGION = "SP_HD_GetDoctorCatgorybySelectedRegion";

        //Doctor Quick View
        const string SP_HD_DOC_GETDOCTORDETAILSFORDOCTORQUICKVIEW = "SP_HD_DOC_GetDoctordetailsforDoctorquickView";
        const string SP_HD_DOC_GETDOCTORDETAILSBYDOCTORCODE = "SP_HD_DOC_GetDoctordetailsbyDoctorCode";
        const string SP_HD_DOC_GETDOCTORPRODUCTMAPPINGDETAILS = "SP_HD_DOC_GetDoctorproductMappingDetails";
        const string SP_HD_DOC_GETDOCTORVISITDETAILS = "SP_HD_DOC_GetDoctorVisitDetails";
        const string SP_HD_DOC_GETUSERTYPES = "SP_HD_DOC_GetUserTypes";
        const string SP_HD_DOC_GETSPECIALITY = "SP_HD_DOC_GetSpeciality";
        const string sp_GetEntityColumn = "sp_GetEntityColumn";

        const string SP_HDGETDOCTORMCANDCRMDETAILS = "SP_HDGetDoctorMCandCRMDetails";
        #endregion Constant Strings

        #region Public Methods
        public DataSet GetCustomerMasterEntityAsPivot(string company_Code, CUSTOMER_MASTER_ENTITY_TYPE entity_Type, string tablePrefix)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETCUSTOMERENTITYFIELDS_PIVOT);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Entity_Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, entity_Type);
                _objSPData.AddParamToSqlCommand(command, "@Table_Prefix", ParameterDirection.Input, SqlDbType.NVarChar, 2, tablePrefix);

                _objData.OpenConnection(company_Code);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertDoctorMultiRegions(string subDomain, string company_Code, Guid guid,
            DataTable dt, CUSTOMER_MASTER_ENTITY_TYPE entity_Type, string user_Code, string fileName, string bp_Type, string updatedBy)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string result = BatchProcessingBulkInsert(subDomain, company_Code, dt, guid, "tbl_SFA_Customer_Master_Batchprocessing_Staging");
                if (result.Length == 0)
                {
                    SqlCommand command = new SqlCommand(SP_HDINSERTCUSTOMERMASTERSTAGING);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                    _objSPData.AddParamToSqlCommand(command, "@BP_Id", ParameterDirection.Input, SqlDbType.UniqueIdentifier, -1, guid);
                    _objSPData.AddParamToSqlCommand(command, "@Entity_Type", ParameterDirection.Input, SqlDbType.VarChar, 30, entity_Type);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                    _objSPData.AddParamToSqlCommand(command, "@Upload_File_Name", ParameterDirection.Input, SqlDbType.VarChar, 500, fileName);
                    _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 500, updatedBy);
                    _objSPData.AddParamToSqlCommand(command, "@BP_Type", ParameterDirection.Input, SqlDbType.VarChar, 30, bp_Type);

                    _objData.OpenConnectionAsync(subDomain);
                    _objData.ExecuteNonQueryAsync(command);
                }
                else
                {
                    _objSPData.InsertBatchProcessingHeader(subDomain, company_Code, guid, fileName, bp_Type, user_Code, "FAILED", result);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet GetCustomerMasterColumns(string company_Code)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETCUSTOMERMASTERCOLUMNS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);

                _objData.OpenConnection(company_Code);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetCustomerMasterLookupValues(string company_Code, CUSTOMER_MASTER_ENTITY_TYPE entity_Type)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCUSTOMERMASTERLOOKUPVALUES);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Entity_Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, entity_Type);

                _objData.OpenConnection(company_Code);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetCustomerEntityColumns(string company_Code, string entity_Type, string tablePrefix)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETCUSTOMERENTITYFIELDS_PIVOT);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Entity_Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, entity_Type);
                _objSPData.AddParamToSqlCommand(command, "@Table_Prefix", ParameterDirection.Input, SqlDbType.NVarChar, 2, tablePrefix);

                _objData.OpenConnection(company_Code);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        private List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);

            var cols = dr.GetSchemaTable().Rows.Cast<DataRow>().Select(row => row["ColumnName"] as string).ToList();
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (cols.Contains(prop.Name))
                    {
                        if (!object.Equals(dr[prop.Name], DBNull.Value))
                        {
                            prop.SetValue(obj, dr[prop.Name], null);
                        }
                    }
                }
                list.Add(obj);
            }
            return list;
        }
        public List<MVCModels.HiDoctor_Master.CustomerModel> GetAllCustomers(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCustomer = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            SqlDataReader sqldataReader;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader("SP_hdGetAll" + " '" + companyCode + "'"))
                {
                    lstCustomer = DataReaderMapToList<MVCModels.HiDoctor_Master.CustomerModel>(reader);
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
            return lstCustomer;
        }

        // get All stockist in the region and its child region
        public List<MVCModels.HiDoctor_Master.CustomerModel> GetStockistWithRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstStockist = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            try
            {
                _objData = new Data();

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_hdGetStockiestWithRegion
                                                                                     + " '" + companyCode + "','" + regionCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.CustomerModel objweek = new MVCModels.HiDoctor_Master.CustomerModel();
                            objweek.Customer_Name = sqldataReader["Customer_Name"].ToString();
                            objweek.Customer_Code = sqldataReader["Customer_Code"].ToString();
                            objweek.Region_Code = sqldataReader["Region_Code"].ToString();
                            objweek.Region_Name = sqldataReader["Region_Name"].ToString();
                            lstStockist.Add(objweek);
                        }
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
            return lstStockist;
        }

        // get max if of stockist pool allocation
        public int GetMaxIdOfStockiatPoolAllocation(string companyCode)
        {
            int maxId = 0;

            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetMaxIdOfStockistPoolAllocation);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);

                _objData.OpenConnection(companyCode);
                maxId = Convert.ToInt32(_objData.ExecuteScalar(command));

            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return maxId;
        }


        // INSERT STOCKIST POOL ALLOCATION HEADER
        public string InsertStockistPoolAllocationHeader(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Stockist_Share_Code", "Stockist_Share_Code");
                        copy.ColumnMappings.Add("Stockist_Code", "Stockist_Code");
                        copy.ColumnMappings.Add("Stockist_Region_Code", "Stockist_Region_Code");
                        copy.ColumnMappings.Add("Product_Code", "Product_Code");
                        copy.ColumnMappings.Add("Effective_From", "Effective_From");
                        copy.ColumnMappings.Add("Effective_To", "Effective_To");
                        copy.ColumnMappings.Add("Record_Status", "Record_Status");
                        copy.ColumnMappings.Add("Base_Region", "Base_Region");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("Created_Date", "Created_Date");
                        copy.DestinationTableName = tbl_SFA_Stockist_User_Share_Header;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        // INSERT STOCKIST POOL ALLOCATION DETAIL       
        public string InsertStockistPoolAllocationDetail(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Stockist_Share_Code", "Stockist_Share_Code");
                        copy.ColumnMappings.Add("Stockist_Share_Detail_Code", "Stockist_Share_Detail_Code");
                        copy.ColumnMappings.Add("Region_Code", "Region_Code");
                        copy.ColumnMappings.Add("Share_Percentage", "Share_Percentage");
                        copy.ColumnMappings.Add("Division_Code", "Division_Code");

                        copy.DestinationTableName = tbl_SFA_Stockist_User_Share_Details;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        // DFELETE STOCKIST POOL ALLOCATION
        public string DeleteStockistPoolAllocation(string companyCode, int stockID)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_hdUpdateStockistPoolAllocation);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@StockistShareCode", ParameterDirection.Input, SqlDbType.Int, 30, stockID);


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.NVarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetStockistPoolAllocationDetails(string companyCode, string regionCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetStockistPoolAllocationDetails);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public List<MVCModels.HiDoctor_Reports.Customer360Model> GetCustomer360Details(string companyCode, string userCode, string doctorCode, string mode, string regionCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<MVCModels.HiDoctor_Reports.Customer360Model> lstCustomer360Model = new List<MVCModels.HiDoctor_Reports.Customer360Model>();
            try
            {
                MVCModels.HiDoctor_Reports.Customer360Model objCustomer360 = new MVCModels.HiDoctor_Reports.Customer360Model();

                _objData.OpenConnection(companyCode);
                using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETCUSTOMER360DETAILS + " '" + companyCode + "','"
                                                         + doctorCode + "','" + userCode + "','" + regionCode + "','" + mode + "'"))
                {
                    while (sqldataReader.Read())
                    {
                        objCustomer360.Customer_Name = sqldataReader["Customer_Name"].ToString();
                        objCustomer360.Category_Name = sqldataReader["Category_Name"].ToString();
                        objCustomer360.Speciality_Name = sqldataReader["Speciality_Name"].ToString();
                        objCustomer360.MDL_Number = sqldataReader["MDL_Number"].ToString();
                        objCustomer360.DOB = sqldataReader["DOB"].ToString();
                        objCustomer360.Local_Area = sqldataReader["Local_Area"].ToString();
                        objCustomer360.Sur_Name = sqldataReader["Sur_Name"].ToString();
                    }
                    //Campaign Names
                    List<MVCModels.HiDoctor_Reports.Customer360CampaignModel> lstCampaign = new List<MVCModels.HiDoctor_Reports.Customer360CampaignModel>();
                    if (sqldataReader.NextResult())
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360CampaignModel objCampaign = new MVCModels.HiDoctor_Reports.Customer360CampaignModel();
                            objCampaign.Campaing_Name = sqldataReader["Campaign_Name"].ToString();
                            lstCampaign.Add(objCampaign);
                        }
                        objCustomer360.lstCampaignModel = lstCampaign;
                    }
                    //Last Three Vist Details
                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360LastVisitsModel> lstLastVisitDates = new List<MVCModels.HiDoctor_Reports.Customer360LastVisitsModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360LastVisitsModel objLastVisit = new MVCModels.HiDoctor_Reports.Customer360LastVisitsModel();
                            objLastVisit.DCR_Actual_Date = sqldataReader["DCR_Actual_Date"].ToString();
                            if (mode != "SINGLE")
                            {
                                objLastVisit.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstLastVisitDates.Add(objLastVisit);
                        }
                        objCustomer360.lstLastVisit = lstLastVisitDates;
                    }
                    //Product samples & Details
                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360SamplesAndDetailsModel> lstSamples = new List<MVCModels.HiDoctor_Reports.Customer360SamplesAndDetailsModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360SamplesAndDetailsModel objSamples = new MVCModels.HiDoctor_Reports.Customer360SamplesAndDetailsModel();
                            objSamples.Product_Name = sqldataReader["Product_Name"].ToString();
                            objSamples.Quantity_Provided = sqldataReader["Quantity_Provided"].ToString();
                            objSamples.DCR_Date = sqldataReader["DCR_Date"].ToString();
                            if (mode != "SINGLE")
                            {
                                objSamples.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstSamples.Add(objSamples);
                        }
                        objCustomer360.lstSamples = lstSamples;
                    }
                    //Non Samples
                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360NonSamplesAndDetailsModel> lstNonSamples = new List<MVCModels.HiDoctor_Reports.Customer360NonSamplesAndDetailsModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360NonSamplesAndDetailsModel objNonSamples = new MVCModels.HiDoctor_Reports.Customer360NonSamplesAndDetailsModel();
                            objNonSamples.Product_Name = sqldataReader["Product_Name"].ToString();
                            objNonSamples.Quantity_Provided = sqldataReader["Quantity_Provided"].ToString();
                            objNonSamples.DCR_Date = sqldataReader["DCR_Date"].ToString();
                            if (mode != "SINGLE")
                            {
                                objNonSamples.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstNonSamples.Add(objNonSamples);
                        }
                        objCustomer360.lstNonSamples = lstNonSamples;
                    }
                    //Chemist Visited
                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360ChemistVisitModel> lstChemist = new List<MVCModels.HiDoctor_Reports.Customer360ChemistVisitModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360ChemistVisitModel objChemist = new MVCModels.HiDoctor_Reports.Customer360ChemistVisitModel();
                            objChemist.Customer_Name = sqldataReader["Chemists_Name"].ToString();
                            objChemist.DCR_Date = sqldataReader["DCR_Date"].ToString();
                            objChemist.PO_Amount = sqldataReader["PO_Amount"].ToString();
                            if (mode != "SINGLE")
                            {
                                objChemist.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstChemist.Add(objChemist);
                        }
                        objCustomer360.lstChemist = lstChemist;
                    }
                    //Yield and Potential

                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstRCPA = new List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel objRCPA = new MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel();
                            objRCPA.Product_Name = sqldataReader["Product_Name"].ToString();
                            objRCPA.Support_Qty = sqldataReader["MyQty"].ToString();
                            objRCPA.Competitor_Product_Name = sqldataReader["Competitor_Product_Name"].ToString();
                            objRCPA.Comp_Qty = sqldataReader["Comp_Qty"].ToString();
                            if (mode != "SINGLE")
                            {
                                objRCPA.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstRCPA.Add(objRCPA);
                        }
                        objCustomer360.lstRCPA = lstRCPA;
                    }
                    //Product Mapping Details
                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360ProductMappingModel> lstDocProd = new List<MVCModels.HiDoctor_Reports.Customer360ProductMappingModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360ProductMappingModel objDocPro = new MVCModels.HiDoctor_Reports.Customer360ProductMappingModel();
                            objDocPro.Product_Name = sqldataReader["Product_Name"].ToString();
                            objDocPro.Support_Quantity = sqldataReader["Support_Quantity"].ToString();
                            objDocPro.Potential_Quantity = sqldataReader["Potential_Quantity"].ToString();
                            objDocPro.Date = sqldataReader["Date"].ToString();
                            //  objRCPA.Created_Date = sqldataReader["Date"].ToString();
                            lstDocProd.Add(objDocPro);
                        }
                        objCustomer360.lstProductMapping = lstDocProd;
                    }
                    //Remarks

                    if (sqldataReader.NextResult())
                    {
                        List<MVCModels.HiDoctor_Reports.Customer360RemarksModel> lstRemarks = new List<MVCModels.HiDoctor_Reports.Customer360RemarksModel>();
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Reports.Customer360RemarksModel objRemarks = new MVCModels.HiDoctor_Reports.Customer360RemarksModel();
                            objRemarks.Remarks = sqldataReader["Remarks_By_User"].ToString();
                            objRemarks.DCR_Actual_Date = sqldataReader["Date"].ToString();
                            if (mode != "SINGLE")
                            {
                                objRemarks.User_Code = sqldataReader["User_Code"].ToString();
                            }
                            lstRemarks.Add(objRemarks);
                        }
                        objCustomer360.lstRemarks = lstRemarks;
                    }
                    if (mode != "SINGLE")
                    {
                        if (sqldataReader.NextResult())
                        {
                            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                            while (sqldataReader.Read())
                            {
                                MVCModels.HiDoctor_Master.UserModel objUser = new MVCModels.HiDoctor_Master.UserModel();
                                objUser.User_Name = sqldataReader["User_Name"].ToString();
                                objUser.User_Code = sqldataReader["User_Code"].ToString();
                                objUser.Region_Name = sqldataReader["Region_Name"].ToString();
                                objUser.User_Type_Name = sqldataReader["User_Type_Name"].ToString();
                                objUser.Reporting_Manager_Name = sqldataReader["Reporting_Manager_Name"].ToString();
                                objUser.Reporting_Manager_Region_Name = sqldataReader["Reporting_Manager_Region_Name"].ToString();
                                objUser.Reporting_Manager_Type_Name = sqldataReader["Reporting_Manager_Type_Name"].ToString();
                                lstUser.Add(objUser);
                            }
                            objCustomer360.lstUsers = lstUser;
                        }
                    }
                    lstCustomer360Model.Add(objCustomer360);
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
            return lstCustomer360Model;
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetCustomerRegions(string companyCode, string customerCode)
        {
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            try
            {
                _objData = new Data();
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETCUSTOMERREGIONS + " '" + companyCode + "','" + customerCode + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegion = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegion.Region_Name = sqldataReader["Region_Name"].ToString();
                            objRegion.Region_Code = sqldataReader["Region_Code"].ToString();
                            objRegion.Region_Type_Name = sqldataReader["Region_Type_Name"].ToString();
                            objRegion.Region_Type_Code = sqldataReader["Region_Type_Code"].ToString();
                            lstRegion.Add(objRegion);
                        }
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
            return lstRegion;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersForDoctor360(string companyCode, string userCode, string doctorCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData = new Data();
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETCHILDUSERBYDOCTOR + " '" + companyCode + "','" + userCode + "','" + doctorCode + "'"))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqldataReader["User_Code"].ToString();
                        _objUser.User_Name = sqldataReader["User_Name"].ToString();
                        _objUser.Under_User_Id = sqldataReader["Under_User_Id"].ToString();
                        _objUser.User_Id = sqldataReader["User_Id"].ToString();
                        _objUser.Full_Index = sqldataReader["Full_Index"].ToString();
                        _objUser.Reporting_Manager_Code = sqldataReader["Under_User_Code"].ToString();
                        _objUser.Region_Name = sqldataReader["Region_Name"].ToString();
                        _objUser.User_Type_Name = sqldataReader["User_Type_Name"].ToString();
                        lstUser.Add(_objUser);
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
            return lstUser;
        }
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetApprovedDoctorsByRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            try
            {
                _objData = new Data();
                _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETAPPROVEDDOCTORSBYREGION);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.DoctorModel _objDoctor = new MVCModels.HiDoctor_Master.DoctorModel();
                        _objDoctor.Customer_Name = Convert.ToString(sqldataReader["Customer_Name"]);
                        _objDoctor.Region_Name = Convert.ToString(sqldataReader["Region_Name"]);
                        _objDoctor.Speciality_Name = Convert.ToString(sqldataReader["Speciality_Name"]);
                        _objDoctor.MDL_Number = Convert.ToString(sqldataReader["MDL_Number"]);
                        _objDoctor.Qualification = Convert.ToString(sqldataReader["Qualification"]);
                        _objDoctor.Customer_Code = Convert.ToString(sqldataReader["Customer_Code"]);
                        _objDoctor.Category_Name = Convert.ToString(sqldataReader["Category_Name"]);
                        lstDoctor.Add(_objDoctor);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstDoctor;
        }

        public List<MVCModels.HiDoctor_Master.DoctorCategoryModel> GetDoctorCategory(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstCategory = new List<MVCModels.HiDoctor_Master.DoctorCategoryModel>();
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                SqlCommand command = new SqlCommand(SP_HDGETDOCTORCATEGORY);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                _objData.OpenConnection();
                using (sqldataReader = _objData.ExecuteReader(command))
                {
                    while (sqldataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.DoctorCategoryModel _objCategory = new MVCModels.HiDoctor_Master.DoctorCategoryModel();
                        _objCategory.Category_Code = sqldataReader["Category_Code"].ToString();
                        _objCategory.Category_Name = sqldataReader["Category_Name"].ToString();
                        lstCategory.Add(_objCategory);
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
            return lstCategory;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DoctorAutoFillModel> GetDoctorByUser(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorAutoFillModel> lstCust;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.HiDoctor_Master.DoctorAutoFillModel>(SP_hdGetDoctorsByUser,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCust;
        }
        /// <summary>
        /// Get Doctor Category list by selected Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorCategoryModel> GetDoctorCategorybySelectedRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstDoctorcategories = new List<MVCModels.HiDoctor_Master.DoctorCategoryModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Region_Code", regionCode);
                    lstDoctorcategories = connection.Query<MVCModels.HiDoctor_Master.DoctorCategoryModel>(SP_HD_GETDOCTORCATGORYBYSELECTEDREGION, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstDoctorcategories;
        }

        #region - Doctor Quick View
        /// <summary>
        /// Get Doctor Details based on doctorname,region,specilaity and mdl no search
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="specialityName"></param>
        /// <param name="doctorName"></param>
        /// <param name="mdlNo1"></param>
        /// <param name="mdlNo2"></param>
        /// <param name="mdlCheck"></param>
        /// <param name="pageNo"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorQuickViewModel> GetDoctorQucikViewDetails(string companyCode, string regionCode, string specialityName, string doctorName, string mdlNo1, string mdlNo2, string mdlCheck, int pageNo, int pageSize, ref int totalPageCount, string searchName, string sessionRegionCode)
        {



            IEnumerable<MVCModels.HiDoctor_Master.DoctorQuickViewModel> lstDoctorDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Session_Region_Code", sessionRegionCode);
                    parameter.Add("@Region_Code", regionCode);
                    parameter.Add("@Speciality_Name", specialityName);
                    parameter.Add("@Doctor_Name", doctorName);
                    parameter.Add("@MDL_No1", mdlNo1);
                    parameter.Add("@MDL_No2", mdlNo2);
                    parameter.Add("@MDL_Check", mdlCheck);
                    parameter.Add("@PageNumber", pageNo);
                    parameter.Add("@PageSize", pageSize);
                    parameter.Add("@SearchName", searchName);
                    parameter.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstDoctorDetails = connection.Query<MVCModels.HiDoctor_Master.DoctorQuickViewModel>(SP_HD_DOC_GETDOCTORDETAILSFORDOCTORQUICKVIEW, parameter, commandType: CommandType.StoredProcedure);
                    totalPageCount = parameter.Get<int>("@TotalPageNo");
                }
            }
            catch
            {
                throw;
            }
            return lstDoctorDetails;
        }
        /// <summary>
        /// Get doctor details by doctor code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="doctorCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQuickViewModel> GetDoctorDetailsbyDoctorCode(string companyCode, string regionCode, string doctorCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorQuickViewModel> lstDoctorDetails = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@DoctorCode", doctorCode);
                    parameter.Add("@RegionCode", regionCode);
                    lstDoctorDetails = connection.Query<MVCModels.HiDoctor_Master.DoctorQuickViewModel>(SP_HD_DOC_GETDOCTORDETAILSBYDOCTORCODE, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDoctorDetails;
        }
        /// <summary>
        /// Get Doctor product mapping details by doctorcode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="doctorCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQuickViewProductModel> GetDoctorProductMappingDetails(string companyCode, string regionCode, string doctorCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorQuickViewProductModel> lstDoctorproductmappingdetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@DoctorCode", doctorCode);
                    lstDoctorproductmappingdetails = connection.Query<MVCModels.HiDoctor_Master.DoctorQuickViewProductModel>(SP_HD_DOC_GETDOCTORPRODUCTMAPPINGDETAILS, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDoctorproductmappingdetails;
        }
        /// <summary>
        /// Get User Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> GetUserTypes(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> lstUserTYpe = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    lstUserTYpe = connection.Query<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel>(SP_HD_DOC_GETUSERTYPES, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstUserTYpe;
        }
        /// <summary>
        /// Get Doctor visit details by regioncode and doctorcode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="doctorCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel> GetDoctorVisitDeatils(string companyCode, string regionCode, string doctorCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel> lstDoctorvisitdetails = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@DoctorCode", doctorCode);
                    lstDoctorvisitdetails = connection.Query<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel>(SP_HD_DOC_GETDOCTORVISITDETAILS, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDoctorvisitdetails;
        }
        public List<DoctorVisitRegionTypeModel> GetDoctorVisitDetailsRegionTypeWise(string Doctor_Code)
        {
            List<DoctorVisitRegionTypeModel> lst= new List<DoctorVisitRegionTypeModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();                   
                    parameter.Add("@DoctorCode", Doctor_Code);
                    lst = connection.Query<DoctorVisitRegionTypeModel>("Sp_HD_DoctorVisistDetails", parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        /// <summary>
        /// Get speciality
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQucikViewSpecialityModel> Getspeciality(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorQucikViewSpecialityModel> lstSpecialities = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    lstSpecialities = connection.Query<MVCModels.HiDoctor_Master.DoctorQucikViewSpecialityModel>(SP_HD_DOC_GETSPECIALITY, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstSpecialities;
        }
        #endregion - Doctor Quick View

        #endregion Public Methods
        #region Private Methods
        private string BatchProcessingBulkInsert(string subDomain, string company_Code, DataTable dt, Guid batchProcessingID, string stagingTableName)
        {
            try
            {
                _objData = new Data();
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        foreach (DataColumn col in dt.Columns)
                        {
                            copy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
                        }
                        copy.BulkCopyTimeout = 300;
                        copy.DestinationTableName = stagingTableName;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public List<MVCModels.HiDoctor_Master.DoctorModel> GetDoctorsByRegionAndMode(string companyCode, string regionCode, string mode, string entity)
        {

            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            try
            {
                _objData = new Data();
                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETDOCTORMASTER + " '" + companyCode
                        + "','" + mode + "','" + regionCode + "','" + entity + "'"))
                    {
                        while (sqldataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.DoctorModel _objDoctor = new MVCModels.HiDoctor_Master.DoctorModel();
                            _objDoctor.Customer_Name = sqldataReader["Customer_Name"].ToString();
                            _objDoctor.Customer_Code = sqldataReader["Customer_Code"].ToString();
                            // _objDoctor.Region_Code = sqldataReader["Region_Code"].ToString();
                            _objDoctor.Region_Name = sqldataReader["Region_Name"].ToString();
                            // _objDoctor.Region_Type_Code = sqldataReader["Region_Type_Code"].ToString();
                            // _objDoctor.Region_Type_Name = sqldataReader["Region_Type_Name"].ToString();
                            _objDoctor.Speciality_Code = sqldataReader["Speciality_Code"].ToString();
                            _objDoctor.Speciality_Name = sqldataReader["Speciality_Name"].ToString();
                            _objDoctor.Category = sqldataReader["Category"].ToString();
                            _objDoctor.Category_Name = sqldataReader["Category_Name"].ToString();
                            _objDoctor.MDL_Number = sqldataReader["MDL_Number"].ToString();
                            _objDoctor.Qualification = sqldataReader["Qualification"].ToString();
                            _objDoctor.Address1 = sqldataReader["Address1"].ToString();
                            _objDoctor.Address2 = sqldataReader["Address2"].ToString();
                            _objDoctor.Local_Area = sqldataReader["Local_Area"].ToString();
                            _objDoctor.Mobile = sqldataReader["Mobile"].ToString();
                            _objDoctor.Phone = sqldataReader["Phone"].ToString();
                            _objDoctor.Email = sqldataReader["Email"].ToString();
                            _objDoctor.Effective_From = sqldataReader["Effective_From"].ToString();
                            _objDoctor.Effective_To = sqldataReader["Effective_To"].ToString();
                            _objDoctor.Customer_Status = sqldataReader["Customer_Status"].ToString();
                            lstDoctor.Add(_objDoctor);
                        }
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
            return lstDoctor;
        }

        public string GetEntityColumn(string companyCode, string entity)
        {
            string DisplayOption = "";
            try
            {
                _objData = new Data();
                _objSPData = new SPData();
                //using (IDbConnection connection = IDbOpenConnection())
                //{
                //    var p = new DynamicParameters();
                //    p.Add("@CompanyCode", companyCode);
                //    p.Add("@Entity", entity);
                //    DisplayOption = connection.ex
                //}
                SqlCommand command = new SqlCommand(sp_GetEntityColumn);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 10, entity);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.Char);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 3;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                DisplayOption = returnValue.Value.ToString();

            }
            catch
            {
                throw;
            }

            return DisplayOption;
        }

        public string BulkCustomerApproval(string companyCode, DataTable dt)
        {
            _objData = new Data();
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Customer_Code", "Customer_Code");
                        copy.ColumnMappings.Add("Region_Code", "Region_Code");
                        copy.ColumnMappings.Add("Customer_Entity_Type", "Customer_Entity_Type");
                        copy.ColumnMappings.Add("Customer_Status", "Customer_Status");
                        copy.ColumnMappings.Add("MDL_Number", "MDL_Number");
                        copy.ColumnMappings.Add("BP_ID", "BP_ID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Category", "Category");
                        copy.DestinationTableName = "tbl_SFA_Customer_Master_Batchprocessing_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }




        public string UpdateCustomerStatus(string companyCode, string guid, string updatedBy)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDBULKUPDATECUSTOMERSTATUS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.VarChar, 500, guid);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.NVarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet MDLNumberUniqueCheck(string companyCode, string guid, string entity)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDMDLUNIQUECHECK);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.VarChar, 300, guid);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, entity);



                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteCustomersfromStaging(string companyCode, string guid)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETECUSTOMERSFROMSTAGING);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.VarChar, 500, guid);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.NVarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetCustomerRegions(string companyCode, string customerStatus, string entity)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCUSTOMERREGIONSBYSTATUS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CustomerStatus", ParameterDirection.Input, SqlDbType.VarChar, 1, customerStatus);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, entity);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetCustomersforPrimarySales(string company_Code)
        {
            DataSet ds = null;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                _objData.OpenConnection(company_Code);
                {
                    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETCUSTOMERSFORPRIMARYSALES + " '" + company_Code + "'");
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
            return ds;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomersByRegionAndEntity(string companyCode, string regionCode, string entity)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstCust;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETAPPROVEDCUSTOMERSBYREGION,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, Entity = entity },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCust;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomersByPriceGroupCode(string companyCode, string regionCode,
            string priceGroupCode, string entity)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstCust;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETPRICEGROUPMAPPEDCUSTOMERS,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, PriceGroupCode = priceGroupCode, Entity = entity },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCust;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomerHistory(string companyCode, string customerCode, string regionCode, string entity)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Customer_Code", customerCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Entity", entity);
                    lstCustomer = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETCUSTOMERHISTORY, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstCustomer;
        }
        #endregion Public Methods

        public DataSet GetDoctorUnapproveStatus(string customerCode, string regionCode)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            string companyCode = _objCurInfo.GetCompanyCode();

            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDOCTORMCANDCRMDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Customer_Code", ParameterDirection.Input, SqlDbType.NVarChar, 1000, customerCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);


                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public List<UserModel> EmployeeDetails(string companycode, string user_Code)
        {


            List<UserModel> lstemployee;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", user_Code);

                    lstemployee = connection.Query<UserModel>("SP_Hd_Get_User_Header_Detail", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstemployee;
        }
        public IEnumerable<ApprovedFailedDoctors> GetApprovedFailedDoctors(string guid)
        {


            IEnumerable<MVCModels.ApprovedFailedDoctors> lstCustomer;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@guid", guid);

                    lstCustomer = connection.Query<MVCModels.ApprovedFailedDoctors>("usp_GetApprovedFailedDoctors", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }


            return lstCustomer;



        }

        #region Queue Tracker
        public int InsertDoctorMasterQueueTracker(string companyCode, CustomerApprovalQueueTracker customerApprovalQueue)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", customerApprovalQueue.UserCode);
                    parameter.Add("@DoctorCode", customerApprovalQueue.DoctorCode);
                    parameter.Add("@RegionCode", customerApprovalQueue.RegionCode);
                    parameter.Add("@EventName", customerApprovalQueue.EventName);
                    parameter.Add("@ProcessStatus", customerApprovalQueue.ProcessStatus);
                    parameter.Add("@JSONObject", customerApprovalQueue.JSONObject);
                    parameter.Add("@TopicName", customerApprovalQueue.TopicName);
                    parameter.Add("@SubscriptionName", customerApprovalQueue.SubscriptionName);
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);

                    connection.Query<string>("usp_hd_InsertDoctorMasterQueueTracker", parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    int Id = -1;
                    if (!Int32.TryParse(result, out Id))
                    {
                        return -1;
                    }
                    connection.Close();
                }
            }
            catch
            {
                return -1;
            }
            return Convert.ToInt32(result);
        }


        public System.Int32 UpdateDoctorMasterQuqueTracker(string companyCode, CustomerApprovalQueueTracker custApprovalQueue)
        {
            int result = -1;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@Id", custApprovalQueue.Id);
                    parameter.Add("@ProcessStatus", custApprovalQueue.ProcessStatus);
                    parameter.Add("@ExceMsg", value: custApprovalQueue.Mesg, size: 500);
                    parameter.Add("@StackTrace", value: custApprovalQueue.StackTrace, size: 2000);

                    result = connection.Execute("usp_hd_UpdateDoctorQueueTracker", parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                return -1;
            }
            return Convert.ToInt32(result);
        }
        #endregion Queue Tracker
        #region DoctorWorkArea
        public DoctorWorkAreaDetails GetDoctorWorkAreaDetails(string companyCode, string regionCode)
        {
            DoctorWorkAreaDetails lsDocDetails = new DoctorWorkAreaDetails();

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@regionCode", regionCode);
                    var ls_Doc_Details = connection.QueryMultiple("HD_SP_BindDoctorWorkAreaDetails", parameter, commandType: CommandType.StoredProcedure);
                    lsDocDetails.lsDoctorDetails = ls_Doc_Details.Read<DoctorModel>().ToList();
                    lsDocDetails.lsDoctorWorkArea = ls_Doc_Details.Read<DoctorWorkArea>().ToList();
                }
            }
            catch
            {
                throw;
            }
            return lsDocDetails;
        }
        public string SaveDoctorPlaceDetails(List<DoctorModel> lsDoctorPlace, string companyCode, int compnay_Id, string current_UserCode, int action)
        {
            string rValue = "error";
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "HD_SP_Insert_Doctor_Place_Workcategory";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Doctor_Place_Map", ParameterDirection.Input, SqlDbType.Structured, new DoctorPlaceMapEnumurator(lsDoctorPlace, current_UserCode, companyCode, compnay_Id), "TVP_Doctor_Place_Map");
                _objSPData.AddParamToSqlCommand(command, "@action", ParameterDirection.Input, SqlDbType.Int, 30, action);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                rValue = "success";

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rValue;
        }
        #endregion
    }
    public class DoctorPlaceMapEnumurator : IEnumerable<SqlDataRecord>
    {
        private IEnumerable<DoctorModel> _data;
        private string _current_User_Code, _company_Code;
        private int _company_Id;
        public DoctorPlaceMapEnumurator(IEnumerable<DoctorModel> data, string current_User_Code, string company_code, int company_id)
        {
            _data = data;
            _current_User_Code = current_User_Code;
            _company_Code = company_code;
            _company_Id = company_id;
        }
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Mapping_ID", SqlDbType.Int),
         new SqlMetaData("Region_code", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Place", SqlDbType.VarChar, 100),
         new SqlMetaData("Doctor_workcategory", SqlDbType.VarChar, 50),
         new SqlMetaData("Created_By", SqlDbType.VarChar, 30),
         new SqlMetaData("Created_Date", SqlDbType.DateTime),
         new SqlMetaData("Updated_By", SqlDbType.VarChar, 30),
         new SqlMetaData("Updated_DateTime", SqlDbType.VarChar,30),
         new SqlMetaData("Company_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Company_Id", SqlDbType.Int),
         };
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Mapping_ID);
                record.SetValue(1, item.Region_Code);
                record.SetValue(2, item.Customer_Code);
                record.SetValue(3, item.Local_Area);
                record.SetValue(4, item.Workcategory);
                record.SetValue(5, _current_User_Code);
                record.SetValue(6, DateTime.Now);
                record.SetValue(7, "");
                record.SetValue(8, "");
                record.SetValue(9, _company_Code);
                record.SetValue(10, _company_Id);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

    }
   
}
