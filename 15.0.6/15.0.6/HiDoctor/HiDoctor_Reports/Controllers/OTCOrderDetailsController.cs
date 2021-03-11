using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    public class OTCOrderDetailsController : Controller
    {
        //
        // GET: /OTCOrderDetails/
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private ReportRepository _objReport = new ReportRepository();
        const string COLL_START_DATE = "sd";
        const string COLL_END_DATE = "ed";
        const string COLL_DCR_STATUS = "dcrStatus";
        const string COLL_USER_CODE = "userCode";
        const string COLL_STATUS = "orderStatus";
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }
        public string GetOTCOrderDetailsReport(FormCollection collection)
        {
            DataSet ds = new DataSet();
            StringBuilder sbTableContent = new StringBuilder();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = collection[COLL_USER_CODE].ToString();
            string startDate = collection[COLL_START_DATE].ToString();
            string endDate = collection[COLL_END_DATE].ToString();
            string orderStatus = collection[COLL_STATUS].ToString();
            double deviationAvg = 0.0;

            ds = _objSPData.GetOrderStatusReport(companyCode, userCode, startDate, endDate, orderStatus);
            DataTable orderDetails = ds.Tables[0];
            DataTable orderSummary = ds.Tables[1];

            if (orderDetails.Rows.Count > 0)
            {
                sbTableContent.Append("<table width='100%' cellspacing='0' cellpadding='0' class='data display datatable' id='OtcOrderDetails'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Region Name</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order Date</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order ID</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order Status</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Reference Number</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Customer Name</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Product Name</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Product type</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order Quantity</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order Price (Rs)</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Order Value (Rs)</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Master Price</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Deviation</th>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>Deviation %</th>");
                sbTableContent.Append("</tr></thead><tbody>");

                foreach (DataRow drs in orderDetails.Rows)
                {
                    deviationAvg = 0.0;
                    sbTableContent.Append("<tr><td align='left'>");
                    sbTableContent.Append(drs["User_Name"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["Region_Name"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["SaleOrder_Date"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["SaleOrder_Code"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["SO_Approve_Status"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["Ref_Number"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["Customer_Name"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["Product_Name"].ToString());
                    sbTableContent.Append("</td><td align='left'>");
                    sbTableContent.Append(drs["Product_Type_Name"].ToString());
                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    sbTableContent.Append(drs["Ordered_Qty"].ToString());

                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    sbTableContent.Append(drs["Unit_Price"].ToString());
                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    sbTableContent.Append(drs["Grand_Total"].ToString());
                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    sbTableContent.Append(drs["Master_Price"].ToString());
                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    sbTableContent.Append(drs["Price_Difference"].ToString());
                    sbTableContent.Append("</td><td style='text-align:right;width: 15%'>");
                    if (Convert.ToDouble(drs["Master_Price"].ToString()) > 0 && Convert.ToDouble(drs["Price_Difference"].ToString()) > 0)
                    {
                        deviationAvg = (Convert.ToDouble(drs["Price_Difference"].ToString()) / Convert.ToDouble(drs["Master_Price"].ToString())) * 100;
                        sbTableContent.Append(deviationAvg.ToString("N2"));
                    }
                    else
                    {
                        sbTableContent.Append("0.0");
                    }
                    sbTableContent.Append("</td></tr>");
                }
                sbTableContent.Append("</tbody></table></br>^");
                // ORDER  SUMMARY TABLE

                int orderCount = 0;
                double dblOrderValue = 0.0;

                sbTableContent.Append("<table width='100%' cellspacing='0' cellpadding='0' class='data display datatable' id='OtcOrderSummary'>");
                sbTableContent.Append("<thead><tr>");
                sbTableContent.Append("<th style='text-align:left;width: 15%'>User Name</th>");
                sbTableContent.Append("<th style='text-align:center;width: 15%'>No of orders</th>");
                sbTableContent.Append("<th style='text-align:center;width: 15%'>Order Value</th>");
                sbTableContent.Append("</tr></thead><tbody>");

                foreach (DataRow dr in orderSummary.Rows)
                {
                    sbTableContent.Append("<tr><td style='text-align:left;width: 15%'>");
                    sbTableContent.Append(dr["User_Name"].ToString());
                    sbTableContent.Append("</td><td style='text-align:center;width: 15%'>");
                    orderCount += Convert.ToInt32(dr["Order_Count"].ToString());
                    sbTableContent.Append(dr["Order_Count"].ToString());
                    sbTableContent.Append("</td><td style='text-align:center;width: 15%'>");
                    dblOrderValue += Convert.ToDouble(dr["Total"].ToString());
                    sbTableContent.Append(dr["Total"].ToString());
                    sbTableContent.Append("</td></tr>");
                }
                sbTableContent.Append("</tbody>");

                sbTableContent.Append("<tfoot><tr>");

                sbTableContent.Append("<th style='text-align:right;width: 15%'>Total</th>");
                sbTableContent.Append("<th style='text-align:center;width: 15%'>" + orderCount + "</th>");
                sbTableContent.Append("<th style='text-align:center;width: 15%'>" + dblOrderValue.ToString("N2") + "</th>");

                sbTableContent.Append("</tr>");
                sbTableContent.Append("</tfoot>");
                sbTableContent.Append("</table>");
            }

            return sbTableContent.ToString();

        }
        public static DataTable GetDistinctRecords(DataTable dt, string[] Columns)
        {
            DataTable dtUniqRecords = new DataTable();
            dtUniqRecords = dt.DefaultView.ToTable(true, Columns);
            return dtUniqRecords;
        }

    }
}
