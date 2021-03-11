using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.ComponentModel.DataAnnotations;
using HiDoctor_Master.Controllers;
using ElmahWrapper;
using DataControl;
using System.Text;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    //[AjaxSessionActionFilter]
    public class ExpenseController : Controller
    {
        //
        // GET: /Expense/
        DataControl.SPData objSData = new DataControl.SPData();
        Models.ExpenseTypeModel objUserModel = new Models.ExpenseTypeModel();
        DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data objData = new DataControl.Data();
        const string DBDateFormat = "yyyy-MM-dd";
        int totalNoofappdaysforclaim_g = 0;

        public ActionResult Create()
        {
            return View();
        }


        public JsonResult GetAllExpense()
        {
            Models.ExpenseTypeModel Expense = new Models.ExpenseTypeModel();
            DataSet ds = Expense.GetAllExpense();

            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

        }

        public JsonResult ExpensetypeDetails(string expensetypeCode)
        {
            DataControl.Data ds = new DataControl.Data();
            try
            {

                DataSet dssub = new DataSet();
                ds.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    string strSQL = "EXEC SP_hd_ExpenseType_SelectByExpencetypeCode " + objCurrentInfo.GetCompanyCode() + "," + expensetypeCode;
                    dssub = ds.ExecuteDataSet(strSQL);

                }
                DataTable dt = new DataTable();
                dt = dssub.Tables[0];

                List<Models.ExpenseTypeModel> lstMOdel = (from c in dt.AsEnumerable()
                                                          select new Models.ExpenseTypeModel
                                                          {
                                                              ExpensetypeCode = c["Expense_Type_Code"].ToString(),
                                                              ExpenseTypeName = c["Expense_Type_Name"].ToString(),
                                                              ExpenseMode = c["Expense_Mode"].ToString(),
                                                              DisplayOrder = c["Display_Order"].ToString()

                                                          }).ToList<Models.ExpenseTypeModel>();

                return Json(lstMOdel, JsonRequestBehavior.AllowGet);

            }
            finally
            {
                ds.CloseConnection();
            }
        }


        public string StatusChange(string ExpensetypeCode, string Type, string ExpenseStatus)
        {
            if (ExpenseStatus == "1")
            {
                ExpenseStatus = "0";
            }
            else
            {
                ExpenseStatus = "1";
            }
            try
            {

                objUserModel.ExpenseInsert("SP_hd_ExpenseType", ExpensetypeCode, objCurrentInfo.GetCompanyCode(), "", ExpenseStatus, "", "", Type, "");
                return "Success";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "StatusChange()");
                return ex.Message.ToString();
            }
        }

        public string Insert(FormCollection collection)
        {
            string Mode = string.Empty;
            string ExpenseTypeCode = string.Empty;
            string ExpenseStatus = string.Empty;
            string ExpenseTypeName = collection["ExpenseTypeName"];
            string Result = string.Empty;
            string displayOrder = collection["DisplayOrder"].ToString();


            string Period = collection["Period"];
            if (!string.IsNullOrEmpty(Request.Form["Type"]))
            {
                Mode = Request.Form["Type"];
                ExpenseTypeCode = Request.Form["ExpenseTypeCode"];
                ExpenseStatus = Request.Form["ExpenseStatus"];

            }
            if (Mode == "S")
            {
                //Mode = "S";
                ExpenseTypeCode = objData.GetMaxCode(objCurrentInfo.GetCompanyCode(), "tbl_SFA_Expense_Type_Master", "Expense_Type_Code", "EXT");
            }
            if (Mode == "E")
            {
                ExpenseTypeCode = Request.Form["ExpenseTypeCode"];
                ExpenseStatus = Request.Form["ExpenseStatus"];
            }
            try
            {
                Models.ExpenseTypeModel Expense = new Models.ExpenseTypeModel();
                Result = Expense.ExpenseInsert("SP_hd_ExpenseType", ExpenseTypeCode, objCurrentInfo.GetCompanyCode(), ExpenseTypeName, "0", Request.Form["ExpenseMode"], Request.Form["Period"], Mode, displayOrder);
                return Result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "Insert()");
                Result = ex.Message.ToString(); return Result;
            }
        }



        #region expense claim approval

        /// <summary>
        /// Get all the pending claim request details including child user details
        /// </summary>
        /// <returns>returns the claim request details in the html table format</returns>
        public string GetPendingClaimRequestByUser(string Company_Code, string User_Code, string User_Type_Code, string User_Type_Name, string searchKey)
        {

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            StringBuilder strTblContent = new StringBuilder();

            //string curUserTypeCode = objCurInfo.GetUserTypeCode();
            string curUserTypeName = User_Type_Name.Replace("_", " ");
            try
            {
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaimHeader = null;
                IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle = null;
                lstClaimHeader = objExpClaim.GetClaimRequestByUser(Company_Code, User_Code, User_Type_Code, searchKey);
                lstStatusCycle = objExpClaim.GetActiveStatusCycle(Company_Code);
                bool selectAll = false;
                foreach (var claim in lstClaimHeader)
                {
                    string cycleCode = claim.Cylce_Code;
                    string[] orderNo = claim.Move_Order.Split(',');
                    List<int> lstOrder = new List<int>();
                    for (int j = 0; j < orderNo.Length; j++)
                    {
                        if (orderNo[j] != "1")
                        {
                            lstOrder.Add(Convert.ToInt32(orderNo[j]));
                        }
                    }
                    var filteredList = lstStatusCycle.Where(x => lstOrder.Contains(x.Order_No) && x.Cycle_Code == cycleCode).ToList();
                    bool userTypeExist = false;
                    foreach (var filter in filteredList)
                    {
                        string[] userType = filter.Status_Owner_Type.Split(',');
                        for (int k = 0; k < userType.Length; k++)
                        {
                            if (userType[k].ToUpper() == curUserTypeName.ToUpper())
                            {
                                userTypeExist = true;
                                break;
                            }
                        }
                        if (userTypeExist)
                        {
                            break;
                        }
                    }
                    if (userTypeExist)
                    {
                        string claim_status = GetStatusCyle(Company_Code, claim.Cylce_Code, claim.Move_Order);
                        if (claim_status == "Closed")
                        {
                            selectAll = true;
                        }
                    }
                }

                strTblContent.Append("<table class='table' id='tblPendingRequest'>");
                strTblContent.Append("<thead>");
                strTblContent.Append("<tr>");
                if (selectAll)
                {
                    strTblContent.Append("<th><input type='checkbox' name='selectAll' onclick='fnCheckAll();' value=''></th>");
                }
                strTblContent.Append("<th>User Name|Designation|Region name|Division Name|Claim code</th>");
                strTblContent.Append("<th> Request Type</th>");
                strTblContent.Append("<th>DCR From Date-To Date</th>");
                strTblContent.Append("<th>Request Submitted Date</th>");
                strTblContent.Append("<th>Claim at USER Level</th>");
                strTblContent.Append("<th>Claim Status</th>");
                strTblContent.Append("<th>Show</th>");
                strTblContent.Append("</tr>");
                strTblContent.Append("</thead>");

                // strTblContent.Append("<td>Select All</br><input style='margin-left: 50%;' type='checkbox' id='chkSelectAll' onclick='fnMarkMultipleApprovel(this)'/></td>");
                strTblContent.Append("<tbody>");
                if (lstClaimHeader != null)
                {
                    //used for set checkbox id
                    int chk_cout = 0;
                    string final_btnName = "";
                    foreach (var claim in lstClaimHeader)
                    {
                        string cycleCode = claim.Cylce_Code;
                        string[] orderNo = claim.Move_Order.Split(',');
                        List<int> lstOrder = new List<int>();
                        for (int j = 0; j < orderNo.Length; j++)
                        {
                            if (orderNo[j] != "1")
                            {
                                lstOrder.Add(Convert.ToInt32(orderNo[j]));
                            }
                        }
                        var filteredList = lstStatusCycle.Where(x => lstOrder.Contains(x.Order_No) && x.Cycle_Code == cycleCode).ToList();
                        bool userTypeExist = false;
                        foreach (var filter in filteredList)
                        {
                            string[] userType = filter.Status_Owner_Type.Split(',');
                            for (int k = 0; k < userType.Length; k++)
                            {
                                if (userType[k].ToUpper() == curUserTypeName.ToUpper())
                                {
                                    userTypeExist = true;
                                    break;
                                }
                            }
                            if (userTypeExist)
                            {
                                break;
                            }
                        }
                        if (userTypeExist)
                        {
                            string editValues = claim.Claim_Code + "_" + claim.User_Code + "_" + claim.Request_Name + "_" + claim.Favouring_User_Code
                                + "_" + claim.Status_Code + "_" + claim.Move_Order + "_" + claim.Cylce_Code + "_" + claim.Request_Code + "_" + claim.User_Type_Name + "_" + claim.Date_To + "_" + claim.Expense_Claim_Screen_Mode;

                            strTblContent.Append("<tr onclick='fnEditRequest(event,\"" + editValues + "\");'>");
                            string claim_status = GetStatusCyle(Company_Code, claim.Cylce_Code, claim.Move_Order);
                            if (claim_status == "Closed")
                            {
                                List<MVCModels.StatusCycleMapping> lstStatus = GetMappedStatusCycleList(Company_Code, User_Type_Name, claim.Cylce_Code, claim.Move_Order);
                                if (lstStatus.Count > 0)
                                    editValues += "_" + lstStatus[0].Status_Code + "_" + lstStatus[0].Order_No;

                                strTblContent.Append("<td><input type='checkbox' id='chk_" + chk_cout + "' name='chkbox' value='" + editValues + "'/></td>");
                                chk_cout++;
                                if (final_btnName == "")
                                    if (lstStatus.Count > 0)
                                        final_btnName = lstStatus[0].Status_Name;

                            }
                            else if (selectAll)
                            {
                                strTblContent.Append("<td></td>");
                            }
                            strTblContent.Append("<td> <div class='col-lg-12'>");
                            strTblContent.Append("<div class='col-lg-2 user'></div>");
                            string userClaim = claim.User_Name + "|" + claim.User_Type_Name + "|" + claim.Region_Name + "|" + claim.Division_Values + " </br>" + claim.Claim_Code;
                            strTblContent.Append("<div class='col-lg-10' style='padding-top: 1%;'>" + userClaim + "</div>");
                            strTblContent.Append("</div></td>");
                            strTblContent.Append("<td>" + claim.Request_Name + "  " + "Rs " + claim.Actual_Amount + "</td>");
                            strTblContent.Append("<td>" + claim.Date_From + "-" + claim.Date_To + "</td>");
                            strTblContent.Append("<td><div class='col-lg-12'>");
                            strTblContent.Append("<div class='col-lg-1 calender'></div>");
                            strTblContent.Append("<div class='col-lg-10'>" + claim.Entered_DateTime + "</div>");
                            strTblContent.Append("</div>");
                            strTblContent.Append("</td>");
                            strTblContent.Append("<td>");
                            strTblContent.Append("<div class='col-lg-12'>");
                            strTblContent.Append("<div class='col-lg-1 remarks'></div>");
                            strTblContent.Append("<div class='col-lg-2'>" + claim.Order_No + "</div>");
                            strTblContent.Append("</div>");
                            strTblContent.Append("</td>");
                            strTblContent.Append("<td>" + claim.Status_Name + "</td>");
                            if (claim.Request_Entity == "Region Wise")
                            {
                                strTblContent.Append("<td class='td-a' onclick='fnOpenDeductionDetailPopUp(\"" + claim.Claim_Code + "\",\"" + claim.User_Code + "\");'>Show Deduction Details</td>");
                            }
                            strTblContent.Append("</tr>");

                        }
                    }
                    strTblContent.Append("</tbody>");
                    strTblContent.Append("</table>");
                    strTblContent.Append("<div style='display:none;' id='divBtnName'>" + final_btnName + "#" + chk_cout + "</div>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strTblContent", strTblContent.ToString());
                // DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strTblContent.ToString();
        }
        /// <summary>
        /// Get the selected claim request details
        /// </summary>
        /// <param name="claimCode"></param>
        /// <param name="userCode"></param>
        /// <param name="requestName"></param>
        /// <returns>returns the selected claim requst details in html table and claim header in JSON format</returns>
        public string GetClaimRequestDetails(string claimCode, string userCode, string requestName, string favouringUserCode, string requestCode, string Company_Code, string Loged_User_Code)
        {

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            StringBuilder strTblContent = new StringBuilder();
            StringBuilder strHistory = new StringBuilder();
            StringBuilder strExpenseTypeWiseDetail = new StringBuilder();
            StringBuilder strAddlExpenseDetails = new StringBuilder();
            List<MVCModels.ExpenseClaimModel> lstClaim = new List<MVCModels.ExpenseClaimModel>();
            List<MVCModels.AddlUnapproveExpModel> lstAddlClaim = new List<MVCModels.AddlUnapproveExpModel>();
            List<MVCModels.ClaimExpenseTypeWiseHistory> lstClaimExpenseWiseHistory = new List<MVCModels.ClaimExpenseTypeWiseHistory>();
            IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
            DataControl.JSONConverter objJson = new JSONConverter();
            DataControl.BLMaster objMaster = new BLMaster();
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();
            string claimMoveOrder = string.Empty;
            int expenselength = 0;
            string claimType = string.Empty;
            try
            {
                lstClaim = objExpClaim.GetExpenseClaimDetails(Company_Code, claimCode);
                // string fieldExpensePriValue = objMaster.GetPrivilegeValue(objCurInfo.GetCompanyCode(), userCode, "FIELD_EXPENSE_REQUEST_FOR");
                //string doctorCRMPriValue = objMaster.GetPrivilegeValue(objCurInfo.GetCompanyCode(), userCode, "REQUEST_CUSTOMER_FOR");
                string deductiondetailsPriValue = objMaster.GetPrivilegeValue(Company_Code, Loged_User_Code, "SHOW_CLAIM_DEDUCTION_DETAILS");
                string requestType = _objClaim.GetExpenserequestType(Company_Code, requestCode);
                claimMoveOrder = lstClaim[0].lstClaimHeader[0].Order_No.ToString();


                //string[] fieldExpensePriValues = fieldExpensePriValue.Split(',');

                // foreach (string item in fieldExpensePriValues)
                // {


                if (requestType.ToUpper() == "REGION WISE")
                {

                    #region field expense claim details
                    claimType = "FIELD_EXPENSE_REQUEST_FOR";
                    lstExpClaimDetails = objExpClaim.GetFieldExpenseClaimDetails(Company_Code, claimCode);
                    lstAddlClaim = objExpClaim.GetAddlExpenseClaimDetails(Company_Code, claimCode);
                    // int claimHistoryCount = objExpClaim.GetclaimHistoryCount(objCurInfo.GetCompanyCode(), claimCode);
                    lstClaimExpenseWiseHistory = objExpClaim.GetExpenseClaimHistoryCount(Company_Code, claimCode).ToList();
                    //if (lstAddlClaim.Count > 0)
                    //{
                    //    strAddlExpenseDetails.Append("<table cellspacing=0 cellpadding=0 id='tblExpDetails' class='table table-striped'><thead><tr>");
                    //    strAddlExpenseDetails.Append("<td>DCR Date</td><td>Work Category</td><td>Activity</td>");
                    //    strAddlExpenseDetails.Append("<td>Expense Type</td><td>Claim Amount(Rs.)</td>");
                    //    strAddlExpenseDetails.Append("<td>Previous Deduction(Rs.)</td><td>Current Deduction(Rs.)</td><td>Addt. Claim Remarks</td><td>Approved Amount (Rs.)</td><td>Approval Remarks</td>");
                    //    strAddlExpenseDetails.Append("</tr> </thead><tbody>");
                    //    int rowCount = 1;
                    //    foreach (var item in lstAddlClaim)
                    //    {
                    //        string formattedDate = string.Empty;
                    //        if (item.DCR_Actual_Date != "" && item.DCR_Actual_Date != null)
                    //        {
                    //            string[] dcrDateAddl;
                    //            dcrDateAddl = item.DCR_Actual_Date.Split(' ');
                    //            dcrDateAddl = dcrDateAddl[0].Split('/');
                    //            if (dcrDateAddl[1].Length == 1 && dcrDateAddl[0].Length == 1)
                    //            {
                    //                formattedDate = '0' + dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //            }
                    //            else if (dcrDateAddl[1].Length == 1)
                    //            {
                    //                formattedDate = '0' + dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //            }
                    //            else if (dcrDateAddl[0].Length == 1)
                    //            {
                    //                formattedDate = dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //            }
                    //            else
                    //            {
                    //                formattedDate = dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //            }

                    //        }

                    //        string dcrFlag = string.Empty;
                    //        if (item.DCR_Activity_Flag == "F")
                    //        {
                    //            dcrFlag = "Field";
                    //        }
                    //        else if (item.DCR_Activity_Flag == "A")
                    //        {
                    //            dcrFlag = "Attendance";
                    //        }

                    //        strAddlExpenseDetails.Append("<tr>");
                    //        strAddlExpenseDetails.Append("<td class='trRow' id='AddlAprDcrDate_" + rowCount + "'>" + formattedDate + "<input type='hidden' id='lblAddlExpiddcracutalDate_" + rowCount + "' value='" +
                    //                   formattedDate + "'/></td>");
                    //        strAddlExpenseDetails.Append("<td id='AddlAprDcrCat_" + rowCount + "'>" + item.Category + "(" + item.DCR_Activity_Flag + ")" + "</td>");
                    //        strAddlExpenseDetails.Append("<td id='AddlAprDcrAct_" + rowCount + "'>" + dcrFlag + "</td>");
                    //        strAddlExpenseDetails.Append("<td id='AddlAprExpType_" + rowCount + "' Addl_Exp_Code='" + item.Expense_Type_Name +"'>" + item.Expense_Type_Name + "<input type='hidden' id='AddlAprExpCode_" + rowCount + "' value='" + item.Expense_Type_Code + "' /></td>");
                    //        strAddlExpenseDetails.Append("<td id='AddlAprClaimAmt_" + rowCount + "'>" + item.Expense_Amount + "</td>");
                    //        strAddlExpenseDetails.Append("<td id='AddlExpDedAmt_" + rowCount + "'>" + item.Deduction_Amount + "</td>");
                    //        if (deductiondetailsPriValue.ToUpper() == "YES")
                    //        {
                    //            strAddlExpenseDetails.Append("<td><input class='form-control numbersOnly' onblur='fnAddlCalcItemWiseApprovedAmount(" + rowCount + ");' id='AddlExpCurrDed_" + rowCount + "' type='number'/></td>");
                    //        }
                    //        else
                    //        {
                    //            strAddlExpenseDetails.Append("<td><input class='form-control numbersOnly' onblur='fnAddlCalcItemWiseApprovedAmount(" + rowCount + ");' id='AddlExpCurrDed_" + rowCount + "' type='number' readonly='readonly'/></td>");
                    //        }
                    //        strAddlExpenseDetails.Append("<td id='AddlExpDedAmt_" + rowCount + "'>" + item.Remarks_By_User + "</td>");
                    //        if (claimMoveOrder != "1")
                    //        {
                    //            strAddlExpenseDetails.Append("<td id='AddlExpAprAmt_" + rowCount + "'>" + item.Approved_Amount + "</td>");
                    //        }
                    //        else
                    //        {
                    //            strAddlExpenseDetails.Append("<td id='AddlExpAprAmt_" + rowCount + "'>" + item.Expense_Amount + "</td>");
                    //        }
                    //        strAddlExpenseDetails.Append("<td><input class='form-control' id='AddlAprDcrRem_" + rowCount + "' type='text'/><input type='hidden' id='hdnAddlClaimDetCode_" + rowCount + "' value='" + item.Claim_Detail_Code + "' /><input type='hidden' id='hdnAddlBillNum_" + rowCount + "' value='" + item.Bill_Number + "' /></td>");
                    //        strAddlExpenseDetails.Append("</tr>");
                    //        rowCount = rowCount + 1;
                    //    }
                    //    strAddlExpenseDetails.Append("</tbody></table>");
                    //}

                    strTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblExpDetails' class='table'><thead><tr>");
                    strTblContent.Append("<td style='padding-left:10px;'>DCR_Date</td><td>Work Category</td><td>Activity</td><td>Num.of Doctors Visited</td>");
                    strTblContent.Append("<td>TP Report</td><td>DCR SFC Details</td><td class='monthDcrHide'>DCR Status</td><td>DCR Report</td><td>Distance Travelled (Km.)</td><td>Remarks Details</td><td>Expense Type</td><td>Claim Amount(Rs.)</td>");
                    //strTblContent.Append("");//<td>Manager Approval Remarks</td>
                    strTblContent.Append("<td>Previous Deduction (Rs.)</td><td>Current Deduction (Rs.)</td><td>Approved Amount (Rs.)</td><td>Approval Remarks</td>");

                    strTblContent.Append("</tr></thead><tbody>");
                    if (lstExpClaimDetails != null)
                    {
                        var lstDistDate = lstExpClaimDetails.Select(x => new { x.DCR_Actual_Date }).Distinct().ToList();
                        int IRow = 0;
                        int i = 0;
                        List<MVCModels.ExpenseTable> lst2 = new List<MVCModels.ExpenseTable>();
                        foreach (var distinctDate in lstDistDate)
                        {
                            List<MVCModels.ExpenseClaimDetailsModel> lstD = (List<MVCModels.ExpenseClaimDetailsModel>)(lstExpClaimDetails.Where(e => e.DCR_Actual_Date == distinctDate.DCR_Actual_Date)).ToList();
                            var lstExpeseTypeDate = lstD.Select(x => new { x.Expense_Type_Code }).Distinct().ToList();
                            IRow = lstExpeseTypeDate.Count;

                            ////SFC DETAIL//

                            StringBuilder strContentSFC = new StringBuilder();
                            BL_ExpenseClaim objClaim = new BL_ExpenseClaim();
                            string sfcFlag = string.Empty;
                            string DCR_Code = string.Empty;
                            string distanceTravelled = "";
                            DataSet ds = new DataSet();
                            sfcFlag = lstD[0].DCR_Activity_Flag.ToString();
                            string dcrDateSFC = distinctDate.DCR_Actual_Date.Split('-')[2] + "-" + distinctDate.DCR_Actual_Date.Split('-')[1] + "-" + distinctDate.DCR_Actual_Date.Split('-')[0];
                            DCR_Code = lstD[0].DCR_Code.ToString();
                            distanceTravelled = GetDistanceTravelled(Company_Code, dcrDateSFC, DCR_Code);
                            ds = objClaim.GetDCRSFCDetails(Company_Code, favouringUserCode, dcrDateSFC, sfcFlag);

                            if (ds.Tables.Count > 1)
                            {

                                if (ds.Tables[1].Rows.Count > 0)
                                {
                                    foreach (DataRow dr in ds.Tables[1].Rows)
                                    {
                                        strContentSFC.Append("<table>");
                                        strContentSFC.Append("<tr>");
                                        if (dr["Route_Way"].ToString() == "R")
                                        {
                                            strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "," + " " + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                            strContentSFC.Append("<br/>");
                                        }
                                        else
                                        {
                                            strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["To_Place"]) + "-" + Convert.ToString(dr["From_Place"]) + "," + " " + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                            strContentSFC.Append("<br/>");
                                        }
                                        strContentSFC.Append("</tr>");
                                        strContentSFC.Append("</table>");

                                    }

                                    if (ds.Tables[0].Rows.Count > 0)
                                    {
                                        foreach (DataRow dr in ds.Tables[0].Rows)
                                        {
                                            if (dr["From_Place"].ToString() != "" || dr["To_Place"].ToString() != "")
                                            {
                                                strContentSFC.Append("<table>");
                                                strContentSFC.Append("<tr>");
                                                strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "," + " " + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                                strContentSFC.Append("<br/>");
                                                strContentSFC.Append("</tr>");
                                                strContentSFC.Append("</table>");
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    foreach (DataRow dr in ds.Tables[0].Rows)
                                    {
                                        strContentSFC.Append("<table>");
                                        strContentSFC.Append("<tr>");
                                        strContentSFC.Append("<td style='border-style: hidden !important;'>" + Convert.ToString(dr["From_Place"]) + "-" + Convert.ToString(dr["To_Place"]) + "," + " " + Convert.ToString(dr["Travel_Mode"]) + "(" + Convert.ToString(dr["Distance"]) + ")</td>");
                                        strContentSFC.Append("<br/>");
                                        strContentSFC.Append("</tr>");
                                        strContentSFC.Append("</table>");
                                    }
                                }

                            }

                            //strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstExpeseTypeDate.Count + "'>" + strContentSFC.ToString() + "</td>");
                            ///SFC DETAIL//
                            StringBuilder strContentWC = new StringBuilder();
                            StringBuilder strContentA = new StringBuilder();
                            StringBuilder strContentD = new StringBuilder();
                            StringBuilder strContentDCRS = new StringBuilder();

                            foreach (var expClaim in lstD)
                            {

                                if (IRow > 0 && i != 0)
                                {
                                    strTblContent.Append("<tr  class='border_top'>");
                                }
                                else
                                {
                                    strTblContent.Append("<tr>");
                                }
                                i++;
                                if (IRow > 0)
                                {

                                    strTblContent.Append("<td style='vertical-align:middle; padding-left:1px;'  rowspan='" + lstD.Count + "'>" + expClaim.DCR_Actual_Date + "</td>");
                                    string cate = "";
                                    string cateSet = "";
                                    string activity = "";
                                    string[] activitySplit = null;
                                    string status = "";
                                    List<string> lst = new List<string>();

                                    foreach (var cat in lstD)
                                    {

                                        if (cateSet != cat.DCR_Activity_Flag.ToString())
                                        {
                                            cateSet = cat.DCR_Activity_Flag.ToString();
                                            cate += cat.Category + "(" + cat.DCR_Activity_Flag + "),";
                                            // activity += cat.DCR_Activity_Flag.ToString() == "F" ? "Field," : "Attendance,";
                                            if (cat.DCR_Activity_Flag.ToString() == "F")
                                            {
                                                activity += "Field,";
                                                lst.Add("Field");
                                            }
                                            else
                                            {
                                                if (cat.Activity_Name.ToString() == "")
                                                {
                                                    activity += "Attendance,";
                                                    lst.Add("Attendance");
                                                }
                                                else
                                                {
                                                    activity += "Attendance" + " " + "(" + cat.Activity_Name.ToString() + "),";
                                                    lst.Add("Attendance" + " " + "(" + cat.Activity_Name.ToString() + ")");
                                                }
                                            }
                                            status += cat.DCR_Status == "2" ? "Approved(" + cat.DCR_Activity_Flag.ToString() + ")," : cat.DCR_Status == "1" ?
                                                "Applied(" + cat.DCR_Activity_Flag.ToString() + ")," : cat.DCR_Status == "3" ?
                                                "Draft(" + cat.DCR_Activity_Flag.ToString() + ")," : "Unapproved(" + cat.DCR_Activity_Flag.ToString() + "),";


                                        }

                                    }
                                    //table code for work category
                                    string[] cateSplit = null;
                                    cate = cate.TrimEnd(',');
                                    cateSplit = cate.Split(',');
                                    if (cateSplit.Length > 1)
                                    {
                                        for (var c = 0; c < cateSplit.Length; c++)
                                        {
                                            strContentWC.Append("<table>");
                                            strContentWC.Append("<tr>");
                                            strContentWC.Append("<td style='border-style: hidden !important;'>" + cateSplit[c] + "</td>");
                                            strContentWC.Append("</tr>");
                                            strContentWC.Append("<br/>");
                                            strContentWC.Append("</table>");
                                        }
                                    }
                                    else
                                    {
                                        strContentWC.Append("<table>");
                                        strContentWC.Append("<tr>");
                                        strContentWC.Append("<td style='border-style: hidden !important;'>" + cate + "</td>");
                                        strContentWC.Append("</tr>");
                                        strContentWC.Append("<br/>");
                                        strContentWC.Append("</table>");
                                    }

                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + strContentWC.ToString() + "</td>");

                                    string flag = string.Empty;

                                    //table for Activity
                                    //  string[] activitySplit = null;
                                    activity = activity.TrimEnd(',');
                                    //activitySplit = activity.Split(',');
                                    if (lst.Count > 1)
                                    {
                                        for (var a = 0; a < lst.Count; a++)
                                        {
                                            strContentA.Append("<table>");
                                            strContentA.Append("<tr>");
                                            strContentA.Append("<td style='border-style: hidden !important;'>" + lst[a] + "</td>");
                                            strContentA.Append("</tr>");
                                            strContentA.Append("<br/>");
                                            strContentA.Append("</table>");
                                        }
                                    }
                                    else
                                    {
                                        strContentA.Append("<table>");
                                        strContentA.Append("<tr>");
                                        strContentA.Append("<td style='border-style: hidden !important;'>" + lst[0] + "</td>");
                                        strContentA.Append("</tr>");
                                        strContentA.Append("<br/>");
                                        strContentA.Append("</table>");
                                    }

                                    //Table for DCR Status
                                    string[] statusSplit = null;
                                    status = status.TrimEnd(',');
                                    statusSplit = status.Split(',');
                                    if (statusSplit.Length > 1)
                                    {
                                        for (var s = 0; s < statusSplit.Length; s++)
                                        {
                                            strContentDCRS.Append("<table>");
                                            strContentDCRS.Append("<tr>");
                                            strContentDCRS.Append("<td style='border-style: hidden !important;'>" + statusSplit[s] + "</td>");
                                            strContentDCRS.Append("</tr>");
                                            strContentDCRS.Append("<br/>");
                                            strContentDCRS.Append("</table>");
                                        }
                                    }
                                    else
                                    {
                                        strContentDCRS.Append("<table>");
                                        strContentDCRS.Append("<tr>");
                                        strContentDCRS.Append("<td style='border-style: hidden !important;'>" + status + "</td>");
                                        strContentDCRS.Append("</tr>");
                                        strContentDCRS.Append("<br/>");
                                        strContentDCRS.Append("</table>");
                                    }

                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + " '>" + strContentA.ToString() + "</td>");
                                    int att = 0;
                                    if (lst.Count() > 1)
                                    {
                                        for (var a = 0; a < lst.Count(); a++)
                                        {
                                            if (lst[a] == "Field")
                                            {
                                                strContentD.Append("<table>");
                                                strContentD.Append("<tr>");
                                                strContentD.Append("<td style='border-style: hidden !important;'>" + expClaim.Doctor_Visit_Count + "</td>");
                                                strContentD.Append("</tr>");
                                                strContentD.Append("<br/>");
                                                strContentD.Append("</table>");
                                            }
                                            else
                                            {
                                                if (att == 0)
                                                {
                                                    strContentD.Append("<table>");
                                                    strContentD.Append("<tr>");
                                                    strContentD.Append("<td style='border-style: hidden !important;'>" + expClaim.ADoctor_Visit_Count + "</td>");
                                                    strContentD.Append("</tr>");
                                                    strContentD.Append("<br/>");
                                                    strContentD.Append("</table>");
                                                    att = att + 1;
                                                }
                                            }
                                        }

                                    }
                                    else
                                    {
                                        if (lst[0] == "Field")
                                        {

                                            strContentD.Append("<table>");
                                            strContentD.Append("<tr>");
                                            strContentD.Append("<td style='border-style: hidden !important;'>" + expClaim.Doctor_Visit_Count + "</td>");
                                            strContentD.Append("</tr>");
                                            strContentD.Append("<br/>");
                                            strContentD.Append("</table>");
                                        }
                                        else
                                        {
                                            strContentD.Append("<table>");
                                            strContentD.Append("<tr>");
                                            strContentD.Append("<td style='border-style: hidden !important;'>" + expClaim.ADoctor_Visit_Count + "</td>");
                                            strContentD.Append("</tr>");
                                            strContentD.Append("<br/>");
                                            strContentD.Append("</table>");
                                        }


                                    }
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + strContentD.ToString() + "</td>");
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'><a onclick = fnGetTPDetails('" + expClaim.DCR_Actual_Date + "')>TP Details</a></td>");
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + strContentSFC.ToString() + "</td>");
                                    strTblContent.Append("<td class='monthDcrHide'  rowspan='" + lstD.Count + "'>" + strContentDCRS.ToString() + "</td>");
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'><a onclick = fnGetDCRDetails('" + expClaim.DCR_Code + "')>DCR Details</a>" + "</td>");
                                    strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'>" + distanceTravelled + "</td>");
                                }
                                IRow = 0;
                                MVCModels.ExpenseTable add = new MVCModels.ExpenseTable();
                                List<MVCModels.ExpenseTable> result = new List<MVCModels.ExpenseTable>();
                                // result= (from s in lst2
                                //                                                   where s.DCR_Expense_Code == expClaim.DCR_Expense_Code
                                //                                       select s).ToList();
                                if (result.Count == 0)
                                {
                                    add.DCR_Expense_Code = expClaim.DCR_Expense_Code;
                                    lst2.Add(add);
                                    expenselength = i;
                                    if (expClaim.Expense_Mode == "Manual")
                                    {
                                        if (expClaim.Expense_Remarks != "-" || expClaim.Remarks_By_User != "-" || expClaim.Bill_Number != "-")
                                        {
                                            strTblContent.Append("<td><a href='#' onclick='fnViewRemarks(\"" + expClaim.Expense_Remarks + "\",\"" + expClaim.Remarks_By_User + "\",\"" + expClaim.Bill_Number + "\")'>View Remarks</a></td>");
                                            //strTblContent.Append("<td><a onclick = fnGetDCRDetails('" + expClaim.DCR_Code + "')>DCR Details</a>" + "</td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td>-</td>");
                                        }
                                        strTblContent.Append("<td class='trlength clsApplied' id='spnClaimExpTypeName_" + i + "'  Exp_Code='" + expClaim.Expense_Type_Name + "'>" + expClaim.Expense_Type_Name + "(" + expClaim.DCR_Activity_Flag + ")</td><input type='hidden' id='hdnClaimDetailCode_" + i + "' value='" +
                                    expClaim.Claim_Detail_Code + "'/><input type='hidden' id='lbliddcracutalDate_" + i + "' value='" +
                                    expClaim.DCR_Actual_Date + "'/><input type='hidden' id='hdnDCRExpenseCode_" + i + "' value='" +
                                    expClaim.DCR_Expense_Code + "'/><input type='hidden' id='hdnAutomaticExpenseCode_" + i + "' value='" +
                                    expClaim.Expense_Type_Code + "'/>");
                                        strTblContent.Append("<td class='tdAlignRight clsApplied' id='spnClaimAmount_" + i + "'>" + expClaim.Expense_Amount + "</td>");


                                       
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Expense_Remarks + "</td>");
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Remarks_By_User + "</td>");
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Bill_Number + "</td>");

                                    }
                                    else
                                    {
                                        if (expClaim.Expense_Remarks != "-" || expClaim.Remarks_By_User != "-" || expClaim.Bill_Number != "-")
                                        {
                                            strTblContent.Append("<td><a href='#' onclick='fnViewRemarks(\"" + expClaim.Expense_Remarks + "\",\"" + expClaim.Remarks_By_User + "\",\"" + expClaim.Bill_Number + "\")'>View Remarks</a></td>");
                                            //strTblContent.Append("<td style='vertical-align:middle' rowspan='" + lstD.Count + "'><a onclick = fnGetDCRDetails('" + expClaim.DCR_Code + "')>DCR Details</a>" + "</td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td>-</td>");
                                        }
                                        strTblContent.Append("<td class='trlength ' id='spnClaimExpTypeName_" + i + "'  Exp_Code='" + expClaim.Expense_Type_Name + "'>" + expClaim.Expense_Type_Name + "(" + expClaim.DCR_Activity_Flag + ")</td><input type='hidden' id='hdnClaimDetailCode_" + i + "' value='" +
                                     expClaim.Claim_Detail_Code + "'/><input type='hidden' id='lbliddcracutalDate_" + i + "' value='" +
                                     expClaim.DCR_Actual_Date + "'/><input type='hidden' id='hdnDCRExpenseCode_" + i + "' value='" +
                                     expClaim.DCR_Expense_Code + "'/><input type='hidden' id='hdnAutomaticExpenseCode_" + i + "' value='" +
                                     expClaim.Expense_Type_Code + "'/>");
                                        strTblContent.Append("<td class='tdAlignRight' id='spnClaimAmount_" + i + "'>" + expClaim.Expense_Amount + "</td>");

                                       
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Expense_Remarks + "</td>");
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Remarks_By_User + "</td>");
                                        //strTblContent.Append("<td class='clsApplied'>" + expClaim.Bill_Number + "</td>");
                                    }
                                    if (expClaim.Expense_Mode == "Manual")
                                    {
                                        if (claimMoveOrder != "1")
                                        {
                                            strTblContent.Append("<td class='tdAlignRight clsApplied' id='spnpreviousDecAmount_" + i + "'>" + Math.Round(expClaim.Deduction_Amount, 2) + "</td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td class='tdAlignRight clsApplied' id='spnpreviousDecAmount_" + i + "'>0</td>");
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
                                            strTblContent.Append("<td class='tdAlignRight clsApplied'><input type='number' min='1'  class='form-control numbersOnly" + clsdeduction
                                                + "' value='" + 0 + "' id='txtDeduction_" + i + "'  onblur='fnCalcItemWiseApprovedAmount(" + i + ");' /></td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td class='tdAlignRight clsApplied'><input type='number' min='1' readonly=readonly class='form-control numbersOnly" + clsdeduction
                                                + "' value='" + 0 + "' id='txtDeduction_" + i + "' /></td>");
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
                                                strTblContent.Append("<td class='tdAlignRight clsApplied' style='position:relative;text-align:center;'><span id='spnApproved_" + i + "'>"
                                                    + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span><span style='position:absolute;top:0'>" + "(" + Convert.ToInt32(Expcount) + ")" + "</span></td>");
                                            }
                                            else
                                            {

                                                strTblContent.Append("<td class='tdAlignRight clsApplied' style='position:relative;text-align:center;'><span id='spnApproved_" + i + "'>"
                                                        + Convert.ToDouble(expClaim.Expense_Amount) + "</span><span style='position:absolute;top:0'>" + "(" + Convert.ToInt32(Expcount) + ")" + "</span></td>");
                                            }
                                        }
                                        else
                                        {
                                            if (claimMoveOrder != "1")
                                            {
                                                strTblContent.Append("<td class='tdAlignRight clsApplied' style='text-align:center;'><span id='spnApproved_" + i + "'>"
                                                        + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span></td>");
                                            }
                                            else
                                            {
                                                strTblContent.Append("<td class='tdAlignRight clsApplied' style='text-align:center;'><span id='spnApproved_" + i + "'>"
                                                      + Convert.ToDouble(expClaim.Expense_Amount) + "</span></td>");
                                            }
                                        }

                                        strTblContent.Append("<input type='hidden' value='" + expClaim.Bill_Number
                                                + "' class='form-control clsCheckSpecial' readonly='readonly' id='txtBillNumber_" + i + "' maxlength='100'/>");
                                        if (deductiondetailsPriValue.ToUpper() == "YES")
                                        {
                                            strTblContent.Append("<td class='clsApplied' style='width:12%'><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                                + "' id='txtAdminRemarks_" + i + "' maxlength='1000'/></td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td class='clsApplied'  style='width:12%'><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                                + "' id='txtAdminRemarks_" + i + "' maxlength='1000' readonly='readonly'/></td>");
                                        }
                                    }
                                    else
                                    {
                                        if (claimMoveOrder != "1")
                                        {
                                            strTblContent.Append("<td class='tdAlignRight ' id='spnpreviousDecAmount_" + i + "'>" + Math.Round(expClaim.Deduction_Amount, 2) + "</td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td class='tdAlignRight ' id='spnpreviousDecAmount_" + i + "'>0</td>");
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
                                            strTblContent.Append("<td class='tdAlignRight'><input type='number' min='1'  class='form-control numbersOnly" + clsdeduction
                                                + "' value='" + 0 + "' id='txtDeduction_" + i + "'  onblur='fnCalcItemWiseApprovedAmount(" + i + ");' /></td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td class='tdAlignRight'><input type='number' min='1' readonly=readonly class='form-control numbersOnly" + clsdeduction
                                                + "' value='" + 0 + "' id='txtDeduction_" + i + "' /></td>");
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
                                            strTblContent.Append("<td style='width:12%'><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                                + "' id='txtAdminRemarks_" + i + "' maxlength='1000'/></td>");
                                        }
                                        else
                                        {
                                            strTblContent.Append("<td style='width:12%'><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                                + "' id='txtAdminRemarks_" + i + "' maxlength='1000' readonly='readonly'/></td>");
                                        }

                                    }
                                }
                                //strTblContent.Append("<td>" + expClaim.Remarks_By_User + "</td></tr>");
                            }
                        }
                    }
                    ////////////////// Additional Expense//////////////
                    //int rowCount1 = 1;
                    //foreach (var item in lstAddlClaim)
                    //{
                    //    string formattedDate = string.Empty;
                    //    if (item.DCR_Actual_Date != "" && item.DCR_Actual_Date != null)
                    //    {
                    //        string[] dcrDateAddl;
                    //        dcrDateAddl = item.DCR_Actual_Date.Split(' ');
                    //        dcrDateAddl = dcrDateAddl[0].Split('/');
                    //        if (dcrDateAddl[1].Length == 1 && dcrDateAddl[0].Length == 1)
                    //        {
                    //            formattedDate = '0' + dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //        }
                    //        else if (dcrDateAddl[1].Length == 1)
                    //        {
                    //            formattedDate = '0' + dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //        }
                    //        else if (dcrDateAddl[0].Length == 1)
                    //        {
                    //            formattedDate = dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //        }
                    //        else
                    //        {
                    //            formattedDate = dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    //        }

                    //    }

                    //    string dcrFlag = string.Empty;
                    //    if (item.DCR_Activity_Flag == "F")
                    //    {
                    //        dcrFlag = "Field";
                    //    }
                    //    else if (item.DCR_Activity_Flag == "A")
                    //    {
                    //        dcrFlag = "Attendance";
                    //    }

                    //    strTblContent.Append("<tr id='Add_" + rowCount1 + "' class='clsApplied'>");
                    //    strTblContent.Append("<td class='trRow' id='AddlAprDcrDate_" + rowCount1 + "'>" + formattedDate + "<input type='hidden' id='lblAddlExpiddcracutalDate_" + rowCount1 + "' value='" +
                    //               formattedDate + "'/></td>");
                    //    strTblContent.Append("<td  id='AddlAprDcrCat_" + rowCount1 + "'>" + item.Category + "(" + item.DCR_Activity_Flag + ")" + "</td>");
                    //    strTblContent.Append("<td  id='AddlAprDcrAct_" + rowCount1 + "'>" + dcrFlag + "</td>");
                    //    strTblContent.Append("<td>-</td>");
                    //    strTblContent.Append("<td>-</td>");
                    //    strTblContent.Append("<td>-</td>");
                    //    strTblContent.Append("<td>-</td>");
                    //    strTblContent.Append("<td>-</td>");
                    //    strTblContent.Append("<td></td>");

                    //    strTblContent.Append("<td class='trlength' id='AddlAprExpType_" + rowCount1 + "'  Addl_Exp_Code='" + item.Expense_Type_Name + "'>" + item.Expense_Type_Name + "<input type='hidden' id='AddlAprExpCode_" + rowCount1 + "' value='" + item.Expense_Type_Code + "' /></td>");
                    //    strTblContent.Append("<td class='tdAlignRight' id='AddlAprClaimAmt_" + rowCount1 + "'>" + item.Expense_Amount + "</td>");
                    //    strTblContent.Append("<td></td>");
                    //    strTblContent.Append("<td class='tdAlignRight' id='AddlExpDedAmt_" + rowCount1 + "'>" + item.Deduction_Amount + "</td>");
                    //    if (deductiondetailsPriValue.ToUpper() == "YES")
                    //    {
                    //        strTblContent.Append("<td><input class='form-control numbersOnly' onblur='fnAddlCalcItemWiseApprovedAmount(" + rowCount1 + ");' id='AddlExpCurrDed_" + rowCount1 + "' type='number' value='0'/></td>");
                    //    }
                    //    else
                    //    {
                    //        strTblContent.Append("<td><input class='form-control numbersOnly' onblur='fnAddlCalcItemWiseApprovedAmount(" + rowCount1 + ");' id='AddlExpCurrDed_" + rowCount1 + "' type='number' value='0' readonly='readonly'/></td>");
                    //    }
                    //    strAddlExpenseDetails.Append("<td id='AddlExpDedAmt_" + rowCount + "'>" + item.Remarks_By_User + "</td>");
                    //    if (claimMoveOrder != "1")
                    //    {
                    //        strTblContent.Append("<td id='AddlExpAprAmt_" + rowCount1 + "'>" + item.Approved_Amount + "</td>");
                    //    }
                    //    else
                    //    {
                    //        strTblContent.Append("<td id='AddlExpAprAmt_" + rowCount1 + "'>" + item.Expense_Amount + "</td>");
                    //    }
                    //    strTblContent.Append("<td><input class='form-control' id='AddlAprDcrRem_" + rowCount1 + "' type='text'/><input type='hidden' id='hdnAddlClaimDetCode_" + rowCount1 + "' value='" + item.Claim_Detail_Code + "' /><input type='hidden' id='hdnAddlBillNum_" + rowCount1 + "' value='" + item.Bill_Number + "' /></td>");
                    //    strTblContent.Append("</tr>");
                    //    rowCount1 = rowCount1 + 1;
                    //}
                    strTblContent.Append("</tbody></table>");

                    #endregion field expense claim details
                }
                else if (requestType.ToUpper() == "CUSTOMER WISE")
                {
                    #region DOCTOR CRM claim details
                    claimType = "REQUEST_CUSTOMER_FOR";
                    lstExpClaimDetails = objExpClaim.GetDoctorCRMClaimDetails(Company_Code, claimCode);
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
                                strTblContent.Append("<td class='tdAlignRight'><input type='number' min='1' class='form-control numbersOnly" + clsdeduction + "' value='" + expClaim.Deduction_Amount
                                    + "' id='txtDeduction_" + i + "' onblur='fnCalcItemWiseApprovedAmount(" + i + ");' /></td>");
                            }
                            else
                            {
                                strTblContent.Append("<td class='tdAlignRight'><input type='number' min='1' class='form-control numbersOnly" + clsdeduction + "' readonly=readonly value='"
                                    + expClaim.Deduction_Amount
                                    + "' id='txtDeduction_" + i + "' /></td>");
                            }
                            strTblContent.Append("<td class='tdAlignRight'><span id='spnApproved_" + i + "'>"
                            + (Convert.ToDouble(expClaim.Expense_Amount) - Convert.ToDouble(expClaim.Deduction_Amount)) + "</span></td>");
                            strTblContent.Append("<td>" + expClaim.Present_Contribution + "</td>");
                            strTblContent.Append("<td>" + expClaim.Potential_Contribution + "</td>");

                            strTblContent.Append("<td><input type='text' class='form-control clsCheckSpecial' value='"
                                + expClaim.Bill_Number + "' id='txtBillNumber_" + i + "' maxlength='100' readonly='readonly'/></td>");
                            if (deductiondetailsPriValue.ToUpper() == "YES")
                            {
                                strTblContent.Append("<td><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                    + "' id='txtAdminRemarks_" + i + "' maxlength='1000'/></td>");
                            }
                            else
                            {
                                strTblContent.Append("<td><input type='text' class='form-control clsCheckRemarks' value='" + expClaim.Managers_Approval_Remark
                                    + "' id='txtAdminRemarks_" + i + "' readonly='readonly' maxlength='1000'/></td>");
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
            return strTblContent.ToString() + "$" + claimType + "$" + strHistory.ToString() + "$" + objJson.Serialize(lstClaim) + "$" + strExpenseTypeWiseDetail + "$" + strAddlExpenseDetails.ToString() + "$" + expenselength;
        }
        /// <summary>
        /// Get Mapped Status Names for approval
        /// </summary>
        /// <param name="statusCode"></param>
        /// <param name="cycleCode"></param>
        /// <param name="moveOrder"></param>
        /// <returns></returns>

        //public string GetClaimRequestDetailsMutipleApprovel(string claimCode, string userCode, string requestName, string favouringUserCode, string requestCode, int type, out List<MVCModels.ExpenseClaimModel> lstClaim, ref IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails)
        public string GetClaimRequestDetailsMutipleApprovel(string Company_Code, string claimCode, string requestCode, out List<MVCModels.ExpenseClaimModel> lstClaim, ref IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails)
        {

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            DataControl.BL_ExpenseClaim _objClaim = new DataControl.BL_ExpenseClaim();

            lstClaim = objExpClaim.GetExpenseClaimDetails(Company_Code, claimCode);

            string requestType = _objClaim.GetExpenserequestType(Company_Code, requestCode);
            string claimType = string.Empty;
            if (requestType.ToUpper() == "REGION WISE")
            {
                claimType = "FIELD_EXPENSE_REQUEST_FOR";
                lstExpClaimDetails = objExpClaim.GetFieldExpenseClaimDetails(Company_Code, claimCode);
            }
            else if (requestType.ToUpper() == "CUSTOMER WISE")
            {
                claimType = "REQUEST_CUSTOMER_FOR";
                lstExpClaimDetails = objExpClaim.GetDoctorCRMClaimDetails(Company_Code, claimCode);
            }
            return claimType;
        }
        public string GetMappedStatusCycle(string cycleCode, string moveOrder, string Company_Code, string User_Type_Name, string User_Name, string Region_Name)
        {
            string UserType_Name = User_Type_Name.Replace("_", " ");
            string RegionName = Region_Name.Replace("_", " ");

            DataControl.JSONConverter objJson = new JSONConverter();

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle = null;
            lstStatusCycle = objExpClaim.GetActiveStatusCycle(Company_Code);
            string curUserTypeName = UserType_Name;
            List<MVCModels.StatusCycleMapping> lstStatus = new List<MVCModels.StatusCycleMapping>();

            var mappedStatus = lstStatusCycle.Where(x => x.Cycle_Code == cycleCode).ToList();
            string[] orderNo = moveOrder.Split(',');

            List<int> lstOrder = new List<int>();
            for (int j = 0; j < orderNo.Length; j++)
            {
                if (orderNo[j] != "1")
                {
                    lstOrder.Add(Convert.ToInt32(orderNo[j]));
                }
            }
            var filteredList = mappedStatus.Where(x => lstOrder.Contains(x.Order_No)).ToList();

            foreach (var filter in filteredList)
            {
                bool userTypeExist = false;
                string[] userType = filter.Status_Owner_Type.Split(',');
                for (int k = 0; k < userType.Length; k++)
                {
                    if (userType[k].ToUpper() == curUserTypeName.ToUpper())
                    {
                        userTypeExist = true;
                        break;
                    }
                }
                if (userTypeExist)
                {
                    MVCModels.StatusCycleMapping objStatus = new MVCModels.StatusCycleMapping();
                    objStatus.Status_Code = filter.Status_Code;
                    objStatus.Status_Name = filter.Status_Name;
                    objStatus.Order_No = filter.Order_No;
                    objStatus.Move_Order = filter.Move_Order;
                    lstStatus.Add(objStatus);
                }
            }


            return objJson.Serialize(lstStatus) + "^" + User_Name + "|" + RegionName;
        }
        public List<MVCModels.StatusCycleMapping> GetMappedStatusCycleList(string Company_Code, string User_Type_Name, string cycleCode, string moveOrder)
        {
            DataControl.JSONConverter objJson = new JSONConverter();

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle = null;
            lstStatusCycle = objExpClaim.GetActiveStatusCycle(Company_Code);
            string curUserTypeName = User_Type_Name;
            List<MVCModels.StatusCycleMapping> lstStatus = new List<MVCModels.StatusCycleMapping>();

            var mappedStatus = lstStatusCycle.Where(x => x.Cycle_Code == cycleCode).ToList();
            string[] orderNo = moveOrder.Split(',');

            List<int> lstOrder = new List<int>();
            for (int j = 0; j < orderNo.Length; j++)
            {
                if (orderNo[j] != "1")
                {
                    lstOrder.Add(Convert.ToInt32(orderNo[j]));
                }
            }
            var filteredList = mappedStatus.Where(x => lstOrder.Contains(x.Order_No)).ToList();

            foreach (var filter in filteredList)
            {
                bool userTypeExist = false;
                string[] userType = filter.Status_Owner_Type.Split(',');
                for (int k = 0; k < userType.Length; k++)
                {
                    if (userType[k].ToUpper() == curUserTypeName.ToUpper())
                    {
                        userTypeExist = true;
                        break;
                    }
                }
                if (userTypeExist)
                {
                    MVCModels.StatusCycleMapping objStatus = new MVCModels.StatusCycleMapping();
                    objStatus.Status_Code = filter.Status_Code;
                    objStatus.Status_Name = filter.Status_Name;
                    objStatus.Order_No = filter.Order_No;
                    objStatus.Move_Order = filter.Move_Order;
                    lstStatus.Add(objStatus);
                }
            }


            return lstStatus;
        }

        public string GetStatusCyle(string Company_Code, string cycleCode, string moveOrder)
        {
            string Status = string.Empty;
            int rowsAffected = 0;
            DataControl.JSONConverter objJson = new JSONConverter();

            DataControl.DAL_ExpenseClaim objExpClaim = new DAL_ExpenseClaim();
            rowsAffected = objExpClaim.GetStatusCycleCount(Company_Code, cycleCode, moveOrder);
            if (rowsAffected >= 1)
            {
                Status = "Approved";
            }
            else if (rowsAffected == 0)
            {
                Status = "Closed";
            }
            return Status;
        }

        public JsonResult GetCRMPaymentDetails(string companyCode, string ClaimCode)
        {
            DataControl.BL_ExpenseClaim objExpClaim = new BL_ExpenseClaim();
            List<MVCModels.CRMPaymentDetails> lstPayment = new List<MVCModels.CRMPaymentDetails>();
            lstPayment = objExpClaim.GetCRMPaymentDetails(companyCode, ClaimCode);
            return Json(lstPayment, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Insert expense claim approval
        /// </summary>
        /// <param name="claimCode"></param>
        /// <param name="claimDetails"></param>
        /// <param name="statusCode"></param>
        /// <param name="approvedAmount"></param>
        /// <param name="adminRemarks"></param>
        /// <param name="orderNo"></param>
        /// <returns>returns the no of rows updated</returns>
        public int InsertExpenseClaimApproval(ExpenseClaimApprvalData obj)
        {
            int rowsAffected = 0;
            BL_ExpenseClaim objClaim = new BL_ExpenseClaim();

            obj.updatedTime = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            rowsAffected = objClaim.InsertExpenseClaimApproval(obj);
            return rowsAffected;
        }

        //Multiple Approvel
        public int InsertExpenseClaimMultipleApproval(string Company_Code, string User_Name, string Region_Code, string claimCode, IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstDetails, string statusCode, double approvedAmount, string adminRemarks,
           string orderNo, string OtherDeduction, double actualAmount, string ExpType, string expensePrivilegevalue, string claimUserTypeName, string favoringUserCode
           , string payment_Mode, string payment_Remarks)
        {
            int rowsAffected = 0;
            BL_ExpenseClaim objClaim = new BL_ExpenseClaim();

            rowsAffected = objClaim.InsertExpenseClaimApproval(Company_Code, User_Name, claimCode,
                System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), lstDetails.ToList(), statusCode, approvedAmount, adminRemarks, orderNo, OtherDeduction, ExpType, expensePrivilegevalue, claimUserTypeName,
                Region_Code, actualAmount, favoringUserCode, payment_Mode, payment_Remarks);
            return rowsAffected;
        }
        public string GetDCRSFCData(string userCode, string dcrDate, string dcrFlag, string Company_Code)
        {
            StringBuilder strContent = new StringBuilder();
            BL_ExpenseClaim objClaim = new BL_ExpenseClaim();

            DataSet ds = new DataSet();

            dcrDate = dcrDate.Split('-')[2] + "-" + dcrDate.Split('-')[1] + "-" + dcrDate.Split('-')[0];

            ds = objClaim.GetDCRSFCDetails(Company_Code, userCode, dcrDate, dcrFlag);
            strContent.Append("<table class='table table-striped'><thead><tr><th>Category</th><th>From Place</th><th>To Place</th><th>Distance</th><th>Travel Mode</th>");
            strContent.Append("</tr></thead><tbody>");
            if (ds.Tables.Count > 1)
            {

                if (ds.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[1].Rows)
                    {
                        strContent.Append("<tr>");
                        strContent.Append("<td>" + Convert.ToString(dr["Category"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["From_Place"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["To_Place"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["Distance"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["Travel_Mode"]) + "</td></tr>");

                    }
                }
                else
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        strContent.Append("<tr>");
                        strContent.Append("<td>" + Convert.ToString(dr["Category"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["From_Place"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["To_Place"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["Distance"]) + "</td>");
                        strContent.Append("<td>" + Convert.ToString(dr["Travel_Mode"]) + "</td></tr>");
                    }
                }

            }

            return strContent.ToString();
        }

        public string GetExpenseClaimApprovalPopup(string userCode, string claimCode, int month, int year, string Company_Code)
        {
            BL_ExpenseClaim _objBLClaim = new BL_ExpenseClaim();

            string companyCode = Company_Code;
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


            lstExpenseclaimapproval = _objBLClaim.GetExpenseClaimApproval(Company_Code, claimCode, userCode, month, year).ToList();
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
                strTbl.Append("<td>Region Name</td><td>From Place</td><td>To Place</td><td>Category</td><td>Distance</td><td>SFC Version No</td><td>SFC Visit Count</td>");
                strTbl.Append("<td>Actual Visit Count</td><td>Trend</td>");
                strTbl.Append("</tr></thead>");
                strTbl.Append("<tbody>");
                if (lstExpenseSFC != null && lstExpenseSFC.Count > 0)
                {
                    foreach (var sfc in lstExpenseSFC)
                    {
                        exceed = "";
                        strTbl.Append("<tr>");
                        strTbl.Append("<td>");
                        strTbl.Append(sfc.Region_Name);
                        strTbl.Append("</td>");
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
        #region PopUpDetails
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
        //get particular Month Dates
        public List<DateTime> GetMonthDates(int year, int month)
        {
            return Enumerable.Range(1, DateTime.DaysInMonth(year, month))  // Days: 1, 2 ... 31 etc.
                             .Select(day => new DateTime(year, month, day)) // Map each day to a date
                             .ToList(); // Load dates into a list
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
        #endregion
        public string GetDoctorVisitDetails(string doctorCode, string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            BL_Customer _objblcustomer = new BL_Customer();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();

            List<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel> lstDoctorvisitdetails;
            List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> lstUserTypes;
            List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> lstActiveuserTypes;
            List<MVCModels.HiDoctor_Master.DoctorQuickViewUserTypeModel> lstinactiveuserTypes;
            lstUserTypes = _objblcustomer.GetUserTypes(objCurInfo.GetCompanyCode()).ToList();
            var lstMonthnames = new List<KeyValuePair<string, int>>();
            //string doctorCounts = string.Empty;
            string dcrVisitedDate = string.Empty;

            for (int s = 6; s >= 1; s--)
            {
                lstMonthnames.Add(new KeyValuePair<string, int>(DateTime.Now.AddMonths(-s).ToString("MMM yyyy"), DateTime.Now.AddMonths(-s).Month));
            }

            try
            {
                lstDoctorvisitdetails = _objblcustomer.GetDoctorVisitDeatils(objCurInfo.GetCompanyCode(), regionCode, doctorCode).ToList();

                strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctorProductMappingdetails' class='table table-striped' style='border:1px solid #aaa;'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>Designation</th>");
                if (lstMonthnames != null && lstMonthnames.Count > 0)
                {
                    for (int s = 0; s < lstMonthnames.Count; s++)
                    {
                        strTbl.Append("<th>");
                        strTbl.Append(lstMonthnames[s].Key);
                        strTbl.Append("</th>");
                    }

                }
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");

                strTbl.Append("<tbody>");
                if (lstUserTypes != null && lstUserTypes.Count > 0)
                {
                    lstActiveuserTypes = lstUserTypes.Where(x => x.User_Type_Status == "1").ToList();
                    //Bind Active User Types
                    if (lstActiveuserTypes != null && lstActiveuserTypes.Count > 0)
                    {
                        foreach (var userType in lstActiveuserTypes)
                        {
                            strTbl.Append("<tr>");
                            //Desigation
                            strTbl.Append("<td>");
                            strTbl.Append(userType.User_Type_Name);
                            strTbl.Append("</td>");
                            //Doctor count based on Month
                            if (lstMonthnames != null && lstMonthnames.Count > 0)
                            {
                                for (int s = 0; s < lstMonthnames.Count; s++)
                                {
                                    List<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel> lstDoctorVisit = lstDoctorvisitdetails.Where(x => x.User_Type_Code == userType.User_Type_Code && x.Visit_month == lstMonthnames[s].Value).ToList();
                                    if (lstDoctorVisit != null && lstDoctorVisit.Count > 0)
                                    {
                                        dcrVisitedDate = "";
                                        foreach (var doctorCount in lstDoctorVisit)
                                        {
                                            dcrVisitedDate += doctorCount.Visit_Day + ",";
                                        }
                                        strTbl.Append("<td>");
                                        strTbl.Append(dcrVisitedDate.TrimEnd(',').ToString());
                                        strTbl.Append("</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td>-</td>");
                                    }
                                }
                            }
                            strTbl.Append("</tr>");
                        }
                    }
                    //Bind In Active User Types status results
                    lstinactiveuserTypes = lstUserTypes.Where(x => lstDoctorvisitdetails.Any(y => y.User_Type_Code == x.User_Type_Code) && x.User_Type_Status == "0").ToList();
                    if (lstinactiveuserTypes != null && lstinactiveuserTypes.Count > 0)
                    {
                        foreach (var userType in lstinactiveuserTypes)
                        {
                            strTbl.Append("<tr>");
                            //Desigation
                            strTbl.Append("<td>");
                            strTbl.Append(userType.User_Type_Name);
                            strTbl.Append("</td>");
                            //Doctor count based on Month
                            if (lstMonthnames != null && lstMonthnames.Count > 0)
                            {
                                for (int s = 0; s < lstMonthnames.Count; s++)
                                {
                                    List<MVCModels.HiDoctor_Master.DoctorQuickViewDoctorVisitModel> lstDoctorVisit = lstDoctorvisitdetails.Where(x => x.User_Type_Code == userType.User_Type_Code && x.Visit_month == lstMonthnames[s].Value).ToList();
                                    if (lstDoctorVisit != null && lstDoctorVisit.Count > 0)
                                    {
                                        dcrVisitedDate = "";
                                        foreach (var doctorCount in lstDoctorVisit)
                                        {
                                            dcrVisitedDate += doctorCount.Visit_Day + ",";
                                        }
                                        strTbl.Append("<td>");
                                        strTbl.Append(dcrVisitedDate.TrimEnd(',').ToString());
                                        strTbl.Append("</td>");
                                    }
                                    else
                                    {
                                        strTbl.Append("<td>-</td>");
                                    }
                                }
                            }
                            strTbl.Append("</tr>");
                        }
                    }
                }
                else
                {
                    strTbl.Append("<tr><td colspan='7'>No Doctor Visit Details found.</td></tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("doctorCode", doctorCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public string GetExpenseClaimApprovedStockiest(string companyCode, string customerCode, string claimCode)
        {
            BL_ExpenseClaim objExpense = new BL_ExpenseClaim();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();

            List<MVCModels.CRMCustomerDetails> lststockiest = new List<MVCModels.CRMCustomerDetails>();
            List<MVCModels.CRMExpenseApproavedProducts> lstProducts = new List<MVCModels.CRMExpenseApproavedProducts>();
            List<MVCModels.CRMYeildPotential> lstYeild = new List<MVCModels.CRMYeildPotential>();

            StringBuilder strTbl = new StringBuilder();
            lststockiest = objExpense.GetExpenseClaimApprovedStockiest(objCurInfo.GetCompanyCode(), customerCode, claimCode);
            lstProducts = objExpense.GetExpenseClaimApprovedProducts(objCurInfo.GetCompanyCode(), claimCode);
            lstYeild = objExpense.GetExpenseClaimYeildPotential(objCurInfo.GetCompanyCode(), customerCode);

            var lstMonthnames = new List<KeyValuePair<string, int>>();
            for (int s = 6; s >= 1; s--)
            {
                lstMonthnames.Add(new KeyValuePair<string, int>(DateTime.Now.AddMonths(-s).ToString("MMM yyyy"), DateTime.Now.AddMonths(-s).Month));
            }

            strTbl.Append("<table cellspacing='0' cellpadding='0' id='tblDoctorProductMappingdetails' class='table table-striped' style='border:1px solid #aaa;'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr style='background-color:#428bca;'>");
            strTbl.Append("<th>Stockiest Name</th>");
            strTbl.Append("<th>Product Name </th>");
            if (lstMonthnames != null && lstMonthnames.Count > 0)
            {
                for (int s = 0; s < lstMonthnames.Count; s++)
                {
                    strTbl.Append("<th>");
                    strTbl.Append(lstMonthnames[s].Key);
                    strTbl.Append("</th>");
                }

            }
            strTbl.Append("<th>Yeild</th>");
            strTbl.Append("<th>Potential</th>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");

            strTbl.Append("<tbody>");
            var lstdistinctstock = lststockiest.GroupBy(i => i.Customer_Code).Select(group => group.First()).ToList();
            int rowspan = 0;
            string prestockiestname = "";
            for (int i = 0; i < lststockiest.Count; i++)
            {
                strTbl.Append("<tr>");
                if (prestockiestname != lststockiest[i].Customer_Name)
                {
                    strTbl.Append("<td>");
                    strTbl.Append(lststockiest[i].Customer_Name);
                    strTbl.Append("</td>");
                }
                else
                {
                    strTbl.Append("<td>");
                    strTbl.Append("</td>");
                }
                prestockiestname = lststockiest[i].Customer_Name;

                strTbl.Append("<td>");
                strTbl.Append(lststockiest[i].Product_Name);
                strTbl.Append("</td>");

                var lst = lstProducts.Where(p => (p.Product_Code == lststockiest[i].Product_Code && p.Customer_Code == lststockiest[i].Customer_Code)).ToList();

                //for (int j = 0; j < lstProducts.Count; j++)
                //{
                //if (lst[j].Customer_Code==lststockiest[i].Customer_Code && lstProducts[j].Product_Code == lststockiest[i].Product_Code)
                //{
                if (lst.Count > 0)
                {
                    foreach (var month in lstMonthnames)
                    {
                        if (month.Value == Convert.ToInt32(lst[0].Month))
                        {
                            strTbl.Append("<td>");
                            strTbl.Append(lst[0].Sales);
                            strTbl.Append("</td>");
                        }
                        else
                        {
                            strTbl.Append("<td>");
                            strTbl.Append("</td>");
                        }
                    }
                    //}
                }
                else
                {
                    foreach (var m in lstMonthnames)
                    {
                        strTbl.Append("<td>");
                        strTbl.Append("</td>");
                    }
                }
                //}

                if (lstYeild.Count > 0)
                {
                    for (int y = 0; y < lstYeild.Count; y++)
                    {
                        if (lststockiest[i].Product_Code == lstYeild[y].Product_Code)
                        {
                            strTbl.Append("<td>");
                            strTbl.Append(lstYeild[y].Potential_Quantity);
                            strTbl.Append("</td>");
                            strTbl.Append("<td>");
                            strTbl.Append(lstYeild[y].Support_Quantity);
                            strTbl.Append("</td>");
                        }
                        //else
                        //{
                        //    strTbl.Append("<td>");
                        //    strTbl.Append("</td>");
                        //    strTbl.Append("<td>");
                        //    strTbl.Append("</td>");
                        //}
                    }
                }
                else
                {
                    strTbl.Append("<td>");
                    strTbl.Append("</td>");
                    strTbl.Append("<td>");
                    strTbl.Append("</td>");
                }
                strTbl.Append("</tr>");
            }

            strTbl.Append("</table>");

            return strTbl.ToString();
        }


        //for (int i = 0; i < lstdistinctstock.Count; i++)
        //{
        //    List<MVCModels.CRMCustomerDetails> lst = lststockiest.Where(p => p.Customer_Code == lstdistinctstock[i]).ToList();

        //    for (int j = 0; j < lst.Count; j++)
        //    {
        //        foreach (var prod in lstProducts)
        //        {
        //            strTbl.Append("<tr>");
        //            strTbl.Append("<td rowspan=" + rowspan + ">");
        //            strTbl.Append(lst[j].Customer_Name);
        //            strTbl.Append("</td>");
        //            foreach (var product in lstProducts)
        //            {
        //                if (lst[j].Customer_Code == prod.Customer_Code)
        //                {
        //                    if (lst[j].Product_Code == prod.Product_Code)
        //                    {
        //                        strTbl.Append("<td>");
        //                        strTbl.Append(product.Product_Name);
        //                        strTbl.Append("</td>");
        //                    }
        //                    else
        //                    {
        //                        strTbl.Append("<td>");
        //                        strTbl.Append("-");
        //                        strTbl.Append("</td>");
        //                    }
        //                }

        //                foreach (var month in lstMonthnames)
        //                {
        //                    if (month.Key == product.Month)
        //                    {
        //                        strTbl.Append("<td>");
        //                        strTbl.Append(product.Sales);
        //                        strTbl.Append("</td>");
        //                    }
        //                    else
        //                    {
        //                        strTbl.Append("<td>");
        //                        strTbl.Append("-");
        //                        strTbl.Append("</td>");
        //                    }
        //                }
        //                strTbl.Append("<td>");
        //                strTbl.Append("-");
        //                strTbl.Append("</td>");
        //                strTbl.Append("<td>");
        //                strTbl.Append("-");
        //                strTbl.Append("</td>");

        //            }
        //            strTbl.Append("</tr>");
        //        }
        //    }
        //}
        public JsonResult GetTpDetails(string usercode, string dcrDate, string Company_Code)
        {
            var objExpense = new BL_ExpenseClaim();
            return Json(objExpense.GetGetTpDetails(usercode, Company_Code, dcrDate), JsonRequestBehavior.AllowGet);
        }
        #endregion expense claim approval

        public int ExpenseClaimMultipleApproval(List<string> claimCode, string paymentMode, string Company_Code, string User_Name, string Region_Code)
        {
            int result = 0;
            foreach (var item in claimCode)
            {
                List<MVCModels.ExpenseClaimModel> lstClaim = new List<MVCModels.ExpenseClaimModel>();
                IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
                string[] claimDetails = item.Split('_');


                string claimType = GetClaimRequestDetailsMutipleApprovel(Company_Code, claimDetails[0], claimDetails[7], out lstClaim, ref lstExpClaimDetails);
                foreach (MVCModels.ExpenseClaimModel Claim in lstClaim)
                {
                    double totalDeductionAmount = Claim.lstClaimHeader[0].Item_Wise_Deduction + Claim.lstClaimHeader[0].Other_Deduction;
                    double TotalApprovedAmount = Claim.lstClaimHeader[0].Actual_Amount - totalDeductionAmount;
                    try
                    {
                        //InsertExpenseClaimMultipleApproval(claimCode,      lstDetails        , statusCode      ,  approvedAmount,   adminRemarks,orderNo,    OtherDeduction,                                   actualAmount,                          ExpType,         expensePrivilegevalue,claimUserTypeName,favoringUserCode,payment_Mode,payment_Remarks)
                        InsertExpenseClaimMultipleApproval(Company_Code, User_Name, Region_Code, claimDetails[0], lstExpClaimDetails, claimDetails[11], TotalApprovedAmount, "", claimDetails[12], Claim.lstClaimHeader[0].Other_Deduction.ToString(), Claim.lstClaimHeader[0].Actual_Amount, claimType, "", claimDetails[8], claimDetails[3], paymentMode, "");
                        result++;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }

            }

            return result;
        }

        public JsonResult GetDCRDetails(string DCR_Code, string Company_Code)
        {
            var objExpense = new BL_ExpenseClaim();
            return Json(objExpense.GetDCRDetails(DCR_Code, Company_Code), JsonRequestBehavior.AllowGet);
        }

        public string GetDistanceTravelled(string Company_Code, string dcrDateSFC, string DCR_Code)
        {
            var objExpense = new BL_ExpenseClaim();
            var distance = "";
            distance = objExpense.GetDistanceTravelled(Company_Code, dcrDateSFC, DCR_Code);
            return distance;
        }

        #region Expense Activity Mapping
        public ActionResult ExpenseActivityMapping()
        {
            return View();
        }
        public JsonResult GetExpenseTypeDetails()
        {
            var objExpense = new BL_ExpenseClaim();
            return Json(objExpense.GetExpenseTypeDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetExpenseActivitytype()
        {
            var objExpense = new BL_ExpenseClaim();
            return Json(objExpense.GetExpenseActivitytype(), JsonRequestBehavior.AllowGet);
        }
        public string InsertExpenseActivityMapping(objExpense obj)
        {
            string result = "";
            var objExpense = new BL_ExpenseClaim();
            result = objExpense.InsertExpenseActivityMapping(obj.activity, obj.activitytype, obj.Expense, objCurrentInfo.GetUserCode(), objCurrentInfo.GetCompanyCode(), obj.startdate, obj.enddate, obj.UserTypeCode);
            return result;
        }
        public JsonResult Getallexpenseactivitymapping()
        {
            var objExpense = new BL_ExpenseClaim();
            return Json(objExpense.Getallexpenseactivitymapping(objCurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }
        public int ChangeStatus(int id)
        {
            int result = 0;
            var objExpense = new BL_ExpenseClaim();
            result = objExpense.ChangeStatus(id, objCurrentInfo.GetUserCode());
            return result;
        }
        #endregion
    }
}
