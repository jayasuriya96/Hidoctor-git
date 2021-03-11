using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;
using System.Data;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class FeatureMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        // GET: /FeatureMaster/

        #region "FeatureMaster Public Methods"

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Method is Used to get the Feature Details
        /// </summary>
        /// <returns></returns>
        private IEnumerable<FeatureMasterModel> GetFeatureMasterDetails()
        {
            try
            {
                FeatureMasterModel objFeaturemastermodel = new FeatureMasterModel();
                objFeaturemastermodel.Company_Code = _objcurrentInfo.GetCompanyCode();

                BLMaster objMaster = new BLMaster();
                return objMaster.GetFeatureMasterDetails(objFeaturemastermodel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Method is used to bind the data with Html Table
        /// </summary>
        /// <returns></returns>
        public string GetFeatureMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<FeatureMasterModel> lstfeaturemaster = (List<FeatureMasterModel>)GetFeatureMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Select</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Feature Type</td>");
                sb.Append("<td>Description</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstfeaturemaster != null && lstfeaturemaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstfeature in lstfeaturemaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Feature_Code" + i + "'>" + lstfeature.Feature_Code + "</td>");
                        sb.Append("<td id='Feature_Name" + i + "'>" + lstfeature.Feature_Name + "</td>");
                        sb.Append("<td id='Description" + i + "'>" + lstfeature.Description + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + lstfeature.Effective_From + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstfeature.Record_Status + "</td></tr>");
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
        /// DownLoad The FeatureMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutFeatureMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<FeatureMasterModel> lstfeaturemaster = (List<FeatureMasterModel>)GetFeatureMasterDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Select</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Feature Type</td>");
                sb.Append("<td>Description</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstfeaturemaster != null && lstfeaturemaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstfeature in lstfeaturemaster)
                    {
                        i++;
                        sb.Append("<tr><td><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Feature_Code" + i + "'>" + lstfeature.Feature_Code + "</td>");
                        sb.Append("<td id='Feature_Name" + i + "'>" + lstfeature.Feature_Name + "</td>");
                        sb.Append("<td id='Description" + i + "'>" + lstfeature.Description + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + lstfeature.Effective_From + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstfeature.Record_Status + "</td></tr>");
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

                string fileName = "FeatureMaster" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Change Status
        /// </summary>
        /// <param name="status"></param>
        /// <param name="featureCode"></param>
        /// <returns></returns>
        public bool ChangestatusforFeatureMaster(string status, string featureCode)
        {
            string Featurestatus = string.Empty;
            bool changeResult = false;
            try
            {
                Featurestatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforFeatureMaster(Featurestatus, featureCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:featureCode", featureCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="featureName"></param>
        /// <param name="effectiveFrom"></param>
        /// <param name="featureCodeval"></param>
        /// <param name="description"></param>
        /// <param name="Mode"></param>
        /// <returns></returns>
        public int InsertandUpdateFeatureMaster(string featureName,string effectiveFrom,string featureCodeval,string description,string Mode)
        {
            BLMaster Master = new BLMaster();
            FeatureMasterModel objfeaturemasterModel = new FeatureMasterModel();
            List<FeatureMasterModel> lstfeaturemaster = new List<FeatureMasterModel>();
            try
            {
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    if (string.IsNullOrEmpty(description))
                    {
                        description = "";
                    }
                    objfeaturemasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objfeaturemasterModel.Feature_Name = featureName;
                    objfeaturemasterModel.Effective_From = effectiveFrom;
                    objfeaturemasterModel.Description = description;
                    objfeaturemasterModel.Record_Status = "1";
                    objfeaturemasterModel.Is_Active = "1";
                    objfeaturemasterModel.Created_By = _objcurrentInfo.GetUserName();
                    objfeaturemasterModel.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstfeaturemaster.Add(objfeaturemasterModel);
                    int result = Master.InsertforFeatureMaster(lstfeaturemaster);
                    return result;
                }
                else
                {
                    if (string.IsNullOrEmpty(description))
                    {
                        description = "";
                    }
                    objfeaturemasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objfeaturemasterModel.Feature_Code = featureCodeval;
                    objfeaturemasterModel.Feature_Name = featureName;
                    objfeaturemasterModel.Effective_From = effectiveFrom;
                    objfeaturemasterModel.Description = description;
                    objfeaturemasterModel.Updated_By = _objcurrentInfo.GetUserName();
                    objfeaturemasterModel.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstfeaturemaster.Add(objfeaturemasterModel);
                    int result = Master.UpdateforFeatureMaster(lstfeaturemaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:featureName", featureName);
                dicContext.Add("Filter:effectiveFrom", effectiveFrom);
                dicContext.Add("Filter:featureCodeval", featureCodeval);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:description", description);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }
        #endregion "Feature Master Public Methods"
    }
}

