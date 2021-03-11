using DataControl;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using MVCModels.HiDoctor_Master;


namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class RegionController : Controller
    {
        //
        // GET: /Region/
        const int PAGESIZE = 10;
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Holiday()
        {
            ViewBag.CurrentDate = System.DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public JsonResult GetMappedHolidaysByDate(string holidayDate)
        {
            int count = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = null;
            string date = holidayDate.Split('/')[2] + "-" + holidayDate.Split('/')[1] + "-" + holidayDate.Split('/')[0];
            lstHoliday = objRegion.GetHolidayDetailsByDate(objCurInfo.GetCompanyCode(), date);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstHoliday));
        }

        public string GetMappedHolidayDetails(string regionCodes, string year, string SearchKey, int pageNumber, bool excelDownload)
        {
            int count = 0;
            int totalPageCount = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = null;
            lstHoliday = objRegion.GetMappedHolidayDetails(objCurInfo.GetCompanyCode(), regionCodes, year, SearchKey, pageNumber, excelDownload, PAGESIZE,
                ref totalPageCount);
            StringBuilder strContent = new StringBuilder();
            strContent.Append(Pager.Paging(pageNumber, totalPageCount));
            StringBuilder strExcelContent = new StringBuilder();
            strContent.Append("<table class='table table-striped'><thead><tr><td>S.No</td><td>Edit</td><td>Delete</td><td>Date</td><td>Holiday Name</td>");
            strContent.Append("<td>Region Name</td><td>Region Type</td><td>Reporting Region</td><td>Reporting Region Type</td></tr></thead>");
            if (lstHoliday != null)
            {
                int i = 0;
                foreach (var dr in lstHoliday)
                {
                    i++;
                    strContent.Append("<tr><td>" + i + "</td>");
                    strContent.Append("<td><a id='aEdit_" + i + "' onclick='fnEditHoliday(\"" + dr.Holiday_Code + "\",this)'>Edit</a></td>");
                    strContent.Append("<td><a id='aDelete_" + i + "' onclick='fnDeleteHoliday(\"" + dr.Holiday_Code + "\",this)'>Delete</a></td>");
                    strContent.Append("<td><span id='lblHolidayDate_" + i + "'>" + dr.Holiday_Date + "</span></td>");
                    strContent.Append("<td><span id='lblHolidayName_" + i + "'>" + dr.Holiday_Name + "</span></td>");
                    strContent.Append("<td>" + dr.Region_Name + "<input type='hidden' id='hdnRegionCode_" + i + "' value='" + dr.Region_Code + "'/></td>");
                    strContent.Append("<td>" + dr.Region_Type_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Type_Name + "</td>");
                    strContent.Append("</tr>");
                }

            }
            strContent.Append("</tbody></table>");
            return strContent.ToString();
        }

        public string GenerateYearWiseHolidayExcel(string regionCodes, string year, string SearchKey, int pageNumber, bool excelDownload)
        {
            int count = 0;
            int totalPageCount = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = null;
            lstHoliday = objRegion.GetMappedHolidayDetails(objCurInfo.GetCompanyCode(), regionCodes, year, SearchKey, pageNumber, excelDownload, PAGESIZE,
                ref totalPageCount);
            StringBuilder strContent = new StringBuilder();
            StringBuilder strExcelContent = new StringBuilder();
            strExcelContent.Append("<table class='table table-striped'><thead><tr><td>S.No</td><td>Date</td><td>Holiday Name</td>");
            strExcelContent.Append("<td>Region Name</td><td>Region Type</td><td>Reporting Region</td><td>Reporting Region Type</td></tr></thead>");
            if (lstHoliday != null)
            {
                int i = 0;
                foreach (var dr in lstHoliday)
                {
                    i++;

                    strExcelContent.Append("<tr><td>" + i + "</td>");
                    strExcelContent.Append("<td><span id='lblHolidayDate_" + i + "'>" + dr.Holiday_Date + "</span></td>");
                    strExcelContent.Append("<td><span id='lblHolidayName_" + i + "'>" + dr.Holiday_Name + "</span></td>");
                    strExcelContent.Append("<td>" + dr.Region_Name + "<input type='hidden' id='hdnRegionCode_" + i + "' value='" + dr.Region_Code + "'/></td>");
                    strExcelContent.Append("<td>" + dr.Region_Type_Name + "</td>");
                    strExcelContent.Append("<td>" + dr.Reporting_Region_Name + "</td>");
                    strExcelContent.Append("<td>" + dr.Reporting_Region_Type_Name + "</td>");
                    strExcelContent.Append("</tr>");
                }

            }
            strExcelContent.Append("</tbody></table>");
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
            string userName = objCurInfo.GetUserName();
            string subDomin = objCurInfo.GetSubDomain();
            string fileName = "HolidayMaster" + "_" + subDomin + "_" + userName + ".xls";
            string blobUrl = string.Empty;
            blobUrl = objAzureBlob.AzureBlobUploadText(strExcelContent.ToString(), accKey, fileName, "bulkdatasvc");
            return blobUrl;
        }
        public int InsertHolidayMaster(string regionCodes, string holidayDate, string holidayName, string mode, string holidayCode, string Old_HolidayDate)
        {
            int rowsAffected = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            List<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = new List<MVCModels.HiDoctor_Master.HolidayModel>();
            if (!string.IsNullOrEmpty(Old_HolidayDate))
            {
                Old_HolidayDate = Old_HolidayDate.Split('/')[2] + "-" + Old_HolidayDate.Split('/')[1] + "-" + Old_HolidayDate.Split('/')[0];
            }
            if (mode != "DELETE")
            {
                lstRegion = objRegion.GetRegions(objCurInfo.GetCompanyCode());
                if (!string.IsNullOrEmpty(regionCodes))
                {
                    string[] ar = regionCodes.Split(',');
                    for (int i = 0; i < ar.Length; i++)
                    {
                        MVCModels.HiDoctor_Master.HolidayModel objHoliday = new MVCModels.HiDoctor_Master.HolidayModel();
                        objHoliday.Company_Code = objCurInfo.GetCompanyCode();
                        if (mode == "INSERT")
                        {
                            objHoliday.Created_By = objCurInfo.GetUserName();
                            objHoliday.Created_DateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            objHoliday.Holiday_Status = "0";
                        }
                        else
                        {
                            objHoliday.Updated_By = objCurInfo.GetUserName();
                            objHoliday.Updated_DateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            objHoliday.Holiday_Code = holidayCode;
                        }
                        objHoliday.Holiday_Name = holidayName;
                        objHoliday.Holiday_Date = holidayDate.Split('/')[2] + "-" + holidayDate.Split('/')[1] + "-" + holidayDate.Split('/')[0];
                        objHoliday.Region_Code = ar[i];
                        var lstRegionType = lstRegion.AsEnumerable().Where(z => z.Region_Code == ar[i]).ToList();
                        if (lstRegionType.Count > 0)
                        {
                            objHoliday.Region_Type_Code = lstRegionType[0].Region_Type_Code;
                        }
                        lstHoliday.Add(objHoliday);
                    }
                    rowsAffected = objRegion.InsertHolidayMaster(lstHoliday, mode, objCurInfo.GetCompanyCode(), Old_HolidayDate);
                }
            }
            else
            {
                MVCModels.HiDoctor_Master.HolidayModel objHoliday = new MVCModels.HiDoctor_Master.HolidayModel();
                objHoliday.Holiday_Status = "1";
                objHoliday.Holiday_Code = holidayCode;
                objHoliday.Updated_By = objCurInfo.GetUserName();
                objHoliday.Updated_DateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                objHoliday.Company_Code = objCurInfo.GetCompanyCode();
                objHoliday.Region_Code = regionCodes;
                lstHoliday.Add(objHoliday);
                rowsAffected = objRegion.InsertHolidayMaster(lstHoliday, mode, objCurInfo.GetCompanyCode(), Old_HolidayDate);
            }
            return rowsAffected;
        }

        public string GetSearchHolidayDetails(string holidayDate)
        {
            int count = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday = null;
            string date = holidayDate.Split('/')[2] + "-" + holidayDate.Split('/')[1] + "-" + holidayDate.Split('/')[0];
            lstHoliday = objRegion.GetHolidayDetailsByDate(objCurInfo.GetCompanyCode(), date);
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<table class='table table-striped'><thead><tr><td>S.No</td><td>Date</td><td>Holiday Name</td>");
            strContent.Append("<td>Region Name</td><td>Region Type</td><td>Reporting Region</td><td>Reporting Region Type</td></tr></thead>");
            if (lstHoliday != null)
            {
                int i = 0;
                foreach (var dr in lstHoliday)
                {
                    i++;
                    strContent.Append("<tr><td>" + i + "</td>");
                    strContent.Append("<td>" + dr.Holiday_Date + "</td>");
                    strContent.Append("<td>" + dr.Holiday_Name + "</td>");
                    strContent.Append("<td>" + dr.Region_Name + "<input type='hidden' id='hdnRegionCode_" + i + "' value='" + dr.Region_Code + "'/></td>");
                    strContent.Append("<td>" + dr.Region_Type_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Type_Name + "</td>");
                    strContent.Append("</tr>");
                }

            }
            strContent.Append("</tbody></table>");
            return strContent.ToString();
        }

        public string GetRegionsForHolidaySearch()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLRegion objRegion = new DataControl.BLRegion();
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstRegion = null;
            IEnumerable<MVCModels.HiDoctor_Master.RegionModel> lstUnMappedRegion = null;
            lstRegion = objRegion.GetHolidayMappedRegions(objCurInfo.GetCompanyCode());
            lstUnMappedRegion = objRegion.GetHolidayUnMappedRegions(objCurInfo.GetCompanyCode());
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<table class='table table-striped' id='tblUnMappedRegion'><thead><tr><td>S.No</td><td><input type='checkbox' name='chkAllUnMappedRegion' onclick='fnSelectAllUnMappedRegions();'/></td>");
            strContent.Append("<td>Region Name</td><td>Region Type</td><td>Reporting Region</td><td>Reporting Region Type</td></tr></thead>");
            if (lstUnMappedRegion != null)
            {
                int i = 0;
                foreach (var dr in lstUnMappedRegion)
                {
                    i++;
                    strContent.Append("<tr><td>" + i + "</td>");
                    strContent.Append("<td><input type='checkbox' id='chkSelect_" + i + "' name='chkUnMappedRegion' value='" + dr.Region_Code + "'/></td>");
                    strContent.Append("<td>" + dr.Region_Name + "</td>");
                    strContent.Append("<td>" + dr.Region_Type_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Name + "</td>");
                    strContent.Append("<td>" + dr.Reporting_Region_Type_Name + "</td>");
                    strContent.Append("</tr>");
                }
            }
            strContent.Append("</table>");
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return objJson.Serialize(lstRegion) + "~" + strContent.ToString();
        }
        [HttpPost]
        public void GetHolidayExcelDownload(FormCollection coll)
        {
            string blobUrl = string.Empty, error = string.Empty;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            string holidayDate = string.Empty;
            if (!string.IsNullOrEmpty(coll["hdnSearchDate"]))
            {
                holidayDate = Convert.ToString(coll["hdnSearchDate"]);
            }
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
                string content = GetSearchHolidayDetails(holidayDate);

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objCurr.GetUserName();
                string subDomin = _objCurr.GetSubDomain();
                string fileName = "HolidayMaster" + "_" + subDomin + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(content.ToString(), accKey, fileName, "bulkdatasvc");
                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
        }

        public int HolidayInheritance(string sourceRegion, string destinationRegions)
        {
            int rowsAffected = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            try
            {
                List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
                DataControl.BLRegion objRegion = new DataControl.BLRegion();
                if (!string.IsNullOrEmpty(destinationRegions))
                {
                    string[] ar = destinationRegions.Split(',');
                    foreach (var region in ar)
                    {
                        if (!string.IsNullOrEmpty(region))
                        {
                            MVCModels.HiDoctor_Master.RegionModel objRegionModel = new MVCModels.HiDoctor_Master.RegionModel();
                            objRegionModel.Region_Code = region;
                            lstRegion.Add(objRegionModel);
                        }
                    }
                    rowsAffected = objRegion.HolidayInheritance(objCurInfo.GetCompanyCode(), sourceRegion, lstRegion,
                        objCurInfo.GetUserName(), System.DateTime.Now.ToString("yyyy-MM-dd"));
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }


        #region full index migration
        public string UpdateRegionNewIndex()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLRegion _objBlRegion = new DataControl.BLRegion();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlRegion.GetAllRegionsForMigration(_objCurInfo.GetCompanyCode());
                DataSet dsAllRegions = new DataSet();
                DataRow[] dr;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["Under_Region_Id"].ToString() == "0").ToArray();
                if (dr.Length > 0)
                {
                    string userCode = dr[0]["Region_Code"].ToString();
                    string userId = dr[0]["Region_Id"].ToString();
                    dsAllRegions = _objBlRegion.GetRegionHierarchyDataset(_objCurInfo.GetCompanyCode(), userCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllRegions.Tables[0].Rows.Count > 0)
                    {
                        //Display Order Update
                        for (int d = 0; d < dsAllRegions.Tables[0].Rows.Count; d++)
                        {
                            dsAllRegions.Tables[0].Rows[d]["Display_Order"] = d + 1;
                            dsAllRegions.AcceptChanges();
                        }
                        //Root user seq and full index update
                        DataRow[] drRoot;
                        drRoot = dsAllRegions.Tables[0].AsEnumerable().Where(c => c["Under_Region_Id"].ToString() == "0").ToArray();
                        drRoot[0]["Full_index"] = userId + ".";
                        drRoot[0]["Seq_index"] = "1";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        // Root child nodes seq and full index updation
                        DataRow[] drChild;
                        drChild = dsAllRegions.Tables[0].AsEnumerable().Where(d => d["Under_Region_Code"].ToString() == userCode).ToArray();
                        if (drChild.Length > 0)
                        {
                            int c = 0;
                            foreach (DataRow drr in drChild)
                            {
                                c++;
                                drr["Seq_index"] = c.ToString();
                                drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                dsAllRegions.AcceptChanges();
                            }
                        }
                        dsAllRegions.AcceptChanges();
                        int displayOrder = 0;
                        for (int i = 0; i < dsAllRegions.Tables[0].Rows.Count; i++)
                        {
                            displayOrder++;
                            string curRegionCode = dsAllRegions.Tables[0].Rows[i]["Region_Code"].ToString();
                            string curParRegionCode = dsAllRegions.Tables[0].Rows[i]["Under_Region_Code"].ToString();
                            if (curRegionCode != curParRegionCode)
                            {
                                string curRegionId = dsAllRegions.Tables[0].Rows[i]["Region_Id"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllRegions.Tables[0].AsEnumerable().Where(c => c["Region_Code"].ToString() == curParRegionCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["Full_index"].ToString();
                                    dsAllRegions.Tables[0].Rows[i]["Full_index"] = parIndex + curRegionId + ".";
                                    dsAllRegions.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                    dsAllRegions.Tables[0].Rows[i]["Under_Region_Id"] = drTemp[0]["Region_Id"].ToString();
                                }

                                drChild = dsAllRegions.Tables[0].AsEnumerable().Where(d => d["Under_Region_Code"].ToString() == curRegionCode).ToArray();
                                if (drChild.Length > 0)
                                {
                                    int c = 0;
                                    foreach (DataRow drr in drChild)
                                    {
                                        c++;
                                        drr["Seq_index"] = c.ToString();
                                        drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                        dsAllRegions.AcceptChanges();
                                    }
                                }
                            }
                        }
                        //Update Qry
                        int rowsAffected = 0;
                        result = _objBlRegion.BulkRegionTempInsert(_objCurInfo.GetCompanyCode(), dsAllRegions.Tables[0], "MIGRATION");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            rowsAffected = _objBlRegion.UpdateRegionIndexFromTemptoRegionMaster(_objCurInfo.GetCompanyCode(), "MIGRATION",
                                        guid, _objCurInfo.GetUserCode());
                            if (rowsAffected > 0)
                            {
                                result = "SUCCESS:Region Migration Done";
                            }
                            else
                            {
                                result = "ERROR:Error occurred while migration";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }

        public string UpdateRegionFullIndex()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLRegion _objBlRegion = new DataControl.BLRegion();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlRegion.GetAllRegionsForMigration(_objCurInfo.GetCompanyCode());
                DataSet dsAllRegions = new DataSet();
                DataRow[] dr;
                DataRow[] drChild;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["Under_Region_Id"].ToString() == "0").ToArray();
                if (dr.Length > 0)
                {
                    string regionCode = dr[0]["Region_Code"].ToString();
                    string regionId = dr[0]["Region_Id"].ToString();
                    dsAllRegions = _objBlRegion.GetRegionHierarchyDataset(_objCurInfo.GetCompanyCode(), regionCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllRegions.Tables[0].Rows.Count > 0)
                    {
                        DataRow[] drRoot;
                        drRoot = dsAllRegions.Tables[0].AsEnumerable().Where(c => c["Under_Region_Id"].ToString() == "0").ToArray();
                        drRoot[0]["Full_index"] = regionId + ".";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        dsAllRegions.AcceptChanges();

                        for (int i = 0; i < dsAllRegions.Tables[0].Rows.Count; i++)
                        {
                            string curRegionCode = dsAllRegions.Tables[0].Rows[i]["Region_Code"].ToString();
                            string curParRegionCode = dsAllRegions.Tables[0].Rows[i]["Under_Region_Code"].ToString();
                            if (curRegionCode != curParRegionCode)
                            {
                                string curRegionId = dsAllRegions.Tables[0].Rows[i]["Region_Id"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllRegions.Tables[0].AsEnumerable().Where(c => c["Region_Code"].ToString() == curParRegionCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["Full_index"].ToString();
                                    dsAllRegions.Tables[0].Rows[i]["Full_index"] = parIndex + curRegionId + ".";
                                    dsAllRegions.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                }
                            }
                        }
                        //Update Qry
                        int rowsAffected = 0;
                        result = _objBlRegion.BulkRegionTempInsert(_objCurInfo.GetCompanyCode(), dsAllRegions.Tables[0], "REFRESH");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            rowsAffected = _objBlRegion.UpdateRegionIndexFromTemptoRegionMaster(_objCurInfo.GetCompanyCode(), "REFRESH",
                                         guid, _objCurInfo.GetUserCode());
                            if (rowsAffected > 0)
                            {
                                result = "SUCCESS:Region tree refreshed successfully";
                            }
                            else
                            {
                                result = "ERROR:Error occurred while refresh the region";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }
        #endregion full index migration


        #region Holiday Bulk Upload
        public string UploadHolidayExcelFile()
        {
            DataControl.BLRegion objBlRegion = new BLRegion();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string subDomain = objCurInfo.GetSubDomain();
            string result = string.Empty;
            result = objBlRegion.InsertHolidayExcelBulkUpload(objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), Request.Files, objCurInfo.GetUserCode(),
                subDomain);
            return result;
        }
        public void DownloadHolidayExcelTemplate()
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string error = string.Empty;
            string fileName = "Holiday_Bulk_Upload.xlsx";
            string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;
            objFileDownload.DownloadFile(blobURL, fileName, out error);
        }
        public void DownloadRegionExcelTemplate()
        {
            var lsRegionMaster = new List<ExcelRegionMaster>();
            DataControl.BLRegion objBlRegion = new BLRegion();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            lsRegionMaster = objBlRegion.GetRegionFullTreeDetails(objCurInfo.GetCompanyCode());
            if (lsRegionMaster.Count > 0)
            {
                foreach (var item in lsRegionMaster)
                {
                    var regionDetails = lsRegionMaster.Where(x => x.Region_Code == item.Region_Code);
                    string fullIndex = "";
                    foreach (var singleRegion in regionDetails)
                        fullIndex = singleRegion.Full_Index;
                    string[] fullIndexArray = fullIndex.Split('.');
                    List<string> regionFullIndex = new List<string>();
                    for (int i = 0; i < fullIndexArray.Length - 1; i++)
                    {
                        string temp = "";
                        for (int j = 0; j <= i; j++)
                            if (temp == "")
                                temp = fullIndexArray[j] + ".";
                            else
                                temp = temp + fullIndexArray[j] + ".";
                        regionFullIndex.Add(temp);
                    }
                    if (regionFullIndex.Count > 1)
                    {
                        string parentRegionFullIndex = regionFullIndex[regionFullIndex.Count - 2];
                        var parentRegionDetail = lsRegionMaster.Where(x => x.Full_Index == parentRegionFullIndex);
                        foreach (var parentitem in parentRegionDetail)
                        {
                            item.Reporting_Region_Name = parentitem.Region_Name;
                            item.Reporting_Region_Type = parentitem.Region_Type_Name;
                        }
                    }
                    else
                    {
                        item.Reporting_Region_Name = item.Region_Name;
                        item.Reporting_Region_Type = item.Region_Type_Name;
                    }
                }
                System.Web.HttpResponse response = System.Web.HttpContext.Current.Response;
                ConvertToExcel(lsRegionMaster, "Region_Master_Data" + "_" + DateTime.Now.ToShortDateString(), response);
            }
        }
        public void ConvertToExcel(List<ExcelRegionMaster> lsRegion, string fileName, HttpResponse Response)
        {
            Response.ClearContent();
            Response.ClearHeaders();
            Response.Buffer = true;
            Response.Charset = "";
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("content-disposition",
                     "attachment; filename=" + fileName + ".xls");

            using (XmlTextWriter x = new XmlTextWriter(Response.OutputStream, Encoding.UTF8))
            {
                x.WriteRaw("<?xml version=\"1.0\"?><?mso-application progid=\"Excel.Sheet\"?>");
                x.WriteRaw("<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\" ");
                x.WriteRaw("xmlns:o=\"urn:schemas-microsoft-com:office:office\" ");
                x.WriteRaw("xmlns:x=\"urn:schemas-microsoft-com:office:excel\" ");
                x.WriteRaw("xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">");
                x.WriteRaw("<Styles><Style ss:ID='sText'>" +
                           "<NumberFormat ss:Format='@'/></Style>");
                x.WriteRaw("<Style ss:ID='sDate'><NumberFormat" +
                           " ss:Format='[$-409]m/d/yy\\ h:mm\\ AM/PM;@'/>");
                x.WriteRaw("</Style></Styles>");
                string sheetName = "Region Master";
                x.WriteRaw("<Worksheet ss:Name='" + sheetName + "'>");
                x.WriteRaw("<Table>");

                //column headers
                x.WriteRaw("<Row>");


                x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                x.WriteRaw("S.no");
                x.WriteRaw("</Data></Cell>");
                x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                x.WriteRaw("Region Name");
                x.WriteRaw("</Data></Cell>");
                x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                x.WriteRaw("Region Type");
                x.WriteRaw("</Data></Cell>");
                x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                x.WriteRaw("Reporting Region Name");
                x.WriteRaw("</Data></Cell>");
                x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                x.WriteRaw("Reporting Region Type");
                x.WriteRaw("</Data></Cell>");

                x.WriteRaw("</Row>");
                int i = 1;
                foreach (var dt in lsRegion)
                {
                    x.WriteRaw("<Row>");
                    x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                    x.WriteRaw(i.ToString());
                    i++;
                    x.WriteRaw("</Data></Cell>");

                    x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                    x.WriteRaw(dt.Region_Name);
                    x.WriteRaw("</Data></Cell>");

                    x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                    x.WriteRaw(dt.Region_Type_Name);
                    x.WriteRaw("</Data></Cell>");

                    x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                    x.WriteRaw(dt.Reporting_Region_Name);
                    x.WriteRaw("</Data></Cell>");

                    x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                    x.WriteRaw(dt.Reporting_Region_Type);
                    x.WriteRaw("</Data></Cell>");
                    x.WriteRaw("</Row>");
                }
                x.WriteRaw("</Table></Worksheet>");
                x.WriteRaw("</Workbook>");
            }
            Response.End();
        }
        #endregion

        public JsonResult GetChildRegions()
        {
            BLRegion _objBlRegion = new BLRegion();
            CurrentInfo objCurInfo = new CurrentInfo();
            return Json(_objBlRegion.GetChildRegions(objCurInfo.GetCompanyCode()));
        }




    }



}
