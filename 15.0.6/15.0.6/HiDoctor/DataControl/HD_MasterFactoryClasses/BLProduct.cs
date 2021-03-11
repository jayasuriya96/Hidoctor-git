using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Data;
using System.Configuration;
using System.IO;
using DataControl.Abstraction;
using DataControl.Impl;
using System.Collections;

namespace DataControl
{
    public class BLProduct
    {
        #region Private Variables
        const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        const string INWARD_EXCEL_SHEET_NAME = "Table$";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";
        private string _productExcelTemplateFileName = string.Empty;
        private string _primarySalesExcelTemplateFileName = string.Empty;
        #endregion Private Variables

        DALProduct _dalProduct = new DALProduct();
        private StringBuilder _fileNameString = new StringBuilder();

        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllSaleProducts(string companyCode)
        {
            return _dalProduct.GetAllSaleProducts(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.ProductPriceModel> GetPriceGroupHeader(string companyCode)
        {
            return _dalProduct.GetPriceGroupHeader(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.ProductPriceModel> GetPriceGroupDetails(string companyCode, string priceGroupCode)
        {
            return _dalProduct.GetPriceGroupDetails(companyCode, priceGroupCode);
        }

        public List<MVCModels.HiDoctor_Master.ProductPriceModel> PriceGroupExcelUpload(string companyCode, System.Web.HttpPostedFileBase file)
        {
            const string INWARD_EXCEL_WHERE_QRY = "LEN(Invoice_Amount) >0 OR LEN(PTS) >0 OR LEN(PTR_WOTax) >0 OR LEN(MRP) >0 OR LEN(NRV) >0";
            // ExcelConverter _objSpData = new ExcelConverter();
            IExcelFactory _objExcelConverter = null;
            _objExcelConverter = new ExcelFactory();
            // string path = ConfigurationManager.AppSettings["ExcelUploadPath"].ToString();
            DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
            string path = fileProvider.GetOnlyFilePath("ExcelUploadPath");
            string fileNameWithPath = Path.Combine(path, file.FileName);
            file.SaveAs(fileNameWithPath);
            string[] excelRetrieveColumns = new string[] { "*" };
            //     public DataTable ExcelToDataSet(string[] retrieveColumnNames, string sheetName, string whereQuery, string filenamewithpath, string keyColumnName)

            DataTable dt = _objExcelConverter.ExcelToDataSet(excelRetrieveColumns, INWARD_EXCEL_SHEET_NAME, INWARD_EXCEL_WHERE_QRY, fileNameWithPath, "");
            List<MVCModels.HiDoctor_Master.ProductModel> lstProduct = new List<MVCModels.HiDoctor_Master.ProductModel>();
            lstProduct = GetAllSaleProducts(companyCode);
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProductPrice = new List<MVCModels.HiDoctor_Master.ProductPriceModel>();
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("IsError");
                dt.AcceptChanges();
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    dt.Rows[i]["IsError"] = "N";
                }
                //for (int i = 0; i < dt.Rows.Count; i++)
                //{
                //    //IEnumerable<MVCModels.HiDoctor_Master.ProductModel> filteredOnes = from item in lstProduct
                //    //                                                                   where item.Product_Name.Equals(dt.Rows[i]["Product_Name"])
                //    //                                                                   select item;
                //    List<MVCModels.HiDoctor_Master.ProductModel> lstfiltered = lstProduct.FindAll(p => p.Product_Name.Trim().Equals(dt.Rows[i]["Product_Name"].ToString().Trim()));
                //    if (lstfiltered.Count > 0)
                //    {
                //        string productCode = lstfiltered[0].Product_Code;
                //        dt.Rows[i]["Product_Code"] = productCode;
                //        dt.Rows[i]["IsError"] = "N";
                //        dt.AcceptChanges();
                //    }
                //    else
                //    {
                //        dt.Rows[i]["Product_Code"] = "";
                //        dt.Rows[i]["IsError"] = "Y";
                //        dt.AcceptChanges();
                //    }
                //}
                lstProductPrice = (from item in dt.AsEnumerable()
                                   select new MVCModels.HiDoctor_Master.ProductPriceModel()
                                   {
                                       Product_Code = item["Product_Code"].ToString(),
                                       Product_Name = item["Product_Name"].ToString(),
                                       Invoice_Amount = item["Invoice_Amount"].ToString().Trim().Length == 0 ? "0.00" : item["Invoice_Amount"].ToString().Trim(),
                                       PTS = item["PTS"].ToString().Trim().Length == 0 ? "0.00" : item["PTS"].ToString().Trim(),
                                       PTR_WOTax = item["PTR_WOTax"].ToString().Trim().Length == 0 ? "0.00" : item["PTR_WOTax"].ToString().Trim(),
                                       MRP = item["MRP"].ToString().Trim().Length == 0 ? "0.00" : item["MRP"].ToString().Trim(),
                                       NRV = item["NRV"].ToString().Trim().Length == 0 ? "0.00" : item["NRV"].ToString(),
                                       Source = "EXCEL",
                                       IsError = item["IsError"].ToString()
                                   }).ToList<MVCModels.HiDoctor_Master.ProductPriceModel>();
            }
            return lstProductPrice;
        }

        public StringBuilder GetPriceGroupExcelData()
        {

            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                #region File Name Generated
                _fileNameString.Append("PriceGroup");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                //   ExcelConverter _objExcelConverter = new ExcelConverter();
                //string path = ConfigurationManager.AppSettings["ExcelDownloadPath"].ToString();
                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                string writingColumnStartIndex = "A";
                string writingColumnEndIndex = "G";
                // int[] lockedColumnIndexes = new int[] { 1 };
                string[] hiddenColumnIndexes = new string[] { "Product_Code" };
                string[] hiddenColumns = new string[] { };
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();

                DataSet dsProduct = null;
                dsProduct = _dalProduct.GetSaleProducts(companyCode);

                if (dsProduct != null)
                {
                    dsProduct.Tables[0].Columns.Add("Invoice_Amount", typeof(decimal));
                    dsProduct.Tables[0].Columns.Add("PTS", typeof(decimal));
                    dsProduct.Tables[0].Columns.Add("PTR_WOTax", typeof(decimal));
                    dsProduct.Tables[0].Columns.Add("MRP", typeof(decimal));
                    dsProduct.Tables[0].Columns.Add("NRV", typeof(decimal));
                    DataRowCollection dr = dsProduct.Tables[0].Rows;
                    DataColumnCollection dc = dsProduct.Tables[0].Columns;

                    #region DataTable Rows to 2D Array
                    //object[,] valuesArray = new object[dr.Count, dc.Count];
                    //for (int i = 0; i < dr.Count; i++)
                    //{
                    //    //If you know the number of columns you have, you can specify them this way
                    //    //Otherwise use an inner for loop on columns
                    //    valuesArray[i, 0] = dr[i]["Product_Name"].ToString();
                    //    valuesArray[i, 1] = dr[i]["Product_Code"].ToString();
                    //    valuesArray[i, 2] = dr[i]["Invoice_Amount"].ToString();
                    //    valuesArray[i, 3] = dr[i]["PTS"].ToString();
                    //    valuesArray[i, 4] = dr[i]["PTR_WOTax"].ToString();
                    //    valuesArray[i, 5] = dr[i]["MRP"].ToString();
                    //    valuesArray[i, 6] = dr[i]["NRV"].ToString();
                    //}
                    #endregion DataTable Rows to 2D Array
                    //  _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsInwardExcelData, hiddenColumnIndexes, hiddenColumns);
                    //_objExcelConverter.DataTableToExcelFile(dsProduct.Tables[0], valuesArray, _fileNameString.ToString(), "ExcelDownloadPath",
                    //    hiddenColumns, lockedColumnIndexes, hiddenColumnIndexes, writingColumnStartIndex, writingColumnEndIndex);
                    _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsProduct, hiddenColumnIndexes, hiddenColumns, true, new string[] { "Invoice_Amount", "PTS", "PTR_WOTax", "MRP", "NRV" });
                }

                return _fileNameString;
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString;
            }
        }

