using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
using System.Text;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class CycleMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();


        #region "Cycle Master Public Methods"
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Method is Used to Get CycleMaster Details
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        private IEnumerable<CycleMasterModel> GetcycleMasterDetails(string regionCode)
        {
            try
            {
                CycleMasterModel objCycleMaster = new CycleMasterModel();
                objCycleMaster.Company_Code = _objcurrentInfo.GetCompanyCode();
                objCycleMaster.Region_Code = regionCode;

                BLMaster objMaster = new BLMaster();
                return objMaster.GetCycleMasterDetails(objCycleMaster);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        ///  Method to bind the data with HtmlCycleMaster Table
        /// </summary>
        /// <returns></returns>
        public string GetCycleMaster()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string strRegionCode = string.Empty;
            try
            {
                List<CycleMasterModel> lstCycleMaster = (List<CycleMasterModel>)GetcycleMasterDetails(regionCode);
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Cycle Name</td>");
                sb.Append("<td>Region Name</td>");
                sb.Append("<td>Description</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstCycleMaster != null && lstCycleMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstcycle in lstCycleMaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td style='display:none' id='Cycle_Code" + i + "'>" + lstcycle.Cycle_Code + "</td>");
                        sb.Append("<td id='Cycle_Name" + i + "'>" + lstcycle.Cycle_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Code" + i + "'>" + lstcycle.Region_Code + "</td>");
                        sb.Append("<td id='Region_Name" + i + "'>" + lstcycle.Region_Name + "</td>");
                        sb.Append("<td style='display:none' id='Start_Date" + i + "'>" + lstcycle.Start_Date + "</td>");
                        sb.Append("<td style='display:none' id='End_Date" + i + "'>" + lstcycle.End_Date + "</td>");
                        sb.Append("<td id='Long_Description" + i + "'>" + lstcycle.Long_Description + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstcycle.Record_Status + "</td></tr>");
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
                dicContext.Add("Filter:regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Method is Used to Download the CycleMaster into Excel
        /// </summary>
        /// <returns></returns>
        public void PutCycleMasterIntoExcel()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string strRegionCode = string.Empty;
            string error = string.Empty;
            try
            {
                List<CycleMasterModel> lstCycleMaster = (List<CycleMasterModel>)GetcycleMasterDetails(regionCode);
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Cycle Name</td>");
                sb.Append("<td>Region Name</td>");
                sb.Append("<td>Description</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstCycleMaster != null && lstCycleMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstcycle in lstCycleMaster)
                    {
                        i++;
                        sb.Append("<td id='Cycle_Name" + i + "' style='text-align:left;'>" + lstcycle.Cycle_Name + "</td>");
                        sb.Append("<td id='Region_Name" + i + "' style='text-align:left;'>" + lstcycle.Region_Name + "</td>");
                        sb.Append("<td id='Long_Description" + i + "' style='text-align:left;'>" + lstcycle.Long_Description + "</td>");
                        sb.Append("<td id='Record_Status" + i + "' style='text-align:left;'>" + lstcycle.Record_Status + "</td></tr>");
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

                string fileName = "CycleMaster" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        public string GetCycleDetailsforNodeClick(string regioncodeVal)
        {
            string strRegionCode = string.Empty;
            try
            {
                List<CycleMasterModel> lstCycleMaster = (List<CycleMasterModel>)GetcycleMasterDetails(regioncodeVal);
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='60%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Cycle Name</td>");
                sb.Append("<td>Region Name</td>");
                sb.Append("<td>Description</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstCycleMaster != null && lstCycleMaster.Count > 0)
                {
                    int i = 0;
                    foreach (var lstcycle in lstCycleMaster)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td style='display:none' id='Cycle_Code" + i + "'>" + lstcycle.Cycle_Code + "</td>");
                        sb.Append("<td id='Cycle_Name" + i + "'>" + lstcycle.Cycle_Name + "</td>");
                        sb.Append("<td style='display:none' id='Region_Code" + i + "'>" + lstcycle.Region_Code + "</td>");
                        sb.Append("<td id='Region_Name" + i + "'>" + lstcycle.Region_Name + "</td>");
                        sb.Append("<td style='display:none' id='Start_Date" + i + "'>" + lstcycle.Start_Date + "</td>");
                        sb.Append("<td style='display:none' id='End_Date" + i + "'>" + lstcycle.End_Date + "</td>");
                        sb.Append("<td id='Long_Description" + i + "'>" + lstcycle.Long_Description + "</td>");
                        sb.Append("<td id='Record_Status" + i + "'>" + lstcycle.Record_Status + "</td></tr>");
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
                dicContext.Add("Filter:regionCode", regioncodeVal);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="cycleName"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="description"></param>
        /// <param name="Mode"></param>
        /// <param name="cycleCodeVal"></param>
        /// <param name="regioncodeVal"></param>
        /// <param name="isApproved"></param>
        /// <returns></returns>
        public int InsertandUpdateforCycleMaster(string cycleName, string startDate, string endDate, string description, string Mode,
                                                 string regioncodeVal, string isApproved, string cycleCodeEdit)
        {
            try
            {         
                BLMaster Master = new BLMaster();

                List<CycleMasterModel> lstcycleMaster = new List<CycleMasterModel>();
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    if (string.IsNullOrEmpty(description))
                    {
                        description = "";
                    }
                    string[] regionArr = regioncodeVal.Split('^');
                    foreach (string regionCode in regionArr)
                    {
                        if (!string.IsNullOrEmpty(regionCode))
                        {
                            CycleMasterModel objcyclemasterModel = new CycleMasterModel();
                            objcyclemasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                            objcyclemasterModel.Cycle_Name = cycleName;
                            objcyclemasterModel.Region_Code = regionCode;
                            objcyclemasterModel.Start_Date = startDate;
                            objcyclemasterModel.End_Date = endDate;
                            objcyclemasterModel.Long_Description = description;
                            objcyclemasterModel.Record_Status = isApproved;
                            objcyclemasterModel.Created_By = _objcurrentInfo.GetUserName();
                            objcyclemasterModel.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            lstcycleMaster.Add(objcyclemasterModel);
                        }
                    }

                    int result = Master.InsertforCycleMaster(lstcycleMaster);
                    return result;
                }
                else
                {
                    CycleMasterModel objcyclemasterModel = null;
                    string[] regionArr = regioncodeVal.Split('^');
                    if (string.IsNullOrEmpty(description))
                    {
                        description = "";
                    }
                    foreach (string regionCode in regionArr)
                    {
                        if (!string.IsNullOrEmpty(regionCode))
                        {
                            objcyclemasterModel = new CycleMasterModel();
                            objcyclemasterModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                            objcyclemasterModel.Cycle_Code = cycleCodeEdit;
                            objcyclemasterModel.Region_Code = regionCode;
                            objcyclemasterModel.Cycle_Name = cycleName;
                            objcyclemasterModel.Start_Date = startDate;
                            objcyclemasterModel.End_Date = endDate;
                            objcyclemasterModel.Long_Description = description;
                            objcyclemasterModel.Record_Status = isApproved;
                            objcyclemasterModel.Updated_By = _objcurrentInfo.GetUserName();
                            objcyclemasterModel.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            lstcycleMaster.Add(objcyclemasterModel);
                        }
                    }
                    int result = Master.UpdateforCycleMaster(lstcycleMaster);
                    return result;

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:cycleName", cycleName);
                dicContext.Add("Filter:startDate", startDate);
                dicContext.Add("Filter:endDate", endDate);
                dicContext.Add("Filter:Mode", Mode); 
                dicContext.Add("Filter:description", description);
                dicContext.Add("Filter:regioncodeVal", regioncodeVal);
                dicContext.Add("Filter:isApproved", isApproved);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }

        #endregion "Cycle Master Public Methods"
    }
}
