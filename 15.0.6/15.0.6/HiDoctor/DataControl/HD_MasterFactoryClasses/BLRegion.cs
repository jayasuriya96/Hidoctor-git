using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Web;
using System.Collections;
using DataControl.Impl;
using DataControl.Abstraction;
using System.Threading.Tasks;
using MVCModels;
using MVCModels.HiDoctor_Master;
using Newtonsoft.Json;

namespace DataControl
{
    public class BLRegion
    {
        DALRegion _dalRegion = new DALRegion();
        private IFileProvider _fileProvider = null;
        private IExcelFactory _objExcelConverter = null;
        private const string Success = "SUCCESS";
        private const string SHEET_NAME = "SHEET1$A:N";
        private const string WHERE_QRY = " LEN(Region_Name) > 0 ";
        private const string BP_TYPE = "REGION_UPLOAD";
        private const string STAGING_TABLE_NAME = "TBL_SFA_REGION_MASTER_STAGING";
        private const string FILE_UPLOAD_PATH = "ExcelUploadPath";
        private string _SFCExcelTemplateFileName = string.Empty;
        private string _HolidayExcelTemplateFileName = string.Empty;
        private string _InwardExcelTemplateFileName = string.Empty;

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionClassification(string companyCode)
        {
            return _dalRegion.GetRegionClassification(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionType(string companyCode)
        {
            return _dalRegion.GetRegionType(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegionsByRegTypeAndRegClassification(string companyCode, string regionTypes, string regionClassifications)
        {
            return _dalRegion.GetRegionsByRegTypeAndRegClassification(companyCode, regionTypes, regionClassifications);
        }
        public string PriceGroupRegionMapping(string companyCode, string priceGroupCode, string regionCodes)
        {
            return _dalRegion.PriceGroupRegionMapping(companyCode, priceGroupCode, regionCodes);
        }
        public List<MVCModels.HiDoctor_Master.RegionModel> GetMappedRegionsByPriceGroup(string companyCode, string priceGroupCode)
        {
            return _dalRegion.GetMappedRegionsByPriceGroup(companyCode, priceGroupCode);
        }
        public string SchemeRegionMapping(string companyCode, string schemeCode, string regionCodes)
        {
            return _dalRegion.SchemeRegionMapping(companyCode, schemeCode, regionCodes);
        }
        public List<MVCModels.HiDoctor_Master.RegionModel> GetMappedRegionsByScheme(string companyCode, string schemeCode)
        {
            return _dalRegion.GetMappedRegionsByScheme(companyCode, schemeCode);
        }

        //*********************** START - WEEKEND GROUP *******************************//
        // To get Weekend Off Holiday Methods
        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> WeekendOffHolidayMethods(string companyCode)
        {
            return _dalRegion.WeekendOffHolidayMethods(companyCode);
        }

        public string InsertWeekendGroup(string companyCode, string weekendGroupName, string selectedDays, string holidayMethodDetails)
        {
            string result = "";
            result = _dalRegion.InsertWeekendGroupHeader(companyCode, weekendGroupName);
            if (result.Split('^')[0] == Success)
            {
                result = InsertWeekendGroupDetails(companyCode, result.Split('^')[1], selectedDays, holidayMethodDetails);
            }
            return result;
        }

       

        private string InsertWeekendGroupDetails(string companyCode, string weekendGroupCode, string selectedDays, string holidayMethodDetails)
        {
            string result = "";
            string[] selectedDaysArr;
            DataTable dt = new DataTable();
            DataTable dtt = new DataTable();
            var currentDate = new Data();
            selectedDaysArr = selectedDays.Split('|');
            //Company_Code	Weekend_Off_Code	Weekend_off_Detail_code	Month	Year	Date           

            dt.Columns.Add("Company_Code", typeof(string));
            dt.Columns.Add("Weekend_Off_Code", typeof(int));
            dt.Columns.Add("Weekend_off_Detail_code", typeof(int));
            dt.Columns.Add("Month", typeof(int));
            dt.Columns.Add("Year", typeof(int));
            dt.Columns.Add("Date", typeof(string));
            int i = 1;
            if (selectedDaysArr.Length > 0)
            {
                foreach (var item in selectedDaysArr)
                {
                    DataRow dr = dt.NewRow();
                    dr["Company_Code"] = companyCode;
                    dr["Weekend_Off_Code"] = weekendGroupCode;
                    dr["Weekend_off_Detail_code"] = i;
                    dr["Month"] = item.Split('-')[1];
                    dr["Year"] = item.Split('-')[0];
                    dr["Date"] = item;
                    dt.Rows.Add(dr);
                    i++;
                }
            }

            result = _dalRegion.InsertWeekendGroupDetail(companyCode, dt);

            if (result == Success)
            {
                string[] holidayMethodDetailsArr;
                int j = 1;

                holidayMethodDetailsArr = holidayMethodDetails.Split('~');
                if (holidayMethodDetailsArr.Length > 0)
                {//Company_Code	Weekend_Off_Code	Weekend_off_Definer_Code	Year	Weekday	WKO_Holiday_Method_Code	Ref_Key1	Ref_key2

                    dtt.Columns.Add("Company_Code", typeof(string));
                    dtt.Columns.Add("Weekend_Off_Code", typeof(int));
                    dtt.Columns.Add("Weekend_off_Definer_Code", typeof(int));
                    dtt.Columns.Add("Year", typeof(int));
                    dtt.Columns.Add("Weekday", typeof(string));
                    dtt.Columns.Add("WKO_Holiday_Method_Code", typeof(int));

                    foreach (var item in holidayMethodDetailsArr)
                    {
                        DataRow dr = dtt.NewRow();
                        dr["Company_Code"] = companyCode;
                        dr["Weekend_Off_Code"] = weekendGroupCode;
                        dr["Weekend_off_Definer_Code"] = j;
                        dr["Year"] = item.Split('|')[0];
                        dr["Weekday"] = item.Split('|')[1];
                        dr["WKO_Holiday_Method_Code"] = item.Split('|')[2];
                        dtt.Rows.Add(dr);
                        j++;
                    }
                }
            }

            result = _dalRegion.InsertWeekendOffDefiner(companyCode, dtt);


            return result;
        }

        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> GetAllWeekendGroups(string companyCode)
        {
            return _dalRegion.GetAllWeekendGroups(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.WeekendGroupModel> GetWeekendGroupDefinerReport(string companyCode, int weekEndGroupCode)
        {
            return _dalRegion.GetWeekendGroupDefinerReport(companyCode, weekEndGroupCode);
        }

        public List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> GetWeekendDaysForARegion(string companyCode, string regionCode, string fromDate, string toDate)
        {
            return _dalRegion.GetWeekendDaysForARegion(companyCode, regionCode, fromDate, toDate);
        }

        public List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> GetWeekendDaysFormappedRegion(string companyCode, string regionCode, string fromDate, string toDate)
        {
            return _dalRegion.GetWeekendDaysFormappedRegion(companyCode, regionCode, fromDate, toDate);
        }

        public int DeleteWeekend(string companyCode, int Year, string Date,string User_Code)
        {
            return _dalRegion.DeleteWeekend(companyCode,Year, Date, User_Code);
        }

        public int ManualInsertWeekEnd(string companyCode, string weekEndGroupCode, string Date)
        {
            return _dalRegion.ManualInsertWeekEnd(companyCode, weekEndGroupCode, Date);
        }
        //public List<LockRelease.StockistDetails> ManualInsertWeekEnd(string companyCode, string weekEndGroupCode, string Date)
        //{

        //    return ManualInsertWeekEnd.GetStockistDetailsrelease(companyCode, weekEndGroupCode, Date);

        //}

        //*********************** END - WEEKEND GROUP *******************************//

        public List<MVCModels.HiDoctor_Master.RegionModel> GetRegions(string companyCode)
        {
            return _dalRegion.GetRegions(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetChildRegions(string companyCode)
        {
            return _dalRegion.GetChildRegions(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetChildRegionsWithDivision(string companyCode, string regionCode)
        {
            return _dalRegion.GetChildRegionsWithDivision(companyCode, regionCode);
        }

        public string InsertRegionMasterBulkUpload(string subDomain, string companyCode, HttpPostedFileBase fileUpload,
            string user_Code, string updatedBy)
        {
            _objExcelConverter = new ExcelFactory();
            _fileProvider = new FileSystemProvider();
            string errorCode = "-1";

            try
            {
                // Save the file to server path.
                string fileNameWithPath = _fileProvider.GetFilePathToSave(FILE_UPLOAD_PATH, fileUpload.FileName);
                fileUpload.SaveAs(fileNameWithPath);

                // Validate column names are available.
                errorCode = IsColumnNamesCorrect(fileUpload, errorCode, fileNameWithPath);
                if (errorCode == "1")
                {
                    return errorCode;
                }

                // Specify the retrieve the column names.
                string[] excelRetrieveColumns = new string[] { "Row_No", "Region_Name", "Region_Type_Name", "Under_Region_Name",
                    "Region_Classification_Name", "Expense_Group_Name", "Price_Group_Name", "Region_Country", "Region_State", "Region_City", 
                    "Region_Local_Area", "Region_Latitude", "Region_Longitude"};

                // convert the excel to datatable.
                DataTable dt = _objExcelConverter.ExcelToDataSet(excelRetrieveColumns, SHEET_NAME, WHERE_QRY, fileNameWithPath, "Region_Name");

                if (dt != null && dt.Rows.Count == 0)
                {
                    errorCode = "6";
                    _fileProvider.UploadFileDelete(FILE_UPLOAD_PATH, fileUpload.FileName);
                    return errorCode;
                }


                // Validate the Row No datatype.
                if (!_objExcelConverter.IsRowNumbersAreValid(dt))
                {
                    errorCode = "4";
                    _fileProvider.UploadFileDelete(FILE_UPLOAD_PATH, fileUpload.FileName);
                    return errorCode;
                }

                // Auto Increment column.
                DataColumn uniqueColumn = new DataColumn();
                uniqueColumn.ColumnName = "Row_Unique_Id";
                uniqueColumn.DataType = typeof(int);
                uniqueColumn.AutoIncrement = true;
                uniqueColumn.AutoIncrementSeed = 1;
                dt.Columns.Add(uniqueColumn);

                // Add BPID and CompanyCode Columns.
                Guid BP_Id = Guid.NewGuid();
                dt.Columns.Add("BP_ID", typeof(Guid));
                dt.Columns.Add("Company_Code", typeof(string));
                for (int index = 0; index < dt.Rows.Count; index++)
                {
                    dt.Rows[index]["Company_Code"] = companyCode;
                    dt.Rows[index]["BP_ID"] = BP_Id;
                    dt.Rows[index]["Row_Unique_Id"] = index;
                }

                // if no errors, We assume datatable is valid.
                // Then we call async method.
                if (errorCode == "-1")
                {
                    // Call the Async method. 
                    Task task = Task.Factory.StartNew(() => _dalRegion.RegionMasterBulkInsert(subDomain, companyCode,
                        BP_Id, BP_TYPE, fileNameWithPath, user_Code, dt, STAGING_TABLE_NAME, updatedBy));
                }

                // Delete the uploaded file.
                _fileProvider.UploadFileDelete(FILE_UPLOAD_PATH, fileUpload.FileName);
                return errorCode;
            }
            catch (Exception ex)
            {
                _fileProvider.UploadFileDelete(FILE_UPLOAD_PATH, fileUpload.FileName);
                return ex.Message;
            }
        }

        private string IsColumnNamesCorrect(HttpPostedFileBase fileUpload, string errorCode, string fileNameWithPath)
        {
            // Set Excel column Names.
            Hashtable hashExcelColumnsTable = new Hashtable();
            hashExcelColumnsTable.Add("Row_No", "");
            hashExcelColumnsTable.Add("Region_Name", "");
            hashExcelColumnsTable.Add("Region_Type_Name", "");
            hashExcelColumnsTable.Add("Under_Region_Name", "");
            hashExcelColumnsTable.Add("Region_Classification_Name", "");
            hashExcelColumnsTable.Add("Expense_Group_Name", "");
            hashExcelColumnsTable.Add("Price_Group_Name", "");
            hashExcelColumnsTable.Add("Region_Country", "");
            hashExcelColumnsTable.Add("Region_State", "");
            hashExcelColumnsTable.Add("Region_City", "");
            hashExcelColumnsTable.Add("Region_Local_Area", "");
            hashExcelColumnsTable.Add("Region_Latitude", "");
            hashExcelColumnsTable.Add("Region_Longitude", "");
            // Check column headers are correct.
            if (!_objExcelConverter.IsExcelColumnHeadrsAreCorrect(hashExcelColumnsTable, SHEET_NAME, fileNameWithPath))
            {
                errorCode = "1";
                _fileProvider.UploadFileDelete(FILE_UPLOAD_PATH, fileUpload.FileName);
            }
            return errorCode;
        }

        private DataTable ConvertInwardExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            DataTable dt = new DataTable();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();

            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            string fileName = postedFile.FileName;
            //string[] excelRetrieveColumns = new string[] { "Row_No", "Employee_Number", "Product_Ref_Key", "Batch_Number", "Upload_Quantity", "Delivery_Challan" };
            _InwardExcelTemplateFileName = fileProvider.GetFilePathToSave(FILE_UPLOAD_PATH, fileName);
            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);
            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            dt = objAzureUpload.ConvertStreamToDataTable(stream, "Row_No");
            return dt;
        }

        #region SFC REGION EXCEL UPLOAD
        private DataTable ConvertSFCExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            DataTable dt = new DataTable();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();

            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "Row_No", "Region_Name", "From_Place", "To_Place", "Distance", 
                "Amount", "Travel_Mode", "Category", "SFC_Min_Count" ,"SFC_Max_Count", "Date_From", "Date_To" };
            _SFCExcelTemplateFileName = fileProvider.GetFilePathToSave(FILE_UPLOAD_PATH, fileName);
            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);
            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            dt = objAzureUpload.ConvertStreamToDataTable(stream, "Region_Name");
            return dt;
        }

        public string InsertSFCExcelBulkUpload(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy,
            string subDomain, string ipAddress, string hostName)
        {
            string result = "";
            try
            {
                DataTable dt = ConvertSFCExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO REGION DETAILS FOUND IN THE EXCEL SHEET";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO REGION DETAILS FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("BP_Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["GUID"] = guid;
                        dt.Rows[i]["BP_Status"] = "PROCESSING";
                    }
                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("ROW_NO");
                    arHeader.Add("REGION_NAME");
                    arHeader.Add("FROM_PLACE");
                    arHeader.Add("TO_PLACE");
                    arHeader.Add("DISTANCE");
                    arHeader.Add("AMOUNT");
                    arHeader.Add("TRAVEL_MODE");
                    arHeader.Add("CATEGORY");
                    arHeader.Add("SFC_MIN_COUNT");
                    arHeader.Add("SFC_MAX_COUNT");
                    arHeader.Add("DATE_FROM");
                    arHeader.Add("DATE_TO");
                    if ((dt.Columns.Count - 3) == arHeader.Count)
                    {
                        for (int j = 0; j < dt.Columns.Count - 3; j++)
                        {
                            if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                            {
                                errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                            }
                        }
                        if (string.IsNullOrEmpty(errorResult.ToString()))
                        {
                            result = _dalRegion.SFCBulkCopy(companyCode, dt, subDomain);
                            if (result == "SUCCESS")
                            {
                                result = _dalRegion.InsertSFCBulkUpload(companyCode, guid, _SFCExcelTemplateFileName, uploadedBy, "SFC_UPLOAD", subDomain,
                                    ipAddress, hostName);
                            }
                            else
                            {
                                result = "ERROR:Instructions are not followed.SFC Bulk insert failed." + result;
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
                result = "ERROR:Instructions are not followed." + ex.Message;
            }
            return result;
        }
        #endregion SFC REGION EXCEL UPLOAD

        public DataSet GetActiveProducts(string companyCode)
        {
            DataSet Ds = new DataSet();
            Ds = _dalRegion.GetActiveProducts(companyCode);
            return Ds;
        }

        public string InsertInwardExcelBulkUpload(string CompanyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, string SubDomain, string HostName, DateTime Inward_Date, string Inward_ACK_Needeed)
        {
            string result = "";
            try
            {
                DataTable dt = ConvertInwardExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO Row_No FOUND IN THE EXCEL SHEET";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO Row_No FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("BP_Status", typeof(String));
                    dt.Columns.Add("Created_By", typeof(String));
                    dt.Columns.Add("Created_Date", typeof(DateTime));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = CompanyCode;
                        dt.Rows[i]["GUID"] = guid;
                        dt.Rows[i]["BP_Status"] = "PROCESSING";
                        dt.Rows[i]["Created_By"] = uploadedBy;
                        dt.Rows[i]["Created_Date"] = Inward_Date;
                    }
                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("Row_No");
                    arHeader.Add("Employee_Number");
                    //arHeader.Add("Product_Type");
                    //arHeader.Add("Product_Name");
                    arHeader.Add("Product_Ref_Key");
                    arHeader.Add("Batch_Number");
                    arHeader.Add("Upload_Quantity");
                    arHeader.Add("Delivery_Challan");
                    if ((dt.Columns.Count - 5) == arHeader.Count)
                    {
                        for (int j = 0; j < dt.Columns.Count - 5; j++)
                        {
                            if (!arHeader.Contains(dt.Columns[j].ToString()))
                            {
                                errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                            }
                        }
                        if (string.IsNullOrEmpty(errorResult.ToString()))
                        {
                            //Integer Check
                            string IntegerError = string.Empty;
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                try
                                {
                                    dt.Rows[i]["Upload_Quantity"] = Convert.ToInt32(dt.Rows[i]["Upload_Quantity"].ToString());
                                }
                                catch (Exception ex)
                                {
                                    if (string.IsNullOrEmpty(IntegerError))
                                        IntegerError = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + " ; Upload Quantity Should be a non decimal value";
                                    else
                                        IntegerError += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + " ; Upload Quantity Should be a non decimal value";
                                }
                            }
                            if (string.IsNullOrEmpty(IntegerError.ToString()))
                            {
                                string negativeError = string.Empty;
                                for (int i = 0; i < dt.Rows.Count; i++)
                                {
                                    if (Convert.ToInt32(dt.Rows[i]["Upload_Quantity"].ToString()) < 0)
                                    {
                                        if (string.IsNullOrEmpty(negativeError))
                                            negativeError = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + "; Upload Quantity Should be a Positive Number Only ";
                                        else
                                            negativeError += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + "; Upload Quantity Should be a Positive Number Only";
                                    }
                                }
                                if (string.IsNullOrEmpty(negativeError.ToString()))
                                {
                                    string LengthValidation = string.Empty;
                                    for (int i = 0; i < dt.Rows.Count; i++)
                                    {
                                        if (  dt.Rows[i]["Upload_Quantity"].ToString().Length>10)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + "; Upload Quantity character length should not exceed more than 10";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Upload_Quantity = " + dt.Rows[i]["Upload_Quantity"].ToString() + "; Upload Quantity character length should not exceed more than 10";
                                        }
                                        if (dt.Rows[i]["Row_No"].ToString().Length > 10)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + "; Row No character length should not exceed more than 10";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + "; Row No character length should not exceed more than 10";
                                        }
                                        if (dt.Rows[i]["Delivery_Challan"].ToString().Length > 50)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Delivery_Challan = " + dt.Rows[i]["Delivery_Challan"].ToString() + "; Delivery Challan character length should not exceed more than 50";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Delivery_Challan = " + dt.Rows[i]["Delivery_Challan"].ToString() + "; Delivery Challan character length should not exceed more than 50";
                                        }
                                        if (dt.Rows[i]["Employee_Number"].ToString().Length > 30)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Employee_Number = " + dt.Rows[i]["Employee_Number"].ToString() + "; Employee_Number character length should not exceed more than 30";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Employee_Number = " + dt.Rows[i]["Employee_Number"].ToString() + "; Employee_Number character length should not exceed more than 30";
                                        }
                                        if (dt.Rows[i]["Product_Ref_Key"].ToString().Length > 30)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Product_Ref_Key = " + dt.Rows[i]["Product_Ref_Key"].ToString() + "; Product_Ref_Key character length should not exceed more than 30";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Product_Ref_Key = " + dt.Rows[i]["Product_Ref_Key"].ToString() + "; Product_Ref_Key character length should not exceed more than 30";
                                        }
                                        if (dt.Rows[i]["Batch_Number"].ToString().Length > 15)
                                        {
                                            if (string.IsNullOrEmpty(LengthValidation))
                                                LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Batch_Number= " + dt.Rows[i]["Batch_Number"].ToString() + "; Batch_Number character length should not exceed 15.";
                                            else
                                                LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Batch_Number= " + dt.Rows[i]["Batch_Number"].ToString() + "; Batch_Number character length should not exceed 15.";
                                        }
                                        //if (dt.Rows[i]["Product_Type"].ToString().Length > 30)
                                        //{
                                        //    if (string.IsNullOrEmpty(LengthValidation))
                                        //        LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Product_Type= " + dt.Rows[i]["Product_Type"].ToString() + "; Product_Type character length should not exceed 30.";
                                        //    else
                                        //        LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Product_Type= " + dt.Rows[i]["Product_Type"].ToString() + "; Product_Type character length should not exceed 30.";
                                        //}
                                        //if (dt.Rows[i]["Product_Name"].ToString().Length > 300)
                                        //{
                                        //    if (string.IsNullOrEmpty(LengthValidation))
                                        //        LengthValidation = "ERROR: Row No-" + dt.Rows[i]["Row_No"] + " Product_Name= " + dt.Rows[i]["Product_Name"].ToString() + "; Product_Name character length should not exceed 30.";
                                        //    else
                                        //        LengthValidation += "<br/> Row No-" + dt.Rows[i]["Row_No"] + " Product_Name= " + dt.Rows[i]["Product_Name"].ToString() + "; Product_Name character length should not exceed 30.";
                                        //}
                                    }
                                    if (string.IsNullOrEmpty(LengthValidation.ToString()))
                                    {
                                        result = _dalRegion.InwardBulkCopy(CompanyCode, dt, SubDomain);
                                        if (result == "SUCCESS")
                                        {
                                            if (Inward_ACK_Needeed.ToUpper() == "YES")
                                            {
                                                result = _dalRegion.InsertInwardBulkUpload(CompanyCode, guid, _InwardExcelTemplateFileName, uploadedBy, "INWARD_BULK_UPLOAD", SubDomain);
                                            }
                                            else
                                            {
                                                result = _dalRegion.InsertInwardBulkUpload(CompanyCode, guid, _InwardExcelTemplateFileName, uploadedBy, "INWARD_BULK_UPLOAD", SubDomain);
                                            }
                                        }
                                        else
                                        {
                                            result = "ERROR:Instructions are not followed.Inward Bulk Upload insert failed." + result;
                                        }
                                    }
                                    else
                                        result = LengthValidation.ToString();

                                }
                                else
                                    result = negativeError.ToString();

                            }
                            else
                                result = IntegerError.ToString();
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
                if (ex.Message == "The given value of type String from the data source cannot be converted to type int of the specified target column.")
                {
                    result = "ERROR:Please Enter Integer Value in Upload_Quantity Column.";
                }
                else
                {
                    result = "ERROR:Instructions are not followed." + ex.Message;
                }
            }
            return result;
        }

        public List<RegionLockMappingModel> GetMappedRegion(string CompanyCode)
        {
           
            return _dalRegion.GetMappedRegion(CompanyCode);
        }

        public IEnumerable<RegionLockMappingModel> GetActiveRegionLockMapping(string company_Code)
        {
            return _dalRegion.GetRegionLockMappingList(company_Code);
        }
        public int UnmapRegionslock(string Regioncode, string UserName)
        {
            int result = 0;
            result = _dalRegion.UnmapRegionslock(Regioncode, UserName);
            return result;
        }

        public bool InsertRegionLockMapping(string CompanyCode, string CreatedBy,string regionLockJson)
        {
            bool result = false;
            //string[] lstRegionLockMapping = regionLockJson.Split(',');
            List<RegionLockMappingModel> lstRegionLockMapping = (List<RegionLockMappingModel>)JsonConvert.DeserializeObject(regionLockJson, typeof(List<RegionLockMappingModel>));
            lstRegionLockMapping.ForEach(cc => cc.Company_Code = CompanyCode);

            List<MVCModels.HiDoctor_Master.RegionModel> lstRegions = _dalRegion.GetRegions(CompanyCode);
            lstRegionLockMapping = lstRegionLockMapping.Join(lstRegions, (lockMapping) => lockMapping.Region_Code, (Region) => Region.Region_Code, (lockMapping, Region) =>
                 {
                     lockMapping.Region_Type_Code = Region.Region_Type_Code;
                     return lockMapping;
                 }).ToList();

            DataTable dtRegCodes = null;
            if (lstRegionLockMapping.Count >= 1)
            {
                dtRegCodes = new DataTable();
                dtRegCodes.Columns.Add("Id", typeof(int));
                dtRegCodes.Columns.Add("Company_Code", typeof(string));
                dtRegCodes.Columns.Add("Region_Type_Code", typeof(string));
                dtRegCodes.Columns.Add("Region_Code", typeof(string));
                
                dtRegCodes.Columns.Add("Created_By", typeof(string));
                int id = 0;
                for (int i = 0; i < lstRegionLockMapping.Count; i++)
                {
                    id++;
                    dtRegCodes.Rows.Add(id, CompanyCode, lstRegionLockMapping[i].Region_Type_Code, lstRegionLockMapping[i].Region_Code, CreatedBy);
                }
            }
            result = _dalRegion.InsertRegionLockMapping(dtRegCodes);
            //result = _objDALLeave.AddNewLeaveType(companyCode, UserName, NewLeaveType, userTypeCode, dtUserCodes);
            return result;
        }


        //public int InsertRegionLockMapping(string company_Code, string regionLockJSON)
        //{
        //    List<RegionLockMappingModel> lstRegionLockMapping = (List<RegionLockMappingModel>)JsonConvert.DeserializeObject(regionLockJSON, typeof(List<RegionLockMappingModel>));
        //    lstRegionLockMapping.ForEach(cc => cc.Company_Code = company_Code);

        //    List<MVCModels.HiDoctor_Master.RegionModel> lstRegions = _dalRegion.GetRegions(company_Code);
        //    lstRegionLockMapping = lstRegionLockMapping.Join(lstRegions, (lockMapping) => lockMapping.Region_Code, (Region) => Region.Region_Code, (lockMapping, Region) =>
        //         {
        //             lockMapping.Region_Type_Code = Region.Region_Type_Code;
        //             return lockMapping;
        //         }).ToList();

        //    return _dalRegion.InsertRegionLockMapping(lstRegionLockMapping);
        //}
        public DataSet GetRegionsforPrimarySales(string company_Code)
        {
            return _dalRegion.GetRegionsforPrimarySales(company_Code);
        }

        #region holiday master
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetMappedHolidayDetails(string company_Code, string regionCodes,
            string year, string SearchKey, int pageNumber, bool excelDownload, int PAGESIZE, ref int totalPageCount)
        {
            return _dalRegion.GetMappedHolidayDetails(company_Code, regionCodes, year, SearchKey, pageNumber, excelDownload, PAGESIZE, ref totalPageCount);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidayDetailsByDate(string company_Code, string Holiday_Date)
        {
            return _dalRegion.GetHolidayDetailsByDate(company_Code, Holiday_Date);
        }
        public int InsertHolidayMaster(List<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday, string mode, string companyCode, string Old_HolidayDate)
        {
            return _dalRegion.InsertHolidayMaster(lstHoliday, mode, companyCode, Old_HolidayDate);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetHolidayMappedRegions(string company_Code)
        {
            return _dalRegion.GetHolidayMappedRegions(company_Code);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetHolidayUnMappedRegions(string company_Code)
        {
            return _dalRegion.GetHolidayUnMappedRegions(company_Code);
        }
        public int HolidayInheritance(string companyCode, string sourceRegion, List<MVCModels.HiDoctor_Master.RegionModel> lstRegion, string userCode, string createdDate)
        {
            return _dalRegion.HolidayInheritance(companyCode, sourceRegion, lstRegion, userCode, createdDate);
        }
        #endregion holiday master

        #region fullindex migration
        public DataSet GetAllRegionsForMigration(string companyCode)
        {
            DataSet ds = new DataSet();
            ds = _dalRegion.GetAllRegionsForMigration(companyCode);
            return ds;
        }
        public DataSet GetRegionHierarchyDataset(string companyCode, string regionCode, string enteredBy, string Guid)
        {
            DataSet ds = new DataSet();
            ds = _dalRegion.GetRegionHierarchyDataset(companyCode, regionCode, enteredBy, Guid);
            return ds;
        }
        public string BulkRegionTempInsert(string companyCode, DataTable dt, string mode)
        {
            return _dalRegion.BulkRegionTempInsert(companyCode, dt, mode);
        }
        public int UpdateRegionIndexFromTemptoRegionMaster(string companyCode, string mode, string guid, string userCode)
        {
            string result = _dalRegion.UpdateRegionIndexFromTemptoRegionMaster(companyCode, mode, guid);
            if ("SUCCESS" == result.Split(':')[0])
            {
                return _dalRegion.DeleteRegionsFromTemp(companyCode, guid, userCode);
            }
            else
            {
                return 0;
            }
        }

        public int UpdateCustomerPriceGroup(string companyCode, List<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer, string regionCode, string entity)
        {
            return _dalRegion.UpdateCustomerPriceGroup(companyCode, lstCustomer, regionCode, entity);
        }
        #endregion full index migration

        #region TPLockManualRelease
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidaysEnteredInLast15Days(string company_Code)
        {
            return _dalRegion.GetHolidaysEnteredInLast15Days(company_Code);
        }
        public string UpdateTPLockManuelRelease(string companyCode, string holidayDates, string region_Code, string updatedBy)
        {
            try
            {
                return _dalRegion.UpdateTPLockManuelRelease(companyCode, holidayDates, region_Code, updatedBy);
            }
            catch
            {
                throw;
            }
        }
        #endregion TPLockManualRelease

        #region - Region Tree - New
        /// <summary>
        /// Get Region By Region name
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionName"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetRegionsbyRegionName(string companyCode, string regionName, string regionCode)
        {
            return _dalRegion.GetRegionsbyRegionName(companyCode, regionName, regionCode);
        }

        /// <summary>
        /// Get immediate child Regions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.RegionModel> GetImmediateChildRegionForTree(string companyCode, string regionCode)
        {
            return _dalRegion.GetImmediateChildRegionForTree(companyCode, regionCode);
        }
        #endregion - Region Tree - New
        #region Holiday Bulk Upload

        public string InsertHolidayExcelBulkUpload(string companyCode, string guid, System.Web.HttpFileCollectionBase postedFile, string uploadedBy,
            string subDomain)
        {
            string result = "";
            try
            {
                DALRegion _dalRegion = new DALRegion();
                DataTable dt = ConvertHolidayExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO REGION DETAILS FOUND IN THE EXCEL SHEET";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO REGION DETAILS FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("BP_Status", typeof(String));

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["GUID"] = guid;
                        dt.Rows[i]["BP_Status"] = "PROCESSING";
                    }
                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("ROW_NO");
                    arHeader.Add("REGION_NAME");
                    arHeader.Add("HOLIDAY_DATE");
                    arHeader.Add("HOLIDAY_NAME");

                    if ((dt.Columns.Count - 3) == arHeader.Count)
                    {
                        for (int j = 0; j < dt.Columns.Count - 3; j++)
                        {
                            if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                            {
                                errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                            }
                        }
                        if (string.IsNullOrEmpty(errorResult.ToString()))
                        {
                            //Date Check
                            string dateError = string.Empty;
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                try
                                {
                                    dt.Rows[i]["Holiday_Date"] = DateTime.ParseExact(dt.Rows[i]["Holiday_Date"].ToString(), "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                                }
                                catch (Exception ex)
                                {
                                    if (string.IsNullOrEmpty(dateError))
                                        dateError = "Row No:" + dt.Rows[i]["Row_No"] + " Date : " + dt.Rows[i]["Holiday_Date"].ToString() + " Holiday date should be (DD-MM-YYYY) format";
                                    else
                                        dateError += "<br/> Row No:" + dt.Rows[i]["Row_No"] + " Date : " + dt.Rows[i]["Holiday_Date"].ToString() + " Holiday date should be (DD-MM-YYYY) format";
                                }
                            }
                            if (string.IsNullOrEmpty(dateError.ToString()))
                            {
                                result = _dalRegion.HolidayBulkCopy(companyCode, dt, subDomain);
                                if (result == "SUCCESS")
                                {
                                    result = _dalRegion.InsertHolidayBulkUpload(companyCode, guid, _HolidayExcelTemplateFileName, uploadedBy, "HOLIDAY_UPLOAD");
                                }
                                else
                                {
                                    result = "ERROR:Instructions are not followed.Holiday Bulk insert failed." + result;
                                }
                            }
                            else
                                result = dateError.ToString();
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
                result = "ERROR:Instructions are not followed.Holiday Bulk insert failed.";
            }

            return result;
        }
        private DataTable ConvertHolidayExcelToDataTable(System.Web.HttpFileCollectionBase postedFile)
        {
            DataTable dt = new DataTable();
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                string containerName = objCurInfo.GetCompanyCode().ToLower();

                IFileProvider fileProvider = new FileSystemProvider();
                IExcelFactory excelFactory = new ExcelFactory();
                string fileName = postedFile[0].FileName;
                string[] excelRetrieveColumns = new string[] { "Row_No", "Region_Name", "Holiday_Date", "Holiday_Name" };
                _HolidayExcelTemplateFileName = fileProvider.GetFilePathToSave(FILE_UPLOAD_PATH, fileName);
                DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile[0].InputStream, postedFile[0].FileName, accKey, containerName);
                System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile[0].FileName, accKey, containerName);
                dt = objAzureUpload.ConvertStreamToDataTable(stream, "Region_Name");
            }
            catch (Exception ex)
            {
                throw;
            }
            return dt;
        }
        public List<MVCModels.HiDoctor_Master.ExcelRegionMaster> GetRegionFullTreeDetails(string companycode)
        {

            var _dalRegion = new DALRegion();
            return _dalRegion.GetRegionFullTreeDetails(companycode);
        }
        #endregion
        public IEnumerable<MapConfigDetails> GetCurrentMapDetails(string ComapnyCode)
        {
            List<MapConfigDetails> lstMap = _dalRegion.GetCurrentMapDetails(ComapnyCode).ToList();
            var Result = from c in lstMap
                         where c.Active_Status == 1
                         select c;
            List<MapConfigDetails> _lstFinalMap = new List<MapConfigDetails>();
            foreach (var s in Result)
            {
                MapConfigDetails _objMap = new MapConfigDetails();
                _objMap.Map_Provider_Name = s.Map_Provider_Name;
                _lstFinalMap.Add(_objMap);
            }
            return _lstFinalMap;
        }
    }
}
