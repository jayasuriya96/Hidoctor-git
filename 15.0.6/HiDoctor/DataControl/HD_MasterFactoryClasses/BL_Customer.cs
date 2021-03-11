#region Using
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl;
using System.Data;
using System.Text;
using System;
using DataControl.Impl;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System.Web;
using MVCModels;
using HDQueueService;
using System.Configuration;
using MVCModels.HiDoctor_Master;
using Newtonsoft.Json;

#endregion Using

namespace DataControl
{
    public class BL_Customer : ICustomerMaster
    {
        #region Private Variable
        private CurrentInfo _objCurrentInfo;
        private DAL_Customer _objDALCustomer;
        private IExcelFactory _objXLFactory;
        private SPData _objSPData;
        private IConfigSettings _objIconfigsettings = null;
        private DAL_KYD _objDALKYD;
        private string _doctorExcelTemplateFileName = string.Empty;
        private const string TABLE_PREFIX = "HD";
        private const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";
        private const string EXCEL_SHEET_NAME = "CustomerMasterEntity";
        private const string EXCEL_REFER_SHEET_NAME = "SHEET1";
        private const string KEY_COL_NAME = "Region_Name";
        private string _customerCSVFileName = string.Empty;
        const string CUSTOMER_EXCEL_SHEET_NAME = "Table$";
        const string SUCCESS = "SUCCESS";
        //private string _queueAccountKey = ConfigurationManager.AppSettings["ServiceBusConnection"].ToString();
        //private string _topicName = ConfigurationManager.AppSettings["busDoctorMasterTopicName"].ToString();
        //private string _subscriptionName = ConfigurationManager.AppSettings["busDoctorMasterSubscriptionName"].ToString();

        #endregion Private Variable

        #region Private Methods
        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="Entity_Type"></param>
        /// <param name="dt"></param>
        private void WriteXLTemplate(string company_Code, DataSet ds, string fileName, string TableName)
        {
            _objXLFactory = new ExcelFactory();
            string[] hiddenColumnIndexes = new string[] { };
            string[] secretValues = new string[] { };
            DataTable dt = ds.Tables[TableName];
            string[] editableColumns = (from DataColumn x in dt.Columns
                                        where x.ColumnName != "Row_No"
                                        select x.ColumnName).ToArray();
            _objXLFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, fileName, ds, hiddenColumnIndexes, secretValues, false, editableColumns);
        }

