using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Collections;
using System.Text.RegularExpressions;
using ElmahWrapper;
using DataControl;
using System.Text;
using MVCModels;
using System.Web.SessionState;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using DataControl.HiDoctor_ReportsFactoryClasses;

namespace HiDoctor_Reports.Controllers
{
    //[SessionState(SessionStateBehavior.ReadOnly)]
    //[AjaxSessionActionFilter]
    public class ReportsController : Controller
    {
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private ReportRepository _objReport = new ReportRepository();
        private ActivityCountController objActivity = new ActivityCountController();
        private IConfigSettings IConfig_Settings = null;
        private BL_ReportRegion _objblReportRegion = null;
        const string COLL_START_DATE = "sd";
        const string COLL_END_DATE = "ed";
        const string COLL_REGION_CODE = "regionCode";
        const string Coll_PRODUCT_CODE = "ProductCode";
        const string DBDateFormat = "yyyy-MM-dd";
        BL_ExpenseClaim _objBlExpense = new BL_ExpenseClaim();
        int totalNoofappdaysforclaim_g = 0;
        string popupuserCode = string.Empty;
        #endregion Private Variables


        #region Get Post
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Reports/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        public ActionResult DoctorVisitHourlyReport(string userCode, string DcrfromDate, string DcrEndDate)
        {
            ViewBag.userCode = userCode;
            ViewBag.DcrfromDate = DcrfromDate;
            ViewBag.DcrEndDate = DcrEndDate;
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        //
        // GET: /Reports/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Reports/

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

        // GET: /Reports/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Reports/Edit/5

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
        // GET: /Reports/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Reports/Delete/5

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

        #endregion Get Post

        #region Views
        public ActionResult CPComplianceReport()
        {
            return View();
        }

        public ActionResult CategoryWiseDoctorVisitAnalysis()
        {
            return View();
        }

        public ActionResult DoctorMaster()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public ActionResult LockReport()
        {
            return View();
        }
        // Work analysis Month wise

        public ActionResult WorkAnalysisReport()
        {
            return View();
        }

        public ActionResult RCPADetailed()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult Tourplanner()
        {
            return View();
        }
        public ActionResult DaywiseAttendanceReport()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult DayWiseFieldWorkDetails()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult DoctorProductMapping()
        {
            return View();
        }
        // Doctor Statistics report

        public ActionResult DoctorStatisticsReport()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public ActionResult ExpenseReport()
        {
            return View();
        }
        public ActionResult LeaveReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult DayAnalysis()
        {
            return View();
        }

        public ActionResult TPReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult DCRConsolidatedReport(string userCode, string fromDate, string toDate)
        {
            ViewBag.userCode = userCode;
            ViewBag.fromDate = fromDate;
            ViewBag.toDate = toDate;

            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult LastSubmitted()
        {
            return View();
        }

        public ActionResult ExpenseGroupMasterReport()
        {
            return View();
        }

        public ActionResult ExpenseAnalysisReport(string userCode, string fromDate, string toDate, string status)
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.userCode = userCode;
            ViewBag.fromDate = fromDate;
            ViewBag.toDate = toDate;
            ViewBag.status = status;
            return View();
        }
        public ActionResult SalesAndActivityPerformance()
        {
            ViewBag.CurrentMonth = System.DateTime.Now.Month.ToString() + "_" + System.DateTime.Now.Year.ToString();
            return View();
        }

        public ActionResult MissedCallRecovery()
        {
            return View();
        }
        public ActionResult TargetReport()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult TargetRegionWiseReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult ExpenseSummaryReport()
        {
            return View();
        }
        public ActionResult ExpenseAnalysisGroupWiseReport()
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult ExpenseClaimReport()
        {
            ViewBag.Status = GetStatus();
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult ExpenseClaimAlumniReport()
        {
            ViewBag.Status = GetStatus();
            return View();
        }
        public ActionResult ChemistMetAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult DCRCountAlumni()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult DoctorVisitsFrequencyAnalysis()
        {
            return View();
        }

        public ActionResult TPVsActualDeviationDetails()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();

        }

        public ActionResult DoctorCallAnalysis()
        {
            return View();
        }

        public ActionResult TPStatusReport()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult DoctorVisitAnalysis()
        {
            return View();
        }

        public ActionResult Doctor360(string id)
        {
            ViewBag.Id = id;
            return View();
        }
        public ActionResult TpVsActualDoctorVisits(string userCode, string fromMonth, string toMonth)
        {
            ViewBag.userCode = userCode;
            ViewBag.fromMonth = fromMonth;
            ViewBag.toMonth = toMonth;
            return View();
        }
        public ActionResult CompetitorBrandAnalysis()
        {
            return View();
        }
        public ActionResult JoinedWorkAnalysis()
        {
            return View();
        }
        public ActionResult TpVsActualDeviationSummary()
        {
            return View();
        }

        public ActionResult DoctorYearlyVisitAnalysis()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public ActionResult SampleStockStatement()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult SecondarySalesCompliance()
        {
            return View();
        }
        public ActionResult SecondarySalesReports()
        {
            return View();
        }
        public ActionResult Inputanalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult FieldWorkAnalysis()
        {
            return View();
        }


        public ActionResult SecondarySalesTrendAnalysis()
        {
            ViewBag.CurrentMonth = System.DateTime.Now.Month.ToString() + "_" + System.DateTime.Now.Year.ToString();
            return View();
        }
        public ActionResult StockistWiseUnderOverStock()
        {
            return View();
        }
        public ActionResult SpecialityWiseAnalysis()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult RCPACompliance()
        {
            return View();
        }
        public ActionResult DoctorMissedFromCategory()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult DailyStatusReport()
        {
            return View();
        }

        public ActionResult SendarySalesReport()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public ActionResult SecondarySalesOldReport()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }


        public ActionResult StockistWiseUnderOverStockReport()
        {
            return View();
        }
        public ActionResult SecondarySalesTrendAnalysisNew()
        {
            ViewBag.CurrentMonth = System.DateTime.Now.Month.ToString() + "_" + System.DateTime.Now.Year.ToString();
            return View();
        }
        public ActionResult VacancyReport()
        {
            return View();
        }

        public ActionResult ExpenseAnalysisAlumni()
        {
            return View();
        }
        public ActionResult MarketingCampaignReport()
        {
            return View();
        }
        public ActionResult MarketingCampaignTracker()
        {
            return View();
        }
        public ActionResult MarketingCampaignVisitDetails()
        {
            return View();
        }
        public ActionResult GeoLocationReport()
        {
            return View();
        }
        public ActionResult OTCProductWiseOrderDetails()
        {
            return View();
        }

        public ActionResult SecondarySalesCustomerReport()
        {
            return View();
        }
        public ActionResult AuditReport()
        {
            return View();
        }
        public ActionResult VacancyReportNew()
        {
            return View();
        }

        public ActionResult BillingReport()
        {
            return View();
        }
        public ActionResult UserPerDayReport(string userCode, string dcrDate, string flag, string userName)
        {
            //  var CompanyId = "";
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("SurveyURL");
            ViewBag.userCode = userCode;
            ViewBag.dcrDate = dcrDate;// should be in dd/MM/yyyy formate
            ViewBag.flag = flag;
            ViewBag.userName = userName;
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            ViewBag.User_Name = _objcurrentInfo.GetUserName();
            ViewBag.CompanyId = _objcurrentInfo.GetCompanyId();
            ViewBag.accKey = accKey;
            return View();
        }
        public ActionResult ComprehensiveAnalysisReport()
        {
            return View();
        }
        public ActionResult SpecialityCategoryWiseVisitAnaly()
        {
            return View();
        }
        public ActionResult CubeViewSpecialityCategoryAnalysis()
        {
            return View();
        }

        public ActionResult InwardAuditReport()
        {
            return View();
        }
        public ActionResult LastSubmittedReport()
        {
            return View();
        }
        public ActionResult FWAIndex()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult FWADayAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult FWADoctorCallAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }

        public ActionResult FWAjointWorkAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }

        public ActionResult FWAChemistMetAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        //fnGetFWADoctorVisitsFrequencyAnalysisReport
        public ActionResult FWADrVisitFrequencyAnalysis()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult ExpenseAnalysisReportNG()
        {
            return View();
        }
        public ActionResult BrandAnalysisReport()
        {
            return View();
        }

        public ActionResult DoctorVisitAnalysisSpecialityWiseReport()
        {
            return View();
        }

        public ActionResult BrandMasterReport()
        {
            return View();
        }

        public ActionResult DoctorChemistMetTabular()
        {
            ViewBag.CompanyCode = _objcurrentInfo.GetCompanyCode();
            return View();
        }

        public ActionResult CPStatusReport()
        {
            return View();
        }

        public ActionResult DeviationCP()
        {
            return View();
        }
        public ActionResult TpWithCpDoctorMissed()
        {
            return View();
        }
        public ActionResult SpecialityCoverageAnalysis()
        {
            return View();
        }
        public ActionResult DCRConsolidatedTabular()
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult DCRConsolidatedAlumni()
        {
            return View();
        }
        public ActionResult ProductWiseDoctorReport()
        {
            return View();
        }
        public ActionResult TpStatusReportNew()
        {
            return View();
        }
        //public ActionResult SelfActivity()
        //{
        //    return View();
        //}

        public ActionResult DcrQuality()
        {
            return View();
        }

        public ActionResult DcrWeeklyReport()
        {
            return View();
        }

        public ActionResult MarketingCampaignReportOld()
        {
            return View();
        }

        public ActionResult EmployeeLeavetaken()
        {
            return View();
        }

        public ActionResult EmployeeLeavetakenAlumini()
        {
            return View();
        }

        public ActionResult DayofWeekReport()
        {
            return View();
        }

        public ActionResult LastSubmittedReportCalci()
        {
            return View();
        }

        public ActionResult WorkAnalysisreportNew()
        {
            return View();
        }
        public ActionResult PayslipReport()
        {
            return View();
        }

        public ActionResult ExpenseClaimDeductionReport()
        {
            ViewBag.Status = GetStatus();
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult SFCAuditReport()
        {
            return View();
        }
        public ActionResult LastSubmittedRPT()
        {
            return View();
        }
        public ActionResult ExpenseAnalysisGroupWiseReportNew()
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult NextGenDailyCallStatusReport()
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }

        public ActionResult NextGenUserPerDayReport(string companyCode, string userCode, string dcrDate)
        {
            ViewBag.userCode = userCode;
            ViewBag.dcrDate = dcrDate;// should be in dd/MM/yyyy formate
            ViewBag.Company_Code = companyCode;
            return View();
        }

        public ActionResult KYDCompletionStatus()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }
        string DOCTOR_CAPTION;
        string CHEMIST_CAPTION;
        string STOCKIEST_CAPTION;
        public string GetPrivillegeValue()
        {
            DOCTOR_CAPTION = _objcurrentInfo.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");

            if (DOCTOR_CAPTION.Length >= 21)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(20) + "...";

            }
            CHEMIST_CAPTION = _objcurrentInfo.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            if (CHEMIST_CAPTION.Length >= 21)
            {
                CHEMIST_CAPTION = CHEMIST_CAPTION.Remove(20) + "...";

            }
            STOCKIEST_CAPTION = _objcurrentInfo.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 21)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(20) + "...";

            }
            return DOCTOR_CAPTION;
        }
        public ActionResult DownloadComprehensiveAnalysisReportExcel(FormCollection coll)
        {
            string tableContent = GetComprehensiveAnalysisReport(coll);
            string compnayLogo = "<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>";
            tableContent = tableContent.Replace(compnayLogo, " ");
            //<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>

            Response.ContentType = "application/ms-excel";
            Response.AddHeader("content-disposition", "attachment; filename=Comprehensive Analysis Report.xls");
            Response.Write("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
            Response.Write("<head>");
            Response.Write("<meta http-equiv=\"Content-Type\" content=\"text/html;charset=windows-1252\">");
            Response.Write("<!--[if gte mso 9]>");
            Response.Write("<xml>");
            Response.Write("<x:ExcelWorkbook>");
            Response.Write("<x:ExcelWorksheets>");
            Response.Write("<x:ExcelWorksheet>");
            Response.Write("<x:Name>Comprehensive Analysis Report</x:Name>");
            Response.Write("<x:WorksheetOptions>");
            Response.Write("<x:Panes>");
            Response.Write("</x:Panes>");
            Response.Write("</x:WorksheetOptions>");
            Response.Write("</x:ExcelWorksheet>");
            Response.Write("</x:ExcelWorksheets>");
            Response.Write("</x:ExcelWorkbook>");
            Response.Write("</xml>");
            Response.Write("<![endif]-->");
            Response.Write("</head>");
            Response.Write("<body>");
            Response.Write("<table>");
            Response.Write(tableContent);
            Response.Write("</table>");
            Response.Write("</body>");
            Response.Write("</html>");
            return View();
        }

        public ActionResult DRBondDCReport()
        {
            // ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            //   ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }

        // reports for JIO Map
        public ActionResult HourlyInJioReport()
        {
            ViewBag.cur_UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            return View();
        }

        #endregion Views

        // Reports tree Data set

        public JsonResult GetRegionMasterDetails(FormCollection collection)
        {
            DataSet ds = new DataSet();
            ds = _objSPData.GetRegionMasterDetails();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        // Doctor master  binding dataset method start here
        public string GetDoctorMasterReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            StringBuilder strTb = new StringBuilder();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                string regionCode = collection["regionCode"].ToString();
                string viewoption = collection["options"].ToString();
                ds = _objSPData.GetDoctorMasterReport(companyCode, regionCode);
                if (viewoption == "S")
                {
                    strTb = GetDoctorMasterTable(ds);
                }
                else
                {
                    string customerMaster = GetDoctorMasterTable(ds).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objcurrentInfo.GetUserName();
                    string compCode = _objcurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "CUSTOMER_MASTER" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(customerMaster, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", collection["regionCode"].ToString());
                dicObj.Add("options", collection["options"].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }
        public StringBuilder GetDoctorMasterTable(DataSet ds)
        {
            int rowNo = 0, total = 0, categoryTotal = 0;
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = "";
            DataRow[] dr;
            if (ds.Tables[0].Rows.Count > 0)
            {

                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorMaster' >");
                tableContent.Append("<thead>");
                rowNo = 7;
                DataTable doctorTable = ds.Tables[0];
                DataTable CategoryTable = ds.Tables[1];
                DataTable userDetailTable = ds.Tables[2];
                DataTable userDivisionTable = ds.Tables[3];
                DataTable NoncategoryDoctorTable = ds.Tables[4];

                tableContent.Append("<tr>");
                tableContent.Append("<th >User Name</th>");
                tableContent.Append("<th >Employee Name</th>");
                tableContent.Append("<th >Region Name</th>");
                tableContent.Append("<th >Division Name</th>");
                tableContent.Append("<th>Reporting manager</th>");
                tableContent.Append("<th >Manager Territory name</th>");
                for (var i = 0; i < CategoryTable.Rows.Count; i++)
                {
                    tableContent.Append("<th >");
                    tableContent.Append(CategoryTable.Rows[i]["Category_Name"].ToString());
                    tableContent.Append("</th>");
                }

                tableContent.Append("<th >Total</th>");
                tableContent.Append("</tr >");
                //tableContent.Append("<th colspan= '" + rowNo + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                tableContent.Append("</thead>");

                tableContent.Append("<tbody>");
                for (var i = 0; i < userDetailTable.Rows.Count; i++)
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(userDetailTable.Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(userDetailTable.Rows[i]["Employee_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(userDetailTable.Rows[i]["Region_Name"].ToString());
                    tableContent.Append("</td>");
                    divisionName = "";
                    if (userDivisionTable.Rows.Count > 0)
                    {
                        dr = userDivisionTable.Select("Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");
                        if (dr.Length > 0)
                        {
                            for (int j = 0; j < dr.Length; j++)
                            {
                                divisionName += dr[j]["Division_Name"].ToString() + ",";
                            }
                        }
                        else
                        {
                            divisionName = "";
                        }

                        if (!string.IsNullOrEmpty(divisionName))
                        {
                            divisionName = divisionName.TrimEnd(',');
                        }
                        tableContent.Append("<td align='left'>");
                        tableContent.Append(divisionName);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left' ></td>");
                    }


                    tableContent.Append("<td align='left'>");
                    tableContent.Append(userDetailTable.Rows[i]["Manager_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(userDetailTable.Rows[i]["Manager_Region_Name"].ToString());
                    tableContent.Append("</td>");
                    total = 0;
                    categoryTotal = 0;
                    for (var k = 0; k < CategoryTable.Rows.Count; k++)
                    {

                        dr = doctorTable.Select("Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "' AND Category='" + CategoryTable.Rows[k]["Category_Code"].ToString() + "'");
                        if (dr.Length > 0)
                        {
                            total = Convert.ToInt32(dr[0]["Count"].ToString()) + total;
                            categoryTotal = Convert.ToInt32(dr[0]["Count"].ToString()) + categoryTotal;
                            tableContent.Append("<td align='left' >");
                            tableContent.Append("<span onclick='fnDetails(\"");
                            tableContent.Append(userDetailTable.Rows[i]["Region_Code"].ToString());
                            tableContent.Append("_");
                            tableContent.Append(dr[0]["Count"].ToString());
                            tableContent.Append("_");
                            tableContent.Append(CategoryTable.Rows[k]["Category_Name"]);
                            tableContent.Append("_");
                            tableContent.Append(CategoryTable.Rows[k]["Category_Code"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>");
                            tableContent.Append(dr[0]["Count"].ToString());
                            tableContent.Append("</span></td>");

                        }
                        else
                        {
                            tableContent.Append("<td align='left' >0</td>");
                        }

                    }
                    dr = NoncategoryDoctorTable.Select("Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");
                    if (dr.Length > 0)
                    {
                        total = Convert.ToInt32(dr[0]["Doctor_Count"].ToString()) + total;
                    }

                    tableContent.Append("<td align='left' >");
                    tableContent.Append("<span onclick='fnDetails(\"" + userDetailTable.Rows[i]["Region_Code"].ToString() + "_" + total + "_" + "Total_ALL\")'");
                    tableContent.Append("style='text-decoration:underline;cursor:pointer'>");
                    tableContent.Append(total);
                    if (total > categoryTotal)
                    {
                        tableContent.Append("<span style='color:red;'>*</span>");
                    }
                    tableContent.Append("</span></td>");
                    tableContent.Append("</tr>");
                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
            }
            return tableContent;
        }

        // Doctor master popup windows  binding dataset method Start here

        public string GetDoctorMasterDetails(FormCollection collection)
        {
            StringBuilder strtb = new StringBuilder();
            DataSet ds = new DataSet();
            string divisionName = string.Empty;
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string categoryCode = collection["category"].ToString();
            string docCount = collection["docCount"].ToString();
            string categoryName = collection["categoryName"].ToString();
            ds = _objSPData.GetDoctorMasterDetails(companyCode, "", regionCode, categoryCode);
            if (ds.Tables[1].Rows != null && ds.Tables[0].Rows.Count > 0)
            {
                strtb.Append("<div>");
                strtb.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserPopUp' class='data display datatable' >");
                strtb.Append("<thead><tr>");
                strtb.Append("<th colspan='4'>User Details</th>");
                strtb.Append("</tr></thead>");
                strtb.Append("<tbody>");
                strtb.Append("<tr>");
                strtb.Append("<td align='left' width='15%'>User Name</td>");
                strtb.Append("<td align='left' width='15%'>" + ds.Tables[1].Rows[0]["User_Name"] + "</td>");
                strtb.Append("<td align='left' width='15%'>Division Name</td>");
                DataRow[] dJsonData = ds.Tables[2].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == Convert.ToString(ds.Tables[1].Rows[0]["Region_Code"])).ToArray();
                divisionName = "";
                if (dJsonData.Length > 0)
                {
                    for (var j = 0; j < dJsonData.Length; j++)
                    {
                        divisionName += dJsonData[j]["Division_Name"] + ",";
                    }

                    if (divisionName != "")
                    {
                        divisionName = divisionName.Substring(0, divisionName.Length - 1);
                    }
                    strtb.Append("<td align='left' width='15%'>" + divisionName + "</td>");
                }
                else
                {
                    strtb.Append("<td align='left' width='15%'></td>");
                }
                strtb.Append("<tr>");
                strtb.Append("<td align='left' width='15%'>Employee Name</td>");
                strtb.Append("<td align='left' width='15%'>" + ds.Tables[1].Rows[0]["Employee_Name"] + "</td>");
                strtb.Append("<td align='left' width='15%'>Manager Name</td>");
                strtb.Append("<td align='left' width='15%'>" + ds.Tables[1].Rows[0]["Manager_Name"] + "</td></tr>");
                strtb.Append("<tr>");
                strtb.Append("<td align='left' width='15%'>Region Name</td>");
                strtb.Append("<td align='left' width='15%'>" + ds.Tables[1].Rows[0]["Region_Name"] + "</td>");
                strtb.Append("<td align='left' width='15%'>Manager Territory name</td>");
                strtb.Append("<td align='left' width='15%'>" + ds.Tables[1].Rows[0]["Manager_Region_Name"] + "</td></tr>");
                strtb.Append("<tr>");
                strtb.Append("<td align='left' width='15%'>Category Name</td>");
                strtb.Append("<td align='left' width='15%'>" + categoryName + "</td>");
                strtb.Append("<td align='left' width='15%'>Doctor Count</td>");
                strtb.Append("<td align='left' width='15%'>" + docCount + "</td>");
                strtb.Append("</tr>");
                strtb.Append("</tbody>");
                strtb.Append("</table>");
                strtb.Append("</div>");
                strtb.Append("</br>");

                ////Print Added
                //strtb.Append("<div id='dvSubprint' onclick='fnPrint('divdocdetalsprint','ifrmsubPrint);' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center; border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer; float: right; margin-right: 4%; display: none'></div>");

                strtb.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblDoctorPopUp' class='data display datatable'>");
                strtb.Append("<thead>");
                strtb.Append("<tr>");
                if (ds.Tables[3].Rows.Count > 0)
                {
                    for (int k = 0; k < ds.Tables[3].Rows.Count; k++)
                    {
                        strtb.Append("<th>");
                        strtb.Append(ds.Tables[3].Rows[k]["Field_Alias_Name"]);
                        strtb.Append("</th>");
                    }
                }
                strtb.Append("</tr>");
                strtb.Append("</thead>");

                strtb.Append("<tbody>");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    for (int c = 0; c < ds.Tables[0].Rows.Count; c++)
                    {
                        strtb.Append("<tr>");
                        for (int e = 0; e < ds.Tables[3].Rows.Count; e++)
                        {
                            string fieldName = ds.Tables[3].Rows[e]["Field_Name"].ToString();

                            if ("SPECIALITY_CODE" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c]["Speciality_Name"].ToString());
                                strtb.Append("</td>");
                            }
                            else if ("CATEGORY" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c]["Category_Name"].ToString());
                                strtb.Append("</td>");
                            }
                            else if ("SUBREGION_CODE" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c]["Subregion_Name"].ToString());
                                strtb.Append("</td>");
                            }
                            else if ("CUSTOMER_GROUP" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c]["Customer_Group_Name"].ToString());
                                strtb.Append("</td>");
                            }
                            else if ("DEPOT_CODE" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c]["Depot_Name"].ToString());
                                strtb.Append("</td>");
                            }
                            else if ("CUSTOMER_NAME" == fieldName.ToUpper())
                            {
                                strtb.Append("<td>");
                                strtb.Append("<span onclick='fnDoctor360Popup(\"" + ds.Tables[0].Rows[c]["Customer_Code"] + "\")' style='text-decoration:underline;cursor:pointer'>" + ds.Tables[0].Rows[c]["Customer_Name"] + "</span>");
                                strtb.Append("</td>");
                            }
                            else
                            {
                                strtb.Append("<td>");
                                strtb.Append(ds.Tables[0].Rows[c][ds.Tables[3].Rows[e]["Field_Name"].ToString()]);
                                strtb.Append("</td>");
                            }
                        }
                        strtb.Append("</tr>");
                    }
                }
                else
                {
                    strtb.Append("No doctors details found.");
                }

                strtb.Append("</tbody>");
                strtb.Append("</table>");



            }
            return strtb.ToString();
        }

        public string DownloadDoctorMasterReportExcel(FormCollection coll)
        {
            string tableContent = GetDoctorMasterDetails(coll);
            string compnayLogo = "<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>";
            tableContent = tableContent.Replace(compnayLogo, " ");
            //<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>

            DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
            DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
            string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

            string userName = _objcurrentInfo.GetUserName();
            string compCode = _objcurrentInfo.GetCompanyCode();
            string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

            string fileName = "DOCTOR_MASTER" + "_" + subdomainName + "_" + userName + ".xls";
            string blobUrl = objAzureBlob.AzureBlobUploadText(tableContent, accKey, fileName, "bulkdatasvc");


            return "<a href='" + blobUrl + "'>Click here to Download</a>";
        }



        // Lock Report windows  binding dataset method Start here
        public string GetLockReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string year = collection["year"].ToString();
            string lockType = collection["lockType"].ToString();

            ds = _objSPData.GetLockReport(companyCode, regionCode, year, lockType);

            DataTable dt = new DataTable();

            dt.Columns.Add("Region_Code");
            dt.Columns.Add("Day");
            dt.Columns.Add("Month");
            dt.AcceptChanges();

            DataRow drNewRow;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                drNewRow = dt.NewRow();
                drNewRow["Region_Code"] = dr["Region_Code"].ToString();

                if (dr["Lock_Type"].ToString().Trim().ToUpper() == "LOCK_LEAVE")
                {
                    drNewRow["Day"] = dr["Locked_Day"].ToString();
                    drNewRow["Month"] = dr["Locked_Month"].ToString();
                }
                else
                {
                    drNewRow["Day"] = dr["Locked_Day"].ToString();
                    drNewRow["Month"] = dr["Locked_Month"].ToString();
                }

                dt.Rows.Add(drNewRow);
                dt.AcceptChanges();
            }

            ds.Tables.Add(dt);

            return GetLockReportTable(ds);
        }
        public string GetLockReportTable(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            ArrayList monthList = new ArrayList();
            string divisionName = "", enteredDate = "";
            int total = 0;
            DataRow[] dr;
            for (int i = 0; i < 12; i++)
            {
                monthList.Add(System.Globalization.CultureInfo.CurrentUICulture.DateTimeFormat.MonthNames[i]);
            }

            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblLockreport' >");
            tableContent.Append("<thead><tr style='display: none;' id='tblTr'>");
            tableContent.Append("<th>User Name</th>");
            tableContent.Append("<th>Employee Name</th>");
            tableContent.Append("<th>Region Name</th>");
            tableContent.Append("<th>Division Name</th>");
            tableContent.Append("<th>Reporting manager</th>");
            tableContent.Append("<th>Manager Territory name</th>");
            for (var k = 0; k < monthList.Count; k++)
            {
                tableContent.Append("<th> </th>");
            }
            tableContent.Append("<th>Count</th>");
            tableContent.Append("</tr>");
            type.Append("[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' },null,null,null,null,null,null,null,null,null,null,null,null,{ type: 'number-range' }]");

            tableContent.Append("<tr>");
            tableContent.Append("<th>User Name</th>");
            tableContent.Append("<th>Employee Name</th>");
            tableContent.Append("<th>Region Name</th>");
            tableContent.Append("<th>Division Name</th>");
            tableContent.Append("<th>Reporting manager</th>");
            tableContent.Append("<th>Manager Territory name</th>");
            for (var k = 0; k < monthList.Count; k++)
            {
                tableContent.Append("<th>" + monthList[k].ToString().Substring(0, 3) + "</th>");
            }
            tableContent.Append("<th>Count</th>");
            tableContent.Append("</tr>");
            var columnCount = 7 + (monthList.Count);
            tableContent.Append("<th colspan= '" + columnCount + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
            tableContent.Append("  </thead>");
            tableContent.Append("<tbody>");

            DataTable userDetailTable = ds.Tables[1];
            DataTable divisionTable = ds.Tables[2];
            DataTable tpDetailTable = ds.Tables[3];

            for (var i = 0; i < userDetailTable.Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td align='left' >" + userDetailTable.Rows[i]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left'>" + userDetailTable.Rows[i]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left'>" + userDetailTable.Rows[i]["Region_Name"].ToString() + "</td>");
                if (ds.Tables[2].Rows.Count > 0)
                {
                    divisionName = "";
                    dr = divisionTable.Select("Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");
                    if (dr.Length > 0)
                    {
                        for (var j = 0; j < dr.Length; j++)
                        {
                            divisionName += dr[j]["Division_Name"].ToString() + ",";
                        }
                    }
                    else
                    {
                        divisionName = "";
                    }

                }
                tableContent.Append("<td align='left'>" + divisionName + "</td>");
                tableContent.Append("<td align='left' >" + userDetailTable.Rows[i]["Manager_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' >" + userDetailTable.Rows[i]["Manager_Region_Name"].ToString() + "</td>");
                total = 0;
                for (var k = 0; k < monthList.Count; k++)
                {
                    enteredDate = "";
                    dr = tpDetailTable.Select("Month='" + (k + 1) + "' AND Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");
                    if (dr.Length > 0)
                    {
                        total = Convert.ToInt32(dr.Length) + total;
                        for (var j = 0; j < dr.Length; j++)
                        {
                            enteredDate += dr[j]["Day"].ToString() + ",";
                        }
                        if (enteredDate != "")
                        {
                            enteredDate = enteredDate.TrimEnd(',');
                        }
                    }
                    tableContent.Append("<td align='center' >" + enteredDate + "</span></td>");
                }
                tableContent.Append("<td align='center' >" + total + "</td>");

                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>^");
            tableContent.Append(type);
            return tableContent.ToString();
        }

        public JsonResult GetSaleProductsSS(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetSalesProductSS '" + _objcurrentInfo.GetCompanyCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetStockiestSSOld(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                //string regionCode = collection["regionCode"].ToString();
                _objData.OpenConnection(_objcurrentInfo.GetRegionCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetStockiest '" + _objcurrentInfo.GetCompanyCode() + "', '" + _objcurrentInfo.GetRegionCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetStockiestSSOldReport(FormCollection collection, string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                //string regionCode = collection["regionCode"].ToString();
                // _objData.OpenConnection(_objcurrentInfo.GetRegionCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetStockiestSS '" + _objcurrentInfo.GetCompanyCode() + "', '" + regionCode + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string GetRCBADetails(FormCollection collection, int pageNo, int totalOwn, int totalComp)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            string productCodes = collection["productCodes"].ToString();
            string viewinOptions = collection["option"].ToString();
            StringBuilder strMain = new StringBuilder();
            StringBuilder strUser = new StringBuilder();
            int totalPageNo = 0;

            _objblReportRegion = new BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> lstRcpaDetailRepts = new List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel>();
            lstRcpaDetailRepts = _objblReportRegion.GetRcpaReptDetails(_objcurrentInfo.GetCompanyCode(), regionCode, startDate, endDate, productCodes, status).ToList();
            if (viewinOptions.ToUpper() == "S")
            {

                strUser = GetUserDetailsforRCPAinHTML(regionCode);
                strMain = GetRCBADetailsinHTML(lstRcpaDetailRepts, pageNo, totalPageNo, totalOwn, totalComp, viewinOptions);

                return strUser.ToString() + "^" + strMain.ToString();

            }
            else
            {
                StringBuilder strBuilder = new StringBuilder();
                string RCPAUserDetailsinHTMLFormat = GetUserDetailsforRCPAinHTML(regionCode).ToString();
                string RCPADetailsHTMLFormat = GetRCBADetailsinHTML(lstRcpaDetailRepts, pageNo, totalPageNo, totalOwn, totalComp, viewinOptions).ToString();
                string RCPADetailsReport = RCPAUserDetailsinHTMLFormat + "<br/>" + RCPADetailsHTMLFormat;

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();

                string fileName = "RCPA Details Report" + "_" + compCode + "_" + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(RCPADetailsReport, accKey, fileName, "bulkdatasvc");
                strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download.</a>");
                return strBuilder.ToString();
            }
        }

        public StringBuilder GetUserDetailsforRCPAinHTML(string regionCode)
        {
            _objblReportRegion = new BL_ReportRegion();
            StringBuilder strTbl = new StringBuilder();
            string divisionName = "";
            List<MVCModels.HiDoctor_Reports.RCPAUserdetailsModel> lstRcpauserDetailRepts = new List<MVCModels.HiDoctor_Reports.RCPAUserdetailsModel>();
            lstRcpauserDetailRepts = _objblReportRegion.GetUserdetailsforRCPA(_objcurrentInfo.GetCompanyCode(), regionCode);
            if (lstRcpauserDetailRepts != null && lstRcpauserDetailRepts.Count > 0)
            {
                //Bind Legend
                strTbl.Append("<div>");
                strTbl.Append("<lable>1)<span style='font-weight:bold;'>Mapped to Doctor</span> Is based on doctor product mapping details.</lable><br/>");
                strTbl.Append("<lable>2)<span style='font-weight:bold;'>Own Brand Rx per day</span> Is the quantity entered in DCR.</lable><br/>");
                strTbl.Append("<lable>3)<span style='font-weight:bold;'>Own Brand Value Per Day</span> Own Brand Rx per Day * Price defined in price group PTR column.</lable>");
                strTbl.Append("</div>");
                strTbl.Append("<br/>");
                //Bind User Details
                strTbl.Append("<table  class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'><thead><tr>");
                strTbl.Append("<th style='text-align:left'>User Name</th>");
                strTbl.Append("<th style='text-align:left'>Employee Name</th>");
                strTbl.Append("<th style='text-align:left'>Designation</th>");
                strTbl.Append("<th style='text-align:left'>Region Name</th>");
                strTbl.Append("<th style='text-align:left'>Division Name</th>");
                strTbl.Append("<th style='text-align:left'>Reporting Manager</th>");
                strTbl.Append("<th style='text-align:left'>Reporting Manager Territory Name</th>");
                strTbl.Append("</tr></thead><tbody>");
                foreach (var userDetails in lstRcpauserDetailRepts[0].lstRcpaUser)
                {
                    strTbl.Append("<tr>");
                    //User Name
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.User_Name);
                    strTbl.Append("</td>");
                    //Employee Name
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.Employee_Name);
                    strTbl.Append("</td>");
                    //Designation
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.User_Type_Name);
                    strTbl.Append("</td>");
                    //Region Name
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.Region_Name);
                    strTbl.Append("</td>");
                    //Division Name
                    if (lstRcpauserDetailRepts.Count > 0)
                    {
                        foreach (var divisionNames in lstRcpauserDetailRepts[0].lstUserDivisions)
                        {
                            divisionName += divisionNames.Division_Name + ',';
                        }
                    }
                    else
                    {
                        divisionName = "";
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        strTbl.Append("<td>");
                        strTbl.Append(divisionName.TrimEnd(','));
                        strTbl.Append("</td>");
                    }
                    else
                    {
                        strTbl.Append("<td>");
                        strTbl.Append(divisionName);
                        strTbl.Append("</td>");
                    }
                    //Reporting Manager Name
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.Manager_Name);
                    strTbl.Append("</td>");
                    //Reporting manager region name
                    strTbl.Append("<td>");
                    strTbl.Append(userDetails.Manager_Region_Name);
                    strTbl.Append("</td>");
                    strTbl.Append("</tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
            }
            return strTbl;
        }

        public StringBuilder GetRCBADetailsinHTML(List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> lstRcpaDetailRepts, int pageNo, int totalPageNo, int overallOwnTotal, int overallCompTotal, string viewinOptions)
        {
            StringBuilder strTbl = new StringBuilder();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string docName = string.Empty;
            string surName = string.Empty;
            string localArea = string.Empty;
            string mdlNo = string.Empty;
            string category = string.Empty;
            string speciality = string.Empty;
            string hospitalName = string.Empty;
            string hospitalClassification = string.Empty;
            string doctoVisitTime = string.Empty;
            string visitMode = string.Empty;
            string chemistName = string.Empty;
            string mapped = string.Empty;
            string customerCode = string.Empty;
            string date = string.Empty;
            string userName = string.Empty;
            string productCode = string.Empty;
            double pagewisetotalOwn = 0;
            double pagewiseTotalComp = 0;
            if (lstRcpaDetailRepts != null && lstRcpaDetailRepts.Count > 0)
            {
                var lstDistinctDates = lstRcpaDetailRepts[0].lstDoctorproducts.Select(s => s.Date).Distinct().ToList();
                double totalOwnProduct = 0;
                double totalComProduct = 0;
                string totalownValue = string.Empty;
                string totalCompValue = string.Empty;
                string productCOde = string.Empty;
                string docRegionCode = string.Empty;
                //RCPA Details Report             
                strTbl.Append("<table class='data display datatable' cellspacing='0' id='tblRCPADeatiledRept' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strTbl.Append("<thead>");
                strTbl.Append("<tr>");
                strTbl.Append("<th>Date</th><th>Doctor Name</th><th>MDL Number</th><th>Category</th>");
                strTbl.Append("<th>Specialty</th><th>Local Area</th><th>Hospital Name</th><th>Doctor Visit Time</th>");
                strTbl.Append("<th>Chemist Name</th><th>Mapped to Doctor (YES/NO)</th><th>Product Name</th>");
                strTbl.Append("<th>Own Brand RX Per Day</th><th>Own Brand Value Per Day</th><th>Competitor Name</th>");
                strTbl.Append("<th>Competitor Brand Rx Per Day</th><th>Competitor Brand Value Per Day</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstRcpaDetailRepts[0].lstDoctorproducts != null && lstRcpaDetailRepts[0].lstDoctorproducts.Count > 0)
                {
                    if (lstDistinctDates != null && lstDistinctDates.Count > 0)
                    {
                        foreach (var doctordetails in lstDistinctDates)
                        {
                            date = "";
                            docName = "";
                            surName = "";
                            customerCode = "";
                            mdlNo = "";
                            category = "";
                            speciality = "";
                            hospitalName = "";
                            hospitalClassification = "";
                            docRegionCode = "";
                            productCode = "";
                            doctoVisitTime = "";
                            visitMode = "";
                            userName = "";
                            mapped = "";
                            totalComProduct = 0;
                            totalOwnProduct = 0;
                            totalownValue = "";
                            totalCompValue = "";

                            if (!string.IsNullOrEmpty(doctordetails))
                            {
                                List<MVCModels.HiDoctor_Reports.RCPADoctorProductModel> lstDoctorlist = lstRcpaDetailRepts[0].lstDoctorproducts.Where(s => s.Date == doctordetails).ToList();
                                if (lstDoctorlist != null && lstDoctorlist.Count > 0)
                                {
                                    var lstDistinctDoctors = lstDoctorlist.Select(s => s.Customer_Name).Distinct().ToList();
                                    if (lstDistinctDoctors != null && lstDistinctDoctors.Count > 0)
                                    {
                                        foreach (var doctorlist in lstDistinctDoctors)
                                        {
                                            List<MVCModels.HiDoctor_Reports.RCPADoctorProductModel> lstDoctorRcpaDtails = lstDoctorlist.Where(s => s.Customer_Name == doctorlist.ToString()).ToList();
                                            if (lstDoctorRcpaDtails != null && lstRcpaDetailRepts.Count > 0)
                                            {
                                                var lstDoctor = lstDoctorRcpaDtails.Where(s => s.Customer_Name != "").FirstOrDefault();
                                                date = (string.IsNullOrEmpty(lstDoctor.Date)) ? "" : lstDoctor.Date.ToString();
                                                docName = (string.IsNullOrEmpty(lstDoctor.Customer_Name)) ? "" : lstDoctor.Customer_Name.ToString();
                                                localArea = (string.IsNullOrEmpty(lstDoctor.Local_Area)) ? "" : lstDoctor.Local_Area.ToString();
                                                customerCode = (string.IsNullOrEmpty(lstDoctor.Customer_Code)) ? "" : lstDoctor.Customer_Code.ToString();
                                                mdlNo = (string.IsNullOrEmpty(lstDoctor.MDL_Number)) ? "" : lstDoctor.MDL_Number.ToString();
                                                category = (string.IsNullOrEmpty(lstDoctor.Category_Name)) ? "" : lstDoctor.Category_Name.ToString();
                                                speciality = (string.IsNullOrEmpty(lstDoctor.Speciality_Name)) ? "" : lstDoctor.Speciality_Name.ToString();
                                                hospitalName = (string.IsNullOrEmpty(lstDoctor.Hospital_Name)) ? "" : lstDoctor.Hospital_Name.ToString();
                                                docRegionCode = (string.IsNullOrEmpty(lstDoctor.Region_Code)) ? "" : lstDoctor.Region_Code.ToString();
                                                productCode = (string.IsNullOrEmpty(lstDoctor.DCR_Product_Code)) ? "" : lstDoctor.DCR_Product_Code.ToString();

                                                if (!string.IsNullOrEmpty(lstDoctor.Doctor_Visit_Time))
                                                {
                                                    doctoVisitTime = lstDoctor.Doctor_Visit_Time.ToString();
                                                }
                                                else
                                                {
                                                    visitMode = lstDoctor.Doctor_Visit_Time.ToString();
                                                }
                                                chemistName = (string.IsNullOrEmpty(lstDoctor.Chemists_Name)) ? "" : lstDoctor.Chemists_Name.ToString();


                                                if (lstRcpaDetailRepts[0].lstRCPAProducts != null && lstRcpaDetailRepts[0].lstRCPAProducts.Count > 0)
                                                {
                                                    var lstRCPAProductlist = lstRcpaDetailRepts[0].lstRCPAProducts.Where(s => s.Region_Code == docRegionCode && s.Customer_Code == customerCode && s.Product_Code == productCode).ToList();
                                                    if (lstRCPAProductlist.Count > 0)
                                                    {
                                                        mapped = "YES";
                                                    }
                                                    else
                                                    {
                                                        mapped = "NO";
                                                    }

                                                }
                                                else
                                                {
                                                    mapped = "YES";
                                                }
                                                //Get own product and its competitor product
                                                strTbl.Append("<tr>");
                                                strTbl.Append("<td align='left'>" + date + "</td>");
                                                if (!string.IsNullOrEmpty(surName))
                                                {
                                                    strTbl.Append("<td align='left' width='15%'>" + docName + "-" + surName + "</td>");
                                                }
                                                else
                                                {
                                                    strTbl.Append("<td align='left' width='15%'>" + docName + "</td>");
                                                }
                                                strTbl.Append("<td align='left' width='15%'>" + mdlNo + "</td>");//Mdl no
                                                strTbl.Append("<td align='left' width='15%'>" + category + "</td>");//Category
                                                strTbl.Append("<td align='left' width='15%'>" + speciality + "</td>");//Speciality
                                                strTbl.Append("<td align='left' width='15%'>" + localArea + "</td>");//Local area
                                                strTbl.Append("<td align='left' width='15%'>" + hospitalName + "</td>");//Hospital name                                  
                                                if (!string.IsNullOrEmpty(doctoVisitTime))
                                                {
                                                    strTbl.Append("<td align='left' width='15%'>" + doctoVisitTime + "</td>");//Doctor visit time
                                                }
                                                else
                                                {
                                                    strTbl.Append("<td align='left' width='15%'>" + visitMode + "</td>");//Doctor visit time
                                                }

                                                var lstChemist = lstDoctorRcpaDtails.Select(s => s.Chemists_Name).Distinct().ToList();//To get the chemist names

                                                int chemistCount = 0;
                                                for (int i = 0; i < lstChemist.Count(); i++)
                                                {

                                                    var disChemistName = lstDoctorRcpaDtails.AsEnumerable().Where(a => Convert.ToString(a.Chemists_Name) == lstChemist[i]).ToArray();//To get the corresponding chemists for all the doctors.

                                                    if (disChemistName.Length > 0)
                                                    {
                                                        var Chemist = disChemistName.Where(s => s.Chemists_Name != "").FirstOrDefault();
                                                        if (chemistCount > 0)
                                                        {
                                                            strTbl.Append("<td></td>");
                                                            strTbl.Append("<td></td>");
                                                            strTbl.Append("<td></td>");//Mdl no
                                                            strTbl.Append("<td></td>");//Category
                                                            strTbl.Append("<td></td>");//Speciality
                                                            strTbl.Append("<td></td>");//Local area
                                                            strTbl.Append("<td></td>");//Hospital name   
                                                            strTbl.Append("<td></td>");//Doctor visit time
                                                            strTbl.Append("<td align='left' width='15%'>" + Chemist.Chemists_Name + "</td>");//Chemist Name
                                                        }
                                                        else
                                                        {
                                                            strTbl.Append("<td align='left' width='15%'>" + Chemist.Chemists_Name + "</td>");//Chemist Name
                                                        }

                                                        int ownproductCount = 0;
                                                        var distproductcode = disChemistName.Select(s => s.DCR_Product_Code).Distinct().ToList();//To get Product from chemistList
                                                        foreach (var dcrProductcode in distproductcode)
                                                        {
                                                            //Value per day
                                                            double price = 0;
                                                            double totalcomp = 0;
                                                            double totalOwn = 0;
                                                            string pricevalue = string.Empty;

                                                            if (lstRcpaDetailRepts[0].lstProductPrices != null && lstRcpaDetailRepts[0].lstProductPrices.Count > 0)
                                                            {
                                                                var lstProdcutprice = lstRcpaDetailRepts[0].lstProductPrices.Where(s => s.Product_Code == productCode).ToList();
                                                                if (lstProdcutprice != null && lstProdcutprice.Count > 0)
                                                                {
                                                                    price = double.Parse(lstProdcutprice[0].Price.ToString());
                                                                }
                                                                else
                                                                {
                                                                    pricevalue = "N/A";
                                                                    totalownValue = "N/A";
                                                                    totalCompValue = "N/A";
                                                                }
                                                            }

                                                            int compRowcount = 0;
                                                            string productName = string.Empty;
                                                            string ownProductQty = string.Empty;
                                                            var lstOwnandcompetitorproducts = lstDoctorRcpaDtails.Where(s => s.DCR_Product_Code == dcrProductcode && s.Chemists_Name == lstChemist[i]).ToList();
                                                            //var lstOwnandcompetitorproducts = lstDoctorRcpaDtails.Where(s => s.DCR_Product_Code == dcrProductcode).ToList(); Change on  -- 08-05-2017 --
                                                            if (lstOwnandcompetitorproducts != null && lstOwnandcompetitorproducts.Count > 0)
                                                            {
                                                                //Create Own product Details                                             
                                                                var lstOwnproduct = lstOwnandcompetitorproducts.Where(s => (!string.IsNullOrEmpty(s.Product_Code))).FirstOrDefault();
                                                                var lstCompProduct = lstOwnandcompetitorproducts.Where(s => (string.IsNullOrEmpty(s.Product_Code))).FirstOrDefault();
                                                                if (lstOwnproduct != null)
                                                                {
                                                                    productName = (string.IsNullOrEmpty(lstOwnproduct.Own_Product_Name)) ? "" : lstOwnproduct.Own_Product_Name.ToString();
                                                                    ownProductQty = (string.IsNullOrEmpty(lstOwnproduct.Support_Qty)) ? "" : lstOwnproduct.Support_Qty.ToString();


                                                                    if (ownproductCount > 0)
                                                                    {
                                                                        if (pricevalue != "N/A")
                                                                        {
                                                                            if (!string.IsNullOrEmpty(ownProductQty))
                                                                            {
                                                                                totalOwn = double.Parse(ownProductQty) * price;
                                                                            }
                                                                            totalOwnProduct = Math.Round(Convert.ToDouble((totalOwn * 100) / 100), 2);
                                                                            pagewisetotalOwn += totalOwnProduct;
                                                                            totalownValue = totalOwnProduct.ToString();
                                                                        }
                                                                        strTbl.Append("<tr>");
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//date                                                
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Doctor Name                                                               
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Mdl no
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Category
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Speciality
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Local area
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Hospital name                                                
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Doctor Visit Time                                                               
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Chemist Name
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Mapped
                                                                        strTbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                                                               
                                                                        strTbl.Append("<td align='left' width='15%'>" + ownProductQty + "</td>");//My product qty
                                                                        strTbl.Append("<td align='left' width='15%'>" + totalownValue + "</td>");//Value per day for own product                                           
                                                                    }
                                                                    else
                                                                    {
                                                                        if (pricevalue != "N/A")
                                                                        {
                                                                            if (!string.IsNullOrEmpty(ownProductQty))
                                                                            {
                                                                                totalOwn = double.Parse(ownProductQty) * price;
                                                                            }
                                                                            totalOwnProduct = Math.Round(Convert.ToDouble((totalOwn * 100) / 100), 2);
                                                                            pagewisetotalOwn += totalOwnProduct;
                                                                            totalownValue = totalOwnProduct.ToString();
                                                                        }
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Mapped
                                                                        strTbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                                                               
                                                                        strTbl.Append("<td align='left' width='15%'>" + ownProductQty + "</td>");//Own produt qty
                                                                        strTbl.Append("<td align='left' width='15%'>" + totalownValue + "</td>");//Value per day for own product                                             
                                                                    }

                                                                    ownproductCount++;
                                                                }
                                                                else
                                                                {
                                                                    //Get competitor product duriing next page
                                                                    if (string.IsNullOrEmpty(lstCompProduct.Product_Code))
                                                                    {
                                                                        productName = (string.IsNullOrEmpty(lstCompProduct.Own_Product_Name)) ? "" : lstCompProduct.Own_Product_Name.ToString();
                                                                        ownProductQty = (string.IsNullOrEmpty(lstCompProduct.Support_Qty)) ? "" : lstCompProduct.Support_Qty.ToString();
                                                                        if (pricevalue != "N/A")
                                                                        {
                                                                            if (!string.IsNullOrEmpty(ownProductQty))
                                                                            {
                                                                                totalOwn = double.Parse(ownProductQty) * price;
                                                                            }
                                                                            totalOwnProduct = Math.Round(Convert.ToDouble((totalOwn * 100) / 100), 2);
                                                                            pagewisetotalOwn += totalOwnProduct;
                                                                            totalownValue = totalOwnProduct.ToString();
                                                                        }
                                                                        strTbl.Append("<td align='left' width='15%'></td>");//Mapped
                                                                        strTbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                                                   
                                                                        strTbl.Append("<td align='left' width='15%'>" + ownProductQty + "</td>");//Own produt qty
                                                                        strTbl.Append("<td align='left' width='15%'>" + totalownValue + "</td>");//Value per day for own product                                                        
                                                                    }
                                                                }
                                                                //To Create Competitor product
                                                                foreach (var ownandcompprodut in lstOwnandcompetitorproducts)
                                                                {
                                                                    if (string.IsNullOrEmpty(ownandcompprodut.Product_Code))
                                                                    {
                                                                        string competitorProductName = (string.IsNullOrEmpty(ownandcompprodut.Competitor_Product_Name)) ? "" : ownandcompprodut.Competitor_Product_Name.ToString();
                                                                        string competitorqty = (string.IsNullOrEmpty(ownandcompprodut.Com_Qty)) ? "" : ownandcompprodut.Com_Qty.ToString();

                                                                        if (pricevalue != "N/A")
                                                                        {
                                                                            if (!string.IsNullOrEmpty(competitorqty))
                                                                            {
                                                                                totalcomp = double.Parse(competitorqty) * price;
                                                                            }
                                                                            totalComProduct = Math.Round(Convert.ToDouble((totalcomp * 100) / 100), 2);
                                                                            pagewiseTotalComp += totalComProduct;
                                                                            totalCompValue = totalComProduct.ToString();
                                                                        }

                                                                        if (compRowcount > 0)
                                                                        {
                                                                            strTbl.Append("<tr>");
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//date                                                        
                                                                            strTbl.Append("<td align='left' width='15'></td>");//Doctor Name                                                                                                                    
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Mdl no
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Category
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Speciality
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Local area
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Hospital name                                                        
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Doctor Visit Time                                                                   
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Chemist Name
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Mapped
                                                                            strTbl.Append("<td align='left' width='15%'></td>"); //My product Name                                                                
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Own produt qty
                                                                            strTbl.Append("<td align='left' width='15%'></td>");//Value per day for own product  
                                                                            strTbl.Append("<td align='left' width='15%'>" + competitorProductName + "</td>"); // Competitor Product name
                                                                            strTbl.Append("<td align='left' width='15%'>" + competitorqty + "</td>");//Competitor Product Quantity                                                 
                                                                            strTbl.Append("<td align='left' width='15%'>" + totalCompValue + "</td>");//Value per day for comp product
                                                                            strTbl.Append("</tr>");
                                                                        }
                                                                        else
                                                                        {
                                                                            strTbl.Append("<td align='left' width='15%'>" + competitorProductName + "</td>"); // Competitor Product name
                                                                            strTbl.Append("<td align='left' width='15%'>" + competitorqty + "</td>");//Competitor Product Quantity                                                     
                                                                            strTbl.Append("<td align='left' width='15%'>" + totalCompValue + "</td>");//Competitor Product Quantity        
                                                                            strTbl.Append("</tr>");
                                                                        }
                                                                        compRowcount++;
                                                                    }
                                                                }
                                                                if (lstCompProduct == null)
                                                                {
                                                                    strTbl.Append("<td align='left' width='15%'></td>");//Competitor product Name
                                                                    strTbl.Append("<td align='left' width='15%'></td>");//Competitor Produt qty  
                                                                    strTbl.Append("<td align='left' width='15%'></td>");//Comp total quantity
                                                                    strTbl.Append("</tr>");
                                                                }
                                                            }
                                                        }
                                                    }
                                                    chemistCount++;
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                        if (viewinOptions.ToUpper() == "S")
                        {
                            strTbl.Append("<tr style='font-weight:bold;display:none;' id='trlastrow'>");
                            strTbl.Append("<td>Total Value</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td align='left' width='15%'></td>");//own product total value
                            strTbl.Append("<td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td align='left' width='15%'></td>");//competitor total value                                               
                            strTbl.Append("</tr>");
                        }
                        else
                        {
                            strTbl.Append("<tr style='font-weight:bold;' id='trlastrow'>");
                            strTbl.Append("<td>Total Value</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td align='left' width='15%'>" + pagewisetotalOwn + "</td>");//own product total value
                            strTbl.Append("<td>&nbsp;</td><td>&nbsp;</td>");
                            strTbl.Append("<td align='left' width='15%'>" + pagewiseTotalComp + "</td>");//competitor total value                                               
                            strTbl.Append("</tr>");
                        }
                    }
                }
                strTbl.Append("</tbody>");

                if (viewinOptions.ToUpper() == "S")
                {
                    strTbl.Append("<tfoot>");
                    strTbl.Append("<tr>");
                    for (var h = 0; h <= 15; h++)
                    {
                        if (h == 0)
                        {
                            strTbl.Append("<th style='white-space: nowrap;'>Page Wise Total <br /><span id='spnTotal' style='display:none'>ToTal</span></th>");
                        }
                        else if (h == 12)
                        {
                            strTbl.Append("<th><span id='pagWiseOwnTotal'>" + (pagewisetotalOwn) + "</span><br/><span id='spnTotalOwnValue' style='display:none'>" + (pagewisetotalOwn) + "</span></th>");
                        }
                        else if (h == 15)
                        {
                            strTbl.Append("<th><span id='pagWiseCompTotal'>" + (pagewiseTotalComp) + "</span><br/><span id='spnTotalCompValue' style='display:none'>" + (pagewiseTotalComp) + "</span></th>");
                        }
                        else
                        {
                            strTbl.Append("<th ></th>");
                        }
                    }
                    strTbl.Append("</tr>");

                    strTbl.Append("</tfoot>");
                }

                strTbl.Append("</table>");

            }
            if (viewinOptions.ToUpper() == "S")
            {
                StringBuilder strResult = new StringBuilder();
                strResult.Append(strTbl.ToString());
                strResult.Append("^");
                strResult.Append(pagewisetotalOwn.ToString());
                strResult.Append("^");
                strResult.Append(pagewiseTotalComp.ToString());
                return strResult;
            }
            else
            {
                return strTbl;
            }
        }

        public static DataTable GetDistinctRecords(DataTable dt, string[] Columns)
        {
            DataTable dtUniqRecords = new DataTable();
            dtUniqRecords = dt.DefaultView.ToTable(true, Columns);
            return dtUniqRecords;
        }

        public string GetRCBASummaryDetails(FormCollection collection)
        {
            StringBuilder strtbl = new StringBuilder();
            DataSet ds = new DataSet();
            DataTable distproductcode = new DataTable();
            DataRow[] drOwnandcompetitorproducts;
            DataTable dtDoctorlist = new DataTable();
            DataTable drdoctorlist = new DataTable();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            string productCode = collection["product"].ToString();
            string regions = "";
            string[] regionCodedetails = regionCode.Split('^');

            string customerCode = string.Empty;
            string date = string.Empty;
            string userName = string.Empty;
            string regionName = string.Empty;
            string empName = string.Empty;
            string managerName = string.Empty;
            string managerregionName = string.Empty;
            string docName = string.Empty;
            string mdlNo = string.Empty;
            string category = string.Empty;
            string speciality = string.Empty;
            string hospitalName = string.Empty;
            string hospitalClassification = string.Empty;
            string doctoVisitTime = string.Empty;
            string visitMode = string.Empty;
            string chemistName = string.Empty;
            string mapped = string.Empty;
            if (regionCodedetails.Length > 0)
            {
                foreach (string region in regionCodedetails)
                {
                    regions += region + ',';
                }
            }

            if (!string.IsNullOrEmpty(regions))
            {
                regions = regions.TrimEnd(',');
            }

            ds = _objSPData.GetRCBASummaryDetails(companyCode, regions, startDate, endDate, status, productCode, regionCode);

            if (ds != null && ds.Tables.Count > 0)
            {
                strtbl.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblRCPASummary' class='data display datatable' >");
                strtbl.Append("<thead><tr>");
                strtbl.Append("<td align='left' >Date</td>");
                strtbl.Append("<td align='left'>User Name</td>");
                strtbl.Append("<td align='left' >Region Name</td>");
                strtbl.Append("<td align='left'>employee Name</td>");
                strtbl.Append("<td align='left' >Manager Name</td>");
                strtbl.Append("<td align='left'>Manager Region Name</td>");
                strtbl.Append("<td align='left'>Doctor Name</td>");
                strtbl.Append("<td align='left'>MDL Number</td>");

                strtbl.Append("<td align='left'>Category</td>");
                strtbl.Append("<td align='left'>Speciality</td>");

                strtbl.Append("<td align='left'>Hospital Name </td>");
                strtbl.Append("<td align='left'>Hospital Classification</td>");

                strtbl.Append("<td align='left'>Doctor Visit Time</td>");
                strtbl.Append("<td align='left'>Chemist Name</td>");
                strtbl.Append("<td align='left'>Your Product Name</td>");
                strtbl.Append("<td align='left'>Mapped ( Y/N)</td>");
                strtbl.Append("<td align='left'>Own Rx Per Day</td>");
                strtbl.Append("<td align='left'>Own Value Per Day</td>");
                strtbl.Append("<td align='left'>Competitor Name</td>");
                strtbl.Append("<td align='left'>Competitor Rx Per Day</td>");
                strtbl.Append("<td align='left'>Competitor Value Per Day</td>");
                strtbl.Append("</tr></thead>");
                strtbl.Append("<tbody>");
                dtDoctorlist = ds.Tables[0].DefaultView.ToTable(true, "Date");
                double totalOwnProduct = 0;
                double totalComProduct = 0;
                string productCOde = string.Empty;
                string docRegionCode = string.Empty;
                string supportQty = string.Empty;
                string ComQty = string.Empty;

                if (dtDoctorlist != null && dtDoctorlist.Rows.Count > 0)
                {
                    foreach (DataRow doctorName in dtDoctorlist.Rows)
                    {
                        date = "";
                        docName = "";
                        customerCode = "";
                        mdlNo = "";
                        category = "";
                        speciality = "";
                        hospitalName = "";
                        hospitalClassification = "";
                        docRegionCode = "";
                        productCode = "";
                        supportQty = "";
                        ComQty = "";
                        doctoVisitTime = "";
                        visitMode = "";
                        userName = "";
                        regionName = "";
                        empName = "";
                        managerName = "";
                        managerregionName = "";
                        mapped = "";
                        totalComProduct = 0;
                        totalOwnProduct = 0;
                        supportQty = "";
                        ComQty = "";

                        if (!string.IsNullOrEmpty(Convert.ToString(doctorName["Date"])))
                        {
                            drdoctorlist = ds.Tables[0].AsEnumerable().Where(s => Convert.ToString(s["Date"]) == Convert.ToString(doctorName["Date"])).CopyToDataTable(); if (drdoctorlist.Rows.Count > 0)
                            {
                                DataRow drdoctor = drdoctorlist.AsEnumerable().Where(own => Convert.ToString(own["Date"]) != "").FirstOrDefault();
                                date = (drdoctor["Date"] == System.DBNull.Value) ? "" : drdoctor["Date"].ToString();
                                docName = (drdoctor["Customer_Name"] == System.DBNull.Value) ? "" : drdoctor["Customer_Name"].ToString();
                                customerCode = (drdoctor["Customer_Code"] == System.DBNull.Value) ? "" : drdoctor["Customer_Code"].ToString();
                                mdlNo = (drdoctor["MDL_Number"] == System.DBNull.Value) ? "" : drdoctor["MDL_Number"].ToString();
                                category = (drdoctor["Category_Name"] == System.DBNull.Value) ? "" : drdoctor["Category_Name"].ToString();
                                speciality = (drdoctor["Speciality_Name"] == System.DBNull.Value) ? "" : drdoctor["Speciality_Name"].ToString();
                                hospitalName = (drdoctor["Hospital_Name"] == System.DBNull.Value) ? "" : drdoctor["Hospital_Name"].ToString();
                                hospitalClassification = (drdoctor["Hospital_Classification"] == System.DBNull.Value) ? "" : drdoctor["Hospital_Classification"].ToString();
                                docRegionCode = (drdoctor["Region_Code"] == System.DBNull.Value) ? "" : drdoctor["Region_Code"].ToString();
                                productCode = (drdoctor["DCR_Product_Code"] == System.DBNull.Value) ? "" : drdoctor["DCR_Product_Code"].ToString();
                                supportQty = (drdoctor["Support_Qty"] == System.DBNull.Value) ? "" : drdoctor["Support_Qty"].ToString();
                                ComQty = (drdoctor["Com_Qty"] == System.DBNull.Value) ? "" : drdoctor["Com_Qty"].ToString();
                                if (!string.IsNullOrEmpty(drdoctor["Doctor_Visit_Time"].ToString()))
                                {
                                    doctoVisitTime = drdoctor["Doctor_Visit_Time"].ToString();
                                }
                                else
                                {
                                    visitMode = drdoctor["Visit_Mode"].ToString();
                                }
                                chemistName = (drdoctor["Chemists_Name"] == System.DBNull.Value) ? "" : drdoctor["Chemists_Name"].ToString();
                                if (ds.Tables[1].Rows.Count > 0)
                                {
                                    ////User Details                                    
                                    DataRow[] drUserDetails = ds.Tables[1].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == docRegionCode).ToArray();
                                    if (drUserDetails.Length > 0)
                                    {
                                        userName = drUserDetails[0]["User_Name"].ToString();
                                        regionName = drUserDetails[0]["Region_Name"].ToString();
                                        empName = drUserDetails[0]["Employee_Name"].ToString();
                                        managerName = drUserDetails[0]["Manager_Name"].ToString();
                                        managerregionName = drUserDetails[0]["Manager_Region_Name"].ToString();
                                    }
                                    else
                                    {
                                        userName = "";
                                        regionName = "";
                                        empName = "";
                                        managerName = "";
                                        managerregionName = "";
                                    }

                                }
                                else
                                {
                                    userName = "";
                                    regionName = "";
                                    empName = "";
                                    managerName = "";
                                    managerregionName = "";
                                }
                                if (ds.Tables[1].Rows.Count > 0)
                                {
                                    DataRow[] drProductlist = ds.Tables[3].Select("Region_Code='" + docRegionCode + "' AND Customer_Code='" + customerCode + "' AND Product_Code='" + productCode + "'");
                                    if (drProductlist.Length > 0)
                                    {
                                        mapped = "YES";
                                    }
                                    else
                                    {
                                        mapped = "NO";
                                    }

                                }
                                else
                                {
                                    mapped = "YES";
                                }
                                //Value per day
                                double price = 0;
                                double totalcomp = 0;
                                double totalOwn = 0;

                                DataRow[] drProductPrice = ds.Tables[4].Select("Product_Code='" + productCode + "'");
                                if (drProductPrice.Length > 0)
                                {
                                    price = double.Parse(drProductPrice[0]["Price"].ToString());


                                    if (!string.IsNullOrEmpty(supportQty))
                                    {
                                        totalOwn = double.Parse(supportQty) * price;
                                    }
                                    if (!string.IsNullOrEmpty(ComQty))
                                    {
                                        totalcomp = double.Parse(ComQty) * price;
                                    }
                                    totalOwnProduct = Math.Round(Convert.ToDouble((totalOwn * 100) / 100), 2);
                                }
                                totalComProduct = Math.Round(Convert.ToDouble((totalcomp * 100) / 100), 2);
                                //Get own product and its competitor product
                                strtbl.Append("<tr>");
                                strtbl.Append("<td align='left' width='15%'>" + date + "</td>");//date
                                strtbl.Append("<td align='left' width='15%'>" + userName + "</td>");//User Name
                                strtbl.Append("<td align='left' width='15%'>" + regionName + "</td>");//Region Name
                                strtbl.Append("<td align='left' width='15%'>" + empName + "</td>");//Emp Name
                                strtbl.Append("<td align='left' width='15%'>" + managerName + "</td>");//Manager Name
                                strtbl.Append("<td align='left' width='15%'>" + managerregionName + "</td>");//Manager region Name
                                strtbl.Append("<td align='left' ><span onclick='fnDoctor360Popup(\"" + customerCode + "\")' style='text-decoration:underline;cursor:pointer'>" + docName + "</span></td>");
                                strtbl.Append("<td align='left' width='15%'>" + mdlNo + "</td>");//Mdl no
                                strtbl.Append("<td align='left' width='15%'>" + category + "</td>");//Category
                                strtbl.Append("<td align='left' width='15%'>" + speciality + "</td>");//Speciality
                                strtbl.Append("<td align='left' width='15%'>" + hospitalName + "</td>");//Hospital name
                                strtbl.Append("<td align='left' width='15%'>" + hospitalClassification + "</td>");//Hospital classification
                                if (!string.IsNullOrEmpty(doctoVisitTime))
                                {
                                    strtbl.Append("<td align='left' width='15%'>" + doctoVisitTime + "</td>");//Doctor visit time
                                }
                                else
                                {
                                    strtbl.Append("<td align='left' width='15%'>" + visitMode + "</td>");//Doctor visit time
                                }
                                strtbl.Append("<td align='left' width='15%'>" + chemistName + "</td>");//Chemist Name
                                int ownproductCount = 0;
                                distproductcode = drdoctorlist.DefaultView.ToTable(true, "DCR_Product_Code");
                                foreach (DataRow dcrProductcode in distproductcode.Rows)
                                {
                                    int compRowcount = 0;
                                    drOwnandcompetitorproducts = drdoctorlist.AsEnumerable().Where(a => Convert.ToString(a["DCR_Product_Code"]) == Convert.ToString(dcrProductcode["DCR_Product_Code"])).ToArray();
                                    if (drOwnandcompetitorproducts.Length > 0)
                                    {
                                        //Create Own product Details                                        
                                        DataRow drOwnProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["Product_Code"]) != "").FirstOrDefault();
                                        DataRow drCompProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["Product_Code"]) == "").FirstOrDefault();
                                        string productName = drOwnProduct["Own_Product_Name"] == System.DBNull.Value ? "" : drOwnProduct["Own_Product_Name"].ToString();
                                        string ownProductQty = drOwnProduct["Support_Qty"] == System.DBNull.Value ? "" : drOwnProduct["Support_Qty"].ToString();
                                        if (ownproductCount > 0)
                                        {
                                            strtbl.Append("<tr>");
                                            strtbl.Append("<td align='left' width='15%'>" + date + "</td>");//date
                                            strtbl.Append("<td align='left' width='15%'>" + userName + "</td>");//User Name
                                            strtbl.Append("<td align='left' width='15%'>" + regionName + "</td>");//Region Name
                                            strtbl.Append("<td align='left' width='15%'>" + empName + "</td>");//Emp Name
                                            strtbl.Append("<td align='left' width='15%'>" + managerName + "</td>");//Manager Name
                                            strtbl.Append("<td align='left' width='15%'>" + managerregionName + "</td>");//Manager region Name
                                            strtbl.Append("<td align='left' ><span onclick='fnDoctor360Popup(\"" + customerCode + "\")' style='text-decoration:underline;cursor:pointer'>" + docName + "</span></td>");
                                            strtbl.Append("<td align='left' width='15%'>" + mdlNo + "</td>");//Mdl no
                                            strtbl.Append("<td align='left' width='15%'>" + category + "</td>");//Category
                                            strtbl.Append("<td align='left' width='15%'>" + speciality + "</td>");//Speciality
                                            strtbl.Append("<td align='left' width='15%'>" + hospitalName + "</td>");//Hospital name
                                            strtbl.Append("<td align='left' width='15%'>" + hospitalClassification + "</td>");//Hospital classification
                                            if (!string.IsNullOrEmpty(doctoVisitTime))
                                            {
                                                strtbl.Append("<td align='left' width='15%'>" + doctoVisitTime + "</td>");//Doctor visit time
                                            }
                                            else
                                            {
                                                strtbl.Append("<td align='left' width='15%'>" + visitMode + "</td>");//Doctor visit time
                                            }
                                            strtbl.Append("<td align='left' width='15%'>" + chemistName + "</td>");//Chemist Name
                                            strtbl.Append("<td align='left' width='15%'>" + mapped + "</td>");//Mapped
                                            strtbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                                           
                                            strtbl.Append("<td align='center' width='15%'>" + ownProductQty + "</td>");//My product qty
                                            strtbl.Append("<td align='left' width='15%'>" + totalOwnProduct + "</td>");//Value per day for own product                                           
                                        }
                                        else
                                        {
                                            strtbl.Append("<td align='left' width='15%'>" + mapped + "</td>");//Mapped
                                            strtbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                               
                                            strtbl.Append("<td align='center' width='15%'>" + ownProductQty + "</td>");//Own produt qty
                                            strtbl.Append("<td align='left' width='15%'>" + totalOwnProduct + "</td>");//Value per day for own product                                             
                                        }

                                        ownproductCount++;
                                        //To Create Competitor product
                                        foreach (DataRow dr in drOwnandcompetitorproducts)
                                        {
                                            if (string.IsNullOrEmpty(Convert.ToString(dr["Product_Code"])))
                                            {
                                                string competitorProductName = dr["Competitor_Product_Name"] == System.DBNull.Value ? "" : dr["Competitor_Product_Name"].ToString();
                                                string competitorqty = (dr["Com_Qty"] == System.DBNull.Value) ? "" : dr["Com_Qty"].ToString();
                                                if (compRowcount > 0)
                                                {
                                                    strtbl.Append("<tr>");
                                                    strtbl.Append("<td align='left' width='15%'>" + date + "</td>");//date
                                                    strtbl.Append("<td align='left' width='15%'>" + userName + "</td>");//User Name
                                                    strtbl.Append("<td align='left' width='15%'>" + regionName + "</td>");//Region Name
                                                    strtbl.Append("<td align='left' width='15%'>" + empName + "</td>");//Emp Name
                                                    strtbl.Append("<td align='left' width='15%'>" + managerName + "</td>");//Manager Name
                                                    strtbl.Append("<td align='left' width='15%'>" + managerregionName + "</td>");//Manager region Name
                                                    strtbl.Append("<td align='left' ><span onclick='fnDoctor360Popup(\"" + customerCode + "\")' style='text-decoration:underline;cursor:pointer'>" + docName + "</span></td>");
                                                    strtbl.Append("<td align='left' width='15%'>" + mdlNo + "</td>");//Mdl no
                                                    strtbl.Append("<td align='left' width='15%'>" + category + "</td>");//Category
                                                    strtbl.Append("<td align='left' width='15%'>" + speciality + "</td>");//Speciality
                                                    strtbl.Append("<td align='left' width='15%'>" + hospitalName + "</td>");//Hospital name
                                                    strtbl.Append("<td align='left' width='15%'>" + hospitalClassification + "</td>");//Hospital classification
                                                    if (!string.IsNullOrEmpty(doctoVisitTime))
                                                    {
                                                        strtbl.Append("<td align='left' width='15%'>" + doctoVisitTime + "</td>");//Doctor visit time
                                                    }
                                                    else
                                                    {
                                                        strtbl.Append("<td align='left' width='15%'>" + visitMode + "</td>");//Doctor visit time
                                                    }
                                                    strtbl.Append("<td align='left' width='15%'>" + chemistName + "</td>");//Chemist Name
                                                    strtbl.Append("<td align='left' width='15%'>" + mapped + "</td>");//Mapped
                                                    strtbl.Append("<td align='left' width='15%'>" + productName + "</td>"); //My product Name                                                 
                                                    strtbl.Append("<td align='center' width='15%'>" + ownProductQty + "</td>");//Own produt qty
                                                    strtbl.Append("<td align='left' width='15%'>" + totalOwnProduct + "</td>");//Value per day for own product  
                                                    strtbl.Append("<td align='left' width='15%'>" + competitorProductName + "</td>"); // Competitor Product name
                                                    strtbl.Append("<td align='center' width='15%'>" + competitorqty + "</td>");//Competitor Product Quantity                                                 
                                                    strtbl.Append("<td align='left' width='15%'>" + totalComProduct + "</td>");//Value per day for comp product
                                                    strtbl.Append("</tr>");
                                                }

                                                else
                                                {
                                                    strtbl.Append("<td align='left' width='15%'>" + competitorProductName + "</td>"); // Competitor Product name
                                                    strtbl.Append("<td align='center' width='15%'>" + competitorqty + "</td>");//Competitor Product Quantity                                                     
                                                    strtbl.Append("<td align='left' width='15%'>" + totalComProduct + "</td>");//Competitor Product Quantity        
                                                    strtbl.Append("</tr>");
                                                }
                                                compRowcount++;
                                            }
                                        }
                                        if (drCompProduct == null)
                                        {
                                            strtbl.Append("<td align='left' width='15%'></td>");//Competitor product Name
                                            strtbl.Append("<td align='center' width='15%'></td>");//Competitor Produt qty  
                                            strtbl.Append("<td align='left' width='15%'></td>");//Comp total quantity
                                            strtbl.Append("</tr>");
                                        }
                                    }
                                }

                            }
                            //foreach end
                        }
                    }
                }
                strtbl.Append("</tbody>");
                strtbl.Append("</table>");
            }
            return strtbl.ToString();
        }

        public JsonResult GetFieldWorkPlanner(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string regionCodes = "";

            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }
            ds = _objSPData.GetFieldWorkPlanner(companyCode, "''", regionCodes, "'" + regionCode + "'", DateTime.Now.Month.ToString(), DateTime.Now.Year.ToString());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFieldWorkPlannerPopup(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            ds = _objSPData.GetFieldWorkPlannerPopup(companyCode, regionCode, DateTime.Now.Month.ToString(), DateTime.Now.Year.ToString());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRCPADetailPopup(FormCollection collection)
        {

            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string userCode = collection["userCode"].ToString();
            string doctorCode = collection["doctor"].ToString();
            ds = _objSPData.GetRCPADetailPopup(companyCode, regionCode, userCode, doctorCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDoctor360(string doctorCode, string userCode, string regionCode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet ds = _objSPData.GetDoctor360(companyCode, doctorCode, userCode, regionCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        // Day Wise Attendance Report

        public string GetDayWiseAttendanceReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            ds = _objSPData.GetDayWiseAttendanceReport(companyCode, regionCode, startDate, endDate, status);
            return GetDayWiseAttendanceReportTable(ds, startDate, endDate);
        }
        public string GetDayWiseAttendanceReportTable(DataSet ds, string startDate, string endDate)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            DateTime dtStartDate = new DateTime();
            DateTime dtEndDate = new DateTime();
            DateTime dtToday = dtStartDate;

            DateTime currDate = new DateTime();

            DataRow[] dr;
            TimeSpan ts;
            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);
            ts = dtEndDate - dtStartDate;
            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblAttendanceReport' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' width='15%'>User Name</th>");
            tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
            tableContent.Append("<th align='left' width='15%'>Designation</th>");
            tableContent.Append("<th align='left' width='15%'>Region Name</th>");
            tableContent.Append("<th align='left' width='15%'>Division Name</th>");
            tableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
            tableContent.Append("<th align='left' width='15%'>Reporting Manager Territory </th>");

            for (int i = 0; i <= ts.Days; i++)
            {
                tableContent.Append("<th> </th>");
            }
            tableContent.Append("</tr>");
            type.Append("[{ type: 'text' }, { type: 'text' },{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }]");
            //type += ',{ type: "text" },{ type: "date-range" },{ type: "date-range" },{ type: "number-range" },{ type: "date-range" },{ type: "number-range" },{ type: "text" }]';
            tableContent.Append("<tr>");
            tableContent.Append("<th align='left' width='15%'>User Name</th>");
            tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
            tableContent.Append("<th align='left' width='15%'>Designation</th>");
            tableContent.Append("<th align='left' width='15%'>Region Name</th>");
            tableContent.Append("<th align='left' width='15%'>Division Name</th>");
            tableContent.Append("<th align='left' width='15%'>Reporting Manager</th>");
            tableContent.Append("<th align='left' width='15%'>Reporting Manager Territory</th>");

            string divisionName = "", monthName = "", fieldStatus = "";
            DataTable dcrDetailsTable = ds.Tables[0];
            DataTable userDetailTable = ds.Tables[1];
            DataTable divisionDetailTable = ds.Tables[2];
            DataTable holidayDetailTable = ds.Tables[3];
            dtToday = dtStartDate;
            for (var i = 0; i <= ts.Days; i++)
            {
                if (i != 0)
                {
                    dtToday = dtToday.AddDays(Convert.ToDouble(1));
                }
                monthName = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtToday.Month);
                tableContent.Append("<th >" + dtToday.Day.ToString() + " " + monthName.Substring(0, 3) + " " + dtToday.Year.ToString() + " </th>");
            }
            tableContent.Append("</tr></thead>");
            tableContent.Append("<tbody>");
            for (var i = 0; i < userDetailTable.Rows.Count; i++)
            {
                if (userDetailTable.Rows[i]["User_Name"].ToString() != "VACANT")
                {

                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["Employee_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["User_Type_Name"].ToString());
                    tableContent.Append("</td>");

                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["Region_Name"].ToString());
                    tableContent.Append("</td>");


                    if (divisionDetailTable.Rows.Count > 0)
                    {
                        dr = divisionDetailTable.Select("Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "' AND User_Code='" + userDetailTable.Rows[i]["User_Code"].ToString() + "'");
                        divisionName = "";
                        if (dr.Length > 0)
                        {
                            for (var j = 0; j < dr.Length; j++)
                            {
                                divisionName += dr[j]["Division_Name"].ToString() + ",";
                            }

                            if (divisionName != "")
                            {
                                divisionName = divisionName.Substring(0, divisionName.Length - 1);
                            }
                        }
                    }
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(divisionName);
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["Manager_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailTable.Rows[i]["Manager_Region_Name"].ToString());
                    tableContent.Append("</td>");
                    dtToday = dtStartDate;

                    for (var j = 0; j <= ts.Days; j++)
                    {
                        currDate = DateTime.Today.AddDays(-1);
                        if (j != 0)
                        {
                            dtToday = dtToday.AddDays(Convert.ToDouble(1));
                        }

                        var date = dtToday.ToString("dd/MM/yyyy");
                        fieldStatus = "";
                        dr = holidayDetailTable.Select("Holiday_Date='" + date + "' AND Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");

                        if (dr.Length > 0)
                        {
                            fieldStatus += "Hol: " + dr[0]["Holiday_Name"].ToString() + "/";
                        }
                        if (dtToday.DayOfWeek.ToString().ToUpper() == "SUNDAY")
                        {
                            fieldStatus += "Sun/";
                        }
                        dr = dcrDetailsTable.Select("DCR_Actual_Date='" + date + "' AND Region_Code='" + userDetailTable.Rows[i]["Region_Code"].ToString() + "'");

                        if (dr.Length > 0)
                        {
                            for (var k = 0; k < dr.Length; k++)
                            {
                                if (dr[k]["Flag"].ToString().ToUpper() != "LOCKED")
                                {
                                    if (dr[k]["Flag"].ToString() == "F")
                                    {
                                        fieldStatus += "F,";
                                        //tableContent.Append("<td align='left' width='15%'>F</td>");
                                    }
                                    else if (dr[k]["Flag"].ToString() == "A")
                                    {
                                        fieldStatus += "A,";
                                        //tableContent.Append("<td align='left' width='15%'>A</td>");
                                    }
                                    else if (dr[k]["Flag"].ToString() == "L")
                                    {
                                        fieldStatus += dr[k]["Leave_Type_Name"].ToString() + ",";
                                        //tableContent.Append("<td align='left' width='15%'>" + dJson[0].Leave_Type_Name + "</td>");
                                    }
                                }
                                else
                                {
                                    if (dr[k]["Lock_Type"].ToString().ToUpper() == "LOCK_LEAVE")
                                    {
                                        fieldStatus = "Locked,";
                                    }
                                    else
                                    {
                                        fieldStatus = "-";
                                    }

                                }

                            }
                            if (fieldStatus != "")
                            {
                                fieldStatus = fieldStatus.TrimEnd(',');
                            }
                            tableContent.Append("<td align='left' width='15%'>");
                            tableContent.Append(fieldStatus);
                            tableContent.Append("</td>");

                        }
                        else
                        {

                            if (fieldStatus != "")
                            {
                                fieldStatus = fieldStatus.TrimEnd('/');
                                tableContent.Append("<td align='left' width='15%'>");
                                tableContent.Append(fieldStatus);
                                tableContent.Append("</td>");
                            }
                            else
                            {

                                int result = DateTime.Compare(dtToday, currDate);
                                if (result <= 0)
                                {
                                    tableContent.Append("<td align='left' width='15%'>");
                                    tableContent.Append("-");
                                    tableContent.Append("</td>");
                                }
                                else
                                {
                                    tableContent.Append("<td align='left' width='15%'>");
                                    //12.9.3 
                                    tableContent.Append("-");
                                    tableContent.Append("</td>");

                                }
                            }


                        }
                    }

                    tableContent.Append("</tr>");

                }
                else
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td></td>");
                    tableContent.Append("<td></td>");
                    tableContent.Append("<td><b>This region is presently vacant/Not Assigned and hence no user data found<b></td>");
                    tableContent.Append("<td>" + userDetailTable.Rows[i]["Region_Name"].ToString() + "</td>");
                    tableContent.Append("<td></td>");
                    tableContent.Append("<td></td>");
                    for (int x = 0; x <= ts.Days; x++)
                    {
                        tableContent.Append("<td> </td>");
                    }
                    tableContent.Append("<td>");
                    tableContent.Append("</td>");
                    tableContent.Append("</tr>");
                }
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>^");
            tableContent.Append(type);
            return tableContent.ToString();
        }


        // Day wise field report

        public string GetDayWiseFieldReport(FormCollection collection)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder strUserInfo = new StringBuilder();
            StringBuilder strField = new StringBuilder();
            try
            {
                DataSet ds = new DataSet();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string regionCode = collection["regionCode"].ToString();
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();
                string status = collection["status"].ToString();
                string divisionCode = "";
                string divisioName = "";
                string startTime = collection["startTime"].ToString();
                DataSet dsDivision = new DataSet();

                dsDivision = _objSPData.GetUserDivisionDetails(companyCode, regionCode);

                foreach (DataRow dr in dsDivision.Tables[0].Rows)
                {
                    divisionCode += "'" + dr["Division_Code"].ToString() + "',";
                    divisioName += "" + dr["Division_Name"].ToString() + ",";

                }
                if (!string.IsNullOrEmpty(divisionCode))
                {
                    divisionCode = divisionCode.TrimEnd(',');
                    divisioName = divisioName.TrimEnd(',');
                }
                //DataSet dsParentRegion = new DataSet();
                //dsParentRegion = _objSPData.dsParentRegion(companyCode, regionCode);
                //if (dsParentRegion.Tables[0].Rows.Count > 0)
                //{
                //    foreach (DataRow dr in dsParentRegion.Tables[0].Rows)
                //    {
                //        parentregionCode += "'" + dr["Region_Code"].ToString() + "',";
                //    }
                //}

                //if (!string.IsNullOrEmpty(parentregionCode))
                //{
                //    parentregionCode = parentregionCode.TrimEnd(',');
                //}
                //else
                //{
                //    parentregionCode = "''";
                //}
                BL_Report objReport = new BL_Report();
                ds = objReport.GetDayWiseFieldReport(companyCode, "", regionCode, startDate, endDate, status.Replace("'", "").Replace(',', '^') + "^");

                //ds = _objSPData.GetDayWiseFieldReport(companyCode, "''", "'" + regionCode + "'", startDate, endDate, status, parentregionCode, divisionCode);
                DataTable dt = new DataTable();
                dt.Columns.Add("Field");
                dt.Columns.Add("Attendance");
                dt.Columns.Add("Holiday");
                dt.Columns.Add("Sunday");
                dt.Columns.Add("Leave");
                objActivity.SetActivityCount("", "'" + regionCode + "'", startDate, endDate, status);
                if (ds.Tables[0].Rows.Count > 0 && ds.Tables.Count > 0)
                {
                    int intSundaysCount = Convert.ToInt16(objActivity.GetSundayCount(ds.Tables[0].Rows[0]["User_Code"].ToString()));
                    int holiday = Convert.ToInt16(objActivity.GetHolidayCount(ds.Tables[0].Rows[0]["User_Code"].ToString(), regionCode, startDate, endDate, status, "COUNT"));
                    double Leave = objActivity.GetFlagCount(ds.Tables[0].Rows[0]["User_Code"].ToString(), 'L');
                    double fieldCount = objActivity.GetFlagCount(ds.Tables[0].Rows[0]["User_Code"].ToString(), 'F');
                    double attendance = objActivity.GetFlagCount(ds.Tables[0].Rows[0]["User_Code"].ToString(), 'A');
                    DataRow dataRow = dt.NewRow();
                    dataRow["Field"] = fieldCount.ToString();
                    dataRow["Attendance"] = attendance.ToString();
                    dataRow["Holiday"] = holiday.ToString();
                    dataRow["Sunday"] = intSundaysCount.ToString();
                    dataRow["Leave"] = Leave.ToString();
                    dt.Rows.Add(dataRow);
                    ds.Tables.Add(dt);
                    ds.AcceptChanges();

                }
                else
                {

                    DataRow dataRow = dt.NewRow();
                    dataRow["Field"] = "0";
                    dataRow["Attendance"] = "0";
                    dataRow["Holiday"] = "0";
                    dataRow["Sunday"] = "0";
                    dataRow["Leave"] = "0";
                    dt.Rows.Add(dataRow);
                    ds.Tables.Add(dt);
                    ds.AcceptChanges();
                }


                // DataControl.JSONConverter json = new DataControl.JSONConverter();
                // return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

                var total = 0;
                double chemistPob = 0;
                double stockiestPob = 0.0;
                double docPob = 0;
                double docVisitCount = 0;
                double totalStockiestPobAmount = 0.0;
                double totalChemistPop = 0.0;
                double totalDoctorPob = 0.0;
                int[] intCategory = new int[ds.Tables[5].Rows.Count];
                int totalunlistedDoc = 0;
                int totalDoctmet = 0;
                int totalMorningMet = 0;
                int totalEveningMet = 0;
                int totalChemistMet = 0;
                int totalStockiestMet = 0;
                int rcpaTotal = 0;
                double fieldExpamount = 0.0;
                double attendExpAmount = 0.0;
                double totalfieldExpamount = 0.0, totalattendExpAmount = 0.0;
                double totalownpro = 0.0;
                double totalcomproduct = 0.0;
                string day = string.Empty, month = string.Empty, workedWith = string.Empty;
                StringBuilder strDivision = new StringBuilder();
                // $("#divReport").html('');
                // $("#divReportHeader").html('');

                //  strUserInfo.Append("<lable><b>1.Doctor Visit Average</b> – Grand Total of Doctors Met / Field Days (Assuming 0.5 logic is already in place while calculating Field Days)</lable><br>");
                // strUserInfo.Append("<lable><b>2.Chemist Visit Average</b>- Grand Total of Chemist Met / Field Days (Assuming 0.5 logic is already in place while calculating Field Days)</lable>");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    #region user info
                    strUserInfo.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblHeader' >");
                    strUserInfo.Append("<thead><tr>");
                    strUserInfo.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
                    strUserInfo.Append("<tbody>");
                    strUserInfo.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' >" + ds.Tables[0].Rows[0]["User_Name"] + "</td>");
                    strUserInfo.Append("<td align='left' ><b>Employee Name</b></td><td align='left' >" + ds.Tables[0].Rows[0]["Employee_Name"] + "</td></tr>");
                    strUserInfo.Append("<tr><td align='left'><b>Desiganation<b/></td><td align='left' >" + ds.Tables[0].Rows[0]["User_Type_Name"] + "</td>");
                    strUserInfo.Append("<td align='left'><b>Region Name</b></td><td align='left' >" + ds.Tables[0].Rows[0]["Region_Name"] + "</td></tr>");

                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        DataRow[] drRegion;
                        drRegion = ds.Tables[1].AsEnumerable().Where(a => a["Region_Code"].ToString() == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();

                        if (drRegion.Length > 0)
                        {
                            for (var j = 0; j < drRegion.Length; j++)
                            {
                                strDivision.Append(drRegion[j]["Division_Name"].ToString() + ",");
                            }

                        }

                    }

                    strUserInfo.Append("<tr><td align='left'><b>Division Name</b></td><td align='left' >" + divisioName + "</td>");
                    strUserInfo.Append("<td></td><td></td></tr>");

                    strUserInfo.Append("<tr><td align='left' ><b>Reporting To Manager Name</b></td><td align='left' >" + ds.Tables[0].Rows[0]["Manager_Name"].ToString() + "</td>");
                    strUserInfo.Append("<td align='left' ><b>Reporting To Region</b></td><td align='left' >" + ds.Tables[0].Rows[0]["Manager_Region_Name"] + "</td></tr>");


                    strUserInfo.Append("<tr><td align='left' ><b>Date Period</b></td><td align='left' >" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + " To "
                        + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + "</td><td></td><td></td></tr>");

                    strUserInfo.Append("</tbody>");
                    strUserInfo.Append("</table>");
                    #endregion user info
                    // $("#divReportHeader").html(tableContent);

                    //  tableContent = "";
                    // Summary Date Wise data binding
                    #region report table content
                    tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDetails' >");
                    tableContent.Append("<thead>");
                    tableContent.Append(" <tr>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>User Name</th>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>Employee Name</th>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>Region Name</th>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>Division Name</th>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>Date Period</th>");
                    tableContent.Append("<th style='display:none' align='left' width='15%'>Manager's Name</th>");
                    tableContent.Append("<th align='left' width='15%'>Date</th>");
                    tableContent.Append("<th align='left' width='15%'>Activity</th>");
                    tableContent.Append("<th align='left' width='15%'>Activity Name</th>");
                    tableContent.Append("<th align='left' width='15%'>Remarks</th>");
                    tableContent.Append("<th align='left' width='15%'>Worked With</th>");
                    tableContent.Append("<th align='left' width='15%'>Place of Work</th>");
                    for (var i = 0; i < ds.Tables[5].Rows.Count; i++)
                    {
                        intCategory[i] = 0;
                        tableContent.Append("<th align='center' width='15%'>" + ds.Tables[5].Rows[i]["Category_Name"].ToString() + "</th>");
                    }
                    tableContent.Append("<th align='center' width='15%'>Unlisted Doctor(s) Met</th>");
                    tableContent.Append("<th align='center' width='15%'>Total Doctor(s) Met</th>");
                    tableContent.Append("<th align='center' width='15%'>Doctor(s) Met in Morning</th>");
                    tableContent.Append("<th align='center' width='15%'>Doctor(s) Met in Evening</th>");

                    tableContent.Append("<th align='center' width='15%'>Doctor Cumulative POB</th>");
                    tableContent.Append("<th align='center' width='15%'>Doctor Average POB</th>");

                    tableContent.Append("<th align='center' width='15%'>Chemist(s) Met</th>");
                    tableContent.Append("<th align='center' width='15%'>POB</th>");
                    tableContent.Append("<th align='center' width='15%'>Stockist(s) Met</th>");
                    tableContent.Append("<th align='center' width='15%'>Stockist POB</th>");

                    tableContent.Append("<th align='center' width='15%'>No of Drs Covered in RCPA </th>");
                    tableContent.Append("<th align='center' width='15%'>Own Brand Total Value</th>");
                    tableContent.Append("<th align='center' width='15%'>Competitor Brand Total Value</th>");
                    tableContent.Append("<th align='center' width='15%'>Expense Amount</th>");
                    tableContent.Append("<th align='center' width='15%'>DCR Submitted Date</th>");
                    tableContent.Append("<th align='center' width='15%'>DCR Status</th>");
                    tableContent.Append("<th align='center' width='15%'>Approved/Unapproved Date</th>");


                    tableContent.Append("</tr>");
                    tableContent.Append("</thead>");
                    tableContent.Append("<tbody>");
                    DateTime start = DateTime.Parse(startDate);
                    DateTime end = DateTime.Parse(endDate);

                    for (DateTime counter = start; counter <= end; counter = counter.AddDays(1))
                    {
                        string sunday = string.Empty;
                        if (counter.DayOfWeek.ToString().ToUpper() == "SUNDAY")
                        {
                            sunday = "Sunday";
                        }


                        chemistPob = 0;
                        stockiestPob = 0.0;
                        docPob = 0;
                        docVisitCount = 0;
                        string date = Convert.ToDateTime(counter.Date).ToString("dd/MM/yyyy"); //counter.Date + "/" + counter.Month + "/" + counter.Year;
                        DataRow[] drHoliday;
                        drHoliday = ds.Tables[8].AsEnumerable().Where(a => a["Holiday_Date"].ToString() == date).ToArray();
                        if (drHoliday.Length > 0)
                        {
                            sunday = "Holiday";
                        }

                        string sdate = date.Split('/')[2] + "-" + date.Split('/')[1] + "-" + date.Split('/')[0];
                        DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                        List<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail> lstDetails = new List<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail>();
                        lstDetails = (List<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail>)_objReport.GetfieldworkRCPADetail(companyCode, ds.Tables[0].Rows[0]["User_Code"].ToString(), sdate, status.Replace("'", "").Replace(',', '^') + "^").ToList();



                        List<MVCModels.HiDoctor_Reports.rcpa> lstRcpa = lstDetails[0].lstRcpa;
                        List<MVCModels.HiDoctor_Reports.DaywiseExpenseDetail> lstExpDetails = lstDetails[0].lstExpdetail;
                        List<MVCModels.HiDoctor_Reports.DcrMasterDetails> lstDCRMasterDetails = lstDetails[0].lstmasterDetails;
                        List<MVCModels.HiDoctor_Reports.ProductValue> lstRcpaownProduct = lstDetails[0].lstRcpaProduct;


                        DateTime timeObj;
                        if (startTime.Trim() != "")
                        {
                            timeObj = Convert.ToDateTime("2001/01/01 " + startTime);
                            // var timeObj = Date.parse("2001/01/01 " + $('#txtStartTime').val());
                        }
                        else
                        {
                            timeObj = Convert.ToDateTime("2001/01/01 00:00 PM");
                        }

                        DataRow[] drDcrDate = ds.Tables[2].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();
                        // var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.DCR_Date=='" + date + "')]");
                        if (drDcrDate.Length > 0)
                        {
                            for (var k = 0; k < drDcrDate.Length; k++)
                            {
                                if (drDcrDate[k]["Flag"].ToString().ToUpper() == "FIELD")
                                {
                                    tableContent.Append("<tr>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["User_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Employee_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Region_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + strDivision.ToString() + "</td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + " To "
                                        + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Manager_Name"] + " </td>");
                                    tableContent.Append("<td align='left' >" + date + "</td>");

                                    if (sunday != "")
                                    {
                                        tableContent.Append("<td align='left' >" + drDcrDate[k]["Flag"] + "/" + sunday + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' >" + drDcrDate[k]["Flag"] + "</td>");
                                    }
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' >-</td>");


                                    workedWith = "";

                                    if (Convert.ToString(drDcrDate[k]["Acc1"]) != null && Convert.ToString(drDcrDate[k]["Acc1"]) != "")
                                    {
                                        workedWith = drDcrDate[k]["Acc1"] + ",";
                                    }
                                    if (Convert.ToString(drDcrDate[k]["Acc2"]) != null && Convert.ToString(drDcrDate[k]["Acc2"]) != "")
                                    {
                                        workedWith += drDcrDate[k]["Acc2"] + ",";
                                    }

                                    if (Convert.ToString(drDcrDate[k]["Acc3"]) != null && Convert.ToString(drDcrDate[k]["Acc3"]) != "")
                                    {
                                        workedWith += drDcrDate[k]["Acc3"] + ",";
                                    }

                                    if (Convert.ToString(drDcrDate[k]["Acc4"]) != null && Convert.ToString(drDcrDate[k]["Acc4"]) != "")
                                    {
                                        workedWith += Convert.ToString(drDcrDate[k]["Acc4"]) + ",";
                                    }
                                    if (workedWith != "")
                                    {
                                        workedWith = workedWith.Substring(0, workedWith.Length - 1);
                                    }
                                    tableContent.Append("<td align='left' >" + workedWith + "</td>");

                                    if (Convert.ToString(drDcrDate[k]["Place_Worked"]) != "" && Convert.ToString(drDcrDate[k]["Place_Worked"]) != null)
                                    {

                                        tableContent.Append("<td align='left' >" + Convert.ToString(drDcrDate[k]["Place_Worked"]) + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' ></td>");
                                    }
                                    DataRow[] dr;
                                    // Category Wise doctor
                                    int catgoryCount = 0;
                                    for (var i = 0; i < ds.Tables[5].Rows.Count; i++)
                                    {
                                        catgoryCount = intCategory[i];
                                        dr = ds.Tables[3].AsEnumerable().Where(z => z["DCR_Date"].ToString() == date
                                                                            && z["Category"].ToString() == ds.Tables[5].Rows[i]["Category_Code"].ToString()).ToArray();
                                        //var dJsondoc = jsonPath(jsData, "$.Tables[3].Rows[?(@.DCR_Date=='" + date + "' & @.Category=='" + jsData.Tables[5].Rows[i].Category_Code + "')]");
                                        catgoryCount += Convert.ToInt32(dr.Length);
                                        if (dr.Length > 0)
                                        {
                                            tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='center' >0</td>");
                                        }
                                        intCategory[i] = catgoryCount;
                                    }


                                    dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date && (a["Category"].ToString() == "null"
                                        || a["Category"].ToString() == "")).ToArray();
                                    // var dJsonUndoc = jsonPath(jsData, "$.Tables[3].Rows[?(@.DCR_Date=='" + date + "' & @.Category=='null' | @.Category=='']");
                                    if (dr.Length > 0)
                                    {
                                        totalunlistedDoc += Convert.ToInt32(dr.Length);
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0</td>");

                                    }
                                    dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();
                                    //var dJsonVCdoc = jsonPath(jsData, "$.Tables[3].Rows[?(@.DCR_Date=='" + date + "')]");
                                    if (dr.Length > 0)
                                    {
                                        docVisitCount = dr.Length;
                                        totalDoctmet += Convert.ToInt32(docVisitCount);
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0</td>");
                                    }



                                    if (startTime.Trim() == "")
                                    {
                                        // Morning meet
                                        dr = ds.Tables[3].AsEnumerable().Where(z => z["DCR_Date"].ToString() == date && z["Visit_Mode"].ToString() == "AM").ToArray();
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");

                                        totalMorningMet += Convert.ToInt32(dr.Length);

                                        // Evening Meet
                                        dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date && a["Visit_Mode"].ToString() == "PM").ToArray();
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                        totalEveningMet += Convert.ToInt32(dr.Length);
                                    }
                                    else // based on time entered
                                    {
                                        // Morning meet
                                        int mrgCount = 0;

                                        // Mrg count when visit time is not null
                                        dr = ds.Tables[3].AsEnumerable().Where(z => z["DCR_Date"].ToString() == date && Convert.ToDateTime("2001/01/01 " + (z["Doctor_Visit_Time"].ToString().Replace(".", ":").ToUpper().Replace(";", ":").ToUpper().Replace("AM", "").Replace("PM", "")) + " " + z["Visit_Mode"].ToString()) <= timeObj && z["Doctor_Visit_Time"].ToString() != "").ToArray();
                                        mrgCount = dr.Length;

                                        // mrg count when visit time is null
                                        dr = ds.Tables[3].AsEnumerable().Where(z => z["DCR_Date"].ToString() == date && z["Visit_Mode"].ToString() == "AM" && z["Doctor_Visit_Time"].ToString() == "").ToArray();
                                        mrgCount += dr.Length;

                                        tableContent.Append("<td align='center' >" + mrgCount + "</td>");
                                        totalMorningMet += mrgCount;
                                        // Evening Meet
                                        int eveningCount = 0;
                                        // Evening count when visit time is not null
                                        dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date && Convert.ToDateTime("2001/01/01 " + (a["Doctor_Visit_Time"].ToString().Replace(".", ":").ToUpper().Replace(";", ":").ToUpper().Replace("AM", "").Replace("PM", "")) + " " + a["Visit_Mode"].ToString()) > timeObj && a["Doctor_Visit_Time"].ToString() != "").ToArray();
                                        eveningCount = dr.Length;

                                        // Evening count when visit time is null
                                        dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date && a["Visit_Mode"].ToString() == "PM" && a["Doctor_Visit_Time"].ToString() == "").ToArray();
                                        eveningCount += dr.Length;
                                        totalEveningMet += eveningCount;
                                        tableContent.Append("<td align='center' >" + eveningCount + "</td>");
                                    }


                                    //Doctor Cumulative POB
                                    dr = ds.Tables[3].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();
                                    // var dJsonPoBdoc = jsonPath(jsData, "$.Tables[3].Rows[?(@.DCR_Date=='" + date + "')]");
                                    if (dr.Length > 0)
                                    {
                                        for (var u = 0; u < dr.Length; u++)
                                        {
                                            if (Convert.ToString(dr[u]["PO_Amount"]) != null && Convert.ToString(dr[u]["PO_Amount"]) != "")
                                            {

                                                docPob += Convert.ToDouble(dr[u]["PO_Amount"]);
                                            }
                                        }
                                        tableContent.Append("<td align='center' ><span onclick='fnDoctorPOBDetails(\"" + ds.Tables[0].Rows[0]["Region_Code"] + "_"
                                            + counter.Year + "-" + counter.Month + "-" + counter.Day + "_" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + "_" + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + "\")' style='text-decoration:underline;cursor:pointer;color:blue'>"
                                            + docPob.ToString("N2") + "</span></td>");


                                        // tableContent.Append("<td align='center' >" + docPob + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0.0</td>");
                                    }


                                    if (docPob > 0)
                                    {
                                        totalDoctorPob += docPob;
                                        tableContent.Append("<td align='center' >" + (Convert.ToDouble(docPob / docVisitCount)).ToString("N2") + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0</td>");
                                    }
                                    dr = ds.Tables[4].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();

                                    // var dJsonChdoc = jsonPath(jsData, "$.Tables[4].Rows[?(@.DCR_Date=='" + date + "')]");
                                    if (dr.Length > 0)
                                    {
                                        totalChemistMet += Convert.ToInt32(dr.Length);
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                        for (var u = 0; u < dr.Length; u++)
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(dr[u]["PO_Amount"])))
                                            {
                                                chemistPob += Convert.ToDouble(dr[u]["PO_Amount"]);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0</td>");
                                    }
                                    if (chemistPob > 0)
                                    {
                                        totalChemistPop += chemistPob;
                                        // tableContent.Append("<td align='center' >" + chemistPob.ToString("N2") + "</td>");

                                        tableContent.Append("<td align='center' ><span onclick='fnChemistPOBDetails(\"" + ds.Tables[0].Rows[0]["Region_Code"] + "_"
                                           + counter.Year + "-" + counter.Month + "-" + counter.Day + "_" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + "_" + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + "\")' style='text-decoration:underline;cursor:pointer;color:blue'>"
                                           + chemistPob.ToString("N2") + "</span></td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0.0</td>");
                                    }
                                    dr = ds.Tables[6].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();
                                    //  var dJsonStdoc = jsonPath(jsData, "$.Tables[6].Rows[?(@.DCR_Date=='" + date + "')]");
                                    if (dr.Length > 0)
                                    {
                                        totalStockiestMet += Convert.ToInt32(dr.Length);
                                        tableContent.Append("<td align='center' >" + dr.Length + "</td>");
                                        for (var u = 0; u < dr.Length; u++)
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(dr[u]["PO_Amount"])))
                                            {
                                                stockiestPob += Convert.ToDouble(dr[u]["PO_Amount"]);
                                            }
                                        }
                                        //  tableContent.Append("<td align='center' >" + dr.Length + "</td></tr>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0</td>");
                                    }
                                    if (stockiestPob > 0)
                                    {
                                        totalStockiestPobAmount += stockiestPob;
                                        // tableContent.Append("<td align='center' >" + stockiestPob.ToString("N2") + "</td></tr>");

                                        tableContent.Append("<td align='center' ><span onclick='fnStockiestPOBDetails(\"" + ds.Tables[0].Rows[0]["Region_Code"] + "_"
                                           + counter.Year + "-" + counter.Month + "-" + counter.Day + "_" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + "_" + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + "\")' style='text-decoration:underline;cursor:pointer;color:blue'>"
                                           + stockiestPob.ToString("N2") + "</span></td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >0.0</td>");
                                    }

                                    double ownproduct = 0.0;
                                    double comproduct = 0.0;
                                    if (lstRcpaownProduct != null && lstRcpaownProduct.Count > 0)
                                    {
                                        foreach (var pro in lstRcpaownProduct)
                                        {
                                            ownproduct += Convert.ToDouble(pro.Own_Product);
                                            comproduct += Convert.ToDouble(pro.Com_Product);

                                        }
                                    }

                                    totalownpro += ownproduct;
                                    totalcomproduct += comproduct;

                                    if (lstRcpa.Count > 0)
                                    {
                                        rcpaTotal += Convert.ToInt32(lstRcpa[0].RcpaCount.ToString());
                                    }
                                    fieldExpamount = 0.0;
                                    if (lstExpDetails.Count > 0)
                                    {
                                        for (int i = 0; i < lstExpDetails.Count; i++)
                                        {
                                            if (drDcrDate[k]["Flag"].ToString().ToUpper().Substring(0, 1) == lstExpDetails[i].Flag)
                                            {
                                                fieldExpamount += Convert.ToDouble(lstExpDetails[i].Expense_Detail_Amount);
                                            }
                                        }
                                    }


                                    tableContent.Append("<td align='center' >" + lstRcpa[0].RcpaCount + "</td>");
                                    if (ownproduct > 0)
                                    {
                                        tableContent.Append("<td align='center' >" + ownproduct + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >N/A</td>");
                                    }
                                    if (comproduct > 0)
                                    {
                                        tableContent.Append("<td align='center' >" + comproduct + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' >N/A</td>");
                                    }
                                    if (lstExpDetails.Count > 0)
                                    {

                                        tableContent.Append("<td align='center' >" + fieldExpamount + "</td>");
                                        totalfieldExpamount += fieldExpamount;
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' ></td>");

                                    }
                                    if (lstDCRMasterDetails.Count > 0)
                                    {
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].DCR_Entered_Date + "</td>");
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].DCR_Status + "</td>");
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].Approved_Date + "</td></tr>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' ></td>");
                                        tableContent.Append("<td align='left' ></td>");
                                        tableContent.Append("<td align='left' ></td></tr>");
                                    }

                                }
                                else
                                {
                                    attendExpAmount = 0.0;
                                    tableContent.Append("<tr>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["User_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Employee_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Region_Name"] + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + strDivision + "</td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + " To "
                                        + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + " </td>");
                                    tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Manager_Name"] + " </td>");
                                    tableContent.Append("<td align='left' >" + date + "</td>");
                                    if (sunday != "")
                                    {
                                        tableContent.Append("<td align='left' >" + drDcrDate[k]["Flag"] + "/" + sunday + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' >" + drDcrDate[k]["Flag"] + "</td>");
                                    }

                                    string activitynamec = string.Empty;
                                    if (drDcrDate[k]["Flag"].ToString().ToUpper() == "ATTENDANCE")
                                    {
                                        DataRow[] drActivity = ds.Tables[10].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date && a["Flag"].ToString() == "A").ToArray();
                                        //var dactivityJson = jsonPath(jsData, "$.Tables[10].Rows[?(@.DCR_Date=='" + date + "')]");
                                        if (drActivity.Length > 0)
                                        {

                                            for (var t = 0; t < drActivity.Length; t++)
                                            {
                                                activitynamec += Convert.ToString(drActivity[t]["Activity_Name"]) + ",";
                                            }
                                            activitynamec = activitynamec.TrimEnd(',');
                                            tableContent.Append("<td align='center' >" + activitynamec + "</td>");
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='center' ></td>");
                                        }

                                        string activityremarks = string.Empty;
                                        DataRow[] drRemarks;
                                        drRemarks = ds.Tables[10].AsEnumerable().Where(a => a["DCR_Date"].ToString() == date).ToArray();
                                        //var dactivityremarksJson = jsonPath(jsData, "$.Tables[10].Rows[?(@.DCR_Date=='" + date + "')]");
                                        if (drRemarks.Length > 0)
                                        {

                                            for (var u = 0; u < drRemarks.Length; u++)
                                            {
                                                if (Convert.ToString(drRemarks[u]["Remarks"]) != null && Convert.ToString(drRemarks[u]["Remarks"]) != "")
                                                {
                                                    activityremarks += Convert.ToString(drRemarks[u]["Remarks"]) + ",";
                                                }
                                                else
                                                {
                                                    activityremarks += "";
                                                }
                                            }

                                            activityremarks = activityremarks.TrimEnd(',');
                                            tableContent.Append("<td align='left' style='word-wrap: break-word;' >" + activityremarks + "</td>");
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='left' >-</td>");
                                        }
                                    }
                                    else
                                    {
                                        tableContent.Append("<td></td>");//Activity Name
                                        tableContent.Append("<td></td>");//Remarks
                                    }
                                    tableContent.Append("<td align='left' ></td>");
                                    if (Convert.ToString(drDcrDate[k]["Place_Worked"]) != "" && Convert.ToString(drDcrDate[k]["Place_Worked"]) != null)
                                    {

                                        tableContent.Append("<td align='left' >" + Convert.ToString(drDcrDate[k]["Place_Worked"]) + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' ></td>");
                                    }
                                    for (var i = 0; i < ds.Tables[5].Rows.Count; i++)
                                    {
                                        tableContent.Append("<td align='left' ></td>");
                                    }


                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='center' ></td>");
                                    tableContent.Append("<td align='center' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='center' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    tableContent.Append("<td align='left' ></td>");
                                    //Showing expense amount,dcr date,status and approved date values
                                    if (lstExpDetails.Count > 0)
                                    {
                                        for (int i = 0; i < lstExpDetails.Count; i++)
                                        {
                                            if (drDcrDate[k]["Flag"].ToString().ToUpper().Substring(0, 1) == lstExpDetails[i].Flag)
                                            {
                                                attendExpAmount += Convert.ToDouble(lstExpDetails[i].Expense_Detail_Amount);
                                            }
                                        }
                                        if (drDcrDate[k]["Flag"].ToString().ToUpper().Substring(0, 1) != "L")
                                        {
                                            tableContent.Append("<td align='center' >" + attendExpAmount + "</td>");
                                            totalattendExpAmount += attendExpAmount;
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='center'></td>");
                                        }
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='center' ></td>");

                                    }
                                    if (lstDCRMasterDetails.Count > 0)
                                    {
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].DCR_Entered_Date + "</td>");
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].DCR_Status + "</td>");
                                        tableContent.Append("<td align='center' >" + lstDCRMasterDetails[k].Approved_Date + "</td>");
                                    }
                                    else
                                    {
                                        tableContent.Append("<td align='left' ></td>");
                                        tableContent.Append("<td align='left' ></td>");
                                        tableContent.Append("<td align='left' ></td>");
                                    }

                                    tableContent.Append("</tr>");

                                }
                            }

                        }
                        else
                        {
                            tableContent.Append("<tr>");
                            tableContent.Append("<td style='display:none' align='left'>" + ds.Tables[0].Rows[0]["User_Name"] + " </td>");
                            tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Employee_Name"] + " </td>");
                            tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Region_Name"] + " </td>");
                            tableContent.Append("<td style='display:none' align='left' >" + strDivision.ToString() + "</td>");
                            tableContent.Append("<td style='display:none' align='left' >" + Convert.ToDateTime(startDate).ToString("dd-MM-yyyy") + " To "
                                + Convert.ToDateTime(endDate).ToString("dd-MM-yyyy") + " </td>");
                            tableContent.Append("<td style='display:none' align='left' >" + ds.Tables[0].Rows[0]["Manager_Name"] + " </td>");
                            tableContent.Append("<td align='left' >" + date + "</td>");
                            tableContent.Append("<td align='left' >" + sunday + "</td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            for (var m = 0; m < ds.Tables[5].Rows.Count; m++)
                            {
                                tableContent.Append("<td align='left' ></td>");
                            }
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='center' ></td>");
                            tableContent.Append("<td align='center' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            tableContent.Append("<td align='left' ></td>");
                            //Showing expense amount,dcr date,status and approved date values
                            tableContent.Append("<td align='left' >0.00</td>");
                            //expamount += 0.00;
                            if (lstDCRMasterDetails.Count > 0)
                            {
                                tableContent.Append("<td align='center' >" + lstDCRMasterDetails[0].DCR_Entered_Date + "</td>");
                                tableContent.Append("<td align='center' >" + lstDCRMasterDetails[0].DCR_Status + "</td>");
                                tableContent.Append("<td align='center' >" + lstDCRMasterDetails[0].Approved_Date + "</td></tr>");
                            }
                            else
                            {
                                tableContent.Append("<td align='left' ></td>");
                                tableContent.Append("<td align='left' ></td>");
                                tableContent.Append("<td align='left' ></td></tr>");
                            }
                        }

                    }
                    // Total 
                    tableContent.Append("<tr>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;'  align='left'></td>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;' align='left' ></td>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;' align='left' ></td>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;' align='left' ></td>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;' align='left' ></td>");
                    tableContent.Append("<td style='display:none;background-color:lightblue;' align='left' ></td>");
                    tableContent.Append("<td align='left' style='background-color:lightblue;'></td>");
                    tableContent.Append("<td align='left' style='background-color:lightblue;'></td>");
                    tableContent.Append("<td align='left' style='background-color:lightblue;'></td>");
                    tableContent.Append("<td align='left' style='background-color:lightblue;'></td>");

                    tableContent.Append("<td align='left' style='background-color:lightblue;'></td>");
                    tableContent.Append("<td align='left' style='background-color:lightblue;font-weight: bold;'>Total</td>");
                    for (var m = 0; m < ds.Tables[5].Rows.Count; m++)
                    {
                        tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + intCategory[m].ToString() + "</td>");
                    }
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalunlistedDoc + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalDoctmet + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalMorningMet + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalEveningMet + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalDoctorPob.ToString("N2") + "</td>");
                    if (double.IsNaN(((Convert.ToDouble(totalDoctorPob)) / Convert.ToDouble(totalDoctmet))))
                    {
                        tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + 0.0 + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + ((Convert.ToDouble(totalDoctorPob)) / Convert.ToDouble(totalDoctmet)).ToString("N2") + "</td>");
                    }
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalChemistMet + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalChemistPop.ToString("N2") + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalStockiestMet + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalStockiestPobAmount.ToString("N2") + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + rcpaTotal + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalownpro + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + totalcomproduct + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'>" + (totalattendExpAmount + totalfieldExpamount) + "</td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'></td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'></td>");
                    tableContent.Append("<td align='center' style='background-color:lightblue;font-weight: bold;'></td></tr>");

                    tableContent.Append("</tbody>");
                    tableContent.Append("</table>");
                    #endregion report table content
                    //  $("#divReport").html(tableContent);
                    // $("#divPrint").html(tableContent);
                    #region details

                    var totalFieldDays = 0.0;
                    var avg = 0.0;
                    strField.Append("<div><span>*Summary data calculation applicable for Applied and Approved DCRs only.</span></div>");
                    strField.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSummary' >");
                    strField.Append("<thead><tr>");
                    strField.Append("<th align='left' width='15%'>Summary</th>");
                    strField.Append("<th align='left' width='15%'>Details</th>");
                    strField.Append("</tr></thead>");
                    strField.Append("<tbody>");

                    strField.Append("<tr><td align='left' >Total days</td>");
                    strField.Append("<td align='left' >" + ((end - start).TotalDays + 1) + "</td></tr>");

                    strField.Append("<tr><td align='left' >Field</td>");

                    if (ds.Tables[12].Rows.Count > 0)
                    {
                        totalFieldDays = Convert.ToDouble(ds.Tables[12].Rows[0]["Field"]);

                        strField.Append("<td align='left' >" + ds.Tables[12].Rows[0]["Field"] + "</td></tr>");
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");

                    }

                    strField.Append("<tr><td align='left' >Attendance</td>");
                    if (ds.Tables[12].Rows.Count > 0)
                    {

                        strField.Append("<td align='left' >" + ds.Tables[12].Rows[0]["Attendance"] + "</td></tr>");
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");

                    }

                    strField.Append("<tr><td align='left' >Leave</td>");
                    if (ds.Tables[12].Rows.Count > 0)
                    {
                        strField.Append("<td align='left' >" + ds.Tables[12].Rows[0]["Leave"] + "</td></tr>");
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");

                    }

                    strField.Append("<tr><td align='left' >Holidays</td>");
                    if (ds.Tables[12].Rows.Count > 0)
                    {
                        strField.Append("<td align='left' >" + ds.Tables[12].Rows[0]["Holiday"] + "</td></tr>");
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");

                    }
                    avg = 0.0;
                    strField.Append("<tr><td align='left' >Doctor Visit Average</td>");
                    if (ds.Tables[3].Rows.Count > 0)
                    {
                        if (totalFieldDays > 0)
                        {
                            avg = (Convert.ToDouble(ds.Tables[3].Rows.Count) / totalFieldDays);
                            strField.Append("<td align='left' >" + Math.Round(Convert.ToDouble((avg * 100) / 100), 2) + "</td></tr>");
                        }
                        else
                        {
                            strField.Append("<td align='left' >0</td></tr>");
                        }
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");
                    }
                    avg = 0.0;
                    strField.Append("<tr><td align='left' >Chemist  Visit Average</td>");
                    if (ds.Tables[7].Rows.Count > 0)
                    {
                        if (totalFieldDays > 0)
                        {
                            avg = (Convert.ToDouble(totalChemistMet) / totalFieldDays);
                            strField.Append("<td align='left' >" + Math.Round(((avg * 100) / 100), 2) + "</td></tr>");
                        }
                        else
                        {
                            strField.Append("<td align='left' >0</td></tr>");
                        }
                    }
                    else
                    {
                        strField.Append("<td align='left' >0</td></tr>");
                    }

                    //strField.Append("<tr><td align='left' >Avg Products Sampled</td>");

                    //avg = 0.0;
                    //if (ds.Tables[9].Rows.Count > 0)
                    //{

                    //    avg = (Convert.ToDouble(ds.Tables[9].Rows.Count) / totalFieldDays);

                    //    strField.Append("<td align='left' >" + Math.Round(Convert.ToDouble((avg * 100) / 100), 2) + "</td></tr>");
                    //}
                    //else
                    //{
                    //    strField.Append("<td align='left' >0</td></tr>");
                    //}
                    //avg = 0.0;
                    //strField.Append("<tr><td align='left' >Avg Products Detailed</td>");
                    //DataRow[] drDetailed;
                    //drDetailed = ds.Tables[9].AsEnumerable().Where(a => a["Is_Detailed"].ToString() == "1").ToArray();
                    //// var dJson = jsonPath(jsData, "$.Tables[9].Rows[?(@.Is_Detailed=='1')]");
                    //if (drDetailed.Length > 0)
                    //{
                    //    avg = (Convert.ToDouble(drDetailed.Length) / totalFieldDays);
                    //    strField.Append("<td align='left' >" + Math.Round(Convert.ToDouble((avg * 100) / 100), 2) + "</td></tr>");
                    //}
                    //else
                    //{
                    //    strField.Append("<td align='left' >0</td></tr>");
                    //}

                    strField.Append("</tbody>");
                    strField.Append("</table>");
                    #endregion details
                }
            }
            catch (Exception ex)
            {
            }
            return strUserInfo.ToString() + "$" + tableContent.ToString() + "$" + strField.ToString();
        }


        public JsonResult GetChildRegionType(FormCollection collection)
        {
            try
            {
                string regionCode = collection["regionCode"].ToString();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetChildRegionsType '" + _objcurrentInfo.GetCompanyCode() + "', '" + regionCode + "'");
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // DOCTOR PRODUCT MAPPING

        public string GetDoctorProductMapping(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string category = collection["category"].ToString();
            string levelOne = collection["leveOne"].ToString();
            string levelTwo = collection["levelTwo"].ToString();

            string divisionName = "", tableContentSub = "";
            int targetCount = 0, mappedDoctor = 0;
            ArrayList alLevelOne = new ArrayList();
            StringBuilder tableContent = new StringBuilder();

            DataRow[] drFilter;
            DataRow[] subFilter;

            string[] categoryList = category.ToString().Split('^');

            string regionCodes = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                    if (levelOne.ToString().Trim() == dr["Region_Type_Code"].ToString().Trim())
                    {
                        alLevelOne.Add(dr["Region_Code"].ToString());
                    }
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            if (alLevelOne.Count > 0)
            {

                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorProductMapping' >");
                tableContent.Append("<thead>");
                tableContentSub = "";
                tableContent.Append("<tr>");
                tableContent.Append("<th style='width:150px'>User Name</th>");
                tableContent.Append("<th style='width:350px'>Employee Name</th>");
                tableContent.Append("<th style='width:350px'>Region Name</th>");
                tableContent.Append("<th style='width:350px'>Division Name</th>");
                tableContent.Append("<th style='width:350px'>Reporting manager</th>");
                tableContent.Append("<th style='width:350px'>Manager Territory name</th>");

                tableContentSub += "<tr>";
                tableContentSub += "<th style='width:150px'>User Name</th>";
                tableContentSub += "<th style='width:350px'>Employee Name</th>";
                tableContentSub += "<th style='width:350px'>Region Name</th>";
                tableContentSub += "<th style='width:350px'>Division Name</th>";
                tableContentSub += "<th style='width:350px'>Reporting manager</th>";
                tableContentSub += "<th style='width:350px'>Manager Territory name</th>";

                ds = _objSPData.GetDoctorProductMapping(companyCode, "''", regionCodes);

                string[] regionWiseCheCount = new string[ds.Tables[2].Rows.Count];
                string[] regionTargetCount = new string[ds.Tables[2].Rows.Count];
                string[] regionDeviationCount = new string[ds.Tables[2].Rows.Count];
                string[] regionMappedCount = new string[ds.Tables[2].Rows.Count];


                int i = 0;
                int categoryCount = 0, tempCount = 0;
                string type = "[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }, { type: 'text' }";
                foreach (DataRow dr in ds.Tables[2].Rows)
                {

                    tableContentSub += "<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Count </th>";
                    tableContentSub += "<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Target Count </th>";
                    tableContentSub += "<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Doctors Mapped </th>";
                    tableContentSub += "<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Deviation </th>";

                    tableContent.Append("<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Count </th>");
                    tableContent.Append("<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Target Count </th>");
                    tableContent.Append("<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Doctors Mapped </th>");
                    tableContent.Append("<th style='width:150px'>" + dr["Category_Name"].ToString() + "  Deviation </th>");
                    type += ", { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }, { type: 'number-range' }";
                    regionWiseCheCount[i] = "0";
                    regionTargetCount[i] = "0";
                    regionDeviationCount[i] = "0";
                    regionMappedCount[i] = "0";
                    i++;
                }
                tableContentSub += "</tr>";
                tableContent.Append("</tr >" + tableContentSub + "");
                type += "]";

                tableContent.Append("</thead></tbody>");


                foreach (string region in alLevelOne)
                {
                    dsChildRegion = new DataSet();
                    dsChildRegion = _objSPData.dsChildRegion(companyCode, region);
                    if (dsChildRegion.Tables[0].Rows.Count > 0)
                    {
                        i = 0;
                        foreach (DataRow drs in dsChildRegion.Tables[0].Rows)
                        {
                            if (levelTwo.ToString().Trim() == drs["Region_Type_Code"].ToString().Trim())
                            {
                                drFilter = ds.Tables[3].Select("Region_Code='" + drs["Region_Code"].ToString() + "'");
                                if (drFilter.Length > 0)
                                {
                                    divisionName = "";
                                    tableContent.Append("<tr >");
                                    tableContent.Append("<td align='left' width='15%'>" + drFilter[0]["User_Name"].ToString() + "</td>");
                                    tableContent.Append("<td align='left' width='15%'>" + drFilter[0]["Employee_Name"].ToString() + "</td>");
                                    tableContent.Append("<td align='left' width='15%'>" + drFilter[0]["Region_Name"].ToString() + "</td>");
                                    subFilter = ds.Tables[4].Select("Region_Code='" + drs["Region_Code"].ToString() + "'");
                                    if (subFilter.Length > 0)
                                    {
                                        foreach (DataRow drSub in subFilter)
                                        {
                                            divisionName += drSub["Division_Name"].ToString() + ",";
                                        }
                                        if (!string.IsNullOrEmpty(divisionName))
                                        {
                                            divisionName = divisionName.TrimEnd(',');
                                        }
                                    }
                                    tableContent.Append("<td align='left' width='15%'>" + divisionName + "</td>");
                                    tableContent.Append("<td align='left' width='15%'>" + drFilter[0]["Manager_Name"].ToString() + "</td>");
                                    tableContent.Append("<td align='left' width='15%'>" + drFilter[0]["Manager_Region_Name"].ToString() + "</td>");
                                    i = 0;
                                    foreach (DataRow dr in ds.Tables[2].Rows)
                                    {
                                        categoryCount = 0;
                                        tempCount = 0;
                                        subFilter = ds.Tables[0].Select("Region_Code='" + drs["Region_Code"].ToString() + "' AND Category='" + dr["Category_Code"].ToString() + "'");
                                        if (subFilter.Length > 0)
                                        {
                                            if (!string.IsNullOrEmpty(subFilter[0]["Count"].ToString()))
                                            {
                                                tableContent.Append("<td align='left' width='15%'>" + subFilter[0]["Count"].ToString() + "</td>");
                                                categoryCount = Convert.ToInt32(subFilter[0]["Count"].ToString());
                                            }
                                            else
                                            {
                                                tableContent.Append("<td align='left' width='15%'>0</td>");
                                            }
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='left' width='15%'>0</td>");
                                        }
                                        tempCount = categoryCount + Convert.ToInt32(regionWiseCheCount[i].ToString());
                                        regionWiseCheCount[i] = tempCount.ToString();

                                        targetCount = 0;
                                        tempCount = 0;
                                        foreach (string categoryDoc in categoryList)
                                        {
                                            if (categoryDoc.Split('_')[0].ToString() == dr["Category_Code"].ToString())
                                            {
                                                if (categoryDoc.Split('_')[1].ToString() != "")
                                                {
                                                    targetCount = Convert.ToInt32(categoryDoc.Split('_')[1]);
                                                }
                                                else
                                                {
                                                    targetCount = 0;
                                                }
                                            }
                                        }

                                        tempCount = targetCount + Convert.ToInt32(regionTargetCount[i].ToString());
                                        regionTargetCount[i] = tempCount.ToString();

                                        tableContent.Append("<td align='left' width='15%'>" + targetCount + "</td>");
                                        tempCount = 0;
                                        mappedDoctor = 0;
                                        subFilter = ds.Tables[1].Select("Region_Code='" + drs["Region_Code"].ToString() + "' AND Category='" + dr["Category_Code"].ToString() + "'");
                                        if (subFilter.Length > 0)
                                        {
                                            if (!string.IsNullOrEmpty(subFilter[0]["Count"].ToString()))
                                            {
                                                // tableContent.Append("<td align='left' width='15%'>" + subFilter[0]["Count"].ToString() + "</td>");

                                                tableContent.Append("<td align='left' width='8%'><span onclick='fnMappedDoctorDetails(\"" + drs["Region_Code"].ToString() + "_" + dr["Category_Code"].ToString() + "_" + drFilter[0]["User_Code"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>" + subFilter[0]["Count"].ToString() + "</span></td>");
                                                mappedDoctor = Convert.ToInt32(subFilter[0]["Count"].ToString());
                                            }
                                            else
                                            {
                                                tableContent.Append("<td align='left' width='15%'>0</td>");
                                            }
                                        }
                                        else
                                        {
                                            tableContent.Append("<td align='left' width='15%'>0</td>");
                                        }


                                        tempCount = 0;
                                        tempCount = mappedDoctor + Convert.ToInt32(regionMappedCount[i].ToString());
                                        regionMappedCount[i] = tempCount.ToString();

                                        tableContent.Append("<td align='left' width='15%'>" + (targetCount - mappedDoctor) + "</td>");

                                        tempCount = 0;
                                        tempCount = (targetCount - mappedDoctor) + Convert.ToInt32(regionDeviationCount[i].ToString());
                                        regionDeviationCount[i] = tempCount.ToString();
                                        i++;

                                    }
                                    tableContent.Append("</tr>");
                                }
                            }

                            // Manager Detailed                
                        }

                        drFilter = ds.Tables[3].Select("Region_Code='" + region + "'");
                        if (drFilter.Length > 0)
                        {
                            divisionName = "";
                            tableContent.Append("<tr  >");
                            tableContent.Append("<td align='left' width='15%'  style='background-color:lightblue;'>" + drFilter[0]["User_Name"].ToString() + "</td>");
                            tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + drFilter[0]["Employee_Name"].ToString() + "</td>");
                            tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + drFilter[0]["Region_Name"].ToString() + "</td>");
                            subFilter = ds.Tables[4].Select("Region_Code='" + drFilter[0]["Region_Code"].ToString() + "'");
                            if (subFilter.Length > 0)
                            {
                                foreach (DataRow drSub in subFilter)
                                {
                                    divisionName += drSub["Division_Name"].ToString() + ",";
                                }
                                if (!string.IsNullOrEmpty(divisionName))
                                {
                                    divisionName = divisionName.TrimEnd(',');
                                }
                            }
                            tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + divisionName + "</td>");
                            tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + drFilter[0]["Manager_Name"].ToString() + "</td>");
                            tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + drFilter[0]["Manager_Region_Name"].ToString() + "</td>");


                            i = 0;
                            foreach (DataRow dr in ds.Tables[2].Rows)
                            {
                                tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + regionWiseCheCount[i].ToString() + "</td>");
                                tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + regionTargetCount[i].ToString() + "</td>");
                                tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + regionMappedCount[i].ToString() + "</td>");
                                tableContent.Append("<td align='left' width='15%' style='background-color:lightblue;'>" + regionDeviationCount[i].ToString() + "</td>");

                                regionWiseCheCount[i] = "0";
                                regionTargetCount[i] = "0";
                                regionDeviationCount[i] = "0";
                                regionMappedCount[i] = "0";
                                i++;
                            }
                            tableContent.Append("</tr>");

                        }
                    }
                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>^" + type + "");
            }

            return tableContent.ToString();
        }

        public JsonResult GetLastSubmittedData(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            //string category = collection["category"].ToString();
            string levelOne = collection["firstLevel"].ToString();
            string levelTwo = collection["secondLevel"].ToString();
            string startMonth = collection["startMonth"].ToString();
            string endMonth = collection["endMonth"].ToString();
            string startYear = collection["startYear"].ToString();
            string endYear = collection["endYear"].ToString();
            string category = collection["category"].ToString();
            string regionTypeCode = collection["regionTypeCode"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetLastSubmittedData(companyCode, startMonth, endMonth, startYear, endYear, regionCode, category, regionTypeCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChildregions(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDoctorProductMappingPopup(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string categorycode = collection["category"].ToString();
            ds = _objSPData.GetDoctorProductMappingPopup(companyCode, regionCode, categorycode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserMenuAccess(FormCollection collection)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetUserMenuScreen '" + _objcurrentInfo.GetCompanyCode() + "', '" + _objcurrentInfo.GetUserTypeCode() + "'");
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetExpenseMasterReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string userTypeCode = collection["userType"].ToString();
            string regionClassif = collection["rClassifi"].ToString();
            string regionCodes = "", noClassifi = "", classficationCode = "", regionClass = "";

            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            string[] classific = regionClassif.ToString().Split('^');
            foreach (string classif in classific)
            {
                if (!string.IsNullOrEmpty(classif))
                {
                    if (classif.ToString() == "NoClassification")
                    {
                        noClassifi = "NO";
                    }
                    else
                    {
                        classficationCode = "'" + classif + "',";
                    }
                }
            }

            if (!string.IsNullOrEmpty(classficationCode))
            {
                classficationCode = classficationCode.TrimEnd(',');
            }
            else
            {
                classficationCode = "''";
            }
            if (noClassifi == "NO")
            {
                regionClass = "(etm.Region_Classification_Code IN (" + classficationCode + ") OR etm.Region_Classification_Code IS NULL)";
            }
            else
            {
                regionClass = "etm.Region_Classification_Code IN (" + classficationCode + ")";
            }
            ds = _objSPData.GetExpenseMasterReport(companyCode, regionCodes, userTypeCode, regionClass);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetExpenseReportHeader(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdExpenseReportHeader '" + _objcurrentInfo.GetCompanyCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //@ Leave Report Get All User For UserTree 
        public JsonResult Getusermaster(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_GetUserDetails");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //@ Leave Report windows  binding dataset method Start here
        public string GetLeaveReport(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                StringBuilder strMainTB = new StringBuilder();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = collection["userCode"].ToString();
                string startDate = collection["startDate"].ToString();
                string endDate = collection["endDate"].ToString();
                string viewType = collection["viewType"].ToString();
                string title = collection["title"].ToString();

                string childUserCode = "";
                double openingBalance = 0, leaveTaken = 0, closingBalance = 0;

                DateTime dtStartDate = new DateTime();
                dtStartDate = Convert.ToDateTime(startDate);

                ds = _objSPData.GetLeaveReport(companyCode, userCode, startDate, endDate, DateTime.Now.Year + "-01-01", dtStartDate.AddDays(-1).ToString("yyyy-MM-dd"));

                DataRow[] dRow;
                strMainTB.Append("<div class='dvHeader dvheader-inner'>" + "Leave Report for - " + title + ", the period of " + startDate + " " + "to" + " " + endDate + "</div>");
                strMainTB.Append("<table width='100%' cellspacing='0' cellpadding='0' class='data display datatable' id=tblLeavereport>");
                strMainTB.Append("<thead><tr ><th colspan='5'></th>");
                foreach (DataRow row in ds.Tables[1].Rows)
                {
                    strMainTB.Append("<th colspan='3'  align='center'>" + row["Leave_Type_Name"].ToString() + "</th>");
                }
                strMainTB.Append("</tr>");
                strMainTB.Append("<tr><th>User Name</th><th>User Type</th><th>Region Name</th><th>Employee Name</th><th>Employee Number</th>");
                foreach (DataRow row in ds.Tables[1].Rows)
                {
                    strMainTB.Append("<th>Opening Balance</th>");
                    strMainTB.Append("<th>Leave Taken</th>");
                    strMainTB.Append("<th>Closing Balance</th>");
                }

                strMainTB.Append("</tr></thead>");
                strMainTB.Append("<tbody>");

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    childUserCode = ds.Tables[0].Rows[i]["User_Code"].ToString();
                    strMainTB.Append("<tr><td>" + ds.Tables[0].Rows[i]["User_Name"] + "</td>");
                    strMainTB.Append("<td>" + ds.Tables[0].Rows[i]["User_Type_Name"] + "</td>");
                    strMainTB.Append("<td>" + ds.Tables[0].Rows[i]["Region_Name"] + "</td>");
                    strMainTB.Append("<td>" + ds.Tables[0].Rows[i]["Employee_Name"] + "</td>");
                    strMainTB.Append("<td>" + ds.Tables[0].Rows[i]["Employee_Number"] + "</td>");
                    foreach (DataRow row in ds.Tables[1].Rows)
                    {
                        //Opening balance
                        openingBalance = 0;
                        dRow = ds.Tables[2].Select("User_Code='" + childUserCode + "' And Leave_Type_Code='" + row["Leave_Type_Code"].ToString() + "'");
                        if (dRow.Length > 0)
                        {
                            openingBalance = Convert.ToDouble(dRow[0]["Opening_Balance"].ToString());
                        }

                        leaveTaken = 0;
                        dRow = ds.Tables[4].Select("User_Code='" + childUserCode + "' And Leave_Type_Code='" + row["Leave_Type_Code"].ToString() + "'");
                        if (dRow.Length != 0)
                        {
                            leaveTaken = Convert.ToDouble(dRow[0]["LeaveTaken"].ToString());
                        }

                        if (openingBalance > 0)
                        {
                            openingBalance = openingBalance - leaveTaken;
                            strMainTB.Append("<td align='center'>" + openingBalance + "</td>");
                        }
                        else
                        {
                            strMainTB.Append("<td align='center'>0</td>");
                        }

                        // Leave taken
                        leaveTaken = 0;
                        dRow = ds.Tables[3].Select("User_Code='" + childUserCode + "' And Leave_Type_Code='" + row["Leave_Type_Code"].ToString() + "'");
                        if (dRow.Length != 0)
                        {
                            leaveTaken = Convert.ToDouble(dRow[0]["LeaveTaken"].ToString());
                        }

                        strMainTB.Append("<td align='center'>" + leaveTaken + "</td>");

                        // Closing balance
                        closingBalance = 0;
                        if (openingBalance > 0)
                        {
                            closingBalance = openingBalance - leaveTaken;
                            strMainTB.Append("<td align='center'>" + closingBalance + "</td>");
                        }
                        else
                        {
                            strMainTB.Append("<td align='center'>0</td>");
                        }
                    }
                    strMainTB.Append("</tr>");
                }

                strMainTB.Append("</tbody></table>");

                if (viewType == "SCREEN")
                {
                    return strMainTB.ToString();
                }
                else
                {
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objcurrentInfo.GetUserName();
                    string compCode = _objcurrentInfo.GetCompanyCode();

                    string fileName = "ALL_INDIA_LEAVE_REPORT" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(strMainTB.ToString(), accKey, fileName, "bulkdatasvc");

                    return "<a href='" + blobUrl + "'>Click here to Download.</a>";
                }
            }
            catch
            {
                throw;
            }
        }

        public string GetDoctorStatisticsReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            string Month = collection["Month"].ToString();
            string Year = collection["Year"].ToString();
            string title = collection["title"].ToString();
            string divisionName = "", day = "", monthName = "", mdlNumber = "", colorCode = "";
            string surName = string.Empty;
            int plannedVisit = 0, deviation = 0, Totalvisit = 0;
            BL_Report objReport = new BL_Report();
            ds = objReport.GetDoctorStatisticsReport_WithCalc(companyCode, regionCode, "''", Month, Year, status);
            StringBuilder tableContent = new StringBuilder();

            Regex regExInt = new Regex("^([0-9]*)$");
            DateTime dtStartDate = new DateTime();
            DateTime dtEndDate = new DateTime();

            TimeSpan ts;
            DataRow[] dr;
            DataRow[] subFilter;
            DataRow[] drFilter;
            //DataTable dt = new DataTable();

            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);
            ts = dtEndDate - dtStartDate;

            DateTime dtDCRDate = dtStartDate;

            string seleceddcrstatus = "";
            switch (status)
            {
                case "1^2^0^":
                    seleceddcrstatus = "Applied,Approved,Unapproved";
                    break;
                case "1^":
                    seleceddcrstatus = "Applied";
                    break;
                case "0^":
                    seleceddcrstatus = "Unapproved";
                    break;
                case "2^":
                    seleceddcrstatus = "Approved";
                    break;
                case "1^2^":
                    seleceddcrstatus = "Applied,Approved";
                    break;
                case "1^0^":
                    seleceddcrstatus = "Applied,Unapproved";
                    break;
                case "2^0^":
                    seleceddcrstatus = "Approved,Unapproved";
                    break;
                default: break;
            }

            if (ds.Tables[2].Rows.Count > 0)
            {
                //Lable Added  
                tableContent.Append("<lable style='text-decoration: underline;'>Notes:</lable>");
                tableContent.Append("<div>");
                tableContent.Append("<Lable>1)<span style='font-weight:bold;'>Total Visits</span> - Is the number of visits for the doctor calculated from the DCRs entered.</Lable><br/>");
                tableContent.Append("<Lable>2)<span style='font-weight:bold;'>Planned Visits</span> - Is the number of visits planned for the doctor in TP.</Lable><br/>");
                tableContent.Append("<Lable>3)<span style='font-weight:bold;'>Deviation</span> - Is the difference between the number of visits planned and total visits made.</Lable><br/>");
                tableContent.Append("<lable>4)<span style='font-weight:bold;font-size:17px;'>*</span>- Is the Actuals are less than the planned numbers.</lable><br/>");
                tableContent.Append("<lable>5)<span style='font-weight:bold;font-size:17px;'>#</span>- Is the Actuals are more than the planned numbers.</lable><br/>");
                tableContent.Append("</div><br>");

                //Bind Report Name

                tableContent.Append("<div><b style='font-weight:bold;font-size:17px;font-style:italic;'>" + title + " report generate on " + DateTime.Now.ToString() + "</b></div><br>");


                // Bind Header 
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblHeader' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' colspan='6' >User Details</th>");
                tableContent.Append("<th>");
                tableContent.Append("<div class='helpIconRpt'>");
                tableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('DOCTOR_STATICSTICS_REPORT')\" />");
                tableContent.Append("</div>");
                tableContent.Append("</th></tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr><td align='left' >User Name</td><td align='left' >" + ds.Tables[2].Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' >Region Name</td><td align='left' >" + ds.Tables[2].Rows[0]["Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' >Date Period</td><td align='left' >" + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " To " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</td></tr>");

                tableContent.Append("<tr><td align='left' >Employee Name</td><td align='left' >" + ds.Tables[2].Rows[0]["Employee_Name"].ToString() + "</td>");

                if (ds.Tables[3].Rows.Count > 0)
                {
                    divisionName = "";
                    var lstfilter = (from DataRow dRow in ds.Tables[3].Rows select new { Division_Name = dRow["Division_Name"] }).Distinct().ToArray();
                    if (lstfilter.Length > 0)
                    {
                        for (var s = 0; s < lstfilter.Length; s++)
                        {
                            divisionName += lstfilter[s].Division_Name.ToString() + ',';
                        }
                        if (divisionName != "")
                        {
                            divisionName = divisionName.Substring(0, divisionName.Length - 1);
                        }
                    }
                }

                //if (ds.Tables[3].Rows.Count > 0)
                //{

                //    dr = ds.Tables[3].Select("Region_Code='" + ds.Tables[2].Rows[0]["Region_Code"].ToString() + "'");
                //    divisionName = "";
                //    if (dr.Length > 0)
                //    {
                //        for (var j = 0; j < dr.Length; j++)
                //        {
                //            divisionName += dr[j]["Division_Name"].ToString() + ",";
                //        }

                //        if (divisionName != "")
                //        {
                //            divisionName = divisionName.Substring(0, divisionName.Length - 1);
                //        }
                //    }
                //}
                tableContent.Append("<td align='left' >Division Name</td><td align='left' >" + divisionName + "</td>");
                tableContent.Append("<td align='left' >Manager's Name</td><td align='left' >" + ds.Tables[2].Rows[0]["Manager_Name"].ToString() + "</td></tr>");
                tableContent.Append("<tr><td align='left'>Selected Status</td><td align='left' colspan='5'>" + seleceddcrstatus + "</td></tr>");
                tableContent.Append("</tbody>");
                tableContent.Append("</table>@");
                //  Details

                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorStatistics' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th style='display:none' align='left' width='15%'>Region Name</th>");
                tableContent.Append("<th style='display:none' align='left' width='15%'>Employee Name</th>");
                tableContent.Append("<th style='display:none' align='left' width='15%'>Date Period</th>");
                tableContent.Append("<th style='display:none' align='left' width='15%'>Division Name</th>");
                tableContent.Append("<th style='display:none' align='left' width='15%'>Manager's Name</th>");
                tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
                tableContent.Append("<th align='left' width='15%'>Mdl Number</th>");
                tableContent.Append("<th align='left' width='15%'>Specialty Name</th>");
                tableContent.Append("<th align='left' width='15%'>Local Area</th>");
                tableContent.Append("<th align='left' width='15%'>Hospital Name</th>");
                tableContent.Append("<th align='left' width='15%'>Category Name</th>");
                tableContent.Append("<th align='left' width='15%'>Actual Visits</th>");
                tableContent.Append("<th align='left' width='15%'>Planned Visits</th>");
                tableContent.Append("<th align='left' width='15%'>Deviation</th>");
                for (int i = 0; i <= ts.Days; i++)
                {
                    if (i != 0)
                    {
                        dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                    }
                    day = dtDCRDate.Day.ToString();
                    monthName = GetMonthName(Convert.ToInt32(dtDCRDate.Month));
                    tableContent.Append("<td align='left'>" + day + "-" + monthName + "-" + dtDCRDate.Year + "</td>");
                }
                tableContent.Append("</tr></thead>");
                tableContent.Append("<tbody>");

                foreach (DataRow drs in ds.Tables[4].Rows)
                {
                    Totalvisit = 0;
                    surName = "";

                    IEnumerable<DataRow> drr = ds.Tables[0].AsEnumerable().Where(z => Convert.ToString(z["Doctor_Code"]) == drs["Doctor_Code"].ToString());

                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='center' > " + ds.Tables[2].Rows[0]["User_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='center' style='display:none' > " + ds.Tables[2].Rows[0]["Region_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='center' style='display:none'> " + ds.Tables[2].Rows[0]["Employee_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='center' style='display:none'> " + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " To " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</td>");
                    tableContent.Append("<td align='center' style='display:none'> " + divisionName + "</td>");
                    tableContent.Append("<td align='center' style='display:none'> " + ds.Tables[2].Rows[0]["Manager_Name"].ToString() + "</td>");
                    surName = drs["Sur_Name"].ToString();
                    if (!string.IsNullOrEmpty(surName))
                    {
                        tableContent.Append("<td align='left'><span onclick='fnDoctor360Popup(\"" + drs["Doctor_Code"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>" + drs["Doctor_Name"].ToString() + "-" + drs["Sur_Name"].ToString() + "</span></td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left'><span onclick='fnDoctor360Popup(\"" + drs["Doctor_Code"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>" + drs["Doctor_Name"].ToString() + "</span></td>");
                    }
                    mdlNumber = drs["MDL_Number"].ToString();
                    if (!string.IsNullOrEmpty(mdlNumber))
                    {
                        if (regExInt.IsMatch(mdlNumber))
                        {
                            mdlNumber = Convert.ToInt32(mdlNumber).ToString();
                        }
                    }
                    tableContent.Append("<td align='center' >" + mdlNumber + "</td>");
                    tableContent.Append("<td align='left' >" + drs["Speciality_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left' >" + drs["Local_Area"].ToString() + "</td>");
                    tableContent.Append("<td align='left' >" + drs["Hospital_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left' >" + drs["Category_Name"].ToString() + "</td>");
                    //Total Visit

                    if (drr.ToList().Count() > 0)
                    {
                        tableContent.Append("<td align='center' >" + drr.ToList().Count() + "</td>");
                        Totalvisit = drr.ToList().Count();
                    }
                    else
                    {
                        tableContent.Append("<td align='center' >0</td>");
                    }

                    dtDCRDate = dtStartDate;

                    //Planned Visit
                    plannedVisit = 0;
                    deviation = 0;
                    IEnumerable<DataRow> drrFilter = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Doctor_Code"]) == drs["Doctor_Code"].ToString());
                    if (drrFilter.ToList().Count > 0)
                    {
                        plannedVisit = drrFilter.ToList().Count();
                    }
                    else
                    {
                        plannedVisit = 0;
                    }
                    tableContent.Append("<td align='center' >" + plannedVisit + "</td>");
                    //Deviation
                    deviation = plannedVisit - Totalvisit;
                    if (deviation == 0)
                    {
                        tableContent.Append("<td align='center' >" + deviation + "</td>");
                    }
                    else if (deviation > 0)
                    {
                        tableContent.Append("<td align='center' >" + deviation + "<span style='font-weight:bold;font-size:14px;'>*</span></td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' >" + deviation + "<span style='font-weight:bold;font-size:14px;'>#</span></td>");
                    }

                    for (int i = 0; i <= ts.Days; i++)
                    {
                        if (i != 0)
                        {
                            dtDCRDate = dtDCRDate.AddDays(Convert.ToDouble(1));
                        }

                        day = dtDCRDate.ToString("yyyy-MM-dd");
                        day = day.Split('-')[2] + "/" + day.Split('-')[1] + "/" + day.Split('-')[0];

                        IEnumerable<DataRow> drrsubFilter = ds.Tables[0].AsEnumerable().Where(z => Convert.ToString(z["Doctor_Code"]) == drs["Doctor_Code"].ToString() && Convert.ToString(z["DCR_Actual_Date"]) == day.ToString());
                        if (drrsubFilter.ToList().Count() > 0)
                        {
                            colorCode = "";
                            DataTable dt = drrsubFilter.CopyToDataTable<DataRow>();
                            if (dt.Rows.Count > 0)
                            {
                                if (dt.Rows[0]["DCR_Status"].ToString().ToUpper() == "APPLIED")
                                {
                                    colorCode = "color=#0000A0";
                                }
                                else if (dt.Rows[0]["DCR_Status"].ToString().ToUpper() == "APPROVED")
                                {
                                    colorCode = "color=#008000";
                                }
                                else if (dt.Rows[0]["DCR_Status"].ToString().ToUpper() == "UNAPPROVED")
                                {
                                    colorCode = "color=#FF0000";
                                }

                                if (!string.IsNullOrEmpty(dt.Rows[0]["Doctor_Visit_Time"].ToString()))
                                {

                                    tableContent.Append("<td align='center' style='width:50px;'><font " + colorCode + ">" + dt.Rows[0]["Doctor_Visit_Time"] + dt.Rows[0]["Visit_Mode"] + "</font></td>");
                                }
                                else
                                {
                                    tableContent.Append("<td align='center' style='width:50px;'><font " + colorCode + " >" + dt.Rows[0]["Visit_Mode"] + "</font></td>");
                                }
                            }

                        }
                        else
                        {

                            tableContent.Append("<td align='center' style='width:50px;'></td>");
                        }
                    }
                    tableContent.Append("</tr>");


                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");
            }
            else
            {
                tableContent.Append("<div>This Region is Vacant/Not Assigned.So no user details found.</div>");
            }
            return tableContent.ToString();
        }

        private string GetMonthName(int montnNo)
        {
            try
            {
                string monthName = "";

                switch (montnNo)
                {
                    case 1:
                        {
                            monthName = "Jan";
                            break;
                        }
                    case 2:
                        {
                            monthName = "Feb";
                            break;
                        }
                    case 3:
                        {
                            monthName = "Mar";
                            break;
                        }
                    case 4:
                        {
                            monthName = "Apr";
                            break;
                        }
                    case 5:
                        {
                            monthName = "May";
                            break;
                        }
                    case 6:
                        {
                            monthName = "Jun";
                            break;
                        }
                    case 7:
                        {
                            monthName = "Jul";
                            break;
                        }
                    case 8:
                        {
                            monthName = "Aug";
                            break;
                        }
                    case 9:
                        {
                            monthName = "Sep";
                            break;
                        }
                    case 10:
                        {
                            monthName = "Oct";
                            break;
                        }
                    case 11:
                        {
                            monthName = "Nov";
                            break;
                        }
                    case 12:
                        {
                            monthName = "Dec";
                            break;
                        }
                }
                return monthName;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetMonthName()");
                return "";
            }
        }

        public string GetManPowerStatusReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string regionCodes = "", tableContent = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            DataRow[] drFilter;
            int activeCount = 0;
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }

            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            ds = _objSPData.GetManPowerStatusReport(companyCode, regionCodes);
            tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblManPowerStatus' >";
            tableContent += "<thead><tr>";
            tableContent += "<th>Summary</th><th>Count</th>";
            tableContent += "</tr></thead>";
            tableContent += "<tbody>";

            //Number of New joines
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>Number of New joines</td>";
            drFilter = ds.Tables[0].Select("joinMonth='" + System.DateTime.Now.Month.ToString() + "' AND joinYear='" + System.DateTime.Now.Year.ToString() + "'");
            if (drFilter.Length > 0)
            {
                activeCount += Convert.ToInt32(drFilter.Length);
                tableContent += "<td align='left'><span onclick='fnManPowerSummary(\"" + regionCode + "_NEW" + "\")' style='text-decoration:underline;cursor:pointer'>" + drFilter.Length + "</span></td>";
                //  tableContent += "<td align='left' width='15%'>" + drFilter.Length + "</td>";
            }
            else
            {
                tableContent += "<td align='left' width='15%'>0</td>";
            }
            tableContent += "</tr>";

            //Number of confirmed employees for the period
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>Number of confirmed employees for the period</td>";
            drFilter = ds.Tables[0].Select("ConMonth='" + System.DateTime.Now.Month.ToString() + "' AND ConYear='" + System.DateTime.Now.Year.ToString() + "'");
            if (drFilter.Length > 0)
            {
                activeCount += Convert.ToInt32(drFilter.Length);
                // tableContent += "<td align='left' width='15%'>" + drFilter.Length + "</td>";
                tableContent += "<td align='left'><span onclick='fnManPowerSummary(\"" + regionCode + "_CONFORM" + "\")' style='text-decoration:underline;cursor:pointer'>" + drFilter.Length + "</span></td>";
            }
            else
            {
                tableContent += "<td align='left' width='15%'>0</td>";
            }
            tableContent += "</tr>";


            //No of Resignations
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>No of Resignations</td>";

            drFilter = ds.Tables[1].Select("ResMonth='" + System.DateTime.Now.Month.ToString() + "' AND ResYear='" + System.DateTime.Now.Year.ToString() + "'");
            if (drFilter.Length > 0)
            {
                //  tableContent += "<td align='left' width='15%'>" + drFilter.Length + "</td>";
                tableContent += "<td align='left'><span onclick='fnManPowerSummary(\"" + regionCode + "_RES" + "\")' style='text-decoration:underline;cursor:pointer'>" + drFilter.Length + "</span></td>";
            }
            else
            {
                tableContent += "<td align='left' width='15%'>0</td>";
            }
            tableContent += "</tr>";


            //No of Resignations
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>No. of Dummy (Vacant) employees</td>";
            if (ds.Tables[2].Rows.Count > 0)
            {
                tableContent += "<td align='left' width='15%'>" + ds.Tables[2].Rows.Count + "</td>";
            }
            else
            {
                tableContent += "<td align='left' width='15%'>0</td>";
            }
            tableContent += "</tr>";


            //Other Active employees
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>Other Active employees</td>";

            if (ds.Tables[0].Rows.Count > 0)
            {
                //tableContent += "<td align='left' width='15%'>" + (ds.Tables[0].Rows.Count - activeCount) + "</td>";
                tableContent += "<td align='left'><span onclick='fnManPowerSummary(\"" + regionCode + "_OTHER" + "\")' style='text-decoration:underline;cursor:pointer'>" + ds.Tables[0].Rows.Count + "</span></td>";
            }
            else
            {
                tableContent += "<td align='left' width='15%'>0</td>";
            }
            tableContent += "</tr>";
            tableContent += "</tbody>";

            //Total Active Employees
            tableContent += "<thead><tr>";
            tableContent += "<th align='left' width='15%'>Total Active Employees</th>";

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent += "<th>" + ds.Tables[0].Rows.Count + "</th>";
            }
            else
            {
                tableContent += "<th>0</th>";
            }
            tableContent += "</tr></thead>";
            tableContent += "</table>";

            return tableContent;
        }
        public string GetManpowerSummary(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string status = collection["status"].ToString();
            string regionCodes = "", divisionName = "";
            string startDate = "", endDate = "";
            DataSet ds = new DataSet();
            DataRow[] drFilter;
            DateTime dtStartDate = new DateTime();
            DateTime dtEndDate = new DateTime();
            StringBuilder tableContent = new StringBuilder();
            TimeSpan ts;
            int sNo = 0;
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }

            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblManPowerSummary' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th>S.No</th><th>Employee Number</th><th>Employee Name</th><th>User Name</th><th>User Type</th><th>Division Name</th>");
            tableContent.Append("<th>Manager Name</th><th>Manager Region Name</th><th>Date of Joining</th><th>Date of Confirmation</th>");
            tableContent.Append("<th>No. Of days days of sevice</th><th>Date of Deactivation</th>");
            tableContent.Append("</tr>");
            tableContent.Append("<tr>");
            tableContent.Append("<th>S.No</th><th>Employee Number</th><th>Employee Name</th><th>User Name</th><th>User Type</th><th>Division Name</th>");
            tableContent.Append("<th>Manager Name</th><th>Manager Region Name</th><th>Date of Joining</th><th>Date of Confirmation</th>");
            tableContent.Append("<th>No. Of days days of sevice</th><th>Date of Deactivation</th>");
            tableContent.Append("</tr></thead>");
            tableContent.Append("<tbody>");

            string type = "[{ type: 'number-range' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }";
            type += ", { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'date-range' },{ type: 'date-range' }, { type: 'text' }, { type: 'date-range' }]";



            ds = _objSPData.GetManpowerSummary(companyCode, regionCodes, System.DateTime.Now.Month.ToString(), System.DateTime.Now.Year.ToString(), status.ToUpper());
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                sNo++;
                tableContent.Append("<tr>");
                tableContent.Append("<td align='left' width='15%'>" + sNo + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["Employee_Number"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["Employee_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["User_Type_Name"].ToString() + "</td>");

                if (ds.Tables[1].Rows.Count > 0)
                {

                    drFilter = ds.Tables[1].Select("Region_Code='" + dr["Region_Code"].ToString() + "'");
                    divisionName = "";
                    if (drFilter.Length > 0)
                    {
                        for (var j = 0; j < drFilter.Length; j++)
                        {
                            divisionName += drFilter[j]["Division_Name"].ToString() + ",";
                        }

                        if (divisionName != "")
                        {
                            divisionName = divisionName.Substring(0, divisionName.Length - 1);
                        }
                    }
                }
                tableContent.Append("<td align='left' width='15%'>" + divisionName + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["Manager_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["Manager_Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["DOJ"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%'>" + dr["Confirmation_Date"].ToString() + "</td>");

                if (!string.IsNullOrEmpty(dr["DOJ"].ToString()))
                {
                    startDate = dr["DOJ"].ToString().Split('/')[2] + "-" + dr["DOJ"].ToString().Split('/')[1] + "-" + dr["DOJ"].ToString().Split('/')[0];
                    endDate = System.DateTime.Now.ToString("yyyy-MM-dd");
                    dtStartDate = Convert.ToDateTime(startDate);
                    dtEndDate = Convert.ToDateTime(endDate);
                    ts = dtEndDate - dtStartDate;
                    tableContent.Append("<td align='left' width='15%'>" + ((ts.Days) + 1) + "</td>");
                }
                else
                {
                    tableContent.Append("<td align='left' width='15%'></td>");
                }

                if (!string.IsNullOrEmpty(dr["Effective_To"].ToString()))
                {
                    tableContent.Append("<td align='left' width='15%'>" + dr["Effective_To"].ToString() + "</td>");
                }

                else
                {
                    tableContent.Append("<td align='left' width='15%'></td>");
                }

                tableContent.Append("</tr>");
            }

            tableContent.Append("</tbody></table>^" + type + "");
            return tableContent.ToString();
        }

        public JsonResult GetDoctorPOBDetails(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string date = collection["date"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDoctorPOBDetails(companyCode, regionCode, date);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetChemistPOBDetails(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string date = collection["date"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetChemistPOBDetails(companyCode, regionCode, date);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetStockiestPOBDetails(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string date = collection["date"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetStockiestPOBDetails(companyCode, regionCode, date);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetRegionMasterTreeDetails()
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + _objcurrentInfo.GetRegionCode() + "'");

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public JsonResult GetUserMasterTreeDetails(FormCollection collection)
        {

            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetUserTreeDetails '" + _objcurrentInfo.GetCompanyCode() + "','" + _objcurrentInfo.GetUserCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #region DCR Consolidated Report
        //********* START- DCR CONSOLIDATED REPORT ********************
        public JsonResult GetDCRConsolidatedReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty, otn = string.Empty, showWAData = string.Empty;
                string[] option;
                string isDcr = "N", isDoc = "N", isChe = "N", isSto = "N", isPro = "N", isExp = "N";

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');
                otn = collection["option"].ToString();
                option = otn.Split('^');
                showWAData = collection["showWAData"].ToString();
                foreach (string a in option)
                {
                    switch (a)
                    {
                        case "D":
                            isDcr = "Y";
                            break;
                        case "DR":
                            isDoc = "Y";
                            break;
                        case "C":
                            isChe = "Y";
                            break;
                        case "S":
                            isSto = "Y";
                            break;
                        case "P":
                            isPro = "Y";
                            break;
                        case "E":
                            isExp = "Y";
                            break;
                        default:
                            break;
                    }
                }

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsolidatedReport '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "','" + isDcr + "','" + isDoc + "','" + isChe + "','" + isSto + "','" + isPro + "','" + isExp + "','" + showWAData + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsChemistDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsChemistVisit '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsStockistDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsStockistVisit '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsProductDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsProductsDetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRHeaderDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsDCRHeader '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRDoctorVisitDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsDoctorVisit '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRDoctorMissedDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                SPData objSPData = new SPData();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = objSPData.GetDoctorMissedDetailsForConsolidatedReport(_objcurrentInfo.GetCompanyCode(), collection["userCode"].ToString(), from, to, dcrStatus);
                //dsReport = objSPData.ExecuteDataSet("exec SP_hdGetDCRConsDoctorMissed '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRExpenseDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsExpenseDetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRRCPADetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsRCPADetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRDoctorVisitRemarksPopUp(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsDoctorVisitRemarksPopUp '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["dcrCodes"].ToString() + "','" + collection["visitCodes"].ToString() + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsWADCRDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsWADCRDetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRUnlistedDoctorMet(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsUnlistedDoctorMet '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDCRConsDCRDoctorVisitSummary(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetDCRConsDoctorVisitSummary '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetAccompanistVisitedDoctors(string DCR_User_Code, string Acc_User_Name, string DCR_User_Name, string DCR_Actual_Date)
        {
            string company_Code = _objcurrentInfo.GetCompanyCode();
            DataSet ds = _objSPData.GetAccompanistVisitDoctors(company_Code, DCR_User_Name, Acc_User_Name, DCR_Actual_Date, DCR_User_Code);

            return GetAccompanistVisitedDoctorsHTMLFormat(ds);
        }

        public string GetDetailedProductsAndInputsPerDoctor(string doctor_Code, string doctor_Name, string user_Code, string DCR_Actual_Dates,
            string speciality_Name)
        {
            string company_Code = _objcurrentInfo.GetCompanyCode();
            DataSet ds = _objSPData.GetDetailedProductsAndInputsPerDoctor(company_Code, user_Code, doctor_Code, doctor_Name, speciality_Name, DCR_Actual_Dates);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            {
                return GetDoctorDetailedProductsHTMLFormat(ds);
            }
            else
            {
                return "<span>No Detailed Products Found.</span>";
            }

        }

        private string GetDoctorDetailedProductsHTMLFormat(DataSet ds)
        {
            DataTable dt = ds.Tables[0];
            var dr = (from DataRow dRow in dt.Rows select new { DCRDate = dRow["DCR_Actual_Date"] }).Distinct().ToArray();

            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.Append("<table class='DocDetailProduct' cellspacing='0' cellpadding='0' border=0 >");
            htmlBuilder.Append("<thead>");
            htmlBuilder.Append("<tr>");
            htmlBuilder.Append("<th> Sno </th>");
            htmlBuilder.Append("<th> DCR Date </th>");
            htmlBuilder.Append("<th> Detailed Product List </th>");
            htmlBuilder.Append("</tr>");
            htmlBuilder.Append("</thead>");
            htmlBuilder.Append("<tbody>");

            for (int i = 0; i < dr.Length; i++)
            {
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append("<td>");

                htmlBuilder.Append((i + 1).ToString());
                htmlBuilder.Append("</td>");
                htmlBuilder.Append("<td>");
                htmlBuilder.Append(dr[i].DCRDate.ToString());
                htmlBuilder.Append("</td>");
                IEnumerable<DataRow> rows = dt.AsEnumerable().Where(a => a["DCR_Actual_Date"].ToString().Equals(dr[i].DCRDate.ToString()));
                htmlBuilder.Append("<td>");
                foreach (DataRow row in rows)
                {
                    htmlBuilder.Append(row["Product_Name"].ToString());
                    htmlBuilder.Append("|");
                    htmlBuilder.Append(row["Product_Type_Name"].ToString());
                    htmlBuilder.Append("<br />");
                }
                htmlBuilder.Append("</td>");

                htmlBuilder.Append("</tr>");

            }
            htmlBuilder.Append("</tbody>");
            htmlBuilder.Append("</table>");
            return htmlBuilder.ToString();
        }

        private string GetAccompanistVisitedDoctorsHTMLFormat(DataSet ds)
        {
            GetPrivillegeValue();
            StringBuilder htmlBuilder = new StringBuilder();
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            {
                htmlBuilder.Append("<h3>" + DOCTOR_CAPTION + " Details</h3>");
                htmlBuilder.Append("<table class='accDocDetail' cellspacing='0' cellpadding='0' border=0 >");
                htmlBuilder.Append("<thead>");
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append("<th> Sno </th>");
                htmlBuilder.Append("<th> Region Name </th>");
                htmlBuilder.Append("<th> " + DOCTOR_CAPTION + " Name </th>");
                htmlBuilder.Append("<th> MDL </th>");
                htmlBuilder.Append("<th> Specialty </th>");
                htmlBuilder.Append("<th> Category </th>");
                htmlBuilder.Append("<th> Visit Time/Mode </th>");
                // htmlBuilder.Append("<th> Accompanied Call </th>");
                htmlBuilder.Append("</tr>");
                htmlBuilder.Append("</thead>");
                htmlBuilder.Append("<tbody>");

                DataRowCollection rows = ds.Tables[0].Rows;
                int index = 0;
                foreach (DataRow row in rows)
                {
                    htmlBuilder.Append("<tr>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append((++index).ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Region_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Doctor_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["MDL"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Speciality_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Category_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    if (row["Doctor_Visit_Time"].ToString() != "")
                    {
                        row["Doctor_Visit_Time"] = row["Doctor_Visit_Time"].ToString().Replace("PMPM", "PM").Replace("AMAM", "AM").ToString();
                        htmlBuilder.Append(row["Doctor_Visit_Time"].ToString());
                    }
                    else
                    {
                        htmlBuilder.Append(((row["Visit_Mode"].ToString() == "") ? "AM" : row["Visit_Mode"].ToString()));
                    }
                    htmlBuilder.Append("</td>");
                    //htmlBuilder.Append("<td>");
                    //htmlBuilder.Append(row["Is_Accompanied_call"].ToString());
                    // htmlBuilder.Append("</td>");
                    htmlBuilder.Append("</tr>");
                }
                htmlBuilder.Append("</tbody>");
                htmlBuilder.Append("</table>");
            }
            else
            {
                htmlBuilder.Append("<span>No " + DOCTOR_CAPTION + " Found.</span>");
            }
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[1].Rows != null && ds.Tables[1].Rows.Count > 0)
            {
                htmlBuilder.Append("<h3>" + CHEMIST_CAPTION + " Details</h3>");
                htmlBuilder.Append("<table class='accDocDetail' cellspacing='0' cellpadding='0' border=0 >");
                htmlBuilder.Append("<thead>");
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append("<th> Sno </th>");
                htmlBuilder.Append("<th> Region Name </th>");
                htmlBuilder.Append("<th> " + CHEMIST_CAPTION + " Name </th>");
                htmlBuilder.Append("<th> MDL </th>");
                htmlBuilder.Append("<th> Visit Time/Mode </th>");
                // htmlBuilder.Append("<th> Accompanied Call </th>");
                htmlBuilder.Append("</tr>");
                htmlBuilder.Append("</thead>");
                htmlBuilder.Append("<tbody>");

                DataRowCollection rows = ds.Tables[1].Rows;
                int index = 0;
                foreach (DataRow row in rows)
                {
                    var mode = row["Visit_time"].ToString() + row["Visit_Mode"].ToString();
                    htmlBuilder.Append("<tr>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append((++index).ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Region_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["Chemists_Name"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(row["MDL"].ToString());
                    htmlBuilder.Append("</td>");
                    htmlBuilder.Append("<td>");
                    htmlBuilder.Append(mode.Trim());
                    htmlBuilder.Append("</td>");

                    htmlBuilder.Append("</tr>");
                }
                htmlBuilder.Append("</tbody>");
                htmlBuilder.Append("</table>");
            }
            else
            {
                //no Chemist no need to display
                //htmlBuilder.Append("<span>No " + CHEMIST_CAPTION + " Found.</span>");
            }
            return htmlBuilder.ToString();
        }

        //********* END- DCR CONSOLIDATED REPORT **********************

        #endregion DCR Consolidated Report

        #region Expense Reports

        // ------------------- START- EXPENSE GROUP MASTER REPORT-------------------
        public JsonResult GetExpenseGroupMasterReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroupMasterReport '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetExpenseGroupDetails(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsGroupDetails = new DataSet();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsGroupDetails = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroupDetailsForMapping '" + _objcurrentInfo.GetCompanyCode() + "','" + coll["groupID"].ToString() + "'");
                }

                return Json(objJson.Serialize(dsGroupDetails));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // ------------------- END- EXPENSE GROUP MASTER REPORT-------------------


        //------------------- start- expense Analysis report-------------------
        public JsonResult GetExpenseAnalysisReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseAnalysisReport '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //SP_hdGetExpenseAnalysisPopup
        public JsonResult GetExpenseAnalysisReportPopUp(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseAnalysisPopup '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + collection["dcrCode"].ToString() + "','" + collection["flag"].ToString() + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------------- end- expense Analysis report -------------------


        //------------------- start- expense Summary report -------------------
        public JsonResult GetExpenseSummaryReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty, otn = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseSummaryReport '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------------- end- expense Summary report-------------------


        //------------------- start- expense Analysis group wise report -------------------
        public JsonResult GetExpenseAnalysisGroupWiseReport(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataSet dsDocDetails = new DataSet();

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty, activityStatus = string.Empty, docChemistMet = string.Empty;

                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                dcrStatus = collection["dcrStatus"].ToString();
                dcrStatus = dcrStatus.TrimEnd(',');
                activityStatus = collection["activityStatus"].ToString();
                docChemistMet = collection["docChemistMet"].ToString();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseAnalysisGroupWiseReport '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "','" + activityStatus + "'");

                if (docChemistMet == "Y" && activityStatus.Contains('F'))
                {
                    dsDocDetails = _objData.ExecuteDataSet("exec SP_hdGetExpenseAnalysisGroupWiseReport_CustCount '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + dcrStatus + "'");
                }
                List<JsonResult> lstJSON = new List<JsonResult> { Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet), 
                    Json(json.Serialize(dsDocDetails), JsonRequestBehavior.AllowGet) };
                return new LargeJsonResult() { Data = lstJSON, MaxJsonLength = int.MaxValue };
                // return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetAccompanistDetailForaDay(FormCollection coll)
        {
            try
            {
                DataSet dsReport = new DataSet();
                string dcrDate = coll["dcrDate"].ToString();
                dcrDate = dcrDate.Split('/')[2] + "-" + dcrDate.Split('/')[1] + "-" + dcrDate.Split('/')[0];
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetAccompanistDetailForaDay '" + _objcurrentInfo.GetCompanyCode() + "', '" + coll["userCode"].ToString() + "','" + dcrDate + "'");

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------------- end- expense Analysis group wise report -------------------


        //------------------- start- expense claim report -------------------
        private JsonResult GetStatus()
        {
            try
            {
                DataSet dsStatus = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsStatus = _objData.ExecuteDataSet("exec SP_hdGetStatus '" + _objcurrentInfo.GetCompanyCode() + "'");
                }

                return Json(json.Serialize(dsStatus), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetExpenseClaimReport(FormCollection collection, string mode)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, claimStatus = string.Empty, claimsatusName = string.Empty, claimBased = string.Empty;
                StringBuilder sbTableContent = new StringBuilder();
                string blobUrl = string.Empty;
                string reportGenaratedtime = string.Empty;
                int expTypeCount = 0;
                from = collection["startDate"].ToString();
                to = collection["endDate"].ToString();
                claimStatus = collection["claimStatus"].ToString();
                claimStatus = claimStatus.TrimEnd(',');

                claimsatusName = collection["claimstatusname"].ToString();
                claimsatusName = claimsatusName.TrimEnd(',');
                reportGenaratedtime = DateTime.Now.ToString();
                if (mode == "EXPENSE")
                {
                    claimBased = "Based on Claim Submitted Dates (From-To)";
                }
                else
                {
                    claimBased = "Based on DCR Submitted Dates (From-To)";
                }

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseClaimReport_DCR '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + from + "','" + to + "','" + claimStatus + "','" + mode + "'");

                if (dsReport.Tables.Count > 0 && dsReport.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<div id='divLegends' style='font-weight: 600; font-weight:bold'>Total Claimed: Sum of all expense actual<br/>Total Deduction: Sum of all expense deduction<br/>Total Approved: Sum of all expense approved <br/></div>");
                    sbTableContent.Append("<div style='font-weight:bold'><span>Selected Claim status are " + claimsatusName + "</span></div>");
                    sbTableContent.Append("<div style='font-weight:bold'><span>Expense Claim Request Genarated on " + reportGenaratedtime + "</span></div>");
                    sbTableContent.Append("<div ><table cellspacing='0' cellpadding='0' id='tblExpenseClaim' class='data display dataTable box' width='100%'>");
                    sbTableContent.Append("<thead>");
                    sbTableContent.Append("<tr style='display: none;' id='tblTr'>");
                    sbTableContent.Append("<th> Print </td>");
                    sbTableContent.Append("<th >User Id</th>");
                    sbTableContent.Append("<th >Employee Name</th>");
                    sbTableContent.Append("<th >Employee No</th>");
                    sbTableContent.Append("<th >Region Name</th>");
                    sbTableContent.Append("<th >Designation</th>");
                    sbTableContent.Append("<th >Division</th>");
                    sbTableContent.Append("<th >PF No</th>");
                    sbTableContent.Append("<th >Bank Account No</th>");
                    sbTableContent.Append("<th >PAN</th>");
                    sbTableContent.Append("<th >Employee Mobile Number</th>");
                    sbTableContent.Append("<th >Claim Request No</th>");
                    sbTableContent.Append("<th >Claim Submitted By</th>");
                    sbTableContent.Append("<th>From</th>");
                    sbTableContent.Append("<th>To</th>");
                    sbTableContent.Append("<th >Request Submitted Date</th>");
                    sbTableContent.Append("<th >Status</th>");
                    sbTableContent.Append("<th>Last Modified Date</th>");
                    sbTableContent.Append("<th>Last Modified By</th>");
                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th>Actual</th>");
                            sbTableContent.Append("<th>Approved</th>");
                        }
                    }
                    // sbTableContent.Append("<th class='expRem' >User Remarks</th>");
                    sbTableContent.Append("<th>Total Claimed</th>");
                    sbTableContent.Append("<th>Total Deduction</th>");
                    sbTableContent.Append("<th>Total Approved</th>");
                    sbTableContent.Append("<th class='expRem' >Approver Remarks</th>");
                    sbTableContent.Append("<th>Downloads</th>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th> Print </td>");
                    sbTableContent.Append("<th>User Id</th>");
                    sbTableContent.Append("<th>Employee Name</th>");
                    sbTableContent.Append("<th >Employee No</th>");
                    sbTableContent.Append("<th>Region Name</th>");
                    sbTableContent.Append("<th>Designation</th>");
                    sbTableContent.Append("<th>Division</th>");
                    sbTableContent.Append("<th >PF No</th>");
                    sbTableContent.Append("<th >Bank Account No</th>");
                    sbTableContent.Append("<th >PAN</th>");
                    sbTableContent.Append("<th >Employee Mobile Number</th>");
                    sbTableContent.Append("<th>Claim Request No</th>");
                    sbTableContent.Append("<th >Claim Submitted By</th>");
                    sbTableContent.Append("<th>DCR Submitted Period From</th>");
                    sbTableContent.Append("<th>DCR Submitted Period To</th>");
                    sbTableContent.Append("<th>Request Submitted Date</th>");
                    sbTableContent.Append("<th>Status</th>");
                    sbTableContent.Append("<th>Last Modified Date</th>");
                    sbTableContent.Append("<th>Last Modified By</th>");
                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Actual</th>");
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Approved</th>");
                            sbTableContent.Append("<th >" + dsReport.Tables[3].Rows[u]["Expense_Type_Name"] + " Deduction</th>");
                        }
                    }
                    sbTableContent.Append("<th>Total Claimed</th>");
                    sbTableContent.Append("<th>Total Deduction</th>");
                    sbTableContent.Append("<th>Total Approved</th>");
                    //sbTableContent.Append("<th class='expRem'>User Remarks</th>");
                    sbTableContent.Append("<th class='expRem'>Approver Remarks</th>");
                    sbTableContent.Append("<th>Downloads</th>");
                    sbTableContent.Append("</tr>");


                    sbTableContent.Append("<th colspan= '" + ((dsReport.Tables[3].Rows.Count * 3) + 24) + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                    sbTableContent.Append("</thead><tbody>");
                    sbTableContent.Append("<tr>");
                    //if (dsReport.Tables[0].Rows.Count > 0)
                    //{

                    //if (Convert.ToInt32(dsReport.Tables[5].Rows[i]["Move_Order"]) == Convert.ToInt32(dsReport.Tables[5].Rows[i]["Order_No"]))
                    //{
                    //    sbTableContent.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpensePrint(\"" + dsReport.Tables[5].Rows[i]["Favouring_User_Code"].ToString() + "\",\"" + dsReport.Tables[5].Rows[i]["Claim_Code"].ToString() + "\",\"" + dsReport.Tables[5].Rows[i]["Date_From"].ToString() + "\",\"" + dsReport.Tables[5].Rows[i]["Date_To"].ToString() + "\",\"" + dsReport.Tables[5].Rows[i]["Status_Name"].ToString() + "\");'>Print</a></div></td>");
                    //}
                    //else
                    //{
                    //    sbTableContent.Append("<td>--</td>");
                    //}

                    //}
                    //DataRow[] expClaim = dsReport.Tables[5].Select("Claim_Code='" + dsReport.Tables[0].Rows[i]["Claim_Code"] + "' AND User_Code ='" + dsReport.Tables[5].Rows[i]["User_Code"] + "'");

                    for (var x = 0; x < dsReport.Tables[0].Rows.Count; x++)
                    {
                        DataRow[] drUnderUsers = dsReport.Tables[5].AsEnumerable().Where(a => Convert.ToString(a["Favouring_User_Code"]) == Convert.ToString(dsReport.Tables[0].Rows[x]["User_Code"].ToString()) &&
                    Convert.ToString(a["Claim_Code"]) == dsReport.Tables[0].Rows[x]["Claim_Code"].ToString() && Convert.ToString(a["Request_Entity"]) == "Region Wise").ToArray();


                        //DataRow[] drUnderUsers = dsReport.Tables[5].AsEnumerable().Where(b => Conver["Favouring_User_Code"]) == Convert.ToString(dsReport.Tables[0].Rows[x]["User_Code"])
                        //    && b=>b["Claim_Code"]==dsReport.Tables[0].Rows[x]["Claim_Code"]).ToArray();
                        if (drUnderUsers.Length != 0)
                        {
                            sbTableContent.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpensePrint(\"" + drUnderUsers[0]["Favouring_User_Code"].ToString() + "\",\"" + drUnderUsers[0]["Claim_Code"].ToString() + "\",\"" + drUnderUsers[0]["Date_From"].ToString() + "\",\"" + drUnderUsers[0]["Date_To"].ToString() + "\",\"" + drUnderUsers[0]["Status_Name"].ToString() + "\");'>Print</a></div></td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>--</td>");
                        }

                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["User_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Employee_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Employee_Number"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Region_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Designation"] + "</td>");
                        // Division
                        DataRow[] expDiv = dsReport.Tables[1].Select("User_Code='" + dsReport.Tables[0].Rows[x]["User_Code"].ToString() + "'");
                        if (expDiv.Length > 0)
                        {
                            sbTableContent.Append("<td>" + expDiv[0]["Division_Name"].ToString() + "</td>");
                        }
                        else { sbTableContent.Append("<td></td>"); }
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["PF_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["PF_Number"].ToString()) + "</td>");
                        sbTableContent.Append("<td >" + dsReport.Tables[0].Rows[x]["Acc_No"] + "</td>");
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["PAN_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["PAN_Number"].ToString()) + "</td>");
                        sbTableContent.Append("<td >" + ((dsReport.Tables[0].Rows[x]["Mobile"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[x]["Mobile"].ToString()) + "</td>");
                        DataRow[] drClaimRequestDetails = dsReport.Tables[7].AsEnumerable().Where(b => Convert.ToString(b["Claim_Code"]) == Convert.ToString(dsReport.Tables[0].Rows[x]["Claim_Code"])).ToArray();

                        //string editValues = claim.Claim_Code + "_" + claim.User_Code + "_" + claim.Request_Name + "_" + claim.Favouring_User_Code
                        //        + "_" + claim.Status_Code + "_" + claim.Move_Order + "_" + claim.Cylce_Code + "_" + claim.Request_Code + "_" + claim.User_Type_Name + "_" + claim.Date_To + "_" + claim.Expense_Claim_Screen_Mode;

                        string editValues = drClaimRequestDetails[0]["Claim_Code"].ToString() + "_" + drClaimRequestDetails[0]["User_Code"].ToString() + "_" + drClaimRequestDetails[0]["Request_Name"].ToString() + "_" +
                                              drClaimRequestDetails[0]["Favouring_User_Code"].ToString() + "_" + drClaimRequestDetails[0]["Status_Code"].ToString() + "_" + drClaimRequestDetails[0]["Move_Order"].ToString() + "_" +
                                              drClaimRequestDetails[0]["Cycle_Code"].ToString() + "_" + drClaimRequestDetails[0]["Request_Code"].ToString() + "_" + drClaimRequestDetails[0]["User_Type_Name"].ToString() + "_" +
                                              drClaimRequestDetails[0]["Date_To"].ToString() + "_" + drClaimRequestDetails[0]["Expense_Claim_Screen_Mode"].ToString();


                        sbTableContent.Append("<td class='td-a' onclick='fnEditRequestforCliamCode(\"" + editValues + "\");'>" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[0].Rows[x]["Submitted_BY"] + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Date_From"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Date_From"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Date_To"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Date_To"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Entered_DateTime"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Entered_DateTime"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[0].Rows[x]["Status_Name"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Status_Name"]) + "</td>");

                        // Modifed date modified by
                        DataRow[] modifiedJson = dsReport.Tables[4].Select("Claim_Code='" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "'");
                        if (modifiedJson.Length > 0)
                        {
                            sbTableContent.Append("<td>" + ((modifiedJson[0]["Updated_DateTime"] == System.DBNull.Value) ? "" : modifiedJson[0]["Updated_DateTime"]) + "</td>");
                            sbTableContent.Append("<td>" + ((modifiedJson[0]["Updated_By"] == System.DBNull.Value) ? "" : modifiedJson[0]["Updated_By"]) + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>N/A</td>");
                            sbTableContent.Append("<td>N/A</td>");
                        }


                        if (dsReport.Tables[3].Rows.Count > 0)
                        {
                            for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                            {
                                DataRow[] expClaim = dsReport.Tables[2].Select("Claim_Code='" + dsReport.Tables[0].Rows[x]["Claim_Code"] + "' AND Expense_Type_Code ='" + dsReport.Tables[3].Rows[u]["Expense_Type_Code"] + "'");
                                if (expClaim.Length > 0)
                                {
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Claim_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Claim_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Approved_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Approved_Amount"]).ToString("N2")) + "</td>");
                                    sbTableContent.Append("<td align='right'>" + ((expClaim[0]["Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(expClaim[0]["Deduction_Amount"]).ToString("N2")) + "</td>");

                                }
                                else
                                {
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                    sbTableContent.Append("<td ></td>");
                                }
                            }
                        }

                        DataRow[] drClaimDetails = dsReport.Tables[6].AsEnumerable().Where(b => Convert.ToString(b["Claim_Code"]) == Convert.ToString(dsReport.Tables[0].Rows[x]["Claim_Code"])).ToArray();

                        sbTableContent.Append("<td align='right'>" + ((drClaimDetails[0]["Total_Claimed"] == System.DBNull.Value) ? "-" : Convert.ToDouble(drClaimDetails[0]["Total_Claimed"]).ToString("N2")) + "</td>");
                        sbTableContent.Append("<td align='right'>" + ((drClaimDetails[0]["Total_Deductions"] == System.DBNull.Value) ? "-" : Convert.ToDouble(drClaimDetails[0]["Total_Deductions"]).ToString("N2")) + "</td>");
                        sbTableContent.Append("<td align='right'>" + ((drClaimDetails[0]["Total_Approved"] == System.DBNull.Value) ? "-" : Convert.ToDouble(drClaimDetails[0]["Total_Approved"]).ToString("N2")) + "</td>");

                        sbTableContent.Append("<td class='expRem'  title='" + ((dsReport.Tables[0].Rows[x]["Remarks_By_User"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_User"]) + "'>" + ((dsReport.Tables[0].Rows[x]["Remarks_By_User"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_User"]) + "</td>");

                        sbTableContent.Append("<td>" + ((drClaimDetails[0]["ImgPath"] == System.DBNull.Value) ? "-" : "<div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpenseDownloadImage(\"" + drClaimDetails[0]["ImgPath"] + "\");'>Download</div>") + "</td>");

                        //sbTableContent.Append("<td class='expRem'  title='" + ((dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_Admin"]) + "'>" + ((dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] == System.DBNull.Value) ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_Admin"]) + "</td>");
                        //if ((dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] == System.DBNull.Value ? "" : dsReport.Tables[0].Rows[x]["Remarks_By_Admin"]).ToString().Length > 0)
                        //{
                        //    //sbTableContent.Append("<td class='expRem' ><a href='javascript:fnRemarksByAdmin(" + dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] + ")'>Remarks</a></td>");
                        //    sbTableContent.Append("<td class='td-a expRem' onclick='fnRemarksByAdmin(\"" + dsReport.Tables[0].Rows[x]["Remarks_By_Admin"] + "\");'>Remarks</td>");
                        //}
                        //else
                        //{
                        //    sbTableContent.Append("<td class='expRem' ></td>");
                        //}
                        //
                        sbTableContent.Append("</tr>");
                    }

                    sbTableContent.Append("</tbody><tfoot>");
                    for (var h = 0; h <= 18; h++)
                    {
                        if (h == 18)
                        {
                            sbTableContent.Append("<th style='text-align:right;'>Total</th>");
                        }
                        else
                        {
                            sbTableContent.Append("<th ></th>");
                        }
                    }

                    if (dsReport.Tables[3].Rows.Count > 0)
                    {
                        for (var u = 0; u < dsReport.Tables[3].Rows.Count; u++)
                        {
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Claim_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Claim_Amount"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Approved_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Approved_Amount"]).ToString("N2")) + "</th>");
                            sbTableContent.Append("<th align='right'>" + ((dsReport.Tables[3].Rows[u]["Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[3].Rows[u]["Deduction_Amount"]).ToString("N2")) + "</th>");

                        }
                    }


                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("<th ></th>");
                    sbTableContent.Append("</tfoot></table>");

                    StringBuilder sbTableContentExcel = new StringBuilder();

                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Expense Claim Request for the period " + from.Split('-')[2] + "/" + from.Split('-')[1] + "/" + from.Split('-')[0] + " to " + to.Split('-')[2] + "/" + to.Split('-')[1] + "/" + to.Split('-')[0] + "</div>");
                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Selected Claim status are " + claimsatusName + "</div>");
                    sbTableContentExcel.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Claim period " + claimBased + "</div>");
                    sbTableContentExcel.Append(sbTableContent.Replace("Show Filter", ""));

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = _objcurrentInfo.GetUserName();
                    string subDomine = _objcurrentInfo.GetSubDomain();
                    string fileName = "EXPENSECLAIM_" + "_" + subDomine + "_" + userName + ".xls";


                    blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");
                    expTypeCount = dsReport.Tables[3].Rows.Count;
                }
                else
                {
                    sbTableContent.Append("<div style='width:100%;font-weight:bold;float:left' align='left'>No Expense Claim Request found for this input selection.</div>");
                }

                return sbTableContent.ToString() + "$" + blobUrl + "$" + expTypeCount;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetExpenseClaimForPrint(string companyCode, string claimCode, string userCode, string dateFrom, string dateTo, string claimStatusName)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                StringBuilder sbPrintTbl = new StringBuilder();
                DataSet dsReport = new DataSet();
                DataSet dsDocDetails = new DataSet();
                DataSet dsChemDetails = new DataSet();
                DataSet dsManagerDetails = new DataSet();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                StringBuilder sbTableContentExcel = new StringBuilder();
                StringBuilder sbFooter = new StringBuilder();
                string blobUrl = string.Empty, error = string.Empty;
                string userCodecom = string.Empty;
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string from = string.Empty, to = string.Empty, dcrStatus = string.Empty, activityStatus = string.Empty, docChemistMet = string.Empty, reportName = string.Empty;
                int rowCount = 0;
                double totalExp = 0.00;
                double totaldistance = 0.00;
                docChemistMet = "D,C,M,";
                activityStatus = "F,A";
                dsReport = _objBlExpense.GetExpenseClaimForPrint(_objCur.GetCompanyCode(), userCode, dateFrom, dateTo, claimCode);

                if (docChemistMet != "")
                {
                    if (docChemistMet.Contains("D"))
                    {
                        dsDocDetails = _objBlExpense.GetExpenseClaimCustomerCount(_objCur.GetCompanyCode(), userCode, dateFrom, dateTo, "D");
                    }
                    if (docChemistMet.Contains("C"))
                    {
                        dsChemDetails = _objBlExpense.GetExpenseClaimCustomerCount(_objCur.GetCompanyCode(), userCode, dateFrom, dateTo, "C");
                    }
                    if (docChemistMet.Contains("M"))
                    {
                        dsManagerDetails = _objBlExpense.GetExpenseClaimCustomerCount(_objCur.GetCompanyCode(), userCode, dateFrom, dateTo, "M");
                    }
                }


                int docCount = 4;
                if (docChemistMet.Contains("D"))
                {
                    docCount = docCount - 1;
                }
                if (docChemistMet.Contains("C"))
                {
                    docCount = docCount - 2;
                }
                if (docChemistMet.Contains("M"))
                {
                    docCount = docCount - 1;
                }

                string docChemistForReport = docChemistMet.Replace("D", "Doctor");
                docChemistForReport = docChemistForReport.Replace("C", "Chemist");
                docChemistForReport = docChemistForReport.Replace("M", "Manager");

                string activityForReport = activityStatus.Replace("F", "Field");
                activityForReport = activityForReport.Replace("A", "Attendance");
                double otherDedcution = Convert.ToDouble(dsReport.Tables[8].Rows[0]["Other_Deduction"]);

                // FOR EXPENSE DETAILS
                DateTime fromDate = Convert.ToDateTime(dateFrom);
                DateTime toDate = Convert.ToDateTime(dateTo);

                DateTime tempDate = new DateTime();

                sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                sbPrintTbl.Append("<thead>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th colspan='2'  style='font-size:18px;' align='left'><b>Expense Analysis Approved Claim Report </b></th>");
                sbPrintTbl.Append("<th align='right'>");
                sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objCur.GetSubDomain() + ".jpg'>");
                sbPrintTbl.Append("</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th align='left'><b>Company Name : " + dsReport.Tables[0].Rows[0]["Company_Name"] + "</b></th>");
                sbPrintTbl.Append("<th align='left'><b>User Name : " + dsReport.Tables[0].Rows[0]["User_Name"] + "</b></th>");
                sbPrintTbl.Append("<th align='left'>Designation : " + dsReport.Tables[0].Rows[0]["User_Type_Name"] + "</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th align='left'><b>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</b></th>");
                sbPrintTbl.Append("<th align='left'>Employee Number : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</th>");
                sbPrintTbl.Append("<th align='left'>Division : " + dsReport.Tables[0].Rows[0]["Division_Name"] + "</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th align='left'>Territory Name : " + dsReport.Tables[0].Rows[0]["Region_Name"] + "</th>");
                sbPrintTbl.Append("<th align='left'>Reporting Manager : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "(" + dsReport.Tables[0].Rows[0]["Manager_Name"] + ")</th>");
                sbPrintTbl.Append("<th align='left'>Reporting HQ : " + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th align='left'>Account Number : " + dsReport.Tables[0].Rows[0]["Acc_No"] + "</th>");
                sbPrintTbl.Append("<th align='left'>Date of joining : " + ((dsReport.Tables[0].Rows[0]["DOJ"] == null) ? "-" : dsReport.Tables[0].Rows[0]["DOJ"]) + "</th>");
                sbPrintTbl.Append("<th align='left'>Phone number : " + ((dsReport.Tables[0].Rows[0]["Mobile"] == null) ? "NA" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th align='left'>Claim Period: " + dateFrom.Split('-')[2] + "/" + dateFrom.Split('-')[1] + "/" + dateFrom.Split('-')[0] + " to " + dateTo.Split('-')[2] + "/" + dateTo.Split('-')[1] + "/" + dateTo.Split('-')[0] + "</th>");
                sbPrintTbl.Append("<th align='left'>Claim Status: " + claimStatusName + "</th>");
                sbPrintTbl.Append("<th align='left'>Activity Status: " + activityForReport + "</th>");
                sbPrintTbl.Append("</tr>");


                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th colspan='2' align='left'>ClaimCode: " + claimCode + "</th>");
                sbPrintTbl.Append("<th colspan='2' align='left'>Other Deduction: " + otherDedcution.ToString() + "</th>");
                sbPrintTbl.Append("</tr>");


                sbPrintTbl.Append("<tr>");
                sbPrintTbl.Append("<th colspan='3' align='left'><span style='font-size:25px' id='dvPrintTotal'></span></th>");
                sbPrintTbl.Append("</tr>");
                sbPrintTbl.Append("</thead></table><br />");

                sbPrintTbl.Append("<div style='float:left;width:100%;font-size:18px;font-weight:bold;' id='dvPrintTotal'></div><br />");

                #region print table header
                sbPrintTbl.Append("<table cellspacing='0' cellpadding='1' width='100%'>");
                sbPrintTbl.Append("<thead>");

                sbPrintTbl.Append("<th style='text-align:left;width: 6%;col'>Date</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Activity name</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 6%'>DCR Status</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Category</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Work Place</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 10%'>From-To,Mode</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: 6%'>Distance</th>");
                if (docChemistMet.Contains("D"))
                {
                    sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Doctors Met</th>");
                }
                if (docChemistMet.Contains("C"))
                {
                    sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Chemist Met</th>");
                    sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Chemist POB</th>");
                }
                if (docChemistMet.Contains("M"))
                {
                    sbPrintTbl.Append("<th style='text-align:left;width: 10%'>Accompanist Count</th>");
                }
                #endregion print table header

                sbTbl.Append("<div style='float:left; width:100%;overflow:scroll;'><table cellspacing='0' cellpadding='0' id='tblExpenseAnalysis' class='data display dataTable box' width='100%' border='1'>");
                sbTbl.Append("<thead style='display:table-header-group;'>");

                sbTbl.Append("<tr>");
                string rwSpn = "";
                if (dsReport.Tables[2].Rows.Count > 0)
                {
                    rwSpn = "rowspan='2'";
                }

                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">User Name</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Employee Name</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Division Name</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Date of Joining</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Manager Name</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Manager Territory name</th>");
                sbTbl.Append("<th style='display:none;width: 15%' " + rwSpn + ">Territory Name</th>");

                sbTbl.Append("<th " + rwSpn + ">Date</th>");
                sbTbl.Append("<th " + rwSpn + ">Activity name</th>");
                sbTbl.Append("<th " + rwSpn + ">Status</th>");
                sbTbl.Append("<th " + rwSpn + ">Category</th>");
                sbTbl.Append("<th " + rwSpn + ">Work Place</th>");
                sbTbl.Append("<th " + rwSpn + ">From-To,Mode(Distance)</th>");
                sbTbl.Append("<th " + rwSpn + ">Sum of Distance</th>");
                if (docChemistMet.Contains("D"))
                {
                    sbTbl.Append("<th " + rwSpn + ">Doctors Met</th>");
                }
                if (docChemistMet.Contains("C"))
                {
                    sbTbl.Append("<th " + rwSpn + ">Chemist Met</th>");
                    sbTbl.Append("<th " + rwSpn + ">Chemist POB</th>");
                }
                if (docChemistMet.Contains("M"))
                {
                    sbTbl.Append("<th " + rwSpn + ">Accompanist Count</th>");
                }

                double colsLength = dsReport.Tables[2].Rows.Count + 1;
                colsLength = colsLength / 60;
                if (dsReport.Tables[2].Rows.Count > 0)
                {
                    for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                    {

                        sbTbl.Append("<th colspan='3' style='text-align:center; height:50px'>" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + "</th>");
                        sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px' >" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + "</th>");

                    }
                }

                //for (tempDate = fromDate; tempDate <= toDate; tempDate = tempDate.AddDays(1))
                //{

                //    string DCRtempDateString = tempDate.ToString("dd/MM/yyyy");

                //    DataRow[] dcrJson, holidayJson;
                //    dcrJson = dsReport.Tables[3].Select("DCR_Actual_Date='" + DCRtempDateString + "'");

                //    if (dcrJson.Length > 0)
                //    {
                //        for (int j = 0; j < dcrJson.Count(); j++)
                //        {
                //            for (int i = 0; i < dsReport.Tables[2].Rows.Count; i++)
                //            {
                //                if (dcrJson[j]["Expense_Type_Code"] == dsReport.Tables[2].Rows[i]["Expense_Type_Code"])
                //                {
                //                    sbTbl.Append("<th colspan='3' style='text-align:center; height:50px'>" + dsReport.Tables[2].Rows[i]["Expense_Type_Name"] + "</th>");
                //                    sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px' >" + dsReport.Tables[2].Rows[i]["Expense_Type_Name"] + "</th>");
                //                }
                //            }
                //        }
                //    }

                //}

                sbTbl.Append("<th " + rwSpn + ">Total Expense</th>");
                sbTbl.Append("<th " + rwSpn + ">Remarks</th>");
                sbTbl.Append("</tr>");

                sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Total Expense</th>");
                sbPrintTbl.Append("<th style='text-align:left;width: " + colsLength.ToString() + "px'>Remarks</th>");
                sbPrintTbl.Append("</tr>");

                sbPrintTbl.Append("</thead><tbody style='display:table-row-group;'>");

                if (dsReport.Tables[2].Rows.Count > 0)
                {
                    sbTbl.Append("<tr>");
                    for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                    {
                        sbTbl.Append("<th style='height:50px'>Expense Mode(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                        sbTbl.Append("<th style='height:50px' >Eligibility Amount(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                        sbTbl.Append("<th style='height:50px' >Expense Amount(" + dsReport.Tables[2].Rows[u]["Expense_Type_Name"] + ")</th>");
                    }
                    sbTbl.Append("</tr>");
                }

                sbTbl.Append("</thead><tbody>");
        #endregion Report Header

                double[] subTotArray = new double[dsReport.Tables[2].Rows.Count];
                double[] subTotDocChemistArray = new double[4 - docCount];
                for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                {
                    subTotArray[u] = 0.00;
                }
                for (int u = 0; u < (4 - docCount); u++)
                {
                    subTotDocChemistArray[u] = 0.00;
                }

                #region Date Loop
                for (tempDate = fromDate; tempDate <= toDate; tempDate = tempDate.AddDays(1))
                {

                    string tempDateString = tempDate.ToString("dd/MM/yyyy");

                    DataRow[] dcrJson, holidayJson;
                    dcrJson = dsReport.Tables[3].Select("DCR_Actual_Date='" + tempDateString + "'");
                    holidayJson = dsReport.Tables[9].Select("Holiday_Date='" + tempDateString + "'");

                    // if dcr entered
                    if (dcrJson != null && dcrJson.Length > 0)
                    {
                        for (int k = 0; k < dcrJson.Length; k++)
                        {
                            sbTbl.Append("<tr>");
                            sbPrintTbl.Append("<tr>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                            sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                            string style = "";

                            #region Holiday or sunday
                            if ((holidayJson != null && holidayJson.Length > 0) || tempDate.DayOfWeek.ToString() == "Sunday")
                            {
                                style = "style='background-color: #d3d3d3;'";
                                string holidayOrSunday = "";
                                if (holidayJson != null && holidayJson.Length > 0)
                                {
                                    holidayOrSunday = "Holiday";
                                }
                                else
                                {
                                    holidayOrSunday = "Sunday";
                                }

                                sbTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                // Holiday/Sunday with Leave
                                if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                {
                                    DataRow[] ljson = dsReport.Tables[6].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                    if (ljson != null && ljson.Length > 0)
                                    {
                                        sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0]["Leave_Type_Name"] + ")</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + ljson[0]["Leave_Type_Name"] + ")</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                    }
                                }

                                    // Holiday/Sunday with Attendance
                                else if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                {
                                    DataRow[] lAttjson = dsReport.Tables[5].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                    if (lAttjson != null && lAttjson.Length > 0)
                                    {
                                        sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + lAttjson[0]["Activity_Name"] + ")</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + "-" + lAttjson[0]["Activity_Name"] + ")</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                        sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                    }
                                }

                                    // Holiday/Sunday with Field
                                else
                                {
                                    sbTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                    sbPrintTbl.Append("<td " + style + ">" + holidayOrSunday + "(" + dcrJson[k]["DCR_Type"] + ")</td>");
                                }
                            }

                            #endregion Holiday  or sunday

                            #region DCR Activity
                            else
                            {
                                style = "";
                                sbPrintTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                sbTbl.Append("<td " + style + ">" + tempDateString + "</td>");
                                // Only Leave
                                if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                                {

                                    DataRow[] lOnlyjson = dsReport.Tables[6].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                    if (lOnlyjson != null && lOnlyjson.Length > 0)
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyjson[0]["Leave_Type_Name"] + ")</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyjson[0]["Leave_Type_Name"] + ")</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                    }
                                }


                                    // Only Attendance
                                else if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                {
                                    DataRow[] lOnlyAttjson = dsReport.Tables[5].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "'");
                                    if (lOnlyAttjson != null && lOnlyAttjson.Length > 0)
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyAttjson[0]["Activity_Name"] + ")</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "(" + lOnlyAttjson[0]["Activity_Name"] + ")</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                    }

                                }

                                    // Only Field
                                else
                                {
                                    sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");

                                    sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Type"] + "</td>");
                                }
                            }
                            #endregion DCR Activity

                            if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                            {
                                sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                if (rowCount != 1)
                                {
                                    sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                }
                            }
                            else
                            {
                                if (activityStatus == "F,A" || (dcrJson[k]["DCR_Type"].ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k]["DCR_Type"].ToString() == "Attendance" && activityStatus.Contains("A")))
                                {
                                    sbTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                    if (rowCount != 1)
                                    {
                                        sbPrintTbl.Append("<td " + style + ">" + dcrJson[k]["DCR_Status"] + "</td>");
                                    }
                                }
                                else
                                {
                                    sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                    if (rowCount != 1)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }
                            }
                            //sri//
                            //for Leave
                            if (dcrJson[k]["DCR_Type"].ToString() == "Leave")
                            {
                                int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                                for (int u = 0; u < (10 + dynColumn - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                    }
                                }

                                for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                {
                                    if (u == 0)
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                    }
                                    else
                                    {
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                    }
                                }
                            }

                                //for Attendance and field
                            else
                            {
                                if (activityStatus == "F,A" || (dcrJson[k]["DCR_Type"].ToString() == "Field" && activityStatus.Contains("F")) || (dcrJson[k]["DCR_Type"].ToString() == "Attendance" && activityStatus.Contains("A")))
                                {

                                    sbTbl.Append("<td " + style + ">" + dcrJson[k]["Category"] + "</td>");
                                    sbTbl.Append("<td " + style + ">" + dcrJson[k]["Place_Worked"] + "</td>");

                                    sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Category"] + "</td>");
                                    sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Place_Worked"] + "</td>");

                                    // for HQ
                                    if (dcrJson[k]["Category"].ToString() == "HQ")
                                    {
                                        if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"].ToString() != "")
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");

                                            sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                            sbPrintTbl.Append("<td  " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                            totaldistance += Convert.ToInt32(dcrJson[k]["Travelled_Kms"]);
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + "></td>");
                                            sbTbl.Append("<td " + style + "></td>");
                                            sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                            sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                        }
                                    }

                                        // for other than HQ
                                    else
                                    {
                                        if (dcrJson[k]["From_Place"] != null && dcrJson[k]["From_Place"].ToString() != "")
                                        {
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                            sbTbl.Append("<td " + style + ">" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                            sbPrintTbl.Append("<td>" + dcrJson[k]["From_Place"] + "-" + dcrJson[k]["To_Place"] + "," + dcrJson[k]["Travel_Mode"] + "(" + dcrJson[k]["Travelled_Kms"] + ")</td>");
                                            sbPrintTbl.Append("<td>" + dcrJson[k]["Travelled_Kms"] + "</td>");
                                        }
                                        else
                                        {
                                            DataRow[] rdJson = dsReport.Tables[4].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_HOP_Flag='" + dcrJson[k]["Flag"] + "'");
                                            if (rdJson != null && rdJson.Length > 0)
                                            {
                                                // sbTbl.Append("<td " + style + ">");
                                                sbTbl.Append("<td " + style + ">");
                                                // sbPrintTbl.Append("<td " + style + ">");
                                                sbPrintTbl.Append("<td " + style + ">");
                                                for (int g = 0; g < rdJson.Length; g++)
                                                {
                                                    if (rdJson[g]["Route_Way"].ToString() != "R")
                                                    {
                                                        sbPrintTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                        // sbPrintTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                        sbTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                        //sbTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                    }
                                                    else
                                                    {
                                                        sbPrintTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ")</br>");
                                                        // sbPrintTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                        sbTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "," + rdJson[g]["Travel_Mode"] + "(" + rdJson[g]["Distance"] + ") </br>");
                                                        //  sbTbl.Append(rdJson[g]["Distance"] + "," + rdJson[g]["Travel_Mode"] + "</br>");
                                                    }
                                                }
                                                // sbTbl.Append("</td>");
                                                sbTbl.Append("</td>");
                                                // sbPrintTbl.Append("</td>");
                                                sbPrintTbl.Append("</td>");
                                            }
                                            else
                                            {
                                                // sbTbl.Append("<td " + style + "></td>");
                                                sbTbl.Append("<td " + style + "></td>");
                                                // sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                            }

                                            if (rdJson != null && rdJson.Length > 0)
                                            {
                                                // sbTbl.Append("<td " + style + ">");
                                                sbTbl.Append("<td " + style + ">");
                                                // sbPrintTbl.Append("<td " + style + ">");
                                                sbPrintTbl.Append("<td " + style + ">");
                                                double HopDistance = 0.0;
                                                for (int g = 0; g < rdJson.Length; g++)
                                                {
                                                    if (rdJson[g]["Route_Way"].ToString() != "R")
                                                    {
                                                        //sbPrintTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "</br>");
                                                        //sbPrintTbl.Append(rdJson[g]["Distance"] + "," + "</br>");
                                                        //sbTbl.Append(rdJson[g]["From_Place"] + "-" + rdJson[g]["To_Place"] + "</br>");
                                                        //added sri
                                                        //sbTbl.Append(rdJson[g]["Distance"] + "," + "</br>");
                                                        HopDistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                        totaldistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                    }
                                                    else
                                                    {
                                                        // sbPrintTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "</br>");
                                                        //sbPrintTbl.Append(rdJson[g]["Distance"] + "</br>");
                                                        // sbTbl.Append(rdJson[g]["To_Place"] + "-" + rdJson[g]["From_Place"] + "</br>");
                                                        // sbTbl.Append(rdJson[g]["Distance"] + "</br>");
                                                        HopDistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                        totaldistance += Convert.ToInt32(rdJson[g]["Distance"]);
                                                    }
                                                }
                                                sbTbl.Append(HopDistance);
                                                sbPrintTbl.Append(HopDistance);
                                                // sbTbl.Append("</td>");
                                                sbTbl.Append("</td>");
                                                // sbPrintTbl.Append("</td>");
                                                sbPrintTbl.Append("</td>");
                                            }
                                            else
                                            {
                                                // sbTbl.Append("<td " + style + "></td>");
                                                sbTbl.Append("<td " + style + "></td>");
                                                // sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                                sbPrintTbl.Append("<td " + style + ">&nbsp;</td>");
                                            }
                                        }
                                    }

                                    // doctor, chemist, accompanist detail
                                    if (docChemistMet.Length > 0)
                                    {
                                        if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                        {
                                            if (docChemistMet.Contains("D"))
                                            {
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>N/A</td>");
                                            }
                                            if (docChemistMet.Contains("C"))
                                            {
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                            }
                                            if (docChemistMet.Contains("M"))
                                            {
                                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                            }
                                        }
                                        else
                                        {
                                            int docChemistArrCount = 0;

                                            if (docChemistMet.Contains("D"))
                                            {
                                                DataRow[] drCountJson = dsDocDetails.Tables[0].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                if (drCountJson != null && drCountJson.Length > 0)
                                                {
                                                    sbTbl.Append("<td>" + drCountJson[0]["Doctor_Count"] + "</td>");
                                                    sbPrintTbl.Append("<td>" + drCountJson[0]["Doctor_Count"] + "</td>");
                                                    subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(drCountJson[0]["Doctor_Count"]);
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>-</td>");
                                                    sbPrintTbl.Append("<td>-</td>");
                                                }
                                                docChemistArrCount++;
                                            }

                                            if (docChemistMet.Contains("C"))
                                            {
                                                DataRow[] chemCountJson = dsChemDetails.Tables[0].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                if (chemCountJson != null && chemCountJson.Length > 0)
                                                {
                                                    sbTbl.Append("<td>" + chemCountJson[0]["Chemist_Count"] + "</td>");
                                                    sbPrintTbl.Append("<td>" + chemCountJson[0]["Chemist_Count"] + "</td>");
                                                    subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(chemCountJson[0]["Chemist_Count"]);
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>-</td>");
                                                    sbPrintTbl.Append("<td>-</td>");
                                                }
                                                docChemistArrCount++;

                                                DataRow[] chemPOBJson = dsChemDetails.Tables[1].Select("DCR_Actual_Date='" + tempDateString + "'");
                                                if (chemPOBJson != null && chemPOBJson.Length > 0)
                                                {
                                                    sbTbl.Append("<td>" + chemPOBJson[0]["PO_Amount"] + "</td>");
                                                    sbPrintTbl.Append("<td>" + chemPOBJson[0]["PO_Amount"] + "</td>");
                                                    subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(chemPOBJson[0]["PO_Amount"]);
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>-</td>");
                                                    sbPrintTbl.Append("<td>-</td>");
                                                }
                                                docChemistArrCount++;
                                            }

                                            if (docChemistMet.Contains("M"))
                                            {
                                                DataRow[] mangrJson = dsManagerDetails.Tables[0].Select("DCR_Date='" + tempDateString + "'");

                                                if (mangrJson != null && mangrJson.Length > 0)
                                                {
                                                    if (mangrJson[0]["Acc_Count"].ToString() == "0")
                                                    {
                                                        sbTbl.Append("<td>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                    }
                                                    else
                                                    {
                                                        sbTbl.Append("<td class='td-a' onclick=fnOpenAccompanistDetails(\"" + mangrJson[0]["DCR_Date"] + "\")>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                    }
                                                    sbPrintTbl.Append("<td>" + mangrJson[0]["Acc_Count"] + "</td>");
                                                    subTotDocChemistArray[docChemistArrCount] += Convert.ToDouble(mangrJson[0]["Acc_Count"]);
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>-</td>");
                                                    sbPrintTbl.Append("<td>-</td>");
                                                }
                                            }
                                        }
                                    }

                                    // Expense details
                                    for (int u = 0; u < dsReport.Tables[2].Rows.Count; u++)
                                    {
                                        // sub total for print.                                            
                                        DataRow[] expMode = null;
                                        if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                        {
                                            expMode = dsReport.Tables[8].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND Flag='A' AND Expense_Type_Code='" + dsReport.Tables[2].Rows[u]["Expense_Type_Code"] + "'");
                                        }
                                        else if (dcrJson[k]["DCR_Type"].ToString() == "Field")
                                        {
                                            expMode = dsReport.Tables[8].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND Flag='F' AND Expense_Type_Code='" + dsReport.Tables[2].Rows[u]["Expense_Type_Code"] + "'");
                                        }

                                        if (expMode != null && expMode.Length > 0)
                                        {
                                            sbTbl.Append("<td " + style + ">" + ((expMode[0]["Expense_Mode"] == null) ? "-" : expMode[0]["Expense_Mode"]) + "</td>");
                                            sbTbl.Append("<td style='text-align:center'>" + ((expMode[0]["Eligibility_Amount"] == null) ? "-" : Convert.ToDouble(expMode[0]["Eligibility_Amount"]).ToString("N2")) + "</td>");
                                            sbTbl.Append("<td style='text-align:center'>" + ((expMode[0]["Expense_Amount"] == null) ? "0.00" : Convert.ToDouble(expMode[0]["Expense_Amount"]).ToString("N2")) + "</td>");

                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>" + ((expMode[0]["Expense_Amount"] == null) ? "0.00" : Convert.ToDouble(expMode[0]["Expense_Amount"]).ToString("N2")) + "</td>");

                                            if (expMode[0]["Expense_Amount"].GetType() == typeof(double) && expMode[0]["Expense_Amount"] != null && expMode[0]["Expense_Amount"].ToString() != "")
                                            {
                                                subTotArray[u] += Convert.ToDouble(expMode[0]["Expense_Amount"]);
                                            }
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td " + style + ">-</td>");
                                            sbTbl.Append("<td " + style + " align='right'>-</td>");
                                            sbTbl.Append("<td " + style + " align='right'>-</td>");
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>-</td>");
                                        }
                                    }

                                    // total expense
                                    DataRow[] expJson = null;
                                    if (dcrJson[k]["DCR_Type"].ToString() == "Attendance")
                                    {
                                        expJson = dsReport.Tables[7].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_Flag='A'");
                                    }
                                    else if (dcrJson[k]["DCR_Type"].ToString() == "Field")
                                    {
                                        expJson = dsReport.Tables[7].Select("DCR_Code='" + dcrJson[k]["DCR_Code"] + "' AND DCR_Flag='F'");
                                    }
                                    for (int i = 0; i < expJson.Count(); i++)
                                    {
                                        if (expJson != null && expJson.Length > 0)
                                        {
                                            totalExp = totalExp + Convert.ToDouble(expJson[i]["Total"]);
                                        }
                                    }

                                    if (expJson != null && expJson.Length > 0)
                                    {
                                        sbTbl.Append("<td style='text-align:center' class='td-a' onclick='fnShowExpenseAnalysisDetails(\"" + expJson[0]["DCR_Code"] + "_" + expJson[0]["DCR_Flag"] + "\")'>" + Convert.ToDouble(expJson[0]["Total"]).ToString("N2") + "</td>");

                                        //sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>" + totalExp + "</td>");
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>" + Convert.ToDouble(expJson[0]["Total"]).ToString("N2") + "</td>");


                                        //Remarks
                                        sbTbl.Append("<td >" + expJson[0]["Remarks"].ToString().TrimEnd(',') + "</td>");
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;text-align:center;'>" + expJson[0]["Remarks"].ToString().TrimEnd(',') + "</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td " + style + " align='right'>-</td>");
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;' align='right'>-</td>");

                                        // remarks
                                        sbTbl.Append("<td " + style + ">-</td>");
                                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;text-align:center;'>-</td>");
                                    }
                                }
                                else
                                {
                                    int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                                    for (int u = 0; u < (10 + dynColumn - docCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                                        }
                                    }

                                    for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                                    {
                                        if (u == 0)
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                        }
                                        else
                                        {
                                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                        }
                                    }
                                }
                            }
                            sbTbl.Append("</tr>");
                            sbPrintTbl.Append("</tr>");
                        }

                    }

                        // holiday entered
                    #region Holiday
                    else if (holidayJson != null && holidayJson.Length > 0)
                    {
                        sbTbl.Append("<tr>");
                        sbPrintTbl.Append("<tr>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        if (tempDate.DayOfWeek.ToString() == "Sunday")
                        { // holiday on sunday
                            sbTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0]["Holiday"] + ")</td>");
                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday(Holiday-" + holidayJson[0]["Holiday"] + ")</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0]["Holiday"] + ")</td>");
                            sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Holiday(" + holidayJson[0]["Holiday"] + ")</td>");
                        }

                        int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                        for (int u = 0; u < (11 + dynColumn - docCount); u++)
                        {
                            sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                        }
                        if (rowCount == 1)
                        {
                            for (int u = 0; u < (10 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {

                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                            }
                        }
                        else
                        {
                            for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {

                                sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                            }
                        }
                        sbTbl.Append("</tr>");
                        sbPrintTbl.Append("</tr>");
                    }
                    #endregion Holiday

                    #region Sunday
                    // Sunday
                    else if (tempDate.DayOfWeek.ToString() == "Sunday")
                    {
                        sbTbl.Append("<tr>");
                        sbPrintTbl.Append("<tr>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                        sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                        for (int u = 0; u < (12 + dynColumn - docCount); u++)
                        {
                            if (u == 0)
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                            }
                            else
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");
                            }
                        }

                        if (rowCount == 1)
                        {
                            for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                }
                                else
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }
                        }
                        else
                        {
                            for (int u = 0; u < (12 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>Sunday</td>");
                                }
                                else
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }

                        }

                        sbTbl.Append("</tr>");
                        sbPrintTbl.Append("</tr>");
                    }
                    #endregion Sunday

                    // No Report
                    #region No REport
                    else
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Division_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["DOJ"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Manager_Region_Name"] + "</td>");
                        sbTbl.Append("<td style='display:none'>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");

                        sbTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>" + tempDateString + "</td>");
                        int dynColumn = dsReport.Tables[2].Rows.Count * 3;
                        for (int u = 0; u < (12 + dynColumn - docCount); u++)
                        {
                            if (u == 0)
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                            }
                            else
                            {
                                sbTbl.Append("<td style='background-color: #d3d3d3;'></td>");

                            }
                        }

                        if (rowCount == 1)
                        {
                            for (int u = 0; u < (11 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                }
                                else
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }
                        }
                        else
                        {

                            for (int u = 0; u < (12 + dsReport.Tables[2].Rows.Count - docCount); u++)
                            {
                                if (u == 0)
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>-</td>");
                                }
                                else
                                {
                                    sbPrintTbl.Append("<td style='background-color: #d3d3d3;'>&nbsp;</td>");
                                }
                            }
                        }
                        sbTbl.Append("</tr>");
                        sbPrintTbl.Append("</tr>");

                    }
                    #endregion No REport
                }
                #endregion Date Loop
                sbTbl.Append("</tbody><tfoot align='left'><tr>");
                sbPrintTbl.Append("<tr>");
                //sbTbl.Append("<th colspan='" + dynColumn + "'>Total Expense : " + totalExp.toFixed(2) + "</th>");
                int totInx = 14 + (4 - docCount) + (dsReport.Tables[2].Rows.Count * 3);
                int startInx = 14 + (4 - docCount);
                int subCnt = 0;
                int skipFrst = 1;
                int docTotalStrt = startInx - (4 - docCount);
                int docChemArrCount = 0;

                #region footer
                for (int c = 0; c < totInx + 2; c++)
                {
                    if (c < 7)
                    {
                        sbTbl.Append("<th style='display:none;'></th>");
                        //sbPrintTbl.Append("<th style='display:none;'></th>");
                    }
                    else if (c >= startInx)
                    {



                        if (c == totInx)
                        {
                            sbTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                            sbPrintTbl.Append("<th align='right'>" + totalExp.ToString("N2") + "</th>");
                        }
                        else if (c > totInx) // for remarks
                        {
                            sbTbl.Append("<th align='right'></th>");
                            sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                        }
                        else
                        {
                            if (skipFrst == 3)
                            {
                                sbTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                sbPrintTbl.Append("<th align='right'>" + subTotArray[subCnt].ToString("N2") + "</th>");
                                subCnt++;
                                skipFrst = 0;
                            }
                            else
                            {
                                sbTbl.Append("<th align='right'></th>");
                            }
                            skipFrst++;
                        }
                    }
                    else
                    {
                        if (c >= docTotalStrt)
                        {
                            sbTbl.Append("<th align='left'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                            sbPrintTbl.Append("<th align='left'>" + subTotDocChemistArray[docChemArrCount].ToString() + "</th>");
                            docChemArrCount++;
                        }
                        else if (c == (docTotalStrt - 1))
                        {
                            sbTbl.Append("<th align='right'>" + totaldistance.ToString("N2") + "</th>");
                            sbPrintTbl.Append("<th align='right'>" + totaldistance.ToString("N2") + "</th>");
                        }
                        else if (c == (docTotalStrt - 2))
                        {
                            sbTbl.Append("<th align='left'>Total</th>");
                            sbPrintTbl.Append("<th align='left'><b>Grand Total</b></th>");
                        }
                        else
                        {
                            sbTbl.Append("<th align='right'></th>");
                            sbPrintTbl.Append("<th align='right'>&nbsp;</th>");
                        }

                    }

                }
                #endregion footer
                sbTbl.Append("</tr></tfoot></table></div></br>");
                sbPrintTbl.Append("</tr></tbody></table></div></br>");

                sbTableContentExcel.Append(sbTbl.ToString());
                if (reportName == "CURRENTUSER")
                {
                    sbTbl.Append("<div style='float: left;width: 100%;margin-top: 30px;font-size: 14px;margin-bottom: 20px;'><a class='td-a' onclick='fnComprehensiveAnalysisReportopen(\"" + userCodecom + "\");'>Show Comprehensive Analysis Report</a></div>");
                }

                // for Excel and print 
                sbFooter.Append("<br />");
                sbFooter.Append("<table border='1' cellspacing='0' cellpadding='0' style='float:right;'><thead>");
                sbFooter.Append("<tr style='height:50px;'>");
                sbFooter.Append("<td style='width:300px;'>Signature:</td><td style='width:300px;'>Signature:</td>");
                sbFooter.Append("</tr>");
                sbFooter.Append("<tr>");
                sbFooter.Append("<td style='width:300px;'>Employee Name : " + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td><td style='width:300px;'>Reporting Manager Employee Name : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Name"] + "</td>");
                sbFooter.Append("</tr>");
                sbFooter.Append("<tr>");
                sbFooter.Append("<td style='width:300px;'>Employee No : " + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</td><td style='width:300px;'>Reporting Manager Employee No : " + dsReport.Tables[0].Rows[0]["Manager_Emp_Number"] + "</td>");
                sbFooter.Append("</tr>");
                sbFooter.Append("</thead></table>");

                sbTableContentExcel.Append(sbFooter.ToString());
                sbPrintTbl.Append(sbFooter.ToString());


                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objCur.GetUserName();
                string subDomin = _objCur.GetSubDomain();
                string fileName = "ExpenseAnalysisGroupWiseReport_" + "_" + subDomin + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");

                totalExp = totalExp - otherDedcution;
                //sbPrintTbl.Append("</tbody></table> <div style='font-weight:bold;text-align:right'>Total Expense : " + totalExp.toFixed(2) + "</div> ");
                return sbTbl.ToString() + "$" + sbPrintTbl.ToString() + "$" + totalExp.ToString() + "$" + Convert.ToString(dsReport.Tables[2].Rows.Count) + "$" + docCount + "$" + blobUrl + "$" + totaldistance.ToString();

            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                dicObj.Add("dateFrom", dateFrom);
                dicObj.Add("dateTo", dateTo);

                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }

        }

        public string GetExpenseClaimDetailsPopUp(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                string bloburl = string.Empty;

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseClaimDetailPopUp '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + collection["claimCode"].ToString() + "','" + collection["entity"].ToString() + "'");
                bloburl = GetExpenseClaimDetailsExcel(collection["userCode"].ToString(), collection["claimCode"].ToString());
                return json.Serialize(dsReport) + "$" + bloburl;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetExpenseClaimDetailsPopUpBillWise(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();

                StringBuilder sbTableContent = new StringBuilder();
                StringBuilder sbUserTableContent = new StringBuilder();
                string blobUrl = string.Empty;

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseClaimDetailPopUp '" + _objcurrentInfo.GetCompanyCode() + "', '" + collection["userCode"].ToString() + "','" + collection["claimCode"].ToString() + "','" + collection["entity"].ToString() + "'");

                if (dsReport.Tables.Count > 0 && dsReport.Tables[2].Rows.Count > 0)
                {
                    sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' style='margin-top:10px;'  id='tblBillWise' class='data display dataTable box'>");
                    sbTableContent.Append("<thead>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th>DCR Date</th>");
                    sbTableContent.Append("<th>Category</th>");
                    sbTableContent.Append("<th>Expense Type</th>");
                    sbTableContent.Append("<th>Bill No</th>");
                    sbTableContent.Append("<th>Claimed</th>");
                    sbTableContent.Append("<th>Deduction</th>");
                    sbTableContent.Append("<th>Approved</th>");

                    sbTableContent.Append("<th class='expRem'>User Remarks</th>");
                    sbTableContent.Append("<th class='expRem'>Approver Remarks</th>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead><tbody>");
                    for (var k = 0; k < dsReport.Tables[2].Rows.Count; k++)
                    {
                        sbTableContent.Append("<tr>");

                        sbTableContent.Append("<td>" + dsReport.Tables[2].Rows[k]["DCR_Actual_Date"] + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[2].Rows[k]["Category"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Category"]) + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[2].Rows[k]["Expense_Type_Name"] + "</td>");
                        sbTableContent.Append("<td>" + dsReport.Tables[2].Rows[k]["Bill_Number"] + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[2].Rows[k]["Expense_Amount"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Expense_Amount"]) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[2].Rows[k]["Deduction_Amount"] == System.DBNull.Value) ? "-" : Convert.ToDouble(dsReport.Tables[2].Rows[k]["Deduction_Amount"]).ToString("N2")) + "</td>");
                        sbTableContent.Append("<td>" + ((dsReport.Tables[2].Rows[k]["Approved_Amount"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Approved_Amount"]) + "</td>");

                        sbTableContent.Append("<td class='expRem' title='" + ((dsReport.Tables[2].Rows[k]["Remarks_By_User"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Remarks_By_User"]) + "'>" + ((dsReport.Tables[2].Rows[k]["Remarks_By_User"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Remarks_By_User"]) + "</td>");
                        sbTableContent.Append("<td class='expRem' title='" + ((dsReport.Tables[2].Rows[k]["Managers_Approval_Remark"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Managers_Approval_Remark"]) + "'>" + ((dsReport.Tables[2].Rows[k]["Managers_Approval_Remark"] == System.DBNull.Value) ? "-" : dsReport.Tables[2].Rows[k]["Managers_Approval_Remark"]) + "</td>");

                        sbTableContent.Append("</tr>");
                    }
                    sbTableContent.Append("</tbody></table>");

                    // User detail

                    sbUserTableContent.Append("<table>");
                    sbUserTableContent.Append("<tr>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>User Name:</td><td>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Employee Name:</td><td>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Territory Name:</td><td>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");
                    sbUserTableContent.Append("</tr>");

                    sbUserTableContent.Append("<tr>");
                    if (dsReport.Tables[1].Rows.Count > 0)
                    {
                        sbUserTableContent.Append("<td style='font-weight:bold;'>Division:</td><td>" + dsReport.Tables[1].Rows[0]["Division_Name"] + "</td>");
                    }
                    else
                    {
                        sbUserTableContent.Append("<td style='font-weight:bold;'>Division:</td><td>N/A</td>");
                    }
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Employee Number</td><td>" + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Reporting Manager :</td><td>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + " (" + dsReport.Tables[0].Rows[0]["Manager_Id"] + ")</td>");
                    sbUserTableContent.Append("</tr>");

                    sbUserTableContent.Append("<tr>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>PAN:</td><td>" + ((dsReport.Tables[0].Rows[0]["PAN_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["PAN_Number"]) + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>PF No:</td><td>" + ((dsReport.Tables[0].Rows[0]["PF_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["PF_Number"]) + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Bank Acc No:</td><td>" + ((dsReport.Tables[0].Rows[0]["Acc_No"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["Acc_No"]) + "</td>");
                    sbUserTableContent.Append("</tr>");
                    sbUserTableContent.Append("<tr>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Employee Mobile No</td><td>" + ((dsReport.Tables[0].Rows[0]["Mobile"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</td>");
                    sbUserTableContent.Append("<td></td><td></td>");
                    sbUserTableContent.Append("<td></td><td></td>");
                    sbUserTableContent.Append("</tr>");

                    sbUserTableContent.Append("<tr>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Claim Request No:</td><td>" + collection["claimCode"].ToString() + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>DCR Submitted Period:</td><td>" + dsReport.Tables[0].Rows[0]["Date_From"] + " to " + dsReport.Tables[0].Rows[0]["Date_To"] + "</td>");
                    sbUserTableContent.Append("<td style='font-weight:bold;'>Request Submitted Date:</td><td>" + dsReport.Tables[0].Rows[0]["Entered_DateTime"] + "</td>");
                    sbUserTableContent.Append("</tr></table>");

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = _objcurrentInfo.GetUserName();
                    string subdomine = _objcurrentInfo.GetSubDomain();
                    string fileName = "EXPENSECLAIMBILLWISE_" + "_" + subdomine + "_" + userName + ".xls";

                    blobUrl = objAzureBlob.AzureBlobUploadText(sbUserTableContent.ToString() + sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");

                }
                return sbTableContent.ToString() + "$" + blobUrl;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetExpenseClaimDetailsExcel(string userCode, string claimCode)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                StringBuilder sbTableContent = new StringBuilder();
                string blobUrl = string.Empty;

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetExpenseClaimDetailExcelExport '" + _objcurrentInfo.GetCompanyCode() + "', '" + userCode + "','" + claimCode + "'");
                if (dsReport != null && dsReport.Tables.Count > 0 && dsReport.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<table>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='font-weight:bold;'>User Name:</td><td>" + dsReport.Tables[0].Rows[0]["User_Name"] + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Employee Name:</td><td>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Territory Name:</td><td>" + dsReport.Tables[0].Rows[0]["Region_Name"] + "</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    if (dsReport.Tables[1].Rows.Count > 0)
                    {
                        sbTableContent.Append("<td style='font-weight:bold;'>Division:</td><td>" + dsReport.Tables[1].Rows[0]["Division_Name"] + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td style='font-weight:bold;'>Division:</td><td>N/A</td>");
                    }
                    sbTableContent.Append("<td style='font-weight:bold;'>Employee Number</td><td>" + dsReport.Tables[0].Rows[0]["Employee_Number"] + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Reporting Manager :</td><td>" + dsReport.Tables[0].Rows[0]["Manager_Name"] + " (" + dsReport.Tables[0].Rows[0]["Manager_Id"] + ")</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='font-weight:bold;'>PAN:</td><td>" + ((dsReport.Tables[0].Rows[0]["PAN_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["PAN_Number"]) + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>PF No:</td><td>" + ((dsReport.Tables[0].Rows[0]["PF_Number"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["PF_Number"]) + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Bank Acc No:</td><td>" + ((dsReport.Tables[0].Rows[0]["Acc_No"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["Acc_No"]) + "</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Employee Mobile No</td><td>" + ((dsReport.Tables[0].Rows[0]["Mobile"].ToString() == "") ? "N/A" : dsReport.Tables[0].Rows[0]["Mobile"]) + "</td>");
                    sbTableContent.Append("<td></td><td></td>");
                    sbTableContent.Append("<td></td><td></td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Claim Request No:</td><td>" + claimCode + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>DCR Submitted Period:</td><td>" + dsReport.Tables[0].Rows[0]["Date_From"] + " to " + dsReport.Tables[0].Rows[0]["Date_To"] + "</td>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Request Submitted Date:</td><td>" + dsReport.Tables[0].Rows[0]["Entered_DateTime"] + "</td>");
                    sbTableContent.Append("</tr>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='font-weight:bold;'>Other Deduction</td><td>" + dsReport.Tables[0].Rows[0]["Other_Deduction"] + "</td>");
                    sbTableContent.Append("<td></td><td></td>");
                    sbTableContent.Append("<td></td><td></td>");

                    sbTableContent.Append("</tr></table>");

                    sbTableContent.Append("<table>");

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th >DCR Date</th>");
                    for (int l = 0; l < dsReport.Tables[3].Rows.Count; l++)
                    {
                        sbTableContent.Append("<th>" + dsReport.Tables[3].Rows[l]["Expense_Type_Name"] + "</th>");
                    }
                    sbTableContent.Append("<th>Expense Amount</th>");
                    sbTableContent.Append("<th>Bill Number</th>");
                    sbTableContent.Append("<th>Category</th>");
                    sbTableContent.Append("</tr>");

                    for (var j = 0; j < dsReport.Tables[2].Rows.Count; j++)
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td align='left'>" + dsReport.Tables[2].Rows[j]["DCR_Actual_Date"] + "</td>");
                        double tot = 0.0;
                        for (int l = 0; l < dsReport.Tables[3].Rows.Count; l++)
                        {
                            string expTypeCode = dsReport.Tables[3].Rows[l]["Expense_Type_Code"].ToString();
                            double amount = (dsReport.Tables[2].Rows[j][expTypeCode] == System.DBNull.Value) ? 0.0 : Convert.ToDouble(dsReport.Tables[2].Rows[j][expTypeCode]);
                            sbTableContent.Append("<td>" + ((amount == null) ? "" : amount.ToString()) + "</td>");
                            if (amount != null)
                            {
                                tot += amount;
                            }
                        }
                        sbTableContent.Append("<td>" + tot.ToString("N2") + "</td>");
                        var billJson = dsReport.Tables[4].AsEnumerable().Where(a => a["DCR_Actual_Date"].ToString().Equals(dsReport.Tables[2].Rows[j]["DCR_Actual_Date"].ToString())).FirstOrDefault();
                        //jsonPath(jsReport, "$.Tables[4].Rows[?(@.DCR_Actual_Date=='" + dsReport.Tables[2].Rows[j]["DCR_Actual_Date"] + "')]");
                        if (billJson != null)
                        {
                            sbTableContent.Append("<td>" + billJson["Bill_Number"].ToString() + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>-</td>");
                        }
                        sbTableContent.Append("<td>" + dsReport.Tables[2].Rows[j]["Category"] + "</td>");
                        sbTableContent.Append("</tr>");
                    }
                    sbTableContent.Append("</table>");
                }
                else
                {
                    sbTableContent.Append("<div>No Expense Claim Details found.</div>");
                }

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string subDomine = _objcurrentInfo.GetSubDomain();
                string fileName = "EXPENSECLAIMDETAIL_" + "_" + subDomine + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
                return blobUrl;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------------- end- expense claim report -------------------

        //------------------- start- expense analysis - Alumni report -------------------
        public JsonResult GetDisabledUsers()
        {
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_hdGetDisabledUsers '" + _objcurrentInfo.GetCompanyCode() + "'");
                }

                return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        // Start->Expense Analysis Alumni – Group wise (New Tree Generate with Employee Name(UserName),User_Type_Name,Region_Name)
        public JsonResult GetDisabledUsers_New()
        {
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_hdGetDisabledUsers_New '" + _objcurrentInfo.GetCompanyCode() + "'");
                }

                return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetselectedDisabledUsers_New(string EmployeeName)
        {
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_HdGetSearchDisabledUsers_New '" + _objcurrentInfo.GetCompanyCode() + "','" + EmployeeName + "'");
                }

                return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //End Expense Analysis Alumni – Group wise

        public JsonResult GetselectedDisabledUsers(string userName)
        {
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_HdGetSearchDisabledUsers '" + _objcurrentInfo.GetCompanyCode() + "','" + userName + "'");
                }

                return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDisabledUsersWithMatchingString(string matchingString)
        {
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_hdGetDisabledUsersWithMatchingString '" + _objcurrentInfo.GetCompanyCode() + "','" + matchingString + "'");
                }

                return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //------------------- end- expense analysis - Alumni report -------------------

        //********* TP REPORT **********************

        public JsonResult GetTpReport(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdTpplanReport " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetTpDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string Date = string.Empty;
                Date = collection["date"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_hd_TpDoctorDetails " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + Date.Split('/')[2] + "-" + Date.Split('/')[1] + "-" + Date.Split('/')[0] + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //********* TP REPORT**********************//

        //********* Target REPORT**********************//
        public JsonResult GetTargetDetails(FormCollection collection)
        {
            try
            {
                string RegionCode = string.Empty;
                RegionCode = collection["RegionCode"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string regionCodes = "";
                DataSet dsChildRegion = _objSPData.dsChildRegion(_objcurrentInfo.GetCompanyCode(), RegionCode);
                if (dsChildRegion.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                    {
                        regionCodes += "''" + dr["Region_Code"].ToString() + "'',";
                    }

                }

                if (!string.IsNullOrEmpty(regionCodes))
                {
                    regionCodes = regionCodes.TrimEnd(',');
                }
                else
                {
                    regionCodes = "''";
                }

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdTargetreportDetails " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + regionCodes + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //********* Target Region wise REPORT**********************//
        public JsonResult GetTargetRegionWise(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string targetName = string.Empty;
                targetName = collection["TargetName"];
                string Year = string.Empty;
                //Year = collection["year"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdTargetRegionProduct_select " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + targetName + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GettargetName(FormCollection collection)
        {
            try
            {
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_HDTargetnameselect '" + _objcurrentInfo.GetCompanyCode() + "'");

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        private int GetNumberOfSundays(Int32 Month, Int32 Year)
        {
            DateTime StartDate = Convert.ToDateTime(Month.ToString() + "/01/" + Year.ToString());
            Int32 iDays = DateTime.DaysInMonth(Year, Month);
            DateTime EndDate = StartDate.AddDays(iDays - 1);
            Int32 Count = 0;
            Int32 SundayCount = 0;
            while (StartDate.DayOfWeek != DayOfWeek.Sunday)
            {
                StartDate = StartDate.AddDays(1);
            }
            SundayCount = 1;
            StartDate = StartDate.AddDays(7);
            while (StartDate <= EndDate)
            {
                SundayCount += 1; StartDate = StartDate.AddDays(7);
            }
            return SundayCount;
        }
        public string visitCountDetails(int number)
        {
            string result = string.Empty;
            if (1 == number)
            {
                result = "Once";
            }
            if (2 == number)
            {
                result = "Twice";
            }
            if (3 == number)
            {
                result = "Thrice";
            }
            if (4 == number)
            {
                result = "Four";
            }
            return result;
        }
        public string GetSalesAndActivityPerformance(FormCollection collection)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder strDetails = new StringBuilder();
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();


                int month = Convert.ToInt32(collection["month"]);
                string endDate = "";
                int currentMonth = System.DateTime.Now.Month;
                string startDate = "";
                if (currentMonth <= 3)
                {
                    startDate = (DateTime.Now.Year) - 1 + "-04-01";
                }
                else
                {
                    startDate = DateTime.Now.Year + "-04-01";
                }

                DateTime dtStartDate = Convert.ToDateTime(startDate);
                DateTime dtEndDate = dtStartDate.AddMonths(Convert.ToInt32(month));
                startDate = dtStartDate.ToString("yyyy-MM-dd");
                // endDate = dtEndDate.ToString("yyyy-MM-dd");
                string regionCode = collection["regionCode"].ToString();

                int days = DateTime.DaysInMonth(dtEndDate.Year, dtEndDate.Month);

                endDate = dtEndDate.Year + "-" + dtEndDate.Month + "-" + days;

                //_objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                // dsReport = _objData.ExecuteDataSet("exec SP_hdGetSalesAndActivityPerformance '" + _objcurrentInfo.GetCompanyCode() + "', " + regionCode + ",'" + startDate + "','" + endDate + "'");
                // dsReport = _objSPData.GetSalesAndActivityPerformance(_objcurrentInfo.GetCompanyCode(), regionCode, startDate, endDate);
                BL_Report objReport = new BL_Report();
                dsReport = objReport.GetSalesAndActivityPerformance(_objcurrentInfo.GetCompanyCode(), regionCode, startDate, endDate);

                DataSet dsParentRegion = new DataSet();
                dsParentRegion = _objSPData.dsParentRegion(_objcurrentInfo.GetCompanyCode(), regionCode);

                string regionCodes = "";
                foreach (DataRow dr in dsParentRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }

                if (!string.IsNullOrEmpty(regionCodes))
                {
                    regionCodes = regionCodes.TrimEnd(',');
                }
                else
                {
                    regionCodes = "''";
                }

                DataSet dsUserDetails = new DataSet();
                dsUserDetails = _objSPData.dsRegionCodeWiseUser(_objcurrentInfo.GetCompanyCode(), regionCodes);
                DataTable dt = new DataTable();

                dt.Columns.Add("Region_Code");
                dt.Columns.Add("Region_Name");
                dt.Columns.Add("Region_Type_Name");
                dt.Columns.Add("User_Name");
                dt.Columns.Add("User_Type_Name");
                dt.AcceptChanges();
                DataRow drNewRow;
                DataRow[] drFilter;


                foreach (DataRow dr in dsParentRegion.Tables[0].Rows)
                {
                    drNewRow = dt.NewRow();
                    drNewRow["Region_Code"] = dr["Region_Code"].ToString();
                    drNewRow["Region_Name"] = dr["Region_Name"].ToString();
                    drNewRow["Region_Type_Name"] = dr["Region_Type_Name"].ToString();

                    drFilter = dsUserDetails.Tables[0].Select("Region_Code='" + dr["Region_Code"].ToString() + "'");
                    if (drFilter.Length > 0)
                    {
                        drNewRow["User_Name"] = drFilter[0]["User_Name"].ToString().Trim();
                        drNewRow["User_Type_Name"] = drFilter[0]["User_Type_Name"].ToString().Trim();
                    }
                    else
                    {
                        drNewRow["User_Name"] = "Empty";
                        drNewRow["User_Type_Name"] = "Empty";
                    }
                    dt.Rows.Add(drNewRow);
                    dt.AcceptChanges();
                }

                dsReport.Tables.Add(dt);
                dsReport.AcceptChanges();

                DataSet dsHoliday = new DataSet();
                DataTable dtHoli = new DataTable();
                dtHoli.Columns.Add("Region_Code");
                dtHoli.Columns.Add("Month");
                dtHoli.Columns.Add("Holiday_Name");
                // dsHoliday = _objSPData.GetHolidayDetails(_objcurrentInfo.GetCompanyCode(), regionCode, regionCodes, startDate, endDate, "");
                dsHoliday = objReport.GetHolidayDetails(_objcurrentInfo.GetCompanyCode(), regionCode, regionCodes, startDate, endDate, "");
                foreach (DataRow drSub in dsHoliday.Tables[0].Rows)
                {
                    DataRow dataRow = dtHoli.NewRow();
                    dataRow["Region_Code"] = regionCode;
                    dataRow["Month"] = drSub["Month"].ToString();
                    dataRow["Holiday_Name"] = drSub["Holiday"].ToString();
                    dtHoli.Rows.Add(dataRow);
                }
                dsReport.Tables.Add(dtHoli);
                dsReport.AcceptChanges();
                #region generate report html string

                double quterCount = 0, quter = 0, monthCount = 0, yearCount = 0, monthAvg = 0, yearAvg = 0; ;
                List<string> monthList = new List<string>();
                int currentMonths, currentYear;//System.DateTime.Now.Month.ToString() + "_" + System.DateTime.Now.Year.ToString();
                currentMonths = System.DateTime.Now.Month;
                currentYear = System.DateTime.Now.Year;
                if (Convert.ToInt32(currentMonths) <= 3)
                {
                    currentYear = Convert.ToInt32(currentYear) - 1;
                }

                monthList.Add("Apr_4"); monthList.Add("May_5"); monthList.Add("Jun_6"); monthList.Add("Jul_7");
                monthList.Add("Aug_8"); monthList.Add("Sep_9"); monthList.Add("Oct_10"); monthList.Add("Nov_11");
                monthList.Add("Dec_12"); monthList.Add("Jan_1"); monthList.Add("Feb_2"); monthList.Add("Mar_3");
                if (dsReport.Tables[0].Rows.Count > 0)
                {
                    tableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >");
                    tableContent.Append("<thead><tr>");
                    tableContent.Append("<th colspan='6'>User Details</th>");
                    tableContent.Append("</tr></thead>");
                    tableContent.Append("<tbody>");
                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left' width='15%'>User Name</td>");
                    tableContent.Append("<td align='left' width='15%'>" + dsReport.Tables[0].Rows[0]["User_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left' width='15%'>Division Name</td>");
                    DataRow[] dr = dsReport.Tables[1].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                    StringBuilder strDivision = new StringBuilder();
                    if (dr.Length > 0)
                    {
                        foreach (DataRow drr in dr)
                        {
                            strDivision.Append(drr["Division_Name"].ToString() + ",");
                        }
                        tableContent.Append("<td align='left' width='15%'>" + strDivision.ToString().TrimEnd(',') + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left' width='15%'></td>");
                    }
                    tableContent.Append("<td align='left' width='15%'>Manager Name</td>");
                    tableContent.Append("<td align='left' width='15%'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Manager_Name"]) + "</td></tr>");

                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left' width='15%'>Employee Name</td>");
                    tableContent.Append("<td align='left' width='15%'>" + dsReport.Tables[0].Rows[0]["Employee_Name"] + "</td>");
                    tableContent.Append("<td align='left' width='15%'>Date of Joining</td>");
                    if (Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) != null && Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) != "")
                    {
                        tableContent.Append("<td align='left' width='15%'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left' width='15%'></td>");
                    }
                    tableContent.Append("<td align='left' width='15%'>Manager Territory name</td>");
                    tableContent.Append("<td align='left' width='15%'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Manager_Region_Name"]) + "</td></tr>");
                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left' width='15%'>Region Name</td>");
                    tableContent.Append("<td align='left' width='15%' colspan='5'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Region_Name"]) + "</td></tr>");
                    tableContent.Append("</tbody>");
                    tableContent.Append("</table>");
                    // $("#divHeader").html(tableContent);

                    //  tableContent = "";
                    StringBuilder tableContentH = new StringBuilder();
                    tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["User_Name"]) + "</td>");
                    tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Region_Name"]) + "</td>");
                    tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Employee_Name"]) + "</td>");
                    tableContentH.Append("<td align='left' style='display:none'>" + strDivision.ToString() + "</td>");
                    if (Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) != null && Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) != "")
                    {
                        tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["DOJ"]) + "</td>");
                    }
                    else
                    {
                        tableContentH.Append("<td align='left' style='display:none'></td>");
                    }
                    tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Manager_Name"]) + "</td>");
                    tableContentH.Append("<td align='left' style='display:none'>" + Convert.ToString(dsReport.Tables[0].Rows[0]["Manager_Region_Name"]) + "</td>");


                    strDetails.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >");
                    strDetails.Append("<thead><tr>");

                    strDetails.Append("<th align='left' style='display:none'>User Name</th>");
                    strDetails.Append("<th align='left' style='display:none'>Region Name</th>");
                    strDetails.Append("<th align='left' style='display:none'>Employee Name</th>");
                    strDetails.Append("<th align='left' style='display:none'>Division Name</th>");
                    strDetails.Append("<th align='left' style='display:none'>DOJ</th>");
                    strDetails.Append("<th align='left' style='display:none'>Manager Name</th>");
                    strDetails.Append("<th align='left' style='display:none'>Manager Region Name</th>");
                    strDetails.Append("<th>Parameter of Reviews</th>");

                    for (int k = 0; k < monthList.Count; k++)
                    {
                        strDetails.Append("<th>" + monthList[k].Split('_')[0] + " </th>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<th>Qtr " + quter + "</th>");
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<th>Year</th>");
                    strDetails.Append("</tr></thead>");
                    strDetails.Append("<tbody>");
                    quterCount = 0;
                    monthCount = 0;
                    for (int i = 0; i < dsReport.Tables[2].Rows.Count; i++)
                    {
                        // PARAMETER VALUES
                        yearCount = 0;
                        strDetails.Append("<tr>");
                        strDetails.Append(tableContentH);
                        strDetails.Append("<td align='left' >" + Convert.ToString(dsReport.Tables[2].Rows[i]["Parameter_Name"]) + "</td>");
                        for (int k = 0; k < monthList.Count; k++)
                        {
                            DataRow[] drMonth = dsReport.Tables[3].AsEnumerable().Where(a => a["Month"].ToString() == monthList[k].Split('_')[1].ToString() &&
                                                            a["Parameter_Code"].ToString() == dsReport.Tables[2].Rows[i]["Parameter_Code"].ToString()).ToArray();
                            if (drMonth.Length > 0)
                            {
                                if (Convert.ToString(drMonth[0]["Parameter_Value"]) != null && Convert.ToString(drMonth[0]["Parameter_Value"]) != "")
                                {
                                    monthCount = monthCount + Math.Round(Convert.ToDouble(drMonth[0]["Parameter_Value"].ToString()));
                                    yearCount = yearCount + Math.Round(Convert.ToDouble(drMonth[0]["Parameter_Value"].ToString()));
                                    strDetails.Append("<td align='center'>" + Convert.ToString(drMonth[0]["Parameter_Value"]) + " </td>");
                                }
                                else
                                {
                                    strDetails.Append("<td  align='center'>0</td>");
                                }
                            }
                            else
                            {
                                strDetails.Append("<td  align='center'>0</td>");
                            }
                            //string dJson = jsonPath(dsReport, "$.Tables[3].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "' & @.Parameter_Code=='" + dsReport.Tables[2].Rows[i].Parameter_Code + "')]");
                            //if (dJson != false) {
                            //    if (dJson[0].Parameter_Value != null && dJson[0].Parameter_Value != "") {
                            //        monthCount = monthCount + parseInt(dJson[0].Parameter_Value);
                            //        yearCount = yearCount + parseInt(dJson[0].Parameter_Value);
                            //        tableContent.Append("<td align='center'>" + dJson[0].Parameter_Value + " </td>");
                            //    }
                            //    else {
                            //        tableContent.Append("<td  align='center'>0</td>");
                            //    }
                            //}
                            //else {
                            //    tableContent.Append("<td  align='center'>0</td>");
                            //}
                            quterCount++;
                            if (quterCount == 3)
                            {
                                quterCount = 0;
                                strDetails.Append("<td align='center'> " + monthCount + "</td>");
                                monthCount = 0;
                            }
                            if (month == k)
                            {
                                break;
                            }
                        }
                        strDetails.Append("<td align='center'> " + yearCount + "</td>");
                        strDetails.Append("</tr>");
                    }
                    //No. of field working days
                    strDetails.Append("<tr>");
                    monthCount = 0;
                    yearCount = 0;
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left' >No. of field working days</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drFlag;
                        drFlag = dsReport.Tables[4].AsEnumerable().Where(b => b["Month"].ToString() == monthList[k].Split('_')[1].ToString() && b["Flag"].ToString() == "F").ToArray();
                        if (drFlag.Length > 0)
                        {
                            monthCount = monthCount + Convert.ToInt32(drFlag.Length);
                            yearCount = yearCount + Convert.ToInt32(drFlag.Length);
                            strDetails.Append("<td align='center'>" + drFlag.Length + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].Cplit('_')[1] + "' & @.Flag=='F')]");
                        //if (dJson != false) {
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //    tableContent.Append("<td align='center'>" + dJson.length + " </td>");
                        //}
                        //else {
                        //    tableContent.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }

                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + yearCount + "</td>");
                    strDetails.Append("</tr>");
                    //Leave availed days

                    monthCount = 0;
                    yearCount = 0;

                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'> Leave availed days</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drFlag;
                        drFlag = dsReport.Tables[4].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString() && z["Flag"].ToString() == "L").ToArray();
                        if (drFlag.Length > 0)
                        {
                            monthCount = monthCount + Convert.ToInt32(drFlag.Length);
                            yearCount = yearCount + Convert.ToInt32(drFlag.Length);
                            strDetails.Append("<td align='center'>" + drFlag.Length + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "' & @.Flag=='L')]");
                        //if (dJson != false) {
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }

                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + yearCount + "</td>");
                    strDetails.Append("</tr>");
                    monthCount = 0;
                    yearCount = 0;

                    // Total Holiday & Sundays
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    int sundayCount = 0, holidayCount = 0, monthSunday = 0, monthHoliday = 0, yearSunday = 0, yearHoliday = 0;

                    strDetails.Append("<td align='left'> Total Holiday & Sundays</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {

                        sundayCount = 0;
                        if (Convert.ToInt32(monthList[k].Split('_')[1]) >= 4)
                        {
                            sundayCount = GetNumberOfSundays(Convert.ToInt32(monthList[k].Split('_')[1]), currentYear);
                            //getActiveDays(Convert.ToInt32(monthList[k].Split('_')[1]), currentYear);
                            monthSunday = monthSunday + sundayCount;
                            yearSunday = yearSunday + sundayCount;
                        }
                        else
                        {
                            sundayCount = GetNumberOfSundays(Convert.ToInt32(monthList[k].Split('_')[1]), (currentYear + 1));
                            //getActiveDays(Convert.ToInt32(monthList[k].Split('_')[1]), (currentYear + 1))
                        }
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[17].AsEnumerable().Where(a => a["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            monthHoliday = monthHoliday + Convert.ToInt32(drMonth.Length);
                            yearHoliday = yearHoliday + Convert.ToInt32(drMonth.Length);
                            strDetails.Append("<td align='center'>" + (sundayCount + Convert.ToInt32(drMonth.Length)) + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>" + sundayCount + "</td>");
                        }

                        //string dJson = jsonPath(dsReport, "$.Tables[17].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    monthHoliday = monthHoliday + Convert.ToInt32(dJson.Length);
                        //    yearHoliday = yearHoliday + Convert.ToInt32(dJson.length);
                        //    strDetails.Append("<td align='center'>" + (sundayCount + Convert.ToInt32(dJson.length)) + " </td>");
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>" + sundayCount + "</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + (monthSunday + monthHoliday) + "</td>");
                            monthHoliday = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + (yearSunday + yearHoliday) + "</td>");
                    strDetails.Append("</tr>");

                    //No of non Field working days
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of non Field working days</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drFlag;
                        drFlag = dsReport.Tables[4].AsEnumerable().Where(x => x["Month"].ToString() == monthList[k].Split('_')[1].ToString() && x["Flag"].ToString() == "A").ToArray();
                        if (drFlag.Length > 0)
                        {
                            monthCount = monthCount + Convert.ToInt32(drFlag.Length);
                            yearCount = yearCount + Convert.ToInt32(drFlag.Length);
                            strDetails.Append("<td align='center'>" + drFlag.Length + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }

                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "' & @.Flag=='A')]");
                        //if (dJson != false) {
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + yearCount + "</td>");
                    strDetails.Append("</tr>");

                    //Total Doctors in list
                    strDetails.Append("<tr> ");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Total Doctors in list</td>");
                    int doctorCount = 0;
                    for (int k = 0; k < dsReport.Tables[5].Rows.Count; k++)
                    {
                        doctorCount += Convert.ToInt32(dsReport.Tables[5].Rows[k]["Count"]);
                    }

                    for (int k = 0; k < monthList.Count; k++)
                    {
                        strDetails.Append("<td  align='center'>" + doctorCount + "</td>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + doctorCount + "</td>");

                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + doctorCount + "</td>");
                    strDetails.Append("</tr>");


                    //Total Doctors met
                    monthCount = 0;
                    yearCount = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Total Doctors met</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[6].AsEnumerable().Where(a => a["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                            strDetails.Append("<td align='center'>" + drMonth.Length + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[6].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {

                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td  align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td  align='center'>" + yearCount + "</td>");
                    strDetails.Append("</tr>");

                    //Call Avg for the month
                    double fieldCount = 0;
                    monthCount = 0;
                    yearCount = 0;
                    monthAvg = 0; yearAvg = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Call Avg for the month</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drFlag;
                        drFlag = dsReport.Tables[4].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString() && z["Flag"].ToString() == "F").ToArray();
                        if (drFlag.Length > 0)
                        {
                            fieldCount = Convert.ToInt32(drFlag.Length);
                            monthCount = monthCount + Convert.ToInt32(drFlag.Length);
                            yearCount = yearCount + Convert.ToInt32(drFlag.Length);
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "' & @.Flag=='L')]");
                        //if (dJson != false) {
                        //    fieldCount = parseInt(dJson.length);
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);

                        //}
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[7].AsEnumerable().Where(x => x["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            if (fieldCount > 0)
                            {
                                monthAvg = monthAvg + Convert.ToInt32(drMonth.Length);
                                yearAvg = yearAvg + Convert.ToInt32(drMonth.Length);
                                strDetails.Append("<td align='center'>" + Math.Round((Convert.ToInt32(drMonth.Length) / fieldCount), 0) + " </td>");
                            }
                            else
                            {
                                strDetails.Append("<td  align='center'>0</td>");
                            }
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[7].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    if (fieldCount > 0) {

                        //        monthAvg = monthAvg + parseInt(dJson.length);
                        //        yearAvg = yearAvg + parseInt(dJson.length);
                        //        strDetails.Append("<td align='center'>" + Math.round(parseInt(dJson.length) / fieldCount) + " </td>");
                        //    }
                        //    else {
                        //        strDetails.Append("<td  align='center'>0</td>");
                        //    }
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            if (monthCount > 0)
                            {
                                strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(monthAvg / monthCount), 0) + "</td>");
                            }
                            else
                            {
                                strDetails.Append("<td align='center'>0</td>");
                            }
                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }

                    if (yearCount > 0)
                    {
                        strDetails.Append("<td  align='center'>" + Math.Round(Convert.ToDouble(yearAvg / yearCount)) + "</td>");
                    }
                    else
                    {
                        strDetails.Append("<td align='center'>0</td>");
                    }
                    strDetails.Append("</tr>");


                    monthCount = 0; yearCount = 0;
                    //Total Missed Doctors
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Total Missed Doctors</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[6].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldCount = Convert.ToInt32(drMonth.Length);
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                        }

                        //string dJson = jsonPath(dsReport, "$.Tables[6].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {

                        //    fieldCount = parseInt(dJson.length);
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //}
                        if (doctorCount > 0)
                        {
                            strDetails.Append("<td align='center'>" + (doctorCount - fieldCount) + "</td>");
                        }
                        else
                        {
                            strDetails.Append("<td align='center'>0</td>");
                        }
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            if (doctorCount > 0)
                            {
                                strDetails.Append("<td align='center'>" + (doctorCount - monthCount) + "</td>");
                            }
                            else
                            {
                                strDetails.Append("<td align='center'>0</td>");
                            }

                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    if (doctorCount > 0)
                    {
                        strDetails.Append("<td align='center'>" + (doctorCount - yearCount) + "</td>");
                    }
                    else
                    {
                        strDetails.Append("<td align='center'>0</td>");
                    }
                    strDetails.Append("</tr>");
                    int fieldAvg = 0;
                    //Total SC Doctors
                    int visitCount = 0; string visitOrde = "0";
                    monthCount = 0; yearCount = 0;
                    for (int j = 0; j < dsReport.Tables[10].Rows.Count; j++)
                    {

                        strDetails.Append("<tr>");
                        strDetails.Append(tableContentH);
                        strDetails.Append("<td align='left'>Total " + dsReport.Tables[10].Rows[j]["Category_Name"] + "  Doctors</td>");
                        for (int k = 0; k < monthList.Count; k++)
                        {
                            DataRow[] drCategory;
                            drCategory = dsReport.Tables[5].AsEnumerable().Where(c => c["Category"].ToString() == dsReport.Tables[10].Rows[j]["Category_Code"].ToString()).ToArray();
                            if (drCategory.Length > 0)
                            {
                                monthCount = monthCount + Convert.ToInt32(drCategory[0]["Count"]);
                                yearCount = yearCount + Convert.ToInt32(drCategory[0]["Count"]);
                                strDetails.Append("<td align='center'>" + drCategory[0]["Count"] + " </td>");
                            }
                            else
                            {
                                strDetails.Append("<td  align='center'>0</td>");
                            }
                            //string dJson = jsonPath(dsReport, "$.Tables[5].Rows[?(@.Category=='" + dsReport.Tables[10].Rows[j].Category_Code + "')]");
                            //if (dJson != false) {

                            //    monthCount = monthCount + parseInt(dJson[0].Count);
                            //    yearCount = yearCount + parseInt(dJson[0].Count);

                            //    strDetails.Append("<td align='center'>" + dJson[0].Count + " </td>");
                            //}
                            //else {
                            //    strDetails.Append("<td  align='center'>0</td>");
                            //}
                            quterCount++;
                            if (quterCount == 3)
                            {
                                quterCount = 0;
                                quter++;
                                strDetails.Append("<td align='center'>" + monthCount + "</td>");
                                monthCount = 0;
                            }
                            if (month == k)
                            {
                                break;
                            }
                        }
                        strDetails.Append("<td align='center'>" + yearCount + "</td>");
                        strDetails.Append("</tr>");

                        // Categort Total
                        if (Convert.ToString(dsReport.Tables[10].Rows[j]["Visit_Count"]) != null && Convert.ToString(dsReport.Tables[10].Rows[j]["Visit_Count"]) != "")
                        {
                            visitCount = Convert.ToInt32(dsReport.Tables[10].Rows[j]["Visit_Count"]);
                        }
                        else
                        {
                            visitCount = 0;
                        }

                        // Categort wise visit count


                        for (int index = 0; index < visitCount; index++)
                        {
                            monthCount = 0; yearCount = 0;
                            visitOrde = visitCountDetails(index + 1);
                            strDetails.Append("<tr>");
                            strDetails.Append(tableContentH);
                            strDetails.Append("<td align='left'>" + Convert.ToString(dsReport.Tables[10].Rows[j]["Category_Name"]) + "  Doctors " + visitOrde + " visits</td>");
                            for (int k = 0; k < monthList.Count; k++)
                            {

                                DataRow[] drCat;
                                drCat = dsReport.Tables[11].AsEnumerable().Where(z => z["Category"].ToString() == dsReport.Tables[10].Rows[j]["Category_Code"].ToString() && z["Count"].ToString() ==
                                    (index + 1).ToString() && z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                                if (drCat.Length > 0)
                                {
                                    monthCount = monthCount + Convert.ToInt32(drCat.Length);
                                    yearCount = yearCount + Convert.ToInt32(drCat.Length);
                                    strDetails.Append("<td align='center'>" + drCat.Length + " </td>");
                                }
                                else
                                {
                                    strDetails.Append("<td  align='center'>0</td>");
                                }
                                //string dJson = jsonPath(dsReport, "$.Tables[11].Rows[?(@.Category=='" + dsReport.Tables[10].Rows[j]["Category_Code"] 
                                //    + "' & @.Count=='" + (index + 1) + "' & @.Month=='" + monthList[k].Split('_')[1] + "')]");
                                //if (dJson != false) {
                                //    monthCount = monthCount + parseInt(dJson.length);
                                //    yearCount = yearCount + parseInt(dJson.length);
                                //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                                //}
                                //else {
                                //    strDetails.Append("<td  align='center'>0</td>");
                                //}

                                quterCount++;
                                if (quterCount == 3)
                                {
                                    quterCount = 0;
                                    quter++;
                                    strDetails.Append("<td align='center'>" + monthCount + "</td>");
                                    monthCount = 0;
                                }
                                if (month == k)
                                {
                                    break;
                                }
                            }
                            strDetails.Append("<td align='center'>" + yearCount + "</td>");
                            strDetails.Append("</tr>");
                        }

                        //  Doctors More then Visit
                        monthCount = 0; yearCount = 0;

                        visitOrde = visitCountDetails(visitCount);
                        strDetails.Append("<tr>");
                        strDetails.Append(tableContentH);
                        strDetails.Append("<td align='left'>" + Convert.ToString(dsReport.Tables[10].Rows[j]["Category_Name"]) + "  Doctors More then " + visitOrde + "</td>");
                        for (int k = 0; k < monthList.Count; k++)
                        {
                            DataRow[] drCat;
                            drCat = dsReport.Tables[11].AsEnumerable().Where(a => a["Category"].ToString() == dsReport.Tables[10].Rows[j]["Category_Code"].ToString() && a["Count"].ToString() ==
                                visitCount.ToString() && a["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                            if (drCat.Length > 0)
                            {
                                monthCount = monthCount + Convert.ToInt32(drCat.Length);
                                yearCount = yearCount + Convert.ToInt32(drCat.Length);
                                strDetails.Append("<td align='center'>" + drCat.Length + " </td>");
                            }
                            else
                            {
                                strDetails.Append("<td  align='center'>0</td>");
                            }
                            //string dJson = jsonPath(dsReport, "$.Tables[11].Rows[?(@.Category=='" + dsReport.Tables[10].Rows[j].Category_Code + "' & @.Count > '" + visitCount + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
                            //if (dJson != false) {
                            //    monthCount = monthCount + parseInt(dJson.length);
                            //    yearCount = yearCount + parseInt(dJson.length);
                            //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                            //}
                            //else {
                            //    strDetails.Append("<td  align='center'>0</td>");
                            //}

                            quterCount++;
                            if (quterCount == 3)
                            {
                                quterCount = 0;
                                quter++;
                                strDetails.Append("<td align='center'>" + monthCount + "</td>");
                                monthCount = 0;
                            }
                            if (month == k)
                            {
                                break;
                            }
                        }
                        strDetails.Append("<td align='center'>" + yearCount + "</td>");
                        strDetails.Append("</tr>");


                        // Categort wise visit count

                        monthCount = 0; yearCount = 0; monthAvg = 0; yearAvg = 0; fieldCount = 0;

                        strDetails.Append("<tr>");
                        strDetails.Append(tableContentH);
                        strDetails.Append("<td align='left'> No of " + Convert.ToString(dsReport.Tables[10].Rows[j]["Category_Name"]) + "  Doctors Missed</td>");
                        for (int k = 0; k < monthList.Count; k++)
                        {

                            DataRow[] drCat;
                            drCat = dsReport.Tables[11].AsEnumerable().Where(a => a["Category"].ToString() == dsReport.Tables[10].Rows[j]["Category_Code"].ToString() && a["Month"].ToString() == monthList[k].Split('_')[1]).ToArray();
                            //string dJson = jsonPath(dsReport, "$.Tables[11].Rows[?(@.Category=='" + dsReport.Tables[10].Rows[j]["Category_Code"] + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
                            //if (dJson != false) {
                            //    fieldCount = parseInt(dJson.length);
                            //    monthCount = monthCount + parseInt(dJson.length);
                            //    yearCount = yearCount + parseInt(dJson.length);
                            //}
                            drCat = dsReport.Tables[5].AsEnumerable().Where(b => b["Category"].ToString() == dsReport.Tables[10].Rows[j]["Category_Code"].ToString()).ToArray();
                            if (drCat.Length > 0)
                            {
                                fieldAvg = Convert.ToInt32(drCat[0]["Count"]);
                                monthAvg = monthAvg + Convert.ToInt32(drCat[0]["Count"]);
                                yearAvg = yearAvg + Convert.ToInt32(drCat[0]["Count"]);
                            }
                            //string dJson = jsonPath(dsReport, "$.Tables[5].Rows[?(@.Category=='" + dsReport.Tables[10].Rows[j].Category_Code + "')]");
                            //if (dJson != false) {

                            //    fieldAvg = parseInt(dJson[0].Count);
                            //    monthAvg = monthAvg + parseInt(dJson[0].Count);
                            //    yearAvg = yearAvg + parseInt(dJson[0].Count);
                            //}

                            if (fieldAvg > 0)
                            {

                                strDetails.Append("<td align='center'>" + (fieldAvg - fieldCount) + " </td>");
                            }
                            else
                            {
                                strDetails.Append("<td  align='center'>0</td>");
                            }

                            quterCount++;
                            if (quterCount == 3)
                            {
                                quterCount = 0;
                                quter++;
                                if (monthAvg > 0)
                                {

                                    strDetails.Append("<td align='center'>" + (monthAvg - monthCount) + " </td>");
                                }
                                else
                                {
                                    strDetails.Append("<td  align='center'>0</td>");
                                }
                                monthCount = 0;
                            }
                            if (month == k)
                            {
                                break;
                            }
                        }
                        if (yearAvg > 0)
                        {

                            strDetails.Append("<td align='center'>" + (yearAvg - yearCount) + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        strDetails.Append("</tr>");
                    }


                    //Total Chemist in list
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Total Chemist in list</td>");
                    int chemisitCount = 0;
                    for (int k = 0; k < dsReport.Tables[8].Rows.Count; k++)
                    {
                        chemisitCount += Convert.ToInt32(dsReport.Tables[8].Rows[k]["Count"]);
                    }

                    for (int k = 0; k < monthList.Count; k++)
                    {
                        strDetails.Append("<td  align='center'>" + chemisitCount + "</td>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + chemisitCount + "</td>");

                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'> " + chemisitCount + "</td>");
                    strDetails.Append("</tr>");

                    // No of Chemist Met
                    fieldCount = 0; monthCount = 0; yearCount = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of Chemist Met</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[9].AsEnumerable().Where(s => s["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                            strDetails.Append("<td align='center'>" + drMonth.Length + " </td>");
                        }
                        else
                        {
                            strDetails.Append("<td  align='center'>0</td>");
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[9].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //    strDetails.Append("<td align='center'>" + dJson.length + " </td>");
                        //}
                        //else {
                        //    strDetails.Append("<td  align='center'>0</td>");
                        //}
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'>" + yearCount + "</td>");
                    strDetails.Append("</tr>");



                    fieldCount = 0; monthCount = 0; yearCount = 0;

                    fieldAvg = 0; monthAvg = 0; yearAvg = 0;
                    //No of Chemist Avg
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of Chemist Avg</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[4].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldCount = Convert.ToInt32(drMonth.Length);
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    fieldCount = parseInt(dJson.length);
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //}


                        drMonth = dsReport.Tables[12].AsEnumerable().Where(a => a["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldAvg = Convert.ToInt32(drMonth.Length);
                            monthAvg = monthAvg + Convert.ToInt32(drMonth.Length);
                            yearAvg = yearAvg + Convert.ToInt32(drMonth.Length);
                        }

                        //string dJson = jsonPath(dsReport, "$.Tables[12].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {

                        //    fieldAvg = parseInt(dJson.length);
                        //    monthAvg = monthAvg + parseInt(dJson.length);
                        //    yearAvg = yearAvg + parseInt(dJson.length);
                        //}

                        if (fieldCount > 0)
                        {
                            strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(fieldAvg / fieldCount)) + "</td>");
                        }
                        else
                        {
                            strDetails.Append("<td align='center'>0</td>");
                        }

                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            if (fieldCount > 0)
                            {
                                strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(monthAvg / monthCount)) + "</td>");
                            }
                            else
                            {
                                strDetails.Append("<td align='center'>0</td>");
                            }
                            //  monthFiled = 0;

                        }
                        if (month == k)
                        {
                            break;
                        }
                    }

                    if (yearCount > 0)
                    {
                        strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(yearAvg / yearCount)) + "</td>");
                    }
                    else
                    {
                        strDetails.Append("<td align='center'>0</td>");
                    }

                    // Chemist POB Value
                    fieldCount = 0;
                    monthCount = 0;
                    yearCount = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>Chemist POB Value</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        fieldCount = 0;
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[9].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            for (int index = 0; index > drMonth.Length; index++)
                            {
                                fieldCount += Math.Round(Convert.ToDouble(drMonth[index]["PO_Amount"]));
                                monthCount = monthCount + Math.Round(Convert.ToDouble(drMonth[index]["PO_Amount"]));
                                yearCount = yearCount + Math.Round(Convert.ToDouble(drMonth[index]["PO_Amount"]));
                            }
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[9].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    for (string index = 0; index > dJson.length; index++) {
                        //        fieldCount += parseInt(dJson[index].PO_Amount);
                        //        monthCount = monthCount + parseInt(dJson[index].PO_Amount);
                        //        yearCount = yearCount + parseInt(dJson[index].PO_Amount);
                        //    }

                        //}
                        strDetails.Append("<td align='center'>" + fieldCount + "</td>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            //  monthTotal = 0;

                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'>" + yearCount + "</td>");
                    strDetails.Append("</tr>");

                    // No of Stockist Met
                    fieldCount = 0;
                    monthCount = 0;
                    yearCount = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of Stockist Met</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {
                        fieldCount = 0;
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[13].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldCount = Convert.ToInt32(drMonth.Length);
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[13].Rows[?(@.Month=='" + monthList[k].Split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    fieldCount = parseInt(dJson.length);
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);
                        //}
                        strDetails.Append("<td align='center'>" + fieldCount + "</td>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            //monthTotal = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'>" + yearCount + "</td>");
                    strDetails.Append("</tr>");

                    // No of Stockist Met
                    fieldCount = 0; fieldAvg = 0;
                    monthCount = 0; monthAvg = 0;
                    yearCount = 0; yearAvg = 0;
                    // qtrAvg = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of Stockist Avg</td>");
                    for (int k = 0; k < monthList.Count; k++)
                    {

                        fieldCount = 0; fieldAvg = 0;
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[4].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldCount = Convert.ToInt32(drMonth.Length);
                            monthCount = monthCount + Convert.ToInt32(drMonth.Length);
                            yearCount = yearCount + Convert.ToInt32(drMonth.Length);
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[4].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {
                        //    fieldCount = parseInt(dJson.length);
                        //    monthCount = monthCount + parseInt(dJson.length);
                        //    yearCount = yearCount + parseInt(dJson.length);

                        //}
                        drMonth = dsReport.Tables[14].AsEnumerable().Where(z => z["Month"].ToString() == monthList[k].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            fieldAvg = Convert.ToInt32(drMonth.Length);
                            monthAvg = monthAvg + Convert.ToInt32(drMonth.Length);
                            yearAvg = yearAvg + Convert.ToInt32(drMonth.Length);
                        }
                        //string dJson = jsonPath(dsReport, "$.Tables[14].Rows[?(@.Month=='" + monthList[k].split('_')[1] + "')]");
                        //if (dJson != false) {

                        //    fieldAvg = parseInt(dJson.length);
                        //    monthAvg = monthAvg + parseInt(dJson.length);
                        //    yearAvg = yearAvg + parseInt(dJson.length);
                        //}

                        if (fieldCount > 0)
                        {
                            strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(fieldAvg / fieldCount)) + "</td>");
                        }
                        else
                        {
                            strDetails.Append("<td align='center'>0</td>");
                        }

                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            if (fieldCount > 0)
                            {
                                strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(monthAvg / monthCount)) + "</td>");
                            }
                            else
                            {
                                strDetails.Append("<td align='center'>0</td>");
                            }
                            monthAvg = 0;
                            monthCount = 0;
                        }
                        if (month == k)
                        {
                            break;
                        }
                    }
                    if (fieldCount > 0)
                    {
                        strDetails.Append("<td align='center'>" + Math.Round(Convert.ToDouble(yearCount / yearAvg)) + "</td>");
                    }
                    else
                    {
                        strDetails.Append("<td align='center'>0</td>");
                    }
                    strDetails.Append("</tr>");

                    //No of Days Independent
                    monthCount = 0;
                    yearCount = 0;
                    strDetails.Append("<tr>");
                    strDetails.Append(tableContentH);
                    strDetails.Append("<td align='left'>No of Days Independent</td>");
                    for (int l = 0; l < monthList.Count; l++)
                    {
                        fieldCount = 0;
                        DataRow[] drMonth;
                        drMonth = dsReport.Tables[15].AsEnumerable().Where(z => z["Month"].ToString() == monthList[l].Split('_')[1].ToString()).ToArray();
                        if (drMonth.Length > 0)
                        {
                            for (int k = 0; k < drMonth.Length; k++)
                            {
                                StringBuilder workedWith = new StringBuilder();
                                if (Convert.ToString(drMonth[k]["Acc1"]) != null && Convert.ToString(drMonth[k]["Acc1"]) != "")
                                {
                                    workedWith.Append(Convert.ToString(drMonth[k]["Acc1"]) + ",");
                                }
                                if (Convert.ToString(drMonth[k]["Acc2"]) != null && Convert.ToString(drMonth[k]["Acc2"]) != "")
                                {
                                    workedWith.Append(Convert.ToString(drMonth[k]["Acc2"]) + ",");
                                }
                                if (Convert.ToString(drMonth[k]["Acc3"]) != null && Convert.ToString(drMonth[k]["Acc3"]) != "")
                                {
                                    workedWith.Append(Convert.ToString(drMonth[k]["Acc3"]) + ",");
                                }
                                if (Convert.ToString(drMonth[k]["Acc4"]) != null && Convert.ToString(drMonth[k]["Acc4"]) != "")
                                {
                                    workedWith.Append(Convert.ToString(drMonth[k]["Acc4"]) + ",");
                                }
                                if (workedWith.ToString() == "")
                                {
                                    fieldCount = fieldCount + 1;
                                    monthCount = monthCount + 1;
                                    yearCount = yearCount + 1;
                                }
                            }
                        }
                        //string dJsonData = jsonPath(dsReport, "$.Tables[15].Rows[?(@.Month=='" + monthList[l].split('_')[1] + "')]");
                        //if (dJsonData != false) {
                        //    for (string k = 0; k < dJsonData.length; k++) {
                        //        workedWith = "";
                        //        if (dJsonData[k].Acc1 != null && dJsonData[k].Acc1 != "") {
                        //            workedWith = dJsonData[k].Acc1 + ",";
                        //        }
                        //        if (dJsonData[k].Acc2 != null && dJsonData[k].Acc2 != "") {
                        //            workedWith += dJsonData[k].Acc2 + ",";
                        //        }
                        //        if (dJsonData[k].Acc3 != null && dJsonData[k].Acc3 != "") {
                        //            workedWith += dJsonData[k].Acc3 + ",";
                        //        }
                        //        if (dJsonData[k].Acc4 != null && dJsonData[k].Acc4 != "") {
                        //            workedWith += dJsonData[k].Acc4 + ",";
                        //        }
                        //        if (workedWith == "") {
                        //            fieldCount = fieldCount + 1;
                        //            monthCount = monthCount + 1;
                        //            yearCount = yearCount + 1;
                        //        }
                        //    }
                        //}
                        strDetails.Append("<td align='center'>" + fieldCount + "</td>");
                        quterCount++;
                        if (quterCount == 3)
                        {
                            quterCount = 0;
                            quter++;
                            strDetails.Append("<td align='center'>" + monthCount + "</td>");
                            monthCount = 0;
                        }
                        if (month == l)
                        {
                            break;
                        }
                    }
                    strDetails.Append("<td align='center'>" + yearCount + "</td>");
                    strDetails.Append("</tr>");

                    int count = 0;
                    //No of Days Joined with Level 2 Region Type
                    if (dsReport.Tables[16].Rows.Count > 0)
                    {
                        for (int index = (dsReport.Tables[16].Rows.Count - 1); index >= 0; index--)
                        {
                            count++;
                            if (count != 1)
                            {
                                monthCount = 0;
                                yearCount = 0;
                                fieldCount = 0;
                                strDetails.Append("<tr>");
                                strDetails.Append(tableContentH);
                                strDetails.Append("<td align='left'>No of Days Worked with " + Convert.ToString(dsReport.Tables[16].Rows[index]["Region_Name"]) + " (" + dsReport.Tables[16].Rows[index]["Region_Type_Name"] + ")</td>");
                                for (int l = 0; l < monthList.Count; l++)
                                {
                                    fieldCount = 0;
                                    DataRow[] drMonth = dsReport.Tables[15].AsEnumerable().Where(z => z["Month"].ToString() == monthList[l].Split('_')[1].ToString()).ToArray();
                                    if (drMonth.Length > 0)
                                    {
                                        for (int k = 0; k < drMonth.Length; k++)
                                        {
                                            string workedWith = string.Empty;
                                            if (Convert.ToString(drMonth[k]["Acc1"]) != null && Convert.ToString(drMonth[k]["Acc1"]) != "")
                                            {
                                                if (Convert.ToString(drMonth[k]["Acc1"]) == Convert.ToString(dsReport.Tables[16].Rows[index]["User_Name"]))
                                                {
                                                    workedWith = Convert.ToString(drMonth[k]["Acc1"]) + ",";
                                                }
                                            }
                                            if (Convert.ToString(drMonth[k]["Acc2"]) != null && Convert.ToString(drMonth[k]["Acc2"]) != "")
                                            {
                                                if (Convert.ToString(drMonth[k]["Acc2"]) == Convert.ToString(dsReport.Tables[16].Rows[index]["User_Name"]))
                                                {
                                                    workedWith = Convert.ToString(drMonth[k]["Acc1"]) + ",";
                                                }
                                            }
                                            if (Convert.ToString(drMonth[k]["Acc3"]) != null && Convert.ToString(drMonth[k]["Acc3"]) != "")
                                            {
                                                if (Convert.ToString(drMonth[k]["Acc3"]) == Convert.ToString(dsReport.Tables[16].Rows[index]["User_Name"]))
                                                {
                                                    workedWith = Convert.ToString(drMonth[k]["Acc1"]) + ",";
                                                }
                                            }
                                            if (Convert.ToString(drMonth[k]["Acc4"]) != null && Convert.ToString(drMonth[k]["Acc4"]) != "")
                                            {
                                                if (Convert.ToString(drMonth[k]["Acc4"]) == Convert.ToString(dsReport.Tables[16].Rows[index]["User_Name"]))
                                                {
                                                    workedWith = Convert.ToString(drMonth[k]["Acc1"]) + ",";
                                                }
                                            }
                                            if (workedWith.ToString() != "")
                                            {
                                                fieldCount = fieldCount + 1;
                                                monthCount = monthCount + 1;
                                                yearCount = yearCount + 1;
                                            }
                                        }
                                    }
                                    //string dJsonData = jsonPath(dsReport, "$.Tables[15].Rows[?(@.Month=='" + monthList[l].split('_')[1] + "')]");
                                    //if (dJsonData != false) {
                                    //    for (string k = 0; k < dJsonData.length; k++) {
                                    //        workedWith = "";
                                    //        if (dJsonData[k].Acc1 != null && dJsonData[k].Acc1 != "") {
                                    //            if (dJsonData[k].Acc1 == dsReport.Tables[16].Rows[index].User_Name) {
                                    //                workedWith = dJsonData[k].Acc1 + ",";
                                    //            }
                                    //        }
                                    //        if (dJsonData[k].Acc2 != null && dJsonData[k].Acc2 != "") {
                                    //            if (dJsonData[k].Acc2 == dsReport.Tables[16].Rows[index].User_Name) {
                                    //                workedWith = dJsonData[k].Acc1 + ",";
                                    //            }
                                    //        }
                                    //        if (dJsonData[k].Acc3 != null && dJsonData[k].Acc3 != "") {
                                    //            if (dJsonData[k].Acc3 == dsReport.Tables[16].Rows[index].User_Name) {
                                    //                workedWith = dJsonData[k].Acc1 + ",";
                                    //            }
                                    //        }
                                    //        if (dJsonData[k].Acc4 != null && dJsonData[k].Acc4 != "") {
                                    //            if (dJsonData[k].Acc4 == dsReport.Tables[16].Rows[index].User_Name) {
                                    //                workedWith = dJsonData[k].Acc1 + ",";
                                    //            }
                                    //        }
                                    //        if (workedWith != "") {
                                    //            fieldCount = fieldCount + 1;
                                    //            monthCount = monthCount + 1;
                                    //            yearCount = yearCount + 1;
                                    //        }
                                    //    }
                                    //}
                                    strDetails.Append("<td align='center'>" + fieldCount + "</td>");
                                    quterCount++;
                                    if (quterCount == 3)
                                    {
                                        quterCount = 0;
                                        quter++;
                                        strDetails.Append("<td align='center'>" + monthCount + "</td>");
                                        monthCount = 0;
                                    }
                                    if (month == l)
                                    {
                                        break;
                                    }
                                }
                                strDetails.Append("<td align='center'>" + yearCount + "</td>");
                                strDetails.Append("</tr>");
                            }
                            if (count == 3)
                            {
                                break;
                            }
                        }
                    }
                }
                strDetails.Append("</tbody>");
                strDetails.Append("</table>");
                #endregion generate report html string

                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                // _objData.CloseConnection();
            }
            return tableContent + "$" + strDetails;
        }

        public JsonResult GetDoctorCategory(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetDoctorCategory '" + _objcurrentInfo.GetCompanyCode() + "'");
                }

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetMissedCallRecovery(FormCollection collection)
        {
            try
            {
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();
                string regionCode = collection["regionCode"].ToString();
                string status = collection["status"].ToString();
                string category = collection["category"].ToString();
                string mdlNumber = "";
                Regex regExInt = new Regex("^([0-9]*)$");

                DataSet ds = new DataSet();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetMissedCallRecovery '" + _objcurrentInfo.GetCompanyCode() + "','" + regionCode + "','" + startDate + "','" + endDate + "','" + status + "','" + category + "'");
                }

                if (ds.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        mdlNumber = dr["MDL_Number"].ToString().Trim();
                        if (!string.IsNullOrEmpty(mdlNumber))
                        {
                            if (regExInt.IsMatch(mdlNumber))
                            {
                                mdlNumber = Convert.ToInt32(mdlNumber).ToString();
                            }
                        }
                        dr["MDL_Number"] = mdlNumber;
                        dr.AcceptChanges();
                    }
                    ds.Tables[2].AcceptChanges();
                }

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //**********************************************************Chemist Met analysis*******************************************************//
        public JsonResult GetChemistmetAnalysis(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string StartDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["StartDate"].ToString()))
                {
                    StartDate = collection["StartDate"].ToString().Split('/')[2].ToString() + "-" + collection["StartDate"].ToString().Split('/')[1].ToString() + "-" + collection["StartDate"].ToString().Split('/')[0].ToString();
                }
                string EndDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["EndDate"].ToString()))
                {
                    EndDate = collection["EndDate"].ToString().Split('/')[2].ToString() + "-" + collection["EndDate"].ToString().Split('/')[1].ToString() + "-" + collection["EndDate"].ToString().Split('/')[0].ToString();
                }

                string userCodes = "";
                DataSet dsChildUsers = _objSPData.dsChildUsers(_objcurrentInfo.GetCompanyCode(), UserCode);
                if (dsChildUsers.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in dsChildUsers.Tables[0].Rows)
                    {
                        userCodes += "''" + dr["User_Code"].ToString() + "'',";
                    }
                }
                if (!string.IsNullOrEmpty(userCodes))
                {
                    userCodes = userCodes.TrimEnd(',');
                }
                else
                {
                    userCodes = " ";
                }


                //Year = collection["year"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_hdGetChemistMetAnalysis " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + userCodes + "','" + StartDate + "','" + EndDate + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult fnDRDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string Regioncode = string.Empty;
                Regioncode = collection["Regioncode"];
                string ChemistName = string.Empty;
                ChemistName = collection["ChemistName"];
                string StartDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["StartDate"].ToString()))
                {
                    StartDate = collection["StartDate"].ToString().Split('/')[2].ToString() + "-" + collection["StartDate"].ToString().Split('/')[1].ToString() + "-" + collection["StartDate"].ToString().Split('/')[0].ToString();
                }
                string EndDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["EndDate"].ToString()))
                {
                    EndDate = collection["EndDate"].ToString().Split('/')[2].ToString() + "-" + collection["EndDate"].ToString().Split('/')[1].ToString() + "-" + collection["EndDate"].ToString().Split('/')[0].ToString();
                }

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_HDChemistDoctor_Details " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + Regioncode + "','" + UserCode + "','" + StartDate + "','" + EndDate + "','" + ChemistName + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //*************************************************************DCR Count -Alumni****************************************************************************
        public JsonResult GetDCRCountAlumi(FormCollection collection)
        {
            try
            {
                string RegionCode = string.Empty;
                RegionCode = collection["RegionCode"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                string StartDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["StartDate"].ToString()))
                {
                    StartDate = collection["StartDate"].ToString().Split('/')[2].ToString() + "-" + collection["StartDate"].ToString().Split('/')[1].ToString() + "-" + collection["StartDate"].ToString().Split('/')[0].ToString();
                }
                string EndDate = string.Empty;
                if (!string.IsNullOrEmpty(collection["EndDate"].ToString()))
                {
                    EndDate = collection["EndDate"].ToString().Split('/')[2].ToString() + "-" + collection["EndDate"].ToString().Split('/')[1].ToString() + "-" + collection["EndDate"].ToString().Split('/')[0].ToString();
                }

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                string regionCodes = "";
                DataSet dsChildRegion = _objSPData.dsChildRegion(_objcurrentInfo.GetCompanyCode(), RegionCode);
                if (dsChildRegion.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                    {
                        regionCodes += "''" + dr["Region_Code"].ToString() + "'',";
                    }

                }

                if (!string.IsNullOrEmpty(regionCodes))
                {
                    regionCodes = regionCodes.TrimEnd(',');
                }
                else
                {
                    regionCodes = "''";
                }

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                string query = "EXEC SP_hdDCRCountAlumni " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + regionCodes + "','" + StartDate + "','" + EndDate + "','" + Status + "'";
                //query += "EXEC SP_hdGetParentRegions '" + _objcurrentInfo.GetCompanyCode() + "','" + RegionCode + "'";
                //query += "EXEC SP_hdGetParentUsers_dcr '" + _objcurrentInfo.GetCompanyCode() + "','" + RegionCode + "'";
                dsReport = _objData.ExecuteDataSet(query);

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetDayAnalysisReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string regionCodes = "", parentregionCode = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }
            ds = _objSPData.GetDayAnalysisReport(companyCode, regionCodes, "''", startDate, endDate);
            DataSet dsParentRegion = new DataSet();
            DataSet dsHoliday = new DataSet();
            DataTable dt = new DataTable();
            dt.Columns.Add("Region_Code");
            dt.Columns.Add("DCR_Date");
            dt.Columns.Add("Holiday_Name");
            if (ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow drs in ds.Tables[1].Rows)
                {
                    dsParentRegion = _objSPData.dsParentRegion(companyCode, drs["Region_Code"].ToString());
                    if (dsParentRegion.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsParentRegion.Tables[0].Rows)
                        {
                            parentregionCode += "'" + dr["Region_Code"].ToString() + "',";
                        }
                    }

                    if (!string.IsNullOrEmpty(parentregionCode))
                    {
                        parentregionCode = parentregionCode.TrimEnd(',');
                    }
                    else
                    {
                        parentregionCode = "''";
                    }
                    BL_Report objReport = new BL_Report();
                    dsHoliday = objReport.GetHolidayDetails(companyCode, drs["Region_Code"].ToString(), parentregionCode, startDate, endDate, "");
                    //dsHoliday = _objSPData.GetHolidayDetails(companyCode, drs["Region_Code"].ToString(), parentregionCode, startDate, endDate, "");
                    foreach (DataRow drSub in dsHoliday.Tables[0].Rows)
                    {

                        DataRow dataRow = dt.NewRow();
                        dataRow["Region_Code"] = drs["Region_Code"].ToString();
                        dataRow["DCR_Date"] = drSub["Holiday_Date"].ToString();
                        dataRow["Holiday_Name"] = drSub["Holiday"].ToString();
                        dt.Rows.Add(dataRow);
                    }

                }

            }

            ds.Tables.Add(dt);
            ds.AcceptChanges();


            objActivity.SetActivityCount("", regionCodes, startDate, endDate, "'2'");
            dt = new DataTable();
            dt.Columns.Add("Region_Code");
            dt.Columns.Add("Field");
            dt.Columns.Add("Attendance");
            dt.Columns.Add("Holiday");
            dt.Columns.Add("Sunday");
            dt.Columns.Add("Leave");
            if (ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow drs in ds.Tables[1].Rows)
                {
                    DataRow dataRow = dt.NewRow();
                    dataRow["Region_Code"] = drs["Region_Code"].ToString();
                    int intSundaysCount = Convert.ToInt16(objActivity.GetSundayCount(drs["User_Code"].ToString()));
                    int holiday = Convert.ToInt16(objActivity.GetHolidayCount(drs["User_Code"].ToString(), drs["Region_Code"].ToString(), startDate, endDate, "'2'", "COUNT"));
                    double Leave = objActivity.GetFlagCount(drs["User_Code"].ToString(), 'L');
                    double fieldCount = objActivity.GetFlagCount(drs["User_Code"].ToString(), 'F');
                    double attendance = objActivity.GetFlagCount(drs["User_Code"].ToString(), 'A');
                    dataRow["Field"] = fieldCount.ToString();
                    dataRow["Attendance"] = attendance.ToString();
                    dataRow["Holiday"] = holiday.ToString();
                    dataRow["Sunday"] = intSundaysCount.ToString();
                    dataRow["Leave"] = Leave.ToString();
                    dt.Rows.Add(dataRow);
                }
            }

            ds.Tables.Add(dt);
            ds.AcceptChanges();

            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDayAnalysisPopupReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string parentregionCode = "";
            ds = _objSPData.GetDayAnalysisPopupReport(companyCode, "'" + regionCode + "'", "''", startDate, endDate);
            DataSet dsParentRegion = new DataSet();
            DataSet dsHoliday = new DataSet();
            DataTable dt = new DataTable();
            dt.Columns.Add("Region_Code");
            dt.Columns.Add("DCR_Date");
            dt.Columns.Add("Holiday_Name");
            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drs in ds.Tables[0].Rows)
                {
                    dsParentRegion = _objSPData.dsParentRegion(companyCode, drs["Region_Code"].ToString());
                    if (dsParentRegion.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsParentRegion.Tables[0].Rows)
                        {
                            parentregionCode += "'" + dr["Region_Code"].ToString() + "',";
                        }
                    }

                    if (!string.IsNullOrEmpty(parentregionCode))
                    {
                        parentregionCode = parentregionCode.TrimEnd(',');
                    }
                    else
                    {
                        parentregionCode = "''";
                    }
                    BL_Report objReport = new BL_Report();
                    dsHoliday = _objSPData.GetHolidayDetails(companyCode, drs["Region_Code"].ToString(), parentregionCode, startDate, endDate, "");
                    foreach (DataRow drSub in dsHoliday.Tables[0].Rows)
                    {

                        DataRow dataRow = dt.NewRow();
                        dataRow["Region_Code"] = drs["Region_Code"].ToString();
                        dataRow["DCR_Date"] = drSub["Holiday_Date"].ToString();
                        dataRow["Holiday_Name"] = drSub["Holiday"].ToString();
                        dt.Rows.Add(dataRow);
                    }

                }

            }

            ds.Tables.Add(dt);
            ds.AcceptChanges();

            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetDoctorVisitsFrequencyAnalysis(FormCollection collection)
        {
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet ds = new DataSet();
            BL_Report _objReport = new BL_Report();
            ds = _objReport.GetDoctorVisitsFrequencyAnalysis(companyCode, regionCode, startDate, endDate);
            //    DataControl.JSONConverter json = new DataControl.JSONConverter();
            // return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

            return GetDoctorVisitFreAnalysis(ds, startDate, endDate);
        }

        public string GetDoctorVisitFreAnalysis(DataSet ds, string startDate, string endDate)
        {

            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableContentSub = new StringBuilder();
            StringBuilder sbType = new StringBuilder();


            string divisionName = "";
            string catString = "";
            int visitCount = 0;
            int totalDoctor = 0;
            int doctorCoverage = 0;
            int actualVisit = 0;
            int totalActualVisit = 0;
            double avg = 0.0;

            int iRow = 0;
            DataRow[] drFilter;

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorVisitsFrequency' >");
                tableContent.Append("<thead><tr style='display: none;' id='tblTr'>");
                tableContent.Append("<th align='left' width='15%'>User Name</th>");
                tableContent.Append("<th align='left' width='15%'>User Type Name</th>");
                tableContent.Append("<th align='left' width='15%'>Territory Name</th>");
                tableContent.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContent.Append("<th align='left' width='15%'>Division Name</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting manager</th>");
                tableContent.Append("<th align='left' width='15%'>Reporting HQ</th>");
                tableContent.Append("<th align='left' width='15%'>Actual Total Visits</th>");
                sbType.Append("[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type:'text' },{ type: 'text' },{ type: 'text' },{ type: 'number-range' }");

                tableContentSub.Append("<tr>");
                tableContentSub.Append("<th align='left' width='15%'>User Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>User Type Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Territory Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Employee Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Division Name</th>");
                tableContentSub.Append("<th align='left' width='15%'>Reporting manager</th>");
                tableContentSub.Append("<th align='left' width='15%'>Reporting HQ</th>");
                tableContentSub.Append("<th align='left' width='15%'>Total drs count</th>");

                iRow = 8;
                //Actual category Drs Visits
                if (ds.Tables[2].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        iRow++;
                        catString = string.Empty;
                        catString = ds.Tables[2].Rows[i]["Category_Name"].ToString();
                        tableContent.Append("<th align='left' width='15%'>");
                        tableContent.Append(catString);
                        tableContent.Append(" drs count</th>");

                        tableContentSub.Append("<th align='left' width='15%'>");
                        tableContentSub.Append(catString);
                        tableContentSub.Append(" drs count</th>");
                        sbType.Append(", { type: 'number-range' }");
                    }
                }

                //category wise Drs Met as per visit count
                if (ds.Tables[2].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        iRow++;
                        catString = string.Empty;
                        catString = ds.Tables[2].Rows[i]["Category_Name"].ToString();
                        tableContent.Append("<th align='left' width='15%'>");
                        tableContent.Append(catString);
                        tableContent.Append(" Drs Met as per visit count</th>");

                        tableContentSub.Append("<th align='left' width='15%'>");
                        tableContentSub.Append(catString);
                        tableContentSub.Append(" Drs Met as per visit count</th>");
                        sbType.Append(", { type: 'number-range' }");
                    }
                }
                //Freq. achived category wise visits
                if (ds.Tables[2].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        iRow++;
                        catString = string.Empty;
                        catString = ds.Tables[2].Rows[i]["Category_Name"].ToString();
                        tableContent.Append("<th align='left' width='15%'>Freq. achived ");
                        tableContent.Append(catString);
                        tableContent.Append(" Drs Visits</th> ");
                        tableContentSub.Append("<th align='left' width='15%'>Freq. achived ");
                        tableContentSub.Append(catString);
                        tableContentSub.Append(" Drs Visits</th>");
                        sbType.Append(", { type: 'number-range' }");
                    }
                }
                iRow++;
                //Total Freq. achived Visits
                tableContent.Append("<th align='left' width='15%'>Total Freq. achived Visits</th>");
                tableContentSub.Append("<th align='left' width='15%'>Total Freq. achived Visits</th>");
                sbType.Append(", { type: 'number-range' }");

                //SC Visits %
                if (ds.Tables[2].Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                        iRow++;
                        catString = string.Empty;
                        catString = ds.Tables[2].Rows[i]["Category_Name"].ToString();

                        tableContent.Append("<th align='left' width='15%'>");
                        tableContent.Append(catString);
                        tableContent.Append(" Visits %</th>");
                        tableContentSub.Append("<th align='left' width='15%'>");
                        tableContentSub.Append(catString);
                        tableContentSub.Append(" Visits %</th>");
                        sbType.Append(", { type: 'number-range' }");
                    }
                }

                //Total Visits %
                iRow++;
                sbType.Append(", { type: 'number-range' }]");
                tableContent.Append("<th align='left' width='15%'>Total Visits %</th>");
                tableContentSub.Append("<th align='left' width='15%'>Total Visits %</th>");
                tableContent.Append("</tr>");
                tableContentSub.Append("</tr>");

                tableContent.Append(tableContentSub);

                tableContent.Append("<tr >");
                tableContent.Append("<th colspan= '" + iRow + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                tableContent.Append("</tr>");
                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    tableContent.Append("<tr><td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["User_Type_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["Region_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["Employee_Name"].ToString());
                    tableContent.Append("</td>");
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        drFilter = ds.Tables[1].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "'");

                        divisionName = "";
                        if (drFilter.Length > 0)
                        {
                            for (int j = 0; j < drFilter.Length; j++)
                            {
                                divisionName += drFilter[j]["Division_Name"].ToString() + ",";
                            }

                        }
                        if (divisionName != "")
                        {
                            divisionName = divisionName.TrimEnd(',');
                        }
                        tableContent.Append("<td align='left' width='15%'>");
                        tableContent.Append(divisionName);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='left' width='15%'></td>");
                    }

                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["Manager_Name"].ToString());
                    tableContent.Append("</td><td align='left' width='15%'>");
                    tableContent.Append(ds.Tables[0].Rows[i]["Manager_Region_Name"].ToString());
                    tableContent.Append("</td>");
                    //Actual category Drs Visits
                    tableContentSub = new StringBuilder();
                    totalDoctor = 0;
                    for (int j = 0; j < ds.Tables[2].Rows.Count; j++)
                    {

                        drFilter = ds.Tables[3].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");
                        //  var dJsonData = jsonPath(ds, "$.Tables[3].Rows[?(@.Region_Code=='" + ds.Tables[0].Rows[i].Region_Code + "' & @.Category=='" + ds.Tables[2].Rows[j].Category_Code + "')]");
                        if (drFilter.Length > 0)
                        {
                            if (ds.Tables[2].Rows[j]["Visit_Count"].ToString() != null && ds.Tables[2].Rows[j]["Visit_Count"].ToString() != "")
                            {
                                visitCount = Convert.ToInt32(ds.Tables[2].Rows[j]["Visit_Count"].ToString());
                            }
                            else
                            {
                                visitCount = 0;
                            }
                            if (drFilter.Length > 0)
                            {
                                tableContentSub.Append("<td align='center' width='8%' onclick='fnDoctorVisitsFrequencyPopup(\"");
                                tableContentSub.Append(ds.Tables[0].Rows[i]["Region_Code"].ToString());
                                tableContentSub.Append("_");
                                tableContentSub.Append(ds.Tables[0].Rows[i]["User_Code"].ToString());
                                tableContentSub.Append("_");
                                tableContentSub.Append(startDate);
                                tableContentSub.Append("_");
                                tableContentSub.Append(endDate);
                                tableContentSub.Append("_");
                                tableContentSub.Append(ds.Tables[2].Rows[j]["Category_Code"].ToString());
                                tableContentSub.Append("_ACTUAL\")' style='text-decoration:underline;cursor:pointer'>");
                                tableContentSub.Append(Convert.ToInt32(drFilter[0]["Count"].ToString()) * visitCount);
                                tableContentSub.Append("</td>");
                                totalDoctor = totalDoctor + (Convert.ToInt32(drFilter[0]["Count"].ToString()) * visitCount);
                            }
                            else
                            {
                                tableContentSub.Append("<td align='center' width='15%'>0</td>");
                            }
                        }
                        else
                        {
                            tableContentSub.Append("<td align='center' width='15%'>0</td>");

                        }

                    }
                    var categoryDummy = "";
                    if (totalDoctor > 0)
                    {
                        tableContent.Append("<td align='center' width='8%' onclick='fnDoctorVisitsFrequencyPopup(\"");
                        tableContent.Append(ds.Tables[0].Rows[i]["Region_Code"].ToString());
                        tableContent.Append("_");
                        tableContent.Append(ds.Tables[0].Rows[i]["User_Code"].ToString());
                        tableContent.Append("_");
                        tableContent.Append(startDate);
                        tableContent.Append("_");
                        tableContent.Append(endDate);
                        tableContent.Append("_");
                        tableContent.Append(categoryDummy);
                        tableContent.Append("_TOTAL\")' style='text-decoration:underline;cursor:pointer'>");
                        tableContent.Append(totalDoctor);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContentSub.Append("<td align='center' width='15%'>0</td>");
                    }
                    tableContent.Append(tableContentSub);
                    int doctorFreqAvg = 0;
                    totalDoctor = 0;
                    tableContentSub = new StringBuilder();
                    for (var j = 0; j < ds.Tables[2].Rows.Count; j++)
                    {
                        if (ds.Tables[2].Rows[j]["Visit_Count"].ToString() != null && ds.Tables[2].Rows[j]["Visit_Count"].ToString() != "")
                        {
                            visitCount = Convert.ToInt32(ds.Tables[2].Rows[j]["Visit_Count"].ToString());
                        }
                        else
                        {
                            visitCount = 0;
                        }

                        drFilter = ds.Tables[3].Select("Region_Code='"
                            + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");

                        if (drFilter.Length > 0)
                        {
                            doctorFreqAvg = Convert.ToInt32(drFilter[0]["Count"].ToString());
                        }


                        drFilter = ds.Tables[4].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "' AND Count >='" + visitCount + "'");

                        if (drFilter.Length > 0 && doctorFreqAvg > 0)
                        {
                            tableContent.Append("<td align='center' width='15%'>");
                            tableContent.Append(Convert.ToInt32(drFilter.Length));
                            tableContent.Append("</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' width='15%'>0</td>");
                        }


                    }
                    doctorFreqAvg = 0;
                    totalDoctor = 0;
                    actualVisit = 0;
                    totalActualVisit = 0;
                    for (var j = 0; j < ds.Tables[2].Rows.Count; j++)
                    {
                        doctorFreqAvg = 0;

                        drFilter = ds.Tables[4].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");

                        if (drFilter.Length > 0)
                        {

                            for (int k = 0; k < drFilter.Length; k++)
                            {
                                doctorFreqAvg = doctorFreqAvg + Convert.ToInt32(drFilter[k]["Count"].ToString());

                            }
                            totalDoctor = totalDoctor + doctorFreqAvg;
                        }


                        drFilter = ds.Tables[3].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");
                        if (drFilter.Length > 0)
                        {
                            actualVisit = Convert.ToInt32(drFilter[0]["Count"].ToString());
                            totalActualVisit = totalActualVisit + Convert.ToInt32(drFilter[0]["Count"].ToString());
                        }

                        if (doctorFreqAvg > 0 && actualVisit > 0)
                        {
                            tableContentSub.Append("<td align='center' width='8%' onclick='fnDoctorVisitsFrequencyPopup(\"");
                            tableContentSub.Append(ds.Tables[0].Rows[i]["Region_Code"].ToString());
                            tableContentSub.Append("_");
                            tableContentSub.Append(ds.Tables[0].Rows[i]["User_Code"].ToString());
                            tableContentSub.Append("_");
                            tableContentSub.Append(startDate);
                            tableContentSub.Append("_");
                            tableContentSub.Append(endDate);
                            tableContentSub.Append("_");
                            tableContentSub.Append(ds.Tables[2].Rows[j]["Category_Code"].ToString());
                            tableContentSub.Append("_FREQACHIVED\")' style='text-decoration:underline;cursor:pointer'>");
                            tableContentSub.Append(doctorFreqAvg);
                            tableContentSub.Append("</td>");
                        }
                        else
                        {
                            tableContentSub.Append("<td align='center' width='15%'>0</td>");
                        }
                    }
                    tableContent.Append(tableContentSub);
                    if (totalActualVisit > 0)
                    {
                        tableContent.Append("<td align='center' width='15%'>");
                        tableContent.Append(totalDoctor);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' width='15%'>0</td>");
                    }

                    //SC Drs Coverage %
                    actualVisit = 0;
                    totalActualVisit = 0;
                    doctorCoverage = 0;
                    totalDoctor = 0;
                    for (var j = 0; j < ds.Tables[2].Rows.Count; j++)
                    {
                        actualVisit = 0;
                        doctorCoverage = 0;
                        if (ds.Tables[2].Rows[j]["Visit_Count"].ToString() != null && ds.Tables[2].Rows[j]["Visit_Count"].ToString() != "")
                        {
                            visitCount = Convert.ToInt32(ds.Tables[2].Rows[j]["Visit_Count"].ToString());
                        }
                        else
                        {
                            visitCount = 0;
                        }

                        drFilter = ds.Tables[3].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");

                        if (drFilter.Length > 0)
                        {
                            actualVisit = (Convert.ToInt32(drFilter[0]["Count"].ToString()) * visitCount);
                            totalActualVisit = totalActualVisit + (Convert.ToInt32(drFilter[0]["Count"].ToString()) * visitCount);
                        }

                        drFilter = ds.Tables[4].Select("Region_Code='" + ds.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Category='" + ds.Tables[2].Rows[j]["Category_Code"].ToString() + "'");
                        if (drFilter.Length > 0)
                        {
                            for (int k = 0; k < drFilter.Length; k++)
                            {
                                doctorCoverage = doctorCoverage + Convert.ToInt32(drFilter[k]["Count"].ToString());
                            }
                            totalDoctor = totalDoctor + doctorCoverage;
                        }

                        if (actualVisit > 0)
                        {
                            avg = (Convert.ToDouble(doctorCoverage) / Convert.ToDouble(actualVisit)) * 100;
                            tableContent.Append("<td align='center' width='15%' title='Total No of ");
                            tableContent.Append(ds.Tables[2].Rows[j]["Category_Name"].ToString());
                            tableContent.Append(" Drs Visits Met/Total No of ");
                            tableContent.Append(ds.Tables[2].Rows[j]["Category_Name"].ToString());
                            tableContent.Append(" Visits)*100'>");
                            tableContent.Append(avg.ToString("N2"));
                            tableContent.Append("</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' width='15%'>0</td>");
                        }
                    }
                    avg = 0;
                    if (totalActualVisit > 0)
                    {
                        avg = (Convert.ToDouble(totalDoctor) / Convert.ToDouble(totalActualVisit)) * 100;
                        tableContent.Append("<td align='center' width='15%'  title='Total No of Drs Visits Met/Total Visits)*100'>");
                        tableContent.Append(avg.ToString("N2"));
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center' width='15%'>0</td>");
                    }

                    tableContent.Append("</tr>");
                }

                tableContent.Append("</tbody>");
                tableContent.Append("</table>^" + sbType.ToString() + "");
            }
            return tableContent.ToString();
        }

        public JsonResult GetDoctorVisitsFrequencyPopup(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string category = collection["category"].ToString();
            ds = _objSPData.GetDoctorVisitsFrequencyPopup(companyCode, "'" + regionCode + "'", "''", startDate, endDate, category);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        //  TP vs Actual Deviation Details
        public JsonResult GetTPvsActualDeviationDetails(FormCollection collection)
        {
            string month = collection["month"].ToString();
            string year = collection["year"].ToString();
            string regionCode = collection["regionCode"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetTPvsActualDeviationDetails(_objcurrentInfo.GetCompanyCode(), regionCode, month, year, "");
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetDoctorCallAnalysis(FormCollection collection)
        {
            DataSet ds = new DataSet();
            BL_Report objReport = new BL_Report();

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string reportViewType = collection["reportViewType"].ToString();

            ds = objReport.GetDoctorCallAnalysis(companyCode, regionCode, startDate, endDate);

            if (reportViewType == "1")
            {
                return GetDoctorCallAnalysisTable(ds, startDate, endDate);
            }
            else
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "DOCTORCALLANALYSIS_" + "_" + compCode + "_" + userName + ".xls";
                string reportHTML = GetDoctorCallAnalysisTable(ds, startDate, endDate);
                string blobUrl = objAzureBlob.AzureBlobUploadText(reportHTML.Split('^')[0].ToString(), accKey, fileName, "bulkdatasvc");
                return "<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + blobUrl + "</a></div>";
            }
        }
        public string GetDoctorCallAnalysisTable(DataSet ds, string startDate, string endDate)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tblcoveredDr = new StringBuilder();
            StringBuilder tblcoveredAvg = new StringBuilder();
            StringBuilder tbltotalDoctor = new StringBuilder();
            StringBuilder type = new StringBuilder();
            DataRow[] dr;
            DataRow[] drFilter;
            string divisionName = string.Empty;

            if (ds.Tables[0].Rows.Count > 0)
            {
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorCallAnalysis' >");
                tableContent.Append("<thead>");
                // HEADER 1
                tableContent.Append("<tr style='display: none;' id='tblTr'>");
                tableContent.Append("<th align='left' >User Name</th>");
                tableContent.Append("<th align='left' >User Type Name</th>");
                tableContent.Append("<th align='left' >Territory Name</th>");
                tableContent.Append("<th align='left' >Employee Name</th>");
                tableContent.Append("<th align='left' >Division Name</th>");
                tableContent.Append("<th align='left' >Reporting manager</th>");
                tableContent.Append("<th align='left' >Reporting HQ</th>");
                tableContent.Append("<th align='left' >Total Drs Count</th>");
                DataTable categoryTable = ds.Tables[2];
                DataTable userDetailsTable = ds.Tables[0];
                DataTable divisionTable = ds.Tables[1];
                DataTable doctorTable = ds.Tables[3];
                DataTable doctorVisitTable = ds.Tables[4];


                for (var i = 0; i < categoryTable.Rows.Count; i++)
                {
                    tableContent.Append("<th align='left' width='15%'>Total ");
                    tableContent.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tableContent.Append(" Drs Count</th>");
                    tblcoveredDr.Append("<th align='left' width='15%'>");
                    tblcoveredDr.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tblcoveredDr.Append(" Drs Met Count</th>");
                    tblcoveredAvg.Append("<th align='left' width='15%'>");
                    tblcoveredAvg.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tblcoveredAvg.Append(" Drs Count %</th>");
                }

                tableContent.Append("<th align='left' >Listed Drs Met Count</th>");
                tableContent.Append(tblcoveredDr);
                tableContent.Append("<th align='left' >Non listed Drs Met Count</th>");
                tableContent.Append(tblcoveredAvg);
                tableContent.Append("<th align='left' >Total Drs Coverage %</th>");
                tableContent.Append("</tr>");

                // HEADER 2
                tableContent.Append("<tr>");
                tableContent.Append("<th align='left' >User Name</th>");
                tableContent.Append("<th align='left' >User Type Name</th>");
                tableContent.Append("<th align='left' >Territory Name</th>");
                tableContent.Append("<th align='left' >Employee Name</th>");
                tableContent.Append("<th align='left' >Division Name</th>");
                tableContent.Append("<th align='left' >Reporting manager</th>");
                tableContent.Append("<th align='left' >Reporting HQ</th>");
                tableContent.Append("<th align='left' >Total Drs Count</th>");

                type.Append("[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'number-range' }");
                tblcoveredDr = new StringBuilder();
                tblcoveredAvg = new StringBuilder();

                for (var i = 0; i < categoryTable.Rows.Count; i++)
                {
                    type.Append(", { type: 'number-range' }");
                    tableContent.Append("<th align='left' width='15%'>Total ");
                    tableContent.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tableContent.Append(" Drs Count</th>");
                    type.Append(", { type: 'number-range' }");
                    tblcoveredDr.Append("<th align='left' width='15%'> ");
                    tblcoveredDr.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tblcoveredDr.Append(" Drs Met Count</th>");
                    type.Append(", { type: 'number-range' }");
                    tblcoveredAvg.Append("<th align='left' width='15%'>");
                    tblcoveredAvg.Append(categoryTable.Rows[i]["Category_Name"].ToString());
                    tblcoveredAvg.Append(" Drs Count %</th>");
                }

                type.Append(", { type: 'number-range' }");
                tableContent.Append("<th align='left' >Listed Drs Met Count</th>");
                tableContent.Append(tblcoveredDr);
                type.Append(", { type: 'number-range' }");
                tableContent.Append("<th align='left' >Non listed Drs Met Count</th>");
                tableContent.Append(tblcoveredAvg);
                type.Append(", { type: 'number-range' }]");
                tableContent.Append("<th align='left' >Total Drs Coverage %</th>");
                tableContent.Append("</tr>");


                tableContent.Append("<tr >");
                tableContent.Append("<th colspan= '" + (11 + (categoryTable.Rows.Count * 3)) + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                tableContent.Append("</tr>");

                tableContent.Append("</thead>");
                tableContent.Append("<tbody>");
                tblcoveredDr = new StringBuilder();
                tblcoveredAvg = new StringBuilder();
                for (var i = 0; i < userDetailsTable.Rows.Count; i++)
                {
                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(userDetailsTable.Rows[i]["User_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(userDetailsTable.Rows[i]["User_Type_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(userDetailsTable.Rows[i]["Region_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left'>");
                    tableContent.Append(userDetailsTable.Rows[i]["Employee_Name"].ToString());
                    tableContent.Append("</td>");


                    if (divisionTable.Rows.Count > 0)
                    {
                        dr = ds.Tables[1].Select("Region_Code='" + userDetailsTable.Rows[i]["Region_Code"].ToString() + "'");
                        divisionName = "";
                        if (dr.Length > 0)
                        {
                            for (var j = 0; j < dr.Length; j++)
                            {
                                divisionName += dr[j]["Division_Name"].ToString() + ",";
                            }

                            if (divisionName != "")
                            {
                                divisionName = divisionName.Substring(0, divisionName.Length - 1);
                            }
                        }
                    }
                    tableContent.Append("<td align='left' >");
                    tableContent.Append(divisionName);
                    tableContent.Append("</td>");

                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailsTable.Rows[i]["Manager_Name"].ToString());
                    tableContent.Append("</td>");
                    tableContent.Append("<td align='left' width='15%'>");
                    tableContent.Append(userDetailsTable.Rows[i]["Manager_Region_Name"].ToString());
                    tableContent.Append("</td>");

                    int totalCoverdDoc = 0;
                    double avg = 0.0;
                    int totalDoctorCount = 0;
                    int categoryWiseDoctor = 0;
                    int categoryWiseAvg = 0;
                    tbltotalDoctor = new StringBuilder();
                    tblcoveredAvg = new StringBuilder();
                    tblcoveredDr = new StringBuilder();
                    for (var j = 0; j < categoryTable.Rows.Count; j++)
                    {
                        //  DOCTOR COUNT CATEGORY WISE
                        categoryWiseDoctor = 0;
                        categoryWiseAvg = 0;
                        dr = doctorTable.Select("Region_Code='" + userDetailsTable.Rows[i]["Region_Code"].ToString() + "' AND Category='" + categoryTable.Rows[j]["Category_Code"].ToString() + "'");

                        if (dr.Length > 0)
                        {
                            tbltotalDoctor.Append("<td align='center' width='8%' onclick='fnDoctorCallAnalysisPopup(\"");
                            tbltotalDoctor.Append(userDetailsTable.Rows[i]["Region_Code"].ToString());
                            tbltotalDoctor.Append("_");
                            tbltotalDoctor.Append(userDetailsTable.Rows[i]["User_Code"].ToString());
                            tbltotalDoctor.Append("_");
                            tbltotalDoctor.Append(startDate);
                            tbltotalDoctor.Append("_");
                            tbltotalDoctor.Append(endDate);
                            tbltotalDoctor.Append("_");
                            tbltotalDoctor.Append(categoryTable.Rows[j]["Category_Code"].ToString());
                            tbltotalDoctor.Append("_MASTER\")' style='text-decoration:underline;cursor:pointer'>");
                            tbltotalDoctor.Append(dr[0]["Count"].ToString());
                            tbltotalDoctor.Append("</td>");
                            categoryWiseDoctor = Convert.ToInt32(dr[0]["Count"].ToString());
                            totalDoctorCount = totalDoctorCount + Convert.ToInt32(dr[0]["Count"].ToString());
                        }
                        else
                        {
                            tbltotalDoctor.Append("<td align='center'>0</td>");
                        }
                        //  DOCTOR MET COUNT
                        if (categoryWiseDoctor > 0)
                        {
                            drFilter = doctorVisitTable.Select("Region_Code='" + userDetailsTable.Rows[i]["Region_Code"].ToString() + "' AND Category='" + categoryTable.Rows[j]["Category_Code"].ToString() + "'");

                            if (drFilter.Length > 0)
                            {
                                tblcoveredDr.Append("<td align='center' width='8%' onclick='fnDoctorCallAnalysisPopup(\"");
                                tblcoveredDr.Append(userDetailsTable.Rows[i]["Region_Code"].ToString());
                                tblcoveredDr.Append("_");
                                tblcoveredDr.Append(userDetailsTable.Rows[i]["User_Code"].ToString());
                                tblcoveredDr.Append("_");
                                tblcoveredDr.Append(startDate);
                                tblcoveredDr.Append("_");
                                tblcoveredDr.Append(endDate);
                                tblcoveredDr.Append("_");
                                tblcoveredDr.Append(categoryTable.Rows[j]["Category_Code"].ToString());
                                tblcoveredDr.Append("_COVERED\")' style='text-decoration:underline;cursor:pointer'>");
                                tblcoveredDr.Append(drFilter.Length);
                                tblcoveredDr.Append("</td>");
                                categoryWiseAvg = Convert.ToInt32(drFilter.Length);
                                totalCoverdDoc = totalCoverdDoc + Convert.ToInt32(drFilter.Length);
                            }
                            else
                            {
                                tblcoveredDr.Append("<td align='center'>0</td>");
                            }

                        }
                        else
                        {
                            tblcoveredDr.Append("<td align='center'>0</td>");
                        }

                        avg = 0.0;
                        if (categoryWiseDoctor > 0)
                        {
                            avg = (Convert.ToDouble(categoryWiseAvg) / Convert.ToDouble(categoryWiseDoctor)) * 100;
                            tblcoveredAvg.Append("<td align='center'>");
                            tblcoveredAvg.Append(avg.ToString("N2"));
                            tblcoveredAvg.Append("</td>");
                        }
                        else
                        {
                            tblcoveredAvg.Append("<td align='center'>0</td>");
                        }
                    }
                    tableContent.Append("<td align='center' width='8%' onclick='fnDoctorCallAnalysisPopup(\"");
                    tableContent.Append(userDetailsTable.Rows[i]["Region_Code"].ToString());
                    tableContent.Append("_");
                    tableContent.Append(userDetailsTable.Rows[i]["User_Code"].ToString());
                    tableContent.Append("_");
                    tableContent.Append(startDate);
                    tableContent.Append("_");
                    tableContent.Append(endDate);
                    tableContent.Append("_TOTAL_MASTER\")' style='text-decoration:underline;cursor:pointer'>");
                    tableContent.Append(totalDoctorCount);
                    tableContent.Append("</td>");
                    // tableContent.Append("<td align='center'>" + totalDoctorCount + "</td>");
                    tableContent.Append(tbltotalDoctor);
                    //Listed Drs Covered
                    // tableContent.Append("<td align='center'>" + totalCoverdDoc + "</td>");
                    tableContent.Append("<td align='center' width='8%' onclick='fnDoctorCallAnalysisPopup(\"");
                    tableContent.Append(userDetailsTable.Rows[i]["Region_Code"].ToString());
                    tableContent.Append("_");
                    tableContent.Append(userDetailsTable.Rows[i]["User_Code"].ToString());
                    tableContent.Append("_");
                    tableContent.Append(startDate);
                    tableContent.Append("_");
                    tableContent.Append(endDate);
                    tableContent.Append("_TOTAL_COVERED\")' style='text-decoration:underline;cursor:pointer'>");
                    tableContent.Append(totalCoverdDoc);
                    tableContent.Append("</td>");

                    tableContent.Append(tblcoveredDr);

                    // Total Non listed Drs

                    drFilter = doctorVisitTable.Select("Region_Code='" + userDetailsTable.Rows[i]["Region_Code"].ToString() + "' AND (Category = '' OR Category IS NULL)");

                    //var dJsonData = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + userDetailsTable.Rows[i]["Region_Code + "' & (@.Category==''| @.Category==null))]");

                    if (drFilter.Length > 0)
                    {
                        tableContent.Append("<td align='center'>");
                        tableContent.Append(drFilter.Length);
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                    }

                    tableContent.Append(tblcoveredAvg);
                    avg = 0.0;
                    if (totalCoverdDoc > 0)
                    {
                        avg = (Convert.ToDouble(totalCoverdDoc) / Convert.ToDouble(totalDoctorCount)) * 100;
                        tableContent.Append("<td align='center'>");
                        tableContent.Append(avg.ToString("N2"));
                        tableContent.Append("</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0</td>");
                    }
                    tableContent.Append("</tr>");
                }

                tableContent.Append("</tbody>");
                tableContent.Append("</table>^");
                tableContent.Append(type);
            }
            return tableContent.ToString();
        }

        public JsonResult GetDoctorCallAnalysisPopup(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string category = collection["category"].ToString();
            string mode = collection["mode"].ToString();
            ds = _objSPData.GetDoctorCallAnalysisPopup(companyCode, "'" + regionCode + "'", "''", startDate, endDate, category, mode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        //************************************************************************TPStatus_Report************************************************************************************//

        public string GetTPstatus(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdGetTPStatusReport " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "','" + Status + "'");
                return GetTpstatusTable(dsReport, month, year, Status);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string GetTpstatusTable(DataSet dsReport, string month, string year, string Status)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder tableContentsub = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;

            tableContent.Append("<table class='data display datatable' id='tbl_dayanalysis'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none;' id='tblTrmain'>");
            tableContent.Append("<th>User Name</th>");
            tableContent.Append("<th>User Type</th>");
            tableContent.Append("<th>Territory Name</th>");
            tableContent.Append("<th>Division</th>");
            tableContent.Append("<th>Reporting Manager</th>");
            tableContent.Append("<th>Reporting HQ</th>");
            tableContent.Append("<th>No of days TP entered</th>");
            tableContent.Append("<th>Field Working Days</th>");
            tableContent.Append("<th>Num of Days Not entered CP Name</th>");
            tableContent.Append("<th>Num of Day Not entered Accompanist</th>");
            tableContent.Append("<th>Num of Days Not entered Doctors</th>");
            tableContent.Append("<th>Num of days never linked samples for enteted doctors</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'}");
            type.Append(",{type : 'number-range'},{type : 'number-range'},{type : 'number-range'},{type : 'number-range'},{type : 'number-range'},{type : 'number-range'}]");
            tableContent.Append("<tr>");
            tableContent.Append("<th>User Name</th>");
            tableContent.Append("<th>User Type</th>");
            tableContent.Append("<th>Territory Name</th>");
            tableContent.Append("<th>Division</th>");
            tableContent.Append("<th>Reporting Manager</th>");
            tableContent.Append("<th>Reporting HQ</th>");
            tableContent.Append("<th>No of days TP entered</th>");
            tableContent.Append("<th>Field Working Days</th>");
            tableContent.Append("<th>Num of Days Not entered CP Name</th>");
            tableContent.Append("<th>Num of Day Not entered Accompanist</th>");
            tableContent.Append("<th>Num of Days Not entered Doctors</th>");
            tableContent.Append("<th>Num of days never linked samples for enteted doctors</th>");
            tableContent.Append("</tr>");
            tableContent.Append("<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeamain()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");
            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td>");
                //tableContent.Append( jsData.Tables[0].Rows[i].User_Name);
                tableContent.Append(dsReport.Tables[0].Rows[i]["User_Name"].ToString());
                tableContent.Append("<input type='hidden' id='txt_user_" + i + "'value='" + dsReport.Tables[0].Rows[i]["User_Code"].ToString() + "'/>");
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["User_Type_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Region_Name"].ToString());
                tableContent.Append("</td>");

                drt = dsReport.Tables[1].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                divisionName = "";
                if (drt.Length > 0)
                {
                    foreach (DataRow dr in drt)
                    {
                        divisionName += dr["Division_Name"].ToString() + ',';
                    }
                }

                if (!string.IsNullOrEmpty(divisionName))
                {
                    divisionName = divisionName.TrimEnd(',');
                }
                tableContent.Append("<td style='text-align:left' >" + divisionName + "</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Manager_Region_Name"].ToString());
                tableContent.Append("</td>");
                //NO of days entered Tp
                if (dsReport.Tables[2].Rows.Count > 0)
                {
                    drt = dsReport.Tables[2].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                    string TpDate = string.Empty;
                    if (drt.Length > 0)
                    {
                        foreach (DataRow dr in drt)
                        {
                            TpDate += dr["Tp_Count"].ToString();
                        }
                        tableContent.Append("<td align='center' >" + TpDate + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0 </td>  ");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>0 </td>  ");
                }
                //Field working days
                if (dsReport.Tables[7].Rows.Count > 0)
                {
                    drt = dsReport.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                    string Field = string.Empty;
                    if (drt.Length > 0)
                    {
                        foreach (DataRow dr in drt)
                        {
                            Field += dr["Field"].ToString();
                        }
                        tableContent.Append("<td align='center'>" + Field + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0 </td>  ");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>0 </td>  ");
                }
                //NO of days not entered cp name
                if (dsReport.Tables[3].Rows.Count > 0)
                {
                    DataControl.BLMaster objMaster = new BLMaster();
                    string camPlanner = objMaster.GetPrivilegeValue(_objcurrentInfo.GetCompanyCode(), dsReport.Tables[0].Rows[i]["User_Code"].ToString(), "CAMPAIGN_PLANNER");

                    if (camPlanner != "NO" && camPlanner != "")
                    {
                        drt = dsReport.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();


                        string CpCount = string.Empty;
                        if (drt.Length > 0)
                        {
                            foreach (DataRow dr in drt)
                            {
                                CpCount += dr["CP_Name"].ToString();
                            }
                            //  tableContent.Append("<td >" + CpCount + "</td>");
                            tableContent.Append("<td align='center' class='td-a' onclick='fnCpCount(\"" + dsReport.Tables[0].Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + Status + "\")' >" + CpCount + "</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center'>0 </td>  ");
                        }
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>N/A</td>");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>N/A</td>  ");
                }
                //No of days not entered acc
                if (dsReport.Tables[5].Rows.Count > 0)
                {
                    drt = dsReport.Tables[5].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                    string Accom = string.Empty;
                    if (drt.Length > 0)
                    {
                        foreach (DataRow dr in drt)
                        {
                            Accom += dr["Accom"].ToString();
                        }
                        //  tableContent.Append("<td >" + CpCount + "</td>");
                        tableContent.Append("<td align='center' class='td-a' onclick='fnAccom(\"" + dsReport.Tables[0].Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + Status + "\")' >" + Accom + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0 </td>  ");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>0 </td>  ");
                }
                //NO of days not entered doc
                if (dsReport.Tables[6].Rows.Count > 0)
                {
                    drt = dsReport.Tables[6].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                    string TpDoctors = string.Empty;
                    if (drt.Length > 0)
                    {
                        tableContent.Append("<td align='center' class='td-a' onclick='fnTpdoctors(\"" + dsReport.Tables[0].Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + Status + "\")' >" + drt.Length + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0 </td>  ");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>0 </td>  ");
                }
                //no of days never linked show for entered doctors
                if (dsReport.Tables[8].Rows.Count > 0)
                {
                    drt = dsReport.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == dsReport.Tables[0].Rows[i]["User_Code"].ToString()).ToArray();
                    string Tpproduct = string.Empty;
                    string TpId = string.Empty;
                    if (drt.Length > 0)
                    {
                        foreach (DataRow dr in drt)
                        {
                            TpId += dr["TP_Id"].ToString() + '^';
                        }
                        TpId = TpId.TrimEnd('^');
                        tableContent.Append("<td align='center' class='td-a' onclick='fnTpproduct(\"" + dsReport.Tables[0].Rows[i]["User_Code"].ToString() + "_" + month + "_" + year + "_" + Status + "_" + TpId + "\")' >" + drt.Length + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>0 </td>  ");
                    }
                }
                else
                {
                    tableContent.Append("<td align='center'>0 </td>  ");
                }

                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();
        }
        //***************************************************************************************************//
        public string GetCPDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                //Year = collection["year"];
                string dateperiod = collection["dateperiod"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetNonCpDate " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "','" + Status + "'");
                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
                return GetCPDetailsTable(dsReport, dateperiod);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetCPDetailsTable(DataSet dsReport, string dateperiod)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;


            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' colspan='6' >User Details</th></tr></thead>");
            tableContent.Append("<tbody>");
            tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
            tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
            tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Employee Mobile No</b></td></tr>");

            drt = dsReport.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[1].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drt.Length > 0)
            {
                foreach (DataRow dr in drt)
                {
                    divisionName += dr["Division_Name"].ToString();
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }


            tableContent.Append("<tr><td>" + dsReport.Tables[1].Rows[0]["User_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Employee_Name"].ToString() + " </td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Employee_Number"].ToString() + "</td><td >" + dsReport.Tables[1].Rows[0]["Region_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Manager_Name"].ToString() + "</td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Manager_Region_Name"].ToString() + "</td><td >" + divisionName + "</td><td>" + dsReport.Tables[1].Rows[0]["Mobile"].ToString() + "</td></tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");
            tableContent.Append("<table class='data display datatable' id='tbl_CPDetails'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none;' id='tblTrcpcount'>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'date-range'},{type : 'text'}]");
            tableContent.Append("<tr>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            // tableContent.Append("<th colspan= '6' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeacpcount()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");

            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["User_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["TP_Date"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>Cp Name Not Entered</td>");
                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();
        }

        public string GetCategoryDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                string dateperiod = collection["dateperiod"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetNonCategory " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "','" + Status + "'");

                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
                return GetCategoryDetailsTable(dsReport, dateperiod);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetCategoryDetailsTable(DataSet dsReport, string dateperiod)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;

            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
            tableContent.Append("<tbody>");
            tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
            tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
            tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Employee Mobile No</b></td></tr>");

            drt = dsReport.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[1].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drt.Length > 0)
            {
                foreach (DataRow dr in drt)
                {
                    divisionName += dr["Division_Name"].ToString();
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }


            tableContent.Append("<tr><td>" + dsReport.Tables[1].Rows[0]["User_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Employee_Name"].ToString() + " </td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Employee_Number"].ToString() + "</td><td >" + dsReport.Tables[1].Rows[0]["Region_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Manager_Name"].ToString() + "</td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Manager_Region_Name"].ToString() + "</td><td >" + divisionName + "</td><td>" + dsReport.Tables[1].Rows[0]["Mobile"].ToString() + "</td></tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");

            tableContent.Append("<table class='data display datatable' id='tbl_CategoryDetails'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none' id='tblTrcategory'>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'date-range'},{type : 'text'}]");
            tableContent.Append("<tr>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            //tableContent.Append("<th colspan= '6' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeacategory()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");
            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td  style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["User_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["TP_Date"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>Category Not Entered</td>");
                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();

        }





        public string GetAccDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                string dateperiod = collection["dateperiod"];
                //Year = collection["year"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetNonAcc " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "','" + Status + "'");

                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
                return GetAccDetailsTable(dsReport, dateperiod);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetAccDetailsTable(DataSet dsReport, string dateperiod)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;

            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
            tableContent.Append("<tbody>");
            tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
            tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
            tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Employee Mobile No</b></td></tr>");

            drt = dsReport.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[1].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drt.Length > 0)
            {
                foreach (DataRow dr in drt)
                {
                    divisionName += dr["Division_Name"].ToString();
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }


            tableContent.Append("<tr><td>" + dsReport.Tables[1].Rows[0]["User_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Employee_Name"].ToString() + " </td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Employee_Number"].ToString() + "</td><td >" + dsReport.Tables[1].Rows[0]["Region_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Manager_Name"].ToString() + "</td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Manager_Region_Name"].ToString() + "</td><td >" + divisionName + "</td><td>" + dsReport.Tables[1].Rows[0]["Mobile"].ToString() + "</td></tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");

            tableContent.Append("<table class='data display datatable' id='tbl_ACCDetails'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none)' id='tblTracc'>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'date-range'},{type : 'text'}]");
            //tableContent.Append("<tr>");
            //tableContent.Append("<th style= 'display:None'>Region Name</th>");
            //tableContent.Append("<th style= 'display:None'>User Name</th>");
            //tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            //tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            //tableContent.Append("<th>TP Month</th>");
            //tableContent.Append("<th>Activity</th>");
            //tableContent.Append("</tr>");
            // tableContent.Append("<th colspan= '6' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaacc()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");
            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["User_Name"].ToString());
                tableContent.Append("</td >");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["TP_Date"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td> Not Entered Accompanist</td>");
                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();
        }

        public string GetNoEnteredDoctorDetails(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string month = collection["month"];
                string year = collection["year"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                string dateperiod = collection["dateperiod"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetNoenteredDoctors " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + month + "','" + year + "','" + Status + "'");
                // return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
                return GetNoEnteredDoctorDetailsTable(dsReport, dateperiod);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetNoEnteredDoctorDetailsTable(DataSet dsReport, string dateperiod)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;

            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
            tableContent.Append("<tbody>");
            tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
            tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
            tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Employee Mobile No</b></td></tr>");

            drt = dsReport.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[1].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drt.Length > 0)
            {
                foreach (DataRow dr in drt)
                {
                    divisionName += dr["Division_Name"].ToString();
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }


            tableContent.Append("<tr><td>" + dsReport.Tables[1].Rows[0]["User_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Employee_Name"].ToString() + " </td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Employee_Number"].ToString() + "</td><td >" + dsReport.Tables[1].Rows[0]["Region_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Manager_Name"].ToString() + "</td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Manager_Region_Name"].ToString() + "</td><td >" + divisionName + "</td><td>" + dsReport.Tables[1].Rows[0]["Mobile"].ToString() + "</td></tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");

            tableContent.Append("<table class='data display datatable' id='tbl_doctorDetails'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none;' id='tblTrdoctor'>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'date-range'},{type : 'text'}]");
            tableContent.Append("<tr>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("</tr>");
            // tableContent.Append("<th colspan= '6' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeadoctor()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");
            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["User_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["TP_Date"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td> Not Entered Doctor</td>");
                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();
        }

        public string GetNonmappedproduct(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string tpid = string.Empty;
                tpid = collection["tpid"];
                string month = collection["month"];
                string year = collection["year"];
                string dateperiod = collection["dateperiod"];
                string Status = string.Empty;
                Status = collection["Status"];
                Status = Status.TrimEnd(',');
                tpid = tpid.Replace('^', ',');

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetproductCustomerMaster " + "'" + _objcurrentInfo.GetCompanyCode() + "','''" + UserCode + "''','" + month + "','" + year + "','" + Status + "','" + tpid + "'");

                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
                return GetNonmappedproductTable(dsReport, dateperiod);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string GetNonmappedproductTable(DataSet dsReport, string dateperiod)
        {
            StringBuilder tableContent = new StringBuilder();
            StringBuilder type = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drt;
            tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >");
            tableContent.Append("<thead><tr>");
            tableContent.Append("<th align='left' colspan='8' >User Details</th></tr></thead>");
            tableContent.Append("<tbody>");
            tableContent.Append("<tr><td align='left' ><b>User Name</b></td><td align='left' ><b>Employee Name</b></td>");
            tableContent.Append("<td align='left' ><b>Employee No</b></td><td align='left' ><b>Region Name</b></td>");
            tableContent.Append("<td align='left' ><b>Reporting Manager</b></td><td align='left' ><b>Reporting Manager Region</b></td><td align='left' ><b>Division Name</b></td><td align='left' ><b>Employee Mobile No</b></td></tr>");

            drt = dsReport.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsReport.Tables[1].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drt.Length > 0)
            {
                foreach (DataRow dr in drt)
                {
                    divisionName += dr["Division_Name"].ToString();
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }


            tableContent.Append("<tr><td>" + dsReport.Tables[1].Rows[0]["User_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Employee_Name"].ToString() + " </td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Employee_Number"].ToString() + "</td><td >" + dsReport.Tables[1].Rows[0]["Region_Name"].ToString() + "</td><td>" + dsReport.Tables[1].Rows[0]["Manager_Name"].ToString() + "</td>");
            tableContent.Append("<td>" + dsReport.Tables[1].Rows[0]["Manager_Region_Name"].ToString() + "</td><td >" + divisionName + "</td><td>" + dsReport.Tables[1].Rows[0]["Mobile"].ToString() + "</td></tr>");
            tableContent.Append("</tbody>");
            tableContent.Append("</table>");

            tableContent.Append("<table class='data display datatable' id='tbl_CPDetails'>");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none;' id='tblTrtpproduct'>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("<th>Doctor Name</th>");
            tableContent.Append("<th>MDL No</th>");
            tableContent.Append("<th>Category</th>");
            tableContent.Append("<th>Speciality</th>");
            tableContent.Append("</tr>");
            type.Append("[{type : 'text'},{type : 'text'},{type : 'text'},{type : 'text'},{type : 'date-range'},{type : 'text'},{type : 'text'},{type : 'number-range'},{type : 'text'},{type : 'text'}]");
            tableContent.Append("<tr>");
            tableContent.Append("<th style= 'display:None'>Region Name</th>");
            tableContent.Append("<th style= 'display:None'>User Name</th>");
            tableContent.Append("<th style= 'display:None'>Employee Name</th>");
            tableContent.Append("<th style= 'display:None'>Reporting To</th>");
            tableContent.Append("<th>TP Month</th>");
            tableContent.Append("<th>Activity</th>");
            tableContent.Append("<th>Doctor Name</th>");
            tableContent.Append("<th>MDL No</th>");
            tableContent.Append("<th>Category</th>");
            tableContent.Append("<th>Speciality</th>");
            tableContent.Append("</tr>");
            //tableContent.Append("<th colspan= '10' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeatpproduct()'>Show Filter</span></th>");
            tableContent.Append("</thead>");
            tableContent.Append("<tbody>");
            for (int i = 0; i < dsReport.Tables[0].Rows.Count; i++)
            {
                tableContent.Append("<tr>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Region_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["User_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Employee_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td style= 'display:None'>");
                tableContent.Append(dsReport.Tables[1].Rows[0]["Manager_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["TP_Date"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>Not Mapped Product Entered Doctors</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Customer_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["MDL_Number"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Category_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("<td>");
                tableContent.Append(dsReport.Tables[0].Rows[i]["Speciality_Name"].ToString());
                tableContent.Append("</td>");
                tableContent.Append("</tr>");
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>*");
            tableContent.Append(type);
            return tableContent.ToString();

        }








        // ------------------------- Start - Tp Vs Actual Doctor Visits Report -------------------------

        public JsonResult GetTpVsActualDoctorVisits(FormCollection coll)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("exec SP_hdGetTpVsActualDoctorVisits '" + _objcurrentInfo.GetCompanyCode() + "', '" + coll["userCode"].ToString() + "','" + coll["month"].ToString() + "','" + coll["year"].ToString() + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        // ------------------------- End - Tp Vs Actual Doctor Visits Report -------------------------TpVsActualDeviationSummary
        //-----------------------------Competitor Brand Analysis --------------------------------------------------------------

        public JsonResult GetCompetitorBrandAnalysis(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            string productCode = collection["productCode"].ToString();
            string specialityCode = collection["speciality"].ToString();
            string categoryCode = collection["category"].ToString();

            ds = _objSPData.GetCompetitorBrandAnalysis(companyCode, regionCode, startDate, endDate, status, productCode, categoryCode, specialityCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDivisionWiseCateorAndSpeciality(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();

            ds = _objSPData.GetDivisionWiseCateoryAndSpeciality(companyCode, regionCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        //-------------------------------------Joined Work Analysis ------------------------------------------------------------
        public JsonResult GetJoinedWorkAnalysis(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string userCodes = "";
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            DataSet dsFieldDetails = new DataSet();
            ds = _objSPData.GetJoinedWorkAnalysis(companyCode, regionCode, startDate, endDate);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                userCodes += "'" + dr["User_Code"].ToString() + "',";
            }
            if (!string.IsNullOrEmpty(userCodes))
            {
                userCodes = userCodes.TrimEnd(',');
            }
            else
            {
                userCodes = "''";
            }
            DataTable dt = new DataTable();
            dt.Columns.Add("UserCode");
            dt.Columns.Add("Status");

            dsFieldDetails = _objSPData.GetJoinedWorkFieldDetails(companyCode, userCodes, startDate, endDate);
            if (dsFieldDetails.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drs in dsFieldDetails.Tables[0].Rows)
                {
                    DataRow dataRow = dt.NewRow();
                    dataRow["UserCode"] = drs["User_Code"].ToString();
                    dataRow["Status"] = drs["Status"].ToString();
                    dt.Rows.Add(dataRow);
                }
            }
            ds.Tables.Add(dt);
            ds.AcceptChanges();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        // ------------------------- Start - Tp Vs Actual Deviation Summary Report -------------------------

        public string GetTpVsActualDeviationSummary(FormCollection coll)
        {
            List<object> lst = new List<object>();
            lst = _objReport.GetTpVsActualDeviationSummary(coll["userCode"].ToString(), _objcurrentInfo.GetCompanyCode(),
                Convert.ToInt32(coll["month"]), Convert.ToInt32(coll["year"]));
            // Report
            List<HiDoctor_Reports.Models.MasterModel> lstMaster = new List<Models.MasterModel>();
            List<HiDoctor_Reports.Models.TPReport> lstTp1 = new List<Models.TPReport>();
            List<HiDoctor_Reports.Models.TPReport> lstTp2 = new List<Models.TPReport>();
            List<Models.TPDoctor> lstTpDoc1 = new List<Models.TPDoctor>();
            List<Models.TPDoctor> lstTPDoc2 = new List<Models.TPDoctor>();
            lstMaster = (List<Models.MasterModel>)lst[0];
            lstTp1 = (List<HiDoctor_Reports.Models.TPReport>)lst[1];
            lstTp2 = (List<HiDoctor_Reports.Models.TPReport>)lst[2];
            lstTpDoc1 = (List<HiDoctor_Reports.Models.TPDoctor>)lst[3];
            lstTPDoc2 = (List<HiDoctor_Reports.Models.TPDoctor>)lst[4];
            StringBuilder tblCont = new StringBuilder();

            tblCont.Append("<table cellspacing='0' cellpadding='0' id='tblTpVsActualDeviationSummaryReport' class='data display dataTable box' width='100%'>");
            tblCont.Append("<thead>");

            //tblCont.Append("<tr style='display: none;' id='tblTrSummary'>");
            //tblCont.Append("<th>User Name</th>");
            //tblCont.Append("<th>User Type</th>");
            //tblCont.Append("<th>Territory Name</th>");
            //tblCont.Append("<th>Division</th>");
            //tblCont.Append("<th>Reporting to</th>");
            //tblCont.Append("<th>Reporting HQ</th>");
            //tblCont.Append("<th>No of Days Planned</th>");
            //tblCont.Append("<th>No of Days Worked</th>");
            //tblCont.Append("<th>Activity</th>");
            //tblCont.Append("<th>Category</th>");
            //tblCont.Append("<th>Work Place</th>");
            //tblCont.Append("<th>Accompanist(s)</th>");
            //tblCont.Append("<th>No of CP Drs not planned in TP</th>");
            //tblCont.Append("<th>No of Drs Not visited as per TP</th>");

            //tblCont.Append("</tr></thead><tbody>");

            //var type = '[{ type: "text" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "text" },{ type: "text" }';
            //type += ',{ type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';



            tblCont.Append("<tr>");
            tblCont.Append("<th rowspan='2'>User Name</th>");
            tblCont.Append("<th rowspan='2'>User Type</th>");
            tblCont.Append("<th rowspan='2'>Territory Name</th>");
            tblCont.Append("<th rowspan='2'>Division</th>");
            tblCont.Append("<th rowspan='2'>Reporting to</th>");
            tblCont.Append("<th rowspan='2'>Reporting HQ</th>");
            tblCont.Append("<th rowspan='2'>No of Days Planned</th>");
            tblCont.Append("<th rowspan='2'>No of Days Worked</th>");
            tblCont.Append("<th colspan='4'>No of Days Deviated as per Plan</th>");
            tblCont.Append("<th rowspan='2'>No of CP Drs not planned in TP</th>");
            tblCont.Append("<th rowspan='2'>No of Drs Not visited as per TP</th>");
            tblCont.Append("</tr>");
            tblCont.Append("<tr>");
            tblCont.Append("<th>Activity</th>");
            tblCont.Append("<th>Category</th>");
            tblCont.Append("<th style='white-space: nowrap;'>Place of Work</th>");
            tblCont.Append("<th>Accompanist(s)</th>");
            tblCont.Append("</tr>");
            //tblCont.Append("<th colspan= '14' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeasummary()'>Show Filter</span></th>");
            tblCont.Append("</thead><tbody>");
            if (lst.Count > 0)
            {
                for (var i = 0; i < lstMaster.Count; i++)
                {
                    tblCont.Append("<tr>");
                    tblCont.Append("<td>" + lstMaster[i].User_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].User_Type_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Region_Name + "</td>");
                    tblCont.Append("<td>" + ((lstMaster[i].Division_Name == null) ? "-" : lstMaster[i].Division_Name) + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Manager_Name + "</td>");
                    tblCont.Append("<td>" + lstMaster[i].Reporting_Region + "</td>");

                    // planned tp and worked days
                    //var tpCount = jsonPath(jTp, "$[1].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<HiDoctor_Reports.Models.TPReport> lstTp1Filters = new List<Models.TPReport>();
                    lstTp1Filters = lstTp1.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTp1Filters.Count > 0)
                    {
                        tblCont.Append("<td>" + lstTp1Filters[0].TP_Count + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>" + lstTp1Filters[0].DCR_Count + "</td>");
                    }
                    else
                    {
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                    }

                    // deviation counts
                    //  var devCount = jsonPath(jTp, "$[2].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<HiDoctor_Reports.Models.TPReport> lstTp2Filters = new List<Models.TPReport>();
                    lstTp2Filters = lstTp2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTp2Filters.Count > 0)
                    {
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Flag + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Category + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Work + "</td>");
                        tblCont.Append("<td class='td-a' onclick='fnRedirectToDeviationDetails(\"" + lstMaster[i].Region_Code + "\")'>"
                            + lstTp2Filters[0].As_Per_TP_Accomp + "</td>");
                    }
                    else
                    {
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                        tblCont.Append("<td>-</td>");
                    }

                    var missedDoc = 0;
                    var missedCP = 0;

                    //   var docrs = jsonPath(jTp, "$[3].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<Models.TPDoctor> lstTpDoc1Filters = new List<Models.TPDoctor>();
                    lstTpDoc1Filters = lstTpDoc1.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    // var cp = jsonPath(jTp, "$[4].[?(@.User_Code=='" + lstMaster[i].User_Code + "')]");
                    List<Models.TPDoctor> lstTpDoc2Filters = new List<Models.TPDoctor>();
                    lstTpDoc2Filters = lstTPDoc2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) == Convert.ToString(lstMaster[i].User_Code)).ToList();
                    if (lstTpDoc2Filters.Count > 0)
                    {
                        missedCP = lstTpDoc2Filters.Count;
                    }
                    if (lstTpDoc1Filters.Count > 0)
                    {
                        for (var m = 0; m < lstTpDoc1Filters.Count; m++)
                        {
                            if (lstTpDoc1Filters[m].TP_Count > lstTpDoc1Filters[m].Visit_Count)
                            {
                                missedDoc = Convert.ToInt16(missedDoc) + 1;
                            }

                            if (lstTpDoc2Filters.Count > 0)
                            {
                                // var cpDoc = jsonPath(jTp, "$[4].[?(@.User_Code=='" + lstMaster[i].User_Code + "' && @.Doctor_Code=='" + lstTpDoc1Filters[m].Doctor_Code + "')]");
                                List<Models.TPDoctor> lstTpDocFilters = lstTPDoc2.AsEnumerable().Where(x => Convert.ToString(x.User_Code) ==
                                    Convert.ToString(lstMaster[i].User_Code) &&
                                    Convert.ToString(x.Doctor_Code) == Convert.ToString(lstTpDoc1Filters[m].Doctor_Code)).ToList();
                                if (lstTpDocFilters.Count > 0)
                                {
                                    missedCP = Convert.ToInt16(missedCP) - 1;
                                }
                            }
                        }
                    }

                    tblCont.Append("<td>" + missedCP + "</td>");
                    tblCont.Append("<td class='td-a' onclick='fnRedirectToTpVsActualDoctorVisitsReport(\"" + lstMaster[i].User_Code + "\")'>" + missedDoc + "</td>");

                    tblCont.Append("</tr>");
                }
            }
            tblCont.Append("</tbody></table>");
            // return Json(lst, JsonRequestBehavior.AllowGet);
            return tblCont.ToString();
        }
        // ------------------------- End - Tp Vs Actual Deviation Summary Report -------------------------


        public string GetDoctorYearlyVisitAnalysisReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string status = collection["status"].ToString();
            string reportName = collection["title"].ToString();
            string selectionType = collection["selectionType"].ToString();
            string type = "";

            string divisionName = "", mdlNumber = "", dcrDay = "", tpDay = "";
            int deviationCount = 0, deviation = 0, doctorvisitCount = 0, visitCount = 0;
            ds = _objSPData.GetDoctorYearlyVisitAnalysisReport(companyCode, regionCode, startDate, endDate, status, selectionType);

            Regex regExInt = new Regex("^([0-9]*)$");
            DateTime dtStartDate = new DateTime();
            DateTime dtEndDate = new DateTime();
            StringBuilder tableContent = new StringBuilder();

            DateTime dtTemp;
            TimeSpan ts;
            DataRow[] dr;
            DataRow[] subFilter;
            DataRow[] drFilter;
            ArrayList monthlist = new ArrayList();

            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);
            ts = dtEndDate - dtStartDate;

            DateTime dtDCRDate = dtStartDate;
            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());
                }
            }

            if (ds.Tables[2].Rows.Count > 0)
            {
                int colspan = 9 + monthlist.Count;
                // Bind Header 
                //Legends Included              
                tableContent.Append("<div style='margin-left:7px'>");
                tableContent.Append("<lable><span style='font-weight:bold;'>Planned Visits:</span> The visit count which is defined in Category Master.</lable>");
                tableContent.Append("</div>");
                tableContent.Append("<br/>");

                tableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >");
                tableContent.Append("<thead><tr>");
                tableContent.Append("<th colspan='6'>User Details</th>");
                tableContent.Append("</tr></thead>");
                tableContent.Append("<tbody>");
                tableContent.Append("<tr>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>User Name</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["User_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold;'>Employee Number</td>");
                tableContent.Append("<td align='left' widht='15%'>" + ds.Tables[2].Rows[0]["Employee_Number"] + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>Employee Name</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["Employee_Name"].ToString() + "</td>");
                tableContent.Append("</tr>");

                tableContent.Append("<tr>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold;'>Designation</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["User_Type_Name"] + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold;'>Region Name</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["Region_Name"] + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>Division Name</td>");
                if (ds.Tables[3].Rows.Count > 0)
                {
                    var distinctDivisionNames = (from DataRow dRow in ds.Tables[3].Rows select new { Division_Name = dRow["Division_Name"] }).Distinct().ToArray(); ;
                    divisionName = "";
                    if (distinctDivisionNames.Length > 0)
                    {
                        for (var j = 0; j < distinctDivisionNames.Length; j++)
                        {
                            divisionName += distinctDivisionNames[j].Division_Name.ToString() + ',';
                        }

                        if (divisionName != "")
                        {
                            divisionName = divisionName.Substring(0, divisionName.Length - 1);
                        }
                    }
                }
                tableContent.Append("<td align='left' >" + divisionName + "</td>");
                tableContent.Append("</tr>");

                tableContent.Append("<tr>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>Reporting Manager Name</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["Manager_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>Reporting Manager Territory name</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["Manager_Region_Name"].ToString() + "</td>");
                tableContent.Append("<td align='left' width='15%' style='font-weight:bold'>Date of Joining</td>");
                tableContent.Append("<td align='left' width='15%'>" + ds.Tables[2].Rows[0]["DOJ"].ToString() + "</td></tr>");
                tableContent.Append("<tr>");
                if (Convert.ToInt32(dtEndDate.Year) > Convert.ToInt32(dtStartDate.Year))
                {
                    tableContent.Append("<td align='left' style='font-weight:bold'>Year</td><td align='left'  colspan='5'>" + dtStartDate.Year.ToString() + "-" + dtEndDate.Year.ToString() + "</td></tr>");
                }
                else
                {
                    tableContent.Append("<td align='left' style='font-weight:bold'>Year</td><td align='left'  colspan='5'>" + dtStartDate.Year.ToString() + "</td></tr>");
                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>@");


                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='DoctorYearlyVisitAnalysis' >");
                tableContent.Append("<thead>");
                tableContent.Append("<tr style='display: none;' id='tblTr'>");

                if (selectionType.ToUpper() == "T")
                {
                    tableContent.Append("<th align='left' width='15%'>Region Name</th>");
                }

                tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
                tableContent.Append("<th align='left' width='15%'>MDL Number</th>");
                tableContent.Append("<th align='left' width='15%'>Category</th>");
                tableContent.Append("<th align='left' width='15%'>Speciality</th>");
                tableContent.Append("<th align='left' width='15%'>Local Area</th>");
                tableContent.Append("<th align='left' width='15%'>Hospital Name</th>");
                tableContent.Append("<th align='left' width='15%'>Doctor Status</th>");
                tableContent.Append("<th align='left' width='15%'>Planned Visit</th>");
                foreach (string monthName in monthlist)
                {
                    tableContent.Append("<th align='left' width='15%'>" + monthName.Split('_')[0] + " - " + monthName.Split('_')[2] + "</th>");
                }
                tableContent.Append("<th align='left' width='15%'>Total Visit</th>");

                tableContent.Append("</tr><tr>");

                if (selectionType.ToUpper() == "T")
                {
                    tableContent.Append("<th align='left' width='15%'>Region Name</th>");
                }

                tableContent.Append("<th align='left' width='15%'>Doctor Name</th>");
                tableContent.Append("<th align='left' width='15%'>MDL Number</th>");
                tableContent.Append("<th align='left' width='15%'>Category</th>");
                tableContent.Append("<th align='left' width='15%'>Speciality</th>");
                tableContent.Append("<th align='left' width='15%'>Local Area</th>");
                tableContent.Append("<th align='left' width='15%'>Hospital Name</th>");
                tableContent.Append("<th align='left' width='15%'>Doctor Status</th>");
                tableContent.Append("<th align='left' width='15%'>Planned Visit</th>");
                int iRow = 0;

                iRow = 17;
                if (selectionType.ToUpper() == "T")
                {
                    type = "[{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }";
                    type += ",{ type: 'text' },{ type: 'text' }, { type: 'text' }";
                }
                else
                {
                    type = "[{ type: 'text' }, { type: 'text' },{ type: 'text' }";
                    type += ",{ type: 'text' },{ type: 'text' }, { type: 'text' }, { type: 'text' },{ type: 'text' }";
                }

                foreach (string monthName in monthlist)
                {
                    iRow++;
                    type += ",{ type: 'number-range' }";
                    tableContent.Append("<th align='left' width='15%'>" + monthName.Split('_')[0] + " - " + monthName.Split('_')[2] + "</th>");
                }

                tableContent.Append("<th align='left' width='15%'>Total Visit</th>");
                type += ",{ type: 'number-range' },{ type: 'number-range' }]";
                tableContent.Append("</tr>");
                tableContent.Append("<tr >");
                tableContent.Append("<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
                tableContent.Append("</tr> </thead>");

                tableContent.Append("<tbody>");

                if (ds.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow drs in ds.Tables[0].Rows)
                    {
                        doctorvisitCount = 0;
                        deviation = 0;
                        deviationCount = 0;
                        tpDay = "";
                        tableContent.Append("<tr>");
                        if (selectionType.ToUpper() == "T")
                        {
                            tableContent.Append("<td align='left'>" + drs["Region_Name"] + "</td>");
                        }
                        tableContent.Append("<td align='left'><span onclick='fnDoctor360Popup(\"" + drs["Customer_Code"].ToString() + "\")' style='text-decoration:underline;cursor:pointer'>" + drs["Customer_Name"].ToString() + "</span></td>");
                        mdlNumber = drs["MDL_Number"].ToString();
                        if (!string.IsNullOrEmpty(mdlNumber))
                        {
                            if (regExInt.IsMatch(mdlNumber))
                            {
                                mdlNumber = Convert.ToInt32(mdlNumber).ToString();
                            }
                        }
                        tableContent.Append("<td style='text-align: center'>" + mdlNumber + "</td>");
                        tableContent.Append("<td align='left' >" + drs["Category_Name"].ToString() + "</td>");
                        tableContent.Append("<td align='left' >" + drs["Speciality_Name"].ToString() + "</td>");
                        if (!string.IsNullOrEmpty(drs["Local_Area"].ToString()))
                        {
                            tableContent.Append("<td align='left' >" + drs["Local_Area"].ToString() + "</td>");
                        }
                        else
                        {
                            tableContent.Append("<td align='center' >-</td>");
                        }
                        tableContent.Append("<td align='left' >" + drs["Hospital_Name"].ToString() + "</td>");
                        tableContent.Append("<td align='left' >" + drs["Status"].ToString() + "</td>");
                        tableContent.Append("<td style='text-align: center' >" + drs["Visit_Count"].ToString() + "</td>");

                        if (!string.IsNullOrEmpty(drs["Visit_Count"].ToString()))
                        {
                            visitCount = Convert.ToInt32(drs["Visit_Count"].ToString());
                        }
                        else
                        {
                            visitCount = 0;
                        }

                        foreach (string monthName in monthlist)
                        {
                            dcrDay = "";
                            drFilter = ds.Tables[1].Select("Customer_Code='" + drs["Customer_Code"].ToString() + "' AND Month ='" + monthName.Split('_')[1].ToString() + "' AND Year='" + monthName.Split('_')[2].ToString() + "' AND Doctor_Region_Code='" + drs["Doctor_Region_Code"].ToString() + "'");
                            if (drFilter.Length > 0)
                            {
                                doctorvisitCount += Convert.ToInt32(drFilter.Length);
                                foreach (DataRow drRow in drFilter)
                                {
                                    dcrDay += drRow["DCR_Day"].ToString() + ",";
                                }
                            }
                            if (!string.IsNullOrEmpty(dcrDay))
                            {
                                dcrDay = dcrDay.TrimEnd(',');
                            }
                            else
                            {
                                dcrDay = "";
                            }
                            if (drFilter.Length < visitCount)
                            {
                                deviation++;
                                deviationCount += visitCount - drFilter.Length;

                            }
                            tableContent.Append("<td align='left' width='15%'>" + dcrDay + "</td>");

                        }

                        tableContent.Append("<td style='text-align: center'>" + doctorvisitCount + "</td>");
                    }
                }
                //else
                //{
                //    tableContent.Append("<tr><td colspan='"+colspan+"'>No Doctor Visit Details.</td></tr>");
                //}
                tableContent.Append("</tbody>");
                tableContent.Append("</table>@" + type + "");


            }
            return tableContent.ToString();
        }

        public JsonResult Getsamplestockstatement(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();


                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdGetSampleStockStatement " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");
                //DataRow[] drInward, drIssued;

                //if (dsReport.Tables.Count > 0 && dsReport.Tables[3].Rows.Count > 0)
                //{
                //    foreach (DataRow drr in dsReport.Tables[3].Rows)
                //    {
                //        drIssued = dsReport.Tables[5].Select("User_Code='" + drr["User_Code"].ToString() + "' AND Product_Code='" + drr["Product_Code"].ToString() + "'");
                //        drInward = dsReport.Tables[6].Select("User_Code='" + drr["User_Code"].ToString() + "' AND Product_Code='" + drr["Product_Code"].ToString() + "'");

                //        drr["Closing"] = (Convert.ToInt32(drr["Opening"]) + ((drInward.Length > 0) ? Convert.ToInt32(drInward[0]["Qty"]) : 0)) - ((drIssued.Length > 0) ? Convert.ToInt32(drIssued[0]["Qty"]) : 0);

                //    }
                //}
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetProduct(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();


                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_HDGetStockProduct " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetSecondarySalesComplaince(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string year = collection["year"].ToString();

            string regionCodes = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            if (!string.IsNullOrEmpty(year))
            {
                year = year.TrimEnd(',');
            }
            else
            {
                year = "''";
            }
            ds = _objSPData.GetSecondarySalesCompliance(companyCode, "''", regionCodes, year);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSecondarySalesReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"].ToString();
            string year = collection["year"].ToString();
            string month = collection["month"].ToString();
            string productCode = collection["product"].ToString();

            string regionCodes = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }
            ds = _objSPData.GetSecondarySalesReport(companyCode, "''", regionCodes, year, month, productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            List<JsonResult> lstJSON = new List<JsonResult> { Json(json.Serialize(ds), JsonRequestBehavior.AllowGet) };
            return new LargeJsonResult() { Data = lstJSON, MaxJsonLength = int.MaxValue };


            //return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInputanalysis(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();


                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdGetSampleStockStatement " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetFieldWorkanalysis(FormCollection collection)
        {
            try
            {
                string RegionCode = string.Empty;
                RegionCode = collection["regionCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();
                string regionCodes = "", activeRegionCodes = "";

                DataSet dsChildRegion = _objSPData.dsChildRegion(_objcurrentInfo.GetCompanyCode(), RegionCode);
                if (dsChildRegion.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                    {
                        regionCodes += "''" + dr["Region_Code"].ToString() + "'',";
                        activeRegionCodes += "'" + dr["Region_Code"].ToString() + "',";
                    }

                }

                if (!string.IsNullOrEmpty(regionCodes))
                {
                    regionCodes = regionCodes.TrimEnd(',');
                }
                else
                {
                    regionCodes = "''";
                }

                if (!String.IsNullOrEmpty(activeRegionCodes))
                {
                    activeRegionCodes = activeRegionCodes.TrimEnd(',');
                }
                else
                {
                    activeRegionCodes = "''";
                }
                DataSet dsReport = new DataSet();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdFieldWorkAnalysis " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + regionCodes + "','" + startDate + "','" + endDate + "'");

                objActivity.SetActivityCount("", activeRegionCodes, startDate, endDate, "'2'");
                DataTable dt = new DataTable();
                dt.Columns.Add("Region_Code");
                dt.Columns.Add("User_Code");
                dt.Columns.Add("Field");
                if (dsReport.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow drs in dsReport.Tables[1].Rows)
                    {
                        DataRow dataRow = dt.NewRow();
                        dataRow["Region_Code"] = drs["Region_Code"].ToString();
                        dataRow["User_Code"] = drs["User_Code"].ToString();
                        double fieldCount = objActivity.GetFlagCount(drs["User_Code"].ToString(), 'F');

                        dataRow["Field"] = fieldCount.ToString();
                        dt.Rows.Add(dataRow);
                    }
                }
                dsReport.Tables.Add(dt);
                dsReport.AcceptChanges();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                DataControl.BL_Report objBLReport = new BL_Report();

                string reportHTML = objBLReport.GetFieldWorkAnalysisReportHTML(dsReport, startDate, endDate);

                return reportHTML;

                //return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetIndependentDoctor(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();


                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_hdGetDoctorIndependentDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetStockistInformation(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();


                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_HdGetStockistInformation " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetSecondarySalesTrendAnalysis(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"];
            string month = collection["month"].ToString();
            string productCode = collection["ProductCode"].ToString();
            int currentMonth = System.DateTime.Now.Month;
            string startDate = "";
            if (currentMonth <= 3)
            {
                startDate = (DateTime.Now.Year) - 1 + "-04-01";
            }
            else
            {
                startDate = DateTime.Now.Year + "-04-01";
            }

            DateTime dtStartDate = Convert.ToDateTime(startDate);
            DateTime dtEndDate = dtStartDate.AddMonths(Convert.ToInt32(month));
            DataSet ds = new DataSet();
            string regionCodes = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 1)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    if (dr["Region_Code"].ToString() != regionCode)
                    {
                        regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                    }
                }
            }
            else
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {

                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";

                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            ds = _objSPData.GetSecondarySalesTrendAnalysis(companyCode, "''", regionCodes, dtStartDate.Month.ToString(), dtEndDate.Month.ToString(), productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetStockistWiseUnderOverStock(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"];
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string productCode = collection["ProductCode"].ToString();

            DataSet ds = new DataSet();
            string regionCodes = "";
            DataSet dsChildRegion = _objSPData.dsChildRegion(companyCode, regionCode);
            if (dsChildRegion.Tables[0].Rows.Count > 1)
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {
                    if (dr["Region_Code"].ToString() != regionCode)
                    {
                        regionCodes += "'" + dr["Region_Code"].ToString() + "',";
                    }
                }
            }
            else
            {
                foreach (DataRow dr in dsChildRegion.Tables[0].Rows)
                {

                    regionCodes += "'" + dr["Region_Code"].ToString() + "',";

                }
            }

            if (!string.IsNullOrEmpty(regionCodes))
            {
                regionCodes = regionCodes.TrimEnd(',');
            }
            else
            {
                regionCodes = "''";
            }

            ds = _objSPData.GetStockistWiseUnderOverStock(companyCode, "''", regionCodes, startDate, endDate, productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStockistWiseUnderOverStockDetails(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"];
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string productCode = collection["ProductCode"].ToString();
            DataSet ds = new DataSet();

            ds = _objSPData.GetStockistWiseUnderOverStock(companyCode, "''", "'" + regionCode + "'", startDate, endDate, productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMarketingCampaign(FormCollection collection)
        {
            try
            {
                string UserCode = string.Empty;
                UserCode = collection["UserCode"];
                string temp = "";

                string customerSpeciality = "";
                string customerCategoryName = "";
                DataRow[] rowFilter;
                DataTable dt = new DataTable();
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();
                DataSet dsSpeciality = new DataSet();
                DataSet dsCategory = new DataSet();
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                dsCategory = _objSPData.dsGetDoctorCategories(Session["Comp_Code"].ToString());
                dsSpeciality = _objSPData.dsGetSpecialities(Session["Comp_Code"].ToString());

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_HdGetMCHeader " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + UserCode + "','" + startDate + "','" + endDate + "'");

                for (var i = 0; i < dsReport.Tables[1].Rows.Count; i++)
                {
                    customerSpeciality = "";
                    customerCategoryName = "";

                    foreach (string code in dsReport.Tables[1].Rows[i]["Customer_Category_Code"].ToString().Trim().Split(','))
                    {
                        rowFilter = dsCategory.Tables[0].Select("Category_Code = '" + code + "'");
                        if (rowFilter.Length > 0)
                        {
                            customerCategoryName += rowFilter[0]["Category_Name"].ToString().Trim() + ",";
                        }
                    }
                    if (!string.IsNullOrEmpty(customerCategoryName))
                    {
                        customerCategoryName = customerCategoryName.ToString().TrimEnd(',');
                    }

                    foreach (string code in dsReport.Tables[1].Rows[i]["Customer_Speciality_Code"].ToString().Trim().Split(','))
                    {
                        rowFilter = dsSpeciality.Tables[0].Select("Speciality_Code = '" + code + "'");
                        if (rowFilter.Length > 0)
                        {
                            customerSpeciality += rowFilter[0]["Speciality_Name"].ToString().Trim() + ",";
                        }
                    }
                    if (!string.IsNullOrEmpty(customerSpeciality))
                    {
                        customerSpeciality = customerSpeciality.TrimEnd(',');
                    }

                    dsReport.Tables[1].Rows[i]["Customer_Category_Code"] = customerCategoryName;
                    dsReport.Tables[1].Rows[i]["Customer_Speciality_Code"] = customerSpeciality;
                }
                //for (var l = 0; l < dsReport.Tables[3].Rows.Count; l++)
                //{
                //    if (dsReport.Tables[3].Rows.Count > 0)
                //    {

                //        dt.Columns.Add("Category_Name");
                //        dt.Columns.Add("Speciality_Name");

                //        if (dsReport.Tables[3].Rows.Count > 0)
                //        {
                //            foreach (DataRow drs in dsReport.Tables[3].Rows)
                //            {
                //                DataRow dataRow = dt.NewRow();

                //                dataRow["Category_Name"] = customerCategoryName.ToString();
                //                dataRow["Speciality_Name"] = customerSpeciality.ToString();
                //                dt.Rows.Add(dataRow);
                //            }
                //        }
                //    }
                //}
                //dsReport.Tables.Add(dt);
                //dsReport.AcceptChanges();


                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetCampaign(FormCollection collection)
        {
            try
            {
                string campaignCode = string.Empty;
                campaignCode = collection["campaignCode"];

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetBrandDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + campaignCode + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetCampaignInfo(FormCollection collection)
        {
            try
            {
                string campaignCode = string.Empty;
                campaignCode = collection["campaignCode"];
                string userTypeCode = string.Empty;
                userTypeCode = collection["userTypeCode"];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC Sp_HdGetCampaignInfoDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + campaignCode + "','" + userTypeCode + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetCampaignDetail(FormCollection collection)
        {
            try
            {
                string campaignCode = string.Empty;
                campaignCode = collection["campaignCode"];

                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetMarketingCampaignDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + campaignCode + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetSecondarySalesCustomer(FormCollection collection)
        {
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE];
            string endDate = collection[COLL_END_DATE];
            string productCode = collection[Coll_PRODUCT_CODE];
            string divisionName = "";
            DataSet ds = new DataSet();
            int dblQty = 0, dblSRQty = 0, dblCBQty = 0;
            double dblAmount = 0.0, dblCBAmount = 0.0;
            DataRow[] dr;
            ds = _objSPData.GetSecondarySalesCustomer(_objcurrentInfo.GetCompanyCode(), regionCode, startDate, endDate, productCode);

            StringBuilder sbTableContent = new StringBuilder();

            sbTableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSecondarySalesCustomer' >");
            sbTableContent.Append("<thead>");
            sbTableContent.Append("<tr>");
            sbTableContent.Append("<th align='left' width='15%' >User Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Employee Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Region Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Division</th>");
            sbTableContent.Append("<th align='left' width='15%'>Manager Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Manager Region</th>");
            sbTableContent.Append("<th align='left' width='15%'>SS Month</th>");
            sbTableContent.Append("<th align='left' width='15%'>SS Year</th>");
            sbTableContent.Append("<th align='left' width='15%'>Stockiest Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Customer Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Product Name</th>");
            sbTableContent.Append("<th align='left' width='15%'>Sales Qty</th>");
            sbTableContent.Append("<th align='left' width='15%'>Unit rate</th>");
            sbTableContent.Append("<th align='left' width='15%'>Sales Value</th>");
            sbTableContent.Append("<th align='left' width='15%'>Sales Return Qty</th>");
            sbTableContent.Append("<th align='left' width='15%'>Closing Balance Qty</th>");
            sbTableContent.Append("<th align='left' width='15%'>Closing Balance Rs.</th>");
            sbTableContent.Append("</tr>");
            sbTableContent.Append("</thead>");
            sbTableContent.Append("<tbody>");

            foreach (DataRow drs in ds.Tables[2].Rows)
            {
                divisionName = "";
                dr = ds.Tables[1].Select("Region_Code ='" + drs["Region_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    foreach (DataRow drSub in dr)
                    {
                        divisionName += drSub["Division_Name"].ToString() + ",";
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }
                }
                dr = ds.Tables[0].Select("Region_Code ='" + drs["Region_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(dr[0]["User_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(dr[0]["Employee_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(dr[0]["Region_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(divisionName);
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(dr[0]["Manager_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(dr[0]["Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");

                    sbTableContent.Append(drs["MonthName"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Year"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Stockiest_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Customer_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Product_Name"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Sales"].ToString());
                    dblQty += Convert.ToInt32(drs["Sales"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Price_Per_Unit"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Amount"].ToString());
                    dblAmount += Convert.ToDouble(drs["Amount"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Sales_Return"].ToString());
                    dblSRQty += Convert.ToInt32(drs["Sales_Return"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Closing_Stock"].ToString());
                    dblCBQty += Convert.ToInt32(drs["Closing_Stock"].ToString());
                    sbTableContent.Append("</td><td align='left' width='15%'>");
                    sbTableContent.Append(drs["Closing_Amount"].ToString());
                    dblCBAmount += Convert.ToDouble(drs["Closing_Amount"].ToString());
                    sbTableContent.Append("</td></tr>");
                }
            }
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("<tfoot><tr>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:right;width: 15%'>Grand Total</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>" + dblQty + "</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'></th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>" + dblAmount.ToString("N2") + "</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>" + dblSRQty + "</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>" + dblCBQty + "</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>" + dblCBAmount + "</th>");
            sbTableContent.Append("</tr></tfoot>");
            sbTableContent.Append("</table>");
            return sbTableContent.ToString();
        }

        public JsonResult GetUserPrivileges(string regionCode)
        {
            try
            {
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                string companyCode = objCurr.GetCompanyCode();
                DataSet ds = new DataSet();
                DataSet dsUserDetails = new DataSet();
                dsUserDetails = _objSPData.GetRegionWiseUser(companyCode, regionCode);
                string userCode = "", userTypeCode = "";
                if (dsUserDetails.Tables[0].Rows.Count > 0)
                {
                    userCode = dsUserDetails.Tables[0].Rows[0]["User_Code"].ToString();
                    userTypeCode = dsUserDetails.Tables[0].Rows[0]["User_Type_Code"].ToString();
                }

                ds = _objSPData.GetUserPrivileges(companyCode, userCode, userTypeCode);
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetComprehensiveAnalysisReport(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = collection["userCode"];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string reportType = collection["reportType"].ToString();
            StringBuilder sbTableContent = new StringBuilder();
            StringBuilder sbMonthHeader = new StringBuilder();
            string currentUserCode = _objcurrentInfo.GetUserCode();
            DateTime dtTemp;
            DataSet ds = new DataSet();
            string month = endDate.Split('/')[1].ToString();
            string year = endDate.Split('/')[2].ToString();

            if (!string.IsNullOrEmpty(startDate))
            {
                startDate = startDate.Split('/')[2].ToString() + "-" + startDate.Split('/')[1].ToString() + "-" + startDate.Split('/')[0].ToString();
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                endDate = endDate.Split('/')[2].ToString() + "-" + endDate.Split('/')[1].ToString() + "-" + endDate.Split('/')[0].ToString();
            }

            ds = _objSPData.GetComprehensiveAnalysisReport(companyCode, userCode, startDate, endDate, reportType, month, year);

            ArrayList monthlist = new ArrayList();

            DateTime dtEndDate = new DateTime();
            DateTime dtStartDate = new DateTime();
            dtEndDate = Convert.ToDateTime(endDate);
            dtStartDate = Convert.ToDateTime(startDate);

            for (dtTemp = dtStartDate; dtTemp <= dtEndDate; dtTemp = dtTemp.AddDays(Convert.ToDouble(1)))
            {
                if (!monthlist.Contains(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString()))
                {
                    monthlist.Add(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dtTemp.Month) + "_" + dtTemp.Month.ToString() + "_" + dtTemp.Year.ToString());
                }
            }

            DataTable dtUserDetails = ds.Tables[0];
            // DataTable dtDivisitionDetails = ds.Tables[1];

            sbMonthHeader.Append("<tr ><th>Parameters</th>");
            foreach (string monthName in monthlist)
            {
                sbMonthHeader.Append("<th>" + monthName.Split('_')[0] + '_' + monthName.Split('_')[2] + "</th>");
            }
            sbMonthHeader.Append("</tr>");

            sbTableContent.Append("<div class='CA_Div_Company'>");
            sbTableContent.Append("<div class='CA_Div_Left'>Comprehensive Analysis Report for the period " + dtStartDate.ToString("dd/MM/yyyy") + " - " + dtEndDate.ToString("dd/MM/yyyy") + "(Considered Applied & Approved DCRs only)</div>");
            sbTableContent.Append("<div class='CA_Div_Right'><div style='float:left;width:100%'><div style='width: 30%;'><img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'></div></div></div>");
            sbTableContent.Append("</div>");


            foreach (DataRow dr in dtUserDetails.Rows)
            {
                sbTableContent.Append("<div class='CA_Div'>");
                sbTableContent.Append("<table width='100%' style='margin-top: 5px;'  cellspacing='0' cellpadding='0' border='0' id='tblComprehensiveReport' class='CA_Header_Tbl'>");
                sbTableContent.Append("<tr >");
                sbTableContent.Append("<th align='left'>Division Name:" + dr["Division_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("<th align='left'>Region Name   : " + dr["Region_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("</tr>");
                sbTableContent.Append("<tr >");
                sbTableContent.Append("<th align='left'>Employee Name : " + dr["Employee_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("<th align='left'>Designation   : " + dr["User_Type_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("</tr>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th align='left'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("<th align='left'>Period        : " + dtStartDate.ToString("dd/MM/yyyy") + " to " + dtEndDate.ToString("dd/MM/yyyy") + "</th>");
                //if (!string.IsNullOrEmpty(startDate))
                //{

                //    sbTableContent.Append("<th align='left'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");
                //}
                //else
                //{
                //    sbTableContent.Append("<th align='left' colspan='2'>User Name     : " + dr["User_Name"].ToString().Trim() + "</th>");

                //}
                sbTableContent.Append("</tr>");

                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th align='left'>Date of Joining     : " + dr["DOJ"].ToString().Trim() + "</th>");
                sbTableContent.Append("<th align='left'>Manager Name: " + dr["Reporting_Manager_Name"].ToString().Trim() + "</th>");
                sbTableContent.Append("</tr>");

                sbTableContent.Append("</table>");

                // detail table
                sbTableContent.Append("<table width='99%' style='margin-top: 5px;margin-bottom: 5px;' class='CA_Detail_Tbl' cellspacing='1' cellpadding='1' border='1'>");
                // sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' style='text-align:center;'>" + dr["User_Name"].ToString().Trim() + "</th></tr>");
                sbTableContent.Append(sbMonthHeader);

                DataRow[] drDays;
                int[] holidays = new int[monthlist.Count];
                int[] sundays = new int[monthlist.Count];
                double[] fieldDays = new double[monthlist.Count];
                int holidayCount = 0;

                // calculate Total Working Days
                int sun = 0;
                int hol = 0;
                foreach (string monthName in monthlist)
                {
                    // Sundays
                    drDays = ds.Tables[1].Select("User_Code='" + dr["User_Code"].ToString() + "' AND DCR_Month='" + monthName.Split('_')[1] + "' AND DCR_Year='" + monthName.Split('_')[2] + "' ");
                    if (drDays.Length > 0)
                    {
                        sundays[sun++] = Convert.ToInt32(drDays[0]["Sunday_Count"]);//Sundays                        
                    }
                    else
                    {
                        drDays = ds.Tables[1].Select("User_Code IS NULL AND DCR_Month='" + monthName.Split('_')[1] + "' AND DCR_Year='" + monthName.Split('_')[2] + "' ");
                        if (drDays != null && drDays.Length > 0)
                        {
                            sundays[sun++] = Convert.ToInt32(drDays[0]["Sunday_Count"]);//Sundays
                        }
                        else
                        {
                            sundays[sun++] = 0;
                        }
                    }


                    // Holiday Count

                    DateTime dt1 = new DateTime(Convert.ToInt32(monthName.Split('_')[2]), Convert.ToInt32(monthName.Split('_')[1]), 1);
                    DateTime dt2 = dt1.AddMonths(1);
                    DateTime dt3 = dt2.AddDays(-1);

                    if (dt1.Month == dtStartDate.Month && dt1.Year == dtStartDate.Year)
                    {
                        dt1 = dtStartDate;
                    }
                    if (dt3.Month == dtEndDate.Month && dt3.Year == dtEndDate.Year)
                    {
                        dt2 = dtEndDate;
                    }
                    else
                    {
                        dt2 = dt3;
                    }
                    holidayCount = Convert.ToInt16(GetHolidayCount(dr["User_Code"].ToString(), dr["Region_Code"].ToString(), dt1.ToString("yyyy-MM-dd"), dt2.ToString("yyyy-MM-dd"), "'1','2'", "COUNT"));
                    holidays[hol++] = holidayCount;
                }


                // Total Working Days      
                sbTableContent.Append("<tr ><td align='left'>Total Working Days</td>");
                sun = 0;
                hol = 0;
                foreach (string monthName in monthlist)
                {
                    DateTime dt1 = new DateTime(Convert.ToInt32(monthName.Split('_')[2]), Convert.ToInt32(monthName.Split('_')[1]), 1);
                    DateTime dt2 = dt1.AddMonths(1);
                    DateTime dt3 = dt2.AddDays(-1);

                    if (dt1.Month == dtStartDate.Month && dt1.Year == dtStartDate.Year)
                    {
                        dt1 = dtStartDate;
                    }
                    if (dt3.Month == dtEndDate.Month && dt3.Year == dtEndDate.Year)
                    {
                        dt2 = dtEndDate.AddDays(1);
                    }

                    TimeSpan timeDiff = dt2 - dt1;

                    sbTableContent.Append("<td align='center'>" + (timeDiff.Days - (sundays[sun++] + holidays[hol++])).ToString() + "</td>");//workingDays
                }
                sbTableContent.Append("</tr >");

                // Sundays
                sbTableContent.Append("<tr ><td align='left'>Sundays</td>");
                for (int s = 0; s < monthlist.Count; s++)
                {
                    sbTableContent.Append("<td align='center'>" + sundays[s].ToString() + "</td>");//Sundays                    
                }
                sbTableContent.Append("</tr>");

                // Holidays
                sbTableContent.Append("<tr ><td align='left'>Holidays</td>");
                for (int h = 0; h < monthlist.Count; h++)
                {
                    sbTableContent.Append("<td align='center'>" + holidays[h].ToString() + "</td>");//Holidays                    
                }
                sbTableContent.Append("</tr>");

                // Leave Days
                sbTableContent.Append("<tr ><td align='left'>Leave Days</td>");
                foreach (string monthName in monthlist)
                {
                    drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='L' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                    if (drDays.Length > 0)
                    {
                        sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Leave Days
                    }
                    else
                    {
                        sbTableContent.Append("<td align='center'>0</td>");//Leave Days
                    }
                }
                sbTableContent.Append("</tr>");

                // Attendance Days
                sbTableContent.Append("<tr ><td align='left'>Attendance Days</td>");
                foreach (string monthName in monthlist)
                {
                    drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='A' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                    if (drDays.Length > 0)
                    {
                        sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Attendance Days
                    }
                    else
                    {
                        sbTableContent.Append("<td align='center'>0</td>");//Attendance Days
                    }
                }
                sbTableContent.Append("</tr>");

                // Field Days
                sbTableContent.Append("<tr ><td align='left'>Field Days</td>");
                int f = 0;
                foreach (string monthName in monthlist)
                {
                    drDays = ds.Tables[2].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Flag='F' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                    if (drDays.Length > 0)
                    {
                        sbTableContent.Append("<td align='center'>" + drDays[0]["Count"].ToString() + "</td>");//Field Days
                        fieldDays[f++] = Convert.ToDouble(drDays[0]["Count"]);
                    }
                    else
                    {
                        sbTableContent.Append("<td align='center'>0</td>");//Field Days
                        fieldDays[f++] = 0;
                    }
                }
                sbTableContent.Append("</tr>");


                //****************************  Doctor Details  ***********************************
                sbTableContent.Append("<tr><th align='center'>Doctor Details</th>");
                for (int i = 0; i < monthlist.Count; i++)
                {
                    sbTableContent.Append("<th>Num</th>");
                }
                sbTableContent.Append("</tr>");
                //sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "'>Doctor Details</th></tr>");
                DataRow[] drDoctor;

                int[] totalDrCalls = new int[monthlist.Count];

                // Doctors VISITS

                if (reportType != "MET")
                {
                    int[] moringCount = new int[monthlist.Count];
                    int[] eveningCount = new int[monthlist.Count];
                    // Doctors Met in the Morning
                    int mrg = 0;
                    sbTableContent.Append("<tr ><td align='left'>Doctor Calls in the Morning</td>");
                    foreach (string monthName in monthlist)
                    {
                        drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Visit_Mode='AM' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDoctor.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Met in the Morning
                            moringCount[mrg++] = Convert.ToInt32(drDoctor[0]["Count"]);
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Doctors Met in the Morning
                            moringCount[mrg++] = 0;
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // Doctors Met in the Evening
                    int eve = 0;
                    sbTableContent.Append("<tr ><td align='left'>Doctor Calls in the Evening</td>");
                    foreach (string monthName in monthlist)
                    {
                        drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Visit_Mode='PM' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDoctor.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Met in the Evening
                            eveningCount[eve++] = Convert.ToInt32(drDoctor[0]["Count"]);
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Doctors Met in the Evening
                            eveningCount[eve++] = 0;
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // Doctors Calls Made
                    sbTableContent.Append("<tr ><td align='left'>Doctors Calls Made</td>");
                    for (int t = 0; t < monthlist.Count; t++)
                    {
                        totalDrCalls[t] = moringCount[t] + eveningCount[t];
                        sbTableContent.Append("<td align='center'>" + totalDrCalls[t] + "</td>");//Doctors Calls Made
                    }
                    sbTableContent.Append("</tr>");
                }
                // Doctors MET
                else
                {
                    int tot = 0;
                    sbTableContent.Append("<tr ><td align='left'>Doctors Met</td>");
                    foreach (string monthName in monthlist)
                    {
                        drDoctor = ds.Tables[3].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drDoctor.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drDoctor[0]["Count"].ToString() + "</td>");//Doctors Calls Made
                            totalDrCalls[tot++] = Convert.ToInt32(drDoctor[0]["Count"]);
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Doctors Calls Made
                            totalDrCalls[tot++] = 0;
                        }
                    }
                    sbTableContent.Append("</tr>");
                }

                // Doctors Call Avg
                if (reportType != "MET")
                {
                    sbTableContent.Append("<tr ><td align='left'>Doctor Calls Avg</td>");
                }
                else
                {
                    sbTableContent.Append("<tr ><td align='left'>Doctors Met Avg</td>");
                }
                for (int avg = 0; avg < monthlist.Count; avg++)
                {
                    if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                    {
                        sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(totalDrCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Doctors Call Avg
                    }
                    else
                    {
                        sbTableContent.Append("<td align='center'>0.0</td>");//Doctors Call Avg
                    }
                }
                sbTableContent.Append("</tr>");

                //****************************  Doctor Details  ***********************************


                //****************************  Specialty Details  *******************************               
                DataRow[] drSpec;
                drSpec = ds.Tables[4].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                if (drSpec.Length > 0)
                {
                    sbTableContent.Append("<tr><th align='center'>Specialty Details</th>");
                    if (reportType == "VISIT")
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctor Visits made</th></tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctors Met </th></tr>");
                    }

                    ArrayList alSpeciality = new ArrayList();
                    foreach (DataRow drSpecUniq in drSpec)
                    {
                        if (!alSpeciality.Contains(drSpecUniq["Speciality_Name"].ToString().ToUpper()))
                        {
                            alSpeciality.Add(drSpecUniq["Speciality_Name"].ToString().ToUpper());
                        }
                    }

                    for (int i = 0; i < alSpeciality.Count; i++)
                    {
                        // Speciality Details
                        sbTableContent.Append("<tr ><td align='left'>" + alSpeciality[i].ToString() + "</td>");
                        foreach (string monthName in monthlist)
                        {
                            drSpec = ds.Tables[4].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Speciality_Name='" + alSpeciality[i].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drSpec.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drSpec[0]["Count"].ToString() + "</td>");//Speciality Details
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Speciality Details
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }
                }
                else
                {
                    sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Specialty Details Found</th></tr>");
                }

                //****************************  Speciality Details  *******************************

                //****************************  Category Details  *********************************              
                DataRow[] drCat;
                drCat = ds.Tables[5].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                if (drCat.Length > 0)
                {
                    sbTableContent.Append("<tr><th align='center'>Category Details</th>");
                    if (reportType == "VISIT")
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctor Visits made</th></tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Doctors Met </th></tr>");
                    }
                    ArrayList alCategory = new ArrayList();
                    foreach (DataRow drCatUniq in drCat)
                    {
                        if (!alCategory.Contains(drCatUniq["Category_Name"].ToString()))
                        {
                            alCategory.Add(drCatUniq["Category_Name"].ToString());
                        }
                    }

                    for (int i = 0; i < alCategory.Count; i++)
                    {
                        // Category Details
                        sbTableContent.Append("<tr ><td align='left'>" + alCategory[i].ToString() + "</td>");
                        foreach (string monthName in monthlist)
                        {
                            drCat = ds.Tables[5].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Category_Name='" + alCategory[i].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drCat.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drCat[0]["Count"].ToString() + "</td>");//Category Details
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Category Details
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }
                }
                else
                {
                    sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Category Details Found</th></tr>");
                }

                //****************************  Category Details  *********************************


                //****************************  Chemist Details  **********************************

                sbTableContent.Append("<tr><th align='center'>Chemist Details</th>");
                if (reportType == "VISIT")
                {
                    sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Chemist Visits made</th></tr>");
                    DataRow[] drChemist;
                    int[] chemistCalls = new int[monthlist.Count];
                    double[] chemistPOB = new double[monthlist.Count];

                    // Chemist Calls Made
                    int chem = 0;
                    int pob = 0;
                    sbTableContent.Append("<tr ><td align='left'>Chemist Calls Made</td>");
                    foreach (string monthName in monthlist)
                    {
                        drChemist = ds.Tables[6].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drChemist.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drChemist[0]["Count"].ToString() + "</td>");//Chemist Calls Made
                            chemistCalls[chem++] = Convert.ToInt32(drChemist[0]["Count"]);
                            chemistPOB[pob++] = Convert.ToDouble(drChemist[0]["Sum"]);
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Chemist Calls Made
                            chemistCalls[chem++] = 0;
                            chemistPOB[pob++] = 0.0;
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // Chemist Calls Avg
                    sbTableContent.Append("<tr ><td align='left'>Chemist Calls Avg</td>");
                    for (int avg = 0; avg < monthlist.Count; avg++)
                    {
                        if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                        {
                            sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(chemistCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Chemist Call Avg
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0.0</td>");//Chemist Call Avg
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // POB Amount
                    sbTableContent.Append("<tr ><td align='left'>POB Amount</td>");
                    for (int p = 0; p < monthlist.Count; p++)
                    {
                        sbTableContent.Append("<td align='center'>" + chemistPOB[p].ToString("N2") + "</td>");//POB Amount
                    }
                    sbTableContent.Append("</tr>");
                }
                else
                {
                    sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Chemist Met </th></tr>");
                    DataRow[] drChemist;
                    DataRow[] drFlexicountforMet;
                    int[] chemistCalls = new int[monthlist.Count];
                    double[] chemistPOB = new double[monthlist.Count];
                    //double flexiChemExpsum = 0.00;

                    // Chemist Calls Made
                    int chem = 0;
                    int pob = 0;
                    sbTableContent.Append("<tr ><td align='left'>Chemist Calls Made</td>");
                    foreach (string monthName in monthlist)
                    {
                        drChemist = ds.Tables[6].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        drFlexicountforMet = ds.Tables[9].Select("User_Code='" + dr["User_Code"].ToString() + "'  AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        //int flexichemistcountformet = 0;
                        double flexiChemExpsum = 0.00;
                        int flexichemistcount = 0;

                        //Get unique chemist couunt for met
                        if (drChemist.Length > 0)
                        {
                            flexichemistcount += Convert.ToInt32(drChemist[0]["Count"]);
                            //flexichemistcountformet += Convert.ToInt32(drChemist[0]["Count"]);
                            flexiChemExpsum += Convert.ToDouble(drChemist[0]["Sum"]);
                        }
                        else
                        {
                            flexichemistcount += 0;
                            //flexichemistcountformet += 0;
                            flexiChemExpsum += 0.0;
                        }

                        //Get unique flexi chemist couunt for met
                        if (drFlexicountforMet.Length > 0)
                        {
                            flexichemistcount += drFlexicountforMet.Length;

                            for (int s = 0; s < drFlexicountforMet.Length; s++)
                            {
                                flexiChemExpsum += Convert.ToDouble(drFlexicountforMet[s]["Sum"]);
                            }
                        }
                        else
                        {
                            //flexichemistcountformet += 0;
                            flexichemistcount += 0;
                            flexiChemExpsum += 0.0;
                        }

                        chemistCalls[chem++] = flexichemistcount;
                        chemistPOB[pob++] = flexiChemExpsum;
                        sbTableContent.Append("<td align='center'>" + flexichemistcount + "</td>");//Chemist Calls Made
                    }

                    sbTableContent.Append("</tr>");

                    // Chemist Calls Avg
                    sbTableContent.Append("<tr ><td align='left'>Chemist Calls Avg</td>");
                    for (int avg = 0; avg < monthlist.Count; avg++)
                    {
                        if (Convert.ToDouble(fieldDays[avg]) != 0.0)
                        {
                            sbTableContent.Append("<td align='center'>" + (Convert.ToDouble(chemistCalls[avg]) / Convert.ToDouble(fieldDays[avg])).ToString("N2") + "</td>");//Chemist Call Avg
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0.0</td>");//Chemist Call Avg
                        }
                    }
                    sbTableContent.Append("</tr>");

                    // POB Amount
                    sbTableContent.Append("<tr ><td align='left'>POB Amount</td>");
                    for (int p = 0; p < monthlist.Count; p++)
                    {
                        sbTableContent.Append("<td align='center'>" + chemistPOB[p].ToString("N2") + "</td>");//POB Amount
                    }
                    sbTableContent.Append("</tr>");
                }


                //****************************  Chemist Details  **********************************

                //****************************  Accompanist Details  ******************************
                DataRow[] drAccomp;
                drAccomp = ds.Tables[7].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                if (drAccomp.Length > 0)
                {
                    sbTableContent.Append("<tr><th align='center'>Accompanist Details</th>");
                    if (reportType == "VISIT")
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Visit made</th></tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Doctors Met </th></tr>");
                    }
                    ArrayList alAccompanist = new ArrayList();
                    foreach (DataRow drAccompUniq in drAccomp)
                    {
                        if (!alAccompanist.Contains(drAccompUniq["Accompanist"].ToString() + "|" + drAccompUniq["User_Type_Name"].ToString() + "|" + drAccompUniq["Region_Name"].ToString() + "|" + drAccompUniq["Employee_Name"].ToString() + "|" + drAccompUniq["Date_of_Joining"].ToString()))
                        {
                            alAccompanist.Add(drAccompUniq["Accompanist"].ToString() + "|" + drAccompUniq["User_Type_Name"].ToString() + "|" + drAccompUniq["Region_Name"].ToString() + "|" + drAccompUniq["Employee_Name"].ToString() + "|" + drAccompUniq["Date_of_Joining"].ToString());
                        }
                    }

                    for (int i = 0; i < alAccompanist.Count; i++)
                    {
                        // Accompanist Details
                        sbTableContent.Append("<tr ><td align='left'>" + alAccompanist[i].ToString().Split('|')[0] + " ," + alAccompanist[i].ToString().Split('|')[1] + "(" + alAccompanist[i].ToString().Split('|')[2] + "), Employee Name :" + alAccompanist[i].ToString().Split('|')[3] + " ,  D.O.J :" + alAccompanist[i].ToString().Split('|')[4] + " </td>");
                        foreach (string monthName in monthlist)
                        {
                            drAccomp = ds.Tables[7].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Accompanist='" + alAccompanist[i].ToString().Split('|')[0] + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drAccomp.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }

                    // INDEPENDENT ACCOMPANIST
                    sbTableContent.Append("<tr ><td align='left'>Independent Visits</td>");
                    foreach (string monthName in monthlist)
                    {
                        drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                        if (drAccomp.Length > 0)
                        {
                            sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                        }
                        else
                        {
                            sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                        }
                    }
                    sbTableContent.Append("</tr>");

                }
                else
                {
                    drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "'");
                    if (drAccomp.Length > 0)
                    {
                        sbTableContent.Append("<tr><th align='center'>Accompanist Details</th></tr>");
                        if (reportType == "VISIT")
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Visit made</th></tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<th colspan='" + (monthlist.Count) + "' align='center'>Num of Days Doctors Met </th></tr>");
                        }
                        // INDEPENDENT ACCOMPANIST
                        sbTableContent.Append("<tr ><td align='left'>Independent Visits</td>");
                        foreach (string monthName in monthlist)
                        {
                            drAccomp = ds.Tables[8].Select("User_Code='" + dr["User_Code"].ToString() + "' AND Month='" + monthName.Split('_')[1] + "' AND Year='" + monthName.Split('_')[2] + "' ");
                            if (drAccomp.Length > 0)
                            {
                                sbTableContent.Append("<td align='center'>" + drAccomp[0]["Count"].ToString() + "</td>");//Accompanist Details
                            }
                            else
                            {
                                sbTableContent.Append("<td align='center'>0</td>");//Accompanist Details
                            }
                        }
                        sbTableContent.Append("</tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<tr><th colspan='" + (monthlist.Count + 1) + "' align='left'>No Accompanist Details Found</th></tr>");
                    }
                }
                //****************************  Accompanist Details  ******************************
                sbTableContent.Append("</table>");
                sbTableContent.Append("</div>");
            }

            return sbTableContent.ToString();
        }

        private int GetHolidayCount(string userCode, string regionCode, string startDate, string endDate, string dcrStatus, string mode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet dsHoliday = new DataSet();

            dsHoliday = _objSPData.GetHolidayCount(companyCode, userCode, regionCode, startDate, endDate, dcrStatus);

            if (mode.Trim().ToUpper() == "COUNT")
            {
                return dsHoliday.Tables[0].Rows.Count;
            }
            else // DETAILS
            {
                return 0;
            }
        }

        public ActionResult Customer360(string id)
        {
            GetPrivillegeValue();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            ViewBag.Customer_Code = id;//id.Split('_')[0].ToString();
            ViewBag.User_Code = _objCurInfo.GetUserCode();// id.Split('_')[1].ToString();
            ViewBag.Doctor_Caption = DOCTOR_CAPTION;
            return View();
        }
        public JsonResult GetChildUsersFor360(string userCode, string doctorCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BL_Customer _objBLCustomer = new DataControl.BL_Customer();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBLCustomer.GetChildUsersForDoctor360(companyCode, userCode, doctorCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetChildUsersOrderByUserName(string userCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetChildUsersOrderByUserName(companyCode, userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public string GetCustomer360Details(string userCode, string doctorCode, string Mode, string regionCode)
        {
            GetPrivillegeValue();
            DataControl.BL_Customer _objBLCustomer = new BL_Customer();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Reports.Customer360Model> lstCustomer360 = new List<MVCModels.HiDoctor_Reports.Customer360Model>();
            lstCustomer360 = _objBLCustomer.GetCustomer360Details(_objCurInfo.GetCompanyCode(), userCode, doctorCode, Mode, regionCode);
            string[] arUsers;
            arUsers = userCode.Split('^');
            StringBuilder strCustomer360Details = new StringBuilder();
            if (Mode == "SINGLE")
            {
                if (lstCustomer360.Count > 0)
                {
                    //Customer Name
                    strCustomer360Details.Append("<div  id='dvCustomerName'>");
                    strCustomer360Details.Append("<div class='imgDoctorName360'></div><div class='dvDoctorName'>" + lstCustomer360[0].Customer_Name + " | " + lstCustomer360[0].MDL_Number + " | " +
                                                      lstCustomer360[0].Category_Name + " | " + lstCustomer360[0].Speciality_Name + " | " +
                                                       lstCustomer360[0].DOB + " </div>");
                    strCustomer360Details.Append("<div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");

                    //Campaign 
                    strCustomer360Details.Append("<div id='dvCampaign'>");
                    strCustomer360Details.Append("<div class='dvTitle'><div class='dvTitleImg imgCampaign360'></div>Campaign List </div>");
                    StringBuilder strCampaign = new StringBuilder();
                    if (lstCustomer360[0].lstCampaignModel.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstCampaignModel.Count; i++)
                        {
                            strCampaign.Append("<div> " + Convert.ToInt32(i + 1) + ". " + lstCustomer360[0].lstCampaignModel[i].Campaing_Name + "</div>");
                        }
                        strCustomer360Details.Append(" <div class='dvDetails'>" + strCampaign.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append(" <div class='dvDetails'>No campaigns mapped for this " + DOCTOR_CAPTION + "</div>");
                    }
                    strCustomer360Details.Append(" <div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");

                    //Last 3 visit
                    strCustomer360Details.Append("<div id='dvLastVisit'>");
                    strCustomer360Details.Append(" <div class='dvTitle'><div class='dvTitleImg imgLastVisit360'></div>Last 3 Visited Dates: </div>");
                    StringBuilder strLastVisit = new StringBuilder();
                    if (lstCustomer360[0].lstLastVisit.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstLastVisit.Count; i++)
                        {
                            strLastVisit.Append("<div>" + Convert.ToDateTime(lstCustomer360[0].lstLastVisit[i].DCR_Actual_Date).ToString("dd/MM/yyyy") + "</div>");
                        }
                        strCustomer360Details.Append(" <div class='dvDetails'>" + strLastVisit.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append(" <div class='dvDetails'>No last visit details found</div>");
                    }
                    strCustomer360Details.Append(" </div>");

                    //sample given to doctor
                    strCustomer360Details.Append("<div id='dvSamples'>");
                    strCustomer360Details.Append("<div class='dvTitle'><div class='dvTitleImg imgSample360' id='dvImgSamples'></div>Product Sample & Details </div>");
                    StringBuilder strSample = new StringBuilder();
                    if (lstCustomer360[0].lstSamples.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstSamples.Count; i++)
                        {
                            strSample.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstCustomer360[0].lstSamples[i].Product_Name + " - " + lstCustomer360[0].lstSamples[i].Quantity_Provided
                                    + " Nos.(" + lstCustomer360[0].lstSamples[i].DCR_Date + ") </div>");
                        }
                        strCustomer360Details.Append("<div class='dvDetails'>" + strSample.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append("<div class='dvDetails'>No Samples given to this " + DOCTOR_CAPTION + " for the last three visited dates.</div>");
                    }

                    strCustomer360Details.Append(" <div style='clear: both;'></div>");
                    strCustomer360Details.Append(" </div>");

                    //Nonsample given
                    strCustomer360Details.Append(" <div id='dvNonSample'>");
                    strCustomer360Details.Append(" <div class='dvTitle'><div class='dvTitleImg imgNonSample360' id='dvNonSample'></div>Non-Sample & Details</div>");
                    StringBuilder strNonSample = new StringBuilder();
                    if (lstCustomer360[0].lstNonSamples.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstNonSamples.Count; i++)
                        {
                            strNonSample.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstCustomer360[0].lstNonSamples[i].Product_Name + " - " + lstCustomer360[0].lstNonSamples[i].Quantity_Provided
                                    + " Nos.(" + lstCustomer360[0].lstNonSamples[i].DCR_Date + ") </div>");
                        }
                        strCustomer360Details.Append(" <div  class='dvDetails'>" + strNonSample.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append(" <div  class='dvDetails'>No Non-Samples given to this " + DOCTOR_CAPTION + " for the last three visited dates</div>");
                    }
                    strCustomer360Details.Append(" <div style='clear: both;'></div>");
                    strCustomer360Details.Append(" </div>");

                    //Chemist given
                    strCustomer360Details.Append(" <div id='dvChemist'>");
                    strCustomer360Details.Append(" <div class='dvTitle'><div class='dvTitleImg imgChemist360' id='dvImgChemist'></div>" + CHEMIST_CAPTION + " visited:</div>");
                    StringBuilder strChemist = new StringBuilder();
                    if (lstCustomer360[0].lstChemist.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstChemist.Count; i++)
                        {
                            strChemist.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstCustomer360[0].lstChemist[i].Customer_Name + " -(" + lstCustomer360[0].lstChemist[i].DCR_Date
                                    + " ) POB " + lstCustomer360[0].lstChemist[i].PO_Amount + " </div>");
                        }
                        strCustomer360Details.Append("<div  class='dvDetails'>" + strChemist + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append("<div  class='dvDetails'>No " + CHEMIST_CAPTION + " visit to this " + DOCTOR_CAPTION + "</div>");
                    }

                    strCustomer360Details.Append("<div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");

                    //Yield and Potential
                    strCustomer360Details.Append("<div id='dvYield'>");
                    strCustomer360Details.Append("<div class='dvTitle'><div class='dvTitleImg imgYield360' id='dvImgYield'></div>Yield & Potential</div>");
                    StringBuilder rcpaContent = new StringBuilder();
                    if (lstCustomer360[0].lstRCPA.Count > 0)
                    {
                        List<string> CompProduct = new List<string>();
                        List<string> MyProduct = new List<string>();
                        int totalProductCount = 0;
                        int myProductCount = 0;

                        for (int i = 0; i < lstCustomer360[0].lstRCPA.Count; i++)
                        {
                            CompProduct.Add(lstCustomer360[0].lstRCPA[i].Competitor_Product_Name);
                        }
                        for (int i = 0; i < lstCustomer360[0].lstRCPA.Count; i++)
                        {
                            MyProduct.Add(lstCustomer360[0].lstRCPA[i].Product_Name);
                        }

                        rcpaContent.Append("<table id='tblRCPA'><thead><tr>");
                        rcpaContent.Append("<td>Product</td><td>My Prescription</td>");
                        for (int i = 0; i < CompProduct.Count; i++)
                        {
                            rcpaContent.Append("<td>" + CompProduct[i] + "</td>");
                        }
                        rcpaContent.Append("</thead></tr><tbody>");
                        StringBuilder strYield = new StringBuilder();
                        strYield.Append("<table>");
                        for (int i = 0; i < MyProduct.Count; i++)
                        {
                            totalProductCount = 0;
                            myProductCount = 0;
                            strYield.Append("<tr>");
                            rcpaContent.Append("<tr>");
                            rcpaContent.Append("<td>" + MyProduct[i] + "</td>");
                            List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstTemp = lstCustomer360[0].lstRCPA.FindAll(p => p.Product_Name.Trim()
                                                                .Equals(MyProduct[i].ToString().Trim()));
                            if (lstTemp.Count > 0)
                            {
                                rcpaContent.Append("<td>" + lstTemp[0].Support_Qty + "</td>");
                                myProductCount = myProductCount + Convert.ToInt32(lstTemp[0].Support_Qty);
                                totalProductCount = totalProductCount + Convert.ToInt32(lstTemp[0].Support_Qty);

                                for (int c = 0; c < CompProduct.Count; c++)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstRcpa = lstCustomer360[0].lstRCPA.FindAll(a => a.Product_Name.Trim().
                                                    Equals(MyProduct[i].ToString().Trim()) && a.Competitor_Product_Name.Equals(CompProduct[c].ToString()));
                                    if (lstRcpa.Count > 0)
                                    {
                                        rcpaContent.Append("<td>" + lstRcpa[0].Comp_Qty + "</td>");
                                        totalProductCount = totalProductCount + Convert.ToInt32(lstRcpa[0].Comp_Qty);
                                    }
                                    else
                                    {
                                        rcpaContent.Append("<td>0</td>");
                                    }
                                }
                            }
                            rcpaContent.Append("</tr>");
                            strYield.Append("<td>" + MyProduct[i] + " </td><td> = Total Prescription " + totalProductCount + " ,</td><td>  My Yield/Prescription :" + myProductCount + "</td></tr>");
                        }
                        rcpaContent.Append("</tbody></table>");
                        strYield.Append("</table>");
                        strCustomer360Details.Append("<div  class='dvDetails'>" + rcpaContent + "</div><div style='padding-left: 3%;'>" + strYield.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append("<div  class='dvDetails'></div>");
                    }
                    strCustomer360Details.Append("<div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");

                    //Doctor Product Mapping
                    strCustomer360Details.Append("<div id='dvProductMapping'>");
                    strCustomer360Details.Append("<div class='dvTitle'><div class='dvTitleImg imgMapping360' id='dvImgProductMapping'></div>Product mapping Details</div>");
                    StringBuilder strDocPro = new StringBuilder();
                    if (lstCustomer360[0].lstProductMapping.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstProductMapping.Count; i++)
                        {
                            strDocPro.Append("<div>" + Convert.ToInt32(i + 1) + ". " + lstCustomer360[0].lstProductMapping[i].Product_Name + " -Yield : " + lstCustomer360[0].lstProductMapping[i].Support_Quantity
                                    + ", Potential - " + lstCustomer360[0].lstProductMapping[i].Potential_Quantity + "(" + lstCustomer360[0].lstProductMapping[i].Date + ")</div>");
                        }

                        strCustomer360Details.Append("<div  class='dvDetails'>" + strDocPro + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append("<div  class='dvDetails'></div>");
                    }
                    strCustomer360Details.Append("<div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");

                    //Remarks
                    strCustomer360Details.Append("<div>");
                    strCustomer360Details.Append("<div id='dvRemarks' class='dvTitle'><div class='dvTitleImg imgRemarks360'></div>Remarks</div>");
                    StringBuilder strRemarks = new StringBuilder();
                    if (lstCustomer360[0].lstRemarks.Count > 0)
                    {
                        for (int i = 0; i < lstCustomer360[0].lstRemarks.Count; i++)
                        {
                            string remarks = string.Empty;
                            if (lstCustomer360[0].lstRemarks[i].Remarks == "")
                            {
                                remarks = "No Remarks";
                            }
                            else
                            {
                                remarks = lstCustomer360[0].lstRemarks[i].Remarks;
                            }
                            strRemarks.Append("<div>" + Convert.ToInt32(i + 1) + ". " + remarks + " -(" + lstCustomer360[0].lstRemarks[i].DCR_Actual_Date + ")</div>");
                        }
                        strCustomer360Details.Append("<div  class='dvDetails'>" + strRemarks.ToString() + "</div>");
                    }
                    else
                    {
                        strCustomer360Details.Append("<div  class='dvDetails'></div>");
                    }
                    strCustomer360Details.Append("<div style='clear: both;'></div>");
                    strCustomer360Details.Append("</div>");
                }
            }
            else
            {
                strCustomer360Details.Append("<div  id='dvCustomerName'>");
                //strCustomer360Details.Append("<div>Doctor Details</div>");
                strCustomer360Details.Append("<div>" + lstCustomer360[0].Customer_Name + " | " + lstCustomer360[0].MDL_Number + " | " +
                                                  lstCustomer360[0].Category_Name + " | " + lstCustomer360[0].Speciality_Name + " | " +
                                                   lstCustomer360[0].DOB + " </div>");
                strCustomer360Details.Append("<div style='clear: both;'></div>");
                strCustomer360Details.Append("</div>");
                strCustomer360Details.Append("<table id='tblCustomer360' cellspacing=0 cellpadding=0>");
                strCustomer360Details.Append("<thead>");
                strCustomer360Details.Append("<tr>");
                strCustomer360Details.Append("<th style='width:15%'>User Name</th>");
                strCustomer360Details.Append("<th style='width:15%'>Reporting Manager Name</th>");
                strCustomer360Details.Append("<th style='width:5%'>Last 3 Visits</th>");
                strCustomer360Details.Append("<th style='width:20%'>Product & Sample</th>");
                strCustomer360Details.Append("<th style='width:20%'>Non sample</th>");
                strCustomer360Details.Append("<th style='width:20%'>Chemist visited</th>");
                strCustomer360Details.Append("<th style='width:5%'>Yield & Potential</th>");
                strCustomer360Details.Append("</tr>");
                strCustomer360Details.Append("</thead><tbody>");
                if (lstCustomer360.Count > 0)
                {
                    if (lstCustomer360[0].lstUsers.Count > 0)
                    {
                        for (int a = 0; a < arUsers.Length; a++)
                        {
                            List<MVCModels.HiDoctor_Master.UserModel> lstTempUsers = lstCustomer360[0].lstUsers.FindAll(c => c.User_Code.Equals(arUsers[a]));
                            if (lstTempUsers.Count > 0)
                            {
                                string currentUserCode = lstTempUsers[0].User_Code;
                                string currentUserName = lstTempUsers[0].User_Name + "(" + lstTempUsers[0].User_Type_Name + ")" + "-" + lstTempUsers[0].Region_Name;
                                string reportingManagerName = lstTempUsers[0].Reporting_Manager_Name + "(" + lstTempUsers[0].Reporting_Manager_Type_Name + ")" + "-" + lstTempUsers[0].Reporting_Manager_Region_Name;

                                strCustomer360Details.Append("<tr>");
                                strCustomer360Details.Append("<td>" + currentUserName + "</td>");
                                strCustomer360Details.Append("<td>" + reportingManagerName + "</td>");
                                strCustomer360Details.Append("<td>");
                                StringBuilder strLastVisit = new StringBuilder();
                                if (lstCustomer360[0].lstLastVisit.Count > 0)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360LastVisitsModel> lstTempLastVisit = lstCustomer360[0].lstLastVisit.Where(p => p.User_Code.Equals(currentUserCode)).ToList();
                                    for (int i = 0; i < lstTempLastVisit.Count; i++)
                                    {
                                        strLastVisit.Append("<div>" + Convert.ToDateTime(lstTempLastVisit[i].DCR_Actual_Date).ToString("dd/MM/yyyy") + "</div>");
                                    }
                                    strCustomer360Details.Append(" <div class='dvDetails'>" + strLastVisit.ToString() + "</div>");
                                }
                                else
                                {
                                    strCustomer360Details.Append(" <div class='dvDetails'>No last visit details found</div>");
                                }
                                strCustomer360Details.Append(" </div>");
                                strCustomer360Details.Append("</td>");
                                strCustomer360Details.Append("<td>");

                                //Product and Samples
                                StringBuilder strSample = new StringBuilder();
                                if (lstCustomer360[0].lstSamples.Count > 0)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360SamplesAndDetailsModel> lstTempSamples = lstCustomer360[0].lstSamples.Where(q => q.User_Code.Equals(currentUserCode)).ToList();
                                    for (int i = 0; i < lstTempSamples.Count; i++)
                                    {
                                        strSample.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstTempSamples[i].Product_Name + " - " + lstTempSamples[i].Quantity_Provided
                                                + " Nos.(" + lstTempSamples[i].DCR_Date + ") </div>");
                                    }
                                    strCustomer360Details.Append("<div class='dvDetails'>" + strSample.ToString() + "</div>");
                                }
                                else
                                {
                                    strCustomer360Details.Append("<div class='dvDetails'>No Samples given to this " + DOCTOR_CAPTION + " for the last three visited dates.</div>");
                                }

                                //Non-Sample details
                                strCustomer360Details.Append("<td>");
                                StringBuilder strNonSample = new StringBuilder();
                                if (lstCustomer360[0].lstNonSamples.Count > 0)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360NonSamplesAndDetailsModel> lstTempNonSamples = lstCustomer360[0].lstNonSamples.Where(r => r.User_Code.Equals(currentUserCode)).ToList();
                                    for (int i = 0; i < lstTempNonSamples.Count; i++)
                                    {
                                        strNonSample.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstTempNonSamples[i].Product_Name + " - " + lstTempNonSamples[i].Quantity_Provided
                                                + " Nos.(" + lstTempNonSamples[i].DCR_Date + ") </div>");
                                    }
                                    strCustomer360Details.Append(" <div  class='dvDetails'>" + strNonSample.ToString() + "</div>");
                                }
                                else
                                {
                                    strCustomer360Details.Append(" <div  class='dvDetails'>No Non-Samples given to this " + DOCTOR_CAPTION + " for the last three visited dates</div>");
                                }
                                strCustomer360Details.Append("</td>");

                                //Chemist visited
                                strCustomer360Details.Append("<td>");
                                StringBuilder strChemist = new StringBuilder();
                                if (lstCustomer360[0].lstChemist.Count > 0)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360ChemistVisitModel> lstTempChemist = lstCustomer360[0].lstChemist.Where(s => s.User_Code.Equals(currentUserCode)).ToList();
                                    for (int i = 0; i < lstTempChemist.Count; i++)
                                    {
                                        strChemist.Append("<div>" + Convert.ToInt32(i + 1) + ".  " + lstTempChemist[i].Customer_Name + " -(" + lstTempChemist[i].DCR_Date
                                                + " ) POB " + lstTempChemist[i].PO_Amount + " </div>");
                                    }
                                    strCustomer360Details.Append("<div  class='dvDetails'>" + strChemist + "</div>");
                                }
                                else
                                {
                                    strCustomer360Details.Append("<div  class='dvDetails'>No " + CHEMIST_CAPTION + " visit to this " + DOCTOR_CAPTION + "</div>");
                                }

                                strCustomer360Details.Append("</td>");
                                strCustomer360Details.Append("<td>");

                                //Yield and Potential
                                StringBuilder rcpaContent = new StringBuilder();
                                if (lstCustomer360[0].lstRCPA.Count > 0)
                                {
                                    List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstTempRCPA = lstCustomer360[0].lstRCPA.Where(t => t.User_Code.Equals(currentUserCode)).ToList();
                                    List<string> CompProduct = new List<string>();
                                    List<string> MyProduct = new List<string>();
                                    int totalProductCount = 0;
                                    int myProductCount = 0;
                                    if (lstTempRCPA.Count > 0)
                                    {
                                        for (int i = 0; i < lstTempRCPA.Count; i++)
                                        {
                                            CompProduct.Add(lstTempRCPA[i].Competitor_Product_Name);
                                        }
                                        for (int i = 0; i < lstTempRCPA.Count; i++)
                                        {
                                            MyProduct.Add(lstTempRCPA[i].Product_Name);
                                        }

                                        rcpaContent.Append("<table id='tblRCPA' cellspacing=0 cellpadding=0><thead><tr>");
                                        rcpaContent.Append("<th>Product</th><th>My Prescription</th>");
                                        for (int i = 0; i < CompProduct.Count; i++)
                                        {
                                            rcpaContent.Append("<th>" + CompProduct[i] + "</th>");
                                        }
                                        rcpaContent.Append("</tr></thead><tbody>");
                                        StringBuilder strYield = new StringBuilder();
                                        strYield.Append("<table>");
                                        for (int i = 0; i < MyProduct.Count; i++)
                                        {
                                            totalProductCount = 0;
                                            myProductCount = 0;
                                            strYield.Append("<tr>");
                                            rcpaContent.Append("<tr>");
                                            rcpaContent.Append("<td>" + MyProduct[i] + "</td>");
                                            List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstTemp = lstTempRCPA.FindAll(p => p.Product_Name.Trim()
                                                                                .Equals(MyProduct[i].ToString().Trim()));
                                            if (lstTemp.Count > 0)
                                            {
                                                rcpaContent.Append("<td>" + lstTemp[0].Support_Qty + "</td>");
                                                myProductCount = myProductCount + Convert.ToInt32(lstTemp[0].Support_Qty);
                                                totalProductCount = totalProductCount + Convert.ToInt32(lstTemp[0].Support_Qty);

                                                for (int c = 0; c < CompProduct.Count; c++)
                                                {
                                                    List<MVCModels.HiDoctor_Reports.Customer360RCPADetailsModel> lstRcpa = lstTempRCPA.FindAll(b => b.Product_Name.Trim().
                                                                    Equals(MyProduct[i].ToString().Trim()) && b.Competitor_Product_Name.Equals(CompProduct[c].ToString()));
                                                    if (lstRcpa.Count > 0)
                                                    {
                                                        rcpaContent.Append("<td>" + lstRcpa[0].Comp_Qty + "</td>");
                                                        totalProductCount = totalProductCount + Convert.ToInt32(lstRcpa[0].Comp_Qty);
                                                    }
                                                    else
                                                    {
                                                        rcpaContent.Append("<td>0</td>");
                                                    }
                                                }
                                            }
                                            rcpaContent.Append("</tr>");
                                            strYield.Append("<td>" + MyProduct[i] + " </td><td> = Total Prescription " + totalProductCount + " ,</td><td>  My Yield/Prescription :" + myProductCount + "</td></tr>");
                                        }
                                        rcpaContent.Append("</tbody></table>");
                                        strYield.Append("</table>");
                                        strCustomer360Details.Append("<div class='dvRCPALnk' onclick='fnShowRCPA(" + a + ");'> View");
                                        strCustomer360Details.Append("<div class='dvRCPA' style='display:none' id='dvRCPA_" + a + "'><div>" + rcpaContent + "</div><div class='dvYield'>" + strYield.ToString() + "</div><div style='clear:both;'></div></div>");
                                        strCustomer360Details.Append("</div>");
                                    }
                                }

                                strCustomer360Details.Append("</td>");
                                strCustomer360Details.Append("</tr>");

                            }
                        }

                    }
                }
                strCustomer360Details.Append("</tbody>");
                strCustomer360Details.Append("</table>");
            }
            return strCustomer360Details.ToString();
        }

        public JsonResult GetCustomerRegions(string customerCode)
        {
            DataControl.BL_Customer _objBlCustomer = new BL_Customer();
            DataControl.CurrentInfo _objCurrentIfo = new CurrentInfo();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            lstRegion = _objBlCustomer.GetCustomerRegions(companyCode, customerCode);
            return Json(lstRegion, JsonRequestBehavior.AllowGet);
        }
        public string GetDoctorCoverageCount(FormCollection collection)
        {
            try
            {
                BL_Report objBLReport = new BL_Report();

                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCodes = _objcurrentInfo.GetUserCode();
                string startDate = collection["sd"].ToString();
                string endDate = collection["ed"].ToString();
                string mode = collection["mode"].ToString();


                string lableName = string.Empty;
                if (mode == "VISIT")
                {
                    lableName = "NoOfVisits";
                }
                else
                {
                    lableName = "NoOfMet";
                }

                DataSet ds = objBLReport.GetDoctorCoverageCount(companyCode, userCodes, startDate, endDate, mode);
                //DataSet ds = objRptRepo.GetDoctorCoverageCount(companyCode, userCodes, startMonth, endMonth, startYear, endYear);

                StringBuilder data = new StringBuilder();
                data.Append("[");
                for (var j = 0; j < ds.Tables[0].Rows.Count; j++)
                {
                    data.Append("{'UserName' : '" + ds.Tables[0].Rows[j]["User_Name"].ToString() + "',");
                    data.Append("'Employee_Name' : '" + ds.Tables[0].Rows[j]["Employee_Name"].ToString() + "',");
                    data.Append("'User_Type_Name' : '" + ds.Tables[0].Rows[j]["User_Type_Name"].ToString() + "',");
                    data.Append("'Region_Name' : '" + ds.Tables[0].Rows[j]["Region_Name"].ToString() + "',");
                    data.Append("'Reporting_Manager' : '" + ds.Tables[0].Rows[j]["Reporting_Manager"].ToString() + "',");
                    data.Append("'Year' : '" + ds.Tables[0].Rows[j]["Year"].ToString() + "',");
                    data.Append("'Month' : '" + ds.Tables[0].Rows[j]["Month"].ToString() + "',");
                    data.Append("'SpecialityName' : '" + ds.Tables[0].Rows[j]["Speciality_Name"].ToString() + "',");
                    data.Append("'CategoryName' : '" + ds.Tables[0].Rows[j]["Category_Name"].ToString() + "',");
                    data.Append("'" + lableName + "' : '" + ds.Tables[0].Rows[j]["Count"].ToString() + "'},");

                }

                StringBuilder finalData = new StringBuilder();

                finalData.Append(data.ToString().TrimEnd(','));
                finalData.Append("]");

                return finalData.ToString();
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, ex.StackTrace.ToString() + "_ Method Name : HiDoctor_EDetailing.GetDoctorCoverageCount");
                return null;
            }
        }

        //SFC Report
        public ActionResult SFCReport()
        {
            return View();
        }
        //SFC Report Current
        public ActionResult SFCReportCurrent()
        {
            return View();
        }
        /// <summary>
        /// ActivityFrequencySummary
        /// </summary>
        /// <returns></returns>

        public ActionResult ActivityFrequencySummaryReport()
        {
            return View();
        }

        /// <summary>
        /// Get MasterReport
        /// </summary>
        /// <param name="Category"></param>
        /// <returns></returns>

        public ActionResult MasterReport(string id)
        {
            if (id.ToUpper() == "BRAND")
            {
                ViewBag.rptType = id;
            }
            if (id.ToUpper() == "PRODUCT")
            {
                ViewBag.rptType = id;
            }
            return View();
        }

        /// <summary>
        /// Last Submitted quickReference Report
        /// </summary>
        /// <returns></returns>
        public ActionResult LastsubmittedQuickRef()
        {
            return View();
        }

        /// <summary>
        /// DailyCall Status Report
        /// </summary>
        /// <returns></returns>
        public ActionResult DailyCallstatusReport()
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            return View();
        }

        /// <summary>
        /// Cp Coverage and Deviation Report
        /// </summary>
        /// <returns></returns>
        public ActionResult CpCoverageAndDeviation()
        {
            return View();
        }

        public ActionResult EmployeeLeaveCard(string id)
        {
            return View();
        }

        /// <summary>
        /// Doctor deviation Report Details
        /// </summary>
        /// <returns></returns>
        public ActionResult DoctorDeviationReport()
        {
            return View();
        }

        public ActionResult UserLogReport()
        {
            return View();
        }

        //SpecialityWiseDocotorCategorycount Report
        public ActionResult SpecialityWiseDoctorCategoryCount()
        {
            return View();
        }
        /// <summary>
        ///Doctor Master Report
        /// </summary>
        /// <returns></returns>
        public ActionResult DoctorMasterReport()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        #region DoctorMasterReport
        public ActionResult DoctorMasterReportOpt()
        {
            ViewBag.Region_Code = _objcurrentInfo.GetRegionCode();
            return View();
        }
        public string GetDoctorMasterReportDetailsOpt(string regionCode, string viewFormat, string title, string selectedUser)
        {
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                StringBuilder strTb = new StringBuilder();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                if (viewFormat == "S")
                {
                    strTb = GetDoctorMasterReportOpt(regionCode, viewFormat, title, selectedUser);
                }
                else
                {
                    string lastSubmittedTable = GetDoctorMasterReportOpt(regionCode, viewFormat, title, selectedUser).ToString();
                    string DoctorMasterReportDetails = GetDoctorMasterDetailsOpt(regionCode).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objCurrentInfo.GetUserName();
                    string compCode = _objCurrentInfo.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "DOCTOR_MASTER_OPT" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    string filename1 = "DOCTOR_MASTER_DETAILS" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl1 = objAzureBlob.AzureBlobUploadText(DoctorMasterReportDetails, accKey, filename1, "bulkdatasvc");

                    strTb.Append("Doctor Master Summary: <a href='" + blobUrl + "'>Click here to Download</a><br/>");
                    strTb.Append("Doctor Master Details: <a href='" + blobUrl1 + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regioncode", regionCode);
                dicContext.Add("viewFormat", viewFormat);
                dicContext.Add("title", title);
                dicContext.Add("selectedUser", selectedUser);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        public StringBuilder GetDoctorMasterReportOpt(string regionCode, string viewFormat, string title, string selectedUser)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strTb = new StringBuilder();
            DataTable dt = new DataTable();
            DataSet ds = _objRR.GetDoctorMasterReportOpt(regionCode, _objCurrentInfo.GetCompanyCode());
            string created_date = "";
            if (ds.Tables.Count > 1)
                if (ds.Tables[1].Rows.Count > 0)
                    created_date = ds.Tables[1].Rows[0]["tblCreatedDate"].ToString();
            strTb.Append("<div style='margin-left: 7px;'>");
            strTb.Append("<div><lable>1.<span style='font-weight:bold;'>Individual Count :</span> It is the total approved doctor count with respect to region.</lable></div>");
            strTb.Append("<div><lable>2.<span style='font-weight:bold;'>Group Count:</span> is the total approved doctor count with respect to the team.</lable></div>");
            strTb.Append("<div><lable>3.<span style='font-weight:bold;'>Category Count:</span> is the total approved doctor with respect to the category.</lable></div>");
            strTb.Append("<div><lable>4.<span style='font-weight:bold;'>Speciality Count:</span> is the total approved doctor with respect to speciality.</lable></div>");
            strTb.Append("</div>");
            strTb.Append("</br>");
            strTb.Append("<i> *Doctor Master Composition Report on '" + created_date + "'</i></br>");
            strTb.Append("<table id='tblDoctoMasterMainReport' class='table table-striped' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr>");
            strTb.Append("<th align='left' valign='top'>Region Name</th><th align='left' valign='top'>User Name</th><th align='left' valign='top'>Designation</th><th align='left' valign='top'>Division Name</th><th align='left' valign='top'>Individual Count</th>");
            strTb.Append("<th align='left' valign='top'>Group Count</th>");
            dt = ds.Tables[0];
            string[] columnNames = dt.Columns.Cast<DataColumn>()
                                 .Select(x => x.ColumnName)
                                 .ToArray();
            for (int col = 8; col < columnNames.Length; col++)
            {
                strTb.Append("<th align='left' valign='top'>" + columnNames[col] + "</th>");
            }
            strTb.Append("</tr></thead><tbody>");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                strTb.Append("<tr>");
                for (int col = 2; col < columnNames.Length; col++)
                {
                    strTb.Append("<td align='left' valin='top' style='white-space:nowrap;'>" + dt.Rows[i][col] + "</td>");
                }
                strTb.Append("</tr>");
            }

            strTb.Append("</tbody>");
            strTb.Append("</table>");


            return strTb;
        }
        public string GetDoctorMasterDetailsOpt(string regionCode)
        {
            StringBuilder strRpt = new StringBuilder();
            try
            {
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objRR = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
                List<MVCModels.HiDoctor_Reports.CustomerDetailsModel> lstCustomerDetails = new List<MVCModels.HiDoctor_Reports.CustomerDetailsModel>();
                List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> lstCategoryandSpeciality = new List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel>();
                lstCustomerDetails = _objRR.GetCustomerDetails(_objCurrentInfo.GetCompanyCode(), regionCode).ToList();
                lstCategoryandSpeciality = _objRR.GetCategoryandSpecialityMaster(_objCurrentInfo.GetCompanyCode()).ToList();

                strRpt.Append("<table id='tblDoctorMasterDetails' class='table table-striped' cellspacing='0' style='margin-bottom:0px;border:1px solid #aaa;font-size:11px' cellpadding='0'>");
                strRpt.Append("<thead class='active'>");
                strRpt.Append("<tr>");
                strRpt.Append("<th>Region Name<th>Doctor Name</th><th>MDL Number</th><th>Category Name</th><th>Speciality Name</th><th>Local Area</th><th>Hospital Name</th>");
                strRpt.Append("</tr>");
                strRpt.Append("</thead>");
                strRpt.Append("<tbody>");
                if (lstCustomerDetails.Count > 0 && lstCustomerDetails != null)
                {
                    foreach (var customerDetails in lstCustomerDetails)
                    {
                        strRpt.Append("<tr>");
                        //Region Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Region_Name);
                        strRpt.Append("</td>");

                        //Doctor Name   

                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Customer_Name.TrimEnd('.').ToString());
                        strRpt.Append("</td>");

                        //MDL Number
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.MDL_Number);
                        strRpt.Append("</td>");
                        //Category Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Category_Name);
                        strRpt.Append("</td>");
                        //Speciality Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Speciality_Name);
                        strRpt.Append("</td>");
                        //Local Area
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Local_Area);
                        strRpt.Append("</td>");
                        //Hospital Name
                        strRpt.Append("<td>");
                        strRpt.Append(customerDetails.Hospital_Name);
                        strRpt.Append("</td>");
                        strRpt.Append("</tr>");

                    }
                }
                else
                {
                    strRpt.Append("No Records To Display.");
                }
                strRpt.Append("</tbody>");
                strRpt.Append("</table>");

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
            return strRpt.ToString();
        }
        #endregion DoctorMasterReport
        public ActionResult DoctorProductMappingReport()
        {
            return View();
        }

        public ActionResult DoctorMasterTerritoryWiseReport(string regionCode)
        {
            ViewBag.RegionCode = regionCode;
            return View();
        }

        public ActionResult DoctorMasterDetails(string regionCode)
        {
            ViewBag.RegionCodeonly = regionCode;
            return View();
        }


        public ActionResult DoctorMasterDateWiseReport(string regionCode)
        {
            ViewBag.RegnCode = regionCode;
            return View();
        }
        #region menu log report
        public ActionResult MenuAccessLogReport()
        {
            return View();
        }

        #endregion menu log report
        #region privilege log report
        public ActionResult PrivilegeLogReport()
        {
            return View();
        }

        #endregion privilege log report
        #region tp alumini report
        public ActionResult TPAluminiReport()
        {
            return View();
        }
        #endregion tp alumini report
        #region employee audit report
        public ActionResult EmployeeAuditReport()
        {
            return View();
        }
        #endregion employee audit report


        #region Sample stock for resigned Details
        public ActionResult SampleStockforResignedDetailsReport()
        {
            return View();
        }
        #endregion Sample stock for resigned Details
        #region ExpenseAnalysisforAlumni
        public ActionResult ExpenseAnalysisforAlumni()
        {
            return View();
        }
        #endregion ExpenseAnalysisforAlumni

        #region AuditTrail for NewCustomer
        public ActionResult AuditTrailforNewCustomer()
        {
            return View();
        }
        #endregion AuditTrail for NewCustomer

        public ActionResult ShareAllocationReport()
        {
            ViewBag.CurrentDate = System.DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }

        #region Tp vs actual Details Report
        public JsonResult GetWeekendDays(string fromDate, string toDate, string regionCode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            BLRegion objRegion = new BLRegion();
            JSONConverter objJson = new JSONConverter();
            List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> lstWeekend = new List<MVCModels.HiDoctor_Master.WeekendDaysForARegion>();
            lstWeekend = objRegion.GetWeekendDaysFormappedRegion(companyCode, regionCode, fromDate, toDate).ToList();
            return Json(lstWeekend, JsonRequestBehavior.AllowGet);
        }
        #endregion Tp vs actual Details Report




        public string GetKYDCompletionStatus(string regionCode, string viewFormat)
        {
            try
            {
                StringBuilder strBuilder = new StringBuilder();
                if (viewFormat == "1")
                {
                    strBuilder = GetKYDCompletionStatusDetail(regionCode);
                }
                else
                {
                    string DCREmpLeaveTable = GetKYDCompletionStatusDetail(regionCode).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "KYD Completion Status Report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(DCREmpLeaveTable, accKey, fileName, "bulkdatasvc");

                    strBuilder.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }

                return strBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:regionCode", regionCode);
                dicContext.Add("Filter:viewFormat", viewFormat);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }



        private StringBuilder GetKYDCompletionStatusDetail(string regionCode)
        {

            StringBuilder sbTableContent = new StringBuilder();
            DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion _objReport = new DataControl.HiDoctor_ReportsFactoryClasses.BL_ReportRegion();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            BLUser _objUser = new BLUser();
            string companyCode = _objCurInfo.GetCompanyCode();
            IConfig_Settings = new Config_Settings();

            string configkeyValueRename = string.Empty;
            string KeyColunm = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.KYD,
                 CONFIG_KEY.KYD_DOCTOR_DUPLICATE_KEY_CHECK_COLUMN);

            try
            {
                if (KeyColunm.ToUpper() == "MOBILE")
                {
                    configkeyValueRename = "Doctor Mobile No";
                }
                else if (KeyColunm.ToUpper() == "REGISTRATION_NO")
                {

                    configkeyValueRename = "Doctor Registration No";
                }
                List<MVCModels.HiDoctor_Reports.RegionKYDDetails> lstRegionKYDDetails = new List<MVCModels.HiDoctor_Reports.RegionKYDDetails>();
                lstRegionKYDDetails = (List<MVCModels.HiDoctor_Reports.RegionKYDDetails>)_objReport.GetKYDDetails(companyCode, regionCode, KeyColunm.ToUpper());
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = _objUser.GetSingleUserInfo(companyCode, "", regionCode).ToList();
                List<MVCModels.HiDoctor_Reports.KYDCustomerMasterDetails> lstCustDetail = lstRegionKYDDetails[0].lstKYDCustomerDetail;
                List<MVCModels.HiDoctor_Reports.KYDCustomertotalCount> lstCount = lstRegionKYDDetails[0].lstCustomertotalCount;
                List<MVCModels.HiDoctor_Reports.KYDRegionName> lstRegionName = lstRegionKYDDetails[0].lstregionName;

                if (lstUserInfo.Count > 0)
                {

                    sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table'>");
                    sbTableContent.Append("<thead><tr><th colspan='4' style='text-align: center;'>Know Your Doctor Completion Status Report</th></tr></thead>");
                    sbTableContent.Append("<tbody>");
                    sbTableContent.Append("<tr><td><b>Employee Name :</b></td><td>" + lstUserInfo[0].Employee_Name + "</td><td><b>Region Name :</b></td><td>" + lstUserInfo[0].Region_Name + "</td></tr>");
                    sbTableContent.Append("<tr><td><b>User Name :</b></td><td>" + lstUserInfo[0].User_Name + "</td><td><b>Reporting Manager Name :</b></td><td>" + lstUserInfo[0].Reporting_Manager_Name + "</td></tr>");
                    sbTableContent.Append("<tr><td><b>Mobile No :</b></td><td>" + lstUserInfo[0].User_Mobile_Number + "</td><td><b>Reporting Manager Region :</b></td><td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td></tr>");
                    sbTableContent.Append("<tr><td><b>Designation :</b></td><td>" + lstUserInfo[0].User_Type_Name + "</td><td><b>Division Name :</b></td><td>" + lstUserInfo[0].Division_Name + "</td></tr>");
                    sbTableContent.Append("<tr><td><b>As on :</b></td><td>" + System.DateTime.Now.ToString("dd-MM-yyyy") + "</td><td></td><td></td></tr>");
                    sbTableContent.Append("<tr><td><b>KYD Completed :</b></td><td>" + lstCustDetail.Count + "/" + lstCount[0].customerCount + "</td><td><b>Key Column:</b></td><td>" + configkeyValueRename + "</td></tr>");
                    sbTableContent.Append("</tbody>");

                    sbTableContent.Append("<table id='tblKYDReport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr><td>Sl.No</td>");
                    sbTableContent.Append("<td>Doctor Name</td>");
                    sbTableContent.Append("<td>MDL Number</td>");
                    sbTableContent.Append("<td>Category</td>");
                    sbTableContent.Append("<td>Speciality</td>");
                    sbTableContent.Append("<td id='tdRegno' class='cls_DisplayColumn'>Reg.No</td>");
                    sbTableContent.Append("<td id='tdmobileno' class='cls_DisplayColumn'>Mobile No</td>");
                    sbTableContent.Append("<td id='tdPinCode' class='cls_DisplayColumn'>Pin Code</td>");
                    sbTableContent.Append("<td id='tdlocalared' class='cls_DisplayColumn'>Local Area</td>");
                    sbTableContent.Append("<td id='tdHospitalNamr' class='cls_DisplayColumn'>Hospital Name</td>");
                    sbTableContent.Append("<td id='tdmedcoun' class='cls_DisplayColumn'>Med.Council</td>");
                    sbTableContent.Append("</tr></thead>");
                }
                else
                {
                    sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table'>");
                    sbTableContent.Append("<thead><tr><th colspan='4' style='text-align: center;'>Know Your Doctor Completion Status Report</th></tr></thead>");
                    sbTableContent.Append("<tbody>");
                    sbTableContent.Append("<tr><td><b>Region Name :</b></td><td>" + lstRegionName[0].Region_Name + "</td><td><b>User Status :</b></td><td>VACANT</td></tr>");
                    sbTableContent.Append("<tr><td><b>As on :</b></td><td>" + System.DateTime.Now.ToString("dd-MM-yyyy") + "</td><td></td><td></td></tr>");
                    sbTableContent.Append("<tr><td><b>KYD Completed :</b></td><td>" + lstCustDetail.Count + "/" + lstCount[0].customerCount + "</td><td><b>Key Column:</b></td><td>" + configkeyValueRename + "</td></tr>");
                    sbTableContent.Append("</tbody>");

                    sbTableContent.Append("<table id='tblKYDReport' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr><td>Sl.No</td>");
                    sbTableContent.Append("<td>Doctor Name</td>");
                    sbTableContent.Append("<td>MDL Number</td>");
                    sbTableContent.Append("<td>Category</td>");
                    sbTableContent.Append("<td>Speciality</td>");
                    sbTableContent.Append("<td id='tdRegno' class='cls_DisplayColumn'>Registration No</td>");
                    sbTableContent.Append("<td id='tdmobileno' class='cls_DisplayColumn'>Mobile No</td>");
                    sbTableContent.Append("<td id='tdPinCode' class='cls_DisplayColumn'>Pin Code</td>");
                    sbTableContent.Append("<td id='tdlocalared' class='cls_DisplayColumn'>Local Area</td>");
                    sbTableContent.Append("<td id='tdHospitalNamr' class='cls_DisplayColumn'>Hospital Name</td>");
                    sbTableContent.Append("<td id='tdmedcoun' class='cls_DisplayColumn'>Med.Council</td>");
                    sbTableContent.Append("</tr></thead>");

                }
                if (lstCustDetail.Count > 0)
                {
                    int i = 0;
                    foreach (var item in lstCustDetail)
                    {

                        i++;
                        sbTableContent.Append("<tr><td>" + i + "</td>");
                        sbTableContent.Append("<td>" + item.Doctor_Name + "</td>");
                        sbTableContent.Append("<td>" + item.MDL_Number + "</td>");
                        sbTableContent.Append("<td>" + item.Category_Name + "</td>");
                        sbTableContent.Append("<td>" + item.Speciality_Name + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsRegNo'>" + item.Registration_No + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsMobile'>" + item.Mobile + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsPincode'>" + item.Pin_Code + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsLocalarea'>" + item.Local_Area + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsHospitalName'>" + item.Hospital_Name + "</td>");
                        sbTableContent.Append("<td class='cls_DisplayColumn clsMedCou'>" + item.Medical_Council + "</td></tr>");
                    }
                }
                else
                {
                    sbTableContent.Append("<div><table><tr>No Data found</tr></table></div>");
                }
                return sbTableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", regionCode);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;

            }
        }


        //

        public JsonResult GetaluminiUserDetail(string userCode)
        {
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.User_Employeedetails> lstuser = new List<MVCModels.User_Employeedetails>();
            string companyCode = _objCurInfo.GetCompanyCode();
            lstuser = (List<MVCModels.User_Employeedetails>)_objBlmaster.GetaluminiUserDetail(companyCode, userCode);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstuser));
        }

        public JsonResult GetAccompanistVisitedDetails(string Accompanist, string DcrUserCode)
        {
            BL_Report objBLReport = new BL_Report();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            List<DCRApprovalAccModel> _lstAcc = new List<DCRApprovalAccModel>();
            _lstAcc = objBLReport.GetAccompanistVisitedDetails(companyCode, Accompanist, DcrUserCode);
            return Json(_lstAcc, JsonRequestBehavior.AllowGet);
        }

        public string GetClaimRequestDetailsforClaimCode(string claimCode, string userCode, string requestName, string favouringUserCode, string requestCode)
        {
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            StringBuilder strTblContent = new StringBuilder();
            StringBuilder AddlStrTblContent = new StringBuilder();
            StringBuilder strHistory = new StringBuilder();
            StringBuilder strExpenseTypeWiseDetail = new StringBuilder();
            List<MVCModels.ExpenseClaimModel> lstClaim = new List<MVCModels.ExpenseClaimModel>();
            List<MVCModels.AddlUnapproveExpModel> lstUnApproveAddlExp = new List<MVCModels.AddlUnapproveExpModel>();
            List<MVCModels.ClaimExpenseTypeWiseHistory> lstClaimExpenseWiseHistory = new List<MVCModels.ClaimExpenseTypeWiseHistory>();
            IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
            DataControl.JSONConverter objJson = new JSONConverter();
            DataControl.BLMaster objMaster = new BLMaster();
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            string claimMoveOrder = string.Empty;

            string claimType = string.Empty;
            try
            {
                lstClaim = objExpClaim.GetExpenseClaimDetails(objCurInfo.GetCompanyCode(), claimCode);
                lstUnApproveAddlExp = objExpClaim.GetAddlExpenseClaimDetails(objCurInfo.GetCompanyCode(), claimCode);
                // string fieldExpensePriValue = objMaster.GetPrivilegeValue(objCurInfo.GetCompanyCode(), userCode, "FIELD_EXPENSE_REQUEST_FOR");
                //string doctorCRMPriValue = objMaster.GetPrivilegeValue(objCurInfo.GetCompanyCode(), userCode, "REQUEST_CUSTOMER_FOR");
                string deductiondetailsPriValue = objMaster.GetPrivilegeValue(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), "SHOW_CLAIM_DEDUCTION_DETAILS");
                string requestType = _objClaim.GetExpenserequestType(objCurInfo.GetCompanyCode(), requestCode);
                claimMoveOrder = lstClaim[0].lstClaimHeader[0].Order_No.ToString();


                //string[] fieldExpensePriValues = fieldExpensePriValue.Split(',');

                // foreach (string item in fieldExpensePriValues)
                // {


                if (requestType.ToUpper() == "REGION WISE")
                {
                    AddlStrTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblAddlExpDetails' class='table table-hover'><thead><tr>");
                    AddlStrTblContent.Append("<td>DCR Date</td><td>Work Category</td><td>Activity</td>");
                    AddlStrTblContent.Append("<td>Expense Type</td><td>Claim Amount</td>");
                    AddlStrTblContent.Append("<td>Current Deduction</td><td>Approved Amount</td><td>");
                    AddlStrTblContent.Append("<td>Approval Remarks</td></tr></thead><tbody id='AddlCntEdit'>");
                    int rowCount = 0;
                    foreach (var item in lstUnApproveAddlExp)
                    {
                        rowCount = rowCount + 1;
                        string AddlDcrDate = string.Empty;
                        string DcrFlag = string.Empty;
                        if (item.DCR_Activity_Flag.ToUpper() == "F")
                        {
                            DcrFlag = "Field";
                        }
                        else if (item.DCR_Activity_Flag.ToUpper() == "A")
                        {
                            DcrFlag = "Attendance";
                        }

                        AddlDcrDate = item.DCR_Actual_Date.Split(' ')[0];
                        if (AddlDcrDate.Split('/')[1].Length == 1 && AddlDcrDate.Split('/')[0].Length == 1)
                        {
                            AddlDcrDate = '0' + AddlDcrDate.Split('/')[1] + "/0" + AddlDcrDate.Split('/')[0] + '/' + AddlDcrDate.Split('/')[2];
                        }
                        else if (AddlDcrDate.Split('/')[0].Length == 1)
                        {
                            AddlDcrDate = AddlDcrDate.Split('/')[1] + "/0" + AddlDcrDate.Split('/')[0] + '/' + AddlDcrDate.Split('/')[2];
                        }
                        else if (AddlDcrDate.Split('/')[1].Length == 1)
                        {
                            AddlDcrDate = '0' + AddlDcrDate.Split('/')[1] + '/' + AddlDcrDate.Split('/')[0] + '/' + AddlDcrDate.Split('/')[2];
                        }
                        else
                        {
                            AddlDcrDate = AddlDcrDate.Split('/')[1] + '/' + AddlDcrDate.Split('/')[0] + '/' + AddlDcrDate.Split('/')[2];
                        }

                        AddlStrTblContent.Append("<tr class='AprExpRow' id='AprExpRowId_" + rowCount + "'>");
                        AddlStrTblContent.Append("<td>" + AddlDcrDate + "</td>");
                        AddlStrTblContent.Append("<td>" + item.Category+"("+ item.DCR_Activity_Flag.ToUpper()+")</td>");
                        AddlStrTblContent.Append("<td>" + DcrFlag + "</td>");               
                        AddlStrTblContent.Append("<td class='trRow' id='AddlAprExpType_" + rowCount + "' Addl_Exp_Code='" + item.Expense_Type_Name + "'>" + item.Expense_Type_Name + "</td>");
                        AddlStrTblContent.Append("<td id='AddlAprClaimAmt_" + rowCount + "'>" + item.Expense_Amount + "</td>");
                        AddlStrTblContent.Append("<td id='AddlExpCurrDed_" + rowCount + "'>" + item.Deduction_Amount + "</td>");
                        AddlStrTblContent.Append("<td id='AddlExpAprAmt_" + rowCount + "'>" + item.Approved_Amount + "</td>");
                        AddlStrTblContent.Append("<td id='AddlAdminRem_" + rowCount + "'>" + item.Managers_Approval_Remark + "</td>");
                        AddlStrTblContent.Append("</tr>");
                    }


                    AddlStrTblContent.Append("</tbody></table>");

                    #region field expense claim details
                    claimType = "FIELD_EXPENSE_REQUEST_FOR";
                    lstExpClaimDetails = objExpClaim.GetFieldExpenseClaimDetails(objCurInfo.GetCompanyCode(), claimCode);
                    // int claimHistoryCount = objExpClaim.GetclaimHistoryCount(objCurInfo.GetCompanyCode(), claimCode);
                    lstClaimExpenseWiseHistory = objExpClaim.GetExpenseClaimHistoryCount(objCurInfo.GetCompanyCode(), claimCode).ToList();
                    strTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblExpDetails' class='table table-striped'><thead><tr>");
                    strTblContent.Append("<td>DCR Date</td><td>Work Category</td><td>Activity</td><td>Num.of Doctors Visited</td>");
                    strTblContent.Append("<td>TP SFC details</td><td>DCR SFC Details</td><td class='monthDcrHide'>DCR Status</td><td>Expense Type</td><td>Claim Amount(Rs.)</td><td>DCR Remarks</td>");
                    strTblContent.Append("<td>Previous Deduction(Rs.)</td><td>Current Deduction(Rs.)</td><td>Approved Amount (Rs.)</td><td>Approval Remarks</td>");
                    strTblContent.Append("</tr> </thead><tbody>");
                    if (lstExpClaimDetails != null)
                    {
                        var lstDistDate = lstExpClaimDetails.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();
                        int IRow = 0;
                        int i = 0;
                        foreach (var distinctDate in lstDistDate)
                        {
                            List<MVCModels.ExpenseClaimDetailsModel> lstD = (List<MVCModels.ExpenseClaimDetailsModel>)(lstExpClaimDetails.Where(e => e.DCR_Actual_Date == distinctDate.DCR_Actual_Date)).ToList();
                            var lstExpeseTypeDate = lstD.Select(x => new { x.Expense_Type_Code }).Distinct().ToList();
                            IRow = lstExpeseTypeDate.Count;

                            ////SFC DETAIL//

                            StringBuilder strContentSFC = new StringBuilder();
                            BL_ExpenseClaim objClaim = new BL_ExpenseClaim();
                            string sfcFlag = string.Empty;
                            DataSet ds = new DataSet();
                            sfcFlag = lstD[0].DCR_Activity_Flag.ToString();
                            string dcrDateSFC = distinctDate.DCR_Actual_Date.Split('-')[2] + "-" + distinctDate.DCR_Actual_Date.Split('-')[1] + "-" + distinctDate.DCR_Actual_Date.Split('-')[0];

                            ds = objClaim.GetDCRSFCDetails(objCurInfo.GetCompanyCode(), favouringUserCode, dcrDateSFC, sfcFlag);

                            if (ds.Tables.Count > 1)
                            {

                                if (ds.Tables[1].Rows.Count > 0)
                                {
                                    foreach (DataRow dr in ds.Tables[1].Rows)
                                    {
                                        strContentSFC.Append("<table>");
                                        strContentSFC.Append("<tr>");
                                        if (dr["Route_Way"].ToString() == "R")
                                            strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "," + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                        else
                                            strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["To_Place"]) + "-" + Convert.ToString(dr["From_Place"]) + "," + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                        strContentSFC.Append("</tr>");
                                        strContentSFC.Append("</table>");
                                    }
                                }
                                else
                                {
                                    foreach (DataRow dr in ds.Tables[0].Rows)
                                    {
                                        strContentSFC.Append("<table>");
                                        strContentSFC.Append("<tr>");
                                        strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "," + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                        strContentSFC.Append("</tr>");
                                        strContentSFC.Append("</table>");
                                    }
                                }

                            }

                            ////strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + strContentSFC.ToString() + "</td>");
                            ////SFC DETAIL//

                            foreach (var expClaim in lstD)
                            {

                                if (IRow > 0 && i != 0)
                                    strTblContent.Append("<tr  class='border_top'>");
                                else
                                    strTblContent.Append("<tr>");
                                i++;
                                if (IRow > 0)
                                {

                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + expClaim.DCR_Actual_Date + "</td>");
                                    string cate = "";
                                    string cateSet = "";
                                    string activity = "";
                                    string status = "";
                                    foreach (var cat in lstD)
                                    {
                                        if (cateSet != cat.DCR_Activity_Flag.ToString())
                                        {
                                            cateSet = cat.DCR_Activity_Flag.ToString();
                                            cate += cat.Category + "(" + cat.DCR_Activity_Flag + "),";
                                            activity += cat.DCR_Activity_Flag.ToString() == "F" ? "Field," : "Attendance,";
                                            status += cat.DCR_Status == "2" ? "Approved(" + cat.DCR_Activity_Flag.ToString() + ")," : cat.DCR_Status == "1" ?
                                                "Applied(" + cat.DCR_Activity_Flag.ToString() + ")," : cat.DCR_Status == "3" ?
                                                "Draft(" + cat.DCR_Activity_Flag.ToString() + ")," : "Unapproved(" + cat.DCR_Activity_Flag.ToString() + "),";
                                        }
                                    }
                                    status = status.TrimEnd(',');
                                    activity = activity.TrimEnd(',');
                                    cate = cate.TrimEnd(',');
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + cate + "</td>");

                                    string flag = string.Empty;

                                    //if (expClaim.DCR_Activity_Flag.ToString() == "F")
                                    //{
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + " '>" + activity + "</td>");
                                    // }
                                    //else if (expClaim.DCR_Activity_Flag.ToString() == "A")
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>Attendance</td>");
                                    //}
                                    //else
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>Leave</td>");
                                    //}


                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + expClaim.Doctor_Visit_Count + "</td>");
                                    //TP SFC details

                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'><a onclick=fnGetTPDetails('" + expClaim.DCR_Actual_Date + "')>TP Details</a></td>");

                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + strContentSFC.ToString() + "</td>");
                                    //strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'><a onclick='fnShowSFC(\"" + expClaim.DCR_Actual_Date + "\",\"" + favouringUserCode
                                    //    + "\",\"" + expClaim.DCR_Activity_Flag + "\");'>View</a></td>");
                                    strTblContent.Append("<td class='monthDcrHide'  rowspan='" + lstD.Count + "'>" + status + "</td>");
                                    //if (expClaim.DCR_Status.ToString() == "2")
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>Approved</td>");
                                    //}
                                    //else if (expClaim.DCR_Status.ToString() == "0")
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>UnApproved</td>");
                                    //}
                                    //else if (expClaim.DCR_Status.ToString() == "3")
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>Drafted</td>");
                                    //}
                                    //else
                                    //{
                                    //    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>Applied</td>");
                                    //}
                                }
                                IRow = 0;
                                strTblContent.Append("<td class='trlength' id='spnClaimExpTypeName_" + i + "'  Exp_Code='" + expClaim.Expense_Type_Name + "'>" + expClaim.Expense_Type_Name + "</td><input type='hidden' id='hdnClaimDetailCode_" + i + "' value='" +
                                        expClaim.Claim_Detail_Code + "'/>");
                                strTblContent.Append("<td class='tdAlignRight' id='spnClaimAmount_" + i + "'>" + expClaim.Expense_Amount + "</td>");

                                strTblContent.Append("<td>" + expClaim.Expense_Remarks + "</td>");


                                if (claimMoveOrder != "1")
                                {
                                    strTblContent.Append("<td class='tdAlignRight' id='spnpreviousDecAmount_" + i + "'>" + expClaim.Deduction_Amount + "</td>");
                                }
                                else
                                {
                                    strTblContent.Append("<td class='tdAlignRight' id='spnpreviousDecAmount_" + i + "'>0</td>");
                                }
                                string clsdeduction = "";
                                if (Convert.ToDouble(expClaim.Deduction_Amount) > 0)
                                {
                                    clsdeduction = "clsdeduction";
                                }
                                strTblContent.Append("<input type='hidden' value='" + expClaim.Bill_Number
                                        + "' class='form-control clsCheckSpecial' readonly='readonly' id='txtBillNumber_" + i + "' maxlength='100'/>");
                                if (deductiondetailsPriValue.ToUpper() == "YES")
                                {
                                    strTblContent.Append("<td class='tdAlignRight'><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' readonly class='form-control " + clsdeduction
                                        + "' value='" + 0 + "' id='txtDeduction_" + i + "' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' onblur='fnCalcItemWiseApprovedAmount(" + i + ");' /></td>");
                                }
                                else
                                {
                                    strTblContent.Append("<td class='tdAlignRight'><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' readonly class='form-control  " + clsdeduction
                                        + "' value='" + 0 + "' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' id='txtDeduction_" + i + "'/></td>");
                                }

                                string Expcount = "0";
                                List<MVCModels.ClaimExpenseTypeWiseHistory> lstHisCount = (List<MVCModels.ClaimExpenseTypeWiseHistory>)(lstClaimExpenseWiseHistory.Where(e => e.DCR_Actual_Date == distinctDate.DCR_Actual_Date && e.Expense_Type_Code == expClaim.Expense_Type_Code)).ToList();

                                if (lstHisCount != null && lstHisCount.Count > 0)
                                {
                                    Expcount = lstHisCount[0].History_Count;
                                }

                                if (Convert.ToInt32(Expcount) > 0)
                                {
                                    if (claimMoveOrder != "1")
                                    {
                                        strTblContent.Append("<td class='tdAlignRight' style='position:relative;text-align:center;'><span id='spnApproved_" + i + "'>"
                                            + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span><span style='position:absolute;top:0'>" + "(" + Convert.ToInt32(Expcount) + ")" + "</span></td>");
                                    }
                                    else
                                    {

                                        strTblContent.Append("<td class='tdAlignRight' style='position:relative;text-align:center;'><span id='spnApproved_" + i + "'>"
                                                + Convert.ToDouble(expClaim.Expense_Amount) + "</span><span style='position:absolute;top:0'>" + "(" + Convert.ToInt32(Expcount) + ")" + "</span></td>");
                                    }
                                }
                                else
                                {
                                    if (claimMoveOrder != "1")
                                    {
                                        strTblContent.Append("<td class='tdAlignRight' style='text-align:center;'><span id='spnApproved_" + i + "'>"
                                                + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span></td>");
                                    }
                                    else
                                    {
                                        strTblContent.Append("<td class='tdAlignRight' style='text-align:center;'><span id='spnApproved_" + i + "'>"
                                              + Convert.ToDouble(expClaim.Expense_Amount) + "</span></td>");
                                    }
                                }

                                strTblContent.Append("<input type='hidden' value='" + expClaim.Bill_Number
                                        + "' class='form-control clsCheckSpecial' readonly='readonly' id='txtBillNumber_" + i + "' maxlength='100'/>");
                                if (deductiondetailsPriValue.ToUpper() == "YES")
                                {
                                    //strTblContent.Append("<td style='width:12%'><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                    //    + "' id='txtAdminRemarks_" + i + "' maxlength='1000' readonly='readonly'/></td>");
                                    if(expClaim.Managers_Approval_Remark!=null)
                                    {
                                    if (expClaim.Managers_Approval_Remark.Length > 0)
                                    {
                                        strTblContent.Append("<td style='width:12%' class='td-a' onclick='fnRemarksByAdmin(\"" + expClaim.Managers_Approval_Remark + "\");'>Remarks</td>");
                                    }
                                    }
                                }
                                else
                                {
                                    if (expClaim.Managers_Approval_Remark.Length > 0)
                                    {
                                        strTblContent.Append("<td style='width:12%' class='td-a' onclick='fnRemarksByAdmin(\"" + expClaim.Managers_Approval_Remark + "\");'>Remarks</td>");
                                    }
                                    //strTblContent.Append("<td style='width:12%'><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                    //    + "' id='txtAdminRemarks_" + i + "' maxlength='1000' readonly='readonly'/></td>");
                                }
                                //strTblContent.Append("<td>" + expClaim.Remarks_By_User + "</td></tr>");
                            }
                        }
                    }
                    strTblContent.Append("</tbody></table>");
                    #endregion field expense claim details
                }
                else if (requestType.ToUpper() == "CUSTOMER WISE")
                {
                    #region DOCTOR CRM claim details
                    claimType = "REQUEST_CUSTOMER_FOR";
                    lstExpClaimDetails = objExpClaim.GetDoctorCRMClaimDetails(objCurInfo.GetCompanyCode(), claimCode);
                    strTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblDoctorCRM' class='table table-striped'><thead><tr>");
                    strTblContent.Append("<td>Customer Name</td><td>MDL/SVL No</td><td>Speciality</td><td>Amount</td>");
                    strTblContent.Append("<td>Deduction</td><td>Approved Amount</td>");
                    strTblContent.Append("<td>Present Contribution</td><td>Committed Contribution</td>");
                    strTblContent.Append("<td>Reference Details</td><td>Admin Remarks</td><td>User Remarks</td><td>Get Doctor & Product Details</td></tr></thead><tbody>");
                    if (lstExpClaimDetails != null)
                    {
                        int i = 0;
                        foreach (var expClaim in lstExpClaimDetails)
                        {
                            i++;
                            strTblContent.Append("<tr>");
                            strTblContent.Append("<td>" + expClaim.Customer_Name + "<input type='hidden' id='hdnClaimDetailCode_" + i + "' value='" +
                                expClaim.Claim_Detail_Code + "'/><input type='hidden' id='hdnCustomerCode_" + i + "' value='" +
                                expClaim.Customer_Code + "'/></td>");
                            strTblContent.Append("<td>" + expClaim.MDL_Number + "</td>");
                            strTblContent.Append("<td>" + expClaim.Speciality_Name + "</td>");
                            strTblContent.Append("<td class='tdAlignRight' id='spnClaimAmount_" + i + "'>" + expClaim.Expense_Amount + "</td>");
                            string clsdeduction = "";
                            if (Convert.ToDouble(expClaim.Deduction_Amount) > 0)
                            {
                                clsdeduction = "clsdeduction";
                            }
                            if (deductiondetailsPriValue.ToUpper() == "YES")
                            {
                                strTblContent.Append("<td class='tdAlignRight'><input type='text'  readonly='readonly' class='form-control  " + clsdeduction + "' value='" + expClaim.Deduction_Amount
                                    + "' id='txtDeduction_" + i + "' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' onblur='fnCalcItemWiseApprovedAmount(" + i + ");' /></td>");
                            }
                            else
                            {
                                strTblContent.Append("<td class='tdAlignRight'><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' readonly='readonly' class='form-control  " + clsdeduction + "' readonly=readonly value='"
                                    + expClaim.Deduction_Amount
                                    + "' id='txtDeduction_" + i + "'/></td>");
                            }
                            strTblContent.Append("<td class='tdAlignRight'><span id='spnApproved_" + i + "'>"
                            + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span></td>");
                            strTblContent.Append("<td>" + expClaim.Present_Contribution + "</td>");
                            strTblContent.Append("<td>" + expClaim.Potential_Contribution + "</td>");

                            strTblContent.Append("<td><input type='text' class='form-control clsCheckSpecial' value='"
                                + expClaim.Bill_Number + "' id='txtBillNumber_" + i + "' maxlength='100' readonly='readonly' style='background-color: #efefef!important;border: none ! important;outline: none ! important;'/></td>");
                            if (deductiondetailsPriValue.ToUpper() == "YES")
                            {
                                //strTblContent.Append("<td><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;' readonly='readonly' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                //    + "' id='txtAdminRemarks_" + i + "' maxlength='1000'/></td>");
                                if (expClaim.Managers_Approval_Remark.Length > 0)
                                {
                                    strTblContent.Append("<td  class='td-a' onclick='fnRemarksByAdmin(\"" + expClaim.Managers_Approval_Remark + "\");'>Remarks</td>");
                                }
                            }
                            else
                            {
                                //strTblContent.Append("<td><input type='text' style='background-color: #efefef!important;border: none ! important;outline: none ! important;'  readonly='readonly' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                //    + "' id='txtAdminRemarks_" + i + "' readonly='readonly' maxlength='1000'/></td>");
                                if (expClaim.Managers_Approval_Remark.Length > 0)
                                {
                                    strTblContent.Append("<td  class='td-a' onclick='fnRemarksByAdmin(\"" + expClaim.Managers_Approval_Remark + "\");'>Remarks</td>");
                                }
                            }
                            strTblContent.Append("<td>" + expClaim.Remarks_By_User + "</td>");
                            strTblContent.Append("<td> <input type='button' value='Get Details' onclick='fnGetDoctorDetails(" + expClaim.Customer_Code + ")' /></td>");
                        }
                    }
                    strTblContent.Append("</tbody></table>");
                    #endregion DOCTOR CRM claim details
                }
                else
                {

                }

                //if (requestName.ToUpper() == item.ToUpper())
                //{

                //    break;
                //}
                // }
                if (lstClaim != null)
                {
                    strHistory.Append("<table cellspacing=0 cellpadding=0 id='tblHistory' class='table table-striped'><thead><tr>");
                    strHistory.Append("<th>Status</th><th>Updated By</th><th>Updated Datetime</th></tr></thead><tbody>");
                    if (lstClaim[0].lstClaimHeaderHistory != null)
                    {
                        foreach (var history in lstClaim[0].lstClaimHeaderHistory)
                        {
                            strHistory.Append("<tr>");
                            strHistory.Append("<td>" + history.Status_Name + "</td>");
                            strHistory.Append("<td>" + history.Updated_By + "</td>");
                            strHistory.Append("<td>" + history.Updated_Date + "</td>");
                            strHistory.Append("</tr>");
                        }
                    }
                    strHistory.Append("</tbody></table>");

                    strExpenseTypeWiseDetail.Append("<table cellspacing=0 cellpadding=0 id='tblExpenseTypeWiseDetail' class='table table-striped'><thead><tr>");
                    strExpenseTypeWiseDetail.Append("<th>Expense Type NAme</th><th>Total Claimed Amount Rs.</th><th>Total Deducted Amount Rs.</th><th>Total Approved Amount Rs.</th></tr></thead>");
                    if (lstClaim[0].lstExpenseTypewiseDetail != null)
                    {
                        foreach (var expeseTypewise in lstClaim[0].lstExpenseTypewiseDetail)
                        {
                            strExpenseTypeWiseDetail.Append("<tr>");
                            strExpenseTypeWiseDetail.Append("<td>" + expeseTypewise.Expense_Type_Name + "</td>");
                            strExpenseTypeWiseDetail.Append("<td>" + expeseTypewise.Expense_Amount + "</td>");
                            strExpenseTypeWiseDetail.Append("<td>" + expeseTypewise.Total_Deduction + "</td>");
                            strExpenseTypeWiseDetail.Append("<td>" + expeseTypewise.Approved_Amount + "</td>");
                            strExpenseTypeWiseDetail.Append("</tr>");

                        }
                    }
                    strExpenseTypeWiseDetail.Append("</tbody></table>");
                }



            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strTblContent.ToString() + "$" + claimType + "$" + strHistory.ToString() + "$" + objJson.Serialize(lstClaim) + "$" + strExpenseTypeWiseDetail+"$"+ AddlStrTblContent.ToString();
        }
        public string GetExpenseClaimApprovalPopup(string userCode, string claimCode, int month, int year)
        {
            BL_ExpenseClaim _objBLClaim = new BL_ExpenseClaim();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimapproval = new List<MVCModels.ExpenseClaimApprovalModel>();
            List<MVCModels.ExpenseTypeclaimModel> lstExpenseTypes = new List<MVCModels.ExpenseTypeclaimModel>();
            List<MVCModels.ExpenseSFCModel> lstExpenseSFC = new List<MVCModels.ExpenseSFCModel>();
            List<MVCModels.ExpenseActivityModel> lstExpenseActivity = new List<MVCModels.ExpenseActivityModel>();
            StringBuilder strTbl = new StringBuilder();
            string exceed = string.Empty;
            double totalClaimeddays = 0;
            DateTime startDate = new DateTime(year, month, 1);
            DateTime endDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            List<MVCModels.ExpenseCalimHolidayList> expenseClaimHolidayList = _objBLClaim.GetExpenseClaimHolidayList(companyCode, userCode,
                                                    startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));
            List<MVCModels.ExpenseWeekendList> expenseWeekendList = _objBLClaim.GetExpenseClaimWeekendList(companyCode, userCode, startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));

            List<MVCModels.ExpenseClaimLockLeaveDetails> expenseLockLeaveList = _objBLClaim.GetExpenseClaimLockLeavelist(companyCode, userCode, startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));


            lstExpenseclaimapproval = _objBLClaim.GetExpenseClaimApproval(objCurInfo.GetCompanyCode(), claimCode, userCode, month, year).ToList();
            if (lstExpenseclaimapproval != null && lstExpenseclaimapproval.Count > 0)
            {
                lstExpenseTypes = lstExpenseclaimapproval[0].lstExpenseTypes;
                lstExpenseSFC = lstExpenseclaimapproval[0].lstExpenseSFC;
                lstExpenseActivity = lstExpenseclaimapproval[0].lstExpenseActivity;
                // Claim
                if (expenseClaimHolidayList != null && expenseClaimHolidayList.Count > 0)
                {
                    lstExpenseActivity[0].Holiday_Count = expenseClaimHolidayList.Count;
                    strTbl.Append(GetHolidayDate(expenseClaimHolidayList));
                }
                else
                {
                    lstExpenseActivity[0].Holiday_Count = 0;
                }

                // // Weekend Count Update.
                if (expenseWeekendList != null && expenseWeekendList.Count > 0)
                {
                    lstExpenseActivity[0].WeekEnd_Count = expenseWeekendList.Count;
                    strTbl.Append(GetWeekendDate(expenseWeekendList));
                }
                else
                {
                    lstExpenseActivity[0].WeekEnd_Count = 0;
                }

                // Lock Leave Count Update.
                if (expenseLockLeaveList != null && expenseLockLeaveList.Count > 0)
                {
                    lstExpenseActivity[0].LockLeave_Count = expenseLockLeaveList.Count;
                }
                else
                {
                    lstExpenseActivity[0].LockLeave_Count = 0;
                }

                #region - Expense
                strTbl.Append("<div style='font-style: italic;color: red;font-weight: 700;'>*Those SFC alone will be displayed, which is been used in above applicable DCRs</div>");
                strTbl.Append("<table WIDTH='75%' id='tblsummaryforSFC' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<td>From Place</td><td>To Place</td><td>Category</td><td>Distance</td><td>SFC Version No</td><td>SFC Visit Count</td>");
                strTbl.Append("<td>Actual Visit Count</td><td>Trend</td>");
                strTbl.Append("</tr></thead>");
                strTbl.Append("<tbody>");
                if (lstExpenseSFC != null && lstExpenseSFC.Count > 0)
                {
                    foreach (var sfc in lstExpenseSFC)
                    {
                        exceed = "";
                        strTbl.Append("<tr>");
                        //From Place
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.From_Place);
                        strTbl.Append("</td>");
                        //To place
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.To_Place);
                        strTbl.Append("</td>");
                        //Category
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.Category);
                        strTbl.Append("</td>");
                        // Distance
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.Distance);
                        strTbl.Append("</td>");
                        // Distance
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.SFC_Version_No);
                        strTbl.Append("</td>");
                        //SFC Visit count
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.SFC_Visit_Count);
                        strTbl.Append("</td>");
                        //Actual visit count
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.Actual_Visit_Count);
                        strTbl.Append("</td>");
                        //Trend
                        if (sfc.SFC_Visit_Count == sfc.Actual_Visit_Count)
                        {
                            exceed = "Equal";
                        }
                        else if (sfc.SFC_Visit_Count < sfc.Actual_Visit_Count)
                        {
                            exceed = "Exceed";
                        }
                        else if (sfc.SFC_Visit_Count > sfc.Actual_Visit_Count)
                        {
                            exceed = "Less";
                        }
                        strTbl.Append("<td>");
                        strTbl.Append(exceed);
                        strTbl.Append("</td>");

                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("<tr><td colspan='7'>No SFC Details Found</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                #endregion - Expense
                strTbl.Append("<br/>");
                #region - Activity
                if (lstExpenseclaimapproval != null && lstExpenseclaimapproval.Count > 0)
                    foreach (var activity in lstExpenseActivity)
                    {
                        //Field
                        if (activity.Field_Count > 0)
                            strTbl.Append(GetFieldDate(lstExpenseclaimapproval));
                        //Field
                        if (activity.Attendance_Count > 0)
                            strTbl.Append(GetAttendanceDate(lstExpenseclaimapproval));
                        if (activity.Leave_CountWithOutLOP > 0)
                            strTbl.Append(GetLeavDaysExceptLOP(lstExpenseclaimapproval));
                        DateTime[] allDCRDate = GetAllDCRDates(expenseWeekendList, expenseClaimHolidayList, lstExpenseclaimapproval);
                        strTbl.Append(GetNonEnteredDate(year, month, allDCRDate));
                        strTbl.Append(GetTotalClaimDate(allDCRDate));
                    }

                strTbl.Append("<div style='font-style: italic;color: red;font-weight: 700;'>*Total Num. of Applicable Days: Num. of Weekend Off+Num. Of Holidays+Num. Of Field Days+Num. Of Attendence Days+Num. Of Leave Days except(LOP)");
                strTbl.Append("Non Entered Days are(Lock Days,Leave DCRs with LOP,Unapproved/Applied DCRs,Blank DCRs etc..)</div>");
                strTbl.Append("<table WIDTH='75%' id='tblsummaryforAtivty' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<td>Total Num of Days</td><td>Num of Weekend Off</td><td>Num of Holidays</td><td>Num of Fields</td>");
                strTbl.Append("<td>Num of Attendance days</td><td>Num of Leave days(Except LOP)</td><td>Non entered days</td><td>Total Num of applicable days for claim</td></tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstExpenseActivity != null && lstExpenseActivity.Count > 0)
                {
                    foreach (var activity in lstExpenseActivity)
                    {
                        strTbl.Append("<tr>");
                        //Total Num of days
                        strTbl.Append("<td>");
                        strTbl.Append(activity.Totaldays);
                        strTbl.Append("</td>");
                        //Num of weekend off
                        if (activity.WeekEnd_Count > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divWeekEnd')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(activity.WeekEnd_Count);
                        strTbl.Append("</a></td>");
                        //Num of Holidays
                        if (activity.Holiday_Count > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divHolidayDate')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(activity.Holiday_Count);
                        strTbl.Append("</td>");
                        //Field
                        if (activity.Field_Count > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divFieldDate')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(activity.Field_Count);
                        strTbl.Append("</td>");
                        //Num of Attendace 
                        if (activity.Attendance_Count > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divAttDate')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(activity.Attendance_Count);
                        strTbl.Append("</td>");
                        //Num of Leave days
                        if (activity.Leave_CountWithOutLOP > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divLeavDaysExceptLOP')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(activity.Leave_CountWithOutLOP);
                        strTbl.Append("</td>");
                        totalClaimeddays = activity.WeekEnd_Count + activity.Holiday_Count + activity.Field_Count + activity.Attendance_Count + activity.Leave_CountWithOutLOP;
                        double nonEnteredDays = activity.Totaldays - totalClaimeddays;
                        //No of entered days
                        if (nonEnteredDays > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divnonEnteredDate')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(nonEnteredDays.ToString());
                        strTbl.Append("</td>");
                        //Total num of applicable days
                        if (totalClaimeddays > 0)
                            strTbl.Append("<td> <a herf='#' onclick=fnPopUpOpen('divTotalClaimDate')>");
                        else
                            strTbl.Append("<td>");
                        strTbl.Append(totalClaimeddays.ToString());
                        strTbl.Append("</td>");
                        totalNoofappdaysforclaim_g = 0;
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("<tr><td colspan='8'>No Details found.</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                #endregion - Activity
                strTbl.Append("<br/>");
                #region - ExpenseTypes
                strTbl.Append("<div style='font-style: italic;color: red;font-weight: 700;'>*Eligible Amount as per Num. of applicable days:(Eligible Amount Rs./Total Num. of Days in month)*Num. of Applicable Days</div>");
                strTbl.Append("<table WIDTH='75%' id='tblsummaryforSFC' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<td>Expense Type Name</td><td>Expense Mode</td><td>Eligibility Amount for the month Rs.</td>");
                strTbl.Append("<td>Claimed Amount Rs</td><td>Eligible Amount as per num of applicable days</td>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstExpenseTypes != null && lstExpenseTypes.Count > 0)
                {
                    foreach (var expense in lstExpenseTypes)
                    {
                        strTbl.Append("<tr>");
                        //Expense Type Name
                        strTbl.Append("<td>");
                        strTbl.Append(expense.Expense_Type_Name);
                        strTbl.Append("</td>");
                        //Expense Mode
                        strTbl.Append("<td>");
                        strTbl.Append(expense.Expense_Mode);
                        strTbl.Append("</td>");
                        //Eligibility amount
                        strTbl.Append("<td>");
                        strTbl.Append(expense.Eligibility_Amount);
                        strTbl.Append("</td>");
                        //Approved amount
                        strTbl.Append("<td>");
                        strTbl.Append(expense.Approved_Amount);
                        strTbl.Append("</td>");
                        //Eligibility amount as per days
                        double eligibleAmount = (expense.Eligibility_Amount / Convert.ToDouble(lstExpenseActivity[0].Totaldays)) * totalClaimeddays;
                        strTbl.Append("<td>");
                        strTbl.Append(eligibleAmount.ToString("0.00"));
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("<tr><td colspan='5'>No expense details found.</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("<table>");
                #endregion - ExpenseTypes
            }
            return strTbl.ToString();
        }
        public string GetFieldDate(List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimapproval)
        {
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divFieldDate' >");
            strWEDates.Append("<div style='height:500px;'>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divFieldDate').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Field Days</p></div>");
            strWEDates.Append("<table class='table table-striped tblpopup'>");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");

            foreach (var item in lstExpenseclaimapproval[0].lsFieldDates)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }
        public string GetAttendanceDate(List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimapproval)
        {
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divAttDate' >");
            strWEDates.Append("<div style='height:500px;>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divAttDate').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Attendance days</p></div>");
            strWEDates.Append("<table class='table table-striped tblpopup'>");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in lstExpenseclaimapproval[0].lsAttendanceDates)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }
        public string GetLeavDaysExceptLOP(List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimapproval)
        {
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divLeavDaysExceptLOP' >");
            strWEDates.Append("<div style='height:500px;'>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divLeavDaysExceptLOP').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Num of Leave Days</p></div>");
            strWEDates.Append("<table class='table table-striped tblpopup'>");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in lstExpenseclaimapproval[0].lsLeavDaysExceptLOP)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item.DCR_Actual_Date).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }
        public string GetNonEnteredDate(int year, int month, DateTime[] allDCRDate)
        {
            var monthDates = GetMonthDates(year, month);
            var missing = monthDates.Except(allDCRDate);
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divnonEnteredDate' >");
            strWEDates.Append("<div style='height:500px;'>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divnonEnteredDate').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Non Entered Days</p></div>");
            strWEDates.Append("<table class='table table-striped  tblpopup' >");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in missing)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }
        public string GetTotalClaimDate(DateTime[] allDCRDate)
        {
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divTotalClaimDate' >");
            strWEDates.Append("<div style='height:500px;'>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divTotalClaimDate').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Total Num of applicable days for claim</p></div>");
            strWEDates.Append("<table class='table table-striped tblpopup'>");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in allDCRDate)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }
        public DateTime[] GetAllDCRDates(List<MVCModels.ExpenseWeekendList> expenseWeekendList, List<MVCModels.ExpenseCalimHolidayList> expenseClaimHolidayList, List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimapproval)
        {
            var lsAllDCRDate = new List<MVCModels.DCRUserExpenseDetails>();
            //Week End
            foreach (var item in expenseWeekendList)
            {
                lsAllDCRDate.Add(new MVCModels.DCRUserExpenseDetails { DCR_Actual_Date = item.Date });
            }
            //Holiday
            foreach (var item in expenseClaimHolidayList)
            {
                lsAllDCRDate.Add(new MVCModels.DCRUserExpenseDetails { DCR_Actual_Date = item.Holiday_Date });
            }
            //Field
            foreach (var item in lstExpenseclaimapproval[0].lsFieldDates)
            {
                lsAllDCRDate.Add(new MVCModels.DCRUserExpenseDetails { DCR_Actual_Date = item.DCR_Actual_Date });
            }
            //Attendance days
            foreach (var item in lstExpenseclaimapproval[0].lsAttendanceDates)
            {
                lsAllDCRDate.Add(new MVCModels.DCRUserExpenseDetails { DCR_Actual_Date = item.DCR_Actual_Date });
            }
            //Num of Leave days(Except LOP)
            foreach (var item in lstExpenseclaimapproval[0].lsLeavDaysExceptLOP)
            {
                lsAllDCRDate.Add(new MVCModels.DCRUserExpenseDetails { DCR_Actual_Date = item.DCR_Actual_Date });
            }
            DateTime[] dcrDate = new DateTime[lsAllDCRDate.Count];
            int inc = 0;
            foreach (var item in lsAllDCRDate)
            {
                dcrDate[inc] = Convert.ToDateTime(item.DCR_Actual_Date);
                inc++;
            }
            Array.Sort<DateTime>(dcrDate);
            return dcrDate.Distinct().ToArray();
        }
        public List<DateTime> GetMonthDates(int year, int month)
        {
            return Enumerable.Range(1, DateTime.DaysInMonth(year, month))  // Days: 1, 2 ... 31 etc.
                             .Select(day => new DateTime(year, month, day)) // Map each day to a date
                             .ToList(); // Load dates into a list
        }
        public string GetHolidayDate(List<MVCModels.ExpenseCalimHolidayList> expenseClaimHolidayList)
        {
            var strHolidayDates = new StringBuilder();
            strHolidayDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divHolidayDate' >");
            strHolidayDates.Append("<div style='height:500px;'>");
            strHolidayDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divHolidayDate').overlay().close();></a>");
            strHolidayDates.Append("<div class='divHeader'><p>Holidays</p></div>");
            strHolidayDates.Append("<table class='table table-striped tblpopup'>");
            strHolidayDates.Append("<thead><tr class='tblpopuptr'><td  class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strHolidayDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in expenseClaimHolidayList)
            {
                strHolidayDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item.Holiday_Date).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item.Holiday_Date).ToString("dddd") + "</td></tr>");
            }
            strHolidayDates.Append("</tbody></table></div></div>");
            return strHolidayDates.ToString();
        }
        public string GetWeekendDate(List<MVCModels.ExpenseWeekendList> expenseWeekendList)
        {
            var strWEDates = new StringBuilder();
            strWEDates.Append("<div style='display:none;' class='simple_overlay holidaytablewidth' id='divWeekEnd' >");
            strWEDates.Append("<div style='height:500px;'>");
            strWEDates.Append("<a class='close'></a><a class='overlayclose' onclick=$('#divWeekEnd').overlay().close();></a>");
            strWEDates.Append("<div class='divHeader'><p>Week End Days </p></div>");
            strWEDates.Append("<table class='table table-striped tblpopup'>");
            strWEDates.Append("<thead><tr class='tblpopuptr'><td  class='tblpopuptd' style='border-top: none !important;'><b>Date</b></td><td class='tblpopuptd' style='border-top: none !important;'><b>Day</b></td></tr></thead>");
            strWEDates.Append("<tbody class='tblpopuptbody'>");
            foreach (var item in expenseWeekendList)
            {
                strWEDates.Append("<tr class='tblpopuptr'><td class='tblpopuptd'>" + Convert.ToDateTime(item.Date).ToString("dd MMM yyyy") + "</td><td class='tblpopuptd'>" + Convert.ToDateTime(item.Date).ToString("dddd") + "</td></tr>");
            }
            strWEDates.Append("</tbody></table></div></div>");
            return strWEDates.ToString();
        }

        public string GetExpenseClaimDeductionDetailPopUp(string claimCode, string userCode)
        {
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExpDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>();
                List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel> lstExpOtherDecudtion = new List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>();

                BLUser _objUser = new BLUser();
                BLExpense _objExp = new BLExpense();
                StringBuilder sbTbl = new StringBuilder();

                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)(_objUser.GetSingleUserInfo(_objcurrentInfo.GetCompanyCode(), userCode, "")).ToList();
                lstExpDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(_objExp.GetExpenseClaimDeductionDetailPopUpOld(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();
                lstExpOtherDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>)(_objExp.GetOtherDecductionAmount(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();
                #region User Details
                if (lstUser != null && lstUser.Count > 0)
                {
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeductionUser' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<tbody>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>User Name : </b>" + lstUser[0].User_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Name : </b>" + lstUser[0].Employee_Name + "</td>");
                    sbTbl.Append("<td><b>Territory Name : </b>" + lstUser[0].Region_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Division : </b>" + lstUser[0].Division_Name + "</td>");
                    sbTbl.Append("<td><b>Employee Number : </b>" + lstUser[0].Employee_Number + "</td>");
                    sbTbl.Append("<td><b>Reporting Manager : </b>" + lstUser[0].Reporting_Manager_Name + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>PAN : </b>" + lstUser[0].PAN_Number + "</td>");
                    sbTbl.Append("<td><b>PF No : </b>" + lstUser[0].PF_Number + "</td>");
                    sbTbl.Append("<td><b>Account Number : </b>" + lstUser[0].Acc_No + "</td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><b>Phone Number : </b>" + lstUser[0].User_Mobile_Number + "</td>");
                    sbTbl.Append("<td><b>Claim Code : </b>" + claimCode + "</td>");
                    sbTbl.Append("<td><b>OtherDeduction : </b>" + lstExpOtherDecudtion[0].Other_Deduction + "</td>");
                    sbTbl.Append("<td></td>");
                    sbTbl.Append("</tr>");

                    sbTbl.Append("</tbody></table></div>");
                    popupuserCode = lstExpDecudtion[0].Favouring_User_Code;
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No User Details found</div>");
                }
                #endregion User Details

                #region Report
                if (lstExpDecudtion != null && lstExpDecudtion.Count > 0)
                {
                    int maxVersionNumber = lstExpDecudtion.Select(x => x.Version_Number).Max();

                    string rowSpn = string.Empty;
                    sbTbl.Append("<div class='col-lg-12 table-responsive'><table class='table' id='tblClaimDeduction' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead><tr>");
                    sbTbl.Append("<th rowspan='2'>DCR Date</th>");
                    sbTbl.Append("<th rowspan='2'>Work Category</th>");
                    sbTbl.Append("<th rowspan='2'>Activity</th>");
                    //sbTbl.Append("<th rowspan='2'>Num. of Doctors Visited</th>");
                    sbTbl.Append("<th rowspan='2'>SFC Details</th>");
                    sbTbl.Append("<th rowspan='2'>Expense Type</th>");
                    sbTbl.Append("<th rowspan='2' style='border-right: 1px solid #fff;'>Claim Amount(Rs.)</th>");

                    int level = 1;
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th colspan='6' style='border-right: 1px solid #fff;'>Action Level" + level + "</th>");
                        level++;
                    }

                    sbTbl.Append("</tr>");


                    sbTbl.Append("<tr>");
                    for (int e = maxVersionNumber; e > 0; e--)
                    {
                        sbTbl.Append("<th>Status</th>");
                        sbTbl.Append("<th>Previous Deduction(Rs.)</th>");
                        sbTbl.Append("<th>Current Deduction(Rs.)</th>");
                        sbTbl.Append("<th>Approved Amount (Rs.)</th>");
                        sbTbl.Append("<th>Remarks</th>");
                        sbTbl.Append("<th style='border-right: 1px solid #fff;'>Modified By</th>");
                    }
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody style='background: #BDBDBD'>");
                    // get distinct expense type name WITH DATE
                    var lstDistExpenseType = lstExpDecudtion.Select(x => new { x.Expense_Type_Code, x.DCR_Actual_Date }).Distinct().ToList();
                    var flags = lstExpDecudtion.Select(x => new { x.DCR_Activity_Flag, x.DCR_Actual_Date }).Distinct().ToList();
                    var lstDistDate = lstExpDecudtion.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();
                    int IRow = 0;
                    var lstDistExpeseTypeDate = lstExpDecudtion.Select(x => new { x.DCR_Actual_Date, x.Expense_Type_Code }).Distinct().ToList();
                    BL_ExpenseClaim objClaim = new BL_ExpenseClaim();
                    DataSet ds = new DataSet();
                    foreach (var item in lstDistDate)
                    {
                        List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstD = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(e => e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
                        var lstExpeseTypeDate = lstD.Select(x => new { x.Expense_Type_Code }).Distinct().ToList();
                        IRow = lstExpeseTypeDate.Count;
                        foreach (var date in lstDistExpenseType)
                        {
                            if (date.DCR_Actual_Date == item.DCR_Actual_Date)
                            {
                                StringBuilder strContentSFCS = new StringBuilder();
                                StringBuilder SFCCat = new StringBuilder();
                                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lst = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(e => e.Expense_Type_Code == date.Expense_Type_Code && e.DCR_Actual_Date == item.DCR_Actual_Date)).ToList();
                                string dcrDateSFC = item.DCR_Actual_Date.Split('-')[2] + "-" + item.DCR_Actual_Date.Split('-')[1] + "-" + item.DCR_Actual_Date.Split('-')[0];
                                ds = objClaim.GetDCRSFCDetails(_objcurrentInfo.GetCompanyCode(), popupuserCode, dcrDateSFC, lst[0].DCR_Activity_Flag.ToString());

                                if (ds.Tables.Count > 1)
                                {
                                    //SFC Details
                                    string cate = string.Empty;
                                    if (ds.Tables[1].Rows.Count > 0)
                                    {
                                        string catSet = "";
                                        foreach (DataRow dr in ds.Tables[1].Rows)
                                        {

                                            strContentSFCS.Append("<table>");
                                            strContentSFCS.Append("<tr>");
                                            strContentSFCS.Append("<td>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "</td>");
                                            strContentSFCS.Append("</tr>");
                                            strContentSFCS.Append("</table>");

                                            if (catSet != dr["Flag"].ToString())
                                            {
                                                catSet = dr["Flag"].ToString();
                                                cate += dr["Category"].ToString();
                                            }

                                        }

                                        SFCCat.Append("<table>");
                                        SFCCat.Append("<tr>");
                                        SFCCat.Append("<td>" + cate + "</td>");
                                        SFCCat.Append("</tr>");
                                        SFCCat.Append("</table>");

                                    }
                                    else
                                    {
                                        foreach (DataRow dr in ds.Tables[0].Rows)
                                        {
                                            strContentSFCS.Append("<table>");
                                            strContentSFCS.Append("<tr>");
                                            strContentSFCS.Append("<td>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "</td>");
                                            strContentSFCS.Append("</tr>");
                                            strContentSFCS.Append("</table>");
                                            cate += dr["Category"].ToString();
                                        }
                                        SFCCat.Append("<table>");
                                        SFCCat.Append("<tr>");
                                        SFCCat.Append("<td>" + cate + "</td>");
                                        SFCCat.Append("</tr>");
                                        SFCCat.Append("</table>");
                                    }

                                }


                                //SFC Details
                                sbTbl.Append("<tr>");
                                if (IRow > 0)
                                {
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].DCR_Date + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + SFCCat.ToString() + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>");
                                    string activity = "";
                                    var dayFlags = flags.Where(f => f.DCR_Actual_Date == item.DCR_Actual_Date).ToList();
                                    foreach (var flag in dayFlags)
                                    {
                                        activity += flag.DCR_Activity_Flag.ToString() == "A" ? "Attendance," : "Field,";
                                    }
                                    activity = activity.TrimEnd(',');
                                    sbTbl.Append(activity + "</td>");
                                    // sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].Doctor_Visit_Count + "</td>");
                                    sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + strContentSFCS.ToString() + "</td>");
                                    // sbTbl.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + lst[0].Status_Name + "</td>");
                                }

                                IRow = 0;
                                sbTbl.Append("<td>" + lst[0].Expense_Type_Name + "</td>");

                                var s1 = lst.GroupBy(g => new { g.Expense_Amount, g.Expense_Type_Name }).
                                    Select(group => new { group.Key.Expense_Amount, group.Key.Expense_Type_Name, TotalAmount = group.Sum(a => a.Expense_Amount) }).ToList();
                                double totalAmount = 0;
                                foreach (var s in s1)
                                {
                                    totalAmount += s.Expense_Amount;
                                }

                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + totalAmount + "</td>");

                                int levl = 1;
                                for (int e = maxVersionNumber; e > 0; e--)
                                {
                                    List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstCurVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == levl)).ToList();
                                    List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstPrevVersion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>)(lstExpDecudtion.Where(a => a.DCR_Actual_Date == lst[0].DCR_Actual_Date && a.DCR_Activity_Flag == lst[0].DCR_Activity_Flag && a.Expense_Type_Code == lst[0].Expense_Type_Code && a.Version_Number == (levl - 1))).ToList();
                                    if (lstCurVersion != null && lstCurVersion.Count > 0)
                                    {
                                        double previousDeduction = 0.0;
                                        if (levl > 2 && lstPrevVersion != null && lstPrevVersion.Count > 0)
                                        {
                                            // replace the below code to get the previous ded
                                            //previousDeduction = (lstPrevVersion[0].Expense_Amount - lstPrevVersion[0].Approved_Amount);
                                            if (lstPrevVersion[0].Approved_Amount != 0)
                                            {
                                                previousDeduction = (lstPrevVersion[0].Expense_Amount - lstPrevVersion[0].Approved_Amount);
                                            }
                                            else
                                            {
                                                previousDeduction = 0;
                                            }
                                        }

                                        if (lstPrevVersion != null && lstPrevVersion.Count > 0)
                                        {

                                            sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                            if (lstCurVersion[0].Order_No != 1)
                                            {
                                                sbTbl.Append("<td>" + previousDeduction + "</td>");
                                                sbTbl.Append("<td>" + ((lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount) - previousDeduction).ToString() + "</td>");
                                                sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                            }

                                            if (lstCurVersion[0].Order_No == 1)
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                            }
                                            sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                        }
                                        else
                                        {

                                            if (levl == 1)
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                sbTbl.Append("<td>0</td>");
                                                if (lstCurVersion[0].Order_No == 1)
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                                }
                                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                            }
                                            else
                                            {
                                                sbTbl.Append("<td>" + lstCurVersion[0].Status_Name + "</td>");
                                                sbTbl.Append("<td>" + previousDeduction + "</td>");
                                                sbTbl.Append("<td>" + (lstCurVersion[0].Expense_Amount - lstCurVersion[0].Approved_Amount).ToString() + "</td>");
                                                sbTbl.Append("<td>" + lstCurVersion[0].Approved_Amount + "</td>");

                                                if (lstCurVersion[0].Order_No == 1)
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Remarks_By_User + "</td>");
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>" + lstCurVersion[0].Managers_Approval_Remark + "</td>");
                                                }
                                                sbTbl.Append("<td style='border-right: 1px solid #fff;'>" + lstCurVersion[0].Updated_By + "</td>");
                                            }
                                        }
                                    }
                                    else
                                    {

                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td>-</td>");
                                        sbTbl.Append("<td style='border-right: 1px solid #fff;'>-</td>");
                                    }
                                    levl++;
                                }
                                sbTbl.Append("</tr>");
                            }

                        }
                    }
                    //  lstExpOtherDecudtion = (List<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>)(_objExp.GetOtherDecductionAmount(_objcurrentInfo.GetCompanyCode(), claimCode)).ToList();
                    // sbTbl.Append("<tr><td style='font-weight:bold;'>OtherDeduction</td><td>" + lstExpOtherDecudtion[0].Other_Deduction + "</td></tr>");
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Expense Claim Deduction Details found</div>");
                }
                #endregion Report

                return sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message.ToString();
            }
        }
        public string GetDoctorVisitAccName(string dcr_date, string user_code, string doctor_Visit_Code, string company_Code, string type)
        {
            var lstAcc = new List<DoctorACCNameDetails>();
            var objReport = new BL_Report();
            lstAcc = objReport.GetDoctorVisitAccName(dcr_date, user_code, doctor_Visit_Code, "", type);
            StringBuilder strTbl = new StringBuilder();
            strTbl.Append("<table class='table table-striped  col-lg-12' id='AccompanistsDetails'><thead><tr><th style='text-align: center;'>S.No</th><th style='text-align: center;'>Accompanists for " + dcr_date + "</th></tr></thead><tbody>");
            var count = 1;
            foreach (var item in lstAcc)
            {
                strTbl.Append("<tr style='text-align: center;'>");
                strTbl.Append("<td>" + count + "</td>");
                strTbl.Append("<td>" + item.Acc_user_name + "</td>");
                strTbl.Append("</tr>");
                count++;
            }
            strTbl.Append("</tbody></table>");
            return strTbl.ToString();
        }

        public ActionResult DoctorChemistMetMongoReport(string companyCode, string userCode, string startDate, string endDate)
        {
            ViewBag.CompanyCode = companyCode;
            ViewBag.UserCode = userCode;
            ViewBag.StartDate = startDate;
            ViewBag.EndDate = endDate;
            return View();
        }
        public JsonResult GetCMEProductDetails(string DCR_Code,int DCR_Attendance_Doctor_Id,int CME_Id)
        {
            List<DCRCMEDetails> lst = new List<DCRCMEDetails>();
            var objReport = new BL_Report();
            lst = objReport.GetCMEProductDetails(DCR_Code, DCR_Attendance_Doctor_Id, CME_Id);
            return Json(lst,JsonRequestBehavior.AllowGet);
        }

    }
}



