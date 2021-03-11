using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using System.Text;


namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class DistanceFareChartController : Controller
    {
        #region Private Variables
        private CurrentInfo _objCurr = new CurrentInfo();
        List<DistanceFareChartModel> _lstDFC = new List<DistanceFareChartModel>();
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetEntityAndUserType()
        {
            try
            {
                List<object> lstCat = new List<object>();
                List<object> lstUserType = new List<object>();

                BL_DCRHeader _objHead = new BL_DCRHeader();
                BLMaster _objMast = new BLMaster();

                lstCat = _objHead.GetCategory(_objCurr.GetCompanyCode());
                lstUserType = _objMast.GetUserType(_objCurr.GetCompanyCode());

                List<JsonResult> lst = new List<JsonResult> { Json(lstCat, JsonRequestBehavior.AllowGet), Json(lstUserType, JsonRequestBehavior.AllowGet) };
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        private List<DistanceFareChartModel> GetDFCList(string userTypeCode, string travelMode, string category)
        {
            BLMaster _objMast = new BLMaster();
            return _objMast.GetDistanceFareChartALL(_objCurr.GetCompanyCode(),userTypeCode,travelMode,category);
        }

        public string GetDFCHTMLTableFormat(string userTypeCode, string travelMode, string category)
        {
            List<DistanceFareChartModel> DFClist = GetDFCList(userTypeCode, travelMode, category);
            _lstDFC = DFClist.ToList();
            string HTMLSTRING = GetDistanceFareChartHTMLFormat();
            return HTMLSTRING.Length > 0 ? HTMLSTRING : null;
        }

        public string GetDistanceFareChartHTMLFormat()
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                //_lstDFC = GetDFCList();
                var lstDistUserType = _lstDFC.Select(x => new { x.User_Type_Code, x.User_Type_Name }).Distinct().ToList();

                if (_lstDFC != null && _lstDFC.Count > 0)
                {

                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblDFC' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th >Edit</th>");
                    sbTbl.Append("<th>From Km</th>");
                    sbTbl.Append("<th>To Km</th>");
                    sbTbl.Append("<th>Fare Amount</th>");
                    sbTbl.Append("<th>User Type</th>");
                    sbTbl.Append("<th>Entity</th>");
                    sbTbl.Append("<th>Travel Mode</th>");
                    sbTbl.Append("<th>Date From</th>");
                    sbTbl.Append("<th>Date To</th>");
                    sbTbl.Append("<th>Is Amount Fixed</th>");
                    sbTbl.Append("<th>Status</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");

                    foreach (var userType in lstDistUserType)
                    {
                        var lstDist = _lstDFC.AsEnumerable().Where(x => x.User_Type_Code == userType.User_Type_Code);
                        if (lstDist != null && lstDist.Count() > 0)
                        {
                            sbTbl.Append("<tr><th class='collapseHeader' colspan='12' onclick='fnDFCTableShowHide(\"dv_" + userType.User_Type_Code + "\",\"spn_" + userType.User_Type_Code + "\")'>");
                            sbTbl.Append("<span class='expandDFC' id='spn_" + userType.User_Type_Code + "' style='padding: 15px;'>" + userType.User_Type_Name + "<span style='font-size: 11px; font-style: italic;'>(Click to Expaned/Collapse!)</span></span>");
                            sbTbl.Append("</th></tr>");

                            foreach (var item in lstDist)
                            {
                                sbTbl.Append("<tr id='" + item.Distance_Range_Code + "' combination_key='" + userType.User_Type_Code + "_" + item.Entity_Code + "_" + item.Travel_Mode + "_" + item.Date_From + "_" + item.Date_To + "' class='dv_" + userType.User_Type_Code + "'>");
                                sbTbl.Append("<td class='td-a' onclick='fnEditDFC(\"" + item.Distance_Range_Code + "\",\"" + userType.User_Type_Code + "\",\"" + item.Entity_Code + "\",\"" + item.Travel_Mode + "\",\"" + item.Date_From + "\",\"" + item.Date_To + "\");'>Edit</td>");
                                sbTbl.Append("<td id='from_" + item.Distance_Range_Code + "'>" + item.From_Km.ToString() + "</td>");
                                sbTbl.Append("<td id='to_" + item.Distance_Range_Code + "'>" + item.To_Km.ToString() + "</td>");
                                sbTbl.Append("<td id='fare_" + item.Distance_Range_Code + "'>" + item.Fare_Amount.ToString() + "</td>");
                                sbTbl.Append("<td id='userType_" + item.Distance_Range_Code + "'>" + item.User_Type_Name.ToString() + "</td>");
                                sbTbl.Append("<td id='entity_" + item.Distance_Range_Code + "' class='dv_" + item.Entity_Code.ToString() + "'>" + item.Entity_Name.ToString() + "</td>");
                                sbTbl.Append("<td id='TM_" + item.Distance_Range_Code + "' class='dv_" + item.Travel_Mode.ToString() + "'>" + item.Travel_Mode.ToString() + "</td>");
                                sbTbl.Append("<td id='dFrom_" + item.Distance_Range_Code + "'>" + item.Date_From.ToString() + "</td>");
                                sbTbl.Append("<td id='dTo_" + item.Distance_Range_Code + "'>" + item.Date_To.ToString() + "</td>");
                                sbTbl.Append("<td id='isFixed_" + item.Distance_Range_Code + "'>" + ((item.Is_Amount_Fixed == "1") ? "Yes" : "No") + "</td>");
                                sbTbl.Append("<td id='status_" + item.Distance_Range_Code + "'>" + ((item.Status == 1) ? "Enabled" : "Disabled") + "</td>");
                                sbTbl.Append("</tr>");
                            }
                        }
                    }

                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("No Records found.");
                }
                return sbTbl.ToString();
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "ERROR^" + ex.Message;
            }
        }

        public string InsertDistanceFareChart(string DFCJson)
        {
            try
            {
                string result = string.Empty;
                string companyCode = _objCurr.GetCompanyCode();
                string userName = _objCurr.GetUserName();


                BLMaster _objMast = new BLMaster();

                result = _objMast.InsertDistanceFareChart(companyCode, DFCJson, userName);

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public void GetDistanceFareChartExcel()
        {
            try
            {
                List<DistanceFareChartModel> lstDFC = new List<DistanceFareChartModel>();
                BLMaster _objMast = new BLMaster();
                StringBuilder sbTableContentExcel = new StringBuilder();
                string blobUrl = string.Empty, error = string.Empty;
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();

                lstDFC = _objMast.GetDistanceFareChart(_objCurr.GetCompanyCode());
                var lstDistUserType = lstDFC.Select(x => new { x.User_Type_Code, x.User_Type_Name }).Distinct().ToList();

                if (lstDFC != null && lstDFC.Count > 0)
                {   //excel
                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Distance Fare Chart</div>");
                    sbTableContentExcel.Append("<table class='table table-striped' id='tblDFC' cellspacing='0' cellpadding='0' border='1'>");
                    sbTableContentExcel.Append("<thead>");
                    sbTableContentExcel.Append("<tr>");
                    sbTableContentExcel.Append("<th>From Km</th>");
                    sbTableContentExcel.Append("<th>To Km</th>");
                    sbTableContentExcel.Append("<th>Fare Amount</th>");
                    sbTableContentExcel.Append("<th>User Type</th>");
                    sbTableContentExcel.Append("<th>Entity</th>");
                    sbTableContentExcel.Append("<th>Date From</th>");
                    sbTableContentExcel.Append("<th>Date To</th>");
                    sbTableContentExcel.Append("<th>Is Amount Fixed</th>");
                    sbTableContentExcel.Append("<th>Status</th>");
                    sbTableContentExcel.Append("</tr>");
                    sbTableContentExcel.Append("</thead>");
                    sbTableContentExcel.Append("<tbody>");                 //

                    foreach (var userType in lstDistUserType)
                    {
                        var lstDist = lstDFC.AsEnumerable().Where(x => x.User_Type_Code == userType.User_Type_Code);
                        if (lstDist != null && lstDist.Count() > 0)
                        {
                            //excel
                            sbTableContentExcel.Append("<tr><th class='collapseHeader' colspan='9'>" + userType.User_Type_Name + "</th></tr>");
                            //

                            foreach (var item in lstDist)
                            {
                                // excel
                                sbTableContentExcel.Append("<tr >");
                                sbTableContentExcel.Append("<td >" + item.From_Km.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.To_Km.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.Fare_Amount.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.User_Type_Name.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.Entity_Name.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.Date_From.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + item.Date_To.ToString() + "</td>");
                                sbTableContentExcel.Append("<td >" + ((item.Is_Amount_Fixed == "1") ? "Yes" : "No") + "</td>");
                                sbTableContentExcel.Append("<td >" + ((item.Status == 1) ? "Enabled" : "Disabled") + "</td>");
                                sbTableContentExcel.Append("</tr>");
                                //
                            }
                        }
                    }
                    //excel
                    sbTableContentExcel.Append("</tbody></table>");
                    //
                }

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objCurr.GetUserName();
                string subDomin = _objCurr.GetSubDomain();
                string fileName = "DistanceFareChart_" + "_" + subDomin + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");
                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
        }

        public ActionResult DFCExcelUpload()
        {
            return View();
        }

        public ActionResult DFCExcelBulkAddResult(HttpPostedFileBase file)
        {
            string result = "";
            DataControl.BLMaster _objMast = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string subDomain = _objCurInfo.GetSubDomain();
            result = _objMast.InsertDFCExcelBulkUpload(subDomain, _objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode());
            ViewBag.ErrorCode = result;
            return View("DFCExcelBulkAddResult");
        }

        public void DownloadDFCExcelTemplate()
        {

            try
            {

                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                string error = string.Empty;

                string fileName = "DFCExcelBulkUpload.xlsx";
                string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

                objFileDownload.DownloadFile(blobURL, fileName, out error);

                // return new DownloadResult { VirtualPath = "~/Content/XLTemplates/EmployeeMaster.xls", FileDownloadName = "EmployeeMaster.xls" };
                //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + File_Name.ToUpper() + "_MASTER.csv", FileDownloadName = File_Name.ToUpper() + "_MASTER.csv" };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
