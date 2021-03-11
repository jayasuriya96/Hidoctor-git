using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;
using System.Text;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ProductMasterController : Controller
    {
        //
        // GET: /ProductMaster/

        //
        // GET: /Product/
        DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();

        DataControl.SPData objData = new DataControl.SPData();

        public ActionResult Index(int isPopup = 0, string Product_Name = "", string Product_Type = "", int Emp_No = 0, string Product_Ref_Key = "" )
        {
            ViewBag.IsPopUp = isPopup;
            ViewBag.Product_Name = Product_Name;
            ViewBag.Product_Type = Product_Type;
            ViewBag.Emp_No = Emp_No;
            ViewBag.Product_Ref_Key = Product_Ref_Key;
            return View();
        }
        public ActionResult Product(int isPopup = 0, string Product_Name = "", string Product_Type = "", int Emp_No = 0, string Product_Ref_Key = "")
        {
            ViewBag.IsPopUp = isPopup;
            ViewBag.Product_Name = Product_Name;
            ViewBag.Product_Type = Product_Type;
            ViewBag.Emp_No = Emp_No;
            ViewBag.Product_Ref_Key = Product_Ref_Key;
            return View();
        }
        public ActionResult Speciality(string id)
        {
            ViewBag.UserName = objCurInfo.GetUserName();
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult Brand(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult Category(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult UOMType(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult UOM(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult ProductType(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult ProductGroup(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult Competitor(string id)
        {
            ViewBag.RowIndex = id;
            return View();
        }
        public ActionResult ProductBatch(string ProductCode)
        {
            ViewBag.ProductCode = ProductCode;
            return View();
        }

        //
        // GET: /Product/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Product/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Product/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Product/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Product/Edit/5

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
        // GET: /Product/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Product/Delete/5

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

        [HttpPost]
        public JsonResult GetProductBatches(string ProductCode)
        {

            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC SP_HD_GET_ProductBatches '" + ProductCode + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        [HttpPost]
        public string SaveBatch(FormCollection collection)
        {
            string ProductCode = collection["ProductCode"].ToString();
            string BatchNumber = collection["Batch_Number"].ToString();
            string ExpiryDate = collection["Expiry_Date"].ToString();
            string Effective_From = collection["Effective_From"].ToString();
            string Effective_To = collection["Effective_To"].ToString();
            string User_Code = objCurInfo.GetUserCode();
            string Merge_Qty = collection["MergeQty"].ToString();
            int Mode = Convert.ToInt32(collection["Mode"].ToString());
            int MappingId = Convert.ToInt32(collection["MappingId"].ToString() == "" ? "0" : collection["MappingId"].ToString()); 
            
            DataControl.Data ds = new DataControl.Data();
            try
            {

                string str = "";
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "";
                    if (Mode == 0)
                    {
                        strSQL = "EXEC SP_HD_INS_ProductBatch '" + ProductCode + "','" + BatchNumber + "','" + ExpiryDate + "','" + Effective_From + "','" + Effective_To + "','" + User_Code + "','" + Merge_Qty + "'";
                    }
                    else if(Mode == 1)
                    {
                        strSQL = "EXEC SP_HD_UPD_ProductBatch " + MappingId + ",'" + ExpiryDate + "','" + Effective_To + "'";
                    }


                    str = ds.ExecuteScalar(strSQL).ToString();

                }
                return str;
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        [HttpPost]
        public string BatchAutoCreate(FormCollection collection)
        {
            string ProductCode = collection["ProductCode"].ToString();
            string User_Code = objCurInfo.GetUserCode();
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string str = "";
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC SP_HD_ProductBatchMigrate '" + ProductCode + "','" + User_Code + "'";
                    str = ds.ExecuteScalar(strSQL).ToString();
                }
                return str;
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        [HttpPost]
        public string ChangeBatchStatus(FormCollection collection)
        {
            string mappingId = collection["MappingId"].ToString();
            string Status = collection["Status"].ToString();
            string User_Code = objCurInfo.GetUserCode();
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string str = "";
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC SP_HD_UPD_BatchStatus " + mappingId.ToString() + "," + Status.ToString() + ",'" + User_Code + "'";
                    str = ds.ExecuteScalar(strSQL).ToString();
                }
                return str;
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        /// <summary>
        /// <Insert or Update product Group></Delete>
        /// </summary>
        [HttpPost]
        public string ProductGroup(FormCollection collection)
        {
            // TODO: Add insert logic here
            string effFromdate = collection["Effective_From"].ToString();
            string effTodate = collection["Effective_To"].ToString();
            if (!string.IsNullOrEmpty(effFromdate))
            {
                effFromdate = effFromdate.Split('/')[2] + "-" + effFromdate.Split('/')[1] + "-" + effFromdate.Split('/')[0];
                // effFrom = Convert.ToDateTime(collection["EffectiveFrom"].ToString()).ToString("yyyy-MM-dd");
            }
            if (!string.IsNullOrEmpty(effTodate))
            {
                effTodate = effTodate.Split('/')[2] + "-" + effTodate.Split('/')[1] + "-" + effTodate.Split('/')[0];
                // effTo = Convert.ToDateTime(collection["EffectiveTo"].ToString()).ToString("yyyy-MM-dd");
            }

            try
            {
                DataControl.SPData objData = new DataControl.SPData();
                string result = "";
                result = objData.InsertProductGroup("sp_sdInsertProductGroup", objCurInfo.GetCompanyCode(), collection["Product_Group"].ToString(),
                    effFromdate, effTodate, collection["Status"].ToString(), collection["Mode"].ToString(),
                   collection["Product_Group_Code"].ToString());

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ProductGroup()");
                return "";
            }
        }
        public JsonResult GetProductAttributes(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {

                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetProductAttributes '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return new LargeJsonResult() { Data = json.Serialize(dsTrans), MaxJsonLength = int.MaxValue };
                //DataControl.JSONConverter json = new DataControl.JSONConverter();
                //return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertProduct(FormCollection collection)
        {
            string effFrom = collection["EffectiveFrom"].ToString();
            string effTo = collection["EffectiveTo"].ToString();
            string competitorName = "";
            if (collection["ProductTypeName"].ToString().ToUpper() == "COMPETITOR")
            {
                competitorName = collection["competitor"].ToString();
            }
            else
            {
                competitorName = "NULL";
            }

            if (!string.IsNullOrEmpty(effFrom))
            {
                effFrom = effFrom.Split('/')[2] + "-" + effFrom.Split('/')[1] + "-" + effFrom.Split('/')[0];
                // effFrom = Convert.ToDateTime(collection["EffectiveFrom"].ToString()).ToString("yyyy-MM-dd");
            }
            if (!string.IsNullOrEmpty(effTo))
            {
                effTo = effTo.Split('/')[2] + "-" + effTo.Split('/')[1] + "-" + effTo.Split('/')[0];
                // effTo = Convert.ToDateTime(collection["EffectiveTo"].ToString()).ToString("yyyy-MM-dd");
            }

            string result = objData.InsertProduct("sp_sdInsertProduct", objCurInfo.GetCompanyCode(), collection["ProductName"].ToString(), collection["SpecialityCode"].ToString(),
                collection["BrandCode"].ToString(), collection["CategoryCode"].ToString(), collection["UOMTypeCode"].ToString(), collection["UOMCode"].ToString(), collection["ProductTypeCode"].ToString(),
                collection["ProductGroupCode"].ToString(), collection["ProductDesc"].ToString(), collection["ProductTypeName"].ToString(), collection["ProductShortName"].ToString(),
                collection["ProductCost"].ToString(), effFrom, effTo, collection["ProductCode"].ToString(), competitorName, collection["RefKey1"].ToString(), collection["RefKey2"].ToString(), objCurInfo.GetUserCode());
            return result.Trim().Length == 0 ? "SUCCESS" : result;
        }
        public int CheckItranProduct(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                int count = 0;

                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdCheckItranProduct '" + objCurInfo.GetCompanyCode() + "','" + collection["ProductCode"].ToString() + "'";
                    count = (int)ds.ExecuteScalar(strSQL);

                }
                return count;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string ChangeProductStatus(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            string result = string.Empty;
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdChangeProductStatus '" + objCurInfo.GetCompanyCode() + "','" + collection["ProductCode"].ToString() + "'";
                    result = (string)ds.ExecuteScalar(strSQL);
                }
                return result;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertSpeciality(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string result = "";
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdInsertSpeciality '" + objCurInfo.GetCompanyCode() + "','" + collection["SpecialityName"].ToString() + "','" + collection["SpecialityCount"].ToString() + "','" + collection["SpecialityCode"].ToString() + "','" + collection["Mode"].ToString() + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertBrand(FormCollection collection)
        {
            string result = "";
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();

                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string CompanyCode = objCurInfo.GetCompanyCode();
                    string BrandName = collection["BrandName"].ToString();
                    string BrandCode = collection["BrandCode"].ToString();
                    string Mode = collection["Mode"].ToString();
                    string strSQL = "EXEC sp_sdInsertBrand '" + CompanyCode + "','" + BrandName + "','" + BrandCode + "','" + Mode + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertCompetitor(FormCollection collection)
        {
            string result = "";
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                string UserName = objCurInfo.GetUserCode();
                string Comp_name = collection["CompetitorName"].ToString();
                string Comp_Code = collection["CompetitorCode"].ToString();
                string Mode = collection["Mode"].ToString();
                {
                    string strSQL = "EXEC sp_sdInsertComp '" + objCurInfo.GetCompanyCode() + "','" + Comp_name + "','" + Comp_Code + "','" + Mode + "','" + UserName + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertCategory(FormCollection collection)
        {
            string result = "";
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdInsertCategory '" + objCurInfo.GetCompanyCode() + "','" + collection["CategoryName"].ToString() + "','" + collection["CategoryCode"].ToString() + "','" + collection["Mode"].ToString() + "'";
                    result = (string)ds.ExecuteScalar(strSQL);
                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertUOMType(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string result = "";

                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdInsertUOMType '" + objCurInfo.GetCompanyCode() + "','" + collection["UOMTypeName"].ToString() + "','" + collection["UOMTypeCode"].ToString() + "','" + collection["Mode"].ToString() + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertUOM(FormCollection collection)
        {
            string result = "";
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                string Company_Code = objCurInfo.GetCompanyCode();
                string UOM = collection["UOM"].ToString();
                string UOMCode = collection["UOMCode"].ToString();
                string Mode = collection["Mode"].ToString();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdInsertUOM '" + Company_Code + "','" + UOM + "','" + UOMCode + "','" + Mode + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public string InsertProductType(FormCollection collection)
        {
            string result = "";
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdInsertProductType '" + objCurInfo.GetCompanyCode() + "','" + collection["ProductType"].ToString() + "','" + collection["ProductTypeCode"].ToString() + "','" + collection["Mode"].ToString() + "'";
                    result = (string)ds.ExecuteScalar(strSQL);

                }
                return result;
            }
            finally
            {
                ds.CloseConnection();
            }
            return result;
        }
        public JsonResult GetAllSpeciality(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllSpeciality '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        public JsonResult GetAllBrand(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllBrand '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllCategory(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllCategory '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllUOMType(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllUOMType '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllUOM(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllUOM '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllProductType(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetAllProductType '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetProductGroups()
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsGroup = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sdGetProductGroup '" + objCurInfo.GetCompanyCode() + "'";
                    dsGroup = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsGroup), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllCompetitor(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sd_GetAllComp '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public JsonResult GetAllCompetitoractive(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                DataSet dsTrans = new DataSet();
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC sp_sd_GetAllCompactive '" + objCurInfo.GetCompanyCode() + "'";
                    dsTrans = ds.ExecuteDataSet(strSQL);

                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsTrans), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }

        /// <summary>
        /// <Delete product Group></Delete>
        /// </summary>
        public string ProductGroupDelete(FormCollection collection)
        {
            // TODO: Add insert logic here
            try
            {
                DataControl.SPData objData = new DataControl.SPData();
                string result = "";
                string prodgrpcode = collection["Product_Group_Code"].ToString();
                string status = collection["Status"].ToString();
                string company_code = objCurInfo.GetCompanyCode();
                result = objData.DeleteProductGroup("sp_sdDeleteProductGroup", company_code,prodgrpcode, status);

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ProductGroupDelete()");
                return "";
            }
        }

        public ActionResult ProductExcelUpload()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ProductExcelUploadResult(HttpPostedFileBase file)
        {
            try
            {
                string result = string.Empty;
                DataControl.BLProduct _objBlProduct = new DataControl.BLProduct();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                result = _objBlProduct.ProductBulkInsert(_objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(),
                                                            _objCurInfo.GetSubDomain());
                ViewBag.ErrorCode = result;
                return View("ProductExcelUploadResult");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                ViewBag.ErrorCode = ex.Message;
                return View("ProductExcelUploadResult");
            }
        }

        public void DownloadProductMasterExcelTemplate()
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                string error = string.Empty;

                string fileName = "Product_Master_New.xlsx";
                string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;
                objFileDownload.DownloadFile(blobURL, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
        }

        public int ValidateRefKey1(string refKey1, string product_Type, string mode, string prodcode)
        {
            string company_Code = objCurInfo.GetCompanyCode();
            return objData.ValidateRefkey1inProduct(company_Code, refKey1, product_Type, mode, prodcode);

        }
        public int Validprodname(string product_name, string product_type,string prod_Code,string mode)
        {
            string company_Code = objCurInfo.GetCompanyCode();
            return objData.Validprodname(company_Code, product_name, product_type, prod_Code,mode);

        }
        #region primary sales excel upload
        public ActionResult PrimarySalesExcelUpload()
        {
            return View();
        }
        [HttpPost]
        public ActionResult PrimarySalesExcelUploadResult(HttpPostedFileBase file, FormCollection collection)
        {
            try
            {
                const string TransType = "hdnTransType";
                string transactionType = Convert.ToString(collection[TransType]);
                string result = string.Empty;
                DataControl.BLProduct _objBlProduct = new DataControl.BLProduct();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                result = _objBlProduct.PrimarySalesBulkInsert(_objCurInfo.GetCompanyCode(),
                    Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(),
                                                            _objCurInfo.GetSubDomain(), transactionType);
                ViewBag.ErrorCode = result;
                return View("PrimarySalesExcelUploadResult");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                ViewBag.ErrorCode = string.Empty;
                return View("PrimarySalesExcelUploadResult");
            }
        }

        public void DownloadPrimarySalesExcelTemplate()
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                string error = string.Empty;

                string fileName = "PrimarySales.xls";
                string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;
                objFileDownload.DownloadFile(blobURL, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
        }
        public StringBuilder DownloadMasterData(string masterType)
        {
            DataControl.BLProduct _objBLProduct = new BLProduct();
            StringBuilder _fileNameString = new StringBuilder();
            if (masterType == "PRODUCT")
            {
                _fileNameString = _objBLProduct.GetProductMasterExcelData();
            }
            if (masterType == "REGION")
            {
                _fileNameString = _objBLProduct.GetRegionMasterExcelData();
            }
            if (masterType == "CUSTOMER")
            {
                _fileNameString = _objBLProduct.GetCustomerMasterExcelData();
            }
            if (masterType == "DEPOT")
            {
                _fileNameString = _objBLProduct.GetDepotMasterExcelData();
            }
            return _fileNameString;
        }

        #endregion primary sales excel upload

        #region primarysales parameters excel upload
        public ActionResult PrimarySalesParameters()
        {
            return View();
        }

        public string GetPrimarySalesParameters()
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLProduct objProduct = new BLProduct();
                List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstParam = new List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>();
                lstParam = (List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>)objProduct.GetAllPSParameters(objCurInfo.GetCompanyCode());
                strContent.Append("<table class='table table-striped'><thead><tr>");
                // strContent.Append("<td><input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();' /> </td>");
                strContent.Append("<td>Edit</td><td>Change Staus</td><td>Parameter Name</td><td>Parameter Column Name</td><td>Status</td>");
                strContent.Append("</tr></thead>");

                if (lstParam.Count > 0)
                {
                    var lstParam1 = lstParam.AsEnumerable().Where(x => x.Record_Status == "1").ToList();
                    foreach (MVCModels.HiDoctor_Master.PrimarySalesParametersModel item in lstParam1)
                    {
                        strContent.Append("<tr>");
                        //<td><input type='checkbox' name='chkSelect' value='" + item.Parameter_Code + "' /> </td>");
                        strContent.Append("<td><a href='#' onclick='fnEditParam(\"" + item.Parameter_Code + "\",\""
                            + item.Parameter_Name + "\",\"" + item.Param_Column_Name + "\",\""
                            + item.Flag + "\");'>Edit</a></td>");
                        strContent.Append("<td><a href='#' onclick='fnChangeParamStatus(\""
                            + item.Parameter_Code + "\",\"" + item.Record_Status + "\");'>Change Status</a></td>");
                        strContent.Append("<td>" + item.Parameter_Name + "</td>");
                        strContent.Append("<td>" + item.Param_Column_Name + "</td>");
                        if (item.Record_Status == "1")
                        {
                            strContent.Append("<td>Enabled</td>");
                        }
                        else
                        {
                            strContent.Append("<td>Disabled</td>");
                        }
                        strContent.Append("</tr>");
                    }

                    var lstParam2 = lstParam.AsEnumerable().Where(x => x.Record_Status == "0").ToList();
                    foreach (MVCModels.HiDoctor_Master.PrimarySalesParametersModel item in lstParam2)
                    {
                        strContent.Append("<tr>");
                        //<td><input type='checkbox' name='chkSelect' value='" + item.Parameter_Code + "' /> </td>");
                        strContent.Append("<td><a href='#' onclick='fnEditParam(\"" + item.Parameter_Code + "\",\""
                            + item.Parameter_Name + "\",\"" + item.Param_Column_Name + "\",\""
                            + item.Flag + "\");'>Edit</a></td>");
                        strContent.Append("<td><a href='#' onclick='fnChangeParamStatus(\""
                            + item.Parameter_Code + "\",\"" + item.Record_Status + "\");'>Change Status</a></td>");
                        strContent.Append("<td>" + item.Parameter_Name + "</td>");
                        strContent.Append("<td>" + item.Param_Column_Name + "</td>");
                        if (item.Record_Status == "1")
                        {
                            strContent.Append("<td>Enabled</td>");
                        }
                        else
                        {
                            strContent.Append("<td>Disabled</td>");
                        }
                        strContent.Append("</tr>");
                    }
                }
                strContent.Append("</table>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        public string InsertPSParameter(string parameterName, string parameterCode, string mode, string status, string flag, string columnName)
        {
            string result = string.Empty;
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLProduct objProduct = new BLProduct();

                List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstCheckParam = new List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>();
                lstCheckParam = (List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>)objProduct.GetAllPSParameters(objCurInfo.GetCompanyCode());
                if ("INSERT" == mode.ToUpper())
                {
                    var fileterd = lstCheckParam.AsEnumerable().Where(z => z.Param_Column_Name.ToUpper() == columnName.ToUpper()).ToList();
                    if (fileterd.Count > 0)
                    {
                        result = "ERROR:Primary sales column name must be unique";
                    }
                }
                if ("EDIT" == mode.ToUpper())
                {
                    var fileterd = lstCheckParam.AsEnumerable().Where(z => z.Param_Column_Name.ToUpper() == columnName.ToUpper()).ToList();
                    if (fileterd.Count > 0)
                    {
                        if (fileterd[0].Parameter_Code != parameterCode)
                        {
                            result = "ERROR:Primary sales column name must be unique";
                        }
                    }
                }
                if (string.IsNullOrEmpty(result))
                {
                    int rowsAffected = 0;
                    List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel> lstParam = new List<MVCModels.HiDoctor_Master.PrimarySalesParametersModel>();
                    MVCModels.HiDoctor_Master.PrimarySalesParametersModel objParam = new MVCModels.HiDoctor_Master.PrimarySalesParametersModel();
                    objParam.Parameter_Name = parameterName;
                    objParam.Parameter_Code = parameterCode;
                    objParam.Record_Status = status;
                    objParam.Param_Column_Name = columnName;
                    objParam.Flag = flag;
                    objParam.Company_Code = objCurInfo.GetCompanyCode();
                    lstParam.Add(objParam);
                    rowsAffected = objProduct.InsertPSParameters(objCurInfo.GetCompanyCode(), mode, lstParam);
                    if (rowsAffected > 0)
                    {
                        if (mode.ToUpper() == "INSERT")
                        {
                            result = "SUCCESS:Primary sales parameter added successfully";
                        }
                        else if (mode.ToUpper() == "EDIT")
                        {
                            result = "SUCCESS:Primary sales parameter updated successfully";
                        }
                        else
                        {
                            result = "SUCCESS:Primary sales parameter status chnaged successfully";
                        }

                    }
                    else
                    {
                        result = "ERROR:Primary sales parameter updation failed";
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return result;
        }



        public ActionResult PrimarySalesValuesExcelUpload()
        {
            return View();
        }

        public string DownloadPSParametersExcelTemplate()
        {
            //try
            //{
            //    DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            //    DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            //    string error = string.Empty;
            //    CurrentInfo objCurInfo = new CurrentInfo();
            //    DataControl.BLProduct objProduct = new BLProduct();
            //    string fileName = objProduct.GetPrimarySalesParametersExcelData(objCurInfo.GetCompanyCode());
            //    string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;
            //    objFileDownload.DownloadFile(blobURL, fileName, out error);
            //}
            //catch (Exception ex)
            //{
            //    Dictionary<string, string> dicObj = new Dictionary<string, string>();
            //    DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            //}

            DataControl.BLProduct _objBLProduct = new BLProduct();
            string _fileNameString = string.Empty;
            CurrentInfo objCurInfo = new CurrentInfo();
            _fileNameString = _objBLProduct.GetPrimarySalesParametersExcelData(objCurInfo.GetCompanyCode());
            return _fileNameString;
        }
        public ActionResult PrimarySalesValuesExcelUploadResult(HttpPostedFileBase file, FormCollection collection)
        {
            try
            {
                const string year = "hdnYear";
                const string month = "hdnMonth";
                string result = string.Empty;
                DataControl.BLProduct _objBlProduct = new DataControl.BLProduct();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                result = _objBlProduct.PrimarySalesValuesBulkInsert(_objCurInfo.GetCompanyCode(),
                    Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(), _objCurInfo.GetSubDomain(),
                    Convert.ToString(collection[month]), Convert.ToString(collection[year]));
                ViewBag.ErrorCode = result;
                return View("PrimarySalesValuesExcelUploadResult");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                ViewBag.ErrorCode = string.Empty;
                return View("PrimarySalesValuesExcelUploadResult");
            }
        }
        #endregion primarysales parameters excel upload
    }
}
