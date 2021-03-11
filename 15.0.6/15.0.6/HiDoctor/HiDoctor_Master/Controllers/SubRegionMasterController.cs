using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.Mvc;
using DataControl;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class SubRegionMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        #region "Sub Region Master"
        public ActionResult SubRegionMaster()
        {
            return View();
        }

        /// <summary>
        /// Returns a table string of All SubRegion Master
        /// </summary>
        /// <returns></returns>
        public string GetSubRegionMaster()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                StringBuilder strTbl = new StringBuilder();
                BLMaster _objBlMaster = new BLMaster();
                List<SubRegionMasterModel> lstSubRegionMaster = _objBlMaster.GetSubRegionMaster(companyCode).ToList();
                if (lstSubRegionMaster != null && lstSubRegionMaster.Count() > 0)
                {
                    strTbl.Append("<div class='table-responsive'>");
                    strTbl.Append("<table class='table table-striped' id='tblSubRegion' cellspacing='0' cellpadding='0'>");
                    strTbl.Append("<thead>");
                    strTbl.Append("<tr>");
                    strTbl.Append("<th>Edit</th>");
                    strTbl.Append("<th>Change Status</th>");
                    strTbl.Append("<th>Sub Region Name</th>");
                    strTbl.Append("<th>Under Region</th>");
                    strTbl.Append("<th>Status</th></tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    int rowCount = 0;
                    foreach (var subRegion in lstSubRegionMaster)
                    {
                        strTbl.Append("<tr id='" + rowCount + "'>");
                        strTbl.Append("<td ><a href='#' onclick='fnEditSubRegionMaster(\""+subRegion.SubRegion_Code+"|"+subRegion.SubRegion_Name+"|"+subRegion.UnderRegion_Code+"|"+subRegion.UnderRegion+"\");'>Edit</a></td>");
                        strTbl.Append("<td ><a href='#' onclick='fnChangestatusSubRegionMaster(\"" + subRegion.SubRegion_Code + "|" + subRegion.SubRegion_Status + "\");'>Change Status</a></td>");
                        strTbl.Append("<td>"+subRegion.SubRegion_Name+"</td>");
                        strTbl.Append("<td>"+subRegion.UnderRegion+"</td>");
                        strTbl.Append("<td>"+subRegion.SubRegion_Status+"</td>");
                        strTbl.Append("<tr>");
                    }                   
                }
                else
                {
                    strTbl.Append("No Records To Display.");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table></div>");

                return strTbl.ToString();
            }
            catch(Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();                
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public JsonResult GetUnderRegion()
        {
            try
            {
                BLUser _objUser = new BLUser();
                IEnumerable<MVCModels.HiDoctor_Reports.FullTreeDetailsModel> lstUnderRegion = _objUser.GetFullUserTreeDetails(_objcurrentInfo.GetCompanyCode()).ToList();

                var underRegionList = (from underRegion in lstUnderRegion.AsEnumerable()
                                    select new MVCModels.HiDoctor_Reports.FullTreeDetailsModel()
                                    {
                                        Region_Name = underRegion.Region_Name.ToString(),
                                        Region_Code = underRegion.Region_Code.ToString()
                                    }).ToList<MVCModels.HiDoctor_Reports.FullTreeDetailsModel>();
                return Json(underRegionList);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="subRegionCodeVal"></param>
        /// <param name="subRegionName"></param>
        /// <param name="UnderRegionName"></param>
        /// <param name="underRegionCode"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public int InsertandUpdateSubRegionmaster(string subRegionCodeVal, string subRegionName, string UnderRegionName, string underRegionCode,string mode)
        {
            try
            {
                BLMaster _objMaster = new BLMaster();
                SubRegionMasterModel objSubRegion = new SubRegionMasterModel();
                List<SubRegionMasterModel> lstSubRegionMaster = new List<SubRegionMasterModel>();
                if (mode.ToUpper() == "I") // Insert the Date
                {
                    objSubRegion.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objSubRegion.SubRegion_Name = subRegionName;
                    objSubRegion.SubRegion_Status = "1";
                    objSubRegion.UnderRegion_Code = UnderRegionName;
                    objSubRegion.Created_By = _objcurrentInfo.GetUserName();
                    objSubRegion.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstSubRegionMaster.Add(objSubRegion);
                    int result = _objMaster.InsertforSubRegionMaster(lstSubRegionMaster);
                    return result;
                }
                else
                {
                    objSubRegion.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objSubRegion.SubRegion_Code = subRegionCodeVal;
                    objSubRegion.SubRegion_Name = subRegionName;
                    objSubRegion.UnderRegion_Code = UnderRegionName;
                    objSubRegion.Updated_By = _objcurrentInfo.GetUserName();
                    objSubRegion.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstSubRegionMaster.Add(objSubRegion);
                    int result = _objMaster.UpdateforSubRegionMaster(lstSubRegionMaster);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:subRegionName", subRegionName);
                dicContext.Add("Filter:subRegionCodeVal", subRegionCodeVal);
                dicContext.Add("Filter:underRegionCode", underRegionCode);
                dicContext.Add("Filter:mode", mode);             
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
                
        }

        /// <summary>
        /// Method is Used to DownLoad the Subregion master in Excel
        /// </summary>
        public void PutSubRegionMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {                
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                StringBuilder strTbl = new StringBuilder();
                BLMaster _objBlMaster = new BLMaster();
                List<SubRegionMasterModel> lstSubRegionMaster = _objBlMaster.GetSubRegionMaster(companycode).ToList();
                if (lstSubRegionMaster != null && lstSubRegionMaster.Count() > 0)
                {
                    strTbl.Append("<div class='table-responsive'>");
                    strTbl.Append("<table class='table table-striped' id='tblSubRegion' cellspacing='0' cellpadding='0'>");
                    strTbl.Append("<thead>");
                    strTbl.Append("<tr>");            
                    strTbl.Append("<th>Sub Region Name</th>");
                    strTbl.Append("<th>Under Region</th>");
                    strTbl.Append("<th>Status</th></tr>");
                    strTbl.Append("</thead>");
                    strTbl.Append("<tbody>");
                    int rowCount = 0;
                    foreach (var subRegion in lstSubRegionMaster)
                    {
                        strTbl.Append("<tr id='" + rowCount + "'>");                       
                        strTbl.Append("<td>" + subRegion.SubRegion_Name + "</td>");
                        strTbl.Append("<td>" + subRegion.UnderRegion + " </td>");
                        strTbl.Append("<td>" + subRegion.SubRegion_Status + " </td>");
                        strTbl.Append("<tr>");
                    }
                    strTbl.Append("</tbody>");
                    strTbl.Append("</table></div>");
                }          
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "SubRegion Master" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(strTbl.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        public bool ChangestatusforSubRegionmaster(string status, string subRgioncodeVal)
        {         
            bool changeResult = false;
            try
            {                
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforSubRegionMaster(status, subRgioncodeVal, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:domainCode", subRgioncodeVal);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }
        #endregion "Sub Region Master"
    }
}