        /// <summary>
        /// returns the Entity Type Full Name.
        /// </summary>
        /// <param name="entity_Type"></param>
        /// <returns></returns>
        private CUSTOMER_MASTER_ENTITY_TYPE GetEntityType(string entity_Type)
        {
            CUSTOMER_MASTER_ENTITY_TYPE entityType = CUSTOMER_MASTER_ENTITY_TYPE.DOCTOR;
            switch (entity_Type)
            {
                //For multi region Bulk Add
                case "D":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.DOCTOR;
                    break;
                case "C":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.CHEMIST;
                    break;
                case "S":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.STOCKIEST;
                    break;
                //For single Region bulk add
                case "DOCTOR":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.DOCTOR;
                    break;
                case "STOCKIEST":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.STOCKIEST;
                    break;
                case "CHEMIST":
                    entityType = CUSTOMER_MASTER_ENTITY_TYPE.CHEMIST;
                    break;
                default:
                    break;
            }
            return entityType;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="entity_Type"></param>
        /// <returns></returns>
        private DataSet GetCustomerMasterColumnsAsPivot(string company_Code, CUSTOMER_MASTER_ENTITY_TYPE entity_Type)
        {
            _objDALCustomer = new DAL_Customer();
            DataSet dsDoctorEntityFields = _objDALCustomer.GetCustomerMasterEntityAsPivot(company_Code,
                entity_Type, TABLE_PREFIX);

            return dsDoctorEntityFields;
        }

        /// <summary>
        /// Retrieves the customer master look up values.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="entity_Type"></param>
        /// <returns></returns>
        private string GetCustomerMasterLookupValues(string company_Code, CUSTOMER_MASTER_ENTITY_TYPE entity_Type)
        {
            StringBuilder fileName = new StringBuilder();

            // Retrieve the Customer Master Lookup values.
            DataSet dsCustomerMasterLookupValues = _objDALCustomer.GetCustomerMasterLookupValues(company_Code, entity_Type);

            if (dsCustomerMasterLookupValues != null && dsCustomerMasterLookupValues.Tables.Count > 0
                && dsCustomerMasterLookupValues.Tables[0].Rows != null && dsCustomerMasterLookupValues.Tables[0].Rows.Count > 0)
            {
                // Refer Sheet File Name.
                fileName.Append(entity_Type.ToString() + "_Reference_Sheet");
                fileName.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                fileName.Append("_");
                fileName.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                fileName.Append(".xls");

                // Rename the DataSet Table Name.
                dsCustomerMasterLookupValues.Tables[0].TableName = EXCEL_REFER_SHEET_NAME;

                DataTable dt = dsCustomerMasterLookupValues.Tables[EXCEL_REFER_SHEET_NAME];
                if (dt.Rows[0]["Category"].ToString() == "NA")
                {
                    dt.Columns.Remove("Category");
                }
                if (dt.Rows[0]["Speciality"].ToString() == "NA")
                {
                    dt.Columns.Remove("Speciality");
                }
                if (dt.Rows[0]["CustomerGroup"].ToString() == "NA")
                {
                    dt.Columns.Remove("CustomerGroup");
                }
                if (dt.Rows[0]["Depot"].ToString() == "NA")
                {
                    dt.Columns.Remove("Depot");
                }

                // Writes the XL Template.
                WriteXLTemplate(company_Code, dsCustomerMasterLookupValues, fileName.ToString(), EXCEL_REFER_SHEET_NAME);
            }

            fileName = (fileName.Length == 0 ? fileName.Append("NO REFERENCE SHEET FOUND") : fileName);
            return fileName.ToString();
        }

        /// <summary>
        /// Set default 10000 Rows inserted(Row No).
        /// </summary>
        /// <param name="ds"></param>
        /// <param name="dttableName"></param>
        private void SetRowNumbersinExcel(ref DataSet ds, string dttableName)
        {
            if (ds.Tables[dttableName].Rows != null && ds.Tables[dttableName].Rows.Count > 0)
            {
                ds.Tables[dttableName].Rows[0].Delete();
                ds.Tables[dttableName].Columns.Add("Region_Name", typeof(string));
                ds.Tables[dttableName].Columns.Add("Row_No", typeof(int));
                ds.Tables[dttableName].Columns["Row_No"].SetOrdinal(0);
                ds.Tables[dttableName].Columns["Region_Name"].SetOrdinal(1);
                ds.Tables[dttableName].AcceptChanges();
            }

            for (int rowNo = 1; rowNo <= 1000; rowNo++)
            {
                int rowIndex = rowNo - 1;
                DataRow row = ds.Tables[dttableName].NewRow();
                row["Row_No"] = rowNo;
                ds.Tables[dttableName].Rows.Add(row);
                //ds.Tables[dttableName].Rows[rowIndex]["Row_No"] = rowNo;
            }
        }

        /// <summary>
        /// Converts the Excel file to DataTable.
        /// </summary>
        /// <param name="postedFile"></param>
        /// <returns></return
        private DataTable ConvertExcelToDataTable(System.Web.HttpPostedFileBase postedFile, CUSTOMER_MASTER_ENTITY_TYPE entity_Type, string company_Code)
        {
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();

            string fileName = postedFile.FileName;
            StringBuilder strColumns = new StringBuilder();
            strColumns.Append("Row_No,Region_Name,");

            // string[] excelRetrieveColumns = new string[] { "*" };

            DataSet ds = GetCustomerMasterColumnsAsPivot(company_Code, entity_Type);
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {

                ds.Tables[0].TableName = "CustomerMasterEntity";
                DataColumnCollection CustomerMasterEntityColumns = ds.Tables["CustomerMasterEntity"].Columns;
                foreach (DataColumn column in CustomerMasterEntityColumns)
                {
                    strColumns.Append("[" + column.ColumnName + "]" + ",");
                }
            }

            string[] excelRetrieveColumns = new string[] { strColumns.ToString().TrimEnd(',') };


            _doctorExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            string whereQuery = " LEN(Region_Name) >0 ";
            postedFile.SaveAs(_doctorExcelTemplateFileName);
            DataTable dt = excelFactory.ExcelToDataSet(excelRetrieveColumns, entity_Type + "$", whereQuery, _doctorExcelTemplateFileName, KEY_COL_NAME);

            return dt;
        }

        /// <summary>
        /// Deleted the upload file.
        /// </summary>
        private void UploadedFileDelete()
        {
            if (System.IO.File.Exists(_doctorExcelTemplateFileName))
            {
                System.IO.File.Delete(_doctorExcelTemplateFileName);
            }
        }

        /// <summary>
        /// Added and Replace the column names.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="dt"></param>
        /// <returns></returns>
        private DataTable AddandRelplaceColumnNameToDataTable(string company_Code, DataTable dt, CUSTOMER_MASTER_ENTITY_TYPE entity_Type)
        {
            // Column names are replace as per Table Type.
            DataSet ds = GetCustomerMasterColumnsAsPivot(company_Code, entity_Type);
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                ds.Tables[0].TableName = "CustomerMasterEntity";
                DataColumnCollection CustomerMasterEntityColumns = ds.Tables["CustomerMasterEntity"].Columns;
                foreach (DataColumn col in CustomerMasterEntityColumns)
                {
                    if (dt.Columns.IndexOf(col.ColumnName) > -1)
                    {
                        dt.Columns[col.ColumnName].ColumnName = ds.Tables["CustomerMasterEntity"].Rows[0][col.ColumnName].ToString();
                    }
                    else
                    {
                        return null;
                    }
                }
            }


            // Added missing columns to DataTable.
            DataSet dsCustomerMasterColumns = _objDALCustomer.GetCustomerMasterColumns(company_Code);
            if (dsCustomerMasterColumns != null && dsCustomerMasterColumns.Tables != null && dsCustomerMasterColumns.Tables.Count > 0)
            {
                dsCustomerMasterColumns.Tables[0].TableName = "CustomerMaster";
                DataColumnCollection CustomerMasterColumns = dsCustomerMasterColumns.Tables["CustomerMaster"].Columns;
                foreach (DataColumn col in CustomerMasterColumns)
                {
                    if (dt.Columns.IndexOf(col.ColumnName) == -1)
                    {
                        dt.Columns.Add(col.ColumnName, typeof(string));
                    }
                }

                dt.Columns.Add("BP_ID", typeof(Guid));
                Guid NewId = Guid.NewGuid();
                for (int index = 0; index < dt.Rows.Count; index++)
                {
                    dt.Rows[index]["Company_Code"] = company_Code;
                    dt.Rows[index]["BP_ID"] = NewId;
                }
            }

            // Set Column Orders. 
            #region Set Column Orders

            int i = 0;
            dt.Columns["BP_ID"].SetOrdinal(i++);
            dt.Columns["Company_Code"].SetOrdinal(i++);
            dt.Columns["Customer_Code"].SetOrdinal(i++);
            dt.Columns["Row_No"].SetOrdinal(i++);
            dt.Columns["Customer_Name"].SetOrdinal(i++);
            dt.Columns["Region_Name"].SetOrdinal(i++);
            dt.Columns["Region_Type_Code"].SetOrdinal(i++);
            dt.Columns["Region_Code"].SetOrdinal(i++);
            dt.Columns["SubRegion_Code"].SetOrdinal(i++);
            dt.Columns["User_Code"].SetOrdinal(i++);
            dt.Columns["Category"].SetOrdinal(i++);
            dt.Columns["Speciality_Code"].SetOrdinal(i++);
            dt.Columns["Address1"].SetOrdinal(i++);
            dt.Columns["Address2"].SetOrdinal(i++);
            dt.Columns["Local_Area"].SetOrdinal(i++);
            dt.Columns["City"].SetOrdinal(i++);
            dt.Columns["Pin_Code"].SetOrdinal(i++);
            dt.Columns["Phone"].SetOrdinal(i++);
            dt.Columns["Mobile"].SetOrdinal(i++);
            dt.Columns["Fax"].SetOrdinal(i++);
            dt.Columns["Email"].SetOrdinal(i++);
            dt.Columns["Customer_Status"].SetOrdinal(i++);
            dt.Columns["DOB"].SetOrdinal(i++);
            dt.Columns["Anniversary_Date"].SetOrdinal(i++);
            dt.Columns["Reminder_Type"].SetOrdinal(i++);
            dt.Columns["Reminder_Period"].SetOrdinal(i++);
            dt.Columns["Primary_Contact"].SetOrdinal(i++);
            dt.Columns["Contact_Relation"].SetOrdinal(i++);
            dt.Columns["Primary_Email"].SetOrdinal(i++);
            dt.Columns["MDL_Number"].SetOrdinal(i++);
            dt.Columns["Qualification"].SetOrdinal(i++);
            dt.Columns["Created_By"].SetOrdinal(i++);
            dt.Columns["Created_Date"].SetOrdinal(i++);
            dt.Columns["Row_Status"].SetOrdinal(i++);
            dt.Columns["Effective_From"].SetOrdinal(i++);
            dt.Columns["Effective_To"].SetOrdinal(i++);
            dt.Columns["Approved_By"].SetOrdinal(i++);
            dt.Columns["Approved_Date"].SetOrdinal(i++);
            dt.Columns["Is_Inherited"].SetOrdinal(i++);
            dt.Columns["Remarks"].SetOrdinal(i++);
            dt.Columns["Applied_Date"].SetOrdinal(i++);
            dt.Columns["Applied_By"].SetOrdinal(i++);
            dt.Columns["Unapproved_Date"].SetOrdinal(i++);
            dt.Columns["Unapproved_By"].SetOrdinal(i++);
            dt.Columns["Cycle_Code"].SetOrdinal(i++);
            dt.Columns["Depot_Code"].SetOrdinal(i++);
            dt.Columns["Price_Region_Code"].SetOrdinal(i++);
            dt.Columns["Customer_Group"].SetOrdinal(i++);
            dt.Columns["Drug_License_Number1"].SetOrdinal(i++);
            dt.Columns["Drug_License_Number2"].SetOrdinal(i++);
            dt.Columns["Product_Discount_Applicable_Status"].SetOrdinal(i++);
            dt.Columns["Special_Discount_Rate"].SetOrdinal(i++);
            dt.Columns["Octroi_Rate"].SetOrdinal(i++);
            dt.Columns["TOT_Value"].SetOrdinal(i++);
            dt.Columns["Octroi_Reimbursment_Status"].SetOrdinal(i++);
            dt.Columns["Place_Type"].SetOrdinal(i++);
            dt.Columns["Registered_Delear_Status"].SetOrdinal(i++);
            dt.Columns["Tax_Exempted_Status"].SetOrdinal(i++);
            dt.Columns["Party_Location"].SetOrdinal(i++);
            dt.Columns["Additional_Surcharge_Status"].SetOrdinal(i++);
            dt.Columns["Tin_Number"].SetOrdinal(i++);
            dt.Columns["CST_Number"].SetOrdinal(i++);
            dt.Columns["Dispatch_Date"].SetOrdinal(i++);
            dt.Columns["Debit_Balance"].SetOrdinal(i++);
            dt.Columns["Credit_Balance"].SetOrdinal(i++);
            dt.Columns["Last_Bill_Date"].SetOrdinal(i++);
            dt.Columns["Sales_Tax_Registration_Number"].SetOrdinal(i++);
            dt.Columns["Destination_Place"].SetOrdinal(i++);
            dt.Columns["Locked"].SetOrdinal(i++);
            dt.Columns["CForm_Availability"].SetOrdinal(i++);
            dt.Columns["Privilege_Value"].SetOrdinal(i++);
            dt.Columns["Record_Status"].SetOrdinal(i++);
            dt.Columns["Sync_Made"].SetOrdinal(i++);
            dt.Columns["Sync_Up_Status"].SetOrdinal(i++);
            dt.Columns["Sync_Down_Status"].SetOrdinal(i++);
            dt.Columns["Sync_Date"].SetOrdinal(i++);
            dt.Columns["CST_Applicable"].SetOrdinal(i++);
            dt.Columns["Customer_Entity_Type"].SetOrdinal(i++);
            dt.Columns["Reference_Customer_Code"].SetOrdinal(i++);
            dt.Columns["Is_Billable"].SetOrdinal(i++);
            dt.Columns["Ref_Key1"].SetOrdinal(i++);
            dt.Columns["Ref_Key2"].SetOrdinal(i++);
            dt.Columns["Registration_Number"].SetOrdinal(i++);
            dt.Columns["Row_Version_No"].SetOrdinal(i++);
            dt.Columns["Number_Of_Visit"].SetOrdinal(i++);
            dt.Columns["Is_Billing_Customer"].SetOrdinal(i++);
            dt.Columns["Hospital_Name"].SetOrdinal(i++);
            dt.Columns["Hospital_Classification"].SetOrdinal(i++);
            dt.Columns["Registration_No"].SetOrdinal(i++);
            dt.Columns["Source_Region"].SetOrdinal(i++);
            dt.Columns["Move_Type"].SetOrdinal(i++);
            dt.Columns["Moved_By"].SetOrdinal(i++);
            dt.Columns["Moved_On"].SetOrdinal(i++);
            dt.Columns["Latitude"].SetOrdinal(i++);
            dt.Columns["Longitude"].SetOrdinal(i++);
            dt.Columns["Gender"].SetOrdinal(i++);

            #endregion Set Column Orders

            return dt;
        }
        #endregion Private Methods

