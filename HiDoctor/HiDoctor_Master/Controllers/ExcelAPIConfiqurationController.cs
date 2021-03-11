using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;
using MVCModels;
using System.Collections;
using Newtonsoft.Json;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ExcelAPIConfiqurationController : Controller
    {

        public ActionResult ExcelAPIConfiquration()
        {
            return View();
        }

        //Insert category//
        public int InsertAPICategory(string CategoryName, string status, string Description)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string createdBy = objCurInfo.GetUserName();
            string createdDate = DateTime.Now.ToString();
            try
            {
                int result = _objMapping.APIInsertCategory(CategoryName, status, createdBy, createdDate, Description);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CategoryName", CategoryName);
                dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public string GetCategoryDetail()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<APICategoryModel> lstCategoryMap = new List<APICategoryModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstCategoryMap = (List<APICategoryModel>)_objMapping.GetAPICategoryDetail();
                if (lstCategoryMap != null && lstCategoryMap.Count > 0)
                {
                    sbTableContent.Append("<table id='tblAPIcategory' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>API Category Name</td>");
                    sbTableContent.Append("<td>API Category Description</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstCategoryMap)
                    {
                        sbTableContent.Append("<tr><td><a href='#' style='color:blue' onclick ='fnEdit(\"" + item.API_Category_Code.ToString() + "_" + item.API_Category_Name.ToString() + "_" + item.API_Category_Description.ToString() + "_" + item.API_Category_Status.ToString() + "\");'>Edit</a></td>");
                        sbTableContent.Append("<td>" + item.API_Category_Name + "</td>");
                        sbTableContent.Append("<td>" + item.API_Category_Description + "</td>");
                        sbTableContent.Append("<td>" + item.API_Category_Status + "</td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstCategoryMap);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public int UpdateAPICategory(string CategoryName, string status, string description, string APIcategoryID)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string createdBy = objCurInfo.GetUserName();
            string createdDate = DateTime.Now.ToString();
            try
            {
                int result = _objMapping.UpdateAPICategory(CategoryName, status, createdBy, createdDate, description, APIcategoryID);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Filter:requestCode", status);
                dicContext.Add("Filter:userTypeCode", APIcategoryID);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }


        public JsonResult GetAPICategory()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            APICategoryModel objDroAPICategory = new APICategoryModel();

            try
            {
                IEnumerable<APICategoryModel> lstAPICategory = _objBlmaster.GetAPICategory();
                var apiCatlist = (from cat in lstAPICategory.AsEnumerable()
                                  select new APICategoryModel()
                                  {
                                      API_Category_Code = cat.API_Category_Code.ToString(),
                                      API_Category_Name = cat.API_Category_Name.ToString()
                                  }).ToList<APICategoryModel>();
                return Json(apiCatlist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }

        //insert sevice

        public int InsertAPIService(string APICategoryCode, string ServiceId, string ServiceDescription, string ServiceType,
            string ServiceParamNos, string ServiceParams, string ExcelOutPutHeaders, string ServiceInternalSPName, string serviceTypeMappingClassName,
            string serviceName, string IsVisible)
        {

            if (IsVisible == "1")
            {
                IsVisible = "Y";
            }
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string createdBy = objCurInfo.GetUserName();
            string createdDate = DateTime.Now.ToString();
            try
            {
                int result = _objMapping.InsertAPIService(APICategoryCode, ServiceId, ServiceDescription, ServiceType, ServiceParamNos,
                    ServiceParams, ExcelOutPutHeaders, ServiceInternalSPName, serviceTypeMappingClassName, serviceName, IsVisible);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:APICategoryCode", APICategoryCode);
                dicContext.Add("Filter:ServiceId", ServiceId);
                dicContext.Add("Filter:ServiceDescription", ServiceDescription);
                dicContext.Add("Filter:Status", ServiceDescription);
                dicContext.Add("Filter:ServiceType", ServiceType);
                dicContext.Add("Filter:ServiceParamNos", ServiceParamNos);
                dicContext.Add("Filter:ServiceParams", ServiceParams);
                dicContext.Add("Filter:ExcelOutPutHeaders", ExcelOutPutHeaders);
                dicContext.Add("Filter:ServiceInternalSPName", ServiceInternalSPName);
                dicContext.Add("Filter:serviceTypeMappingClassName", serviceTypeMappingClassName);
                dicContext.Add("Filter:serviceName", serviceName);
                dicContext.Add("Filter:IsVisible", IsVisible);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }
        public string GetAPIServiceDetail()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            string APIId = "";
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<APIServiceModel> lstServiceMap = new List<APIServiceModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstServiceMap = (List<APIServiceModel>)_objMapping.GetAPIServiceDetail(APIId);
                if (lstServiceMap != null && lstServiceMap.Count > 0)
                {
                    sbTableContent.Append("<table id='tblAPISERVICE' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>API Category Name</td>");
                    sbTableContent.Append("<td>Service ID</td>");
                    sbTableContent.Append("<td>Service Description</td>");
                    sbTableContent.Append("<td>Service Type</td>");
                    sbTableContent.Append("<td>Service Param Nos</td>");
                    sbTableContent.Append("<td>Service Params</td>");
                    sbTableContent.Append("<td>Excel OutPut Headers</td>");
                    sbTableContent.Append("<td>Service Internal SPName</td>");
                    sbTableContent.Append("<td>Service Type Mapping Class Name</td>");
                    sbTableContent.Append("<td>Service Name</td>");
                    sbTableContent.Append("<td>Is_Visible to all company</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstServiceMap)
                    {
                        sbTableContent.Append("<tr><td><a href='#' style='color:blue' onclick ='fnServiceEdit(\"" + item.API_ID + "\");'>Edit</a></td>");
                        sbTableContent.Append("<td id='API_CategoryName_" + item.API_ID + "'>" + item.API_Category_Name + "</td>");
                        sbTableContent.Append("<td style='display:none' id='API_CategoryCode_" + item.API_ID + "'>" + item.API_Category_Code + "</td>");
                        sbTableContent.Append("<td id='API_ServiceId_" + item.API_ID + "'>" + item.ServiceId + "</td>");
                        sbTableContent.Append("<td id='API_ServiceDescrn_" + item.API_ID + "'>" + item.ServiceDescrn + "</td>");
                        sbTableContent.Append("<td id='API_ServiceType_" + item.API_ID + "'>" + item.ServiceType + "</td>");
                        sbTableContent.Append("<td id='API_ServiceParamNos_" + item.API_ID + "'>" + item.ServiceParamNos + "</td>");
                        sbTableContent.Append("<td id='API_ServiceParams_" + item.API_ID + "'>" + item.ServiceParams + "</td>");
                        sbTableContent.Append("<td id='API_ServiceOutputHeaders_" + item.API_ID + "'>" + item.ServiceOutputHeaders + "</td>");
                        sbTableContent.Append("<td id='API_ServiceInternalName_" + item.API_ID + "'>" + item.ServiceInternalName + "</td>");
                        sbTableContent.Append("<td id='API_ServiceTypeMappingClassName_" + item.API_ID + "'>" + item.ServiceTypeMappingClassName + "</td>");
                        sbTableContent.Append("<td id='API_ServiceName_" + item.API_ID + "'>" + item.ServiceName + "</td>");
                        sbTableContent.Append("<td id='API_Is_Visible_" + item.API_ID + "'>" + item.Is_Visible + "</td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstServiceMap);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }


        //UpdateAPIService

        public int UpdateAPIService(string APICategoryCode, string ServiceId, string ServiceDescription, string ServiceType,
          string ServiceParamNos, string ServiceParams, string ExcelOutPutHeaders, string ServiceInternalSPName, string serviceTypeMappingClassName,
          string serviceName, string IsVisible, string apiID)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string createdBy = objCurInfo.GetUserName();
            string createdDate = DateTime.Now.ToString();
            if (IsVisible == "1")
            {
                IsVisible = "Y";
            }

            try
            {
                int result = _objMapping.UpdateAPIService(APICategoryCode, ServiceId, ServiceDescription, ServiceType, ServiceParamNos,
                    ServiceParams, ExcelOutPutHeaders, ServiceInternalSPName, serviceTypeMappingClassName, serviceName, IsVisible, apiID);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:APICategoryCode", APICategoryCode);
                dicContext.Add("Filter:ServiceId", ServiceId);
                dicContext.Add("Filter:ServiceDescription", ServiceDescription);
                dicContext.Add("Filter:Status", ServiceDescription);
                dicContext.Add("Filter:ServiceType", ServiceType);
                dicContext.Add("Filter:ServiceParamNos", ServiceParamNos);
                dicContext.Add("Filter:ServiceParams", ServiceParams);
                dicContext.Add("Filter:ExcelOutPutHeaders", ExcelOutPutHeaders);
                dicContext.Add("Filter:ServiceInternalSPName", ServiceInternalSPName);
                dicContext.Add("Filter:serviceTypeMappingClassName", serviceTypeMappingClassName);
                dicContext.Add("Filter:serviceName", serviceName);
                dicContext.Add("Filter:IsVisible", IsVisible);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public JsonResult GetAPIServiceID()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            APICategoryModel objDroAPICategory = new APICategoryModel();
            string APIId = "";
            try
            {
                IEnumerable<APIServiceModel> lstAPICategory = _objBlmaster.GetAPIServiceDetail(APIId);
                var apiCatlist = (from cat in lstAPICategory.AsEnumerable()
                                  select new APIServiceModel()
                                  {
                                      API_ID = cat.API_ID.ToString(),
                                      ServiceId = cat.ServiceId.ToString()
                                  }).ToList<APIServiceModel>();
                return Json(apiCatlist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }


        public string GetAPIServiceDefinInputDetail(string APIServiceId)
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            string[] APIparameter;
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<APIServiceModel> lstServiceMap = new List<APIServiceModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstServiceMap = (List<APIServiceModel>)_objMapping.GetAPIServiceDetail(APIServiceId);
                if (lstServiceMap != null && lstServiceMap.Count > 0)
                {
                    int i = 0;
                    sbTableContent.Append("<table id='tblAPIInputs' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Service Parameters</td>");
                    sbTableContent.Append("<td>Display Order</td>");
                    sbTableContent.Append("<td>Get Session</td>");
                    sbTableContent.Append("<td>Session Key</td>");
                    sbTableContent.Append("<td>Show in UI</td>");
                    sbTableContent.Append("<td>Control type</td>");
                    sbTableContent.Append("<td>Description</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstServiceMap)
                    {
                        APIparameter = item.ServiceParams.Split(',');
                        foreach (string splitParam in APIparameter)
                        {
                            i++;
                            sbTableContent.Append("<tr ><td id='ParamName" + i + "'><span id='splitParam_" + i + "'>" + splitParam + "</span></td>");
                            sbTableContent.Append("<td id='textbox " + i + "'><input id='paramOrder_" + i + "'value='" + i + "' type='TextBox'></td>");
                            sbTableContent.Append("<td id='checkboxSession " + i + "'><input type='checkbox' onclick='fnGetSession()' id='Chk_getsession_" + i + "' name='chk_session' /></td>");
                            sbTableContent.Append("<td id='ddl " + i + "'><select id='ddlSessionSelection_" + i + "'><option value='0'>-Select Mode-</option> <option value='Comp_Code'>Comp_Code</option><option value='User_Code'>User_Code</option><option value='Region_Code'>Region_Code</option><option value='User_Type_Code'>User_Type_Code</option></select></td>");
                            sbTableContent.Append("<td id='checkUI " + i + "'><input type='checkbox' onclick='fnGetUI()' id='Chk_UI_" + i + "' Value='Y' name='chk_UI' /></td>");
                            sbTableContent.Append("<td id='ddlControl_ " + i + "'><select id='ddlControl_" + i + "'><option value='0'>-Select Mode-</option> <option value='TEXT'>TEXT</option><option value='DATE'>DATE</option><option value='TEXT_CSV'>TEXT_CSV</option></select></td>");
                            sbTableContent.Append("<td id='textarea " + i + "'><textarea id='Description_" + i + "'></textarea></td>");

                        }
                        sbTableContent.Append("<td></td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstServiceMap);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }


        public int InsertAPIUIDef(string APIJson)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string createdBy = objCurInfo.GetUserName();
            string createdDate = DateTime.Now.ToString();

            try
            {
                int result = _objMapping.InsertAPIUIDef(APIJson);

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                //  dicContext.Add("Filter:CategoryName", CategoryName);
                // dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public string GetAPIServiceUserType()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();

            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<UserTypeModel> lstuserType = new List<UserTypeModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstuserType = (List<UserTypeModel>)_objMapping.GetAPIUserTypeDetail(companyCode);
                if (lstuserType != null && lstuserType.Count > 0)
                {

                    sbTableContent.Append("<table id='tblAPIUserType' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>UserType Name</td>");
                    sbTableContent.Append("<td><input type='checkbox' id='bulkcheck'name='bulkchk_User' onclick='fnselectall()'/>Service Access</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    int i = 0;
                    foreach (var item in lstuserType)
                    {
                        i++;
                        sbTableContent.Append("<tr ><td><span id='userTypeName_" + i + "'>" + item.User_Type_Name + "</span></td>");
                        sbTableContent.Append("<td id='checkboxAccess " + i + "'><input type='checkbox'  id='Chk_Access_" + i + "'name='chk_Access' /></td>");
                        sbTableContent.Append("<td style='display:none'><span id='userTypeCode_" + i + "'>" + item.User_Type_Code + "</span></td>");
                        sbTableContent.Append("<td style='display:none'><span id='companyCode_" + i + "'>" + item.Company_Code + "</span></td>");
                        sbTableContent.Append("</tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstuserType);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }


        public int InsertAPICompanyAccess(string APICompanyJson)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string createdDate = DateTime.Now.ToString();

            try
            {
                int result = _objMapping.InsertAPICompanyAccess(APICompanyJson, companyCode);

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                //  dicContext.Add("Filter:CategoryName", CategoryName);
                // dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }


        public JsonResult GetAPIServiceMappedDetail(string APIServiceId)
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                IEnumerable<CompanyAccessModel> lstAPICategory = _objBlmaster.GetAPIComapanyMapDetail(APIServiceId, companyCode);
                var apiCatlist = (from cat in lstAPICategory.AsEnumerable()
                                  select new CompanyAccessModel()
                                  {
                                      API_ID = cat.API_ID.ToString(),
                                      Company_Code = cat.Company_Code,
                                      User_Type_Code = cat.User_Type_Code,

                                  }).ToList<CompanyAccessModel>();
                return Json(apiCatlist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }


    }
}
