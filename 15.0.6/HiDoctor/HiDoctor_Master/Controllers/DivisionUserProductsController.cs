using DataControl;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    public class DivisionUserProductsController : Controller
    {
        //
        // GET: /DivisionUserProducts/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /DivisionUserProducts/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /DivisionUserProducts/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /DivisionUserProducts/Create

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
        // GET: /DivisionUserProducts/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /DivisionUserProducts/Edit/5

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
        // GET: /DivisionUserProducts/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /DivisionUserProducts/Delete/5

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

        public ActionResult DivisionUserProducts()
        {
            return View();
        }

        //get division
        public JsonResult GetDivision()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DivisionUserProducts objDivUserProduct = new DivisionUserProducts();
            objDivUserProduct.Company_Code = _objcurrentInfo.GetCompanyCode();
            objDivUserProduct.User_Code = _objcurrentInfo.GetUserCode();

            try
            {
                IEnumerable<DivisionUserProducts> lstDiv = _objBlmaster.GetDivisionNames(objDivUserProduct);
                var division = (from div in lstDiv.AsEnumerable()
                                select new DivisionUserProducts()
                                {
                                    Division_Code = div.Division_Code.ToString(),
                                    Division_Name = div.Division_Name.ToString()
                                }).ToList<DivisionUserProducts>();
                return Json(division);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", objDivUserProduct.Company_Code);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }

        public JsonResult GetUserTypeName()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DivisionUserProducts objDivUserProduct = new DivisionUserProducts();
            objDivUserProduct.Company_Code = _objcurrentInfo.GetCompanyCode();
            objDivUserProduct.User_Code = _objcurrentInfo.GetUserCode();
            try
            {
                IEnumerable<DivisionUserProducts> lstDiv = _objBlmaster.GetUserTypeNames(objDivUserProduct);
                var division = (from div in lstDiv.AsEnumerable()
                                select new DivisionUserProducts()
                                {
                                    User_Type_Code = div.User_Type_Code.ToString(),
                                    User_Type_Name = div.User_Type_Name.ToString()
                                }).ToList<DivisionUserProducts>();
                return Json(division);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", objDivUserProduct.Company_Code);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }

        public JsonResult GetUsers(string userTypeCode,string divisionCode)
        {
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.DivisionUserProducts> lstuser = new List<MVCModels.DivisionUserProducts>();
            string companyCode = _objCurInfo.GetCompanyCode();
            lstuser = (List<MVCModels.DivisionUserProducts>)_objBlmaster.GetUsersByUserTypeAndDivision(companyCode, userTypeCode, divisionCode);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstuser));
        }

        public JsonResult GetPrivileges(string userTypeCode)
        {
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.DivisionUserProducts> lstuser = new List<MVCModels.DivisionUserProducts>();
            string companyCode = _objCurInfo.GetCompanyCode();
            string privilageName = "DCR_PRODUCTS_BRING_TYPE";
            lstuser = (List<MVCModels.DivisionUserProducts>)_objBlmaster.Getprivilagevalues(companyCode, userTypeCode, privilageName);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstuser));
        }
        public string GetDivUserProductsDetails(string divisionCode, string proSelectMode, string productType, string actionType, string userCode)
        {
            //int totalPageNo = 1;
          //  const int PAGESIZE = 10;
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            List<DivisionUserProducts> lstUserProduct = new List<DivisionUserProducts>();
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();
            lstUserProduct = (List<DivisionUserProducts>)_objMapping.GetDivUserProductMapDetails(companyCode, divisionCode, proSelectMode, productType, actionType, userCode);
            try
            {
                if (lstUserProduct != null && lstUserProduct.Count > 0)
                {
                    //sbTableContent.Append(Pager.Paging(pageNo, totalPageNo));
                    sbTableContent.Append("<table id='tblUserProject' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td><input type='checkbox' id='bulkcheck'name='bulkchk_UserPro' onclick='fnselectall()'/>Select</td>");
                    sbTableContent.Append("<td>Product</td>");
                    sbTableContent.Append("<td>Product Type</td>");
                    sbTableContent.Append("<td>Brand</td>");
                    sbTableContent.Append("<td>Speciality</td>");
                    sbTableContent.Append("<td>Category</td>");
                    sbTableContent.Append("<td>Min Count</td>");
                    sbTableContent.Append("<td>Max Count</td>");
                    if(actionType.ToUpper() == "EDIT")
                        sbTableContent.Append("<td>Action</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstUserProduct)
                    {
                        var productCode = item.Product_Code.ToString();
                        sbTableContent.Append("<tr><td><input type='checkbox' id='Chk_Userpro_' value=" + productCode + " name='chk_DivUserPro' /></td>");
                        sbTableContent.Append("<td>" + item.Product_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Product_Type_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Brand_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Speciality_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Category_Name.ToString() + "</td>");
                      
                        sbTableContent.Append("<td> <input class='numeric minCount' type='text' name='txtMinCount' value='0' style='width:50px;'  /> </td>");
                        sbTableContent.Append("<td> <input type='text' class='numeric maxCount' name='txtMaxCount' value='0' style='width:50px;' /></td>");
                        if (actionType.ToUpper() == "EDIT")
                            sbTableContent.Append("<td><input type='button' class='btnSave' value='SAVE' onclick='fnSaveEdit(this);' /> </td>");
                        sbTableContent.Append("</tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }
        public int InsertUserProduct(string userCode, string productCode, string minCounts, string maxCounts)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            userCode = userCode + ',';
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd");
            try
            {
                int result = _objMapping.InsertDivisionUserProductMapping(companyCode, userCode, productCode, minCounts, maxCounts);
                //int result = _objMapping.InsertDivUserProducts(companyCode, userCode, productCode, currentDate);

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:ProductCode", productCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }

        public JsonResult GetUserProducts(FormCollection collection)
        {
            string userCode = collection["User_Code"].ToString();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            List<UserProducts> obj = _objBlmaster.GetUserProducts(userCode);
            return Json(obj,JsonRequestBehavior.AllowGet);
        }
        
        public string SaveUserProduct(FormCollection collection)
        {
            string User_Code = collection["User_Code"].ToString();
            string Product_Code = collection["Product_Code"].ToString();
            int minCount = collection["minCount"].ToString() == "" ? 0 : Convert.ToInt32(collection["minCount"].ToString());
            int maxCount = collection["maxCount"].ToString() == "" ? 0 : Convert.ToInt32(collection["maxCount"].ToString()); ;
            string User_Product_Status = collection["status"].ToString();

            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            string result = "";
            try
            {
                 result = _objMapping.SaveUserProduct(User_Code, Product_Code, minCount, maxCount, User_Product_Status);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
    }
}
