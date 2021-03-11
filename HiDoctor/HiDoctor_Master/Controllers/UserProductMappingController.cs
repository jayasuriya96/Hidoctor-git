using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Web;
using DataControl;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UserProductMappingController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        public ActionResult UserProductMapping()
        {
            return View();
        }

        public JsonResult GetUserType()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            BLMaster _objMaster = new BLMaster();
            List<DivisionUserProducts> lstUserType = new List<DivisionUserProducts>();
            lstUserType = _objMaster.GetUserTypeNamesforProductMapping(_objcurrentInfo.GetCompanyCode()).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstUserType));
        }

        public JsonResult GetUsersbyUserTypeCode(string userTypeCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            BLUser _objUser = new BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUsers = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUsers = _objUser.GetUsersByUserType(_objcurrentInfo.GetCompanyCode(), userTypeCode).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstUsers));
        }

        public string GetUserProductMapping(string userTypeCode)
        {
            string strProductType = "";
            string strProdoductTypeNames = "";
            StringBuilder strTbl = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLMaster _objMaster = new BLMaster();
                List<MVCModels.HiDoctor_Master.ProductandSampleModel> lstSampleandProductsModel = new List<MVCModels.HiDoctor_Master.ProductandSampleModel>();
                List<MVCModels.HiDoctor_Master.UserProductaMappingModel> lstUserProductMapping = new List<MVCModels.HiDoctor_Master.UserProductaMappingModel>();
                lstSampleandProductsModel = _objMaster.GetProductandSample(companyCode, userTypeCode).ToList();
                if (lstSampleandProductsModel.Count > 0 && lstSampleandProductsModel != null)
                {
                    foreach (var sampleProduct in lstSampleandProductsModel[0].lstsamples)
                    {
                        if (!string.IsNullOrEmpty(sampleProduct.Privilege_Value_Name))
                        {
                            strProductType += sampleProduct.Privilege_Value_Name + ',';
                        }
                    }
                    foreach (var NonsampleProduct in lstSampleandProductsModel[0].lstNonsample)
                    {
                        if (!string.IsNullOrEmpty(NonsampleProduct.Privilege_Value_Name))
                        {
                            strProductType += NonsampleProduct.Privilege_Value_Name + ',';
                        }
                    }
                }
                if (!string.IsNullOrEmpty(strProductType))
                {
                    strProdoductTypeNames = strProductType;
                }
                else
                {
                    strProdoductTypeNames = "''";
                }
                lstUserProductMapping = _objMaster.GetUserProductMapping(companyCode, strProdoductTypeNames).ToList();
                if (lstUserProductMapping != null && lstUserProductMapping.Count > 0)
                {
                    strTbl.Append("<table WIDTH='100%' id='tblsummary' class='table table-striped'>");
                    strTbl.Append("<thead class='active'>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<th>Select<input type='checkbox' id='userproductbulkChk' name='bulk_UserProduct' onclick='fnCheckAll();' /></th>");
                    strTbl.Append("<th>Product</th><th>Speciality</th><th>Category</th><th>Brand</th>");
                    strTbl.Append("</tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    foreach (var ProductMapping in lstUserProductMapping)
                    {
                        strTbl.Append("<tr>");
                        strTbl.Append("<td><input type='checkbox' id='chk_UserProduct' value='" + ProductMapping.Product_Code + "' name='chk_UserProduct' /></td>");
                        //Product
                        strTbl.Append("<td>");
                        strTbl.Append(ProductMapping.Product_Name);
                        strTbl.Append("</td>");
                        //Speciality
                        strTbl.Append("<td>");
                        strTbl.Append(ProductMapping.Speciality_Name);
                        strTbl.Append("</td>");
                        //Category
                        strTbl.Append("<td>");
                        strTbl.Append(ProductMapping.Category_Name);
                        strTbl.Append("</td>");
                        //Brand
                        strTbl.Append("<td>");
                        strTbl.Append(ProductMapping.Brand_Name);
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table>");
                }
                else
                {
                    strTbl.Append("No Records To Display.");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
            return strTbl.ToString();
        }
        /// <summary>
        /// Insert User ProductMapping
        /// </summary>
        /// <param name="userCodes"></param>
        /// <param name="productCodes"></param>
        /// <returns></returns>
        public string InsertUserProductMapping(string userCodes, string productCodes)
        {
            int result = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            BLMaster _objMaster = new BLMaster();
            StringBuilder strBuild = new StringBuilder();
            string currentDate = DateTime.Now.ToString("yyyy-MM-dd");
            try
            {
                result = _objMaster.InsertUserProduct(companyCode, userCodes, productCodes, currentDate);
                if (result > 0)
                {
                    strBuild.Append("User Product Mapped Sucessfully.");
                }
                else
                {
                    strBuild.Append("This User Product Already Mapped");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCodes", userCodes);
                dicContext.Add("productCodes", productCodes);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            return strBuild.ToString();
        }
    }
}
