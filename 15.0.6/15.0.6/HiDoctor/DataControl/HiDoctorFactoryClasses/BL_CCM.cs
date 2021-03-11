using DataControl.Abstraction;
using DataControl.Impl;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl
{
    public class BL_CCM
    {
        private string _CCMExcelTemplateFileName = string.Empty;
        private const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";

        DAL_CCM objCCM;
        /// <summary>
        /// Get doctor category
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the list of category</returns>
        public IEnumerable<MVCModels.DoctorCategoryModel> GetDoctorCategory(string companyCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetDoctorCategory(companyCode);
        }

        /// <summary>
        /// Get speciality
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of speciality</returns>
        public IEnumerable<MVCModels.SpecialityModel> GetSpeciality(string companyCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetSpeciality(companyCode);
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
            objCCM = new DAL_CCM();
            return objCCM.InsertCCM(companyCode, lstCCM, mode);
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
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDetails(pageNumber, pageSize, isAllRecords, searchKey, ref totalPageCount);
        }

        /// <summary>
        /// delete the customers from the ccm table
        /// </summary>
        /// <param name="lstCCMDoctors"></param>
        /// <param name="lstCMDoctors"></param>
        /// <returns>retuns the no of rows affected</returns>
        public int DeleteCCM(List<MVCModels.CCMModel> lstCCMDoctors)
        {
            objCCM = new DAL_CCM();
            return objCCM.DeleteCCM(lstCCMDoctors);
        }
        /// <summary>
        /// Get countries from CCM
        /// </summary>
        /// <returns>returns the list of countries</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMCountries()
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMCountries();
        }
        /// <summary>
        /// Get States from CCM by Country
        /// </summary>
        /// <param name="country"></param>
        /// <returns>returns the list of states</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMStatesByCountry(string country)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMStatesByCountry(country);
        }
        /// <summary>
        /// Get cities from CCM by country and state
        /// </summary>
        /// <param name="country"></param>
        /// <param name="state"></param>
        /// <returns>returns the list of cities</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMCitiesByCountryandState(string country, string state)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMCitiesByCountryandState(country, state);
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
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDoctorsByAddress(country, state, city, searchKey, ccmSearchKey);
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
                string swLatitudeValue, string swLongitudeValue, string ccmSearchKey)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDoctorsByLatLong(neLatitudeValue, neLongitudeValue, swLatitudeValue, swLongitudeValue, ccmSearchKey);
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
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDoctorsByAddressandSpeciality(country, state, city, speciality);
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
               string NeLongitudeValue, string SwLatitudeValue, string SwLongitudeValue, string ccmSearchKey)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDoctorsByFilters(country, state, city, speciality, NeLatitudeValue, NeLongitudeValue,
                SwLatitudeValue, SwLongitudeValue, ccmSearchKey);
        }

        /// <summary>
        /// Get divisions
        /// </summary>
        /// <returns></returns>
        public IEnumerable<MVCModels.DivisionModel> GetDivisions()
        {
            objCCM = new DAL_CCM();
            return objCCM.GetDivisions();
        }
        /// <summary>
        /// Get child regions
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.RegionModel> GetRegions(string regionCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetRegions(regionCode);
        }

        public int MapCCMToCM(string companyCode, List<MVCModels.CCMModel> lstCCM, string guid, List<MVCModels.CCMModel> lstNewDoctors)
        {
            objCCM = new DAL_CCM();
            return objCCM.MapCCMToCM(companyCode, lstCCM, guid, lstNewDoctors);
        }
        public IEnumerable<MVCModels.CCMModel> GetMappedDoctors(string companyCode, string regionCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetMappedDoctors(companyCode, regionCode);
        }
        /// <summary>
        /// get doctor category by division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.DoctorCategoryModel> GetDoctorCategoryByDivision(string companyCode, string divisionCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetDoctorCategoryByDivision(companyCode, divisionCode);
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
            objCCM = new DAL_CCM();
            return objCCM.GetChildRegionsByDivision(companyCode, regionCode, divisionCode);
        }

        public string InsertCMFromStagingToMaster(string companyCode, string guid, string uploadedBy, string categoryCode, string regionCode, string regionName)
        {
            objCCM = new DAL_CCM();
            return objCCM.InsertCMFromStagingToMaster(companyCode, guid, uploadedBy, categoryCode, regionCode, regionName);
        }
        public IEnumerable<MVCModels.CCMModel> GetSimilarDoctors(string searchKey)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetSimilarDoctors(searchKey);
        }

        public int UpdateMDLNumber(string companyCode, List<MVCModels.CCMModel> lstCCM)
        {
            objCCM = new DAL_CCM();
            return objCCM.UpdateMDLNumber(companyCode, lstCCM);
        }

        private DataTable ConvertCCMExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "Row_No", "Customer_Name","Sur_Name", "Speciality_Name","Gender", "Qualification", "Address1", 
                "Address2", "Local_Area", "Pin_Code", "City", "State", "Country", "Phone", "Mobile", "Fax", "Email", "Hospital_Name", "Hospital_Classification",
            "DOB","Anniversary_Date","Registration_No"};

            _CCMExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            string whereQuery = " LEN(Customer_Name) >0 ";

            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            DataTable dt = new DataTable();
            dt = objAzureUpload.ConvertStreamToDataTable(stream, "Customer_Name");
            return dt;
        }
        public string InsertCCMBulkUpload(string subDomain, string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy)
        {
            objCCM = new DAL_CCM();
            string result = "";
            try
            {
                DataTable dt = ConvertCCMExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("BP_ID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["BP_ID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }
                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("ROW_NO");
                    arHeader.Add("CUSTOMER_NAME");
                    arHeader.Add("SUR_NAME");
                    arHeader.Add("SPECIALITY_NAME");
                    arHeader.Add("GENDER");
                    arHeader.Add("QUALIFICATION");
                    arHeader.Add("ADDRESS1");
                    arHeader.Add("ADDRESS2");
                    arHeader.Add("LOCAL_AREA");
                    arHeader.Add("PIN_CODE");
                    arHeader.Add("CITY");
                    arHeader.Add("STATE");
                    arHeader.Add("COUNTRY");
                    arHeader.Add("PHONE");
                    arHeader.Add("MOBILE");
                    arHeader.Add("FAX");
                    arHeader.Add("EMAIL");
                    arHeader.Add("HOSPITAL_NAME");
                    arHeader.Add("HOSPITAL_CLASSIFICATION");
                    arHeader.Add("DOB");
                    arHeader.Add("ANNIVERSARY_DATE");
                    arHeader.Add("REGISTRATION_NO");

                    if ((dt.Columns.Count - 2) == arHeader.Count)
                    {
                        for (int j = 0; j < dt.Columns.Count - 2; j++)
                        {
                            if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                            {
                                errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                            }
                        }
                        if (string.IsNullOrEmpty(errorResult.ToString()))
                        {
                            result = objCCM.CCMExcelBulkCopy(companyCode, dt);
                            if (result == "SUCCESS")
                            {
                                result = objCCM.InsertCCMStagingToMaster(subDomain, guid, _CCMExcelTemplateFileName, uploadedBy, "CCM_UPLOAD");
                            }
                            else
                            {
                                result = "ERROR:Instructions are not followed.CCM Bulk insert failed." + result;
                            }
                        }
                        else
                        {
                            result = errorResult.ToString();
                        }
                    }
                    else
                    {
                        result = "ERROR:Instructions are not followed.Some columns are missing or extra columns are added in the excel sheet";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions not followed." + ex.Message;
            }
            return result;
        }

        /// <summary>
        /// delete the customers from the ccm table
        /// </summary>
        /// <param name="lstCCMDoctors"></param>
        /// <param name="lstCMDoctors"></param>
        /// <returns>retuns the no of rows affected</returns>
        public int UpdateCCMDoctorIsSimilarStatus(List<MVCModels.CCMModel> lstCCMDoctors)
        {
            objCCM = new DAL_CCM();
            return objCCM.UpdateCCMDoctorIsSimilarStatus(lstCCMDoctors);
        }
        public long GetSeqNumber(string objName)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetSeqNumber(objName);
        }
        public string GetRegionMaxDoctorCount(string companyCode, string regionCode)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetRegionMaxDoctorCount(companyCode, regionCode);
        }

        /// <summary>
        /// Get LocalArea for Soundex
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of speciality</returns>
        public IEnumerable<MVCModels.CCMModel> GetCCMLocalArea()
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMLocalArea();
        }

        /// <summary>
        /// Start Soundex
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of speciality</returns>
        public bool CCMProcessSoundex(string subDomain, string processId)
        {
            try
            {
                objCCM = new DAL_CCM();
                Task task = Task.Factory.StartNew(() => objCCM.CCMProcessSoundex(subDomain, processId));
                return true;
            }
            catch
            {
                throw;
            }
        }
        public IEnumerable<MVCModels.CCMModel> GetCCMDocDetailsforValidation()
        {
            objCCM = new DAL_CCM();
            return objCCM.GetCCMDocDetailsforValidation();
        }

        public IEnumerable<MVCModels.CCMModel> GetSimilarDoctorsByLocalArea(string searchKey, string localArea)
        {
            objCCM = new DAL_CCM();
            return objCCM.GetSimilarDoctorsByLocalArea(searchKey, localArea);
        }

        public bool CheckMobileNumberExists(string mobile, int Customer_ID, string Mode)
        {
            objCCM = new DAL_CCM();
            return objCCM.CheckMobileNumberExists(mobile, Customer_ID, Mode);
        }
        public bool CheckRegistrationNumberExists(string regNo, int Customer_ID, string Mode)
        {
            objCCM = new DAL_CCM();
            return objCCM.CheckRegistrationNumberExists(regNo, Customer_ID, Mode);
        }
        public int UpdateProcessLog(string companyCode, string processId, string userCode, string mode)
        {
            objCCM = new DAL_CCM();
            return objCCM.UpdateProcessLog(companyCode, processId, userCode, mode);
        }
        public IEnumerable<MVCModels.CCMSoundexProcessHistory> GetSoundexProcessHistory()
        {
            objCCM = new DAL_CCM();
            return objCCM.GetSoundexProcessHistory();
        }
    }
}
