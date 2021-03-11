using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;
using System.Collections;
using DataControl.HiDoctor_ActivityFactoryClasses;
using DataControl.HiDoctor_ReportsFactoryClasses;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [AjaxSessionActionFilter]
    public class ReportsLevelTwoController : Controller
    {
        //
        // GET: /ReportsLevelTwo/
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        const string COLL_START_DATE = "sd";
        const string COLL_END_DATE = "ed";
        const string COLL_REGION_CODE = "regionCode";
        const string COLL_DCR_STATUS = "dcrStatus";
        const string COLL_USER_CODE = "userCode";
        const string COLL_CATEGORY = "category";
        const string COLL_MONTH = "month";
        const string COLL_YEAR = "year";
        const string Coll_PRODUCT_CODE = "product";
        const string COLL_COMPAIGN_CODE = "compaignCode";
        const string COLL_FLAG = "flag";
        const string COLL_REGION_STATUS = "regionStatus";
        const string COLL_SELECTEDMONTH = "selectedMonth";
        const string COLL_SELECTEDYEAR = "Selectedyear";
        #endregion Private Variables
        public ActionResult Index()
        {
            return View();
        }

        string m_CompanyCoe = "";

        public JsonResult GetRCPACompliance(FormCollection collection)
        {

            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string regionCodes = GetChildRegionCode(m_CompanyCoe, regionCode);
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            dcrStatus = dcrStatus.TrimEnd(',');
            DataSet ds = new DataSet();
            ds = _objSPData.GetRCPACompliance(m_CompanyCoe, "''", regionCodes, startDate, endDate, dcrStatus);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        // Doctor missed from Category
        public JsonResult GetDoctorMissedFromCategory(FormCollection collection)
        {

            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            string Month = collection[COLL_SELECTEDMONTH].ToString();
            string Year = collection[COLL_SELECTEDYEAR].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDoctorMissedFromCategory_WithCalc(m_CompanyCoe, userCode, "", Month, Year, dcrStatus);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        // Doctor missed from CategoryDetails
        public JsonResult GetDoctorMissedFromCategoryDetails(FormCollection collection)
        {

            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            string category = collection[COLL_CATEGORY];
            string Month = collection["selectedMonth"].ToString();
            string Year = collection["selectedyear"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDoctorMissedFromCategoryDetails_WithCalc(m_CompanyCoe, userCode, regionCode, Month, Year, dcrStatus, category);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// No of Doctors never visited
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        public JsonResult GetNoofDocsNeverVisited(FormCollection collection)
        {
            string userCode = collection[COLL_USER_CODE];
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            string category = collection[COLL_CATEGORY];
            string Month = collection["selectedMonth"].ToString();
            string Year = collection["selectedyear"].ToString();
            //dcrStatus = dcrStatus.TrimEnd(',');
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstCategorynevervisitedDoctors = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            lstCategorynevervisitedDoctors = _objSPData.GetCategoryNevervisitedDoctors_WithCalc(_objcurrentInfo.GetCompanyCode(), userCode, regionCode, Month, Year, category, dcrStatus).ToList();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(lstCategorynevervisitedDoctors), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// No of Doctors visit count missed
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        public JsonResult GetNoofDocsVisitCountMissed(FormCollection collection)
        {
            string userCode = collection[COLL_USER_CODE];
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            string category = collection[COLL_CATEGORY];
            string Month = collection["selectedMonth"].ToString();
            string Year = collection["selectedyear"].ToString();
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstDoctorvisitcountmissed = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            lstDoctorvisitcountmissed = _objSPData.GetNoofDocsVisitCountMissed_WithCalc(_objcurrentInfo.GetCompanyCode(), userCode, regionCode, Month, Year, category, dcrStatus).ToList();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(lstDoctorvisitcountmissed), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// No of doctors never visited plus category missed count
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        public JsonResult GetNoofDocsNeverVisitedandMissedCount(FormCollection collection)
        {
            string userCode = collection[COLL_USER_CODE];
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            string category = collection[COLL_CATEGORY];
            string Month = collection["selectedMonth"].ToString();
            string Year = collection["selectedyear"].ToString();
            List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel> lstCategorynevervisitedandmissedcountDoctors = new List<MVCModels.HiDoctor_Reports.CategoryNeverVisitedModel>();
            lstCategorynevervisitedandmissedcountDoctors = _objSPData.GetNoofDocsNeverVisitedandMissedCount_WithCalc(_objcurrentInfo.GetCompanyCode(), userCode, regionCode, Month, Year, category, dcrStatus).ToList();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(lstCategorynevervisitedandmissedcountDoctors), JsonRequestBehavior.AllowGet);
        }
        public string GetChildRegionCode(string companyCode, string regionCode)
        {
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
            return regionCodes;
        }

        public JsonResult GetDailyStatusReport(FormCollection collection)
        {
            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string month = collection[COLL_MONTH].ToString();
            string year = collection[COLL_YEAR].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDailyStatusReport(m_CompanyCoe, userCode, month, year);
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDailyStatusExpensePopup(FormCollection collection)
        {
            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string dcrCode = collection["dcrCode"].ToString();
            string flag = collection["flag"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDailyStatusExpensePopup(m_CompanyCoe, userCode, dcrCode, flag);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDailyStatusDoctorPopup(FormCollection collection)
        {
            m_CompanyCoe = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string dcrCode = collection["dcrCode"].ToString();
            string flag = collection["flag"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetDailyStatusDoctorPopup(m_CompanyCoe, userCode, dcrCode, flag);
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
        public string GetSpecialityWiseAnalysis(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"];
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string dcrStatus = collection["dcrStatus"].ToString();
            string Month = collection["Month"].ToString();
            string Year = collection["Year"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetSpecialityWiseAnalysisReport_WithCalc(companyCode, regionCode, Month, Year, dcrStatus);
            return GetSpecialityWiseTable(ds, startDate, endDate, dcrStatus, Month, Year, regionCode);
        }
        public string GetSpecialityWiseTable(DataSet ds, string startDate, string endDate, string dcrStatus, string selectedMonth, string selectedYear, string selectRegioncode)
        {
            StringBuilder sbTableContent = new StringBuilder();
            StringBuilder sbTableContentHeader = new StringBuilder();
            StringBuilder sbTableContentHeaderSub = new StringBuilder();
            string divisionName = string.Empty;
            DataRow[] drv;
            int iRow = 0;
            int totalDoctor = 0;
            int masterVisits = 0;
            int doctorVisitCount = 0;
            double mcDoctorCount = 0.0;
            double totalQty = 0.0;
            double ownproductQty = 0.0;
            double CompetitorQty = 0.0;
            //Adding column Descrption
            sbTableContent.Append("<lable style='text-decoration: underline;'>Notes:</lable>");
            sbTableContent.Append("<div>");
            sbTableContent.Append("<Lable>1)<span style='font-weight:bold;'>Master Visits</span> - Is the Sum of Expected Num of Visits for  Doctors in each Category</Lable><br/>");
            sbTableContent.Append("<Lable>2)<span style='font-weight:bold;'>Actual Visits</span> - Is the Sum of Actual Num. of Visits for Doctors in each Category, taken from DCR.</Lable><br/>");
            sbTableContent.Append("<Lable>3)<span style='font-weight:bold;'>No of Drs - Detailing Done</span> - Is the Actual Num. of Doctors for whom detailing has been done, taken from DCR.</Lable><br/>");
            sbTableContent.Append("<Lable>4)<span style='font-weight:bold;'>No. of Drs. - Samples / Gifts or other Product Types Given</span> - Is the Actual Num. of Doctors for whom samples / gifts / LBLT or any other product types have been given, taken from DCR.</Lable><br/>");
            sbTableContent.Append("<Lable>5)<span style='font-weight:bold;'>No. of Drs. - added in MC</span> - Is the Actual Num. of Doctors for whom Marketing Campaign is planned (from Marketing Campaign Definer)</Lable><br/>");
            sbTableContent.Append("<Lable>6)<span style='font-weight:bold;'>RCPA - My Product (Amount)</span> - Is the Sum of [RCPA Qty. of a product * Its Price] for a particular specialty (taken from RCPA in DCR) = A</Lable><br/>");
            sbTableContent.Append("<Lable>7)<span style='font-weight:bold;'>RCPA - Competitor Product (Amount)</span> - Is the Sum of [RCPA Qty. of a product * Its Price] for a particular specialty (taken from RCPA in DCR) = B</Lable><br/>");
            sbTableContent.Append("<Lable>8)<span style='font-weight:bold;'>% to competitor</span> - Is calculated as : RCPA of My Product / (RCPA-My Product + RCPA -Competitor) * 100</Lable><br/>");
            sbTableContent.Append("</div>");


            sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >");
            sbTableContent.Append("<thead><tr>");
            sbTableContent.Append("<th colspan='6'>User Details</th>");
            sbTableContent.Append("<th>");
            sbTableContent.Append("<div class='helpIconRpt'>");
            sbTableContent.Append("<img src='../Images/HelpIcon.png' onclick=\"fnHelp('SPECIALITY_WISE_DOCTOR_ANALYSIS_REPORT')\" />");
            sbTableContent.Append("</div>");
            sbTableContent.Append("</th>");
            sbTableContent.Append("</tr></thead>");
            sbTableContent.Append("<tbody>");
            sbTableContent.Append("<tr>");

            sbTableContent.Append("<td style='text-align:left' >User Name</td>");
            sbTableContent.Append("<td style='text-align:left' >" + ds.Tables[0].Rows[0]["User_Name"].ToString() + "</td>");
            sbTableContent.Append("<td style='text-align:left' >Division Name</td>");

            drv = ds.Tables[1].AsEnumerable().Where(c => c["Region_Code"].ToString() == selectRegioncode.ToString()).ToArray();
            // drv = ds.Tables[1].AsEnumerable().Where(c => c["Region_Code"].ToString() == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
            divisionName = "";
            if (drv.Length > 0)
            {
                foreach (DataRow dr in drv)
                {
                    divisionName += dr["Division_Name"].ToString() + ",";
                }
            }

            if (!string.IsNullOrEmpty(divisionName))
            {
                divisionName = divisionName.TrimEnd(',');
            }
            sbTableContent.Append("<td style='text-align:left' >" + divisionName + "</td>");
            sbTableContent.Append("<td style='text-align:left' >Manager Name</td>");
            sbTableContent.Append("<td style='text-align:left' >" + ds.Tables[0].Rows[0]["Manager_Name"].ToString() + "</td></tr>");

            sbTableContent.Append("<tr>");
            sbTableContent.Append("<td style='text-align:left' >Employee Name</td>");
            sbTableContent.Append("<td style='text-align:left' >" + ds.Tables[0].Rows[0]["Employee_Name"].ToString() + "</td>");
            sbTableContent.Append("<td style='text-align:left' >Date of Joining</td>");
            sbTableContent.Append("<td style='text-align:left' >" + ds.Tables[0].Rows[0]["DOJ"].ToString() + "</td>");
            sbTableContent.Append("<td style='text-align:left' >Manager Territory name</td>");
            sbTableContent.Append("<td style='text-align:left' >" + ds.Tables[0].Rows[0]["Manager_Region_Name"].ToString() + "</td></tr>");
            sbTableContent.Append("<tr>");
            sbTableContent.Append("<td style='text-align:left' >Region Name</td>");
            sbTableContent.Append("<td style='text-align:left'  colspan='5'>" + ds.Tables[0].Rows[0]["Region_Name"].ToString() + "</td></tr>");
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("</table>~");
            // Details 
            sbTableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSpecialityWiseAnalysis' >");
            sbTableContent.Append("<thead>");
            //TABLE HEADER

            sbTableContentHeader.Append("<tr style='display: none;' id='tblTr'>");
            iRow++;

            sbTableContentHeader.Append("<th style='display:none' >User Name</th>");
            iRow++;
            sbTableContentHeader.Append("<th style='display:none' >Region Name</th>");
            iRow++;
            sbTableContentHeader.Append("<th sstyle='display:none' >Employee Name</th>");
            iRow++;
            sbTableContentHeader.Append("<th style='display:none' >Manager Name</th>");
            iRow++;
            sbTableContentHeader.Append("<th style='display:none' >Manager Territory name</th>");
            iRow++;
            string type = "[{ type:  'text' },{ type:  'text' },{ type:  'text' },{ type:  'text' },{ type:  'text' }";
            sbTableContentHeader.Append("<th style='text-align:left' >Speciality Name</th>");
            type += ", { type: 'number-range' }";
            if (ds.Tables[3].Rows.Count > 0)
            {
                foreach (DataRow drs in ds.Tables[3].Rows)
                {
                    iRow++;
                    sbTableContentHeader.Append("<th style='text-align:left'>" + drs["Category_Name"].ToString() + " </th>");
                    iRow++;
                    sbTableContentHeaderSub.Append("<th style='text-align:left'>" + drs["Category_Name"].ToString() + " </th>");
                    type += ", { type: 'number-range' }, { type: 'number-range' }";
                }

            }
            type += ", { type: 'number-range' }, { type: 'number-range' }";
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left'>Total</th>");

            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >Master Visits</th>");

            iRow++;
            sbTableContentHeaderSub.Append("<th style='text-align:left'>Total</th>");
            type += ", { type: 'number-range' }, { type: 'number-range' }";

            sbTableContentHeader.Append(sbTableContentHeaderSub);
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >Actual Visits</th>");
            type += ", { type: 'number-range' }, { type: 'number-range' }";
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >No of Drs Detailing done</th>");
            type += ", { type: 'number-range' }";

            foreach (DataRow drs in ds.Tables[7].Rows)
            {
                iRow++;
                type += ", { type: 'number-range' }";
                sbTableContentHeader.Append("<th style='text-align:left' >No of Drs " + drs["Product_Type_Name"].ToString() + " given</th>");
                //if (drs["Product_Type_Name"].ToString().ToUpper() == "SAMPLE")
                //{
                //    iRow++;
                //    sbTableContentHeader.Append("<th style='text-align:left' >Total Qty " + drs["Product_Type_Name"].ToString() + " given</th>");
                //    type += ", { type: 'number-range' }";
                //}
            }

            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >No of Drs Referred in Marketing Campaign</th>");
            type += ", { type: 'number-range' }";
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >RCPA - My Product(Amount)</th>");
            type += ", { type: 'number-range' }";
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >RCPA -Competitor Product(Amount)</th>");
            type += ", { type: 'number-range' }";
            iRow++;
            sbTableContentHeader.Append("<th style='text-align:left' >% to Competitor</th></tr>");
            type += ", { type: 'number-range' }]";

            sbTableContent.Append(sbTableContentHeader);


            sbTableContent.Append("<tr>");
            sbTableContent.Append("<th style='display:none' rowspan='2'>User Name</th>");
            sbTableContent.Append("<th style='display:none' rowspan='2'>Region Name</th>");
            sbTableContent.Append("<th style='display:none' rowspan='2'>Employee Name</th>");
            sbTableContent.Append("<th style='display:none' rowspan='2'>Manager Name</th>");
            sbTableContent.Append("<th style='display:none' rowspan='2'>Manager Territory name</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>Speciality Name</th>");
            sbTableContent.Append("<th style='text-align:center' colspan='" + (ds.Tables[3].Rows.Count + 1) + "'>Total Drs in Master</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>Master Visits</th>");
            sbTableContent.Append("<th style='text-align:center' colspan='" + (ds.Tables[3].Rows.Count + 1) + "'>Total Visits</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>Actual Visits</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>No of Drs Detailing done</th>");

            for (var j = 0; j < ds.Tables[7].Rows.Count; j++)
            {
                sbTableContent.Append("<th style='text-align:left' rowspan='2'>No of Drs " + ds.Tables[7].Rows[j]["Product_Type_Name"].ToString() + " given</th>");
                //if (ds.Tables[7].Rows[j]["Product_Type_Name"].ToString().ToUpper() == "SAMPLE")
                //{
                //    sbTableContent.Append("<th style='text-align:left' rowspan='2'>Total Qty " + ds.Tables[7].Rows[j]["Product_Type_Name"].ToString() + " given</th>");
                //}
            }
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>No of Drs Referred in Marketing Campaign</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>RCPA - My Product(Amount)</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>RCPA -Competitor Product(Amount)</th>");
            sbTableContent.Append("<th style='text-align:left' rowspan='2'>% to Competitor</th></tr>");

            sbTableContent.Append("<tr >");
            StringBuilder sbTableContenSub = new StringBuilder();
            if (ds.Tables[3].Rows.Count > 0)
            {
                for (var i = 0; i < ds.Tables[3].Rows.Count; i++)
                {
                    sbTableContent.Append("<th style='text-align:left'>" + ds.Tables[3].Rows[i]["Category_Name"].ToString() + " </th>");
                    sbTableContenSub.Append("<th style='text-align:left'>" + ds.Tables[3].Rows[i]["Category_Name"].ToString() + " </th>");
                }
            }
            sbTableContent.Append("<th style='text-align:left'>Total</th>");
            sbTableContenSub.Append("<th style='text-align:left'>Total</th>");
            sbTableContent.Append(sbTableContenSub);
            sbTableContent.Append("</tr>");

            sbTableContent.Append("<tr >");
            sbTableContent.Append("<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
            sbTableContent.Append("</tr>");
            sbTableContent.Append("</thead><tbody>");
            for (var i = 0; i < ds.Tables[2].Rows.Count; i++)
            {

                totalDoctor = 0;
                masterVisits = 0;
                sbTableContent.Append("<tr>");
                //Speciality Name             
                sbTableContent.Append("<td style='display:none'>" + ds.Tables[0].Rows[0]["User_Name"].ToString() + "</td>");
                sbTableContent.Append("<td style='display:none'>" + ds.Tables[0].Rows[0]["Region_Name"].ToString() + "</td>");
                sbTableContent.Append("<td style='display:none'>" + ds.Tables[0].Rows[0]["Employee_Name"].ToString() + "</td>");
                sbTableContent.Append("<td style='display:none'>" + ds.Tables[0].Rows[0]["Manager_Name"].ToString() + "</td>");
                sbTableContent.Append("<td style='display:none'>" + ds.Tables[0].Rows[0]["Manager_Region_Name"].ToString() + "</td>");
                sbTableContent.Append("<td align='left' width='8%' onclick='fnSpecialityWiseAnalysisView(\"" + ds.Tables[0].Rows[0]["Region_Code"].ToString() + "_" + ds.Tables[0].Rows[0]["User_Code"].ToString() + "_" + startDate + "_" + endDate + "_" + dcrStatus + "_" + ds.Tables[2].Rows[i]["Speciality_Code"].ToString() + "_" + selectedMonth + "_" + selectedYear + "\")' style='text-decoration:underline;cursor:pointer'>" + ds.Tables[2].Rows[i]["Speciality_Name"].ToString() + "</td>");
                // Speciality Wise Category visit(Total Doctor in Master List)
                for (var j = 0; j < ds.Tables[3].Rows.Count; j++)
                {

                    drv = ds.Tables[4].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString() && c["Category_Code"].ToString() == ds.Tables[3].Rows[j]["Category_Code"].ToString()).ToArray();

                    if (drv.Length > 0)
                    {
                        if (drv[0]["Count"].ToString() != null)
                        {
                            doctorVisitCount = Convert.ToInt32(ds.Tables[3].Rows[j]["Visit_Count"].ToString());

                            sbTableContent.Append("<td style='text-align:center'>" + drv[0]["Count"].ToString() + "</td>");
                            totalDoctor += Convert.ToInt32(drv[0]["Count"].ToString());

                            masterVisits += Convert.ToInt32(drv[0]["Count"].ToString()) * doctorVisitCount;
                        }
                        else
                        {
                            sbTableContent.Append("<td style='text-align:center'>0</td>");
                        }

                    }
                    else
                    {
                        sbTableContent.Append("<td style='text-align:center'>0</td>");
                    }

                }
                // Speciality Wise Category visit met Total
                sbTableContent.Append("<td style='text-align:center'>" + totalDoctor + "</td>");
                //Master Visits
                sbTableContent.Append("<td style='text-align:center'>" + masterVisits + "</td>");
                //Total Doctos in Met
                totalDoctor = 0;
                for (var j = 0; j < ds.Tables[3].Rows.Count; j++)
                {

                    drv = ds.Tables[5].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString() && c["Category_Code"].ToString() == ds.Tables[3].Rows[j]["Category_Code"].ToString()).ToArray();


                    if (drv.Length > 0)
                    {
                        if (drv[0]["Count"].ToString() != null)
                        {
                            sbTableContent.Append("<td style='text-align:center'>" + drv[0]["Count"].ToString() + "</td>");
                            totalDoctor += Convert.ToInt32(drv[0]["Count"].ToString());
                        }
                        else
                        {
                            sbTableContent.Append("<td style='text-align:center'>0</td>");
                        }

                    }
                    else
                    {
                        sbTableContent.Append("<td style='text-align:center'>0</td>");
                    }

                }
                // Speciality Wise Category visit Total
                sbTableContent.Append("<td style='text-align:center'>" + totalDoctor + "</td>");

                //Actual Visits

                drv = ds.Tables[6].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString()).ToArray();
                if (drv.Length > 0)
                {
                    sbTableContent.Append("<td style='text-align:center'>" + drv.Length + "</td>");
                }
                else
                {
                    sbTableContent.Append("<td style='text-align:center'>0</td>");
                }
                //No of Doctors detailing done
                drv = ds.Tables[8].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString()).ToArray();

                if (drv.Length > 0)
                {
                    sbTableContent.Append("<td style='text-align:center'>" + drv.Length + "</td>");
                }
                else
                {
                    sbTableContent.Append("<td style='text-align:center'>0</td>");
                }
                //No of Doctors Sample Given
                totalQty = 0.0;
                for (var j = 0; j < ds.Tables[7].Rows.Count; j++)
                {
                    drv = ds.Tables[9].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString()).ToArray();

                    if (drv.Length > 0)
                    {
                        sbTableContent.Append("<td style='text-align:center'>" + drv.Length + "</td>");
                        if (drv.Length > 0)
                        {
                            for (var k = 0; k < drv.Length; k++)
                            {
                                totalQty += Convert.ToDouble(drv[k]["COUNT"].ToString());
                            }
                        }
                    }
                    else
                    {
                        sbTableContent.Append("<td style='text-align:center'>0</td>");
                    }
                    //Total qty sample given
                    //if (ds.Tables[7].Rows[j]["Product_Type_Name"].ToString().ToUpper() == "SAMPLE")
                    //{
                    //    if (drv.Length > 0)
                    //    {
                    //        for (var k = 0; k < drv.Length; k++)
                    //        {
                    //            totalQty += Convert.ToDouble(drv[k]["COUNT"].ToString());
                    //        }
                    //    }
                    //    sbTableContent.Append("<td style='text-align:center'>" + totalQty + "</td>");
                    //}
                }
                //tableContent += "<td style='text-align:center'>0</td>";
                //No of drs added in MC
                mcDoctorCount = 0.0;
                drv = ds.Tables[12].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString() && c["Region_Code"].ToString() == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (drv.Length > 0)
                {
                    if (drv.Length > 0)
                    {
                        for (var k = 0; k < drv.Length; k++)
                        {
                            mcDoctorCount += Convert.ToDouble(drv[k]["Count"].ToString());
                        }
                    }
                }
                sbTableContent.Append("<td style='text-align:center'>" + mcDoctorCount + "</td>");
                //RCPA-My Product
                ownproductQty = 0.0;
                drv = ds.Tables[10].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString() && c["Region_Code"].ToString() == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (drv.Length > 0)
                {
                    for (var k = 0; k < drv.Length; k++)
                    {
                        ownproductQty += Convert.ToDouble(drv[k]["Price"].ToString());
                    }
                }

                sbTableContent.Append("<td style='text-align:center'>" + ((ownproductQty * 100) / 100).ToString("N2") + "</td>");
                //RCPA - Competitor Product
                CompetitorQty = 0.0;
                drv = ds.Tables[11].AsEnumerable().Where(c => c["Speciality_Code"].ToString() == ds.Tables[2].Rows[i]["Speciality_Code"].ToString() && c["Region_Code"].ToString() == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (drv.Length > 0)
                {
                    for (var k = 0; k < drv.Length; k++)
                    {
                        CompetitorQty += Convert.ToDouble(drv[k]["Price"].ToString());
                    }
                }

                sbTableContent.Append("<td style='text-align:center'>" + ((CompetitorQty * 100) / 100).ToString("N2") + "</td>");
                //% to competitor
                if (CompetitorQty != 0.0)
                {
                    var avg = (ownproductQty / (ownproductQty + CompetitorQty)) * 100;
                    sbTableContent.Append("<td style='text-align:center'>" + ((avg * 100) / 100).ToString("N2") + "</td>");
                    //sbTableContent.Append("<td style='text-align:center'>" + avg + "</td>");
                }
                else
                {
                    sbTableContent.Append("<td style='text-align:center'>0.0</td>");
                }
                sbTableContent.Append("</tr>");
            }
            sbTableContent.Append("</tbody></table>~ " + type + "");
            return sbTableContent.ToString();


        }
        public JsonResult GetSpecialityWiseAnalysisDetails(FormCollection collection)
        {

            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection["regionCode"];
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string specialityCode = collection["speciality"].ToString();
            string month = collection["Month"].ToString();
            string Year = collection["Year"].ToString();

            string dcrStatus = collection["dcrStatus"].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetSpecialityWiseAnalysisDetails_WithCalc(companyCode, regionCode, month, Year, dcrStatus, specialityCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        #region - Stockiestwise SS Report
        /// <summary>
        /// Get stockiest wise SS Report
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="productCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="viewOption"></param>
        /// <returns></returns>
        public string GetstockiestwiseSSReport(string regionCode, string productCodes, string startDate, string endDate, string viewOption)
        {
            BL_ReportRegion _objBl = new BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.SSReportModel> lstSSReportdetails = new List<MVCModels.HiDoctor_Reports.SSReportModel>();
            try
            {
                lstSSReportdetails = _objBl.GetStockiestwiseSSReport(_objcurrentInfo.GetCompanyCode(), regionCode, productCodes, startDate, endDate).ToList();
                StringBuilder strTbl = new StringBuilder();
                if (viewOption.ToUpper() == "S")
                {
                    strTbl = GetSSSReprotinHTMLFormat(lstSSReportdetails, startDate, endDate, regionCode);                    
                }
                else
                {
                    string SSReport = GetSSSReprotinHTMLFormat(lstSSReportdetails, startDate, endDate,regionCode).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "Stockiest wise Secondary Sales report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(SSReport, accKey, fileName, "bulkdatasvc");

                    strTbl.Append("<a href='" + blobUrl + "'>Click here to download</a>");
                }
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("productCode", productCodes);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewOption", viewOption);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        
        public string GetstockiestwiseSSOldReport(string regionCode, string productCodes, string stockiestCodes, string startDate, string endDate, string viewOption)
        {
            BL_ReportRegion _objBl = new BL_ReportRegion();
            List<MVCModels.HiDoctor_Reports.StockiestSSOLdReport> lstSSReportdetails = new List<MVCModels.HiDoctor_Reports.StockiestSSOLdReport>();
            try
            {
                lstSSReportdetails = _objBl.GetstockiestwiseSSOldReport(_objcurrentInfo.GetCompanyCode(), regionCode, productCodes, stockiestCodes, startDate, endDate).ToList();
                StringBuilder strTbl = new StringBuilder();
                if (viewOption.ToUpper() == "S")
                {
                    strTbl = GetSSSReprotinHTMLFormatOld(lstSSReportdetails, startDate, endDate, regionCode);
                }
                else
                {
                    string SSReports = GetSSSReprotinHTMLFormatOld(lstSSReportdetails, startDate, endDate, regionCode).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                    string userName = _objCurInfo.GetUserName();
                    string compCode = _objCurInfo.GetCompanyCode();

                    string fileName = "Stockiest wise Secondary Sales report" + "_" + compCode + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(SSReports, accKey, fileName, "bulkdatasvc");

                    strTbl.Append("<a href='" + blobUrl + "'>Click here to download</a>");
                }
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("productCode", productCodes);
                dicContext.Add("stockiestCodes", stockiestCodes);
                dicContext.Add("startDate", startDate);
                dicContext.Add("endDate", endDate);
                dicContext.Add("viewOption", viewOption);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }



        public Dictionary<string, string> GetMOnthNames(DateTime d1, DateTime d2)
        {
            //  var monthList = new List<string>();
            Dictionary<string, string> monthList = new Dictionary<string, string>();
            while (d1 < d2)
            {
                monthList.Add(d1.ToString("M-yyyy"), d1.ToString("MMM-yyyy"));
                d1 = d1.AddMonths(1);
            }
            return monthList;
        }

        public StringBuilder GetSSSReprotinHTMLFormat(List<MVCModels.HiDoctor_Reports.SSReportModel> lstSSDetailsReport, string startDate, string endDate, string selectedRegionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            string divisionName = string.Empty;
            string regionName = string.Empty;
            string userName = string.Empty;
            string employeeNumber = string.Empty;
            string emplpoyeeName = string.Empty;
            string reportingManagerName = string.Empty;
            string reportingManagerTerrName = string.Empty;
            string designation = string.Empty;
            string stokiestName = string.Empty;
            string stockiestCodes =  string.Empty;
            string doj = string.Empty;
            string privilegeValues = string.Empty;
            string isInheritedandPool = string.Empty;
            bool showssDate = false;
            bool isInheritnopool = false;
            bool monthcheck = false;
            bool stockcheck = false;
            bool regioncheck = false;
            bool grandCheck = false;
            bool productcheck = false;          
            bool entryCheck = false;

            // string[] mandatory_ColumnsArr = mandatory_Columns.Trim().Split(',');

            int showCount = 0;
            string displayPrivilegevalues = string.Empty;


            var lstUserTypes = lstSSDetailsReport[0].lstUserTypes.ToList();
            if (lstSSDetailsReport[0].lstUserTypes != null && lstSSDetailsReport[0].lstUserTypes.Count > 0)
            {
                foreach (var privilegevalue in lstSSDetailsReport[0].lstUserTypes)
                {
                    privilegeValues += privilegevalue.Privilege_Value_Name + ',';
                }
            }

            string[] ss_privilege = privilegeValues.Split(',');

            string[] privArr = ss_privilege.Distinct().ToArray();


            int colspn = 14 + ((privArr.Length-1) * 2);
            int nostoccolspan = 4 + (privArr.Length * 2);
            int noproductcolspan = 1 + (privArr.Length * 2);

            Dictionary<string, string> lstMonth;
            lstMonth = GetMOnthNames(Convert.ToDateTime(startDate), Convert.ToDateTime(endDate));
            var distintRegions = lstSSDetailsReport[0].lstSSUsers.Select(s => s.Region_Code).Distinct().ToList();
            //Added Legends
            strTbl.Append("<div style='margin-left: 7px;'>");
            strTbl.Append("<lable>1)<span style='font-weight:bold;'> Unit Price</span> is based on Price defined in price group PTS Column at that point of time.</lable><br/>");
            strTbl.Append("<lable>2)<span style='font-weight:bold;'> Sales Qty and Closing Qty</span> is the quantity entered in Secondary Sales.</lable><br/>");
            strTbl.Append("<lable>3)<span style='font-weight:bold;'> Sales Value : </span> Sales Qty * Unit Price.</lable><br/>");
            strTbl.Append("<lable>4)<span style='font-weight:bold;'> Closing Value : </span> Closing Qty * Unit Price.</lable>");
            strTbl.Append("</div><br/>");

            strTbl.Append("<table  cellspacing='0' cellpadding='0'  class='table table-striped'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr style='background-color: #428bca'>");
            strTbl.Append("<td>Region Name</td>");
            strTbl.Append("<td>User Name</td>");
            strTbl.Append("<td>Employee Number</td>");
            strTbl.Append("<td>Employee Name</td>");
            strTbl.Append("<td>Date of Joining</td>");
            strTbl.Append("<td>Designation</td>");
            strTbl.Append("<td>Division Name</td>");
            strTbl.Append("<td>Reporting Manager Name</td>");
            strTbl.Append("<td>Reporting Manager Territory Name</td>");
            strTbl.Append("<td>Stockiest Name</td>");
            strTbl.Append("<td>Stokiest Code</td>");
            strTbl.Append("<td>Period</td>");
            strTbl.Append("<td>Product Name</td>");
            strTbl.Append("<td>Pool %age applicable for this Product</td>");
            if (privArr.Length > 0)
            {
                for (int s = 0; s < privArr.Length; s++)
                {
                    if (privArr[s].ToUpper() == "OPENING_BALANCE")
                    {
                        strTbl.Append("<td>Opening Bal Qty</td>");
                        strTbl.Append("<td>Opening Bal Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "PURCHASE")
                    {
                        strTbl.Append("<td>Purchase Qty</td>");
                        strTbl.Append("<td>Purchase Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                    {
                        strTbl.Append("<td>Purchase Return Qty</td>");
                        strTbl.Append("<td>Purchase Return Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "SALES_RETURN")
                    {
                        strTbl.Append("<td>Sales Return Qty</td>");
                        strTbl.Append("<td>Sales Return Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "SALES")
                    {
                        strTbl.Append("<td>Sales Qty</td>");
                        strTbl.Append("<td>Sales Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                    {
                        strTbl.Append("<td>Closing Bal Qty</td>");
                        strTbl.Append("<td>Closing Bal Value</td>");
                    }
                    else if (privArr[s].ToUpper() == "TRANSIT")
                    {
                        strTbl.Append("<td>Transit Qty</td>");
                        strTbl.Append("<td>Transit Value</td>");
                    }
                }
            }
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");

            if (lstSSDetailsReport[0].lstSSDetails != null && lstSSDetailsReport[0].lstSSDetails.Count > 0)
            {
                double grdTotOBQty = 0.00, grdTotOBVal = 0.00, grdTotpurQty = 0.00, grdTotpurVal = 0.00, grdTotpurretQty = 0.00, grdTotpurretVal = 0.00;
                double grdTotsalQty = 0.00, grdTotSalval = 0.00, grdTotsalretQty = 0.00, grdTotsalretVal = 0.00, grdTotcloseQty = 0.00, grdTotcloseVal = 0.00;
                double grdTotTranQty = 0.00, grdTotTranVal = 0.00;

                var distinctRegioncodes = lstSSDetailsReport[0].lstSSUsers.Select(s => s.Region_Code).Distinct().ToList();
                if (distinctRegioncodes != null && distinctRegioncodes.Count > 0)
                {
                    int regionCount = 1;                  

                    foreach (var regionCode in distinctRegioncodes)
                    {
                        int chechregion = 1;
                        int entrycount = 0;
                        entryCheck = false;

                        double regTotOBQty = 0.00, regTotOBVal = 0.00, regTotpurQty = 0.00, regTotpurVal = 0.00, regTotpurretQty = 0.00, regTotpurretVal = 0.00;
                        double regTotsalQty = 0.00, regTotSalval = 0.00, regTotsalretQty = 0.00, regTotsalretVal = 0.00, regTotcloseQty = 0.00, regTotcloseVal = 0.00;
                        double regTotTranQty = 0.00, regTotTranVal = 0.00;

                        regioncheck = false;
                        //grandCheck = false;

                        var lstStockiestforregion = lstSSDetailsReport[0].lstStockiest.Where(s => s.Region_Code == regionCode).ToList();
                        if (lstStockiestforregion != null && lstStockiestforregion.Count > 0)
                        {
                            var distinctStockforregion = lstStockiestforregion.Select(s => s.Customer_Code).Distinct().ToList();
                            if (distinctStockforregion != null && distinctStockforregion.Count > 0)
                            {
                                int stockiestCount = 1;
                                foreach (var stockiestCode in distinctStockforregion)
                                {
                                    double stocTotOBQty = 0.00, stocTotOBVal = 0.00, stocTotpurQty = 0.00, stocTotpurVal = 0.00, stocTotpurretQty = 0.00, stocTotpurretVal = 0.00;
                                    double stocTotsalQty = 0.00, stocTotSalval = 0.00, stocTotsalretQty = 0.00, stocTotsalretVal = 0.00, stocTotcloseQty = 0.00, stocTotcloseVal = 0.00;
                                    double stocTotTranQty = 0.00, stocTotTranVal = 0.00;

                                    stockcheck = false;
                                    isInheritedandPool = "";
                                    var checkInherit = lstSSDetailsReport[0].lstSSSInherits.Where(s => s.Customer_Code == stockiestCode && s.Is_Inherited == "1").ToList();
                                    if (checkInherit != null && checkInherit.Count > 0)
                                    {
                                            isInheritedandPool = "Y";                                       
                                    }
                                    else
                                    {
                                        isInheritedandPool = "N";
                                    }
                                    if (lstMonth != null && lstMonth.Count > 0)
                                    {
                                        #region - Bind Month Details
                                        int monthCount = 1;
                                        foreach (var month in lstMonth)
                                        {
                                            double mthTotOBQty = 0.00, mthTotOBVal = 0.00, mthTotpurQty = 0.00, mthTotpurVal = 0.00, mthTotpurretQty = 0.00, mthTotpurretVal = 0.00;
                                            double mthTotsalQty = 0.00, mthTotSalval = 0.00, mthTotsalretQty = 0.00, mthTotsalretVal = 0.00, mthTotcloseQty = 0.00, mthTotcloseVal = 0.00;
                                            double mthTotTranQty = 0.00, mthTotTranVal = 0.00;

                                            monthcheck = false;
                                            showssDate = false;
                                            isInheritnopool = false;
                                            double stockiestpercentage = 0.00;
                                            double productprice = 0.00;
                                            DateTime curDate = DateTime.Now;
                                            DateTime strStartdate = new DateTime(Convert.ToInt32(month.Key.Split('-')[1]), Convert.ToInt32(month.Key.Split('-')[0]), 01);
                                            DateTime strEndDate = strStartdate.AddMonths(1).AddDays(-1);

                                            List<MVCModels.HiDoctor_Reports.SSDetailsModel> lstssdetailsforStock = new List<MVCModels.HiDoctor_Reports.SSDetailsModel>();

                                            if (isInheritedandPool.ToUpper() == "N")
                                            {
                                                lstssdetailsforStock = lstSSDetailsReport[0].lstSSDetails.Where(s => s.Region_Code == regionCode && s.Customer_Code == stockiestCode && s.Month == month.Key.Split('-')[0] && s.Year == month.Key.Split('-')[1]).ToList();
                                            }
                                            else
                                            {
                                                lstssdetailsforStock = lstSSDetailsReport[0].lstSSDetails.Where(s => s.Customer_Code == stockiestCode && s.Month == month.Key.Split('-')[0] && s.Year == month.Key.Split('-')[1]).ToList();
                                            }
                                            #region - Bind SSData
                                            if (lstssdetailsforStock != null && lstssdetailsforStock.Count > 0)
                                            {
                                                int productCount = 0;
                                               

                                                foreach (var ssdetails in lstssdetailsforStock)
                                                {
                                                    productcheck = false;
                                                    showssDate = false;

                                                    if (isInheritedandPool.ToUpper() == "N")
                                                    {
                                                        stockiestpercentage = 100.00;
                                                        showssDate = true;
                                                        showCount++;
                                                    }
                                                    else
                                                    {       
                                                        var lstPoolpercentage = lstSSDetailsReport[0].lstPricepercentage.Where(s => s.Region_Code == regionCode && s.Product_Code == ssdetails.Product_Code && s.Stockist_Code == stockiestCode && (strStartdate.Date >= s.Effective_From.Date &&  strStartdate.Date <= s.Effective_To.Date.Date)).ToList();


                                                        if (lstPoolpercentage != null && lstPoolpercentage.Count > 0)
                                                        {                                                         
                                                            stockiestpercentage = lstPoolpercentage[0].Share_Percentage;
                                                            showssDate = true;
                                                            showCount++;
                                                        }
                                                        else
                                                        {
                                                            isInheritnopool = true;
                                                        }
                                                    }
                                                    #region Bind Content
                                                    if (showssDate)
                                                    {  
                                                        productcheck = true;
                                                        monthcheck = true;
                                                        stockcheck = true;
                                                        regioncheck = true;
                                                        grandCheck = true;
                                                       
                                                        if (chechregion == 1)
                                                        {
                                                            if (!entryCheck)
                                                            {
                                                                entryCheck = true;
                                                                entrycount++;
                                                            }
                                                            else
                                                            {
                                                                entrycount++;
                                                            }
                                                        }

                                                        var lstRegiondetails = lstSSDetailsReport[0].lstSSUsers.Where(s => s.Region_Code == regionCode).ToList();
                                                        var lstDivision = lstSSDetailsReport[0].lstSSDivisions.Where(s => s.Entity_Code == regionCode).ToList();
                                                     

                                                        if (lstRegiondetails != null && lstRegiondetails.Count > 0)
                                                        {
                                                            stockiestCodes = "";
                                                            stokiestName = "";

                                                             var lstcustomername = lstSSDetailsReport[0].lstCustomermodel.Where(s => s.Region_Code == regionCode && s.Customer_Code == stockiestCode).ToList();
                                                             if (lstcustomername != null && lstcustomername.Count > 0)
                                                             {
                                                                 foreach (var customer in lstcustomername)
                                                                 {
                                                                     stokiestName = customer.Customer_Name;
                                                                     stockiestCodes = customer.Stockiest_Code;
                                                                 }
                                                             }
                                                           
                                                            regionName = lstRegiondetails[0].Region_Name;
                                                            strTbl.Append("<tr>");
                                                            if (entryCheck && entrycount == 1 && chechregion == 1)
                                                            {
                                                                strTbl.Append("<td>" + lstRegiondetails[0].Region_Name + "</td>"); //Region Name
                                                                strTbl.Append("<td>" + lstRegiondetails[0].User_Name + "</td>");//User Name
                                                                strTbl.Append("<td>" + lstRegiondetails[0].Employee_Number + "</td>");//Employee Number
                                                                strTbl.Append("<td>" + lstRegiondetails[0].Employee_Name + "</td>");//Employee Name
                                                                strTbl.Append("<td>" + lstRegiondetails[0].DOJ + "</td>");//DOJ
                                                                strTbl.Append("<td>" + lstRegiondetails[0].User_Type_Name + "</td>");//Designation
                                                                //Division Name
                                                                if (lstDivision != null && lstDivision.Count > 0)
                                                                {
                                                                    divisionName = "";
                                                                    foreach (var division in lstDivision)
                                                                    {
                                                                        divisionName += division.Division_Name + ',';
                                                                    }
                                                                    if (!string.IsNullOrEmpty(divisionName))
                                                                    {
                                                                        divisionName = divisionName.TrimEnd(',');
                                                                    }
                                                                }
                                                                strTbl.Append("<td>" + divisionName + "</td>");//Division Name
                                                                strTbl.Append("<td>" + lstRegiondetails[0].Reporting_Manager_Name + "</td>");//Reporting Manager Name
                                                                strTbl.Append("<td>" + lstRegiondetails[0].ReportingManager_Region_Name + "</td>");//Reporting manager territory Name
                                                            }
                                                            else
                                                            {
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                                strTbl.Append("<td></td>");
                                                            }
                                                            if (stockiestCount > 0 && productCount == 0 && monthcheck)
                                                            {
                                                                strTbl.Append("<td>" + stokiestName + "</td>");//Stockiest Name
                                                                strTbl.Append("<td>" + stockiestCodes + "</td>");//Stockiest Code
                                                            }
                                                            else
                                                            {
                                                                if (isInheritnopool) //Stockiest is inherited but no pool allowcation
                                                                {
                                                                    strTbl.Append("<td>" + stokiestName + "</td>");//Stockiest Name
                                                                    strTbl.Append("<td>" + stockiestCodes + "</td>");//Stockiest Code
                                                                }
                                                                else
                                                                {
                                                                    strTbl.Append("<td></td>");
                                                                    strTbl.Append("<td></td>");
                                                                }
                                                            }

                                                            if (productCount == 0)
                                                            {
                                                                strTbl.Append("<td>" + month.Value + "</td>");
                                                            }
                                                            else
                                                            {
                                                                strTbl.Append("<td></td>");
                                                            }

                                                            strTbl.Append("<td>" + ssdetails.Product_Name + "</td>");//Product Name
                                                            strTbl.Append("<td>" + stockiestpercentage + "</td>");//Pool percentage
                                                            if (privArr.Length > 0)
                                                            {
                                                                for (int s = 0; s < privArr.Length; s++)
                                                                {
                                                                    if (privArr[s].ToUpper() == "OPENING_BALANCE")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;                                                                      
                                                                        quantity = (Convert.ToInt32(ssdetails.Opening_Stock) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For Total
                                                                        mthTotOBQty = mthTotOBQty + quantity;
                                                                        mthTotOBVal = mthTotOBVal + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "PURCHASE")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;                                                                       
                                                                        quantity = (Convert.ToInt32(ssdetails.Purchase) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        mthTotpurQty = mthTotpurQty + quantity;
                                                                        mthTotpurVal = mthTotpurVal + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;                                                                       
                                                                        quantity = (Convert.ToInt32(ssdetails.Purchase_Return) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For month Total
                                                                        mthTotpurretQty = mthTotpurretQty + quantity;
                                                                        mthTotpurretVal = mthTotpurretVal + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "SALES_RETURN")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;                                                                      
                                                                        quantity = (Convert.ToInt32(ssdetails.Sales_Return) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For Month Total
                                                                        mthTotsalretQty = mthTotsalretQty + quantity;
                                                                        mthTotsalretVal = mthTotsalretVal + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "SALES")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;
                                                                        //Sales Balance and Quantity                                                                       
                                                                        quantity = (Convert.ToInt32(ssdetails.Sales) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For Total
                                                                        mthTotsalQty = mthTotsalQty + quantity;
                                                                        mthTotSalval = mthTotSalval + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;
                                                                        //closing Balance and Quantity
                                                                        quantity = Math.Round(((Convert.ToInt32(ssdetails.Closing_Stock) * stockiestpercentage) / 100));
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For Total
                                                                        mthTotcloseQty = mthTotcloseQty + quantity;
                                                                        mthTotcloseVal = mthTotcloseVal + quanityvalue;
                                                                    }
                                                                    else if (privArr[s].ToUpper() == "TRANSIT")
                                                                    {
                                                                        double quantity = 0.00;
                                                                        double quanityvalue = 0.00;
                                                                        //transit Balance and Quantity
                                                                       
                                                                        quantity = (Convert.ToInt32(ssdetails.Transit) * stockiestpercentage) / 100;
                                                                        quanityvalue = quantity * ssdetails.Price_Per_Unit;
                                                                        strTbl.Append("<td>" + quantity + "</td>");
                                                                        strTbl.Append("<td>" + quanityvalue + "</td>");

                                                                        //For Total
                                                                        mthTotTranQty = mthTotTranQty + quantity;
                                                                        mthTotTranVal = mthTotTranVal + quanityvalue;
                                                                    }
                                                                }
                                                            }
                                                            strTbl.Append("</tr>");
                                                        }

                                                    }
                                                    #endregion Bind Content
                                                    productCount++;
                                                }

                                            }
                                            #endregion - Bind SS Data


                                            #region - Month Total
                                            if (monthcheck)
                                            {
                                                strTbl.Append("<tr style='font-weight:bold;'>");
                                                strTbl.Append("<td colspan='11' class='totalMonth'></td>");
                                                strTbl.Append("<td colspan='3' class='totalMonth'>Total for " + month.Value + "</td>");
                                                if (privArr.Length > 0)
                                                {
                                                    for (int s = 0; s < privArr.Length; s++)
                                                    {
                                                        if (privArr[s].ToUpper() == "OPENING_BALANCE")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotOBQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotOBVal + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "PURCHASE")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotpurQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotpurVal + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotpurretQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotpurretVal + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "SALES_RETURN")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotsalretQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotsalretVal + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "SALES")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotsalQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotSalval + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotcloseQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotcloseVal + "</td>");
                                                        }
                                                        else if (privArr[s].ToUpper() == "TRANSIT")
                                                        {
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotTranQty + "</td>");
                                                            strTbl.Append("<td class='totalMonth'>" + mthTotTranVal + "</td>");
                                                        }
                                                    }
                                                }
                                                strTbl.Append("</tr>");

                                            }
                                            #endregion - Month Total

                                            stocTotOBQty = stocTotOBQty + mthTotOBQty;
                                            stocTotOBVal = stocTotOBVal + mthTotOBVal;
                                            stocTotpurQty = stocTotpurQty + mthTotpurQty;
                                            stocTotpurVal = stocTotpurVal + mthTotpurVal;
                                            stocTotpurretQty = stocTotpurretQty + mthTotpurretQty;
                                            stocTotpurretVal = stocTotpurretVal + mthTotpurretVal;
                                            stocTotsalretQty = stocTotsalretQty + mthTotsalretQty;
                                            stocTotsalretVal = stocTotsalretVal + mthTotsalretVal;
                                            stocTotsalQty = stocTotsalQty + mthTotsalQty;
                                            stocTotSalval = stocTotSalval + mthTotSalval;
                                            stocTotcloseQty = stocTotcloseQty + mthTotcloseQty;
                                            stocTotcloseVal = stocTotcloseVal + mthTotcloseVal;
                                            stocTotTranQty = stocTotTranQty + mthTotTranQty;
                                            stocTotTranVal = stocTotTranVal + mthTotTranVal;

                                            monthCount++;
                                        }
                                        #endregion - Bind Month Details
                                    }

                                    #region - Stockiest total count
                                    if (stockcheck)
                                    {
                                        //Total for Stockiest based
                                        strTbl.Append("<tr style='font-weight:bold;'>");
                                        strTbl.Append("<td colspan='10' class='totalStock'>&nbsp;</td>");
                                        strTbl.Append("<td colspan='4' class='totalStock'>Total for " + stokiestName + "</td>");
                                        if (privArr.Length > 0)
                                        {
                                            for (int s = 0; s < privArr.Length; s++)
                                            {
                                                if (privArr[s].ToUpper() == "OPENING_BALANCE")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotOBQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotOBVal + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "PURCHASE")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotpurQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotpurVal + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotpurretQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotpurretVal + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "SALES_RETURN")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotsalretQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotsalretVal + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "SALES")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotsalQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotSalval + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotcloseQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotcloseVal + "</td>");
                                                }
                                                else if (privArr[s].ToUpper() == "TRANSIT")
                                                {
                                                    strTbl.Append("<td class='totalStock'>" + stocTotTranQty + "</td>");
                                                    strTbl.Append("<td class='totalStock'>" + stocTotTranVal + "</td>");
                                                }
                                            }
                                        }
                                        strTbl.Append("</tr>");
                                    }


                                    #endregion - Stockiest total count

                                    //Overall Total for region
                                    regTotOBQty = regTotOBQty + stocTotOBQty;
                                    regTotOBVal = regTotOBVal + stocTotOBVal;
                                    regTotpurQty = regTotpurQty + stocTotpurQty;
                                    regTotpurVal = regTotpurVal + stocTotpurVal;
                                    regTotpurretQty = regTotpurretQty + stocTotpurretQty;
                                    regTotpurretVal = regTotpurretVal + stocTotpurretVal;
                                    regTotsalretQty = regTotsalretQty + stocTotsalretQty;
                                    regTotsalretVal = regTotsalretVal + stocTotsalretVal;
                                    regTotsalQty = regTotsalQty + stocTotsalQty;
                                    regTotSalval = regTotSalval + stocTotSalval;
                                    regTotcloseQty = regTotcloseQty + stocTotcloseQty;
                                    regTotcloseVal = regTotcloseVal + stocTotcloseVal;
                                    regTotTranQty = regTotTranQty + stocTotTranQty;
                                    regTotTranVal = regTotTranVal + stocTotTranVal;

                                    stockiestCount++;
                                }
                            }
                        }
                        #region - Bind regionwise Total
                        if (regioncheck)
                        {
                            //Total for Stockiest based
                            strTbl.Append("<tr style='font-weight:bold;'>");                          
                            strTbl.Append("<td colspan='4' class='totalregion'>Total For(" + regionName + ")</td>");
                            strTbl.Append("<td colspan='10' class='totalregion'>&nbsp;</td>");
                            if (privArr.Length > 0)
                            {
                                for (int s = 0; s < privArr.Length; s++)
                                {
                                    if (privArr[s].ToUpper() == "OPENING_BALANCE")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotOBQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotOBVal + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "PURCHASE")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotpurQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotpurVal + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotpurretQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotpurretVal + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "SALES_RETURN")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotsalretQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotsalretVal + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "SALES")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotsalQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotSalval + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotcloseQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotcloseVal + "</td>");
                                    }
                                    else if (privArr[s].ToUpper() == "TRANSIT")
                                    {
                                        strTbl.Append("<td class='totalregion'>" + regTotTranQty + "</td>");
                                        strTbl.Append("<td class='totalregion'>" + regTotTranVal + "</td>");
                                    }
                                }
                                //Grand Total for Region
                                grdTotOBQty = grdTotOBQty + regTotOBQty;
                                grdTotOBVal = grdTotOBVal + regTotOBVal;
                                grdTotpurQty = grdTotpurQty + regTotpurQty;
                                grdTotpurVal = grdTotpurVal + regTotpurVal;
                                grdTotpurretQty = grdTotpurretQty + regTotpurretQty;
                                grdTotpurretVal = grdTotpurretVal + regTotpurretVal;
                                grdTotsalretQty = grdTotsalretQty + regTotsalretQty;
                                grdTotsalretVal = grdTotsalretVal + regTotsalretVal;
                                grdTotsalQty = grdTotsalQty + regTotsalQty;
                                grdTotSalval = grdTotSalval + regTotSalval;
                                grdTotcloseQty = grdTotcloseQty + regTotcloseQty;
                                grdTotcloseVal = grdTotcloseVal + regTotcloseVal;
                                grdTotTranQty = grdTotTranQty + regTotTranQty;
                                grdTotTranVal = grdTotTranVal + regTotTranVal;
                            }
                            strTbl.Append("</tr>");
                        }
                        #endregion - Bind regionwise Total
                        regionCount++;
                    }
                    #region - Bind Grand Total
                    //Total for Region based
                    if (grandCheck)
                    {
                        strTbl.Append("<tr style='font-weight:bold;'>");
                        strTbl.Append("<td colspan='3' class='grandtotal'>Grand Total</td>");
                        strTbl.Append("<td colspan='11' class='grandtotal'>&nbsp;</td>");
                        if (privArr.Length > 0)
                        {
                            for (int s = 0; s < privArr.Length; s++)
                            {
                                if (privArr[s].ToUpper() == "OPENING_BALANCE")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotOBQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotOBVal + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "PURCHASE")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotpurQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotpurVal + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "PURCHASE_RETURN")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotpurretQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotpurretVal + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "SALES_RETURN")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotsalretQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotsalretQty + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "SALES")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotsalQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotSalval + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "CLOSING_BALANCE")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotcloseQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotcloseVal + "</td>");
                                }
                                else if (privArr[s].ToUpper() == "TRANSIT")
                                {
                                    strTbl.Append("<td class='grandtotal'>" + grdTotTranQty + "</td>");
                                    strTbl.Append("<td class='grandtotal'>" + grdTotTranVal + "</td>");
                                }
                            }
                        }
                    }
                    #endregion - Bind Grand Total
                }
            }
            else
            {
                if (!showssDate)
                {
                    strTbl.Append("<tr><td colspan='" + colspn + "' style='text-align:center;'>No Secondary Details found.</td></tr>");
                }
            }

            strTbl.Append("</tbody>");
            strTbl.Append("</table>");
            return strTbl;
        }             
           

        #endregion - Stockiestwise SS Report


        public StringBuilder GetSSSReprotinHTMLFormatOld(List<MVCModels.HiDoctor_Reports.StockiestSSOLdReport> lstSSDetailsReport, string startDate, string endDate, string selectedRegionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            strTbl.Append("<table id='divReport'  class='table table-striped'><thead><th>Division_Name</th><th>Region_Name</th><th>Reporting_Region</th><th>Customer_Name</th><th>Stockiest_Ref_Key</th><th>Product_Name</th><th>Ref_Key1</th><th>Year</th><th>Month</th><th>Price_Per_Unit</th><th>Opening_Stock</th><th>Opening_Stock_Value</th><th>Purchase</th><th>Purchase_Value</th><th>Purchase_Return</th><th>Purchase_Return_Value</th><th>Sales</th><th>Sales_Value</th><th>Sales_Return</th><th>Sales_Return_Value</th><th>Closing_Stock</th><th>Closing_Stock_Value</th><th>Transit</th><th>Transit_Value</th></thead>");
            strTbl.Append("<tbody>");

            if (lstSSDetailsReport != null && lstSSDetailsReport.Count > 0 )
            {
            foreach (var item in lstSSDetailsReport)
            {
                strTbl.Append("<tr>");
                strTbl.Append("<td>" + item.Division_Name + "</td>");
                strTbl.Append("<td>" + item.Region_Name + "</td>");
                strTbl.Append("<td>" + item.Reporting_Region + "</td>");
                strTbl.Append("<td>" + item.Customer_Name + "</td>");
                strTbl.Append("<td>" + item.Stockiest_Ref_Key + "</td>");
                strTbl.Append("<td>" + item.Product_Name + "</td>");
                strTbl.Append("<td>" + item.Ref_Key1 + "</td>");
                strTbl.Append("<td>" + item.Year + "</td>");
                strTbl.Append("<td>" + item.Month + "</td>");
                strTbl.Append("<td>" + item.Price_Per_Unit + "</td>");
                strTbl.Append("<td>" + item.Opening_Stock + "</td>");
                strTbl.Append("<td>" + item.Opening_Stock_Value + "</td>");
                strTbl.Append("<td>" + item.Purchase + "</td>");
                strTbl.Append("<td>" + item.Purchase_Value + "</td>");
                strTbl.Append("<td>" + item.Purchase_Return + "</td>");
                strTbl.Append("<td>" + item.Purchase_Return_Value + "</td>");
                strTbl.Append("<td>" + item.Sales + "</td>");
                strTbl.Append("<td>" + item.Sales_Value + "</td>");
                strTbl.Append("<td>" + item.Sales_Return + "</td>");
                strTbl.Append("<td>" + item.Sales_Return_Value + "</td>");
                strTbl.Append("<td>" + item.Closing_Stock + "</td>");
                strTbl.Append("<td>" + item.Closing_Stock_Value + "</td>");
                strTbl.Append("<td>" + item.Transit + "</td>");
                strTbl.Append("<td>" + item.Transit_Value + "</td>");
                strTbl.Append("</tr>");
            }
            }
            else{
                strTbl.Append("<tr>");
                strTbl.Append("<th style='text-align:center;width: 15%;font-size: 17px;color: #4a89dc!important;' colspan='13'>No Secondary Details found</th>");
                strTbl.Append("</tr>");
                 //strTbl.Append("<tr><td style='text-align:center;'>No Secondary Details found.</td></tr>");
                }

            strTbl.Append("</tbody></table>");
            return strTbl;         
        }             

        public string GetStockiestWiseSecReport(DataSet ds)
        {
            double amount = 0;
            double salesReturn = 0;
            double closingStock = 0;
            double closingAmount = 0;
            double dblAmount = 0.0;
            double dblClosingBalance = 0.0;
            string divisionName = string.Empty;
            DataRow[] drv;
            DataRow[] drvDivision;
            StringBuilder sbTableContent = new StringBuilder();
            sbTableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSecondarySales' >");
            sbTableContent.Append("<thead><tr>");
            sbTableContent.Append("<th>User Name</th>");
            sbTableContent.Append("<th>Employee Name</th>");
            sbTableContent.Append("<th>Region Name</th>");
            sbTableContent.Append("<th>Division Name</th>");
            sbTableContent.Append("<th>Manager Name</th>");
            sbTableContent.Append("<th>Manager Region</th>");
            sbTableContent.Append("<th>Stockiest Name</th>");
            sbTableContent.Append("<th>Product Name</th>");
            sbTableContent.Append("<th>Month</th>");
            sbTableContent.Append("<th>Year</th>");
            sbTableContent.Append("<th>Sales Qty</th>");
            sbTableContent.Append("<th>Unit Price</th>");
            sbTableContent.Append("<th>Sales Value</th>");
            sbTableContent.Append("<th>Sales Return Qty</th>");
            sbTableContent.Append("<th>Closing Balance Qty</th>");
            sbTableContent.Append("<th>Closing Balance Value</th>");
            sbTableContent.Append("</tr></thead>");
            sbTableContent.Append("<tbody>");

            DataTable dtSecondarySales = ds.Tables[0];
            DataTable dtUserInfo = ds.Tables[1];
            DataTable dtDivisionInfo = ds.Tables[2];
            if (dtSecondarySales.Rows.Count > 0)
            {
                foreach (DataRow dr in dtSecondarySales.Rows)
                {
                    drv = dtUserInfo.AsEnumerable().Where(c => c["Region_Code"].ToString() == dr["Region_Code"].ToString()).ToArray();

                    if (drv.Length > 0)
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(drv[0]["User_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(drv[0]["Employee_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(drv[0]["Region_Name"].ToString());
                        sbTableContent.Append("</td>");
                        divisionName = "";
                        if (dtDivisionInfo.Rows.Count > 0)
                        {
                            drvDivision = dtDivisionInfo.AsEnumerable().Where(c => c["Region_Code"].ToString() == dr["Region_Code"].ToString()).ToArray();
                            if (drvDivision.Length > 0)
                            {
                                foreach (DataRow drDiv in drvDivision)
                                {
                                    divisionName += drDiv["Division_Name"].ToString() + ",";
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(divisionName))
                        {
                            divisionName = divisionName.TrimEnd(',');
                        }
                        dblAmount = 0.0;
                        amount = Convert.ToDouble(amount) + (Convert.ToDouble(dr["Amount"].ToString()) * 100) / 100;
                        salesReturn = Convert.ToDouble(salesReturn) + Convert.ToDouble(dr["Sales_Return"].ToString());
                        closingStock = Convert.ToDouble(closingStock) + Convert.ToDouble(dr["Closing_Stock"].ToString());
                        closingAmount = Convert.ToDouble(closingAmount) + (Convert.ToDouble(dr["Closing_Amount"].ToString()) * 100) / 100;
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(divisionName);
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(drv[0]["Manager_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(drv[0]["Manager_Region_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(dr["Customer_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(dr["Product_Name"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(dr["Month"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='left' width='15%'>");
                        sbTableContent.Append(dr["Year"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dr["Sales"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dr["Price_Per_Unit"].ToString());
                        sbTableContent.Append("</td>");

                        dblAmount = (Convert.ToDouble(dr["Amount"].ToString()) * 100) / 100;
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dblAmount.ToString("N2"));
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dr["Sales_Return"].ToString());
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dr["Closing_Stock"].ToString());
                        sbTableContent.Append("</td>");
                        dblClosingBalance = (Convert.ToDouble(dr["Closing_Amount"].ToString()) * 100) / 100;
                        sbTableContent.Append("<td align='center' width='15%'>");
                        sbTableContent.Append(dblClosingBalance.ToString("N2"));
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("</tr>");
                    }

                }

            }
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("<tbody><tfoot>");
            sbTableContent.Append("<tr>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th></th>");
            sbTableContent.Append("<th>Total</th>");
            sbTableContent.Append("<th align='center'>");
            sbTableContent.Append(amount.ToString("N2"));
            sbTableContent.Append("</th>");
            sbTableContent.Append("<th align='center'>");
            sbTableContent.Append(salesReturn.ToString("N2"));
            sbTableContent.Append("</th>");
            sbTableContent.Append("<th align='center'>");
            sbTableContent.Append(closingStock.ToString("N2"));
            sbTableContent.Append("</th>");
            sbTableContent.Append("<th align='center'>");
            sbTableContent.Append(closingAmount.ToString("N2"));
            sbTableContent.Append("</th>");
            sbTableContent.Append("</tr>");
            sbTableContent.Append("</tfoot>");
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("</table>");
            return sbTableContent.ToString();

        }
        public JsonResult GetStockistWiseUnderOverStockReport(FormCollection collection)
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

            ds = _objSPData.GetStockistWiseUnderOverStockReport(companyCode, "''", regionCodes, startDate, endDate, productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStockistWiseUnderOverStockReportDetails(FormCollection collection)
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
        public JsonResult GetSecondarySalesTrendAnalysisNew(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
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

            ds = _objSPData.GetSecondarySalesTrendAnalysisNew(companyCode, "''", regionCodes, startDate, endDate, productCode);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }
        public string GetVacancyReport(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            DataSet ds = new DataSet();
            string divisionName = "";
            string createdDate = "", effToDate = "", doj = "", fromDate = "", toDate = "";
            DataRow[] drFilter;
            int daysCount = 0;
            StringBuilder tableContent = new StringBuilder();
            ds = _objSPData.GetVacancyReport(companyCode, regionCode, startDate, endDate);

            tableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblVacancyReport' class='data display datatable' >");
            tableContent.Append("<thead>");
            tableContent.Append("<tr style='display: none;' id='tblTr'>");
            tableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Employee Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Employee Number</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Territory Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Designation</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Division Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>DOR</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Vacancy Act. Date</th>");
            tableContent.Append("<th style='text-align:left;width: 15%' >Date of vacancy Fillup</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>No.Vacant days(based on DOR)</th>");
            tableContent.Append("<th style='text-align:left;width: 15%' >No.Vacant days(Based on Vacancy Act. Date)</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting HQ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting Manager</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting  DOJ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting HQ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting Manager</th>");
            tableContent.Append("</tr>");

            tableContent.Append("<tr>");
            tableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Employee Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Employee Number</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Territory Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Designation</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Division Name</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>DOR</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Vacancy Act. Date</th>");
            tableContent.Append("<th style='text-align:left;width: 15%' >Date of vacancy Fillup</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>No. of vacant days (based on DOR)</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>No. of vacant days (Based on Vacancy Act. Date)</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting HQ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting Manager</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Reporting  DOJ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting HQ</th>");
            tableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting Manager</th>");
            tableContent.Append("</tr>");

            string type = "[{ type: 'text' },{ type: 'text' },{ type: 'number-range' },{ type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'date-range' }, { type: 'date-range' }, { type: 'date-range' }, { type: 'number-range' }, { type: 'number-range' },{ type: 'text' }";
            type += ",{ type: 'text' },{ type: 'date-range' },{ type: 'text' },{ type: 'text' }]";
            tableContent.Append("<tr >");
            tableContent.Append("<th colspan= '16' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
            tableContent.Append("</tr></thead>");
            tableContent.Append("<tbody>");
            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    divisionName = "";
                    drFilter = ds.Tables[1].Select("Region_Code='" + dr["Region_Code"].ToString() + "' ");
                    if (drFilter.Length > 0)
                    {
                        foreach (DataRow drRow in drFilter)
                        {
                            divisionName += drRow["Division_Name"].ToString() + ",";
                        }
                        if (!string.IsNullOrEmpty(divisionName))
                        {
                            divisionName = divisionName.TrimEnd(',');
                        }
                    }

                    tableContent.Append("<tr>");
                    tableContent.Append("<td align='left'>" + dr["User_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["Employee_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["Employee_Number"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["Region_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["User_Type_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + divisionName + "</td>");
                    // DOJ
                    if ((!string.IsNullOrEmpty(dr["Date_of_Joining"].ToString())) && (dr["Date_of_Joining"].ToString() != "01/01/1900"))
                    {
                        doj = dr["Date_of_Joining"].ToString();
                        tableContent.Append("<td align='left'>" + doj + "</td>");
                    }
                    else
                    {
                        doj = "";
                        tableContent.Append("<td align='center'>-</td>");
                    }


                    // Vacancy Act. Date
                    if (!string.IsNullOrEmpty(dr["Created_Date"].ToString()))
                    {
                        createdDate = dr["Created_Date"].ToString();
                        tableContent.Append("<td align='left'>" + createdDate + "</td>");
                    }
                    else
                    {
                        createdDate = "";
                        tableContent.Append("<td align='center'>-</td>");
                    }



                    // Date of vacancy Fillup
                    if (!string.IsNullOrEmpty(dr["EndDate"].ToString()))
                    {
                        effToDate = dr["EndDate"].ToString();
                        tableContent.Append("<td align='left'>" + effToDate + "</td>");
                    }
                    else
                    {
                        effToDate = DateTime.Now.ToString("dd/MM/yyyy");
                        tableContent.Append("<td align='center'>-</td>");
                    }


                    fromDate = "";
                    toDate = "";
                    if ((!string.IsNullOrEmpty(effToDate)) && (!string.IsNullOrEmpty(doj)))
                    {
                        toDate = effToDate.Split('/')[2] + "-" + effToDate.Split('/')[1] + "-" + effToDate.Split('/')[0];
                        fromDate = doj.Split('/')[2] + "-" + doj.Split('/')[1] + "-" + doj.Split('/')[0];
                        daysCount = GetDayCount(fromDate, toDate);
                        tableContent.Append("<td align='center'>" + (daysCount) + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>-</td>");
                    }
                    fromDate = "";
                    toDate = "";
                    if ((!string.IsNullOrEmpty(effToDate)) && (!string.IsNullOrEmpty(createdDate)))
                    {
                        toDate = effToDate.Split('/')[2] + "-" + effToDate.Split('/')[1] + "-" + effToDate.Split('/')[0];
                        fromDate = createdDate.Split('/')[2] + "-" + createdDate.Split('/')[1] + "-" + createdDate.Split('/')[0];
                        daysCount = GetDayCount(fromDate, toDate);
                        tableContent.Append("<td align='center'>" + (daysCount) + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>-</td>");
                    }

                    tableContent.Append("<td align='left'>" + dr["Manager_Region_Name"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["Manager_Name"].ToString() + "</td>");
                    if (!string.IsNullOrEmpty(dr["Reporting_DOJ"].ToString()))
                    {
                        tableContent.Append("<td align='left'>" + dr["Reporting_DOJ"].ToString() + "</td>");
                    }
                    else
                    {
                        tableContent.Append("<td align='center'>-</td>");
                    }
                    tableContent.Append("<td align='left'>" + dr["LevelTwo_Region"].ToString() + "</td>");
                    tableContent.Append("<td align='left'>" + dr["LevelTwo_User"].ToString() + "</td>");
                    tableContent.Append("</tr>");

                }
            }
            tableContent.Append("</tbody>");
            tableContent.Append("</table>@" + type + "");
            return tableContent.ToString();
        }
        public static DataTable GetDistinctRecords(DataTable dt, string[] Columns)
        {
            DataTable dtUniqRecords = new DataTable();
            dtUniqRecords = dt.DefaultView.ToTable(true, Columns);
            return dtUniqRecords;
        }
        DateTime dtStartDate = new DateTime();
        DateTime dtEndDate = new DateTime();
        public int GetDayCount(string startDate, string endDate)
        {
            int intDay = 0;
            TimeSpan tsDateDiff;
            dtStartDate = Convert.ToDateTime(startDate);
            dtEndDate = Convert.ToDateTime(endDate);
            tsDateDiff = dtEndDate - dtStartDate;
            intDay = tsDateDiff.Days;
            if (intDay > 0)
            {
                return intDay;
            }
            else
            {
                return 0;
            }
        }
        public JsonResult GetCompaignName(FormCollection collection)
        {
            try
            {

                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = collection[COLL_USER_CODE];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetMarketingCampaignList " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + userCode + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetMarketingCampaignTraker(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string compaignCode = collection[COLL_COMPAIGN_CODE];
            string userCode = collection[COLL_USER_CODE];
            string startDate = collection[COLL_START_DATE];
            string endDate = collection[COLL_END_DATE];
            DataSet ds = new DataSet();
            ds = _objSPData.GetMarketingCampaignTraker(companyCode, compaignCode, userCode, "''", startDate, endDate);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMCProductDetails(FormCollection collection)
        {
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string compaignCode = collection[COLL_COMPAIGN_CODE];
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetMCProductDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + compaignCode + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //-------------------START - MC VIST DETAILS ----------------------------
        public JsonResult GetMCVisitsDetails(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetMarketingCampaignVisitsDetail " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + collection["userCode"].ToString() + "','" + collection["compaignCode"].ToString() + "'");

                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetMCVisitsDetailsPopUp(FormCollection collection)
        {
            try
            {
                DataSet dsReport = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                dsReport = _objData.ExecuteDataSet("EXEC SP_hdGetMCVisitDetailsPopUp " + "'" + _objcurrentInfo.GetCompanyCode() + "','" + collection["userCode"].ToString() + "','" + collection["doctorCode"].ToString() + "','" + collection["fromDate"].ToString() + "','" + collection["toDate"].ToString() + "'");
                return Json(json.Serialize(dsReport), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetGeoLocationReport(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string dcrStatus = collection[COLL_DCR_STATUS].ToString();
            DataSet ds = new DataSet();
            ds = _objSPData.GetGeoLocationReport(companyCode, userCode, startDate, endDate, dcrStatus);
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public string GetAuditReport(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            StringBuilder sbTableContent = new StringBuilder();
            string currentUserCode = _objcurrentInfo.GetUserCode();
            DataRow[] drv;
            DataSet ds = new DataSet();

            if (!string.IsNullOrEmpty(startDate))
            {
                startDate = startDate.Split('/')[2].ToString() + "-" + startDate.Split('/')[1].ToString() + "-" + startDate.Split('/')[0].ToString();
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                endDate = endDate.Split('/')[2].ToString() + "-" + endDate.Split('/')[1].ToString() + "-" + endDate.Split('/')[0].ToString();
            }

            ds = _objSPData.GetAuditReport(companyCode, userCode, startDate, endDate);
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dtUserDetails = ds.Tables[0];
                DataTable dtAuditDetails = ds.Tables[2];
                sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblAuditReport' class='data display datatable' >");

                foreach (DataRow dr in dtUserDetails.Rows)
                {
                    sbTableContent.Append("<tr><thead>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%' colspan='5'>User Name : " + dr["User_Name"].ToString() + " | " + dr["Region_Name"].ToString() + "</th></tr></thead>");
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%;background-color:#6082AD;color: #fff;' >Date/Time</th>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%;background-color:#6082AD;color: #fff;'>Action</th>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%;background-color:#6082AD;color: #fff;'>Orginal Value</th>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%;background-color:#6082AD;color: #fff;'>Changed  To</th>");
                    sbTableContent.Append("<th style='text-align:left;width: 15%;background-color:#6082AD;color: #fff;' >Changed By</th>");
                    sbTableContent.Append("</tr>");
                    drv = dtAuditDetails.AsEnumerable().Where(c => c["User_Code"].ToString() == dr["User_Code"].ToString()).ToArray();
                    if (drv.Length > 0)
                    {
                        foreach (DataRow drs in drv)
                        {
                            sbTableContent.Append("<tr><td align='left'>" + drs["Action_Date"].ToString() + "</td>");
                            sbTableContent.Append("<td align='left'>" + drs["Action"].ToString() + "</td>");
                            if (drs["Action"].ToString().ToUpper() == "PASSWORD CHANGE")
                            {
                                if (currentUserCode == dr["User_Code"].ToString())
                                {
                                    sbTableContent.Append("<td align='left'>" + drs["Orginal_Value"].ToString() + "</td>");
                                    sbTableContent.Append("<td align='left'>" + drs["Changed_To"].ToString() + "</td>");
                                }
                                else
                                {
                                    sbTableContent.Append("<td align='left'>*****</td>");
                                    sbTableContent.Append("<td align='left'>*****</td>");
                                }
                            }
                            else
                            {
                                sbTableContent.Append("<td align='left'>" + drs["Orginal_Value"].ToString() + "</td>");
                                sbTableContent.Append("<td align='left'>" + drs["Changed_To"].ToString() + "</td>");
                            }
                            sbTableContent.Append("<td align='left'>" + drs["Changed_by"].ToString() + "</td></tr>");
                        }
                    }
                    else
                    {
                        sbTableContent.Append("<tr>");
                        sbTableContent.Append("<th style='text-align:left;width: 15%' colspan='5'>No records found</th>");
                        sbTableContent.Append("</tr>");
                    }
                }
            }

            return sbTableContent.ToString();
        }

        public string GetVacancyReportNew(FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = collection[COLL_REGION_CODE];
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string regionStatus = collection[COLL_REGION_STATUS].ToString();
            string divisionName = string.Empty;

            DataSet ds = new DataSet();
            StringBuilder sbTableContent = new StringBuilder();
            DataRow[] drv;

            if (!string.IsNullOrEmpty(startDate))
            {
                startDate = startDate.Split('/')[2].ToString() + "-" + startDate.Split('/')[1].ToString() + "-" + startDate.Split('/')[0].ToString();
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                endDate = endDate.Split('/')[2].ToString() + "-" + endDate.Split('/')[1].ToString() + "-" + endDate.Split('/')[0].ToString();
            }

            sbTableContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblVacancyReport' class='data display datatable' >");
            sbTableContent.Append("<thead>");
            sbTableContent.Append("<tr style='display: none;' id='tblTr'>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Territory Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Employee Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Employee Number</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Designation</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Division Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Vacancy Start date</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Vacancy filled up date</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%' >No of Vacancy Days</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Reporting HQ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%' >Reporting Manager</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Reporting Manager DOJ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting HQ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting Manager</th>");
            sbTableContent.Append("</tr>");

            sbTableContent.Append("<tr>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Territory Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Employee Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Employee Number</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Designation</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Division Name</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Vacancy Start date</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Vacancy filled up date</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%' >No of Vacancy Days</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Reporting HQ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%' >Reporting Manager</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Reporting Manager DOJ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting HQ</th>");
            sbTableContent.Append("<th style='text-align:left;width: 15%'>Next Level Reporting Manager</th>");
            sbTableContent.Append("</tr>");

            string type = "[{ type: 'text' }, { type: 'text' },{ type: 'number-range' }, { type: 'text' }, { type: 'text' }, { type: 'text' }, { type: 'date-range' }, { type: 'date-range' }, { type: 'number-range' }, { type: 'text' },{ type: 'text' }";
            type += ",{ type: 'date-range' },{ type: 'text' },{ type: 'text' }]";
            sbTableContent.Append("<tr >");
            sbTableContent.Append("<th colspan= '14' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>");
            sbTableContent.Append("</tr></thead>");
            sbTableContent.Append("<tbody>");

            ds = _objSPData.GetVacancyReportNew(companyCode, regionCode, startDate, endDate, regionStatus);
            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td align='left'>" + dr["Territory_Name"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Employee_Name"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Employee_Number"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["User_Name"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Designation"].ToString() + "</td>");
                    divisionName = "";
                    drv = ds.Tables[1].AsEnumerable().Where(c => c["Region_Code"].ToString() == dr["Region_Code"].ToString()).ToArray();
                    divisionName = "";
                    if (drv.Length > 0)
                    {
                        foreach (DataRow drs in drv)
                        {
                            divisionName += drs["Division_Name"].ToString() + ",";
                        }
                    }
                    if (!string.IsNullOrEmpty(divisionName))
                    {
                        divisionName = divisionName.TrimEnd(',');
                    }
                    sbTableContent.Append("<td align='left'>" + divisionName + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Vacancy_Start_date"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Vacancy_filled_up_date"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["No_of_Vacancy_Days"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Reporting_HQ"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Reporting_Manager"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Reporting_Manager_DOJ"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Next_Level_Reporting_HQ"].ToString() + "</td>");
                    sbTableContent.Append("<td align='left'>" + dr["Next_Level_Reporting_Manager"].ToString() + "</td>");
                    sbTableContent.Append("</tr>");
                }
            }
            sbTableContent.Append("</tbody>");
            sbTableContent.Append("</table>@" + type + "");
            return sbTableContent.ToString();
        }


        public string GetDoctorVisitAnalysis(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string selection = collection["selection"].ToString();
            string reportView = collection["reportView"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            if (reportView == "1")
            {
                return _objDoctorVisit.GetDoctorVisitAnalyisData(companyCode, regionCode, startDate, endDate, selection);
            }
            else
            {
                string reportHTML = _objDoctorVisit.GetDoctorVisitAnalyisData(companyCode, regionCode, startDate, endDate, selection);
                reportHTML = reportHTML.Split('^')[0].ToString();
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objcurrentInfo.GetUserName();
                string compCode = _objcurrentInfo.GetCompanyCode();
                string fileName = "DOCTORVISITANALYSIS_" + "_" + compCode + "_" + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(reportHTML.ToString(), accKey, fileName, "bulkdatasvc");
                return "<br /><div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobUrl + ">" + blobUrl + "</a></div>";
            }
        }

        public string GetInwardAuditReport(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetInwardAuditReport(companyCode, userCode, startDate, endDate);
        }

        public string GetLastSubmittedReport(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string unlistedDoctor = collection["type"].ToString();
            string dateSelection = collection["selectionType"].ToString();
            string UserSelection = string.Empty;
            string reportName = collection["title"].ToString();
            string missedDoctor = collection["missed"].ToString();
            string reportViewType = collection["reportViewType"].ToString();
            if (userCode.ToUpper() == "ALL")
            {
                userCode = _objcurrentInfo.GetUserCode();
                UserSelection = "ALL";
            }
            else
            {
                userCode = userCode.Replace(",,", ",");
            }

            string userSelection = collection["type"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastSubmittedReport(companyCode, userCode, startDate, endDate, UserSelection, dateSelection, unlistedDoctor, reportName, missedDoctor, reportViewType);
        }

        public string GetLastsubmittedReportSub(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string userSelection = collection["type"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastSubmittedReportSub(companyCode, userCode, startDate, endDate, userSelection, regionCode);
        }
        public string GetLastsubmittedReportSubRPT(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string userSelection = collection["type"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastSubmittedReportSubRPT(companyCode, userCode, startDate, endDate, userSelection, regionCode);
        }
        public string GetLastsubmittedLeaveReportSub(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string leaveTypeName = collection["ltn"].ToString();
            string LeaveTypeCode = collection["ltc"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastsubmittedLeaveSub(companyCode, userCode, startDate, endDate, LeaveTypeCode, leaveTypeName, regionCode);
        }
        public string GetLastsubmittedLeaveReportSubRPT(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string leaveTypeName = collection["ltn"].ToString();
            string LeaveTypeCode = collection["ltc"].ToString();
            string regionCode = collection["regionCode"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastsubmittedLeaveSubRPT(companyCode, userCode, startDate, endDate, LeaveTypeCode, leaveTypeName, regionCode);
        }
        public string GetLastSubmittedReportRPT(FormCollection collection)
        {
            BAL_DoctorVisitAnalysis _objDoctorVisit = new BAL_DoctorVisitAnalysis();
            string startDate = collection["sd"].ToString();
            string endDate = collection["ed"].ToString();
            string userCode = collection["userCode"].ToString();
            string unlistedDoctor = collection["type"].ToString();
            string dateSelection = collection["selectionType"].ToString();
            string UserSelection = string.Empty;
            string reportName = collection["title"].ToString();
            string missedDoctor = collection["missed"].ToString();
            string reportViewType = collection["reportViewType"].ToString();
            if (userCode.ToUpper() == "ALL")
            {
                userCode = _objcurrentInfo.GetUserCode();
                UserSelection = "ALL";
            }
            else
            {
                userCode = userCode.Replace(",,", ",");
            }

            string userSelection = collection["type"].ToString();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            return _objDoctorVisit.GetLastSubmittedReportRPT(companyCode, userCode, startDate, endDate, UserSelection, dateSelection, unlistedDoctor, reportName, missedDoctor, reportViewType);
        }

    }
}
