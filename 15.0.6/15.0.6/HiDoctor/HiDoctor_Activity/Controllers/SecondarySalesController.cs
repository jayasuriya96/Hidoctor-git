using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using HiDoctor_Activity.Models;
using DataControl;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using System.Text;
using HiDoctor_Activity;
using Newtonsoft.Json;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class SecondarySalesController : Controller
    {
        // GET: /SecondarySales/
        private IConfigSettings IConfig_Settings = null;
        private DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        Bl_SSCustomer _objSSCustomer = new Bl_SSCustomer();

        BL_SecondarySales _objSS = new BL_SecondarySales();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult SecondarySalesEntryRevamp()
        {
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult SecondartSaleaEntryRevampLock()
        {
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.Company_Id = _objcurrentInfo.GetCompanyId();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }



        //
        // GET: /SecondarySales/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /SecondarySales/Create

        public ActionResult Create()
        {
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            return View();
        }
        [HttpPost]
        public string BlopUpload()
        {
            HttpFileCollectionBase file = Request.Files;
            string blobURL = string.Empty;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string subDomain = _objcurrentInfo.GetSubDomain();

                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

                if (file.Count != 0)
                {
                    if (file[0] != null)
                    {
                        DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                        string fileName = file[0].FileName.Split('.')[0] + DateTime.Now.ToString("mmddyyyyhhMMss") + "." + file[0].FileName.Split('.')[1];
                        blobURL = objAzureUpload.PutAzureBlobStorage(file[0].InputStream, fileName, accKey, companyCode);
                    }
                }

                return blobURL;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        //
        // POST: /SecondarySales/Create

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
        // GET: /SecondarySales/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }


        //
        // POST: /SecondarySales/Edit/5

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
        // GET: /SecondarySales/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /SecondarySales/Delete/5

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

        public ActionResult DeleteSecondarySales()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public JsonResult GetUserDetails()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            DataSet ds = _objSPData.GetSpeciality(companyCode, userCode);
            // Convert the DataTable to list.
            List<Models.DCRDoctorVisitModel> lstSpeciality = (from Speciality in ds.Tables[0].AsEnumerable()
                                                              select new Models.DCRDoctorVisitModel
                                                              {
                                                                  label = Speciality["Speciality_Name"].ToString(),
                                                                  value = Speciality["Speciality_Code"].ToString()
                                                              }).ToList<Models.DCRDoctorVisitModel>();
            // returns the list.
            return Json(lstSpeciality, JsonRequestBehavior.AllowGet);
        }

        public int CheckPreMonthSSData(string SS_Code, string month, string year)
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string startDate = year + "-" + month + "-01";
                return _objSPData.CheckPreMonthSSData(companyCode, SS_Code, startDate);
            }
            catch
            {
                throw;
            }
        }

        public LargeJsonResult GetSecProductAutoFill(FormCollection collection)
        {
            try
            {
                string ProdBringType = collection["ProductTypeCode"].ToString();
                string regionCode = collection["regionCode"].ToString();
                string entryMode = collection["entryMode"].ToString();
                string stockiestCode = collection["stockiestCode"].ToString();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                DataSet dsProducts = new DataSet();
                DataSet dsSecondarySales = new DataSet();
                MasterController objMaster = new MasterController();
                DataSet dsParentUser = new DataSet();

                //  List<JsonResult> lstSecondarySalesData = new List<JsonResult>();
                List<Models.SecondarySalesModel> lstProducts = new List<SecondarySalesModel>();
                List<SecondarySalesDataModel> lstSecondarysales = new List<SecondarySalesDataModel>();
                List<Models.StockiestModel> lstStockiestAuto = new List<Models.StockiestModel>();
                List<Models.CustomerModel> lstCustomerAuto = new List<Models.CustomerModel>();
                List<Models.OpeningBalanceModel> lstOpeningBalance = new List<Models.OpeningBalanceModel>();
                List<Models.PriceRegion> lstPriceRegion = new List<Models.PriceRegion>();
                List<Models.ParentRegion> lstParentRegion = new List<Models.ParentRegion>();
                List<Models.CustomerModel> lstCustomerDetails = new List<Models.CustomerModel>();


                dsProducts = _objSPData.GetSecondarySalesProducts(companyCode, ProdBringType, entryMode, regionCode, stockiestCode);

                DataTable dtProducts = dsProducts.Tables[0];

                dsSecondarySales = _objSPData.GetSecondarySalesDetails(companyCode, regionCode, entryMode);
                DataTable dtSecondarySalesDetails = dsSecondarySales.Tables[0];
                DataTable dtSecondarySalesCustomerDetails = dsSecondarySales.Tables[1];
                // Convert the DataTable to list.
                lstProducts = (from Products in dtProducts.AsEnumerable()
                               select new Models.SecondarySalesModel
                               {

                                   Product_Name = Products["Product_Name"].ToString(),
                                   Product_Code = Products["Product_Code"].ToString() + "_" + Products["Division_Code"].ToString(),
                                   productCode = Products["Product_Code"].ToString(),
                                   Ref_Key1 = Products["Ref_Key1"].ToString()


                               }).ToList<Models.SecondarySalesModel>();


                lstCustomerDetails = (from SecondarySales in dtSecondarySalesCustomerDetails.AsEnumerable()
                                      select new Models.CustomerModel
                                      {
                                          Customer_Code = SecondarySales["Customer_Code"].ToString(),
                                          Customer_Name = SecondarySales["Customer_Name"].ToString(),
                                      }).ToList<Models.CustomerModel>();

                lstSecondarysales = (from SecondarySales in dtSecondarySalesDetails.AsEnumerable()
                                     select new Models.SecondarySalesDataModel
                                     {
                                         Customer_Code = SecondarySales["Base_Code"].ToString(),
                                         ss_Code = SecondarySales["SS_Code"].ToString(),
                                         Month = SecondarySales["Month"].ToString(),
                                         Year = SecondarySales["Year"].ToString(),
                                         MonthName = SecondarySales["MonthName"].ToString(),
                                         User_Code = SecondarySales["User_Code"].ToString(),
                                         User_Name = SecondarySales["User_Name"].ToString(),
                                         Customer_Name = SecondarySales["Customer_Name"].ToString(),
                                         Stockiest_Name = SecondarySales["Stockiest_Name"].ToString(),
                                         SS_Statement_Date = SecondarySales["SS_Statement_Date"].ToString(),
                                         Region_Code = SecondarySales["Region_Code"].ToString(),
                                         SS_Status = SecondarySales["SS_Status"].ToString(),
                                         Region_Name = SecondarySales["Region_Name"].ToString()

                                     }).ToList<Models.SecondarySalesDataModel>();


                DataSet dsStockiest = new DataSet();
                dsStockiest = _objSPData.GetSecondarySalesStockiestData(companyCode, regionCode);

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




                if (entryMode.ToUpper() == "CUSTOMER")
                {
                    DataTable dtSecondarySalesCustomer = dsSecondarySales.Tables[1];
                    lstCustomerAuto = (from item in dtSecondarySalesCustomer.AsEnumerable()
                                       select new Models.CustomerModel()
                                       {
                                           Customer_Code = item["Customer_Code"].ToString(),
                                           Customer_Name = item["Customer_Name"].ToString(),
                                           Customer_Entity = item["Customer_Entity_Type"].ToString()

                                       }).ToList<Models.CustomerModel>();
                }

                DataTable dtOpeningBalnce = dsProducts.Tables[1];

                lstOpeningBalance = (from Products in dtOpeningBalnce.AsEnumerable()
                                     select new Models.OpeningBalanceModel
                                     {

                                         Product_Code = Products["Product_Code"].ToString(),
                                         Product_Name = Products["Product_Name"].ToString(),
                                         Opening_Balance = Products["Closing_Stock"].ToString(),
                                         Customer_Code = Products["Customer_Code"].ToString(),
                                     }).ToList<Models.OpeningBalanceModel>();


                List<JsonResult> lstSecondarySalesData = new List<JsonResult> { Json(lstProducts, JsonRequestBehavior.AllowGet), Json(lstSecondarysales,
                JsonRequestBehavior.AllowGet), Json(lstStockiestAuto, JsonRequestBehavior.AllowGet), Json(lstCustomerAuto, JsonRequestBehavior.AllowGet),
                Json(lstOpeningBalance, JsonRequestBehavior.AllowGet),Json(lstCustomerDetails, JsonRequestBehavior.AllowGet)};
                //return Json(lstSecondarySalesData, JsonRequestBehavior.AllowGet);

                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstProducts.Count + lstSecondarysales.Count + lstProducts.Count + lstStockiestAuto.Count + lstCustomerAuto.Count + lstOpeningBalance.Count + lstCustomerDetails.Count,
                        Data = lstSecondarySalesData,
                        error = false
                    }
                };
            }
            catch (Exception ex)
            {
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        error = true,
                        message = ex.Message
                    }
                };
            }
        }

        public int InsertSecondarySalesValues(SS_Entry_Detail obj)
        {
            try
            {
                int result = 0;
                //string month = string.Empty, year = string.Empty, userCode = string.Empty, regionCode = string.Empty, baseCode = string.Empty, customerCode = string.Empty, CustomerEntityType = string.Empty;
                //string baseTypeCode = string.Empty, statementDate = string.Empty, query = string.Empty, companyCode = string.Empty, enterdUser = string.Empty, ssEditStatus = string.Empty, divisionCode = string.Empty;
                //string ssCode = string.Empty, ssStatus = string.Empty, maxDate = string.Empty, status = string.Empty, entryMode = string.Empty;
                //string draftMode = string.Empty;
                DCRExpense objExpense = new DCRExpense();
                string ss_status = string.Empty;
                // string[] tableData = collection["tblSecondaryDetails"].ToString().Split('~');
                //month = collection["month"].ToString();
                //year = collection["year"].ToString();
                //userCode = collection["userCode"].ToString();
                //regionCode = collection["regionCode"].ToString();
                //baseCode = collection["baseCode"].ToString();
                //baseTypeCode = collection["baseTypeCode"].ToString();
                //statementDate = collection["stDate"].ToString();
                //ssEditStatus = collection["status"].ToString();
                //customerCode = collection["cusCode"].ToString();
                //CustomerEntityType = collection["cusType"].ToString();
                //entryMode = collection["EntryMode"].ToString();
                //draftMode = collection["draftMode"].ToString();
                //List<MVCModels.SecondarySalesOpeningbalanaceModel> lstProductopeningBalanes = (List<MVCModels.SecondarySalesOpeningbalanaceModel>)JsonConvert.DeserializeObject(collection["openingBalances"].ToString(),
                //       typeof(List<MVCModels.SecondarySalesOpeningbalanaceModel>));

                string ssStatus = string.Empty;
                string ssCode = string.Empty;
                string maxDate = string.Empty;
                string status = string.Empty;
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string enterdUser = _objcurrentInfo.GetUserCode();

                IConfig_Settings = new Config_Settings();
                string ssConfigValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.APPROVAL, CONFIG_KEY.ALLOW_SS_AUTO_APPROVAL);
                DataSet ds = new DataSet();
                DataRow[] dr;
                if (obj.objDet.Entry_Mode.ToUpper() == "CUSTOMER")
                {
                    ds = _objSPData.GetSecEnteredProduct(companyCode, obj.objDet.Region_Code, obj.objDet.Month, obj.objDet.Year, "CUSTOMER", obj.objDet.Customer_Code);
                }
                else if (obj.objDet.Entry_Mode.ToUpper() == "STOCKIEST")
                {
                    ds = _objSPData.GetSecEnteredProduct(companyCode, obj.objDet.Region_Code, obj.objDet.Month, obj.objDet.Year, "STOCKIEST", obj.objDet.Base_Code);
                }
                else
                {
                    ds = _objSPData.GetSecEnteredProduct(companyCode, obj.objDet.Region_Code, obj.objDet.Month, obj.objDet.Year, "REP", "''");
                }
                //obj.objDet.StatementDate = obj.objDet.StatementDate.Split('/')[2] + "-" + obj.objDet.StatementDate.Split('/')[1] + "-" + obj.objDet.StatementDate.Split('/')[0];
                if (ds.Tables[0].Rows.Count > 0 && ds.Tables.Count > 0)
                {
                    ssStatus = "EXIST";
                    ssCode = ds.Tables[0].Rows[0]["SS_Code"].ToString();
                }

                if (ds.Tables[1].Rows.Count > 0)
                {
                    maxDate = ds.Tables[1].Rows[0][0].ToString();
                }

                status = "1";

                if (!string.IsNullOrEmpty(obj.objDet.SS_Status))
                {
                    ssStatus = obj.objDet.SS_Status.Split('_')[0];
                    ssCode = obj.objDet.SS_Status.Split('_')[1];
                }

                if (obj.objDet.Draft_Mode == "3")
                {
                    ss_status = "3";
                }
                else
                {
                    if (ssConfigValue.ToUpper() == "YES")
                    {
                        ss_status = "2";
                    }
                    else
                    {
                        ss_status = "1";
                    }
                }

                if (obj.lstSecondaryDetails.Count > 0)
                {
                    string header_Result = string.Empty;
                    if (ssStatus.ToUpper() == "EDIT" || ssStatus.ToUpper() == "EXIST" || ssStatus.ToUpper() == "EXISTS")
                    {
                        header_Result = _objSS.UpdateSecondarySalesHeader(obj.objDet.Month, obj.objDet.Year, obj.objDet.StatementDate, ss_status, enterdUser, obj.objDet.Base_Code, obj.objDet.Customer_Code, obj.objDet.BaseTypeCode, obj.objDet.Customer_Type, ssCode);
                    }
                    else
                    {

                        header_Result = _objSS.InsertSecondarySalesHeader(obj.objDet.Month, obj.objDet.Year, obj.objDet.Base_Code, obj.objDet.BaseTypeCode, obj.objDet.User_Code, obj.objDet.Customer_Code, obj.objDet.Customer_Type, obj.objDet.Region_Code, obj.objDet.StatementDate, ss_status, enterdUser);
                    }
                    if (header_Result.Split('-')[0] == "1")
                    {
                        string ss_Code = string.Empty;
                        ss_Code = header_Result.Split('-')[1];
                        result = _objSS.InsertSecondarySalesDetails(ssCode, ss_Code, obj.lstSecondaryDetails);
                    }
                    //if (ssStatus.ToUpper() == "EDIT")
                    //{
                    //    query += "UPDATE tbl_SFA_SecondarySales_Header SET Month=" + month + ",Year=" + year + ",SS_Statement_Date='" + statementDate + "',SS_Status='" + ss_status + "',Entered_By='" + enterdUser + "',Entred_Date='" + System.DateTime.Now.Date + "', Base_Code='" + baseCode + "',Customer_Code='" + customerCode + "',Base_Type='" + baseTypeCode + "',Customer_Entity_Type='" + CustomerEntityType + "' WHERE Company_Code='" + companyCode + "' AND SS_Code=" + ssCode + ";";
                    //    query += "DELETE FROM tbl_SFA_SecondarySales_Details WHERE  Company_Code='" + companyCode + "' AND SS_Code=" + ssCode + ";";
                    //}
                    //else if (ssStatus.ToUpper() == "EXIST")
                    //{
                    //    query += "UPDATE tbl_SFA_SecondarySales_Header SET Month=" + month + ",Year=" + year + ",SS_Statement_Date='" + statementDate + "',SS_Status='" + ss_status + "',Entered_By='" + enterdUser + "',Entred_Date='" + System.DateTime.Now.Date + "', Base_Code='" + baseCode + "',Customer_Code='" + customerCode + "',Base_Type='" + baseTypeCode + "',Customer_Entity_Type='" + CustomerEntityType + "' WHERE Company_Code='" + companyCode + "' AND SS_Code=" + ssCode + ";";
                    //    query += "DELETE FROM tbl_SFA_SecondarySales_Details WHERE  Company_Code='" + companyCode + "' AND SS_Code=" + ssCode + ";";
                    //}
                    //else
                    //{
                    //    // Secondary Sales Header
                    //    if (!string.IsNullOrEmpty(ssCode))
                    //    {
                    //        query += "DELETE FROM tbl_SFA_SecondarySales_Details WHERE  Company_Code='" + companyCode + "' AND SS_Code=" + ssCode + ";";
                    //    }
                    //    query += " INSERT INTO tbl_SFA_SecondarySales_Header(Company_Code,Month,Year,Base_Code,Base_Type,User_Code,Customer_Code,Customer_Entity_Type,Region_Code,SS_Statement_Date,SS_Status,Entered_By,Entred_Date ) VALUES ";
                    //    query += "('" + companyCode + "'," + month + "," + year + ",'" + baseCode + "','" + baseTypeCode + "','" + userCode + "','" + customerCode + "','" + CustomerEntityType + "','" + regionCode + "','" + statementDate + "','" + ss_status + "','" + enterdUser + "','" + System.DateTime.Now.Date + "');";
                    //    query += "DECLARE @IDEN INT  SET @IDEN = @@IDENTITY ; ";
                    //}

                    //foreach (string data in tableData)
                    //{
                    //    if (!string.IsNullOrEmpty(data))
                    //    {
                    //        if (string.IsNullOrEmpty(data.Split('^')[1]) || data.Split('^')[1] == "undefined")
                    //        {
                    //            divisionCode = "NULL";
                    //        }
                    //        else
                    //        {
                    //            divisionCode = data.Split('^')[1];
                    //        }
                    //        dr = ds.Tables[0].Select("Product_Code='" + data.Split('^')[1] + "'  AND Month='" + month + "' AND Year ='" + year + "'");

                    //        if (ssCode != "")
                    //        {
                    //            query += "INSERT INTO  tbl_SFA_SecondarySales_Details(Company_Code,SS_Code,Division_Code,Product_Code,Free_Goods,Opening_Stock,Purchase,Purchase_Return,Sales,Sales_Return,";
                    //            query += "Closing_Stock,Transit,SS_Flag,Price_Per_Unit,Remarks,Entered_By,Entered_Date ) VALUES ('" + companyCode + "'," + ssCode + ",'" + data.Split('^')[0] + "','" + data.Split('^')[1] + "',";
                    //            query += "" + data.Split('^')[9] + "," + data.Split('^')[2] + "," + data.Split('^')[3] + "," + data.Split('^')[4] + "," + data.Split('^')[5] + "," + data.Split('^')[6] + "," + data.Split('^')[7] + "," + data.Split('^')[8] + ",";
                    //            query += "'1'," + data.Split('^')[10] + ",'" + data.Split('^')[11] + "','" + enterdUser + "','" + System.DateTime.Now.Date + "');";

                    //            if (data.Split('^')[12] != data.Split('^')[2])
                    //            {
                    //                query += "UPDATE tbl_SFA_SecondarySales_Details ";
                    //                query += "SET Is_Manually_Edited = 1, Is_Manually_Edited_DateTime ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
                    //                query += " WHERE Company_Code='" + companyCode + "' AND Product_Code ='" + data.Split('^')[1] + "' AND SS_Code = '" + ssCode + "';";
                    //                query += "INSERT INTO tbl_SFA_Secondary_Sales_Manual_Edit_Log	(SS_Header_Code,Stockist_Code,Product_Code,Old_Balance_Value,New_Balance_Value,Entered_DateTime)";
                    //                query += "VALUES('" + ssCode + "','" + baseCode + "', '" + data.Split('^')[1] + "','" + data.Split('^')[12] + "','" + data.Split('^')[2] + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "');";
                    //            }
                    //            else
                    //            {
                    //                if (data.Split('^')[13] == "0")
                    //                {
                    //                    query += "UPDATE tbl_SFA_SecondarySales_Details ";
                    //                    query += "SET Is_Manually_Edited = 0, Is_Manually_Edited_DateTime ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
                    //                    query += " WHERE Company_Code='" + companyCode + "' AND Product_Code ='" + data.Split('^')[1] + "' AND SS_Code = '" + ssCode + "';";
                    //                }
                    //                else
                    //                {
                    //                    query += "UPDATE tbl_SFA_SecondarySales_Details ";
                    //                    query += "SET Is_Manually_Edited = 1, Is_Manually_Edited_DateTime ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
                    //                    query += " WHERE Company_Code='" + companyCode + "' AND Product_Code ='" + data.Split('^')[1] + "' AND SS_Code = '" + ssCode + "';";
                    //                }
                    //            }
                    //        }

                    //        else
                    //        {
                    //            query += "INSERT INTO  tbl_SFA_SecondarySales_Details(Company_Code,SS_Code,Division_Code,Product_Code,Free_Goods,Opening_Stock,Purchase,Purchase_Return,Sales,Sales_Return,";
                    //            query += "Closing_Stock,Transit,SS_Flag,Price_Per_Unit,Remarks,Entered_By,Entered_Date ) VALUES ('" + companyCode + "',@IDEN,'" + data.Split('^')[0] + "','" + data.Split('^')[1] + "',";
                    //            query += "" + data.Split('^')[9] + "," + data.Split('^')[2] + "," + data.Split('^')[3] + "," + data.Split('^')[4] + "," + data.Split('^')[5] + "," + data.Split('^')[6] + "," + data.Split('^')[7] + "," + data.Split('^')[8] + ",";
                    //            query += "'1'," + data.Split('^')[10] + ",'" + data.Split('^')[11] + "','" + enterdUser + "','" + System.DateTime.Now.Date + "');";

                    //            if (data.Split('^')[12] != data.Split('^')[2])
                    //            {
                    //                query += "UPDATE tbl_SFA_SecondarySales_Details ";
                    //                query += "SET Is_Manually_Edited = 1, Is_Manually_Edited_DateTime ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
                    //                query += " WHERE Company_Code='" + companyCode + "' AND Product_Code ='" + data.Split('^')[1] + "' AND SS_Code = @IDEN;";
                    //                query += "INSERT INTO tbl_SFA_Secondary_Sales_Manual_Edit_Log	(SS_Header_Code,Stockist_Code,Product_Code,Old_Balance_Value,New_Balance_Value,Entered_DateTime)";
                    //                query += "VALUES(@IDEN,'" + baseCode + "', '" + data.Split('^')[1] + "','" + data.Split('^')[12] + "','" + data.Split('^')[2] + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'); ";
                    //            }
                    //            else
                    //            {
                    //                query += "UPDATE tbl_SFA_SecondarySales_Details ";
                    //                query += "SET Is_Manually_Edited = 0, Is_Manually_Edited_DateTime ='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'";
                    //                query += " WHERE Company_Code='" + companyCode + "' AND Product_Code ='" + data.Split('^')[1] + "' AND SS_Code = @IDEN;";
                    //            }
                    //        }

                    //// Secondary Sales Details
                    //query += "INSERT INTO  tbl_SFA_SecondarySales_Details(Company_Code,SS_Code,Division_Code,Product_Code,Opening_Stock,Purchase,Purchase_Return,Sales,Sales_Return,";
                    //query += "Closing_Stock,Transit,SS_Flag,Price_Per_Unit,Entered_By,Entered_Date ) VALUES ('" + companyCode + "'," + maxCount + ",'" + data.Split('^')[0] + "','" + data.Split('^')[1] + "',";
                    //query += "" + data.Split('^')[2] + "," + data.Split('^')[3] + "," + data.Split('^')[4] + "," + data.Split('^')[5] + "," + data.Split('^')[6] + "," + data.Split('^')[7] + "," + data.Split('^')[8] + ",";
                    //query += "'" + status + "'," + data.Split('^')[9] + ",'" + enterdUser + "','" + System.DateTime.Now.Date + "');";

                    //        }
                    //    }
                    //}
                    //var nq = string.Empty;

                    //if (!string.IsNullOrEmpty(query))
                    //{
                    //    query = query.TrimEnd(';');
                    //}
                    //int results = _objSPData.ExecuteStoredProcedure("ExecQuery", query, companyCode);
                    //if (results == 1)
                    //{
                    //    result = true;
                    //}
                    //else
                    //{
                    //    result = false;
                    //}
                    if (result > 0)
                    {
                        if (ss_status == "1" || ss_status == "2")
                        {
                            string resultstring = _objSPData.UpdateSSDCRLock(companyCode, obj.objDet.Region_Code, obj.objDet.Month, obj.objDet.Year, obj.objDet.Base_Code, _objcurrentInfo.GetUserCode(), "APPLIED");
                        }
                    }
                }
                return result;

            }

            catch (Exception ex)
            {
                throw ex;
            }

        }

        //public int UpdateSSEntryDCRLock(int month,int year,string baseCode)
        //{
        //    string companyCode = _objcurrentInfo.GetCompanyCode();
        //    string regionCode = _objcurrentInfo.GetRegionCode();
        //    string userCode = _objcurrentInfo.GetUserCode();
        //    int result = 0;
        //    result = _objSPData.UpdateSSEntryDCRLock(companyCode, regionCode, month, year, baseCode, userCode);
        //    return result;
        //}

        public JsonResult GetSecSelectedDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();

            string userDetails = collection["userCodeDetails"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string statementDate = userDetails.Split('_')[4];
            statementDate = statementDate.Split('/')[2] + "-" + statementDate.Split('/')[1] + "-" + statementDate.Split('/')[0];
            ds = _objSPData.GetSecSelectedDetails(companyCode, userDetails.Split('_')[0], userDetails.Split('_')[1], userDetails.Split('_')[2], statementDate, userDetails.Split('_')[3]);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSecEditDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string userDetails = collection["userCodeDetails"].ToString();
            string entryMode = collection["entryMode"].ToString();

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string statementDate = userDetails.Split('_')[4];
            string baseCode = userDetails.Split('_')[5];
            statementDate = statementDate.Split('/')[2] + "-" + statementDate.Split('/')[1] + "-" + statementDate.Split('/')[0];
            ds = _objSPData.GetSecEditDetails(companyCode, userDetails.Split('_')[0], userDetails.Split('_')[1], userDetails.Split('_')[2], statementDate, userDetails.Split('_')[3], baseCode, entryMode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetDoubleCheckSSEntry(string month, string year, string stockiest_Code, string regionCode)
        {
            string result = string.Empty;
            string companyCode = _objcurrentInfo.GetCompanyCode();
            result = _objSPData.GetDoubleCheckSSEntry(companyCode, regionCode, month, year, stockiest_Code);
            return result;
        }

        public JsonResult GetMonth(string company_code, string region_Code, string stockiest_Code)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            ds = _objSPData.GetLatestMonth(companyCode, region_Code, stockiest_Code);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMonthDiff(string company_code, string startDate, string endDate)
        {
            DataSet ds = new DataSet();
            ds = _objSPData.GetMonthDiff(company_code, startDate, endDate);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }


        public string GetStockiestWiseCustomerValidation(FormCollection collection)
        {
            string tableContent = "";
            string stockiestCode = collection["stockiest"].ToString();
            string customerCode = collection["customer"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            string date = year + "-" + month + "-01";
            DateTime previousMonth = new DateTime();
            previousMonth = Convert.ToDateTime(date).AddMonths(-1);

            ds = _objSPData.GetStockiestWiseCustomerValidation(companyCode, customerCode, stockiestCode, regionCode, previousMonth.Month.ToString(), previousMonth.Year.ToString(), date, month, year);
            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent = "Kindly get your secondary sales for the previous month approved <br> Customer Name : <br>";
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    tableContent += dr["Customer_Name"].ToString() + "<br>";
                }

            }
            else
            {
                tableContent = "NO";
            }

            tableContent += "$";

            if (ds.Tables[1].Rows.Count > 0)
            {
                if (Convert.ToInt32(ds.Tables[1].Rows[0]["Count"].ToString()) > 0)
                {
                    tableContent = "YES";
                }
                else
                {
                    tableContent = "NO";
                }
            }
            else
            {
                tableContent = "NO";
            }
            tableContent += "$";
            if (ds.Tables[2].Rows.Count > 0)
            {
                if (Convert.ToInt32(ds.Tables[2].Rows[0]["Count"].ToString()) > 0)
                {
                    tableContent = "YES";
                }
                else
                {
                    tableContent = "NO";
                }
            }
            else
            {
                tableContent = "NO";
            }
            return tableContent;
        }

        public LargeJsonResult GetSecondartSalesPriceForEdit(FormCollection collection)
        {

            string customerCode = collection["customer"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string entryMode = collection["entryMode"].ToString();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet dsProducts = new DataSet();


            //  List<JsonResult> lstSecondarySalesData = new List<JsonResult>();
            List<Models.SecondarySalesPrice> lstProductsPrice = new List<Models.SecondarySalesPrice>();
            List<Models.SecondarySalesPriceType> lstPriceType = new List<Models.SecondarySalesPriceType>();
            List<Models.SecondarySalesCheck> lstSecondarySaleCheck = new List<SecondarySalesCheck>();
            List<Models.SecondarySalesNextMonth> lstSecondarySalesNextMonthCheck = new List<SecondarySalesNextMonth>();
            List<Models.SecondarySalesCurrentMonth> lstSecondarySalesCurrentMonth = new List<SecondarySalesCurrentMonth>();
            List<Models.SecondarySalesUnapprovedCheck> lstSecondarySalesUnapprovedCheck = new List<SecondarySalesUnapprovedCheck>();
            string date = year + "-" + month + "-01";

            DateTime previousMonth = new DateTime();
            previousMonth = Convert.ToDateTime(date).AddMonths(-1);

            dsProducts = _objSPData.GetSecondartSalesPriceForEdit(companyCode, customerCode, entryMode, regionCode, previousMonth.Month.ToString(), previousMonth.Year.ToString(), date, month, year);
            DataTable dtProductsPrice = dsProducts.Tables[0];
            DataTable dtProductsPriceType = dsProducts.Tables[1];
            DataTable dtSSCheck = dsProducts.Tables[2];
            DataTable dtPrevious = dsProducts.Tables[3];
            DataTable dtUnappoved = dsProducts.Tables[4];
            DataTable dtCurrent = dsProducts.Tables[5];

            lstProductsPrice = (from Products in dtProductsPrice.AsEnumerable()
                                select new Models.SecondarySalesPrice
                                {

                                    Price_Code = Products["Price_Code"].ToString(),
                                    PTS = Products["PTS"].ToString(),
                                    PTS_Price = Products["PTS_Price"].ToString(),
                                    MRP = Products["MRP"].ToString(),
                                    MRP_WOTax = Products["MRP_WOTax"].ToString(),
                                    PTR = Products["PTR"].ToString(),
                                    PTR_WOTax = Products["PTR_WOTax"].ToString(),
                                    Invoice_Amount = Products["Invoice_Amount"].ToString(),
                                    NRV = Products["NRV"].ToString(),
                                    Product_Code = Products["Product_Code"].ToString(),
                                    Product_Name = Products["Product_Name"].ToString()

                                }).ToList<Models.SecondarySalesPrice>();

            lstPriceType = (from Products in dtProductsPriceType.AsEnumerable()
                            select new Models.SecondarySalesPriceType
                            {
                                Price_Type = Products["Price_Type"].ToString()

                            }).ToList<Models.SecondarySalesPriceType>();

            lstSecondarySaleCheck = (from Products in dtSSCheck.AsEnumerable()
                                     select new Models.SecondarySalesCheck
                                     {
                                         Is_Check = Products["Count"].ToString()

                                     }).ToList<Models.SecondarySalesCheck>();

            lstSecondarySalesNextMonthCheck = (from Products in dtPrevious.AsEnumerable()
                                               select new Models.SecondarySalesNextMonth
                                               {
                                                   Is_Available = Products["Count"].ToString()

                                               }).ToList<Models.SecondarySalesNextMonth>();

            lstSecondarySalesUnapprovedCheck = (from Products in dtUnappoved.AsEnumerable()
                                                select new Models.SecondarySalesUnapprovedCheck
                                                {
                                                    Is_Unapproved = Products["Count"].ToString()
                                                }).ToList<Models.SecondarySalesUnapprovedCheck>();

            lstSecondarySalesCurrentMonth = (from Products in dtCurrent.AsEnumerable()
                                             select new Models.SecondarySalesCurrentMonth
                                             {
                                                 Is_CurrentMonth = Products["Count"].ToString()

                                             }).ToList<Models.SecondarySalesCurrentMonth>();

            List<JsonResult> lstSecondarySalesData = new List<JsonResult> { Json(lstProductsPrice, JsonRequestBehavior.AllowGet), Json(lstPriceType, JsonRequestBehavior.AllowGet), Json(lstSecondarySaleCheck, JsonRequestBehavior.AllowGet), Json(lstSecondarySalesNextMonthCheck, JsonRequestBehavior.AllowGet), Json(lstSecondarySalesCurrentMonth, JsonRequestBehavior.AllowGet) };

            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstProductsPrice.Count + lstSecondarySalesData.Count + lstPriceType.Count + lstSecondarySaleCheck.Count + lstSecondarySalesNextMonthCheck.Count + lstSecondarySalesCurrentMonth.Count,
                    Data = lstSecondarySalesData
                }
            };
        }



        public LargeJsonResult GetSecondartSalesPrice(FormCollection collection)
        {

            string customerCode = collection["customer"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string entryMode = collection["entryMode"].ToString();
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet dsProducts = new DataSet();


            //  List<JsonResult> lstSecondarySalesData = new List<JsonResult>();
            List<Models.SecondarySalesPrice> lstProductsPrice = new List<Models.SecondarySalesPrice>();
            List<Models.SecondarySalesPriceType> lstPriceType = new List<Models.SecondarySalesPriceType>();
            List<Models.SecondarySalesCheck> lstSecondarySaleCheck = new List<SecondarySalesCheck>();
            List<Models.SecondarySalesNextMonth> lstSecondarySalesNextMonthCheck = new List<SecondarySalesNextMonth>();
            List<Models.SecondarySalesCurrentMonth> lstSecondarySalesCurrentMonth = new List<SecondarySalesCurrentMonth>();
            string date = year + "-" + month + "-01";

            DateTime previousMonth = new DateTime();
            previousMonth = Convert.ToDateTime(date).AddMonths(-1);

            dsProducts = _objSPData.GetSecondartSalesPrice(companyCode, customerCode, entryMode, regionCode, previousMonth.Month.ToString(), previousMonth.Year.ToString(), date, month, year);
            DataTable dtProductsPrice = dsProducts.Tables[0];
            DataTable dtProductsPriceType = dsProducts.Tables[1];
            DataTable dtSSCheck = dsProducts.Tables[2];
            DataTable dtPrevious = dsProducts.Tables[3];
            DataTable dtCurrent = dsProducts.Tables[4];

            lstProductsPrice = (from Products in dtProductsPrice.AsEnumerable()
                                select new Models.SecondarySalesPrice
                                {

                                    Price_Code = Products["Price_Code"].ToString(),
                                    PTS = Products["PTS"].ToString(),
                                    PTS_Price = Products["PTS_Price"].ToString(),
                                    MRP = Products["MRP"].ToString(),
                                    MRP_WOTax = Products["MRP_WOTax"].ToString(),
                                    PTR = Products["PTR"].ToString(),
                                    PTR_WOTax = Products["PTR_WOTax"].ToString(),
                                    Invoice_Amount = Products["Invoice_Amount"].ToString(),
                                    NRV = Products["NRV"].ToString(),
                                    Product_Code = Products["Product_Code"].ToString(),
                                    Product_Name = Products["Product_Name"].ToString()

                                }).ToList<Models.SecondarySalesPrice>();

            lstPriceType = (from Products in dtProductsPriceType.AsEnumerable()
                            select new Models.SecondarySalesPriceType
                            {
                                Price_Type = Products["Price_Type"].ToString()

                            }).ToList<Models.SecondarySalesPriceType>();

            lstSecondarySaleCheck = (from Products in dtSSCheck.AsEnumerable()
                                     select new Models.SecondarySalesCheck
                                     {
                                         Is_Check = Products["Count"].ToString()

                                     }).ToList<Models.SecondarySalesCheck>();

            lstSecondarySalesNextMonthCheck = (from Products in dtPrevious.AsEnumerable()
                                               select new Models.SecondarySalesNextMonth
                                               {
                                                   Is_Available = Products["Count"].ToString()

                                               }).ToList<Models.SecondarySalesNextMonth>();

            lstSecondarySalesCurrentMonth = (from Products in dtCurrent.AsEnumerable()
                                             select new Models.SecondarySalesCurrentMonth
                                             {
                                                 Is_CurrentMonth = Products["Count"].ToString(),
                                                 Is_Inherited = Products["Inheritance"].ToString()

                                             }).ToList<Models.SecondarySalesCurrentMonth>();

            List<JsonResult> lstSecondarySalesData = new List<JsonResult> { Json(lstProductsPrice, JsonRequestBehavior.AllowGet), Json(lstPriceType, JsonRequestBehavior.AllowGet), Json(lstSecondarySaleCheck, JsonRequestBehavior.AllowGet), Json(lstSecondarySalesNextMonthCheck, JsonRequestBehavior.AllowGet), Json(lstSecondarySalesCurrentMonth, JsonRequestBehavior.AllowGet) };

            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstProductsPrice.Count + lstSecondarySalesData.Count + lstPriceType.Count + lstSecondarySaleCheck.Count + lstSecondarySalesNextMonthCheck.Count + lstSecondarySalesCurrentMonth.Count,
                    Data = lstSecondarySalesData
                }
            };
        }



        public JsonResult GetSSStockiest(string regionCode)
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            DataSet dsStockiest = new DataSet();
            dsStockiest = _objSPData.GetStockiestData(_objcurrentInfo.GetCompanyCode(), regionCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(dsStockiest), JsonRequestBehavior.AllowGet);
        }



        public string GetSecondarySalesForDelete(string regionCode, string stockiestCode, string mode)
        {
            string strBuilder = "";
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            ds = _objSPData.GetSecondarySalesForDelete(companyCode, regionCode, stockiestCode, mode);
            strBuilder = Getsstablestring(ds).ToString();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return strBuilder.ToString();
        }

        public string Getsstablestring(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            int rowNo = 0;
            if (ds.Tables[0].Rows.Count > 0)
            {


                tableContent.Append("<table class='table table-striped'>");
                tableContent.Append("<thead>");
                tableContent.Append("<tr>");
                tableContent.Append("<td style='width: 64px;'>Select<input type='checkbox' name='chkSSSelectAll' onclick='fnSSSelectAll();'/></td>");
                tableContent.Append("<td>Region Name </td>");
                tableContent.Append("<td>Month</td>");
                tableContent.Append("<td>Year</td>");
                tableContent.Append("<td>Statement Date</td>");
                tableContent.Append("<td>Secondary Sales Amount.(Rs.) </td>");
                tableContent.Append("<td>Status</td>");
                tableContent.Append("<td>Product View</td>");
                tableContent.Append("</tr>");
                tableContent.Append("<thead>");
                tableContent.Append("<tbody>");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    rowNo++;
                    tableContent.Append("<tr>");
                    tableContent.Append("<td><input type='checkbox' name='chk_SS_Select' onclick='fnSelectDecsAll();' id='chkSelect_" + rowNo + "' value='" + rowNo + "' da_id='" + rowNo + "'/></td>");
                    tableContent.Append("<input type='hidden' id='hdnDeleteDetails_" + rowNo + "'");
                    tableContent.Append("value='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "|" + ds.Tables[0].Rows[i]["SS_Code"].ToString() + "|" + ds.Tables[0].Rows[i]["month"].ToString() + "|" + ds.Tables[0].Rows[i]["year"].ToString() + "|" + ds.Tables[0].Rows[i]["Base_Code"].ToString() + "|" + ds.Tables[0].Rows[i]["SS_Status"].ToString() + "'/>");
                    tableContent.Append("<input type='hidden' id='hdnIs_inherited' value='" + ds.Tables[0].Rows[i]["IS_Inherited"].ToString() + "'/>");

                    tableContent.Append("<td>");
                    tableContent.Append(ds.Tables[0].Rows[i]["Region_Name"].ToString() + "</td>");
                    tableContent.Append("<td>" + ds.Tables[0].Rows[i]["MonthName"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(ds.Tables[0].Rows[i]["year"].ToString());
                    tableContent.Append("</td >");
                    tableContent.Append("<td>");
                    tableContent.Append(ds.Tables[0].Rows[i]["SS_Statement_Date"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td>");
                    tableContent.Append(ds.Tables[0].Rows[i]["SS_Amount"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td " + GetColorCode(ds.Tables[0].Rows[i]["SS_Status_val"].ToString()) + ">");
                    tableContent.Append(ds.Tables[0].Rows[i]["SS_Status_val"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'><span onclick='fnDetails(\"" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "_" + ds.Tables[0].Rows[i]["month"].ToString() + "_" + ds.Tables[0].Rows[i]["Year"].ToString() + "_" + ds.Tables[0].Rows[i]["SS_Code"].ToString() + "_" + ds.Tables[0].Rows[i]["SS_Statement_Date"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>Product View</span></td>");
                    tableContent.Append("</tr>");

                }

                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
            }

            return tableContent.ToString();

        }


        public string GetColorCode(string status)
        {
            string style = string.Empty;
            switch (status.ToUpper())
            {
                case "APPROVED":
                    style = "style=color:white;background-color:darkgreen";
                    break;
                case "APPLIED":
                    style = "style=color:white;background-color:DodgerBlue";
                    break;
                case "UNAPPROVED":
                    style = "style=color:white;background-color:crimson";
                    break;
                case "DRAFT":
                    style = "style=color:white;background-color:pink";
                    break;
                default:
                    style = "";
                    break;
            }
            return style;
        }

        public string GetPrivilegeValue(string companyCode, string privilegeName, string userCode)
        {
            CurrentInfo _objCurr = new CurrentInfo();
            SPData objSP = new SPData();
            string SS_EntryCheck = string.Empty;
            SS_EntryCheck = objSP.GetSinglePrivilegeNameForUser(_objCurr.GetCompanyCode(), userCode, privilegeName);
            return SS_EntryCheck;
        }

        public JsonResult GetClosingBalanceGreaterThanZero(string productAutofill, string productPrice, string openingBalances, string year, string month, string priceType, string StockiestCode, string regionCode)
        {
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            string popProductprice = string.Empty;
            List<MVCModels.SecondarySalesClosingBalance> lstClosing = new List<MVCModels.SecondarySalesClosingBalance>();
            List<MVCModels.SecondarySalesProductDetail> lstProdctDetails = (List<MVCModels.SecondarySalesProductDetail>)JsonConvert.DeserializeObject(productAutofill,
                        typeof(List<MVCModels.SecondarySalesProductDetail>));

            List<MVCModels.SecondarySalesProductPriceModel> lstProductprice = (List<MVCModels.SecondarySalesProductPriceModel>)JsonConvert.DeserializeObject(productPrice,
                        typeof(List<MVCModels.SecondarySalesProductPriceModel>));



            List<MVCModels.SecondarySalesOpeningbalanaceModel> lstProductopeningBalanes = (List<MVCModels.SecondarySalesOpeningbalanaceModel>)JsonConvert.DeserializeObject(openingBalances,
                        typeof(List<MVCModels.SecondarySalesOpeningbalanaceModel>));

            List<MVCModels.SecondarySalesProductPriceModel> lstpriceType = (List<MVCModels.SecondarySalesProductPriceModel>)JsonConvert.DeserializeObject(priceType,
                        typeof(List<MVCModels.SecondarySalesProductPriceModel>));
            int i = 0;
            int j = 0;
            foreach (var pro in lstProdctDetails)
            {
                i++;

                if (lstProductprice.Count > 0)
                {
                    List<MVCModels.SecondarySalesProductPriceModel> lstProductpricecode = lstProductprice.Where(x => x.Product_Code == pro.productCode).ToList();
                    if (lstProductpricecode.Count > 0)
                    {

                        if (lstpriceType[0].Price_Type == "PTS")
                        {
                            popProductprice = lstProductpricecode[0].PTS;
                        }
                        else if (lstpriceType[0].Price_Type == "INVOICE_AMOUNT")
                        {
                            popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                        }
                        else if (lstpriceType[0].Price_Type == "PTR_WOTAX")
                        {
                            popProductprice = lstProductpricecode[0].PTR_WOTax;
                        }
                        else if (lstpriceType[0].Price_Type == "MRP")
                        {
                            popProductprice = lstProductpricecode[0].MRP;
                        }
                        else if (lstpriceType[0].Price_Type == "NRV")
                        {
                            popProductprice = lstProductpricecode[0].NRV;
                        }
                    }

                }
                //string is_inherited = "";
                List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = new List<MVCModels.SecondarySalesOpeningbalanaceModel>();
                //is_inherited = _objSPData.GetSSInheritedStatus(regionCode, StockiestCode);
                //if (is_inherited == "1")
                //{
                //    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && x.IS_Inherited == "1").ToList();
                //}
                //else
                //{
                //    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && (Convert.ToDateTime(x.Year + "-" + x.Month + "-" + "01") < Convert.ToDateTime(year + "-" + month + "-" + "01"))).ToList();
                //}
                lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode).ToList();

                List<MVCModels.SecondarySalesOpeningbalanaceModel> lstCurrentopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Year) == Convert.ToInt32(year)).ToList();

                int openBal = 0;
                if (lstopenBalances.Count > 0)
                {
                    if (lstopenBalances[0].Opening_Balance != "0")
                    {
                        MVCModels.SecondarySalesClosingBalance _objS = new MVCModels.SecondarySalesClosingBalance();
                        _objS.Product_Code = pro.productCode.Replace("_", "");
                        lstClosing.Add(_objS);
                        openBal = 1;
                    }
                }
                else if (lstopenBalances.Count > 0 && openBal == 0)
                {

                    if (lstopenBalances[0].Opening_Balance != "0")
                    {
                        MVCModels.SecondarySalesClosingBalance _objS = new MVCModels.SecondarySalesClosingBalance();
                        _objS.Product_Code = pro.productCode.Replace("_", "");
                        lstClosing.Add(_objS);
                    }
                }
                j++;
            }
            return Json(json.Serialize(lstClosing), JsonRequestBehavior.AllowGet);
        }


        public StringBuilder GetSecondarySalesopeningbalancePopup(string selectedProductDetail, string productAutofill, string productPrice, string openingBalances, string year, string month, string priceType, string StockiestCode, string regionCode)
        {

            StringBuilder strTableBuilder = new StringBuilder();
            string popProductprice = string.Empty;
            List<MVCModels.SecondarySalesProductDetail> lstProdctDetails = (List<MVCModels.SecondarySalesProductDetail>)JsonConvert.DeserializeObject(productAutofill,
                        typeof(List<MVCModels.SecondarySalesProductDetail>));


            List<MVCModels.SecondarySalesSelectedProductModel> lstSelectedProduct = (List<MVCModels.SecondarySalesSelectedProductModel>)JsonConvert.DeserializeObject(selectedProductDetail,
                        typeof(List<MVCModels.SecondarySalesSelectedProductModel>));

            List<MVCModels.SecondarySalesProductPriceModel> lstProductprice = (List<MVCModels.SecondarySalesProductPriceModel>)JsonConvert.DeserializeObject(productPrice,
                        typeof(List<MVCModels.SecondarySalesProductPriceModel>));



            List<MVCModels.SecondarySalesOpeningbalanaceModel> lstProductopeningBalanes = (List<MVCModels.SecondarySalesOpeningbalanaceModel>)JsonConvert.DeserializeObject(openingBalances,
                        typeof(List<MVCModels.SecondarySalesOpeningbalanaceModel>));

            List<MVCModels.SecondarySalesProductPriceModel> lstpriceType = (List<MVCModels.SecondarySalesProductPriceModel>)JsonConvert.DeserializeObject(priceType,
                        typeof(List<MVCModels.SecondarySalesProductPriceModel>));
            int i = 0;
            if (lstSelectedProduct.Count > 0)
            {
                strTableBuilder.Append("<div class='legendpopup'>");
                strTableBuilder.Append("<p>1.The products selected in this screen will get populated into the outside details grid screen with corresponding details. You can continue further editing as required.</p>");
                strTableBuilder.Append("<p>2.If you are modifying a Draft / Unapproved record, previously selected products will be shown as checked in this screen.</p>");
                strTableBuilder.Append("<p>Note: If you unselect a previously checked product from here, its details will be removed from the outside details grid as well.</p>");
                strTableBuilder.Append("</div>");
                strTableBuilder.Append("<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>");
                strTableBuilder.Append("<table class='table table-striped' style='width: 99%;margin-left:7px'><thead><tr><td style='padding:5px'>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>");
                strTableBuilder.Append("<td style='padding:5px'>Product Name</td><td style='padding:5px'>Unit Price(Rs.)</td><td style='padding:5px'>Last Closing Stock Qty.(Nos)</td></tr></thead><tbody>");
                foreach (var pro in lstProdctDetails)
                {
                    i++;
                    List<MVCModels.SecondarySalesSelectedProductModel> lstPro = lstSelectedProduct.Where(x => x.Code == pro.productCode).ToList();
                    if (lstPro.Count > 0)
                    {

                        strTableBuilder.Append("<tr><td><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + i + 1 + "' value='"
                                                   + pro.productCode + "'/></td>");
                    }
                    else
                    {

                        strTableBuilder.Append("<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i + 1 + "' value='" + pro.productCode + "'/></td>");
                    }


                    if (lstProductprice.Count > 0)
                    {
                        List<MVCModels.SecondarySalesProductPriceModel> lstProductpricecode = lstProductprice.Where(x => x.Product_Code == pro.productCode).ToList();
                        if (lstProductpricecode.Count > 0)
                        {

                            if (lstpriceType[0].Price_Type == "PTS")
                            {
                                popProductprice = lstProductpricecode[0].PTS;
                            }
                            else if (lstpriceType[0].Price_Type == "INVOICE_AMOUNT")
                            {
                                popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                            }
                            else if (lstpriceType[0].Price_Type == "PTR_WOTAX")
                            {
                                popProductprice = lstProductpricecode[0].PTR_WOTax;
                            }
                            else if (lstpriceType[0].Price_Type == "MRP")
                            {
                                popProductprice = lstProductpricecode[0].MRP;
                            }
                            else if (lstpriceType[0].Price_Type == "NRV")
                            {
                                popProductprice = lstProductpricecode[0].NRV;
                            }
                        }

                    }
                    if (pro.Ref_Key1 == "0")
                    {
                        strTableBuilder.Append("<td id='tdProductName_" + i + 1 + "'>" + pro.Product_Name + " (-)</td>");

                    }
                    else
                    {
                        strTableBuilder.Append("<td id='tdProductName_" + i + 1 + "'>" + pro.Product_Name + " (" + pro.Ref_Key1 + ")" + "</td>");
                    }

                    strTableBuilder.Append("<td id='tdProductPrice_" + i + 1 + "'>" + popProductprice + "</td>");
                    //int inc = 0;
                    //int value = 1;
                    int op = 0;
                    //  List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Month) < Convert.ToInt32(month) && Convert.ToInt32(x.Year) <= Convert.ToInt32(year)).ToList();
                    //string is_inherited = "";
                    List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = new List<MVCModels.SecondarySalesOpeningbalanaceModel>();
                    //is_inherited = _objSPData.GetSSInheritedStatus(regionCode, StockiestCode);
                    //if (is_inherited == "1")
                    //{
                    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode).ToList();
                    //}
                    //else
                    //{
                    //    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && (Convert.ToDateTime(x.Year + "-" + x.Month + "-" + "01") < Convert.ToDateTime(year + "-" + month + "-" + "01"))).ToList();
                    //}

                    List<MVCModels.SecondarySalesOpeningbalanaceModel> lstCurrentopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Month) == Convert.ToInt32(month) && Convert.ToInt32(x.Year) == Convert.ToInt32(year)).ToList();
                    if (lstopenBalances.Count > 0)
                    {
                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + i + 1 + "'>" + lstopenBalances[0].Opening_Balance + "</td></tr>");
                        op = 1;
                    }
                    else if (lstCurrentopenBalances.Count > 0 && op == 0)
                    {
                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + i + 1 + "'>" + lstCurrentopenBalances[0].Opening_Balance + "</td></tr>");
                    }
                    else
                    {
                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + (i) + 1 + "'>0</td></tr>");
                    }

                }
                strTableBuilder.Append("</tbody></table>");
                strTableBuilder.Append("</div>");


            }

            else
            {
                strTableBuilder.Append("<div class='legendpopup'>");
                strTableBuilder.Append("<p>1.The products selected in this screen will get populated into the outside details grid screen with corresponding details. You can continue further editing as required.</p>");
                strTableBuilder.Append("<p>2.If you are modifying a Draft / Unapproved record, previously selected products will be shown as checked in this screen.</p>");
                strTableBuilder.Append("<p>Note: If you unselect a previously checked product from here, its details will be removed from the outside details grid as well.</p>");
                strTableBuilder.Append("</div>");
                strTableBuilder.Append("<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>");
                strTableBuilder.Append("<table class='table table-striped' style='width: 99%;margin-left:7px'><thead><tr><td style='padding:5px'>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>");
                strTableBuilder.Append("<td style='padding:5px'>Product Name</td><td style='padding:5px'>Unit Price(Rs.)</td><td style='padding:5px'>Last Closing Stock Qty.(Nos)</td></tr></thead><tbody>");
                foreach (var pro in lstProdctDetails)
                {
                    i++;
                    List<MVCModels.SecondarySalesSelectedProductModel> lstPro = lstSelectedProduct.Where(x => x.Code == pro.productCode).ToList();
                    if (lstPro.Count > 0)
                    {

                        strTableBuilder.Append("<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i + 1 + "' value='"
                                                   + pro.productCode + "'/></td>");
                    }
                    else
                    {

                        strTableBuilder.Append("<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i + 1 + "' value='" + pro.productCode + "'/></td>");
                    }


                    if (lstProductprice.Count > 0)
                    {
                        List<MVCModels.SecondarySalesProductPriceModel> lstProductpricecode = lstProductprice.Where(x => x.Product_Code == pro.productCode).ToList();
                        if (lstProductpricecode.Count > 0)
                        {

                            if (lstpriceType[0].Price_Type == "PTS")
                            {
                                popProductprice = lstProductpricecode[0].PTS;
                            }
                            else if (lstpriceType[0].Price_Type == "INVOICE_AMOUNT")
                            {
                                popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                            }
                            else if (lstpriceType[0].Price_Type == "PTR_WOTAX")
                            {
                                popProductprice = lstProductpricecode[0].PTR_WOTax;
                            }
                            else if (lstpriceType[0].Price_Type == "MRP")
                            {
                                popProductprice = lstProductpricecode[0].MRP;
                            }
                            else if (lstpriceType[0].Price_Type == "NRV")
                            {
                                popProductprice = lstProductpricecode[0].NRV;
                            }
                        }

                    }
                    if (pro.Ref_Key1 == "0")
                    {
                        strTableBuilder.Append("<td id='tdProductName_" + i + 1 + "'>" + pro.Product_Name + " (-)</td>");

                    }
                    else
                    {
                        strTableBuilder.Append("<td id='tdProductName_" + i + 1 + "'>" + pro.Product_Name + " (" + pro.Ref_Key1 + ")" + "</td>");
                    }
                    strTableBuilder.Append("<td id='tdProductPrice_" + i + 1 + "'>" + popProductprice + "</td>");
                    //string is_inherited = "";
                    List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = new List<MVCModels.SecondarySalesOpeningbalanaceModel>();
                    //is_inherited = _objSPData.GetSSInheritedStatus(regionCode, StockiestCode);
                    //if (is_inherited == "1")
                    //{
                    //    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && x.IS_Inherited == "1").ToList();
                    //}
                    //else
                    //{
                    //    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && (Convert.ToDateTime(x.Year + "-" + x.Month + "-" + "01") < Convert.ToDateTime(year + "-" + month + "-" + "01"))).ToList();
                    //}
                    lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode).ToList();
                    //List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Month) < Convert.ToInt32(month) && Convert.ToInt32(x.Year) <= Convert.ToInt32(year)).ToList();
                    //List<MVCModels.SecondarySalesOpeningbalanaceModel> lstopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && (Convert.ToDateTime(x.Year + "-" + x.Month + "-" + "01") < Convert.ToDateTime(year + "-" + month + "-" + "01"))).ToList();
                    //List<MVCModels.SecondarySalesOpeningbalanaceModel> lstCurrentopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Month) == Convert.ToInt32(month) && Convert.ToInt32(x.Year) == Convert.ToInt32(year)).ToList();
                    List<MVCModels.SecondarySalesOpeningbalanaceModel> lstCurrentopenBalances = lstProductopeningBalanes.Where(x => x.Product_Code == pro.productCode && x.Customer_Code == StockiestCode && Convert.ToInt32(x.Year) == Convert.ToInt32(year)).ToList();

                    int openBal = 0;
                    if (lstopenBalances.Count > 0)
                    {
                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + i + 1 + "'>" + lstopenBalances[0].Opening_Balance + "</td></tr>");
                        openBal = 1;
                    }
                    else if (lstCurrentopenBalances.Count > 0 && openBal == 0)
                    {

                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + i + 1 + "'>" + lstCurrentopenBalances[0].Opening_Balance + "</td></tr>");
                    }
                    else
                    {
                        strTableBuilder.Append("<td id='tdpopOpeningbalanes_" + (i) + 1 + "'>0</td></tr>");
                    }

                    //}
                }
                strTableBuilder.Append("</tbody></table>");
                strTableBuilder.Append("</div>");
            }

            return strTableBuilder;
        }


        #region - SSforCustomer
        public ActionResult SecondarySalesCustomer()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public LargeJsonResult GetApprovedSS(string regionCode, int month, int year)
        {
            List<MVCModels.SecondarySalesforCustomerModel> lstApprovedSS = new List<MVCModels.SecondarySalesforCustomerModel>();
            List<MVCModels.SecondarySalesforCustomerModel> lstApprovedCustomer = new List<MVCModels.SecondarySalesforCustomerModel>();
            List<MVCModels.SecondarySalesforCustomerModel> lstCustomerModel = new List<MVCModels.SecondarySalesforCustomerModel>();
            lstApprovedSS = _objSSCustomer.GetApprovedSS(_objcurrentInfo.GetCompanyCode(), regionCode, month, year).ToList();
            lstApprovedCustomer = _objSSCustomer.GetApprovedCustomer(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            lstCustomerModel = _objSSCustomer.GetApprovedCustomerForEdit(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            List<JsonResult> lstSSandCustomerdetails = new List<JsonResult>();
            lstSSandCustomerdetails = new List<JsonResult>{Json(lstApprovedSS,JsonRequestBehavior.AllowGet),
                                                           Json(lstApprovedCustomer,JsonRequestBehavior.AllowGet),
                                                            Json(lstCustomerModel,JsonRequestBehavior.AllowGet)};
            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = lstSSandCustomerdetails
            };
        }


        public JsonResult GetSSSProductdetails(string regionCode, string baseCode, int month, int year)
        {
            List<MVCModels.SecondarySalesDetailsforCustomerModel> lstProductdetails = new List<MVCModels.SecondarySalesDetailsforCustomerModel>();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            lstProductdetails = _objSSCustomer.GetSSProductDetails(_objcurrentInfo.GetCompanyCode(), regionCode, baseCode, month, year);
            return Json(json.Serialize(lstProductdetails), JsonRequestBehavior.AllowGet);
        }

        public string InsertSSProductforCustomer(string customerProducts_arr, string formstatus)
        {
            string result = string.Empty;
            int rowsAffected = 0;

            List<MVCModels.SecondarySalesCustomerProductDeatilsModel> lstCustomerProductdetails = (List<MVCModels.SecondarySalesCustomerProductDeatilsModel>)JsonConvert.DeserializeObject(customerProducts_arr, typeof(List<MVCModels.SecondarySalesCustomerProductDeatilsModel>));
            if (lstCustomerProductdetails != null && lstCustomerProductdetails.Count > 0)
            {
                lstCustomerProductdetails.ForEach
                    (
                    s => s.Company_Code = _objcurrentInfo.GetCompanyCode()
                    );
                lstCustomerProductdetails.ForEach
                    (
                    s => s.Entered_By = _objcurrentInfo.GetUserName()
                    );
                lstCustomerProductdetails.ForEach
                    (
                     s => s.Entered_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff")
                    );
                lstCustomerProductdetails.ForEach
                    (
                     s => s.Status = "2"
                    );

                rowsAffected = _objSSCustomer.InsertSSCusotmerProduct(lstCustomerProductdetails, formstatus);
                if (rowsAffected > 0)
                {
                    result = "Inserted Successfully";
                }
            }
            return result;
        }
        #endregion - SSforCustomer


        #region PS AND SS ( CS-CR-3 )

        public int CheckPSIsPrefill(List<MVCModels.PS_SS_Input> lstPS_input)
        {
            //call bl to get the value;
            string companyCode = _objcurrentInfo.GetCompanyCode();
            int result = _objSPData.CheckPSIsPrefill(companyCode, Convert.ToInt32(lstPS_input[0].Month), Convert.ToInt32(lstPS_input[0].Year), lstPS_input[0].Region_Code);
            return result;
        }

        public JsonResult GetPSDetailsForSS(MVCModels.PS_SS_Input ps_ssInputs)
        {
            //call the fucntion
            return Json(GetLstPsInSS(ps_ssInputs), JsonRequestBehavior.AllowGet);
        }


        public Object GetLstPsInSS(MVCModels.PS_SS_Input ps_ssInputs)
        {
            SPData objSP = new SPData();

            // PS_EditableColumn
            List<MVCModels.PS_EditableColumn> lstPrefillColumns = new List<MVCModels.PS_EditableColumn>();
            lstPrefillColumns = _objSPData.GetEditableColumns(_objcurrentInfo.GetCompanyCode(), ps_ssInputs.Month, ps_ssInputs.Year, ps_ssInputs.Region_Code);

            List<MVCModels.PS_SecondarysalesDetails> lstDocumentType = new List<MVCModels.PS_SecondarysalesDetails>();
            lstDocumentType = _objSPData.GetPSDocumentTypeName(_objcurrentInfo.GetCompanyCode(), ps_ssInputs.Month, ps_ssInputs.Year, ps_ssInputs.Region_Code);

            List<MVCModels.PS_SecondarysalesDetails> lstPrimarySalesData = new List<MVCModels.PS_SecondarysalesDetails>();
            lstPrimarySalesData = objSP.GetPsInSS(ps_ssInputs).ToList();

            List<MVCModels.PS_SecondarysalesDetails> lstContent = new List<MVCModels.PS_SecondarysalesDetails>();

            foreach (var prefillColumn in lstPrefillColumns)
            {
                var lstUniqueProducts = lstPrimarySalesData.Select(x => x.Product_Code).Distinct();

                foreach (var productName in lstUniqueProducts)
                {
                    var lstFilterdDocTypes = lstDocumentType.Where(x => x.Column_Name == prefillColumn.Column_Name).ToList();
                    List<MVCModels.PS_SecondarysalesDetails> lstPositive = new List<MVCModels.PS_SecondarysalesDetails>();
                    lstPositive = lstFilterdDocTypes.Where(x => x.Calc_Mode == "+").ToList();

                    List<MVCModels.PS_SecondarysalesDetails> lstNegative = new List<MVCModels.PS_SecondarysalesDetails>();
                    lstNegative = lstFilterdDocTypes.Where(x => x.Calc_Mode == "-").ToList();

                    bool isMixedOperatrors = false;

                    if (lstPositive.Count > 0 && lstNegative.Count > 0) // Mixed operators are found
                    {
                        isMixedOperatrors = true;
                    }

                    string strCalc = "";

                    foreach (var objDocType in lstFilterdDocTypes)
                    {
                        var lstFiltered = lstPrimarySalesData.Where(x => x.Product_Code == productName && x.Column_Name == prefillColumn.Column_Name && x.Document_Type == objDocType.Document_Type).ToList();
                        string operatorSign = "+";

                        if (isMixedOperatrors)
                        {
                            operatorSign = objDocType.Calc_Mode;
                        }

                        if (lstFiltered.Count > 0)
                        {
                            strCalc += operatorSign + "(" + lstFiltered[0].Qty + ")";
                        }
                        else
                        {
                            strCalc += operatorSign + "(0)";
                        }
                    }

                    DataTable dt = new DataTable();

                    var _value = dt.Compute(strCalc == "" ? "0.0" : strCalc, "");
                    if (isMixedOperatrors)
                    {
                        if (Convert.ToDecimal(_value) < 0)
                        {
                            _value = "0.0";
                        }

                    }

                    MVCModels.PS_SecondarysalesDetails _objPS = new MVCModels.PS_SecondarysalesDetails();
                    _objPS.Product_Code = productName;
                    _objPS.Column_Name = prefillColumn.Column_Name;
                    _objPS.Qty = Convert.ToDecimal(_value);

                    lstContent.Add(_objPS);
                }
            }


            List<JsonResult> lstresult = new List<JsonResult>();
            lstresult = new List<JsonResult> { Json(lstPrefillColumns, JsonRequestBehavior.AllowGet), Json(lstContent, JsonRequestBehavior.AllowGet) };

            return lstresult;
        }

        #endregion

        /************************************************* Secondary Sales Delete Screen Methods*************************************/

        /// <summary>
        /// Method to get Stockist for Delete Screen
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="IncludeClosedStockiest"></param>
        /// <returns></returns>
        public JsonResult GetSSStockiestDetails(string regionCode, int IncludeClosedStockiest, int month, int year)
        {
            string companyCode = null;
            List<MVCModels.StockiestData> lstStockiest = null;
            try
            {
                DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
                BLApproval _objApproval = new BLApproval();
                companyCode = _objcurrentInfo.GetCompanyCode();
                lstStockiest = _objApproval.GetSSStockiestDetails(companyCode, regionCode, IncludeClosedStockiest, month, year);
                return Json(lstStockiest, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to get List of Secondary Sales For Delete Based on Order
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="stockiestCode"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public JsonResult GetListSecondarySalesForDelete(string regionCode, string stockiestCode, string mode)
        {
            List<MVCModels.StockiestEntryDetailsDelete> lstStockiestDetails = null;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLApproval _objApproval = new BLApproval();
                lstStockiestDetails = _objApproval.GetListSecondarySalesForDelete(companyCode, regionCode, stockiestCode, mode);
                return Json(lstStockiestDetails, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        /// <summary>
        /// Method to UnApprove or Delete SS
        /// </summary>
        /// <param name="details"></param>
        /// <param name="status"></param>
        /// <param name="remarks"></param>
        /// <param name="is_inherited"></param>
        /// <returns></returns>
        public bool DeleteandUnapproveSecondarysales(List<SSMainModelforEdit> lstDeleteDet, int status)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string UpdatedBy = objCurInfo.GetUserCode();
            bool result = objApp.DeleteSecondarysales(companyCode, lstDeleteDet, status, UpdatedBy);
            return result;

        }
        /// <summary>
        /// Method to Get Details of A Selected SS Record
        /// </summary>
        /// <param name="userCodeDetails"></param>
        /// <returns></returns>
        public JsonResult GetSSDetailsForSelectedRecord(string userCodeDetails)
        {
            List<MVCModels.SS_ProductsDetailedView> lstDetailed_SS = null;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string statementDate = userCodeDetails.Split('_')[4];
                statementDate = statementDate.Split('/')[2] + "-" + statementDate.Split('/')[1] + "-" + statementDate.Split('/')[0];
                BLApproval _objApproval = new BLApproval();
                lstDetailed_SS = _objApproval.GetSSDetailsForSelectedRecord(companyCode, userCodeDetails.Split('_')[0], userCodeDetails.Split('_')[1], userCodeDetails.Split('_')[2], statementDate, userCodeDetails.Split('_')[3]);
                return Json(lstDetailed_SS, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /****************************************************************************************************************************/
    }
}

