using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class SalestypeMappngController : Controller
    {
        //
        // GET: /SalestypeMappng/
        DataControl.SPData objSData = new DataControl.SPData();
        Models.SalestypeMapping objUserModel = new Models.SalestypeMapping();
        DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data objData = new DataControl.Data();

        BL_ProductMapping _objPrdMap = new BL_ProductMapping();
        DataControl.JSONConverter json = new DataControl.JSONConverter();
        DataControl.CurrentInfo _objCurrent = new DataControl.CurrentInfo();

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /SalestypeMappng/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /SalestypeMappng/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /SalestypeMappng/Create

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
        // GET: /SalestypeMappng/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /SalestypeMappng/Edit/5

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
        // GET: /SalestypeMappng/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /SalestypeMappng/Delete/5

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
        //sample product method//
        public JsonResult GetAllproduct(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();

            try
            {
                string UserCode = string.Empty;
                DataSet dssub = new DataSet();
                ds.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    string StrSQL = "EXEC USP_hdGetActivityTypeMapping " + "'" + objCurrentInfo.GetCompanyCode() + "'";
                    dssub = ds.ExecuteDataSet(StrSQL);
                 
                }
                DataTable dt = new DataTable();
                dt = dssub.Tables[0];
                List<Models.SalestypeMapping> lstMOdel = (from c in dt.AsEnumerable()
                                                          select new Models.SalestypeMapping
                                                          {
                                                              ProductName = c["Product_Name"].ToString(),
                                                              BrandName = c["Brand_Name"].ToString(),
                                                              SpecialityName = c["Speciality_Name"].ToString(),
                                                              Productcode = c["Product_code"].ToString(),



                                                          }).ToList<Models.SalestypeMapping>();

                return Json(lstMOdel, JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        //Non sample Product method//
        public JsonResult GetAllnonsaleproduct(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string UserCode = string.Empty;
                DataSet dssub = new DataSet();
                ds.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    // string StrSQL = "EXEC Sp_hdGetNonsaleproduct " + "'" + objCurrentInfo.GetCompanyCode() + "'";
                    // dssub = ds.ExecuteDataSet(StrSQL);
                    string product_code = collection["product_code"].ToString();
                    string StrSQL = "EXEC Sp_hdCompetitorProductType " + "'" + product_code + "'";
                    dssub = ds.ExecuteDataSet(StrSQL);

                }
                DataTable dt = new DataTable();
                dt = dssub.Tables[0];
                List<Models.SalestypeMapping> lstMOdel = (from c in dt.AsEnumerable()
                                                          select new Models.SalestypeMapping
                                                          {
                                                              ProductName = c["Product_Name"].ToString(),
                                                              BrandName = c["Brand_Name"].ToString(),
                                                              SpecialityName = c["Speciality_Name"].ToString(),
                                                           // ProductTypeName = c["Product_Type_Name"].ToString(),
                                                              CompetitorName = c["Competitor_Name"].ToString(),
                                                              UOMName = c["UOM_Name"].ToString(),
                                                              UOMTypeName = c["UOM_Type_Name"].ToString(),
                                                              Productcode = c["Product_code"].ToString(),


                                                          }).ToList<Models.SalestypeMapping>();

                return Json(lstMOdel, JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        //product insert method//
        public string productInsert(string ProductCode, string MappingCode, string Src_Product_Type, string Des_Product_Type)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string Result = string.Empty;
                //string salesproductCode = string.Empty;
                //salesproductCode = collection["ProductCode"];
                string effectiveFrom = string.Empty;
                effectiveFrom = DateTime.Now.ToString("yyyy-MM-dd");
                string effectiveTo = string.Empty;
                effectiveTo = DateTime.Now.ToString("yyyy-MM-dd");
                string createdDate = string.Empty;
                createdDate = DateTime.Now.ToString("yyyy-MM-dd");
                string createdBy = string.Empty;
                string mappingproductCode = string.Empty;
                string insertQry = string.Empty;
                //string[] arMapping = collection["MappingCode"].ToString().Split('^');
                string CompanyCode = objCurrentInfo.GetCompanyCode();
                string UserCode = objCurrentInfo.GetUserCode();
                DataRow[] rowFilter;

                //dsMappingDetails =
           
                DataSet dsMappingDetails = new DataSet();
                //ds.OpenConnection(CompanyCode);
                //{
                //    string StrSQL = "EXEC SP_hdGetSalesProductmapping " + "'" + CompanyCode + "','" + ProductCode + "'";
                //    dsMappingDetails = ds.ExecuteDataSet(StrSQL);
                   
                //}
                ds.OpenConnection(CompanyCode);
                {
                    string StrSQL = "EXEC Sp_hdSalesProductHistory" + "'" + CompanyCode + "','" + ProductCode + "','" + MappingCode + "','"+ UserCode + "','" + Src_Product_Type + "','" + Des_Product_Type + "'";
                    dsMappingDetails = ds.ExecuteDataSet(StrSQL);

                }

                //foreach (string mappingCode in arMapping)
                //{
                //    if (!string.IsNullOrEmpty(mappingCode))
                //    {
                //        rowFilter = dsMappingDetails.Tables[0].Select("Mapping_Product_Code = '" + mappingCode.Split('|')[0] + "' AND Record_Status = '1'");

                //        if (rowFilter.Length > 0 && mappingCode.Split('|')[1].Trim().ToUpper() == "F")
                //        {
                //            insertQry += "UPDATE tbl_SFA_Sales_Product_Mapping SET Record_Status = '0',Effective_To = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "'";
                //            insertQry += " WHERE Sales_Product_Code = '" + salesproductCode + "' AND Mapping_Product_Code = '" + mappingCode.Split('|')[0].Trim() + "' AND Company_Code = '" + objCurrentInfo.GetCompanyCode() + "';";
                //        }
                //        else if (rowFilter.Length > 0 && mappingCode.Split('|')[1].Trim().ToUpper() == "T")
                //        {
                 //            insertQry += " WHERE Sales_Product_Code = '" + salesproductCode + "' AND Mapping_Product_Code = '" + mappingCode.Split('|')[0].Trim() + "' AND Company_Code = '" + objCurrentInfo.GetCompanyCode() + "';";
                //        }
                //        else
                //        {
                //            if (mappingCode.Split('|')[1].Trim() == "T")
                //            {
                //                rowFilter = dsMappingDetails.Tables[0].Select("Mapping_Product_Code = '" + mappingCode.Split('|')[0] + "' AND Record_Status = '0'");

                //                if (rowFilter.Length > 0 && effectiveTo = DateTime.Now.ToString("yyyy-MM-dd"))
                //                {
                //                    insertQry += "UPDATE tbl_SFA_Sales_Product_Mapping SET Record_Status = '1',Effective_From = '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "'";
                //                    insertQry += " WHERE Sales_Product_Code = '" + salesproductCode + "' AND Mapping_Product_Code = '" + mappingCode.Split('|')[0].Trim() + "' AND Company_Code = '" + objCurrentInfo.GetCompanyCode() + "';";
                //                }
                //                else
                //                {
                //                    insertQry += "INSERT INTO tbl_SFA_Sales_Product_Mapping (Company_Code,Sales_Product_Code,Mapping_Product_Code,Effective_From,Created_Date,Created_By,Record_Status)";
                //                    insertQry += "VALUES ('" + objCurrentInfo.GetCompanyCode() + "','" + salesproductCode + "','" + mappingCode.Split('|')[0].Trim() + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff") + "','" + objCurrentInfo.GetUserCode() + "','1');";
                //                }
                //            }
                //        }
                //    }
                //}

                if (!string.IsNullOrEmpty(insertQry))
                {
                    insertQry = insertQry.TrimEnd(';');
                }

                DataControl.SPData objSpData = new DataControl.SPData();
                int returnValue = objSpData.InsertSalesProductMapping(insertQry);

                if (returnValue == 1)
                {
                    return "SUCCESS";
                }
                else
                {
                    return "SORRY. UNABLE TO SAVE DATA";
                }

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "productInsert()");
                return ex.Message;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        //Get mapping product//
        public JsonResult GetAllSelectProduct(FormCollection collection)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {
                string salesproductCode = string.Empty;
                string Result = string.Empty;
                salesproductCode = collection["ProductCodeselect"];            
                DataSet dssub = new DataSet();
                ds.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    string StrSQL = "EXEC SP_HdGet_MappingProductSelect " + "'" + objCurrentInfo.GetCompanyCode() + "','" + salesproductCode + "'";
                    dssub = ds.ExecuteDataSet(StrSQL);
                   
                }
                DataTable dt = new DataTable();
                dt = dssub.Tables[0];
                List<Models.SalestypeMapping> lstMOdel = (from c in dt.AsEnumerable()
                                                          select new Models.SalestypeMapping
                                                          {
                                                              Productcode = c["Sales_Product_Code"].ToString(),
                                                              SalesMappingcode = c["Mapping_Product_Code"].ToString(),
                                                          }).ToList<Models.SalestypeMapping>();

                return Json(lstMOdel, JsonRequestBehavior.AllowGet);
            }
            finally
            {
                ds.CloseConnection();
            }


        }


        //Get Destination Product Type List
        public JsonResult GetProductTypelstForDes(string product_Type)
        {
            List<DestinationProductTypelst> lstdesProdTypeList = new List<DestinationProductTypelst>();
            lstdesProdTypeList = _objPrdMap.GetProductTypelstForDes(product_Type);
            return Json(lstdesProdTypeList, JsonRequestBehavior.AllowGet);
        }

        //Get Source Product List
        public JsonResult GetSourceProductList(string Src_Prd_Type)
        {
            List<ProductMapping> lstsrcProdList = new List<ProductMapping>();
            lstsrcProdList = _objPrdMap.GetSourceProductList(Src_Prd_Type);
            return Json(lstsrcProdList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDestinationProductList(string product_code, string des_product_type)
        {
            List<DestinationProductMapping> lstdesProdList = new List<DestinationProductMapping>();
            lstdesProdList = _objPrdMap.GetDestinationProductList(product_code, des_product_type);
            return Json(lstdesProdList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllSelectProductlst(string Souce_Product_Code)
        {
            List<SelectedProductsList> lstSelectedProd = new List<SelectedProductsList>();
            lstSelectedProd = _objPrdMap.GetAllSelectProductlst(Souce_Product_Code);
            return Json(lstSelectedProd, JsonRequestBehavior.AllowGet);
        }
    }
}
