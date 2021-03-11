using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Data;
using DataControl;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ProductPriceMasterController : Controller
    {

        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "ProductPriceMaster Public Methods"
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Method is used to 
        /// </summary>
        /// <returns></returns>
        private IEnumerable<ProductPriceMasterModel> GetProductPriceDetails()
        {
            try
            {
                ProductPriceMasterModel objproductPriceMaster = new ProductPriceMasterModel();
                objproductPriceMaster.pm_Company_Code = _objcurrentInfo.GetCompanyCode();
                objproductPriceMaster.Rm_Company_Code = _objcurrentInfo.GetCompanyCode();
                objproductPriceMaster.Rtm_Company_Code = _objcurrentInfo.GetCompanyCode();
                objproductPriceMaster.Pp_Company_Code = _objcurrentInfo.GetCompanyCode();

                BLMaster objMaster = new BLMaster();
                return objMaster.GetProjectPriceMasterDetails(objproductPriceMaster);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// This method is Used to bind the data with ProdctPriceMaster Html Table
        /// </summary>
        /// <returns></returns>
        public string GetProductPriceMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<ProductPriceMasterModel> lstproductpriceMastermodel = (List<ProductPriceMasterModel>)GetProductPriceDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Region Type</td>");
                sb.Append("<td>Region</td>");
                sb.Append("<td>Product</td>");
                sb.Append("<td>Price</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstproductpriceMastermodel != null && lstproductpriceMastermodel.Count > 0)
                {
                    int i = 0;
                    foreach (var lstproductprice in lstproductpriceMastermodel)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Price_Code" + i + "'>" + lstproductprice.Price_Code + "</td>");
                        sb.Append("<td id='Region_Type_Name" + i + "'>" + lstproductprice.Region_Type_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Type_Code" + i + "'>" + lstproductprice.Region_Type_Code + "</td>");
                        sb.Append("<td id='Region_Name" + i + "'>" + lstproductprice.Region_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Code" + i + "'>" + lstproductprice.Region_Code + "</td>");
                        sb.Append("<td id='Product_Name" + i + "'>" + lstproductprice.Product_Name + "</td>");
                        sb.Append("<td style='display:none' id='Product_Code" + i + "'>" + lstproductprice.Product_Code + "</td>");
                        sb.Append("<td id='Price" + i + "'>" + lstproductprice.Price + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + lstproductprice.Effective_From + "</td>");
                        sb.Append("<td id='Effective_To" + i + "'>" + lstproductprice.Effective_To + "</td>");
                        sb.Append("<td id='Price_Status" + i + "'>" + lstproductprice.Price_Status + "</td>");
                    }
                }
                else
                {
                    sb.Append("<span>No Records TO Display</span>");
                }
                sb.Append("</body>");
                sb.Append("</table>");
                return sb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Method is used to download the ProductpriceMaster into Excel
        /// </summary>
        /// <returns></returns>

        public void PutProductPricemasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<ProductPriceMasterModel> lstproductpriceMastermodel = (List<ProductPriceMasterModel>)GetProductPriceDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Region Type</td>");
                sb.Append("<td>Region</td>");
                sb.Append("<td>Product</td>");
                sb.Append("<td>Price</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstproductpriceMastermodel != null && lstproductpriceMastermodel.Count > 0)
                {
                    int i = 0;
                    foreach (var lstproductprice in lstproductpriceMastermodel)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Price_Code" + i + "'>" + lstproductprice.Price_Code + "</td>");
                        sb.Append("<td id='Region_Type_Name" + i + "'>" + lstproductprice.Region_Type_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Type_Code" + i + "'>" + lstproductprice.Region_Type_Code + "</td>");
                        sb.Append("<td id='Region_Name" + i + "'>" + lstproductprice.Region_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Code" + i + "'>" + lstproductprice.Region_Code + "</td>");
                        sb.Append("<td id='Product_Name" + i + "'>" + lstproductprice.Product_Name + "</td>");
                        sb.Append("<td style='display:none' id='Product_Code" + i + "'>" + lstproductprice.Product_Code + "</td>");
                        sb.Append("<td id='Price" + i + "'>" + lstproductprice.Price + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + lstproductprice.Effective_From + "</td>");
                        sb.Append("<td id='Effective_To" + i + "'>" + lstproductprice.Effective_To + "</td>");
                        sb.Append("<td id='Price_Status" + i + "'>" + lstproductprice.Price_Status + "</td>");
                    }
                }
                else
                {
                    sb.Append("<span>No Records TO Display</span>");
                }
                sb.Append("</body>");
                sb.Append("</table>");
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "ProductpriceMaster" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        //Bind RegionType
        public JsonResult GetRegionType()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProductPriceMasterModel objDropRegionType = new ProductPriceMasterModel();
                objDropRegionType.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<ProductPriceMasterModel> lstDropregiontype = objMaster.GetRegionType(objDropRegionType);

                var DropRegiontype = (from regiontype in lstDropregiontype.AsEnumerable()
                                      select new ProductPriceMasterModel()
                                    {
                                        Region_Type_Name = regiontype.Region_Type_Name.ToString(),
                                        Region_Type_Code = regiontype.Region_Type_Code.ToString()
                                    }).ToList<ProductPriceMasterModel>();
                return Json(DropRegiontype);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        //Bind Region
        public JsonResult GetRegionList(string regionTypecode)
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProductPriceMasterModel objDropRegion = new ProductPriceMasterModel();
                objDropRegion.Company_Code = _objcurrentInfo.GetCompanyCode();
                objDropRegion.Region_Type_Code = regionTypecode;
                IEnumerable<ProductPriceMasterModel> lstdropregiontype = objMaster.GetRegion(objDropRegion);

                var DropRegionList = (from region in lstdropregiontype.AsEnumerable()
                                      select new ProductPriceMasterModel()
                                    {
                                        Region_Name = region.Region_Name.ToString(),
                                        Region_Code = region.Region_Code.ToString()
                                    }).ToList<ProductPriceMasterModel>();
                return Json(DropRegionList);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        //Bind Product
        public JsonResult GetProductList()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProductPriceMasterModel objDropProduct = new ProductPriceMasterModel();
                objDropProduct.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<ProductPriceMasterModel> lstdropProduct = objMaster.GetProduct(objDropProduct);

                var ProductList = (from product in lstdropProduct.AsEnumerable()
                                   select new ProductPriceMasterModel()
                                    {
                                        Product_Name = product.Product_Name.ToString(),
                                        Product_Code = product.Product_Code.ToString()
                                    }).ToList<ProductPriceMasterModel>();
                return Json(ProductList);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// ChangeStatus
        /// </summary>
        /// <param name="status"></param>
        /// <param name="priceCode"></param>
        /// <returns></returns>
        public bool ChangestatusforProductPriceMaster(string status, string priceCode)
        {
            string prodcutstatus = string.Empty;
            bool changeResult = false;
            try
            {
                prodcutstatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforProductpriceMaster(prodcutstatus, priceCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:priceCode", priceCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }

        /// <summary>
        /// InsertandUpdate
        /// </summary>
        /// <param name="regionTypecode"></param>
        /// <param name="regionCode"></param>
        /// <param name="productCode"></param>
        /// <param name="price"></param>
        /// <param name="effectiveFrom"></param>
        /// <param name="effectiveTo"></param>
        /// <param name="Mode"></param>
        /// <param name="priceCodeval"></param>
        /// <returns></returns>
        public int InsertandUpdateProductprice(string regionTypecode, string regionCode, string productCode, string price,string effectiveFrom,
                                               string effectiveTo, string Mode, string priceCodeval)
        {
            string result1 = string.Empty;
            BLMaster Master = new BLMaster();
            ProductPriceMasterModel objproductPricemasterModer = new ProductPriceMasterModel();
            List<ProductPriceMasterModel> lstproductprice = new List<ProductPriceMasterModel>();

            try
            {
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    objproductPricemasterModer.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objproductPricemasterModer.Region_Type_Code = regionTypecode;
                    objproductPricemasterModer.Region_Code = regionCode;
                    objproductPricemasterModer.Product_Code = productCode;
                    objproductPricemasterModer.Price_Status = "1";
                    objproductPricemasterModer.Price = price;
                    objproductPricemasterModer.Effective_From = effectiveFrom;
                    objproductPricemasterModer.Effective_To = effectiveTo;
                    objproductPricemasterModer.Created_By = _objcurrentInfo.GetUserName();
                    objproductPricemasterModer.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstproductprice.Add(objproductPricemasterModer);
                    int result = Master.InsertforProductPriceMaster(lstproductprice);
                    return result;
                }
                else
                {
                    objproductPricemasterModer.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objproductPricemasterModer.Region_Type_Code = regionTypecode;
                    objproductPricemasterModer.Region_Code = regionCode;
                    objproductPricemasterModer.Product_Code = productCode;
                    objproductPricemasterModer.Price_Code = priceCodeval;
                    objproductPricemasterModer.Price = price;
                    objproductPricemasterModer.Effective_From = effectiveFrom;
                    objproductPricemasterModer.Effective_To = effectiveTo;
                    objproductPricemasterModer.Updated_By = _objcurrentInfo.GetUserName();
                    objproductPricemasterModer.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstproductprice.Add(objproductPricemasterModer);
                    int result = Master.UpdateforProductpriceMaster(lstproductprice);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:regionTypecode", regionTypecode);
                dicContext.Add("Filter:regionCode", regionCode);
                dicContext.Add("Filter:productCode", productCode);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:price", price);
                dicContext.Add("Filter:effectiveFrom", effectiveFrom);
                dicContext.Add("Filter:effectiveTo", effectiveTo);
                dicContext.Add("Filter:priceCodeval", priceCodeval);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }
        #endregion "ProductPriceMaster Public Methods"
    }
}
