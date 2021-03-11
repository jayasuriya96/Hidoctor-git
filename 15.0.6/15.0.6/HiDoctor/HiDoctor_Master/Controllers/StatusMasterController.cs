using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
using MVCModels;
using System.Text;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class StatusMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "StatusMaster Public Methods"

        public ActionResult Create()
        {
            return View();
        }
        public ActionResult StatusCycleMapping()
        {
            return View();
        }

        /// <summary>
        /// Method is Used to Get statusMaster Details
        /// </summary>
        /// <returns></returns>
        private IEnumerable<StatusMasterModel> GetStatusMasterDetails()
        {
            try
            {
                StatusMasterModel objStatusMaster = new StatusMasterModel();
                objStatusMaster.Company_Code = _objcurrentInfo.GetCompanyCode();
                BLMaster objMaster = new BLMaster();
                return objMaster.GetStatusmasterDetails(objStatusMaster);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }

        }

        //Method to bind the data with HtmlStatusMaster Table
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public string GetstatusMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<StatusMasterModel> lstStatusMaster = (List<StatusMasterModel>)GetStatusMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='40%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Status Name</td>");
                sb.Append("<td>Display Name</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstStatusMaster != null && lstStatusMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstStatus in lstStatusMaster)
                    {
                        i++;
                        sb.Append("<tr><td><a href='#' id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td><a href='#' id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Status_Code" + i + "'>" + lstStatus.Status_Code + "</td>");
                        sb.Append("<td id='Status_Name" + i + "'>" + lstStatus.Status_Name + "</td>");
                        sb.Append("<td id='Display_Name" + i + "'>" + lstStatus.Display_Name + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstStatus.Record_Status + "</td></tr>");
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
        /// DownLoad The statusMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutStatusMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<StatusMasterModel> lstStatusMaster = (List<StatusMasterModel>)GetStatusMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                sb.Append("<table WIDTH='40%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");              
                sb.Append("<td>Status Name</td>");
                sb.Append("<td>Display Name</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstStatusMaster != null && lstStatusMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstStatus in lstStatusMaster)
                    {
                        i++; 
                        sb.Append("<td id='Status_Name" + i + "'>" + lstStatus.Status_Name + "</td>");
                        sb.Append("<td id='Display_Name" + i + "'>" + lstStatus.Display_Name + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstStatus.Record_Status + "</td></tr>");
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

                string fileName = "Status Master" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Change Status statusMaster
        /// </summary>
        /// <param name="status"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public bool ChangestatusforStatusMaster(string status, string statusCode)
        {
            string StatusMasterstatus = string.Empty;
            bool changeResult = false;
            try
            {
                StatusMasterstatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforStatusMaster(StatusMasterstatus, statusCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:statusCode", statusCode);
                changeResult = false;
                
            }
            return changeResult;
        }

        /// <summary>
        /// Insert and Update for StatusMaster
        /// </summary>
        /// <param name="statusName"></param>
        /// <param name="statusCodeval"></param>
        /// <param name="status"></param>
        /// <param name="Mode"></param>
        /// <returns></returns>
        public int InsertandUpdateforStatusMaster(string statusName, string statusCodeval,string status, string Mode,string DisplayName)
        {
            try
            {
                BLMaster Master = new BLMaster();
                StatusMasterModel objstatusamasterModel = new StatusMasterModel();
                List<StatusMasterModel> lststatusmaster = new List<StatusMasterModel>();
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    objstatusamasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objstatusamasterModel.Status_Name = statusName;
                    objstatusamasterModel.Display_Name = DisplayName;
                    objstatusamasterModel.Record_Status = "1";
                    objstatusamasterModel.Created_By = _objcurrentInfo.GetUserName();
                    objstatusamasterModel.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lststatusmaster.Add(objstatusamasterModel);
                    int result = Master.InsertforStatusMaster(lststatusmaster);
                    return result;
                }
                else
                {
                    objstatusamasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objstatusamasterModel.Status_Code = statusCodeval;
                    objstatusamasterModel.Status_Name = statusName;
                    objstatusamasterModel.Display_Name = DisplayName;
                    objstatusamasterModel.Updated_By = _objcurrentInfo.GetUserName();
                    objstatusamasterModel.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lststatusmaster.Add(objstatusamasterModel);
                    int result = Master.UpdateforstatusMaster(lststatusmaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:statusName", statusName);
                dicContext.Add("Filter:statusCodeval", statusCodeval);
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:Mode", Mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 1;
            }
        }
        /// <summary>
        /// To Get the Status , Cycle And User Type Binding Details 
        /// </summary>
        /// <returns></returns>
        public JsonResult GetStatusCycleMasterDetails()
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLUser objBLUser = new BLUser();
                BLMaster objBLMaster = new BLMaster();

                StatusMasterModel objStatusMasterModel = new StatusMasterModel();
                objStatusMasterModel.Company_Code = companyCode;

                CycleMasterModel objCycleMasterModel = new CycleMasterModel();
                objCycleMasterModel.Company_Code = companyCode;
                objCycleMasterModel.Region_Code = string.Empty;


                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = objBLUser.GetUserTypes(companyCode);

                IEnumerable<StatusMasterModel> objStatModel = objBLMaster.GetStatusmasterDetails(objStatusMasterModel);

                List<StatusMasterModel> lstStatusModel = objStatModel.AsEnumerable().Where(a => a.Record_Status.ToUpper() == "ENABLED").ToList();

                IEnumerable<CycleMasterModel> objCycleModel = objBLMaster.GetCycleMasterDetails(objCycleMasterModel);

                List<CycleMasterModel> lstCycleModel = objCycleModel.AsEnumerable().Where(a => a.Record_Status.ToUpper() == "APPROVED").ToList();

                List<JsonResult> lstJSON = new List<JsonResult> { Json(lstUserType, JsonRequestBehavior.AllowGet), 
                                        Json(lstStatusModel, JsonRequestBehavior.AllowGet), 
                                        Json(lstCycleModel, JsonRequestBehavior.AllowGet)  };
                return Json(lstJSON);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }
        /// <summary>
        /// To Get the Active Status cycle mapping details
        /// </summary>
        /// <returns></returns>
        public string GetStatusCycleMappingDetails()
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLMaster objBLMaster = new BLMaster();
                IEnumerable<StatusCycleMapping> lstStatCycleMapp = objBLMaster.GetStatusCycleMappingDetails(companyCode);

                StringBuilder tblBuilder = new StringBuilder();

                tblBuilder.Append("<table id='tblStatusCycleMapp' class='table table-striped' cellpadding='0' cellspacing='0'>");
                tblBuilder.Append("<thead><tr><th>Edit</th><th>Change Status</th><th>Status</th><th>Cycle Name</th><th>Status Name</th><th>Description</th><th>Order No</th><th>Status Owner Type</th><th>Move Order</th></tr></thead>");
                tblBuilder.Append("<tbody>");
                int rowNum = 0;
                foreach (StatusCycleMapping objStatCycleMap in lstStatCycleMapp)
                {
                    tblBuilder.Append("<tr>");
                    tblBuilder.Append("<td><a style='cursor:pointer' onclick='fnStatusCycleEdit(" + rowNum + ")'>Edit</a></td>");
                    tblBuilder.Append("<td><a style='cursor:pointer' onclick='fnStatusCycleChangeStatus(" + rowNum + ")'>Change Status</a></td>");
                    tblBuilder.Append("<td id='tdStatus_" + rowNum.ToString() + "'>" + objStatCycleMap.Status + " </td>");
                    tblBuilder.Append("<td>" + objStatCycleMap.Cycle_Name + "<input type='hidden' id='hdnCycleCode_" + rowNum.ToString() + "' value='" + objStatCycleMap.Cycle_Code + "' /></td>");
                    tblBuilder.Append("<td>" + objStatCycleMap.Status_Name + "<input type='hidden' id='hdnStatusCode_" + rowNum.ToString() + "' value='" + objStatCycleMap.Status_Code + "' /></td>");
                    tblBuilder.Append("<td id='tdDescription_" + rowNum.ToString() + "'>" + objStatCycleMap.Long_Description + "</td>");
                    tblBuilder.Append("<td id='tdOrdero_" + rowNum.ToString() + "'>" + objStatCycleMap.Order_No + "</td>");
                    tblBuilder.Append("<td id='tdstatusOwnerType_" + rowNum.ToString() + "'>" + objStatCycleMap.Status_Owner_Type + "</td>");
                    tblBuilder.Append("<td id='tdMoveOrder_" + rowNum.ToString() + "'>" + objStatCycleMap.Move_Order + "</td>");
                    tblBuilder.Append("</tr>");
                    rowNum++;
                }
                tblBuilder.Append("</tbody>");
                tblBuilder.Append("</table>");
                return tblBuilder.ToString();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Insert , Update , Change Status for Status Cycle Mapping
        /// </summary>
        /// <param name="cycleCode"></param>
        /// <param name="cycleName"></param>
        /// <param name="statusCode"></param>
        /// <param name="statusName"></param>
        /// <param name="description"></param>
        /// <param name="statusOwnerType"></param>
        /// <param name="orderNo"></param>
        /// <param name="moveOrder"></param>
        /// <param name="mode"></param>
        /// <param name="oCycleCode"></param>
        /// <param name="oStatusCode"></param>
        /// <param name="recordStatus"></param>
        /// <returns></returns>
        public int InsertStatusCycleMapping(string cycleCode, string cycleName, string statusCode, string statusName, string description, string statusOwnerType, int orderNo, string moveOrder, string mode, string oCycleCode, string oStatusCode, int recordStatus)
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userName = _objcurrentInfo.GetUserName();
                string dateTime = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");

                BLMaster objBlMaster = new BLMaster();
                return objBlMaster.InsertStatusCycleMapping(companyCode, cycleCode, cycleName, statusCode, statusName, description, statusOwnerType, orderNo, moveOrder, mode, oCycleCode, oStatusCode, recordStatus, userName, dateTime, userName, dateTime);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cycleCode", cycleCode);
                dicObj.Add("cycleName", cycleName);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("statusName", statusName);
                dicObj.Add("description", description);
                dicObj.Add("statusOwnerType", statusOwnerType);
                dicObj.Add("orderNo", orderNo.ToString());
                dicObj.Add("moveOrder", moveOrder);
                dicObj.Add("mode", mode);
                dicObj.Add("oCycleCode", oCycleCode);
                dicObj.Add("oStatusCode", oStatusCode);
                dicObj.Add("recordStatus", recordStatus.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return 0;
            }
        }

        #endregion "StatusMaster Public Methods"

    }
}
