using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    public class MobileReportsController : Controller
    {
        //
        // GET: /MobileReports/
        #region Private variales
        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.SPData objSP = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        #endregion

        string DOCTOR_CAPTION;
        string CHEMIST_CAPTION;
        string STOCKIEST_CAPTION;
        public string GetPrivillegeValue()
        {
            DOCTOR_CAPTION = objCurr.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");
            if (DOCTOR_CAPTION.Length >= 21)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(20) + "...";

            }
            CHEMIST_CAPTION = objCurr.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            if (CHEMIST_CAPTION.Length >= 21)
            {
                CHEMIST_CAPTION = CHEMIST_CAPTION.Remove(20) + "...";

            }
            STOCKIEST_CAPTION = objCurr.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 21)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(20) + "...";

            }
            return DOCTOR_CAPTION;
        }
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /MobileReports/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /MobileReports/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /MobileReports/Create

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
        // GET: /MobileReports/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /MobileReports/Edit/5

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
        // GET: /MobileReports/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /MobileReports/Delete/5

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



        public ActionResult ReportsHome()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("ReportsHome.Mobile");
            }
            else
            {
                return View();
            }
        }

        public ActionResult TPHeader(string userCode)
        {
            ViewBag.User_Code = userCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("TPHeader.Mobile");
            }
            else
            {
                return View();
            }
        }


        public ActionResult TPDetails(string tpId, string userCode)
        {
            ViewBag.TP_Date = tpId;
            ViewBag.User_Code = userCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("TPDetails.Mobile");
            }
            else
            {
                ViewBag.TP_Date = tpId;
                return View();
            }
        }
        public ActionResult Doctor360(string doctorCode)
        {
            ViewBag.DoctorCode = doctorCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Doctor360.Mobile");
            }
            else
            {
                return View();
            }
        }
        public ActionResult ActivitySummaryHeader(string userCode)
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {

                ViewBag.User_Code = userCode;
                return View("ActivitySummaryHeader.Mobile");
            }
            else
            {
                ViewBag.User_Code = userCode;
                return View();
            }
        }
        public ActionResult ActivitySummaryDetail(string userDetails)
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                ViewBag.UserDetails = userDetails;
                return View("ActivitySummaryDetail.Mobile");
            }
            else
            {
                ViewBag.UserDetails = userDetails;
                return View();
            }
        }

        public ActionResult UserPerDayReort(string userCode, string userName)
        {
            GetPrivillegeValue();
            string doctor_caption = DOCTOR_CAPTION;
            string chemist_caption = CHEMIST_CAPTION;
            string stockist_caption = STOCKIEST_CAPTION;
            ViewBag.doctor_caption = doctor_caption;
            ViewBag.chemist_caption = chemist_caption;
            ViewBag.stockist_caption = stockist_caption;
            if (userCode == "Mine")
            {
                ViewBag.User_Code = objCurr.GetUserCode();
                ViewBag.User_Name = objCurr.GetUserName();
            }
            else
            {
                ViewBag.User_Code = userCode;
                ViewBag.User_Name = userName;
            }
            string privilegeValue = "";
            //privilegeValue = objSP.GetSinglePrivilegeNameForUser(objCurr.GetCompanyCode(), userCode, "DCR_ENTRY_OPTIONS");
            if (privilegeValue == "")
            {
                ViewBag.flagValue = "Attendance,Field,Leave,Field_RCPA";
            }
            else
            {
                ViewBag.flagValue = privilegeValue;
            }

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("UserPerDayReort.Mobile");
            }
            else
            {
                return View();
            }
        }

        public JsonResult GetTPHeader(string userCode)
        {
            if (userCode.ToUpper() == "MINE")
            {
                userCode = objCurr.GetUserCode();
            }

            DataSet dsTpHeader = new DataSet();
            objData.OpenConnection(objCurr.GetCompanyCode());
            {
                dsTpHeader = objData.ExecuteDataSet("exec SP_mhdGetTPReport '" + objCurr.GetCompanyCode() + "','" + userCode + "'");
            }
            objData.CloseConnection();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(dsTpHeader));
        }

        public JsonResult GetDoctor360Details(string doctorCode)
        {
            DataSet dsTpHeader = new DataSet();
            string userCode = doctorCode.Split('_')[1].ToString();
            string regionCode = doctorCode.Split('_')[0].ToString();
            string customerCode = doctorCode.Split('_')[2].ToString();
            objData.OpenConnection(objCurr.GetCompanyCode());
            {
                dsTpHeader = objData.ExecuteDataSet("exec SP_hdGetDoctor360Details '" + objCurr.GetCompanyCode() + "','" + customerCode + "','"
                    + regionCode + "','" + userCode + "'");
            }
            objData.CloseConnection();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(dsTpHeader));
        }
        public JsonResult GetChildUserDetails(FormCollection collection)
        {
            string userName = collection["userName"].ToString();
            DataSet dsChildUsers = new DataSet();
            dsChildUsers = objSP.dsChildUserSearch(objCurr.GetCompanyCode(), objCurr.GetUserCode(), userName);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(dsChildUsers));
        }

        public string GetActivitySummarReport(FormCollection collection)
        {

            string userCode = collection["userCode"].ToString();
            if (userCode.ToUpper() == "MINE")
            {
                userCode = objCurr.GetUserCode();
            }

            DataSet ds = new DataSet();
            ds = objSP.GetActivitySummarReport(objCurr.GetCompanyCode(), userCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return GetActivitySummarReportTable(ds);
        }
        public string GetActivitySummarReportTable(DataSet ds)
        {
            StringBuilder sbTableContent = new StringBuilder();
            StringBuilder sbTableMissed = new StringBuilder();
            StringBuilder sbTableVisitMissed = new StringBuilder();
            DataRow[] dr;
            int fieldDays = 0;
            int doctorVisitCount = 0;
            int doctorCount = 0;
            int doctorVisit = 0;
            double doctorVisitAvg = 0.0;
            DataTable DetailsTable = ds.Tables[3];

            sbTableContent.Append("<div class='dvWidth'>");
            sbTableContent.Append("<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>");
            sbTableContent.Append("<h3 class='ui-title' role='heading' aria-level='1'>" + ds.Tables[0].Rows[0]["User_Name"].ToString() + " - " + ds.Tables[0].Rows[0]["User_Type_Name"].ToString() + "</h3></div>");
            sbTableContent.Append("<div class='dvWidth'></br>"); ;

            //previous-month  Details

            sbTableContent.Append("<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>");
            sbTableContent.Append("<h3 class='ui-title' role='heading' aria-level='1'> Month of " + DateTime.Now.AddMonths(-1).ToString("MMMM") + "-" + DateTime.Now.AddMonths(-1).Year.ToString() + "</h3></div>");
            sbTableContent.Append("<div class='dvWidth'></br>");

            // Field Days Count
            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Total Field Days in Month</div>");
            dr = ds.Tables[2].Select("Month='" + DateTime.Now.AddMonths(-1).Month.ToString() + "'");
            if (dr.Length > 0)
            {
                fieldDays = Convert.ToInt32(dr[0]["Count"].ToString());
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>" + dr[0]["Count"].ToString() + "</div><div style='clear: both;'></div></div>");
            }
            else
            {
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
            }

            // Doctor call Avg 
            doctorVisitCount = 0;
            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Call Avg</div>");
            dr = DetailsTable.Select("Month='" + DateTime.Now.AddMonths(-1).Month.ToString() + "'");
            if (dr.Length > 0)
            {
                doctorVisitCount = Convert.ToInt32(dr[0]["DOC_Count"].ToString());
            }
            if (doctorVisitCount > 0)
            {
                doctorVisitAvg = (Convert.ToDouble(doctorVisitCount) / Convert.ToDouble(fieldDays));
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>" + doctorVisitAvg.ToString("N2") + "</div><div style='clear: both;'></div></div>");
            }
            else
            {
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
            }

            DataTable dtCategory = ds.Tables[1];
            DataTable dtCategoryDoctor = ds.Tables[4];
            DataTable dtVisitedCount = ds.Tables[5];
            DataTable dvDoctorWiseVisit = ds.Tables[6];

            foreach (DataRow dRow in dtCategory.Rows)
            {
                doctorVisitCount = 0;
                doctorCount = 0;

                doctorVisit = Convert.ToInt32(dRow["Visit_Count"].ToString());
                //Category wise  Doctor Count 
                sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Total " + dRow["Category_Name"].ToString() + " Drs</div>");
                sbTableMissed.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>No of Drs Missed " + dRow["Category_Name"].ToString() + "</div>");
                sbTableVisitMissed.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Visits Missed " + dRow["Category_Name"].ToString() + "</div>");

                //  Toatl doctor Count
                dr = dtCategoryDoctor.Select("Category='" + dRow["Category_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    doctorCount = Convert.ToInt32(dr[0]["Count"].ToString());
                    sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.AddMonths(-1).Month.ToString() + "_" + DateTime.Now.AddMonths(-1).Year.ToString() + "_" + DateTime.Now.AddMonths(-1).ToString("MMMM") + "_TOTAL_Total " + dRow["Category_Name"].ToString() + " Drs\")' style='cursor: pointer; text-decoration: underline'>" + dr[0]["Count"].ToString() + "</span></div><div style='clear: both;'></div></div>");

                }
                else
                {
                    sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");

                }

                // Total Doctor Missed Count

                dr = dtVisitedCount.Select("Month='" + DateTime.Now.AddMonths(-1).Month.ToString() + "' AND Category='" + dRow["Category_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    doctorVisitCount = Convert.ToInt32(dr[0]["Count"].ToString());
                }
                if (doctorCount > 0)
                {
                    sbTableMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.AddMonths(-1).Month.ToString() + "_" + DateTime.Now.AddMonths(-1).Year.ToString() + "_" + DateTime.Now.AddMonths(-1).ToString("MMMM") + "_MISSED_No of Drs Missed " + dRow["Category_Name"].ToString() + "\")' style='cursor: pointer; text-decoration: underline'>" + (doctorCount - doctorVisitCount) + "</span></div><div style='clear: both;'></div></div>");
                }
                else
                {
                    sbTableMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
                }

                // Total visit Missed 
                dr = dvDoctorWiseVisit.Select("Month='" + DateTime.Now.AddMonths(-1).Month.ToString() + "' AND Category='" + dRow["Category_Code"].ToString() + "' AND Count < '" + doctorVisit + "'");
                if (dr.Length > 0)
                {
                    sbTableVisitMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.AddMonths(-1).Month.ToString() + "_" + DateTime.Now.AddMonths(-1).Year.ToString() + "_" + DateTime.Now.AddMonths(-1).ToString("MMMM") + "_VISITMISSED_No of Drs Missed " + dRow["Category_Name"].ToString() + "\")' style='cursor: pointer; text-decoration: underline'>" + dr.Length.ToString() + "</span></div><div style='clear: both;'></div></div>");
                }
                else
                {
                    sbTableVisitMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
                }
            }


            sbTableContent.Append(sbTableMissed);
            sbTableContent.Append(sbTableVisitMissed);
            sbTableContent.Append("</div>");

            fieldDays = 0;
            doctorVisitCount = 0;
            doctorCount = 0;
            doctorVisit = 0;
            doctorVisitAvg = 0.0;
            sbTableMissed = new StringBuilder();
            sbTableVisitMissed = new StringBuilder();
            // Current Month Details

            sbTableContent.Append("<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>");
            sbTableContent.Append("<h3 class='ui-title' role='heading' aria-level='1'>Month of " + DateTime.Today.ToString("MMM") + "-" + DateTime.Now.Year + "</h3></div>");
            sbTableContent.Append("<div class='dvWidth'></br>");

            // Field Days Count
            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Total Field Days in Month</div>");
            dr = ds.Tables[2].Select("Month='" + DateTime.Now.Month.ToString() + "'");
            if (dr.Length > 0)
            {
                fieldDays = Convert.ToInt32(dr[0]["Count"].ToString());
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>" + dr[0]["Count"].ToString() + "</div><div style='clear: both;'></div></div>");
            }
            else
            {
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
            }
            // Doctor call Avg 
            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Call Avg</div>");
            dr = DetailsTable.Select("Month='" + DateTime.Now.Month.ToString() + "'");
            if (dr.Length > 0)
            {
                doctorVisitCount = Convert.ToInt32(dr[0]["DOC_Count"].ToString());
            }
            if (doctorVisitCount > 0)
            {
                doctorVisitAvg = (Convert.ToDouble(doctorVisitCount) / Convert.ToDouble(fieldDays));
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>" + doctorVisitAvg.ToString("N2") + "</div><div style='clear: both;'></div></div>");
            }
            else
            {
                sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
            }


            foreach (DataRow dRow in dtCategory.Rows)
            {

                doctorVisitCount = 0;
                doctorCount = 0;
                doctorVisit = Convert.ToInt32(dRow["Visit_Count"].ToString());
                //Category wise  Doctor Count 
                sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Total " + dRow["Category_Name"].ToString() + " Drs</div>");
                sbTableMissed.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>No of Drs Missed " + dRow["Category_Name"].ToString() + "</div>");
                sbTableVisitMissed.Append("<div class='dvWidth'><div style='float: left; width: 40%;padding:5px;font-size:13px;'>Visits Missed " + dRow["Category_Name"].ToString() + "</div>");

                //  Toatl doctor Count
                dr = dtCategoryDoctor.Select("Category='" + dRow["Category_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    doctorCount = Convert.ToInt32(dr[0]["Count"].ToString());
                    sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.Month.ToString() + "_" + DateTime.Now.Year.ToString() + "_" + DateTime.Today.ToString("MMMM") + "_TOTAL_TOTAL " + dRow["Category_Name"].ToString() + " Drs\")' style='cursor: pointer; text-decoration: underline'>" + dr[0]["Count"].ToString() + "</span></div><div style='clear: both;'></div></div>");

                }
                else
                {
                    sbTableContent.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");

                }
                // Total Doctor Missed Count

                dr = dtVisitedCount.Select("Month='" + DateTime.Now.Month.ToString() + "' AND Category='" + dRow["Category_Code"].ToString() + "'");
                if (dr.Length > 0)
                {
                    doctorVisitCount = Convert.ToInt32(dr[0]["Count"].ToString());
                }
                if (doctorCount > 0)
                {
                    sbTableMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.Month.ToString() + "_" + DateTime.Now.Year.ToString() + "_" + DateTime.Today.ToString("MMMM") + "_MISSED_No of Drs Missed " + dRow["Category_Name"].ToString() + "\")' style='cursor: pointer; text-decoration: underline'>" + (doctorCount - doctorVisitCount) + "</span></div><div style='clear: both;'></div></div>");
                }
                else
                {
                    sbTableMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
                }

                // Total visit Missed 
                dr = dvDoctorWiseVisit.Select("Month='" + DateTime.Now.Month.ToString() + "' AND Category='" + dRow["Category_Code"].ToString() + "' AND Count < '" + doctorVisit + "'");
                if (dr.Length > 0)
                {
                    sbTableVisitMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'><span onclick='fnGoToActivitySummaryDetail(\"" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + dRow["Category_Code"].ToString() + "_" + DateTime.Now.Month.ToString() + "_" + DateTime.Now.Year.ToString() + "_" + DateTime.Today.ToString("MMMM") + "_VISITMISSED_No of Drs Missed " + dRow["Category_Name"].ToString() + "\")' style='cursor: pointer; text-decoration: underline'>" + dr.Length.ToString() + "</span></div><div style='clear: both;'></div></div>");
                }
                else
                {
                    sbTableVisitMissed.Append("<div style='float: left; width: 50%;padding:5px;font-size:13px;'>0</div><div style='clear: both;'></div></div>");
                }                 
            }

            sbTableContent.Append(sbTableMissed);
            sbTableContent.Append(sbTableVisitMissed);

            sbTableContent.Append("</div>");
            return sbTableContent.ToString();
        }

        public static DataTable GetDistinctRecords(DataTable dt, string[] Columns)
        {
            DataTable dtUniqRecords = new DataTable();
            dtUniqRecords = dt.DefaultView.ToTable(true, Columns);
            return dtUniqRecords;
        }

        public string GetActivitySummarDetailReport(FormCollection collection)
        {
            string userDetails = collection["userDetails"].ToString();
            DataSet ds = new DataSet();
            ds = objSP.GetActivitySummarDetailsReport(objCurr.GetCompanyCode(), userDetails.Split('_')[0], userDetails.Split('_')[1], userDetails.Split('_')[5], userDetails.Split('_')[2], userDetails.Split('_')[3]);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return GetActivitySummarDetailReportTable(ds, userDetails);
        }
        public string GetActivitySummarDetailReportTable(DataSet ds, string userDetails)
        {
            StringBuilder sbTableContent = new StringBuilder();
            DataTable doctorTable = ds.Tables[1];
            
            sbTableContent.Append("<div class='dvWidth'>");

            sbTableContent.Append("<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>");
            sbTableContent.Append("<h3 class='ui-title' role='heading' aria-level='1'>"+userDetails.Split('_')[6] +" - " +ds.Tables[0].Rows[0]["User_Name"].ToString() + " - " + ds.Tables[0].Rows[0]["User_Type_Name"].ToString() + "</h3></div>");
            sbTableContent.Append("</div></br>");
            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;font-size:12px;padding:5px'>Selected Month</div>");
            sbTableContent.Append("<div style='float: left; width: 50%;font-size:12px;padding:5px'>" + userDetails.Split('_')[4] + " -" + userDetails.Split('_')[3] + "</div><div style='clear: both;'></div></div>");

            sbTableContent.Append("<div class='dvWidth'><div style='float: left; width: 40%;font-size:12px;padding:5px'>" + userDetails.Split('_')[6] + "</div>");
            sbTableContent.Append("<div style='float: left; width: 50%;font-size:12px;padding:5px'>" + doctorTable.Rows.Count + "</div><div style='clear: both;'></div></div>");

            sbTableContent.Append("<div data-role='content'>");
            sbTableContent.Append("<ul id='lstCustomer' data-role='listview' data-divider-theme='a' data-inset='true'>");
            sbTableContent.Append(" <li data-role='list-divider' role='heading'>Doctor Details</li>");

            foreach (DataRow drs in doctorTable.Rows)
            {
                sbTableContent.Append("<li data-theme='c'>");
                sbTableContent.Append("<a href='#' data-transition='turn' onclick='fnGoToDoctor360Page(\"" + drs["Region_Code"].ToString() + '_' + drs["User_Code"].ToString() + '_' + drs["Customer_Code"].ToString() + "\")'>" + drs["Doctor_Details"].ToString() + "</a>");
                sbTableContent.Append("</li>");
            }
            sbTableContent.Append("</ul>");
            sbTableContent.Append("</div>");

            return sbTableContent.ToString();
        }

        public JsonResult GetChildUserCheck(FormCollection collection)
        {
            DataSet dsChildUsers = new DataSet();
            dsChildUsers = objSP.dsChildUsers(objCurr.GetCompanyCode(), objCurr.GetUserCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(dsChildUsers));
        }

    }
}
