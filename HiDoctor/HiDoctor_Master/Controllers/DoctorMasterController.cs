using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using ElmahWrapper;
using DataControl;
using System.Text;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
using System.Net;

namespace HiDoctor_Master.Controllers
{

    [AjaxSessionActionFilter]
    public class DoctorMasterController : Controller
    {
        //Added For - CCM-Adding New Dotor Restriction
        #region Private Methods
        private IConfigSettings _objIconfigsettings = null;
        #endregion Private Methods
        private IConfigSettings IConfig_Settings = null;
        DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        BL_Customer objBLCustomer;
        BL_KYD _blKYD;
        const int PAGESIZE = 10;
        public int noOfPagesIncustomerMaster;
        //
        // GET: /DoctorMaster/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /DoctorMaster/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /DoctorMaster/Create

        public ActionResult Create()
        {

            return View();
        }

        //
        // POST: /DoctorMaster/Create

        [HttpPost]
        public string Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                string result = "";
                string customerCode = "", category = "";
                if (collection["Mode"].ToString().ToUpper() == "INSERT")
                {
                    customerCode = _objSPData.GetCustomerMasterMaxCode(_objcurrentInfo.GetCompanyCode(), collection["Region_Code"].ToString(), "DOCTOR");
                    category = collection["CategoryCode"].ToString();
                    result = _objSPData.InsertDoctor(_objcurrentInfo.GetCompanyCode(), customerCode, collection["Customer_Name"].ToString(), collection["Region_Code"].ToString(),
                        collection["SubRegion_Code"].ToString(), collection["CategoryCode"].ToString(), collection["SpecialityCode"].ToString(),
                        collection["Address1"].ToString(), collection["Address2"].ToString(), collection["Local_Area"].ToString(),
                        collection["Phone"].ToString(), collection["Mobile"].ToString(), collection["Fax"].ToString(), collection["Email"].ToString(),
                        collection["DOB"].ToString(), collection["Anniversary_Date"].ToString(), collection["MDL_Number"].ToString(), collection["Qualification"].ToString(),
                        collection["Registration_Number"].ToString(), collection["Hospital_Name"].ToString(), collection["Hospital_Classification"].ToString(),
                        _objcurrentInfo.GetUserCode(), collection["Mode"].ToString(), collection["Remarks"].ToString());
                }
                else
                {
                    customerCode = collection["Customer_Code"].ToString();
                    category = collection["CategoryCode"].ToString();
                    result = _objSPData.InsertDoctor(_objcurrentInfo.GetCompanyCode(), collection["Customer_Code"].ToString(), collection["Customer_Name"].ToString(), collection["Region_Code"].ToString(),
                    collection["SubRegion_Code"].ToString(), collection["CategoryCode"].ToString(), collection["SpecialityCode"].ToString(),
                    collection["Address1"].ToString(), collection["Address2"].ToString(), collection["Local_Area"].ToString(),
                    collection["Phone"].ToString(), collection["Mobile"].ToString(), collection["Fax"].ToString(), collection["Email"].ToString(),
                    collection["DOB"].ToString(), collection["Anniversary_Date"].ToString(), collection["MDL_Number"].ToString(), collection["Qualification"].ToString(),
                    collection["Registration_Number"].ToString(), collection["Hospital_Name"].ToString(), collection["Hospital_Classification"].ToString(),
                    _objcurrentInfo.GetUserCode(), collection["Mode"].ToString(), collection["Remarks"].ToString());
                }
                //return result;
                string productCode = "", supportQty = "", potentialQty = "";
                int productCount = int.Parse(collection["No_Of_Product"].ToString());
                StringBuilder qry = new StringBuilder();
                for (int i = 0; i < productCount; i++)
                {
                    if (collection["PDC_" + i] == null)
                    {
                        continue;
                    }

                    //Get the product code from collection
                    productCode = collection["pdc_" + i].ToString();
                    supportQty = collection["SQty_" + i].ToString();
                    potentialQty = collection["PQty_" + i].ToString();

                    qry.Append("EXEC SP_hdInsertDoctorProductMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "','" + category + "',");
                    qry.Append(" '" + collection["Region_Code"].ToString() + "','" + productCode + "','" + supportQty + "','" + potentialQty + "','" + _objcurrentInfo.GetUserName() + "';");
                }

                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet(qry.ToString());
                }


                return "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "Create()");
                return "FAILED";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //
        // GET: /DoctorMaster/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /DoctorMaster/Edit/5

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
        // GET: /DoctorMaster/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /DoctorMaster/Delete/5

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

        public ActionResult ExcelBulkUploadMultiTerritory(string cust)
        {
            //cust = "S";
            ViewBag.Master_Type = cust;
            return View();
        }

        /// <summary>
        /// Get Doctor Master data
        /// </summary> 
        public JsonResult GetCustomerMasterDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();
            DataControl.Data _objData = new DataControl.Data();
            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
            {
                StringBuilder strQry = new StringBuilder();
                strQry.Append("exec SP_hdGetDoctorMaster '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Mode"].ToString() + "','" + collection["RegionCode"].ToString() + "','" + collection["EntityName"].ToString() + "';");
                strQry.Append(" exec SP_hdGetDoctorSaleProductRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "';");
                ds = _objData.ExecuteDataSet(strQry.ToString());
            }
            _objData.CloseConnection();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return new LargeJsonResult() { Data = json.Serialize(ds), MaxJsonLength = int.MaxValue };
            //  return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get Doctor Master data
        /// </summary> 
        public JsonResult GetDoctorMasterDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();
            DataControl.Data _objData = new DataControl.Data();
            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
            {
                StringBuilder strQry = new StringBuilder();
                strQry.Append("exec SP_hdGetDoctorMaster '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Mode"].ToString() + "','" + collection["RegionCode"].ToString() + "','" + collection["EntityName"].ToString() + "';");
                strQry.Append(" exec SP_hdGetDoctorSaleProductRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "';");
                ds = _objData.ExecuteDataSet(strQry.ToString());
            }
            _objData.CloseConnection();
            DataTable dataTable = new DataTable();
            DataSet dsData = new DataSet();
            dsData = ds.Clone();
            var dr = ds.Tables[0].AsEnumerable().Skip(Convert.ToInt32(collection["PageNum"].ToString())).Take(50);
            var dr1 = ds.Tables[1].AsEnumerable();
            foreach (DataRow row in dr)
            {
                dsData.Tables[0].ImportRow(row);
            }
            foreach (DataRow row1 in dr1)
            {
                dsData.Tables[1].ImportRow(row1);
            }

            // dsData.Tables.Remove("Table1");
            dsData.AcceptChanges();
            //dsData.Tables[1] = ds.Tables[1].Copy();
            //dsData.Tables.Add(ds.Tables[1]);
            // dsData.Tables.Add(dataTable);
            // dsData.Tables.Add(ds.Tables[1]);
            dsData.AcceptChanges();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return new LargeJsonResult() { Data = json.Serialize(dsData), MaxJsonLength = int.MaxValue };
            //  return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }




        public ActionResult BulkAdd(string id)
        {
            _objIconfigsettings = new Config_Settings();
            string ccm_ConfigValue = string.Empty;
            BLMaster _objBLMaster = new BLMaster();
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string treeselectedregionName = string.Empty;
            objModel.Entity = id.Split('_')[1].ToString();
            objModel.Table_Name = id.Split('_')[0].ToString();
            ViewBag.Entity = GetEntityColumnName(id);

            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.UserCode = Session["User_Code"].ToString();

            string selectedRegionCode = Session["SeletedRegionCode"].ToString();

            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }


