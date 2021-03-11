using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl.EnumType;
using System.Data;
using MVCModels;
using HDQueueService;
using System.Configuration;
using Newtonsoft.Json;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4StockiestExpenseController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
        private BL_KYD _objBLKYD = new BL_KYD();
        //private string _queueAccountKey = ConfigurationManager.AppSettings["ServiceBusConnection"].ToString();
        //private string _topicName = ConfigurationManager.AppSettings["busDCRTopicName"].ToString();
        //private string _subscriptionName = ConfigurationManager.AppSettings["busDCRSubscriptionName"].ToString();
        #endregion Private Variables

        public ActionResult Index(string dcrDate, string dcrStatus, string entity, string travelkm, string isRCPA, string flag, string actvity, string cpCode, string tpCode,string isThereAnyOneDoctorSavedA)
        {
            string[] viewArray = new string[6];
            string cvforPrefill = string.Empty;
            viewArray[0] = dcrDate;
            viewArray[1] = dcrStatus;
            viewArray[2] = entity;
            viewArray[3] = travelkm;
            viewArray[4] = _objCurr.GetDCRCode(dcrDate);
            viewArray[5] = flag;

            ViewBag.isrcpa = isRCPA;
            ViewBag.userCode = _objCurr.GetUserCode();
            ViewBag.activity = actvity;
            ViewBag.CPCode = cpCode;
            ViewBag.TPCode = tpCode;

            ViewBag.viewArray = viewArray;
            cvforPrefill = GetConfigvalues();
            ViewBag.PrefillCV = cvforPrefill;
            ViewBag.CompanyCode = _objCurr.GetCompanyCode();
            ViewBag.User_Code = _objCurr.GetUserCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            ViewBag.isThereAnyOneDoctorSavedA = isThereAnyOneDoctorSavedA;


            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
        }

        public JsonResult checkVisitTimePrivilge()
        {
            string companyCode = _objCurr.GetCompanyCode();
            string usertypecode = _objCurr.GetUserTypeCode();
            BLUser _objUser = new BLUser();
            List<VisitTimePrivValues> lstVisitTimePrivVal = new List<VisitTimePrivValues>();
            lstVisitTimePrivVal = _objDCRBL.checkVisitTimePrivilge(companyCode, usertypecode).ToList();
            return Json(lstVisitTimePrivVal, JsonRequestBehavior.AllowGet);

        }

        #region PublicMethods
        public JsonResult StockiestDetails(FormCollection collection)
        {
            string accom_Regioncodes = string.Empty;
            string accom_EntityType = string.Empty;
            try
            {
                string dcrStatus = collection["dcrStatus"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string dcrCode = _objCurr.GetDCRCode(dcrDate);
                //Adding Accompanist's Stockiest Details
                accom_Regioncodes = collection["acc_Regions"].ToString();
                accom_EntityType = collection["showAccDataValue"].ToString();

                List<DCRStockiestModel> lstStockiestAuto = new List<DCRStockiestModel>();
                List<DCRStockiestModel> lstDraftedStockiest = new List<DCRStockiestModel>();

                lstStockiestAuto = _objDCRBL.GetAccompaistStockist(_objCurr.GetCompanyCode(), _objCurr.GetRegionCode(), accom_Regioncodes, accom_EntityType);
                //lstStockiestAuto = _objDCRBL.GetStockist(_objCurr.GetCompanyCode(), _objCurr.GetRegionCode());

                if (dcrStatus == "3" || dcrStatus == "0")
                {
                    lstDraftedStockiest = _objDCRBL.GetDraftedStockist(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), dcrCode, dcrDate);
                }

                List<JsonResult> lstStockiest = new List<JsonResult> { Json(lstStockiestAuto, JsonRequestBehavior.AllowGet), Json(lstDraftedStockiest, JsonRequestBehavior.AllowGet) };
                return Json(lstStockiest, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult ExpenseDetails(FormCollection collection)
        {
            try
            {
                DataSet dsExpense = new DataSet();
                DataTable dsExpenseAutoFill = new DataTable();
                DataTable dsExpensePreFill = new DataTable();
                string companyCode = _objCurr.GetCompanyCode();
                string userCode = _objCurr.GetUserCode();
                string regionCode = _objCurr.GetRegionCode();
                string entity = collection["entity"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string dcrCode = _objCurr.GetDCRCode(dcrDate);
                string dcrStatus = collection["dcrStatus"].ToString();

                double travelKm = Convert.ToDouble((collection["Travel_Km"] == "" ? "0.00" : collection["Travel_Km"]));
                string dcrFlag = collection["flag"].ToString();

                List<DCRExpenseModel> lstExpenseAuto = new List<DCRExpenseModel>();
                List<DCRExpenseModel> lstExpensePre = new List<DCRExpenseModel>();
                List<DCRExpenseModel> lstDraftedExpense = new List<DCRExpenseModel>();

                // Get Expense Data  for autofill and prefill
                dsExpense = _objDCRBL.GetExenseDetails(companyCode, userCode, regionCode, dcrDate, entity, dcrFlag);

                if (dsExpense.Tables.Count > 1)
                {
                    dsExpenseAutoFill = dsExpense.Tables[0];
                    dsExpensePreFill = GetFareCalculatedExpense(dsExpense.Tables[1], entity, dcrCode, dcrDate, travelKm, dcrFlag);
                }

                if (dcrStatus == "3" || dcrStatus == "0")
                {
                    // Get Expense  Drafted item  
                    lstDraftedExpense = _objDCRBL.GetDraftedExenseDetails(companyCode, userCode, dcrCode, dcrDate, dcrFlag);
                }

                if (dsExpenseAutoFill.Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsExpenseAutoFill;
                    lstExpenseAuto = (from item in dt.AsEnumerable()
                                      select new DCRExpenseModel()
                                      {
                                          ExpenseTypeCode = item["Expense_Type_Code"].ToString(),
                                          ExpenseTypeName = item["Expense_Type_Name"].ToString(),
                                          ExpenseMode = item["Expense_Mode"].ToString(),
                                          ExpenseEntity = item["Expense_Entity"].ToString(),
                                          ExpenseEntityCode = item["Expense_Entity_Code"].ToString(),
                                          EligibilityAmount = item["Eligibility_Amount"].ToString(),
                                          CanSplitAmount = item["Can_Split_Amount"].ToString(),
                                          IsValidationOnEligibility = item["Is_Validation_On_Eligibility"].ToString(),
                                          SFC_Type = item["SFC_Type"].ToString(),
                                          IsPrefill = item["Is_Prefill"].ToString(),
                                          ExpenseGroupId = item["Expense_Group_Id"].ToString(),
                                          Mandate_Remarks = item["Mandate_Remarks"].ToString()
                                      }).ToList<DCRExpenseModel>();
                }

                if (dsExpensePreFill.Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsExpensePreFill;
                    lstExpensePre = (from item in dt.AsEnumerable()
                                     select new DCRExpenseModel()
                                     {
                                         ExpenseTypeCode = item["Expense_Type_Code"].ToString(),
                                         ExpenseTypeName = item["Expense_Type_Name"].ToString(),
                                         ExpenseMode = item["Expense_Mode"].ToString(),
                                         ExpenseEntity = item["Expense_Entity"].ToString(),
                                         ExpenseEntityCode = item["Expense_Entity_Code"].ToString(),
                                         EligibilityAmount = item["Eligibility_Amount"].ToString(),
                                         CanSplitAmount = item["Can_Split_Amount"].ToString(),
                                         IsValidationOnEligibility = item["Is_Validation_On_Eligibility"].ToString(),
                                         SFC_Type = item["SFC_Type"].ToString(),
                                         IsPrefill = item["Is_Prefill"].ToString(),
                                         TotalFare = Convert.ToDouble(item["Total_Fare"]),
                                         ExpenseGroupId = item["Expense_Group_Id"].ToString(),
                                         Mandate_Remarks = item["Mandate_Remarks"].ToString()
                                     }).ToList<DCRExpenseModel>();
                }

                List<JsonResult> lstExpense = new List<JsonResult> { Json(lstExpenseAuto, JsonRequestBehavior.AllowGet), Json(lstExpensePre, JsonRequestBehavior.AllowGet), Json(lstDraftedExpense, JsonRequestBehavior.AllowGet) };

                return Json(lstExpense, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertAllValues(FormCollection collection)
        {
            DALApproval _objApproval = new DALApproval();
            try
            {
                bool result = true;
                string stockiestData = string.Empty, expenseData = string.Empty, dailyAllowance = string.Empty, dcrCode = string.Empty, dcrDate = string.Empty, dcrStatus = string.Empty;
                int isSubmit = 0;
                string dcrFlag = string.Empty;
                string commonRemarks = string.Empty;
                string commonRemarksMandatory = string.Empty;
                DateCapturingModel _objDateDetails = new DateCapturingModel();
                stockiestData = collection["tblStockiestData"].ToString();
                expenseData = collection["tblExpenseData"].ToString();
                dailyAllowance = collection["dailyAllowance"].ToString();
                dcrDate = collection["dcrDate"].ToString();
                dcrCode = _objCurr.GetDCRCode(dcrDate);
                dcrStatus = collection["dcrStatus"].ToString();
                isSubmit = Convert.ToInt32(collection["submit"]);
                dcrFlag = collection["flag"].ToString();
                commonRemarks = collection["commonRemarks"].ToString();
                commonRemarksMandatory = collection["comRemarkMandatory"].ToString();
                _objDateDetails = JsonConvert.DeserializeObject<DateCapturingModel>(collection["_objDateDetails"]);
                string companyCode = _objCurr.GetCompanyCode();
                string userCode = _objCurr.GetUserCode();

                if (!(_objDateDetails.Off_Set.Contains('+') && !(_objDateDetails.Off_Set.Contains('-'))))
                {
                    _objDateDetails.Off_Set = '+' + _objDateDetails.Off_Set.Trim();
                }
                if (dcrFlag != "A")
                {
                    result = _objDCRBL.InsertStockiest(companyCode, userCode, dcrCode, dcrDate, dcrStatus, stockiestData);
                }
                else
                {
                    result = true;
                }

                if (result)
                {
                    result = _objDCRBL.InsertExpense(companyCode, userCode, dcrCode, expenseData, dcrDate, dcrStatus, dailyAllowance, dcrFlag, _objDateDetails);
                }

                if (result)
                {
                    // update product. This block is for save and submit button.
                    if (isSubmit == 1)
                    {
                        result = _objDCRBL.UpdateProductAndStatus(companyCode, userCode, _objCurr.GetUserName(), _objCurr.GetRegionCode(), _objCurr.GetRegionName(),
                                                                    dcrCode, dcrDate, collection["autoApproval"].ToString(), dcrFlag, _objCurr.GetLattitude(), _objCurr.GetLongitude(), _objCurr.GetLocation());

                        //try
                        //{
                        //    IQueueService<DCRQueue> dcrHeaderQueue = new QueueService<DCRQueue>(_queueAccountKey, _topicName, _subscriptionName);
                        //    if (dcrHeaderQueue.Initialize())
                        //    {
                        //        DCRQueue dcrQueue = new DCRQueue();

                        //        dcrQueue.CompanyCode = _objCurr.GetCompanyCode();
                        //        dcrQueue.DCRCode = dcrCode;
                        //        dcrQueue.UserCode = _objCurr.GetUserCode();
                        //        dcrQueue.UserName = _objCurr.GetUserName();
                        //        dcrQueue.DCRDate = dcrDate;
                        //        dcrQueue.ActivityFlag = dcrFlag;
                        //        dcrQueue.DCRStatus = Convert.ToInt32(dcrStatus);
                        //        if (commonRemarksMandatory == "NO")
                        //        {
                        //            dcrQueue.Event = "APPLIED";
                        //        }
                        //        else
                        //        {
                        //            dcrQueue.Event = "REAPPLIED";
                        //        }

                        //        DCRQueueTracker dcrQueueTracker = new DCRQueueTracker();
                        //        dcrQueueTracker.CompanyCode = companyCode;
                        //        dcrQueueTracker.UserCode = _objCurr.GetUserCode();
                        //        dcrQueueTracker.DCRCode = dcrCode;
                        //        dcrQueueTracker.Flag = dcrFlag;
                        //        dcrQueueTracker.TopicName = _topicName;
                        //        dcrQueueTracker.SubscriptionName = _subscriptionName;
                        //        dcrQueueTracker.ProcessStatus = 0;
                        //        dcrQueueTracker.EventName = dcrQueue.Event;


                        //        List<DCRQueue> dcrQueueList = new List<DCRQueue>();
                        //        dcrQueueList.Add(dcrQueue);
                        //        dcrQueueTracker.JSONObject = JsonConvert.SerializeObject(dcrQueueList);

                        //        BL_DCRHeader blDCRHeader = new BL_DCRHeader();

                        //        int Id = blDCRHeader.InsertDCRQueueTracker(_objCurr.GetCompanyCode(), dcrQueueTracker);
                        //        dcrQueueList[0].Id = Id;
                        //        dcrQueueTracker.Id = Id;
                        //        if (!dcrHeaderQueue.CreateQueueItem(dcrQueueList))
                        //        {
                        //            dcrQueueTracker.Mesg = "Queue Failed.";
                        //            dcrQueueTracker.StackTrace = "";
                        //            dcrQueueTracker.ProcessStatus = -1;
                        //            blDCRHeader.UpdateDCRQueueTracker(_objCurr.GetCompanyCode(), dcrQueueTracker);
                        //        }
                        //    }
                        //}
                        //catch(Exception ex)
                        //{
                        //    BL_DCRHeader blDCRHeader = new BL_DCRHeader();
                        //    string eventName = commonRemarksMandatory == "NO" ? "Applied" : "ReApplied";
                        //    blDCRHeader.InsertDCRQueueExceptionLogs(_objCurr.GetCompanyCode(), dcrCode, dcrFlag, userCode, dcrDate, ex.Message, ex.StackTrace, eventName);
                        //}


                        //delete dcr temp table records
                        if (result)
                        {
                            result = _objDCRBL.DeleteDCRTempTableRecords(companyCode, dcrCode, dcrFlag);
                        }
                    }
                }

                // update common remarks remarks
                if (result)
                {
                    if (commonRemarks != "")
                    {
                        result = _objDCRBL.UpdateDCRCommonRemarks(companyCode, dcrCode, dcrFlag, dcrStatus, commonRemarks, isSubmit.ToString(), "1");
                    }
                    else
                        result = _objDCRBL.UpdateDCRCommonRemarks(companyCode, dcrCode, dcrFlag, dcrStatus, commonRemarks, isSubmit.ToString(), "0");
                }
                if (isSubmit == 1)
                {
                    result = _objDCRBL.UpdatePOBOrderStatus(companyCode, "-1", "1", "0", _objCurr.GetUserCode(), dcrDate);
                }
                int result_History = _objApproval.InsertDcrHistory(_objCurr.GetCompanyCode(), dcrCode, dcrFlag);

                return result;
            }
            catch
            {
                throw;
            }
        }

        public double GetExpenseSum(FormCollection collection)
        {
            try
            {
                double sum = 0.0;
                sum = _objDCRBL.GetExpenseSum(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), collection["dcrDate"].ToString(), collection["expenseMode"].ToString(), collection["expenseTypeCode"].ToString());
                return sum;
            }
            catch
            {
                throw;
            }
        }

        public string DailyAllowanceCheck(FormCollection coll)
        {
            try
            {
                string result = string.Empty, dcrflag = string.Empty;
                dcrflag = (coll["flag"].ToString() == "F") ? "A" : "F";
                result = _objDCRBL.DailyAllowanceCheck(_objCurr.GetCompanyCode(), _objCurr.GetDCRCode(coll["dcrDate"].ToString()), dcrflag, coll["expenseCode"].ToString());
                return result;
            }
            catch
            {
                throw;
            }
        }

        public string GetCommonRemarks(FormCollection coll)
        {
            string remarks = string.Empty;
            remarks = _objDCRBL.GetCommonRemarks(_objCurr.GetCompanyCode(), _objCurr.GetDCRCode(coll["dcrDate"].ToString()), coll["dcrFlag"].ToString());
            return remarks;
        }
        public string GetCommonRemarksMandatory(string dcrDate, string dcrFlag)
        {
            string status = string.Empty;
            BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
            status = _objDCRBL.GetCommonRemarksMandatory(_objCurr.GetCompanyCode(), Convert.ToDateTime(dcrDate), _objCurr.GetUserCode(), dcrFlag);
            return status;
        }
        public string InsertAttendanceDoctor(List<Attendance_Doctor_Details> lsAttendance_Doctor_Details, List<Attendance_Samples_Details> lsAttendance_Samples_Details, List<DCRActivity> lstAttendance_Activity, List<DCRAttendanceBatchdetails> lstAttendance_Batch, string dcr_code, DateTime dcr_date)
        {
            BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
            if (lsAttendance_Doctor_Details != null && lsAttendance_Doctor_Details.Count > 0)
            {
                lsAttendance_Doctor_Details = lsAttendance_Doctor_Details.GroupBy(x => new { x.Doctor_Name, x.Speciality_Name }).Select(y => y.First()).ToList();

                lsAttendance_Doctor_Details.ForEach(x => x.Company_Code = _objCurr.GetCompanyCode());
                lsAttendance_Doctor_Details.ForEach(x => x.Company_Id = Convert.ToInt32(_objCurr.GetCompanyId()));
                lsAttendance_Samples_Details.ForEach(x => x.Company_Code = _objCurr.GetCompanyCode());
                lsAttendance_Samples_Details.ForEach(x => x.Company_Id = Convert.ToInt32(_objCurr.GetCompanyId()));
                lsAttendance_Samples_Details.ForEach(x => x.User_code = _objCurr.GetUserCode());
                lsAttendance_Doctor_Details.ForEach(x => x.User_code = _objCurr.GetUserCode());
            }
            // _objDCRBL.InsertAttendanceDoctor(lsAttendance_Doctor_Details, lsAttendance_Samples_Details, _objCurr.GetCompanyCode(), dcr_code, dcr_date, _objCurr.GetUserCode());
            return "";
        }
        public JsonResult GetDoctorProductDetails(DateTime dcr_date, string dcr_code)
        {
            BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
            return Json(_objDCRBL.GetDoctorProductDetails(dcr_date, dcr_code));
        }
        #endregion PublicMethods

        #region PrivateMethods

        private DataTable GetFareCalculatedExpense(DataTable dt, string entity, string dcrCode, string dcrDate, double travelKm, string dcrFlag)
        {
            try
            {
                dt.Columns.Add(new DataColumn("Total_Fare"));


                Models.FareCalculationDTO objFarCalcParams = new Models.FareCalculationDTO();
                objFarCalcParams.Entity = entity;
                objFarCalcParams.DcrCode = dcrCode;
                objFarCalcParams.DcrDate = dcrDate;
                objFarCalcParams.DcrFalg = dcrFlag;

                objFarCalcParams.TravelKm = travelKm;
                objFarCalcParams.DCR_Version = "DCR V4";

                foreach (DataRow dr in dt.Rows)
                {
                    ISFCFareCalculator FareCalcEngine = SFCFareCalculationFactory.GetSFCFareCalculationEngine(dr["SFC_Type"].ToString().Trim().ToUpper());
                    if (FareCalcEngine != null)
                    {
                        objFarCalcParams.Sum_Distance_Needed = dr["Sum_Distance_Needed"].ToString().Trim().ToUpper();
                        objFarCalcParams.EligibilityAmount = (dr["Eligibility_Amount"] != System.DBNull.Value) ? Convert.ToDouble(dr["Eligibility_Amount"]) : 0.0;

                        double calculatedSFCFare = FareCalcEngine.CalculateSFCFare(objFarCalcParams);
                        dr["Total_Fare"] = calculatedSFCFare;
                    }
                    else
                    {
                        dr["Total_Fare"] = 0.0;
                    }
                }

                return dt;
            }
            catch
            {
                throw;
            }
        }
        #endregion PrivateMethods

        #region - Get config Values
        public string GetConfigvalues()
        {
            string configValue = string.Empty;
            configValue = _objDCRBL.GetConfigvalues(_objCurr.GetCompanyCode());
            return configValue;
        }
        #endregion - Get config Values
    }
}
