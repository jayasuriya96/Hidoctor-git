#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;
using System.Web.Mvc;
using System.Collections;
using DataControl;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRHeaderController : Controller
    {

        #region Private Variables
        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.SPData objSP = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        private IConfigSettings IConfig_Settings = null;

        const string DCR_TIME_GAP_DEFAULT_VALUE = "5";
        #endregion private Variables

        #region System generated

        // GET: /DCRHeader/Create
        
        
        public ActionResult Create(string dcrDate, string dcrStatus, string isrcpa, string source, string flag)
        {
            ViewBag.category = GetCategory();

            ViewBag.dcrTimeGap = GetDCRTimeGap();

            string[] viewArray = new string[5];
            viewArray[0] = dcrDate;
            viewArray[1] = dcrStatus;
            viewArray[2] = isrcpa;
            viewArray[3] = source;
            viewArray[4] = flag;

            ViewBag.viewArray = viewArray;
            ViewBag.regionCode = objCurr.GetRegionCode() + "," + objCurr.GetRegionName();
            if(DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Create.Mobile");
            }
            else
            {
                return View();
            }
        }

        #endregion System generated


        #region Private Methods
        private SelectList GetCategory()
        {
            try
            {
                DataSet dsCategory = new DataSet();
                List<object> lt = new List<object>();

                // Added the parameter to SqlCommand.
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_hdGetExpenseEntity '" + objCurr.GetCompanyCode() + "'");
                }              

                if (dsCategory.Tables.Count > 0)
                {
                    if (dsCategory.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsCategory.Tables[0].Rows)
                        {
                            lt.Add(new
                            {
                                value = dr["Expense_Entity_Code"].ToString(),
                                text = dr["Expense_Entity_Name"].ToString()
                            });
                        }
                    }
                }
                return new SelectList(lt.AsEnumerable(), "value", "text");
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private string GetDCRTimeGap()
        {
            IConfig_Settings = new Config_Settings();
            string companyCode = objCurr.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrTimeGapValue = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR, 
                CONFIG_KEY.DCR_ENTRY_TIME_GAP);

            // Returns the dcrTimeGapValue.
            return dcrTimeGapValue; 
            
        }

        private bool InsertHeaderDetails(string dcrDate, string dcrStatus, string distanceFareCode, string category, string categoryCode, string cpCode, string cpName,
            string workPlace, string fromPlace, string toPlace, string travelMode, string distance, string startTime, string endTime, string acc1Name, string acc1Type,
            string acc1StartTime, string acc1EndTime, string acc1OnlyDoctor, string acc2Name, string acc2Type, string acc2StartTime, string acc2EndTime,
            string acc2OnlyDoctor, string acc3Name, string acc3Time, string acc3OnlyDoctor, string acc4Name, string acc4Time, string acc4OnlyDoctor, string isrcpa,
            string routeWay, string activityString, string dcrFlag, string tpDeviation, string cpDeviation, string entryMode)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                int originOfDCR = 0;

                // Define Origin Of DCR. 
                // Its applicable for Fresh entry. For Other status DCR's the first entry of "Origin_Of_DCR" will be maintained.
                // 1 = Web,2 = Mobile,3 = WA

                if (dcrStatus == "1")
                {
                    if (entryMode == "WEB")
                    {
                        originOfDCR = 1;
                    }
                    else if (entryMode == "MOBILE")
                    {
                        originOfDCR = 2;
                    }
                }
                result = objSP.InsertHeaderDetails(dcrDate, dcrStatus, distanceFareCode, category, categoryCode, cpCode, cpName, workPlace, fromPlace, toPlace,
                    travelMode, distance, startTime, endTime, acc1Name, acc1Type, acc1StartTime, acc1EndTime, acc1OnlyDoctor, acc2Name, acc2Type, acc2StartTime,
                    acc2EndTime, acc2OnlyDoctor, acc3Name, acc3Time, acc3OnlyDoctor, acc4Name, acc4Time, acc4OnlyDoctor, isrcpa, routeWay, entryMode, activityString,
                    dcrFlag, tpDeviation, cpDeviation, originOfDCR);

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

        private bool InsertTravelledPlaces(string dcrDate, string intermediateData, string category, string dcrFlag)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = objSP.InsertTravelledPlaces(dcrDate, intermediateData, dcrFlag, category);

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

        private DataSet GetExpenseMappingData(DataSet ds)
        {
            try
            {

                DataSet dsExpense = new DataSet();
                DataSet dsParentRegion = new DataSet();
                DataSet dsCategory = new DataSet();
                ArrayList alExpenseType = new ArrayList();
                DataRow[] drExpenseType;
                int i = 0;

                dsExpense = ds.Clone();
                string companyCode = objCurr.GetCompanyCode();
                string regionCode = objCurr.GetRegionCode();
                string userCode = objCurr.GetUserCode();
                dsParentRegion = objMaster.GetParentRegionsDataSet(regionCode);

                // get category.
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_hdGetExpenseEntity '" + objCurr.GetCompanyCode() + "'");
                }              

                foreach (DataRow drCat in dsCategory.Tables[0].Rows)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (!(alExpenseType.Contains(dr["Expense_Type_Code"].ToString() + "," + drCat["Expense_Entity_Code"].ToString())))
                        {
                            alExpenseType.Add(dr["Expense_Type_Code"].ToString() + "," + drCat["Expense_Entity_Code"].ToString());
                        }
                    }
                }

                foreach (string s in alExpenseType)
                {
                    for (i = (dsParentRegion.Tables[0].Rows.Count - 1); i >= 0; i--)
                    {
                        drExpenseType = ds.Tables[0].Select("Expense_Type_Code='" + s.Split(',')[0] + "' AND Region_Code='" + dsParentRegion.Tables[0].Rows[i]["Region_Code"].ToString() + "' AND Expense_Entity_Code='" + s.Split(',')[1] + "'");

                        if (drExpenseType.Length > 0)
                        {
                            dsExpense.Tables[0].ImportRow(drExpenseType[0]);
                            break;
                        }
                    }
                }
                return dsExpense;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        #endregion Private Methods

        #region Public Methods
        public LargeJsonResult GetHeaderDetails(FormCollection collection)
        {
            try
            {
                DataSet dsAutoFill = new DataSet();
                DataSet dsPreFill = new DataSet();
                DataSet dsExpenseMapping = new DataSet();
                DataSet dsAccomp = new DataSet();
                DataSet dsSFC = new DataSet();

                string dcrStatus = collection["dcrStatus"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string source = collection["source"].ToString();
                string flag = collection["flag"].ToString();
                string accName = string.Empty;
                string accRegion = string.Empty;
                string isExpenseGroup = string.Empty;

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsAccomp = objData.ExecuteDataSet("exec SP_hdGetAccompanistDetails '" + objCurr.GetCompanyCode() + "','" + objCurr.GetRegionCode() + "'");
                    }

                }
                finally
                {
                    objData.CloseConnection();
                }                

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsAutoFill = objData.ExecuteDataSet("exec SP_hdGetHeaderAutofillData '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + objCurr.GetRegionCode() + "'");
                    }

                }
                finally
                {
                    objData.CloseConnection();
                }

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsPreFill = objData.ExecuteDataSet("exec SP_hdGetHeaderPrefillData '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + dcrStatus + "','" + dcrDate + "','" + objCurr.GetDCRCode(dcrDate) + "','" + source + "','" + flag + "'");
                    }

                }
                finally
                {
                    objData.CloseConnection();
                }

                #region Expense Details

                // check whether the expense group has mapped
                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        isExpenseGroup = Convert.ToString(objData.ExecuteScalar("exec SP_hdCheckExpenseGroupMapping '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + objCurr.GetRegionCode() + "'"));
                    }
                }
                finally
                {
                    objData.CloseConnection();
                }
            

                if (isExpenseGroup != "NO_GROUP")
                {
                    // new logic
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            dsExpenseMapping = objData.ExecuteDataSet("exec SP_hdGetDistanceEditMappingNG '" + objCurr.GetCompanyCode() + "','" + dcrDate + "','" + isExpenseGroup + "'");
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }
                   
                }
                else
                {
                    //old logic
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            dsExpenseMapping = objData.ExecuteDataSet("exec SP_hdGetDistanceEditMapping '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserTypeCode() + "','" + objCurr.GetRegionCode() + "'");
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }
                   
                }

                #endregion Expense Details

                #region Get Accompanist Region
                if (dsPreFill.Tables.Count > 0)
                {
                    if (dsPreFill.Tables[0].Rows.Count > 0)
                    {
                        //for TP
                        if (dcrStatus == "1" && source != "TAB")
                        {
                            if (dsPreFill.Tables[0].Rows[0]["Ref_Key1"].ToString().Trim() != "NEW_TP") // old logic
                            {
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString())))
                                {
                                    accName = dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString() + "^";
                                }
                            }
                            else // new logic
                            {
                                // accompanist name
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString())))
                                {
                                    accName = dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"].ToString())))
                                {
                                    accName += dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"].ToString())))
                                {
                                    accName += dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"].ToString())))
                                {
                                    accName += dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"].ToString() + "^";
                                }

                                //accompanist region
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                                {
                                    accRegion = dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                                {
                                    accRegion += dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                                {
                                    accRegion += dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "^";
                                }
                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                                {
                                    accRegion += dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "^";
                                }
                            }
                        }

                        //for drafted
                        if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                        {
                            // accompanist name
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString())))
                            {
                                accName = dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString())))
                            {
                                accName += dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Person"].ToString())))
                            {
                                accName += dsPreFill.Tables[0].Rows[0]["Acc3_Person"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Person"].ToString())))
                            {
                                accName += dsPreFill.Tables[0].Rows[0]["Acc4_Person"].ToString() + "^";
                            }


                            //accompanist region
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                            {
                                accRegion = dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                            {
                                accRegion += dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                            {
                                accRegion += dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "^";
                            }
                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                            {
                                accRegion += dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "^";
                            }
                        }                        
                    }
                }
                #endregion Get Accompanist Region

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsSFC = objData.ExecuteDataSet("exec SP_hdGetAccompanistCodeAndSFCData '" + objCurr.GetCompanyCode() + "','" + accName + "','" + accRegion + "','" + objCurr.GetRegionCode() + "','" + objCurr.GetUserTypeCode() + "'");
                    }
                }
                finally
                {
                    objData.CloseConnection();
                }              


                List<Models.DCRHeaderModel> lstPreFillData = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstIntermediate = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstAccompanist = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstCP = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstCPHOP = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstSFC = new List<Models.DCRHeaderModel>();
                List<Models.DCRHeaderModel> lstExpenseMapping = new List<Models.DCRHeaderModel>();
                List<Models.DCRAttendance> lstAttendance = new List<Models.DCRAttendance>();

                #region Accompanist Details
                if (dsAccomp.Tables.Count > 0)
                {
                    if (dsAccomp.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAccomp.Tables[0];
                        lstAccompanist = (from item in dt.AsEnumerable()
                                          select new Models.DCRHeaderModel()
                                          {
                                              Accompanist_Name = item["Region_Name"].ToString() + "," + item["User_Name"].ToString() + "(" + item["User_Type_Name"].ToString() + ")",
                                              Accompanist_Region_Code = item["Region_Code"].ToString()
                                          }).ToList<Models.DCRHeaderModel>();
                    }
                }
                #endregion Accompanist Details

                #region Generate autoFill JSON
                if (dsAutoFill.Tables.Count > 0)
                {
                    // Cp data
                    if (dsAutoFill.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAutoFill.Tables[0];
                        lstCP = (from item in dt.AsEnumerable()
                                 select new Models.DCRHeaderModel()
                                 {
                                     CP_Code = item["CP_Code"].ToString(),
                                     CP_No = item["CP_Name"].ToString(),
                                     Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                     From_Place = item["Place_From"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                     To_Place = item["Place_To"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                     Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                     Travel_Mode = item["Travel_Mode"].ToString(),
                                     Valid_From = item["Valid_From"].ToString(),
                                     Valid_To = item["Valid_To"].ToString(),
                                     Category = item["Category_Code"].ToString(),
                                     Category_Name = item["Expense_Entity_Name"].ToString(),
                                     Region_Code = item["Region_Code"].ToString(),
                                     Region_Name = item["Region_Name"].ToString(),
                                     Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                     Route_Way = item["Route_Way"].ToString()
                                 }).ToList<Models.DCRHeaderModel>();
                    }

                    // Cp Hop data
                    if (dsAutoFill.Tables[1].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAutoFill.Tables[1];
                        lstCPHOP = (from item in dt.AsEnumerable()
                                    select new Models.DCRHeaderModel()
                                    {
                                        CP_Code = item["CP_Code"].ToString(),
                                        CP_No = item["CP_Name"].ToString(),
                                        Work_Place = item["Work_Place"].ToString().ToUpper(),
                                        From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                        To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                        Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                        Travel_Mode = item["Travel_Mode"].ToString(),
                                        Valid_From = item["Valid_From"].ToString(),
                                        Valid_To = item["Valid_To"].ToString(),
                                        Category = item["Category_Code"].ToString(),
                                        Category_Name = item["Expense_Entity_Name"].ToString(),
                                        Region_Code = item["Region_Code"].ToString(),
                                        Region_Name = item["Region_Name"].ToString(),
                                        Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                        Route_Way = item["Route_Way"].ToString()
                                    }).ToList<Models.DCRHeaderModel>();
                    }

                }
                #endregion Generate autoFill JSON

                #region Generate Prefill Json
                if (dsPreFill.Tables.Count > 0)
                {
                    if (dsPreFill.Tables[0].Rows.Count > 0)
                    {
                        #region tp
                        // For applied dcr, it will select the TP details if it is present.
                        if (dcrStatus == "1" && source != "TAB")
                        {
                            // old logic
                            if (dsPreFill.Tables[0].Rows[0]["Ref_Key1"].ToString().Trim() != "NEW_TP")
                            {
                                DataRow[] dr;
                                dsPreFill.Tables[0].Columns.Add("Acc1_Code", typeof(string));

                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accomp_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }
                                DataTable dt = new DataTable();
                                dt = dsPreFill.Tables[0];
                                lstPreFillData = (from item in dt.AsEnumerable()
                                                  select new Models.DCRHeaderModel()
                                                  {
                                                      CP_Code = item["CP_Code"].ToString(),
                                                      CP_No = item["CP_Name"].ToString(),
                                                      Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                      From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                      To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                      Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                      Travel_Mode = item["Travel_Mode"].ToString(),
                                                      Category_Name = item["Category"].ToString(),
                                                      Category = item["Expense_Entity_Code"].ToString(),
                                                      Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                      Route_Way = item["Route_Way"].ToString(),
                                                      Acc1_Name = item["Accomp_Name"].ToString(),
                                                      Acc1_Code = item["Acc1_Code"].ToString(),
                                                      Tp_Code = item["TP_Code"].ToString(),
                                                      ProjectCode = item["Project_Code"].ToString(),
                                                      ActivityCode = item["Activity_Code"].ToString(),
                                                      CPDeviation = item["CP_Deviation"].ToString()
                                                  }).ToList<Models.DCRHeaderModel>();
                            }

                            // new logic
                            else
                            {
                                DataRow[] dr;
                                dsPreFill.Tables[0].Columns.Add("Acc1_Code", typeof(string));
                                dsPreFill.Tables[0].Columns.Add("Acc2_Code", typeof(string));
                                dsPreFill.Tables[0].Columns.Add("Acc3_Code", typeof(string));
                                dsPreFill.Tables[0].Columns.Add("Acc4_Code", typeof(string));

                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Accomp_Name"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accomp_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }
                                else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accomp_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }

                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }
                                else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }

                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }
                                else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist3_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }

                                if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }
                                else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                                {
                                    dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "'");
                                    if (dr.Length > 0)
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Accompanist4_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                                    }
                                }

                                DataTable dt = new DataTable();
                                dt = dsPreFill.Tables[0];
                                lstPreFillData = (from item in dt.AsEnumerable()
                                                  select new Models.DCRHeaderModel()
                                                  {
                                                      CP_Code = item["CP_Code"].ToString(),
                                                      CP_No = item["CP_Name"].ToString(),
                                                      Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                      Category_Name = item["Category"].ToString(),
                                                      Category = item["Expense_Entity_Code"].ToString(),
                                                      Acc1_Name = item["Accomp_Name"].ToString(),
                                                      Acc1_Code = item["Acc1_Code"].ToString(),
                                                      Acc2_Name = item["Accompanist2_Name"].ToString(),
                                                      Acc2_Code = item["Acc2_Code"].ToString(),
                                                      Acc3_Name = item["Accompanist3_Name"].ToString(),
                                                      Acc3_Code = item["Acc3_Code"].ToString(),
                                                      Acc4_Name = item["Accompanist4_Name"].ToString(),
                                                      Acc4_Code = item["Acc4_Code"].ToString(),
                                                      Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                                                      Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),
                                                      Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),
                                                      Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                      Tp_Code = item["TP_Code"].ToString(),
                                                      ProjectCode = item["Project_Code"].ToString(),
                                                      ActivityCode = item["Activity_Code"].ToString(),
                                                      CPDeviation = item["CP_Deviation"].ToString()
                                                  }).ToList<Models.DCRHeaderModel>();

                                // Intermediate place from tp-sfc
                                if (dsPreFill.Tables[1].Rows.Count > 0)
                                {
                                    DataTable dt1 = new DataTable();
                                    dt1 = dsPreFill.Tables[1];
                                    lstIntermediate = (from item in dt1.AsEnumerable()
                                                       select new Models.DCRHeaderModel()
                                                       {
                                                           From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                           To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                           Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                           Travel_Mode = item["Travel_Mode"].ToString(),
                                                           Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                           Route_Way = item["Route_Way"].ToString()
                                                       }).ToList<Models.DCRHeaderModel>();
                                }
                            }
                        }

                        #endregion tp

                        #region drafted
                        // For unapproved or drafted DCR, it will select the saved data from dcr master.
                        if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                        {
                            DataRow[] dr;
                            dsPreFill.Tables[0].Columns.Add("Acc1_Code", typeof(string));
                            dsPreFill.Tables[0].Columns.Add("Acc2_Code", typeof(string));
                            dsPreFill.Tables[0].Columns.Add("Acc3_Code", typeof(string));
                            dsPreFill.Tables[0].Columns.Add("Acc4_Code", typeof(string));

                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }


                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }

                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Person"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc3_Person"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Person"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Person"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }

                            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Person"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc4_Person"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Person"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                            {
                                dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "'");
                                if (dr.Length > 0)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Person"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                                }
                            }


                            DataTable dt = new DataTable();
                            dt = dsPreFill.Tables[0];
                            lstPreFillData = (from item in dt.AsEnumerable()
                                              select new Models.DCRHeaderModel()
                                              {
                                                  Work_Place = item["Place_Worked"].ToString().ToUpper(),
                                                  Category_Name = item["Category"].ToString(),
                                                  From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                  To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                  Travel_Mode = item["Travel_Mode"].ToString(),
                                                  Distance = (item["Travelled_Kms"] != System.DBNull.Value) ? Convert.ToDouble(item["Travelled_Kms"]).ToString("0.00") : "0.00",
                                                  CP_No = item["CP_Name"].ToString(),
                                                  CP_Code = item["CPM_No"].ToString(),
                                                  Start_Time = item["User_Start_Time"].ToString(),
                                                  End_Time = item["User_End_Time"].ToString(),
                                                  Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                                                  Acc1_Name = item["Acc1_Name"].ToString(),
                                                  Acc1_Code = item["Acc1_Code"].ToString(),
                                                  Acc1_Start_Time = item["Accomp_Start_Time"].ToString(),
                                                  Acc1_End_Time = item["Accomp_End_Time"].ToString(),

                                                  Acc2_Name = item["Acc2_Name"].ToString(),
                                                  Acc2_Code = item["Acc2_Code"].ToString(),
                                                  Acc2_Start_Time = item["Acc2_Start_Time"].ToString(),
                                                  Acc2_End_Time = item["Acc2_End_Time"].ToString(),
                                                  Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),

                                                  Acc3_Name = item["Acc3_Person"].ToString(),
                                                  Acc3_Code = item["Acc3_Code"].ToString(),
                                                  Acc3_Start_Time = item["Acc3_Time"].ToString(),
                                                  Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),

                                                  Acc4_Name = item["Acc4_Person"].ToString(),
                                                  Acc4_Code = item["Acc4_Code"].ToString(),
                                                  Acc4_Start_Time = item["Acc4_Time"].ToString(),
                                                  Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                  Category = item["Entity_Code"].ToString(),
                                                  Distance_Fare_Code = item["Distance_Fare_code"].ToString(),
                                                  Route_Way = item["Route_Way"].ToString(),
                                                  UnApprovalReason = item["Unapproval_Reason"].ToString(),
                                                  UnApproveBy = item["Approved_By"].ToString(),
                                                  TPDeviation = item["TP_Deviation"].ToString(),
                                                  CPDeviation = item["CP_Deviation"].ToString(),
                                                  Tp_Code = item["TP_Code"].ToString()

                                              }).ToList<Models.DCRHeaderModel>();

                            // Intermediate place
                            if (dsPreFill.Tables[1].Rows.Count > 0)
                            {
                                DataTable dt1 = new DataTable();
                                dt1 = dsPreFill.Tables[1];
                                lstIntermediate = (from item in dt1.AsEnumerable()
                                                   select new Models.DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       Is_Route_Complete = item["Is_Route_Complete"].ToString()
                                                   }).ToList<Models.DCRHeaderModel>();
                            }
                        }
                        #endregion drafted
                    }

                    if (flag.ToUpper() == "A")
                    {
                        if (dsPreFill.Tables[2].Rows.Count > 0)
                        {
                            DataTable dt = new DataTable();
                            dt = dsPreFill.Tables[2];
                            if (dcrStatus == "1" && source != "TAB")
                            {
                                lstAttendance = (from item in dt.AsEnumerable()
                                                 select new Models.DCRAttendance()
                                                 {
                                                     Activity_Name = item["Activity_Name"].ToString(),
                                                     Activity_Code = item["Activity_Code"].ToString(),
                                                     Project_Code = item["Project_Code"].ToString(),
                                                     Start_Time = "",
                                                     End_Time = "",
                                                     Remarks = "",
                                                     Category = item["Expense_Entity_Code"].ToString()

                                                 }).ToList<Models.DCRAttendance>();
                            }
                            else if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                            {
                                lstAttendance = (from item in dt.AsEnumerable()
                                                 select new Models.DCRAttendance()
                                                 {
                                                     Activity_Name = item["Activity_Name"].ToString(),
                                                     Activity_Code = item["Activity_Code"].ToString(),
                                                     Project_Code = item["Project_Code"].ToString(),
                                                     Start_Time = item["Start_Time"].ToString(),
                                                     End_Time = item["End_Time"].ToString(),
                                                     Remarks = item["Remarks"].ToString()
                                                 }).ToList<Models.DCRAttendance>();
                            }
                        }
                    }
                }
                #endregion Generate Prefill Json

                #region Generate SFC Data
                if (dsSFC.Tables.Count > 0)
                {
                    // sfc data
                    if (dsSFC.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsSFC.Tables[0];
                        lstSFC = (from item in dt.AsEnumerable()
                                  select new Models.DCRHeaderModel()
                                  {
                                      Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                      From_Place = item["From_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                      To_Place = item["To_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                      Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                      Travel_Mode = item["Travel_Mode"].ToString(),
                                      Category_Name = item["Category_Name"].ToString(),
                                      Region_Code = item["Region_Code"].ToString()
                                  }).ToList<Models.DCRHeaderModel>();

                    }
                }
                #endregion Generate SFC Data

                #region Expense Mapping
                if (dsExpenseMapping.Tables.Count > 0)
                {
                    if (isExpenseGroup == "NO_GROUP")
                    {
                        dsExpenseMapping = GetExpenseMappingData(dsExpenseMapping);
                    }

                    if (dsExpenseMapping.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsExpenseMapping.Tables[0];
                        lstExpenseMapping = (from item in dt.AsEnumerable()
                                             select new Models.DCRHeaderModel()
                                             {
                                                 Category = item["Expense_Entity_Code"].ToString(),
                                                 Category_Name = item["Expense_Entity"].ToString(),
                                                 SFC_Type = item["SFC_Type"].ToString(),
                                                 Is_Prefill = item["Is_Prefill"].ToString(),
                                                 Distance_Edit = item["Distance_Edit"].ToString()
                                             }).ToList<Models.DCRHeaderModel>();
                    }
                }
                #endregion Expense Mapping

                List<JsonResult> lstAutoFill = new List<JsonResult> { Json(lstAccompanist, JsonRequestBehavior.AllowGet), Json(lstCP, JsonRequestBehavior.AllowGet), Json(lstCPHOP, JsonRequestBehavior.AllowGet), Json(lstSFC, JsonRequestBehavior.AllowGet) };
                List<JsonResult> lstPreFill = new List<JsonResult> { Json(lstPreFillData, JsonRequestBehavior.AllowGet), Json(lstIntermediate, JsonRequestBehavior.AllowGet) };
                List<JsonResult> lstHeaderDetails = new List<JsonResult>();
                if (flag.ToUpper() != "A")
                {
                    lstHeaderDetails = new List<JsonResult> { Json(lstAutoFill, JsonRequestBehavior.AllowGet), Json(lstPreFill, JsonRequestBehavior.AllowGet), Json(lstExpenseMapping, JsonRequestBehavior.AllowGet) };
                }
                else
                {
                    lstHeaderDetails = new List<JsonResult> { Json(lstAutoFill, JsonRequestBehavior.AllowGet), Json(lstPreFill, JsonRequestBehavior.AllowGet), Json(lstExpenseMapping, JsonRequestBehavior.AllowGet), Json(lstAttendance, JsonRequestBehavior.AllowGet) };
                }

                return new LargeJsonResult
               {
                   MaxJsonLength = Int32.MaxValue,
                   JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                   Data = new
                   {
                       total = lstAutoFill.Count + lstPreFill.Count + lstExpenseMapping.Count + lstAttendance.Count,
                       data = lstHeaderDetails
                   }
               };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertHeader(FormCollection coll)
        {
            try
            {
                bool isTrue = false;

                isTrue = InsertHeaderDetails(coll["dcrDate"].ToString(), coll["dcrStatus"].ToString(), coll["distanceFareCode"].ToString(), coll["category"].ToString(),
                    coll["categoryCode"].ToString(), coll["cpCode"].ToString(), coll["cpName"].ToString(), coll["workPlace"].ToString(), coll["fromPlace"].ToString(),
                    coll["toPlace"].ToString(), coll["travelMode"].ToString(), coll["distance"].ToString(), coll["startTime"].ToString(), coll["endTime"].ToString(),
                    coll["acc1Name"].ToString(), coll["acc1Type"].ToString(), coll["acc1StartTime"].ToString(), coll["acc1EndTime"].ToString(),
                    coll["acc1OnlyDoctor"].ToString(), coll["acc2Name"].ToString(), coll["acc2Type"].ToString(), coll["acc2StartTime"].ToString(), coll["acc2EndTime"].ToString(),
                    coll["acc2OnlyDoctor"].ToString(), coll["acc3Name"].ToString(), coll["acc3Time"].ToString(), coll["acc3OnlyDoctor"].ToString(), coll["acc4Name"].ToString(),
                    coll["acc4Time"].ToString(), coll["acc4OnlyDoctor"].ToString(), coll["isrcpa"].ToString(), coll["routeWay"].ToString(), coll["activityString"].ToString(),
                    coll["flag"].ToString(), coll["tpDeviation"].ToString(), coll["cpDeviation"].ToString(), coll["entryMode"].ToString());

                if (isTrue)
                {
                    isTrue = InsertTravelledPlaces(coll["dcrDate"].ToString(), coll["intermediateData"].ToString(), coll["category"].ToString(), coll["flag"].ToString());
                }

                return isTrue;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult GetAccompanistPopUpData(FormCollection coll)
        {
            try
            {
                DataSet dsAcc = new DataSet();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsAcc = objData.ExecuteDataSet("exec SP_hdGetAllUserRegionData '" + objCurr.GetCompanyCode() + "','" + objCurr.GetRegionCode() + "','" + coll["matchingString"].ToString() + "'");
                }


                List<Models.DCRHeaderModel> lstAccompanist = new List<Models.DCRHeaderModel>();


                if (dsAcc.Tables.Count > 0)
                {
                    if (dsAcc.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[0];
                        lstAccompanist = (from item in dt.AsEnumerable()
                                          select new Models.DCRHeaderModel()
                                          {
                                              Accompanist_Name = item["Region_Name"].ToString() + "," + item["User_Name"].ToString() + "(" + item["User_Type_Name"].ToString() + ")",
                                              Accompanist_Region_Code = item["Region_Code"].ToString()
                                          }).ToList<Models.DCRHeaderModel>();
                    }
                }
                return Json(lstAccompanist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public LargeJsonResult GetSFCData(FormCollection coll)
        {
            try
            {
                DataSet dsSFC = new DataSet();
                List<Models.DCRHeaderModel> lstSFC = new List<Models.DCRHeaderModel>();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsSFC = objData.ExecuteDataSet("exec SP_hdGetSFCData '" + objCurr.GetCompanyCode() + "','" + coll["region"].ToString() + "'");
                }


                if (dsSFC.Tables.Count > 0)
                {
                    if (dsSFC.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsSFC.Tables[0];
                        lstSFC = (from item in dt.AsEnumerable()
                                  select new Models.DCRHeaderModel()
                                  {
                                      Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                      From_Place = item["From_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                      To_Place = item["To_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                      Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                      Travel_Mode = item["Travel_Mode"].ToString(),
                                      Category_Name = item["Category_Name"].ToString(),
                                      Region_Code = item["Region_Code"].ToString()
                                  }).ToList<Models.DCRHeaderModel>();
                    }
                }

                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstSFC.Count,
                        data = lstSFC
                    }
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public string GetActivityJSON()
        {
            string companyCode = objCurr.GetCompanyCode();
            string userCode = objCurr.GetUserCode();
            DataSet dsActivity = objSP.GetActivityMaster(companyCode, userCode);
             DataControl.JSONConverter json = new  DataControl.JSONConverter();
            return json.Serialize(dsActivity.Tables[0]);

        }
        #endregion Public Methods
    }
}
