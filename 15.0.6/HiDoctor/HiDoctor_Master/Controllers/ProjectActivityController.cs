using DataControl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ProjectActivityController : Controller
    {
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();

        //
        // GET: /ProjectActivity/
        #region default
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /ProjectActivity/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /ProjectActivity/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /ProjectActivity/Create

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
        // GET: /ProjectActivity/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /ProjectActivity/Edit/5

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
        // GET: /ProjectActivity/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /ProjectActivity/Delete/5

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
        #endregion default

        public ActionResult ProjectActivityMapping()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        /// <summary>
        /// Method to Get the Project , Activity Details for prefilling
        /// </summary>
        /// <param name="coll"></param>
        /// <returns></returns>
        /// 
        public JsonResult GetProjectActivityDetails(FormCollection coll)
        {
            try
            {
                DataControl.BLMaster _objBlMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                DataSet dsProjAct = _objBlMaster.GetSalesActivity(_objCurInfo.GetCompanyCode());
                return Json(_objJson.Serialize(dsProjAct));
            }
            catch (Exception ex)
            {
                Dictionary<string,string> dicObj = new Dictionary<string,string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }
        /// <summary>
        /// Method to get the Project - Activity Mapping details for the Grid
        /// </summary>
        /// <param name="coll"></param>
        /// <returns></returns>
        public string GetProjectActivityMappingDetails(FormCollection coll)
        {
            try
            {
                DataControl.BLMaster _objBlMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                StringBuilder tblBuilder = new StringBuilder();
                string companyCode = _objCurInfo.GetCompanyCode();
                int rowNum = 0;
                DataSet dsProjActMapp = _objBlMaster.GetSalesActivityMapping(companyCode);
                if (dsProjActMapp != null && dsProjActMapp.Tables.Count > 0 && dsProjActMapp.Tables[0].Rows.Count > 0)
                {
                    tblBuilder.Append("<table id='tblSFC' class='table table-striped' cellpadding='0' cellspacing='0'>");
                    tblBuilder.Append("<thead><tr><th class='Clstextleft'>Edit</th><th class='Clstextleft'>Change Status</th><th class='Clstextleft'>Project Name</th><th class='Clstextleft'>Activity Name</th><th class='Clstextleft'>Start Date</th><th class='Clstextleft'>End Date</th><th class='Clstextleft'>Status</th></tr></thead>");
                    tblBuilder.Append("<tbody>");

                    foreach (DataRow dr in dsProjActMapp.Tables[0].Rows)
                    {
                        rowNum++;
                        tblBuilder.Append("<tr>");
                        tblBuilder.Append("<td> <a href='#' style='cursor:pointer' onclick='fnEditProjAct(" + rowNum + ")'>Edit</a></td>");
                        tblBuilder.Append("<td> <a href='#' style='cursor:pointer' onclick='fnchangeStatus(" + rowNum + ")'>Change Status</a></td>");

                        tblBuilder.Append("<td>" + dr["Project_Name"].ToString() + "<input type='hidden' id='hdnProjCode_" + rowNum + "' value='" + dr["Project_Code"].ToString() + "' /></td>");
                        tblBuilder.Append("<td>" + dr["Activity_Name"].ToString() + "<input type='hidden' id='hdnActivityCode_" + rowNum + "' value='" + dr["Activity_Code"].ToString() + "' /></td>");
                        tblBuilder.Append("<td id='tdStartDate_" + rowNum + "'>" + dr["StartDate"].ToString() + "</td>");
                        tblBuilder.Append("<td id='tdEndDate_" + rowNum + "'>" + dr["EndDate"].ToString() + "</td>");
                        tblBuilder.Append("<td id='tdStatus_" + rowNum + "'>" + dr["Status"].ToString() + "</td>");
                        
                        tblBuilder.Append("</tr>");
                    }

                    tblBuilder.Append("</tbody>");
                    tblBuilder.Append("</table>");
                }

                return tblBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return ex.Message.ToString();
            }
        }

        public void PutProjectActivityIntoAzure(FormCollection coll)
        {
            try
            {
                string error = string.Empty;
                DataControl.BLMaster _objBlMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                StringBuilder tblBuilder = new StringBuilder();
                string companyCode = _objCurInfo.GetCompanyCode();
                int rowNum = 0;
                DataSet dsProjActMapp = _objBlMaster.GetSalesActivityMapping(companyCode);
                if (dsProjActMapp != null && dsProjActMapp.Tables.Count > 0 && dsProjActMapp.Tables[0].Rows.Count > 0)
                {
                    tblBuilder.Append("<table id='tblSFC' class='table table-striped' cellpadding='0' cellspacing='0'>");
                    tblBuilder.Append("<thead><tr><th>Project Name</th><th>Activity Name</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>");
                    tblBuilder.Append("<tbody>");

                    foreach (DataRow dr in dsProjActMapp.Tables[0].Rows)
                    {
                        rowNum++;
                        tblBuilder.Append("<tr>");
                        tblBuilder.Append("<td>" + dr["Project_Name"].ToString() + "<input type='hidden' id='hdnProjCode_" + rowNum + "' value='" + dr["Project_Code"].ToString() + "' /></td>");
                        tblBuilder.Append("<td>" + dr["Activity_Name"].ToString() + "<input type='hidden' id='hdnActivityCode_" + rowNum + "' value='" + dr["Activity_Code"].ToString() + "' /></td>");
                        tblBuilder.Append("<td id='tdStartDate_" + rowNum + "'>" + dr["StartDate"].ToString() + "</td>");
                        tblBuilder.Append("<td id='tdEndDate_" + rowNum + "'>" + dr["EndDate"].ToString() + "</td>");
                        tblBuilder.Append("<td id='tdStatus_" + rowNum + "'>" + dr["Status"].ToString() + "</td>");
                        tblBuilder.Append("</tr>");
                    }

                    tblBuilder.Append("</tbody>");
                    tblBuilder.Append("</table>");
                }

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objCurInfo.GetUserName();
                string subdomainName = HttpContext.Request.Url.DnsSafeHost.ToString();

                string fileName = "ProjectActivityMapping" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(tblBuilder.ToString(), accKey, fileName, "bulkdatasvc");
                
                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
            }
        }

        public string InsertProjectActivityMapping(string projectcode, string activityCode, string startDate, string endDate)
        {
            try
            {
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLMaster _objBlMaster = new DataControl.BLMaster();
                
                string createdBy = _objCurInfo.GetUserName();



                return _objBlMaster.InsertSalesActivityMapping(_objCurInfo.GetCompanyCode(), projectcode, activityCode, startDate, endDate, createdBy,DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("ProjectCode", projectcode);
                dicObj.Add("ActivityCode", activityCode);
                dicObj.Add("StartDate", startDate);
                dicObj.Add("EndDate", endDate);
                
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
        }
        public string UpdateSalesActivityMapping(string nprojectcode, string nactivityCode, string oprojectcode, string oactivityCode, string startDate, string endDate, string mode, string status)
        {
            try
            {
                DataControl.BLMaster _objBlMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                return _objBlMaster.UpdateSalesActivityMapping(_objCurInfo.GetCompanyCode(), nprojectcode, nactivityCode, oprojectcode, oactivityCode, mode, status, startDate, endDate, _objCurInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("NProjectCode", nprojectcode);
                dicObj.Add("NActivityCode", nactivityCode);
                dicObj.Add("OProjectCode", oprojectcode);
                dicObj.Add("OActivityCode", oactivityCode);
                dicObj.Add("Mode", mode);
                dicObj.Add("Status", status);
                dicObj.Add("StartDate", startDate);
                dicObj.Add("EndDate", endDate);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);

                return "ERROR: " + ex.Message.ToString();
            }
        }
    }
}