        public string InsertPriceGroup(string companyCode, string priceGroupName, string productPrice, string mode, string priceGroupCode)
        {
            string result = "";
            if ("EDIT" == mode.ToUpper())
            {
                result = _dalProduct.DeletePriceGroupDetails(companyCode, priceGroupCode);
            }
            else
            {
                result = _dalProduct.InsertPriceHeader(companyCode, priceGroupName);
                priceGroupCode = result.Split(':')[1];
            }
            if ("SUCCESS" == result.Split(':')[0].ToUpper())
            {
                result = InsertPriceGroupDetails(companyCode, productPrice, priceGroupCode);
            }
            return result;
        }

        public string InsertPriceGroupDetails(string companyCode, string productPrice, string priceGroupCode)
        {
            string result = "";
            string[] productArr;
            productArr = productPrice.Split('$');
            if (productArr.Length > 0)
            {
                for (int i = 0; i < productArr.Length - 1; i++)
                {
                    string[] priceArr;
                    priceArr = productArr[i].Split('^');
                    if (priceArr.Length > 0)
                    {
                        string productCode = priceArr[0].ToString();
                        decimal invoiceAmount = Convert.ToDecimal(priceArr[1]);
                        decimal PTS = Convert.ToDecimal(priceArr[2]);
                        decimal PTR = Convert.ToDecimal(priceArr[3]);
                        decimal MRP = Convert.ToDecimal(priceArr[4]);
                        decimal NRV = Convert.ToDecimal(priceArr[5]);
                        result = _dalProduct.InsertPriceDetails(companyCode, priceGroupCode, priceGroupCode + "_" + (i + 1), productCode, invoiceAmount, PTS, PTR, MRP, NRV);
                    }
                }
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllProducts(string companyCode)
        {
            return _dalProduct.GetAllProducts(companyCode);
        }


        public string InsertScheme(string companyCode, string schemeName, string schemeBase, string effectiveFrom, string effectiveTo, string mode, string schemeCode, string schemeProducts)
        {
            string result = "";
            System.DateTime dateFrom = DateTime.Parse(Convert.ToDateTime(effectiveFrom).ToString("yyyy-MM-dd"));
            System.DateTime dateTo = DateTime.Parse(Convert.ToDateTime(effectiveTo).ToString("yyyy-MM-dd"));
            if ("EDIT" == mode.ToUpper())
            {
                result = _dalProduct.DeleteScheme(companyCode, schemeCode, dateFrom, dateTo);
            }
            else
            {
                result = _dalProduct.InsertSchemeHeader(companyCode, schemeName, schemeBase, dateFrom, dateTo);
                schemeCode = result.Split(':')[1];
            }
            if ("SUCCESS" == result.Split(':')[0].ToUpper())
            {
                result = InsertSchemeDetails(companyCode, schemeProducts, schemeCode, dateFrom, dateTo);
            }
            return result;
        }

        public string InsertSchemeDetails(string companyCode, string schemeProducts, string schemeCode, DateTime effectiveFrom, DateTime effectiveTo)
        {
            string result = "";
            string[] productArr;
            productArr = schemeProducts.Split('$');
            if (productArr.Length > 0)
            {
                for (int i = 0; i < productArr.Length - 1; i++)
                {
                    string[] salesProArr;
                    string[] offerProArr;
                    salesProArr = productArr[i].Split('|')[0].Split('^');
                    offerProArr = productArr[i].Split('|')[1].Split('~');
                    if (salesProArr.Length > 0)
                    {
                        string productCode = salesProArr[0];
                        decimal value = Convert.ToDecimal(salesProArr[1]);
                        result = _dalProduct.InsertSchemeDetails(companyCode, schemeCode, schemeCode + "-" + (i + 1), productCode, "Quantity", value, effectiveFrom, effectiveTo);
                        if ("SUCCESS" == result.Split(':')[0].ToUpper())
                        {
                            if (offerProArr.Length > 0)
                            {
                                for (int j = 0; j < offerProArr.Length - 1; j++)
                                {
                                    string offerProduct = offerProArr[j].Split('^')[0];
                                    decimal offerValue = Convert.ToDecimal(offerProArr[j].Split('^')[1]);
                                    result = _dalProduct.InsertSchemeOfferDetails(companyCode, schemeCode + "-" + (i + 1), offerProduct, "Quantity", offerValue);
                                }
                            }
                        }
                        //else if ("FAILURE" == result.Split(':')[0].ToUpper() && "REPEATED" == result.Split(':')[1].ToUpper())
                        //{
                        //    string deletedResult = _dalProduct.DeleteScheme(schemeCode);
                        //    if ("SUCCESS" == deletedResult.Split(':')[0].ToString())
                        //    {
                        //        result = "FAILURE:REPEATED_" + productCode;
                        //        break;
                        //    }
                        //}
                    }
                }
            }
            return result;
        }


        public List<MVCModels.HiDoctor_Master.SchemeModel> GetSchemeHeader(string companyCode)
        {
            return _dalProduct.GetSchemeHeader(companyCode);
        }

        public DataSet GetSchemeDetails(string companyCode, string schemeCode)
        {
            DataSet ds = null;
            JSONConverter objJson = new JSONConverter();
            ds = _dalProduct.GetSchemeDetails(companyCode, schemeCode);
            return ds;
        }
        public string CheckSchemeProductValidation(string companyCode, string productCodes, string effectiveFrom, string effectiveTo, string schemeCode)
        {
            System.DateTime dateFrom = DateTime.Parse(Convert.ToDateTime(effectiveFrom).ToString("yyyy-MM-dd"));
            System.DateTime dateTo = DateTime.Parse(Convert.ToDateTime(effectiveTo).ToString("yyyy-MM-dd"));
            string result = "";
            string[] productArray;
            productArray = productCodes.Split('^');
            for (var i = 0; i < productArray.Length - 1; i++)
            {
                result = _dalProduct.CheckSchemeProductValidation(companyCode, productArray[i], dateFrom, dateTo, schemeCode);
                if ("FAILURE" == result.Split(':')[0].ToUpper() && "REPEATED" == result.Split(':')[1].ToUpper())
                {
                    result = "FAILURE:REPEATED_" + productArray[i];
                    break;
                }
            }
            return result;
        }
        #region Product Master Bulk Insert
        public string ProductBulkInsert(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, string subDomain)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ConvertProductExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:PRODUCT NAME NOT FOUND IN THE EXCEL SHEET";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:PRODUCT NAME NOT FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }

                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("ROW_NO");
                    arHeader.Add("PRODUCT_NAME");
                    arHeader.Add("PRODUCT_SHORT_NAME");
                    arHeader.Add("PRODUCT_BLANKET_NAME");
                    arHeader.Add("PRODUCT_DESCRIPTION");
                    arHeader.Add("SPECIALITY_NAME");
                    arHeader.Add("BRAND_NAME");
                    arHeader.Add("CATEGORY_NAME");
                    arHeader.Add("UOM_NAME");
                    arHeader.Add("UOM_TYPE_NAME");
                    arHeader.Add("PRODUCT_GROUP_NAME");
                    arHeader.Add("PRODUCT_TYPE_NAME");
                    arHeader.Add("COMPETITOR_NAME");
                    arHeader.Add("REF_KEY1");
                    arHeader.Add("REF_KEY2");
                    arHeader.Add("EFFECTIVE_FROM");
                    arHeader.Add("EFFECTIVE_TO");
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
                            result = _dalProduct.ProductBulkInsert(companyCode, dt, subDomain);
                            if (result == "SUCCESS")
                            {
                                result = _dalProduct.ProductBulkInsertFromStagingToMaster(companyCode, guid, _productExcelTemplateFileName, uploadedBy,
                                                                "PRODUCT_UPLOAD", subDomain);
                            }
                            else
                            {
                                result = "ERROR:Instructions are not followed.product Bulk insert failed." + result;
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
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("guid", guid);
                dicObj.Add("uploadedBy", uploadedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }
        private DataTable ConvertProductExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            DataTable dt = new DataTable();
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                CurrentInfo objCurInfo = new CurrentInfo();
                string containerName = objCurInfo.GetCompanyCode().ToLower();
                IFileProvider fileProvider = new FileSystemProvider();
                IExcelFactory excelFactory = new ExcelFactory();
                string fileName = postedFile.FileName;
                string[] excelRetrieveColumns = new string[] { "Row_No", "Product_Name", "Product_Blanket_Name", "Product_Short_Name", "Product_Description", "Speciality_Name", "Brand_Name", "Category_Name", "UOM_Name", "UOM_Type_Name", "Product_Group_Name", "Product_Type_Name", "Competitor_Name", "Ref_Key1", "Ref_Key2", "Effective_From", "Effective_To" };

                _productExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);

                DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, fileName, accKey, containerName);
                System.IO.Stream stream = objAzureUpload.AzureblockDownload(fileName, accKey, containerName);
                dt = objAzureUpload.ConvertStreamToDataTable(postedFile.InputStream, "Product_Name");
                //dt = objAzureUpload.GetDataTableFromExcelFile(blobURL, "");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return dt;
        }
        #endregion Product Master Bulk Insert