            //CCM New Doctor Add - Restriction
            ccm_ConfigValue = _objIconfigsettings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.CUSTOMER, CONFIG_KEY.IS_CCM_ENABLED);
            ViewBag.ConfigValue = ccm_ConfigValue;
            return View(objModel);
        }
        [HttpPost]
        public string BulkAdd(FormCollection collection)
        {
            string result = "";
            string[] arValues = null;
            string[] arEditedValues = null;
            string[] arColumnValues = null;
            try
            {
                /// <summary>
                /// New Customer Addition
                /// </summary> 
                if (collection["Values"] != null)
                {
                    if (collection["Values"] != "")
                    {
                        string effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        string appliedBy = _objcurrentInfo.GetUserCode(); ;
                        arValues = collection["Values"].ToString().Split('~');
                        if (arValues.Length > 0)
                        {
                            for (int i = 0; i < arValues.Length; i++)
                            {
                                string dcrVisitCode = arValues[i].Split('|')[0];
                                string columnValues = arValues[i].Split('|')[1];
                                string customerStatus = "";
                                if (!string.IsNullOrEmpty(dcrVisitCode))
                                {
                                    customerStatus = "UNLISTED";
                                }
                                else
                                {
                                    customerStatus = "2";
                                }
                                result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                        columnValues, "", "INSERT", "", "", "", effectiveFrom, appliedDate, customerStatus, dcrVisitCode);
                            }
                        }
                    }
                }
                /// <summary>
                ///Update customer details
                /// </summary> 
                if (collection["Edited_Values"] != null)
                {
                    if (collection["Edited_Values"] != "")
                    {
                        arEditedValues = collection["Edited_Values"].ToString().Split('~');
                        arColumnValues = collection["ColumnValues"].ToString().Split('~');
                        if (arEditedValues.Length > 0)
                        {
                            for (int i = 0; i < arEditedValues.Length; i++)
                            {
                                string historyNeeded = arEditedValues[i].Split('$')[0].Split('|')[1].ToString();
                                string customerCode = arEditedValues[i].Split('$')[0].Split('|')[0].ToString();
                                string isApplied = arEditedValues[i].Split('$')[0].Split('|')[2].ToString();
                                string status = arEditedValues[i].Split('$')[0].Split('|')[3].ToString();
                                string dcrVisitCode = arEditedValues[i].Split('$')[0].Split('|')[4].ToString();
                                //History check
                                string effectiveTo = "", effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                string appliedBy = "";

                                string qry = "";
                                DataSet dsCus = new DataSet();
                                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                                {
                                    qry = "exec SP_hdGetDocDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" +
                                        customerCode + "','" + status + "'";
                                    dsCus = _objData.getDataSet(qry);
                                }
                                _objData.CloseConnection();
                                if (dsCus.Tables[0].Rows.Count > 0)
                                {
                                    effectiveFrom = dsCus.Tables[0].Rows[0]["Effective_From"].ToString();
                                    effectiveTo = dsCus.Tables[0].Rows[0]["Effective_To"].ToString();
                                    appliedDate = dsCus.Tables[0].Rows[0]["Applied_Date"].ToString();
                                    if (status == "2")
                                    {
                                        appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                        effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                        appliedBy = _objcurrentInfo.GetUserCode();
                                    }
                                    else if (status == "1")
                                    {
                                        appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                        effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                    }
                                    else if (status == "0")
                                    {
                                        if (isApplied == "ISAPPLIED")
                                        {
                                            appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                            effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                        }
                                    }
                                    else
                                    {
                                    }
                                }
                                if (collection["EntityName"].ToString().ToUpper() != "STOCKIEST")
                                {
                                    DataSet dsHistory = new DataSet();
                                    if (status != "2")
                                    {
                                        if ((status == "1" && historyNeeded == "Y") || (status == "0" && isApplied == "ISAPPLIED"))
                                        {
                                            effectiveTo = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                        }
                                        if (status == "0")
                                        {
                                            if (isApplied.ToUpper() == "ISAPPLIED")
                                            {
                                                historyNeeded = "Y";
                                            }
                                            else
                                            {
                                                historyNeeded = "N";
                                            }
                                        }
                                        StringBuilder historyQry = new StringBuilder();
                                        dsHistory = CheckHistory(customerCode, collection["RegionCode"].ToString(), status,
                                            collection["Columns"].ToString(), arColumnValues[i].ToString(), dsCus, historyNeeded);
                                        if (dsHistory.Tables[0].Rows.Count > 0)
                                        {
                                            for (var j = 0; j < dsHistory.Tables[0].Rows.Count; j++)
                                            {

                                                historyQry.Append("EXEC SP_hdInsertCustomerHistory '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "',");
                                                historyQry.Append(" '" + collection["RegionCode"].ToString() + "','" + dsHistory.Tables[0].Rows[j]["Changed_Column"].ToString() + "',");
                                                historyQry.Append(" '" + dsHistory.Tables[0].Rows[j]["Old_Value"].ToString() + "',");
                                                historyQry.Append(" '" + dsHistory.Tables[0].Rows[j]["New_Value"].ToString() + "',");
                                                historyQry.Append(" '" + collection["EntityName"].ToString().ToUpper() + "','" + effectiveTo + "'");
                                            }
                                            int historyResult = 0;
                                            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                                            {
                                                historyResult = _objSPData.ExecuteStoredProcedure("ExecQuery", historyQry.ToString(), _objcurrentInfo.GetCompanyCode());
                                            }
                                            _objData.CloseConnection();
                                            if (historyResult == 1)
                                            {

                                                result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                                        arEditedValues[i].Split('$')[1].ToString(), customerCode, "UPADTE", "", "", historyNeeded, effectiveFrom, appliedDate, status, dcrVisitCode);
                                            }
                                        }
                                        else
                                        {
                                            result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                                      arEditedValues[i].Split('$')[1].ToString(), customerCode, "UPADTE", "", "", historyNeeded, effectiveFrom, appliedDate, status, dcrVisitCode);
                                        }
                                    }
                                    else
                                    {
                                        result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                                      arEditedValues[i].Split('$')[1].ToString(), customerCode, "UPADTE", "", "", historyNeeded, effectiveFrom, appliedDate, status, dcrVisitCode);
                                    }

                                }
                                else
                                {
                                    result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                                      arEditedValues[i].Split('$')[1].ToString(), customerCode, "UPADTE", "", "", historyNeeded, effectiveFrom, appliedDate, status, dcrVisitCode);
                                }
                            }
                        }
                    }

                }
                int insertedRows = 0;
                int updatedRows = 0;
                if (arValues != null)
                {
                    insertedRows = arValues.Length;
                }
                if (arEditedValues != null)
                {
                    updatedRows = arEditedValues.Length;
                }

                return "SUCCESS:" + insertedRows + "^" + updatedRows;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "BulkAdd()");
                return "FAILURE:" + ex.Message;
            }

        }
        /// <summary>
        /// Get Doctor speciality and category
        /// </summary> 
        public JsonResult GetDoctorCategory(FormCollection collection, string selectedRegionCode)
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    StringBuilder strQry = new StringBuilder();
                    strQry.Append("exec SP_HD_GetDoctorCatgorybySelectedRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + selectedRegionCode + "';");
                    strQry.Append(" exec SP_hdGetSpeciality '" + _objcurrentInfo.GetCompanyCode() + "','';");
                    strQry.Append(" exec  SP_hdGetSubRegion '" + _objcurrentInfo.GetCompanyCode() + "';");
                    strQry.Append("exec sp_sdGetCustomerGroup '" + _objcurrentInfo.GetCompanyCode() + "';");
                    strQry.Append("EXEC sp_sdGetDepots '" + _objcurrentInfo.GetCompanyCode() + "';");

                    ds = _objData.ExecuteDataSet(strQry.ToString());
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Get Customer details
        /// </summary> 
        public JsonResult GetCustomerDetails(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    //string strQry = "exec SP_hdGetCustomerDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["CustomerCode"].ToString() + "','" + collection["RegionCode"].ToString() + "';";
                    string strQry = "exec SP_hdGetDoctorProductMappimgDetail '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["CustomerCode"].ToString() + "','" + collection["RegionCode"].ToString() + "';";
                    ds = _objData.ExecuteDataSet(strQry);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public ActionResult ExcelUpload(string id)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            objModel.Entity = id.Split('_')[1];
            objModel.Table_Name = id.Split('_')[0];
            //ViewBag.Entity = id.Split('_')[1];
            //ViewBag.Table_Name = id.Split('_')[0];
            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();

            CurrentInfo curInfo = new CurrentInfo();

            string selectedRegionCode = string.Empty;
            if (Session["SeletedRegionCode"] != null && Session["SeletedRegionCode"] != "")
            {
                selectedRegionCode = curInfo.GetDoctorMasterSelectedRegion();
            }
            else
            {
                selectedRegionCode = Session["Region_Code"].ToString();

            }
            string treeselectedregionName = string.Empty;


            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            //ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();


            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }


            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.UserCode = Session["User_Code"].ToString();
            return View(objModel);
        }

        [HttpPost]
        public ActionResult ExcelUpload(HttpPostedFileBase file, FormCollection collection)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            Stream FileInputStream = file.InputStream;
            StreamReader FileStream = new StreamReader(FileInputStream);
            string entity = collection["Entity"].ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Entity"].ToString() + "','" + collection["Table_Name"].ToString() + "'";
                    ds = _objData.ExecuteDataSet(strQry);
                }
                _objData.CloseConnection();
                DataTable dt = new DataTable();
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DataColumn dc = new DataColumn(ds.Tables[0].Rows[i]["Field_Name"].ToString());
                    dt.Columns.Add(dc);
                }

                DataTable outputTable = new DataTable();

                // Add columns by looping rows

                // Header row's first column is same as in inputTable
                outputTable.Columns.Add(ds.Tables[0].Columns[0].ColumnName.ToString());

                // Header row's second column onwards, 'inputTable's first column taken
                foreach (DataRow inRow in ds.Tables[0].Rows)
                {
                    string newColName = inRow[0].ToString();
                    outputTable.Columns.Add(newColName);
                }

                // Add rows by looping columns        
                for (int rCount = 1; rCount <= ds.Tables[0].Columns.Count - 1; rCount++)
                {
                    DataRow newRow = outputTable.NewRow();

                    // First column is inputTable's Header row's second column
                    newRow[0] = ds.Tables[0].Columns[rCount].ColumnName.ToString();
                    for (int cCount = 0; cCount <= ds.Tables[0].Rows.Count - 1; cCount++)
                    {
                        string colValue = ds.Tables[0].Rows[cCount][rCount].ToString();
                        newRow[cCount + 1] = colValue;
                    }
                    outputTable.Rows.Add(newRow);
                }

                //int count = 0;
                //int errorCnt = 0;
                //StringBuilder error = new StringBuilder();
                //do
                //{
                //    if (count == 0)
                //    {
                //        string InputText;
                //        InputText = FileStream.ReadLine();
                //        string[] arrFileString = InputText.Split(',');
                //        for (int c = 0; c < outputTable.Columns.Count - 1; c++)
                //        {
                //            if (c < arrFileString.Length)
                //            {
                //                DataRow[] dr = ds.Tables[0].Select("Field_Alias_Name='" + arrFileString[c].ToString() + "'");
                //                if (dr.Length == 0)
                //                {
                //                    error.Append(" " + arrFileString[c].ToString() + " column not found " + "~");
                //                    errorCnt++;
                //                }
                //                if (outputTable.Columns[c + 1].ColumnName.ToUpper() != arrFileString[c].ToString().ToUpper())
                //                {
                //                    error.Append(" " + arrFileString[c].ToString() + " column order changed " + "~");
                //                    errorCnt++;
                //                }
                //            }
                //            else
                //            {
                //                error.Append(" " + outputTable.Columns[c + 1].ColumnName.ToUpper() + " column not found " + "~");
                //                errorCnt++;
                //            }
                //        }

                //    }
                //    else
                //    {
                //        break;
                //    }
                //    count++;
                //}
                //while (FileStream.Peek() != -1);
                //if (errorCnt > 0)
                //{
                //    objModel.ErrorValue = error.ToString();
                //    ViewBag.Error_Value = error.ToString();

                //}
                //else
                //{
                //    //count = 0;
                //    //do
                //    //{
                //    //    if (count != 0)
                //    //    {
                //    //        string InputText;
                //    //        //InputText = FileStream.ReadLine();
                //    //        InputText = FileStream.ReadToEnd();
                //    //        // extract the fields
                //    //        string[] inputFields = InputText.Split(',');
                //    //        DataRow dr = dt.NewRow();
                //    //        string outputText = string.Empty;
                //    //        for (int j = 0; j < inputFields.Length; j++)
                //    //        {
                //    //            outputText = inputFields[j].TrimStart(' ').TrimEnd(' ');
                //    //            // outputText = outputText.Replace("\r\n", string.Empty).Replace("\n", string.Empty).Replace("\r", string.Empty);
                //    //            outputText = outputText.Replace("\\", string.Empty);
                //    //            outputText = outputText.Replace("  ", string.Empty);
                //    //            outputText = outputText.Replace("\"", string.Empty);
                //    //            dr[j] = outputText;
                //    //        }

                //    //        dt.Rows.Add(dr);
                //    //    }
                //    //    count++;
                //    //}
                //    //while (FileStream.Peek() != -1);


                //    count = 0;
                //    //do
                //    //{
                //    //    if (count != 0)
                //    //    {
                //    string InputText;
                //    //InputText = FileStream.ReadLine();
                //    InputText = FileStream.ReadToEnd();
                //    string[] rowArray;
                //    rowArray = InputText.Replace("\r\n", "╣").Split('╣');//ALT 185
                //    // extract the fields
                //    foreach (string cell in rowArray)
                //    {
                //        string[] inputFields = cell.Split(',');
                //        DataRow dr = dt.NewRow();
                //        string outputText = string.Empty;
                //        for (int j = 0; j < inputFields.Length; j++)
                //        {
                //            outputText = inputFields[j].TrimStart(' ').TrimEnd(' ');
                //            outputText = outputText.Replace("\r\n", string.Empty).Replace("\n", string.Empty).Replace("\r", string.Empty);
                //            outputText = outputText.Replace("\\", string.Empty);
                //            outputText = outputText.Replace("  ", string.Empty);
                //            outputText = outputText.Replace("\"", string.Empty);
                //            dr[j] = outputText;
                //        }
                //        dt.Rows.Add(dr);
                //    }

                //    //    }
                //    //    count++;
                //    //}
                //    //while (FileStream.Peek() != -1);
                BL_Customer _blCustomer = new BL_Customer();
                DataSet dsValues = new DataSet();
                DataTable dtCust = new DataTable();
                object res;
                res = _blCustomer.GetCustomerExcelToDataTable(file, entity, _objcurrentInfo.GetCompanyCode());
                if (res.GetType() == typeof(String))
                {
                    ViewBag.Error_Value = res.ToString();
                }
                else if (res.GetType() == typeof(DataTable))
                {
                    dtCust = (DataTable)res;
                    if (dtCust.Rows.Count > 0)
                    {
                        dsValues.Tables.Add(dtCust);
                        dsValues.AcceptChanges();
                        string excelContent = GetExcelUploadedCustomers(ds, dsValues);
                        //DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                        //objModel.Value = objJson.Serialize(dsValues);
                        objModel.Value = excelContent;
                    }
                }
                else
                {
                    ViewBag.Error_Value = "Sorry. Something went wrong. Please try again later";
                }
                // }

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ExcelUpload()");
                ViewBag.Error_Value = ex.Message + "~";
            }
            finally
            {
                FileStream.Close();
                FileStream.Dispose();
            }
            objModel.Entity = collection["Entity"].ToString();
            objModel.Table_Name = collection["Table_Name"].ToString();
            objModel.Region_Code = collection["Region_Code"].ToString();
            ViewBag.Entity = GetEntityColumnName(collection["Table_Name"].ToString() + "_" + collection["Entity"].ToString());
            ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString(); ;
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");

            return View("DataQuality", objModel);
        }

        public ActionResult DataQuality(string id)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();

            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string selectedRegionCode = Session["SeletedRegionCode"].ToString();
            string treeselectedregionName = string.Empty;

            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();

            //ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();


            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }



            //  ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString(); ;
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.UserCode = Session["User_Code"].ToString();
            return View(objModel);
        }

        public ActionResult BulkCopy(string id)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            objModel.Entity = id.Split('_')[1];
            objModel.Table_Name = id.Split('_')[0];
            // objModel.Region_Code = collection["Region_Code"].ToString();
            ViewBag.EntityColumns = GetEntityColumnName(id);

            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string selectedRegionCode = Session["SeletedRegionCode"].ToString();
            string treeselectedregionName = string.Empty;

            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();

            //ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();


            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }



            //  ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString(); ;
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View(objModel);
        }

        /// <summary>
        /// Get Doctor Master data
        /// </summary> 
        public JsonResult GetEntityColumnName(string id)
        {
            try
            {
                string entity = id.Split('_')[1];
                string tableName = id.Split('_')[0];
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + entity + "','" + tableName + "'";
                    ds = _objData.ExecuteDataSet(strQry);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //[]

        /// <summary>
        /// Get Doctor Master data
        /// </summary> 
        public JsonResult GetCustomerEntityDetails(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hdGetCustomerEntityDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Entity"].ToString() + "','" + collection["Table_Name"].ToString() + "','" + collection["Mode"].ToString() + "','" + collection["RegionCode"].ToString() + "';";
                    ds = _objData.ExecuteDataSet(strQry);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        [HttpPost]
        public string BulkCopy(FormCollection collection)
        {
            try
            {
                string[] ar;
                ar = collection["Inherited_Region"].Split(',');
                StringBuilder query = new StringBuilder();
                for (int i = 0; i < ar.Length; i++)
                {
                    query.Append("exec SP_hdInsertCustomerApproval '" + _objcurrentInfo.GetCompanyCode() + "','" + _objcurrentInfo.GetRegionCode() + "','" + ar[i].ToString() + "','" + _objcurrentInfo.GetUserCode() + "'");
                }
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet(query.ToString());
                }

                return "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "BulkCopy()");
                return "FAILURE" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetInheritedCustomers(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                string qry = "";
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    // qry = "exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["EntityName"].ToString() + "','" + collection["TableName"].ToString() + "'";
                    qry = "exec SP_hdGetCustomerEntityDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Inherited_Region"].ToString() + "','" + collection["EntityName"].ToString() + "'";
                    ds = _objData.getDataSet(qry);
                }
                // ds = _objSPData.GetInheritedCustomers(_objcurrentInfo.GetCompanyCode(), collection["Inherited_Region"].ToString(), collection["EntityName"].ToString());
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return new LargeJsonResult() { Data = objJson.Serialize(ds), MaxJsonLength = int.MaxValue };
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetApprovedInheritedCustomers(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                string qry = "";
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    //qry = "exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["EntityName"].ToString() + "','" + collection["TableName"].ToString() + "'";
                    qry = "exec SP_hdGetApprovedCustomerEntityDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + _objcurrentInfo.GetRegionCode() + "','" + collection["EntityName"].ToString() + "'";
                    ds = _objData.getDataSet(qry);
                }
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(ds));
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string CopyCustomers(FormCollection collection)
        {
            string result = "";
            try
            {
                CurrentInfo curInfo = new CurrentInfo();

                string selectedRegionCode = string.Empty;
                if (Session["SeletedRegionCode"] != null && Session["SeletedRegionCode"] != "")
                {
                    selectedRegionCode = curInfo.GetDoctorMasterSelectedRegion();
                }
                else
                {
                    selectedRegionCode = Session["Region_Code"].ToString();

                }
                string[] ar;

                ar = collection["CustomerCodes"].Split('^');
                StringBuilder query = new StringBuilder();
                for (int i = 0; i < ar.Length - 1; i++)
                {
                    query.Append("exec SP_hdInsertCustomerInheritance '" + _objcurrentInfo.GetCompanyCode() + "','" + ar[i].ToString().Split('_')[0] + "','" + selectedRegionCode + "','" + ar[i].ToString().Split('_')[1] + "','" + _objcurrentInfo.GetUserCode() + "','" + collection["EntityName"].ToString() + "';");
                }
                if (query.ToString() != "")
                {
                    DataSet ds = new DataSet();
                    _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                    {
                        result = _objData.ExecuteScalar(query.ToString()).ToString();
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "CopyCustomers()");
                return "FAILURE" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult CheckCustomerApproval()
        {
            try
            {
                DataSet ds = new DataSet();
                string qry = "";
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    qry = "exec SP_hdCheckCustomerApproval '" + _objcurrentInfo.GetCompanyCode() + "','" + _objcurrentInfo.GetRegionCode() + "'";
                    ds = _objData.getDataSet(qry);
                }

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(ds));
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public ActionResult SingleAdd(string id)
        {
            _objIconfigsettings = new Config_Settings();
            string ccm_ConfigValue = string.Empty;
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            objModel.Entity = id.Split('_')[1].ToString();
            objModel.Table_Name = id.Split('_')[0].ToString();
            ViewBag.Entity = GetEntityColumnName(id);
            CurrentInfo curInfo = new CurrentInfo();
            // ViewBag.Entity = GetCustomerEntityColumns(id.Split('_')[1].ToString(), id.Split('_')[0].ToString());

            // ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            IConfig_Settings = new Config_Settings();
            if (objModel.Entity.Equals("CHEMIST"))
            {
                ViewBag.ChemistMandatoryField = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.CUSTOMER,
              CONFIG_KEY.CHEMIST_MASTER_MANDATORY_COLUMNS);
            }
            if (objModel.Entity.Equals("DOCTOR"))
            {
                ViewBag.DoctorMandatoryField = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.CUSTOMER,
                      CONFIG_KEY.DOCTOR_MASTER_MANDATORY_COLUMNS);

                ViewBag.DupicationCheckValue = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.KYD,
                     CONFIG_KEY.DOCTOR_DUPLICATE_KEY_CHECK_COLUMN);
            }

            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string selectedRegionCode = string.Empty;
            if (Session["SeletedRegionCode"] != null && Session["SeletedRegionCode"] != "")
            {
                selectedRegionCode = curInfo.GetDoctorMasterSelectedRegion();
            }
            else
            {
                selectedRegionCode = Session["Region_Code"].ToString();

            }
            string treeselectedregionName = string.Empty;


            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }


            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.UserCode = Session["User_Code"].ToString();
            //CCM New Doctor Add - Restriction
            ccm_ConfigValue = _objIconfigsettings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.CUSTOMER, CONFIG_KEY.IS_CCM_ENABLED);
            ViewBag.ConfigValue = ccm_ConfigValue;
            return View(objModel);
        }
        [HttpPost]
        public string SingleAdd(FormCollection collection)
        {
            string result = "";
            try
            {
                string customerCode = "";
                StringBuilder qry = new StringBuilder();
                DataSet dsCus = new DataSet();
                string isEdit = "N";
                string effectiveTo = "", effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"); string appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                string appliedBy = "";

                if (collection["Status"].ToString().ToUpper() != "UNLISTED")
                {
                    _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                    {
                        qry.Append("exec SP_hdGetDocDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["CustomerCode"].ToString() + "','" + collection["Status"].ToString() + "'");
                        dsCus = _objData.getDataSet(qry.ToString());
                    }
                    _objData.CloseConnection();
                }

                if (dsCus.Tables.Count > 0)
                {
                    if (dsCus.Tables[0].Rows.Count > 0)
                    {
                        effectiveFrom = dsCus.Tables[0].Rows[0]["Effective_From"].ToString();
                        if (!string.IsNullOrEmpty(effectiveFrom))
                        {
                            effectiveFrom = Convert.ToDateTime(effectiveFrom).ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        effectiveTo = dsCus.Tables[0].Rows[0]["Effective_To"].ToString();
                        if (!string.IsNullOrEmpty(effectiveTo))
                        {
                            effectiveTo = Convert.ToDateTime(effectiveTo).ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        appliedDate = dsCus.Tables[0].Rows[0]["Applied_Date"].ToString();
                        if (!string.IsNullOrEmpty(appliedDate))
                        {
                            appliedDate = Convert.ToDateTime(appliedDate).ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        if (collection["Status"].ToString() == "2")
                        {
                            appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                            effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                            appliedBy = _objcurrentInfo.GetUserCode();
                        }
                        else if (collection["Status"].ToString() == "1")
                        {
                            if (collection["EntityName"].ToString().ToUpper() == "DOCTOR")
                            {
                                if (dsCus.Tables[0].Rows[0]["Speciality_Code"].ToString().ToUpper() != collection["SpecialityCode"].ToString().ToUpper())
                                {
                                    isEdit = "Y";
                                }
                                if (dsCus.Tables[0].Rows[0]["Category"].ToString().ToUpper() != collection["CategoryCode"].ToString().ToUpper())
                                {
                                    isEdit = "Y";
                                }
                            }
                            if (dsCus.Tables[0].Rows[0]["Customer_Name"].ToString().ToUpper() != collection["CustomerName"].ToString().ToUpper())
                            {
                                isEdit = "Y";
                            }
                            if (dsCus.Tables[0].Rows[0]["MDL_Number"].ToString().ToUpper() != collection["MDL"].ToString().ToUpper())
                            {
                                isEdit = "Y";
                            }
                        }
                        else if (collection["Status"].ToString() == "0")
                        {
                            if (collection["TransferMode"].ToString().ToUpper() == "ISAPPLIED")
                            {
                                appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                            }
                        }
                        else
                        {
                        }
                    }
                }
                if (collection["EntityName"].ToString().ToUpper() != "STOCKIEST")
                {
                    DataSet dsHistory = new DataSet();
                    if (collection["Mode"].ToString().ToUpper() != "INSERT" && collection["Status"].ToString() != "2")
                    {
                        if ((collection["Status"].ToString() == "1" && isEdit == "Y") || (collection["Status"].ToString() == "0" && collection["TransferMode"].ToString().ToUpper() == "ISAPPLIED"))
                        {
                            effectiveTo = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        if (collection["TransferMode"].ToString().ToUpper() == "ISAPPLIED")
                        {
                            isEdit = "Y";
                        }
                        if (isEdit == "Y")
                        {
                            appliedDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                            effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        StringBuilder historyQry = new StringBuilder();
                        dsHistory = CheckHistory(collection["CustomerCode"].ToString(), collection["RegionCode"].ToString(), collection["Status"].ToString(),
                            collection["Columns"].ToString(), collection["ColumnValues"].ToString(), dsCus, isEdit);
                        if (dsHistory.Tables[0].Rows.Count > 0)
                        {
                            for (var j = 0; j < dsHistory.Tables[0].Rows.Count; j++)
                            {
                                historyQry.Append("EXEC SP_hdInsertCustomerHistory '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["CustomerCode"].ToString() + "',");
                                historyQry.Append(" '" + collection["RegionCode"].ToString() + "','" + dsHistory.Tables[0].Rows[j]["Changed_Column"].ToString() + "',");
                                historyQry.Append(" '" + dsHistory.Tables[0].Rows[j]["Old_Value"].ToString() + "',");
                                historyQry.Append(" '" + dsHistory.Tables[0].Rows[j]["New_Value"].ToString() + "',");
                                historyQry.Append(" '" + collection["EntityName"].ToString().ToUpper() + "','" + effectiveTo + "'");
                            }
                            int historyResult = 0;
                            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                            {
                                historyResult = _objSPData.ExecuteStoredProcedure("ExecQuery", historyQry.ToString(), _objcurrentInfo.GetCompanyCode());
                            }
                            _objData.CloseConnection();
                            if (historyResult == 1)
                            {
                                result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                  collection["Values"].ToString(), collection["CustomerCode"].ToString(), collection["Mode"].ToString(), collection["Latitude"].ToString(),
                                  collection["Longitude"].ToString(), isEdit, effectiveFrom, appliedDate, collection["Status"].ToString(), collection["DCRVisitCode"].ToString());
                                if (result.Split(':')[0].ToUpper() == "SUCCESS")
                                {
                                    if (collection["EntityName"].ToString().ToUpper() == "DOCTOR")
                                    {
                                        if (collection["Mode"].ToString().ToUpper() == "INSERT")
                                        {
                                            customerCode = result.Split(':')[1];
                                        }
                                        else
                                        {
                                            customerCode = collection["CustomerCode"].ToString();
                                        }
                                        if (collection["No_Of_Product"] != null)
                                        {
                                            string productCode = "", supportQty = "", potentialQty = "", priority = "";
                                            int productCount = int.Parse(collection["No_Of_Product"].ToString());
                                            qry = new StringBuilder();
                                            string[] arProducts = collection["Products"].ToString().Split('|');
                                            if (arProducts.Length > 1)
                                            {
                                                qry.Append("EXEC SP_hdDeleteDocProMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "','" + collection["RegionCode"].ToString() + "';");
                                                for (int i = 0; i < arProducts.Length - 1; i++)
                                                {
                                                    string[] productRow = arProducts[i].Split('$');
                                                    productCode = productRow[0].ToString();
                                                    supportQty = productRow[1].ToString();
                                                    potentialQty = productRow[2].ToString();
                                                    priority = productRow[3].ToString();

                                                    qry.Append("EXEC SP_hdInsertDoctorProductMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "',");
                                                    qry.Append(" '" + collection["RegionCode"].ToString() + "','" + productCode + "','" + supportQty + "','" + potentialQty + "','" + priority + "','" + _objcurrentInfo.GetUserName() + "';");
                                                }

                                                DataSet ds = new DataSet();
                                                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                                                {
                                                    ds = _objData.ExecuteDataSet(qry.ToString());
                                                }
                                                _objData.CloseConnection();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                 collection["Values"].ToString(), collection["CustomerCode"].ToString(), collection["Mode"].ToString(), collection["Latitude"].ToString(),
                                 collection["Longitude"].ToString(), isEdit, effectiveFrom, appliedDate, collection["Status"].ToString(), collection["DCRVisitCode"].ToString());
                            if (result.Split(':')[0].ToUpper() == "SUCCESS")
                            {
                                if (collection["EntityName"].ToString().ToUpper() == "DOCTOR")
                                {
                                    if (collection["Mode"].ToString().ToUpper() == "INSERT")
                                    {
                                        customerCode = result.Split(':')[1];
                                    }
                                    else
                                    {
                                        customerCode = collection["CustomerCode"].ToString();
                                    }
                                    if (collection["No_Of_Product"] != null)
                                    {
                                        string productCode = "", supportQty = "", potentialQty = "", priority = "";
                                        int productCount = int.Parse(collection["No_Of_Product"].ToString());
                                        qry = new StringBuilder();
                                        string[] arProducts = collection["Products"].ToString().Split('|');
                                        if (arProducts.Length > 1)
                                        {
                                            qry.Append("EXEC SP_hdDeleteDocProMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "','" + collection["RegionCode"].ToString() + "';");
                                            for (int i = 0; i < arProducts.Length - 1; i++)
                                            {
                                                string[] productRow = arProducts[i].Split('$');
                                                productCode = productRow[0].ToString();
                                                supportQty = productRow[1].ToString();
                                                potentialQty = productRow[2].ToString();
                                                priority = productRow[3].ToString();

                                                qry.Append("EXEC SP_hdInsertDoctorProductMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "',");
                                                qry.Append(" '" + collection["RegionCode"].ToString() + "','" + productCode + "','" + supportQty + "','" + potentialQty + "','" + priority + "','" + _objcurrentInfo.GetUserName() + "';");
                                            }

                                            DataSet ds = new DataSet();
                                            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                                            {
                                                ds = _objData.ExecuteDataSet(qry.ToString());
                                            }
                                            _objData.CloseConnection();
                                            result = "SUCCESS:";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                 collection["Values"].ToString(), collection["CustomerCode"].ToString(), collection["Mode"].ToString(), collection["Latitude"].ToString(),
                                 collection["Longitude"].ToString(), isEdit, effectiveFrom, appliedDate, collection["Status"].ToString(), collection["DCRVisitCode"].ToString());
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            if (collection["EntityName"].ToString().ToUpper() == "DOCTOR")
                            {
                                if (collection["Mode"].ToString().ToUpper() == "INSERT")
                                {
                                    customerCode = result.Split(':')[1];
                                }
                                else
                                {
                                    customerCode = collection["CustomerCode"].ToString();
                                }
                                if (collection["No_Of_Product"] != null)
                                {
                                    string productCode = "", supportQty = "", potentialQty = "", priority = "";
                                    int productCount = int.Parse(collection["No_Of_Product"].ToString());
                                    qry = new StringBuilder();
                                    string[] arProducts = collection["Products"].ToString().Split('|');
                                    if (arProducts.Length > 1)
                                    {
                                        qry.Append("EXEC SP_hdDeleteDocProMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "','" + collection["RegionCode"].ToString() + "';");
                                        for (int i = 0; i < arProducts.Length - 1; i++)
                                        {
                                            string[] productRow = arProducts[i].Split('$');
                                            productCode = productRow[0].ToString();
                                            supportQty = productRow[1].ToString();
                                            potentialQty = productRow[2].ToString();
                                            priority = productRow[3].ToString();

                                            qry.Append("EXEC SP_hdInsertDoctorProductMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + customerCode + "',");
                                            qry.Append(" '" + collection["RegionCode"].ToString() + "','" + productCode + "','" + supportQty + "','" + potentialQty + "','" + priority + "','" + _objcurrentInfo.GetUserName() + "';");
                                        }

                                        DataSet ds = new DataSet();
                                        _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                                        {
                                            ds = _objData.ExecuteDataSet(qry.ToString());
                                        }
                                        _objData.CloseConnection();
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    result = _objSPData.InsertCustomerMaster(collection["EntityName"].ToString(), "", collection["RegionCode"].ToString(), collection["Columns"].ToString(),
                                 collection["Values"].ToString(), collection["CustomerCode"].ToString(), collection["Mode"].ToString(), collection["Latitude"].ToString(),
                                 collection["Longitude"].ToString(), isEdit, effectiveFrom, appliedDate, collection["Status"].ToString(), collection["DCRVisitCode"].ToString());
                }

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "SingleAdd()");
                return "FAILURE:" + ex.Message;
            }

        }


        public string ChangeFlexiDocStatus(FormCollection collection)
        {
            string result = "";
            try
            {
                string query = "exec SP_hdChangeFlexiDoctorStatus '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["CustomerName"].ToString() + "','" + collection["DCRCode"].ToString() + "' ;";
                if (query != "")
                {
                    DataSet ds = new DataSet();
                    _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                    {
                        result = _objData.ExecuteScalar(query).ToString();
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ChangeFlexiDocStatus()");
                return "FAILURE" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string ChangeRegionForInheritance(FormCollection collection)
        {
            string result = "";
            try
            {

                string query = "exec SP_hdChangeRegionForInheritance '" + _objcurrentInfo.GetCompanyCode() + "','" + _objcurrentInfo.GetRegionCode() + "' ;";
                if (query != "")
                {
                    DataSet ds = new DataSet();
                    _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                    {
                        result = _objData.ExecuteScalar(query).ToString();
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ChangeRegionForInheritance()");
                return "FAILURE" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public ActionResult Download(string Entity)
        {
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            objBLCustomer = new BL_Customer();
            string error = string.Empty;

            string companyCode = _objcurrentInfo.GetCompanyCode();

            string fileName = objBLCustomer.GetCustomerCSVTemplate(companyCode, Entity);
            //string blobURL = objProvider.GetConfigValue("UPLOADEDFILEBLOBURL") + _objcurrentInfo.GetCompanyCode().ToLower() + "/" + fileName;

            //objFileDownload.DownloadFile(blobURL, fileName, out error);

            return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + fileName.ToUpper(), FileDownloadName = fileName.ToUpper() };
        }
        public ActionResult HDInsights(string id)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            objModel.Entity = id.Split('_')[1].ToString();
            objModel.Table_Name = id.Split('_')[0].ToString();
            ViewBag.Entity = GetEntityColumnName(id);
            CurrentInfo curInfo = new CurrentInfo();

            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string selectedRegionCode = string.Empty;
            if (Session["SeletedRegionCode"] != null && Session["SeletedRegionCode"] != "")
            {
                selectedRegionCode = curInfo.GetDoctorMasterSelectedRegion();
            }
            else
            {
                selectedRegionCode = Session["Region_Code"].ToString();

            }
            string treeselectedregionName = string.Empty;


            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }


            return View(objModel);
        }
        public ActionResult HDDataQuality(string id)
        {
            Models.DoctorMasterModel objModel = new Models.DoctorMasterModel();
            objModel.Entity = id.Split('_')[1].ToString();
            objModel.Table_Name = id.Split('_')[0].ToString();
            ViewBag.Entity = GetEntityColumnName(id);
            CurrentInfo curInfo = new CurrentInfo();

            BLMaster _objBLMaster = new BLMaster();
            List<MVCModels.RegionModel> lstregionName = new List<MVCModels.RegionModel>();
            string selectedRegionCode = string.Empty;
            if (Session["SeletedRegionCode"] != null && Session["SeletedRegionCode"] != "")
            {
                selectedRegionCode = curInfo.GetDoctorMasterSelectedRegion();
            }
            else
            {
                selectedRegionCode = Session["Region_Code"].ToString();

            }
            string treeselectedregionName = string.Empty;


            lstregionName = _objBLMaster.GetSeletedRegionName(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
            if (lstregionName != null && lstregionName.Count > 0)
            {
                treeselectedregionName = lstregionName[0].Region_Name;
            }

            if (!string.IsNullOrEmpty(selectedRegionCode))
            {
                // ViewBag.SelectedRegion_Code = selectedRegionCode;
                ViewBag.sessionRegionCode = selectedRegionCode + "^" + treeselectedregionName;
            }
            else
            {

                ViewBag.sessionRegionCode = Session["Region_Code"].ToString() + "^" + Session["Region_Name"].ToString();
            }






            return View(objModel);
        }
        public JsonResult GetCustomerCount(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hdGetDoctorMaster '" + _objcurrentInfo.GetCompanyCode() + "','ALL','" + collection["RegionCode"].ToString() + "','" + collection["Entity"].ToString() + "';";
                    ds = _objData.getDataSet(strQry);
                }
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                // return Json(objJson.Serialize(ds));
                return new LargeJsonResult() { Data = objJson.Serialize(ds), MaxJsonLength = int.MaxValue };
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetDataQuality(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec sp_hdDataQuality '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["Entity"].ToString() + "';";
                    ds = _objData.getDataSet(strQry);
                }

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(ds));
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionwiseUser(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hdGetRegionWiseUser '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','';";
                    ds = _objData.getDataSet(strQry);
                }
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(ds));
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // History check
        public DataSet CheckHistory(string customerCode, string regionCode, string status, string columnNames, string columnValues, DataSet ds, string isEdit)
        {
            DataSet dsCustomer = new DataSet();
            DataTable dt = new DataTable();
            DataColumn dcColumnName = new DataColumn("Changed_Column");
            DataColumn dcOldValue = new DataColumn("Old_Value");
            DataColumn dcNewValue = new DataColumn("New_Value");
            dt.Columns.Add(dcColumnName);
            dt.Columns.Add(dcOldValue);
            dt.Columns.Add(dcNewValue);
            string[] columns;
            string[] values;
            columns = columnNames.Split(',');
            values = columnValues.Split('|');
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < columns.Length; i++)
                    {
                        if (ds.Tables[0].Rows[0][columns[i]].ToString().ToUpper() != values[i].ToUpper())
                        {
                            DataRow dr = dt.NewRow();
                            dr[0] = columns[i];
                            dr[1] = ds.Tables[0].Rows[0][columns[i]].ToString();
                            dr[2] = values[i];
                            dt.Rows.Add(dr);
                        }
                    }
                    if (isEdit.ToUpper() == "Y")
                    {
                        DataRow drr = dt.NewRow();
                        drr[0] = "Customer_Status";
                        drr[1] = status;
                        drr[2] = "2";
                        dt.Rows.Add(drr);
                    }
                    dsCustomer.Tables.Add(dt);
                }
            }
            return dsCustomer;
        }

        public string GetCustomers(FormCollection collection)
        {
            StringBuilder tableContent = new StringBuilder();


            //string strQry = "exec SP_hdGetCustomerEntityDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["Entity"].ToString() + "','" + collection["Table_Name"].ToString() + "','" + collection["Mode"].ToString() + "','" + collection["RegionCode"].ToString() + "';";
            if (collection["PageName"].ToString().ToUpper() == "SINGLE")
            {
                tableContent.Append(GetCustomerTable(collection["EntityName"].ToString(), "HD", collection["Mode"].ToString(), collection["RegionCode"].ToString()));
            }
            else if (collection["PageName"].ToString().ToUpper() == "BULK")
            {
                tableContent.Append(GetBulkCustomerTable(collection["EntityName"].ToString(), "HD", collection["Mode"].ToString(),
                    collection["RegionCode"].ToString(), Convert.ToInt32(collection["PageNum"].ToString()), collection["EmptyRows"].ToString(),
                    collection["privilageValue"].ToString(), collection["status"].ToString(), Convert.ToString(collection["SearchKey"]),
                    Convert.ToString(collection["Customer_Edit"])));
            }
            else
            {

            }
            return tableContent.ToString();
        }

        public DataSet GetCustomerData(string entity, string tableName, string mode, string regionCode, int pageNum, string pageName)
        {
            try
            {
                DataSet dsRes = new DataSet();
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    StringBuilder strQry = new StringBuilder();
                    strQry.Append("exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + entity + "','" + tableName + "'");
                    strQry.Append("exec SP_hdGetDoctorMaster '" + _objcurrentInfo.GetCompanyCode() + "','" + mode + "','" + regionCode + "','" + entity + "';");
                    strQry.Append(" exec SP_hdGetDoctorSaleProductRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + regionCode + "';");
                    dsRes = _objData.ExecuteDataSet(strQry.ToString());
                }
                return dsRes;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetBulkCustomerData(string entity, string tableName, string mode, string regionCode, int pageNum, string pageName, string searckKey)
        {
            try
            {
                DataSet dsRes = new DataSet();
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    StringBuilder strQry = new StringBuilder();
                    strQry.Append("exec SP_hdGetEntityColumn '" + _objcurrentInfo.GetCompanyCode() + "','" + entity + "','" + tableName + "'");
                    strQry.Append("exec SP_hdGetDoctorMasterWithSearch '" + _objcurrentInfo.GetCompanyCode() + "','" + mode + "','"
                        + regionCode + "','" + entity + "','" + searckKey + "';");
                    ds = _objData.ExecuteDataSet(strQry.ToString());
                    dsRes = ds.Copy();
                    dsRes.AcceptChanges();
                }
                if (pageName.ToUpper() == "BULK")
                {
                    DataTable dataTable = new DataTable();
                    DataSet dsData = new DataSet();
                    dsData = ds.Clone();
                    int skip = Convert.ToInt32(pageNum) * 50;
                    IEnumerable<DataRow> dr = ds.Tables[0].AsEnumerable();
                    IEnumerable<DataRow> dr1 = ds.Tables[1].AsEnumerable().Skip(skip).Take(50);
                    // IEnumerable<DataRow> dr2 = ds.Tables[2].AsEnumerable();
                    foreach (DataRow row in dr)
                    {
                        dsData.Tables[0].ImportRow(row);
                    }
                    foreach (DataRow row1 in dr1)
                    {
                        dsData.Tables[1].ImportRow(row1);
                    }
                    //foreach (DataRow row2 in dr2)
                    //{
                    //    dsData.Tables[2].ImportRow(row2);
                    //}
                    dsData.AcceptChanges();
                    dsRes = dsData.Copy();
                    dsRes.AcceptChanges();
                }
                noOfPagesIncustomerMaster = ds.Tables[1].Rows.Count;
                return dsRes;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string GetCustomerTable(string entity, string tableName, string mode, string regionCode)
        {
            DataSet ds = new DataSet();
            ds = GetCustomerData(entity, tableName, mode, regionCode, 0, "SINGLE");
            StringBuilder content = new StringBuilder();
            if (ds.Tables[0].Rows.Count > 0)
            {
                content.Append("<table style='width:100% !important;' id='tblDoctor'><thead  style='background-color:#F8F8F8;'><tr><th id='tdMain' style='min-width:20px !important;background-color:#f8f8f8;'></th>");
                for (var i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (ds.Tables[0].Rows[i]["Display_Option"].ToString() == "Y")
                    {
                        content.Append("<th style='white-space:nowrap;'>" + ds.Tables[0].Rows[i]["Field_Alias_Name"] + "</th>");
                    }
                    else
                    {
                        content.Append("<th style='display:none'>" + ds.Tables[0].Rows[i]["Field_Alias_Name"] + "</th>");
                    }
                }
                content.Append("<th>Customer Status</th>");
                content.Append("<th>Delete</th>");
                content.Append("</tr></thead><tbody>");
                for (var j = 0; j < ds.Tables[1].Rows.Count; j++)
                {
                    content.Append("<tr id='tr_" + j + "' onclick='fnBindEntityDetails(this," + j + ");'><th  style='min-width:5px !important;background-color:#f8f8f8;'></th>");
                    for (var k = 0; k < ds.Tables[0].Rows.Count; k++)
                    {
                        if (ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] == null)
                        {
                            ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] = "";
                        }
                        if (ds.Tables[0].Rows[k]["Display_Option"].ToString() == "Y")
                        {
                            if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "SPECIALITY_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Speciality_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "CATEGORY")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Category_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "SUBREGION_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Subregion_Name"] + "</td>");
                            }

                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "CUSTOMER_GROUP")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "' >" + ds.Tables[1].Rows[j]["Customer_Group_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "DEPOT_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Depot_Name"] + "</td>");
                            }
                            else
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] + "</td>");
                            }
                        }
                        else
                        {
                            content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "' style='display:none'>" + ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] + "</td>");
                        }
                    }
                    content.Append("<td id='td_Customer_Status_" + j + "'>" + ds.Tables[1].Rows[j]["Customer_Status"].ToString() + "</td>");
                    if (ds.Tables[1].Rows[j]["Customer_Status"].ToString().ToUpper() == "UNLISTED")
                    {
                        content.Append("<td id='td_Delete_" + j + "'><div class='delete' onclick='fnDeleteFlexiEntry(\"" + ds.Tables[1].Rows[j]["Customer_Name"] + "\",\"" + ds.Tables[1].Rows[j]["DCR_Code"] + "\",\"SINGLE\");'></div>");
                    }
                    else
                    {
                        content.Append("<td id='td_Delete_" + j + "'>");
                    }
                    content.Append("<input type='hidden' id='hdnSpecialityCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Speciality_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCategory_" + j + "' value='" + ds.Tables[1].Rows[j]["Category"] + "'/>");
                    content.Append("<input type='hidden' id='hdnSubRegionCode_" + j + "' value='" + ds.Tables[1].Rows[j]["SubRegion_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCustomerCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Customer_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnDepotCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Depot_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnLat_" + j + "' value='" + ds.Tables[1].Rows[j]["Latitude"] + "'/>");
                    content.Append("<input type='hidden' id='hdnLog_" + j + "' value='" + ds.Tables[1].Rows[j]["Longitude"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCustomerGroup_" + j + "' value='" + ds.Tables[1].Rows[j]["Customer_Group"] + "'/>");
                    content.Append("<input type='hidden' id='hdnDCRVisitCode_" + j + "' value='" + ds.Tables[1].Rows[j]["DCR_Code"] + "'/> </td>");
                    content.Append("</tr>");
                }

                content.Append("<tbody></table>");
            }
            return content.ToString();
        }

        public JsonResult GetSalesProductByRegion(FormCollection collection)
        {
            try
            {
                DataSet dsProduct = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = " exec SP_hdGetDoctorSaleProductRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "';";
                    dsProduct = _objData.ExecuteDataSet(strQry);
                }

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(dsProduct));
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetBulkCustomerTable(string entity, string tableName, string mode, string regionCode, int pageNum,
            string emptyRows, string privilageValue, string status, string searckKey, string customerEdit)
        {
            double tableWidth = 0.00;
            StringBuilder content = new StringBuilder();
            DataSet ds = new DataSet();
            // ds = GetCustomerData(entity, tableName, mode, regionCode, pageNum, "BULK");
            ds = GetBulkCustomerData(entity, tableName, mode, regionCode, pageNum, "BULK", searckKey);
            if (ds.Tables[0].Rows.Count > 0)
            {
                content.Append("<table class='filterable' id='tblBulkDoctor' style='width:100% !important;'>");
                content.Append("<thead style='background-color:#F8F8F8;' id='tblHeadBulkDoctor'>");
                content.Append("<tr style='height:35px;'>");
                content.Append("<th id='tdMain_' style='min-width:25px !important;background-color:#F2F2F2;'></th>");
                content.Append("<th id='tdMain_ChkSelectBox' style='min-width:20px !important;'><input type='checkbox' id='chkSelect' name='chkSelect' onclick='fnSelectAll()';/></th><th style='min-width:20px !important;'>S.No</th>");
                for (var h = 0; h < ds.Tables[0].Rows.Count; h++)
                {
                    if (ds.Tables[0].Rows[h]["Display_Option"].ToString() == "Y")
                    {
                        content.Append("<th id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "' style='min-width:150px !important;' >");
                        content.Append("<div style='width:150px !important;' id='dvTh_" + ds.Tables[0].Rows[h]["Field_Name"] + "'>"
                            + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "</div></th>");
                        tableWidth = Convert.ToDouble(tableWidth) + 150;
                    }
                    else
                    {
                        content.Append("<th id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "'  style='display:none;'>");
                        content.Append("<div id='dvTh_" + ds.Tables[0].Rows[h]["Field_Name"] + "'>" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                            + "</div></th>");
                    }
                }
                content.Append("<th><div>Mode</div></th>");
                content.Append("<th><div style='width:80px !important;'>Transfer to apply <input type='checkbox' id='chkTransferSelect' name='chkTransferSelectAll' onclick='fnTransferSelectAll();' /></div></th>");
                content.Append("<th style='min-width:80px !important;' onclick='fnShowMore();' class='dvDownArrow'><div style='width:80px !important;'></div></th>");
                content.Append("</thead><tbody>");
                //bind table body
                int sNo = pageNum * 50;
                if (emptyRows.ToUpper() == "YES")
                {
                    content.Append("<tr id='tr_1'>");
                    content.Append("<td id='tdMain_1' style='min-width:20px !important;background-color:#f8f8f8' class='dataTableTdCss'>");
                    content.Append("</td>");
                    content.Append("<td style='min-width:20px !important;'><input type='checkbox' id='chkSelect_1' name='chkSelectCustomer'/></td>");
                    content.Append("<td style='width:20px !important;'>" + ((sNo) + 1) + "</td>");
                    for (var h = 0; h < ds.Tables[0].Rows.Count; h++)
                    {
                        string dateClassName = "";
                        string displayClass = "";
                        string width = "";
                        if (ds.Tables[0].Rows[h]["DATA_TYPE"].ToString().Substring(0, 4).ToUpper() == "DATE")
                        {
                            if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DOB" ||
                                ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "ANNIVERSARY_DATE")
                            {
                                dateClassName = "DOBDatePicker";
                            }
                            else
                            {
                                dateClassName = "datepicker";
                            }
                        }
                        if (ds.Tables[0].Rows[h]["Display_Option"].ToString() == "N")
                        {
                            displayClass = "display:none !important;";
                            width = "width:150px !important;";
                        }
                        else
                        {
                            width = "min-width:150px !important;";
                        }
                        if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SPECIALITY_CODE")
                        {//
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " "
                                + displayClass + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput autoSpeciality' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value=''");
                            content.Append("onblur='fnHideTextBox(this,1,\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                        }
                        else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CATEGORY")
                        {
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " "
                                + displayClass + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput autoCategory' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value='' onblur='fnHideTextBox(this,1,\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "'/></td>");
                        }
                        else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SUBREGION_CODE")
                        {
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " "
                                + displayClass + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput autoSubRegion' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value='' onblur='fnHideTextBox(this,1,\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                        }
                        else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_GROUP")
                        {
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " "
                                + displayClass + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput autoCustomerGroup' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value='' onblur='fnHideTextBox(this,1,\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                        }
                        else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DEPOT_CODE")
                        {
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " "
                                + displayClass + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput autoDepot' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value='' onblur='fnHideTextBox(this,1,\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                        }
                        else
                        {
                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1' style='" + width + " " + displayClass
                                + "' class='dataTableTdCss'>");
                            content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='" + ds.Tables[0].Rows[h]["Len"]
                                + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_1'");
                            content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this,1,\""
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                        }
                    }
                    content.Append("<td  class='dataTableTdCss' id='tdStatus_1'>");
                    content.Append("</td>");
                    content.Append("<td  id='tdApplied_1' class='dataTableTdCss'>");
                    content.Append("<input type='checkbox' id='chkIsApplied_1' style='display:none' name='chkStatusChange' />");
                    content.Append("</td>");
                    content.Append("<td style='min-width:80px !important;'><div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...</div><input type='hidden' id='hdnCategory_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnSpecialityCode_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnSubRegionCode_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnCustomerGroup_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnCustomerCode_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnDepotCode_1' value=''/>");
                    content.Append("<input type='hidden' id='hdnHistory_1' value='N'/>");
                    content.Append("<input type='hidden' id='hdnDCRVisitCode_1' value=''/>");//
                    content.Append("<input type='hidden' id='hdnEdit_1' value='INSERT'/></td>");
                    content.Append("</tr>");
                    sNo = (sNo) + 1;
                }
                else
                {
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        for (var r = 0; r < ds.Tables[1].Rows.Count; r++)
                        {
                            status = Convert.ToString(ds.Tables[1].Rows[r]["Customer_Status"]);
                            content.Append("<tr id='tr_" + (r + 1) + "'>");
                            content.Append("<td id='tdMain_" + (r + 1) + "' style='min-width:20px !important;background-color:#f8f8f8' class='dataTableTdCss'>");
                            content.Append("</td>");
                            content.Append("<td style='min-width:20px !important;'><input type='checkbox' id='chkSelect_" + (r + 1) + "' name='chkSelectCustomer'/></td>");
                            content.Append("<td style='width:20px !important;'>" + ((sNo) + 1) + "</td>");
                            for (var h = 0; h < ds.Tables[0].Rows.Count; h++)
                            {
                                if (ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] == null)
                                {
                                    ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] = "";
                                }
                                string dateClassName = "";
                                string displayClass = "";
                                string width = "";
                                if (ds.Tables[0].Rows[h]["DATA_TYPE"].ToString().Substring(0, 4).ToUpper() == "DATE")
                                {
                                    if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DOB" ||
                                        ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "ANNIVERSARY_DATE")
                                    {
                                        dateClassName = "DOBDatePicker";
                                    }
                                    else
                                    {
                                        dateClassName = "datepicker";
                                    }
                                }
                                if (ds.Tables[0].Rows[h]["Display_Option"].ToString() == "N")
                                {
                                    displayClass = "display:none !important;";
                                    width = "width:150px !important;";
                                }
                                else
                                {
                                    width = "min-width:150px !important;";
                                }

                                if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SPECIALITY_CODE")
                                {
                                    #region speciality
                                    if (status == "APPROVED")
                                    {
                                        if (privilageValue == "DISABLED")
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text' disabled='disabled'  class='txtInput autoSpeciality' id='txt_"
                                                + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[1].Rows[r]["Speciality_Name"] + "'");
                                            content.Append("onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                                + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                        }
                                        else
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text'  class='txtInput autoSpeciality' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                                + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[1].Rows[r]["Speciality_Name"] + "'");
                                            content.Append("onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                                + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                        }
                                    }
                                    else
                                    {
                                        content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + width + " "
                                            + displayClass + "' class='dataTableTdCss'>");
                                        content.Append("<input type='text'  class='txtInput autoSpeciality' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                            + "_" + (r + 1) + "'");
                                        content.Append(" value='" + ds.Tables[1].Rows[r]["Speciality_Name"] + "'");
                                        content.Append("onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                            + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                        content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                            + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                    }
                                    #endregion speciality
                                }
                                else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CATEGORY")
                                {
                                    #region category
                                    if (status == "APPROVED")
                                    {
                                        if (privilageValue == "DISABLED")
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text' disabled='disabled' class='txtInput autoCategory' id='txt_"
                                                + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[1].Rows[r]["Category_Name"] + "' onblur='fnHideTextBox(this,"
                                                + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "'/></td>");
                                        }
                                        else
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text' class='txtInput autoCategory' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                                + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[1].Rows[r]["Category_Name"] + "' onblur='fnHideTextBox(this," + (r + 1)
                                                + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "'/></td>");
                                        }
                                    }
                                    else
                                    {
                                        content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                            + width + " " + displayClass + "' class='dataTableTdCss'>");
                                        content.Append("<input type='text' class='txtInput autoCategory' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                            + "_" + (r + 1) + "'");
                                        content.Append(" value='" + ds.Tables[1].Rows[r]["Category_Name"] + "' onblur='fnHideTextBox(this," + (r + 1)
                                            + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                        content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                            + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "'/></td>");
                                    }
                                    #endregion category
                                }
                                else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SUBREGION_CODE")
                                {
                                    #region subregion
                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                        + width + " " + displayClass + "' class='dataTableTdCss'>");
                                    content.Append("<input type='text' class='txtInput autoSubRegion' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                        + "_" + (r + 1) + "'");
                                    content.Append(" value='" + ds.Tables[1].Rows[r]["Subregion_Name"] + "' onblur='fnHideTextBox(this," + (r + 1)
                                        + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                    #endregion subregion
                                }
                                else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_GROUP")
                                {
                                    #region customer group
                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                        + width + " " + displayClass + "' class='dataTableTdCss'>");
                                    content.Append("<input type='text' class='txtInput autoCustomerGroup' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                        + "_" + (r + 1) + "'");
                                    content.Append(" value='" + ds.Tables[1].Rows[r]["Customer_Group_Name"] + "' onblur='fnHideTextBox(this,"
                                        + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                    #endregion customer group
                                }
                                else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DEPOT_CODE")
                                {
                                    #region depot
                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                        + width + " " + displayClass + "' class='dataTableTdCss'>");
                                    content.Append("<input type='text' class='txtInput autoDepot' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                        + "_" + (r + 1) + "'");
                                    content.Append(" value='" + ds.Tables[1].Rows[r]["Depot_Name"] + "' onblur='fnHideTextBox(this," + (r + 1)
                                        + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                    #endregion depot
                                }
                                else
                                {
                                    #region other customer master fields
                                    var value = Convert.ToString(ds.Tables[1].Rows[r][Convert.ToString(ds.Tables[0].Rows[h]["Field_Name"])]);
                                    if (string.IsNullOrEmpty(value))
                                    {
                                        if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "MDL_NUMBER"
                                                    || ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_NAME")
                                        {
                                            #region customer name and mdl number
                                            if (status == "APPROVED")
                                            {
                                                if (privilageValue == "DISABLED")
                                                {
                                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                        + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                    content.Append("<input type='text' disabled='disabled' class='txtInput " + dateClassName + "' maxlength='"
                                                        + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                                    content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this,"
                                                        + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                                        + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                                }
                                                else
                                                {
                                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                        + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                    content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                        + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                                    content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this,"
                                                        + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                                        + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                                }
                                            }
                                            else
                                            {
                                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                    + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                    + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                                content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this,"
                                                    + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                                    + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                    + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                            }
                                            #endregion customer name and mdl number
                                        }
                                        else
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this,"
                                                + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                        }
                                    }
                                    else
                                    {
                                        //sri
                                        if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "MDL_NUMBER"
                                            || ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_NAME")
                                        {
                                            if (status == "APPROVED")
                                            {
                                                if (privilageValue == "DISABLED")
                                                {
                                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1)
                                                        + "' style='" + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                    if (customerEdit == "YES" && ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_NAME")
                                                    {
                                                        content.Append("<input type='text' class='txtInput " + dateClassName
                                                             + "' maxlength='" + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                                              + "_" + (r + 1) + "'");
                                                    }
                                                    else
                                                    {
                                                        content.Append("<input type='text' disabled='disabled' class='txtInput " + dateClassName
                                                        + "' maxlength='" + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"]
                                                         + "_" + (r + 1) + "'");
                                                    }

                                                    content.Append(" value='" + ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                                        + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                                        + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                                }
                                                else
                                                {
                                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1)
                                                        + "' style='" + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                    if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_NAME")
                                                    {
                                                        if (customerEdit == "YES")
                                                        {
                                                            content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                               + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_"
                                                               + (r + 1) + "'");
                                                        }
                                                        else
                                                        {
                                                            content.Append("<input type='text' disabled='disabled' class='txtInput " + dateClassName + "' maxlength='"
                                                        + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_"
                                                         + (r + 1) + "'");
                                                        }
                                                    }
                                                    else
                                                    {
                                                        content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                      + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_"
                                                      + (r + 1) + "'");
                                                    }

                                                    content.Append(" value='" + ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                                        + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                                        + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                        + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                                }
                                            }
                                            else
                                            {
                                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                    + width + " " + displayClass + "' class='dataTableTdCss'>");
                                                content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                    + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                                content.Append(" value='" + ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                                    + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"]
                                                    + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");

                                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                    + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                            }

                                        }

                                        else
                                        {
                                            content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                                + width + " " + displayClass + "' class='dataTableTdCss'>");
                                            content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='"
                                                + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                            content.Append(" value='" + ds.Tables[1].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                                + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                                + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");

                                            content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                                + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                                        }
                                    }
                                    #endregion other customer master fields
                                }
                            }
                            content.Append("<td  class='dataTableTdCss' id='tdStatus_" + (r + 1) + "'>");
                            content.Append(ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper());
                            content.Append("</td>");
                            content.Append("<td  id='tdApplied_" + (r + 1) + "' class='dataTableTdCss'>");
                            if (ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper() != "UNAPPROVED")
                            {
                                content.Append("<input type='checkbox' id='chkIsApplied_" + (r + 1) + "' style='display:none' name='chkStatusChange' />");
                            }
                            else
                            {
                                content.Append("<input type='checkbox' id='chkIsApplied_" + (r + 1) + "' checked name='chkStatusChange' />");
                            }
                            content.Append("</td>");
                            if (r == 0)
                            {
                                if (ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper() == "UNLISTED")
                                {
                                    content.Append("<td style='min-width:80px !important;'><div class='delete' style='margin-left:10px' onclick='fnDeleteFlexiEntry(\"" + ds.Tables[1].Rows[r]["Customer_Name"] + "\",\"" + ds.Tables[1].Rows[r]["DCR_Code"] + "\",\"BULK\");'></div><div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...<input type='hidden' id='hdnCategory_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Category"] + "'/>");
                                }
                                else
                                {
                                    content.Append("<td style='min-width:80px !important;'><div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...</div><input type='hidden' id='hdnCategory_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Category"] + "'/>");
                                }
                            }
                            else
                            {
                                if (ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper() == "UNLISTED")
                                {
                                    content.Append("<td style='min-width:40px !important;'><div class='delete' style='margin-left:10px' onclick='fnDeleteFlexiEntry(\"" + ds.Tables[1].Rows[r]["Customer_Name"] + "\",\"" + ds.Tables[1].Rows[r]["DCR_Code"] + "\",\"BULK\");'></div><input type='hidden' id='hdnCategory_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Category"] + "'/>");
                                }
                                else
                                {
                                    content.Append("<td style='min-width:40px !important;'><input type='hidden' id='hdnCategory_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Category"] + "'/>");
                                }
                            }
                            content.Append("<input type='hidden' id='hdnSpecialityCode_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Speciality_Code"] + "'/>");
                            content.Append("<input type='hidden' id='hdnSubRegionCode_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["SubRegion_Code"] + "'/>");
                            content.Append("<input type='hidden' id='hdnCustomerGroup_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Customer_Group"] + "'/>");
                            content.Append("<input type='hidden' id='hdnCustomerCode_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Customer_Code"] + "'/>");
                            content.Append("<input type='hidden' id='hdnDepotCode_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["Depot_Code"] + "'/>");
                            content.Append("<input type='hidden' id='hdnHistory_" + (r + 1) + "' value='N'/>");
                            content.Append("<input type='hidden' id='hdnDCRVisitCode_" + (r + 1) + "' value='" + ds.Tables[1].Rows[r]["DCR_Code"] + "'/>");//
                            if (ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper() == "UNLISTED")
                            {
                                content.Append("<input type='hidden' id='hdnEdit_" + (r + 1) + "' value='INSERT'/></td>");
                            }
                            else
                            {
                                if (ds.Tables[1].Rows[r]["Customer_Status"].ToString().ToUpper() == "UNAPPROVED")
                                {
                                    content.Append("<input type='hidden' id='hdnEdit_" + (r + 1) + "' value='Y'/></td>");
                                }
                                else
                                {
                                    content.Append("<input type='hidden' id='hdnEdit_" + (r + 1) + "' value=''/></td>");
                                }
                            }
                            content.Append("</tr>");
                            sNo = (sNo) + 1;
                        }
                    }
                }
                content.Append("</tbody></table>");


            }
            return content.ToString() + "~" + noOfPagesIncustomerMaster;
        }

        public string GetExcelUploadedCustomers(DataSet ds, DataSet dsValues)
        {
            StringBuilder content = new StringBuilder();
            int tableWidth = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {
                content.Append("<table class='filterable' id='tblBulkDoctor' style='width:100% !important;'>");
                content.Append("<thead style='background-color:#F8F8F8;' id='tblHeadBulkDoctor'>");
                content.Append("<tr style='background-color:#F8F8F8;height:35px;'>");
                content.Append("<th id='tdMain_' style='min-width:20px !important;background-color:#f8f8f8;'></th>");
                content.Append("<th id='tdMain_ChkSelectBox' style='min-width:20px !important;'><input type='checkbox' id='chkSelect' name='chkSelect' onclick='fnSelectAll()';/></th><th style='min-width:20px !important;'>S.No</th>");

                for (var h = 0; h < ds.Tables[0].Rows.Count; h++)
                {

                    content.Append("<th id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "' style='min-width:150px !important;overflow:auto;'>");
                    content.Append("" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "</th>");
                    tableWidth = tableWidth + 150;
                }
                content.Append("<th style='width:40px !important;' onclick='fnShowMore();' class='dvDownArrow'><div></div></th>");
                content.Append("</thead><tbody>");
                //bind table body
                if (dsValues.Tables[0].Rows.Count > 0)
                {
                    for (var r = 0; r < dsValues.Tables[0].Rows.Count; r++)
                    {
                        content.Append("<tr id='tr_" + (r + 1) + "'>");
                        content.Append("<td id='tdMain_" + (r + 1) + "' style='min-width:20px !important;background-color:#f8f8f8;'></td>");
                        content.Append("<td style='min-width:20px !important;'><div style='width:100%'><input type='checkbox' id='chkSelect_" + (r + 1) + "' name='chkSelectCustomer'/></td>");
                        content.Append("<td style='min-width:20px !important;'>" + (r + 1) + "</td>");
                        for (var h = 0; h < ds.Tables[0].Rows.Count; h++)
                        {
                            string dateClassName = "";
                            string displayClass = "";
                            if (ds.Tables[0].Rows[h]["DATA_TYPE"].ToString().Substring(0, 4).ToUpper() == "DATE")
                            {
                                if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DOB" || ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "ANNIVERSARY_DATE")
                                {
                                    dateClassName = "DOBDatePicker";
                                }
                                else
                                {
                                    dateClassName = "datepicker";
                                }
                            }
                            //if (ds.Tables[0].Rows[h]["Display_Option"].ToString() == "N")
                            //{
                            //    displayClass = "display:none;";
                            //}
                            //else
                            //{
                            //    displayClass = "";
                            //}

                            if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SPECIALITY_CODE")
                            {//
                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "' class='dataTableTdCss'>");
                                content.Append("<input type='text' class='txtInput autoSpeciality' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] + "'");
                                content.Append(" onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                            }
                            else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CATEGORY")
                            {
                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "' class='dataTableTdCss'>");
                                content.Append("<input type='text' class='txtInput autoCategory' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] + "' onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                            }
                            else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "SUBREGION_CODE")
                            {
                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "'>");
                                content.Append("<input type='text' class='autoSubRegion txtInput' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_"
                                                    + (r + 1) + "'");
                                content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                    + "' onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                    + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                    + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                            }
                            else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "CUSTOMER_GROUP")
                            {
                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='"
                                    + displayClass + "' class='dataTableTdCss'>");
                                content.Append("<input type='text' class='txtInput autoCustomerGroup' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_"
                                    + (r + 1) + "'");
                                content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()]
                                    + "' onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\""
                                    + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='"
                                    + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                            }
                            else if (ds.Tables[0].Rows[h]["Field_Name"].ToString().ToUpper() == "DEPOT_CODE")
                            {
                                content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "' class='dataTableTdCss'>");
                                content.Append("<input type='text' class='txtInput autoDepot' id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] + "' onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' /></td>");
                            }
                            else
                            {
                                var value = dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()];
                                if (value.ToString() == "")
                                {
                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "' class='dataTableTdCss'>");
                                    content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='" + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                    content.Append(" value='" + ds.Tables[0].Rows[h]["COLUMN_DEFAULT"] + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' maxlength='" + ds.Tables[0].Rows[h]["len"] + "'/></td>");
                                }
                                else
                                {
                                    content.Append("<td  id='tdMain_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "' style='" + displayClass + "' class='dataTableTdCss'>");
                                    content.Append("<input type='text' class='txtInput " + dateClassName + "' maxlength='" + ds.Tables[0].Rows[h]["Len"] + "'  id='txt_" + ds.Tables[0].Rows[h]["Field_Name"] + "_" + (r + 1) + "'");
                                    content.Append(" value='" + dsValues.Tables[0].Rows[r][ds.Tables[0].Rows[h]["Field_Name"].ToString()] + "'  onblur='fnHideTextBox(this," + (r + 1) + ",\"" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "\",\"" + ds.Tables[0].Rows[h]["DATA_TYPE"] + "\");'");
                                    content.Append("title='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' placeholder='" + ds.Tables[0].Rows[h]["Field_Alias_Name"] + "' maxlength='" + ds.Tables[0].Rows[h]["len"] + "'/></td>");
                                }
                            }
                        }
                        if (r == 0)
                        {
                            content.Append("<td style='min-width:80px !important;'><div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...</div><input type='hidden' id='hdnCategory_" + (r + 1) + "'/>");
                        }
                        else
                        {
                            content.Append("<td style='min-width:80px !important;'><input type='hidden' id='hdnCategory_" + (r + 1) + "'/>");
                        }
                        content.Append("<input type='hidden' id='hdnSpecialityCode_" + (r + 1) + "'/>");
                        content.Append("<input type='hidden' id='hdnSubRegionCode_" + (r + 1) + "'/>");
                        content.Append("<input type='hidden' id='hdnCustomerGroup_" + (r + 1) + "'/>");
                        content.Append("<input type='hidden' id='hdnCustomerCode_" + (r + 1) + "'/>");
                        content.Append("<input type='hidden' id='hdnDepotCode_" + (r + 1) + "'/>");
                        content.Append("<input type='hidden' id='hdnHistory_" + (r + 1) + "' value='N'/>");
                        content.Append("<input type='hidden' id='hdnDCRVisitCode_" + (r + 1) + "' value=''/>");//
                        content.Append("<input type='hidden' id='hdnEdit_" + (r + 1) + "' value='INSERT'/></td>");
                        content.Append("</tr>");
                    }
                }

                content.Append("</tbody></table>");
            }
            return content.ToString();
        }

        #region Bulk Upload Multi Territory
        public string GetCustomerMasterXLTemplate(string Entity_Type)
        {
            objBLCustomer = new BL_Customer();
            string company_Code = _objcurrentInfo.GetCompanyCode();
            string fileName = objBLCustomer.GetCustomerMasterXLTemplate(company_Code, Entity_Type);
            return fileName;
        }

        [HttpPost]
        public ActionResult UploadExcelFile(HttpPostedFileBase fileUpload, FormCollection collection)
        {
            objBLCustomer = new BL_Customer();
            string entity_type = collection["txtEntityType"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string subDomain = _objcurrentInfo.GetSubDomain();
            string user_Code = _objcurrentInfo.GetUserCode();
            string errorCode = objBLCustomer.InsertCustomerMaster(subDomain, companyCode, fileUpload, user_Code, entity_type, _objcurrentInfo.GetUserName());
            ViewBag.ErrorCode = errorCode;
            return View();
        }
        #endregion Bulk Upload Multi Territory

        #region Config values
        public JsonResult GetConfigurationValues(string Entity)
        {
            try
            {
                List<MVCModels.ConfigvaluesModel> lstconfigvalues = new List<MVCModels.ConfigvaluesModel>();
                objBLCustomer = new BL_Customer();

                lstconfigvalues = objBLCustomer.GetConfigvalues(_objcurrentInfo.GetCompanyCode(), Entity);
                return Json(lstconfigvalues, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }

        }
        #endregion Config values

        public void SetSession(string selectedRegionCode)
        {
            _objcurrentInfo.SetDoctorMasterSelectedRegion(selectedRegionCode);
        }

        public int GetConfiqdupicationValue(string regionCode, string mobileNo, string regNo, string configValue)
        {
            DataControl.BLMaster _objMaster = new DataControl.BLMaster();
            int duplicationCount = _objMaster.GetCustomerMasterDupicationvalue(_objcurrentInfo.GetCompanyCode(), regionCode, mobileNo, regNo, configValue); ;
            return duplicationCount;
        }

        #region Doctor Category based on Division
        public JsonResult GetDoctorCategoryBasedonDivisions(string selectedRegionCode)
        {
            try
            {
                objBLCustomer = new BL_Customer();
                List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstDoctorCategories = new List<MVCModels.HiDoctor_Master.DoctorCategoryModel>();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                lstDoctorCategories = objBLCustomer.GetDoctorCategorybySelectedRegion(_objcurrentInfo.GetCompanyCode(), selectedRegionCode).ToList();
                return Json(json.Serialize(lstDoctorCategories), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion Doctor Category based on Division

        #region Doctor View
        public ActionResult DoctorView()
        {
            string regionCode = _objcurrentInfo.GetRegionCode();
            ViewBag.Region_Code = regionCode;
            return View();
        }
        /// <summary>
        /// Get Speciality
        /// </summary>
        /// <returns></returns>
        public JsonResult GetSpeciality()
        {
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.HiDoctor_Master.DoctorQucikViewSpecialityModel> lstSpeciality;
            BL_Customer _objBLCustomer = new BL_Customer();
            lstSpeciality = _objBLCustomer.Getspeciality(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(objJson.Serialize(lstSpeciality));
        }

        public string GetDoctorDetailsforQuickView(string regionCode, string specialityName, string doctorName, string mdlNo1, string mdlNo2, string mdlCheck, int pageNo, string searchName)
        {
            if (specialityName == "-Select Specialty-")
            {
                specialityName = "";
            }
            BL_Customer _objBLCustomer = new BL_Customer();
            int totalPageNo = 0;
            if ("undefined" == searchName)
            {
                searchName = "";
            }
            try
            {
                List<MVCModels.HiDoctor_Master.DoctorQuickViewModel> lstDoctordetails = (List<MVCModels.HiDoctor_Master.DoctorQuickViewModel>)GetDoctorDetails(regionCode, specialityName, doctorName, mdlNo1, mdlNo2, mdlCheck, pageNo, ref totalPageNo, searchName);
                return GetDoctorDeatilsinHTMLFormat(lstDoctordetails, pageNo, totalPageNo);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("specialityName", specialityName);
                dicContext.Add("doctorName", doctorName);
                dicContext.Add("mdlNo1", mdlNo1);
                dicContext.Add("mdlNo2", mdlNo2);
                dicContext.Add("mdlCheck", mdlCheck);
                dicContext.Add("searchName", searchName);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }

        }

        private IEnumerable<MVCModels.HiDoctor_Master.DoctorQuickViewModel> GetDoctorDetails(string regionCode, string specialityName, string doctorName, string mdlNo1, string mdlNo2, string mdlCheck, int pageNo, ref int totalPageno, string searchName)
        {
            MVCModels.HiDoctor_Master.DoctorQuickViewModel objDoctorviewModel = new MVCModels.HiDoctor_Master.DoctorQuickViewModel();
            BL_Customer _objblcustomer = new BL_Customer();
            return _objblcustomer.GetDoctorQucikViewDetails(_objcurrentInfo.GetCompanyCode(), regionCode, specialityName, doctorName, mdlNo1, mdlNo2, mdlCheck, pageNo, PAGESIZE, ref totalPageno, searchName, _objcurrentInfo.GetRegionCode());
        }

        public string GetDoctorDeatilsinHTMLFormat(List<MVCModels.HiDoctor_Master.DoctorQuickViewModel> lstDoctordetails, int pageNo, int totalPageNo)
        {
            StringBuilder strTbl = new StringBuilder();
            int s = 0;
            //if (pageNo <= 1)
            //{
            //    s = 0;
            //}
            //else
            //{
            //    s = pageNo * PAGESIZE;
            //}


            strTbl.Append(Pager.Paging(pageNo, totalPageNo));
            strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctorquickview' class='table table-striped' style='border:1px solid #aaa;'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr style='background-color:#428bca;'>");
            strTbl.Append("<th>S.No</th><th>Doctor Name</th><th>Region</th></th><th>Specialty</th><th>Category</th><th>MDL Number</th><th>Local Area</th><th>Hospital</th>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");
            if (lstDoctordetails != null && lstDoctordetails.Count > 0)
            {
                foreach (var doctorDetails in lstDoctordetails)
                {
                    s++;
                    strTbl.Append("<tr>");
                    //S.No
                    strTbl.Append("<td>");
                    strTbl.Append(s);
                    strTbl.Append("</td>");
                    //Doctor Name
                    strTbl.Append("<td>");
                    strTbl.Append("<a class='td-a'style='text-decoration:underline !important;' onclick=\"CUSTOMER.fnGetDoctorDetailsbyDoctorCode('" + doctorDetails.Customer_Code + "-" + doctorDetails.Region_Code + "')\">" + doctorDetails.Customer_Name + "</a>");

                    strTbl.Append("</td>");
                    //Region Name
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.Region_Name);
                    strTbl.Append("</td>");
                    //Speciality
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.Speciality_Name);
                    strTbl.Append("</td>");
                    //Category
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.Category_Name);
                    strTbl.Append("</td>");
                    //MDL Number
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.MDL_Number);
                    strTbl.Append("</td>");
                    //Local Area
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.Local_Area);
                    strTbl.Append("</td>");
                    //Hospital
                    strTbl.Append("<td>");
                    strTbl.Append(doctorDetails.Hospital_Name);
                    strTbl.Append("</td>");
                    strTbl.Append("</tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
            }
            else
            {
                strTbl.Append("<tr><td colspan='8'><span>No Doctor Details Found.</tr><td>");
            }
            return strTbl.ToString();

        }
        /// <summary>
        /// Get doctor details by doctor code
        /// </summary>
        /// <param name="doctorCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorDetailsbyDoctorCode(string doctorCode, string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            BL_Customer _objBLCustomer = new BL_Customer();
            List<MVCModels.HiDoctor_Master.DoctorQuickViewModel> lstDoctordetails;

            try
            {
                lstDoctordetails = _objBLCustomer.GetDoctorDetailsbyDoctorCode(_objcurrentInfo.GetCompanyCode(), regionCode, doctorCode);
                if (lstDoctordetails != null && lstDoctordetails.Count > 0)
                {
                    strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctordetails' class='table table-striped' style='border:1px solid #aaa;'>");
                    strTbl.Append("<thead class='clsheader'>");
                    strTbl.Append("<tr style='background-color:#428bca;'>");
                    strTbl.Append("<th colspan='8'>Doctor Deatils </th>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Doctor Name:</lable></td>");
                    strTbl.Append("<td>");
                    if (!string.IsNullOrEmpty(lstDoctordetails[0].Sur_Name))
                    {
                        strTbl.Append(lstDoctordetails[0].Customer_Name + "-" + lstDoctordetails[0].Sur_Name);
                    }
                    else
                    {
                        strTbl.Append(lstDoctordetails[0].Customer_Name);
                    }
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Category:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Category_Name);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Specialty:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Speciality_Name);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Qualification:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Qualification);
                    strTbl.Append("</td>");
                    strTbl.Append("</tr>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>MDL No:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].MDL_Number);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Local Area:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Local_Area);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Hospital Name:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Hospital_Name);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Phone and Mobile:</lable></td>");
                    strTbl.Append("<td>");
                    if (!string.IsNullOrEmpty(lstDoctordetails[0].Phone) && !string.IsNullOrEmpty(lstDoctordetails[0].Mobile))
                    {
                        strTbl.Append(lstDoctordetails[0].Phone + "," + lstDoctordetails[0].Mobile);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(lstDoctordetails[0].Phone))
                        {
                            strTbl.Append(lstDoctordetails[0].Phone);
                        }
                        else
                        {
                            strTbl.Append(lstDoctordetails[0].Mobile);
                        }
                    }
                    strTbl.Append("</td>");
                    strTbl.Append("</tr>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Email:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Email);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Birthday Date:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].DOB);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Anniversary Date:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Anniversary_Date);
                    strTbl.Append("</td>");
                    strTbl.Append("<td><lable style='font-weight: bold;'>Registration Number:</lable></td>");
                    strTbl.Append("<td>");
                    strTbl.Append(lstDoctordetails[0].Registration_No);
                    strTbl.Append("</td>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
                else
                {
                    strTbl.Append("<span>No Doctor Details Found.</span>");
                }
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("doctorCode", doctorCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }

        }
        /// <summary>
        /// Get Doctor product mapping details
        /// </summary>
        /// <param name="doctorCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorProductMapingDetails(string doctorCode, string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            BL_Customer _objcustomer = new BL_Customer();
            List<MVCModels.HiDoctor_Master.DoctorQuickViewProductModel> lstDoctorProductMappingdetails;

            try
            {
                lstDoctorProductMappingdetails = _objcustomer.GetDoctorProductMappingDetails(_objcurrentInfo.GetCompanyCode(), regionCode, doctorCode).ToList();
                strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctorProductMappingdetails' class='table table-striped' style='border:1px solid #aaa;'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>Product Name</th><th>MC Name(If applicable)</th><th>Priority</th><th>Yield</th><th>Potential</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstDoctorProductMappingdetails != null && lstDoctorProductMappingdetails.Count > 0)
                {
                    foreach (var doctorProduct in lstDoctorProductMappingdetails)
                    {
                        strTbl.Append("<tr>");
                        //Product Name
                        strTbl.Append("<td>");
                        strTbl.Append(doctorProduct.Product_Name);
                        strTbl.Append("</td>");
                        //MC Name
                        strTbl.Append("<td>");
                        if (!string.IsNullOrEmpty(doctorProduct.Campaign_Name))
                        {
                            strTbl.Append(doctorProduct.Campaign_Name);
                        }
                        else
                        {
                            strTbl.Append("-");
                        }
                        strTbl.Append("</td>");
                        //Priority
                        strTbl.Append("<td>");
                        strTbl.Append(doctorProduct.Priority);
                        strTbl.Append("</td>");
                        //Yield
                        strTbl.Append("<td>");
                        strTbl.Append(doctorProduct.Yield);
                        strTbl.Append("</td>");
                        //Potential
                        strTbl.Append("<td>");
                        strTbl.Append(doctorProduct.Potential);
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("<tr><td colspan='5'>No Doctor Product Mapping details Found.</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("doctorCode", doctorCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get Doctor visit details
        /// </summary>
        /// <param name="doctorCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetDoctorVisitDetails(string doctorCode, string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            BL_Customer _objblcustomer = new BL_Customer();
            List<MVCModels.HiDoctor_Master.DoctorVisitRegionTypeModel> lst = new List<MVCModels.HiDoctor_Master.DoctorVisitRegionTypeModel>();
         
            var lstMonthnames = new List<KeyValuePair<string, int>>();    
         

            for (int s = 6; s >= 1; s--)
            {
                lstMonthnames.Add(new KeyValuePair<string, int>(DateTime.Now.AddMonths(-s).ToString("MMM yyyy"), DateTime.Now.AddMonths(-s).Month));
            }

            try
            {                
                lst = _objblcustomer.GetDoctorVisitDetailsRegionTypeWise(doctorCode);

                strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctorProductMappingdetails' class='table table-striped' style='border:1px solid #aaa;'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>Position</th>");
                if (lstMonthnames != null && lstMonthnames.Count > 0)
                {
                    for (int s = 0; s < lstMonthnames.Count; s++)
                    {
                        strTbl.Append("<th>");
                        strTbl.Append(lstMonthnames[s].Key);
                        strTbl.Append("</th>");
                    }
                }
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");

                strTbl.Append("<tbody>");
                var lstRegionType = lst.GroupBy(a => new { a.Region_Type_code, a.Region_type_Name })
                    .Select(gcs => new MVCModels.HiDoctor_Master.DoctorVisitRegionTypeModel()
                    {
                        Region_Type_code= gcs.Key.Region_Type_code,
                        Region_type_Name = gcs.Key.Region_type_Name
                    }).ToList();

                if (lstRegionType != null && lstRegionType.Count>0)
                {
                    foreach (var item in lstRegionType)
                    {
                        strTbl.Append("<tr>");
                        //Desigation
                        strTbl.Append("<td>");
                        strTbl.Append(item.Region_type_Name);  
                        strTbl.Append("</td>");
                        //Doctor count based on Month
                        if (lstMonthnames != null && lstMonthnames.Count > 0)
                        {
                            for (int s = 0; s < lstMonthnames.Count; s++)
                            {
                                List<MVCModels.HiDoctor_Master.DoctorVisitRegionTypeModel> lstDoctorVisit = lst.Where(x => x.Region_Type_code == item.Region_Type_code && x.Visited_Month == lstMonthnames[s].Value).ToList();
                                if (lstDoctorVisit != null && lstDoctorVisit.Count > 0)
                                {                                     
                                    strTbl.Append("<td>");
                                    strTbl.Append(lstDoctorVisit[0].Day);
                                    strTbl.Append("</td>");
                                }
                                else
                                {
                                    strTbl.Append("<td>-</td>");
                                }
                            }
                        }
                        strTbl.Append("</tr>");
                    }                
                }
                else
                {
                    strTbl.Append("<tr><td colspan='7'>No Doctor Visit Details found.</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("doctorCode", doctorCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        #endregion Doctor View

        #region DoctorWorkArea
        public ViewResult DoctorWorkArea()
        {
            return View();
        }
        public JsonResult GetDoctorWorkAreaDetails(string regionCode)
        {
            BL_Customer _objblcustomer = new BL_Customer();
            return Json(_objblcustomer.GetDoctorWorkAreaDetails(_objcurrentInfo.GetCompanyCode(), regionCode));

        }
        public string SaveDoctorPlaceDetails(List<MVCModels.HiDoctor_Master.DoctorModel> lsDoctorPlace, int action)
        {
            BL_Customer _objblcustomer = new BL_Customer();
            return _objblcustomer.SaveDoctorPlaceDetails(lsDoctorPlace, _objcurrentInfo.GetCompanyCode(), Convert.ToInt32(_objcurrentInfo.GetCompanyId()), _objcurrentInfo.GetUserCode(), action);
        }

        #endregion
    }
}


