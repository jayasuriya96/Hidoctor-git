using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Data;
using System.Text;
using System.Collections;
using System.Xml;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using System.Net;
using System.IO;
using MVCModels;
using Newtonsoft.Json;
using System.Web.UI.WebControls;

namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class BatchProcessingController : Controller
    {
        //
        // GET: /BatchProcessing/

        #region private variables
        SPData _objSPData = new SPData();
        CurrentInfo _objCurrentInfo = new CurrentInfo();
        #endregion private variables


        public ActionResult Index(string bpType)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string INWARD_ACKNOWLEDGEMENT_NEEDED = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            ViewBag.InwardType = INWARD_ACKNOWLEDGEMENT_NEEDED;
            ViewBag.BpType = bpType == null ? "" : bpType;
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bp_Type"></param>
        /// <returns></returns>
        public JsonResult GetBPHeader(string bp_Type, string Effective_from, string Effective_to,int Value)
        {
            string userCode = _objCurrentInfo.GetUserCode();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            //  StringBuilder bpHeaderRowsHTMLFormat = new StringBuilder();

            DataSet ds = _objSPData.GetBatchProcessingHeader(companyCode, bp_Type, userCode, Effective_from, Effective_to, Value);
            //if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            //{

            //    DataRowCollection drCollection = ds.Tables[0].Rows;
            // Bind Error Details
            //    bpHeaderRowsHTMLFormat.Append("<table class='bpTable' border='0' cellspacing='0' cellpadding='0' style='margin-top:2%;'><thead><tr><th>File Name</th>");
            //    bpHeaderRowsHTMLFormat.Append("<th>Date of Upload</th><th>Uploaded By</th><th>Status of upload</th><th>Reupload</th></thead><tbody>");
            //    foreach (DataRow dr in drCollection)
            //    {
            //        string errorClass = string.Empty;
            //        errorClass = dr["Status"].ToString().ToUpper() == "ERROR" ? "ERR_ROW" : "";
            //        string fileName = string.Empty;
            //        if (dr["Upload_File_Name"].ToString().Contains("\\"))
            //        {
            //            fileName = dr["Upload_File_Name"].ToString().Substring(dr["Upload_File_Name"].ToString().LastIndexOf('\\')).Replace("\\", "");

            //        }
            //        else
            //        {
            //            fileName = dr["Upload_File_Name"].ToString();
            //        }
            //        bpHeaderRowsHTMLFormat.Append("<tr class='" + errorClass + "'><td>" + fileName + "</td>");
            //        bpHeaderRowsHTMLFormat.Append("<td>" + dr["Upload_Date"].ToString() + "</td>");
            //        bpHeaderRowsHTMLFormat.Append("<td>" + dr["User_Name"].ToString() + "</td>");
            //        if (errorClass.Trim().Length > 0)
            //        {
            //            bpHeaderRowsHTMLFormat.Append("<td><a href='#' onclick='BPPopup(\"" + dr["BP_ID"].ToString() + "\")'> " + dr["Status"].ToString() + "</a></td>");
            //        }
            //        else
            //        {
            //            if (!string.IsNullOrEmpty(dr["DB_Error"].ToString()))
            //            {
            //                bpHeaderRowsHTMLFormat.Append("<td>" + dr["Status"].ToString() + "-" + dr["DB_Error"].ToString() + "</td>");
            //            }
            //            else
            //            {
            //                bpHeaderRowsHTMLFormat.Append("<td>" + dr["Status"].ToString() + "</td>");
            //            }
            //            // bpHeaderRowsHTMLFormat.Append("<td>" + dr["Status"].ToString() + "</td>");
            //        }
            //        bpHeaderRowsHTMLFormat.Append("<td><a href='#' onclick='fnRedirectToUploadScreen()'>" + dr["Reupload"].ToString() + "</a></td>");
            //        bpHeaderRowsHTMLFormat.Append("</tr>");
            //    }
            //    bpHeaderRowsHTMLFormat.Append("</tbody></table>");
            //}
            //else
            //{
            //    bpHeaderRowsHTMLFormat.Append("<span> No Uploaded Found.</span>");
            //}
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bp_Type"></param>
        /// <returns></returns>
        public JsonResult GetBPHeaderForPSAutomation(string bp_Type, string Effective_from, string Effective_to, int Value)
        {
            string userCode = _objCurrentInfo.GetUserCode();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            //  StringBuilder bpHeaderRowsHTMLFormat = new StringBuilder();
            DataSet ds = _objSPData.GetBatchProcessingHeaderForPSAutomation(companyCode, bp_Type, userCode, Effective_from, Effective_to, Value);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bpId"></param>
        /// <returns></returns>
        public StringBuilder GetBPErrorLog(Guid bpId)
        {
            string userCode = _objCurrentInfo.GetUserCode();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string msg = string.Empty;
            StringBuilder bpErrorLogsHTMLFormat = new StringBuilder();

            DataSet ds = _objSPData.GetBatchProcessingErrorLog(companyCode, bpId);
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            {

                DataRowCollection drCollection = ds.Tables[0].Rows;
                // Bind Header Information
                if (drCollection[0]["Status"].ToString() == "ERROR")
                {
                    msg = "Error";
                }
                else if (drCollection[0]["Status"].ToString() == "FAILED")
                {
                    msg = "Failed";
                }
                bpErrorLogsHTMLFormat.Append("<h4 style='margin-top: 7px;margin-left: 6px;'>Header Information</h4>");
                bpErrorLogsHTMLFormat.Append("<div class='Err_header_info' style='border:2px solid;width:93%;'><br /><table style='border-collapse:collapse;'><tr><td><b>File Name</b></td><td>: " + drCollection[0]["Upload_File_Name"] + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Upload Date Time</b></td><td>: " + drCollection[0]["Upload_Date"] + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Status</b></td><td>: " + msg + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Reason</b></td><td>: Kindly refer below.");
                //bpErrorLogsHTMLFormat.Append("<br />Please rectify the errors and re-upload again.");
                bpErrorLogsHTMLFormat.Append("</td></tr></table></div><div style='clear:both'></div>");
                // Bind Error Details. 
                bpErrorLogsHTMLFormat.Append("<div><div style='float: left;margin-right: 67%;margin-bottom: 22px;margin-top:14px;'><span style='padding-left:15px;'><b>Error Details:</b></span><br /></div>");
                bpErrorLogsHTMLFormat.Append("<div><span style='float:right;margin-bottom:5px;    margin-top: 11px;margin - right: 5px; '><b><a class='btn small primary'  onclick='fnDownloadErrorReport()' id='excelDownload' value='" + bpId + "'>Download Error Report</a></b></span><br /></div></div>");
                //bpErrorLogsHTMLFormat.Append("<div><span style='float:right;margin-bottom:5px;'><b><a class='btn small primary' href='/BatchProcessing/DownloadErrorReport' onclick='fnDownloadErrorReport()' id='excelDownload' value='" + bpId + "'>Download Error Report</a></b></span><br /></div></div>");
                if (drCollection[0]["Status"].ToString() != "FAILED")
                {
                    bpErrorLogsHTMLFormat.Append("<table  class='bpTable' border='0' cellspacing='0' cellpadding='0'><thead style='position:relative;display:block;width:100%;'><tr><th style='min-width:100px;'>Excel Row No</th><th style='min-width:250px;'>Error Description</th><th style='min-width:327px;'>Suggestion for error rectification</th></tr></thead><tbody style='display:block;position:relative;overflow - y:auto;height:140px;overflow:auto;'>");
                }
                else
                {
                    bpErrorLogsHTMLFormat.Append("<table  class='bpTable' border='0' cellspacing='0' cellpadding='0'><thead><tr><th>Error Description</th></tr></thead><tbody>");
                }
                foreach (DataRow dr in drCollection)
                {
                    if (dr["Status"].ToString() != "FAILED")
                    {


                        string errreson = dr["ERR_REASON"].ToString();
                        bpErrorLogsHTMLFormat.Append("<tr><td style='min-width:100px;'>" + (Convert.ToInt32(dr["ROW_NO"].ToString()) > 0 ? dr["ROW_NO"].ToString() : "") + "</td>");
                        string correctString = errreson.Replace(" <<Dynamic_Column_Name >>", dr["Dynamic_Column_Name"].ToString());
                        bpErrorLogsHTMLFormat.Append("<td style='min-width:250px;'>" + correctString + "</td>");
                        bpErrorLogsHTMLFormat.Append("<td style='min-width:305px;'>" + dr["ERR_SUGGESTION"].ToString() + "</td>");
                        //bpErrorLogsHTMLFormat.Append("<td>");
                        //if (Convert.ToInt32(dr["Can_Auto"].ToString()) == 1)
                        //    bpErrorLogsHTMLFormat.Append("<span style='text-decoration:underline;color:blue;cursor:pointer;' onclick=\"fnDoAction(\'" + dr["ERR_CODE"].ToString() + "\',\'" + dr["Product_Ref_Key"].ToString() + "\',\'" + dr["Product_Type"].ToString() + "\',\'" + dr["Product_Name"].ToString() + "\',\'" + dr["Batch_Number"].ToString() + "\',\'" + dr["Employee_Number"].ToString() + "\');\" > Process </span>");
                        //bpErrorLogsHTMLFormat.Append("</td>");
                        bpErrorLogsHTMLFormat.Append("</tr>");
                    }
                    else
                    {
                        //  string correctString = errreson.Replace(" <<Dynamic_Column_Name >>", dr["Dynamic_Column_Name"].ToString());
                        //   bpErrorLogsHTMLFormat.Append("<td>" + correctString + "</td>");
                        bpErrorLogsHTMLFormat.Append("<td>" + dr["ERR_SUGGESTION"].ToString() + "</td>");
                        //bpErrorLogsHTMLFormat.Append("<td>");
                        //if (Convert.ToInt32(dr["Can_Auto"].ToString()) == 1)
                        //    bpErrorLogsHTMLFormat.Append("<span style='text-decoration:underline;color:blue;cursor:pointer;' onclick=\"fnDoAction(\'" + dr["ERR_CODE"].ToString() + "\',\'" + dr["Product_Ref_Key"].ToString() + "\',\'" + dr["Product_Type"].ToString() + "\',\'" + dr["Product_Name"].ToString() + "\',\'" + dr["Batch_Number"].ToString() + "\',\'" + dr["Employee_Number"].ToString() + "\');\" > Process </span>");
                        //bpErrorLogsHTMLFormat.Append("</td>");
                        bpErrorLogsHTMLFormat.Append("</tr>");
                    }
                }
                bpErrorLogsHTMLFormat.Append("</tbody></table>");

            }
            return bpErrorLogsHTMLFormat;
        }
        //For PS Automation
        /// <summary>
        /// 
        /// </summary>
        /// <param name="bpId"></param>
        /// <returns></returns>
        public StringBuilder GetBPErrorLogForPSAutomation(Guid bpId)
        {
            string userCode = _objCurrentInfo.GetUserCode();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string msg = string.Empty;
            StringBuilder bpErrorLogsHTMLFormat = new StringBuilder();

            DataSet ds = _objSPData.GetBatchProcessingErrorLogForPSAutomation(companyCode, bpId);
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
            {

                DataRowCollection drCollection = ds.Tables[0].Rows;
                // Bind Header Information
                if (drCollection[0]["Status"].ToString() == "ERROR")
                {
                    msg = "Error";
                }
                else if (drCollection[0]["Status"].ToString() == "FAILED")
                {
                    msg = "Failed";
                }
                bpErrorLogsHTMLFormat.Append("<h4 style='margin-top: 7px;margin-left: 6px;'>Header Information</h4>");
                bpErrorLogsHTMLFormat.Append("<div class='Err_header_info' style='border:2px solid;width:93%;'><br /><table style='border-collapse:collapse;'><tr><td><b>File Name</b></td><td>: " + drCollection[0]["Upload_File_Name"] + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Upload Date Time</b></td><td>: " + drCollection[0]["Upload_Date"] + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Status</b></td><td>: " + msg + "</td></tr>");
                bpErrorLogsHTMLFormat.Append("<tr><td><b>Reason</b></td><td>: Kindly refer below.");
                //bpErrorLogsHTMLFormat.Append("<br />Please rectify the errors and re-upload again.");
                bpErrorLogsHTMLFormat.Append("</td></tr></table></div><div style='clear:both'></div>");
                // Bind Error Details. 
                bpErrorLogsHTMLFormat.Append("<div><div style='float: left;margin-right: 67%;margin-bottom: 22px;margin-top:14px;'><span style='padding-left:15px;'><b>Error Details:</b></span><br /></div>");
                bpErrorLogsHTMLFormat.Append("<div><span style='float:right;margin-bottom:5px;    margin-top: 11px;margin - right: 5px; '><b><a class='btn small primary'  onclick='fnDownloadErrorReportForPSAutomation()' id='excelDownload' value='" + bpId + "'>Download Error Report</a></b></span><br /></div></div>");
                bpErrorLogsHTMLFormat.Append("<div><span style='float:right;margin-bottom:5px;    margin-top: 11px;margin - left: 5px; '><b><a class='btn small primary'  onclick='fnDownloadJsonDataForPSAutomation()' id='JsonDownload' value='" + bpId + "'>Download Json Data</a></b></span><br /></div></div>");
               // }
                if (drCollection[0]["Status"].ToString() != "FAILED")
                {
                    bpErrorLogsHTMLFormat.Append("<table  class='bpTable' border='0' cellspacing='0' cellpadding='0'><thead style='position:relative;display:block;width:100%;'><tr><th style='min-width:100px;'>Excel Row No</th><th style='min-width:250px;'>Unique Row Name</th><th style='min-width:250px;'>Error Description</th><th style='min-width:327px;'>Suggestion for error rectification</th></tr></thead><tbody style='display:block;position:relative;overflow - y:auto;height:140px;overflow:auto;'>");
                }
                else
                {
                    bpErrorLogsHTMLFormat.Append("<table  class='bpTable' border='0' cellspacing='0' cellpadding='0'><thead><tr><th>Error Description</th></tr></thead><tbody>");
                }
                foreach (DataRow dr in drCollection)
                {
                    if (dr["Status"].ToString() != "FAILED")
                    {


                        string errreson = dr["ERR_REASON"].ToString();
                        bpErrorLogsHTMLFormat.Append("<tr><td style='min-width:100px;'>" + (Convert.ToInt32(dr["ROW_NO"].ToString()) > 0 ? dr["ROW_NO"].ToString() : "") + "</td>");
                        bpErrorLogsHTMLFormat.Append("<td style='min-width:250px;'>" + dr["Unique_Record_Name"].ToString() + "</td>");
                        string correctString = errreson.Replace(" <<Dynamic_Column_Name >>", dr["Dynamic_Column_Name"].ToString());
                        bpErrorLogsHTMLFormat.Append("<td style='min-width:250px;'>" + correctString + "</td>");
                        bpErrorLogsHTMLFormat.Append("<td style='min-width:305px;'>" + dr["ERR_SUGGESTION"].ToString() + "</td>");
                        //bpErrorLogsHTMLFormat.Append("<td>");
                        //if (Convert.ToInt32(dr["Can_Auto"].ToString()) == 1)
                        //    bpErrorLogsHTMLFormat.Append("<span style='text-decoration:underline;color:blue;cursor:pointer;' onclick=\"fnDoAction(\'" + dr["ERR_CODE"].ToString() + "\',\'" + dr["Product_Ref_Key"].ToString() + "\',\'" + dr["Product_Type"].ToString() + "\',\'" + dr["Product_Name"].ToString() + "\',\'" + dr["Batch_Number"].ToString() + "\',\'" + dr["Employee_Number"].ToString() + "\');\" > Process </span>");
                        //bpErrorLogsHTMLFormat.Append("</td>");
                        bpErrorLogsHTMLFormat.Append("</tr>");
                    }
                    else
                    {
                        //  string correctString = errreson.Replace(" <<Dynamic_Column_Name >>", dr["Dynamic_Column_Name"].ToString());
                        //   bpErrorLogsHTMLFormat.Append("<td>" + correctString + "</td>");
                        bpErrorLogsHTMLFormat.Append("<td>" + dr["ERR_SUGGESTION"].ToString() + "</td>");
                        //bpErrorLogsHTMLFormat.Append("<td>");
                        //if (Convert.ToInt32(dr["Can_Auto"].ToString()) == 1)
                        //    bpErrorLogsHTMLFormat.Append("<span style='text-decoration:underline;color:blue;cursor:pointer;' onclick=\"fnDoAction(\'" + dr["ERR_CODE"].ToString() + "\',\'" + dr["Product_Ref_Key"].ToString() + "\',\'" + dr["Product_Type"].ToString() + "\',\'" + dr["Product_Name"].ToString() + "\',\'" + dr["Batch_Number"].ToString() + "\',\'" + dr["Employee_Number"].ToString() + "\');\" > Process </span>");
                        //bpErrorLogsHTMLFormat.Append("</td>");
                        bpErrorLogsHTMLFormat.Append("</tr>");
                    }
                }
                bpErrorLogsHTMLFormat.Append("</tbody></table>");

            }
            return bpErrorLogsHTMLFormat;
        }
        public void GetErrorReportID(Guid bpId)
        {
            Session["bpId"] = bpId;

        }
        public void DownloadErrorReport()
        {
            if (Session["bpId"] != null)
                if (Session["bpId"].ToString() != "")
                {
                    Guid bpId = new Guid(Session["bpId"].ToString());                     
                    Session["bpId"] = null;
                    CurrentInfo _objCurrentInfo = new CurrentInfo();
                    SPData _objSPData = new SPData();
                    string userCode = _objCurrentInfo.GetUserCode();
                    string companyCode = _objCurrentInfo.GetCompanyCode();
                    DataSet ds = _objSPData.GetBatchProcessingErrorLog(companyCode, bpId);
                    HttpResponse response = System.Web.HttpContext.Current.Response;
                   
                    if (ds.Tables[0].Columns.Contains("Row_No"))
                    {
                        ds.Tables[0].Columns["Row_No"].ColumnName = "Excel Row No";
                        ds.Tables[0].Columns["ERR_REASON"].ColumnName = "Error Description";
                        ds.Tables[0].Columns["ERR_SUGGESTION"].ColumnName = "Suggestion for error rectification";
                        ds.Tables[0].Columns.Remove("Upload_File_Name");
                        ds.Tables[0].Columns.Remove("Dynamic_Column_Name");
                        ds.Tables[0].Columns.Remove("ERR_CODE");
                        ds.Tables[0].Columns.Remove("Upload_Date");
                        ds.Tables[0].Columns.Remove("Status");

                    }
                    else
                    {

                        ds.Tables[0].Columns["ERR_SUGGESTION"].ColumnName = "Suggestion for error rectification";
                        ds.Tables[0].Columns.Remove("Upload_File_Name");                   
                        ds.Tables[0].Columns.Remove("Upload_Date");
                        ds.Tables[0].Columns.Remove("Status");
                    }               
                  
                    
                    //ds.Tables[0].Columns.Remove("Upload_Date1");
                    DowenloadExcelFile(ds.Tables, "Error_Report_" + DateTime.Now.ToString(), response);
                }
        }
        public void DownloadErrorReportForPSAutomation()
        {
            if (Session["bpId"] != null)
                if (Session["bpId"].ToString() != "")
                {
                    Guid bpId = new Guid(Session["bpId"].ToString());
                    Session["bpId"] = null;
                    CurrentInfo _objCurrentInfo = new CurrentInfo();
                    SPData _objSPData = new SPData();
                    string userCode = _objCurrentInfo.GetUserCode();
                    string companyCode = _objCurrentInfo.GetCompanyCode();
                    DataSet ds = _objSPData.GetBatchProcessingErrorLogForPSAutomation(companyCode, bpId);
                    HttpResponse response = System.Web.HttpContext.Current.Response;

                    ds.Tables[0].Columns["Row_No"].ColumnName = "Excel Row No";
                    ds.Tables[0].Columns["Unique_Record_Name"].ColumnName = "Unique Row Name";
                    ds.Tables[0].Columns["ERR_REASON"].ColumnName = "Error Description";
                    ds.Tables[0].Columns["ERR_SUGGESTION"].ColumnName = "Suggestion for error rectification";
                    ds.Tables[0].Columns.Remove("Upload_File_Name");
                    ds.Tables[0].Columns.Remove("Dynamic_Column_Name");
                    ds.Tables[0].Columns.Remove("ERR_CODE");
                    ds.Tables[0].Columns.Remove("Upload_Date");
                    ds.Tables[0].Columns.Remove("Status");

                    // }
                    //else
                    //{

                    //    ds.Tables[0].Columns["ERR_SUGGESTION"].ColumnName = "Suggestion for error rectification";
                    //    ds.Tables[0].Columns.Remove("Upload_File_Name");
                    //    ds.Tables[0].Columns.Remove("Upload_Date");
                    //    ds.Tables[0].Columns.Remove("Status");
                    //}


                    //ds.Tables[0].Columns.Remove("Upload_Date1");
                    DowenloadExcelFileForPSAutomatn(ds.Tables, "Error_Report_" + DateTime.Now.ToString(), response);
                }
        }
        public void DowenloadExcelFile(IEnumerable tables, string fileName, HttpResponse Response)
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
                int sheetNumber = 0;
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
                foreach (DataTable dt in tables)
                {
                    sheetNumber++;
                    string sheetName = !string.IsNullOrEmpty(dt.TableName) ?
                           dt.TableName : "Sheet" + sheetNumber.ToString();
                    x.WriteRaw("<Worksheet ss:Name='" + sheetName + "'>");
                    x.WriteRaw("<Table>");
                    string[] columnTypes = new string[dt.Columns.Count];

                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        string colType = dt.Columns[i].DataType.ToString().ToLower();

                        if (colType.Contains("datetime"))
                        {
                            columnTypes[i] = "DateTime";
                            x.WriteRaw("<Column ss:StyleID='sDate'/>");

                        }
                        else if (colType.Contains("string"))
                        {
                            columnTypes[i] = "String";
                            x.WriteRaw("<Column ss:StyleID='sText'/>");

                        }
                        else
                        {
                            x.WriteRaw("<Column />");

                            if (colType.Contains("boolean"))
                            {
                                columnTypes[i] = "Boolean";
                            }
                            else
                            {
                                //default is some kind of number.
                                columnTypes[i] = "Number";
                            }

                        }
                    }
                    //column headers
                    x.WriteRaw("<Row>");
                    foreach (DataColumn col in dt.Columns)
                    {
                        x.WriteRaw("<Cell ss:StyleID='sText'><Data ss:Type='String'>");
                        x.WriteRaw(col.ColumnName);
                        x.WriteRaw("</Data></Cell>");
                    }
                    x.WriteRaw("</Row>");
                    //data
                    bool missedNullColumn = false;
                    foreach (DataRow row in dt.Rows)
                    {
                        x.WriteRaw("<Row>");
                        for (int i = 0; i < dt.Columns.Count; i++)
                        {
                            if (!row.IsNull(i))
                            {
                                if (missedNullColumn)
                                {
                                    int displayIndex = i + 1;
                                    x.WriteRaw("<Cell ss:Index='" + displayIndex.ToString() +
                                               "'><Data ss:Type='" +
                                               columnTypes[i] + "'>");
                                    missedNullColumn = false;
                                }
                                else
                                {
                                    x.WriteRaw("<Cell><Data ss:Type='" +
                                               columnTypes[i] + "'>");
                                }

                                switch (columnTypes[i])
                                {
                                    case "DateTime":
                                        x.WriteRaw(((DateTime)row[i]).ToString("s"));
                                        break;
                                    case "Boolean":
                                        x.WriteRaw(((bool)row[i]) ? "1" : "0");
                                        break;
                                    case "String":
                                        x.WriteString(row[i].ToString());
                                        break;
                                    default:
                                        x.WriteString(row[i].ToString());
                                        break;
                                }

                                x.WriteRaw("</Data></Cell>");
                            }
                            else
                            {
                                missedNullColumn = true;
                            }
                        }
                        x.WriteRaw("</Row>");
                    }
                    x.WriteRaw("</Table></Worksheet>");
                }
                x.WriteRaw("</Workbook>");
            }
            Response.End();
        }

        //For ps automatn
        public void DowenloadExcelFileForPSAutomatn(IEnumerable tables, string fileName, HttpResponse Response)
        {
            foreach (DataTable dt in tables)
            {
                string filename = fileName + ".xls";
                System.IO.StringWriter tw = new System.IO.StringWriter();
                System.Web.UI.HtmlTextWriter hw = new System.Web.UI.HtmlTextWriter(tw);
                DataGrid dgGrid = new DataGrid();
                dgGrid.DataSource = dt;
                dgGrid.DataBind();

                //Get the HTML for the control.
                dgGrid.RenderControl(hw);
                //Write the HTML back to the browser.
                //Response.ContentType = application/vnd.ms-excel;
                Response.ContentType = "application/vnd.ms-excel";
                Response.AppendHeader("Content-Disposition", "attachment; filename=" + filename + "");
                //this.EnableViewState = false;
                Response.Write(tw.ToString());
                Response.End();
            }
        }

        public string UserProductMap(FormCollection collection)
        {
            string str = "";
            try
            {
                string Emp_No = collection["Emp_No"].ToString();
                string Product_Ref_Key = collection["Product_Ref_Key"].ToString();

                DataControl.Data ds = new DataControl.Data();
                ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    string strSQL = "";

                    strSQL = "EXEC SP_HD_InwardBulk_UserProductMap '" + Emp_No + "','" + Product_Ref_Key + "'";

                    str = ds.ExecuteScalar(strSQL).ToString();

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return str;

        }

        public string ProductBatchMap(FormCollection collection)
        {
            string str = "";
            try
            {
                string Product_Ref_Key = collection["Product_Ref_Key"].ToString();
                string Batch_Number = collection["Batch_Number"].ToString();
                string user_code = _objCurrentInfo.GetUserCode();

                DataControl.Data ds = new DataControl.Data();
                ds.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    string strSQL = "";
                    strSQL = "EXEC SP_HD_InwardBulk_ProductBatchMap '" + Product_Ref_Key + "','" + Batch_Number + "','" + user_code + "'";
                    str = ds.ExecuteScalar(strSQL).ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return str;
        }

        public ActionResult PrimarySalesAutomation()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string INWARD_ACKNOWLEDGEMENT_NEEDED = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            ViewBag.InwardType = INWARD_ACKNOWLEDGEMENT_NEEDED;
            string bpType = "PS_AUTOMATION_UPLOAD";
            ViewBag.BpType = bpType == null ? "" : bpType;
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        public LargeJsonResult GetPrimarySalesData(int Month, int Year)
        {
            string resstring = "";
            string UserName = "";
            string UserPassword = "";
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            string Company_Code = _objcurrentInfo.GetCompanyCode();
            try
            {
                DataSet ds = _objSPData.GetSAPUserCredentials(Company_Code);
                if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
                {

                    DataRowCollection drCollection = ds.Tables[0].Rows;
                    // Bind Header Information
                    UserName = drCollection[0]["UserName"].ToString();
                    UserPassword = drCollection[0]["UserPassword"].ToString();
                }
                   
                string url = "http://14.142.219.182:8001/sap/opu/odata/sap/ZSD_HI_DOCTOR_SRV/ItOutputSet?$filter= Month eq '" + Month + "' and Year eq '" + Year + "'&$format=json";

                HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(url);
                httpRequest.Method = "GET";

                string authorization = UserName + ":" + UserPassword;

                string base64 = Convert.ToBase64String(Encoding.Default.GetBytes(authorization));

                httpRequest.Headers.Add("Authorization", "Basic " + base64);
                httpRequest.Timeout = 100000000;
                using (HttpWebResponse myres = (HttpWebResponse)httpRequest.GetResponse())
                {

                    StreamReader sr = new StreamReader(myres.GetResponseStream(), Encoding.UTF8);
                    resstring = sr.ReadToEnd();

                }

            }
            catch (Exception ex)
            {

            }
            PSMainModel rawData;
            rawData = JsonConvert.DeserializeObject<PSMainModel>(resstring);
            JSONConverter json = new JSONConverter();
        
            if (rawData != null && rawData.d.results.Count > 0)
            {
                //return Json(rawData, JsonRequestBehavior.AllowGet);
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {

                        Data = rawData
                    }
                };
            }
            else
            {

                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {

                        Data = ""
                    }
                };
            }
        }

        //For Json File
        public void DownloadPSAutomationJsData()
        {
            if (Session["bpId"] != null)
                if (Session["bpId"].ToString() != "")
                {
                    Guid bpId = new Guid(Session["bpId"].ToString());
                    Session["bpId"] = null;
                    CurrentInfo _objCurrentInfo = new CurrentInfo();
                    SPData _objSPData = new SPData();
                    string userCode = _objCurrentInfo.GetUserCode();
                    string companyCode = _objCurrentInfo.GetCompanyCode();
                    DataSet ds = _objSPData.GetPSAutomationJsonData(companyCode, bpId);
                    HttpResponse response = System.Web.HttpContext.Current.Response;
                    
                        ds.Tables[0].Columns["Uploaded_File_Name"].ColumnName = "Unique Row Name";
                        ds.Tables[0].Columns["Depot_Name"].ColumnName = "Depot Name";
                        ds.Tables[0].Columns["Region_Name"].ColumnName = "Region Name";
                        ds.Tables[0].Columns["Region_Ref_Key1"].ColumnName = "Region Ref Key1";
                        ds.Tables[0].Columns["Stockiest_Name"].ColumnName = "Stockiest Name";
                        ds.Tables[0].Columns["Stokiest_Ref_Key1"].ColumnName = "Stokiest Ref Key1";
                        ds.Tables[0].Columns["Document_Type_Name"].ColumnName = "Document Type Name";
                        ds.Tables[0].Columns["Document_Date"].ColumnName = "Document Date";
                        ds.Tables[0].Columns["Product_Name"].ColumnName = "Product Name";
                        ds.Tables[0].Columns["Product_Ref_Key1"].ColumnName = "Product Ref Key1";
                        ds.Tables[0].Columns["Batch_Number"].ColumnName = "Batch Number";
                        ds.Tables[0].Columns["Net_Quantity"].ColumnName = "Net Quantity";
                        ds.Tables[0].Columns["Net_Value"].ColumnName = "Net Value";
                        ds.Tables[0].Columns["Free_Quantity"].ColumnName = "Free Quantity";
                        ds.Tables[0].Columns["Document_Number"].ColumnName = "Document_Number";

                    // }
                    //else
                    //{

                    //    ds.Tables[0].Columns["ERR_SUGGESTION"].ColumnName = "Suggestion for error rectification";
                    //    ds.Tables[0].Columns.Remove("Upload_File_Name");
                    //    ds.Tables[0].Columns.Remove("Upload_Date");
                    //    ds.Tables[0].Columns.Remove("Status");
                    //}


                    //ds.Tables[0].Columns.Remove("Upload_Date1");
                    DowenloadExcelFileForPSAutomatn(ds.Tables, "PS_Automation_JsonData_" + DateTime.Now.ToString(), response);
                }
        }
    }
}
