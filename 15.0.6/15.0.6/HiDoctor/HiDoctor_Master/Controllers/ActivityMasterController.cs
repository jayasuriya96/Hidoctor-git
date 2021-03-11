using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Threading.Tasks;
using System.Collections;
using System.Text;
using DataControl;
using System.Data;
using HiDoctor_Master.Models;


namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ActivityMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        //
        // GET: /ActivityMaster/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Bind the Data with Html ActivityMaster Table
        /// </summary>
        /// <returns></returns>
        public string GetActivityMaster()
        {
            string data = string.Empty;
            StringBuilder sb = new StringBuilder();
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                BLMaster Master = new BLMaster();
                DataSet dsActivityMaster = new DataSet();
                dsActivityMaster = Master.GetLeaveTypeDetails(companyCode);
                //dsc
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Activity Name</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("<tbody>");
                //
                if (dsActivityMaster != null && dsActivityMaster.Tables[0] != null && dsActivityMaster.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsActivityMaster.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none; text-align:left;' id='Activity_Code" + i + "'>" + dsActivityMaster.Tables[0].Rows[i]["Activity_Code"] + "</td>");
                        sb.Append("<td id='Activity_Name" + i + "' 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Activity_Name"] + "</td>");
                        sb.Append("<td id='Start_Date" + i + "' 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Start_Date"] + "</td>");
                        sb.Append("<td id='End_Date" + i + "' 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["End_Date"] + "</td>");
                        sb.Append("<td id='Row_Status" + i + "' 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Row_Status"] + "</td></tr>");
                    }
                }
                else
                {
                    sb.Append("<tr><td colspan='5'>No records To Display</td></tr>");
                }
                sb.Append("</tbody>");
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
        /// DownLoad The ActivityMasterDetails into Excel
        /// </summary>
        public void PutActivityMasterIntoExcel()
        {
            string error = string.Empty;

            StringBuilder sb = new StringBuilder();
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                BLMaster Master = new BLMaster();
                DataSet dsActivityMaster = new DataSet();
                dsActivityMaster = Master.GetLeaveTypeDetails(companyCode);
                //dsc
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Activity Name</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("<tbody>");
                //
                if (dsActivityMaster != null && dsActivityMaster.Tables[0] != null && dsActivityMaster.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsActivityMaster.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<td id='Activity_Name" + i + "'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Activity_Name"] + "</td>");
                        sb.Append("<td id='Start_Date" + i + " 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Start_Date"] + "</td>");
                        sb.Append("<td id='End_Date" + i + " ' style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["End_Date"] + "</td>");
                        sb.Append("<td id='Row_Status" + i + " 'style='text-align:left;'>" + dsActivityMaster.Tables[0].Rows[i]["Row_Status"] + "</td></tr>");
                    }
                }
                else
                {
                    sb.Append("<tr><td>No records To Display</td></tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "ActivityMaster" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Insert and Update
        /// </summary>
        /// <param name="activityName"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="Mode"></param>
        /// <param name="updateActivityCode"></param>
        /// <returns></returns>
        public int InsertActivityMaster(string activityName, string startDate, string endDate, string Mode, string updateActivityCode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string UpdatedBy = _objcurrentInfo.GetUserCode();
            try
            {
                string data = string.Empty;
                BLMaster Master = new BLMaster();

                if (Mode.ToUpper() == "I") // Insert Data
                {
                    string ActivityCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_Activity_Master", "Activity_Code", "ATY");
                    string status = "1";
                    int InsertActivityMaster = Master.InsertActivityMaster(companyCode, activityName, startDate, endDate, status, ActivityCode, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    return InsertActivityMaster;
                }
                else
                {
                    int UpdateActivityMaster = Master.UpdateActivityMaster(companyCode, activityName, startDate, endDate, updateActivityCode, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    return UpdateActivityMaster;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:activityName", activityName);
                dicContext.Add("Filter:startDate", startDate);
                dicContext.Add("Filter:endDate", endDate);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:updateActivityCode", updateActivityCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }


        /// <summary>
        /// Change Status
        /// </summary>
        /// <param name="status"></param>
        /// <param name="activityCode"></param>
        /// <returns></returns>
        public bool ChangestatusforActivityMaster(string status, string activityCode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string DocStatus = string.Empty;
            bool changeResult = false;
            try
            {
                DocStatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is enabled, 0 is disabled
                BLMaster Master = new BLMaster();
                string CompanyCode = _objcurrentInfo.GetCompanyCode();
                Master.ChangeStatusForActivityMaster(companyCode, activityCode, DocStatus);
                changeResult = true;
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:activityCode", activityCode);
                changeResult = false;
            }
            return changeResult;
        }

    }
}
