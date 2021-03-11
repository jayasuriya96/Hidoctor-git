using DataControl;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.Web.Mvc;
using System.Data;
using System.Collections.Generic;
using System;
using System.Text;
using HiDoctor_Activity.Models;
using System.Web;
using System.Linq;
using System.IO;
using System.Data.OleDb;
using MVCModels;
using System.Threading.Tasks;
using System.Globalization;


namespace HiDoctor_Activity.Controllers
{
    public partial class PrimarySalesController : Controller
    {
        //
        // GET: /PrimarySales/
        #region Private Variables

        private CurrentInfo _objCurrentInfo = new CurrentInfo();
        BLPrimarySales Bl = new BLPrimarySales();
        DataSet Ds, Ds_Validate;
        DataTable Dt;
        string exceptions;
        // private IConfigSettings IConfig_Settings = new Config_Settings;
        List<PrimarySalesModel> ErrorList = new List<PrimarySalesModel>();
        private Config_Settings IConfig_Settings;

        #endregion Private Variables

        public ActionResult Index()
        {

            string companyCode = _objCurrentInfo.GetCompanyCode();
            IConfig_Settings = new Config_Settings();
            ViewBag.PS_filesize = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.PRIMARY_SALES,
                     CONFIG_KEY.MAX_FILE_SIZE_PS);
            return View();
        }
        public void DownloadPrimarySalesMasterExcelTemplate(string ddlValue)
        {
            string Monthname = ddlValue.Substring(0, ddlValue.IndexOf("-"));
            int Month = DateTime.ParseExact(Monthname, "MMM", new CultureInfo("en-US")).Month;
            string Yearnumber= ddlValue.Substring(ddlValue.IndexOf("-") + 1);
            int Year= Int32.Parse(Yearnumber);
            Ds = new DataSet();
            Ds = Bl.GetPrimarySalesMasterData("MASTER",Month,Year);
            Ds.Tables[0].TableName = "Region Details";
            Ds.Tables[1].TableName = "Customer Details";
            Ds.Tables[2].TableName = "Product Details";
            Ds.Tables[3].TableName = "Depot Details";
            Ds.Tables[4].TableName = "Document Type Details";
            HttpResponse response = System.Web.HttpContext.Current.Response;
            DownloadExcel excel = new DownloadExcel();
            excel.Convert(Ds, "Primary_Sales_Master_Data" + "_" + DateTime.Now.ToShortDateString(), response);
        }

