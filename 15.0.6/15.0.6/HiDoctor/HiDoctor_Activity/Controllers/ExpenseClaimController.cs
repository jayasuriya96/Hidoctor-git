using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Newtonsoft.Json;
using DataControl.Abstraction;
using DataControl.Impl;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Reflection;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    //[AjaxSessionActionFilter]
    public class ExpenseClaimController : Controller
    {
        BL_ExpenseClaim _objBlExpense = new BL_ExpenseClaim();


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ExpenseClaimRequest(string request, string favouringUser, string claimCode, string cycleCode, string requestName)
        {
            CurrentInfo _objcur = new CurrentInfo();
            //string privilegevalue  = string.Empty;
            //privilegevalue = _objBlExpense.GetExpenseMonthPrivilege(_objcur.GetCompanyCode(), _objcur.GetUserTypeCode()).ToString();

            //if (privilegevalue.ToUpper() == "DATE")
            //{

            ViewBag.regionName = _objcur.GetRegionName();
            ViewBag.request = request;
            ViewBag.CurUserCode = _objcur.GetUserCode();
            ViewBag.favouringUser = favouringUser;
            ViewBag.claimCode = claimCode;
            ViewBag.cycleCode = cycleCode;
            ViewBag.requestName = requestName;
            ViewBag.Company_Code = _objcur.GetCompanyCode();
            ViewBag.CurUserName = _objcur.GetUserName();
            // ViewBag.expense_Privilege_name = privilegevalue;
            return View();
            //}
            //else
            //{
            //    return RedirectToAction("ExpenseClaimMonthRequest", new { privilegevalue = privilegevalue });               
            //    //return RedirectToAction("ExpenseClaimMonthRequest/privilegevalue=" + privilegevalue + "");
            //}
        }

        public string GetExpenseDayandMonthwisePrivilege(string favoringuserCode)
        {
            CurrentInfo _objcur = new CurrentInfo();
            string privilegevalue = string.Empty;
            favoringuserCode = ((favoringuserCode == "") ? _objcur.GetUserCode() : favoringuserCode);
            privilegevalue = _objBlExpense.GetExpenseMonthPrivilege(_objcur.GetCompanyCode(), favoringuserCode).ToString();
            if (string.IsNullOrEmpty(privilegevalue))
            {
                privilegevalue = "DATE";
            }
            return privilegevalue;
        }

        public ActionResult ExpenseClaimMonthRequest(string privilegevalue, string request, string favouringUser, string claimCode, string cycleCode)
        {
            CurrentInfo _objcur = new CurrentInfo();

            ViewBag.regionName = _objcur.GetRegionName();
            ViewBag.request = request;
            ViewBag.favouringUser = favouringUser;
            ViewBag.claimCode = claimCode;
            ViewBag.cycleCode = cycleCode;
            ViewBag.CurUserCode = _objcur.GetUserCode();
            ViewBag.expense_Privilege_name = privilegevalue;
            ViewBag.Company_Code = _objcur.GetCompanyCode();
            ViewBag.CurUserName = _objcur.GetUserName();
            return View();
        }

        #region Claim Request
        public LargeJsonResult ExpenseClaimFormLoadValues()
        {
            try
            {
                DataControl.BL_ExpenseClaim _objExpense = new DataControl.BL_ExpenseClaim();
                DataControl.BLUser _objUser = new DataControl.BLUser();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                IEnumerable<MVCModels.RequestModel> lstReq;
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();

                lstUser = _objUser.GetExpenseChildUsers(_objCur.GetCompanyCode(), _objCur.GetUserCode());
                lstReq = _objExpense.GetRequestsMappedForUserType(_objCur.GetCompanyCode(), _objCur.GetUserTypeCode());

                // delete current user from list
                //lstUser.RemoveAll(x => x.User_Code == _objCur.GetUserCode());

                // select current user with empty userCode
                MVCModels.HiDoctor_Master.UserModel objCurUser = new MVCModels.HiDoctor_Master.UserModel();
                objCurUser.User_Code = "";
                objCurUser.User_Name = _objCur.GetUserName();
                objCurUser.Region_Name = _objCur.GetRegionName();
                //lstUser.Add(objCurUser);

                List<JsonResult> lst = new List<JsonResult> { Json(lstReq, JsonRequestBehavior.AllowGet), Json(lstUser, JsonRequestBehavior.AllowGet) };
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = lst
                };
                //return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        public JsonResult ExpenseClaimFormLoadValuesSel(string Fav_UserCode)
        {
            DataControl.BL_ExpenseClaim _objExpense = new DataControl.BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            IEnumerable<MVCModels.RequestModel> lstReq = null;
            string UserTypeCode = string.Empty;
            if (Fav_UserCode != "null")
            {
                UserTypeCode = _objExpense.ExpenseClaimFormLoadValuesSel(Fav_UserCode);
                lstReq = _objExpense.GetRequestsMappedForUserType(_objCur.GetCompanyCode(), UserTypeCode);
            }
            return Json(lstReq, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFavouringUser()
        {
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            DataControl.BLUser _objUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();

            lstUser = _objUser.GetExpenseChildUsers(_objCur.GetCompanyCode(), _objCur.GetUserCode());
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        public string GetFieldExpenseEntryTableString(string userCode, string dcrFrom, string dcrTo)
        {
            try
            {
                string tblString = string.Empty;
                DataControl.BL_ExpenseClaim _objExpense = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                userCode = ((userCode == "") ? _objCur.GetUserCode() : userCode);
                tblString = _objExpense.GetFieldExpenseEntryTableString(_objCur.GetCompanyCode(), userCode, dcrFrom, dcrTo);
                return tblString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                dicObj.Add("dcrFrom", dcrFrom);
                dicObj.Add("dcrTo", dcrTo);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public JsonResult GetDoctorJson(string userCode)
        {
            try
            {
                DataControl.BL_Customer _objCust = new DataControl.BL_Customer();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                IEnumerable<MVCModels.HiDoctor_Master.DoctorAutoFillModel> lstCust;

                userCode = ((userCode == "") ? _objCur.GetUserCode() : userCode);
                lstCust = _objCust.GetDoctorByUser(_objCur.GetCompanyCode(), userCode);
                return Json(lstCust, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public string GetExpenseClaimSummaryTableString()
        {
            try
            {
                string tblString = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                DataControl.BLMaster objMaster = new BLMaster();

                // string fieldExpensePriValue = objMaster.GetPrivilegeValue(_objCur.GetCompanyCode(), _objCur.GetUserCode(), "FIELD_EXPENSE_REQUEST_FOR");
                //string doctorCRMPriValue = objMaster.GetPrivilegeValue(_objCur.GetCompanyCode(), _objCur.GetUserCode(), "REQUEST_CUSTOMER_FOR");

                tblString = _objClaim.GetExpenseClaimSummaryTableString(_objCur.GetCompanyCode(), _objCur.GetUserCode(), _objCur.GetUserName(), _objCur.GetUserCode()); // _objCur.GetUserTypeName()
                return tblString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
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

                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
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

        public void GetExpenseClaimSummaryExcel()
        {

            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                string tblString = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                StringBuilder sbTableContentExcel = new StringBuilder();
                string blobUrl = string.Empty, error = string.Empty;
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();

                sbTableContentExcel = _objClaim.GetExpenseClaimSummaryExcel(_objCur.GetCompanyCode(), _objCur.GetUserCode(), _objCur.GetUserName(), _objCur.GetUserTypeName());

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objCur.GetUserName();
                string subDomin = _objCur.GetSubDomain();
                string fileName = "ExpenseClaimSummary" + "_" + subDomin + "_" + userName + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");
                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
        }

        public string CheckStatusCycleMapping(string cycleCode, string userCode)
        {
            try
            {
                string result = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                result = _objClaim.CheckStatusCycleMapping(_objCur.GetCompanyCode(), cycleCode, 1, userCode); // _objCur.GetUserTypeName()
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cycleCode", cycleCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public int InsertExpenseClaim(string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string dateFrom, string dateTo, string favouringUser,
                                      string remarks, string expenseType, string detailString, string screenMode, string AddlExpLst)
        {
            try
            {
                int result = 0;
                IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp = (IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel>)JsonConvert.DeserializeObject(AddlExpLst, typeof(List<MVCModels.ExpenseClaimAddlDetailsModel>));
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();
                string userCode = _objCur.GetUserCode();
                string regionCode = _objCur.GetRegionCode();
                string userName = _objCur.GetUserName();
                string enteredDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                favouringUser = ((favouringUser == "") ? _objCur.GetUserCode() : favouringUser);
                screenMode = screenMode == null ? "DAILY" : screenMode == "" ? "DAILY" : screenMode;




                result = _objClaim.InsertExpenseClaim(companyCode, userCode, regionCode, cycleCode, requestCode,
                                                     statusCode, actualAmount, dateFrom, dateTo, enteredDate, favouringUser,
                                                     remarks, expenseType, detailString, userName, DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), screenMode, lstAddlExp);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cycleCode", cycleCode);
                dicObj.Add("requestCode", requestCode);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("actualAmount", actualAmount.ToString());
                dicObj.Add("dateFrom", dateFrom);
                dicObj.Add("dateTo", dateTo);
                dicObj.Add("favouringUser", favouringUser);
                dicObj.Add("remarks", remarks);
                dicObj.Add("expenseType", expenseType);
                dicObj.Add("detailString", detailString);
                //  DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public void SaveClaimImg(string claimCode, List<string> Img)
        {
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            _objClaim.GetSaveUploadImage(claimCode, Img);

        }
        public int InsertCRMClaim(string cycleCode, string requestCode,
                                    string statusCode, double actualAmount, string dateFrom, string dateTo, string favouringUser,
                                    string remarks, string expenseType, string detailString, string screenMode, string customerProducts_arr)
        {
            try
            {
                int result = 0;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();
                string userCode = _objCur.GetUserCode();
                string regionCode = _objCur.GetRegionCode();
                string userName = _objCur.GetUserName();
                string enteredDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                favouringUser = ((favouringUser == "") ? _objCur.GetUserCode() : favouringUser);
                screenMode = screenMode == null ? "CRM" : screenMode == "" ? "CRM" : screenMode;

                result = _objClaim.InsertCRMClaim(companyCode, userCode, regionCode, cycleCode, requestCode,
                                                      statusCode, actualAmount, dateFrom, dateTo, enteredDate, favouringUser,
                                                      remarks, expenseType, detailString, userName, DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), screenMode, customerProducts_arr);




                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cycleCode", cycleCode);
                dicObj.Add("requestCode", requestCode);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("actualAmount", actualAmount.ToString());
                dicObj.Add("dateFrom", dateFrom);
                dicObj.Add("dateTo", dateTo);
                dicObj.Add("favouringUser", favouringUser);
                dicObj.Add("remarks", remarks);
                dicObj.Add("expenseType", expenseType);
                dicObj.Add("detailString", detailString);
                //  DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public int UpdateExpenseClaim(string claimCode, string statusCode, double actualAmount, double approvedAmount, double otherDeductions,
                                     string remarks, string expenseType, string detailString, string modeType, string AddlAprExpLst)
        {
            try
            {
                IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp = (IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel>)JsonConvert.DeserializeObject(AddlAprExpLst, typeof(List<MVCModels.ExpenseClaimAddlDetailsModel>));
                int result = 0;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();
                string userCode = _objCur.GetUserCode();
                string regionCode = _objCur.GetRegionCode();
                string userName = _objCur.GetUserName();
                string enteredDate = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");

                result = _objClaim.UpdateExpenseClaimRequest(companyCode, claimCode, userCode, regionCode,
                                                      statusCode, actualAmount, approvedAmount, otherDeductions, enteredDate,
                                                      remarks, expenseType, detailString, userName, DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), modeType, lstAddlExp);

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("actualAmount", actualAmount.ToString());
                dicObj.Add("approvedAmount", approvedAmount.ToString());
                dicObj.Add("otherDeductions", otherDeductions.ToString());
                dicObj.Add("remarks", remarks);
                dicObj.Add("expenseType", expenseType);
                dicObj.Add("detailString", detailString);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public string GetClaimDetailsForEdit(string claimCode, string requestType)
        {
            try
            {
                string result = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                result = _objClaim.GetClaimDetailsForEdit(_objCur.GetCompanyCode(), claimCode, requestType);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                dicObj.Add("requestType", requestType);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public string GetFieldExpenseClaimDetailsPopUpString(string claimCode)
        {
            try
            {
                string result = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                result = _objClaim.GetFieldExpenseClaimDetailsPopUpString(_objCur.GetCompanyCode(), claimCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public string GetDoctorCRMClaimDetailsPopUpString(string claimCode)
        {
            try
            {
                string result = string.Empty;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                result = _objClaim.GetDoctorCRMClaimDetailsPopUpString(_objCur.GetCompanyCode(), claimCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("claimCode", claimCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public int GetvalidClaimRequest(string userCode, string requestCode)
        {
            try
            {
                int result = 0;
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();
                userCode = ((userCode == "") ? _objCur.GetUserCode() : userCode);
                result = _objClaim.GetvalidClaimRequest(companyCode, userCode, requestCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                dicObj.Add("requestCode", requestCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public string GetCreditLimit(string requestCode)
        {
            try
            {
                string result = "";
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();

                result = _objClaim.GetRequestLimit(companyCode, requestCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();

                dicObj.Add("requestCode", requestCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }


        public string GetExpenserequestType(string requestCode)
        {
            try
            {
                string result = "";
                DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                string companyCode = _objCur.GetCompanyCode();

                result = _objClaim.GetExpenserequestType(companyCode, requestCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();

                dicObj.Add("requestCode", requestCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw;
            }
        }

        public int DeleteClaimHeader(string claimCode, string requestCode, string userCode)
        {
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

            int rowsAffected = 0;
            rowsAffected = _objExpense.DeleteClaimHeader(claimCode, requestCode, userCode, _objCur.GetCompanyCode());
            return rowsAffected;
        }

        public JsonResult GetCRMStockiestAndProduct(string companyCode, string userCode)
        {
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            List<MVCModels.CRMStockiest> lstStock = _objBlExpense.GetCRMStockiest(_objCur.GetCompanyCode(), userCode);
            List<MVCModels.CRMProduct> lstProd = _objBlExpense.GetCRMProduct(_objCur.GetCompanyCode(), userCode);

            List<JsonResult> lstJSON = new List<JsonResult> { Json(lstStock, JsonRequestBehavior.AllowGet), Json(lstProd, JsonRequestBehavior.AllowGet) };
            return new LargeJsonResult() { Data = lstJSON, MaxJsonLength = int.MaxValue };
        }

        public string InsertCRMExpenseClaim(string companyCode, string customerProducts_arr, string favoringUserCode)
        {
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            //string det = detailString;
            //string result = _objBlExpense.InsertCRMExpenseClaim(_objCur.GetCompanyCode(), customerProducts_arr, Guid.NewGuid(), favoringUserCode);
            string result = _objBlExpense.InsertCRMExpenseClaim(_objCur.GetCompanyCode(), customerProducts_arr);

            return result;
        }

        public int GetCRMRequest(string companyCode, string customerCode)
        {
            int result = 0;
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            result = _objBlExpense.GetCRMRequest(_objCur.GetCompanyCode(), customerCode);
            return result;
        }

        public string GetCRMCustomerDetails(string companyCode, string customerCode, string DoctorName, string DocCode, string claimCode, string rowId)
        {
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            List<MVCModels.CRMCustomerDetails> lstStock = _objBlExpense.GetCRMCustomerDetails(_objCur.GetCompanyCode(), customerCode, claimCode);
            //int rowcount = 0;
            string mode = "Edit";
            StringBuilder str = new StringBuilder();
            if (lstStock.Count > 0)
            {
                var lstProduct = lstStock.Select(p => p.Base_Code).Distinct().ToList();
                str.Append("<div id='dvCustomerName' style='width: 99.5%;margin:0px auto'>" + DoctorName + "</div><input type='hidden' id='hdnDoctorRowNum' value='" + rowId + "'/><input type='hidden' id='hdn_DoctorCode' value='" + DocCode + "'/>");

                for (int i = 0; i < lstProduct.Count(); i++)
                {

                    // var lstproduct = lstStock.where(s => s.base_code == lstproduct[i].base_code).tolist()
                    List<MVCModels.CRMCustomerDetails> lstfinal = lstStock.Where(p => p.Base_Code == lstProduct[i]).ToList();
                    if (lstfinal != null || lstfinal.Count != 0)
                    {
                        //rowcount = i+1;
                        str.Append("<div id='dvstockiest_" + (i + 1) + "'><table id='tblStockiestEntry_1' cellspacing='0' cellpadding='0'>");
                        str.Append("<thead><tr><th>Stockiest Name</th></tr>");
                        str.Append("<tbody><tr><td><input type='text' class='input-large form-control autoCustStock' style='margin: 6px;' value='" + lstfinal[0].Customer_Name + "' id='txtStockiest_" + (i + 1) + "'  onkeyup='fnCreateNewRowStock(this);' class='input-large'/><input type='hidden' value='" + lstfinal[0].Base_Code + "' id='hdnStockiest_" + (i + 1) + "'/></td></tr></tbody>");
                        str.Append("<div id='dvProduct'><table class='table table-striped' id='txtStockiest_" + (i + 1) + "_tblProductEntry_" + (i + 1) + "' cellspacing='0' cellpadding='0'>");
                        str.Append("<thead><tr><th>Product</th><th>Percentage</th></tr>");
                        str.Append("</thead><tbody>");

                        for (int j = 0; j < lstfinal.Count(); j++)
                        {
                            if (lstfinal.Count > 1)
                            {
                                str.Append("<tr><td><input type='text' class='input-large form-control autoCustProduct ' value='" + lstfinal[j].Product_Name + "' id='tblStockiestEntry_" + (i + 1) + "_txtProduct_" + (j + 1) + "'  onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control' maxlength='299' /><input type='hidden' value='" + lstfinal[j].Product_Code + "' id='tblStockiestEntry_" + (i + 1) + "_hdnProduct_" + (j + 1) + "'/></td>");
                                str.Append("<td><input type='text' value=" + lstfinal[j].Percentage + " id='tblStockiestEntry_" + (i + 1) + "_txtPercentage_" + (j + 1) + "' onkeypress='return isNumberKey(event);' class='input-large'/><input type='hidden' value='" + lstfinal[j].Percentage + "' id='tblStockiestEntry_" + (i + 1) + "_hdnPercentage_" + (j + 1) + "'/></td></tr>");
                            }
                            else
                            {
                                str.Append("<tr><td><input type='text'  class='input-large form-control autoCustProduct' value='" + lstfinal[j].Product_Name + "' id='tblStockiestEntry_" + (i + 1) + "_txtProduct_" + (j + 1) + "' onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control' maxlength='299'/><input type='hidden'  value='" + lstfinal[j].Product_Code + "' id='tblStockiestEntry_" + (i + 1) + "_hdnProduct_" + (j + 1) + "'/></td>");
                                str.Append("<td><input type='text' value=" + lstfinal[j].Percentage + " id='tblStockiestEntry_" + (i + 1) + "_txtPercentage_" + (j + 1) + "'class='input-large form-control' onkeypress='return isNumberKey(event);'/><input type='hidden'  value='" + lstfinal[j].Product_Code + "' id='tblStockiestEntry_" + (i + 1) + "_hdnPercentage_" + (j + 1) + "'/></td></tr>");
                            }
                        }

                        str.Append("</table></div></div>");
                    }
                }
                // str.Append("<div id='dvstockiest_" + 2 + "_dvButton_1'><table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate();'></td>");
                /// str.Append("<td><input type='button' class='btn btn-primary autoCust' maxlength='299' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>");
                str.Append("</table></table></div>");
            }
            else
            {
                str.Append("<div id='dvCustomerName' style='width: 99.5%;margin:0px auto'>" + DoctorName + "</div><input type='hidden' id='hdnDoctorRowNum' value='" + rowId + "'/><input type='hidden' id='hdn_DoctorCode' value='" + DocCode + "'/>");
                str.Append("<div id='dvstockiest_1'><table id='tblStockiestEntry_1' cellspacing='0' cellpadding='0'>");
                str.Append("<thead><tr><th>Stockiest Name</th></tr>");
                str.Append("<tbody><tr><td><input type='text' class='input-large form-control autoCustStock ' style='margin: 6px;' id='txtStockiest_1'  onkeyup='fnCreateNewRowStock(this);' class='input-large'/><input type='hidden' id='hdnStockiest_1'/></td></tr></tbody>");
                str.Append("<div id='dvProduct'><table class='table table-striped' id='txtStockiest_1_tblProductEntry_1' cellspacing='0' cellpadding='0'>");
                str.Append("<thead><tr><th>Product</th><th>Percentage</th></tr>");
                str.Append("</thead><tbody>");
                str.Append("<tr><td><input type='text' class='input-large form-control autoCustProduct ' id='tblStockiestEntry_1_txtProduct_1'  onkeyup='fnCreateNewRowProduct(this);' class='input-large form-control' maxlength='299' /><input type='hidden' id='tblStockiestEntry_1_hdnProduct_1'/></td>");
                str.Append("<td><input type='text'  id='tblStockiestEntry_1_txtPercentage_1' onkeyup='return isNumberKey(event);' class='input-large'/><input type='hidden' id='tblStockiestEntry_1_hdnPercentage_1'/></td></tr>");
                str.Append("</table></div></div>");
                //str.Append("<div id='dvstockiest_" + 2 + "_dvButton_1'><table><tr><td><input type='button' class='btn btn-primary autoCust' value='Save' onclick='fnStockiestProductValidate(" + rowId + ");'></td>");
                //str.Append("<td><input type='button' class='btn btn-primary autoCust' maxlength='299' value='Cancel' onclick='fnStockiestClose();'></td></tr></table></div>");
                str.Append("</table></table></div>");

            }

            return str.ToString();
        }

        public JsonResult GetCRMCustomerAndProductDetails(string companyCode, string customerCode)
        {
            BL_ExpenseClaim _objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            //List<MVCModels.CRMCustomerDetails> lstStock = _objBlExpense.GetCRMCustomerDetails(_objCur.GetCompanyCode(), customerCode);
            List<MVCModels.CRMCustomerDetails> lstStock = _objBlExpense.GetApprovedCRMCustomerDetails(_objCur.GetCompanyCode(), customerCode);
            return Json(json.Serialize(lstStock), JsonRequestBehavior.AllowGet);
        }




        #region - Expense Claim Month
        /// <summary>
        /// Show expense table for month
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public string GetFieldExpenseEntryTableStringforMonthwise(string userCode, int month, int year)
        {
            try
            {
                string tblString = string.Empty;
                //DataControl.BL_ExpenseClaim _objExpense = new DataControl.BL_ExpenseClaim();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                userCode = ((userCode == "") ? _objCur.GetUserCode() : userCode);

                tblString = _objBlExpense.GetDCRExpensedetailsforMonthwise(_objCur.GetCompanyCode(), userCode, month, year);

                return tblString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }
        /// <summary>
        /// Get Expense claim month count
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="requestClaimCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public int GetExpenseclaimcountforMonth(string userCode, string requestCode, int month, int year)
        {
            int rowsaffected = 0;
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            userCode = ((userCode == "") ? _objCur.GetUserCode() : userCode);
            rowsaffected = _objBlExpense.GetExpenseMonthCount(_objCur.GetCompanyCode(), userCode, requestCode, month, year);
            return rowsaffected;
        }
        #endregion - Expense Claim Month
        [HttpPost]
        public string UploadAttachment(FormCollection coll)
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                string companyCode = objCur.GetCompanyCode();
                string newFilename = string.Empty;
                var container = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(
                        ConfigurationManager.AppSettings["NBBLOBACCKEY"]).CreateCloudBlobClient()
                    .GetContainerReference(companyCode.ToLower());
                container.CreateIfNotExists();

                int blocksCount = int.Parse(coll["blocksCount"].ToString());
                string fileName = coll["fileName"].ToString();
                fileName = fileName.Substring(fileName.LastIndexOf("\\") + 1);
                newFilename = fileName;
                string fileExtenstion = fileName.Substring(fileName.LastIndexOf("."));
                long fileSize = long.Parse(coll["fileSize"].ToString());
                newFilename = newFilename.Substring(0, newFilename.LastIndexOf('.'));
                newFilename = newFilename.ToString().Trim().Replace(" ", "_");

                fileName = newFilename + "_" + objCur.GetUserName() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + fileExtenstion;

                var fileToUpload = new MVCModels.CloudFile()
                {
                    BlockCount = blocksCount,
                    FileName = fileName,
                    Size = fileSize,
                    BlockBlob = container.GetBlockBlobReference(fileName),
                    StartTime = DateTime.Now,
                    IsUploadCompleted = false,
                    UploadStatusMessage = string.Empty
                };
                Session.Add("CurrentFile", fileToUpload);
                return container.Uri + "/" + fileName;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UploadChunk(int id)
        {
            try
            {
                HttpPostedFileBase request = Request.Files["Slice"];
                byte[] chunk = new byte[request.ContentLength];
                request.InputStream.Read(chunk, 0, Convert.ToInt32(request.ContentLength));
                JsonResult returnData = null;
                string fileSession = "CurrentFile";
                if (Session[fileSession] != null)
                {
                    MVCModels.CloudFile model = (MVCModels.CloudFile)Session[fileSession];
                    returnData = UploadCurrentChunk(model, chunk, id);
                    if (returnData != null)
                    {
                        return returnData;
                    }
                    if (id == model.BlockCount)
                    {
                        return CommitAllChunks(model);
                    }
                }
                else
                {
                    returnData = Json(new
                    {
                        error = true,
                        isLastBlock = false,
                        message = string.Format(CultureInfo.CurrentCulture,
                            "Failed to Upload file.", "Session Timed out")
                    });
                    return returnData;
                }

                return Json(new { error = false, isLastBlock = false, message = string.Empty });
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        private JsonResult UploadCurrentChunk(MVCModels.CloudFile model, byte[] chunk, int id)
        {
            try
            {
                using (var chunkStream = new MemoryStream(chunk))
                {
                    var blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(
                            string.Format(CultureInfo.InvariantCulture, "{0:D4}", id)));
                    try
                    {
                        model.BlockBlob.PutBlock(
                            blockId,
                            chunkStream, null, null,
                            new BlobRequestOptions()
                            {
                                RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(10), 3)
                            },
                            null);
                        return null;
                    }
                    catch (StorageException e)
                    {
                        Session.Remove("CurrentFile");
                        model.IsUploadCompleted = true;
                        model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                        return Json(new { error = true, isLastBlock = false, message = model.UploadStatusMessage });
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        private ActionResult CommitAllChunks(MVCModels.CloudFile model)
        {
            model.IsUploadCompleted = true;
            bool errorInOperation = false;
            try
            {
                var blockList = Enumerable.Range(1, (int)model.BlockCount).ToList<int>().ConvertAll(rangeElement =>
                            Convert.ToBase64String(Encoding.UTF8.GetBytes(
                                string.Format(CultureInfo.InvariantCulture, "{0:D4}", rangeElement))));
                model.BlockBlob.PutBlockList(blockList);
                var duration = DateTime.Now - model.StartTime;
                float fileSizeInKb = model.Size / 1024;
                string fileSizeMessage = fileSizeInKb > 1024 ?
                    string.Concat((fileSizeInKb / 1024).ToString(CultureInfo.CurrentCulture), " MB") :
                    string.Concat(fileSizeInKb.ToString(CultureInfo.CurrentCulture), " KB");
                model.UploadStatusMessage = string.Format(CultureInfo.CurrentCulture,
                    "File uploaded successfully. {0} took {1} seconds to upload",
                    fileSizeMessage, duration.TotalSeconds);
            }
            catch (Exception e)
            {
                model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                errorInOperation = true;

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(e, dicContext);
            }
            finally
            {

            }
            return Json(new
            {
                error = errorInOperation,
                isLastBlock = model.IsUploadCompleted,
                message = model.UploadStatusMessage
            });
        }
        public JsonResult GetDetailsUploadImage(string claimCode)
        {
            List<MVCModels.ExpenseClaimImageUpload> lstimage = new List<MVCModels.ExpenseClaimImageUpload>();
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            lstimage = _objClaim.GetDetailsUploadImage(claimCode);
            return Json(lstimage, JsonRequestBehavior.AllowGet);
        }

        public void GetDeleteUploadImage(int ID)
        {
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            _objClaim.GetDeleteUploadImage(ID);
        }

        public string GetConfitValueForSize()
        {
            CurrentInfo _objcur = new CurrentInfo();
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            string result = _objClaim.GetConfitValueForSize(_objcur.GetCompanyCode());
            return result;
        }
        public string GetExpClaimSearch(string UserName, int ExpMonth, int ExpYear, string selectedUserCode,string Type)
        {
            string tblString = string.Empty;
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new BLMaster();

            // string fieldExpensePriValue = objMaster.GetPrivilegeValue(_objCur.GetCompanyCode(), _objCur.GetUserCode(), "FIELD_EXPENSE_REQUEST_FOR");
            //string doctorCRMPriValue = objMaster.GetPrivilegeValue(_objCur.GetCompanyCode(), _objCur.GetUserCode(), "REQUEST_CUSTOMER_FOR");

            tblString = _objClaim.GetExpClaimSearch(_objCur.GetCompanyCode(), _objCur.GetUserCode(), _objCur.GetUserName(), selectedUserCode, UserName, ExpMonth, ExpYear, Type); //_objCur.GetUserTypeName()
            return tblString;
        }
        #region Additional Expense
        public JsonResult GetAddlDcrExpDetforMonthwise(string userCode, int month, int year)
        {
            List<AddlExpenseDetails> lstAddlExp = new List<AddlExpenseDetails>();
            lstAddlExp = _objBlExpense.GetAddlDcrExpDetforMonthwise(userCode, month, year);
            return Json(lstAddlExp, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAddlDcrExpDet(string userCode, string Dcr_From, string Dcr_To)
        {
            List<AddlExpenseDetails> lstAddlExp = new List<AddlExpenseDetails>();
            lstAddlExp = _objBlExpense.GetAddlDcrExpDet(userCode, Dcr_From, Dcr_To);
            return Json(lstAddlExp, JsonRequestBehavior.AllowGet);
        }
        public string ValidateDcrExp(string favouringUser, string detailString)
        {
            DataControl.CurrentInfo _objCurr = new CurrentInfo();
            return _objBlExpense.ValidateDcrExp(_objCurr.GetCompanyCode(), favouringUser, detailString);
        }
        public string ValidateExpenses(string userCode, string DcrDate, string DcrFlag, string DcrCat, string DcrExp, string DcrExpCode, string DcrAmt)
        {
            return _objBlExpense.ValidateExpenses(userCode, DcrDate, DcrFlag, DcrCat, DcrExp, DcrExpCode, DcrAmt);
        }
        public int DeleteDailyExpEdit(string userCode, string ClaimDet)
        {
            return _objBlExpense.DeleteDailyExpEdit(userCode, ClaimDet);
        }
        public JsonResult GetAdditionalExpense(string userCode, string DcrDate, string Flag)
        {
            //DCRUserExpenseDetails  
            return Json(_objBlExpense.GetAdditionalExpense(userCode, DcrDate, Flag), JsonRequestBehavior.AllowGet);

        }

        #endregion
        public JsonResult fngetdcrExpenseUrl(string userCode, int month, int year,string Effective_from,string Effective_to)
        {
         
            return Json(_objBlExpense.fngetdcrExpenseUrl(userCode, month, year, Effective_from, Effective_to), JsonRequestBehavior.AllowGet);

        }
    }
}
