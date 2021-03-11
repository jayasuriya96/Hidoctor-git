using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRApprovalController : Controller
    {
        //
        // GET: /DCRApproval/
        #region Private variales
        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.SPData objSP = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        #endregion

        string DOCTOR_CAPTION;
        string CHEMIST_CAPTION;
        string STOCKIEST_CAPTION;
        public string GetPrivillegeValue()
        {
            DOCTOR_CAPTION = _objCurrentInfo.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");

            if (DOCTOR_CAPTION.Length >= 21)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(20) + "...";

            }
            CHEMIST_CAPTION = _objCurrentInfo.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            if (CHEMIST_CAPTION.Length >= 21)
            {
                CHEMIST_CAPTION = CHEMIST_CAPTION.Remove(20) + "...";

            }
            STOCKIEST_CAPTION = _objCurrentInfo.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 21)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(20) + "...";

            }
            return DOCTOR_CAPTION;
        }

        public ActionResult Index(string Date, string UserName, string UserCode, string Flag, string RegionCode)
        {
            GetPrivillegeValue();
            string doctor_caption = DOCTOR_CAPTION;
            string chemist_caption = CHEMIST_CAPTION;
            string stockist_caption = STOCKIEST_CAPTION;
            ViewBag.doctor_caption = doctor_caption;
            ViewBag.chemist_caption = chemist_caption;
            ViewBag.stockist_caption = stockist_caption;
            ViewBag.CurrrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.DCRApproval = Date + "_" + UserName + "_" + UserCode + "_" + Flag + "_" + RegionCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
        }
        public JsonResult GetDCRAppliedUsers(FormCollection collection)
        {
            try
            {
                DataSet dsCategory = new DataSet();
                objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_mhdGetDCRAppliedUsers '" + _objCurrentInfo.GetCompanyCode() + "','" + _objCurrentInfo.GetUserCode() + "','" + collection["DCRActualMonth"].ToString() + "','" + collection["DCRActualYear"].ToString() + "','" + collection["Status"].ToString() + "','" + collection["Selection"].ToString() + "','" + collection["UserName"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsCategory), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetDCRDetails(string userCode, string DCRActualMonth, string DCRActualYear,string status)
        {
            try
            {
                DataSet ds = new DataSet();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                ds = objSP.GetDCRDetails(companyCode,userCode, DCRActualMonth, DCRActualYear,status);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public object GetUserInstantReport(FormCollection collection)
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();

                string dcrDate = collection["dcrActualDate"].ToString();
                string dcrCode = "DCR" + collection["username"].ToString() + dcrDate.Split('-')[2].Trim() + dcrDate.Split('-')[1].Trim() + dcrDate.Split('-')[0].Trim();
                DataSet dsDCRDetails = new DataSet();

                if (collection["flag"].ToString() == "F" || collection["flag"].ToString() == "A")
                {
                    dsDCRDetails = objSP.GetInstantReportDetails(companyCode, collection["usercode"].ToString(), collection["regioncode"].ToString(), collection["dcrActualDate"].ToString(), dcrCode, collection["flag"].ToString());
                }
                else
                {
                    objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    {
                        dsDCRDetails = objData.ExecuteDataSet("exec sp_hdGetDCRLeave '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "'");
                    }
                    objData.CloseConnection();
                }

                DataControl.JSONConverter jsonConvert = new DataControl.JSONConverter();
                return jsonConvert.Serialize(dsDCRDetails);
            }
            catch
            {
                throw;
            }

        }
        public JsonResult GetPrevNextDCRDate(FormCollection collection)
        {
            try
            {
                DataSet dsCategory = new DataSet();
                objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec sp_hdGetPrevNextDCRDate '" + _objCurrentInfo.GetCompanyCode() + "','" + collection["usercode"].ToString() + "','" + collection["Date"].ToString() + "','" + collection["Flag"].ToString() + "','" + collection["status"].ToString() + "','" + collection["Mode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsCategory), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public string ChangeStatus(FormCollection collection)
        {
            try
            {
                //Added DCR History details for Mobile
                BLApproval _objApproval = new BLApproval();
                DALApproval _objDALApproval = new DALApproval();
                string leaveEntry = collection["LeaveValidation"].ToString();
                string remarks = collection["Remarks"].ToString();
                string status = collection["Status"].ToString();
                string dcrCode = collection["DCRCode"].ToString();
                string flag = collection["Flag"].ToString();
                string leaveType = collection["LeaveTypeName"].ToString();
                string userCode = collection["UserCode"].ToString();
                string calcFields = collection["CalcFields"].ToString();
                string DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK = collection["DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK"].ToString();
                string dcr_Actual_Date = collection["DCR_Actual_Date"].ToString();
                string twoActivityExpenseValidation = collection["twoActivityExpenseValidation"].ToString();
                string fareDailyAllowance = collection["fareDailyAllowance"].ToString();

                string calcFieldStatus = calcFields.ToUpper() == "APPLIED" ? "1" : "2";


                string[] privValues;
                //   string leaveTypeName = "";
                //   bool isCurBalanceNeed = false;
                //   double dblLeaveBalance = 0.0;

                string dcrStatus;
                int CurrexpenseClaimValidation = 0;

                privValues = leaveEntry.Split(',');

                if (status == "0")
                {
                    if (string.IsNullOrEmpty(remarks))
                    {
                        return "FAIL:Reason must be given for unapproval";
                    }
                }

                if (twoActivityExpenseValidation.ToUpper() != "NO" && fareDailyAllowance != "" && flag != "L" && status == "0")
                {
                    string twoActivityDCRApproval = _objDALApproval.GetTwoActivityDCRApproval(dcrCode, flag, fareDailyAllowance);

                        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                        {
                            dcrStatus = (string)objData.ExecuteScalar("exec SP_hdGetDCRStatus '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "'");
                        }
                        if (dcrStatus == "2")
                        {
                           CurrexpenseClaimValidation = _objDALApproval.CheckExpenseClaim(_objCurrentInfo.GetCompanyCode(), userCode,dcrCode, flag, dcr_Actual_Date);
                            if (CurrexpenseClaimValidation > 0)
                            {
                                return "FAIL:You Cannot Unapprove the DCR-" + dcr_Actual_Date + "  " + ((flag == "F") ? "Field" : ((flag == "A") ? "Attendace" : "Leave")) + " as the expenses are claimed in expenses claim";
                            }
                            string expenseClaimValidation=_objDALApproval.CheckDayExpenseClaim(dcrCode,flag);
                            if (expenseClaimValidation != "")
                            {
                                return "FAIL:You Cannot Unapprove the other DCR-" + expenseClaimValidation.Split('|')[0] + "  " + ((expenseClaimValidation.Split('|')[1] == "F") ? "Field" : ((expenseClaimValidation.Split('|')[1] == "A") ? "Attendace" : "Leave")) + " as the expenses are claimed in expenses claim";
                            }
                        }
                    
                     if (twoActivityDCRApproval != "")
                    {

                       string TwoActivitydcrCode = twoActivityDCRApproval.Split('|')[0];
                        string TwoActivityflag = twoActivityDCRApproval.Split('|')[1];
                       string TwoActivitydcrStatusOld = twoActivityDCRApproval.Split('|')[2];
                        // dcrStatusOld = ((dcrStatusOld == "Applied") ? "1" : "0");
                       string TwoActivityoldReason = twoActivityDCRApproval.Split('|')[3];
                       string TwoActivityleaveTypeName = twoActivityDCRApproval.Split('|')[4];
                       string TwoActivitydcrDate = twoActivityDCRApproval.Split('|')[5];


                        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                        {
                            dcrStatus = (string)objData.ExecuteScalar("exec SP_hdGetDCRStatus '" + _objCurrentInfo.GetCompanyCode() + "','" + TwoActivitydcrCode + "','" + TwoActivityflag + "'");
                        }

                        if (dcrStatus == "1" || dcrStatus == "2") // Applied and Approved
                        {

                            objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                            {
                                objData.ExecuteNonQuery("exec SP_hdUpdateDCRApproval '" + _objCurrentInfo.GetCompanyCode() + "','" + TwoActivitydcrCode + "','" + TwoActivityflag + "','" + status + "','" + _objCurrentInfo.GetUserName() + "','" + DateTime.Now.ToString() + "','" + remarks + "','" + TwoActivitydcrStatusOld + "','" + userCode + "'");
                            }
                            int firstexpenseRowCount = 0;
                            firstexpenseRowCount = _objDALApproval.DeleteDCRExpense(TwoActivityflag, TwoActivitydcrCode, fareDailyAllowance);

                            if (DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK.ToUpper().Trim() == "ENABLED")
                            {
                                IDCRLock objDCRLock = new BLDCRLock();
                                List<DCRActivityLockModel> lstDCRActivityLockModel = new List<DCRActivityLockModel>();

                                DCRActivityLockModel dcrActivityLockModel = new DCRActivityLockModel();
                                string comany_Code = _objCurrentInfo.GetCompanyCode();
                                dcrActivityLockModel.User_Code = userCode;
                                dcrActivityLockModel.DCR_Actual_Date = dcr_Actual_Date;
                                dcrActivityLockModel.Activity_Flag = TwoActivityflag;
                                dcrActivityLockModel.Locked_Date = DateTime.Now.ToShortDateString();
                                lstDCRActivityLockModel.Add(dcrActivityLockModel);
                                int result = objDCRLock.InsertActivityLock(comany_Code, lstDCRActivityLockModel);
                               
                            }
                            int result_History = _objApproval.InsertDcrHistory(_objCurrentInfo.GetCompanyCode(), TwoActivitydcrCode, TwoActivityflag);
                        }
                        else
                        {
                            return "FAIL:You cannot change the status of Unapproved DCRs.";
                        }
                    }
                   
                }

                objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    dcrStatus = (string)objData.ExecuteScalar("exec SP_hdGetDCRStatus '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "'");
                }

                if (dcrStatus == "1" || dcrStatus == "2") // Applied and Approved
                {
                    //START: The Leave entry validation finctionality commented as per Customer Service Request.
                    //if (flag == "L")
                    // {
                    //leaveTypeName = leaveType;

                    //isCurBalanceNeed = false;

                    //for (int j = 0; j < privValues.Length; j++)
                    //{
                    //    if (privValues[j].ToString().Trim().ToUpper() == leaveTypeName.ToUpper())
                    //    {
                    //        isCurBalanceNeed = true;
                    //        break;
                    //    }
                    //}

                    //dblLeaveBalance = 0.0;

                    //if (isCurBalanceNeed)
                    //{
                    //    objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //    {
                    //        object leaveBal = objData.ExecuteScalar("exec SP_hdGetLeaveBalance '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + userCode + "'");
                    //        if (leaveBal.ToString() != "" && leaveBal != null)
                    //        {
                    //            if (!string.IsNullOrEmpty(leaveBal.ToString()))
                    //            {
                    //                dblLeaveBalance = float.Parse(leaveBal.ToString());
                    //            }
                    //        }
                    //    }

                    //    if (dblLeaveBalance > 0)
                    //    {
                    //        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //        {
                    //            objData.ExecuteNonQuery("exec SP_hdUpdateDCRApproval '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + status + "','" + _objCurrentInfo.GetUserName() + "','" + DateTime.Now.ToString() + "','" + remarks + "','" + calcFieldStatus + "','" + userCode + "'");
                    //        }
                    //        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //        {
                    //            objData.ExecuteNonQuery("exec SP_hdUpdateUserLeaveCurBalance '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + userCode + "','" + dcrStatus + "','" + status + "'");
                    //        }
                    //    }
                    //    else if (status == "0")
                    //    {
                    //        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //        {
                    //            objData.ExecuteNonQuery("exec SP_hdUpdateDCRApproval '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + status + "','" + _objCurrentInfo.GetUserName() + "','" + DateTime.Now.ToString() + "','" + remarks + "','" + calcFieldStatus + "','" + userCode + "'");
                    //        }

                    //        objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //        {
                    //            objData.ExecuteNonQuery("exec SP_hdUpdateUserLeaveCurBalance '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + userCode + "','" + dcrStatus + "','" + status + "'");
                    //        }
                    //    }
                    //    else
                    //    {
                    //        return "FAIL:Due to insufficient leave balance, unable to approve leave for " + leaveTypeName + "";
                    //    }
                    //}
                    //else
                    //{
                    //    objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    //  {
                    //    objData.ExecuteNonQuery("exec SP_hdUpdateDCRApproval '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + status + "','" + _objCurrentInfo.GetUserName() + "','" + DateTime.Now.ToString() + "','" + remarks + "','" + calcFieldStatus + "','" + userCode + "'");
                    //}
                    //}
                    //}
                    //END: The Leave entry validation finctionality commented as per Customer Service Request.

                    objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                    {
                        objData.ExecuteNonQuery("exec SP_hdUpdateDCRApproval '" + _objCurrentInfo.GetCompanyCode() + "','" + dcrCode + "','" + flag + "','" + status + "','" + _objCurrentInfo.GetUserName() + "','" + DateTime.Now.ToString() + "','" + remarks + "','" + calcFieldStatus + "','" + userCode + "'");
                    }
                    if (flag.ToUpper() != "L" && status == "0")
                    {
                        int secondexpenseRowCount = 0;
                        secondexpenseRowCount = _objDALApproval.DeleteDCRExpense(flag, dcrCode, fareDailyAllowance);
                    }

                    if (DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK.ToUpper().Trim() == "ENABLED")
                    {
                        IDCRLock objDCRLock = new BLDCRLock();
                        List<DCRActivityLockModel> lstDCRActivityLockModel = new List<DCRActivityLockModel>();

                        DCRActivityLockModel dcrActivityLockModel = new DCRActivityLockModel();
                        string comany_Code = _objCurrentInfo.GetCompanyCode();
                        dcrActivityLockModel.User_Code = userCode;
                        dcrActivityLockModel.DCR_Actual_Date = dcr_Actual_Date;
                        dcrActivityLockModel.Activity_Flag = flag;
                        dcrActivityLockModel.Locked_Date = DateTime.Now.ToShortDateString();
                        lstDCRActivityLockModel.Add(dcrActivityLockModel);
                        int result = objDCRLock.InsertActivityLock(comany_Code, lstDCRActivityLockModel);
                        if (result > 0)
                        {
                            return "SUCCESS:Status Changed Successfully. But Insert Activity Lock Fail.";
                        }
                    }
                    int result_History = _objApproval.InsertDcrHistory(_objCurrentInfo.GetCompanyCode(), dcrCode, flag);
                }
                else
                {
                    return "FAIL:You cannot change the status of Unapproved DCRs.";
                }

                return "SUCCESS:Status Changed Successfully";
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public string dcrapprovalMobilescreen()
        {
            string Url = string.Empty;
            Url = "../DCRApproval/Index";
            return Url;
        }
    }
}
