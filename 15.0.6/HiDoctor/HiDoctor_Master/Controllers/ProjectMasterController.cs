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
    public class ProjectMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "ProjectMaster Public Methods"

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Method is Used to Get the Project Master Details
        /// </summary>
        /// <returns></returns>
        private IEnumerable<ProjectMasterModel> GetProjectDetails()
        {
            try
            {
                ProjectMasterModel objprojectmastermodel = new ProjectMasterModel();
                objprojectmastermodel.Company_Code = _objcurrentInfo.GetCompanyCode();

                BLMaster objMaster = new BLMaster();
                return objMaster.GetProjectDetails(objprojectmastermodel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Method is Used to bind the data with ProjectMaserHtml table
        /// </summary>
        /// <returns></returns>
        public string GetProjectMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                List<ProjectMasterModel> lstprojectmastermodel = (List<ProjectMasterModel>)GetProjectDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Project</td>");
                sb.Append("<td>Project Lead</td>");
                sb.Append("<td>Client</td>");
                sb.Append("<td>Domain</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Remarks</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstprojectmastermodel != null && lstprojectmastermodel.Count > 0)
                {
                    int i = 0;
                    foreach(var lstproject in lstprojectmastermodel)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Project_Code" + i + "' style='text-align:left;'>" + lstproject.Project_Code + "</td>");
                        sb.Append("<td id='Project_Name" + i + "'>" + lstproject.Project_Name + "</td>");
                        sb.Append("<td style='display:none' id='Project_Lead_Code" + i + "'>" + lstproject.Project_Lead_Code + "</td>");
                        sb.Append("<td id='Project_Lead_Name" + i + "'>" + lstproject.Project_Lead_Name + "</td>");
                        sb.Append("<td style='display:none' id='Company_Code" + i + "'>" + lstproject.Company_Code + "</td>");
                        sb.Append("<td id='Company_Name" + i + "'>" + lstproject.Company_Name + "</td>");
                        sb.Append("<td style='display:none' id='Domain_Code" + i + "'>" + lstproject.Domain_Code + "</td>");
                        sb.Append("<td id='Domain_Name" + i + "'>" + lstproject.Domain_Name + "</td>");
                        sb.Append("<td id='Start_Date" + i + "'>" + lstproject.Start_Date + "</td>");
                        sb.Append("<td id='End_Date" + i + "'>" + lstproject.End_Date + "</td>");
                        sb.Append("<td id='Remarks" + i + "'>" + lstproject.Remarks + "</td>");
                        sb.Append("<td id='Status" + i + "'>" + lstproject.Status + "</td></tr>");
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
        ///  DownLoad The ProjectMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutProjectMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                List<ProjectMasterModel> lstprojectmastermodel = (List<ProjectMasterModel>)GetProjectDetails();
                StringBuilder sb = new StringBuilder();
                BLMaster objMaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Project</td>");
                sb.Append("<td>Project Lead</td>");
                sb.Append("<td>Client</td>");
                sb.Append("<td>Domain</td>");
                sb.Append("<td>Start Date</td>");
                sb.Append("<td>End Date</td>");
                sb.Append("<td>Remarks</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (lstprojectmastermodel != null && lstprojectmastermodel.Count > 0)
                {
                    int i = 0;
                    foreach (var lstproject in lstprojectmastermodel)
                    {
                        i++;
                        sb.Append("<td id='Project_Name" + i + "' style='text-align:left;'>" + lstproject.Project_Name + "</td>");                        
                        sb.Append("<td id='Project_Lead_Name" + i + "'>" + lstproject.Project_Lead_Name + "</td>");                       
                        sb.Append("<td id='Company_Name" + i + "'>" + lstproject.Company_Name + "</td>");                        
                        sb.Append("<td id='Domain_Name" + i + "'>" + lstproject.Domain_Name + "</td>");
                        sb.Append("<td id='Start_Date" + i + "'>" + lstproject.Start_Date + "</td>");
                        sb.Append("<td id='End_Date" + i + "'>" + lstproject.End_Date + "</td>");
                        sb.Append("<td id='Remarks" + i + "'>" + lstproject.Remarks + "</td>");
                        sb.Append("<td id='Status" + i + "'>" + lstproject.Status + "</td></tr>");
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

                string fileName = "ProjectMaster" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Used to get the Drop projectlead List
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectLead()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProjectLead objprojectlead = new ProjectLead();
                objprojectlead.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<ProjectLead> lstprojectLead = objMaster.GetProjectLead(objprojectlead);

                var DivisionList = (from division in lstprojectLead.AsEnumerable()
                                    select new ProjectLead()
                                    {
                                        User_Name = division.User_Name.ToString(),
                                        User_Code = division.User_Code.ToString()
                                    }).ToList<ProjectLead>();
                return Json(DivisionList);
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Method is used to get the drop Client List
        /// </summary>
        /// <returns></returns>
        public JsonResult GetClient()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProjectMasterModel objprojectclient = new ProjectMasterModel();
                objprojectclient.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<ProjectMasterModel> lstprojectclient = objMaster.GetClient(objprojectclient);


                var DivisionList = (from division in lstprojectclient.AsEnumerable()
                                    select new ProjectMasterModel()
                                    {
                                        Company_Name = division.Company_Name,
                                        Company_Code = division.Company_Code
                                    }).ToList<ProjectMasterModel>();
                return Json(DivisionList);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Used to get the drop Domain List
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDomain()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                ProjectMasterModel objprojectdomain = new ProjectMasterModel();
                objprojectdomain.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<ProjectMasterModel> lstprojectdomain = objMaster.GetDomain(objprojectdomain);


                var DivisionList = (from division in lstprojectdomain.AsEnumerable()
                                    select new ProjectMasterModel()
                                    {
                                        Domain_Name = division.Domain_Name,
                                        Domain_Code = division.Domain_Code
                                    }).ToList<ProjectMasterModel>();
                return Json(DivisionList);
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
        /// <param name="projectCode"></param>
        /// <returns></returns>
        public bool ChangestatusforProjectMaster(string status, string projectCode)
        {
            string Projectstatus = string.Empty;
            bool changeResult = false;
            try
            {
                Projectstatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangeStatusforProjectMaster(Projectstatus, projectCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:projectCode", projectCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }

            return changeResult;
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="projectName"></param>
        /// <param name="ProjectLeadcode"></param>
        /// <param name="ProjectLeadName"></param>
        /// <param name="client"></param>
        /// <param name="domain"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="remarks"></param>
        /// <param name="Mode"></param>
        /// <param name="projectCodeVal"></param>
        /// <returns></returns>
        public int InsertandUpdateProjectDetails(string projectName, string ProjectLeadcode, string ProjectLeadName, string client, string domain,
                                                 string startDate, string endDate, string remarks, string Mode, string projectCodeVal)
        {
            try
            {     
                BLMaster Master = new BLMaster();
                ProjectMasterModel objprojectmastermodel = new ProjectMasterModel();
                List<ProjectMasterModel> lstprojectmaster = new List<ProjectMasterModel>();
                if (Mode.ToUpper() == "I") // Insert Data
                {
                    if (string.IsNullOrEmpty(remarks))
                    {
                        remarks = "";
                    }
                    objprojectmastermodel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objprojectmastermodel.Project_Name = projectName;
                    objprojectmastermodel.Project_Lead_Code = ProjectLeadcode;
                    objprojectmastermodel.Project_Lead_Name = ProjectLeadName;
                    objprojectmastermodel.Client_Code = client;
                    objprojectmastermodel.Domain_Code = domain;
                    objprojectmastermodel.Start_Date = startDate;
                    objprojectmastermodel.End_Date = endDate;
                    objprojectmastermodel.Status = "1";
                    objprojectmastermodel.Remarks = remarks;
                    objprojectmastermodel.Created_By = _objcurrentInfo.GetUserName();
                    objprojectmastermodel.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstprojectmaster.Add(objprojectmastermodel);
                    int result = Master.InsertforProjectMaster(lstprojectmaster);
                    return result;
                }
                else
                {
                    if (string.IsNullOrEmpty(remarks))
                    {
                        remarks = "";
                    }
                    objprojectmastermodel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objprojectmastermodel.Project_Code = projectCodeVal;
                    objprojectmastermodel.Project_Name = projectName;
                    objprojectmastermodel.Project_Lead_Code = ProjectLeadcode;
                    objprojectmastermodel.Project_Lead_Name = ProjectLeadName;
                    objprojectmastermodel.Client_Code = client;
                    objprojectmastermodel.Domain_Code = domain;
                    objprojectmastermodel.Start_Date = startDate;
                    objprojectmastermodel.End_Date = endDate;
                    objprojectmastermodel.Remarks = remarks;
                    objprojectmastermodel.Updated_By = _objcurrentInfo.GetUserName();
                    objprojectmastermodel.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstprojectmaster.Add(objprojectmastermodel);
                    int result = Master.UpdateforProjectMaster(lstprojectmaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:projectName", projectName);
                dicContext.Add("Filter:startDate", startDate);
                dicContext.Add("Filter:endDate", endDate);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:ProjectLeadcode", ProjectLeadcode);
                dicContext.Add("Filter:ProjectLeadName", ProjectLeadName);
                dicContext.Add("Filter:v", client);
                dicContext.Add("Filter:domain", domain);
                dicContext.Add("Filter:ProjectLeadName", ProjectLeadName);
                dicContext.Add("Filter:client", client);
                dicContext.Add("Filter:remarks", remarks);
                dicContext.Add("Filter:projectCodeVal", projectCodeVal);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }
        #endregion "Project Master Public Methods"

        
    }
}
