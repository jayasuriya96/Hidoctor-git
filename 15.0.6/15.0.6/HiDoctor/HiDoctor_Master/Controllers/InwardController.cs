using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Threading.Tasks;
using System.Collections;
using System.Text;

using HiDoctor_Master.Models;
using DataControl;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using MVCModels;
using Newtonsoft.Json;


namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class InwardController : Controller
    {
        const string COLL_USER_CODE = "userCode";
        //
        // GET: /Inward/
        #region Private Variables
        private SPData _objSPData = new SPData();
        private InwardModel _objUserModel = new InwardModel();
        private CurrentInfo _objCurrentInfo = new CurrentInfo();
        private IFileProvider fileProvider = new FileSystemProvider();
        private Data _objData = new DataControl.Data();
        private IExcelFactory _objExcelConverter = null;
        private StringBuilder _fileNameString = new StringBuilder();
        private IConfigSettings IConfig_Settings = null;

        // const string INWARD_EXCEL_FILENAME = "Inward_Bulk_upload"+DateTime.Now+".xls";
        const string INWARD_EXCEL_SHEET_NAME = "TABLE$A:K";
        // const string BP_TYPE = "INWARD_UPLOAD";
        const string BP_TYPE = "INWARD_BULK_UPLOAD";
        const string INWARD_EXCEL_WHERE_QRY = "LEN(Quantity) >0 ";
        const string INWARD_EXCEL_HIDDENVALUE_SHEET_NAME = "TABLE$CV12000:CV12003";
        const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        const string EMPLOYEE_USER_MASTER_FILE_NAME = "Employee_Master.xls";
        const string PRODUCT_MASTER_FILE_NAME = "Product_Master.xls";
        #endregion Private Variables

        #region Private Methods
        private void UploadedFileDelete(string path)
        {
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }

        private void DataTableToTwoDimensionalArray(DataRowCollection dr, ref object[,] valuesArray)
        {
            for (int i = 0; i < dr.Count; i++)
            {
                //If you know the number of columns you have, you can specify them this way
                //Otherwise use an inner for loop on columns
                valuesArray[i, 0] = dr[i]["Row_No"].ToString();
                valuesArray[i, 1] = dr[i]["Product_Code"].ToString();
                valuesArray[i, 2] = dr[i]["User_Code"].ToString();
                valuesArray[i, 3] = dr[i]["Product_Name"].ToString();
                valuesArray[i, 4] = dr[i]["UOM_Name"].ToString();
                valuesArray[i, 5] = dr[i]["Employee_Name"].ToString();
                valuesArray[i, 6] = dr[i]["Employee_Number"].ToString();
                valuesArray[i, 7] = dr[i]["Quantity"].ToString();
            }
        }

        private void CreateFileName(string product_type_name, string division_name)
        {
            #region File Name Generated
            _fileNameString.Append(_objCurrentInfo.GetSubDomain() + "_");
            _fileNameString.Append(_objCurrentInfo.GetUserName() + "_");
            _fileNameString.Append("Inward_Bulk_upload_");
            _fileNameString.Append(division_name == null ? "NoDivision" : division_name);
            _fileNameString.Append("_");
            _fileNameString.Append(product_type_name);
            _fileNameString.Append("_");
            _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
            _fileNameString.Append("_");
            _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
            _fileNameString.Append(".xls");
            #endregion File Name Generated
        }

        private string GetEmployeeMasterExcel(DataSet dsEmployeeMaster)
        {
            string fileNamewithPath = string.Empty;
            try
            {

                string company_code = _objCurrentInfo.GetCompanyCode();
                string[] hiddenColumns = new string[] { };
                string[] editableColumnNames = new string[] { };
                string[] hiddenColumnNames = new string[] { };
                _objExcelConverter = new ExcelFactory();
                _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, EMPLOYEE_USER_MASTER_FILE_NAME, dsEmployeeMaster, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
                return EMPLOYEE_USER_MASTER_FILE_NAME;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private string GetProductMasterExcel(DataSet dsProdMaster)
        {
            string company_code = _objCurrentInfo.GetCompanyCode();
            string[] hiddenColumns = new string[] { };
            string[] editableColumnNames = new string[] { };
            string[] hiddenColumnNames = new string[] { };
            _objExcelConverter = new ExcelFactory();
            _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, PRODUCT_MASTER_FILE_NAME, dsProdMaster, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
            return PRODUCT_MASTER_FILE_NAME;
        }
        #endregion Private Methods

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Inward/Details/5

        public ActionResult Details(int id)
        {

            return View();
        }

        //
        // GET: /Inward/Create

        public ActionResult Create()
        {
            ViewBag.userCode = _objCurrentInfo.GetUserCode();
            ViewBag.CurrentDate = System.DateTime.Now.ToString("dd-MM-yyyy");
            return View();
        }

        //
        // POST: /Inward/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                string userCode = _objCurrentInfo.GetUserCode();
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Inward/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Inward/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Inward/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Inward/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }


        //
        // GET: /Inward/ExcelBulkUpload

        public ActionResult ExcelBulkUpload()
        {
            IConfig_Settings = new Config_Settings();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.productTypeValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.INWARD,
                   CONFIG_KEY.ALL_OPTION_FOR_INWARD);
            return View();
        }

        public ActionResult InwardAcknowledgement()
        {
            return View();
        }

        //
        // POST: /Inward/ExcelBulkUpload/

        [HttpPost]
        public ActionResult ExcelBulkUpload(FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }


        //get user data table//
        public JsonResult GetAllInward(FormCollection collection)
        {
            string UserCode = string.Empty;
            UserCode = collection["UserCode"];
            string inwardDate = collection["InwardDate"];
            DataControl.Data ds = new DataControl.Data();
            DataSet dssub = new DataSet();
            ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC Sp_HdUserProduct_select " + "'" + _objCurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + inwardDate + "'";
                dssub = ds.ExecuteDataSet(StrSQL);
                ds.CloseConnection();
            }
            DataTable dt = new DataTable();
            DataTable dtBatch = new DataTable();
            dt = dssub.Tables[0];
            dtBatch = dssub.Tables[1];
            List<Models.InwardModel> lstMOdel = (from c in dt.AsEnumerable()
                                                 select new Models.InwardModel
                                                 {
                                                     ProductTypeName = c["Product_Type_Name"].ToString(),
                                                     ProductName = c["Product_Name"].ToString(),
                                                     CurrentStock = c["Current_Stock"].ToString(),
                                                     ProductCode = c["Product_Code"].ToString(),
                                                     Effective_Status = Convert.ToInt32(c["Effective_Status"].ToString()),
                                                 }).ToList<Models.InwardModel>();
            List<Models.InwardBatch> lstBatch = (from c in dtBatch.AsEnumerable()
                                                 select new Models.InwardBatch
                                                 {
                                                     UPB_ID = Convert.ToInt32(c["UPB_ID"].ToString()),
                                                     Product_Code = c["Product_Code"].ToString(),
                                                     Batch_Number = c["Batch_Number"].ToString(),
                                                     Effective_From = c["Effective_From"].ToString(),
                                                     Effective_To = c["Effective_To"].ToString(),
                                                     Expiry_Date = c["Expiry_Date"].ToString(),
                                                     Effective_Status = Convert.ToInt32(c["Effective_Status"].ToString()),
                                                     Batch_Status = Convert.ToInt32(c["Batch_Status"].ToString()),
                                                     Current_Stock = Convert.ToInt32(c["Current_Stock"].ToString()),
                                                 }).ToList<Models.InwardBatch>();

            return Json(new { Product = lstMOdel, Batch = lstBatch }, JsonRequestBehavior.AllowGet);
        }
        //get history table////
        public JsonResult GetAllstock(FormCollection collection)
        {
            string UserCode = string.Empty;
            UserCode = collection["UserCode"];
            string InwardDate = string.Empty;
            //InwardDate = collection["InwardDate"];
            if (!string.IsNullOrEmpty(collection["InwardDate"].ToString()))
            {
                InwardDate = collection["InwardDate"].ToString().Split('-')[2].ToString() + "-" + collection["InwardDate"].ToString().Split('-')[1].ToString() + "-" + collection["InwardDate"].ToString().Split('-')[0].ToString();
            }
            //InwardDate = Convert.ToDateTime(collection["InwardDate"].ToString()).ToString("yyyy-MM-dd");
            DataControl.Data ds = new DataControl.Data();
            DataSet dssub = new DataSet();
            ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC SP_hdInwardStockValue " + "'" + _objCurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + InwardDate + "'";
                dssub = ds.ExecuteDataSet(StrSQL);
                ds.CloseConnection();
            }
            DataTable dt = new DataTable();
            dt = dssub.Tables[0];
            List<Models.InwardModel> lstMOdel = (from c in dt.AsEnumerable()
                                                 select new Models.InwardModel
                                                 {
                                                     InwardDate = c["Inward Date"].ToString(),
                                                     product = c["Product"].ToString(),
                                                     count = c["Count"].ToString(),
                                                 }).ToList<Models.InwardModel>();

            return Json(lstMOdel, JsonRequestBehavior.AllowGet);
        }
        //get product details///
        public JsonResult GetAllInwardHistory(FormCollection collection)
        {
            string UserCode = string.Empty;
            string ProductCode = string.Empty;
            UserCode = collection["UserCode"];
            ProductCode = collection["ProductCode"];
            DataControl.Data ds = new DataControl.Data();
            DataSet dssub = new DataSet();
            ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC Sp_HdInwardHistory_Details " + "'" + _objCurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + ProductCode + "'";
                dssub = ds.ExecuteDataSet(StrSQL);
                ds.CloseConnection();

            }
            DataTable dt = new DataTable();
            DataTable dtBatch = new DataTable();

            dt = dssub.Tables[0];
            dtBatch = dssub.Tables[1];
            List<Models.InwardModel> lstMOdel = (from c in dt.AsEnumerable()
                                                 select new Models.InwardModel
                                                 {
                                                     Username = c["User Name"].ToString(),
                                                     ProductName = c["Product Name"].ToString(),
                                                     InwardDate = c["Inward Date"].ToString(),
                                                     InwardQuantity = c["Inward Quantity"].ToString(),
                                                     ThenStock = c["Then Stock"].ToString(),
                                                 }).ToList<Models.InwardModel>();

            List<Models.InwardBatch> lstBatch = (from c in dtBatch.AsEnumerable()
                                                 select new Models.InwardBatch
                                                 {
                                                     Inward_Date = c["Inward Date"].ToString(),
                                                     Batch_Number = c["Batch_Number"].ToString(),
                                                     Inward_Stock = Convert.ToInt32(c["Inward Quantity"].ToString()),
                                                     Current_Stock = Convert.ToInt32(c["Then Stock"].ToString()),
                                                 }).ToList<Models.InwardBatch>();

            return Json(new { Product = lstMOdel, Batch = lstBatch }, JsonRequestBehavior.AllowGet);
        }

        public string getMaxCode(long intMaxCode, string strPrefix)
        {
            string strMaxCode = "";
            intMaxCode++;

            if (intMaxCode < 10)
            {
                strMaxCode = strPrefix + "0000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10 && intMaxCode <= 99)
            {
                strMaxCode = strPrefix + "000000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100 && intMaxCode <= 999)
            {
                strMaxCode = strPrefix + "00000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000 && intMaxCode <= 9999)
            {
                strMaxCode = strPrefix + "0000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000 && intMaxCode <= 99999)
            {
                strMaxCode = strPrefix + "000" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 100000 && intMaxCode <= 999999)
            {
                strMaxCode = strPrefix + "00" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 1000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "0" + intMaxCode.ToString();
            }
            else if (intMaxCode >= 10000000 && intMaxCode <= 9999999)
            {
                strMaxCode = strPrefix + "" + intMaxCode.ToString();
            }
            return strMaxCode;
        }

        //save functionality//
        public string save(FormCollection collection)
        {
            string Result = string.Empty;
            string UserCode = string.Empty;
            string SelectDate = string.Empty;
            string Content = string.Empty;
            string UserinwardCode = string.Empty;
            string UserinwardDetail = string.Empty, maxCode = string.Empty;

            UserCode = collection["UserCode"];
            SelectDate = collection["SelectDate"];

            DataControl.Data objAppData = new DataControl.Data();
            string queryMax = objAppData.getSingleValue(Session["Comp_Code"].ToString(), "SELECT CONVERT(VARCHAR,MAX(CAST(SUBSTRING(User_Inward_Code,4,LEN(User_Inward_Code)) AS INT))) FROM  tbl_SFA_Inward_Stock");
            maxCode = getMaxCode(Convert.ToInt64(queryMax), "UIC");

            string userMaxCode = objAppData.getSingleValue(Session["Comp_Code"].ToString(), "SELECT CONVERT(VARCHAR,MAX(CAST(SUBSTRING(User_Inward_Detail,4,LEN(User_Inward_Detail)) AS INT))) FROM  tbl_SFA_Inward_Details");

            UserinwardCode = maxCode;

            string[] strArr = collection["Content"].Split('^');
            string ProductCode = "";
            string InwardStock = "";
            string BatchNumber = "";
            string strSQL = "";
            string strSqlInward = "";
            string userInwardCode = "";
            string Remarks = "";
            //string productDetails = "";

            DataControl.Data ds = new DataControl.Data();
            ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
            {
                strSQL = "EXEC Sp_hdInwardStock_Insert " + "'" + _objCurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + SelectDate + "'";
                userInwardCode = ds.ExecuteScalar(strSQL).ToString();
                ds.CloseConnection();
            }

            if (strArr.Length > 0)
            {
                for (int i = 0; i < strArr.Length; i++)
                {
                    if (strArr[i] != string.Empty)
                    {
                        //userMaxCode = (Convert.ToInt64(userMaxCode) + 1).ToString();
                        //UserinwardDetail = objAppData.getMaxValues(userMaxCode, "UDC");
                        ProductCode = strArr[i].Split('_')[0];
                        BatchNumber = strArr[i].Split('_')[1].Trim();
                        InwardStock = strArr[i].Split('_')[2];
                        Remarks = strArr[i].Split('_')[4];

                        strSqlInward += "EXEC Sp_hdInwardDetails_Insert " + "'" + _objCurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + userInwardCode + "','" + ProductCode + "','" + BatchNumber + "','" + InwardStock + "','"+ Remarks + "';";
                    }
                }
            }

            ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
            {
                ds.ExecuteNonQuery(strSqlInward);
                ds.CloseConnection();
            }
            return "INSERTED";
        }

        /// <summary>
        /// Get Division, if given company have division concept 
        /// this function returns the all active divisons otherwise returns the empty object.
        /// </summary>
        /// <returns>JsonResult</returns>
        public JsonResult GetDivisions()
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataTable dtDivision = new DataTable();
            DataSet ds = _objSPData.GetDivisions(companyCode);
            List<HiDoctor_Master.Models.DivisionModel> lstDivision = new List<HiDoctor_Master.Models.DivisionModel>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                dtDivision = ds.Tables[0];
            }

            lstDivision = (from Division in dtDivision.AsEnumerable()
                           select new HiDoctor_Master.Models.DivisionModel
                           {
                               Division_Code = Division["Division_Code"].ToString(),
                               Division_Name = Division["Division_Name"].ToString()
                           }).ToList<HiDoctor_Master.Models.DivisionModel>();

            return Json(lstDivision);
        }

        /// <summary>
        /// Get Product Type Master, this retuns the all active product types. 
        /// </summary>
        /// <returns>JsonResult</returns>
        public JsonResult GetProductTypeMaster(string userTypeCode, string mode)
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string privilegeName = "DCR_PRODUCTS_BRING_TYPE";
            DataTable dtProductTypes = new DataTable();

            DataSet ds = _objSPData.GetProductTypePrivilageValue(companyCode, userTypeCode, privilegeName, mode);
            //  DataSet ds = _objSPData.GetProductTypeMaster(companyCode);
            List<ProductTypesModal> lstProductTypes = new List<ProductTypesModal>();



            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                dtProductTypes = ds.Tables[0];
            }

            lstProductTypes = (from ProductTypes in dtProductTypes.AsEnumerable()
                               select new ProductTypesModal
                               {
                                   Product_Type_Code = ProductTypes["Product_Type_Code"].ToString(),
                                   Product_Type_Name = ProductTypes["Product_Type_Name"].ToString()
                               }).ToList<ProductTypesModal>();

            return Json(lstProductTypes);
        }


        /// <summary>
        /// Get User Type Master, this functions returns all active user types.
        /// </summary>
        /// <returns>JsonResult</returns>
        public JsonResult GetUserTypeMaster()
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataTable dtUserTypes = new DataTable();
            DataSet ds = _objSPData.GetUserTypeMaster(companyCode);
            List<UserTypesModel> lstUserTypes = new List<UserTypesModel>();

            DataRow[] drv;
            drv = ds.Tables[0].AsEnumerable().Where(c => c["User_Type_Status"].ToString() == "1").ToArray();

            lstUserTypes = (from UserTypes in drv.AsEnumerable()
                            select new UserTypesModel
                            {
                                User_Type_Code = UserTypes["User_Type_Code"].ToString(),
                                User_Type_Name = UserTypes["User_Type_Name"].ToString()
                            }).ToList<UserTypesModel>();

            return Json(lstUserTypes);
        }

        /// <summary>
        /// Get Products By Division and ProductTypes, this returns the products for given
        /// division and product types. if given division have products , returns the division products
        /// otherwise company products.
        /// </summary>
        /// <param name="division_code"></param>
        /// <param name="product_type"></param>
        /// <returns>JsonResult</returns>
        public JsonResult GetProductsByDivisionandProductTypes(string division_code, string product_type_code, string user_type_code, string screenMode)
        {
            string company_Code = _objCurrentInfo.GetCompanyCode();
            DataTable dtProductMaster = new DataTable();
            string privilegeName = "DCR_PRODUCTS_BRING_TYPE";
            DataSet ds = _objSPData.GetProductsByDivisionAndProductTypes(company_Code, division_code, product_type_code, user_type_code, privilegeName, screenMode);
            List<ProductModel> lstProduct = new List<ProductModel>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                dtProductMaster = ds.Tables[0];
            }

            lstProduct = (from Products in dtProductMaster.AsEnumerable()
                          select new ProductModel
                          {
                              Product_Code = Products["Product_Code"].ToString(),
                              Product_Name = Products["Product_Name"].ToString()
                          }).ToList<ProductModel>();

            return Json(lstProduct);
        }
        [HttpPost]
        /// <summary>
        /// 
        /// </summary>
        /// <param name="division_code"></param>
        /// <param name="product_type_code"></param>
        /// <param name="user_type_code"></param>
        /// <param name="product_codes"></param>
        /// <returns></returns>
        public StringBuilder GetInwardExcelData(string division_code, string product_type_code, string user_type_code, string product_codes,
           string product_type_name, string division_name)
        {
            try
            {
                CreateFileName(product_type_name, division_name);
                string company_code = _objCurrentInfo.GetCompanyCode();
                string[] hiddenColumns = new string[] { };
                string[] editableColumnNames = new string[] { };
                string[] hiddenColumnNames = new string[] { };
                _objExcelConverter = new ExcelFactory();

                DataSet dsInwardExcelData = new DataSet();
                dsInwardExcelData = _objSPData.GetInwardExcelData(company_code, division_code, product_type_code, user_type_code, product_codes);

                if (dsInwardExcelData.Tables != null && dsInwardExcelData.Tables[0].Rows != null && dsInwardExcelData.Tables[0].Rows.Count > 0)
                {
                    dsInwardExcelData.Tables[0].Columns.Add("Quantity", typeof(string));
                    DataRowCollection dr = dsInwardExcelData.Tables[0].Rows;
                    DataColumnCollection dc = dsInwardExcelData.Tables[0].Columns;

                    _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsInwardExcelData, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
                }
                else
                {
                    StringBuilder str = new StringBuilder("No Data Found.");
                    return str;
                }
                StringBuilder MasterfilenameStrings = GetInwardLookupValuesExcel();
                return _fileNameString.Append("^").Append(MasterfilenameStrings);
            }
            catch (Exception ex)
            {
                return _fileNameString.Append(ex.Message);
            }
        }


        public StringBuilder GetInwardExcelDataUserBased(string users_Json, string product_Json, string product_type_name, string division_name)
        {
            try
            {
                CreateFileName(product_type_name, division_name);
                string company_code = _objCurrentInfo.GetCompanyCode();
                string[] hiddenColumns = new string[] { };
                string[] editableColumnNames = new string[] { };
                string[] hiddenColumnNames = new string[] { };
                _objExcelConverter = new ExcelFactory();
                BLMaster objBlMaster = new BLMaster();
                DataSet dsInwardExcelData = new DataSet();
                dsInwardExcelData = objBlMaster.GetInwardExcelDataUserBased(company_code, users_Json, product_Json);
                if (dsInwardExcelData.Tables != null && dsInwardExcelData.Tables[0].Rows != null && dsInwardExcelData.Tables[0].Rows.Count > 0)
                {
                    dsInwardExcelData.Tables[0].Columns.Add("Quantity", typeof(string));
                    DataRowCollection dr = dsInwardExcelData.Tables[0].Rows;
                    DataColumnCollection dc = dsInwardExcelData.Tables[0].Columns;

                    _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsInwardExcelData, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
                }
                else
                {
                    StringBuilder str = new StringBuilder("No Data Found.");
                    return str;
                }
                StringBuilder MasterfilenameStrings = GetInwardLookupValuesExcel();
                return _fileNameString.Append("^").Append(MasterfilenameStrings);
            }
            catch (Exception ex)
            {
                return _fileNameString.Append(ex.Message);
            }
        }

        /// <summary>
        /// Returns Inward lookup values file names.
        /// </summary>
        /// <returns></returns>
        public StringBuilder GetInwardLookupValuesExcel()
        {
            try
            {
                string company_Code = _objCurrentInfo.GetCompanyCode();
                string empMasterExcelFileName = string.Empty;
                string prdMasterExcelFileName = string.Empty;

                // Retrieve 
                DataSet dsInwardLookupValues = _objSPData.GetInwardBulkUploadLookupValues(company_Code);

                // Employee Master.
                if (dsInwardLookupValues != null && dsInwardLookupValues.Tables != null && dsInwardLookupValues.Tables.Count > 0
                    && dsInwardLookupValues.Tables[0].Rows != null && dsInwardLookupValues.Tables[0].Rows.Count > 0)
                {
                    DataSet dsEmpMaster = new DataSet();
                    DataTable dt = dsInwardLookupValues.Tables[0].Copy();
                    dsEmpMaster.Tables.Add(dt);
                    empMasterExcelFileName = GetEmployeeMasterExcel(dsEmpMaster);
                }

                // Product Master.
                if (dsInwardLookupValues != null && dsInwardLookupValues.Tables != null && dsInwardLookupValues.Tables.Count > 1
                    && dsInwardLookupValues.Tables[1].Rows != null && dsInwardLookupValues.Tables[1].Rows.Count > 0)
                {
                    DataSet dsProdMaster = new DataSet();
                    DataTable dt = dsInwardLookupValues.Tables[1].Copy();
                    dsProdMaster.Tables.Add(dt);
                    prdMasterExcelFileName = GetProductMasterExcel(dsProdMaster);
                }
                StringBuilder fileNameStrings = new StringBuilder();
                fileNameStrings.Append(empMasterExcelFileName).Append("^").Append(prdMasterExcelFileName);
                return fileNameStrings;
            }
            catch (Exception ex)
            {
                StringBuilder strMessage = new StringBuilder();
                return strMessage.Append(ex.Message);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UploadExcelFile(HttpPostedFileBase fileUpload, HttpPostedFileBase fileUploadUser, FormCollection collection)
        {
            string fileName = "";
            try
            {
                // Declare and assign the variables.
                string errorCode = "-1";
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string userCode = _objCurrentInfo.GetUserCode();
                string subDomain = _objCurrentInfo.GetSubDomain();


                string user_Type_Code = string.Empty;
                string product_Type_Code = string.Empty;

                string inward_Date = "";
                string screenMode = collection["ScreenMode"].ToString();

                if (screenMode == "USER TYPE")
                {
                    inward_Date = collection["txtInward"].ToString();
                    fileName = fileUpload.FileName;
                }
                else
                {
                    inward_Date = collection["txtUserInwardDate"].ToString();
                    fileName = fileUploadUser.FileName;
                }
                _objExcelConverter = new ExcelFactory();

                // Save the file to server path.
                string fileNameWithPath = fileProvider.GetFilePathToSave("ExcelUploadPath", fileName);
                if (screenMode == "USER TYPE")
                {
                    fileUpload.SaveAs(fileNameWithPath);
                }
                else
                {
                    fileUploadUser.SaveAs(fileNameWithPath);
                }

                // Set Excel column Names.
                Hashtable hashExcelColumnsTable = new Hashtable();
                hashExcelColumnsTable.Add("Row_No", "");
                hashExcelColumnsTable.Add("User_Code", "");
                hashExcelColumnsTable.Add("Product_Code", "");
                hashExcelColumnsTable.Add("Product_Name", "");
                hashExcelColumnsTable.Add("Employee_Name", "");
                hashExcelColumnsTable.Add("Employee_Number", "");
                hashExcelColumnsTable.Add("UOM_Name", "");
                hashExcelColumnsTable.Add("Ref_Key1", "");
                hashExcelColumnsTable.Add("Internal_Reference_Key", "");
                hashExcelColumnsTable.Add("Region_Name", "");
                hashExcelColumnsTable.Add("Quantity", "");

                // Check column headers are correct.
                if (!_objExcelConverter.IsExcelColumnHeadrsAreCorrect(hashExcelColumnsTable, INWARD_EXCEL_SHEET_NAME, fileNameWithPath))
                {
                    errorCode = "1";
                    ViewBag.ErrorCode = errorCode;
                    UploadedFileDelete(fileNameWithPath);
                    return View("UploadExcelFile");
                }
                // Retrieve columns from excel.
                string[] excelRetrieveColumns = new string[] { "Row_No", "User_Code", "Product_Code", "Employee_Number", "Ref_Key1", "Internal_Reference_Key", "Quantity " };
                string[] excelHiddenColumns = new string[] { "*" };

                // Then convert the excel to datatable.
                DataTable dt = _objExcelConverter.ExcelToDataSet(excelRetrieveColumns, INWARD_EXCEL_SHEET_NAME, INWARD_EXCEL_WHERE_QRY, fileNameWithPath, "Quantity");

                dt.Columns.Add("BPID", typeof(Guid));
                dt.Columns["Internal_Reference_Key"].ColumnName = "Internal_Refer_Key";
                dt.Columns["Quantity"].ColumnName = "Qty";

                Guid NewId = Guid.NewGuid();
                dt.Columns.Add("Company_Code", typeof(string));
                dt.Columns.Add("BP_Type", typeof(string));
                for (int index = 0; index < dt.Rows.Count; index++)
                {
                    dt.Rows[index]["Company_Code"] = companyCode;
                    dt.Rows[index]["BPID"] = NewId;
                    dt.Rows[index]["BP_Type"] = BP_TYPE;
                }

                try
                {
                    for (int index = 0; index < dt.Rows.Count; index++)
                    {
                        Convert.ToInt32(dt.Rows[index]["Row_No"]);
                    }
                }
                catch
                {
                    errorCode = "4";
                    UploadedFileDelete(fileNameWithPath);
                    ViewBag.ErrorCode = errorCode;
                    return View("UploadExcelFile");
                }

                // set the error code to view bag. if errorcode is -1 validation is pass, otherwise fail.
                ViewBag.ErrorCode = errorCode;
                if (errorCode == "-1")
                {
                    // Call the Async method. 
                    Task task = Task.Factory.StartNew(() => _objSPData.InsertInwardBulkUploadAsync(subDomain, dt, companyCode, NewId, userCode, fileName, BP_TYPE, user_Type_Code, product_Type_Code, inward_Date));
                }
                // _objSPData.InsertInwardBulkUploadAsync(dt, companyCode, Guid.NewGuid(), userCode, fileName, BP_TYPE, user_Type_Code, product_Type_Code, inward_Date);

                // Inserts the excel rows in to the Inward staging table.
                UploadedFileDelete(fileNameWithPath);
                return View("UploadExcelFile");
            }
            catch (Exception ex)
            {
                string fileNameWithPath = fileProvider.GetFilePathToSave("ExcelUploadPath", fileName);
                UploadedFileDelete(fileNameWithPath);
                if (ex.GetType() == typeof(System.Data.OleDb.OleDbException))
                {
                    ViewBag.ErrorCode = "3";
                    return View("UploadExcelFile");
                }

                ViewBag.ErrorCode = ex.Message;
                return View("UploadExcelFile");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult DownloadExcelFile()
        {
            return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + _fileNameString.ToString(), FileDownloadName = _fileNameString.ToString() };
        }
        public JsonResult GetProductsMaxCountConfig()
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                IConfig_Settings = new Config_Settings();
                string companyCode = _objCurrentInfo.GetCompanyCode();

                // Retrives the Max Products count value.
                string UserTypeMaxProductCount = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.INWARD,
                    CONFIG_KEY.INWARD_MAX_PRODUCT_COUNT_USERTYPEWISE);

                string UserMaxProductCount = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.INWARD,
                    CONFIG_KEY.INWARD_MAX_PRODUCT_COUNT_USERWISE);

                // Returns the Max Products Count
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("UserTypeMaxProductCount", UserTypeMaxProductCount);
                dic.Add("UserMaxProductCount", UserMaxProductCount);
                return Json(dic);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetFilteredUsers(string division_Code, string user_Type_Code)
        {
            try
            {
                BLUser objUser = new BLUser();
                _objCurrentInfo = new CurrentInfo();
                string company_Code = _objCurrentInfo.GetCompanyCode();

                IEnumerable<DivisionUserProducts> IlstUsers = objUser.GetUserBasedOnDivisionAndUserType(company_Code, division_Code, user_Type_Code);
                return Json(IlstUsers);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUnmappedDivisionProducts(string division_code, string product_type_code)
        {
            string company_Code = _objCurrentInfo.GetCompanyCode();
            BLMaster objBlMaster = new BLMaster();
            DataTable dtProductMaster = new DataTable();
            DataSet ds = objBlMaster.GetUnmappedDivisionProducts(company_Code, division_code, product_type_code);
            List<ProductModel> lstProduct = new List<ProductModel>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                dtProductMaster = ds.Tables[0];
            }

            lstProduct = (from Products in dtProductMaster.AsEnumerable()
                          select new ProductModel
                          {
                              Product_Code = Products["Product_Code"].ToString(),
                              Product_Name = Products["Product_Name"].ToString()
                          }).ToList<ProductModel>();

            return Json(lstProduct);
        }

        #region Inward Acknolodgement

        public JsonResult GetInwardAck()
        {
            BLMaster _objBlMaster = new BLMaster();
            return Json(_objBlMaster.GetInwardAck(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveInwardAck(List<InwardAck> lstInwardAck)
        {
            BLMaster _objBlMaster = new BLMaster();
            return Json(_objBlMaster.SaveInwardAck(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), lstInwardAck), JsonRequestBehavior.AllowGet);
        }

        public ActionResult BulkInwardUpload()
        {
            return View();
        }
        public void DownloadInwardExcelTemplate()
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string error = string.Empty;
            string fileName = "BulkInwardUpload.xlsx";
            string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;
            objFileDownload.DownloadFile(blobURL, fileName, out error);
        }
        [HttpPost]
        public ActionResult InwardUploadExcelFile(HttpPostedFileBase fileUpload, string InwardDate)
        {
            DataControl.BLRegion objBlRegion = new BLRegion();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            string subDomain = objCurInfo.GetSubDomain();
            String Inward_ACK_Needeed = string.Empty;
            Inward_ACK_Needeed = IConfig_Settings.GetConfigDefaultValue(_objCurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            string result = string.Empty;
            result = objBlRegion.InsertInwardExcelBulkUpload(objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), fileUpload, objCurInfo.GetUserCode(), subDomain, System.Net.Dns.GetHostName().ToString(), Convert.ToDateTime(InwardDate), Inward_ACK_Needeed);
            ViewBag.ErrorCode = result;
            return View("InwardUploadExcelFile");
        }

        /// <summary>
        /// Excel Download Active Products from Product Master
        /// </summary>
        public void GetActiveProducts()
        {
            DataControl.BLRegion objBlRegion = new BLRegion();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataSet Ds = new DataSet();
            Ds = objBlRegion.GetActiveProducts(companyCode);
            Ds.Tables[0].TableName = "Product Details";
            HttpResponse response = System.Web.HttpContext.Current.Response;
            DownloadExcel excel = new DownloadExcel();
            excel.Convert(Ds, "Product_Master_Data" + "_" + DateTime.Now.ToShortDateString(), response);
        }



        #endregion
        #region Inward Adjustment
        /// <summary>
        /// view page for Inward Adjustment
        /// </summary>
        /// <returns></returns>
        public ActionResult InwardAdjustment()
        {
            _objCurrentInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            ViewBag.Cur_UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.InwardAcknowledgementNeeded = IConfig_Settings.GetConfigDefaultValue(_objCurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            ViewBag.UserTypeName = _objCurrentInfo.GetUserTypeName();
            return View();
        }

        /// <summary>
        /// To fill delivery challan in selection box 
        /// </summary>
        /// <param name="UserCode"></param>
        /// <returns></returns>
        public JsonResult GetUserDeliveryChallan(string UserCode, int Page_Number, int Page_Size)
        {
            try
            {
                MVCModels.CombinedDeliveryChallanInfo CombinedDC = new CombinedDeliveryChallanInfo();
                BLMaster _objBlMaster = new BLMaster();
                CombinedDC = _objBlMaster.GetUserDeliveryChallan(UserCode, Page_Number, Page_Size);
                return Json(CombinedDC, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// displays selected Delivery challan info
        /// </summary>
        /// <param name="DCSelect"></param>
        /// <returns></returns>
        public JsonResult GetDeliveryChallanInfo(string DCSelect, string UserCode)
        {
            DCInfoWrap wrap = new DCInfoWrap();
            try
            {
                BLMaster _objBLMaster = new BLMaster();
                wrap = _objBLMaster.GetDeliveryChallanInfo(DCSelect, UserCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(wrap, JsonRequestBehavior.AllowGet);
        }
        public JsonResult InsertAdjustment(List<InwardAdj> lstInwardAdj)
        {
            string response = string.Empty;
            BLMaster _objBLMaster = new BLMaster();
            response = _objBLMaster.InsertAdjustment(lstInwardAdj);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRemarksHistory(int Header_Id)
        {
            InwardRemarksModel ObjInward = null;
            try
            {
                BLMaster _objBLMaster = new BLMaster();
                ObjInward = _objBLMaster.GetRemarksHistory(Header_Id);
                return Json(ObjInward, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion
    }
}