        /// <summary>
        /// Prepare Doctor XL File.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetCustomerMasterXLTemplate(string company_Code, string entity_Type)
        {
            StringBuilder fileName = new StringBuilder();
            CUSTOMER_MASTER_ENTITY_TYPE entity_Type_Name = GetEntityType(entity_Type);
            fileName.Append(GetEntityType(entity_Type) + "_UPLOAD");
            fileName.Append(DateTime.Now.ToString("dd-MM-yyyy"));
            fileName.Append("_");
            fileName.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
            fileName.Append(".xls");
            _doctorExcelTemplateFileName = fileName.ToString();
            _objDALCustomer = new DAL_Customer();

            DataSet dsDoctorEntityFields = GetCustomerMasterColumnsAsPivot(company_Code, entity_Type_Name);

            if (dsDoctorEntityFields != null && dsDoctorEntityFields.Tables != null && dsDoctorEntityFields.Tables.Count > 0)
            {
                dsDoctorEntityFields.Tables["Table"].TableName = entity_Type_Name.ToString();
                SetRowNumbersinExcel(ref dsDoctorEntityFields, entity_Type_Name.ToString());
            }

            // Writes the Doctor or Chemist or Stockiest Excel.
            WriteXLTemplate(company_Code, dsDoctorEntityFields, fileName.ToString(), entity_Type_Name.ToString());

            // Writes the refer sheet.
            string refer_Sheet_Filename = GetCustomerMasterLookupValues(company_Code, entity_Type_Name);

            // Append the Master Excel Sheet File Name and Refer Sheet FileName.
            return fileName.Append("^").Append(refer_Sheet_Filename).ToString();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="postedFile"></param>
        public string InsertCustomerMaster(string subDomain, string company_Code, System.Web.HttpPostedFileBase postedFile,
            string user_Code, string entity_type, string updatedBy)
        {
            try
            {
                _objDALCustomer = new DAL_Customer();
                CUSTOMER_MASTER_ENTITY_TYPE entity_Type_Name = GetEntityType(entity_type);
                // Check Empty excel and check Key columns. 
                DataTable dt = ConvertExcelToDataTable(postedFile, entity_Type_Name, company_Code);
                if (dt == null)
                {
                    UploadedFileDelete();
                    return "0";
                }
                // Read the Hidden Values.

                // Check Columns are correct
                dt = AddandRelplaceColumnNameToDataTable(company_Code, dt, entity_Type_Name);

                if (dt == null)
                {
                    UploadedFileDelete();
                    return "1";
                }

                Guid uniqueIdentifier = (Guid)dt.Rows[0]["BP_ID"];
                // Start the insertion into the Database.
                Task task = Task.Factory.StartNew(() => _objDALCustomer.InsertDoctorMultiRegions(subDomain, company_Code,
                    uniqueIdentifier, dt, entity_Type_Name, user_Code, _doctorExcelTemplateFileName, entity_Type_Name.ToString() + "_UPLOAD", updatedBy));

                // Uploaded file delete.
                UploadedFileDelete();
                return "-1";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public string GetCustomerCSVTemplate(string companyCode, string entity)
        {
            try
            {
                DAL_Customer _dalCustomer = new DAL_Customer();
                StringBuilder fileName = new StringBuilder();
                fileName.Append(entity);
                fileName.Append(DateTime.Now.ToString("dd-MM-yyyy"));
                fileName.Append("_");
                fileName.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
                fileName.Append(".xls");
                _customerCSVFileName = fileName.ToString();
                //_objDALCustomer = new DAL_Customer();

                DataSet dsCustomerFields = _dalCustomer.GetCustomerEntityColumns(companyCode, entity, "HD");
                //dsCustomerFields.Tables[0].Rows.Clear();
                for (int i = 0; i < dsCustomerFields.Tables[0].Columns.Count; i++)
                {
                    dsCustomerFields.Tables[0].Rows[0][i] = string.Empty;
                    dsCustomerFields.AcceptChanges();
                }
                if (dsCustomerFields != null && dsCustomerFields.Tables != null && dsCustomerFields.Tables.Count > 0)
                {
                    // ExcelConverter _objExcelConverter = new ExcelConverter();
                    DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                    string path = fileProvider.GetOnlyFilePath(DOWNLOAD_PATH_KEY_NAME);
                    IExcelFactory _objExcelFactory = null;
                    _objExcelFactory = new ExcelFactory();
                    // _objExcelFactory.WriteCsv(dsCustomerFields.Tables[0], path + _customerCSVFileName);
                    //Abstraction.IFileProvider objFilePro = new FileSystemProvider();
                    //string accounKey = objFilePro.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                    //_objExcelFactory.WriteCsvIntoBlob(dsCustomerFields.Tables[0], accounKey, _customerCSVFileName);


                    if (dsCustomerFields.Tables[0].Columns.Count > 0)
                    {
                        _objExcelFactory.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _customerCSVFileName.ToString(), dsCustomerFields, new string[] { }, new string[] { },
                            false, new string[] { });
                    }
                    else
                    {
                        _customerCSVFileName = string.Empty;
                        _customerCSVFileName = "NO DATA";
                    }
                }
                else
                {
                    _customerCSVFileName = string.Empty;
                    _customerCSVFileName = "NO DATA";
                }
                return _customerCSVFileName.ToString();
            }
            catch
            {
                _customerCSVFileName = string.Empty;
                _customerCSVFileName = "NO DATA";
                return _customerCSVFileName;
            }

        }

        public object GetCustomerExcelToDataTable(HttpPostedFileBase postedFile, string entity, string companyCode)
        {
            DataTable dt = new DataTable();
            try
            {
                DAL_Customer _dalCustomer = new DAL_Customer();
                IExcelFactory _objExcelConverter = null;
                _objExcelConverter = new ExcelFactory();

                DataControl.Abstraction.IFileProvider fileProvider = new DataControl.Impl.FileSystemProvider();
                string path = fileProvider.GetOnlyFilePath("ExcelUploadPath");
                string fileNameWithPath = Path.Combine(path, postedFile.FileName);
                postedFile.SaveAs(fileNameWithPath);

                DataSet dsCustomerFields = _dalCustomer.GetCustomerEntityColumns(companyCode, entity, "HD");
                //check column headers
                Hashtable hashExcelColumnsTable = new Hashtable();

                for (int r = 0; r < dsCustomerFields.Tables[0].Columns.Count; r++)
                {
                    hashExcelColumnsTable.Add(dsCustomerFields.Tables[0].Columns[r].ToString().ToUpper(), "");
                }
                if (_objExcelConverter.IsExcelColumnHeadrsAreCorrect(hashExcelColumnsTable, CUSTOMER_EXCEL_SHEET_NAME, fileNameWithPath))
                {
                    string[] excelRetrieveColumns = new string[] { "*" };
                    dt = _objExcelConverter.ExcelToDataSet(excelRetrieveColumns, CUSTOMER_EXCEL_SHEET_NAME, "", fileNameWithPath, "");
                    CUSTOMER_MASTER_ENTITY_TYPE entity_Type_Name = GetEntityType(entity);
                    // dt = AddandRelplaceColumnNameToDataTable(companyCode, dt, entity_Type_Name);

                    DataSet ds = GetCustomerMasterColumnsAsPivot(companyCode, entity_Type_Name);
                    if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
                    {
                        ds.Tables[0].TableName = "CustomerMasterEntity";
                        DataColumnCollection CustomerMasterEntityColumns = ds.Tables["CustomerMasterEntity"].Columns;
                        foreach (DataColumn col in CustomerMasterEntityColumns)
                        {
                            if (dt.Columns.IndexOf(col.ColumnName) > -1)
                            {
                                dt.Columns[col.ColumnName].ColumnName = ds.Tables["CustomerMasterEntity"].Rows[0][col.ColumnName].ToString();
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }

                    if (dt == null)
                    {
                        return "No " + entity + " details found in the Excel sheet~";
                    }
                }
                else
                {
                    return "Some columns are added/Modified/Removed from the Excel sheet~";
                }
            }
            catch (Exception ex)
            {
                return ex.Message.ToString() + "~";
            }
            return dt;
        }

        // get All stockist in the region and its child region
        public List<MVCModels.HiDoctor_Master.CustomerModel> GetStockistWithRegion(string companyCode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetStockistWithRegion(companyCode, regionCode);
        }

        // Insert Stockist Pool Allocation
        public string InsertStockistPoolAllocation(string companyCode, string stockist, string product, string territory, string effFrom, string effTo, int status, string stockID, string baseRegion, string createdBy)
        {
            string result = string.Empty;
            string[] productArr;
            string[] stockistArr;
            string[] territoryArr;
            string createdDate = DateTime.Now.ToString();
            int maxID = 1;
            _objDALCustomer = new DAL_Customer();

            stockist = stockist.TrimEnd('^');
            product = product.TrimEnd('^');
            territory = territory.TrimEnd('~');

            stockistArr = stockist.Split('^');
            productArr = product.Split('^');
            territoryArr = territory.Split('~');


            DataTable dt = new DataTable();
            DataTable dtt = new DataTable();

            dt.Columns.Add("Company_Code", typeof(string));
            dt.Columns.Add("Stockist_Share_Code", typeof(int));
            dt.Columns.Add("Stockist_Code", typeof(string));
            dt.Columns.Add("Stockist_Region_Code", typeof(string));
            dt.Columns.Add("Product_Code", typeof(string));
            dt.Columns.Add("Effective_From", typeof(string));
            dt.Columns.Add("Effective_To", typeof(string));
            dt.Columns.Add("Record_Status", typeof(int));
            dt.Columns.Add("Base_Region", typeof(string));
            dt.Columns.Add("Created_By", typeof(string));
            dt.Columns.Add("Created_Date", typeof(string));


            int[] headerIdArr = new int[stockistArr.Length * productArr.Length];
            int index = 0;
            if (stockID == "")
            {
                maxID = _objDALCustomer.GetMaxIdOfStockiatPoolAllocation(companyCode);
                maxID++;

                if (stockistArr.Length > 0 && productArr.Length > 0)
                {
                    foreach (var stock in stockistArr)
                    {
                        foreach (var prod in productArr)
                        {
                            DataRow dr = dt.NewRow();
                            dr["Company_Code"] = companyCode;
                            dr["Stockist_Share_Code"] = maxID;
                            dr["Stockist_Code"] = stock.Split('_')[0];
                            dr["Stockist_Region_Code"] = stock.Split('_')[1];
                            dr["Product_Code"] = prod;
                            dr["Effective_From"] = effFrom;
                            dr["Effective_To"] = effTo;
                            dr["Record_Status"] = status;
                            dr["Base_Region"] = baseRegion;
                            dr["Created_By"] = createdBy;
                            dr["Created_Date"] = createdDate;

                            headerIdArr[index] = maxID;
                            dt.Rows.Add(dr);
                            maxID++;
                            index++;
                        }
                    }
                    result = SUCCESS;
                }
            }
            else
            {
                // delete header and detail record
                result = _objDALCustomer.DeleteStockistPoolAllocation(companyCode, Convert.ToInt32(stockID));

                if (result == SUCCESS)
                {
                    DataRow dr = dt.NewRow();
                    dr["Company_Code"] = companyCode;
                    dr["Stockist_Share_Code"] = Convert.ToInt32(stockID);
                    dr["Stockist_Code"] = stockistArr[0].Split('_')[0];
                    dr["Stockist_Region_Code"] = stockistArr[0].Split('_')[1];
                    dr["Product_Code"] = productArr[0];
                    dr["Effective_From"] = effFrom;
                    dr["Effective_To"] = effTo;
                    dr["Record_Status"] = status;
                    dr["Base_Region"] = baseRegion;
                    dr["Created_By"] = createdBy;
                    dr["Created_Date"] = createdDate;
                    headerIdArr[index] = Convert.ToInt32(stockID);
                    dt.Rows.Add(dr);
                }
            }

            if (result == SUCCESS)
            {
                result = _objDALCustomer.InsertStockistPoolAllocationHeader(companyCode, dt);
            }

            if (result == SUCCESS)
            {
                dtt.Columns.Add("Company_Code", typeof(string));
                dtt.Columns.Add("Stockist_Share_Code", typeof(int));
                dtt.Columns.Add("Stockist_Share_Detail_Code", typeof(int));
                dtt.Columns.Add("Region_Code", typeof(string));
                dtt.Columns.Add("Share_Percentage", typeof(decimal));
                dtt.Columns.Add("Division_Code", typeof(string));

                int detailId = 1;
                if (headerIdArr.Length > 0 && territoryArr.Length > 0)
                {
                    foreach (var id in headerIdArr)
                    {
                        detailId = 1;
                        foreach (var territoryDetails in territoryArr)
                        {
                            DataRow dr = dtt.NewRow();
                            dr["Company_Code"] = companyCode;
                            dr["Stockist_Share_Code"] = id;
                            dr["Stockist_Share_Detail_Code"] = detailId;
                            dr["Region_Code"] = territoryDetails.Split('^')[0];
                            dr["Share_Percentage"] = Convert.ToDecimal(territoryDetails.Split('^')[2]);
                            dr["Division_Code"] = ((territoryDetails.Split('^')[1] == "") ? null : territoryDetails.Split('^')[1]);
                            dtt.Rows.Add(dr);
                            detailId++;
                        }
                    }
                }

                result = _objDALCustomer.InsertStockistPoolAllocationDetail(companyCode, dtt);
            }
            return result;
        }

        public DataSet GetStockistPoolAllocationDetails(string companyCode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetStockistPoolAllocationDetails(companyCode, regionCode);
        }
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetDoctorsByRegionAndMode(string companyCode, string regionCode, string mode, string entity)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorsByRegionAndMode(companyCode, regionCode, mode, entity);
        }


        public string CustomerBulkApproval(string companyCode, string tblContent, string guid, string action, string entity, string updatedBy)
        {
            StringBuilder result = new StringBuilder();
            try
            {
                _objDALCustomer = new DAL_Customer();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataRow[] dr;
                dt = CustomerDataTable(companyCode, tblContent, guid);
                string entitycolumn = _objDALCustomer.GetEntityColumn(companyCode, entity);
                if (dt == null)
                {
                    result.Append("ERROR:");
                }
                else
                {
                    result.Append(_objDALCustomer.BulkCustomerApproval(companyCode, dt));
                    if ("SUCCESS" == result.ToString().ToUpper())
                    {
                        result.Clear();
                        if ((action.ToUpper() == "APPROVE" && entity.ToUpper() == "DOCTOR") || (action.ToUpper() == "APPROVE" && entity.ToUpper() == "CHEMIST"))
                        {

                            if (entity.ToUpper() == "CHEMIST" && entitycolumn.Trim() == "N")
                            {
                                result = new StringBuilder();
                                result.Append(_objDALCustomer.UpdateCustomerStatus(companyCode, guid, updatedBy));
                            }

                            else
                            {

                                //to check the duplicate applied mdl number check
                                var duplicateValues = from l in dt.AsEnumerable()
                                                      group l by l.Field<string>("MDL_Number") into g
                                                      let list = g.ToList()
                                                      select new { MDL_Number = g.Key, Count = list.Count };
                                //dt.AsEnumerable().GroupBy(row => row["MDL_Number"]).Where(group => group.Count() > 1).ToList();

                                if (duplicateValues.Count() > 0)
                                {
                                    var filtered = duplicateValues.AsEnumerable().Where(x => x.Count > 1).ToList();
                                    if (filtered.Count > 0)
                                    {
                                        result.Append("ERROR:");
                                        foreach (var d in filtered)
                                        {
                                            result.Append(d.MDL_Number + "~");
                                        }
                                    }
                                }

                                if (string.IsNullOrEmpty(result.ToString()))
                                {
                                    ds = _objDALCustomer.MDLNumberUniqueCheck(companyCode, guid, entity);
                                    if (ds != null)
                                    {
                                        if (ds.Tables[0].Rows.Count > 0)
                                        {
                                            result = new StringBuilder();
                                            result.Append("ERROR:");
                                            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                                            {
                                                dr = dt.Select("MDL_Number ='" + ds.Tables[0].Rows[i]["MDL_Number"].ToString() + "'");
                                                // dr = dt.AsEnumerable().Where("MDL_Number == " + ds.Tables[0].Rows[i]["MDL_Number"].ToString() + "").ToArray();
                                                if (dr.Length > 0)
                                                {
                                                    for (int j = 0; j < dr.Length; j++)
                                                    {
                                                        //result.Append(dr[j]["Customer_Name"].ToString() + "~");
                                                        result.Append(dr[j]["MDL_Number"].ToString() + "~");
                                                    }
                                                }
                                            }
                                            _objDALCustomer.DeleteCustomersfromStaging(companyCode, guid);
                                            return result.ToString();
                                        }
                                        else
                                        {
                                            result = new StringBuilder();
                                            result.Append(_objDALCustomer.UpdateCustomerStatus(companyCode, guid, updatedBy));
                                            if (result.ToString().ToUpper().Contains("SUCCESS"))
                                            {
                                                DoctorMasterQueue(companyCode, dt, "Approved", guid);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    _objDALCustomer.DeleteCustomersfromStaging(companyCode, guid);
                                    return result.ToString();
                                }


                            }
                        }
                        else
                        {
                            result = new StringBuilder();
                            result.Append(_objDALCustomer.UpdateCustomerStatus(companyCode, guid, updatedBy));
                            if (result.ToString().ToUpper().Contains("SUCCESS"))
                            {
                                DoctorMasterQueue(companyCode, dt, "UnApproved", guid);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.Clear();
                result.Append("ERROR:" + ex.Message);
            }
            return result.ToString();

        }

        private void DoctorMasterQueue(string companyCode, DataTable dt, string eventName, string guid)
        {
            try
            {

               // IQueueService<CustomerQueueModel> dcrHeaderQueue = new QueueService<CustomerQueueModel>(_queueAccountKey, _topicName, _subscriptionName);

                _objDALCustomer = new DAL_Customer();
                IEnumerable<ApprovedFailedDoctors> IlstCustomers = _objDALCustomer.GetApprovedFailedDoctors(guid);
                List<ApprovedFailedDoctors> lstApprovedFailedDoctors = new List<ApprovedFailedDoctors>();
                if (IlstCustomers != null)
                {
                    lstApprovedFailedDoctors = IlstCustomers.ToList();
                }

                //if (dcrHeaderQueue.Initialize())
                //{
                //    foreach (DataRow drs in dt.Rows)
                //    {
                //        List<CustomerQueueModel> dcrQueueList = new List<CustomerQueueModel>();
                //        List<ApprovedFailedDoctors> lstApprovedfailedDoctors = lstApprovedFailedDoctors.Where(d => d.CustomerCode == drs["Customer_Code"].ToString()).ToList();
                //        if (lstApprovedFailedDoctors == null || lstApprovedFailedDoctors.Count == 0)
                //        {
                //            CustomerQueueModel customerQueue = new CustomerQueueModel();
                //            customerQueue.Company_Code = drs["Company_Code"].ToString();
                //            customerQueue.Customer_Code = drs["Customer_Code"].ToString();
                //            customerQueue.Customer_Name = drs["Customer_Name"].ToString();
                //            customerQueue.Customer_Entity_Type = drs["Customer_Entity_Type"].ToString();
                //            customerQueue.Region_Code = drs["Region_Code"].ToString();
                //            customerQueue.MDL_Number = drs["MDL_Number"].ToString();
                //            customerQueue.Category = drs["Category"].ToString();
                //            customerQueue.Event = eventName;

                //            CustomerApprovalQueueTracker customerApprovalQueue = new CustomerApprovalQueueTracker();
                //            customerApprovalQueue.CompanyCode = companyCode;
                //            customerApprovalQueue.DoctorCode = customerQueue.Customer_Code;
                //            customerApprovalQueue.RegionCode = customerQueue.Region_Code;
                //            customerApprovalQueue.EventName = customerQueue.Event;
                //            customerApprovalQueue.ProcessStatus = 0;
                //            customerApprovalQueue.TopicName = _topicName;
                //            customerApprovalQueue.SubscriptionName = _subscriptionName;

                //            dcrQueueList.Add(customerQueue);
                //            customerApprovalQueue.JSONObject = JsonConvert.SerializeObject(dcrQueueList);

                //            int Id = _objDALCustomer.InsertDoctorMasterQueueTracker(companyCode, customerApprovalQueue);
                //            dcrQueueList[0].Id = Id;

                //            if (!dcrHeaderQueue.CreateQueueItem(dcrQueueList))
                //            {
                //                customerApprovalQueue.ProcessStatus = -1;
                //                customerApprovalQueue.Id = Id;
                //                customerApprovalQueue.Mesg = "Queue Failed.";
                //                customerApprovalQueue.StackTrace = "";
                //                _objDALCustomer.UpdateDoctorMasterQuqueTracker(companyCode, customerApprovalQueue);
                //            }
                //        }

                //    }

                //}


            }
            catch
            {

            }
        }

        public DataTable CustomerDataTable(string companyCode, string tblContent, string guid)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Company_Code", typeof(String));
            dt.Columns.Add("Customer_Code", typeof(String));
            dt.Columns.Add("Region_Code", typeof(String));
            dt.Columns.Add("Customer_Entity_Type", typeof(String));
            dt.Columns.Add("MDL_Number", typeof(String));
            dt.Columns.Add("Customer_Status", typeof(String));
            dt.Columns.Add("BP_ID", typeof(Guid));
            dt.Columns.Add("Row_No", typeof(Int32));
            dt.Columns.Add("Customer_Name", typeof(String));
            dt.Columns.Add("Category", typeof(String));
            string[] rowArr;
            rowArr = tblContent.Split('~');
            for (int i = 0; i < rowArr.Length - 1; i++)
            {
                string[] columnArr;
                columnArr = rowArr[i].Split('^');
                DataRow dr = dt.NewRow();
                dr[0] = companyCode;
                dr[1] = columnArr[0];
                dr[2] = columnArr[1];
                dr[3] = columnArr[2];
                dr[4] = columnArr[3];
                dr[5] = columnArr[4];
                dr[6] = guid.ToString();
                dr[7] = Convert.ToInt32(i) + 1;
                dr[8] = columnArr[5];
                dr[9] = columnArr[6];
                dt.Rows.Add(dr);
            }
            return dt;
        }
        public DataSet GetCustomerRegions(string companyCode, string customerStatus, string entity)
        {
            _objDALCustomer = new DAL_Customer();
            DataSet ds = new DataSet();
            ds = _objDALCustomer.GetCustomerRegions(companyCode, customerStatus, entity);
            return ds;
        }
        public List<MVCModels.HiDoctor_Reports.Customer360Model> GetCustomer360Details(string companyCode, string userCode, string doctorCode, string mode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomer360Details(companyCode, userCode, doctorCode, mode, regionCode);
        }

        public List<MVCModels.HiDoctor_Master.RegionModel> GetCustomerRegions(string companyCode, string customerCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomerRegions(companyCode, customerCode);
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersForDoctor360(string companyCode, string userCode, string doctorCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetChildUsersForDoctor360(companyCode, userCode, doctorCode);
        }



        public List<MVCModels.HiDoctor_Master.DoctorModel> GetApprovedDoctorsByRegion(string companyCode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetApprovedDoctorsByRegion(companyCode, regionCode);
        }

        public List<MVCModels.HiDoctor_Master.DoctorCategoryModel> GetDoctorCategory(string companyCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorCategory(companyCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DoctorAutoFillModel> GetDoctorByUser(string companyCode, string userCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorByUser(companyCode, userCode);
        }
        public DataSet GetCustomersforPrimarySales(string company_Code)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomersforPrimarySales(company_Code);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomersByRegionAndEntity(string companyCode, string regionCode, string entity)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomersByRegionAndEntity(companyCode, regionCode, entity);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomersByPriceGroupCode(string companyCode, string regionCode,
            string priceGroupCode, string entity)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomersByPriceGroupCode(companyCode, regionCode, priceGroupCode, entity);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetCustomerHistory(string companyCode, string customerCode, string regionCode, string entity)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetCustomerHistory(companyCode, customerCode, regionCode, entity);
        }
        /// <summary>
        /// Get Doctor Category list by selected Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorCategoryModel> GetDoctorCategorybySelectedRegion(string companyCode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorCategorybySelectedRegion(companyCode, regionCode);
        }
        public DataSet GetDoctorUnapproveStatus(string customer_Code, string region_Code)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorUnapproveStatus(customer_Code, region_Code);
        }

        public List<MVCModels.HiDoctor_Master.UserModel> EmployeeDetails(string companycode, string user_Code)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.EmployeeDetails(companycode, user_Code);
        }
        #region configsettingsvalue

        /// <summary>
        /// Retrievs the  Duplicate Key Column value
        /// Default value is : Registration_No
        /// Possible Values: Registration_No, Mobile.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetDoctorDuplicateKeyColumnValue(string company_Code)
        {
            _objIconfigsettings = new Config_Settings();
            return _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.KYD, CONFIG_KEY.DOCTOR_DUPLICATE_KEY_CHECK_COLUMN);
        }

        /// <summary>
        /// Retrievs the KYD Mandatory Columns.
        /// Default Value: Registration_No
        /// /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetDoctorMandatoryColumns(string company_Code)
        {
            _objIconfigsettings = new Config_Settings();
            return _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.CUSTOMER, CONFIG_KEY.DOCTOR_MASTER_MANDATORY_COLUMNS);
        }
        public string GetChemistMandatoryColumns(string company_Code)
        {
            _objIconfigsettings = new Config_Settings();
            return _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.CUSTOMER, CONFIG_KEY.CHEMIST_MASTER_MANDATORY_COLUMNS);
        }
        /// <summary>
        /// Used to get all config values for customer master
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.ConfigvaluesModel> GetConfigvalues(string companyCode, string Entity)
        {
            _objIconfigsettings = new Config_Settings();
            string configvalueforMandatorycolumn = string.Empty;
            MVCModels.ConfigvaluesModel objconfig = new MVCModels.ConfigvaluesModel();
            List<MVCModels.ConfigvaluesModel> lstconfigvalues = new List<MVCModels.ConfigvaluesModel>();
            try
            {
                //Retrive Doctor_Duplicate check values
                string configvalueforDuplicatecheck = GetDoctorDuplicateKeyColumnValue(companyCode);

                //Retrive config value for Mandatory columns
                if (Entity == "DOCTOR")
                {
                    configvalueforMandatorycolumn = GetDoctorMandatoryColumns(companyCode);
                    string[] mandatorycheckcolumn = configvalueforMandatorycolumn.Split(',');
                    objconfig.Config_MandatoryColumns = configvalueforMandatorycolumn;
                }
                if (Entity == "CHEMIST")
                {
                    configvalueforMandatorycolumn = GetChemistMandatoryColumns(companyCode);
                    string[] mandatorycheckcolumn = configvalueforMandatorycolumn.Split(',');
                    objconfig.Config_MandatoryColumns = configvalueforMandatorycolumn;
                }
                //if (mandatorycheckcolumn != null && mandatorycheckcolumn.Length > 0)
                //{
                //    for (int i = 0; i < mandatorycheckcolumn.Length; i++)
                //    {
                //        mandatorycheckcolumn[i] = mandatorycheckcolumn[i].Trim();

                //    }

                //    if (!string.IsNullOrEmpty(configvalueforDuplicatecheck))
                //    {
                //        if (Array.IndexOf(mandatorycheckcolumn, configvalueforDuplicatecheck) == -1)
                //        {
                //            configvalueforMandatorycolumn = configvalueforMandatorycolumn + "," + configvalueforDuplicatecheck;
                //        }
                //    }
                //}

                objconfig.Config_DuplicatecheckColumn = configvalueforDuplicatecheck;
                //    objconfig.Config_MandatoryColumns = configvalueforMandatorycolumn;
                lstconfigvalues.Add(objconfig);
                return lstconfigvalues;
            }
            catch
            {
                throw;
            }
        }
        #endregion configsettingsvalue

        #region - Doctor Qucik View
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
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorQucikViewDetails(companyCode, regionCode, specialityName, doctorName, mdlNo1, mdlNo2, mdlCheck, pageNo, pageSize, ref totalPageCount, searchName, sessionRegionCode);
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
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorDetailsbyDoctorCode(companyCode, regionCode, doctorCode);
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
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorProductMappingDetails(companyCode, regionCode, doctorCode);
        }
        /// <summary>
        /// Get User Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> GetUserTypes(string companyCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetUserTypes(companyCode);
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
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorVisitDeatils(companyCode, regionCode, doctorCode);
        }
        public List<DoctorVisitRegionTypeModel> GetDoctorVisitDetailsRegionTypeWise(string Doctor_Code)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.GetDoctorVisitDetailsRegionTypeWise(Doctor_Code);
        }
        /// <summary>
        /// Get speciality
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorQucikViewSpecialityModel> Getspeciality(string companyCode)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.Getspeciality(companyCode);
        }
        #endregion - Doctor Quick View
        #region DoctorWorkArea
        public DoctorWorkAreaDetails GetDoctorWorkAreaDetails(string companyCode, string regionCode)
        {
            _objDALCustomer = new DAL_Customer();
            DoctorWorkAreaDetails objdocWorkArea = _objDALCustomer.GetDoctorWorkAreaDetails(companyCode, regionCode);
            List<string> lsWorkArea = objdocWorkArea.lsDoctorWorkArea.Select(x => x.Doctor_Place).Distinct().ToList();
            List<DoctorWorkArea> lsDoctorWorkArea = new List<DoctorWorkArea>();
            foreach (var item in lsWorkArea)
            {
                lsDoctorWorkArea.Add(
                    new DoctorWorkArea
                    {
                        label = item,
                        value = item
                    });
            }
            objdocWorkArea.lsDoctorPlace = lsDoctorWorkArea;
            lsDoctorWorkArea = new List<DoctorWorkArea>();
            List<string> lsWorkcategory = objdocWorkArea.lsDoctorWorkArea.Select(x => x.Workcategory).Distinct().ToList();
            foreach (var item in lsWorkcategory)
            {
                lsDoctorWorkArea.Add(
                    new DoctorWorkArea
                    {
                        label = item,
                        value = item
                    });
            }
            objdocWorkArea.lsWorkcategory = lsDoctorWorkArea;
            foreach (var item in objdocWorkArea.lsDoctorDetails.Where(x => x.Status == "0"))
            {
                item.Workcategory = "";
                item.Local_Area = "";
            }
            return objdocWorkArea;
        }
        public string SaveDoctorPlaceDetails(List<DoctorModel> lsDoctorPlace, string companyCode, int compnay_Id, string current_UserCode, int action)
        {
            _objDALCustomer = new DAL_Customer();
            return _objDALCustomer.SaveDoctorPlaceDetails(lsDoctorPlace, companyCode, compnay_Id, current_UserCode, action);
        }
        #endregion
    }
}
