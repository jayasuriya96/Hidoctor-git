using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using System.Configuration;
using System.IO;
using System.Text;

namespace HiDoctor_Master.Controllers
{
    public class PriceGroupController : Controller
    {
        //
        // GET: /PriceGroup/
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.BLProduct _objBLProduct = new DataControl.BLProduct();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PriceGroupExcelUpload()
        {
            return View();
        }
        public ActionResult RegionPriceMapping()
        {
            return View();
        }
        [HttpPost]
        public ActionResult PriceGroupExcelUpload(HttpPostedFileBase file, FormCollection collection)
        {
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProdModel = _objBLProduct.PriceGroupExcelUpload(_objCurrentInfo.GetCompanyCode(), file);
            ViewBag.ExcelData = Json(_objJson.Serialize(lstProdModel));
            return View();
        }
        public JsonResult GetAllSaleProducts()
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProdModel = _objBLProduct.GetAllSaleProducts(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstProdModel));
        }
        public JsonResult GetPriceGroupHeader()
        {
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProdPriceModel = _objBLProduct.GetPriceGroupHeader(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstProdPriceModel));
        }

        //public JsonResult GetPriceGroupHeader(MVCModels.JQueryDataTableParamModel param)
        //{
        //    //  List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProdPriceModel = _objBLProduct.GetPriceGroupHeader();
        //    var allCompanies = _objBLProduct.GetPriceGroupHeader();
        //    IEnumerable<MVCModels.HiDoctor_Master.ProductPriceModel> filteredCompanies;
        //    //Check whether the companies should be filtered by keyword
        //    if (!string.IsNullOrEmpty(param.sSearch))
        //    {
        //        //Used if particulare columns are filtered 
        //        // var nameFilter = Convert.ToString(Request["sSearch_1"]);

        //        //Optionally check whether the columns are searchable at all 
        //        //var isNameSearchable = Convert.ToBoolean(Request["bSearchable_1"]);
        //        filteredCompanies = allCompanies
        //           .Where(c => c.Price_Group_Name.ToLower().Contains(param.sSearch.ToLower())
        //                       ||
        //            c.Price_Group_Code.ToLower().Contains(param.sSearch.ToLower())
        //                      );
        //    }
        //    else
        //    {
        //        filteredCompanies = allCompanies;
        //    }

        //    //  var isNameSortable = Convert.ToBoolean(Request["bSortable_1"]);
        //    var sortColumnIndex = Convert.ToInt32(Request["iSortCol_0"]);
        //    Func<MVCModels.HiDoctor_Master.ProductPriceModel, string> orderingFunction = (c => sortColumnIndex == 1 ? c.Price_Group_Name :
        //                                                sortColumnIndex == 2 ? c.Price_Group_Code : "");

        //    var sortDirection = Request["sSortDir_0"]; // asc or desc
        //    if (sortDirection == "asc")
        //        filteredCompanies = filteredCompanies.OrderBy(orderingFunction);
        //    else
        //        filteredCompanies = filteredCompanies.OrderByDescending(orderingFunction);

        //    var displayedCompanies = filteredCompanies.Skip(param.iDisplayStart).Take(param.iDisplayLength);
        //    var result = from c in displayedCompanies select new[] { Convert.ToString(c.ID), c.Price_Group_Name, c.Price_Group_Code };
        //    return Json(new
        //    {
        //        sEcho = param.sEcho,
        //        iTotalRecords = allCompanies.Count(),
        //        iTotalDisplayRecords = filteredCompanies.Count(),
        //        aaData = result
        //    },
        //                JsonRequestBehavior.AllowGet);
        //    // return Json(_objJson.Serialize(lstProdPriceModel));
        //}

        public JsonResult GetPriceGroupDetails(string priceGroupCode)
        {
            List<MVCModels.HiDoctor_Master.ProductPriceModel> lstProdPriceModel = _objBLProduct.GetPriceGroupDetails(_objCurrentInfo.GetCompanyCode(), priceGroupCode);
            return Json(_objJson.Serialize(lstProdPriceModel));
        }
        public StringBuilder GetPriceGroupExcelData()
        {
            StringBuilder _fileNameString = new StringBuilder();
            _fileNameString = _objBLProduct.GetPriceGroupExcelData();
            return _fileNameString;
        }

        public JsonResult GetRegionClassification()
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegClassi = _blRegion.GetRegionClassification(_objCurrentInfo.GetCompanyCode());
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegionType = _blRegion.GetRegionType(_objCurrentInfo.GetCompanyCode());
            List<JsonResult> lstJSON = new List<JsonResult> { Json(lstRegClassi, JsonRequestBehavior.AllowGet), Json(lstRegionType, JsonRequestBehavior.AllowGet) };
            return Json(_objJson.Serialize(lstJSON));
        }

        public JsonResult GetRegionType()
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegionType = _blRegion.GetRegionType(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstRegionType));
        }

        public JsonResult GetRegions(string regionTypes, string regionClassifications)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = _blRegion.GetRegionsByRegTypeAndRegClassification(_objCurrentInfo.GetCompanyCode(), regionTypes, regionClassifications);
            return Json(_objJson.Serialize(lstRegion));
        }

        public string InsertPriceGroup(string priceGroupName, string productPrice, string mode, string priceGroupCode)
        {
            return _objBLProduct.InsertPriceGroup(_objCurrentInfo.GetCompanyCode(), priceGroupName, productPrice, mode, priceGroupCode);
        }
        public string InsertPriceGroupMapping(string priceGroupCode, string regionCodes)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            return _blRegion.PriceGroupRegionMapping(_objCurrentInfo.GetCompanyCode(), priceGroupCode, regionCodes);
        }
        public JsonResult GetMappedRegionsByPriceGroup(string priceGroupCode)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = _blRegion.GetMappedRegionsByPriceGroup(_objCurrentInfo.GetCompanyCode(), priceGroupCode);
            return Json(_objJson.Serialize(lstRegion));
        }

        public string GetCustomersByRegionAndEntity(string regionCode, string entity, string priceGroupCode)
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.BL_Customer objCutomer = new DataControl.BL_Customer();
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer = null;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();

            List<MVCModels.HiDoctor_Master.DoctorModel> lstCustPriceGroup = new
                   List<MVCModels.HiDoctor_Master.DoctorModel>(objCutomer.GetCustomersByPriceGroupCode(objCurInfo.GetCompanyCode(), regionCode,
                    priceGroupCode, entity));
            lstCustomer = objCutomer.GetCustomersByRegionAndEntity(objCurInfo.GetCompanyCode(), regionCode, entity);
            strContent.Append("<table class='table table-striped' id='tblCustomer'><thead><tr><td>S.No</td>");
            strContent.Append("<td><input type='checkbox' name='chkSelectAllCustomer' onclick='fnSelectAllCustomers();'/></td>");
            strContent.Append("<td>Customer Name</td></tr></thead>");
            int i = 0;
            if (lstCustomer != null)
            {
                foreach (var dr in lstCustomer)
                {
                    i++;
                    strContent.Append("<tr><td>" + i + "</td>");
                    if (lstCustPriceGroup != null)
                    {
                        var filterd = lstCustPriceGroup.AsEnumerable().Where(z => z.Customer_Code == dr.Customer_Code.ToString()).ToList();
                        if (filterd.Count > 0)
                        {
                            strContent.Append("<td><input type='checkbox' checked='checked' id='chkSelect_"
                                + i + "' name='chkSelectCustomer' value='" + dr.Customer_Code + "'/></td>");
                        }
                        else
                        {
                            strContent.Append("<td><input type='checkbox' id='chkSelect_" + i + "' name='chkSelectCustomer' value='" + dr.Customer_Code + "'/></td>");
                        }
                    }
                    else
                    {
                        strContent.Append("<td><input type='checkbox' id='chkSelect_" + i + "' name='chkSelectCustomer' value='" + dr.Customer_Code + "'/></td>");
                    }
                    strContent.Append("<td>" + dr.Customer_Name + "</td>");
                    strContent.Append("</tr>");
                }
                strContent.Append("</table>");
            }
            return strContent.ToString();
        }

        public string UpdateCustomerPriceGroup(string customerCodes, string priceGroupCode, string regionCode, string entity)
        {
            string result = string.Empty;
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            if (!string.IsNullOrEmpty(customerCodes))
            {
                string[] ar;
                ar = customerCodes.Split('^');
                foreach (var dr in ar)
                {
                    if (!string.IsNullOrEmpty(dr.ToString()))
                    {
                        MVCModels.HiDoctor_Master.DoctorModel objCustomer = new MVCModels.HiDoctor_Master.DoctorModel();
                        objCustomer.Customer_Code = dr.ToString();
                        objCustomer.Price_Group_Code = priceGroupCode;
                        objCustomer.Region_Code = regionCode;
                        lstCustomer.Add(objCustomer);
                    }
                }
            }
            int rowsAffected = 0;
            rowsAffected = objRegion.UpdateCustomerPriceGroup(objCurInfo.GetCompanyCode(), lstCustomer, regionCode, entity);
            if (rowsAffected > 0)
            {
                result = "SUCCESS:Customer Price group mapping done successfully";
            }
            else
            {
                result = "ERROR:Error occured while mapping the price group to customer";
            }
            return result;
        }

        public JsonResult GetPriceGroupMappedCustomers(string regionCode, string entity)
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.BL_Customer objCutomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DoctorModel> lstCustomer = new
                    List<MVCModels.HiDoctor_Master.DoctorModel>(objCutomer.GetCustomersByRegionAndEntity(objCurInfo.GetCompanyCode(), regionCode, entity));
            return Json(_objJson.Serialize(lstCustomer));
        }
    }
}
