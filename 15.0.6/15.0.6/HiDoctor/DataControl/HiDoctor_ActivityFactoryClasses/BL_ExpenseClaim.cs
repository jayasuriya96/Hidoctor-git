using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using MVCModels;

namespace DataControl
{
    public class BL_ExpenseClaim
    {
        private DAL_ExpenseClaim _objExp = new DAL_ExpenseClaim();
        const string DBDateFormat = "yyyy-MM-dd";
        const string DCR_APPROVED = "2";
        const string DCR_APPLIED = "1";
        const string DCR_UNAPPROVED = "0";
        const string DCR_DRAFT = "3";

        public IEnumerable<MVCModels.RequestModel> GetRequestsMappedForUserType(string companyCode, string userTypeCode)
        {
            return _objExp.GetRequestsMappedForUserType(companyCode, userTypeCode);
        }
        public string ExpenseClaimFormLoadValuesSel(string favUserCode)
        {
            return _objExp.ExpenseClaimFormLoadValuesSel(favUserCode);
        }

        public List<MVCModels.ExpenseClaimModel> GetExpenseClaimDetails(string companyCode, string claimCode)
        {
            return _objExp.GetExpenseClaimDetails(companyCode, claimCode);
        }

        public IEnumerable<MVCModels.ExpenseClaimDetailsModel> GetFieldExpenseClaimDetails(string companyCode, string claimCode)
        {
            return _objExp.GetFieldExpenseClaimDetails(companyCode, claimCode);
        }

        public IEnumerable<MVCModels.ExpenseClaimDetailsModel> GetDoctorCRMClaimDetails(string companyCode, string claimCode)
        {
            return _objExp.GetDoctorCRMClaimDetails(companyCode, claimCode);
        }

        public string GetFieldExpenseEntryTableString(string companyCode, string userCode, string dcrFrom, string dcrTo)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                IEnumerable<MVCModels.DCRUserExpenseDetails> lstDCR;
                lstDCR = _objExp.GetDCRExpenseDetails(companyCode, userCode, dcrFrom, dcrTo);
                sbTbl.Append("<div class='col-lg-12' style='font-weight: bold;padding-left: 0px;'>Showing Expense details of <span id='spnfavouringUser'></span></div>");
                if (lstDCR != null && lstDCR.Count() > 0)
                {
                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblExpenseEntry' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>DCR Date</th>");
                    sbTbl.Append("<th>Flag</th>");
                    sbTbl.Append("<th>Category</th>");
                    sbTbl.Append("<th>Expense Type</th>");
                    sbTbl.Append("<th>Expense Amount</th>");
                    sbTbl.Append("<th><input type='checkbox' name='selAllExpense' onclick='fnSelectAllExpense();'/>Select</th>");
                    sbTbl.Append("<th>DCR Remarks</th>");
                    sbTbl.Append("<th>Reference Details</th>");
                    sbTbl.Append("<th>Remarks</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");
                    int i = 1;
                    foreach (var dcr in lstDCR)
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + dcr.DCR_Date + "</td>");
                        sbTbl.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                        sbTbl.Append("<td>" + dcr.Category + "</td>");
                        sbTbl.Append("<td id='tdExpTypeName_" + i.ToString() + "'>" + dcr.Expense_Type_Name + "</td>");
                        sbTbl.Append("<td id='tdExpAmount_" + i.ToString() + "' >" + dcr.Expense_Amount + "</td>");

                        if (dcr.Expense_Claim_Code == "")
                        {
                            string dcrDate = dcr.DCR_Date.Split('/')[2] + "-" + dcr.DCR_Date.Split('/')[1] + "-" + dcr.DCR_Date.Split('/')[0];
                            sbTbl.Append("<td><input type='checkbox' name='checkedExpense' onclick='fnClearSelectAll();' value='"
                                + dcr.DCR_Expense_Code + "_" + dcrDate + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code + "_" + dcr.Expense_Amount + "' id='chkExp_"
                                + i.ToString() + "'  Exp_Code='" + dcr.Expense_Type_Name + "'/></td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                        string remarks = dcr.DCR_Expense_Remarks == null ? "" : dcr.DCR_Expense_Remarks;

                        sbTbl.Append("<td><span>" + remarks + "</span></td>");
                        sbTbl.Append("<td><input type='text' id='txtBillNumber_" + i.ToString() + "' class='input-large form-control' /></td>");
                        sbTbl.Append("<td><textarea id='txtUserRemarks_" + i.ToString() + "' class='form-control'></textarea></td>");
                        sbTbl.Append("</tr>");
                        i++;
                    }

                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div><div style='clear: both;'></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Expense Details are available for this Date period.</div><div style='clear: both;'></div>");
                }

                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string GetExpenseClaimSummaryTableString(string companyCode, string userCode, string userName, string userTypeName)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                StringBuilder strDetail = new StringBuilder();
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaim;
                List<MVCModels.ExpenseClaimHeaderModel> lstClaimHeader;
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaimDetails;
                List<MVCModels.CRMCycleMapping> lstCycleMapping;
                lstClaim = _objExp.GetDCRExpenseClaimSummary(companyCode, userCode);
                string[] DateFrom = { };
                string[] DateTo = { };

