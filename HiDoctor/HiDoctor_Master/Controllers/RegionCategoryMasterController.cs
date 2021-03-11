using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using DataControl;
using System.Data;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class RegionCategoryMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Bind the RegionCategory with Html
        /// </summary>
        /// <returns></returns>
        public string GetRegionCategoryMaster()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster Master = new BLMaster();
                DataSet dsRegionCategory = new DataSet();
                dsRegionCategory = Master.GetRegionCategory(companyCode);

                StringBuilder sb = new StringBuilder();
                //sb.Append("<table WIDTH='50%' id='tblsummary' class='table table-striped' >");
                //sb.Append("<thead class='active'>");
                //sb.Append("<tr  style='background-color:#428bca;'>");
                //sb.Append("<td>Edit</td>");
                ////sb.Append("<td>Change Status</td>");
                //sb.Append("<td>Region Category Name</td>");
                //sb.Append("<td>Status</td>");
                //sb.Append("</tr>");
                //sb.Append("</thead>");
                //sb.Append("<tbody>");
                ////
                //if (dsRegionCategory != null && dsRegionCategory.Tables[0] != null && dsRegionCategory.Tables[0].Rows.Count > 0)
                //{
                //    for (int i = 0; i < dsRegionCategory.Tables[0].Rows.Count; i++)
                //    {
                //        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                //      // sb.Append("<tr><td class='td-b'><b id='D" + i + "' onclick='fnChange(this)'>Change Status</b></td>");
                //        sb.Append("<td style='display:none' id='Region_Classification_Code" + i + "'>" + dsRegionCategory.Tables[0].Rows[i]["Region_Classification_Code"] + "</td>");
                //        sb.Append("<td id='Region_Classification_Name" + i + "'>" + dsRegionCategory.Tables[0].Rows[i]["Region_Classification_Name"] + "</td>");
                //        sb.Append("<td id='Record_Status" + i + "'>" + dsRegionCategory.Tables[0].Rows[i]["Record_Status"] + "</td></tr>");
                //    }
                //}
                //else
                //{
                //    sb.Append("<tr><td>No records To Display</td></tr>");
                //}
                //sb.Append("</tbody>");
                //sb.Append("</table>");
                DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
                return _objJson.Serialize(dsRegionCategory);

            }
            catch (Exception ex)
            {
                //Dictionary<string, string> dicContext = new Dictionary<string, string>();
                //dicContext.Add("Filter:CompanyCode", companyCode);
                //DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                //return ex.Message.;
                throw (ex);
            }
        }

        /// <summary>
        /// DownLoad The RegionCategoryMasterDetails into Excel
        /// </summary>
        public void PutRegionCategoryMasterIntoExcel()
        {
            string error = string.Empty;

            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                StringBuilder sb = new StringBuilder();
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                DataSet dsRegionCategory = new DataSet();
                dsRegionCategory = Master.GetRegionCategory(companyCode);

                sb.Append("<table WIDTH='50%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr  style='background-color:#428bca;'>");
                sb.Append("<td>Region Category Name</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                //
                if (dsRegionCategory != null && dsRegionCategory.Tables[0] != null && dsRegionCategory.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsRegionCategory.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<tr><td id='Region_Classification_Name" + i + " style='text-align:left;'>" + dsRegionCategory.Tables[0].Rows[i]["Region_Classification_Name"] + "</td>");
                        sb.Append("<td id='Record_Status" + i + " style='text-align:left;'>" + dsRegionCategory.Tables[0].Rows[i]["Record_Status"] + "</td></tr>");
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

                string fileName = "RegionCategory" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

            }
        }

        ///////////////////////
        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="regionCategorycodeval"></param>
        /// <param name="regionCategoryname"></param>
        /// <param name="mode"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public string InsertandUpdateRegionCategory(string regionCategorycodeval, string regionCategoryname, string status ,string mode,string Ref_key1, string Ref_key2)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            //updated by preetham
            string CompanyId = _objcurrentInfo.GetCompanyId();
            int Companyid = 0;
            Int32.TryParse(CompanyId, out Companyid);
            //
            int maxNo = 0;
            string Docstatus = "";
            try
            {
                BLMaster Master = new BLMaster();
                //  maxNo = Master.GetMaxRowversionNo(companyCode);
                Docstatus = status.ToUpper() == "ENABLED" ? "1" : "0";
                //if (maxNo == 0)
                //{
                //    maxNo = 1;
                //}
                //else
                //{
                //    maxNo = maxNo + 1;
                //}
                if (mode.ToUpper() == "I") // Insert Data
                {

                    string regionCategoryCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_Region_Classification_Master", "Region_Classification_Code", "RCD");
                    return Master.InsertRegionCategory(companyCode, Companyid, regionCategoryCode, regionCategoryname, Docstatus, Ref_key1, Ref_key2, maxNo.ToString(), _objcurrentInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));

                }
                else
                {
                    return Master.UpdateRegionCategory(companyCode, Companyid, regionCategorycodeval, regionCategoryname, Docstatus, Ref_key1, Ref_key2, maxNo.ToString(), _objcurrentInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:regionCategorycodeval", regionCategorycodeval);
                dicContext.Add("Filter:regionCategoryname", regionCategoryname);
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:companyCode", companyCode);
                // dicContext.Add("Filter:companyid", CompanyId);
                dicContext.Add("Filter:mode", mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "ERROR: " + ex.Message.ToString();
                throw(ex) ;
            }
        }

        public string regionclassificationchangestatus(string regionClassificationCode, string regionClassificationname, string ChangeStatus)
        {
            try
            {
                string result = "";
                string statusChange = "0";
                if (ChangeStatus == "Disabled")
                {
                    statusChange = "1";
                }
                else
                {
                    statusChange = "0";
                }
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                string updatedDate = System.DateTime.Now.ToString("yyyy-MM-dd");
                string status = _objBlmaster.regionclassificationchangestatus(_objCurrentInfo.GetCompanyCode(), regionClassificationCode, regionClassificationname, statusChange, _objCurrentInfo.GetUserCode(), updatedDate);
                result = status.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:regionClassificationCode", regionClassificationCode);
                dicContext.Add("Filter:ChangeStatus", ChangeStatus);
                dicContext.Add("Filter:regionClassificationname", regionClassificationname);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
                //throw (ex);
            }
        }

        public bool GetRefKey_1(string refKey,string Regionclassificationname,string mode)
        {
            bool result = false;
            try
            {
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = _objBlmaster.GetRefKey_1(companyCode, refKey, Regionclassificationname, mode);
            }
            catch (Exception ex)
            {
                throw(ex);
            }
            return result;
        }


        public bool GetRefKey_2(string refKey, string Regionclassificationname, string mode)
        {
            bool result = false;
            try
            {
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = _objBlmaster.GetRefKey_2(companyCode, refKey, Regionclassificationname, mode);
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return result;
        }
    }
}