        public List<MVCModels.HiDoctor_Master.SpecialityModel> GetSpeciality(string companyCode)
        {
            return _dalProduct.GetSpeciality(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.ProductModel> GetAllActiveProducts(string companyCode)
        {
            return _dalProduct.GetAllActiveProducts(companyCode);
        }

        #region primarysales excel upload
        public string PrimarySalesBulkInsert(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile,
                                        string uploadedBy, string subDomain, string TransType)
        {
            string result = string.Empty;
            try
            {
                DataTable dt = ConvertPrimarySalesExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:HQ NOT FOUND IN THE EXCEL SHEET";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:HQ NOT FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    StringBuilder errorResult = new StringBuilder();
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    dt.Columns.Add("Trans_Type", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                        dt.Rows[i]["Trans_Type"] = TransType.ToUpper();
                    }

                    ArrayList arHeader = new ArrayList();
                    arHeader.Add("ROW_NO");
                    arHeader.Add("HQ");
                    arHeader.Add("HQID");
                    arHeader.Add("DEPOTCD");
                    arHeader.Add("TYPE");
                    arHeader.Add("INVOICE_NO");
                    arHeader.Add("CUSTCD");
                    arHeader.Add("CUSTOMER_NAME");
                    arHeader.Add("INVDATE");
                    arHeader.Add("PRODUCTCODE");
                    arHeader.Add("PRODUCT_DESCRIPTION");
                    arHeader.Add("INVOICEQTY");
                    arHeader.Add("FREQTY");
                    arHeader.Add("VALUE");

                    if ((dt.Columns.Count - 4) == arHeader.Count)
                    {
                        for (int j = 0; j < dt.Columns.Count - 4; j++)
                        {
                            if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                            {
                                errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                            }
                        }
                        if (string.IsNullOrEmpty(errorResult.ToString()))
                        {
                            result = _dalProduct.PrimarySalesBulkInsert(companyCode, dt, subDomain);
                            if (result == "SUCCESS")
                            {
                                result = _dalProduct.PrimarySalesBulkInsertFromStagingToMaster(companyCode, guid,
                                    _primarySalesExcelTemplateFileName, uploadedBy,
                                                                "PRIMARYSALES_UPLOAD", subDomain, TransType);
                            }
                            else
                            {
                                result = "ERROR:Instructions are not followed.primary sales Bulk insert failed." + result;
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
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("guid", guid);
                dicObj.Add("uploadedBy", uploadedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }
        private DataTable ConvertPrimarySalesExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            DataTable dt = new DataTable();
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                CurrentInfo objCurInfo = new CurrentInfo();
                string containerName = objCurInfo.GetCompanyCode().ToLower();
                IFileProvider fileProvider = new FileSystemProvider();
                IExcelFactory excelFactory = new ExcelFactory();
                string fileName = postedFile.FileName;
                string[] excelRetrieveColumns = new string[] { "Row_No", "HQ", "HQID",
                    "DEPOTCD", "TYPE", "INVOICE_NO", "CUSTCD","CUSTOMER_NAME","INVDATE","PRODUCTCODE",
                    "PRODUCT_DESCRIPTION","INVOICEQTY","FREQTY","VALUE"};

                _primarySalesExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);

                DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);
                System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
                dt = objAzureUpload.ConvertStreamToDataTable(stream, "HQ");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return dt;
        }

        public StringBuilder GetProductMasterExcelData()
        {
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                #region File Name Generated
                _fileNameString.Clear();
                _fileNameString.Append("ProductMasterData");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();
                DataSet dsProduct = null;
                dsProduct = _dalProduct.GetProductsforPrimarySales(companyCode);
                if (dsProduct != null)
                {
                    if (dsProduct.Tables[0].Rows.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsProduct, new string[] { }, new string[] { },
                            false, new string[] { });
                    }
                    else
                    {
                        _fileNameString.Clear();
                        _fileNameString.Append("NO DATA");
                    }
                }
                else
                {
                    _fileNameString.Clear();
                    _fileNameString.Append("NO DATA");
                }
                return _fileNameString;
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString;
            }
        }
        public StringBuilder GetRegionMasterExcelData()
        {
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                #region File Name Generated
                _fileNameString.Clear();
                _fileNameString.Append("RegionMasterData");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();
                DataSet dsRegion = null;
                BLRegion objRegion = new BLRegion();
                dsRegion = objRegion.GetRegionsforPrimarySales(companyCode);
                if (dsRegion != null)
                {
                    if (dsRegion.Tables[0].Rows.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsRegion, new string[] { }, new string[] { }, false, new string[] { });
                    }
                    else
                    {
                        _fileNameString.Clear();
                        _fileNameString.Append("NO DATA");
                    }
                }
                else
                {
                    _fileNameString.Clear();
                    _fileNameString.Append("NO DATA");
                }
                return _fileNameString;
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString;
            }
        }
        public StringBuilder GetCustomerMasterExcelData()
        {
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                #region File Name Generated
                _fileNameString.Clear();
                _fileNameString.Append("CustomerMasterData");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();
                DataSet dsCustomer = null;
                BL_Customer objCustomer = new BL_Customer();
                dsCustomer = objCustomer.GetCustomersforPrimarySales(companyCode);
                if (dsCustomer != null)
                {
                    if (dsCustomer.Tables[0].Rows.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsCustomer, new string[] { }, new string[] { }, false, new string[] { });
                    }
                    else
                    {
                        _fileNameString.Clear();
                        _fileNameString.Append("NO DATA");
                    }
                }
                else
                {
                    _fileNameString.Clear();
                    _fileNameString.Append("NO DATA");
                }
                return _fileNameString;
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString;
            }
        }
        public StringBuilder GetDepotMasterExcelData()
        {
            try
            {
                CurrentInfo _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                #region File Name Generated
                _fileNameString.Clear();
                _fileNameString.Append("DepotMasterData");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();
                DataSet dsDepot = null;
                BLDepot objDepot = new BLDepot();
                dsDepot = objDepot.GetDepotsforPrimarySales(companyCode);
                if (dsDepot != null)
                {
                    if (dsDepot.Tables[0].Rows.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsDepot, new string[] { }, new string[] { }, false, new string[] { });
                    }
                    else
                    {
                        _fileNameString.Clear();
                        _fileNameString.Append("NO DATA");
                    }
                }
                else
                {
                    _fileNameString.Clear();
                    _fileNameString.Append("NO DATA");
                }
                return _fileNameString;
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString;
            }
        }
        #endregion primary sales excel upload

        #region primary sales parameters excel upload
        public DataSet GetPrimarySalesParameters(string companyCode)
        {
            return _dalProduct.GetPrimarySalesParameters(companyCode);
        }
        public DataSet GetPSEmployeeDetails(string companyCode)
        {
            return _dalProduct.GetPSEmployeeDetails(companyCode);
        }
        public string GetPrimarySalesParametersExcelData(string companyCode)
        {
            try
            {
                #region File Name Generated
                _fileNameString.Clear();
                _fileNameString.Append("EmployeeInfo");
                _fileNameString.Append("_");
                _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                _fileNameString.Append("_");
                _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                _fileNameString.Append(".xls");
                #endregion File Name Generated

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelDownloadPath");
                IExcelFactory _objExcelFactory = null;
                _objExcelFactory = new ExcelFactory();
                DataSet dsEmp = new DataSet();
                dsEmp = GetPSEmployeeDetails(companyCode);
                DataSet dsParam = null;
                dsParam = GetPrimarySalesParameters(companyCode);
                if (dsEmp.Tables.Count > 0)
                {
                    dsEmp.Tables[0].Columns.Add(new DataColumn("Pool_Code"));
                    foreach (DataRow dr in dsParam.Tables[0].Rows)
                    {
                        dsEmp.Tables[0].Columns.Add(new DataColumn(dr["Param_Column_Name"].ToString()));
                    }

                    dsEmp.AcceptChanges();
                }

                if (dsEmp != null)
                {
                    if (dsEmp.Tables[0].Rows.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsEmp, new string[] { }, new string[] { },
                            false, new string[] { });
                    }
                    else
                    {
                        _fileNameString.Clear();
                        _fileNameString.Append("NO DATA");
                    }
                }
                else
                {
                    _fileNameString.Clear();
                    _fileNameString.Append("NO DATA");
                }
                return _fileNameString.ToString();
            }
            catch
            {
                _fileNameString = new StringBuilder();
                return _fileNameString.ToString();
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> GetAllPSParameters(string companyCode)
        {
            return _dalProduct.GetAllPSParameters(companyCode);
        }

        /// <summary>
        /// insert/Update/change the status of the primary sales parameter columns
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="lstParam"></param>
        /// <returns></returns>
        public int InsertPSParameters(string companyCode, string mode, List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstParam)
        {
            int rowsAffected = 0;
            rowsAffected = _dalProduct.InsertPSParameters(companyCode, mode, lstParam);
            if (rowsAffected > 0)
            {
                rowsAffected = _dalProduct.CreateStagingTable(companyCode);
            }
            return rowsAffected;
        }

        private DataTable ConvertExcelToPrimarySalesValues(System.Web.HttpPostedFileBase postedFile, string companyCode)
        {
            DataTable dt = new DataTable();
            DataSet dsParam = new DataSet();
            try
            {
                //CurrentInfo objCurInfo = new CurrentInfo();
                //string containerName = objCurInfo.GetCompanyCode().ToLower();
                //IFileProvider fileProvider = new FileSystemProvider();
                //IExcelFactory excelFactory = new ExcelFactory();
                //string fileName = postedFile.FileName;
                //string[] excelRetrieveColumns = new string[] { };

                //_productExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);

                //DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
                //DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                //string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                //string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);
                //System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
                //dt = objAzureUpload.ConvertStreamToDataTable(stream, "MIS_CODE");
                dsParam = _dalProduct.GetPrimarySalesParameters(companyCode);

                // ExcelConverter _objSpData = new ExcelConverter();



            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return dt;
        }
        public string PrimarySalesValuesBulkInsert(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile,
            string uploadedBy, string subDomain, string month, string year)
        {
            string result = string.Empty;
            DataTable dt = new DataTable();
            try
            {
                IExcelFactory _objExcelConverter = null;
                _objExcelConverter = new ExcelFactory();

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelUploadPath");
                string fileNameWithPath = Path.Combine(path, postedFile.FileName);
                postedFile.SaveAs(fileNameWithPath);
                _productExcelTemplateFileName = fileNameWithPath;

                DataSet dsParam = new DataSet();
                dsParam = _dalProduct.GetPrimarySalesParameters(companyCode);
                //check column headers
                Hashtable hashExcelColumnsTable = new Hashtable();
                hashExcelColumnsTable.Add("ROW_NO", "");
                hashExcelColumnsTable.Add("MIS_CODE", "");
                hashExcelColumnsTable.Add("REGION_NAME", "");
                hashExcelColumnsTable.Add("USER_NAME", "");
                hashExcelColumnsTable.Add("EMPLOYEE_NAME", "");
                hashExcelColumnsTable.Add("POOL_CODE", "");
                for (int r = 0; r < dsParam.Tables[0].Rows.Count; r++)
                {
                    hashExcelColumnsTable.Add(dsParam.Tables[0].Rows[r]["Param_Column_Name"].ToString().ToUpper(), "");
                }
                if (_objExcelConverter.IsExcelColumnHeadrsAreCorrect(hashExcelColumnsTable, INWARD_EXCEL_SHEET_NAME, fileNameWithPath))
                {
                    string EXCEL_WHERE_QRY = string.Empty;
                    if (dsParam.Tables.Count > 0)
                    {
                        for (int r = 0; r < dsParam.Tables[0].Rows.Count; r++)
                        {
                            EXCEL_WHERE_QRY += "LEN(" + dsParam.Tables[0].Rows[r]["Param_Column_Name"].ToString() + ")>0";
                            if (r != Convert.ToInt32(dsParam.Tables[0].Rows.Count) - 1)
                            {
                                EXCEL_WHERE_QRY += " OR ";
                            }
                        }
                    }
                    string[] excelRetrieveColumns = new string[] { "*" };
                    dt = _objExcelConverter.ExcelToDataSet(excelRetrieveColumns, INWARD_EXCEL_SHEET_NAME, EXCEL_WHERE_QRY, fileNameWithPath, "");
                }
                else
                {
                    result = "ERROR:SOME COLUMNS ARE MISSING / SOME COLUMNS ARE ADDED IN THE EXCEL SHEET";
                }
                // dt = ConvertExcelToPrimarySalesValues(postedFile, companyCode);
                if (string.IsNullOrEmpty(result.ToString()))
                {
                    if (dt == null)
                    {
                        result = "ERROR:EMPLOYEE INFO NOT FOUND IN THE EXCEL SHEET";
                    }
                    else if (dt.Rows.Count == 0)
                    {
                        result = "ERROR:EMPLOYEE INFO NOT FOUND IN THE EXCEL SHEET";
                    }
                    else
                    {
                        StringBuilder errorResult = new StringBuilder();
                        dt.Columns.Add("Company_Code", typeof(String));
                        dt.Columns.Add("GUID", typeof(String));
                        dt.Columns.Add("Status", typeof(String));
                        dt.Columns.Add("Month", typeof(Int16));
                        dt.Columns.Add("Year", typeof(Int32));
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            dt.Rows[i]["Company_Code"] = companyCode;
                            dt.Rows[i]["GUID"] = guid.ToString();
                            dt.Rows[i]["Status"] = "PROCESSING";
                            dt.Rows[i]["Month"] = month;
                            dt.Rows[i]["Year"] = year;
                        }

                        ArrayList arHeader = new ArrayList();
                        arHeader.Add("ROW_NO");
                        arHeader.Add("MIS_CODE");
                        arHeader.Add("REGION_NAME");
                        arHeader.Add("USER_NAME");
                        arHeader.Add("EMPLOYEE_NAME");
                        arHeader.Add("POOL_CODE");

                        if (dsParam.Tables.Count > 0)
                        {
                            for (int r = 0; r < dsParam.Tables[0].Rows.Count; r++)
                            {
                                arHeader.Add(dsParam.Tables[0].Rows[r]["Param_Column_Name"].ToString().ToUpper());
                            }
                        }

                        if ((dt.Columns.Count - 5) == arHeader.Count)
                        {
                            for (int j = 0; j < dt.Columns.Count - 5; j++)
                            {
                                if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                                {
                                    errorResult.Append("ERROR: INVALID COLUMN NAME - " + dt.Columns[j].ToString());
                                }
                            }

                            for (int j = 6; j < dt.Columns.Count - 5; j++)
                            {
                                // if (!arHeader.Contains(dt.Columns[j].ToString().ToUpper()))
                                if (arHeader[j].ToString().ToUpper() != dt.Columns[j].ToString().ToUpper())
                                {
                                    errorResult.Append("ERROR: COLUMN ORDER HAS BEEN CHANGED - " + dt.Columns[j].ToString());
                                }
                            }
                            if (string.IsNullOrEmpty(errorResult.ToString()))
                            {
                                result = _dalProduct.PrimarySalesValuesBulkInsert(companyCode, dt, subDomain, dsParam.Tables[0]);
                                if (result == "SUCCESS")
                                {
                                    result = _dalProduct.PrimarySalesValuesInsertFromStagingToMaster(companyCode, guid, _productExcelTemplateFileName, uploadedBy,
                                                                    "PRIMARYSALESVALUES_UPLOAD", subDomain);
                                }
                                else
                                {
                                    result = "ERROR:Instructions are not followed.primary sales Bulk insert failed." + result;
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
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions are not followed." + ex.Message;
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("guid", guid);
                dicObj.Add("uploadedBy", uploadedBy);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }

        #endregion primary sales parameters excel upload
    }
}
