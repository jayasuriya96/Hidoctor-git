using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Data;
using System.Text;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class DomainMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "Domain Master Public Methods"

        public ActionResult Create()
        {
            return View();
        }
        /// <summary>
        /// Method is Used to Get DomainMaster Details
        /// </summary>
        /// <returns></returns>
        private IEnumerable<DomainMasterModel> GetDomainMasterDetails()
        {
            try
            {
                DomainMasterModel objDomainmastermodel = new DomainMasterModel();
                objDomainmastermodel.Company_Code = _objcurrentInfo.GetCompanyCode();
                BLMaster objMaster = new BLMaster();
                return objMaster.GetDomainMasterDetails(objDomainmastermodel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }

        }

        /// <summary>
        /// Method to bind the data with HtmDomaiMaster Table
        /// </summary>
        /// <returns></returns>
        public string GetDomainMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<DomainMasterModel> lstdomainmaster = (List<DomainMasterModel>)GetDomainMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Domain</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstdomainmaster != null && lstdomainmaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstdomain in lstdomainmaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Domain_Code" + i + "'>" + lstdomain.Domain_Code + "</td>");
                        sb.Append("<td id='Domain_Name" + i + "'>" + lstdomain.Domain_Name + "</td>");
                        sb.Append("<td id='Start_Date" + i + "'>" + lstdomain.Start_Date + "</td>");
                        sb.Append("<td id='End_Date" + i + "'>" + lstdomain.End_Date + "</td>");
                        sb.Append("<td id='Status" + i + "'>" + lstdomain.Status + "</td></tr>");
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
        /// DownLoad The DomainMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutDomainMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<DomainMasterModel> lstdomainmaster = (List<DomainMasterModel>)GetDomainMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Domain</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstdomainmaster != null && lstdomainmaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstdomain in lstdomainmaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Domain_Code" + i + "'>" + lstdomain.Domain_Code + "</td>");
                        sb.Append("<td id='Domain_Name" + i + "'>" + lstdomain.Domain_Name + "</td>");
                        sb.Append("<td id='Start_Date" + i + "'>" + lstdomain.Start_Date + "</td>");
                        sb.Append("<td id='End_Date" + i + "'>" + lstdomain.End_Date + "</td>");
                        sb.Append("<td id='Status" + i + "'>" + lstdomain.Status + "</td></tr>");
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

                string fileName = "DomainMaster" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Change Status DomainMaster
        /// </summary>
        /// <param name="status"></param>
        /// <param name="domainCode"></param>
        /// <returns></returns>
        public bool ChangestatusforDomainMaster(string status, string domainCode)
        {
            string Domainstatus = string.Empty;
             bool changeResult = false;
            try
            {
                Domainstatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforDomainMaster(Domainstatus, domainCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:domainCode", domainCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }

        /// <summary>
        /// Insert and Update the DomainMaster
        /// </summary>
        /// <param name="domainName"></param>
        /// <param name="domainCodeval"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="status"></param>
        /// <param name="Mode"></param>
        /// <returns></returns>
        public int InsertandUpdateforDomainMaster(string domainName, string domainCodeval, string startDate, string endDate,
                                                  string status, string Mode)
        {
            try
            {
                BLMaster Master = new BLMaster();
                DomainMasterModel objdominamasterModer = new DomainMasterModel();
                List<DomainMasterModel> lstdomainmaster = new List<DomainMasterModel>();
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    objdominamasterModer.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objdominamasterModer.Domain_Name = domainName;
                    objdominamasterModer.Start_Date = startDate;
                    objdominamasterModer.End_Date = endDate;
                    objdominamasterModer.Status = "1";
                    objdominamasterModer.Created_By = _objcurrentInfo.GetUserName();
                    objdominamasterModer.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstdomainmaster.Add(objdominamasterModer);
                    int result = Master.InsertforDomainMaster(lstdomainmaster);
                    return result;
                }
                else
                {
                    objdominamasterModer.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objdominamasterModer.Domain_Code = domainCodeval;
                    objdominamasterModer.Domain_Name = domainName;
                    objdominamasterModer.Start_Date = startDate;
                    objdominamasterModer.End_Date = endDate;
                    objdominamasterModer.Updated_By = _objcurrentInfo.GetUserName();
                    objdominamasterModer.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstdomainmaster.Add(objdominamasterModer);
                    int result = Master.UpdateforDomainMaster(lstdomainmaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:domainName", domainName);
                dicContext.Add("Filter:startDate", startDate);
                dicContext.Add("Filter:endDate", endDate);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:domainCodeval", domainCodeval);
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:Mode", Mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }

        #endregion "Domain Master Public Methods"


    }
}
