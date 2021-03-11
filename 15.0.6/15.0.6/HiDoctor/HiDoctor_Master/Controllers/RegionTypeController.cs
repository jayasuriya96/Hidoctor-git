using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HiDoctor_Master.Models;
using DataControl;
using System.Data;
using System.Text;
using MVCModels.HiDoctor_Master;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class RegionTypeController : Controller
    {
        //
        // GET: /RegionType/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /RegionType/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /RegionType/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /RegionType/Create

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
        // GET: /RegionType/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /RegionType/Edit/5

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
        // GET: /RegionType/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /RegionType/Delete/5

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

        public ActionResult RegionType()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            ViewBag.CompanyCode = _objcurrentInfo.GetCompanyCode();
            return View();
        }
        public JsonResult GetRegionType()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();


                List<Regiontype> Regionlst = new List<Regiontype>();
                DataSet ds = _objBlmaster.GetRegionTypeDetails(companyCode);
                DataTable dtregion = null;

                if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
                {
                    dtregion = ds.Tables[0];
                }

                Regionlst = (from Region in dtregion.AsEnumerable()
                             select new Regiontype
                             {
                                 UserRegionCode = Region["Region_Type_Code"].ToString(),
                                 UserRegionName = Region["Region_Type_Name"].ToString()
                             }).ToList<Regiontype>();

                return Json(Regionlst);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }
        //GetRegionTypeDetail

        public JsonResult GetRegionTypeDetail()
        {
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            ds = _objBlmaster.GetRegiontypeDetailsAll(_objCurrentInfo.GetCompanyCode());
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public int GetRefKey1(string Refkey1)
        {
            string companyCode = null;
            int result;
            try
            {
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                companyCode = _objCurrentInfo.GetCompanyCode();
                result = _objBlmaster.GetRefKey1(companyCode, Refkey1);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int GetRefKey2(string Refkey2)
        {
            string companyCode = null;
            int result;
            try
            {
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                companyCode = _objCurrentInfo.GetCompanyCode();
                result = _objBlmaster.GetRefKey2(companyCode, Refkey2);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public string GetRegionTypeDetailtable(DataSet ds)
        //{
        //    try
        //    {
        //        string blobUrl = string.Empty;
        //        StringBuilder sbTableContent = new StringBuilder();
        //        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        //        StringBuilder sb = new StringBuilder();
        //if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //{
        //    sbTableContent.Append("<table id='tblRegionsummary' class='table table-striped' >");
        //    sbTableContent.Append("<thead class='active'>");
        //    sbTableContent.Append("<tr style='background-color: #428bca'>");
        //    sbTableContent.Append("<td>Edit</td>");
        //    sbTableContent.Append("<td>Change Status</td>");
        //    sbTableContent.Append("<td>Region Type Name</td>");
        //    sbTableContent.Append("<td>Under Region</td>");
        //    sbTableContent.Append("<td>Status</td>");
        //    sbTableContent.Append("</tr>");
        //    sbTableContent.Append("</thead>");
        //    sbTableContent.Append("<tbody>");

        //    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        //    {
        //        sbTableContent.Append("<tr><td><a href='#' onclick ='fnEdit(\"" + ds.Tables[0].Rows[i]["Region_Type_Code"] + "_" + ds.Tables[0].Rows[i]["Region_Type_Name"] + "_" + ds.Tables[0].Rows[i]["Under_Region_Type"] + "\");'>Edit</a></td>");
        //        sbTableContent.Append("<input type='hidden' id='EditRegionTypeCode'/>");
        //        sbTableContent.Append("<td><a href='#' onclick ='fnChangeStatus(\"" + ds.Tables[0].Rows[i]["Region_Type_Code"] + "_" + ds.Tables[0].Rows[i]["Region_Type_Status"] + "\");'>Change Status</a></td>");
        //        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Region_Type_Name"] + "</td>");
        //        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["UnderRegion"] + "</td>");
        //        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Status"] + "</td></tr>");

        //    }
        //}
        //else
        //{
        //    return sb.Append("No Data Found").ToString();
        //}

        //        return sbTableContent.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicContext = new Dictionary<string, string>(); ;
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
        //        throw new Exception("Sorry an error occurred. Please try again later");
        //    }

        //}

        public string InsertRegionType(string regionTypeName, string underRegionCode, string Refkey1, string Refkey2,string RegionTypeCat)
        {

            try
            {
                string result = "";
                string effectiveFrom = System.DateTime.Now.ToString("yyyy-MM-dd");
                string status = "1";
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                DataControl.Data _objData = new DataControl.Data();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                string regionTypeCode = _objData.GetMaxCode(_objCurrentInfo.GetCompanyCode(), "tbl_SFA_Region_Type_Master", "Region_Type_Code", "RTC");
                int regionInsert = _objBlmaster.InsertRegionType(_objCurrentInfo.GetCompanyCode(), regionTypeCode, regionTypeName, underRegionCode, effectiveFrom, status, _objCurrentInfo.GetUserCode(), effectiveFrom, Refkey1, Refkey2, RegionTypeCat);
                result = regionInsert.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionTypeName", regionTypeName);
                dicContext.Add("Filter:UnderRegionCode", underRegionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }

        public string RegionChangeStatus(string regionTypeCode, string ChangeStatus)
        {
            try
            {
                string result = "";
                string statusChange = "0";
                if (ChangeStatus == "0")
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
                string status = _objBlmaster.RegionChangeStatus(_objCurrentInfo.GetCompanyCode(), regionTypeCode, statusChange, _objCurrentInfo.GetUserCode(), updatedDate);
                result = status.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionTypeCode", regionTypeCode);
                dicContext.Add("Filter:ChangeStatus", ChangeStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }

        //UpdateRegionType
        public string UpdateRegionType(string regionTypeCode, string regionTypeName, string underRegionCode, string Refkey1, string Refkey2, string RegionTypeCat)
        {
            try
            {
                string result = "";
                DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                string updatedDate = System.DateTime.Now.ToString("yyyy-MM-dd");
                int update = _objBlmaster.UpdateRegionType(_objCurrentInfo.GetCompanyCode(), regionTypeCode, regionTypeName, underRegionCode, _objCurrentInfo.GetUserCode(), updatedDate, Refkey1, Refkey2, RegionTypeCat);
                result = update.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionTypeCode", regionTypeCode);
                dicContext.Add("Filter:RegionTypeName", regionTypeName);
                dicContext.Add("Filter:UnderRegionCode", underRegionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }


        //For excell
        public void PutRegionTypeMasterIntoExcel()
        {
            string blobUrl = string.Empty;
            string error = string.Empty;
            StringBuilder sbTableContent = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder sb = new StringBuilder();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            try
            {

                DataSet ds = new DataSet();
                ds = _objBlmaster.GetRegiontypeDetailsAll(_objCurrentInfo.GetCompanyCode());
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<table id='tblRegionsummary' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Region Type Name</td>");
                    sbTableContent.Append("<td>Under Region</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Region_Type_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["UnderRegion"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Status"] + "</td></tr>");

                    }
                }
                else
                {
                    sbTableContent.Append("<tr><td>No records To Display</td></tr>");
                }

                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objCurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "RegionTypeMaster " + " - " + subdomainName + " - " + userName + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>(); ;
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

            }


        }

        public JsonResult GetKIRegionType(string RegionTypeName)
        {
            KI_RegionTypeModel obj = new KI_RegionTypeModel();
            try
            {
                CurrentInfo _objCurrInfo = new CurrentInfo();
                BLMaster _objBlmaster = new DataControl.BLMaster();
                string companyCode = _objCurrInfo.GetCompanyCode();
                obj = _objBlmaster.GetKIRegionType(companyCode, RegionTypeName);
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

