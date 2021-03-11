using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using System.Data;
using DataControl;
using System.Text;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class InstantReportController : Controller
    {
        //
        // GET: /InstantReport/

        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables

        #region Index
        public ActionResult Index(string dcrActualDate, string flag)
        {
            ViewBag.DCRActualDate = dcrActualDate;
            ViewBag.Flag = flag;
            return View();
        }

        public object GetUserInstantReport(string dcrActualDate, string flag)
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string userCode = _objCurrentInfo.GetUserCode();
            string regionCode = _objCurrentInfo.GetRegionCode();
            string dcrCode = _objCurrentInfo.GetDCRCode(dcrActualDate);
            DataSet dsDCRDetails = _objSPData.GetInstantReportDetails(companyCode, userCode, regionCode, dcrActualDate, dcrCode, flag);
             DataControl.JSONConverter jsonConvert = new  DataControl.JSONConverter();
            return jsonConvert.Serialize(dsDCRDetails);
        }

        public string SetDCRUnapprove(string dcrDate, string unapprovealReason, string flag, string calcFieldStatus)
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string userName = _objCurrentInfo.GetUserName();
            string userCode = _objCurrentInfo.GetUserCode();
            string dcrCode = _objCurrentInfo.GetDCRCode(dcrDate);
            calcFieldStatus = calcFieldStatus.ToUpper() == "APPLIED" ? "1" : "2";
            string result = string.Empty;

            result=_objSPData.CheckTheDCRCanbeUnapprove(companyCode,userCode,dcrCode,flag);
            if (result == "SUCCESS")
            {
                result = _objSPData.SetDCRUnapprove(companyCode, userCode, userName, dcrDate, dcrCode, flag, unapprovealReason, calcFieldStatus);
            }
            return result;
        }

        public string GetAccompanistVisitedDoctors(string Acc_User_Name, string DCR_Actual_Date)
        {
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string DCR_User_Name = _objCurrentInfo.GetUserName();
            string DCR_User_Code = _objCurrentInfo.GetUserCode();

            DataSet ds = _objSPData.GetAccompanistVisitDoctors(company_Code, DCR_User_Name, Acc_User_Name, DCR_Actual_Date, DCR_User_Code);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            {
                return GetAccompanistVisitedDoctorsHTMLFormat(ds);
            }
            else
            {
                return "<span>No Doctors Found.</span>";
            }
        }

        public string GetDetailedProductsAndInputsPerDoctor(string doctor_Code, string doctor_Name, string DCR_Actual_Dates,
            string speciality_Name)
        {
            string company_Code = _objCurrentInfo.GetCompanyCode();
            string user_Code = _objCurrentInfo.GetUserCode();
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
                htmlBuilder.Append(i.ToString());
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
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.Append("<table class='accDocDetail' cellspacing='0' cellpadding='0' border=0 >");
            htmlBuilder.Append("<thead>");
            htmlBuilder.Append("<tr>");
            htmlBuilder.Append("<th> Sno </th>");
            htmlBuilder.Append("<th> Doctor Name </th>");
            htmlBuilder.Append("<th> MDL </th>");
            htmlBuilder.Append("<th> Speciality </th>");
            htmlBuilder.Append("<th> Category </th>");
            htmlBuilder.Append("<th> Visit Time </th>");
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
                htmlBuilder.Append(row["Doctor_Visit_Time"].ToString());
                htmlBuilder.Append("</td>");
                htmlBuilder.Append("</tr>");
            }
            htmlBuilder.Append("</tbody>");
            htmlBuilder.Append("</table>");
            return htmlBuilder.ToString();
        }
        #endregion Index

    }
}
