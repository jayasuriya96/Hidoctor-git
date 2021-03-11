using DataControl;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class SFCRegionController : Controller
    {
        #region Private Variables
        private CurrentInfo _objCurrentInfo = null;
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        const int PAGESIZE = 10;
        #endregion Private Variables
        //
        // GET: /SFCRegion/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SFCRegion(string SFCVersion)
        {

            ViewBag.SFCVersion = "Y";
            ViewBag.FromDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy");
            ViewBag.Todate = "31/12/2099";
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }

        /// <summary>
        /// Retrieve the SFC Region.
        /// </summary>
        /// <param name="region_Code"></param>
        /// <param name="pageNumber"></param>
        /// <param name="totalPageNo"></param>
        /// <returns></returns>
        private IEnumerable<SFCRegionModel> GetSFCRegions(string region_Code, int pageNumber, bool isAllRowsReq, ref int totalPageNo, string searchregion, string searchFromPlace, string searchToPlace, string SFCStatus, int showArchived)
        {
            SFCRegionModel objsfcRegionModel = new SFCRegionModel();
            _objCurrentInfo = new CurrentInfo();
            objsfcRegionModel.Company_Code = _objCurrentInfo.GetCompanyCode();
            objsfcRegionModel.Region_Code = region_Code;

            BLMaster objMaster = new BLMaster();
            return objMaster.GetSFCRegions(objsfcRegionModel, pageNumber, PAGESIZE, isAllRowsReq, ref totalPageNo, searchregion, searchFromPlace, searchToPlace, SFCStatus, showArchived);
        }

        private string SFCHTMLFormat(List<SFCRegionModel> lstSFCRegions, string SFC_Approval_REQ_PRIV, int pageNumber, int totalPageNo, string SFC_Version_Req)
        {
            StringBuilder strSFCRegionTableBuilder = new StringBuilder();
            string statusClass = "";
            string SFCEditPrivilege = string.Empty;
            CurrentInfo _objCurr = new CurrentInfo();
            SPData objSP = new SPData();
            string editCss = string.Empty;
            if (lstSFCRegions != null && lstSFCRegions.Count > 0)
            {
                int rowNo = 0;

                SFCEditPrivilege = objSP.GetSinglePrivilegeNameForUser(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), "IS_SFC_MASTER_EDIT");
                if (SFCEditPrivilege != "YES")
                {
                    editCss = "style='display:none'";
                }
                else
                {
                    editCss = "";
                }
                strSFCRegionTableBuilder.Append(Pager.Paging(pageNumber, totalPageNo));
                strSFCRegionTableBuilder.Append("<div style='width:100%;overflow-x:auto;'><table cellspacing='0' cellpadding='0' id='tblSFCRegions' class='table table-striped' style='border:1px solid #aaa;'><thead><tr>");
                if (SFC_Approval_REQ_PRIV.ToUpper() == "NO")
                {
                    strSFCRegionTableBuilder.Append("<th><input type='checkbox' id='hdrCheckBox' onclick='fnCheckOrUncheckRowsCheckbox()' /></th>");
                }
                strSFCRegionTableBuilder.Append("<th " + editCss + " >Edit</th>");
                strSFCRegionTableBuilder.Append("<th>Add Version</th>");
                strSFCRegionTableBuilder.Append("<th>Region</th>");
                strSFCRegionTableBuilder.Append("<th>From Place</th>");
                strSFCRegionTableBuilder.Append("<th>To Place</th>");
                strSFCRegionTableBuilder.Append("<th>Category</th>");
                strSFCRegionTableBuilder.Append("<th>Distance</th>");
                strSFCRegionTableBuilder.Append("<th>Amount</th>");
                strSFCRegionTableBuilder.Append("<th>Travel Mode</th>");
                strSFCRegionTableBuilder.Append("<th>Date From</th>");
                strSFCRegionTableBuilder.Append("<th>Date To</th>");
                strSFCRegionTableBuilder.Append("<th>Status</th>");
                strSFCRegionTableBuilder.Append("<th>Validity of SFC Route</th>");
                strSFCRegionTableBuilder.Append("<th>SFC Min VisitCount</th>");
                strSFCRegionTableBuilder.Append("<th>SFC Max VisitCount</th>");
                strSFCRegionTableBuilder.Append("</tr></thead><tbody>");

                foreach (SFCRegionModel sfcRegionModel in lstSFCRegions)
                {
                    rowNo++;
                    strSFCRegionTableBuilder.Append("<tr id='row_" + rowNo + "'>");
                    if (SFC_Approval_REQ_PRIV.ToUpper() == "NO")
                    {
                        if (sfcRegionModel.SFCValidation.ToUpper() != "EXPIRED")
                        {
                            strSFCRegionTableBuilder.Append("<td><input type='checkbox' onclick='fnCheckOrUncheckHeaderRow()' id='rowcheckbox_");
                            strSFCRegionTableBuilder.Append(rowNo.ToString());
                            strSFCRegionTableBuilder.Append("'/></td>");
                        }
                        else
                        {

                            strSFCRegionTableBuilder.Append("<td>");
                            strSFCRegionTableBuilder.Append("-");
                            strSFCRegionTableBuilder.Append("</td>");
                        }
                    }

                    if (sfcRegionModel.SFCValidation.ToUpper() != "EXPIRED")
                    {

                        strSFCRegionTableBuilder.Append("<td " + editCss + "><span class='SFCEdit' id='spnEdit_");
                        strSFCRegionTableBuilder.Append(rowNo.ToString());
                        strSFCRegionTableBuilder.Append("' onclick='fnEditSFCSet(" + rowNo.ToString() + ")'>");
                        strSFCRegionTableBuilder.Append("&nbsp;");
                        strSFCRegionTableBuilder.Append("</span><span style='display:none' id='spnDFCCode_");
                        strSFCRegionTableBuilder.Append(rowNo.ToString());
                        strSFCRegionTableBuilder.Append("'>");
                        strSFCRegionTableBuilder.Append(sfcRegionModel.Distance_Fare_Code);
                        strSFCRegionTableBuilder.Append("</span><span style='display:none' id='spnSFCVersion_");
                        strSFCRegionTableBuilder.Append(rowNo.ToString());
                        strSFCRegionTableBuilder.Append("'>");
                        strSFCRegionTableBuilder.Append(sfcRegionModel.SFC_Version_No);
                        strSFCRegionTableBuilder.Append("</td>");
                    }
                    else
                    {
                        strSFCRegionTableBuilder.Append("<td " + editCss + ">");
                        strSFCRegionTableBuilder.Append("<span style='display:none' id='spnDFCCode_");
                        strSFCRegionTableBuilder.Append(rowNo.ToString());
                        strSFCRegionTableBuilder.Append("'>");
                        strSFCRegionTableBuilder.Append(sfcRegionModel.Distance_Fare_Code);
                        strSFCRegionTableBuilder.Append("</span>");
                        strSFCRegionTableBuilder.Append("-");
                        strSFCRegionTableBuilder.Append("</td>");
                    }

                    if (sfcRegionModel.Show_Version_Flag.ToUpper() == "Y")
                    {

                        strSFCRegionTableBuilder.Append("<td><span class='SFCVersionAdd' id='spnAddVesrion_");
                        strSFCRegionTableBuilder.Append(rowNo.ToString());
                        strSFCRegionTableBuilder.Append("' onclick='fnAddSFCVersion(" + rowNo.ToString() + ")'>");
                        strSFCRegionTableBuilder.Append("&nbsp;");
                        strSFCRegionTableBuilder.Append("</span></td>");
                    }
                    else
                    {
                        strSFCRegionTableBuilder.Append("<td>");
                        strSFCRegionTableBuilder.Append("-");
                        strSFCRegionTableBuilder.Append("</td>");
                    }
                    strSFCRegionTableBuilder.Append("<td><span id='spnRegion_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Region_Name);
                    strSFCRegionTableBuilder.Append("</span><span style='display:none' id='spnRegionCode_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Region_Code);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnFromPlace_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.From_Region_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnToRegionName_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.To_Region_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnCategory_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Category_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDistance_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Distance);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnFareAmount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Fare_Amount);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnTravelMode_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Travel_Mode);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDateFrom_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Date_From);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDateTo_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Date_To);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    statusClass = "SFC_" + sfcRegionModel.Status;
                    strSFCRegionTableBuilder.Append("<td class='" + statusClass + "'><span id='spnStatus_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Status);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='sfcValidity_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.SFCValidation);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnSFCMinVisitCount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Minimum_Count.ToString());
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnSFCVisitCount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.SFC_Visit_Count == null ? "0" : sfcRegionModel.SFC_Visit_Count);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("</tr>");
                }
                strSFCRegionTableBuilder.Append("</tbody></table></div>");
            }
            else
            {
                strSFCRegionTableBuilder.Append("<span>No SFC Details Found.</span>");
            }
            return strSFCRegionTableBuilder.ToString();
        }

        public JsonResult GetCategory()
        {
            List<object> lstCat = new List<object>();
            _objCurrentInfo = new CurrentInfo();
            BL_DCRHeader _objHead = new BL_DCRHeader();
            lstCat = _objHead.GetCategory(_objCurrentInfo.GetCompanyCode());

            return Json(lstCat, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// We retrieve the SFC list using pagination concept in sql.
        /// </summary>
        /// <param name="region_Code"></param>
        /// <param name="SFC_Approval_REQ_PRIV"></param>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        public string GetSFCRegionsHTMLFormat(string region_Code, string SFC_Approval_REQ_PRIV, int pageNumber, bool excelDownload, string SFC_Vesrion_Req, string searchregion, string searchFromPlace, string searchToPlace, string SFCStatus, int showArchived)
        {
            try
            {
                StringBuilder strSFCRegionTableBuilder = new StringBuilder();
                int totalPageNo = 1;
                List<SFCRegionModel> lstSFCRegions = (List<SFCRegionModel>)GetSFCRegions(region_Code, pageNumber, excelDownload, ref totalPageNo, searchregion, searchFromPlace, searchToPlace, SFCStatus, showArchived);
                return SFCHTMLFormat(lstSFCRegions, SFC_Approval_REQ_PRIV, pageNumber, totalPageNo, SFC_Vesrion_Req);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("region_Code:", region_Code);
                dicContext.Add("SFC_Approval_REQ_PRIV:", SFC_Approval_REQ_PRIV);
                dicContext.Add("pageNumber:", pageNumber.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// We retrieve the Fare amount.
        /// </summary>
        /// <param name="distance"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public double GetFareAmount(int distance, string userTypeCode, string entity)
        {
            try
            {
                _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();

                BLMaster objMaster = new BLMaster();
                return objMaster.SFCFareCalcUsedByDistanceMatrix(companyCode, userTypeCode, entity, distance);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("distance:", distance.ToString());
                dicContext.Add("userTypeCode:", userTypeCode);
                dicContext.Add("entity:", entity);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// we call the insert and update the SFC this function.
        /// </summary>
        /// <param name="SFCJson"></param>
        /// <returns></returns>
        public JsonResult SaveSFCMaster(string SFCJson, string SaveType)
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                _objCurrentInfo = new CurrentInfo();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string ipAddress = Request.ServerVariables["REMOTE_ADDR"].ToString();
                string hostName = System.Web.HttpContext.Current.Server.MachineName.ToString();
                string userCode = _objCurrentInfo.GetUserCode();

                Dictionary<string, string> dicSFCSaveTravelModeWise = objMaster.MutlipleSFCCall(companyCode, userCode, SFCJson, ipAddress, hostName, SaveType);
                return Json(dicSFCSaveTravelModeWise);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("SFC JSON:", SFCJson); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        public string GetSFCInCPTPDCRPopup(string region_Code, string sfcCodes)
        {
            BLApproval objBlApproval = new BLApproval();
            _objCurrentInfo = new CurrentInfo();
            string company_Code = _objCurrentInfo.GetCompanyCode();

            DataSet ds = objBlApproval.GetSFCInCPTPDCRPopup(company_Code, region_Code, sfcCodes);

            StringBuilder sbTableContent = new StringBuilder();
            sbTableContent.Append("<table id='tblPopsummary' class='table table-striped' >");
            sbTableContent.Append("<thead style='background-color: gainsboro; font-weight: bold' class='active'>");
            sbTableContent.Append("<tr>");
            sbTableContent.Append("<td>SFC Row</td>");
            sbTableContent.Append("<td>Screen</td>");
            sbTableContent.Append("<td>Name</td>");
            sbTableContent.Append("<td>Date</td>");
            sbTableContent.Append("<td>Status</td>");
            sbTableContent.Append("</tr>");
            sbTableContent.Append("</thead>");
            sbTableContent.Append("<tbody>");
            if (ds.Tables.Count > 0)
            {

                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    for (int j = 0; j < ds.Tables[i].Rows.Count; j++)
                    {
                        sbTableContent.Append("<tr><td>" + ds.Tables[i].Rows[j]["Row_Number"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Transaction"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Date"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Status"] + "</td></tr>");
                    }
                }

            }
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("</table>");
            return sbTableContent.ToString();


        }

        private string SFCExcelTable(List<SFCRegionModel> lstSFCRegions)
        {
            StringBuilder strSFCRegionTableBuilder = new StringBuilder();
            if (lstSFCRegions != null && lstSFCRegions.Count > 0)
            {
                int rowNo = 0;
                strSFCRegionTableBuilder.Append("<table cellspacing='0' cellpadding='0' id='tblSFCRegions' class='table table-striped col-sm-10'><thead><tr>");
                strSFCRegionTableBuilder.Append("<th>Region</th>");
                strSFCRegionTableBuilder.Append("<th>From Place</th>");
                strSFCRegionTableBuilder.Append("<th>To Place</th>");
                strSFCRegionTableBuilder.Append("<th>Category</th>");
                strSFCRegionTableBuilder.Append("<th>Distance</th>");
                strSFCRegionTableBuilder.Append("<th>Amount</th>");
                strSFCRegionTableBuilder.Append("<th>Travel Mode</th>");
                strSFCRegionTableBuilder.Append("<th>Date From</th>");
                strSFCRegionTableBuilder.Append("<th>Date To</th>");
                strSFCRegionTableBuilder.Append("<th>Status</th>");
                strSFCRegionTableBuilder.Append("<th>Minimum count</th>");
                strSFCRegionTableBuilder.Append("<th>Maximum count</th>");
                strSFCRegionTableBuilder.Append("</tr></thead><tbody>");

                foreach (SFCRegionModel sfcRegionModel in lstSFCRegions)
                {
                    rowNo++;
                    strSFCRegionTableBuilder.Append("<tr id='row_" + rowNo + "'>");
                    strSFCRegionTableBuilder.Append("<td><span id='spnRegion_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Region_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnFromPlace_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.From_Region_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnToRegionName_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.To_Region_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnCategory_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Category_Name);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDistance_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Distance);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnFareAmount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Fare_Amount);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnTravelMode_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Travel_Mode);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDateFrom_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Date_From);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnDateTo_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Date_To);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("<td><span id='spnStatus_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Status);
                    strSFCRegionTableBuilder.Append("</span></td>");
                    strSFCRegionTableBuilder.Append("<td><span id='spnSFCMinVisitCount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.Minimum_Count.ToString());
                    strSFCRegionTableBuilder.Append("</span></td>");
                    strSFCRegionTableBuilder.Append("<td><span id='spnSFCVisitCount_");
                    strSFCRegionTableBuilder.Append(rowNo.ToString());
                    strSFCRegionTableBuilder.Append("'>");
                    strSFCRegionTableBuilder.Append(sfcRegionModel.SFC_Visit_Count == null ? "0" : sfcRegionModel.SFC_Visit_Count);
                    strSFCRegionTableBuilder.Append("</span></td>");

                    strSFCRegionTableBuilder.Append("</tr>");
                }
                strSFCRegionTableBuilder.Append("</tbody></table>");
            }
            else
            {
                strSFCRegionTableBuilder.Append("<span>No SFC Details Found.</span>");
            }
            return strSFCRegionTableBuilder.ToString();
        }

        [HttpPost]
        public void DownloadSFCExcelFormat(FormCollection col)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            _objCurrentInfo = new CurrentInfo();
            string regioncode = col["hdnRegionCode"].ToString();
            string sfcStatus = col["SFCStatus"].ToString();
            int archived = Convert.ToInt32(col["rdoShowArchived"].ToString());
            int totalPageNo = 0;
            string error = "";
            List<SFCRegionModel> lstRegionModel = GetSFCRegions(regioncode, 1, true, ref totalPageNo, "", "", "", sfcStatus, archived).ToList();
            string SFCGrid = SFCExcelTable(lstRegionModel);

            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

            string userName = _objCurrentInfo.GetUserName();
            string compCode = _objCurrentInfo.GetCompanyCode();

            string fileName = "SFCMASTER" + "_" + compCode + "_" + userName + ".xls";
            string blobUrl = objAzureBlob.AzureBlobUploadText(SFCGrid, accKey, fileName, "bulkdatasvc");

            objFileDownload.DownloadFile(blobUrl, fileName, out error);
        }

        //[HttpPost]
        public ActionResult SFCExcelUploadResult(HttpPostedFileBase file)
        {
            DataControl.BLRegion objBlRegion = new BLRegion();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string subDomain = objCurInfo.GetSubDomain();
            string result = string.Empty;
            result = objBlRegion.InsertSFCExcelBulkUpload(objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, objCurInfo.GetUserCode(),
                subDomain, GetIP(), System.Net.Dns.GetHostName().ToString());
            ViewBag.ErrorCode = result;
            return View("SFCExcelUploadResult");
        }
        public string GetIP()
        {
            string strHostName = "";
            strHostName = System.Net.Dns.GetHostName();

            IPHostEntry ipEntry = System.Net.Dns.GetHostEntry(strHostName);

            IPAddress[] addr = ipEntry.AddressList;

            return addr[addr.Length - 1].ToString();

        }
        public void DownloadSFCExcelTemplate()
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string error = string.Empty;

            string fileName = "SFCMaster.xlsx";
            string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

            objFileDownload.DownloadFile(blobURL, fileName, out error);
        }
        public ActionResult SFCExcelUpload()
        {
            return View();
        }

        public JsonResult GetSelectedSFC(string regionCode, Int64 SFCCode)
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                _objCurrentInfo = new CurrentInfo();

                string company_Code = _objCurrentInfo.GetCompanyCode();

                return Json(objMaster.GetSelectedSFC(company_Code, regionCode, SFCCode));
            }
            catch
            {
                throw;
            }

        }

        #region SFC - Check existing SFC Record for same region
        /// <summary>
        /// Used to get the count of Existing SFC record for same region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="fromPlace"></param>
        /// <param name="toPlace"></param>
        /// <param name="categoryName"></param>
        /// <param name="travelMode"></param>
        /// <returns></returns>
        public JsonResult CheckExistingSFCforRegion(string regionCode, string fromPlace, string toPlace, string categoryName, string travelMode)
        {
            string message = string.Empty;
            Dictionary<string, int> dicTravleModeCount = new Dictionary<string, int>();
            try
            {
                BLMaster _objDAL = new BLMaster();
                CurrentInfo _objCurrentInfo = new CurrentInfo();

                dicTravleModeCount = _objDAL.GetExistingSFCCount(_objCurrentInfo.GetCompanyCode(), regionCode, fromPlace, toPlace, categoryName, travelMode);
                return Json(dicTravleModeCount);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("fromPlace", fromPlace);
                dicContext.Add("toPlace", toPlace);
                dicContext.Add("categoryName", categoryName);
                dicContext.Add("travelMode", travelMode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw ex;
            }
        }
        #endregion SFC - Check existing SFC Record for same region

        public JsonResult GetSfc(string regionCode)
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                _objCurrentInfo = new CurrentInfo();

                string company_Code = _objCurrentInfo.GetCompanyCode();

                return Json(objMaster.GetSFC(company_Code, regionCode));
            }
            catch
            {
                throw;
            }

        }



        public JsonResult GetSfcToPlace(string regionCode)
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                _objCurrentInfo = new CurrentInfo();

                string company_Code = _objCurrentInfo.GetCompanyCode();

                var jsonResult = Json(objMaster.GetSFCTo(company_Code, regionCode), JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;

                return jsonResult;
            }
            catch
            {
                throw;
            }

        }

        public JsonResult GetTravelModes()
        {
            try
            {
                BL_TravelMode objTravleMode = new BL_TravelMode();
                string company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<TravelModeModel> IlstTravleMode = objTravleMode.GetTravelModes(company_Code);
                if (IlstTravleMode != null)
                {
                    return Json(IlstTravleMode.ToList());
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public ActionResult SFCCountExtension()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public JsonResult GetSFCExtendedDetails(string region_code, DateTime dcr_Date, int distance_Fare_Code)
        {
            BLMaster objMaster = new BLMaster();
            _objCurrentInfo = new CurrentInfo();

            string company_Code = _objCurrentInfo.GetCompanyCode();
            List<SFCRegionModel> lsSFCRegion = objMaster.GetSFCExtendedDetails(region_code, dcr_Date, distance_Fare_Code, company_Code);
            return Json(lsSFCRegion);
        }
        public JsonResult GetRegionSFC(string region_code, DateTime dcr_Date)
        {
            BLMaster objMaster = new BLMaster();
            _objCurrentInfo = new CurrentInfo();

            string company_Code = _objCurrentInfo.GetCompanyCode();
            List<SFCRegionModel> lsSFCRegion = objMaster.GetRegionSFC(region_code, dcr_Date, company_Code);
            return Json(lsSFCRegion);

        }
        public int SaveExtendSFC(int distance_Fare_Code, int sfc_Version_No, DateTime dcr_Date, string remark, int sfc_Extend_Count)
        {
            BLMaster objMaster = new BLMaster();
            _objCurrentInfo = new CurrentInfo();
            return objMaster.SaveExtendSFC(distance_Fare_Code, sfc_Version_No, dcr_Date, _objcurrentInfo.GetCompanyCode(), remark, _objcurrentInfo.GetUserCode(), sfc_Extend_Count);
        }
        public int DisableSFCCount(int sfc_Extend_Id)
        {
            BLMaster objMaster = new BLMaster();
            return objMaster.DisableSFCCount(sfc_Extend_Id);
        }
    }
}
