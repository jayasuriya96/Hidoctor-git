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
    public class RequestMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();


        #region "Request Master Public Methods"
        public ActionResult RequestMaster()
        {
            return View();
        }

        public ActionResult RequestCategoryMaster()
        {
            return View();
        }


        private IEnumerable<RequestMasterModel> GetRequestMasterDetails()
        {
            try
            {
                RequestMasterModel objRequestMaster = new RequestMasterModel();
                objRequestMaster.CM_Company_Code = _objcurrentInfo.GetCompanyCode();
                objRequestMaster.RM_Company_Code = _objcurrentInfo.GetCompanyCode();

                BLMaster objMaster = new BLMaster();
                return objMaster.GetRequestMasterDetails(objRequestMaster);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }


        //Method is Used to bind the Data with RequestMaste Html Table
        public string GetRequestMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<RequestMasterModel> lstRequestmastermodel = (List<RequestMasterModel>)GetRequestMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Request Name</td>");
                sb.Append("<td>Request Entity</td>");
                sb.Append("<td>Request Type</td>");
                sb.Append("<td>Credit Limit</td>");
                sb.Append("<td>Cycle</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstRequestmastermodel != null && lstRequestmastermodel.Count > 0)
                {
                    int i = 0;
                    foreach (var lstRequest in lstRequestmastermodel)
                    {
                        i++;
                        sb.Append("<tr><td><a href='#' id='E" + i + "' onclick='fnEditRequestMaster(this)'>Edit</a></td>");
                        sb.Append("<td><a href='#' id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Request_Code" + i + "'>" + lstRequest.Request_Code + "</td>");
                        sb.Append("<td id='Request_Name" + i + "'>" + lstRequest.Request_Name + "</td>");
                        sb.Append("<td id='Request_Entity" + i + "'>" + lstRequest.Request_Entity + "</td>");
                        sb.Append("<td id='Request_Type" + i + "'>" + lstRequest.Request_Type + "</td>");
                        sb.Append("<td id='Credit_Limit" + i + "'>" + lstRequest.Credit_Limit + "</td>");
                        sb.Append("<td style='display:none' id='Cycle_Code" + i + "'>" + lstRequest.Cycle_Code + "</td>");
                        sb.Append("<td id='Cycle_Name" + i + "'>" + lstRequest.Cycle_Name + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstRequest.Record_Status + "</td></tr>");
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
                dicContext.Add("Filter:CompanyCode", companycode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Method is Used todownload RequestMaster Into Excel
        /// </summary>
        public void PutRequestMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<RequestMasterModel> lstRequestmastermodel = (List<RequestMasterModel>)GetRequestMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Request Name</td>");
                sb.Append("<td>Request Entity</td>");
                sb.Append("<td>Request Type</td>");
                sb.Append("<td>Credit Limit</td>");
                sb.Append("<td>Cycle</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstRequestmastermodel != null && lstRequestmastermodel.Count > 0)
                {
                    int i = 0;
                    foreach (var lstRequest in lstRequestmastermodel)
                    {
                        i++;
                        sb.Append("<td id='Request_Name" + i + "'>" + lstRequest.Request_Name + "</td>");
                        sb.Append("<td id='Request_Entity" + i + "'>" + lstRequest.Request_Entity + "</td>");
                        sb.Append("<td id='Request_Type" + i + "'>" + lstRequest.Request_Type + "</td>");
                        sb.Append("<td id='Credit_Limit" + i + "'>" + lstRequest.Credit_Limit + "</td>");
                        sb.Append("<td id='Cycle_Name" + i + "'>" + lstRequest.Cycle_Name + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstRequest.Record_Status + "</td></tr>");
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

                string fileName = "Request_Master" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        /// <summary>
        /// Get DropCycle
        /// </summary>
        /// <returns></returns>
        public JsonResult GetCycles()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                RequestMasterModel objdropcycle = new RequestMasterModel();
                objdropcycle.CM_Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<RequestMasterModel> lstdropdcycles = objMaster.GetDropCycle(objdropcycle);

                var DropCyclelist = (from division in lstdropdcycles.AsEnumerable()
                                     select new RequestMasterModel()
                                     {
                                         Cycle_Name = division.Cycle_Name.ToString(),
                                         Cycle_Code = division.Cycle_Code.ToString()
                                     }).ToList<RequestMasterModel>();
                return Json(DropCyclelist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Change Status
        /// </summary>
        /// <param name="status"></param>
        /// <param name="requestCode"></param>
        /// <returns></returns>
        public bool ChangestatusforRequestMaster(string status, string requestCode)
        {
            string requestStatus = string.Empty;
            bool changeResult = false;
            try
            {
                requestStatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforRequestMaster(requestStatus, requestCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:requestCode", requestCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }

        //Insert and Update the RequestMaster
        public int InsertandUpdateforRequestMaster(string requestName, string requestCodeval, string requestEntity, string requestType, string creditLimit, string cycleCode, string Mode)
        {
            int result = 0;
            BLMaster Master = new BLMaster();
            List<RequestMasterModel> lstRequestMaster = new List<RequestMasterModel>();
            try
            {
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    RequestMasterModel objrequestMaster = new RequestMasterModel();
                    objrequestMaster.CM_Company_Code = _objcurrentInfo.GetCompanyCode();
                    objrequestMaster.Request_Name = requestName;
                    objrequestMaster.Request_Entity = requestEntity;
                    objrequestMaster.Request_Type = requestType;
                    if (!string.IsNullOrEmpty(creditLimit))
                    {
                        objrequestMaster.Credit_Limit = creditLimit;
                    }
                    objrequestMaster.Cycle_Code = cycleCode;
                    objrequestMaster.Record_Status = "1";
                    objrequestMaster.Created_By = _objcurrentInfo.GetUserName();
                    objrequestMaster.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstRequestMaster.Add(objrequestMaster);
                    result = Master.InsertforRequestMaster(lstRequestMaster);
                    return result;
                }
                else
                {
                    RequestMasterModel objrequestMaster = new RequestMasterModel();
                    objrequestMaster.CM_Company_Code = _objcurrentInfo.GetCompanyCode();
                    objrequestMaster.Request_Name = requestName;
                    objrequestMaster.Request_Entity = requestEntity;
                    objrequestMaster.Request_Type = requestType;
                    if (!string.IsNullOrEmpty(creditLimit))
                    {
                        objrequestMaster.Credit_Limit = creditLimit;
                    }
                    objrequestMaster.Cycle_Code = cycleCode; ;
                    objrequestMaster.Request_Code = requestCodeval;
                    objrequestMaster.Updated_By = _objcurrentInfo.GetUserName();
                    objrequestMaster.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstRequestMaster.Add(objrequestMaster);
                    result = Master.UpdateforRequestMaster(lstRequestMaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:requestName", requestName);
                dicContext.Add("Filter:requestCodeval", requestCodeval);
                dicContext.Add("Filter:requestEntity", requestEntity);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:requestType", requestType);
                dicContext.Add("Filter:creditLimit", creditLimit);
                dicContext.Add("Filter:cycleCode", cycleCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }

        #endregion "Request Master Public Methods"

        #region Request Screen - Dcr Restrict
        public ActionResult DcrRequestScreen()
        {
            return View();
        }

        public JsonResult GetRequestCategoryNames()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            BLMaster _objMaster = new BLMaster();
            List<DCRRestrictionModel> lstrequestCategoryNames = new List<DCRRestrictionModel>();
            lstrequestCategoryNames = _objMaster.GetRequestCategoryName(_objcurrentInfo.GetCompanyCode()).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstrequestCategoryNames));
        }

        public string GetDCRRequestMaser()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            try
            {
                List<DCRRestrictionModel> lstDCRRequestMaster = new List<DCRRestrictionModel>();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                lstDCRRequestMaster = objMaster.GetRequestScreenforDcrRestrict(companycode, userCode).ToList();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Action</td>");
                sb.Append("<td>Region Category</td>");
                sb.Append("<td>Period</td>");
                sb.Append("<td>Admin Remarks</td>");
                sb.Append("<td>User Remarks</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstDCRRequestMaster != null && lstDCRRequestMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstRequest in lstDCRRequestMaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a href='#' id='request_Id_" + lstRequest.Request_Id + "' onclick='fnEditDCRRequest(\"" + lstRequest.Request_Id + "|" + lstRequest.Request_Category_Id + "\");'>Edit</a></td>");

                        sb.Append("<td style='display:none' id='Request_Id" + lstRequest.Request_Id + "'>" + lstRequest.Request_Id + "</td>");

                        sb.Append("<td id='Request_Category_Name_" + lstRequest.Request_Id + "'>");
                        sb.Append(lstRequest.Request_Category_Name);
                        sb.Append("</td>");

                        sb.Append("<td id='Request_period_" + lstRequest.Request_Id + "'>");
                        sb.Append(lstRequest.Date_From);
                        sb.Append(" to ");
                        sb.Append(lstRequest.Date_To);
                        sb.Append("</td>");

                        sb.Append("<td style='display:none' id='Date_From_" + lstRequest.Request_Id + "'>" + lstRequest.Date_From + "</td>");
                        sb.Append("<td style='display:none' id='Date_To_" + lstRequest.Request_Id + "'>" + lstRequest.Date_To + "</td>");

                        sb.Append("<td style='display:none' id='User_Remarks_" + lstRequest.Request_Id + "'>" + lstRequest.Requesting_User_Remarks + "</td>");
                        sb.Append("<td class='td-a'><a href='#' id='Remarks_" + lstRequest.Admin_Remarks + "' onclick='fnEditRemarkforadmin(\"" + lstRequest.Request_Id + "|" + lstRequest.Admin_Remarks + "\");'>Remarks</a></td>");
                        sb.Append("<td class='td-a'><a href='#' id='Remarks_" + lstRequest.Requesting_User_Remarks + "' onclick='fnEditRemarkforuser(\"" + lstRequest.Request_Id + "|" + lstRequest.Requesting_User_Remarks + "\");'>Remarks</a></td>");

                        sb.Append("<td id='Record_Status_" + lstRequest.Request_Id + "'>" + lstRequest.Request_Status + "</td></tr>");
                    }
                }
                else
                {
                    sb.Append("No Records TO Display.");
                }
                sb.Append("</body>");
                sb.Append("</table>");
                return sb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CompanyCode", companycode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public void PutDCRRequestScreenintoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string error = string.Empty;
            try
            {
                List<DCRRestrictionModel> lstDCRRequestMaster = new List<DCRRestrictionModel>();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                lstDCRRequestMaster = objMaster.GetRequestScreenforDcrRestrict(companycode, userCode).ToList();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Region Category</td>");
                sb.Append("<td>Period</td>");
                sb.Append("<td>Admin Remarks</td>");
                sb.Append("<td>User Remarks</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstDCRRequestMaster != null && lstDCRRequestMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstRequest in lstDCRRequestMaster)
                    {
                        i++;
                        sb.Append("<td id='Request_Category_Name_" + lstRequest.Request_Id + "'>");
                        sb.Append(lstRequest.Request_Category_Name);
                        sb.Append("</td>");

                        sb.Append("<td id='Request_period_" + lstRequest.Request_Id + "'>");
                        sb.Append(lstRequest.Date_From);
                        sb.Append(" to ");
                        sb.Append(lstRequest.Date_To);
                        sb.Append("</td>");
                        sb.Append("<td>" + lstRequest.Admin_Remarks + "</td>");
                        sb.Append("<td>" + lstRequest.Requesting_User_Remarks + "</td>");

                        sb.Append("<td id='Record_Status_" + lstRequest.Request_Id + "'>" + lstRequest.Request_Status + "</td></tr>");
                    }
                }
                else
                {
                    sb.Append("No Records TO Display.");
                }
                sb.Append("</body>");
                sb.Append("</table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "DCR_Request_Screen" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        public string checkWAUser()
        {
            StringBuilder strContent = new StringBuilder();
            int chkCount = 0;
            try
            {
                BLMaster objMaster = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();
                string userName = _objcurrentInfo.GetUserName();
                chkCount = objMaster.checkWAUser(companyCode, userCode);
                if (chkCount == 0)
                {
                    strContent.Append(userName + " Can't make a request,Since you are not a valid Wide Angle user,you are not allowed to make this request");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            string result = strContent.ToString();
            if (string.IsNullOrEmpty(result))
            {
                result = "SUCCESS";
            }
            return result;
        }

        public string InsertandUpdatetheDCRRequestScreen(string editRequestId, string requestcategoryId, string reguestCategoryName, string fromDate, string toDate, string mode, string remarks)
        {
            string result = string.Empty;
            int rowsAffected = 0;
            long requestId = 0;
            List<DCRRestrictionModel> lstDCRRequest = new List<DCRRestrictionModel>();
            BLMaster _objMaster = new BLMaster();
            try
            {
                DALCampaignPlanner Objcampaign = new DALCampaignPlanner();
                requestId = Objcampaign.GetSeqNumber("SEQ_tbl_SFA_DCR_Restriction");
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();
                string regionCode = _objcurrentInfo.GetRegionCode();
                string requestedDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                if (mode.ToUpper() == "I")
                {
                    DCRRestrictionModel objDCRRequest = new DCRRestrictionModel();
                    objDCRRequest.Request_Id = requestId.ToString();
                    objDCRRequest.Company_Code = companyCode;
                    objDCRRequest.User_Code = userCode;
                    objDCRRequest.Region_Code = regionCode;
                    objDCRRequest.Request_Category_Id = requestcategoryId;
                    objDCRRequest.Request_Category_Name = reguestCategoryName;
                    objDCRRequest.Date_From = fromDate;
                    objDCRRequest.Date_To = toDate;
                    objDCRRequest.Request_Status = "1";
                    lstDCRRequest.Add(objDCRRequest);
                    rowsAffected = _objMaster.InsertforDCRRequestScreen(lstDCRRequest, requestId.ToString(), remarks, requestedDate);
                }
                else
                {
                    DCRRestrictionModel objDCRRequest = new DCRRestrictionModel();
                    objDCRRequest.Request_Id = editRequestId;
                    objDCRRequest.Company_Code = companyCode;
                    objDCRRequest.User_Code = userCode;
                    objDCRRequest.Region_Code = regionCode;
                    objDCRRequest.Request_Category_Id = requestcategoryId;
                    objDCRRequest.Request_Category_Name = reguestCategoryName;
                    objDCRRequest.Date_From = fromDate;
                    objDCRRequest.Date_To = toDate;
                    objDCRRequest.Request_Status = "1";
                    lstDCRRequest.Add(objDCRRequest);
                    rowsAffected = _objMaster.UpdateforDCRRequestScreen(lstDCRRequest, editRequestId, remarks, requestedDate);
                }
                if (rowsAffected > 0)
                {
                    result = "SUCCESS: Saved Successfully.";
                }
                else
                {
                    result = "ERROR:Error while Inserrting.";
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:editRequestId", editRequestId);
                dicContext.Add("Filter:requestcategoryId", requestcategoryId);
                dicContext.Add("Filter:reguestCategoryName", reguestCategoryName);
                dicContext.Add("Filter:mode", mode);
                dicContext.Add("Filter:fromDate", fromDate);
                dicContext.Add("Filter:toDate", toDate);
                dicContext.Add("Filter:remarks", remarks);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        #endregion Request Screen - Dcr Restrict



        //REQUEST CATEGORY MASTER-SRI//
        public int InsertRequestCategory(string requestCategoryName, string status)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                int result = _objMapping.InsertRequestCategory(companyCode, requestCategoryName, status);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:RequestCategoryName", requestCategoryName);
                dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public string GetRequestCategoryDetail()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<RequestCategoryMasterModel> lstRequestMap = new List<RequestCategoryMasterModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstRequestMap = (List<RequestCategoryMasterModel>)_objMapping.GetRequestCategoryDetail(companyCode);
                if (lstRequestMap != null && lstRequestMap.Count > 0)
                {
                    sbTableContent.Append("<table id='tblrequest' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>Request Category Name</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstRequestMap)
                    {
                        sbTableContent.Append("<tr><td><a href='#' onclick ='fnEdit(\"" + item.Request_Category_Id.ToString() + "_" + item.Request_Category_Name.ToString() + "_" + item.Request_Category_Status.ToString() + "\");'>Edit</a></td>");
                        sbTableContent.Append("<td>" + item.Request_Category_Name + "</td>");
                        sbTableContent.Append("<td>" + item.Request_Category_Status + "</td>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstRequestMap);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public int UpdateRequestCategory(string requestCategoryName, string status, string requestID)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                int result = _objMapping.UpdateRequestCategory(companyCode, requestID, requestCategoryName, status);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:requestCode", status);
                dicContext.Add("Filter:userTypeCode", requestID);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }


        //For excell
        public void PutRequestCategoryMasterIntoExcel()
        {
            string blobUrl = string.Empty;
            string error = string.Empty;
            StringBuilder sbTableContent = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            StringBuilder sb = new StringBuilder();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            try
            {

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<RequestCategoryMasterModel> lstRequestMap = new List<RequestCategoryMasterModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();

                lstRequestMap = (List<RequestCategoryMasterModel>)_objMapping.GetRequestCategoryDetail(companyCode);
                if (lstRequestMap != null && lstRequestMap.Count > 0)
                {
                    sbTableContent.Append("<table id='tblrequest' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");

                    sbTableContent.Append("<td>Request Category Name</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    foreach (var item in lstRequestMap)
                    {

                        sbTableContent.Append("<tr><td>" + item.Request_Category_Name + "</td>");
                        sbTableContent.Append("<td>" + item.Request_Category_Status + "</td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");


                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objCurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "RequestCategoryMaster " + " - " + subdomainName + " - " + userName + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>(); ;
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

            }


        }

    }
}
