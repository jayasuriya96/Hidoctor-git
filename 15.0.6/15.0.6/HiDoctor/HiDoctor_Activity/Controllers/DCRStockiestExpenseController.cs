#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using System.Collections;

using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRStockiestExpenseController : Controller
    {
        #region Private Variables
        private MasterController _objMaster = new MasterController();
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Public Variables

        #region Create
        // GET: /DCRStockiestExpense/Create
        public ActionResult Create(string dcrDate, string dcrStatus, string entity, string travelkm, string isRCPA, string accRegions, string flag, string actvity, string cpCode, string tpCode)
        {
            string[] viewArray = new string[6];
            viewArray[0] = dcrDate;
            viewArray[1] = dcrStatus;
            viewArray[2] = entity;
            viewArray[3] = travelkm;
            viewArray[4] = _objCurr.GetDCRCode(dcrDate);
            viewArray[5] = flag;

            ViewBag.isrcpa = isRCPA;
            ViewBag.userCode = _objCurr.GetUserCode();
            ViewBag.accRegions = accRegions;
            ViewBag.activity = actvity;
            ViewBag.CPCode = cpCode;
            ViewBag.TPCode = tpCode;

            ViewBag.viewArray = viewArray;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Create.Mobile");
            }
            else
            {
                return View();
            }
        }
        #endregion Create

        #region PublicMethods
        public JsonResult StockiestDetails(FormCollection collection)
        {
            try
            {
                DataSet dsStockiest = new DataSet();
                string dcrStatus = collection["dcrStatus"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string dcrCode = _objCurr.GetDCRCode(dcrDate);

                try
                {
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        dsStockiest = _objData.ExecuteDataSet("exec SP_hdGetStockiest '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetRegionCode() + "'");
                    }
                }
                finally
                {
                    _objData.CloseConnection();

                }

                List<Models.DCRStockiestModel> lstStockiestAuto = new List<Models.DCRStockiestModel>();
                List<Models.DCRStockiestModel> lstDraftedStockiest = new List<Models.DCRStockiestModel>();

                if (dsStockiest.Tables.Count > 0)
                {
                    if (dsStockiest.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsStockiest.Tables[0];
                        lstStockiestAuto = (from item in dt.AsEnumerable()
                                            select new Models.DCRStockiestModel()
                                            {
                                                StockiestCode = item["Customer_Code"].ToString(),
                                                StockiestName = item["Customer_Name"].ToString()
                                            }).ToList<Models.DCRStockiestModel>();
                    }
                }

                if (dcrStatus == "3" || dcrStatus == "0")
                {
                    DataSet dsDraftedStockiest = new DataSet();

                    try
                    {
                        _objData.OpenConnection(_objCurr.GetCompanyCode());
                        {
                            dsDraftedStockiest = _objData.ExecuteDataSet("exec SP_hdGetDraftedStockiest '" + _objCurr.GetCompanyCode() + "','" + dcrCode + "','" + _objCurr.GetUserCode() + "','" + dcrDate + "'");
                        }
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }

                    if (dsDraftedStockiest.Tables.Count > 0)
                    {
                        if (dsDraftedStockiest.Tables[0].Rows.Count > 0)
                        {
                            DataTable dt = new DataTable();
                            dt = dsDraftedStockiest.Tables[0];
                            lstDraftedStockiest = (from item in dt.AsEnumerable()
                                                   select new Models.DCRStockiestModel()
                                                   {
                                                       StockiestCode = item["Customer_Code"].ToString(),
                                                       StockiestName = item["Customer_Name"].ToString(),
                                                       VisitSession = item["Visit_Mode"].ToString(),
                                                       StockiestRemark = item["Remarks_By_User"].ToString(),
                                                       POB = item["PO_Amount"].ToString(),
                                                       collectionAmnt = item["Collection_Amount"].ToString()
                                                   }).ToList<Models.DCRStockiestModel>();

                        }
                    }
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
                string userTypeCode = _objCurr.GetUserTypeCode();
                string regionCode = _objCurr.GetRegionCode();
                string entity = collection["entity"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string dcrCode = _objCurr.GetDCRCode(dcrDate);
                string dcrStatus = collection["dcrStatus"].ToString();
                string interMediatePlace = collection["InterMediate_Places_Needed"].ToString();
                double travelKm = Convert.ToDouble(collection["Travel_Km"]);
                string flag = collection["flag"].ToString();
                string isExpenseGroup = string.Empty;

                List<Models.DCRExpenseModel> lstExpenseAuto = new List<Models.DCRExpenseModel>();
                List<Models.DCRExpenseModel> lstExpensePre = new List<Models.DCRExpenseModel>();
                List<Models.DCRExpenseModel> lstDraftedExpense = new List<Models.DCRExpenseModel>();

                // check whether the expense group has mapped
                try
                {
                    _objData.OpenConnection(companyCode);
                    {
                        isExpenseGroup = Convert.ToString(_objData.ExecuteScalar("exec SP_hdCheckExpenseGroupMapping '" + companyCode + "','" + _objCurr.GetUserCode() + "','" + regionCode + "'"));
                    }
                }
                finally
                {
                    _objData.CloseConnection();
                }


                if (isExpenseGroup != "NO_GROUP")
                {
                    // Get Expense Data  
                    try
                    {
                        _objData.OpenConnection(companyCode);
                        {
                            dsExpense = _objData.ExecuteDataSet("exec SP_hdGetExpenseNG '" + companyCode + "','" + dcrDate + "','" + isExpenseGroup + "','" + entity + "'");
                        }
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }


                    dsExpenseAutoFill = dsExpense.Tables[0];
                    dsExpensePreFill = GetFareCalculatedExpense(dsExpense.Tables[1], entity, dcrCode, dcrDate, interMediatePlace, travelKm, flag);
                }
                else
                {
                    //old logic
                    // Get Expense data
                    try
                    {
                        _objData.OpenConnection(companyCode);
                        {
                            dsExpense = _objData.ExecuteDataSet("exec SP_hdGetExpense '" + companyCode + "','" + regionCode + "','" + userTypeCode + "','" + entity + "'");
                        }
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }


                    // auto fill Data
                    dsExpenseAutoFill = GetExpenseData(dsExpense.Tables[0], "A", entity, dcrCode, dcrDate, interMediatePlace, travelKm, flag);

                    // PrefillData
                    dsExpensePreFill = GetExpenseData(dsExpense.Tables[1], "P", entity, dcrCode, dcrDate, interMediatePlace, travelKm, flag);
                }

                if (dcrStatus == "3" || dcrStatus == "0")
                {
                    DataSet dsDraftedExpense = new DataSet();
                    string userCode = _objCurr.GetUserCode();

                    // Get Expense  Drafted item                   
                    try
                    {
                        _objData.OpenConnection(companyCode);
                        {
                            dsDraftedExpense = _objData.ExecuteDataSet("exec SP_hdGetDraftedExpense '" + companyCode + "','" + dcrCode + "','" + userCode + "','" + dcrDate + "','" + flag + "'");
                        }
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }


                    if (dsDraftedExpense.Tables.Count > 0)
                    {
                        if (dsDraftedExpense.Tables[0].Rows.Count > 0)
                        {
                            DataTable dt = new DataTable();
                            dt = dsDraftedExpense.Tables[0];
                            lstDraftedExpense = (from item in dt.AsEnumerable()
                                                 select new Models.DCRExpenseModel()
                                                 {
                                                     ExpenseTypeCode = item["Expense_Type_Code"].ToString(),
                                                     ExpenseTypeName = item["Expense_Type_Name"].ToString(),
                                                     ExpenseRemark = item["Expense_Remarks"].ToString(),
                                                     ExpenseAmount = item["Expense_Amount"].ToString()
                                                 }).ToList<Models.DCRExpenseModel>();
                        }
                    }
                }

                if (dsExpenseAutoFill.Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsExpenseAutoFill;
                    lstExpenseAuto = (from item in dt.AsEnumerable()
                                      select new Models.DCRExpenseModel()
                                      {
                                          ExpenseTypeCode = item["Expense_Type_Code"].ToString(),
                                          ExpenseTypeName = item["Expense_Type_Name"].ToString(),
                                          ExpenseMode = item["Expense_Mode"].ToString(),
                                          ExpenseEntity = item["Expense_Entity"].ToString(),
                                          ExpenseEntityCode = item["Expense_Entity_Code"].ToString(),
                                          EligibilityAmount = item["Eligibility_Amount"].ToString(),
                                          CanSplitAmount = item["Can_Split_Amount"].ToString(),
                                          IsValidationOnEligibility = item["Is_Validation_On_Eligibility"].ToString(),
                                          //IsPeriodBoundaryCheck = item["Is_Period_Boundary_Check"].ToString(),
                                          SFC_Type = item["SFC_Type"].ToString(),
                                          IsPrefill = item["Is_Prefill"].ToString(),
                                          ExpenseGroupId = isExpenseGroup

                                      }).ToList<Models.DCRExpenseModel>();
                }

                if (dsExpensePreFill.Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsExpensePreFill;
                    lstExpensePre = (from item in dt.AsEnumerable()
                                     select new Models.DCRExpenseModel()
                                     {
                                         ExpenseTypeCode = item["Expense_Type_Code"].ToString(),
                                         ExpenseTypeName = item["Expense_Type_Name"].ToString(),
                                         ExpenseMode = item["Expense_Mode"].ToString(),
                                         ExpenseEntity = item["Expense_Entity"].ToString(),
                                         ExpenseEntityCode = item["Expense_Entity_Code"].ToString(),
                                         EligibilityAmount = item["Eligibility_Amount"].ToString(),
                                         CanSplitAmount = item["Can_Split_Amount"].ToString(),
                                         IsValidationOnEligibility = item["Is_Validation_On_Eligibility"].ToString(),
                                         //IsPeriodBoundaryCheck = item["Is_Period_Boundary_Check"].ToString(),
                                         SFC_Type = item["SFC_Type"].ToString(),
                                         IsPrefill = item["Is_Prefill"].ToString(),
                                         TotalFare = Convert.ToDouble(item["Total_Fare"]),
                                         ExpenseGroupId = isExpenseGroup
                                     }).ToList<Models.DCRExpenseModel>();
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
            try
            {
                bool result = true;
                string stockiestData = string.Empty, expenseData = string.Empty, dailyAllowance = string.Empty, dcrCode = string.Empty, dcrDate = string.Empty, dcrStatus = string.Empty;
                int isSubmit = 0;
                string flag = string.Empty;
                string commonRemarks = string.Empty;


                stockiestData = collection["tblStockiestData"].ToString();
                expenseData = collection["tblExpenseData"].ToString();
                dailyAllowance = collection["dailyAllowance"].ToString();
                dcrDate = collection["dcrDate"].ToString();
                dcrCode = _objCurr.GetDCRCode(dcrDate);
                dcrStatus = collection["dcrStatus"].ToString();
                isSubmit = Convert.ToInt32(collection["submit"]);
                flag = collection["flag"].ToString();
                commonRemarks = collection["commonRemarks"].ToString();


                if (flag != "A")
                {
                    result = InsertStockiest(stockiestData, dcrDate, dcrStatus);
                }
                else
                {
                    result = true;
                }

                if (result)
                {
                    result = InsertExpense(expenseData, dcrDate, dcrStatus, dailyAllowance, flag);
                }

                if (result)
                {
                    // updte product. This block is for save and submit button.
                    if (isSubmit == 1)
                    {
                        result = UpdateProductAndStatus(dcrDate, collection["autoApproval"].ToString(), flag, dcrStatus, commonRemarks, isSubmit.ToString());
                    }
                    else
                    {
                        BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
                        if (commonRemarks != "")
                        {
                            // update common remarks
                            result = _objDCRBL.UpdateDCRCommonRemarks(_objCurr.GetCompanyCode(), dcrCode, flag, dcrStatus, commonRemarks, isSubmit.ToString(), "1");
                        }
                        else
                            result = _objDCRBL.UpdateDCRCommonRemarks(_objCurr.GetCompanyCode(), dcrCode, flag, dcrStatus, commonRemarks, isSubmit.ToString(), "0");
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public double GetExpenseSum(FormCollection collection)
        {
            try
            {
                double sum = 0.0;
                DCRExpense objExpense = new DCRExpense();

                sum = objExpense.GetExpenseSum(collection["dcrDate"].ToString(), collection["expenseMode"].ToString(), collection["expenseTypeCode"].ToString());
                return sum;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string DailyAllowanceCheck(FormCollection coll)
        {
            try
            {
                string result = string.Empty, dcrflag = string.Empty;
                dcrflag = (coll["flag"].ToString() == "F") ? "A" : "F";

                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    result = Convert.ToString(_objData.ExecuteScalar("exec SP_hdCheckDailyAllowanceEntry '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetDCRCode(coll["dcrDate"].ToString()) + "','" + dcrflag + "','" + coll["expenseCode"].ToString() + "'"));
                }


                return result;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetCommonRemarks(string dcrDate, string dcrFlag)
        {
            string remarks = string.Empty;
            BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
            remarks = _objDCRBL.GetCommonRemarks(_objCurr.GetCompanyCode(), _objCurr.GetDCRCode(dcrDate), dcrFlag);
            return remarks;
        }
        #endregion PublicMethods

        #region PrivateMethods
        private bool InsertStockiest(string stockiestData, string dcrDate, string dcrStatus)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = _objSP.InsertStockiest(dcrDate, dcrStatus, stockiestData);

                if (result == "SUCCESS")
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertExpense(string expenseContent, string dcrDate, string dcrStatus, string dailyAllowance, string dcrFlag)
        {
            try
            {

                bool result = false;
                DCRExpense objExpense = new DCRExpense();
                result = objExpense.InsertExpense(expenseContent, dcrDate, dcrStatus, dailyAllowance, dcrFlag);

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // if any chnages, do the mobile.
        public bool UpdateProductAndStatus(string dcrDate, string autoApproval, string dcrFlag, string dcrStatus, string commonRemarks, string isSubmit)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                string dcrCode = _objCurr.GetDCRCode(dcrDate);

                // This function update product qty and change the status in to the DCR Master.
                // Then update the calc fields and customer master month count based on privilege.
                result = _objSP.UpdateProductAndStatus(dcrDate, autoApproval, dcrFlag);

                // update common remarks remarks
                if (result == "SUCCESS")
                {
                    BL_DCRStockiestExpense _objDCRBL = new BL_DCRStockiestExpense();
                    if (commonRemarks != "")
                    {
                        flag = _objDCRBL.UpdateDCRCommonRemarks(_objCurr.GetCompanyCode(), dcrCode, dcrFlag, dcrStatus, commonRemarks, isSubmit.ToString(), "1");
                    }
                    else
                    {
                        flag = _objDCRBL.UpdateDCRCommonRemarks(_objCurr.GetCompanyCode(), dcrCode, dcrFlag, dcrStatus, commonRemarks, isSubmit.ToString(), "0");
                    }
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private DataTable GetExpenseData(DataTable ds, string fillType, string entity, string dcrCode, string dcrDate, string interMediatePlace, double travelKm, string flag)
        {
            try
            {
                DataTable dsExpense = new DataTable();
                DataSet dsParentRegion = new DataSet();
                ArrayList alExpenseType = new ArrayList();
                DataRow[] drExpenseType;
                int i = 0;

                dsExpense = ds.Clone();
                string companyCode = _objCurr.GetCompanyCode();
                string regionCode = _objCurr.GetRegionCode();
                string userCode = _objCurr.GetUserCode();
                dsParentRegion = _objMaster.GetParentRegionsDataSet(regionCode);

                foreach (DataRow dr in ds.Rows)
                {
                    if (!(alExpenseType.Contains(dr["Expense_Type_Code"].ToString())))
                    {
                        alExpenseType.Add(dr["Expense_Type_Code"].ToString());
                    }
                }

                foreach (string s in alExpenseType)
                {
                    for (i = (dsParentRegion.Tables[0].Rows.Count - 1); i >= 0; i--)
                    {
                        drExpenseType = ds.Select("Expense_Type_Code='" + s + "' AND Region_Code='" + dsParentRegion.Tables[0].Rows[i]["Region_Code"].ToString() + "'");

                        if (drExpenseType.Length > 0)
                        {
                            dsExpense.ImportRow(drExpenseType[0]);
                            break;
                        }
                    }
                }

                if (fillType == "P")
                {
                    DataTable dsExpensePrefill = new DataTable();
                    dsExpensePrefill = GetFareCalculatedExpense(dsExpense, entity, dcrCode, dcrDate, interMediatePlace, travelKm, flag);
                    return dsExpensePrefill;
                }
                else
                {
                    return dsExpense;
                }
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        private DataTable GetFareCalculatedExpense(DataTable ds, string entity, string dcrCode, string dcrDate, string interMediatePlace, double travelKm, string dcrFlag)
        {
            try
            {
                ds.Columns.Add(new DataColumn("Total_Fare"));

                string[] hopArray;
                string hopNeed = "NO";
                if (interMediatePlace != string.Empty)
                {
                    hopArray = interMediatePlace.Split(',');
                    foreach (string s in hopArray)
                    {
                        if (s.Trim().ToUpper() == "DCR")
                        {
                            hopNeed = "YES";
                            break;
                        }
                    }
                }

                Models.FareCalculationDTO objFarCalcParams = new Models.FareCalculationDTO();
                objFarCalcParams.Entity = entity;
                objFarCalcParams.DcrCode = dcrCode;
                objFarCalcParams.DcrDate = dcrDate;
                objFarCalcParams.DcrFalg = dcrFlag;
                objFarCalcParams.IntermediatePlace = hopNeed;
                objFarCalcParams.TravelKm = travelKm;
                objFarCalcParams.DCR_Version = "DCR V3";


                foreach (DataRow dr in ds.Rows)
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

                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion PrivateMethods
    }
}