                //    var lstDistReq = lstClaimHeader.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();
                if (lstClaim != null && lstClaim.Count() > 0)
                {
                    lstClaimHeader = lstClaim.Where(s => s.Detail_Claim_Code > 0).ToList();
                    lstClaimDetails = lstClaim.Where(S => S.Detail_Claim_Code == 0).ToList();
                    var lstDistReq = lstClaimHeader.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();

                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblExpenseClaimSummary' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>Edit</th>");
                    sbTbl.Append("<th>Details</th>");
                    sbTbl.Append("<th>Request Date</th>");
                    sbTbl.Append("<th>Request Id</th>");
                    sbTbl.Append("<th>Request Name</th>");
                    sbTbl.Append("<th>Status Name</th>");
                    sbTbl.Append("<th>Cycle Name</th>");
                    sbTbl.Append("<th>Date From</th>");
                    sbTbl.Append("<th>Date To</th>");
                    sbTbl.Append("<th>Favouring User</th>");
                    sbTbl.Append("<th>Actual Amount</th>");
                    sbTbl.Append("<th>Approved Amount</th>");
                    sbTbl.Append("<th>User Remarks</th>");
                    //sbTbl.Append("<th>Print</th>"); // Print Header
                    //sbTbl.Append("<th>Admin Remarks</th>");
                    sbTbl.Append("<th>Download Attachments</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody id='ExpBody'>");

                    foreach (var req in lstDistReq)
                    {
                        var lstDist = lstClaimHeader.AsEnumerable().Where(x => x.Request_Code == req.Request_Code).ToList();
                        if (lstDist != null && lstDist.Count() > 0)
                        {


                            sbTbl.Append("<tr><th class='collapseHeader' colspan='12' onclick='fnExpenseClaimSummaryHide(\"dv_" + req.Request_Code + "\",\"spn_" + req.Request_Code + "\")'>");
                            sbTbl.Append("<span class='expandDFC' id='spn_" + req.Request_Code + "' style='padding: 15px;'>" + req.Request_Name + "<span style='font-size: 11px; font-style: italic'>(Click to Expand/Collapse!)</span></span>");
                            sbTbl.Append("</th></tr>");
                            int rowno = 0;

                            //foreach (var item in lstDist)
                            for (int i = 0; i < lstDist.Count(); i++)
                            {

                                lstCycleMapping = _objExp.GetCRMCycleMapping(companyCode, lstDist[i].User_Code).ToList();

                                //        //var lstProduct = lstStock.Select(p => p.Base_Code).Distinct().ToList();
                                //var disCycleMapping = lstCycleMapping.Select(p => p.User_Code).Distinct().ToList();
                                bool isEdit = false;
                                string statusCycleMapping = "NO";

                                if (lstDist[i].Move_Order != "")
                                {
                                    lstDist[i].Move_Order = lstDist[i].Move_Order.TrimEnd(',');
                                    foreach (string moveOrder in lstDist[i].Move_Order.Split(','))
                                    {
                                        if (moveOrder == "1") // if move order applied status
                                        {
                                            statusCycleMapping = CheckStatusCycleMapping(companyCode, lstDist[i].Cylce_Code, 1, lstDist[i].Favouring_User_Code);
                                            if (statusCycleMapping != "NO")
                                            {
                                                if (lstDist[i].User_Code == userCode)
                                                {
                                                    isEdit = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                sbTbl.Append("<tr class='dv_" + req.Request_Code + "'>");
                                if (isEdit)
                                {

                                    if (lstDist[i].Request_Name.ToString().ToUpper() == "CRM REQUEST")
                                    {
                                        sbTbl.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + "" + "\",\"" + "" + "\",\"" + "" + "\");'>Edit</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + lstDist[i].Expense_Claim_Screen_Mode + "\",\"" + lstDist[i].Status_Code + "\",\"" + lstDist[i].Favouring_User_Code + "\");'>Edit</td>");
                                    }
                                    // sbTbl.Append("<td class='td-a'></td>");

                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                }

                                sbTbl.Append("<td class='td-a' onclick='fnExpenseClaimDetailPopUp(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Code + "\",\"" + lstDist[i].User_Code + "\");'>Details</td>");

                                sbTbl.Append("<td>" + lstDist[i].Entered_DateTime + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Claim_Code + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Request_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Status_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Cycle_Name + "</td>");
                                if (lstDist[i].Request_Entity == "Region Wise")
                                {
                                    sbTbl.Append("<td>" + lstDist[i].Date_From + "</td>");
                                    sbTbl.Append("<td>" + lstDist[i].Date_To + "</td>");
                                    DateFrom = lstDist[i].Date_From.Split('/');
                                    DateTo = lstDist[i].Date_To.Split('/');
                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                    sbTbl.Append("<td></td>");
                                }
                                sbTbl.Append("<td class='FavUser'>" + lstDist[i].User_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Actual_Amount.ToString() + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Approved_Amount.ToString() + "</td>");
                                sbTbl.Append("<td class='expRem'  title='" + lstDist[i].Remarks_By_User + "'>" + lstDist[i].Remarks_By_User + "</td>");


                                //Print Option Removed on(06-03-2020)

                                //if (lstDist[i].Request_Entity == "Region Wise")
                                //{
                                //    if (lstCycleMapping.Count > 0)
                                //    {
                                //        List<MVCModels.CRMCycleMapping> lstcycle = new List<MVCModels.CRMCycleMapping>();
                                //        lstcycle = lstCycleMapping.AsEnumerable().Where(x => x.User_Code == lstDist[i].User_Code && x.Status_Code == lstDist[i].Status_Code).ToList();
                                //        if (lstcycle.Count > 0)
                                //        {

                                //            sbTbl.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpensePrint(\"" + lstDist[i].Favouring_User_Code + "\",\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Date_From + "\",\"" + lstDist[i].Date_To + "\",\"" + lstDist[i].Status_Name + "\");'>Print</a></div></td>");
                                //        }
                                //        else
                                //        {
                                //            sbTbl.Append("<td></td>");

                                //        }
                                //    }
                                //    else
                                //    {
                                //        sbTbl.Append("<td></td>");

                                //    }
                                //}
                                //else
                                //{
                                //    sbTbl.Append("<td></td>");

                                //}

                                // Download Image Path
                                if (lstDist[i].ImgPath != null && lstDist[i].ImgPath != "")
                                {
                                    sbTbl.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpenseDownloadImage(\"" + lstDist[i].ImgPath + "\");'>Download Attachment</div></td>");
                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                }

                                sbTbl.Append("</tr>");
                            }




                        }
                    }
                    if (lstClaimDetails != null && lstClaimDetails.Count() > 0)
                    {
                        var lstDistReqfordetails = lstClaimDetails.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();

                        foreach (var req in lstDistReqfordetails)
                        {
                            var lstDist = lstClaimDetails.AsEnumerable().Where(x => x.Request_Code == req.Request_Code);
                            if (lstDist != null && lstDist.Count() > 0)
                            {
                                strDetail.Append("<tr><th class='collapseHeader' colspan='14' onclick='fnExpenseClaimSummaryHide(\"dv_" + req.Request_Code + "\",\"spn_" + req.Request_Code + "\")'>");
                                strDetail.Append("<span class='expandDFC' id='spn_" + req.Request_Code + "' style='padding: 15px;font-weight:bold;'>" + req.Request_Name + " <span style='font-size: 11px; font-style: italic;font-weight:bold;'>Empty Coulms(Click to Expand/Collapse!)</span></span>");
                                strDetail.Append("</th></tr>");

                                if (lstDist.Count() > 0)
                                {
                                    foreach (var item in lstDist)
                                    {
                                        bool isEdit = false;
                                        string statusCycleMapping = "NO";

                                        if (item.Move_Order != "")
                                        {
                                            item.Move_Order = item.Move_Order.TrimEnd(',');
                                            foreach (string moveOrder in item.Move_Order.Split(','))
                                            {
                                                if (moveOrder == "1") // if move order applied status
                                                {
                                                    statusCycleMapping = CheckStatusCycleMapping(companyCode, item.Cylce_Code, 1, userTypeName);
                                                    if (statusCycleMapping != "NO")
                                                    {
                                                        if (item.User_Code == userCode)
                                                        {
                                                            isEdit = true;
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        strDetail.Append("<tr class='dv_" + req.Request_Code + "' id='trtest' value='ESS'>");
                                        if (isEdit)
                                        {
                                            //onclick="fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + lstDist[i].Expense_Claim_Screen_Mode + "\",\"" + lstDist[i].Request_Entity + "\",\"" + lstDist[i].Status_Code + "\")'>Edit</td>"
                                            strDetail.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + item.Claim_Code + "\",\"" + item.Request_Name + "\",\"" + item.Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + item.Expense_Claim_Screen_Mode + "\",\"" + item.Status_Code + "\",\"" + item.Favouring_User_Code + "\",);'>Edit</td>");
                                            strDetail.Append("<td class='td-a' onclick='fnDeleteClaim(\"" + item.Claim_Code + "\",\"" + item.Request_Code + "\",\"" + item.User_Code + "\");'>Delete</td>");
                                        }
                                        else
                                        {
                                            strDetail.Append("<td></td><td></td>");
                                        }


                                        strDetail.Append("<td>" + item.Entered_DateTime + "</td>"); //Request Date
                                        strDetail.Append("<td>" + item.Claim_Code + "</td>");//Request id
                                        strDetail.Append("<td>" + item.Request_Name + "</td>");// Request Name
                                        strDetail.Append("<td>" + item.Status_Name + "</td>");//status Name
                                        strDetail.Append("<td>" + item.Cycle_Name + "</td>");//cycle name
                                        if (item.Request_Entity == "Region Wise")
                                        {
                                            strDetail.Append("<td>" + item.Date_From + "</td>");
                                            strDetail.Append("<td>" + item.Date_To + "</td>");
                                            DateFrom = item.Date_From.Split('/');
                                            DateTo = item.Date_To.Split('/');
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td></td>");
                                            sbTbl.Append("<td></td>");
                                        }
                                        strDetail.Append("<td>" + item.User_Name + "</td>");//Favouring user
                                        strDetail.Append("<td>" + item.Actual_Amount.ToString() + "</td>");//Actual amount
                                        strDetail.Append("<td>" + item.Approved_Amount.ToString() + "</td>");//approved amount
                                        strDetail.Append("<td class='expRem'  title='" + item.Remarks_By_User + "'>" + item.Remarks_By_User + "</td>");//user remarks



                                        strDetail.Append("</tr>");

                                    }
                                }

                            }
                        }
                    }
                    if (strDetail.Length > 0)
                    {
                        sbTbl.Append(strDetail);
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>Dear " + userName + ", You do not have any Expense Claim details.</div><div style='clear: both;'></div>");
                }
                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataSet GetExpenseClaimForPrint(string companyCode, string userCode, string dateFrom, string toDate, string claimCode)
        {
            return _objExp.GetExpenseClaimForPrint(companyCode, userCode, dateFrom, toDate, claimCode);
        }

        public DataSet GetExpenseClaimCustomerCount(string companyCode, string userCode, string fromDate, string toDate, string option)
        {
            return _objExp.GetExpenseClaimCustomerCount(companyCode, userCode, fromDate, toDate, option);
        }

        public StringBuilder GetExpenseClaimSummaryExcel(string companyCode, string userCode, string userName, string userTypeName)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaim;
                lstClaim = _objExp.GetDCRExpenseClaimSummary(companyCode, userCode);

                var lstDistReq = lstClaim.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();
                if (lstClaim != null && lstClaim.Count() > 0)
                {
                    sbTbl.Append("<div style='font-size:14px;width:100%;font-weight:bold;float:left' align='left'>Expense Claim Summary For " + userName + "</div>");
                    sbTbl.Append("<table class='table table-striped' id='tblExpenseClaimSummary' cellspacing='0' cellpadding='0' border='1'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>Request Date</th>");
                    sbTbl.Append("<th>Request Id</th>");
                    sbTbl.Append("<th>Request Name</th>");
                    sbTbl.Append("<th>Status Name</th>");
                    sbTbl.Append("<th>Cycle Name</th>");
                    sbTbl.Append("<th>Favouring User</th>");
                    sbTbl.Append("<th>Actual Amount</th>");
                    sbTbl.Append("<th>Approved Amount</th>");
                    sbTbl.Append("<th>User Remarks</th>");
                    sbTbl.Append("<th>Admin Remarks</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");


                    foreach (var req in lstDistReq)
                    {
                        var lstDist = lstClaim.AsEnumerable().Where(x => x.Request_Code == req.Request_Code);
                        if (lstDist != null && lstDist.Count() > 0)
                        {
                            sbTbl.Append("<tr><th class='collapseHeader' colspan='10'>");
                            sbTbl.Append("<span class='expandDFC' style='padding: 15px;font-weight:bold;'>" + req.Request_Name + "</span>");
                            sbTbl.Append("</th></tr>");

                            foreach (var item in lstDist)
                            {
                                sbTbl.Append("<tr>");
                                sbTbl.Append("<td>" + item.Entered_DateTime + "</td>");
                                sbTbl.Append("<td>" + item.Claim_Code + "</td>");
                                sbTbl.Append("<td>" + item.Request_Name + "</td>");
                                sbTbl.Append("<td>" + item.Status_Name + "</td>");
                                sbTbl.Append("<td>" + item.Cycle_Name + "</td>");
                                sbTbl.Append("<td>" + item.User_Name + "</td>");
                                sbTbl.Append("<td>" + item.Actual_Amount.ToString() + "</td>");
                                sbTbl.Append("<td>" + item.Approved_Amount.ToString() + "</td>");
                                sbTbl.Append("<td>" + item.Remarks_By_User + "</td>");
                                sbTbl.Append("<td>" + item.Remarks_By_Admin + "</td>");
                                sbTbl.Append("</tr>");
                            }
                        }
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>Dear " + userName + ", You do not have any Expense Claim details.</div><div style='clear: both;'></div>");
                }
                return sbTbl;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string CheckStatusCycleMapping(string companyCode, string cycleCode, int orderNumber, string userCode) //userTypeName
        {
            string result = "NO";
            IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle;
            lstStatusCycle = _objExp.GetStatusCycleMappingByOrderNumber(companyCode, cycleCode, orderNumber);

            string userTypeName = _objExp.GetUserTypeName(userCode);

            if (lstStatusCycle != null && lstStatusCycle.Count() > 0)
            {
                foreach (string userType in lstStatusCycle.ElementAt(0).Status_Owner_Type.Split(','))
                {
                    if (userTypeName == userType)
                    {
                        result = lstStatusCycle.ElementAt(0).Status_Code;
                    }
                }
            }

            return result;
        }

        public string InsertCRMExpenseClaim(string companyCode, string detailString)
        {
            string result = string.Empty;
            int rowsAffected = 0;
            DataControl.CurrentInfo _objcurrentInfo = new CurrentInfo();
            List<MVCModels.CRMCustomerDetails> lstCustomerProductdetails = (List<MVCModels.CRMCustomerDetails>)JsonConvert.DeserializeObject(detailString, typeof(List<MVCModels.CRMCustomerDetails>));


            if (lstCustomerProductdetails != null && lstCustomerProductdetails.Count > 0)
            {
                lstCustomerProductdetails.ForEach
                    (
                    s => s.Company_Code = _objcurrentInfo.GetCompanyCode()
                    );
                lstCustomerProductdetails.ForEach
                    (
                    s => s.Updated_By = _objcurrentInfo.GetUserName()
                    );
                lstCustomerProductdetails.ForEach
                    (
                     s => s.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff")
                    );


                rowsAffected = _objExp.InsertCRMRequest(companyCode, lstCustomerProductdetails);
                if (rowsAffected > 0)
                {
                    result = "Inserted Successfully";
                }
            }
            return result;

        }

        public DataTable UserStringToDataTable(string companyCode, string detailString, Guid guid)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Company_Code", typeof(String));
            dt.Columns.Add("Customer_Code", typeof(String));
            dt.Columns.Add("Base_Code", typeof(String));
            dt.Columns.Add("Product_Code", typeof(String));
            dt.Columns.Add("Percentage", typeof(String));
            dt.Columns.Add("GUID", typeof(String));
            dt.Columns.Add("Row_No", typeof(Int32));
            dt.Columns.Add("Status", typeof(String));
            string[] rowArr;
            rowArr = detailString.Split('$');
            for (int i = 0; i < rowArr.Length - 1; i++)
            {
                string[] columnArr;
                columnArr = rowArr[i].Split('^');
                DataRow dr = dt.NewRow();
                dr[0] = companyCode;
                dr[1] = columnArr[0].Split('_')[0];
                dr[2] = columnArr[1];
                dr[3] = columnArr[2];
                dr[4] = columnArr[3];
                dr[5] = guid.ToString();
                dr[6] = Convert.ToInt32(i) + 1;
                dr[7] = "PROCESSING";
                dt.Rows.Add(dr);
            }
            return dt;
        }

        public int GetCRMRequest(string companyCode, string customerCode)
        {
            int result = 0;
            try
            {
                result = _objExp.GetCRMRequest(companyCode, customerCode);
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }

        public int InsertExpenseClaim(string companyCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string dateFrom, string dateTo, string enteredDate, string favouringUser,
                                      string remarks, string expenseType, string detailString, string createdBy, string createdDate, string screenMode, IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp)
        {
            try
            {
                int result = 0;
                SPData objData = new SPData();
                string claimCode = ""; //objData.GetSeqNumber("SEQ_tbl_SFA_Expense_Claim_Header").ToString();
                result = InsertExpenseClaimRequest(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                  statusCode, actualAmount, dateFrom, dateTo, enteredDate, favouringUser,
                                  remarks, expenseType, detailString, createdBy, createdDate, screenMode, lstAddlExp);
                //GetSaveUploadImage(claimCode, Img);

                //if (result != 0 && result != -1)
                //{
                //    result = Convert.ToInt32(claimCode);
                //}

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public int InsertCRMClaim(string companyCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                     string statusCode, double actualAmount, string dateFrom, string dateTo, string enteredDate, string favouringUser,
                                     string remarks, string expenseType, string detailString, string createdBy, string createdDate, string screenMode, string customerStockiestArray)
        {
            try
            {
                int result = 0;

                SPData objData = new SPData();
                string claimCode = objData.GetSeqNumber("SEQ_tbl_SFA_Expense_Claim_Header").ToString();
                result = InsertCRMClaimRequest(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                  statusCode, actualAmount, dateFrom, dateTo, enteredDate, favouringUser,
                                  remarks, expenseType, detailString, createdBy, createdDate, screenMode, customerStockiestArray);

                if (result != 0)
                {
                    result = Convert.ToInt32(claimCode);
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private int InsertCRMClaimRequest(string companyCode, string claimCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string dateFrom, string dateTo, string enteredDate, string favouringUser,
                                      string remarks, string expenseType, string detailString, string createdBy, string createdDate, string screenMode, string customerStockiestArray)
        {
            try
            {
                int result = 0;
                List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail = new List<MVCModels.ExpenseClaimDetailsModel>();


                #region assign doctor crm claim detail list
                if (detailString != "")
                {
                    string[] arDoc = detailString.Split('$');
                    if (arDoc.Length > 1)
                    {
                        foreach (var doc in arDoc)
                        {
                            if (doc != "")
                            {
                                MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                                // doctor code^doctor region code^expense amount^present contribution^potential contribution^bill number^remarks by user  

                                objFieldExp.Company_Code = companyCode;
                                objFieldExp.Claim_Code = claimCode;
                                objFieldExp.Customer_Code = doc.Split('^')[0];
                                objFieldExp.Doctor_Region_Code = doc.Split('^')[1];
                                objFieldExp.Expense_Amount = Convert.ToDouble(doc.Split('^')[2]);
                                if (doc.Split('^')[3] != "")
                                {
                                    objFieldExp.Present_Contribution = Convert.ToDouble(doc.Split('^')[3]);
                                }
                                if (doc.Split('^')[4] != "")
                                {
                                    objFieldExp.Potential_Contribution = Convert.ToDouble(doc.Split('^')[4]);
                                }
                                objFieldExp.Bill_Number = doc.Split('^')[5];
                                objFieldExp.Remarks_By_User = doc.Split('^')[6];
                                objFieldExp.Version_Number = 1;

                                lstClaimDetail.Add(objFieldExp);
                            }
                        }
                    }
                }


                string CRMresult = string.Empty;
                int rowsAffected = 0;
                DataControl.CurrentInfo _objcurrentInfo = new CurrentInfo();

                if (customerStockiestArray != "")
                {
                    List<MVCModels.CRMCustomerDetails> lstCustomerProductdetails = (List<MVCModels.CRMCustomerDetails>)JsonConvert.DeserializeObject(customerStockiestArray, typeof(List<MVCModels.CRMCustomerDetails>));

                    for (int i = 0; i < lstCustomerProductdetails.Count; i++)
                    {
                        lstCustomerProductdetails[i].Claim_Code = claimCode;
                    }


                    if (lstCustomerProductdetails != null && lstCustomerProductdetails.Count > 0)
                    {
                        lstCustomerProductdetails.ForEach
                            (
                            s => s.Company_Code = _objcurrentInfo.GetCompanyCode()
                            );
                        lstCustomerProductdetails.ForEach
                            (
                            s => s.Updated_By = _objcurrentInfo.GetUserName()
                            );
                        lstCustomerProductdetails.ForEach
                            (
                             s => s.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff")
                            );


                        rowsAffected = _objExp.InsertCRMRequest(companyCode, lstCustomerProductdetails);
                        if (rowsAffected > 0)
                        {
                            CRMresult = "Inserted Successfully";
                        }
                    }
                }

                #endregion assign doctor crm claim detail list

                result = _objExp.InsertDoctorCRMClaim(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                  statusCode, actualAmount, enteredDate, favouringUser,
                                  remarks, lstClaimDetail, createdBy, createdDate);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private int InsertExpenseClaimRequest(string companyCode, string claimCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                  string statusCode, double actualAmount, string dateFrom, string dateTo, string enteredDate, string favouringUser,
                                  string remarks, string expenseType, string detailString, string createdBy, string createdDate, string screenMode, IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp)
        {
            try
            {
                int result = 0;
                List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail = new List<MVCModels.ExpenseClaimDetailsModel>();
                List<MVCModels.ExpenseClaimDetailNewModel> lstExpDetails = new List<ExpenseClaimDetailNewModel>();

                if (expenseType == "FIELD") // Field Expense Claim
                {
                    #region assign field expense claim detail list
                    if (detailString != "")
                    {
                        string[] arExp = detailString.Split('$');
                        if (arExp.Length > 1)
                        {
                            foreach (var fieldExp in arExp)
                            {
                                if (fieldExp != "")
                                {
                                    //MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                                    //dcr expense code^dcrDate^dcr flag^expense type code^expense Amount^bill number^user remarks 
                                    MVCModels.ExpenseClaimDetailNewModel objFieldExp = new ExpenseClaimDetailNewModel();
                                    objFieldExp.Company_Code = companyCode;
                                    objFieldExp.Claim_Code = claimCode;
                                    objFieldExp.DCR_Expense_Code = fieldExp.Split('^')[0];
                                    objFieldExp.DCR_Actual_Date = fieldExp.Split('^')[1];
                                    objFieldExp.DCR_Activity_Flag = Convert.ToChar(fieldExp.Split('^')[2]);
                                    objFieldExp.Expense_Type_Code = fieldExp.Split('^')[3];
                                    objFieldExp.Expense_Amount = Convert.ToDouble(fieldExp.Split('^')[4]);
                                    objFieldExp.Bill_Number = fieldExp.Split('^')[5];
                                    objFieldExp.Remarks_By_User = fieldExp.Split('^')[6];
                                    objFieldExp.Record_Status = "1";
                                    objFieldExp.Version_Number = 1;
                                    objFieldExp.Expense_Mode = "Automatic";
                                    lstExpDetails.Add(objFieldExp);
                                }
                            }
                        }
                    }
                    //if (lstAddlExp != null && lstAddlExp.Count() > 0)
                    //{
                    //    List<MVCModels.AddlExpModel> lstAddExp = lstAddlExp.ToList();

                    //    for (int i = 0; i < lstAddExp.Count(); i++)
                    //    {
                    //        MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                    //        //dcr expense code^dcrDate^dcr flag^expense type code^expense Amount^bill number^user remarks 

                    //        objFieldExp.Company_Code = companyCode;
                    //        objFieldExp.Claim_Code = claimCode;
                    //        objFieldExp.DCR_Expense_Code = lstAddExp[i].DCR_Expense_Code;
                    //        string DateConvert = lstAddExp[i].DCR_Date.Split('/')[2] + '-' + lstAddExp[i].DCR_Date.Split('/')[1] + '-' + lstAddExp[i].DCR_Date.Split('/')[0];
                    //        objFieldExp.DCR_Actual_Date = DateConvert;
                    //        objFieldExp.DCR_Activity_Flag = Convert.ToChar(lstAddExp[i].DCR_Flag);
                    //        objFieldExp.Expense_Type_Code = lstAddExp[i].Expense_Type_Code;
                    //        objFieldExp.Expense_Amount = Convert.ToDouble(lstAddExp[i].Expense_Amount);
                    //        objFieldExp.Bill_Number = "";
                    //        objFieldExp.Remarks_By_User = lstAddExp[i].Addl_Reference_Details;
                    //        objFieldExp.Record_Status = "1";
                    //        objFieldExp.Version_Number = 1;
                    //        objFieldExp.Expense_Mode = "Manual";
                    //        ////item.DCR_Actual_Date = DateConvert;
                    //        //string dateConvertAddl = lstAddExp[i].DCR_Date.Split('/')[1] + '/' + lstAddExp[i].DCR_Date.Split('/')[0] + '/' + lstAddExp[i].DCR_Date.Split('/')[2];
                    //        //lstAddExp[i].DCR_Date = dateConvertAddl;
                    //        lstClaimDetail.Add(objFieldExp);
                    //    }
                    //}

                    #endregion assign field expense claim detail list

                    result = _objExp.InsertFieldExpenseClaim(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                      statusCode, actualAmount, dateFrom, dateTo, enteredDate, favouringUser,
                                      remarks, lstExpDetails, createdBy, createdDate, screenMode, lstAddlExp);
                }
                else if (expenseType == "CRM") // doctor CRM
                {
                    #region assign doctor crm claim detail list
                    if (detailString != "")
                    {
                        string[] arDoc = detailString.Split('$');
                        if (arDoc.Length > 1)
                        {
                            foreach (var doc in arDoc)
                            {
                                if (doc != "")
                                {
                                    MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                                    // doctor code^doctor region code^expense amount^present contribution^potential contribution^bill number^remarks by user  

                                    objFieldExp.Company_Code = companyCode;
                                    objFieldExp.Claim_Code = claimCode;
                                    objFieldExp.Customer_Code = doc.Split('^')[0];
                                    objFieldExp.Doctor_Region_Code = doc.Split('^')[1];
                                    objFieldExp.Expense_Amount = Convert.ToDouble(doc.Split('^')[2]);
                                    if (doc.Split('^')[3] != "")
                                    {
                                        objFieldExp.Present_Contribution = Convert.ToDouble(doc.Split('^')[3]);
                                    }
                                    if (doc.Split('^')[4] != "")
                                    {
                                        objFieldExp.Potential_Contribution = Convert.ToDouble(doc.Split('^')[4]);
                                    }
                                    objFieldExp.Bill_Number = doc.Split('^')[5];
                                    objFieldExp.Remarks_By_User = doc.Split('^')[6];
                                    objFieldExp.Version_Number = 1;

                                    lstClaimDetail.Add(objFieldExp);
                                }
                            }
                        }
                    }
                    #endregion assign doctor crm claim detail list

                    result = _objExp.InsertDoctorCRMClaim(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                      statusCode, actualAmount, enteredDate, favouringUser,
                                      remarks, lstClaimDetail, createdBy, createdDate);

                }
                else // other expense claim request
                {
                    result = _objExp.InsertOtherClaim(companyCode, claimCode, userCode, regionCode, cycleCode, requestCode,
                                     statusCode, 0.00, enteredDate, favouringUser,
                                     remarks, createdBy, createdDate);
                }
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public int UpdateExpenseClaimRequest(string companyCode, string claimCode, string userCode, string regionCode, string statusCode, double actualAmount
                                            , double approvedAmount, double otherDeductions, string enteredDate, string remarks, string expenseType
                                            , string detailString, string updatedBy, string updatedDate, string modeType, IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp)
        {
            try
            {
                int result = 0;
                //List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail = new List<MVCModels.ExpenseClaimDetailsModel>();
                List<MVCModels.ExpenseClaimDetailNewModel> lstClaimDetail = new List<MVCModels.ExpenseClaimDetailNewModel>();
                //get version number from hedaer
                int versionNumber = _objExp.GetExpenseClaimMaxVersionNumber(companyCode, claimCode);
                versionNumber = versionNumber + 1;

                if (expenseType == "FIELD") // Field Expense Claim
                {
                    #region assign field expense claim detail list
                    if (detailString != "")
                    {
                        string[] arExp = detailString.Split('$');
                        if (arExp.Length > 1)
                        {
                            foreach (var fieldExp in arExp)
                            {
                                if (fieldExp != "")
                                {
                                    //MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                                    //dcr expense code^dcrDate^dcr flag^expense type code^expense Amount^bill number^user remarks^approvedAmopunt
                                    MVCModels.ExpenseClaimDetailNewModel objFieldExp = new ExpenseClaimDetailNewModel();
                                    objFieldExp.Company_Code = companyCode;
                                    objFieldExp.Claim_Code = claimCode;
                                    objFieldExp.DCR_Expense_Code = fieldExp.Split('^')[0];
                                    objFieldExp.DCR_Actual_Date = fieldExp.Split('^')[1];
                                    objFieldExp.DCR_Activity_Flag = Convert.ToChar(fieldExp.Split('^')[2]);
                                    objFieldExp.Expense_Type_Code = fieldExp.Split('^')[3];
                                    objFieldExp.Expense_Amount = Convert.ToDouble(fieldExp.Split('^')[4]);
                                    objFieldExp.Bill_Number = fieldExp.Split('^')[5];
                                    objFieldExp.Remarks_By_User = fieldExp.Split('^')[6];
                                    objFieldExp.Approved_Amount = Convert.ToDouble(fieldExp.Split('^')[7]);
                                    objFieldExp.Record_Status = "1";
                                    objFieldExp.Expense_Mode = "Automatic";
                                    objFieldExp.Version_Number = versionNumber;

                                    lstClaimDetail.Add(objFieldExp);
                                }
                            }
                        }
                    }
                    #endregion assign field expense claim detail list
                }
                else if (expenseType == "CRM") // doctor CRM
                {
                    #region assign doctor crm claim detail list
                    if (detailString != "")
                    {
                        string[] arDoc = detailString.Split('$');
                        if (arDoc.Length > 1)
                        {
                            foreach (var doc in arDoc)
                            {
                                if (doc != "")
                                {
                                    //MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                                    // doctor code^doctor region code^expense amount^present contribution^potential contribution^bill number^remarks by user  
                                    MVCModels.ExpenseClaimDetailNewModel objFieldExp = new ExpenseClaimDetailNewModel();
                                    objFieldExp.Company_Code = companyCode;
                                    objFieldExp.Claim_Code = claimCode;
                                    objFieldExp.Customer_Code = doc.Split('^')[0];
                                    objFieldExp.Doctor_Region_Code = doc.Split('^')[1];
                                    objFieldExp.Expense_Amount = Convert.ToDouble(doc.Split('^')[2]);
                                    if (doc.Split('^')[3] != "")
                                    {
                                        objFieldExp.Present_Contribution = Convert.ToDouble(doc.Split('^')[3]);
                                    }
                                    if (doc.Split('^')[4] != "")
                                    {
                                        objFieldExp.Potential_Contribution = Convert.ToDouble(doc.Split('^')[4]);
                                    }
                                    objFieldExp.Bill_Number = doc.Split('^')[5];
                                    objFieldExp.Remarks_By_User = doc.Split('^')[6];
                                    objFieldExp.Approved_Amount = Convert.ToDouble(doc.Split('^')[7]);
                                    objFieldExp.Version_Number = versionNumber;

                                    lstClaimDetail.Add(objFieldExp);
                                }
                            }
                        }
                    }
                    #endregion assign doctor crm claim detail list
                }
                else
                {
                    actualAmount = 0.00;
                    approvedAmount = 0.00;
                    otherDeductions = 0.00;
                }

                result = _objExp.UpdateAddlExpenseClaim(companyCode, claimCode, userCode, regionCode, statusCode, actualAmount, approvedAmount, otherDeductions
                                                    , enteredDate, remarks, lstClaimDetail, updatedBy, updatedDate, expenseType, versionNumber, modeType, lstAddlExp);

                if (modeType == "U" && result == 0)
                {
                    result = 1;
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string GetClaimDetailsForEdit(string companycode, string claimCode, string requestType)
        {
            try
            {
                StringBuilder strTblContent = new StringBuilder();
                StringBuilder AddlStrTblContent = new StringBuilder();
                StringBuilder strHistory = new StringBuilder();
                List<MVCModels.ExpenseClaimModel> lstClaim = new List<MVCModels.ExpenseClaimModel>();
                List<MVCModels.AddlUnapproveExpModel> lstUnApproveAddlExp = new List<MVCModels.AddlUnapproveExpModel>();
                IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
                JSONConverter objJson = new JSONConverter();
                string dcrFrom = string.Empty, dcrTo = string.Empty, userCode = string.Empty;
                string DcrDateEdit = string.Empty;

                lstClaim = _objExp.GetExpenseClaimDetails(companycode, claimCode);
                lstUnApproveAddlExp = _objExp.GetAddlExpenseClaimDetails(companycode, claimCode);
                string favouringUserCode = lstClaim[0].lstClaimHeader[0].Favouring_User_Code;

                if (requestType == "FIELD") // Field Expense Claim
                {
                    AddlStrTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblAddlExpDetails' class='table table-hover'><thead><tr>");
                    AddlStrTblContent.Append("<td>DCR Date</td><td>Flag</td><td>Category</td>");
                    AddlStrTblContent.Append("<td>Expense Type</td><td>Claim Amount</td>");
                    AddlStrTblContent.Append("<td>Current Deduction</td><td>Approved Amount</td>");
                    AddlStrTblContent.Append("<td>Reference Details</td><td>User Remarks</td>");
                    AddlStrTblContent.Append("<td>Admin Remarks</td><td>Action</td></tr></thead><tbody id='AddlCntEdit'>");
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

                        AddlStrTblContent.Append("<tr class='AprExpRow' id='AprExpRowId_" + rowCount + "'><input type='hidden' id='FavUser_" + rowCount + "' value='" + item.Favouring_User_Code + "'/><input type='hidden' id='ClaimDet_" + rowCount + "' value='" + item.Claim_Detail_Code + "'/> ");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control AutoDcrDate' onblur ='fnValidateAutofill(this," + "AutoComplete_DcrDate" + ",\"AddlDcrDate\",\"hdnAddlDateEdit\");fnGetDcrFlagEdit(" + rowCount + ");' autocomplete='off' id='AddlDcrDate_" + rowCount + "' value='" + AddlDcrDate + "' disabled/><input type='hidden' id='hdnAddlDateEdit_" + rowCount + "' value='" + AddlDcrDate + "'/></td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control AutoDcrFlag' onblur ='fnValidateAutofill(this," + "AutoComplete_Ovr_DcrFlag" + ",\"AddlDcrFlag\",\"hdnAddlFlagEdit\");fnGetDcrCategoryEdit(" + rowCount + ");' autocomplete='off' id='AddlDcrFlag_" + rowCount + "' value='" + DcrFlag + "' disabled/><input type='hidden' id='hdnAddlFlagEdit_" + rowCount + "' value='" + DcrFlag + "'/></td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control AutoDcrCat' onblur ='fnValidateAutofill(this," + "AutoComplete_Dcr_Category" + ",\"AddlCat\",\"hdnAddlCatEdit\");' autocomplete='off' id='AddlCat_" + rowCount + "' value='" + item.Category + "'disabled/><input type='hidden' id='hdnAddlCatEdit_" + rowCount + "' value='" + item.Category + "'/></td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control AutoDcrExp' Addl_Exp_Code='" + item.Expense_Type_Name + "' onclick='fnGetDcrExpenseEdit(" + rowCount + ");' id='AddlExpType_" + rowCount + "' value='" + item.Expense_Type_Name + "' disabled/><input type='hidden' id='hdnAddlExpEdit_" + rowCount + "' value='" + item.Expense_Type_Code + "'/></td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control' id='AddlExpAmt_" + rowCount + "' value='" + item.Expense_Amount + "' disabled/></td>");
                        AddlStrTblContent.Append("<td id='AddlCurrDed_" + rowCount + "'>0</td>");
                        AddlStrTblContent.Append("<td id='AddlAprAmt_" + rowCount + "'>" + item.Approved_Amount + "</td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control' id='AddlRef_" + rowCount + "' /></td>");
                        AddlStrTblContent.Append("<td><input type='text' class='form-control' id='AddlUserRem_" + rowCount + "' /></td>");
                        AddlStrTblContent.Append("<td id='AddlAdminRem_" + rowCount + "'>" + item.Managers_Approval_Remark + "</td>");
                        AddlStrTblContent.Append("<td><a id='RemoveIcon_" + rowCount + "' style='display: none;cursor:pointer;' onclick='FnClearExpenseEdit(" + rowCount + ")'><i class='fa fa-remove' style='font-size:18px;color:red;'></i></a><a style='cursor:pointer;' id='TrashIcon_" + rowCount + "' onclick='FnDelExpenseEdit(" + rowCount + ")'><i class='fa fa-trash-o fa-lg' style='font-size:18px;color:orange;'></i></a></td>");
                        AddlStrTblContent.Append("</tr>");
                    }


                    AddlStrTblContent.Append("</tbody></table>");

                    #region field expense claim details
                    List<MVCModels.DCRUserExpenseDetails> lstDCR = new List<MVCModels.DCRUserExpenseDetails>();
                    dcrFrom = lstClaim[0].lstClaimHeader[0].Date_From;
                    dcrTo = lstClaim[0].lstClaimHeader[0].Date_To;
                    userCode = lstClaim[0].lstClaimHeader[0].Favouring_User_Code;

                    dcrFrom = dcrFrom.Split('/')[2] + "-" + dcrFrom.Split('/')[1] + "-" + dcrFrom.Split('/')[0];
                    dcrTo = dcrTo.Split('/')[2] + "-" + dcrTo.Split('/')[1] + "-" + dcrTo.Split('/')[0];
                    DcrDateEdit = dcrFrom + ',' + dcrTo + ',' + favouringUserCode;
                    //main expense details for the selected period
                    lstDCR = (List<MVCModels.DCRUserExpenseDetails>)(_objExp.GetDCRExpenseDetails(companycode, userCode, dcrFrom, dcrTo)).ToList();

                    lstExpClaimDetails = _objExp.GetFieldExpenseClaimDetails(companycode, claimCode);

                    // if in claim detail
                    // or 

                    strTblContent.Append("<table cellspacing=0 cellpadding=0 id='tblExpDetails' class='table table-hover'><thead><tr>");
                    strTblContent.Append("<td>DCR Date</td><td>Flag</td><td>Expense Type</td>");
                    strTblContent.Append("<td>SFC Details</td><td>Category</td><td>Status</td><td>DCR Reamrks</td><td>Claim Amount</td>");
                    strTblContent.Append("<td>Current Deduction</td><td>Approved Amount</td><td><input type='checkbox' name='selAllExpenseEdit' onclick='fnSelectAllExpenseForEdit();'/>Select</td><td>Reference Details</td><td>User Remarks</td>");
                    strTblContent.Append(" <td>Admin Remarks</td></tr></thead><tbody>");
                    if (lstDCR != null)
                    {
                        int i = 0;
                        foreach (var dcr in lstDCR)
                        {
                            i++;

                            var claimDetail = lstExpClaimDetails.Where(x => x.DCR_Actual_Date == dcr.DCR_Date.Replace('/', '-') && x.DCR_Activity_Flag.ToString() == dcr.DCR_Flag && x.Expense_Type_Code == dcr.Expense_Type_Code).FirstOrDefault();

                            string dcrDate = dcr.DCR_Date.Split('/')[2] + "-" + dcr.DCR_Date.Split('/')[1] + "-" + dcr.DCR_Date.Split('/')[0];
                            if (claimDetail != null) // for already applied claims
                            {
                                strTblContent.Append("<tr style='background-color:crimson'>");
                                strTblContent.Append("<td>" + dcr.DCR_Date + "</td>");
                                strTblContent.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                                strTblContent.Append("<td id='tdExpTypeNameEdit_" + i.ToString() + "'>" + dcr.Expense_Type_Name + "</td>");
                                strTblContent.Append("<td ><a class='td-a' onclick='fnShowSFC(\"" + dcr.DCR_Date.Replace('/', '-') + "\",\"" + favouringUserCode + "\",\"" + dcr.DCR_Flag + "\");'>View</a></td>");
                                strTblContent.Append("<td>" + dcr.Category + "</td>");
                                if (dcr.DCR_Status.ToString() == "2")
                                {
                                    strTblContent.Append("<td>Approved</td>");
                                }
                                else if (dcr.DCR_Status.ToString() == "0")
                                {
                                    strTblContent.Append("<td>UnApproved</td>");
                                }
                                else if (dcr.DCR_Status.ToString() == "3")
                                {
                                    strTblContent.Append("<td>Drafted</td>");
                                }
                                else
                                {
                                    strTblContent.Append("<td>Applied</td>");
                                }
                                strTblContent.Append("<td id='tdExpDCRRemarks_" + i.ToString() + "'><a class='td-a' onclick=' fnRemrksView(\"" + dcr.DCR_Expense_Remarks + "\")'> View </td>");
                                strTblContent.Append("<td id='tdExpAmountEdit_" + i.ToString() + "'>" + dcr.Expense_Amount + "</td>");
                                strTblContent.Append("<td class='tdAlignRight' id='spnDeduction_" + i + "'>0</td>");
                                strTblContent.Append("<td class='tdAlignRight'><span id='spnApproved_" + i + "'>" + claimDetail.Approved_Amount + "</span></td>");

                                strTblContent.Append("<td><input type='checkbox' name='checkedExpenseEdit' onclick='fnClearSelectAllForEdit();' checked='checked' value='" + claimDetail.DCR_Expense_Code + "_" + dcrDate + "_" + claimDetail.DCR_Activity_Flag + "_" + claimDetail.Expense_Type_Code + "_" + dcr.Expense_Amount + "' id='chkExpEdit_" + i.ToString() + "' Exp_Code='" + dcr.Expense_Type_Name + "'/></td>");
                                strTblContent.Append("<td><input type='text' value='" + claimDetail.Bill_Number + "' class='form-control' id='txtBillNumberEdit_" + i + "'/></td>");
                                strTblContent.Append("<td><textarea id='txtUserRemarksEdit_" + i.ToString() + "' class='form-control'>" + claimDetail.Remarks_By_User + "</textarea></td>");
                                strTblContent.Append("<td>" + claimDetail.Managers_Approval_Remark + "</td></tr>");
                            }
                            else // other dates in the date period
                            {
                                strTblContent.Append("<tr>");
                                strTblContent.Append("<td>" + dcr.DCR_Date + "</td>");
                                strTblContent.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                                strTblContent.Append("<td id='tdExpTypeNameEdit_" + i.ToString() + "'>" + dcr.Expense_Type_Name + "</td>");
                                strTblContent.Append("<td ><a class='td-a' onclick='fnShowSFC(\"" + dcr.DCR_Date.Replace('/', '-') + "\",\"" + favouringUserCode + "\",\"" + dcr.DCR_Flag + "\");'>View</a></td>");
                                strTblContent.Append("<td>" + dcr.Category + "</td>");
                                if (dcr.DCR_Status.ToString() == "2")
                                {
                                    strTblContent.Append("<td>Approved</td>");
                                }
                                else if (dcr.DCR_Status.ToString() == "0")
                                {
                                    strTblContent.Append("<td>UnApproved</td>");
                                }
                                else if (dcr.DCR_Status.ToString() == "3")
                                {
                                    strTblContent.Append("<td>Drafted</td>");
                                }
                                else
                                {
                                    strTblContent.Append("<td>Applied</td>");
                                }
                                strTblContent.Append("<td id='tdExpDCRRemarks_" + i.ToString() + "'><a class='td-a' onclick=' fnRemrksView(\"" + dcr.DCR_Expense_Remarks + "\")'> View </td>");
                                strTblContent.Append("<td id='tdExpAmountEdit_" + i.ToString() + "'>" + dcr.Expense_Amount + "</td>");
                                strTblContent.Append("<td class='tdAlignRight' id='spnDeduction_" + i + "'>-</td>");
                                strTblContent.Append("<td class='tdAlignRight'><span id='spnApproved_" + i + "'>-</span></td>");
                                if (dcr.Expense_Claim_Code == "")
                                {
                                    strTblContent.Append("<td><input type='checkbox' name='checkedExpenseEdit' onclick='fnClearSelectAllForEdit();' value='" + dcr.DCR_Expense_Code + "_" + dcrDate + "_" + dcr.DCR_Flag + "_" + dcr.Expense_Type_Code + "_" + dcr.Expense_Amount + "' id='chkExpEdit_" + i.ToString() + "'Exp_Code='" + dcr.Expense_Type_Name + "'/></td>");

                                }
                                else
                                {
                                    strTblContent.Append("<td></td>");
                                }
                                strTblContent.Append("<td><input type='text' value='' class='form-control' id='txtBillNumberEdit_" + i + "'/></td>");
                                strTblContent.Append("<td><textarea id='txtUserRemarksEdit_" + i.ToString() + "' class='form-control'></textarea></td>");
                                strTblContent.Append("<td></td></tr>");
                            }
                            strTblContent.Append("</tr>");
                        }
                    }

                    strTblContent.Append("</tbody></table>");
                    #endregion field expense claim details
                }
                else if (requestType == "CRM")
                {
                    //lstExpClaimDetails = _objExp.GetDoctorCRMClaimDetails(companycode, claimCode);
                    #region DOCTOR CRM claim details
                    lstExpClaimDetails = _objExp.GetDoctorCRMClaimDetails(companycode, claimCode);
                    strTblContent.Append("<table cellspacing=0 cellpadding=0 id='tbldocCRMEdit' class='table table-hover'><thead><tr>");
                    strTblContent.Append("<td>Customer Name</td><td>Claim Amount</td><td>Deduction</td><td>Approved Amount</td>");
                    strTblContent.Append("<td>Present Contribution</td><td> Committed Contribution</td>");
                    strTblContent.Append("<td>Reference Details</td><td>User Remarks</td><td>Admin Remarks</td><td>Edit Stockiest</td></thead></tr><tbody>");
                    if (lstExpClaimDetails != null)
                    {
                        int i = 1;
                        foreach (var expClaim in lstExpClaimDetails)
                        {
                            strTblContent.Append("<tr>");
                            strTblContent.Append("<td><input type='text' id='txtEDCust_" + i + "' value='" + expClaim.Customer_Name + "_" + expClaim.MDL_Number + "_" + expClaim.Speciality_Name + "_" + expClaim.Region_Name + "' class='input-large form-control autoCustEdit' />");
                            strTblContent.Append("<input type='hidden' value='" + expClaim.Customer_Code + "_" + expClaim.Doctor_Region_Code + "' id='hdnEDCust_" + i + "' /></td>");
                            strTblContent.Append("<td><input type='text' id='txtEDExp_" + i + "' class='input-mini form-control docExpEdit' value='" + expClaim.Expense_Amount.ToString() + "' /></td>");
                            strTblContent.Append("<td id='spnEDDeduction_" + i + "'>" + expClaim.Deduction_Amount.ToString() + "</td>");
                            strTblContent.Append("<td id='spnEDApproved_" + i + "'>" + expClaim.Approved_Amount.ToString() + "</td>");
                            strTblContent.Append("<td><input type='text' id='txtEDPresent_" + i + "' class='input-large form-control checkexpnumericEdit' value='" + expClaim.Present_Contribution + "' /></td>");
                            strTblContent.Append("<td><input type='text' id='txtEDPotential_" + i + "' class='input-large form-control checkexpnumericEdit' value='" + expClaim.Potential_Contribution + "' /></td>");
                            strTblContent.Append("<td><input type='text' class='form-control' value='" + expClaim.Bill_Number + "' id='txtEDBillNumber_" + i + "'/></td>");
                            strTblContent.Append("<td><textarea id='txtEDUserRemarks_" + i.ToString() + "' class='form-control'>" + expClaim.Remarks_By_User + "</textarea></td>");
                            strTblContent.Append("<td>" + expClaim.Managers_Approval_Remark);
                            //strTblContent.Append("<td>" + "<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Edit Stockiest' onClick='fnGetEditCRMStockiestAndProducts("+expClaim.Customer_Code + "_" + expClaim.Doctor_Region_Code+","+i+");'/>");
                            strTblContent.Append("<input type='hidden' id='hdn_StockiestProductJson_" + i + "'/>");
                            strTblContent.Append("<td>" + "<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Edit Stockiest' onClick='StockiestPopup(" + i + "," + claimCode + ");'/>");
                            strTblContent.Append("</td></tr>");

                            i++;
                        }
                        strTblContent.Append("<tr>");
                        strTblContent.Append("<td><input type='text' id='txtEDCust_" + i + "' class='input-large form-control autoCustEdit' /><input type='hidden' id='hdnEDCust_" + i + "' /></td>");
                        strTblContent.Append("<td><input type='text' id='txtEDExp_" + i + "' class='input-mini form-control docExpEdit' /></td>");
                        strTblContent.Append("<td id='spnEDDeduction_" + i + "'>0.00</td>");
                        strTblContent.Append("<td id='spnEDApproved_" + i + "'>0.00</td>");
                        strTblContent.Append("<td><input type='text' id='txtEDPresent_" + i + "' class='input-large form-control checkexpnumericEdit' /></td>");
                        strTblContent.Append("<td><input type='text' id='txtEDPotential_" + i + "' class='input-large form-control checkexpnumericEdit' /></td>");
                        strTblContent.Append("<td><input type='text' class='form-control' id='txtEDBillNumber_" + i + "'/></td>");
                        strTblContent.Append("<td><textarea id='txtEDUserRemarks_" + i.ToString() + "' class='form-control'></textarea></td>");
                        strTblContent.Append("<td></td>");
                        strTblContent.Append("<input type='hidden' id='hdn_StockiestProductJson_" + i + "'/>");
                        strTblContent.Append("<td>" + "<input type='button' id='btnStockiest_" + i + "' class='btn btn-primary autoCust' value='Save Stockiest' onClick='StockiestPopup(" + i + "," + claimCode + ");'/>");
                        strTblContent.Append("</td></tr>");
                    }
                    strTblContent.Append("</tbody></table>");
                    #endregion DOCTOR CRM claim details
                }
                else
                {
                }
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
                            strHistory.Append("<td>" + (string.IsNullOrEmpty(history.Updated_By) ? "-" : history.Updated_By) + "</td>");
                            strHistory.Append("<td>" + (string.IsNullOrEmpty(history.Updated_Date) ? "-" : history.Updated_Date) + "</td>");
                            strHistory.Append("</tr>");
                        }
                    }
                    strHistory.Append("</tbody></table>");
                }


                return strTblContent.ToString() + "$" + strHistory.ToString() + "$" + objJson.Serialize(lstClaim) + "$" + AddlStrTblContent.ToString() + "$" + DcrDateEdit;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string GetFieldExpenseClaimDetailsPopUpString(string companyCode, string claimCode)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
                lstExpClaimDetails = _objExp.GetFieldExpenseClaimDetails(companyCode, claimCode);
                if (lstExpClaimDetails != null && lstExpClaimDetails.Count() > 0)
                {
                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>DCR Date</th>");
                    sbTbl.Append("<th>DCR Activity</th>");
                    sbTbl.Append("<th>Expense Type</th>");
                    sbTbl.Append("<th>Amount</th>");
                    sbTbl.Append("<th>Reference Details</th>");
                    sbTbl.Append("<th>User Remarks</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");

                    foreach (var exp in lstExpClaimDetails)
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + exp.DCR_Actual_Date + "</td>");
                        sbTbl.Append("<td>" + ((exp.DCR_Activity_Flag.ToString() == "F") ? "Field" : "Attendance") + "</td>");
                        sbTbl.Append("<td>" + exp.Expense_Type_Name + "</td>");
                        sbTbl.Append("<td>" + exp.Expense_Amount.ToString() + "</td>");
                        sbTbl.Append("<td>" + exp.Bill_Number + "</td>");
                        sbTbl.Append("<td class='expRem'  title='" + exp.Remarks_By_User + "'>" + exp.Remarks_By_User + "</td>");
                        sbTbl.Append("</tr>");
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Details found for this Expense Claim.</div><div style='clear: both;'>");
                }

                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string GetDoctorCRMClaimDetailsPopUpString(string companyCode, string claimCode)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExpClaimDetails = null;
                lstExpClaimDetails = _objExp.GetDoctorCRMClaimDetails(companyCode, claimCode);

                if (lstExpClaimDetails != null && lstExpClaimDetails.Count() > 0)
                {
                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>Customer Name</th>");
                    sbTbl.Append("<th>MDL/SVL No</th>");
                    sbTbl.Append("<th>Speciality</th>");
                    sbTbl.Append("<th>Amount</th>");
                    sbTbl.Append("<th>Present Contribution</th>");
                    sbTbl.Append("<th>Committed Contribution</th>");
                    sbTbl.Append("<th>User Remarks</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");

                    foreach (var exp in lstExpClaimDetails)
                    {
                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + exp.Customer_Name + "</td>");
                        sbTbl.Append("<td>" + exp.MDL_Number + "</td>");
                        sbTbl.Append("<td>" + exp.Speciality_Name + "</td>");
                        sbTbl.Append("<td>" + exp.Expense_Amount.ToString() + "</td>");
                        sbTbl.Append("<td>" + exp.Present_Contribution + "</td>");
                        sbTbl.Append("<td>" + exp.Potential_Contribution + "</td>");
                        sbTbl.Append("<td class='expRem'  title='" + exp.Remarks_By_User + "'>" + exp.Remarks_By_User + "</td>");
                        sbTbl.Append("</tr>");
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No Details found for this Expense Claim.</div><div style='clear: both;'>");
                }

                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<MVCModels.CRMStockiest> GetCRMStockiest(string companyCode, string userCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetCRMStockiest(companyCode, userCode).ToList();
        }

        public List<MVCModels.CRMProduct> GetCRMProduct(string companyCode, string userCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetCRMProduct(companyCode, userCode).ToList();
        }

        public List<MVCModels.CRMCustomerDetails> GetCRMCustomerDetails(string companyCode, string customerCode, string claimCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetCRMCustomerDetails(companyCode, customerCode, claimCode).ToList();
        }

        public List<MVCModels.CRMCustomerDetails> GetApprovedCRMCustomerDetails(string companyCode, string customerCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetApprovedCRMCustomerDetails(companyCode, customerCode).ToList();
        }

        public List<MVCModels.CRMCustomerDetails> GetExpenseClaimApprovedStockiest(string companyCode, string customerCode, string claimCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetExpenseClaimApprovedStockiest(companyCode, customerCode, claimCode).ToList();
        }


        public List<MVCModels.CRMExpenseApproavedProducts> GetExpenseClaimApprovedProducts(string companyCode, string claimCode)
        {
            _objExp = new DAL_ExpenseClaim();
            return _objExp.GetExpenseClaimApprovedProducts(companyCode, claimCode).ToList();
        }
        #region - Delete Expense Claim header
        /// <summary>
        /// Delete claim header when there is no details found
        /// </summary>
        /// <param name="claimCode"></param>
        /// <param name="requestCode"></param>
        /// <param name="userCode"></param>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public int DeleteClaimHeader(string claimCode, string requestCode, string userCode, string companyCode)
        {
            _objExp = new DAL_ExpenseClaim();

            return _objExp.DeleteClaimHeader(claimCode, requestCode, userCode, companyCode);
        }


        #endregion - Delete Expense Claim header

        #region expense claim approval
        /// <summary>
        /// Get Expense Claim request header details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns>returns the ExpenseClaimHeaderModel list</returns>
        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetClaimRequestByUser(string companyCode, string userCode, string userTypeCode, string searchKey)
        {
            return _objExp.GetClaimRequestByUser(companyCode, userCode, userTypeCode, searchKey);
        }
        /// <summary>
        /// Get the active status cycle mapping details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the StatusCycleMapping list </returns>
        public IEnumerable<MVCModels.StatusCycleMapping> GetActiveStatusCycle(string companyCode)
        {
            return _objExp.GetActiveStatusCycle(companyCode);
        }

        /// <summary>
        /// Insert expense claim approval
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="claimCode"></param>
        /// <param name="updatedTime"></param>
        /// <param name="claimDetails"></param>
        /// <param name="statusCode"></param>
        /// <param name="approvedAmount"></param>
        /// <param name="adminRemarks"></param>
        /// <param name="orderNo"></param>
        /// <returns>Returns the no of rows inserted</returns>
        //public int InsertExpenseClaimApproval(string companyCode, string userCode, string claimCode, string updatedTime,
        //          string claimDetails, string statusCode, double approvedAmount, string adminRemarks, string orderNo, string totalDeduction, string ExpType, string expensePrivilegevalue, string claimUserTypeName
        //          , string regionCode, double actualAmount, string favoringUserCode, string payment_Mode, string payment_Remarks, string moveOrder)
        public int InsertExpenseClaimApproval(ExpenseClaimApprvalData obj)
        {
            //JSONConverter objJson=new JSONConverter();
            int rowsAffected = 0;
            List<MVCModels.ExpenseClaimHeaderModel> lstClaim = new List<MVCModels.ExpenseClaimHeaderModel>();
            try
            {
                if (!string.IsNullOrEmpty(obj.claimDetails))
                {
                    List<MVCModels.ExpenseClaimDetailsModel> lstDetails = (List<MVCModels.ExpenseClaimDetailsModel>)JsonConvert.DeserializeObject(obj.claimDetails,
                        typeof(List<MVCModels.ExpenseClaimDetailsModel>));

                    //get version number from hedaer
                    int versionNumber = _objExp.GetExpenseClaimMaxVersionNumber(obj.Company_Code, obj.claimCode);
                    versionNumber = versionNumber + 1;
                    lstClaim = _objExp.GetExpenseclaimstatusforMonth(obj.Company_Code, obj.claimCode).ToList();
                    bool isValid = false;
                    if (lstClaim != null && lstClaim.Count() > 0)
                    {
                        string details = GetMappedStatusCycle(obj.Company_Code, obj.User_Type_Name, obj.User_Name, obj.Region_Name, lstClaim[0].Cylce_Code, lstClaim[0].Move_Order);
                        string arrDetails = details.Split('^')[0];
                        List<MVCModels.StatusCycleMapping> lstCycleMasterDetails = JsonConvert.DeserializeObject<List<MVCModels.StatusCycleMapping>>(arrDetails);
                        if (Convert.ToInt16(obj.moveOrder) < Convert.ToInt16(lstClaim[0].Move_Order))
                        {
                            isValid = true;
                        }
                    }
                    if (isValid)
                    {
                        List<MVCModels.ExpenseClaimDetailsModel> lstAddlClaim = new List<MVCModels.ExpenseClaimDetailsModel>();
                        lstAddlClaim = lstDetails.Where(x => x.Expense_Mode == "Manual").ToList();
                        if (obj.expensePrivilegevalue.ToUpper() == "MONTHLY")
                        {
                            double expenseAmount = 0;
                            if (lstAddlClaim != null && lstAddlClaim.Count > 0)
                            {
                                for (int i = 0; i < lstAddlClaim.Count(); i++)
                                {
                                    expenseAmount = expenseAmount + lstAddlClaim[i].Expense_Amount;
                                }

                            }
                            obj.actualAmount = expenseAmount;
                        }
                        lstDetails.ForEach(c => { c.Approved_Amount = 0; c.Company_Code = obj.Company_Code; c.Claim_Code = obj.claimCode; c.Version_Number = versionNumber; });
                        obj.approvedAmount = 0;
                        obj.OtherDeduction = "0";
                    }
                    else
                    {
                        double expenseAmount = 0;
                        for (int i = 0; i < lstDetails.Count(); i++)
                        {
                            expenseAmount = expenseAmount + lstDetails[i].Expense_Amount;
                        }
                        obj.actualAmount = expenseAmount;
                        lstDetails.ForEach(c => { c.Company_Code = obj.Company_Code; c.Claim_Code = obj.claimCode; c.Version_Number = versionNumber; });
                    }
                    rowsAffected = _objExp.InsertExpenseClaimApproval(obj.Company_Code, obj.User_Name, obj.claimCode, obj.updatedTime, lstDetails, obj.statusCode, obj.approvedAmount,
                        obj.adminRemarks, obj.orderNo, obj.OtherDeduction, obj.ExpType, versionNumber, obj.payment_Mode, obj.payment_Remarks, obj.expensePrivilegevalue, obj.actualAmount);//, favoringUserCode, statusCycleMapping);

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("statusCode", obj.statusCode);
                dicContext.Add("claimDetails", obj.claimDetails);
                dicContext.Add("claimCode", obj.claimCode);
                dicContext.Add("orderNo", obj.orderNo);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
            return rowsAffected;
        }
        public string GetMappedStatusCycle(string Company_Code, string User_Type_Name, string User_Name, string Region_Name, string cycleCode, string moveOrder)
        {
            DataControl.JSONConverter objJson = new JSONConverter();
            // DataControl.CurrentInfo objCurInfo = new CurrentInfo();
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


            return objJson.Serialize(lstStatus) + "^" + User_Name + "|" + Region_Name;
        }
        //mutiple Appovel
        public int InsertExpenseClaimApproval(string companyCode, string userCode, string claimCode, string updatedTime,
                  List<MVCModels.ExpenseClaimDetailsModel> lstDetails, string statusCode, double approvedAmount, string adminRemarks, string orderNo, string totalDeduction, string ExpType, string expensePrivilegevalue, string claimUserTypeName
                  , string regionCode, double actualAmount, string favoringUserCode, string payment_Mode, string payment_Remarks)
        {
            //JSONConverter objJson=new JSONConverter();
            int rowsAffected = 0;
            try
            {


                //get version number from hedaer
                int versionNumber = _objExp.GetExpenseClaimMaxVersionNumber(companyCode, claimCode);
                versionNumber = versionNumber + 1;



                lstDetails.ForEach(c => { c.Company_Code = companyCode; c.Claim_Code = claimCode; c.Version_Number = versionNumber; });
                rowsAffected = _objExp.InsertExpenseClaimApproval(companyCode, userCode, claimCode, updatedTime, lstDetails, statusCode, approvedAmount,
                    adminRemarks, orderNo, totalDeduction, ExpType, versionNumber, payment_Mode, payment_Remarks, expensePrivilegevalue, actualAmount);
                //#region - Expense delink logic for Month wise expense
                //if (expensePrivilegevalue.ToUpper() == "MONTHLY")
                //{
                //    if (expensePrivilegevalue.ToUpper() == "MONTHLY" && ExpType == "FIELD_EXPENSE_REQUEST_FOR")
                //    {
                //        ExpType = "FIELD";
                //    }
                //    else if (ExpType == "REQUEST_CUSTOMER_FOR")
                //    {
                //        ExpType = "CRM";
                //    }
                //    if (rowsAffected > 0)
                //    {
                //        List<MVCModels.ExpenseClaimHeaderModel> lstClaim = new List<MVCModels.ExpenseClaimHeaderModel>();
                //        lstClaim = _objExp.GetExpenseclaimstatusforMonth(companyCode, claimCode).ToList();
                //        if (lstClaim != null && lstClaim.Count() > 0)
                //        {
                //            bool isEdit = false;
                //            string modeType = "U";
                //            string statusCycleMapping = "NO";

                //            if (lstClaim[0].Move_Order != "")
                //            {
                //                lstClaim[0].Move_Order = lstClaim[0].Move_Order.TrimEnd(',');
                //                if (lstClaim[0].Move_Order == "1") // if move order applied status
                //                {
                //                    statusCycleMapping = CheckStatusCycleMapping(companyCode, lstClaim[0].Cylce_Code, 1, claimUserTypeName);
                //                    if (statusCycleMapping != "NO")
                //                    {
                //                        isEdit = false;

                //                        if (lstClaim[0].User_Code == favoringUserCode)
                //                        {
                //                            isEdit = true;
                //                        }
                //                        if (isEdit)
                //                        {
                //                            lstDetails = new List<MVCModels.ExpenseClaimDetailsModel>(); // Empty - In Unapprove case system automatically delink the claimed expenses.
                //                            rowsAffected = _objExp.UpdateExpenseClaim(companyCode, claimCode, favoringUserCode, regionCode, statusCode, actualAmount, approvedAmount, Convert.ToDouble(totalDeduction)
                //                             , updatedTime, adminRemarks, lstDetails, userCode, updatedTime, ExpType, versionNumber, modeType);
                //                        }
                //                    }
                //                }
                //            }
                //        }
                //    }
                //}
                //#endregion - Expense delink logic for Month wise expense

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("statusCode", statusCode);
                dicContext.Add("claimDetails", "claimDetails");
                dicContext.Add("claimCode", claimCode);
                dicContext.Add("orderNo", orderNo);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
            return rowsAffected;
        }
        public DataSet GetDCRSFCDetails(string companyCode, string userCode, string dcrDate, string dcrFlag)
        {
            return _objExp.GetDCRSFCDetails(companyCode, userCode, dcrDate, dcrFlag);
        }


        public int GetvalidClaimRequest(string companyCode, string userCode, string requestcode)
        {
            return _objExp.GetvalidClaimRequest(companyCode, userCode, requestcode);
        }

        public string GetRequestLimit(string companyCode, string requestcode)
        {
            return _objExp.GetRequestLimit(companyCode, requestcode);
        }

        public string GetExpenserequestType(string companyCode, string requestcode)
        {
            return _objExp.GetExpenserequestType(companyCode, requestcode);
        }

        public List<MVCModels.CRMYeildPotential> GetExpenseClaimYeildPotential(string companyCode, string customerCode)
        {
            return _objExp.GetExpenseClaimYeildPotential(companyCode, customerCode).ToList();
        }
        #endregion expense claim approval


        #region - Expense claim MOnth wise
        public string GetExpenseMonthPrivilege(string companyCode, string userCode)
        {
            string privilegeName = string.Empty;
            List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilege = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
            lstPrivilege = _objExp.GetExpenseMonthPrivilege(companyCode, userCode);
            if (lstPrivilege != null && lstPrivilege.Count > 0)
            {
                privilegeName = lstPrivilege[0].Privilege_Value_Name;
            }
            return privilegeName;
        }


        //public List<MVCModels.DCRUserExpenseDetails> GetDCRTotalExpense(string companyCode, string userCode, string month, string year)
        //{
        //    return _objExp.GetTotalExpenseDetails(companyCode, userCode, month, year).ToList();
        //}
        /// <summary>
        /// Get expense claim for a month
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="requestClaimcode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public int GetExpenseMonthCount(string companyCode, string userCode, string requestClaimcode, int month, int year)
        {
            return _objExp.GetExpenseMonthCount(companyCode, userCode, requestClaimcode, month, year);
        }
        /// <summary>
        /// showing dcr expense details for monthwise
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public string GetDCRExpensedetailsforMonthwise(string companyCode, string userCode, int month, int year)
        {
            List<MVCModels.DCRUserExpenseDetails> lsstDCRUserExpense = new List<MVCModels.DCRUserExpenseDetails>();
            List<MVCModels.AddlUnapproveExpModel> lstUnApproveAddlExp = new List<MVCModels.AddlUnapproveExpModel>();
            List<MVCModels.ExpenseActivityModel> lstExpenseActivityModel = new List<MVCModels.ExpenseActivityModel>();

            lsstDCRUserExpense = _objExp.GetDCRExpensedetailsforMonthwise(companyCode, userCode, month, year).ToList();
            lstUnApproveAddlExp = _objExp.GetUnapproveAddlExpdetforMonthwise(companyCode, userCode, month, year).ToList();
            lstExpenseActivityModel = GetDCRActivityCounts(companyCode, userCode, month, year);
            MVCModels.ExpenseActivityModel expenseDCRActivityModel = new MVCModels.ExpenseActivityModel();
            int countRow = 1;
            StringBuilder addlExpStr = new StringBuilder();

            addlExpStr.Append("<div  class='table-responsive'><table class='table table-striped' id='tblAddlExpenseEntry' cellspacing='0' cellpadding='0'>");
            addlExpStr.Append("<thead>");
            addlExpStr.Append("<tr>");
            addlExpStr.Append("<th>DCR Date</th>");
            addlExpStr.Append("<th>Flag</th>");
            addlExpStr.Append("<th>Category</th>");
            addlExpStr.Append("<th>Expense Type</th>");
            addlExpStr.Append("<th>Expense Amount</th>");
            addlExpStr.Append("<th>Reference Details</th>");
            addlExpStr.Append("<th>Remarks</th>");
            addlExpStr.Append("<th>Action</th>");
            addlExpStr.Append("</tr>");
            addlExpStr.Append("</thead>");
            addlExpStr.Append("<tbody>");
            foreach (var Addlitem in lstUnApproveAddlExp)
            {
                string formattedDate = string.Empty;
                if (Addlitem.DCR_Actual_Date != "" && Addlitem.DCR_Actual_Date != null)
                {
                    string[] dcrDateAddl;
                    dcrDateAddl = Addlitem.DCR_Actual_Date.Split(' ');
                    dcrDateAddl = dcrDateAddl[0].Split('/');
                    if (dcrDateAddl[1].Length == 1 && dcrDateAddl[0].Length == 1)
                    {
                        formattedDate = '0' + dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    }
                    else if (dcrDateAddl[1].Length == 1)
                    {
                        formattedDate = '0' + dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    }
                    else if (dcrDateAddl[0].Length == 1)
                    {
                        formattedDate = dcrDateAddl[1] + "/0" + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    }
                    else
                    {
                        formattedDate = dcrDateAddl[1] + '/' + dcrDateAddl[0] + '/' + dcrDateAddl[2];
                    }

                }

                addlExpStr.Append("<tr>");
                addlExpStr.Append("<td id='unDcrDate_" + countRow + "'>" + formattedDate + "</td>");
                if (Addlitem.DCR_Activity_Flag.ToUpper() == "F")
                {
                    addlExpStr.Append("<td id='unDcrFlag_" + countRow + "'>Field</td>");
                }
                else if (Addlitem.DCR_Activity_Flag.ToUpper() == "A")
                {
                    addlExpStr.Append("<td id='unDcrFlag_" + countRow + "'>Attendance</td>");
                }
                addlExpStr.Append("<td id='unDcrCat_" + countRow + "'>" + Addlitem.Category + "</td>");
                addlExpStr.Append("<td id='unExpType_" + countRow + "'>" + Addlitem.Expense_Type_Name + "<input type='hidden' id='hdnUnExpCode_" + countRow + "' value='" + Addlitem.Expense_Type_Code + "' /> </td>");
                addlExpStr.Append("<td id='unExpAmt_" + countRow + "'>" + Addlitem.Expense_Amount + "</td>");
                addlExpStr.Append("<td>" + Addlitem.Bill_Number + "<input type='hidden' id='hdnUnExpRef_" + countRow + "' value='" + Addlitem.Bill_Number + "' /></td>");
                addlExpStr.Append("<td>" + Addlitem.Remarks_By_User + "<input type='hidden' id='hdnUnExpRemUsr_" + countRow + "' value='" + Addlitem.Remarks_By_User + "'/> </td>");
                //addlExpStr.Append("<td id='unExpRef_" + countRow + "'>" + Addlitem.Bill_Number + "</td>");
                //addlExpStr.Append("<td id='unExpRemUsr_" + countRow + "'>" + Addlitem.Remarks_By_User + "</td>");
                addlExpStr.Append("<td id='ExpUndo_" + countRow + "'><a style='cursor:pointer;' onclick='FnAddExpense(" + countRow + ")'><i class='fa fa-undo'  style='font-size:18px;color:green;'></i></a></td>");
                addlExpStr.Append("</tr>");
                countRow = countRow + 1;

    }
            addlExpStr.Append("</tbody>");
            addlExpStr.Append("</table></div>");

            if (lstExpenseActivityModel != null && lstExpenseActivityModel.Count > 0)
            {
                expenseDCRActivityModel = lstExpenseActivityModel[0];
            }


            double NonEnteredDays = 0;



            StringBuilder sbTbl = new StringBuilder();
            StringBuilder sbTblExpense = new StringBuilder();
            double expenseamount = 0.00;

            DateTime startDate = new DateTime(year, month, 1);
            DateTime endDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            List<MVCModels.ExpenseCalimHolidayList> expenseClaimHolidayList = GetExpenseClaimHolidayList(companyCode, userCode,
                                                    startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));
            List<MVCModels.ExpenseWeekendList> expenseWeekendList = GetExpenseClaimWeekendList(companyCode, userCode, startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));

            List<MVCModels.ExpenseClaimLockLeaveDetails> expenseLockLeaveList = GetExpenseClaimLockLeavelist(companyCode, userCode, startDate.ToString(DBDateFormat), endDate.ToString(DBDateFormat));
            expenseDCRActivityModel.Holiday_Count = expenseClaimHolidayList != null ? expenseClaimHolidayList.Count : 0;
            expenseDCRActivityModel.WeekEnd_Count = expenseWeekendList != null ? expenseWeekendList.Count : 0;

            NonEnteredDays = expenseDCRActivityModel.Totaldays - (expenseDCRActivityModel.WeekEnd_Count + expenseDCRActivityModel.Holiday_Count + expenseDCRActivityModel.Leave_CountWithOutLOP + expenseDCRActivityModel.Field_Count + expenseDCRActivityModel.Attendance_Count);
            sbTbl.Append("<div class='col-lg-12' style='font-weight: bold;padding-left: 0px;'>Showing Expense details of <span id='spnfavouringUser'></span></div>");
            if (lsstDCRUserExpense != null && lsstDCRUserExpense.Count() > 0)
            {
                sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblExpenseEntry' cellspacing='0' cellpadding='0'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>DCR Date</th>");
                sbTbl.Append("<th>Flag</th>");
                sbTbl.Append("<th>Category</th>");
                sbTbl.Append("<th>Expense Type</th>");
                sbTbl.Append("<th>Expense Amount</th>");
                sbTbl.Append("<th>Dcr Status</th>");
                sbTbl.Append("<th>Reason</th>");
                sbTbl.Append("<th>DCR Remarks</th>");
                sbTbl.Append("<th>Reference Details</th>");
                sbTbl.Append("<th>Remarks</th>");
                sbTbl.Append("</tr>");
                sbTbl.Append("</thead>");
                sbTbl.Append("<tbody>");
                int i = 0;

                foreach (DateTime day in EachDay(startDate, endDate))
                {
                    List<MVCModels.DCRUserExpenseDetails> lstDCRApprovedExpensedetails = lsstDCRUserExpense.Where(s => s.DCR_Actual_Date == day.ToString(DBDateFormat)).ToList();
                    List<MVCModels.ExpenseWeekendList> lstExpenseWeekend = expenseWeekendList.Where(W => W.Date == day.ToString(DBDateFormat)).ToList();
                    List<MVCModels.ExpenseCalimHolidayList> lstExpenseClaimHoliday = expenseClaimHolidayList.Where(H => H.Holiday_Date == day.ToString(DBDateFormat)).ToList();
                    List<MVCModels.ExpenseClaimLockLeaveDetails> lstExpClaimLockLeaveList = expenseLockLeaveList.Where(Lock => Lock.DCR_Actual_Date == day.ToString(DBDateFormat)).ToList();
                    #region - Approved expense
                    if (lstDCRApprovedExpensedetails != null && lstDCRApprovedExpensedetails.Count > 0)
                    {
                        foreach (MVCModels.DCRUserExpenseDetails dcrExpense in lstDCRApprovedExpensedetails)
                        {
                            string rowColor = "cls_approve_even";
                            string idprefix = "trApprove_" + i.ToString();
                            string dcrStatus = "Approved";
                            if (i % 2 != 0)
                            {
                                rowColor = "cls_approve_odd";//approve odd color.
                            }
                            if (dcrExpense.DCR_Status == DCR_APPLIED)
                            {
                                rowColor = "clsApplied";
                                idprefix = "trApplied_" + i.ToString();
                                dcrStatus = "Applied";
                            }
                            else if (dcrExpense.DCR_Status == DCR_UNAPPROVED)
                            {
                                rowColor = "clsUnapprove";
                                idprefix = "trUnapprove_" + i.ToString();
                                dcrStatus = "UnApproved";
                            }
                            else if (dcrExpense.DCR_Status == DCR_DRAFT)
                            {
                                rowColor = "clsDraft";
                                idprefix = "trDraft_" + i.ToString();
                                dcrStatus = "Draft";
                            }
                            sbTbl.Append("<tr id='" + idprefix + "' class='" + rowColor + "'>");
                            sbTbl.Append("<td>" + dcrExpense.DCR_Date + "</td>");
                            sbTbl.Append("<td>" + ((dcrExpense.DCR_Flag == "F") ? "Field" : dcrExpense.DCR_Flag == "A" ? "Attendance" : "Leave") + "</td>");
                            sbTbl.Append("<td>" + dcrExpense.Category + "</td>");
                            sbTbl.Append("<td id='tdExpTypeName_" + i.ToString() + "'>" + dcrExpense.Expense_Type_Name + "</td>");
                            sbTbl.Append("<td id='tdExpAmount_" + i.ToString() + "' >" + dcrExpense.Expense_Amount + "</td>");
                            sbTbl.Append("<td>" + dcrStatus + "</td>");
                            sbTbl.Append("<td></td>");
                            sbTbl.Append("<td>" + dcrExpense.DCR_Expense_Remarks + "</td>");
                            if (dcrExpense.DCR_Status == DCR_APPROVED)
                            {
                                if (dcrExpense.DCR_Flag != "L")
                                {
                                    string dcrDate = dcrExpense.DCR_Date.Split('/')[2] + "-" + dcrExpense.DCR_Date.Split('/')[1] + "-" + dcrExpense.DCR_Date.Split('/')[0];
                                    sbTbl.Append("<input type='hidden' value='"
                                        + dcrExpense.DCR_Expense_Code + "_" + dcrDate + "_" + dcrExpense.DCR_Flag + "_" + dcrExpense.Expense_Type_Code + "_" + dcrExpense.Expense_Amount + "' id='chkExp_"
                                        + i.ToString() + "'  Exp_Code='" + dcrExpense.Expense_Type_Name + "'/></td>");
                                    expenseamount += dcrExpense.Expense_Amount;
                                }
                                else
                                {
                                    sbTbl.Append("<input type='hidden' value='' id='chkExp_" + i.ToString() + "'/></td>");
                                }


                                sbTbl.Append("<td><input type='text' id='txtBillNumber_" + i.ToString() + "' class='input-large form-control' /></td>");
                                sbTbl.Append("<td><textarea id='txtUserRemarks_" + i.ToString() + "' class='form-control'></textarea></td>");
                            }
                            else
                            {
                                sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                                sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                            }
                            sbTbl.Append("</tr>");
                            i++;

                            //var lstDistReq = lstClaimHeader.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();
                            if (dcrExpense.DCR_Status == DCR_APPROVED)
                            {
                                //double totalExpense = 0;

                                //var lstDistExpense = lstDCRApprovedExpensedetails.Select(x => new { x.Expense_Type_Code, x.Expense_Type_Name }).Distinct().ToList();

                                // sbTbl.Append("<input type='hidden' id='hdnmonthExpense' value='" + expenseamount + "'/>");

                                //sbTblExpense.Append("<div id='ExpenseTypeName' style='font-weight: bold;padding-left: 0px;'>");
                                //sbTblExpense.Append("<table class='table table-striped' id='tblExpenseEntry' cellspacing='0' cellpadding='0'>");
                                //sbTblExpense.Append("<thead>");
                                //sbTblExpense.Append("<tr>");
                                //sbTblExpense.Append("<th>Expense Type Name</th>");
                                //sbTblExpense.Append("<th>Amount</th>");
                                //sbTblExpense.Append("</tr>");
                                //sbTblExpense.Append("</thead>");
                                //sbTblExpense.Append("<tbody>");
                                //for (int e = 0; e < lstDistExpense.Count; e++)
                                //{
                                //    sbTblExpense.Append("<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>");
                                //    sbTblExpense.Append("<td>" + lstDistExpense[e].Expense_Type_Name + "</td>");
                                //    var expenseTotal = 0.0;
                                //    for (int j = 0; j < lstDCRApprovedExpensedetails.Count; j++)
                                //    {
                                //        if (lstDistExpense[e].Expense_Type_Code == lstDCRApprovedExpensedetails[j].Expense_Type_Code)
                                //        {
                                //            expenseTotal += lstDCRApprovedExpensedetails[j].Expense_Amount;
                                //        }
                                //    }
                                //    sbTblExpense.Append("<td>" + expenseTotal + "</td>");
                                //    sbTblExpense.Append("</tbody>");
                                //}
                                //sbTblExpense.Append("</table><div style='clear: both;'></div>");
                            }
                        }
                    }
                    if (lstExpenseWeekend != null && lstExpenseWeekend.Count > 0)
                    {
                        MVCModels.ExpenseWeekendList expenseWeekEnd = lstExpenseWeekend[0];
                        sbTbl.Append("<tr id='trWeekEnd' class='clsWeekEnd'>");
                        sbTbl.Append("<td>" + expenseWeekEnd.DisplayDate + "</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td>WeekEnd</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                        sbTbl.Append("</tr>");
                    }
                    if (lstExpenseClaimHoliday != null && lstExpenseClaimHoliday.Count > 0)
                    {
                        MVCModels.ExpenseCalimHolidayList expenseClaimHoliday = lstExpenseClaimHoliday[0];
                        sbTbl.Append("<tr id='trHoliday' class='clsHoliday'>");
                        sbTbl.Append("<td>" + expenseClaimHoliday.Holiday_Date_Display + "</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td>Holiday</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                        sbTbl.Append("</tr>");
                    }
                    if (lstExpClaimLockLeaveList != null && lstExpClaimLockLeaveList.Count > 0)
                    {
                        MVCModels.ExpenseClaimLockLeaveDetails expenseClaimLockLeave = lstExpClaimLockLeaveList[0];
                        sbTbl.Append("<tr id='trHoliday' class='clsLockLeave'>");
                        sbTbl.Append("<td>" + expenseClaimLockLeave.DCR_Actual_Date_Display + "</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td>" + expenseClaimLockLeave.Reason_Name + "</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                        sbTbl.Append("</tr>");
                    }
                    if ((lstExpenseClaimHoliday == null || lstExpenseClaimHoliday.Count == 0) && (lstExpenseWeekend == null || lstExpenseWeekend.Count == 0) &&
                        (lstExpenseWeekend == null || lstExpenseWeekend.Count == 0) && (lstExpClaimLockLeaveList == null || lstExpClaimLockLeaveList.Count == 0) &&
                       (lstDCRApprovedExpensedetails == null || lstDCRApprovedExpensedetails.Count == 0))
                    {
                        sbTbl.Append("<tr id='trHoliday' class='clsblank'>");
                        sbTbl.Append("<td>" + day.ToString("dd/MM/yyyy") + "</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>N/A</td>");
                        sbTbl.Append("<td>DCR Pending</td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                        sbTbl.Append("</tr>");
                    }
                    #endregion - Approved expense
                    //#region - Applied expense
                    //if (lstDCRAppliedExpenseDeatils != null && lstDCRAppliedExpenseDeatils.Count > 0)
                    //{
                    //    foreach (var dcr in lstDCRAppliedExpenseDeatils)
                    //    {
                    //        sbTbl.Append("<tr id='trApplied_' class='clsApplied'>");
                    //        sbTbl.Append("<td>" + dcr.DCR_Date + "</td>");
                    //        sbTbl.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Type_Name + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Amount + "</td>");
                    //        sbTbl.Append("<td>Applied</td>");
                    //        sbTbl.Append("<td></td>");
                    //        string dcrDate = dcr.DCR_Date.Split('/')[2] + "-" + dcr.DCR_Date.Split('/')[1] + "-" + dcr.DCR_Date.Split('/')[0];
                    //        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                    //        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                    //        sbTbl.Append("</tr>");

                    //    }
                    //}
                    //#endregion - Applied expense
                    //#region - Unapprove expense
                    //if (lstDCRUnspprovedandDraftdetails != null && lstDCRUnspprovedandDraftdetails.Count > 0)
                    //{
                    //    foreach (var dcr in lstDCRUnspprovedandDraftdetails)
                    //    {
                    //        sbTbl.Append("<tr id='trUnapprove_' class='clsUnapprove'>");
                    //        sbTbl.Append("<td>" + dcr.DCR_Date + "</td>");
                    //        sbTbl.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Type_Name + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Amount + "</td>");
                    //        sbTbl.Append("<td>UnApproved</td>");
                    //        sbTbl.Append("<td></td>");
                    //        string dcrDate = dcr.DCR_Date.Split('/')[2] + "-" + dcr.DCR_Date.Split('/')[1] + "-" + dcr.DCR_Date.Split('/')[0];
                    //        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                    //        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                    //        sbTbl.Append("</tr>");
                    //    }
                    //}
                    //#endregion - Unapprove expense
                    //#region - draft expense
                    //if (lstDcrDraftedDetails != null && lstDcrDraftedDetails.Count > 0)
                    //{
                    //    foreach (var dcr in lstDcrDraftedDetails)
                    //    {
                    //        sbTbl.Append("<tr id='trDraft_' class='clsDraft'>");
                    //        sbTbl.Append("<td>" + dcr.DCR_Date + "</td>");
                    //        sbTbl.Append("<td>" + ((dcr.DCR_Flag == "F") ? "Field" : "Attendance") + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Type_Name + "</td>");
                    //        sbTbl.Append("<td>" + dcr.Expense_Amount + "</td>");
                    //        sbTbl.Append("<td>Draft</td>");
                    //        sbTbl.Append("<td></td>");
                    //        string dcrDate = dcr.DCR_Date.Split('/')[2] + "-" + dcr.DCR_Date.Split('/')[1] + "-" + dcr.DCR_Date.Split('/')[0];
                    //        sbTbl.Append("<td><input type='text' readonly='true' class='input-large form-control' /></td>");
                    //        sbTbl.Append("<td><textarea readonly='true' class='form-control'></textarea></td>");
                    //        sbTbl.Append("</tr>");
                    //    }
                    //}
                    //#endregion -  draft expense
                    //sbTbl.Append("</tbody>");
                    //sbTbl.Append("</table></div><div style='clear: both;'></div>");

                }

            }
            else
            {
                sbTbl.Append("<div class='col-lg-12'>No Expense Details are available for this Month.</div><div style='clear: both;'></div>");
            }


            sbTbl.Append("<input type='hidden' id='hdnmonthExpense' value='" + expenseamount + "'/>");
            sbTbl.Append("<input type='hidden' id='hdnNonEnteredDays' value='" + NonEnteredDays + "'/>");

            List<MVCModels.DCRUserExpenseDetails> lstDCRApprovedExpenseTypes = lsstDCRUserExpense.Where(s => s.DCR_Status == DCR_APPROVED).ToList();
            var lstDistExpense = lstDCRApprovedExpenseTypes.Select(x => new { x.Expense_Type_Code, x.Expense_Type_Name }).Distinct().ToList();

            sbTblExpense.Append("<div id='ExpenseTypeName' style='font-weight: bold;padding-left: 0px;'>");
            sbTblExpense.Append("<table class='table table-striped' id='tbltotalExpenseEntry' cellspacing='0' cellpadding='0'>");
            sbTblExpense.Append("<thead>");
            sbTblExpense.Append("<tr>");
            sbTblExpense.Append("<th>Expense Type Name</th>");
            sbTblExpense.Append("<th>Amount</th>");
            sbTblExpense.Append("</tr>");
            sbTblExpense.Append("</thead>");
            sbTblExpense.Append("<tbody class='TotalExpenseCls'>");
            for (int e = 0; e < lstDistExpense.Count; e++)
            {
                if (lstDistExpense[e].Expense_Type_Name != null && lstDistExpense[e].Expense_Type_Name != "")// There is leave mode , expense type not in thelist.
                {
                    sbTblExpense.Append("<tr id='trApproveExpTypeTotal' class='clsApprExpTypeTotal'>");
                    sbTblExpense.Append("<td id='TotalExpName_" + e + "'>" + lstDistExpense[e].Expense_Type_Name + "</td>");
                    var expenseTotal = 0.0;
                    for (int j = 0; j < lstDCRApprovedExpenseTypes.Count; j++)
                    {
                        if (lstDistExpense[e].Expense_Type_Code == lstDCRApprovedExpenseTypes[j].Expense_Type_Code)
                        {
                            expenseTotal += lstDCRApprovedExpenseTypes[j].Expense_Amount;
                        }
                    }
                    sbTblExpense.Append("<td id='TotalExpAmt_" + e + "'>" + expenseTotal + "</td>");
                }
            }
            sbTblExpense.Append("</tbody>");

            sbTblExpense.Append("</table><div style='clear: both;'></div>");

            return sbTbl.ToString() + "$" + sbTblExpense.ToString() + "$" + addlExpStr.ToString();
        }

        public List<MVCModels.AddlExpenseDetails> GetAddlDcrExpDetforMonthwise(string userCode, int month, int year)
        {
            return _objExp.GetAddlDcrExpDetforMonthwise(userCode, month, year);
        }
        public List<MVCModels.AddlExpenseDetails> GetAddlDcrExpDet(string userCode, string Dcr_From, string Dcr_To)
        {
            return _objExp.GetAddlDcrExpDet(userCode, Dcr_From, Dcr_To);
        }
        /// <summary>
        /// Get Expense claim approval popup
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="claimCode"></param>
        /// <param name="userCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<MVCModels.ExpenseClaimApprovalModel> GetExpenseClaimApproval(string companyCode, string claimCode, string userCode, int month, int year)
        {
            return _objExp.GetExpenseClaimApproval(companyCode, claimCode, userCode, month, year);
        }


        public List<MVCModels.CRMPaymentDetails> GetCRMPaymentDetails(string companyCode, string claimCode)
        {
            return _objExp.GetCRMPaymentDetails(companyCode, claimCode);
        }
        public List<MVCModels.ExpenseCalimHolidayList> GetExpenseClaimHolidayList(string companyCode, string userCode, string startDate, string endDate)
        {
            return _objExp.GetExpenseClaimHolidayList(companyCode, userCode,
                                                   startDate, endDate);
        }
        public List<MVCModels.ExpenseWeekendList> GetExpenseClaimWeekendList(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.ExpenseWeekendList> expenseWeekendList = _objExp.GetExpenseClaimWeekendList(companyCode, userCode,
                                                    startDate, endDate);
            return expenseWeekendList;
        }

        public List<MVCModels.ExpenseClaimLockLeaveDetails> GetExpenseClaimLockLeavelist(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.ExpenseClaimLockLeaveDetails> expenseLockLeaveList = _objExp.GetExpenseClaimLockLeavelist(companyCode, userCode,
                                                    startDate, endDate);
            return expenseLockLeaveList;
        }

        public List<MVCModels.ExpenseActivityModel> GetDCRActivityCounts(string companyCode, string userCode, int month, int year)
        {
            List<MVCModels.ExpenseActivityModel> lstExpenseActivity = _objExp.GetDCRActivityCounts(companyCode, userCode, month, year);
            return lstExpenseActivity;
        }

        public IEnumerable<DateTime> EachDay(DateTime from, DateTime to)
        {
            for (var day = from.Date; day.Date <= to.Date; day = day.AddDays(1))
                yield return day;
        }
        public List<MVCModels.HiDoctor_Reports.DCRHOPPlace> GetGetTpDetails(string usercode, string companyCode, string dcrDate)
        {
            return _objExp.GetGetTpDetails(usercode, companyCode, DateTime.ParseExact(dcrDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture));
        }

        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDCRDetails> GetDCRDetails(string DCR_Code, string companyCode)
        {
            return _objExp.GetDCRDetails(DCR_Code, companyCode);
        }

        public void GetSaveUploadImage(string claimCode, List<string> Img)
        {
            if (Img.Count >= 0)
            {
                _objExp.GetSaveUploadImage(claimCode, Img);
            }

        }

        public List<MVCModels.ExpenseClaimImageUpload> GetDetailsUploadImage(string claimCode)
        {
            return _objExp.GetDetailsUploadImage(claimCode);
        }
        public void GetDeleteUploadImage(int ID)
        {
            _objExp.GetDeleteUploadImage(ID);

        }

        public string GetConfitValueForSize(string companyCode)
        {
            return _objExp.GetConfitValueForSize(companyCode);
        }
        #endregion - Expense claim MOnth wise

        public string GetExpClaimSearch(string CompanyCode, string UserCode, string LoggedUser, string selectedUserCode, string UserName, int ExpMonth, int ExpYear,string Type)
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                StringBuilder strDetail = new StringBuilder();
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaim;
                List<MVCModels.ExpenseClaimHeaderModel> lstClaimHeader;
                IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaimDetails;
                List<MVCModels.CRMCycleMapping> lstCycleMapping;
                lstClaim = _objExp.GetExpClaimSearch(selectedUserCode, UserName, ExpMonth, ExpYear, Type);
                string[] DateFrom = { };
                string[] DateTo = { };
                var LoggedUserTypeName = string.Empty;
                //    var lstDistReq = lstClaimHeader.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();
                if (lstClaim != null && lstClaim.Count() > 0)
                {
                    lstClaimHeader = lstClaim.Where(s => s.Detail_Claim_Code > 0).ToList();
                    lstClaimDetails = lstClaim.Where(S => S.Detail_Claim_Code == 0).ToList();
                    var lstDistReq = lstClaimHeader.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();

                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblExpenseClaimSummary' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>Edit</th>");
                    sbTbl.Append("<th>Details</th>");
                    sbTbl.Append("<th>Request Date</th>");
                    sbTbl.Append("<th>Request Id</th>");
                    sbTbl.Append("<th>Request Name</th>");
                    sbTbl.Append("<th>Status Name</th>");
                    sbTbl.Append("<th>Cycle Name</th>");
                    sbTbl.Append("<th>Date From</th>");
                    sbTbl.Append("<th>Date To</th>");
                    sbTbl.Append("<th>Favouring User</th>");
                    sbTbl.Append("<th>Actual Amount</th>");
                    sbTbl.Append("<th>Approved Amount</th>");
                    sbTbl.Append("<th>User Remarks</th>");
                    //sbTbl.Append("<th>Print</th>"); // Print Header
                    //sbTbl.Append("<th>Admin Remarks</th>");
                    sbTbl.Append("<th>Download Attachments</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody id='ExpBody'>");

                    foreach (var req in lstDistReq)
                    {
                        var lstDist = lstClaimHeader.AsEnumerable().Where(x => x.Request_Code == req.Request_Code).ToList();
                        if (lstDist != null && lstDist.Count() > 0)
                        {


                            sbTbl.Append("<tr><th class='collapseHeader' colspan='12' onclick='fnExpenseClaimSummaryHide(\"dv_" + req.Request_Code + "\",\"spn_" + req.Request_Code + "\")'>");
                            sbTbl.Append("<span class='expandDFC' id='spn_" + req.Request_Code + "' style='padding: 15px;'>" + req.Request_Name + "<span style='font-size: 11px; font-style: italic'>(Click to Expand/Collapse!)</span></span>");
                            sbTbl.Append("</th></tr>");
                            int rowno = 0;

                            //foreach (var item in lstDist)
                            for (int i = 0; i < lstDist.Count(); i++)
                            {

                                lstCycleMapping = _objExp.GetCRMCycleMapping(CompanyCode, lstDist[i].User_Code).ToList();

                                //        //var lstProduct = lstStock.Select(p => p.Base_Code).Distinct().ToList();
                                //var disCycleMapping = lstCycleMapping.Select(p => p.User_Code).Distinct().ToList();
                                selectedUserCode = selectedUserCode == "null" ? UserCode : selectedUserCode;
                                LoggedUserTypeName = _objExp.GetUserTypeName(selectedUserCode);

                                bool isEdit = false;
                                string statusCycleMapping = "NO";

                                if (lstDist[i].Move_Order != "")
                                {
                                    lstDist[i].Move_Order = lstDist[i].Move_Order.TrimEnd(',');
                                    foreach (string moveOrder in lstDist[i].Move_Order.Split(','))
                                    {

                                        if (moveOrder == "1") // if move order applied status
                                        {
                                            statusCycleMapping = CheckStatusCycleMapping(CompanyCode, lstDist[i].Cylce_Code, 1, lstDist[i].Favouring_User_Code);
                                            if (statusCycleMapping != "NO")
                                            {
                                                if (lstDist[i].User_Code == UserCode)
                                                {
                                                    isEdit = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                                sbTbl.Append("<tr class='dv_" + req.Request_Code + "'>");
                                if (isEdit)
                                {

                                    if (lstDist[i].Request_Name.ToString().ToUpper() == "CRM REQUEST")
                                    {
                                        sbTbl.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + "" + "\",\"" + "" + "\",\"" + "" + "\");'>Edit</td>");
                                    }
                                    else
                                    {
                                        sbTbl.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + lstDist[i].Expense_Claim_Screen_Mode + "\",\"" + lstDist[i].Status_Code + "\",\"" + lstDist[i].Favouring_User_Code + "\");'>Edit</td>");
                                    }
                                    // sbTbl.Append("<td class='td-a'></td>");

                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                }

                                sbTbl.Append("<td class='td-a' onclick='fnExpenseClaimDetailPopUp(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Code + "\",\"" + lstDist[i].User_Code + "\");'>Details</td>");

                                sbTbl.Append("<td>" + lstDist[i].Entered_DateTime + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Claim_Code + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Request_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Status_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Cycle_Name + "</td>");
                                if (lstDist[i].Request_Entity == "Region Wise")
                                {
                                    sbTbl.Append("<td>" + lstDist[i].Date_From + "</td>");
                                    sbTbl.Append("<td>" + lstDist[i].Date_To + "</td>");
                                    DateFrom = lstDist[i].Date_From.Split('/');
                                    DateTo = lstDist[i].Date_To.Split('/');
                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                    sbTbl.Append("<td></td>");
                                }
                                sbTbl.Append("<td class='FavUser'>" + lstDist[i].User_Name + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Actual_Amount.ToString() + "</td>");
                                sbTbl.Append("<td>" + lstDist[i].Approved_Amount.ToString() + "</td>");
                                sbTbl.Append("<td class='expRem'  title='" + lstDist[i].Remarks_By_User + "'>" + lstDist[i].Remarks_By_User + "</td>");

                                //Print Option removed.(06-03-2020)
                                //if (lstDist[i].Request_Entity == "Region Wise")
                                //{
                                //    if (lstCycleMapping.Count > 0)
                                //    {
                                //        List<MVCModels.CRMCycleMapping> lstcycle = new List<MVCModels.CRMCycleMapping>();
                                //        lstcycle = lstCycleMapping.AsEnumerable().Where(x => x.User_Code == lstDist[i].User_Code && x.Status_Code == lstDist[i].Status_Code).ToList();
                                //        if (lstcycle.Count > 0)
                                //        {
                                //            sbTbl.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpensePrint(\"" + lstDist[i].Favouring_User_Code + "\",\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Date_From + "\",\"" + lstDist[i].Date_To + "\",\"" + lstDist[i].Status_Name + "\");'>Print</a></div></td>");
                                //        }
                                //        else
                                //        {
                                //            sbTbl.Append("<td></td>");
                                //        }
                                //    }
                                //    else
                                //    {
                                //        sbTbl.Append("<td></td>");
                                //    }
                                //}
                                //else
                                //{
                                //    sbTbl.Append("<td></td>");
                                //}

                                // Download Image Path
                                if (lstDist[i].ImgPath != null && lstDist[i].ImgPath != "")
                                {
                                    sbTbl.Append("<td><div id='dvPrint' style='cursor: pointer;color: blue;' onclick='fnExpenseDownloadImage(\"" + lstDist[i].ImgPath + "\");'>Download Attachment</div></td>");
                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                }

                                sbTbl.Append("</tr>");
                            }




                        }
                    }
                    if (lstClaimDetails != null && lstClaimDetails.Count() > 0)
                    {
                        var lstDistReqfordetails = lstClaimDetails.Select(x => new { x.Request_Code, x.Request_Name }).Distinct().ToList();

                        foreach (var req in lstDistReqfordetails)
                        {
                            var lstDist = lstClaimDetails.AsEnumerable().Where(x => x.Request_Code == req.Request_Code);
                            if (lstDist != null && lstDist.Count() > 0)
                            {
                                strDetail.Append("<tr><th class='collapseHeader' colspan='14' onclick='fnExpenseClaimSummaryHide(\"dv_" + req.Request_Code + "\",\"spn_" + req.Request_Code + "\")'>");
                                strDetail.Append("<span class='expandDFC' id='spn_" + req.Request_Code + "' style='padding: 15px;font-weight:bold;'>" + req.Request_Name + " <span style='font-size: 11px; font-style: italic;font-weight:bold;'>Empty Coulms(Click to Expand/Collapse!)</span></span>");
                                strDetail.Append("</th></tr>");

                                if (lstDist.Count() > 0)
                                {
                                    foreach (var item in lstDist)
                                    {
                                        bool isEdit = false;
                                        string statusCycleMapping = "NO";

                                        if (item.Move_Order != "")
                                        {
                                            item.Move_Order = item.Move_Order.TrimEnd(',');
                                            foreach (string moveOrder in item.Move_Order.Split(','))
                                            {
                                                if (moveOrder == "1") // if move order applied status
                                                {
                                                    statusCycleMapping = CheckStatusCycleMapping(CompanyCode, item.Cylce_Code, 1, item.Favouring_User_Code);
                                                    if (statusCycleMapping != "NO")
                                                    {
                                                        if (item.User_Code == UserCode)
                                                        {
                                                            isEdit = true;
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        strDetail.Append("<tr class='dv_" + req.Request_Code + "' id='trtest' value='ESS'>");
                                        if (isEdit)
                                        {
                                            //onclick="fnEditExpenseClaim(\"" + lstDist[i].Claim_Code + "\",\"" + lstDist[i].Request_Name + "\",\"" + lstDist[i].Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + lstDist[i].Expense_Claim_Screen_Mode + "\",\"" + lstDist[i].Request_Entity + "\",\"" + lstDist[i].Status_Code + "\")'>Edit</td>"
                                            strDetail.Append("<td class='td-a' onclick='fnEditExpenseClaim(\"" + item.Claim_Code + "\",\"" + item.Request_Name + "\",\"" + item.Cylce_Code + "\",\"" + req.Request_Code + "\",\"" + item.Expense_Claim_Screen_Mode + "\",\"" + item.Status_Code + "\",\"" + item.Favouring_User_Code + "\");'>Edit</td>");
                                            strDetail.Append("<td class='td-a' onclick='fnDeleteClaim(\"" + item.Claim_Code + "\",\"" + item.Request_Code + "\",\"" + item.User_Code + "\");'>Delete</td>");
                                        }
                                        else
                                        {
                                            strDetail.Append("<td></td><td></td>");
                                        }


                                        strDetail.Append("<td>" + item.Entered_DateTime + "</td>"); //Request Date
                                        strDetail.Append("<td>" + item.Claim_Code + "</td>");//Request id
                                        strDetail.Append("<td>" + item.Request_Name + "</td>");// Request Name
                                        strDetail.Append("<td>" + item.Status_Name + "</td>");//status Name
                                        strDetail.Append("<td>" + item.Cycle_Name + "</td>");//cycle name
                                        if (item.Request_Entity == "Region Wise")
                                        {
                                            strDetail.Append("<td>" + item.Date_From + "</td>");
                                            strDetail.Append("<td>" + item.Date_To + "</td>");
                                            DateFrom = item.Date_From.Split('/');
                                            DateTo = item.Date_To.Split('/');
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td></td>");
                                            sbTbl.Append("<td></td>");
                                        }
                                        strDetail.Append("<td>" + item.User_Name + "</td>");//Favouring user
                                        strDetail.Append("<td>" + item.Actual_Amount.ToString() + "</td>");//Actual amount
                                        strDetail.Append("<td>" + item.Approved_Amount.ToString() + "</td>");//approved amount
                                        strDetail.Append("<td class='expRem'  title='" + item.Remarks_By_User + "'>" + item.Remarks_By_User + "</td>");//user remarks



                                        strDetail.Append("</tr>");

                                    }
                                }

                            }
                        }
                    }
                    if (strDetail.Length > 0)
                    {
                        sbTbl.Append(strDetail);
                    }
                    sbTbl.Append("</tbody>");
                    sbTbl.Append("</table></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>Dear " + LoggedUser + ", You do not have any Expense Claim details.</div><div style='clear: both;'></div>");
                }
                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }
        #region Additional Expense
        public string ValidateDcrExp(string CompanyCode, string favouringUser, string detailString)
        {
            List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail = new List<MVCModels.ExpenseClaimDetailsModel>();
            if (detailString != "")
            {
                string[] arExp = detailString.Split('$');
                if (arExp.Length > 1)
                {
                    int RowNumber = 0;
                    foreach (var fieldExp in arExp)
                    {
                        if (fieldExp != "")
                        {
                            RowNumber = RowNumber + 1;
                            MVCModels.ExpenseClaimDetailsModel objFieldExp = new MVCModels.ExpenseClaimDetailsModel();
                            //dcr expense code^dcrDate^dcr flag^expense type code^expense Amount^bill number^user remarks 
                            objFieldExp.S_No = RowNumber;
                            objFieldExp.DCR_Actual_Date = fieldExp.Split('^')[1];
                            objFieldExp.DCRExpense_Activity_Flag = fieldExp.Split('^')[2];
                            objFieldExp.Expense_Type_Code = fieldExp.Split('^')[3];
                            objFieldExp.Expense_Amount = Convert.ToDouble(fieldExp.Split('^')[4]);
                            lstClaimDetail.Add(objFieldExp);
                        }
                    }
                }
            }
            return _objExp.ValidateDcrExp(CompanyCode, lstClaimDetail, favouringUser);
        }
        public string ValidateExpenses(string userCode, string DcrDate, string DcrFlag, string DcrCat, string DcrExp, string DcrExpCode, string DcrAmt)
        {
            return _objExp.ValidateExpenses(userCode, DcrDate, DcrFlag, DcrCat, DcrExp, DcrExpCode, DcrAmt);
        }
        public int DeleteDailyExpEdit(string userCode, string ClaimDet)
        {
            return _objExp.DeleteDailyExpEdit(userCode, ClaimDet);
        }
        #endregion

        public string GetDistanceTravelled(string companyCode, string dcrDateSFC, string DCR_Code)
        {
            return _objExp.GetDistanceTravelled(companyCode, dcrDateSFC, DCR_Code);
        }
        public List<MVCModels.ExpenseActivity> GetExpenseTypeDetails()
        {
            return _objExp.GetExpenseTypeDetails();
        }
        public List<MVCModels.ExpenseActivityType> GetExpenseActivitytype()
        {
            return _objExp.GetExpenseActivitytype();
        }
        public string InsertExpenseActivityMapping(string activity, string activitytype, string Expense, string UserCode, string CompanyCode, string startdate, string enddate, string UserTypeCode)
        {
            string result = "";
            System.Data.DataTable Expensetable = null;
            List<expensecode> obj = JsonConvert.DeserializeObject<List<expensecode>>(Expense).ToList();
            Expensetable = new DataTable();
            Expensetable.Columns.Add("Activity", typeof(string));
            Expensetable.Columns.Add("ActivityType", typeof(string));
            Expensetable.Columns.Add("ExpenseCode", typeof(string));
            Expensetable.Columns.Add("UserTypeCode", typeof(string));
            if (obj != null && obj.Count > 0)
            {
                for (int i = 0; i < obj.Count(); i++)
                {
                    Expensetable.Rows.Add(activity, activitytype, obj[i].code, UserTypeCode);

                }
            }
            result = _objExp.InsertExpenseActivityMapping(UserCode, CompanyCode, Expensetable, startdate, enddate, activity);
            return result;
        }
        public List<MVCModels.Details> Getallexpenseactivitymapping(string User_Code)
        {
            return _objExp.Getallexpenseactivitymapping(User_Code);
        }
        public int ChangeStatus(int id, string user_code)
        {
            return _objExp.ChangeStatus(id, user_code);
        }
        public List<UserExpenseTypeDetails> GetAdditionalExpense(string userCode, string DcrDate, string Flag)
        {
            return _objExp.GetAdditionalExpense(userCode, DcrDate, Flag);
        }
        public List<ExpenseUrl> fngetdcrExpenseUrl(string userCode, int month, int year, string Effective_from, string Effective_to)
        {
            return _objExp.fngetdcrExpenseUrl(userCode, month, year, Effective_from, Effective_to);
        }

    }


}
