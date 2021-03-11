using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace DataControl
{
    public class DAL_CCM : DapperRepository
    {
        #region Constant Strings
        const string SP_HDGETDOCTORCATEGORY = "SP_hdGetDoctorCategory";
        const string SP_HDGETSPECIALITY = "SP_hdGetSpeciality";
        const string SP_HD_CCM_GETCCMDETAILS = "SP_hd_CCM_GetCCMDetails";
        const string SP_HD_CCM_GETCCMCOUNTRIES = "SP_hd_CCM_GetCCMCountries";
        const string SP_HD_CCM_GETCCMSTATES = "SP_hd_CCM_GetCCMStates";
        const string SP_hd_CCM_GetCCMCity = "SP_hd_CCM_GetCCMCity";
        const string SP_HD_CCM_GETCCMDOCTORSBYADDRESS = "SP_hd_CCM_GetCCMDoctorsByAddress";
        const string SP_HD_CCM_GETCCMDOCTORSBYLATLONG = "SP_hd_CCM_GetCCMDoctorsByLatLong";
        const string SP_HD_CCM_GETCCMDOCTORSBYADDRESSANDSPECIALITY = "SP_hd_CCM_GetCCMDoctorsByAddressandSpeciality";
        const string SP_HD_CCM_GETCCMDOCTORSBYFILTERS = "SP_hd_CCM_GetCCMDoctorsByFilters";
        const string SP_HD_CCM_GETDIVISIONS = "SP_hd_CCM_GetDivisions";
        const string SP_HD_CCM_GETCHILDREGIONS = "SP_hd_CCM_GetChildRegions";
        const string SP_HD_CCM_GETMAPPEDDOCTORS = "SP_hd_CCM_GetMappedDoctors";
        const string SP_HD_CCM_GETCATEGORYBYDIVISION = "SP_hd_CCM_GetCategoryByDivision";
        const string SP_HD_CCM_GETCHILDREGIONSBYDIVISION = "SP_hd_CCM_GetChildRegionsByDivision";
        const string SP_HD_CCM_INSERTCCMTOCM = "SP_hd_CCM_InsertCCMToCM";
        const string SP_HD_CCM_GETCCMSIMILLARRECORDS = "SP_hd_CCM_GetCCMSimillarRecords";
        const string SP_HD_CCM_BULKCCMINSERT = "SP_hd_CCM_BulkCCMInsert";
        const string USP_HD_CCM_GETREGIONMAXDOCTORCOUNT = "usp_hd_CCM_GetRegionMaxDoctorCount";
        const string SP_HD_CCM_GET_LOCALAREA = "SP_hd_CCM_GetCCM_LocalArea";
        const string SP_HD_CCM_PROCESS_SOUNDEX = "SP_hd_CCM_ChangeDoctorSimilarStatus";
        const string USP_HD_CCM_GETCCMDOCDETAILSFORVALIDATION = "usp_hd_CCM_GetCCMDocDetailsForValidation";
        const string SP_HD_CCM_GETCCMSIMILARRECORDS_BYLOCALAREA = "SP_hd_CCM_GetCCMSimilarDoctor_ByLocalArea";
        const string SP_HD_CCM_ISMOBILENUMBEREXISTS = "SP_HD_CCM_IsMobileNumberExists";
        const string SP_HD_CCM_ISREGISTRATIONNUMBEREXISTS = "SP_HD_CCM_IsRegistrationNumberExists";
        const string USP_HD_CCM_GETSOUNDEXPROCESSHISTORY = "usp_hd_CCM_GetSoundexProcessHistory";


        #endregion Constant Strings
        /// <summary>
        /// Get doctor category
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of category</returns>
        public IEnumerable<MVCModels.DoctorCategoryModel> GetDoctorCategory(string companyCode)
        {
            IEnumerable<MVCModels.DoctorCategoryModel> lstCategory;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstCategory = connection.Query<MVCModels.DoctorCategoryModel>(SP_HDGETDOCTORCATEGORY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstCategory;
        }
        /// <summary>
        /// Get speciality
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of speciality</returns>
        public IEnumerable<MVCModels.SpecialityModel> GetSpeciality(string companyCode)
        {
            IEnumerable<MVCModels.SpecialityModel> lstSpeciality;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Result", companyCode, null, ParameterDirection.Output);
                    lstSpeciality = connection.Query<MVCModels.SpecialityModel>(SP_HDGETSPECIALITY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstSpeciality;
        }

        public long GetSeqNumber(string objName)
        {
            long value = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT NEXT VALUE FOR " + objName + "";
                    value = connection.Query<Int64>(query).Single();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return value;
        }

        /// <summary>
        /// insert or update the ccm details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="lstCCM"></param>
        /// <param name="mode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertCCM(string companyCode, List<MVCModels.CCMModel> lstCCM, string mode)
        {
            int rowsAffected = 0;
            string ccmSeq;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    //ccmSeq = GetSeqNumber("SEQ_tbl_SFA_CCM").ToString();
                    if ("INSERT" == mode.ToUpper())
                    {
                        string historyQuery = "INSERT INTO tbl_SFA_CCM_History(Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                          "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                          "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                          "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                          "Updated_Date,Remarks,Sur_Name,Gender)" +
                                          "values(@Customer_ID,@Customer_Name,@Speciality_Code,@Qualification,@Address1,@Address2, " +
                                          "@Local_Area,@Pin_Code,@City,@State,@Country,@Phone,@Mobile,@Fax, " +
                                          "@Email,@Hospital_Name,@Hospital_Classification,@DOB,@Anniversary_Date, " +
                                          "@Registration_No,@Latitude,@Longitude,@Active_Status,@Created_By,@Created_Date,@Updated_By, " +
                                          "@Updated_Date,@Remarks,@Sur_Name,@Gender)";
                        rowsAffected = connection.Execute(historyQuery, lstCCM, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            string query = "INSERT INTO tbl_SFA_CCM(Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                                  "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                                  "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                                  "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                                  "Updated_Date,Remarks,Sur_Name,Gender)" +
                                                  "values(@Customer_ID,@Customer_Name,@Speciality_Code,@Qualification,@Address1,@Address2, " +
                                                  "@Local_Area,@Pin_Code,@City,@State,@Country,@Phone,@Mobile,@Fax, " +
                                                  "@Email,@Hospital_Name,@Hospital_Classification,@DOB,@Anniversary_Date, " +
                                                  "@Registration_No,@Latitude,@Longitude,@Active_Status,@Created_By,@Created_Date,@Updated_By, " +
                                                  "@Updated_Date,@Remarks,@Sur_Name,@Gender)";
                            rowsAffected = connection.Execute(query, lstCCM, transaction: trans);
                        }
                    }
                    else
                    {
                        const string historyQuery = "INSERT INTO tbl_SFA_CCM_History(Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                              "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                              "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                              "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                              "Updated_Date,Remarks,Sur_Name,Gender)" +
                                              "SELECT Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                              "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                              "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                              "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                              "Updated_Date,Remarks,Sur_Name,Gender FROM tbl_SFA_CCM WHERE Customer_ID= @Customer_ID ";
                        rowsAffected = connection.Execute(historyQuery, lstCCM, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string query = "UPDATE tbl_SFA_CCM set Customer_Name=@Customer_Name,Speciality_Code=@Speciality_Code, " +
                                                 "Qualification=@Qualification,Address1=@Address1,Address2=@Address2,Local_Area=@Local_Area, " +
                                                 "Pin_Code=@Pin_Code,City=@City,State=@State,Country=@Country,Phone=@Phone,Mobile=@Mobile,Fax=@Fax, " +
                                                 "Email=@Email,Hospital_Name=@Hospital_Name,Hospital_Classification=@Hospital_Classification,DOB=@DOB, " +
                                                 "Anniversary_Date=@Anniversary_Date,Registration_No=@Registration_No,Latitude=@Latitude,Longitude=@Longitude, " +
                                                 "Active_Status=@Active_Status,Updated_By=@Updated_By,Updated_Date=@Updated_Date,Remarks=@Remarks, " +
                                                 "Sur_Name= @Sur_Name, Gender=@Gender " +
                                                 "WHERE Customer_ID= @Customer_ID ";
                            rowsAffected = connection.Execute(query, lstCCM, transaction: trans);
                        }
                    }
                    trans.Commit();

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }
        /// <summary>
        /// Get CCM details 
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="isAllRecords"></param>
        /// <param name="searchKey"></param>
        /// <param name="totalPageCount"></param>
        /// <returns>returns the list of CCM details</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMDetails(int pageNumber, int pageSize, bool isAllRecords, string searchKey, ref int totalPageCount)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@PageNumber", pageNumber);
                    p.Add("@PageSize", pageSize);
                    p.Add("@IsAllRecordsRequired", isAllRecords);
                    p.Add("@SearchKey", searchKey);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);

                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMDETAILS, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }
        /// <summary>
        /// delete the customers from the ccm table
        /// </summary>
        /// <param name="lstCCMDoctors"></param>
        /// <param name="lstCMDoctors"></param>
        /// <returns>retuns the no of rows affected</returns>
        public int DeleteCCM(List<MVCModels.CCMModel> lstCCMDoctors)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    if (lstCCMDoctors.Count > 0)
                    {
                        const string insertQuery = "INSERT INTO tbl_SFA_CCM_DELETED (Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                             "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                             "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                             "Registration_No,Latitude,Longitude,SRID,Active_Status,Created_By,Created_Date,Updated_By, " +
                                             "Updated_Date,Remarks,Is_Similar_Doctor,Is_Soundex_Processed,Soundex_Processed_Date,Similar_Doctor_ID)" +
                            //"values() " +
                                             "SELECT Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                             "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                             "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                             "Registration_No,Latitude,Longitude,SRID,Active_Status,Created_By,Created_Date,Updated_By, " +
                                             "Updated_Date,Remarks,Is_Similar_Doctor,Is_Soundex_Processed,Soundex_Processed_Date,Similar_Doctor_ID " +
                                             "FROM tbl_SFA_CCM WHERE Customer_ID= @Customer_ID ";
                        rowsAffected = connection.Execute(insertQuery, lstCCMDoctors, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string query = "DELETE FROM tbl_SFA_CCM WHERE Customer_ID= @Customer_ID ";
                            rowsAffected = connection.Execute(query, lstCCMDoctors, transaction: trans);
                        }
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }
        /// <summary>
        /// Get countries from CCM
        /// </summary>
        /// <returns>returns the list of countries</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMCountries()
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMCOUNTRIES, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }
        /// <summary>
        /// Get States from CCM by Country
        /// </summary>
        /// <param name="country"></param>
        /// <returns>returns the list of states</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMStatesByCountry(string country)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Country", country);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMSTATES, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }
        /// <summary>
        /// Get cities from CCM by country and state
        /// </summary>
        /// <param name="country"></param>
        /// <param name="state"></param>
        /// <returns>returns the list of cities</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMCitiesByCountryandState(string country, string state)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Country", country);
                    p.Add("@State", state);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_hd_CCM_GetCCMCity, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }

        /// <summary>
        /// Get ccm doctors by country, state, city and search key
        /// </summary>
        /// <param name="country"></param>
        /// <param name="state"></param>
        /// <param name="city"></param>
        /// <param name="searchKey"></param>
        /// <returns> returns the list of doctor details </returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMDoctorsByAddress(string country, string state, string city, string searchKey, string ccmSearchKey)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Country", country);
                    p.Add("@State", state);
                    p.Add("@City", city);
                    p.Add("@SearchKey", searchKey);
                    p.Add("@CCMSearchKey", ccmSearchKey);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMDOCTORSBYADDRESS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }

        /// <summary>
        /// Get ccm details by selected area in maps
        /// </summary>
        /// <param name="country"></param>
        /// <param name="state"></param>
        /// <param name="city"></param>
        /// <param name="searchKey"></param>
        /// <returns>returns the list of doctors</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMDoctorsByLatLong(string neLatitudeValue, string neLongitudeValue,
                string swLatitudeValue, string swLongitudeValue, string CCMSearchKey)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@NeLatitudeValue", neLatitudeValue);
                    p.Add("@NeLongitudeValue", neLongitudeValue);
                    p.Add("@SwLatitudeValue", swLatitudeValue);
                    p.Add("@SwLongitudeValue", swLongitudeValue);
                    p.Add("@CCMSearchKey", CCMSearchKey);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMDOCTORSBYLATLONG, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }
        /// <summary>
        /// get doctors from ccm by address and speciality
        /// </summary>
        /// <param name="state"></param>
        /// <param name="city"></param>
        /// <param name="speciality"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMDoctorsByAddressandSpeciality(string country, string state, string city, string speciality)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Country", country);
                    p.Add("@State", state);
                    p.Add("@City", city);
                    p.Add("@Speciality", speciality);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMDOCTORSBYADDRESSANDSPECIALITY, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }
        /// <summary>
        /// get doctors by the filters
        /// </summary>
        /// <param name="state"></param>
        /// <param name="city"></param>
        /// <param name="speciality"></param>
        /// <param name="NeLatitudeValue"></param>
        /// <param name="NeLongitudeValue"></param>
        /// <param name="SwLatitudeValue"></param>
        /// <param name="SwLongitudeValue"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMDoctorsByFilters(string country, string state, string city, string speciality, string NeLatitudeValue,
                string NeLongitudeValue, string SwLatitudeValue, string SwLongitudeValue, string CCMSearchKey)
        {
            IEnumerable<MVCModels.CCMModel> lstCCM = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    NeLatitudeValue = NeLatitudeValue == "" ? "0.0" : NeLatitudeValue;
                    NeLongitudeValue = NeLongitudeValue == "" ? "0.0" : NeLongitudeValue;
                    SwLatitudeValue = SwLatitudeValue == "" ? "0.0" : SwLatitudeValue;
                    SwLongitudeValue = SwLongitudeValue == "" ? "0.0" : SwLongitudeValue;
                    p.Add("@Country", country);
                    p.Add("@State", state);
                    p.Add("@City", city);
                    p.Add("@Speciality", speciality);
                    p.Add("@NeLatitudeValue", NeLatitudeValue);
                    p.Add("@NeLongitudeValue", NeLongitudeValue);
                    p.Add("@SwLatitudeValue", SwLatitudeValue);
                    p.Add("@SwLongitudeValue", SwLongitudeValue);
                    p.Add("@CCMSearchKey", CCMSearchKey);
                    lstCCM = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMDOCTORSBYFILTERS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstCCM;
        }

        /// <summary>
        /// Get divisions
        /// </summary>
        /// <returns></returns>
        public IEnumerable<MVCModels.DivisionModel> GetDivisions()
        {
            IEnumerable<MVCModels.DivisionModel> lstDivision = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    lstDivision = connection.Query<MVCModels.DivisionModel>(SP_HD_CCM_GETDIVISIONS);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstDivision;
        }
        /// <summary>
        /// Get child regions
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.RegionModel> GetRegions(string regionCode)
        {
            IEnumerable<MVCModels.RegionModel> lstRegion = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    lstRegion = connection.Query<MVCModels.RegionModel>(SP_HD_CCM_GETCHILDREGIONS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstRegion;
        }

        public int MapCCMToCM(string companyCode, List<MVCModels.CCMModel> lstCCM, string guid, List<MVCModels.CCMModel> lstNewDoctors)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    //const string query = "INSERT INTO tbl_SFA_Customer_Master(Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                    //                    "Local_Area,Pin_Code,City,Phone,Mobile,Fax,Email, " +
                    //                    "Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                    //                    "Registration_No,Latitude,Longitude,Customer_Status,Customer_Code,Customer_Entity_Type, " +
                    //                    "Created_By,Created_Date,Remarks,CCM_Customer_ID,Region_Code ) " +
                    //                    "values (Customer_Name,Speciality_Code,Qualification,Address1,Address2," +
                    //                    "Local_Area,Pin_Code,City,Phone,Mobile,Fax,Email, " +
                    //                    "Hospital_Name,Hospital_Classification,DOB,Anniversary_Date,Registration_No,Latitude,Longitude,'2', " +
                    //                    "NEXT VALUE FOR SEQ_tbl_SFA_Customer_Master,'DOCTOR', " +
                    //                    "Created_By,Created_Date,Remarks,Customer_ID,@Region_Code WHERE Customer_ID=@Customer_ID))";
                    if (lstCCM.Count > 0)
                    {
                        const string mdl = "MDL_Number";
                        string historyQuery = "INSERT INTO tbl_SFA_Customer_Master_History(Company_Code,Customer_Code, " +
                                            "Customer_Name,Region_Type_Code,Region_Code,SubRegion_Code,Category,Speciality_Code,Address1,Address2, " +
                                            "Local_Area,City,Pin_Code,Phone,Mobile,Fax,Email,Customer_Status,DOB,Anniversary_Date, " +
                                            "Reminder_Type,Reminder_Period,Primary_Contact, " +
                                            "Contact_Relation,Primary_Email,MDL_Number,Qualification,Created_By,Created_Date,Row_Status, " +
                                            " Effective_From,Effective_To,Approved_By,  " +
                                            " Approved_Date,Is_Inherited,Remarks,Applied_Date,Applied_By,Unapproved_Date,Unapproved_By,Depot_Code, " +
                                            " Price_Region_Code,Customer_Group, " +
                                            " Drug_License_Number1,Drug_License_Number2,Product_Discount_Applicable_Status,Special_Discount_Rate, " +
                                            " Octroi_Rate,TOT_Value, " +
                                            " Octroi_Reimbursment_Status,Place_Type,Registered_Delear_Status,Tax_Exempted_Status,Party_Location, " +
                                            " Additional_Surcharge_Status, " +
                                            " Tin_Number,CST_Number, Dispatch_Date,Sales_Tax_Registration_Number,Destination_Place,Locked, " +
                                            " CForm_Availability,Privilege_Value,Record_Status, " +
                                            " CST_Applicable,Customer_Entity_Type,Registration_Number,Row_Version_No,Number_Of_Visit, " +
                                            " Is_Billing_Customer,Hospital_Name, " +
                                            " Hospital_Classification,Registration_No,Source_Region,Moved_By,Moved_On, " +
                                            " Changed_Column_Name,Old_Value,New_Value,UpdatedBy,UpdatedDatetime,GENDER,Move_Type,PRICE_GROUP_CODE) " +
                                            " SELECT " +
                                            " Company_Code,Customer_Code,Customer_Name,Region_Type_Code,Region_Code,SubRegion_Code,Category," +
                                            " Speciality_Code,Address1,Address2,Local_Area,City,Pin_Code,Phone,Mobile,Fax,Email,Customer_Status,DOB," +
                                            " Anniversary_Date,Reminder_Type,Reminder_Period,ISNULL(Primary_Contact,'N/A'),Contact_Relation,Primary_Email," +
                                            " MDL_Number,Qualification,Created_By,Created_Date,Row_Status,Effective_From," +
                                            " GETDATE(),Approved_By,Approved_Date,Is_Inherited,Remarks," +
                                            " Applied_Date,Applied_By,Unapproved_Date,Unapproved_By,Depot_Code," +
                                            " Price_Region_Code,Customer_Group,Drug_License_Number1,Drug_License_Number2," +
                                            " Product_Discount_Applicable_Status,Special_Discount_Rate," +
                                            " Octroi_Rate,TOT_Value,Octroi_Reimbursment_Status,Place_Type,Registered_Delear_Status,Tax_Exempted_Status," +
                                            " Party_Location,Additional_Surcharge_Status," +
                                            " Tin_Number,CST_Number,Dispatch_Date,Sales_Tax_Registration_Number,Destination_Place," +
                                            " Locked,CForm_Availability," +
                                            " Privilege_Value,Record_Status,CST_Applicable,Customer_Entity_Type,Registration_Number," +
                                            " Row_Version_No,Number_Of_Visit,Is_Billing_Customer," +
                                            " Hospital_Name,Hospital_Classification,Registration_No,Source_Region,Moved_By,Moved_On," +
                                            " '" + mdl + "',MDL_Number,@MDL_Number,Created_By,GETDATE(),Gender,Move_Type,Price_Group_Code" +
                                            "  FROM  TBL_SFA_CUSTOMER_MASTER WHERE  CCM_Customer_ID=@CCM_Customer_ID  " +
                                            "and Region_Code=@Region_Code AND Customer_Entity_Type='DOCTOR'";
                        rowsAffected = connection.Execute(historyQuery, lstCCM, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            string query = "UPDATE tbl_SFA_Customer_Master SET MDL_Number=@MDL_Number,Customer_Status='2' where " +
                                            "CCM_Customer_ID= @CCM_Customer_ID AND Region_Code=@Region_Code";

                            rowsAffected = connection.Execute(query, lstCCM, transaction: trans);
                            if (rowsAffected > 0)
                            {
                                if (lstNewDoctors.Count > 0)
                                {
                                    rowsAffected = 0;
                                    query = "INSERT INTO tbl_SFA_CCM_Staging(Customer_ID,Category_Code,Region_Code,BP_ID,Category_Name,MDL_Number) " +
                                                      "values (@Customer_ID,@Category_Code,@Region_Code,'" + guid + "',@Category_Name,@MDL_Number)";
                                    rowsAffected = connection.Execute(query, lstNewDoctors, transaction: trans);
                                }
                            }
                        }
                    }
                    else
                    {
                        string query = "INSERT INTO tbl_SFA_CCM_Staging(Customer_ID,Category_Code,Region_Code,BP_ID,Category_Name,MDL_Number) " +
                                             "values (@Customer_ID,@Category_Code,@Region_Code,'" + guid + "',@Category_Name,@MDL_Number)";
                        rowsAffected = connection.Execute(query, lstNewDoctors, transaction: trans);
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }

        public IEnumerable<MVCModels.CCMModel> GetMappedDoctors(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.CCMModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    lstDoctors = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETMAPPEDDOCTORS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDoctors;
        }
        /// <summary>
        /// get doctor category by division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.DoctorCategoryModel> GetDoctorCategoryByDivision(string companyCode, string divisionCode)
        {
            IEnumerable<MVCModels.DoctorCategoryModel> lstCategory;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Division_Code", divisionCode);
                    lstCategory = connection.Query<MVCModels.DoctorCategoryModel>(SP_HD_CCM_GETCATEGORYBYDIVISION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstCategory;
        }
        /// <summary>
        /// get child regions by division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.RegionModel> GetChildRegionsByDivision(string companyCode, string regionCode, string divisionCode)
        {
            IEnumerable<MVCModels.RegionModel> lstRegion = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Division_Code", divisionCode);
                    lstRegion = connection.Query<MVCModels.RegionModel>(SP_HD_CCM_GETCHILDREGIONSBYDIVISION,
                        p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstRegion;
        }

        public string InsertCMFromStagingToMaster(string companyCode, string guid, string uploadedBy, string categoryCode, string regionCode, string regionName)
        {

            SPData _objSPData = new SPData();
            Data objData = new Data();
            string result = string.Empty;
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_CCM_INSERTCCMTOCM);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@BPID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.NVarChar, 500, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@Category_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, categoryCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.NVarChar, 100, regionName);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                objData.OpenConnection(companyCode);
                objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
            }
            catch (Exception ex)
            {
                result = String.Concat("ERROR: ", ex.StackTrace.Substring(0, 499));
            }

            return result;
        }


        public IEnumerable<MVCModels.CCMModel> GetSimilarDoctors(string searchKey)
        {
            IEnumerable<MVCModels.CCMModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@SearchKey", searchKey);
                    lstDoctors = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMSIMILLARRECORDS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDoctors;
        }
        public int UpdateMDLNumber(string companyCode, List<MVCModels.CCMModel> lstCCM)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    string query = "UPDATE tbl_SFA_Customer_Master Set MDL_Number=@MDL_Number where Customer_Code=@Customer_Code and Region_Code=@Region_Code)";
                    rowsAffected = connection.Execute(query, lstCCM, transaction: trans);
                    trans.Commit();

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }

        public string CCMExcelBulkCopy(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            Data _objData = new Data();
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Customer_Name", "Customer_Name");
                        copy.ColumnMappings.Add("Speciality_Name", "Speciality_Name");
                        copy.ColumnMappings.Add("Qualification", "Qualification");
                        copy.ColumnMappings.Add("Address1", "Address1");
                        copy.ColumnMappings.Add("Address2", "Address2");
                        copy.ColumnMappings.Add("Local_Area", "Local_Area");
                        copy.ColumnMappings.Add("Pin_Code", "Pin_Code");
                        copy.ColumnMappings.Add("City", "City");
                        copy.ColumnMappings.Add("State", "State");
                        copy.ColumnMappings.Add("Country", "Country");
                        copy.ColumnMappings.Add("Phone", "Phone");
                        copy.ColumnMappings.Add("Mobile", "Mobile");
                        copy.ColumnMappings.Add("Fax", "Fax");
                        copy.ColumnMappings.Add("Email", "Email");
                        copy.ColumnMappings.Add("Hospital_Name", "Hospital_Name");
                        copy.ColumnMappings.Add("Hospital_Classification", "Hospital_Classification");
                        copy.ColumnMappings.Add("DOB", "DOB");
                        copy.ColumnMappings.Add("Anniversary_Date", "Anniversary_Date");
                        copy.ColumnMappings.Add("Registration_No", "Registration_No");
                        copy.ColumnMappings.Add("BP_ID", "BP_ID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.ColumnMappings.Add("Sur_Name", "Sur_Name");
                        copy.ColumnMappings.Add("Gender", "Gender");
                        copy.DestinationTableName = "tbl_SFA_CCM_Staging";
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
        public string InsertCCMStagingToMaster(string subDomain, string guid, string fileName, string uploadedBy, string bpType)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_CCM_BULKCCMINSERT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@BP_ID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                // _objData.CloseConnection();
            }
            return result;
        }

        /// <summary>
        /// update the customer ISSimilar status in ccm table
        /// </summary>
        /// <param name="lstCCMDoctors"></param>
        /// <param name="lstCMDoctors"></param>
        /// <returns>retuns the no of rows affected</returns>
        public int UpdateCCMDoctorIsSimilarStatus(List<MVCModels.CCMModel> lstCCMDoctors)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    if (lstCCMDoctors.Count > 0)
                    {
                        const string historyQuery = "INSERT INTO tbl_SFA_CCM_History(Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                              "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                              "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                              "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                              "Updated_Date,Remarks)" +
                                              "SELECT Customer_ID,Customer_Name,Speciality_Code,Qualification,Address1,Address2, " +
                                              "Local_Area,Pin_Code,City,State,Country,Phone,Mobile,Fax, " +
                                              "Email,Hospital_Name,Hospital_Classification,DOB,Anniversary_Date, " +
                                              "Registration_No,Latitude,Longitude,Active_Status,Created_By,Created_Date,Updated_By, " +
                                              "Updated_Date,Remarks FROM tbl_SFA_CCM WHERE Customer_ID= @Customer_ID ";
                        rowsAffected = connection.Execute(historyQuery, lstCCMDoctors, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            const string query = "UPDATE tbl_SFA_CCM set Is_Similar_Doctor=@Is_Similar_Doctor,Updated_By=@Updated_By,Updated_Date=@Updated_Date " +
                                                 "WHERE Customer_ID= @Customer_ID ";
                            rowsAffected = connection.Execute(query, lstCCMDoctors, transaction: trans);
                        }
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }

        public string GetRegionMaxDoctorCount(string companyCode, string regionCode)
        {
            string doctorCount = "0";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    doctorCount = connection.Query<string>(USP_HD_CCM_GETREGIONMAXDOCTORCOUNT, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "-1";
            }
            return doctorCount;
        }

        #region public IEnumerable<MVCModels.CCMModel> GetLocalArea()
        /// <summary>
        /// Get LocalArea
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of Distinct LocalArea from CCM table</returns>

        public IEnumerable<MVCModels.CCMModel> GetCCMLocalArea()
        {
            IEnumerable<MVCModels.CCMModel> lstLocalArea = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstLocalArea = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GET_LOCALAREA, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return lstLocalArea;
        }
        #endregion

        #region public string CCMProcessSoundex()
        /// <summary>
        /// Get LocalArea
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>process Similar doctors CCM table</returns>

        public void CCMProcessSoundex(string subDomain, string processId)
        {
            //IEnumerable<MVCModels.CCMModel> lstLocalArea = null;
            //var soundexResult = false;
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                //using (IDbConnection connection = IDbOpenConnection())
                //{                    
                //    soundexResult = connection.Query<bool>(SP_HD_CCM_PROCESS_SOUNDEX, commandType: CommandType.StoredProcedure).SingleOrDefault();
                //    soundexResult = true;
                //}
                SqlCommand command = new SqlCommand(SP_HD_CCM_PROCESS_SOUNDEX);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@SoundexProcessID", ParameterDirection.Input, SqlDbType.VarChar, 36, processId);


                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                //soundexResult = false;
                throw ex;
            }

        }
        #endregion

        public IEnumerable<MVCModels.CCMModel> GetCCMDocDetailsforValidation()
        {
            IEnumerable<MVCModels.CCMModel> lstCCM;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCCM = connection.Query<MVCModels.CCMModel>(USP_HD_CCM_GETCCMDOCDETAILSFORVALIDATION, null,
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstCCM;
        }

        public bool CheckMobileNumberExists(string mobile, int Customer_ID, string Mode)
        {
            int isMobileExists = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Mobile", mobile);
                    p.Add("@Customer_ID", Customer_ID);
                    p.Add("@Mode", Mode);
                    isMobileExists = connection.Query<int>(SP_HD_CCM_ISMOBILENUMBEREXISTS, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                    if (isMobileExists > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            //  return isMobileExists == 0 ? false : true;
        }

        public bool CheckRegistrationNumberExists(string regNo, int Customer_ID, string Mode)
        {
            int isRegNoExists = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Registration_No", regNo);
                    p.Add("@Customer_ID", Customer_ID);
                    p.Add("@Mode", Mode);
                    isRegNoExists = connection.Query<int>(SP_HD_CCM_ISREGISTRATIONNUMBEREXISTS, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                    if (isRegNoExists > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            //return isRegNoExists == 0 ? false : true;
        }

        public IEnumerable<MVCModels.CCMModel> GetSimilarDoctorsByLocalArea(string searchKey, string localArea)
        {
            IEnumerable<MVCModels.CCMModel> lstSimilarDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@LocalArea", localArea);
                    p.Add("@SearchKey", searchKey);
                    lstSimilarDoctors = connection.Query<MVCModels.CCMModel>(SP_HD_CCM_GETCCMSIMILARRECORDS_BYLOCALAREA, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstSimilarDoctors;
        }

        public int UpdateProcessLog(string companyCode, string processId, string userCode, string mode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    if ("START" == mode.ToUpper())
                    {
                        rowsAffected = 0;
                        string query = "INSERT INTO TBL_SFA_CCM_SOUNDEX_Process_History(Company_Code,SOUNDEX_PROCESS_ID,USER_CODE, " +
                                                "START_TIME,CURRENT_STATUS) " +
                                                "values('" + companyCode + "','" + processId + "','" + userCode + "',SYSDATETIME(),'STARTED')";
                        rowsAffected = connection.Execute(query, transaction: trans);
                    }
                    else if ("END" == mode.ToUpper())
                    {

                        string query = "UPDATE [TBL_SFA_CCM_SOUNDEX_Process_History] SET END_TIME = SYSDATETIME(), CURRENT_STATUS = 'COMPLETED' WHERE SOUNDEX_PROCESS_ID = '"
                            + processId + "'";
                        rowsAffected = connection.Execute(query, transaction: trans);
                    }
                    else
                    {

                        string query = "UPDATE [TBL_SFA_CCM_SOUNDEX_Process_History] SET END_TIME = SYSDATETIME(), CURRENT_STATUS = 'ERROR_RAISED' WHERE SOUNDEX_PROCESS_ID = "
                            + processId + "'";
                        rowsAffected = connection.Execute(query, transaction: trans);
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }

        public IEnumerable<MVCModels.CCMSoundexProcessHistory> GetSoundexProcessHistory()
        {
            IEnumerable<MVCModels.CCMSoundexProcessHistory> lstSoundex;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    lstSoundex = connection.Query<MVCModels.CCMSoundexProcessHistory>(USP_HD_CCM_GETSOUNDEXPROCESSHISTORY,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstSoundex;
        }
    }
}