        public void DownloadPrimarySalesExcelTemplate(string ddlValue)
        {
            try
            {
                string Monthname = ddlValue.Substring(0, ddlValue.IndexOf("-"));
                int Month = DateTime.ParseExact(Monthname, "MMM", new CultureInfo("en-US")).Month;
                string Yearnumber = ddlValue.Substring(ddlValue.IndexOf("-") + 1);
                int Year = Int32.Parse(Yearnumber);
                Ds = new DataSet();
                DataTable dtHelpContent = new DataTable();
                DataRow drLines;
                dtHelpContent.Columns.Add("Instructions");
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "1.Please Download the primary sales Master Data";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "2. Please Download the primary sales excel Template for upload";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "3.Do not enter above 500 characters in Excel sheet columns on upload template";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "4.Do not alter the excel file structure(i.e.adding or removing the column)";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "5.Do not rename the columns";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "6.Click the “Choose/Browse file” button to get the file";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "7.Click the upload button to upload the data";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "8.Please do not modify the Row_No column values";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "9.Please Enter document_Date in YYYY-MM-DD format";
                dtHelpContent.Rows.Add(drLines);
                drLines = dtHelpContent.NewRow();
                drLines["Instructions"] = "10.Please do not use WRAPTEXT/ALT+ENTER while enter the values. If you use then system will consider this as a special character.";
                dtHelpContent.Rows.Add(drLines);

                Ds = Bl.GetPrimarySalesMasterData("TEMP",Month,Year);
                Ds.Tables.Add(dtHelpContent);
                Ds.Tables[0].TableName = "Primary sales Header";
                //   Ds.Tables[1].TableName = "Primary sales Details";
                Ds.Tables[1].TableName = "Help";
                HttpResponse response = System.Web.HttpContext.Current.Response;
                DownloadExcel excel = new DownloadExcel();
                excel.Convert(Ds, "Primary_sales_upload_template" + "_" + DateTime.Now.ToShortDateString(), response);
            }
            finally
            {
                Ds.Dispose();
            }

        }
        public JsonResult GetDepots(FormCollection collection)
        {
            Dt = new DataTable();
            Dt = Bl.GetDepots();
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(Dt), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStockiest(FormCollection collection)
        {
            DataSet dsStockiest = new DataSet();
            dsStockiest = Bl.GetPrimarySalesStockiestData(collection["region"].ToString());
            List<StockiestModel> lstStockiestAuto = new List<StockiestModel>();

            if (dsStockiest.Tables[0].Rows.Count > 0)
            {
                DataTable dt = new DataTable();
                dt = dsStockiest.Tables[0];
                lstStockiestAuto = (from item in dt.AsEnumerable()
                                    select new Models.StockiestModel()
                                    {
                                        StockiestCode = item["Customer_Code"].ToString(),
                                        StockiestName = item["Customer_Name"].ToString()
                                    }).ToList<Models.StockiestModel>();
            }
            return Json(lstStockiestAuto, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRegion()
        {
            string currentMonth = DateTime.Now.Month.ToString();
            string currentYear = DateTime.Now.Year.ToString();
            int Month= Int32.Parse(currentMonth);
            int Year = Int32.Parse(currentYear);
            Dt = new DataTable();
            Dt = Bl.GetRegion("GETREGION",Month,Year);
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(Dt), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUploadSummary(FormCollection collection)
        {
            Dt = new DataTable();
            Dt = Bl.GetUploadSummary(collection["region"], collection["depot"], collection["customer"], collection["document_no"], collection["from"], collection["to"],collection["ProductCode"], collection["Mode"]);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return new LargeJsonResult() { Data = json.Serialize(Dt), MaxJsonLength = int.MaxValue };
        }



        [HttpPost]
        public JsonResult PrimarySalesUpload()
        {
            string Calendardata = Request["CalendarMonth"];
            string Type = Request["UploadType"];
            string Monthname = Calendardata.Substring(0, Calendardata.IndexOf("-"));
            int SelectedMonth = DateTime.ParseExact(Monthname, "MMM", new CultureInfo("en-US")).Month;
            string Yearnumber = Calendardata.Substring(Calendardata.IndexOf("-") + 1);
            int SelectedYear = Int32.Parse(Yearnumber);
            int UploadType = Int32.Parse(Type);
            HttpFileCollectionBase file = Request.Files;
            if (Request.Files.Count > 0 && Request.Files[0].FileName.EndsWith(".xls"))
            {
                try
                {
                    Ds = new DataSet();
                    Ds = ExcelImport.ImportExcelXML(Request.Files[0], true, false);

                    // return Json(size);
                    //DataSet dsMaster = new DataSet();
                    //dsMaster = Bl.GetPrimarySalesMasterData("MASTER_VALIDATE");
                    // Excel to temp table



                    //File Name Validation
                    //if (Ds_Validate.Tables[0].Rows.Count > 0)
                    //{
                    //    foreach (DataRow row_val in Ds_Validate.Tables[0].Rows)
                    //    {
                    //        //validating filename 
                    //        if (file.FileName.ToString() == row_val["Uploaded_file_name"].ToString()) //&&
                    //            return Json("FileExists");

                    //    }
                    //}

                    //Excel Row No check 


                    //Header sheet - column name Validation
                    var xlHDRColumnNames = Ds.Tables[0].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToArray<string>();
                    string[] HeaderColumns = new string[] { "Depot_Name","Region_Name","Region_Ref_Key",
                                                            "Stockiest_Name","Stockiest_Ref_Key","Document_Type_Name","Document_Number","Document_Date",
                                                                "Product_Name","Product_Ref_Key","Batch_Number","Net_Quantity","Free_Quantity","Net_Value","Excel_Row_No" };
                    bool ValidHdrColumns = false;
                    //if (xlHDRColumnNames.Any())
                    //{
                    //    ValidHdrColumns = xlHDRColumnNames.SequenceEqual(HeaderColumns);
                    //    if (!ValidHdrColumns)
                    //    {
                    //        return Json("HeaderInvalidColumns");
                    //    }
                    //}

                    for (int i = 0; i < xlHDRColumnNames.Length; i++)
                    {
                        for (int j = 0; j < HeaderColumns.Length; j++)
                        {
                            if (xlHDRColumnNames[i] == HeaderColumns[j])
                            {
                                ValidHdrColumns = true;
                            }
                        }
                    }
                    if (!ValidHdrColumns)
                    {
                        return Json("DetailsInvalidColumns");
                    }

                    foreach (DataRow row_xl in Ds.Tables[0].Rows)
                    {
                        DateTime dtFormat;
                        if ((!DateTime.TryParseExact(row_xl["Document_Date"].ToString().Trim(), "yyyy-MM-dd", new CultureInfo("en-GB"), DateTimeStyles.None, out dtFormat)))
                        {
                            
                            //DataFormatInvalid = true;
                            return Json("Please update Date format should be YYYY-MM-DD");
                        }
                        string docdate = row_xl["Document_Date"].ToString();
                        int docYear= Int32.Parse(docdate.Substring(0, docdate.IndexOf("-")));
                        string NameofMonth = DateTime.ParseExact(row_xl["Document_Date"].ToString(), "yyyy-MM-dd", null).ToString("MMMM");
                        int docMonth = DateTimeFormatInfo.CurrentInfo.MonthNames.ToList().IndexOf(NameofMonth) + 1;
                        if(docMonth!=SelectedMonth || docYear != SelectedYear)
                        {
                            return Json("Month and Year Of Document Date in Excel Should be Same as Selected Month and Year in dropdown");
                        }
                    }
                    //Details sheet - column name Validation
                    //var xlDTLColumnNames = Ds.Tables[1].Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToArray<string>();
                    //string[] DetailColumns = new string[] {"Region_Name", "Depot_Name", "Stockiest_Ref_Key1", "Document_Type",
                    //                                      "Document_Number","Document_Date","Transaction_Mode","Product_Name","Product_Ref_Key1",
                    //                                           "Batch_Number", "Sales_Quantity", "Free_Quantity", "Sales_Rate"};
                    //bool ValidDTLColumns = true;
                    //if (xlDTLColumnNames.Any())
                    //{
                    //    ValidDTLColumns = xlDTLColumnNames.SequenceEqual(DetailColumns);
                    //    if (!ValidDTLColumns)
                    //    {
                    //        return Json("DetailInvalidColumns");
                    //    }
                    //}

                    //asynchronous method call
                    string CompanyCode = _objCurrentInfo.GetCompanyCode();
                    string UserCode = _objCurrentInfo.GetUserCode();
                    string ConnectionString = _objCurrentInfo.GetConnectionString();
                    string SubDomain = _objCurrentInfo.GetSubDomain();
                    string strGuid = Guid.NewGuid().ToString();
                    Task task = Task.Factory.StartNew(() =>
                    {
                        if (PrimarySalesTempUpload(CompanyCode, Ds.Tables[0], UserCode, ConnectionString, strGuid) == true)
                        {
                            //   ProcessPrimarySalesUpload(Ds, Ds_Validate, dsMaster, file.FileName.ToString(), CompanyCode, UserCode, ConnectionString, SubDomain);
                            PrimarySalesValidation(CompanyCode, UserCode, strGuid, Request.Files[0].FileName.ToString(), ConnectionString,SelectedMonth,SelectedYear,UploadType);
                        }
                    });

                    return Json("Uploaded");

                }
                catch (Exception ex)
                {
                    return Json("Not Uploaded");
                }
                finally
                {
                    Ds.Dispose();
                    //Ds_Validate.Dispose();
                }
            }
            else
            {
                return Json("Invalid File");
            }
            //return Json("Not Uploaded");
        }

        public bool PrimarySalesTempUpload(string companyCode, DataTable dt, string UserCode, string ConnectionString, string strGuid)
        {

            return Bl.PrimarySalesTempUpload(companyCode, dt, UserCode, ConnectionString, strGuid);
        }

        public void PrimarySalesValidation(string companyCode, string UserCode, string BP_id, string fileName, string ConnectionString,int Month,int Year,int UploadType)
        {
            // string strGuid = Guid.NewGuid().ToString();
            Bl.InsertPrimarySalesBatchProcessingHeader(companyCode, BP_id, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR", UserCode, ConnectionString);
            Bl.PrimarySalesValidation(companyCode, UserCode, BP_id, fileName, ConnectionString,Month, Year, UploadType);
        }

        //public void ProcessPrimarySalesUpload(DataSet Ds, DataSet Ds_Validate, DataSet dsMaster, string fileName, string CompanyCode, string CurrUserCode, string ConnectionString, string SubDomain)
        //{
        //    bool Is_error = false;
        //    string strGuid = Guid.NewGuid().ToString();

        //    var hasDupHdr = Ds.Tables[0].AsEnumerable()
        //                   .GroupBy(row => new
        //                   {
        //                       Depot_Name = row.Field<string>("Depot_Name"),
        //                       Region_Name = row.Field<string>("Region_Name"),
        //                       Stockiest_Ref_Key1 = row.Field<string>("Stockiest_Ref_Key1"),
        //                       Document_number =row.Field<dynamic>("Document_number")
        //                   })
        //                   .Where (g => g.Count() > 1)
        //                   .Select(g => g.CopyToDataTable()).ToList();

        //    Ds.Tables[0].Columns.Add(("Region_Ref_Key1"), typeof(string));
        //    Ds.Tables[0].Columns.Add(("Depot_Ref_Key1"), typeof(string));

        //    if (hasDupHdr.Any())
        //    {
        //        ErrorList.Add(new PrimarySalesModel(CompanyCode, "", "", "HD_ERR_0394", ""));
        //        Is_error = true;
        //    }

        //    //check correct dataformat for header sheet - null values and invalid data type
        //    int idxEmptyRowIndex = 1;
        //    foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //    {
        //        DateTime dtFormat;

        //        if (row_xl.AreAllCellsEmpty() || String.IsNullOrWhiteSpace(row_xl["Region_Name"].ToString().Trim()) ||
        //                       String.IsNullOrWhiteSpace(row_xl["Depot_Name"].ToString().Trim()) ||
        //                       String.IsNullOrWhiteSpace(row_xl["Document_number"].ToString().Trim()) ||
        //                       String.IsNullOrWhiteSpace(row_xl["Stockiest_Ref_Key1"].ToString().Trim()) ||
        //                       String.IsNullOrWhiteSpace(row_xl["Document_Type"].ToString().Trim()))
        //        {
        //            //MandatoryFieldsEmpty = true;
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxEmptyRowIndex.ToString(), "HD_ERR_0404", ""));
        //            Is_error = true;
        //        }

        //        if (!row_xl.AreAllCellsEmpty())
        //        {
        //            if ((!DateTime.TryParseExact(row_xl["Document_Date"].ToString().Trim(), "dd/MM/yyyy", new CultureInfo("en-GB"), DateTimeStyles.None, out dtFormat)))
        //            {
        //                //DataFormatInvalid = true;
        //                ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxEmptyRowIndex.ToString(), "HD_ERR_0405", ""));
        //                Is_error = true;
        //            }
        //            else
        //            {
        //                DateTime myDate = DateTime.ParseExact(row_xl["Document_Date"].ToString(), "dd/MM/yyyy",
        //                    System.Globalization.CultureInfo.InvariantCulture);
        //                row_xl["Document_Date"] = myDate.ToString("yyyy/MM/dd");
        //            }

        //            if (!IsIntegerOrDecimal(row_xl["Gross_Amount"].ToString().Trim()) || (!IsIntegerOrDecimal(row_xl["Discount_Amount"].ToString().Trim())
        //                || (!IsIntegerOrDecimal(row_xl["Tax"].ToString().Trim())) || (!IsIntegerOrDecimal(row_xl["Net_Amount"].ToString().Trim()))))
        //            {
        //                ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxEmptyRowIndex.ToString(), "HD_ERR_0406", ""));
        //                Is_error = true;
        //            }
        //        }
        //        idxEmptyRowIndex++;
        //    }

        //check correct dataformat for detail sheet 
        //int idxDtlRows = 1;
        //foreach (DataRow row_xl in Ds.Tables[1].Rows)
        //{
        //    DateTime dtFormat;

        //    if (row_xl.AreAllCellsEmpty() || String.IsNullOrWhiteSpace(row_xl["Region_Name"].ToString().Trim()) ||
        //                   String.IsNullOrWhiteSpace(row_xl["Depot_Name"].ToString().Trim()) ||
        //                   String.IsNullOrWhiteSpace(row_xl["Document_number"].ToString().Trim()) ||
        //                   String.IsNullOrWhiteSpace(row_xl["Stockiest_Ref_Key1"].ToString().Trim()) ||
        //                   String.IsNullOrWhiteSpace(row_xl["Document_Type"].ToString().Trim()))
        //    {
        //        //MandatoryFieldsEmpty = true;
        //        ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxDtlRows.ToString(), "HD_ERR_0408", ""));
        //        Is_error = true;
        //    }

        //    if (!row_xl.AreAllCellsEmpty())
        //    {
        //        if ((!DateTime.TryParseExact(row_xl["Document_Date"].ToString().Trim(), "dd/MM/yyyy", new CultureInfo("en-GB"), DateTimeStyles.None, out dtFormat)))
        //        {
        //            //DataFormatInvalid = true;
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxDtlRows.ToString(), "HD_ERR_0409", ""));
        //            Is_error = true;
        //        }
        //        else
        //        {
        //            DateTime myDate = DateTime.ParseExact(row_xl["Document_Date"].ToString(), "dd/MM/yyyy",
        //                System.Globalization.CultureInfo.InvariantCulture);
        //            row_xl["Document_Date"] = myDate.ToString("yyyy/MM/dd");
        //        }
        //        //if (!IsInteger(row_xl["Sales_Quantity"].ToString().Trim()) || (!IsInteger(row_xl["Free_Quantity"].ToString().Trim())))
        //        //{
        //        //    ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxDtlRows.ToString(), "HD_ERR_0407", ""));
        //        //    Is_error = true;
        //        //}
        //        if (!IsIntegerOrDecimal(row_xl["Sales_Rate"].ToString().Trim()) || !IsIntegerOrDecimal(row_xl["Sales_Quantity"].ToString().Trim()) || (!IsIntegerOrDecimal(row_xl["Free_Quantity"].ToString().Trim())))
        //        {
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", idxDtlRows.ToString(), "HD_ERR_0440", ""));
        //            Is_error = true;
        //        }
        //    }
        //    idxDtlRows++;
        //}

        //if (Is_error)
        //{
        //    if (ErrorList.Count > 0)
        //    {
        //        Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR", CurrUserCode, ConnectionString);
        //        Bl.InsertPrimarySalesBatchProcessing(ErrorList, strGuid, ConnectionString);
        //        //return Json("Not Uploaded");
        //        return;
        //    }
        //}



        //Validating region with master
        //int iRowIndex = 1;
        //foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //{
        //    if (!row_xl.AreAllCellsEmpty())
        //    {
        //        bool prodExists = false;
        //        foreach (DataRow row_val in dsMaster.Tables[0].Rows)
        //        {
        //            if (row_xl["Region_Name"].ToString().Trim() == row_val["Region_Name"].ToString().Trim())
        //            {
        //                row_xl["Region_Ref_Key1"] = row_val["Region_Ref_Key1"].ToString().Trim();
        //                prodExists = true;
        //            }

        //        }

        //        if (!prodExists)
        //        {
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", iRowIndex.ToString(), "HD_ERR_0395",""));
        //            Is_error = true;
        //        }

        //        iRowIndex++;
        //    }
        //}

        //Validating stockiest with master
        //int jRowIndex = 1;
        //foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //{
        //    if (!row_xl.AreAllCellsEmpty())
        //    {
        //        bool prodExists = false;
        //        foreach (DataRow row_val in dsMaster.Tables[1].Rows)
        //        {
        //            if (row_xl["Stockiest_Ref_Key1"].ToString().Trim() == row_val["Stockiest_Ref_Key1"].ToString().Trim() &&
        //                row_xl["Region_Name"].ToString().Trim() == row_val["Region_Name"].ToString().Trim())
        //            {
        //                prodExists = true;
        //            }

        //        }
        //        if (!prodExists)
        //        {
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", jRowIndex.ToString(), "HD_ERR_0397",""));
        //            Is_error = true;
        //        }
        //        jRowIndex++;
        //    }
        //}

        //Validating depot with master
        //int dRowIndex = 1;
        //foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //{
        //    if (!row_xl.AreAllCellsEmpty())
        //    {
        //        bool prodExists = false;
        //        foreach (DataRow row_val in dsMaster.Tables[3].Rows)
        //        {
        //            if (row_xl["Depot_Name"].ToString().Trim() == row_val["Depot_Name"].ToString().Trim()
        //                && (row_xl["Region_Name"].ToString().Trim() == row_val["Region_Name"].ToString().Trim()))
        //            {
        //                row_xl["Depot_Ref_Key1"] = row_val["Depot_Ref_Key1"].ToString().Trim();
        //                prodExists = true;
        //            }

        //        }
        //        if (!prodExists)
        //        {
        //            ErrorList.Add(new PrimarySalesModel(CompanyCode, "", dRowIndex.ToString(), "HD_ERR_0396",""));
        //            Is_error = true;
        //        }
        //        dRowIndex++;
        //    }
        //}

        //Validating document type with master
        //        int dtRowIndex = 1;
        //        foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //        {
        //            if (!row_xl.AreAllCellsEmpty())
        //            {
        //                bool prodExists = false;
        //                foreach (DataRow row_val in dsMaster.Tables[4].Rows)
        //                {
        //                    if (row_xl["Document_Type"].ToString().Trim() == row_val["Document_Type"].ToString().Trim())
        //                    {
        //                        prodExists = true;
        //                    }

        //                }
        //                if (!prodExists)
        //                {
        //                    ErrorList.Add(new PrimarySalesModel(CompanyCode, "", dtRowIndex.ToString(), "HD_ERR_0398",""));
        //                    Is_error = true;
        //                }
        //                dtRowIndex++;
        //            }
        //        }


        //        if (Is_error)
        //        {
        //            Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR", CurrUserCode, ConnectionString);
        //            Bl.InsertPrimarySalesBatchProcessing(ErrorList, strGuid, ConnectionString);
        //        }
        //        else
        //        {
        //            //verify header value and detail values
        //            var qry1 = Ds.Tables[1].AsEnumerable().Select(a => new
        //            {
        //                Document_Number = a["Document_Number"].ToString().Trim(),
        //                Region_Name = a["Region_Name"].ToString().Trim(),
        //                Depot_Name = a["Depot_Name"].ToString().Trim(),
        //                Stockiest_Ref_Key1 = a["Stockiest_Ref_Key1"].ToString().Trim(),
        //                Document_Type = a["Document_Type"].ToString().Trim()
        //            });
        //            var qry2 = Ds.Tables[0].AsEnumerable().Select(b => new
        //            {
        //                Document_Number = b["Document_Number"].ToString().Trim(),
        //                Region_Name = b["Region_Name"].ToString().Trim(),
        //                Depot_Name = b["Depot_Name"].ToString().Trim(),
        //                Stockiest_Ref_Key1 = b["Stockiest_Ref_Key1"].ToString().Trim(),
        //                Document_Type = b["Document_Type"].ToString().Trim()
        //            });

        //            var exceptAB = qry1.Except(qry2);

        //            if (exceptAB.Any())
        //            {
        //                foreach (var item in exceptAB.ToList())
        //                {
        //                    ErrorList.Add(new PrimarySalesModel(CompanyCode, "", "", "HD_ERR_0399",""));
        //                    Is_error = true;
        //                }
        //            }
        //            if (Is_error)
        //            {
        //                Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR", CurrUserCode, ConnectionString);
        //                Bl.InsertPrimarySalesBatchProcessing(ErrorList, strGuid, ConnectionString);
        //                return;
        //            }

        //            //Validate for same document number, region, depot and stockiest
        //            int intSameRowExists = 1;
        //            foreach (DataRow row_xl in Ds.Tables[0].Rows)
        //            {
        //                if (!row_xl.AreAllCellsEmpty())
        //                {
        //                    bool sameRowExists = false;
        //                    foreach (DataRow row_val in Ds_Validate.Tables[0].Rows)
        //                    {
        //                        if (row_xl["Region_Name"].ToString().Trim() == row_val["Region_Name"].ToString().Trim() &&
        //                            row_xl["Depot_Name"].ToString().Trim() == row_val["Depot_Name"].ToString().Trim() &&
        //                            row_xl["Document_number"].ToString().Trim() == row_val["Document_number"].ToString().Trim() &&
        //                            row_xl["Stockiest_Ref_Key1"].ToString().Trim() == row_val["Stockiest_Ref_Key1"].ToString().Trim())
        //                        {
        //                            sameRowExists = true;
        //                        }

        //                    }
        //                    if (sameRowExists)
        //                    {
        //                        ErrorList.Add(new PrimarySalesModel(CompanyCode, "", intSameRowExists.ToString(), "HD_ERR_0403",""));
        //                        Is_error = true;
        //                    }
        //                    intSameRowExists++;
        //                }
        //            }

        //            //Validating product with master  
        //            int intProdRowIndex = 1;
        //            foreach (DataRow row_xl in Ds.Tables[1].Rows)
        //            {
        //                if (!row_xl.AreAllCellsEmpty())
        //                {
        //                    bool prodExists = false;
        //                    foreach (DataRow row_val in Ds_Validate.Tables[1].Rows)
        //                    {
        //                        if (row_xl["Product_Ref_Key1"].ToString().Trim() == row_val["Product_Ref_Key1"].ToString().Trim())
        //                        {
        //                            prodExists = true;
        //                        }

        //                    }
        //                    if (!prodExists)
        //                    {
        //                        ErrorList.Add(new PrimarySalesModel(CompanyCode, "", intProdRowIndex.ToString(), "HD_ERR_0400",""));
        //                        Is_error = true;
        //                    }
        //                    intProdRowIndex++;
        //                }

        //            }

        //            //validating Return available quantity
        //            if (Ds_Validate.Tables[2].Rows.Count > 0)
        //            {
        //                int intProdQntRowIndex = 1;
        //                foreach (DataRow row_xl in Ds.Tables[1].Rows)
        //                {
        //                    if (!row_xl.AreAllCellsEmpty())
        //                    {
        //                        if (row_xl["Document_Type"].ToString() != "INVOICE")
        //                        {
        //                            foreach (DataRow row_val in Ds_Validate.Tables[2].Rows)
        //                            {
        //                                if (row_xl["Region_Name"].ToString().Trim() == row_val["Region_Name"].ToString().Trim() &&
        //                                    row_xl["Depot_Name"].ToString().Trim() == row_val["Depot_Name"].ToString().Trim() &&
        //                                    row_xl["Stockiest_Ref_Key1"].ToString().Trim() == row_val["Stockiest_Ref_Key1"].ToString().Trim() &&
        //                                    row_xl["Document_Number"].ToString().Trim() == row_val["Document_Number"].ToString().Trim() &&
        //                                    row_xl["Product_Ref_Key1"].ToString().Trim() == row_val["Product_Ref_key1"].ToString().Trim() &&
        //                                    row_xl["Batch_Number"].ToString().Trim() == row_val["Batch_Number"].ToString().Trim() &&
        //                                    Convert.ToDecimal(row_xl["Sales_Quantity"].ToString().Trim()) > Convert.ToDecimal(row_val["Available_Quantity"].ToString().Trim()))
        //                                {
        //                                    ErrorList.Add(new PrimarySalesModel(CompanyCode, "", intProdQntRowIndex.ToString(), "HD_ERR_0401",""));
        //                                    Is_error = true;
        //                                }
        //                            }
        //                        }
        //                        intProdQntRowIndex++;
        //                    }
        //                }
        //            }


        //            if (Is_error)
        //            {
        //                if (ErrorList.Count > 0)
        //                {
        //                    Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR",CurrUserCode, ConnectionString);
        //                    Bl.InsertPrimarySalesBatchProcessing(ErrorList, strGuid, ConnectionString);
        //                    //return Json("Not Uploaded");
        //                }
        //            }
        //            else
        //            {
        //                string error = Bl.PrimarySaleBulkInsert(SubDomain, CompanyCode, CurrUserCode, fileName, Ds, "tbl_sfa_PrimarySales_Header", "tbl_sfa_PrimarySales_details");
        //                if (error == "Success")
        //                {
        //                    Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "SUCCESS", CurrUserCode, ConnectionString);
        //                }
        //                else
        //                {
        //                    Bl.InsertPrimarySalesBatchProcessingHeader(CompanyCode, strGuid, "PSU_UPLOAD", fileName, DateTime.Now.ToString(), "ERROR", CurrUserCode, ConnectionString);
        //                    ErrorList.Add(new PrimarySalesModel(CompanyCode, "", "", "HD_ERR_0402", error));
        //                    Bl.InsertPrimarySalesBatchProcessing(ErrorList, strGuid, ConnectionString);
        //                }

        //            }
        //        }
        //    }

        //    public bool IsIntegerOrDecimal(string sVal)
        //    {
        //        try
        //        {
        //            // must be numeric value
        //            double d = double.Parse(sVal);
        //            // max of two decimal places
        //            if (sVal.IndexOf(".") >= 0)
        //            {
        //                if (sVal.Length > sVal.IndexOf(".") + 3)
        //                {
        //                    return false;
        //                }
        //                if (d < 0)
        //                {
        //                    return false;
        //                }
        //            }
        //            else
        //            {
        //                if (d < 0)
        //                {
        //                    return false;
        //                }
        //            }
        //            return true;
        //        }
        //        catch
        //        {
        //            return false;
        //        }
        //    }


        //    public bool IsInteger(string sVal)
        //    {
        //        try
        //        {
        //            int num = int.Parse(sVal);

        //            if (num < 0)
        //            {
        //                return false;
        //            }


        //            return true;
        //        }
        //        catch
        //        {
        //            return false;
        //        }
        //    }

        //    public ActionResult BatchProcessing()
        //    {
        //        return View();
        //    }
        //}

        //extension method for datarow
        //    public static class DataExtensions
        //    {
        //        public static bool AreAllCellsEmpty(this DataRow row)
        //        {
        //            var itemArray = row.ItemArray;
        //            if (itemArray == null)
        //                return true;
        //            return itemArray.All(x => string.IsNullOrWhiteSpace(x.ToString()));
        //        }


        //        //}
        //    }
        //To Get Product List
        public JsonResult GetProducts()
        {
            string Region_Code = _objCurrentInfo.GetRegionCode();
            Dt = new DataTable();
            Dt = Bl.GetProducts(Region_Code);
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(Dt), JsonRequestBehavior.AllowGet);
        }
    }
}