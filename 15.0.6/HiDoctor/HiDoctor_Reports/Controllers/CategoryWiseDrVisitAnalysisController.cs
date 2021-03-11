using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Data;
using System.Text;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    public class CategoryWiseDrVisitAnalysisController : Controller
    {
        private int regionTypeLevelNo = 0;
        DataSet dsRegionType = new DataSet();
        DataRow[] regionTypeFilter;
        //
        // GET: /CategoryWiseDrVisitAnalysis/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /CategoryWiseDrVisitAnalysis/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /CategoryWiseDrVisitAnalysis/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /CategoryWiseDrVisitAnalysis/Create

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
        // GET: /CategoryWiseDrVisitAnalysis/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /CategoryWiseDrVisitAnalysis/Edit/5

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
        // GET: /CategoryWiseDrVisitAnalysis/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /CategoryWiseDrVisitAnalysis/Delete/5

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

        private void GenerateRegionTypeLevel(string regionTypeCode)
        {
            regionTypeFilter = dsRegionType.Tables[0].Select("Under_Region_Type = '" + regionTypeCode + "' AND Region_Type_Code <> Under_Region_Type");

            if (regionTypeFilter.Length > 0)
            {
                regionTypeLevelNo++;

                foreach (DataRow dr in regionTypeFilter)
                {
                    dr["Level_No"] = regionTypeLevelNo.ToString();
                    dsRegionType.Tables[0].AcceptChanges();
                }

                foreach (DataRow dr in regionTypeFilter)
                {
                    GenerateRegionTypeLevel(dr["Region_Type_Code"].ToString());
                }
            }
        }

        public JsonResult GetRegionTypes()
        {

            DAL_Reports_CategoryWiseDrVisitAnalysis objDAL = new DAL_Reports_CategoryWiseDrVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();

            string companyCode = _objcurrentInfo.GetCompanyCode();

            dsRegionType = objDAL.GetRegionTypes(companyCode);

            DataRow[] rowFilter;

            rowFilter = dsRegionType.Tables[0].Select("Region_Type_Code = Under_Region_Type");

            if (rowFilter.Length > 0)
            {
                foreach (DataRow dr in rowFilter)
                {
                    regionTypeLevelNo = 1;

                    dr["Level_No"] = regionTypeLevelNo.ToString();

                    dsRegionType.Tables[0].AcceptChanges();
                }

                foreach (DataRow dr in rowFilter)
                {
                    GenerateRegionTypeLevel(dr["Region_Type_Code"].ToString());
                }
            }

            DataSet ds = new DataSet();
            string regionCode = string.Empty;
            string regionTypeCode = string.Empty;

            regionCode = _objcurrentInfo.GetRegionCode();
            regionTypeCode = objDAL.GetRegionTypeCode(companyCode, regionCode);

            ds = dsRegionType.Clone();

            rowFilter = dsRegionType.Tables[0].Select("Region_Type_Code = '" + regionTypeCode + "'");

            if (rowFilter.Length > 0)
            {
                regionTypeLevelNo = Convert.ToInt16(rowFilter[0]["Level_No"].ToString());

                rowFilter = dsRegionType.Tables[0].Select("Level_No >= '" + regionTypeLevelNo + "'");

                foreach (DataRow dr in rowFilter)
                {
                    ds.Tables[0].ImportRow(dr);
                    ds.Tables[0].AcceptChanges();
                }
            }

            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string ShowCategoryWiseDrVisitAnalysis(FormCollection collection)
        {

            DAL_Reports_CategoryWiseDrVisitAnalysis objDAL = new DAL_Reports_CategoryWiseDrVisitAnalysis();
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            string blobUrl = string.Empty;

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string selectedRegionCode = _objcurrentInfo.GetRegionCode();
            string month = collection["Month"].ToString();
            string year = collection["Year"].ToString();
            string groupByRegionTypeCode = collection["GroupByRegionTypeCode"].ToString();
            string aggregateRegionTypeCode = collection["AggregateRegionTypeCode"].ToString();
            string dcrStatus = collection["DCRStatus"].ToString();
            string monthName = collection["MonthName"].ToString();
            string groupByRegionTypeName = collection["GroupByRegionTypeName"].ToString();
            string aggregateRegionTypeName = collection["AggregateRegionTypeName"].ToString();
            string dcrText = string.Empty;

            DataSet dsUserInfo = null;
            DataSet dsDoctorCategory = null;
            //DataSet dsDoctorMaster = null;
            //DataSet dsDoctorVisit = null;
            //DataSet dsFieldDays = null;
            DataSet dsLastDcrDate = null;
            DataSet dsRvSv = null;


            StringBuilder sbTableContent = new StringBuilder();

            string currentRegionCode = string.Empty;
            string regionUserCount = string.Empty;
            string categoryCode = string.Empty;
            string userCodes = string.Empty;

            int standardVisitCount = 0;

            double doctorMasterCount = 0;
            double doctorVisitCount = 0;
            double visitAvg = 0;
            int loopCount = 0;

            int totalRegionCnt = 0;
            int totalUserCnt = 0;
            int totalNoOfFieldDays = 0;
			DataRow[] rowFilter;
            DataRow filteredRow;

            if (string.IsNullOrEmpty(month)) { month = "0"; }
            if (string.IsNullOrEmpty(year)) { year = "0"; }


            dsUserInfo = objDAL.GetChildRegions(companyCode, selectedRegionCode, groupByRegionTypeCode);
            dsDoctorCategory = objDAL.GetDoctorCategories(companyCode);
            dsRvSv = objDAL.GetRVSVDetails(companyCode, aggregateRegionTypeCode, selectedRegionCode, groupByRegionTypeCode, int.Parse(month), int.Parse(year), dcrStatus);


            if (dsUserInfo != null && dsUserInfo.Tables.Count > 0)
            {
                foreach (string status in dcrStatus.Split('^'))
                {
                    if (status == "0")
                    {
                        dcrText += "Unapproved,";
                    }
                    else if (status == "1")
                    {
                        dcrText = "Applied,";
                    }
                    else if (status == "2")
                    {
                        dcrText = "Approved,";
                    }
                }

                dcrText = dcrText.Substring(0, dcrText.Length - 1);

                sbTableContent.Append("<div>RVSV Analysis for the month of " + monthName + " grouped by " + groupByRegionTypeName + " aggregated by " + aggregateRegionTypeName + " (Considered " + dcrText + " DCRs only)</div>");
                sbTableContent.Append("<table cellspacing='0' cellpadding='0' id='tblTpVsActualDocVisits' width='100%'>");

                // Binding header information - Start
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");

                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Region Name</th>");
              //  sbTableContent.Append("<th>Reporting Region Name</th>");
                sbTableContent.Append("<th>Line 1 Manager Name</th>");
                sbTableContent.Append("<th>Line 1 Manager User Type</th>");
                sbTableContent.Append("<th>Line 1 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 1 Manager Region type</th>");
                sbTableContent.Append("<th>Line 2 Manager Name</th>");
                sbTableContent.Append("<th>Line 2 Manager User Type</th>");
                sbTableContent.Append("<th>Line 2 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 2 Manager Region type</th>");
                sbTableContent.Append("<th>Line 3 Manager Name</th>");
                sbTableContent.Append("<th>Line 3 Manager User Type</th>");
                sbTableContent.Append("<th>Line 3 Manager Region Name</th>");
                sbTableContent.Append("<th>Line 3 Manager Region type</th>");
                sbTableContent.Append("<th>Region Count</th>");
                sbTableContent.Append("<th>User Count</th>");
                sbTableContent.Append("<th>DCR Last Entered Date</th>");
                sbTableContent.Append("<th>No. of Field Work Days</th>");

                int categoryCount = 0;

                if (dsDoctorCategory != null && dsDoctorCategory.Tables.Count > 0)
                {
                    foreach (DataRow drDocCategory in dsDoctorCategory.Tables[0].Rows)
                    {
                        standardVisitCount = 0;

                        if (!string.IsNullOrEmpty(drDocCategory["Visit_Count"].ToString()))
                        {
                            standardVisitCount = Convert.ToInt16(drDocCategory["Visit_Count"].ToString());
                        }

                        categoryCount += 1 + standardVisitCount;

                        sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs in the list </th>");

                        for (int i = 1; i <= standardVisitCount; i++)
                        {
                            sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs met at least " + i.ToString() + " time(s) </th>");
                            sbTableContent.Append("<th>" + drDocCategory["Category_Name"].ToString() + " Drs met at least " + i.ToString() + " time(s) % </th>");
                        }
                    }
                }

                int[] columnWiseTotal = new int[categoryCount];

                sbTableContent.Append("</tr>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");

                foreach (DataRow drGroupbyRegion in dsUserInfo.Tables[0].Rows)
                {
                    userCodes += drGroupbyRegion["User_Code"].ToString() + "^";
                }

                if (string.IsNullOrEmpty(userCodes))
                {
                    userCodes = "^";
                }

                dsLastDcrDate = objDAL.GetLastDcrDate(companyCode, userCodes, month, year, dcrStatus);

                foreach (DataRow drGroupbyRegion in dsUserInfo.Tables[0].Rows)
                {
                    sbTableContent.Append("<tr>");

                    if (!string.IsNullOrEmpty(drGroupbyRegion["User_Name"].ToString()))
                    {
                        sbTableContent.Append("<td>" + drGroupbyRegion["User_Name"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>VACANT</td>");
                    }

                    if (!string.IsNullOrEmpty(drGroupbyRegion["Employee_Name"].ToString()))
                    {
                        sbTableContent.Append("<td>" + drGroupbyRegion["Employee_Name"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>VACANT</td>");
                    }

                    sbTableContent.Append("<td>" + drGroupbyRegion["Region_Name"].ToString() + "</td>");
                    //sbTableContent.Append("<td>" + drGroupbyRegion["Reporting_Region_Name"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line1_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line1_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line2_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line2_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");

                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_User_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_User_Type_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["line3_Manager_Region_Name"].ToString());
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td align='left' width='15%'>");
                    sbTableContent.Append(drGroupbyRegion["Line3_Manager_Region_Type_Name"].ToString());
                    sbTableContent.Append("</td>");


                    currentRegionCode = drGroupbyRegion["Region_Code"].ToString();

                    // Region Count & User Count
                    //regionUserCount = objDAL.GetRegionUserCount(companyCode, currentRegionCode, aggregateRegionTypeCode);
                    filteredRow = dsRvSv.Tables[0].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(currentRegionCode)).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        if (filteredRow.ItemArray.Length > 0)
                        {
                            totalRegionCnt += int.Parse(filteredRow["RegionCount"].ToString());
                            totalUserCnt += int.Parse(filteredRow["UserCount"].ToString());

                            sbTableContent.Append("<td>" + filteredRow["RegionCount"] + "</td>");
                            sbTableContent.Append("<td>" + filteredRow["UserCount"] + "</td>");
                        }
                        else
                        {
                            sbTableContent.Append("<td>0</td>");
                            sbTableContent.Append("<td>0</td>");
                        }

                    }

                    // Last DCR submitted date
                    filteredRow = dsLastDcrDate.Tables[0].AsEnumerable().Where(a => a["User_Code"].ToString().Equals(drGroupbyRegion["User_Code"].ToString())).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        sbTableContent.Append("<td>" + filteredRow["DCR_Actual_Date"].ToString() + "</td>");
                    }
                    else
                    {
                        sbTableContent.Append("<td>N/A</td>");
                    }

                    // No. of field days
                    filteredRow = dsRvSv.Tables[1].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(currentRegionCode)).FirstOrDefault();
                    if (filteredRow != null)
                    {
                        if (filteredRow.ItemArray.Length > 0)
                        {
                            sbTableContent.Append("<td>" + filteredRow["FieldCount"] + "</td>");
                            if (!string.IsNullOrEmpty(filteredRow["FieldCount"].ToString()))
                            {
                                totalNoOfFieldDays += int.Parse(filteredRow["FieldCount"].ToString());
                            }
                        }
                        else
                        {
                            sbTableContent.Append("<td>0</td>");
                        }
                    }

                    loopCount = 0;

                    foreach (DataRow drDoctorCategory in dsDoctorCategory.Tables[0].Rows)
                    {
                        standardVisitCount = 0;
                        if (!string.IsNullOrEmpty(drDoctorCategory["Visit_Count"].ToString()))
                        {
                            standardVisitCount = Convert.ToInt16(drDoctorCategory["Visit_Count"].ToString());
                        }
                        categoryCode = drDoctorCategory["Category_Code"].ToString();

                        // Category Drs in the list
                        doctorMasterCount = 0;
                        DataRow[] drfilteredRow;
                        drfilteredRow = dsRvSv.Tables[3].AsEnumerable().Where(c => c["Category_Code"].ToString() == categoryCode && c["Parent_Region"].ToString() == currentRegionCode).ToArray();

                        if (drfilteredRow.Length > 0)
                        {
                            doctorMasterCount = Convert.ToDouble(drfilteredRow[0]["Doctor_Count"].ToString());
                        }

                        sbTableContent.Append("<td>" + doctorMasterCount + "</td>");

                        columnWiseTotal[loopCount] += Convert.ToInt16(doctorMasterCount);

                        loopCount++;

                        for (int i = 1; i <= standardVisitCount; i++)
                        {
                            // Category Drs met at least [i] time(s)
                            doctorVisitCount = 0;
                            var query = from row in dsRvSv.Tables[2].AsEnumerable()
                                        where row.Field<string>("Category_Code") == categoryCode &&
                                              row.Field<string>("Parent_Region") == currentRegionCode && 
                                              row.Field<int>("Visit_Count") >= i
                                        select row;

                            if (query != null)
                            {
                                doctorVisitCount = query.AsDataView().Count;
                            }

                            columnWiseTotal[loopCount] += Convert.ToInt16(doctorVisitCount);

                            loopCount++;

                            sbTableContent.Append("<td>" + doctorVisitCount + "</td>");

                            // Category Drs met at least [i] time(s) %
                            if (doctorMasterCount > 0 && doctorVisitCount > 0)
                            {
                                visitAvg = (doctorVisitCount / doctorMasterCount) * 100;
                                sbTableContent.Append("<td>" + visitAvg.ToString("N2") + "</td>");
                            }
                            else
                            {
                                sbTableContent.Append("<td>0</td>");
                            }
                        }
                    }

                    sbTableContent.Append("</tr>");
                }

                sbTableContent.Append("<tr class='totaltr'>");
                sbTableContent.Append("<td colspan='4'>Total</td>");


                sbTableContent.Append("<td>" + totalRegionCnt.ToString()+ "</td>");
                sbTableContent.Append("<td>" + totalUserCnt.ToString() + "</td>");
                sbTableContent.Append("<td></td>");
                sbTableContent.Append("<td>" + totalNoOfFieldDays.ToString() + "</td>");
                loopCount = 0;

                foreach (DataRow drDoctorCategory in dsDoctorCategory.Tables[0].Rows)
                {
                    standardVisitCount = 0;

                    if (!string.IsNullOrEmpty(drDoctorCategory["Visit_Count"].ToString()))
                    {
                        standardVisitCount = Convert.ToInt16(drDoctorCategory["Visit_Count"].ToString());
                    }

                    sbTableContent.Append("<td>" + columnWiseTotal[loopCount].ToString() + "</td>");

                    loopCount++;

                    for (int i = 1; i <= standardVisitCount; i++)
                    {
                        sbTableContent.Append("<td>" + columnWiseTotal[loopCount].ToString() + "</td>");
                        sbTableContent.Append("<td></td>");

                        loopCount++;
                    }
                }

                sbTableContent.Append("</tr>");
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();

                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "CATEGORY_VISIT_ANALYSIS_" + "_" + compCode + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContent.ToString(), accKey, fileName, "bulkdatasvc");
            }

            return sbTableContent.ToString() + "$" + blobUrl;
        }
        
    }
}
