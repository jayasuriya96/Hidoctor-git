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
using MVCModels;
using Newtonsoft.Json;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4HeaderController : Controller
    {
        #region Private Variables
        private CurrentInfo objCurr = new CurrentInfo();
        private BL_DCRHeader _objDCRBL = new BL_DCRHeader();

        private IConfigSettings IConfig_Settings = null;

        const string DCR_TIME_GAP_DEFAULT_VALUE = "5";
        #endregion private Variables

        #region System generated
        //
        // GET: /DCRV4Header/

        public ActionResult Index(string dcrDate, string dcrStatus, string isrcpa, string source, string flag)
        {
            ViewBag.category = _objDCRBL.GetCategory(objCurr.GetCompanyCode());
            ViewBag.dcrTimeGap = GetDCRTimeGap();

            Config_Settings objConfig = new Config_Settings();
            string displayDateFormate = objConfig.GetDateDisplayFormate(objCurr.GetCompanyCode());
            ViewBag.displayDate = Convert.ToDateTime(dcrDate).ToString(displayDateFormate);

            string[] viewArray = new string[5];
            viewArray[0] = dcrDate;
            viewArray[1] = dcrStatus;
            viewArray[2] = isrcpa;
            viewArray[3] = source;
            viewArray[4] = flag;

            ViewBag.viewArray = viewArray;
            ViewBag.regionCode = objCurr.GetRegionCode() + "," + objCurr.GetRegionName();

            ViewBag.CompanyCode = objCurr.GetCompanyCode();
            ViewBag.Region_Code = objCurr.GetRegionCode();
            ViewBag.UserCode = objCurr.GetUserCode();
            ViewBag.User_Name = objCurr.GetUserName();
            ViewBag.User_Type_Code = objCurr.GetUserTypeCode();
            ViewBag.Lattitude = objCurr.GetLattitude();
            ViewBag.Longitude = objCurr.GetLongitude();
            ViewBag.Location = objCurr.GetLocation();

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }
        }
        #endregion System generated

        #region Private Methods
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
        #endregion Private Methods

        #region Public Methods
        public LargeJsonResult GetHeaderDetails(FormCollection collection)
        {
            try
            {
                DataSet dsAutoFill = new DataSet();
                DataSet dsPreFill = new DataSet();
                DataTable dsExpenseMapping = new DataTable();
                DataTable dsAccomp = new DataTable();
                DataSet dsSFC = new DataSet();
                DataSet dsPrefillChangedAcc = new DataSet();

                string dcrStatus = collection["dcrStatus"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string source = collection["source"].ToString();
                string activityFlag = collection["flag"].ToString();
                string accName = string.Empty;
                string accRegion = string.Empty;

                string companyCode = objCurr.GetCompanyCode();
                string regionCode = objCurr.GetRegionCode();
                string userCode = objCurr.GetUserCode();
                string dcrCode = objCurr.GetDCRCode(dcrDate);
                string dataFrom = string.Empty;
                string accompName = string.Empty;
                int fullindexlen = 0;
                int accfullindxlen = 0;
                int AccOnlyForDocindex = 0;
                //string accomRegioncode = string.Empty;
                // string cpRegionCode = string.Empty;

                if (activityFlag != "A")
                {
                    // Accompanist Autofill details

                    dsAccomp = _objDCRBL.GetAccompanistDetails(companyCode, regionCode, dcrCode, userCode, dcrDate);

                    // Auto fill Cp and CP SFC
                    // dsAutoFill = _objDCRBL.GetHeaderAutofillData(companyCode, userCode, regionCode);                  
                }

                //WideAngle or TP or Drafted details
                dsPreFill = _objDCRBL.GetHeaderPrefillData(companyCode, userCode, dcrStatus, dcrDate, dcrCode, source, activityFlag);

                // Distance Edit 
                dsExpenseMapping = _objDCRBL.GetDistanceEditMappingNG(companyCode, dcrDate, userCode, regionCode);

                DataRow drAccomp = null;
                if (activityFlag != "A" && dsPreFill.Tables.Count > 0 && dsPreFill.Tables[0].Rows.Count > 0)
                    drAccomp = dsPreFill.Tables[0].Rows[0];

                // Drafted Accopanist and SFC details
                dsSFC = _objDCRBL.GetAccompanistCodeAndSFCData(companyCode, drAccomp, regionCode, objCurr.GetUserTypeCode(), dcrDate);

                //Auto fill cp and Drafted accompanist cp details
                if (activityFlag != "A")
                {
                    DataRow drAccompregion = null;
                    if (activityFlag != "A" && dsPreFill.Tables.Count > 0 && dsPreFill.Tables[0].Rows.Count > 0)
                        drAccompregion = dsPreFill.Tables[0].Rows[0];

                    dsAutoFill = _objDCRBL.GetAccompanistCodeAndCPData(companyCode, drAccompregion, regionCode, objCurr.GetUserTypeCode(), dcrDate);
                }



                List<DCRHeaderModel> lstPreFillData = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstIntermediate = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstAccompanist = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstCP = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstCPHOP = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstSFC = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstExpenseMapping = new List<DCRHeaderModel>();
                List<DCRAttendance> lstAttendance = new List<DCRAttendance>();
                List<DCRHeaderModel> lstTPDate_WAexists = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstTPWAIntermediate = new List<DCRHeaderModel>();
                List<string> lstMsg = new List<string>();
                List<Loggedinfullindex> lstfullindex = new List<Loggedinfullindex>();
                List<Loggedinfullindex> lstaccfullindx = new List<Loggedinfullindex>();
                List<Categorysetting> lstCategorysetting = new List<Categorysetting>();


                #region Accompanist Details
                if (activityFlag != "A" && dsAccomp.Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    lstAccompanist = (from item in dsAccomp.AsEnumerable()
                                      select new DCRHeaderModel()
                                      {
                                          Accompanist_Name = item["Region_Name"].ToString() + "," + item["User_Name"].ToString() + "(" + item["Employee_Name"].ToString() + "," + item["User_Type_Name"].ToString() + ")",
                                          Accompanist_Region_Code = item["Region_Code"].ToString(),
                                          Child_Count = item["Child_Count"].ToString()

                                      }).ToList<DCRHeaderModel>();
                }
                #endregion Accompanist Details

                #region Generate autoFill JSON
                if (dsAutoFill.Tables.Count > 1)
                {
                    // Cp data
                    if (dsAutoFill.Tables[0].Rows.Count > 0)
                    {
                        lstCP = (from item in dsAutoFill.Tables[0].AsEnumerable()
                                 select new DCRHeaderModel()
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
                                     Route_Way = item["Route_Way"].ToString(),
                                     SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                     SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                     SFC_Version_No = item["SFC_Version_No"].ToString()
                                 }).ToList<DCRHeaderModel>();
                    }

                    // Cp Hop data
                    if (dsAutoFill.Tables[1].Rows.Count > 0)
                    {
                        lstCPHOP = (from item in dsAutoFill.Tables[1].AsEnumerable()
                                    select new DCRHeaderModel()
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
                                        Route_Way = item["Route_Way"].ToString(),
                                        SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                        SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                        SFC_Version_No = item["SFC_Version_No"].ToString()
                                    }).ToList<DCRHeaderModel>();
                    }

                }
                #endregion Generate autoFill JSON

                #region Generate Prefill Json
                if (dsPreFill.Tables.Count > 0 && dsPreFill.Tables[0].Rows.Count > 0)
                {
                    dataFrom = dsPreFill.Tables[0].Rows[0]["Data_From"].ToString().ToUpper();
                    // for attendance
                    if (activityFlag.ToUpper() == "A")
                    {
                        if (dataFrom == "WA")
                        {
                            lstAttendance = (from item in dsPreFill.Tables[0].AsEnumerable()
                                             select new DCRAttendance()
                                             {
                                                 Activity_Name = item["Activity_Name"].ToString(),
                                                 Activity_Code = item["Activity_Code"].ToString(),
                                                 Project_Code = item["Project_Code"].ToString(),
                                                 Start_Time = item["Start_Time"].ToString(),
                                                 End_Time = item["End_Time"].ToString(),
                                                 Remarks = item["Remarks"].ToString(),
                                                 //Category = item["Entity_Code"].ToString(),
                                                 //Category_Name = item["Category"].ToString(),
                                                 Data_From = item["Data_From"].ToString(),
                                                 Start_Time_Main = item["User_Start_Time"].ToString(),
                                                 End_Time_Main = item["User_End_Time"].ToString(),
                                                 //Work_Place = item["Place_Worked"].ToString().ToUpper(),
                                             }).ToList<DCRAttendance>();
                        }

                        if (dataFrom == "TP")
                        {
                            lstAttendance = (from item in dsPreFill.Tables[0].AsEnumerable()
                                             select new DCRAttendance()
                                             {
                                                 Activity_Name = item["Activity_Name"].ToString(),
                                                 Activity_Code = item["Activity_Code"].ToString(),
                                                 Project_Code = item["Project_Code"].ToString(),
                                                 Start_Time = "",
                                                 End_Time = "",
                                                 Remarks = "",
                                                 Category = item["Expense_Entity_Code"].ToString(),
                                                 Category_Name = item["Expense_Entity_Name"].ToString(),
                                                 Data_From = item["Data_From"].ToString(),
                                                 Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", "")
                                             }).ToList<DCRAttendance>();

                            // Intermediate place
                            if (dsPreFill.Tables.Count > 1 && dsPreFill.Tables[1].Rows.Count > 0)
                            {
                                lstIntermediate = (from item in dsPreFill.Tables[1].AsEnumerable()
                                                   select new DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                       SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                       SFC_Version_No = item["SFC_Version_No"].ToString()
                                                   }).ToList<DCRHeaderModel>();

                            }
                        }
                       
                        #region drafted
                        if (dataFrom == "DRAFTED")
                        {
                            lstAttendance = (from item in dsPreFill.Tables[0].AsEnumerable()
                                             select new DCRAttendance()
                                             {
                                                 Activity_Name = item["Activity_Name"].ToString(),
                                                 Activity_Code = item["Activity_Code"].ToString(),
                                                 Project_Code = item["Project_Code"].ToString(),
                                                 Start_Time = item["Start_Time"].ToString(),
                                                 End_Time = item["End_Time"].ToString(),
                                                 Remarks = item["Remarks"].ToString(),
                                                 Category = item["Entity_Code"].ToString(),
                                                 Category_Name = item["Category"].ToString(),
                                                 Data_From = item["Data_From"].ToString(),

                                                 Work_Place = item["Place_Worked"].ToString().ToUpper(),
                                                 From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                 To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                 Travel_Mode = item["Travel_Mode"].ToString(),
                                                 Distance = (item["Travelled_Kms"] != System.DBNull.Value) ? Convert.ToDouble(item["Travelled_Kms"]).ToString("0.00") : "0.00",
                                                 Distance_Fare_Code = item["Distance_Fare_code"].ToString(),
                                                 Route_Way = item["Route_Way"].ToString(),
                                                 UnApprovalReason = item["Unapproval_Reason"].ToString(),
                                                 UnApproveBy = item["Approved_By"].ToString(),
                                                 Start_Time_Main = item["User_Start_Time"].ToString(),
                                                 End_Time_Main = item["User_End_Time"].ToString(),
                                                 SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                 SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                 SFC_Version_No = item["SFC_Version_No"].ToString()
                                             }).ToList<DCRAttendance>();

                            // Intermediate place
                            if (dsPreFill.Tables.Count > 1 && dsPreFill.Tables[1].Rows.Count > 0)
                            {
                                lstIntermediate = (from item in dsPreFill.Tables[1].AsEnumerable()
                                                   select new DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       Is_Route_Complete = item["Is_Route_Complete"].ToString(),
                                                       SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                       SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                       SFC_Version_No = item["SFC_Version_No"].ToString()
                                                   }).ToList<DCRHeaderModel>();

                            }
                        }
                        #endregion drafted
                    }
                    // for Field
                    else
                    {
                        DataRow dr;
                        dsPreFill.Tables[0].Columns.Add("Acc1_Code", typeof(string));
                        dsPreFill.Tables[0].Columns.Add("Acc2_Code", typeof(string));
                        dsPreFill.Tables[0].Columns.Add("Acc3_Code", typeof(string));
                        dsPreFill.Tables[0].Columns.Add("Acc4_Code", typeof(string));

                        #region Accompanist detail
                        if (dsSFC.Tables.Count > 1)
                        {
                            DataRow drAccompanist = dsPreFill.Tables[0].Rows[0];
                            DataTable dtAccompUser = dsSFC.Tables[1];
                            //dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc2_Name"].ToString())).FirstOrDefault();

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc1_Name"].ToString())))
                            {
                                //dr = dsSFC.Tables[1].Select("User_Name='" + drAccompanist["Acc1_Name"].ToString() + "'");
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc1_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                }
                                else
                                {
                                    dsPrefillChangedAcc = _objDCRBL.GetUserInfoByUserName(companyCode, drAccompanist["Acc1_Name"].ToString());
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    fullindexlen = lstfullindex[0].Full_index.Length;

                                    accName = drAccompanist["Acc1_Name"].ToString();
                                    if (dsPrefillChangedAcc.Tables[0].Rows.Count > 0)
                                    {
                                        accfullindxlen = dsPrefillChangedAcc.Tables[0].Rows[0]["Full_Index"].ToString().Length;
                                        if (fullindexlen > accfullindxlen)
                                        {
                                            if (dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() == "VACANT")
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = "";
                                                dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = "";
                                            }
                                            else
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                                dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                                lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                            }
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                        }
                                    }
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc1_Only_For_Doctor"].ToString())))
                            {

                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc1_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    string region_Code = dr["Region_Code"].ToString();
                                    lstaccfullindx = _objDCRBL.GetFullIndex(companyCode, region_Code);
                                    fullindexlen = lstfullindex[0].Full_index.Length;
                                    accfullindxlen = lstaccfullindx[0].Full_index.Length;


                                    if (fullindexlen > accfullindxlen)
                                    {
                                        if (dr["User_Name"].ToString() == "VACANT")
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = "";
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = "";
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                        }
                                    }
                                    else
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                        lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                    }

                                }

                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc2_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc2_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
                                }
                                else
                                {
                                    dsPrefillChangedAcc = _objDCRBL.GetUserInfoByUserName(companyCode, drAccompanist["Acc2_Name"].ToString());
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    fullindexlen = lstfullindex[0].Full_index.Length;

                                    accName = drAccompanist["Acc2_Name"].ToString();
                                    if (dsPrefillChangedAcc.Tables[0].Rows.Count > 0)
                                    {
                                        accfullindxlen = dsPrefillChangedAcc.Tables[0].Rows[0]["Full_Index"].ToString().Length;
                                        if (fullindexlen > accfullindxlen)
                                        {
                                            if (dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() == "VACANT")
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = "";
                                                dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = "";
                                            }
                                            else
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                                dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                                lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                            }
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                        }
                                    }
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc2_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc2_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    string region_Code = dr["Region_Code"].ToString();
                                    lstaccfullindx = _objDCRBL.GetFullIndex(companyCode, region_Code);
                                    fullindexlen = lstfullindex[0].Full_index.Length;
                                    accfullindxlen = lstaccfullindx[0].Full_index.Length;


                                    if (fullindexlen > accfullindxlen)
                                    {
                                        if (dr["User_Name"].ToString() == "VACANT")
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = "";
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = "";
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                        }
                                    }
                                    else
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
                                        lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                    }

                                }


                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc3_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc3_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                }
                                else
                                {
                                    dsPrefillChangedAcc = _objDCRBL.GetUserInfoByUserName(companyCode, drAccompanist["Acc3_Name"].ToString());

                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    fullindexlen = lstfullindex[0].Full_index.Length;


                                    accName = drAccompanist["Acc3_Name"].ToString();
                                    if (dsPrefillChangedAcc.Tables[0].Rows.Count > 0)
                                    {
                                        accfullindxlen = dsPrefillChangedAcc.Tables[0].Rows[0]["Full_Index"].ToString().Length;
                                        if (fullindexlen > accfullindxlen)
                                        {
                                            if (dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() == "VACANT")
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = "";
                                                dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = "";
                                            }
                                            else
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                                //  dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                                dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                                lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                            }
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                            //  dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                        }
                                    }
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc3_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc3_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    string region_Code = dr["Region_Code"].ToString();
                                    lstaccfullindx = _objDCRBL.GetFullIndex(companyCode, region_Code);
                                    fullindexlen = lstfullindex[0].Full_index.Length;
                                    accfullindxlen = lstaccfullindx[0].Full_index.Length;


                                    if (fullindexlen > accfullindxlen)
                                    {
                                        if (dr["User_Name"].ToString() == "VACANT")
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = "";
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = "";
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                        }
                                    }
                                    else
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                        lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                    }
                                }
                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc4_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc4_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
                                }
                                else
                                {
                                    dsPrefillChangedAcc = _objDCRBL.GetUserInfoByUserName(companyCode, drAccompanist["Acc4_Name"].ToString());

                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    fullindexlen = lstfullindex[0].Full_index.Length;


                                    accName = drAccompanist["Acc4_Name"].ToString();
                                    if (dsPrefillChangedAcc.Tables[0].Rows.Count > 0)
                                    {
                                        accfullindxlen = dsPrefillChangedAcc.Tables[0].Rows[0]["Full_Index"].ToString().Length;
                                        if (fullindexlen > accfullindxlen)
                                        {
                                            if (dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() == "VACANT")
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = "";
                                                dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = "";
                                            }
                                            else
                                            {
                                                dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                                dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                                lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                            }
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString() + "(" + dsPrefillChangedAcc.Tables[0].Rows[0]["Employee_Name"].ToString() + "," + dsPrefillChangedAcc.Tables[0].Rows[0]["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists(accName, dsPrefillChangedAcc.Tables[0].Rows[0]["User_Name"].ToString(), dsPrefillChangedAcc.Tables[0].Rows[0]["Region_Name"].ToString(), dcrStatus).ToString());
                                        }

                                    }
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc4_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc4_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    lstfullindex = _objDCRBL.GetFullIndex(companyCode, regionCode);
                                    string region_Code = dr["Region_Code"].ToString();
                                    lstaccfullindx = _objDCRBL.GetFullIndex(companyCode, region_Code);
                                    fullindexlen = lstfullindex[0].Full_index.Length;
                                    accfullindxlen = lstaccfullindx[0].Full_index.Length;


                                    if (fullindexlen > accfullindxlen)
                                    {
                                        if (dr["User_Name"].ToString() == "VACANT")
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = "";
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = "";
                                        }
                                        else
                                        {
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                            dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
                                            lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                        }
                                    }
                                    else
                                    {
                                        dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                        dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
                                        lstMsg.Add(getMessageForResignedAccompanists("VACANT", dr["User_Name"].ToString(), dr["Region_Name"].ToString(), dcrStatus));
                                    }
                                }
                            }

                        }
                        #endregion Accompanist detail

                        #region Wide Angle
                        // for WA user if any data found in WA, that will be taken
                        if (dataFrom == "WA")
                        {
                            lstPreFillData = (from item in dsPreFill.Tables[0].AsEnumerable()
                                              select new DCRHeaderModel()
                                              {
                                                  Acc1_Name = item["Acc1_Name"].ToString(),
                                                  Acc1_Code = item["Acc1_Code"].ToString(),
                                                  Acc2_Name = item["Acc2_Name"].ToString(),
                                                  Acc2_Code = item["Acc2_Code"].ToString(),
                                                  Acc3_Name = item["Acc3_Name"].ToString(),
                                                  Acc3_Code = item["Acc3_Code"].ToString(),
                                                  Acc4_Name = item["Acc4_Name"].ToString(),
                                                  Acc4_Code = item["Acc4_Code"].ToString(),
                                                  Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                                                  Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),
                                                  Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),
                                                  Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                  Acc1_Mode_Of_Entry = item["Acc1_Mode_Of_Entry"].ToString(),
                                                  Acc2_Mode_Of_Entry = item["Acc2_Mode_Of_Entry"].ToString(),
                                                  Acc3_Mode_Of_Entry = item["Acc3_Mode_Of_Entry"].ToString(),
                                                  Acc4_Mode_Of_Entry = item["Acc4_Mode_Of_Entry"].ToString(),
                                                  Data_From = item["Data_From"].ToString()
                                              }).ToList<DCRHeaderModel>();
                        }
                        #endregion  Wide Angle

                        #region tp
                        // For applied dcr, it will select the TP details if it is present.
                        else if (dataFrom == "TP")
                        {
                            lstPreFillData = (from item in dsPreFill.Tables[0].AsEnumerable()
                                              select new DCRHeaderModel()
                                              {
                                                  CP_Code = item["CP_Code"].ToString(),
                                                  CP_No = item["CP_Name"].ToString(),
                                                  Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                  Category_Name = item["Category"].ToString(),
                                                  Category = item["Expense_Entity_Code"].ToString(),
                                                  Acc1_Name = item["Acc1_Name"].ToString(),
                                                  Acc1_Code = item["Acc1_Code"].ToString(),
                                                  Acc2_Name = item["Acc2_Name"].ToString(),
                                                  Acc2_Code = item["Acc2_Code"].ToString(),
                                                  Acc3_Name = item["Acc3_Name"].ToString(),
                                                  Acc3_Code = item["Acc3_Code"].ToString(),
                                                  Acc4_Name = item["Acc4_Name"].ToString(),
                                                  Acc4_Code = item["Acc4_Code"].ToString(),
                                                  Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                                                  Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),
                                                  Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),
                                                  Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                  Acc1_Mode_Of_Entry = null,
                                                  Acc2_Mode_Of_Entry = null,
                                                  Acc3_Mode_Of_Entry = null,
                                                  Acc4_Mode_Of_Entry = null,
                                                  Tp_Code = item["TP_Code"].ToString(),
                                                  ProjectCode = item["Project_Code"].ToString(),
                                                  ActivityCode = item["Activity_Code"].ToString(),
                                                  CPDeviation = item["CP_Deviation"].ToString(),
                                                  Data_From = item["Data_From"].ToString(),
                                                  Region_Name = item["Region_Name"].ToString()
                                              }).ToList<DCRHeaderModel>();

                            // Intermediate place from tp-sfc
                            if (dsPreFill.Tables.Count > 1 && dsPreFill.Tables[1].Rows.Count > 0)
                            {

                                lstIntermediate = (from item in dsPreFill.Tables[1].AsEnumerable()
                                                   select new DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                       SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                       SFC_Version_No = item["SFC_Version_No"].ToString(),
                                                       Is_TP_SFC = "1"
                                                   }).ToList<DCRHeaderModel>();
                            }

                        }
                        #endregion tp

                        #region drafted
                        // For unapproved or drafted DCR, it will select the saved data from dcr master.
                        else if (dataFrom == "DRAFTED")
                        {

                            lstPreFillData = (from item in dsPreFill.Tables[0].AsEnumerable()
                                              select new DCRHeaderModel()
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
                                                  Acc1_Mode_Of_Entry = item["Acc1_Mode_Of_Entry"].ToString(),

                                                  Acc2_Name = item["Acc2_Name"].ToString(),
                                                  Acc2_Code = item["Acc2_Code"].ToString(),
                                                  Acc2_Start_Time = item["Acc2_Start_Time"].ToString(),
                                                  Acc2_End_Time = item["Acc2_End_Time"].ToString(),
                                                  Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),
                                                  Acc2_Mode_Of_Entry = item["Acc2_Mode_Of_Entry"].ToString(),

                                                  Acc3_Name = item["Acc3_Name"].ToString(),
                                                  Acc3_Code = item["Acc3_Code"].ToString(),
                                                  Acc3_Start_Time = item["Acc3_Time"].ToString(),
                                                  Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),
                                                  Acc3_Mode_Of_Entry = item["Acc3_Mode_Of_Entry"].ToString(),

                                                  Acc4_Name = item["Acc4_Name"].ToString(),
                                                  Acc4_Code = item["Acc4_Code"].ToString(),
                                                  Acc4_Start_Time = item["Acc4_Time"].ToString(),
                                                  Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                  Acc4_Mode_Of_Entry = item["Acc4_Mode_Of_Entry"].ToString(),

                                                  Category = item["Entity_Code"].ToString(),
                                                  Distance_Fare_Code = item["Distance_Fare_code"].ToString(),
                                                  Route_Way = item["Route_Way"].ToString(),
                                                  UnApprovalReason = item["Unapproval_Reason"].ToString(),
                                                  UnApproveBy = item["Approved_By"].ToString(),
                                                  TPDeviation = item["TP_Deviation"].ToString(),
                                                  CPDeviation = item["CP_Deviation"].ToString(),
                                                  Tp_Code = item["TP_Code"].ToString(),
                                                  Data_From = item["Data_From"].ToString(),
                                                  SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                  SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                  SFC_Version_No = item["SFC_Version_No"].ToString(),
                                                  Region_Name = item["Region_Name"].ToString()
                                              }).ToList<DCRHeaderModel>();

                            // Intermediate place
                            if (dsPreFill.Tables.Count > 1 && dsPreFill.Tables[1].Rows.Count > 0)
                            {
                                lstIntermediate = (from item in dsPreFill.Tables[1].AsEnumerable()
                                                   select new DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       Is_Route_Complete = item["Is_Route_Complete"].ToString(),
                                                       SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                       SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                       SFC_Version_No = item["SFC_Version_No"].ToString(),
                                                       Is_TP_SFC = item["Is_TP_SFC"].ToString()
                                                   }).ToList<DCRHeaderModel>();
                            }
                        }
                        #endregion drafted
                    }
                    lstCategorysetting = (from i in dsPreFill.Tables[2].AsEnumerable()
                                          select new Categorysetting()
                                          {
                                              Ischecked = Convert.ToInt16(i["Ischecked"].ToString()),
                                          }).ToList<Categorysetting>();
                }
                #endregion Generate Prefill Json

                #region Generate SFC Data
                // GENERATE MASTER  sfc data
                if (dsSFC.Tables.Count > 0 && dsSFC.Tables[0].Rows.Count > 0)
                {
                    lstSFC = (from item in dsSFC.Tables[0].AsEnumerable()
                              select new DCRHeaderModel()
                              {
                                  Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                  From_Place = item["From_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                  To_Place = item["To_Region_Name"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                  Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                  Travel_Mode = item["Travel_Mode"].ToString(),
                                  Category_Name = item["Category_Name"].ToString(),
                                  Region_Code = item["Region_Code"].ToString(),
                                  SFC_Version_No = item["SFC_Version_No"].ToString(),
                                  SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                  SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                  SFC_Visit_Count = item["SFC_Visit_Count"].ToString(),
                                  //    Distance_Edit = item["Distance_Edit"].ToString(),
                              }).ToList<DCRHeaderModel>();

                }
                #endregion Generate SFC Data

                #region Expense Mapping
                if (dsExpenseMapping.Rows.Count > 0)
                {
                    lstExpenseMapping = (from item in dsExpenseMapping.AsEnumerable()
                                         select new DCRHeaderModel()
                                         {
                                             Category = item["Expense_Entity_Code"].ToString(),
                                             Category_Name = item["Expense_Entity"].ToString(),
                                             SFC_Type = item["SFC_Type"].ToString(),
                                             Is_Prefill = item["Is_Prefill"].ToString(),
                                             Distance_Edit = item["Distance_Edit"].ToString()
                                         }).ToList<DCRHeaderModel>();
                }
                #endregion Expense Mapping

                #region TP data when WA exists
                if (dataFrom == "WA")
                {
                    DataSet dsTpData = new DataSet();
                    dsTpData = _objDCRBL.GetTPDetailsWhenWAExists(companyCode, userCode, dcrDate, activityFlag);

                    if (dsTpData.Tables.Count > 0 && dsTpData.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr;
                        dsTpData.Tables[0].Columns.Add("Acc1_Code", typeof(string));
                        dsTpData.Tables[0].Columns.Add("Acc2_Code", typeof(string));
                        dsTpData.Tables[0].Columns.Add("Acc3_Code", typeof(string));
                        dsTpData.Tables[0].Columns.Add("Acc4_Code", typeof(string));

                        #region Accompanist detail
                        if (dsSFC.Tables.Count > 1)
                        {
                            DataRow drAccompanist = dsTpData.Tables[0].Rows[0];
                            DataTable dtAccompUser = dsSFC.Tables[1];
                            //dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc2_Name"].ToString())).FirstOrDefault();

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc1_Name"].ToString())))
                            {
                                //dr = dsSFC.Tables[1].Select("User_Name='" + drAccompanist["Acc1_Name"].ToString() + "'");
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc1_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc1_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc1_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                }
                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc2_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc2_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc2_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc2_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
                                }
                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc3_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc3_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc3_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc3_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
                                }
                            }

                            if (!(string.IsNullOrEmpty(drAccompanist["Acc4_Name"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["User_Name"].ToString().Equals(drAccompanist["Acc4_Name"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc4_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc4_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsTpData.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["User_Type_Name"].ToString() + ")";
                                    dsTpData.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
                                }
                            }

                        }
                        #endregion Accompanist detail

                        lstTPDate_WAexists = (from item in dsTpData.Tables[0].AsEnumerable()
                                              select new DCRHeaderModel()
                                              {
                                                  CP_Code = item["CP_Code"].ToString(),
                                                  CP_No = item["CP_Name"].ToString(),
                                                  Work_Place = item["Work_Area"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                  Category_Name = item["Category"].ToString(),
                                                  Category = item["Expense_Entity_Code"].ToString(),
                                                  Acc1_Name = item["Acc1_Name"].ToString(),
                                                  Acc1_Code = item["Acc1_Code"].ToString(),
                                                  Acc2_Name = item["Acc2_Name"].ToString(),
                                                  Acc2_Code = item["Acc2_Code"].ToString(),
                                                  Acc3_Name = item["Acc3_Name"].ToString(),
                                                  Acc3_Code = item["Acc3_Code"].ToString(),
                                                  Acc4_Name = item["Acc4_Name"].ToString(),
                                                  Acc4_Code = item["Acc4_Code"].ToString(),
                                                  Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                                                  Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),
                                                  Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),
                                                  Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                                                  Acc1_Mode_Of_Entry = null,
                                                  Acc2_Mode_Of_Entry = null,
                                                  Acc3_Mode_Of_Entry = null,
                                                  Acc4_Mode_Of_Entry = null,
                                                  Tp_Code = item["TP_Code"].ToString(),
                                                  ProjectCode = item["Project_Code"].ToString(),
                                                  ActivityCode = item["Activity_Code"].ToString(),
                                                  CPDeviation = item["CP_Deviation"].ToString(),
                                                  Data_From = item["Data_From"].ToString(),
                                                  Region_Name = item["Region_Name"].ToString()
                                              }).ToList<DCRHeaderModel>();

                        // Intermediate place from tp-sfc
                        if (dsTpData.Tables.Count > 1 && dsTpData.Tables[1].Rows.Count > 0)
                        {

                            lstTPWAIntermediate = (from item in dsTpData.Tables[1].AsEnumerable()
                                                   select new DCRHeaderModel()
                                                   {
                                                       From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                                                       Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                                                       Travel_Mode = item["Travel_Mode"].ToString(),
                                                       Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                                       Route_Way = item["Route_Way"].ToString(),
                                                       SFC_Version_No = item["SFC_Version_No"].ToString(),
                                                       SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                                                       SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                                                   }).ToList<DCRHeaderModel>();
                        }
                    }
                }
                #endregion TP data when WA exists

                #region DoctorVisit and Doctor Accompanist detail
                List<DCRDoctorAccompanistModel> lstDoctorAccompanist = new List<DCRDoctorAccompanistModel>();
                if (activityFlag != "A")
                {
                    lstDoctorAccompanist = _objDCRBL.GetDoctorAccompanistDetails(objCurr.GetCompanyCode(), userCode, dcrDate, dcrCode, dataFrom);
                }
                #endregion DoctorVisit and Doctor Accompanist detail

                List<JsonResult> lstAutoFill = new List<JsonResult> { Json(lstAccompanist, JsonRequestBehavior.AllowGet),
                                                                      Json(lstCP, JsonRequestBehavior.AllowGet),
                                                                      Json(lstCPHOP, JsonRequestBehavior.AllowGet),
                                                                      Json(lstSFC, JsonRequestBehavior.AllowGet),
                                                                       Json(lstCategorysetting,JsonRequestBehavior.AllowGet)};

                List<JsonResult> lstPreFill = new List<JsonResult> { Json(lstPreFillData, JsonRequestBehavior.AllowGet),
                                                                     Json(lstIntermediate, JsonRequestBehavior.AllowGet) };

                List<JsonResult> lstWATP = new List<JsonResult>{Json(lstTPDate_WAexists, JsonRequestBehavior.AllowGet),
                                                              Json(lstTPWAIntermediate, JsonRequestBehavior.AllowGet)};

                List<JsonResult> lstHeaderDetails = new List<JsonResult>();
                if (activityFlag.ToUpper() != "A")
                {
                    lstHeaderDetails = new List<JsonResult> { Json(lstAutoFill, JsonRequestBehavior.AllowGet),
                                                              Json(lstPreFill, JsonRequestBehavior.AllowGet),
                                                              Json(lstExpenseMapping, JsonRequestBehavior.AllowGet),
                                                              Json(lstDoctorAccompanist, JsonRequestBehavior.AllowGet),
                                                              Json(lstWATP, JsonRequestBehavior.AllowGet),
                                                              Json(lstMsg, JsonRequestBehavior.AllowGet)};
                }
                else
                {
                    lstHeaderDetails = new List<JsonResult> { Json(lstAutoFill, JsonRequestBehavior.AllowGet),
                                                              Json(lstPreFill, JsonRequestBehavior.AllowGet),
                                                              Json(lstExpenseMapping, JsonRequestBehavior.AllowGet),
                                                              Json(lstAttendance, JsonRequestBehavior.AllowGet),
                                                              Json(lstWATP, JsonRequestBehavior.AllowGet), };

                }

                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstAutoFill.Count + lstPreFill.Count + lstExpenseMapping.Count + lstAttendance.Count + lstDoctorAccompanist.Count + lstWATP.Count + lstMsg.Count,
                        data = lstHeaderDetails
                    }
                };
            }
            catch (Exception ex)
            {
                string Message = ex.Message;
                string StackTrace = ex.StackTrace;
                string dcrDate = collection["dcrDate"].ToString();
                GetErrorDetails(Message, StackTrace, objCurr.GetUserCode(), dcrDate);
                throw ex;

            }
        }

        public int GetErrorDetails(string Message, string StackTrace, string usercode, string dcrDate)
        {
            return _objDCRBL.GetErrorDetails(Message, StackTrace, usercode, dcrDate);
        }

        public string getMessageForResignedAccompanists(string oldUserName, string newUserName, string regionName, string dcrStatus)
        {
            string message = string.Empty;

            if (dcrStatus == "1")
            {

                if ((oldUserName == "VACANT" || oldUserName == "NOT ASSIGNED") && (newUserName != "VACANT" && newUserName != "NOT ASSIGNED"))
                {
                    message = "During the TP creation, " + regionName + " was VACANT and " + newUserName + " has been assigned to this region recently. However, this call is marked as an independent call. You may modify it.";
                }
                else if ((oldUserName != "VACANT" && oldUserName != "NOT ASSIGNED") && (newUserName == "VACANT" || newUserName == "NOT ASSIGNED"))
                {
                    message = "During the TP creation, " + oldUserName + " was assigned to " + regionName + " region. As of now, it is VACANT. Hence, it is assumed that you are using this region only for doctor visits (i.e. Independent Call).";
                }
                else if ((oldUserName != "VACANT" && oldUserName != "NOT ASSIGNED") && (newUserName != "VACANT" && newUserName != "NOT ASSIGNED"))
                {
                    message = "During the TP creation, " + oldUserName + " was assigned to" + regionName + " region. However," + newUserName + " has been assigned to this region recently. Hence, it is assumed that you are accompanying " + newUserName + " for this doctor visits.";
                }
            }

            return message;
        }


        public bool InsertHeader(FormCollection coll)
        {
            try
            {
                bool isTrue = false;

                isTrue = _objDCRBL.InsertHeaderDetails(objCurr.GetCompanyCode(), objCurr.GetUserCode(), objCurr.GetRegionCode(), objCurr.GetDCRCode(coll["dcrDate"].ToString()), coll["dcrDate"].ToString(), coll["dcrStatus"].ToString(), coll["distanceFareCode"].ToString(), coll["category"].ToString(),
                    coll["categoryCode"].ToString(), coll["cpCode"].ToString(), coll["cpName"].ToString(), coll["workPlace"].ToString(), coll["fromPlace"].ToString(),
                    coll["toPlace"].ToString(), coll["travelMode"].ToString(), coll["distance"].ToString(), coll["startTime"].ToString(), coll["endTime"].ToString(),
                    coll["acc1Name"].ToString(), coll["acc1Type"].ToString(), coll["acc1StartTime"].ToString(), coll["acc1EndTime"].ToString(), coll["acc1OnlyDoctor"].ToString(), coll["acc1Mode"].ToString(),
                    coll["acc2Name"].ToString(), coll["acc2Type"].ToString(), coll["acc2StartTime"].ToString(), coll["acc2EndTime"].ToString(), coll["acc2OnlyDoctor"].ToString(), coll["acc2Mode"].ToString(),
                    coll["acc3Name"].ToString(), coll["acc3Time"].ToString(), coll["acc3OnlyDoctor"].ToString(), coll["acc3Mode"].ToString(),
                    coll["acc4Name"].ToString(), coll["acc4Time"].ToString(), coll["acc4OnlyDoctor"].ToString(), coll["acc4Mode"].ToString(),
                    coll["isrcpa"].ToString(), coll["routeWay"].ToString(), coll["activityString"].ToString(),
                    coll["flag"].ToString(), coll["tpDeviation"].ToString(), coll["cpDeviation"].ToString(), coll["entryMode"].ToString(), coll["dateFrom"].ToString(),
                    coll["sfcRegionCode"].ToString(), coll["sfcVersionNo"].ToString(), coll["sfcCategoryName"].ToString(),
                    objCurr.GetLattitude(), objCurr.GetLongitude(), objCurr.GetLocation(), Convert.ToBoolean(coll["dcr_Freeze"].ToString()), coll["_objDateDetails"].ToString(), Convert.ToInt32(coll["ISchecked"].ToString()));

                if (isTrue)
                {
                    isTrue = _objDCRBL.InsertTravelledPlaces(objCurr.GetCompanyCode(), objCurr.GetUserCode(), objCurr.GetDCRCode(coll["dcrDate"].ToString()), coll["dcrDate"].ToString(), coll["intermediateData"].ToString(), coll["category"].ToString(), coll["flag"].ToString());
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
                List<DCRHeaderModel> lstAccompanist = new List<DCRHeaderModel>();
                lstAccompanist = _objDCRBL.GetAllUserRegionData(objCurr.GetCompanyCode(), objCurr.GetRegionCode(), coll["matchingString"].ToString());
                return Json(lstAccompanist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public LargeJsonResult GetSFCData(FormCollection coll)
        {
            try
            {
                List<DCRHeaderModel> lstSFC = new List<DCRHeaderModel>();
                lstSFC = _objDCRBL.GetSFCData(objCurr.GetCompanyCode(), coll["region"].ToString(), coll["dcrDate"].ToString());
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
        }

        public string GetActivityJSON()
        {
            DataTable dtActivity = _objDCRBL.GetActivityMaster(objCurr.GetCompanyCode(), objCurr.GetUserCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return json.Serialize(dtActivity);
        }

        public string CheckSFCData(string sfcData, string dcrDate)
        {
            try
            {
                string result = string.Empty;
                string isChanged = string.Empty;
                JSONConverter objJson = new JSONConverter();

                List<MVCModels.DCRSFCModel> lstDetails = (List<MVCModels.DCRSFCModel>)JsonConvert.DeserializeObject(sfcData,
                        typeof(List<MVCModels.DCRSFCModel>));

                List<MVCModels.DCRSFCModel> lstDetailsNew = new List<DCRSFCModel>();
                lstDetailsNew = _objDCRBL.CheckSFCData(objCurr.GetCompanyCode(), lstDetails, dcrDate, out isChanged);

                //IEnumerable<MVCModels.DCRSFCModel> lstDiff = lstDetails.Except(lstDetailsNew);

                //// check if there is any difference
                //if (lstDiff != null && lstDiff.Count() > 0)
                //{
                //    isChanged = "Y";
                //}

                result = objJson.Serialize(lstDetailsNew) + "$" + isChanged;
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sfcData", sfcData);
                dicObj.Add("dcrDate", dcrDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }
        public string CheckSFCStatus(string intermediateDate, string dcrDate)
        {
            string result = string.Empty;
            try
            {
                List<SFCStatus> lstSFC = _objDCRBL.CheckSFCStatus(objCurr.GetCompanyCode(), intermediateDate, dcrDate);
                for (int i = 0; i < lstSFC.Count; i++)
                {
                    if (!(Convert.ToDateTime(lstSFC[i].Date_From) <= Convert.ToDateTime(dcrDate) && Convert.ToDateTime(lstSFC[i].Date_To) >= Convert.ToDateTime(dcrDate)))
                    {
                        result = "The SFC  From Place: " + lstSFC[i].From_Region_Name + " and To Place: " + lstSFC[i].To_Region_Name + " has been expired";
                        break;
                    }
                }
                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion Public Methods

        #region Added Cp for selected Accompanist
        /// <summary>
        /// Used to Get the Cp for selected Accompanist
        /// </summary>
        /// <param name="accomRegionCode"></param>
        /// <returns></returns>
        public JsonResult GetCpforAccompanist(string accomRegionCode)
        {
            List<MVCModels.AccomCPModel> lstCPforAccom = new List<MVCModels.AccomCPModel>();
            BL_DCRHeader _objDcrHeader = new BL_DCRHeader();
            DataControl.CurrentInfo _objcurr = new DataControl.CurrentInfo();
            lstCPforAccom = _objDcrHeader.GetCpforAccompanist(_objcurr.GetCompanyCode(), accomRegionCode);
            return Json(lstCPforAccom, JsonRequestBehavior.AllowGet);
        }
        #endregion Added Cp for selected Accompanist
        #region DCR Leave UnapprovalReason
        public string GetLeaveUnapprovalReason(string dcrDate)
        {
            DataControl.CurrentInfo _objcurr = new DataControl.CurrentInfo();
            return _objDCRBL.GetLeaveUnapprovalReason(Convert.ToDateTime(dcrDate), _objcurr.GetUserCode(), _objcurr.GetCompanyCode());
        }
        #endregion
        #region Add Accompanist in Doctor Visit
        public string RemoveAccompanist(string acc_id, string dcrDate, string acc_UserName, string acc_Region_Code)
        {
            return _objDCRBL.RemoveAccompanist(acc_id, Convert.ToDateTime(dcrDate), objCurr.GetUserCode(), objCurr.GetCompanyCode(), acc_UserName, acc_Region_Code);
        }
        public string InsertDoctorVisit(string lbl_acc_name, string dcrDate, string Is_Only_For_Doctor, string acc_index)
        {
            BL_DCRHeader _objDcrHeader = new BL_DCRHeader();
            var DCRDoctorAccompanistModel = new DCRDoctorAccompanistModel();
            string dcrCode = objCurr.GetDCRCode(dcrDate);
            DCRDoctorAccompanistModel.Acc_User_Name = lbl_acc_name.Split('(')[0].Split(',')[1];
            if (Is_Only_For_Doctor.ToUpper() == "Y")
                DCRDoctorAccompanistModel.Is_Accompanied_call = "NO";
            else
                DCRDoctorAccompanistModel.Is_Accompanied_call = "YES";
            DCRDoctorAccompanistModel.Is_Only_For_Doctor = Is_Only_For_Doctor;
            DCRDoctorAccompanistModel.Acc_User_Type_Name = lbl_acc_name.Split('(')[1].Replace(')', ' ');

            return _objDcrHeader.InsertDoctorVisit(objCurr.GetCompanyCode(), dcrCode, DCRDoctorAccompanistModel, acc_index);
        }
        public int GetDoctorVisitCount(string dcr_Date)
        {
            BL_DCRHeader _objDcrHeader = new BL_DCRHeader();
            string dcrCode = objCurr.GetDCRCode(dcr_Date);
            return _objDcrHeader.GetDoctorVisitCount(dcrCode, objCurr.GetCompanyCode());
        }
        public string BindDCRFreezeStatus(string dcr_Date)
        {
            BL_DCRHeader _objDcrHeader = new BL_DCRHeader();
            return _objDcrHeader.BindDCRFreezeStatus(Convert.ToDateTime(dcr_Date), objCurr.GetUserCode(), objCurr.GetCompanyCode());
        }
        #endregion
        #region SFCCountCheck
        public JsonResult CheckSFCCount(int distanceFareCode, DateTime dcr_Date)
        {
            BL_DCRHeader _objDcrHeader = new BL_DCRHeader();
            var jsConverter = new JSONConverter();
            return Json(jsConverter.Serialize(_objDcrHeader.CheckSFCCount(distanceFareCode, dcr_Date, objCurr.GetUserCode(), objCurr.GetCompanyCode())));
        }
        #endregion
        public int GetDoctorCount(string region_Code)
        {
            string companycode = objCurr.GetCompanyCode();

            return _objDCRBL.GetDoctorCount(companycode, region_Code);
        }
        public List<Loggedinfullindex> GetFullIndex()
        {
            string companycode = objCurr.GetCompanyCode();
            string region_Code = objCurr.GetRegionCode();
            return _objDCRBL.GetFullIndex(companycode, region_Code);
        }
        public string SingleDaySfcValidation(string data)
        {
            try
            {
                SfcValidationModel obj = JsonConvert.DeserializeObject<SfcValidationModel>(data);
                return _objDCRBL.SingleDaySfcValidation(obj);
            }
            catch(Exception ex)
            {
                throw ex;
            }          
        }
        public int GetCategorySetting(string Category_Code,string dcrDate)
        {
            string User_Type_Code = objCurr.GetUserTypeCode();
            return _objDCRBL.GetCategorySetting(Category_Code, User_Type_Code, dcrDate);
        }
    }
}
